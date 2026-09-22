# CREDIBILIS — Sprint courant

## Objectif collectif
Obtenir un parcours fonctionnel de collecte et préparation de données :

`Excel/CSV -> import -> mapping -> validation -> qualité -> rapprochement -> persistance -> Client 360`

## Priorités P0
- moteur `credibilis_collecte` isolé de Django ;
- schéma canonique ;
- import Excel/CSV ;
- mapping ;
- normalisation ;
- validation ;
- identification / rapprochement ;
- provenance ;
- Data Quality ;
- persistance Django ;
- API DRF ;
- écrans React de collecte.

## Hors périmètre sauf décision explicite
- refonte complète de `ds_engine` ;
- nouveau framework backend ;
- Kubernetes ;
- Kafka ;
- MCP de production ;
- Core Banking complet ;
- encaissement/décaissement ;
- automatisation de la décision de crédit.
