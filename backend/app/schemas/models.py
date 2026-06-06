"""Pydantic schemas for the model catalog and the demo prediction endpoint.

Privacy note: the demo prediction input intentionally accepts ONLY non-identifying
numeric/categorical research features. It must never request name, ID number,
phone, full date of birth, medical record number, or any personal identifier.
"""
from typing import Literal
from pydantic import BaseModel, Field


class ModelInfo(BaseModel):
    id: str
    name: str
    status: Literal["Coming soon", "Prototype", "Available"]
    version: str
    disclaimer: str


class DemoPredictInput(BaseModel):
    """Generic, de-identified demo input. Bounded to prevent abuse / nonsense values."""

    model_config = {"extra": "forbid"}  # reject unexpected fields (e.g. sneaked PII)

    age_years: float = Field(..., ge=0, le=120, description="Age in years (de-identified).")
    biomarker_a: float = Field(..., ge=0, le=1000, description="Generic research biomarker A.")
    biomarker_b: float = Field(..., ge=0, le=1000, description="Generic research biomarker B.")


class DemoPredictResult(BaseModel):
    is_mock: Literal[True] = True
    model_id: str
    model_version: str
    risk_score: float = Field(..., ge=0, le=1)
    risk_band: Literal["low", "moderate", "high"]
    interpretation: str
    disclaimer: str
