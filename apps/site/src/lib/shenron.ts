import "server-only";
import { asc, eq, like, sql } from "drizzle-orm";
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
} from "@/db/bot-schema";

const SHENRON_API_URL =
	process.env.SHENRON_API_URL || "https://shenron.rpbey.fr";

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

export interface DBCharacter {
	id: number;
	name: string;
	/** Nom japonais natif (孫悟空, ベジータ) — enrichi via AniList */
	nameJa: string | null;
	/** Translittération canon (Son Gokuu, Kuririn) — enrichi via AniList */
	nameRomaji: string | null;
	image: string;
	ki: string | null;
	maxKi: string | null;
	race: string | null;
	gender: string | null;
	affiliation: string | null;
	description: string | null;
	originPlanetId: number | null;
}

export interface DBPlanet {
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

export interface DBTechnique {
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

export interface DBRace {
	id: number;
	slug: string;
	name: string;
	nameJa: string | null;
	description: string | null;
}

export interface CharacterWithRelations extends DBCharacter {
	transformations: DBTransformation[];
	originPlanet: DBPlanet | null;
	techniques: Array<{ technique: DBTechnique }>;
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

function mapCharacter(r: CharacterRow): DBCharacter {
	return {
		id: r.id,
		name: r.name,
		nameJa: r.nameJa,
		nameRomaji: r.nameRomaji,
		image: r.image ?? "",
		ki: r.ki,
		maxKi: r.maxKi,
		race: r.race,
		gender: r.gender,
		affiliation: r.affiliation,
		description: r.description,
		originPlanetId: r.originPlanetId,
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

export async function getShenronUser(
	discordId: string,
): Promise<ShenronUser | null> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/user/${discordId}`, {
		next: { revalidate: 60 },
	});
	if (!res.ok) return null;
	return res.json();
}

export async function getShenronShop(): Promise<ShenronShopItem[]> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/shop`, {
		next: { revalidate: 60 },
	});
	if (!res.ok) return [];
	const data = await res.json();
	return data.items || [];
}

export async function getShenronLeaderboard(
	limit = 100,
	enrich = true,
): Promise<LeaderboardEntry[]> {
	const res = await fetch(
		`${SHENRON_API_URL}/api/public/leaderboard?limit=${limit}${enrich ? "&enrich=1" : ""}`,
		{
			next: { revalidate: 60 },
		},
	);
	if (!res.ok) return [];
	const data = await res.json();
	return data.leaderboard || [];
}

export async function getShenronCharacters(
	query?: string,
): Promise<DBCharacter[]> {
	try {
		const q = query?.trim();
		const rows = q
			? await db
					.select()
					.from(botCharacters)
					.where(like(sql`lower(${botCharacters.name})`, `%${q.toLowerCase()}%`))
					.limit(25)
			: await db.select().from(botCharacters);
		return rows.map(mapCharacter);
	} catch {
		return [];
	}
}

export async function getShenronMovies(): Promise<DBMovie[]> {
	try {
		return (await db.select().from(botMovies)) as DBMovie[];
	} catch {
		return [];
	}
}

export async function getShenronMovie(id: number): Promise<DBMovie | null> {
	try {
		const [m] = await db
			.select()
			.from(botMovies)
			.where(eq(botMovies.id, id))
			.limit(1);
		return (m as DBMovie) ?? null;
	} catch {
		return null;
	}
}

export async function getShenronCharacter(
	id: number,
): Promise<CharacterWithRelations | null> {
	try {
		const [c] = await db
			.select()
			.from(botCharacters)
			.where(eq(botCharacters.id, id))
			.limit(1);
		if (!c) return null;

		const transformations = (
			await db
				.select()
				.from(botTransformations)
				.where(eq(botTransformations.characterId, id))
		).map(mapTransfo);

		let originPlanet: DBPlanet | null = null;
		if (c.originPlanetId != null) {
			const [p] = await db
				.select()
				.from(botPlanets)
				.where(eq(botPlanets.id, c.originPlanetId))
				.limit(1);
			originPlanet = p ? mapPlanet(p) : null;
		}

		const techRows = await db
			.select({ t: botTechniques })
			.from(botCharacterTechniques)
			.innerJoin(
				botTechniques,
				eq(botCharacterTechniques.techniqueId, botTechniques.id),
			)
			.where(eq(botCharacterTechniques.characterId, id));
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
			} satisfies DBTechnique,
		}));

