"""Model catalog + demo prediction routes.

The catalog here is a small, static mirror of the frontend's models.json so the API
can serve model metadata independently. Keep the two in sync when adding real models.
"""
from fastapi import APIRouter
from app.schemas.models import ModelInfo, DemoPredictInput, DemoPredictResult
from app.services.demo_model import run_demo_prediction

router = APIRouter(prefix="/api", tags=["models"])

_RESEARCH_DISCLAIMER = (
    "This tool is intended for research and educational use only. It is not a "
    "substitute for professional medical judgment, diagnosis, or treatment."
)

_MODEL_CATALOG = [
    ModelInfo(
        id="plan-c",
        name="PLAN-C Calculator",
        status="Coming soon",
        version="v0.1.0-draft",
        disclaimer=_RESEARCH_DISCLAIMER,
    ),
    ModelInfo(
        id="diki-risk",
        name="DIKI Risk Predictor",
        status="Prototype",
        version="v0.2.0-prototype",
        disclaimer=_RESEARCH_DISCLAIMER,
    ),
    ModelInfo(
        id="ici-hepatobiliary",
        name="ICI Hepatobiliary Toxicity Explorer",
        status="Available",
        version="v1.0.0",
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
