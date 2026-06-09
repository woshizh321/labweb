"""Kawasaki_IVIG non-response inference service (path B).

Loads the locked scikit-learn pipeline (preprocessing + GradientBoosting) once and
serves single-patient predictions. This faithfully reproduces the original Streamlit
tool's assembly: build a 1-row frame with the 32 model columns in order, missing ->
NaN (the pipeline imputes), predict_proba[:, positive], then apply the locked
thresholds (Youden / sensitivity-oriented) read from clinical_tool_summary.json.

The artifact is research-use only and not externally validated; every response
carries the disclaimer.
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

from app.schemas.kawasaki import KawasakiInput, KawasakiResult

MODEL_ID = "kawasaki-ivig"
MODEL_VERSION = "v1.0.0"

_ARTIFACT_DIR = Path(__file__).resolve().parents[2] / "model_artifacts" / "kawasaki_ivig"
_PIPELINE_PATH = _ARTIFACT_DIR / "locked_final_model_pipeline.joblib"
_SUMMARY_PATH = _ARTIFACT_DIR / "clinical_tool_summary.json"

DISCLAIMER = (
    "Research-use prototype. This model predicts IVIG non-response risk in Kawasaki "
    "disease and has not been externally or temporally validated. It is a risk-"
    "stratification aid (high negative predictive value), not a diagnostic test, and "
    "must not replace clinician judgment or be used as a standalone decision system."
)

# Order matters: the pipeline's ColumnTransformer expects these exact column names.
FEATURES: list[str] = [
    "性别", "年龄（岁）", "体重(kg)", "身高(cm)",
    "text_fever_duration_days", "text_rash_duration_days",
    "pre_ivig_max_temp", "pre_ivig_fever_ge_38",
    "text_conjunctival_injection", "text_cracked_lips", "text_strawberry_tongue",
    "text_oral_mucosal_change", "text_cervical_lymphadenopathy", "text_extremity_edema",
    "text_periungual_desquamation", "text_extremity_change", "text_rash",
    "text_classic_symptom_count",
    "crp", "wbc", "neutrophil_pct", "lymphocyte_pct", "hemoglobin", "platelet",
    "albumin", "alt", "ast", "total_bilirubin", "sodium", "pct", "esr", "fibrinogen",
]

# ascii schema field -> model column name
_KEY_TO_COLUMN: dict[str, str] = {
    "sex": "性别",
    "age_years": "年龄（岁）",
    "body_weight_kg": "体重(kg)",
    "height_cm": "身高(cm)",
    "fever_duration_days": "text_fever_duration_days",
    "rash_duration_days": "text_rash_duration_days",
    "pre_ivig_max_temp": "pre_ivig_max_temp",
    "pre_ivig_fever_ge_38": "pre_ivig_fever_ge_38",
    "conjunctival_injection": "text_conjunctival_injection",
    "cracked_lips": "text_cracked_lips",
    "strawberry_tongue": "text_strawberry_tongue",
    "oral_mucosal_change": "text_oral_mucosal_change",
    "cervical_lymphadenopathy": "text_cervical_lymphadenopathy",
    "extremity_edema": "text_extremity_edema",
    "periungual_desquamation": "text_periungual_desquamation",
    "extremity_change": "text_extremity_change",
    "rash": "text_rash",
    "classic_symptom_count": "text_classic_symptom_count",
    "crp": "crp", "wbc": "wbc", "neutrophil_pct": "neutrophil_pct",
    "lymphocyte_pct": "lymphocyte_pct", "hemoglobin": "hemoglobin", "platelet": "platelet",
    "albumin": "albumin", "alt": "alt", "ast": "ast", "total_bilirubin": "total_bilirubin",
    "sodium": "sodium", "procalcitonin": "pct", "esr": "esr", "fibrinogen": "fibrinogen",
}

_SEX_MAP = {"male": "男性", "female": "女性"}


class ModelUnavailable(RuntimeError):
    """Raised when the artifact or its ML dependencies cannot be loaded."""


@lru_cache(maxsize=1)
def _thresholds() -> dict[str, float]:
    data = json.loads(_SUMMARY_PATH.read_text(encoding="utf-8"))["thresholds"]
    return {"youden": float(data["youden"]), "sens80": float(data["sens80"])}


@lru_cache(maxsize=1)
def _pipeline():
    try:
        import joblib  # imported lazily so /health works even without ML deps
    except Exception as exc:  # pragma: no cover
        raise ModelUnavailable("ML runtime not installed") from exc
    if not _PIPELINE_PATH.exists():
        raise ModelUnavailable("Model artifact missing")
    try:
        return joblib.load(_PIPELINE_PATH)
    except Exception as exc:
        raise ModelUnavailable("Model artifact failed to load") from exc


@lru_cache(maxsize=1)
def _positive_index() -> int:
    """Index of the positive (IVIG non-response == 1) class in predict_proba."""
    import numpy as np

    classes = list(getattr(_pipeline(), "classes_", [0, 1]))
    for target in (1, 1.0, "1", True):
        if target in classes:
            return classes.index(target)
    return int(np.argmax(classes))  # fallback: highest-coded class


def _risk_band(p: float, th: dict[str, float]) -> str:
    if p >= 0.15:
        return "very_high"
    if p >= th["youden"]:
        return "above_youden"
    if p >= th["sens80"]:
        return "above_sens80"
    return "low"


def warmup() -> bool:
    """Best-effort eager load at startup; never raises (keeps the app booting)."""
    try:
        _pipeline()
        _positive_index()
        return True
    except Exception:
        return False


def run_prediction(payload: KawasakiInput) -> KawasakiResult:
    import numpy as np
    import pandas as pd

    pipe = _pipeline()  # raises ModelUnavailable -> handled by the router as 503
    th = _thresholds()

    supplied = payload.model_dump(exclude={"threshold_strategy"})
    n_provided = sum(1 for v in supplied.values() if v is not None)

    row: dict[str, Any] = {col: np.nan for col in FEATURES}
    for key, value in supplied.items():
        if value is None:
            continue
        col = _KEY_TO_COLUMN[key]
        if key == "sex":
            row[col] = _SEX_MAP.get(value, value)
        else:
            row[col] = float(value)

    frame = pd.DataFrame([row], columns=FEATURES)
    # Numeric columns to float (the single categorical '性别' stays object).
    for col in FEATURES:
        if col != "性别":
            frame[col] = pd.to_numeric(frame[col], errors="coerce").astype(float)

    probability = float(pipe.predict_proba(frame)[:, _positive_index()][0])
    strategy = payload.threshold_strategy
    threshold_used = th["sens80"] if strategy == "sens80" else th["youden"]

    return KawasakiResult(
        model_id=MODEL_ID,
        model_version=MODEL_VERSION,
        probability=round(probability, 4),
        threshold_strategy=strategy,
        threshold_used=round(threshold_used, 4),
        risk_label="higher_risk" if probability >= threshold_used else "lower_risk",
        risk_band=_risk_band(probability, th),
        n_provided=n_provided,
        completeness=round(n_provided / len(FEATURES), 3),
        disclaimer=DISCLAIMER,
    )
