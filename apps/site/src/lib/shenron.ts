import "server-only";
import { and, asc, eq, like, ne, sql, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	botCharacters,
	botCharacterTechniques,
	botGames,
	botMangaVolumes,
	botMovies,
	botPlanets,
	botRaces,
	botTechniques,
	botTransformations,
	botWikiSections,
	type WikiSectionLink,
	type WikiSource,
} from "@/db/bot-schema";
import {
	normalizeSectionAccent,
	SECTION_ACCENT_SET,
	type SectionAccent,
} from "@/lib/wiki-section-accents";

export type { WikiSource };

/** Champs article communs (long-format Fandom + citations). */
export interface WithArticle {
	/** Corps markdown long-format (Fandom-like), ou null si pas encore rédigé. */
	article: string | null;
	/** Sources citées dans l'article (`[{ n, label, url, kind }]`). */
	articleSources: WikiSource[] | null;
}

// Base de l'API bot résolue par `@/lib/config` (source unique des URL). PAS
// dragonballfr.com (le site lui-même) → sinon les appels runtime boucleraient.
import { API_URL as SHENRON_API_URL } from "@/lib/config";

export interface ShenronUser {
	discordId: string;
	username: string | null;
	avatar: string | null;
	avatarUrl: string | null;
	level: number;
	xp: number;
	zeni: number;
	xpProgress: {
		current: number;
		nextLevel: number;
		nextLevelXp: number;
		needed: number;
	} | null;
	banner: string | null;
	equipped: {
		card: string | null;
		badge: string | null;
		color: string | null;
		title: string | null;
		banner?: string | null;
	};
	achievements: Array<{ code: string; unlockedAt: string | number }>;
	inventory: Array<{ type: string; key: string }>;
	fusion: {
		partnerId: string;
		partnerName: string;
		createdAt: string | number;
	} | null;
}

export interface ShenronShopItem {
	key: string;
	type: "card" | "badge" | "color" | "title" | "banner";
	name: string;
	description: string | null;
	price: number;
	roleId: string | null;
	/** Couleur hex du rôle cosmétique (items color/title/badge) — aperçu swatch. */
	roleColor?: string;
	preview?: string; // URL relative CDN site (ex: /banners/banner-01.jpg)
}

export interface LeaderboardEntry {
	rank: number;
	discordId: string;
	username: string | null;
	avatarUrl: string | null;
	xp: number;
	zeni: number;
	level: number;
}

export interface PresenceMember {
	id: string;
	username: string;
	avatarUrl: string;
	status: string;
}
export interface ShenronPresence {
	total: number;
	online: number;
	members: PresenceMember[];
}

export interface CharacterStat {
	label: string;
	value: string;
	accent?: string;
}

export interface DBCharacter extends WithArticle {
	id: number;
	name: string;
	/** Nom japonais natif (孫悟空, ベジータ) — enrichi via AniList */
	nameJa: string | null;
	/** Translittération canon (Son Gokuu, Kuririn) — enrichi via AniList */
	nameRomaji: string | null;
	image: string;
	/** Portrait HQ Xenoverse 2 (fallback d'image quand `image` est cassée/404). */
	portraitXv2: string | null;
	ki: string | null;
	maxKi: string | null;
	race: string | null;
	gender: string | null;
	affiliation: string | null;
	description: string | null;
	originPlanetId: number | null;
	/** Stats scouter custom (CharacterStatsPanel). */
	stats: CharacterStat[] | null;
	debutEpisodeId: number | null;
	debutChapterId: number | null;
	debutSagaId: number | null;
}

export interface DBPlanet extends WithArticle {
	id: number;
	name: string;
	nameJa: string | null;
	nameRomaji: string | null;
	image: string;
	isDestroyed: boolean;
	description: string | null;
}

export interface DBMovie {
	id: number;
	slug: string;
	title: string;
	titleJa: string | null;
	titleRomaji: string | null;
	series: string;
	releaseDate: string | number | null;
	durationMin: number | null;
	synopsis: string | null;
	poster: string | null;
	trailerUrl: string | null;
	malId: number | null;
}

export interface DBTransformation {
	id: number;
	name: string;
	image: string;
	ki: string | null;
	characterId: number;
}

export interface DBTechnique extends WithArticle {
	id: number;
	slug: string;
	name: string;
	description: string | null;
	type: string | null;
	creatorId: number | null;
	creatorName: string | null;
	creatorImage: string | null;
}

