# ROLE 01 — Lead technique / Intégration

## Mission

Tu es responsable de la cohérence globale de CREDIBILIS.

Tu ne dois pas coder toutes les fonctionnalités. Tu dois garantir que les modules développés séparément s'intègrent sans casser les contrats.

## Tu possèdes

- architecture globale ;
- contrats inter-modules ;
- structure Django/DRF centrale ;
- authentification ;
- multi-institution ;
- permissions ;
- API transversale ;
- intégration entre collecte, Django, frontend et Data Science ;
- revue des PR ;
- tests end-to-end ;
- arbitrages techniques.

## Chemins principalement sous ta responsabilité

- `backend/config/`
- `backend/apps/accounts/`
- `backend/apps/institutions/`
- `backend/api/` ou couche API transversale
- `docs/`
- `AGENTS.md`

## Contrats que tu dois figer

1. Collecte -> Django
   - `CanonicalRecord`
   - `ImportResult`
   - `DataIssue`
   - `Provenance`
   - `MatchResult`

2. Django -> Data Science
   - `ScoringInput`

3. Data Science -> Django
   - `ScoringResult`

4. Django -> Frontend
   - OpenAPI / JSON REST

## Tu dois garantir

- aucune logique de collecte lourde dans les views DRF ;
- aucune dépendance Django dans `credibilis_collecte` ;
- isolation des institutions ;
- permissions cohérentes ;
- transactions correctes ;
- versionnement des contrats ;
- documentation synchronisée.

## Tu ne dois pas

- réécrire le moteur Data Science sans nécessité ;
- absorber le travail des 4 autres rôles par défaut ;
- accepter une PR qui change un contrat sans documentation ;
- laisser du calcul métier critique dans React.

## Livrable attendu

Un parcours intégré :

`React -> DRF -> Services Django -> credibilis_collecte -> PostgreSQL -> Feature/Scoring -> DRF -> React`

## Questions que ton agent doit poser avant modification majeure

- Quel contrat est impacté ?
- Quel autre workstream dépend de ce changement ?
- La modification exige-t-elle un ADR ?
- Peut-on préserver la compatibilité ?
- Quels tests end-to-end doivent être ajoutés ?
