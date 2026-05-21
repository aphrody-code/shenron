import { getShenronMovies } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import Image from "next/image";
import Link from "next/link";

export default async function MoviesPage() {
	const movies = await getShenronMovies();

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-12 flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold text-orange-500">
						Films & Hors-Séries
					</h1>
					<p className="mt-2 text-zinc-400">
						Tous les films et épisodes spéciaux Dragon Ball, avec dates, durées
						et synopsis.
					</p>
				</div>
				<Link
					href="/wiki/dragon-ball"
					className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
				>
					Retour au Wiki
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{movies.map((movie) => (
					<Link
						key={movie.id}
						href={`/wiki/dragon-ball/movie/${movie.id}`}
						className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-orange-500/50"
					>
						<div className="relative aspect-[2/3] w-full overflow-hidden">
							{movie.poster ? (
								<Image
									src={assetUrl(movie.poster)}
									alt={movie.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-zinc-800">
									<span className="text-zinc-500">Pas d'image</span>
								</div>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
							<div className="absolute bottom-4 left-4 right-4">
								<span className="rounded-md bg-orange-600 px-2 py-1 text-xs font-bold text-white uppercase tracking-wider">
									{movie.series.replace("_MOVIE", "").replace("_SPECIAL", "")}
								</span>
							</div>
						</div>

						<div className="flex flex-1 flex-col p-6">
							<div className="mb-2">
								<h2 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">
									{movie.title}
								</h2>
								{movie.titleJa && (
									<p className="text-sm text-zinc-500 italic">
										{movie.titleJa}
									</p>
								)}
							</div>

							<div className="mb-4 flex flex-wrap gap-4 text-xs text-zinc-400">
								{movie.releaseDate && (
									<div className="flex items-center gap-1">
										<span>📅</span>
										{new Date(movie.releaseDate).getFullYear()}
									</div>
								)}
								{movie.durationMin && (
									<div className="flex items-center gap-1">
										<span>⏱️</span>
										{movie.durationMin} min
									</div>
								)}
							</div>

							{movie.synopsis && (
								<p className="line-clamp-3 text-sm text-zinc-400">
									{movie.synopsis}
								</p>
							)}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
