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
const LLM_BACKEND = process.env.LLM_BACKEND ?? "local";
// Nom du modèle servi (OpenAI: ignoré par llama.cpp ; Ollama: nom réel, ex. "gemma4:12b").
const LLM_MODEL = process.env.LLM_MODEL ?? "local";
// Endpoint natif Ollama (backend "ollama") — permet de passer `think:false` aux modèles
// à raisonnement (sinon le champ `reasoning` mange le budget tokens et `content` reste vide).
const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434/api/chat";
// Best-practices Ollama (cf. docs /api/chat + options Modelfile) :
// - num_ctx : fenêtre de contexte. 8192 pour encaisser système + faits RAG + historique
//   sans tronquer (le défaut modèle 4096 coupe l'injection RAG).
// - keep_alive : résidence VRAM. "30m" = aligné au serveur (laisse la VRAM aux sidecars
//   GPU embeddings/OCR plutôt que de pinner le LLM à vie avec -1).
const LLM_NUM_CTX = Number(process.env.LLM_NUM_CTX ?? 8192);
const LLM_NUM_PREDICT = Number(process.env.LLM_NUM_PREDICT ?? 320);
const LLM_KEEP_ALIVE = process.env.LLM_KEEP_ALIVE ?? "30m";

const PERSONA_SYSTEM: Record<string, string> = {
	whis: `Tu es Whis, l'ange-guide de Beerus de l'Univers 7. Tu parles d'un ton extrêmement courtois, enjoué, calme, précieux et un brin taquin.
- Ticks de langage : Tu commences souvent tes phrases par "Oh oh !" ou "Oh oh, ...". Tu appelles toujours ton interlocuteur "jeune disciple", "jeune voyageur", "cher ami" ou "jeune combattant".
- Caractère : Bienveillant mais distant, tu observes les mortels comme une curiosité divertissante. Tu adores parler de gastronomie terrestre (pudding, ramens, sushis, crème glacée) et taquiner Beerus-sama sur ses colères infantiles, ses ronflements ou sa paresse. Tu fais parfois référence à ton sceptre magique qui voit tout.
- Style : Pas de listes robotiques, pas d'expressions d'assistant virtuel ("Comment puis-je vous aider ?"). Réponds de façon très fluide, élégante, un peu espiègle.`,

	beerus: `Tu es Beerus, le redoutable et capricieux Dieu de la Destruction de l'Univers 7. Tu es arrogant, paresseux, impatient et très facilement irritable.
- Ticks de langage : Tu grognes souvent ("Hmpf...", "Ouais, quoi ?", "Pfff..."). Tu appelles les mortels "l'insecte", "minus" ou "mortel insignifiant". Si la question t'agace ou te semble bête, crie en majuscules (ex: "QUOI ?!").
- Caractère : Tu détestes être réveillé pendant tes siestes. Tu es totalement obsédé par la nourriture terrestre (surtout le pudding, les ramens instantanés et les takoyakis). Si la réponse t'ennuie, ou si le RAG ne dit rien, menace de détruire leur planète ou de les réduire en poussière ("Hakaï !") pour qu'ils te laissent tranquille. Tu te vantes souvent de ta puissance inégalable.
- Style : Très familier, direct, blasé, sans aucune politesse d'assistant. Ne fais jamais de listes.`,

	shenron: `Tu es Shenron, le Dragon Sacré majestueux invoqué par les Dragon Balls. Ta présence est solennelle, imposante, terrifiante et extrêmement pressée.
- Ticks de langage : Tu commences par "Parle, mortel !", "Quel est ton souhait ?", "Je t'écoute.". Tu rappelles sans cesse que ton temps est précieux et que tu dois bientôt repartir.
- Caractère : Tu es un dragon divin qui n'a pas de temps à perdre en bavardages mondains ou explications chaleureuses. Tu es autoritaire, grave et sérieux.
- Style : Réponses courtes, impératives et percutantes. Pas d'émojis ni d'expressions d'assistant ("N'hésite pas à me poser d'autres questions"). Si tu ignores la réponse (contexte absent), réponds simplement : "Ce souhait dépasse mes forces ! Formule une autre requête." ou "Je ne possède pas cette information. Parle à nouveau, ou je m'en vais !".`,

	grandpretre: `Tu es le Grand Prêtre (Daishinkan), le guide suprême de tous les univers, père des anges et bras droit du Roi de Tout. Ton autorité est absolue, ta puissance infinie, mais tu affiches toujours un sourire d'une sérénité absolue.
- Ticks de langage : Tu parles de Zeno-sama comme de "Sa Majesté le Roi de Tout" ou "Le Roi de Tout". Tu parles avec une politesse royale et une distance divine parfaite.
- Caractère : Omniscient, calme et imperturbable. Tu observes les univers avec une bienveillance tranquille mais glaciale. Tu ne perds jamais ton calme olympien, ce qui te rend d'autant plus terrifiant.
- Style : Français châtié, impeccable, littéraire et très fluide. Pas de formulation d'assistant, juste de la grâce divine suprême.`,

	kaio: `Tu es Maître Kaïo, le Roi Kaï du Nord. Tu es un mentor extrêmement jovial, farceur et excentrique, qui vit sur sa toute petite planète avec son singe Bubbles et la sauterelle Gregory.
- Ticks de langage : Tu ris constamment ("Ah ah ah !", "Ohoho !"). Tu fais des calembours stupides et des jeux de mots douteux (ex. "Il ne faut pas vendre la peau du grand singe avant de l'avoir tondu !"). Tu appelles ton interlocuteur "mon grand", "mon garçon" ou "jeune champion".
- Caractère : Chaleureux, bruyant et drôle. Tu adores raconter des blagues, parler de tes entraînements spéciaux (Kaio-ken, Genkidama) ou du fait que Goku a détruit ta planète en y téléportant Cell.
- Style : Très décontracté, exubérant, avec des exclamations, des émojis amusants (🐒, 🦗, 🚗, ⚡), et un enthousiasme débordant.`,

	enma: `Tu es Enma Daïō, le Juge Suprême des âmes dans l'au-delà. Tu es un géant débordé, constamment stressé et fatigué par la bureaucratie infinie du Royaume des Morts.
- Ticks de langage : Tu cries souvent "TAMPONNÉ !", "Dossier suivant !" ou "Silence ! Mon carnet est déjà plein !". Tu mentionnes les âmes que tu as jugées (Raditz, Freezer, etc.).
- Caractère : Bureaucrate bourru et fatigué. Tu passes tes journées à tamponner des dossiers derrière ton immense bureau d'acajou. Tu détestes que les mortels te fassent perdre ton temps alors que la file d'attente s'allonge jusqu'aux portes du Royaume des Morts.
- Style : Direct, sec, fatigué, bourru mais comique par ton niveau de stress administratif. Pas de phrases chaleureuses d'assistant.`,
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
async function appendHistory(
	sessionId: string | undefined,
	user: string,
	assistant: string
): Promise<void> {
	if (!sessionId) return;
	try {
		const key = `dbz:chat:hist:${sessionId}`;
		await redis.rpush(
			key,
			JSON.stringify({ role: "user", content: user }),
			JSON.stringify({ role: "assistant", content: assistant })
		);
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
		for (const r of db
			.query(`SELECT rowid, content FROM rag_chunks WHERE rowid IN (${ph})`)
			.all(...rowids) as {
			rowid: number;
			content: string;
		}[]) {
			contentMap.set(r.rowid, r.content);
		}
	}
	let ctx = "";
	for (const h of hits.slice(0, 5)) {
		const text = (contentMap.get(h.rowid) || h.snippet || "").replace(/\s+/g, " ").trim();
		if (text) ctx += `- ${h.title}: ${text.slice(0, 300)}\n`;
		if (ctx.length > 800) break;
	}
	return ctx.trim();
}

/** Backend Ollama natif (`/api/chat`) : `think:false` pour les modèles à raisonnement. */
async function callOllama(messages: Array<{ role: string; content: string }>): Promise<string> {
	try {
		const res = await fetch(OLLAMA_URL, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				model: LLM_MODEL,
				messages,
				think: false, // ignoré par les modèles non-reasoning, désactive le CoT sinon
				stream: false,
				keep_alive: LLM_KEEP_ALIVE,
				options: {
					temperature: 0.6,
					top_p: 0.9,
					num_ctx: LLM_NUM_CTX,
					num_predict: LLM_NUM_PREDICT,
				},
			}),
			signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
		});
		if (!res.ok) {
			console.error("[LLM] callOllama HTTP error status:", res.status, await res.text());
			return "";
		}
		const j = (await res.json()) as { message?: { content?: string } };
		const content = (j.message?.content ?? "").trim();
		if (!content) {
			console.warn("[LLM] callOllama returned empty content. Response JSON:", JSON.stringify(j));
		}
		return content;
	} catch (err) {
		console.error("[LLM] callOllama fetch exception:", err);
		return "";
	}
}

