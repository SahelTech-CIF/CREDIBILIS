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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Moteur de Décision IA & Actuariel CREDIBILIS
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Évaluation & Offre Responsable
          </h1>
          <p className="text-xs text-slate-500 mt-1">
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
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
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Passeport Économique Emprunteur
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Identifiant Client</label>
                <input
                  type="text"
                  value={selectedProfile.id}
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom du client</label>
                <input
                  type="text"
                  value={selectedProfile.nom}
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">{selectedProfile.description}</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Revenu mensuel</span>
                  <span className="font-bold text-emerald-700">{formatFCFA(revenu)}</span>
                </div>
                <input
                  type="range"
                  min={150000}
                  max={1200000}
                  step={25000}
                  value={revenu}
                  onChange={(e) => setRevenu(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Charges mensuelles</span>
                  <span className="font-bold text-rose-600">{formatFCFA(charges)}</span>
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

              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Montant demandé</span>
                  <span className="font-bold text-amber-700">{formatFCFA(montant)}</span>
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
                  <span className="text-slate-600 font-medium">Durée sollicitée</span>
                  <span className="font-bold text-slate-900">{duree} mois</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={24}
                  step={3}
                  value={duree}
                  onChange={(e) => setDuree(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Ratios d'endettement calculés */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Capacité nette mensuelle :</span>
                  <span className="font-bold text-slate-900">{formatFCFA(capacite)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Mensualité théorique :</span>
                  <span className="font-bold text-slate-900">{formatFCFA(mensualite)}</span>
                </div>
                <div className="flex justify-between text-xs items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Ratio d'endettement :</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    ratioEndettement <= 40 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
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
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Résultat Officiel CREDIBILIS
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="text-3xl font-black text-slate-900">Score : {score} / 100</h3>
                  {decision === "ACCORDÉ" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" /> ACCORDÉ
                    </span>
                  )}
                  {decision === "SOUMIS À CONDITIONS" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs animate-pulse">
                      <AlertCircle className="w-4 h-4" /> SOUMIS À CONDITIONS
                    </span>
                  )}
                  {decision === "REFUSÉ" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs">
                      <XCircle className="w-4 h-4" /> REFUSÉ
                    </span>
                  )}
                  {decision === "ABSTENTION" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs">
                      <HelpCircle className="w-4 h-4" /> ABSTENTION
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
                <span className="text-xs text-slate-500">Modèles sollicités</span>
                <div className="flex flex-wrap gap-1 mt-1 justify-end">
                  {selectedProfile.result.modeles_utilises?.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-mono font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Barre de progression du score */}
            <div className="mt-5">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    score >= 65 ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-amber-500 to-rose-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0 (Refus strict)</span>
                <span className="text-amber-700 font-bold">Seuil d'accord : 65 pts</span>
                <span>100 (Excellence)</span>
              </div>
            </div>
          </div>

          {/* Bloc 2 : Jauge d'Explicabilité (Les 3 Poids de l'IA) */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Jauge d'Explicabilité : Décomposition des 3 Poids
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Transparence totale pour l'agent de crédit : comment les 100 points de la décision sont répartis.
            </p>

            {/* Visualisation en barre segmentée */}
            <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200 shadow-xs">
              <div
                style={{ width: `${weights.w_ind_pct}%` }}
                className="bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
                title={`Poids individuel : ${weights.w_ind_pct}%`}
              >
                {weights.w_ind_pct > 10 && `${weights.w_ind_pct}%`}
              </div>
              <div
                style={{ width: `${weights.w_local_pct}%` }}
                className="bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
                title={`Poids cohorte locale : ${weights.w_local_pct}%`}
              >
                {weights.w_local_pct > 10 && `${weights.w_local_pct}%`}
              </div>
              <div
                style={{ width: `${weights.w_reseau_pct}%` }}
                className="bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
                title={`Poids réseau : ${weights.w_reseau_pct}%`}
              >
                {weights.w_reseau_pct > 5 && `${weights.w_reseau_pct}%`}
              </div>
            </div>

            {/* Légende détaillée des 3 tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-xs font-bold text-emerald-800">Poids Individuel</span>
                </div>
                <div className="text-xl font-black text-slate-900 mt-1">{weights.w_ind_pct}%</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Basé sur {selectedProfile.historique_echeances} échéance(s) passée(s) (Bühlmann Z)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span className="text-xs font-bold text-amber-800">Poids Cohorte Locale</span>
                </div>
                <div className="text-xl font-black text-slate-900 mt-1">{weights.w_local_pct}%</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Voisins comparables Gower ({selectedProfile.result.qualite_donnees?.taille_cohorte || 25} pairs)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <span className="text-xs font-bold text-indigo-800">Poids Réseau Global</span>
                </div>
                <div className="text-xl font-black text-slate-900 mt-1">{weights.w_reseau_pct}%</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Taux a priori de référence du réseau (75%)
                </p>
              </div>
            </div>
          </div>

          {/* Bloc 3 : Carte d'Offre Alternative (Uniquement si présente) */}
          {alternative && (
            <div className="rounded-2xl p-6 bg-amber-50 border-2 border-amber-300 shadow-sm relative overflow-hidden animate-slide-up">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-100 border border-amber-200 text-amber-700">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-black tracking-wider px-2 py-0.5 rounded bg-amber-600 text-white">
                      Offre Alternative Responsable
                    </span>
                    <span className="text-xs text-amber-800 font-bold">Protection anti-surendettement</span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {alternative.motif}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-amber-200">
                    <div className="p-3 rounded-xl bg-white border border-amber-200">
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                        <Wallet className="w-3.5 h-3.5 text-amber-600" />
                        Montant réajusté
                      </span>
                      <div className="text-lg font-black text-amber-700 mt-0.5">
                        {formatFCFA(alternative.montant_recommande)}
                      </div>
                      <span className="text-[10px] text-slate-400">Initial : {formatFCFA(montant)}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-amber-200">
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Durée rééchelonnée
                      </span>
                      <div className="text-lg font-black text-amber-700 mt-0.5">
                        {alternative.duree_recommandee_mois} mois
                      </div>
                      <span className="text-[10px] text-slate-400">Initiale : {duree} mois</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-sm">
                      Émettre l'Offre Rééchelonnée
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Facteurs Explicatifs d'Impact (SHAP transparents) */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Facteurs Explicatifs d'Impact (SHAP)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500">Réseau Tontine</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-slate-900">
                    {selectedProfile.tontine ? "Membre Actif" : "Non Membre"}
                  </span>
                  <span className={`text-xs font-black ${selectedProfile.tontine ? "text-emerald-700" : "text-slate-400"}`}>
                    {selectedProfile.tontine ? "+18 pts" : "-12 pts"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500">Flux Mobile Money</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-slate-900">
                    {formatFCFA(selectedProfile.mobile_money_flux)}/mois
                  </span>
                  <span className="text-xs font-black text-emerald-700">+12 pts</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500">Ancienneté d'activité</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-slate-900">Commerce établi</span>
                  <span className="text-xs font-black text-emerald-700">+10 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
