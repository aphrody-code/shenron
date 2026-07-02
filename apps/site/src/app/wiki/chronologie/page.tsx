import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { bannerForSeries } from "@/lib/db-banners";
import { dbUniverse } from "@/lib/db-universe";
import { ChronologyExplorer } from "@/components/wiki/ChronologyExplorer";
import { ogMeta } from "@/lib/og";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Chronologie universelle",
	description:
		"La chronologie complète de Dragon Ball : TOUS les épisodes et TOUS les films — Dragon Ball, Z, GT, Super, Daima — réunis sur une seule frise. Filtre par ère, trie par diffusion, et compose ton propre ordre de visionnage exportable.",
	...ogMeta({
		title: "Chronologie universelle Dragon Ball — épisodes + films",
		description:
			"Tous les épisodes et films (DB, DBZ, GT, Super, Daima) sur une frise unique. Trie, filtre et exporte ton ordre de visionnage.",
		type: "website",
		canonical: "/wiki/chronologie",
	}),
};

export default async function ChronologiePage() {
	const items = await dbUniverse.timeline();
	if (!items || items.length === 0) notFound();

	const episodes = items.filter((i) => i.kind === "episode").length;
	const movies = items.length - episodes;

	return (
		<>
			<PageHero
				eyebrow="Frise universelle"
				title="Chronologie complète"
				lead={`${items.length} entrées — ${episodes} épisodes et ${movies} films, de Dragon Ball à Daima, réunis sur une seule frise. Filtre, trie et exporte pour composer ton propre ordre.`}
				image={bannerForSeries("DBZ")}
				imageAlt="Chronologie Dragon Ball"
			/>
			<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-12 lg:py-16">
				<ChronologyExplorer items={items} />
			</div>
		</>
	);
}
