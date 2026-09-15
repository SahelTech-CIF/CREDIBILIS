"""
Entraînement du modèle de scoring Credibilis (LightGBM).

Le script :
  1. lit le CSV historique depuis `config.DATA_CSV_PATH` (chemin absolu, donc
     insensible au répertoire d'appel) ;
  2. découvre automatiquement les features et la cible via `config.py` ;
  3. entraîne un classifieur LightGBM silencieux (`verbose=-1`) ;
  4. sauvegarde un bundle exploitable par l'inférence sous
     `ds_engine/scoring_lightgbm.pkl`.

Utilisation : `python ds_engine/train_models.py`
"""

from __future__ import annotations

import os
import sys
from datetime import datetime

import joblib
import numpy as np
import pandas as pd

# Exécution directe (`python ds_engine/train_models.py`) ou import en paquet.
try:
    from .config import (
        DATA_CSV_PATH,
        MODEL_PATH,
        TARGET_GOOD_THRESHOLD,
        build_feature_lists,
        coerce_target_series,
        find_actual_column,
    )
except ImportError:
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from config import (  # type: ignore[no-redef]
        DATA_CSV_PATH,
        MODEL_PATH,
        TARGET_GOOD_THRESHOLD,
        build_feature_lists,
        coerce_target_series,
        find_actual_column,
    )


def _build_training_frame(df: pd.DataFrame):
    """Retourne (X, y, features, cat_features, levels) prêts pour LightGBM."""
    features, _num_features, cat_features = build_feature_lists(df)
    if not features:
        raise ValueError(
            "Aucune variable explicative détectable dans le CSV : "
            "vérifiez la présence de colonnes autres que l'identifiant et la cible."
        )

    X = df[features].copy()
    # pandas récent infère un dtype "string" qui n'est pas accepté tel quel par
    # LightGBM : on force explicitement le type catégorie et on mémorise les niveaux
    # pour garantir un encodage identique au moment de l'inférence.
    levels = {}
    for col in cat_features:
        categories = [str(v) for v in pd.unique(X[col].dropna())]
        X[col] = pd.Categorical(X[col].astype("object"), categories=categories)
        levels[col] = categories

    return X, features, cat_features, levels


def main() -> int:
    if not os.path.exists(DATA_CSV_PATH):
        raise FileNotFoundError(
            f"Fichier introuvable : {DATA_CSV_PATH}. Lancez d'abord `python ds_engine/generate_data.py`."
        )

    print(f"Chargement des données historiques : {DATA_CSV_PATH}")
    df = pd.read_csv(DATA_CSV_PATH)

    target_col = find_actual_column(df.columns, "target")
    if target_col is None:
        raise ValueError(
            "Colonne cible introuvable. Attendu l'un de : "
            + ", ".join(("taux_remboursement_final", "target", "default_rate", "status"))
        )

    y = (coerce_target_series(df[target_col]) >= TARGET_GOOD_THRESHOLD).astype(int)
    if y.dropna().empty or y.dropna().nunique() < 2:
        raise ValueError(
            "La cible ne contient qu'une seule classe : impossible d'entraîner un classifieur."
        )

    X, features, cat_features, levels = _build_training_frame(df)
    print(f"{len(features)} features découvertes automatiquement "
          f"({len(cat_features)} catégorielles) | {int(y.sum())} bons payeurs sur {len(y)}")

    import lightgbm as lgb

    model = lgb.LGBMClassifier(
        n_estimators=100,
        random_state=42,
        verbose=-1,
    )
    model.fit(X, y)

    bundle = {
        "model": model,
        "features": features,
        "cat_features": cat_features,
        "categorical_levels": levels,
        "target_column": target_col,
        "target_threshold": TARGET_GOOD_THRESHOLD,
        "trained_at": datetime.now().isoformat(timespec="seconds"),
    }

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(bundle, MODEL_PATH)
    print(f"Modèle LightGBM sauvegardé sous {MODEL_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
