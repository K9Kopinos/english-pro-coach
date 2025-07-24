import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1650&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative text-center text-white max-w-2xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Apprenez l’anglais professionnel avec <span className="text-blue-400">English Pro Coach</span>
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Un accompagnement personnalisé, des modules immersifs et des retours d’expérience concrets.
          </p>
          <div className="space-x-4">
            <Link
              to="/auth?mode=login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
            >
              Se connecter
            </Link>
            <Link
              to="/auth?mode=signup"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg transition"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials / Features */}
      <div className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Ce qu'ils en pensent</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-700 mb-4">
              “Grâce à English Pro Coach, j’ai pu progresser rapidement et être plus confiant dans mes échanges professionnels.”
            </p>
            <p className="font-semibold text-blue-600">– Marie, Consultante</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-700 mb-4">
              “Une plateforme claire et efficace, avec un vrai suivi personnalisé. Je recommande vivement !”
            </p>
            <p className="font-semibold text-blue-600">– Karim, Chef de projet</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-700 mb-4">
              “Des modules immersifs qui m’ont permis de comprendre l’anglais business plus rapidement que jamais.”
            </p>
            <p className="font-semibold text-blue-600">– Sophie, RH</p>
          </div>
        </div>
      </div>
    </div>
  );
}
