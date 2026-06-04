/**
 * rag-build.ts — Construit l'index de recherche RAG (FTS5) Dragon Ball.
 *
 * Source = data structurée du bot (personnages, planètes, races, techniques,
 * transformations, sagas, films, jeux) + corpus markdown scrapé (data/rag/
 * corpus.json, chunké). Index FTS5 `rag_chunks` interrogeable en BM25 via
 * l'API bot `/api/public/rag/search?q=`.
 *
 * Récupération HYBRIDE : BM25 lexical (`rag_chunks`) + embeddings denses
 * multilingues (`rag_vectors`, modèle local multilingual-e5-small). La requête
 * runtime fusionne les deux par RRF (cf. `lib/rag.ts`). Le build embed tous les
 * chunks ici (process offline, hors contrainte mémoire du bot). Relançable :
 * DROP + recreate.
 *
 * Usage : bun apps/bot/scripts/rag-build.ts
 */
import { Database } from "bun:sqlite";
import { existsSync } from "node:fs";
import { EMBED_DIM, EMBED_MODEL, embedTexts, vecToBlob } from "../src/lib/embeddings";

const DBP = process.env.RAG_DB ?? new URL("../data/bot.db", import.meta.url).pathname;
const CORPUS = new URL("../data/rag/corpus.json", import.meta.url).pathname;
const db = new Database(DBP);

db.run(`DROP TABLE IF EXISTS rag_chunks`);
db.run(
  `CREATE VIRTUAL TABLE rag_chunks USING fts5(kind, title, url, content, tokenize='unicode61 remove_diacritics 2')`,
);

const ins = db.query(`INSERT INTO rag_chunks (kind, title, url, content) VALUES (?, ?, ?, ?)`);

let n = 0;
const add = (kind: string, title: string, url: string, content: string) => {
  const c = (content || "").replace(/\s+/g, " ").trim();
  if (c.length < 12) return;
  ins.run(kind, title || "", url || "", c);
  n++;
};

// ── Data structurée (la plus fiable) ───────────────────────────────────────
type Row = Record<string, unknown>;
const q = (sql: string) => db.query(sql).all() as Row[];
const s = (v: unknown) => (v == null ? "" : String(v));

for (const c of q(`SELECT id,name,name_ja,name_romaji,race,ki,description FROM db_characters`)) {
  add(
    "character",
    s(c.name),
    `/wiki/dragon-ball/character/${c.id}`,
    `${s(c.name)} (${s(c.name_ja)} / ${s(c.name_romaji)}). Race: ${s(c.race)}. Ki: ${s(c.ki)}. ${s(c.description)}`,
  );
}
for (const p of q(`SELECT id,name,name_ja,description FROM db_planets`)) {
  add(
    "planet",
    s(p.name),
    `/wiki/dragon-ball/planet/${p.id}`,
    `Planète ${s(p.name)} (${s(p.name_ja)}). ${s(p.description)}`,
  );
}
for (const r of q(`SELECT slug,name,name_ja,description FROM db_races`)) {
  add(
    "race",
    s(r.name),
    `/wiki/races/${s(r.slug)}`,
    `Race ${s(r.name)} (${s(r.name_ja)}). ${s(r.description)}`,
  );
}
for (const t of q(`SELECT slug,name,name_ja,type,description FROM db_techniques`)) {
  add(
    "technique",
    s(t.name),
    `/wiki/dragon-ball/technique/${s(t.slug)}`,
    `Technique ${s(t.name)} (${s(t.name_ja)}) — ${s(t.type)}. ${s(t.description)}`,
  );
}
for (const tr of q(`SELECT name,ki FROM db_transformations`)) {
  add(
    "transformation",
    s(tr.name),
    `/wiki/dragon-ball`,
    `Transformation ${s(tr.name)}. Ki: ${s(tr.ki)}.`,
  );
}
for (const sg of q(`SELECT slug,name,name_ja,series,description FROM db_sagas`)) {
  add(
    "saga",
    s(sg.name),
    `/wiki/sagas`,
    `Saga ${s(sg.name)} (${s(sg.name_ja)}) — ${s(sg.series)}. ${s(sg.description)}`,
  );
}
for (const m of q(`SELECT id,title,title_ja,series,synopsis FROM db_movies`)) {
  add(
    "movie",
    s(m.title),
    `/wiki/dragon-ball/movie/${m.id}`,
    `Film ${s(m.title)} (${s(m.title_ja)}) — ${s(m.series)}. ${s(m.synopsis)}`,
  );
}
for (const g of q(`SELECT slug,title,title_ja,platforms,description FROM db_games`)) {
  add(
    "game",
    s(g.title),
    `/wiki/jeux`,
    `Jeu ${s(g.title)} (${s(g.title_ja)}) — ${s(g.platforms)}. ${s(g.description)}`,
  );
}
for (const e of q(
  `SELECT id,series,number_in_series,title,synopsis FROM db_episodes WHERE synopsis IS NOT NULL AND synopsis<>''`,
)) {
  add(
    "episode",
    `${s(e.series)} ${s(e.number_in_series)} — ${s(e.title)}`,
    `/wiki/episodes/${e.id}`,
    `Épisode ${s(e.series)} #${s(e.number_in_series)} : ${s(e.title)}. ${s(e.synopsis)}`,
  );
}

