import Link from "next/link";
import Image from "next/image";
import { DragonBallsOrbit } from "./DragonBallsOrbit";

/**
 * Hero landing — server component, zero JS init.
 * Image static AVIF en cover (servie par bot CDN), overlays CSS,
 * DragonBallsOrbit isolé (lazy import dans son propre composant client).
 *
 * Lighthouse: -71s TBT vs version WebGPU précédente.
 */
export function LandingHero() {
	return (
		<section className="relative min-h-[100vh] flex items-center overflow-hidden border-b border-white/[0.06]">
			{/* Hero image officielle DB (DAIMA HP Header 1920x595 — AVIF 107 KB) */}
			<Image
				src="https://shenron.rpbey.fr/db/toei/189-DB-DAIMA-HP-Header-1920x595.png"
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover object-center opacity-55"
			/>

			{/* Gradient overlays — pure CSS, 0 JS */}
			<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 pointer-events-none" />
			<div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent pointer-events-none" />

			{/* Speed-lines manga FX en CSS (déjà dans globals.css) */}
			<div className="absolute inset-0 speed-lines opacity-25 pointer-events-none" />

			{/* Kanji 神龍 vertical décoratif */}
			<div
				aria-hidden
				className="kata-vert absolute left-6 top-1/2 -translate-y-1/2 font-jp text-[120px] leading-none text-dbz-orange/10 select-none pointer-events-none hidden md:block"
			>
				神龍
			</div>

			<div className="relative container mx-auto px-4 py-20 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
				<div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 z-10">
					<p className="font-display font-bold text-xs md:text-sm tracking-[0.4em] uppercase text-dbz-orange mb-6 inline-flex items-center gap-3">
						<span aria-hidden className="w-8 h-px bg-dbz-orange" />
						Communauté Dragon Ball France
						<span aria-hidden className="w-8 h-px bg-dbz-orange" />
					</p>
					<h1 className="font-display font-bold text-7xl md:text-8xl lg:text-9xl leading-[0.85] mb-6 text-white tracking-tight">
						<span className="text-white">DB</span>
						<span className="text-dbz-orange">FR</span>
					</h1>
					<p className="text-lg md:text-2xl font-normal text-white/90 mb-3 max-w-xl">
						Le portail Dragon Ball en français. Wiki, personnages,
						<span className="text-dbz-orange font-semibold"> sagas</span>,
						actualités anime &amp; manga.
					</p>
					<p className="text-sm text-white/60 mb-10 max-w-md">
						Et une communauté Discord vivante pour partager théories, news et
						fan-arts.
					</p>

					<div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
						<Link
							href="/wiki/dragon-ball"
							className="inline-flex items-center h-12 px-7 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[14px] tracking-[0.10em] uppercase transition-colors"
						>
							Explorer le wiki
						</Link>
						<Link
							href="/actualites"
							className="inline-flex items-center h-12 px-7 rounded-full border-2 border-white/30 hover:border-dbz-orange text-white font-display font-semibold text-[13px] tracking-[0.10em] uppercase transition-colors"
						>
							Actualités
						</Link>
					</div>
				</div>

				<div className="hidden lg:block">
					<DragonBallsOrbit size={420} />
				</div>
			</div>
		</section>
	);
}
