"""
Configuration centrale du moteur Credibilis (hackathon CIF).
Ce module est le SEUL endroit où l'on décrit :
  * le schéma attendu (`SCHEMA_ALIASES`) et donc la tolérance aux renommages de
    colonnes le jour J ;
  * les seuils métiers / paramètres de modélisation ;
  * les chemins des artefacts (CSV historique, modèle LightGBM).

Aucun autre module ne doit hardcoder un nom de colonne, un seuil magique ou un
chemin relatif au répertoire courant.
"""


from __future__ import annotations
import os
from typing import Iterable, Optional
import numpy as np
import pandas as pd
# ---------------------------------------------------------------------------
# Chemins (toujours calculés relativement à ce fichier : insensible au CWD)
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DS_ENGINE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_CSV_PATH = os.path.join(BASE_DIR, "donnees_fictives_credibilis.csv")
MODEL_PATH = os.path.join(DS_ENGINE_DIR, "scoring_lightgbm.pkl")

# ---------------------------------------------------------------------------
# Schéma : concept métier -> liste d'alias de colonnes acceptés
# ---------------------------------------------------------------------------
SCHEMA_ALIASES = {
    "id": ["id_client", "customer_id", "ID", "client_id", "identifiant", "id"],
    "target": ["taux_remboursement_final", "target", "default_rate", "status", "label"],
    "revenu": ["revenu_mensuel", "income", "chiffre_affaire", "salaire", "revenus", "monthly_income"],
    "charges": ["charges_mensuelles", "expenses", "depenses", "charges", "monthly_expenses"],
    "montant": ["montant_demande", "loan_amount", "credit", "montant"],
    "duree": ["duree_mois", "term", "duration", "duree", "loan_term"],
    "echeances_payees": ["historique_echeances", "paid_installments", "anciens_prets", "echeances_remboursees"],
    "taux_indiv": ["taux_remboursement_indiv", "individual_rate", "historique_taux", "moyenne_remboursement_indiv"],
    "jours_depuis_dernier_pret": ["jours_depuis_dernier_pret", "recency_days", "jours_dernier_pret"],
}

# Colonnes à ne JAMAIS utiliser comme variables explicatives.
NON_FEATURE_CONCEPTS = ("id", "target")

# ---------------------------------------------------------------------------
# Paramètres métier / modèle (toute la "magie" des nombres est ici)
# ---------------------------------------------------------------------------
COHORT_RADIUS = 0.25               # rayon de Gower sous lequel un client est "semblable"
COHORT_MIN_SIZE = 5                # en dessous : cohorte statistiquement faible
COHORT_FALLBACK_K = 30             # repli : K plus proches voisins si le rayon est trop pauvre
COHORT_MIN_FEATURE_COVERAGE = 0.3  # part minimale de features comparables exigée
SMOOTHING_M = 10.0                 # lissage bayésien de la moyenne de cohorte
NETWORK_RATE = 0.75                # taux de remboursement moyen du réseau (a priori)
DEFAULT_STABILITY = 0.8            # stabilité attribuée par défaut
# Pondération de crédibilité (Bühlmann-Straub)
CREDIBILITY_K = 12.0               # constante "k" du facteur Z = n / (n + k)
CREDIBILITY_W_IND_CAP = 0.70       # plafond du poids individuel
CREDIBILITY_LOCAL_SHARE = 0.80     # part du poids restant allouée à la cohorte locale
# Décision
TARGET_GOOD_THRESHOLD = 0.80       # taux >= seuil => bon payeur (étiquette d'entraînement)
SCORE_ACCEPT_THRESHOLD = 65.0      # score suffisant pour un accord sec
DEBT_RATIO_MAX = 0.40              # mensualité / capacité maximale tolérée
DEBT_RATIO_TARGET = 0.35           # cible en cas de rééchelonnement
MIN_LOAN_AMOUNT = 10000            # montant plancher d'une offre
# ---------------------------------------------------------------------------
# Utilitaires d'extraction (tolérants aux données sales)
# ---------------------------------------------------------------------------
def _lookup_ci(data: dict, key: str):
    """
    Récupère `key` en ignorant la casse et les espaces résiduels.
    """
    if not isinstance(data, dict):
        return None
    if key in data:
        return data[key]
    cible = key.strip().lower()
    for k, v in data.items():
        if isinstance(k, str) and k.strip().lower() == cible:
            return v
    return None

