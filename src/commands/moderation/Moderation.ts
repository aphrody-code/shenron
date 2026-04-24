import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, SlashChoice, Guard } from "@rpbey/discordx";
import {
  ApplicationCommandOptionType,
  type CommandInteraction,
  type GuildMember,
  type User,
  type TextChannel,
  PermissionFlagsBits,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";
import { ModOnly } from "~/guards/ModOnly";
import { AdminOnly } from "~/guards/AdminOnly";
import { GuildOnly } from "~/guards/GuildOnly";
import { ModerationService } from "~/services/ModerationService";
import { LogService } from "~/services/LogService";
import dayjs from "dayjs";

function parseDuration(input?: string): number | undefined {
  if (!input) return undefined;
  const m = input.match(/^(\d+)\s*([smhdw])$/i);
  if (!m) return undefined;
  const n = parseInt(m[1]!, 10);
  const unit = m[2]!.toLowerCase();
  const mult = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 }[unit] ?? 0;
  return n * mult;
}

@Discord()
@Guard(GuildOnly)
@injectable()
export class ModerationCommands {
  constructor(
    @inject(ModerationService) private mod: ModerationService,
    @inject(LogService) private logs: LogService,
  ) {}

  // /warn
  @Slash({ name: "warn", description: "Avertir un membre", defaultMemberPermissions: PermissionFlagsBits.ModerateMembers })
  @Guard(ModOnly)
  async warn(
    @SlashOption({ name: "membre", description: "Membre à avertir", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    await this.mod.addWarn(target.id, interaction.user.id, reason);
    const count = await this.mod.countWarns(target.id);
    await interaction.reply({ content: `⚠️ ${target} averti (${count} warn actifs). Raison : ${reason ?? "n/a"}` });

    const embed = this.logs.makeEmbed("Warn", 0xfbbf24)
      .addFields(
        { name: "Membre", value: `${target} (${target.id})`, inline: true },
        { name: "Modérateur", value: `<@${interaction.user.id}>`, inline: true },
        { name: "Raison", value: reason ?? "n/a" },
        { name: "Total warn", value: String(count), inline: true },
      );
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // /unwarn
  @Slash({ name: "unwarn", description: "Retirer le dernier warn d'un membre", defaultMemberPermissions: PermissionFlagsBits.ModerateMembers })
  @Guard(ModOnly)
  async unwarn(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    interaction: CommandInteraction,
  ) {
    const ok = await this.mod.removeLastWarn(target.id);
    await interaction.reply({
      content: ok ? `✅ Dernier warn retiré à ${target}.` : `Aucun warn actif pour ${target}.`,
      flags: ok ? undefined : MessageFlags.Ephemeral,
    });
  }

  // /mute (on utilise le timeout natif Discord)
  @Slash({ name: "mute", description: "Mute (timeout) un membre", defaultMemberPermissions: PermissionFlagsBits.ModerateMembers })
  @Guard(ModOnly)
  async mute(
    @SlashOption({ name: "membre", description: "Membre à mute", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    @SlashOption({ name: "duree", description: "Durée (ex: 10m, 1h, 1d)", type: ApplicationCommandOptionType.String, required: true })
    duration: string,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const ms = parseDuration(duration);
    if (!ms || ms < 1_000 || ms > 28 * 86_400_000) {
      await interaction.reply({ content: "Durée invalide (max 28d). Format: 10m / 1h / 1d", flags: MessageFlags.Ephemeral });
      return;
    }
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: "Membre introuvable.", flags: MessageFlags.Ephemeral });
      return;
    }
    await member.timeout(ms, reason).catch(() => {});
    await this.mod.log("MUTE", target.id, interaction.user.id, reason, { durationMs: ms });
    await interaction.reply({ content: `🔇 ${target} mute jusqu'à ${dayjs().add(ms, "ms").format("YYYY-MM-DD HH:mm")}.` });

    const embed = this.logs.makeEmbed("Mute", 0xf87171)
      .addFields(
        { name: "Membre", value: `${target}`, inline: true },
        { name: "Durée", value: duration, inline: true },
        { name: "Raison", value: reason ?? "n/a" },
      );
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // /unmute
  @Slash({ name: "unmute", description: "Retirer le mute d'un membre", defaultMemberPermissions: PermissionFlagsBits.ModerateMembers })
  @Guard(ModOnly)
  async unmute(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: "Membre introuvable.", flags: MessageFlags.Ephemeral });
      return;
    }
    await member.timeout(null, reason ?? "manual unmute").catch(() => {});
    await this.mod.log("UNMUTE", target.id, interaction.user.id, reason);
    await interaction.reply({ content: `🔊 ${target} démute.` });
  }

