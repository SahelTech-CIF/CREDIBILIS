import React from "react";
import {
  Building2,
  Plus,
  Search,
  Filter,
  ArrowUpRight
} from "lucide-react";

interface DossierItem {
  id: string;
  numero_compte: string;
  raison_sociale: string;
  forme_juridique: string;
  activite: string;
  montant_demande: number;
  duree_mois: number;
  score: number;
  statut_scoring: "FAVORABLE" | "A_EXAMINER" | "REJET_RECOMMANDE";
  statut_workflow: "BROUILLON" | "INSTRUCTION" | "COMITE" | "ACCORDE";
  date: string;
}

interface ListeProps {
  onNouveauDossier: () => void;
  onOuvrirDossier: (id: string) => void;
}

export const ListeDossiersEntreprises: React.FC<ListeProps> = ({
  onNouveauDossier,
  onOuvrirDossier,
}) => {
  const dossiers: DossierItem[] = [
    {
      id: "KJ-ENT-2026-001",
      numero_compte: "KJ-2026-ENT-0492",
      raison_sociale: "Société Sahélienne de Distribution (SODIS SARL)",
      forme_juridique: "SARL",
      activite: "Commerce de gros céréales & intrants",
      montant_demande: 15000000,
      duree_mois: 24,
      score: 84.8,
      statut_scoring: "FAVORABLE",
      statut_workflow: "COMITE",
      date: "2026-09-22",
    },
    {
      id: "KJ-ENT-2026-002",
      numero_compte: "KJ-2026-ENT-0118",
      raison_sociale: "Boulangerie Moderne de Sévaré (BMS ETS)",
      forme_juridique: "ETS",
      activite: "Boulangerie & Pâtisserie artisanale",
      montant_demande: 6000000,
      duree_mois: 12,
      score: 72.4,
      statut_scoring: "A_EXAMINER",
      statut_workflow: "INSTRUCTION",
      date: "2026-09-20",
    },
    {
      id: "KJ-ENT-2026-003",
      numero_compte: "KJ-2026-ENT-0087",
      raison_sociale: "Complexe Avicole du Bani (CAB GIE)",
      forme_juridique: "GIE",
      activite: "Élevage avicole & ponte",
      montant_demande: 8500000,
      duree_mois: 18,
      score: 64.2,
      statut_scoring: "REJET_RECOMMANDE",
      statut_workflow: "INSTRUCTION",
      date: "2026-09-18",
    },
    {
      id: "KJ-ENT-2026-004",
      numero_compte: "KJ-2026-ENT-0322",
      raison_sociale: "Transport & Logistique du Delta (TLD SAS)",
      forme_juridique: "SAS",
      activite: "Transport fluvial et routier de fret",
      montant_demande: 25000000,
      duree_mois: 36,
      score: 88.5,
      statut_scoring: "FAVORABLE",
      statut_workflow: "ACCORDE",
      date: "2026-09-15",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Portefeuille Dossiers Entreprises & Personnes Morales
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              KAFO JIGINEW Mopti
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestion des adhésions sociétaires, demandes de crédit PME et grilles d'évaluation institutionnelles
          </p>
        </div>

        <button
          onClick={onNouveauDossier}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Dossier Entreprise</span>
        </button>
      </div>

      {/* Barre de filtre et recherche */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer par raison sociale, RCCM, compte..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            <span>Tous les statuts</span>
          </button>
        </div>
      </div>

      {/* Tableau des dossiers */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Raison Sociale & Compte</th>
              <th className="py-3 px-4">Activité & Forme</th>
              <th className="py-3 px-4">Montant Demandé</th>
              <th className="py-3 px-4 text-center">Score Kafo (/100)</th>
              <th className="py-3 px-4">Statut Workflow</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {dossiers.map((d) => (
              <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{d.raison_sociale}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{d.numero_compte}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <p className="text-slate-200 font-medium">{d.activite}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono mt-0.5">
                    {d.forme_juridique}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-bold font-mono text-amber-300">
                    {d.montant_demande.toLocaleString()} FCFA
                  </p>
                  <p className="text-[11px] text-slate-400">{d.duree_mois} mois</p>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="font-black font-mono text-sm text-white">{d.score}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 border ${
                        d.statut_scoring === "FAVORABLE"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : d.statut_scoring === "A_EXAMINER"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      {d.statut_scoring === "FAVORABLE" && "Favorable"}
                      {d.statut_scoring === "A_EXAMINER" && "À Examiner"}
                      {d.statut_scoring === "REJET_RECOMMANDE" && "Rejet (<70)"}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      d.statut_workflow === "ACCORDE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : d.statut_workflow === "COMITE"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{d.statut_workflow}</span>
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onOuvrirDossier(d.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                  >
                    <span>Instruire</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
