import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { bannerForSeries } from "@/lib/db-banners";
import { dbUniverse } from "@/lib/db-universe";
import { getChronologyConfig } from "@/lib/chronology-config";
import { applyChronology } from "@/lib/chronology";
import { ChronologyTimeline } from "@/components/wiki/ChronologyTimeline";
import { ogMeta } from "@/lib/og";

// Rendu dynamique (runtime) et non prérendu au build : (1) la curation admin se
// reflète immédiatement sur le public sans attendre une revalidation ISR ; (2) on
// évite qu'un build lancé pendant une indispo DB fige un 404 en cache ISR (le
// prérendu SSG appelle `notFound()` si la DB ne répond pas, et ce 404 resterait
// servi jusqu'à expiration). La page ne lit ni cookies ni session → pas d'impact
// sur le cache des autres routes.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Chronologie universelle",
	description:
		"La chronologie officielle de Dragon Ball : TOUS les épisodes, TOUS les films et les tomes du manga — Dragon Ball, Z, GT, Super, Daima — réunis sur une seule frise, dans l'ordre validé par l'équipe. Filtre par ère, recherche et exporte.",
	...ogMeta({
		title: "Chronologie universelle Dragon Ball — épisodes, films & manga",
		description:
			"Tous les épisodes, films et tomes du manga (DB, DBZ, GT, Super, Daima) sur une frise unique et officielle. Filtre par ère, recherche et exporte.",
		type: "website",
		canonical: "/wiki/chronologie",
	}),
};

export default async function ChronologiePage() {
	const [raw, config] = await Promise.all([dbUniverse.timeline(), getChronologyConfig()]);
	if (!raw || raw.length === 0) notFound();

	// Frise FIXE : la curation admin (ordre, ère, date, masquage, notes) est
	// appliquée côté serveur → le public reçoit la chronologie officielle résolue.
	const items = applyChronology(raw, config);
	if (items.length === 0) notFound();

	const episodes = items.filter((i) => i.kind === "episode").length;
	const movies = items.filter((i) => i.kind === "movie").length;
	const manga = items.length - episodes - movies;
	const mangaLead = manga > 0 ? ` et ${manga} tomes du manga` : "";

	return (
		<>
			<PageHero
				eyebrow="Frise universelle"
				title="Chronologie complète"
				lead={`${items.length} entrées — ${episodes} épisodes, ${movies} films${mangaLead}, de Dragon Ball à Daima, réunis sur une seule frise officielle. Filtre par ère, recherche et exporte.`}
				image={bannerForSeries("DBZ")}
				imageAlt="Chronologie Dragon Ball"
			/>
			<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-12 lg:py-16">
				<ChronologyTimeline items={items} />
			</div>
		</>
	);
}
