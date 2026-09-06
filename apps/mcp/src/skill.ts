/**
 * skill.ts — Publie la « skill » Dragon Ball SUR le serveur MCP.
 *
 * En plus des 14 outils, le serveur expose la skill de deux façons MCP-natives :
 *   - **resources** : les documents (guide, API, lore, MCP/GraphQL) lisibles par
 *     le client via resources/read ;
 *   - **prompt** `dragon_ball` : injecte le guide d'utilisation (quand utiliser
 *     quel outil, citer les sources, repères canon) dans la conversation.
 *
 * Les documents sont vendorés dans `apps/mcp/skill/` (lus une fois au démarrage,
 * relatifs au module — robuste quel que soit le cwd).
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v3";

interface SkillDoc {
	key: string;
	uri: string;
	title: string;
	description: string;
	text: string;
}

async function load(file: string): Promise<string> {
	try {
		return await Bun.file(new URL(`../skill/${file}`, import.meta.url)).text();
	} catch {
		return "";
	}
}

/** Guide principal — réutilisé tel quel par le prompt. */
const GUIDE = await load("guide.md");

const DOCS: SkillDoc[] = [
	{
		key: "guide",
		uri: "dragonball://skill/guide",
		title: "Dragon Ball — guide d'exploration",
		description:
			"Quand utiliser quel outil (RAG / wiki / GraphQL), comment citer les sources, repères canon.",
		text: GUIDE,
	},
	{
		key: "api",
		uri: "dragonball://skill/api",
		title: "API REST publique — catalogue",
		description: "Catalogue complet des endpoints publics dragonballfr.com (+ exemples curl).",
		text: await load("api.md"),
	},
	{
		key: "lore",
		uri: "dragonball://skill/lore",
		title: "Référence canon Dragon Ball",
		description: "Séries, sagas, transformations, races, Dragon Balls — repères canon hors-ligne.",
		text: await load("lore.md"),
	},
	{
		key: "mcp-graphql",
		uri: "dragonball://skill/mcp-graphql",
		title: "Serveur MCP & GraphQL",
		description: "Connexion au serveur MCP + requêtes GraphQL relationnelles.",
		text: await load("mcp-graphql.md"),
	},
].filter((d) => d.text.length > 0);

/** Nombre de resources réellement chargées (pour la sonde /health & la doc). */
export const SKILL_RESOURCE_COUNT = DOCS.length;

/** Enregistre les resources + le prompt de la skill Dragon Ball sur un serveur. */
export function registerSkill(rawServer: McpServer): void {
	const server = rawServer as unknown as {
		registerTool(name: string, config: any, handler: (args: any, extra: any) => unknown): unknown;
		registerResource(...args: any[]): unknown;
		registerPrompt(name: string, config: any, handler: (args: any) => unknown): unknown;
	};
	for (const d of DOCS) {
		server.registerResource(
			d.key,
			d.uri,
			{ title: d.title, description: d.description, mimeType: "text/markdown" },
			(uri: URL) => ({
				contents: [{ uri: uri.href, mimeType: "text/markdown", text: d.text }],
			})
		);
	}

	server.registerPrompt(
		"dragon_ball",
		{
			title: "Dragon Ball — guide d'exploration (dragonballfr.com)",
			description:
				"Charge le guide d'utilisation de la base Dragon Ball : quand utiliser rag_search vs wiki_* vs GraphQL, comment citer les sources, repères canon. Passe une question optionnelle pour la cadrer.",
			argsSchema: { question: z.string().optional() },
		},
		({ question }) => {
			const intro =
				"Tu es connecté au serveur MCP Dragon Ball (mcp.dragonballfr.com). Réponds aux questions Dragon Ball en t'appuyant sur ses outils (rag_search, rag_ask, wiki_search, wiki_list, wiki_get, manga_*, bot_*, news) plutôt que sur ta mémoire, et cite les sources. Guide d'utilisation ci-dessous.";
			const qline = question ? `\n\n---\nQuestion à traiter : ${question}` : "";
			return {
				messages: [
					{ role: "user", content: { type: "text", text: `${intro}\n\n${GUIDE}${qline}` } },
				],
			};
		}
	);
}
