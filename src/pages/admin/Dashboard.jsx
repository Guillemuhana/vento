import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ count: stores }, { count: users }, { count: orders }, { count: couriers }] = await Promise.all([
        supabase.from('stores').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('couriers').select('id', { count: 'exact', head: true }),
      ])
      setStats({ stores, users, orders, couriers })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner className="py-20" />

  return (
    <div className="container-app">
      <Navbar title="Panel de administración" />
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold">{stats.stores}</p>
          <p className="text-xs text-ink-faint">Comercios</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold">{stats.users}</p>
          <p className="text-xs text-ink-faint">Usuarios</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold">{stats.orders}</p>
          <p className="text-xs text-ink-faint">Pedidos totales</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold">{stats.couriers}</p>
          <p className="text-xs text-ink-faint">Repartidores</p>
        </div>
      </div>
      <div className="px-4 space-y-2">
        <Link to="/admin/comercios" className="card p-4 flex items-center justify-between">
          <span className="font-semibold text-sm">🏪 Gestionar comercios</span>
          <span>→</span>
        </Link>
        <Link to="/admin/usuarios" className="card p-4 flex items-center justify-between">
          <span className="font-semibold text-sm">👥 Gestionar usuarios</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
