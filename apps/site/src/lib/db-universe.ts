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
import { cache } from "react";
import { and, asc, desc, eq, gt, ilike, isNotNull, lt, or, sql } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { db } from "@/lib/db";
import { API_URL } from "@/lib/config";
import {
	botArcs,
	botDatabooks,
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
	botGameCharacters,
	botCharacterTechniques,
	botCharacterArcs,
	botTechniques,
	botTools,
	botTransformations,
} from "@/db/bot-schema";
import type { EpisodeFrame, WikiSource } from "@/db/bot-schema";
import { eraOf, type TimelineItem } from "@/lib/chronology";
import { orderPlayers } from "@/lib/players";

// Re-export pour back-compat des pages serveur qui importaient assetUrl ici.
export { assetUrl } from "@/lib/assets";
export type { EpisodeFrame, WikiSource } from "@/db/bot-schema";

/** Champs article long-format (Fandom-like) — contrat snake_case du site. */
type WithArticle = { article: string | null; article_sources: WikiSource[] | null };

// API REST du bot — uniquement pour le RAG (index FTS5 `rag_chunks`, NON
// miroité dans Neon). Base résolue par `@/lib/config` (source unique des URL).
function apiBase(): string {
	return API_URL;
}

export type Saga = WithArticle & {
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
	players: { name: string; provider: string; embedUrl: string; lang?: "vf" | "vostfr" }[] | null;
	stream_url: string | null;
	// Scènes d'épisode : frames extraites + montage MP4 preview animé.
	frames: EpisodeFrame[] | null;
	scene_preview: string | null;
};

export type EpisodeNavItem = {
	id: number;
	number_in_series: number;
	title: string;
	image: string | null;
};

export type MovieNavItem = {
	id: number;
	slug: string;
	title: string;
	poster: string | null;
	release_date: number | null;
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
	video_url: string | null;
	subtitles: { lang: string; label: string; src: string }[] | null;
	players: { name: string; provider: string; embedUrl: string; lang?: "vf" | "vostfr" }[] | null;
	stream_url: string | null;
};

export type GameMedia = {
	type: "image" | "youtube";
	url: string;
	caption?: string | null;
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
	/** Galerie style Steam (images + trailers YouTube). */
	media: GameMedia[];
	characters?: Array<{ id: number; name: string; name_ja: string | null; image: string | null }>;
};

export type Race = WithArticle & {
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
	/**
	 * Présence d'un article rédigé — pas son contenu. L'index n'affiche pas le
	 * texte, il a seulement besoin de savoir si la forme a une fiche vers
	 * laquelle pointer ; embarquer 23 articles de 2 à 3 Ko dans la charge d'un
	 * index serait payer le texte deux fois.
	 */
	a_article?: boolean;
};

export type MangaVolume = {
	id: number;
	series: string;
	volume_number: number;
	title: string | null;
	cover: string | null;
	title_ja?: string | null;
	published_at?: number | null;
	isbn?: string | null;
};

export type MangaChapter = {
	id: number;
	series: string;
	chapter_number: number;
	title: string | null;
	volume_id: number | null;
	cover: string | null;
	pages?: string[] | null;
};

/** Chapitre + ses pages, pour le lecteur de scan. `prev`/`next` = chapitres
 *  adjacents (même série, par numéro) pour la navigation. */
export type MangaChapterRead = MangaChapter & {
	pages: string[];
	prev: number | null;
	next: number | null;
	prevPages?: string[] | null;
	nextPages?: string[] | null;
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
	races: Array<{
		id: number;
		slug: string;
		name: string;
		name_ja: string | null;
	}>;
	transformations: Array<{
		id: number;
		name: string;
		image: string | null;
		character_id: number;
	}>;
	arcs: Array<{
		id: number;
		slug: string;
		name: string;
		name_ja: string | null;
		saga_slug: string | null;
	}>;
	mangaVolumes: Array<{
		id: number;
		series: string;
		volume_number: number | null;
		title: string | null;
		cover: string | null;
	}>;
	mangaChapters: Array<{
		id: number;
		series: string;
		chapter_number: number | null;
		title: string | null;
	}>;
};

export type Arc = WithArticle & {
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
		article: r.article ?? null,
		article_sources: r.articleSources ?? null,
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
		article: r.article ?? null,
		article_sources: r.articleSources ?? null,
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
		// FR-first : synopsis traduit (translate-synopsis-fr.ts), repli sur l'original.
		synopsis: r.synopsisFr ?? r.synopsis,
		image: r.image,
		video_url: r.videoUrl,
		mal_id: r.malId,
		subtitles: r.subtitles ?? null,
		players: orderPlayers(r.players),
		stream_url: r.streamUrl ?? null,
		frames: r.frames ?? null,
		scene_preview: r.scenePreview ?? null,
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
		// FR-first : synopsis traduit (translate-synopsis-fr.ts), repli sur l'original.
		synopsis: r.synopsisFr ?? r.synopsis,
		poster: r.poster,
		trailer_url: r.trailerUrl,
		mal_id: r.malId,
		anilist_id: r.anilistId,
		video_url: r.videoUrl ?? null,
		subtitles: r.subtitles ?? null,
		players: orderPlayers(r.players),
		stream_url: r.streamUrl ?? null,
	};
}

