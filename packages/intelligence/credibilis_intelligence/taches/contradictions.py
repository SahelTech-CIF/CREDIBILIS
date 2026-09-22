"""
Tâche de détection de contradictions entre déclarations et données vérifiées.
"""

import json
from typing import Optional

from credibilis_intelligence.contrats import ContexteIA, RequeteIA
from credibilis_intelligence.schemas.synthese import RapportContradictionsSchema
from credibilis_intelligence.prompts.registry import RegistrePrompts
from credibilis_intelligence.routeur import RouteurIA


def executer_detection_contradictions(
    contexte: ContexteIA,
    routeur: Optional[RouteurIA] = None,
    version_prompt: str = "v1",
) -> RapportContradictionsSchema:
    """
    Exécute la détection des contradictions déclaratives.
    """
    routeur_actif = routeur or RouteurIA()
    prompt_config = RegistrePrompts.obtenir("contradictions", version_prompt)

    prompt_user = prompt_config["template_utilisateur"].format(
        dossier_id=contexte.dossier_id,
        donnees_economiques=json.dumps(contexte.donnees_economiques, ensure_ascii=False, indent=2),
        comparatif=json.dumps(contexte.contradictions_detectees, ensure_ascii=False, indent=2),
    )

    requete = RequeteIA(
        tache="contradictions",
        contexte=contexte,
        prompt_systeme=prompt_config["systeme"],
        prompt_utilisateur=prompt_user,
        version_prompt=version_prompt,
    )

    return routeur_actif.executer_structure(requete, RapportContradictionsSchema)
