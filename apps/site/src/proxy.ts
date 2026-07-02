import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// proxy.ts = « middleware » de Next 16 (renommé middleware.ts → proxy.ts).
// Deux rôles : (1) canonicalisation du host vers dragonballfr.com ; (2) gating
// bêta des sections non publiques (wiki hors episodes/films/manga, + tierlists),
// avec exception admin/owner. Cf. https://nextjs.org/docs/messages/middleware-to-proxy

/** Sections /wiki ouvertes au public en bêta (vérifié par préfixe de pathname). */
const WIKI_OPEN = [
	"/wiki/episodes",
	"/wiki/films",
	"/wiki/manga",
	// Chronologie universelle : ne liste que des épisodes + films (déjà publics).
	"/wiki/chronologie",
] as const;

/** Une route /wiki publique bêta ? (sinon réservée admin/owner) */
function isPublicWiki(pathname: string): boolean {
	return WIKI_OPEN.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
}

/**
 * Présence d'un cookie d'authentification (session Better Auth ou token admin).
 * Fast-path : sans cookie d'auth, l'utilisateur est forcément anonyme → on évite
 * le fetch `/api/me` (le trafic anonyme est redirigé à coût zéro). Robuste au
 * préfixe `__Secure-` / `better-auth.`.
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
 * de vérité : token admin OU Discord OWNER_ID/OAUTH_ALLOWED_USERS) — le proxy
 * tourne en runtime edge (pas de node:crypto ni d'accès DB direct). Le matcher
 * exclut `/api` → aucune boucle sur ce fetch. Fail-closed : toute erreur/timeout
 * → false (l'admin réessaie ; jamais d'exposition par défaut).
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

export async function proxy(request: NextRequest) {
	const host = request.headers.get("host") || "";

	// Déterminer s'il s'agit d'un déploiement de preview Vercel (ex. dbfr-git-branch.vercel.app)
	// afin de ne pas bloquer les tests de preview, tout en redirigeant l'alias de prod Vercel (dbfr.vercel.app).
	const isVercelPreview = host.endsWith(".vercel.app") && host !== "dbfr.vercel.app";

	// Rediriger vers le domaine unique canonique si la requête provient d'un autre hôte,
	// tout en autorisant localhost en local et les environnements de preview sur Vercel.
	if (
		host &&
		host !== "dragonballfr.com" &&
		!isVercelPreview &&
		!host.includes("localhost") &&
		!host.includes("127.0.0.1")
	) {
		const url = request.nextUrl.clone();
		url.host = "dragonballfr.com";
		url.protocol = "https";
		return NextResponse.redirect(url, 308);
	}

	// Gating bêta : /tierlists/** + /wiki/** (hors episodes/films/manga) sont
	// réservés aux admins/owner. Le public est redirigé vers l'accueil. Le code
	// des pages reste intact — seul l'accès est bloqué ici. Réouverture au public
	// = ajouter le préfixe dans WIKI_OPEN.
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
	matcher: [
		/*
		 * Appliquer le proxy sur toutes les routes sauf :
		 * - api (les routes API peuvent être interrogées directement ou recevoir des webhooks ;
		 *   exclure /api garantit aussi zéro boucle sur le fetch admin /api/me)
		 * - _next/static (fichiers statiques Next.js)
		 * - _next/image (optimisation d'images)
		 * - favicon.ico, sitemap.xml, robots.txt (métadonnées)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
