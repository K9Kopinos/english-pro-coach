import 'dotenv/config';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const HF_API_KEY = process.env.HF_API_KEY;
  console.log("🔑 HF_API_KEY détecté ?", HF_API_KEY ? "OK" : "NON");
  if (!HF_API_KEY) {
    return res.status(500).json({ error: "HF_API_KEY manquant" });
  }

  const { section, level, count } = req.body;
  if (!section || !level || !count) {
    return res.status(400).json({ error: "section, level et count sont requis." });
  }

  let model = "t5-large";
  if (section === "listening" || section === "speaking") {
    model = "openai/whisper-large-v3";
  }
  if (section === "writing") {
    model = "prithivida/grammar_error_correcter_v1";
  }

  const prompt = `
    Génère ${count} questions pour la partie "${section}" pour un élève niveau ${level} (CECRL).
    Retourne uniquement la liste des questions claires en français.
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
    let textOutput = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      textOutput = data[0].generated_text;
    } else if (data.generated_text) {
      textOutput = data.generated_text;
    } else {
      textOutput = JSON.stringify(data);
    }

    const questions = textOutput
      .split(/\n|•|-/)
      .map(q => q.trim())
      .filter(q => q.length > 0);

    return res.status(200).json({ questions });
  } catch (err) {
    console.error("Erreur API Hugging Face :", err);
    return res.status(500).json({ error: "Erreur lors de l'appel à Hugging Face" });
  }
}
