# lab-website

Official website for a medical / biomedical research lab, with a reserved architecture
for mounting interpretable **research prediction models** as WebApps.

> **Privacy:** This project does **not** process real patient-level or personally
> identifiable data. Model pages are for research and education only and never produce
> diagnostic or treatment instructions.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Backend | FastAPI · Pydantic · Uvicorn (Phase-1 skeleton) |
| Content | JSON files under `frontend/data/` (no CMS / DB in Phase-1) |
| Deploy | Docker Compose + Nginx reverse proxy |

## Repository structure

```
labweb/
├── frontend/        # Next.js app (pages, components, JSON data, design system)
├── backend/         # FastAPI skeleton (health, model catalog, mock predict)
├── nginx/lab.conf   # reverse proxy: / -> frontend, /api/ -> backend, /apps/ reserved
├── docker-compose.yml
├── .env.example     # copy to .env (no real secrets committed)
├── deploy.sh        # minimal server deploy helper
├── AGENTS.md        # rules for AI coding tools working in this repo
└── README.md
```

## Local development

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # http://localhost:8000/docs
```

## Run the whole stack with Docker

```bash
cp .env.example .env        # edit if needed
docker compose config       # validate compose file
docker compose up -d --build
# Site:        http://localhost/
# Backend health (proxied through nginx):  http://localhost/health
# Model catalog API:                       http://localhost/api/models
```

## Deploy to Tencent Cloud (Ubuntu)

1. Install Docker + the Compose plugin on the server.
2. Copy the repo to the server (`git clone` or `scp`).
3. `cp .env.example .env` and set `ALLOWED_ORIGINS` to your domain.
4. `./deploy.sh` (builds images, starts `frontend` + `backend` + `nginx`, then probes health).
5. Point your domain's DNS at the server; open port 80 in the security group.
6. **HTTPS (recommended next step):** add a TLS server block to `nginx/lab.conf`
   and issue a certificate with certbot / Let's Encrypt.

Server sizing (4 GB RAM / 8 vCPU / 70 GB SSD) is comfortable for this stack.

### Deployment hardening (already wired in)

- **`deploy.sh`** runs, in order: a `curl` availability check → `git pull --ff-only`
  (skipped automatically if the folder is not a git checkout) → `docker compose build`
  → `docker compose up -d` → `docker compose ps` → three post-deploy health probes
  against `/`, `/health`, and `/api/models`. It never runs `docker system prune`,
  never edits an existing `.env`, and never configures HTTPS.
- **Backend healthcheck:** the `backend` service has a Docker `healthcheck` using the
  Python standard library (no curl/wget in the slim image). The health path is
  **`/health`**. After deploy, `docker compose ps` should report backend as `healthy`.
- **nginx gzip** is enabled for text-like assets (HTML/CSS/JS/JSON/XML/SVG).
- **`/apps/` returns `503`** by design — it is a placeholder until model WebApps
  (Streamlit / Gradio) are mounted. A 503 there is the **expected** result for now.
- **HTTPS is not enabled yet.** Configure TLS separately only after the domain is
  pointed at the server (see step 6).

### Network & security-group notes

- **Do not expose ports 3000 (frontend) or 8000 (backend) to the public internet.**
  They are only `expose`d on the internal Docker network and reached through nginx.
  Only nginx publishes a host port (80).
- In the Tencent Cloud **security group, open only 22 (SSH) and 80 (HTTP)** to start.
  Open **443 only after HTTPS/TLS is configured.**
- **On first deploy, confirm `backend` shows `healthy`** in `docker compose ps`
  before considering the rollout complete.
- If `/apps/` returns **503**, that is the expected placeholder behavior before any
  model service is connected — not an error.

### First-run verification on the server

```bash
docker compose config                 # validate compose syntax
./deploy.sh                           # build + up + ps + health probes
docker compose ps                     # backend should be "healthy"
docker compose exec nginx nginx -t    # validate nginx config (incl. gzip)
curl -fsS http://localhost/                       # frontend (200)
curl -fsS http://localhost/health                 # backend {"status":"ok",...}
curl -fsS http://localhost/api/models             # model catalog JSON
curl -s -H "Accept-Encoding: gzip" -I http://localhost/ | grep -i content-encoding   # gzip active
```

## Editing lab content (no coding required)

All editorial content lives in JSON — edit and redeploy:

| Page | File |
|---|---|
| Members | `frontend/data/members.json` |
| Alumni | `frontend/data/alumni.json` |
| Publications | `frontend/data/publications.json` |
| Models (cards) | `frontend/data/models.json` |
| News | `frontend/data/news.json` |

Lab identity (name, institution, email, address, nav) lives in
`frontend/lib/site.ts`. Research directions live in the same file (`researchAreas`).

## Applying a Figma design later

The design system is centralized:
- Color / spacing / type tokens → `frontend/tailwind.config.ts`
- CSS variables + base styles → `frontend/app/globals.css`
- Reusable UI primitives → `frontend/components/ui/`

Map Figma tokens onto these, and components re-skin without page rewrites.

## Adding a real prediction model later

A model card always lives in `frontend/data/models.json` (id, route `/models/<id>`,
status, version, disclaimer); the dynamic route `frontend/app/models/[modelId]/page.tsx`
renders it. How the tool itself runs depends on its type:

### A. Embed an interactive static tool (the PLAN-C pattern — recommended)

For a self-contained client-side app (e.g. a Vite/React SPA that computes in the
browser), vendor its build into the site and embed it via an iframe — no backend,
no extra container.

1. **Build + vendor** with the one-command helper (rebuilds with the correct base
   `/apps/<id>/` and copies `dist/` into `frontend/public/apps/<id>/`):
   ```bash
   scripts/sync-model.sh <model-id> <source-spa-dir>
   # e.g. scripts/sync-model.sh plan-c /Users/hezhu/projects/LatentIRI/cdss
   ```
   The frontend container then serves it at `/apps/<id>/` (nginx routes `/apps/*`
   to the frontend via the catch-all — no nginx/compose change needed).
2. **Register the embed** in `frontend/app/models/[modelId]/page.tsx`:
   ```ts
   const MODEL_EMBEDS = { '<model-id>': '/apps/<model-id>/index.html', /* ... */ };
   ```
   (Kept in code, not in `models.json`, to preserve the data-structure lock.)
   The detail page shows the disclaimer + an iframe with an "open in new tab" link.
3. **Add the card** to `frontend/data/models.json` (set `status` to `Available`)
   and commit `frontend/public/apps/<id>/` together with the edits above.

Reference implementation: **PLAN-C Compass** at `/models/plan-c` → `/apps/plan-c/`.
To update a tool later, just re-run `scripts/sync-model.sh <id> <dir>` and commit.

### B. Backend-inference model

For server-side inference, drop the artifact in `backend/model_artifacts/`, add a
service + schema + route (see `backend/README.md`), and keep the research-use
disclaimer and version fields in every response. The detail page's reserved section
skeleton (overview / inputs / output / interpretation / performance / citation) is
already in place for non-embedded models.

### C. Heavy interactive services (Streamlit / Gradio)

Run as their own container and add a dedicated `upstream` + `location /apps/<id>/`
block in `nginx/lab.conf` pointing at it.

## AI coding tools

See [`AGENTS.md`](./AGENTS.md) for the collaboration rules (do-not-touch list,
frontend/backend conventions, and medical-model safety constraints).
