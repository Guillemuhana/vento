import { useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import OrderStatusTracker from '../../components/order/OrderStatusTracker'
import DeliveryMap from '../../components/order/DeliveryMap'
import { useRealtimeOrder } from '../../hooks/useRealtimeOrder'
import { formatMoney } from '../../utils/format'
import { distanciaKm } from '../../utils/geo'
import { useT } from '../../i18n'

export default function OrderTracking() {
  const { id } = useParams()
  const { t } = useT()
  const { order, loading } = useRealtimeOrder(id)

  if (loading) return <Spinner className="py-20" />
  if (!order) return null

  const courier = order.couriers
  const store = order.stores
  const courierPos =
    courier?.current_lat != null && courier?.current_lng != null
      ? { lat: courier.current_lat, lng: courier.current_lng, label: t('tracking.yourCourier') }
      : null
  const storePos =
    store?.lat != null && store?.lng != null
      ? { lat: store.lat, lng: store.lng, label: store.name }
      : null

  // Distancia entre el repartidor y el comercio, para dar una referencia real
  // del avance sin inventar un tiempo de llegada.
  const km = courierPos && storePos ? distanciaKm(courierPos, storePos) : null

  const enCurso = order.status !== 'entregado' && order.status !== 'cancelado'
  const mostrarMapa = Boolean(courierPos || storePos) && enCurso

  return (
    <div className="container-app">
      <Navbar title={order.stores?.name || t('tracking.yourOrder')} back />

      {mostrarMapa && (
        <div className="px-4 pb-1">
          <DeliveryMap
            courier={courierPos}
            store={storePos}
            height="h-72"
            className="rounded-2xl border border-base-line"
          />
          {courierPos ? (
            <p className="text-[13px] text-ink-faint mt-2 text-center">
              {t('tracking.liveLocation')}
              {km != null && ` · ${t('tracking.fromStore', { km: km.toFixed(1) })}`}
            </p>
          ) : (
            <p className="text-[13px] text-ink-faint mt-2 text-center">
              {t('tracking.waitingCourier')}
            </p>
          )}
        </div>
      )}

      <div className="px-4 py-4 space-y-5">
        <div className="card p-4">
          <OrderStatusTracker status={order.status} />
        </div>

        {courier?.profiles && (
          <div className="card p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-ink-faint">{t('tracking.yourCourier')}</p>
              <p className="font-semibold text-sm truncate">{courier.profiles.full_name}</p>
            </div>
            {courier.profiles.phone && (
              <a
                href={`tel:${courier.profiles.phone}`}
                className="btn-outline text-xs px-3 py-2 flex-shrink-0"
              >
                {t('common.call')}
              </a>
            )}
          </div>
        )}

        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">{t('tracking.detail')}</h3>
          <div className="space-y-1.5">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink-soft">
                  {item.quantity}x {item.product_name}
                </span>
                <span className="font-medium">
                  {formatMoney(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm pt-2 mt-2 border-t border-base-line text-ink-soft">
            <span>{t('common.delivery')}</span>
            <span>{formatMoney(order.delivery_fee)}</span>
          </div>
          <div className="flex justify-between font-bold pt-1">
            <span>{t('common.total')}</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-1">{t('tracking.deliveryAddress')}</h3>
          <p className="text-sm text-ink-soft">{order.delivery_address}</p>
        </div>
      </div>
    </div>
  )
}
