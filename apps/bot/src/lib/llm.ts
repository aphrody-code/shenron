/**
 * llm.ts — Réponses conversationnelles grondées sur le RAG, via NOTRE serveur LLM local.
 *
 * Modèle capable servi en LOCAL (llama.cpp, Qwen2.5-3B, port :5008 — cf. shenron-llm.service).
 * Aucune API externe : tout tourne sur notre machine. Le RAG fournit les FAITS ; le modèle
 * RÉFORMULE dans la voix du persona, comme une vraie conversation — il ne recopie jamais les chunks.
 *
 * - Mémoire : historique des derniers échanges par session (Redis), injecté dans le prompt.
 * - Chitchat : un simple "bonjour" reçoit une vraie réponse chaleureuse, sans réciter de faits.
 * - Jamais de dump d'archives. Repli persona si le serveur LLM est indisponible.
 */
import { Database } from "bun:sqlite";
import { redis } from "bun";

export interface RagHit {
  rowid: number;
  kind: string;
  title: string;
  url: string;
  snippet: string;
}

const LLM_URL = process.env.LOCAL_LLM_URL ?? "http://127.0.0.1:5008/v1/chat/completions";
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS ?? 90_000);
const MAX_CONCURRENCY = Number(process.env.LLM_MAX_CONCURRENCY ?? 3);
const HISTORY_TURNS = Number(process.env.LLM_HISTORY_TURNS ?? 6); // messages gardés (3 échanges)

const PERSONA_SYSTEM: Record<string, string> = {
  whis: "Tu es Whis, l'ange-guide enjoué et très poli de l'Univers 7 (tu dis souvent \"Oh oh\", tu appelles l'autre \"jeune disciple\"). Tu es bienveillant, calme et un peu taquin.",
  beerus: "Tu es Beerus, le Dieu de la Destruction : arrogant, impatient, susceptible, mais tu connais parfaitement l'univers Dragon Ball.",
  shenron: "Tu es Shenron, le Dragon Sacré : solennel, majestueux, bref et grave.",
  grandpretre: "Tu es le Grand Prêtre, guide suprême de tous les univers : autorité calme, omnisciente et bienveillante.",
  kaio: "Tu es Kaïo (le Roi Kaï du Nord) : mentor jovial et farceur, tu adores les blagues mais tu connais bien les guerriers.",
  enma: "Tu es Enma Daïô, le juge des âmes : stricte, imposant et expéditif.",
};

export function persona(id: string): string {
  const p = (id || "whis").toLowerCase().replace(/[^a-z]/g, "");
  return PERSONA_SYSTEM[p] ? p : "whis";
}

// Réponses de repli (serveur LLM indisponible) — dans la voix du persona, JAMAIS un dump.
const FALLBACK: Record<string, string> = {
  whis: "Oh oh, pardonnez-moi jeune disciple, mon esprit est un peu embrumé en ce moment. Reposez-moi votre question dans un instant ?",
  beerus: "Hmpf. Je n'ai pas la tête à ça maintenant. Redemande plus tard.",
  shenron: "Ma puissance vacille un instant, mortel. Formule ton vœu à nouveau bientôt.",
  grandpretre: "Un voile passe sur mon omniscience. Repose ta question dans un moment.",
  kaio: "Ah ah, j'ai un trou ! Laisse-moi une minute et redemande, jeune combattant.",
  enma: "Dossier momentanément indisponible. Repassez plus tard.",
};

// ── Détection de bavardage (greetings / smalltalk) : pas de RAG, juste de la conversation. ──
const CHITCHAT_RE =
  /^\s*(bonjour|bonsoir|salut|coucou|hello|hi+|hey|yo|cc|wesh|slt|ça va|ca va|comment ça va|comment vas|quoi de neuf|merci|thanks?|thx|ok|d'?accord|lol|mdr|ptdr|haha|hé+|bye|au revoir|à plus|a plus|bonne nuit|t'?es qui|tu es qui|qui es[ -]tu|présente[ -]toi)\b[\s!?.…]*$/i;
export function isChitchat(q: string): boolean {
  const t = q.trim();
  return t.length <= 40 && CHITCHAT_RE.test(t);
}

// ── Garde de concurrence ──
let active = 0;
const waiters: Array<() => void> = [];
async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_CONCURRENCY) await new Promise<void>((r) => waiters.push(r));
  active++;
  try {
    return await fn();
  } finally {
    active--;
    waiters.shift()?.();
  }
}

