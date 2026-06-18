/**
 * Schéma Drizzle du **wiki Dragon Ball** tel que miroité dans Neon, schéma `bot`.
 *
 * Source de vérité = SQLite du bot (`apps/bot/data/bot.db`). Le timer VPS
 * `shenron-neon-sync.timer` recopie ces tables dans le schéma Postgres `bot`
 * (DROP+CREATE+INSERT idempotent, cf. `apps/bot/scripts/sync-sqlite-to-neon.ts`).
 *
 * Le site lit le wiki **directement ici via Drizzle** (plus de fetch sur l'API
 * REST du bot pour les pages publiques /wiki) → découplé de la dispo du process
 * bot. Toutes les colonnes int SQLite arrivent en `bigint` Postgres, les autres
 * en `text` — on type donc à l'identique. Lecture seule : aucune écriture site.
 */
import { bigint, jsonb, pgSchema, text } from "drizzle-orm/pg-core";

export const bot = pgSchema("bot");

/**
 * Frame de scène d'épisode (extraite par le pipeline bot, montée en preview).
 *
 * CONTRAT PARTAGÉ avec `apps/bot` — SOURCE DE VÉRITÉ = `apps/bot/src/db/episode-frames.ts`
 * (type `EpisodeFrame`). Le site ne peut pas importer depuis `apps/bot` → on
 * REDÉFINIT le type ici, IDENTIQUE au bot (le jsonb Neon `bot.db_episodes.frames`
 * remonte tel quel). Champs clés pour l'affichage :
 *  - `imagePath`  : chemin relatif `./assets/ext/db_episodes_frames/...` → passer
 *                   par `assetUrl()` pour l'URL absolue (bot.dragonballfr.com).
 *                   `null` pour un dry-run → frame à filtrer avant rendu.
 *  - `timecodeSec` : position de la frame dans l'épisode (s), ou null.
 *  - `characterNames` : personnages détectés/annotés sur la frame.
 *  - `isNotable`  : frame marquante (mise en avant, candidate hero).
 *  - `caption`/`tags` : métadonnées éditoriales optionnelles (légende, badges).
 */
export type EpisodeFrame = {
	/** Provenance : "ffmpeg" (vidéo locale) ou "fandom" (screencap wiki). */
	source: "ffmpeg" | "fandom";
	/** Id stable côté source (ex. `ffmpeg:dbz:001:00042`, `fandom:<pageid>`). */
	sourceId: string;
	/** URL/chemin d'origine (page wiki, ou chemin de la vidéo source). */
	sourceUrl: string | null;
	/** Numéro d'épisode dans la série (= `db_episodes.number_in_series`). */
	episodeNumber: number;
	/**
	 * Chemin d'asset bot RELATIF (`./assets/ext/db_episodes_frames/...`) — servi
	 * via `bot.dragonballfr.com/assets/...`. `null` pour un dry-run (frame non écrite).
	 */
	imagePath: string | null;
	/** Timecode dans l'épisode en secondes (ffmpeg), ou null (fandom). */
	timecodeSec: number | null;
	width: number | null;
	height: number | null;
	/** Noms de personnages présents (rempli par le merge, livrable séparé). */
	characterNames: string[];
	tags: string[];
	caption: string | null;
	/** Frame marquante (ex. scene-cut fort, épisode de combat). */
	isNotable: boolean;
	/** Ordre stable pour l'affichage. */
	sortOrder: number;
};

/** bigint Neon → number JS (les ID wiki sont petits, < 2^53). */
const int = (name: string) => bigint(name, { mode: "number" });

export const botCharacters = bot.table("db_characters", {
	id: int("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image"),
	portraitXv2: text("portrait_xv2"), // portrait HQ extrait de Xenoverse 2
	ki: text("ki"),
	maxKi: text("max_ki"),
	race: text("race"),
	gender: text("gender"),
	affiliation: text("affiliation"),
	description: text("description"),
	originPlanetId: int("origin_planet_id"),
	nameJa: text("name_ja"),
	nameRomaji: text("name_romaji"),
});

