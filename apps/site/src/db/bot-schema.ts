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
 *
 * ── INDEX : voir `src/db/bot-indexes.sql` ───────────────────────────────────
 * Les index de ce schéma ne sont volontairement PAS déclarés ici. Ce fichier
 * n'ayant jamais porté d'`index()`, les tables du wiki n'ont longtemps eu que
 * leur clé primaire (deux tables de jointure n'avaient même pas ça) : mesuré le
 * 2026-08-21, 272 000 balayages séquentiels sur `db_episodes`, 76 000 sur
 * `db_manga_chapters`. Ils vivent désormais dans `bot-indexes.sql`, appliqué par
 * `scripts/apply-bot-indexes.ts`.
 *
 * Pourquoi pas ici : les index qui comptent sont des index PARTIELS
 * (`WHERE visible`) et des GIN `gin_trgm_ops`, que drizzle-kit ne restitue pas
 * fidèlement. Les déclarer produirait un écart permanent au diff — et donc une
 * invitation à lancer un `push` sur le schéma `bot`, qui voudrait droper les
 * colonnes propres à PostgreSQL (`players`, `frames`, `pages`, `subtitles`).
 * Toute modification d'index passe par le fichier SQL, pas par ce fichier.
 */
import { bigint, boolean, jsonb, pgSchema, text } from "drizzle-orm/pg-core";

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

/**
 * Source citée dans un article wiki long-format (champ `article_sources`).
 * Alimenté par `apps/bot/scripts/wiki-articles.ts` (grounding RAG). Colonnes
 * PG-only : le reverse-sync Neon→SQLite les ignore (intersection de colonnes),
 * comme `players`/`frames`/`pages`. Seul le lecteur du site les lit.
 */
export type WikiSource = { n: number; label: string; url: string; kind: string };

/** Trois colonnes communes aux tables éditoriales recevant un article Fandom. */
const articleCols = {
	article: text("article"),
	articleSources: jsonb("article_sources").$type<WikiSource[]>(),
	articleUpdatedAt: bigint("article_updated_at", { mode: "number" }),
};

/**
 * Visibilité éditoriale (PG-only) — masque une entité du site public sans la
 * supprimer. Défaut `true`. Comme `articleCols`, colonne posée uniquement sur
 * Postgres (`scripts/add-wiki-visibility.ts`) : le forward-sync exclut ces tables
 * éditoriales et le reverse-sync l'ignore (intersection de colonnes). Les lectures
 * publiques filtrent `visible = true` ; l'admin la bascule via `/api/wiki-visibility`.
 */
const visibleCol = {
	visible: boolean("visible").notNull().default(true),
};

/** Stats custom scouter (label/value/accent) — panneau CharacterStatsPanel. */
export type CharacterStat = {
	label: string;
	value: string;
	accent?: string;
};

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
	/** Première apparition (épisodes / chapitres / saga). */
	debutEpisodeId: int("debut_episode_id"),
	debutChapterId: int("debut_chapter_id"),
	debutSagaId: int("debut_saga_id"),
	/** Stats custom scouter (jsonb) — CharacterStatsPanel. */
	stats: jsonb("stats").$type<CharacterStat[] | null>(),
	...articleCols,
	...visibleCol,
});

export const botPlanets = bot.table("db_planets", {
	id: int("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image"),
	isDestroyed: int("is_destroyed"),
	description: text("description"),
	nameJa: text("name_ja"),
	nameRomaji: text("name_romaji"),
	...articleCols,
	...visibleCol,
});

export const botTransformations = bot.table("db_transformations", {
	id: int("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image"),
	ki: text("ki"),
	characterId: int("character_id"),
	...articleCols,
	...visibleCol,
});

export const botRaces = bot.table("db_races", {
	id: int("id").primaryKey(),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	nameJa: text("name_ja"),
	homePlanetId: int("home_planet_id"),
	description: text("description"),
	...articleCols,
	...visibleCol,
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
	...articleCols,
	...visibleCol,
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
	/**
	 * Bornes de la saga dans le manga (PG-only, `scripts/add-character-variants.ts`).
	 * Ce sont elles qui rendent la présence d'un personnage MESURABLE : sans
	 * plage de tomes, « Goku apparaît-il dans la saga Namek ? » n'a aucune
	 * réponse dans la base, seulement dans la tête de celui qui la remplit.
	 * Renseignées pour le manga 42 tomes (`bornes-sagas-manga.ts`) ; NULL pour
	 * les sagas sans support manga (GT, Daima, films, épisodes spéciaux).
	 */
	mangaVolumeStart: int("manga_volume_start"),
	mangaVolumeEnd: int("manga_volume_end"),
	mangaChapterStart: int("manga_chapter_start"),
	mangaChapterEnd: int("manga_chapter_end"),
	...articleCols,
	...visibleCol,
});

export const botArcs = bot.table("db_arcs", {
	id: int("id").primaryKey(),
	sagaId: int("saga_id"),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	nameJa: text("name_ja"),
	orderIdx: int("order_idx"),
	description: text("description"),
	...articleCols,
	...visibleCol,
});

