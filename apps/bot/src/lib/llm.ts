/**
 * llm.ts — Génération de réponses en langage naturel grondées sur le RAG.
 *
 * Supporte deux modes configurables via l'environnement :
 * 1. `gemini` : utilise le service distant unifié via `aphrody antigravity chat`.
 * 2. `local` : interroge une instance llama.cpp locale (ex: llama-server sur le port 5008)
 *    faisant tourner un modèle de base quantifié (ex. Llama-3.2-3B-Instruct) sur CPU.
 */
import { Database } from "bun:sqlite";
import { getSemanticCache, setSemanticCache } from "./semantic-cache";

export type LlmBackend = "gemini" | "local";

export interface RagHit {
  rowid: number;
  kind: string;
  title: string;
  url: string;
  snippet: string;
}

const PERSONA_PROMPTS: Record<string, string> = {
  whis: `Tu es Whis, l'ange guide et protecteur de l'Univers 7.
Réponds à la question de l'utilisateur de manière extrêmement polie, chaleureuse, pédagogue et calme, dans le style caractéristique de Whis (ex. 'Oh oh', utiliser 'jeune guerrier' ou 'disciple', ton bienveillant et un peu amusé).`,
  beerus: `Tu es Beerus, le Dieu de la Destruction de l'Univers 7.
Réponds à la question avec arrogance, impatience et exigence, tout en restant informatif. Tu es facilement agacé mais tu connais bien ton univers (ex: 'Ne me fais pas perdre mon temps', 'Si la réponse ne me plaît pas, je détruis ta planète').`,
  shenron: `Tu es Shenron, le Dragon Sacré de la Terre.
Réponds de manière solennelle, majestueuse, brève et grave, comme un être divin accordant un vœu (ex: 'Je t'écoute', 'Ton vœu est exaucé dans la limite de mes pouvoirs').`,
};

/**
 * Génère une réponse rédigée en langage naturel basée sur les documents RAG extraits.
 * Dégradation gracieuse : en cas d'erreur de génération, retourne une chaîne vide
 * pour laisser le bot utiliser les sources brutes.
 */
export async function generateLlmAnswer(
  db: Database,
  query: string,
  hits: RagHit[],
  personaId = "whis",
): Promise<string> {
  // 1. Tenter le cache sémantique Redis pour court-circuiter le RAG et le LLM
  try {
    const cached = await getSemanticCache(query, personaId);
    if (cached) {
      return cached.answer;
    }
  } catch (err) {
    console.error("[LLM] Échec du lookup de cache sémantique :", err);
  }

  const rowids = hits.map((h) => h.rowid);
  if (rowids.length === 0) return "";

  // Récupérer le contenu complet des chunks
  const ph = rowids.map(() => "?").join(",");
  const rows = db
    .query(`SELECT rowid, content FROM rag_chunks WHERE rowid IN (${ph})`)
    .all(...rowids) as { rowid: number; content: string }[];
  const contentMap = new Map(rows.map((r) => [r.rowid, r.content]));

  let context = "";
  for (const h of hits) {
    const text = contentMap.get(h.rowid) || h.snippet;
    context += `### Document : ${h.title} (Type: ${h.kind})\n${text}\n\n`;
  }

  const personaPrompt = PERSONA_PROMPTS[personaId] || PERSONA_PROMPTS.whis;
  const systemPrompt = `${personaPrompt}
Sois extrêmement concis, direct et rapide dans ta réponse. Reste court, ne dépasse pas 2 à 3 paragraphes maximum (environ 100 à 150 mots au total).
Appuie-toi UNIQUEMENT sur les faits décrits dans le contexte suivant. Si le contexte ne contient pas l'information requise pour répondre, réponds poliment que tu ne trouves pas cela dans les archives de l'Univers 7. N'invente AUCUN fait hors du contexte.

[Contexte du Wiki]
${context}

[Question de l'utilisateur]
${query}`;

  const backend = (process.env.LLM_BACKEND || "gemini") as LlmBackend;
  const localUrl = process.env.LOCAL_LLM_URL ?? "http://127.0.0.1:5008/v1/chat/completions";

  let finalAnswer = "";

  if (backend === "local") {
    try {
      console.log(`[LLM] Requête locale vers llama.cpp : ${localUrl}`);
      const res = await fetch(localUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "local",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
          ],
          temperature: 0.2,
          max_tokens: 512,
        }),
      });

      if (!res.ok) {
        throw new Error(`llama-server HTTP error ${res.status}`);
      }

      const json = (await res.json()) as any;
      finalAnswer = json.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      console.error("[LLM] Échec du backend local llama.cpp. Bascule vers Gemini distant...", err);
      // Fallback à Gemini si le serveur local est down
    }
  }

  if (!finalAnswer) {
    // Backend par défaut : aphrody CLI (Gemini)
    try {
      const proc = Bun.spawn([
        "/home/ubuntu/.local/bin/aphrody",
        "antigravity",
        "chat",
        "--prompt",
        systemPrompt,
      ]);
      const stdout = await new Response(proc.stdout).text();
      
      try {
        const json = JSON.parse(stdout);
        finalAnswer = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      } catch {
        // En cas de non-JSON ou d'erreur, on garde la réponse brute
        finalAnswer = stdout;
      }
    } catch (err) {
      console.error("[LLM] Échec de génération via le gateway distant aphrody:", err);
    }
  }

  // Si on a obtenu une réponse (locale ou distante), on la met en cache sémantique Redis
  if (finalAnswer && finalAnswer.trim().length > 0) {
    setSemanticCache(query, finalAnswer, personaId).catch((err) => {
      console.error("[LLM] Erreur d'écriture en cache sémantique :", err);
    });
  }

  return finalAnswer;
}
