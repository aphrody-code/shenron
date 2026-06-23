#!/usr/bin/env bash
# finalize-v3.sh — post-train du fine-tune ENCYCLOPÉDIQUE gemma4-db-full.
# Convertit le LoRA en adapter GGUF (sans merger les 23,9 Go), crée le modèle Ollama,
# puis teste la connaissance Dragon Ball (épisodes / films / tomes / persos).
# À lancer quand v3 a fini (LoRA présent). Usage : bash finalize-v3.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUTDIR="${OUTDIR:-$HERE/gemma4-db-full}"
LORA="$OUTDIR/lora"
ADAPTER="$OUTDIR/gemma4-db-full-adapter.gguf"
MODEL="${OLLAMA_MODEL:-gemma4-db-full}"
LLAMA="${LLAMA_CPP:-$HOME/llama.cpp}"
PY="${PY:-$HOME/.unsloth/bin/python}"

[ -f "$LORA/adapter_model.safetensors" ] || { echo "✗ LoRA absent ($LORA) — v3 pas terminé ?"; exit 1; }

# Base HF (depuis adapter_config.json → snapshot du cache HF, sinon le nom direct).
BASE=$("$PY" - <<PY
import json, glob, os
cfg = json.load(open("$LORA/adapter_config.json"))
name = cfg.get("base_model_name_or_path", "unsloth/gemma-4-12b-it")
hits = glob.glob(os.path.expanduser(f"~/.cache/huggingface/hub/models--{name.replace('/','--')}/snapshots/*"))
print(hits[0] if hits else name)
PY
)
echo "[finalize] base=$BASE"

echo "[finalize] 1/3 convert LoRA → adapter GGUF…"
"$PY" "$LLAMA/convert_lora_to_gguf.py" "$LORA" --base "$BASE" --outfile "$ADAPTER" --outtype f16

echo "[finalize] 2/3 Modelfile + ollama create $MODEL…"
cat > "$OUTDIR/Modelfile" <<EOF
FROM gemma4:12b
ADAPTER $ADAPTER
PARAMETER temperature 0.6
PARAMETER num_ctx 8192
EOF
ollama create "$MODEL" -f "$OUTDIR/Modelfile"

echo "[finalize] 3/3 test connaissances Dragon Ball ($MODEL)…"
for q in \
  "En une phrase, que se passe-t-il dans l'épisode 1 de Dragon Ball ?" \
  "Cite trois films Dragon Ball Z." \
  "De quoi parle le tome 1 du manga Dragon Ball ?" \
  "Qui est Beerus et quel est son rôle ?" \
  "Quelle est la dernière saga de Dragon Ball Super ?"; do
  echo "──────────────────────────────────────────"
  echo "Q: $q"
  # `|| true` : sous `set -euo pipefail`, `ollama run | head` renvoie rc=141 (SIGPIPE,
  # head ferme le tube) → faux échec du finalize alors que GGUF+create ont réussi.
  ollama run "$MODEL" "$q" 2>/dev/null | head -8 || true
done
echo "──────────────────────────────────────────"
echo "[finalize] OK — modèle Ollama: $MODEL"
echo "Multimodal : bun ../../scripts/test-gemma-multimodal.ts --manga 3 --video ../dbz-videos/DB-001.mp4"
