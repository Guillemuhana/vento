import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMoney } from '../../utils/format'

export default function Dashboard() {
  const session = useAuthStore((s) => s.session)
  const [store, setStore] = useState(null)
  const [stats, setStats] = useState({ pendientes: 0, hoy: 0, facturadoHoy: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', session.user.id)
        .single()
      setStore(storeData)

      if (storeData) {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const [{ count: pendientes }, { data: hoyOrders }] = await Promise.all([
          supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('store_id', storeData.id)
            .eq('status', 'pendiente'),
          supabase
            .from('orders')
            .select('total')
            .eq('store_id', storeData.id)
            .gte('created_at', startOfDay.toISOString()),
        ])

        setStats({
          pendientes: pendientes || 0,
          hoy: hoyOrders?.length || 0,
          facturadoHoy: hoyOrders?.reduce((sum, o) => sum + Number(o.total), 0) || 0,
        })
      }
      setLoading(false)
    }
    if (session) load()
  }, [session])

  async function toggleOpen() {
    const { data, error } = await supabase
      .from('stores')
      .update({ is_open: !store.is_open })
      .eq('id', store.id)
      .select()
      .single()
    if (!error) {
      setStore(data)
      toast.success(data.is_open ? 'Tu comercio está abierto' : 'Tu comercio está cerrado')
    }
  }

  if (loading) return <Spinner className="py-20" />
  if (!store) return null

  return (
    <div className="container-app">
      <Navbar
        title={store.name}
        right={
          <button
            onClick={toggleOpen}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 ${
              store.is_open ? 'bg-teal-100 text-teal-700' : 'bg-danger-400/10 text-danger-600'
            }`}
          >
            {store.is_open ? 'Abierto' : 'Cerrado'}
          </button>
        }
      />

      <div className="px-4 py-4 grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <p className="text-lg font-extrabold">{stats.pendientes}</p>
          <p className="text-[11px] text-ink-faint">Pendientes</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-extrabold">{stats.hoy}</p>
          <p className="text-[11px] text-ink-faint">Pedidos hoy</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-extrabold">{formatMoney(stats.facturadoHoy)}</p>
          <p className="text-[11px] text-ink-faint">Facturado hoy</p>
        </div>
      </div>

      <div className="px-4 space-y-2">
        <Link to="/comercio/pedidos" className="card p-4 flex items-center justify-between">
          <span className="font-semibold text-sm">📋 Ver pedidos</span>
          <span>→</span>
        </Link>
        <Link to="/comercio/productos" className="card p-4 flex items-center justify-between">
          <span className="font-semibold text-sm">🍔 Gestionar productos</span>
          <span>→</span>
        </Link>
        <Link to="/comercio/ajustes" className="card p-4 flex items-center justify-between">
          <span className="font-semibold text-sm">⚙️ Ajustes del comercio</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
