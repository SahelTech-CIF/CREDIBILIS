# Import, mapping, qualité et provenance

## 1. Workflow

```text
RECEIVED
  -> INSPECTED
  -> MAPPING_REQUIRED / MAPPED
  -> VALIDATED
  -> READY_TO_COMMIT
  -> COMMITTED
```

États d'échec :

```text
REJECTED
FAILED
CANCELLED
```

## 2. Preview obligatoire

Un import institutionnel ne doit pas être commit automatiquement dès l'upload.

L'utilisateur doit pouvoir voir :
- feuilles détectées ;
- mapping ;
- lignes valides ;
- erreurs ;
- doublons ;
- ambiguïtés ;
- métriques qualité.

## 3. Mapping versionné

Lorsqu'un mapping est validé, il devient réutilisable pour les prochaines sources ayant la même signature.

## 4. Transformations

Chaque transformation importante peut être tracée :

```text
raw_value: "150 000 F"
operation: parse_currency
normalized_value: 150000
```

## 5. Provenance

Source kinds possibles :

```text
DECLARATION
DOCUMENT
IMPORT_FILE
EXTERNAL_API
AGENT_VERIFIED
COMPUTED
SYSTEM_DERIVED
```

Verification levels :

```text
UNVERIFIED
DECLARED
IMPORTED
PARTIALLY_VERIFIED
VERIFIED
```

## 6. Quality summary

Exemple :

```json
{
  "completeness": 0.92,
  "validity": 0.97,
  "uniqueness": 0.99,
  "traceability": 1.0,
  "blocking_issues": 2,
  "warnings": 14
}
```

Ce format est indicatif ; le contrat final est documenté dans les contrats inter-modules.
