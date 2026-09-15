import { Link } from 'react-router-dom'

export default function StoreCard({ store }) {
  return (
    <Link
      to={`/comercio/${store.id}`}
      className="card flex gap-3 p-3 hover:shadow-float transition"
    >
      <div className="h-20 w-20 rounded-lg bg-base-muted flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl">
        {store.logo_url ? (
          <img src={store.logo_url} alt={store.name} className="h-full w-full object-cover" />
        ) : (
          '🍽️'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">{store.name}</h3>
          {!store.is_open && (
            <span className="text-[10px] font-semibold text-danger-500 bg-danger-400/10 rounded-full px-2 py-0.5 flex-shrink-0">
              Cerrado
            </span>
          )}
        </div>
        <p className="text-xs text-ink-faint capitalize">{store.category}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-ink-soft">
          <span>⭐ {store.rating?.toFixed(1) || 'Nuevo'}</span>
          <span>·</span>
          <span>{store.eta_minutes || 25}-{(store.eta_minutes || 25) + 10} min</span>
        </div>
      </div>
    </Link>
  )
}
