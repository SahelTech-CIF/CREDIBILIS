"""
Smoke test de bout en bout du moteur Credibilis.

Vérifie que l'API publique répond correctement sur une série de dossiers
représentatifs, y compris les cas dégradés (données manquantes, sales, renommées).

Utilisation : `python ds_engine/smoke_test.py`
"""

from __future__ import annotations

import os
import sys

try:
    from ds_engine.predictor import predict_credibilis_score, process_credit_application
except ImportError:  # exécution depuis ds_engine/
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from ds_engine.predictor import predict_credibilis_score, process_credit_application


DOSSIERS = [
    (
        "dossier complet",
        {
            "id_client": "CLI-2026-9001",
            "revenu_mensuel": 450000,
            "charges_mensuelles": 80000,
            "montant_demande": 300000,
            "duree_mois": 12,
            "historique_echeances": 18,
            "taux_remboursement_indiv": 0.95,
        },
    ),
    (
        "libellés anglais",
        {
            "customer_id": "CLI-2026-9002",
            "income": 300000,
            "expenses": 60000,
            "loan_amount": 200000,
            "term": 6,
            "paid_installments": 24,
            "individual_rate": 0.88,
        },
    ),
    (
        "données manquantes + format sale",
        {
            "id_client": "CLI-2026-9003",
            "revenu_mensuel": "350 000",
            "charges_mensuelles": "60 000,50",
            "montant_demande": "500000",
            "duree_mois": 9,
            "historique_echeances": 4,
            "taux_remboursement_indiv": "75%",
        },
    ),
    (
        "dossier vide",
        {"id_client": "CLI-2026-9004"},
    ),
]


def main() -> int:
    echecs = 0

    for nom, dossier in DOSSIERS:
        resultat = process_credit_application(dossier)
        if "decision" not in resultat:
            print(f"[KO] {nom}: aucune décision retournée")
            echecs += 1
            continue
        print(
            f"[OK] {nom:34s} -> {resultat['decision']:20s} "
            f"score={resultat.get('score_credibilis')} "
            f"modeles={resultat.get('modeles_utilises')}"
        )

    # L'alias doit pointer sur la même implémentation (compatibilité des imports).
    alias = predict_credibilis_score(DOSSIERS[0][1])
    reference = process_credit_application(DOSSIERS[0][1])
    if alias["decision"] != reference["decision"] or alias["score_credibilis"] != reference["score_credibilis"]:
        print("[KO] predict_credibilis_score ne renvoie pas le même résultat que process_credit_application")
        echecs += 1
    else:
        print("[OK] alias predict_credibilis_score cohérent avec process_credit_application")

    print("Smoke test terminé :", "ÉCHEC(S)" if echecs else "SUCCÈS")
    return 1 if echecs else 0


if __name__ == "__main__":
    raise SystemExit(main())
