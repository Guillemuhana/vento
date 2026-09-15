import Navbar from '../../components/layout/Navbar'
import OrderCard from '../../components/order/OrderCard'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useOrders } from '../../hooks/useOrders'
import { useAuthStore } from '../../store/useAuthStore'

export default function OrderHistory() {
  const session = useAuthStore((s) => s.session)
  const { orders, loading } = useOrders({ column: 'customer_id', value: session?.user?.id })

  return (
    <div className="container-app">
      <Navbar title="Mis pedidos" />
      <div className="px-4 py-3 space-y-2">
        {loading && <Spinner className="py-10" />}
        {!loading && orders.length === 0 && (
          <EmptyState icon="🧾" title="Todavía no hiciste pedidos" description="Cuando pidas algo, lo vas a ver acá." />
        )}
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} to={`/pedido/${order.id}`} />
        ))}
      </div>
    </div>
  )
}
