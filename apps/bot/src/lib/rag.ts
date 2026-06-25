/**
 * rag.ts — Retrieval hybride Dragon Ball (runtime bot, léger).
 *
 * Fusionne deux signaux :
 *   1. Lexical  — FTS5 BM25 sur `rag_chunks` (exact-match, noms propres, rapide).
 *   2. Sémantique — cosinus exact (brute-force) sur `rag_vectors` (paraphrases,
 *      questions naturelles), via embeddings denses du sidecar `embed-server`.
 *
 * Fusion par Reciprocal Rank Fusion (RRF, k=60) — robuste, sans calibration de
 * scores hétérogènes. Dégradation gracieuse : si le sidecar est indisponible ou
 * les vecteurs absents, on retombe sur BM25 seul (l'endpoint reste fonctionnel).
 *
 * Ce module n'importe PAS transformers.js — il ne fait qu'un fetch HTTP local
 * vers le sidecar (process isolé du bot). Voir `lib/embeddings.ts`.
 */
import type { Database } from "bun:sqlite";
import * as sqliteVec from "sqlite-vec";
import { generateLlmAnswer } from "./llm";

const EMBED_URL = process.env.EMBED_URL ?? "http://127.0.0.1:5007";
// 3s : l'embed est rapide (~30ms) mais peut faire la queue derrière un rerank
// (~1.4s) sur le sidecar WASM mono-thread sous burst.
const EMBED_TIMEOUT_MS = Number(process.env.EMBED_TIMEOUT_MS ?? 3000);
// Timeout large : le sidecar (onnxruntime WASM mono-thread) sérialise les
// inférences → sous concurrence, un rerank peut faire la queue. La réponse est
// cachée 5 min et /ask défère, donc le pire-cas cache-miss est absorbé.
const RERANK_TIMEOUT_MS = Number(process.env.RERANK_TIMEOUT_MS ?? 6000);
const RERANK_ENABLED = process.env.RAG_RERANK !== "0";
const RERANK_POOL = 15; // nombre de candidats RRF envoyés au cross-encoder
const RRF_K = 60;

// Préférence de SOURCE : focaliser les réponses sur le MANGA plutôt que le Fandom.
// Boost multiplicatif (scale-invariant : marche sur le score RRF ET le score rerank)
// appliqué aux chunks source_id="manga", + quota garanti dans le top final. Le manga
// pertinent remonte au-dessus du Fandom ; le bruit OCR (score bas) reste en bas.
const MANGA_SOURCE = process.env.RAG_MANGA_SOURCE ?? "manga";
const MANGA_WEIGHT = Number(process.env.RAG_MANGA_WEIGHT ?? 2.2);
const MANGA_QUOTA = Number(process.env.RAG_MANGA_QUOTA ?? 2);

export interface RagHit {
	rowid: number;
	kind: string;
	title: string;
	url: string;
	snippet: string;
	/**
	 * Pertinence normalisée dans [0,1]. Comparable UNIQUEMENT au sein d'une même
	 * réponse ET d'un même `mode` : en `hybrid+rerank` c'est la sigmoïde du logit
	 * cross-encoder (≈ calibrée) ; en `hybrid`/`lexical` c'est un rang relatif
	 * (min-max). Ne JAMAIS comparer un score entre deux réponses/modes.
	 */
	score: number;
}

/** Effectue une recherche vectorielle native k-NN via l'extension sqlite-vec. */
function nativeVectorSearch(
	db: Database,
	qv: Float32Array,
	k: number,
	allowedRowids?: Set<number> | null
): { rowid: number; score: number }[] {
	sqliteVec.load(db);
	try {
		let rows: { rowid: number; distance: number }[] = [];
		if (allowedRowids) {
			// Si des filtres sémantiques/lexicaux (langue/personnage) sont actifs,
			// on récupère un pool plus large puis on filtre avec allowedRowids en JS.
			const poolSize = Math.max(k * 4, 100);
			const rawRows = db
				.query(
					"SELECT rowid, distance FROM vec_chunks WHERE embedding MATCH ?1 ORDER BY distance LIMIT ?2"
				)
				.all(qv, poolSize) as { rowid: number; distance: number }[];

			rows = rawRows.filter((r) => allowedRowids.has(r.rowid)).slice(0, k);
		} else {
			rows = db
				.query(
					"SELECT rowid, distance FROM vec_chunks WHERE embedding MATCH ?1 ORDER BY distance LIMIT ?2"
				)
				.all(qv, k) as { rowid: number; distance: number }[];
		}

		// RRF (Reciprocal Rank Fusion) n'a besoin que du classement relatif.
		// Plus la distance L2 est petite (distance de match), plus le vecteur est proche.
		// On mappe le score à -distance pour conserver un score de pertinence décroissant.
		return rows.map((r) => ({
			rowid: r.rowid,
			score: -r.distance,
		}));
	} catch (err) {
		// Dégradation gracieuse si la table vec_chunks n'a pas encore été créée (ex. premier boot)
		console.warn("[RAG] Index vectoriel (vec_chunks) indisponible, repli lexical.", err);
		return [];
	}
}

