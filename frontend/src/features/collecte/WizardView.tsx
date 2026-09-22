import React, { useState } from "react";
import { formatFCFA } from "../../lib/utils";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Building2, 
  Briefcase, 
  UserCheck, 
  FileText, 
  CheckCircle2 
} from "lucide-react";

export const WizardView: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profilType, setProfilType] = useState<"PME" | "SALARIE">("PME");
  const [autoSavedTime, setAutoSavedTime] = useState<string>("15:14");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form state
  const [nom, setNom] = useState<string>("Oumar Traoré");
  const [telephone, setTelephone] = useState<string>("76 45 89 12");
  const [revenu, setRevenu] = useState<number>(450000);
  const [charges, setCharges] = useState<number>(110000);
  const [montant, setMontant] = useState<number>(500000);
  const [duree, setDuree] = useState<number>(12);

  // Autosave simulé lors d'un changement
  const triggerAutoSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setAutoSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 600);
  };

  const steps = [
    { num: 1, title: "Identité", desc: "État civil & contact" },
    { num: 2, title: "Consentement", desc: "Accord légal RGPD/UEMOA" },
    { num: 3, title: "Ménage", desc: "Charges de famille" },
    { num: 4, title: profilType === "PME" ? "Activité PME" : "Emploi Salarié", desc: "Source de revenu" },
    { num: 5, title: "Revenus & Charges", desc: "Bilan simplifié" },
    { num: 6, title: "Engagements", desc: "Dettes & tontines" },
    { num: 7, title: "Demande de Crédit", desc: "Montant & durée" },
    { num: 8, title: "Garanties", desc: "Cautions & nantissements" },
    { num: 9, title: "Documents", desc: "Justificatifs" },
    { num: 10, title: "Vérification", desc: "Audit trail & envoi" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            Collecte Dynamique Terrain
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Instruction de Dossier de Crédit</h1>
          <p className="text-xs text-slate-400 mt-1">
            Formulaire adaptatif PME / Salarié avec autosave transparent en tâche de fond.
          </p>
        </div>

        {/* Bascule de profil dynamique */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setProfilType("PME")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                profilType === "PME"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> PME / Commerce
            </button>
            <button
              onClick={() => setProfilType("SALARIE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                profilType === "SALARIE"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Salarié Domicilié
            </button>
          </div>

          {/* Témoin d'Autosave */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <Save className={`w-3.5 h-3.5 ${isSaving ? "animate-spin text-amber-400" : "text-emerald-400"}`} />
            <span>{isSaving ? "Sauvegarde..." : `✓ Enregistré à ${autoSavedTime}`}</span>
          </div>
        </div>
      </div>

      {/* Stepper horizontal (10 étapes) */}
      <div className="glass-card rounded-2xl p-4 overflow-x-auto">
        <div className="flex items-center min-w-[700px] justify-between">
          {steps.map((s, idx) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => setCurrentStep(s.num)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                        : isDone
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold ${
                      isCurrent ? "text-emerald-400" : isDone ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > idx + 1 ? "bg-emerald-500/50" : "bg-slate-800"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Contenu de l'étape active */}
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              Étape {currentStep} : {steps[currentStep - 1].title}
            </h2>
            <p className="text-xs text-slate-400">{steps[currentStep - 1].desc}</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-800/40">
            Profil : {profilType}
          </span>
        </div>

        {/* Étape 1 : Identité */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nom et prénom de l'emprunteur *</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => { setNom(e.target.value); triggerAutoSave(); }}
                className="w-full glass-input rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Téléphone principal (MSISDN) *</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => { setTelephone(e.target.value); triggerAutoSave(); }}
                className="w-full glass-input rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Date de naissance (ISO)</label>
              <input
                type="date"
                defaultValue="1988-03-15"
                onChange={triggerAutoSave}
                className="w-full glass-input rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Numéro NINA / Pièce officielle</label>
              <input
                type="text"
                defaultValue="1880315891234M"
                onChange={triggerAutoSave}
                className="w-full glass-input rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* Étape 4 : Activité dynamique PME vs Salarié */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            {profilType === "PME" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Secteur d'activité</label>
                  <select onChange={triggerAutoSave} className="w-full glass-input rounded-xl px-3 py-2 text-white">
                    <option>Commerce de détail / Demi-gros</option>
                    <option>Maraîchage / Agriculture vivrière</option>
                    <option>Artisanat / Métallurgie</option>
                    <option>Transport / Moto-taxi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Emplacement commercial</label>
                  <select onChange={triggerAutoSave} className="w-full glass-input rounded-xl px-3 py-2 text-white">
                    <option>Boutique fixe au Grand Marché</option>
                    <option>Hangar / Étal aménagé</option>
                    <option>Commerce ambulant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ancienneté de l'activité (mois)</label>
                  <input type="number" defaultValue={36} onChange={triggerAutoSave} className="w-full glass-input rounded-xl px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Registre du commerce (RCCM)</label>
                  <input type="text" placeholder="MA.BKO.2021.A.1234" onChange={triggerAutoSave} className="w-full glass-input rounded-xl px-3 py-2 text-white font-mono" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Employeur / Entreprise</label>
                  <input type="text" placeholder="Ex: SOTELMA / Ministère de l'Éducation" onChange={triggerAutoSave} className="w-full glass-input rounded-xl px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Type de contrat</label>
                  <select onChange={triggerAutoSave} className="w-full glass-input rounded-xl px-3 py-2 text-white">
                    <option>CDI / Fonctionnaire titulaire</option>
                    <option>CDD longue durée (&gt; 12 mois)</option>
                    <option>Prestataire régulier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Domiciliation de salaire</label>
                  <select onChange={triggerAutoSave} className="w-full glass-input rounded-xl px-3 py-2 text-white">
                    <option>Oui (Attestation irrévocable)</option>
                    <option>Non (Virement simple)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Quotité cessible autorisée (33%)</label>
                  <input type="text" value="85 000 FCFA max/mois" disabled className="w-full glass-input rounded-xl px-3 py-2 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Étape 5 & 7 : Données Financières & Crédit */}
        {(currentStep === 5 || currentStep === 7) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Revenu mensuel / CA net</label>
              <input
                type="number"
                value={revenu}
                onChange={(e) => { setRevenu(Number(e.target.value)); triggerAutoSave(); }}
                className="w-full glass-input rounded-xl px-3 py-2 text-emerald-400 font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">{formatFCFA(revenu)}</span>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Charges mensuelles</label>
              <input
                type="number"
                value={charges}
                onChange={(e) => { setCharges(Number(e.target.value)); triggerAutoSave(); }}
                className="w-full glass-input rounded-xl px-3 py-2 text-rose-400 font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">{formatFCFA(charges)}</span>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Montant sollicité</label>
              <input
                type="number"
                value={montant}
                onChange={(e) => { setMontant(Number(e.target.value)); triggerAutoSave(); }}
                className="w-full glass-input rounded-xl px-3 py-2 text-amber-400 font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">{formatFCFA(montant)}</span>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Durée souhaitée (mois)</label>
              <input
                type="number"
                value={duree}
                onChange={(e) => { setDuree(Number(e.target.value)); triggerAutoSave(); }}
                className="w-full glass-input rounded-xl px-3 py-2 text-white font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">{duree} mois</span>
            </div>
          </div>
        )}

        {/* Autres étapes simplifiées */}
        {![1, 4, 5, 7].includes(currentStep) && (
          <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs space-y-2">
            <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-semibold text-white">Section {steps[currentStep - 1].title} renseignée</div>
            <p className="text-slate-400">Les données ont été sauvegardées automatiquement dans le dossier temporaire T0.</p>
          </div>
        )}

        {/* Boutons de navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${
              currentStep === 1 ? "opacity-40 cursor-not-allowed text-slate-600" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>

          <span className="text-xs text-slate-500 font-medium">Étape {currentStep} sur 10</span>

          {currentStep < 10 ? (
            <button
              onClick={() => setCurrentStep(Math.min(10, currentStep + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => alert("Dossier soumis avec succès pour scoring CREDIBILIS !")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/25"
            >
              <CheckCircle2 className="w-4 h-4" /> Soumettre au Moteur de Scoring
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
