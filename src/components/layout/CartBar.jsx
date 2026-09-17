import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../../store/useCartStore'
import { formatMoney } from '../../utils/format'
import { IconCart } from '../ui/Icon'
import AppIcon from '../ui/AppIcon'
import { useT } from '../../i18n'

const spring = { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }

// Barra flotante que aparece sobre la nav cuando hay algo en el carrito.
// Reemplaza al tab de carrito (la nav sigue el layout de la referencia: 4 tabs + lupa).
export default function CartBar() {
  const { t } = useT()
  const itemCount = useCartStore((s) => s.itemCount())
  const subtotal = useCartStore((s) => s.subtotal())
  const storeName = useCartStore((s) => s.storeName)

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={spring}
          className="pointer-events-auto mb-2.5"
        >
          <motion.div whileTap={{ scale: 0.98 }} transition={spring}>
            <Link
              to="/carrito"
              className="flex items-center gap-3 rounded-full bg-mango-500 text-white pl-4 pr-3 py-3 shadow-[0_8px_24px_rgba(244,105,47,0.4)]"
            >
              <span className="relative flex-shrink-0">
                <AppIcon path="ui/carrito" fallback={IconCart} size={22} />
                {/* El contador late cada vez que cambia la cantidad */}
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 18 }}
                  className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-white text-mango-600 text-[10px] font-bold flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] font-bold leading-tight">{t('nav.viewCart')}</span>
                {storeName && (
                  <span className="block text-[11px] text-white/80 truncate leading-tight">
                    {storeName}
                  </span>
                )}
              </span>
              <span className="font-bold text-sm flex-shrink-0">{formatMoney(subtotal)}</span>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