// Jonction N-N personnage ↔ arc (« ce perso apparaît/est pertinent dans cet
// arc »). Colonnes contextuelles optionnelles : `note` (ex. état/rôle du perso
// dans l'arc) et `appearanceImage` (apparence spécifique à l'arc). PK composite
// (character_id, arc_id) posée côté PG. Sert au filtrage /wiki/personnages et à
// l'assignation admin (RelationsPanel, via db_character_arcs).
export const botCharacterArcs = bot.table("db_character_arcs", {
	characterId: int("character_id").notNull(),
	arcId: int("arc_id").notNull(),
	note: text("note"),
	appearanceImage: text("appearance_image"),
});

/**
 * Preuve de présence d'un personnage dans une saga, telle que mesurée sur l'OCR
 * du manga (`scripts/variantes-par-saga.ts`). On stocke le comptage ET son
 * mode d'obtention : une variante amorcée automatiquement ne doit jamais être
 * confondue avec une variante écrite par un rédacteur.
 */
export type VariantEvidence = {
	/** Comment la variante a été obtenue ("ocr-manga" pour l'amorçage mesuré). */
	methode: string;
	/** Tomes du manga où le nom apparaît, dans la plage de la saga. */
	tomes: number[];
	/** Nombre de planches où le nom apparaît (pas d'occurrences de mots). */
	planches: number;
	/** Graphies recherchées (nom de la fiche + alias retenus). */
	graphies: string[];
	/** Date de la mesure (epoch ms). */
	mesureAt: number;
};

/**
 * **Une version d'un personnage à une saga donnée** — « Goku, saga Namek ».
 *
 * Table PG-only. Une ligne par couple (personnage, saga), unique. Elle ne redit
 * PAS la fiche : elle ne porte que ce qui change d'une saga à l'autre. Tout
 * champ NULL retombe sur `db_characters` à l'affichage — c'est volontaire :
 * dupliquer la race ou la planète d'origine dans 15 variantes garantirait
 * qu'elles divergent un jour.
 */
export const botCharacterVariants = bot.table("db_character_variants", {
	id: int("id").primaryKey(),
	characterId: int("character_id").notNull(),
	sagaId: int("saga_id").notNull(),
	/** Ancre stable dans l'URL de la fiche (ex. `goku-namek`). */
	slug: text("slug").notNull(),
	/** Libellé de la pilule dans la frise (ex. « Saga Namek »). */
	label: text("label").notNull(),
	/** Nom affiché en tête de la variante (ex. « Son Goku — Saga Namek »). */
	displayName: text("display_name"),
	nameJa: text("name_ja"),
	/** Forme atteinte à cette période (« Super Saiyan », « Ôzaru »…). */
	form: text("form"),
	/** Apparence propre à la saga ; NULL → image de la fiche. */
	image: text("image"),
	/** Âge du personnage à cette période, quand une source le donne. */
	age: int("age"),
	/** Puissance telle qu'une source la chiffre (databook, scouter) — texte. */
	powerLevel: text("power_level"),
	ki: text("ki"),
	maxKi: text("max_ki"),
	/** Rôle tenu dans la saga (« Protagoniste », « Antagoniste », « Soutien »). */
	role: text("role"),
	affiliation: text("affiliation"),
	/** Ce que devient le personnage pendant la saga (markdown). */
	summary: text("summary"),
	/** Faits marquants, un par puce. */
	highlights: jsonb("highlights").$type<string[]>(),
	/** Transformations disponibles à cette période (ids `db_transformations`). */
	transformationIds: jsonb("transformation_ids").$type<number[]>(),
	/** Techniques employées à cette période (ids `db_techniques`). */
	techniqueIds: jsonb("technique_ids").$type<number[]>(),
	/** Premier et dernier tome du manga où le personnage est repéré. */
	firstVolume: int("first_volume"),
	lastVolume: int("last_volume"),
	/** "ocr-manga" (amorçage mesuré) ou "editorial" (écrit à la main). */
	origin: text("origin"),
	evidence: jsonb("evidence").$type<VariantEvidence | null>(),
	sortOrder: int("sort_order").notNull().default(0),
	visible: boolean("visible").notNull().default(true),
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
	// Traduction FR générée (script translate-synopsis-fr.ts). Null = pas encore traduit.
	synopsisFr: text("synopsis_fr"),
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
	players:
		jsonb("players").$type<
			{ name: string; provider: string; embedUrl: string; lang?: "vf" | "vostfr" }[]
		>(),
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
	...visibleCol,
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
	// Traduction FR générée (script translate-synopsis-fr.ts). Null = pas encore traduit.
	synopsisFr: text("synopsis_fr"),
	poster: text("poster"),
	malId: int("mal_id"),
	anilistId: int("anilist_id"),
	trailerUrl: text("trailer_url"),
	videoUrl: text("video_url"),
	subtitles: jsonb("subtitles").$type<{ lang: string; label: string; src: string }[]>(),
	players:
		jsonb("players").$type<
			{ name: string; provider: string; embedUrl: string; lang?: "vf" | "vostfr" }[]
		>(),
	streamUrl: text("stream_url"),
	streamHeaders: jsonb("stream_headers").$type<Record<string, string>>(),
	streamProvider: text("stream_provider"),
	streamAt: bigint("stream_at", { mode: "number" }),
	...visibleCol,
});

