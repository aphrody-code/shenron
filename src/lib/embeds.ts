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
import { EmbedBuilder } from "discord.js";

export const COLORS = {
  success: 0x57f287,
  error: 0xed4245,
  warning: 0xfee75c,
  info: 0x5865f2,
  brand: 0xfbbf24,
  muted: 0x71717a,
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
