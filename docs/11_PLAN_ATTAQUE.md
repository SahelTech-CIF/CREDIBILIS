# Plan Technique Complet de CREDIBILIS — Architecture et Jalons d'Implémentation

Ce document constitue la feuille de route technique et la référence opérationnelle pour l'ensemble des développeurs et agents IA travaillant sur le projet CREDIBILIS.

---

## 1. Architecture Cible Globale

```text
                         REACT (SPA)
                             │
                          REST/JSON
                             │
                             ▼
                      DJANGO + DRF
                             │
                    SERVICES APPLICATIFS
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
 MOTEUR COLLECTE        MOTEUR ANALYSE      MOTEUR INTELLIGENCE
   Python pur            métier/config          Python pur
  (packages/collecte)   (packages/analyse)   (packages/intelligence)
        │                    │                    │
        │                    │            ┌───────┴────────┐
        │                    │            ▼                ▼
        │                    │        DeepSeek          Local
        │                    │         (Cloud)      (Ollama/vLLM)
        │                    │
        └─────────────┬──────┴─────────────┐
                      ▼                    ▼
                 POSTGRESQL           ds_engine
                                           │
                                           ▼
                                  Analyse quantitative
                                           │
                      ┌────────────────────┴────────────────────┐
                      ▼                                         ▼
               Analyse factuelle                         Analyse qualitative
                                                           + LLM (auditée)
                      └────────────────────┬────────────────────┘
                                           ▼
                                  RAPPORT DE DOSSIER
                                           │
                                           ▼
                                   DÉCISION HUMAINE
```

---

## 2. Socle et Structure Définitive du Dépôt

```text
CREDIBILIS/
│
├── backend/
│   ├── manage.py
│   ├── config/
│   └── apps/
│       ├── comptes/          # Authentification, JWT, RBAC
│       ├── institutions/      # Multi-tenant logique, agences, caisses
│       ├── profils/           # Profils métier et entités
│       ├── produits/          # Produits de micro-crédit
│       ├── dictionnaire/      # Définition configurable des données canoniques
│       ├── collecte/          # Modèles de collecte et formulaires dynamiques
│       ├── dossiers/          # Demandes de crédit, snapshots T0, valeurs
│       ├── documents/         # Pièces justificatives et preuves
│       ├── analyse/           # Cadres d'analyse, variables dérivées, règles
│       ├── intelligence/      # Adaptateur Django vers credibilis_intelligence
│       └── audit/             # Journalisation immuable et traçabilité
│
├── frontend/                  # React 18+ SPA (Vite, TypeScript, Tailwind, shadcn/ui)
│
├── packages/
│   ├── collecte/
│   │   └── credibilis_collecte/      # Ingestion, mapping, normalisation, qualité
│   │
│   ├── analyse/
│   │   └── credibilis_analyse/       # Variables dérivées, ratios, contradictions, cadres
│   │
│   └── intelligence/
│       └── credibilis_intelligence/  # Fournisseurs IA (DeepSeek, Local, Mock), routeur, tâches
│
├── ds_engine/                 # Risque statistique, cohortes Gower, Bühlmann-Straub, LightGBM
├── docs/                      # Corpus documentaire de référence (00 à 16)
└── tests/                     # Tests d'intégration transversaux
```

### Règle d'or de dépendance
- **`packages/*`** : Python pur, testable sans Django, sans ORM, sans SQL.
- **`backend/`** : Django, ORM, DRF, sécurité, transactions, permissions.
- **`frontend/`** : React SPA uniquement, consommant exclusivement `/api/v1/...`.
- **`ds_engine/`** : Modèles statistiques et d'apprentissage, alimentés par un snapshot canonique.

---

## 3. Les 12 Briques d'Implémentation (P0 à P11)

### Brique P0 — Dictionnaire Configurable des Données (`DefinitionDonnee`)
Le socle absolu. Aucune donnée n'est collectée sans définition préalable.
- **Attributs clés** : code, libellé, description, catégorie métier, type de donnée, temporalité, unité, devise, rôle analytique, sensibilité, sources autorisées, niveau de vérification requis, usages autorisés.
- **Classifications fondamentales** :
  - *Nature* : `FACTUELLE`, `DECLAREE`, `OBSERVEE`, `APPRECIATION_QUALITATIVE`, `DERIVEE`, `RESULTAT_OBSERVE`.
  - *Temporalité* : `STATIQUE`, `VALEUR_ACTUELLE`, `PHOTOGRAPHIE_T0`, `PERIODE`, `EVENEMENT`, `SERIE_TEMPORELLE`.
  - *Rôle analytique* : `IDENTIFICATION_SEULE`, `DESCRIPTION`, `SEGMENTATION`, `VARIABLE_CANDIDATE`, `ENTREE_REGLE`, `VARIABLE_DERIVEE`, `PREUVE`, `CONFORMITE`, `RESULTAT_OBSERVE`, `DECISION`.

### Brique P1 — Profils et Produits de Crédit
- **Profils V1** : `SALARIE`, `COMMERCANT`, `AGRICULTEUR`, `ELEVEUR`, `ARTISAN`, `MICRO_ENTREPRISE`, `PME`, `PERSONNE_MORALE`.
  - Hiérarchisation : un commerçant est une sous-catégorie d'activité indépendante.
  - Multi-profils possibles pour une même entité physique, mais chaque dossier possède un unique `profil_instruction`.
- **Produits V1** : `CREDIT_SALAIRE`, `CREDIT_FONDS_ROULEMENT`, `CREDIT_EQUIPEMENT`, `CREDIT_INTRANTS`, `CREDIT_CAMPAGNE`.

