"""
Répartition de la crédibilité sur 3 niveaux : Individuel / Cohorte locale / Réseau.

Le poids de l'historique individuel n'est plus une formule ad hoc : il découle du
facteur de crédibilité de Bühlmann-Straub (`buhlmann.calculate_buhlmann_factor`),
plafonné par `CREDIBILITY_W_IND_CAP` pour ne jamais scorer un dossier sur son seul
passé. Le reste du poids se partage entre la cohorte locale et le réseau.
"""

from __future__ import annotations

import numpy as np

from .buhlmann import calculate_buhlmann_factor
from .config import (
    CREDIBILITY_LOCAL_SHARE,
    CREDIBILITY_W_IND_CAP,
    NETWORK_RATE,
)


def _safe_rate(value, default: float = NETWORK_RATE) -> float:
    """Convertit une entrée en taux [0, 1] en neutralisant None/NaN/texte."""
    try:
        val = float(value)
    except (TypeError, ValueError):
        return default
    if not np.isfinite(val):
        return default
    return float(np.clip(val, 0.0, 1.0))


def calculate_3_tier_credibility(
    taux_indiv: float,
    nb_echeances: int,
    taux_cohorte: float,
    taux_reseau: float = NETWORK_RATE,
    jours_depuis_dernier_pret: int = 30,
) -> dict:
    """
    Répartit le risque sur 3 niveaux selon la maturité de l'emprunteur,
    avec décroissance temporelle pour les historiques trop anciens.

    Ne lève jamais d'exception : toute donnée manquante ou aberrante est ramenée
    à la valeur du réseau, ce qui garantit un score exploitable.
    """
    # 1. Décroissance temporelle (Time Decay) : un historique ancien pèse moins.
    try:
        anciennete = float(jours_depuis_dernier_pret)
    except (TypeError, ValueError):
        anciennete = 30.0
    facteur_memoire = 1.0
    if anciennete > 365:
        facteur_memoire = max(0.5, 365.0 / anciennete)

    # 2. Pondération dynamique via la crédibilité de Bühlmann.
    try:
        nb_valides = max(0.0, float(nb_echeances or 0))
    except (TypeError, ValueError):
        nb_valides = 0.0
    echeances_effectives = nb_valides * facteur_memoire
    w_ind = min(calculate_buhlmann_factor(echeances_effectives), CREDIBILITY_W_IND_CAP)
    reste = 1.0 - w_ind
    w_local = reste * CREDIBILITY_LOCAL_SHARE
    w_reseau = reste * (1.0 - CREDIBILITY_LOCAL_SHARE)

    t_indiv = _safe_rate(taux_indiv, default=taux_cohorte)
    t_local = _safe_rate(taux_cohorte)
    t_reseau = _safe_rate(taux_reseau)

    score_final = (w_ind * t_indiv) + (w_local * t_local) + (w_reseau * t_reseau)

    return {
        "score_sur_100": round(float(score_final * 100), 2),
        "w_ind_pct": round(w_ind * 100, 1),
        "w_local_pct": round(w_local * 100, 1),
        "w_reseau_pct": round(w_reseau * 100, 1),
        "facteur_memoire": round(facteur_memoire, 2),
    }