for (const a of q(`SELECT id, saga_id, slug, name, name_ja, description FROM db_arcs`)) {
  const saga = q(`SELECT name FROM db_sagas WHERE id = ${a.saga_id}`)[0] as Row | undefined;
  const sagaName = saga ? s(saga.name) : "";
  add(
    "arc",
    s(a.name),
    `/wiki/sagas`,
    `Arc narratif ${s(a.name)} (${s(a.name_ja)})${sagaName ? ` de la saga ${sagaName}` : ""}. ${s(a.description)}`,
  );
}

for (const v of q(`SELECT id, series, volume_number, title, title_ja, isbn FROM db_manga_volumes`)) {
  add(
    "manga_volume",
    `Volume ${s(v.volume_number)} — ${s(v.title)}`,
    `/wiki/manga`,
    `Volume ${s(v.volume_number)} du manga ${s(v.series)}${v.title ? ` intitulé ${s(v.title)}` : ""}${v.title_ja ? ` (${s(v.title_ja)})` : ""}.${v.isbn ? ` ISBN: ${s(v.isbn)}` : ""}`,
  );
}

for (const ch of q(`SELECT id, series, chapter_number, title, title_ja, volume_id FROM db_manga_chapters`)) {
  const vol = ch.volume_id ? (q(`SELECT volume_number FROM db_manga_volumes WHERE id = ${ch.volume_id}`)[0] as Row | undefined) : undefined;
  const volCtx = vol ? ` (Volume ${s(vol.volume_number)})` : "";
  add(
    "manga_chapter",
    `Chapitre ${s(ch.chapter_number)} — ${s(ch.title)}`,
    `/wiki/manga`,
    `Chapitre ${s(ch.chapter_number)} du manga ${s(ch.series)}${volCtx}${ch.title ? ` intitulé ${s(ch.title)}` : ""}${ch.title_ja ? ` (${s(ch.title_ja)})` : ""}`,
  );
}

for (const t of q(`SELECT id, slug, name, description, author, language, category, stars FROM db_tools`)) {
  add(
    "tool",
    s(t.name),
    `/wiki/outils`,
    `Outil ou ressource communautaire ${s(t.name)} (${s(t.category)}). Créateur: ${s(t.author)}. Langue: ${s(t.language)}. Étoiles: ${s(t.stars)}. Description: ${s(t.description)}`,
  );
}

// ── Corpus scrapé (chunké) ──────────────────────────────────────────────────
if (existsSync(CORPUS)) {
  const corpus = JSON.parse(await Bun.file(CORPUS).text()) as {
    docs: { id: string; name: string; url: string; markdown: string }[];
  };
  for (const d of corpus.docs) {
    const body = d.markdown.replace(/^#.*$/gm, "").replace(/\[[^\]]*\]\([^)]*\)/g, "");
    const CHUNK = 900;
    for (let i = 0; i < body.length; i += CHUNK) {
      add("source", d.name, d.url, body.slice(i, i + CHUNK));
    }
  }
}

const total = (db.query(`SELECT COUNT(*) c FROM rag_chunks`).get() as { c: number }).c;
console.log(`✓ rag_chunks construit : ${n} chunks insérés (${total} total).`);

// ── Embeddings denses (volet sémantique du retrieval hybride) ───────────────
// On embed `title. content` de chaque chunk (préfixe e5 "passage:" géré dans
// embedTexts). Vecteurs L2-normalisés → cosinus = produit scalaire au runtime.
db.run(`DROP TABLE IF EXISTS rag_vectors`);
db.run(`CREATE TABLE rag_vectors (rowid INTEGER PRIMARY KEY, vec BLOB NOT NULL)`);
db.run(
  `CREATE TABLE IF NOT EXISTS rag_meta (model TEXT, dim INTEGER, count INTEGER, built_at INTEGER)`,
);

const chunks = db.query(`SELECT rowid, title, content FROM rag_chunks ORDER BY rowid`).all() as {
  rowid: number;
  title: string;
  content: string;
}[];

console.log(`→ embeddings (${EMBED_MODEL}, ${EMBED_DIM}d) sur ${chunks.length} chunks…`);
const embT0 = Date.now();
const texts = chunks.map((c) => `${c.title}. ${c.content}`.slice(0, 1200));
const vectors = await embedTexts(texts, "passage");

const insVec = db.query(`INSERT INTO rag_vectors (rowid, vec) VALUES (?, ?)`);
const tx = db.transaction(() => {
  for (let i = 0; i < chunks.length; i++) {
    insVec.run(chunks[i].rowid, vecToBlob(vectors[i]));
  }
});
tx();
db.run(`DELETE FROM rag_meta`);
db.query(`INSERT INTO rag_meta (model, dim, count, built_at) VALUES (?, ?, ?, ?)`).run(
  EMBED_MODEL,
  EMBED_DIM,
  vectors.length,
  Date.now(),
);
console.log(`✓ rag_vectors : ${vectors.length} vecteurs en ${Date.now() - embT0} ms.`);

// Smoke test (lexical — la fusion hybride se teste via l'API runtime).
for (const term of ["Kamehameha", "Super Saiyan", "Namek", "Freezer"]) {
  const hits = db
    .query(`SELECT kind, title FROM rag_chunks WHERE rag_chunks MATCH ? ORDER BY rank LIMIT 3`)
    .all(term) as { kind: string; title: string }[];
  console.log(`  "${term}" → ${hits.map((h) => `${h.kind}:${h.title}`).join(", ") || "(rien)"}`);
}
db.close();