export interface DBGame {
	id: number;
	slug: string;
	title: string;
	titleJa: string | null;
	platforms: string | null;
	releaseDate: string | number | null;
	publisher: string | null;
	developer: string | null;
	description: string | null;
	cover: string | null;
	officialUrl: string | null;
}

export interface DBMangaVolume {
	id: number;
	series: string;
	volumeNumber: number;
	title: string | null;
	cover: string | null;
}

export interface DBRace extends WithArticle {
	id: number;
	slug: string;
	name: string;
	nameJa: string | null;
	description: string | null;
}

/** Personnage lié (version alternative ou allié) — carte minimale cliquable. */
export interface RelatedCharacter {
	id: number;
	name: string;
	image: string | null;
	race: string | null;
}

export interface CharacterWithRelations extends DBCharacter {
	transformations: DBTransformation[];
	originPlanet: DBPlanet | null;
	techniques: Array<{ technique: DBTechnique }>;
	/** Versions alternatives (même nom racine : `X`, `X (futur)`, `X (Xeno)`…). */
	versions: RelatedCharacter[];
	/** Personnages partageant la même affiliation (alliés / faction). */
	affiliates: RelatedCharacter[];
}

/** Retire les parenthèses de version en fin de nom : « Son Goku (GT) (Xeno) » → « Son Goku ». */
function stripVersionSuffix(name: string): string {
	return name.replace(/(?:\s*\([^)]*\))+\s*$/, "").trim();
}

