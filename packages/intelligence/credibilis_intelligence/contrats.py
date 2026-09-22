"""
Contrats, dataclasses et interfaces de la couche Intelligence Artificielle.
Ce module est en Python pur (aucun import Django autorisé).
"""

from enum import Enum
from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List, Type, TypeVar
import hashlib
import json
from datetime import datetime

T = TypeVar("T")


class ModeExecutionIA(str, Enum):
    MOCK = "mock"
    CLOUD = "cloud"
    LOCAL = "local"
    HYBRIDE = "hybride"


class NiveauSensibiliteIA(str, Enum):
    NORMALE = "NORMALE"
    SENSIBLE = "SENSIBLE"
    HAUTEMENT_SENSIBLE = "HAUTEMENT_SENSIBLE"


@dataclass
class ContexteIA:
    """
    Contexte économique préparé et filtré pour le modèle.
    Ne contient AUCUNE donnée hautement confidentielle (pas de CNI, téléphone direct ni GPS précis).
    """
    dossier_id: str
    profil_emprunteur: str
    donnees_economiques: Dict[str, Any]
    donnees_qualitatives: Dict[str, Any] = field(default_factory=dict)
    contradictions_detectees: List[Dict[str, Any]] = field(default_factory=list)
    pieces_fournies: List[str] = field(default_factory=list)
    institution: str = "KAFO JIGINEW"
    niveau_sensibilite: NiveauSensibiliteIA = NiveauSensibiliteIA.NORMALE

    def calculer_empreinte_sha256(self) -> str:
        """Calcule un hash cryptographique de l'entrée pour traçabilité et dé-doublonnage."""
        payload = {
            "dossier_id": self.dossier_id,
            "profil": self.profil_emprunteur,
            "economiques": self.donnees_economiques,
            "qualitatives": self.donnees_qualitatives,
        }
        chaine = json.dumps(payload, sort_keys=True, default=str)
        return hashlib.sha256(chaine.encode("utf-8")).hexdigest()


@dataclass
class RequeteIA:
    """Requête transmise à un fournisseur LLM."""
    tache: str
    contexte: ContexteIA
    prompt_systeme: str
    prompt_utilisateur: str
    version_prompt: str = "v1"
    temperature: float = 0.1
    max_tokens: int = 1500


@dataclass
class ReponseIA:
    """Réponse brute retournée par un fournisseur LLM."""
    fournisseur_nom: str
    modele_nom: str
    contenu_texte: str
    tokens_entree: int = 0
    tokens_sortie: int = 0
    duree_ms: int = 0
    statut: str = "SUCCES"
    erreur_detail: Optional[str] = None


@dataclass
class ConfigurationIA:
    """Configuration du service d'intelligence."""
    mode_par_defaut: ModeExecutionIA = ModeExecutionIA.MOCK
    fournisseur_cloud_nom: str = "deepseek"
    modele_cloud_nom: str = "deepseek-chat"
    api_key_cloud: Optional[str] = None
    url_cloud: str = "https://api.deepseek.com/v1/chat/completions"

    fournisseur_local_nom: str = "local"
    url_modele_local: str = "http://localhost:11434/api/generate"  # Format Ollama / vLLM
    modele_local_nom: str = "llama3.2:3b"

    autoriser_donnees_sensibles_cloud: bool = False
    timeout_secondes: int = 30
    temperature: float = 0.1
    max_tokens: int = 1500


@dataclass
class ExecutionIAJournal:
    """Journal d'audit de l'exécution d'une inférence IA."""
    id: str
    dossier_id: str
    tache: str
    fournisseur: str
    modele: str
    version_prompt: str
    empreinte_entree: str
    duree_ms: int
    horodatage: str
    succes: bool
    reponse_structuree: Optional[Dict[str, Any]] = None
    erreur: Optional[str] = None
