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
/**
 * Qui a le droit de voir une entrée :
 *   public  → tout le monde, y compris les moteurs de recherche
 *   members → visiteurs connectés (compte Discord lié)
 *   roles   → connectés portant AU MOINS UN des `roleIds` sur le serveur Discord
 *   admin   → staff du site uniquement (équivaut à « fermé »)
 */
export type AccessMode = "public" | "members" | "roles" | "admin";

export interface AccessRule {
	mode: AccessMode;
	/** Rôles Discord autorisés — signifiant uniquement quand `mode === "roles"`. */
	roleIds: string[];
}

export interface LaunchCategory {
	key: string;
	label: string;
	/** Lien de nav principal (null = pas d'entrée navbar propre). */
	href: string | null;
	/** Préfixes d'URL à ouvrir ensemble (index + détail). Match par préfixe. */
	prefixes: string[];
	/** Toujours ouverte (bêta) — non refermable depuis l'admin. */
	alwaysOpen?: boolean;
	/** `wiki` = catégorie de l'encyclopédie ; `site` = section hors wiki. */
	scope?: "wiki" | "site";
	/** Accès appliqué tant que rien n'est enregistré en base. */
	defaultMode?: AccessMode;
}

export const LAUNCH_CATEGORIES: LaunchCategory[] = [
	// ── Déjà ouvertes en bêta (verrouillées ON) ──────────────────────────────
	{
		key: "episodes",
		label: "Épisodes",
		href: "/wiki/episodes",
		prefixes: ["/wiki/episodes"],
		alwaysOpen: true,
	},
	{
		key: "films",
		label: "Films",
		href: "/wiki/films",
		prefixes: ["/wiki/films"],
		alwaysOpen: true,
	},
	{
		key: "chronologie",
		label: "Chronologie",
		href: "/wiki/chronologie",
		prefixes: ["/wiki/chronologie"],
		alwaysOpen: true,
	},
	{
		key: "manga",
		label: "Manga",
		href: "/wiki/manga",
		prefixes: ["/wiki/manga"],
		alwaysOpen: true,
	},
	// ── Fermées par défaut, ouvrables une par une depuis /admin/lancement ─────
	//
	// Chaque rubrique garde son ANCIEN préfixe `/wiki/dragon-ball/…` en second :
	// les fiches ont été rapatriées sous le segment de leur index (`/wiki/personnages/12`
	// et non `/wiki/dragon-ball/character/12`), et le 308 de `next.config` récupère
	// les URL déjà indexées — mais le proxy passe AVANT ce 308. Sans le préfixe
	// historique ici, une vieille URL d'une rubrique fermée traverserait le gating.
	{
		key: "personnages",
		label: "Personnages",
		href: "/wiki/personnages",
		prefixes: ["/wiki/personnages", "/wiki/dragon-ball/character"],
	},
	{
		key: "planetes",
		label: "Cosmologie",
		href: "/wiki/cosmologie",
		// `/wiki/planetes` reste listé : le proxy s'exécute AVANT les 308 de
		// `next.config`, une vieille URL doit donc rester gatée comme la rubrique.
		prefixes: ["/wiki/cosmologie", "/wiki/planetes", "/wiki/dragon-ball/planet"],
	},
	{ key: "races", label: "Races", href: "/wiki/races", prefixes: ["/wiki/races"] },
	{
		key: "transformations",
		label: "Transformations",
		href: "/wiki/transformations",
		prefixes: ["/wiki/transformations"],
	},
	{
		key: "techniques",
		label: "Techniques",
		href: "/wiki/techniques",
		prefixes: ["/wiki/techniques", "/wiki/dragon-ball/techniques"],
	},
	{ key: "arcs", label: "Arcs", href: "/wiki/arcs", prefixes: ["/wiki/arcs"] },
	{ key: "sagas", label: "Sagas", href: "/wiki/sagas", prefixes: ["/wiki/sagas"] },
	{
		key: "jeux",
		label: "Jeux",
		href: "/wiki/jeux",
		prefixes: ["/wiki/jeux", "/wiki/dragon-ball/games"],
	},
	{ key: "databooks", label: "Databooks", href: "/wiki/databooks", prefixes: ["/wiki/databooks"] },
	// Page d'accueil de la contribution. `alwaysOpen` à dessein : hors registre,
	// tout ce qui vit sous /wiki est fermé par défaut (cf. proxy.ts), et une page
	// qui explique comment participer, réservée aux admins, ne sert personne.
	// Elle ne divulgue rien : des compteurs et des liens vers des fiches déjà
	// soumises, elles, au contrôle d'accès de leur rubrique.
	// Flux public des modifications : même raison d'être `alwaysOpen` que
	// « contribuer ». Il ne cite que des fiches visibles (les masquées sont
	// écartées à la résolution des URL).
	// Page de dépôt d'une correction. `alwaysOpen` pour la même raison que les
	// deux précédentes ; elle ne montre aucun contenu par elle-même (le texte
	// est chargé par une API qui exige une session).
	{
		key: "corriger",
		label: "Corriger",
		href: null,
		prefixes: ["/wiki/corriger"],
		alwaysOpen: true,
		defaultMode: "public",
	},
	{
		key: "modifications",
		label: "Modifications",
		href: "/wiki/modifications",
		prefixes: ["/wiki/modifications"],
		alwaysOpen: true,
		defaultMode: "public",
	},
	{
		key: "contribuer",
		label: "Contribuer",
		href: "/wiki/contribuer",
		prefixes: ["/wiki/contribuer"],
		alwaysOpen: true,
		defaultMode: "public",
	},
];

