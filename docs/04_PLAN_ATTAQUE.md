# Plan Technique et Plan d'Attaque

Le plan technique complet de CREDIBILIS est documenté en détail dans :

👉 **[11_PLAN_ATTAQUE.md](11_PLAN_ATTAQUE.md)**

Il formalise :
- L'architecture cible globale (React $\rightarrow$ DRF $\rightarrow$ Services $\rightarrow$ Moteurs Python $\rightarrow$ PostgreSQL / `ds_engine`).
- Le découpage en 12 briques d'implémentation ordonnées (P0 à P11).
- Le premier jalon concret de validation bout-en-bout (la colonne vertébrale).
- La répartition opérationnelle des responsabilités au sein de l'équipe.
- La règle d'architecture inviolable : *"CREDIBILIS ne dépend d'aucun formulaire, modèle IA ou algorithme unique en dur, mais de contrats configurables."*
