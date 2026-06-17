/**
 * Tests du module pur lib/races (multiplicateurs de progression par race).
 */
import { describe, expect, test } from "bun:test";
import {
	RACE_IDS,
	RACES,
	applyZeniRace,
	getRace,
	hasRegen,
	hasZenkai,
	isRaceId,
	messageXpMultiplier,
	voiceXpMultiplier,
	ZENKAI_MULT,
} from "~/lib/races";

describe("races — catalogue", () => {
	test("5 races définies et cohérentes", () => {
		expect(RACE_IDS.length).toBe(5);
		for (const id of RACE_IDS) {
			expect(RACES[id].id).toBe(id);
			expect(RACES[id].name.length).toBeGreaterThan(0);
		}
	});
	test("isRaceId / getRace", () => {
		expect(isRaceId("saiyen")).toBe(true);
		expect(isRaceId("kaioshin")).toBe(false);
		expect(isRaceId(null)).toBe(false);
		expect(getRace("majin")?.name).toBe("Majin");
		expect(getRace(null)).toBeNull();
	});
});

describe("races — multiplicateurs XP", () => {
	const now = 1_000_000;
	test("sans race = 1", () => {
		expect(messageXpMultiplier(null, 0, now)).toBe(1);
		expect(voiceXpMultiplier(null, 0, now)).toBe(1);
	});
	test("Saiyen ×1.25 chat + vocal", () => {
		expect(messageXpMultiplier("saiyen", 0, now)).toBeCloseTo(1.25);
		expect(voiceXpMultiplier("saiyen", 0, now)).toBeCloseTo(1.25);
	});
	test("Race de Freezer boost vocal uniquement", () => {
		expect(messageXpMultiplier("freezer", 0, now)).toBe(1);
		expect(voiceXpMultiplier("freezer", 0, now)).toBeCloseTo(1.4);
	});
	test("Zenkai (Saiyen) actif applique ×ZENKAI_MULT", () => {
		const boostUntil = now + 1000;
		expect(messageXpMultiplier("saiyen", boostUntil, now)).toBeCloseTo(1.25 * ZENKAI_MULT);
		// fenêtre expirée → pas de bonus
		expect(messageXpMultiplier("saiyen", now - 1, now)).toBeCloseTo(1.25);
		// Namek n'a pas Zenkai
		expect(messageXpMultiplier("namek", boostUntil, now)).toBeCloseTo(1.1);
	});
});

describe("races — zéni", () => {
	test("Terrien +25 % général", () => {
		expect(applyZeniRace("terrien", 100)).toBe(125);
		expect(applyZeniRace("terrien", 100, true)).toBe(125);
	});
	test("Majin +50 % sur les jeux uniquement", () => {
		expect(applyZeniRace("majin", 100)).toBe(100);
		expect(applyZeniRace("majin", 100, true)).toBe(150);
	});
	test("sans race / montant nul = inchangé", () => {
		expect(applyZeniRace(null, 100, true)).toBe(100);
		expect(applyZeniRace("terrien", 0)).toBe(0);
	});
});

describe("races — flags", () => {
	test("hasZenkai / hasRegen", () => {
		expect(hasZenkai("saiyen")).toBe(true);
		expect(hasZenkai("terrien")).toBe(false);
		expect(hasRegen("namek")).toBe(true);
		expect(hasRegen("majin")).toBe(false);
	});
});
