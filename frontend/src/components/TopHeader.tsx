import React from "react";
import {
  Search,
  Bell,
  ChevronRight,
  Activity,
  Sliders,
  Database
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
    if (activeSubTab === "config_credit") {
      return { root: "Studio de Configuration", leaf: "Configuration Crédit (Constructeur No-Code)" };
    }
    if (activeSubTab === "studio_config") {
      return { root: "Studio de Configuration", leaf: "Dictionnaire des Données & Profils (6 Dimensions)" };
    }
    if (activeSubTab === "collecte_dynamique") {
      return { root: "Espace Collecte", leaf: "Saisie Terrain Agent (Génération Dynamique)" };
    }
    if (activeSubTab === "dossiers_pme") {
      return { root: "Espace Collecte", leaf: "Dossiers d'Instruction & Audit Métier" };
    }
    if (activeSubTab === "imports") {
      return { root: "Espace Collecte", leaf: "Import Fichiers Institutionnels & Qualité 5D" };
    }
    if (activeSubTab === "matching") {
      return { root: "Espace Collecte", leaf: "Console de Rapprochement & Dé-doublonnage" };
    }
    if (currentMode === "decision" || activeSubTab === "decision") {
      return { root: "Espace Décision", leaf: "Comité de Risque & Client 360° (Grille Kafo /100)" };
    }
    return { root: "CREDIBILIS", leaf: "Tableau de Bord Exécutif" };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Fil d'ariane */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500 font-medium">{breadcrumb.root}</span>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="text-slate-900 font-bold flex items-center gap-2">
          {breadcrumb.leaf}
          {currentMode === "collecte" && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Mode Agent
            </span>
          )}
          {currentMode === "decision" && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Mode Studio
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
            placeholder="Rechercher configuration, dossier..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Quick Mode Toggle Pill */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("collecte_dynamique");
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              currentMode === "collecte"
                ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database className="w-3 h-3 text-emerald-600" />
            <span>1. Collecte</span>
          </button>
          <button
            onClick={() => {
              setMode("decision");
              setActiveSubTab("config_credit");
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              currentMode === "decision"
                ? "bg-white text-indigo-800 font-bold shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3 h-3 text-indigo-600" />
            <span>2. Studio</span>
          </button>
        </div>

        {/* Sync & Notifications */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Moteur Prêt</span>
          </div>

          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">Amadou DIARRA</p>
              <p className="text-[10px] text-slate-500 font-medium">Chef de Service Crédit</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
