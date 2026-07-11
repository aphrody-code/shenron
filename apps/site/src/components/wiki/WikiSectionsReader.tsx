"use client";

/**
 * Sélecteur de catégories d'une fiche wiki : une barre de pilules (« Tout »,
 * « Histoire », « Personnalité », « Techniques »…) qui filtre l'affichage des
 * blocs de contenu. Chaque `node` est rendu **côté serveur** (RSC) et passé ici
 * en enfant : tous les panneaux restent dans le DOM (indexables, cache CDN
 * préservé) ; le filtre ne fait que masquer/afficher via l'attribut `hidden`.
 *
 * La barre de pilules est **collante** (sticky sous le header) → sur une fiche
 * longue on peut sauter de catégorie sans remonter ; à la sélection, le contenu
 * défile en douceur juste sous la barre. Aucune donnée fetchée côté client →
 * l'îlot ne pilote que l'état de sélection.
 */
import { useRef, useState, type ReactNode } from "react";
import {
	normalizeSectionAccent,
	sectionAccentStyle,
	type SectionAccent,
} from "@/lib/wiki-section-accents";

export type { SectionAccent };

export interface ReaderPanel {
	/** Identifiant unique du panneau (clé React + état de sélection). */
	key: string;
	/** Libellé de la pilule. */
	label: string;
	accent?: SectionAccent | null;
	/** Sous-catégorie parente (regroupe plusieurs panneaux sous un onglet). */
	group?: string | null;
	/** Contenu rendu côté serveur. */
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
		"px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] border rounded-sm transition-all duration-200 whitespace-nowrap";
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
	// Sélection niveau 1 : "all" | clé d'un panneau non-groupé | "g:<groupe>".
	const [active, setActive] = useState<string>("all");
	// Sélection niveau 2 (dans un groupe actif) : "all" | clé d'un sous-panneau.
	const [subActive, setSubActive] = useState<string>("all");
	const contentRef = useRef<HTMLDivElement>(null);

	if (panels.length === 0) return null;

	// Garde-fou : dédoublonne les clés (une section de contenu peut avoir le même
	// slug qu'un panneau ajouté — ex. « versions »/« affiliés ») pour ne pas casser
	// les clés React ni faire basculer deux panneaux d'un seul clic de pilule.
	const seen = new Set<string>();
	const items = panels.map((p) => {
		let key = p.key;
		let n = 2;
		while (seen.has(key)) key = `${p.key}-${n++}`;
		seen.add(key);
		return key === p.key ? p : { ...p, key };
	});

	// Un seul panneau → sélecteur inutile, rendu direct.
	if (items.length === 1) return <div className="space-y-12">{items[0].node}</div>;

	// Sous-catégories : ordre d'apparition + panneaux de 1er niveau (sans groupe).
	const groupOrder: string[] = [];
	for (const p of items) {
		const g = p.group?.trim();
		if (g && !groupOrder.includes(g)) groupOrder.push(g);
	}
	const ungrouped = items.filter((p) => !p.group?.trim());
	const groupPanels = (g: string) => items.filter((p) => p.group?.trim() === g);
	const activeGroup = active.startsWith("g:") ? active.slice(2) : null;

	function selectTop(key: string) {
		setActive(key);
		setSubActive("all");
		requestAnimationFrame(() =>
			contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
		);
	}
	function selectSub(key: string) {
		setSubActive(key);
		requestAnimationFrame(() =>
			contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
		);
	}

	// Visibilité d'un panneau selon la sélection à 2 niveaux.
	function visible(p: ReaderPanel): boolean {
		if (active === "all") return true;
		if (activeGroup) {
			if (p.group?.trim() !== activeGroup) return false;
			return subActive === "all" || subActive === p.key;
		}
		return p.key === active;
	}

	return (
		<div className="space-y-8">
			<nav
				aria-label="Catégories de la fiche"
				className="sticky top-16 z-30 -mx-6 flex flex-wrap gap-2 border-b border-white/10 bg-dbz-bg/85 px-6 py-4 backdrop-blur-md lg:-mx-10 lg:px-10"
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
						accent={groupPanels(g)[0]?.accent ?? "blue"}
						onClick={() => selectTop(`g:${g}`)}
					>
						{g}
					</Pill>
				))}
			</nav>

			{/* Barre de sous-catégorie (2e niveau) quand un groupe est actif. */}
			{activeGroup && (
				<nav
					aria-label={`Sous-sections de ${activeGroup}`}
					className="-mt-4 flex flex-wrap gap-2 px-1"
				>
					<Pill active={subActive === "all"} onClick={() => selectSub("all")}>
						Tout · {activeGroup}
					</Pill>
					{groupPanels(activeGroup).map((p) => (
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

			<div ref={contentRef} className="space-y-12 scroll-mt-32">
				{items.map((p) => (
					<div key={p.key} hidden={!visible(p)}>
						{p.node}
					</div>
				))}
			</div>
		</div>
	);
}