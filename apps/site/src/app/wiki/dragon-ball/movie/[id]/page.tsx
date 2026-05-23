import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { getShenronMovie } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const movie = await getShenronMovie(parseInt(id));
	if (!movie) return { title: "Film Dragon Ball — DBFR" };
	return {
		title: `${movie.title} — Film Dragon Ball | DBFR`,
		description: movie.synopsis ?? `Fiche détaillée du film ${movie.title}.`,
	};
}

export default async function MovieDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const movie = await getShenronMovie(parseInt(id));

	if (!movie) notFound();

	// Helper to extract YouTube ID
	const getYoutubeId = (url: string | null) => {
		if (!url) return null;
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return (match && match[2].length === 11) ? match[2] : null;
	};

	const youtubeId = getYoutubeId(movie.trailerUrl);

	return (
		<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href="/wiki/dragon-ball/movies"
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Tous les films</span>
			</Link>

			<div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
				<div className="w-full lg:w-1/3 xl:w-1/4">
					<div className="dbz-panel p-4 border-2 border-dbz-orange/30 bg-dbz-card relative overflow-hidden group">
						<div className="absolute inset-0 halftone opacity-20" />
						{movie.poster ? (
							<img
								src={assetUrl(movie.poster)}
								alt={movie.title}
								className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,178,0,0.3)]"
							/>
						) : (
							<div className="aspect-[2/3] flex items-center justify-center bg-zinc-900">
								<span className="text-zinc-700 font-saiyan text-6xl">?</span>
							</div>
						)}
					</div>
				</div>

				<div className="flex-1 space-y-10">
					<header>
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange mb-4">
							{movie.series.replace("_MOVIE", "").replace("_SPECIAL", "")}
						</p>
						<h1 className="font-saiyan text-5xl lg:text-7xl text-white mb-6 tracking-widest leading-tight">
							{movie.title}
						</h1>
						{(movie.titleJa || movie.titleRomaji) && (
							<div className="flex items-center flex-wrap gap-4 mb-6">
								{movie.titleJa && (
									<span className="text-2xl font-bold tracking-widest text-dbz-orange" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
										{movie.titleJa}
									</span>
								)}
								{movie.titleRomaji && (
									<span className="text-sm italic uppercase tracking-[0.2em] text-white/40">
										{movie.titleRomaji}
									</span>
								)}
							</div>
						)}
						<div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
							{movie.releaseDate && (
								<span className="px-3 py-1 bg-white/5 border border-white/10 text-white/60">
									📅 {new Date(movie.releaseDate).getFullYear()}
								</span>
							)}
							{movie.durationMin && (
								<span className="px-3 py-1 bg-white/5 border border-white/10 text-white/60">
									⏱️ {movie.durationMin} MIN
								</span>
							)}
						</div>
					</header>

					{movie.synopsis && (
						<section className="dbz-panel p-8 relative overflow-hidden">
							<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
							<h2 className="font-saiyan text-2xl text-dbz-orange mb-4 uppercase tracking-widest">Synopsis</h2>
							<div className="prose prose-invert max-w-none wiki-content">
								<WikiMarkdown body={movie.synopsis} />
							</div>
						</section>
					)}

					{youtubeId && (
						<section className="space-y-6">
							<div className="flex items-center gap-6">
								<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest whitespace-nowrap">
									Trailer Officiel
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-red/50 to-transparent" />
							</div>
							<div className="dbz-panel p-2 aspect-video bg-black overflow-hidden">
								<iframe
									width="100%"
									height="100%"
									src={`https://www.youtube.com/embed/${youtubeId}`}
									title={`${movie.title} Trailer`}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="rounded-lg"
								></iframe>
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}
