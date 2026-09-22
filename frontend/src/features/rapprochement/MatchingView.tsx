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
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            Entity Resolution & Record Linkage
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Rapprochement d'Entités & Détection de Doublons</h1>
          <p className="text-xs text-slate-500 mt-1">
            Garde-fou strict anti-homonymes : aucune fusion automatique sur nom/prénom seul.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> 1 Cas à Résoudre
          </span>
        </div>
      </div>

      {/* Carte d'arbitrage de rapprochement */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">ID Candidat : {candidate.match_id}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                PROBABLE ({Math.round(candidate.confidence * 1000) / 10}%)
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Concordance détectée lors de l'import KAFO</h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Score de similarité élevé (&gt; 96%)</span>
          </div>
        </div>

        {/* Comparatif côte à côte : Enregistrement Source vs Référentiel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Entrant (Fichier importé) */}
          <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Donnée Entrante (Fichier Excel)</span>
              <span className="text-[11px] text-slate-500 font-medium">Ligne 42</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Nom & Prénoms :</span>
                <span className="font-bold text-slate-900 text-sm">{candidate.incoming.nom}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700">{candidate.incoming.telephone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700">Née le : {candidate.incoming.date_naissance}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-900 font-mono text-[11px] font-bold">Compte : {candidate.incoming.compte}</span>
              </div>
            </div>
          </div>

          {/* Existant (Base de données PostgreSQL) */}
          <div className="p-5 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Entité Existante (Référentiel)</span>
              <span className="text-[11px] font-mono text-slate-500">{candidate.existing.entity_id.slice(0, 16)}...</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Nom & Prénoms :</span>
                <span className="font-bold text-slate-900 text-sm">{candidate.existing.nom}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700">{candidate.existing.telephone} (Normalisé)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700">Née le : {candidate.existing.date_naissance}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-900 font-mono text-[11px] font-bold">Compte historique : {candidate.existing.compte}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Détail du calcul de similarité */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Preuves et règles appliquées :</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {candidate.reasons.map((r, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions d'arbitrage de l'agent */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {resolvedStatus ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Décision enregistrée : {resolvedStatus}
              </span>
            ) : (
              <span>Décision humaine requise pour valider ou rejeter la fusion</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setResolvedStatus("SAME_ENTITY")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm"
            >
              Même Personne (Fusionner)
            </button>
            <button
              onClick={() => setResolvedStatus("DIFFERENT_ENTITY")}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
            >
              Personne Distincte (Homonyme)
            </button>
            <button
              onClick={() => setResolvedStatus("CREATE_NEW")}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all border border-slate-200"
            >
              Créer Nouvelle Entité
            </button>
          </div>
        </div>
      </div>

      {/* Historique des rapprochements récents */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600" />
          Derniers Rapprochements Validés
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Moussa Coulibaly (75 11 22 33)</div>
              <div className="text-[11px] text-slate-500">Rapproché avec CPT-SEGOU-0019 (Score 98%)</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
              FUSIONNÉ
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Ousmane Diallo (66 44 22 11)</div>
              <div className="text-[11px] text-slate-500">Homonymie isolée sans concordance téléphone</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
              CRÉÉ NOUVEAU
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
