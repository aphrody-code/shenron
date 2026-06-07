import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Hero d'en-tête de page (Sagas/Films/Jeux/Episodes/News).
 * Image officielle DB en cover animée (Ken Burns) + overlays cinéma
 * (vignette, grain, aurora) + contenu superposé. Pur CSS, LCP préservé
 * (next/image priority conservé, l'animation porte sur le transform).
 */
export function PageHero({
	eyebrow,
	title,
	lead,
	image,
	imageAlt,
	right,
	height = "md",
}: {
	eyebrow: string;
	title: string;
	lead?: string;
	image: string;
	imageAlt: string;
	right?: ReactNode;
	height?: "sm" | "md" | "lg";
}) {
	const h = height === "sm" ? "h-[300px]" : height === "lg" ? "h-[520px]" : "h-[420px]";
	return (
		<section
			className={`relative ${h} w-full overflow-hidden border-b border-white/[0.08] vignette film-grain`}
		>
			<Image
				src={image}
				alt={imageAlt}
				fill
				priority
				sizes="100vw"
				className="object-cover object-center ken-burns"
			/>
			{/* Étagement des dégradés : verticale (lisibilité texte) + horizontale + halo bas */}
			<div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/25" />
			<div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/45" />
			{/* Nappe d'énergie ki en haut, discrète */}
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-1/2 aurora opacity-40 pointer-events-none"
			/>
			{/* Trame demi-teinte façon planche manga */}
			<div className="absolute inset-0 halftone opacity-[0.07] mix-blend-overlay pointer-events-none" />

			<div className="relative h-full mx-auto max-w-[1280px] px-6 lg:px-10 flex items-end pb-14">
				<div className="flex-1 max-w-2xl reveal-up">
					<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-3 inline-flex items-center gap-3">
						<span aria-hidden className="w-7 h-px bg-dbz-orange/70" />
						{eyebrow}
					</p>
					<h1 className="font-display font-bold text-[42px] md:text-[60px] leading-[1.02] tracking-[-0.015em] text-white mb-4 drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
						{title}
					</h1>
					{lead && <p className="text-[17px] leading-relaxed text-white/85 max-w-xl">{lead}</p>}
				</div>
				{right && <div className="shrink-0 ml-6 hidden md:block">{right}</div>}
			</div>

			<div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-dbz-orange/50 to-transparent" />
		</section>
	);
}
