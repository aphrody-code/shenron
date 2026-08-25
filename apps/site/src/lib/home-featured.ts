// SPDX-License-Identifier: Apache-2.0
/**
 * Chargement serveur des grilles « featured » pour la home immersive.
 * Tirage semi-aléatoire (ordre hashé sur l'heure / revalidate 120s) pour
 * faire tourner les vignettes sans casser le cache ISR.
 */
import "server-only";
import { db } from "@/lib/db";
import {
	botCharacters,
	botDatabooks,
	botEpisodes,
	botGames,
	botMangaVolumes,
	botMovies,
	botPlanets,
	botRaces,
	botSagas,
	botTransformations,
} from "@/db/bot-schema";
import { and, isNotNull, ne, sql } from "drizzle-orm";
import type { FeaturedCard } from "@/lib/home-media";

export type { FeaturedCard };

/** Offset pseudo-aléatoire stable pendant ~revalidate (2 min). */
function timeBucket(mod: number): number {
	const bucket = Math.floor(Date.now() / 120_000);
	return bucket % Math.max(1, mod);
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
	try {
		return await fn();
	} catch (e) {
		console.error("[home-featured]", e);
		return fallback;
	}
}

export async function getFeaturedEpisodes(limit = 12): Promise<FeaturedCard[]> {
	return safe(async () => {
		const rows = await db
			.select({
				id: botEpisodes.id,
				series: botEpisodes.series,
				number: botEpisodes.numberInSeries,
				title: botEpisodes.title,
				image: botEpisodes.image,
			})
			.from(botEpisodes)
			.where(and(isNotNull(botEpisodes.image), ne(botEpisodes.image, "")))
			.orderBy(sql`md5(${botEpisodes.id}::text || ${timeBucket(41).toString()})`)
			.limit(limit);
		return rows.map((r) => ({
			id: r.id,
			href: `/wiki/episodes/${r.id}`,
			title: r.title?.trim() || `Épisode ${r.number ?? r.id}`,
			subtitle: r.series ? `${r.series}${r.number != null ? ` · #${r.number}` : ""}` : null,
			image: r.image,
			badge: r.series,
		}));
	}, []);
}

export async function getFeaturedMovies(limit = 10): Promise<FeaturedCard[]> {
	return safe(async () => {
		const rows = await db
			.select({
				id: botMovies.id,
				slug: botMovies.slug,
				title: botMovies.title,
				poster: botMovies.poster,
				series: botMovies.series,
			})
			.from(botMovies)
			.where(and(isNotNull(botMovies.poster), ne(botMovies.poster, "")))
			.orderBy(sql`md5(${botMovies.id}::text || ${timeBucket(17).toString()})`)
			.limit(limit);
		return rows.map((r) => ({
			id: r.id,
			href: `/wiki/films/${r.slug}`,
			title: r.title,
			subtitle: r.series,
			image: r.poster,
			badge: "Film",
		}));
	}, []);
}

export async function getFeaturedGames(limit = 10): Promise<FeaturedCard[]> {
	return safe(async () => {
		const rows = await db
			.select({
				id: botGames.id,
				slug: botGames.slug,
				title: botGames.title,
				cover: botGames.cover,
				platforms: botGames.platforms,
			})
			.from(botGames)
			.where(and(isNotNull(botGames.cover), ne(botGames.cover, "")))
			.orderBy(sql`md5(${botGames.id}::text || ${timeBucket(13).toString()})`)
			.limit(limit);
		return rows.map((r) => ({
			id: r.id,
			href: `/wiki/jeux/${r.slug}`,
			title: r.title,
			subtitle: r.platforms,
			image: r.cover,
			badge: "Jeu",
		}));
	}, []);
}

export async function getFeaturedPlanets(limit = 10): Promise<FeaturedCard[]> {
	return safe(async () => {
		const rows = await db
			.select({
				id: botPlanets.id,
				name: botPlanets.name,
				image: botPlanets.image,
				nameJa: botPlanets.nameJa,
			})
			.from(botPlanets)
			.where(and(isNotNull(botPlanets.image), ne(botPlanets.image, "")))
			.orderBy(sql`md5(${botPlanets.id}::text || ${timeBucket(11).toString()})`)
			.limit(limit);
		return rows.map((r) => ({
			id: r.id,
			href: `/wiki/planetes/${r.id}`,
			title: r.name,
			subtitle: r.nameJa,
			image: r.image,
			badge: "Planète",
		}));
	}, []);
}

export async function getFeaturedDatabooks(limit = 8): Promise<FeaturedCard[]> {
	return safe(async () => {
		const rows = await db
			.select({
				id: botDatabooks.id,
				title: botDatabooks.title,
				cover: botDatabooks.cover,
				kind: botDatabooks.kind,
				category: botDatabooks.category,
			})
			.from(botDatabooks)
			.where(and(isNotNull(botDatabooks.cover), ne(botDatabooks.cover, "")))
			.orderBy(sql`md5(${botDatabooks.id}::text || ${timeBucket(9).toString()})`)
			.limit(limit);
		return rows.map((r) => ({
			id: r.id,
			href: `/wiki/databooks/${r.id}`,
			title: r.title,
			subtitle: r.category ?? r.kind,
			image: r.cover,
			badge: r.kind === "interview" ? "Interview" : "Databook",
		}));
	}, []);
}

