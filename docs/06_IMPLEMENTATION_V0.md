# CREDIBILIS — Prototype V0 configurable

## Objectif

Prouver que CREDIBILIS peut modifier la collecte sans modifier le code métier.

La V0 doit démontrer :
1. création d'un profil ;
2. configuration de champs ;
3. association profil + produit ;
4. génération dynamique du formulaire ;
5. ajout/suppression de champ sans déploiement ;
6. règles conditionnelles ;
7. enregistrement avec provenance ;
8. variables dérivées ;
9. petit cadre d'analyse configurable.

## Écran 1 — Profils et produits

Profils :
- SALARIE
- COMMERCANT
- AGRICULTEUR
- PME
- PERSONNE_MORALE

Produits :
- CREDIT_SALAIRE
- CREDIT_FONDS_ROULEMENT
- CREDIT_EQUIPEMENT
- CREDIT_INTRANTS

## Écran 2 — Constructeur de formulaire

Fonctions :
- ajouter section ;
- ajouter champ ;
- type ;
- catégorie ;
- temporalité ;
- rôle analytique ;
- sensibilité ;
- profils ;
- produits ;
- obligatoire/facultatif ;
- actif/inactif ;
- conditions.

## Écran 3 — Nouveau dossier

```text
Nature entité
→ Profil
→ Produit
→ Institution
→ Résolution de configuration
→ Formulaire dynamique
```

## Écran 4 — Données du dossier

Afficher :
- données ;
- source ;
- vérification ;
- documents ;
- qualité ;
- variables dérivées ;
- version de configuration.

## Démonstration obligatoire

### SALARIE
Afficher employeur, salaire, date d'embauche, contrat.

### AGRICULTEUR
Afficher culture, superficie, campagne, intrants, rendement.

### Ajout dynamique
Ajouter `acheteur_principal` au profil AGRICULTEUR. Le champ doit apparaître sans modification du code.

### Désactivation
Désactiver `superficie`. Le champ disparaît des nouveaux formulaires, sans perdre l'historique.

### Condition produit
`prix_vente_prevu` obligatoire uniquement pour AGRICULTEUR + CREDIT_INTRANTS.

## Modèles minimums

```text
Profil
ProfilEntite
ProduitCredit
DefinitionDonnee
ModeleCollecte
SectionCollecte
ChampProfil
ChampProduit
ChampInstitution
OptionChamp
RegleAffichage
RegleValidation
ExigenceDocument
DossierCredit
ValeurDonnee
ProvenanceDonnee
Document
DefinitionVariableDerivee
CadreAnalyse
SectionAnalyse
CritereAnalyse
RegleNotation
EvaluationQualitative
```

## API V0 suggérée

```text
GET/POST /api/v1/profils/
GET/POST /api/v1/produits/
GET/POST /api/v1/donnees/definitions/
GET/POST /api/v1/modeles-collecte/
GET      /api/v1/modeles-collecte/resoudre/
GET/POST /api/v1/dossiers/
GET/PATCH /api/v1/dossiers/{id}/
GET/PUT   /api/v1/dossiers/{id}/valeurs/
GET/POST /api/v1/cadres-analyse/
POST     /api/v1/dossiers/{id}/analyser/
```

## Definition of Done

```text
un administrateur ajoute un champ
↓
le frontend le récupère par API
↓
le formulaire l'affiche
↓
l'agent saisit une valeur
↓
la valeur est persistée avec provenance
↓
aucune migration Django n'a été nécessaire
```
