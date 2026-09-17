import { NavLink, useNavigate } from 'react-router-dom'
import { motion, MotionConfig } from 'framer-motion'
import {
  IconHome,
  IconOffers,
  IconFavorites,
  IconAccount,
  IconSearch,
  IconHomeSolid,
  IconOffersSolid,
  IconFavoritesSolid,
  IconAccountSolid,
} from '../ui/Icon'
import AppIcon from '../ui/AppIcon'
import CartBar from './CartBar'
import { useT } from '../../i18n'

// `art` apunta a public/assets/iconos/nav/. El tab activo busca el mismo nombre
// con sufijo "-activo". Mientras esos archivos no existan, se usan los SVG de Icon.jsx.
const TABS = [
  { to: '/', labelKey: 'nav.home', art: 'nav/inicio', Icon: IconHome, Solid: IconHomeSolid, end: true },
  { to: '/ofertas', labelKey: 'nav.offers', art: 'nav/ofertas', Icon: IconOffers, Solid: IconOffersSolid },
  { to: '/favoritos', labelKey: 'nav.favorites', art: 'nav/favoritos', Icon: IconFavorites, Solid: IconFavoritesSolid },
  { to: '/cuenta', labelKey: 'nav.account', art: 'nav/cuenta', Icon: IconAccount, Solid: IconAccountSolid },
]

// Resorte corto: se siente vivo pero no rebota de más.
const spring = { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }

// La barra es translúcida con blur: toma el tono de lo que pasa por detrás
// (cálido sobre una foto, blanco sobre una pantalla clara), igual que la referencia.
const material =
  'bg-base/95 supports-[backdrop-filter]:bg-base/70 backdrop-blur-xl backdrop-saturate-150 border border-white/60 shadow-pill'

export default function BottomNav() {
  const navigate = useNavigate()
  const { t } = useT()

  return (
    // reducedMotion="user" respeta a quien tenga las animaciones desactivadas en el sistema.
    <MotionConfig reducedMotion="user">
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="ancho-app px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <CartBar />

          <div className="flex items-center gap-2.5 pointer-events-auto">
            {/* Píldora con los 4 tabs */}
            <nav className={`flex-1 rounded-full px-2 py-2 flex items-center ${material}`}>
              {TABS.map(({ to, labelKey, art, Icon, Solid, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className="relative flex-1 rounded-full py-2.5 outline-none"
                >
                  {({ isActive }) => (
                    <motion.span
                      whileTap={{ scale: 0.9 }}
                      transition={spring}
                      className="flex flex-col items-center justify-center gap-0.5"
                    >
                      {/* Indicador que se desliza de un tab al otro */}
                      {isActive && (
                        <motion.span
                          layoutId="jm-nav-activo"
                          transition={spring}
                          className="absolute inset-0 rounded-full bg-white/80 shadow-[0_1px_3px_rgba(16,24,40,0.10)]"
                        />
                      )}

                      <motion.span
                        animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -1 : 0 }}
                        transition={spring}
                        className={`relative z-10 ${isActive ? 'text-mango-500' : 'text-ink'}`}
                      >
                        <AppIcon
                          path={isActive ? `${art}-activo` : art}
                          fallback={isActive ? Solid : Icon}
                          size={23}
                        />
                      </motion.span>

                      <span
                        className={`relative z-10 text-[11px] leading-none transition-colors ${
                          isActive ? 'font-bold text-mango-500' : 'font-medium text-ink-soft'
                        }`}
                      >
                        {t(labelKey)}
                      </span>
                    </motion.span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Lupa flotante: abre el buscador full-screen */}
            <motion.button
              type="button"
              onClick={() => navigate('/buscar')}
              aria-label={t('nav.search')}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.04 }}
              transition={spring}
              className={`pointer-events-auto h-[64px] w-[64px] flex-shrink-0 rounded-full flex items-center justify-center text-ink ${material}`}
            >
              <AppIcon path="nav/buscar" fallback={IconSearch} size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
