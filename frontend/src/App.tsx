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
import { StudioConfigView } from "./features/studio/StudioConfigView";
import { CollecteDynamiqueView } from "./features/studio/CollecteDynamiqueView";
import { DossierDetailView } from "./features/studio/DossierDetailView";
import { ConfigurationCreditView, type ConfigCredit } from "./features/studio/ConfigurationCreditView";
import {
  initialProfils,
  initialProduits,
  initialSections,
  initialChamps,
} from "./features/studio/studioInitialData";
import type {
  DefinitionChamp,
  DossierCollecte,
} from "./features/studio/studioTypes";

export function App() {
  const [currentMode, setMode] = useState<WorkspaceMode>("decision");
  const [activeSubTab, setActiveSubTab] = useState<string>("config_credit");

  // État vivant de la configuration de l'institution (No-Code Studio)
  const [profils] = useState(initialProfils);
  const [produits] = useState(initialProduits);
  const [sections] = useState(initialSections);
  const [champs, setChamps] = useState<DefinitionChamp[]>(initialChamps);
  const [targetProfilForCollecte, setTargetProfilForCollecte] = useState<string>("AGRICULTEUR");
  const [dernierDossier, setDernierDossier] = useState<DossierCollecte | null>(null);

  const handleSelectTabFromDashboard = (tab: string) => {
    if (tab === "decision" || tab === "config_credit") {
      setMode("decision");
      setActiveSubTab("config_credit");
    } else if (tab === "collecte" || tab === "imports" || tab === "matching") {
      setMode("collecte");
      setActiveSubTab(tab);
    } else {
      setMode("dashboard");
      setActiveSubTab("dashboard");
    }
  };

  const handleAddChamp = (nouveauChamp: DefinitionChamp) => {
    setChamps((prev) => [...prev, nouveauChamp]);
  };

  const handleUpdateChamps = (updatedChamps: DefinitionChamp[]) => {
    setChamps(updatedChamps);
  };

  const handleTestCollecteFromStudio = (profilCode: string) => {
    setTargetProfilForCollecte(profilCode);
    setMode("collecte");
    setActiveSubTab("collecte_dynamique");
  };

  const handleLancerCollecteFromConfig = (config: ConfigCredit) => {
    setTargetProfilForCollecte(config.profil_code);
    setMode("collecte");
    setActiveSubTab("collecte_dynamique");
  };

  const handleDossierValide = (dossier: DossierCollecte) => {
    setDernierDossier(dossier);
    setActiveSubTab("dossier_detail");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* 1. Barre de navigation latérale professionnelle (Sidebar - Thème Clair) */}
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

            {/* Espace Collecte & Données (Rôle 04 / Agent de crédit) */}
            {currentMode === "collecte" && (
              <>
                {/* V0 : Moteur de Collecte Dynamique */}
                {activeSubTab === "collecte_dynamique" && (
                  <CollecteDynamiqueView
                    profils={profils}
                    produits={produits}
                    sections={sections}
                    champs={champs}
                    initialProfilCode={targetProfilForCollecte}
                    onDossierValide={handleDossierValide}
                  />
                )}

                {/* V0 : Détail du dossier collecté & provenance */}
                {activeSubTab === "dossier_detail" && dernierDossier && (
                  <DossierDetailView
                    dossier={dernierDossier}
                    champs={champs}
                    onRetour={() => setActiveSubTab("collecte_dynamique")}
                  />
                )}

                {/* Dossiers d'Instruction Entreprises & Fiches PME */}
                {activeSubTab === "dossiers_pme" && (
                  <ListeDossiersEntreprises
                    onNouveauDossier={() => {
                      setTargetProfilForCollecte("PME");
                      setActiveSubTab("collecte_dynamique");
                    }}
                    onOuvrirDossier={() => setActiveSubTab("entreprises_wizard")}
                  />
                )}

                {activeSubTab === "entreprises_wizard" && (
                  <WizardCollecteEntreprise
                    onComplete={() => setActiveSubTab("dossiers_pme")}
                  />
                )}
                {activeSubTab === "collecte" && <WizardView />}
                {activeSubTab === "imports" && <ImportView />}
                {activeSubTab === "matching" && <MatchingView />}
              </>
            )}

            {/* Espace Studio de Configuration (No-Code Administrateur / Décision) */}
            {currentMode === "decision" && (
              <>
                {/* Écran Principal V0 : Configuration Crédit (5 Onglets + Aperçu) */}
                {activeSubTab === "config_credit" && (
                  <ConfigurationCreditView
                    champsGlobaux={champs}
                    onAjouterChampGlobal={handleAddChamp}
                    onLancerCollecte={handleLancerCollecteFromConfig}
                  />
                )}

                {/* Dictionnaire des données & Profils */}
                {activeSubTab === "studio_config" && (
                  <StudioConfigView
                    profils={profils}
                    sections={sections}
                    champs={champs}
                    produits={produits}
                    onUpdateChamps={handleUpdateChamps}
                    onAddChamp={handleAddChamp}
                    onSelectProfilForCollecte={handleTestCollecteFromStudio}
                  />
                )}

                {/* Comité Décision & Grille Kafo /100 */}
                {activeSubTab === "decision" && <DecisionView />}
              </>
            )}
          </div>
        </main>

        {/* Footer discret */}
        <footer className="h-10 border-t border-slate-200 bg-white px-6 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CREDIBILIS</span>
            <span>•</span>
            <span>Plateforme Décentralisée d'Inclusion Financière (UEMOA)</span>
          </div>
          <div>
            Architecture Hexagonale Découplée • Thème Institutionnel Clair
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
