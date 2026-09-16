import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import EmptyState from '../../components/ui/EmptyState'
import { useCartStore } from '../../store/useCartStore'
import { formatMoney } from '../../utils/format'
import { useT } from '../../i18n'

export default function Cart() {
  const navigate = useNavigate()
  const { t } = useT()
  const { items, storeName, updateQuantity, removeItem, subtotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container-app">
        <Navbar title={t('cart.title')} />
        <EmptyState
          icon="🛒"
          title={t('cart.emptyTitle')}
          description={t('cart.emptyDesc')}
          action={
            <button onClick={() => navigate('/')} className="btn-primary">
              {t('cart.browse')}
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-app">
      <Navbar title={t('cart.title')} />
      <div className="px-4 py-3">
        <p className="text-xs text-ink-faint mb-3">{t('cart.orderFrom', { store: storeName })}</p>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={`${item.productId}-${item.notes}`} className="card p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                {item.notes && <p className="text-xs text-ink-faint">{item.notes}</p>}
                <p className="text-sm font-bold mt-0.5">{formatMoney(item.price * item.quantity)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.notes, item.quantity - 1)}
                  className="h-7 w-7 rounded-full bg-base-muted font-bold"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.notes, item.quantity + 1)}
                  className="h-7 w-7 rounded-full bg-base-muted font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 px-4">
        <div className="max-w-md md:max-w-lg mx-auto card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-faint">{t('common.subtotal')}</p>
            <p className="font-bold">{formatMoney(subtotal())}</p>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-accent">
            {t('common.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}
