import React, { useState } from "react";
import { MOCK_MATCH_CANDIDATE } from "../../api/mockData";
import { 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  UserCheck, 
  Phone,
  Calendar,
  CreditCard,
  History
} from "lucide-react";

export const MatchingView: React.FC = () => {
  const [resolvedStatus, setResolvedStatus] = useState<string | null>(null);
  const candidate = MOCK_MATCH_CANDIDATE;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            Entity Resolution & Record Linkage
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Rapprochement d'Entités & Détection de Doublons</h1>
          <p className="text-xs text-slate-400 mt-1">
            Garde-fou strict anti-homonymes : aucune fusion automatique sur nom/prénom seul.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> 1 Cas à Résoudre
          </span>
        </div>
      </div>

      {/* Carte d'arbitrage de rapprochement */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">ID Candidat : {candidate.match_id}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                PROBABLE ({Math.round(candidate.confidence * 1000) / 10}%)
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Concordance détectée lors de l'import KAFO</h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-800/40">
            <ShieldCheck className="w-4 h-4" />
            <span>Score de similarité élevé (&gt; 96%)</span>
          </div>
        </div>

        {/* Comparatif côte à côte : Enregistrement Source vs Référentiel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Entrant (Fichier importé) */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Donnée Entrante (Fichier Excel)</span>
              <span className="text-[11px] text-slate-500">Ligne 42</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Nom & Prénoms :</span>
                <span className="font-bold text-white text-sm">{candidate.incoming.nom}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">{candidate.incoming.telephone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">Née le : {candidate.incoming.date_naissance}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 font-mono text-[11px]">Compte : {candidate.incoming.compte}</span>
              </div>
            </div>
          </div>

          {/* Existant (Base de données PostgreSQL) */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Entité Existante (Référentiel)</span>
              <span className="text-[11px] font-mono text-slate-500">{candidate.existing.entity_id.slice(0, 16)}...</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Nom & Prénoms :</span>
                <span className="font-bold text-white text-sm">{candidate.existing.nom}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">{candidate.existing.telephone} (Normalisé)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">Née le : {candidate.existing.date_naissance}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-mono text-[11px]">Compte historique : {candidate.existing.compte}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Détail du calcul de similarité */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">Preuves et règles appliquées :</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {candidate.reasons.map((r, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions d'arbitrage de l'agent */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {resolvedStatus ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Décision enregistrée : {resolvedStatus}
              </span>
            ) : (
              <span>Décision humaine requise pour valider ou rejeter la fusion</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setResolvedStatus("SAME_ENTITY")}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              Même Personne (Fusionner)
            </button>
            <button
              onClick={() => setResolvedStatus("DIFFERENT_ENTITY")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              Personne Distincte (Homonyme)
            </button>
            <button
              onClick={() => setResolvedStatus("CREATE_NEW")}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-semibold transition-all border border-slate-800"
            >
              Créer Nouvelle Entité
            </button>
          </div>
        </div>
      </div>

      {/* Historique des rapprochements récents */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          Derniers Rapprochements Validés
        </h3>
        <div className="divide-y divide-slate-800/80 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Moussa Coulibaly (75 11 22 33)</div>
              <div className="text-[11px] text-slate-400">Rapproché avec CPT-SEGOU-0019 (Score 98%)</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              FUSIONNÉ
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Ousmane Diallo (66 44 22 11)</div>
              <div className="text-[11px] text-slate-400">Homonymie isolée sans concordance téléphone</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
              CRÉÉ NOUVEAU
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
