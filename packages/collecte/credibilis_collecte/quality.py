"""
Moteur de Data Quality de credibilis_collecte.
Calcule les 5 dimensions de qualité et le score global.
"""

from __future__ import annotations

from typing import List

from .contracts import CanonicalRecord, QualitySummary
from .enums import Severity, VerificationLevel


class QualityEngine:
    """Évalue la qualité multidimensionnelle d'un lot d'enregistrements."""

    W_COMPLETENESS = 0.30
    W_VALIDITY = 0.30
    W_UNIQUENESS = 0.15
    W_CONSISTENCY = 0.10
    W_TRACEABILITY = 0.15

    @classmethod
    def evaluate_records(cls, records: List[CanonicalRecord]) -> QualitySummary:
        if not records:
            return QualitySummary(
                completeness=1.0,
                validity=1.0,
                uniqueness=1.0,
                consistency=1.0,
                traceability=1.0,
                global_score=100.0,
            )

        n = len(records)

        # 1. Complétude : part des valeurs non nulles
        total_fields_checked = 0
        filled_fields_count = 0
        for r in records:
            for v in r.values.values():
                total_fields_checked += 1
                if v is not None and str(v).strip() != "":
                    filled_fields_count += 1
        completeness = (filled_fields_count / total_fields_checked) if total_fields_checked > 0 else 1.0

        # 2. Validité : part des enregistrements sans erreur bloquante ni erreur majeure
        valid_records = sum(1 for r in records if not any(i.severity in (Severity.BLOCKING, Severity.ERROR) for i in r.issues))
        validity = valid_records / n

        # 3. Unicité : absence d'identifiants externes dupliqués intra-lot
        seen_keys = set()
        duplicates_count = 0
        for r in records:
            for ext in r.external_identifiers:
                k = ext.key()
                if k in seen_keys:
                    duplicates_count += 1
                seen_keys.add(k)
        uniqueness = max(0.0, 1.0 - (duplicates_count / n))

        # 4. Cohérence : part des enregistrements exempts de warnings
        consistent_records = sum(1 for r in records if not any(i.severity == Severity.WARNING for i in r.issues))
        consistency = consistent_records / n

        # 5. Traçabilité : part des enregistrements disposant d'un niveau de vérification documenté
        traceable_records = sum(
            1 for r in records
            if r.provenance and any(p.verification_level != VerificationLevel.NON_VERIFIE for p in r.provenance)
        )
        traceability = traceable_records / n

        # Score Global pondéré sur 100
        global_score = (
            (cls.W_COMPLETENESS * completeness)
            + (cls.W_VALIDITY * validity)
            + (cls.W_UNIQUENESS * uniqueness)
            + (cls.W_CONSISTENCY * consistency)
            + (cls.W_TRACEABILITY * traceability)
        ) * 100.0

        return QualitySummary(
            completeness=round(completeness, 4),
            validity=round(validity, 4),
            uniqueness=round(uniqueness, 4),
            consistency=round(consistency, 4),
            traceability=round(traceability, 4),
            global_score=round(global_score, 2),
            details={
                "records_count": n,
                "valid_records_count": valid_records,
                "duplicates_detected": duplicates_count,
            },
        )
