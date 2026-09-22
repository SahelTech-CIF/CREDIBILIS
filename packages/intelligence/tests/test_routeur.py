import pytest

from credibilis_intelligence.contrats import (
    ConfigurationIA,
    ContexteIA,
    RequeteIA,
    ModeExecutionIA,
    NiveauSensibiliteIA,
)
from credibilis_intelligence.routeur import RouteurIA
from credibilis_intelligence.exceptions import (
    PolitiqueConfidentialiteError,
    FournisseurIndisponibleError,
)
from credibilis_intelligence.schemas.analyse import AnalyseQualitativeSchema


def test_routeur_mode_mock():
    config = ConfigurationIA(mode_par_defaut=ModeExecutionIA.MOCK)
    routeur = RouteurIA(config)

    ctx = ContexteIA(
        dossier_id="DOS-ROUT-1",
        profil_emprunteur="AGRICULTEUR",
        donnees_economiques={"superficie": 5},
    )
    fournisseur = routeur.selectionner_fournisseur(ctx)
    assert fournisseur.nom == "factice"


def test_routeur_donnees_sensibles_interdiction_cloud():
    """
    Règle de sécurité bancaire : si les données sont sensibles et que le cloud n'est pas autorisé,
    interdiction de faire un fallback cloud si le local est hors-service.
    """
    config = ConfigurationIA(
        mode_par_defaut=ModeExecutionIA.CLOUD,
        autoriser_donnees_sensibles_cloud=False,
    )
    routeur = RouteurIA(config)

    # Forcer l'indisponibilité du local
    routeur.fournisseurs["local"].url_endpoint = "http://endpoint-invalide-9999.test"

    ctx_sensible = ContexteIA(
        dossier_id="DOS-SENSIBLE-01",
        profil_emprunteur="PERSONNE_MORALE",
        donnees_economiques={"ca": 50000000},
        niveau_sensibilite=NiveauSensibiliteIA.SENSIBLE,
    )

    with pytest.raises(PolitiqueConfidentialiteError) as exc_info:
        routeur.selectionner_fournisseur(ctx_sensible)
    assert "Abstention IA par mesure de sécurité bancaire" in str(exc_info.value)


def test_routeur_journalisation():
    routeur = RouteurIA(ConfigurationIA(mode_par_defaut=ModeExecutionIA.MOCK))

    ctx = ContexteIA(
        dossier_id="DOS-JOURNAL-01",
        profil_emprunteur="SALARIE",
        donnees_economiques={"salaire_net": 350000},
    )
    req = RequeteIA(
        tache="analyse_qualitative",
        contexte=ctx,
        prompt_systeme="sys",
        prompt_utilisateur="user",
        version_prompt="v1",
    )

    res = routeur.executer_structure(req, AnalyseQualitativeSchema)
    assert isinstance(res, AnalyseQualitativeSchema)
    assert len(routeur.journal) == 1

    audit = routeur.journal[0]
    assert audit.dossier_id == "DOS-JOURNAL-01"
    assert audit.tache == "analyse_qualitative"
    assert audit.succes is True
    assert audit.reponse_structuree is not None
