const SHENRON_API_URL = process.env.SHENRON_API_URL || "https://shenron.rpbey.fr";

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
  type: "card" | "badge" | "color" | "title";
  name: string;
  description: string | null;
  price: number;
  roleId: string | null;
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
  image: string;
  isDestroyed: boolean;
  description: string | null;
}

export interface DBTransformation {
  id: number;
  name: string;
  image: string;
  ki: string | null;
  characterId: number;
}

export interface CharacterWithRelations extends DBCharacter {
  transformations: DBTransformation[];
  originPlanet: DBPlanet | null;
}

export async function getShenronUser(discordId: string): Promise<ShenronUser | null> {
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

export async function getShenronLeaderboard(limit = 100, enrich = true): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${SHENRON_API_URL}/api/public/leaderboard?limit=${limit}${enrich ? '&enrich=1' : ''}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.leaderboard || [];
}

export async function getShenronCharacters(query?: string): Promise<DBCharacter[]> {
  const url = new URL(`${SHENRON_API_URL}/api/public/wiki/characters`);
  if (query) url.searchParams.set("q", query);
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.characters || [];
}

export async function getShenronCharacter(id: number): Promise<CharacterWithRelations | null> {
  const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/characters/${id}`, {
    next: { revalidate: 3600 },
  });
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

export async function getShenronPlanet(id: number): Promise<DBPlanet | null> {
  const res = await fetch(`${SHENRON_API_URL}/api/public/wiki/planets/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}
