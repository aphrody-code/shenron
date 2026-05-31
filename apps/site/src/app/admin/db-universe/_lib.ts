/**
 * Helper interne admin pour consommer l'API publique du bot avec no-cache.
 * L'admin doit voir la vraie data temps-réel, pas la version cachée Vercel.
 */
import { API_URL as API } from "@/lib/config";

// L'API bot est incohérente sur le casing : certains endpoints (movies, games,
// sagas via Drizzle) renvoient du camelCase, d'autres (episodes, sources, assets
// via SQL brut) du snake_case. Les pages db-universe lisent toutes en snake_case
// → on normalise camelCase → snake_case (idempotent sur les clés déjà snake).
function toSnake(v: unknown): unknown {
	if (Array.isArray(v)) return v.map(toSnake);
	if (v && typeof v === "object") {
		const out: Record<string, unknown> = {};
		for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
			out[k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)] = toSnake(val);
		}
		return out;
	}
	return v;
}

export async function adminFetch<T>(path: string): Promise<T | null> {
	try {
		const r = await fetch(`${API}${path}`, { cache: "no-store" });
		if (!r.ok) return null;
		return toSnake(await r.json()) as T;
	} catch {
		return null;
	}
}

export function assetCdnUrl(path: string): string {
	return `${API}/db/${path.replace(/^\//, "")}`;
}