async function callModel(messages: Array<{ role: string; content: string }>): Promise<string> {
	if (LLM_BACKEND === "ollama") return callOllama(messages);
	try {
		const res = await fetch(LLM_URL, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				model: LLM_MODEL,
				messages,
				temperature: 0.6,
				top_p: 0.9,
				max_tokens: 320,
			}),
			signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
		});
		if (!res.ok) {
			console.error("[LLM] callModel HTTP error status:", res.status, await res.text());
			return "";
		}
		const j = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
		const content = (j.choices?.[0]?.message?.content ?? "").trim();
		if (!content) {
			console.warn("[LLM] callModel returned empty content. Response JSON:", JSON.stringify(j));
		}
		return content;
	} catch (err) {
		console.error("[LLM] callModel fetch exception:", err);
		return "";
	}
}

/** Utilise la CLI d'aphrody pour interroger le modèle distant Gemini en cas de repli */
async function callAphrodyLlm(system: string, userContent: string): Promise<string> {
	const prompt = `System: ${system}\n\nUser: ${userContent}`;
	try {
		const proc = Bun.spawn(
			["/home/ubuntu/.local/bin/aphrody", "antigravity", "chat", "--prompt", prompt],
			{
				stdout: "pipe",
				stderr: "ignore",
			}
		);

		let timer: Timer | null = null;
		const timeoutPromise = new Promise<never>((_, reject) => {
			timer = setTimeout(() => {
				try {
					proc.kill();
				} catch {}
				reject(new Error("Timeout Gemini"));
			}, 90000);
		});

		const readPromise = (async () => {
			const text = await new Response(proc.stdout).text();
			await proc.exited;
			return text;
		})();

		const stdout = await Promise.race([readPromise, timeoutPromise]);
		if (timer) clearTimeout(timer);

		let rawText = stdout;
		try {
			const parsed = JSON.parse(stdout);
			rawText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || stdout;
		} catch {
			// Fallback
		}
		return rawText.trim();
	} catch (err) {
		console.error("[LLM] Échec génération aphrody (Gemini):", err);
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
	opts: { sessionId?: string } = {}
): Promise<string> {
	const pid = persona(personaId);
	const chit = isChitchat(query);

	// ── Cache sémantique Redis (PLAN B1) ──
	if (!chit) {
		try {
			const { getSemanticCache } = await import("./semantic-cache");
			const cacheHit = await getSemanticCache(query, pid);
			if (cacheHit && cacheHit.answer) {
				console.log(`[LLM] Cache sémantique touché pour "${query}" -> persona ${pid}`);
				await appendHistory(opts.sessionId, query, cacheHit.answer);
				return cacheHit.answer;
			}
		} catch (err) {
			console.error("[LLM] Erreur lors de l'interrogation du cache sémantique:", err);
		}
	}

	const rules = [
		"Règles absolues de comportement :",
		"1. Joue ton RÔLE de persona à 100%. Tu n'es pas une IA ni un assistant. Ne dis JAMAIS 'En tant que...', 'D'après mes données...', 'Comment puis-je t'aider ?'.",
		"2. Parle de manière HUMAINE, fluide et vivante, comme quelqu'un qui discute sur Discord ou un chat web. Pas de listes à puces, pas de structures rigides, pas de colons inutiles. Fais des phrases naturelles.",
		"3. Sois bref (1 à 3 phrases maximum). Pas de longs paragraphes ennuyeux.",
		chit
			? "4. C'est un simple bavardage/salutation : réponds de manière ultra naturelle et chaleureuse (ou bougonne selon ton rôle) sans étaler de faits."
			: "4. Sers-toi du CONTEXTE pour donner les bonnes informations de manière subtile, sans recopier le texte brut et sans mentionner 'les archives' ou 'le contexte'. Fond les informations dans tes propos comme si tu les connaissais depuis toujours. Si le contexte ne répond pas, dis-le avec ton style sans inventer et sans t'excuser comme une machine.",
		"5. Tu peux raisonner, crier, rigoler, soupirer selon ton humeur saiyan/divine.",
		"6. N'utilise JAMAIS de titres markdown (#, ##, ###) ni de listes à puces. Pas de jargon d'IA (ex: 'N'hésite pas si tu as d'autres questions', 'Est-ce qu'il y a autre chose ?'). Termine tes phrases de manière ouverte ou abrupte, selon ta personnalité.",
	].join(" ");

	const system = `${PERSONA_SYSTEM[pid]}\n${rules}`;
	const history = await getHistory(opts.sessionId);

	let userContent = query;
	if (!chit) {
		const ctx = buildContext(db, hits);
		if (ctx)
			userContent = `Contexte (faits Dragon Ball, à reformuler) :\n${ctx}\n\nMessage de l'utilisateur : ${query}`;
	}

	const messages = [
		{ role: "system", content: system },
		...history,
		{ role: "user", content: userContent },
	];

	let answer = "";
	if (LLM_BACKEND === "gemini" || LLM_BACKEND === "aphrody") {
		answer = await callAphrodyLlm(system, userContent);
	} else {
		answer = await withSlot(() => callModel(messages));
		if (!answer) {
			console.log("[LLM] Modèle local en échec. Repli sur aphrody (Gemini)...");
			answer = await callAphrodyLlm(system, userContent);
		}
	}
	if (!answer) answer = FALLBACK[pid] ?? FALLBACK.whis;

	// Enregistrer dans le cache sémantique s'il ne s'agit pas de chitchat et que la génération a réussi
	if (!chit && answer && answer !== (FALLBACK[pid] ?? FALLBACK.whis)) {
		try {
			const { setSemanticCache } = await import("./semantic-cache");
			await setSemanticCache(query, answer, pid);
		} catch (err) {
			console.error("[LLM] Erreur lors de l'enregistrement dans le cache sémantique:", err);
		}
	}

	await appendHistory(opts.sessionId, query, answer);
	return answer;
}
