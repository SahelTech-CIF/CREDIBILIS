# Contrats de données — Collecte V1

## RawRecord
```text
RawRecord
- source_id
- source_row
- source_sheet?
- values: dict[str, Any]
- metadata: dict
```

## CanonicalRecord
```text
CanonicalRecord
- entity_type
- values
- external_identifiers
- provenance
- mapping_version
- schema_version
```

## ExternalIdentifier
```text
ExternalIdentifier
- institution_id
- entity_type
- identifier_type
- value
```

Contrainte logique : `(institution_id, entity_type, identifier_type, value)` identifie au plus une entité active.

## EntityReference
```text
EntityReference
- internal_id
- entity_type
- match_status
- match_confidence?
- match_reasons[]
```

`match_status` : EXACT, PROBABLE, AMBIGU, AUCUN.

## Provenance
```text
Provenance
- source_kind
- source_reference
- import_id
- institution_id
- collected_at
- collected_by?
- verification_level
- evidence_reference?
- transformations[]
```

## DataIssue
```text
DataIssue
- code
- severity
- entity_type?
- entity_reference?
- field?
- raw_value?
- normalized_value?
- message
- rule_id?
- source_reference?
```

## ImportResult
```text
ImportResult
- import_id
- source_summary
- records_total
- records_valid
- records_invalid
- records_blocked
- exact_matches
- probable_matches
- ambiguous_matches
- new_entities
- issues[]
- records[]
```

## Frontière avec Django
Le moteur ne retourne jamais QuerySet, Model Django, Serializer DRF ou HttpResponse. Django traduit `ImportResult` vers persistance, transactions, réponses API et écrans.

## Frontière avec ds_engine
Le Data Science Engine reçoit un snapshot/dataset préparé, jamais un fichier Excel brut ou un QuerySet.

```text
ScoringInput
- client_id
- snapshot_date
- features
- feature_provenance
- quality_summary
- model_context
```

## Versionnement
Prévoir `schema_version`, `mapping_version`, `import_id` et `model_version` selon les frontières concernées.
