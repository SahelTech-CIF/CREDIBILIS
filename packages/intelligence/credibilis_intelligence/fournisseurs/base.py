"""
Interface et classe de base pour tout fournisseur LLM (DeepSeek, Local, Factice).
"""

from abc import ABC, abstractmethod
from typing import Type, TypeVar, Optional, Dict, Any
import json
import re
from pydantic import BaseModel, ValidationError

from credibilis_intelligence.contrats import RequeteIA, ReponseIA
from credibilis_intelligence.exceptions import ValidationSortieError, FournisseurIndisponibleError

T = TypeVar("T", bound=BaseModel)


class FournisseurIABase(ABC):
    """Contrat commun que tout moteur LLM doit obligatoirement implémenter."""

    def __init__(self, nom: str, modele_defaut: str):
        self.nom = nom
        self.modele_defaut = modele_defaut

    @abstractmethod
    def disponible(self) -> bool:
        """Vérifie si le fournisseur est actuellement opérationnel."""
        pass

    @abstractmethod
    def generer(self, requete: RequeteIA) -> ReponseIA:
        """Génère une réponse texte brute."""
        pass

    def generer_structure(self, requete: RequeteIA, schema_cls: Type[T]) -> T:
        """
        Exécute la requête et valide la réponse contre le schéma Pydantic fourni.
        Extrait le JSON même si entouré de balises Markdown ```json ... ```.
        """
        reponse = self.generer(requete)
        if reponse.statut != "SUCCES":
            raise FournisseurIndisponibleError(
                f"Le fournisseur '{self.nom}' a échoué : {reponse.erreur_detail}"
            )

        texte = reponse.contenu_texte.strip()

        # Extraction robuste du bloc JSON si entouré de ```json
        if "```json" in texte:
            bloc = texte.split("```json")[1].split("```")[0].strip()
        elif "```" in texte:
            bloc = texte.split("```")[1].split("```")[0].strip()
        else:
            # Recherche regex du premier bloc { ... }
            match = re.search(r"(\{.*\})", texte, re.DOTALL)
            bloc = match.group(1) if match else texte

        try:
            donnees_dict = json.loads(bloc)
            return schema_cls.model_validate(donnees_dict)
        except (json.JSONDecodeError, ValidationError) as e:
            raise ValidationSortieError(
                f"Échec de validation structurée ({schema_cls.__name__}) depuis la réponse de '{self.nom}' : {e}\nTexte reçu : {texte[:300]}..."
            ) from e
