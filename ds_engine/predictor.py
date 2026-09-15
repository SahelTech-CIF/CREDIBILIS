"""
Point d'entrée d'inférence Credibilis.

API publique :
    * `process_credit_application(raw_data)` : décision complète pour un dossier ;
    * `predict_credibilis_score(raw_data)`   : alias historique de la même fonction
      (conservé pour la compatibilité des intégrations existantes).

Principe directeur : ce module ne lève JAMAIS d'exception. Toute information
manquante se traduit par une dégradation explicite et traçable (`qualite_donnees`,
`modeles_utilises`) plutôt que par un plantage.
"""

from __future__ import annotations
import os
import sys
from typing import Optional
import numpy as np
import pandas as pd

try:  # exécution en paquet : import relatif
    from .cohort_engine import find_cohort_metrics
    from .config import (
        DATA_CSV_PATH,
        DEBT_RATIO_MAX,
        DEBT_RATIO_TARGET,
        MIN_LOAN_AMOUNT,
        MODEL_PATH,
        SCORE_ACCEPT_THRESHOLD,
        extract_concept,
    )
    from .credibility import calculate_3_tier_credibility
except ImportError:  # exécution directe du script : import absolu
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from cohort_engine import find_cohort_metrics  # type: ignore[no-redef]
    from config import (  # type: ignore[no-redef]
        DATA_CSV_PATH,
        DEBT_RATIO_MAX,
        DEBT_RATIO_TARGET,
        MIN_LOAN_AMOUNT,
        MODEL_PATH,
        SCORE_ACCEPT_THRESHOLD,
        extract_concept,
    )
    from credibility import calculate_3_tier_credibility  # type: ignore[no-redef]

# Chargement paresseux : le CSV peut être (re)généré après l'import du module.
_HISTORICAL_DB: Optional[pd.DataFrame] = None
_MODEL_BUNDLE = None
_MODEL_LOADED = False


def _load_historical_db() -> pd.DataFrame:
    """Charge (et met en cache) le CSV historique. Retourne un DataFrame vide si absent."""
    global _HISTORICAL_DB
    if _HISTORICAL_DB is not None and not _HISTORICAL_DB.empty:
        return _HISTORICAL_DB
    try:
        if os.path.exists(DATA_CSV_PATH):
            _HISTORICAL_DB = pd.read_csv(DATA_CSV_PATH)
        else:
            _HISTORICAL_DB = pd.DataFrame()
    except Exception:
        _HISTORICAL_DB = pd.DataFrame()
    return _HISTORICAL_DB


def _load_model():
    """Charge le modèle LightGBM s'il existe. Un échec n'est jamais bloquant."""
    global _MODEL_BUNDLE, _MODEL_LOADED
    if _MODEL_LOADED:
        return _MODEL_BUNDLE
    _MODEL_LOADED = True
    try:
        if os.path.exists(MODEL_PATH):
            import joblib

            bundle = joblib.load(MODEL_PATH)
            _MODEL_BUNDLE = bundle if isinstance(bundle, dict) else {"model": bundle}
    except Exception:
        _MODEL_BUNDLE = None
    return _MODEL_BUNDLE


def _model_probability(raw_data: dict, bundle: dict) -> Optional[float]:
    """
    Probabilité de bon remboursement prédite par LightGBM, ou None si le modèle
    n'est pas exploitable pour ce dossier (modèle absent, features manquantes...).
    """
    model = bundle.get("model") if isinstance(bundle, dict) else None
    features = bundle.get("features") if isinstance(bundle, dict) else None
    if model is None or not features:
        return None

    row = {}
    for col in features:
        value = raw_data.get(col)
        if value is None:
            for concept in ("revenu", "charges", "montant", "duree", "echeances_payees", "taux_indiv"):
                fetched = extract_concept(raw_data, concept, default=None)
                if fetched is not None and col.lower().startswith(concept[:3]):
                    value = fetched
                    break
        row[col] = value if value is not None else np.nan

    try:
        frame = pd.DataFrame([row])
        for col, levels in (bundle.get("categorical_levels") or {}).items():
            if col in frame.columns:
                frame[col] = pd.Categorical(frame[col], categories=levels)
        proba = model.predict_proba(frame)[0][1]
        return float(proba)
    except Exception:
        return None