		return { ...mapCharacter(c), transformations, originPlanet, techniques };
	} catch {
		return null;
	}
}

export async function getShenronTechniques(): Promise<DBTechnique[]> {
	try {
		const rows = await db
			.select({ t: botTechniques, name: botCharacters.name, image: botCharacters.image })
			.from(botTechniques)
			.leftJoin(botCharacters, eq(botTechniques.creatorId, botCharacters.id));
		return rows.map((r) => ({
			id: r.t.id,
			slug: r.t.slug,
			name: r.t.name,
			description: r.t.description,
			type: r.t.type,
			creatorId: r.t.creatorId,
			creatorName: r.name ?? null,
			creatorImage: r.image ?? null,
		}));
	} catch {
		return [];
	}
}

export async function getShenronTechnique(
	slug: string,
): Promise<DBTechnique | null> {
	try {
		const [r] = await db
			.select({ t: botTechniques, name: botCharacters.name, image: botCharacters.image })
			.from(botTechniques)
			.leftJoin(botCharacters, eq(botTechniques.creatorId, botCharacters.id))
			.where(eq(botTechniques.slug, slug))
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
		};
	} catch {
		return null;
	}
}

export async function getShenronGames(): Promise<DBGame[]> {
	try {
		return (await db.select().from(botGames)) as DBGame[];
	} catch {
		return [];
	}
}

export async function getShenronGame(slug: string): Promise<DBGame | null> {
	try {
		const [g] = await db
			.select()
			.from(botGames)
			.where(eq(botGames.slug, slug))
			.limit(1);
		return (g as DBGame) ?? null;
	} catch {
		return null;
	}
}

export async function getShenronManga(): Promise<DBMangaVolume[]> {
	try {
		const rows = await db
			.select()
			.from(botMangaVolumes)
			.where(eq(botMangaVolumes.series, "DB"))
			.orderBy(asc(botMangaVolumes.volumeNumber));
		return rows.map((r) => ({
			id: r.id,
			series: r.series,
			volumeNumber: r.volumeNumber ?? 0,
			title: r.title,
			cover: r.cover,
		}));
	} catch {
		return [];
	}
}

export async function getShenronRaces(): Promise<DBRace[]> {
	try {
		return (await db.select().from(botRaces)) as DBRace[];
	} catch {
		return [];
	}
}

export async function getShenronRace(
	slug: string,
): Promise<(DBRace & { characters: DBCharacter[] }) | null> {
	try {
		const [r] = await db
			.select()
			.from(botRaces)
			.where(eq(botRaces.slug, slug))
			.limit(1);
		if (!r) return null;
		const characters = (
			await db.select().from(botCharacters).where(eq(botCharacters.race, r.name))
		).map(mapCharacter);
		return { ...(r as DBRace), characters };
	} catch {
		return null;
	}
}

export async function getShenronPlanets(): Promise<DBPlanet[]> {
	try {
		return (await db.select().from(botPlanets)).map(mapPlanet);
	} catch {
		return [];
	}
}

export async function getShenronPlanet(
	id: number,
): Promise<(DBPlanet & { characters: DBCharacter[] }) | null> {
	try {
		const [p] = await db
			.select()
			.from(botPlanets)
			.where(eq(botPlanets.id, id))
			.limit(1);
		if (!p) return null;
		const characters = (
			await db
				.select()
				.from(botCharacters)
				.where(eq(botCharacters.originPlanetId, id))
		).map(mapCharacter);
		return { ...mapPlanet(p), characters };
	} catch {
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
	const res = await fetch(`${SHENRON_API_URL}/api/public/personas`, {
		next: { revalidate: 30 },
	});
	if (!res.ok) return [];
	const data = await res.json();
	return data.personas || [];
}

export async function getShenronCommands(): Promise<
	Record<string, CommandInfo[]>
> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/commands`, {
		next: { revalidate: 300 },
	});
	if (!res.ok) return {};
	const data = await res.json();
	return data.commands || {};
}
