import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ConsentGate } from "@/components/ConsentGate";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { SITE_URL } from "@/lib/config";
import { env } from "@/lib/env";
import Script from "next/script";

// FAB Discord lazy : composant client gated par localStorage, jamais critical.
const DiscordInviteFAB = dynamic(() =>
	import("@/components/DiscordInviteFAB").then((m) => m.DiscordInviteFAB),
);

// Google Sans Flex — police officielle Google, open-source 2025 (variable font,
// axes opsz 6→144 + wght 1→1000). Servie en local depuis le woff2 v20 de
// fonts.gstatic.com (next/font/google ne l'a pas encore dans son registry).
// Sert à la fois de corps (--font-sans) ET de police d'affichage (--font-display,
// mappé dans globals.css) : hiérarchie pilotée par le poids, façon design Google.
const sansFlex = localFont({
	src: "../../public/fonts/google-sans-flex.woff2",
	variable: "--font-sans",
	display: "swap",
	weight: "1 1000", // axe wght variable
	// Best practices next/font : préchargé (défaut), fallback à métriques
	// ajustées (`size-adjust` auto sur Arial) → zéro layout shift au swap.
	fallback: ["system-ui", "arial"],
	adjustFontFallback: "Arial",
});

// Noto Sans JP — corps japonais (noms natifs 孫悟空…). Pas de preload : chargé
// seulement quand du texte JP est présent, pour ne pas peser sur le LCP latin.
const notoJP = Noto_Sans_JP({
	variable: "--font-jp",
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	display: "swap",
	preload: false,
});

// SaiyanSans + DBSScouter ne sont plus chargées : les tokens `font-saiyan` et
// `font-scouter` sont remappés sur Google Sans Flex (globals.css) pour la
// lisibilité — DBSScouter rendait des glyphes aliens illisibles. Aucun
// composant ne charge donc ces .ttf décoratifs.

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),

	title: {
		default: "DBFR — Dragon Ball France",
		template: "%s — DBFR",
	},
	description:
		"Un voyage à travers l'univers Dragon Ball en français : personnages, sagas, planètes, films, jeux et actualités anime + manga.",
	manifest: "/manifest.webmanifest",
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
			{ url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
			{ url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
			{ url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
		],
		apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
		shortcut: "/favicon.ico",
	},
	openGraph: {
		type: "website",
		locale: "fr_FR",
		siteName: "DBFR",
		// Image OG par défaut = `app/opengraph-image.tsx` (carte de marque 1200×630,
		// générée à la volée), héritée par toutes les routes sans image propre.
	},
	twitter: {
		card: "summary_large_image",
	},
	verification: {
		google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-token",
	},
	other: {
		"google-adsense-account": env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-XXXXXXXXXX",
	},
};

export const viewport = {
	themeColor: "#0a0a0a",
	colorScheme: "dark" as const,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const gtmId = env.NEXT_PUBLIC_GTM_ID || "GTM-KLSS5787";
	const gaId = env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

	return (
		<html lang="fr" className="dark">
			{/* Google Tag Manager — injecté via le composant officiel @next/third-parties */}
			<GoogleTagManager gtmId={gtmId} />
			{/* Google Analytics GA4 — injecté de manière optimisée via le composant officiel */}
			<GoogleAnalytics gaId={gaId} />
			{/* Google AdSense Script */}
			{env.NEXT_PUBLIC_ADSENSE_CLIENT && (
				<Script
					async
					src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
					crossOrigin="anonymous"
					strategy="afterInteractive"
				/>
			)}
			<body
				className={`${sansFlex.variable} ${notoJP.variable} antialiased min-h-screen relative flex flex-col font-sans bg-dbz-bg text-white`}
			>
				{/* GTM noscript — fallback sans JS, juste après l'ouverture de <body>. */}
				<noscript>
					<iframe
						src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
						title="Google Tag Manager"
					/>
				</noscript>
				{/* Progress bar scroll natif (animation-timeline: scroll(root)) */}
				<div className="scroll-progress" aria-hidden />
				{/* Starfield drift cosmique — fixe en arrière-plan, pure CSS */}
				<div
					className="fixed inset-0 z-[-1] pointer-events-none starfield starfield-anim opacity-50"
					aria-hidden
				/>
				<SiteNav />
				<main className="relative z-10 flex-1 w-full flex flex-col">
					{children}
				</main>
				<SiteFooter />
				<DiscordInviteFAB />
				<FloatingAssistant />
				<ConsentGate />
				<Toaster
					theme="dark"
					position="bottom-right"
					closeButton
					toastOptions={{
						classNames: {
							toast:
								"!bg-dbz-card !border-dbz-border !text-white !font-display",
						},
					}}
				/>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
