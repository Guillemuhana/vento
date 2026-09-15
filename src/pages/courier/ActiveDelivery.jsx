import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMoney } from '../../utils/format'

export default function ActiveDelivery() {
  const { id } = useParams()
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coords, setCoords] = useState(null)

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

  // Simula el envío periódico de ubicación del repartidor a Supabase (courier_locations / couriers).
  useEffect(() => {
    if (!navigator.geolocation) return
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lng: longitude })
        const { data: courier } = await supabase
          .from('couriers')
          .select('id')
          .eq('user_id', session.user.id)
          .single()
        if (courier) {
          await supabase
            .from('couriers')
            .update({ current_lat: latitude, current_lng: longitude })
            .eq('id', courier.id)
        }
      },
      () => {},
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [session])

  async function markDelivered() {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'entregado' })
      .eq('id', id)
    if (error) {
      toast.error('No se pudo confirmar la entrega')
    } else {
      toast.success('¡Entrega confirmada!')
      navigate('/repartidor')
    }
  }

  if (loading) return <Spinner className="py-20" />
  if (!order) return null

  return (
    <div className="container-app">
      <Navbar title="Entrega activa" back />

      {coords && (
        <div className="h-48">
          <MapContainer center={[coords.lat, coords.lng]} zoom={14} className="h-full w-full" scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Tu ubicación</Popup>
            </Marker>
          </MapContainer>
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
            Cobrar: {order.payment_method === 'efectivo' ? formatMoney(order.total) : 'Ya pago (online)'}
          </p>
        </div>

        {order.status === 'en_camino' && (
          <button onClick={markDelivered} className="btn-accent w-full">
            Confirmar entrega
          </button>
        )}
        {order.status === 'entregado' && (
          <div className="text-center text-sm font-semibold text-teal-600 py-3">Entrega completada ✅</div>
        )}
      </div>
    </div>
  )
}
