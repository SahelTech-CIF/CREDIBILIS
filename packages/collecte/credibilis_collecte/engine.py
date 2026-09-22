"""
Orchestrateur central du SDK de collecte : CollectionEngine.
Point d'entrée souverain et purement Python de credibilis_collecte.
"""

from __future__ import annotations

import io
from typing import Any, Dict, List, Optional, Union

from .contracts import (
    CanonicalRecord,
    DataIssue,
    ExternalIdentifierSpec,
    IdentityRepository,
    ImportContext,
    ImportResult,
    ProvenanceItem,
    RawRecord,
)
from .enums import EntityType, MatchStatus, Severity, SourceKind, VerificationLevel
from .exporter import Exporter
from .mapping import MappingSuggester, validate_mapping
from .matching import IdentityResolver
from .normalization import Normalizer
from .quality import QualityEngine
from .readers import reader_for
from .schema import SchemaRegistry
from .validation import Validator


class CollectionEngine:
    """
    Orchestrateur central du moteur de collecte.
    Ne dépend d'aucun framework web.
    """

    def __init__(self, identity_repository: Optional[IdentityRepository] = None):
        self.resolver = IdentityResolver(repository=identity_repository)

    def inspect(
        self,
        source: Union[str, bytes, io.IOBase],
        source_name: str = "source.csv",
        format_hint: Optional[SourceKind] = None,
    ) -> Dict[str, Any]:
        """Inspecte une source sans la transformer (feuilles, colonnes, échantillon)."""
        reader = reader_for(source_name, format_hint=format_hint)
        return reader.inspect(source, source_name=source_name)

    def suggest_mapping(self, columns: List[str]) -> Dict[str, Dict[str, Any]]:
        """Propose des suggestions automatiques de mapping pour une liste de colonnes."""
        return MappingSuggester.suggest_for_columns(columns)

    def import_source(
        self,
        source: Union[str, bytes, io.IOBase],
        mapping: Dict[str, str],
        context: ImportContext,
        source_name: str = "source.csv",
        sheet_name: Optional[str] = None,
        entity_type: EntityType = EntityType.PERSON,
    ) -> ImportResult:
        """
        Exécute le pipeline complet d'ingestion :
        Lecture -> Normalisation -> Provenance -> Validation -> Matching -> Audit Doublons -> Data Quality.
        """
        # 1. Validation préalable du mapping
        is_mapping_valid, mapping_errors = validate_mapping(mapping)
        if not is_mapping_valid:
            error_issues = [
                DataIssue(code="INVALID_MAPPING", severity=Severity.BLOCKING, field=None, message=err)
                for err in mapping_errors
            ]
            empty_quality = QualityEngine.evaluate_records([])
            return ImportResult(
                source_name=source_name,
                entity_type=entity_type,
                records=[],
                issues=error_issues,
                quality=empty_quality,
                records_total=0,
                records_valid=0,
                records_invalid=0,
                records_blocked=0,
                exact_matches=0,
                probable_matches=0,
                ambiguous_matches=0,
                new_entities=0,
            )

        # 2. Lecture des flux bruts
        reader = reader_for(source_name, format_hint=context.source_type)
        raw_records = list(reader.read_records(source, source_name=source_name, sheet_name=sheet_name))

        canonical_records: List[CanonicalRecord] = []
        all_issues: List[DataIssue] = []

        # 3. Transformation ligne par ligne
        for raw in raw_records:
            canonical_values: Dict[str, Any] = {}
            provenance_items: List[ProvenanceItem] = []
            external_identifiers: List[ExternalIdentifierSpec] = []
            row_issues: List[DataIssue] = []

            for source_col, target_field in mapping.items():
                if not target_field:
                    continue
                raw_val = raw.values.get(source_col)
                source_ref = f"{source_name}:{raw.sheet_name or 'default'}:row:{raw.row_number}:col:{source_col}"

                # Gestion des identifiants externes
                if target_field.startswith("external_id:"):
                    id_type = target_field.split(":", 1)[1]
                    norm_id, id_trans = Normalizer.normalize_string(raw_val, [])
                    if norm_id:
                        ext_spec = ExternalIdentifierSpec(
                            institution_id=context.institution_id,
                            entity_type=entity_type,
                            identifier_type=id_type,
                            value=norm_id,
                        )
                        external_identifiers.append(ext_spec)
                    continue

                # Traitement des champs canoniques standards
                field_def = SchemaRegistry.get_field(target_field)
                if not field_def:
                    continue

                norm_val, transformations = Normalizer.normalize(raw_val, field_def.field_type)
                canonical_values[target_field] = norm_val

                # Construction de la traçabilité par cellule
                prov = ProvenanceItem(
                    canonical_field=target_field,
                    raw_value=raw_val,
                    normalized_value=norm_val,
                    source_kind=context.source_type,
                    source_reference=source_ref,
                    institution_id=context.institution_id,
                    import_id=context.import_id,
                    collected_at=context.collected_at,
                    collected_by=context.collected_by,
                    verification_level=context.verification_level,
                    transformations=transformations,
                )
                provenance_items.append(prov)

            # Instanciation de l'enregistrement canonique
            crecord = CanonicalRecord(
                entity_type=entity_type,
                values=canonical_values,
                external_identifiers=external_identifiers,
                provenance=provenance_items,
                row_number=raw.row_number,
                schema_version="1.0",
                mapping_version="1.0",
            )

            # Validation des règles d'intégrité et métiers
            validation_issues = Validator.validate_record(crecord)
            crecord.issues.extend(validation_issues)
            row_issues.extend(validation_issues)

            # Résolution d'entité (Entity Resolution)
            match_res = self.resolver.resolve(crecord, institution_id=context.institution_id)
            crecord.match = match_res

            canonical_records.append(crecord)
            all_issues.extend(row_issues)

        # 4. Audit transversal des doublons intra-lot (Unicité stricte)
        seen_identifiers: Dict[str, int] = {}
        for crecord in canonical_records:
            for ext in crecord.external_identifiers:
                k = ext.key()
                if k in seen_identifiers:
                    first_row = seen_identifiers[k]
                    dup_issue = DataIssue(
                        code="DUPLICATE_EXTERNAL_IDENTIFIER",
                        severity=Severity.BLOCKING,
                        field=ext.identifier_type,
                        message=f"Collision intra-lot : l'identifiant '{ext.value}' apparaît aussi à la ligne {first_row}.",
                        normalized_value=ext.value,
                    )
                    crecord.issues.append(dup_issue)
                    all_issues.append(dup_issue)
                else:
                    seen_identifiers[k] = crecord.row_number

        # 5. Calcul des métriques de Data Quality à 5 dimensions
        quality = QualityEngine.evaluate_records(canonical_records)

        # 6. Consolidation des compteurs de statistiques
        total = len(canonical_records)
        blocked = sum(1 for r in canonical_records if r.is_blocked)
        valid = sum(1 for r in canonical_records if r.is_valid)
        invalid = total - valid

        exact_m = sum(1 for r in canonical_records if r.match and r.match.status == MatchStatus.EXACT)
        prob_m = sum(1 for r in canonical_records if r.match and r.match.status == MatchStatus.PROBABLE)
        ambig_m = sum(1 for r in canonical_records if r.match and r.match.status == MatchStatus.AMBIGU)
        new_ent = sum(1 for r in canonical_records if not r.match or r.match.status == MatchStatus.AUCUN)

        return ImportResult(
            source_name=source_name,
            entity_type=entity_type,
            records=canonical_records,
            issues=all_issues,
            quality=quality,
            records_total=total,
            records_valid=valid,
            records_invalid=invalid,
            records_blocked=blocked,
            exact_matches=exact_m,
            probable_matches=prob_m,
            ambiguous_matches=ambig_m,
            new_entities=new_ent,
        )

    def export(self, records: List[CanonicalRecord], format: str = "csv") -> Union[str, bytes]:
        """Exporte des enregistrements canoniques vers le format demandé."""
        fmt = format.lower()
        if fmt == "csv":
            return Exporter.to_csv(records)
        elif fmt == "json":
            return Exporter.to_json(records)
        elif fmt in ("xlsx", "excel"):
            return Exporter.to_excel(records)
        else:
            raise ValueError(f"Format d'export non supporté : '{format}'. Attendu: csv, json, xlsx.")
