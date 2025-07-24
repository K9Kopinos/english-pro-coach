import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function OnboardingPage() {
  const navigate = useNavigate();

  // états pour chaque champ
  const [contexte, setContexte] = useState("");
  const [domaine, setDomaine] = useState("");
  const [objectifs, setObjectifs] = useState("");
  const [delai, setDelai] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulte, setDifficulte] = useState("");
  const [temps, setTemps] = useState("");
  const [rythme, setRythme] = useState("progressif");
  const [attentes, setAttentes] = useState("");
  const [error, setError] = useState(null);

  // progression
  const steps = 3;
  const [currentStep, setCurrentStep] = useState(1);

  // Sauvegarde automatique
  async function saveDraft(data) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    await supabase
      .from("profiles")
      .upsert([{ user_id: userData.user.id, ...data }], {
        onConflict: "user_id",
      });
  }

  // Préremplissage depuis supabase
  useEffect(() => {
    async function loadDraft() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();
      if (data) {
        setContexte(data.contexte || "");
        setDomaine(data.domaine || "");
        setObjectifs(data.objectifs || "");
        setDelai(data.delai || "");
        setExperience(data.experience || "");
        setDifficulte(data.difficulte || "");
        setTemps(data.temps || "");
        setRythme(data.rythme || "progressif");
        setAttentes(data.attentes || "");
      }
    }
    loadDraft();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setError("Veuillez vous connecter d'abord.");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .upsert([
        {
          user_id: userData.user.id,
          contexte,
          domaine,
          objectifs,
          delai,
          experience,
          difficulte,
          temps,
          rythme,
          attentes,
        },
      ]);
    if (error) {
      setError(error.message);
    } else {
      navigate("/evaluation");
    }
  }

  // fonction pour barre de progression
  const progressPercentage = (currentStep / steps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎯 Vos objectifs
        </h1>
        {error && <p className="text-red-500">{error}</p>}

        {/* Progression */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Étape {currentStep} sur {steps}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <>
              <textarea
                className="border p-3 w-full rounded-lg"
                placeholder="Dans quel contexte utilisez-vous l’anglais ?"
                value={contexte}
                onChange={(e) => {
                  setContexte(e.target.value);
                  saveDraft({ contexte: e.target.value });
                }}
              />
              <input
                type="text"
                className="border p-3 w-full rounded-lg"
                placeholder="Dans quel domaine ?"
                value={domaine}
                onChange={(e) => {
                  setDomaine(e.target.value);
                  saveDraft({ domaine: e.target.value });
                }}
              />
              <textarea
                className="border p-3 w-full rounded-lg"
                placeholder="Quels sont vos objectifs précis ?"
                value={objectifs}
                onChange={(e) => {
                  setObjectifs(e.target.value);
                  saveDraft({ objectifs: e.target.value });
                }}
              />
              <input
                type="text"
                className="border p-3 w-full rounded-lg"
                placeholder="Sous quel délai ?"
                value={delai}
                onChange={(e) => {
                  setDelai(e.target.value);
                  saveDraft({ delai: e.target.value });
                }}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <textarea
                className="border p-3 w-full rounded-lg"
                placeholder="Quelle est votre expérience actuelle ?"
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  saveDraft({ experience: e.target.value });
                }}
              />
              <input
                type="text"
                className="border p-3 w-full rounded-lg"
                placeholder="Quelles difficultés rencontrez-vous ?"
                value={difficulte}
                onChange={(e) => {
                  setDifficulte(e.target.value);
                  saveDraft({ difficulte: e.target.value });
                }}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <input
                type="text"
                className="border p-3 w-full rounded-lg"
                placeholder="Combien d’heures par semaine ?"
                value={temps}
                onChange={(e) => {
                  setTemps(e.target.value);
                  saveDraft({ temps: e.target.value });
                }}
              />
              <select
                className="border p-3 w-full rounded-lg"
                value={rythme}
                onChange={(e) => {
                  setRythme(e.target.value);
                  saveDraft({ rythme: e.target.value });
                }}
              >
                <option value="progressif">Progressif</option>
                <option value="intensif">Intensif</option>
              </select>
              <textarea
                className="border p-3 w-full rounded-lg"
                placeholder="Autres attentes ou besoins spécifiques ?"
                value={attentes}
                onChange={(e) => {
                  setAttentes(e.target.value);
                  saveDraft({ attentes: e.target.value });
                }}
              />
            </>
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                ⬅️ Précédent
              </button>
            )}
            {currentStep < steps && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Suivant ➡️
              </button>
            )}
            {currentStep === steps && (
              <button
                type="submit"
                className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ✅ Terminer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
