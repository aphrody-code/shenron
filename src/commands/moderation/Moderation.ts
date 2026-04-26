import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, SlashChoice, Guard } from "@rpbey/discordx";
import { userTransformer } from "~/lib/slash-user";
import {
  ApplicationCommandOptionType,
  ChannelType,
  type CommandInteraction,
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
import { sanctionEmbed, brandedEmbed, errorEmbed, successEmbed, warningEmbed } from "~/lib/embeds";
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

function formatDuration(ms: number): string {
  if (ms >= 86_400_000) return `${Math.round(ms / 86_400_000)}j`;
  if (ms >= 3_600_000) return `${Math.round(ms / 3_600_000)}h`;
  if (ms >= 60_000) return `${Math.round(ms / 60_000)}min`;
  return `${Math.round(ms / 1_000)}s`;
}

/**
 * DM le membre sanctionné en best-effort. Silence les erreurs (DM fermés,
 * blocked, bot bloqué…) — la sanction reste appliquée même si la notif échoue.
 * Retourne true si le DM est arrivé.
 */
async function notifyMember(
  target: User,
  embed: EmbedBuilder,
): Promise<boolean> {
  try {
    await target.send({ embeds: [embed] });
    return true;
  } catch {
    return false;
  }
}

@Discord()
@Guard(GuildOnly)
@injectable()
export class ModerationCommands {
  constructor(
    @inject(ModerationService) private mod: ModerationService,
    @inject(LogService) private logs: LogService,
  ) {}

  // ────────────────────────────── /warn
  @Slash({ name: "warn", description: "Avertir un membre" })
  @Guard(ModOnly)
  async warn(
    @SlashOption({ name: "membre", description: "Membre à avertir", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (target.bot) {
      await interaction.reply({
        embeds: [errorEmbed("Cible invalide", "Impossible d'avertir un bot.")],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    await this.mod.addWarn(target.id, interaction.user.id, reason);
    const count = await this.mod.countWarns(target.id);

    const embed = sanctionEmbed({
      target,
      moderator: interaction.user,
      action: "warn",
      reason,
    }).addFields({ name: "Total warns actifs", value: String(count), inline: true });

    const dmOk = await notifyMember(
      target,
      brandedEmbed({
        title: "⚠️ Avertissement reçu",
        description: `Tu as reçu un avertissement sur **${interaction.guild?.name ?? "le serveur"}**.\n\nMotif : ${reason ?? "*(non précisé)*"}`,
        kind: "warning",
        footer: `Tu as ${count} avertissement(s) actif(s).`,
      }),
    );

    await interaction.reply({
      embeds: [embed.addFields({ name: "DM", value: dmOk ? "✅ envoyé" : "❌ DM fermés", inline: true })],
    });
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // ────────────────────────────── /unwarn
  @Slash({ name: "unwarn", description: "Retirer le dernier warn d'un membre" })
  @Guard(ModOnly)
  async unwarn(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    interaction: CommandInteraction,
  ) {
    const ok = await this.mod.removeLastWarn(target.id);
    await interaction.reply({
      embeds: [
        ok
          ? successEmbed("Warn retiré", `Dernier avertissement retiré à <@${target.id}>.`)
          : warningEmbed("Aucun warn actif", `<@${target.id}> n'a aucun avertissement actif.`),
      ],
      flags: ok ? undefined : MessageFlags.Ephemeral,
    });
  }

  // ────────────────────────────── /warns
  @Slash({ name: "warns", description: "Lister les avertissements actifs d'un membre" })
  @Guard(ModOnly)
  async warns(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    interaction: CommandInteraction,
  ) {
    const list = await this.mod.listActiveWarns(target.id);
    if (list.length === 0) {
      await interaction.reply({
        embeds: [brandedEmbed({ title: "📋 Avertissements", description: `Aucun avertissement actif pour <@${target.id}>.`, kind: "muted" })],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const embed = brandedEmbed({
      title: `📋 Avertissements de ${target.username}`,
      description: `**${list.length}** avertissement(s) actif(s)`,
      kind: "warning",
    }).addFields(
      list.slice(0, 25).map((w) => ({
        name: `#${w.id} · <t:${Math.floor(w.createdAt.getTime() / 1000)}:R>`,
        value: `Mod : <@${w.moderatorId}>\nMotif : ${w.reason ?? "*(n/a)*"}`,
      })),
    );
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }

  // ────────────────────────────── /clearwarns
  @Slash({ name: "clearwarns", description: "Purger TOUS les avertissements actifs d'un membre (admin)" })
  @Guard(AdminOnly)
  async clearwarns(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "raison", description: "Raison de la purge", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    const n = await this.mod.clearWarns(target.id, interaction.user.id);
    await interaction.reply({
      embeds: [
        n > 0
          ? successEmbed("Warns purgés", `**${n}** avertissement(s) actif(s) supprimé(s) pour <@${target.id}>.${reason ? `\n\nRaison : ${reason}` : ""}`)
          : warningEmbed("Aucun warn actif", `<@${target.id}> n'a aucun avertissement à purger.`),
      ],
    });
  }

  // ────────────────────────────── /mute
  @Slash({ name: "mute", description: "Mute (timeout Discord) un membre" })
  @Guard(ModOnly)
  async mute(
    @SlashOption({ name: "membre", description: "Membre à mute", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "duree", description: "Durée (ex: 10m, 1h, 1d) — max 28d", type: ApplicationCommandOptionType.String, required: true })
    duration: string,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const ms = parseDuration(duration);
    if (!ms || ms < 1_000 || ms > 28 * 86_400_000) {
      await interaction.reply({
        embeds: [errorEmbed("Durée invalide", "Format attendu : `10m`, `1h`, `1d`. Maximum **28 jours** (limite Discord).")],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ embeds: [errorEmbed("Membre introuvable")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (!member.moderatable) {
      await interaction.reply({
        embeds: [errorEmbed("Permissions insuffisantes", `Le bot ne peut pas timeout ${target} (rôle plus haut ou perm absente).`)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      await member.timeout(ms, reason ?? `by ${interaction.user.username}`);
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec mute", err instanceof Error ? err.message : "erreur inconnue")],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    await this.mod.log("MUTE", target.id, interaction.user.id, reason, { durationMs: ms });

    const until = dayjs().add(ms, "ms");
    const embed = sanctionEmbed({
      target,
      moderator: interaction.user,
      action: "mute",
      reason,
      duration: `${formatDuration(ms)} (jusqu'à ${until.format("DD/MM HH:mm")})`,
    });
    const dmOk = await notifyMember(
      target,
      brandedEmbed({
        title: "🔇 Tu as été mute",
        description: `Tu es mute sur **${interaction.guild.name}** pour **${formatDuration(ms)}**.\n\nMotif : ${reason ?? "*(non précisé)*"}\nFin : <t:${Math.floor(until.valueOf() / 1000)}:f>`,
        kind: "warning",
      }),
    );

    await interaction.reply({
      embeds: [embed.addFields({ name: "DM", value: dmOk ? "✅ envoyé" : "❌ DM fermés", inline: true })],
    });
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // ────────────────────────────── /unmute
  @Slash({ name: "unmute", description: "Retirer le mute d'un membre" })
  @Guard(ModOnly)
  async unmute(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ embeds: [errorEmbed("Membre introuvable")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (!member.isCommunicationDisabled()) {
      await interaction.reply({
        embeds: [warningEmbed("Pas mute", `<@${target.id}> n'est pas mute.`)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    await member.timeout(null, reason ?? "manual unmute").catch(() => {});
    await this.mod.log("UNMUTE", target.id, interaction.user.id, reason);

    const embed = sanctionEmbed({ target, moderator: interaction.user, action: "unmute", reason });
    await interaction.reply({ embeds: [embed] });
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // ────────────────────────────── /jail
  @Slash({ name: "jail", description: "Envoyer un membre en jail" })
  @Guard(ModOnly)
  async jail(
    @SlashOption({ name: "membre", description: "Membre à jail", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
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
      await interaction.reply({ embeds: [errorEmbed("Membre introuvable")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (!member.manageable) {
      await interaction.reply({
        embeds: [errorEmbed("Hiérarchie", `Le bot ne peut pas modifier les rôles de ${target} (rôle plus haut).`)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const ms = parseDuration(duration);
    try {
      await this.mod.jail(member, interaction.user.id, reason, ms);
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec jail", (err as Error).message)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const embed = sanctionEmbed({
      target,
      moderator: interaction.user,
      action: "jail",
      reason,
      duration: ms ? formatDuration(ms) : "Indéfinie",
    });
    const dmOk = await notifyMember(
      target,
      brandedEmbed({
        title: "⛓️ Tu as été jailé",
        description: `Tu es en jail sur **${interaction.guild.name}**${ms ? ` pour **${formatDuration(ms)}**` : ""}.\n\nMotif : ${reason ?? "*(non précisé)*"}`,
        kind: "error",
      }),
    );

    await interaction.reply({
      embeds: [embed.addFields({ name: "DM", value: dmOk ? "✅ envoyé" : "❌ DM fermés", inline: true })],
    });
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // ────────────────────────────── /unjail
  @Slash({ name: "unjail", description: "Libérer un membre de jail" })
  @Guard(ModOnly)
  async unjail(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const ok = await this.mod.unjail(interaction.guild, target.id, interaction.user.id, reason);
    if (!ok) {
      await interaction.reply({ embeds: [errorEmbed("Membre introuvable ou pas en jail")], flags: MessageFlags.Ephemeral });
      return;
    }
    const embed = sanctionEmbed({ target, moderator: interaction.user, action: "unjail", reason });
    await interaction.reply({ embeds: [embed] });
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // ────────────────────────────── /ban
  @Slash({ name: "ban", description: "Bannir un membre" })
  @Guard(ModOnly)
  async ban(
    @SlashOption({ name: "membre", description: "Membre à ban", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    @SlashOption({
      name: "purge-jours",
      description: "Supprimer les messages des N derniers jours (0-7, défaut 0)",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      minValue: 0,
      maxValue: 7,
    })
    deleteDays: number | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante", "Permission `Ban Members` requise.")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (target.id === interaction.user.id) {
      await interaction.reply({ embeds: [errorEmbed("Cible invalide", "Tu ne peux pas te bannir toi-même.")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (target.id === interaction.client.user?.id) {
      await interaction.reply({ embeds: [errorEmbed("Cible invalide", "Le bot ne peut pas se bannir.")], flags: MessageFlags.Ephemeral });
      return;
    }

    // DM avant ban (sinon on ne peut plus joindre la cible une fois bannie)
    const dmOk = await notifyMember(
      target,
      brandedEmbed({
        title: "🔨 Tu as été banni",
        description: `Tu as été banni de **${interaction.guild.name}**.\n\nMotif : ${reason ?? "*(non précisé)*"}`,
        kind: "error",
      }),
    );

    try {
      await interaction.guild.members.ban(target.id, {
        reason: reason ?? `by ${interaction.user.username}`,
        deleteMessageSeconds: (deleteDays ?? 0) * 86_400,
      });
      await this.mod.log("BAN", target.id, interaction.user.id, reason, {
        deleteDays: deleteDays ?? 0,
      });

      const embed = sanctionEmbed({ target, moderator: interaction.user, action: "ban", reason });
      if (deleteDays && deleteDays > 0) {
        embed.addFields({ name: "Messages purgés", value: `${deleteDays} j`, inline: true });
      }
      embed.addFields({ name: "DM", value: dmOk ? "✅ envoyé" : "❌ DM fermés", inline: true });
      await interaction.reply({ embeds: [embed] });
      await this.logs.send(interaction.client, "sanction", embed);
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec ban", (err as Error).message)],
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // ────────────────────────────── /unban
  @Slash({ name: "unban", description: "Débannir un utilisateur (par ID)" })
  @Guard(ModOnly)
  async unban(
    @SlashOption({ name: "userid", description: "ID utilisateur à débannir", type: ApplicationCommandOptionType.String, required: true })
    userId: string,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (!/^\d{17,20}$/.test(userId)) {
      await interaction.reply({ embeds: [errorEmbed("ID invalide", "Snowflake Discord attendu (17-20 chiffres).")], flags: MessageFlags.Ephemeral });
      return;
    }
    try {
      await interaction.guild.members.unban(userId, reason ?? `by ${interaction.user.username}`);
      await this.mod.log("UNBAN", userId, interaction.user.id, reason);
      const user = await interaction.client.users.fetch(userId).catch(() => null);
      if (user) {
        const embed = sanctionEmbed({ target: user, moderator: interaction.user, action: "unban", reason });
        await interaction.reply({ embeds: [embed] });
        await this.logs.send(interaction.client, "sanction", embed);
      } else {
        await interaction.reply({ embeds: [successEmbed("Débannissement effectué", `<@${userId}> débanni.`)] });
      }
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec unban", (err as Error).message)],
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // ────────────────────────────── /kick
  @Slash({ name: "kick", description: "Expulser un membre" })
  @Guard(ModOnly)
  async kick(
    @SlashOption({ name: "membre", description: "Membre à kick", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante")], flags: MessageFlags.Ephemeral });
      return;
    }
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ embeds: [errorEmbed("Membre introuvable")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (!member.kickable) {
      await interaction.reply({ embeds: [errorEmbed("Hiérarchie", `Le bot ne peut pas expulser ${target}.`)], flags: MessageFlags.Ephemeral });
      return;
    }
    const dmOk = await notifyMember(
      target,
      brandedEmbed({
        title: "👢 Tu as été expulsé",
        description: `Tu as été expulsé de **${interaction.guild.name}**.\n\nMotif : ${reason ?? "*(non précisé)*"}`,
        kind: "warning",
      }),
    );
    await member.kick(reason ?? `by ${interaction.user.username}`).catch(() => {});
    await this.mod.log("KICK", target.id, interaction.user.id, reason);

    const embed = sanctionEmbed({ target, moderator: interaction.user, action: "kick", reason })
      .addFields({ name: "DM", value: dmOk ? "✅ envoyé" : "❌ DM fermés", inline: true });
    await interaction.reply({ embeds: [embed] });
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // ────────────────────────────── /clear
  @Slash({ name: "clear", description: "Supprimer un nombre de messages (1-100)" })
  @Guard(ModOnly)
  async clear(
    @SlashOption({ name: "nombre", description: "Nombre (1-100)", type: ApplicationCommandOptionType.Integer, required: true, minValue: 1, maxValue: 100 })
    amount: number,
    @SlashOption({ name: "membre", description: "Filtrer par auteur", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante", "`Manage Messages` requis.")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (!interaction.channel?.isTextBased() || !("bulkDelete" in interaction.channel)) {
      await interaction.reply({ embeds: [errorEmbed("Salon non supporté")], flags: MessageFlags.Ephemeral });
      return;
    }
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const messages = await (interaction.channel as TextChannel).messages.fetch({ limit: target ? 100 : amount });
    const filtered = target ? messages.filter((m) => m.author.id === target.id).first(amount) : messages.first(amount);
    const toDelete = Array.isArray(filtered) ? filtered : [...filtered];
    const deleted = await (interaction.channel as TextChannel).bulkDelete(toDelete, true);
    await this.mod.log("PURGE", null, interaction.user.id, undefined, {
      count: deleted.size,
      target: target?.id,
      channelId: interaction.channelId,
    });
    await interaction.editReply({
      embeds: [successEmbed(`${deleted.size} message(s) supprimé(s)`, target ? `Filtre : <@${target.id}>` : undefined)],
    });
  }

  // ────────────────────────────── /slowmode
  @Slash({ name: "slowmode", description: "Définir le slowmode du salon (0 = off, max 21600s)" })
  @Guard(ModOnly)
  async slowmode(
    @SlashOption({
      name: "secondes",
      description: "Secondes (0 = off, max 21600 = 6h)",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 0,
      maxValue: 21_600,
    })
    seconds: number,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante", "`Manage Channels` requis.")], flags: MessageFlags.Ephemeral });
      return;
    }
    const ch = interaction.channel;
    if (!ch || !("setRateLimitPerUser" in ch)) {
      await interaction.reply({ embeds: [errorEmbed("Salon non supporté")], flags: MessageFlags.Ephemeral });
      return;
    }
    try {
      await (ch as TextChannel).setRateLimitPerUser(seconds, `slowmode by ${interaction.user.username}`);
      await this.mod.log("SLOWMODE", null, interaction.user.id, undefined, {
        seconds,
        channelId: interaction.channelId,
      });
      await interaction.reply({
        embeds: [
          successEmbed(
            seconds === 0 ? "Slowmode désactivé" : `Slowmode : ${seconds}s`,
            seconds === 0 ? "Plus de limite par utilisateur." : `Chaque membre doit attendre **${seconds}s** entre 2 messages.`,
          ),
        ],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec slowmode", (err as Error).message)],
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // ────────────────────────────── /lock
  @Slash({ name: "lock", description: "Verrouiller le salon (refuse SendMessages à @everyone)" })
  @Guard(ModOnly)
  async lock(
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante", "`Manage Channels` requis.")], flags: MessageFlags.Ephemeral });
      return;
    }
    const ch = interaction.channel;
    if (!ch || ch.type !== ChannelType.GuildText) {
      await interaction.reply({ embeds: [errorEmbed("Salon non supporté", "Salon textuel uniquement.")], flags: MessageFlags.Ephemeral });
      return;
    }
    try {
      await (ch as TextChannel).permissionOverwrites.edit(
        interaction.guild.roles.everyone,
        { SendMessages: false },
        { reason: reason ?? `lock by ${interaction.user.username}` },
      );
      await this.mod.log("LOCK", null, interaction.user.id, reason, { channelId: interaction.channelId });
      await interaction.reply({
        embeds: [successEmbed(`🔒 Salon verrouillé`, reason ? `Motif : ${reason}` : "Personne ne peut plus écrire ici jusqu'à `/unlock`.")],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec lock", (err as Error).message)],
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // ────────────────────────────── /unlock
  @Slash({ name: "unlock", description: "Déverrouiller le salon" })
  @Guard(ModOnly)
  async unlock(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante")], flags: MessageFlags.Ephemeral });
      return;
    }
    const ch = interaction.channel;
    if (!ch || ch.type !== ChannelType.GuildText) {
      await interaction.reply({ embeds: [errorEmbed("Salon non supporté")], flags: MessageFlags.Ephemeral });
      return;
    }
    try {
      await (ch as TextChannel).permissionOverwrites.edit(
        interaction.guild.roles.everyone,
        { SendMessages: null },
        { reason: `unlock by ${interaction.user.username}` },
      );
      await this.mod.log("UNLOCK", null, interaction.user.id, undefined, { channelId: interaction.channelId });
      await interaction.reply({ embeds: [successEmbed("🔓 Salon déverrouillé")] });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec unlock", (err as Error).message)],
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // ────────────────────────────── /nick
  @Slash({ name: "nick", description: "Changer le pseudo d'un membre (laisse vide pour reset)" })
  @Guard(ModOnly)
  async nick(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "pseudo", description: "Nouveau pseudo (vide = reset)", type: ApplicationCommandOptionType.String, required: false, maxLength: 32 })
    newNick: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante", "`Manage Nicknames` requis.")], flags: MessageFlags.Ephemeral });
      return;
    }
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ embeds: [errorEmbed("Membre introuvable")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (!member.manageable) {
      await interaction.reply({ embeds: [errorEmbed("Hiérarchie", `Le bot ne peut pas modifier ${target}.`)], flags: MessageFlags.Ephemeral });
      return;
    }
    try {
      await member.setNickname(newNick ?? null, `nick by ${interaction.user.username}`);
      await this.mod.log("NICK", target.id, interaction.user.id, undefined, { newNick: newNick ?? null });
      await interaction.reply({
        embeds: [
          successEmbed(
            newNick ? `Pseudo changé` : `Pseudo réinitialisé`,
            newNick ? `<@${target.id}> → **${newNick}**` : `<@${target.id}> retrouve son nom Discord.`,
          ),
        ],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec nick", (err as Error).message)],
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // ────────────────────────────── /note
  @Slash({ name: "note", description: "Ajouter une note interne mod (visible dans audit, pas sanction)" })
  @Guard(ModOnly)
  async note(
    @SlashOption({ name: "membre", description: "Membre concerné", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "contenu", description: "Contenu de la note", type: ApplicationCommandOptionType.String, required: true, maxLength: 500 })
    content: string,
    interaction: CommandInteraction,
  ) {
    await this.mod.note(target.id, interaction.user.id, content);
    await interaction.reply({
      embeds: [
        successEmbed(
          "📝 Note enregistrée",
          `Note interne ajoutée pour <@${target.id}>.\n\n> ${content}`,
        ),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }

  // ────────────────────────────── /stats (membre)
  @Slash({ name: "stats", description: "Voir les stats modération d'un membre" })
  async stats(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    const user = target ?? interaction.user;
    const warnCount = await this.mod.countWarns(user.id);
    const jail = await this.mod.getActiveJail(user.id);
    const embed = new EmbedBuilder()
      .setTitle(`Stats modération de ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Warns actifs", value: String(warnCount), inline: true },
        { name: "Jailed", value: jail ? `Oui ${jail.expiresAt ? `(jusqu'à <t:${Math.floor(jail.expiresAt.getTime() / 1000)}:R>)` : "(indéfini)"}` : "Non", inline: true },
      )
      .setColor(warnCount > 0 || jail ? 0xfbbf24 : 0x57f287);
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }

  // ────────────────────────────── /sstats
  @Slash({ name: "sstats", description: "Stats du serveur" })
  @Guard(AdminOnly)
  async sstats(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;
    const g = interaction.guild;
    const stats = await this.mod.statsWindow();
    const top3 = Object.entries(stats.byAction)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([action, count]) => `\`${action}\` × ${count}`)
      .join(" · ") || "*aucune*";
    const embed = new EmbedBuilder()
      .setTitle(`Stats — ${g.name}`)
      .setThumbnail(g.iconURL() ?? null)
      .addFields(
        { name: "Membres", value: String(g.memberCount), inline: true },
        { name: "Canaux", value: String(g.channels.cache.size), inline: true },
        { name: "Rôles", value: String(g.roles.cache.size), inline: true },
        { name: "Boosts", value: String(g.premiumSubscriptionCount ?? 0), inline: true },
        { name: "Créé le", value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true },
        { name: "Mod (7j)", value: top3 },
      )
      .setColor(0xfbbf24);
    await interaction.reply({ embeds: [embed] });
  }

  // ────────────────────────────── /role
  @Slash({ name: "role", description: "Donner/retirer un rôle (ciblé ou global @everyone si admin)" })
  @Guard(ModOnly)
  async role(
    @SlashChoice({ name: "give", value: "give" })
    @SlashChoice({ name: "remove", value: "remove" })
    @SlashOption({ name: "action", description: "give/remove", type: ApplicationCommandOptionType.String, required: true })
    action: "give" | "remove",
    @SlashOption({ name: "role", description: "Rôle", type: ApplicationCommandOptionType.Role, required: true })
    role: import("discord.js").Role,
    @SlashOption({ name: "membre", description: "Cible (vide = @everyone si Administrator)", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({ embeds: [errorEmbed("Permission insuffisante", "`Manage Roles` requis.")], flags: MessageFlags.Ephemeral });
      return;
    }
    const botMember = await interaction.guild.members.fetchMe();
    if (role.position >= botMember.roles.highest.position) {
      await interaction.reply({
        embeds: [errorEmbed("Rôle au-dessus du bot", `${role} (position ${role.position}) ≥ rôle bot. Replace le rôle du bot plus haut.`)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    if (target) {
      const member = await interaction.guild.members.fetch(target.id).catch(() => null);
      if (!member) {
        await interaction.reply({ embeds: [errorEmbed("Membre introuvable")], flags: MessageFlags.Ephemeral });
        return;
      }
      try {
        if (action === "give") await member.roles.add(role.id);
        else await member.roles.remove(role.id);
      } catch (err) {
        await interaction.reply({ embeds: [errorEmbed("Échec rôle", (err as Error).message)], flags: MessageFlags.Ephemeral });
        return;
      }
      await this.mod.log("ROLE", target.id, interaction.user.id, undefined, { roleId: role.id, action });
      await interaction.reply({
        embeds: [successEmbed(action === "give" ? "Rôle donné" : "Rôle retiré", `${role} → <@${target.id}>`)],
      });
    } else {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({ embeds: [errorEmbed("Action globale réservée aux admins")], flags: MessageFlags.Ephemeral });
        return;
      }
      await interaction.deferReply();
      const members = await interaction.guild.members.fetch();
      let ok = 0;
      let failed = 0;
      for (const m of members.values()) {
        try {
          if (action === "give") await m.roles.add(role.id);
          else await m.roles.remove(role.id);
          ok++;
        } catch {
          failed++;
        }
      }
      await this.mod.log("ROLE_BULK", null, interaction.user.id, undefined, {
        roleId: role.id,
        action,
        ok,
        failed,
      });
      await interaction.editReply({
        embeds: [
          successEmbed(
            action === "give" ? "Rôle donné en masse" : "Rôle retiré en masse",
            `${role} appliqué à **${ok}** membre(s)${failed ? ` (${failed} échec(s))` : ""}.`,
          ),
        ],
      });
    }
  }
}
