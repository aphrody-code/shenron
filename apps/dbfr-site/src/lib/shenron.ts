const SHENRON_API_URL = process.env.SHENRON_API_URL || "https://shenron.rpbey.fr";

export interface ShenronUser {
  discordId: string;
  username: string;
  avatar: string | null;
  level: number;
  xp: number;
  zeni: number;
  banner: string | null;
  equipped: {
    card: string | null;
    badge: string | null;
    color: string | null;
    title: string | null;
  };
  achievements: Array<{ code: string; unlockedAt: string }>;
  inventory: Array<{ type: string; key: string }>;
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
  xp: number;
  zeni: number;
  level: number;
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

export async function getShenronLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${SHENRON_API_URL}/api/public/leaderboard?limit=${limit}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.leaderboard || [];
}