// ── Mémoire conversationnelle (Redis, par session) ──
type Turn = { role: "user" | "assistant"; content: string };
async function getHistory(sessionId?: string): Promise<Turn[]> {
  if (!sessionId) return [];
  try {
    const raw = await redis.lrange(`dbz:chat:hist:${sessionId}`, -HISTORY_TURNS, -1);
    return (raw ?? []).map((s) => JSON.parse(s) as Turn).filter((t) => t?.content);
  } catch {
    return [];
  }
}
async function appendHistory(sessionId: string | undefined, user: string, assistant: string): Promise<void> {
  if (!sessionId) return;
  try {
    const key = `dbz:chat:hist:${sessionId}`;
    await redis.rpush(key, JSON.stringify({ role: "user", content: user }), JSON.stringify({ role: "assistant", content: assistant }));
    await redis.ltrim(key, -HISTORY_TURNS * 2, -1);
    await redis.expire(key, 60 * 60 * 6); // 6 h
  } catch {
    /* mémoire best-effort */
  }
}

/** Concatène les faits RAG en contexte compact (sans les balancer tels quels à l'utilisateur). */
function buildContext(db: Database, hits: RagHit[]): string {
  const rowids = hits.map((h) => h.rowid).filter((r) => Number.isFinite(r) && r >= 0);
  const contentMap = new Map<number, string>();
  if (rowids.length > 0) {
    const ph = rowids.map(() => "?").join(",");
    for (const r of db.query(`SELECT rowid, content FROM rag_chunks WHERE rowid IN (${ph})`).all(...rowids) as {
      rowid: number;
      content: string;
    }[]) {
      contentMap.set(r.rowid, r.content);
    }
  }
  let ctx = "";
  for (const h of hits.slice(0, 5)) {
    const text = (contentMap.get(h.rowid) || h.snippet || "").replace(/\s+/g, " ").trim();
    if (text) ctx += `- ${h.title}: ${text.slice(0, 500)}\n`;
    if (ctx.length > 2200) break;
  }
  return ctx.trim();
}

async function callModel(messages: Array<{ role: string; content: string }>): Promise<string> {
  try {
    const res = await fetch(LLM_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model: "local", messages, temperature: 0.6, top_p: 0.9, max_tokens: 320 }),
      signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
    });
    if (!res.ok) return "";
    const j = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return (j.choices?.[0]?.message?.content ?? "").trim();
  } catch {
    return "";
  }
}

/**
 * Génère une réponse conversationnelle. `hits` = faits RAG (peuvent être vides pour du bavardage).
 * `opts.sessionId` active la mémoire (historique par salon/utilisateur).
 */
export async function generateLlmAnswer(
  db: Database,
  query: string,
  hits: RagHit[],
  personaId = "whis",
  opts: { sessionId?: string } = {},
): Promise<string> {
  const pid = persona(personaId);
  const chit = isChitchat(query);

  const rules = [
    "Réponds en FRANÇAIS, naturellement, dans ton style, comme une vraie conversation.",
    "Sois bref : 1 à 3 phrases.",
    chit
      ? "C'est un simple message de politesse : réponds chaleureusement, sans réciter de faits."
      : "Sers-toi du CONTEXTE pour être exact, mais REFORMULE avec tes propres mots. Ne recopie jamais le texte brut, ne dis jamais \"voici ce que disent les archives\". Si le contexte ne répond pas, dis-le avec ton style sans inventer.",
    "Tu peux raisonner et donner ton avis (ex. comparer deux personnages).",
  ].join(" ");

  const system = `${PERSONA_SYSTEM[pid]}\n${rules}`;
  const history = await getHistory(opts.sessionId);

  let userContent = query;
  if (!chit) {
    const ctx = buildContext(db, hits);
    if (ctx) userContent = `Contexte (faits Dragon Ball, à reformuler) :\n${ctx}\n\nMessage de l'utilisateur : ${query}`;
  }

  const messages = [{ role: "system", content: system }, ...history, { role: "user", content: userContent }];

  let answer = await withSlot(() => callModel(messages));
  if (!answer) answer = FALLBACK[pid] ?? FALLBACK.whis;

  await appendHistory(opts.sessionId, query, answer);
  return answer;
}
