import { injectable, inject } from "tsyringe";
import { Discord, On, Once, type ArgsOf } from "@rpbey/discordx";
import type { Client } from "discord.js";
import { LogService } from "~/services/LogService";
import { InviteTracker } from "~/services/InviteTracker";
import { DatabaseService } from "~/db/index";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";

@Discord()
@injectable()
export class JoinLeaveEvent {
  constructor(
    @inject(LogService) private logs: LogService,
    @inject(InviteTracker) private invites: InviteTracker,
    @inject(DatabaseService) private dbs: DatabaseService,
  ) {}

  @Once({ event: "ready" })
  async init([client]: [Client]) {
    for (const g of client.guilds.cache.values()) {
      await this.invites.sync(g);
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
    const detected = await this.invites.detectInviter(member.guild);
    const embed = this.logs
      .makeEmbed("Nouveau membre", 0x22c55e)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: "Membre", value: `${member} (${member.id})`, inline: true },
        { name: "Compte créé", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Invité par", value: detected.inviterId ? `<@${detected.inviterId}> (code ${detected.code})` : "Inconnu" },
      );
    await this.logs.send(member.client, "joinLeave", embed);
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

    // À la sortie du serveur on vide le profil niveau (cdc)
    await this.dbs.db.delete(users).where(eq(users.id, member.id));
  }
}