/** Normalise (accents retirés, casse/espaces) pour comparer des noms racine. */
function foldName(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Affiliations « poubelle » (statut / fourre-tout) à ne jamais présenter comme
 * « personnages affiliés » : elles regrouperaient des persos sans lien réel.
 * Comparaison sur la forme normalisée (`foldName`).
 */
const AFFILIATION_BLOCKLIST = new Set([
	"decede",
	"decedee",
	"decedes",
	"decedees",
	"other",
	"others",
	"autre",
	"autres",
	"villain",
	"villains",
	"mechant",
	"mechants",
	"inconnu",
	"inconnue",
	"unknown",
	"n/a",
	"na",
	"aucun",
	"aucune",
	"none",
]);

/** Section de contenu éditorial d'une entité wiki (bloc markdown nommé). */
export interface WikiSectionData {
	id: number;
	key: string;
	label: string;
	accent: SectionAccent | null;
	body: string;
	/** Sous-catégorie parente (regroupement), ou null. */
	groupLabel: string | null;
	/** Pages wiki affiliées (cartes photo, liens internes). */
	links: WikiSectionLink[];
}

/**
 * Sections de contenu **visibles** d'une entité (personnage, planète, saga…),
 * triées par `sort_order`. Rendu en sélecteur de catégories sur la page détail.
 * Vides (body blanc) ignorées. Lecture seule, tolérante (jamais throw).
 */
export async function getWikiSections(
	entityType: string,
	entityId: number
): Promise<WikiSectionData[]> {
	try {
		const rows = await db
			.select()
			.from(botWikiSections)
			.where(
				and(
					eq(botWikiSections.entityType, entityType),
					eq(botWikiSections.entityId, entityId),
					eq(botWikiSections.visible, true)
				)
			)
			.orderBy(asc(botWikiSections.sortOrder), asc(botWikiSections.id));
		return rows
			// On garde une section qui a du corps OU des pages affiliées (une section
			// purement « liens » — ex. une catégorie de renvois — reste valide).
			.filter((r) => (r.body ?? "").trim().length > 0 || (r.links?.length ?? 0) > 0)
			.map((r) => ({
				id: r.id,
				key: r.key,
				label: r.label,
				accent: (r.accent && SECTION_ACCENT_SET.has(r.accent)
					? normalizeSectionAccent(r.accent)
					: null) as WikiSectionData["accent"],
				body: r.body ?? "",
				groupLabel: r.groupLabel?.trim() ? r.groupLabel.trim() : null,
				links: Array.isArray(r.links) ? r.links.filter((l) => l && l.href && l.label) : [],
			}));
	} catch (e) {
		console.error("[shenron] getWikiSections a échoué:", e);
		return [];
	}
}

// ─────────────────────────────────────────────────────────────────────────
// Wiki Dragon Ball — lu DIRECTEMENT depuis Neon (schéma `bot`, miroir du
// SQLite du bot). Découplé de l'API REST du bot : les pages /wiki ne dépendent
// plus de la dispo du process bot. Lecture seule, ISR Vercel côté pages.
// Les mappers ci-dessous reproduisent à l'identique les shapes que servait
// l'API du bot (WikiService) pour ne rien casser côté pages.
// ─────────────────────────────────────────────────────────────────────────

type CharacterRow = typeof botCharacters.$inferSelect;
type PlanetRow = typeof botPlanets.$inferSelect;
type TransfoRow = typeof botTransformations.$inferSelect;

function mapCharacterStats(raw: unknown): CharacterStat[] | null {
	if (!Array.isArray(raw) || raw.length === 0) return null;
	const out: CharacterStat[] = [];
	for (const s of raw) {
		if (!s || typeof s !== "object") continue;
		const o = s as Record<string, unknown>;
		const label = typeof o.label === "string" ? o.label.trim() : "";
		const value = typeof o.value === "string" ? o.value.trim() : "";
		if (!label && !value) continue;
		out.push({
			label,
			value,
			accent: typeof o.accent === "string" && o.accent ? o.accent : undefined,
		});
	}
	return out.length ? out : null;
}

function mapCharacter(r: CharacterRow): DBCharacter {
	return {
		id: r.id,
		name: r.name,
		nameJa: r.nameJa,
		nameRomaji: r.nameRomaji,
		image: r.image ?? "",
		portraitXv2: r.portraitXv2 ?? null,
		ki: r.ki,
		maxKi: r.maxKi,
		race: r.race,
		gender: r.gender,
		affiliation: r.affiliation,
		description: r.description,
		originPlanetId: r.originPlanetId,
		stats: mapCharacterStats(r.stats),
		debutEpisodeId: r.debutEpisodeId ?? null,
		debutChapterId: r.debutChapterId ?? null,
		debutSagaId: r.debutSagaId ?? null,
		article: r.article ?? null,
		articleSources: r.articleSources ?? null,
	};
}

function mapPlanet(r: PlanetRow): DBPlanet {
	return {
		id: r.id,
		name: r.name,
		nameJa: r.nameJa,
		nameRomaji: r.nameRomaji,
		image: r.image ?? "",
		isDestroyed: !!r.isDestroyed,
		description: r.description,
		article: r.article ?? null,
		articleSources: r.articleSources ?? null,
	};
}

function mapTransfo(r: TransfoRow): DBTransformation {
	return {
		id: r.id,
		name: r.name,
		image: r.image ?? "",
		ki: r.ki,
		characterId: r.characterId ?? 0,
	};
}

export async function getShenronUser(discordId: string): Promise<ShenronUser | null> {
	try {
		const res = await fetch(`${SHENRON_API_URL}/api/public/user/${discordId}`, {
			next: { revalidate: 60 },
		});
		if (!res.ok) return null;
		return res.json();
	} catch (e) {
		// Bot injoignable → null (la page appelante fait notFound), pas une 500.
		console.error("[shenron] getShenronUser a échoué:", e);
		return null;
	}
}

export async function getShenronShop(): Promise<ShenronShopItem[]> {
	try {
		const res = await fetch(`${SHENRON_API_URL}/api/public/shop`, {
			next: { revalidate: 60 },
		});
		if (!res.ok) return [];
		const data = await res.json();
		return data.items || [];
	} catch {
		return [];
	}
}

export async function getShenronLeaderboard(
	limit = 100,
	enrich = true
): Promise<LeaderboardEntry[]> {
	try {
		const res = await fetch(
			`${SHENRON_API_URL}/api/public/leaderboard?limit=${limit}${enrich ? "&enrich=1" : ""}`,
			{
				next: { revalidate: 60 },
			}
		);
		if (!res.ok) return [];
		const data = await res.json();
		return data.leaderboard || [];
	} catch (e) {
		console.error("[shenron] getShenronLeaderboard a échoué:", e);
		return [];
	}
}

/**
 * Présence live du serveur (compteur en ligne + échantillon de membres) pour le
 * widget « connectés » de la home. Dégradation gracieuse en `{0,0,[]}`.
 */
export async function getShenronPresence(): Promise<ShenronPresence> {
	try {
		const res = await fetch(`${SHENRON_API_URL}/api/public/presence`, {
			next: { revalidate: 30 },
		});
		if (!res.ok) return { total: 0, online: 0, members: [] };
		const d = await res.json();
		return {
			total: Number(d.total ?? 0),
			online: Number(d.online ?? 0),
			members: Array.isArray(d.members) ? d.members : [],
		};
	} catch {
		return { total: 0, online: 0, members: [] };
	}
}

export async function getShenronCharacters(query?: string): Promise<DBCharacter[]> {
	try {
		const q = query?.trim();
		const rows = q
			? await db
					.select()
					.from(botCharacters)
					.where(
						and(
							like(sql`lower(${botCharacters.name})`, `%${q.toLowerCase()}%`),
							eq(botCharacters.visible, true)
						)
					)
					.limit(25)
			: await db.select().from(botCharacters).where(eq(botCharacters.visible, true));
		return rows.map(mapCharacter);
	} catch (e) {
		console.error("[shenron] getShenronCharacters a échoué:", e);
		return [];
	}
}

export async function getShenronMovies(): Promise<DBMovie[]> {
	try {
		return (await db
			.select()
			.from(botMovies)
			.where(eq(botMovies.visible, true))) as DBMovie[];
	} catch (e) {
		console.error("[shenron] getShenronMovies a échoué:", e);
		return [];
	}
}

export async function getShenronMovie(id: number): Promise<DBMovie | null> {
	try {
		const [m] = await db.select().from(botMovies).where(and(eq(botMovies.id, id), eq(botMovies.visible, true))).limit(1);
		return (m as DBMovie) ?? null;
	} catch (e) {
		console.error("[shenron] getShenronMovie a échoué:", e);
		return null;
	}
}

export async function getShenronCharacter(id: number): Promise<CharacterWithRelations | null> {
	try {
		const [c] = await db.select().from(botCharacters).where(and(eq(botCharacters.id, id), eq(botCharacters.visible, true))).limit(1);
		if (!c) return null;

		const transformations = (
			await db.select().from(botTransformations).where(and(eq(botTransformations.characterId, id), eq(botTransformations.visible, true)))
		).map(mapTransfo);

		let originPlanet: DBPlanet | null = null;
		if (c.originPlanetId != null) {
			const [p] = await db
				.select()
				.from(botPlanets)
				.where(and(eq(botPlanets.id, c.originPlanetId), eq(botPlanets.visible, true)))
				.limit(1);
			originPlanet = p ? mapPlanet(p) : null;
		}

		const techRows = await db
			.select({ t: botTechniques })
			.from(botCharacterTechniques)
			.innerJoin(botTechniques, eq(botCharacterTechniques.techniqueId, botTechniques.id))
			.where(and(eq(botCharacterTechniques.characterId, id), eq(botTechniques.visible, true)));
		const techniques = techRows.map((r) => ({
			technique: {
				id: r.t.id,
				slug: r.t.slug,
				name: r.t.name,
				description: r.t.description,
				type: r.t.type,
				creatorId: r.t.creatorId,
				creatorName: null,
				creatorImage: null,
				article: r.t.article ?? null,
				articleSources: r.t.articleSources ?? null,
			} satisfies DBTechnique,
		}));

		// ── Versions alternatives : autres persos au même nom racine ────────────
		// « Freezer » ↔ « Freezer (futur) » / « Freezer (Xeno) », etc. On récupère
		// les candidats par préfixe (indexable) puis on filtre sur le nom racine
		// normalisé (accents/casse) côté JS — plus sûr que du regex en SQL.
		const rootRaw = stripVersionSuffix(c.name);
		const selfRoot = foldName(rootRaw);
		let versions: RelatedCharacter[] = [];
		if (selfRoot.length >= 2) {
			// Préfixe insensible casse+accents (unaccent, comme db-universe) : « Végéta
			// (futur) » est bien candidat de « Vegeta ». `%`/`_`/`\` échappés pour LIKE.
			const prefix = `${rootRaw.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
			const cand = await db
				.select({
					id: botCharacters.id,
					name: botCharacters.name,
					image: botCharacters.image,
					race: botCharacters.race,
				})
				.from(botCharacters)
				.where(
					and(
						eq(botCharacters.visible, true),
						ne(botCharacters.id, id),
						sql`unaccent(lower(${botCharacters.name})) like unaccent(lower(${prefix}))`
					)
				)
				.orderBy(asc(botCharacters.name))
				.limit(80);
			versions = cand
				.filter((r) => foldName(stripVersionSuffix(r.name)) === selfRoot)
				.slice(0, 16)
				.map((r) => ({ id: r.id, name: r.name, image: r.image, race: r.race }));
		}

		// ── Personnages affiliés : même affiliation (hors valeurs poubelle) ─────
		const aff = (c.affiliation ?? "").trim();
		let affiliates: RelatedCharacter[] = [];
		if (aff && !AFFILIATION_BLOCKLIST.has(foldName(aff))) {
			const rows = await db
				.select({
					id: botCharacters.id,
					name: botCharacters.name,
					image: botCharacters.image,
					race: botCharacters.race,
				})
				.from(botCharacters)
				.where(
					and(
						eq(botCharacters.visible, true),
						ne(botCharacters.id, id),
						eq(botCharacters.affiliation, aff)
					)
				)
				.orderBy(asc(botCharacters.name))
				.limit(16);
			affiliates = rows.map((r) => ({ id: r.id, name: r.name, image: r.image, race: r.race }));
		}

		return {
			...mapCharacter(c),
			transformations,
			originPlanet,
			techniques,
			versions,
			affiliates,
		};
	} catch (e) {
		console.error("[shenron] getShenronCharacter a échoué:", e);
		return null;
	}
}

export async function getShenronTechniques(): Promise<DBTechnique[]> {
	try {
		const rows = await db
			.select({ t: botTechniques, name: botCharacters.name, image: botCharacters.image })
			.from(botTechniques)
			.leftJoin(botCharacters, eq(botTechniques.creatorId, botCharacters.id))
			.where(eq(botTechniques.visible, true));
		return rows.map((r) => ({
			id: r.t.id,
			slug: r.t.slug,
			name: r.t.name,
			description: r.t.description,
			type: r.t.type,
			creatorId: r.t.creatorId,
			creatorName: r.name ?? null,
			creatorImage: r.image ?? null,
			article: r.t.article ?? null,
			articleSources: r.t.articleSources ?? null,
		}));
	} catch (e) {
		console.error("[shenron] getShenronTechniques a échoué:", e);
		return [];
	}
}

export async function getShenronTechnique(slug: string): Promise<DBTechnique | null> {
	try {
		const [r] = await db
			.select({ t: botTechniques, name: botCharacters.name, image: botCharacters.image })
			.from(botTechniques)
			.leftJoin(botCharacters, eq(botTechniques.creatorId, botCharacters.id))
			.where(and(eq(botTechniques.slug, slug), eq(botTechniques.visible, true)))
			.limit(1);
		if (!r) return null;
		return {
			id: r.t.id,
			slug: r.t.slug,
			name: r.t.name,
			description: r.t.description,
			type: r.t.type,
			creatorId: r.t.creatorId,
			creatorName: r.name ?? null,
			creatorImage: r.image ?? null,
			article: r.t.article ?? null,
			articleSources: r.t.articleSources ?? null,
		};
	} catch (e) {
		console.error("[shenron] getShenronTechnique a échoué:", e);
		return null;
	}
}

export async function getShenronGames(): Promise<DBGame[]> {
	try {
		return (await db
			.select()
			.from(botGames)
			.where(eq(botGames.visible, true))) as DBGame[];
	} catch (e) {
		console.error("[shenron] getShenronGames a échoué:", e);
		return [];
	}
}

export async function getShenronGame(slug: string): Promise<DBGame | null> {
	try {
		const [g] = await db.select().from(botGames).where(eq(botGames.slug, slug)).limit(1);
		return (g as DBGame) ?? null;
	} catch (e) {
		console.error("[shenron] getShenronGame a échoué:", e);
		return null;
	}
}

export async function getShenronManga(): Promise<DBMangaVolume[]> {
	try {
		const rows = await db
			.select()
			.from(botMangaVolumes)
			.where(and(eq(botMangaVolumes.series, "DB"), eq(botMangaVolumes.visible, true)))
			.orderBy(asc(botMangaVolumes.volumeNumber));
		return rows.map((r) => ({
			id: r.id,
			series: r.series,
			volumeNumber: r.volumeNumber ?? 0,
			title: r.title,
			cover: r.cover,
		}));
	} catch (e) {
		console.error("[shenron] getShenronManga a échoué:", e);
		return [];
	}
}

export async function getShenronRaces(): Promise<DBRace[]> {
	try {
		return (await db
			.select()
			.from(botRaces)
			.where(eq(botRaces.visible, true))) as DBRace[];
	} catch (e) {
		console.error("[shenron] getShenronRaces a échoué:", e);
		return [];
	}
}

export function getRawRaceNamesForSlug(slug: string, name: string): string[] {
	switch (slug) {
		case "saiyan":
			return ["Saiyan"];
		case "human":
			return ["Human"];
		case "namekian":
			return ["Namekian"];
		case "frieza-race":
			return ["Frieza Race"];
		case "android":
			return ["Android"];
		case "majin":
			return ["Majin"];
		case "god-of-destruction":
			return ["God"];
		case "angel":
			return ["Angel"];
		case "kaioshin":
			return ["Nucleico", "Nucleico benigno"];
		case "demon":
			return ["Demon", "Evil"];
		default:
			return [name, slug];
	}
}

export async function getShenronRace(
	slug: string
): Promise<(DBRace & { characters: DBCharacter[]; homePlanet: DBPlanet | null }) | null> {
	try {
		const [r] = await db.select().from(botRaces).where(and(eq(botRaces.slug, slug), eq(botRaces.visible, true))).limit(1);
		if (!r) return null;
		
		const rawRaces = getRawRaceNamesForSlug(r.slug, r.name);
		const characters = (
			await db
				.select()
				.from(botCharacters)
				.where(and(inArray(botCharacters.race, rawRaces), eq(botCharacters.visible, true)))
		).map(mapCharacter);

		let homePlanet: DBPlanet | null = null;
		if (r.homePlanetId) {
			const [p] = await db
				.select()
				.from(botPlanets)
				.where(and(eq(botPlanets.id, r.homePlanetId), eq(botPlanets.visible, true)))
				.limit(1);
			if (p) {
				homePlanet = mapPlanet(p);
			}
		}

		return { ...(r as DBRace), characters, homePlanet };
	} catch (e) {
		console.error("[shenron] getShenronRace a échoué:", e);
		return null;
	}
}

export async function getShenronPlanets(): Promise<DBPlanet[]> {
	try {
		return (await db.select().from(botPlanets).where(eq(botPlanets.visible, true))).map(mapPlanet);
	} catch (e) {
		console.error("[shenron] getShenronPlanets a échoué:", e);
		return [];
	}
}

export async function getShenronPlanet(
	id: number
): Promise<(DBPlanet & { characters: DBCharacter[] }) | null> {
	try {
		const [p] = await db.select().from(botPlanets).where(and(eq(botPlanets.id, id), eq(botPlanets.visible, true))).limit(1);
		if (!p) return null;
		const characters = (
			await db.select().from(botCharacters).where(and(eq(botCharacters.originPlanetId, id), eq(botCharacters.visible, true)))
		).map(mapCharacter);
		return { ...mapPlanet(p), characters };
	} catch (e) {
		console.error("[shenron] getShenronPlanet a échoué:", e);
		return null;
	}
}

// ─────────────────────────────────────────────────────────────────────────
// Runtime du bot (XP/zeni/shop/personas live) — reste sur l'API REST : ces
// données changent en continu et n'ont pas de sens à miroiter (le miroir a
// 30 min de retard, inacceptable pour un leaderboard).
// ─────────────────────────────────────────────────────────────────────────

export interface PersonaInfo {
	id: string;
	name: string;
	username: string | null;
	avatar: string | null;
	online: boolean;
	wsPing: number;
	intents: number;
	guildCount: number;
	commandCount: number;
}

export interface CommandInfo {
	name: string;
	description: string;
	type: number;
	options?: Array<{
		name: string;
		description?: string;
		type: number;
		required?: boolean;
	}>;
}

export interface ShenronStats {
	users: number;
	totalXp: number;
	totalZeni: number;
	achievementsUnlocked: number;
	shopItems: number;
	inventoryItems: number;
}

export async function getShenronStats(): Promise<ShenronStats> {
	const fallback: ShenronStats = {
		users: 0,
		totalXp: 0,
		totalZeni: 0,
		achievementsUnlocked: 0,
		shopItems: 0,
		inventoryItems: 0,
	};
	try {
		const res = await fetch(`${SHENRON_API_URL}/api/public/stats`, {
			next: { revalidate: 30 },
		});
		if (!res.ok) return fallback;
		return { ...fallback, ...(await res.json()) };
	} catch {
		return fallback;
	}
}

export async function getShenronPersonas(): Promise<PersonaInfo[]> {
	try {
		const res = await fetch(`${SHENRON_API_URL}/api/public/personas`, {
			next: { revalidate: 30 },
		});
		if (!res.ok) return [];
		const data = await res.json();
		return data.personas || [];
	} catch {
		return [];
	}
}

export async function getShenronCommands(): Promise<Record<string, CommandInfo[]>> {
	try {
		const res = await fetch(`${SHENRON_API_URL}/api/public/commands`, {
			next: { revalidate: 300 },
		});
		if (!res.ok) return {};
		const data = await res.json();
		return data.commands || {};
	} catch {
		return {};
	}
}
