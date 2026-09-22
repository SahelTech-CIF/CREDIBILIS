# Architecture des modules

Ce document décrit les frontières fonctionnelles afin que plusieurs développeurs et agents puissent travailler en parallèle.

## 1. Règle

Un module possède :

- sa responsabilité ;
- ses entrées ;
- ses sorties ;
- ses erreurs ;
- ses tests ;
- ses contrats publics.

Il ne doit pas accéder directement aux détails internes d'un autre module.

---

## 2. Module `collecte`

### Responsabilité
Transformer une source externe en données canoniques exploitables.

### Entrées
- fichier CSV/XLSX/JSON ;
- contexte institutionnel ;
- profil de mapping ;
- schéma canonique ;
- éventuellement un port de recherche d'identités.

### Sorties
- `ImportResult` ;
- `CanonicalRecord[]` ;
- `DataIssue[]` ;
- `MatchCandidate[]` ;
- rapport qualité.

### Ne fait pas
- scoring ;
- décision de crédit ;
- ORM Django ;
- UI.

---

## 3. Module `dossiers`

### Responsabilité
Construire et versionner le dossier de crédit à T0.

### Entrées
- données canoniques persistées ;
- données saisies par l'agent ;
- documents et vérifications.

### Sorties
- `CreditApplicationSnapshot`.

### Ne fait pas
- entraînement du modèle ;
- mapping Excel ;
- décision finale.

---

## 4. Module `analyse_metier`

### Responsabilité
Exécuter les cadres d'analyse configurables de l'institution.

### Entrées
- snapshot T0 ;
- cadre/version ;
- formules ;
- règles ;
- seuils.

### Sorties
- valeurs calculées ;
- règles déclenchées ;
- anomalies ;
- synthèse métier.

---

## 5. Module `feature_engine`

### Responsabilité
Construire des variables à partir de l'historique sans fuite temporelle.

### Entrées
- snapshot T0 ;
- historique canonique ;
- schéma de features.

### Sorties
- `FeatureSnapshot`.

---

## 6. Module `scoring_bridge`

### Responsabilité
Adapter `FeatureSnapshot` au contrat du moteur Data Science.

### Entrées
- features ;
- contexte modèle ;
- version demandée.

### Sorties
- `ScoringResult`.

### Ne fait pas
- calcul de provenance ;
- persistance ;
- politique de décision.

---

## 7. `ds_engine`

### Responsabilité
Calculs Data Science et scoring expérimental.

### État actuel
Le dépôt contient déjà ce moteur. Il doit être traité comme un composant séparé.

### Règle
`ds_engine` ne lit pas directement les uploads institutionnels ni les modèles Django.

---

## 8. Module `decisions`

### Responsabilité
Gérer le workflow institutionnel de décision.

### Entrées
- dossier ;
- analyse métier ;
- score ;
- explications ;
- politique institutionnelle ;
- actions humaines.

### Sorties
- décision ;
- auteur ;
- date ;
- motifs ;
- historique de validation.

---

## 9. Module `audit`

### Responsabilité
Tracer les opérations sensibles.

Événements typiques :

```text
IMPORT_CREATED
IMPORT_COMMITTED
ENTITY_MATCH_CONFIRMED
ENTITY_MERGED
CREDIT_APPLICATION_SUBMITTED
ANALYSIS_EXECUTED
SCORING_EXECUTED
DECISION_RECORDED
EXPORT_CREATED
```

---

## 10. Matrice de dépendances

| Module | Peut dépendre de | Ne doit pas dépendre de |
|---|---|---|
| collecte | stdlib, libs parsing | Django, ds_engine |
| dossiers | contrats domaine | frontend, ds_engine direct |
| analyse_metier | domaine, parser sécurisé | Django views |
| feature_engine | domaine historique | frontend |
| scoring_bridge | feature contracts, ds_engine | Django ORM |
| backend Django | tous les packages publics | internals non publics |
| frontend | API HTTP | DB, moteurs Python |
