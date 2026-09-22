# Dictionnaire et Classification des Données — CREDIBILIS

Ce document formalise l'ontologie française, la taxonomie et la classification des données collectées et traitées dans la plateforme CREDIBILIS pour le micro-crédit et l'inclusion financière (UEMOA / Sahel).

---

## 1. Glossaire des Concepts Métier

| Terme Français | Définition & Rôle dans CREDIBILIS | Équivalent Technique Anglais |
|---|---|---|
| **Dictionnaire des données** | Référentiel central décrivant chaque donnée élémentaire collectée ou calculée, son type, sa criticité et ses règles. | *Data Dictionary* |
| **Définition de champ** | Spécification technique et métier d'une donnée (code, libellé, type, obligatoire/optionnel, validation). | *Field Definition* |
| **Définition de profil** | Segment socio-économique d'emprunteur déterminant les formulaires de collecte dynamiques (PME, Salarié, etc.). | *Profile Definition* |
| **Définition de produit de crédit** | Paramètres financiers d'un prêt (montant min/max, durée, taux, périodicité, garanties exigées). | *Product Definition* |
| **Cadre d'analyse** | Ensemble structuré de critères d'évaluation économique, financière et qualitative servant à l'instruction du dossier. | *Analysis Framework* |
| **Critère d'analyse** | Règle élémentaire d'appréciation (ex: ratio de couverture de dette $\ge 200\%$, moralité, antécédents). | *Analysis Criterion* |
| **Variable dérivée** | Donnée calculée à partir de données brutes collectées (ex: excédent brut d'exploitation, mensualité, taux d'effort). | *Derived Variable* |
| **Règle de notation** | Barème de points attribuant une note partielle ou globale sur 100 à une rubrique du dossier. | *Scoring Rule* |
| **Variable d'entrée du modèle** | Donnée nettoyée et figée transmise au moteur statistique pour estimer le risque (sans fuite temporelle). | *Feature* |
| **Résultat observé** | Constat réel a posteriori sur le crédit (remboursé sans incident, retard > 90 jours, défaut, rééchelonné). | *Outcome* |
| **Pièce justificative / Preuve** | Document légal ou contractuel prouvant la véracité d'une déclaration (CNI, NINA, RCCM, quittance, bail). | *Evidence* |
| **Provenance** | Traçabilité absolue de la source de chaque donnée (agent terrain, fichier Excel importé, consultation BIC). | *Provenance* |
| **Rapprochement d'entités** | Algorithme de détection de doublons et d'unification d'identités (gardes-fous stricts anti-homonymes). | *Entity Matching* |
| **Qualité des données** | Évaluation sur 5 dimensions (Complétude, Validité, Unicité, Cohérence, Traçabilité). | *Data Quality* |
| **Photographie à la date de décision** | État immuable de l'ensemble des données du dossier au moment où la décision d'octroi est prise ($T_0$). | *Snapshot T0* |

---

## 2. Classification des Données (Catégories Métier)

Chaque champ collecté appartient obligatoirement à l'une des 10 catégories suivantes :

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      CATÉGORIES DE DONNÉES                             │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. IDENTIFICATION        │ Nom, prénoms, date/lieu naissance, NINA, CNI│
│ 2. SEGMENTATION          │ Forme juridique, secteur d'activité, région │
│ 3. FINANCIER             │ CA annuel, bénéfice net, fonds propres, prêt│
│ 4. TRANSACTIONNEL        │ Mouvements DAV, dépôts 6 mois, retraits     │
│ 5. DOCUMENTAIRE          │ Fichiers PDF/images, statuts, bilans certif │
│ 6. CONFORMITE            │ Statut PPE, risque LAB/FT, bénéficiaire >25%│
│ 7. COMPORTEMENT          │ Respect des RDV d'agence, ponctualité       │
│ 8. HISTORIQUE            │ Prêts antérieurs Kafo, incidents, BIC UEMOA │
│ 9. QUALITATIF            │ Moralité, emplacement boutique, SWOT        │
│ 10. RESULTAT_OBSERVE     │ Statut final du prêt après déboursement     │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 3. Rôles Analytiques des Variables

Pour éviter toute confusion entre la collecte administrative et le scoring statistique, chaque champ reçoit un rôle analytique strict :

1. **`IDENTIFICATION_SEULE`** : Données nominatives et coordonnées (nom, téléphone, adresse). **Interdiction formelle d'entrer dans les modèles statistiques** (lutte contre les biais discriminatoires).
2. **`SEGMENTATION`** : Sert à router le dossier vers la cohorte comparable locale adéquate (distance de Gower).
3. **`VARIABLE_CANDIDATE`** : Variable quantitative ou ordinale éligible pour alimenter la formule de crédibilité de Bühlmann-Straub ou les modèles statistiques.
4. **`ENTREE_REGLE`** : Donnée utilisée par les règles métier prudentielles (ex: ratios BCEAO, seuil d'endettement $\le 33\%$, ratio couverture $\ge 200\%$).
5. **`PREUVE_SEULE`** : Document ou justificatif légal attestant de la validité d'une déclaration sans valeur numérique directe.
6. **`CONFORMITE_SEULE`** : Filtre d'exclusion réglementaire (gel des avoirs, liste noire UEMOA, PPE non autorisée).
7. **`RESULTAT_OBSERVE`** : Donnée cible d'apprentissage supervisé (ex: `STATUT_REMBOURSEMENT = DEFAUT_90J`).

---

## 4. Typologie Temporelle des Données

Afin de garantir l'absence de fuite d'information (*data leakage*) et de respecter le principe du **Snapshot $T_0$**, chaque donnée possède un type temporel :

- **`STATIQUE`** : Donnée invariable dans le temps (date de naissance, numéro RCCM d'immatriculation).
- **`VALEUR_ACTUELLE`** : État dynamique au moment de la consultation (solde du compte à l'instant t).
- **`PHOTOGRAPHIE_T0`** : Valeur gelée à la seconde précise où le comité de crédit statue. Elle ne peut plus jamais être modifiée même si la réalité évolue.
- **`SERIE_TEMPORELLE`** : Historique ordonné de points réguliers (les 6 derniers soldes mensuels moyens).
- **`EVENEMENT`** : Fait ponctuel daté (date du premier impayé, date du mariage, date de la visite d'exploitation).
- **`PERIODE`** : Intervalle de validité d'une situation (durée du bail commercial : du 01/01/2024 au 31/12/2026).
