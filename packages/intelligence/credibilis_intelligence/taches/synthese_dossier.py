"""
Tâche de synthèse de dossier et diagnostic de complétude documentaire.
"""

import json
from typing import Optional

from credibilis_intelligence.contrats import ContexteIA, RequeteIA
from credibilis_intelligence.schemas.synthese import (
    SyntheseDossierSchema,
    DiagnosticDonneesManquantesSchema,
)
from credibilis_intelligence.prompts.registry import RegistrePrompts
from credibilis_intelligence.routeur import RouteurIA


def executer_synthese_dossier(
    contexte: ContexteIA,
    routeur: Optional[RouteurIA] = None,
    version_prompt: str = "v1",
) -> SyntheseDossierSchema:
    """
    Exécute la rédaction d'une note de synthèse pour le comité.
    """
    routeur_actif = routeur or RouteurIA()
    prompt_config = RegistrePrompts.obtenir("synthese_dossier", version_prompt)

    prompt_user = prompt_config["template_utilisateur"].format(
        dossier_id=contexte.dossier_id,
        profil_emprunteur=contexte.profil_emprunteur,
        donnees_economiques=json.dumps(contexte.donnees_economiques, ensure_ascii=False),
        qualite=contexte.donnees_qualitatives.get("score_qualite", "Non audité"),
    )

    requete = RequeteIA(
        tache="synthese_dossier",
        contexte=contexte,
        prompt_systeme=prompt_config["systeme"],
        prompt_utilisateur=prompt_user,
        version_prompt=version_prompt,
    )

    return routeur_actif.executer_structure(requete, SyntheseDossierSchema)


def executer_diagnostic_donnees_manquantes(
    contexte: ContexteIA,
    exigences_produit: Optional[list] = None,
    routeur: Optional[RouteurIA] = None,
    version_prompt: str = "v1",
) -> DiagnosticDonneesManquantesSchema:
    """
    Exécute le diagnostic des pièces et variables manquantes.
    """
    routeur_actif = routeur or RouteurIA()
    prompt_config = RegistrePrompts.obtenir("donnees_manquantes", version_prompt)

    prompt_user = prompt_config["template_utilisateur"].format(
        dossier_id=contexte.dossier_id,
        exigences=", ".join(exigences_produit or ["Pièce d'identité", "Justificatif d'activité"]),
        pieces_fournies=", ".join(contexte.pieces_fournies) or "Aucune",
    )

    requete = RequeteIA(
        tache="donnees_manquantes",
        contexte=contexte,
        prompt_systeme=prompt_config["systeme"],
        prompt_utilisateur=prompt_user,
        version_prompt=version_prompt,
    )

    return routeur_actif.executer_structure(requete, DiagnosticDonneesManquantesSchema)
