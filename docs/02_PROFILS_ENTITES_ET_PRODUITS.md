# CREDIBILIS — Entités, profils et produits

## 1. Distinction fondamentale

```text
ENTITÉ = qui est la personne ou l'organisation ?
PROFIL = quelle est sa situation économique / professionnelle ?
PRODUIT = quel crédit demande-t-elle ?
DOSSIER = quelle demande précise est étudiée ?
```

Une même entité peut avoir plusieurs profils.

## 2. Natures d'entité V1

```text
PERSONNE_PHYSIQUE
PERSONNE_MORALE
GROUPE
```

## 3. Profils économiques V1

```text
SALARIE
COMMERCANT
AGRICULTEUR
ELEVEUR
ARTISAN
MICRO_ENTREPRISE
PME
PERSONNE_MORALE
AUTRE_ACTIVITE_INDEPENDANTE
```

## 4. Profils hiérarchiques

```text
ACTIVITE_INDEPENDANTE
├── COMMERCANT
│   ├── COMMERCE_DETAIL
│   └── COMMERCE_GROS
├── AGRICULTEUR
│   ├── MARAICHAGE
│   ├── CEREALES
│   └── CULTURE_RENTE
├── ELEVEUR
│   ├── VOLAILLE
│   ├── BOVIN
│   └── OVIN_CAPRIN
└── ARTISAN
    ├── COUTURIER
    ├── MENUISIER
    └── MECANICIEN
```

## 5. Objet `Profil`

```text
Profil
- id
- code
- nom
- description
- profil_parent
- nature_entite
- categorie
- institution
- actif
- version
```

## 6. Relation `ProfilEntite`

```text
ProfilEntite
- entite
- profil
- date_debut
- date_fin
- principal
- statut
- source
- niveau_verification
```

## 7. Profil d'instruction du dossier

```text
DossierCredit
- entite
- profil_instruction
- profils_secondaires[]
- produit_credit
- institution
- date_dossier
```

## 8. Le profil contrôle

1. sections de collecte ;
2. champs visibles ;
3. champs obligatoires ;
4. documents nécessaires ;
5. variables dérivées pertinentes ;
6. cadre d'analyse ;
7. variables candidates pour le scoring ;
8. règles de validation ;
9. certains modes de remboursement compatibles.

## 9. Profil et produit sont distincts

Exemples :

```text
Profil = AGRICULTEUR
Produit = CREDIT_INTRANTS
```

ou

```text
Profil = AGRICULTEUR
Produit = CREDIT_EQUIPEMENT
```

Le formulaire final dépend de :

```text
NATURE ENTITE
+
PROFIL
+
PRODUIT
+
INSTITUTION
```

## 10. Produit de crédit

```text
ProduitCredit
- id
- code
- nom
- description
- institution
- profils_eligibles[]
- devise
- montant_min
- montant_max
- duree_min
- duree_max
- frequences_remboursement[]
- actif
- version
```

## 11. Profils composés

Ne pas créer `SALARIE_COMMERCANT`, `AGRICULTEUR_ELEVEUR`, etc.

Préférer :

```text
profil_principal = COMMERCANT
profils_secondaires = [SALARIE]
```
