import React, { useState, useMemo } from "react";
import {
  Send,
  Sparkles,
  Info,
  Shield,
  CheckCircle2
} from "lucide-react";
import type {
  ProfilConfig,
  ProduitConfig,
  SectionCollecte,
  DefinitionChamp,
  NiveauVerification,
  ValeurDonneeSaisie,
  DossierCollecte
} from "./studioTypes";

interface CollecteDynamiqueProps {
  profils: ProfilConfig[];
  produits: ProduitConfig[];
  sections: SectionCollecte[];
  champs: DefinitionChamp[];
  initialProfilCode?: string;
  onDossierValide: (dossier: DossierCollecte) => void;
}

export const CollecteDynamiqueView: React.FC<CollecteDynamiqueProps> = ({
  profils,
  produits,
  sections,
  champs,
  initialProfilCode = "SALARIE",
  onDossierValide,
}) => {
  const [selectedProfil, setSelectedProfil] = useState<string>(initialProfilCode);
  const [selectedProduit, setSelectedProduit] = useState<string>("");
  const [valeursSaisies, setValeursSaisies] = useState<Record<string, any>>({
    statut_logement: "PROPRIETAIRE",
  });
  const [provenances, setProvenances] = useState<Record<string, { niveau: NiveauVerification; note?: string }>>({});
  const [activeProvenanceModal, setActiveProvenanceModal] = useState<string | null>(null);

  // Mettre à jour le produit automatique lors du changement de profil
  const produitsDuProfil = useMemo(() => {
    return produits.filter((p) => p.profil_code === selectedProfil);
  }, [produits, selectedProfil]);

  const activeProduit = useMemo(() => {
    if (selectedProduit) {
      return produits.find((p) => p.code === selectedProduit);
    }
    return produitsDuProfil[0];
  }, [produits, selectedProduit, produitsDuProfil]);

  // Filtrer les sections applicables au profil courant
  const sectionsApplicables = useMemo(() => {
    return sections.filter((s) => {
      const champsDeSection = champs.filter(
        (c) =>
          c.section_id === s.id &&
          (c.profils_applicables.includes(selectedProfil) ||
            c.profils_applicables.includes("TOUS")) &&
          c.actif
      );
      return champsDeSection.length > 0;
    });
  }, [sections, champs, selectedProfil]);

  // Évaluation d'une règle conditionnelle
  const evaluerConditionAffichage = (champ: DefinitionChamp): boolean => {
    if (!champ.regle_affichage) return true;
    const { champ_source, operateur, valeur } = champ.regle_affichage;
    const valeurSource = valeursSaisies[champ_source];

    if (operateur === "==") {
      return valeurSource === valeur;
    }
    if (operateur === "!=") {
      return valeurSource !== valeur;
    }
    return true;
  };

  const handleInputChange = (champCode: string, val: any) => {
    setValeursSaisies((prev: Record<string, any>) => ({
      ...prev,
      [champCode]: val,
    }));
  };

  const handleSetProvenance = (champCode: string, niveau: NiveauVerification, note?: string) => {
    setProvenances((prev: Record<string, { niveau: NiveauVerification; note?: string }>) => ({
      ...prev,
      [champCode]: { niveau, note },
    }));
    setActiveProvenanceModal(null);
  };

  const handleSubmitDossier = (e: React.FormEvent) => {
    e.preventDefault();
    const donneesFinales: Record<string, ValeurDonneeSaisie> = {};

    Object.entries(valeursSaisies).forEach(([code, val]) => {
      const prov = provenances[code] || {
        niveau: "DECLARE" as NiveauVerification,
        note: "Déclaré lors de l'entretien agent",
      };
      donneesFinales[code] = {
        code,
        valeur: val,
        source: "Entretien terrain agent",
        niveau_verification: prov.niveau,
        note_verification: prov.note,
        date_collecte: new Date().toISOString(),
      };
    });

    const nouveauDossier: DossierCollecte = {
      id: `DOS-${Date.now().toString().slice(-6)}`,
      profil_code: selectedProfil,
      produit_code: activeProduit?.code || "CREDIT_STANDARD",
      nom_emprunteur:
        valeursSaisies["nom_complet"] ||
        valeursSaisies["raison_sociale"] ||
        "Emprunteur Test",
      date_creation: new Date().toLocaleDateString("fr-FR"),
      statut: "EN_INSTRUCTION",
      donnees: donneesFinales,
    };

    onDossierValide(nouveauDossier);
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de Contexte : Institution, Profil & Produit */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Formulaire Dynamique 100% Adaptatif
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Moteur No-Code CREDIBILIS
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Collecte de Dossier Terrain
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Sélectionnez un profil et un produit : le formulaire se génère instantanément sans modifier le code.
          </p>
        </div>

        {/* Profil & Produit Switchers */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Profil emprunteur
            </label>
            <select
              value={selectedProfil}
              onChange={(e) => {
                setSelectedProfil(e.target.value);
                setSelectedProduit("");
                setValeursSaisies({ statut_logement: "PROPRIETAIRE" });
              }}
              className="bg-white border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 shadow-xs"
            >
              {profils.map((prof) => (
                <option key={prof.code} value={prof.code}>
                  {prof.libelle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Produit de crédit
            </label>
            <select
              value={selectedProduit || activeProduit?.code}
              onChange={(e) => setSelectedProduit(e.target.value)}
              className="bg-white border border-slate-300 text-emerald-800 text-xs font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 shadow-xs"
            >
              {produitsDuProfil.map((prod: ProduitConfig) => (
                <option key={prod.code} value={prod.code}>
                  {prod.libelle}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bannière de démonstration temps réel */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">MOTEUR DYNAMIQUE ACTIF :</span> Ce formulaire affiche{" "}
            <span className="text-emerald-950 font-black font-mono">
              {
                champs.filter(
                  (c) =>
                    (c.profils_applicables.includes(selectedProfil) ||
                      c.profils_applicables.includes("TOUS")) &&
                    c.actif
                ).length
              }{" "}
              champs
            </span>{" "}
            configurés pour le profil <span className="underline font-bold">{selectedProfil}</span>.
            Aucun champ n'est codé en dur dans le composant.
          </div>
        </div>
      </div>

      {/* FORMULAIRE DYNAMIQUE GÉNÉRÉ */}
      <form onSubmit={handleSubmitDossier} className="space-y-6">
        {sectionsApplicables.map((sec: SectionCollecte, secIdx: number) => {
          const champsSection = champs.filter(
            (c) =>
              c.section_id === sec.id &&
              (c.profils_applicables.includes(selectedProfil) ||
                c.profils_applicables.includes("TOUS")) &&
              c.actif
          );

          if (champsSection.length === 0) return null;

          return (
            <div
              key={sec.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
            >
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {secIdx + 1}
                    </span>
                    <h3 className="font-bold text-base text-slate-900">
                      {sec.titre}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 ml-8">
                    {sec.description}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {champsSection.length} champ{champsSection.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Grille des champs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {champsSection.map((champ) => {
                  const estVisible = evaluerConditionAffichage(champ);
                  if (!estVisible) return null;

                  const currentVal = valeursSaisies[champ.code] ?? "";
                  const prov = provenances[champ.code];

                  return (
                    <div
                      key={champ.id}
                      className="space-y-1.5 relative group bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-200/80 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{champ.libelle}</span>
                          {champ.obligatoire && (
                            <span className="text-rose-600 font-bold" title="Champ obligatoire">
                              *
                            </span>
                          )}
                        </label>

                        {/* Badges métadonnées 6 dimensions */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {champ.type_donnee}
                          </span>

                          {/* Bouton Provenance */}
                          <button
                            type="button"
                            onClick={() => setActiveProvenanceModal(champ.code)}
                            className={`p-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                              prov?.niveau === "VERIFIE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : prov?.niveau === "OBSERVE"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : prov?.niveau === "IMPORTE"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                                : "bg-white text-slate-500 border-slate-200 hover:text-slate-800"
                            }`}
                            title="Renseigner la source et niveau de vérification de la donnée"
                          >
                            <Shield className="w-3 h-3" />
                            <span>{prov?.niveau || "DECLARE"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Composant de saisie selon le type */}
                      {champ.type_donnee === "CHOIX_SIMPLE" && champ.options ? (
                        <select
                          value={currentVal}
                          onChange={(e) => handleInputChange(champ.code, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                          required={champ.obligatoire}
                        >
                          <option value="">Sélectionner une option...</option>
                          {champ.options.map((opt, i) => {
                            const optVal = typeof opt === "string" ? opt : opt.valeur;
                            const optLib = typeof opt === "string" ? opt : opt.libelle;
                            return (
                              <option key={optVal || i} value={optVal}>
                                {optLib}
                              </option>
                            );
                          })}
                        </select>
                      ) : champ.type_donnee === "MONTANT" ? (
                        <div className="relative">
                          <input
                            type="number"
                            value={currentVal}
                            onChange={(e) => handleInputChange(champ.code, e.target.value)}
                            placeholder="0"
                            className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-14 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                            required={champ.obligatoire}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">
                            FCFA
                          </span>
                        </div>
                      ) : champ.type_donnee === "DATE" ? (
                        <input
                          type="date"
                          value={currentVal}
                          onChange={(e) => handleInputChange(champ.code, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                          required={champ.obligatoire}
                        />
                      ) : champ.type_donnee === "ENTIER" || champ.type_donnee === "DECIMAL" ? (
                        <div className="relative">
                          <input
                            type="number"
                            step={champ.type_donnee === "DECIMAL" ? "0.1" : "1"}
                            value={currentVal}
                            onChange={(e) => handleInputChange(champ.code, e.target.value)}
                            placeholder="0"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                            required={champ.obligatoire}
                          />
                          {champ.unite && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">
                              {champ.unite}
                            </span>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => handleInputChange(champ.code, e.target.value)}
                          placeholder={`Saisir ${champ.libelle.toLowerCase()}...`}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                          required={champ.obligatoire}
                        />
                      )}

                      {/* Info bulle de la donnée */}
                      {champ.description && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5">
                          {champ.description}
                        </p>
                      )}

                      {/* Modal popover provenance pour ce champ */}
                      {activeProvenanceModal === champ.code && (
                        <div className="absolute top-12 right-0 z-30 w-72 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-900">
                              Traçabilité : {champ.libelle}
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveProvenanceModal(null)}
                              className="text-slate-400 hover:text-slate-600 text-xs"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase text-slate-500">
                              Niveau de vérification
                            </span>
                            {(["DECLARE", "OBSERVE", "VERIFIE", "IMPORTE"] as NiveauVerification[]).map(
                              (niv) => (
                                <button
                                  key={niv}
                                  type="button"
                                  onClick={() => handleSetProvenance(champ.code, niv)}
                                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                                    (prov?.niveau || "DECLARE") === niv
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold"
                                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                  }`}
                                >
                                  <span>{niv}</span>
                                  {(prov?.niveau || "DECLARE") === niv && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  )}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Boutons d'action */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>
              Les données seront classifiées et archivées avec leur niveau de preuve.
            </span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Valider & Créer le dossier</span>
          </button>
        </div>
      </form>
    </div>
  );
};
