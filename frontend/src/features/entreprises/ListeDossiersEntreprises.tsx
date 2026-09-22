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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Portefeuille Dossiers Entreprises & Personnes Morales
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              KAFO JIGINEW Mopti
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des adhésions sociétaires, demandes de crédit PME et grilles d'évaluation institutionnelles
          </p>
        </div>

        <button
          onClick={onNouveauDossier}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Dossier Entreprise</span>
        </button>
      </div>

      {/* Barre de filtre et recherche */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer par raison sociale, RCCM, compte..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Tous les statuts</span>
          </button>
        </div>
      </div>

      {/* Tableau des dossiers */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4">Raison Sociale & Compte</th>
              <th className="py-3 px-4">Activité & Forme</th>
              <th className="py-3 px-4">Montant Demandé</th>
              <th className="py-3 px-4 text-center">Score Kafo (/100)</th>
              <th className="py-3 px-4">Statut Workflow</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dossiers.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{d.raison_sociale}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{d.numero_compte}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <p className="text-slate-800 font-medium">{d.activite}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono mt-0.5">
                    {d.forme_juridique}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-bold font-mono text-slate-900">
                    {d.montant_demande.toLocaleString()} FCFA
                  </p>
                  <p className="text-[11px] text-slate-500">{d.duree_mois} mois</p>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="font-black font-mono text-sm text-slate-900">{d.score}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 border ${
                        d.statut_scoring === "FAVORABLE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : d.statut_scoring === "A_EXAMINER"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
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
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      d.statut_workflow === "ACCORDE"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : d.statut_workflow === "COMITE"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{d.statut_workflow}</span>
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onOuvrirDossier(d.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
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
