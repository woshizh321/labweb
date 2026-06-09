"""Pydantic schemas for the Kawasaki_IVIG non-response model (path B inference).

Privacy: every field below is a NON-identifying pre-IVIG clinical measurement.
No name, ID, MRN, phone, address, or full date of birth is ever accepted.
All fields are Optional — missing values are allowed and imputed inside the saved
scikit-learn pipeline using training-set rules (mirrors the original Streamlit tool).

The ascii field names here are mapped to the model's (Chinese) column names in
app/services/kawasaki_ivig.py. Bounds are abuse guards, intentionally wide; the
model itself still accepts and flags out-of-range values rather than rejecting them.
"""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Binary = Optional[Literal[0, 1]]


class KawasakiInput(BaseModel):
    model_config = ConfigDict(extra="forbid", protected_namespaces=())

    threshold_strategy: Literal["youden", "sens80"] = "youden"

    # --- Demographics ---
    sex: Optional[Literal["male", "female"]] = None
    age_years: Optional[float] = Field(None, ge=0, le=18)
    body_weight_kg: Optional[float] = Field(None, ge=1, le=120)
    height_cm: Optional[float] = Field(None, ge=30, le=220)

    # --- Vital signs / symptom duration ---
    fever_duration_days: Optional[float] = Field(None, ge=0, le=30)
    rash_duration_days: Optional[float] = Field(None, ge=0, le=30)
    pre_ivig_max_temp: Optional[float] = Field(None, ge=35, le=43)
    pre_ivig_fever_ge_38: Binary = None

    # --- Admission-note-derived symptoms (binary) ---
    conjunctival_injection: Binary = None
    cracked_lips: Binary = None
    strawberry_tongue: Binary = None
    oral_mucosal_change: Binary = None
    cervical_lymphadenopathy: Binary = None
    extremity_edema: Binary = None
    periungual_desquamation: Binary = None
    extremity_change: Binary = None
    rash: Binary = None
    classic_symptom_count: Optional[float] = Field(None, ge=0, le=6)

    # --- Laboratory tests (wide abuse-guard bounds) ---
    crp: Optional[float] = Field(None, ge=0, le=1000)
    wbc: Optional[float] = Field(None, ge=0, le=200)
    neutrophil_pct: Optional[float] = Field(None, ge=0, le=100)
    lymphocyte_pct: Optional[float] = Field(None, ge=0, le=100)
    hemoglobin: Optional[float] = Field(None, ge=0, le=300)
    platelet: Optional[float] = Field(None, ge=0, le=5000)
    albumin: Optional[float] = Field(None, ge=0, le=100)
    alt: Optional[float] = Field(None, ge=0, le=10000)
    ast: Optional[float] = Field(None, ge=0, le=10000)
    total_bilirubin: Optional[float] = Field(None, ge=0, le=1000)
    sodium: Optional[float] = Field(None, ge=100, le=180)
    procalcitonin: Optional[float] = Field(None, ge=0, le=1000)
    esr: Optional[float] = Field(None, ge=0, le=200)
    fibrinogen: Optional[float] = Field(None, ge=0, le=30)


class KawasakiResult(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    is_research_use: Literal[True] = True
    model_id: str
    model_version: str
    probability: float = Field(..., ge=0, le=1, description="Predicted IVIG non-response probability.")
    threshold_strategy: Literal["youden", "sens80"]
    threshold_used: float
    risk_label: Literal["higher_risk", "lower_risk"]
    risk_band: Literal["very_high", "above_youden", "above_sens80", "low"]
    n_provided: int = Field(..., ge=0, le=32)
    n_features: Literal[32] = 32
    completeness: float = Field(..., ge=0, le=1)
    disclaimer: str
