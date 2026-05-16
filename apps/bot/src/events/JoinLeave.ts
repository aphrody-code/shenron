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

    // À la sortie du serveur on vide le profil niveau (cdc)
    await this.dbs.db.delete(users).where(eq(users.id, member.id));
  }
}
