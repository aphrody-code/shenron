# LLM Dragon Ball — assistant conversationnel local

Shenron répond via un **vrai modèle conversationnel servi en local sur notre machine** — aucune API
externe. Le RAG (wiki Dragon Ball, FR + EN) fournit les **faits** ; le modèle **raisonne et reformule**
dans la voix du persona, comme une vraie conversation, avec **mémoire**.

## Pourquoi ce choix (honnêteté)

On a d'abord entraîné un modèle **from-scratch** (`dbz_llm.py`, décodeur 29M, CPU). Conclusion mesurée :
un modèle de cette taille **ne peut pas tenir une conversation ni raisonner** (limite d'échelle, pas un
bug) — il capte le style mais produit du charabia factuel. Le code reste dans `apps/bot/data/llm/`
comme artefact/expérience, mais **il ne sert pas en production**.

Pour un assistant réellement intelligent (conversation, raisonnement, mémoire), on sert un **modèle
capable open-weights en local** : **Qwen2.5-3B-Instruct** (GGUF Q4) via **llama.cpp**. C'est toujours
**notre serveur, notre machine, zéro API externe** — juste un modèle assez grand pour être utile.

## Architecture

- **Serveur LLM** — `llama.cpp` (`llama-server`, OpenAI-compatible) sur **:5008**, modèle
  `apps/bot/.models/qwen2.5-3b-instruct-q4_k_m.gguf`, via `shenron-llm.service`. CPU, 11 threads,
  contexte 4096.
- **Orchestration** (`apps/bot/src/lib/llm.ts`, `generateLlmAnswer`) :
  - **Bavardage** (`isChitchat`) : un « bonjour » reçoit une vraie réponse chaleureuse, **sans RAG**.
  - **Questions lore** : `hybridSearch` (RAG) récupère les faits → injectés en CONTEXTE ; le modèle
    **reformule** (consigne explicite : ne jamais recopier le texte brut, ne jamais dumper d'archives).
  - **Mémoire** : historique des derniers échanges par session dans Redis (`dbz:chat:hist:<session>`),
    réinjecté dans le prompt. Session = `discord:<channelId>` (bot) ou `site:<id navigateur>` (site).
  - **Repli** : si `:5008` est indisponible, message persona (jamais un dump).
- **RAG** — `rag_chunks` (FTS5 BM25) construit depuis le wiki + `data/rag/corpus.json`. Enrichi par un
  **crawl massif concurrent FR+EN** (`crawl-fandom-rag.ts`, via `action=parse` wikitext + stripper) :
  **~7000 entités / 36k chunks** (vs 58 personnages avant). Hybride BM25 + embeddings (`rag_vectors`)
  quand les vecteurs sont construits ; sinon dégrade proprement en lexical.

## Indexation Discord

`index-discord-full.ts` indexe **tout l'historique** du serveur (REST, sans cap) dans Redis
(messages/users/salons + lore + sentiment). Le temps réel (Grand Prêtre) maintient l'index.

## Reproduire

```bash
cd apps/bot
# 1. Modèle (une fois) — GGUF Qwen2.5-3B dans .models/ ; llama.cpp compilé dans ~/llama.cpp
# 2. Enrichir le RAG : crawl concurrent fr+en
bun scripts/crawl-fandom-rag.ts --lang fr --out /tmp/s-fr.json --concurrency 8
bun scripts/crawl-fandom-rag.ts --lang en --out /tmp/s-en.json --concurrency 8
bun scripts/merge-corpus-shards.ts /tmp/s-fr.json /tmp/s-en.json
# 3. Construire le RAG (FTS rapide, ou complet avec embeddings sans --no-vectors)
cp data/bot.db /tmp/rag.db && RAG_DB=/tmp/rag.db bun scripts/rag-build.ts --no-vectors
#    puis swap rag_chunks/rag_vectors dans data/bot.db (bot arrêté), restart shenron
sudo systemctl restart shenron-llm shenron
```

## Gotchas

- **Modèle/corpus/vecteurs gitignorés** — générés sur la machine (comme l'index RAG).
- **Fandom n'a pas TextExtracts** → crawl via `action=parse` (wikitext) + stripper, pas `prop=extracts`.
- **Swap RAG sur bot.db live** : arrêter `shenron` avant tout `sqlite3` sur `data/bot.db` (sinon lock,
  cf. piège CLAUDE.md). Vecteurs vidés au swap FTS → mode lexical jusqu'au build complet.
- **Redis db0** : le bot (systemd, sans `REDIS_URL`) écrit db0 ; un shell avec `REDIS_URL=…/1` vise db1.
- **Latence** : Qwen-3B Q4 sur CPU ≈ 8-15 tok/s → réponse en ~5-15 s (indicateur « écrit… » côté Discord).