  // /jail
  @Slash({ name: "jail", description: "Envoyer un membre en jail", defaultMemberPermissions: PermissionFlagsBits.ModerateMembers })
  @Guard(ModOnly)
  async jail(
    @SlashOption({ name: "membre", description: "Membre à jail", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    @SlashOption({ name: "duree", description: "Durée optionnelle (ex: 1h)", type: ApplicationCommandOptionType.String, required: false })
    duration: string | undefined,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: "Membre introuvable.", flags: MessageFlags.Ephemeral });
      return;
    }
    const ms = parseDuration(duration);
    try {
      await this.mod.jail(member, interaction.user.id, reason, ms);
    } catch (err) {
      await interaction.reply({ content: `Erreur : ${(err as Error).message}`, flags: MessageFlags.Ephemeral });
      return;
    }
    await interaction.reply({ content: `🔒 ${target} jailé${duration ? ` (${duration})` : ""}.` });

    const embed = this.logs.makeEmbed("Jail", 0xef4444)
      .addFields(
        { name: "Membre", value: `${target}`, inline: true },
        { name: "Durée", value: duration ?? "Indéfinie", inline: true },
        { name: "Raison", value: reason ?? "n/a" },
      );
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // /unjail
  @Slash({ name: "unjail", description: "Libérer un membre de jail", defaultMemberPermissions: PermissionFlagsBits.ModerateMembers })
  @Guard(ModOnly)
  async unjail(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const ok = await this.mod.unjail(interaction.guild, target.id, interaction.user.id, reason);
    await interaction.reply({
      content: ok ? `🔓 ${target} libéré.` : "Membre introuvable.",
      flags: ok ? undefined : MessageFlags.Ephemeral,
    });
  }

