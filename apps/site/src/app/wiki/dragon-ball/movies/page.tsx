import { getShenronMovies } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FILMS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Films Dragon Ball — DBFR",
	description:
		"Tous les films et épisodes spéciaux Dragon Ball, avec dates, durées, synopsis et trailers.",
};

export default async function MoviesPage() {
	const movies = await getShenronMovies();

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Cinéma"
				title="Films & Hors-Séries"
				lead={`${movies.length} films catalogués — posters grands formats, trailers YouTube et fiches complètes.`}
				image={FILMS_HERO}
				imageAlt="Films Dragon Ball"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				<div className="flex items-center gap-4 mb-10">
					<Link
						href="/wiki/dragon-ball"
						className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest link-underline"
					>
						<span>← Encyclopédie</span>
					</Link>
					<div className="h-px flex-1 bg-dbz-border" />
					<Link
						href="/wiki/films"
						className="text-[11px] font-bold text-dbz-orange/70 hover:text-dbz-orange uppercase tracking-widest transition-colors"
					>
						Vue par série →
					</Link>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
					{movies.map((movie, idx) => (
						<Link
							key={movie.id}
							href={`/wiki/dragon-ball/movie/${movie.id}`}
							className="group flex flex-col dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
							style={{ animationDelay: `${0.05 + idx * 0.03}s` }}
						>
							<div className="relative aspect-[2/3] bg-dbz-bg overflow-hidden">
								<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
								{movie.poster ? (
									<Image
										src={assetUrl(movie.poster)}
										alt={movie.title}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
										className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-zinc-900">
										<span className="text-zinc-700 font-saiyan text-3xl">
											?
										</span>
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
								{movie.trailerUrl && (
									<div className="absolute top-2 right-2 z-30">
										<span className="bg-dbz-red/80 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-widest">
											TRAILER
										</span>
									</div>
								)}
								<div className="absolute inset-x-0 bottom-0 p-4 z-30">
									<h3 className="font-display font-bold text-sm text-white leading-tight group-hover:text-dbz-orange transition-colors">
										{movie.title}
									</h3>
									{movie.titleJa && (
										<p
											className="text-[10px] text-dbz-orange/60 mt-1 font-bold"
											style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
										>
											{movie.titleJa}
										</p>
									)}
									<div className="flex items-center gap-3 mt-2 text-[10px] text-white/40 font-display tracking-widest uppercase">
										{movie.releaseDate && (
											<span>{new Date(movie.releaseDate).getFullYear()}</span>
										)}
										{movie.durationMin && <span>{movie.durationMin} min</span>}
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
