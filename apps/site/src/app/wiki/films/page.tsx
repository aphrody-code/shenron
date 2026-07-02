import { dbUniverse, assetUrl } from "@/lib/db-universe";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FILMS_HERO } from "@/lib/db-banners";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Films Dragon Ball",
	description:
		"Tous les films Dragon Ball, Dragon Ball Z et Dragon Ball Super — fiches complètes avec date de sortie, durée, synopsis.",
	alternates: { canonical: "/wiki/films" },
};

const SERIES_ORDER = ["DB_MOVIE", "DBZ_MOVIE", "DBS_MOVIE", "DB_DAIMA_MOVIE"];
const SERIES_LABELS: Record<string, string> = {
	DB_MOVIE: "Films Dragon Ball",
	DBZ_MOVIE: "Films Dragon Ball Z",
	DBS_MOVIE: "Films Dragon Ball Super",
	DB_DAIMA_MOVIE: "Films Daima",
	DBZ_OVA: "OVA Dragon Ball Z",
	DBZ_SPECIAL: "Téléfilms Dragon Ball Z",
};

// Retire les mentions de source du dataset (« (Source : ANN) », « [Écrit par
// MAL Rewrite] »…) en fin de synopsis. Boucle pour les balises empilées.
function stripSourceTags(s: string | null): string | null {
	if (!s) return s;
	let out = s;
	let prev: string;
	do {
		prev = out;
		out = out.replace(/\s*[([]\s*(?:source|écrit par)[^)\]]*[)\]]\s*$/i, "");
	} while (out !== prev);
	return out.trimEnd();
}

export default async function FilmsPage() {
	const data = await dbUniverse.movies();
	if (!data || data.movies.length === 0) notFound();
	const movies = data.movies;

	// Ordonne d'abord les séries connues (SERIES_ORDER), puis ajoute toute série
	// présente en base mais non listée (ex. DBZ_OVA, DBZ_SPECIAL) — sinon leurs
	// films seraient orphelins (rendus nulle part) et le compteur du hero faux.
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
				.sort((a, b) => (a.release_date ?? 0) - (b.release_date ?? 0))
				// Nettoie les balises de source du dataset avant affichage des cartes.
				.map((m) => ({ ...m, synopsis: stripSourceTags(m.synopsis) })),
		}))
		.filter((g) => g.movies.length > 0);

	return (
		<>
			<PageHero
				eyebrow="Cinéma"
				title="Films Dragon Ball"
				lead={`${movies.length} long-métrages catalogués — des classiques DBZ aux succès récents comme Super Hero.`}
				image={FILMS_HERO}
				imageAlt="Bannière films Dragon Ball"
			/>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				{groups.map((g) => (
					<section key={g.key} className="mb-16">
						<h2 className="font-display font-bold text-[24px] text-white border-b border-white/10 pb-3 mb-6">
							{g.label} <span className="text-white/40">— {g.movies.length}</span>
						</h2>
						<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
							{g.movies.map((m) => (
								<Link
									key={m.id}
									href={`/wiki/films/${m.slug}`}
									className="bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden hover:border-dbz-orange/60 transition-colors flex flex-col"
								>
									{m.poster && (
										<div className="relative aspect-[2/3] bg-black">
											<Image
												src={assetUrl(m.poster)}
												alt=""
												fill
												sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
												className="object-cover"
											/>
										</div>
									)}
									<div className="p-4 flex-1 flex flex-col">
										<h3 className="font-display font-bold text-[15px] text-white leading-tight mb-1">
											{m.title}
										</h3>
										{m.title_ja && (
											<p className="font-jp text-[11px] text-dbz-orange/80 mb-2">{m.title_ja}</p>
										)}
										<div className="text-[11px] font-display tracking-[0.12em] uppercase text-white/55 mb-3 flex gap-3 flex-wrap">
											{m.release_date && (
												<span>{new Date(m.release_date * 1000).getFullYear()}</span>
											)}
											{m.duration_min && <span>{m.duration_min} min</span>}
										</div>
										{m.synopsis && (
											<p className="text-[12px] text-white/65 leading-relaxed line-clamp-4">
												{m.synopsis}
											</p>
										)}
									</div>
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</>
	);
}
