import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveVisitor, type Visitor } from "@/lib/proxy-admin";
import { getLaunchConfig } from "@/lib/wiki-launch-config";
import { findEntry, resolveAccess } from "@/lib/wiki-launch";
import { getMemberRoleIds } from "@/lib/member-roles";

// proxy.ts = « middleware » de Next 16 (renommé middleware.ts → proxy.ts).
// Trois rôles : (1) canonicalisation du host vers dragonballfr.com ; (2) gating
// de l'espace /admin, qu'un `redirect()` de layout ne peut PAS protéger sous
// streaming (cf. le bloc dédié plus bas) ; (3) gating bêta des sections non
// publiques (wiki hors catégories ouvertes, + tierlists), avec exception
// admin/owner. Cf. https://nextjs.org/docs/messages/middleware-to-proxy
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

const ANONYMOUS: Visitor = { isAdmin: false, authenticated: false, discordId: null };

/**
 * Identité du visiteur, résolue **en process** (Node.js runtime du proxy) via
 * `resolveVisitor` : token admin OU session Discord
 * (OWNER_ID/OAUTH_ALLOWED_USERS/roleAdmin) — plus de `fetch("/api/me")` fragile
 * (le self-fetch se faisait droper le Cookie au 301 http→https de nginx →
 * l'admin était redirigé). Fast-path sans cookie d'auth = anonyme (coût zéro).
 * Fail-closed : toute erreur → anonyme (jamais d'exposition par défaut).
 */
async function visitorOf(request: NextRequest): Promise<Visitor> {
	if (!hasAuthCookie(request)) return ANONYMOUS;
	try {
		return await resolveVisitor(request);
	} catch {
		return ANONYMOUS;
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

	const { pathname } = request.nextUrl;

	// Journal : l'ancienne pagination `?page=N` est morte. Lire `searchParams`
	// dans une page la rend dynamique sous Next 16 (`no-store`), donc l'index le
	// plus crawlé du site n'était jamais caché — la pagination vit maintenant sous
	// `/actualites/page/N`, prérendue. La récupération des vieux liens se fait ICI
	// et pas dans `redirects()` de next.config : Next y recopie la query dans la
	// destination, ce qui reboucle à l'infini sur `?page=1`.
	if (pathname === "/actualites" && request.nextUrl.searchParams.has("page")) {
		const raw = request.nextUrl.searchParams.get("page") ?? "1";
		const n = /^[0-9]+$/.test(raw) ? Number(raw) : 1;
		const target = new URL(n >= 2 ? `/actualites/page/${n}` : "/actualites", request.url);
		return NextResponse.redirect(target, 308);
	}

	// Espace d'administration : arbitré ICI, avant tout rendu.
	//
	// `app/admin/layout.tsx` appelle bien `requireAdmin()`, mais sous Next 16 le
	// layout et ses enfants sont **streamés en parallèle** : le `redirect()` du
	// layout part dans le flux RSC alors que les pages ont déjà été rendues et
	// que leur charge utile est déjà émise. Un anonyme recevait donc un 200 avec
	// les données — mesuré le 2026-08-22 sur la prod : 851 Kio de titres sur
	// /admin/db-universe/databooks, et 470 Kio contenant 7 032 segments de
	// japonais transcrit sur /admin/databooks/19.
	//
	// C'est la même mécanique que le 308 de `/wiki/dragon-ball`, qui a dû quitter
	// le composant pour `next.config` : sous streaming, une redirection de layout
	// n'empêche pas le rendu de ce qu'elle est censée protéger. Seul le proxy
	// s'exécute avant le rendu.
	//
	// `requireAdmin()` reste en place dans le layout — défense en profondeur, et
	// il couvre les chemins qui n'entrent pas dans le matcher du proxy.
	if (pathname === "/admin" || pathname.startsWith("/admin/")) {
		const visitor = await visitorOf(request);
		if (!visitor.isAdmin) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		return NextResponse.next();
	}

	// Contrôle d'accès par rubrique : chaque catégorie wiki et chaque section du
	// site porte un mode (public / connectés / rôles Discord / staff) piloté depuis
	// /admin/lancement. Le code des pages reste intact — seul l'accès est arbitré
	// ici. Le staff traverse tout.
	const entry = findEntry(pathname);
	// `/wiki` EXACTEMENT — le sommaire de l'encyclopédie — est public. Il n'a pas
	// d'entrée au registre (une entrée de préfixe `/wiki` ouvrirait aussi tous
	// ses enfants, y compris les rubriques fermées), et retombait donc sur la
	// règle « hors registre sous /wiki ⇒ fermé » : la page d'accueil du wiki
	// renvoyait tout le monde sur le teaser « En préparation », alors qu'elle ne
	// fait que lister des rubriques dont chacune est déjà gardée par la sienne.
	if (pathname === "/wiki") return NextResponse.next();
	// Un FICHIER sous /wiki/ n'est pas une rubrique : c'est un asset de
	// `public/wiki/` (poster de scène, vignette de personnage, planche de
	// databook). La règle « hors registre sous /wiki ⇒ fermé » l'attrapait, et
	// `dragonballfr.com/wiki/taopaipai.poster.webp` répondait 307 vers le teaser
	// en PRODUCTION — mesuré, pas supposé. En cascade, `next/image` échouait à
	// charger le poster et le héros de l'accueil tombait sur sa frontière
	// d'erreur un tirage sur deux (les clips de fond sont pioches au hasard).
	//
	// L'extension est le bon discriminant : aucune rubrique du registre n'en
	// porte, et le dernier segment d'une page wiki est un slug (`/wiki/manga`,
	// `/wiki/personnages/son-goku`). Les points d'un slug — il n'y en a pas —
	// seraient de toute façon rattrapés par le registre, qui passe avant.
	if (/\.[a-z0-9]{2,5}$/i.test(pathname)) return NextResponse.next();
	const isWiki = pathname.startsWith("/wiki/");

	// Hors registre : sous /wiki (segment inconnu ou futur) on ferme par défaut,
	// partout ailleurs la page est publique (accueil, à propos, crédits…).
	if (!entry && !isWiki) return NextResponse.next();

	const cfg = await getLaunchConfig();
	const rule = entry ? resolveAccess(entry.key, cfg) : ({ mode: "admin", roleIds: [] } as const);

	if (rule.mode === "public") return NextResponse.next();

	const visitor = await visitorOf(request);
	let allowed = visitor.isAdmin;
	if (!allowed && rule.mode === "members") {
		allowed = visitor.authenticated;
	} else if (!allowed && rule.mode === "roles" && visitor.discordId) {
		const held = await getMemberRoleIds(visitor.discordId);
		allowed = held.some((r) => rule.roleIds.includes(r));
	}

	if (!allowed) {
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
