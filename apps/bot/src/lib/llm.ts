/**
 * llm.ts — Génération de réponses en langage naturel grondées sur le RAG.
 *
 * Par défaut, le bot tourne sur NOTRE propre LLM Dragon Ball maison (entraîné from-scratch,
 * servi par `dbz_llm.py serve` sur :5009 — cf. apps/bot/data/llm/). Aucun modèle tiers en prod.
 *
 * Chaîne de génération résiliente — ne renvoie JAMAIS vide (c'était la cause des 12/20 réponses
 * vides de l'ancien gateway distant) :
 *   1. Cache sémantique Redis (court-circuit).
 *   2. Notre modèle maison (OWN_LLM_URL) — avec timeout.
 *   3. (optionnel, OFF par défaut) gateway distant aphrody/Gemini — seulement si
 *      LLM_ALLOW_REMOTE_FALLBACK=1, avec timeout + retry.
 *   4. Repli extractif ancré : compose une réponse à partir du meilleur chunk RAG dans la voix
 *      du persona. Toujours non vide, toujours grondé.
 *
 * Une garde de concurrence en-process empêche une rafale de requêtes d'écrouler le backend.
 */
import { Database } from "bun:sqlite";
import { getSemanticCache, setSemanticCache } from "./semantic-cache";

export type LlmBackend = "own" | "gemini" | "local";

export interface RagHit {
  rowid: number;
  kind: string;
  title: string;
  url: string;
  snippet: string;
}

const OWN_URL = process.env.OWN_LLM_URL ?? "http://127.0.0.1:5009/generate";
const OWN_TIMEOUT_MS = Number(process.env.OWN_LLM_TIMEOUT_MS ?? 60_000);
const ALLOW_REMOTE = process.env.LLM_ALLOW_REMOTE_FALLBACK === "1";
const GEMINI_BIN = process.env.APHRODY_BIN ?? "/home/ubuntu/.local/bin/aphrody";
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 25_000);
const MAX_CONCURRENCY = Number(process.env.LLM_MAX_CONCURRENCY ?? 2);

const PERSONA_PROMPTS: Record<string, string> = {
  whis: `Tu es Whis, l'ange guide et protecteur de l'Univers 7.
Réponds de manière extrêmement polie, chaleureuse, pédagogue et calme, dans le style de Whis (ex. 'Oh oh', 'jeune disciple', ton bienveillant et un peu amusé).`,
  beerus: `Tu es Beerus, le Dieu de la Destruction de l'Univers 7.
Réponds avec arrogance, impatience et exigence, tout en restant informatif (ex: 'Ne me fais pas perdre mon temps').`,
  shenron: `Tu es Shenron, le Dragon Sacré de la Terre.
Réponds de manière solennelle, majestueuse, brève et grave (ex: 'Je t'écoute', 'Ton vœu est exaucé').`,
  grandpretre: `Tu es le Grand Prêtre, guide suprême de tous les univers.
Réponds avec une autorité omnisciente, calme et absolue.`,
  kaio: `Tu es Kaïo (le Roi Kaï du Nord), mentor jovial et farceur.
Réponds avec humour et bienveillance, en glissant une blague, mais reste informatif.`,
  enma: `Tu es Enma Daïô, le juge des âmes.
Réponds de manière stricte, imposante et administrative, comme un juge expéditif.`,
};

// Préfaces persona pour le repli extractif (jamais vide).
const PERSONA_PREFACE: Record<string, string> = {
  whis: "Oh oh, jeune disciple, voici ce que disent les archives de l'Univers 7 :",
  beerus: "Hmpf. Mes archives disent ceci, alors écoute bien :",
  shenron: "Mortel, voici la vérité que renferment les archives :",
  grandpretre: "Du haut de l'omniscience, les archives révèlent :",
  kaio: "Hé hé ! D'après mes notes :",
  enma: "Suivant ! D'après mon registre :",
};
const PERSONA_NOTFOUND: Record<string, string> = {
  whis: "Oh oh, je suis navré, jeune disciple, mais les archives de l'Univers 7 restent silencieuses à ce sujet.",
  beerus: "Cette question est insignifiante : même mes archives n'en disent rien.",
  shenron: "Cette connaissance échappe à mes pouvoirs, mortel.",
  grandpretre: "Même l'omniscience ne trouve rien à ce sujet dans nos archives.",
  kaio: "Ah ! Là tu me poses une colle, mes notes sont muettes là-dessus.",
  enma: "Dossier introuvable. Au suivant !",
};

function persona(id: string): string {
  return (id || "whis").toLowerCase().replace(/[^a-z]/g, "");
}

// ---------------------------------------------------------------------------
// Garde de concurrence (sémaphore en-process)
// ---------------------------------------------------------------------------
let active = 0;
const waiters: Array<() => void> = [];
async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_CONCURRENCY) {
    await new Promise<void>((r) => waiters.push(r));
  }
  active++;
  try {
    return await fn();
  } finally {
    active--;
    const next = waiters.shift();
    if (next) next();
  }
}

