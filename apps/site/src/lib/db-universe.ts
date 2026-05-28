/**
 * db-universe — accès au **wiki Dragon Ball** (schéma Neon `bot`, miroir du
 * SQLite du bot) via Drizzle, en LECTURE SEULE.
 *
 * Server-only : ce module tape la DB Postgres et ne doit jamais entrer dans un
 * bundle client. Les Client Components qui avaient besoin de `assetUrl` doivent
 * désormais importer `@/lib/assets` directement.
 *
 * Convention de sortie : snake_case (les pages sagas/episodes/games/search…
 * consomment ces champs). Les mappers reproduisent à l'identique les shapes que
 * servait l'API REST du bot.
 */
import "server-only";
import { and, asc, desc, eq, gt, ilike, isNotNull, lt, or, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import {
	botArcs,
	botEpisodes,
	botGames,
	botMangaChapters,
	botMangaVolumes,
	botMovies,
	botNews,
	botPlanets,
	botRaces,
	botSagas,
	botCharacters,
	botTechniques,
	botTools,
	botTransformations,
} from "@/db/bot-schema";

// Re-export pour back-compat des pages serveur qui importaient assetUrl ici.
export { assetUrl } from "@/lib/assets";

// API REST du bot — uniquement pour le RAG (index FTS5 `rag_chunks`, NON
// miroité dans Neon). Lue paresseusement (server-only).
function apiBase(): string {
	return (env.SHENRON_API_URL ?? "https://bot.rpbey.fr").replace(/\/+$/, "");
}

export type Saga = {
	id: number;
	slug: string;
	name: string;
	name_ja: string | null;
	series: string;
	order_idx: number;
	description: string | null;
	image: string | null;
};

export type Episode = {
	id: number;
	series: string;
	number_in_series: number;
	title: string;
	title_ja: string | null;
	air_date: number | null;
	synopsis: string | null;
	image: string | null;
	video_url: string | null;
	mal_id: number | null;
	subtitles: { lang: string; label: string; src: string }[] | null;
	players: { name: string; provider: string; embedUrl: string }[] | null;
	stream_url: string | null;
};

export type Movie = {
	id: number;
	slug: string;
	title: string;
	title_ja: string | null;
	title_romaji: string | null;
	series: string;
	release_date: number | null;
	duration_min: number | null;
	synopsis: string | null;
	poster: string | null;
	trailer_url: string | null;
	mal_id: number | null;
	anilist_id: number | null;
};

export type Game = {
	id: number;
	slug: string;
	title: string;
	title_ja: string | null;
	platforms: string | null;
	release_date: number | null;
	developer: string | null;
	publisher: string | null;
	description: string | null;
	cover: string | null;
	official_url: string | null;
};

export type Race = {
	id: number;
	slug: string;
	name: string;
	name_ja: string | null;
	description: string | null;
};

export type Transformation = {
	id: number;
	name: string;
	image: string | null;
	ki: string | null;
	character_id: number;
};

export type MangaVolume = {
	id: number;
	series: string;
	volume_number: number;
	title: string | null;
	cover: string | null;
};

export type MangaChapter = {
	id: number;
	series: string;
	chapter_number: number;
	title: string | null;
	volume_id: number | null;
	cover: string | null;
};

/** Chapitre + ses pages, pour le lecteur de scan. `prev`/`next` = chapitres
 *  adjacents (même série, par numéro) pour la navigation. */
export type MangaChapterRead = MangaChapter & {
	pages: string[];
	prev: number | null;
	next: number | null;
};

export type News = {
	id: number;
	source_id: string;
	source_url: string;
	title: string;
	excerpt: string | null;
	category: string | null;
	published_at: number;
	image: string | null;
};

export type SearchResults = {
	q: string;
	characters: Array<{
		id: number;
		name: string;
		name_ja: string | null;
		image: string | null;
		race: string | null;
	}>;
	planets: Array<{
		id: number;
		name: string;
		name_ja: string | null;
		image: string | null;
	}>;
	sagas: Array<Pick<Saga, "id" | "slug" | "name" | "name_ja" | "series">>;
	movies: Array<Pick<Movie, "id" | "slug" | "title" | "title_ja" | "series">>;
	games: Array<Pick<Game, "id" | "slug" | "title" | "title_ja">>;
	episodes: Array<{
		id: number;
		series: string;
		number_in_series: number;
		title: string;
		image: string | null;
	}>;
	techniques: Array<{
		id: number;
		slug: string;
		name: string;
		name_ja: string | null;
		type: string | null;
	}>;
};

export type Arc = {
	id: number;
	saga_id: number;
	slug: string;
	name: string;
	name_ja: string | null;
	order_idx: number;
	description: string | null;
};

export type Tool = {
	id: number;
	slug: string;
	name: string;
	description: string | null;
	url: string;
	author: string | null;
	language: string | null;
	category: string | null;
	target_game_id: number | null;
	stars: number;
};

// ── Mappers camelCase (Drizzle) → snake_case (contrat site) ──────────────

function toSaga(r: typeof botSagas.$inferSelect): Saga {
	return {
		id: r.id,
		slug: r.slug,
		name: r.name,
		name_ja: r.nameJa,
		series: r.series ?? "",
		order_idx: r.orderIdx ?? 0,
		description: r.description,
		image: r.image,
	};
}

function toArc(r: typeof botArcs.$inferSelect): Arc {
	return {
		id: r.id,
		saga_id: r.sagaId ?? 0,
		slug: r.slug,
		name: r.name,
		name_ja: r.nameJa,
		order_idx: r.orderIdx ?? 0,
		description: r.description,
	};
}

function toEpisode(r: typeof botEpisodes.$inferSelect): Episode {
	return {
		id: r.id,
		series: r.series,
		number_in_series: r.numberInSeries ?? 0,
		title: r.title ?? "",
		title_ja: r.titleJa,
		air_date: r.airDate,
		synopsis: r.synopsis,
		image: r.image,
		video_url: r.videoUrl,
		mal_id: r.malId,
		subtitles: r.subtitles ?? null,
		players: r.players ?? null,
		stream_url: r.streamUrl ?? null,
	};
}

function toMovie(r: typeof botMovies.$inferSelect): Movie {
	return {
		id: r.id,
		slug: r.slug,
		title: r.title,
		title_ja: r.titleJa,
		title_romaji: r.titleRomaji,
		series: r.series ?? "",
		release_date: r.releaseDate,
		duration_min: r.durationMin,
		synopsis: r.synopsis,
		poster: r.poster,
		trailer_url: r.trailerUrl,
		mal_id: r.malId,
		anilist_id: r.anilistId,
	};
}

function toGame(r: typeof botGames.$inferSelect): Game {
	return {
		id: r.id,
		slug: r.slug,
		title: r.title,
		title_ja: r.titleJa,
		platforms: r.platforms,
		release_date: r.releaseDate,
		developer: r.developer,
		publisher: r.publisher,
		description: r.description,
		cover: r.cover,
		official_url: r.officialUrl,
	};
}

function toRace(r: typeof botRaces.$inferSelect): Race {
	return {
		id: r.id,
		slug: r.slug,
		name: r.name,
		name_ja: r.nameJa,
		description: r.description,
	};
}

function toTransformation(r: typeof botTransformations.$inferSelect): Transformation {
	return {
		id: r.id,
		name: r.name,
		image: r.image,
		ki: r.ki,
		character_id: r.characterId ?? 0,
	};
}

function toMangaVolume(r: typeof botMangaVolumes.$inferSelect): MangaVolume {
	return {
		id: r.id,
		series: r.series,
		volume_number: r.volumeNumber ?? 0,
		title: r.title,
		cover: r.cover,
	};
}

function toMangaChapter(r: typeof botMangaChapters.$inferSelect): MangaChapter {
	return {
		id: r.id,
		series: r.series,
		chapter_number: r.chapterNumber ?? 0,
		title: r.title,
		volume_id: r.volumeId,
		cover: r.cover,
	};
}

function toNews(r: typeof botNews.$inferSelect): News {
	return {
		id: r.id,
		source_id: r.sourceId ?? "",
		source_url: r.sourceUrl ?? "",
		title: r.title,
		excerpt: r.excerpt,
		category: r.category,
		published_at: r.publishedAt ?? 0,
		image: r.image,
	};
}

function toTool(r: typeof botTools.$inferSelect): Tool {
	return {
		id: r.id,
		slug: r.slug,
		name: r.name,
		description: r.description,
		url: r.url ?? "",
		author: r.author,
		language: r.language,
		category: r.category,
		target_game_id: r.targetGameId,
		stars: r.stars ?? 0,
	};
}

async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
	try {
		return await fn();
	} catch {
		return null;
	}
}

