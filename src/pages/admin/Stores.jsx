import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'

export default function Stores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('stores').select('*').order('created_at', { ascending: false })
    setStores(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleOpen(store) {
    const { error } = await supabase.from('stores').update({ is_open: !store.is_open }).eq('id', store.id)
    if (error) toast.error('No se pudo actualizar')
    else load()
  }

  if (loading) return <Spinner className="py-20" />

  return (
    <div className="container-app">
      <Navbar title="Comercios" back />
      <div className="px-4 py-3 space-y-2">
        {stores.map((s) => (
          <div key={s.id} className="card p-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{s.name}</p>
              <p className="text-xs text-ink-faint capitalize">{s.category}</p>
            </div>
            <button
              onClick={() => toggleOpen(s)}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 ${
                s.is_open ? 'bg-teal-100 text-teal-700' : 'bg-danger-400/10 text-danger-600'
              }`}
            >
              {s.is_open ? 'Abierto' : 'Cerrado'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
