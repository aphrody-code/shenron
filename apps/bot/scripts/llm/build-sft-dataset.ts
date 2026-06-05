/**
 * build-sft-dataset.ts — Distille le corpus RAG en paires d'instruction SFT pour Dragon Ball.
 *
 * Lit les chunks de `rag_chunks` depuis `bot.db`, puis interroge l'API unifiée d'aphrody via la CLI
 * pour générer des exemples SFT structurés au format JSONL :
 * `{instruction, input, output, persona, lang, source_urls[], quality}`.
 *
 * Utilise une queue de traitement asynchrone avec concurrence contrôlée pour éviter de surcharger la CLI
 * et gère les reprises sur interruption (idempotent, saute les chunks déjà distillés).
 *
 * Usage : bun apps/bot/scripts/llm/build-sft-dataset.ts
 */
import { Database } from "bun:sqlite";
import { existsSync, mkdirSync, appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DBP = process.env.RAG_DB ?? new URL("../../data/bot.db", import.meta.url).pathname;
const OUT_DIR = new URL("../../data/llm/", import.meta.url).pathname;
const OUT_PATH = join(OUT_DIR, "dbz-sft.jsonl");
const STATE_PATH = join(OUT_DIR, "distill-state.json");

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

interface SftItem {
  instruction: string;
  input: string;
  output: string;
  persona: string;
  lang: string;
  source_urls: string[];
  quality: number;
}

// Charger l'état d'avancement pour reprendre
let processedChunks = new Set<number>();
if (existsSync(STATE_PATH)) {
  try {
    const data = JSON.parse(readFileSync(STATE_PATH, "utf-8"));
    processedChunks = new Set<number>(data.processed || []);
    console.log(`[DISTILL] Reprise active : ${processedChunks.size} chunks déjà distillés.`);
  } catch (e) {
    console.warn("[DISTILL] Impossible de charger distill-state.json, réinitialisation.");
  }
}

function saveState() {
  try {
    const data = { processed: Array.from(processedChunks) };
    Bun.write(STATE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[DISTILL] Erreur lors de la sauvegarde de l'état:", err);
  }
}

/** Utilise la CLI d'aphrody pour interroger le modèle distant */
async function callAphrodyGenerator(chunkTitle: string, chunkContent: string, url: string): Promise<SftItem[]> {
  const prompt = `Tu es un expert en curation de données d'entraînement pour modèles de langage.
À partir du document Dragon Ball ci-dessous, génère 3 exemples de questions/réponses de type SFT (Supervised Fine-Tuning).
Chaque exemple doit être rigoureusement vrai par rapport au texte fourni (pas d'hallucinations) et adopter le ton de l'une des personas suivantes : Whis (guide sage et poli), Beerus (dieu de la destruction exigeant et colérique) ou Shenron (dragon solennel et majestueux).

[Document source]
Titre : ${chunkTitle}
Contenu : ${chunkContent}

Format de sortie attendu : Un tableau JSON valide de 3 objets avec la structure suivante :
[
  {
    "instruction": "La question posée par l'utilisateur (ex: 'Qui a entraîné Son Goku après sa mort ?')",
    "input": "",
    "output": "La réponse formulée par la persona en respectant son style (ex de Whis: 'Oh oh, c'est le grand Maître Kaïo de l'Autre Monde qui a eu ce privilège, jeune guerrier.')",
    "persona": "whis | beerus | shenron",
    "lang": "fr",
    "source_urls": ["${url}"],
    "quality": 5
  }
]

Réponds UNIQUEMENT par le JSON brut, aucun autre texte, pas de balise Markdown \`\`\`json.`;

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
      // Garde le texte brut si le parsing échoue
    }

    // Parse et validation du JSON renvoyé
    const cleanOutput = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const items = JSON.parse(cleanOutput) as SftItem[];
    if (Array.isArray(items)) {
      return items;
    }
  } catch (err) {
    console.error(`[DISTILL] Échec génération pour "${chunkTitle}":`, err);
  }
  return [];
}

async function main() {
  console.log("=== DISTILLATION SFT CANON DRAGON BALL ===");
  if (!existsSync(DBP)) {
    console.error(`[DISTILL] Base de données SQLite RAG introuvable : ${DBP}`);
    process.exit(1);
  }

  const db = new Database(DBP);
  // Récupère tous les chunks de RAG avec leur rowid
  const chunks = db.query("SELECT rowid as id, kind, title, url, content FROM rag_chunks ORDER BY rowid").all() as {
    id: number;
    kind: string;
    title: string;
    url: string;
    content: string;
  }[];

  console.log(`[DISTILL] Total chunks trouvés : ${chunks.length}`);
  const todo = chunks.filter((c) => !processedChunks.has(c.id)).slice(0, 30);
  console.log(`[DISTILL] Chunks restant à traiter (limité à 30 pour ce run) : ${todo.length}`);

  if (todo.length === 0) {
    console.log("[DISTILL] Tous les chunks ont été traités !");
    db.close();
    return;
  }

  const concurrency = 1; // Traitement séquentiel pour respecter le rate-limit de l'API
  let successCount = 0;

  for (let i = 0; i < todo.length; i += concurrency) {
    const batch = todo.slice(i, i + concurrency);
    console.log(`\n→ Chunk ${i + 1}/${todo.length} ("${batch[0].title}")…`);

    const promises = batch.map(async (chunk) => {
      const items = await callAphrodyGenerator(chunk.title, chunk.content, chunk.url);
      if (items && items.length > 0) {
        for (const item of items) {
          // Validation de base des champs
          if (item.instruction && item.output && item.persona) {
            appendFileSync(OUT_PATH, JSON.stringify(item) + "\n");
            successCount++;
          }
        }
        processedChunks.add(chunk.id);
      }
    });

    await Promise.all(promises);
    saveState();
    
    // Pause de politesse pour respecter le quota
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n=== DISTILLATION COMPLETE ===`);
  console.log(`Exemples SFT enregistrés dans : ${OUT_PATH}`);
  console.log(`Nombre total d'exemples générés dans cette passe : ${successCount}`);
  db.close();
}

main().catch((err) => {
  console.error("[DISTILL] Erreur fatale dans la loop :", err);
  process.exit(1);
});
