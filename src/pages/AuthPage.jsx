import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
export default function AuthPage(){
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [loading,setLoading]=useState(false);const [error,setError]=useState(null)
  const location=useLocation();const navigate=useNavigate();const mode=new URLSearchParams(location.search).get('mode')||'login'
  async function handleAuth(e){e.preventDefault();setLoading(true);setError(null)
    if(mode==='signup'){const {error}=await supabase.auth.signUp({email,password});if(error)setError(error.message);else navigate('/dashboard')}
    else{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)setError(error.message);else navigate('/dashboard')}
    setLoading(false)
  }
  return <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <form onSubmit={handleAuth} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-4">{mode==='signup'?"S'inscrire":"Se connecter"}</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input type="email" className="border rounded w-full p-2 mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input type="password" className="border rounded w-full p-2 mb-3" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button disabled={loading} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">{loading?'Chargement...':mode==='signup'?"S'inscrire":"Se connecter"}</button>
    </form>
  </div>
}
