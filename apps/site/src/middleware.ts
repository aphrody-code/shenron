/**
 * middleware.ts — garde-barrière des routes DBFR.
 *
 * Lancement bêta partielle : seules les sections Épisodes, Films et Manga
 * sont publiques. Toutes les autres routes /wiki/* (wiki personnages, sagas,
 * arcs, races, transformations, etc.) et /tierlists/* sont redirigées vers
 * l'accueil. Le code des pages reste intact — seul l'accès est bloqué ici.
 *
 * Pour réouvrir une section : ajouter son préfixe dans WIKI_OPEN.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Sections /wiki autorisées en bêta (vérifié par préfixe de pathname). */
const WIKI_OPEN = ["/wiki/episodes", "/wiki/films", "/wiki/manga"] as const;

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// /tierlists/** → accueil
	if (pathname === "/tierlists" || pathname.startsWith("/tierlists/")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// /wiki/** → autoriser seulement les sections ouvertes
	if (pathname === "/wiki" || pathname.startsWith("/wiki/")) {
		const open = WIKI_OPEN.some(
			(prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
		);
		if (!open) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	// Matcher couvre /wiki (exact + sous-routes) et /tierlists (exact + sous-routes).
	// Exclut _next/static, _next/image, fichiers d'assets et routes API.
	matcher: [
		"/wiki",
		"/wiki/(.*)",
		"/tierlists",
		"/tierlists/(.*)",
	],
};
