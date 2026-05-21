/**
 * enrich-movies.ts — Complète posters + trailers des films DB via Jikan (MAL).
 *
 * Pour chaque film sans poster : recherche Jikan par titre (type movie/special),
 * récupère poster (large_image_url) + trailer YouTube si dispo, met à jour
 * db_movies (poster, trailer_url, mal_id). Rate-limit Jikan : ~1 req/s.
 *
 * Sources légales gratuites : Jikan ne fournit PAS de vidéo de film complet ni
 * toujours un trailer → trailer reste null si absent (pas d'invention).
 *
 * Usage : bun apps/bot/scripts/enrich-movies.ts
 */
import { Database } from "bun:sqlite";

const DB =
	process.env.BOT_DB ?? new URL("../data/bot.db", import.meta.url).pathname;
const db = new Database(DB);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Movie = {
	id: number;
	title: string;
	title_romaji: string | null;
	mal_id: number | null;
	poster: string | null;
	trailer_url: string | null;
};

type JikanAnime = {
	mal_id: number;
	images?: { jpg?: { large_image_url?: string; image_url?: string } };
	trailer?: { url?: string | null };
	title?: string;
	type?: string;
};

async function jikan<T>(url: string): Promise<T | null> {
	for (let attempt = 0; attempt < 3; attempt++) {
		const res = await fetch(url, {
			headers: { accept: "application/json" },
		});
		if (res.status === 429) {
			await sleep(2000);
			continue;
		}
		if (!res.ok) return null;
		return (await res.json()) as T;
	}
	return null;
}

async function findByTitle(title: string): Promise<JikanAnime | null> {
	const q = encodeURIComponent(
		title.replace(/^Dragon Ball[ Z]*:?\s*/i, "").trim() || title,
	);
	const data = await jikan<{ data: JikanAnime[] }>(
		`https://api.jikan.moe/v4/anime?q=${q}&limit=5&sfw=true`,
	);
	const list = data?.data ?? [];
	// Préfère un résultat dont le titre contient un mot clé du film
	return list[0] ?? null;
}

async function byId(malId: number): Promise<JikanAnime | null> {
	const data = await jikan<{ data: JikanAnime }>(
		`https://api.jikan.moe/v4/anime/${malId}`,
	);
	return data?.data ?? null;
}

async function main() {
	const movies = db
		.query(
			`SELECT id, title, title_romaji, mal_id, poster, trailer_url FROM db_movies ORDER BY id`,
		)
		.all() as Movie[];

	let posters = 0;
	let trailers = 0;

	const upd = db.query(
		`UPDATE db_movies SET poster = COALESCE(?, poster), trailer_url = COALESCE(?, trailer_url), mal_id = COALESCE(?, mal_id) WHERE id = ?`,
	);

	for (const m of movies) {
		const hasPoster = !!m.poster && m.poster.startsWith("http");
		const hasTrailer = !!m.trailer_url;
		if (hasPoster && hasTrailer) {
			console.log(`= ${m.title} (déjà complet)`);
			continue;
		}

		let anime: JikanAnime | null = null;
		if (m.mal_id) anime = await byId(m.mal_id);
		if (!anime) anime = await findByTitle(m.title_romaji || m.title);
		await sleep(1100);

		if (!anime) {
			console.log(`✗ ${m.title} — introuvable sur Jikan`);
			continue;
		}

		const poster =
			anime.images?.jpg?.large_image_url ??
			anime.images?.jpg?.image_url ??
			null;
		const trailer = anime.trailer?.url ?? null;

		upd.run(
			hasPoster ? null : poster,
			hasTrailer ? null : trailer,
			m.mal_id ? null : anime.mal_id,
			m.id,
		);
		if (!hasPoster && poster) posters++;
		if (!hasTrailer && trailer) trailers++;
		console.log(
			`✓ ${m.title} → mal_id=${anime.mal_id} poster=${poster ? "oui" : "non"} trailer=${trailer ? "oui" : "non"}`,
		);
	}

	const totalPoster = (
		db
			.query(
				`SELECT COUNT(*) c FROM db_movies WHERE poster IS NOT NULL AND poster<>''`,
			)
			.get() as { c: number }
	).c;
	const totalTrailer = (
		db
			.query(
				`SELECT COUNT(*) c FROM db_movies WHERE trailer_url IS NOT NULL AND trailer_url<>''`,
			)
			.get() as { c: number }
	).c;
	const total = movies.length;
	console.log(
		`\n+${posters} posters, +${trailers} trailers. Couverture : poster ${totalPoster}/${total}, trailer ${totalTrailer}/${total}.`,
	);
	db.close();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
