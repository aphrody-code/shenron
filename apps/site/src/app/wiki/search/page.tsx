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
	const results = q.length >= 2 ? await dbUniverse.search(q) : null;

	return (
		<div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16 lg:py-24">
			<header className="mb-10">
				<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
					Recherche
				</p>
				<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-8">
					Explorer l'univers
				</h1>

				<form className="flex gap-2 max-w-2xl">
					<input
						type="search"
						name="q"
						defaultValue={q}
						placeholder="Goku, Namek, Tournoi du Pouvoir, Kakarot…"
						autoFocus
						className="flex-1 h-12 px-5 rounded-full bg-white/[0.06] border border-white/[0.08] focus:border-dbz-orange/60 focus:bg-white/[0.10] outline-none text-white placeholder:text-white/40 font-display text-[15px] transition-colors"
					/>
					<button
						type="submit"
						className="inline-flex items-center h-12 px-7 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[13px] tracking-[0.10em] uppercase transition-colors"
					>
						Chercher
					</button>
				</form>
			</header>

			{!results && q.length === 0 && (
				<p className="text-white/55 text-[15px]">
					Tape un nom de personnage, planète, saga, film ou jeu Dragon Ball.
				</p>
			)}

			{q.length > 0 && q.length < 2 && (
				<p className="text-white/55 text-[15px]">
					Au moins 2 caractères requis.
				</p>
			)}

			{results && (
				<div className="space-y-12">
					{results.characters.length > 0 && (
						<section>
							<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-2 mb-5">
								Personnages — {results.characters.length}
							</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
								{results.characters.map((c) => (
									<Link
										key={c.id}
										href={`/wiki/dragon-ball/character/${c.id}`}
										className="group block aspect-[3/4] relative rounded-xl overflow-hidden border border-white/[0.06] hover:border-dbz-orange transition-colors"
									>
										{c.image && (
											<Image
												src={assetUrl(c.image)}
												alt={c.name}
												fill
												sizes="(max-width: 768px) 50vw, 16vw"
												className="object-cover object-top opacity-95 group-hover:scale-105 transition-transform"
											/>
										)}
										<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-3 pt-10">
											<p className="font-display font-bold text-[13px] text-white">
												{c.name}
											</p>
											{c.name_ja && (
												<p className="font-jp text-[10px] text-dbz-orange/85 mt-0.5">
													{c.name_ja}
												</p>
											)}
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					{results.planets.length > 0 && (
						<section>
							<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-2 mb-5">
								Planètes — {results.planets.length}
							</h2>
							<ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
								{results.planets.map((p) => (
									<li
										key={p.id}
										className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
									>
										<p className="font-display font-bold text-white">
											{p.name}
										</p>
										{p.name_ja && (
											<p className="font-jp text-[12px] text-dbz-orange/80 mt-1">
												{p.name_ja}
											</p>
										)}
									</li>
								))}
							</ul>
						</section>
					)}

					{results.sagas.length > 0 && (
						<section>
							<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-2 mb-5">
								Sagas — {results.sagas.length}
							</h2>
							<ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{results.sagas.map((s) => (
									<li
										key={s.id}
										className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
									>
										<p className="font-display font-bold text-white">
											{s.name}
										</p>
										<p className="text-[11px] font-display tracking-[0.12em] uppercase text-white/50 mt-1">
											{s.series}
										</p>
									</li>
								))}
							</ul>
						</section>
					)}

					{results.movies.length > 0 && (
						<section>
							<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-2 mb-5">
								Films — {results.movies.length}
							</h2>
							<ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{results.movies.map((m) => (
									<li
										key={m.id}
										className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
									>
										<p className="font-display font-bold text-white">
											{m.title}
										</p>
										{m.title_ja && (
											<p className="font-jp text-[12px] text-dbz-orange/80 mt-1">
												{m.title_ja}
											</p>
										)}
									</li>
								))}
							</ul>
						</section>
					)}

					{results.games.length > 0 && (
						<section>
							<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-2 mb-5">
								Jeux — {results.games.length}
							</h2>
							<ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{results.games.map((g) => (
									<li
										key={g.id}
										className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
									>
										<p className="font-display font-bold text-white">
											{g.title}
										</p>
										{g.title_ja && (
											<p className="font-jp text-[12px] text-dbz-orange/80 mt-1">
												{g.title_ja}
											</p>
										)}
									</li>
								))}
							</ul>
						</section>
					)}

					{results.characters.length === 0 &&
						results.planets.length === 0 &&
						results.sagas.length === 0 &&
						results.movies.length === 0 &&
						results.games.length === 0 && (
							<div className="p-8 rounded-2xl bg-white/[0.04] border border-white/[0.06] max-w-2xl">
								<h2 className="font-display font-bold text-[20px] text-white mb-2">
									Aucun résultat pour « {q} »
								</h2>
								<p className="text-[14px] text-white/65 leading-relaxed mb-4">
									Essaie un autre terme — un nom de personnage, un titre de
									film, une saga, une planète ou un jeu. Notre catalogue couvre
									:
								</p>
								<ul className="text-[13px] text-white/65 space-y-1 list-disc list-inside">
									<li>58 personnages canon (Goku, Vegeta, Beerus, Jiren…)</li>
									<li>20 planètes (Terre, Namek, Vegeta, Yardrat…)</li>
									<li>
										29 sagas (Saiyans, Freezer, Cell, Buu, ToP, Granolah…)
									</li>
									<li>
										9 films (Battle of Gods, Resurrection F, Broly, Super Hero…)
									</li>
									<li>
										10 jeux Bandai (Kakarot, Sparking ZERO, Xenoverse,
										FighterZ…)
									</li>
								</ul>
							</div>
						)}
				</div>
			)}
		</div>
	);
}
