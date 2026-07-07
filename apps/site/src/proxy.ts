import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRequestAdmin } from "@/lib/proxy-admin";

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
 * L'utilisateur courant est-il admin/owner ? Résolu **en process** (Node.js
 * runtime du proxy) via `isRequestAdmin` : token admin OU session Discord
 * (OWNER_ID/OAUTH_ALLOWED_USERS/roleAdmin) — plus de `fetch("/api/me")` fragile
 * (le self-fetch se faisait droper le Cookie au 301 http→https de nginx →
 * l'admin était redirigé). Fast-path sans cookie d'auth = anonyme (coût zéro).
 * Fail-closed : toute erreur → false (jamais d'exposition par défaut).
 */
async function isAdmin(request: NextRequest): Promise<boolean> {
	if (!hasAuthCookie(request)) return false;
	try {
		return await isRequestAdmin(request);
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
	// réservés aux admins/owner. Le code des pages reste intact — seul l'accès est
	// bloqué ici. Réouverture au public = ajouter le préfixe dans WIKI_OPEN.
	const { pathname } = request.nextUrl;
	const blocked =
		pathname === "/tierlists" ||
		pathname.startsWith("/tierlists/") ||
		((pathname === "/wiki" || pathname.startsWith("/wiki/")) && !isPublicWiki(pathname));

	if (blocked && !(await isAdmin(request))) {
		// Au lieu de renvoyer silencieusement le visiteur sur la home (URL perdue,
		// back-button cassé), on **rewrite** vers un écran « en préparation » servi
		// à l'URL d'origine (noindex). Le middleware s'exécute toujours avant le
		// cache → le contenu gated reste protégé ; l'admin passe (next()) au-dessus.
		const teaser = request.nextUrl.clone();
		teaser.pathname = "/wiki-bientot";
		teaser.search = `?from=${encodeURIComponent(pathname)}`;
		return NextResponse.rewrite(teaser);
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
