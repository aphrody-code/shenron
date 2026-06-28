import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/db-universe";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Recherche Dragon Ball — DBFR",
	description:
		"Recherche dans tout l'univers Dragon Ball : personnages, planètes, races, transformations, techniques, sagas, arcs, films, épisodes, jeux, tomes et chapitres du manga.",
	// Page de résultats paramétrée (?q=) : on ne veut pas indexer la combinatoire
	// d'URLs (contenu mince/dupliqué) mais on laisse suivre les liens sortants.
	robots: { index: false, follow: true },
	alternates: { canonical: "/wiki/search" },
};

async function WhisScouterPanel({ query }: { query: string }) {
	if (!query || query.length < 2) return null;
	const aiAnswer = await dbUniverse.ragChat(query, "whis");
	if (!aiAnswer || !aiAnswer.answer) return null;
	return (
		<section className="mb-12 reveal-up">
			<div className="flex items-center gap-6 mb-6">
				<h2 className="font-display font-bold text-lg text-cyan-400 tracking-wider flex items-center gap-2">
					<span className="text-xl">🥋</span> ASSISTANT WHIS (ANALYSE LORE)
				</h2>
				<div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
			</div>
			<div className="dbz-panel p-6 border-l-4 border-l-cyan-500 bg-cyan-950/15 backdrop-blur-md rounded-r-xl">
				<p className="text-cyan-100 text-base leading-relaxed italic">« {aiAnswer.answer} »</p>
				<div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500">
					<span>
						Mode :{" "}
						{aiAnswer.mode === "hybrid+rerank"
							? "Recherche Hybride + Rerank (SOTA)"
							: aiAnswer.mode === "hybrid"
								? "Recherche Hybride dense/lexicale"
								: "Recherche Lexicale"}
					</span>
					<span>Consigne : grondé sur les archives du temple</span>
				</div>
			</div>
		</section>
	);
}