export async function getFeaturedManga(limit = 10): Promise<FeaturedCard[]> {
	return safe(async () => {
		const rows = await db
			.select({
				id: botMangaVolumes.id,
				series: botMangaVolumes.series,
				volumeNumber: botMangaVolumes.volumeNumber,
				title: botMangaVolumes.title,
				cover: botMangaVolumes.cover,
			})
			.from(botMangaVolumes)
			.where(and(isNotNull(botMangaVolumes.cover), ne(botMangaVolumes.cover, "")))
			.orderBy(sql`md5(${botMangaVolumes.id}::text || ${timeBucket(7).toString()})`)
			.limit(limit);
		return rows.map((r) => ({
			id: r.id,
			href: `/wiki/manga/volume/${r.id}`,
			title: r.title?.trim() || `Tome ${r.volumeNumber ?? r.id}`,
			subtitle: r.series
				? `${r.series}${r.volumeNumber != null ? ` · T${r.volumeNumber}` : ""}`
				: null,
			image: r.cover,
			badge: "Manga",
		}));
	}, []);
}

export async function getFeaturedTransformations(limit = 8): Promise<FeaturedCard[]> {
	return safe(async () => {
		const rows = await db
			.select({
				id: botTransformations.id,
				name: botTransformations.name,
				image: botTransformations.image,
				ki: botTransformations.ki,
			})
			.from(botTransformations)
			.where(and(isNotNull(botTransformations.image), ne(botTransformations.image, "")))
			.orderBy(sql`md5(${botTransformations.id}::text || ${timeBucket(19).toString()})`)
			.limit(limit);
		return rows.map((r) => ({
			id: r.id,
			href: `/wiki/transformations`,
			title: r.name,
			subtitle: r.ki ? `Ki ${r.ki}` : null,
			image: r.image,
			badge: "Forme",
		}));
	}, []);
}

/** Personnages featured avec shuffle stable (plus de 12, images HQ). */
export async function getFeaturedCharactersRich(limit = 18): Promise<
	{
		id: number;
		name: string;
		nameJa: string | null;
		race: string | null;
		ki: string | null;
		image: string | null;
	}[]
> {
	return safe(async () => {
		const rows = await db
			.select({
				id: botCharacters.id,
				name: botCharacters.name,
				nameJa: botCharacters.nameJa,
				race: botCharacters.race,
				ki: botCharacters.ki,
				image: botCharacters.image,
			})
			.from(botCharacters)
			.where(and(isNotNull(botCharacters.image), ne(botCharacters.image, "")))
			.orderBy(sql`md5(${botCharacters.id}::text || ${timeBucket(23).toString()})`)
			.limit(limit);
		return rows;
	}, []);
}

export async function getSagasRich(limit = 12): Promise<
	{
		id: number;
		slug: string | null;
		name: string;
		series: string | null;
		description: string | null;
		image: string | null;
	}[]
> {
	return safe(async () => {
		return db
			.select({
				id: botSagas.id,
				slug: botSagas.slug,
				name: botSagas.name,
				series: botSagas.series,
				description: botSagas.description,
				image: botSagas.image,
			})
			.from(botSagas)
			.orderBy(botSagas.orderIdx)
			.limit(limit);
	}, []);
}

export type WikiCountsExtended = {
	sagas: number;
	episodes: number;
	movies: number;
	characters: number;
	planets: number;
	chapters: number;
	games: number;
	databooks: number;
	races: number;
	transformations: number;
};

export async function getWikiCountsExtended(): Promise<WikiCountsExtended> {
	return safe(
		async () => {
			const [
				sagas,
				episodes,
				movies,
				characters,
				planets,
				chapters,
				games,
				databooks,
				races,
				transformations,
			] = await Promise.all([
				db.select({ count: sql<number>`count(*)::int` }).from(botSagas),
				db.select({ count: sql<number>`count(*)::int` }).from(botEpisodes),
				db.select({ count: sql<number>`count(*)::int` }).from(botMovies),
				db.select({ count: sql<number>`count(*)::int` }).from(botCharacters),
				db.select({ count: sql<number>`count(*)::int` }).from(botPlanets),
				db.select({ count: sql<number>`count(*)::int` }).from(botMangaVolumes),
				db.select({ count: sql<number>`count(*)::int` }).from(botGames),
				db.select({ count: sql<number>`count(*)::int` }).from(botDatabooks),
				db.select({ count: sql<number>`count(*)::int` }).from(botRaces),
				db.select({ count: sql<number>`count(*)::int` }).from(botTransformations),
			]);
			return {
				sagas: sagas[0]?.count ?? 0,
				episodes: episodes[0]?.count ?? 0,
				movies: movies[0]?.count ?? 0,
				characters: characters[0]?.count ?? 0,
				planets: planets[0]?.count ?? 0,
				chapters: chapters[0]?.count ?? 0,
				games: games[0]?.count ?? 0,
				databooks: databooks[0]?.count ?? 0,
				races: races[0]?.count ?? 0,
				transformations: transformations[0]?.count ?? 0,
			};
		},
		{
			sagas: 0,
			episodes: 0,
			movies: 0,
			characters: 0,
			planets: 0,
			chapters: 0,
			games: 0,
			databooks: 0,
			races: 0,
			transformations: 0,
		}
	);
}
