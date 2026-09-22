# Sécurité, audit et multi-institution

## 1. Isolation institutionnelle

Toutes les données métier doivent être rattachées à un contexte institutionnel lorsque pertinent.

Une requête doit utiliser l'institution de l'utilisateur authentifié, pas une institution arbitraire passée par le frontend.

## 2. Rôles indicatifs

```text
ADMIN_INSTITUTION
AGENT_CREDIT
SUPERVISEUR
COMITE
DATA_MANAGER
AUDITEUR
```

Les rôles exacts seront configurés au niveau Django.

## 3. Données sensibles

Ne jamais logger :
- numéro complet de pièce d'identité ;
- document uploadé ;
- informations bancaires ;
- secrets ;
- contenu complet du dossier.

## 4. Upload sécurité

Vérifier :
- extension ;
- MIME ;
- taille ;
- nom sécurisé ;
- stockage hors chemin exécutable ;
- contenu attendu.

## 5. AuditEvent

```text
id
institution_id
actor_id
event_type
entity_type
entity_id
metadata_safe
created_at
correlation_id
```

Ne pas mettre de PII inutile dans `metadata_safe`.

## 6. Consentement

Le système doit permettre de conserver la preuve et le contexte du consentement lorsqu'il est requis par le processus métier.

## 7. Export

L'export est une action sensible : permission, filtre institution, journal d'audit et limitation des champs.
