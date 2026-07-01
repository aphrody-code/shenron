/**
 * middleware.ts — garde-barrière des routes DBFR.
 *
 * Lancement bêta partielle : seules les sections Épisodes, Films et Manga
 * sont publiques. Toutes les autres routes /wiki/* (wiki personnages, sagas,
 * arcs, races, transformations, etc.) et /tierlists/* sont redirigées vers
 * l'accueil POUR LE PUBLIC. Le code des pages reste intact — seul l'accès est
 * bloqué ici.
 *
 * EXCEPTION ADMIN/OWNER : un admin (cookie token `dbfr_admin`) ou l'owner
 * (Discord OAuth, OWNER_ID / OAUTH_ALLOWED_USERS) voit TOUTES les pages, y
 * compris les sections encore masquées. Le middleware tourne en runtime edge
 * (pas de node:crypto ni d'accès DB direct) : on délègue la décision au route
 * handler `/api/me` (runtime node, gère token + OAuth, mémoïsé 60 s) et on ne
 * paie ce fetch QUE si un cookie d'auth est présent — le trafic anonyme est
 * redirigé immédiatement, à coût zéro (aucun fetch, cache CDN des redirects
 * préservé).
 *
 * Pour réouvrir une section au public : ajouter son préfixe dans WIKI_OPEN.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Sections /wiki autorisées au public en bêta (vérifié par préfixe de pathname). */
const WIKI_OPEN = ["/wiki/episodes", "/wiki/films", "/wiki/manga"] as const;

/** Une route publique bêta ? (sinon elle est réservée admin/owner) */
function isPublicWiki(pathname: string): boolean {
	return WIKI_OPEN.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
}

/**
 * Présence d'un cookie d'authentification (Better Auth session ou token admin).
 * Fast-path : si aucun cookie d'auth, l'utilisateur est forcément anonyme → on
 * évite le fetch `/api/me`. Robuste au préfixe `__Secure-` / `better-auth.`.
 */
function hasAuthCookie(request: NextRequest): boolean {
	for (const c of request.cookies.getAll()) {
		if (
			c.name === "dbfr_admin" ||
			c.name.includes("session_token") ||
			c.name.includes("session_data")
		) {
			return true;
		}
	}
	return false;
}

/**
 * L'utilisateur courant est-il admin/owner ? Délègue à `/api/me` (source unique
 * de vérité : token admin OU Discord OWNER_ID/OAUTH_ALLOWED_USERS). Fail-closed :
 * toute erreur/timeout → false (l'admin réessaie ; on n'expose jamais par défaut).
 */
async function isAdmin(request: NextRequest): Promise<boolean> {
	if (!hasAuthCookie(request)) return false;
	try {
		const res = await fetch(new URL("/api/me", request.nextUrl.origin), {
			headers: { cookie: request.headers.get("cookie") ?? "" },
			signal: AbortSignal.timeout(2500),
		});
		if (!res.ok) return false;
		const me = (await res.json()) as { isAdmin?: boolean };
		return me.isAdmin === true;
	} catch {
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const blocked =
		pathname === "/tierlists" ||
		pathname.startsWith("/tierlists/") ||
		((pathname === "/wiki" || pathname.startsWith("/wiki/")) && !isPublicWiki(pathname));

	if (blocked && !(await isAdmin(request))) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	// Matcher couvre /wiki (exact + sous-routes) et /tierlists (exact + sous-routes).
	// N'intercepte JAMAIS /api (dont /api/me) → pas de boucle sur le fetch admin.
	matcher: ["/wiki", "/wiki/(.*)", "/tierlists", "/tierlists/(.*)"],
};
