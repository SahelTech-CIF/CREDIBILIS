import pytest
from datetime import datetime
from credibilis_credit.classification import (
    CategorieDonnee,
    RoleAnalytique,
    ProfilEmprunteur,
    TypeTemporel,
    DefinitionProduitCredit,
)
from credibilis_credit.cadre_analyse import (
    CritereAnalyse,
    RubriqueNotation,
    RegleNotation,
    CadreAnalyse,
    VariableDerivee,
    PhotographieT0,
)

def test_cadre_analyse_calcul_note_et_rejet():
    crit1 = CritereAnalyse("C1", "Formalisation", 2.0, 3.0)
    crit2 = CritereAnalyse("C2", "Rentabilité", 2.5, 3.0)
    rub_ent = RubriqueNotation("ENT", "Entreprise", [crit1, crit2], 30.0)

    crit3 = CritereAnalyse("C3", "Garantie matérielle", 5.0, 8.0)
    rub_gar = RubriqueNotation("GAR", "Garantie", [crit3], 20.0)

    regle = RegleNotation("REGLE_PME", "Barème PME Kafo", [rub_ent, rub_gar], 70.0, 80.0)

    cadre = CadreAnalyse(
        dossier_id="DOS-2026-001",
        date_instruction=datetime.now(),
        rubriques=[rub_ent, rub_gar],
        variables_financieres=[],
        regle_notation=regle,
    )

    # Note = 2.0 + 2.5 + 5.0 = 9.5 (< 70) -> Rejet éliminatoire
    assert cadre.note_globale() == 9.5
    assert cadre.est_rejet_recommande() is True
    assert cadre.avis_recommande() == "REJET_RECOMMANDE"

def test_variable_derivee_et_photographie_t0():
    var_couv = VariableDerivee(
        code="RATIO_COUVERTURE",
        libelle="Ratio Couverture Dette",
        valeur=240.0,
        unite="%",
        formule_descriptive="Résultat net / Échéance",
        est_conforme_norme=True,
    )
    assert var_couv.est_conforme_norme is True
    assert var_couv.valeur == 240.0

    photo = PhotographieT0(
        dossier_id="DOS-2026-001",
        horodatage_decision=datetime(2026, 9, 22, 16, 0, 0),
        institution_code="KAFO_JIGINEW",
        agent_responsable="Moussa Traoré",
        donnees_declarees={"ca_annuel": 85000000},
        variables_derivees={"ratio_couverture": 240.0},
        note_globale=85.0,
        decision_statistique="FAVORABLE",
        motifs_decision=["Ratio couverture supérieur à 200%"],
    )
    assert photo.dossier_id == "DOS-2026-001"
    assert photo.note_globale == 85.0
