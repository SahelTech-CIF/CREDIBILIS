import { useState } from "react";
import { Sidebar, type WorkspaceMode } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import { DashboardView } from "./features/dashboard/DashboardView";
import { DecisionView } from "./features/dossiers/DecisionView";
import { ImportView } from "./features/imports/ImportView";
import { MatchingView } from "./features/rapprochement/MatchingView";
import { WizardView } from "./features/collecte/WizardView";
import { ListeDossiersEntreprises } from "./features/entreprises/ListeDossiersEntreprises";
import { WizardCollecteEntreprise } from "./features/entreprises/WizardCollecteEntreprise";

export function App() {
  const [currentMode, setMode] = useState<WorkspaceMode>("collecte");
  const [activeSubTab, setActiveSubTab] = useState<string>("entreprises_liste");

  const handleSelectTabFromDashboard = (tab: string) => {
    if (tab === "decision") {
      setMode("decision");
      setActiveSubTab("decision");
    } else if (tab === "collecte" || tab === "imports" || tab === "matching") {
      setMode("collecte");
      setActiveSubTab(tab);
    } else {
      setMode("dashboard");
      setActiveSubTab("dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#070B12] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. Barre de navigation latérale professionnelle (Sidebar) */}
      <Sidebar
        currentMode={currentMode}
        setMode={setMode}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {/* 2. Zone de contenu principale */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header sticky */}
        <TopHeader
          currentMode={currentMode}
          activeSubTab={activeSubTab}
          setMode={setMode}
          setActiveSubTab={setActiveSubTab}
        />

        {/* Espace de travail avec scroll autonome */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Vue Dashboard */}
            {currentMode === "dashboard" && (
              <DashboardView onSelectTab={handleSelectTabFromDashboard} />
            )}

            {/* Espace Collecte & Données (Rôle 04) */}
            {currentMode === "collecte" && (
              <>
                {activeSubTab === "entreprises_liste" && (
                  <ListeDossiersEntreprises
                    onNouveauDossier={() => setActiveSubTab("entreprises_wizard")}
                    onOuvrirDossier={() => setActiveSubTab("entreprises_wizard")}
                  />
                )}
                {activeSubTab === "entreprises_wizard" && (
                  <WizardCollecteEntreprise
                    onComplete={() => setActiveSubTab("entreprises_liste")}
                  />
                )}
                {activeSubTab === "collecte" && <WizardView />}
                {activeSubTab === "imports" && <ImportView />}
                {activeSubTab === "matching" && <MatchingView />}
              </>
            )}

            {/* Espace Analyse Risque & Comité de Décision (Rôle 05) */}
            {currentMode === "decision" && (
              <DecisionView />
            )}
          </div>
        </main>

        {/* Footer discret */}
        <footer className="h-10 border-t border-slate-900 bg-[#090D16]/90 px-6 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CREDIBILIS</span>
            <span>•</span>
            <span>Plateforme Décentralisée d'Inclusion Financière (UEMOA)</span>
          </div>
          <div>
            Architecture Hexagonale Découplée • Constitution AGENTS.md respectée
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