function normalizeGameMedia(raw: unknown): GameMedia[] {
	if (!Array.isArray(raw)) return [];
	const out: GameMedia[] = [];
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const o = item as Record<string, unknown>;
		const url = typeof o.url === "string" ? o.url.trim() : "";
		if (!url) continue;
		const type = o.type === "youtube" ? "youtube" : "image";
		const caption = typeof o.caption === "string" && o.caption.trim() ? o.caption.trim() : null;
		out.push({ type, url, caption });
	}
	return out;
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
		media: normalizeGameMedia(r.media),
	};
}

function toRace(r: typeof botRaces.$inferSelect): Race {
	return {
		id: r.id,
		slug: r.slug,
		name: r.name,
		name_ja: r.nameJa,
		description: r.description,
		article: r.article ?? null,
		article_sources: r.articleSources ?? null,
	};
}

function toTransformation(r: typeof botTransformations.$inferSelect): Transformation {
	return {
		id: r.id,
		name: r.name,
		image: r.image,
		ki: r.ki,
		character_id: r.characterId ?? 0,
		// Même seuil que le `generateStaticParams` de la fiche : sous 50
		// caractères, aucune page n'est générée et le lien serait un 404.
		a_article: !!r.article && r.article.trim().length > 50,
	};
}

function toMangaVolume(r: typeof botMangaVolumes.$inferSelect): MangaVolume {
	return {
		id: r.id,
		series: r.series,
		volume_number: r.volumeNumber ?? 0,
		title: r.title,
		cover: r.cover,
		title_ja: r.titleJa,
		published_at: r.publishedAt,
		isbn: r.isbn,
	};
}

export type DatabookPage = {
	number: number;
	image: string | null;
	text: string | null;
};

export type Databook = {
	id: number;
	kind: string;
	title: string;
	title_ja: string | null;
	author: string | null;
	published_at: number | null;
	cover: string | null;
	description: string | null;
	source_url: string | null;
	category: string | null;
	pages: DatabookPage[];
};

function toDatabookPages(raw: unknown): DatabookPage[] {
	if (!Array.isArray(raw)) return [];
	const out: DatabookPage[] = [];
	for (let i = 0; i < raw.length; i++) {
		const p = raw[i];
		if (!p || typeof p !== "object") continue;
		const o = p as Record<string, unknown>;
		const n =
			typeof o.number === "number" && Number.isFinite(o.number)
				? Math.trunc(o.number)
				: typeof o.number === "string" && Number.isFinite(Number(o.number))
					? Math.trunc(Number(o.number))
					: i + 1;
		out.push({
			number: n,
			image: typeof o.image === "string" ? o.image : null,
			text: typeof o.text === "string" ? o.text : null,
		});
	}
	return out;
}

function toDatabook(r: typeof botDatabooks.$inferSelect): Databook {
	return {
		id: r.id,
		kind: r.kind,
		title: r.title,
		title_ja: r.titleJa,
		author: r.author,
		published_at: r.publishedAt,
		cover: r.cover,
		description: r.description,
		source_url: r.sourceUrl,
		category: r.category ?? null,
		pages: toDatabookPages(r.pages),
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
		pages: r.pages,
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
	} catch (e) {
		// Dégradation gracieuse (null) MAIS observable : sans ce log, une dérive de
		// schéma (colonne PG absente), un timeout de pool ou une panne PG seraient
		// invisibles dans journalctl. L'erreur postgres-js nomme la table/colonne
		// fautive → diagnostic direct. Volume borné (la plupart des rendus sont ISR).
		console.error("[db-universe] requête wiki échouée:", e);
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
		])
	);
}

// ORDER BY pertinence : égalité exacte > préfixe > meilleure proximité
// trigramme (toutes colonnes confondues).
function fuzzyOrder(term: string, cols: PgColumn[]) {
	const primary = cols[0];
	const sim = sql`greatest(${sql.join(
		cols.map((c) => sql`similarity(unaccent(lower(${c})), unaccent(lower(${term})))`),
		sql`, `
	)})`;
	return [
		sql`(lower(${primary}) = lower(${term})) desc`,
		sql`(unaccent(lower(${primary})) like unaccent(lower(${term})) || '%') desc`,
		sql`${sim} desc nulls last`,
	];
}

