"""
Schémas structurés Pydantic pour l'analyse qualitative et les tâches d'intelligence.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ElementAnalyseQualitative(BaseModel):
    libelle: str
    impact: str = Field(description="FAVORABLE, DEFAVORABLE ou NEUTRE")
    justification: str


class AnalyseQualitativeSchema(BaseModel):
    """Sortie structurée obligatoire pour la tâche d'analyse qualitative."""
    elements_favorables: List[str] = Field(default_factory=list, description="Points forts du dossier")
    points_vigilance: List[str] = Field(default_factory=list, description="Risques ou faiblesses identifiés")
    contradictions: List[str] = Field(default_factory=list, description="Écarts entre déclarations et pièces")
    informations_manquantes: List[str] = Field(default_factory=list, description="Éléments à clarifier par l'agent")
    synthese: str = Field(description="Résumé qualitatif équilibré pour le comité")
    score_confiance_analyse: float = Field(ge=0.0, le=1.0, default=0.85, description="Indice de certitude")
