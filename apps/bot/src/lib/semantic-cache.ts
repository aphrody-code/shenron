/**
 * semantic-cache.ts — Cache sémantique intelligent basé sur Redis.
 *
 * Utilise les embeddings générés par le sidecar local pour comparer les nouvelles questions
 * aux questions déjà répondues. Si une similarité sémantique élevée (cosinus >= 0.92)
 * est trouvée, retourne la réponse du cache en moins de 5ms, économisant des appels API.
 */
import { redis } from "bun";
import { createHash } from "node:crypto";

const EMBED_URL = process.env.EMBED_URL ?? "http://127.0.0.1:5007";
const EMBED_TIMEOUT_MS = Number(process.env.EMBED_TIMEOUT_MS ?? 3000);
// Seuil élevé : à 0.90 des entités différentes se télescopaient (Krillin -> réponse Goku).
const CACHE_SIMILARITY_THRESHOLD = Number(process.env.SEMANTIC_CACHE_THRESHOLD ?? 0.97);
const MAX_CACHE_SIZE = 500; // LRU de 500 entrées par persona
const CACHE_TTL_SECONDS = 30 * 24 * 60; // 30 jours de rétention (Redis SET EX accepte les secondes)

function md5(text: string): string {
  return createHash("md5").update(text.toLowerCase().trim()).digest("hex");
}

function cosineSimilarity(a: Float32Array | number[], b: Float32Array | number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Embed la question via le sidecar d'embeddings local */
async function getQueryEmbedding(query: string): Promise<Float32Array | null> {
  try {
    const res = await fetch(`${EMBED_URL}/embed`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ texts: [query], kind: "query" }),
      signal: AbortSignal.timeout(EMBED_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { vectors: number[][] };
    const v = j.vectors?.[0];
    return v ? Float32Array.from(v) : null;
  } catch (err) {
    console.error("[SEMANTIC CACHE] Échec de l'embedding de la question :", err);
    return null;
  }
}

export interface SemanticCacheHit {
  answer: string;
  originalQuery: string;
  similarity: number;
}

/**
 * Tente de récupérer une réponse sémantiquement similaire du cache.
 */
export async function getSemanticCache(
  query: string,
  persona: string
): Promise<SemanticCacheHit | null> {
  const t0 = performance.now();
  
  // 1. Embed la requête
  const qv = await getQueryEmbedding(query);
  if (!qv) return null;

  const lruKey = `dbz:scache:${persona}:lru`;

  try {
    // 2. Récupérer les 200 hashes les plus récents de la LRU
    const hashes = await redis.zrange(lruKey, -200, -1);
    if (!hashes || hashes.length === 0) {
      await redis.hincrby("dbz:scache:stats", "misses", 1);
      return null;
    }

    // 3. Récupérer les vecteurs et les requêtes correspondants en parallèle
    const promises: Promise<string | null>[] = [];
    for (const hash of hashes) {
      promises.push(redis.get(`dbz:scache:${persona}:${hash}:vector`));
      promises.push(redis.get(`dbz:scache:${persona}:${hash}:query`));
    }
    const results = await Promise.all(promises);

    let bestSimilarity = -1;
    let bestHash: string | null = null;
    let bestQuery = "";

    // 4. Calculer la similarité cosinus locale
    for (let i = 0; i < hashes.length; i++) {
      const vectorStr = results[i * 2];
      const cachedQuery = results[i * 2 + 1];
      
      if (!vectorStr || !cachedQuery) continue;

      try {
        const cachedVector = JSON.parse(vectorStr) as number[];
        const sim = cosineSimilarity(qv, cachedVector);
        if (sim > bestSimilarity) {
          bestSimilarity = sim;
          bestHash = hashes[i];
          bestQuery = cachedQuery;
        }
      } catch (e) {
        // Ignorer les vecteurs corrompus
      }
    }

    // 5. Vérifier le seuil
    if (bestHash && bestSimilarity >= CACHE_SIMILARITY_THRESHOLD) {
      const answer = await redis.get(`dbz:scache:${persona}:${bestHash}:answer`);
      if (answer) {
        // Mettre à jour LRU et stats
        await Promise.all([
          redis.zadd(lruKey, Date.now(), bestHash),
          redis.hincrby("dbz:scache:stats", "hits", 1)
        ]);
        
        const latency = performance.now() - t0;
        console.log(
          `[SEMANTIC CACHE HIT] Persona=${persona}, Sim=${bestSimilarity.toFixed(4)}, Latency=${latency.toFixed(2)}ms`
        );
        
        return {
          answer,
          originalQuery: bestQuery,
          similarity: bestSimilarity,
        };
      }
    }

    // Cache miss
    await redis.hincrby("dbz:scache:stats", "misses", 1);
    return null;
  } catch (err) {
    console.error("[SEMANTIC CACHE] Erreur lors de la lecture du cache :", err);
    return null;
  }
}

/**
 * Enregistre une réponse dans le cache sémantique.
 */
export async function setSemanticCache(
  query: string,
  answer: string,
  persona: string
): Promise<void> {
  if (!answer || answer.trim().length === 0) return;

  try {
    // 1. Embed la requête
    const qv = await getQueryEmbedding(query);
    if (!qv) return;

    const hash = md5(query);
    const lruKey = `dbz:scache:${persona}:lru`;
    const now = Date.now();

    // 2. Écrire dans Redis en parallèle avec TTL
    await Promise.all([
      redis.set(`dbz:scache:${persona}:${hash}:query`, query, "EX", CACHE_TTL_SECONDS),
      redis.set(`dbz:scache:${persona}:${hash}:answer`, answer, "EX", CACHE_TTL_SECONDS),
      redis.set(
        `dbz:scache:${persona}:${hash}:vector`,
        JSON.stringify(Array.from(qv)),
        "EX",
        CACHE_TTL_SECONDS
      ),
      redis.zadd(lruKey, now, hash)
    ]);

    // 3. Purger les anciens éléments s'il y en a trop
    const totalCached = await redis.zcard(lruKey);
    if (totalCached > MAX_CACHE_SIZE) {
      // Récupérer les plus anciens à supprimer
      const toRemove = await redis.zrange(lruKey, 0, totalCached - MAX_CACHE_SIZE - 1);
      if (toRemove && toRemove.length > 0) {
        const cleanupPromises: Promise<any>[] = [];
        for (const h of toRemove) {
          cleanupPromises.push(redis.del(`dbz:scache:${persona}:${h}:query`));
          cleanupPromises.push(redis.del(`dbz:scache:${persona}:${h}:answer`));
          cleanupPromises.push(redis.del(`dbz:scache:${persona}:${h}:vector`));
          cleanupPromises.push(redis.zrem(lruKey, h));
        }
        await Promise.all(cleanupPromises);
        console.log(`[SEMANTIC CACHE PURGE] Supprimé ${toRemove.length} éléments obsolètes.`);
      }
    }
  } catch (err) {
    console.error("[SEMANTIC CACHE] Erreur lors de l'écriture dans le cache :", err);
  }
}
