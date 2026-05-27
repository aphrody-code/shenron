/**
 * Liste **client-safe** des tables wiki éditoriales dont Neon (schéma `bot`) est
 * la source de vérité, + leur schéma statique (pk + colonnes mutables) en
 * **camelCase** (clés des objets Drizzle `bot-schema.ts`, alignées sur le contrat
 * de l'API bot `/api/database`).
 *
 * Ce module ne contient QUE des constantes — aucun import Drizzle/server-only —
 * pour pouvoir être importé depuis les Client Components (`DbCrud`, éditeur
 * générique) afin de router l'écriture vers `/api/wiki-admin` plutôt que vers le
 * proxy bot `/api/bot-admin/database`, et de fournir le schéma de formulaire sans
 * aller-retour réseau vers le bot.
 *
 * La logique d'accès DB (lecture/écriture Neon) vit dans `wiki-admin.ts`
 * (`import "server-only"`). Garder les deux listes synchronisées.
 */

export interface WikiTableSpec {
	name: string;
	/** pk simple ("id" | "key" | "slug") ou composite (deux colonnes snake_case). */
	pk: string | [string, string];
	mutableColumns: string[];
}

/** Schéma statique par table — camelCase (clés Drizzle), miroir de l'API bot. */
export const WIKI_TABLE_SPECS: Record<string, WikiTableSpec> = {
	db_characters: {
		name: "db_characters",
		pk: "id",
		mutableColumns: [
			"name",
			"nameJa",
			"nameRomaji",
			"image",
			"ki",
			"maxKi",
			"race",
			"gender",
			"affiliation",
			"description",
			"originPlanetId",
		],
	},
	db_planets: {
		name: "db_planets",
		pk: "id",
		mutableColumns: [
			"name",
			"nameJa",
			"nameRomaji",
			"image",
			"isDestroyed",
			"description",
		],
	},
	db_transformations: {
		name: "db_transformations",
		pk: "id",
		mutableColumns: ["name", "image", "ki", "characterId"],
	},
	db_races: {
		name: "db_races",
		pk: "id",
		mutableColumns: ["slug", "name", "nameJa", "homePlanetId", "description"],
	},
	db_techniques: {
		name: "db_techniques",
		pk: "id",
		mutableColumns: [
			"slug",
			"name",
			"nameJa",
			"nameRomaji",
			"type",
			"creatorId",
			"description",
			"debutEpisodeId",
			"debutChapterId",
		],
	},
	db_character_techniques: {
		name: "db_character_techniques",
		pk: ["character_id", "technique_id"],
		mutableColumns: ["characterId", "techniqueId"],
	},
	db_sagas: {
		name: "db_sagas",
		pk: "id",
		mutableColumns: [
			"slug",
			"name",
			"nameJa",
			"series",
			"orderIdx",
			"description",
			"image",
		],
	},
	db_arcs: {
		name: "db_arcs",
		pk: "id",
		mutableColumns: [
			"sagaId",
			"slug",
			"name",
			"nameJa",
			"orderIdx",
			"description",
		],
	},
	db_episodes: {
		name: "db_episodes",
		pk: "id",
		mutableColumns: [
			"series",
			"numberInSeries",
			"title",
			"titleJa",
			"titleRomaji",
			"arcId",
			"airDate",
			"durationSec",
			"synopsis",
			"image",
			"videoUrl",
			"malId",
		],
	},
	db_manga_volumes: {
		name: "db_manga_volumes",
		pk: "id",
		mutableColumns: [
			"series",
			"volumeNumber",
			"title",
			"titleJa",
			"publishedAt",
			"cover",
			"isbn",
		],
	},
	db_manga_chapters: {
		name: "db_manga_chapters",
		pk: "id",
		mutableColumns: [
			"series",
			"chapterNumber",
			"title",
			"titleJa",
			"volumeId",
			"publishedAt",
		],
	},
	db_movies: {
		name: "db_movies",
		pk: "id",
		mutableColumns: [
			"slug",
			"title",
			"titleJa",
			"titleRomaji",
			"series",
			"releaseDate",
			"durationMin",
			"synopsis",
			"poster",
			"malId",
			"anilistId",
			"trailerUrl",
		],
	},
	db_games: {
		name: "db_games",
		pk: "id",
		mutableColumns: [
			"slug",
			"title",
			"titleJa",
			"platforms",
			"releaseDate",
			"publisher",
			"developer",
			"description",
			"cover",
			"officialUrl",
		],
	},
	db_game_characters: {
		name: "db_game_characters",
		pk: ["game_id", "character_id"],
		mutableColumns: ["gameId", "characterId"],
	},
	db_tools: {
		name: "db_tools",
		pk: "id",
		mutableColumns: [
			"slug",
			"name",
			"description",
			"url",
			"author",
			"language",
			"category",
			"targetGameId",
			"stars",
		],
	},
	db_sources: {
		name: "db_sources",
		pk: "id",
		mutableColumns: ["name", "url", "licenseKey", "attributionTemplate"],
	},
	db_licenses: {
		name: "db_licenses",
		pk: "key",
		mutableColumns: ["name", "url", "requiresAttribution", "shareAlike"],
	},
	db_assets: {
		name: "db_assets",
		pk: "id",
		mutableColumns: [
			"path",
			"sourceId",
			"sourceUrl",
			"licenseKey",
			"attribution",
			"mimeType",
			"width",
			"height",
			"entityType",
			"entityId",
			"role",
		],
	},
};

/** Noms des tables wiki éditoriales (Neon source de vérité). */
export const WIKI_TABLE_NAMES = Object.keys(WIKI_TABLE_SPECS);

/** True si l'écriture/lecture de `table` doit passer par `/api/wiki-admin`. */
export function isWikiTable(name: string): boolean {
	return name in WIKI_TABLE_SPECS;
}

/**
 * Base path CRUD pour une table : `/api/wiki-admin` (Neon direct) pour les tables
 * wiki éditoriales, sinon `/api/bot-admin/database` (proxy API bot) — inchangé
 * pour users/shop_items/level_rewards/db_news/etc.
 */
export function crudBase(table: string): string {
	return isWikiTable(table) ? "/api/wiki-admin" : "/api/bot-admin/database";
}
