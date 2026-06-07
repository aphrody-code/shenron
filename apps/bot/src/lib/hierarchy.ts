/**
 * Hiérarchie modération configurable.
 *
 * Le setting `moderation.hierarchy` contient un JSON `string[][]` où chaque
 * entrée représente un **niveau** de staff, **du plus haut au plus bas** :
 *
 *   [
 *     ["roleId_owner_role", "roleId_admin_role"],   // niveau 0 — top
 *     ["roleId_lead_mod"],                          // niveau 1
 *     ["roleId_mod_basique", "roleId_helper"],      // niveau 2
 *   ]
 *
 * Règle : un membre **ne peut sanctionner que** quelqu'un dont le niveau
 * effectif est **strictement plus grand** (index numérique plus grand) que
 * le sien. Les membres sans aucun rôle staff = niveau `Infinity` (= tout en
 * bas) — sanctionnables par n'importe qui à ModOnly.
 *
 * Le **propriétaire** (`OWNER_ID`) et le **bot-dev** (`BOT_DEV_ID`) bypassent
 * tout check : ils peuvent sanctionner n'importe qui.
 */
import type { GuildMember } from "discord.js";
import { container } from "tsyringe";
import { env } from "./env";
import { SettingsService } from "~/services/SettingsService";
import { logger } from "./logger";

export type Hierarchy = string[][];

let cachedRaw: string | undefined;
let cachedParsed: Hierarchy = [];

/**
 * Charge et parse la hiérarchie depuis SettingsService (cache 30s côté
 * service, on parse à chaque changement). Memoization locale du dernier raw.
 */
export async function loadHierarchy(): Promise<Hierarchy> {
	const settings = container.resolve(SettingsService);
	const raw = (await settings.getRaw("moderation.hierarchy")) ?? "[]";
	if (raw === cachedRaw) return cachedParsed;
	cachedRaw = raw;
	try {
		const parsed = JSON.parse(raw);
		if (
			!Array.isArray(parsed) ||
			!parsed.every((lvl) => Array.isArray(lvl) && lvl.every((r) => typeof r === "string"))
		) {
			logger.warn({ raw }, "moderation.hierarchy: format invalide, fallback []");
			cachedParsed = [];
		} else {
			cachedParsed = parsed as Hierarchy;
		}
	} catch (err) {
		logger.warn({ err, raw }, "moderation.hierarchy: JSON invalide");
		cachedParsed = [];
	}
	return cachedParsed;
}

/**
 * Retourne le niveau d'un membre (index du premier match dans la hiérarchie,
 * 0 = top). `Infinity` si aucun rôle staff trouvé.
 */
export function levelOf(member: GuildMember, hierarchy: Hierarchy): number {
	for (let i = 0; i < hierarchy.length; i++) {
		const roles = hierarchy[i]!;
		for (const roleId of roles) {
			if (member.roles.cache.has(roleId)) return i;
		}
	}
	return Infinity;
}

/**
 * Vérifie si `mod` peut sanctionner `target`.
 *
 * Règles :
 *  - Owner / BotDev → autorisé (peu importe `target`).
 *  - `target` est owner / botdev → refusé (sauf si appelant est owner).
 *  - `mod.level < target.level` (mod hiérarchiquement plus haut) → autorisé.
 *  - Sinon → refusé.
 */
export async function canModerate(
	mod: GuildMember,
	target: GuildMember
): Promise<{ ok: boolean; reason?: string }> {
	const isOwner = mod.id === env.OWNER_ID || mod.id === env.BOT_DEV_ID;
	if (isOwner) return { ok: true };
	if (target.id === env.OWNER_ID || target.id === env.BOT_DEV_ID) {
		return { ok: false, reason: "Cible protégée (propriétaire / bot-dev)." };
	}
	if (target.id === mod.id) {
		return { ok: false, reason: "Tu ne peux pas te sanctionner toi-même." };
	}
	const hierarchy = await loadHierarchy();
	if (hierarchy.length === 0) return { ok: true }; // pas de hiérarchie configurée → autorise (compat)
	const modLvl = levelOf(mod, hierarchy);
	const targetLvl = levelOf(target, hierarchy);
	if (modLvl === Infinity) {
		return {
			ok: false,
			reason: "Tu n'as aucun rôle dans la hiérarchie staff.",
		};
	}
	if (modLvl >= targetLvl) {
		return {
			ok: false,
			reason: `Hiérarchie : ta cible est au niveau \`${
				targetLvl === Infinity ? "—" : targetLvl
			}\`, tu es au niveau \`${modLvl}\`. Tu ne peux sanctionner que des membres de niveau strictement supérieur (index numérique plus grand).`,
		};
	}
	return { ok: true };
}
