import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import StoreCard from '../../components/store/StoreCard'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useAuthStore } from '../../store/useAuthStore'

const CATEGORIES = ['todos', 'comida', 'super', 'farmacia', 'bebidas', 'mascotas']

export default function Home() {
  const profile = useAuthStore((s) => s.profile)
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('todos')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase.from('stores').select('*').order('rating', { ascending: false })
      if (category !== 'todos') query = query.eq('category', category)
      const { data } = await query
      setStores(data || [])
      setLoading(false)
    }
    load()
  }, [category])

  const filtered = stores.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="container-app">
      <div className="px-4 pt-5 pb-3">
        <p className="text-xs text-ink-faint">Entregando en</p>
        <p className="font-semibold text-sm">📍 {profile?.address || 'Configurá tu dirección'}</p>
      </div>

      <div className="px-4 mb-3">
        <input
          className="input-field"
          placeholder="Buscar comercios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
              category === c ? 'bg-mango-500 text-white shadow-[0_2px_10px_rgba(255,74,18,0.35)]' : 'bg-base-muted text-ink-soft'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {loading && <Spinner className="py-10" />}
        {!loading && filtered.length === 0 && (
          <EmptyState icon="🔍" title="No encontramos comercios" description="Probá con otra categoría o búsqueda." />
        )}
        {!loading && filtered.map((store) => <StoreCard key={store.id} store={store} />)}
      </div>
    </div>
  )
}
