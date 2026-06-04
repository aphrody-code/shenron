/**
 * indexer.ts — Worker Bun d'indexation Redis parallèle (client natif Bun `redis`).
 *
 * Écrit, hors de l'event-loop du bot :
 *   - salons (dbz:channel:*), utilisateurs (dbz:user:*), messages (dbz:message:*) ;
 *   - analytics de lore : compteurs de mentions de personnages (dbz:{user,channel,global}:lore) ;
 *   - sentiment par mots-clés (dbz:{user,global}:sentiment).
 *
 * Les utilisateurs sont aussi déduits des AUTEURS de messages -> peuple dbz:user:* même sans
 * l'intent privilégié GuildMembers. La détection de lore utilise des limites de mots (\b) pour
 * éviter les faux positifs ("cell" dans "excellent").
 */
import { redis } from "bun";

interface IndexChannel {
  id: string;
  name: string;
  type: string;
  parentId?: string | null;
}
interface IndexUser {
  id: string;
  username: string;
  displayName: string;
  bot: boolean;
  joinedAt?: string | null;
}
interface IndexMessage {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  createdAt: string;
  authorName?: string;
  authorDisplay?: string;
  authorBot?: boolean;
}

type WorkerMessage =
  | { type: "INDEX_CHANNELS"; data: IndexChannel[] }
  | { type: "INDEX_USERS"; data: IndexUser[] }
  | { type: "INDEX_MESSAGES"; data: IndexMessage[] };

declare var self: Worker;

const LORE_ENTITIES = [
  "goku", "vegeta", "freezer", "cell", "buu", "gohan", "trunks", "piccolo", "whis", "beerus",
  "bulma", "krillin", "broly", "bardock", "kamehameha", "fusion", "daima", "saiyan", "namek", "shenron",
];
// Limites de mots pour éviter les faux positifs ("cell" dans "excellent").
const LORE_RE: Array<[string, RegExp]> = LORE_ENTITIES.map((e) => [e, new RegExp(`\\b${e}\\b`, "i")]);

const POSITIVE_WORDS = ["cool", "génial", "super", "aimer", "adore", "bien", "fort", "incroyable", "magnifique", "hype", "stylé", "ouf"];
const NEGATIVE_WORDS = ["nul", "mauvais", "déteste", "triste", "colère", "faible", "moche", "horrible", "déçu", "naze"];
const POS_RE = POSITIVE_WORDS.map((w) => new RegExp(`\\b${w}`, "i"));
const NEG_RE = NEGATIVE_WORDS.map((w) => new RegExp(`\\b${w}`, "i"));

function upsertUser(promises: Promise<unknown>[], id: string, username: string, displayName: string, bot: boolean): void {
  promises.push(
    redis.hset(`dbz:user:${id}`, {
      id,
      username,
      displayName: displayName || username,
      bot: bot ? "true" : "false",
    }),
  );
  promises.push(redis.sadd("dbz:users", id));
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;
  console.log(`[WORKER] type=${type}, items=${data?.length}`);
  try {
    const promises: Promise<unknown>[] = [];

    if (type === "INDEX_CHANNELS") {
      for (const ch of data) {
        promises.push(redis.hset(`dbz:channel:${ch.id}`, { id: ch.id, name: ch.name, type: ch.type, parentId: ch.parentId ?? "" }));
        promises.push(redis.sadd("dbz:channels", ch.id));
      }
    } else if (type === "INDEX_USERS") {
      for (const u of data) {
        upsertUser(promises, u.id, u.username, u.displayName, u.bot);
        if (u.joinedAt) promises.push(redis.hset(`dbz:user:${u.id}`, { joinedAt: u.joinedAt }));
      }
    } else if (type === "INDEX_MESSAGES") {
      for (const msg of data) {
        promises.push(
          redis.hset(`dbz:message:${msg.id}`, {
            id: msg.id,
            content: msg.content,
            authorId: msg.authorId,
            channelId: msg.channelId,
            createdAt: msg.createdAt,
          }),
        );
        promises.push(redis.rpush(`dbz:channel:${msg.channelId}:messages`, msg.id));
        promises.push(redis.ltrim(`dbz:channel:${msg.channelId}:messages`, -1000, -1));

        // Indexer l'auteur (peuple dbz:user:* sans intent GuildMembers).
        if (msg.authorName) {
          upsertUser(promises, msg.authorId, msg.authorName, msg.authorDisplay || msg.authorName, !!msg.authorBot);
        }
        promises.push(redis.hincrby(`dbz:user:${msg.authorId}:stats`, "messages", 1));

        // Analytics de lore (limites de mots).
        const content = msg.content || "";
        for (const [entity, re] of LORE_RE) {
          if (re.test(content)) {
            promises.push(redis.hincrby(`dbz:user:${msg.authorId}:lore`, entity, 1));
            promises.push(redis.hincrby(`dbz:channel:${msg.channelId}:lore`, entity, 1));
            promises.push(redis.hincrby("dbz:global:lore", entity, 1));
          }
        }

        // Sentiment par mots-clés.
        let pos = 0;
        let neg = 0;
        for (const re of POS_RE) if (re.test(content)) pos++;
        for (const re of NEG_RE) if (re.test(content)) neg++;
        const bucket = pos > neg ? "positive" : neg > pos ? "negative" : "neutral";
        promises.push(redis.hincrby(`dbz:user:${msg.authorId}:sentiment`, bucket, 1));
        promises.push(redis.hincrby("dbz:global:sentiment", bucket, 1));
      }
    }

    await Promise.all(promises);
    self.postMessage({ status: "success", type, count: data.length });
  } catch (err) {
    console.error(`[WORKER] Erreur fatale :`, err);
    self.postMessage({ status: "fatal", error: String(err), type });
  }
};
