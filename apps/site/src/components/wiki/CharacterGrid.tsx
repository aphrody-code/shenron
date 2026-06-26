"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ViewTransition } from "@/components/ViewTransition";
import { WikiImg } from "@/components/wiki/WikiImg";

// Grille personnages filtrable (client). Importe `@/lib/assets` (client-safe),
// JAMAIS db-universe/shenron (server-only → `postgres` fuiterait dans le bundle).
export type GridCharacter = {
	id: number;
	name: string;
	nameJa: string | null;
	race: string | null;
	ki: string | null;
	image: string | null;
	/** Portrait XV2 — repli d'image quand `image` 404 (cf. WikiImg). */
	portraitXv2?: string | null;
};

// Normalise pour comparer sans accents/casse (recherche tolérante).
function norm(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim();
}

export function CharacterGrid({ characters }: { characters: GridCharacter[] }) {
	const [query, setQuery] = useState("");
	const [race, setRace] = useState<string | null>(null);

	// Facettes races (avec compte), triées par fréquence puis alpha.
	const races = useMemo(() => {
		const counts = new Map<string, number>();
		for (const c of characters) {
			if (!c.race) continue;
			counts.set(c.race, (counts.get(c.race) ?? 0) + 1);
		}
		return [...counts.entries()]
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.map(([name, n]) => ({ name, n }));
	}, [characters]);

	const filtered = useMemo(() => {
		const q = norm(query);
		return characters.filter((c) => {
			if (race && c.race !== race) return false;
			if (!q) return true;
			return norm(c.name).includes(q) || (c.nameJa ? c.nameJa.includes(query.trim()) : false);
		});
	}, [characters, query, race]);

	// Rendu progressif : on n'affiche pas 1000+ cartes d'un coup. « Voir plus »
	// par paliers (le filtre/la recherche réinitialisent la pagination).
	const PAGE = 120;
	const [limit, setLimit] = useState(PAGE);
	useEffect(() => {
		setLimit(PAGE);
	}, [query, race]);
	const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

	return (
		<div className="space-y-8">
			{/* Barre de contrôle : recherche + compteur live */}
			<div className="flex flex-col sm:flex-row sm:items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<svg
						className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<input
						type="search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Rechercher un guerrier…"
						aria-label="Rechercher un personnage"
						className="w-full h-11 pl-11 pr-4 rounded-full bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-dbz-orange/60 focus:bg-white/[0.07] transition-colors"
					/>
				</div>
				<p className="scouter-text text-[11px] text-dbz-orange whitespace-nowrap">
					{filtered.length} / {characters.length} guerriers
				</p>
			</div>

			{/* Facettes races */}
			{races.length > 0 && (
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => setRace(null)}
						className={`px-3.5 h-8 rounded-full text-[12px] font-display font-semibold tracking-wide transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
							race === null
								? "bg-dbz-orange text-black border-dbz-orange"
								: "bg-white/[0.04] text-white/70 border-white/[0.1] hover:text-white hover:border-white/30"
						}`}
					>
						Toutes
					</button>
					{races.map((r) => (
						<button
							key={r.name}
							type="button"
							onClick={() => setRace(race === r.name ? null : r.name)}
							className={`px-3.5 h-8 rounded-full text-[12px] font-display font-semibold tracking-wide transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
								race === r.name
									? "bg-dbz-orange text-black border-dbz-orange"
									: "bg-white/[0.04] text-white/70 border-white/[0.1] hover:text-white hover:border-white/30"
							}`}
						>
							{r.name}{" "}
							<span className={race === r.name ? "text-black/60" : "text-white/40"}>{r.n}</span>
						</button>
					))}
				</div>
			)}

			{/* Grille */}
			{filtered.length === 0 ? (
				<p className="py-20 text-center text-white/50 font-sans">
					Aucun guerrier ne correspond à « {query} ».
				</p>
			) : (
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 reveal-grid">
					{visible.map((c) => (
						<Link
							key={c.id}
							href={`/wiki/dragon-ball/character/${c.id}`}
							// `nav-forward` → slide directionnel à l'arrivée sur la fiche
							// (View Transitions). La fiche tag son "retour" en nav-back.
							transitionTypes={["nav-forward"]}
							className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300 ki-card"
						>
							<div className="relative aspect-[3/4] bg-dbz-bg overflow-hidden">
								<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
								{/* Morph d'élément partagé : ce thumbnail et l'image héro de la
								    fiche partagent `character-img-${id}` → la grille « se déplie »
								    en grande image au clic. WikiImg gère le repli (portrait XV2)
								    puis un placeholder stylé si l'image 404 (pas de vignette cassée). */}
								<ViewTransition name={`character-img-${c.id}`} share="morph">
									<WikiImg
										src={c.image}
										fallback={c.portraitXv2}
										alt={c.name}
										className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
									/>
								</ViewTransition>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-20" />
								{/* Liseré ki au survol (conic sweep piloté par @property) */}
								<span aria-hidden className="ki-card__glow" />
								<div className="absolute inset-x-0 bottom-0 p-2 z-30">
									{c.race && (
										<p className="scouter-text text-[8px] text-dbz-orange/90 mb-0.5 truncate">
											{c.race}
										</p>
									)}
									<p className="font-display font-bold text-[10px] text-white leading-tight group-hover:text-dbz-orange transition-colors truncate">
										{c.name}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}

			{filtered.length > limit && (
				<div className="flex justify-center pt-2">
					<button
						type="button"
						onClick={() => setLimit((l) => l + PAGE)}
						className="px-6 h-11 rounded-full bg-white/[0.06] border border-white/[0.12] text-sm font-display font-semibold text-white/80 hover:text-white hover:border-dbz-orange/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange transition-colors"
					>
						Voir plus ({filtered.length - limit} guerriers restants)
					</button>
				</div>
			)}
		</div>
	);
}
