import { container } from "tsyringe";
import type { EmbedBuilder, User } from "discord.js";
import { MessageTemplateService } from "~/services/MessageTemplateService";

export function parseDuration(input?: string): number | undefined {
	if (!input) return undefined;
	const m = input.match(/^(\d+)\s*([smhdw])$/i);
	if (!m) return undefined;
	const n = parseInt(m[1]!, 10);
	const unit = m[2]!.toLowerCase();
	const mult =
		{ s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 }[
			unit
		] ?? 0;
	return n * mult;
}

export function formatDuration(ms: number): string {
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
export async function notifyMember(
	target: User,
	embed: EmbedBuilder,
	vars?: Record<string, unknown>,
): Promise<boolean> {
	try {
		const templates = container.resolve(MessageTemplateService);
		const r = await templates.render("mod_sanction_dm", vars ?? {});
		if (r && !r.enabled) return false;
		if (r && vars && r.rendered !== r.def.defaultTemplate) {
			embed.addFields({
				name: "Note du serveur",
				value: r.rendered.slice(0, 1024),
			});
		}
		await target.send({ embeds: [embed] });
		return true;
	} catch {
		return false;
	}
}
