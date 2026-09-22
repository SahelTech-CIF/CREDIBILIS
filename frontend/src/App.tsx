import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { DashboardView } from "./features/dashboard/DashboardView";
import { DecisionView } from "./features/dossiers/DecisionView";
import { ImportView } from "./features/imports/ImportView";
import { MatchingView } from "./features/rapprochement/MatchingView";
import { WizardView } from "./features/collecte/WizardView";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Barre de navigation globale */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenu principal selon l'onglet actif */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <DashboardView onSelectTab={setActiveTab} />}
        {activeTab === "decision" && <DecisionView />}
        {activeTab === "imports" && <ImportView />}
        {activeTab === "matching" && <MatchingView />}
        {activeTab === "collecte" && <WizardView />}
      </main>

      {/* Pied de page institutionnel */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CREDIBILIS</span>
            <span>•</span>
            <span>Hackathon CIF 2026</span>
            <span>•</span>
            <span className="text-emerald-500">Moteur Décisionnel Découplé</span>
          </div>
          <div>
            Architecture Hexagonale pure Python + React SPA • Conforme à la Constitution AGENTS.md
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
