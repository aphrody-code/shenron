/**
 * Helpers d'assets/URL **client-safe** (aucune dépendance server-only).
 *
 * Isolés de `shenron.ts` / `db-universe.ts` (désormais server-only car ils
 * tapent Neon via Drizzle) : ces fonctions sont importées par des Client
 * Components (jeu 2048, carte profil, admin DB). Les y laisser ferait fuiter
 * `postgres`/`drizzle` dans le bundle client.
 */
import { env } from "@/lib/env";

// Base publique des assets servis par le bot (images wiki, banners, etc.).
const ASSET_BASE = (
	env.NEXT_PUBLIC_SHENRON_API_URL ?? "https://bot.dragonballfr.com"
).replace(/\/+$/, "");

/**
 * Normalise un chemin d'asset DB (`./assets/...` ou `assets/...`) en URL
 * absolue servie par le bot. Les URL http(s) déjà absolues sont renvoyées
 * telles quelles.
 */
export function assetUrl(path: string | null | undefined): string {
	if (!path) return "";
	if (path.startsWith("http")) return path;
	const clean = path.replace(/^\.?\/*/, "");
	return `${ASSET_BASE}/${clean}`;
}

/**
 * URL de la carte profil PNG générée par le canvas du bot (8 thèmes).
 */
export function getProfileCardUrl(discordId: string, theme?: string): string {
	const q = theme ? `?theme=${encodeURIComponent(theme)}` : "";
	return `${ASSET_BASE}/api/public/profile/${encodeURIComponent(discordId)}/card.png${q}`;
}

/**
 * Browser-only : s'abonne aux events SSE temps réel du bot (level-up,
 * achievement, fusion, message-xp). Retourne un cleanup pour fermer la
 * connexion. À appeler depuis un Client Component (`useEffect`).
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
	const url = `${ASSET_BASE}/api/a2a/events${
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
