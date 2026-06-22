#!/usr/bin/env python3
"""
embed-server-gpu.py — Sidecar embeddings/reranker RAG sur GPU (CUDA), drop-in de
`embed-server.ts`. Contrat HTTP STRICTEMENT identique (port 5007, loopback) :

    POST /embed   {"texts": ["..."], "kind": "query"|"passage"}   -> {"vectors": [[...]]}
    POST /rerank  {"query": "...", "passages": ["...", "..."]}      -> {"scores": [...]}
    GET  /health                                                    -> {"ok": true, ...}

Le bot (`src/lib/rag.ts`) et le build (`scripts/rag-build.ts`) parlent HTTP : ils ne
voient AUCUNE différence avec le sidecar TS — sauf que les modèles tournent ici en
PyTorch natif sur CUDA au lieu de onnxruntime WASM (CPU) dans transformers.js.

Équivalences modèles (mêmes poids, dim 384) :
  - embeddings : intfloat/multilingual-e5-small   == Xenova/multilingual-e5-small
  - reranker   : BAAI/bge-reranker-base            == Xenova/bge-reranker-base

Fidélité au contrat de `src/lib/embeddings.ts` :
  - préfixe e5 `query: ` / `passage: ` après collapse-whitespace + trim,
  - mean-pooling + L2-normalisation (dim 384),
  - rerank = sigmoid(logit[0]) du cross-encoder, un score par passage dans l'ordre.

IMPORTANT (cf. avertissement #3 du brief) : l'index `vec_chunks` doit être
reconstruit (`bun --filter @shenron/bot run rag:build`) AVEC ce sidecar actif, car
les vecteurs de requête doivent venir du même backend que les vecteurs indexés.

Usage : EMBED_PORT=5007 EMBED_HOST=127.0.0.1 ~/.rag-gpu/bin/python embed-server-gpu.py
"""
import os
import re
import time

import torch
import torch.nn.functional as F
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForSequenceClassification, AutoTokenizer

EMBED_MODEL = "intfloat/multilingual-e5-small"  # == Xenova/multilingual-e5-small (384d)
RERANK_MODEL = "BAAI/bge-reranker-base"          # == Xenova/bge-reranker-base
EMBED_DIM = 384

DEVICE = os.environ.get("EMBED_DEVICE") or ("cuda" if torch.cuda.is_available() else "cpu")

# ── Chargement des modèles (une fois, gardés chauds) ─────────────────────────
print(f"[embed-gpu] device={DEVICE} — chargement {EMBED_MODEL} + {RERANK_MODEL}…", flush=True)
_t0 = time.time()
emb_model = SentenceTransformer(EMBED_MODEL, device=DEVICE)
rer_tok = AutoTokenizer.from_pretrained(RERANK_MODEL)
rer_model = AutoModelForSequenceClassification.from_pretrained(RERANK_MODEL).to(DEVICE).eval()


def _e5_prefix(texts: list[str], kind: str) -> list[str]:
    """Réplique `withPrefix` de embeddings.ts : collapse-whitespace + trim + préfixe e5."""
    p = "query: " if kind == "query" else "passage: "
    return [p + re.sub(r"\s+", " ", (t or "")).strip() for t in texts]


@torch.no_grad()
def embed(texts: list[str], kind: str) -> list[list[float]]:
    if not texts:
        return []
    prefixed = _e5_prefix(texts, kind)
    vecs = emb_model.encode(
        prefixed,
        batch_size=64,
        normalize_embeddings=True,  # L2-norm, comme embeddings.ts (normalize: true)
        convert_to_numpy=True,
        show_progress_bar=False,
    )
    return vecs.tolist()


@torch.no_grad()
def rerank(query: str, passages: list[str]) -> list[float]:
    """Cross-encoder : sigmoid(logit[0]) par passage, ordre préservé (== rerankTexts)."""
    if not passages:
        return []
    inputs = rer_tok(
        [query] * len(passages),
        passages,
        padding=True,
        truncation=True,
        max_length=512,
        return_tensors="pt",
    ).to(DEVICE)
    logits = rer_model(**inputs).logits  # [N, 1]
    return torch.sigmoid(logits)[:, 0].float().cpu().tolist()


# Préchauffe (le 1er forward CUDA alloue/compile les kernels — rag.ts a un timeout 3 s).
embed(["warmup"], "query")
rerank("warmup", ["warmup"])
print(f"[embed-gpu] prêt en {int((time.time() - _t0) * 1000)} ms — dim {EMBED_DIM}", flush=True)

app = FastAPI()


class EmbReq(BaseModel):
    texts: list[str]
    kind: str = "passage"


class RerReq(BaseModel):
    query: str
    passages: list[str]


@app.get("/health")
def health():
    return {
        "ok": True,
        "model": EMBED_MODEL,
        "dim": EMBED_DIM,
        "reranker": RERANK_MODEL,
        "device": DEVICE,
    }


@app.post("/embed")
def embed_route(r: EmbReq):
    kind = "passage" if r.kind == "passage" else "query"
    return {"vectors": embed(r.texts, kind)}


@app.post("/rerank")
def rerank_route(r: RerReq):
    return {"scores": rerank(r.query, r.passages)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=os.environ.get("EMBED_HOST", "127.0.0.1"),
        port=int(os.environ.get("EMBED_PORT", "5007")),
        log_level="warning",
    )
