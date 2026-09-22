import pytest
from pydantic import BaseModel

from credibilis_intelligence.contrats import ContexteIA, RequeteIA, ReponseIA
from credibilis_intelligence.fournisseurs.factice import FournisseurFactice
from credibilis_intelligence.fournisseurs.deepseek import FournisseurDeepSeek
from credibilis_intelligence.fournisseurs.local import FournisseurLocal
from credibilis_intelligence.exceptions import FournisseurIndisponibleError, ValidationSortieError
from credibilis_intelligence.schemas.analyse import AnalyseQualitativeSchema


def test_fournisseur_factice_generation_et_structure():
    factice = FournisseurFactice()
    assert factice.disponible() is True

    ctx = ContexteIA(
        dossier_id="DOS-TEST-001",
        profil_emprunteur="COMMERCANT",
        donnees_economiques={"chiffre_affaires": 800000, "charges": 500000},
    )
    req = RequeteIA(
        tache="analyse_qualitative",
        contexte=ctx,
        prompt_systeme="Tu es un analyste",
        prompt_utilisateur="Analyse ce dossier",
    )

    resultat: AnalyseQualitativeSchema = factice.generer_structure(req, AnalyseQualitativeSchema)
    assert isinstance(resultat, AnalyseQualitativeSchema)
    assert len(resultat.elements_favorables) > 0
    assert len(resultat.points_vigilance) > 0
    assert "DOS-TEST-001" in resultat.synthese


def test_fournisseur_factice_erreur_validation():
    factice = FournisseurFactice()
    factice.reponse_forcee = "Ceci n'est pas du JSON valide du tout !"

    ctx = ContexteIA(
        dossier_id="DOS-TEST-ERR",
        profil_emprunteur="SALARIE",
        donnees_economiques={"salaire": 300000},
    )
    req = RequeteIA(
        tache="analyse_qualitative",
        contexte=ctx,
        prompt_systeme="sys",
        prompt_utilisateur="user",
    )

    with pytest.raises(ValidationSortieError):
        factice.generer_structure(req, AnalyseQualitativeSchema)


def test_fournisseur_deepseek_indisponible_sans_cle():
    deepseek = FournisseurDeepSeek(api_key=None)
    assert deepseek.disponible() is False

    ctx = ContexteIA(
        dossier_id="DOS-001",
        profil_emprunteur="PME",
        donnees_economiques={},
    )
    req = RequeteIA(
        tache="test",
        contexte=ctx,
        prompt_systeme="",
        prompt_utilisateur="",
    )

    with pytest.raises(FournisseurIndisponibleError) as exc_info:
        deepseek.generer(req)
    assert "Clé API DeepSeek non configurée" in str(exc_info.value)
