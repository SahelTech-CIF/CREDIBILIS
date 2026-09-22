# État actuel vs cible

Ce fichier évite aux agents de croire que des composants documentés existent déjà.

| Composant | État actuel | Cible |
|---|---|---|
| `ds_engine` | Existe | Conserver + versionner |
| Données synthétiques | Existe | Laboratoire uniquement |
| Moteur collecte indépendant | À créer | P0 |
| Schéma canonique | À créer | P0 |
| Import CSV/XLSX générique | À créer | P0 |
| Mapping institutionnel | À créer | P0 |
| Identité / rapprochement | À créer | P0 |
| Provenance | À créer | P0 |
| Data Quality | À créer | P0 |
| Django project | À créer | P0 après core collecte |
| PostgreSQL | À configurer | P0 |
| API REST | À créer | P1 |
| Frontend import | À créer | P1 |
| Dossier de crédit PME | À créer | P1 |
| Dossier salarié | À créer | P1 |
| Analyse configurable | À créer | P1/P2 |
| Feature engine | À créer | P1/P2 |
| Scoring bridge | À créer | P1/P2 |
| Workflow comité | À créer | P2 |
| Audit complet | À créer progressivement | P1 |

## Règle

La documentation décrit la **cible décidée**. Le code décrit l'**état réel**.

Un agent ne doit jamais annoncer qu'un composant est implémenté uniquement parce qu'il est documenté ici.
