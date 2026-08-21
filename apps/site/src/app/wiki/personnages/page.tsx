import { Breadcrumbs } from "@/components/Breadcrumbs";
// SPDX-License-Identifier: Apache-2.0

import { getShenronCharacterCards, getShenronPlanets } from "@/lib/shenron";
import { dbUniverse } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { UniverseTabs } from "@/components/wiki/UniverseTabs";
import { CHARACTERS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";
import { getLaunchConfig } from "@/lib/wiki-launch-config";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Encyclopédie Dragon Ball",
	description:
		"Tous les personnages canon et les planètes de l'univers Dragon Ball. Fiches descriptives, ki, noms japonais, statuts et caractéristiques.",
	alternates: { canonical: "/wiki/personnages" },
};

export default async function PersonnagesPage({
	searchParams,
}: {
	searchParams: Promise<{ tab?: string }>;
}) {
	const sp = await searchParams;
	const initialTab = sp.tab || "personnages";

	// `access` : instantané de la configuration de lancement, résolu ICI (serveur)
	// et passé aux grilles client, qui ne peuvent pas le lire elles-mêmes. Sans lui,
	// chaque vignette liait une fiche fermée → 307 vers `/wiki-bientot`.
	const [characters, planets, counts, facets, access] = await Promise.all([
		getShenronCharacterCards(),
		getShenronPlanets(),
		dbUniverse.counts(),
		dbUniverse.characterFacets(),
		getLaunchConfig().catch(() => null),
	]);

	return (
		<>
			<PageHero
				eyebrow="Encyclopédie"
				title="L'Univers"
				lead={`${characters.length} guerriers et ${planets.length} mondes répertoriés à travers tout l'univers Dragon Ball.`}
				image={CHARACTERS_HERO}
				imageAlt="Univers Dragon Ball"
			/>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-16 reveal-up">
				<Breadcrumbs className="mb-8" items={[{ label: "L'Univers" }]} />
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
					planets={planets.map((p) => ({
						id: p.id,
						name: p.name,
						nameJa: p.nameJa,
						isDestroyed: p.isDestroyed,
						image: p.image,
					}))}
					initialTab={initialTab}
					counts={counts ?? {}}
					facets={facets ?? undefined}
				/>
			</div>
		</>
	);
}
