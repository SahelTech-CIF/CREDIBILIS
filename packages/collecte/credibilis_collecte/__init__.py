"""
credibilis_collecte — Moteur d'ingestion et de collecte de données canoniques.
Package Python pur, souverain et indépendant de Django.
"""

from .contracts import (
    CanonicalRecord,
    DataIssue,
    ExternalIdentifierSpec,
    IdentityCandidate,
    IdentityRepository,
    ImportContext,
    ImportResult,
    MatchResult,
    ProvenanceItem,
    QualitySummary,
    RawRecord,
)
from .engine import CollectionEngine
from .enums import (
    EntityType,
    FieldType,
    MatchStatus,
    ResolutionAction,
    Severity,
    SourceKind,
    VerificationLevel,
)
from .exporter import Exporter
from .mapping import MappingSuggester, validate_mapping
from .matching import IdentityResolver
from .normalization import Normalizer
from .quality import QualityEngine
from .readers import CSVReader, ExcelReader, JSONReader, reader_for
from .schema import CANONICAL_FIELDS, FieldDefinition, SchemaRegistry
from .validation import Validator

__all__ = [
    "CollectionEngine",
    "ImportContext",
    "RawRecord",
    "CanonicalRecord",
    "DataIssue",
    "ImportResult",
    "ProvenanceItem",
    "ExternalIdentifierSpec",
    "IdentityCandidate",
    "MatchResult",
    "QualitySummary",
    "IdentityRepository",
    "Severity",
    "EntityType",
    "SourceKind",
    "VerificationLevel",
    "MatchStatus",
    "ResolutionAction",
    "FieldType",
    "Normalizer",
    "Validator",
    "QualityEngine",
    "IdentityResolver",
    "MappingSuggester",
    "validate_mapping",
    "SchemaRegistry",
    "CANONICAL_FIELDS",
    "FieldDefinition",
    "Exporter",
    "CSVReader",
    "ExcelReader",
    "JSONReader",
    "reader_for",
]
