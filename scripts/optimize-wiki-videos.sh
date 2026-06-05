#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0
# optimize-wiki-videos.sh — Ré-encode les MP4 de la home pour le web.
#
# Les originaux du Drive sont en 1080p / 14-21 Mbps / avec audio / sans faststart (~80 Mo) :
# rédhibitoire en autoplay. On produit pour chaque `<x>.mp4` un `<x>.web.mp4` :
#   720p · H.264 CRF 24 (~2 Mbps) · SANS audio · +faststart (lecture progressive immédiate).
# -> ~90% de poids en moins, qualité visuelle identique en fond (opacité 0.2-0.8 + grain/grade).
# Idempotent : saute si le .web.mp4 est déjà à jour. Appelé aussi par shenron-drive-sync.sh.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WIKI="${1:-$DIR/../apps/site/public/wiki}"
command -v ffmpeg >/dev/null || { echo "ffmpeg absent"; exit 0; }

shopt -s nullglob
n=0
for src in "$WIKI"/*.mp4; do
  case "$src" in *.web.mp4) continue ;; esac          # ne pas ré-encoder un dérivé
  base="${src%.mp4}"; out="${base}.web.mp4"
  # saute si déjà à jour
  [ -f "$out" ] && [ "$out" -nt "$src" ] && continue
  echo "▶ $(basename "$src") -> $(basename "$out")"
  nice -n 15 ffmpeg -y -loglevel error -i "$src" \
    -an -vf "scale=-2:720:flags=lanczos" -r 30 \
    -c:v libx264 -preset veryfast -crf 24 -pix_fmt yuv420p \
    -movflags +faststart "$out" && n=$((n+1))
  chmod 644 "$out" 2>/dev/null || true
done
echo "✓ $n vidéo(s) optimisée(s) -> $WIKI/*.web.mp4"