export const dbUniverse = {
	/**
	 * Compte réel de chaque table wiki (Neon `bot.*`), source unique pour les
	 * libellés « N personnages / N films … » — fini les nombres codés en dur qui
	 * se désynchronisent dès que la DB grossit. Un seul round-trip groupé.
	 */
	/**
	 * Mémoïsé par `cache()` (portée : un rendu). `counts()` déclenche 16 requêtes
	 * de comptage ; `/wiki/arcs` et `/wiki/transformations` l'appellent une fois
	 * pour la page ET une fois via `WikiCategoryNav`, soit 32 requêtes pour un
	 * seul rendu. Aucun autre helper de ce module n'est mémoïsé — celui-ci le
	 * mérite parce qu'il est à la fois le plus coûteux et le plus rappelé.
	 */
	counts: cache(() =>
		safe(async () => {
			const tables = {
				characters: botCharacters,
				planets: botPlanets,
				sagas: botSagas,
				arcs: botArcs,
				movies: botMovies,
				episodes: botEpisodes,
				games: botGames,
				races: botRaces,
				techniques: botTechniques,
				transformations: botTransformations,
				mangaVolumes: botMangaVolumes,
				mangaChapters: botMangaChapters,
				databooks: botDatabooks,
				news: botNews,
				tools: botTools,
			} satisfies Record<string, PgTable>;
			// Seules les tables « parcourables » portent la colonne `visible` : on
			// compte alors uniquement les entités visibles (cohérent avec les index
			// publics). `news`/`tools` n'ont pas de visibilité → compte brut.
			const withVisibility = new Set<PgTable>([
				botCharacters,
				botPlanets,
				botSagas,
				botArcs,
				botMovies,
				botEpisodes,
				botGames,
				botRaces,
				botTechniques,
				botTransformations,
				botMangaVolumes,
				botMangaChapters,
				botDatabooks,
			]);
			const entries = await Promise.all(
				(Object.entries(tables) as [keyof typeof tables, PgTable][]).map(async ([key, table]) => {
					const visCol = (table as unknown as { visible?: PgColumn }).visible;
					const base = db.select({ n: sql<number>`count(*)::int` }).from(table);
					const [{ n }] =
						withVisibility.has(table) && visCol ? await base.where(eq(visCol, true)) : await base;
					return [key, Number(n ?? 0)] as const;
				})
			);
			return Object.fromEntries(entries) as Record<keyof typeof tables, number>;
		})
	),

	sagas: () =>
		safe(async () => ({
			sagas: (
				await db
					.select()
					.from(botSagas)
					.where(eq(botSagas.visible, true))
					.orderBy(asc(botSagas.orderIdx))
			).map(toSaga),
		})),

	/** Tous les arcs (toutes sagas) + nom/slug de leur saga, pour l'index /wiki/arcs. */
	arcs: () =>
		safe(async () => {
			const rows = await db
				.select({
					arc: botArcs,
					sagaName: botSagas.name,
					sagaSlug: botSagas.slug,
					sagaSeries: botSagas.series,
				})
				.from(botArcs)
				.leftJoin(botSagas, eq(botArcs.sagaId, botSagas.id))
				.where(and(eq(botArcs.visible, true), eq(botSagas.visible, true)))
				.orderBy(asc(botSagas.orderIdx), asc(botArcs.orderIdx));
			return {
				arcs: rows.map((r) => ({
					...toArc(r.arc),
					saga_name: r.sagaName,
					saga_slug: r.sagaSlug,
					saga_series: r.sagaSeries,
				})),
			};
		}),

	/**
	 * Facettes de filtrage des personnages (page /wiki/personnages) : options
	 * Techniques (uniquement celles liées à ≥1 perso → jamais d'option morte) et
	 * Arcs (tous, comptés), + les mappings perso→techniques / perso→arcs (sparse,
	 * seulement les persos ayant des liens) consommés côté client pour un filtrage
	 * cumulatif instantané. Race n'est pas ici : c'est une colonne du perso, déjà
	 * facettée dans la grille. Dégrade en `null` si la DB est indisponible.
	 */
	characterFacets: () =>
		safe(async () => {
			const cnt = sql<number>`count(*)::int`;
			const [techRows, arcRows, ctRows, caRows] = await Promise.all([
				db
					.select({ id: botTechniques.id, name: botTechniques.name, count: cnt })
					.from(botTechniques)
					.innerJoin(
						botCharacterTechniques,
						eq(botCharacterTechniques.techniqueId, botTechniques.id)
					)
					.where(eq(botTechniques.visible, true))
					.groupBy(botTechniques.id, botTechniques.name)
					.orderBy(desc(cnt), asc(botTechniques.name)),
				db
					.select({ id: botArcs.id, name: botArcs.name, count: cnt })
					.from(botArcs)
					.leftJoin(botCharacterArcs, eq(botCharacterArcs.arcId, botArcs.id))
					.where(eq(botArcs.visible, true))
					.groupBy(botArcs.id, botArcs.name, botArcs.orderIdx)
					.orderBy(asc(botArcs.orderIdx)),
				db
					.select({
						characterId: botCharacterTechniques.characterId,
						techniqueId: botCharacterTechniques.techniqueId,
					})
					.from(botCharacterTechniques),
				db
					.select({ characterId: botCharacterArcs.characterId, arcId: botCharacterArcs.arcId })
					.from(botCharacterArcs),
			]);

			const group = <T>(rows: T[], self: (r: T) => number, val: (r: T) => number) => {
				const m: Record<string, string[]> = {};
				for (const r of rows) {
					const k = String(self(r));
					(m[k] ??= []).push(String(val(r)));
				}
				return m;
			};

			return {
				techniqueOptions: techRows.map((t) => ({
					value: String(t.id),
					label: t.name,
					count: Number(t.count),
				})),
				arcOptions: arcRows.map((a) => ({
					value: String(a.id),
					label: a.name,
					count: Number(a.count),
				})),
				charTechniques: group(
					ctRows,
					(r) => r.characterId,
					(r) => r.techniqueId
				),
				charArcs: group(
					caRows,
					(r) => r.characterId,
					(r) => r.arcId
				),
			};
		}),

	saga: (slug: string) =>
		safe(async () => {
			const [s] = await db
				.select()
				.from(botSagas)
				.where(and(eq(botSagas.slug, slug), eq(botSagas.visible, true)))
				.limit(1);
			if (!s) return null;
			const arcs = (
				await db
					.select()
					.from(botArcs)
					.where(and(eq(botArcs.sagaId, s.id), eq(botArcs.visible, true)))
					.orderBy(asc(botArcs.orderIdx))
			).map(toArc);
			return { ...toSaga(s), arcs };
		}),

	arc: (slug: string) =>
		safe(async () => {
			const [a] = await db
				.select()
				.from(botArcs)
				.where(and(eq(botArcs.slug, slug), eq(botArcs.visible, true)))
				.limit(1);
			if (!a) return null;
			const episodes = (
				await db
					.select()
					.from(botEpisodes)
					.where(and(eq(botEpisodes.arcId, a.id), eq(botEpisodes.visible, true)))
					.orderBy(asc(botEpisodes.numberInSeries))
			).map(toEpisode);
			return { arc: toArc(a), episodes };
		}),

	episode: (id: number) =>
		safe(async () => {
			const [e] = await db
				.select()
				.from(botEpisodes)
				.where(and(eq(botEpisodes.id, id), eq(botEpisodes.visible, true)))
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
						.where(and(eq(botEpisodes.series, series), eq(botEpisodes.visible, true)))
						.orderBy(asc(botEpisodes.numberInSeries))
						.limit(limit)
						.offset(offset)
				: await db
						.select()
						.from(botEpisodes)
						.where(eq(botEpisodes.visible, true))
						.orderBy(asc(botEpisodes.series), asc(botEpisodes.numberInSeries))
						.limit(limit)
						.offset(offset);
			const [{ n }] = await db
				.select({ n: sql<number>`count(*)::int` })
				.from(botEpisodes)
				.where(
					series
						? and(eq(botEpisodes.series, series), eq(botEpisodes.visible, true))
						: eq(botEpisodes.visible, true)
				);
			return { episodes: rows.map(toEpisode), total: Number(n ?? 0) };
		}),

	/**
	 * Séries d'épisodes RÉELLEMENT présentes (avec compte), pour ne proposer
	 * que des onglets accessibles (sinon une série à 0 épisode → 404).
	 */
	episodeSeries: () =>
		safe(async () => {
			const rows = await db
				.select({ series: botEpisodes.series, n: sql<number>`count(*)::int` })
				.from(botEpisodes)
				.where(eq(botEpisodes.visible, true))
				.groupBy(botEpisodes.series);
			return rows.map((r) => ({ series: r.series, count: Number(r.n) })).filter((r) => r.count > 0);
		}),

	/**
	 * Épisode précédent / suivant + un échantillon d'épisodes voisins de la même
	 * série, pour la navigation cinématique de la page épisode.
	 */
	episodeNav: (series: string, number: number) =>
		safe(async () => {
			const lite = {
				id: botEpisodes.id,
				number_in_series: botEpisodes.numberInSeries,
				title: botEpisodes.title,
				image: botEpisodes.image,
			};
			const [prev] = await db
				.select(lite)
				.from(botEpisodes)
				.where(
					and(
						eq(botEpisodes.series, series),
						lt(botEpisodes.numberInSeries, number),
						eq(botEpisodes.visible, true)
					)
				)
				.orderBy(desc(botEpisodes.numberInSeries))
				.limit(1);
			const [next] = await db
				.select(lite)
				.from(botEpisodes)
				.where(
					and(
						eq(botEpisodes.series, series),
						gt(botEpisodes.numberInSeries, number),
						eq(botEpisodes.visible, true)
					)
				)
				.orderBy(asc(botEpisodes.numberInSeries))
				.limit(1);
			// Fenêtre de 12 épisodes voisins (centrée approximativement) pour le strip.
			const around = await db
				.select(lite)
				.from(botEpisodes)
				.where(
					and(
						eq(botEpisodes.series, series),
						gt(botEpisodes.numberInSeries, number - 7),
						lt(botEpisodes.numberInSeries, number + 7),
						eq(botEpisodes.visible, true)
					)
				)
				.orderBy(asc(botEpisodes.numberInSeries));
			const lift = (e: typeof prev | undefined): EpisodeNavItem | null =>
				e
					? {
							id: e.id,
							number_in_series: e.number_in_series ?? 0,
							title: e.title ?? "",
							image: e.image,
						}
					: null;
			return {
				prev: lift(prev),
				next: lift(next),
				around: around.map((e) => lift(e)!).filter(Boolean),
			};
		}),

	movies: () =>
		safe(async () => ({
			movies: (await db.select().from(botMovies).where(eq(botMovies.visible, true))).map(toMovie),
		})),

	movie: (slug: string) =>
		safe(async () => {
			const [m] = await db
				.select()
				.from(botMovies)
				.where(
					and(
						/^\d+$/.test(slug) ? eq(botMovies.id, Number(slug)) : eq(botMovies.slug, slug),
						eq(botMovies.visible, true)
					)
				)
				.limit(1);
			return m ? toMovie(m) : null;
		}),

	/**
	 * Film précédent / suivant + la liste complète des films de la même série,
	 * ordonnés par date de sortie (tie-break id) — cohérent avec l'ordre de
	 * l'index /wiki/films. Les films n'ont PAS de numéro (contrairement aux
	 * épisodes) → l'adjacence se fait sur `release_date` (null → fin de liste).
	 */
	movieNav: (series: string, id: number) =>
		safe(async () => {
			const rows = await db
				.select({
					id: botMovies.id,
					slug: botMovies.slug,
					title: botMovies.title,
					poster: botMovies.poster,
					release_date: botMovies.releaseDate,
				})
				.from(botMovies)
				.where(and(eq(botMovies.series, series), eq(botMovies.visible, true)));
			const sorted: MovieNavItem[] = rows
				.map((r) => ({
					id: r.id,
					slug: r.slug ?? String(r.id),
					title: r.title ?? "",
					poster: r.poster,
					release_date: r.release_date ?? null,
				}))
				.sort(
					(a, b) =>
						(a.release_date ?? Number.POSITIVE_INFINITY) -
							(b.release_date ?? Number.POSITIVE_INFINITY) || a.id - b.id
				);
			const idx = sorted.findIndex((m) => m.id === id);
			return {
				prev: idx > 0 ? sorted[idx - 1]! : null,
				next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1]! : null,
				around: sorted,
			};
		}),

	/**
	 * Dataset EXHAUSTIF de la chronologie universelle : TOUS les épisodes, TOUS
	 * les films, et les tomes canoniques du manga (DB « Dragon Ball Vol. N » + DBS
	 * « Dragon Ball Super Vol. N »), toutes séries confondues, normalisés sous des
	 * « ères » communes (cf. `@/lib/chronology`). Les tomes sont rangés dans l'ère
	 * `Manga` (leur code série `DB`/`DBS` désigne aussi des épisodes → l'ère est
	 * forcée ici, pas dérivée de `eraOf`). Aucun tri imposé (le client/l'admin
	 * trie/filtre) : on renvoie la matière première (ère, date, numéro, langues).
	 * ~750 items → un seul round-trip par table.
	 */
	timeline: () =>
		safe(async (): Promise<TimelineItem[]> => {
			const [eps, movs, vols] = await Promise.all([
				db
					.select({
						id: botEpisodes.id,
						series: botEpisodes.series,
						number: botEpisodes.numberInSeries,
						title: botEpisodes.title,
						titleJa: botEpisodes.titleJa,
						date: botEpisodes.airDate,
						image: botEpisodes.image,
						players: botEpisodes.players,
					})
					.from(botEpisodes)
					.where(eq(botEpisodes.visible, true)),
				db
					.select({
						id: botMovies.id,
						slug: botMovies.slug,
						series: botMovies.series,
						title: botMovies.title,
						titleJa: botMovies.titleJa,
						date: botMovies.releaseDate,
						poster: botMovies.poster,
						players: botMovies.players,
					})
					.from(botMovies)
					.where(eq(botMovies.visible, true)),
				// Tomes canoniques uniquement (mêmes filtres que /wiki/manga) : on
				// écarte les spin-offs (SD, Yamcha, Episode of Bardock…) rangés dans
				// la même table. Ordre par numéro de tome, série DB avant DBS.
				db
					.select({
						id: botMangaVolumes.id,
						series: botMangaVolumes.series,
						number: botMangaVolumes.volumeNumber,
						title: botMangaVolumes.title,
						titleJa: botMangaVolumes.titleJa,
						date: botMangaVolumes.publishedAt,
						cover: botMangaVolumes.cover,
					})
					.from(botMangaVolumes)
					.where(
						and(
							eq(botMangaVolumes.visible, true),
							or(
								and(
									eq(botMangaVolumes.series, "DB"),
									ilike(botMangaVolumes.title, "Dragon Ball Vol. %")
								),
								and(
									eq(botMangaVolumes.series, "DBS"),
									ilike(botMangaVolumes.title, "Dragon Ball Super Vol. %")
								)
							)
						)
					),
			]);
			// Garde `Array.isArray` : `players` jsonb peut être un scalaire corrompu
			// (piège documenté) → un `.some` non gardé planterait tout le dataset.
			const langs = (
				players: { lang?: "vf" | "vostfr" }[] | null
			): { hasVf: boolean; hasVostfr: boolean } => {
				const arr = Array.isArray(players) ? players : [];
				return {
					hasVf: arr.some((p) => p.lang === "vf"),
					hasVostfr: arr.some((p) => p.lang === "vostfr"),
				};
			};
			const items: TimelineItem[] = [
				...eps.map((e) => {
					const l = langs(e.players);
					return {
						kind: "episode" as const,
						id: e.id,
						href: `/wiki/episodes/${e.id}`,
						title: e.title ?? "",
						titleJa: e.titleJa,
						series: e.series,
						era: eraOf(e.series),
						number: e.number ?? null,
						date: e.date ?? null,
						image: e.image,
						hasVf: l.hasVf,
						hasVostfr: l.hasVostfr,
					};
				}),
				...movs.map((m) => {
					const l = langs(m.players);
					return {
						kind: "movie" as const,
						id: m.id,
						href: `/wiki/films/${m.slug ?? m.id}`,
						title: m.title ?? "",
						titleJa: m.titleJa,
						series: m.series ?? "",
						era: eraOf(m.series),
						number: null,
						date: m.date ?? null,
						image: m.poster,
						hasVf: l.hasVf,
						hasVostfr: l.hasVostfr,
					};
				}),
				...vols.map((v) => ({
					kind: "manga" as const,
					id: v.id,
					href: `/wiki/manga/volume/${v.id}`,
					title: v.title ?? `Tome ${v.number ?? "?"}`,
					titleJa: v.titleJa,
					series: v.series,
					era: "Manga" as const,
					number: v.number ?? null,
					date: v.date ?? null,
					image: v.cover,
					hasVf: false,
					hasVostfr: false,
				})),
			];
			return items;
		}),

	games: () =>
		safe(async () => ({
			games: (await db.select().from(botGames).where(eq(botGames.visible, true))).map(toGame),
		})),

	game: (slug: string) =>
		safe(async () => {
			const [g] = await db
				.select()
				.from(botGames)
				.where(and(eq(botGames.slug, slug), eq(botGames.visible, true)))
				.limit(1);
			if (!g) return null;
			const characters = await db
				.select({
					id: botCharacters.id,
					name: botCharacters.name,
					name_ja: botCharacters.nameJa,
					image: botCharacters.image,
				})
				.from(botGameCharacters)
				.innerJoin(botCharacters, eq(botCharacters.id, botGameCharacters.characterId))
				.where(and(eq(botGameCharacters.gameId, g.id), eq(botCharacters.visible, true)))
				.orderBy(asc(botCharacters.name));
			return { ...toGame(g), characters };
		}),

	tools: () =>
		safe(async () => ({
			tools: (await db.select().from(botTools).orderBy(desc(botTools.stars))).map(toTool),
		})),

	tool: (slug: string) =>
		safe(async () => {
			const [t] = await db.select().from(botTools).where(eq(botTools.slug, slug)).limit(1);
			return t ? toTool(t) : null;
		}),

	races: () =>
		safe(async () => ({
			races: (await db.select().from(botRaces).where(eq(botRaces.visible, true))).map(toRace),
		})),

	race: (slug: string) =>
		safe(async () => {
			const [r] = await db
				.select()
				.from(botRaces)
				.where(and(eq(botRaces.slug, slug), eq(botRaces.visible, true)))
				.limit(1);
			return r ? toRace(r) : null;
		}),

	transformations: () =>
		safe(async () => ({
			transformations: (
				await db.select().from(botTransformations).where(eq(botTransformations.visible, true))
			).map(toTransformation),
		})),

	mangaVolumes: (series = "DB") =>
		safe(async () => ({
			volumes: (
				await db
					.select()
					.from(botMangaVolumes)
					.where(and(eq(botMangaVolumes.series, series), eq(botMangaVolumes.visible, true)))
					.orderBy(asc(botMangaVolumes.volumeNumber))
			).map(toMangaVolume),
		})),

	/** Databooks & interviews visibles, triés par date (défaut : plus récent). */
	databooks: (opts: { kind?: string; order?: "asc" | "desc" } = {}) =>
		safe(async () => {
			const conds = [eq(botDatabooks.visible, true)];
			if (opts.kind) conds.push(eq(botDatabooks.kind, opts.kind));
			const rows = await db
				.select()
				.from(botDatabooks)
				.where(and(...conds))
				.orderBy(
					opts.order === "asc" ? asc(botDatabooks.publishedAt) : desc(botDatabooks.publishedAt)
				);
			return { items: rows.map(toDatabook) };
		}),

	/** Fiche databook / interview + pages lecteur. */
	databook: (id: number) =>
		safe(async () => {
			const [row] = await db
				.select()
				.from(botDatabooks)
				.where(and(eq(botDatabooks.id, id), eq(botDatabooks.visible, true)))
				.limit(1);
			return row ? toDatabook(row) : null;
		}),

	mangaVolume: (id: number) =>
		safe(async () => {
			const [v] = await db
				.select()
				.from(botMangaVolumes)
				.where(and(eq(botMangaVolumes.id, id), eq(botMangaVolumes.visible, true)))
				.limit(1);
			if (!v) return null;
			const chapters = (
				await db
					.select()
					.from(botMangaChapters)
					.where(and(eq(botMangaChapters.volumeId, id), eq(botMangaChapters.visible, true)))
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
									eq(botMangaChapters.visible, true)
								)
							: and(isNotNull(botMangaChapters.pages), eq(botMangaChapters.visible, true))
					)
					.orderBy(asc(botMangaChapters.series), asc(botMangaChapters.chapterNumber))
			).map(toMangaChapter),
		})),

	// Un chapitre + ses pages + chapitres adjacents (nav lecteur).
	mangaChapter: (id: number) =>
		safe<MangaChapterRead | null>(async () => {
			const [c] = await db
				.select()
				.from(botMangaChapters)
				.where(and(eq(botMangaChapters.id, id), eq(botMangaChapters.visible, true)))
				.limit(1);
			if (!c) return null;
			const [prev] = await db
				.select({ id: botMangaChapters.id, pages: botMangaChapters.pages })
				.from(botMangaChapters)
				.where(
					and(
						eq(botMangaChapters.series, c.series),
						isNotNull(botMangaChapters.pages),
						lt(botMangaChapters.chapterNumber, c.chapterNumber ?? 0),
						eq(botMangaChapters.visible, true)
					)
				)
				.orderBy(desc(botMangaChapters.chapterNumber))
				.limit(1);
			const [next] = await db
				.select({ id: botMangaChapters.id, pages: botMangaChapters.pages })
				.from(botMangaChapters)
				.where(
					and(
						eq(botMangaChapters.series, c.series),
						isNotNull(botMangaChapters.pages),
						gt(botMangaChapters.chapterNumber, c.chapterNumber ?? 0),
						eq(botMangaChapters.visible, true)
					)
				)
				.orderBy(asc(botMangaChapters.chapterNumber))
				.limit(1);
			return {
				...toMangaChapter(c),
				pages: Array.isArray(c.pages) ? c.pages : [],
				prev: prev?.id ?? null,
				next: next?.id ?? null,
				prevPages: Array.isArray(prev?.pages) ? prev?.pages : [],
				nextPages: Array.isArray(next?.pages) ? next?.pages : [],
			};
		}),

	news: (limit = 10) =>
		safe(async () => ({
			news: (await db.select().from(botNews).orderBy(desc(botNews.publishedAt)).limit(limit)).map(
				toNews
			),
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
					races: [],
					transformations: [],
					arcs: [],
					mangaVolumes: [],
					mangaChapters: [],
				};
			}
			const charCols = [botCharacters.name, botCharacters.nameJa, botCharacters.nameRomaji];
			const planetCols = [botPlanets.name, botPlanets.nameJa];
			const sagaCols = [botSagas.name, botSagas.nameJa];
			const movieCols = [botMovies.title, botMovies.titleJa];
			const gameCols = [botGames.title, botGames.titleJa];
			const episodeCols = [botEpisodes.title, botEpisodes.titleJa, botEpisodes.titleRomaji];
			const techniqueCols = [botTechniques.name, botTechniques.nameJa, botTechniques.nameRomaji];
			const raceCols = [botRaces.name, botRaces.nameJa];
			const arcCols = [botArcs.name, botArcs.nameJa];
			const transfoCols = [botTransformations.name];
			const volCols = [botMangaVolumes.title, botMangaVolumes.titleJa];
			const chapCols = [botMangaChapters.title, botMangaChapters.titleJa];
			// Manga : un terme purement numérique matche aussi le n° de tome/chapitre.
			const num = /^\d{1,4}$/.test(term) ? Number(term) : null;
			// Garde-fous anti-fantômes : ne remonter dans la recherche que les tomes
			// CANONIQUES (mêmes préfixes que timeline()/la grille — exclut spin-offs et
			// doublons « Volume N ») et les chapitres LISIBLES (pages renseignées).
			// Sinon /wiki/search surfaçait des entrées menant à des pages vides.
			const canonicalVolTitle = or(
				ilike(botMangaVolumes.title, "Dragon Ball Vol. %"),
				ilike(botMangaVolumes.title, "Dragon Ball Super Vol. %")
			);
			const volWhere = and(
				num != null
					? or(fuzzyWhere(term, volCols), eq(botMangaVolumes.volumeNumber, num))
					: fuzzyWhere(term, volCols),
				canonicalVolTitle
			);
			const chapWhere = and(
				num != null
					? or(fuzzyWhere(term, chapCols), eq(botMangaChapters.chapterNumber, num))
					: fuzzyWhere(term, chapCols),
				isNotNull(botMangaChapters.pages)
			);
			const [
				characters,
				planets,
				sagas,
				movies,
				games,
				episodes,
				techniques,
				races,
				transformations,
				arcs,
				mangaVolumes,
				mangaChapters,
			] = await Promise.all([
				db
					.select({
						id: botCharacters.id,
						name: botCharacters.name,
						name_ja: botCharacters.nameJa,
						image: botCharacters.image,
						race: botCharacters.race,
					})
					.from(botCharacters)
					.where(and(fuzzyWhere(term, charCols), eq(botCharacters.visible, true)))
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
					.where(and(fuzzyWhere(term, planetCols), eq(botPlanets.visible, true)))
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
					.where(and(fuzzyWhere(term, sagaCols), eq(botSagas.visible, true)))
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
					.where(and(fuzzyWhere(term, movieCols), eq(botMovies.visible, true)))
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
					.where(and(fuzzyWhere(term, gameCols), eq(botGames.visible, true)))
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
					.where(and(fuzzyWhere(term, episodeCols), eq(botEpisodes.visible, true)))
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
					.where(and(fuzzyWhere(term, techniqueCols), eq(botTechniques.visible, true)))
					.orderBy(...fuzzyOrder(term, techniqueCols))
					.limit(10),
				db
					.select({
						id: botRaces.id,
						slug: botRaces.slug,
						name: botRaces.name,
						name_ja: botRaces.nameJa,
					})
					.from(botRaces)
					.where(and(fuzzyWhere(term, raceCols), eq(botRaces.visible, true)))
					.orderBy(...fuzzyOrder(term, raceCols))
					.limit(8),
				db
					.select({
						id: botTransformations.id,
						name: botTransformations.name,
						image: botTransformations.image,
						character_id: botTransformations.characterId,
					})
					.from(botTransformations)
					.where(and(fuzzyWhere(term, transfoCols), eq(botTransformations.visible, true)))
					.orderBy(...fuzzyOrder(term, transfoCols))
					.limit(24),
				db
					.select({
						id: botArcs.id,
						slug: botArcs.slug,
						name: botArcs.name,
						name_ja: botArcs.nameJa,
						saga_slug: botSagas.slug,
					})
					.from(botArcs)
					.leftJoin(botSagas, eq(botArcs.sagaId, botSagas.id))
					.where(and(fuzzyWhere(term, arcCols), eq(botArcs.visible, true)))
					.orderBy(...fuzzyOrder(term, arcCols))
					.limit(10),
				db
					.select({
						id: botMangaVolumes.id,
						series: botMangaVolumes.series,
						volume_number: botMangaVolumes.volumeNumber,
						title: botMangaVolumes.title,
						cover: botMangaVolumes.cover,
					})
					.from(botMangaVolumes)
					.where(and(volWhere, eq(botMangaVolumes.visible, true)))
					.orderBy(...fuzzyOrder(term, volCols), asc(botMangaVolumes.volumeNumber))
					.limit(10),
				db
					.select({
						id: botMangaChapters.id,
						series: botMangaChapters.series,
						chapter_number: botMangaChapters.chapterNumber,
						title: botMangaChapters.title,
					})
					.from(botMangaChapters)
					.where(and(chapWhere, eq(botMangaChapters.visible, true)))
					.orderBy(...fuzzyOrder(term, chapCols), asc(botMangaChapters.chapterNumber))
					.limit(12),
			]);
			// Dédup des transformations par nom (Super Saiyan partagé par N persos) et
			// exclusion de celles sans personnage rattaché (lien impossible).
			const transfoSeen = new Set<string>();
			const transfoDedup = transformations
				.filter(
					(t): t is { id: number; name: string; image: string | null; character_id: number } => {
						if (t.character_id == null) return false;
						const k = t.name
							.normalize("NFD")
							.replace(/[̀-ͯ]/g, "")
							.toLowerCase()
							.trim();
						if (transfoSeen.has(k)) return false;
						transfoSeen.add(k);
						return true;
					}
				)
				.slice(0, 8);
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
				races,
				transformations: transfoDedup,
				arcs,
				mangaVolumes,
				mangaChapters,
			};
		}),

	rag: async (
		q: string,
		limit = 8,
		options?: { lang?: string; entity?: string; sourceId?: string }
	) => {
		try {
			let url = `${apiBase()}/api/public/rag/search?q=${encodeURIComponent(q)}&limit=${limit}`;
			if (options?.lang) url += `&lang=${encodeURIComponent(options.lang)}`;
			if (options?.entity) url += `&entity=${encodeURIComponent(options.entity)}`;
			if (options?.sourceId) url += `&sourceId=${encodeURIComponent(options.sourceId)}`;
			const r = await fetch(url, { next: { revalidate: 300 } });
			if (!r.ok) return null;
			return (await r.json()) as {
				q: string;
				mode?: string;
				results: {
					rowid?: number;
					kind: string;
					title: string;
					url: string;
					snippet: string;
					score?: number;
				}[];
			};
		} catch {
			return null;
		}
	},

	ragChat: async (q: string, persona = "whis") => {
		try {
			const url = `${apiBase()}/api/public/rag/chat?q=${encodeURIComponent(q)}&persona=${encodeURIComponent(persona)}`;
			const r = await fetch(url, { cache: "no-store" });
			if (!r.ok) return null;
			return (await r.json()) as {
				answer: string;
				hits: {
					rowid?: number;
					kind: string;
					title: string;
					url: string;
					snippet: string;
					score?: number;
				}[];
				mode: string;
			};
		} catch {
			return null;
		}
	},
};
