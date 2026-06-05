import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import {
	botCharacters,
	botPlanets,
	botTechniques,
	botSagas,
	botArcs,
	botEpisodes,
	botMovies,
	botGames,
	botMangaVolumes,
	botMangaChapters,
} from "@/db/bot-schema";
import { eq } from "drizzle-orm";

export const revalidate = 86400; // Cache le sitemap pendant 24 heures

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticRoutes = [
		"",
		"/about",
		"/credits",
		"/actualites",
		"/jeux",
		"/jeux/2048",
		"/jeux/bingo",
		"/jeux/morpion",
		"/jeux/pfc",
		"/leaderboard",
		"/licence",
		"/personas",
		"/commands",
		"/wiki",
		"/wiki/dragon-ball",
		"/wiki/dragon-ball/techniques",
		"/wiki/episodes",
		"/wiki/manga",
		"/wiki/sagas",
		"/wiki/films",
		"/wiki/jeux",
		"/wiki/races",
		"/wiki/news",
	];

	const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: `${SITE_URL}${route}`,
		lastModified: new Date(),
		changeFrequency: route === "" || route === "/actualites" ? "daily" : "weekly",
		priority: route === "" ? 1.0 : route.startsWith("/wiki") ? 0.8 : 0.5,
	}));

	try {
		// 1. Personnages
		const chars = await db.select({ id: botCharacters.id }).from(botCharacters);
		for (const char of chars) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/dragon-ball/character/${char.id}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.7,
			});
		}

		// 2. Planètes
		const planets = await db.select({ id: botPlanets.id }).from(botPlanets);
		for (const planet of planets) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/dragon-ball/planet/${planet.id}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 3. Techniques
		const techniques = await db.select({ slug: botTechniques.slug }).from(botTechniques);
		for (const tech of techniques) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/dragon-ball/techniques/${tech.slug}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 4. Sagas
		const sagas = await db.select({ slug: botSagas.slug }).from(botSagas);
		for (const saga of sagas) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/sagas/${saga.slug}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.7,
			});
		}

		// 5. Arcs
		const arcs = await db.select({ slug: botArcs.slug }).from(botArcs);
		for (const arc of arcs) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/arcs/${arc.slug}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 6. Épisodes
		const episodes = await db.select({ id: botEpisodes.id }).from(botEpisodes);
		for (const ep of episodes) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/episodes/${ep.id}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 7. Films
		const movies = await db.select({ slug: botMovies.slug }).from(botMovies);
		for (const movie of movies) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/films/${movie.slug}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.7,
			});
		}

		// 8. Jeux
		const games = await db.select({ slug: botGames.slug }).from(botGames);
		for (const game of games) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/jeux/${game.slug}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 9. Manga Tomes/Volumes
		const vols = await db.select({ id: botMangaVolumes.id }).from(botMangaVolumes);
		for (const vol of vols) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/manga/volume/${vol.id}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 10. Manga Chapitres
		const chaps = await db.select({ id: botMangaChapters.id }).from(botMangaChapters);
		for (const chap of chaps) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/manga/${chap.id}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 11. Blog posts
		const blogPosts = await db.select({ slug: posts.slug }).from(posts).where(eq(posts.published, true));
		for (const post of blogPosts) {
			sitemapEntries.push({
				url: `${SITE_URL}/post/${post.slug}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.8,
			});
		}
	} catch (error) {
		console.error("[SITEMAP GENERATION] Failed to fetch dynamic database routes:", error);
	}

	return sitemapEntries;
}
