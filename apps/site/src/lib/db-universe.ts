/**
 * db-universe — client unifié pour consommer l'API publique du bot Shenron.
 * Chaque fonction encapsule un fetch typé avec revalidate (ISR Vercel).
 */
import { env } from "@/lib/env";

const API = (env.SHENRON_API_URL ?? "https://bot.rpbey.fr").replace(/\/+$/, "");

async function get<T>(path: string, revalidate = 3600): Promise<T | null> {
	try {
		const r = await fetch(`${API}${path}`, { next: { revalidate } });
		if (!r.ok) return null;
		return (await r.json()) as T;
	} catch {
		return null;
	}
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

export const dbUniverse = {
	sagas: () => get<{ sagas: Saga[] }>("/api/public/wiki/sagas"),
	saga: (slug: string) =>
		get<{ saga: Saga; arcs: Arc[] }>(
			`/api/public/wiki/sagas/${encodeURIComponent(slug)}`,
		),
	arc: (slug: string) =>
		get<{ arc: Arc; episodes: Episode[] }>(
			`/api/public/wiki/arcs/${encodeURIComponent(slug)}`,
		),
	episode: (id: number) => get<Episode>(`/api/public/wiki/episodes/${id}`),
	episodes: (series?: string, limit = 50, offset = 0) =>
		get<{ episodes: Episode[]; total: number }>(
			`/api/public/wiki/episodes?${new URLSearchParams({
				...(series ? { series } : {}),
				limit: String(limit),
				offset: String(offset),
			})}`,
			1800,
		),
	movies: () => get<{ movies: Movie[] }>("/api/public/wiki/movies"),
	movie: (slug: string) =>
		get<Movie>(`/api/public/wiki/movies/${encodeURIComponent(slug)}`),
	games: () => get<{ games: Game[] }>("/api/public/wiki/games"),
	game: (slug: string) =>
		get<Game>(`/api/public/wiki/games/${encodeURIComponent(slug)}`),
	tools: () => get<{ tools: Tool[] }>("/api/public/wiki/tools"),
	tool: (slug: string) =>
		get<Tool>(`/api/public/wiki/tools/${encodeURIComponent(slug)}`),
	races: () => get<{ races: Race[] }>("/api/public/wiki/races"),
	race: (slug: string) =>
		get<Race>(`/api/public/wiki/races/${encodeURIComponent(slug)}`),
	transformations: () =>
		get<{ transformations: Transformation[] }>(
			"/api/public/wiki/transformations",
		),
	mangaVolumes: (series = "DB") =>
		get<{ volumes: MangaVolume[] }>(
			`/api/public/wiki/manga/volumes?series=${series}`,
		),
	mangaVolume: (id: number) =>
		get<MangaVolume & { chapters: MangaChapter[] }>(
			`/api/public/wiki/manga/volumes/${id}`,
		),
	news: (limit = 10) =>
		get<{ news: News[] }>(`/api/public/wiki/news?limit=${limit}`, 600),
	search: (q: string) =>
		get<SearchResults>(
			`/api/public/wiki/search?q=${encodeURIComponent(q)}`,
			300,
		),
	// RAG : recherche lexicale (BM25) sur l'index rag_chunks du bot.
	rag: (q: string, limit = 8) =>
		get<{
			q: string;
			results: { kind: string; title: string; url: string; snippet: string }[];
		}>(`/api/public/rag/search?q=${encodeURIComponent(q)}&limit=${limit}`, 300),
};

export function assetUrl(path: string | null | undefined): string {
	if (!path) return "";
	if (path.startsWith("http")) return path;
	// Les chemins DB sont relatifs (`./assets/...`) → normaliser en `/assets/...`
	// (sinon next/image fetch `${API}/./assets/...` côté serveur → 404).
	const clean = path.replace(/^\.?\/*/, "");
	return `${API}/${clean}`;
}
