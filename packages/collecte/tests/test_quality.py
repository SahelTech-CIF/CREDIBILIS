"""
Tests unitaires pour le moteur de Data Quality (quality.py).
Vérifie le calcul des 5 dimensions et l'application des pondérations.
"""

from credibilis_collecte.contracts import CanonicalRecord, DataIssue, ProvenanceItem
from credibilis_collecte.enums import EntityType, Severity, SourceKind, VerificationLevel
from credibilis_collecte.quality import QualityEngine


def test_quality_empty_records():
    summary = QualityEngine.evaluate_records([])
    assert summary.global_score == 100.0
    assert summary.completeness == 1.0
    assert summary.validity == 1.0


def test_quality_dimensions_and_weights():
    # Enregistrement parfait
    rec1 = CanonicalRecord(
        entity_type=EntityType.PERSON,
        values={"person.nom": "Traoré", "person.telephone": "76000000"},
        provenance=[
            ProvenanceItem(
                canonical_field="person.nom",
                raw_value="Traoré",
                normalized_value="Traoré",
                source_kind=SourceKind.CSV,
                source_reference="test.csv:1",
                institution_id="KAFO",
                import_id="IMP-1",
                collected_at=None,
                verification_level=VerificationLevel.DOCUMENT_PROBANT,
            )
        ],
    )

    # Enregistrement avec anomalie bloquante et champ vide
    rec2 = CanonicalRecord(
        entity_type=EntityType.PERSON,
        values={"person.nom": "", "person.telephone": "76000000"},
        issues=[
            DataIssue(
                code="PERSON_WITHOUT_NAME",
                severity=Severity.BLOCKING,
                field="person.nom",
                message="Nom manquant",
            )
        ],
    )

    records = [rec1, rec2]
    summary = QualityEngine.evaluate_records(records)

    # Complétude : 3 champs remplis sur 4 = 0.75
    assert summary.completeness == 0.75

    # Validité : 1 dossier valide sur 2 = 0.50
    assert summary.validity == 0.50

    # Unicité : aucun doublon = 1.0
    assert summary.uniqueness == 1.0

    # Traçabilité : 1 dossier tracé sur 2 = 0.50
    assert summary.traceability == 0.50

    # Score Global calculé = (0.30*0.75 + 0.30*0.50 + 0.15*1.0 + 0.10*1.0 + 0.15*0.50) * 100
    # = (0.225 + 0.15 + 0.15 + 0.10 + 0.075) * 100 = 0.70 * 100 = 70.0
    assert summary.global_score == 70.0
