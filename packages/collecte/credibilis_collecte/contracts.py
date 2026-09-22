"""
Contrats de données et Protocoles (Ports) du moteur credibilis_collecte.
Objets purement Python basés sur dataclasses.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Protocol

from .enums import EntityType, MatchStatus, Severity, SourceKind, VerificationLevel


@dataclass(frozen=True)
class ImportContext:
    """Contexte d'exécution et traçabilité institutionnelle d'un import."""
    institution_id: str
    source_type: SourceKind = SourceKind.CSV
    import_id: str = ""
    agency_id: Optional[str] = None
    collected_by: Optional[str] = None
    collected_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    verification_level: VerificationLevel = VerificationLevel.IMPORTE


@dataclass
class RawRecord:
    """Ligne brute extraite directement de la source."""
    row_number: int
    values: Dict[str, Any]
    source_name: str
    sheet_name: Optional[str] = None


@dataclass(frozen=True)
class ExternalIdentifierSpec:
    """Spécification d'un identifiant externe contextualisé."""
    institution_id: str
    entity_type: EntityType
    identifier_type: str
    value: str

    def key(self) -> str:
        return f"{self.institution_id}:{self.entity_type.value}:{self.identifier_type}:{self.value}"


@dataclass
class ProvenanceItem:
    """Traçabilité fine d'une valeur élémentaire (par cellule/champ)."""
    canonical_field: str
    raw_value: Any
    normalized_value: Any
    source_kind: SourceKind
    source_reference: str
    institution_id: str
    import_id: str
    collected_at: datetime
    collected_by: Optional[str] = None
    verification_level: VerificationLevel = VerificationLevel.IMPORTE
    transformations: List[str] = field(default_factory=list)
    evidence_reference: Optional[str] = None


@dataclass
class DataIssue:
    """Anomalie ou diagnostic de qualité détecté lors du traitement."""
    code: str
    severity: Severity
    field: Optional[str]
    message: str
    raw_value: Optional[Any] = None
    normalized_value: Optional[Any] = None
    source_reference: Optional[str] = None


@dataclass
class IdentityCandidate:
    """Candidat potentiel retrouvé lors de la recherche de rapprochement."""
    entity_id: str
    nom: Optional[str] = None
    prenoms: Optional[str] = None
    telephone: Optional[str] = None
    date_naissance: Optional[str] = None
    external_identifiers: List[ExternalIdentifierSpec] = field(default_factory=list)


@dataclass
class MatchResult:
    """Résultat de l'Entity Resolution pour un enregistrement."""
    status: MatchStatus
    confidence: float
    matched_entity_id: Optional[str] = None
    reasons: List[str] = field(default_factory=list)
    candidates: List[IdentityCandidate] = field(default_factory=list)


@dataclass
class QualitySummary:
    """Synthèse des 5 dimensions de qualité calculées par le moteur."""
    completeness: float
    validity: float
    uniqueness: float
    consistency: float
    traceability: float
    global_score: float
    details: Dict[str, Any] = field(default_factory=dict)


@dataclass
class CanonicalRecord:
    """Enregistrement pivot transformé, normalisé et tracé."""
    entity_type: EntityType
    values: Dict[str, Any]
    external_identifiers: List[ExternalIdentifierSpec] = field(default_factory=list)
    provenance: List[ProvenanceItem] = field(default_factory=list)
    issues: List[DataIssue] = field(default_factory=list)
    match: Optional[MatchResult] = None
    row_number: int = 0
    schema_version: str = "1.0"
    mapping_version: str = "1.0"

    @property
    def is_blocked(self) -> bool:
        return any(issue.severity == Severity.BLOCKING for issue in self.issues)

    @property
    def is_valid(self) -> bool:
        return not any(issue.severity in (Severity.BLOCKING, Severity.ERROR) for issue in self.issues)


@dataclass
class ImportResult:
    """Résultat complet et auditable produit par CollectionEngine."""
    source_name: str
    entity_type: EntityType
    records: List[CanonicalRecord]
    issues: List[DataIssue]
    quality: QualitySummary
    records_total: int
    records_valid: int
    records_invalid: int
    records_blocked: int
    exact_matches: int
    probable_matches: int
    ambiguous_matches: int
    new_entities: int


class IdentityRepository(Protocol):
    """
    Port d'accès aux identités persistées.
    Le moteur ne connaît que cette interface abstraite ;
    l'adaptateur Django l'implémente en s'appuyant sur PostgreSQL.
    """
    def find_by_external_identifier(
        self, institution_id: str, identifier_type: str, value: str
    ) -> Optional[str]:
        """Recherche l'entity_id interne à partir d'un identifiant externe strict."""
        ...

    def search_candidates(
        self,
        telephone: Optional[str] = None,
        nom: Optional[str] = None,
        date_naissance: Optional[str] = None,
    ) -> List[IdentityCandidate]:
        """Recherche les profils candidats pour le rapprochement probabiliste."""
        ...
