import React from "react";
import {
  UploadCloud,
  Users,
  ShieldCheck,
  Scale,
  LayoutDashboard,
  Sliders,
  Sparkles,
  ChevronRight,
  Database,
  FolderKanban
} from "lucide-react";

export type WorkspaceMode = "collecte" | "decision" | "dashboard";

interface SidebarProps {
  currentMode: WorkspaceMode;
  setMode: (mode: WorkspaceMode) => void;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMode,
  setMode,
  activeSubTab,
  setActiveSubTab,
}) => {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen select-none shadow-sm z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900">
                CREDIBILIS
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                CIF 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Studio de Collecte & Décision
            </p>
          </div>
        </div>

        {/* Espace Switcher : Segmented Control */}
        <div className="mt-4 p-1 bg-slate-100 rounded-xl border border-slate-200 grid grid-cols-2 gap-1 text-xs">
          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("collecte_dynamique");
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-semibold transition-all ${
              currentMode === "collecte"
                ? "bg-white text-emerald-800 font-bold shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Collecte</span>
          </button>

          <button
            onClick={() => {
              setMode("decision");
              setActiveSubTab("config_credit");
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-semibold transition-all ${
              currentMode === "decision"
                ? "bg-white text-indigo-800 font-bold shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>2. Studio</span>
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Vue Dashboard */}
        <div>
          <button
            onClick={() => {
              setMode("dashboard");
              setActiveSubTab("dashboard");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentMode === "dashboard"
                ? "bg-slate-900 text-white shadow-sm font-bold"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Tableau de Bord</span>
            </div>
            {currentMode === "dashboard" && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* SECTION 1 : COLLECTE & DOSSIERS (Agent) */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Collecte de Terrain</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("collecte_dynamique");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === "collecte" && activeSubTab === "collecte_dynamique"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Saisie Terrain Dynamique</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
              No-Code
            </span>
          </button>

          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("dossiers_pme");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === "collecte" && activeSubTab === "dossiers_pme"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderKanban className="w-4 h-4 text-slate-500" />
              <span>Dossiers d'Instruction</span>
            </div>
          </button>

          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("imports");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === "collecte" && activeSubTab === "imports"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UploadCloud className="w-4 h-4 text-slate-500" />
              <span>Imports & Qualité 5D</span>
            </div>
          </button>

          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("matching");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === "collecte" && activeSubTab === "matching"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Rapprochement Identités</span>
            </div>
          </button>
        </div>

        {/* SECTION 2 : CONFIGURATION & STUDIO (Admin / Responsable) */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Studio de Configuration</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          </div>

          <button
            onClick={() => {
              setMode("decision");
              setActiveSubTab("config_credit");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === "config_credit"
                ? "bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <div className="text-left">
                <span className="block font-bold">Configuration Crédit</span>
                <span className="text-[10px] text-indigo-600 font-normal">
                  Écran principal V0
                </span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded">
              5 Onglets
            </span>
          </button>

          <button
            onClick={() => {
              setMode("decision");
              setActiveSubTab("studio_config");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === "studio_config"
                ? "bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-slate-500" />
              <span>Dictionnaire des Données</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">6 Dim</span>
          </button>

          <button
            onClick={() => {
              setMode("decision");
              setActiveSubTab("decision");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === "decision"
                ? "bg-amber-50 text-amber-800 border border-amber-200 font-bold shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Cadres d'Analyse /100</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
              Kafo
            </span>
          </button>
        </div>
      </div>

      {/* Footer Institution / Sync Status */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></div>
            <div>
              <p className="text-xs font-bold text-slate-900">KAFO JIGINEW</p>
              <p className="text-[10px] text-slate-500">Moteur de Collecte Actif</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
            v0.9.4
          </span>
        </div>
      </div>
    </aside>
  );
};