  // /ban
  @Slash({ name: "ban", description: "Bannir un membre", defaultMemberPermissions: PermissionFlagsBits.BanMembers })
  async ban(
    @SlashOption({ name: "membre", description: "Membre à ban", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ content: "Permission insuffisante.", flags: MessageFlags.Ephemeral });
      return;
    }
    try {
      await interaction.guild.members.ban(target.id, { reason: reason ?? `by ${interaction.user.username}` });
      await this.mod.log("BAN", target.id, interaction.user.id, reason);
      await interaction.reply({ content: `🔨 ${target.username} banni.` });

      const embed = this.logs.makeEmbed("Ban", 0x991b1b)
        .addFields({ name: "Membre", value: `${target.username} (${target.id})` }, { name: "Raison", value: reason ?? "n/a" });
      await this.logs.send(interaction.client, "sanction", embed);
    } catch (err) {
      await interaction.reply({ content: `Erreur : ${(err as Error).message}`, flags: MessageFlags.Ephemeral });
    }
  }

  // /unban
  @Slash({ name: "unban", description: "Débannir un utilisateur", defaultMemberPermissions: PermissionFlagsBits.BanMembers })
  async unban(
    @SlashOption({ name: "userid", description: "ID utilisateur", type: ApplicationCommandOptionType.String, required: true })
    userId: string,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ content: "Permission insuffisante.", flags: MessageFlags.Ephemeral });
      return;
    }
    try {
      await interaction.guild.members.unban(userId, reason ?? `by ${interaction.user.username}`);
      await this.mod.log("UNBAN", userId, interaction.user.id, reason);
      await interaction.reply({ content: `✅ <@${userId}> débanni.` });
    } catch (err) {
      await interaction.reply({ content: `Erreur : ${(err as Error).message}`, flags: MessageFlags.Ephemeral });
    }
  }

  // /kick
  @Slash({ name: "kick", description: "Expulser un membre", defaultMemberPermissions: PermissionFlagsBits.KickMembers })
  async kick(
    @SlashOption({ name: "membre", description: "Membre à kick", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ content: "Permission insuffisante.", flags: MessageFlags.Ephemeral });
      return;
    }
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: "Membre introuvable.", flags: MessageFlags.Ephemeral });
      return;
    }
    await member.kick(reason ?? `by ${interaction.user.username}`).catch(() => {});
    await this.mod.log("KICK", target.id, interaction.user.id, reason);
    await interaction.reply({ content: `👢 ${target.username} expulsé.` });
  }

  // /clear
  @Slash({ name: "clear", description: "Supprimer un nombre de messages", defaultMemberPermissions: PermissionFlagsBits.ManageMessages })
  async clear(
    @SlashOption({ name: "nombre", description: "Nombre (1-100)", type: ApplicationCommandOptionType.Integer, required: true, minValue: 1, maxValue: 100 })
    amount: number,
    @SlashOption({ name: "membre", description: "Filtrer par auteur", type: ApplicationCommandOptionType.User, required: false })
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.channel?.isTextBased() || !("bulkDelete" in interaction.channel)) {
      await interaction.reply({ content: "Non supporté ici.", flags: MessageFlags.Ephemeral });
      return;
    }
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const messages = await (interaction.channel as TextChannel).messages.fetch({ limit: target ? 100 : amount });
    const filtered = target ? messages.filter((m) => m.author.id === target.id).first(amount) : messages.first(amount);
    const toDelete = Array.isArray(filtered) ? filtered : [...filtered];
    const deleted = await (interaction.channel as TextChannel).bulkDelete(toDelete, true);
    await this.mod.log("PURGE", null, interaction.user.id, undefined, { count: deleted.size, target: target?.id });
    await interaction.editReply({ content: `🧹 ${deleted.size} messages supprimés.` });
  }

  // /stats
  @Slash({ name: "stats", description: "Voir les stats d'un membre" })
  async stats(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: false })
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    const user = target ?? interaction.user;
    const warnCount = await this.mod.countWarns(user.id);
    const jail = await this.mod.getActiveJail(user.id);
    const embed = new EmbedBuilder()
      .setTitle(`Stats de ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Warns actifs", value: String(warnCount), inline: true },
        { name: "Jailed", value: jail ? "Oui" : "Non", inline: true },
      )
      .setColor(0x60a5fa);
    await interaction.reply({ embeds: [embed] });
  }

  // /sstats
  @Slash({ name: "sstats", description: "Stats du serveur", defaultMemberPermissions: PermissionFlagsBits.Administrator })
  @Guard(AdminOnly)
  async sstats(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;
    const g = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle(`Stats — ${g.name}`)
      .setThumbnail(g.iconURL() ?? null)
      .addFields(
        { name: "Membres", value: String(g.memberCount), inline: true },
        { name: "Canaux", value: String(g.channels.cache.size), inline: true },
        { name: "Rôles", value: String(g.roles.cache.size), inline: true },
        { name: "Boosts", value: String(g.premiumSubscriptionCount ?? 0), inline: true },
        { name: "Créé le", value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true },
      )
      .setColor(0xfbbf24);
    await interaction.reply({ embeds: [embed] });
  }

  // /role
  @Slash({ name: "role", description: "Donner/retirer un rôle", defaultMemberPermissions: PermissionFlagsBits.ManageRoles })
  async role(
    @SlashChoice({ name: "give", value: "give" })
    @SlashChoice({ name: "remove", value: "remove" })
    @SlashOption({ name: "action", description: "give/remove", type: ApplicationCommandOptionType.String, required: true })
    action: "give" | "remove",
    @SlashOption({ name: "role", description: "Rôle", type: ApplicationCommandOptionType.Role, required: true })
    role: import("discord.js").Role,
    @SlashOption({ name: "membre", description: "Cible (vide = @everyone si Administrator)", type: ApplicationCommandOptionType.User, required: false })
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({ content: "Permission insuffisante.", flags: MessageFlags.Ephemeral });
      return;
    }
    if (target) {
      const member = await interaction.guild.members.fetch(target.id).catch(() => null);
      if (!member) {
        await interaction.reply({ content: "Membre introuvable.", flags: MessageFlags.Ephemeral });
        return;
      }
      if (action === "give") await member.roles.add(role.id).catch(() => {});
      else await member.roles.remove(role.id).catch(() => {});
      await interaction.reply({ content: `✅ ${action === "give" ? "Donné" : "Retiré"} ${role} à ${target}.` });
    } else {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({ content: "Action globale réservée aux admins.", flags: MessageFlags.Ephemeral });
        return;
      }
      await interaction.deferReply();
      const members = await interaction.guild.members.fetch();
      let ok = 0;
      for (const m of members.values()) {
        try {
          if (action === "give") await m.roles.add(role.id);
          else await m.roles.remove(role.id);
          ok++;
        } catch {}
      }
      await interaction.editReply({ content: `✅ ${action === "give" ? "Donné" : "Retiré"} ${role} à ${ok} membres.` });
    }
  }
}
