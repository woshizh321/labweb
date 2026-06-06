"""FastAPI application entrypoint (Phase-1 skeleton).

Endpoints:
  GET  /health             -> liveness probe
  GET  /api/models         -> model catalog metadata
  POST /api/predict/demo   -> MOCK prediction (clearly labeled, de-identified input)

Security posture: generic error messages only (no internal paths / tracebacks),
strict input validation via Pydantic, and CORS limited to the configured frontend.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import ALLOWED_ORIGINS, APP_NAME, APP_VERSION
from app.routers import models as models_router

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Backend API for the lab website. Research/educational use only.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(models_router.router)


@app.get("/health", tags=["system"])
def health() -> dict:
    return {"status": "ok", "service": APP_NAME, "version": APP_VERSION}


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Never leak server internals (paths, stack traces) to clients."""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error."},
    )
