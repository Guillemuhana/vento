import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { useOrders } from '../../hooks/useOrders'
import { formatMoney, formatDateTime } from '../../utils/format'
import { useT } from '../../i18n'

const ACTIONS = {
  pendiente: [
    { label: 'Aceptar', next: 'aceptado', style: 'btn-accent' },
    { label: 'Rechazar', next: 'cancelado', style: 'btn-outline text-danger-500' },
  ],
  aceptado: [{ label: 'Empezar a preparar', next: 'preparando', style: 'btn-accent' }],
  preparando: [{ label: 'Marcar listo para retirar', next: 'listo_para_retirar', style: 'btn-accent' }],
}

export default function Orders() {
  const { t } = useT()
  const session = useAuthStore((s) => s.session)
  const [storeId, setStoreId] = useState(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('stores').select('id').eq('owner_id', session.user.id).single()
      setStoreId(data?.id)
    }
    if (session) load()
  }, [session])

  const { orders, loading, reload } = useOrders({
    column: 'store_id',
    value: storeId,
    statuses: ['pendiente', 'aceptado', 'preparando', 'listo_para_retirar', 'en_camino'],
  })

  async function updateStatus(orderId, status) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) {
      toast.error('No se pudo actualizar el pedido')
    } else {
      toast.success('Pedido actualizado')
      reload()
    }
  }

  if (loading || !storeId) return <Spinner className="py-20" />

  return (
    <div className="container-app">
      <Navbar title="Pedidos activos" back />
      <div className="px-4 py-3 space-y-3">
        {orders.length === 0 && (
          <EmptyState icon="🧾" title="No hay pedidos activos" description="Los nuevos pedidos van a aparecer acá en tiempo real." />
        )}
        {orders.map((order) => (
          <div key={order.id} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm">Pedido #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-ink-faint">{formatDateTime(order.created_at)}</p>
              </div>
              <span className="text-xs font-semibold bg-base-muted rounded-full px-2.5 py-1">
                {t(`status.${order.status}`)}
              </span>
            </div>
            <p className="text-sm font-bold mb-3">{formatMoney(order.total)}</p>
            <div className="border-t border-base-line pt-3 mb-3 space-y-1.5">
              {(order.order_items || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate">
                    <span className="font-semibold">{item.quantity}x</span> {item.product_name}
                  </span>
                  <span className="text-ink-soft flex-shrink-0">
                    {formatMoney(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {(ACTIONS[order.status] || []).map((action) => (
                <button
                  key={action.next}
                  onClick={() => updateStatus(order.id, action.next)}
                  className={`${action.style} flex-1 text-xs py-2`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
