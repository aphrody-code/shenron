import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Image optimization Vercel CDN — AVIF prioritaire, WebP fallback.
	// Docs : https://nextjs.org/docs/app/api-reference/components/image#formats
	// Note : chaque format est caché séparément (storage ↑ mais latence ↓ après warm).
	images: {
		formats: ["image/avif", "image/webp"],
		// Bot expose les assets DB via /db/* (Cache-Control immutable + Vary:Accept côté bot).
		remotePatterns: [
			// API/assets du bot — hôte public actuel (shenron.rpbey.fr pointe vers
			// Vercel désormais, le bot vit sur bot.rpbey.fr).
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
			{
				protocol: "https",
				hostname: "media.kitsu.io",
				pathname: "/**",
			},
		],
		deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
		// Cache minimum après optimization Vercel
		minimumCacheTTL: 31_536_000, // 1 an (assets bot sont immutable)
		dangerouslyAllowSVG: false,
	},

	compress: true,

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
