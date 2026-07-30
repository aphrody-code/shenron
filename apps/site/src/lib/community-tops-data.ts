/**
 * community-tops-data — assemblage **server-only** des Top 3 communautaires.
 * Agrège `site_ratings` × entités wiki (épisodes / films / jeux).
 */
import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteRatings } from "@/db/schema";
import { botEpisodes, botMovies, botGames } from "@/db/bot-schema";
import {
	COMMUNITY_TOP_BOARDS,
	COMMUNITY_TOP_LIMIT,
	bayesianScore,
	type CommunityTopBoard,
	type CommunityTopBoardDef,
	type CommunityTopEntry,
	type CommunityTopsPayload,
} from "@/lib/community-tops";

type AggRow = {
	targetId: string;
	average: number;
	count: number;
	bayes: number;
};

async function ratingAggs(targetType: "episode" | "movie" | "game"): Promise<Map<string, AggRow>> {
	const rows = await db
		.select({
			targetId: siteRatings.targetId,
			average: sql<string>`avg(${siteRatings.score})::float8`,
			count: sql<string>`count(*)::int`,
		})
		.from(siteRatings)
		.where(eq(siteRatings.targetType, targetType))
		.groupBy(siteRatings.targetId);

	const map = new Map<string, AggRow>();
	for (const r of rows) {
		const count = Number(r.count ?? 0);
		if (count <= 0) continue;
		const average = Math.round(Number(r.average ?? 0) * 10) / 10;
		map.set(r.targetId, {
			targetId: r.targetId,
			average,
			count,
			bayes: bayesianScore(average, count),
		});
	}
	return map;
}

function rankEntries(
	candidates: Omit<CommunityTopEntry, "rank">[]
): CommunityTopEntry[] {
	return candidates
		.slice()
		.sort((a, b) => {
			if (b.bayes !== a.bayes) return b.bayes - a.bayes;
			if (b.count !== a.count) return b.count - a.count;
			if (b.average !== a.average) return b.average - a.average;
			return a.title.localeCompare(b.title, "fr");
		})
		.slice(0, COMMUNITY_TOP_LIMIT)
		.map((e, i) => ({ ...e, rank: (i + 1) as 1 | 2 | 3 }));
}

function epLabel(series: string | null, num: number | null): string {
	const s = (series ?? "").replace(/_/g, " ");
	if (num != null && Number.isFinite(num)) return `${s} · Ép. ${num}`;
	return s || "Épisode";
}

async function buildEpisodeBoard(
	def: CommunityTopBoardDef,
	aggs: Map<string, AggRow>
): Promise<CommunityTopBoard> {
	const ids = [...aggs.keys()].filter((id) => /^\d+$/.test(id));
	if (ids.length === 0 || def.series.length === 0) {
		return { def, entries: [], totalVotes: 0, ratedCount: 0 };
	}

	const numIds = ids.map(Number);
	const rows = await db
		.select({
			id: botEpisodes.id,
			series: botEpisodes.series,
			numberInSeries: botEpisodes.numberInSeries,
			title: botEpisodes.title,
			image: botEpisodes.image,
		})
		.from(botEpisodes)
		.where(
			and(inArray(botEpisodes.id, numIds), inArray(botEpisodes.series, [...def.series]))
		);

	let totalVotes = 0;
	const candidates: Omit<CommunityTopEntry, "rank">[] = [];
	for (const e of rows) {
		const agg = aggs.get(String(e.id));
		if (!agg) continue;
		totalVotes += agg.count;
		candidates.push({
			id: String(e.id),
			title: e.title?.trim() || `Épisode ${e.numberInSeries ?? e.id}`,
			subtitle: epLabel(e.series, e.numberInSeries),
			image: e.image,
			href: `/wiki/episodes/${e.id}`,
			average: agg.average,
			count: agg.count,
			bayes: agg.bayes,
		});
	}

	return {
		def,
		entries: rankEntries(candidates),
		totalVotes,
		ratedCount: candidates.length,
	};
}

