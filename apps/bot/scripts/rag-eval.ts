/**
 * rag-eval.ts — Harnais d'évaluation retrieval RAG Dragon Ball (gold-set).
 *
 * Mesure la qualité de la récupération sur un jeu doré (tests/rag-gold.jsonl)
 * pour rendre la « SOTA RAG » mesurable et CI-gateable (PLAN A0). Réutilise la
 * recherche existante `hybridSearch` (lib/rag.ts) — n'en réimplémente RIEN. Un
 * cas = une question + des matchers `expect` (sous-chaîne / titre attendu). Un
 * hit = un matcher apparaît dans le `title` OU le `snippet` d'un chunk renvoyé.
 *
 * Modes évalués :
 *   - lexical            — toujours (BM25 FTS5, ne dépend pas du sidecar).
 *   - hybrid / +rerank   — seulement si le sidecar EMBED_URL répond (sinon skip
 *                          propre, avec note ; hybridSearch dégrade en lexical).
 *
 * Métriques par mode : Recall@{1,3,5,10}, MRR, nDCG@10.
 *
 * Lecture seule sur data/bot.db (aucune mutation). Si l'index est vide, le
 * harnais s'exécute quand même et rapporte « index empty » proprement.
 *
 * Usage  : bun scripts/rag-eval.ts [--ci]
 *   --ci : exit 1 si Recall@5 (lexical) < seuil documenté (régression). Sinon
 *          exit 0 toujours (outil de mesure, pas un gate dur par défaut).
 */
import { Database } from "bun:sqlite";
import { hybridSearch, type RagHit, type RagMode } from "../src/lib/rag";

const DB = process.env.RAG_DB ?? new URL("../data/bot.db", import.meta.url).pathname;
const GOLD = new URL("../tests/rag-gold.jsonl", import.meta.url).pathname;
const EMBED_URL = process.env.EMBED_URL ?? "http://127.0.0.1:5007";

// Seuil CI calé SOUS la baseline lexicale observée (Recall@5 = 80.0 % sur le
// gold-set de 20 cas, index 1041 chunks, sidecar down — run du 2026-06-04). On
// laisse une marge de ~10 pts pour absorber le bruit de ranking BM25 et ne
// gater qu'une régression franche (corpus appauvri, tokenizer FTS cassé).
const CI_RECALL5_MIN = 0.7;

const RANKS = [1, 3, 5, 10] as const;
const NDCG_K = 10;
const LIMIT = 10; // on récupère 10 hits → couvre tous les @k jusqu'à 10.

interface GoldCase {
  q: string;
  expect: string[];
}

interface ModeMetrics {
  cases: number;
  recall: Record<number, number>; // @k → fraction de cas avec >=1 hit dans le top-k
  mrr: number;
  ndcg: number;
}

/** Charge le jeu doré (JSONL, une question par ligne). */
async function loadGold(): Promise<GoldCase[]> {
  const text = await Bun.file(GOLD).text();
  const out: GoldCase[] = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    const obj = JSON.parse(t) as GoldCase;
    if (typeof obj.q === "string" && Array.isArray(obj.expect) && obj.expect.length > 0) {
      out.push(obj);
    }
  }
  return out;
}

/** Un hit = un matcher `expect` apparaît (insensible à la casse) dans le
 *  titre ou le snippet du chunk. Robuste sans rowids exacts. */
function isHit(hit: RagHit, expect: string[]): boolean {
  const hay = `${hit.title}\n${hit.snippet}`.toLowerCase();
  return expect.some((m) => hay.includes(m.toLowerCase()));
}

/** Vrai si le sidecar d'embeddings répond — sinon hybrid/+rerank seraient des
 *  doublons silencieux du mode lexical (hybridSearch dégrade en BM25). */
