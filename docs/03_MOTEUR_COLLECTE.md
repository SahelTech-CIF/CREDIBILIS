# Moteur de collecte — spécification détaillée

## 1. Objectif

Le moteur de collecte est la première brique de l'application métier CREDIBILIS.

Il reçoit des données hétérogènes, les comprend à travers des profils de mapping, les normalise, les valide, recherche les entités correspondantes, conserve la provenance et retourne un résultat prêt à être persisté.

## 2. Invariant principal

Le package doit fonctionner sans Django.

```python
from credibilis_collecte import CollectionEngine
```

## 3. Structure cible

```text
credibilis_collecte/
├── __init__.py
├── domaine/
│   ├── records.py
│   ├── identifiers.py
│   ├── provenance.py
│   ├── issues.py
│   └── results.py
├── contrats/
│   ├── readers.py
│   ├── identity.py
│   ├── mappings.py
│   └── exporters.py
├── lecteurs/
│   ├── csv_reader.py
│   ├── excel_reader.py
│   └── json_reader.py
├── mapping/
│   ├── registry.py
│   ├── mapper.py
│   └── aliases.py
├── normalisation/
├── validation/
├── identite/
├── rapprochement/
├── provenance/
├── qualite/
├── exportation/
└── services/
    ├── inspect_source.py
    ├── preview_import.py
    └── execute_import.py
```

## 4. Modes d'exécution

### `inspect`
Lit la structure sans transformer complètement.

Sortie :
- feuilles ;
- colonnes ;
- nombre de lignes ;
- échantillon ;
- types détectés ;
- mapping éventuellement reconnu.

### `preview`
Applique mapping + normalisation + validation + rapprochement sans commit.

### `commit`
Le moteur produit le résultat final ; l'adaptateur Django effectue le commit DB.

Le moteur lui-même ne fait pas `transaction.atomic()`.

## 5. Import idempotent

Chaque source doit avoir :

```text
checksum SHA-256
institution_id
source_name
source_size
received_at
```

Django peut empêcher ou signaler un import identique déjà traité.

## 6. Formats V1

Obligatoires :
- CSV ;
- XLSX ;
- XLSM en lecture ;
- JSON.

Non obligatoire V1 :
- PDF ;
- OCR ;
- SFTP ;
- Core Banking API.

## 7. Gestion des feuilles Excel

Le lecteur Excel doit :
- lister les feuilles ;
- lire un échantillon ;
- permettre d'associer une feuille à un type d'entité ;
- supporter plusieurs feuilles dans un même import ;
- conserver `sheet_name` et `row_number` dans la provenance.

## 8. Mapping

Un `MappingProfile` doit contenir :

```text
id
institution_id
name
source_signature
schema_version
mapping_version
fields
created_at
created_by
status
```

Un mapping de champ contient :

```text
source_column
canonical_field
required
transformation?
default?
ignore?
```

## 9. Signature d'une source

Pour reconnaître un format déjà connu :

```text
nom feuille + colonnes normalisées + éventuellement ordre
```

Ne pas dépendre du nom exact du fichier.

## 10. Validation

Chaque validation retourne des `DataIssue`, pas seulement des exceptions.

Les exceptions sont réservées aux erreurs techniques impossibles à convertir en issue métier.

## 11. Résultat

```text
ImportResult
- import_id
- status
- source_summary
- records_total
- records_ready
- records_blocked
- entities_new
- matches_exact
- matches_probable
- matches_ambiguous
- quality_summary
- issues
- canonical_records
```

## 12. Performance V1

Priorité à la fiabilité.

Pour les fichiers de quelques milliers ou dizaines de milliers de lignes :
- lecture par chunks si nécessaire ;
- éviter les requêtes DB ligne par ligne ;
- préparer les index d'identité ;
- persistance par bulk operations côté Django.

Celery n'est introduit que si les imports synchrones deviennent réellement trop longs.
