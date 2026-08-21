#!/usr/bin/env bun
/**
 * Reconstruit l'index Redis des databooks depuis Postgres.
 *
 * L'index (`lib/databooks-redis.ts`) est tenu à jour à chaque écriture passant
 * par l'API. Ce script sert au premier remplissage et à la réparation après une
 * perte de Redis ou une écriture directe en base.
 *
 * Usage (l'env doit porter DATABASE_URL) :
 *   bun scripts/index-databooks-redis.ts
 *   bun scripts/index-databooks-redis.ts --purge   # vide l'index avant
 */
import postgres from "postgres";
import { RedisClient } from "bun";

const DB_INDEX = 4;
const PREFIXE = "dbfr:databook";
const PURGE = process.argv.includes("--purge");

const url = process.env.DATABASE_URL;
if (!url) {
	console.error("✗ DATABASE_URL requis.");
	process.exit(1);
}

const sql = postgres(url, { max: 2 });
const redisUrl = new URL(process.env.REDIS_URL ?? "redis://127.0.0.1:6379");
redisUrl.pathname = `/${DB_INDEX}`;
const redis = new RedisClient(redisUrl.toString(), { autoReconnect: true, maxRetries: 20 });

if (PURGE) {
	// SCAN plutôt que KEYS : KEYS bloque le serveur, et db0 porte 1,1 M de clés.
	let curseur = "0";
	let supprimees = 0;
	do {
		const [suivant, cles] = (await redis.send("SCAN", [
			curseur,
			"MATCH",
			`${PREFIXE}*`,
			"COUNT",
			"500",
		])) as [string, string[]];
		curseur = suivant;
		for (const c of cles) {
			await redis.del(c);
			supprimees++;
		}
	} while (curseur !== "0");
	console.log(`  purge : ${supprimees} clé(s) retirée(s)`);
}

const rows = await sql<
	{
		id: string;
		kind: string;
		title: string;
		title_ja: string | null;
		author: string | null;
		published_at: string | null;
		cover: string | null;
		description: string | null;
		category: string | null;
		pages: unknown;
	}[]
>`select id, kind, title, title_ja, author, published_at, cover, description, category, pages
  from bot.db_databooks where visible order by id`;

let indexees = 0;
for (const r of rows) {
	const id = Number(r.id);
	await redis.set(
		`${PREFIXE}:${id}`,
		JSON.stringify({
			id,
			kind: r.kind,
			title: r.title,
			title_ja: r.title_ja,
			author: r.author,
			published_at: r.published_at === null ? null : Number(r.published_at),
			cover: r.cover,
			description: r.description,
			category: r.category,
			pageCount: Array.isArray(r.pages) ? r.pages.length : 0,
		})
	);
	await redis.sadd(`${PREFIXE}s:all`, String(id));
	await redis.sadd(`${PREFIXE}s:kind:${r.kind}`, String(id));
	if (r.category) await redis.sadd(`${PREFIXE}s:category:${r.category}`, String(id));
	indexees++;
}

const total = await redis.scard(`${PREFIXE}s:all`);
console.log(
	`✓ ${indexees} fiche(s) indexée(s) — ${total} au total dans l'index (Redis db${DB_INDEX})`
);
await sql.end();
process.exit(0);
