#!/usr/bin/env bash
# Sync a model's interactive tool (a Vite/SPA build) into the website.
#
# It (re)builds the source SPA with the correct base path and vendors the built
# `dist/` into  frontend/public/apps/<model-id>/  so the frontend container serves
# it at  /apps/<model-id>/  (and the model detail page can embed it via iframe).
#
# Usage:
#   scripts/sync-model.sh <model-id> <source-dir> [--no-build]
#
#   <model-id>    e.g. plan-c, kawasaki-ivig  (must match models.json id / route)
#   <source-dir>  path to the Vite SPA project (the folder with package.json)
#   --no-build    skip the build; just copy an existing <source-dir>/dist
#
# Examples:
#   scripts/sync-model.sh plan-c /Users/hezhu/projects/LatentIRI/cdss
#   scripts/sync-model.sh kawasaki-ivig ../kawasaki-app --no-build
#
# After syncing a NEW model, also:
#   1) add it to frontend/data/models.json (id/route = /models/<model-id>),
#   2) register the embed in frontend/app/models/[modelId]/page.tsx:
#        const MODEL_EMBEDS = { '<model-id>': '/apps/<model-id>/index.html', ... }
#   3) commit frontend/public/apps/<model-id>/ along with those edits.
set -euo pipefail

# --- resolve paths ---------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LABWEB_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

usage() {
  echo "Usage: scripts/sync-model.sh <model-id> <source-dir> [--no-build]" >&2
  exit 2
}

MODEL_ID="${1:-}"
SOURCE_DIR="${2:-}"
NO_BUILD="${3:-}"
[ -n "$MODEL_ID" ] && [ -n "$SOURCE_DIR" ] || usage

# model-id sanity (lowercase letters, digits, hyphens — matches a URL segment)
if ! printf '%s' "$MODEL_ID" | grep -qE '^[a-z0-9][a-z0-9-]*$'; then
  echo "[sync] ERROR: model-id '$MODEL_ID' must be lowercase letters/digits/hyphens." >&2
  exit 1
fi

SOURCE_DIR="$(cd "$SOURCE_DIR" 2>/dev/null && pwd || true)"
if [ -z "$SOURCE_DIR" ] || [ ! -f "$SOURCE_DIR/package.json" ]; then
  echo "[sync] ERROR: <source-dir> not found or missing package.json." >&2
  exit 1
fi

BASE="/apps/$MODEL_ID/"
DEST="$LABWEB_ROOT/frontend/public/apps/$MODEL_ID"

echo "[sync] model-id : $MODEL_ID"
echo "[sync] source   : $SOURCE_DIR"
echo "[sync] base path: $BASE"
echo "[sync] dest     : $DEST"

# --- build -----------------------------------------------------------------
if [ "$NO_BUILD" = "--no-build" ]; then
  echo "[sync] --no-build: using existing $SOURCE_DIR/dist"
else
  echo "[sync] Building SPA with VITE_BASE=$BASE ..."
  ( cd "$SOURCE_DIR" && VITE_BASE="$BASE" npm run build )
fi

if [ ! -f "$SOURCE_DIR/dist/index.html" ]; then
  echo "[sync] ERROR: $SOURCE_DIR/dist/index.html not found after build." >&2
  exit 1
fi

# --- verify the build used the expected base -------------------------------
if ! grep -q "$BASE" "$SOURCE_DIR/dist/index.html"; then
  echo "[sync] WARNING: dist/index.html does not reference '$BASE'." >&2
  echo "[sync]          Asset URLs may be wrong. Rebuild with VITE_BASE=$BASE." >&2
fi

# --- vendor into the website ----------------------------------------------
echo "[sync] Copying dist -> public/apps/$MODEL_ID ..."
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$SOURCE_DIR/dist/." "$DEST/"

FILES=$(find "$DEST" -type f | wc -l | tr -d ' ')
SIZE=$(du -sh "$DEST" | awk '{print $1}')
echo "[sync] ✅ Vendored $FILES files ($SIZE) to public/apps/$MODEL_ID/"
echo "[sync] Verify locally:  http://localhost:3000/apps/$MODEL_ID/index.html"
echo "[sync] Then commit:     git add frontend/public/apps/$MODEL_ID"
echo "[sync] New model? also edit models.json + MODEL_EMBEDS (see header)."
