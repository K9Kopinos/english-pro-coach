// api/generateQuestions.js
import 'dotenv/config'; // charge automatiquement le fichier .env
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Lire les paramètres du corps
  const { section, level, count } = req.body;
  if (!section || !level || !count) {
    return res.status(400).json({ error: "section, level et count sont requis." });
  }

  // 🔥 Test provisoire si pas de clé Hugging Face
  const HF_API_KEY = process.env.HF_API_KEY;
  if (!HF_API_KEY) {
    console.warn("⚠️ HF_API_KEY non défini, retour de questions factices !");
    const fakeQuestions = [
      { id: 1, question_text: `(${level}) Question de ${section} : Exemple 1`, type: "qcm", choices: ["A", "B", "C"] },
      { id: 2, question_text: `(${level}) Question de ${section} : Exemple 2`, type: "qcm", choices: ["X", "Y", "Z"] },
      { id: 3, question_text: `(${level}) Question de ${section} : Exemple 3`, type: "texte" }
    ];
    return res.status(200).json(fakeQuestions);
  }

  // Sélection du modèle Hugging Face selon la section
  let model = "t5-large";
  switch (section) {
    case "listening": // compréhension orale
      model = "openai/whisper-large-v3";
      break;
    case "reading": // compréhension écrite
      model = "t5-large";
      break;
    case "writing": // expression écrite
      model = "prithivida/grammar_error_correcter_v1";
      break;
    case "speaking": // expression orale
      model = "openai/whisper-large-v3";
      break;
    default:
      model = "t5-large";
  }

  // Prompt pour Hugging Face
  const prompt = `
Génère ${count} questions ou exercices en français pour la partie "${section}" pour un élève de niveau ${level} (CECRL).
Ne donne que les questions, sans explications supplémentaires.
`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur Hugging Face:", errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();

    // Extraire le texte généré
    let textOutput = "";
    if (Array.isArray(data)) {
      if (data[0]?.generated_text) {
        textOutput = data[0].generated_text;
      } else {
        textOutput = JSON.stringify(data);
      }
    } else if (data.generated_text) {
      textOutput = data.generated_text;
    } else {
      textOutput = JSON.stringify(data);
    }

    // Découper en questions
    const questions = textOutput
      .split(/\n|•|-/)
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .map((q, index) => ({
        id: index + 1,
        question_text: q,
        type: "texte"
      }));

    return res.status(200).json(questions);
  } catch (err) {
    console.error("Erreur API Hugging Face :", err);
    return res.status(500).json({ error: "Erreur lors de l'appel à Hugging Face" });
  }
}
console.log("🔑 HF_API_KEY détecté ?", process.env.HF_API_KEY ? "OK" : "NON");