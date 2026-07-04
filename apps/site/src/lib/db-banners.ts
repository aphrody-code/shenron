/**
 * Banners DB officiels par série/saga — pour les heros de pages.
 * Manuel curated depuis les 798 assets téléchargés (Toei + DB Official).
 * Aucun reverse-engineering, juste mapping section → asset disponible.
 */
import { API_URL as API } from "@/lib/config";

export const SERIES_BANNERS: Record<string, string> = {
	DB: `${API}/db/toei/189-DB-DAIMA-HP-Header-1920x595.png`,
	DBZ: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DBZ_KAI: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DBZ_KAI_FINAL: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DBGT: `${API}/db/toei/187-anime-generation-166x126.png`,
	DBS: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DBS_MANGA: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DBS_MOVIE: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DB_DAIMA: `${API}/db/toei/188-DB-DAIMA-HP-Header-1024x317.png`,
	// Séries de films : rattachées à la bannière de leur ère (évite le fond
	// générique identique partout sur les billboards/aperçus films).
	DB_MOVIE: `${API}/db/toei/189-DB-DAIMA-HP-Header-1920x595.png`,
	DBZ_MOVIE: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DBZ_OVA: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DBZ_SPECIAL: `${API}/db/toei/124-cover-4-db-super-1024x317.jpg`,
	DB_DAIMA_MOVIE: `${API}/db/toei/188-DB-DAIMA-HP-Header-1024x317.png`,
};

export const SAGAS_HERO = `${API}/db/dbofficial/207-battle2026_banner.jpg`;
export const CHARACTERS_HERO = `${API}/db/dbofficial/207-battle2026_banner.jpg`;
export const PLANETS_HERO = `${API}/db/toei/189-DB-DAIMA-HP-Header-1920x595.png`;
export const FILMS_HERO = `${API}/db/dbofficial/231-240719_DAIMA_DBOS_Banner-news_EN_770-404.jpg`;
export const GAMES_HERO = `${API}/db/toei/101-bandai_dragon_ball_super_figurines_toys.jpeg`;
export const NEWS_HERO = `${API}/db/dbofficial/207-battle2026_banner.jpg`;
export const HOME_HERO = `${API}/db/toei/189-DB-DAIMA-HP-Header-1920x595.png`;

export function bannerForSeries(series: string): string {
	return SERIES_BANNERS[series] ?? `${API}/db/dbofficial/207-battle2026_banner.jpg`;
}
