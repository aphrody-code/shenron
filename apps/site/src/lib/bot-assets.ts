/**
 * Helpers pour consommer les assets statiques du bot Shenron.
 *
 * Le bot sert `GET /assets/<sub>` (Bun.serve, cache immutable 30j, CORS public).
 * Côté site on construit l'URL absolue via `SHENRON_API_URL` (public env).
 *
 * Exposé aussi côté client : lire `NEXT_PUBLIC_SHENRON_ASSETS_URL` en premier.
 */

const PUBLIC_ASSETS_URL =
	process.env.NEXT_PUBLIC_SHENRON_ASSETS_URL ??
	process.env.NEXT_PUBLIC_SHENRON_API_URL ?? // client-exposed (bot.rpbey.fr)
	process.env.SHENRON_API_URL ??
	"https://bot.rpbey.fr";

const BASE = PUBLIC_ASSETS_URL.replace(/\/+$/, "");

/**
 * `botAsset("dbz/goku.png")` → `https://shenron.rpbey.fr/assets/dbz/goku.png`
 * Accepte aussi les paths DB stockés `./assets/dbz/x.png` ou `/assets/dbz/x.png`.
 */
export function botAsset(path: string): string {
	const sub = path.replace(/^\.?\/?(assets\/)?/, "").replace(/^\/+/, "");
	return `${BASE}/assets/${sub}`;
}

export const BOT_ASSETS_BASE = BASE;
