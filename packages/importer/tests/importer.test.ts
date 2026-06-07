import { afterAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { dirname, importx, isESM, resolve } from "../src/index.js";

describe("@rpbey/importer", () => {
	describe("isESM", () => {
		test("returns true under Bun (import.meta.url is set)", () => {
			expect(isESM()).toBe(true);
		});
	});

	describe("dirname", () => {
		test("returns a non-empty string directory for a file:// url", () => {
			const dir = dirname("file:///some/where/mod.ts");
			expect(typeof dir).toBe("string");
			expect(dir.length).toBeGreaterThan(0);
			// Bun-native branch: returns import.meta.dir of the importer SRC module,
			// i.e. the package's own src directory (not the caller's).
			expect(dir).toBe(path.resolve(import.meta.dir, "..", "src"));
		});

		test("falls back to node:path.dirname for plain paths", () => {
			expect(dirname("/usr/local/lib/mod.ts")).toBe("/usr/local/lib");
		});
	});

	describe("resolve", () => {
		test("resolves a glob to file://-prefixed absolute paths", async () => {
			// Point the glob at this package's own source files.
			const pattern = path.join(import.meta.dir, "..", "src", "*.ts");
			const files = await resolve(pattern);

			expect(Array.isArray(files)).toBe(true);
			expect(files.length).toBeGreaterThan(0);

			for (const file of files) {
				expect(file.startsWith("file://")).toBe(true);
				// The bare path after the scheme must be absolute.
				expect(path.isAbsolute(file.slice("file://".length))).toBe(true);
			}

			// index.ts is the package entry — it must be in there.
			expect(files.some((f) => f.endsWith("/src/index.ts"))).toBe(true);
		});

		test("a single pattern yields a unique set of files", async () => {
			const pattern = path.join(import.meta.dir, "..", "src", "*.ts");
			const files = await resolve(pattern);
			const unique = new Set(files);
			// Within one scan, each matched file appears exactly once.
			expect(files.length).toBe(unique.size);
		});

		test(
			"DOCUMENTED SOURCE BEHAVIOUR: cross-pattern dedup is NOT performed " +
				"(the includes() guard compares a raw path against file://-prefixed " +
				"entries, so it never matches) — passing the same glob twice yields " +
				"duplicate file:// entries",
			async () => {
				const pattern = path.join(import.meta.dir, "..", "src", "*.ts");
				const files = await resolve(pattern, pattern);
				const unique = new Set(files);
				// Asserting the real (buggy) behaviour: duplicates survive.
				expect(files.length).toBeGreaterThan(unique.size);
			}
		);

		test("returns an empty array when a glob matches nothing in an existing dir", async () => {
			// Bun.Glob.scan throws on a non-existent cwd subtree, so target an
			// existing directory with a pattern that cannot match.
			const pattern = path.join(import.meta.dir, "..", "src", "*.__nope_ext__");
			expect(await resolve(pattern)).toEqual([]);
		});
	});

	describe("importx", () => {
		let tmpDir: string;

		afterAll(async () => {
			if (tmpDir) {
				await rm(tmpDir, { force: true, recursive: true });
			}
		});

		test("actually imports a matched module (observable side effect)", async () => {
			tmpDir = await mkdtemp(path.join(os.tmpdir(), "rpbey-importx-"));
			const modPath = path.join(tmpDir, "side-effect.ts");

			// A real module whose top-level body mutates globalThis on import.
			const marker = `__rpbey_importx_${Date.now()}__`;
			await Bun.write(
				modPath,
				`(globalThis as Record<string, unknown>)[${JSON.stringify(
					marker
				)}] = "loaded";\nexport const ok = true;\n`
			);

			const g = globalThis as Record<string, unknown>;
			expect(g[marker]).toBeUndefined();

			await importx(path.join(tmpDir, "*.ts"));

			// If importx truly imported the file, the side effect ran.
			expect(g[marker]).toBe("loaded");

			delete g[marker];
		});
	});
});
