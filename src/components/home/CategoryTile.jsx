import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useT } from '../../i18n'

// Tile de categoría.
//   - 'circle': la fila de accesos del home, como en las piezas de marca.
//   - 'hero'  : los dos grandes.
//   - 'sm'    : los del carrusel.
export default function CategoryTile({ category, size = 'hero' }) {
  const { t } = useT()
  const [broken, setBroken] = useState(false)
  const hero = size === 'hero'
  const circle = size === 'circle'

  // Acceso redondo: ícono dentro de un círculo y la etiqueta debajo.
  if (circle) {
    return (
      <Link
        to={`/categoria/${category.slug}`}
        className="flex w-[64px] flex-shrink-0 flex-col items-center gap-1.5 active:scale-95 transition"
      >
        <span className={`${category.bg} flex h-14 w-14 items-center justify-center rounded-full`}>
          {category.image && !broken ? (
            <img
              src={category.image}
              alt=""
              onError={() => setBroken(true)}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <span className="font-display text-lg font-bold text-ink-soft">
              {t(category.labelKey)[0]}
            </span>
          )}
        </span>
        <span className="w-full text-center text-[11px] font-semibold leading-tight text-ink">
          {t(category.labelKey)}
        </span>
      </Link>
    )
  }

  return (
    <Link
      to={`/categoria/${category.slug}`}
      className={`${category.bg} relative flex flex-col justify-between rounded-2xl overflow-hidden active:scale-[0.98] transition ${
        hero ? 'aspect-square p-4' : 'h-[112px] w-[108px] p-2.5'
      }`}
    >
      <div className="flex-1 flex items-center justify-center min-h-0">
        {category.image && !broken ? (
          <img
            src={category.image}
            alt=""
            onError={() => setBroken(true)}
            className={`object-contain drop-shadow-sm ${hero ? 'h-full max-h-[130px]' : 'h-[52px]'}`}
          />
        ) : (
          // Placeholder hasta que se suban las ilustraciones.
          <span
            className={`rounded-full bg-white/60 flex items-center justify-center font-display font-bold ${
              category.text || 'text-ink-soft'
            } ${hero ? 'h-24 w-24 text-3xl' : 'h-12 w-12 text-lg'}`}
          >
            {t(category.labelKey)[0]}
          </span>
        )}
      </div>
      <span
        className={`font-display font-semibold leading-tight ${category.text || 'text-ink'} ${
          hero ? 'text-[22px]' : 'text-[12px] text-center text-ink'
        }`}
      >
        {t(category.labelKey)}
      </span>
    </Link>
  )
}
