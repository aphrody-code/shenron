/**
 * Chronologie universelle Dragon Ball — modèle + helpers PURS et CLIENT-SAFE.
 *
 * Aucun import server (pas de `postgres`/drizzle) : utilisable à la fois par le
 * helper server-only `dbUniverse.timeline()` (qui construit le dataset) ET par le
 * composant client `ChronologyExplorer` (tri/filtre/export). C'est le seul point
 * qui unifie les DEUX espaces de séries disjoints (épisodes `DB/DBZ/DBGT/DBS/
 * DB_DAIMA` vs films `DB_MOVIE/DBZ_MOVIE/DBZ_OVA/DBZ_SPECIAL/DBS_MOVIE`) sous des
 * « ères » communes.
 */

export const ERA_ORDER = ["DB", "DBZ", "GT", "Super", "Daima", "Autre"] as const;
export type Era = (typeof ERA_ORDER)[number];

export const ERA_LABELS: Record<Era, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	GT: "Dragon Ball GT",
	Super: "Dragon Ball Super",
	Daima: "Dragon Ball Daima",
	Autre: "Autres",
};

/** Couleur d'accent par ère (hex direct → rail/points, indépendant des tokens). */
export const ERA_ACCENT: Record<Era, string> = {
	DB: "#f5a623",
	DBZ: "#ff5a1f",
	GT: "#38b000",
	Super: "#3aa0ff",
	Daima: "#b47cff",
	Autre: "#9ca3af",
};

/**
 * Normalise un code `series` (épisode OU film) vers une ère commune.
 * Ordre des tests critique : « DB » est un préfixe de tous les autres.
 */
export function eraOf(series: string | null | undefined): Era {
	const s = (series ?? "").toUpperCase();
	if (!s) return "Autre";
	if (s.includes("DAIMA")) return "Daima";
	if (s.includes("GT")) return "GT"; // DBGT
	if (s.startsWith("DBS")) return "Super"; // DBS, DBS_MOVIE, DBS_MANGA
	if (s.startsWith("DBZ")) return "DBZ"; // DBZ, DBZ_KAI, DBZ_MOVIE, DBZ_OVA, DBZ_SPECIAL
	if (s.startsWith("DB")) return "DB"; // DB, DB_MOVIE
	return "Autre";
}

export function eraRank(era: Era): number {
	const i = ERA_ORDER.indexOf(era);
	return i === -1 ? ERA_ORDER.length : i;
}

/** Un élément (épisode ou film) de la chronologie universelle. */
export type TimelineItem = {
	kind: "episode" | "movie";
	id: number;
	href: string;
	title: string;
	titleJa: string | null;
	series: string;
	era: Era;
	/** Numéro dans la série (épisodes) ; null pour les films. */
	number: number | null;
	/** Date de diffusion/sortie, epoch SECONDES ; null si inconnue. */
	date: number | null;
	image: string | null;
	hasVf: boolean;
	hasVostfr: boolean;
};

export type SortMode = "era" | "date" | "title";

export const SORT_LABELS: Record<SortMode, string> = {
	era: "Par ère",
	date: "Diffusion / sortie",
	title: "Titre (A→Z)",
};

const INF = Number.POSITIVE_INFINITY;

/** Comparateur pur pour un mode de tri donné (déterministe, stable via id). */
export function compareTimeline(mode: SortMode): (a: TimelineItem, b: TimelineItem) => number {
	if (mode === "title") {
		return (a, b) => a.title.localeCompare(b.title, "fr") || a.id - b.id;
	}
	if (mode === "date") {
		return (a, b) => {
			const d = (a.date ?? INF) - (b.date ?? INF);
			if (d) return d;
			const e = eraRank(a.era) - eraRank(b.era);
			if (e) return e;
			return (a.number ?? INF) - (b.number ?? INF) || a.id - b.id;
		};
	}
	// "era" : ère éditoriale → date (les dates manquantes retombent sur le numéro)
	// → épisode avant film → id. Interleave les films par date parmi les épisodes.
	return (a, b) => {
		const e = eraRank(a.era) - eraRank(b.era);
		if (e) return e;
		const d = (a.date ?? INF) - (b.date ?? INF);
		if (d) return d;
		const n = (a.number ?? INF) - (b.number ?? INF);
		if (n) return n;
		if (a.kind !== b.kind) return a.kind === "episode" ? -1 : 1;
		return a.id - b.id;
	};
}

// --- Formats d'export (l'utilisateur « organise lui-même ») -----------------

function isoDate(sec: number | null): string {
	if (!sec) return "";
	return new Date(sec * 1000).toISOString().slice(0, 10);
}

export function toJSONExport(items: TimelineItem[]): string {
	return JSON.stringify(
		items.map((it, i) => ({
			ordre: i + 1,
			type: it.kind === "episode" ? "épisode" : "film",
			ere: ERA_LABELS[it.era],
			serie: it.series,
			numero: it.number,
			titre: it.title,
			titre_ja: it.titleJa,
			date: isoDate(it.date),
			url: it.href,
		})),
		null,
		2
	);
}

function csvCell(v: string | number | null): string {
	const s = v === null || v === undefined ? "" : String(v);
	return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSVExport(items: TimelineItem[]): string {
	const header = ["ordre", "type", "ere", "serie", "numero", "titre", "titre_ja", "date", "url"];
	const rows = items.map((it, i) =>
		[
			i + 1,
			it.kind === "episode" ? "épisode" : "film",
			ERA_LABELS[it.era],
			it.series,
			it.number ?? "",
			it.title,
			it.titleJa ?? "",
			isoDate(it.date),
			it.href,
		]
			.map(csvCell)
			.join(",")
	);
	return [header.join(","), ...rows].join("\n");
}

export function toMarkdownExport(items: TimelineItem[]): string {
	const lines = items.map((it, i) => {
		const tag = it.kind === "movie" ? "🎬" : "📺";
		const num = it.number != null ? `#${it.number} ` : "";
		const date = it.date ? ` (${isoDate(it.date)})` : "";
		return `${i + 1}. ${tag} **[${ERA_LABELS[it.era]}]** ${num}${it.title}${date}`;
	});
	return `# Chronologie Dragon Ball — ${items.length} entrées\n\n${lines.join("\n")}\n`;
}
