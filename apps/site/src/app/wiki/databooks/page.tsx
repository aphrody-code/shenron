import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
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
		description: d.description,
		sourceUrl: d.source_url,
	}));

	const heroImage = items[0]?.cover ? assetUrl(items[0].cover) : SERIES_BANNERS.DB;

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Databooks & Interviews"
				title="Guides & paroles d'auteur"
				lead="Databooks, artbooks, daizenshuu et interviews officielles — les coulisses de l'univers Dragon Ball, classés par date."
				image={heroImage}
				imageAlt="Databooks Dragon Ball"
				imagePosition="top"
			/>
			<div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
				<Breadcrumbs className="mb-8" items={[{ label: "Databooks" }]} />
				<DatabookGrid items={items} access={access} />
			</div>
		</div>
	);
}
