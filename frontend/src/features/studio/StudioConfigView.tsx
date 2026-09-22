import React, { useState } from "react";
import {
  Plus,
  ToggleLeft,
  ToggleRight,
  X,
  Sprout,
  Briefcase,
  Store,
  Building2,
  Users2
} from "lucide-react";
import type {
  ProfilConfig,
  SectionCollecte,
  DefinitionChamp,
  CategorieMetier,
  TypeDonnee,
  Temporalite,
  RoleAnalytique,
  NiveauVerification,
  Sensibilite
} from "./studioTypes";

interface StudioProps {
  profils: ProfilConfig[];
  sections: SectionCollecte[];
  champs: DefinitionChamp[];
  produits?: any[];
  onUpdateChamps: (champs: DefinitionChamp[]) => void;
  onAddChamp: (champ: DefinitionChamp) => void;
  onSelectProfilForCollecte?: (profilCode: string) => void;
}

export const StudioConfigView: React.FC<StudioProps> = ({
  profils,
  sections,
  champs,
  onUpdateChamps,
  onAddChamp,
}) => {
  const [selectedProfil, setSelectedProfil] = useState<string>("SALARIE");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerSectionId, setDrawerSectionId] = useState<string>("sec_identite");

  // État du formulaire d'ajout de champ
  const [nouveauChamp, setNouveauChamp] = useState<Partial<DefinitionChamp>>({
    code: "",
    libelle: "",
    type_donnee: "TEXTE",
    categorie: "ACTIVITE",
    temporalite: "VALEUR_ACTUELLE",
    role_analytique: "VARIABLE_CANDIDATE",
    niveau_verification: "DECLARE",
    sensibilite: "NORMALE",
    obligatoire: false,
    profils_applicables: ["AGRICULTEUR"],
    actif: true,
  });

  const handleToggleChampActif = (champId: string) => {
    const updated = champs.map((c) => (c.id === champId ? { ...c, actif: !c.actif } : c));
    onUpdateChamps(updated);
  };

  const handleSaveNouveauChamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauChamp.libelle || !nouveauChamp.code) return;

    const champFinal: DefinitionChamp = {
      id: `champ_${Date.now()}`,
      code: nouveauChamp.code,
      libelle: nouveauChamp.libelle,
      description: nouveauChamp.description || "",
      type_donnee: (nouveauChamp.type_donnee as TypeDonnee) || "TEXTE",
      categorie: (nouveauChamp.categorie as CategorieMetier) || "ACTIVITE",
      temporalite: (nouveauChamp.temporalite as Temporalite) || "VALEUR_ACTUELLE",
      role_analytique: (nouveauChamp.role_analytique as RoleAnalytique) || "VARIABLE_CANDIDATE",
      niveau_verification: (nouveauChamp.niveau_verification as NiveauVerification) || "DECLARE",
      sensibilite: (nouveauChamp.sensibilite as Sensibilite) || "NORMALE",
      obligatoire: !!nouveauChamp.obligatoire,
      section_id: drawerSectionId,
      profils_applicables: nouveauChamp.profils_applicables || [selectedProfil],
      produits_applicables: ["TOUS"],
      actif: true,
      ordre: 99,
      unite: nouveauChamp.unite,
    };

    onAddChamp(champFinal);
    setIsDrawerOpen(false);
    setNouveauChamp({
      code: "",
      libelle: "",
      type_donnee: "TEXTE",
      categorie: "ACTIVITE",
      temporalite: "VALEUR_ACTUELLE",
      role_analytique: "VARIABLE_CANDIDATE",
      niveau_verification: "DECLARE",
      sensibilite: "NORMALE",
      obligatoire: false,
      profils_applicables: [selectedProfil],
      actif: true,
    });
  };

  const getProfileIcon = (code: string) => {
    switch (code) {
      case "AGRICULTEUR":
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case "SALARIE":
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case "COMMERCANT":
        return <Store className="w-4 h-4 text-amber-600" />;
      case "PME":
        return <Building2 className="w-4 h-4 text-indigo-600" />;
      default:
        return <Users2 className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête Studio */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Dictionnaire des Données
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Classification 6 Dimensions
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Définitions de Champs & Profils
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Ajoutez, activez ou désactivez des champs par profil métier.
          </p>
        </div>

        <button
          onClick={() => {
            setNouveauChamp((prev) => ({ ...prev, profils_applicables: [selectedProfil] }));
            setIsDrawerOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau champ ({selectedProfil})</span>
        </button>
      </div>

      {/* Onglets de Profils */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {profils.map((prof) => {
          const isSelected = selectedProfil === prof.code;
          const champsDuProfil = champs.filter(
            (c) =>
              c.profils_applicables.includes(prof.code) ||
              c.profils_applicables.includes("TOUS")
          );

          return (
            <button
              key={prof.code}
              onClick={() => setSelectedProfil(prof.code)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                {getProfileIcon(prof.code)}
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {champsDuProfil.length} champs
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 mt-2">{prof.libelle}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{prof.description}</p>
            </button>
          );
        })}
      </div>

      {/* Sections et Champs du profil sélectionné */}
      <div className="space-y-6">
        {sections.map((sec) => {
          const champsDeSection = champs.filter(
            (c) =>
              c.section_id === sec.id &&
              (c.profils_applicables.includes(selectedProfil) ||
                c.profils_applicables.includes("TOUS"))
          );

          return (
            <div key={sec.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{sec.titre}</h3>
                  <p className="text-xs text-slate-500">{sec.description}</p>
                </div>
                <button
                  onClick={() => {
                    setDrawerSectionId(sec.id);
                    setNouveauChamp((prev) => ({
                      ...prev,
                      profils_applicables: [selectedProfil],
                    }));
                    setIsDrawerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter à cette section</span>
                </button>
              </div>

              {champsDeSection.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Aucun champ configuré dans cette section pour le profil {selectedProfil}.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {champsDeSection.map((champ) => (
                    <div
                      key={champ.id}
                      className="py-3 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {champ.libelle}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            ({champ.code})
                          </span>
                          {champ.obligatoire && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              Obligatoire
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {champ.type_donnee}
                          </span>
                          <span>·</span>
                          <span>{champ.categorie}</span>
                          <span>·</span>
                          <span className="font-semibold text-slate-700">{champ.role_analytique}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleChampActif(champ.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                          {champ.actif ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                              Actif
                            </span>
                          ) : (
                            <span className="text-slate-400 flex items-center gap-1">
                              <ToggleLeft className="w-5 h-5" />
                              Inactif
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DRAWER AJOUT DE CHAMP */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Nouveau Champ</h3>
                <p className="text-xs text-slate-500">
                  Définition complète avec les 6 dimensions d'analyse
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNouveauChamp} className="flex-1 p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Libellé du champ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Acheteur principal"
                  value={nouveauChamp.libelle}
                  onChange={(e) => {
                    const lib = e.target.value;
                    const codeAuto = lib
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[^a-z0-9_]/g, "_")
                      .replace(/_+/g, "_")
                      .slice(0, 32);
                    setNouveauChamp({ ...nouveauChamp, libelle: lib, code: codeAuto });
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Code technique *
                </label>
                <input
                  type="text"
                  required
                  value={nouveauChamp.code}
                  onChange={(e) => setNouveauChamp({ ...nouveauChamp, code: e.target.value })}
                  className="w-full font-mono bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={nouveauChamp.type_donnee}
                    onChange={(e) =>
                      setNouveauChamp({ ...nouveauChamp, type_donnee: e.target.value as TypeDonnee })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="TEXTE">TEXTE</option>
                    <option value="ENTIER">ENTIER</option>
                    <option value="DECIMAL">DÉCIMAL</option>
                    <option value="MONTANT">MONTANT</option>
                    <option value="DATE">DATE</option>
                    <option value="CHOIX_SIMPLE">CHOIX_SIMPLE</option>
                    <option value="BOOLEEN">BOOLÉEN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={nouveauChamp.categorie}
                    onChange={(e) =>
                      setNouveauChamp({
                        ...nouveauChamp,
                        categorie: e.target.value as CategorieMetier,
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="ACTIVITE">ACTIVITÉ</option>
                    <option value="IDENTIFICATION">IDENTIFICATION</option>
                    <option value="FINANCIER">FINANCIER</option>
                    <option value="MENAGE">MÉNAGE</option>
                    <option value="GARANTIE">GARANTIE</option>
                    <option value="MARCHE">MARCHÉ</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
