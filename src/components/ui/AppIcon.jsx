import { useState } from 'react'

// Ícono de la app: usa el archivo subido a `public/assets/iconos/<path>.(svg|png)`
// y, si todavía no existe, cae en el ícono SVG que ya trae el código.
//
//   <AppIcon path="nav/inicio" fallback={IconHome} size={23} />
//
// Prueba primero .svg y después .png, así da igual en qué formato los subas.
const EXTENSIONS = ['svg', 'png']

export default function AppIcon({ path, fallback: Fallback, size = 24, className = '', alt = '' }) {
  const [attempt, setAttempt] = useState(0)

  if (!path || attempt >= EXTENSIONS.length) {
    return Fallback ? <Fallback size={size} className={className} /> : null
  }

  return (
    <img
      src={`/assets/iconos/${path}.${EXTENSIONS[attempt]}`}
      alt={alt}
      width={size}
      height={size}
      onError={() => setAttempt((a) => a + 1)}
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  )
}
