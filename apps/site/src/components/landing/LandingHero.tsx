import Link from "next/link";
import { DragonBallsOrbit } from "./DragonBallsOrbit";

/**
 * Hero landing — server component, 0 JS, 0 image cover.
 * Au lieu d'un banner static (qui contient du texte "DRAGON BALL DAIMA"
 * → doublon avec notre titre), on utilise DragonBallsOrbit comme pièce
 * maîtresse + un fond purement CSS (gradient orange + halftone + speed-lines
 * + starfield), tout animé via CSS keyframes.
 * Aucun chargement d'image → LCP réduit.
 */
export function LandingHero() {
	return (
		<section className="relative min-h-[100vh] flex items-center overflow-hidden border-b border-white/[0.06]">
			{/* Fond cosmique CSS pur */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse 90% 70% at 65% 50%, rgba(255,178,0,0.35), transparent 60%), radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255,107,26,0.25), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(217,33,33,0.18), transparent 60%), #0a0a0a",
				}}
			/>
			<div className="absolute inset-0 speed-lines opacity-40 pointer-events-none hero-pulse" />
			<div className="absolute inset-0 halftone opacity-15 pointer-events-none mix-blend-overlay" />

			{/* Glow central rotatif lent — pure CSS */}
			<div
				aria-hidden
				className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none hidden lg:block hero-glow"
				style={{
					background:
						"radial-gradient(circle at 50% 50%, rgba(255,178,0,0.25), rgba(255,107,26,0.12) 40%, transparent 70%)",
					filter: "blur(40px)",
				}}
			/>

			{/* Kanji 神龍 vertical décoratif gauche */}
			<div
				aria-hidden
				className="kata-vert absolute left-6 top-1/2 -translate-y-1/2 font-jp text-[140px] leading-none text-dbz-orange/[0.07] select-none pointer-events-none hidden md:block"
			>
				神龍
			</div>

			<div className="relative mx-auto max-w-[1280px] w-full px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-12 items-center">
				<div className="z-10">
					<p className="font-display font-bold text-xs md:text-sm tracking-[0.4em] uppercase text-dbz-orange mb-6 inline-flex items-center gap-3">
						<span aria-hidden className="w-8 h-px bg-dbz-orange" />
						Communauté Dragon Ball France
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

					<div className="flex flex-wrap items-center gap-4">
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

				<div className="hidden lg:flex items-center justify-center relative z-10">
					<DragonBallsOrbit size={520} className="hero-float" />
				</div>
			</div>

			{/* Scroll cue en bas */}
			<div
				aria-hidden
				className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hero-cue"
			>
				<span className="font-display font-bold text-[10px] tracking-[0.4em] uppercase">
					Défiler
				</span>
				<div className="w-px h-10 bg-gradient-to-b from-dbz-orange/60 to-transparent" />
			</div>

			<style>{`
				@keyframes hero-glow-rot {
					from { transform: translate(0, -50%) rotate(0deg) scale(1); opacity: 0.85; }
					50%  { transform: translate(0, -50%) rotate(180deg) scale(1.08); opacity: 1; }
					to   { transform: translate(0, -50%) rotate(360deg) scale(1); opacity: 0.85; }
				}
				.hero-glow { animation: hero-glow-rot 20s ease-in-out infinite; }
				@keyframes hero-float {
					0%, 100% { transform: translateY(0); }
					50%      { transform: translateY(-12px); }
				}
				.hero-float { animation: hero-float 6s ease-in-out infinite; }
				@keyframes hero-pulse {
					0%, 100% { opacity: 0.30; transform: scale(1); }
					50%      { opacity: 0.50; transform: scale(1.05); }
				}
				.hero-pulse { animation: hero-pulse 8s ease-in-out infinite; }
				@keyframes hero-cue {
					0%, 100% { opacity: 0.4; transform: translate(-50%, 0); }
					50%      { opacity: 0.9; transform: translate(-50%, 4px); }
				}
				.hero-cue { animation: hero-cue 2.5s ease-in-out infinite; }
				@media (prefers-reduced-motion: reduce) {
					.hero-glow, .hero-float, .hero-pulse, .hero-cue { animation: none; }
				}
			`}</style>
		</section>
	);
}
