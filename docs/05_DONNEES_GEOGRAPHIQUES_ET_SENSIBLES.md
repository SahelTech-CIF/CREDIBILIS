# CREDIBILIS — Données géographiques et sensibles

## 1. Géographie

Une donnée géographique peut servir à :
- identifier une adresse ;
- préparer une visite terrain ;
- affecter une agence ;
- comprendre une zone d'activité ;
- calculer une distance ;
- analyser une exploitation ;
- localiser une garantie.

Elle ne doit pas devenir automatiquement une variable de risque.

## 2. Granularité

```text
PAYS
REGION
CERCLE
COMMUNE
QUARTIER
VILLAGE
ADRESSE
POINT_REPERE
COORDONNEE_GPS
ZONE_POLYGONALE
```

## 3. Métadonnées géographiques

```text
granularite_geographique
precision_metres
systeme_coordonnees
date_observation
source_localisation
consentement_requis
usages_autorises[]
```

Exemple :

```text
code = gps_activite
categorie = GEOGRAPHIQUE
granularite = COORDONNEE_GPS
precision = 20m
source = OBSERVEE_TERRAIN
consentement_requis = OUI
usages = [VISITE_TERRAIN, CALCUL_DERIVE]
modele_statistique = NON par défaut
sensibilite = SENSIBLE
```

## 4. Variables dérivées possibles

- distance à l'agence ;
- distance au marché ;
- zone urbaine/rurale ;
- distance à une infrastructure ;
- zone agricole ;
- accessibilité.

Chaque variable dérivée doit avoir une justification, une version et des usages autorisés.

## 5. Interdiction implicite

Ne jamais coder :

```text
quartier = X
→ risque élevé
```

sans politique documentée et validation.

## 6. Sensibilité

Exemples :
- GPS domicile : SENSIBLE ;
- pièce d'identité : HAUTEMENT_SENSIBLE ;
- revenu : FINANCIERE ;
- téléphone : PERSONNELLE.

Les permissions sont appliquées côté backend.

## 7. Export

Une donnée sensible peut être non exportable par défaut ou demander un rôle spécifique.
