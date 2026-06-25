"""Model catalog + prediction routes.

The catalog here is a small, static mirror of the frontend's models.json so the API
can serve model metadata independently. Keep the two in sync when adding real models.
"""
from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.models import ModelInfo, DemoPredictInput, DemoPredictResult
from app.schemas.kawasaki import KawasakiInput, KawasakiResult
from app.services.demo_model import run_demo_prediction
from app.services import kawasaki_ivig, kawasaki_import

_MAX_UPLOAD_BYTES = 2_000_000

router = APIRouter(prefix="/api", tags=["models"])

_RESEARCH_DISCLAIMER = (
    "This tool is intended for research and educational use only. It is not a "
    "substitute for professional medical judgment, diagnosis, or treatment."
)

_MODEL_CATALOG = [
    ModelInfo(
        id="plan-c",
        name="PLAN-C Compass",
        status="Available",
        version="v1.0.0",
        disclaimer=_RESEARCH_DISCLAIMER,
    ),
    ModelInfo(
        id="kawasaki-ivig",
        name="Kawasaki_IVIG",
        status="Prototype",
        version=kawasaki_ivig.MODEL_VERSION,
        disclaimer=_RESEARCH_DISCLAIMER,
    ),
]


@router.get("/models", response_model=list[ModelInfo])
def list_models() -> list[ModelInfo]:
    return _MODEL_CATALOG


@router.post("/predict/demo", response_model=DemoPredictResult)
def predict_demo(payload: DemoPredictInput) -> DemoPredictResult:
    """Returns a clearly-labeled MOCK result. FastAPI/Pydantic validate and bound
    the input automatically; invalid input yields a 422 without leaking internals."""
    return run_demo_prediction(payload)


@router.post("/predict/kawasaki-ivig", response_model=KawasakiResult)
def predict_kawasaki_ivig(payload: KawasakiInput) -> KawasakiResult:
    """Single-patient IVIG non-response risk from the locked GradientBoosting pipeline.

    All inputs are de-identified pre-IVIG clinical features and are optional (the
    pipeline imputes missing values). Returns 503 if the ML artifact/runtime is
    unavailable, without leaking internal paths."""
    try:
        return kawasaki_ivig.run_prediction(payload)
    except kawasaki_ivig.ModelUnavailable:
        raise HTTPException(status_code=503, detail="Model temporarily unavailable.")


@router.post("/predict/kawasaki-ivig/import")
async def import_kawasaki_ivig(file: UploadFile = File(...)) -> dict:
    """Parse an uploaded Excel/CSV into the 44 de-identified model variables for the
    form to autofill (single patient). Identifier columns are ignored. Returns only
    recognized {feature: value} pairs; no prediction is run here."""
    content = await file.read()
    if len(content) > _MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large.")
    try:
        values = kawasaki_import.parse_upload(file.filename or "", content)
    except kawasaki_import.ImportParseError:
        raise HTTPException(status_code=422, detail="Could not parse the uploaded file.")
    return {"values": values, "n_parsed": len(values)}
