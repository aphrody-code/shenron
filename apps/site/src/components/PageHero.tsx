import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Hero d'en-tête de page (Sagas/Films/Jeux/Episodes/News).
 *
 * Deux régimes :
 *  - **avec image** — une illustration qui parle DE la page (l'affiche du film,
 *    la bannière de la série). Cover animé (Ken Burns) + étagement d'overlays.
 *  - **sans image** (`image` omis) — hero typographique sur fond sobre. C'est
 *    le régime des index de l'encyclopédie : ils partageaient tous la même
 *    bannière promotionnelle d'un événement e-sport (`battle2026`), une image
 *    de 770 px étirée en pleine largeur, donc floue, sans rapport avec la
 *    rubrique et posée sous le titre — quatre défauts pour zéro information.
 *    Les couvertures officielles (Daizenshuu) font exactement l'inverse :
 *    fond neutre, grand titre, un seul accent.
 */
export function PageHero({
	eyebrow,
	title,
	lead,
	image,
	imageAlt,
	right,
	height = "md",
	imagePosition = "center",
}: {
	eyebrow: string;
	title: string;
	lead?: string;
	/** Omis = hero typographique (aucune image de fond). */
	image?: string;
	imageAlt?: string;
	right?: ReactNode;
	height?: "sm" | "md" | "lg";
	/** Cadrage vertical du cover (utile pour un visuel portrait recadré en bandeau). */
	imagePosition?: "center" | "top" | "bottom";
}) {
	const h = image
		? height === "sm"
			? "h-[300px]"
			: height === "lg"
				? "h-[520px]"
				: "h-[420px]"
		: // Sans image, la hauteur suit le texte : un bandeau de 420 px à moitié
			// vide n'est pas de la respiration, c'est du vide.
			"min-h-[260px] py-16";
	const objPos =
		imagePosition === "top"
			? "object-top"
			: imagePosition === "bottom"
				? "object-bottom"
				: "object-center";
	return (
		<section
			className={`relative ${h} w-full overflow-hidden border-b border-white/[0.08] ${
				image ? "vignette film-grain" : ""
			}`}
		>
			{image && (
				<>
					<Image
						src={image}
						alt={imageAlt ?? ""}
						fill
						priority
						sizes="100vw"
						className={`object-cover ${objPos} ken-burns`}
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
					{/* Lignes de vitesse — focus action façon planche Toriyama */}
					<div
						aria-hidden
						className="absolute inset-0 speed-lines opacity-[0.05] pointer-events-none"
					/>
				</>
			)}

			<div
				className={`relative mx-auto max-w-[1280px] px-6 lg:px-10 flex ${
					image ? "h-full items-end pb-14" : "items-center"
				}`}
			>
				<div className="flex-1 max-w-2xl reveal-up">
					<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-3 inline-flex items-center gap-3">
						<span aria-hidden className="w-7 h-px bg-dbz-orange/70" />
						{eyebrow}
					</p>
					<h1
						className={
							image
								? "font-saiyan font-bold uppercase text-[40px] md:text-[58px] leading-[1.02] tracking-[0.01em] title-gold mb-4"
								: // Régime typographique : serif d'affichage, casse normale,
									// blanc. Les capitales dorées d'un hero sur photo servent à
									// tenir la lisibilité par-dessus l'image ; sans image elles
									// ne font que crier.
									"font-display font-semibold text-[42px] md:text-[56px] leading-[1.05] tracking-[-0.02em] text-white mb-4 text-balance"
						}
					>
						{title}
					</h1>
					{lead && <p className="text-[17px] leading-relaxed text-white/85 max-w-xl">{lead}</p>}
				</div>
				{right && <div className="shrink-0 ml-6 hidden md:block">{right}</div>}
			</div>

			<div
				className={`absolute bottom-0 inset-x-0 h-px ${
					image
						? "bg-gradient-to-r from-transparent via-dbz-orange/50 to-transparent"
						: "bg-white/[0.08]"
				}`}
			/>
		</section>
	);
}
