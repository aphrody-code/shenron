import { dbUniverse } from "@/lib/db-universe";
import { assetUrl } from "@/lib/assets";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { bannerForSeries } from "@/lib/db-banners";
import { eraOf, ERA_ACCENT } from "@/lib/chronology";
import { Billboard } from "@/components/stream/Billboard";
import { StreamRow } from "@/components/stream/StreamRow";
import { EpisodeCard } from "@/components/stream/EpisodeCard";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBZ_KAI: "Dragon Ball Z Kai",
	DBZ_KAI_FINAL: "Dragon Ball Z Kai – Final Chapters",
	DBGT: "Dragon Ball GT",
	DBS: "Dragon Ball Super",
	DB_DAIMA: "Dragon Ball Daima",
};
const SERIES_YEARS: Record<string, string> = {
	DB: "1986-1989",
	DBZ: "1989-1996",
	DBZ_KAI: "2009-2011",
	DBZ_KAI_FINAL: "2014-2015",
	DBGT: "1996-1997",
	DBS: "2015-2018",
	DB_DAIMA: "2024-2025",
};
const SERIES_ORDER = ["DB", "DBZ", "DBZ_KAI", "DBZ_KAI_FINAL", "DBGT", "DBS", "DB_DAIMA"];

const orderSeries = (rows: { series: string }[] | null): string[] =>
	(rows ?? [])
		.map((r) => r.series)
		.sort((a, b) => {
			const ia = SERIES_ORDER.indexOf(a);
			const ib = SERIES_ORDER.indexOf(b);
			return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
		});

const yearOf = (sec: number | null) => (sec ? new Date(sec * 1000).getFullYear() : null);
const hasLang = (
	players: { lang?: "vf" | "vostfr" }[] | null,
	lang: "vf" | "vostfr"
): boolean => (players ?? []).some((p) => p.lang === lang);

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ series?: string; page?: string }>;
}): Promise<Metadata> {
	const sp = await searchParams;
	const series = sp.series;
	if (!series) {
		return {
			title: "Épisodes Dragon Ball — l'intégrale de l'anime",
			description:
				"Tous les épisodes Dragon Ball, DBZ, DBZ Kai, GT, Super et Daima — en VF et VOSTFR, avec vignettes, titres FR/JP et synopsis.",
			alternates: { canonical: "/wiki/episodes" },
		};
	}
	const label = SERIES_LABELS[series] ?? series;
	return {
		title: `${label} — Épisodes`,
		description:
			"Index complet des épisodes avec vignettes, titres FR/JP, date de diffusion et synopsis. Regarde en VF et VOSTFR.",
		alternates: { canonical: `/wiki/episodes?series=${series}` },
	};
}

// Mémoïsation des lectures Postgres (cf. version d'origine) : la page reste
// dynamique (searchParams) mais les requêtes DB sont servies depuis le data cache
// Next (revalidées 1 h). On throw sur vide pour ne pas mémoïser un échec transitoire.
const getEpisodesCached = unstable_cache(
	async (series: string, limit: number, offset: number) => {
		const data = await dbUniverse.episodes(series, limit, offset);
		if (!data) throw new Error("episodes:empty");
		return data;
	},
	["episodes"],
	{ revalidate: 3600 }
);
const getEpisodeSeriesCached = unstable_cache(
	async () => {
		const rows = await dbUniverse.episodeSeries();
		if (!rows) throw new Error("episode-series:empty");
		return rows;
	},
	["episode-series"],
	{ revalidate: 3600 }
);

const RAIL_CAP = 24;

