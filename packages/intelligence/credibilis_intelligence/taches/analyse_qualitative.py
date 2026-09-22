"""
Tâche d'analyse qualitative d'un dossier de crédit.
"""

import json
from typing import Optional

from credibilis_intelligence.contrats import ContexteIA, RequeteIA
from credibilis_intelligence.schemas.analyse import AnalyseQualitativeSchema
from credibilis_intelligence.prompts.registry import RegistrePrompts
from credibilis_intelligence.routeur import RouteurIA


def executer_analyse_qualitative(
    contexte: ContexteIA,
    routeur: Optional[RouteurIA] = None,
    version_prompt: str = "v1",
) -> AnalyseQualitativeSchema:
    """
    Exécute l'analyse qualitative sur un dossier donné et retourne un schéma validé.
    """
    routeur_actif = routeur or RouteurIA()
    prompt_config = RegistrePrompts.obtenir("analyse_qualitative", version_prompt)

    prompt_user = prompt_config["template_utilisateur"].format(
        profil_emprunteur=contexte.profil_emprunteur,
        institution=contexte.institution,
        donnees_economiques=json.dumps(contexte.donnees_economiques, ensure_ascii=False, indent=2),
        donnees_qualitatives=json.dumps(contexte.donnees_qualitatives, ensure_ascii=False, indent=2),
        contradictions=json.dumps(contexte.contradictions_detectees, ensure_ascii=False, indent=2),
        pieces_fournies=", ".join(contexte.pieces_fournies) or "Aucune",
    )

    requete = RequeteIA(
        tache="analyse_qualitative",
        contexte=contexte,
        prompt_systeme=prompt_config["systeme"],
        prompt_utilisateur=prompt_user,
        version_prompt=version_prompt,
    )

    return routeur_actif.executer_structure(requete, AnalyseQualitativeSchema)
