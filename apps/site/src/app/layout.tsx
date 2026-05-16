import type { Metadata } from "next";
import localFont from "next/font/local";
import { Oswald, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { DiscordInviteFAB } from "@/components/DiscordInviteFAB";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

// Google Sans Flex — police corps officielle Google, publiée sur Google Fonts
// (fonts.google.com/specimen/Google+Sans+Flex). Servie en local (TTF v20 de
// fonts.gstatic.com) car next/font/google n'a pas encore Google Sans Flex
// dans son registry. Variable font avec axes wght+wdth+ital.
const sansFlex = localFont({
	src: "../../public/fonts/google-sans-flex.ttf",
	variable: "--font-sans",
	display: "swap",
	weight: "100 900", // variable axes
});

// Oswald — police signature du site Dragon Ball officiel (nav + titres)
const oswald = Oswald({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

// Noto Sans JP — utilisé sur le site DB officiel pour le corps
const notoJP = Noto_Sans_JP({
	variable: "--font-jp",
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	display: "swap",
});

const saiyanSans = localFont({
	src: "../../public/fonts/SaiyanSans.ttf",
	variable: "--font-saiyan",
	display: "swap",
});

const dbScouter = localFont({
	src: "../../public/fonts/DBSScouter.ttf",
	variable: "--font-scouter",
	display: "swap",
});

export const metadata: Metadata = {
	title: "DBFR - Dragon Ball FR",
	description: "Le Hub Communautaire Dragon Ball Z Numéro 1",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" className="dark">
			<body
				className={`${sansFlex.variable} ${oswald.variable} ${notoJP.variable} ${saiyanSans.variable} ${dbScouter.variable} antialiased min-h-screen relative flex flex-col font-sans bg-dbz-bg text-white`}
			>
				{/* Starfield drift cosmique — fixe en arrière-plan */}
				<div
					className="fixed inset-0 z-[-1] pointer-events-none starfield starfield-anim opacity-70"
					aria-hidden
				/>
				{/* Nébuleuse violet+cyan additive */}
				<div
					className="fixed inset-0 z-[-1] pointer-events-none opacity-50"
					style={{
						background:
							"radial-gradient(ellipse 60% 40% at 20% 10%, rgba(255,107,26,0.22), transparent 60%), radial-gradient(ellipse 55% 35% at 80% 90%, rgba(75,168,255,0.18), transparent 60%), radial-gradient(ellipse 40% 30% at 90% 30%, rgba(217,33,33,0.10), transparent 60%)",
					}}
					aria-hidden
				/>
				<SiteNav />
				<main className="relative z-10 flex-1 w-full flex flex-col">
					{children}
				</main>
				<SiteFooter />
				<DiscordInviteFAB />
			</body>
		</html>
	);
}
