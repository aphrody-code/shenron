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

/**
 * URL publique d'un média de `bot.db_assets`.
 *
 * Deux racines cohabitent derrière ces chemins, et les confondre rend un 404 sur un
 * fichier pourtant présent : le miroir DB vit dans `public/db/` du bot (servi par
 * `/db/`), tandis que les médias uploadés depuis le studio sont enregistrés
 * « ./assets/wiki/… » et vivent dans `apps/site/public/wiki/` (servi par `/assets/`).
 * Mesuré le 2026-09-03 : 4 uploads étaient invisibles dans la galerie pour ce seul
 * motif — le chemin en base n'est jamais un chemin de disque.
 *
 * L'encodage ne touche QUE les caractères non-ASCII (36 fichiers portent un nom
 * japonais) : ré-encoder tout casserait les chemins déjà percent-encodés en base,
 * où « %20 » deviendrait « %2520 ».
 */
export function assetCdnUrl(path: string): string {
	const propre = path.replace(/^\.?\//, "");
	const encode = (s: string) => s.replace(/[^\x00-\x7F]/g, (c) => encodeURIComponent(c));
	if (propre.startsWith("assets/wiki/")) return `${API}/${encode(propre)}`;
	return `${API}/db/${encode(propre)}`;
}
