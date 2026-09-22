# CREDIBILIS — Index Données, Profils et Configuration

## Objectif
Cette documentation formalise le cœur configurable de CREDIBILIS.

Les documents terrain reçus (PME, salarié, personne morale, grille d'analyse, historique institutionnel) sont des références métier. Ils ne doivent pas devenir des formulaires universels codés en dur.

## Principe central

```text
ENTITÉ
  ↓
PROFIL(S)
  ↓
PROFIL D'INSTRUCTION DU DOSSIER
  +
PRODUIT DE CRÉDIT
  +
INSTITUTION
  ↓
CONFIGURATION DE COLLECTE
  ↓
DONNÉES
  ↓
VALIDATION / PROVENANCE / QUALITÉ
  ↓
VARIABLES DÉRIVÉES
  ↓
CADRE D'ANALYSE
  ↓
SCORING / MODÈLE / EXPLICATION
  ↓
DÉCISION HUMAINE
```

## Documents
1. `01_DICTIONNAIRE_ET_CLASSIFICATION_DES_DONNEES.md`
2. `02_PROFILS_ENTITES_ET_PRODUITS.md`
3. `03_MOTEUR_DE_COLLECTE_CONFIGURABLE.md`
4. `04_CADRE_ANALYSE_VARIABLES_REGLES.md`
5. `05_DONNEES_GEOGRAPHIQUES_ET_SENSIBLES.md`
6. `06_IMPLEMENTATION_V0.md`

## Règle fondamentale
Une donnée collectée n'est pas automatiquement une variable de scoring. Chaque donnée doit déclarer ce qu'elle représente, à qui elle s'applique, quand elle existe, d'où elle vient, si elle est sensible, comment elle doit être vérifiée et pour quels usages elle est autorisée.
