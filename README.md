# CREDIBILIS

Infrastructure d'aide à la décision de crédit pour institutions financières et microfinances.

## À lire avant de développer

- [Règles agents et développeurs](AGENTS.md)
- [Documentation](docs/README.md)
- [Architecture complète](docs/00_ARCHITECTURE_COMPLETE.md)
- [État actuel vs cible](docs/14_ETAT_ACTUEL_VS_CIBLE.md)

## Vision

CREDIBILIS est composé de moteurs Python indépendants orchestrés par une application Django/DRF.

```text
Sources institutionnelles
    -> Moteur de collecte Python
    -> Schéma canonique
    -> Django / PostgreSQL
    -> Dossier T0
    -> Analyse métier
    -> Feature Engine
    -> ds_engine
    -> Aide à la décision
    -> Workflow humain
```

## Priorité actuelle

**Construire le moteur de collecte de données.**

Il doit gérer :

- CSV / XLSX / JSON ;
- import et export ;
- mapping par institution ;
- normalisation ;
- validation ;
- identification unique ;
- rapprochement de doublons ;
- provenance ;
- data quality.

Il doit être testable sans Django.

## Stack cible

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL

### Collecte
- Python pur pour le domaine
- pandas / openpyxl aux frontières fichiers lorsque utile

### Data Science existant
- pandas
- NumPy
- scikit-learn
- LightGBM
- NetworkX
- joblib

### Frontend cible
- React
- TypeScript

## État actuel

`ds_engine/` existe déjà. Les autres modules de l'application métier sont progressivement à construire.

Les données actuelles du moteur sont synthétiques : ne pas présenter ses performances comme une validation sur données réelles.
