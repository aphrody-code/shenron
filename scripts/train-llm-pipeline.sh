#!/usr/bin/env bash
# train-llm-pipeline.sh — Pipeline HONNÊTE de NOTRE LLM Dragon Ball maison.
#
# Aucune étape factice : chaque étape s'exécute réellement (ou est sautée explicitement via un flag).
#   1. Export du corpus + SFT depuis le wiki (copie read-only de la DB du bot).
#   2. [--train] Entraînement de notre modèle from-scratch (tokenizer BPE + pré-entraînement + SFT).
#   3. Évaluation retrieval du RAG (Recall/MRR/nDCG) — lecture seule.
#   4. Évaluation HONNÊTE de notre modèle (non-vide + grounding mots-clés) via le serveur :5009.
#
# Usage : bash scripts/train-llm-pipeline.sh [--train]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
export PATH="$HOME/.bun/bin:$PATH"
cd "$PROJECT_ROOT/apps/bot"

DO_TRAIN=0
[[ "${1:-}" == "--train" ]] && DO_TRAIN=1

PY="data/llm/.venv/bin/python"
TRAIN_DB="/tmp/dbz-train.db"

echo "======================================================================"
echo "USINE LLM DRAGON BALL MAISON — $(date)"
echo "======================================================================"

echo -e "\n[1/4] Export du corpus + dataset SFT depuis le wiki..."
cp -f data/bot.db "$TRAIN_DB"
DBZ_DB="$TRAIN_DB" bun data/llm/corpus_export.ts

if [[ "$DO_TRAIN" == "1" ]]; then
  echo -e "\n[2/4] Entraînement du modèle maison (tokenizer + pretrain + SFT)... (long, CPU)"
  DBZ_THREADS="${DBZ_THREADS:-8}" "$PY" data/llm/dbz_llm.py train
else
  echo -e "\n[2/4] Entraînement SAUTÉ (passer --train pour ré-entraîner le modèle)."
fi

echo -e "\n[3/4] Évaluation retrieval du RAG (lecture seule)..."
RAG_DB="$TRAIN_DB" bun scripts/rag-eval.ts || echo "(rag-eval non bloquant)"

echo -e "\n[4/4] Évaluation HONNÊTE de notre modèle (serveur :5009 requis)..."
if curl -sf --max-time 3 http://127.0.0.1:5009/health >/dev/null 2>&1; then
  RAG_DB="$TRAIN_DB" bun scripts/llm/eval-own.ts --persona whis
else
  echo "⚠ Serveur LLM maison (:5009) indisponible — démarrer shenron-llm.service puis relancer l'étape 4."
fi

echo -e "\n======================================================================"
echo "PIPELINE TERMINÉ."
echo "======================================================================"
