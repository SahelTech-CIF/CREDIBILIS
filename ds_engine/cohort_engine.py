"""
Recherche de cohorte par distance de Gower (implémentation interne).

Pourquoi une implémentation maison plutôt que la lib `gower` ?
  * la lib plante sur les colonnes texte avec pandas récent
    (`TypeError: Cannot interpret '<StringDtype>' as a data type`) ;
  * elle propage les NaN : une seule valeur manquante côté client rend TOUTES les
    distances NaN, ce qui vide la cohorte et force une abstention ;
  * elle n'exclut pas les variables non comparables (identifiants, cible).

Ici : normalisation min-max explicite, tolérance aux données manquantes
(une paire de valeurs manquante est simplement ignorée et non pénalisée) et
repli automatique sur les K plus proches voisins quand le rayon devient trop
pauvre. Le calcul ne lève jamais d'exception : en dernier recours il renvoie une
cohorte vide, que l'appelant sait interpréter.
"""

from __future__ import annotations
from typing import Iterable
import numpy as np
import pandas as pd
from .config import (
    COHORT_FALLBACK_K,
    COHORT_MIN_FEATURE_COVERAGE,
    COHORT_MIN_SIZE,
    COHORT_RADIUS,
    DEFAULT_STABILITY,
    NETWORK_RATE,
    SMOOTHING_M,
    build_feature_lists,
    coerce_target_series,
    extract_concept,
    find_actual_column,
    to_float,
)

MIN_DATABASE_ROWS = 2

def _prepare_matrix(
    historical_db: pd.DataFrame,
    numerical: Iterable[str],
    categorical: Iterable[str],
) -> tuple:
    """Construit la matrice numérique de la base (colonnes num + cat encodées)."""
    blocks = []
    for col in numerical:
        series = pd.to_numeric(historical_db[col], errors="coerce").astype(float)
        blocks.append(series.to_numpy(dtype=float, copy=False).reshape(-1, 1))
    for col in categorical:
        codes = pd.Categorical(historical_db[col].astype("object")).codes.astype(float)
        codes[codes < 0] = np.nan
        blocks.append(codes.reshape(-1, 1))

    if not blocks:
        return np.empty((len(historical_db), 0))
    return np.hstack(blocks)


def _client_vector(
    client_data: dict,
    numerical: list,
    categorical: list,
    historical_db: pd.DataFrame,
) -> np.ndarray:
    """Traduit un dossier client en vecteur aligné sur la matrice de la base."""
    values = []
    for col in list(numerical) + list(categorical):
        raw = client_data.get(col) if isinstance(client_data, dict) else None
        if raw is None and isinstance(client_data, dict):
            # Le client peut arriver avec des alias différents du CSV : on tente
            # une résolution par concept avant d'abandonner.
            for concept in ("revenu", "charges", "montant", "duree", "echeances_payees", "taux_indiv"):
                if find_actual_column([col], concept) or find_actual_column([col], concept) is not None:
                    candidate = extract_concept(client_data, concept, default=None)
                    if candidate is not None:
                        raw = candidate
                    break
        values.append(to_float(raw, default=None) if col in numerical else (raw if isinstance(raw, str) else raw))
    return np.array(values, dtype=object)


