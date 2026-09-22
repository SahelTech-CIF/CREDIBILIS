# Configuration des Profils et Produits de Crédit — CREDIBILIS

Ce document spécifie les contrats de configuration des profils d'emprunteurs et des produits de micro-crédit au sein de l'écosystème CREDIBILIS (normes UEMOA / BCEAO).

---

## 1. Définition de Profil (`DefinitionProfil`)

Un profil regroupe les paramètres socio-économiques d'une cohorte d'emprunteurs.

```text
┌────────────────────────────────────────────────────────┐
│                   DÉFINITION DE PROFIL                 │
├──────────────────────────┬─────────────────────────────┤
│ code                     │ PME                         │
│ libelle                  │ Petite et Moyenne Entreprise│
│ type_personne            │ MORALE                      │
│ seuil_chiffre_affaires   │ >= 10 000 000 FCFA          │
│ documents_obligatoires   │ RCCM, NIF, Statuts, Bilans  │
│ grille_notation          │ GRILLE_KAFO_ENTREPRISE_V1   │
│ controle_ppe_obligatoire │ OUI                         │
└──────────────────────────┴─────────────────────────────┘
```

### Liste des Profils Enregistrés :
1. `SALARIE` : Employés du secteur public, parapublic ou privé formel.
2. `COMMERCANT` : Détaillants et demi-grossistes sur marchés urbains et ruraux.
3. `AGRICULTEUR` : Producteurs céréaliers, maraîchers, arboriculteurs (Office du Niger, Sikasso).
4. `ELEVEUR` : Pasteurs et agro-pasteurs du delta central et du sahel.
5. `ARTISAN` : Professionnels des métiers manuels, transformation et réparation.
6. `MICRO_ENTREPRISE` : Activités individuelles génératrices de revenus.
7. `PME` : Entreprises structurées avec comptabilité et personnel permanent.
8. `PERSONNE_MORALE` : Sociétés commerciales (SARL, SAS, SA), GIE et Coopératives.

---

## 2. Définition de Produit de Crédit (`DefinitionProduitCredit`)

Chaque institution financière partenaire (ex: *Kafo Jiginew*, *Nyèsigiso*, *BNDA*) configure ses produits de crédit selon ses barèmes et le taux d'usure fixé par la BCEAO.

| Code Produit | Libellé Commercial | Montant Min - Max (FCFA) | Durée Min - Max (Mois) | Périodicité | Garanties Exigées |
|---|---|---|---|---|---|
| `CRED_PME_FDR` | Fonds de Roulement PME | 5 000 000 – 50 000 000 | 6 – 36 mois | Mensuelle | Dépôt 10%, Gage stock/matériel, Caution gérant |
| `CRED_CAMPAGNE` | Campagne Agricole Céréales | 500 000 – 10 000 000 | 6 – 12 mois | In fine (post-récolte) | Caution solidaire de groupement, nantissement récolte |
| `CRED_COMMERCE` | Trésorerie Marché & Stock | 1 000 000 – 15 000 000 | 3 – 18 mois | Mensuelle / Bimensuelle | Nantissement fonds de commerce, caution solidaire |
| `CRED_EQUIPEMENT`| Investissement Artisans | 2 000 000 – 20 000 000 | 12 – 48 mois | Mensuelle | Gage matériel acheté avec facture d'origine |
| `CRED_SALARIE` | Prêt Équipement & Consommation | 300 000 – 5 000 000 | 6 – 24 mois | Mensuelle (retenue source)| Domiciliation irrévocable de salaire + quotité <= 33% |

---

## 3. Ratios Prudentiels et Règles d'Éligibilité

Les règles d'analyse appliquées lors de l'instruction d'un produit sont standardisées :

1. **Quotité Cessible Salarié** :
   $$\text{Quotité} = \frac{\text{Mensualité du prêt} + \text{Autres charges financières}}{\text{Salaire Net Mensuel}} \le 33\%$$
2. **Couverture de Dette Entreprise (Norme Kafo Jiginew)** :
   $$\text{Couverture} = \frac{\text{Résultat Net d'Exploitation Mensuel}}{\text{Échéance Mensuelle du Crédit}} \ge 200\%$$
3. **Solvabilité Entreprise** :
   $$\text{Solvabilité} = \frac{\text{Crédit Demandé}}{\text{Fonds Propres Déclarés}} \le 50\%$$
4. **Dépôt de Garantie (Nantissement)** :
   $$\text{Dépôt de Garantie Espèces} \ge 10\% \times \text{Montant Accordé}$$
