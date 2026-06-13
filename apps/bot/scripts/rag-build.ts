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
 * PLAN A3/A4 :
 *   - Nettoyage et chunking sémantique (respectant les sections et phrases, overlap 15%).
 *   - Enrichissement avec colonnes de métadonnées : lang, source_id, entity.
 *   - Canonicalisation des entités via alias-map.json.
 *
 * Usage : bun apps/bot/scripts/rag-build.ts
 */
import { Database } from "bun:sqlite";
import * as sqliteVec from "sqlite-vec";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { EMBED_DIM, EMBED_MODEL, embedTexts, vecToBlob } from "../src/lib/embeddings";

const DBP = process.env.RAG_DB ?? new URL("../data/bot.db", import.meta.url).pathname;
const CORPUS = new URL("../data/rag/corpus.json", import.meta.url).pathname;
const ALIAS_MAP_PATH = new URL("../data/rag/alias-map.json", import.meta.url).pathname;

if (!existsSync(DBP)) {
	console.error(`✗ Base RAG introuvable : ${DBP}`);
	process.exit(1);
}

const db = new Database(DBP);
sqliteVec.load(db);

// ── Chargement de la table d'alias pour la canonicalisation (PLAN A3) ───────
let aliasMap: Record<string, { canonical: string; type: string; id: string }> = {};
if (existsSync(ALIAS_MAP_PATH)) {
	try {
		aliasMap = JSON.parse(readFileSync(ALIAS_MAP_PATH, "utf-8"));
		console.log(`✓ Table d'alias chargée : ${Object.keys(aliasMap).length} règles.`);
	} catch (err) {
		console.error("⚠ Impossible de lire alias-map.json, utilisation d'une table vide.", err);
	}
} else {
	console.warn(
		"⚠ alias-map.json introuvable. Lancez `bun apps/bot/scripts/generate-alias-map.ts` d'abord."
	);
}

const aliasKeys = Object.keys(aliasMap).toSorted((a, b) => b.length - a.length);

