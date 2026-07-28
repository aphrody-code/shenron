/**
 * Bannières de pages & séries — types + défauts **client-safe**.
 *
 * Aucune dépendance server-only : importé par l'éditeur admin (`/admin/banners`)
 * et par `lib/banner-config.ts` (lecture/écriture PG). Les valeurs sont des URL
 * absolues (`https://bot…/db/…`) ou des chemins d'asset (`./assets/wiki/…`)
 * résolus via `resolveBannerUrl`.
 */
import { API_URL as API } from "@/lib/config";
import { assetUrl } from "@/lib/assets";

/** Clés des heros de pages (landing / index). */
export const PAGE_HERO_KEYS = [
	"episodes",
	"films",
	"chronologie",
	"personnages",
	"sagas",
	"arcs",
	"races",
	"transformations",
	"techniques",
	"jeux",
	"manga",
	"databooks",
	"news",
	"tools",
] as const;

export type PageHeroKey = (typeof PAGE_HERO_KEYS)[number];

/** Libellés FR pour l'admin. */
export const PAGE_HERO_LABELS: Record<PageHeroKey, string> = {
	episodes: "Épisodes (landing)",
	films: "Films (landing)",
	chronologie: "Chronologie",
	personnages: "Personnages / planètes",
	sagas: "Sagas & arcs",
	arcs: "Arcs (redirigé → sagas)",
	races: "Races",
	transformations: "Transformations",
	techniques: "Techniques",
	jeux: "Jeux vidéo",
	manga: "Manga (repli sans cover)",
	databooks: "Databooks (repli sans cover)",
	news: "Actualités / news wiki",
	tools: "Outils communautaires",
};

/** Séries anime / films ayant une bannière dédiée. */
export const SERIES_BANNER_KEYS = [
	"DB",
	"DBZ",
	"DBZ_KAI",
	"DBZ_KAI_FINAL",
	"DBGT",
	"DBS",
	"DBS_MANGA",
	"DBS_MOVIE",
	"DB_DAIMA",
	"DB_MOVIE",
	"DBZ_MOVIE",
	"DBZ_OVA",
	"DBZ_SPECIAL",
	"DB_DAIMA_MOVIE",
] as const;

export type SeriesBannerKey = (typeof SERIES_BANNER_KEYS)[number];

export const SERIES_BANNER_LABELS: Record<SeriesBannerKey, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBZ_KAI: "Dragon Ball Z Kai",
	DBZ_KAI_FINAL: "DBZ Kai – Final Chapters",
	DBGT: "Dragon Ball GT",
	DBS: "Dragon Ball Super",
	DBS_MANGA: "DBS Manga",
	DBS_MOVIE: "DBS Films",
	DB_DAIMA: "Dragon Ball Daima",
	DB_MOVIE: "Films DB",
	DBZ_MOVIE: "Films DBZ",
	DBZ_OVA: "OVA DBZ",
	DBZ_SPECIAL: "Spéciaux DBZ",
	DB_DAIMA_MOVIE: "Films Daima",
};

const FALLBACK = `${API}/db/dbofficial/207-battle2026_banner.jpg`;
const TOEI_DB = `${API}/db/toei/189-DB-DAIMA-HP-Header-1920x595.png`;
const TOEI_SUPER = `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`;
const TOEI_DAIMA = `${API}/db/toei/188-DB-DAIMA-HP-Header-1024x317.png`;
const TOEI_GT = `${API}/db/toei/187-anime-generation-166x126.png`;
const OFFICIAL_BATTLE = `${API}/db/dbofficial/207-battle2026_banner.jpg`;
const FILMS_DEFAULT = `${API}/db/dbofficial/231-240719_DAIMA_DBOS_Banner-news_EN_770-404.jpg`;
const GAMES_DEFAULT = `${API}/db/toei/101-bandai_dragon_ball_super_figurines_toys.jpeg`;

export interface PageBannersConfig {
	/** Hero / billboard par page (clé → URL ou chemin asset). */
	pages: Record<PageHeroKey, string>;
	/** Bannière par code série (`DB`, `DBZ`, …). */
	series: Record<string, string>;
	/** Repli si série inconnue. */
	fallback: string;
}

/** Défauts = mapping historique hardcodé (avant l'éditeur admin). */
export const DEFAULT_PAGE_BANNERS: PageBannersConfig = {
	pages: {
		episodes: TOEI_SUPER,
		films: FILMS_DEFAULT,
		chronologie: TOEI_SUPER,
		personnages: OFFICIAL_BATTLE,
		sagas: OFFICIAL_BATTLE,
		arcs: OFFICIAL_BATTLE,
		races: OFFICIAL_BATTLE,
		transformations: OFFICIAL_BATTLE,
		techniques: OFFICIAL_BATTLE,
		jeux: GAMES_DEFAULT,
		manga: TOEI_DB,
		databooks: TOEI_DB,
		news: OFFICIAL_BATTLE,
		tools: OFFICIAL_BATTLE,
	},
	series: {
		DB: TOEI_DB,
		DBZ: TOEI_SUPER,
		DBZ_KAI: TOEI_SUPER,
		DBZ_KAI_FINAL: TOEI_SUPER,
		DBGT: TOEI_GT,
		DBS: TOEI_SUPER,
		DBS_MANGA: TOEI_SUPER,
		DBS_MOVIE: TOEI_SUPER,
		DB_DAIMA: TOEI_DAIMA,
		DB_MOVIE: TOEI_DB,
		DBZ_MOVIE: TOEI_SUPER,
		DBZ_OVA: TOEI_SUPER,
		DBZ_SPECIAL: TOEI_SUPER,
		DB_DAIMA_MOVIE: TOEI_DAIMA,
	},
	fallback: FALLBACK,
};

/** Normalise une valeur stockée en URL affichable. */
export function resolveBannerUrl(path: string | null | undefined, fallback = FALLBACK): string {
	const raw = (path ?? "").trim();
	if (!raw) return fallback;
	if (/^https?:\/\//i.test(raw)) return raw;
	const resolved = assetUrl(raw);
	return resolved || fallback;
}

/** Fusionne un patch partiel (DB) avec les défauts — ne throw jamais. */
export function resolvePageBanners(patch: unknown): PageBannersConfig {
	const base = structuredClone(DEFAULT_PAGE_BANNERS);
	if (!patch || typeof patch !== "object") return base;
	const p = patch as Record<string, unknown>;

	if (typeof p.fallback === "string" && p.fallback.trim()) {
		base.fallback = p.fallback.trim();
	}

	if (p.pages && typeof p.pages === "object") {
		const pages = p.pages as Record<string, unknown>;
		for (const key of PAGE_HERO_KEYS) {
			const v = pages[key];
			if (typeof v === "string" && v.trim()) base.pages[key] = v.trim();
		}
	}

	if (p.series && typeof p.series === "object") {
		const series = p.series as Record<string, unknown>;
		for (const [k, v] of Object.entries(series)) {
			if (typeof v === "string" && v.trim()) base.series[k] = v.trim();
		}
	}

	return base;
}
