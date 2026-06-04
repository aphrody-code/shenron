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

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;
  console.log(`[WORKER] Message reçu : type=${type}, items=${data?.length}`);

  try {
    const promises: Promise<any>[] = [];

    if (type === "INDEX_CHANNELS") {
      for (const ch of data) {
        const key = `dbz:channel:${ch.id}`;
        promises.push(redis.hset(key, "id", ch.id));
        promises.push(redis.hset(key, "name", ch.name));
        promises.push(redis.hset(key, "type", ch.type));
        promises.push(redis.hset(key, "parentId", ch.parentId ?? ""));
        promises.push(redis.sadd("dbz:channels", ch.id));
      }
    } else if (type === "INDEX_USERS") {
      for (const u of data) {
        const key = `dbz:user:${u.id}`;
        promises.push(redis.hset(key, "id", u.id));
        promises.push(redis.hset(key, "username", u.username));
        promises.push(redis.hset(key, "displayName", u.displayName));
        promises.push(redis.hset(key, "bot", u.bot ? "true" : "false"));
        promises.push(redis.hset(key, "joinedAt", u.joinedAt ?? ""));
        promises.push(redis.sadd("dbz:users", u.id));
      }
    } else if (type === "INDEX_MESSAGES") {
      for (const msg of data) {
        const key = `dbz:message:${msg.id}`;
        promises.push(redis.hset(key, "id", msg.id));
        promises.push(redis.hset(key, "content", msg.content));
        promises.push(redis.hset(key, "authorId", msg.authorId));
        promises.push(redis.hset(key, "channelId", msg.channelId));
        promises.push(redis.hset(key, "createdAt", msg.createdAt));
        
        promises.push(redis.rpush(`dbz:channel:${msg.channelId}:messages`, msg.id));
        promises.push(redis.ltrim(`dbz:channel:${msg.channelId}:messages`, -1000, -1));
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
