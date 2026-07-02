import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { botEpisodes, botMovies, botMangaVolumes, botMangaChapters } from "@/db/bot-schema";
import { eq } from "drizzle-orm";

export const revalidate = 86400; // Cache le sitemap pendant 24 heures

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Sections /wiki publiques en bêta = WIKI_OPEN de src/middleware.ts
	// (episodes/films/manga). Les autres préfixes /wiki sont 307-redirigés vers /
	// par le middleware → ne PAS les publier dans le sitemap (sinon Google crawle
	// ~2300 redirections et le catalogue des URLs cachées fuite). À la réouverture
	// post-bêta : réajouter ici les préfixes rouverts + leurs boucles DB ci-dessous.
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
		"/stats",
		"/wiki/episodes",
		"/wiki/films",
		"/wiki/chronologie",
		"/wiki/manga",
	];

	const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: `${SITE_URL}${route}`,
		lastModified: new Date(),
		changeFrequency: route === "" || route === "/actualites" ? "daily" : "weekly",
		priority: route === "" ? 1.0 : route.startsWith("/wiki") ? 0.8 : 0.5,
	}));

	try {
		// Entités des sections wiki PUBLIQUES uniquement (cf. WIKI_OPEN,
		// src/middleware.ts) : épisodes, films, manga (volumes + chapitres) + posts
		// du blog. Les entités des sections bloquées (personnages, planètes,
		// techniques, sagas, arcs, jeux, pages wiki custom) sont 307-redirigées
		// vers / → exclues tant que la bêta dure. Réintroduire leurs boucles ici à
		// la réouverture, en parallèle des préfixes de staticRoutes.

		// 1. Épisodes
		const episodes = await db
			.select({ id: botEpisodes.id, airDate: botEpisodes.airDate })
			.from(botEpisodes);
		for (const ep of episodes) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/episodes/${ep.id}`,
				lastModified: ep.airDate ? new Date(Number(ep.airDate) * 1000) : new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 2. Films
		const movies = await db
			.select({ slug: botMovies.slug, releaseDate: botMovies.releaseDate })
			.from(botMovies);
		for (const movie of movies) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/films/${movie.slug}`,
				lastModified: movie.releaseDate ? new Date(Number(movie.releaseDate) * 1000) : new Date(),
				changeFrequency: "weekly",
				priority: 0.7,
			});
		}

		// 3. Manga Tomes/Volumes
		const vols = await db
			.select({ id: botMangaVolumes.id, publishedAt: botMangaVolumes.publishedAt })
			.from(botMangaVolumes);
		for (const vol of vols) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/manga/volume/${vol.id}`,
				lastModified: vol.publishedAt ? new Date(Number(vol.publishedAt) * 1000) : new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 4. Manga Chapitres
		const chaps = await db
			.select({ id: botMangaChapters.id, publishedAt: botMangaChapters.publishedAt })
			.from(botMangaChapters);
		for (const chap of chaps) {
			sitemapEntries.push({
				url: `${SITE_URL}/wiki/manga/${chap.id}`,
				lastModified: chap.publishedAt ? new Date(Number(chap.publishedAt) * 1000) : new Date(),
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}

		// 5. Blog posts
		const blogPosts = await db
			.select({ slug: posts.slug, updatedAt: posts.updatedAt })
			.from(posts)
			.where(eq(posts.published, true));
		for (const post of blogPosts) {
			sitemapEntries.push({
				url: `${SITE_URL}/post/${post.slug}`,
				lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
				changeFrequency: "weekly",
				priority: 0.8,
			});
		}
	} catch (error) {
		console.error("[SITEMAP GENERATION] Failed to fetch dynamic database routes:", error);
	}

	return sitemapEntries;
}