// Seuil de proximité trigramme (pg_trgm). 0.3 attrape les fautes de frappe
// courantes ("vegetta"→Vegeta) sans bruit sur les noms courts.
const FUZZY_THRESHOLD = 0.3;

// WHERE tolérant aux fautes : substring (ILIKE, conserve le prefix/partial)
// OU proximité trigramme, le tout insensible casse + accents (unaccent).
// Tables wiki ~dizaines de lignes → seq-scan sub-ms, aucun index requis.
function fuzzyWhere(term: string, cols: PgColumn[]) {
	const pat = `%${term}%`;
	return or(
		...cols.flatMap((c) => [
			ilike(c, pat),
			sql`similarity(unaccent(lower(${c})), unaccent(lower(${term}))) > ${FUZZY_THRESHOLD}`,
		]),
	);
}

// ORDER BY pertinence : égalité exacte > préfixe > meilleure proximité
// trigramme (toutes colonnes confondues).
function fuzzyOrder(term: string, cols: PgColumn[]) {
	const primary = cols[0];
	const sim = sql`greatest(${sql.join(
		cols.map(
			(c) => sql`similarity(unaccent(lower(${c})), unaccent(lower(${term})))`,
		),
		sql`, `,
	)})`;
	return [
		sql`(lower(${primary}) = lower(${term})) desc`,
		sql`(unaccent(lower(${primary})) like unaccent(lower(${term})) || '%') desc`,
		sql`${sim} desc nulls last`,
	];
}