export default async function EpisodesIndex({
	searchParams,
}: {
	searchParams: Promise<{ series?: string; page?: string; view?: string }>;
}) {
	const sp = await searchParams;
	const seriesRows = await getEpisodeSeriesCached().catch(() => null);
	const availableSeries = orderSeries(seriesRows);

	// ── Vue LANDING (aucune série) : billboard + un rail par série ──────────────
	if (!sp.series) {
		if (availableSeries.length === 0) notFound();
		const groups = await Promise.all(
			availableSeries.map(async (series) => {
				const data = await getEpisodesCached(series, RAIL_CAP, 0).catch(() => null);
				return data ? { series, episodes: data.episodes, total: data.total } : null;
			})
		);
		const present = groups.filter((g): g is NonNullable<typeof g> => !!g && g.episodes.length > 0);
		if (present.length === 0) notFound();

		const grandTotal = present.reduce((n, g) => n + g.total, 0);
		// Épisode d'ouverture (bouton « Commencer ») : 1er épisode de DB, sinon 1re série.
		const opener = (present.find((g) => g.series === "DB") ?? present[0]!).episodes[0]!;

		return (
			<>
				<Billboard
					backdrop={bannerForSeries("DBZ")}
					eyebrow="Série animée"
					title="Les épisodes Dragon Ball"
					meta={[`${grandTotal} épisodes`, `${present.length} séries`, "VF · VOSTFR"]}
					synopsis="De Dragon Ball à Dragon Ball Daima — l'intégrale de l'anime, épisode par épisode, en VF et VOSTFR. Choisis ta série et lance la lecture."
					primaryHref={`/wiki/episodes/${opener.id}`}
					primaryLabel="Commencer l'aventure"
					secondaryHref="/wiki/chronologie"
					secondaryLabel="Chronologie"
				/>
				<div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
					{present.map((g) => (
						<StreamRow
							key={g.series}
							title={SERIES_LABELS[g.series] ?? g.series}
							count={g.total}
							accent={ERA_ACCENT[eraOf(g.series)]}
							seeAllHref={`/wiki/episodes?series=${g.series}`}
						>
							{g.episodes.map((ep) => (
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
								/>
							))}
							{g.total > g.episodes.length && (
								<Link
									href={`/wiki/episodes?series=${g.series}`}
									className="flex w-[160px] shrink-0 snap-start items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-center text-[13px] font-display font-semibold text-white/60 transition-colors hover:border-dbz-orange/50 hover:text-dbz-orange"
								>
									+ {g.total - g.episodes.length}
									<br />
									Tout voir
								</Link>
							)}
						</StreamRow>
					))}
				</div>
			</>
		);
	}

	// ── Vue SÉRIE (grille paginée d'épisodes) ───────────────────────────────────
	const series = sp.series;
	const parsedPage = Number.parseInt(sp.page ?? "1", 10);
	const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
	const limit = 48;
	const offset = (page - 1) * limit;

	const data = await getEpisodesCached(series, limit, offset).catch(() => null);
	if (!data || data.episodes.length === 0) notFound();
	const { episodes, total } = data;
	const pages = Math.ceil(total / limit);
	const navSeries = availableSeries.length > 0 ? availableSeries : [series];
	const opener = episodes[0]!;

	return (
		<>
			<Billboard
				backdrop={opener.image ? assetUrl(opener.image) : bannerForSeries(series)}
				eyebrow={SERIES_YEARS[series] ? `Anime · ${SERIES_YEARS[series]}` : "Anime"}
				title={SERIES_LABELS[series] ?? series}
				meta={[`${total} épisodes`, "VF · VOSTFR"]}
				synopsis={opener.synopsis}
				primaryHref={`/wiki/episodes/${opener.id}`}
				primaryLabel="Reprendre la lecture"
				secondaryHref="/wiki/chronologie"
				secondaryLabel="Chronologie"
			/>
			<div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
				{/* Onglets séries */}
				<nav className="mb-8 flex flex-wrap gap-2">
					<Link
						href="/wiki/episodes"
						className="rounded-full bg-white/[0.06] px-3 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-white/72 transition-colors hover:bg-white/[0.12]"
					>
						← Tout
					</Link>
					{navSeries.map((key) => (
						<Link
							key={key}
							href={`/wiki/episodes?series=${key}`}
							className={`rounded-full px-3 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors ${
								series === key
									? "bg-dbz-orange text-black"
									: "bg-white/[0.06] text-white/72 hover:bg-white/[0.12]"
							}`}
						>
							{SERIES_LABELS[key] ?? key}
						</Link>
					))}
				</nav>

				<h2 className="mb-6 flex items-center gap-2.5 border-b border-white/10 pb-3 font-display text-[20px] font-bold text-white">
					<span
						className="h-5 w-1.5 rounded-full"
						style={{ backgroundColor: ERA_ACCENT[eraOf(series)] }}
					/>
					{SERIES_LABELS[series] ?? series}
					<span className="font-mono text-[14px] font-normal text-white/40">{total} épisodes</span>
				</h2>

				<div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{episodes.map((ep) => (
						<EpisodeCard
							key={ep.id}
							href={`/wiki/episodes/${ep.id}`}
							number={ep.number_in_series}
							title={ep.title}
							titleJa={ep.title_ja}
							image={ep.image}
							synopsis={ep.synopsis}
							year={yearOf(ep.air_date)}
							hasVf={hasLang(ep.players, "vf")}
							hasVostfr={hasLang(ep.players, "vostfr")}
							width="full"
						/>
					))}
				</div>

				{pages > 1 && (
					<nav className="mt-12 flex flex-wrap items-center justify-center gap-2">
						{Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
							<Link
								key={p}
								href={`/wiki/episodes?series=${series}&page=${p}`}
								className={`grid h-9 min-w-[36px] place-items-center rounded-md px-3 font-display text-[13px] font-semibold transition-colors ${
									p === page
										? "bg-dbz-orange text-black"
										: "bg-white/[0.06] text-white/72 hover:bg-white/[0.12]"
								}`}
							>
								{p}
							</Link>
						))}
					</nav>
				)}
			</div>
		</>
	);
}
