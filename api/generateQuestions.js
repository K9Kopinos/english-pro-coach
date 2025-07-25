import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const SECTIONS = [
  { key: "reading", label: "Compréhension écrite" },
  { key: "listening", label: "Compréhension orale" },
  { key: "writing", label: "Expression écrite" },
  { key: "speaking", label: "Expression orale" },
];

export default function EvaluationPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // Charger l'utilisateur connecté
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Charger les questions via l'API custom
  useEffect(() => {
    if (!user) return;
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/generateQuestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: SECTIONS[currentStep].key,
            level: "A1", // tu peux récupérer le vrai niveau de l'élève plus tard
            count: 5,
          }),
        });
        const data = await res.json();

        if (Array.isArray(data.questions)) {
          const qObjects = data.questions.map((q, idx) => ({
            id: `gen-${currentStep}-${idx}`,
            question_text: q,
            type: "text", // par défaut
          }));
          setQuestions(qObjects);
        } else {
          console.warn("Réponse inattendue de l'API:", data);
          setQuestions([]);
        }
      } catch (err) {
        console.error("Erreur chargement questions:", err);
        setQuestions([]);
      }
      setLoading(false);
    };
    loadQuestions();
  }, [currentStep, user]);

  // Sauvegarde automatique des réponses dans Supabase
  async function saveAnswer(questionId, value) {
    if (!user) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    await supabase.from("answers").upsert(
      {
        user_id: user.id,
        question_id: questionId,
        answer_text: value,
      },
      { onConflict: "user_id,question_id" }
    );
  }

  const handleNext = async () => {
    await supabase.from("evaluation_progress").upsert(
      {
        user_id: user.id,
        section: SECTIONS[currentStep].key,
        completed: true,
      },
      { onConflict: "user_id,section" }
    );
    if (currentStep < SECTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Test d’évaluation
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Partie {currentStep + 1} sur {SECTIONS.length} :{" "}
          <span className="font-semibold">{SECTIONS[currentStep].label}</span>
        </p>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all"
            style={{
              width: `${((currentStep + 1) / SECTIONS.length) * 100}%`,
            }}
          ></div>
        </div>

        {loading ? (
          <p className="text-center">Chargement des questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-center text-gray-500">
            Aucune question disponible pour cette section et votre niveau.
          </p>
        ) : (
          <div className="space-y-6">
            {questions.map((q) => (
              <div
                key={q.id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <p className="font-medium mb-2 text-gray-800">
                  {q.question_text}
                </p>
                {q.type === "qcm" && q.choices ? (
                  <div className="space-y-2">
                    {q.choices.map((choice, i) => (
                      <label
                        key={i}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={choice}
                          checked={answers[q.id] === choice}
                          onChange={(e) => saveAnswer(q.id, e.target.value)}
                        />
                        <span>{choice}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="border p-2 w-full rounded"
                    rows={3}
                    value={answers[q.id] || ""}
                    onChange={(e) => saveAnswer(q.id, e.target.value)}
                    placeholder="Votre réponse"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            ⬅️ Précédent
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {currentStep === SECTIONS.length - 1
              ? "Terminer ✅"
              : "Suivant ➡️"}
          </button>
        </div>
      </div>
    </div>
  );
}
