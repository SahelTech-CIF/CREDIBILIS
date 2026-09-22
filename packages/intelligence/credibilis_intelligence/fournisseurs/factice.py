"""
Fournisseur factice (Mock) déterministe pour les tests, le développement local et la démo sans API externe.
"""

import json
import time
from typing import Dict, Any, Optional

from credibilis_intelligence.contrats import RequeteIA, ReponseIA
from credibilis_intelligence.fournisseurs.base import FournisseurIABase


class FournisseurFactice(FournisseurIABase):
    """
    Fournisseur de test local ne consommant aucun crédit et ne nécessitant aucun accès réseau.
    Retourne des structures JSON valides adaptées au profil et à la tâche demandée.
    """

    def __init__(self, nom: str = "factice", modele_defaut: str = "mock-sahel-v1"):
        super().__init__(nom=nom, modele_defaut=modele_defaut)
        self.est_disponible: bool = True
        self.reponse_forcee: Optional[str] = None

    def disponible(self) -> bool:
        return self.est_disponible

    def generer(self, requete: RequeteIA) -> ReponseIA:
        t_debut = time.time()

        if self.reponse_forcee:
            texte = self.reponse_forcee
        else:
            tache = requete.tache
            ctx = requete.contexte

            if "analyse_qualitative" in tache:
                payload = {
                    "elements_favorables": [
                        f"Activité de type {ctx.profil_emprunteur} constatée sur le terrain avec flux réguliers",
                        "Domiciliation bancaire partielle et antécédents tontiniers favorables",
                        "Présence d'une caution solidaire locale",
                    ],
                    "points_vigilance": [
                        "Sensibilité aux variations saisonnières et au coût des intrants",
                        "Charges d'exploitation élevées par rapport au fonds de roulement",
                    ],
                    "contradictions": [
                        c.get("explication", str(c)) for c in ctx.contradictions_detectees
                    ] if ctx.contradictions_detectees else [],
                    "informations_manquantes": [
                        "Dernier relevé de compte certifié de la caisse locale",
                    ],
                    "synthese": (
                        f"Dossier {ctx.dossier_id} ({ctx.profil_emprunteur}) présentant un modèle économique viable "
                        f"auprès de l'agence {ctx.institution}. La capacité d'autofinancement couvre l'échéance sous réserve "
                        f"du respect du plan d'approvisionnement."
                    ),
                    "score_confiance_analyse": 0.88,
                }
                texte = json.dumps(payload, ensure_ascii=False, indent=2)

            elif "contradictions" in tache:
                payload = {
                    "nombre_contradictions": 1 if ctx.contradictions_detectees else 0,
                    "contradictions": [
                        {
                            "champ": "chiffre_affaires_mensuel",
                            "valeur_declaree": 750000,
                            "valeur_verifiee": 600000,
                            "niveau_gravite": "IMPORTANT",
                            "explication": "Écart de 150 000 FCFA constaté entre le cahier de caisse et la déclaration agent.",
                        }
                    ] if ctx.contradictions_detectees else [],
                    "recommandation_agent": "Demander les reçus de vente des deux dernières semaines pour réconciliation.",
                }
                texte = json.dumps(payload, ensure_ascii=False, indent=2)

            elif "synthese_dossier" in tache:
                payload = {
                    "resume_activite": f"Exploitation commerciale/agricole de profil {ctx.profil_emprunteur} active depuis plus de 36 mois.",
                    "stabilite_financiere": "Excédent brut d'exploitation positif avec marge nette estimée à 18%.",
                    "evaluation_garanties": "Garantie matérielle et caution solidaire enregistrées conformément aux normes.",
                    "synthese_comite": f"Avis technique favorable pour mise en délibération du dossier {ctx.dossier_id}.",
                    "questions_recommandees_comite": [
                        "Quel est le calendrier prévisionnel d'écoulement des stocks ?",
                        "Le compte tontine peut-il être adossé en nantissement complémentaire ?",
                    ],
                }
                texte = json.dumps(payload, ensure_ascii=False, indent=2)

            else:
                # Réponse par défaut
                payload = {
                    "pieces_manquantes_obligatoires": [],
                    "variables_a_clarifier": [],
                    "dossier_complet_pour_comite": True,
                    "motif_incomplet": None,
                }
                texte = json.dumps(payload, ensure_ascii=False, indent=2)

        duree_ms = int((time.time() - t_debut) * 1000)

        return ReponseIA(
            fournisseur_nom=self.nom,
            modele_nom=self.modele_defaut,
            contenu_texte=texte,
            tokens_entree=120,
            tokens_sortie=250,
            duree_ms=duree_ms,
            statut="SUCCES",
        )