function normalizeKey(str: string): string {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function resolveEntity(text: string): string {
	const normText = normalizeKey(text);
	for (const key of aliasKeys) {
		const regex = new RegExp(`\\b${key}\\b`, "i");
		if (regex.test(normText)) {
			return aliasMap[key].canonical;
		}
	}
	return "";
}

// ── Recréation de la table virtuelle FTS5 avec les colonnes enrichies ───────
db.run(`DROP TABLE IF EXISTS rag_chunks`);
db.run(
	`CREATE VIRTUAL TABLE rag_chunks USING fts5(kind, title, url, content, lang, source_id, entity, tokenize='unicode61 remove_diacritics 2')`
);

const ins = db.query(
	`INSERT INTO rag_chunks (kind, title, url, content, lang, source_id, entity) VALUES (?, ?, ?, ?, ?, ?, ?)`
);

let n = 0;
const add = (
	kind: string,
	title: string,
	url: string,
	content: string,
	lang = "fr",
	source_id = "database",
	entity = ""
) => {
	const c = (content || "").replace(/\s+/g, " ").trim();
	if (c.length < 12) return;

	// Résolution d'entité automatique si non passée
	let resolvedEntity = entity;
	if (!resolvedEntity) {
		resolvedEntity = resolveEntity(title) || resolveEntity(c);
	}

	ins.run(kind, title || "", url || "", c, lang, source_id, resolvedEntity);
	n++;
};

// ── Data structurée (la plus fiable) ───────────────────────────────────────
type Row = Record<string, unknown>;
const q = (sql: string) => db.query(sql).all() as Row[];
const s = (v: unknown) => (v == null ? "" : String(v));

db.run("BEGIN");
console.log("-> Insertion de la donnée structurée de la base…");

for (const c of q(`SELECT id,name,name_ja,name_romaji,race,ki,description FROM db_characters`)) {
	add(
		"character",
		s(c.name),
		`/wiki/dragon-ball/character/${c.id}`,
		`${s(c.name)} (${s(c.name_ja)} / ${s(c.name_romaji)}). Race: ${s(c.race)}. Ki: ${s(c.ki)}. ${s(c.description)}`,
		"fr",
		"db_characters",
		s(c.name)
	);
}
for (const p of q(`SELECT id,name,name_ja,description FROM db_planets`)) {
	add(
		"planet",
		s(p.name),
		`/wiki/dragon-ball/planet/${p.id}`,
		`Planète ${s(p.name)} (${s(p.name_ja)}). ${s(p.description)}`,
		"fr",
		"db_planets",
		s(p.name)
	);
}
for (const r of q(`SELECT slug,name,name_ja,description FROM db_races`)) {
	add(
		"race",
		s(r.name),
		`/wiki/races/${s(r.slug)}`,
		`Race ${s(r.name)} (${s(r.name_ja)}). ${s(r.description)}`,
		"fr",
		"db_races",
		s(r.name)
	);
}
for (const t of q(`SELECT slug,name,name_ja,type,description FROM db_techniques`)) {
	add(
		"technique",
		s(t.name),
		`/wiki/dragon-ball/technique/${s(t.slug)}`,
		`Technique ${s(t.name)} (${s(t.name_ja)}) — ${s(t.type)}. ${s(t.description)}`,
		"fr",
		"db_techniques",
		s(t.name)
	);
}
for (const tr of q(`SELECT name,ki FROM db_transformations`)) {
	add(
		"transformation",
		s(tr.name),
		`/wiki/dragon-ball`,
		`Transformation ${s(tr.name)}. Ki: ${s(tr.ki)}.`,
		"fr",
		"db_transformations",
		s(tr.name)
	);
}
for (const sg of q(`SELECT slug,name,name_ja,series,description FROM db_sagas`)) {
	add(
		"saga",
		s(sg.name),
		`/wiki/sagas`,
		`Saga ${s(sg.name)} (${s(sg.name_ja)}) — ${s(sg.series)}. ${s(sg.description)}`,
		"fr",
		"db_sagas",
		s(sg.name)
	);
}
for (const m of q(`SELECT id,title,title_ja,series,synopsis FROM db_movies`)) {
	add(
		"movie",
		s(m.title),
		`/wiki/dragon-ball/movie/${m.id}`,
		`Film ${s(m.title)} (${s(m.title_ja)}) — ${s(m.series)}. ${s(m.synopsis)}`,
		"fr",
		"db_movies",
		s(m.title)
	);
}
for (const g of q(`SELECT slug,title,title_ja,platforms,description FROM db_games`)) {
	add(
		"game",
		s(g.title),
		`/wiki/jeux`,
		`Jeu ${s(g.title)} (${s(g.title_ja)}) — ${s(g.platforms)}. ${s(g.description)}`,
		"fr",
		"db_games",
		s(g.title)
	);
}
for (const e of q(
	`SELECT id,series,number_in_series,title,synopsis FROM db_episodes WHERE synopsis IS NOT NULL AND synopsis<>''`
)) {
	add(
		"episode",
		`${s(e.series)} ${s(e.number_in_series)} — ${s(e.title)}`,
		`/wiki/episodes/${e.id}`,
		`Épisode ${s(e.series)} #${s(e.number_in_series)} : ${s(e.title)}. ${s(e.synopsis)}`,
		"fr",
		"db_episodes"
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
		"fr",
		"db_arcs",
		s(a.name)
	);
}

for (const v of q(
	`SELECT id, series, volume_number, title, title_ja, isbn FROM db_manga_volumes`
)) {
	add(
		"manga_volume",
		`Volume ${s(v.volume_number)} — ${s(v.title)}`,
		`/wiki/manga`,
		`Volume ${s(v.volume_number)} du manga ${s(v.series)}${v.title ? ` intitulé ${s(v.title)}` : ""}${v.title_ja ? ` (${s(v.title_ja)})` : ""}.${v.isbn ? ` ISBN: ${s(v.isbn)}` : ""}`,
		"fr",
		"db_manga_volumes"
	);
}

for (const ch of q(
	`SELECT id, series, chapter_number, title, title_ja, volume_id FROM db_manga_chapters`
)) {
	const vol = ch.volume_id
		? (q(`SELECT volume_number FROM db_manga_volumes WHERE id = ${ch.volume_id}`)[0] as
				| Row
				| undefined)
		: undefined;
	const volCtx = vol ? ` (Volume ${s(vol.volume_number)})` : "";
	add(
		"manga_chapter",
		`Chapitre ${s(ch.chapter_number)} — ${s(ch.title)}`,
		`/wiki/manga`,
		`Chapitre ${s(ch.chapter_number)} du manga ${s(ch.series)}${volCtx}${ch.title ? ` intitulé ${s(ch.title)}` : ""}${ch.title_ja ? ` (${s(ch.title_ja)})` : ""}`,
		"fr",
		"db_manga_chapters"
	);
}

for (const t of q(
	`SELECT id, slug, name, description, author, language, category, stars FROM db_tools`
)) {
	add(
		"tool",
		s(t.name),
		`/wiki/outils`,
		`Outil ou ressource communautaire ${s(t.name)} (${s(t.category)}). Créateur: ${s(t.author)}. Langue: ${s(t.language)}. Étoiles: ${s(t.stars)}. Description: ${s(t.description)}`,
		s(t.language).toLowerCase().includes("en") ? "en" : "fr",
		"db_tools"
	);
}

// ── Chunking sémantique (PLAN A4) ──────────────────────────────────────────

function splitIntoSentences(text: string): string[] {
	const sentences: string[] = [];
	let current = "";
	// Split simple par ponctuation (. ! ?) suivi d'un espace ou fin de ligne
	const parts = text.split(/([.!?](?:\s+|$))/);
	for (let i = 0; i < parts.length; i++) {
		const p = parts[i];
		if (!p) continue;
		if (i % 2 === 1) {
			current += p;
			sentences.push(current.trim());
			current = "";
		} else {
			current += p;
		}
	}
	if (current.trim()) {
		sentences.push(current.trim());
	}
	return sentences;
}

interface Chunk {
	content: string;
	section: string;
}

function chunkDocument(markdown: string, maxChunkChars = 1400, overlapPct = 0.15): Chunk[] {
	const chunks: Chunk[] = [];
	const lines = markdown.split("\n");

	let currentSection = "";
	let currentSectionHierarchy: string[] = [];
	let currentSectionTextLines: string[] = [];

	const emitSectionChunks = (secTitle: string, secLines: string[]) => {
		if (secLines.length === 0) return;
		const text = secLines.join("\n").trim();
		if (!text) return;

		const sentences = splitIntoSentences(text);
		const overlapChars = Math.floor(maxChunkChars * overlapPct);

		let currentChunkSentences: string[] = [];
		let currentChunkLen = 0;

		// Le titre de section sert de préfixe de contexte pour le chunk
		const contextPrefix = secTitle ? `[${secTitle}] ` : "";

		for (let i = 0; i < sentences.length; i++) {
			const s = sentences[i];
			const sLen = s.length;

			if (currentChunkLen + sLen > maxChunkChars && currentChunkSentences.length > 0) {
				// Emit chunk
				chunks.push({
					content: contextPrefix + currentChunkSentences.join(" "),
					section: secTitle,
				});

				// Calcul du chevauchement (overlap 15% en fin de chunk)
				const overlapSentences: string[] = [];
				let overlapLen = 0;
				for (let j = currentChunkSentences.length - 1; j >= 0; j--) {
					const os = currentChunkSentences[j];
					if (overlapLen + os.length <= overlapChars) {
						overlapSentences.unshift(os);
						overlapLen += os.length;
					} else {
						break;
					}
				}
				currentChunkSentences = overlapSentences;
				currentChunkLen = overlapLen;
			}

			currentChunkSentences.push(s);
			currentChunkLen += sLen;
		}

		if (currentChunkSentences.length > 0) {
			chunks.push({
				content: contextPrefix + currentChunkSentences.join(" "),
				section: secTitle,
			});
		}
	};

	for (const line of lines) {
		const match = line.match(/^(#{1,6})\s+(.+)$/);
		if (match) {
			emitSectionChunks(currentSection, currentSectionTextLines);
			currentSectionTextLines = [];

			const level = match[1].length;
			const title = match[2].trim();

			currentSectionHierarchy = currentSectionHierarchy.slice(0, level - 1);
			currentSectionHierarchy[level - 1] = title;
			currentSection = currentSectionHierarchy.filter(Boolean).join(" > ");
		} else {
			currentSectionTextLines.push(line);
		}
	}

	emitSectionChunks(currentSection, currentSectionTextLines);
	return chunks;
}

function detectLang(docId: string, docName: string, docUrl: string, content: string): string {
	const idLower = docId.toLowerCase();
	const nameLower = docName.toLowerCase();
	const urlLower = docUrl.toLowerCase();

	if (
		idLower.includes("fd-fr-") ||
		idLower.includes("-fr") ||
		urlLower.includes("/fr/") ||
		nameLower.includes("(fr)")
	) {
		return "fr";
	}
	if (
		idLower.includes("fd-en-") ||
		idLower.includes("-en") ||
		urlLower.includes("/en/") ||
		nameLower.includes("(en)")
	) {
		return "en";
	}

	const frWords = /\b(le|la|les|de|des|et|en|un|une|est|dans|pour|qui|que)\b/i;
	const enWords = /\b(the|of|and|in|a|an|is|to|for|who|that|with|on|at)\b/i;

	const frHits = (content.match(new RegExp(frWords, "gi")) || []).length;
	const enHits = (content.match(new RegExp(enWords, "gi")) || []).length;

	return frHits >= enHits ? "fr" : "en";
}

function resolveSourceId(docId: string): string {
	if (docId.startsWith("fd-fr-") || (docId.startsWith("fandom-") && docId.endsWith("-fr"))) {
		return "fandom-fr";
	}
	if (docId.startsWith("fd-en-") || (docId.startsWith("fandom-") && docId.endsWith("-en"))) {
		return "fandom-en";
	}
	const parts = docId.split("-");
	if (parts.length > 1) {
		const base = parts[0];
		if (base === "wiki") return "wikipedia";
		return base;
	}
	return docId;
}

// ── Chargement et chunking du corpus scrapé ─────────────────────────────────
if (existsSync(CORPUS)) {
	console.log("-> Ingestion et chunking sémantique du corpus scrapé…");
	try {
		const corpus = JSON.parse(readFileSync(CORPUS, "utf-8")) as {
			docs: { id: string; name: string; url: string; markdown: string }[];
		};

		let docCount = 0;
		for (const d of corpus.docs) {
			// Nettoyer les balises d'en-tête de premier niveau trop génériques et les liens
			const cleanMd = d.markdown.replace(/^#.*$/gm, "").replace(/\[[^\]]*\]\([^)]*\)/g, "");

			const chunks = chunkDocument(cleanMd, 1400, 0.15);
			const lang = detectLang(d.id, d.name, d.url, cleanMd);
			const sourceId = resolveSourceId(d.id);

			for (const chunk of chunks) {
				// canonicalise l'entité si possible
				const entity = resolveEntity(chunk.section) || resolveEntity(chunk.content);

				add("source", d.name, d.url, chunk.content, lang, sourceId, entity);
			}
			docCount++;
		}
		console.log(`✓ Corpus scrapé traité : ${docCount} documents chunkés.`);
	} catch (err) {
		console.error("✗ Échec de lecture/traitement de corpus.json :", err);
	}
} else {
	console.warn("⚠ corpus.json introuvable. Skip de la section corpus scrapé.");
}

db.run("COMMIT");
const total = (db.query(`SELECT COUNT(*) c FROM rag_chunks`).get() as { c: number }).c;
console.log(`✓ rag_chunks construit : ${n} chunks insérés (${total} total).`);

// ── Embeddings denses (volet sémantique du retrieval hybride avec sqlite-vec) ──
db.run(`DROP TABLE IF EXISTS vec_chunks`);
db.run(`CREATE VIRTUAL TABLE vec_chunks USING vec0(embedding float[${EMBED_DIM}])`);

if (process.argv.includes("--no-vectors")) {
	console.log(
		"→ --no-vectors : vec_chunks laissé vide (mode lexical BM25). Lancer un build complet plus tard pour l'hybride."
	);
	db.close();
	process.exit(0);
}

db.run(
	`CREATE TABLE IF NOT EXISTS rag_meta (model TEXT, dim INTEGER, count INTEGER, built_at INTEGER)`
);

const chunks = db.query(`SELECT rowid, title, content FROM rag_chunks ORDER BY rowid`).all() as {
	rowid: number;
	title: string;
	content: string;
}[];

console.log(`→ embeddings via sidecar (http://127.0.0.1:5007) sur ${chunks.length} chunks…`);
const embT0 = Date.now();
const texts = chunks.map((c) => `${c.title}. ${c.content}`.slice(0, 1200));

const vectors: Float32Array[] = Array.from({ length: texts.length });
const BATCH_SIZE = 64;
const concurrency = 6;

const queue: { index: number; batchTexts: string[] }[] = [];
for (let i = 0; i < texts.length; i += BATCH_SIZE) {
	queue.push({
		index: i,
		batchTexts: texts.slice(i, i + BATCH_SIZE)
	});
}

const totalBatches = queue.length;
let completedBatches = 0;

async function worker() {
	while (queue.length > 0) {
		const item = queue.shift();
		if (!item) continue;
		const { index, batchTexts } = item;

		let success = false;
		let retries = 15;
		let batchVectors: Float32Array[] = [];
		while (!success && retries > 0) {
			try {
				const res = await fetch("http://127.0.0.1:5007/embed", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ texts: batchTexts, kind: "passage" }),
				});
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`);
				}
				const data = (await res.json()) as { vectors: number[][] };
				batchVectors = data.vectors.map(v => new Float32Array(v));
				success = true;
			} catch (err) {
				retries--;
				if (retries === 0) {
					console.error(`\n✗ Échec d'embedding pour le lot ${index} - ${index + batchTexts.length}:`, err);
					process.exit(1);
				}
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}

		for (let j = 0; j < batchVectors.length; j++) {
			vectors[index + j] = batchVectors[j];
		}

		completedBatches++;
		// Mettre à jour la progression de façon thread-safe
		if (completedBatches % 5 === 0 || completedBatches === totalBatches) {
			const pct = ((completedBatches / totalBatches) * 100).toFixed(1);
			process.stdout.write(
				`\r  [RAG BUILD] Embedding progress: ${pct}% (${completedBatches * BATCH_SIZE}/${texts.length})`
			);
		}
	}
}

const workers = Array.from({ length: concurrency }, () => worker());
await Promise.all(workers);
console.log("\n✓ Étape d'embedding terminée.");

const insVec = db.query(`INSERT INTO vec_chunks (rowid, embedding) VALUES (?, ?)`);
const tx = db.transaction(() => {
	for (let i = 0; i < chunks.length; i++) {
		// sqlite-vec supporte directement l'insertion de Float32Array (ou son buffer) dans Bun
		insVec.run(chunks[i].rowid, vectors[i]);
	}
});
tx();

db.run(`DELETE FROM rag_meta`);
db.query(`INSERT INTO rag_meta (model, dim, count, built_at) VALUES (?, ?, ?, ?)`).run(
	EMBED_MODEL,
	EMBED_DIM,
	vectors.length,
	Date.now()
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
