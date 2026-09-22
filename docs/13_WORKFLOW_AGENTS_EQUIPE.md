# Workflow de travail — humains + agents IA

## 1. Pourquoi

Plusieurs membres utilisent des agents. Sans protocole, chaque agent peut refactorer différemment le même projet.

## 2. Avant toute tâche

L'agent doit lire :

```text
AGENTS.md
00_ARCHITECTURE_COMPLETE.md
01_DECISIONS_ARCHITECTURE.md
le document du module concerné
```

## 3. Format du plan obligatoire

Avant d'écrire :

```text
OBJECTIF
FICHIERS À MODIFIER
CONTRATS IMPACTÉS
TESTS À AJOUTER
RISQUES
HORS PÉRIMÈTRE
```

## 4. Pendant le développement

- petites unités cohérentes ;
- pas de gros refactor opportuniste ;
- pas de framework supplémentaire sans ADR ;
- ne pas dupliquer la logique d'un moteur dans Django.

## 5. Après

Rapport :

```text
FAIT
NON FAIT
TESTS EXÉCUTÉS
RÉSULTATS
LIMITES
DOCS MISES À JOUR
```

## 6. Conflits

Si deux branches touchent architecture/contrats : arbitrage humain avant merge.

## 7. Fichiers sensibles

Coordination obligatoire pour :
- AGENTS.md ;
- architecture ;
- ADR ;
- schéma canonique ;
- contrats publics ;
- migrations Django ;
- ds_engine/config.py ;
- ds_engine/predictor.py.
