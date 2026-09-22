import React, { useState, useMemo } from "react";
import {
  Building2,
  Paperclip,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  AlertTriangle,
  FileCheck,
  Save,
  Send
} from "lucide-react";

interface Signataire {
  id: string;
  prenoms_nom: string;
  nationalite: string;
  date_naissance: string;
  lieu_naissance: string;
  fonction: string;
  type_piece: string;
  numero_piece: string;
  adresse: string;
  telephone: string;
  est_mandataire: boolean;
}

interface PieceDossier {
  id: string;
  label: string;
  statut: "fourni" | "manquant" | "a_verifier";
  nom_fichier?: string;
}

export const WizardCollecteEntreprise: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 9;

  // Étape 1 : Informations Générales
  const [dossierGeneral, setDossierGeneral] = useState({
    caisse: "KAFO JIGINEW — Direction Régionale Mopti",
    guichet: "Guichet Central Marché de Médine",
    numero_compte: "KJ-2026-ENT-0492",
    type_dossier: "demande_credit",
    date_dossier: new Date().toISOString().split("T")[0],
    agent_responsable: "Moussa Traoré (Agent Entreprise Senior)",
    montant_demande: "15000000",
    duree_mois: "24",
  });

  // Étape 2 : Société / Personne Morale
  const [societe, setSociete] = useState({
    raison_sociale: "Société Sahélienne de Distribution (SODIS-MALI SARL)",
    forme_juridique: "SARL",
    rccm: "MA.BKO.2019.B.14820",
    nif: "085123904E",
    inps: "INPS-ML-49201",
    recepisse: "REC-2019-902",
    adresse_siege: "Zone Industrielle de Sévaré, Rue 104, Porte 12",
    telephone: "+223 76 54 32 10",
    email: "contact@sodis-mali.com",
    activite_principale: "Commerce de gros de céréales, intrants agricoles et stockage",
    chiffre_affaires_annuel: "85000000",
  });

  // Étape 3 : Signataires dynamiques
  const [signataires, setSignataires] = useState<Signataire[]>([
    {
      id: "sig-1",
      prenoms_nom: "Bakary Coulibaly",
      nationalite: "Malienne",
      date_naissance: "1980-06-14",
      lieu_naissance: "Ségou",
      fonction: "Gérant Associé Unique",
      type_piece: "CNI Biométrique",
      numero_piece: "ML-NINA-1980061400231",
      adresse: "Quartier Millionkin, Mopti",
      telephone: "+223 76 54 32 10",
      est_mandataire: true,
    },
  ]);

  const addSignataire = () => {
    const newSig: Signataire = {
      id: `sig-${Date.now()}`,
      prenoms_nom: "",
      nationalite: "Malienne",
      date_naissance: "",
      lieu_naissance: "",
      fonction: "Co-gérant / Directeur Commercial",
      type_piece: "CNI Biométrique",
      numero_piece: "",
      adresse: "",
      telephone: "",
      est_mandataire: false,
    };
    setSignataires((prev: Signataire[]) => [...prev, newSig]);
  };

  const removeSignataire = (id: string) => {
    if (signataires.length > 1) {
      setSignataires((prev: Signataire[]) => prev.filter((s: Signataire) => s.id !== id));
    }
  };

  const updateSignataire = (id: string, field: keyof Signataire, value: string | boolean) => {
    setSignataires((prev: Signataire[]) =>
      prev.map((s: Signataire) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Étape 4 : Bénéficiaires Effectifs
  const [beneficiaire, setBeneficiaire] = useState({
    has_beneficiaire_25: true,
    prenoms_nom: "Bakary Coulibaly",
    nationalite: "Malienne",
    date_naissance: "1980-06-14",
    lieu_naissance: "Ségou",
    lien_societe: "Détenteur de 85% des parts sociales",
    controle_indirect: "Détient le pouvoir de signature unique et la gestion financière",
    justification_si_non: "",
  });

  // Étape 5 : Origine des fonds
  const [origineFonds, setOrigineFonds] = useState({
    origine_apport_initial: "Épargne personnelle de l'exploitant et cession d'actifs agricoles",
    nature_operations_prevues: "Règlement des approvisionnements en gros de céréales et encaissement des grossistes",
    objectif_relation: "Financement du besoin en fonds de roulement campagne agricole 2026",
    commentaire_agent: "Activité connue et visible sur le marché central depuis plus de 6 ans.",
  });

  // Étape 6 : Risque / Conformité
  const [conformite, setConformite] = useState({
    profil_risque: "faible",
    dirigeants_ppe: false,
    beneficiaires_ppe: false,
    commentaire_risque: "Aucun lien avec des Personnes Politiquement Exposées. Pas d'alerte blanchiment.",
    decision_preliminaire: "conforme",
  });

  // Étape 7 : Pièces fournies
  const [pieces, setPieces] = useState<PieceDossier[]>([
    { id: "p1", label: "Statuts notariés enregistrés", statut: "fourni", nom_fichier: "statuts_sodis_2019.pdf" },
    { id: "p2", label: "Registre de Commerce (RCCM à jour)", statut: "fourni", nom_fichier: "rccm_sodis_mopti.pdf" },
    { id: "p3", label: "Numéro d'Identification Fiscale (NIF)", statut: "fourni", nom_fichier: "attestation_nif.pdf" },
    { id: "p4", label: "CNI Biométrique / NINA des gérants", statut: "fourni", nom_fichier: "cni_b_coulibaly.pdf" },
    { id: "p5", label: "Procès-Verbal de nomination et mandat", statut: "fourni", nom_fichier: "pv_gerance_2024.pdf" },
    { id: "p6", label: "États financiers certifiés des 2 derniers exercices", statut: "fourni", nom_fichier: "bilan_compte_2024_2025.pdf" },
    { id: "p7", label: "Titre de propriété du magasin / Entrepôt en garantie", statut: "a_verifier", nom_fichier: "titre_foncier_lot412.pdf" },
    { id: "p8", label: "Relevés bancaires des 6 derniers mois (DAV Kafo)", statut: "fourni", nom_fichier: "releves_dav_6mois.pdf" },
  ]);

  // Étape 8 : Grille de Scoring Institutionnelle Kafo Jiginew (sur 100)
  const [scoreData, setScoreData] = useState({
    anciennete_entreprise: 2.5,
    degre_formalisation: 3.0,
    qualite_rh: 2.0,
    rentabilite: 2.5,
    progression_ca: 2.5,
    portefeuille_clients: 2.0,
    solvabilite_clients: 1.8,
    documents_comptables: 2.5,
    emplacement: 2.0,
    equipements: 1.8,
    gestion_stocks: 2.0,
    delais_clients: 1.2,
    delais_fournisseurs: 1.3,

    moralite: 4.8,
    experience: 3.8,
    niveau_etude: 2.5,
    motivation: 2.8,
    succession: 1.8,
    management: 2.5,

    stabilite_secteur: 4.2,
    diversification: 3.8,
    part_marche: 4.0,

    anciennete_relation: 2.8,
    antecedents_credits: 3.8,
    mouvement_depots: 2.8,
    solde_moyen: 2.7,
    regularite_dav: 1.8,

    garantie_materielle: 7.2,
    qualite_titre: 4.2,
    formalisation_garantie: 3.8,
    caution_personne: 2.8,
  });

  const scoreSummary = useMemo(() => {
    const totalEnt = Math.min(30, Object.values({
      a: scoreData.anciennete_entreprise,
      b: scoreData.degre_formalisation,
      c: scoreData.qualite_rh,
      d: scoreData.rentabilite,
      e: scoreData.progression_ca,
      f: scoreData.portefeuille_clients,
      g: scoreData.solvabilite_clients,
      h: scoreData.documents_comptables,
      i: scoreData.emplacement,
      j: scoreData.equipements,
      k: scoreData.gestion_stocks,
      l: scoreData.delais_clients,
      m: scoreData.delais_fournisseurs,
    }).reduce((a: number, b: number) => a + b, 0));

    const totalEmp = Math.min(20, Object.values({
      a: scoreData.moralite,
      b: scoreData.experience,
      c: scoreData.niveau_etude,
      d: scoreData.motivation,
      e: scoreData.succession,
      f: scoreData.management,
    }).reduce((a: number, b: number) => a + b, 0));

    const totalMar = Math.min(15, Object.values({
      a: scoreData.stabilite_secteur,
      b: scoreData.diversification,
      c: scoreData.part_marche,
    }).reduce((a: number, b: number) => a + b, 0));

    const totalHis = Math.min(15, Object.values({
      a: scoreData.anciennete_relation,
      b: scoreData.antecedents_credits,
      c: scoreData.mouvement_depots,
      d: scoreData.solde_moyen,
      e: scoreData.regularite_dav,
    }).reduce((a: number, b: number) => a + b, 0));

    const totalGar = Math.min(20, Object.values({
      a: scoreData.garantie_materielle,
      b: scoreData.qualite_titre,
      c: scoreData.formalisation_garantie,
      d: scoreData.caution_personne,
    }).reduce((a: number, b: number) => a + b, 0));

    const grandTotal = Math.round((totalEnt + totalEmp + totalMar + totalHis + totalGar) * 10) / 10;

    let avis = "FAVORABLE";
    let badgeColor = "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
    let avisText = "Dossier solide éligible pour avis favorable";

    if (grandTotal < 70) {
      avis = "REJET_RECOMMANDE";
      badgeColor = "text-rose-400 bg-rose-500/15 border-rose-500/30";
      avisText = "SEUIL ÉLIMINATOIRE ATTEINT (< 70 pts) : Rejet recommandé";
    } else if (grandTotal < 80) {
      avis = "A_EXAMINER";
      badgeColor = "text-amber-400 bg-amber-500/15 border-amber-500/30";
      avisText = "Zone intermédiaire (70-79 pts) : Nécessite garanties renforcées";
    }

    return {
      totalEnt: Math.round(totalEnt * 10) / 10,
      totalEmp: Math.round(totalEmp * 10) / 10,
      totalMar: Math.round(totalMar * 10) / 10,
      totalHis: Math.round(totalHis * 10) / 10,
      totalGar: Math.round(totalGar * 10) / 10,
      grandTotal,
      avis,
      badgeColor,
      avisText,
    };
  }, [scoreData]);

  return (
    <div className="space-y-6">
      {/* Top Banner de titre */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
            <Building2 className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Collecte Personne Morale & Entreprise
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Fiche Kafo Jiginew
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instruction de dossier professionnel, vérification KYC/PPE et calcul du scoring d'admissibilité
            </p>
          </div>
        </div>

        {/* Score preview dynamique dans le header */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Score Préliminaire</p>
            <p className="text-lg font-black font-mono text-white">
              {scoreSummary.grandTotal} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </p>
          </div>
          <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreSummary.badgeColor}`}>
            {scoreSummary.avis === "FAVORABLE" && "Favorable"}
            {scoreSummary.avis === "A_EXAMINER" && "À Examiner"}
            {scoreSummary.avis === "REJET_RECOMMANDE" && "Rejet (<70)"}
          </div>
        </div>
      </div>

      {/* Stepper Wizard Indicator (9 étapes) */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {[
            { n: 1, label: "Général" },
            { n: 2, label: "Société" },
            { n: 3, label: "Dirigeants" },
            { n: 4, label: "Bénéficiaires" },
            { n: 5, label: "Origine Fonds" },
            { n: 6, label: "Risque / PPE" },
            { n: 7, label: "Pièces (KYC)" },
            { n: 8, label: "Scoring / Grille" },
            { n: 9, label: "Récap Final" },
          ].map((s) => (
            <button
              key={s.n}
              onClick={() => setCurrentStep(s.n)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg transition-all ${
                currentStep === s.n
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : currentStep > s.n
                  ? "text-slate-300 hover:bg-slate-800/60"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === s.n
                    ? "bg-emerald-500 text-slate-950"
                    : currentStep > s.n
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {currentStep > s.n ? "✓" : s.n}
              </div>
              <span className="text-[11px] font-medium truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU DE L'ÉTAPE COURANTE */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl min-h-[480px]">
        {/* ÉTAPE 1 : Informations générales */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">Étape 1 :</span> Informations générales du dossier
                </h3>
                <p className="text-xs text-slate-400">Rattachement caisse, guichet et identification de la demande</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                KJ-FORM-PM-V1
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institution / Caisse</label>
                <input
                  type="text"
                  value={dossierGeneral.caisse}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDossierGeneral({ ...dossierGeneral, caisse: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Guichet local</label>
                <input
                  type="text"
                  value={dossierGeneral.guichet}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDossierGeneral({ ...dossierGeneral, guichet: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Numéro de Compte Entreprise</label>
                <input
                  type="text"
                  value={dossierGeneral.numero_compte}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDossierGeneral({ ...dossierGeneral, numero_compte: e.target.value })}
                  className="glass-input w-full font-mono text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Type de dossier</label>
                <select
                  value={dossierGeneral.type_dossier}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDossierGeneral({ ...dossierGeneral, type_dossier: e.target.value })}
                  className="glass-input w-full"
                >
                  <option value="adhesion">Adhésion Sociétaire Personne Morale</option>
                  <option value="demande_credit">Demande de Crédit Entreprise / PME</option>
                  <option value="reevaluation">Réévaluation / Renouvellement de Ligne</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Montant demandé (FCFA)</label>
                <input
                  type="number"
                  value={dossierGeneral.montant_demande}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDossierGeneral({ ...dossierGeneral, montant_demande: e.target.value })}
                  className="glass-input w-full font-mono text-amber-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Durée souhaitée (Mois)</label>
                <input
                  type="number"
                  value={dossierGeneral.duree_mois}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDossierGeneral({ ...dossierGeneral, duree_mois: e.target.value })}
                  className="glass-input w-full font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agent d'instruction responsable</label>
                <input
                  type="text"
                  value={dossierGeneral.agent_responsable}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDossierGeneral({ ...dossierGeneral, agent_responsable: e.target.value })}
                  className="glass-input w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Société / Personne morale */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">Étape 2 :</span> Identification de la Personne Morale
              </h3>
              <p className="text-xs text-slate-400">Raison sociale, identifiants légaux RCCM/NIF et siège d'activité</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Raison Sociale / Dénomination</label>
                <input
                  type="text"
                  value={societe.raison_sociale}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSociete({ ...societe, raison_sociale: e.target.value })}
                  className="glass-input w-full font-bold text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Forme Juridique</label>
                <select
                  value={societe.forme_juridique}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSociete({ ...societe, forme_juridique: e.target.value })}
                  className="glass-input w-full"
                >
                  <option value="SARL">SARL (Société à Responsabilité Limitée)</option>
                  <option value="SUARL">SUARL (SARL Unipersonnelle)</option>
                  <option value="SAS">SAS (Société par Actions Simplifiée)</option>
                  <option value="SA">SA (Société Anonyme)</option>
                  <option value="GIE">GIE (Groupement d'Intérêt Économique)</option>
                  <option value="ETS">Établissement / Entreprise Individuelle</option>
                  <option value="COOP">Société Coopérative (OHADA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Numéro RCCM / Agrément</label>
                <input
                  type="text"
                  value={societe.rccm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSociete({ ...societe, rccm: e.target.value })}
                  className="glass-input w-full font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Numéro d'Identification Fiscale (NIF)</label>
                <input
                  type="text"
                  value={societe.nif}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSociete({ ...societe, nif: e.target.value })}
                  className="glass-input w-full font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Numéro INPS / Sécurité Sociale</label>
                <input
                  type="text"
                  value={societe.inps}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSociete({ ...societe, inps: e.target.value })}
                  className="glass-input w-full font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Activité Principale Réelle</label>
                <input
                  type="text"
                  value={societe.activite_principale}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSociete({ ...societe, activite_principale: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Chiffre d'Affaires Annuel Déclaré (FCFA)</label>
                <input
                  type="number"
                  value={societe.chiffre_affaires_annuel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSociete({ ...societe, chiffre_affaires_annuel: e.target.value })}
                  className="glass-input w-full font-mono text-emerald-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Téléphone Professionnel</label>
                <input
                  type="text"
                  value={societe.telephone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSociete({ ...societe, telephone: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Adresse Physique du Siège</label>
                <input
                  type="text"
                  value={societe.adresse_siege}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSociete({ ...societe, adresse_siege: e.target.value })}
                  className="glass-input w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Dirigeants / Signataires dynamiques */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">Étape 3 :</span> Dirigeants & Signataires habilités
                </h3>
                <p className="text-xs text-slate-400">Personnes physiques habilitées à engager la société sur le compte</p>
              </div>

              <button
                onClick={addSignataire}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-semibold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un signataire</span>
              </button>
            </div>

            <div className="space-y-4">
              {signataires.map((sig: Signataire, idx: number) => (
                <div key={sig.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {sig.prenoms_nom || `Signataire #${idx + 1}`}
                      </span>
                      {sig.est_mandataire && (
                        <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded font-semibold">
                          Mandataire Principal
                        </span>
                      )}
                    </div>

                    {signataires.length > 1 && (
                      <button
                        onClick={() => removeSignataire(sig.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Prénoms & Nom</label>
                      <input
                        type="text"
                        value={sig.prenoms_nom}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSignataire(sig.id, "prenoms_nom", e.target.value)}
                        placeholder="Ex: Bakary Coulibaly"
                        className="glass-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Fonction dans la société</label>
                      <input
                        type="text"
                        value={sig.fonction}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSignataire(sig.id, "fonction", e.target.value)}
                        placeholder="Ex: Gérant / DG"
                        className="glass-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nationalité</label>
                      <input
                        type="text"
                        value={sig.nationalite}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSignataire(sig.id, "nationalite", e.target.value)}
                        className="glass-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Type de Pièce d'identité</label>
                      <select
                        value={sig.type_piece}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateSignataire(sig.id, "type_piece", e.target.value)}
                        className="glass-input w-full"
                      >
                        <option value="CNI Biométrique">CNI Biométrique / Carte CEDEAO</option>
                        <option value="NINA">Carte NINA</option>
                        <option value="Passeport">Passeport</option>
                        <option value="Carte Consulaire">Carte Consulaire</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Numéro de la pièce</label>
                      <input
                        type="text"
                        value={sig.numero_piece}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSignataire(sig.id, "numero_piece", e.target.value)}
                        className="glass-input w-full font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Téléphone mobile</label>
                      <input
                        type="text"
                        value={sig.telephone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSignataire(sig.id, "telephone", e.target.value)}
                        className="glass-input w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Bénéficiaires Effectifs */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">Étape 4 :</span> Bénéficiaire Effectif (&gt; 25%)
              </h3>
              <p className="text-xs text-slate-400">Conformité UEMOA : identification de toute personne détenant plus de 25% du capital ou du contrôle</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-slate-200">
                  Existe-t-il une personne physique détenant directement ou indirectement plus de 25% du capital ?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setBeneficiaire({ ...beneficiaire, has_beneficiaire_25: true })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      beneficiaire.has_beneficiaire_25
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    OUI
                  </button>
                  <button
                    onClick={() => setBeneficiaire({ ...beneficiaire, has_beneficiaire_25: false })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      !beneficiaire.has_beneficiaire_25
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    NON
                  </button>
                </div>
              </div>

              {beneficiaire.has_beneficiaire_25 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-3 border-t border-slate-800/80">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Prénoms & Nom</label>
                    <input
                      type="text"
                      value={beneficiaire.prenoms_nom}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBeneficiaire({ ...beneficiaire, prenoms_nom: e.target.value })}
                      className="glass-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nationalité</label>
                    <input
                      type="text"
                      value={beneficiaire.nationalite}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBeneficiaire({ ...beneficiaire, nationalite: e.target.value })}
                      className="glass-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lien / Pourcentage de détention</label>
                    <input
                      type="text"
                      value={beneficiaire.lien_societe}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBeneficiaire({ ...beneficiaire, lien_societe: e.target.value })}
                      className="glass-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Modalités de contrôle direct / indirect</label>
                    <input
                      type="text"
                      value={beneficiaire.controle_indirect}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBeneficiaire({ ...beneficiaire, controle_indirect: e.target.value })}
                      className="glass-input w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-800/80">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Justification de l'absence de bénéficiaire effectif (&gt; 25%)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Actionnariat dispersé sans aucun associé majoritaire..."
                    className="glass-input w-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : Origine des fonds & Objectif */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">Étape 5 :</span> Origine des Fonds & Objet de la Relation
              </h3>
              <p className="text-xs text-slate-400">Traçabilité des flux financiers et destination économique du crédit</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Origine de l'apport initial</label>
                <textarea
                  rows={3}
                  value={origineFonds.origine_apport_initial}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrigineFonds({ ...origineFonds, origine_apport_initial: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nature des opérations financières prévues</label>
                <textarea
                  rows={3}
                  value={origineFonds.nature_operations_prevues}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrigineFonds({ ...origineFonds, nature_operations_prevues: e.target.value })}
                  className="glass-input w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Objectif économique du crédit sollicité</label>
                <textarea
                  rows={3}
                  value={origineFonds.objectif_relation}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrigineFonds({ ...origineFonds, objectif_relation: e.target.value })}
                  className="glass-input w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : Risque / Conformité & PPE */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">Étape 6 :</span> Classification du Risque & Statut PPE
              </h3>
              <p className="text-xs text-slate-400">Vérification de conformité LAB/FT et personnes politiquement exposées</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profil de Risque LAB/FT</label>
                <select
                  value={conformite.profil_risque}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setConformite({ ...conformite, profil_risque: e.target.value })}
                  className="glass-input w-full"
                >
                  <option value="faible">Faible — Activité locale standard sans suspicion</option>
                  <option value="moyen">Moyen — Volumes importants nécessitant suivi périodique</option>
                  <option value="eleve">Élevé — Secteur sensible ou flux transfrontaliers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Décision conformité préliminaire</label>
                <select
                  value={conformite.decision_preliminaire}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setConformite({ ...conformite, decision_preliminaire: e.target.value })}
                  className="glass-input w-full"
                >
                  <option value="conforme">Conforme — Dossier validé sans réserve KYC</option>
                  <option value="a_surveiller">À surveiller — Demande de pièces complémentaires</option>
                  <option value="bloque">Bloqué — Alerte conformité</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Les dirigeants sont-ils des PPE ?</p>
                  <p className="text-[11px] text-slate-400">Fonction politique, haute administration, magistrature...</p>
                </div>
                <button
                  onClick={() => setConformite({ ...conformite, dirigeants_ppe: !conformite.dirigeants_ppe })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    conformite.dirigeants_ppe ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {conformite.dirigeants_ppe ? "OUI (PPE)" : "NON"}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Les bénéficiaires sont-ils des PPE ?</p>
                  <p className="text-[11px] text-slate-400">Associés détenant plus de 25% ayant un mandat public</p>
                </div>
                <button
                  onClick={() => setConformite({ ...conformite, beneficiaires_ppe: !conformite.beneficiaires_ppe })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    conformite.beneficiaires_ppe ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {conformite.beneficiaires_ppe ? "OUI (PPE)" : "NON"}
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Commentaire de conformité</label>
                <textarea
                  rows={2}
                  value={conformite.commentaire_risque}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConformite({ ...conformite, commentaire_risque: e.target.value })}
                  className="glass-input w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 7 : Pièces fournies (KYC & Documents légaux) */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">Étape 7 :</span> Pièces Fournies & Checklist KYC
                </h3>
                <p className="text-xs text-slate-400">Contrôle de conformité documentaire et téléchargement des justificatifs</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                {pieces.filter((p: PieceDossier) => p.statut === "fourni").length} / {pieces.length} fournies
              </span>
            </div>

            <div className="space-y-2">
              {pieces.map((p: PieceDossier) => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileCheck className={`w-5 h-5 shrink-0 ${p.statut === "fourni" ? "text-emerald-400" : "text-amber-400"}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{p.label}</p>
                      {p.nom_fichier && (
                        <p className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>{p.nom_fichier}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={p.statut}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newStatut = e.target.value as "fourni" | "manquant" | "a_verifier";
                        setPieces((prev: PieceDossier[]) => prev.map((x: PieceDossier) => (x.id === p.id ? { ...x, statut: newStatut } : x)));
                      }}
                      className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="fourni">Fourni ✓</option>
                      <option value="manquant">Manquant ✕</option>
                      <option value="a_verifier">À vérifier ⚠</option>
                    </select>

                    <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all">
                      Remplacer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 8 : Grille d'Évaluation / Scoring Kafo Jiginew */}
        {currentStep === 8 && (
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">Étape 8 :</span> Grille d'Évaluation & Scoring Institutionnel
                </h3>
                <p className="text-xs text-slate-400">Modèle officiel Kafo Jiginew sur 100 points avec seuil éliminatoire à 70 pts</p>
              </div>

              {/* Jauge Synthèse */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-mono font-bold text-white text-base">
                    {scoreSummary.grandTotal} / 100
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-xl text-xs font-bold border ${scoreSummary.badgeColor}`}>
                  {scoreSummary.avisText}
                </div>
              </div>
            </div>

            {/* Avertissement éliminatoire si < 70 */}
            {scoreSummary.grandTotal < 70 && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <span className="font-bold">RÈGLE INSTITUTIONNELLE KAFO JIGINEW :</span> La note totale est de {scoreSummary.grandTotal}/100, inférieure au seuil éliminatoire de 70 points. Le crédit sera orienté vers un rejet ou un réajustement d'envergure.
                </div>
              </div>
            )}

            {/* Grilles par section */}
            <div className="space-y-6">
              {/* Section A : Entreprise (Max 30) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Section A — Note sur l'Entreprise (Max: 30 pts)
                  </span>
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                    Total : {scoreSummary.totalEnt} / 30
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Ancienneté entreprise (Max 3)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="3"
                      value={scoreData.anciennete_entreprise}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, anciennete_entreprise: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Degré de formalisation (Max 3)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="3"
                      value={scoreData.degre_formalisation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, degre_formalisation: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Rentabilité de l'activité (Max 3)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="3"
                      value={scoreData.rentabilite}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, rentabilite: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Progression du CA (Max 3)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="3"
                      value={scoreData.progression_ca}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, progression_ca: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Documents comptables (Max 3)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="3"
                      value={scoreData.documents_comptables}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, documents_comptables: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Qualité emplacement (Max 2)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="2"
                      value={scoreData.emplacement}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, emplacement: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section B : Emprunteur (Max 20) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Section B — Note sur l'Emprunteur & Dirigeants (Max: 20 pts)
                  </span>
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                    Total : {scoreSummary.totalEmp} / 20
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Moralité de l'emprunteur (Max 5)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      value={scoreData.moralite}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, moralite: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Expérience professionnelle (Max 4)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="4"
                      value={scoreData.experience}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, experience: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Qualité management & relève (Max 3)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="3"
                      value={scoreData.management}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, management: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section C : Marché (Max 15) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Section C — Note sur le Marché (Max: 15 pts)
                  </span>
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                    Total : {scoreSummary.totalMar} / 15
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Stabilité du secteur (Max 5)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      value={scoreData.stabilite_secteur}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, stabilite_secteur: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Diversification produits (Max 5)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      value={scoreData.diversification}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, diversification: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Part de marché locale (Max 5)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      value={scoreData.part_marche}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, part_marche: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section D : Historique (Max 15) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Section D — Historique Compte & Antécédents (Max: 15 pts)
                  </span>
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                    Total : {scoreSummary.totalHis} / 15
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Antécédents de remboursement (Max 4)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="4"
                      value={scoreData.antecedents_credits}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, antecedents_credits: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Mouvement dépôts 6 mois (Max 3)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="3"
                      value={scoreData.mouvement_depots}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, mouvement_depots: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Régularité compte DAV (Max 2)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="2"
                      value={scoreData.regularite_dav}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, regularite_dav: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section E : Garanties & Caution (Max 20) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    Section E — Garanties & Cautions (Max: 20 pts)
                  </span>
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                    Total : {scoreSummary.totalGar} / 20
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Couverture garantie matérielle / gage (Max 8)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="8"
                      value={scoreData.garantie_materielle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, garantie_materielle: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Qualité titre de propriété / foncier (Max 5)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      value={scoreData.qualite_titre}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData({ ...scoreData, qualite_titre: parseFloat(e.target.value) || 0 })}
                      className="glass-input w-full font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 9 : Récapitulatif Final & Validation */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">Étape 9 :</span> Récapitulatif Complet du Dossier
                </h3>
                <p className="text-xs text-slate-400">Vérification intégrale avant transmission au superviseur et comité</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all">
                  <Save className="w-4 h-4" />
                  <span>Enregistrer Brouillon</span>
                </button>
                <button
                  onClick={onComplete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Soumettre au Comité</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Carte Entreprise */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Entreprise Emprunteuse</span>
                <p className="text-sm font-bold text-white">{societe.raison_sociale}</p>
                <p className="text-xs text-slate-400">Forme : <span className="text-slate-200">{societe.forme_juridique}</span></p>
                <p className="text-xs text-slate-400">RCCM : <span className="text-slate-200 font-mono">{societe.rccm}</span></p>
                <p className="text-xs text-slate-400">CA Annuel : <span className="text-emerald-400 font-bold font-mono">{parseInt(societe.chiffre_affaires_annuel).toLocaleString()} FCFA</span></p>
              </div>

              {/* Carte Crédit */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Demande de Financement</span>
                <p className="text-sm font-bold text-amber-400 font-mono">{parseInt(dossierGeneral.montant_demande).toLocaleString()} FCFA</p>
                <p className="text-xs text-slate-400">Durée : <span className="text-slate-200">{dossierGeneral.duree_mois} mois</span></p>
                <p className="text-xs text-slate-400">Compte : <span className="text-slate-200 font-mono">{dossierGeneral.numero_compte}</span></p>
                <p className="text-xs text-slate-400">Agent : <span className="text-slate-200">{dossierGeneral.agent_responsable}</span></p>
              </div>

              {/* Carte Scoring */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Résultat d'Évaluation</span>
                <p className="text-2xl font-black font-mono text-white">
                  {scoreSummary.grandTotal} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </p>
                <div className={`inline-block px-2.5 py-1 rounded text-xs font-bold border ${scoreSummary.badgeColor}`}>
                  {scoreSummary.avis === "FAVORABLE" && "Favorable"}
                  {scoreSummary.avis === "A_EXAMINER" && "À Examiner (70-79)"}
                  {scoreSummary.avis === "REJET_RECOMMANDE" && "Rejet Recommandé (< 70)"}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Entreprise: {scoreSummary.totalEnt}/30 • Garanties: {scoreSummary.totalGar}/20
                </p>
              </div>
            </div>

            {/* Détails Signataires et Pièces */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300">Signataires habilités ({signataires.length})</span>
                <ul className="space-y-1 text-slate-400">
                  {signataires.map((s: Signataire) => (
                    <li key={s.id} className="flex items-center justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-200 font-semibold">{s.prenoms_nom} ({s.fonction})</span>
                      <span className="font-mono text-slate-500">{s.telephone}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300">Statut Conformité & KYC</span>
                <div className="space-y-1.5 text-slate-400">
                  <p>• Profil de risque : <span className="text-slate-200 capitalize font-semibold">{conformite.profil_risque}</span></p>
                  <p>• Bénéficiaire effectif : <span className="text-slate-200">{beneficiaire.prenoms_nom} (&gt; 25%)</span></p>
                  <p>• Pièces fournies : <span className="text-emerald-400 font-bold">{pieces.filter((p: PieceDossier) => p.statut === "fourni").length} / {pieces.length}</span> documents valides</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barre de navigation inférieure (Suivant / Précédent) */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
        <button
          onClick={() => setCurrentStep((prev: number) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Étape précédente</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Étape {currentStep} sur {totalSteps}
        </span>

        {currentStep < totalSteps ? (
          <button
            onClick={() => setCurrentStep((prev: number) => Math.min(totalSteps, prev + 1))}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
          >
            <span>Étape suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
          >
            <span>Transmettre au Comité</span>
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
