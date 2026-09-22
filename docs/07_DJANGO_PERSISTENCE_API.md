# Django, persistance et API

## 1. Positionnement

Django est l'hôte applicatif de CREDIBILIS.

Stack :
- Django ;
- Django REST Framework ;
- PostgreSQL.

## 2. Apps suggérées

### `accounts`
Utilisateurs, rôles, authentification.

### `institutions`
Institutions, agences, configuration de tenant.

### `ingestion`
Uploads, ImportBatch, mapping persisté, commits.

### `identities`
Personnes, external identifiers, merges.

### `dossiers`
Demandes de crédit, snapshots.

### `documents`
Pièces et métadonnées.

### `analyses`
Cadres, exécutions, résultats.

### `decisions`
Workflow agent/superviseur/comité.

### `audit`
Événements et traçabilité.

## 3. Services applicatifs

Éviter les views géantes.

Exemple :

```text
views.py
  -> application service
       -> moteur de collecte
       -> repository adapter
       -> transaction
```

## 4. Ports de persistance

Le moteur de collecte peut recevoir des interfaces telles que :

```python
class IdentityLookupPort(Protocol):
    def find_by_external_id(...): ...
    def search_candidates(...): ...
```

L'implémentation Django de ce port utilise l'ORM.

Ainsi, le moteur connait l'interface, pas Django.

## 5. Transactions

Le commit d'un import doit être atomique autant que possible.

```python
with transaction.atomic():
    ...
```

mais cette transaction vit dans le backend Django.

## 6. API

DRF est la frontière HTTP. Les serializers valident le contrat HTTP ; ils ne remplacent pas les validations métier du moteur.

## 7. OpenAPI

L'API doit générer une documentation OpenAPI stable pour permettre au frontend et aux agents d'intégration de travailler indépendamment.

## 8. Permissions

Exemples de permissions :

```text
imports.create
imports.commit
imports.view
identities.merge
credit_applications.create
analyses.run
decisions.review
audit.view
exports.create
```

Les noms exacts seront décidés lors de l'implémentation.
