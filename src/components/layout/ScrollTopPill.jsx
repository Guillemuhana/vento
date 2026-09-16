import { useEffect, useState } from 'react'
import { IconArrowUp } from '../ui/Icon'
import AppIcon from '../ui/AppIcon'
import { useT } from '../../i18n'

// Píldora negra "Volver arriba" que aparece al scrollear (captura 5 de la referencia).
export default function ScrollTopPill({ threshold = 400 }) {
  const { t } = useT()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  if (!visible) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-30 flex justify-center pointer-events-none">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-ink text-white text-[13px] font-semibold px-4 py-2.5 shadow-float animate-fade-up"
      >
        <AppIcon path="ui/flecha-arriba" fallback={IconArrowUp} size={16} />
        {t('nav.backToTop')}
      </button>
    </div>
  )
}
