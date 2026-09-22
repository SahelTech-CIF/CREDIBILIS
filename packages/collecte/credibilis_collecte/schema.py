"""
Grammaire des schémas canoniques de CREDIBILIS.
Définit les champs standards, leurs types attendus et leurs contraintes.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional

from .enums import EntityType, FieldType


@dataclass(frozen=True)
class FieldDefinition:
    """Définition d'un champ canonique standardisé."""
    name: str
    entity_type: EntityType
    field_type: FieldType
    required: bool = False
    description: str = ""


# Registre central des champs canoniques
CANONICAL_FIELDS: Dict[str, FieldDefinition] = {
    # --- ENTITÉ PERSON ---
    "person.nom": FieldDefinition("person.nom", EntityType.PERSON, FieldType.STRING, required=True, description="Nom de famille"),
    "person.prenoms": FieldDefinition("person.prenoms", EntityType.PERSON, FieldType.STRING, required=False, description="Prénoms"),
    "person.telephone": FieldDefinition("person.telephone", EntityType.PERSON, FieldType.PHONE, required=False, description="Numéro MSISDN principal"),
    "person.date_naissance": FieldDefinition("person.date_naissance", EntityType.PERSON, FieldType.DATE, required=False, description="Date de naissance (ISO YYYY-MM-DD)"),
    "person.lieu_naissance": FieldDefinition("person.lieu_naissance", EntityType.PERSON, FieldType.STRING, required=False, description="Lieu de naissance"),
    "person.genre": FieldDefinition("person.genre", EntityType.PERSON, FieldType.STRING, required=False, description="Genre (F/M)"),
    "person.piece_type": FieldDefinition("person.piece_type", EntityType.PERSON, FieldType.STRING, required=False, description="Type de pièce (NINA, CNI, Passeport)"),
    "person.piece_numero": FieldDefinition("person.piece_numero", EntityType.PERSON, FieldType.IDENTIFIER, required=False, description="Numéro de la pièce officielle"),
    "person.adresse": FieldDefinition("person.adresse", EntityType.PERSON, FieldType.STRING, required=False, description="Adresse ou quartier de résidence"),
    "person.ville": FieldDefinition("person.ville", EntityType.PERSON, FieldType.STRING, required=False, description="Commune ou ville"),
    "person.statut_matrimonial": FieldDefinition("person.statut_matrimonial", EntityType.PERSON, FieldType.STRING, required=False, description="Statut matrimonial"),

    # --- ENTITÉ ACTIVITÉ ÉCONOMIQUE ---
    "activity.secteur": FieldDefinition("activity.secteur", EntityType.ECONOMIC_ACTIVITY, FieldType.STRING, required=False, description="Secteur d'activité (Commerce, Agriculture, etc.)"),
    "activity.nature": FieldDefinition("activity.nature", EntityType.ECONOMIC_ACTIVITY, FieldType.STRING, required=False, description="Nature précise de l'activité"),
    "activity.ca_mensuel": FieldDefinition("activity.ca_mensuel", EntityType.ECONOMIC_ACTIVITY, FieldType.MONEY, required=False, description="Chiffre d'affaires mensuel estimé"),
    "activity.charges_mensuelles": FieldDefinition("activity.charges_mensuelles", EntityType.ECONOMIC_ACTIVITY, FieldType.MONEY, required=False, description="Charges d'exploitation mensuelles"),
    "activity.anciennete_mois": FieldDefinition("activity.anciennete_mois", EntityType.ECONOMIC_ACTIVITY, FieldType.INTEGER, required=False, description="Ancienneté de l'activité en mois"),
    "activity.emplacement": FieldDefinition("activity.emplacement", EntityType.ECONOMIC_ACTIVITY, FieldType.STRING, required=False, description="Marché, boutique fixe ou ambulant"),

    # --- ENTITÉ DEMANDE DE CRÉDIT ---
    "application.montant": FieldDefinition("application.montant", EntityType.CREDIT_APPLICATION, FieldType.MONEY, required=True, description="Montant du prêt sollicité"),
    "application.duree_mois": FieldDefinition("application.duree_mois", EntityType.CREDIT_APPLICATION, FieldType.INTEGER, required=True, description="Durée sollicitée en mois"),
    "application.objet": FieldDefinition("application.objet", EntityType.CREDIT_APPLICATION, FieldType.STRING, required=False, description="Objet ou destination du financement"),
    "application.periodicite": FieldDefinition("application.periodicite", EntityType.CREDIT_APPLICATION, FieldType.STRING, required=False, description="Périodicité de remboursement"),

    # --- ENTITÉ CRÉDIT / HISTORIQUE ---
    "loan.montant_accorde": FieldDefinition("loan.montant_accorde", EntityType.LOAN, FieldType.MONEY, required=False, description="Montant accordé"),
    "loan.encours_restant": FieldDefinition("loan.encours_restant", EntityType.LOAN, FieldType.MONEY, required=False, description="Capital restant dû"),
    "loan.taux_remboursement": FieldDefinition("loan.taux_remboursement", EntityType.LOAN, FieldType.DECIMAL, required=False, description="Taux de remboursement final [0.0 - 1.0]"),
    "loan.historique_echeances": FieldDefinition("loan.historique_echeances", EntityType.LOAN, FieldType.INTEGER, required=False, description="Nombre d'échéances déjà remboursées"),
}


class SchemaRegistry:
    """Gestionnaire et vérificateur de conformité au schéma canonique."""

    @classmethod
    def get_field(cls, field_name: str) -> Optional[FieldDefinition]:
        return CANONICAL_FIELDS.get(field_name.strip().lower())

    @classmethod
    def is_valid_field(cls, field_name: str) -> bool:
        return field_name.strip().lower() in CANONICAL_FIELDS

    @classmethod
    def required_fields_for(cls, entity_type: EntityType) -> Dict[str, FieldDefinition]:
        return {k: v for k, v in CANONICAL_FIELDS.items() if v.entity_type == entity_type and v.required}
