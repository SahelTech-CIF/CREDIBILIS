# ROLE 02 — Backend Data / Moteur de collecte

## Mission

Construire et stabiliser le moteur `credibilis_collecte`.

Tu transformes les données institutionnelles hétérogènes en données canoniques, validées, traçables et exploitables.

## Tu possèdes

- import CSV ;
- import XLSX/XLSM ;
- import JSON ;
- inspection feuilles/colonnes ;
- mapping institutionnel ;
- schéma canonique ;
- normalisation ;
- validation ;
- identifiants externes ;
- résolution d'identité ;
- rapprochement ;
- provenance ;
- Data Quality ;
- export.

## Chemins principaux

- `packages/collecte/`
- tests associés au moteur
- éventuellement fixtures de test anonymisées/synthétiques

## Sources métier à prendre en compte

Les données doivent pouvoir couvrir au minimum :
- Clients
- Activités
- Demandes
- Crédits
- Échéances
- Paiements

Les formulaires métier couvrent aussi :
- identité ;
- ménage ;
- activité ;
- revenus ;
- charges ;
- dettes ;
- demande ;
- garanties ;
- documents ;
- provenance.

## Entrées

- fichiers CSV/XLSX/JSON ;
- `ImportContext` ;
- profil de mapping ;
- repository d'identité abstrait.

## Sorties

- `RawRecord`
- `CanonicalRecord`
- `ImportResult`
- `DataIssue`
- `Provenance`
- `MatchResult`

## Règles non négociables

- aucun import de Django dans le moteur ;
- aucun accès direct PostgreSQL ;
- aucun `QuerySet` ;
- aucune décision de crédit ;
- aucune fusion automatique sur nom/prénom seul ;
- les identifiants externes sont contextualisés par institution ;
- toute donnée critique conserve sa provenance.

## Statuts de matching

- EXACT
- PROBABLE
- AMBIGU
- AUCUN

`PROBABLE` et `AMBIGU` nécessitent validation applicative/humaine.

## Data Quality minimale

- complétude ;
- validité ;
- unicité ;
- cohérence ;
- traçabilité.

## Tests obligatoires

- CSV reader ;
- Excel reader ;
- mapping ;
- mapping inconnu ;
- normalisation montant ;
- normalisation téléphone ;
- normalisation date ;
- identifiant externe ;
- exact match ;
- probable match ;
- ambiguous match ;
- provenance ;
- qualité ;
- export.

Les tests du moteur doivent fonctionner sans `DJANGO_SETTINGS_MODULE`.

## Handoff attendu

Vers Lead :
- version des contrats ;
- schéma canonique ;
- API Python publique.

Vers Frontend Collecte :
- exemples JSON d'import/mapping/qualité.

Vers Data Science :
- structure canonique disponible en sortie.
