import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
	experimental: {
		viewTransition: true,
	},

	// Image optimization Vercel CDN — AVIF prioritaire, WebP fallback.
	// Docs : https://nextjs.org/docs/app/api-reference/components/image#formats
	// Note : chaque format est caché séparément (storage ↑ mais latence ↓ après warm).
	images: {
		// Images wiki éditables en place via l'admin (réécriture du fichier au même
		// chemin). L'optimiseur Vercel cache l'image optimisée par URL source ; une
		// fois figée, un remplacement n'apparaissait jamais. On désactive donc
		// l'optimisation : le navigateur charge l'asset directement depuis le bot,
		// qui répond `no-cache` + ETag → revalidation 304 bon marché tant que le
		// fichier est identique, image fraîche dès qu'il change. Pas d'optim
		// AVIF/resize, mais éditabilité garantie (existant + futur, sans purge).
		unoptimized: true,
		formats: ["image/avif", "image/webp"],
		// Bot expose les assets DB via /db/* (Cache-Control immutable + Vary:Accept côté bot).
		remotePatterns: [
			// API/assets du bot — hôte public actuel (bot.dragonballfr.com). Les
			// anciens hôtes (bot.rpbey.fr / shenron.rpbey.fr) restent autorisés
			// pendant la transition de domaine pour ne pas casser les images encore
			// servies sur les anciennes URL.
			{ protocol: "https", hostname: "bot.dragonballfr.com", pathname: "/db/**" },
			{ protocol: "https", hostname: "bot.dragonballfr.com", pathname: "/assets/**" },
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
		deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
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
