import { Breadcrumbs } from "@/components/Breadcrumbs";
// SPDX-License-Identifier: Apache-2.0

import { countVariantCards, getShenronCharacterCards } from "@/lib/shenron";
import { dbUniverse } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { UniverseTabs } from "@/components/wiki/UniverseTabs";
import type { Metadata } from "next";
import { getLaunchConfig } from "@/lib/wiki-launch-config";
import {
	comparerRichesse,
	scoreRichesse,
	type SignauxRichesse,
} from "@/lib/character-richesse";

export const revalidate = 3600;

/**
 * Note de richesse d'une fiche, ou 0 si la mesure n'a pas répondu.
 *
 * `characterRichesse()` passe par `safe()` : elle rend `null` plutôt que de
 * faire tomber la page si la requête échoue. Dans ce cas la grille se range par
 * ordre alphabétique (le départage de `comparerRichesse`) — dégradé, mais jamais
 * cassé, et jamais l'ordre d'insertion de l'ingest.
 */
function noteDe(signaux: Map<number, SignauxRichesse> | null, id: number): number {
	const s = signaux?.get(id);
	return s ? Math.round(scoreRichesse(s) * 10) / 10 : 0;
}

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
	const [characters, counts, facets, access, variants, richesse] = await Promise.all([
		getShenronCharacterCards(),
		dbUniverse.counts(),
		dbUniverse.characterFacets(),
		getLaunchConfig().catch(() => null),
		countVariantCards(),
		dbUniverse.characterRichesse(),
	]);

	// Classement « les mieux documentés d'abord ». Sans lui, la grille servait les
	// 1 307 fiches dans l'ordre d'insertion de l'ingest : le visiteur tombait sur
	// des figures d'un seul chapitre avant Goku. La note est mesurée
	// (cf. `@/lib/character-richesse`), pas saisie à la main.
	const cartes = characters
		.map((c) => ({
			id: c.id,
			name: c.name,
			nameJa: c.nameJa,
			race: c.race,
			// `ki` retiré de la charge : déclaré dans le type de la grille mais
			// jamais rendu — 1 307 valeurs qui traversaient le réseau pour rien.
			image: c.image,
			portraitXv2: c.portraitXv2,
			// Arrondi au dixième : la note ne sert qu'à trier et à afficher une
			// jauge, deux décimales de plus ne feraient qu'alourdir la charge RSC.
			richesse: noteDe(richesse, c.id),
		}))
		.sort(comparerRichesse);

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
					characters={cartes}
					nbVariants={variants}
					counts={counts ?? {}}
					facets={facets ?? undefined}
				/>
			</div>
		</>
	);
}
