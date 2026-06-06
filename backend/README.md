# Backend (FastAPI)

Phase-1 skeleton for the lab website API. No database, no auth, no real model inference yet.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness probe |
| GET | `/api/models` | Model catalog metadata |
| POST | `/api/predict/demo` | **MOCK** prediction (clearly labeled `is_mock: true`) |

## Local development

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

## Demo prediction (de-identified input only)

```bash
curl -X POST http://localhost:8000/api/predict/demo \
  -H "Content-Type: application/json" \
  -d '{"age_years": 60, "biomarker_a": 120, "biomarker_b": 80}'
```

The endpoint accepts **only** non-identifying numeric features and rejects unknown
fields (`extra: forbid`). It never requests name, ID, phone, full DOB, or medical
record numbers. The response is always flagged `is_mock: true`.

## Structure

```
app/
├── main.py          # app + middleware + /health + error handler
├── config.py        # env-driven config (CORS, names)
├── routers/         # API routes (models.py)
├── schemas/         # Pydantic input/output models
├── services/        # business logic (demo_model.py — replace with real inference)
└── utils/
model_artifacts/     # reserved for trained weights (do not delete)
```

## Adding a real model later

1. Drop the artifact into `model_artifacts/`.
2. Add a service in `services/` that loads it and implements `run_*_prediction`.
3. Add a typed schema in `schemas/` and a route in `routers/`.
4. Keep the research-use disclaimer and `is_mock`/version fields in the response.