/**
 * Sections du site HORS wiki, soumises au même contrôle d'accès (public /
 * connectés / rôles Discord / staff) et au même classement.
 *
 * Les clés sont volontairement distinctes de celles du wiki (`jeux-hub` et non
 * `jeux`) : elles cohabitent dans un unique espace de noms persisté en base.
 * `tierlists` naît en `admin` car le proxy la gardait déjà en dur pour le staff —
 * la migration ne doit rien ouvrir par surprise.
 */
export const SITE_SECTIONS: LaunchCategory[] = [
	{
		key: "tierlists",
		label: "Tier lists",
		href: "/tierlists",
		prefixes: ["/tierlists"],
		scope: "site",
		defaultMode: "admin",
	},
	{
		key: "classements",
		label: "Classements",
		href: "/classements",
		prefixes: ["/classements", "/leaderboard"],
		scope: "site",
		defaultMode: "public",
	},
	{
		key: "boutique",
		label: "Boutique",
		href: "/shop",
		prefixes: ["/shop"],
		scope: "site",
		defaultMode: "public",
	},
	{
		key: "jeux-hub",
		label: "Espace jeux",
		href: "/jeux",
		prefixes: ["/jeux"],
		scope: "site",
		defaultMode: "public",
	},
	{
		key: "actualites",
		label: "Actualités",
		href: "/actualites",
		prefixes: ["/actualites"],
		scope: "site",
		defaultMode: "public",
	},
	// (Ancienne section « Articles communautaires » sur /post : supprimée avec la
	// route. Les articles vivent sous /actualites, déjà couvert par l'entrée
	// ci-dessus, et /post/:slug est redirigé en 308 au niveau du routing — donc
	// avant même que ce registre soit consulté.)
	{
		key: "assistant",
		label: "Assistant IA",
		href: "/ask",
		prefixes: ["/ask"],
		scope: "site",
		defaultMode: "public",
	},
	{
		key: "canvas",
		label: "Canvas",
		href: "/canvas",
		prefixes: ["/canvas"],
		scope: "site",
		defaultMode: "public",
	},
	{
		// Sans entrée ici, `/wiki/hasard` retomberait sur le défaut « sous /wiki,
		// fermé » du proxy et redirigerait vers /wiki-bientot. La route ne fait
		// elle-même que rediriger vers une rubrique OUVERTE (elle relit ce même
		// registre) : l'ouvrir n'expose donc rien de fermé.
		key: "hasard",
		label: "Au hasard",
		href: "/wiki/hasard",
		prefixes: ["/wiki/hasard"],
		scope: "site",
		defaultMode: "public",
	},
	{
		// La recherche n'avait AUCUNE entrée au registre : `/wiki/search` retombait
		// donc sur le défaut « sous /wiki, fermé » et redirigeait tout anonyme vers
		// /wiki-bientot — alors que `SiteJsonLd` annonce à Google une sitelinks
		// searchbox pointant précisément cette URL, et que la palette ⌘K s'appuie
		// dessus. La page est `noindex, follow` : elle n'ajoute pas de contenu
		// mince à l'index, elle sert la découverte.
		key: "recherche",
		label: "Recherche",
		href: "/wiki/search",
		prefixes: ["/wiki/search"],
		scope: "site",
		defaultMode: "public",
	},
	{
		key: "stats",
		label: "Statistiques",
		href: "/stats",
		prefixes: ["/stats"],
		scope: "site",
		defaultMode: "public",
	},
	{
		key: "personas",
		label: "Personas",
		href: "/personas",
		prefixes: ["/personas"],
		scope: "site",
		defaultMode: "public",
	},
	{
		key: "commandes",
		label: "Commandes du bot",
		href: "/commands",
		prefixes: ["/commands"],
		scope: "site",
		defaultMode: "public",
	},
	{
		key: "profil",
		label: "Profil joueur",
		href: "/profil",
		prefixes: ["/profil"],
		scope: "site",
		defaultMode: "public",
	},
];

