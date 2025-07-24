import { Link } from 'react-router-dom'
export default function LandingPage() {
  return <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100">
    <h1 className="text-4xl font-bold mb-4">English Pro Coach</h1>
    <p className="mb-8 text-lg text-center max-w-xl">Apprends l’anglais oral et écrit à ton rythme et progresse pour ton usage professionnel.</p>
    <div className="flex gap-4">
      <Link to="/auth?mode=login" className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">Se connecter</Link>
      <Link to="/auth?mode=signup" className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">S’inscrire</Link>
    </div>
  </div>
}
