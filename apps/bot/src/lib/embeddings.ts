/**
 * embeddings.ts — Embeddings denses multilingues 100 % locaux (transformers.js).
 *
 * Modèle : `Xenova/multilingual-e5-small` (384 dim, quantifié q8). Couvre FR +
 * noms JP du corpus Dragon Ball. Les vecteurs sont L2-normalisés → la similarité
 * cosinus se réduit à un simple produit scalaire côté retrieval.
 *
 * Convention e5 : préfixer chaque texte par `query: ` (requête utilisateur) ou
 * `passage: ` (document indexé). Indispensable, sinon la qualité s'effondre.
 *
 * IMPORTANT — ce module charge un modèle ONNX (~120 Mo) + onnxruntime WASM en
 * mémoire. Il ne doit JAMAIS être importé par le bundle du bot (process à
 * `MemoryMax=1.5G`). Seuls le script de build (`scripts/rag-build.ts`) et le
 * sidecar (`embed-server.ts`, process isolé) l'importent. Le runtime du bot
 * passe par `lib/rag.ts` → HTTP vers le sidecar.
 */
import {
  AutoModelForSequenceClassification,
  AutoTokenizer,
  env as hfEnv,
  type FeatureExtractionPipeline,
  type PreTrainedModel,
  type PreTrainedTokenizer,
  pipeline,
} from "@huggingface/transformers";

export const EMBED_MODEL = "Xenova/multilingual-e5-small";
export const EMBED_DIM = 384;
// Cross-encoder de reranking (multilingue, scores de pertinence query↔passage).
export const RERANK_MODEL = "Xenova/bge-reranker-base";

// Cache modèle dans un chemin maîtrisé (apps/bot/.models) — doit figurer dans
// ReadWritePaths du service systemd `shenron-embed` (ProtectSystem=strict).
// Surchageable par HF_HOME/TRANSFORMERS_CACHE le cas échéant.
hfEnv.cacheDir =
  process.env.TRANSFORMERS_CACHE ?? new URL("../../.models/", import.meta.url).pathname;

export type EmbedKind = "query" | "passage";

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

/** Charge (une seule fois) le pipeline d'extraction de features. */
function getExtractor(): Promise<FeatureExtractionPipeline> {
  extractorPromise ??= pipeline("feature-extraction", EMBED_MODEL, {
    dtype: "q8",
  });
  return extractorPromise;
}

/** Préfixe e5 appliqué à un texte selon son rôle (requête vs passage indexé). */
function withPrefix(text: string, kind: EmbedKind): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  return `${kind}: ${t}`;
}

/**
 * Encode un lot de textes en vecteurs L2-normalisés (mean-pooling).
 * @param texts  textes bruts (le préfixe e5 est ajouté ici)
 * @param kind   `query` ou `passage`
 * @param batch  taille de lot pour limiter le pic mémoire au build
 */
export async function embedTexts(
  texts: string[],
  kind: EmbedKind,
  batch = 32,
): Promise<Float32Array[]> {
  if (texts.length === 0) return [];
  const ex = await getExtractor();
  const out: Float32Array[] = [];
  for (let i = 0; i < texts.length; i += batch) {
    const slice = texts.slice(i, i + batch).map((t) => withPrefix(t, kind));
    const tensor = await ex(slice, { pooling: "mean", normalize: true });
    const rows = tensor.tolist() as number[][];
    for (const r of rows) out.push(Float32Array.from(r));
  }
  return out;
}

/** Embed une requête utilisateur unique. */
export async function embedQuery(text: string): Promise<Float32Array> {
  const [v] = await embedTexts([text], "query", 1);
  return v;
}

let rerankerPromise: Promise<{
  tokenizer: PreTrainedTokenizer;
  model: PreTrainedModel;
}> | null = null;

/** Charge (une seule fois) le cross-encoder de reranking. */
function getReranker() {
  rerankerPromise ??= (async () => {
    const tokenizer = await AutoTokenizer.from_pretrained(RERANK_MODEL);
    const model = await AutoModelForSequenceClassification.from_pretrained(RERANK_MODEL, {
      dtype: "q8",
    });
    return { tokenizer, model };
  })();
  return rerankerPromise;
}

/**
 * Score de pertinence cross-encoder pour une requête vs chaque passage.
 * Renvoie un score ∈ [0,1] (sigmoid du logit) par passage, dans l'ordre fourni.
 * Plus précis que le cosinus bi-encoder → 2e étage du pipeline RAG (rerank).
 */
export async function rerankTexts(query: string, passages: string[]): Promise<number[]> {
  if (passages.length === 0) return [];
  const { tokenizer, model } = await getReranker();
  const inputs = tokenizer(
    Array.from({ length: passages.length }, () => query),
    { text_pair: passages, padding: true, truncation: true },
  );
  const output = (await model(inputs)) as { logits: { sigmoid(): { tolist(): number[][] } } };
  return output.logits
    .sigmoid()
    .tolist()
    .map((row) => row[0]);
}

/** Sérialise un vecteur float32 en BLOB SQLite (little-endian natif). */
export function vecToBlob(v: Float32Array): Uint8Array {
  return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
}
