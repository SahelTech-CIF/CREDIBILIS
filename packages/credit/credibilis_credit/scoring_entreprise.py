"""
Package Métier Crédit CREDIBILIS — Grille d'Évaluation Institutionnelle Personne Morale / Entreprise.
Pure Python — Aucune dépendance Django.
"""
from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List
from enum import Enum

class RecommendationDecision(str, Enum):
    FAVORABLE = "FAVORABLE"         # Note >= 80
    A_EXAMINER = "A_EXAMINER"       # Note 70 - 79
    REJET_RECOMMANDE = "REJET_RECOMMANDE" # Note < 70 (seuil institutionnel éliminatoire)

@dataclass
class EvaluationEntreprise:
    """Section A : Note sur l'entreprise (Max: 30 pts)"""
    anciennete_entreprise: float = 0.0          # Max: 3
    degre_formalisation: float = 0.0            # Max: 3
    qualite_ressources_humaines: float = 0.0    # Max: 2
    rentabilite: float = 0.0                    # Max: 3
    progression_chiffre_affaires: float = 0.0   # Max: 3
    portefeuille_clientele: float = 0.0         # Max: 2
    solvabilite_clients: float = 0.0            # Max: 2
    tenue_documents_comptables: float = 0.0     # Max: 3
    qualite_emplacement: float = 0.0            # Max: 2
    qualite_equipements: float = 0.0            # Max: 2
    gestion_stocks: float = 0.0                 # Max: 2
    delais_reglement_clients: float = 0.0       # Max: 1.5
    delais_fournisseurs: float = 0.0            # Max: 1.5

    def total(self) -> float:
        return min(30.0, round(
            self.anciennete_entreprise + self.degre_formalisation + self.qualite_ressources_humaines +
            self.rentabilite + self.progression_chiffre_affaires + self.portefeuille_clientele +
            self.solvabilite_clients + self.tenue_documents_comptables + self.qualite_emplacement +
            self.qualite_equipements + self.gestion_stocks + self.delais_reglement_clients +
            self.delais_fournisseurs, 2
        ))

@dataclass
class EvaluationEmprunteur:
    """Section B : Note sur l'emprunteur / dirigeants (Max: 20 pts)"""
    moralite_emprunteur: float = 0.0            # Max: 5
    experience_professionnelle: float = 0.0     # Max: 4
    niveau_etude: float = 0.0                   # Max: 3
    motivation: float = 0.0                     # Max: 3
    succession_releve: float = 0.0              # Max: 2
    qualite_management: float = 0.0             # Max: 3

    def total(self) -> float:
        return min(20.0, round(
            self.moralite_emprunteur + self.experience_professionnelle + self.niveau_etude +
            self.motivation + self.succession_releve + self.qualite_management, 2
        ))

@dataclass
class EvaluationMarche:
    """Section C : Note sur le marché (Max: 15 pts)"""
    degre_stabilite_secteur: float = 0.0        # Max: 5
    diversification_produits: float = 0.0       # Max: 5
    part_de_marche: float = 0.0                 # Max: 5

    def total(self) -> float:
        return min(15.0, round(
            self.degre_stabilite_secteur + self.diversification_produits + self.part_de_marche, 2
        ))

@dataclass
class EvaluationHistorique:
    """Section D : Historique compte & antécédents de remboursement (Max: 15 pts)"""
    anciennete_relation: float = 0.0            # Max: 3
    antecedents_credits: float = 0.0            # Max: 4
    mouvement_depots_6_mois: float = 0.0        # Max: 3
    solde_moyen_depots: float = 0.0             # Max: 3
    regularite_compte_dav: float = 0.0          # Max: 2

    def total(self) -> float:
        return min(15.0, round(
            self.anciennete_relation + self.antecedents_credits + self.mouvement_depots_6_mois +
            self.solde_moyen_depots + self.regularite_compte_dav, 2
        ))

@dataclass
class EvaluationGarantie:
    """Section E : Garantie et caution (Max: 20 pts)"""
    couverture_garantie_materielle: float = 0.0 # Max: 8
    qualite_titre_propriete: float = 0.0        # Max: 5
    degre_formalisation_garantie: float = 0.0   # Max: 4
    caution_personne: float = 0.0               # Max: 3

    def total(self) -> float:
        return min(20.0, round(
            self.couverture_garantie_materielle + self.qualite_titre_propriete +
            self.degre_formalisation_garantie + self.caution_personne, 2
        ))

@dataclass
class ScoreEntrepriseResult:
    total_entreprise: float
    total_emprunteur: float
    total_marche: float
    total_historique: float
    total_garantie: float
    note_globale: float                     # sur 100
    recommendation: RecommendationDecision
    rejet_eliminatoire: bool                # True si note < 70
    motifs: List[str] = field(default_factory=list)

def calculer_score_dossier_entreprise(
    entreprise: EvaluationEntreprise,
    emprunteur: EvaluationEmprunteur,
    marche: EvaluationMarche,
    historique: EvaluationHistorique,
    garantie: EvaluationGarantie
) -> ScoreEntrepriseResult:
    tot_ent = entreprise.total()
    tot_emp = emprunteur.total()
    tot_mar = marche.total()
    tot_his = historique.total()
    tot_gar = garantie.total()

    note_globale = round(tot_ent + tot_emp + tot_mar + tot_his + tot_gar, 2)
    motifs = []

    if note_globale < 70.0:
        reco = RecommendationDecision.REJET_RECOMMANDE
        rejet_eliminatoire = True
        motifs.append(f"Note globale de {note_globale}/100 inférieure au seuil institutionnel d'admissibilité de 70 points.")
    elif note_globale < 80.0:
        reco = RecommendationDecision.A_EXAMINER
        rejet_eliminatoire = False
        motifs.append("Dossier intermédiaire nécessitant des garanties renforcées ou un avis d'agence motivé.")
    else:
        reco = RecommendationDecision.FAVORABLE
        rejet_eliminatoire = False
        motifs.append("Dossier financièrement et qualitativement robuste conforme aux critères d'octroi.")

    if tot_gar < 10.0:
        motifs.append("Couverture des garanties inférieure à 50% du barème requis.")
    if tot_ent < 15.0:
        motifs.append("Faiblesse constatée sur la formalisation ou la rentabilité de l'entreprise.")

    return ScoreEntrepriseResult(
        total_entreprise=tot_ent,
        total_emprunteur=tot_emp,
        total_marche=tot_mar,
        total_historique=tot_his,
        total_garantie=tot_gar,
        note_globale=note_globale,
        recommendation=reco,
        rejet_eliminatoire=rejet_eliminatoire,
        motifs=motifs
    )
