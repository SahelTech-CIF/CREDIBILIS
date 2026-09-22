# Décisions d'architecture

## ADR-001 — Django est l'hôte applicatif
**Statut : accepté**

Django + Django REST Framework sont retenus pour HTTP/API, auth, permissions, ORM, persistance, administration et orchestration. FastAPI/Flask ne sont pas retenus pour la V1 métier.

## ADR-002 — Le moteur de collecte est indépendant de Django
**Statut : accepté**

Le coeur de collecte est un package Python pur. Aucun import `django.*` ou `rest_framework.*` dans ce package.

## ADR-003 — Identifiant interne + identifiants externes
**Statut : accepté**

Chaque entité possède un ID CREDIBILIS interne. Les identifiants d'une institution sont stockés séparément avec leur contexte.

## ADR-004 — Schéma canonique versionné
**Statut : accepté**

Chaque source CSV/XLSX/API est mappée vers un schéma canonique CREDIBILIS. Les formats externes ne deviennent pas les modèles internes.

## ADR-005 — Provenance obligatoire pour les données critiques
**Statut : accepté**

Les valeurs déclarées, importées, calculées et vérifiées ne doivent pas être confondues.

## ADR-006 — Pas de fusion agressive des personnes
**Statut : accepté**

Le rapprochement produit EXACT/PROBABLE/AMBIGU/AUCUN. Un cas ambigu nécessite une validation humaine.

## ADR-007 — Import et export font partie du même moteur
**Statut : accepté**

Formats V1 : CSV, XLSX, JSON. Les API institutionnelles viendront ensuite via adaptateurs.

## ADR-008 — `ds_engine` reste séparé de la collecte
**Statut : accepté**

`ds_engine/` consomme des données canoniques/features, pas des fichiers institutionnels ou des QuerySets.

## ADR-009 — Modèle statistique différent de la décision de crédit
**Statut : accepté**

Le modèle aide la décision ; il ne remplace pas le processus institutionnel.

## ADR-010 — La documentation est un contrat d'équipe
**Statut : accepté**

En cas de contradiction code/documentation : signaler, décider, documenter, puis implémenter. Ne pas faire évoluer silencieusement l'architecture.
