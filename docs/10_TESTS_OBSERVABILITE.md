# Tests et observabilité

## 1. Pyramide de tests

```text
            E2E
        Integration
     Unitaires moteurs
```

Le plus grand volume doit être dans les tests unitaires du cœur Python.

## 2. Tests du moteur de collecte

Cas minimaux :
- CSV valide ;
- XLSX multi-feuilles ;
- colonnes inconnues ;
- mapping incomplet ;
- montant français `1 200 000` ;
- date invalide ;
- identifiant externe exact ;
- doublon probable ;
- ambiguïté ;
- provenance préservée ;
- export round-trip simple.

## 3. Tests Django

- transaction rollback ;
- permissions ;
- isolation institutionnelle ;
- upload ;
- API contract ;
- idempotence import.

## 4. Tests ds_engine

Conserver les smoke tests existants et ajouter des tests d'intégration via le bridge.

## 5. Observabilité

Logs structurés :

```text
correlation_id
import_id
institution_id
operation
status
duration_ms
```

Pas de PII.

## 6. Métriques

- imports par jour ;
- temps moyen import ;
- lignes/minute ;
- erreurs bloquantes ;
- taux de mapping automatique ;
- taux d'ambiguïté identité ;
- taux d'abstention scoring ;
- erreurs techniques.
