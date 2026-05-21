/**
 * Banners DB officiels par série/saga — pour les heros de pages.
 * Manuel curated depuis les 798 assets téléchargés (Toei + DB Official).
 * Aucun reverse-engineering, juste mapping section → asset disponible.
 */
const API = (
	process.env.NEXT_PUBLIC_SHENRON_API_URL ??
	process.env.SHENRON_API_URL ??
	"https://bot.rpbey.fr"
).replace(/\/+$/, "");

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
};

export const SAGAS_HERO = `${API}/db/dbofficial/207-battle2026_banner.jpg`;
export const FILMS_HERO = `${API}/db/dbofficial/231-240719_DAIMA_DBOS_Banner-news_EN_770-404.jpg`;
export const GAMES_HERO = `${API}/db/toei/101-bandai_dragon_ball_super_figurines_toys.jpeg`;
export const NEWS_HERO = `${API}/db/dbofficial/207-battle2026_banner.jpg`;
export const HOME_HERO = `${API}/db/toei/189-DB-DAIMA-HP-Header-1920x595.png`;

export function bannerForSeries(series: string): string {
	return (
		SERIES_BANNERS[series] ?? `${API}/db/dbofficial/207-battle2026_banner.jpg`
	);
}
