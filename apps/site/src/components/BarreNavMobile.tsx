"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useMe } from "@/lib/use-me";
import { SignOut } from "@/components/SignOut";
import {
	Maison,
	MaisonPleine,
	Tv,
	Film,
	Livre,
	Ellipse,
	Croix,
	type ProprietesIcone,
} from "@/components/icones";

/**
 * BarreNavMobile — la barre de navigation basse, façon Android natif.
 *
 * ## Pourquoi elle existe, et pourquoi CES destinations
 *
 * Le choix n'est pas éditorial : il est tiré de `public.site_events`, 10 624
 * vues de page sur 71 jours (2026-06-26 → 2026-09-04), `/admin` exclu
 * puisqu'il n'est vu que par les 94 comptes du staff.
 *
 * | Destination | Vues | **Visiteurs distincts** |
 * |---|---:|---:|
 * | `/wiki` (tout) | 5 686 | **693** |
 * | `/wiki/episodes` | 2 410 | **512** |
 * | accueil | 894 | **358** |
 * | `/wiki/films` | 507 | 153 |
 * | `/wiki/chronologie` | 199 | 120 |
 * | `/wiki/manga` | 417 | 90 |
 * | `/wiki/databooks` | 1 140 | 89 |
 * | `/wiki/jeux` | 491 | 76 |
 *
 * Le classement retenu est celui des **visiteurs**, pas des vues : les
 * databooks pèsent 1 140 vues pour 89 personnes — c'est un atelier de
 * relecture, pas une destination de premier rang. Aux vues brutes ils
 * passeraient devant les films, qui touchent pourtant 1,7 fois plus de monde.
 *
 * ## La structure
 *
 * Material 3 borne une barre de navigation à 3-5 destinations. Le site en a
 * une dizaine : les quatre premières sont fixes, la cinquième est un « Plus »
 * qui ouvre une feuille avec le reste. Le menu hamburger de la barre du haut
 * disparaît en conséquence — deux systèmes de navigation sur le même écran,
 * l'un en haut hors de portée du pouce et l'autre en bas, c'est une hésitation,
 * pas un choix.
 *
 * ## Les mesures
 *
 * Relevées dans `material-components-android`,
 * `bottomnavigation/res/values/dimens.xml` — ce sont les tokens que compile
 * l'implémentation officielle, pas une lecture d'article :
 *
 * | Token | Valeur |
 * |---|---|
 * | `m3_bottom_nav_min_height` | **80 dp** |
 * | `m3_bottom_nav_item_padding_top` | 12 dp |
 * | `m3_bottom_nav_item_padding_bottom` | 16 dp |
 * | `m3_bottom_nav_item_active_indicator_width` | **64 dp** |
 * | `m3_bottom_nav_item_active_indicator_height` | **32 dp** |
 * | `m3_bottom_nav_item_active_indicator_margin_horizontal` | 4 dp |
 * | `design_bottom_navigation_icon_size` | **24 dp** |
 * | `design_bottom_navigation_text_size` | 12 sp |
 * | `design_bottom_navigation_item_min_width` | 56 dp |
 * | `mtrl_min_touch_target_size` | **48 dp** |
 *
 * L'état sélectionné se lit à trois signes cumulés, comme sur Android : la
 * pilule d'indicateur, le glyphe qui passe du trait à l'aplat, et le libellé
 * qui prend du gras. Un seul de ces trois signes ne suffit pas — la couleur
 * seule échouerait pour un daltonien, et l'indicateur seul se perd sur une
 * capture.
 */

type Destination = {
	readonly href: string;
	readonly label: string;
	/** Glyphe au trait — état de repos. */
	readonly Icone: (p: ProprietesIcone) => React.ReactElement;
	/** Glyphe en aplat — état sélectionné. Material 3 double l'indicateur d'un
	 *  changement de graisse du glyphe lui-même. */
	readonly IconeActive?: (p: ProprietesIcone) => React.ReactElement;
};

const DESTINATIONS: readonly Destination[] = [
	{ href: "/", label: "Accueil", Icone: Maison, IconeActive: MaisonPleine },
	{ href: "/wiki/episodes", label: "Épisodes", Icone: Tv },
	{ href: "/wiki/films", label: "Films", Icone: Film },
	{ href: "/wiki", label: "Univers", Icone: Livre },
];

/** Le reste des rubriques, dans la feuille « Plus ». Ordre : visiteurs décroissants. */
const AUTRES: ReadonlyArray<{ href: string; label: string; note: string }> = [
	{ href: "/wiki/chronologie", label: "Chronologie", note: "La frise de l'univers" },
	{ href: "/wiki/manga", label: "Manga", note: "Tomes et chapitres" },
	{ href: "/wiki/databooks", label: "Databooks", note: "Daizenshuu et guides" },
	{ href: "/wiki/jeux", label: "Jeux", note: "Trente ans d'adaptations" },
	{ href: "/actualites", label: "News", note: "L'actualité de la licence" },
	{ href: "/classements", label: "Classements", note: "Les tops de la communauté" },
	{ href: "/tierlists", label: "Tier lists", note: "Classer et voter" },
	{ href: "/profil/me", label: "Mon profil", note: "Niveau, favoris, zénis" },
];