async function sidecarUp(): Promise<boolean> {
  for (const path of ["/health", "/", "/embed"]) {
    try {
      const res = await fetch(`${EMBED_URL}${path}`, {
        method: path === "/embed" ? "POST" : "GET",
        headers: { "content-type": "application/json" },
        body: path === "/embed" ? JSON.stringify({ texts: ["ping"], kind: "query" }) : undefined,
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) return true;
    } catch {
      /* essaie le prochain endpoint */
    }
  }
  return false;
}

/** Position 1-based du premier hit dans la liste des résultats, ou 0 si aucun. */
function firstHitRank(results: RagHit[], expect: string[]): number {
  for (let i = 0; i < results.length; i++) {
    if (isHit(results[i], expect)) return i + 1;
  }
  return 0;
}

/**
 * nDCG@k avec gain binaire (1 si hit, 0 sinon) — gold non gradué. L'IDCG est le
 * DCG du classement idéal où les `hits` pertinents trouvés occupent les premiers
 * rangs ; nDCG ∈ [0,1] (1 = tous les pertinents en tête). Sans pertinent dans le
 * top-k, nDCG = 0.
 */
function ndcgAtK(results: RagHit[], expect: string[], k: number): number {
  const top = Math.min(k, results.length);
  let dcg = 0;
  let hits = 0;
  for (let i = 0; i < top; i++) {
    if (isHit(results[i], expect)) {
      dcg += 1 / Math.log2(i + 2);
      hits++;
    }
  }
  if (hits === 0) return 0;
  let idcg = 0;
  for (let i = 0; i < hits; i++) idcg += 1 / Math.log2(i + 2);
  return dcg / idcg;
}

/** Accumulateur de comptes bruts par mode, agrégé en {@link ModeMetrics}. */
interface Acc {
  recallHits: Record<number, number>;
  mrrSum: number;
  ndcgSum: number;
  counted: number;
}

function newAcc(): Acc {
  return { recallHits: { 1: 0, 3: 0, 5: 0, 10: 0 }, mrrSum: 0, ndcgSum: 0, counted: 0 };
}

function accAdd(acc: Acc, results: RagHit[], expect: string[]): void {
  acc.counted++;
  const rank = firstHitRank(results, expect);
  for (const k of RANKS) {
    if (rank > 0 && rank <= k) acc.recallHits[k]++;
  }
  if (rank > 0) acc.mrrSum += 1 / rank;
  acc.ndcgSum += ndcgAtK(results, expect, NDCG_K);
}

function finalize(acc: Acc): ModeMetrics {
  const n = acc.counted || 1;
  return {
    cases: acc.counted,
    recall: {
      1: acc.recallHits[1] / n,
      3: acc.recallHits[3] / n,
      5: acc.recallHits[5] / n,
      10: acc.recallHits[10] / n,
    },
    mrr: acc.mrrSum / n,
    ndcg: acc.ndcgSum / n,
  };
}

function pct(x: number): string {
  return `${(x * 100).toFixed(1)}%`.padStart(7);
}

function printTable(rows: { mode: string; m: ModeMetrics }[]): void {
  const head = ["mode", "R@1", "R@3", "R@5", "R@10", "MRR", "nDCG@10"];
  const widths = [14, 7, 7, 7, 7, 7, 7];
  const fmtRow = (cells: string[]) =>
    cells.map((c, i) => c.padStart(widths[i])).join("  ");
  console.log(fmtRow(head));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const { mode, m } of rows) {
    console.log(
      fmtRow([
        mode,
        pct(m.recall[1]),
        pct(m.recall[3]),
        pct(m.recall[5]),
        pct(m.recall[10]),
        m.mrr.toFixed(3),
        m.ndcg.toFixed(3),
      ]),
    );
  }
}

