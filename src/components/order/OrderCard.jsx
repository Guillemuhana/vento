import { Link } from 'react-router-dom'
import { formatMoney, formatDateTime } from '../../utils/format'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../../utils/orderStatus'

export default function OrderCard({ order, to }) {
  return (
    <Link to={to} className="card p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-sm truncate">{order.stores?.name || 'Pedido'}</p>
        <p className="text-xs text-ink-faint">{formatDateTime(order.created_at)}</p>
        <p className="text-sm font-bold mt-1">{formatMoney(order.total)}</p>
      </div>
      <span className={`text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap ${ORDER_STATUS_COLOR[order.status]}`}>
        {ORDER_STATUS_LABEL[order.status]}
      </span>
    </Link>
  )
}
