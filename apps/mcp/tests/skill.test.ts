/**
 * skill.test.ts — la skill Dragon Ball publiée sur le serveur MCP : resources
 * markdown + prompt `dragon_ball`. Serveur factice capturant les enregistrements.
 */
import { describe, expect, test } from "bun:test";
import { registerSkill, SKILL_RESOURCE_COUNT } from "../src/skill.ts";

interface Captured {
	resources: { name: string; uri: string; config: { mimeType?: string }; cb: (u: URL) => any }[];
	prompts: { name: string; config: Record<string, unknown>; cb: (a: any) => any }[];
}

function collect(): Captured {
	const resources: Captured["resources"] = [];
	const prompts: Captured["prompts"] = [];
	const fake = {
		registerTool() {},
		registerResource(name: string, uri: string, config: { mimeType?: string }, cb: (u: URL) => any) {
			resources.push({ name, uri, config, cb });
		},
		registerPrompt(name: string, config: Record<string, unknown>, cb: (a: any) => any) {
			prompts.push({ name, config, cb });
		},
	};
	registerSkill(fake as never);
	return { resources, prompts };
}

describe("skill MCP", () => {
	const { resources, prompts } = collect();

	test("enregistre les resources markdown (guide, api, lore, mcp-graphql)", () => {
		expect(resources.length).toBe(SKILL_RESOURCE_COUNT);
		expect(SKILL_RESOURCE_COUNT).toBeGreaterThanOrEqual(3);
		for (const r of resources) {
			expect(r.uri).toStartWith("dragonball://skill/");
			expect(r.config.mimeType).toBe("text/markdown");
		}
	});

	test("la resource guide lit un markdown non vide", () => {
		const guide = resources.find((r) => r.uri.endsWith("/guide"));
		expect(guide).toBeDefined();
		const res = guide!.cb(new URL(guide!.uri));
		expect(res.contents[0].uri).toBe("dragonball://skill/guide");
		expect(res.contents[0].text.length).toBeGreaterThan(200);
	});

	test("le prompt dragon_ball injecte le guide + la question optionnelle", () => {
		expect(prompts).toHaveLength(1);
		const p = prompts[0];
		expect(p.name).toBe("dragon_ball");
		const out = p.cb({ question: "qui est Goku" });
		const text = out.messages[0].content.text as string;
		expect(out.messages[0].role).toBe("user");
		expect(text).toContain("dragonballfr.com");
		expect(text).toContain("qui est Goku");
	});
});
