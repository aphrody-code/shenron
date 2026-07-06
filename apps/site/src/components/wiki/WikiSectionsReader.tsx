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

export type SectionAccent = "orange" | "blue" | "red";

export interface ReaderPanel {
	/** Identifiant unique du panneau (clé React + état de sélection). */
	key: string;
	/** Libellé de la pilule. */
	label: string;
	accent?: SectionAccent | null;
	/** Contenu rendu côté serveur. */
	node: ReactNode;
}

const ACTIVE_ACCENT: Record<SectionAccent, string> = {
	orange: "bg-dbz-orange text-black border-dbz-orange shadow-[0_0_18px_rgba(255,178,0,0.35)]",
	blue: "bg-dbz-blue-light text-black border-dbz-blue-light shadow-[0_0_18px_rgba(96,165,250,0.3)]",
	red: "bg-dbz-red text-white border-dbz-red shadow-[0_0_18px_rgba(220,38,38,0.3)]",
};

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
		? ACTIVE_ACCENT[accent ?? "orange"]
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

	// À la sélection : filtre + défilement doux vers le haut du contenu (sous la
	// barre collante) pour ne pas se retrouver au milieu/en bas d'une catégorie.
	function select(key: string) {
		setActive(key);
		requestAnimationFrame(() =>
			contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
		);
	}

	return (
		<div className="space-y-8">
			<nav
				aria-label="Catégories de la fiche"
				className="sticky top-16 z-30 -mx-6 flex flex-wrap gap-2 border-b border-white/10 bg-dbz-bg/85 px-6 py-4 backdrop-blur-md lg:-mx-10 lg:px-10"
			>
				<Pill active={active === "all"} onClick={() => select("all")}>
					{allLabel}
				</Pill>
				{items.map((p) => (
					<Pill
						key={p.key}
						active={active === p.key}
						accent={p.accent}
						onClick={() => select(p.key)}
					>
						{p.label}
					</Pill>
				))}
			</nav>
			<div ref={contentRef} className="space-y-12 scroll-mt-32">
				{items.map((p) => (
					<div key={p.key} hidden={active !== "all" && active !== p.key}>
						{p.node}
					</div>
				))}
			</div>
		</div>
	);
}
