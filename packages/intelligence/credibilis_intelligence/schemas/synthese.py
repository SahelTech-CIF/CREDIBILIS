"""
Schémas structurés pour la détection de contradictions et la synthèse de dossier.
"""

from typing import List, Optional, Any
from pydantic import BaseModel, Field


class ContradictionElementSchema(BaseModel):
    champ: str
    valeur_declaree: Any
    valeur_verifiee: Any
    niveau_gravite: str = Field(description="MINEUR, IMPORTANT ou BLOQUANT")
    explication: str


class RapportContradictionsSchema(BaseModel):
    """Sortie structurée pour la détection des incohérences déclaratives."""
    nombre_contradictions: int = 0
    contradictions: List[ContradictionElementSchema] = Field(default_factory=list)
    recommandation_agent: str = Field(description="Conseil d'action pour l'agent de terrain")


class SyntheseDossierSchema(BaseModel):
    """Sortie structurée pour la synthèse d'un dossier de crédit."""
    resume_activite: str
    stabilite_financiere: str
    evaluation_garanties: str
    synthese_comite: str
    questions_recommandees_comite: List[str] = Field(default_factory=list)


class DiagnosticDonneesManquantesSchema(BaseModel):
    """Sortie structurée pour l'audit des pièces et données manquantes."""
    pieces_manquantes_obligatoires: List[str] = Field(default_factory=list)
    variables_a_clarifier: List[str] = Field(default_factory=list)
    dossier_complet_pour_comite: bool = True
    motif_incomplet: Optional[str] = None
