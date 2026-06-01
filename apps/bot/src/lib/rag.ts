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

const EMBED_URL = process.env.EMBED_URL ?? "http://127.0.0.1:5007";
const EMBED_TIMEOUT_MS = Number(process.env.EMBED_TIMEOUT_MS ?? 1500);
const RRF_K = 60;

export interface RagHit {
  rowid: number;
  kind: string;
  title: string;
  url: string;
  snippet: string;
}

/** Matrice de vecteurs chargée en mémoire (cache process, invalidée par version). */
interface VectorCache {
  rowids: Int32Array;
  mat: Float32Array; // n × dim, contigu
  dim: number;
  n: number;
  version: number; // rag_meta.built_at
}

let cache: VectorCache | null = null;

/** Charge / rafraîchit le cache vectoriel depuis SQLite (no-op si à jour). */
function loadVectors(db: Database): VectorCache | null {
  let version = 0;
  let dim = 0;
  try {
    const meta = db.query("SELECT built_at, dim FROM rag_meta LIMIT 1").get() as {
      built_at: number;
      dim: number;
    } | null;
    if (!meta) return null;
    version = meta.built_at;
    dim = meta.dim;
  } catch {
    return null; // tables pas encore construites
  }
  if (cache && cache.version === version && cache.dim === dim) return cache;

  const rows = db.query("SELECT rowid, vec FROM rag_vectors ORDER BY rowid").all() as {
    rowid: number;
    vec: Uint8Array;
  }[];
  if (rows.length === 0) return null;

  const n = rows.length;
  const rowids = new Int32Array(n);
  const mat = new Float32Array(n * dim);
  for (let i = 0; i < n; i++) {
    rowids[i] = rows[i].rowid;
    const blob = rows[i].vec;
    // blob = float32 little-endian ; réinterprète sans copie quand aligné.
    const f32 = new Float32Array(blob.buffer, blob.byteOffset, blob.byteLength / 4);
    mat.set(f32.subarray(0, dim), i * dim);
  }
  cache = { rowids, mat, dim, n, version };
  return cache;
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

/** Top-K cosinus exact (vecteurs déjà normalisés → cosinus = produit scalaire). */
function cosineTopK(
  c: VectorCache,
  q: Float32Array,
  k: number,
): { rowid: number; score: number }[] {
  const { mat, dim, n, rowids } = c;
  const scored: { rowid: number; score: number }[] = [];
  for (let i = 0; i < n; i++) {
    let dot = 0;
    const off = i * dim;
    for (let d = 0; d < dim; d++) dot += mat[off + d] * q[d];
    scored.push({ rowid: rowids[i], score: dot });
  }
  return scored.toSorted((a, b) => b.score - a.score).slice(0, k);
}

/** Tokenise une requête naturelle en clause FTS5 OR (recall large). */
function ftsMatch(raw: string): string | null {
  const tokens = raw
    .replace(/["*()]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (tokens.length === 0) return null;
  return tokens.map((t) => `"${t}"`).join(" OR ");
}

/**
 * Recherche hybride. Renvoie au plus `limit` hits fusionnés (RRF) ou, à défaut
 * de signal sémantique, le classement BM25.
 */
export async function hybridSearch(
  db: Database,
  raw: string,
  limit: number,
): Promise<{ results: RagHit[]; mode: "hybrid" | "lexical" }> {
  const query = raw.trim();
  const match = ftsMatch(query);
  if (!match) return { results: [], mode: "lexical" };

  const POOL = 50;
  const bm = db
    .query(
      "SELECT rowid, kind, title, url, snippet(rag_chunks, 3, '', '', '…', 18) AS snippet " +
        "FROM rag_chunks WHERE rag_chunks MATCH ? ORDER BY rank LIMIT ?",
    )
    .all(match, POOL) as RagHit[];

  const bmById = new Map<number, RagHit>();
  for (const h of bm) bmById.set(h.rowid, h);

  // Signal sémantique (best-effort).
  const c = loadVectors(db);
  const qv = c ? await embedRemote(query) : null;
  const dense = c && qv ? cosineTopK(c, qv, POOL) : [];

  if (dense.length === 0) {
    return { results: bm.slice(0, limit), mode: "lexical" };
  }

  // Fusion RRF des deux classements.
  const fused = new Map<number, number>();
  bm.forEach((h, r) => fused.set(h.rowid, (fused.get(h.rowid) ?? 0) + 1 / (RRF_K + r + 1)));
  dense.forEach((d, r) => fused.set(d.rowid, (fused.get(d.rowid) ?? 0) + 1 / (RRF_K + r + 1)));

  const ordered = [...fused.entries()]
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([rowid]) => rowid);

  // Hydrate les métadonnées des hits sémantiques absents de BM25.
  const missing = ordered.filter((id) => !bmById.has(id));
  if (missing.length) {
    const ph = missing.map(() => "?").join(",");
    const extra = db
      .query(
        `SELECT rowid, kind, title, url, substr(content, 1, 160) AS snippet ` +
          `FROM rag_chunks WHERE rowid IN (${ph})`,
      )
      .all(...missing) as RagHit[];
    for (const h of extra) bmById.set(h.rowid, h);
  }

  const results = ordered.map((id) => bmById.get(id)).filter((h): h is RagHit => Boolean(h));
  return { results, mode: "hybrid" };
}
