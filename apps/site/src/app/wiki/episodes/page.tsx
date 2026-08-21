import { SectionUnavailable } from "@/components/wiki/SectionUnavailable";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { bannerForSeries } from "@/lib/db-banners";
import { eraOf, ERA_ACCENT } from "@/lib/chronology";
import { Billboard } from "@/components/stream/Billboard";
import { StreamRow } from "@/components/stream/StreamRow";
import { EpisodeCard } from "@/components/stream/EpisodeCard";
import { RailSkeleton } from "@/components/stream/StreamSkeleton";
import {
	SERIES_LABELS,
	RAIL_CAP,
	orderSeries,
	yearOf,
	hasLang,
	getEpisodesCached,
	getEpisodeSeriesCached,
} from "./_shared";

// Landing STATIQUE (plus de `searchParams`) → prérendu + ISR + cache CDN, et
// surtout : l'interception `@modal` s'active (elle ne se déclenche pas depuis une
// page rendue dynamiquement). La vue par série vit désormais sous
// `/wiki/episodes/serie/[series]` (statique elle aussi).
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Épisodes Dragon Ball — l'intégrale de l'anime",
	description:
		"Tous les épisodes Dragon Ball, DBZ, DBZ Kai, GT, Super et Daima — en VF et VOSTFR, avec vignettes, titres FR/JP et synopsis.",
	alternates: { canonical: "/wiki/episodes" },
};

export default async function EpisodesLanding() {
	const seriesRows = await getEpisodeSeriesCached().catch(() => null);
	const availableSeries = orderSeries(seriesRows);
	if (availableSeries.length === 0) return <SectionUnavailable title="Épisodes Dragon Ball" />;

	const counts = new Map((seriesRows ?? []).map((r) => [r.series, r.count]));
	const grandTotal = [...counts.values()].reduce((a, b) => a + b, 0);
	const openerSeries = availableSeries.find((s) => s === "DB") ?? availableSeries[0]!;
	const opener = (await getEpisodesCached(openerSeries, 1, 0).catch(() => null))?.episodes[0];

	return (
		<>
			<Billboard
				backdrop={bannerForSeries("DBZ")}
				eyebrow="Série animée"
				title="Les épisodes Dragon Ball"
				meta={[`${grandTotal} épisodes`, `${availableSeries.length} séries`, "VF · VOSTFR"]}
				synopsis="De Dragon Ball à Dragon Ball Daima — l'intégrale de l'anime, épisode par épisode, en VF et VOSTFR. Choisis ta série et lance la lecture."
				primaryHref={
					opener ? `/wiki/episodes/${opener.id}` : `/wiki/episodes/serie/${openerSeries}`
				}
				primaryLabel="Commencer l'aventure"
				secondaryHref="/wiki/chronologie"
				secondaryLabel="Chronologie"
			/>
			<div className="w-full mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
				<Breadcrumbs className="mb-8" items={[{ label: "Épisodes" }]} />
				<Suspense
					fallback={
						<>
							{Array.from({ length: Math.min(5, availableSeries.length) }).map((_, i) => (
								<RailSkeleton key={i} variant="episode" />
							))}
						</>
					}
				>
					<EpisodeRails series={availableSeries} />
				</Suspense>
			</div>
		</>
	);
}

/**
 * Rails par série — async server component (barrière `<Suspense>`). Sur cette
 * page statique il est résolu au prérendu ; `RAIL_CAP` cartes + une carte « Tout
 * voir » vers la vue série complète `/wiki/episodes/serie/[series]`.
 */
async function EpisodeRails({ series }: { series: string[] }) {
	const groups = await Promise.all(
		series.map(async (s) => {
			const data = await getEpisodesCached(s, RAIL_CAP, 0).catch(() => null);
			return data ? { series: s, episodes: data.episodes, total: data.total } : null;
		})
	);
	const present = groups.filter((g): g is NonNullable<typeof g> => !!g && g.episodes.length > 0);
	if (present.length === 0) {
		return <p className="py-12 text-center text-white/40">Aucun épisode à afficher.</p>;
	}
	return (
		<>
			{present.map((g, rowIdx) => (
				<StreamRow
					key={g.series}
					title={SERIES_LABELS[g.series] ?? g.series}
					count={g.total}
					accent={ERA_ACCENT[eraOf(g.series)]}
					seeAllHref={`/wiki/episodes/serie/${g.series}`}
				>
					{g.episodes.map((ep, cardIdx) => (
						<EpisodeCard
							key={ep.id}
							href={`/wiki/episodes/${ep.id}`}
							number={ep.number_in_series}
							title={ep.title}
							titleJa={ep.title_ja}
							image={ep.image}
							year={yearOf(ep.air_date)}
							hasVf={hasLang(ep.players, "vf")}
							hasVostfr={hasLang(ep.players, "vostfr")}
							// Premier rail, cartes au-dessus de la ligne de flottaison →
							// chargement immédiat (pas de flash de vignette vide au fold).
							eager={rowIdx === 0 && cardIdx < 6}
						/>
					))}
					{g.total > g.episodes.length && (
						<Link
							href={`/wiki/episodes/serie/${g.series}`}
							className="flex w-[160px] shrink-0 snap-start items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-center text-[13px] font-display font-semibold text-white/60 transition-colors hover:border-dbz-orange/50 hover:text-dbz-orange"
						>
							+ {g.total - g.episodes.length}
							<br />
							Tout voir
						</Link>
					)}
				</StreamRow>
			))}
		</>
	);
}
