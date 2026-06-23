/**
 * build_full_dataset.ts — Dataset de fine-tuning ENCYCLOPÉDIQUE Dragon Ball.
 *
 * Source = `rag_chunks` du bot.db : toute la connaissance déjà chunkée/formatée —
 * personnages, planètes, races, sagas, arcs, techniques, transformations, ÉPISODES,
 * FILMS, TOMES/chapitres manga, JEUX, NEWS, outils + corpus Fandom FR+EN + DATABOOKS
 * (Kanzenshuu & traduits). On EXCLUT source_id="manga" (OCR bruité avec watermarks) ;
 * on ré-ajoute le manga NETTOYÉ depuis manga_pretrain.jsonl (style/dialogue).
 *
 * Sortie : data/llm/db_full_pretrain.jsonl ({"text": ...}).
 * Usage : bun apps/bot/data/llm/build_full_dataset.ts
 */
import { Database } from "bun:sqlite";
import { appendFileSync, existsSync, writeFileSync } from "node:fs";

const HERE = new URL(".", import.meta.url).pathname; // data/llm/
const DBP = process.env.DATABASE_PATH ?? `${HERE}../bot.db`;
const MANGA = `${HERE}manga_pretrain.jsonl`;
const OUT = `${HERE}db_full_pretrain.jsonl`;

const db = new Database(DBP, { readonly: true });
const rows = db
	.query(
		"SELECT kind, title, content, source_id FROM rag_chunks WHERE source_id IS NULL OR source_id <> 'manga'"
	)
	.all() as { kind: string; title: string; content: string; source_id: string }[];

writeFileSync(OUT, "");
let n = 0;
const bySource: Record<string, number> = {};
for (const r of rows) {
	const t = `${r.title}\n${(r.content || "").trim()}`.trim();
	if (t.length < 30) continue;
	appendFileSync(OUT, `${JSON.stringify({ text: t })}\n`);
	bySource[r.source_id || "?"] = (bySource[r.source_id || "?"] ?? 0) + 1;
	n++;
}
const encyclo = n;

// Manga nettoyé (dialogue/style) — réintègre la connaissance des tomes côté texte.
let manga = 0;
if (existsSync(MANGA)) {
	for (const line of require("node:fs").readFileSync(MANGA, "utf-8").split("\n")) {
		if (!line.trim()) continue;
		appendFileSync(OUT, `${line}\n`);
		manga++;
	}
}

// News Dragon Ball (db_news — absent de rag_chunks).
let news = 0;
for (const r of db
	.query("SELECT title, excerpt, category FROM db_news WHERE title IS NOT NULL AND title <> ''")
	.all() as { title: string; excerpt: string; category: string }[]) {
	const t = `Actualité Dragon Ball${r.category ? ` (${r.category})` : ""} : ${r.title}${
		r.excerpt ? `\n${r.excerpt}` : ""
	}`.trim();
	if (t.length < 30) continue;
	appendFileSync(OUT, `${JSON.stringify({ text: t })}\n`);
	news++;
}

const topSrc = Object.entries(bySource)
	.toSorted((a, b) => b[1] - a[1])
	.slice(0, 10)
	.map(([s, c]) => `${s}:${c}`)
	.join(" ");
console.log(
	`✓ db_full_pretrain.jsonl : ${encyclo + manga + news} exemples (encyclopédie ${encyclo} + manga ${manga} + news ${news})`
);
console.log(`  top sources: ${topSrc}`);
db.close();
