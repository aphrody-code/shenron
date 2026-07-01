"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ViewTransition } from "@/components/ViewTransition";
import { WikiImg } from "@/components/wiki/WikiImg";
import { CharacterFilterModal, type FacetOption } from "@/components/wiki/CharacterFilterModal";

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

/**
 * Facettes de filtrage servies par `dbUniverse.characterFacets()` (server) :
 * options Techniques/Arcs + mappings perso→techniques/arcs (sparse) pour le
 * filtrage cumulatif client. Optionnel : la grille dégrade en filtre Race seul
 * si la DB n'a pas répondu.
 */
export type CharacterFacets = {
	techniqueOptions: FacetOption[];
	arcOptions: FacetOption[];
	charTechniques: Record<string, string[]>;
	charArcs: Record<string, string[]>;
};

// Normalise pour comparer sans accents/casse (recherche tolérante).
function norm(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim();
}

export function CharacterGrid({
	characters,
	facets,
}: {
	characters: GridCharacter[];
	facets?: CharacterFacets;
}) {
	const [query, setQuery] = useState("");
	const [races, setRaces] = useState<string[]>([]);
	const [techniques, setTechniques] = useState<string[]>([]);
	const [arcs, setArcs] = useState<string[]>([]);
	const [modalOpen, setModalOpen] = useState(false);

	const techniqueOptions = facets?.techniqueOptions ?? [];
	const arcOptions = facets?.arcOptions ?? [];
	const charTechniques = facets?.charTechniques ?? {};
	const charArcs = facets?.charArcs ?? {};

	// Facettes races (avec compte), triées par fréquence puis alpha → options du
	// filtre. Reste dérivé des personnages (colonne `race`, pas de la jointure).
	const raceOptions = useMemo(() => {
		const counts = new Map<string, number>();
		for (const c of characters) {
			if (!c.race) continue;
			counts.set(c.race, (counts.get(c.race) ?? 0) + 1);
		}
		return [...counts.entries()]
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.map(([value, count]) => ({ value, label: value, count }));
	}, [characters]);

	// Filtrage CUMULATIF : ET entre catégories (race ET technique ET arc ET
	// recherche), OU à l'intérieur d'une catégorie.
	const filtered = useMemo(() => {
		const q = norm(query);
		const raceSet = races.length ? new Set(races) : null;
		const techSet = techniques.length ? new Set(techniques) : null;
		const arcSet = arcs.length ? new Set(arcs) : null;
		return characters.filter((c) => {
			if (raceSet && (!c.race || !raceSet.has(c.race))) return false;
			if (techSet) {
				const ct = charTechniques[String(c.id)];
				if (!ct || !ct.some((t) => techSet.has(t))) return false;
			}
			if (arcSet) {
				const ca = charArcs[String(c.id)];
				if (!ca || !ca.some((a) => arcSet.has(a))) return false;
			}
			if (!q) return true;
			return norm(c.name).includes(q) || (c.nameJa ? c.nameJa.includes(query.trim()) : false);
		});
	}, [characters, query, races, techniques, arcs, charTechniques, charArcs]);

	// Rendu progressif : on n'affiche pas 1000+ cartes d'un coup. « Voir plus »
	// par paliers (le filtre/la recherche réinitialisent la pagination).
	const PAGE = 120;
	const [limit, setLimit] = useState(PAGE);
	useEffect(() => {
		setLimit(PAGE);
	}, [query, races, techniques, arcs]);
	const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

	const activeCount = races.length + techniques.length + arcs.length;
	const resetFilters = () => {
		setRaces([]);
		setTechniques([]);
		setArcs([]);
	};

	return (
		<div className="space-y-8">
			{/* Toolbar : recherche + bouton « Filtrer » (ouvre la modale Race /
			    Techniques / Arcs, cumulatif) + compteur live. */}
			<div className="flex flex-col sm:flex-row sm:items-center gap-3">
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
				<button
					type="button"
					onClick={() => setModalOpen(true)}
					aria-haspopup="dialog"
					className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-display font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange ${
						activeCount > 0
							? "border-dbz-orange/60 bg-dbz-orange/10 text-dbz-orange"
							: "border-white/[0.12] bg-white/[0.05] text-white/80 hover:border-dbz-orange/60 hover:text-white"
					}`}
				>
					<SlidersHorizontal className="h-4 w-4" />
					Filtrer
					{activeCount > 0 && (
						<span className="grid h-5 min-w-5 place-items-center rounded-full bg-dbz-orange px-1.5 text-[11px] font-bold text-black">
							{activeCount}
						</span>
					)}
				</button>
				{activeCount > 0 && (
					<button
						type="button"
						onClick={resetFilters}
						className="text-[11px] font-bold uppercase tracking-wider text-white/45 hover:text-dbz-orange transition-colors"
					>
						Réinitialiser
					</button>
				)}
				<p className="scouter-text text-[11px] text-dbz-orange whitespace-nowrap sm:ml-auto">
					{filtered.length} / {characters.length} guerriers
				</p>
			</div>

			{/* Grille */}
			{filtered.length === 0 ? (
				<p className="py-20 text-center text-white/50 font-sans">
					Aucun guerrier ne correspond {query ? `à « ${query} »` : "à ces filtres"}.
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

			<CharacterFilterModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				raceOptions={raceOptions}
				techniqueOptions={techniqueOptions}
				arcOptions={arcOptions}
				races={races}
				techniques={techniques}
				arcs={arcs}
				onRaces={setRaces}
				onTechniques={setTechniques}
				onArcs={setArcs}
				onReset={resetFilters}
				resultCount={filtered.length}
				totalCount={characters.length}
			/>
		</div>
	);
}
