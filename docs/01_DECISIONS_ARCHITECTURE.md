# Registre des décisions d'architecture (ADR)

## ADR-001 — Django est l'hôte applicatif
**Statut : ACCEPTÉ**

Django + Django REST Framework gèrent HTTP, auth, permissions, ORM, transactions, admin et API.

FastAPI/Flask ne sont pas ajoutés en parallèle pour la V1.

## ADR-002 — Le cœur de collecte est Python pur
**Statut : ACCEPTÉ**

Aucun import `django.*` ou `rest_framework.*` dans le package de collecte.

## ADR-003 — PostgreSQL est la persistance de référence
**Statut : ACCEPTÉ**

La base applicative utilise PostgreSQL. Les fichiers importés restent des sources, pas la base de vérité applicative.

## ADR-004 — Schéma canonique versionné
**Statut : ACCEPTÉ**

Toute source institutionnelle est transformée vers un schéma interne stable.

## ADR-005 — Identité interne + identifiants externes
**Statut : ACCEPTÉ**

Une entité possède un UUID interne et zéro ou plusieurs identifiants externes contextualisés par institution.

## ADR-006 — Pas de fusion agressive
**Statut : ACCEPTÉ**

Nom/prénom seul ne suffit jamais à fusionner automatiquement deux personnes.

## ADR-007 — Provenance comme donnée de premier ordre
**Statut : ACCEPTÉ**

Les valeurs critiques doivent être traçables jusqu'à leur source.

## ADR-008 — Import en deux temps : preview puis commit
**Statut : ACCEPTÉ**

Un upload institutionnel n'est pas immédiatement persisté comme vérité métier.

## ADR-009 — `ds_engine` séparé de l'application métier
**Statut : ACCEPTÉ**

Le moteur Data Science reçoit des données préparées via un bridge.

## ADR-010 — Modèle statistique ≠ décision
**Statut : ACCEPTÉ**

Une estimation statistique ne remplace pas la politique institutionnelle ni la décision humaine.

## ADR-011 — Analyse métier configurable
**Statut : ACCEPTÉ**

Ratios, formules et seuils doivent être versionnés et configurables, pas codés en dur dans les views.

## ADR-012 — API-first
**Statut : ACCEPTÉ**

Le backend expose des contrats REST documentés. Le frontend n'accède jamais directement à PostgreSQL.

## ADR-013 — Multi-institution logique dans une DB commune pour V1
**Statut : ACCEPTÉ**

Isolation par `institution_id` et permissions. Une architecture DB par tenant n'est pas nécessaire au hackathon.

## ADR-014 — React/TypeScript est la cible frontend, sans couplage avec le domaine
**Statut : ACCEPTÉ POUR LA CIBLE**

Le frontend peut évoluer indépendamment tant qu'il respecte l'API.

## ADR-015 — Celery/Redis uniquement si nécessaire
**Statut : ACCEPTÉ**

Pas d'infrastructure asynchrone ajoutée avant d'avoir un besoin réel de traitements longs.

## ADR-016 — Documentation = contrat de coordination
**Statut : ACCEPTÉ**

Un changement structurant doit mettre à jour l'ADR et la documentation avant ou avec le code.
