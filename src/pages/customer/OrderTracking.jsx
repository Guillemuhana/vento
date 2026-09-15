import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import OrderStatusTracker from '../../components/order/OrderStatusTracker'
import { useRealtimeOrder } from '../../hooks/useRealtimeOrder'
import { formatMoney } from '../../utils/format'

export default function OrderTracking() {
  const { id } = useParams()
  const { order, loading } = useRealtimeOrder(id)

  if (loading) return <Spinner className="py-20" />
  if (!order) return null

  const courierLat = order.couriers?.current_lat
  const courierLng = order.couriers?.current_lng
  const showMap = order.status === 'en_camino' && courierLat && courierLng

  return (
    <div className="container-app">
      <Navbar title={`Pedido de ${order.stores?.name}`} back />

      {showMap && (
        <div className="h-48">
          <MapContainer center={[courierLat, courierLng]} zoom={14} className="h-full w-full" scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[courierLat, courierLng]}>
              <Popup>{order.couriers?.profiles?.full_name || 'Tu repartidor'}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div className="px-4 py-4 space-y-5">
        <div className="card p-4">
          <OrderStatusTracker status={order.status} />
        </div>

        {order.couriers?.profiles && (
          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-faint">Tu repartidor</p>
              <p className="font-semibold text-sm">{order.couriers.profiles.full_name}</p>
            </div>
            {order.couriers.profiles.phone && (
              <a href={`tel:${order.couriers.profiles.phone}`} className="btn-outline text-xs px-3 py-2">
                Llamar
              </a>
            )}
          </div>
        )}

        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">Detalle del pedido</h3>
          <div className="space-y-1.5">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink-soft">{item.quantity}x {item.product_name}</span>
                <span className="font-medium">{formatMoney(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm pt-2 mt-2 border-t border-base-line text-ink-soft">
            <span>Envío</span>
            <span>{formatMoney(order.delivery_fee)}</span>
          </div>
          <div className="flex justify-between font-bold pt-1">
            <span>Total</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-1">Dirección de entrega</h3>
          <p className="text-sm text-ink-soft">{order.delivery_address}</p>
        </div>
      </div>
    </div>
  )
}
