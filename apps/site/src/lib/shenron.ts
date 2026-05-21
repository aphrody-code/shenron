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

export interface CharacterWithRelations extends DBCharacter {
	transformations: DBTransformation[];
	originPlanet: DBPlanet | null;
	techniques: Array<{ technique: DBTechnique }>;
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
	const url = new URL(`${SHENRON_API_URL}/api/public/wiki/characters`);
	if (query) url.searchParams.set("q", query);
	const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
	if (!res.ok) return [];
	const data = await res.json();
	return data.characters || [];
}

export async function getShenronMovies(): Promise<DBMovie[]> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/movies`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return [];
	const data = await res.json();
	return data.movies || [];
}

export async function getShenronMovie(id: number): Promise<DBMovie | null> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/movies/${id}`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return null;
	return res.json();
}

export async function getShenronCharacter(
	id: number,
): Promise<CharacterWithRelations | null> {
	const res = await fetch(
		`${SHENRON_API_URL}/api/public/wiki/characters/${id}`,
		{
			next: { revalidate: 3600 },
		},
	);
	if (!res.ok) return null;
	return res.json();
}

export async function getShenronTechniques(): Promise<DBTechnique[]> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/techniques`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return [];
	const data = await res.json();
	return data.techniques || [];
}

export async function getShenronTechnique(
	slug: string,
): Promise<DBTechnique | null> {
	const res = await fetch(
		`${SHENRON_API_URL}/api/public/wiki/techniques/${encodeURIComponent(slug)}`,
		{
			next: { revalidate: 3600 },
		},
	);
	if (!res.ok) return null;
	return res.json();
}

export async function getShenronGames(): Promise<DBGame[]> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/games`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return [];
	const data = await res.json();
	return data.games || [];
}

export async function getShenronGame(slug: string): Promise<DBGame | null> {
	const res = await fetch(
		`${SHENRON_API_URL}/api/public/wiki/games/${encodeURIComponent(slug)}`,
		{
			next: { revalidate: 3600 },
		},
	);
	if (!res.ok) return null;
	return res.json();
}

export async function getShenronManga(): Promise<DBMangaVolume[]> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/manga-volumes`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return [];
	const data = await res.json();
	return data.volumes || [];
}

export interface DBRace {
	id: number;
	slug: string;
	name: string;
	nameJa: string | null;
	description: string | null;
}

export async function getShenronRaces(): Promise<DBRace[]> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/races`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return [];
	const data = await res.json();
	return data.races || [];
}

export async function getShenronRace(
	slug: string,
): Promise<(DBRace & { characters: DBCharacter[] }) | null> {
	const res = await fetch(
		`${SHENRON_API_URL}/api/public/wiki/races/${encodeURIComponent(slug)}`,
		{
			next: { revalidate: 3600 },
		},
	);
	if (!res.ok) return null;
	return res.json();
}

export async function getShenronPlanets(): Promise<DBPlanet[]> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/planets`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return [];
	const data = await res.json();
	return data.planets || [];
}

export async function getShenronPlanet(
	id: number,
): Promise<(DBPlanet & { characters: DBCharacter[] }) | null> {
	const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/planets/${id}`, {
		next: { revalidate: 3600 },
	});
	if (!res.ok) return null;
	return res.json();
}

/**
 * URL d'une image profile card générée par le canvas du bot (8 thèmes).
 */
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

export function getProfileCardUrl(discordId: string, theme?: string): string {
	const q = theme ? `?theme=${encodeURIComponent(theme)}` : "";
	return `${SHENRON_API_URL}/api/public/profile/${encodeURIComponent(discordId)}/card.png${q}`;
}

/**
 * Browser-only : s'abonne aux events SSE temps réel du bot (level-up, achievement,
 * fusion, message-xp). Retourne un cleanup pour fermer la connexion.
 *
 * Usage dans un Client Component :
 *   useEffect(() => {
 *     const unsub = subscribeBotEvents((e) => console.log(e));
 *     return unsub;
 *   }, []);
 */
export function subscribeBotEvents(
	onEvent: (event: { type: string; data: unknown }) => void,
	opts?: { types?: string[] },
): () => void {
	if (typeof window === "undefined") {
		throw new Error(
			"subscribeBotEvents() must be called from a Client Component",
		);
	}
	const url = `${SHENRON_API_URL}/api/a2a/events${
		opts?.types?.length ? `?types=${opts.types.join(",")}` : ""
	}`;
	const es = new EventSource(url);
	es.onmessage = (e) => {
		try {
			onEvent(JSON.parse(e.data));
		} catch {
			/* ignore malformed */
		}
	};
	return () => es.close();
}