def simulate_responsible_offer_flexible(data: dict, score: float) -> dict:
    """
    Propose un rééchelonnement responsable plutôt qu'un simple refus.

    Retourne `{}` quand l'offre demandée est soutenable, sinon un dictionnaire
    `{montant_recommande, duree_recommandee_mois, motif}`. Le motif explique aussi
    les cas où aucune simulation n'est possible.
    """
    revenu = extract_concept(data, "revenu", default=None)
    charges = extract_concept(data, "charges", default=0)
    montant = extract_concept(data, "montant", default=None)
    duree = extract_concept(data, "duree", default=None)

    if revenu is None or montant is None or duree is None or duree <= 0 or montant <= 0:
        return {"motif": "Données économiques insuffisantes pour simuler une offre."}

    capacite_mensuelle = revenu - charges
    if capacite_mensuelle <= 0:
        return {"motif": "Capacité de remboursement estimée négative ou nulle."}

    mensualite_demandee = montant / duree
    if mensualite_demandee > (capacite_mensuelle * DEBT_RATIO_MAX) or score < SCORE_ACCEPT_THRESHOLD:
        nouvelle_duree = int(duree + 3)
        nouveau_montant = min(montant, max(MIN_LOAN_AMOUNT, capacite_mensuelle * DEBT_RATIO_TARGET * nouvelle_duree))
        return {
            "montant_recommande": int(nouveau_montant),
            "duree_recommandee_mois": nouvelle_duree,
            "motif": "Rallongement recommandé (endettement tendu).",
        }
    return {}


def process_credit_application(raw_data: dict) -> dict:
    """
    Évalue un dossier de crédit et retourne la décision Credibilis.

    Le résultat contient toujours `id_client` et `decision`. En cas de données
    insuffisantes la fonction retourne une décision d'abstention motivée ; en cas
    d'imprévu technique complet elle retourne `ERREUR_SYSTEME` sans lever.
    """
    try:
        if not isinstance(raw_data, dict):
            raw_data = dict(raw_data or {})

        client_id = extract_concept(raw_data, "id", default="INCONNU")

        nb_echeances = extract_concept(raw_data, "echeances_payees", default=0)
        taux_indiv = extract_concept(raw_data, "taux_indiv", default=None)
        jours_dernier_pret = extract_concept(raw_data, "jours_depuis_dernier_pret", default=30)

        historique = _load_historical_db()
        taille_cohorte, taux_cohorte, stabilite = find_cohort_metrics(raw_data, historique)

        modeles_utilises = ["cohorte_gower"]
        qualite = {
            "taille_cohorte": int(taille_cohorte),
            "stabilite_cohorte": round(float(stabilite), 3),
            "historique_chargé": not historique.empty,
        }

        # Cohorte indisponible ET aucun historique individuel : rien sur quoi statuer.
        if taille_cohorte < 1 and taux_indiv is None:
            return {
                "id_client": client_id,
                "decision": "ABSTENTION",
                "motif": "Aucune cohorte comparable et aucun historique individuel exploitable.",
                "qualite_donnees": qualite,
                "modeles_utilises": modeles_utilises,
            }

        if taux_indiv is None:
            taux_indiv_effectif = taux_cohorte
        else:
            taux_indiv_effectif = taux_indiv

        cred_result = calculate_3_tier_credibility(
            taux_indiv=taux_indiv_effectif,
            nb_echeances=int(max(0, nb_echeances)) if nb_echeances else 0,
            taux_cohorte=taux_cohorte,
            jours_depuis_dernier_pret=int(jours_dernier_pret),
        )

        score = float(cred_result["score_sur_100"])

        # Apport analytique optionnel du modèle LightGBM (jamais bloquant).
        score_modele = None
        bundle = _load_model()
        if bundle:
            proba = _model_probability(raw_data, bundle)
            if proba is not None:
                score_modele = round(proba * 100, 2)
                modeles_utilises.append("lightgbm")

        alternative = simulate_responsible_offer_flexible(raw_data, score)
        has_alternative = bool(alternative.get("montant_recommande"))

        if score >= SCORE_ACCEPT_THRESHOLD and not has_alternative:
            decision = "ACCORDÉ"
        elif has_alternative:
            decision = "SOUMIS À CONDITIONS"
        else:
            decision = "REFUSÉ"

        result = {
            "id_client": client_id,
            "decision": decision,
            "score_credibilis": score,
            "poids_decision": cred_result,
            "offre_alternative": alternative if has_alternative else None,
            "taux_cohorte": round(float(taux_cohorte), 4),
            "qualite_donnees": qualite,
            "modeles_utilises": modeles_utilises,
        }
        if score_modele is not None:
            result["score_modele_lightgbm"] = score_modele
        return result
    except Exception as exc:  # dernier rempart : jamais d'exception vers l'appelant
        return {
            "id_client": "INCONNU",
            "decision": "ERREUR_SYSTEME",
            "motif": f"Architecture adaptative a intercepté : {exc}",
        }


# Alias rétro-compatible : d'anciennes intégrations importent ce nom.
predict_credibilis_score = process_credit_application

__all__ = ["process_credit_application", "predict_credibilis_score", "simulate_responsible_offer_flexible"]
