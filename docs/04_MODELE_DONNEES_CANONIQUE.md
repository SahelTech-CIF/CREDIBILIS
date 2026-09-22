# Modèle de données canonique

## 1. Pourquoi

Les institutions n'utilisent pas les mêmes colonnes, formulaires ou identifiants. Le système doit donc posséder son propre vocabulaire stable.

## 2. Principe

```text
source externe -> mapping -> schéma canonique -> persistance
```

Le schéma canonique est versionné.

## 3. Entités de base

### Institution
```text
id
code
nom
pays
active
```

### Agence
```text
id
institution_id
code_externe
nom
localite
```

### Personne
```text
id
nom
prenoms
date_naissance?
sexe?
telephone_principal?
```

Ne pas placer toutes les données crédit dans Personne.

### ExternalIdentifier
```text
id
institution_id
entity_type
entity_id
identifier_type
value
valid_from?
valid_to?
status
```

### ActiviteEconomique
```text
id
person_id
sector_code
description
start_date?
location?
status
```

### Menage
```text
id
person_id
snapshot_date
household_size?
dependents?
```

### DemandeCredit
```text
id
institution_id
applicant_id
external_request_id?
product_code?
amount_requested
term?
purpose?
submitted_at?
status
```

### Credit
```text
id
institution_id
borrower_id
application_id?
external_credit_id?
amount_disbursed
start_date
end_date?
status
```

### Echeance
```text
id
credit_id
external_id?
due_date
principal_due?
interest_due?
total_due
status
```

### PaiementHistorique
```text
id
credit_id
echeance_id?
external_id?
paid_at
amount
source
```

### Engagement
```text
id
person_id
creditor_type
creditor_name?
initial_amount?
outstanding_amount?
periodic_payment?
frequency?
```

### Garantie
```text
id
application_id
type
description?
estimated_value?
verification_status
```

### Document
```text
id
application_id?
person_id?
document_type
storage_reference
verification_status
uploaded_at
```

### ImportBatch
```text
id
institution_id
checksum
source_filename
mapping_version
schema_version
status
created_at
committed_at?
```

### DataObservation
Voir document de provenance.

## 4. Snapshots

Les données évoluent. Pour l'analyse de crédit, une valeur actuelle ne doit pas remplacer silencieusement la valeur historique utilisée lors de la décision.

D'où la notion de :

```text
CreditApplicationSnapshot
```

Les snapshots sont immuables après validation, sauf mécanisme de correction explicitement audité.

## 5. Champs spécialisés

Le formulaire PME et le formulaire salarié montrent des besoins différents.

Ne pas créer un modèle Personne avec 200 colonnes conditionnelles.

Utiliser :
- entités génériques stables ;
- schémas de collecte spécialisés ;
- observations/propriétés structurées lorsque nécessaire ;
- versionnement des cadres métier.
