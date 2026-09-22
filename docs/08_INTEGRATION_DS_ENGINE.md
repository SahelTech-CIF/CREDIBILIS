# Intégration avec `ds_engine`

## 1. État actuel

`ds_engine` existe déjà et contient notamment :
- moteur de cohorte ;
- crédibilité ;
- modèle LightGBM optionnel ;
- simulation d'offre ;
- configuration d'alias ;
- génération de données synthétiques.

## 2. Problème à éviter

Le moteur Data Science actuel accepte des dictionnaires relativement simples. L'application métier, elle, possède des données beaucoup plus riches.

Ne pas connecter directement les modèles Django à `predictor.py`.

## 3. Pont cible

```text
CreditApplicationSnapshot
        +
FeatureSnapshot
        |
        v
scoring_bridge
        |
        v
DSInput
        |
        v
ds_engine
        |
        v
ScoringResult
```

## 4. `DSInput`

Contrat conceptuel :

```text
client_id
application_id
as_of_date
features
quality_summary
feature_schema_version
model_version?
```

Le scoring bridge est responsable de convertir les concepts canoniques vers les clés attendues par la version du moteur.

## 5. Résultat

```text
ScoringResult
- model_version
- score
- probability?
- confidence?
- cohort_info?
- explanation?
- simulation?
- warnings
```

## 6. Important

Le dataset du dépôt est synthétique. Les performances du modèle ne doivent pas être présentées comme des performances validées sur une population réelle.

## 7. Migration progressive

Court terme : préserver les fonctions existantes.

Moyen terme :
- versionner le contrat d'entrée ;
- versionner les artefacts ;
- isoler entraînement vs inférence ;
- séparer estimation statistique et règles de décision.
