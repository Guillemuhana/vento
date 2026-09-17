import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Spinner from '../components/ui/Spinner'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/useAuthStore'
import { useT } from '../i18n'
import { formatDateTime, formatMoney } from '../utils/format'

export default function Loyalty() {
  const session = useAuthStore((state) => state.session)
  const profile = useAuthStore((state) => state.profile)
  const { t } = useT()
  const audience = profile?.role === 'repartidor' ? 'repartidor' : 'cliente'
  const [account, setAccount] = useState(null)
  const [ledger, setLedger] = useState([])
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [accountResult, ledgerResult, rewardsResult] = await Promise.all([
        supabase.from('loyalty_accounts').select('points, lifetime_points').eq('user_id', session.user.id).maybeSingle(),
        supabase
          .from('points_ledger')
          .select('id, points, multiplier, reason, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('rewards')
          .select('id, name, description, points_cost, discount_amount')
          .eq('audience', audience)
          .eq('active', true)
          .order('points_cost'),
      ])

      setAccount(accountResult.data)
      setLedger(ledgerResult.data || [])
      setRewards(rewardsResult.data || [])
      setLoading(false)
    }

    if (session) load()
  }, [audience, session])

  if (loading) return <Spinner className="py-20" />

  const points = account?.points || 0
  const lifetimePoints = account?.lifetime_points || 0
  const isCourier = audience === 'repartidor'

  return (
    <div className="container-app">
      <Navbar title={t('loyalty.title')} back />
      <div className="px-4 py-4 space-y-5">
        <section className="rounded-2xl bg-ink text-white p-5">
          <p className="text-sm text-white/70">{t('loyalty.available')}</p>
          <p className="font-display font-bold text-4xl mt-1">{points.toLocaleString()}</p>
          <p className="text-sm text-white/70 mt-1">{t('loyalty.points')}</p>
          <div className="flex justify-between border-t border-white/15 mt-5 pt-3 text-xs">
            <span>{t('loyalty.lifetime')}</span>
            <span className="font-semibold">{lifetimePoints.toLocaleString()}</span>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="font-display font-bold text-lg">{t('loyalty.howItWorks')}</h2>
          <p className="text-sm text-ink-soft mt-1">
            {isCourier ? t('loyalty.courierRule') : t('loyalty.customerRule')}
          </p>
          <p className="text-sm text-mango-600 font-semibold mt-3">{t('loyalty.tuesday')}</p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="section-title">{t('loyalty.rewards')}</h2>
            <span className="text-xs text-ink-faint">{t('loyalty.comingSoon')}</span>
          </div>
          <div className="space-y-2">
            {rewards.map((reward) => (
              <div key={reward.id} className="card p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-mango-50 flex items-center justify-center text-xl">🎁</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{reward.name}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{reward.description}</p>
                  {reward.discount_amount != null && (
                    <p className="text-xs text-mango-600 font-semibold mt-1">{formatMoney(reward.discount_amount)} {t('loyalty.discount')}</p>
                  )}
                </div>
                <span className="text-xs font-bold whitespace-nowrap">{reward.points_cost} pts</span>
              </div>
            ))}
            {!rewards.length && <p className="text-sm text-ink-faint">{t('loyalty.noRewards')}</p>}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-2">{t('loyalty.activity')}</h2>
          <div className="space-y-2">
            {ledger.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between border-b border-base-line py-3">
                <div>
                  <p className="text-sm font-medium">{entry.reason}</p>
                  <p className="text-xs text-ink-faint">{formatDateTime(entry.created_at)}</p>
                </div>
                <span className="font-bold text-teal-600">+{entry.points}</span>
              </div>
            ))}
            {!ledger.length && <p className="text-sm text-ink-faint">{t('loyalty.noActivity')}</p>}
          </div>
        </section>

        <Link to={isCourier ? '/repartidor' : '/'} className="btn-soft w-full">
          {t('loyalty.back')}
        </Link>
      </div>
    </div>
  )
}
