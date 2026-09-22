# Moteur de Collecte Dynamique — CREDIBILIS

Ce document décrit le fonctionnement du moteur de collecte dynamique de CREDIBILIS, son architecture pure Python découplée, et les règles d'adaptation selon le profil socio-économique de l'emprunteur.

---

## 1. Principes Fondamentaux de la Collecte

Le moteur de collecte CREDIBILIS répond à quatre principes directeurs :

1. **Dynamisme selon le Profil** : Un agriculteur de la zone Office du Niger (Ségou), une PME de négoce à Mopti et un fonctionnaire domicilié à Bamako ne répondent pas aux mêmes questions. Le profil socio-économique active ou masque les sections du formulaire.
2. **Pureté Python & Découplage** : Le cœur de traitement (`packages/collecte` et `packages/credit`) n'a aucune dépendance envers Django ou une base de données. Il peut tourner hors-ligne sur une tablette d'agent de crédit en brousse.
3. **Traçabilité de la Provenance** : Chaque donnée enregistrée conserve sa source (`AGENT_TERRAIN`, `FICHIER_EXCEL_INSTITUTIONNEL`, `CONSULTATION_BIC_UEMOA`, `CLIENT_DECLARATIF`).
4. **Garde-fou Anti-Homonyme Strict** : En Afrique de l'Ouest, des patronymes comme *Traoré*, *Diallo*, *Coulibaly* ou *Touré* sont extrêmement répandus. Le rapprochement d'entités interdit formellement de fusionner deux clients sur la seule base du nom et prénom sans justificatif biométrique (NINA, CNI, téléphone vérifié).

---

## 2. Les 8 Profils d'Emprunteurs Pris en Charge

```text
┌──────────────────────┬────────────────────────────────────────────────────────┐
│ PROFIL               │ SPÉCIFICITÉ DU FORMULAIRE DE COLLECTE                  │
├──────────────────────┼────────────────────────────────────────────────────────┤
│ 1. SALARIE           │ Employeur, contrat (CDI/CDD), salaire net, domiciliation│
│                      │ bancaire, quotité cessible (max 33%), avis d'imposition │
├──────────────────────┼────────────────────────────────────────────────────────┤
│ 2. COMMERCANT        │ Emplacement boutique, stocks marchandises, créances    │
│                      │ clients, fournisseurs, marge brute, rotations de caisse│
├──────────────────────┼────────────────────────────────────────────────────────┤
│ 3. AGRICULTEUR       │ Superficie cultivée (hectares), intrants, calendrier   │
│                      │ pluvial, cultures vivrières vs rente, stockage récoltes│
├──────────────────────┼────────────────────────────────────────────────────────┤
│ 4. ELEVEUR           │ Taille du cheptel (bovins, ovins), pâturages, état     │
│                      │ sanitaire vétérinaire, transhumance, ventes sur foires │
├──────────────────────┼────────────────────────────────────────────────────────┤
│ 5. ARTISAN           │ Métier (menuiserie, forge, textile), outillage possédé,│
│                      │ commandes en carnet, apprentis, matières premières     │
├──────────────────────┼────────────────────────────────────────────────────────┤
│ 6. MICRO_ENTREPRISE  │ Activité informelle ou semi-formelle, cahier de caisse │
│                      │ simplifié, séparation dépenses foyer vs boutique       │
├──────────────────────┼────────────────────────────────────────────────────────┤
│ 7. PME               │ Bilan formel, compte de résultat, RCCM, NIF, INPS,     │
│                      │ ratio de couverture dette >= 200%, ratio solvabilité   │
├──────────────────────┼────────────────────────────────────────────────────────┤
│ 8. PERSONNE_MORALE   │ Statuts notariés, gérants et mandataires multiples,    │
│                      │ bénéficiaires effectifs (> 25%), conformité LAB/FT/PPE │
└──────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. Parcours Terrain en 9 Étapes (Cas Personne Morale / PME)

Pour une PME ou Personne Morale (modèle officiel Kafo Jiginew), le parcours de collecte suit 9 étapes obligatoires :

1. **Étape 1 : Informations générales du dossier** (caisse, guichet, compte, montant, durée, agent responsable).
2. **Étape 2 : Identification de la société** (raison sociale, forme SARL/SA/GIE, RCCM, NIF, INPS, siège, téléphone, CA annuel).
3. **Étape 3 : Dirigeants & Signataires (Bloc Dynamique)** : Gestion de N signataires avec CNI/NINA, fonction, mandataire principal.
4. **Étape 4 : Bénéficiaires effectifs** : Identification légale de toute personne détenant plus de 25% des parts ou du contrôle.
5. **Étape 5 : Origine des fonds & Objet du crédit** : Traçabilité des apports, destination économique des fonds déboursés.
6. **Étape 6 : Risque, Conformité & Statut PPE** : Vérification Personne Politiquement Exposée (dirigeants et associés).
7. **Étape 7 : Pièces fournies (KYC & Documents légaux)** : Checklist avec statut (Fourni, Manquant, À vérifier).
8. **Étape 8 : Grille d'évaluation & Scoring institutionnel Kafo Jiginew** :
   - Section A : Note sur l'entreprise (13 critères, max 30 pts)
   - Section B : Note sur l'emprunteur (6 critères, max 20 pts)
   - Section C : Note sur le marché (3 critères, max 15 pts)
   - Section D : Historique compte & antécédents (5 critères, max 15 pts)
   - Section E : Garanties & cautions (4 critères, max 20 pts)
   - **Règle éliminatoire** : Note globale $< 70$ points $\implies$ Rejet automatique recommandé.
9. **Étape 9 : Récapitulatif final & Soumission au Comité** : Synthèse 360°, visa de l'agent et horodatage de clôture d'instruction.
