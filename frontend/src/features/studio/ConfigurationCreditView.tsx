import React, { useState } from "react";
import {
  FileText,
  Sliders,
  Plus,
  ChevronRight,
  Eye,
  CheckCircle2,
  Copy,
  Trash2,
  ArrowLeft,
  Search,
  Sparkles,
  Calculator,
  FileCheck,
  Shield,
  Layers,
  MapPin,
  X
} from "lucide-react";
import type {
  DefinitionChamp,
  CategorieMetier,
  TypeDonnee,
  Temporalite,
  RoleAnalytique,
  Sensibilite
} from "./studioTypes";

export interface ConfigCredit {
  id: string;
  nom: string;
  profil_code: string;
  produit_code: string;
  institution: string;
  version: string;
  statut: "BROUILLON" | "VALIDATION" | "PUBLIEE" | "ARCHIVEE";
  description: string;
  autoriser_profils_secondaires: boolean;
  collecte_provenance: boolean;
  documents_justificatifs: boolean;
  validation_avant_soumission: boolean;
  sections: {
    id: string;
    titre: string;
    description: string;
    ordre: number;
    champ_codes: string[];
  }[];
  documents_requis: {
    id: string;
    titre: string;
    obligatoire: boolean;
    condition?: string;
  }[];
  regles_validation: {
    id: string;
    nom: string;
    expression: string;
    message_erreur: string;
  }[];
  variables_derivees: {
    id: string;
    code: string;
    nom: string;
    type_donnee: string;
    expression: string;
    valeur_test?: string;
  }[];
  criteres_analyse: {
    id: string;
    nom: string;
    variable: string;
    condition: string;
    points: number;
    maximum: number;
  }[];
}

interface ConfigurationCreditProps {
  champsGlobaux: DefinitionChamp[];
  onAjouterChampGlobal: (champ: DefinitionChamp) => void;
  onLancerCollecte: (config: ConfigCredit) => void;
}

