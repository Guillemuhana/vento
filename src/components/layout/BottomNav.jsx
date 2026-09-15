import { NavLink } from 'react-router-dom'
import { useCartStore } from '../../store/useCartStore'

const TABS = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/pedidos', label: 'Pedidos', icon: '🧾' },
  { to: '/carrito', label: 'Carrito', icon: '🛒' },
  { to: '/perfil', label: 'Perfil', icon: '👤' },
]

export default function BottomNav() {
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-md md:max-w-lg mx-auto bg-base border-t border-base-line px-2 py-2 flex justify-between">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `relative flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive ? 'text-mango-500' : 'text-ink-faint'
              }`
            }
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
            {tab.to === '/carrito' && itemCount > 0 && (
              <span className="absolute -top-0.5 right-1/3 bg-mango-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
