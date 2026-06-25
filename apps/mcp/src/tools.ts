/**
 * tools.ts — Catalogue d'outils MCP (lecture seule) exposant le RAG et l'API
 * publique Dragon Ball de dragonballfr.com.
 *
 * Conventions (cf. critères d'admission de l'annuaire Claude) :
 *   - nom ≤ 64 car., snake_case ;
 *   - chaque outil porte `title`, `readOnlyHint: true`, `destructiveHint: false`
 *     (tous les outils sont en lecture seule — aucun écrit) ;
 *   - `openWorldHint: true` (ils interrogent une API REST externe) ;
 *   - la description DÉCRIT ce que fait l'outil et nomme l'API cible ; elle ne
 *     dicte AUCUN comportement à l'assistant (règle anti-injection) ;
 *   - résultat = bloc texte JSON (seul format lu par toutes les surfaces),
 *     tronqué à ~90 000 caractères avec mention explicite.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { absolutize, apiGet, ApiError, apiPost } from "./api.ts";

const MAX_RESULT_CHARS = 90_000;

interface ToolResult {
	// Index signature requise par le type CallToolResult du SDK.
	[x: string]: unknown;
	content: { type: "text"; text: string }[];
	isError?: boolean;
}

/** Sérialise un résultat en bloc texte JSON, tronqué proprement si trop long. */
function jsonResult(data: unknown): ToolResult {
	let text = JSON.stringify(absolutize(data), null, 2);
	if (text.length > MAX_RESULT_CHARS) {
		text =
			text.slice(0, MAX_RESULT_CHARS) +
			`\n\n… [résultat tronqué à ${MAX_RESULT_CHARS} caractères — affinez la requête ou réduisez 'limit']`;
	}
	return { content: [{ type: "text", text }] };
}

/** Transforme une erreur en résultat MCP `isError` avec un message spécifique. */
function errorResult(err: unknown): ToolResult {
	const msg =
		err instanceof ApiError
			? err.message
			: err instanceof Error
				? err.message
				: "Erreur inconnue";
	return { content: [{ type: "text", text: `Erreur : ${msg}` }], isError: true };
}

const READ_ANNOTATIONS = {
	readOnlyHint: true,
	destructiveHint: false,
	openWorldHint: true,
} as const;

const WIKI_LIST_CATEGORIES = [
	"characters",
	"planets",
	"races",
	"techniques",
	"transformations",
	"sagas",
	"episodes",
	"movies",
	"games",
] as const;

const WIKI_GET_CATEGORIES = [
	"characters",
	"planets",
	"races",
	"techniques",
	"sagas",
	"movies",
	"games",
	"episodes",
] as const;

