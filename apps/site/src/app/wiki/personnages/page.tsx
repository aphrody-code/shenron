import { Breadcrumbs } from "@/components/Breadcrumbs";
// SPDX-License-Identifier: Apache-2.0

import { getShenronCharacterCards } from "@/lib/shenron";
import { dbUniverse } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { UniverseTabs } from "@/components/wiki/UniverseTabs";
import type { Metadata } from "next";
import { getLaunchConfig } from "@/lib/wiki-launch-config";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Personnages Dragon Ball",
	description:
		"Tous les personnages canon de l'univers Dragon Ball. Fiches descriptives, ki, noms japonais, races, statuts et caractéristiques.",
	alternates: { canonical: "/wiki/personnages" },
};

export default async function PersonnagesPage() {
	// `access` : instantané de la configuration de lancement, résolu ICI (serveur)
	// et passé aux grilles client, qui ne peuvent pas le lire elles-mêmes. Sans lui,
	// chaque vignette liait une fiche fermée → 307 vers `/wiki-bientot`.
	const [characters, counts, facets, access] = await Promise.all([
		getShenronCharacterCards(),
		dbUniverse.counts(),
		dbUniverse.characterFacets(),
		getLaunchConfig().catch(() => null),
	]);

	return (
		<>
			<PageHero
				eyebrow="Encyclopédie"
				title="Personnages"
				lead={`${characters.length} fiches, des héros du récit aux figures d'un seul chapitre.`}
			/>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-16 reveal-up">
				<Breadcrumbs className="mb-8" items={[{ label: "Personnages" }]} />
				<UniverseTabs
					access={access}
					characters={characters.map((c) => ({
						id: c.id,
						name: c.name,
						nameJa: c.nameJa,
						race: c.race,
						ki: c.ki,
						image: c.image,
						portraitXv2: c.portraitXv2,
					}))}
					counts={counts ?? {}}
					facets={facets ?? undefined}
				/>
			</div>
		</>
	);
}
