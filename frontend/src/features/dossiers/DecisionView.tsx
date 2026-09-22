import React, { useState } from "react";
import { DEMO_CLIENTS, type DemoClientProfile } from "../../api/mockData";
import { formatFCFA } from "../../lib/utils";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  HelpCircle, 
  Sliders, 
  Sparkles, 
  Clock, 
  Wallet, 
  Scale, 
  ShieldAlert, 
  ArrowRight
} from "lucide-react";

export const DecisionView: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<DemoClientProfile>(DEMO_CLIENTS[0]);
  
  // Paramètres personnalisables en direct
  const [revenu, setRevenu] = useState<number>(selectedProfile.revenu_mensuel);
  const [charges, setCharges] = useState<number>(selectedProfile.charges_mensuelles);
  const [montant, setMontant] = useState<number>(selectedProfile.montant_demande);
  const [duree, setDuree] = useState<number>(selectedProfile.duree_mois);

  // Synchronisation lors du changement de profil type
  const handleSelectProfile = (p: DemoClientProfile) => {
    setSelectedProfile(p);
    setRevenu(p.revenu_mensuel);
    setCharges(p.charges_mensuelles);
    setMontant(p.montant_demande);
    setDuree(p.duree_mois);
  };

  const decision = selectedProfile.result.decision;
  const score = selectedProfile.result.score_credibilis;
  const weights = selectedProfile.result.poids_decision;
  const alternative = selectedProfile.result.offre_alternative;

  // Calcul du taux d'effort mensuel théorique
  const capacite = Math.max(0, revenu - charges);
  const mensualite = Math.round(montant / Math.max(1, duree));
  const ratioEndettement = capacite > 0 ? (mensualite / capacite) * 100 : 999;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête et Sélecteur de Démo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Moteur de Décision IA & Actuariel CREDIBILIS
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Évaluation & Offre Responsable</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualisation des 3 niveaux de crédibilité (Bühlmann-Straub + Cohortes Gower)
          </p>
        </div>

        {/* Sélecteur des 3 profils types */}
        <div className="flex flex-wrap gap-2">
          {DEMO_CLIENTS.map((p) => {
            const isSelected = selectedProfile.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProfile(p)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600"
                }`}
              >
                {p.type_profil === 'PARFAIT' && "🟢 Client Établi"}
                {p.type_profil === 'COLD_START' && "🔵 Cold Start (Sans Antécédent)"}
                {p.type_profil === 'SURENDETTE' && "🟠 Surendetté (Offre Alt.)"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Colonne Gauche : Formulaire & Données Économiques (4 colonnes) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Passeport Économique Emprunteur
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Identifiant Client</label>
                <input
                  type="text"
                  value={selectedProfile.id}
                  disabled
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nom du client</label>
                <input
                  type="text"
                  value={selectedProfile.nom}
                  disabled
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">{selectedProfile.description}</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Revenu mensuel</span>
                  <span className="font-semibold text-emerald-400">{formatFCFA(revenu)}</span>
                </div>
                <input
                  type="range"
                  min={150000}
                  max={1200000}
                  step={25000}
                  value={revenu}
                  onChange={(e) => setRevenu(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Charges mensuelles</span>
                  <span className="font-semibold text-rose-400">{formatFCFA(charges)}</span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={500000}
                  step={10000}
                  value={charges}
                  onChange={(e) => setCharges(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Montant demandé</span>
                  <span className="font-semibold text-amber-400">{formatFCFA(montant)}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={1500000}
                  step={50000}
                  value={montant}
                  onChange={(e) => setMontant(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Durée sollicitée</span>
                  <span className="font-semibold text-white">{duree} mois</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={24}
                  step={3}
                  value={duree}
                  onChange={(e) => setDuree(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Ratios d'endettement calculés */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Capacité nette mensuelle :</span>
                  <span className="font-semibold text-white">{formatFCFA(capacite)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Mensualité théorique :</span>
                  <span className="font-semibold text-white">{formatFCFA(mensualite)}</span>
                </div>
                <div className="flex justify-between text-xs items-center pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Ratio d'endettement :</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    ratioEndettement <= 40 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  }`}>
                    {Math.round(ratioEndettement)}% (Max 40%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Moteur de Décision (Badge + Jauge 3 Tiers + Offre Alternative) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Bloc 1 : Badge de Décision Principal */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Résultat Officiel CREDIBILIS
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="text-3xl font-extrabold text-white">Score : {score} / 100</h3>
                  {decision === "ACCORDÉ" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" /> ACCORDÉ
                    </span>
                  )}
                  {decision === "SOUMIS À CONDITIONS" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs animate-pulse">
                      <AlertCircle className="w-4 h-4" /> SOUMIS À CONDITIONS
                    </span>
                  )}
                  {decision === "REFUSÉ" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs">
                      <XCircle className="w-4 h-4" /> REFUSÉ
                    </span>
                  )}
                  {decision === "ABSTENTION" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 font-bold text-xs">
                      <HelpCircle className="w-4 h-4" /> ABSTENTION
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                <span className="text-xs text-slate-400">Modèles sollicités</span>
                <div className="flex flex-wrap gap-1 mt-1 justify-end">
                  {selectedProfile.result.modeles_utilises?.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Barre de progression du score */}
            <div className="mt-5">
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    score >= 65 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-amber-500 to-rose-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>0 (Refus strict)</span>
                <span className="text-amber-400 font-medium">Seuil d'accord : 65 pts</span>
                <span>100 (Excellence)</span>
              </div>
            </div>
          </div>

          {/* Bloc 2 : Jauge d'Explicabilité (Les 3 Poids de l'IA) */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              Jauge d'Explicabilité : Décomposition des 3 Poids
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Transparence totale pour l'agent de crédit : comment les 100 points de la décision sont répartis.
            </p>

            {/* Visualisation en barre segmentée */}
            <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800 shadow-inner">
              <div
                style={{ width: `${weights.w_ind_pct}%` }}
                className="bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-slate-950 transition-all duration-500"
                title={`Poids individuel : ${weights.w_ind_pct}%`}
              >
                {weights.w_ind_pct > 10 && `${weights.w_ind_pct}%`}
              </div>
              <div
                style={{ width: `${weights.w_local_pct}%` }}
                className="bg-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-950 transition-all duration-500"
                title={`Poids cohorte locale : ${weights.w_local_pct}%`}
              >
                {weights.w_local_pct > 10 && `${weights.w_local_pct}%`}
              </div>
              <div
                style={{ width: `${weights.w_reseau_pct}%` }}
                className="bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
                title={`Poids réseau : ${weights.w_reseau_pct}%`}
              >
                {weights.w_reseau_pct > 5 && `${weights.w_reseau_pct}%`}
              </div>
            </div>

            {/* Légende détaillée des 3 tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-emerald-300">Poids Individuel</span>
                </div>
                <div className="text-xl font-extrabold text-white mt-1">{weights.w_ind_pct}%</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Basé sur {selectedProfile.historique_echeances} échéance(s) passée(s) (Bühlmann Z)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="text-xs font-bold text-amber-300">Poids Cohorte Locale</span>
                </div>
                <div className="text-xl font-extrabold text-white mt-1">{weights.w_local_pct}%</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Voisins comparables Gower ({selectedProfile.result.qualite_donnees?.taille_cohorte || 25} pairs)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span className="text-xs font-bold text-blue-300">Poids Réseau Global</span>
                </div>
                <div className="text-xl font-extrabold text-white mt-1">{weights.w_reseau_pct}%</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Taux a priori de référence du réseau (75%)
                </p>
              </div>
            </div>
          </div>

          {/* Bloc 3 : Carte d'Offre Alternative (Uniquement si présente) */}
          {alternative && (
            <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-950/60 to-slate-900 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden animate-slide-up">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                      Offre Alternative Responsable
                    </span>
                    <span className="text-xs text-amber-300 font-medium">Protection anti-surendettement</span>
                  </div>

                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {alternative.motif}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-amber-500/20">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-amber-400" />
                        Montant réajusté
                      </span>
                      <div className="text-lg font-bold text-amber-400 mt-0.5">
                        {formatFCFA(alternative.montant_recommande)}
                      </div>
                      <span className="text-[10px] text-slate-500">Initial : {formatFCFA(montant)}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Durée rééchelonnée
                      </span>
                      <div className="text-lg font-bold text-amber-400 mt-0.5">
                        {alternative.duree_recommandee_mois} mois
                      </div>
                      <span className="text-[10px] text-slate-500">Initiale : {duree} mois</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md">
                      Émettre l'Offre Rééchelonnée
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Facteurs Explicatifs d'Impact (SHAP transparents) */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Facteurs Explicatifs d'Impact (SHAP)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">Réseau Tontine</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-white">
                    {selectedProfile.tontine ? "Membre Actif" : "Non Membre"}
                  </span>
                  <span className={`text-xs font-bold ${selectedProfile.tontine ? "text-emerald-400" : "text-slate-500"}`}>
                    {selectedProfile.tontine ? "+18 pts" : "-12 pts"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">Flux Mobile Money</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-white">
                    {formatFCFA(selectedProfile.mobile_money_flux)}/mois
                  </span>
                  <span className="text-xs font-bold text-emerald-400">+12 pts</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">Ancienneté d'activité</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-white">Commerce établi</span>
                  <span className="text-xs font-bold text-emerald-400">+10 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
