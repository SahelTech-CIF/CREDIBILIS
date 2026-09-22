import {
  Search,
  Bell,
  ChevronRight,
  Activity
} from "lucide-react";
import type { WorkspaceMode } from "./Sidebar";

interface TopHeaderProps {
  currentMode: WorkspaceMode;
  activeSubTab: string;
  setMode: (mode: WorkspaceMode) => void;
  setActiveSubTab: (subTab: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentMode,
  activeSubTab,
  setMode,
  setActiveSubTab,
}) => {
  // Déterminer le titre et fil d'ariane contextuel
  const getBreadcrumb = () => {
    if (currentMode === "dashboard") {
      return { root: "Vue d'ensemble", leaf: "Tableau de Bord Exécutif" };
    }
    if (currentMode === "collecte") {
      if (activeSubTab === "collecte") return { root: "Espace Collecte", leaf: "Saisie Terrain Dynamique (PME & Salarié)" };
      if (activeSubTab === "imports") return { root: "Espace Collecte", leaf: "Import Fichiers Institutionnels & Qualité 5D" };
      if (activeSubTab === "matching") return { root: "Espace Collecte", leaf: "Console de Rapprochement & Dé-doublonnage" };
    }
    if (currentMode === "decision") {
      return { root: "Espace Décision", leaf: "Comité de Risque & Client 360° (Bühlmann-Straub)" };
    }
    return { root: "CREDIBILIS", leaf: "Tableau de Bord" };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Fil d'ariane */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 font-medium">{breadcrumb.root}</span>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-slate-100 font-semibold flex items-center gap-2">
          {breadcrumb.leaf}
          {currentMode === "collecte" && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Mode Terrain
            </span>
          )}
          {currentMode === "decision" && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Mode Comité
            </span>
          )}
        </span>
      </div>

      {/* Barre d'outils et Profil */}
      <div className="flex items-center gap-4">
        {/* Recherche rapide */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher dossier, NINA, client..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Quick Mode Toggle Pill */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("collecte");
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              currentMode === "collecte"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Collecte
          </button>
          <button
            onClick={() => {
              setMode("decision");
              setActiveSubTab("decision");
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              currentMode === "decision"
                ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Comité Décision
          </button>
        </div>

        {/* Statut Réseau / Institution */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">API Connectée</span>
        </div>

        {/* Cloche Notification */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
        </button>

        {/* Séparateur */}
        <div className="h-6 w-[1px] bg-slate-800"></div>

        {/* Profil actif */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-xs text-white shadow-sm ring-1 ring-white/20">
            MT
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200">Moussa Traoré</p>
            <p className="text-[10px] text-slate-400">Agent Senior • IMF</p>
          </div>
        </div>
      </div>
    </header>
  );
};