// ---------------------------------------------------------------------------
// Backends
// ---------------------------------------------------------------------------
const WORD_RE = /[a-zàâäéèêëïîôûùüçñ]{4,}/g;
// Détecteur d'espagnol (le wiki mélange FR/ES ; on veut un bot 100% FR).
const ES_MARKERS = [
  " está", " según", " también", " después", " aunque", " siendo", " conocido", " película",
  " ciudad", " además", " pesar", " pero ", " es el ", " es la ", " como ", " que se ", " del ",
  " por ", " hacia ", " desde ", " hasta ", " mismo", " había", " fue ", " hijo ", " príncipe",
  " guerrero", " villano", " años ", " se une", " junto ", " antiguos", " uno de ", " su poder",
];
function looksSpanish(t: string): boolean {
  if (/[ñ¿¡]/.test(t)) return true;
  const low = " " + t.toLowerCase() + " ";
  // Signaux ES forts (jamais en français) : articles "los/las", terminaisons -ción / -mente.
  if (low.includes(" los ") || low.includes(" las ")) return true;
  if (/[a-z]ción\b/.test(low) || /[a-z]mente\b/.test(low)) return true;
  let n = 0;
  for (const m of ES_MARKERS) if (low.includes(m)) n++;
  return n >= 2;
}

/**
 * Garde-fou d'ancrage : un modèle maison de 29M peut halluciner des faits. On n'accepte sa réponse
 * que si elle est réellement ANCRÉE dans le contexte RAG (recouvrement lexical suffisant) et exempte
 * de fuite linguistique. Sinon -> chaîne de repli (extractif ancré). Garantit la justesse factuelle.
 */
function isGrounded(answer: string, context: string): boolean {
  if (looksSpanish(answer)) return false;
  const a = answer.toLowerCase();
  const ctx = context.toLowerCase();
  const words = a.match(WORD_RE) ?? [];
  if (words.length < 3) return false;
  const uniq = [...new Set(words)];
  let hits = 0;
  for (const w of uniq) if (ctx.includes(w)) hits++;
  // au moins 55% des mots de contenu de la réponse doivent provenir du contexte
  return hits / uniq.length >= 0.55;
}

/** Notre modèle maison (serveur dbz_llm.py sur :5009). Réponse acceptée seulement si ancrée. */
async function tryOwn(context: string, personaId: string, query: string): Promise<string> {
  try {
    const res = await fetch(OWN_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ context, persona: personaId, query, max_new_tokens: 160, temperature: 0.5 }),
      signal: AbortSignal.timeout(OWN_TIMEOUT_MS),
    });
    if (!res.ok) return "";
    const j = (await res.json()) as { answer?: string };
    const ans = (j.answer ?? "").trim();
    if (!ans) return "";
    // Rejette les hallucinations -> le repli extractif ancré prendra le relais.
    return isGrounded(ans, context) ? ans : "";
  } catch {
    return ""; // serveur down / timeout -> on bascule
  }
}

/** Gateway distant aphrody/Gemini — fallback OPTIONNEL (OFF par défaut), avec timeout + kill. */
async function tryGemini(systemPrompt: string): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const proc = Bun.spawn([GEMINI_BIN, "antigravity", "chat", "--prompt", systemPrompt], {
        stdout: "pipe",
        stderr: "ignore",
      });
      const killer = setTimeout(() => {
        try {
          proc.kill();
        } catch {
          /* déjà mort */
        }
      }, GEMINI_TIMEOUT_MS);
      let stdout = "";
      try {
        stdout = await new Response(proc.stdout).text();
      } finally {
        clearTimeout(killer);
      }
      await proc.exited.catch(() => {});
      const raw = stdout.trim();
      if (raw) {
        try {
          const json = JSON.parse(raw);
          const t = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (t) return String(t).trim();
        } catch {
          /* texte brut */
        }
        return raw;
      }
    } catch {
      /* retry */
    }
    if (attempt === 0) await Bun.sleep(500);
  }
  return "";
}

/** Nettoie un chunk RAG brut (URLs, footers "Source:", puces, listes de navigation). */
function cleanChunk(t: string): string {
  return t
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/Source\s*:\s*/gi, " ")
    .replace(/[•·▪►◦|]+/g, " ")
    .replace(/\([^)]*\d{2,}\)/g, " ") // résidus type "(340)" des listes
    .replace(/\s+/g, " ")
    .trim();
}

