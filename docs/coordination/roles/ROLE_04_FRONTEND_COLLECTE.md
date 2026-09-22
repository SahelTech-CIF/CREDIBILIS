# ROLE 04 — Frontend Collecte

## Mission

Construire toute l'expérience utilisateur avant le scoring.

Tu transformes les API de collecte en une interface claire et rapide pour les agents de crédit et gestionnaires de données.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- TanStack Table
- React Hook Form
- Zod

## Écrans sous ta responsabilité

- Dashboard collecte ;
- Clients ;
- Nouveau dossier ;
- Liste des dossiers ;
- Wizard de collecte ;
- Nouvel import ;
- Historique imports ;
- Inspection Excel ;
- Mapping ;
- Prévisualisation ;
- Validation ;
- Data Quality ;
- Doublons / rapprochements ;
- Documents ;
- Provenance ;
- Exports côté collecte.

## Wizard dossier

1. Identification
2. Consentement
3. Résidence / ménage
4. Activité
5. Revenus / charges
6. Dettes
7. Demande
8. Garanties
9. Documents
10. Vérification

## Formulaires dynamiques

Prévoir au minimum :
- COMMERCE
- AGRICULTURE
- ELEVAGE
- ARTISAN
- SALARIE
- AUTRE

## Règles

- aucune formule de risque dans React ;
- aucune décision de crédit ;
- Zod sert à l'UX, la validation métier finale reste backend ;
- toutes les données viennent de l'API ;
- gérer loading, empty, error et retry ;
- utiliser des mocks conformes au contrat si le backend n'est pas prêt.

## UX attendue

- progression claire ;
- autosave via API ;
- erreurs précises ;
- badges de qualité ;
- tableaux filtrables ;
- drawers/modals pour détails ;
- pas de formulaire géant ;
- pas de logique cachée dans les composants.

## Handoff attendu

Vers Lead :
- routes consommées ;
- éventuels champs API manquants ;
- tests UI.

Vers Backend Collecte :
- feedback sur les contrats JSON, sans modifier le moteur métier directement.
