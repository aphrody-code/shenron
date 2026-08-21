import type { Metadata } from "next";
import { JournalIndex, journalPageCount, journalHref } from "./_journal";

// Aucun `searchParams` lu ici : la page 1 est PRÉRENDUE et cachée par le CDN.
// La pagination vit sous `/actualites/page/[n]` (cf. `_journal.tsx`).
export const revalidate = 60;

export const metadata: Metadata = {
	title: "Le Journal — actualités Dragon Ball",
	description:
		"Sorties anime, chapitres du manga, films, événements et analyses. Le journal Dragon Ball de la communauté francophone.",
	alternates: {
		canonical: "/actualites",
		types: { "application/rss+xml": [{ url: "/actualites/rss.xml", title: "Le Journal — DBFR" }] },
	},
};

export default async function ActualitesPage() {
	// `rel="next"` en <head> : indique explicitement à un crawler que la série
	// continue, sans qu'il ait à découvrir le lien dans le corps de page.
	const pages = await journalPageCount().catch(() => 1);
	return (
		<>
			{pages > 1 && <link rel="next" href={journalHref(2)} />}
			<JournalIndex page={1} />
		</>
	);
}
