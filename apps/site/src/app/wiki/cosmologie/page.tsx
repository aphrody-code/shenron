// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { WikiCategoryNav } from "@/components/wiki/WikiCategoryNav";
import { CosmologyGrid } from "@/components/wiki/CosmologyGrid";
import { PLANETS_HERO } from "@/lib/db-banners";
import { getShenronPlanets } from "@/lib/shenron";
import { getLaunchConfig } from "@/lib/wiki-launch-config";
import { ogMeta } from "@/lib/og";

export const revalidate = 3600;

/**
 * Index de la **cosmologie** — les lieux de l'univers Dragon Ball.
 *
 * Deux corrections en une. (1) La rubrique s'appelait « Planètes » alors que la
 * table héberge aussi des dimensions et des demeures divines : l'Autre Monde,
 * le Noyau du Monde, le temple mobile du Roi de Tout, la Planète sacrée,
 * l'Univers 11, les Planètes Emprisonnées, le Royaume des Démons. (2) Elle
 * n'avait pas de page à elle : `/wiki/cosmologie` était un `redirect()` de
 * composant vers `/wiki/personnages?tab=planetes` — et sous le layout `/wiki`,
 * qui streame, ce redirect dégrade en **200 + `<meta http-equiv="refresh">`**
 * (piège documenté dans CLAUDE.md, vérifié encore ici). Le visiteur voyait une
 * page blanche une seconde, et un moteur indexait une coquille de 76 Ko.
 */
export const metadata: Metadata = {
	title: "Cosmologie Dragon Ball",
	description:
		"Les lieux de l'univers Dragon Ball : planètes, dimensions et demeures divines — Namek, Vegeta, l'Autre Monde, la Planète sacrée ou le temple du Roi de Tout.",
	alternates: { canonical: "/wiki/cosmologie" },
	...ogMeta({
		title: "Cosmologie Dragon Ball",
		description: "Planètes, dimensions et demeures divines de l'univers Dragon Ball.",
		image: PLANETS_HERO,
		canonical: "/wiki/cosmologie",
	}),
};

export default async function CosmologiePage() {
	const [lieux, access] = await Promise.all([
		getShenronPlanets(),
		getLaunchConfig().catch(() => null),
	]);

	// Tri ICI, côté serveur : la requête rend les lieux dans l'ordre des
	// identifiants, c'est-à-dire celui des imports successifs — sur 60 vignettes,
	// chercher « Namek » revenait à balayer toute la grille. Trier dans le
	// composant client exposerait au mismatch d'hydratation (deux ICU).
	const places = [...lieux].sort((a, b) => a.name.localeCompare(b.name, "fr"));

	return (
		<>
			<PageHero
				eyebrow="Encyclopédie"
				title="Cosmologie"
				lead={`${places.length} lieux répertoriés — planètes, dimensions et demeures divines de l'univers Dragon Ball.`}
			/>
			<div className="reveal-up w-full mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
				<Breadcrumbs className="mb-8" items={[{ label: "Cosmologie" }]} />
				<WikiCategoryNav active="planetes" omit={["planetes"]} className="mb-10" />
				<CosmologyGrid
					access={access}
					places={places.map((p) => ({
						id: p.id,
						name: p.name,
						nameJa: p.nameJa,
						isDestroyed: p.isDestroyed,
						image: p.image,
					}))}
				/>
			</div>
		</>
	);
}
