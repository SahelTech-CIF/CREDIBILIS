"""
Routeur d'intelligence et politique d'aiguillage des requêtes LLM.
Garantit qu'aucune donnée sensible ne fuit vers le cloud sans autorisation expresse.
"""

from typing import Optional, Dict, Any, Type, TypeVar
import time
from datetime import datetime, timezone
import uuid
from pydantic import BaseModel

from credibilis_intelligence.contrats import (
    ConfigurationIA,
    ContexteIA,
    RequeteIA,
    ReponseIA,
    ModeExecutionIA,
    NiveauSensibiliteIA,
    ExecutionIAJournal,
)
from credibilis_intelligence.fournisseurs.base import FournisseurIABase
from credibilis_intelligence.fournisseurs.factice import FournisseurFactice
from credibilis_intelligence.fournisseurs.deepseek import FournisseurDeepSeek
from credibilis_intelligence.fournisseurs.local import FournisseurLocal
from credibilis_intelligence.exceptions import (
    FournisseurIndisponibleError,
    PolitiqueConfidentialiteError,
)

T = TypeVar("T", bound=BaseModel)


class RouteurIA:
    """
    Routeur central d'intelligence responsable de l'aiguillage,
    de l'application des règles de confidentialité et de l'audit.
    """

    def __init__(self, config: Optional[ConfigurationIA] = None):
        self.config = config or ConfigurationIA()

        # Instanciation des fournisseurs enregistrés
        self.fournisseurs: Dict[str, FournisseurIABase] = {
            "factice": FournisseurFactice(),
            "deepseek": FournisseurDeepSeek(
                api_key=self.config.api_key_cloud,
                url_endpoint=self.config.url_cloud,
                modele=self.config.modele_cloud_nom,
                timeout=self.config.timeout_secondes,
            ),
            "local": FournisseurLocal(
                url_endpoint=self.config.url_modele_local,
                modele=self.config.modele_local_nom,
                timeout=self.config.timeout_secondes,
            ),
        }

        # Journal en mémoire des exécutions (pour tests et audit)
        self.journal: list[ExecutionIAJournal] = []

    def selectionner_fournisseur(self, contexte: ContexteIA) -> FournisseurIABase:
        """
        Détermine le fournisseur approprié selon le mode configuré,
        l'institution et le niveau de sensibilité des données.
        """
        mode = self.config.mode_par_defaut

        # Règle 1 : Mode Mock (développement / tests / budget protégé)
        if mode == ModeExecutionIA.MOCK:
            return self.fournisseurs["factice"]

        # Règle 2 : Données sensibles ou institution avec politique on-premise stricte
        est_sensible = contexte.niveau_sensibilite in [
            NiveauSensibiliteIA.SENSIBLE,
            NiveauSensibiliteIA.HAUTEMENT_SENSIBLE,
        ]

        if est_sensible and not self.config.autoriser_donnees_sensibles_cloud:
            fournisseur_local = self.fournisseurs["local"]
            if fournisseur_local.disponible():
                return fournisseur_local

            # GARDE-FOU MAJEUR : Si local indisponible et cloud interdit,
            # INTERDICTION FORMELLE DE FALLBACK CLOUD -> Abstention IA sécurisée !
            raise PolitiqueConfidentialiteError(
                f"Données sensibles pour le dossier '{contexte.dossier_id}'. "
                "Le modèle local est indisponible et la transmission vers le Cloud est interdite. "
                "Abstention IA par mesure de sécurité bancaire."
            )

        # Règle 3 : Mode Local explicite
        if mode == ModeExecutionIA.LOCAL:
            fournisseur_local = self.fournisseurs["local"]
            if fournisseur_local.disponible():
                return fournisseur_local
            raise FournisseurIndisponibleError(
                f"Modèle local '{self.config.modele_local_nom}' indisponible sur {self.config.url_modele_local}."
            )

        # Règle 4 : Mode Cloud (DeepSeek) avec fallback contrôlé
        if mode in [ModeExecutionIA.CLOUD, ModeExecutionIA.HYBRIDE]:
            fournisseur_cloud = self.fournisseurs["deepseek"]
            if fournisseur_cloud.disponible():
                return fournisseur_cloud

            # Fallback vers local si disponible
            fournisseur_local = self.fournisseurs["local"]
            if fournisseur_local.disponible():
                return fournisseur_local

            # Dernier fallback vers factice si permis
            return self.fournisseurs["factice"]

        return self.fournisseurs["factice"]

    def executer_structure(
        self,
        requete: RequeteIA,
        schema_cls: Type[T],
    ) -> T:
        """
        Achemine la requête vers le bon fournisseur, valide la réponse
        avec le schéma Pydantic et enregistre l'audit.
        """
        t_debut = time.time()
        fournisseur = self.selectionner_fournisseur(requete.contexte)
        empreinte = requete.contexte.calculer_empreinte_sha256()
        execution_id = f"exec_{uuid.uuid4().hex[:12]}"

        try:
            resultat = fournisseur.generer_structure(requete, schema_cls)
            duree_ms = int((time.time() - t_debut) * 1000)

            journal_entry = ExecutionIAJournal(
                id=execution_id,
                dossier_id=requete.contexte.dossier_id,
                tache=requete.tache,
                fournisseur=fournisseur.nom,
                modele=fournisseur.modele_defaut,
                version_prompt=requete.version_prompt,
                empreinte_entree=empreinte,
                duree_ms=duree_ms,
                horodatage=datetime.now(timezone.utc).isoformat(),
                succes=True,
                reponse_structuree=resultat.model_dump(),
                erreur=None,
            )
            self.journal.append(journal_entry)
            return resultat

        except Exception as e:
            duree_ms = int((time.time() - t_debut) * 1000)
            journal_entry = ExecutionIAJournal(
                id=execution_id,
                dossier_id=requete.contexte.dossier_id,
                tache=requete.tache,
                fournisseur=fournisseur.nom,
                modele=fournisseur.modele_defaut,
                version_prompt=requete.version_prompt,
                empreinte_entree=empreinte,
                duree_ms=duree_ms,
                horodatage=datetime.now(timezone.utc).isoformat(),
                succes=False,
                reponse_structuree=None,
                erreur=str(e),
            )
            self.journal.append(journal_entry)
            raise
