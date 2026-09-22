import pytest

from credibilis_intelligence.contrats import ContexteIA, ConfigurationIA, ModeExecutionIA
from credibilis_intelligence.routeur import RouteurIA
from credibilis_intelligence.taches.analyse_qualitative import executer_analyse_qualitative
from credibilis_intelligence.taches.contradictions import executer_detection_contradictions
from credibilis_intelligence.taches.synthese_dossier import (
    executer_synthese_dossier,
    executer_diagnostic_donnees_manquantes,
)
from credibilis_intelligence.schemas.analyse import AnalyseQualitativeSchema
from credibilis_intelligence.schemas.synthese import (
    RapportContradictionsSchema,
    SyntheseDossierSchema,
    DiagnosticDonneesManquantesSchema,
)


@pytest.fixture
def routeur_mock():
    return RouteurIA(ConfigurationIA(mode_par_defaut=ModeExecutionIA.MOCK))


def test_tache_analyse_qualitative(routeur_mock):
    ctx = ContexteIA(
        dossier_id="DOS-PME-401",
        profil_emprunteur="PME",
        donnees_economiques={
            "chiffre_affaires_annuel": 18000000,
            "charges_annuelles": 12000000,
            "dette_actuelle": 1500000,
        },
        donnees_qualitatives={"visite_sur_place": True, "tenue_registre": "Cahier de caisse tenu"},
        pieces_fournies=["RCCM", "Bilans 2024 et 2025"],
    )

    res = executer_analyse_qualitative(ctx, routeur=routeur_mock)
    assert isinstance(res, AnalyseQualitativeSchema)
    assert len(res.elements_favorables) > 0
    assert res.score_confiance_analyse > 0.5


def test_tache_detection_contradictions(routeur_mock):
    ctx = ContexteIA(
        dossier_id="DOS-AGRI-12",
        profil_emprunteur="AGRICULTEUR",
        donnees_economiques={"superficie": 4},
        contradictions_detectees=[
            {"champ": "superficie", "declare": 4, "constate": 2.5, "explication": "Parcelle morcelée"}
        ],
    )

    res = executer_detection_contradictions(ctx, routeur=routeur_mock)
    assert isinstance(res, RapportContradictionsSchema)
    assert res.nombre_contradictions >= 1
    assert len(res.recommandation_agent) > 0


def test_tache_synthese_dossier(routeur_mock):
    ctx = ContexteIA(
        dossier_id="DOS-SAL-88",
        profil_emprunteur="SALARIE",
        donnees_economiques={"salaire_net": 420000, "echeance": 95000},
    )

    res = executer_synthese_dossier(ctx, routeur=routeur_mock)
    assert isinstance(res, SyntheseDossierSchema)
    assert len(res.resume_activite) > 0
    assert len(res.questions_recommandees_comite) > 0


def test_tache_donnees_manquantes(routeur_mock):
    ctx = ContexteIA(
        dossier_id="DOS-MANQ-1",
        profil_emprunteur="COMMERCANT",
        donnees_economiques={"ca": 500000},
        pieces_fournies=["CNI"],
    )

    res = executer_diagnostic_donnees_manquantes(
        ctx,
        exigences_produit=["CNI", "Registre de ventes", "Caution"],
        routeur=routeur_mock,
    )
    assert isinstance(res, DiagnosticDonneesManquantesSchema)
