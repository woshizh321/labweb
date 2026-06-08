# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`lab-website` — the official site of a small medical / biomedical research lab (1 PI, 1 technician,
4 PhD + 3 master's students), with a reserved architecture for mounting interpretable **research
prediction-model WebApps**. Phase-1 MVP: Next.js frontend + FastAPI skeleton + nginx, deployed via
Docker Compose to a Tencent Cloud Ubuntu server.

> **Privacy:** this project does **not** process real patient-level or personally identifiable data.
> Model pages are research/education only and never produce diagnostic or treatment instructions.

## Stack & layout

| Layer | Tech | Path |
|---|---|---|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind | `frontend/` |
| Backend | FastAPI · Pydantic · Uvicorn (skeleton) | `backend/` |
| Content | JSON files (no CMS / DB) | `frontend/data/*.json` |
| Deploy | Docker Compose + nginx reverse proxy | `docker-compose.yml`, `nginx/lab.conf` |

`AGENTS.md` holds the cross-tool collaboration rules — read it too.

## Commands

Frontend (run from `frontend/`):
```bash
npm install
npm run dev          # http://localhost:3000
npm run lint         # must pass before any commit
npm run build        # must pass before any commit
```
Backend (from `backend/`): `uvicorn app.main:app --reload --port 8000` (docs at `/docs`).
Full stack: `docker compose up -d --build` (or `./deploy.sh`, which also probes `/`, `/health`, `/api/models`).
**No Docker locally** on this machine — validate `docker compose config` / `nginx -t` on the server.

## Architecture notes (the non-obvious parts)

- **Data flows through `lib/data.ts` only.** Pages never import raw JSON directly; sorting/grouping
  rules live in `lib/data.ts`. Lab identity / nav live in `lib/site.ts`; research themes (bilingual)
  live there too via `getResearchAreas(lang)`.
- **i18n is cookie-based, default Chinese.** `lib/i18n.ts` holds the client-safe dictionaries +
  enumerable label maps (group/status/category/role); `lib/getLang.ts` is **server-only** (reads the
  `lang` cookie via `next/headers`, defaults `'zh'`). The two are split because client components
  (`Navbar`, `LanguageToggle`) must not import `next/headers`. Server components/pages/cards call
  `getLang()`+`getDict()`; the toggle (`components/ui/LanguageToggle.tsx`) writes the cookie and calls
  `router.refresh()`. Reading the cookie makes routes dynamically rendered (`ƒ`) — expected.
- **Free-text JSON content is intentionally NOT translated** (data-structure lock). Only UI chrome and
  enumerable labels are bilingual; placeholder names/titles/descriptions stay as-is for later replacement.
- **Design system = restrained academic.** Tokens in `tailwind.config.ts` + `globals.css`: deep navy
  primary, gray-blue neutrals, green almost unused, borders over shadows (`shadow-card: none`), modest
  radius. Keep it small-lab/academic — not SaaS/marketing. No animation libs, no external images
  (avatars/maps use `PlaceholderImage`).
- **Model pages** must keep the bilingual research-use `DisclaimerBox` and never show a mock result as
  real. The demo predict endpoint always returns `is_mock: true`.

## Hard constraints (do NOT touch without explicit request)

- **Never modify** `backend/`, `docker-compose.yml`, `nginx/`, `deploy.sh`, the API, model logic, or
  deployment config when doing frontend/visual work.
- **Never change the JSON data-structure fields** in `frontend/data/*.json` (members/publications/
  models/news/alumni). Editing placeholder *content* and grouping is fine.
- **No real secrets / no real `.env`** (only `.env.example`); never request or store PII; no diagnostic
  or treatment-instruction copy.
- **No new heavy deps** (DB, CMS, auth, state libs, UI/animation frameworks) without a stated reason.

## Git

Remote: `git@github.com:woshizh321/labweb.git` (SSH — HTTPS password auth is disabled). Default branch
`main`. Atomic commits with explicit file lists (never `git add .`). Commit/push only when asked.
