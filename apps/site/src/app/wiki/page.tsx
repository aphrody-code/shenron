import Link from "next/link";
import {
	getShenronCharacters,
	getShenronMovies,
	getShenronPlanets,
	getShenronRaces,
	getShenronTechniques,
} from "@/lib/shenron";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import Image from "next/image";

export const revalidate = 3600;

// Sections du hub — descriptions dérivées des comptes RÉELS de la DB (Neon),
// plus aucun nombre codé en dur (la DB grossit, les libellés suivent).
function buildSections(c: Record<string, number>) {
	return [
		{
			title: "Personnages",
			desc: `${c.characters} guerriers — Saiyans, Nameks, dieux, androïdes.`,
			href: "/wiki/personnages",
			color: "border-dbz-orange text-dbz-orange",
		},
		{
			title: "Planètes",
			desc: `${c.planets} mondes à travers les douze univers.`,
			href: "/wiki/planetes",
			color: "border-dbz-blue-light text-dbz-blue-light",
		},
		{
			title: "Sagas",
			desc: `${c.sagas} sagas de Dragon Ball à Daima, arc par arc.`,
			href: "/wiki/sagas",
			color: "border-dbz-red text-dbz-red",
		},
		{
			title: "Films",
			desc: `${c.movies} long-métrages avec posters et trailers.`,
			href: "/wiki/films",
			color: "border-dbz-yellow text-dbz-yellow",
		},
		{
			title: "Épisodes",
			desc: `${c.episodes} épisodes avec vignettes, toutes séries.`,
			href: "/wiki/episodes",
			color: "border-dbz-blue-light text-dbz-blue-light",
		},
		{
			title: "Manga",
			desc: `${c.mangaVolumes} volumes et ${c.mangaChapters} chapitres (DB & Super).`,
			href: "/wiki/manga",
			color: "border-white text-white",
		},
		{
			title: "Jeux Vidéo",
			desc: `${c.games} titres officiels avec jaquettes.`,
			href: "/wiki/jeux",
			color: "border-green-400 text-green-400",
		},
		{
			title: "Races",
			desc: `${c.races} races avec personnages représentants.`,
			href: "/wiki/races",
			color: "border-purple-400 text-purple-400",
		},
		{
			title: "Techniques",
			desc: `${c.techniques} techniques et capacités spéciales.`,
			href: "/wiki/dragon-ball/techniques",
			color: "border-dbz-red text-dbz-red",
		},
		{
			title: "Recherche",
			desc: "Scouter global : personnages, planètes, films, techniques.",
			href: "/wiki/search",
			color: "border-green-500 text-green-500",
		},
	];
}