def _gower_distances(
    client_data: dict,
    historical_db: pd.DataFrame,
    numerical: list,
    categorical: list,
) -> np.ndarray:
    """
    Distance de Gower (0 = identique, 1 = opposé) entre un client et la base.

    Les variables manquantes d'un côté ou de l'autre sont ignorées : la distance
    est la moyenne des contributions réellement calculées. Une ligne sans aucune
    variable comparable reçoit NaN et sera écartée de la cohorte.
    """
    db_matrix = _prepare_matrix(historical_db, numerical, categorical)
    if db_matrix.size == 0:
        return np.full(len(historical_db), np.nan)

    client_row = _client_vector(client_data, numerical, categorical, historical_db)
    contributions = []
    for idx, col in enumerate(list(numerical) + list(categorical)):
        col_values = db_matrix[:, idx]
        client_val = client_row[idx]

        if idx < len(numerical):
            client_num = to_float(client_val, default=None)
            segment = pd.to_numeric(historical_db[col], errors="coerce").astype(float).to_numpy()
            if client_num is None:
                continue
            lo, hi = np.nanmin(segment), np.nanmax(segment)
            if not np.isfinite(lo) or not np.isfinite(hi) or hi <= lo:
                continue
            diff = np.abs(col_values - client_num)
            contrib = diff / (hi - lo)
        else:
            if not isinstance(client_val, str) or str(client_val).strip() == "":
                continue
            levels = [c for c in pd.unique(historical_db[col].astype("object")) if isinstance(c, str)]
            if str(client_val) not in levels:
                continue
            contrib = np.where(col_values == col_values[np.where(
                historical_db[col].astype("object").to_numpy() == str(client_val)
            )[0][0]], 0.0, 1.0) if len(levels) else None
            if contrib is None:
                continue
        contributions.append(contrib.reshape(-1, 1))

    if not contributions:
        return np.full(len(historical_db), np.nan)

    matrix = np.hstack(contributions)
    return np.nanmean(matrix, axis=1)


def find_cohort_metrics(client_data: dict, historical_db: pd.DataFrame) -> tuple:
    """
    Retourne `(taille_cohorte, taux_lisse, stabilite)`.

    * `taille_cohorte` : nombre de voisins réellement comparables ;
    * `taux_lisse` : moyenne de remboursement lissée (bayésien) de la cohorte,
      ou valeur a priori réseau si la cohorte est vide ;
    * `stabilite` : homogénéité de la cohorte dans [0, 1].

    Ne lève jamais d'exception : une base vide, un client sans données ou un
    schéma inattendu se traduisent par une cohorte vide et un taux réseau.
    """
    if historical_db is None or historical_db.empty or len(historical_db) < MIN_DATABASE_ROWS:
        return 0, float(NETWORK_RATE), float(DEFAULT_STABILITY)

    try:
        features, num_features, cat_features = build_feature_lists(historical_db)
        if not features:
            return 0, float(NETWORK_RATE), float(DEFAULT_STABILITY)

        distances = _gower_distances(client_data, historical_db, num_features, cat_features)
        comparable = np.isfinite(distances)
        coverage = float(comparable.mean()) if len(distances) else 0.0
        if not comparable.any() or coverage < COHORT_MIN_FEATURE_COVERAGE:
            return 0, float(NETWORK_RATE), float(DEFAULT_STABILITY)

        indices = np.where(comparable & (distances < COHORT_RADIUS))[0]
        if len(indices) < COHORT_MIN_SIZE:
            # Repli : les K plus proches voisins, pour ne jamais rester muet.
            order = np.argsort(np.where(comparable, distances, np.inf))
            indices = order[:COHORT_FALLBACK_K]

        taille_cohorte = int(len(indices))
        if taille_cohorte == 0:
            return 0, float(NETWORK_RATE), float(DEFAULT_STABILITY)

        cohorte = historical_db.iloc[indices]
        target_col = find_actual_column(cohorte.columns, "target")
        if target_col is None:
            return taille_cohorte, float(NETWORK_RATE), float(DEFAULT_STABILITY)

        taux_series = coerce_target_series(cohorte[target_col]).dropna()
        if taux_series.empty:
            return taille_cohorte, float(NETWORK_RATE), float(DEFAULT_STABILITY)

        taux_brut = float(taux_series.mean())
        # Lissage bayésien : la cohorte tire vers la moyenne réseau quand elle est petite.
        taux_lisse = (taille_cohorte * taux_brut + SMOOTHING_M * NETWORK_RATE) / (taille_cohorte + SMOOTHING_M)

        if len(taux_series) > 1:
            ecart = float(taux_series.std())
            stabilite = float(np.clip(1.0 - ecart * 2.0, 0.0, 1.0))
        else:
            stabilite = float(DEFAULT_STABILITY)

        return taille_cohorte, float(taux_lisse), float(np.nan_to_num(stabilite, nan=DEFAULT_STABILITY))
    except Exception:
        # Dernier rempart : la recherche de cohorte ne doit jamais faire échouer la décision.
        return 0, float(NETWORK_RATE), float(DEFAULT_STABILITY)