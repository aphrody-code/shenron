/**
 * tools.test.ts — invariants du catalogue d'outils MCP + comportement des
 * handlers (succès/erreur). On enregistre les outils sur un serveur factice qui
 * capture les appels `registerTool` (aucune dépendance au transport SDK).
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { registerAllTools } from "../src/tools.ts";

interface Recorded {
	name: string;
	config: {
		title?: string;
		description?: string;
		inputSchema?: Record<string, unknown>;
		annotations?: Record<string, unknown>;
	};
	handler: (args: any) => Promise<{ content: { type: string; text: string }[]; isError?: boolean }>;
}

function collectTools(): Recorded[] {
	const tools: Recorded[] = [];
	const fakeServer = {
		registerTool(name: string, config: Recorded["config"], handler: Recorded["handler"]) {
			tools.push({ name, config, handler });
		},
	};
	registerAllTools(fakeServer as never);
	return tools;
}

const realFetch = globalThis.fetch;
afterEach(() => {
	globalThis.fetch = realFetch;
});

describe("catalogue d'outils", () => {
	const tools = collectTools();

	test("expose exactement 14 outils", () => {
		expect(tools).toHaveLength(14);
	});

	test("noms snake_case, ≤ 64 caractères, uniques", () => {
		const names = tools.map((t) => t.name);
		for (const n of names) {
			expect(n.length).toBeLessThanOrEqual(64);
			expect(n).toMatch(/^[a-z0-9_]+$/);
		}
		expect(new Set(names).size).toBe(names.length);
	});

	test("tous lecture seule (readOnlyHint), non destructifs, avec title + description", () => {
		for (const t of tools) {
			expect(t.config.annotations?.readOnlyHint).toBe(true);
			expect(t.config.annotations?.destructiveHint).toBe(false);
			expect(typeof t.config.title).toBe("string");
			expect((t.config.title as string).length).toBeGreaterThan(0);
			expect((t.config.description as string).length).toBeGreaterThan(0);
		}
	});

	test("les outils attendus sont présents", () => {
		const names = new Set(tools.map((t) => t.name));
		for (const expected of [
			"rag_search",
			"rag_ask",
			"wiki_search",
			"wiki_list",
			"wiki_get",
			"manga_search",
			"bot_stats",
			"news",
		]) {
			expect(names.has(expected)).toBe(true);
		}
	});
});

describe("handlers", () => {
	const tools = collectTools();
	const ragSearch = tools.find((t) => t.name === "rag_search")!;

	beforeEach(() => {
		globalThis.fetch = (() =>
			Promise.resolve(
				new Response(JSON.stringify({ q: "goku", mode: "hybrid", results: [{ url: "/wiki/x" }] }), {
					status: 200,
					headers: { "content-type": "application/json" },
				})
			)) as typeof fetch;
	});

	test("rag_search renvoie un bloc texte JSON (et absolutise les url)", async () => {
		const res = await ragSearch.handler({ query: "goku", limit: 3 });
		expect(res.isError).toBeUndefined();
		expect(res.content[0].type).toBe("text");
		const parsed = JSON.parse(res.content[0].text);
		expect(parsed.mode).toBe("hybrid");
		expect(parsed.results[0].url).toStartWith("https://");
	});

	test("erreur upstream → résultat isError (jamais d'exception)", async () => {
		globalThis.fetch = (() =>
			Promise.resolve(new Response("nope", { status: 500 }))) as typeof fetch;
		const res = await ragSearch.handler({ query: "goku" });
		expect(res.isError).toBe(true);
		expect(res.content[0].text).toContain("Erreur");
	});
});
