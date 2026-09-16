import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import DeliveryMap from '../../components/order/DeliveryMap'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMoney } from '../../utils/format'
import { distanciaKm } from '../../utils/geo'

export default function ActiveDelivery() {
  const { id } = useParams()
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coords, setCoords] = useState(null)
  const [gpsError, setGpsError] = useState(null)
  const courierIdRef = useRef(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('orders')
        .select('*, stores(name, address, lat, lng), order_items(*)')
        .eq('id', id)
        .single()
      setOrder(data)
      setLoading(false)
    }
    load()
  }, [id])

  // Ubicación en vivo: se guarda en `couriers` para que el cliente la vea en su
  // pantalla de seguimiento (que escucha esa tabla por Realtime).
  useEffect(() => {
    if (!session?.user?.id) return
    if (!navigator.geolocation) {
      setGpsError('Este dispositivo no comparte ubicación')
      return
    }

    let cancelado = false

    async function iniciar() {
      // El id del repartidor se busca una sola vez, no en cada actualización.
      const { data: courier } = await supabase
        .from('couriers')
        .select('id')
        .eq('user_id', session.user.id)
        .single()
      if (!courier || cancelado) return
      courierIdRef.current = courier.id

      const watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          setCoords({ lat: latitude, lng: longitude })
          setGpsError(null)
          await supabase
            .from('couriers')
            .update({ current_lat: latitude, current_lng: longitude })
            .eq('id', courierIdRef.current)
        },
        () => setGpsError('No pudimos acceder a tu ubicación. Revisá los permisos.'),
        { enableHighAccuracy: true, maximumAge: 10000 }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }

    const limpieza = iniciar()
    return () => {
      cancelado = true
      limpieza.then((fn) => fn && fn())
    }
  }, [session?.user?.id])

  async function markDelivered() {
    const { error } = await supabase.from('orders').update({ status: 'entregado' }).eq('id', id)
    if (error) {
      toast.error('No se pudo confirmar la entrega')
    } else {
      toast.success('¡Entrega confirmada!')
      navigate('/repartidor')
    }
  }

  if (loading) return <Spinner className="py-20" />
  if (!order) return null

  const storePos =
    order.stores?.lat != null && order.stores?.lng != null
      ? { lat: order.stores.lat, lng: order.stores.lng, label: order.stores.name }
      : null
  const miPos = coords ? { ...coords, label: 'Vos' } : null
  const km = miPos && storePos ? distanciaKm(miPos, storePos) : null

  return (
    <div className="container-app">
      <Navbar title="Entrega activa" back />

      {(miPos || storePos) && (
        <div className="px-4 pb-1">
          <DeliveryMap
            courier={miPos}
            store={storePos}
            height="h-72"
            className="rounded-2xl border border-base-line"
          />
          <p className="text-[13px] text-ink-faint mt-2 text-center">
            {gpsError
              ? gpsError
              : miPos
                ? `Compartiendo tu ubicación${km != null ? ` · a ${km.toFixed(1)} km del comercio` : ''}`
                : 'Buscando tu ubicación…'}
          </p>
        </div>
      )}

      <div className="px-4 py-4 space-y-4">
        <div className="card p-4">
          <p className="text-xs text-ink-faint mb-1">Retirar en</p>
          <p className="font-semibold text-sm">{order.stores?.name}</p>
          <p className="text-sm text-ink-soft">{order.stores?.address}</p>
        </div>

        <div className="card p-4">
          <p className="text-xs text-ink-faint mb-1">Entregar en</p>
          <p className="text-sm text-ink-soft">{order.delivery_address}</p>
          {order.notes && <p className="text-xs text-ink-faint mt-1">Nota: {order.notes}</p>}
        </div>

        <div className="card p-4">
          <p className="text-xs text-ink-faint mb-2">Contenido del pedido</p>
          {order.order_items?.map((item) => (
            <p key={item.id} className="text-sm">
              {item.quantity}x {item.product_name}
            </p>
          ))}
          <p className="text-sm font-bold mt-2 pt-2 border-t border-base-line">
            Cobrar:{' '}
            {order.payment_method === 'efectivo' ? formatMoney(order.total) : 'Ya pago (online)'}
          </p>
        </div>

        {order.status === 'en_camino' && (
          <button onClick={markDelivered} className="btn-accent w-full">
            Confirmar entrega
          </button>
        )}
        {order.status === 'entregado' && (
          <div className="text-center text-sm font-semibold text-teal-600 py-3">
            Entrega completada
          </div>
        )}
      </div>
    </div>
  )
}
