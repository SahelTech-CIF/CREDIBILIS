# Plan d'Attaque — Implémentation du Système CREDIBILIS

## 1. Principes Directeurs
* **Séparation stricte** : Moteurs Python purs (`credibilis_collecte`, etc.) $\rightarrow$ Backend Django + DRF $\rightarrow$ Frontend React SPA.
* **Zéro Django Templates / Zéro HTMX / Zéro Alpine** : L'interface utilisateur est une SPA React indépendante consommant `/api/v1/...`.
* **Tests sans framework** : Les moteurs métier s'exécutent et se testent sans `DJANGO_SETTINGS_MODULE`.

---

## 2. Découpage par Phases et Jalons

### Phase 0 — Documentation & Alignement Équipe (Terminée)
* **Objectif** : Formaliser la constitution (`AGENTS.md`), le corpus d'architecture (`00` à `15`), les ADRs et les spécifications.
* **Livrable** : Répertoire `docs/` consolidé et synchronisé sur `main`.

### Phase 1 — Socle du Package `credibilis_collecte`
* **Objectif** : Créer le package Python pur et son architecture modulaire.
* **Contenu** :
  * Définition des structures de domaine : `RawRecord`, `CanonicalRecord`, `ExternalIdentifier`, `Provenance`, `DataIssue`, `ImportResult`.
  * Règle de dépendance : Aucun import `django.*` ou `rest_framework.*`.
* **Definition of Done** : `pytest packages/collecte/tests/` passe à 100% sans Django.

### Phase 2 — Schéma Canonique & Lecteurs Multi-Formats
* **Objectif** : Ingestion neutre des flux de données.
* **Contenu** :
  * Lecteurs : CSV (délimiteurs variables), Excel/XLSX/XLSM (multi-feuilles), JSON.
  * Inspection initiale (`inspect_source`) : extraction des feuilles, colonnes et métadonnées.

### Phase 3 — Moteur de Mapping & Normalisation
* **Objectif** : Réconciliation des terminologies hétérogènes vers le schéma canonique.
* **Contenu** :
  * Registre des profils de mapping par institution (KAFO, etc.).
  * Détection d'alias et suggestions automatiques.
  * Normalisation robuste : devises FCFA, numéros de téléphone MSISDN, dates, types catégoriels.

### Phase 4 — Validation & Moteur Data Quality
* **Objectif** : Détection des anomalies et calcul des scores d'intégrité.
* **Contenu** :
  * Classification des anomalies à 4 niveaux : `BLOCKING`, `ERROR`, `WARNING`, `INFO`.
  * Métriques de qualité : complétude, validité, cohérence, unicité, traçabilité.

### Phase 5 — Identité, Provenance & Rapprochement
* **Objectif** : Résolution d'entité et traçabilité par cellule.
* **Contenu** :
  * Génération d'identifiants internes universels (UUIDv7 ordonnançables).
  * Gestion des tuples `(institution_id, entity_type, identifier_type, value)`.
  * Rapprochement d'entités (Record Linkage) : matrice multicritère (téléphone, NINA, date naissance, caisse).
  * **Garde-fou** : Interdiction absolue de fusionner sur `nom + prénom` seul.
  * Matrice de provenance : source, agent, niveau de preuve, lot d'import.

### Phase 6 — Backend Django + Django REST Framework (DRF)
* **Objectif** : Hôte applicatif, persistance PostgreSQL, sécurité et API REST.
* **Contenu** :
  * Architecture en 11 apps spécialisées :
    * `accounts` (Auth, JWT access/refresh, RBAC).
    * `institutions` (Multi-tenant logique, agences, caisses).
    * `identities` (Entités, identifiants externes, fusions).
    * `dossiers` (Demandes de crédit, snapshots T0).
    * `collecte` (Orchestration des formulaires).
    * `imports` (Batches, uploads physiques, inspections).
    * `mappings` (Configurations de mapping persistées).
    * `quality` (Rapports Data Quality et diagnostics).
    * `documents` (Pièces justificatives, métadonnées).
    * `exports` (Génération des flux sortants).
    * `audit` (Journal légal des événements).
  * Séparation stricte dans chaque app : `models.py`, `serializers.py`, `selectors.py`, `services.py`, `permissions.py`, `api/views.py`.
  * **Interdiction formelle** : Pas de logique métier dans les vues DRF.

### Phase 7 — API REST d'Ingestion & Workflow d'Import
* **Objectif** : Exposer le cycle de vie complet de l'importation via `/api/v1/...`.
* **Workflow HTTP** :
  1. `POST /api/v1/imports/` (upload multipart).
  2. `GET /api/v1/imports/{id}/schema/` & `GET /api/v1/imports/{id}/mapping/` (inspection et suggestions).
  3. `PUT /api/v1/imports/{id}/mapping/` (ajustement interactif).
  4. `POST /api/v1/imports/{id}/validate/` (contrôle des règles métiers).
  5. `GET /api/v1/imports/{id}/quality/` (rapport de qualité).
  6. `GET /api/v1/imports/{id}/matches/` & `POST /api/v1/matches/{id}/resolve/` (résolution des doublons).
  7. `POST /api/v1/imports/{id}/commit/` (persistance transactionnelle atomique PostgreSQL).

### Phase 8 — Frontend React SPA : Ingestion & Dashboard
* **Objectif** : Interface utilisateur riche, moderne et performante.
* **Stack** : React 18+, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, TanStack Table, Recharts.
* **Écrans** :
  * Dashboard de supervision des flux.
  * Interface d'import avec glisser-déposer de fichiers Excel/CSV.
  * Matrice de mapping interactive avec drag & drop ou sélection intuitive.
  * Tableau TanStack Table des anomalies filtrables par sévérité.
  * Écran de résolution des doublons et ambiguïtés.

### Phase 9 — Frontend React SPA : Collecte Terrain (Wizard 10 Étapes)
* **Objectif** : Saisie fluide et guidée des dossiers de micro-crédit.
* **Contenu** :
  * Wizard en 10 étapes : Identité, Consentement, Ménage, Activité, Revenus/Charges, Dettes, Demande, Garanties, Documents, Synthèse.
  * Formulaires pilotés par React Hook Form + validation UX immédiate via Zod.
  * Mécanisme d'**autosave debounced** (requêtes `PATCH /api/v1/dossiers/{id}` sans bouton bloquant).
  * Télédéclaration et téléversement de justificatifs (photos, reçus Mobile Money).

### Phase 10 — Intégration du Moteur Décisionnel (`ds_engine`)
* **Objectif** : Pont entre les données canoniques et les modèles de scoring.
* **Contenu** :
  * Génération du `CreditApplicationSnapshot` (T0).
  * Exécution de l'algorithme de Bühlmann-Straub, de la recherche de cohorte Gower et du modèle LightGBM.
  * Restitution des 3 poids, de l'offre alternative anti-surendettement et des explications.

---

## 3. Stratégie de Branches Git

```text
main
  │
  ├── feat/01-collecte-core        (Package Python pur, domaine, lecteurs)
  ├── feat/02-collecte-engine      (Mapping, normalisation, validation, qualité, identité)
  ├── feat/03-backend-django-drf   (Apps Django, ORM, API REST /api/v1/...)
  ├── feat/04-frontend-react-spa   (Vite, Tailwind, shadcn/ui, TanStack Query/Table)
  └── feat/05-scoring-bridge       (Snapshot T0, liaison ds_engine et restitution)
```
