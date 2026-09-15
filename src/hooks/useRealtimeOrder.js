import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Se suscribe a los cambios de UN pedido puntual (para la pantalla de seguimiento del cliente
// y del repartidor). Usa Supabase Realtime (Postgres Changes) sobre la tabla orders.
export function useRealtimeOrder(orderId) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return

    let active = true

    async function fetchOrder() {
      const { data } = await supabase
        .from('orders')
        .select('*, stores(name, address, lat, lng, logo_url), order_items(*), couriers(id, current_lat, current_lng, profiles(full_name, phone))')
        .eq('id', orderId)
        .single()
      if (active) {
        setOrder(data)
        setLoading(false)
      }
    }

    fetchOrder()

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          setOrder((prev) => (prev ? { ...prev, ...payload.new } : prev))
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'couriers' },
        (payload) => {
          setOrder((prev) =>
            prev && prev.couriers?.id === payload.new.id
              ? { ...prev, couriers: { ...prev.couriers, ...payload.new } }
              : prev
          )
        }
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [orderId])

  return { order, loading }
}
