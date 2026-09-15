import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMoney } from '../../utils/format'

// Comisión de referencia que ve el repartidor por entrega (se podría calcular server-side).
const COURIER_EARNING_RATE = 0.7

export default function AvailableOrders() {
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)
  const [courier, setCourier] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data: courierData } = await supabase
      .from('couriers')
      .select('*')
      .eq('user_id', session.user.id)
      .single()
    setCourier(courierData)

    const { data } = await supabase
      .from('orders')
      .select('*, stores(name, address)')
      .eq('status', 'listo_para_retirar')
      .is('courier_id', null)
      .order('created_at')
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (session) load()

    const channel = supabase
      .channel('available-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
      .subscribe()

    return () => supabase.removeChannel(channel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  async function toggleAvailability() {
    const { data, error } = await supabase
      .from('couriers')
      .update({ is_available: !courier.is_available })
      .eq('id', courier.id)
      .select()
      .single()
    if (!error) setCourier(data)
  }

  async function claimOrder(order) {
    const { error } = await supabase
      .from('orders')
      .update({ courier_id: courier.id, status: 'en_camino' })
      .eq('id', order.id)
      .is('courier_id', null)

    if (error) {
      toast.error('Ese pedido ya fue tomado por otro repartidor')
      load()
    } else {
      toast.success('¡Pedido asignado!')
      navigate(`/repartidor/entrega/${order.id}`)
    }
  }

  if (loading) return <Spinner className="py-20" />

  return (
    <div className="container-app">
      <Navbar
        title="Entregas disponibles"
        right={
          <button
            onClick={toggleAvailability}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 ${
              courier?.is_available ? 'bg-teal-100 text-teal-700' : 'bg-base-muted text-ink-faint'
            }`}
          >
            {courier?.is_available ? 'En línea' : 'Desconectado'}
          </button>
        }
      />

      {!courier?.is_available ? (
        <EmptyState
          icon="🛵"
          title="Estás desconectado"
          description="Conectate para empezar a recibir entregas disponibles."
          action={<button onClick={toggleAvailability} className="btn-accent">Conectarme</button>}
        />
      ) : (
        <div className="px-4 py-3 space-y-2">
          {orders.length === 0 && (
            <EmptyState icon="📭" title="No hay entregas por ahora" description="Te avisamos apenas aparezca una cerca tuyo." />
          )}
          {orders.map((order) => (
            <div key={order.id} className="card p-4">
              <p className="font-semibold text-sm">{order.stores?.name}</p>
              <p className="text-xs text-ink-faint mb-2">{order.stores?.address}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{formatMoney(order.delivery_fee * COURIER_EARNING_RATE)}</span>
                <button onClick={() => claimOrder(order)} className="btn-accent text-xs px-4 py-2">
                  Tomar entrega
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
