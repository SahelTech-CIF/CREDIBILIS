# Moteur de Collecte (`credibilis_collecte`) — Spécification Technique Exacte

## 1. Positionnement & Invariant Fondamental

`credibilis_collecte` **n'est pas une application Django**. C'est un **package Python pur**, distribué sous forme de SDK interne indépendant.

```text
                    FRONTEND REACT
                         │
                         │ REST / JSON (/api/v1/...)
                         ▼
                   DJANGO + DRF
                         │
              Application Services
             (ImportApplicationService)
                         │
                         ▼
               credibilis_collecte
              ┌─────────────────────┐
              │ MOTEUR PYTHON PUR   │
              │                     │
              │ lecture             │
              │ mapping             │
              │ normalisation       │
              │ validation          │
              │ identité            │
              │ rapprochement       │
              │ provenance          │
              │ qualité             │
              │ export              │
              └──────────┬──────────┘
                         │
                         ▼
                  CanonicalRecord[]
                         │
              Adaptateur Django ORM
                         │
                         ▼
                    PostgreSQL
```

> **Règle absolue :** `credibilis_collecte` ne dépend ni de Django, ni de DRF, ni de React, ni de PostgreSQL. Django importe le moteur ; le moteur n'importe jamais Django.

---

## 2. Structure Réelle du Package

```text
packages/
└── collecte/
    ├── pyproject.toml
    │
    ├── credibilis_collecte/
    │   ├── __init__.py           # Expose CollectionEngine et les contrats publics
    │   ├── engine.py             # Orchestrateur central (CollectionEngine)
    │   ├── contracts.py          # Objets d'échanges (RawRecord, CanonicalRecord, etc.)
    │   ├── enums.py              # Énumérations (Severity, EntityType, MatchStatus, etc.)
    │   ├── schema.py             # Grammaire canonique des entités et champs
    │   ├── readers.py            # Lecteurs sources (CSV, XLSX, JSON -> RawRecord[])
    │   ├── mapping.py            # MappingSuggester et validation de mapping
    │   ├── normalization.py      # Normalisation (text, money, phone, date, bool)
    │   ├── validation.py         # Contrôles d'intégrité et règles métiers
    │   ├── matching.py           # Entity Resolution (IdentityResolver & Repository port)
    │   ├── quality.py            # QualityEngine (calcul des 5 dimensions de qualité)
    │   └── exporter.py           # Export des CanonicalRecord[] vers CSV/XLSX/JSON
    │
    └── tests/
        ├── test_engine.py        # Tests d'intégration du pipeline complet sans Django
        ├── test_matching.py      # Tests du matching exact et probabiliste
        └── test_quality.py       # Tests des formules de calcul de Data Quality
```

---

## 3. `engine.py` — L'Orchestrateur Central

Point d'entrée du SDK :

```python
from credibilis_collecte import CollectionEngine
```

### Composition interne :
* `SchemaRegistry`
* `MappingSuggester`
* `Validator`
* `QualityEngine`
* `IdentityResolver`

### API Publique du Moteur :
* `engine.inspect(source, ...)` : Détecte les feuilles, colonnes, types et échantillonne les données sans transformation.
* `engine.suggest_mapping(columns, ...)` : Suggère l'alignement des colonnes sources sur les champs canoniques.
* `engine.import_source(source, mapping, context, ...)` : Exécute le pipeline complet de bout en bout.

### Flux d'Exécution interne de `import_source()` :
```text
import_source()
      ↓
validation mapping
      ↓
reader (CSV, XLSX, JSON)
      ↓
RawRecord[]
      ↓
normalisation (nettoyage et mémorisation des transformations)
      ↓
provenance (création des ProvenanceItems par cellule)
      ↓
identifiants externes (extraction des ExternalIdentifierSpec)
      ↓
validation (règles génériques + règles métiers)
      ↓
matching (exact puis probabiliste via IdentityRepository)
      ↓
CanonicalRecord[]
      ↓
détection des doublons intra-lot
      ↓
Data Quality (calcul des 5 dimensions et du score global)
      ↓
ImportResult
```

---

## 4. Contrats de Données : `contracts.py` & `enums.py`

### `ImportContext`
Contexte institutionnel obligatoire de chaque import :
```python
@dataclass(frozen=True)
class ImportContext:
    institution_id: str
    source_type: str              # "XLSX", "CSV", "JSON", "API"
    import_id: str
    agency_id: Optional[str] = None
    collected_by: Optional[str] = None
    collected_at: datetime = field(default_factory=datetime.utcnow)
    verification_level: str = "IMPORTE"
```

