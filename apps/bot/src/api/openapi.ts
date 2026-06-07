/**
 * openapi.ts — Spécification OpenAPI 3.1 de l'API publique Dragon Ball France.
 *
 * Décrit la surface REST publique (`/api/public/*`) : wiki, RAG hybride, stats,
 * personas, économie, médias. Servie à `/api/openapi.json`, explorable via
 * l'UI Scalar à `/api/docs`. Source de vérité = les handlers de `server.ts`.
 *
 * Document statique (pas de génération runtime) — à tenir à jour avec les
 * routes. Volontairement ciblé sur les endpoints publics stables.
 */

const SITE = "https://dragonballfr.com";

// Schémas réutilisables (composants).
const schemas = {
	Character: {
		type: "object",
		properties: {
			id: { type: "integer" },
			name: { type: "string" },
			name_ja: { type: "string", nullable: true },
			name_romaji: { type: "string", nullable: true },
			image: { type: "string", nullable: true },
			ki: { type: "string", nullable: true },
			max_ki: { type: "string", nullable: true },
			race: { type: "string", nullable: true },
			gender: { type: "string", nullable: true },
			affiliation: { type: "string", nullable: true },
			description: { type: "string", nullable: true },
			origin_planet_id: { type: "integer", nullable: true },
		},
	},
	Planet: {
		type: "object",
		properties: {
			id: { type: "integer" },
			name: { type: "string" },
			name_ja: { type: "string", nullable: true },
			image: { type: "string", nullable: true },
			is_destroyed: { type: "integer", description: "0 | 1" },
			description: { type: "string", nullable: true },
		},
	},
	Saga: {
		type: "object",
		properties: {
			id: { type: "integer" },
			slug: { type: "string" },
			name: { type: "string" },
			name_ja: { type: "string", nullable: true },
			series: { type: "string", nullable: true },
			order_idx: { type: "integer", nullable: true },
			description: { type: "string", nullable: true },
			image: { type: "string", nullable: true },
		},
	},
	Episode: {
		type: "object",
		properties: {
			id: { type: "integer" },
			series: { type: "string" },
			number_in_series: { type: "integer" },
			title: { type: "string" },
			title_ja: { type: "string", nullable: true },
			synopsis: { type: "string", nullable: true },
			image: { type: "string", nullable: true },
			air_date: { type: "string", nullable: true },
		},
	},
	Technique: {
		type: "object",
		properties: {
			id: { type: "integer" },
			slug: { type: "string" },
			name: { type: "string" },
			name_ja: { type: "string", nullable: true },
			type: { type: "string", nullable: true },
			description: { type: "string", nullable: true },
			creator_id: { type: "integer", nullable: true },
		},
	},
	Transformation: {
		type: "object",
		properties: {
			id: { type: "integer" },
			name: { type: "string" },
			image: { type: "string", nullable: true },
			ki: { type: "string", nullable: true },
			character_id: { type: "integer", nullable: true },
		},
	},
	Movie: {
		type: "object",
		properties: {
			id: { type: "integer" },
			slug: { type: "string" },
			title: { type: "string" },
			series: { type: "string", nullable: true },
			synopsis: { type: "string", nullable: true },
			poster: { type: "string", nullable: true },
			trailer_url: { type: "string", nullable: true },
			release_date: { type: "string", nullable: true },
		},
	},
	Game: {
		type: "object",
		properties: {
			id: { type: "integer" },
			slug: { type: "string" },
			title: { type: "string" },
			platforms: { type: "string", nullable: true },
			publisher: { type: "string", nullable: true },
			developer: { type: "string", nullable: true },
			cover: { type: "string", nullable: true },
		},
	},
	Race: {
		type: "object",
		properties: {
			id: { type: "integer" },
			slug: { type: "string" },
			name: { type: "string" },
			name_ja: { type: "string", nullable: true },
			description: { type: "string", nullable: true },
		},
	},
	RagHit: {
		type: "object",
		properties: {
			kind: {
				type: "string",
				description:
					"character | planet | race | technique | transformation | saga | movie | game | episode | source",
			},
			title: { type: "string" },
			url: { type: "string", description: "Chemin relatif au site (préfixer par le domaine)." },
			snippet: { type: "string" },
		},
	},
	RagResponse: {
		type: "object",
		properties: {
			q: { type: "string" },
			mode: { type: "string", enum: ["hybrid", "lexical"] },
			results: { type: "array", items: { $ref: "#/components/schemas/RagHit" } },
		},
	},
	Persona: {
		type: "object",
		properties: {
			id: { type: "string" },
			name: { type: "string" },
			online: { type: "boolean" },
		},
	},
} as const;

