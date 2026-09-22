# CREDIBILIS

Infrastructure d'aide à la décision de crédit pour institutions financières et microfinances.

## État actuel
Le dépôt contient un moteur Data Science expérimental dans `ds_engine/`. La nouvelle priorité est l'**application métier**, en commençant par un moteur de collecte indépendant.

## Décisions retenues
- Django + Django REST Framework pour l'application, les API, l'authentification, les permissions et la persistance.
- PostgreSQL pour la base de données.
- Un moteur de collecte **Python indépendant de Django** pour import/export, mapping, normalisation, validation, identité, rapprochement, provenance et qualité.
- `ds_engine/` reste séparé et consomme des données canoniques préparées en amont.
- Le scoring est une aide à la décision, pas la décision elle-même.

> Les données présentes dans le dépôt sont synthétiques. Elles ne constituent pas une validation statistique sur une population réelle.

## Architecture
```text
Sources institutionnelles
CSV / XLSX / JSON / API
          |
          v
Moteur de collecte Python
          |
          v
Schéma canonique
          |
          v
Django / DRF / PostgreSQL
          |
          +---- Application métier
          |
          +---- ds_engine
                    |
                    v
             Aide à la décision
```

## Priorité V1 : moteur de collecte
Responsabilités : lire des sources, mapper vers un schéma canonique, normaliser, valider, conserver la provenance, identifier les entités, rapprocher les doublons, produire des diagnostics de qualité et exporter.

## Documentation de référence
- [Architecture](docs/Architecture.md)
- [Décisions d'architecture](docs/01_DECISIONS_ARCHITECTURE.md)
- [Spécification du moteur de collecte](docs/02_MOTEUR_COLLECTE.md)
- [Contrats de données](docs/03_CONTRATS_DONNEES.md)
- [Plan d'attaque](docs/04_PLAN_ATTAQUE.md)
- [Règles pour développeurs et agents IA](AGENTS.md)

## Règle d'équipe
Avant toute modification structurante, lire la documentation. Si le code et les docs se contredisent, signaler la contradiction, prendre une décision, la documenter, puis coder.
