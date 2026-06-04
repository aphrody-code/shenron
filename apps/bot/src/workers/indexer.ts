/**
 * indexer.ts — Worker Bun pour l'indexation Redis parallèle utilisant le client natif de Bun.
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
}

type WorkerMessage =
  | { type: "INDEX_CHANNELS"; data: IndexChannel[] }
  | { type: "INDEX_USERS"; data: IndexUser[] }
  | { type: "INDEX_MESSAGES"; data: IndexMessage[] };

// Déclarer l'écouteur d'événements du worker
declare var self: Worker;

const LORE_ENTITIES = [
  "goku", "vegeta", "freezer", "cell", "buu", "gohan", "trunks",
  "piccolo", "whis", "beerus", "bulma", "krillin", "broly", "bardock",
  "kamehameha", "fusion", "daima"
];

const POSITIVE_WORDS = ["cool", "génial", "super", "aimer", "adore", "bien", "fort", "incroyable", "magnifique", "hype"];
const NEGATIVE_WORDS = ["nul", "mauvais", "déteste", "triste", "colère", "mort", "faible", "moche", "horrible", "déçu"];

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;
  console.log(`[WORKER] Message reçu : type=${type}, items=${data?.length}`);

  try {
    const promises: Promise<any>[] = [];

    if (type === "INDEX_CHANNELS") {
      for (const ch of data) {
        const key = `dbz:channel:${ch.id}`;
        promises.push(redis.hset(key, {
          id: ch.id,
          name: ch.name,
          type: ch.type,
          parentId: ch.parentId ?? ""
        }));
        promises.push(redis.sadd("dbz:channels", ch.id));
      }
    } else if (type === "INDEX_USERS") {
      for (const u of data) {
        const key = `dbz:user:${u.id}`;
        promises.push(redis.hset(key, {
          id: u.id,
          username: u.username,
          displayName: u.displayName,
          bot: u.bot ? "true" : "false",
          joinedAt: u.joinedAt ?? ""
        }));
        promises.push(redis.sadd("dbz:users", u.id));
      }
    } else if (type === "INDEX_MESSAGES") {
      for (const msg of data) {
        const key = `dbz:message:${msg.id}`;
        promises.push(redis.hset(key, {
          id: msg.id,
          content: msg.content,
          authorId: msg.authorId,
          channelId: msg.channelId,
          createdAt: msg.createdAt
        }));
        
        promises.push(redis.rpush(`dbz:channel:${msg.channelId}:messages`, msg.id));
        promises.push(redis.ltrim(`dbz:channel:${msg.channelId}:messages`, -1000, -1));

        // Extraction de Lore DBZ et analyse analytique
        const contentLower = msg.content.toLowerCase();
        for (const entity of LORE_ENTITIES) {
          if (contentLower.includes(entity)) {
            promises.push(redis.hincrby(`dbz:user:${msg.authorId}:lore`, entity, 1));
            promises.push(redis.hincrby(`dbz:channel:${msg.channelId}:lore`, entity, 1));
            promises.push(redis.hincrby(`dbz:global:lore`, entity, 1));
          }
        }

        // Analyse de sentiment basique
        let pos = 0;
        let neg = 0;
        for (const w of POSITIVE_WORDS) {
          if (contentLower.includes(w)) pos++;
        }
        for (const w of NEGATIVE_WORDS) {
          if (contentLower.includes(w)) neg++;
        }

        if (pos > neg) {
          promises.push(redis.hincrby(`dbz:user:${msg.authorId}:sentiment`, "positive", 1));
          promises.push(redis.hincrby(`dbz:global:sentiment`, "positive", 1));
        } else if (neg > pos) {
          promises.push(redis.hincrby(`dbz:user:${msg.authorId}:sentiment`, "negative", 1));
          promises.push(redis.hincrby(`dbz:global:sentiment`, "negative", 1));
        } else {
          promises.push(redis.hincrby(`dbz:user:${msg.authorId}:sentiment`, "neutral", 1));
          promises.push(redis.hincrby(`dbz:global:sentiment`, "neutral", 1));
        }
      }
    }

    console.log(`[WORKER] Exécution de ${promises.length} écritures Redis en parallèle...`);
    await Promise.all(promises);
    console.log(`[WORKER] Écritures terminées pour le type ${type}.`);
    
    self.postMessage({ status: "success", type, count: data.length });
  } catch (err) {
    console.error(`[WORKER] Erreur fatale dans onmessage :`, err);
    self.postMessage({ status: "fatal", error: String(err), type });
  }
};
