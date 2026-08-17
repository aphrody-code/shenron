import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { bannerForSeries, FILMS_HERO } from "@/lib/db-banners";
import { eraOf, ERA_ACCENT } from "@/lib/chronology";
import { Billboard } from "@/components/stream/Billboard";
import { StreamRow } from "@/components/stream/StreamRow";
import { PosterCard } from "@/components/stream/PosterCard";
import { stripSourceTags, langBadges } from "@/lib/media";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Films Dragon Ball",
	description:
		"Tous les films Dragon Ball, Dragon Ball Z et Dragon Ball Super — fiches complètes avec date de sortie, durée, synopsis. Regarde en VF et VOSTFR.",
	alternates: { canonical: "/wiki/films" },
};

const SERIES_ORDER = [
	"DBS_MOVIE",
	"DBZ_MOVIE",
	"DB_MOVIE",
	"DBZ_OVA",
	"DBZ_SPECIAL",
	"DB_DAIMA_MOVIE",
];
const SERIES_LABELS: Record<string, string> = {
	DB_MOVIE: "Films Dragon Ball",
	DBZ_MOVIE: "Films Dragon Ball Z",
	DBS_MOVIE: "Films Dragon Ball Super",
	DB_DAIMA_MOVIE: "Films Daima",
	DBZ_OVA: "OVA Dragon Ball Z",
	DBZ_SPECIAL: "Téléfilms Dragon Ball Z",
};

const yearOf = (sec: number | null) => (sec ? new Date(sec * 1000).getFullYear() : null);

export default async function FilmsPage() {
	const data = await dbUniverse.movies();
	if (!data || data.movies.length === 0) notFound();
	const movies = data.movies.map((m) => ({ ...m, synopsis: stripSourceTags(m.synopsis) }));

	// Film mis en avant = le plus récent daté (effet « nouveauté » en billboard).
	const featured =
		[...movies]
			.filter((m) => m.release_date != null)
			.sort((a, b) => (b.release_date ?? 0) - (a.release_date ?? 0))[0] ?? movies[0]!;
	const fYear = yearOf(featured.release_date);

	// Ordonne les séries connues puis toute série présente non listée.
	const presentSeries = [...new Set(movies.map((m) => m.series))];
	const orderedSeries = [
		...SERIES_ORDER.filter((s) => presentSeries.includes(s)),
		...presentSeries.filter((s) => !SERIES_ORDER.includes(s)).sort(),
	];
	const groups = orderedSeries
		.map((s) => ({
			key: s,
			label: SERIES_LABELS[s] ?? s.replace(/_/g, " "),
			movies: movies
				.filter((m) => m.series === s)
				.sort((a, b) => (a.release_date ?? 0) - (b.release_date ?? 0)),
		}))
		.filter((g) => g.movies.length > 0);

	return (
		<>
			<Billboard
				backdrop={bannerForSeries(featured.series) || FILMS_HERO}
				poster={featured.poster}
				eyebrow="Cinéma Dragon Ball"
				title={featured.title}
				titleJa={featured.title_ja}
				meta={[
					fYear ? String(fYear) : null,
					featured.duration_min ? `${featured.duration_min} min` : null,
					`${movies.length} films au catalogue`,
				]}
				synopsis={featured.synopsis}
				hasVf={langBadges(featured.players).hasVf}
				hasVostfr={langBadges(featured.players).hasVostfr}
				primaryHref={`/wiki/films/${featured.slug}`}
				primaryHardNav
				primaryLabel="Regarder le film"
				secondaryHref="/wiki/chronologie"
				secondaryLabel="Chronologie"
			/>

			<div className="w-full mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
				{groups.map((g) => (
					<StreamRow
						key={g.key}
						title={g.label}
						count={g.movies.length}
						accent={ERA_ACCENT[eraOf(g.key)]}
					>
						{g.movies.map((m) => (
							<PosterCard
								key={m.id}
								href={`/wiki/films/${m.slug}`}
								title={m.title}
								titleJa={m.title_ja}
								poster={m.poster}
								year={yearOf(m.release_date)}
								meta={m.duration_min ? `${m.duration_min} min` : null}
								hasVf={langBadges(m.players).hasVf}
								hasVostfr={langBadges(m.players).hasVostfr}
								badge="Film"
							/>
						))}
					</StreamRow>
				))}

				<Link
					href="/wiki/chronologie"
					className="group mt-4 flex items-center gap-4 rounded-xl border border-dbz-orange/25 bg-gradient-to-r from-dbz-orange/[0.08] to-transparent px-5 py-4 transition-colors hover:border-dbz-orange/60"
				>
					<span aria-hidden className="font-saiyan text-3xl leading-none text-dbz-orange">
						≡
					</span>
					<span className="flex-1">
						<span className="block font-display font-bold text-white transition-colors group-hover:text-dbz-orange">
							Chronologie universelle — films, épisodes &amp; manga
						</span>
						<span className="block text-[13px] text-white/50">
							Tout Dragon Ball (DB, Z, GT, Super, Daima) sur une seule frise officielle.
						</span>
					</span>
					<span
						aria-hidden
						className="text-lg text-dbz-orange transition-transform group-hover:translate-x-1"
					>
						→
					</span>
				</Link>
			</div>
		</>
	);
}
