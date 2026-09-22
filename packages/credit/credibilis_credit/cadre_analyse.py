"""
Cadre d'Analyse et Règles de Notation en Français Intégral — CREDIBILIS
Pure Python — Aucune dépendance externe ni Django.
"""
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Callable
from datetime import datetime
from .classification import CategorieDonnee, RoleAnalytique, TypeTemporel

@dataclass
class VariableDerivee:
    """Variable financière ou prudentielle calculée automatiquement"""
    code: str
    libelle: str
    valeur: float
    unite: str
    formule_descriptive: str
    est_conforme_norme: bool = True
    motif_non_conformite: Optional[str] = None

@dataclass
class CritereAnalyse:
    """Critère unitaire d'analyse au sein d'une rubrique"""
    code: str
    libelle: str
    points_obtenus: float
    points_maximum: float
    commentaire: str = ""

@dataclass
class RubriqueNotation:
    """Rubrique groupant plusieurs critères avec un barème spécifique"""
    code: str
    libelle: str
    criteres: List[CritereAnalyse]
    points_maximum: float

    def total(self) -> float:
        return min(self.points_maximum, round(sum(c.points_obtenus for c in self.criteres), 2))

@dataclass
class RegleNotation:
    """Barème de notation officiel pour un produit ou profil"""
    code: str
    libelle: str
    rubriques: List[RubriqueNotation]
    seuil_eliminatoire: float = 70.0  # Seuil Kafo Jiginew (< 70 = rejet)
    seuil_favorable: float = 80.0     # >= 80 = favorable

@dataclass
class PhotographieT0:
    """Photographie immuable du dossier à la date de décision (Snapshot T0)"""
    dossier_id: str
    horodatage_decision: datetime
    institution_code: str
    agent_responsable: str
    donnees_declarees: Dict[str, Any]
    variables_derivees: Dict[str, float]
    note_globale: float
    decision_statistique: str
    motifs_decision: List[str]
    empreinte_signature: str = ""

@dataclass
class CadreAnalyse:
    """Cadre complet d'instruction d'un dossier de crédit"""
    dossier_id: str
    date_instruction: datetime
    rubriques: List[RubriqueNotation]
    variables_financieres: List[VariableDerivee]
    regle_notation: RegleNotation

    def note_globale(self) -> float:
        return round(sum(r.total() for r in self.rubriques), 2)

    def est_rejet_recommande(self) -> bool:
        return self.note_globale() < self.regle_notation.seuil_eliminatoire

    def avis_recommande(self) -> str:
        note = self.note_globale()
        if note < self.regle_notation.seuil_eliminatoire:
            return "REJET_RECOMMANDE"
        if note < self.regle_notation.seuil_favorable:
            return "A_EXAMINER"
        return "FAVORABLE"
