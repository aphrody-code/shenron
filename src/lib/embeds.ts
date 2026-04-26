/**
 * Embed helpers — inspirés de @rpbey/tscord (src/utils/functions/embeds.ts) mais
 * recopiés ici pour éviter de tirer toute la stack mikro-orm/tsed de tscord.
 *
 * Convention couleurs (alignée Discord brand) :
 *   • Success  → 0x57f287 (vert)
 *   • Error    → 0xed4245 (rouge)
 *   • Warning  → 0xfee75c (jaune)
 *   • Info     → 0x5865f2 (blurple)
 *   • Brand    → 0xfbbf24 (amber, identité shenron)
 */
import { EmbedBuilder, type ColorResolvable, type GuildMember, type User } from "discord.js";

export const COLORS = {
  success: 0x57f287,
  error: 0xed4245,
  warning: 0xfee75c,
  info: 0x5865f2,
  brand: 0xfbbf24,
  muted: 0x71717a,
} as const;

/**
 * Couleurs DBZ thématiques pour les events de gameplay (level-up, achievement,
 * sanctions, etc.). Chaque rang = une transformation iconique.
 */
export const DBZ_COLORS = {
  saiyan: 0xfacc15, // SS jaune
  blue: 0x3b82f6, // SS Blue
  rose: 0xec4899, // SS Rose / Black
  ultra: 0xa1a1aa, // Ultra Instinct argenté
  kaio: 0xdc2626, // Kaio-ken rouge
  namek: 0x16a34a, // Vert Namek
  power: 0xef4444, // Sanction
  zeni: 0xf59e0b, // Zenis / économie
  achievement: 0x8b5cf6, // Succès
  goku: 0xea580c, // Gi Goku
} as const;

export type EmbedKind = keyof typeof COLORS;

export function brandedEmbed(opts: {
  title?: string;
  description?: string;
  kind?: EmbedKind;
  footer?: string;
  timestamp?: boolean;
}): EmbedBuilder {
  const e = new EmbedBuilder().setColor(COLORS[opts.kind ?? "brand"]);
  if (opts.title) e.setTitle(opts.title);
  if (opts.description) e.setDescription(opts.description);
  if (opts.footer) e.setFooter({ text: opts.footer });
  if (opts.timestamp !== false) e.setTimestamp(new Date());
  return e;
}

export function successEmbed(message: string, description?: string): EmbedBuilder {
  return brandedEmbed({ title: `✅ ${message}`, description, kind: "success" });
}

export function errorEmbed(message: string, description?: string): EmbedBuilder {
  return brandedEmbed({ title: `❌ ${message}`, description, kind: "error" });
}

export function warningEmbed(message: string, description?: string): EmbedBuilder {
  return brandedEmbed({ title: `⚠️ ${message}`, description, kind: "warning" });
}

export function infoEmbed(message: string, description?: string): EmbedBuilder {
  return brandedEmbed({ title: `ℹ️ ${message}`, description, kind: "info" });
}

// ─── Helpers safety (limites Discord) ────────────────────────────────────
// Limites strict de l'API Discord — au-delà l'embed est rejeté :
//   title 256 · description 4096 · field name 256 · field value 1024 ·
//   footer 2048 · author 256 · 25 fields max · 6000 chars total

/** Tronque proprement à `max` chars (avec ellipsis si coupure). */
export function trim(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

// ─── Embeds DBZ thématiques ──────────────────────────────────────────────

const FOOTER_DBZ = { text: "Shenron · réalise tes vœux DBZ" };

/** Couleur d'un level-up selon le palier atteint (1→namek, 4→saiyan, 6→kaio, 8→blue, 9→rose, 10→ultra). */
export function colorForLevel(level: number): ColorResolvable {
  if (level >= 10) return DBZ_COLORS.ultra;
  if (level >= 9) return DBZ_COLORS.rose;
  if (level >= 8) return DBZ_COLORS.blue;
  if (level >= 6) return DBZ_COLORS.kaio;
  if (level >= 4) return DBZ_COLORS.saiyan;
  return DBZ_COLORS.namek;
}

/**
 * Level-up embed : avatar du membre, gradient couleur selon palier, fields
 * Niveau / XP / Récompense.
 */
export function levelUpEmbed(opts: {
  member: GuildMember;
  level: number;
  xp: number;
  zeniBonus?: number;
  message: string;
}): EmbedBuilder {
  const { member, level, xp, zeniBonus, message } = opts;
  const embed = new EmbedBuilder()
    .setColor(colorForLevel(level))
    .setAuthor({
      name: member.displayName,
      iconURL: member.displayAvatarURL({ size: 128 }),
    })
    .setTitle(trim(`Niveau ${level} atteint !`, 256))
    .setDescription(trim(message, 4096))
    .setThumbnail(member.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: "Niveau", value: `**${level}**`, inline: true },
      { name: "XP total", value: xp.toLocaleString("fr-FR"), inline: true },
    )
    .setTimestamp()
    .setFooter(FOOTER_DBZ);
  if (zeniBonus && zeniBonus > 0) {
    embed.addFields({
      name: "Récompense",
      value: `**+${zeniBonus.toLocaleString("fr-FR")} zénis**`,
      inline: true,
    });
  }
  return embed;
}

