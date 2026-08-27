"use client";

/**
 * Sélecteur de catégories d'une fiche wiki — **2 niveaux** :
 *
 *   1. Barre du haut : « Tout » + catégories de 1er niveau (Histoire, PWS…).
 *      Les sections regroupées n'apparaissent **pas** ici — seul le nom du groupe
 *      parent est affiché (ex. « PWS »).
 *   2. Barre du bas (visible **uniquement** après clic sur un groupe parent) :
 *      sous-catégories de ce groupe (ex. Vitesse, Durabilité, Puissance d'attaque).
 *
 * Chaque `node` est rendu côté serveur (RSC) ; le filtre masque/affiche via `hidden`.
 */
import { useRef, useState, type ReactNode } from "react";
import {
	normalizeSectionAccent,
	sectionAccentStyle,
	type SectionAccent,
} from "@/lib/wiki-section-accents";
import { normalizeWikiSectionGroups } from "@/lib/wiki-section-groups";

export type { SectionAccent };

export interface ReaderPanel {
	key: string;
	label: string;
	accent?: SectionAccent | null;
	/** Groupe parent (onglet de 1er niveau). Les enfants s'affichent en barre 2. */
	group?: string | null;
	node: ReactNode;
}

function Pill({
	active,
	accent = "orange",
	onClick,
	children,
}: {
	active: boolean;
	accent?: SectionAccent | null;
	onClick: () => void;
	children: ReactNode;
}) {
	const base =
		// Onglets agrandis : 11 px en capitales espacées de 0,18 em se lisaient
		// lettre à lettre. 13 px, un tracking resserré et une cible de 40 px de
		// haut — c'est un élément de navigation, pas une étiquette.
		"px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] border rounded-lg transition-colors duration-200 whitespace-nowrap";
	const cls = active
		? sectionAccentStyle(normalizeSectionAccent(accent)).pillActive
		: "border-white/15 bg-white/[0.02] text-white/55 hover:text-white hover:border-dbz-orange/60";
	return (
		<button type="button" onClick={onClick} aria-pressed={active} className={`${base} ${cls}`}>
			{children}
		</button>
	);
}

export function WikiSectionsReader({
	panels,
	allLabel = "Tout",
}: {
	panels: ReaderPanel[];
	allLabel?: string;
}) {
	const [active, setActive] = useState<string>("all");
	const [subActive, setSubActive] = useState<string>("all");
	const contentRef = useRef<HTMLDivElement>(null);

	if (panels.length === 0) return null;

	// Normalise PWS et autres regroupements (corrige les inversions label/groupe).
	const normalized = normalizeWikiSectionGroups(
		panels.map((p) => ({ ...p, label: p.label.trim(), group: p.group?.trim() || null }))
	);

	const seen = new Set<string>();
	const items = normalized.map((p) => {
		let key = p.key;
		let n = 2;
		while (seen.has(key)) key = `${p.key}-${n++}`;
		seen.add(key);
		return key === p.key ? p : { ...p, key };
	});

	if (items.length === 1) return <div className="space-y-12">{items[0].node}</div>;

	const groupOrder: string[] = [];
	for (const p of items) {
		const g = p.group;
		if (g && !groupOrder.includes(g)) groupOrder.push(g);
	}
	const ungrouped = items.filter((p) => !p.group);
	const groupPanels = (g: string) => items.filter((p) => p.group === g);
	const activeGroup = active.startsWith("g:") ? active.slice(2) : null;
	const activeChildren = activeGroup ? groupPanels(activeGroup) : [];

	function scrollToContent() {
		// Toujours le contenu, jamais la barre : depuis que les deux barres
		// vivent dans un même conteneur `sticky`, viser la sous-barre revenait à
		// viser un élément déjà collé en haut — le défilement ne bougeait plus.
		// `scroll-mt-52` sur le contenu réserve la hauteur de l'ensemble.
		requestAnimationFrame(() =>
			contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
		);
	}

	function selectTop(key: string) {
		setActive(key);
		setSubActive("all");
		scrollToContent();
	}

	function selectSub(key: string) {
		setSubActive(key);
		scrollToContent();
	}

	function visible(p: ReaderPanel): boolean {
		if (active === "all") return true;
		if (activeGroup) {
			if (p.group !== activeGroup) return false;
			return subActive === "all" || subActive === p.key;
		}
		return p.key === active;
	}

	return (
		<div className="space-y-6">
			{/* Les deux barres sont solidaires dans UN seul conteneur collant.
			    Auparavant chacune était `sticky` avec son propre `top` codé en dur
			    (`top-16` puis `top-[7.25rem]`), calculé pour une barre de niveau 1
			    tenant sur UNE ligne. Dès qu'elle passait à deux ou trois lignes —
			    c'est-à-dire sur presque toutes les fiches en écran étroit — la barre
			    des sous-catégories venait se poser PAR-DESSUS les catégories
			    principales, qui devenaient incliquables. */}
			<div className="sticky top-16 z-30 -mx-6 lg:-mx-10">
				{/* ── Niveau 1 : catégories principales ── */}
				<nav
					aria-label="Catégories de la fiche"
					// Fond translucide et non `bg-dbz-bg/90` : posé sur le dégradé de la
					// page, un aplat à 90 % dessinait un rectangle plus clair derrière
					// les onglets — une seconde surface qui doublait celle du contenu
					// juste dessous. Le flou seul suffit à décoller la barre.
					className="flex flex-wrap gap-2 border-b border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl lg:px-10"
			>
				<Pill active={active === "all"} onClick={() => selectTop("all")}>
					{allLabel}
				</Pill>
				{ungrouped.map((p) => (
					<Pill
						key={p.key}
						active={active === p.key}
						accent={p.accent}
						onClick={() => selectTop(p.key)}
					>
						{p.label}
					</Pill>
				))}
				{groupOrder.map((g) => (
					<Pill
						key={`g:${g}`}
						active={activeGroup === g}
						accent={groupPanels(g)[0]?.accent ?? "red"}
						onClick={() => selectTop(`g:${g}`)}
					>
						{g}
					</Pill>
				))}
			</nav>

			{/* ── Niveau 2 : sous-catégories (après clic sur un groupe parent) ── */}
			{activeGroup && activeChildren.length > 0 && (
				<nav
					aria-label={`Sous-catégories de ${activeGroup}`}
					className="flex flex-wrap items-center gap-2 border-b border-white/5 bg-black/30 px-6 py-2.5 backdrop-blur-xl lg:px-10"
				>
					<span className="mr-1 font-scouter text-[11px] uppercase tracking-[0.14em] text-white/50">
						{activeGroup}
					</span>
					<Pill active={subActive === "all"} onClick={() => selectSub("all")}>
						Tout
					</Pill>
					{activeChildren.map((p) => (
						<Pill
							key={`sub-${p.key}`}
							active={subActive === p.key}
							accent={p.accent}
							onClick={() => selectSub(p.key)}
						>
							{p.label}
						</Pill>
					))}
				</nav>
			)}
			</div>

			<div ref={contentRef} className="space-y-12 scroll-mt-52">
				{items.map((p) => (
					<div key={p.key} hidden={!visible(p)}>
						{p.node}
					</div>
				))}
			</div>
		</div>
	);
}
