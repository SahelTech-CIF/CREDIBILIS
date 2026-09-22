"""
Package credibilis_intelligence — Couche d'Abstraction IA & LLM pour CREDIBILIS.
Ce package est en Python pur (aucune dépendance Django autorisée).
"""

from credibilis_intelligence.contrats import (
    ContexteIA,
    RequeteIA,
    ReponseIA,
    ConfigurationIA,
    ModeExecutionIA,
    NiveauSensibiliteIA,
    ExecutionIAJournal,
)
from credibilis_intelligence.fournisseurs import (
    FournisseurIABase,
    FournisseurFactice,
    FournisseurDeepSeek,
    FournisseurLocal,
)
from credibilis_intelligence.routeur import RouteurIA
from credibilis_intelligence.exceptions import (
    ErreurIntelligence,
    FournisseurIndisponibleError,
    ValidationSortieError,
    PolitiqueConfidentialiteError,
)
from credibilis_intelligence.taches import (
    executer_analyse_qualitative,
    executer_detection_contradictions,
    executer_synthese_dossier,
    executer_diagnostic_donnees_manquantes,
)

__version__ = "0.1.0"

__all__ = [
    "ContexteIA",
    "RequeteIA",
    "ReponseIA",
    "ConfigurationIA",
    "ModeExecutionIA",
    "NiveauSensibiliteIA",
    "ExecutionIAJournal",
    "FournisseurIABase",
    "FournisseurFactice",
    "FournisseurDeepSeek",
    "FournisseurLocal",
    "RouteurIA",
    "ErreurIntelligence",
    "FournisseurIndisponibleError",
    "ValidationSortieError",
    "PolitiqueConfidentialiteError",
    "executer_analyse_qualitative",
    "executer_detection_contradictions",
    "executer_synthese_dossier",
    "executer_diagnostic_donnees_manquantes",
]
