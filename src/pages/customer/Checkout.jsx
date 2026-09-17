import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { useCartStore } from '../../store/useCartStore'
import { useAuthStore } from '../../store/useAuthStore'
import { supabase } from '../../lib/supabase'
import { formatMoney } from '../../utils/format'
import { useT } from '../../i18n'

// Costo de envío en dólares. El servidor lo vuelve a aplicar al crear el pedido
// (ver supabase/migrations/008_seguridad.sql -> costo_envio_base), así que si
// cambia acá hay que cambiarlo también allá.
const DELIVERY_FEE = 3.99
const PAYMENT_METHODS = [
  { value: 'efectivo', icon: '💵' },
  { value: 'tarjeta', icon: '💳' },
  { value: 'billetera', icon: '📱' },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { t } = useT()
  const [params, setParams] = useSearchParams()
  const { items, storeId, storeName, subtotal, clear } = useCartStore()
  const profile = useAuthStore((s) => s.profile)
  const session = useAuthStore((s) => s.session)
  const [address, setAddress] = useState(profile?.address || '')
  const [payment, setPayment] = useState('efectivo')
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)
  const vueltaDeStripe = useRef(false)

  const total = subtotal() + DELIVERY_FEE

  // Vuelta desde la página de pago de Stripe: ?pago=exito|cancelado&pedido=<id>
  useEffect(() => {
    const pago = params.get('pago')
    const pedido = params.get('pedido')
    if (!pago || vueltaDeStripe.current) return
    vueltaDeStripe.current = true
    setParams({}, { replace: true })

    if (pago === 'exito' && pedido) {
      clear()
      toast.success(t('checkout.paymentProcessing'))
      navigate(`/pedido/${pedido}`, { replace: true })
      return
    }

    if (pago === 'cancelado') {
      toast(t('checkout.paymentCancelled'))
      // El pedido quedó creado y sin pagar: se cancela para que el comercio
      // no lo vea y para liberar la sesión de Stripe.
      if (pedido) {
        supabase.functions
          .invoke('cancel-checkout-session', { body: { orderId: pedido } })
          .catch(() => {})
      }
    }
  }, [params, setParams, clear, navigate, t])

  // Efectivo y billetera: el pedido se crea directo, como siempre.
  async function pedidoSinTarjeta() {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id: session.user.id,
        store_id: storeId,
        status: 'pendiente',
        subtotal: subtotal(),
        delivery_fee: DELIVERY_FEE,
        total,
        delivery_address: address,
        payment_method: payment,
        notes,
      })
      .select()
      .single()

    if (error) throw error

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      quantity: i.quantity,
      unit_price: i.price,
      notes: i.notes,
    }))
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    clear()
    toast.success(t('checkout.created'))
    navigate(`/pedido/${order.id}`)
  }

  // Tarjeta: el pedido y el cobro los arma la Edge Function, y el cliente
  // termina de pagar en la página de Stripe.
  async function pagarConTarjeta() {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        storeId,
        address: address.trim(),
        notes,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          notes: i.notes,
        })),
      },
    })
    if (error) throw new Error(t('checkout.paymentError'))
    if (data?.error) throw new Error(data.error)
    if (!data?.url) throw new Error(t('checkout.paymentError'))
    window.location.href = data.url
  }

  async function handlePlaceOrder() {
    if (!address.trim()) {
      toast.error(t('checkout.addressRequired'))
      return
    }
    if (!items.length) {
      toast.error(t('checkout.emptyCart'))
      return
    }
    setPlacing(true)
    try {
      if (payment === 'tarjeta') {
        await pagarConTarjeta()
        return // no se apaga el spinner: el navegador se va a Stripe
      }
      await pedidoSinTarjeta()
    } catch (err) {
      toast.error(err.message || t('checkout.error'))
    } finally {
      setPlacing(false)
    }
  }

  const textoBoton = placing
    ? payment === 'tarjeta'
      ? t('checkout.redirecting')
      : t('checkout.placing')
    : payment === 'tarjeta'
      ? t('checkout.pay', { total: formatMoney(total) })
      : t('checkout.place', { total: formatMoney(total) })

  return (
    <div className="container-app">
      <Navbar title={t('checkout.title')} back />
      <div className="px-4 py-4 space-y-5">
        <section>
          <h3 className="font-semibold text-sm mb-2">{t('checkout.address')}</h3>
          <textarea
            className="input-field"
            rows={2}
            placeholder={t('checkout.addressPlaceholder')}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </section>

        <section>
          <h3 className="font-semibold text-sm mb-2">{t('checkout.payment')}</h3>
          <p className="text-xs text-ink-faint mb-2">{t('checkout.paymentHint')}</p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setPayment(m.value)}
                className={`w-full flex items-center gap-3 rounded-xl border p-3 text-sm font-medium transition ${
                  payment === m.value ? 'border-ink bg-base-muted' : 'border-base-line'
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                {t(`pay.${m.value}`)}
              </button>
            ))}
          </div>
          {payment === 'tarjeta' && (
            <p className="text-xs text-ink-faint mt-2">{t('checkout.stripeNote')}</p>
          )}
        </section>

        <section>
          <h3 className="font-semibold text-sm mb-2">{t('checkout.notes')}</h3>
          <textarea
            className="input-field"
            rows={2}
            placeholder={t('checkout.notesPlaceholder')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <section className="card p-4 space-y-1.5">
          <h3 className="font-semibold text-sm mb-1">{t('checkout.summary', { store: storeName })}</h3>
          <div className="flex justify-between text-sm text-ink-soft">
            <span>{t('common.subtotal')}</span>
            <span>{formatMoney(subtotal())}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-soft">
            <span>{t('common.delivery')}</span>
            <span>{formatMoney(DELIVERY_FEE)}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-1 border-t border-base-line mt-1">
            <span>{t('common.total')}</span>
            <span>{formatMoney(total)}</span>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-base border-t border-base-line">
        <div className="max-w-md md:max-w-lg mx-auto">
          <button onClick={handlePlaceOrder} disabled={placing} className="btn-accent w-full">
            {textoBoton}
          </button>
        </div>
      </div>
    </div>
  )
}