function WhisScouterSkeleton() {
	return (
		<section className="mb-12 reveal-up animate-pulse">
			<div className="flex items-center gap-6 mb-6">
				<h2 className="font-display font-bold text-lg text-cyan-400/50 tracking-wider flex items-center gap-2">
					<span className="text-xl opacity-50">🥋</span> ASSISTANT WHIS (ANALYSE LORE EN COURS...)
				</h2>
				<div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
			</div>
			<div className="dbz-panel p-6 border-l-4 border-l-cyan-500/30 bg-cyan-950/5 backdrop-blur-md rounded-r-xl space-y-2">
				<div className="h-4 bg-cyan-500/10 rounded w-3/4"></div>
				<div className="h-4 bg-cyan-500/10 rounded w-5/6"></div>
				<div className="h-4 bg-cyan-500/10 rounded w-1/2"></div>
				<div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500/50 pt-2">
					<div className="h-2 bg-cyan-500/5 rounded w-24"></div>
					<div className="h-2 bg-cyan-500/5 rounded w-32"></div>
				</div>
			</div>
		</section>
	);
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const sp = await searchParams;
	const q = (sp.q ?? "").trim();
	const [results, rag] =
		q.length >= 2 ? await Promise.all([dbUniverse.search(q), dbUniverse.rag(q, 8)]) : [null, null];

	// Récap par catégorie (chips de saut + total) — n'affiche que les non vides.
	const summary: Array<[id: string, label: string, n: number]> = results
		? (
				[
					["characters", "Personnages", results.characters.length],
					["planets", "Planètes", results.planets.length],
					["sagas", "Sagas", results.sagas.length],
					["arcs", "Arcs", results.arcs.length],
					["movies", "Films", results.movies.length],
					["episodes", "Épisodes", results.episodes.length],
					["tomes", "Tomes", results.mangaVolumes.length],
					["chapitres", "Chapitres", results.mangaChapters.length],
					["games", "Jeux", results.games.length],
					["techniques", "Techniques", results.techniques.length],
					["races", "Races", results.races.length],
					["transformations", "Transformations", results.transformations.length],
				] as Array<[string, string, number]>
			).filter(([, , n]) => n > 0)
		: [];
	const totalResults = summary.reduce((acc, [, , n]) => acc + n, 0);

	return (
		<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<header className="mb-16">
				<p className="font-display font-semibold text-[12px] tracking-[0.2em] uppercase text-dbz-orange mb-4">
					Système de Détection
				</p>
				<h1 className="font-saiyan text-5xl md:text-7xl text-white mb-10 tracking-widest">
					EXPLORER L'UNIVERS
				</h1>

				<form className="flex flex-col sm:flex-row gap-4 max-w-3xl">
					<div className="relative flex-1">
						<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
							<span className="text-dbz-orange/50">🔍</span>
						</div>
						<input
							type="search"
							name="q"
							defaultValue={q}
							placeholder="Goku, Namek, Tournoi du Pouvoir, Kakarot…"
							autoFocus
							className="w-full h-14 pl-12 pr-5 rounded-xl bg-dbz-card/50 border-2 border-dbz-border focus:border-dbz-orange focus:bg-dbz-card outline-none text-white placeholder:text-white/30 font-display text-lg transition-all"
						/>
					</div>
					<button type="submit" className="dbz-button h-14 px-10">
						SCANNER
					</button>
				</form>
			</header>

			{!results && q.length === 0 && (
				<div className="dbz-panel p-8 max-w-2xl border-l-4 border-l-dbz-orange">
					<p className="text-white/70 text-lg leading-relaxed">
						Initialisation du Scouter... Tape un nom de personnage, planète, saga, film ou jeu
						Dragon Ball pour lancer la recherche.
					</p>
				</div>
			)}

			{q.length > 0 && q.length < 2 && (
				<div className="dbz-panel p-6 max-w-md border-l-4 border-l-dbz-red">
					<p className="text-red-400 font-bold uppercase tracking-widest text-sm">
						⚠️ Énergie insuffisante : Au moins 2 caractères requis.
					</p>
				</div>
			)}

			{q.length >= 2 && (
				<Suspense fallback={<WhisScouterSkeleton />}>
					<WhisScouterPanel query={q} />
				</Suspense>
			)}

			{rag && rag.results.length > 0 && (
				<section className="mb-16 reveal-up">
					<div className="flex items-center gap-6 mb-6">
						<h2 className="font-saiyan text-3xl text-dbz-blue-light uppercase tracking-widest">
							Réponses Scouter ({rag.results.length})
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/50 to-transparent" />
					</div>
					<div className="grid gap-3 md:grid-cols-2">
						{rag.results.map((r, i) => (
							<Link
								key={`${r.url}-${i}`}
								href={r.url}
								className="dbz-panel p-4 hover:border-dbz-orange transition-colors group"
							>
								<div className="flex items-center gap-2 mb-1">
									<span className="font-scouter text-[9px] tracking-[0.25em] uppercase text-dbz-orange shrink-0">
										{r.kind}
									</span>
									<span className="font-display font-bold text-white group-hover:text-dbz-orange transition-colors truncate">
										{r.title}
									</span>
									{typeof r.score === "number" && (
										<span className="ml-auto shrink-0 font-scouter text-[9px] tracking-[0.15em] text-emerald-400/70">
											{Math.round(r.score * 100)}%
										</span>
									)}
								</div>
								{r.snippet && (
									<p className="text-xs text-white/55 leading-relaxed line-clamp-2">{r.snippet}</p>
								)}
							</Link>
						))}
					</div>
				</section>
			)}

			{results && (
				<div className="space-y-20">
					{totalResults > 0 && (
						<div className="flex flex-wrap items-center gap-2 -mt-8">
							<span className="inline-flex items-center h-8 px-3.5 rounded-full bg-dbz-orange/15 text-dbz-orange border border-dbz-orange/40 text-[12px] font-display font-bold tracking-wide">
								{totalResults} résultat{totalResults > 1 ? "s" : ""}
							</span>
							{summary.map(([id, label, n]) => (
								<a
									key={id}
									href={`#${id}`}
									className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-dbz-orange/40 text-[12px] font-display font-semibold tracking-wide transition-colors"
								>
									{label}
									<span className="text-white/35 tabular-nums">{n}</span>
								</a>
							))}
						</div>
					)}

					{results.characters.length > 0 && (
						<section id="characters" className="reveal-up scroll-mt-24" style={{ animationDelay: "0.1s" }}>
							<div className="flex items-center gap-6 mb-8">
								<h2 className="font-saiyan text-3xl text-dbz-orange uppercase tracking-widest">
									Guerriers Détectés ({results.characters.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
								{results.characters.map((c, idx) => (
									<Link
										key={c.id}
										href={`/wiki/dragon-ball/character/${c.id}`}
										className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
										style={{ animationDelay: `${0.2 + idx * 0.03}s` }}
									>
										<div className="relative aspect-[3/4] bg-dbz-bg overflow-hidden">
											<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
											{c.image && (
												<Image
													src={assetUrl(c.image)}
													alt={c.name}
													fill
													sizes="(max-width: 768px) 50vw, 16vw"
													className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
												/>
											)}
											<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
											<div className="absolute inset-x-0 bottom-0 p-4 z-30">
												<p className="font-display font-bold text-sm text-white group-hover:text-dbz-orange transition-colors">
													{c.name}
												</p>
												{c.name_ja && (
													<p className="font-jp text-[10px] text-white/40 font-bold mt-1">
														{c.name_ja}
													</p>
												)}
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					{results.planets.length > 0 && (
						<section id="planets" className="reveal-up scroll-mt-24" style={{ animationDelay: "0.2s" }}>
							<div className="flex items-center gap-6 mb-8">
								<h2 className="font-saiyan text-3xl text-dbz-blue-light uppercase tracking-widest">
									Localisations ({results.planets.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/50 to-transparent" />
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
								{results.planets.map((p) => (
									<Link
										key={p.id}
										href={`/wiki/dragon-ball/planet/${p.id}`}
										className="group dbz-panel overflow-hidden hover:scale-[1.02] transition-all duration-300"
									>
										<div className="relative aspect-video bg-dbz-bg overflow-hidden p-3">
											<div className="absolute inset-0 starfield opacity-20" />
											{p.image ? (
												<img
													src={assetUrl(p.image)}
													alt={p.name}
													className="w-full h-full object-contain relative z-10 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_15px_rgba(75,168,255,0.2)]"
													loading="lazy"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<span className="text-dbz-blue-light/20 font-saiyan text-2xl">P</span>
												</div>
											)}
											<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-20" />
											<div className="absolute inset-x-0 bottom-0 p-2 text-center z-30">
												<p className="font-display font-bold text-sm text-white leading-tight group-hover:text-dbz-blue-light transition-colors">
													{p.name}
												</p>
												{p.name_ja && (
													<p className="font-jp text-[9px] text-dbz-blue-light/50 mt-0.5">
														{p.name_ja}
													</p>
												)}
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					<div className="grid md:grid-cols-2 gap-12">
						{results.sagas.length > 0 && (
							<section id="sagas" className="reveal-up scroll-mt-24" style={{ animationDelay: "0.3s" }}>
								<div className="flex items-center gap-6 mb-6">
									<h2 className="font-saiyan text-2xl text-dbz-orange uppercase tracking-widest">
										Chronologie
									</h2>
									<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
								</div>
								<div className="space-y-3">
									{results.sagas.map((s) => (
										<Link
											key={s.id}
											href={`/wiki/sagas/${s.slug}`}
											className="block dbz-panel p-4 hover:bg-white/5 transition-colors group"
										>
											<div className="flex justify-between items-center">
												<div>
													<p className="font-display font-bold text-white group-hover:text-dbz-orange transition-colors">
														{s.name}
													</p>
													<p className="text-[10px] font-display tracking-[0.2em] uppercase text-white/40 mt-1">
														{s.series}
													</p>
												</div>
												<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity">
													→
												</span>
											</div>
										</Link>
									))}
								</div>
							</section>
						)}

						{results.movies.length > 0 && (
							<section id="movies" className="reveal-up scroll-mt-24" style={{ animationDelay: "0.4s" }}>
								<div className="flex items-center gap-6 mb-6">
									<h2 className="font-saiyan text-2xl text-dbz-red uppercase tracking-widest">
										Archives Cinéma
									</h2>
									<div className="h-px flex-1 bg-gradient-to-r from-dbz-red/50 to-transparent" />
								</div>
								<div className="space-y-3">
									{results.movies.map((m) => (
										<Link
											key={m.id}
											href={`/wiki/films/${m.slug}`}
											className="block dbz-panel p-4 hover:bg-white/5 transition-colors group"
										>
											<div className="flex justify-between items-center">
												<div>
													<p className="font-display font-bold text-white group-hover:text-dbz-red transition-colors">
														{m.title}
													</p>
													{m.title_ja && (
														<p className="font-jp text-[10px] text-white/40 mt-1">{m.title_ja}</p>
													)}
												</div>
												<span className="text-dbz-red opacity-0 group-hover:opacity-100 transition-opacity">
													→
												</span>
											</div>
										</Link>
									))}
								</div>
							</section>
						)}
					</div>

					{results.games.length > 0 && (
						<section id="games" className="reveal-up scroll-mt-24" style={{ animationDelay: "0.45s" }}>
							<div className="flex items-center gap-6 mb-6">
								<h2 className="font-saiyan text-2xl text-dbz-blue-light uppercase tracking-widest">
									Jeux ({results.games.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/40 to-transparent" />
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
								{results.games.map((g) => (
									<Link
										key={g.id}
										href={`/wiki/jeux/${g.slug}`}
										className="block dbz-panel p-4 hover:bg-white/5 transition-colors group"
									>
										<p className="font-display font-bold text-white group-hover:text-dbz-blue-light transition-colors">
											{g.title}
										</p>
										{g.title_ja && (
											<p className="font-jp text-[10px] text-white/40 mt-1">{g.title_ja}</p>
										)}
									</Link>
								))}
							</div>
						</section>
					)}

					{results.episodes.length > 0 && (
						<section id="episodes" className="reveal-up scroll-mt-24" style={{ animationDelay: "0.5s" }}>
							<div className="flex items-center gap-6 mb-6">
								<h2 className="font-saiyan text-2xl text-dbz-blue-light uppercase tracking-widest">
									Épisodes ({results.episodes.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/40 to-transparent" />
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
								{results.episodes.map((e) => (
									<Link
										key={e.id}
										href={`/wiki/episodes/${e.id}`}
										className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
									>
										<div className="relative aspect-video bg-dbz-bg overflow-hidden">
											{e.image && (
												<Image
													src={assetUrl(e.image)}
													alt={e.title}
													fill
													sizes="(max-width: 768px) 50vw, 16vw"
													className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700"
												/>
											)}
											<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
											<div className="absolute inset-x-0 bottom-0 p-3">
												<p className="scouter-text text-[11px] text-dbz-orange">
													{e.series} #{e.number_in_series}
												</p>
												<p className="font-display font-bold text-xs text-white group-hover:text-dbz-blue-light transition-colors line-clamp-2">
													{e.title}
												</p>
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					{results.techniques.length > 0 && (
						<section id="techniques" className="reveal-up scroll-mt-24" style={{ animationDelay: "0.55s" }}>
							<div className="flex items-center gap-6 mb-6">
								<h2 className="font-saiyan text-2xl text-dbz-orange uppercase tracking-widest">
									Techniques ({results.techniques.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/40 to-transparent" />
							</div>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{results.techniques.map((t) => (
									<Link
										key={t.id}
										href={`/wiki/dragon-ball/techniques/${t.slug}`}
										className="block dbz-panel p-4 hover:bg-white/5 transition-colors group"
									>
										<p className="font-display font-bold text-white group-hover:text-dbz-orange transition-colors">
											{t.name}
										</p>
										{(t.name_ja || t.type) && (
											<p className="font-jp text-[10px] text-white/40 mt-1">
												{t.name_ja ?? t.type}
											</p>
										)}
									</Link>
								))}
							</div>
						</section>
					)}

					{results.races.length > 0 && (
						<section id="races" className="reveal-up scroll-mt-24">
							<div className="flex items-center gap-6 mb-6">
								<h2 className="font-saiyan text-2xl text-purple-400 uppercase tracking-widest">
									Races ({results.races.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-purple-400/40 to-transparent" />
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
								{results.races.map((r) => (
									<Link
										key={r.id}
										href={`/wiki/races/${r.slug}`}
										className="block dbz-panel p-4 hover:bg-white/5 transition-colors group"
									>
										<p className="font-display font-bold text-white group-hover:text-purple-400 transition-colors">
											{r.name}
										</p>
										{r.name_ja && (
											<p className="font-jp text-[10px] text-white/40 mt-1">{r.name_ja}</p>
										)}
									</Link>
								))}
							</div>
						</section>
					)}

					{results.transformations.length > 0 && (
						<section id="transformations" className="reveal-up scroll-mt-24">
							<div className="flex items-center gap-6 mb-6">
								<h2 className="font-saiyan text-2xl text-dbz-orange uppercase tracking-widest">
									Transformations ({results.transformations.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/40 to-transparent" />
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
								{results.transformations.map((t) => (
									<Link
										key={t.id}
										href={`/wiki/dragon-ball/character/${t.character_id}`}
										className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
									>
										<div className="relative aspect-[4/3] bg-dbz-bg overflow-hidden">
											{t.image ? (
												<img
													src={assetUrl(t.image)}
													alt={t.name}
													loading="lazy"
													className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center">
													<span className="text-dbz-orange/20 font-saiyan text-2xl">⚡</span>
												</div>
											)}
											<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
											<div className="absolute inset-x-0 bottom-0 p-3">
												<p className="font-display font-bold text-xs text-white group-hover:text-dbz-orange transition-colors line-clamp-2">
													{t.name}
												</p>
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					{results.arcs.length > 0 && (
						<section id="arcs" className="reveal-up scroll-mt-24">
							<div className="flex items-center gap-6 mb-6">
								<h2 className="font-saiyan text-2xl text-dbz-yellow uppercase tracking-widest">
									Arcs ({results.arcs.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-yellow/40 to-transparent" />
							</div>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{results.arcs.map((a) => (
									<Link
										key={a.id}
										href={`/wiki/arcs/${a.slug}`}
										className="block dbz-panel p-4 hover:bg-white/5 transition-colors group"
									>
										<p className="font-display font-bold text-white group-hover:text-dbz-yellow transition-colors">
											{a.name}
										</p>
										{a.name_ja && (
											<p className="font-jp text-[10px] text-white/40 mt-1">{a.name_ja}</p>
										)}
									</Link>
								))}
							</div>
						</section>
					)}

					{results.mangaVolumes.length > 0 && (
						<section id="tomes" className="reveal-up scroll-mt-24">
							<div className="flex items-center gap-6 mb-6">
								<h2 className="font-saiyan text-2xl text-white uppercase tracking-widest">
									Tomes ({results.mangaVolumes.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent" />
							</div>
							<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
								{results.mangaVolumes.map((v) => (
									<Link
										key={v.id}
										href={`/wiki/manga/volume/${v.id}`}
										className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
									>
										<div className="relative aspect-[2/3] bg-dbz-bg overflow-hidden">
											{v.cover ? (
												<img
													src={assetUrl(v.cover)}
													alt={v.title ?? `Tome ${v.volume_number}`}
													loading="lazy"
													className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center bg-zinc-900">
													<span className="text-zinc-700 font-saiyan text-xl">T{v.volume_number}</span>
												</div>
											)}
											<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
											<div className="absolute inset-x-0 bottom-0 p-2">
												<p className="scouter-text text-[9px] text-dbz-orange">
													{v.series} · T{v.volume_number}
												</p>
												{v.title && (
													<p className="font-display font-bold text-[10px] text-white leading-tight line-clamp-2">
														{v.title}
													</p>
												)}
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					{results.mangaChapters.length > 0 && (
						<section id="chapitres" className="reveal-up scroll-mt-24">
							<div className="flex items-center gap-6 mb-6">
								<h2 className="font-saiyan text-2xl text-white uppercase tracking-widest">
									Chapitres ({results.mangaChapters.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent" />
							</div>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{results.mangaChapters.map((c) => (
									<Link
										key={c.id}
										href={`/wiki/manga/${c.id}`}
										className="block dbz-panel p-4 hover:bg-white/5 transition-colors group"
									>
										<p className="scouter-text text-[10px] text-dbz-orange mb-1">
											{c.series} · Ch. {c.chapter_number}
										</p>
										<p className="font-display font-bold text-white group-hover:text-dbz-blue-light transition-colors line-clamp-2">
											{c.title ?? `Chapitre ${c.chapter_number}`}
										</p>
									</Link>
								))}
							</div>
						</section>
					)}

					{totalResults === 0 && (
							<div className="dbz-panel p-10 max-w-3xl border-l-4 border-l-dbz-red reveal-up">
								<h2 className="font-saiyan text-3xl text-white mb-4 tracking-widest">
									AUCUNE ÉNERGIE DÉTECTÉE
								</h2>
								<p className="text-white/60 text-lg leading-relaxed mb-8">
									Le Scouter n'a trouvé aucun résultat pour «{" "}
									<span className="text-dbz-orange font-bold">{q}</span> ». Essaie un autre terme —
									un nom de personnage, un titre de film, une saga ou une planète.
								</p>
								<div className="grid sm:grid-cols-2 gap-6 text-sm">
									<div className="space-y-2">
										<p className="text-dbz-orange font-bold uppercase tracking-widest">Guerriers</p>
										<p className="text-white/40">Goku, Vegeta, Beerus, Jiren, Broly...</p>
									</div>
									<div className="space-y-2">
										<p className="text-dbz-blue-light font-bold uppercase tracking-widest">
											Mondes
										</p>
										<p className="text-white/40">Terre, Namek, Vegeta, Yardrat, Kaio...</p>
									</div>
								</div>
							</div>
						)}
				</div>
			)}
		</div>
	);
}
