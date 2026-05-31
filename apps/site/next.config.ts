import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
			{ source: "/wiki/dragon-ball/movies", destination: "/wiki/films", permanent: true },
			{ source: "/wiki/dragon-ball/movie/:id", destination: "/wiki/films", permanent: true },
		];
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
				],
			},
		];
	},
};

export default nextConfig;
