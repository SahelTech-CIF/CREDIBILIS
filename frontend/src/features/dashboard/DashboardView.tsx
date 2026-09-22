import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, Users, ArrowUpRight, Sparkles } from "lucide-react";

interface DashboardViewProps {
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Hackathon CIF 2026 — Plateforme d'Inclusion Financière
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Décisions de crédit éthiques, responsables et transparentes
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            CREDIBILIS combine la crédibilité actuarielle de Bühlmann-Straub, la recherche de cohorte par distance de Gower
            et un simulateur anti-surendettement pour ouvrir le micro-crédit à tous les entrepreneurs du Sahel.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab("decision")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 transition-all"
            >
              Simuler une Décision en Direct
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab("imports")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all"
            >
              Auditer un Import Institutionnel
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dossiers Ingestés</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">500</span>
            <span className="text-xs text-emerald-400 font-semibold">+100% audités</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Jeu de données de démonstration CIF</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Taux d'Accord Global</span>
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">78.4%</span>
            <span className="text-xs text-teal-400 font-semibold">Inclusion maximale</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Grâce à l'analyse de cohorte (Cold-Start)</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Offres Alternatives</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400">64</span>
            <span className="text-xs text-amber-300 font-semibold">12.8% protégés</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Rééchelonnements anti-surendettement</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Qualité des Données</span>
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">94.6%</span>
            <span className="text-xs text-indigo-400 font-semibold">Score global</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Audit sur les 5 dimensions normatives</p>
        </div>
      </div>

      {/* Tri-partition Actuarielle & Explication */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            La Règle d'Or des 3 Niveaux de Crédibilité
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            La formule de Bühlmann-Straub adapte dynamiquement le poids attribué à l'individu,
            à la cohorte de pairs et au réseau selon la maturité de l'emprunteur :
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-400">1. Poids Individuel (Z) — Max 70%</span>
                <span className="text-slate-300">Croît avec le nombre d'échéances remboursées</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-3/5 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-400">2. Poids Cohorte Locale (Gower) — 80% du reliquat</span>
                <span className="text-slate-300">Profils similaires (activité, CA, charges, localisation)</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 w-4/5 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-400">3. Poids Réseau Global — 20% du reliquat</span>
                <span className="text-slate-300">Taux a priori du réseau de microfinance (75%)</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 w-1/5 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400">Bénéfice Terrain :</strong> Un primo-emprunteur n'a pas $Z=0$ de chance de recevoir son prêt.
            Le moteur bascule 100% de la décision sur la cohorte et le réseau, débloquant l'accès au capital sans exiger d'antécédents bancaires préalables.
          </div>
        </div>

        {/* Accès rapide 3 Profils Clés */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">Cas d'Usage Démo Jury</h2>
            <p className="text-xs text-slate-400 mb-4">Sélectionnez l'un des 3 profils types pour la présentation :</p>
            <div className="space-y-3">
              <button
                onClick={() => onSelectTab("decision")}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">1. Client Établi</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">ACCORDÉ</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">Amadou Diallo (18 échéances, accord sec 88 pts)</p>
              </button>

              <button
                onClick={() => onSelectTab("decision")}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-teal-950/30 border border-slate-800 hover:border-teal-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400">2. Nouveau Client (Cold Start)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">ACCORDÉ</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">Aminata Cissé (0 antécédent, validé par cohorte)</p>
              </button>

              <button
                onClick={() => onSelectTab("decision")}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">3. Profil Surendetté</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">OFFRE ALTERNATIVE</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">Bakary Traoré (rallongement proposé 6 mois $\rightarrow$ 12 mois)</p>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
            Conforme à la constitution de développement CREDIBILIS
          </div>
        </div>
      </div>
    </div>
  );
};