export function registerAllTools(server: McpServer): void {
	// ── RAG ────────────────────────────────────────────────────────────────
	server.registerTool(
		"rag_search",
		{
			title: "Recherche RAG Dragon Ball",
			description:
				"Recherche hybride (BM25 lexical + embeddings sémantiques, fusion RRF, reranking) dans la base de connaissances Dragon Ball de dragonballfr.com (manga, Fandom, databooks). Renvoie des passages sourcés (rowid, kind, title, url, snippet, score) classés par pertinence, plus le `mode` effectif (hybrid+rerank | hybrid | lexical). `score` ∈ [0,1] est comparable UNIQUEMENT entre hits d'une même réponse. Les passages sont dédupliqués par source (pas de doublon d'URL). Idéal pour les questions factuelles en langage naturel (FR/EN/JP) — lis 3 à 5 passages et cite leurs `url`. Filtres optionnels : `lang`, `entity`, `sourceId`. API : bot.dragonballfr.com/api/public/rag/search.",
			inputSchema: {
				query: z.string().min(2).describe("Question ou mots-clés en langage naturel"),
				limit: z
					.number()
					.int()
					.min(1)
					.max(25)
					.optional()
					.describe("Nombre de passages à renvoyer (défaut 8, max 25)"),
				lang: z
					.string()
					.optional()
					.describe("Filtrer par langue des documents (ex. 'fr', 'en')"),
				entity: z
					.string()
					.optional()
					.describe("Filtrer par entité/personnage indexé (ex. 'Son Goku', 'Vegeta')"),
				sourceId: z
					.string()
					.optional()
					.describe("Filtrer par source/corpus (ex. 'manga', 'fandom-fr', 'db_characters')"),
			},
			annotations: { title: "Recherche RAG Dragon Ball", ...READ_ANNOTATIONS },
		},
		async ({ query, limit, lang, entity, sourceId }) => {
			try {
				return jsonResult(
					await apiGet("/api/public/rag/search", { q: query, limit, lang, entity, sourceId })
				);
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"rag_ask",
		{
			title: "Question RAG + passages sourcés (hits)",
			description:
				"Pose une question en langage naturel sur Dragon Ball et renvoie les passages les plus pertinents (`hits`, dédupliqués + scorés) plus le `mode`, accompagnés d'une prose `answer`. IMPORTANT : le rédacteur LLM est actuellement hors-ligne — `answer` est un message de repli, FIE-TOI aux `hits` sourcés (chacun a une `url` à citer), pas à la prose. Pour une simple recherche, préfère rag_search (plus rapide). API : bot.dragonballfr.com/api/public/rag/chat.",
			inputSchema: {
				question: z.string().min(2).describe("La question à poser, en langage naturel"),
			},
			annotations: { title: "Réponse rédigée (RAG génératif)", ...READ_ANNOTATIONS },
		},
		async ({ question }) => {
			try {
				// q passé EN query-string ET dans le body : l'endpoint rag/chat lit
				// la query-string ; le body est envoyé en complément (rétro/anté-compat).
				const path = `/api/public/rag/chat?q=${encodeURIComponent(question)}`;
				return jsonResult(await apiPost(path, { q: question }, 90_000));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"sources",
		{
			title: "Sources indexées du RAG",
			description:
				"Liste les sources/corpus indexés par le RAG (origine des connaissances : manga, Fandom, databooks…). API : bot.dragonballfr.com/api/public/sources.",
			inputSchema: {},
			annotations: { title: "Sources indexées du RAG", ...READ_ANNOTATIONS },
		},
		async () => {
			try {
				return jsonResult(await apiGet("/api/public/sources"));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	// ── Wiki ───────────────────────────────────────────────────────────────
	server.registerTool(
		"wiki_search",
		{
			title: "Recherche plein-texte du wiki",
			description:
				"Recherche plein-texte dans le wiki Dragon Ball de dragonballfr.com (personnages, planètes, races, sagas, techniques, transformations, épisodes, films, jeux). API : bot.dragonballfr.com/api/public/wiki/search.",
			inputSchema: {
				query: z.string().min(1).describe("Termes recherchés"),
				limit: z.number().int().min(1).max(50).optional().describe("Nombre de résultats (défaut 20)"),
			},
			annotations: { title: "Recherche plein-texte du wiki", ...READ_ANNOTATIONS },
		},
		async ({ query, limit }) => {
			try {
				return jsonResult(await apiGet("/api/public/wiki/search", { q: query, limit }));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"wiki_list",
		{
			title: "Liste d'entités du wiki",
			description:
				"Liste paginée d'entités du wiki Dragon Ball par catégorie. API : bot.dragonballfr.com/api/public/wiki/{category}.",
			inputSchema: {
				category: z
					.enum(WIKI_LIST_CATEGORIES)
					.describe("Catégorie d'entités à lister"),
				limit: z.number().int().min(1).max(200).optional().describe("Taille de page (défaut 50)"),
				offset: z.number().int().min(0).optional().describe("Décalage de pagination (défaut 0)"),
			},
			annotations: { title: "Liste d'entités du wiki", ...READ_ANNOTATIONS },
		},
		async ({ category, limit, offset }) => {
			try {
				return jsonResult(await apiGet(`/api/public/wiki/${category}`, { limit, offset }));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"wiki_get",
		{
			title: "Détail d'une entité du wiki",
			description:
				"Détail d'une entité précise du wiki Dragon Ball par identifiant numérique ou slug. API : bot.dragonballfr.com/api/public/wiki/{category}/{id}.",
			inputSchema: {
				category: z.enum(WIKI_GET_CATEGORIES).describe("Catégorie de l'entité"),
				id: z.string().min(1).describe("Identifiant numérique ou slug de l'entité"),
			},
			annotations: { title: "Détail d'une entité du wiki", ...READ_ANNOTATIONS },
		},
		async ({ category, id }) => {
			try {
				return jsonResult(
					await apiGet(`/api/public/wiki/${category}/${encodeURIComponent(id)}`)
				);
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	// ── Manga ──────────────────────────────────────────────────────────────
	server.registerTool(
		"manga_search",
		{
			title: "Recherche dans le manga",
			description:
				"Recherche textuelle (OCR) dans les planches du manga Dragon Ball auto-hébergé sur dragonballfr.com. API : bot.dragonballfr.com/api/public/manga/search.",
			inputSchema: {
				query: z.string().min(1).describe("Texte recherché dans les planches"),
				limit: z.number().int().min(1).max(50).optional().describe("Nombre de résultats (défaut 20)"),
			},
			annotations: { title: "Recherche dans le manga", ...READ_ANNOTATIONS },
		},
		async ({ query, limit }) => {
			try {
				return jsonResult(await apiGet("/api/public/manga/search", { q: query, limit }));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"manga_tomes",
		{
			title: "Tomes du manga",
			description:
				"Liste les tomes du manga Dragon Ball, ou le détail d'un tome (avec ses planches) si série + tome sont fournis. API : bot.dragonballfr.com/api/public/manga/tomes.",
			inputSchema: {
				series: z.string().optional().describe("Slug de la série (ex. 'dragon-ball'); omettre pour tout lister"),
				tome: z.number().int().min(1).optional().describe("Numéro de tome (requiert 'series')"),
			},
			annotations: { title: "Tomes du manga", ...READ_ANNOTATIONS },
		},
		async ({ series, tome }) => {
			try {
				const path =
					series && tome
						? `/api/public/manga/tomes/${encodeURIComponent(series)}/${tome}`
						: "/api/public/manga/tomes";
				return jsonResult(await apiGet(path));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"manga_page",
		{
			title: "Planche de manga",
			description:
				"Métadonnées et URL d'image d'une planche précise du manga Dragon Ball. API : bot.dragonballfr.com/api/public/manga/page/{series}/{tome}/{planche}.",
			inputSchema: {
				series: z.string().min(1).describe("Slug de la série (ex. 'dragon-ball')"),
				tome: z.number().int().min(1).describe("Numéro de tome"),
				planche: z.number().int().min(1).describe("Numéro de planche"),
			},
			annotations: { title: "Planche de manga", ...READ_ANNOTATIONS },
		},
		async ({ series, tome, planche }) => {
			try {
				return jsonResult(
					await apiGet(`/api/public/manga/page/${encodeURIComponent(series)}/${tome}/${planche}`)
				);
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	// ── Bot / serveur Discord ────────────────────────────────────────────────
	server.registerTool(
		"bot_stats",
		{
			title: "Statistiques du bot",
			description:
				"Statistiques publiques du bot Discord Dragon Ball et de son serveur (membres, niveaux, activité…). API : bot.dragonballfr.com/api/public/stats.",
			inputSchema: {},
			annotations: { title: "Statistiques du bot", ...READ_ANNOTATIONS },
		},
		async () => {
			try {
				return jsonResult(await apiGet("/api/public/stats"));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"bot_personas",
		{
			title: "Personas du bot",
			description:
				"Liste les 6 personas Dragon Ball du bot (Shenron, Beerus, Whis, Grand Prêtre, Enma, Kaïo) et leur état de présence. API : bot.dragonballfr.com/api/public/personas.",
			inputSchema: {},
			annotations: { title: "Personas du bot", ...READ_ANNOTATIONS },
		},
		async () => {
			try {
				return jsonResult(await apiGet("/api/public/personas"));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"bot_leaderboard",
		{
			title: "Classement des membres",
			description:
				"Classement public des membres du serveur Discord par niveau/XP. API : bot.dragonballfr.com/api/public/leaderboard.",
			inputSchema: {
				limit: z.number().int().min(1).max(100).optional().describe("Taille du classement (défaut 20)"),
			},
			annotations: { title: "Classement des membres", ...READ_ANNOTATIONS },
		},
		async ({ limit }) => {
			try {
				return jsonResult(await apiGet("/api/public/leaderboard", { limit }));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"bot_commands",
		{
			title: "Commandes du bot",
			description:
				"Liste les commandes Discord publiques du bot Dragon Ball. API : bot.dragonballfr.com/api/public/commands.",
			inputSchema: {},
			annotations: { title: "Commandes du bot", ...READ_ANNOTATIONS },
		},
		async () => {
			try {
				return jsonResult(await apiGet("/api/public/commands"));
			} catch (err) {
				return errorResult(err);
			}
		}
	);

	server.registerTool(
		"news",
		{
			title: "Actualités Dragon Ball",
			description:
				"Dernières actualités Dragon Ball publiées sur dragonballfr.com. API : bot.dragonballfr.com/api/public/news.",
			inputSchema: {
				limit: z.number().int().min(1).max(50).optional().describe("Nombre d'articles (défaut 10)"),
			},
			annotations: { title: "Actualités Dragon Ball", ...READ_ANNOTATIONS },
		},
		async ({ limit }) => {
			try {
				return jsonResult(await apiGet("/api/public/news", { limit }));
			} catch (err) {
				return errorResult(err);
			}
		}
	);
}
