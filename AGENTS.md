# AGENTS.md — Constitution de développement CREDIBILIS

Ce fichier s'applique à tous les humains et agents IA qui modifient le dépôt.

## 1. Lecture obligatoire

Avant de coder :

1. `README.md`
2. `docs/00_ARCHITECTURE_COMPLETE.md`
3. `docs/01_DECISIONS_ARCHITECTURE.md`
4. `docs/14_ETAT_ACTUEL_VS_CIBLE.md`
5. document du module concerné

## 2. Règle de dépendance

`packages/collecte` est Python pur.

Interdits dans le cœur :

```text
django.*
rest_framework.*
QuerySet
HttpRequest
HttpResponse
Model Django
```

Django peut importer le moteur. L'inverse est interdit.

## 3. Ne pas confondre cible et code existant

Un composant documenté peut ne pas encore être implémenté.

Toujours vérifier le dépôt réel avant d'annoncer qu'une capacité existe.

## 4. Plan avant modification importante

Répondre / documenter :

```text
OBJECTIF
FICHIERS MODIFIÉS
CONTRATS IMPACTÉS
TESTS
RISQUES
HORS PÉRIMÈTRE
```

## 5. Interdictions

Sans ADR explicite, ne pas :
- ajouter FastAPI ou Flask ;
- ajouter un microservice ;
- ajouter Celery/Redis ;
- ajouter une vector DB ;
- refactorer tout `ds_engine` ;
- déplacer toute l'arborescence ;
- créer une logique métier dans une view ou serializer ;
- utiliser `eval()` sur des formules externes ;
- fusionner des personnes sur nom/prénom seul.

## 6. Données synthétiques

Le dataset actuel est synthétique. Aucun chiffre de performance ne doit être présenté comme une validation réelle sans données réelles appropriées.

## 7. Tests

Pour le moteur de collecte : tests sans Django obligatoires.

Pour les adaptateurs Django : tests d'intégration séparés.

## 8. Documentation

Toute modification d'un contrat public ou d'une décision d'architecture met à jour les docs dans la même PR.

## 9. Rapport après implémentation

Toujours donner :

```text
FAIT
NON FAIT
TESTS EXÉCUTÉS
RÉSULTATS
LIMITES
DOCS MODIFIÉES
```

## 10. Vérité du projet

- le code décrit ce qui existe ;
- les docs décrivent la cible décidée ;
- une contradiction doit être signalée et résolue ;
- aucun agent ne doit inventer silencieusement une nouvelle architecture.
