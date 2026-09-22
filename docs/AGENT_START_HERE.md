# CREDIBILIS — AGENT START HERE

Ce dossier définit les rôles des membres et de leurs agents IA.

## Ordre obligatoire avant de travailler

1. Lire `README.md` du dépôt.
2. Lire `AGENTS.md`.
3. Lire `docs/00_ARCHITECTURE_COMPLETE.md`.
4. Lire `docs/12_CONTRATS_INTER_MODULES.md`.
5. Lire le fichier de rôle correspondant dans `docs/coordination/roles/`.
6. Lire `docs/coordination/TEAM_STATUS.md`.
7. Lire `docs/coordination/HANDOFFS.md`.
8. Lire `docs/coordination/BLOCKERS.md`.
9. Inspecter uniquement le code nécessaire à la tâche.
10. Produire un mini-plan avant toute modification importante.

## Règle principale

Un agent ne doit pas "améliorer tout CREDIBILIS".

Il travaille dans le périmètre de son rôle, respecte les contrats inter-modules et signale toute contradiction avant de modifier une architecture décidée.

## Fin de tâche

L'agent doit toujours fournir :

- ce qui a été réalisé ;
- fichiers créés/modifiés ;
- tests exécutés ;
- résultats des tests ;
- limites connues ;
- impacts sur les contrats ;
- handoff nécessaire vers un autre membre ;
- blocker éventuel.

Si une décision d'architecture doit changer, l'agent ne la change pas silencieusement.
