import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { useCartStore } from '../../store/useCartStore'
import { useAuthStore } from '../../store/useAuthStore'
import { supabase } from '../../lib/supabase'
import { formatMoney } from '../../utils/format'

const DELIVERY_FEE = 800
const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo', icon: '💵' },
  { value: 'tarjeta', label: 'Tarjeta guardada', icon: '💳' },
  { value: 'mercadopago', label: 'MercadoPago', icon: '📲' },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { items, storeId, storeName, subtotal, clear } = useCartStore()
  const profile = useAuthStore((s) => s.profile)
  const session = useAuthStore((s) => s.session)
  const [address, setAddress] = useState(profile?.address || '')
  const [payment, setPayment] = useState('efectivo')
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)

  const total = subtotal() + DELIVERY_FEE

  async function handlePlaceOrder() {
    if (!address.trim()) {
      toast.error('Ingresá una dirección de entrega')
      return
    }
    setPlacing(true)
    try {
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
      toast.success('¡Pedido realizado!')
      navigate(`/pedido/${order.id}`)
    } catch (err) {
      toast.error(err.message || 'No pudimos crear el pedido')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="container-app">
      <Navbar title="Confirmar pedido" back />
      <div className="px-4 py-4 space-y-5">
        <section>
          <h3 className="font-semibold text-sm mb-2">Dirección de entrega</h3>
          <textarea
            className="input-field"
            rows={2}
            placeholder="Calle, número, piso/depto, referencias..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </section>

        <section>
          <h3 className="font-semibold text-sm mb-2">Método de pago</h3>
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
                {m.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-sm mb-2">Notas para el repartidor (opcional)</h3>
          <textarea
            className="input-field"
            rows={2}
            placeholder="Ej: timbre no funciona, dejar en portería..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <section className="card p-4 space-y-1.5">
          <h3 className="font-semibold text-sm mb-1">Resumen — {storeName}</h3>
          <div className="flex justify-between text-sm text-ink-soft">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal())}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-soft">
            <span>Envío</span>
            <span>{formatMoney(DELIVERY_FEE)}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-1 border-t border-base-line mt-1">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-base border-t border-base-line">
        <div className="max-w-md md:max-w-lg mx-auto">
          <button onClick={handlePlaceOrder} disabled={placing} className="btn-accent w-full">
            {placing ? 'Confirmando...' : `Confirmar pedido · ${formatMoney(total)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
