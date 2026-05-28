import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

const SERIES_LABELS: Record<string, string> = {
	DB_MOVIE: "Film Dragon Ball",
	DBZ_MOVIE: "Film Dragon Ball Z",
	DBS_MOVIE: "Film Dragon Ball Super",
	DB_DAIMA_MOVIE: "Film Daima",
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const m = await dbUniverse.movie(slug);
	if (!m) return { title: "Film — DBFR" };
	return {
		title: `${m.title} — Film | DBFR`,
		description: m.synopsis ?? `${SERIES_LABELS[m.series] ?? "Film"}.`,
	};
}

export default async function FilmPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const m = await dbUniverse.movie(slug);
	if (!m) notFound();

	const getYoutubeId = (url: string | null) => {
		if (!url) return null;
		const match = url.match(
			/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11})/,
		);
		return match ? match[1] : null;
	};
	const youtubeId = getYoutubeId(m.trailer_url);

	return (
		<div className="mx-auto max-w-[1180px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href="/wiki/films"
				className="inline-flex items-center gap-2 text-[13px] font-display font-semibold tracking-[0.10em] uppercase text-dbz-orange hover:text-white transition-colors mb-8 link-underline"
			>
				← Tous les films
			</Link>

			<div className="grid md:grid-cols-[280px_1fr] gap-10">
				<div>
					{m.poster ? (
						<div className="dbz-panel p-4 border-2 border-dbz-orange/30 bg-dbz-card relative overflow-hidden group">
							<div className="absolute inset-0 halftone opacity-20" />
							<Image
								src={assetUrl(m.poster)}
								alt={m.title}
								width={280}
								height={420}
								sizes="280px"
								className="w-full h-auto object-cover relative z-10 drop-shadow-[0_0_15px_rgba(255,178,0,0.3)]"
								priority
							/>
						</div>
					) : (
						<div className="dbz-panel aspect-[2/3] flex items-center justify-center bg-zinc-900">
							<span className="text-zinc-700 font-saiyan text-6xl">?</span>
						</div>
					)}
				</div>

				<div className="space-y-8">
					<header>
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange mb-4">
							{SERIES_LABELS[m.series] ?? m.series}
						</p>
						<h1 className="font-saiyan text-5xl lg:text-7xl text-white mb-4 tracking-widest leading-tight">
							{m.title}
						</h1>
						{(m.title_ja || m.title_romaji) && (
							<div className="flex items-center flex-wrap gap-4 mb-6">
								{m.title_ja && (
									<span
										className="text-2xl font-bold tracking-widest text-dbz-orange"
										style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
									>
										{m.title_ja}
									</span>
								)}
								{m.title_romaji && (
									<span className="text-sm italic uppercase tracking-[0.2em] text-white/40">
										{m.title_romaji}
									</span>
								)}
							</div>
						)}

						<dl className="grid grid-cols-2 gap-4 max-w-md">
							{m.release_date && (
								<div>
									<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1">
										Sortie
									</dt>
									<dd className="font-display text-white">
										{new Date(m.release_date * 1000).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</dd>
								</div>
							)}
							{m.duration_min && (
								<div>
									<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1">
										Durée
									</dt>
									<dd className="font-display text-white">
										{m.duration_min} min
									</dd>
								</div>
							)}
						</dl>
					</header>

					{m.synopsis && (
						<section className="dbz-panel p-8 relative overflow-hidden">
							<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
							<h2 className="font-saiyan text-2xl text-dbz-orange mb-4 uppercase tracking-widest">
								Synopsis
							</h2>
							<div className="prose prose-invert max-w-none wiki-content">
								<WikiMarkdown body={m.synopsis} />
							</div>
						</section>
					)}

					{youtubeId && (
						<section className="space-y-4">
							<div className="flex items-center gap-6">
								<h2 className="font-saiyan text-2xl text-white uppercase tracking-widest whitespace-nowrap">
									Trailer Officiel
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-red/50 to-transparent" />
							</div>
							<div className="dbz-panel p-2 aspect-video bg-black overflow-hidden">
								<iframe
									width="100%"
									height="100%"
									src={`https://www.youtube.com/embed/${youtubeId}`}
									title={`${m.title} Trailer`}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="rounded-lg"
								></iframe>
							</div>
						</section>
					)}

					{m.mal_id && (
						<p className="text-[12px] text-white/50">
							Source métadonnées :{" "}
							<a
								href={`https://myanimelist.net/anime/${m.mal_id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-dbz-orange"
							>
								MyAnimeList #{m.mal_id}
							</a>{" "}
							(via Jikan API)
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
