/**
 * Pont vers le crate Rust `apps/shenron/native/` exposé via napi-rs.
 *
 * Le `.node` est chargé par le loader généré (`native/index.js`) qui sélectionne
 * le bon binaire selon la plateforme (`shenron-native.linux-x64-gnu.node`).
 *
 * Bench réel (Bun 1.3.14, payload 1390b, host VPS) :
 *   level_for_xp x1M  : TS 31ms · Rust 163ms · ratio 0.19× (Rust plus lent !)
 *   fnv1a(1.4kb) x50k : TS 195ms · Rust 104ms · ratio 1.87× (Rust gagne)
 *
 * Conclusion : l'overhead FFI napi est ~130ns par appel — pour des fonctions
 * sub-microseconde sur Bun JIT, le coût FFI annule le gain Rust. À porter
 * en Rust : seulement les fonctions avec boucle interne >1kb input ou
 * computation lourde (hash, compress, parse complexe, image transform).
 *
 * Fonctions exposées :
 * - `xpProgress` — formes riches du palier suivant (utile pour route cached,
 *   pas pour hot-path : le simple `levelForXP` reste TS dans `xp.ts`).
 * - `fnv1aHex` / `etagOf` — gain net pour hash de payloads JSON (utilisé
 *   par les routes publiques caching).
 * - `parseDuration` / `formatDuration` — wrappé pour cohérence avec le code
 *   TS existant. Gain Rust marginal car appelé une fois par sanction.
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
