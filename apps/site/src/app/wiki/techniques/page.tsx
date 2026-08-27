import { getShenronTechniques } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import type { Metadata } from "next";

export const revalidate = 3600;

/**
 * Libellés des types de technique. Les valeurs en base (`super`, `ultimate`,
 * `evasive`, `awoken`) sont les **slots de compétence de Xenoverse 2**, pas des
 * catégories de l'œuvre : les afficher brutes donnait des titres de section
 * « AWOKEN » en capitales sur un wiki francophone. On les traduit, et la note
 * de provenance dit d'où vient ce classement plutôt que de le faire passer pour
 * canonique.
 */
const LIBELLES_TYPE: Record<string, string> = {
	super: "Attaques spéciales",
	ultimate: "Attaques ultimes",
	evasive: "Esquives et déplacements",
	awoken: "Éveils et transformations",
	Autre: "Non classées",
};
const libelleType = (t: string) => LIBELLES_TYPE[t] ?? LIBELLES_TYPE[t.toLowerCase()] ?? t;

export const metadata: Metadata = {
	title: "Techniques Dragon Ball",
	description:
		"Catalogue des techniques et capacités de l'univers Dragon Ball : Kamehameha, Genkidama, Final Flash et plus.",
	alternates: { canonical: "/wiki/techniques" },
};

export default async function TechniquesPage() {
	const techniques = await getShenronTechniques();

	// Grouper par type
	const byType = techniques.reduce<Record<string, typeof techniques>>((acc, t) => {
		const key = t.type ?? "Autre";
		if (!acc[key]) acc[key] = [];
		acc[key].push(t);
		return acc;
	}, {});
	const typeOrder = Object.keys(byType).sort((a, b) =>
		a === "Autre" ? 1 : b === "Autre" ? -1 : a.localeCompare(b)
	);

	return (
		<div>
			<PageHero
				eyebrow="Encyclopédie"
				title="Techniques & Capacités"
				lead={`${techniques.length} techniques répertoriées — Kamehameha, Genkidama, Final Flash et les attaques les plus dévastatrices de l'univers Dragon Ball.`}
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24 space-y-20">
				<Breadcrumbs items={[{ label: "Techniques" }]} />
				<div>
					<div className="flex items-center gap-4">
						<Link
							href="/wiki/personnages"
							className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest link-underline"
						>
							<span>← Encyclopédie</span>
						</Link>
						<div className="h-px flex-1 bg-dbz-border" />
						<span className="scouter-text text-dbz-orange text-xs">
							{techniques.length} TECHNIQUES
						</span>
					</div>
					<p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-white/45">
						Le classement par type reprend les catégories de compétence des jeux{" "}
						<em>Dragon Ball Xenoverse</em>, d'où proviennent la plupart de ces entrées. Il
						ne correspond pas à un découpage du manga ou des databooks. Les vignettes
						montrent un personnage qui pratique la technique dans le jeu — c'est une
						illustration, pas une attribution.
					</p>
				</div>

				{typeOrder.map((type) => (
					<section key={type} className="reveal-up">
						<div className="flex items-center gap-6 mb-8">
							<h2 className="font-display text-[26px] font-semibold tracking-tight text-white">
								{libelleType(type)}
							</h2>
							<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/40 to-transparent" />
							<span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
								{byType[type].length}
							</span>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{byType[type].map((tech) => (
								<Link
									key={tech.id}
									href={`/wiki/techniques/${tech.slug}`}
									className="group dbz-panel p-5 flex gap-4 hover:border-dbz-blue-light transition-all"
								>
									{/* Illustration : d'abord celle de la technique (portrait du
									    pratiquant, catalogue Xenoverse 2 — 594 fiches sur 825), à
									    défaut le portrait du créateur quand un databook l'établit
									    (11 fiches). Aucun carré de repli : une vignette vide répétée
									    sur toute la grille n'informe de rien et double la hauteur de
									    lecture. */}
									{(tech.image ?? tech.creatorImage) && (
										<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
											<Image
												src={assetUrl((tech.image ?? tech.creatorImage) as string)}
												alt=""
												fill
												sizes="64px"
												className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
											/>
										</div>
									)}
									<div className="min-w-0 flex-1">
										<h3 className="font-display font-bold text-[16px] text-white group-hover:text-dbz-blue-light transition-colors leading-snug">
											{tech.name}
										</h3>
										{tech.creatorName && (
											<p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-dbz-orange/70">
												{tech.creatorName}
											</p>
										)}
										{tech.description && (
											<p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-2 font-sans">
												{tech.description}
											</p>
										)}
									</div>
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
