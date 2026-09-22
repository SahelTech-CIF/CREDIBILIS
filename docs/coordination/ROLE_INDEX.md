# Index des rôles — CREDIBILIS

| Rôle | Fichier | Périmètre principal |
|---|---|---|
| Lead / Intégration | `roles/ROLE_01_LEAD_INTEGRATION.md` | Architecture, contrats, Django/DRF central, intégration |
| Backend Data / Collecte | `roles/ROLE_02_BACKEND_DATA_COLLECTE.md` | `credibilis_collecte`, import, mapping, identité, provenance, qualité |
| Data Science / Scoring | `roles/ROLE_03_DATA_SCIENCE_SCORING.md` | Features, cohortes, scoring, calibration, explicabilité |
| Frontend Collecte | `roles/ROLE_04_FRONTEND_COLLECTE.md` | Wizard collecte, imports, mapping, qualité, clients |
| Frontend Analyse / Décision | `roles/ROLE_05_FRONTEND_ANALYSE_DECISION.md` | Client 360, analyse, scoring, simulation, workflow |

## Principe de collaboration

Chaque agent possède :
- un périmètre ;
- des fichiers qu'il peut modifier ;
- des contrats d'entrée/sortie ;
- des responsabilités ;
- des interdictions ;
- un handoff attendu.

Les agents communiquent via :
- `TEAM_STATUS.md`
- `HANDOFFS.md`
- `BLOCKERS.md`
- les Pull Requests Git.
