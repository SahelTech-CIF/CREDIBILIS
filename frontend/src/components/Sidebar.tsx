import React from "react";
import {
  FileText,
  UploadCloud,
  Users,
  ShieldCheck,
  Scale,
  LayoutDashboard,
  Sliders,
  Sparkles,
  Building2,
  ChevronRight,
  Database,
  CheckCircle2
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
    <aside className="w-72 bg-[#090D16]/95 border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen select-none backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CREDIBILIS
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CIF 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Micro-crédit éthique & inclusion
            </p>
          </div>
        </div>

        {/* Espace Switcher : Segmented Control ultra stylé */}
        <div className="mt-5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/90 grid grid-cols-2 gap-1 text-xs">
          <button
            onClick={() => {
              setMode("collecte");
              if (!["collecte", "imports", "matching"].includes(activeSubTab)) {
                setActiveSubTab("collecte");
              }
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-semibold transition-all duration-200 ${
              currentMode === "collecte"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. Collecte</span>
          </button>

          <button
            onClick={() => {
              setMode("decision");
              if (!["decision", "audit"].includes(activeSubTab)) {
                setActiveSubTab("decision");
              }
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-semibold transition-all duration-200 ${
              currentMode === "decision"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>2. Décision</span>
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Vue Générale */}
        <div>
          <button
            onClick={() => {
              setMode("dashboard");
              setActiveSubTab("dashboard");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentMode === "dashboard"
                ? "bg-slate-800/80 text-white border border-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-4 h-4 ${currentMode === "dashboard" ? "text-emerald-400" : "text-slate-400"}`} />
              <span>Tableau de Bord Exécutif</span>
            </div>
            {currentMode === "dashboard" && <ChevronRight className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Section 1 : Espace Collecte & Données */}
        <div className="space-y-1">
          <div className="px-3.5 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Espace Collecte Terrain & Données</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Rôle 04</span>
          </div>

          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("entreprises_liste");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentMode === "collecte" && (activeSubTab === "entreprises_liste" || activeSubTab === "entreprises_wizard")
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Dossiers Entreprises (PME)</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">Nouveau</span>
          </button>

          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("collecte");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentMode === "collecte" && activeSubTab === "collecte"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Saisie Terrain (Particuliers)</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">10 étapes</span>
          </button>

          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("imports");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentMode === "collecte" && activeSubTab === "imports"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Import Excel/CSV & Qualité 5D</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono">94.6%</span>
          </button>

          <button
            onClick={() => {
              setMode("collecte");
              setActiveSubTab("matching");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentMode === "collecte" && activeSubTab === "matching"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Dé-doublonnage & Entités</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold">1 en attente</span>
          </button>
        </div>

        {/* Section 2 : Espace Analyse Risque & Comité de Décision */}
        <div className="space-y-1">
          <div className="px-3.5 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Espace Analyse & Décision</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Rôle 05</span>
          </div>

          <button
            onClick={() => {
              setMode("decision");
              setActiveSubTab("decision");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentMode === "decision" && activeSubTab === "decision"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-inner font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Comité de Crédit & Vue 360°</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Bühlmann</span>
          </button>

          <button
            onClick={() => {
              setMode("decision");
              setActiveSubTab("decision");
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              false
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Simulateur & Offres Éthiques</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
          </button>
        </div>
      </div>

      {/* Footer Institution & Context */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/70 space-y-3">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">
              KAFO JIGINEW
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              Agence Régionale • Mopti
            </p>
          </div>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Moteur Python Découplé</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">v1.2.0-rc</span>
        </div>
      </div>
    </aside>
  );
};
