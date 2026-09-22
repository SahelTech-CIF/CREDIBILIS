# Couche Intelligence & Fournisseurs IA (`credibilis_intelligence`)

Ce document formalise l'architecture, les contrats et les règles de gouvernance du package `packages/intelligence/credibilis_intelligence`.

---

## 1. Principe Directeur

> **CREDIBILIS ne dépend ni de DeepSeek, ni d'Ollama, ni d'un modèle précis. CREDIBILIS dépend d'un contrat `FournisseurIA`.**

Aujourd'hui :
```text
CREDIBILIS (Django / DRF / Métier)
      ↓
Routeur IA
      ↓
FournisseurDeepSeek (Cloud API)
```

Demain ou en environnement souverain :
```text
CREDIBILIS (Django / DRF / Métier)
      ↓
Routeur IA
      ↓
FournisseurLocal (Ollama / vLLM / llama.cpp)
```

En développement local & CI :
```text
CREDIBILIS (Django / DRF / Métier / Tests)
      ↓
Routeur IA
      ↓
FournisseurFactice (Mock déterministe, 0 coût)
```

**Sans refactorer une seule ligne du code métier ni des interfaces utilisateur.**

---

## 2. Découplage Strict et Pureté Python

Conformément à la constitution du projet (`AGENTS.md`) :
- `credibilis_intelligence` est un package **Python pur**.
- **Aucun import** de `django.*`, `rest_framework.*`, `QuerySet`, ou `Model`.
- Aucune requête SQL directe.
- Transport HTTP réalisé via la bibliothèque standard Python (`urllib.request`) sans dépendance lourde tierce.
- Validation des contrats et schémas via `pydantic`.

```text
packages/
└── intelligence/
    ├── pyproject.toml
    ├── credibilis_intelligence/
    │   ├── __init__.py
    │   ├── contrats.py
    │   ├── exceptions.py
    │   ├── routeur.py
    │   ├── fournisseurs/
    │   │   ├── base.py
    │   │   ├── factice.py
    │   │   ├── deepseek.py
    │   │   └── local.py
    │   ├── schemas/
    │   │   ├── analyse.py
    │   │   ├── contradictions.py
    │   │   ├── synthese.py
    │   │   └── qualite.py
    │   ├── prompts/
    │   │   ├── registre.py
    │   │   └── templates/
    │   └── taches/
    │       ├── analyse_qualitative.py
    │       ├── contradictions.py
    │       ├── synthese_dossier.py
    │       └── diagnostic_qualite.py
    └── tests/
        ├── test_fournisseurs.py
        ├── test_routeur.py
        └── test_taches.py
```

---

## 3. Contrat d'Interface `FournisseurIA`

Tout fournisseur IA implémente l'interface abstraite standardisée :

```python
class FournisseurIABase(ABC):
    nom: str
    modele_defaut: str

    @abstractmethod
    def generer(self, requete: RequeteIA) -> ReponseIA:
        """Génère une réponse textuelle brute."""
        ...

    @abstractmethod
    def generer_structure(self, requete: RequeteIA, schema_cls: Type[T]) -> T:
        """Génère et valide une réponse sous forme d'objet Pydantic typé."""
        ...

    @abstractmethod
    def disponible(self) -> bool:
        """Contrôle d'accessibilité (health check)."""
        ...
```

---

## 4. Les Fournisseurs Fournis

1. **`FournisseurFactice`** :
   - Fournisseur simulé déterministe pour tests unitaires, développement frontend, et CI.
   - 0 coût d'API, réponse instantanée (< 1ms).
   - Valide la conformité complète des schémas Pydantic.

2. **`FournisseurDeepSeek`** :
   - Fournisseur cloud compatible OpenAI standard (`v1/chat/completions`).
   - Clé d'API configurable (via variable d'environnement ou injection directe).
   - Extraction automatique des blocs JSON markdown (` ```json ... ``` `).

3. **`FournisseurLocal`** :
   - Fournisseur HTTP agnostique ciblant un runtime local (Ollama, vLLM, llama.cpp server).
   - Format de requête standardisé.
   - Permet l'isolation complète des données sur site (on-premise / souveraineté).

---

## 5. Le `RouteurIA` et la Sécurité des Données

Le `RouteurIA` arbitre le fournisseur à invoquer selon :
- Le mode global d'exécution : `IA_MODE` (`mock`, `cloud`, `local`, `hybride`).
- L'institution financière requérante (ex. Kafo Jiginew = local obligatoire).
- Le **niveau de sensibilité** des données (`PUBLIC`, `INTERNE`, `SENSIBLE`, `CRITIQUE`).
- La politique de confidentialité : `autoriser_donnees_sensibles_cloud`.

