"""
Moteur de mapping et d'alignement des données sources de credibilis_collecte.
Traduit les colonnes hétérogènes vers les champs canoniques.
"""

from __future__ import annotations

import re
from typing import Dict, List, Optional, Tuple

from .schema import SchemaRegistry

# Dictionnaire de motifs et d'alias connus
ALIAS_PATTERNS: Dict[str, List[str]] = {
    "person.nom": ["nom", "nom client", "nom du membre", "customer_name", "last_name", "client_name", "nom_famille"],
    "person.prenoms": ["prenom", "prenoms", "first_name", "given_name", "prenom_client"],
    "person.telephone": ["telephone", "tel", "phone", "contact", "mobile", "numero_telephone", "phone_number"],
    "person.date_naissance": ["date_naissance", "birth_date", "dob", "date de naissance", "naissance"],
    "person.piece_numero": ["nina", "cni", "numero_piece", "id_number", "passport", "piece_identite"],

    "activity.ca_mensuel": ["revenu", "revenu_mensuel", "chiffre_affaires", "ca", "income", "monthly_income", "recettes", "salaire"],
    "activity.charges_mensuelles": ["charges", "charges_mensuelles", "depenses", "expenses", "monthly_expenses"],
    "activity.secteur": ["secteur", "activite", "sector", "business_type", "metier"],
    "activity.anciennete_mois": ["anciennete", "anciennete_activite", "experience_mois"],

    "application.montant": ["montant", "montant_demande", "loan_amount", "credit_demande", "credit"],
    "application.duree_mois": ["duree", "duree_mois", "term", "duration", "loan_term"],

    "loan.historique_echeances": ["echeances_payees", "historique_echeances", "paid_installments", "anciens_prets"],
    "loan.taux_remboursement": ["taux_remboursement", "individual_rate", "taux_remboursement_indiv", "taux_remboursement_final"],
}


class MappingSuggester:
    """Propose automatiquement des correspondances entre colonnes brutes et champs canoniques."""

    @classmethod
    def suggest_for_columns(cls, columns: List[str]) -> Dict[str, Dict[str, Any]]:
        suggestions = {}
        for col in columns:
            target, confidence = cls.suggest_target(col)
            suggestions[col] = {
                "source": col,
                "suggested_target": target,
                "confidence": confidence,
                "status": "SUGGESTED" if target else "UNMAPPED",
            }
        return suggestions

    @classmethod
    def suggest_target(cls, column_name: str) -> Tuple[Optional[str], float]:
        cleaned = cls._clean_string(column_name)

        # 1. Détection des identifiants externes potentiels
        if any(term in cleaned for term in ("compte", "numero_compte", "account", "member_id", "id_client", "client_id")):
            return "external_id:COMPTE_MEMBRE", 0.95

        # 2. Correspondance exacte ou partielle sur les alias
        for canonical, aliases in ALIAS_PATTERNS.items():
            for alias in aliases:
                cleaned_alias = cls._clean_string(alias)
                if cleaned == cleaned_alias:
                    return canonical, 0.99
                if cleaned_alias in cleaned or cleaned in cleaned_alias:
                    return canonical, 0.85

        return None, 0.0

    @classmethod
    def _clean_string(cls, s: str) -> str:
        s = s.strip().lower()
        s = re.sub(r"[_\s\-]+", " ", s)
        return s


def validate_mapping(mapping: Dict[str, str]) -> Tuple[bool, List[str]]:
    """Vérifie que tous les champs cibles du mapping sont valides."""
    errors = []
    for source_col, target in mapping.items():
        if not target:
            continue
        if target.startswith("external_id:"):
            continue
        if not SchemaRegistry.is_valid_field(target):
            errors.append(f"Le champ cible '{target}' (mappé depuis '{source_col}') n'est pas reconnu dans le schéma canonique.")

    return len(errors) == 0, errors