def to_float(value, default: Optional[float] = None) -> Optional[float]:
    """
    Conversion numérique tolérante : None/NaN/''/'-'/'N/A'/'1 200,50' -> default.
    """
    if value is None:
        return default
    if isinstance(value, (bool, np.bool_)):
        return float(value)
    if isinstance(value, (int, float, np.integer, np.floating)):
        val = float(value)
        return default if not np.isfinite(val) else val
    if isinstance(value, str):
        txt = value.strip().replace("\u00a0", "").replace(" ", "")
        if txt == "" or txt.lower() in {"nan", "none", "null", "n/a", "na", "-", "?"}:
            return default
        if "," in txt and "." not in txt:  # format français 1200,50
            txt = txt.replace(",", ".")
        txt = txt.replace(",", "")         # séparateur de milliers
        txt = txt.rstrip("%")
        try:
            val = float(txt)
        except (TypeError, ValueError):
            return default
        return default if not np.isfinite(val) else val
    return default

def to_int(value, default: int = 0) -> int:
    val = to_float(value, default=None)
    return default if val is None else int(round(val))


def find_actual_column(columns: Iterable[str], concept: str) -> Optional[str]:
    """
    Retourne la première colonne de `columns` correspondant à un alias du concept.
    """
    columns = list(columns)
    lowered = {str(c).strip().lower(): c for c in columns}
    for alias in SCHEMA_ALIASES.get(concept, []):
        if alias in columns:
            return alias
        if alias.strip().lower() in lowered:
            return lowered[alias.strip().lower()]
    return None

def extract_concept(data: dict, concept: str, default=0.0):
    """
    Extrait la valeur d'un concept métier depuis un dict aux clés potentiellement
    variables. Tolérant : clés casse-insensibles, valeurs textuelles, pourcentages.
    """
    aliases = SCHEMA_ALIASES.get(concept, [concept])
    for alias in aliases:
        raw = data[alias] if (isinstance(data, dict) and alias in data) else _lookup_ci(data, alias)
        if raw is None:
            continue
        if isinstance(raw, float) and np.isnan(raw):
            continue
        if concept == "id":
            txt = str(raw).strip()
            return txt if txt else default
        val = to_float(raw, default=None)
        if val is None:
            continue
        if concept == "taux_indiv" and val > 1.0:
            val = val / 100.0  # 80 -> 0.8 ; 0.8 reste 0.8
        return val
    return default
# ---------------------------------------------------------------------------
# Sélection dynamique des features (partagée entraînement / inférence)
# ---------------------------------------------------------------------------
def _looks_like_identifier(series: pd.Series, name: str) -> bool:
    key = str(name).strip().lower()
    if key in {"id", "index"} or key.startswith("id_") or key.endswith("_id"):
        return True
    try:
        if len(series) and series.notna().sum() == len(series) and series.nunique(dropna=True) == len(series):
            return True  # clé unique : identifiant déguisé
    except TypeError:
        return False
    return False

def build_feature_lists(df: pd.DataFrame):
    """
    Découvre les features à partir des seules données disponibles.

    Retourne (features, num_features, cat_features) sans aucune liste hardcodée :
    on exclut les concepts `id`/`target`, les identifiants déguisés, puis on
    classifie le reste par dtype (numérique vs catégoriel).
    """
    if df is None or len(df.columns) == 0:
        return [], []

    excluded = set()
    for concept in NON_FEATURE_CONCEPTS:
        col = find_actual_column(df.columns, concept)
        if col is not None:
            excluded.add(col)

    features = [
        col for col in df.columns
        if col not in excluded and not _looks_like_identifier(df[col], col)
    ]
    num_features = [c for c in features if pd.api.types.is_numeric_dtype(df[c])]
    cat_features = [c for c in features if c not in num_features]
    return features, num_features, cat_features
# ---------------------------------------------------------------------------
# Cible (tolérante aux taux comme aux statuts textuels)
# ---------------------------------------------------------------------------
_STATUS_GOOD = {"accordé", "accorde", "ok", "approved", "repaid", "rembourse", "good", "1", "true"}
_STATUS_BAD = {"default", "défaut", "defaut", "rejected", "rejeté", "rejete", "bad", "0", "false", "impaye", "impayé"}


def coerce_target_series(series: pd.Series) -> pd.Series:
    """Convertit la colonne cible en taux numériques dans [0, 1] (NaN si impossible)."""
    if pd.api.types.is_numeric_dtype(series):
        return pd.to_numeric(series, errors="coerce")

    def _to_rate(value):
        if not isinstance(value, str):
            return np.nan
        key = value.strip().lower()
        if key in _STATUS_GOOD:
            return 1.0
        if key in _STATUS_BAD:
            return 0.0
        val = to_float(value, default=None)
        if val is None:
            return np.nan
        return val / 100.0 if val > 1.0 else val
    return series.map(_to_rate).astype(float)


def target_label(series: pd.Series, threshold: float = TARGET_GOOD_THRESHOLD) -> pd.Series:
    """Étiquette binaire : 1 = bon payeur."""
    return (coerce_target_series(series) >= threshold).astype(int)
