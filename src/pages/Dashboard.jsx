import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: "Vocabulaire Business",
      progress: 70,
      image:
        "https://images.unsplash.com/photo-1581093448798-5c5a4c2b5d89?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      title: "Réunions professionnelles",
      progress: 30,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      title: "Écrire des emails",
      progress: 90,
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=60",
    },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">English Pro Coach</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </header>

      {/* WELCOME */}
      <section className="p-6 text-center">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
          Bienvenue sur votre tableau de bord
        </h2>
        <p className="text-gray-600">
          Suivez vos modules et progressez à votre rythme.
        </p>
      </section>

      {/* MODULES */}
      <section className="p-6 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={mod.image}
              alt={mod.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {mod.title}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${mod.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{mod.progress}% terminé</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
