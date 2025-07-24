import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function ProfilePage() {
  const [objectifs, setObjectifs] = useState("");
  const [cadre, setCadre] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data } = await supabase
        .from("attentes")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setObjectifs(data.objectifs || "");
        setCadre(data.cadre || "");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setMessage("Veuillez vous connecter");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("attentes")
      .upsert({ user_id: user.id, objectifs, cadre });

    if (error) {
      setMessage("❌ Erreur : " + error.message);
    } else {
      setMessage("✅ Attentes mises à jour !");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSave}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-indigo-700">
          ✏️ Modifier mes attentes
        </h1>

        {message && <p>{message}</p>}

        <label className="block">
          <span className="font-medium">🎯 Mes objectifs</span>
          <textarea
            className="mt-2 w-full border rounded-lg p-3"
            value={objectifs}
            onChange={(e) => setObjectifs(e.target.value)}
          ></textarea>
        </label>

        <label className="block">
          <span className="font-medium">🌍 Cadre d’utilisation</span>
          <input
            className="mt-2 w-full border rounded-lg p-3"
            value={cadre}
            onChange={(e) => setCadre(e.target.value)}
          />
        </label>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg"
        >
          {loading ? "Enregistrement..." : "💾 Sauvegarder"}
        </button>
      </form>
    </div>
  );
}
