"""
Énumérations du moteur de collecte CREDIBILIS.
Ce module ne dépend d'aucun framework externe.
"""

from enum import Enum


class Severity(str, Enum):
    """Niveau de sévérité des anomalies de données."""
    BLOCKING = "BLOCKING"  # Empêche tout commit ou traitement
    ERROR = "ERROR"        # Donnée invalide nécessitant correction
    WARNING = "WARNING"    # Aberration statistique ou risque métier
    INFO = "INFO"          # Remarque informative


class EntityType(str, Enum):
    """Types d'entités canoniques reconnues par CREDIBILIS."""
    PERSON = "PERSON"
    ECONOMIC_ACTIVITY = "ECONOMIC_ACTIVITY"
    CREDIT_APPLICATION = "CREDIT_APPLICATION"
    LOAN = "LOAN"
    INSTALLMENT = "INSTALLMENT"
    PAYMENT = "PAYMENT"
    DEBT = "DEBT"
    GUARANTEE = "GUARANTEE"
    DOCUMENT = "DOCUMENT"


class SourceKind(str, Enum):
    """Origine physique des données collectées."""
    CSV = "CSV"
    XLSX = "XLSX"
    JSON = "JSON"
    API = "API"
    MANUAL_FORM = "MANUAL_FORM"


class VerificationLevel(str, Enum):
    """Degré d'auditabilité et de vérification d'un fait économique."""
    NON_VERIFIE = "NON_VERIFIE"
    DECLARATIF = "DECLARATIF"
    DOCUMENT_PROBANT = "DOCUMENT_PROBANT"
    VERIFIE_AGENT = "VERIFIE_AGENT"
    IMPORTE = "IMPORTE"


class MatchStatus(str, Enum):
    """Statut du rapprochement d'entité (Entity Resolution)."""
    EXACT = "EXACT"          # Identifiant externe strict concordant (100%)
    PROBABLE = "PROBABLE"    # Score >= 96% sans ambiguïté
    AMBIGU = "AMBIGU"        # Score >= 75% ou candidats multiples
    AUCUN = "AUCUN"          # Aucun rapprochement statistique probant


class ResolutionAction(str, Enum):
    """Action de résolution humaine décidée sur un candidat."""
    PENDING = "PENDING"
    SAME_ENTITY = "SAME_ENTITY"
    DIFFERENT_ENTITY = "DIFFERENT_ENTITY"
    CREATE_NEW = "CREATE_NEW"
    IGNORED = "IGNORED"


class FieldType(str, Enum):
    """Types de données canoniques supportés pour la normalisation."""
    STRING = "STRING"
    INTEGER = "INTEGER"
    DECIMAL = "DECIMAL"
    MONEY = "MONEY"
    DATE = "DATE"
    BOOLEAN = "BOOLEAN"
    PHONE = "PHONE"
    IDENTIFIER = "IDENTIFIER"
