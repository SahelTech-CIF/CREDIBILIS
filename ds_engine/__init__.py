"""
Moteur de décision Credibilis (hackathon CIF).

Expose l'API stable utilisée par le reste de l'application :

    from ds_engine import process_credit_application, predict_credibilis_score"""

from __future__ import annotations

from .buhlmann import calculate_buhlmann_factor, calculate_buhlmann_score
from .cohort_engine import find_cohort_metrics
from .config import SCHEMA_ALIASES, extract_concept, find_actual_column
from .credibility import calculate_3_tier_credibility
from .predictor import (
    predict_credibilis_score,
    process_credit_application,
    simulate_responsible_offer_flexible,
)

__all__ = [
    "SCHEMA_ALIASES",
    "calculate_3_tier_credibility",
    "calculate_buhlmann_factor",
    "calculate_buhlmann_score",
    "extract_concept",
    "find_actual_column",
    "find_cohort_metrics",
    "predict_credibilis_score",
    "process_credit_application",
    "simulate_responsible_offer_flexible",
]
