import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const mode = new URLSearchParams(location.search).get('mode') || 'login';

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else navigate('/dashboard');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate('/dashboard');
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1606760226857-1d33b9dff7d3?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <Link to="/" className="text-3xl font-extrabold text-indigo-700">
            EnglishPro Coach
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {mode === 'signup' ? "Créer un compte" : 'Connexion'}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 transition"
          >
            {loading
              ? 'Chargement...'
              : mode === 'signup'
              ? "S'inscrire"
              : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {mode === 'signup' ? (
            <>
              Déjà inscrit ?{' '}
              <Link
                to="/auth?mode=login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Connectez-vous
              </Link>
            </>
          ) : (
            <>
              Pas encore de compte ?{' '}
              <Link
                to="/auth?mode=signup"
                className="text-indigo-600 font-medium hover:underline"
              >
                Inscrivez-vous
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
