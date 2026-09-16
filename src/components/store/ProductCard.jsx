import { formatMoney } from '../../utils/format'
import { useT } from '../../i18n'

export default function ProductCard({ product, onAdd }) {
  const { t } = useT()
  return (
    <div className="card flex gap-3 p-3">
      <div className="h-16 w-16 rounded-lg bg-base-muted flex-shrink-0 overflow-hidden flex items-center justify-center text-xl">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          '🍔'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">{product.name}</h4>
        {product.description && (
          <p className="text-xs text-ink-faint line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm font-bold">{formatMoney(product.price)}</span>
          <button
            onClick={() => onAdd(product)}
            disabled={!product.is_available}
            className="text-xs font-bold bg-mango-500 text-white rounded-full px-3 py-1.5 disabled:opacity-30 disabled:bg-ink-faint"
          >
            {product.is_available ? t('common.add') : t('common.outOfStock')}
          </button>
        </div>
      </div>
    </div>
  )
}
