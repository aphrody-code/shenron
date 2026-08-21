/**
 * Résolution de la configuration de l'accueil (`resolveHomeConfig`).
 *
 * Remplace `home-fx.test.ts`, qui couvrait le sous-système VFX/SFX supprimé le
 * 2026-08-21 : l'accueil défile désormais normalement et n'a plus ni son ni
 * effet, donc plus de `fx` en configuration. Ce qui reste — et qui compte — est
 * la fusion défensive d'un document partiel venu de la base : un patch ne doit
 * jamais faire disparaître le héro ni les sections.
 *
 * Cas vécu à ne pas régresser : un document enregistré AVANT la suppression
 * porte encore une clé `fx`. Elle doit être ignorée sans rien casser.
 */
import { describe, expect, test } from "bun:test";
import { DEFAULT_HOME_CONFIG, resolveHomeConfig } from "../src/lib/home-scenes";

describe("resolveHomeConfig", () => {
	test("un document quasi vide retombe sur les défauts complets", () => {
		const cfg = resolveHomeConfig({ version: 1 });
		expect(cfg.hero.scenes.length).toBeGreaterThan(0);
		expect(cfg.sections.length).toBe(DEFAULT_HOME_CONFIG.sections.length);
	});

	test("un patch partiel ne perd pas le reste", () => {
		const cfg = resolveHomeConfig({ hero: { lede: "Test lede custom" } });
		expect(cfg.hero.lede).toBe("Test lede custom");
		expect(cfg.hero.scenes.length).toBeGreaterThan(0);
		expect(cfg.sections.length).toBe(DEFAULT_HOME_CONFIG.sections.length);
	});

	test("une clé `fx` héritée est ignorée sans rien casser", () => {
		const cfg = resolveHomeConfig({
			fx: { sfxVolume: 0.4, vfx: { kameCss: true } },
			hero: { lede: "Avec fx legacy" },
		}) as Record<string, unknown>;
		expect(cfg.fx).toBeUndefined();
		expect((cfg.hero as { lede: string }).lede).toBe("Avec fx legacy");
		expect((cfg.sections as unknown[]).length).toBe(DEFAULT_HOME_CONFIG.sections.length);
	});

	test("n'importe quoi en entrée reste résolvable", () => {
		for (const entree of [null, undefined, 42, "x", [], { sections: "pas un tableau" }]) {
			const cfg = resolveHomeConfig(entree as never);
			expect(cfg.version).toBe(1);
			expect(Array.isArray(cfg.sections)).toBe(true);
			expect(cfg.sections.length).toBeGreaterThan(0);
		}
	});
});
