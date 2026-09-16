import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Lista de pedidos filtrable por columna (customer_id, store_id, courier_id) + estados.
export function useOrders({ column, value, statuses } = {}) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!value) {
      setOrders([])
      setLoading(false)
      return
    }
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*, stores(name, logo_url), order_items(*)')
      .eq(column, value)
      .order('created_at', { ascending: false })

    if (statuses?.length) {
      query = query.in('status', statuses)
    }

    const { data, error } = await query
    if (!error) setOrders(data || [])
    setLoading(false)
  }, [column, value, statuses])

  useEffect(() => {
    load()
    if (!value) return

    const channel = supabase
      .channel(`orders-${column}-${value}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `${column}=eq.${value}` },
        () => load()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [column, value, load])

  return { orders, loading, reload: load }
}
