import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import { dbUniverse } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { SERIES_BANNERS } from "@/lib/db-banners";
import { DatabookGrid } from "@/components/databooks/DatabookGrid";
import { getLaunchConfig } from "@/lib/wiki-launch-config";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Databooks & Interviews Dragon Ball",
	description:
		"Guides officiels, artbooks, daizenshuu et interviews d'Akira Toriyama autour de l'univers Dragon Ball, classés par date.",
	alternates: { canonical: "/wiki/databooks" },
};

export default async function DatabooksIndexPage() {
	// `access` : la grille est un composant client et ne peut pas lire la
	// configuration de lancement ; on la résout ici et on la lui passe.
	const [data, access] = await Promise.all([
		dbUniverse.databooks({ order: "desc" }),
		getLaunchConfig().catch(() => null),
	]);
	const items = (data?.items ?? []).map((d) => ({
		id: d.id,
		kind: d.kind,
		category: d.category ?? null,
		title: d.title,
		titleJa: d.title_ja,
		author: d.author,
		publishedAt: d.published_at,
		// Chemin brut : DatabookGrid / WikiImg résolvent via assetUrl (évite
		// double-préfixe et permet le repli placeholder si cover 404).
		cover: d.cover,
	}));

	// Bannière fixe plutôt que la couverture du dernier ouvrage entré : une
	// jaquette portrait étirée sur 1920 px de large sortait floue, et le hero
	// changeait de visage à chaque nouveau V-Jump ingéré.
	const heroImage = SERIES_BANNERS.DB!;

	return (
		<div>
			<PageHero
				eyebrow="Databooks & Interviews"
				title="Guides & paroles d'auteur"
				lead="Databooks, artbooks, daizenshuu et interviews officielles — les coulisses de l'univers Dragon Ball, classés par date."
				image={heroImage}
				imageAlt="Databooks Dragon Ball"
			/>
			<div className="w-full mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
				<Breadcrumbs className="mb-6 sm:mb-8" items={[{ label: "Databooks" }]} />
				<DatabookGrid items={items} access={access} />
			</div>
		</div>
	);
}
