# Spécification — Moteur de collecte V1

## But
Transformer des données hétérogènes d'institutions financières en données canoniques, traçables et exploitables.

## Inclus en V1
- import CSV/XLSX/JSON ;
- inspection feuilles/colonnes ;
- mapping source -> canonique ;
- profils de mapping par institution ;
- normalisation ;
- validations structurales et métier de base ;
- identification d'entités ;
- rapprochement/doublons ;
- provenance ;
- diagnostics de qualité ;
- aperçu avant persistance ;
- résultat d'import ;
- export CSV/XLSX/JSON.

## Hors périmètre du moteur de collecte
Auth, interface web, permissions, ORM, décision de crédit, scoring, entraînement ML et comité de crédit.

## Cas d'usage principal
```text
Upload XLSX -> inspection -> mapping -> normalisation -> validation
-> identité/rapprochement -> qualité/provenance -> aperçu
-> confirmation -> persistance Django
```

## Contrat conceptuel
```python
moteur = CollectionEngine(...)
resultat = moteur.importer(source=source, contexte=contexte)
```

Le résultat est un objet Python (`ImportResult`), jamais un `HttpResponse`, un Serializer ou un QuerySet.

## Lecteurs
- `CsvReader`
- `ExcelReader`
- `JsonReader`

Chaque lecteur produit des `RawRecord`.

## Mapping
Le mapping est configurable par institution.

```text
"Nom client" -> personne.nom_complet
"Téléphone"  -> personne.telephone
"CA mensuel" -> activite.chiffre_affaires_mensuel
"Encours"    -> engagement.solde_restant
```

Le moteur distingue mapping exact, mapping proposé, colonne ignorée, colonne inconnue et champ canonique obligatoire manquant.

## Normalisation
Téléphones, dates, montants FCFA, booléens, catégories, identifiants, valeurs manquantes et espaces/casse. Une normalisation ne doit pas masquer une donnée invalide.

## Validation
Niveaux : structure et métier. Exemples : date future, montant négatif, durée nulle, échéance incohérente, identifiant externe dupliqué.

## Identité et rapprochement
```text
identifiant exact connu ? -> EXACT
sinon -> comparaison multi-attributs -> PROBABLE / AMBIGU / AUCUN
```

Le moteur doit retourner les raisons du rapprochement.

## Provenance
Chaque donnée critique peut conserver source, import, institution, date, agent/système collecteur, niveau de vérification, pièce associée et transformations.

## Qualité
Une anomalie contient au minimum : code, sévérité, entité, champ, valeur, message, règle et référence source.

Sévérités : INFO, WARNING, ERROR, BLOCKING.

## Export
CSV/XLSX/JSON à partir du schéma canonique ou d'une projection explicite.

## Definition of Done
La V1 est prête si :
- les tests unitaires passent sans Django ;
- deux fichiers de structures différentes peuvent alimenter le même schéma canonique ;
- les identifiants externes sont contextualisés par institution ;
- un doublon ambigu n'est pas fusionné automatiquement ;
- chaque valeur critique est traçable ;
- un rapport de qualité est produit ;
- Django peut persister le résultat via un adaptateur.
