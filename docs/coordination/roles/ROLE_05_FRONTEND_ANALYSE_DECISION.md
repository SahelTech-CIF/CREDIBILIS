# ROLE 05 — Frontend Analyse / Décision

## Mission

Construire l'expérience d'analyse une fois que le dossier est suffisamment complet.

Tu présentes l'information métier, la qualité des données, le résultat statistique, les explications, les simulations et le workflow humain.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- TanStack Table
- Recharts

## Écrans sous ta responsabilité

- Client 360 ;
- Dossier d'analyse ;
- Résumé économique ;
- Historique de crédit ;
- Qualité et provenance ;
- Analyse PME ;
- Analyse salarié ;
- Cohorte comparable ;
- Résultat statistique ;
- Confiance ;
- Facteurs explicatifs ;
- Simulateur montant/durée ;
- Avis agent ;
- validation superviseur ;
- décision comité ;
- audit visible du workflow.

## Entrées

APIs DRF basées sur :
- données dossier ;
- historique ;
- qualité ;
- provenance ;
- `ScoringResult`.

## Règles

- aucune formule de scoring dans React ;
- aucun seuil métier codé en dur sans contrat backend ;
- score ≠ décision ;
- afficher les limites et warnings remontés par le backend ;
- distinguer clairement :
  - données déclarées ;
  - données vérifiées ;
  - analyse métier ;
  - estimation statistique ;
  - décision humaine.

## Tu peux travailler avec des mocks

Tant que `ScoringResult` n'est pas final, utilise un JSON mock conforme au contrat documenté.

Ne bloque pas ton travail en attendant le Data Scientist.

## Handoff attendu

Vers Lead :
- routes nécessaires ;
- contrat UI consommé ;
- écarts API.

Vers Data Science :
- besoins d'affichage précis sur `ScoringResult`, sans lui imposer de logique frontend.
