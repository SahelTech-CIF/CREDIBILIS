# Identité, unicité et rapprochement

## 1. Problème

Une même personne peut apparaître dans :
- le fichier clients ;
- les demandes ;
- les crédits ;
- les paiements ;
- plusieurs années d'exports ;
- éventuellement plusieurs systèmes.

Le système doit relier ces lignes sans créer de doublons dangereux.

## 2. Deux concepts séparés

### Identification exacte
Un identifiant fort permet une correspondance sûre.

### Rapprochement
On estime que deux records pourraient représenter la même entité.

Ne jamais confondre les deux.

## 3. Statuts

```text
EXACT
PROBABLE
AMBIGU
AUCUN
```

## 4. Identifiants forts

Exemples :
- `(institution, type, valeur)` d'un identifiant externe ;
- pièce d'identité normalisée, selon politique ;
- identifiant crédit exact.

## 5. Signaux de rapprochement

Exemples :
- téléphone normalisé ;
- nom/prénom normalisés ;
- date de naissance ;
- agence ;
- activité ;
- localité.

## 6. Score de rapprochement

Un éventuel score doit être explicable :

```text
telephone exact      + fort
birth_date exact     + fort
nom similaire        + moyen
quartier similaire   + faible
```

Les pondérations sont une politique technique versionnée, pas un nombre caché dans une view.

## 7. Fusion

Une fusion d'entités est une opération sensible.

Elle doit conserver :
- entité source ;
- entité cible ;
- auteur ;
- date ;
- justification ;
- champs conflictuels ;
- audit event.

Aucune fusion irréversible silencieuse.

## 8. Conflits de valeurs

Si deux sources disent :

```text
revenu = 500000
revenu = 650000
```

le système ne doit pas forcément choisir automatiquement.

Il conserve les observations et laisse la couche de résolution/validation décider quelle valeur alimente un snapshot.
