# CREDIBILIS — Cadre d'analyse, variables et règles

## 1. Chaîne conceptuelle

```text
DONNEE
↓
VARIABLE DERIVEE
↓
CRITERE
↓
REGLE
↓
NOTE / RESULTAT
```

Exemple :

```text
date_debut_activite
↓
anciennete_activite_mois
↓
ancienneté suffisante ?
↓
anciennete >= 60 mois
↓
2 points
```

## 2. Variable dérivée

```text
DefinitionVariableDerivee
- id
- code
- libelle
- description
- sources[]
- formule
- type_sortie
- unite
- profil
- produit
- institution
- disponible_t0
- version
- actif
```

Exemples :
- anciennete_entreprise_mois ;
- marge_disponible ;
- ratio_endettement ;
- croissance_ca ;
- volatilite_ca ;
- nombre_retards_12_mois ;
- retard_max_jours ;
- solde_moyen_6_mois.

## 3. Cadre d'analyse

```text
CadreAnalyse
- id
- code
- nom
- institution
- profil
- produit
- version
- actif
- date_debut_validite
- date_fin_validite
```

## 4. Section d'analyse

```text
SectionAnalyse
- cadre
- code
- libelle
- ordre
- poids
- score_max
```

## 5. Critère

```text
CritereAnalyse
- section
- code
- libelle
- description
- variable_source
- type_critere
- score_max
- ordre
- actif
```

Types :

```text
AUTOMATIQUE
MANUEL_QUALITATIF
MIXTE
```

## 6. Règle de notation

```text
RegleNotation
- critere
- operateur
- valeur_seuil
- valeur_seuil_2
- score
- priorite
- commentaire
- actif
```

Les seuils sont des politiques d'institution, pas des vérités universelles.

## 7. Évaluation qualitative

```text
EvaluationQualitative
- dossier
- critere
- valeur
- note
- evaluateur
- date_evaluation
- justification
- source
```

## 8. Scorecard ≠ modèle statistique

CREDIBILIS doit supporter séparément :
- grille à points ;
- ratios métier ;
- modèle statistique ;
- combinaison contrôlée.

## 9. Règle T0

Toute donnée utilisée dans une analyse à la décision doit être disponible au T0.

Les résultats futurs comme le défaut ou le retard final sont des `RESULTAT_OBSERVE`.

## 10. Versionnement

Un dossier conserve :
- version du cadre ;
- version des variables ;
- version des règles ;
- valeurs utilisées ;
- résultats calculés.
