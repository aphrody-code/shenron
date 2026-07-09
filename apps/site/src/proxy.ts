import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRequestAdmin } from "@/lib/proxy-admin";
import { getOpenCategoryKeys } from "@/lib/wiki-launch-config";
import { isPathOpen } from "@/lib/wiki-launch";

// proxy.ts = « middleware » de Next 16 (renommé middleware.ts → proxy.ts).
// Deux rôles : (1) canonicalisation du host vers dragonballfr.com ; (2) gating
// bêta des sections non publiques (wiki hors catégories ouvertes, + tierlists),
// avec exception admin/owner. Cf. https://nextjs.org/docs/messages/middleware-to-proxy
//
// Les catégories publiques ne sont PLUS codées en dur : elles viennent de la DB
// (`wiki-launch-config`, singleton WikiLaunch, cache TTL) → bascule live depuis
// /admin/lancement. Repli défaut = catégories bêta (episodes/films/manga/chrono).

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

	// Gating bêta : /tierlists/** + /wiki/** (hors catégories ouvertes) sont
	// réservés aux admins/owner. Le code des pages reste intact — seul l'accès est
	// bloqué ici. Réouverture au public = basculer la catégorie dans /admin/lancement.
	const { pathname } = request.nextUrl;
	const isWiki = pathname === "/wiki" || pathname.startsWith("/wiki/");
	const openKeys = isWiki ? await getOpenCategoryKeys() : [];
	const blocked =
		pathname === "/tierlists" ||
		pathname.startsWith("/tierlists/") ||
		(isWiki && !isPathOpen(pathname, openKeys));

	if (blocked && !(await isAdmin(request))) {
		// Au lieu de renvoyer silencieusement le visiteur sur la marketing home
		// (aucun contexte, dead-end), on le redirige vers un écran « en préparation »
		// dédié (noindex) qui explique et propose les sections déjà ouvertes. On
		// construit la cible depuis `request.url` (Host nginx = dragonballfr.com) et
		// non `nextUrl.clone()` (host interne localhost:3000 → tentative de proxy
		// externe ECONNREFUSED). Le contenu gated n'est jamais rendu.
		return NextResponse.redirect(
			new URL(`/wiki-bientot?from=${encodeURIComponent(pathname)}`, request.url)
		);
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