export const dbUniverse = {
	sagas: () =>
		safe(async () => ({
			sagas: (
				await db.select().from(botSagas).orderBy(asc(botSagas.orderIdx))
			).map(toSaga),
		})),

	saga: (slug: string) =>
		safe(async () => {
			const [s] = await db
				.select()
				.from(botSagas)
				.where(eq(botSagas.slug, slug))
				.limit(1);
			if (!s) return null;
			const arcs = (
				await db
					.select()
					.from(botArcs)
					.where(eq(botArcs.sagaId, s.id))
					.orderBy(asc(botArcs.orderIdx))
			).map(toArc);
			return { ...toSaga(s), arcs };
		}),

	arc: (slug: string) =>
		safe(async () => {
			const [a] = await db
				.select()
				.from(botArcs)
				.where(eq(botArcs.slug, slug))
				.limit(1);
			if (!a) return null;
			const episodes = (
				await db
					.select()
					.from(botEpisodes)
					.where(eq(botEpisodes.arcId, a.id))
					.orderBy(asc(botEpisodes.numberInSeries))
			).map(toEpisode);
			return { arc: toArc(a), episodes };
		}),

	episode: (id: number) =>
		safe(async () => {
			const [e] = await db
				.select()
				.from(botEpisodes)
				.where(eq(botEpisodes.id, id))
				.limit(1);
			return e ? toEpisode(e) : null;
		}),

	/** Flux résolu (HLS/mp4) + headers d'un épisode, pour le proxy HLS. */
	episodeStream: (id: number) =>
		safe(async () => {
			const [e] = await db
				.select({
					url: botEpisodes.streamUrl,
					headers: botEpisodes.streamHeaders,
				})
				.from(botEpisodes)
				.where(eq(botEpisodes.id, id))
				.limit(1);
			return e?.url ? { url: e.url, headers: e.headers ?? {} } : null;
		}),

	episodes: (series?: string, limit = 50, offset = 0) =>
		safe(async () => {
			const rows = series
				? await db
						.select()
						.from(botEpisodes)
						.where(eq(botEpisodes.series, series))
						.orderBy(asc(botEpisodes.numberInSeries))
						.limit(limit)
						.offset(offset)
				: await db
						.select()
						.from(botEpisodes)
						.orderBy(asc(botEpisodes.series), asc(botEpisodes.numberInSeries))
						.limit(limit)
						.offset(offset);
			const [{ n }] = await db
				.select({ n: sql<number>`count(*)::int` })
				.from(botEpisodes)
				.where(series ? eq(botEpisodes.series, series) : sql`true`);
			return { episodes: rows.map(toEpisode), total: Number(n ?? 0) };
		}),

	movies: () =>
		safe(async () => ({
			movies: (await db.select().from(botMovies)).map(toMovie),
		})),

	movie: (slug: string) =>
		safe(async () => {
			const [m] = await db
				.select()
				.from(botMovies)
				.where(
					/^\d+$/.test(slug)
						? eq(botMovies.id, Number(slug))
						: eq(botMovies.slug, slug),
				)
				.limit(1);
			return m ? toMovie(m) : null;
		}),

	games: () =>
		safe(async () => ({
			games: (await db.select().from(botGames)).map(toGame),
		})),

	game: (slug: string) =>
		safe(async () => {
			const [g] = await db
				.select()
				.from(botGames)
				.where(eq(botGames.slug, slug))
				.limit(1);
			return g ? toGame(g) : null;
		}),

	tools: () =>
		safe(async () => ({
			tools: (
				await db.select().from(botTools).orderBy(desc(botTools.stars))
			).map(toTool),
		})),

	tool: (slug: string) =>
		safe(async () => {
			const [t] = await db
				.select()
				.from(botTools)
				.where(eq(botTools.slug, slug))
				.limit(1);
			return t ? toTool(t) : null;
		}),

	races: () =>
		safe(async () => ({
			races: (await db.select().from(botRaces)).map(toRace),
		})),

	race: (slug: string) =>
		safe(async () => {
			const [r] = await db
				.select()
				.from(botRaces)
				.where(eq(botRaces.slug, slug))
				.limit(1);
			return r ? toRace(r) : null;
		}),

	transformations: () =>
		safe(async () => ({
			transformations: (await db.select().from(botTransformations)).map(
				toTransformation,
			),
		})),

	mangaVolumes: (series = "DB") =>
		safe(async () => ({
			volumes: (
				await db
					.select()
					.from(botMangaVolumes)
					.where(eq(botMangaVolumes.series, series))
					.orderBy(asc(botMangaVolumes.volumeNumber))
			).map(toMangaVolume),
		})),

	mangaVolume: (id: number) =>
		safe(async () => {
			const [v] = await db
				.select()
				.from(botMangaVolumes)
				.where(eq(botMangaVolumes.id, id))
				.limit(1);
			if (!v) return null;
			const chapters = (
				await db
					.select()
					.from(botMangaChapters)
					.where(eq(botMangaChapters.volumeId, id))
					.orderBy(asc(botMangaChapters.chapterNumber))
			).map(toMangaChapter);
			return { ...toMangaVolume(v), chapters };
		}),

	// Chapitres manga LISIBLES (pages renseignées) → index du lecteur de scan.
	readableMangaChapters: (series?: string) =>
		safe(async () => ({
			chapters: (
				await db
					.select()
					.from(botMangaChapters)
					.where(
						series
							? and(
									eq(botMangaChapters.series, series),
									isNotNull(botMangaChapters.pages),
								)
							: isNotNull(botMangaChapters.pages),
					)
					.orderBy(
						asc(botMangaChapters.series),
						asc(botMangaChapters.chapterNumber),
					)
			).map(toMangaChapter),
		})),

	// Un chapitre + ses pages + chapitres adjacents (nav lecteur).
	mangaChapter: (id: number) =>
		safe<MangaChapterRead | null>(async () => {
			const [c] = await db
				.select()
				.from(botMangaChapters)
				.where(eq(botMangaChapters.id, id))
				.limit(1);
			if (!c) return null;
			const [prev] = await db
				.select({ id: botMangaChapters.id })
				.from(botMangaChapters)
				.where(
					and(
						eq(botMangaChapters.series, c.series),
						isNotNull(botMangaChapters.pages),
						lt(botMangaChapters.chapterNumber, c.chapterNumber ?? 0),
					),
				)
				.orderBy(desc(botMangaChapters.chapterNumber))
				.limit(1);
			const [next] = await db
				.select({ id: botMangaChapters.id })
				.from(botMangaChapters)
				.where(
					and(
						eq(botMangaChapters.series, c.series),
						isNotNull(botMangaChapters.pages),
						gt(botMangaChapters.chapterNumber, c.chapterNumber ?? 0),
					),
				)
				.orderBy(asc(botMangaChapters.chapterNumber))
				.limit(1);
			return {
				...toMangaChapter(c),
				pages: Array.isArray(c.pages) ? c.pages : [],
				prev: prev?.id ?? null,
				next: next?.id ?? null,
			};
		}),

	news: (limit = 10) =>
		safe(async () => ({
			news: (
				await db
					.select()
					.from(botNews)
					.orderBy(desc(botNews.publishedAt))
					.limit(limit)
			).map(toNews),
		})),

	search: (q: string) =>
		safe<SearchResults>(async () => {
			const term = q.trim();
			if (term.length < 2) {
				return {
					q: term,
					characters: [],
					planets: [],
					sagas: [],
					movies: [],
					games: [],
					episodes: [],
					techniques: [],
				};
			}
			const charCols = [
				botCharacters.name,
				botCharacters.nameJa,
				botCharacters.nameRomaji,
			];
			const planetCols = [botPlanets.name, botPlanets.nameJa];
			const sagaCols = [botSagas.name, botSagas.nameJa];
			const movieCols = [botMovies.title, botMovies.titleJa];
			const gameCols = [botGames.title, botGames.titleJa];
			const episodeCols = [
				botEpisodes.title,
				botEpisodes.titleJa,
				botEpisodes.titleRomaji,
			];
			const techniqueCols = [
				botTechniques.name,
				botTechniques.nameJa,
				botTechniques.nameRomaji,
			];
			const [characters, planets, sagas, movies, games, episodes, techniques] =
				await Promise.all([
				db
					.select({
						id: botCharacters.id,
						name: botCharacters.name,
						name_ja: botCharacters.nameJa,
						image: botCharacters.image,
						race: botCharacters.race,
					})
					.from(botCharacters)
					.where(fuzzyWhere(term, charCols))
					.orderBy(...fuzzyOrder(term, charCols))
					.limit(20),
				db
					.select({
						id: botPlanets.id,
						name: botPlanets.name,
						name_ja: botPlanets.nameJa,
						image: botPlanets.image,
					})
					.from(botPlanets)
					.where(fuzzyWhere(term, planetCols))
					.orderBy(...fuzzyOrder(term, planetCols))
					.limit(10),
				db
					.select({
						id: botSagas.id,
						slug: botSagas.slug,
						name: botSagas.name,
						name_ja: botSagas.nameJa,
						series: botSagas.series,
					})
					.from(botSagas)
					.where(fuzzyWhere(term, sagaCols))
					.orderBy(...fuzzyOrder(term, sagaCols))
					.limit(10),
				db
					.select({
						id: botMovies.id,
						slug: botMovies.slug,
						title: botMovies.title,
						title_ja: botMovies.titleJa,
						series: botMovies.series,
					})
					.from(botMovies)
					.where(fuzzyWhere(term, movieCols))
					.orderBy(...fuzzyOrder(term, movieCols))
					.limit(10),
				db
					.select({
						id: botGames.id,
						slug: botGames.slug,
						title: botGames.title,
						title_ja: botGames.titleJa,
					})
					.from(botGames)
					.where(fuzzyWhere(term, gameCols))
					.orderBy(...fuzzyOrder(term, gameCols))
					.limit(10),
				db
					.select({
						id: botEpisodes.id,
						series: botEpisodes.series,
						number_in_series: botEpisodes.numberInSeries,
						title: botEpisodes.title,
						image: botEpisodes.image,
					})
					.from(botEpisodes)
					.where(fuzzyWhere(term, episodeCols))
					.orderBy(...fuzzyOrder(term, episodeCols))
					.limit(12),
				db
					.select({
						id: botTechniques.id,
						slug: botTechniques.slug,
						name: botTechniques.name,
						name_ja: botTechniques.nameJa,
						type: botTechniques.type,
					})
					.from(botTechniques)
					.where(fuzzyWhere(term, techniqueCols))
					.orderBy(...fuzzyOrder(term, techniqueCols))
					.limit(10),
			]);
			return {
				q: term,
				characters,
				planets,
				sagas: sagas.map((s) => ({ ...s, series: s.series ?? "" })),
				movies: movies.map((m) => ({ ...m, series: m.series ?? "" })),
				games,
				episodes: episodes.map((e) => ({
					...e,
					title: e.title ?? "",
					number_in_series: e.number_in_series ?? 0,
				})),
				techniques,
			};
		}),

	// RAG : recherche lexicale (BM25) sur l'index FTS5 `rag_chunks` du bot —
	// NON miroité dans Neon, donc reste servi par l'API REST du bot.
	rag: async (q: string, limit = 8) => {
		try {
			const r = await fetch(
				`${apiBase()}/api/public/rag/search?q=${encodeURIComponent(q)}&limit=${limit}`,
				{ next: { revalidate: 300 } },
			);
			if (!r.ok) return null;
			return (await r.json()) as {
				q: string;
				results: {
					kind: string;
					title: string;
					url: string;
					snippet: string;
				}[];
			};
		} catch {
			return null;
		}
	},
};
