"""Pydantic schemas for the Kawasaki_IVIG non-response model (v2, 44 features).

Privacy: every field below is a NON-identifying pre-IVIG clinical measurement.
No name, ID, MRN, visit id, phone, address, or full date of birth is ever accepted.
All fields are Optional — missing values are allowed and imputed inside the saved
scikit-learn pipeline using training-set rules (mirrors the original Streamlit tool).

Field names equal the pipeline's column names. Bounds are abuse guards, intentionally
wide; the model still accepts and flags out-of-range values rather than rejecting them.
"""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

Binary = Optional[Literal[0, 1]]


class KawasakiInput(BaseModel):
    model_config = ConfigDict(extra="forbid", protected_namespaces=())

    # --- Demographics ---
    sex: Optional[Literal["male", "female"]] = None
    age_years: Optional[float] = Field(None, ge=0, le=18)

    # --- Course & temperature ---
    max_temp_pre_ivig: Optional[float] = Field(None, ge=30, le=45)
    fever_days_ivig: Optional[float] = Field(None, ge=0, le=60)
    rash_days_ivig: Optional[float] = Field(None, ge=0, le=60)

    # --- Symptoms (binary) ---
    rash: Binary = None
    conjunctival_injection: Binary = None
    strawberry_tongue: Binary = None
    cracked_lips: Binary = None
    oral_mucosal_change: Binary = None
    cervical_lymphadenopathy: Binary = None
    extremity_edema: Binary = None
    periungual_desquamation: Binary = None
    extremity_change: Binary = None

    # --- Complete blood count ---
    wbc: Optional[float] = Field(None, ge=0, le=200)
    neutrophil_percent: Optional[float] = Field(None, ge=0, le=100)
    lymphocyte_percent: Optional[float] = Field(None, ge=0, le=100)
    monocyte_percent: Optional[float] = Field(None, ge=0, le=100)
    hemoglobin: Optional[float] = Field(None, ge=0, le=300)
    platelet: Optional[float] = Field(None, ge=0, le=3000)

    # --- Inflammation ---
    crp: Optional[float] = Field(None, ge=0, le=1000)
    esr: Optional[float] = Field(None, ge=0, le=200)
    pct: Optional[float] = Field(None, ge=0, le=1000)
    ferritin: Optional[float] = Field(None, ge=0, le=100000)

    # --- Liver & bilirubin ---
    alt: Optional[float] = Field(None, ge=0, le=20000)
    ast: Optional[float] = Field(None, ge=0, le=20000)
    albumin: Optional[float] = Field(None, ge=0, le=100)
    total_bilirubin: Optional[float] = Field(None, ge=0, le=1000)
    direct_bilirubin: Optional[float] = Field(None, ge=0, le=1000)

    # --- Kidney ---
    creatinine: Optional[float] = Field(None, ge=0, le=2000)
    urea_nitrogen: Optional[float] = Field(None, ge=0, le=100)
    uric_acid: Optional[float] = Field(None, ge=0, le=2000)

    # --- Electrolytes ---
    sodium: Optional[float] = Field(None, ge=100, le=180)
    potassium: Optional[float] = Field(None, ge=0, le=15)

    # --- Coagulation ---
    pt: Optional[float] = Field(None, ge=0, le=200)
    aptt: Optional[float] = Field(None, ge=0, le=300)
    fibrinogen: Optional[float] = Field(None, ge=0, le=30)

    # --- Lymphocyte subsets ---
    cd4_t_count: Optional[float] = Field(None, ge=0, le=20000)
    cd8_t_count: Optional[float] = Field(None, ge=0, le=20000)
    cd4_cd8_ratio: Optional[float] = Field(None, ge=0, le=50)
    cd19_b_count: Optional[float] = Field(None, ge=0, le=20000)

    # --- Myocardial enzymes ---
    ldh: Optional[float] = Field(None, ge=0, le=50000)
    ck_mb: Optional[float] = Field(None, ge=0, le=10000)

    # --- Cardiac injury ---
    ntprobnp: Optional[float] = Field(None, ge=0, le=100000)


class KawasakiResult(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    is_research_use: Literal[True] = True
    model_id: str
    model_version: str
    probability: float = Field(..., ge=0, le=1, description="Predicted IVIG non-response probability.")
    threshold_used: float
    risk_label: Literal["higher_risk", "lower_risk"]
    risk_band: Literal["high", "elevated", "low"]
    n_provided: int = Field(..., ge=0, le=44)
    n_features: Literal[44] = 44
    completeness: float = Field(..., ge=0, le=1)
    disclaimer: str
