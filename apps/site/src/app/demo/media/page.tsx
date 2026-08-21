import type { Metadata } from "next";
import { assetUrl } from "@/lib/assets";
import { AnimatedMedia } from "@/components/media/AnimatedMedia";
import { BackgroundImage, HeroBackground } from "@/components/media/BackgroundImage";
import { GifEncoderDemo } from "./GifEncoderDemo";

export const metadata: Metadata = {
	title: "Démo média",
	description:
		"Démonstration interne des composants média : AnimatedMedia (vidéo/GIF/WebP lazy + play/pause), BackgroundImage (ken-burns/parallax/fixed) et encodage frames → GIF (modern-gif).",
	robots: { index: false, follow: false },
};

// Page non listée (robots noindex) : vitrine de validation des composants média.
// Les assets sont des exemples ; remplacer par de vraies scènes/fonds DB.
const SAMPLE_BG = assetUrl("assets/banners/dbz/ext/saga-cell.jpg");
const SAMPLE_VIDEO = assetUrl("assets/scenes/sample.mp4");
const SAMPLE_POSTER = assetUrl("assets/banners/dbz/ext/saga-cell.jpg");

export default function MediaDemoPage() {
	return (
		<main className="min-h-screen bg-black text-white">
			{/* B — HeroBackground (ken-burns) */}
			<HeroBackground
				src={SAMPLE_BG}
				alt="Fond de démonstration"
				variant="kenburns"
				overlay="bottom"
				height="lg"
			>
				<p className="font-display text-xs uppercase tracking-[0.18em] text-dbz-orange">
					Composants média
				</p>
				<h1 className="mt-3 font-display text-4xl font-bold md:text-6xl">Démo média</h1>
				<p className="mt-3 max-w-xl text-white/85">
					AnimatedMedia + BackgroundImage + encodage GIF (modern-gif).
				</p>
			</HeroBackground>

			<div className="mx-auto max-w-[1100px] space-y-20 px-6 py-16">
				{/* A — AnimatedMedia */}
				<section className="reveal-up space-y-4">
					<h2 className="font-display text-2xl font-bold">
						A — AnimatedMedia (vidéo lazy + play/pause)
					</h2>
					<p className="text-white/70">
						Vidéo <code>autoplay muted loop playsinline</code> jouée seulement quand visible
						(IntersectionObserver), poster avant lecture, bouton play/pause accessible, neutralisée
						si <code>prefers-reduced-motion</code>.
					</p>
					<AnimatedMedia
						src={SAMPLE_VIDEO}
						poster={SAMPLE_POSTER}
						alt="Scène de démonstration"
						className="aspect-video w-full rounded-xl border border-white/10"
					/>
				</section>

				{/* B — variantes de BackgroundImage */}
				<section className="reveal-up space-y-4">
					<h2 className="font-display text-2xl font-bold">B — BackgroundImage (variantes)</h2>
					<div className="grid gap-6 md:grid-cols-2">
						{(["kenburns", "parallax", "fixed", "none"] as const).map((v) => (
							<div
								key={v}
								className="relative h-64 overflow-hidden rounded-xl border border-white/10"
							>
								<BackgroundImage src={SAMPLE_BG} alt="" variant={v} overlay="full" />
								<div className="relative z-10 flex h-full items-end p-4">
									<span className="font-display text-lg font-semibold">
										variant=&quot;{v}&quot;
									</span>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* A bis — encodage frames → GIF (client) */}
				<section className="reveal-up space-y-4">
					<h2 className="font-display text-2xl font-bold">Encodage frames → GIF (modern-gif)</h2>
					<p className="text-white/70">
						Génère N frames procéduraux dans un canvas puis les encode en GIF animé via{" "}
						<code>encodeFramesToGif</code> (worker inline).
					</p>
					<GifEncoderDemo />
				</section>
			</div>
		</main>
	);
}