### `RawRecord`
Représentation brute d'une ligne source :
```python
@dataclass
class RawRecord:
    row_number: int
    values: Dict[str, Any]
    source_name: str
    sheet_name: Optional[str] = None
```

### `CanonicalRecord`
Objet pivot central après transformation :
```python
@dataclass
class CanonicalRecord:
    entity_type: str              # PERSON, ECONOMIC_ACTIVITY, etc.
    values: Dict[str, Any]        # Champs canoniques normalisés
    external_identifiers: List[ExternalIdentifierSpec]
    provenance: List[ProvenanceItem]
    issues: List[DataIssue]
    match: Optional[MatchResult] = None
    schema_version: str = "1.0"
    mapping_version: str = "1.0"
```

### `DataIssue`
Anomalie typée et qualifiée :
```python
@dataclass
class DataIssue:
    code: str                     # Ex: "REVENU_NEGATIF", "DATE_NAISSANCE_FUTURE"
    severity: Severity            # BLOCKING, ERROR, WARNING, INFO
    field: Optional[str]
    message: str
    raw_value: Optional[Any] = None
    normalized_value: Optional[Any] = None
    source_reference: Optional[str] = None
```

### `ImportResult`
Bilan d'exécution complet retourné par le moteur :
```python
@dataclass
class ImportResult:
    source_name: str
    entity_type: str
    records: List[CanonicalRecord]
    issues: List[DataIssue]
    quality: QualitySummary
    records_total: int
    records_valid: int
    records_invalid: int
    records_blocked: int
    exact_matches: int
    probable_matches: int
    ambiguous_matches: int
    new_entities: int
```

---

## 5. `readers.py` — Ingestion Découplée

Le moteur ne connaît pas la tuyauterie réseau ni le système d'exploitation de l'hôte.

```text
CSV ─────┐
         │
XLSX ────┼──→ reader_for(source_descriptor) ──→ RawRecord[]
         │
JSON ────┘
```

Chaque reader prend en charge la gestion robuste des encodages (UTF-8, Latin-1), des délimiteurs variés (`;`, `,`, tabulation) et des classeurs multi-feuilles.

---

## 6. `schema.py` — Schéma Canonique & Grammaire CREDIBILIS

### Types d'Entités Canoniques :
* `PERSON` : Personne physique (emprunteur, conjoint, garant).
* `ECONOMIC_ACTIVITY` : Activité génératrice de revenus (commerce, agriculture, artisanat).
* `CREDIT_APPLICATION` : Demande de prêt en cours d'instruction.
* `LOAN` : Crédit accordé ou décaissé.
* `INSTALLMENT` : Échéance planifiée.
* `PAYMENT` : Règlement constaté.
* `DEBT` : Engagement ou dette externe.
* `GUARANTEE` : Garantie matérielle ou caution morale.
* `DOCUMENT` : Justificatif ou pièce scannée.

### Exemples de Champs Canoniques Normalisés :
* `person.nom`, `person.prenoms`, `person.telephone`, `person.date_naissance`, `person.piece_numero`
* `activity.secteur`, `activity.ca_mensuel`, `activity.anciennete_mois`, `activity.emplacement`
* `application.montant`, `application.duree_mois`, `application.objet`, `application.periodicite`

---

## 7. `mapping.py` — Alignement des Données

Traduit les entêtes hétérogènes des institutions partenaires vers les champs canoniques :
* `MappingSuggester` : Analyse les intitulés de colonnes et calcule un score de confiance de correspondance textuelle et sémantique.
* `validate_mapping(mapping)` : Vérifie que tous les champs cibles requis existent dans le dictionnaire canonique et qu'il n'y a pas de collisions.

---

## 8. `normalization.py` — Nettoyage & Traçabilité des Conversions

Chaque conversion de type conserve son historique de transformation :
* **Nombres monétaires** : `"650 000 FCFA"` $\rightarrow$ `650000`
* **Téléphones** : `"76 12 34 56"` ou `"+223 76-12-34-56"` $\rightarrow$ `76123456`
* **Dates** : `"22/09/2026"` $\rightarrow$ `"2026-09-22"`
* **Booléens** : `"OUI"`, `"1"`, `"VRAI"` $\rightarrow$ `True`

---

## 9. `validation.py` — Règles Génériques & Règles Métiers

