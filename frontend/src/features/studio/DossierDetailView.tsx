import React from "react";
import {
  ArrowLeft,
  Download,
  ShieldCheck
} from "lucide-react";
import type { DossierCollecte, DefinitionChamp } from "./studioTypes";

interface DossierDetailProps {
  dossier: DossierCollecte;
  champs: DefinitionChamp[];
  onRetour: () => void;
}

export const DossierDetailView: React.FC<DossierDetailProps> = ({
  dossier,
  champs,
  onRetour,
}) => {
  const totalChamps = Object.keys(dossier.donnees).length;

  const verifiees = Object.values(dossier.donnees).filter(
    (d) => d.niveau_verification === "VERIFIE"
  ).length;

  const declarees = Object.values(dossier.donnees).filter(
    (d) => d.niveau_verification === "DECLARE"
  ).length;

  const observees = Object.values(dossier.donnees).filter(
    (d) => d.niveau_verification === "OBSERVE"
  ).length;

  const importees = Object.values(dossier.donnees).filter(
    (d) => d.niveau_verification === "IMPORTE"
  ).length;

  const scoreQualite =
    totalChamps > 0
      ? Math.round(
          ((verifiees * 1.0 + observees * 0.8 + declarees * 0.5) / totalChamps) * 100
        )
      : 85;

  return (
    <div className="space-y-6">
      {/* Header Dossier */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onRetour}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            title="Retour à la saisie"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dossier d'Instruction
              </span>
              <span className="text-slate-300">/</span>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {dossier.id}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {dossier.nom_emprunteur}
            </h1>
            <p className="text-xs text-slate-500">
              Profil : <strong className="text-slate-700">{dossier.profil_code}</strong> · Produit :{" "}
              <strong className="text-slate-700">{dossier.produit_code}</strong> · Date :{" "}
              {dossier.date_creation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Export JSON du dossier d'audit généré.")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Exporter Audit JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Qualité & Provenance */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Score Qualité</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{scoreQualite} %</div>
          <div className="text-[10px] text-slate-500 mt-1">Confiance 5D</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalChamps}</div>
          <div className="text-[10px] text-slate-500 mt-1">Champs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Vérifiées</span>
          <div className="text-2xl font-black text-emerald-600 mt-2">{verifiees}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Sur pièces</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Déclarées</span>
          <div className="text-2xl font-black text-blue-600 mt-2">{declarees}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">Entretien</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Observées</span>
          <div className="text-2xl font-black text-amber-600 mt-2">{observees}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">Terrain</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Importées</span>
          <div className="text-2xl font-black text-indigo-600 mt-2">{importees}</div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-1">Fichiers ext.</div>
        </div>
      </div>

      {/* Inventaire des Données Collectées */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Traçabilité & Classification des Données
          </h3>
          <span className="text-xs text-slate-500">
            Stockage PostgreSQL JSONB hybride + typage strict
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {Object.entries(dossier.donnees).map(([code, item]) => {
            const def = champs.find((c) => c.code === code);
            const libelle = def?.libelle || code;

            return (
              <div key={code} className="py-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{libelle}</span>
                    <span className="text-[10px] font-mono text-slate-500">({code})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                      {def?.type_donnee || "TEXTE"}
                    </span>
                    <span>·</span>
                    <span>{def?.categorie || "ACTIVITE"}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700">{def?.role_analytique || "VARIABLE"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">
                      {typeof item.valeur === "boolean"
                        ? item.valeur
                          ? "Oui"
                          : "Non"
                        : String(item.valeur)}
                    </div>
                    {item.note_verification && (
                      <div className="text-[10px] text-slate-500 italic">
                        {item.note_verification}
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      item.niveau_verification === "VERIFIE"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : item.niveau_verification === "OBSERVE"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : item.niveau_verification === "IMPORTE"
                        ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    {item.niveau_verification}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
