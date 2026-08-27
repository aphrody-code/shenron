import { getShenronTechniques } from "@/lib/shenron";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { TechniqueGrid } from "@/components/wiki/TechniqueGrid";
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

export const metadata: Metadata = {
	title: "Techniques Dragon Ball",
	description:
		"Catalogue des techniques et capacités de l'univers Dragon Ball : Kamehameha, Genkidama, Final Flash et plus.",
	alternates: { canonical: "/wiki/techniques" },
};

export default async function TechniquesPage() {
	const techniques = await getShenronTechniques();

	// Charge allégée : on n'envoie au client que ce que la carte affiche, et la
	// description tronquée à ce qui tient dans deux lignes. La page rendait les
	// 825 fiches entières — 2,4 Mo de HTML mesurés en production, pour 60 cartes
	// visibles. Le reste voyageait pour rien, deux fois (DOM + charge RSC).
	const cartes = techniques.map((t) => ({
		id: t.id,
		slug: t.slug,
		name: t.name,
		type: t.type,
		image: t.image ?? t.creatorImage ?? null,
		creatorName: t.creatorName,
		description: t.description ? tronquer(t.description, 160) : null,
	}));

	return (
		<div>
			<PageHero
				eyebrow="Encyclopédie"
				title="Techniques & Capacités"
				lead={`${techniques.length} techniques répertoriées — Kamehameha, Genkidama, Final Flash et les attaques les plus dévastatrices de l'univers Dragon Ball.`}
			/>

			<div className="mx-auto max-w-[1400px] space-y-10 px-6 py-14 lg:px-10 lg:py-20">
				<Breadcrumbs items={[{ label: "Techniques" }]} />
				<p className="max-w-2xl text-[13px] leading-relaxed text-white/45">
					Le classement par type reprend les catégories de compétence des jeux{" "}
					<em>Dragon Ball Xenoverse</em>, d'où proviennent la plupart de ces entrées. Il ne
					correspond pas à un découpage du manga ou des databooks. Les vignettes montrent un
					personnage qui pratique la technique dans le jeu — c'est une illustration, pas une
					attribution.
				</p>
				<TechniqueGrid techniques={cartes} libelles={LIBELLES_TYPE} />
			</div>
		</div>
	);
}

/** Coupe sur un mot entier — une phrase tranchée en plein milieu se remarque. */
function tronquer(texte: string, max: number): string {
	const t = texte.trim();
	if (t.length <= max) return t;
	const coupe = t.slice(0, max);
	const espace = coupe.lastIndexOf(" ");
	return `${(espace > max * 0.6 ? coupe.slice(0, espace) : coupe).trimEnd()}…`;
}
