import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../../i18n'

// Carrusel de banners con snap y dots de paginación.
export default function PromoCarousel({ banners = [] }) {
  const railRef = useRef(null)
  const [active, setActive] = useState(0)

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
        className="h-full w-full object-cover"
      />
    ) : (
      <div className={`h-full w-full ${banner.bg || 'bg-base-muted'} flex flex-col justify-center px-6`}>
        <p className="font-display font-bold text-[30px] leading-none text-ink">{t(banner.titleKey)}</p>
        {banner.subtitleKey && (
          <p className="text-[15px] text-ink-soft mt-1">{t(banner.subtitleKey)}</p>
        )}
      </div>
    )

  return (
    <div className="snap-start flex-shrink-0 w-full px-4">
      {banner.to ? (
        <Link to={banner.to} className="block rounded-2xl overflow-hidden aspect-[16/10] bg-base-muted">
          {content}
        </Link>
      ) : (
        <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-base-muted">{content}</div>
      )}
    </div>
  )
}
