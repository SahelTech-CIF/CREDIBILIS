"""
Génération du jeu de données fictif Credibilis (colonnes attendues par le hackathon CIF).

Le fichier est écrit à l'emplacement déclaré dans `config.DATA_CSV_PATH`, ce qui
garantit qu'il est retrouvé aussi bien depuis la racine du projet que depuis
`ds_engine/`. Le script est idempotent : chaque exécution régénère le même
échantillon (graine fixée).
"""

from __future__ import annotations

import os
import sys

import numpy as np
import pandas as pd

try:
    from .config import DATA_CSV_PATH
except ImportError:  # exécution directe du script
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from config import DATA_CSV_PATH  # type: ignore[no-redef]

RANDOM_SEED = 42
N_SAMPLES = 500


def generate_dataset(n_samples: int = N_SAMPLES, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """Construit l'échantillon brut (sans écrire sur disque)."""
    rng = np.random.default_rng(seed)

    data = {
        "id_client": [f"CLI-2026-{i:04d}" for i in range(1, n_samples + 1)],
        "revenu_mensuel": rng.integers(150000, 800000, size=n_samples),
        "charges_mensuelles": rng.integers(40000, 300000, size=n_samples),
        "montant_demande": rng.choice([200000, 300000, 500000, 750000, 1000000], size=n_samples),
        "duree_mois": rng.choice([3, 6, 9, 12, 18, 24], size=n_samples),
        "historique_echeances": rng.integers(0, 24, size=n_samples),
        "taux_remboursement_indiv": np.round(rng.uniform(0.5, 1.0, size=n_samples), 2),
        "taux_remboursement_final": np.round(rng.uniform(0.6, 1.0, size=n_samples), 2),
    }
    return pd.DataFrame(data)


def main() -> int:
    df = generate_dataset()
    os.makedirs(os.path.dirname(DATA_CSV_PATH), exist_ok=True)
    df.to_csv(DATA_CSV_PATH, index=False)
    print(f"Dataset Credibilis mis à jour ({len(df)} lignes) -> {DATA_CSV_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
