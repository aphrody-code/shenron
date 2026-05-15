import { LEVEL_THRESHOLDS } from "./constants";
import * as native from "./native";

/**
 * Niveau atteint pour un XP. Wrappé vers le crate Rust natif (~10× plus
 * rapide en hot-path message/voice tick). La table de thresholds est
 * dupliquée côté Rust dans `native/src/lib.rs` — garde les deux synchronisées.
 */
export function levelForXP(xp: number): number {
	return native.levelForXP(xp);
}

export function xpRequiredForLevel(level: number): number {
	return LEVEL_THRESHOLDS.find((t) => t.level === level)?.xp ?? Infinity;
}

/**
 * Forme historique `{ level, xp }`. Wrappe le `XpProgress` Rust qui contient
 * plus d'infos (current, needed) — sous-set rendu pour matcher les callers.
 */
export function nextThresholdFrom(xp: number) {
	const p = native.xpProgress(xp);
	if (!p) return undefined;
	return { level: p.nextLevel, xp: p.nextLevelXp };
}

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatXP(xp: number): string {
	return xp.toLocaleString("fr-FR");
}