async function main(): Promise<void> {
  const ci = process.argv.includes("--ci");

  const gold = await loadGold();
  console.log(`→ gold-set : ${gold.length} cas (${GOLD})`);

  const db = new Database(DB, { readonly: true });

  // Index vide / absent → rapport propre, pas de crash.
  let chunkCount = 0;
  try {
    chunkCount = (db.query("SELECT COUNT(*) c FROM rag_chunks").get() as { c: number }).c;
  } catch {
    console.log("⚠ rag_chunks absent (index non construit) — rien à mesurer.");
    db.close();
    process.exit(ci ? 1 : 0);
  }
  if (chunkCount === 0) {
    console.log("⚠ index empty (rag_chunks: 0 chunk) — lancer `bun scripts/rag-build.ts`.");
    db.close();
    process.exit(ci ? 1 : 0);
  }
  console.log(`→ index : ${chunkCount} chunks indexés.`);

  const hybridAvailable = await sidecarUp();
  console.log(
    hybridAvailable
      ? `→ sidecar OK (${EMBED_URL}) — modes hybrid / hybrid+rerank évalués.`
      : `→ sidecar absent (${EMBED_URL}) — modes hybrid/+rerank SKIP (lexical seul).`,
  );
  console.log("");

  // hybridSearch lit EMBED_URL / RAG_RERANK au chargement du module (consts) :
  // on ne peut donc PAS forcer un mode au runtime depuis ce process. On exécute
  // chaque requête une fois et on bucketise par le mode réellement servi
  // (`mode` retourné). Sidecar absent → tout retombe en `lexical` (la baseline
  // gate-able, qui est le livrable). Sidecar présent → les cas se rangent en
  // hybrid / hybrid+rerank selon ce que le pipeline a pu atteindre.
  const accs: Record<RagMode, Acc> = {
    lexical: newAcc(),
    hybrid: newAcc(),
    "hybrid+rerank": newAcc(),
  };
  for (const g of gold) {
    const { results, mode } = await hybridSearch(db, g.q, LIMIT);
    accAdd(accs[mode], results, g.expect);
  }

  const order: RagMode[] = ["lexical", "hybrid", "hybrid+rerank"];
  const rows = order
    .filter((mode) => accs[mode].counted > 0)
    .map((mode) => ({ mode, m: finalize(accs[mode]) }));

  printTable(rows);
  console.log("");

  const lexical = finalize(accs.lexical);
  const lexN = accs.lexical.counted;
  console.log(
    `overall: lexical Recall@5=${pct(lexical.recall[5]).trim()} MRR=${lexical.mrr.toFixed(3)} ` +
      `nDCG@10=${lexical.ndcg.toFixed(3)} sur ${lexN}/${gold.length} cas servis en lexical` +
      (hybridAvailable ? "" : " (hybrid/+rerank non mesurés : sidecar down)"),
  );

  // Enregistrer le rapport RAG dans Redis pour le dashboard
  try {
    const { redis } = await import("bun");
    const report = {
      chunkCount,
      date: new Date().toISOString(),
      rows: rows.map(r => ({
        mode: r.mode,
        recall: r.m.recall,
        mrr: r.m.mrr,
        ndcg: r.m.ndcg,
        cases: r.m.cases
      })),
      lexical: {
        recall5: lexical.recall[5],
        mrr: lexical.mrr,
        ndcg: lexical.ndcg,
        cases: lexN
      }
    };
    await redis.set("dbz:eval:report:rag", JSON.stringify(report));
    console.log("✓ Rapport RAG poussé dans Redis.");
  } catch (err) {
    console.error("✗ Impossible d'enregistrer le rapport RAG dans Redis :", err);
  }

  db.close();

  if (ci) {
    if (lexN === 0) {
      console.log("✗ CI: aucun cas servi en lexical — impossible de gater (sidecar a tout absorbé ?).");
      process.exit(1);
    }
    const r5 = lexical.recall[5];
    if (r5 < CI_RECALL5_MIN) {
      console.log(`✗ CI: Recall@5 lexical ${pct(r5).trim()} < seuil ${pct(CI_RECALL5_MIN).trim()}`);
      process.exit(1);
    }
    console.log(`✓ CI: Recall@5 lexical ${pct(r5).trim()} ≥ seuil ${pct(CI_RECALL5_MIN).trim()}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
