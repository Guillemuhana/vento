import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { useT } from '../../i18n'

export default function Pro() {
  const session = useAuthStore((state) => state.session)
  const { t } = useT()
  const [subscription, setSubscription] = useState(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!session) return
    supabase
      .from('pro_subscriptions')
      .select('status, plan, price')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setSubscription(data))
  }, [session])

  async function requestSubscription() {
    setSending(true)
    const { data, error } = await supabase
      .from('pro_subscriptions')
      .upsert({ user_id: session.user.id, plan: 'mensual', status: 'pendiente', price: 4.99 }, { onConflict: 'user_id' })
      .select('status, plan, price')
      .single()
    setSending(false)
    if (error) {
      toast.error(t('pro.error'))
      return
    }
    setSubscription(data)
    toast.success(t('pro.requested'))
  }

  const requested = subscription?.status === 'pendiente'
  const active = subscription?.status === 'activa'

  return (
    <div className="container-app">
      <Navbar title={t('pro.title')} back />
      <div className="px-4 py-4 space-y-4">
        <section className="rounded-2xl bg-ink text-white p-5">
          <p className="text-sm text-white/70">Just Minutes</p>
          <h1 className="font-display font-bold text-3xl mt-1">{t('pro.title')}</h1>
          <p className="text-sm text-white/75 mt-2">{t('pro.description')}</p>
          <p className="font-bold text-2xl mt-5">$4.99 <span className="text-sm font-normal text-white/70">{t('pro.perMonth')}</span></p>
        </section>

        <section className="card p-4">
          <h2 className="font-display font-bold text-lg">{t('pro.includes')}</h2>
          <ul className="mt-3 space-y-3 text-sm text-ink-soft">
            <li>✓ {t('pro.benefit1')}</li>
            <li>✓ {t('pro.benefit2')}</li>
            <li>✓ {t('pro.benefit3')}</li>
            <li>✓ {t('pro.benefit4')}</li>
          </ul>
        </section>

        <button type="button" onClick={requestSubscription} disabled={sending || requested || active} className="btn-accent w-full">
          {active ? t('pro.active') : requested ? t('pro.pending') : sending ? t('pro.sending') : t('pro.request')}
        </button>
        <p className="text-xs text-ink-faint text-center">{t('pro.paymentNote')}</p>
      </div>
    </div>
  )
}
