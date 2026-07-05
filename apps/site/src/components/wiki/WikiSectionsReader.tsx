"use client";

/**
 * Sélecteur de catégories d'une fiche wiki : une barre de pilules (« Tout »,
 * « Histoire », « Personnalité », « Techniques »…) qui filtre l'affichage des
 * blocs de contenu. Chaque `node` est rendu **côté serveur** (RSC) et passé ici
 * en enfant : tous les panneaux restent dans le DOM (indexables, cache CDN
 * préservé) ; le filtre ne fait que masquer/afficher via l'attribut `hidden`.
 *
 * Aucune donnée fetchée côté client → l'îlot ne pilote que l'état de sélection.
 */
import { useState, type ReactNode } from "react";

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

	if (panels.length === 0) return null;
	// Un seul panneau → sélecteur inutile, rendu direct.
	if (panels.length === 1) return <div className="space-y-12">{panels[0].node}</div>;

	return (
		<div className="space-y-8">
			<nav
				aria-label="Catégories de la fiche"
				className="flex flex-wrap gap-2 border-b border-white/10 pb-6"
			>
				<Pill active={active === "all"} onClick={() => setActive("all")}>
					{allLabel}
				</Pill>
				{panels.map((p) => (
					<Pill
						key={p.key}
						active={active === p.key}
						accent={p.accent}
						onClick={() => setActive(p.key)}
					>
						{p.label}
					</Pill>
				))}
			</nav>
			<div className="space-y-12">
				{panels.map((p) => (
					<div key={p.key} hidden={active !== "all" && active !== p.key}>
						{p.node}
					</div>
				))}
			</div>
		</div>
	);
}
