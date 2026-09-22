import pytest
from credibilis_credit.scoring_entreprise import (
    EvaluationEntreprise,
    EvaluationEmprunteur,
    EvaluationMarche,
    EvaluationHistorique,
    EvaluationGarantie,
    RecommendationDecision,
    calculer_score_dossier_entreprise
)

def test_calcul_score_rejet_strict_inferieur_70():
    ent = EvaluationEntreprise(anciennete_entreprise=1.0, degre_formalisation=1.0, rentabilite=1.0)
    emp = EvaluationEmprunteur(moralite_emprunteur=2.0)
    mar = EvaluationMarche(degre_stabilite_secteur=2.0)
    his = EvaluationHistorique(anciennete_relation=1.0)
    gar = EvaluationGarantie(couverture_garantie_materielle=3.0)

    result = calculer_score_dossier_entreprise(ent, emp, mar, his, gar)
    assert result.note_globale < 70.0
    assert result.recommendation == RecommendationDecision.REJET_RECOMMANDE
    assert result.rejet_eliminatoire is True

def test_calcul_score_favorable_superieur_80():
    ent = EvaluationEntreprise(
        anciennete_entreprise=3.0, degre_formalisation=3.0, qualite_ressources_humaines=2.0,
        rentabilite=3.0, progression_chiffre_affaires=3.0, portefeuille_clientele=2.0,
        solvabilite_clients=2.0, tenue_documents_comptables=3.0, qualite_emplacement=2.0,
        qualite_equipements=2.0, gestion_stocks=2.0, delais_reglement_clients=1.5, delais_fournisseurs=1.5
    ) # 30 pts
    emp = EvaluationEmprunteur(
        moralite_emprunteur=5.0, experience_professionnelle=4.0, niveau_etude=3.0,
        motivation=3.0, succession_releve=2.0, qualite_management=3.0
    ) # 20 pts
    mar = EvaluationMarche(
        degre_stabilite_secteur=5.0, diversification_produits=4.0, part_de_marche=4.0
    ) # 13 pts
    his = EvaluationHistorique(
        anciennete_relation=3.0, antecedents_credits=4.0, mouvement_depots_6_mois=3.0,
        solde_moyen_depots=3.0, regularite_compte_dav=2.0
    ) # 15 pts
    gar = EvaluationGarantie(
        couverture_garantie_materielle=7.0, qualite_titre_propriete=4.0,
        degre_formalisation_garantie=4.0, caution_personne=3.0
    ) # 18 pts

    result = calculer_score_dossier_entreprise(ent, emp, mar, his, gar)
    assert result.note_globale >= 80.0
    assert result.recommendation == RecommendationDecision.FAVORABLE
    assert result.rejet_eliminatoire is False
