import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/db-universe";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Recherche Dragon Ball — DBFR",
	description:
		"Recherche cross-entity dans tout l'univers Dragon Ball : personnages, planètes, sagas, films, jeux.",
};

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const sp = await searchParams;
	const q = (sp.q ?? "").trim();
	const [results, rag] =
		q.length >= 2
			? await Promise.all([dbUniverse.search(q), dbUniverse.rag(q, 8)])
			: [null, null];

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
						Initialisation du Scouter... Tape un nom de personnage, planète,
						saga, film ou jeu Dragon Ball pour lancer la recherche.
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

			{rag && rag.results.length > 0 && (
				<section className="mb-16 reveal-up">
					<div className="flex items-center gap-6 mb-6">
						<h2 className="font-saiyan text-3xl text-dbz-blue-light uppercase tracking-widest whitespace-nowrap">
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
								</div>
								{r.snippet && (
									<p className="text-xs text-white/55 leading-relaxed line-clamp-2">
										{r.snippet}
									</p>
								)}
							</Link>
						))}
					</div>
				</section>
			)}

			{results && (
				<div className="space-y-20">
					{results.characters.length > 0 && (
						<section className="reveal-up" style={{ animationDelay: "0.1s" }}>
							<div className="flex items-center gap-6 mb-8">
								<h2 className="font-saiyan text-3xl text-dbz-orange uppercase tracking-widest whitespace-nowrap">
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
						<section className="reveal-up" style={{ animationDelay: "0.2s" }}>
							<div className="flex items-center gap-6 mb-8">
								<h2 className="font-saiyan text-3xl text-dbz-blue-light uppercase tracking-widest whitespace-nowrap">
									Localisations ({results.planets.length})
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/50 to-transparent" />
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
								{results.planets.map((p) => (
									<Link
										key={p.id}
										href={`/wiki/dragon-ball/planet/${p.id}`}
										className="dbz-panel p-5 hover:border-dbz-blue-light transition-colors group"
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="font-display font-bold text-white group-hover:text-dbz-blue-light transition-colors">
													{p.name}
												</p>
												{p.name_ja && (
													<p className="font-jp text-xs text-white/40 mt-1">
														{p.name_ja}
													</p>
												)}
											</div>
											<span className="text-dbz-blue-light opacity-0 group-hover:opacity-100 transition-opacity">
												→
											</span>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					<div className="grid md:grid-cols-2 gap-12">
						{results.sagas.length > 0 && (
							<section className="reveal-up" style={{ animationDelay: "0.3s" }}>
								<div className="flex items-center gap-6 mb-6">
									<h2 className="font-saiyan text-2xl text-dbz-orange uppercase tracking-widest whitespace-nowrap">
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
							<section className="reveal-up" style={{ animationDelay: "0.4s" }}>
								<div className="flex items-center gap-6 mb-6">
									<h2 className="font-saiyan text-2xl text-dbz-red uppercase tracking-widest whitespace-nowrap">
										Archives Cinéma
									</h2>
									<div className="h-px flex-1 bg-gradient-to-r from-dbz-red/50 to-transparent" />
								</div>
								<div className="space-y-3">
									{results.movies.map((m) => (
										<Link
											key={m.id}
											href={`/wiki/dragon-ball/movie/${m.id}`}
											className="block dbz-panel p-4 hover:bg-white/5 transition-colors group"
										>
											<div className="flex justify-between items-center">
												<div>
													<p className="font-display font-bold text-white group-hover:text-dbz-red transition-colors">
														{m.title}
													</p>
													{m.title_ja && (
														<p className="font-jp text-[10px] text-white/40 mt-1">
															{m.title_ja}
														</p>
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

					{results.characters.length === 0 &&
						results.planets.length === 0 &&
						results.sagas.length === 0 &&
						results.movies.length === 0 &&
						results.games.length === 0 && (
							<div className="dbz-panel p-10 max-w-3xl border-l-4 border-l-dbz-red reveal-up">
								<h2 className="font-saiyan text-3xl text-white mb-4 tracking-widest">
									AUCUNE ÉNERGIE DÉTECTÉE
								</h2>
								<p className="text-white/60 text-lg leading-relaxed mb-8">
									Le Scouter n'a trouvé aucun résultat pour «{" "}
									<span className="text-dbz-orange font-bold">{q}</span> ».
									Essaie un autre terme — un nom de personnage, un titre de
									film, une saga ou une planète.
								</p>
								<div className="grid sm:grid-cols-2 gap-6 text-sm">
									<div className="space-y-2">
										<p className="text-dbz-orange font-bold uppercase tracking-widest">
											Guerriers
										</p>
										<p className="text-white/40">
											Goku, Vegeta, Beerus, Jiren, Broly...
										</p>
									</div>
									<div className="space-y-2">
										<p className="text-dbz-blue-light font-bold uppercase tracking-widest">
											Mondes
										</p>
										<p className="text-white/40">
											Terre, Namek, Vegeta, Yardrat, Kaio...
										</p>
									</div>
								</div>
							</div>
						)}
				</div>
			)}
		</div>
	);
}