export const ConfigurationCreditView: React.FC<ConfigurationCreditProps> = ({
  champsGlobaux,
  onAjouterChampGlobal,
  onLancerCollecte,
}) => {
  // Liste des configurations disponibles
  const [configurations, setConfigurations] = useState<ConfigCredit[]>([
    {
      id: "cfg-salarie-1",
      nom: "Crédit salarié — Standard",
      profil_code: "SALARIE",
      produit_code: "CREDIT_SALARIE",
      institution: "KAFO JIGINEW",
      version: "1.0",
      statut: "PUBLIEE",
      description: "Financement à la consommation et équipement pour salariés domiciliés.",
      autoriser_profils_secondaires: true,
      collecte_provenance: true,
      documents_justificatifs: true,
      validation_avant_soumission: true,
      sections: [
        {
          id: "sec_id_sal",
          titre: "1. Identification de l'emprunteur",
          description: "Données civiles et contacts certifiés",
          ordre: 1,
          champ_codes: ["nom_complet", "telephone_principal", "type_logement", "c_loyer_mensuel"],
        },
        {
          id: "sec_emp_sal",
          titre: "2. Emploi & Revenus",
          description: "Contrat de travail et domiciliation bancaire",
          ordre: 2,
          champ_codes: ["nom_employeur", "salaire_net", "anciennete_emploi", "domiciliation_salaire"],
        },
        {
          id: "sec_dem_sal",
          titre: "3. Demande de crédit",
          description: "Paramètres du prêt sollicité",
          ordre: 3,
          champ_codes: ["montant_demande", "duree_mois", "objet_credit"],
        },
      ],
      documents_requis: [
        { id: "doc-1", titre: "Pièce d'identité (CNI ou NINA)", obligatoire: true },
        { id: "doc-2", titre: "Trois derniers bulletins de salaire", obligatoire: true },
        { id: "doc-3", titre: "Attestation de travail / Contrat", obligatoire: true },
        { id: "doc-4", titre: "Engagement de domiciliation irrévocable", obligatoire: true },
      ],
      regles_validation: [
        { id: "rv-1", nom: "Montant strictement positif", expression: "montant_demande > 0", message_erreur: "Le montant demandé doit être supérieur à zéro." },
        { id: "rv-2", nom: "Capacité d'endettement max 33%", expression: "(montant_demande / duree_mois) <= (salaire_net * 0.33)", message_erreur: "L'échéance dépasse le ratio prudentiel de 33% du salaire net." },
      ],
      variables_derivees: [
        { id: "vd-1", code: "echeance_mensuelle", nom: "Échéance mensuelle théorique", type_donnee: "MONTANT", expression: "montant_demande / duree_mois", valeur_test: "83 333 FCFA" },
        { id: "vd-2", code: "reste_a_vivre", nom: "Reste à vivre mensuel", type_donnee: "MONTANT", expression: "salaire_net - (montant_demande / duree_mois)", valeur_test: "266 667 FCFA" },
      ],
      criteres_analyse: [
        { id: "ca-1", nom: "Stabilité dans l'emploi", variable: "anciennete_emploi", condition: ">= 24 mois", points: 4, maximum: 4 },
        { id: "ca-2", nom: "Domiciliation bancaire effective", variable: "domiciliation_salaire", condition: "== OUI", points: 5, maximum: 5 },
      ],
    },
    {
      id: "cfg-agri-1",
      nom: "Crédit agricole — Intrants de Campagne",
      profil_code: "AGRICULTEUR",
      produit_code: "CREDIT_INTRANTS",
      institution: "KAFO JIGINEW",
      version: "1.0",
      statut: "PUBLIEE",
      description: "Financement des intrants, semences certifiées et engrais pour exploitants agricoles.",
      autoriser_profils_secondaires: false,
      collecte_provenance: true,
      documents_justificatifs: true,
      validation_avant_soumission: true,
      sections: [
        {
          id: "sec_id_agr",
          titre: "1. Identification de l'exploitant",
          description: "Identité et localisation de l'exploitation",
          ordre: 1,
          champ_codes: ["nom_complet", "telephone_principal"],
        },
        {
          id: "sec_prod_agr",
          titre: "2. Production & Campagne",
          description: "Cultures, superficies et intrants",
          ordre: 2,
          champ_codes: ["culture_principale", "superficie_cultivee", "campagne_agricole", "cout_intrants", "date_recolte_prevue"],
        },
        {
          id: "sec_dem_agr",
          titre: "3. Demande de financement",
          description: "Montant et objet du crédit de campagne",
          ordre: 3,
          champ_codes: ["montant_demande", "duree_mois"],
        },
      ],
      documents_requis: [
        { id: "doc-a1", titre: "Pièce d'identité en cours de validité", obligatoire: true },
        { id: "doc-a2", titre: "Attestation coutumière ou titre de parcelle", obligatoire: true },
        { id: "doc-a3", titre: "Facture proforma des intrants agréés", obligatoire: true },
        { id: "doc-a4", titre: "Caution solidaire du groupement villageois", obligatoire: false, condition: "Si exploitant individuel" },
      ],
      regles_validation: [
        { id: "rv-a1", nom: "Superficie positive", expression: "superficie_cultivee > 0", message_erreur: "La superficie doit être supérieure à 0 ha." },
        { id: "rv-a2", nom: "Coût intrants cohérent", expression: "cout_intrants <= montant_demande * 1.2", message_erreur: "Le montant sollicité ne couvre pas les intrants." },
      ],
      variables_derivees: [
        { id: "vd-a1", code: "cout_par_hectare", nom: "Coût des intrants par hectare", type_donnee: "MONTANT", expression: "cout_intrants / superficie_cultivee", valeur_test: "77 777 FCFA / ha" },
      ],
      criteres_analyse: [
        { id: "ca-a1", nom: "Maîtrise de la spéculation", variable: "culture_principale", condition: "in ['COTON', 'MAIS', 'RIZ']", points: 3, maximum: 3 },
      ],
    },
    {
      id: "cfg-pme-1",
      nom: "Fonds de roulement PME & Entreprise",
      profil_code: "PME",
      produit_code: "CREDIT_FDR",
      institution: "KAFO JIGINEW",
      version: "1.0",
      statut: "BROUILLON",
      description: "Facilité de trésorerie pour entreprises formelles ou en formalisation.",
      autoriser_profils_secondaires: true,
      collecte_provenance: true,
      documents_justificatifs: true,
      validation_avant_soumission: true,
      sections: [
        {
          id: "sec_pme_id",
          titre: "1. Identification Entreprise",
          description: "Raison sociale, statut et gouvernance",
          ordre: 1,
          champ_codes: ["raison_sociale", "secteur_activite", "date_creation_entreprise"],
        },
        {
          id: "sec_pme_fin",
          titre: "2. Données Financières",
          description: "Chiffre d'affaires et structure des charges",
          ordre: 2,
          champ_codes: ["chiffre_affaires_annuel", "marge_brute", "montant_demande"],
        },
      ],
      documents_requis: [
        { id: "doc-p1", titre: "Registre du Commerce (RCCM)", obligatoire: true },
        { id: "doc-p2", titre: "États financiers certifiés des 2 derniers exercices", obligatoire: true },
        { id: "doc-p3", titre: "Relevés bancaires des 6 derniers mois", obligatoire: true },
      ],
      regles_validation: [
        { id: "rv-p1", nom: "CA supérieur au crédit", expression: "chiffre_affaires_annuel >= montant_demande * 2", message_erreur: "Le montant demandé excède 50% du chiffre d'affaires annuel." },
      ],
      variables_derivees: [
        { id: "vd-p1", code: "poids_credit_ca", nom: "Poids du crédit / Chiffre d'Affaires", type_donnee: "POURCENTAGE", expression: "(montant_demande / chiffre_affaires_annuel) * 100", valeur_test: "23.5 %" },
      ],
      criteres_analyse: [
        { id: "ca-p1", nom: "Ancienneté de l'entreprise", variable: "date_creation_entreprise", condition: ">= 36 mois", points: 3, maximum: 3 },
      ],
    },
  ]);

  // État de l'écran : "liste" ou "editeur"
  const [currentView, setCurrentView] = useState<"liste" | "editeur">("liste");
  const [activeConfigId, setActiveConfigId] = useState<string>("cfg-agri-1");
  const [activeTab, setActiveTab] = useState<"general" | "sections" | "documents" | "regles" | "analyse">("sections");

  // Modal Nouvelle Configuration
  const [isNewConfigModalOpen, setIsNewConfigModalOpen] = useState(false);
  const [newConfigForm, setNewConfigForm] = useState({
    nom: "",
    profil_code: "AGRICULTEUR",
    produit_code: "CREDIT_INTRANTS",
    institution: "KAFO JIGINEW",
    dupliquerDe: "aucun",
  });

  // Modal / Tiroir Aperçu en direct
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

  // Tiroir d'ajout de donnée dans une section
  const [isAddDataDrawerOpen, setIsAddDataDrawerOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [addMode, setAddMode] = useState<"existante" | "nouvelle">("existante");
  const [searchExisting, setSearchExisting] = useState("");

  // Formulaire Nouvelle Donnée (avec cas géographique & usages)
  const [nouvelleDonnee, setNouvelleDonnee] = useState({
    code: "",
    libelle: "",
    description: "",
    categorie: "ACTIVITE" as CategorieMetier,
    type_donnee: "TEXTE" as TypeDonnee,
    temporalite: "VALEUR_ACTUELLE" as Temporalite,
    role_analytique: "VARIABLE_CANDIDATE" as RoleAnalytique,
    sensibilite: "NORMALE" as Sensibilite,
    unite: "",
    obligatoire: false,
    entree_regle: true,
    candidate_modele: false,
    collecter_provenance: true,
    verification_requise: false,
    // Cas spécifique géographique
    granularite_geo: "COMMUNE",
    consentement_requis: false,
    // Usages autorisés
    usages: {
      affichage: true,
      collecte: true,
      calcul_derive: true,
      segmentation: true,
      regle_credit: false,
      modele_statistique: false,
      conformite: false,
      reporting: true,
    },
  });

  // Configuration active
  const activeConfig = configurations.find((c) => c.id === activeConfigId) || configurations[0];

  // Handler de modification de la configuration active
  const updateActiveConfig = (updater: (prev: ConfigCredit) => ConfigCredit) => {
    setConfigurations((prev) =>
      prev.map((c) => (c.id === activeConfig.id ? updater(c) : c))
    );
  };

  // Dupliquer configuration (ex: passer de v1 Publiée à v2 Brouillon)
  const handleDupliquerConfig = (config: ConfigCredit) => {
    const nextVersion = (parseFloat(config.version) + 1.0).toFixed(1);
    const newConfig: ConfigCredit = {
      ...config,
      id: `cfg-${Date.now()}`,
      nom: `${config.nom} (v${nextVersion} Brouillon)`,
      version: nextVersion,
      statut: "BROUILLON",
    };
    setConfigurations((prev) => [newConfig, ...prev]);
    setActiveConfigId(newConfig.id);
    setCurrentView("editeur");
  };

  // Publier la configuration
  const handlePublier = () => {
    updateActiveConfig((prev) => ({
      ...prev,
      statut: "PUBLIEE",
    }));
    alert(`Configuration "${activeConfig.nom}" publiée avec succès en version ${activeConfig.version} !`);
  };

  // Création nouvelle configuration
  const handleCreateConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let baseSections = [
      { id: "sec-1", titre: "1. Identification générale", description: "État civil et identification", ordre: 1, champ_codes: ["nom_complet", "telephone_principal"] },
      { id: "sec-2", titre: "2. Activité principale", description: "Données de production ou de commerce", ordre: 2, champ_codes: [] },
      { id: "sec-3", titre: "3. Demande de crédit", description: "Montant et durée", ordre: 3, champ_codes: ["montant_demande", "duree_mois"] },
    ];

    if (newConfigForm.dupliquerDe !== "aucun") {
      const source = configurations.find((c) => c.id === newConfigForm.dupliquerDe);
      if (source) {
        baseSections = JSON.parse(JSON.stringify(source.sections));
      }
    }

    const created: ConfigCredit = {
      id: `cfg-${Date.now()}`,
      nom: newConfigForm.nom || `Crédit ${newConfigForm.profil_code}`,
      profil_code: newConfigForm.profil_code,
      produit_code: newConfigForm.produit_code,
      institution: newConfigForm.institution,
      version: "1.0",
      statut: "BROUILLON",
      description: "Nouvelle configuration de collecte et de crédit.",
      autoriser_profils_secondaires: true,
      collecte_provenance: true,
      documents_justificatifs: true,
      validation_avant_soumission: true,
      sections: baseSections,
      documents_requis: [
        { id: "d-1", titre: "Pièce d'identité officielle", obligatoire: true },
        { id: "d-2", titre: "Justificatif d'activité", obligatoire: true },
      ],
      regles_validation: [
        { id: "r-1", nom: "Montant positif", expression: "montant_demande > 0", message_erreur: "Montant requis." },
      ],
      variables_derivees: [],
      criteres_analyse: [],
    };

    setConfigurations((prev) => [created, ...prev]);
    setActiveConfigId(created.id);
    setIsNewConfigModalOpen(false);
    setCurrentView("editeur");
  };

  // Ajouter donnée existante à la section
  const handleAddExistingFieldToSection = (champCode: string) => {
    if (!selectedSectionId) return;
    updateActiveConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === selectedSectionId && !sec.champ_codes.includes(champCode)
          ? { ...sec, champ_codes: [...sec.champ_codes, champCode] }
          : sec
      ),
    }));
    setIsAddDataDrawerOpen(false);
  };

  // Retirer un champ d'une section de cette configuration
  const handleRemoveFieldFromSection = (sectionId: string, champCode: string) => {
    updateActiveConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId
          ? { ...sec, champ_codes: sec.champ_codes.filter((c) => c !== champCode) }
          : sec
      ),
    }));
  };

  // Créer et attacher une nouvelle donnée
  const handleCreateAndAttachNewField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouvelleDonnee.code || !nouvelleDonnee.libelle) return;

    const champCree: DefinitionChamp = {
      id: `champ_${nouvelleDonnee.code}`,
      code: nouvelleDonnee.code,
      libelle: nouvelleDonnee.libelle,
      description: nouvelleDonnee.description,
      type_donnee: nouvelleDonnee.type_donnee,
      categorie: nouvelleDonnee.categorie,
      temporalite: nouvelleDonnee.temporalite,
      role_analytique: nouvelleDonnee.role_analytique,
      sensibilite: nouvelleDonnee.sensibilite,
      unite: nouvelleDonnee.unite,
      obligatoire: nouvelleDonnee.obligatoire,
      section_id: selectedSectionId,
      profils_applicables: [activeConfig.profil_code],
      produits_applicables: [activeConfig.produit_code],
      actif: true,
      ordre: 99,
      niveau_verification: "DECLARE",
    };

    onAjouterChampGlobal(champCree);

    // Attacher à la section courante
    updateActiveConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === selectedSectionId
          ? { ...sec, champ_codes: [...sec.champ_codes, nouvelleDonnee.code] }
          : sec
      ),
    }));

    setIsAddDataDrawerOpen(false);
  };

  // =========================================================================
  // VUE 1 : LISTE DES CONFIGURATIONS CRÉDIT
  // =========================================================================
  if (currentView === "liste") {
    return (
      <div className="space-y-6">
        {/* Header de la page */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Studio de Paramétrage No-Code
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Moteur de Collecte Dynamique V0
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Configuration Crédit
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Gérez les modèles de formulaires dynamiques par profil et produit de crédit. 
              Toute modification est répercutée instantanément sur le formulaire agent sans toucher au code.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-medium text-slate-700">
              <span className="text-slate-500">Institution :</span>
              <span className="font-bold text-slate-900">KAFO JIGINEW</span>
            </div>

            <button
              onClick={() => setIsNewConfigModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle configuration</span>
            </button>
          </div>
        </div>

        {/* Grille des configurations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Configurations actives ({configurations.length})
            </h2>
            <span className="text-xs text-slate-500">
              Cliquez sur "Modifier" pour entrer dans le constructeur à 5 onglets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {configurations.map((cfg) => {
              const totalChamps = cfg.sections.reduce(
                (acc, s) => acc + s.champ_codes.length,
                0
              );
              const isPubliee = cfg.statut === "PUBLIEE";

              return (
                <div
                  key={cfg.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/60 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {cfg.profil_code} · {cfg.produit_code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                          {cfg.nom}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                          isPubliee
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        v{cfg.version} · {cfg.statut}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {cfg.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs font-medium text-slate-600">
                      <div>
                        <span className="font-bold text-slate-900">{cfg.sections.length}</span>{" "}
                        sections
                      </div>
                      <div>·</div>
                      <div>
                        <span className="font-bold text-slate-900">{totalChamps}</span>{" "}
                        champs
                      </div>
                      <div>·</div>
                      <div>
                        <span className="font-bold text-slate-900">{cfg.documents_requis.length}</span>{" "}
                        documents
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleDupliquerConfig(cfg)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                      title="Créer une nouvelle version pour modification d'audit"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Dupliquer</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveConfigId(cfg.id);
                          setIsPreviewOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Aperçu du formulaire agent"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveConfigId(cfg.id);
                          setCurrentView("editeur");
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        <span>{isPubliee ? "Modifier" : "Continuer"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL CRÉATION DE CONFIGURATION */}
        {isNewConfigModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Nouvelle Configuration de Crédit
                </h3>
                <button
                  onClick={() => setIsNewConfigModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateConfigSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom de la configuration *
                  </label>
                  <input
                    type="text"
                    required
                    value={newConfigForm.nom}
                    onChange={(e) =>
                      setNewConfigForm({ ...newConfigForm, nom: e.target.value })
                    }
                    placeholder="Ex: Crédit agricole — Intrants Maïs 2026"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Profil emprunteur *
                    </label>
                    <select
                      value={newConfigForm.profil_code}
                      onChange={(e) =>
                        setNewConfigForm({ ...newConfigForm, profil_code: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="AGRICULTEUR">Agriculteur</option>
                      <option value="SALARIE">Salarié</option>
                      <option value="COMMERCANT">Commerçant</option>
                      <option value="PME">PME / Entreprise</option>
                      <option value="PERSONNE_MORALE">Personne morale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Produit de crédit *
                    </label>
                    <select
                      value={newConfigForm.produit_code}
                      onChange={(e) =>
                        setNewConfigForm({ ...newConfigForm, produit_code: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="CREDIT_INTRANTS">Crédit intrants</option>
                      <option value="CREDIT_SALARIE">Crédit salarié</option>
                      <option value="CREDIT_FDR">Fonds de roulement</option>
                      <option value="CREDIT_EQUIPEMENT">Crédit équipement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dupliquer une configuration existante ?
                  </label>
                  <select
                    value={newConfigForm.dupliquerDe}
                    onChange={(e) =>
                      setNewConfigForm({ ...newConfigForm, dupliquerDe: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="aucun">Aucune (Démarrer vierge)</option>
                    {configurations.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom} (v{c.version})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewConfigModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Créer et configurer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VUE 2 : CONSTRUCTEUR DE CONFIGURATION (5 ONGLETS)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Barre d'en-tête du constructeur */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("liste")}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            title="Retour à la liste des configurations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Configuration Crédit
              </span>
              <span className="text-slate-300">/</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  activeConfig.statut === "PUBLIEE"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                v{activeConfig.version} · {activeConfig.statut}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">
              {activeConfig.nom}
            </h1>
          </div>
        </div>

        {/* Boutons d'action : Aperçu, Enregistrer, Publier */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-all"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Aperçu formulaire</span>
          </button>

          <button
            onClick={() => onLancerCollecte(activeConfig)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Tester en collecte</span>
          </button>

          {activeConfig.statut !== "PUBLIEE" ? (
            <button
              onClick={handlePublier}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publier</span>
            </button>
          ) : (
            <button
              onClick={() => handleDupliquerConfig(activeConfig)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Nouvelle version (v2)</span>
            </button>
          )}
        </div>
      </div>

      {/* Barre des 5 onglets */}
      <div className="bg-white rounded-xl border border-slate-200 p-1 flex items-center gap-1 overflow-x-auto shadow-sm">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "general"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. Général</span>
        </button>

        <button
          onClick={() => setActiveTab("sections")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "sections"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Sections & données</span>
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "documents"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>3. Documents</span>
        </button>

        <button
          onClick={() => setActiveTab("regles")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "regles"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>4. Règles</span>
        </button>

        <button
          onClick={() => setActiveTab("analyse")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "analyse"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>5. Analyse</span>
        </button>
      </div>

      {/* CONTENU SELON L'ONGLET SÉLECTIONNÉ */}

      {/* ================= ONGLET 1 : GÉNÉRAL ================= */}
      {activeTab === "general" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Informations Générales</h3>
            <p className="text-xs text-slate-500">
              Paramètres structurels du profil, du produit et versioning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom de la configuration
                </label>
                <input
                  type="text"
                  value={activeConfig.nom}
                  onChange={(e) =>
                    updateActiveConfig((prev) => ({ ...prev, nom: e.target.value }))
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Profil cible
                  </label>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                    {activeConfig.profil_code}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Produit associé
                  </label>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                    {activeConfig.produit_code}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & champ d'application
                </label>
                <textarea
                  rows={3}
                  value={activeConfig.description}
                  onChange={(e) =>
                    updateActiveConfig((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Comportement */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Comportement de Collecte
              </h4>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <span className="text-xs font-medium text-slate-800">
                    Autoriser profils secondaires
                  </span>
                  <input
                    type="checkbox"
                    checked={activeConfig.autoriser_profils_secondaires}
                    onChange={(e) =>
                      updateActiveConfig((prev) => ({
                        ...prev,
                        autoriser_profils_secondaires: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <span className="text-xs font-medium text-slate-800">
                    Collecter la provenance & traçabilité par donnée
                  </span>
                  <input
                    type="checkbox"
                    checked={activeConfig.collecte_provenance}
                    onChange={(e) =>
                      updateActiveConfig((prev) => ({
                        ...prev,
                        collecte_provenance: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <span className="text-xs font-medium text-slate-800">
                    Exiger pièces justificatives documentaires
                  </span>
                  <input
                    type="checkbox"
                    checked={activeConfig.documents_justificatifs}
                    onChange={(e) =>
                      updateActiveConfig((prev) => ({
                        ...prev,
                        documents_justificatifs: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <span className="text-xs font-medium text-slate-800">
                    Validation des règles avant soumission agent
                  </span>
                  <input
                    type="checkbox"
                    checked={activeConfig.validation_avant_soumission}
                    onChange={(e) =>
                      updateActiveConfig((prev) => ({
                        ...prev,
                        validation_avant_soumission: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ONGLET 2 : SECTIONS & DONNÉES ================= */}
      {activeTab === "sections" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne gauche : Liste des sections */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Sections ({activeConfig.sections.length})
              </h3>
              <button
                onClick={() => {
                  const num = activeConfig.sections.length + 1;
                  const newSec = {
                    id: `sec-${Date.now()}`,
                    titre: `${num}. Nouvelle Section`,
                    description: "Description de la section",
                    ordre: num,
                    champ_codes: [],
                  };
                  updateActiveConfig((prev) => ({
                    ...prev,
                    sections: [...prev.sections, newSec],
                  }));
                  setSelectedSectionId(newSec.id);
                }}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            <div className="space-y-2">
              {activeConfig.sections.map((sec) => {
                const isSelected = (selectedSectionId || activeConfig.sections[0]?.id) === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-300 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {sec.titre}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {sec.champ_codes.length} champs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {sec.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colonne droite : Champs de la section active */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            {(() => {
              const currentSec =
                activeConfig.sections.find(
                  (s) => s.id === (selectedSectionId || activeConfig.sections[0]?.id)
                ) || activeConfig.sections[0];

              if (!currentSec) {
                return (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Aucune section sélectionnée
                  </div>
                );
              }

              return (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {currentSec.titre}
                      </h3>
                      <p className="text-xs text-slate-500">{currentSec.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSectionId(currentSec.id);
                        setIsAddDataDrawerOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter donnée</span>
                    </button>
                  </div>

                  {currentSec.champ_codes.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                      <p className="text-xs font-medium text-slate-500">
                        Aucun champ configuré dans cette section.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedSectionId(currentSec.id);
                          setIsAddDataDrawerOpen(true);
                        }}
                        className="text-xs font-bold text-emerald-600 hover:underline"
                      >
                        + Ajouter un champ existant ou en créer un nouveau
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {currentSec.champ_codes.map((code) => {
                        const champDef = champsGlobaux.find((c) => c.code === code) || {
                          code,
                          libelle: code,
                          type_donnee: "TEXTE",
                          categorie: "ACTIVITE",
                          obligatoire: false,
                          role_analytique: "VARIABLE_CANDIDATE",
                          temporalite: "VALEUR_ACTUELLE",
                        };

                        return (
                          <div
                            key={code}
                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 font-mono text-xs select-none">
                                ☰
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">
                                    {champDef.libelle}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    ({champDef.code})
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {champDef.type_donnee}
                                  </span>
                                  <span>·</span>
                                  <span>{champDef.categorie}</span>
                                  <span>·</span>
                                  <span className="font-medium text-slate-600">
                                    {champDef.role_analytique}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  champDef.obligatoire
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {champDef.obligatoire ? "Obligatoire" : "Facultatif"}
                              </span>

                              <button
                                onClick={() =>
                                  handleRemoveFieldFromSection(currentSec.id, code)
                                }
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                                title="Retirer de cette configuration"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= ONGLET 3 : DOCUMENTS ================= */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Documents Requis pour la Demande
              </h3>
              <p className="text-xs text-slate-500">
                Pièces justificatives obligatoires ou conditionnelles requises par le responsable de crédit
              </p>
            </div>
            <button
              onClick={() => {
                const titre = prompt("Titre de la nouvelle pièce justificative :");
                if (titre) {
                  updateActiveConfig((prev) => ({
                    ...prev,
                    documents_requis: [
                      ...prev.documents_requis,
                      { id: `doc-${Date.now()}`, titre, obligatoire: true },
                    ],
                  }));
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter document</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeConfig.documents_requis.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      {doc.titre}
                    </span>
                    {doc.condition && (
                      <p className="text-[11px] text-amber-600 font-medium">
                        Condition : {doc.condition}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doc.obligatoire}
                      onChange={(e) =>
                        updateActiveConfig((prev) => ({
                          ...prev,
                          documents_requis: prev.documents_requis.map((d) =>
                            d.id === doc.id ? { ...d, obligatoire: e.target.checked } : d
                          ),
                        }))
                      }
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span>Obligatoire</span>
                  </label>

                  <button
                    onClick={() =>
                      updateActiveConfig((prev) => ({
                        ...prev,
                        documents_requis: prev.documents_requis.filter((d) => d.id !== doc.id),
                      }))
                    }
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ONGLET 4 : RÈGLES & CALCULS ================= */}
      {activeTab === "regles" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Règles de validation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Règles Prudentielles & Validation
              </h3>
              <button
                onClick={() => {
                  const nom = prompt("Nom de la règle :");
                  const expression = prompt("Expression logique (ex: superficie_cultivee > 0) :");
                  if (nom && expression) {
                    updateActiveConfig((prev) => ({
                      ...prev,
                      regles_validation: [
                        ...prev.regles_validation,
                        { id: `rv-${Date.now()}`, nom, expression, message_erreur: "Non-conformité prudentielle." },
                      ],
                    }));
                  }
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                + Ajouter règle
              </button>
            </div>

            <div className="space-y-3">
              {activeConfig.regles_validation.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{r.nom}</span>
                    <button
                      onClick={() =>
                        updateActiveConfig((prev) => ({
                          ...prev,
                          regles_validation: prev.regles_validation.filter((item) => item.id !== r.id),
                        }))
                      }
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-mono text-xs text-emerald-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                    {r.expression}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">{r.message_erreur}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Variables dérivées */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Variables Dérivées & Formules
              </h3>
              <button
                onClick={() => {
                  const nom = prompt("Nom de la variable dérivée :");
                  const expression = prompt("Expression calculée :");
                  if (nom && expression) {
                    updateActiveConfig((prev) => ({
                      ...prev,
                      variables_derivees: [
                        ...prev.variables_derivees,
                        { id: `vd-${Date.now()}`, code: nom.toLowerCase().replace(/\s+/g, "_"), nom, type_donnee: "MONTANT", expression },
                      ],
                    }));
                  }
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                + Nouvelle formule
              </button>
            </div>

            <div className="space-y-3">
              {activeConfig.variables_derivees.map((vd) => (
                <div key={vd.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{vd.nom}</span>
                      <span className="text-[10px] font-mono text-slate-500 ml-2">({vd.code})</span>
                    </div>
                    <button
                      onClick={() =>
                        updateActiveConfig((prev) => ({
                          ...prev,
                          variables_derivees: prev.variables_derivees.filter((v) => v.id !== vd.id),
                        }))
                      }
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-mono text-xs text-indigo-700 bg-white px-2.5 py-1.5 rounded border border-slate-200">
                    {vd.expression}
                  </div>
                  {vd.valeur_test && (
                    <div className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Exemple de calcul :</span>
                      <span className="font-bold text-emerald-700">{vd.valeur_test}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= ONGLET 5 : ANALYSE ================= */}
      {activeTab === "analyse" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cadre d'Analyse & Barème de Notation
              </h3>
              <p className="text-xs text-slate-500">
                Points attribués automatiquement selon les variables collectées (ex: Ancienneté &ge; 24 mois &rarr; 4 pts)
              </p>
            </div>
            <button
              onClick={() => {
                const nom = prompt("Nom du critère :");
                const condition = prompt("Condition (ex: >= 60 mois) :");
                if (nom && condition) {
                  updateActiveConfig((prev) => ({
                    ...prev,
                    criteres_analyse: [
                      ...prev.criteres_analyse,
                      { id: `ca-${Date.now()}`, nom, variable: "auto", condition, points: 2, maximum: 2 },
                    ],
                  }));
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter critère</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeConfig.criteres_analyse.map((ca) => (
              <div
                key={ca.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{ca.nom}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Variable : <span className="font-mono text-indigo-600">{ca.variable}</span> · Condition : <span className="font-mono font-bold text-slate-700">{ca.condition}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {ca.points} / {ca.maximum} pts
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      updateActiveConfig((prev) => ({
                        ...prev,
                        criteres_analyse: prev.criteres_analyse.filter((c) => c.id !== ca.id),
                      }))
                    }
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIROIR LATÉRAL : AJOUTER UNE DONNÉE (EXISTANTE OU NOUVELLE)
      ========================================================================= */}
      {isAddDataDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Header Drawer */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ajouter une donnée</h3>
                <p className="text-xs text-slate-500">
                  Dans la section sélectionnée de cette configuration
                </p>
              </div>
              <button
                onClick={() => setIsAddDataDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Mode : Donnée existante vs Nouvelle donnée */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <button
                onClick={() => setAddMode("existante")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  addMode === "existante"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Utiliser une donnée existante
              </button>
              <button
                onClick={() => setAddMode("nouvelle")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  addMode === "nouvelle"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Créer une nouvelle donnée
              </button>
            </div>

            {/* Corps du Drawer */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              {addMode === "existante" ? (
                /* Liste des données existantes dans le dictionnaire */
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Rechercher par libellé ou code..."
                      value={searchExisting}
                      onChange={(e) => setSearchExisting(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-2">
                    {champsGlobaux
                      .filter(
                        (c) =>
                          c.libelle.toLowerCase().includes(searchExisting.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchExisting.toLowerCase())
                      )
                      .map((c) => (
                        <div
                          key={c.code}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 transition-all"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900">
                              {c.libelle}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                              <span className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                                {c.code}
                              </span>
                              <span>·</span>
                              <span>{c.type_donnee}</span>
                              <span>·</span>
                              <span>{c.categorie}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddExistingFieldToSection(c.code)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all"
                          >
                            Ajouter
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                /* Formulaire de création d'une nouvelle donnée avec les 6 dimensions */
                <form onSubmit={handleCreateAndAttachNewField} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Libellé de la donnée *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Distance jusqu'au marché"
                      value={nouvelleDonnee.libelle}
                      onChange={(e) => {
                        const lib = e.target.value;
                        const codeAuto = lib
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .replace(/[^a-z0-9_]/g, "_")
                          .replace(/_+/g, "_")
                          .slice(0, 32);
                        setNouvelleDonnee({ ...nouvelleDonnee, libelle: lib, code: codeAuto });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Code technique *
                      </label>
                      <input
                        type="text"
                        required
                        value={nouvelleDonnee.code}
                        onChange={(e) =>
                          setNouvelleDonnee({ ...nouvelleDonnee, code: e.target.value })
                        }
                        className="w-full font-mono bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Unité (ex: km, FCFA, ha)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: km"
                        value={nouvelleDonnee.unite}
                        onChange={(e) =>
                          setNouvelleDonnee({ ...nouvelleDonnee, unite: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Les 6 dimensions */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                      Classification & Rôle Analytique
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Catégorie métier
                        </label>
                        <select
                          value={nouvelleDonnee.categorie}
                          onChange={(e) =>
                            setNouvelleDonnee({
                              ...nouvelleDonnee,
                              categorie: e.target.value as CategorieMetier,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                        >
                          <option value="IDENTIFICATION">IDENTIFICATION</option>
                          <option value="ACTIVITE">ACTIVITÉ</option>
                          <option value="FINANCIER">FINANCIER</option>
                          <option value="MENAGE">MÉNAGE</option>
                          <option value="MARCHE">MARCHÉ</option>
                          <option value="GARANTIE">GARANTIE</option>
                          <option value="HISTORIQUE">HISTORIQUE</option>
                          <option value="GEOGRAPHIQUE">GÉOGRAPHIQUE</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Type de donnée
                        </label>
                        <select
                          value={nouvelleDonnee.type_donnee}
                          onChange={(e) =>
                            setNouvelleDonnee({
                              ...nouvelleDonnee,
                              type_donnee: e.target.value as TypeDonnee,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                        >
                          <option value="TEXTE">TEXTE</option>
                          <option value="ENTIER">ENTIER</option>
                          <option value="DECIMAL">DÉCIMAL</option>
                          <option value="MONTANT">MONTANT (FCFA)</option>
                          <option value="DATE">DATE</option>
                          <option value="CHOIX_SIMPLE">CHOIX SIMPLE</option>
                          <option value="BOOLEEN">BOOLÉEN</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Temporalité
                        </label>
                        <select
                          value={nouvelleDonnee.temporalite}
                          onChange={(e) =>
                            setNouvelleDonnee({
                              ...nouvelleDonnee,
                              temporalite: e.target.value as Temporalite,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                        >
                          <option value="STATIQUE">STATIQUE</option>
                          <option value="VALEUR_ACTUELLE">VALEUR ACTUELLE</option>
                          <option value="PERIODE">PÉRIODE</option>
                          <option value="EVENEMENT">ÉVÉNEMENT</option>
                          <option value="PHOTOGRAPHIE_T0">PHOTOGRAPHIE T0</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Rôle analytique
                        </label>
                        <select
                          value={nouvelleDonnee.role_analytique}
                          onChange={(e) =>
                            setNouvelleDonnee({
                              ...nouvelleDonnee,
                              role_analytique: e.target.value as RoleAnalytique,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                        >
                          <option value="VARIABLE_CANDIDATE">VARIABLE CANDIDATE</option>
                          <option value="IDENTIFICATION_SEULE">IDENTIFICATION SEULE</option>
                          <option value="SEGMENTATION">SEGMENTATION</option>
                          <option value="ENTREE_REGLE">ENTRÉE RÈGLE</option>
                          <option value="PREUVE_SEULE">PREUVE SEULE</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Cas spécifique GÉOGRAPHIQUE */}
                  {nouvelleDonnee.categorie === "GEOGRAPHIQUE" && (
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-900">
                          Spécificités Donnée Géographique
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                            Granularité
                          </label>
                          <select
                            value={nouvelleDonnee.granularite_geo}
                            onChange={(e) =>
                              setNouvelleDonnee({
                                ...nouvelleDonnee,
                                granularite_geo: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-indigo-300 rounded-xl px-2.5 py-1.5 text-xs text-indigo-900 focus:outline-none"
                          >
                            <option value="PAYS">PAYS</option>
                            <option value="REGION">RÉGION</option>
                            <option value="CERCLE">CERCLE</option>
                            <option value="COMMUNE">COMMUNE</option>
                            <option value="QUARTIER">QUARTIER / VILLAGE</option>
                            <option value="COORDONNEE_GPS">COORDONNÉES GPS</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                            Modèle statistique
                          </label>
                          <div className="px-2.5 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-rose-700">
                            NON (RGPD / Éthique)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Usages autorisés */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      Usages Autorisés
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={nouvelleDonnee.usages.affichage}
                          onChange={(e) =>
                            setNouvelleDonnee({
                              ...nouvelleDonnee,
                              usages: { ...nouvelleDonnee.usages, affichage: e.target.checked },
                            })
                          }
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                        <span>Affichage</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={nouvelleDonnee.usages.collecte}
                          onChange={(e) =>
                            setNouvelleDonnee({
                              ...nouvelleDonnee,
                              usages: { ...nouvelleDonnee.usages, collecte: e.target.checked },
                            })
                          }
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                        <span>Collecte</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={nouvelleDonnee.usages.calcul_derive}
                          onChange={(e) =>
                            setNouvelleDonnee({
                              ...nouvelleDonnee,
                              usages: { ...nouvelleDonnee.usages, calcul_derive: e.target.checked },
                            })
                          }
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                        <span>Calcul dérivé</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={nouvelleDonnee.usages.reporting}
                          onChange={(e) =>
                            setNouvelleDonnee({
                              ...nouvelleDonnee,
                              usages: { ...nouvelleDonnee.usages, reporting: e.target.checked },
                            })
                          }
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                        <span>Reporting</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddDataDrawerOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Créer et attacher à la section
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL APERÇU DU FORMULAIRE EN DIRECT
      ========================================================================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Header Aperçu */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Aperçu Temps Réel
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Profil : {activeConfig.profil_code} · Produit : {activeConfig.produit_code}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {activeConfig.nom}
                </h3>
              </div>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu Formulaire Agent généré dynamiquement */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-medium">
                Voici exactement ce que l'agent de crédit voit sur sa tablette ou son poste lors de la saisie d'un nouveau dossier.
              </div>

              {activeConfig.sections.map((sec) => {
                if (sec.champ_codes.length === 0) return null;

                return (
                  <div key={sec.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        {sec.titre}
                      </span>
                      <p className="text-[11px] text-slate-500">{sec.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sec.champ_codes.map((code) => {
                        const def = champsGlobaux.find((c) => c.code === code) || {
                          code,
                          libelle: code,
                          type_donnee: "TEXTE",
                          obligatoire: false,
                        };

                        return (
                          <div key={code} className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700">
                              {def.libelle}{" "}
                              {def.obligatoire && <span className="text-rose-600">*</span>}
                            </label>

                            <input
                              type={
                                def.type_donnee === "MONTANT" || def.type_donnee === "ENTIER" || def.type_donnee === "DECIMAL"
                                  ? "number"
                                  : def.type_donnee === "DATE"
                                  ? "date"
                                  : "text"
                              }
                              placeholder={`Saisir ${def.libelle}...`}
                              value={previewValues[code] || ""}
                              onChange={(e) =>
                                setPreviewValues({ ...previewValues, [code]: e.target.value })
                              }
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Aperçu */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Fermer l'aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
