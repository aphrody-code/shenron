import type { Metadata } from "next";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { SERIES_BANNERS } from "@/lib/db-banners";
import { DatabookGrid } from "@/components/databooks/DatabookGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Databooks & Interviews Dragon Ball",
	description:
		"Guides officiels, artbooks, daizenshuu et interviews d'Akira Toriyama autour de l'univers Dragon Ball, classés par date.",
	alternates: { canonical: "/wiki/databooks" },
};

export default async function DatabooksIndexPage() {
	const data = await dbUniverse.databooks({ order: "desc" });
	const items = (data?.items ?? []).map((d) => ({
		id: d.id,
		kind: d.kind,
		title: d.title,
		titleJa: d.title_ja,
		author: d.author,
		publishedAt: d.published_at,
		cover: d.cover ? assetUrl(d.cover) : null,
		description: d.description,
		sourceUrl: d.source_url,
	}));

	const heroImage = items[0]?.cover ?? SERIES_BANNERS.DB;

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
				<DatabookGrid items={items} />
			</div>
		</div>
	);
}