Le validateur enrichit le dossier d'objets `DataIssue` :
* **Règles Génériques** : Présence de champs obligatoires, types cohérents.
* **Règles Métiers d'Inclusion & de Crédit** :
  * `PERSON` sans nom $\rightarrow$ `Severity.BLOCKING`
  * Date de naissance dans le futur $\rightarrow$ `Severity.BLOCKING`
  * Montant demandé $\le 0$ $\rightarrow$ `Severity.BLOCKING`
  * Durée en mois $\le 0$ $\rightarrow$ `Severity.BLOCKING`
  * Échéance mensuelle demandée supérieure au revenu $\rightarrow$ `Severity.WARNING`

---

## 10. `matching.py` — Entity Resolution & Rapprochement

### Le Port `IdentityRepository`
Le moteur définit une interface abstraite (Protocol) pour interroger la base sans dépendre de Django :

```python
class IdentityRepository(Protocol):
    def find_by_external_id(self, institution_id: str, identifier_type: str, value: str) -> Optional[str]: ...
    def search_candidates(self, query: MatchingQuery) -> List[IdentityCandidate]: ...
```

### Algorithme de Rapprochement :
1. **Étape 1 : Rapprochement Exact (External Identifier)** :
   * Tuple : `(institution_id, entity_type, identifier_type, value)`.
   * Si trouvé : Statut `EXACT`, score de confiance = `1.0`.
2. **Étape 2 : Rapprochement Probabiliste Multicritère** :
   * Téléphone (MSISDN) : **50 %**
   * Nom / Prénom : **30 %**
   * Date de naissance : **20 %**
3. **Classification du Résultat** :
   * Score $\ge 0.96$ avec écart significatif $\rightarrow$ **`PROBABLE`**
   * Score $\ge 0.75$ $\rightarrow$ **`AMBIGU`**
   * Score $< 0.75$ $\rightarrow$ **`AUCUN`**
4. **Garde-fou Absolu** : `PROBABLE` ne déclenche jamais de fusion automatique. La décision finale est soumise à la validation humaine dans l'application métier.

---

## 11. `quality.py` — Moteur de Data Quality (5 Dimensions)

Le moteur évalue la qualité globale de chaque lot selon la formule pondérée :

$$\text{Quality Score} = 0.30 \cdot \text{Complétude} + 0.30 \cdot \text{Validité} + 0.15 \cdot \text{Unicité} + 0.10 \cdot \text{Cohérence} + 0.15 \cdot \text{Traçabilité}$$

1. **Complétude (30 %)** : Ratio de champs obligatoires et critiques renseignés.
2. **Validité (30 %)** : Absence d'anomalies bloquantes (`BLOCKING` / `ERROR`).
3. **Unicité (15 %)** : Absence de doublons d'identifiants externes dans le lot.
4. **Cohérence (10 %)** : Respect des ratios croisés (ex: charges / revenus).
5. **Traçabilité (15 %)** : Présence d'un niveau de preuve et d'une source documentée.

---

## 12. Détection des Doublons Intra-Lot

En fin de traitement de lot, `CollectionEngine` procède à un audit transversal des identifiants externes :
Si le tuple `(institution_id, entity_type, identifier_type, value)` apparaît plus d'une fois dans le même fichier :
* Génération d'une anomalie `DUPLICATE_EXTERNAL_IDENTIFIER`
* Sévérité : **`Severity.BLOCKING`**
* Le lot ne peut pas être commité silencieusement.

---

## 13. `exporter.py` — Exportation Symétrique

Permet d'exporter une liste de `CanonicalRecord[]` sous forme de :
* Fichier Excel (`.xlsx`)
* Fichier CSV délimité
* Fichier JSON structuré

L'export s'appuie sur le modèle canonique, évitant d'enfermer les données dans l'application.

---

## 14. Intégration Côté Backend Django

```text
DRF API
   ↓
ImportApplicationService (backend/apps/ingestion/)
   ↓ (appelle)
CollectionEngine (packages/collecte/credibilis_collecte/)
   ↓ (utilise le port)
DjangoIdentityRepository (backend/apps/identities/repository.py)
   ↓ (persiste)
PostgreSQL
   - ImportBatch (statuts : UPLOADED -> INSPECTED -> MAPPED -> VALIDATED -> READY -> COMMITTED)
   - ImportedRecord (conservé en staging avant commit)
   - MatchCandidate (PENDING, SAME_ENTITY, DIFFERENT_ENTITY, CREATE_NEW)
   - DataProvenance (valeur, source, transformations, niveau de preuve)
```
