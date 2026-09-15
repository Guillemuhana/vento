import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMoney } from '../../utils/format'

export default function Products() {
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)
  const [storeId, setStoreId] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('owner_id', session.user.id)
      .single()
    if (store) {
      setStoreId(store.id)
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })
      setProducts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (session) load()
  }, [session])

  async function toggleAvailable(product) {
    const { data, error } = await supabase
      .from('products')
      .update({ is_available: !product.is_available })
      .eq('id', product.id)
      .select()
      .single()
    if (!error) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? data : p)))
    }
  }

  async function handleDelete(product) {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) {
      toast.error('No se pudo eliminar')
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      toast.success('Producto eliminado')
    }
  }

  if (loading) return <Spinner className="py-20" />

  return (
    <div className="container-app">
      <Navbar
        title="Productos"
        back
        right={
          <button onClick={() => navigate('/comercio/productos/nuevo', { state: { storeId } })} className="text-xl">
            ＋
          </button>
        }
      />
      <div className="px-4 py-3 space-y-2">
        {products.length === 0 && (
          <EmptyState icon="🍔" title="Todavía no cargaste productos" description="Agregá tu primer producto para empezar a vender." />
        )}
        {products.map((p) => (
          <div key={p.id} className="card p-3 flex items-center gap-3">
            <div className="h-14 w-14 rounded-lg bg-base-muted flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
              {p.image_url ? <img src={p.image_url} className="h-full w-full object-cover" alt="" /> : '🍽️'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{p.name}</p>
              <p className="text-xs text-ink-faint capitalize">{p.category}</p>
              <p className="text-sm font-bold">{formatMoney(p.price)}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={() => toggleAvailable(p)}
                className={`text-[10px] font-semibold rounded-full px-2 py-1 ${
                  p.is_available ? 'bg-teal-100 text-teal-700' : 'bg-danger-400/10 text-danger-600'
                }`}
              >
                {p.is_available ? 'Disponible' : 'Sin stock'}
              </button>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => navigate('/comercio/productos/nuevo', { state: { storeId, product: p } })}
                  className="text-ink-soft font-semibold"
                >
                  Editar
                </button>
                <button onClick={() => handleDelete(p)} className="text-danger-500 font-semibold">
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
