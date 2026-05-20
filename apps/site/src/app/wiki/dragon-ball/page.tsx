import {
	getShenronCharacters,
	getShenronMovies,
	getShenronPlanets,
	getShenronGames,
	type DBCharacter,
	type DBMovie,
	type DBPlanet,
	type DBGame,
} from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Wiki complet Dragon Ball — DBFR",
	description:
		"Encyclopédie Dragon Ball la plus complète. Personnages canon, planètes, transformations. Fiches avec ki, noms japonais, romaji.",
};

export default async function DragonBallWikiIndex() {
	const characters = await getShenronCharacters();
	const planets = await getShenronPlanets();
	const movies = await getShenronMovies();
	const games = await getShenronGames();

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Wiki"
				title="Encyclopédie Dragon Ball"
				lead={`${characters.length} personnages, ${planets.length} planètes, ${movies.length} films et ${games.length} jeux. Fiches croisées (API + Fandom), noms natifs 日本語 et Romaji.`}
				image={SAGAS_HERO}
				imageAlt="Personnages Dragon Ball"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24 space-y-32">
				
				<section className="reveal-up" style={{ animationDelay: "0.1s" }}>
					<div className="flex items-center gap-6 mb-12">
						<h2 className="font-saiyan text-4xl md:text-5xl text-dbz-orange uppercase tracking-widest whitespace-nowrap">
							Films & Hors-Séries
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
						{movies.map((movie: DBMovie, idx) => (
							<Link
								key={movie.id}
								href={`/wiki/dragon-ball/movie/${movie.id}`}
								className="group flex flex-col dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
								style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
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
											<span className="text-zinc-700 font-saiyan text-4xl">?</span>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-4 z-30">
										<h3 className="font-display font-bold text-sm text-white leading-tight group-hover:text-dbz-orange transition-colors">
											{movie.title}
										</h3>
										<p className="font-display text-[10px] tracking-[0.2em] uppercase text-dbz-orange/80 mt-2">
											{movie.series.replace("_MOVIE", "").replace("_SPECIAL", "")}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
					<div className="mt-12 text-center">
						<Link href="/wiki/dragon-ball/movies" className="dbz-button-ghost group">
							<span>Voir tous les films</span>
							<span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
						</Link>
					</div>
				</section>

				<section className="reveal-up" style={{ animationDelay: "0.2s" }}>
					<div className="flex items-center gap-6 mb-12">
						<h2 className="font-saiyan text-4xl md:text-5xl text-dbz-orange uppercase tracking-widest whitespace-nowrap">
							PERSONNAGES
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
						{characters.map((char: DBCharacter, idx) => (
							<Link
								key={char.id}
								href={`/wiki/dragon-ball/character/${char.id}`}
								className="group flex flex-col dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
								style={{ animationDelay: `${0.3 + idx * 0.03}s` }}
							>
								<div className="relative aspect-[3/4] bg-dbz-bg overflow-hidden">
									<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
									<Image
										src={assetUrl(char.image)}
										alt={char.name}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
										className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-4 z-30">
										<h3 className="font-display font-bold text-sm text-white leading-tight group-hover:text-dbz-orange transition-colors">
											{char.name}
										</h3>
										<div className="flex justify-between items-center mt-2">
											{char.race && (
												<p className="font-display text-[9px] tracking-[0.2em] uppercase text-dbz-orange/70">
													{char.race}
												</p>
											)}
											{char.nameJa && (
												<p className="text-[10px] text-white/40 font-bold" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
													{char.nameJa}
												</p>
											)}
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>

				<section className="reveal-up" style={{ animationDelay: "0.3s" }}>
					<div className="flex items-center gap-6 mb-12">
						<h2 className="font-saiyan text-4xl md:text-5xl text-dbz-blue-light uppercase tracking-widest whitespace-nowrap">
							PLANÈTES
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/50 to-transparent" />
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{planets.map((planet: DBPlanet, idx) => (
							<Link
								key={planet.id}
								href={`/wiki/dragon-ball/planet/${planet.id}`}
								className="group flex flex-col dbz-panel overflow-hidden hover:scale-[1.02] transition-all duration-300"
								style={{ animationDelay: `${0.4 + idx * 0.05}s` }}
							>
								<div className="relative aspect-video bg-dbz-bg overflow-hidden p-4">
									<div className="absolute inset-0 starfield opacity-20" />
									<img
										src={assetUrl(planet.image)}
										alt={planet.name}
										className="w-full h-full object-contain relative z-10 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_20px_rgba(75,168,255,0.2)]"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-5 text-center z-30">
										<h3 className="font-display font-bold text-lg text-white leading-tight group-hover:text-dbz-blue-light transition-colors tracking-wide">
											{planet.name}
										</h3>
										{planet.nameJa && (
											<p className="text-xs text-dbz-blue-light/60 mt-1 font-bold tracking-widest" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
												{planet.nameJa}
											</p>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>

				<section className="reveal-up" style={{ animationDelay: "0.4s" }}>
					<div className="flex items-center gap-6 mb-12">
						<h2 className="font-saiyan text-4xl md:text-5xl text-white uppercase tracking-widest whitespace-nowrap">
							JEUX VIDÉO
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
						{games.map((game: DBGame, idx) => (
							<Link
								key={game.id}
								href={`/wiki/dragon-ball/games/${game.slug}`}
								className="group flex flex-col dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
								style={{ animationDelay: `${0.5 + idx * 0.05}s` }}
							>
								<div className="relative aspect-[3/4] bg-dbz-bg overflow-hidden">
									<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
									{game.cover ? (
										<Image
											src={assetUrl(game.cover)}
											alt={game.title}
											fill
											sizes="(max-width: 640px) 50vw, 20vw"
											className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-zinc-900">
											<span className="text-zinc-700 font-saiyan text-4xl">GAME</span>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-4 z-30">
										<h3 className="font-display font-bold text-sm text-white leading-tight group-hover:text-dbz-orange transition-colors">
											{game.title}
										</h3>
										{game.platforms && (
											<p className="font-display text-[9px] tracking-[0.1em] uppercase text-white/40 mt-2">
												{game.platforms.split(",").join(" · ")}
											</p>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>
				
			</div>
		</div>
	);
}