### Brique P2 — Constructeur de Collecte (`ModeleCollecte`)
- Formulaire résolu dynamiquement via l'équation :
  $$\text{Formulaire} = (\text{Champs globaux} + \text{Champs profil} + \text{Champs produit} + \text{Surcharges institution}) - \text{Champs désactivés} + \text{Conditions}$$
- Le frontend React ne code aucune condition en dur (`if (profil === 'AGRICULTEUR')`), il consomme `GET /api/v1/configurations/resoudre/?profil=...&produit=...`.

### Brique P3 — Collecte Réelle & Formulaires Dynamiques
- Modèles `DossierCredit`, `ValeurDonnee`, `ProvenanceDonnee`.
- Une même variable peut avoir plusieurs valeurs provenant de sources distinctes (ex. CA déclaré par le client vs CA constaté sur relevé de compte) $\rightarrow$ permet la détection d'écarts.

### Brique P4 — Provenance et Crédibilité de la Donnée
- Traçabilité granulaire : valeur, source, date, agent, document, niveau de vérification, fraîcheur.
- Calcul de l'**Indice de Confiance du Dossier** (ex. 68% = 55% vérifiées + 30% déclarées + 15% importées).

### Brique P5 — Variables Dérivées
- `DefinitionVariableDerivee` : formules auditables et déterministes.
- Exemples : `anciennete_activite_mois`, `marge_disponible`, `ratio_endettement`, `croissance_ca_3_ans`, `volatilite_ca`, `nombre_retards_12_mois`, `solde_moyen_6_mois`.

### Brique P6 — Analyse Quantitative
- Moteur déterministe de calcul des ratios financiers (endettement, pression de remboursement).
- Pont d'extraction vers `ds_engine` (`ScoringInput`).

### Brique P7 — Analyse Qualitative
- `CritereQualitatif` & `EvaluationQualitative`.
- Critères évalués : maîtrise de l'activité, qualité de gestion, cohérence du projet, stabilité.
- Chaque évaluation conserve le niveau, la justification textuelle de l'agent, et les preuves rattachées.

### Brique P8 — Couche IA Indépendante (`credibilis_intelligence`)
- Découplage complet vis-à-vis des fournisseurs (`FournisseurFactice`, `FournisseurDeepSeek`, `FournisseurLocal`).
- Aiguillage intelligent par `RouteurIA` avec **règle d'or de non-fuite** : données sensibles avec modèle local indisponible $\rightarrow$ **abstention IA stricte** (aucun fallback cloud silencieux).
- Sorties strictement structurées validées par des schémas Pydantic.
- Tâches spécialisées : `analyse_qualitative`, `detecter_contradictions`, `synthetiser_dossier`, `diagnostic_donnees_manquantes`.

### Brique P9 — Cadres d'Analyse Métier
- `CadreAnalyse`, `SectionAnalyse`, `CritereAnalyse`, `RegleNotation`.
- Règles et seuils configurables par institution sans modification de code.

### Brique P10 — Simulation d'Offre Responsable
- Simulateur multi-scénarios (montant, durée, taux, périodicité) recalculant l'échéance et la marge résiduelle.
- Aide à la décision : aucun scénario n'est automatiquement accordé sans validation humaine.

### Brique P11 — Rapport Global de Décision
- Document de synthèse consolidé pour le comité de crédit : qualité des données, analyse financière, analyse qualitative, contradictions, données manquantes, scoring statistique, simulations, synthèse IA auditée, avis agent, décision finale humaine.

---

## 4. Premier Jalon Concret (La Colonne Vertébrale End-to-End)

Avant de construire 50 écrans ou 100 règles, l'équipe livre et valide le flux de bout en bout :

```text
Admin crée profil AGRICULTEUR
        ↓
Admin crée produit CREDIT_INTRANTS
        ↓
Admin configure données et sections
        ↓
Admin publie la configuration de collecte
        ↓
Agent crée un dossier AGRICULTEUR
        ↓
React génère automatiquement le formulaire dynamique
        ↓
Agent remplit et soumet les informations
        ↓
Django stocke les valeurs et la provenance
        ↓
Moteur calcule les variables dérivées
        ↓
Analyse qualitative exécutée (FournisseurFactice)
        ↓
Rapport décisionnel minimal produit
```

---

## 5. Répartition Opérationnelle de l'Équipe

| Rôle | Périmètre | Responsabilités principales |
|---|---|---|
| **Lead / Architecture** | Django, DRF, PostgreSQL, Contrats | Modèles relationnels, migrations, sécurité RBAC, transactions, cohérence |
| **Membre Collecte** | Ingestion, Moteur de collecte | `DefinitionDonnee`, normalisation, provenance, calcul indice qualité |
| **Membre Métier** | Règles, Cadres d'analyse | Profils, produits, cadres d'analyse, critères qualitatifs, seuils de notation |
| **Membre Data / IA** | DS Engine & Intelligence | `credibilis_intelligence`, prompts versionnés, pont scoring, modèles locaux |
| **Membre Frontend** | React SPA | Configuration crédit, formulaires dynamiques, visualisation des dossiers, thème Light |

---

## 6. Règle d'Architecture Inviolable

> **CREDIBILIS ne dépend pas d'un formulaire, d'une institution, d'un profil, d'un modèle IA ou d'un algorithme unique.**  
> **Tout le système est articulé autour de contrats configurables, vérifiables et auditables.**
