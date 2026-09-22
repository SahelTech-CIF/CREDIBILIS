# Architecture CREDIBILIS

## Objectif
CREDIBILIS est une composition de modules indépendants. La première brique métier est le **moteur de collecte de données**.

```text
Sources institutionnelles
CSV / XLSX / JSON / API
          |
          v
MOTEUR DE COLLECTE PYTHON
- lecture/import
- mapping
- normalisation
- validation
- provenance
- qualité
- identification / rapprochement
          |
          v
SCHÉMA CANONIQUE CREDIBILIS
          |
          v
ADAPTATEUR DJANGO
- ORM / PostgreSQL
- transactions
- auth / rôles
- API REST
- vues / URLs
          |
          +----------------------+
          |                      |
          v                      v
Application métier         ds_engine
Dossiers / workflow        Cohortes / scoring
Pièces / analyses          Explication / simulation
          |                      |
          +----------+-----------+
                     v
              AIDE À LA DÉCISION
                     |
                     v
           Agent / Superviseur / Comité
```

## Principe Ports & Adapters
Django est l'hôte applicatif. Il gère HTTP, URLs, auth, permissions, ORM, transactions, PostgreSQL, admin et orchestration.

Le moteur de collecte contient les règles de mapping, normalisation, validation, identité, rapprochement, provenance et qualité. Il ne dépend pas de Django.

## Modules cibles
```text
packages/collecte/credibilis_collecte/
├── domaine/
├── contrats/
├── schemas/
├── importation/
├── exportation/
├── mapping/
├── normalisation/
├── validation/
├── identite/
├── rapprochement/
├── provenance/
└── qualite/
```

## Schéma canonique
Familles d'entités prévues : Personne, Organisation/Entreprise, Activité, Ménage, DemandeCredit, Credit, Echeance, PaiementHistorique, Engagement, Garantie, Document et ExternalIdentifier.

Les formats des institutions sont des **sources**, pas le modèle interne du système.

## Identité
Chaque entité reçoit un identifiant interne CREDIBILIS. Les identifiants externes sont contextualisés :

```text
(institution_id, entity_type, identifier_type, value)
```

Un numéro de compte n'est pas supposé globalement unique.

## Rapprochement
Statuts : `EXACT`, `PROBABLE`, `AMBIGU`, `AUCUN`.

Aucune fusion automatique sur nom/prénom seul. Les cas ambigus doivent être validés humainement.

## Provenance
Toute donnée critique doit pouvoir conserver : valeur, champ canonique, source, import d'origine, date de collecte, institution, agent/système, pièce associée, niveau de vérification, commentaire et historique des transformations.

## Pipeline
```text
Source -> Lecture -> RawRecord -> Mapping -> CanonicalRecord
      -> Normalisation -> Validation -> Identité/Rapprochement
      -> Qualité + Provenance -> ImportResult -> Persistance Django
```

## Relation avec `ds_engine`
`ds_engine/` ne doit ni lire les fichiers institutionnels bruts ni connaître les modèles Django.

```text
sources brutes -> collecte -> schéma canonique -> snapshot/features -> ds_engine
```

## Modèle ≠ décision
Le scoring produit une estimation, une explication ou une simulation. La politique de crédit et la décision humaine restent distinctes et auditables.

## Test architectural
Une fonctionnalité du moteur de collecte est correctement isolée si ses tests s'exécutent sans Django.
