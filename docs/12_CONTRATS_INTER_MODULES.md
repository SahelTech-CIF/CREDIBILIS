# Contrats inter-modules

Les signatures exactes pourront évoluer, mais les frontières restent stables.

## 1. SourceDescriptor

```text
source_id
filename
media_type
checksum
size
metadata
```

## 2. ImportContext

```text
institution_id
agency_id?
actor_id?
schema_version
mapping_profile_id?
requested_at
```

## 3. RawRecord

```text
record_id
source_id
sheet?
row_number?
values
```

## 4. CanonicalRecord

```text
entity_type
canonical_values
external_identifiers
provenance
issues
schema_version
```

## 5. DataIssue

```text
code
severity
field?
message
raw_value?
normalized_value?
source_reference?
rule_id?
```

## 6. MatchResult

```text
status
entity_id?
confidence?
reasons
candidates
```

## 7. ImportResult

```text
import_id
status
stats
quality_summary
records
issues
```

## 8. CreditApplicationSnapshot

```text
application_id
snapshot_id
as_of_date
values
provenance_summary
quality_summary
schema_version
```

## 9. FeatureSnapshot

```text
snapshot_id
feature_schema_version
features
quality_flags
created_at
```

## 10. ScoringResult

```text
application_id
model_version
score?
probability?
confidence?
explanations
simulation?
warnings
created_at
```

## 11. Erreurs techniques vs anomalies métier

### Erreur technique
Impossible d'ouvrir le fichier, stockage indisponible, corruption interne.

### Anomalie métier
Date invalide, champ manquant, doublon ambigu.

Les deux ne doivent pas être mélangés.
