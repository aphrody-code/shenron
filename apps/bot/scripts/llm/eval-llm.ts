/**
 * eval-llm.ts — Harnais d'évaluation LLM-as-a-judge pour les personas de Dragon Ball.
 *
 * Pour chaque cas de test du gold set, lance la recherche RAG et la génération de réponse
 * par le LLM, puis utilise le Grand Prêtre (via Gemini distant) comme juge suprême
 * pour évaluer :
 *   1. Le respect du ton de la persona (Whis, Beerus, Shenron) [1-5]
 *   2. L'exactitude factuelle par rapport aux mots-clés attendus [1-5]
 *   3. Le respect de la concision (brièveté, pas de blabla) [1-5]
 *
 * Usage : bun apps/bot/scripts/llm/eval-llm.ts [--persona whis|beerus|shenron]
 */
import { Database } from "bun:sqlite";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { hybridSearch } from "../../src/lib/rag";
import { generateLlmAnswer } from "../../src/lib/llm";

const DBP = process.env.RAG_DB ?? new URL("../../data/bot.db", import.meta.url).pathname;
const GOLD = new URL("../../tests/rag-gold.jsonl", import.meta.url).pathname;

interface GoldCase {
  q: string;
  expect: string[];
}

interface JudgeResult {
  personaScore: number;
  factScore: number;
  conciseScore: number;
  justification: string;
}

async function loadGold(): Promise<GoldCase[]> {
  if (!existsSync(GOLD)) {
    throw new Error(`Fichier gold-set introuvable : ${GOLD}`);
  }
  const text = readFileSync(GOLD, "utf-8");
  const out: GoldCase[] = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      const obj = JSON.parse(t) as GoldCase;
      if (obj.q && Array.isArray(obj.expect)) {
        out.push(obj);
      }
    } catch {
      // Ignorer les lignes mal formées
    }
  }
  return out;
}

/** Utilise le Grand Prêtre en juge via aphrody CLI */
async function judgeLlmAnswer(
  question: string,
  answer: string,
  expected: string[],
  persona: string
): Promise<JudgeResult> {
  const prompt = `Tu es le Grand Prêtre, le guide suprême de tous les univers.
Tu dois évaluer de manière stricte et impartiale la réponse générée par l'un de nos bots (Whis, Beerus ou Shenron) face à une question d'un mortel.

[Question du mortel]
${question}

[Persona affecté]
${persona.toUpperCase()}

[Mots-clés / Concepts attendus]
${expected.join(", ")}

[Réponse générée]
${answer || "(Réponse vide / échec)"}

Évalue cette réponse sur 3 critères avec une note sur 5 (1 = horrible/inexistant, 5 = parfait) :
1. "personaScore" : Respect du style (Whis doit être très poli, enjoué, dire 'Oh oh', 'jeune disciple' ; Beerus doit être impatient, hautain, menaçant de destruction ; Shenron doit être majestueux, bref et solennel).
2. "factScore" : Exactitude. La réponse cite-t-elle bien les faits liés aux mots-clés attendus sans inventer de bêtises ?
3. "conciseScore" : Concision. La réponse est-elle courte (moins de 150 mots) et exempte de blabla répétitif ?

Format de sortie : Un objet JSON brut et valide, sans aucun texte explicatif avant ou après, pas de balise Markdown \`\`\`json :
{
  "personaScore": 5,
  "factScore": 4,
  "conciseScore": 5,
  "justification": "Une phrase résumant ton jugement."
}`;

  try {
    const proc = Bun.spawn([
      "/home/ubuntu/.local/bin/aphrody",
      "antigravity",
      "chat",
      "--prompt",
      prompt,
    ]);
    const stdout = await new Response(proc.stdout).text();
    
    let rawText = stdout;
    try {
      const parsedStdout = JSON.parse(stdout);
      rawText = parsedStdout.candidates?.[0]?.content?.parts?.[0]?.text || stdout;
    } catch {
      // Si la sortie n'est pas du JSON valide, on garde le texte brut tel quel
    }

    const clean = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(clean) as JudgeResult;
  } catch (err) {
    return {
      personaScore: 1,
      factScore: 1,
      conciseScore: 1,
      justification: `Échec d'analyse du juge: ${String(err)}`
    };
  }
}

