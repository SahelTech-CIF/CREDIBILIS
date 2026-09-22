import React, { useState } from "react";
import { MOCK_QUALITY_METRICS, MOCK_ANOMALIES } from "../../api/mockData";
import { formatPercent } from "../../lib/utils";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Database,
  Filter,
  Layers,
  Sparkles
} from "lucide-react";

export const ImportView: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [committed, setCommitted] = useState<boolean>(false);

  // Mapping interactif simulé
  const [mapping, setMapping] = useState<Record<string, string>>({
    "Nom du membre": "person.nom",
    "Contact Tel": "person.telephone",
    "Recettes du mois": "activity.ca_mensuel",
    "Charges": "activity.charges_mensuelles",
    "Credit Sollicite": "application.montant",
    "Duree mois": "application.duree_mois",
    "No Compte Caisse": "external_id:COMPTE_MEMBRE",
  });

  const sourceColumns = Object.keys(mapping);

  const filteredAnomalies = selectedSeverity === "ALL"
    ? MOCK_ANOMALIES
    : MOCK_ANOMALIES.filter((a) => a.severity === selectedSeverity);

  const handleCommit = () => {
    setIsCommitting(true);
    setTimeout(() => {
      setIsCommitting(false);
      setCommitted(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            Moteur de Collecte & Ingestion Canonique
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Import de Portefeuille Institutionnel</h1>
          <p className="text-xs text-slate-500 mt-1">
            Inspection, mapping interactif, validation et audit Data Quality en 5 dimensions.
          </p>
        </div>

        {/* Étapes du workflow d'import */}
        <div className="flex items-center gap-2">
          {[
            { num: 1, label: "Fichier" },
            { num: 2, label: "Mapping" },
            { num: 3, label: "Data Quality" },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                step === s.num
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                {s.num}
              </span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Étape 1 : Téléversement & Inspection */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6 animate-fade-in">
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-10 text-center transition-all bg-slate-50/50 cursor-pointer group">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-4">Glissez-déposez le fichier de l'institution</h3>
            <p className="text-xs text-slate-500 mt-1">Formats acceptés : Excel (.xlsx, .xlsm), CSV délimité, JSON</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-xs">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exemple chargé : <strong>kafo_mopti_septembre_2026.xlsx</strong> (500 lignes)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">Feuille détectée : "Portefeuille_Clients"</div>
                <div className="text-[11px] text-slate-500">7 colonnes reconnues • Encodage UTF-8 • 500 dossiers identifiés</div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm"
            >
              Passer au Mapping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Étape 2 : Mapping Interactif */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Alignement des Colonnes Sources</h2>
              <p className="text-xs text-slate-500">
                Associez chaque colonne du fichier source au champ correspondant du schéma canonique CREDIBILIS.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> 7 suggestions automatiques appliquées
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Colonne Source (Institution)</th>
                  <th className="p-3">Champ Canonique CREDIBILIS</th>
                  <th className="p-3">Confiance</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {sourceColumns.map((col) => (
                  <tr key={col} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{col}</td>
                    <td className="p-3">
                      <select
                        value={mapping[col]}
                        onChange={(e) => setMapping({ ...mapping, [col]: e.target.value })}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-emerald-800 font-sans font-semibold focus:outline-none focus:border-emerald-600"
                      >
                        <option value="person.nom">person.nom (Nom de famille)</option>
                        <option value="person.telephone">person.telephone (MSISDN)</option>
                        <option value="activity.ca_mensuel">activity.ca_mensuel (Revenu/CA)</option>
                        <option value="activity.charges_mensuelles">activity.charges_mensuelles</option>
                        <option value="application.montant">application.montant</option>
                        <option value="application.duree_mois">application.duree_mois</option>
                        <option value="external_id:COMPTE_MEMBRE">external_id:COMPTE_MEMBRE</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-500 font-sans">98%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans font-bold">
                        VALIDÉ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
            >
              Retour
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm"
            >
              Auditer la Qualité des Données
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 : Data Quality & Anomalies */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          {/* Les 5 dimensions de qualité */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Score Global de Qualité : {MOCK_QUALITY_METRICS.global_score}%</h2>
                <p className="text-xs text-slate-500">Évaluation normative sur les 5 dimensions de credibilis_collecte</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                QUALITÉ ÉLEVÉE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500">Complétude (30%)</span>
                <div className="text-lg font-black text-slate-900 mt-1">{formatPercent(MOCK_QUALITY_METRICS.completeness * 100)}</div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${MOCK_QUALITY_METRICS.completeness * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500">Validité (30%)</span>
                <div className="text-lg font-black text-slate-900 mt-1">{formatPercent(MOCK_QUALITY_METRICS.validity * 100)}</div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: `${MOCK_QUALITY_METRICS.validity * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500">Unicité (15%)</span>
                <div className="text-lg font-black text-slate-900 mt-1">{formatPercent(MOCK_QUALITY_METRICS.uniqueness * 100)}</div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${MOCK_QUALITY_METRICS.uniqueness * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500">Cohérence (10%)</span>
                <div className="text-lg font-black text-slate-900 mt-1">{formatPercent(MOCK_QUALITY_METRICS.consistency * 100)}</div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${MOCK_QUALITY_METRICS.consistency * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500">Traçabilité (15%)</span>
                <div className="text-lg font-black text-slate-900 mt-1">{formatPercent(MOCK_QUALITY_METRICS.traceability * 100)}</div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${MOCK_QUALITY_METRICS.traceability * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des anomalies détectées */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Diagnostic des Anomalies ({filteredAnomalies.length})
                </h3>
                <p className="text-xs text-slate-500">Classification stricte par sévérité pour arbitrage agent</p>
              </div>

              {/* Filtre de sévérité */}
              <div className="flex items-center gap-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                {["ALL", "BLOCKING", "WARNING", "INFO"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedSeverity === sev
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {sev === "ALL" ? "Tous" : sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAnomalies.map((a, idx) => (
                <div key={idx} className="py-3 flex items-start gap-3 text-xs">
                  {a.severity === "BLOCKING" && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  {a.severity === "WARNING" && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                  {a.severity === "INFO" && <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{a.code}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        a.severity === "BLOCKING" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                        a.severity === "WARNING" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {a.severity}
                      </span>
                      {a.row_number && (
                        <span className="text-slate-400 text-[11px]">Ligne {a.row_number}</span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-0.5">{a.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton de Commit Transactionnel */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {committed ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 485 enregistrements commités avec succès dans PostgreSQL
                  </span>
                ) : (
                  <span>Prêt pour persistance transactionnelle atomique (PostgreSQL)</span>
                )}
              </div>

              <button
                onClick={handleCommit}
                disabled={isCommitting || committed}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                  committed
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                }`}
              >
                <Database className="w-4 h-4" />
                {isCommitting ? "Commit en cours..." : committed ? "Import Déjà Commité" : "Valider & Commiter le Lot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
