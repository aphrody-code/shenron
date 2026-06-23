#!/usr/bin/env bash
# train-supervised.sh — lance finetune_manga.py et le RELANCE automatiquement en cas de
# crash. Grâce à save_strategy="steps" + resume_from_checkpoint, chaque relance REPREND
# depuis le dernier checkpoint (pas de perte). S'arrête sur succès ou après MAX_RESTARTS.
#
# Passe les mêmes variables d'env que le training (DATASET, MODEL, MAX_SEQ, RANK, EPOCHS,
# LR, OUTDIR, SAVE_STEPS…). Usage :
#   DATASET=… RANK=16 OUTDIR=… bash train-supervised.sh
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PY="${PY:-$HOME/.unsloth/bin/python}"
LOG="${LOG:-/tmp/ft-supervised.log}"
MAX="${MAX_RESTARTS:-10}"

n=0
while :; do
  echo "=== [supervisor] run #$((n + 1)) $(date) ===" | tee -a "$LOG"
  "$PY" "$HERE/finetune_manga.py" >>"$LOG" 2>&1
  rc=$?
  if [ "$rc" -eq 0 ]; then
    echo "=== [supervisor] training terminé OK ===" | tee -a "$LOG"
    break
  fi
  n=$((n + 1))
  if [ "$n" -ge "$MAX" ]; then
    echo "=== [supervisor] ABANDON après $MAX crashs (rc=$rc) ===" | tee -a "$LOG"
    exit 1
  fi
  echo "=== [supervisor] CRASH (rc=$rc) → reprise depuis checkpoint dans 30s (#$n/$MAX) ===" | tee -a "$LOG"
  sleep 30
done
