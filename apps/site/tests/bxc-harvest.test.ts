/**
 * Vérifie que le harvest utilise le vrai bxc du monorepo
 * (inventaire + résolution binaire + fichiers disque).
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { SFX_CATALOG } from "../scripts/asset-catalog";

const ROOT = join(import.meta.dir, "..");
const INV = join(ROOT, "public/bxc-asset-inventory.json");
const LOG = join(ROOT, "public/bxc-asset-harvest.log");
const SCRIPT = join(ROOT, "scripts/bxc-asset-harvest.ts");

describe("vrai bxc monorepo", () => {
	test("script harvest existe et référence execBxc / BXC_DIR / rag-harvest pattern", () => {
		expect(existsSync(SCRIPT)).toBe(true);
		const src = readFileSync(SCRIPT, "utf8");
		expect(src.includes("BXC_DIR")).toBe(true);
		expect(src.includes("execBxc")).toBe(true);
		expect(src.includes("rag-harvest")).toBe(true);
		// Doit invoquer les sous-commandes bxc réelles
		expect(src.includes('"scrape"') || src.includes("scrape")).toBe(true);
		expect(src.includes('"recon"') || src.includes("recon")).toBe(true);
		expect(src.includes('"mirror"') || src.includes("mirror")).toBe(true);
		// Ne doit PAS se contenter d'un fetch raw comme moteur principal
		expect(src.includes("BXC_BIN")).toBe(true);
	});

	test("inventaire bxc-asset-inventory prouve un run réel via bxc", async () => {
		expect(existsSync(INV)).toBe(true);
		const inv = JSON.parse(await Bun.file(INV).text()) as {
			engine: string;
			resolution: { onPath: boolean; hasBin: boolean; bin: string };
			summary: { ok: number; bytes: number; images: number };
			records: { ok: boolean; bytes: number; path: string; via: string }[];
		};
		expect(inv.engine).toBe("bxc");
		expect(inv.resolution.hasBin || inv.resolution.onPath).toBe(true);
		expect(inv.summary.ok).toBeGreaterThanOrEqual(1);
		expect(inv.summary.bytes).toBeGreaterThan(1000);
		const ok = inv.records.filter((r) => r.ok && r.bytes > 400);
		expect(ok.length).toBeGreaterThanOrEqual(1);
		// Au moins un via bxc-*
		expect(ok.some((r) => r.via.startsWith("bxc-"))).toBe(true);
		const disk = join(
			ROOT,
			ok[0]!.path.startsWith("public/") ? ok[0]!.path : `public/${ok[0]!.path}`
		);
		expect(existsSync(disk)).toBe(true);
		const buf = await Bun.file(disk).arrayBuffer();
		expect(buf.byteLength).toBeGreaterThan(400);
	});

	test("log prouve des appels `$ bxc scrape|recon|mirror`", () => {
		expect(existsSync(LOG)).toBe(true);
		const log = readFileSync(LOG, "utf8");
		expect(log.includes("$ bxc ")).toBe(true);
		const hasSub =
			log.includes("bxc scrape") ||
			log.includes("bxc recon") ||
			log.includes("bxc mirror") ||
			/\$ bxc (scrape|recon|mirror)/.test(log);
		expect(hasSub).toBe(true);
	});

	test("SFX home canoniques toujours présents", () => {
		expect(SFX_CATALOG.some((e) => e.role.includes("teleport"))).toBe(true);
		expect(SFX_CATALOG.some((e) => e.role === "kamehameha")).toBe(true);
		expect(existsSync(join(ROOT, "public/sfx/teleport.mp3"))).toBe(true);
		expect(existsSync(join(ROOT, "public/sfx/kamehameha.mp3"))).toBe(true);
	});
});
