import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useT } from '../../i18n'

// Tile de categoría. `size='hero'` son los dos grandes del home; 'sm' los del carrusel.
export default function CategoryTile({ category, size = 'hero' }) {
  const { t } = useT()
  const [broken, setBroken] = useState(false)
  const hero = size === 'hero'

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
