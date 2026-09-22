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

## 11. ContexteIA

```text
dossier_id
profil
secteur_activite?
variables (dict anonymisé)
observations (list[str])
donnees_declarees (dict)
donnees_verifiees (dict)
metadonnees (dict)
```

## 12. RequeteIA / ReponseIA

```text
RequeteIA:
- prompt
- contexte (ContexteIA)
- tache (str)
- version_prompt (str)
- institution_id?
- niveau_sensibilite (NiveauSensibiliteIA)

ReponseIA:
- contenu_texte
- donnees_structurees?
- fournisseur
- modele
- version_prompt
- duree_ms
- horodatage
```

## 13. ExecutionIAJournal (Audit Immuable)

```text
id (UUIDv4)
dossier_id
tache
fournisseur
modele
version_prompt
empreinte_entree (SHA256)
duree_ms
horodatage (ISO-8601 UTC)
succes (bool)
reponse_structuree? (JSON)
erreur? (str)
```

## 14. Erreurs techniques vs anomalies métier

### Erreur technique
Impossible d'ouvrir le fichier, stockage indisponible, corruption interne, timeout fournisseur IA.

### Anomalie métier
Date invalide, champ manquant, doublon ambigu, contradiction déclaratif vs vérifié.

Les deux ne doivent pas être mélangés.