### Règle d'or de non-fuite des données sensibles

```text
SI (Niveau >= SENSIBLE OU Institution = LOCAL_ONLY)
ET (Modèle Local indisponible)
ALORS
    -> STRICTEMENT AUCUN FALLBACK CLOUD
    -> ERREUR CONTRÔLÉE (PolitiqueConfidentialiteError / FournisseurIndisponibleError)
    -> ABSTENTION IA POUR PROTÉGER LE CLIENT
```

---

## 6. `ContexteIA` : Découplage de la Base de Données

Le modèle de données Django / PostgreSQL **ne transite jamais brut vers le LLM**.

Le service appelant instancie un `ContexteIA` minimal, filtré et nettoyé :

```json
{
  "dossier_id": "DOS-2026-BKO-001",
  "profil": "COMMERCANT",
  "secteur_activite": "COMMERCE_DETAIL",
  "variables": {
    "chiffre_affaires_mensuel": 750000,
    "charges_mensuelles": 520000,
    "anciennete_activite_mois": 84,
    "capacite_remboursement_mensuelle": 230000
  },
  "observations": [
    "Activité constatée sur place au grand marché de Bamako",
    "Boutique physique bien approvisionnée"
  ],
  "donnees_declarees": { "chiffre_affaires": 750000 },
  "donnees_verifiees": { "chiffre_affaires": 700000 },
  "metadonnees": {}
}
```

> **Éléments strictement exclus du contexte IA standard :**
> - Nom, prénom, filiation du demandeur
> - Numéro CNI, passeport, NINA
> - Coordonnées GPS précises du domicile
> - Téléphone personnel

---

## 7. Tâches Versionnées et Schémas Pydantic

Chaque cas d'usage IA correspond à une tâche spécialisée avec schéma Pydantic strict :

| Tâche | Schéma de Sortie | Rôle |
|---|---|---|
| `analyse_qualitative` | `AnalyseQualitativeSchema` | Forces, points de vigilance, synthèse métier argumentée |
| `detecter_contradictions` | `RapportContradictionsSchema` | Analyse croisée déclaratif vs vérifié terrain vs externe |
| `synthetiser_dossier` | `SyntheseDossierSchema` | Résumé exécutif pour le comité de crédit (SANS décision Accept/Refus) |
| `diagnostic_donnees_manquantes`| `DiagnosticDonneesManquantesSchema`| Analyse de complétude documentaire et criticité pour l'analyse |

> **Interdiction formelle :** Le LLM ne prend jamais la décision d'octroi de crédit (`ACCEPTER` / `REFUSER`). Cette responsabilité appartient exclusivement au comité de crédit et au moteur de règles déterministe.

---

## 8. Traçabilité et Audit (`ExecutionIAJournal`)

Chaque appel IA journalise une entrée d'audit immuable :
- `id` : Identifiant unique d'exécution (UUID4)
- `dossier_id` : Référence du dossier analysé
- `tache` : Nom de la tâche métier
- `fournisseur` : Nom du fournisseur (`factice`, `deepseek`, `local`)
- `modele` : Version du modèle invoqué
- `version_prompt` : Version du prompt (ex. `v1`)
- `empreinte_entree` : Hash SHA256 du prompt d'entrée (sans stocker de données personnelles en clair)
- `duree_ms` : Latence de l'inférence
- `horodatage` : Horodatage ISO-8601 UTC
- `succes` : Booléen de réussite
- `reponse_structuree` : JSON du résultat validé Pydantic
- `erreur` : Message d'erreur éventuel en cas d'échec

---

## 9. Adaptateur Django (`backend/apps/intelligence/`)

Dans Django, l'utilisation est encapsulée dans une couche de service :

```python
# backend/apps/intelligence/services.py
from credibilis_intelligence.routeur import RouteurIA
from credibilis_intelligence.taches.analyse_qualitative import executer_analyse_qualitative
from credibilis_intelligence.contrats import ContexteIA, ConfigurationIA

class ServiceIntelligenceCredit:
    def __init__(self, config: ConfigurationIA):
        self.routeur = RouteurIA(config)

    def analyser_dossier(self, dossier_django) -> dict:
        # 1. Extraction et anonymisation minimale
        contexte = ContexteIA(
            dossier_id=str(dossier_django.numero),
            profil=dossier_django.profil,
            variables=dossier_django.extraire_variables_anonymisees(),
            observations=dossier_django.extraire_observations(),
        )

        # 2. Exécution via le package pur Python
        resultat = executer_analyse_qualitative(self.routeur, contexte)

        # 3. Retour typé au format sérialisable
        return resultat.model_dump()
```
