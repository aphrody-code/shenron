/**
 * Tests unitaires pure (pas de DB) pour la couche notes.
 * Les helpers `isRatingTargetType` / `clampScore` vivent dans lib/ratings (server-only) ;
 * on rejoue les règles ici pour valider le contrat API.
 */
import { describe, expect, test } from "bun:test";

const TYPES = ["game", "episode", "movie", "arc"] as const;

function isRatingTargetType(v: unknown): boolean {
	return typeof v === "string" && (TYPES as readonly string[]).includes(v);
}

function clampScore(n: number): number | null {
	if (!Number.isFinite(n)) return null;
	const s = Math.round(n);
	if (s < 1 || s > 5) return null;
	return s;
}

describe("rating target types", () => {
	test("accepte game/episode/movie/arc", () => {
		for (const t of TYPES) expect(isRatingTargetType(t)).toBe(true);
	});
	test("refuse tome/saga/personnage", () => {
		expect(isRatingTargetType("tome")).toBe(false);
		expect(isRatingTargetType("saga")).toBe(false);
		expect(isRatingTargetType("character")).toBe(false);
		expect(isRatingTargetType("")).toBe(false);
		expect(isRatingTargetType(null)).toBe(false);
	});
});

describe("rating score", () => {
	test("1..5 valides", () => {
		expect(clampScore(1)).toBe(1);
		expect(clampScore(5)).toBe(5);
		expect(clampScore(3.4)).toBe(3);
		expect(clampScore(3.6)).toBe(4);
	});
	test("hors plage / NaN → null", () => {
		expect(clampScore(0)).toBeNull();
		expect(clampScore(6)).toBeNull();
		expect(clampScore(NaN)).toBeNull();
		expect(clampScore(Infinity)).toBeNull();
	});
});
