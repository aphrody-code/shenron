#!/bin/bash
# train_llm.sh — Initialise le venv et entraîne le LLM local from scratch sur 12 CPU threads.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$DIR/.venv"

echo "=== INITIALISATION DE L'ENVIRONNEMENT D'ENTRAÎNEMENT LLM ==="
echo "Dossier cible : $DIR"

# 1. Créer le venv s'il n'existe pas
if [ ! -d "$VENV_DIR" ]; then
    echo "[SETUP] Création du venv Python..."
    python3 -m venv "$VENV_DIR"
fi

# Activer le venv
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

# 2. Installer PyTorch CPU et les dépendances nécessaires
echo "[SETUP] Installation de PyTorch CPU..."
pip install --upgrade pip
pip install torch --extra-index-url https://download.pytorch.org/whl/cpu

# 3. Lancer l'entraînement
echo "[RUN] Démarrage de l'entraînement de scratch_llm.py..."
python3 "$DIR/scratch_llm.py" --train

echo "=== ENTRAÎNEMENT TERMINE AVEC SUCCÈS ==="
