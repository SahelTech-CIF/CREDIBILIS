# Plan d'attaque — implémentation

## Phase 0 — Documentation

**But :** donner une source de vérité aux humains et agents.

Livrables : docs actuelles.

## Phase 1 — Package `credibilis_collecte`

Créer le package Python pur et ses contrats de base.

Definition of Done :

```bash
pytest packages/collecte/tests/
```

fonctionne sans Django.

## Phase 2 — Canonical schema V1

Créer les dataclasses / value objects nécessaires :
- RawRecord ;
- CanonicalRecord ;
- ExternalIdentifier ;
- Provenance ;
- DataIssue ;
- ImportResult.

## Phase 3 — Readers

- CSV ;
- XLSX/XLSM ;
- JSON.

Tests avec plusieurs feuilles et encodages.

## Phase 4 — Mapping

- registry ;
- profils institutionnels ;
- alias ;
- mapping manuel ;
- aperçu ;
- versioning.

## Phase 5 — Normalisation / validation

- nombres ;
- dates ;
- téléphones ;
- catégories ;
- valeurs manquantes ;
- anomalies structurées.

## Phase 6 — Identité

- identifiants internes ;
- external identifiers ;
- exact match ;
- candidates ;
- ambiguïtés ;
- no auto-merge risqué.

## Phase 7 — Provenance / qualité

- provenance champ ;
- transformation history ;
- quality summary.

## Phase 8 — Backend Django

Créer :
- config ;
- institutions ;
- ingestion ;
- identities ;
- audit.

Puis adapter le moteur à PostgreSQL.

## Phase 9 — API import

Implémenter le workflow :

```text
upload -> inspect -> map -> validate -> preview -> commit
```

## Phase 10 — UI import

Interface simple :
- uploader ;
- mapper ;
- corriger ;
- confirmer.

## Phase 11 — Dossier de crédit

Construire le wizard métier PME/salarié sur le noyau canonique.

## Phase 12 — Analyse / features / scoring

- snapshot T0 ;
- analyse métier ;
- feature engine ;
- scoring bridge ;
- ds_engine.

## Branch strategy recommandée

```text
main
  |
  +-- feat/collection-core
  +-- feat/django-ingestion
  +-- feat/ui-import
  +-- feat/scoring-bridge
```

Éviter plusieurs agents modifiant les mêmes fichiers structurants en parallèle.
