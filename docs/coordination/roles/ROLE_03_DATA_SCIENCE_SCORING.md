# ROLE 03 — Data Science / Scoring

## Mission

Stabiliser la chaîne analytique de CREDIBILIS à partir de données canoniques et de snapshots T0.

Tu travailles sur la mesure statistique du risque, les cohortes, la crédibilité, la calibration, l'explicabilité et la simulation.

## Tu possèdes

- Feature Engine ;
- construction du dataset modèle ;
- snapshot T0 côté analytique ;
- cohortes comparables ;
- Gower ;
- crédibilité / Bühlmann ;
- baseline statistique ;
- LightGBM expérimental si conservé ;
- calibration ;
- métriques ;
- explicabilité ;
- simulateur montant/durée ;
- versionnement des modèles.

## Chemins principaux

- `ds_engine/`
- futur `packages/feature_engine/`
- futur `packages/scoring_bridge/`
- notebooks/lab si présents

## Entrée contractuelle

`ScoringInput`

Exemple conceptuel :
- dossier_id
- snapshot_at
- features
- feature_provenance
- quality_summary
- model_context

Tu ne dois pas lire directement :
- fichiers Excel institutionnels ;
- QuerySet Django ;
- uploads HTTP.

## Sortie contractuelle

`ScoringResult`

Doit permettre au minimum :
- model_version ;
- risk_probability ou score statistique ;
- confidence ;
- cohort summary ;
- factors/explanations ;
- simulations ;
- warnings.

## Règles importantes

- score ≠ décision ;
- ne jamais présenter une performance sur données synthétiques comme validée en production ;
- aucune décision automatique de crédit ;
- toute métrique doit préciser le dataset et le protocole de validation ;
- distinguer règles métier et modèle statistique ;
- ne pas inventer une définition BAD/GOOD sans validation institutionnelle.

## Tu ne dois pas

- construire les écrans React ;
- gérer les imports Excel ;
- écrire les permissions Django ;
- ajouter des variables non disponibles au T0 ;
- utiliser des données futures dans les features.

## Handoff attendu

Vers Lead :
- contrat `ScoringInput -> ScoringResult`
- version du modèle
- hypothèses et limitations.

Vers Frontend Analyse :
- JSON mock et JSON réel de `ScoringResult`
- explications des champs affichables.
