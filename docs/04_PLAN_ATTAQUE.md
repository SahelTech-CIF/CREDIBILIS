# Plan d'attaque — Application métier / Moteur de collecte

## Phase 0 — Documentation
Verrouiller README, architecture, ADR, spécification collecte, contrats et règles agents.

## Phase 1 — Squelette Python
Créer `packages/collecte/` avec package installable et tests sans Django.

## Phase 2 — Schéma canonique minimal
Personne, Organisation/Activité, DemandeCredit, Credit, Echeance, PaiementHistorique, Engagement, Garantie, Document et ExternalIdentifier.

## Phase 3 — Import CSV/XLSX
Construire `CsvReader`, `ExcelReader`, inspection feuilles/colonnes et `RawRecord`.

## Phase 4 — Mapping
Registre champs canoniques, profil par institution, mapping manuel, suggestions simples, validation et versionnement.

## Phase 5 — Normalisation + validation
Montants, dates, téléphones, catégories, valeurs manquantes et `DataIssue`.

## Phase 6 — Identité + rapprochement
ID interne, ExternalIdentifier, recherche exacte, rapprochement multi-attributs et statuts EXACT/PROBABLE/AMBIGU/AUCUN.

## Phase 7 — Provenance + qualité
Provenance par champ critique, transformations, niveaux de vérification, complétude, validité, unicité et cohérence.

## Phase 8 — Django
Créer le projet Django et les apps `institutions`, `identites`, `collecte`, `dossiers`, `audit`. Django implémente les adaptateurs de persistance.

## Phase 9 — API REST
Workflow proposé :
```text
POST /api/v1/imports/
GET  /api/v1/imports/{id}/
GET  /api/v1/imports/{id}/issues/
POST /api/v1/imports/{id}/mapping/
POST /api/v1/imports/{id}/validate/
POST /api/v1/imports/{id}/commit/
GET  /api/v1/entities/{id}/
GET  /api/v1/entities/{id}/provenance/
POST /api/v1/exports/
```

## Phase 10 — Test bout en bout
Charger un XLSX, détecter feuilles, mapper, détecter erreurs, reconnaître client connu, signaler doublon ambigu, conserver provenance, confirmer import, retrouver entité persistée et exporter.

## Phase 11 — Connexion au scoring
Après stabilisation du schéma canonique : snapshot T0 -> features -> `ds_engine` -> résultat versionné.

## Priorités
**P0** : coeur Python, schéma canonique, CSV/XLSX, mapping, identité, provenance, qualité, persistance Django.

**P1** : API REST, UI mapping/aperçu, export, audit.

**P2** : connecteurs API, matching avancé, tâches asynchrones.
