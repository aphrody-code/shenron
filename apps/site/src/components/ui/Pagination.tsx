"use client";

/**
 * Pagination — barre de navigation par pages pour les listes filtrées côté
 * client (grille de personnages, index longs).
 *
 * Elle remplace le bouton « Voir plus » qui empilait les cartes sans jamais en
 * retirer : sur 1 307 personnages, six clics mettaient 720 cartes dans le DOM,
 * la position n'était ni affichée ni partageable, et revenir en arrière
 * repartait de zéro. Ici la fenêtre est bornée, la position est écrite dans
 * l'URL (`?p=3`, en `replaceState` — aucun aller-retour serveur, donc le cache
 * CDN de la page reste intact), et le lecteur sait toujours où il en est.
 *
 * Le rendu des numéros suit la règle habituelle : première et dernière pages
 * toujours visibles, une fenêtre glissante autour de la page courante, des
 * ellipses ailleurs — jamais 12 boutons sur mobile.
 */
import { ChevronDroite, ChevronGauche } from "@/components/icones";
import { useCallback, useEffect, useMemo } from "react";

const nf = new Intl.NumberFormat("fr-FR");

/** Numéros à afficher, `null` = ellipse. */
export function pagesVisibles(page: number, total: number, fenetre = 1): Array<number | null> {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const set = new Set<number>([1, total, page]);
	for (let d = 1; d <= fenetre; d++) {
		if (page - d > 1) set.add(page - d);
		if (page + d < total) set.add(page + d);
	}
	// Garde une largeur constante quand on est à un bord (sinon la barre saute).
	if (page <= 3) [2, 3, 4].forEach((n) => n < total && set.add(n));
	if (page >= total - 2) [total - 1, total - 2, total - 3].forEach((n) => n > 1 && set.add(n));

	const tri = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
	const out: Array<number | null> = [];
	let precedent = 0;
	for (const n of tri) {
		if (precedent && n - precedent > 1) out.push(null);
		out.push(n);
		precedent = n;
	}
	return out;
}

export function Pagination({
	page,
	parPage,
	total,
	onPageChange,
	/** Paramètre d'URL synchronisé. `null` = ne rien écrire dans l'URL. */
	urlParam = "p",
	/** Nom des éléments comptés, pour le libellé (« 121–240 sur 1 307 fiches »). */
	unite = "résultats",
	className = "",
}: {
	page: number;
	parPage: number;
	total: number;
	onPageChange: (page: number) => void;
	urlParam?: string | null;
	unite?: string;
	className?: string;
}) {
	const pages = Math.max(1, Math.ceil(total / parPage));
	const debut = total === 0 ? 0 : (page - 1) * parPage + 1;
	const fin = Math.min(total, page * parPage);
	const numeros = useMemo(() => pagesVisibles(page, pages), [page, pages]);

	// Position dans l'URL, sans navigation : partageable et restaurée au retour
	// arrière, sans faire basculer la page en rendu dynamique.
	useEffect(() => {
		if (!urlParam) return;
		const url = new URL(window.location.href);
		if (page <= 1) url.searchParams.delete(urlParam);
		else url.searchParams.set(urlParam, String(page));
		window.history.replaceState(null, "", url.toString());
	}, [page, urlParam]);

	const aller = useCallback(
		(p: number) => {
			const cible = Math.min(pages, Math.max(1, p));
			if (cible === page) return;
			onPageChange(cible);
			// Ramener en haut de liste : sans ça, changer de page laisse le lecteur
			// au milieu de la page précédente, devant des cartes qui ont changé.
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
		[page, pages, onPageChange]
	);

	if (total === 0) return null;

	// h-11/min-w-11 = 44 px : sous cette taille, viser le « 3 » d'une pagination
	// au pouce fait atterrir sur le « 2 ». `px-1.5` et non `px-2` : à 320 px
	// (iPhone SE), sept boutons de 44 px plus les chevrons débordaient de 20 px
	// — mesuré, et c'est la rangée entière qui sortait à gauche parce qu'elle
	// est centrée. La marge horizontale ne coûte rien puisque `min-w-11` tient
	// déjà la cible tactile.
	const btn =
		"grid h-11 min-w-11 place-items-center rounded-lg px-1.5 font-display text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60 disabled:cursor-not-allowed disabled:opacity-35";

	return (
		<div className={`flex flex-col items-center gap-3 ${className}`}>
			<p className="font-scouter text-[11px] tabular-nums text-white/45">
				{nf.format(debut)}–{nf.format(fin)} sur {nf.format(total)} {unite}
			</p>

			{pages > 1 && (
				<nav
					aria-label="Pagination"
					// `flex-wrap` + `justify-center` : la ceinture. Même resserrée, une
					// pagination à beaucoup de pages finira par ne plus tenir sur un
					// écran étroit — mieux vaut qu'elle passe à la ligne que de pousser
					// toute la page hors du viewport.
					className="flex max-w-full flex-wrap items-center justify-center gap-1"
				>
					<button
						type="button"
						onClick={() => aller(page - 1)}
						disabled={page <= 1}
						aria-label="Page précédente"
						className={`${btn} text-white/70 hover:bg-white/[0.06] hover:text-white`}
					>
						<ChevronGauche className="h-4 w-4" />
					</button>

					{numeros.map((n, i) =>
						n === null ? (
							<span
								key={`gap-${i}`}
								aria-hidden
								className="grid h-11 w-5 place-items-center text-white/30"
							>
								…
							</span>
						) : (
							<button
								key={n}
								type="button"
								onClick={() => aller(n)}
								aria-current={n === page ? "page" : undefined}
								aria-label={`Page ${n}`}
								className={`${btn} tabular-nums ${
									n === page
										? "bg-dbz-orange text-black"
										: "text-white/70 hover:bg-white/[0.06] hover:text-white"
								}`}
							>
								{n}
							</button>
						)
					)}

					<button
						type="button"
						onClick={() => aller(page + 1)}
						disabled={page >= pages}
						aria-label="Page suivante"
						className={`${btn} text-white/70 hover:bg-white/[0.06] hover:text-white`}
					>
						<ChevronDroite className="h-4 w-4" />
					</button>
				</nav>
			)}
		</div>
	);
}
