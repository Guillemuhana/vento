import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../../i18n'

// Carrusel de banners con snap y dots de paginación.
export default function PromoCarousel({ banners = [] }) {
  const railRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (banners.length < 2) return undefined

    const interval = window.setInterval(() => {
      const rail = railRef.current
      if (!rail) return

      setActive((current) => {
        const next = (current + 1) % banners.length
        rail.scrollTo({ left: next * rail.clientWidth, behavior: 'smooth' })
        return next
      })
    }, 2000)

    return () => window.clearInterval(interval)
  }, [banners.length])

  if (!banners.length) return null

  const onScroll = () => {
    const el = railRef.current
    if (!el) return
    setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div>
      <div
        ref={railRef}
        onScroll={onScroll}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {banners.map((banner) => (
          <Banner key={banner.id} banner={banner} />
        ))}
      </div>

      {banners.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {banners.map((banner, i) => (
            <span
              key={banner.id}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? 'w-4 bg-ink' : 'w-1.5 bg-base-line'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Banner({ banner }) {
  const { t } = useT()
  const [broken, setBroken] = useState(false)
  const content =
    banner.image && !broken ? (
      <img
        src={banner.image}
        alt={t(banner.titleKey)}
        onError={() => setBroken(true)}
        className="h-full w-full object-contain bg-base-muted"
      />
    ) : (
      <div className={`h-full w-full ${banner.bg || 'bg-base-muted'} flex flex-col justify-center px-6`}>
        <p className="font-display font-bold text-[30px] leading-none text-ink">{t(banner.titleKey)}</p>
        {banner.subtitleKey && (
          <p className="text-[15px] text-ink-soft mt-1">{t(banner.subtitleKey)}</p>
        )}
      </div>
    )

  const bannerContent = (
    <div className="relative h-full">
      {content}
      {banner.to && (
        <span className="absolute bottom-3 left-3 rounded-full bg-ink/85 px-4 py-2 text-[12px] font-bold text-white shadow-card backdrop-blur-sm">
          {t('banner.viewProducts')}
        </span>
      )}
    </div>
  )

  return (
    <div className="snap-start flex-shrink-0 w-full px-4">
      {banner.to ? (
        <Link to={banner.to} className="block rounded-2xl overflow-hidden aspect-[16/10] bg-base-muted">
          {bannerContent}
        </Link>
      ) : (
        <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-base-muted">{bannerContent}</div>
      )}
    </div>
  )
}
