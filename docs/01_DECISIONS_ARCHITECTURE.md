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

## ADR-014 — Frontend React SPA exclusif et Django REST Framework pur
**Statut : ACCEPTÉ ET FERME**

Pas de Django Templates. Pas de HTMX. Pas d'Alpine. Django sert uniquement de backend applicatif via Django REST Framework (DRF).

- **Frontend** : SPA indépendante (React 18+, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, TanStack Table, React Hook Form, Zod, Recharts).
- **Backend** : Django + DRF servant des endpoints HTTP JSON sous `/api/v1/...`.
- **Règle absolue** : Aucun écran utilisateur métier ne dépend du rendu serveur Django. Zod assure la validation UX immédiate ; la validation métier définitive reste au niveau des services applicatifs et des moteurs Python.


## ADR-015 — Celery/Redis uniquement si nécessaire
**Statut : ACCEPTÉ**

Pas d'infrastructure asynchrone ajoutée avant d'avoir un besoin réel de traitements longs.

## ADR-016 — Documentation = contrat de coordination
**Statut : ACCEPTÉ**

Un changement structurant doit mettre à jour l'ADR et la documentation avant ou avec le code.

## ADR-017 — Découplage de la couche IA (FournisseurIA & RouteurIA)
**Statut : ACCEPTÉ ET VERROUILLÉ**

CREDIBILIS ne dépend ni de DeepSeek, ni d'Ollama, ni d'un modèle précis. CREDIBILIS dépend d'un contrat `FournisseurIA`.
- Package pur Python `packages/intelligence/credibilis_intelligence/` sans import Django, ORM ou SQL.
- Fournisseurs modulaires : `FournisseurFactice` (déterministe, tests/CI à 0 coût), `FournisseurDeepSeek` (Cloud API), `FournisseurLocal` (Ollama/vLLM/llama.cpp).
- `RouteurIA` : Aiguillage contextuel selon le niveau de sensibilité. **Règle d'or** : Si données sensibles et modèle local indisponible $\rightarrow$ **abstention IA stricte** (aucun fallback cloud silencieux).
- Sorties structurées Pydantic obligatoires pour toutes les tâches d'analyse.
- Interdiction formelle : Le LLM ne prend jamais la décision d'octroi de crédit (`ACCEPTER`/`REFUSER`).

## ADR-018 — Architecture MCP Agentique sécurisée
**Statut : ACCEPTÉ**

L'intégration des agents autonomes et assistants IA repose sur le Model Context Protocol (MCP) branché exclusivement sur les endpoints DRF et les services applicatifs de CREDIBILIS (`Agent IA` $\rightarrow$ `MCP` $\rightarrow$ `Django/DRF` $\rightarrow$ `Services Métier` $\rightarrow$ `PostgreSQL`).
- Strictement aucun accès direct SQL ou DB brute par le serveur MCP.
- Outils MCP audités, traçables et limités aux consultations et simulations contrôlées.

## ADR-019 — Thème 100% Light et Design System bancaire moderne
**Statut : ACCEPTÉ ET APPLIQUÉ**

L'ensemble de l'interface utilisateur frontend (React SPA) adopte un thème 100% Light inspiré des standards bancaires institutionnels contemporains (Linear Light, Stripe, Mercury) :
- Palette claire : fonds blancs (`#ffffff`) et gris ardoise ultra-doux (`#f8fafc`), cartes aux bordures subtiles (`#e2e8f0`).
- Typographie soignée, contrastes élevés et badges d'état lisibles pour les agents de terrain et analystes de crédit.
- Proscription absolue du mode sombre ou de contrastes agressifs non adaptés à la consultation de dossiers financiers.

