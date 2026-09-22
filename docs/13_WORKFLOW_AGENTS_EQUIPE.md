# Workflow d'Équipe (5 Personnes) & Gouvernance des Agents IA

## 1. Répartition des Responsabilités (Équipe de 5)

Pour éviter les goulots d'étranglement et le travail redondant, les frontières techniques entre les 5 membres sont strictement étanches :

| Rôle & Membre | Responsabilité Principale | Fichiers / Périmètres Dédiés | Ne Doit Pas Toucher Principalement À |
|---|---|---|---|
| **Toi — Lead Technique / Intégrateur** | Architecture globale, Django/DRF, authentification, multi-institution, verrouillage des 4 contrats, intégration générale, PR reviews, démo finale. | `backend/config/`, `backend/apps/institutions/`, `backend/apps/accounts/`, `backend/api/`, `docs/`, `AGENTS.md` | Entraînement ML détaillé, design de tous les écrans. |
| **Membre 2 — Data Engineer / Moteur Collecte** | Package pure Python `credibilis_collecte`, parsing Excel multi-feuilles, mapping, identité, provenance, Data Quality, normalisation, export. | `packages/collecte/` | Interface React, scoring `ds_engine/`. |
| **Membre 3 — Data Scientist / Scoring** | Feature Engine, snapshot T0, cohortes Gower, crédibilité Bühlmann-Straub, calibration LightGBM, explications, simulation. | `ds_engine/`, `feature_engine/`, `scoring/` | Formulaires Django, écrans React. |
| **Membre 4 — Frontend Collecte** | Parcours amont : upload, inspection, mapping interactif, validation, qualité, formulaires dynamiques (PME, Salarié, Agricole, Artisan). | `frontend/src/features/collecte/`, `imports/`, `clients/`, `quality/` | Logique métier backend, calcul de score. |
| **Membre 5 — Frontend Analyse & Décision** | Parcours aval : Client 360, fiche analyse PME vs Salarié, restitution score, explication 3-tiers, simulateur d'offre alternative, workflow décisionnel. | `frontend/src/features/dossiers/`, `dashboard/`, `rapprochement/` | Algorithmes DS, calculs de distance Gower. |

---

## 2. Les 4 Contrats Fondamentaux à Figer

Chaque membre peut développer et tester son module de manière autonome grâce à ces 4 contrats stables :

```text
┌────────────────────────┐
│  MEMBRE 2 — COLLECTE   │
└───────────┬────────────┘
            │
            │ Contrat A : CanonicalRecord, ImportResult, DataIssue, Provenance, MatchResult
            ▼
┌────────────────────────┐                  ┌────────────────────────┐
│    TOI — LEAD DJANGO   │── Contrat B ────>│   MEMBRE 3 — SCORING   │
│       Hôte / ORM       │<─ Contrat C ─────│       ds_engine        │
└───────────┬────────────┘  (ScoringInput   └────────────────────────┘
            │               / ScoringResult)
            │
            │ Contrat D : OpenAPI / JSON (/api/v1/...)
            ▼
┌────────────────────────┴────────────────────────┐
│               FRONTEND REACT                    │
│  MEMBRE 4 (Collecte)    /   MEMBRE 5 (Décision) │
└─────────────────────────────────────────────────┘
```

### Contrat A — Collecte $\rightarrow$ Django
* Objets : `CanonicalRecord`, `ImportResult`, `DataIssue`, `ProvenanceItem`, `MatchResult`.
* Le moteur de collecte livre ces objets en mémoire ; Django les persiste dans PostgreSQL via `ImportBatch`, `ImportedRecord` et `DataProvenance`.

### Contrat B — Django $\rightarrow$ Data Science (`ScoringInput`)
* Payload figé T0 contenant les variables économiques canoniques nettoyées, l'historique d'échéances et les métadonnées de cohorte.

### Contrat C — Data Science $\rightarrow$ Django (`ScoringResult`)
* Structure standardisée :
```json
{
  "model_version": "v0.1",
  "dossier_id": "CLI-2026-0001",
  "score_credibilis": 88.4,
  "weights": {
    "score_sur_100": 88.4,
    "w_ind_pct": 60.0,
    "w_local_pct": 32.0,
    "w_reseau_pct": 8.0
  },
  "risk": {
    "probability_repayment": 0.88
  },
  "confidence": 0.84,
  "cohort": {
    "size": 24,
    "stability": 0.84
  },
  "alternative_offer": null,
  "factors": [
    {"criterion": "Membre actif d'une Tontine", "impact": "+18 pts", "type": "positif"}
  ],
  "warnings": []
}
```

### Contrat D — Django $\rightarrow$ Frontend React
* Spécification OpenAPI 3.0 des endpoints `/api/v1/...` permettant aux Membres 4 et 5 de mocker l'API sans attendre que le backend soit terminé.

---

## 3. Stratégie de Branches Git Permanentes

Personne ne développe directement sur `main`. Le travail s'organise sur 5 branches parallèles :

```text
main
  │
  ├── feature/data-collection         (Membre 2 — Moteur de collecte)
  ├── feature/scoring                 (Membre 3 — Data Science & calibration)
  ├── feature/frontend-collection     (Membre 4 — Ingestion & formulaires dynamiques)
  ├── feature/frontend-analysis       (Membre 5 — Client 360 & décision)
  └── feature/platform-integration    (Toi — Lead, Django DRF & intégration générale)
```

### Protocole de Merge :
1. Chaque PR doit être validée par les tests automatisés (`pytest` / `npm run build`).
2. Revue obligatoire par le Lead Technique avant tout merge sur `main`.
3. Interdiction de modifier l'architecture globale sans ADR préalable.

---

## 4. Directive Impérative pour les Agents IA de l'Équipe

Lorsqu'un membre collabore avec un agent IA, il **ne doit jamais lui donner l'instruction globale « améliore tout CREDIBILIS »**.

### Modèle de prompt à fournir à chaque agent :
```text
Tu es l'agent dédié au workstream [COLLECTION | SCORING | FRONT_COLLECTE | FRONT_ANALYSE].

RÈGLES STRICTES :
1. Lis impérativement docs/00_ARCHITECTURE_COMPLETE.md, docs/01_DECISIONS_ARCHITECTURE.md et AGENTS.md.
2. Ton périmètre exclusif est [ex: packages/collecte/].
3. Tu n'as AUCUNE autorité sur l'architecture globale, les autres modules ou le backend Django.
4. Tes sorties doivent respecter strictement le Contrat [A, B, C ou D].
5. Présente toujours ton plan avant modification (OBJECTIF, FICHIERS, CONTRATS, TESTS, RISQUES).
```

Cette discipline garantit que les 5 workstreams progressent à vitesse maximale en parallèle sans aucun conflit architectural.
