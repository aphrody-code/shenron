/**
 * rag-recon.ts — Scrape toutes nos sources Dragon Ball via `bxc recon`
 * (HTML → Markdown propre) et agrège dans un gros JSON + fichiers .md.
 *
 * Sources = table db_sources + seeds high-value (pages Fandom clés).
 * Sortie : apps/bot/data/rag/<slug>.md + apps/bot/data/rag/corpus.json
 * (base de connaissances pour un futur RAG / recherche).
 *
 * Usage : bun apps/bot/scripts/rag-recon.ts
 */
import { Database } from "bun:sqlite";
import { mkdirSync, writeFileSync } from "node:fs";

const DB = new URL("../data/bot.db", import.meta.url).pathname;
const OUT = new URL("../data/rag/", import.meta.url).pathname;
const BXC = "/home/ubuntu/bxc";
mkdirSync(OUT, { recursive: true });

const db = new Database(DB, { readonly: true });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const sources = db
	.query(`SELECT id, name, url FROM db_sources WHERE url LIKE 'http%'`)
	.all() as { id: string; name: string; url: string }[];

// Seeds high-value (pages riches en texte, pas juste des landing pages)
const SEEDS: { id: string; name: string; url: string }[] = [
	{
		id: "fandom-goku",
		name: "Goku (Fandom EN)",
		url: "https://dragonball.fandom.com/wiki/Goku",
	},
	{
		id: "fandom-vegeta",
		name: "Vegeta (Fandom EN)",
		url: "https://dragonball.fandom.com/wiki/Vegeta",
	},
	{
		id: "fandom-frieza",
		name: "Frieza (Fandom EN)",
		url: "https://dragonball.fandom.com/wiki/Frieza",
	},
	{
		id: "fandom-saiyan",
		name: "Saiyan (Fandom EN)",
		url: "https://dragonball.fandom.com/wiki/Saiyan",
	},
	{
		id: "fandom-transformations",
		name: "Transformations",
		url: "https://dragonball.fandom.com/wiki/Transformation",
	},
	{
		id: "fandom-kihistory",
		name: "Ki",
		url: "https://dragonball.fandom.com/wiki/Ki",
	},
	{
		id: "wiki-dbz",
		name: "Dragon Ball Z (Wikipedia)",
		url: "https://en.wikipedia.org/wiki/Dragon_Ball_Z",
	},
	{
		id: "wiki-db",
		name: "Dragon Ball (Wikipedia)",
		url: "https://en.wikipedia.org/wiki/Dragon_Ball",
	},
	{
		id: "wiki-dbsuper",
		name: "Dragon Ball Super (Wikipedia)",
		url: "https://en.wikipedia.org/wiki/Dragon_Ball_Super",
	},
];

async function recon(url: string): Promise<string | null> {
	const proc = Bun.spawn(
		["bun", "run", "bxc", "recon", url, "--profile", "fast"],
		{
			cwd: BXC,
			stdout: "pipe",
			stderr: "ignore",
		},
	);
	const out = await new Response(proc.stdout).text();
	const code = await proc.exited;
	if (code !== 0 || out.length < 50) return null;
	return out;
}

async function main() {
	const all = [...sources, ...SEEDS];
	const corpus: Array<{
		id: string;
		name: string;
		url: string;
		chars: number;
		markdown: string;
	}> = [];
	for (const s of all) {
		let md: string | null = null;
		for (let a = 0; a < 2 && !md; a++) {
			md = await recon(s.url);
			if (!md) await sleep(1500);
		}
		await sleep(800);
		if (!md) {
			console.log(`✗ ${s.id} — recon KO (${s.url})`);
			continue;
		}
		writeFileSync(`${OUT}${s.id}.md`, md);
		corpus.push({
			id: s.id,
			name: s.name,
			url: s.url,
			chars: md.length,
			markdown: md,
		});
		console.log(`✓ ${s.id} — ${md.length} chars`);
	}
	writeFileSync(
		`${OUT}corpus.json`,
		JSON.stringify(
			{
				generatedAt: new Date().toISOString(),
				count: corpus.length,
				docs: corpus,
			},
			null,
			0,
		),
	);
	console.log(`\n${corpus.length}/${all.length} sources → ${OUT}corpus.json`);
	db.close();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