/** Succès débloqué (achievement) : violet, mention user, description du succès. */
export function achievementEmbed(opts: {
  user: User;
  code: string;
  description: string;
  zeniBonus?: number;
}): EmbedBuilder {
  const { user, code, description, zeniBonus } = opts;
  const embed = new EmbedBuilder()
    .setColor(DBZ_COLORS.achievement)
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 128 }) })
    .setTitle("🏆 Succès débloqué !")
    .setDescription(trim(`<@${user.id}> a débloqué **${code}**`, 4096))
    .addFields({ name: "Description", value: trim(description, 1024) })
    .setTimestamp()
    .setFooter(FOOTER_DBZ);
  if (zeniBonus && zeniBonus > 0) {
    embed.addFields({
      name: "Récompense",
      value: `**+${zeniBonus.toLocaleString("fr-FR")} zénis**`,
      inline: true,
    });
  }
  return embed;
}

/** Transaction économique (gain / perte zénis). */
export function economyEmbed(opts: {
  user: User;
  delta: number;
  reason: string;
  newBalance?: number;
}): EmbedBuilder {
  const { user, delta, reason, newBalance } = opts;
  const positive = delta >= 0;
  const embed = new EmbedBuilder()
    .setColor(DBZ_COLORS.zeni)
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 128 }) })
    .setTitle(positive ? "💰 Gain de zénis" : "💸 Perte de zénis")
    .setDescription(reason)
    .addFields({
      name: positive ? "Gain" : "Perte",
      value: `**${positive ? "+" : ""}${delta.toLocaleString("fr-FR")} zénis**`,
      inline: true,
    })
    .setTimestamp()
    .setFooter(FOOTER_DBZ);
  if (typeof newBalance === "number") {
    embed.addFields({
      name: "Nouveau solde",
      value: `${newBalance.toLocaleString("fr-FR")} zénis`,
      inline: true,
    });
  }
  return embed;
}

/** Bienvenue / Au revoir. */
export function joinLeaveEmbed(opts: {
  user: User;
  kind: "join" | "leave";
  memberCount?: number;
  message?: string;
}): EmbedBuilder {
  const { user, kind, memberCount, message } = opts;
  const embed = new EmbedBuilder()
    .setColor(kind === "join" ? COLORS.success : COLORS.warning)
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 128 }) })
    .setTitle(kind === "join" ? "🌟 Nouveau combattant !" : "👋 Au revoir guerrier")
    .setDescription(message ?? `<@${user.id}>`)
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setTimestamp()
    .setFooter(FOOTER_DBZ);
  if (memberCount) {
    embed.addFields({
      name: "Membres",
      value: `**${memberCount}** combattants`,
      inline: true,
    });
  }
  return embed;
}

/** Sanction modération (warn / mute / kick / ban / jail) avec leur opposé `un*`. */
type SanctionAction =
  | "warn"
  | "mute"
  | "kick"
  | "ban"
  | "jail"
  | "unwarn"
  | "unmute"
  | "unjail"
  | "unban";

const SANCTION_EMOJI: Record<SanctionAction, string> = {
  warn: "⚠️",
  mute: "🔇",
  unmute: "🔊",
  kick: "👢",
  ban: "🔨",
  unban: "🔓",
  jail: "⛓️",
  unjail: "🕊️",
  unwarn: "✅",
};

export function sanctionEmbed(opts: {
  target: User;
  moderator: User;
  action: SanctionAction;
  reason?: string;
  duration?: string;
}): EmbedBuilder {
  const { target, moderator, action, reason, duration } = opts;
  const isUndo = action.startsWith("un");
  const embed = new EmbedBuilder()
    .setColor(isUndo ? COLORS.success : DBZ_COLORS.power)
    .setTitle(`${SANCTION_EMOJI[action]} ${action.charAt(0).toUpperCase() + action.slice(1)}`)
    .setDescription(`<@${target.id}>`)
    .addFields(
      { name: "Modérateur", value: `<@${moderator.id}>`, inline: true },
      { name: "Cible", value: `${target.username} \`${target.id}\``, inline: true },
    )
    .setTimestamp()
    .setFooter(FOOTER_DBZ);
  if (reason) embed.addFields({ name: "Motif", value: reason });
  if (duration) embed.addFields({ name: "Durée", value: duration, inline: true });
  return embed;
}
