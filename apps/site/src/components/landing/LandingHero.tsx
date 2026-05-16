"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { DragonBallsOrbit } from "./DragonBallsOrbit";

const KiCanvas = dynamic(
	() => import("@/components/site/KiCanvas").then((m) => m.KiCanvas),
	{ ssr: false },
);

export function LandingHero() {
	return (
		<section className="relative min-h-[100vh] flex items-center overflow-hidden border-b border-dbz-border">
			{/* Couche WebGPU ki */}
			<KiCanvas
				className="absolute inset-0 w-full h-full"
				color={0xa855f7}
				colorAccent={0x38bdf8}
				density={1.4}
			/>

			{/* Speed-lines + halftone overlay */}
			<div className="absolute inset-0 speed-lines opacity-30 pointer-events-none" />
			<div className="absolute inset-0 halftone opacity-20 pointer-events-none mix-blend-overlay" />

			{/* Strip nébuleuse top */}
			<div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-fuchsia-500/10 to-transparent pointer-events-none" />

			<div className="relative container mx-auto px-4 py-20 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
				{/* Texte gauche */}
				<div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 z-10">
					<motion.p
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="font-scouter text-xs md:text-sm tracking-[0.5em] text-fuchsia-300 mb-4 ki-pulse"
					>
						// HUB GALACTIQUE //
					</motion.p>
					<motion.h1
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							duration: 0.7,
							type: "spring",
							bounce: 0.35,
							delay: 0.1,
						}}
						className="title-jagged text-6xl md:text-8xl lg:text-9xl leading-[0.85] mb-4"
					>
						DBFR
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.35 }}
						className="text-lg md:text-2xl font-light text-white/85 mb-2 max-w-xl"
					>
						La communauté Dragon Ball française —{" "}
						<span className="text-galactic font-semibold">six dieux</span>, un
						bot, et un wiki éclaté façon nébuleuse.
					</motion.p>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.55 }}
						className="text-sm text-white/50 mb-10 max-w-md"
					>
						Discord ↔ web sync intégrale. XP, zénis, succès, fusion. Mêmes
						règles partout.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.7 }}
						className="flex flex-wrap items-center gap-4 justify-center lg:justify-start"
					>
						<Link href="#stats" className="dbz-button !text-sm md:!text-base">
							Entrer dans l'arène
						</Link>
						<Link
							href="/api/auth/signin/social/discord"
							className="dbz-button-ghost !text-xs md:!text-sm"
						>
							Connexion Discord
						</Link>
					</motion.div>
				</div>

				{/* Dragon Balls orbite droite */}
				<motion.div
					initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
					animate={{ opacity: 1, scale: 1, rotate: 0 }}
					transition={{
						duration: 1.2,
						delay: 0.4,
						type: "spring",
						bounce: 0.2,
					}}
					className="hidden lg:block"
				>
					<DragonBallsOrbit size={520} />
				</motion.div>

				{/* Mobile: ball orbit underneath, smaller */}
				<motion.div
					initial={{ opacity: 0, scale: 0.7 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.4 }}
					className="lg:hidden flex justify-center"
				>
					<DragonBallsOrbit size={340} />
				</motion.div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.5, duration: 0.8 }}
				className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
			>
				<span className="font-scouter text-[10px] tracking-[0.4em]">
					SCROLL
				</span>
				<div className="w-px h-10 bg-gradient-to-b from-fuchsia-400/60 to-transparent scroll-pulse" />
			</motion.div>

			<style>{`
				@keyframes scroll-pulse {
					0%, 100% { opacity: 0.3; transform: scaleY(1); }
					50% { opacity: 1; transform: scaleY(1.4); }
				}
				.scroll-pulse { animation: scroll-pulse 2s ease-in-out infinite; transform-origin: top; }
			`}</style>
		</section>
	);
}
