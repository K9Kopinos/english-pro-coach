import { useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
const supabase=createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY)
export default function Dashboard(){
  const navigate=useNavigate()
  const modules=[{name:'Module 1 - Bases de l’anglais',progress:0},{name:'Module 2 - Anglais professionnel',progress:0},{name:'Module 3 - Conversation avancée',progress:0}]
  async function handleLogout(){await supabase.auth.signOut();navigate('/')}
  return <div className="min-h-screen p-6 bg-gray-50">
    <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">Mon tableau de bord</h1>
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Se déconnecter</button></div>
    <div className="grid gap-4 md:grid-cols-3">{modules.map((m,i)=><div key={i} className="p-4 border rounded-lg shadow bg-white"><h2 className="text-xl font-semibold mb-2">{m.name}</h2>
      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden"><div className="bg-blue-500 h-3" style={{width:m.progress+'%'}}></div></div>
      <p className="mt-2 text-sm">{m.progress}% complété</p></div>)}</div>
  </div>
}
