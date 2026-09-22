# Django, Persistance et API REST (DRF)

## 1. Positionnement & Règle d'Or

Django est **exclusivement l'hôte applicatif** de CREDIBILIS.

```text
            FRONTEND (React SPA)
                     │
                     │ HTTPS / JSON
                     ▼
           DJANGO REST FRAMEWORK (DRF)
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
  Auth/RBAC         API         Application Services
      │                             │
      └──────────────┬──────────────┘
                     ▼
             ADAPTATEURS DJANGO
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
     PostgreSQL            Object Storage
                                 │
                                 ▼
                     documents / fichiers téléversés
```

### Principes Non Négociables :
* **Zéro Django Templates, zéro HTMX, zéro Alpine** : Aucun écran utilisateur métier ne dépend du rendu serveur Django.
* **Le navigateur parle uniquement à `/api/v1/...`**.
* **DRF n'est pas le moteur métier** : Les views DRF se limitent à l'orchestration HTTP (désérialisation, validation HTTP, appel des services applicatifs, réponse JSON). Jamais de vues géantes de 2 800 lignes contenant du mapping ou du calcul statistique.

---

## 2. Structure du Backend Django

```text
backend/
├── manage.py
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── local.py
│   │   └── production.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
└── apps/
    ├── accounts/       # Utilisateurs, rôles, permissions RBAC, profils agents
    ├── institutions/   # Institutions financières (KAFO, etc.), caisses, agences
    ├── identities/     # Personnes, external identifiers, fusions/merges
    ├── dossiers/       # Demandes de crédit, snapshots T0, cycle de vie
    ├── collecte/       # Collecte manuelle terrain, formulaires d'instruction
    ├── imports/        # Gestion des fichiers d'import, batches, inspections
    ├── mappings/       # Configurations de mapping source -> canonique
    ├── quality/        # Rapports de qualité, anomalies typées, diagnostics
    ├── documents/      # Pièces justificatives, métadonnées, uploads
    ├── exports/        # Moteur d'exportation vers institutions
    └── audit/          # Événements système, traçabilité et logs légaux
```

### Organisation interne de chaque app :
Chaque application Django respecte la séparation en couches :

```text
imports/
├── models.py         # Définition des tables ORM et relations PostgreSQL
├── serializers.py    # Validation et sérialisation des payloads HTTP JSON
├── selectors.py      # Requêtes de lecture ORM pures (pas d'effets de bord)
├── services.py       # Logique applicative, transactions, orchestration des moteurs
├── permissions.py    # Contrôles d'accès RBAC granulaires
├── api/
│   ├── urls.py       # Déclaration des routes REST
│   └── views.py      # ViewSets / APIViews légères
└── tests/            # Tests d'intégration de l'app
```

---

## 3. Séparation des Responsabilités : DRF vs ORM vs Moteurs Python

```text
Couche HTTP (DRF)
  HTTP JSON
      ↓
  Sérialisation / Validation syntaxique
      ↓
Couche Applicative (Django Services)
  ImportService / DossierService
      ├── Stockage fichier physique (S3 / Local)
      ├── Transaction atomique (transaction.atomic)
      └── Appel des Moteurs Python Découplés
            ↓
Couche Métier Pure (credibilis_collecte / ds_engine)
  RawRecord -> Mapping -> CanonicalRecord -> Validation -> Entity Resolution -> Output
      ↓ (retourne des objets Python purs)
Couche Persistance (Django ORM)
  Adaptation Domain Objects -> Modèles ORM -> PostgreSQL
      ↓
Réponse JSON HTTP vers React
```

---

## 4. API REST Cible (`/api/v1/...`)

L'API est versionnée et documentée sous standard OpenAPI (Swagger/Spectacular).

