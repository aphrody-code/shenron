/**
 * Liste des tables du **wiki éditorial** dont Neon `bot.*` est la SOURCE DE
 * VÉRITÉ (édité par le site via Server Actions). Partagée par les deux scripts
 * de sync sans side-effect :
 *   - sync-sqlite-to-neon.ts (forward, runtime+news) les EXCLUT.
 *   - sync-neon-to-sqlite.ts (reverse, wiki) les rafraîchit Neon→SQLite.
 *
 * `db_news` n'en fait PAS partie (écrit par le bot en runtime → forward-mirroré).
 */
export const WIKI_EDITORIAL = [
	"db_characters",
	"db_planets",
	"db_transformations",
	"db_races",
	"db_techniques",
	"db_character_techniques",
	"db_sagas",
	"db_arcs",
	"db_episodes",
	"db_manga_volumes",
	"db_manga_chapters",
	"db_movies",
	"db_games",
	"db_game_characters",
	"db_tools",
	"db_sources",
	"db_licenses",
	"db_assets",
] as const;
