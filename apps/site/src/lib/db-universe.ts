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
import { asc, desc, eq, ilike, or, sql } from "drizzle-orm";
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
				return { q: term, characters: [], planets: [], sagas: [], movies: [], games: [] };
			}
			const p = `%${term}%`;
			const [characters, planets, sagas, movies, games] = await Promise.all([
				db
					.select({
						id: botCharacters.id,
						name: botCharacters.name,
						name_ja: botCharacters.nameJa,
						image: botCharacters.image,
						race: botCharacters.race,
					})
					.from(botCharacters)
					.where(
						or(
							ilike(botCharacters.name, p),
							ilike(botCharacters.nameJa, p),
							ilike(botCharacters.nameRomaji, p),
						),
					)
					.limit(20),
				db
					.select({
						id: botPlanets.id,
						name: botPlanets.name,
						name_ja: botPlanets.nameJa,
						image: botPlanets.image,
					})
					.from(botPlanets)
					.where(or(ilike(botPlanets.name, p), ilike(botPlanets.nameJa, p)))
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
					.where(or(ilike(botSagas.name, p), ilike(botSagas.nameJa, p)))
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
					.where(or(ilike(botMovies.title, p), ilike(botMovies.titleJa, p)))
					.limit(10),
				db
					.select({
						id: botGames.id,
						slug: botGames.slug,
						title: botGames.title,
						title_ja: botGames.titleJa,
					})
					.from(botGames)
					.where(or(ilike(botGames.title, p), ilike(botGames.titleJa, p)))
					.limit(10),
			]);
			return {
				q: term,
				characters,
				planets,
				sagas: sagas.map((s) => ({ ...s, series: s.series ?? "" })),
				movies: movies.map((m) => ({ ...m, series: m.series ?? "" })),
				games,
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