export const botPlanets = bot.table("db_planets", {
	id: int("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image"),
	isDestroyed: int("is_destroyed"),
	description: text("description"),
	nameJa: text("name_ja"),
	nameRomaji: text("name_romaji"),
});

export const botTransformations = bot.table("db_transformations", {
	id: int("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image"),
	ki: text("ki"),
	characterId: int("character_id"),
});

export const botRaces = bot.table("db_races", {
	id: int("id").primaryKey(),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	nameJa: text("name_ja"),
	homePlanetId: int("home_planet_id"),
	description: text("description"),
});

export const botTechniques = bot.table("db_techniques", {
	id: int("id").primaryKey(),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	nameJa: text("name_ja"),
	nameRomaji: text("name_romaji"),
	type: text("type"),
	creatorId: int("creator_id"),
	description: text("description"),
	debutEpisodeId: int("debut_episode_id"),
	debutChapterId: int("debut_chapter_id"),
});

export const botCharacterTechniques = bot.table("db_character_techniques", {
	characterId: int("character_id").notNull(),
	techniqueId: int("technique_id").notNull(),
});

export const botSagas = bot.table("db_sagas", {
	id: int("id").primaryKey(),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	nameJa: text("name_ja"),
	series: text("series"),
	orderIdx: int("order_idx"),
	description: text("description"),
	image: text("image"),
});

export const botArcs = bot.table("db_arcs", {
	id: int("id").primaryKey(),
	sagaId: int("saga_id"),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	nameJa: text("name_ja"),
	orderIdx: int("order_idx"),
	description: text("description"),
});

export const botEpisodes = bot.table("db_episodes", {
	id: int("id").primaryKey(),
	series: text("series").notNull(),
	numberInSeries: int("number_in_series"),
	title: text("title"),
	titleJa: text("title_ja"),
	titleRomaji: text("title_romaji"),
	arcId: int("arc_id"),
	airDate: int("air_date"),
	durationSec: int("duration_sec"),
	synopsis: text("synopsis"),
	image: text("image"),
	malId: int("mal_id"),
	videoUrl: text("video_url"),
	// Pistes de sous-titres : [{ lang, label, src }] où `src` est un chemin
	// d'asset bot (assets/subtitles/...) en .vtt ou .srt, ou une URL .vtt.
	// Colonne Neon-only (le reverse-sync l'ignore par intersection de colonnes ;
	// seul le lecteur du site la lit).
	subtitles: jsonb("subtitles").$type<{ lang: string; label: string; src: string }[]>(),
	// Lecteurs externes (voir-anime) : [{ name, provider, embedUrl }] affichés en
	// iframe. Colonne Neon-only, rafraîchie par import-voiranime-players.ts.
	players: jsonb("players").$type<{ name: string; provider: string; embedUrl: string }[]>(),
	// Flux résolu (HLS/mp4) + headers requis (Referer), pour le proxy HLS du
	// site qui le relaie à notre player hls.js. Rafraîchi par resolve-streams.ts
	// (tokens ~12 h). Colonnes Neon-only.
	streamUrl: text("stream_url"),
	streamHeaders: jsonb("stream_headers").$type<Record<string, string>>(),
	streamProvider: text("stream_provider"),
	streamAt: bigint("stream_at", { mode: "number" }),
	// Scènes d'épisode : frames extraites (jsonb) + montage MP4 preview animé.
	// Colonnes posées sur Neon ; alimentées par le pipeline bot (extraction +
	// montage). Le reverse-sync Neon→SQLite les ignore (intersection de colonnes).
	frames: jsonb("frames").$type<EpisodeFrame[]>(),
	scenePreview: text("scene_preview"),
});

