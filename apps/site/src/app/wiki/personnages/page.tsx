// SPDX-License-Identifier: Apache-2.0

import { getShenronCharacters, getShenronPlanets } from "@/lib/shenron";
import { PageHero } from "@/components/PageHero";
import { UniverseTabs } from "@/components/wiki/UniverseTabs";
import { CHARACTERS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Encyclopédie Dragon Ball — DBFR",
	description:
		"Tous les personnages canon et les planètes de l'univers Dragon Ball. Fiches descriptives, ki, noms japonais, statuts et caractéristiques.",
};

export default async function PersonnagesPage({
	searchParams,
}: {
	searchParams: Promise<{ tab?: string }>;
}) {
	const sp = await searchParams;
	const initialTab = sp.tab || "personnages";

	const [characters, planets] = await Promise.all([
		getShenronCharacters(),
		getShenronPlanets(),
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
				<UniverseTabs
					characters={characters.map((c) => ({
						id: c.id,
						name: c.name,
						nameJa: c.nameJa,
						race: c.race,
						ki: c.ki,
						image: c.image,
					}))}
					planets={planets.map((p) => ({
						id: p.id,
						name: p.name,
						nameJa: p.nameJa,
						isDestroyed: p.isDestroyed,
						image: p.image,
					}))}
					initialTab={initialTab}
				/>
			</div>
		</>
	);
}
