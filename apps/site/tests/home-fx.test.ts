/**
 * Tests du resolve/apply VFX-SFX home — exerce les helpers SHIPPED
 * (`resolveHomeFx`, `resolveHomeConfig`, `homeFxToConfigureArgs`).
 */
import { describe, expect, test } from "bun:test";
import {
	DEFAULT_HOME_FX,
	HOME_SFX_SLOTS,
	homeFxToConfigureArgs,
	resolveHomeFx,
} from "../src/lib/home-fx";
import { DEFAULT_HOME_CONFIG, resolveHomeConfig } from "../src/lib/home-scenes";

describe("resolveHomeFx", () => {
	test("patch vide → defaults clone", () => {
		const fx = resolveHomeFx(undefined);
		expect(fx.enabled).toBe(true);
		expect(fx.sfxVolume).toBe(DEFAULT_HOME_FX.sfxVolume);
		expect(fx.sectionEnterSfx).toBe(true);
		expect(fx.vfx.kameCss).toBe(true);
		expect(fx.vfx.battleCanvas).toBe(false);
		expect(fx.vfx.kiAura).toBe(false);
		expect(fx.vfx.sceneAura).toBe(false);
		// clone défensif
		fx.vfx.kameCss = false;
		expect(DEFAULT_HOME_FX.vfx.kameCss).toBe(true);
	});

	test("legacy sfxVolume seul (DB orphelin) est absorbé", () => {
		const fx = resolveHomeFx({ sfxVolume: 0.4 });
		expect(fx.sfxVolume).toBeCloseTo(0.4, 5);
		expect(fx.enabled).toBe(true);
		expect(fx.vfx.kameCss).toBe(true);
		expect(Object.keys(fx.sfxMap)).toHaveLength(0);
	});

	test("volume clampé 0–1", () => {
		expect(resolveHomeFx({ sfxVolume: 2 }).sfxVolume).toBe(1);
		expect(resolveHomeFx({ sfxVolume: -1 }).sfxVolume).toBe(0);
		expect(resolveHomeFx({ sfxVolume: "0.33" }).sfxVolume).toBeCloseTo(0.33, 5);
		expect(resolveHomeFx({ sfxVolume: "nope" }).sfxVolume).toBe(DEFAULT_HOME_FX.sfxVolume);
	});

	test("map de slots connus + refuse path traversal", () => {
		const fx = resolveHomeFx({
			sfxMap: {
				teleport: "/sfx/teleport2.mp3",
				kamehameha: "/sfx/../etc/passwd",
				click: null,
				unknown: "/sfx/x.mp3",
			},
		});
		expect(fx.sfxMap.teleport).toBe("/sfx/teleport2.mp3");
		expect(fx.sfxMap.kamehameha).toBeUndefined();
		expect(fx.sfxMap.click).toBeNull();
		expect((fx.sfxMap as Record<string, unknown>).unknown).toBeUndefined();
	});

	test("toggles VFX + sectionEnterSfx", () => {
		const fx = resolveHomeFx({
			enabled: false,
			sectionEnterSfx: false,
			vfx: { battleCanvas: true, kiAura: true, sceneAura: true, kameCss: false },
		});
		expect(fx.enabled).toBe(false);
		expect(fx.sectionEnterSfx).toBe(false);
		expect(fx.vfx.battleCanvas).toBe(true);
		expect(fx.vfx.kiAura).toBe(true);
		expect(fx.vfx.sceneAura).toBe(true);
		expect(fx.vfx.kameCss).toBe(false);
	});
});

describe("resolveHomeConfig + fx", () => {
	test("sans fx → defaults complets (hero/sections préservés)", () => {
		const cfg = resolveHomeConfig({ version: 1 });
		expect(cfg.fx.sfxVolume).toBe(DEFAULT_HOME_FX.sfxVolume);
		expect(cfg.hero.scenes.length).toBeGreaterThan(0);
		expect(cfg.sections.length).toBeGreaterThan(0);
		expect(cfg.fx).toBeDefined();
	});

	test("patch partial fx.sfxVolume ne perd pas le reste", () => {
		const cfg = resolveHomeConfig({
			fx: { sfxVolume: 0.4 },
			hero: { lede: "Test lede custom" },
		});
		expect(cfg.fx.sfxVolume).toBeCloseTo(0.4, 5);
		expect(cfg.fx.enabled).toBe(true);
		expect(cfg.hero.lede).toBe("Test lede custom");
		expect(cfg.sections.length).toBe(DEFAULT_HOME_CONFIG.sections.length);
	});

	test("DEFAULT_HOME_CONFIG embarque fx", () => {
		expect(DEFAULT_HOME_CONFIG.fx).toBeDefined();
		expect(DEFAULT_HOME_CONFIG.fx.vfx.sceneAura).toBe(false);
	});
});

describe("homeFxToConfigureArgs", () => {
	test("produit map + opts pour configureSfx", () => {
		const fx = resolveHomeFx({
			sfxVolume: 0.25,
			enabled: false,
			sfxMap: { teleport: "/sfx/teleport3.mp3" },
		});
		const { map, opts } = homeFxToConfigureArgs(fx);
		expect(opts.volume).toBeCloseTo(0.25, 5);
		expect(opts.enabled).toBe(false);
		expect(map.teleport).toBe("/sfx/teleport3.mp3");
	});

	test("tous les slots HOME_SFX_SLOTS sont documentés", () => {
		expect(HOME_SFX_SLOTS.length).toBeGreaterThanOrEqual(8);
		for (const s of HOME_SFX_SLOTS) {
			expect(typeof s).toBe("string");
		}
	});
});