/** Registre complet : catégories wiki + sections du site. */
export const ALL_ENTRIES: LaunchCategory[] = [...LAUNCH_CATEGORIES, ...SITE_SECTIONS];

const BY_KEY = new Map(ALL_ENTRIES.map((e) => [e.key, e]));

/** Entrée du registre pour une clé (undefined si la clé est obsolète). */
export function entryByKey(key: string): LaunchCategory | undefined {
	return BY_KEY.get(key);
}

/**
 * Entrée gouvernant un pathname, par match de préfixe **le plus long** : sans ça
 * `/wiki/techniques` serait capté par une entrée `/wiki` plus courte.
 */
export function findEntry(pathname: string): LaunchCategory | undefined {
	let best: LaunchCategory | undefined;
	let bestLen = -1;
	for (const e of ALL_ENTRIES) {
		for (const p of e.prefixes) {
			if ((pathname === p || pathname.startsWith(`${p}/`)) && p.length > bestLen) {
				best = e;
				bestLen = p.length;
			}
		}
	}
	return best;
}

/**
 * Règle d'accès effective d'une clé.
 *
 * Rétrocompatibilité : tant qu'aucune règle n'est enregistrée, on **dérive** le
 * comportement historique — une catégorie wiki présente dans `openKeys` est
 * publique, sinon réservée au staff ; une section du site prend son
 * `defaultMode`. Une entrée `alwaysOpen` est publique par construction et ne peut
 * pas être restreinte (garde-fou bêta).
 */
export function resolveAccess(
	key: string,
	cfg: { openKeys: readonly string[]; access?: Readonly<Record<string, AccessRule>> }
): AccessRule {
	const entry = BY_KEY.get(key);
	if (entry?.alwaysOpen) return { mode: "public", roleIds: [] };

	const stored = cfg.access?.[key];
	if (stored) return stored;

	if (entry?.scope === "site") return { mode: entry.defaultMode ?? "public", roleIds: [] };
	return { mode: cfg.openKeys.includes(key) ? "public" : "admin", roleIds: [] };
}

/** Registre trié selon l'ordre enregistré ; les clés inconnues gardent l'ordre du code. */
export function orderedEntries(
	order: readonly string[],
	entries: readonly LaunchCategory[] = ALL_ENTRIES
): LaunchCategory[] {
	const rank = new Map(order.map((k, i) => [k, i]));
	return [...entries].sort((a, b) => {
		const ra = rank.get(a.key) ?? Number.MAX_SAFE_INTEGER;
		const rb = rank.get(b.key) ?? Number.MAX_SAFE_INTEGER;
		if (ra !== rb) return ra - rb;
		return entries.indexOf(a) - entries.indexOf(b);
	});
}

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

/**
 * Configuration d'accès minimale nécessaire pour trancher « cette URL est-elle
 * publique ? ». Volontairement structurelle et non le type `LaunchConfig`
 * complet (`wiki-launch-config.ts` est `server-only`) : ce module reste
 * importable depuis un composant client.
 */
export type AccessSnapshot = {
	openKeys: readonly string[];
	access?: Readonly<Record<string, AccessRule>>;
};

/**
 * Cette URL est-elle accessible à un visiteur **anonyme** ?
 *
 * `isPathOpen` ne regarde que l'héritage `openKeys` et ignore donc les modes
 * `members` / `roles` / `admin` posés depuis /admin/lancement. C'est cette
 * fonction-ci qui fait autorité partout où l'on décide d'émettre un lien ou une
 * URL de sitemap : le proxy applique la même règle (`findEntry` + `resolveAccess`),
 * donc ce qu'on annonce ici est exactement ce que le visiteur obtiendra.
 *
 * Hors registre : sous `/wiki` on ferme par défaut (même politique que
 * `proxy.ts`), ailleurs la page est publique (accueil, à propos, crédits…).
 */
export function isPathPublic(pathname: string, cfg: AccessSnapshot): boolean {
	const entry = findEntry(pathname);
	if (!entry) return !(pathname === "/wiki" || pathname.startsWith("/wiki/"));
	return resolveAccess(entry.key, cfg).mode === "public";
}

/** Clés de rubrique réellement publiques, dans l'ordre du registre. */
export function publicEntries(cfg: AccessSnapshot): LaunchCategory[] {
	return ALL_ENTRIES.filter((e) => resolveAccess(e.key, cfg).mode === "public");
}