const limitParam = (def: number, max: number) => ({
	name: "limit",
	in: "query",
	required: false,
	schema: { type: "integer", default: def, minimum: 1, maximum: max },
});
const offsetParam = {
	name: "offset",
	in: "query",
	required: false,
	schema: { type: "integer", default: 0, minimum: 0 },
};

const listResp = (ref: string, key: string) => ({
	"200": {
		description: "OK",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: { [key]: { type: "array", items: { $ref: `#/components/schemas/${ref}` } } },
				},
			},
		},
	},
});
const itemResp = (ref: string) => ({
	"200": {
		description: "OK",
		content: { "application/json": { schema: { $ref: `#/components/schemas/${ref}` } } },
	},
	"404": { description: "Introuvable" },
});

export const openapiSpec = {
	openapi: "3.1.0",
	info: {
		title: "Dragon Ball France — API publique",
		version: "1.0.0",
		description:
			"API REST publique du wiki Dragon Ball France (personnages, planètes, sagas, " +
			"épisodes, techniques, films, jeux), recherche RAG hybride (BM25 + embeddings " +
			"sémantiques), statistiques du bot et médias générés.\n\n" +
			`Une **API GraphQL** équivalente (read-only) est aussi disponible sur \`/graphql\` ` +
			"(GraphiQL inclus).\n\nLecture seule, sans authentification. Rate-limit 60 req/min/IP, " +
			"CORS restreint. Données canon, sourcées.",
		contact: { name: "Dragon Ball France", url: SITE },
		license: { name: "Données sous attributions multiples (voir /api/public/sources)" },
	},
	servers: [{ url: "https://bot.dragonballfr.com", description: "Production" }],
	tags: [
		{ name: "RAG", description: "Recherche sémantique hybride sur les archives." },
		{ name: "Wiki", description: "Entités encyclopédiques Dragon Ball." },
		{ name: "Insights", description: "Statistiques bot, personas, commandes." },
		{ name: "Médias", description: "Images générées (cartes de profil)." },
	],
	paths: {
		"/api/public/rag/search": {
			get: {
				tags: ["RAG"],
				summary: "Recherche RAG hybride",
				description:
					"Fusion RRF de BM25 (lexical) et d'embeddings denses multilingues (sémantique). " +
					"Idéale pour les questions en langage naturel. Dégrade en lexical si le moteur " +
					"sémantique est indisponible (`mode`).",
				parameters: [
					{
						name: "q",
						in: "query",
						required: true,
						schema: { type: "string", minLength: 2 },
						example: "comment Goku devient super saiyan",
					},
					limitParam(8, 25),
				],
				responses: {
					"200": {
						description: "OK",
						content: {
							"application/json": { schema: { $ref: "#/components/schemas/RagResponse" } },
						},
					},
				},
			},
		},
		"/api/public/wiki/characters": {
			get: {
				tags: ["Wiki"],
				summary: "Liste des personnages",
				parameters: [limitParam(50, 200), offsetParam],
				responses: listResp("Character", "characters"),
			},
		},
		"/api/public/wiki/characters/{id}": {
			get: {
				tags: ["Wiki"],
				summary: "Fiche personnage",
				parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
				responses: itemResp("Character"),
			},
		},
		"/api/public/wiki/planets": {
			get: {
				tags: ["Wiki"],
				summary: "Liste des planètes",
				responses: listResp("Planet", "planets"),
			},
		},
		"/api/public/wiki/planets/{id}": {
			get: {
				tags: ["Wiki"],
				summary: "Fiche planète",
				parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
				responses: itemResp("Planet"),
			},
		},
		"/api/public/wiki/races": {
			get: { tags: ["Wiki"], summary: "Liste des races", responses: listResp("Race", "races") },
		},
		"/api/public/wiki/techniques": {
			get: {
				tags: ["Wiki"],
				summary: "Liste des techniques",
				responses: listResp("Technique", "techniques"),
			},
		},
		"/api/public/wiki/transformations": {
			get: {
				tags: ["Wiki"],
				summary: "Liste des transformations",
				responses: listResp("Transformation", "transformations"),
			},
		},
		"/api/public/wiki/sagas": {
			get: { tags: ["Wiki"], summary: "Liste des sagas", responses: listResp("Saga", "sagas") },
		},
		"/api/public/wiki/episodes": {
			get: {
				tags: ["Wiki"],
				summary: "Liste des épisodes",
				parameters: [
					{ name: "series", in: "query", required: false, schema: { type: "string" } },
					limitParam(30, 100),
					offsetParam,
				],
				responses: listResp("Episode", "episodes"),
			},
		},
		"/api/public/wiki/movies": {
			get: { tags: ["Wiki"], summary: "Liste des films", responses: listResp("Movie", "movies") },
		},
		"/api/public/wiki/games": {
			get: { tags: ["Wiki"], summary: "Liste des jeux", responses: listResp("Game", "games") },
		},
		"/api/public/wiki/search": {
			get: {
				tags: ["Wiki"],
				summary: "Recherche plein-texte (entités wiki)",
				parameters: [
					{ name: "q", in: "query", required: true, schema: { type: "string" } },
					limitParam(20, 50),
				],
				responses: { "200": { description: "OK" } },
			},
		},
		"/api/public/stats": {
			get: {
				tags: ["Insights"],
				summary: "Statistiques agrégées du bot",
				responses: { "200": { description: "OK" } },
			},
		},
		"/api/public/personas": {
			get: {
				tags: ["Insights"],
				summary: "État des 6 personas",
				responses: {
					"200": {
						description: "OK",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										personas: { type: "array", items: { $ref: "#/components/schemas/Persona" } },
									},
								},
							},
						},
					},
				},
			},
		},
		"/api/public/commands": {
			get: {
				tags: ["Insights"],
				summary: "Catalogue des commandes slash",
				responses: { "200": { description: "OK" } },
			},
		},
		"/api/public/leaderboard": {
			get: {
				tags: ["Insights"],
				summary: "Classement (xp | zeni | voice | messages | streak)",
				parameters: [
					{
						name: "metric",
						in: "query",
						required: false,
						schema: { type: "string", enum: ["xp", "zeni", "voice", "messages", "streak"] },
					},
					limitParam(10, 100),
				],
				responses: { "200": { description: "OK" } },
			},
		},
		"/api/public/news": {
			get: {
				tags: ["Insights"],
				summary: "Actualités Dragon Ball",
				parameters: [
					{ name: "source", in: "query", required: false, schema: { type: "string" } },
					limitParam(20, 100),
				],
				responses: { "200": { description: "OK" } },
			},
		},
		"/api/public/sources": {
			get: {
				tags: ["Insights"],
				summary: "Sources & licences des données (attribution)",
				responses: { "200": { description: "OK" } },
			},
		},
		"/api/public/profile/{discordId}/card.png": {
			get: {
				tags: ["Médias"],
				summary: "Carte de profil (PNG canvas)",
				parameters: [{ name: "discordId", in: "path", required: true, schema: { type: "string" } }],
				responses: {
					"200": { description: "Image PNG", content: { "image/png": {} } },
					"404": { description: "Profil introuvable" },
				},
			},
		},
	},
	components: { schemas },
} as const;

/** Page HTML de l'UI Scalar (référence d'API interactive), CDN, zéro dépendance. */
export const scalarHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dragon Ball France — API</title>
  </head>
  <body>
    <script id="api-reference" data-url="/api/openapi.json"></script>
    <script>
      var c = document.getElementById('api-reference');
      c.dataset.configuration = JSON.stringify({ theme: 'purple', layout: 'modern', hideDownloadButton: false });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;
