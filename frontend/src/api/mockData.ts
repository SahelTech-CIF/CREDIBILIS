import type { CreditDecisionResult, MatchCandidate, QualityMetrics, DataAnomaly } from "../types";

export interface DemoClientProfile {
  id: string;
  nom: string;
  description: string;
  type_profil: 'PARFAIT' | 'COLD_START' | 'SURENDETTE';
  revenu_mensuel: number;
  charges_mensuelles: number;
  montant_demande: number;
  duree_mois: number;
  historique_echeances: number;
  taux_remboursement_indiv: number | null;
  tontine: boolean;
  mobile_money_flux: number;
  result: CreditDecisionResult;
}

export const DEMO_CLIENTS: DemoClientProfile[] = [
  {
    id: "CLI-2026-0001",
    nom: "Amadou Diallo",
    description: "Commerçant établi au Grand Marché — Historique de crédit exemplaire",
    type_profil: "PARFAIT",
    revenu_mensuel: 750000,
    charges_mensuelles: 140000,
    montant_demande: 600000,
    duree_mois: 12,
    historique_echeances: 18,
    taux_remboursement_indiv: 0.96,
    tontine: true,
    mobile_money_flux: 450000,
    result: {
      id_client: "CLI-2026-0001",
      decision: "ACCORDÉ",
      score_credibilis: 88.4,
      poids_decision: {
        score_sur_100: 88.4,
        w_ind_pct: 60.0,
        w_local_pct: 32.0,
        w_reseau_pct: 8.0,
      },
      offre_alternative: null,
      taux_cohorte: 0.78,
      qualite_donnees: {
        taille_cohorte: 24,
        stabilite_cohorte: 0.84,
        historique_charge: true,
      },
      modeles_utilises: ["buhlmann_straub", "cohorte_gower", "lightgbm"],
      score_modele_lightgbm: 91.2,
    },
  },
  {
    id: "CLI-2026-0002",
    nom: "Aminata Cissé",
    description: "Jeune entrepreneure maraîchère — Primo-emprunteuse sans historique bancaire",
    type_profil: "COLD_START",
    revenu_mensuel: 380000,
    charges_mensuelles: 75000,
    montant_demande: 300000,
    duree_mois: 6,
    historique_echeances: 0,
    taux_remboursement_indiv: null,
    tontine: true,
    mobile_money_flux: 280000,
    result: {
      id_client: "CLI-2026-0002",
      decision: "ACCORDÉ",
      score_credibilis: 74.8,
      poids_decision: {
        score_sur_100: 74.8,
        w_ind_pct: 0.0,
        w_local_pct: 80.0,
        w_reseau_pct: 20.0,
      },
      offre_alternative: null,
      taux_cohorte: 0.76,
      qualite_donnees: {
        taille_cohorte: 30,
        stabilite_cohorte: 0.79,
        historique_charge: true,
      },
      modeles_utilises: ["cohorte_gower", "cold_start_cohort"],
    },
  },
  {
    id: "CLI-2026-0003",
    nom: "Bakary Traoré",
    description: "Artisan mécanicien — Demande disproportionnée par rapport aux charges",
    type_profil: "SURENDETTE",
    revenu_mensuel: 260000,
    charges_mensuelles: 170000,
    montant_demande: 900000,
    duree_mois: 6,
    historique_echeances: 4,
    taux_remboursement_indiv: 0.72,
    tontine: false,
    mobile_money_flux: 90000,
    result: {
      id_client: "CLI-2026-0003",
      decision: "SOUMIS À CONDITIONS",
      score_credibilis: 61.2,
      poids_decision: {
        score_sur_100: 61.2,
        w_ind_pct: 25.0,
        w_local_pct: 60.0,
        w_reseau_pct: 15.0,
      },
      offre_alternative: {
        montant_recommande: 380000,
        duree_recommandee_mois: 12,
        motif: "Rallongement et ajustement de montant recommandés : la mensualité initiale (150 000 FCFA) excédait 160% de la capacité nette disponible (90 000 FCFA).",
      },
      taux_cohorte: 0.69,
      qualite_donnees: {
        taille_cohorte: 18,
        stabilite_cohorte: 0.65,
        historique_charge: true,
      },
      modeles_utilises: ["buhlmann_straub", "cohorte_gower", "simulateur_responsable"],
    },
  },
];

export const MOCK_QUALITY_METRICS: QualityMetrics = {
  completeness: 0.94,
  validity: 0.97,
  uniqueness: 0.99,
  consistency: 0.92,
  traceability: 0.89,
  global_score: 94.6,
  records_count: 500,
  valid_count: 485,
  blocked_count: 3,
  anomalies_count: 15,
};

export const MOCK_ANOMALIES: DataAnomaly[] = [
  {
    code: "DUPLICATE_EXTERNAL_IDENTIFIER",
    severity: "BLOCKING",
    field: "COMPTE_MEMBRE",
    message: "Collision intra-lot : le compte 'CPT-KAFO-00482' apparaît aux lignes 42 et 108.",
    row_number: 108,
  },
  {
    code: "INVALID_LOAN_AMOUNT",
    severity: "BLOCKING",
    field: "application.montant",
    message: "Montant demandé égal à 0 FCFA.",
    row_number: 214,
  },
  {
    code: "EXPENSES_EXCEED_REVENUE",
    severity: "WARNING",
    field: "activity.charges_mensuelles",
    message: "Charges mensuelles (380 000 FCFA) supérieures au CA déclaré (300 000 FCFA).",
    row_number: 67,
  },
  {
    code: "HIGH_DEBT_BURDEN",
    severity: "WARNING",
    field: "application.duree_mois",
    message: "Mensualité théorique représentant plus de 80% de la capacité estimée.",
    row_number: 301,
  },
  {
    code: "MISSING_PHONE",
    severity: "INFO",
    field: "person.telephone",
    message: "Numéro de téléphone absent, rapprochement probabiliste dégradé.",
    row_number: 412,
  },
];

export const MOCK_MATCH_CANDIDATE: MatchCandidate = {
  match_id: "MAT-2026-0042",
  status: "PROBABLE",
  confidence: 0.964,
  incoming: {
    nom: "Fatou Traoré",
    telephone: "76 12 34 56",
    date_naissance: "12/05/1985",
    compte: "CPT-MOPTI-0091",
  },
  existing: {
    entity_id: "01920e8b-76b3-7a1a-a1b2-c3d4e5f60789",
    nom: "Fatou TRAORE",
    telephone: "76123456",
    date_naissance: "1985-05-12",
    compte: "KAFO-BKO-00124",
  },
  reasons: [
    "Concordance exacte du numéro de téléphone principal (+50%)",
    "Forte similarité patronymique normalisée sans accents (+30%)",
    "Date de naissance ISO identique (+20%)",
    "Garde-fou : Règle anti-homonymes validée (discriminants forts présents)",
  ],
};