```text
# Authentification et Utilisateurs
/api/v1/auth/token/                     # Obtention JWT (access + refresh)
/api/v1/auth/token/refresh/             # Renouvellement token
/api/v1/users/me/                       # Profil agent connecté et permissions
/api/v1/institutions/                   # Liste des institutions partenaires
/api/v1/agencies/                       # Agences et caisses rattachées

# Entités et Clients
/api/v1/entities/                       # Recherche transversale d'entités
/api/v1/entities/{id}/                  # Détail d'une personne / entité canonique
/api/v1/clients/                        # Fiches clients institutionnelles

# Dossiers de Crédit
/api/v1/dossiers/                       # Liste et création de dossiers
/api/v1/dossiers/{id}/                  # Consultation et PATCH (autosave wizard)
/api/v1/dossiers/{id}/snapshot/         # Snapshot T0 figé pour le scoring
/api/v1/dossiers/{id}/score/            # Appel du scoring et offres alternatives
/api/v1/dossiers/{id}/decision/         # Décision formelle (accord, rejet, rééchelonnement)

# Ingestion et Imports Institutionnels
/api/v1/imports/                        # Upload multipart et historique des imports
/api/v1/imports/{id}/inspect/           # Détection des feuilles, colonnes et lignes
/api/v1/imports/{id}/schema/            # Schéma source détecté
/api/v1/imports/{id}/mapping/           # Consultation et PUT du mapping interactif
/api/v1/imports/{id}/preview/           # Prévisualisation des enregistrements convertis
/api/v1/imports/{id}/validate/          # Lancement de la validation des règles métiers
/api/v1/imports/{id}/quality/           # Rapport Data Quality (complétude, validité, etc.)
/api/v1/imports/{id}/matches/           # Enregistrements rapprochés et doublons potentiels
/api/v1/imports/{id}/commit/            # Persistance atomique définitive dans PostgreSQL

# Rapprochement (Entity Resolution)
/api/v1/matches/{id}/resolve/           # Résolution manuelle (SAME_ENTITY vs DIFFERENT_ENTITIES)

# Mappings Réutilisables
/api/v1/mappings/                       # Profils de mapping sauvegardés par institution

# Documents et Justificatifs
/api/v1/documents/                      # Upload multipart et attachement aux dossiers
/api/v1/documents/{id}/download/        # Téléchargement sécurisé avec audit trail

# Exportations
/api/v1/exports/                        # Génération d'exports (XLSX, CSV, JSON)

# Audit et Traçabilité
/api/v1/audit/logs/                     # Journal d'audit légal des accès et modifications
```

---

## 5. Stratégie d'Authentification & Sécurité

* **Authentification par Jetons** :
  * Access token JWT à durée de vie courte (15 à 30 minutes).
  * Refresh token sécurisé (rotatif, stocké de préférence en cookie HttpOnly `SameSite=Strict` ou transmis via header sécurisé).
  * Pas de token stocké indéfiniment sans expiration.
* **Contrôle d'Accès Multi-Tenant (Multi-Institution)** :
  * Chaque requête authentifiée associe obligatoirement l'utilisateur à son `institution_id`.
  * Interdiction formelle d'autoriser une action basée sur un `institution_id` passé arbitrairement dans le corps de la requête.
  * Les permissions RBAC fines contrôlent l'accès à chaque action (`imports.create`, `imports.commit`, `dossiers.score`, etc.).

---

## 6. Exemple d'Implémentation d'une Vue DRF Découplée

```python
# apps/imports/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.imports.services import ImportValidationService
from apps.imports.permissions import CanValidateImport

class ImportValidateAPIView(APIView):
    permission_classes = [CanValidateImport]

    def post(self, request, pk):
        # 1. Délégation intégrale au service applicatif
        # (Aucun code de calcul ou de parsing dans la vue)
        result = ImportValidationService.validate_batch(
            import_id=pk,
            user=request.user,
        )

        return Response(
            data={
                "status": result.status,
                "summary": result.summary_dict,
                "anomalies_count": len(result.anomalies),
            },
            status=status.HTTP_200_OK,
        )
```
