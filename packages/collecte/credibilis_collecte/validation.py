"""
Moteur de validation des règles génériques et métiers de credibilis_collecte.
Produit des diagnostics typés (DataIssue).
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List

from .contracts import CanonicalRecord, DataIssue
from .enums import EntityType, Severity
from .schema import SchemaRegistry


class Validator:
    """Valide la cohérence canonique et métier des enregistrements."""

    @classmethod
    def validate_record(cls, record: CanonicalRecord) -> List[DataIssue]:
        issues: List[DataIssue] = []
        values = record.values
        entity_type = record.entity_type

        # 1. Vérification des champs requis du schéma
        required_fields = SchemaRegistry.required_fields_for(entity_type)
        for field_name, field_def in required_fields.items():
            val = values.get(field_name)
            if val is None or (isinstance(val, str) and not val.strip()):
                issues.append(DataIssue(
                    code="MISSING_REQUIRED_FIELD",
                    severity=Severity.BLOCKING,
                    field=field_name,
                    message=f"Le champ obligatoire '{field_name}' ({field_def.description}) est manquant.",
                    raw_value=val,
                ))

        # 2. Règles métiers spécifiques : PERSON
        if entity_type == EntityType.PERSON:
            nom = values.get("person.nom")
            if not nom or not str(nom).strip():
                issues.append(DataIssue(
                    code="PERSON_WITHOUT_NAME",
                    severity=Severity.BLOCKING,
                    field="person.nom",
                    message="Une personne physique doit obligatoirement posséder un nom de famille.",
                ))

            date_naiss = values.get("person.date_naissance")
            if date_naiss:
                try:
                    dt = datetime.strptime(date_naiss, "%Y-%m-%d").date()
                    if dt > date.today():
                        issues.append(DataIssue(
                            code="FUTURE_BIRTH_DATE",
                            severity=Severity.BLOCKING,
                            field="person.date_naissance",
                            message="La date de naissance ne peut pas être dans le futur.",
                            normalized_value=date_naiss,
                        ))
                    elif (date.today().year - dt.year) < 18:
                        issues.append(DataIssue(
                            code="MINORITY_APPLICANT",
                            severity=Severity.WARNING,
                            field="person.date_naissance",
                            message="L'emprunteur semble avoir moins de 18 ans.",
                            normalized_value=date_naiss,
                        ))
                except ValueError:
                    issues.append(DataIssue(
                        code="INVALID_DATE_FORMAT",
                        severity=Severity.ERROR,
                        field="person.date_naissance",
                        message="Format de date de naissance invalide (attendu: YYYY-MM-DD).",
                        normalized_value=date_naiss,
                    ))

        # 3. Règles métiers spécifiques : CREDIT_APPLICATION
        if entity_type == EntityType.CREDIT_APPLICATION:
            montant = values.get("application.montant")
            if montant is not None and montant <= 0:
                issues.append(DataIssue(
                    code="INVALID_LOAN_AMOUNT",
                    severity=Severity.BLOCKING,
                    field="application.montant",
                    message="Le montant du prêt demandé doit être strictement positif.",
                    normalized_value=montant,
                ))

            duree = values.get("application.duree_mois")
            if duree is not None and duree <= 0:
                issues.append(DataIssue(
                    code="INVALID_LOAN_TERM",
                    severity=Severity.BLOCKING,
                    field="application.duree_mois",
                    message="La durée du prêt doit être d'au moins 1 mois.",
                    normalized_value=duree,
                ))

        # 4. Règles financières croisées
        ca = values.get("activity.ca_mensuel")
        charges = values.get("activity.charges_mensuelles")
        if ca is not None and ca < 0:
            issues.append(DataIssue(
                code="NEGATIVE_REVENUE",
                severity=Severity.ERROR,
                field="activity.ca_mensuel",
                message="Le chiffre d'affaires mensuel ne peut être négatif.",
                normalized_value=ca,
            ))
        if charges is not None and charges < 0:
            issues.append(DataIssue(
                code="NEGATIVE_EXPENSES",
                severity=Severity.ERROR,
                field="activity.charges_mensuelles",
                message="Les charges mensuelles ne peuvent être négatives.",
                normalized_value=charges,
            ))
        if ca is not None and charges is not None and charges > ca:
            issues.append(DataIssue(
                code="EXPENSES_EXCEED_REVENUE",
                severity=Severity.WARNING,
                field="activity.charges_mensuelles",
                message="Les charges d'exploitation déclarées excèdent le chiffre d'affaires.",
                normalized_value=charges,
            ))

        return issues
