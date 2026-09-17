import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { formatMoney, formatDateTime } from '../../utils/format'
import { useT } from '../../i18n'

const COURIER_EARNING_RATE = 0.7

export default function Earnings() {
  const { t } = useT()
  const session = useAuthStore((s) => s.session)
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: courier } = await supabase
        .from('couriers')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (courier) {
        const { data } = await supabase
          .from('orders')
          .select('id, total, delivery_fee, created_at, stores(name)')
          .eq('courier_id', courier.id)
          .eq('status', 'entregado')
          .order('created_at', { ascending: false })
        setDeliveries(data || [])
      }
      setLoading(false)
    }
    if (session) load()
  }, [session])

  const totalEarned = deliveries.reduce((sum, d) => sum + d.delivery_fee * COURIER_EARNING_RATE, 0)

  if (loading) return <Spinner className="py-20" />

  return (
    <div className="container-app">
      <Navbar title="Mis ganancias" />
      <div className="px-4 py-4">
        <div className="card p-4 mb-4 text-center">
          <p className="text-xs text-ink-faint">Total acumulado</p>
          <p className="text-2xl font-extrabold">{formatMoney(totalEarned)}</p>
          <p className="text-xs text-ink-faint mt-1">{deliveries.length} entregas completadas</p>
        </div>

        <Link to="/beneficios" className="card p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{t('loyalty.title')}</p>
            <p className="text-xs text-ink-faint mt-1">{t('loyalty.courierRule')}</p>
          </div>
          <span className="text-mango-500 text-xl">›</span>
        </Link>

        <div className="space-y-2">
          {deliveries.length === 0 && (
            <EmptyState icon="💰" title="Todavía no completaste entregas" description="Tus ganancias van a aparecer acá." />
          )}
          {deliveries.map((d) => (
            <div key={d.id} className="card p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">{d.stores?.name}</p>
                <p className="text-xs text-ink-faint">{formatDateTime(d.created_at)}</p>
              </div>
              <p className="font-bold text-sm">{formatMoney(d.delivery_fee * COURIER_EARNING_RATE)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
