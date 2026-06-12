#!/usr/bin/env bash
# Simple deploy helper for a Tencent Cloud Ubuntu server.
# Assumes Docker + Docker Compose plugin are installed and the repo is pulled.
#
# Usage (on the server, from the repo root):
#   ./deploy.sh
#
# This is intentionally minimal. It does NOT manage secrets, TLS, or DB migrations,
# and never runs `docker system prune` or edits .env automatically.
set -euo pipefail

cd "$(dirname "$0")"

# Require .env (do NOT auto-edit it — only scaffold from the example once).
if [ ! -f .env ]; then
  echo "[deploy] .env not found — creating from .env.example (edit it, then re-run)."
  cp .env.example .env
  exit 1
fi

# curl is needed for the post-deploy health probes below.
if ! command -v curl >/dev/null 2>&1; then
  echo "[deploy] ERROR: curl not found. Install it first:  sudo apt-get update && sudo apt-get install -y curl"
  exit 1
fi

# Sync code if this is a git checkout; otherwise skip with a notice.
if git rev-parse --git-dir >/dev/null 2>&1; then
  echo "[deploy] Git repo detected — pulling latest (fast-forward only)..."
  git pull --ff-only
else
  echo "[deploy] Not a git repo — skipping git pull (using files as-is)."
fi

echo "[deploy] Building images..."
docker compose build

echo "[deploy] Starting stack..."
docker compose up -d

# nginx resolves the frontend/backend container IPs once at startup. When those
# services are recreated by a build, they get NEW IPs but nginx is left running with
# the stale ones, causing 502s. Restarting nginx forces it to re-resolve the upstreams.
echo "[deploy] Refreshing nginx upstreams..."
docker compose restart nginx

echo "[deploy] Current status:"
docker compose ps

# Give services a moment to become ready before probing.
echo "[deploy] Waiting for services to come up..."
sleep 5

echo "[deploy] Running health probes..."
probe_fail=0
curl -fsS http://localhost/           >/dev/null && echo "  [ok] frontend (/)"          || { echo "  [FAIL] frontend (/)";          probe_fail=1; }
curl -fsS http://localhost/health     >/dev/null && echo "  [ok] backend  (/health)"     || { echo "  [FAIL] backend  (/health)";     probe_fail=1; }
curl -fsS http://localhost/api/models >/dev/null && echo "  [ok] backend  (/api/models)" || { echo "  [FAIL] backend  (/api/models)"; probe_fail=1; }

if [ "$probe_fail" -ne 0 ]; then
  echo "[deploy] WARNING: one or more health probes failed. Inspect logs:"
  echo "         docker compose logs --tail=80"
  exit 1
fi

echo "[deploy] ✅ Deployment successful — all health probes passed."
