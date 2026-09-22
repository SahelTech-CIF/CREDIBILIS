# CREDIBILIS — Moteur de collecte configurable

## 1. But

Le formulaire doit être généré à partir de configuration.

```text
FORMULAIRE FINAL
=
CHAMPS GLOBAUX
+
CHAMPS DU PROFIL
+
CHAMPS DU PRODUIT
+
CHAMPS DE L'INSTITUTION
-
CHAMPS DESACTIVES
+
REGLES CONDITIONNELLES
```

## 2. Objets

```text
ModeleCollecte
SectionCollecte
DefinitionDonnee
ChampProfil
ChampProduit
ChampInstitution
OptionChamp
RegleAffichage
RegleValidation
ExigenceDocument
```

## 3. Modèle de collecte

```text
ModeleCollecte
- id
- code
- nom
- institution
- profil
- produit
- version
- actif
- date_debut_validite
- date_fin_validite
```

## 4. Section

```text
SectionCollecte
- modele_collecte
- code
- titre
- description
- ordre
- condition_affichage
- actif
```

## 5. Association champ / profil

```text
ChampProfil
- profil
- definition_donnee
- obligatoire
- visible
- ordre
- regles_specifiques
```

Même principe pour `ChampProduit` et `ChampInstitution`.

## 6. Ajout de champ sans déploiement

Exemple :

```text
code = anciennete_fournisseur_principal
libelle = Ancienneté avec le fournisseur principal
type = ENTIER
categorie = ACTIVITE
profil = COMMERCANT
obligatoire = NON
role_analytique = VARIABLE_CANDIDATE
temporalite = VALEUR_ACTUELLE
```

Le champ apparaît sans migration Django.

## 7. Conditions

```text
RegleAffichage
- champ_source
- operateur
- valeur_attendue
- cible
- action
- ordre
- actif
```

Actions :

```text
AFFICHER
MASQUER
RENDRE_OBLIGATOIRE
RENDRE_FACULTATIF
```

Exemple :

```text
SI type_logement = LOCATAIRE
ALORS afficher loyer_mensuel
ET rendre loyer_mensuel obligatoire
```

## 8. Documents requis

```text
ExigenceDocument
- code
- libelle
- profil
- produit
- institution
- obligatoire
- condition
- type_document
- niveau_verification_requis
- actif
```

## 9. Architecture hybride

Noyau relationnel fixe :

```text
Institution
Agence
Utilisateur
Entite
Personne
Organisation
DossierCredit
Credit
Echeance
Paiement
Document
```

Réponses dynamiques :

```text
ValeurDonnee
- id
- dossier
- entite
- definition_donnee
- valeur_json
- date_observation
- source
- niveau_verification
- provenance
- created_at
- updated_at
```

## 10. Provenance

```text
ProvenanceDonnee
- valeur_donnee
- source_type
- source_reference
- institution
- import_id
- collected_at
- collected_by
- verification_level
- evidence_document
- transformations[]
- commentaire
```

## 11. Résolution du formulaire

Service conceptuel :

```text
resoudre_modele_collecte(
    institution,
    nature_entite,
    profil_principal,
    profils_secondaires,
    produit_credit,
    date
)
```

Sortie :

```text
FormulaireResolue
- modele_version
- sections[]
- champs[]
- documents_requis[]
- regles_affichage[]
- regles_validation[]
```
