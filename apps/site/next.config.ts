import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Serveur de développement seulement. Sans cette liste, `next dev` répond
	// **403** à toute requête `/_next/*` portant un en-tête `Origin` — donc à une
	// partie des chunks demandés par le navigateur : la page se rend mais ne
	// s'hydrate jamais, et TOUT devient incliquable. C'est un piège coûteux quand
	// on audite justement des clics morts : le symptôme est identique à un bug
	// applicatif. Aucune incidence en production (`next start` ignore ce champ).
	allowedDevOrigins: ["127.0.0.1", "localhost", "51.255.162.6", "dragonballfr.com"],
	// Protection contre le version skew (self-hosting `next start` solo, sans le
	// skew-protection Vercel). SHA court injecté par scripts/deploy-site.sh au
	// build (`NEXT_DEPLOYMENT_ID`). Les assets portent `?dpl=<id>` et les
	// navigations un header `x-deployment-id` ; sur mismatch, Next force un reload
	// dur au lieu de throw `Failed to find Server Action` côté client périmé.
	// Undefined en dev local → ignoré. Cf. node_modules/next/dist/docs/.../self-hosting.md.
	deploymentId: process.env.NEXT_DEPLOYMENT_ID,

	// Pas de `x-powered-by: Next.js` : la version exacte du framework est une
	// info gratuite pour un scan automatisé, et elle ne sert à personne côté client.
	poweredByHeader: false,

	// Répertoire de sortie pilotable par env. Le déploiement bleu/vert
	// (scripts/ops/deploy-site.ts) bâtit dans `.next-build` pour deux raisons :
	//   1. le slot en service lit `.next` — un build en place le lui retirait ;
	//   2. repartir d'un répertoire VIDE force un build À FROID. Mesuré le
	//      2026-08-14 : à froid ~8,1 Gio de RSS, en incrémental (cache Turbopack
	//      déjà présent) ~10,5 Gio → OOM killer sur ce VPS de 11 Gio.
	// Au runtime, aucun slot ne pose la variable : `next start` lit bien `.next`.
	distDir: process.env.NEXT_DIST_DIR ?? ".next",

	// PAS de `output: "standalone"` — testé le 2026-08-14, refusé pour cause de
	// mémoire : le file tracing (nft) sur ce monorepo fait passer le build de
	// ~8,1 à ~10,4 Gio de RSS et le fait tuer par l'OOM killer sur ce VPS (11 Gio).
	// Les versions figées du déploiement bleu/vert (scripts/ops/deploy-site.ts)
	// n'en ont pas besoin : elles copient `.next` et lient `node_modules` au
	// dépôt, ce qui suffit à isoler le process qui sert d'un build en cours.

	// View Transitions API (React `<ViewTransition>`) — morph d'élément partagé
	// grille→fiche, slides directionnels. Sans support navigateur, navigation
	// normale sans animation (progressive enhancement). Cf. components/ViewTransition.tsx.
	//
	// Plus de drapeau `experimental.viewTransition` depuis Next 16.4-canary : la
	// clé a disparu de `ExperimentalConfig` (le type-check la refuse) parce que
	// la fonctionnalité est stabilisée — l'App Router de Next 16 tourne sur la
	// canary de React, qui expose `<ViewTransition>` sans rien à activer.
	experimental: {

		// Parallélisme de la génération statique — soupape mémoire du build.
		//
		// Le build réclame ~10,5 Gio de mémoire anonyme sur une machine de 11 Gio
		// (cf. `scripts/ops/deploy-site.ts`) : il n'est vivable que parce que le
		// noyau évacue vers le swap, et il meurt en OOM dès que la marge se réduit
		// — trois fois en août 2026, une fois le 2026-08-23.
		//
		// Ce pic vient d'abord du parallélisme : Next rend les ~850 pages avec
		// `cpus` workers traitant chacun `staticGenerationMaxConcurrency` pages de
		// front (4 × 8 = 32 pages en vol par défaut), et chaque page en cours
		// retient son heap. Diviser le parallélisme réduit le pic, au prix d'un
		// build plus long.
		//
		// Les deux réglages restent au défaut de Next tant qu'ils ne sont pas
		// mesurés : ils ne s'activent que si l'environnement les fournit, ce qui
		// donne une soupape actionnable sans changer le comportement à l'aveugle.
		//
		//   BUILD_CPUS=2 BUILD_STATIC_CONCURRENCY=4 bash scripts/deploy-site.sh
		//
		// `memoryBasedWorkersCount` n'est PAS utilisé : il impose un plancher de
		// 4 workers (`Math.max(…, 4)` dans le code de Next), donc il ne peut pas
		// descendre là où on en a besoin.
		...(process.env.BUILD_CPUS ? { cpus: Number(process.env.BUILD_CPUS) } : {}),
		...(process.env.BUILD_STATIC_CONCURRENCY
			? { staticGenerationMaxConcurrency: Number(process.env.BUILD_STATIC_CONCURRENCY) }
			: {}),
	},

	// Image optimization Vercel CDN — AVIF prioritaire, WebP fallback.
	// Docs : https://nextjs.org/docs/app/api-reference/components/image#formats
	// Note : chaque format est caché séparément (storage ↑ mais latence ↓ après warm).
	images: {
		// Optimisation RÉTABLIE (elle était coupée globalement). Le motif d'origine
		// — sur Vercel, une image remplacée depuis l'admin restait figée à jamais —
		// ne s'applique plus depuis l'auto-hébergement : l'optimiseur local expire
		// son cache disque selon le `Cache-Control` de la source. Et les seules
		// images réellement remplaçables en place (`assets/wiki/**`) sont exclues
		// une par une, cf. `lib/images.ts` + `isEditableAsset`.
		//
		// L'enjeu : une vignette d'épisode passe de ~60 Kio (JPEG source) à ~15 Kio
		// (AVIF à la largeur rendue), soit −73 % ; les pages de liste en portent
		// jusqu'à 85.
		formats: ["image/avif", "image/webp"],
		// Requis depuis Next 16 : sans liste blanche, n'importe qui peut faire
		// recalculer l'image à toutes les qualités. Une seule valeur suffit ici.
		qualities: [70],
		// Plancher du cache disque (`.next/cache/images`). Le TTL réel est le
		// MAXIMUM de cette valeur et du `max-age` de la source : 1 jour pour
		// `/assets/**`, un an pour `/db/**` (immuable). Le déploiement bleu/vert
		// conserve ce cache d'une version à l'autre (cf. scripts/ops/deploy-site.ts) :
		// sans ça, chaque mise en ligne repartait d'un cache froid et refaisait
		// toutes les transformations sur un VPS déjà juste en mémoire.
		minimumCacheTTL: 3600,
		// Vignettes de grille : le site n'a pas de rendu au-delà de ~640 px de large
		// pour une carte. Restreindre la liste évite de faire calculer — et stocker —
		// des variantes que personne ne demande.
		imageSizes: [64, 96, 128, 192, 256, 384],
		deviceSizes: [640, 828, 1080, 1200, 1920],
		// Bot expose les assets DB via /db/* (Cache-Control immutable + Vary:Accept côté bot).
		remotePatterns: [
			// API/assets du bot — hôte public actuel (bot.dragonballfr.com). Les
			// anciens hôtes (bot.rpbey.fr / shenron.rpbey.fr) restent autorisés
			// pendant la transition de domaine pour ne pas casser les images encore
			// servies sur les anciennes URL.
			{ protocol: "https", hostname: "bot.dragonballfr.com", pathname: "/db/**" },
			{ protocol: "https", hostname: "bot.dragonballfr.com", pathname: "/assets/**" },
			// Planches « Full Color » : l'URL est stable ici, mais répond un 302 vers
			// le CDN Discord, dont la signature ne vit que 24 h. C'est justement ce
			// que l'optimiseur doit viser — il suit la redirection et met en cache
			// les OCTETS, qui eux ne changent pas.
			{
				protocol: "https",
				hostname: "bot.dragonballfr.com",
				pathname: "/api/public/manga/couleur/**",
			},
			{ protocol: "https", hostname: "bot.rpbey.fr", pathname: "/db/**" },
			{ protocol: "https", hostname: "bot.rpbey.fr", pathname: "/assets/**" },
			{
				protocol: "https",
				hostname: "shenron.rpbey.fr",
				pathname: "/db/**",
			},
			{
				protocol: "https",
				hostname: "shenron.rpbey.fr",
				pathname: "/assets/**",
			},
			// Posters films (MyAnimeList), news officielles (DB Official).
			{ protocol: "https", hostname: "myanimelist.net", pathname: "/**" },
			{
				protocol: "https",
				hostname: "fr.dragon-ball-official.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "www.dragon-ball-official.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "media.discordapp.net",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "s4.anilist.co",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn.myanimelist.net",
				pathname: "/**",
			},
			// Stills d'épisodes (TMDB).
			{ protocol: "https", hostname: "image.tmdb.org", pathname: "/**" },
			{
				protocol: "https",
				hostname: "media.kitsu.io",
				pathname: "/**",
			},
		],
		dangerouslyAllowSVG: false,
	},

	compress: true,

	// Dédoublonnage des anciennes routes films (id-based, API) vers la source
	// canonique /wiki/films (Neon, slug-based). Redirect au niveau routing → 308
	// dur avant tout rendu (un redirect() en composant dégradait en navigation
	// client 200 à cause du layout /wiki force-dynamic qui flush en streaming).
	async redirects() {
		return [
			// Ancienne vue série épisodes par query (`?series=X`) → route dédiée
			// STATIQUE `/wiki/episodes/serie/X` (la landing est passée statique pour
			// débloquer l'interception @modal + le cache CDN). Capture la valeur du
			// query dans `:series`. `page`/`view` obsolètes (grille complète).
			{
				source: "/wiki/episodes",
				has: [{ type: "query", key: "series", value: "(?<series>[^&]+)" }],
				destination: "/wiki/episodes/serie/:series",
				permanent: true,
			},
			{ source: "/wiki/dragon-ball/movies", destination: "/wiki/films", permanent: true },
			{ source: "/wiki/dragon-ball/movie/:id", destination: "/wiki/films", permanent: true },
			// Ancien index « Encyclopédie » fourre-tout → page Personnages dédiée.
			// 308 dur au routing (un permanentRedirect() en composant dégradait en
			// page 200 + <meta refresh>, cf. layout /wiki en streaming). Les routes
			// détail enfants (/wiki/dragon-ball/character|planet|techniques/…) ne
			// sont PAS capturées : la source est le chemin exact, sans wildcard.
			{ source: "/wiki/dragon-ball", destination: "/wiki/personnages", permanent: true },
			{ source: "/profil", destination: "/profil/me", permanent: true },
			// Journal : la fiche article vivait sous /post/:slug alors que l'index et
			// le fil d'Ariane pointaient déjà /actualites — deux chemins pour une même
			// ressource, donc du contenu dupliqué aux yeux de Google. Tout est
			// désormais canonique sous /actualites/:slug ; les anciens liens (et les
			// URL déjà indexées ou partagées) sont récupérés en 308 au routing.
			{ source: "/post/:slug", destination: "/actualites/:slug", permanent: true },
			// `/admin/command-perms` était un DOUBLON mort de `/admin/commands` : il
			// lisait `{ rows: [...] }` là où l'API du bot répond `{ rules: [...] }`,
			// donc `data.rows.length` levait un TypeError et la page rendait un 500 à
			// chaque ouverture depuis la sidebar. Son modèle (`command`/`scope`/`allow`)
			// ne correspondait à rien en base — la table `command_permissions` porte
			// `name` + `enabled` + trois listes d'IDs — et ses écritures partaient donc
			// aussi en 400. `/admin/commands` implémente déjà ce vrai modèle (sélecteurs
			// de rôles, commandes groupées) : la page fautive est supprimée et l'URL
			// déjà mise en favori atterrit sur celle qui fonctionne.
			{ source: "/admin/command-perms", destination: "/admin/commands", permanent: true },
			// Deux routes rendaient la MÊME fiche de jeu — `/wiki/jeux/:slug` (notes
			// communautaires, galerie, JSON-LD, fil d'Ariane) et
			// `/wiki/dragon-ball/games/:slug`, une version plus pauvre issue d'un
			// premier découpage. Plus aucun lien du site ne menait à la seconde, mais
			// elle restait générée statiquement et indexable : du contenu dupliqué
			// pour chacun des 58 jeux. La route a été supprimée, les URL déjà
			// partagées ou indexées atterrissent sur la fiche canonique.
			{
				source: "/wiki/dragon-ball/games/:slug",
				destination: "/wiki/jeux/:slug",
				permanent: true,
			},
			{ source: "/wiki/dragon-ball/games", destination: "/wiki/jeux", permanent: true },
			// Même histoire pour le journal : `/wiki/news` doublait `/actualites`
			// (même titre, même contenu), était déjà passé en `noindex` faute de
			// mieux et n'avait plus aucun lien entrant.
			{ source: "/wiki/news", destination: "/actualites", permanent: true },
			// Rapatriement des fiches sous le segment de leur propre index. Le site
			// mélangeait deux conventions : l'index en français à la racine
			// (`/wiki/personnages`, `/wiki/planetes`) et la fiche en anglais sous un
			// préfixe (`/wiki/dragon-ball/character/12`, `/wiki/dragon-ball/planet/3`),
			// pendant que les rubriques voisines — races, arcs, sagas, films — vivaient
			// toutes sous un segment unique. Les techniques cumulaient : leur INDEX
			// lui-même était sous `/wiki/dragon-ball/`. Tout est désormais sous
			// `/wiki/<rubrique>[/<clé>]`, et ces 308 récupèrent l'existant.
			{
				source: "/wiki/dragon-ball/character/:id",
				destination: "/wiki/personnages/:id",
				permanent: true,
			},
			// Pointe DIRECTEMENT sur la cosmologie : passer par `/wiki/planetes/:id`
			// enchaînerait deux 308 pour un même clic.
			{
				source: "/wiki/dragon-ball/planet/:id",
				destination: "/wiki/cosmologie/:id",
				permanent: true,
			},
			// La rubrique « Planètes » est devenue « Cosmologie » : `db_planets`
			// héberge aussi des dimensions (l'Autre Monde, le Noyau du Monde), des
			// demeures divines (temple du Roi de Tout, Planète sacrée) et des univers
			// entiers — une entrée sur huit n'est pas une planète. L'ancien
			// `/wiki/planetes` n'était de toute façon qu'un `redirect()` de composant
			// vers `/wiki/personnages?tab=planetes`, qui dégradait en 200 +
			// `<meta refresh>` sous le layout `/wiki` (piège du streaming).
			{ source: "/wiki/planetes/:id", destination: "/wiki/cosmologie/:id", permanent: true },
			{ source: "/wiki/planetes", destination: "/wiki/cosmologie", permanent: true },
			{
				source: "/wiki/dragon-ball/techniques/:slug",
				destination: "/wiki/techniques/:slug",
				permanent: true,
			},
			{ source: "/wiki/dragon-ball/techniques", destination: "/wiki/techniques", permanent: true },
		];
	},

	async rewrites() {
		const botHost = process.env.NEXT_PUBLIC_SHENRON_API_URL || "https://bot.dragonballfr.com";
		// `fallback` (et NON un tableau = `afterFiles`) : ce rewrite ne sert que les
		// MÉDIAS wiki (`/wiki/<asset>.mp4|webp…`) proxifiés vers le bot. En
		// `afterFiles`, il préemptait les routes dynamiques (`/wiki/films/[slug]`,
		// `/wiki/sagas/[slug]`…) sous `next start` → fiches 403 (le bot renvoyait
		// « Extension non autorisée »). En `fallback`, il ne se déclenche que si
		// AUCUNE page (statique ou dynamique) ne matche → les fiches restent à Next.
		return {
			fallback: [
				{
					source: "/wiki/:path*",
					destination: `${botHost}/assets/wiki/:path*`,
				},
			],
		};
	},

	async headers() {
		return [
			{
				source: "/_next/static/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					// CSP volontairement RÉDUITE aux directives qui ne peuvent rien
					// casser ici. Pas de `script-src` / `frame-src` : la page charge
					// GTM + AdSense (scripts tiers injectés dynamiquement) et embarque
					// les lecteurs vidéo des hébergeurs (vidmoly, mail.ru, yourupload…)
					// dont la liste bouge — une allowlist figée couperait la lecture.
					// Ce qui reste couvre les vecteurs réels :
					//   object-src   → plus de <embed>/<object> Flash-like injectés
					//   base-uri     → interdit de réécrire la base des URL relatives
					//   form-action  → un <form> injecté ne peut pas exfiltrer ailleurs
					//   frame-ancestors → clickjacking (doublon moderne de X-Frame-Options)
					{
						key: "Content-Security-Policy",
						value:
							"object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
					},
					// Aucune de ces API n'est utilisée par le site : les refuser évite
					// qu'un script tiers (régie pub) puisse les demander en notre nom.
					{
						key: "Permissions-Policy",
						value:
							"camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=(), payment=(), usb=()",
					},
					// L'auth Discord passe par une fenêtre OAuth → `allow-popups`, pas
					// `same-origin` strict (qui casserait le retour de callback).
					{ key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
					{ key: "X-DNS-Prefetch-Control", value: "on" },
				],
			},
			{
				// Le manifeste PWA est servi cross-origin par certains navigateurs
				// (installation) et change rarement.
				source: "/manifest.webmanifest",
				headers: [
					{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
					{ key: "Content-Type", value: "application/manifest+json; charset=utf-8" },
				],
			},
		];
	},
};

// Analyse de bundle à la demande : `ANALYZE=1 bun --filter @shenron/site build`
// écrit .next/analyze/{client,nodejs,edge}.html. Hors de ce cas, l'enveloppe est
// l'identité — aucun coût, aucune dépendance chargée sur un build de production.
// Le socle JS partagé du site (~237 Kio) se lit là, pas dans le résumé de build.
export default process.env.ANALYZE === "1"
	? withBundleAnalyzer({ enabled: true, openAnalyzer: false })(nextConfig)
	: nextConfig;