/** Média galerie jeu (jsonb `media`) — image asset ou trailer YouTube. */
export type GameMediaItem = {
	type: "image" | "youtube";
	url: string;
	caption?: string | null;
};

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
	/** Galerie style Steam (screenshots + trailers). */
	media: jsonb("media").$type<GameMediaItem[]>(),
	...visibleCol,
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
	...visibleCol,
});

/** Page d'un databook / interview (jsonb `pages`). */
export type DatabookPage = {
	number?: number | string | null;
	image?: string | null;
	text?: string | null;
};

/** Databooks & interviews (PG-only, cf. scripts/add-databooks.ts). */
export const botDatabooks = bot.table("db_databooks", {
	id: int("id").primaryKey(),
	/**
	 * Type technique dérivé de `category` à l'écriture :
	 * "databook" | "interview" | "artbook" | "guidebook".
	 * L'UI n'édite plus ce champ — source de vérité = `category`.
	 */
	kind: text("kind").notNull(),
	title: text("title").notNull(),
	titleJa: text("title_ja"),
	author: text("author"),
	/** Date de publication (epoch ms) — sert au tri. */
	publishedAt: int("published_at"),
	cover: text("cover"),
	description: text("description"),
	sourceUrl: text("source_url"),
	/**
	 * Catégorie unifiée (Databook, Interview, Art Book, Guidebook,
	 * V-Jump, Weekly Shonen Jump, Light Novel, Jump Anime Comics,
	 * Pamphlet & Fair, Autre). Voir `DATABOOK_CATEGORIES`.
	 */
	category: text("category"),
	/** Slots lecteur : numéro + image + texte sous l'image. */
	pages: jsonb("pages").$type<DatabookPage[]>(),
	...visibleCol,
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
	...visibleCol,
});

/**
 * OCR planches manga (PG miroir de bot SQLite `db_manga_pages`).
 * Une ligne = une planche : texte OCR + métadonnées (série/tome/n°).
 * 12k+ lignes en prod — éditable depuis wiki-admin /admin/database.
 */
export const botMangaPages = bot.table("db_manga_pages", {
	id: int("id").primaryKey(),
	series: text("series"),
	tome: text("tome"),
	planche: int("planche"),
	/** Bulles OCR (json array de strings) — stocké text/jsonb selon sync. */
	lines: text("lines"),
	text: text("text"),
	lang: text("lang"),
	hasJa: int("has_ja"),
	lineCount: int("line_count"),
	charCount: int("char_count"),
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

/**
 * Sections de contenu éditorial par entité wiki (PG-only, `scripts/add-wiki-sections.ts`).
 * Chaque ligne = un bloc markdown riche nommé (« Histoire », « Personnalité »,
 * « Anecdotes », « PWS »…) attaché à une entité (`entity_type` + `entity_id`),
 * réordonnable (`sort_order`) et masquable (`visible`). Rendu sur la page détail
 * en sélecteur de catégories ; édité depuis le studio admin. Table PG-only : ni
 * poussée ni écrasée par les syncs (absente de toute liste de tables).
 */
/** Carte « page wiki affiliée » attachée à une section : lien interne + photo. */
export type WikiSectionLink = {
	/** Chemin interne (ex. "/wiki/dragon-ball/character/12"). */
	href: string;
	/** Libellé affiché (nom de l'entité liée). */
	label: string;
	/** URL absolue de la photo (assetUrl), optionnelle. */
	image?: string;
	/** Sous-titre optionnel (ex. race, ère…). */
	sub?: string;
};

export const botWikiSections = bot.table("db_wiki_sections", {
	id: int("id").primaryKey(),
	/** Type d'entité parente ("character", "planet", "saga", "race", "technique", "arc", "game", "movie"). */
	entityType: text("entity_type").notNull(),
	entityId: int("entity_id").notNull(),
	/** Slug de section ("histoire", "personnalite", "anecdotes", "pws"…) — libre. */
	key: text("key").notNull(),
	/** Libellé affiché (pilule + titre du bloc). */
	label: text("label").notNull(),
	/** Couleur d'accent du bandeau (orange|blue|red|green|purple|gold|cyan|pink), défaut orange. */
	accent: text("accent"),
	/** Corps markdown riche (rendu via WikiMarkdown). */
	body: text("body"),
	/** Sous-catégorie : nom d'un GROUPE parent qui regroupe plusieurs sections
	 *  (ex. « Powerscaling »). NULL = section de 1er niveau. */
	groupLabel: text("group_label"),
	/** Pages wiki affiliées : cartes avec photo (liens internes). */
	links: jsonb("links").$type<WikiSectionLink[]>(),
	sortOrder: int("sort_order").notNull().default(0),
	visible: boolean("visible").notNull().default(true),
});
