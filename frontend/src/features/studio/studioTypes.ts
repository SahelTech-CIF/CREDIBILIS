export type CategorieMetier =
  | "IDENTIFICATION"
  | "CONTACT"
  | "MENAGE"
  | "EMPLOI"
  | "ACTIVITE"
  | "FINANCIER"
  | "DETTE"
  | "PATRIMOINE"
  | "MARCHE"
  | "GARANTIE"
  | "HISTORIQUE"
  | "TRANSACTION"
  | "KYC_CONFORMITE"
  | "DOCUMENT"
  | "QUALITATIF"
  | "GEOGRAPHIQUE";

export type TypeDonnee =
  | "TEXTE"
  | "TEXTE_LONG"
  | "ENTIER"
  | "DECIMAL"
  | "MONTANT"
  | "POURCENTAGE"
  | "BOOLEEN"
  | "DATE"
  | "CHOIX_SIMPLE"
  | "CHOIX_MULTIPLE"
  | "TELEPHONE"
  | "EMAIL"
  | "DOCUMENT"
  | "TABLEAU_REPETABLE";

export type Temporalite =
  | "STATIQUE"
  | "VALEUR_ACTUELLE"
  | "PERIODE"
  | "EVENEMENT"
  | "SERIE_TEMPORELLE"
  | "PHOTOGRAPHIE_T0";

export type RoleAnalytique =
  | "IDENTIFICATION_SEULE"
  | "SEGMENTATION"
  | "VARIABLE_CANDIDATE"
  | "ENTREE_REGLE"
  | "PREUVE_SEULE"
  | "CONFORMITE_SEULE"
  | "RESULTAT_OBSERVE";

export type NiveauVerification =
  | "DECLARE"
  | "IMPORTE"
  | "OBSERVE"
  | "VERIFIE";

export type Sensibilite =
  | "NORMALE"
  | "PERSONNELLE"
  | "FINANCIERE"
  | "SENSIBLE";

export interface RegleAffichage {
  champ_source: string;
  operateur: "==" | "!=" | ">" | "<" | "in";
  valeur: string | number | boolean;
  action: "afficher" | "masquer" | "rendre_obligatoire";
}

export interface OptionChampItem {
  valeur: string;
  libelle: string;
}

export interface DefinitionChamp {
  id: string;
  code: string;
  libelle: string;
  section_id: string;
  type_donnee: TypeDonnee;
  categorie: CategorieMetier;
  temporalite: Temporalite;
  role_analytique: RoleAnalytique;
  niveau_verification: NiveauVerification;
  sensibilite: Sensibilite;
  obligatoire: boolean;
  actif: boolean;
  profils_applicables: string[]; // ["SALARIE", "AGRICULTEUR", etc.] ou ["TOUS"]
  produits_applicables?: string[];
  options?: (string | OptionChampItem)[]; // Pour CHOIX_SIMPLE / CHOIX_MULTIPLE
  regle_affichage?: RegleAffichage;
  placeholder?: string;
  description?: string;
  piece_justificative_attendue?: string;
  unite?: string;
  ordre?: number;
}

export interface SectionCollecte {
  id: string;
  code: string;
  titre: string;
  description?: string;
  ordre: number;
  profils_applicables: string[];
}

export interface ProfilConfig {
  code: string;
  libelle: string;
  description: string;
  icone: string;
  type_demandeur: "PHYSIQUE" | "MORALE";
  actif: boolean;
}

export interface ProduitConfig {
  code: string;
  libelle: string;
  profil_code: string;
  montant_min: number;
  montant_max: number;
  duree_min_mois: number;
  duree_max_mois: number;
  taux_annuel: number;
  description: string;
}

export interface ValeurDonneeSaisie {
  champ_code?: string;
  code?: string;
  valeur: any;
  source: string;
  niveau_verification: NiveauVerification;
  justificatif_nom?: string;
  note_agent?: string;
  note_verification?: string;
  horodatage?: string;
  date_collecte?: string;
}

export interface DossierCollecte {
  id: string;
  numero_dossier?: string;
  nom_emprunteur?: string;
  institution?: string;
  profil_code: string;
  produit_code: string;
  agent_nom?: string;
  date_creation: string;
  statut: "BROUILLON" | "VALIDE" | "EN_ANALYSE" | "EN_INSTRUCTION";
  donnees: Record<string, ValeurDonneeSaisie>;
}
