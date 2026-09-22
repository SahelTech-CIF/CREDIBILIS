import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, Users, ArrowUpRight, Sparkles } from "lucide-react";

interface DashboardViewProps {
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 border border-emerald-200/80 p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Hackathon CIF 2026 — Plateforme d'Inclusion Financière
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Décisions de crédit éthiques, responsables et transparentes
          </h1>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            CREDIBILIS combine la crédibilité actuarielle de Bühlmann-Straub, la recherche de cohorte par distance de Gower
            et un simulateur anti-surendettement pour ouvrir le micro-crédit à tous les entrepreneurs du Sahel.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab("decision")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              Simuler une Décision en Direct
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab("imports")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold border border-slate-200 shadow-xs transition-all"
            >
              Auditer un Import Institutionnel
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dossiers Ingestés</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">500</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">+100% audités</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Jeu de données de démonstration CIF</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-teal-500 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taux d'Accord Global</span>
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">78.4%</span>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">Inclusion max</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Grâce à l'analyse de cohorte (Cold-Start)</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-amber-500 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offres Alternatives</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">64</span>
            <span className="text-xs text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">12.8% protégés</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Rééchelonnements anti-surendettement</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-indigo-500 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualité des Données</span>
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">94.6%</span>
            <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">Score global</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Audit sur les 5 dimensions normatives</p>
        </div>
      </div>

      {/* Tri-partition Actuarielle & Explication */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            La Règle d'Or des 3 Niveaux de Crédibilité
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            La formule de Bühlmann-Straub adapte dynamiquement le poids attribué à l'individu,
            à la cohorte de pairs et au réseau selon la maturité de l'emprunteur :
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 font-bold">1. Poids Individuel (Z) — Max 70%</span>
                <span className="text-slate-500">Croît avec le nombre d'échéances remboursées</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-3/5 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700 font-bold">2. Poids Cohorte Locale (Gower) — 80% du reliquat</span>
                <span className="text-slate-500">Profils similaires (activité, CA, charges, localisation)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 w-4/5 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-indigo-700 font-bold">3. Poids Réseau Global — 20% du reliquat</span>
                <span className="text-slate-500">Taux a priori du réseau de microfinance (75%)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 w-1/5 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong className="text-emerald-700">Bénéfice Terrain :</strong> Un primo-emprunteur n'a pas Z=0 de chance de recevoir son prêt.
            Le moteur bascule 100% de la décision sur la cohorte et le réseau, débloquant l'accès au capital sans exiger d'antécédents bancaires préalables.
          </div>
        </div>

        {/* Accès rapide 3 Profils Clés */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Cas d'Usage Démo Jury</h2>
            <p className="text-xs text-slate-500 mb-4">Sélectionnez l'un des 3 profils types pour la présentation :</p>
            <div className="space-y-3">
              <button
                onClick={() => onSelectTab("decision")}
                className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">1. Client Établi</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">ACCORDÉ</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Amadou Diallo (18 échéances, accord sec 88 pts)</p>
              </button>

              <button
                onClick={() => onSelectTab("decision")}
                className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-teal-800">2. Nouveau Client (Cold Start)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">ACCORDÉ</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Aminata Cissé (0 antécédent, validé par cohorte)</p>
              </button>

              <button
                onClick={() => onSelectTab("decision")}
                className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800">3. Profil Surendetté</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">OFFRE ALTERNATIVE</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Bakary Traoré (rallongement proposé 6 mois à 12 mois)</p>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Conforme à la constitution de développement CREDIBILIS
          </div>
        </div>
      </div>
    </div>
  );
};
