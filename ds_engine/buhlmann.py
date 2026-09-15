"""
Crédibilité actuarielle de Bühlmann-Straub.

Le facteur de crédibilité `Z = n / (n + k)` mesure la confiance accordée à
l'historique individuel : plus l'assuré a d'échéances passées, plus son propre
taux pèse face au taux de la cohorte. `Z` sature naturellement vers 1.
"""

from __future__ import annotations

from .config import CREDIBILITY_K


def calculate_buhlmann_factor(nb_echeances: float, k: float = CREDIBILITY_K) -> float:
    """Facteur de crédibilité Z dans [0, 1[ (0 si aucun historique exploitable)."""
    try:
        n = float(nb_echeances)
    except (TypeError, ValueError):
        return 0.0
    if not (n > 0):
        return 0.0
    return float(n / (n + float(k)))


def calculate_buhlmann_score(score_cohorte, moyenne_historique_indiv, nb_echeances, k: float = CREDIBILITY_K):
    """
    Pondération actuarielle dynamique de Bühlmann-Straub.

    Retourne `Z * historique_individuel + (1 - Z) * score_cohorte`.
    Si l'historique individuel est indisponible, seule la cohorte est utilisée.
    """
    cohorte = 0.0 if score_cohorte is None else float(score_cohorte)
    if moyenne_historique_indiv is None:
        return round(cohorte, 2)

    z = calculate_buhlmann_factor(nb_echeances, k=k)
    if z <= 0.0:
        return round(cohorte, 2)

    score_ajuste = (z * float(moyenne_historique_indiv)) + ((1.0 - z) * cohorte)
    return round(float(score_ajuste), 2)
