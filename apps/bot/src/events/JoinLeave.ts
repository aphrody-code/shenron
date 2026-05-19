import { injectable, inject } from "tsyringe";
import { Bot, Discord, On, Once, type ArgsOf } from "@rpbey/discordx";
import type { Client, Guild, GuildMember } from "discord.js";
import { LogService } from "~/services/LogService";
import { InviteTracker } from "~/services/InviteTracker";
import { MessageTemplateService } from "~/services/MessageTemplateService";
import { SettingsService } from "~/services/SettingsService";
import { DatabaseService } from "~/db/index";
import { users, invitesLog } from "~/db/schema";
import { eq } from "drizzle-orm";
import { AUTO_ROLE_ID } from "~/lib/constants";

@Discord()
@Bot("grandPretre")
@injectable()
export class JoinLeaveEvent {
  constructor(
    @inject(LogService) private logs: LogService,
    @inject(InviteTracker) private invites: InviteTracker,
    @inject(DatabaseService) private dbs: DatabaseService,
    @inject(MessageTemplateService) private msg: MessageTemplateService,
    @inject(SettingsService) private settings: SettingsService,
  ) {}

  @Once({ event: "clientReady" })
  async init([client]: [Client]) {
    for (const g of client.guilds.cache.values()) {
      await this.invites.sync(g);
      await this.backfillAutoRole(g);
    }
  }

  @On({ event: "inviteCreate" })
  async onInviteCreate([invite]: ArgsOf<"inviteCreate">) {
    if (invite.guild) await this.invites.sync(invite.guild as import("discord.js").Guild);
  }

  @On({ event: "inviteDelete" })
  async onInviteDelete([invite]: ArgsOf<"inviteDelete">) {
    if (invite.guild) await this.invites.sync(invite.guild as import("discord.js").Guild);
  }

  @On({ event: "guildMemberAdd" })
  async onJoin([member]: ArgsOf<"guildMemberAdd">) {
    // 🎯 Sync structurel : tout nouveau membre Discord = row users immediate
    await this.dbs.db
      .insert(users)
      .values({ id: member.id })
      .onConflictDoNothing();

    await this.assignAutoRole(member);
    const detected = await this.invites.detectInviter(member.guild);
    // Persiste la paire inviter→invited pour /invitations (best-effort).
    await this.dbs.db
      .insert(invitesLog)
      .values({
        userId: member.id,
        inviterId: detected.inviterId,
        code: detected.code,
      })
      .catch(() => {});
    const embed = this.logs
      .makeEmbed("Nouveau membre", 0x22c55e)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: "Membre", value: `${member} (${member.id})`, inline: true },
        { name: "Compte créé", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Invité par", value: detected.inviterId ? `<@${detected.inviterId}> (code ${detected.code})` : "Inconnu" },
      );
    await this.logs.send(member.client, "joinLeave", embed);

    // Annonce publique (templatable depuis /messages du dashboard).
    await this.msg.publish(
      "welcome",
      {
        user: `<@${member.id}>`,
        userName: member.user.username,
        userId: member.id,
        guildName: member.guild.name,
        memberCount: member.guild.memberCount,
        inviter: detected.inviterId ? `<@${detected.inviterId}>` : "—",
      },
      member.client,
    );
  }

  private async assignAutoRole(member: GuildMember): Promise<boolean> {
    if (member.user.bot) return false;
    // Setting `role.auto_join` override la constante AUTO_ROLE_ID — l'admin
    // peut désactiver le feature en ne configurant rien (et la const fallback
    // est aussi un placeholder valide que l'admin peut remplacer).
    const roleId = (await this.settings.getSnowflake("role.auto_join")) ?? AUTO_ROLE_ID;
    if (!roleId) return false;
    if (member.roles.cache.has(roleId)) return false;
    const role = member.guild.roles.cache.get(roleId) ?? (await member.guild.roles.fetch(roleId).catch(() => null));
    if (!role) return false;
    const me = member.guild.members.me;
    if (me && role.position >= me.roles.highest.position) return false;
    try {
      await member.roles.add(role, "Auto-role Shenron");
      return true;
    } catch {
      return false;
    }
  }

  private async backfillAutoRole(guild: Guild): Promise<void> {
    try {
      await guild.members.fetch();
    } catch {
      return;
    }
    let granted = 0;
    for (const member of guild.members.cache.values()) {
      if (await this.assignAutoRole(member)) granted++;
    }
    if (granted > 0) {
      console.log(`[auto-role] ${granted} membre(s) ont reçu le rôle auto-join sur ${guild.name}`);
    }
  }

  @On({ event: "guildMemberRemove" })
  async onLeave([member]: ArgsOf<"guildMemberRemove">) {
    const embed = this.logs
      .makeEmbed("Départ", 0xef4444)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: "Membre", value: `${member.user.username} (${member.id})`, inline: true },
        {
          name: "A rejoint",
          value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "—",
          inline: true,
        },
      );
    await this.logs.send(member.client, "joinLeave", embed);

    // Annonce publique départ (templatable).
    await this.msg.publish(
      "farewell",
      {
        userName: member.user.username,
        userId: member.id,
        memberCount: member.guild.memberCount,
      },
      member.client,
    );
  }

  /**
   * 🎯 Sync structurel : quand les rôles d'un membre changent, on re-dérive
   * son `lastLevelReached` + `currentLevelRoleId` en se basant sur le plus
   * haut rôle level-reward qu'il possède. Évite la dérive DB ↔ Discord.
   */
  @On({ event: "guildMemberUpdate" })
  async onUpdate([oldM, newM]: ArgsOf<"guildMemberUpdate">) {
    if (oldM.partial) return;
    const oldRoles = new Set(oldM.roles.cache.keys());
    const newRoles = new Set(newM.roles.cache.keys());
    // Diff
    const added = [...newRoles].filter((r) => !oldRoles.has(r));
    const removed = [...oldRoles].filter((r) => !newRoles.has(r));
    if (added.length === 0 && removed.length === 0) return;

    const rewards = await this.dbs.db.query.levelRewards.findMany();
    const rewardByRole = new Map(rewards.map((r) => [r.roleId, r]));
    const touched = [...added, ...removed].some((r) => rewardByRole.has(r));
    if (!touched) return; // aucun changement sur les rôles level

    // Recalcule le plus haut palier détenu
    let best: { level: number; roleId: string; xpThreshold: number } | null = null;
    for (const rid of newRoles) {
      const lr = rewardByRole.get(rid);
      if (lr && (!best || lr.level > best.level)) {
        best = { level: lr.level, roleId: lr.roleId, xpThreshold: lr.xpThreshold };
      }
    }

    await this.dbs.db
      .insert(users)
      .values({
        id: newM.id,
        lastLevelReached: best?.level ?? 0,
        currentLevelRoleId: best?.roleId ?? null,
        ...(best ? { xp: best.xpThreshold } : {}),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          lastLevelReached: best?.level ?? 0,
          currentLevelRoleId: best?.roleId ?? null,
          updatedAt: new Date(),
        },
      });
  }
}