/** Embed la requête via le sidecar. Renvoie null si indisponible (timeout/erreur). */
async function embedRemote(text: string): Promise<Float32Array | null> {
	try {
		const res = await fetch(`${EMBED_URL}/embed`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ texts: [text], kind: "query" }),
			signal: AbortSignal.timeout(EMBED_TIMEOUT_MS),
		});
		if (!res.ok) return null;
		const j = (await res.json()) as { vectors: number[][] };
		const v = j.vectors?.[0];
		return v ? Float32Array.from(v) : null;
	} catch {
		return null;
	}
}

/** Rerank cross-encoder via le sidecar. Renvoie un score/passage, ou null si KO. */
async function rerankRemote(query: string, passages: string[]): Promise<number[] | null> {
	try {
		const res = await fetch(`${EMBED_URL}/rerank`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ query, passages }),
			signal: AbortSignal.timeout(RERANK_TIMEOUT_MS),
		});
		if (!res.ok) return null;
		const j = (await res.json()) as { scores: number[] };
		return Array.isArray(j.scores) ? j.scores : null;
	} catch {
		return null;
	}
}

export interface SearchOptions {
	lang?: string;
	entity?: string;
	sourceId?: string;
}

// Mots vides FR (+ quelques EN fréquents) : retirés de la clause OR FTS5 pour
// réduire le bruit lexical des questions naturelles (« comment Goku devient… »).
// L'index utilise `remove_diacritics 2` → on fold les accents AUSSI dans la
// requête, ce qui (a) rend ce set sans-accent exhaustif (« où » → « ou »), et
// (b) garantit la cohérence requête/index.
const FR_STOPWORDS = new Set([
	"le","la","les","un","une","des","de","du","au","aux","et","ou","a","en","dans","sur","sous","par","pour","avec",
	"que","qui","quoi","dont","comment","pourquoi","quand","combien","quel","quelle","quels","quelles","ce","cet","cette","ces",
	"est","sont","etre","ete","ont","son","sa","ses","leur","leurs","mon","ma","mes","ton","ta","tes","notre","votre",
	"il","elle","ils","elles","on","se","ne","pas","plus","moins","mais","donc","car","ni","or","si","comme","tout","tous","toute","toutes",
	"the","is","are","was","what","who","how","of","in","to","and","or","a","an",
]);

