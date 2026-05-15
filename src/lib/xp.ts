import { LEVEL_THRESHOLDS } from "./constants";

/**
 * Niveau atteint pour un XP. Reste en TS pur — bench (Bun 1.3.14, 1M iter)
 * mesure 5× plus lent en Rust à cause de l'overhead FFI napi (~130ns/call)
 * pour une boucle de 10 items. Le hot-path message/voice tick l'appelle
 * 60+ fois/seconde donc on garde TS.
 *
 * Pour les use cases qui ont besoin de la version riche `{current, nextLevel,
 * nextLevelXp, needed}`, utiliser `native.xpProgress(xp)` (cf. `lib/native.ts`).
 */
export function levelForXP(xp: number): number {
	let level = 0;
	for (const t of LEVEL_THRESHOLDS) {
		if (xp >= t.xp) level = t.level;
		else break;
	}
	return level;
}

export function xpRequiredForLevel(level: number): number {
	return LEVEL_THRESHOLDS.find((t) => t.level === level)?.xp ?? Infinity;
}

export function nextThresholdFrom(xp: number) {
	return LEVEL_THRESHOLDS.find((t) => t.xp > xp);
}

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatXP(xp: number): string {
	return xp.toLocaleString("fr-FR");
}
