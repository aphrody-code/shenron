/**
 * db-universe — client unifié pour consommer l'API publique du bot Shenron.
 * Chaque fonction encapsule un fetch typé avec revalidate (ISR Vercel).
 */
import { env } from "@/lib/env";

const API = env.SHENRON_API_URL ?? "https://shenron.rpbey.fr";

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

export const dbUniverse = {
	sagas: () => get<{ sagas: Saga[] }>("/api/public/wiki/sagas"),
	saga: (slug: string) =>
		get<{ saga: Saga; arcs: Arc[] }>(
			`/api/public/wiki/sagas/${encodeURIComponent(slug)}`,
		),
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
	races: () => get<{ races: Race[] }>("/api/public/wiki/races"),
	transformations: () =>
		get<{ transformations: Transformation[] }>(
			"/api/public/wiki/transformations",
		),
	search: (q: string) =>
		get<SearchResults>(
			`/api/public/wiki/search?q=${encodeURIComponent(q)}`,
			300,
		),
};

export function assetUrl(path: string | null | undefined): string {
	if (!path) return "";
	if (path.startsWith("http")) return path;
	return `${API}${path.startsWith("/") ? "" : "/"}${path}`;
}
