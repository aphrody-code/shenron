/**
 * prune-dead-embed-players.ts — Purge les « lecteurs » (players) voir-anime
 * réellement morts dans `bot.db_episodes.players` / `bot.db_movies.players`
 * (Postgres, source de vérité).
 *
 * Contexte (2026-08-08) : le dataset source bxc n'avait pas été rafraîchi
 * depuis le 28 mai → re-scrape (`voiranime-db-mapper.ts`) effectué, mais il
 * s'avère que voir-anime.to lui-même sert des embeds figés à l'ajout de
 * l'épisode — un re-scrape ne renouvelle PAS les codes morts. Root cause
 * réelle = link rot côté hébergeurs tiers (contenu supprimé/DMCA/domaine
 * expiré), constaté en conditions réelles (Playwright, iframe sandboxée
 * identique à `VideoLecteurs.tsx`) :
 *   - streamhide.to  : domaine parké/à vendre → mort à 100%, sans exception.
 *   - voe.sx         : détecte notre iframe sandboxée et bloque la lecture
 *                       (« Sandbox not allowed / suppress ads not allowed »)
 *                       — pas du contenu manquant, une politique anti-adblock
 *                       qui matche TOUJOURS notre sandbox. Bloqué à 100%.
 *   - streamtape.com : idem (« Client blocked! … doing nasty things! »).
 *   - filemoon (weneverbeenfree.com), mail.ru, yourupload : link rot
 *     PARTIEL et variable par vidéo (contenu supprimé/DMCA) → vérifié par
 *     un fetch HTTP + signature de page morte connue, PAS de purge en bloc.
 *   - vidmoly : fiable dans tous les échantillons testés → jamais purgé.
 *
 * Idempotent, sûr à ré-exécuter (relit `players` en base à chaque run).
 * Ne supprime PAS une ligne : si tous les players d'un épisode/film meurent,
 * `players` devient `[]` et le site retombe sur `video_url`/`stream_url`
 * (chaîne de fallback déjà en place, cf. `apps/site/.../[id]/page.tsx`).
 *
 * Usage : DATABASE_URL=... bun apps/bot/scripts/prune-dead-embed-players.ts [--dry-run]
 */
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
	console.error("✗ DATABASE_URL requis.");
	process.exit(1);
}
const DRY_RUN = process.argv.includes("--dry-run");

const sql = postgres(DB_URL, { max: 5, prepare: false });

type Player = { name: string; provider: string; embedUrl: string; lang?: "vf" | "vostfr" };

// Providers bloqués à 100% pour NOUS (politique sandbox du site, pas un lien
// mort individuel) → purge en bloc, sans fetch.
const BLANKET_DEAD = new Set(["streamhide", "voe", "streamtape"]);

// Providers jamais vus en échec dans les échantillons → on ne les fetch même
// pas (gain de temps), gardés tels quels.
const TRUSTED = new Set(["vidmoly"]);

// Signatures de page "contenu mort" observées en conditions réelles pour les
// providers restants (filemoon/mailru/yourupload). Match sur un corps de
// réponse tronqué (4 Ko suffisent, ces pages sont petites).
const DEAD_SIGNATURES = [
	/404 not found/i,
	/video is not exist/i,
	/content restricted/i,
	/dmca complaint/i,
	/file (was )?deleted/i,
	/this domain name may be for sale/i,
];

async function isDead(url: string): Promise<boolean> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8000);
	try {
		const res = await fetch(url, {
			signal: controller.signal,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
				Referer: "https://dragonballfr.com/",
			},
		});
		if (res.status === 404 || res.status === 410) return true;
		const body = await res.text();
		return DEAD_SIGNATURES.some((re) => re.test(body.slice(0, 4000)));
	} catch {
		// Timeout / DNS / TLS mort → on considère mort (cf. streamhide sans -k).
		return true;
	} finally {
		clearTimeout(timeout);
	}
}

/** Limite la concurrence sans dépendance externe. */
async function withConcurrency<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
	const results: R[] = Array.from({ length: items.length });
	let idx = 0;
	async function worker() {
		for (;;) {
			const i = idx++;
			if (i >= items.length) return;
			results[i] = await fn(items[i]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(n, items.length) || 1 }, worker));
	return results;
}

async function prunePlayers(players: Player[]): Promise<{ kept: Player[]; droppedBlanket: number; droppedChecked: number }> {
	const toCheck: Player[] = [];
	const kept: Player[] = [];
	let droppedBlanket = 0;

	for (const p of players) {
		if (BLANKET_DEAD.has(p.provider)) {
			droppedBlanket++;
			continue;
		}
		if (TRUSTED.has(p.provider)) {
			kept.push(p);
			continue;
		}
		toCheck.push(p);
	}

	const deadFlags = await withConcurrency(toCheck, 15, (p) => isDead(p.embedUrl));
	let droppedChecked = 0;
	toCheck.forEach((p, i) => {
		if (deadFlags[i]) droppedChecked++;
		else kept.push(p);
	});

	return { kept, droppedBlanket, droppedChecked };
}

async function processTable(table: "db_episodes" | "db_movies") {
	const rows = (await sql`
		SELECT id, title, players FROM bot.${sql(table)} WHERE players IS NOT NULL AND jsonb_array_length(players) > 0
	`) as unknown as { id: number; title: string; players: Player[] }[];

	console.log(`\n=== bot.${table} — ${rows.length} lignes avec players ===`);

	let totalBefore = 0;
	let totalAfter = 0;
	let totalBlanket = 0;
	let totalChecked = 0;
	let nowEmpty = 0;

	for (const row of rows) {
		const before = row.players.length;
		const { kept, droppedBlanket, droppedChecked } = await prunePlayers(row.players);
		totalBefore += before;
		totalAfter += kept.length;
		totalBlanket += droppedBlanket;
		totalChecked += droppedChecked;
		if (kept.length === 0) nowEmpty++;

		if (kept.length !== before) {
			console.log(
				`  #${row.id} ${row.title.slice(0, 40)} : ${before} → ${kept.length} (bloqués=${droppedBlanket}, morts=${droppedChecked})`
			);
			if (!DRY_RUN) {
				await sql`UPDATE bot.${sql(table)} SET players = ${sql.json(kept)} WHERE id = ${row.id}`;
			}
		}
	}

	console.log(
		`\n${table} : ${totalBefore} players → ${totalAfter} conservés (${totalBlanket} bloqués sandbox, ${totalChecked} morts confirmés). ${nowEmpty} lignes vidées entièrement.`
	);
}

console.log(DRY_RUN ? "[DRY RUN — aucune écriture]" : "[LIVE — écriture Postgres]");
await processTable("db_episodes");
await processTable("db_movies");
await sql.end();
console.log("\n✓ Terminé.");
