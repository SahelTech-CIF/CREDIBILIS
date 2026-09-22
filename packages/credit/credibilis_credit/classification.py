"""
Classification et Ontologie Métier en Français Intégral — CREDIBILIS
Pure Python — Aucune dépendance externe ni Django.
"""
from enum import Enum
from dataclasses import dataclass, field
from typing import List, Optional, Any, Dict
from datetime import datetime

class CategorieDonnee(str, Enum):
    """Classification fonctionnelle de la donnée collectée"""
    IDENTIFICATION = "IDENTIFICATION"
    SEGMENTATION = "SEGMENTATION"
    FINANCIER = "FINANCIER"
    TRANSACTIONNEL = "TRANSACTIONNEL"
    DOCUMENTAIRE = "DOCUMENTAIRE"
    CONFORMITE = "CONFORMITE"
    COMPORTEMENT = "COMPORTEMENT"
    HISTORIQUE = "HISTORIQUE"
    QUALITATIF = "QUALITATIF"
    RESULTAT_OBSERVE = "RESULTAT_OBSERVE"

class RoleAnalytique(str, Enum):
    """Rôle de la donnée dans les chaînes de traitement et de modélisation"""
    IDENTIFICATION_SEULE = "IDENTIFICATION_SEULE"       # Données nominatives interdites dans le scoring
    SEGMENTATION = "SEGMENTATION"                       # Découpage de cohortes locales
    VARIABLE_CANDIDATE = "VARIABLE_CANDIDATE"           # Variable d'entrée des modèles statistiques
    ENTREE_REGLE = "ENTREE_REGLE"                       # Utilisée dans les ratios et règles d'admissibilité
    PREUVE_SEULE = "PREUVE_SEULE"                       # Pièce justificative sans valeur numérique
    CONFORMITE_SEULE = "CONFORMITE_SEULE"               # Vérification LAB/FT/PPE
    RESULTAT_OBSERVE = "RESULTAT_OBSERVE"               # Target de défaut / remboursement observé

class ProfilEmprunteur(str, Enum):
    """Profil socio-économique déterminant les formulaires de collecte"""
    SALARIE = "SALARIE"
    COMMERCANT = "COMMERCANT"
    AGRICULTEUR = "AGRICULTEUR"
    ELEVEUR = "ELEVEUR"
    ARTISAN = "ARTISAN"
    MICRO_ENTREPRISE = "MICRO_ENTREPRISE"
    PME = "PME"
    PERSONNE_MORALE = "PERSONNE_MORALE"

class TypeTemporel(str, Enum):
    """Typologie temporelle pour éviter tout risque de fuite temporelle"""
    STATIQUE = "STATIQUE"
    VALEUR_ACTUELLE = "VALEUR_ACTUELLE"
    PHOTOGRAPHIE_T0 = "PHOTOGRAPHIE_T0"
    SERIE_TEMPORELLE = "SERIE_TEMPORELLE"
    EVENEMENT = "EVENEMENT"
    PERIODE = "PERIODE"

@dataclass
class DefinitionChamp:
    """Spécification d'un champ collecté dans le dictionnaire des données"""
    code: str
    libelle: str
    categorie: CategorieDonnee
    role_analytique: RoleAnalytique
    type_temporel: TypeTemporel
    type_python: str = "str"
    obligatoire: bool = True
    description: str = ""
    unite: Optional[str] = None
    valeurs_possibles: List[str] = field(default_factory=list)

@dataclass
class ExigenceDocument:
    """Pièce justificative requise pour un profil ou un produit"""
    code: str
    libelle: str
    obligatoire: bool = True
    format_attendu: str = "PDF_OU_IMAGE"
    duree_validite_jours: Optional[int] = None

@dataclass
class RegleValidation:
    """Règle de validation d'un champ ou ratio"""
    code: str
    message_erreur: str
    valeur_seuil: Optional[float] = None
    operateur: str = ">="  # >=, <=, ==, !=, in

@dataclass
class DefinitionProfil:
    """Configuration d'un profil d'emprunteur"""
    code: ProfilEmprunteur
    libelle: str
    description: str
    champs_obligatoires: List[str]
    documents_requis: List[ExigenceDocument]
    grille_notation_applicable: str

@dataclass
class DefinitionProduitCredit:
    """Paramètres financiers et contractuels d'un produit de prêt"""
    code: str
    libelle: str
    profils_eligibles: List[ProfilEmprunteur]
    montant_minimum: float
    montant_maximum: float
    duree_minimum_mois: int
    duree_maximum_mois: int
    periodicite: str = "MENSUELLE"  # MENSUELLE, TRIMESTRIELLE, IN_FINE
    taux_interet_annuel: float = 12.0
    depot_garantie_pourcentage: float = 10.0  # 10% de nantissement Kafo Jiginew
    quotite_cessible_max: Optional[float] = 33.0
