# Architecture MCP (Model Context Protocol) — CREDIBILIS

Ce document définit la stratégie officielle d'exposition agentique de CREDIBILIS via le protocole MCP (**Model Context Protocol**).

---

## 1. Principes Fondamentaux & Garde-Fous

### Règle d'or de circulation des flux :

```text
┌────────────────────────────────────────────────────────┐
│                      Agent IA                          │
└──────────────────────────┬─────────────────────────────┘
                           │  Requête MCP (JSON-RPC)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Couche Serveur MCP                   │
│           (django-mcp-server / django-mcpz)            │
└──────────────────────────┬─────────────────────────────┘
                           │  Appel API interne typé
                           ▼
┌────────────────────────────────────────────────────────┐
│             Couche Django / DRF & Services             │
│        (Authentification, Droits, Validation métier)   │
└──────────────────────────┬─────────────────────────────┘
                           │  Appels services métier
                           ▼
┌────────────────────────────────────────────────────────┐
│      Packages Métiers Purs (collecte & credit)         │
│     (Python pur, règles prudentielles, scoring)        │
└──────────────────────────┬─────────────────────────────┘
                           │  Persistance contrôlée
                           ▼
┌────────────────────────────────────────────────────────┐
│                 Base de Données PostgreSQL             │
└────────────────────────────────────────────────────────┘
```

> **INTERDICTION ABSOLUE :**
> ```text
> Agent IA ──[MCP]──> SQL direct / ORM direct  ❌ STRICTEMENT INTERDIT
> ```
> Un agent IA ne manipule jamais la base de données directement. Il consomme exclusivement des **outils MCP métier**, validés par la couche de services.

---

## 2. Découplage Architectural

Conformément à la Constitution `AGENTS.md` :
1. `packages/collecte` et `packages/credit` restent en **Python pur** sans aucune dépendance envers `django.*` ni envers une librairie MCP.
2. Le serveur MCP est un adaptateur d'interface (Delivery Mechanism) hébergé au niveau de l'application Django (`apps/mcp/` ou couche API externe).
3. Le protocole MCP retenu privilégie le mode HTTP/SSE (Stateless / Streamable), s'intégrant naturellement au cycle de requête ASGI/WSGI de Django.

---

## 3. Outils Métiers Autorisés (Tools MCP)

Les outils exposés aux agents d'instruction et de synthèse doivent être strictement typés et audités :

### 1. `obtenir_dossier_credit(dossier_id: str) -> dict`
- **Rôle :** Retourne l'état complet du dossier d'instruction (données civiles, financières, statut et historique des pièces).
- **Sécurité :** Filtrage des données hautement sensibles selon les permissions de l'agent.

### 2. `obtenir_resume_client(client_id: str) -> dict`
- **Rôle :** Synthèse du profil emprunteur, ancienneté, nombre de crédits remboursés, incident de paiement éventuel.

### 3. `analyser_qualite_donnees(dossier_id: str) -> dict`
- **Rôle :** Exécute l'audit normatif 5D (`credibilis_collecte`) sur le dossier :
  - Complétude (30%)
  - Validité (30%)
  - Unicité (15%)
  - Cohérence (10%)
  - Traçabilité / Provenance (15%)
- **Retour :** Score global sur 100 et liste des anomalies bloquantes ou avertissements.

### 4. `lister_documents_manquants(dossier_id: str) -> list[dict]`
- **Rôle :** Compare les pièces justificatives fournies aux exigences de la configuration active du produit (ex: CNI, bilans certifiés, factures proforma).
- **Retour :** Liste des pièces obligatoires manquantes ou à renouveler.

### 5. `obtenir_variables_derivees(dossier_id: str) -> dict`
- **Rôle :** Calcule les ratios financiers et variables dérivées sans effets de bord :
  - Capacité nette mensuelle
  - Échéance théorique
  - Ratio d'endettement prudentiel (seuil max 33% / 40%)
  - Poids du crédit sur le Chiffre d'Affaires annuel.

### 6. `generer_synthese_qualitative(dossier_id: str) -> str`
- **Rôle :** Génère un mémo d'instruction structuré à destination des membres du comité de crédit (points forts, fragilités identifiées, conformité des garanties).

### 7. `simuler_offre_responsable(dossier_id: str, montant: float, duree_mois: int) -> dict`
- **Rôle :** Teste si les paramètres demandés respectent les critères prudentiels UEMOA / Kafo Jiginew. Si le risque de surendettement est avéré, propose automatiquement un rééchelonnement (durée allongée ou montant réajusté).

---

## 4. Outils Strictement Interdits (Garde-fous de Sécurité)

| Action Interdite | Rationale / Risque Prudentiel |
| :--- | :--- |
| `executer_sql_brut` | Risque d'injection, de contournement d'intégrité et de fuite de données bancaires. |
| `valider_decision_finale` | Une décision d'octroi ou de rejet relève de la responsabilité légale exclusive du comité de crédit humain. L'IA ne peut être que consultative. |
| `modifier_bareme_notation` | Interdiction de modifier les seuils d'accord (ex: éliminatoire $<70$ pts) ou les points d'un critère sans validation formelle par un administrateur accrédité. |
| `fusionner_clients_sans_preuve` | Respect strict de la règle anti-homonymes : pas de fusion sur nom/prénom seul sans concordance stricte (téléphone, NINA/CNI, date de naissance). |
| `eval_formule_dynamique` | Aucune formule arithmétique transmise par prompt ne doit être exécutée avec `eval()`. |

---

## 5. Calendrier d'Intégration dans CREDIBILIS

1. **Sprint V0 (Actuel) :** Validation du moteur de configuration dynamique, dictionnaire de données et formulaires réactifs (Thème clair, zéro dette).
2. **Sprint V1 :** Implémentation du backend Django REST Framework et de la persistance relationnelle PostgreSQL (Dossiers, Clients, Audits).
3. **Sprint V2 :** Branchage de la couche MCP au-dessus des ViewSets DRF pour permettre aux agents LLM d'instruire les dossiers en lecture/simulation assistée.
