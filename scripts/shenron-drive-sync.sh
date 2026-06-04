#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0
set -euo pipefail

# Script directory
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$DIR/.."

echo "▶ Starting Google Drive Wiki Sync..."

# Run the Python download script using uv with Python 3.13.
# Target: apps/site/public/wiki
# Drive URL: https://drive.google.com/drive/folders/1I_qmhLcgrWEVBeO9YXEj_tqqhH3-9DmW
# Concurrency is set to 4 to prevent rate-limiting, and --resume is used to skip unmodified files.
/home/ubuntu/.local/bin/uv run --python 3.13 "$DIR/download_gdrive.py" \
  "https://drive.google.com/drive/folders/1I_qmhLcgrWEVBeO9YXEj_tqqhH3-9DmW" \
  -o "$REPO/apps/site/public/wiki" \
  -c 4

echo "✓ Google Drive Wiki Sync Completed!"
