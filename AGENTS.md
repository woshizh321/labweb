# AGENTS.md

Rules for AI coding tools (Claude Code / Codex / others) working in this repository.
Read this before making changes.

## 1. Project positioning

- This is the **official website of a medical / biomedical research lab**.
- It is designed to later **mount multiple research prediction-model WebApps**.
- Phase-1 goal: a clean, deployable, extensible MVP — **not** a complex system.
- Visual identity: research-lab / biotech-institute / clinical-dashboard, restrained.

## 2. Prohibited actions

- **Do not** commit real secrets or credentials.
- **Do not** create or edit a real `.env` — only maintain `.env.example`.
- **Do not** store, request, or process patient-level / personally identifiable data.
- **Do not** delete `backend/model_artifacts/` (or its `.gitkeep`).
- **Do not** present any mock prediction as a real / validated model result.
  The demo endpoint must always return `is_mock: true`.
- **Do not** introduce heavy dependencies (DB, CMS, auth, state libraries, large UI
  frameworks, charting megapackages) without an explicit reason and approval.
- **Do not** add diagnostic / treatment-instruction language ("treat immediately",
  "stop the drug now", etc.). Model output is research, explanatory, advisory only.

## 3. Frontend conventions

- Stack: **Next.js (App Router) + TypeScript + Tailwind**. Strict typing.
- **Data-driven pages**: editorial content lives in `frontend/data/*.json`, accessed
  only through `frontend/lib/data.ts`. Pages never import raw JSON directly.
- Lab identity / nav / research areas live in `frontend/lib/site.ts` — no hardcoded
  lab name or contact details scattered in components.
- **Reuse components** in `frontend/components/` (ui / layout / cards / sections).
  Don't duplicate card or layout markup across pages.
- Keep Tailwind classes readable; respect the design tokens in `tailwind.config.ts`.
- Mobile-responsive by default. Minimal animation; no heavy gradients; no
  marketing-SaaS styling.

## 4. Backend conventions

- Stack: **FastAPI + Pydantic + Uvicorn**. Phase-1 is a thin skeleton.
- **Validate all input** with Pydantic; bound numeric ranges; `extra: forbid` to
  reject sneaked-in fields (including PII).
- **Error messages must be sanitized** — never return server paths or stack traces
  (see the global exception handler in `app/main.py`).
- Every model response carries a **version** and the **research-use disclaimer**.
- Real models load artifacts from `backend/model_artifacts/` via `app/services/`.
  Replace the mock service without changing the public API schema.

## 5. Medical-model rules (hard constraints)

- Every model page **must** display the research-use disclaimer (EN + ZH) via
  `components/ui/DisclaimerBox`.
- Model UI must read as **rigorous, interpretable, non-diagnostic, research-use**,
  with explicit version, intended use, and **not-applicable-to** scope.
- **Never** output diagnosis or treatment commands. Results are interpretive only.
- Model input forms must **never** request name, ID number, phone, full date of
  birth, medical record number, or other personal identifiers.

## 6. Required disclaimer text

English:
> This tool is intended for research and educational use only. It is not a substitute
> for professional medical judgment, diagnosis, or treatment.

中文：
> 本工具仅用于科研和教学展示，不构成临床诊断、治疗建议或个体化医疗决策依据。

## 7. Before finishing a change

- Frontend: `npm run lint` and `npm run build` must pass.
- Backend: code must import cleanly (`python -c "import app.main"`).
- Compose: `docker compose config` must validate.
- Explain any new dependency in the PR / commit message.
