"""Kawasaki_IVIG non-response inference service (path B, v2 = 44 features).

Loads the locked scikit-learn pipeline (preprocessing + GradientBoosting) once and
serves single-patient predictions. Faithfully reproduces the upgraded Streamlit tool:
build a 1-row frame with the 44 model columns in order, missing -> NaN (the pipeline
imputes), map sex male/female -> 男/女, binaries -> 0/1, predict_proba[:, positive],
then compare against the locked Youden threshold (training nested OOF).

The artifact is research-use only and not externally validated; every response carries
the disclaimer.
"""
from __future__ import annotations

import csv
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.schemas.kawasaki import KawasakiInput, KawasakiResult

MODEL_ID = "kawasaki-ivig"
MODEL_VERSION = "v2.0.0"

_ARTIFACT_DIR = Path(__file__).resolve().parents[2] / "model_artifacts" / "kawasaki_ivig"
_PIPELINE_PATH = _ARTIFACT_DIR / "locked_final_model_pipeline.joblib"
_THRESHOLD_PATH = _ARTIFACT_DIR / "selected_model_thresholds.csv"

DISCLAIMER = (
    "Research-use prototype. This model predicts IVIG non-response risk in Kawasaki "
    "disease from retrospective, single-centre data and has NOT been externally or "
    "prospectively validated. It is a research risk-stratification aid, not a diagnostic "
    "test, and must not replace clinician judgment or be used as a standalone decision "
    "system."
)

# Canonical column order expected by the pipeline (clinical_tool_summary.json "features").
FEATURES: list[str] = [
    "age_years", "max_temp_pre_ivig", "sex",
    "rash", "conjunctival_injection", "strawberry_tongue", "cracked_lips",
    "oral_mucosal_change", "cervical_lymphadenopathy", "extremity_edema",
    "periungual_desquamation", "extremity_change",
    "lymphocyte_percent", "platelet", "wbc", "neutrophil_percent", "hemoglobin",
    "crp", "ast", "albumin", "direct_bilirubin", "total_bilirubin", "alt",
    "creatinine", "uric_acid", "urea_nitrogen", "sodium", "potassium",
    "monocyte_percent", "fever_days_ivig", "aptt", "pt", "fibrinogen", "esr",
    "cd4_t_count", "cd8_t_count", "cd4_cd8_ratio", "cd19_b_count", "pct",
    "ferritin", "ldh", "ck_mb", "rash_days_ivig", "ntprobnp",
]

_BINARY = {
    "rash", "conjunctival_injection", "strawberry_tongue", "cracked_lips",
    "oral_mucosal_change", "cervical_lymphadenopathy", "extremity_edema",
    "periungual_desquamation", "extremity_change",
}
_SEX_MAP = {"male": "男", "female": "女"}


class ModelUnavailable(RuntimeError):
    """Raised when the artifact or its ML dependencies cannot be loaded."""


@lru_cache(maxsize=1)
def _youden_threshold() -> float:
    with _THRESHOLD_PATH.open(encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            if row.get("threshold_strategy") == "youden":
                return float(row["threshold"])
    raise ModelUnavailable("Youden threshold not found")


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
    return int(np.argmax(classes))


def _risk_band(p: float, th: float) -> str:
    if p >= 0.5:
        return "high"
    if p >= th:
        return "elevated"
    return "low"


def warmup() -> bool:
    """Best-effort eager load at startup; never raises (keeps the app booting)."""
    try:
        _pipeline()
        _positive_index()
        _youden_threshold()
        return True
    except Exception:
        return False


def run_prediction(payload: KawasakiInput) -> KawasakiResult:
    import numpy as np
    import pandas as pd

    pipe = _pipeline()  # raises ModelUnavailable -> handled by the router as 503
    th = _youden_threshold()

    supplied = payload.model_dump()
    n_provided = sum(1 for v in supplied.values() if v is not None)

    row: dict[str, Any] = {col: np.nan for col in FEATURES}
    for key, value in supplied.items():
        if value is None:
            continue
        if key == "sex":
            row[key] = _SEX_MAP.get(value, value)
        elif key in _BINARY:
            row[key] = float(value)
        else:
            row[key] = float(value)

    frame = pd.DataFrame([row], columns=FEATURES)
    for col in FEATURES:
        if col != "sex":
            frame[col] = pd.to_numeric(frame[col], errors="coerce").astype(float)

    probability = float(pipe.predict_proba(frame)[:, _positive_index()][0])

    return KawasakiResult(
        model_id=MODEL_ID,
        model_version=MODEL_VERSION,
        probability=round(probability, 4),
        threshold_used=round(th, 4),
        risk_label="higher_risk" if probability >= th else "lower_risk",
        risk_band=_risk_band(probability, th),
        n_provided=n_provided,
        completeness=round(n_provided / len(FEATURES), 3),
        disclaimer=DISCLAIMER,
    )
