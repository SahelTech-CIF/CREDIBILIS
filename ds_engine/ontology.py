"""
Ontologie métier Credibilis : validation souple des passeports économiques.

Les clients du concours n'arrivent pas tous avec le même schéma. La validation
s'appuie donc sur les alias de `config.SCHEMA_ALIASES` et sur une conversion
tolérante des types, plutôt que sur une liste de clés figées : un dossier
renommé reste acceptable, seul le fond est contrôlé.
"""

from __future__ import annotations

import logging

try:
    from .config import extract_concept, to_float, to_int
except ImportError:  # exécution directe du script
    from config import extract_concept, to_float, to_int  # type: ignore[no-redef]

logging.basicConfig(format="%(asctime)s | %(levelname)s | AUDIT | %(message)s", level=logging.INFO)
logger = logging.getLogger("CREDIBILIS_ONTOLOGY")


class DataValidationError(Exception):
    """Erreur de validation d'un dossier client."""


# Contraintes métier : concept -> (champ obligatoire ?, règle d'acceptation)
def validate_economic_passport(data: dict) -> dict:
    """
    Bouclier d'entrée : valide les types et les limites métiers sur des clés
    potentiellement renommées.

    Retourne le dict enrichi d'une clé `_concepts` (valeurs normalisées extraites)
    pour éviter de refaire l'extraction en aval. Lève `DataValidationError` si un
    champ indispensable manque ou sort des bornes métier.
    """
    if not isinstance(data, dict):
        raise DataValidationError("Le passeport économique doit être un dictionnaire.")

    client_id = extract_concept(data, "id", default=None)
    if not client_id:
        raise DataValidationError("Champ manquant critique : identifiant client (id_client).")

    montant = to_float(extract_concept(data, "montant", default=None), default=None)
    duree = to_int(extract_concept(data, "duree", default=None), default=0)
    revenu = to_float(extract_concept(data, "revenu", default=None), default=None)
    charges = to_float(extract_concept(data, "charges", default=None), default=None)
    echeances = to_int(extract_concept(data, "echeances_payees", default=None), default=0)
    taux_indiv = extract_concept(data, "taux_indiv", default=None)

    if montant is None:
        raise DataValidationError("Montant demandé absent ou non numérique.")
    if revenu is None:
        raise DataValidationError("Revenu mensuel absent ou non numérique.")
    if charges is None:
        raise DataValidationError("Charges mensuelles absentes ou non numériques.")

    if montant < 10000:
        raise DataValidationError("Montant irréaliste : il doit être supérieur ou égal à 10000.")
    if duree < 1:
        raise DataValidationError("Durée irréaliste : elle doit valoir au moins 1 mois.")
    if taux_indiv is not None and not (0.0 <= taux_indiv <= 1.0):
        raise DataValidationError("Le taux de remboursement individuel doit être entre 0.0 et 1.0.")

    logger.info("Passeport validé pour le client %s", client_id)

    enriched = dict(data)
    enriched["_concepts"] = {
        "id": client_id,
        "revenu": revenu,
        "charges": charges,
        "montant": montant,
        "duree": duree,
        "echeances_payees": echeances,
        "taux_indiv": taux_indiv,
    }
    return enriched
