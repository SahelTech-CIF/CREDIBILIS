"""
Fournisseur Cloud DeepSeek (compatible avec l'API OpenAI Chat Completions).
Utilise la bibliothèque standard Python (urllib.request) pour garantir l'indépendance de Django.
"""

import json
import time
import urllib.request
import urllib.error
from typing import Optional

from credibilis_intelligence.contrats import RequeteIA, ReponseIA
from credibilis_intelligence.exceptions import FournisseurIndisponibleError
from credibilis_intelligence.fournisseurs.base import FournisseurIABase


class FournisseurDeepSeek(FournisseurIABase):
    """
    Adaptateur pour l'API DeepSeek (chat/completions).
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        url_endpoint: str = "https://api.deepseek.com/v1/chat/completions",
        modele: str = "deepseek-chat",
        timeout: int = 30,
    ):
        super().__init__(nom="deepseek", modele_defaut=modele)
        self.api_key = api_key
        self.url_endpoint = url_endpoint
        self.timeout = timeout

    def disponible(self) -> bool:
        """Vérifie si la clé API est renseignée."""
        return bool(self.api_key and self.api_key.strip())

    def generer(self, requete: RequeteIA) -> ReponseIA:
        if not self.disponible():
            raise FournisseurIndisponibleError(
                "Clé API DeepSeek non configurée. Définissez DEEPSEEK_API_KEY ou basculez en mode 'mock' ou 'local'."
            )

        t_debut = time.time()

        payload = {
            "model": self.modele_defaut,
            "messages": [
                {"role": "system", "content": requete.prompt_systeme},
                {"role": "user", "content": requete.prompt_utilisateur},
            ],
            "temperature": requete.temperature,
            "max_tokens": requete.max_tokens,
            "response_format": {"type": "json_object"},
        }

        donnees = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            self.url_endpoint,
            data=donnees,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
                "User-Agent": "CREDIBILIS-Intelligence/1.0",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                resultat = json.loads(resp.read().decode("utf-8"))
                texte = resultat["choices"][0]["message"]["content"]
                usage = resultat.get("usage", {})
                duree_ms = int((time.time() - t_debut) * 1000)

                return ReponseIA(
                    fournisseur_nom=self.nom,
                    modele_nom=self.modele_defaut,
                    contenu_texte=texte,
                    tokens_entree=usage.get("prompt_tokens", 0),
                    tokens_sortie=usage.get("completion_tokens", 0),
                    duree_ms=duree_ms,
                    statut="SUCCES",
                )
        except urllib.error.HTTPError as e:
            msg_err = f"Erreur HTTP DeepSeek ({e.code}) : {e.reason}"
            try:
                corps = json.loads(e.read().decode("utf-8"))
                msg_err += f" - {corps.get('error', {}).get('message', '')}"
            except Exception:
                pass
            raise FournisseurIndisponibleError(msg_err) from e
        except Exception as e:
            raise FournisseurIndisponibleError(f"Échec de communication avec DeepSeek : {e}") from e
