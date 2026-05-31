import { db } from "@/lib/db";
import { getShenronPersonas, getShenronStats } from "@/lib/shenron";
import { HomeExperience } from "@/components/home/HomeExperience";
import {
	botSagas,
	botEpisodes,
	botMovies,
	botCharacters,
	botPlanets,
	botMangaChapters,
} from "@/db/bot-schema";
import { sql } from "drizzle-orm";

export const revalidate = 120;

function getLatestPosts() {
	return db.query.posts.findMany({
		where: (p, { eq }) => eq(p.published, true),
		orderBy: (p, { desc }) => desc(p.createdAt),
		limit: 3,
		with: { author: true },
	});
}

async function getWikiCounts() {
	try {
		const [sagas, episodes, movies, characters, planets, chapters] =
			await Promise.all([
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

export default async function Home() {
	const [posts, personas, stats, wikiCounts] = await Promise.all([
		getLatestPosts().catch(
			() => [] as Awaited<ReturnType<typeof getLatestPosts>>,
		),
		getShenronPersonas().catch(() => []),
		getShenronStats(),
		getWikiCounts(),
	]);

	return (
		<HomeExperience
			stats={stats}
			personas={personas.map((p) => ({
				id: p.id,
				name: p.name,
				avatar: p.avatar,
				online: p.online,
			}))}
			wikiCounts={wikiCounts}
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
		/>
	);
}