async function buildMovieBoard(
	def: CommunityTopBoardDef,
	aggs: Map<string, AggRow>
): Promise<CommunityTopBoard> {
	const ids = [...aggs.keys()].filter((id) => /^\d+$/.test(id));
	if (ids.length === 0) {
		return { def, entries: [], totalVotes: 0, ratedCount: 0 };
	}

	const rows = await db
		.select({
			id: botMovies.id,
			slug: botMovies.slug,
			title: botMovies.title,
			series: botMovies.series,
			poster: botMovies.poster,
		})
		.from(botMovies)
		.where(inArray(botMovies.id, ids.map(Number)));

	let totalVotes = 0;
	const candidates: Omit<CommunityTopEntry, "rank">[] = [];
	for (const m of rows) {
		const agg = aggs.get(String(m.id));
		if (!agg) continue;
		totalVotes += agg.count;
		candidates.push({
			id: String(m.id),
			title: m.title,
			subtitle: m.series?.replace(/_/g, " ") ?? "Film",
			image: m.poster,
			href: `/wiki/films/${m.slug}`,
			average: agg.average,
			count: agg.count,
			bayes: agg.bayes,
		});
	}

	return {
		def,
		entries: rankEntries(candidates),
		totalVotes,
		ratedCount: candidates.length,
	};
}

async function buildGameBoard(
	def: CommunityTopBoardDef,
	aggs: Map<string, AggRow>
): Promise<CommunityTopBoard> {
	const ids = [...aggs.keys()].filter((id) => /^\d+$/.test(id));
	if (ids.length === 0) {
		return { def, entries: [], totalVotes: 0, ratedCount: 0 };
	}

	const rows = await db
		.select({
			id: botGames.id,
			slug: botGames.slug,
			title: botGames.title,
			cover: botGames.cover,
			platforms: botGames.platforms,
		})
		.from(botGames)
		.where(inArray(botGames.id, ids.map(Number)));

	let totalVotes = 0;
	const candidates: Omit<CommunityTopEntry, "rank">[] = [];
	for (const g of rows) {
		const agg = aggs.get(String(g.id));
		if (!agg) continue;
		totalVotes += agg.count;
		candidates.push({
			id: String(g.id),
			title: g.title,
			subtitle: g.platforms?.trim() || "Jeu vidéo",
			image: g.cover,
			href: `/wiki/jeux/${g.slug}`,
			average: agg.average,
			count: agg.count,
			bayes: agg.bayes,
		});
	}

	return {
		def,
		entries: rankEntries(candidates),
		totalVotes,
		ratedCount: candidates.length,
	};
}

/**
 * Charge tous les boards Top 3. Ne throw jamais → home / classements
 * restent utilisables même si la table ratings est vide.
 */
export async function getCommunityTops(): Promise<CommunityTopsPayload> {
	try {
		const [epAggs, movieAggs, gameAggs] = await Promise.all([
			ratingAggs("episode"),
			ratingAggs("movie"),
			ratingAggs("game"),
		]);

		const boards: CommunityTopBoard[] = [];
		for (const def of COMMUNITY_TOP_BOARDS) {
			if (def.kind === "episode") {
				boards.push(await buildEpisodeBoard(def, epAggs));
			} else if (def.kind === "movie") {
				boards.push(await buildMovieBoard(def, movieAggs));
			} else {
				boards.push(await buildGameBoard(def, gameAggs));
			}
		}

		const globalVotes = boards.reduce((n, b) => n + b.totalVotes, 0);
		return {
			boards,
			globalVotes,
			generatedAt: new Date().toISOString(),
		};
	} catch (e) {
		console.error("[community-tops] lecture échouée :", e);
		return {
			boards: COMMUNITY_TOP_BOARDS.map((def) => ({
				def,
				entries: [],
				totalVotes: 0,
				ratedCount: 0,
			})),
			globalVotes: 0,
			generatedAt: new Date().toISOString(),
		};
	}
}