/**
 * Destination active par CORRESPONDANCE LA PLUS LONGUE, comme une table de
 * routage. `/wiki/episodes` est un enfant de `/wiki` : une correspondance par
 * simple préfixe allumerait les deux items à la fois. On garde donc le préfixe
 * le plus long qui corresponde, et `/` n'est actif que sur l'égalité exacte.
 */
function destinationActive(chemin: string): string | null {
	let gagnant: string | null = null;
	for (const d of DESTINATIONS) {
		if (d.href === "/") {
			if (chemin === "/") gagnant = "/";
			continue;
		}
		if (chemin === d.href || chemin.startsWith(`${d.href}/`)) {
			if (!gagnant || d.href.length > gagnant.length) gagnant = d.href;
		}
	}
	return gagnant;
}

export function BarreNavMobile() {
	const chemin = usePathname() ?? "/";
	const actif = destinationActive(chemin);
	const me = useMe();
	const [feuille, setFeuille] = useState(false);
	const idFeuille = useId();
	const boutonPlus = useRef<HTMLButtonElement>(null);
	const panneau = useRef<HTMLDivElement>(null);

	const fermer = useCallback(() => {
		setFeuille(false);
		// Le focus REVIENT au bouton qui a ouvert la feuille : c'est la règle des
		// pratiques ARIA pour un disclosure, et sans elle le focus retombe sur
		// `<body>` — le lecteur d'écran repart du haut de la page.
		boutonPlus.current?.focus();
	}, []);

	useEffect(() => {
		if (!feuille) return;
		const auClavier = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				fermer();
				return;
			}
			if (e.key !== "Tab" || !panneau.current) return;
			// Piège de focus : la feuille est `aria-modal`, le Tab ne doit pas en
			// sortir vers le contenu qu'elle recouvre.
			const cibles = panneau.current.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled])'
			);
			if (cibles.length === 0) return;
			const premier = cibles[0];
			const dernier = cibles[cibles.length - 1];
			if (e.shiftKey && document.activeElement === premier) {
				e.preventDefault();
				dernier.focus();
			} else if (!e.shiftKey && document.activeElement === dernier) {
				e.preventDefault();
				premier.focus();
			}
		};
		document.addEventListener("keydown", auClavier);
		return () => document.removeEventListener("keydown", auClavier);
	}, [feuille, fermer]);

	// La feuille se referme sur navigation : sans cela, revenir en arrière la
	// laisse ouverte par-dessus la page précédente.
	useEffect(() => {
		setFeuille(false);
	}, [chemin]);

	return (
		<>
			{feuille && (
				<>
					{/* Voile : un bouton, pas un div — il est cliquable, donc il doit
					    être atteignable au clavier et annoncé comme une commande. */}
					<button
						type="button"
						aria-label="Fermer le menu"
						onClick={fermer}
						className="barre-nav-voile fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
					/>
					<div
						ref={panneau}
						id={idFeuille}
						role="dialog"
						aria-modal="true"
						aria-label="Autres rubriques"
						className="barre-nav-feuille fixed inset-x-0 bottom-0 z-[61] max-h-[75dvh] overflow-y-auto overscroll-contain border-t-2 border-[color-mix(in_srgb,var(--color-os)_62%,transparent)] bg-[rgba(10,10,10,0.98)] lg:hidden"
					>
						{/* Poignée de feuille : le repère qui dit « ceci se ferme ». */}
						<div className="flex items-center justify-between px-5 pt-3 pb-1">
							<span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-logo-jaune)]">
								Autres rubriques
							</span>
							<button
								type="button"
								onClick={fermer}
								aria-label="Fermer"
								className="grid h-11 w-11 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
							>
								<Croix size={20} />
							</button>
						</div>
						<nav aria-label="Autres rubriques" className="flex flex-col px-3 pb-4">
							{AUTRES.map((l) => (
								<Link
									key={l.href}
									href={l.href}
									// 56 px de haut : au-dessus des 48 dp de cible tactile M3,
									// et le sous-titre a besoin de la place.
									className="flex min-h-14 flex-col justify-center rounded-xl px-4 py-2 transition-colors hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-logo-jaune)]"
								>
									<span className="font-display text-[15px] font-bold text-white">{l.label}</span>
									<span className="text-[12px] text-white/45">{l.note}</span>
								</Link>
							))}
						</nav>
						{/* Compte — ce que portait le menu hamburger avant sa suppression.
						    Le tableau de bord et la déconnexion n'ont pas d'autre porte
						    d'entrée sur mobile, ils descendent donc ici plutôt que de
						    disparaître avec lui. Les rubriques wiki encore fermées au
						    public, elles, restent atteignables par le tableau de bord :
						    leur liste se calcule côté serveur depuis la configuration de
						    lancement, que cet îlot client n'a pas. */}
						{me?.authenticated && (
							<div className="flex flex-col gap-2 border-t border-white/10 px-4 pt-4 pb-2">
								{me.isAdmin && (
									<Link
										href="/admin/dashboard"
										className="flex min-h-12 items-center justify-center rounded-full border border-[var(--color-logo-jaune)]/45 font-display text-[13px] font-semibold tracking-[0.1em] text-[var(--color-logo-jaune)] transition-colors hover:bg-[var(--color-logo-jaune)]/10"
									>
										Tableau de bord
									</Link>
								)}
								<SignOut className="flex min-h-12 items-center justify-center rounded-full border border-white/15 font-display text-[13px] font-semibold tracking-[0.1em] text-white/70 transition-colors hover:border-white/35 hover:text-white disabled:opacity-50">
									Déconnexion
								</SignOut>
							</div>
						)}
						{/* La feuille s'arrête AU-DESSUS de la barre, elle ne la recouvre
						    pas : la barre reste le repère de position pendant qu'on
						    parcourt la liste. */}
						<div className="h-[calc(80px+env(safe-area-inset-bottom))]" />
					</div>
				</>
			)}

			<nav
				aria-label="Navigation principale"
				className="barre-nav fixed inset-x-0 bottom-0 z-[55] border-t-2 border-[color-mix(in_srgb,var(--color-os)_62%,transparent)] bg-[rgba(10,10,10,0.94)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
			>
				<ul className="mx-auto flex max-w-[640px] items-stretch">
					{DESTINATIONS.map((d) => {
						const on = actif === d.href;
						const Glyphe = on && d.IconeActive ? d.IconeActive : d.Icone;
						return (
							<li key={d.href} className="min-w-14 flex-1">
								<Link
									href={d.href}
									aria-current={on ? "page" : undefined}
									className="barre-nav__item group flex flex-col items-center justify-start gap-1 pt-3 pb-4 focus-visible:outline-none"
								>
									{/* Indicateur : 64 × 32, coins pleinement arrondis. C'est lui
									    qui porte l'état, la couleur ne fait que l'accompagner. */}
									<span
										className={`grid h-8 w-16 place-items-center rounded-full transition-colors ${
											on
												? "bg-[color-mix(in_srgb,var(--color-logo-jaune)_26%,transparent)]"
												: "group-hover:bg-white/[0.08] group-focus-visible:bg-white/[0.14] group-focus-visible:outline-2 group-focus-visible:outline-[var(--color-logo-jaune)]"
										}`}
									>
										<Glyphe
											size={24}
											className={on ? "text-[var(--color-logo-jaune)]" : "text-white/70"}
										/>
									</span>
									<span
										className={`text-[12px] leading-none tracking-[0.01em] ${
											on
												? "font-bold text-[var(--color-logo-jaune)]"
												: "font-medium text-white/70"
										}`}
									>
										{d.label}
									</span>
								</Link>
							</li>
						);
					})}
					<li className="min-w-14 flex-1">
						<button
							ref={boutonPlus}
							type="button"
							aria-expanded={feuille}
							aria-controls={idFeuille}
							onClick={() => setFeuille((v) => !v)}
							className="barre-nav__item group flex w-full flex-col items-center justify-start gap-1 pt-3 pb-4 focus-visible:outline-none"
						>
							<span
								className={`grid h-8 w-16 place-items-center rounded-full transition-colors ${
									feuille
										? "bg-[color-mix(in_srgb,var(--color-logo-jaune)_26%,transparent)]"
										: "group-hover:bg-white/[0.08] group-focus-visible:bg-white/[0.14] group-focus-visible:outline-2 group-focus-visible:outline-[var(--color-logo-jaune)]"
								}`}
							>
								<Ellipse
									size={24}
									className={feuille ? "text-[var(--color-logo-jaune)]" : "text-white/70"}
								/>
							</span>
							<span
								className={`text-[12px] leading-none tracking-[0.01em] ${
									feuille
										? "font-bold text-[var(--color-logo-jaune)]"
										: "font-medium text-white/70"
								}`}
							>
								Plus
							</span>
						</button>
					</li>
				</ul>
				{/* Encoche et barre gestuelle : sans cette réserve, le dernier libellé
				    passe sous l'indicateur de l'iPhone et sous la barre d'Android. */}
				<div className="h-[env(safe-area-inset-bottom)]" />
			</nav>
		</>
	);
}