/** Démarre au début d'une vraie phrase (évite un fragment coupé en début de chunk). */
function startAtSentence(t: string): string {
  if (/^[A-ZÀ-Þ"«]/.test(t)) return t;
  const m = t.search(/[.!?]\s+[A-ZÀ-Þ]/);
  if (m >= 0 && m < t.length * 0.5) return t.slice(m + 1).trim();
  const cap = t.search(/[A-ZÀ-Þ]/);
  return cap > 0 && cap < 60 ? t.slice(cap) : t;
}

const STOPWORDS = new Set([
  "quel", "quelle", "quels", "quelles", "est", "que", "qui", "quoi", "dans", "pour", "avec", "une",
  "des", "les", "son", "sur", "the", "what", "who", "race", "tell", "about", "moi", "parle", "raconte",
]);

/** Sélectionne les phrases d'un texte les plus pertinentes pour la question (recouvrement de termes). */
function bestSentences(text: string, query: string, max = 2): string {
  const qterms = new Set((query.toLowerCase().match(WORD_RE) ?? []).filter((w) => !STOPWORDS.has(w)));
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && !looksSpanish(s)); // FR uniquement
  if (sentences.length === 0) return "";
  const scored = sentences.map((s, i) => {
    const terms = s.toLowerCase().match(WORD_RE) ?? [];
    let score = 0;
    for (const w of terms) if (qterms.has(w)) score++;
    return { s, i, score };
  });
  const hasMatch = scored.some((x) => x.score > 0);
  const chosen = hasMatch
    ? [...scored].sort((a, b) => b.score - a.score).slice(0, max).filter((x) => x.score > 0)
    : scored.slice(0, max); // aucune correspondance -> début du texte
  // restituer dans l'ordre du texte
  return chosen.sort((a, b) => a.i - b.i).map((x) => x.s).join(" ");
}

/** Repli extractif ancré : jamais vide, basé sur les phrases RAG pertinentes à la question. */
function extractiveAnswer(
  query: string,
  hits: RagHit[],
  contentMap: Map<number, string>,
  personaId: string,
): string {
  if (hits.length === 0) return PERSONA_NOTFOUND[personaId] ?? PERSONA_NOTFOUND.whis;
  let body = "";
  // Parcourt jusqu'à 4 hits pour trouver du contenu FR (les chunks ES sont sautés).
  for (const h of hits.slice(0, 4)) {
    const text = startAtSentence(cleanChunk(contentMap.get(h.rowid) || h.snippet || ""));
    if (text.length < 20) continue;
    const picked = bestSentences(text, query, 2); // "" si tout est espagnol
    if (!picked) continue;
    body += (body ? " " : "") + picked;
    if (body.length >= 300) break;
  }
  body = body.slice(0, 460).trim();
  const lastDot = Math.max(body.lastIndexOf(". "), body.lastIndexOf("! "), body.lastIndexOf("? "));
  if (lastDot > 100) body = body.slice(0, lastDot + 1);
  if (body.length < 20) return PERSONA_NOTFOUND[personaId] ?? PERSONA_NOTFOUND.whis;
  const pre = PERSONA_PREFACE[personaId] ?? PERSONA_PREFACE.whis;
  const src = hits[0]?.title ? ` (Archives : ${hits[0].title})` : "";
  return `${pre} ${body}${src}`;
}

/**
 * Génère une réponse grondée sur les documents RAG. Ne renvoie jamais vide.
 */
export async function generateLlmAnswer(
  db: Database,
  query: string,
  hits: RagHit[],
  personaId = "whis",
): Promise<string> {
  const pid = persona(personaId);

  // 1. Cache sémantique
  try {
    const cached = await getSemanticCache(query, pid);
    if (cached) return cached.answer;
  } catch (err) {
    console.error("[LLM] Échec lookup cache sémantique :", err);
  }

  // 2. Assembler le contexte RAG (contenu complet des chunks)
  const rowids = hits.map((h) => h.rowid).filter((r) => Number.isFinite(r));
  const contentMap = new Map<number, string>();
  if (rowids.length > 0) {
    const ph = rowids.map(() => "?").join(",");
    const rows = db
      .query(`SELECT rowid, content FROM rag_chunks WHERE rowid IN (${ph})`)
      .all(...rowids) as { rowid: number; content: string }[];
    for (const r of rows) contentMap.set(r.rowid, r.content);
  }

  let context = "";
  for (const h of hits) {
    const text = contentMap.get(h.rowid) || h.snippet;
    if (text) context += `### ${h.title} (${h.kind})\n${text}\n\n`;
  }

  const personaPrompt = PERSONA_PROMPTS[pid] || PERSONA_PROMPTS.whis;
  const systemPrompt = `${personaPrompt}
Sois concis (2-3 phrases, ~120 mots max). Appuie-toi UNIQUEMENT sur le contexte ci-dessous ; n'invente AUCUN fait.

[Contexte du Wiki]
${context}

[Question]
${query}`;

  // 3. Notre modèle maison (primaire)
  let answer = "";
  let fromModel = false;
  if (context.trim().length > 0) {
    answer = await withSlot(() => tryOwn(context, pid, query));
    if (answer) fromModel = true;
  }

  // 4. Fallback distant (opt-in seulement)
  if (!answer && ALLOW_REMOTE) {
    answer = await withSlot(() => tryGemini(systemPrompt));
    if (answer) fromModel = true;
  }

  // 5. Repli extractif ancré — garantit une réponse non vide
  if (!answer) {
    answer = extractiveAnswer(query, hits, contentMap, pid);
  }

  // 6. Cache seulement les réponses générées par un modèle (pas le repli extractif brut)
  if (fromModel && answer.trim().length > 0) {
    setSemanticCache(query, answer, pid).catch((err) =>
      console.error("[LLM] Erreur écriture cache :", err),
    );
  }

  return answer;
}
