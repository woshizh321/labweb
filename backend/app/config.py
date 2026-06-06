"""Minimal app configuration. No secrets are hardcoded here; runtime values come
from environment variables (see .env.example at the repo root)."""
import os

# CORS origins for the frontend. Comma-separated env override for production.
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")

APP_NAME = "Lab Website API"
APP_VERSION = "0.1.0"
