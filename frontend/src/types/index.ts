export type DecisionStatus = 'ACCORDÉ' | 'SOUMIS À CONDITIONS' | 'REFUSÉ' | 'ABSTENTION' | 'ERREUR_SYSTEME';

export interface DecisionWeights {
  score_sur_100: number;
  w_ind_pct: number;
  w_local_pct: number;
  w_reseau_pct: number;
  facteur_memoire?: number;
}

export interface AlternativeOffer {
  montant_recommande: number;
  duree_recommandee_mois: number;
  motif: string;
}

export interface CreditDecisionResult {
  id_client: string;
  decision: DecisionStatus;
  score_credibilis: number;
  poids_decision: DecisionWeights;
  offre_alternative: AlternativeOffer | null;
  taux_cohorte?: number;
  qualite_donnees?: {
    taille_cohorte: number;
    stabilite_cohorte: number;
    historique_charge: boolean;
  };
  modeles_utilises?: string[];
  score_modele_lightgbm?: number;
}

export interface QualityMetrics {
  completeness: number;
  validity: number;
  uniqueness: number;
  consistency: number;
  traceability: number;
  global_score: number;
  records_count: number;
  valid_count: number;
  blocked_count: number;
  anomalies_count: number;
}

export interface DataAnomaly {
  code: string;
  severity: 'BLOCKING' | 'ERROR' | 'WARNING' | 'INFO';
  field: string;
  message: string;
  row_number?: number;
}

export interface MatchCandidate {
  match_id: string;
  status: 'EXACT' | 'PROBABLE' | 'AMBIGU' | 'AUCUN';
  confidence: number;
  incoming: {
    nom: string;
    telephone: string;
    date_naissance?: string;
    compte?: string;
  };
  existing: {
    entity_id: string;
    nom: string;
    telephone: string;
    date_naissance?: string;
    compte?: string;
  };
  reasons: string[];
}
