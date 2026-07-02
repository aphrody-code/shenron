/**
 * config — **source unique** des URL/endpoints du site (client-safe).
 *
 * Avant : la base de l'API bot (`https://bot.dragonballfr.com`), l'invitation
 * Discord (`https://discord.gg/dbfr`) et l'URL du site étaient recopiées en dur
 * dans ~25 fichiers, chacun avec sa propre résolution `process.env.X ?? "…"`.
 * Une migration de domaine devait alors toucher 25 endroits. Désormais tout
 * passe par ce module — un seul `process.env` lu, une seule valeur par défaut.
 *
 * Universel (importable par RSC, route handlers ET Client Components) : on lit
 * `process.env` directement (pas `@/lib/env`, dont le proxy `@t3-oss` jette sur
 * accès à une var *server* depuis le client). Résolution **public d'abord** :
 *  - `NEXT_PUBLIC_*` est inliné dans le bundle client par Next, donc disponible
 *    partout ;
 *  - la var *server* (non publique) sert de repli côté serveur uniquement
 *    (vaut `undefined` côté client → on tombe sur la valeur par défaut).
 *
 * C'est la SEULE exception autorisée à la règle « pas de `process.env` hors
 * `env.ts` » : ce fichier EST la centralisation que cette règle vise.
 */

const trimSlash = (u: string): string => u.replace(/\/+$/, "");

/** Hôte canonique du bot (API REST + assets + SSE + canvas). */
export const BOT_HOST = "https://bot.dragonballfr.com";
/** Domaine canonique du site (Vercel). */
export const SITE_HOST = "https://dragonballfr.com";
/**
 * Invitation Discord par défaut. Vanity `dragonballfr` = serveur « Dragon Ball FR »
 * (guild 934894610545770506). NE PAS remettre `dbfr` : ce code a été réattribué à
 * un autre serveur (« Goldbase Collection ») → il enverrait les visiteurs ailleurs.
 */
const DISCORD_DEFAULT = "https://discord.gg/dragonballfr";

/**
 * Base de l'API du bot Shenron (runtime, RAG, proxies admin/user, uploads).
 * Sans slash final.
 */
export const API_URL = trimSlash(
	(process.env.NEXT_PUBLIC_SHENRON_API_URL ?? process.env.SHENRON_API_URL ?? BOT_HOST).trim()
);

/**
 * Base des assets self-hostés par le bot (images wiki, banners, cartes canvas).
 * Même hôte que l'API par défaut ; un CDN dédié peut être posé via
 * `NEXT_PUBLIC_SHENRON_ASSETS_URL`.
 */
export const ASSET_BASE = trimSlash((process.env.NEXT_PUBLIC_SHENRON_ASSETS_URL ?? API_URL).trim());

/** URL publique du site (OG, liens absolus, metadataBase). Sans slash final. */
export const SITE_URL = trimSlash(
	(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.BETTER_AUTH_URL ?? SITE_HOST).trim()
);

/** Invitation Discord du serveur DBFR. */
export const DISCORD_INVITE = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? DISCORD_DEFAULT;

/** Construit une URL absolue sur l'API bot : `apiUrl("api/public/stats")`. */
export function apiUrl(path = ""): string {
	return path ? `${API_URL}/${path.replace(/^\/+/, "")}` : API_URL;
}

/** Construit une URL absolue sur l'hôte des assets bot. */
export function assetBaseUrl(path = ""): string {
	return path ? `${ASSET_BASE}/${path.replace(/^\/+/, "")}` : ASSET_BASE;
}
