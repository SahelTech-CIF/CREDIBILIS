# AGENTS.md — Règles de travail CREDIBILIS

## Ordre de lecture obligatoire
1. `README.md`
2. `docs/Architecture.md`
3. `docs/01_DECISIONS_ARCHITECTURE.md`
4. `docs/02_MOTEUR_COLLECTE.md`
5. `docs/03_CONTRATS_DONNEES.md`
6. `docs/04_PLAN_ATTAQUE.md`

## Principe non négociable
Le moteur de collecte est un package **Python pur**, indépendant de Django.
Django peut importer le moteur de collecte. Le moteur de collecte ne doit pas importer Django ou DRF.

## Priorité actuelle
Construire le moteur de collecte : import/export, mapping, schéma canonique, normalisation, validation, identité, rapprochement, provenance et qualité. La refonte de `ds_engine/` n'est pas la priorité.

## Règles
- Pas de logique métier dans les views/serializers Django.
- Pas de FastAPI/Flask en parallèle sans décision documentée.
- Pas de fusion automatique d'entités sur nom/prénom seul.
- Les données synthétiques ne doivent pas être présentées comme une validation réelle du modèle.
- Toute décision structurante doit être documentée avant ou avec le code.
- Toute modification doit préciser fichiers touchés, tests ajoutés, limites et risques de compatibilité.
- Les tests du coeur du moteur de collecte doivent fonctionner sans `DJANGO_SETTINGS_MODULE`.

## Definition of Done
Une tâche est terminée si elle respecte l'architecture, possède des tests, gère les erreurs attendues, conserve la provenance quand nécessaire, ne casse pas les contrats et met à jour la documentation si le comportement public change.