export const botMovies = bot.table("db_movies", {
	id: int("id").primaryKey(),
	slug: text("slug").notNull(),
	title: text("title").notNull(),
	titleJa: text("title_ja"),
	titleRomaji: text("title_romaji"),
	series: text("series"),
	releaseDate: int("release_date"),
	durationMin: int("duration_min"),
	synopsis: text("synopsis"),
	poster: text("poster"),
	malId: int("mal_id"),
	anilistId: int("anilist_id"),
	trailerUrl: text("trailer_url"),
	videoUrl: text("video_url"),
	subtitles: jsonb("subtitles").$type<{ lang: string; label: string; src: string }[]>(),
	players: jsonb("players").$type<{ name: string; provider: string; embedUrl: string }[]>(),
	streamUrl: text("stream_url"),
	streamHeaders: jsonb("stream_headers").$type<Record<string, string>>(),
	streamProvider: text("stream_provider"),
	streamAt: bigint("stream_at", { mode: "number" }),
});

export const botGames = bot.table("db_games", {
	id: int("id").primaryKey(),
	slug: text("slug").notNull(),
	title: text("title").notNull(),
	titleJa: text("title_ja"),
	platforms: text("platforms"),
	releaseDate: int("release_date"),
	publisher: text("publisher"),
	developer: text("developer"),
	description: text("description"),
	cover: text("cover"),
	officialUrl: text("official_url"),
});

export const botGameCharacters = bot.table("db_game_characters", {
	gameId: int("game_id").notNull(),
	characterId: int("character_id").notNull(),
});

export const botMangaVolumes = bot.table("db_manga_volumes", {
	id: int("id").primaryKey(),
	series: text("series").notNull(),
	volumeNumber: int("volume_number"),
	title: text("title"),
	titleJa: text("title_ja"),
	publishedAt: int("published_at"),
	cover: text("cover"),
	isbn: text("isbn"),
});

export const botMangaChapters = bot.table("db_manga_chapters", {
	id: int("id").primaryKey(),
	series: text("series").notNull(),
	chapterNumber: int("chapter_number"),
	title: text("title"),
	titleJa: text("title_ja"),
	volumeId: int("volume_id"),
	publishedAt: int("published_at"),
	cover: text("cover"),
	// Pages du chapitre = liste ordonnée de chemins d'images (assetUrl côté site).
	// Colonne Neon-only : le reverse-sync Neon→SQLite l'ignore (intersection de
	// colonnes), le bot n'en a pas besoin (seul le reader du site lit les pages).
	pages: jsonb("pages").$type<string[]>(),
});

export const botNews = bot.table("db_news", {
	id: int("id").primaryKey(),
	sourceId: text("source_id"),
	sourceUrl: text("source_url"),
	title: text("title").notNull(),
	titleJa: text("title_ja"),
	excerpt: text("excerpt"),
	category: text("category"),
	publishedAt: int("published_at"),
	fetchedAt: int("fetched_at"),
	image: text("image"),
});

export const botTools = bot.table("db_tools", {
	id: int("id").primaryKey(),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	url: text("url"),
	author: text("author"),
	language: text("language"),
	category: text("category"),
	targetGameId: int("target_game_id"),
	stars: int("stars"),
});

export const botSources = bot.table("db_sources", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	url: text("url"),
	licenseKey: text("license_key"),
	attributionTemplate: text("attribution_template"),
});

export const botLicenses = bot.table("db_licenses", {
	key: text("key").primaryKey(),
	name: text("name").notNull(),
	url: text("url"),
	requiresAttribution: int("requires_attribution"),
	shareAlike: int("share_alike"),
});

export const botAssets = bot.table("db_assets", {
	id: int("id").primaryKey(),
	path: text("path").notNull(),
	sourceId: text("source_id"),
	sourceUrl: text("source_url"),
	licenseKey: text("license_key"),
	attribution: text("attribution"),
	sha256: text("sha256"),
	mimeType: text("mime_type"),
	bytes: int("bytes"),
	width: int("width"),
	height: int("height"),
	entityType: text("entity_type"),
	entityId: int("entity_id"),
	role: text("role"),
	createdAt: int("created_at"),
});
