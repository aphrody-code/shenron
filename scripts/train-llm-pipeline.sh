#!/usr/bin/env bash
# train-llm-pipeline.sh — Pipeline industriel unifié d'ingestion et d'évaluation LLM Dragon Ball.
#
# Ce script enchaîne :
#   1. La reconstruction du RAG (re-build de l'index sémantique)
#   2. L'évaluation de pertinence du RAG (Recall, MRR, nDCG sur le gold-set)
#   3. La distillation automatique du corpus RAG en dataset SFT pour le Fine-Tuning
#   4. L'évaluation automatique LLM-as-a-judge (Grand Prêtre) de la qualité des réponses
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

export PATH="$HOME/.bun/bin:$PATH"
cd "$PROJECT_ROOT/apps/bot"

echo "======================================================================"
echo "🐉 DEBUT DU PIPELINE DRAGON BALL LLM FACTORY"
echo "======================================================================"
echo "📂 Workspace : $PROJECT_ROOT"
echo "📅 Date : $(date)"
echo "----------------------------------------------------------------------"

# 1. Reconstruction du RAG
echo -e "\n⚡ ÉTAPE 1 : Reconstruction de l'index RAG (Chunks + Embeddings)... (Passée)"
# bun scripts/rag-build.ts

# 2. Évaluation de pertinence du RAG
echo -e "\n📊 ÉTAPE 2 : Évaluation des métriques de recherche du RAG..."
bun scripts/rag-eval.ts

# 3. Distillation SFT du corpus
echo -e "\n⚗️ ÉTAPE 3 : Distillation du corpus RAG en dataset d'entraînement SFT... (Passée)"
# bun scripts/llm/build-sft-dataset.ts

# 4. Évaluation LLM-as-a-judge (Grand Prêtre)
echo -e "\n⚖️ ÉTAPE 4 : Évaluation LLM-as-a-judge (Moyennes Style/Exactitude/Concision)..."
bun scripts/llm/eval-llm.ts --persona whis

echo "----------------------------------------------------------------------"
echo "🎉 PIPELINE LLM FACTORY TERMINE AVEC SUCCES !"
echo "======================================================================"
