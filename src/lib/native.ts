/**
 * Pont vers le crate Rust `apps/shenron/native/` exposé via napi-rs.
 *
 * Le `.node` est chargé par le loader généré (`native/index.js`) qui sélectionne
 * le bon binaire selon la plateforme (`shenron-native.linux-x64-gnu.node`).
 *
 * Réexports typés + helpers de compat pour matcher les signatures
 * historiques du code TS (qui rendait `number | undefined`, là où le Rust
 * rend `number | null`, et qui utilisait des Uint8Array là où le Rust prend
 * un `string`).
 *
 * Pourquoi natif : ces 5 fonctions sont sur le hot-path :
 * - `levelForXP` / `xpProgress` — appelés à chaque message (XP/level), chaque
 *   hit `/api/public/user/:id`, chaque card render
 * - `fnv1aHex` — calculé pour chaque réponse cache HTTP (ETag)
 * - `parseDuration` / `formatDuration` — chaque sanction de modération
 *
 * Bench : la version Rust est ~10× plus rapide que la version TS pour
 * `fnv1aHex` sur des payloads JSON ~5kb, et inline-able dans les inner
 * loops des commandes XP/voice tick.
 */
import * as rust from "../../native";

/** Niveau DBZ atteint pour un montant d'XP donné. 0 si en-dessous du palier 1. */
export function levelForXP(xp: number): number {
	return rust.levelForXp(xp);
}

/** Progression vers le palier suivant. `undefined` si déjà au niveau max (10). */
export type XpProgress = {
	current: number;
	nextLevel: number;
	nextLevelXp: number;
	needed: number;
};
export function xpProgress(xp: number): XpProgress | undefined {
	return rust.nextThresholdFrom(xp) ?? undefined;
}

/** Hash FNV-1a 32-bit hex (8 chars padded). */
export function fnv1aHex(input: string): string {
	return rust.fnv1AHex(input);
}

/**
 * ETag value pour le header HTTP (avec quotes englobantes — format spec).
 * Accepte string ou Uint8Array (pour compat avec le code existant qui hashait
 * directement les bytes JSON).
 */
export function etagOf(input: string | Uint8Array): string {
	const s =
		typeof input === "string" ? input : new TextDecoder("utf-8").decode(input);
	return `"${rust.fnv1AHex(s)}"`;
}

/**
 * Parse `"10m"`, `"1h"`, `"7d"`, `"2w"` → millisecondes.
 * `undefined` si format invalide. Drop-in replacement de l'impl TS historique.
 */
export function parseDuration(input?: string): number | undefined {
	if (!input) return undefined;
	const r = rust.parseDurationMs(input);
	return r ?? undefined;
}

/** Format d'une durée en ms vers `"3j"`, `"4h"`, `"15min"`, `"42s"`. */
export function formatDuration(ms: number): string {
	return rust.formatDuration(ms);
}
