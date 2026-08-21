import type { Metadata } from "next";
import { db } from "@/lib/db";
import {
	getShenronPersonas,
	getShenronStats,
	getShenronLeaderboard,
	getShenronPresence,
} from "@/lib/shenron";
import { HomeExperience } from "@/components/home/HomeExperience";
import { getHomeConfig } from "@/lib/home-config";
import { getSagaBestOf } from "@/lib/home-bestof-data";
import { getCommunityTops } from "@/lib/community-tops-data";
import {
	botSagas,
	botEpisodes,
	botMovies,
	botCharacters,
	botPlanets,
	botMangaChapters,
} from "@/db/bot-schema";
import { sql } from "drizzle-orm";
import { publicPostFilter } from "@/lib/posts";
import { ogMeta } from "@/lib/og";
import { getLaunchConfig } from "@/lib/wiki-launch-config";

export const revalidate = 120;

export const metadata: Metadata = {
	title: {
		absolute: "DBFR — Le voyage dans l'univers Dragon Ball",
	},
	description:
		"Explore l'univers Dragon Ball en français : personnages, sagas, planètes, films, jeux, manga et actualités anime. Une communauté et six bots Discord pour vivre Dragon Ball.",
	...ogMeta({
		title: "DBFR — Le voyage dans l'univers Dragon Ball",
		description:
			"Explore l'univers Dragon Ball en français : personnages, sagas, planètes, films, jeux et actualités.",
		type: "website",
		canonical: "/",
	}),
};

function getLatestPosts() {
	return db.query.posts.findMany({
		// Règle de visibilité unique du site : `published` seul laisserait remonter
		// en home les articles programmés avant leur date de parution.
		where: publicPostFilter(),
		orderBy: (p, { desc }) => desc(p.publishedAt),
		limit: 3,
		with: { author: true },
	});
}

async function getWikiCounts() {
	try {
		const [sagas, episodes, movies, characters, planets, chapters] = await Promise.all([
			db.select({ count: sql<number>`count(*)::int` }).from(botSagas),
			db.select({ count: sql<number>`count(*)::int` }).from(botEpisodes),
			db.select({ count: sql<number>`count(*)::int` }).from(botMovies),
			db.select({ count: sql<number>`count(*)::int` }).from(botCharacters),
			db.select({ count: sql<number>`count(*)::int` }).from(botPlanets),
			db.select({ count: sql<number>`count(*)::int` }).from(botMangaChapters),
		]);
		return {
			sagas: sagas[0]?.count ?? 0,
			episodes: episodes[0]?.count ?? 0,
			movies: movies[0]?.count ?? 0,
			characters: characters[0]?.count ?? 0,
			planets: planets[0]?.count ?? 0,
			chapters: chapters[0]?.count ?? 0,
		};
	} catch (e) {
		console.error("Failed to fetch wiki counts:", e);
		return {
			sagas: 0,
			episodes: 0,
			movies: 0,
			characters: 0,
			planets: 0,
			chapters: 0,
		};
	}
}

async function getFeaturedCharacters() {
	try {
		return await db
			.select({
				id: botCharacters.id,
				name: botCharacters.name,
				nameJa: botCharacters.nameJa,
				race: botCharacters.race,
				ki: botCharacters.ki,
				image: botCharacters.image,
			})
			.from(botCharacters);
	} catch (e) {
		console.error("Failed to fetch characters:", e);
		return [];
	}
}

async function getSagas() {
	try {
		return await db
			.select({
				id: botSagas.id,
				slug: botSagas.slug,
				name: botSagas.name,
				series: botSagas.series,
				description: botSagas.description,
				image: botSagas.image,
			})
			.from(botSagas)
			.orderBy(botSagas.orderIdx);
	} catch (e) {
		console.error("Failed to fetch sagas:", e);
		return [];
	}
}

export default async function Home() {
	const [
		posts,
		personas,
		stats,
		wikiCounts,
		characters,
		sagas,
		bestof,
		communityTops,
		topMembers,
		presence,
		config,
		access,
	] = await Promise.all([
		getLatestPosts().catch(() => [] as Awaited<ReturnType<typeof getLatestPosts>>),
		getShenronPersonas().catch(() => []),
		getShenronStats(),
		getWikiCounts(),
		getFeaturedCharacters(),
		getSagas(),
		getSagaBestOf(),
		getCommunityTops(),
		getShenronLeaderboard(12, true).catch(() => []),
		getShenronPresence().catch(() => ({ total: 0, online: 0, members: [] })),
		getHomeConfig(),
		// Instantané de la configuration de lancement : le deck est un composant
		// client et ne peut pas le lire. Sans lui, l'accueil publie des liens vers
		// des rubriques fermées dès que la section correspondante est activée.
		getLaunchConfig().catch(() => null),
	]);

	return (
		<HomeExperience
			config={config}
			access={access}
			stats={stats}
			personas={personas.map((p) => ({
				id: p.id,
				name: p.name,
				avatar: p.avatar,
				online: p.online,
			}))}
			wikiCounts={wikiCounts}
			characters={characters
				.filter((c) => !!c.image)
				.slice(0, 12)
				.map((c) => ({
					id: c.id,
					name: c.name,
					nameJa: c.nameJa,
					race: c.race,
					ki: c.ki,
					image: c.image,
				}))}
			sagas={sagas.slice(0, 8).map((s) => ({
				id: s.id,
				slug: s.slug,
				name: s.name,
				series: s.series,
				description: s.description,
			}))}
			bestof={bestof}
			communityTops={communityTops}
			posts={posts.map((p) => ({
				id: p.id,
				slug: p.slug,
				title: p.title,
				excerpt: p.excerpt,
				cover: p.cover,
				createdAt: p.createdAt,
				author: {
					username: p.author.username,
					avatar: p.author.avatar,
				},
			}))}
			topMembers={topMembers.map((m) => ({
				rank: m.rank,
				discordId: m.discordId,
				username: m.username,
				avatarUrl: m.avatarUrl,
				xp: m.xp,
				level: m.level,
			}))}
			presence={presence}
		/>
	);
}