/** Fold accents (NFD) + minuscule — aligné sur le tokenizer FTS5 `remove_diacritics 2`. */
function fold(s: string): string {
	return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Tokenise une requête naturelle en clause FTS5 OR (recall large, sans stopwords). */
function ftsMatch(raw: string): string | null {
	const tokens = fold(raw)
		.replace(/["*()]/g, " ")
		.split(/\s+/)
		.filter((t) => t.length > 1);
	if (tokens.length === 0) return null;
	// Garde-fou : on ne filtre que les requêtes assez longues, et seulement si le
	// filtrage laisse ≥2 tokens de contenu — jamais de OR vide (« qui est X »).
	let kept = tokens;
	if (tokens.length > 3) {
		const filtered = tokens.filter((t) => !FR_STOPWORDS.has(t));
		if (filtered.length >= 2) kept = filtered;
	}
	return kept.map((t) => `"${t}"`).join(" OR ");
}

const round3 = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Snippet de repli centré sur le 1er token de requête présent dans le contenu
 * (fenêtre de `width` chars), au lieu d'un simple préfixe — donne un extrait qui
 * contient effectivement le terme cherché. Utilisé quand le highlight BM25 manque.
 */
function centeredSnippet(content: string, tokens: string[], width = 220): string {
	const text = content.replace(/\s+/g, " ").trim();
	if (text.length <= width) return text;
	const lc = fold(text);
	let pos = -1;
	for (const t of tokens) {
		const i = lc.indexOf(t);
		if (i !== -1 && (pos === -1 || i < pos)) pos = i;
	}
	if (pos === -1) return `${text.slice(0, width).trimEnd()}…`;
	const start = Math.max(0, pos - Math.floor(width / 4));
	const end = Math.min(text.length, start + width);
	return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/**
 * Normalise les scores bruts d'un set RÉSULTAT vers [0,1] selon le mode :
 *  - `hybrid+rerank` : sigmoïde du logit cross-encoder (≈ calibrée, absolue).
 *  - sinon (RRF/lexical) : min-max relatif, planché à 0.4 pour ne pas afficher
 *    « 0 % pertinent » sur le dernier hit d'une réponse par ailleurs pertinente.
 */
/**
 * Clé de déduplication d'un hit : URL canonique si présente, sinon TITRE foldé,
 * sinon rowid. Le repli par titre est crucial : les chunks Fandom `kind=source`
 * ont souvent une `url` vide → sans lui, « Kamehameha — compétence » remontait 3×.
 */
function dedupKey(url: string, title: string, rowid: number): string {
	const u = (url || "").split("?")[0].toLowerCase();
	if (u) return `u:${u}`;
	const t = fold(title || "")
		.replace(/\s+/g, " ")
		.trim();
	return t ? `t:${t}` : `r:${rowid}`;
}

function normalizeScores<T extends { score: number }>(arr: T[], mode: RagMode): T[] {
	if (mode === "hybrid+rerank") {
		return arr.map((c) => ({ ...c, score: round3(1 / (1 + Math.exp(-c.score))) }));
	}
	const vals = arr.map((c) => c.score);
	const min = Math.min(...vals);
	const max = Math.max(...vals);
	const span = max - min;
	return arr.map((c) => ({
		...c,
		score: round3(span > 0 ? 0.4 + (0.6 * (c.score - min)) / span : 1),
	}));
}

export type RagMode = "hybrid+rerank" | "hybrid" | "lexical";

/**
 * Pipeline RAG : récupération hybride (BM25 + dense, fusion RRF) puis reranking
 * cross-encoder du top-{@link RERANK_POOL} (2e étage, précision). Dégrade en
 * hybride sans rerank si le cross-encoder est indisponible, ou en BM25 seul si
 * le signal sémantique manque. Renvoie au plus `limit` hits.
 */
export async function hybridSearch(
	db: Database,
	raw: string,
	limit: number,
	options?: SearchOptions
): Promise<{ results: RagHit[]; mode: RagMode }> {
	const query = raw.trim();
	const match = ftsMatch(query);
	if (!match) return { results: [], mode: "lexical" };
	// Tokens (foldés) pour centrer le snippet de repli sur un terme cherché.
	const snipTokens = fold(query)
		.split(/\s+/)
		.filter((t) => t.length > 2);

	// Récupération des rowids autorisés si des filtres sont présents
	let allowedRowids: Set<number> | null = null;
	if (options?.lang || options?.entity || options?.sourceId) {
		let filterSql = "SELECT rowid FROM rag_chunks WHERE 1=1";
		const filterParams: any[] = [];
		if (options.lang) {
			filterSql += " AND lang = ?";
			filterParams.push(options.lang);
		}
		if (options.entity) {
			filterSql += " AND entity = ?";
			filterParams.push(options.entity);
		}
		if (options.sourceId) {
			filterSql += " AND source_id = ?";
			filterParams.push(options.sourceId);
		}
		const rows = db.query(filterSql).all(...filterParams) as { rowid: number }[];
		allowedRowids = new Set(rows.map((r) => r.rowid));
	}

	const POOL = 50;

	// Construction de la requête FTS avec filtres
	let bmSql =
		"SELECT rowid, kind, title, url, snippet(rag_chunks, 3, '', '', '…', 18) AS snippet " +
		"FROM rag_chunks WHERE rag_chunks MATCH ?";
	const bmParams: any[] = [match];

	if (options?.lang) {
		bmSql += " AND lang = ?";
		bmParams.push(options.lang);
	}
	if (options?.entity) {
		bmSql += " AND entity = ?";
		bmParams.push(options.entity);
	}
	if (options?.sourceId) {
		bmSql += " AND source_id = ?";
		bmParams.push(options.sourceId);
	}

	bmSql += " ORDER BY rank LIMIT ?";
	bmParams.push(POOL);

	const bm = db.query(bmSql).all(...bmParams) as Omit<RagHit, "score">[];

	const bmById = new Map<number, Omit<RagHit, "score">>();
	for (const h of bm) bmById.set(h.rowid, h);

	// Étage 1 — signal sémantique (best-effort).
	const qv = await embedRemote(query);
	const dense = qv ? nativeVectorSearch(db, qv, POOL, allowedRowids) : [];

	if (dense.length === 0) {
		// Repli lexical (sidecar/vecteurs absents) : on déduplique par URL et on
		// attribue un score de rang BM25 — la réponse expose toujours un `score`.
		const seen = new Set<string>();
		const out: RagHit[] = [];
		for (let i = 0; i < bm.length && out.length < limit; i++) {
			const h = bm[i]!;
			const key = dedupKey(h.url, h.title, h.rowid);
			if (seen.has(key)) continue;
			seen.add(key);
			out.push({ ...h, score: bm.length - i });
		}
		return { results: normalizeScores(out, "lexical"), mode: "lexical" };
	}

	// Fusion RRF des deux classements.
	const fused = new Map<number, number>();
	bm.forEach((h, r) => fused.set(h.rowid, (fused.get(h.rowid) ?? 0) + 1 / (RRF_K + r + 1)));
	dense.forEach((d, r) => fused.set(d.rowid, (fused.get(d.rowid) ?? 0) + 1 / (RRF_K + r + 1)));

	// source_id de tous les candidats fusionnés → préférence manga (cf. constantes).
	const fusedIds = [...fused.keys()];
	const srcById = new Map<number, string>();
	if (fusedIds.length) {
		const srcPh = fusedIds.map(() => "?").join(",");
		const srcRows = db
			.query(`SELECT rowid, source_id FROM rag_chunks WHERE rowid IN (${srcPh})`)
			.all(...fusedIds) as { rowid: number; source_id: string }[];
		for (const r of srcRows) srcById.set(r.rowid, r.source_id);
	}
	const isManga = (rowid: number) => srcById.get(rowid) === MANGA_SOURCE;
	const boost = (rowid: number, s: number) => (isManga(rowid) ? s * MANGA_WEIGHT : s);

	// Pool de rerank trié par score RRF BOOSTÉ → garantit que le manga pertinent
	// entre dans le pool (sinon le Fandom propre l'évince avant même le rerank).
	const ordered = [...fused.entries()]
		.toSorted((a, b) => boost(b[0], b[1]) - boost(a[0], a[1]))
		.slice(0, RERANK_POOL)
		.map(([rowid]) => rowid);

	// Hydrate kind/title/url + contenu (pour le rerank) de tous les candidats.
	const ph = ordered.map(() => "?").join(",");
	type ContentRow = Omit<RagHit, "score"> & { content: string };
	const rows = db
		.query(`SELECT rowid, kind, title, url, content FROM rag_chunks WHERE rowid IN (${ph})`)
		.all(...ordered) as ContentRow[];
	const rowById = new Map<number, ContentRow>();
	for (const r of rows) rowById.set(r.rowid, r);

	// Candidats dans l'ordre RRF ; snippet d'affichage = surlignage BM25 si dispo,
	// sinon fenêtre centrée sur la requête. `score` = base RRF (remplacé par le rerank ci-dessous).
	let candidates = ordered
		.map((id) => {
			const r = rowById.get(id);
			if (!r) return null;
			const snippet = bmById.get(id)?.snippet ?? centeredSnippet(r.content, snipTokens);
			return {
				rowid: r.rowid,
				kind: r.kind,
				title: r.title,
				url: r.url,
				snippet,
				content: r.content,
				score: fused.get(r.rowid) ?? 0,
			};
		})
		.filter((x): x is NonNullable<typeof x> => x !== null);

	// Étage 2 — reranking cross-encoder (best-effort).
	let mode: RagMode = "hybrid";
	if (RERANK_ENABLED && candidates.length > 1) {
		// 400 chars suffisent : le cross-encoder tronque à 512 tokens. Au-delà, on
		// paie la tokenisation sans gain (4.8s vs 1.4s pour 20 passages).
		const passages = candidates.map((c2) => `${c2.title}. ${c2.content}`.slice(0, 400));
		const scores = await rerankRemote(query, passages);
		if (scores && scores.length === candidates.length) {
			candidates = candidates.map((cand, i) => ({ ...cand, score: scores[i] }));
			mode = "hybrid+rerank";
		}
	}

	// Déduplication / diversification : un même article (URL) ne doit pas occuper
	// plusieurs slots du top-N. « Kamehameha » renvoyait 3× la MÊME fiche. On garde
	// le meilleur score par clé. Le MANGA est dédupliqué par rowid (chaque planche
	// est un passage distinct partageant l'URL générique /wiki/manga) → préserve le
	// quota manga ≥ MANGA_QUOTA appliqué juste après.
	const keyOf = (c: { rowid: number; url: string; title: string }) =>
		isManga(c.rowid) ? `m:${c.rowid}` : dedupKey(c.url, c.title, c.rowid);
	const bestByKey = new Map<string, (typeof candidates)[number]>();
	for (const c of candidates) {
		const k = keyOf(c);
		const prev = bestByKey.get(k);
		if (!prev || c.score > prev.score) bestByKey.set(k, c);
	}
	candidates = [...bestByKey.values()];

	// Tri final par score BOOSTÉ manga (×MANGA_WEIGHT), puis QUOTA garanti :
	// ≥ MANGA_QUOTA chunks manga dans le top `limit` si disponibles → les réponses
	// se focalisent sur le manga, le Fandom reste en complément.
	const top = candidates
		.toSorted((a, b) => boost(b.rowid, b.score) - boost(a.rowid, a.score))
		.slice(0, limit);
	if (MANGA_QUOTA > 0 && candidates.length > limit) {
		const rest = candidates
			.filter((c) => isManga(c.rowid) && !top.includes(c))
			.toSorted((a, b) => boost(b.rowid, b.score) - boost(a.rowid, a.score));
		let mangaCount = top.filter((c) => isManga(c.rowid)).length;
		for (const m of rest) {
			if (mangaCount >= MANGA_QUOTA) break;
			let worst = -1;
			for (let i = top.length - 1; i >= 0; i--)
				if (!isManga(top[i].rowid)) {
					worst = i;
					break;
				}
			if (worst === -1) break;
			top[worst] = m;
			mangaCount++;
		}
		top.sort((a, b) => boost(b.rowid, b.score) - boost(a.rowid, a.score));
	}

	const results: RagHit[] = normalizeScores(top, mode).map(
		({ rowid, kind, title, url, snippet, score }) => ({ rowid, kind, title, url, snippet, score })
	);
	return { results, mode };
}

/**
 * RAG Génératif : Construit un prompt avec le contexte récupéré et interroge le LLM
 * via le module unifié llm.ts.
 */
export async function generateAnswer(db: Database, query: string, hits: RagHit[]): Promise<string> {
	return generateLlmAnswer(db, query, hits, "whis");
}

/**
 * Vérifie l'état de l'index RAG au démarrage et loggue un diagnostic explicite.
 * Sans ce log, une dégradation en BM25 seul (vec_chunks vide → `mode:"lexical"`)
 * était silencieuse en prod : le retrieval sémantique + reranking restait inactif
 * sans aucune alerte. Best-effort — ne jette jamais, n'impacte pas le boot.
 */
export function logRagHealth(db: Database): void {
	try {
		const chunks = (db.query("SELECT count(*) AS c FROM rag_chunks").get() as { c: number }).c;
		let vec = -1;
		try {
			sqliteVec.load(db);
			vec = (db.query("SELECT count(*) AS c FROM vec_chunks").get() as { c: number }).c;
		} catch {
			// extension/table absente — reste en lexical
		}
		if (chunks === 0) {
			console.warn(
				"[RAG] rag_chunks vide → recherche indisponible. Lancer `bun --filter @shenron/bot run rag:build`."
			);
		} else if (vec <= 0) {
			console.warn(
				`[RAG] Index vectoriel vide (vec_chunks=${vec}, rag_chunks=${chunks}) → mode LEXICAL seul. ` +
					"Volet sémantique + reranking INACTIF. Lancer un build complet (sans --no-vectors)."
			);
		} else {
			console.log(`[RAG] OK — ${chunks} chunks, ${vec} vecteurs (retrieval hybride disponible).`);
		}
	} catch (err) {
		console.warn("[RAG] Diagnostic au démarrage impossible:", err);
	}
}
