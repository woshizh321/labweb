"""Demo (MOCK) prediction service.

This is a deterministic placeholder, NOT a trained model. It exists only to prove
the request/response contract for the future real models. Real model artifacts will
later be loaded from backend/model_artifacts/ and replace this function — without
changing the API schema.
"""
from app.schemas.models import DemoPredictInput, DemoPredictResult

DEMO_MODEL_ID = "demo"
DEMO_MODEL_VERSION = "v0.0.0-mock"

DISCLAIMER = (
    "This result is a mock output for demonstration only. It is not produced by a "
    "validated model and must not be used for diagnosis or treatment decisions."
)


def run_demo_prediction(payload: DemoPredictInput) -> DemoPredictResult:
    # Simple bounded transform — purely illustrative, no clinical meaning.
    raw = (payload.age_years / 120.0) * 0.4 + (payload.biomarker_a / 1000.0) * 0.3 + (
        payload.biomarker_b / 1000.0
    ) * 0.3
    score = round(min(max(raw, 0.0), 1.0), 3)
    band = "low" if score < 0.34 else "moderate" if score < 0.67 else "high"

    return DemoPredictResult(
        model_id=DEMO_MODEL_ID,
        model_version=DEMO_MODEL_VERSION,
        risk_score=score,
        risk_band=band,
        interpretation=(
            "Illustrative composite of the supplied de-identified features. "
            "For research/educational demonstration of the API only."
        ),
        disclaimer=DISCLAIMER,
    )
