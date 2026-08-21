import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import { bannerForSeries } from "@/lib/db-banners";
import { dbUniverse } from "@/lib/db-universe";
import { getChronologyConfig } from "@/lib/chronology-config";
import { applyChronology } from "@/lib/chronology";
import { Billboard } from "@/components/stream/Billboard";
import { ChronologyTimeline } from "@/components/wiki/ChronologyTimeline";
import { ogMeta } from "@/lib/og";

// ISR et non `force-dynamic`. Le rendu dynamique coûtait 3 requêtes PG (~750
// lignes) + le rendu de toute la frise À CHAQUE VISITE : ~575 ms de TTFB, zéro
// cache CDN, sur une page publique et immuable entre deux éditions admin.
//
// Les deux raisons qui avaient motivé `force-dynamic` sont traitées autrement :
//   1. fraîcheur de la curation → `/api/chronologie-config` (PUT) appelle déjà
//      `revalidatePath("/wiki/chronologie")` : la purge est immédiate à
//      l'enregistrement, la revalidation périodique n'est qu'un filet ;
//   2. 404 figé par un build lancé pendant une indispo DB → on ne renvoie PLUS
//      `notFound()` sur dataset vide/injoignable. On rend un état dégradé
//      `noindex` qui se répare tout seul à la revalidation suivante (cf. plus bas).
export const revalidate = 300;

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

	// Frise FIXE : la curation admin (ordre, ère, date, masquage, notes) est
	// appliquée côté serveur → le public reçoit la chronologie officielle résolue.
	const items = raw && raw.length > 0 ? applyChronology(raw, config) : [];
	if (items.length === 0) return <ChronologieUnavailable />;

	const episodes = items.filter((i) => i.kind === "episode").length;
	const movies = items.filter((i) => i.kind === "movie").length;
	const manga = items.length - episodes - movies;

	return (
		<>
			<Billboard
				backdrop={bannerForSeries("DBZ")}
				eyebrow="Frise universelle"
				title="Chronologie complète"
				meta={[
					`${items.length} entrées`,
					`${episodes} épisodes`,
					`${movies} films`,
					manga > 0 ? `${manga} tomes` : null,
				]}
				synopsis="Tous les épisodes, tous les films et les tomes du manga — de Dragon Ball à Daima — réunis sur une seule frise officielle. Filtre par ère, recherche et exporte."
				primaryHref={items[0]!.href}
				primaryLabel="Commencer la frise"
				secondaryHref="/wiki/episodes"
				secondaryLabel="Les épisodes"
			/>
			<div className="w-full mx-auto max-w-[1200px] px-6 py-12 lg:px-10 lg:py-16">
				<Breadcrumbs className="mb-8" items={[{ label: "Chronologie" }]} />
				<ChronologyTimeline items={items} />
			</div>
		</>
	);
}

/**
 * État dégradé : dataset vide ou base injoignable au moment du (pré)rendu.
 *
 * Volontairement un 200 `noindex` et non un `notFound()` : sous ISR, un 404 rendu
 * pendant une panne PG resterait servi jusqu'à expiration du cache, alors que la
 * frise, elle, est revenue. Ici la page se répare d'elle-même à la revalidation
 * suivante, et `noindex` empêche Google de mémoriser la version vide entre-temps.
 * (React 19 remonte `<meta>` dans le `<head>` où qu'il soit rendu.)
 */
function ChronologieUnavailable() {
	return (
		<div className="mx-auto w-full max-w-[720px] px-6 py-24 text-center">
			<meta name="robots" content="noindex, follow" />
			<h1 className="font-display text-3xl font-bold text-white">Chronologie universelle</h1>
			<p className="mt-4 text-white/60">
				La frise est momentanément indisponible. Elle revient d'elle-même d'ici quelques minutes.
			</p>
			<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
				<Link href="/wiki/episodes" className="dbz-button !text-xs">
					Les épisodes
				</Link>
				<Link href="/wiki/films" className="dbz-button-ghost !text-xs">
					Les films
				</Link>
			</div>
		</div>
	);
}
