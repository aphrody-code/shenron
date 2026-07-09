// SPDX-License-Identifier: Apache-2.0

/**
 * Registre de LANCEMENT du wiki (client-safe — aucun import server-only).
 *
 * Chaque catégorie mappe vers ses **préfixes d'URL** (index + routes détail) qui
 * doivent être ouverts ENSEMBLE quand on la publie. Le gating (`proxy.ts`), la nav
 * (`SiteNav`) et le teaser (`/wiki-bientot`) résolvent tous « catégorie ouverte ? »
 * via ce registre + l'ensemble des clés ouvertes (DB, `wiki-launch-config.ts`).
 *
 * `alwaysOpen` = catégories déjà publiques en bêta (episodes/films/manga/chrono) :
 * elles ne peuvent pas être refermées depuis l'admin (garde-fou).
 */
export interface LaunchCategory {
	key: string;
	label: string;
	/** Lien de nav principal (null = pas d'entrée navbar propre). */
	href: string | null;
	/** Préfixes d'URL à ouvrir ensemble (index + détail). Match par préfixe. */
	prefixes: string[];
	/** Toujours ouverte (bêta) — non refermable depuis l'admin. */
	alwaysOpen?: boolean;
}

export const LAUNCH_CATEGORIES: LaunchCategory[] = [
	// ── Déjà ouvertes en bêta (verrouillées ON) ──────────────────────────────
	{ key: "episodes", label: "Épisodes", href: "/wiki/episodes", prefixes: ["/wiki/episodes"], alwaysOpen: true },
	{ key: "films", label: "Films", href: "/wiki/films", prefixes: ["/wiki/films"], alwaysOpen: true },
	{ key: "chronologie", label: "Chronologie", href: "/wiki/chronologie", prefixes: ["/wiki/chronologie"], alwaysOpen: true },
	{ key: "manga", label: "Manga", href: "/wiki/manga", prefixes: ["/wiki/manga"], alwaysOpen: true },
	// ── Fermées par défaut, ouvrables une par une depuis /admin/lancement ─────
	{ key: "personnages", label: "Personnages", href: "/wiki/personnages", prefixes: ["/wiki/personnages", "/wiki/dragon-ball/character"] },
	{ key: "planetes", label: "Planètes", href: "/wiki/planetes", prefixes: ["/wiki/planetes", "/wiki/dragon-ball/planet"] },
	{ key: "races", label: "Races", href: "/wiki/races", prefixes: ["/wiki/races"] },
	{ key: "transformations", label: "Transformations", href: "/wiki/transformations", prefixes: ["/wiki/transformations"] },
	{ key: "techniques", label: "Techniques", href: "/wiki/dragon-ball/techniques", prefixes: ["/wiki/dragon-ball/techniques"] },
	{ key: "arcs", label: "Arcs", href: "/wiki/arcs", prefixes: ["/wiki/arcs"] },
	{ key: "sagas", label: "Sagas", href: "/wiki/sagas", prefixes: ["/wiki/sagas"] },
	{ key: "jeux", label: "Jeux", href: "/wiki/jeux", prefixes: ["/wiki/jeux", "/wiki/dragon-ball/games"] },
	{ key: "databooks", label: "Databooks", href: "/wiki/databooks", prefixes: ["/wiki/databooks"] },
];

/** Clés toujours ouvertes (bêta), jamais refermables. */
export const ALWAYS_OPEN_KEYS = LAUNCH_CATEGORIES.filter((c) => c.alwaysOpen).map((c) => c.key);

/** Défaut si la config DB est vide/absente : uniquement les catégories bêta. */
export const DEFAULT_OPEN_KEYS = ALWAYS_OPEN_KEYS;

/** Catégories refermables/ouvrables depuis l'admin (hors bêta verrouillées). */
export const GATEABLE_CATEGORIES = LAUNCH_CATEGORIES.filter((c) => !c.alwaysOpen);

/** Ensemble effectif des clés ouvertes (alwaysOpen ∪ clés stockées). */
export function effectiveOpenKeys(stored: readonly string[]): Set<string> {
	return new Set([...ALWAYS_OPEN_KEYS, ...stored]);
}

/** Tous les préfixes d'URL ouverts pour un ensemble de clés. */
export function openPrefixes(stored: readonly string[]): string[] {
	const open = effectiveOpenKeys(stored);
	return LAUNCH_CATEGORIES.filter((c) => open.has(c.key)).flatMap((c) => c.prefixes);
}

/** Un pathname /wiki est-il publiquement ouvert selon les clés fournies ? */
export function isPathOpen(pathname: string, stored: readonly string[]): boolean {
	return openPrefixes(stored).some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