export default async function WikiIndex() {
	const [characters, movies, planets, races, techniques, episodesData, counts] =
		await Promise.all([
			getShenronCharacters(),
			getShenronMovies(),
			getShenronPlanets(),
			getShenronRaces(),
			getShenronTechniques(),
			dbUniverse.episodes("DBZ", 6, 0),
			dbUniverse.counts(),
		]);

	const c = counts ?? {
		characters: characters.length,
		planets: planets.length,
		sagas: 0,
		arcs: 0,
		movies: movies.length,
		episodes: 0,
		games: 0,
		races: races.length,
		techniques: techniques.length,
		transformations: 0,
		mangaVolumes: 0,
		mangaChapters: 0,
		news: 0,
		tools: 0,
	};
	const SECTIONS = buildSections(c);

	const featuredChars = characters.slice(0, 8);
	const featuredMovies = movies.slice(0, 6);
	const featuredPlanets = planets.slice(0, 4);
	const featuredEpisodes = episodesData?.episodes.slice(0, 6) ?? [];

	return (
		<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24 reveal-up space-y-24">
			<header className="mb-4">
				<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange mb-4">
					Base de données DBFR
				</p>
				<h1 className="text-5xl md:text-7xl font-saiyan text-white mb-6 tracking-widest leading-none">
					ARCHIVES SHENRON
				</h1>
				<p className="text-lg text-gray-400 max-w-3xl leading-relaxed font-sans">
					{characters.length} personnages &middot; {planets.length} planètes
					&middot; {movies.length} films &middot; {techniques.length} techniques
					&middot; {races.length} races &middot; {c.episodes} épisodes. Tout
					l&apos;univers Dragon Ball en français.
				</p>
			</header>

			{/* Navigation sections */}
			<section>
				<div className="flex items-center gap-6 mb-10">
					<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest">
						Catégories
					</h2>
					<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
					{SECTIONS.map((s, idx) => (
						<Link
							key={s.title}
							href={s.href}
							className={`dbz-panel p-6 border-l-4 ${s.color} hover:bg-white/5 transition-all group reveal-up`}
							style={{ animationDelay: `${0.05 + idx * 0.04}s` }}
						>
							<h2 className="text-xl font-saiyan uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">
								{s.title}
							</h2>
							<p className="text-gray-400 text-xs font-sans leading-relaxed">
								{s.desc}
							</p>
						</Link>
					))}
				</div>
			</section>

			{/* Featured characters */}
			{featuredChars.length > 0 && (
				<section className="reveal-up" style={{ animationDelay: "0.1s" }}>
					<div className="flex items-center justify-between gap-6 mb-8">
						<div className="flex items-center gap-6">
							<h2 className="font-saiyan text-3xl md:text-4xl text-dbz-orange uppercase tracking-widest">
								Guerriers
							</h2>
							<div className="h-px w-24 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
						</div>
						<Link
							href="/wiki/personnages"
							className="text-[11px] font-bold text-dbz-orange/70 hover:text-dbz-orange uppercase tracking-widest transition-colors whitespace-nowrap"
						>
							Voir tous ({c.characters}) →
						</Link>
					</div>
					<div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4">
						{featuredChars.map((char, idx) => (
							<Link
								key={char.id}
								href={`/wiki/dragon-ball/character/${char.id}`}
								className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
								style={{ animationDelay: `${0.15 + idx * 0.04}s` }}
							>
								<div className="relative aspect-[3/4] bg-dbz-bg overflow-hidden">
									<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
									<Image
										src={assetUrl(char.image)}
										alt={char.name}
										fill
										sizes="(max-width: 768px) 25vw, 12vw"
										className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
										loading="lazy"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-2 z-30">
										<p className="font-display font-bold text-[10px] text-white leading-tight group-hover:text-dbz-orange transition-colors truncate">
											{char.name}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Featured films */}
			{featuredMovies.length > 0 && (
				<section className="reveal-up" style={{ animationDelay: "0.2s" }}>
					<div className="flex items-center justify-between gap-6 mb-8">
						<div className="flex items-center gap-6">
							<h2 className="font-saiyan text-3xl md:text-4xl text-dbz-yellow uppercase tracking-widest">
								Films
							</h2>
							<div className="h-px w-24 bg-gradient-to-r from-dbz-yellow/50 to-transparent" />
						</div>
						<Link
							href="/wiki/films"
							className="text-[11px] font-bold text-dbz-orange/70 hover:text-dbz-orange uppercase tracking-widest transition-colors whitespace-nowrap"
						>
							Voir tous ({movies.length}) →
						</Link>
					</div>
					<div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
						{featuredMovies.map((movie, idx) => (
							<Link
								key={movie.id}
								href={`/wiki/films/${movie.slug}`}
								className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
								style={{ animationDelay: `${0.25 + idx * 0.04}s` }}
							>
								<div className="relative aspect-[2/3] bg-dbz-bg overflow-hidden">
									<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
									{movie.poster ? (
										<Image
											src={assetUrl(movie.poster)}
											alt={movie.title}
											fill
											sizes="(max-width: 768px) 33vw, 16vw"
											className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
											loading="lazy"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-zinc-900">
											<span className="text-zinc-700 font-saiyan text-2xl">
												?
											</span>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-2 z-30">
										<p className="font-display font-bold text-[10px] text-white leading-tight group-hover:text-dbz-yellow transition-colors line-clamp-2">
											{movie.title}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Featured episodes */}
			{featuredEpisodes.length > 0 && (
				<section className="reveal-up" style={{ animationDelay: "0.3s" }}>
					<div className="flex items-center justify-between gap-6 mb-8">
						<div className="flex items-center gap-6">
							<h2 className="font-saiyan text-3xl md:text-4xl text-dbz-blue-light uppercase tracking-widest">
								Épisodes
							</h2>
							<div className="h-px w-24 bg-gradient-to-r from-dbz-blue-light/50 to-transparent" />
						</div>
						<Link
							href="/wiki/episodes"
							className="text-[11px] font-bold text-dbz-orange/70 hover:text-dbz-orange uppercase tracking-widest transition-colors whitespace-nowrap"
						>
							{c.episodes} épisodes →
						</Link>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
						{featuredEpisodes.map((ep, idx) => (
							<Link
								key={ep.id}
								href={`/wiki/episodes/${ep.id}`}
								className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
								style={{ animationDelay: `${0.35 + idx * 0.04}s` }}
							>
								<div className="relative aspect-video bg-dbz-bg overflow-hidden">
									{ep.image ? (
										<img
											src={assetUrl(ep.image)}
											alt={ep.title}
											className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
											loading="lazy"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-zinc-900">
											<span className="text-zinc-700 font-saiyan text-xl">
												EP
											</span>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
									<div className="absolute inset-x-0 bottom-0 p-2">
										<p className="scouter-text text-[9px] text-dbz-orange mb-0.5">
											#{String(ep.number_in_series).padStart(3, "0")}
										</p>
										<p className="font-display font-bold text-[10px] text-white leading-tight group-hover:text-dbz-blue-light transition-colors line-clamp-2">
											{ep.title}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Planets */}
			{featuredPlanets.length > 0 && (
				<section className="reveal-up" style={{ animationDelay: "0.4s" }}>
					<div className="flex items-center justify-between gap-6 mb-8">
						<div className="flex items-center gap-6">
							<h2 className="font-saiyan text-3xl md:text-4xl text-dbz-blue-light uppercase tracking-widest">
								Planètes
							</h2>
							<div className="h-px w-24 bg-gradient-to-r from-dbz-blue-light/50 to-transparent" />
						</div>
						<Link
							href="/wiki/planetes"
							className="text-[11px] font-bold text-dbz-orange/70 hover:text-dbz-orange uppercase tracking-widest transition-colors whitespace-nowrap"
						>
							{planets.length} mondes →
						</Link>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
						{featuredPlanets.map((planet, idx) => (
							<Link
								key={planet.id}
								href={`/wiki/dragon-ball/planet/${planet.id}`}
								className="group flex flex-col dbz-panel overflow-hidden hover:scale-[1.02] transition-all duration-300"
								style={{ animationDelay: `${0.45 + idx * 0.05}s` }}
							>
								<div className="relative aspect-video bg-dbz-bg overflow-hidden p-3">
									<div className="absolute inset-0 starfield opacity-20" />
									<img
										src={assetUrl(planet.image)}
										alt={planet.name}
										className="w-full h-full object-contain relative z-10 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_20px_rgba(75,168,255,0.2)]"
										loading="lazy"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-3 text-center z-30">
										<p className="font-display font-bold text-sm text-white leading-tight group-hover:text-dbz-blue-light transition-colors">
											{planet.name}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Contribution banner */}
			<section className="dbz-panel p-10 bg-dbz-card/30 border-t-4 border-t-dbz-orange relative overflow-hidden">
				<div className="absolute inset-0 halftone opacity-5 pointer-events-none" />
				<div className="relative z-10">
					<h2 className="font-saiyan text-3xl text-white mb-4 tracking-widest">
						CONTRIBUTION
					</h2>
					<p className="text-gray-300 max-w-3xl mb-8 font-sans">
						Ces archives s&apos;appuient sur l&apos;API Shenron et sur les
						ajouts de la communauté. Une erreur, un manque ? Signale-le sur
						Discord.
					</p>
					<Link href="/about" className="dbz-button-ghost">
						EN SAVOIR PLUS
					</Link>
				</div>
			</section>
		</div>
	);
}