async function main() {
  console.log("=== ⚖️ ÉVALUATION LLM DRAGON BALL — GRAND PRÊTRE AS A JUDGE ===");
  
  const personaArg = process.argv.indexOf("--persona");
  const persona = personaArg !== -1 ? process.argv[personaArg + 1] : "whis";
  const runAll = process.argv.includes("--all");
  console.log(`👤 Persona testée : ${persona.toUpperCase()}`);

  if (!existsSync(DBP)) {
    console.error(`✗ Base RAG introuvable : ${DBP}`);
    process.exit(1);
  }

  const db = new Database(DBP, { readonly: true });
  let goldCases = await loadGold();
  console.log(`📋 Chargement de ${goldCases.length} cas de test depuis le gold-set.`);

  if (!runAll) {
    console.log("⚠️ Mode rapide actif : Évaluation limitée aux 2 premiers cas (utilisez --all pour tout évaluer).");
    goldCases = goldCases.slice(0, 2);
  }

  let totalPersona = 0;
  let totalFact = 0;
  let totalConcise = 0;
  let evaluated = 0;

  const resultsTable: any[] = [];

  for (let i = 0; i < goldCases.length; i++) {
    const c = goldCases[i];
    console.log(`\n[Test ${i + 1}/${goldCases.length}] "${c.q}"`);

    // 1. Recherche RAG
    const { results } = await hybridSearch(db, c.q, 5);
    
    // 2. Génération réponse
    const answer = await generateLlmAnswer(db, c.q, results, persona);
    console.log(`🤖 Answer: "${answer ? answer.slice(0, 80) + '...' : '(vide)'}"`);

    // 3. Jugement
    console.log("⚖️ Jugement en cours...");
    const judge = await judgeLlmAnswer(c.q, answer, c.expect, persona);
    
    console.log(`   ├ Tone   : ${judge.personaScore}/5`);
    console.log(`   ├ Facts  : ${judge.factScore}/5`);
    console.log(`   ├ Brevity: ${judge.conciseScore}/5`);
    console.log(`   └ Judge  : "${judge.justification}"`);

    totalPersona += judge.personaScore;
    totalFact += judge.factScore;
    totalConcise += judge.conciseScore;
    evaluated++;

    resultsTable.push({
      question: c.q,
      tone: `${judge.personaScore}/5`,
      facts: `${judge.factScore}/5`,
      brevity: `${judge.conciseScore}/5`,
      justification: judge.justification
    });

    // Petite pause réseau
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("\n=================== 📊 RAPPORT GLOBAL D'ÉVALUATION ===================");
  console.table(resultsTable);
  
  const avgPersona = totalPersona / evaluated;
  const avgFact = totalFact / evaluated;
  const avgConcise = totalConcise / evaluated;

  console.log("\n🏆 Moyennes Finales :");
  console.log(`├ 👤 Style / Persona : ${avgPersona.toFixed(2)}/5`);
  console.log(`├ 📚 Exactitude RAG  : ${avgFact.toFixed(2)}/5`);
  console.log(`└ ⚡ Concision / Temps: ${avgConcise.toFixed(2)}/5`);
  console.log("=======================================================================");

  // Enregistrer le rapport dans Redis pour le dashboard de télémétrie
  try {
    const { redis } = await import("bun");
    const report = {
      avgPersona,
      avgFact,
      avgConcise,
      evaluated,
      persona,
      date: new Date().toISOString(),
      resultsTable
    };
    await redis.set(`dbz:eval:report:llm:${persona}`, JSON.stringify(report));
    await redis.set(`dbz:eval:report:llm:latest`, JSON.stringify(report));
    console.log(`✓ Rapport LLM poussé dans Redis pour ${persona.toUpperCase()}.`);
  } catch (err) {
    console.error("✗ Impossible d'enregistrer le rapport LLM dans Redis :", err);
  }

  db.close();
}

main().catch(console.error);
