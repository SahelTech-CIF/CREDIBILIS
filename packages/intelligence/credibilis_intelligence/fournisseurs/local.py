"""
Fournisseur Local (compatible Ollama, vLLM, llama.cpp server).
Permet l'exécution sans fuite de données vers le cloud pour les institutions sensibles.
"""

import json
import time
import urllib.request
import urllib.error

from credibilis_intelligence.contrats import RequeteIA, ReponseIA
from credibilis_intelligence.exceptions import FournisseurIndisponibleError
from credibilis_intelligence.fournisseurs.base import FournisseurIABase


class FournisseurLocal(FournisseurIABase):
    """
    Adaptateur pour modèle LLM hébergé localement (ex: Ollama ou vLLM).
    """

    def __init__(
        self,
        url_endpoint: str = "http://localhost:11434/api/generate",
        modele: str = "llama3.2:3b",
        timeout: int = 45,
    ):
        super().__init__(nom="local", modele_defaut=modele)
        self.url_endpoint = url_endpoint
        self.timeout = timeout

    def disponible(self) -> bool:
        """Tente un ping léger sur l'endpoint local."""
        try:
            # Vérification simple de connectivité
            req = urllib.request.Request(self.url_endpoint, method="HEAD")
            with urllib.request.urlopen(req, timeout=2):
                return True
        except Exception:
            return False

    def generer(self, requete: RequeteIA) -> ReponseIA:
        t_debut = time.time()

        # Format compatible Ollama generate API
        prompt_combine = f"{requete.prompt_systeme}\n\n{requete.prompt_utilisateur}\nRéponds obligatoirement en format JSON strict :"
        payload = {
            "model": self.modele_defaut,
            "prompt": prompt_combine,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": requete.temperature,
                "num_predict": requete.max_tokens,
            },
        }

        donnees = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            self.url_endpoint,
            data=donnees,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                resultat = json.loads(resp.read().decode("utf-8"))
                texte = resultat.get("response", "")
                duree_ms = int((time.time() - t_debut) * 1000)

                return ReponseIA(
                    fournisseur_nom=self.nom,
                    modele_nom=self.modele_defaut,
                    contenu_texte=texte,
                    tokens_entree=resultat.get("prompt_eval_count", 0),
                    tokens_sortie=resultat.get("eval_count", 0),
                    duree_ms=duree_ms,
                    statut="SUCCES",
                )
        except Exception as e:
            raise FournisseurIndisponibleError(
                f"Serveur LLM local ({self.url_endpoint}) indisponible : {e}"
            ) from e
