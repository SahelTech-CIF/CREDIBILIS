# CREDIBILIS — Dictionnaire et classification des données

## 1. Pourquoi
CREDIBILIS ne doit pas connaître uniquement `texte`, `nombre`, `date`. Le système doit comprendre la signification métier de chaque donnée.

Exemple :
- `raison_sociale` : donnée d'identification, pas variable de risque par défaut.
- `date_debut_activite` : donnée brute pouvant produire `anciennete_activite_mois`.

## 2. Modèle `DefinitionDonnee`

```text
DefinitionDonnee
- id
- code
- libelle
- description
- categorie_metier
- sous_categorie
- type_donnee
- unite
- devise
- temporalite
- granularite
- sources_autorisees[]
- niveau_verification_requis
- sensibilite
- role_analytique
- usages_autorises[]
- profils_applicables[]
- produits_applicables[]
- institutions_applicables[]
- obligatoire
- visible
- actif
- valeur_min
- valeur_max
- options[]
- peut_etre_variable_modele
- peut_etre_entree_regle
- version
- date_debut_validite
- date_fin_validite
```

## 3. Catégories métier

```text
IDENTIFICATION
CONTACT
GEOGRAPHIQUE
DEMOGRAPHIQUE
MENAGE
EMPLOI
ACTIVITE
PRODUCTION
VENTE
REVENU
CHARGE
TRESORERIE
TRANSACTION
EPARGNE
DETTE
ACTIF
PASSIF
GARANTIE
MARCHE
HISTORIQUE_CREDIT
REMBOURSEMENT
COMPORTEMENT
KYC
CONFORMITE
DOCUMENT
QUALITATIF
DEMANDE_CREDIT
DECISION
RESULTAT_OBSERVE
```

## 4. Types techniques

```text
TEXTE
TEXTE_LONG
ENTIER
DECIMAL
MONTANT
POURCENTAGE
BOOLEEN
DATE
DATE_HEURE
DUREE
CHOIX_SIMPLE
CHOIX_MULTIPLE
TELEPHONE
EMAIL
DOCUMENT
IMAGE
COORDONNEE
TABLEAU_REPETABLE
OBJET
SERIE_TEMPORELLE
```

## 5. Temporalité

```text
STATIQUE
VALEUR_ACTUELLE
PHOTOGRAPHIE_T0
PERIODE
EVENEMENT
SERIE_TEMPORELLE
```

## 6. Source

```text
DECLAREE_CLIENT
SAISIE_AGENT
OBSERVEE_TERRAIN
DOCUMENT
IMPORT_FICHIER
SYSTEME_INSTITUTION
API_EXTERNE
CALCULEE
MODELE
```

## 7. Vérification

```text
NON_VERIFIEE
DECLAREE
IMPORTEE
PARTIELLEMENT_VERIFIEE
VERIFIEE
CERTIFIEE
```

## 8. Sensibilité

```text
PUBLIQUE
INTERNE
PERSONNELLE
FINANCIERE
SENSIBLE
HAUTEMENT_SENSIBLE
```

## 9. Rôle analytique

```text
IDENTIFICATION_SEULE
DESCRIPTION
SEGMENTATION
VARIABLE_CANDIDATE
ENTREE_REGLE
VARIABLE_DERIVEE
PREUVE
CONFORMITE
RESULTAT_OBSERVE
DECISION
```

## 10. Usages autorisés

```text
IDENTIFICATION
AFFICHAGE
RECHERCHE
SEGMENTATION
VISITE_TERRAIN
CONTROLE_METIER
CALCUL_DERIVE
REGLE_CREDIT
MODELE_STATISTIQUE
CONFORMITE
REPORTING
AUDIT
```

## 11. Disponibilité dans le cycle du crédit

```text
AVANT_DEMANDE
AU_MOMENT_DEMANDE
PENDANT_INSTRUCTION
APRES_DECISION
PENDANT_CREDIT
APRES_CLOTURE
```

Les données futures comme `retard_final` ou `defaut_90_jours` doivent être marquées `RESULTAT_OBSERVE` et ne doivent jamais être utilisées comme prédicteurs au T0.
