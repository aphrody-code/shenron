/**
 * eval-own.ts — Évaluation HONNÊTE et reproductible de NOTRE LLM maison sur le gold-set.
 *
 * Mesure le VRAI chemin de production (hybridSearch -> generateLlmAnswer, qui tape notre serveur
 * :5009). Pas de juge LLM externe (l'ancien juge aphrody s'écroulait à 12/20). À la place, des
 * métriques objectives :
 *   - non_empty   : % de réponses non vides (doit être 100% — repli extractif ancré garanti).
 *   - grounding   : % de mots-clés attendus (`expect`) présents dans la réponse.
 *   - latency_ms  : latence moyenne de génération.
 *
 * Usage : RAG_DB=/tmp/dbz-train.db bun scripts/llm/eval-own.ts [--persona whis] [--n 20]
 * Lecture seule. Pousse un rapport dans Redis (dbz:eval:report:own) pour le dashboard.
 */
import { Database } from "bun:sqlite";
import { hybridSearch } from "../../src/lib/rag";
import { generateLlmAnswer } from "../../src/lib/llm";

const DB = process.env.RAG_DB ?? new URL("../../data/bot.db", import.meta.url).pathname;
const GOLD = new URL("../../tests/rag-gold.jsonl", import.meta.url).pathname;

interface GoldCase {
  q: string;
  expect: string[];
}

function arg(name: string, def: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

async function main() {
  const persona = arg("persona", "whis");
  const limit = Number(arg("n", "0"));

  const text = await Bun.file(GOLD).text();
  let gold: GoldCase[] = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      const o = JSON.parse(t) as GoldCase;
      if (o.q && Array.isArray(o.expect)) gold.push(o);
    } catch {
      /* ignore */
    }
  }
  if (limit > 0) gold = gold.slice(0, limit);

  const db = new Database(DB, { readonly: true });
  console.log(`=== ÉVAL NOTRE LLM MAISON — ${gold.length} cas, persona=${persona} ===\n`);

  let nonEmpty = 0;
  let groundingSum = 0;
  let latSum = 0;
  const rows: { q: string; cov: string; len: number; ms: number; sample: string }[] = [];

  for (let i = 0; i < gold.length; i++) {
    const c = gold[i];
    const { results } = await hybridSearch(db, c.q, 5);
    const t0 = performance.now();
    const answer = await generateLlmAnswer(db, c.q, results, persona);
    const ms = performance.now() - t0;
    latSum += ms;

    const a = (answer || "").trim();
    if (a.length > 0) nonEmpty++;
    const low = a.toLowerCase();
    const hits = c.expect.filter((e) => low.includes(e.toLowerCase())).length;
    const cov = c.expect.length > 0 ? hits / c.expect.length : 1;
    groundingSum += cov;

    rows.push({
      q: c.q,
      cov: `${hits}/${c.expect.length}`,
      len: a.length,
      ms: Math.round(ms),
      sample: a.slice(0, 90),
    });
    console.log(`[${i + 1}/${gold.length}] ${c.q}`);
    console.log(`   grounding=${hits}/${c.expect.length} len=${a.length} ${Math.round(ms)}ms`);
    console.log(`   -> ${a.slice(0, 120)}${a.length > 120 ? "…" : ""}\n`);
  }
  db.close();

  const n = gold.length || 1;
  const nonEmptyPct = (nonEmpty / n) * 100;
  const groundingPct = (groundingSum / n) * 100;
  const avgLat = latSum / n;

  console.log("=================== RAPPORT ===================");
  console.log(`Réponses non vides : ${nonEmptyPct.toFixed(1)}%  (${nonEmpty}/${n})`);
  console.log(`Grounding mots-clés: ${groundingPct.toFixed(1)}%`);
  console.log(`Latence moyenne    : ${avgLat.toFixed(0)} ms`);
  console.log("===============================================");

  try {
    const { redis } = await import("bun");
    const report = {
      model: "dbz-own",
      nonEmptyPct,
      groundingPct,
      avgLatencyMs: Math.round(avgLat),
      cases: n,
      // Proxy /5 HONNÊTE : avgFact = grounding (faits réellement présents). Pas de score de style
      // inventé (notre éval objective ne mesure pas le ton) -> avgPersona/avgConcise volontairement omis.
      avgFact: Math.round((groundingPct / 100) * 5 * 100) / 100,
      reliability5: Math.round((nonEmptyPct / 100) * 5 * 100) / 100,
      evaluated: n,
      persona,
      date: new Date().toISOString(),
      rows,
    };
    await redis.set("dbz:eval:report:own", JSON.stringify(report));
    // Compat dashboard existant (lit dbz:eval:report:llm:latest) — champs honnêtes uniquement.
    await redis.set("dbz:eval:report:llm:latest", JSON.stringify(report));
    console.log("✓ Rapports poussés dans Redis (dbz:eval:report:own + llm:latest).");
  } catch (err) {
    console.error("✗ Échec écriture Redis :", err);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
