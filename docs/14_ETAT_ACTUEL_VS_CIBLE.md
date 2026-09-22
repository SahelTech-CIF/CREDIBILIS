# État actuel vs cible

Ce fichier permet aux développeurs et agents de connaître précisément ce qui est implémenté et ce qui reste à construire.

| Composant | État actuel | Règle / Emplacement |
|---|---|---|
| `ds_engine` | **Existe** | Modèles expérimentaux (cohortes Gower, Bühlmann-Straub, LightGBM) |
| Données synthétiques | **Existe** | Pour benchmarks et laboratoire uniquement |
| `credibilis_collecte` | **Implémenté & testé** | `packages/collecte/credibilis_collecte` (Python pur) |
| Schéma canonique & mapping | **Implémenté & testé** | Lecteurs CSV/Excel, normalisation FCFA/MSISDN, alias KAFO |
| Identité & rapprochement | **Implémenté & testé** | Linkage multicritère (téléphone, NINA, date naiss., caisse) |
| Provenance & Data Quality | **Implémenté & testé** | Détection d'anomalies (BLOCKING à INFO), score intégrité |
| `credibilis_credit` | **Implémenté & testé** | `packages/credit/credibilis_credit` (Cadres analyse PME, scoring) |
| `credibilis_intelligence` | **Implémenté & testé** | `packages/intelligence/credibilis_intelligence` (Python pur, Routeur, Mock/DeepSeek/Local) |
| Backend Django + DRF | **Implémenté** | `backend/` (Apps, ORM, endpoints REST) |
| Frontend React SPA | **Implémenté** | `frontend/` (React 18+, Vite, 100% Thème Light, 0 dark mode) |
| Écrans UI V0 | **Implémentés** | Dashboard, Import, Rapprochement, Décision, Liste PME, Collecte dynamique, Studio Config |
| Architecture MCP Agentique | **Spécifiée** | `docs/05_ARCHITECTURE_MCP_AGENTIQUE.md` (Agent $\to$ MCP $\to$ DRF $\to$ DB) |
| Architecture Intelligence | **Spécifiée** | `docs/16_COUCHE_INTELLIGENCE_ET_FOURNISSEURS_IA.md` (Contrat FournisseurIA) |
| Plan technique complet | **Spécifié** | `docs/11_PLAN_ATTAQUE.md` (Briques P0 à P11) |
| **P0 : DefinitionDonnee** | **En cours / Prochaine brique** | `backend/apps/dictionnaire/` |
| **P1 : Profils & Produits hiérarchiques** | **À créer** | `backend/apps/profils/`, `produits/` |
| **P2 : Configuration Crédit (Moteur)** | **À créer** | `ModeleCollecte`, `SectionCollecte`, `ChampCollecte` |
| **P3 : Collecte réelle (ValeurDonnee)** | **À créer** | Persistance multi-sources et multi-preuves |
| **P4 : Provenance & Confiance dossier** | **À créer** | Calcul dynamique de l'indice de crédibilité |
| **P5 : Variables dérivées déterministes** | **À créer** | Moteur de calcul auditable |
| **P6 : Analyse quantitative & Bridge DS** | **À finaliser** | Snapshot T0 $\to$ `ScoringInput` $\to$ `ds_engine` |
| **P7 : Analyse qualitative structurée** | **À finaliser** | Critères & évaluations dans Django |
| **P9 : Cadres d'analyse configurables** | **À finaliser** | Persistance des seuils par institution |
| **P10 : Simulateur d'offres responsables** | **À finaliser** | Multi-scénarios anti-surendettement |
| **P11 : Rapport global de décision** | **À créer** | Document décisionnel pour le comité de crédit |

## Règle fondamentale

La documentation décrit la **cible décidée**. Le code décrit l'**état réel**.

Un agent ne doit jamais annoncer qu'un composant est implémenté uniquement parce qu'il est documenté.
