# Cadre d'Analyse, Variables et Règles de Notation — CREDIBILIS

Ce document formalise la méthode d'évaluation économique, financière et statistique des demandes de micro-crédit dans CREDIBILIS.

---

## 1. Structure du Cadre d'Analyse (`CadreAnalyse`)

Le cadre d'analyse structure l'évaluation d'un dossier en 5 piliers :

```text
                                 CADRE D'ANALYSE
                                        │
    ┌──────────────┬────────────────────┼───────────────────┬──────────────┐
    ▼              ▼                    ▼                   ▼              ▼
1. ENTREPRISE  2. EMPRUNTEUR        3. MARCHÉ          4. HISTORIQUE   5. GARANTIE
  (Max: 30)      (Max: 20)          (Max: 15)            (Max: 15)       (Max: 20)
    │              │                    │                   │              │
    └──────────────┴────────────────────┼───────────────────┴──────────────┘
                                        │
                                        ▼
                                NOTE GLOBALE / 100
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
                  NOTE < 70 PTS                 NOTE >= 70 PTS
                         │                             │
                         ▼                             ▼
                 REJET RECOMMANDÉ              ÉVALUATION COMITÉ
             (Éliminatoire Kafo)             (70-79: Examen / 80+: Favorable)
```

---

## 2. Variables Dérivées et Ratios de Calcul

Les variables dérivées sont calculées automatiquement par le moteur sans intervention humaine :

| Variable Dérivée | Formule de Calcul | Unité | Interprétation |
|---|---|---|---|
| `marge_brute` | $\text{Chiffre d'Affaires} - \text{Achats Marchandises}$ | FCFA | Rentabilité commerciale directe |
| `resultat_net_mensuel` | $\text{Marge Brute} - \sum \text{Dépenses d'Exploitation}$ | FCFA | Capacité d'autofinancement mensuelle |
| `surplus_personnel` | $\text{Revenus Foyer} - \text{Dépenses Vitales Foyer}$ | FCFA | Marge de sécurité personnelle de l'exploitant |
| `montant_disponible` | $\text{Résultat Net} + \text{Surplus Personnel}$ | FCFA | Enveloppe totale dédiée au remboursement |
| `ratio_couverture_dette` | $\frac{\text{Résultat Net Mensuel}}{\text{Échéance Mensuelle du Crédit}}$ | $\%$ | **Norme Kafo Jiginew : $\ge 200\%$** |
| `ratio_solvabilite` | $\frac{\text{Montant Crédit}}{\text{Fonds Propres}}$ | $\%$ | **Norme : $\le 50\%$** |
| `ratio_couverture_garantie`| $\frac{\text{Valeur Estimée des Garanties}}{\text{Montant du Prêt}}$ | $\%$ | Doit couvrir au minimum 120% à 150% du prêt |

---

## 3. Règle de Notation et Grille Kafo Jiginew (sur 100 Points)

### Section A — Note sur l'Entreprise (Max : 30 pts)
- Ancienneté de l'entreprise : 0 à 3 pts
- Degré de formalisation (registre, licence, siège) : 0 à 3 pts
- Qualité des ressources humaines : 0 à 2 pts
- Rentabilité de l'activité : 0 à 3 pts
- Progression du chiffre d'affaires : 0 à 3 pts
- Portefeuille clientèle et diversification : 0 à 2 pts
- Solvabilité des clients (créances saines) : 0 à 2 pts
- Tenue des documents comptables (livres de caisse, factures) : 0 à 3 pts
- Qualité de l'emplacement commercial : 0 à 2 pts
- Qualité des équipements et outillages : 0 à 2 pts
- Gestion des stocks : 0 à 2 pts
- Délais moyens de règlement clients : 0 à 1.5 pt
- Délais moyens fournisseurs : 0 à 1.5 pt

### Section B — Note sur l'Emprunteur & Dirigeants (Max : 20 pts)
- Moralité et réputation sur la place : 0 à 5 pts
- Expérience professionnelle dans le métier : 0 à 4 pts
- Niveau d'instruction et formation : 0 à 3 pts
- Motivation et dynamisme commercial : 0 à 3 pts
- Succession et relève familiale/équipe : 0 à 2 pts
- Qualité du management : 0 à 3 pts

### Section C — Note sur le Marché (Max : 15 pts)
- Degré de stabilité du secteur d'activité : 0 à 5 pts
- Diversification des produits/services vendus : 0 à 5 pts
- Part de marché locale et affluence : 0 à 5 pts

### Section D — Historique Compte & Antécédents (Max : 15 pts)
- Ancienneté de la relation avec l'IMF (sociétariat) : 0 à 3 pts
- Antécédents de remboursement (prêts antérieurs sans retard) : 0 à 4 pts
- Mouvements et dépôts sur les 6 derniers mois : 0 à 3 pts
- Solde moyen des dépôts : 0 à 3 pts
- Régularité des opérations sur compte DAV : 0 à 2 pts

### Section E — Garanties & Cautions (Max : 20 pts)
- Niveau de couverture par garantie matérielle / gage : 0 à 8 pts
- Qualité du titre de propriété (titre foncier, concession, bail notarié) : 0 à 5 pts
- Degré de formalisation juridique des garanties : 0 à 4 pts
- Qualité et solvabilité de la caution solidaire : 0 à 3 pts

---

## 4. Photographie à la Date de Décision ($T_0$) & Transparence

1. **Immuabilité $T_0$** : Dès que l'agent de crédit ou le superviseur clôture l'instruction, une copie intégrale des données d'entrée, des variables dérivées et de la grille de scoring est horodatée et archivée sous forme de `PhotographieT0`.
2. **Explicabilité SHAP & Facteurs Clés** : Tout score calculé doit obligatoirement être accompagné de ses 3 facteurs positifs majeurs et de ses 2 facteurs de risque pour garantir le droit à l'explication de l'emprunteur (Loi UEMOA sur la protection des consommateurs de services financiers).
3. **Double regard humain** : L'algorithme ne rejette ni n'accorde jamais de manière autonome. La décision appartient souverainement au **Comité de Crédit**.
