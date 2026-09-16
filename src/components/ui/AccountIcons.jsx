// Íconos de la pantalla Cuenta, dibujados por Guillermo.
// Vienen del set SVG que subió (trazo 1.9, grilla 24, puntas redondeadas).
//
// Van inline y no como <img> a propósito: los SVG usan `stroke="currentColor"`,
// así que de esta forma toman el color del contexto (gris, naranja al estar
// activo, blanco sobre fondo oscuro). Un <img> los pintaría siempre de negro.
function Line({ size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  )
}

export const IconPedidos = (p) => (
  <Line {...p}>
    <path d="M6 3.5h12v17H6z" />
    <path d="M8.5 3.5v3l1.7-1 1.8 1 1.8-1 1.7 1v-3M9 11h6M9 15h4" />
  </Line>
)

export const IconAyuda = (p) => (
  <Line {...p}>
    <path d="M4.5 13v-2a7.5 7.5 0 0 1 15 0v2" />
    <path d="M4.5 13v4h3v-5h-2M19.5 13v4h-3v-5h2M16.5 18.5c-1 1.3-2.5 2-4.5 2" />
  </Line>
)

export const IconMetodosPago = (p) => (
  <Line {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M3 10h18M7 15h4" />
  </Line>
)

export const IconCreditos = (p) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.3 14.5V9.5h2.2c1.6 0 2.5.9 2.5 2s-.9 2-2.5 2H8.3M14.5 9.5v5M14.5 9.5h1.6c1.3 0 2.1.8 2.1 2.5s-.8 2.5-2.1 2.5h-1.6" />
  </Line>
)

export const IconCupones = (p) => (
  <Line {...p}>
    <path d="M4 7.5A2.5 2.5 0 0 0 4 12v4.5h16V12a2.5 2.5 0 0 0 0-4.5V5H4z" />
    <path d="M12 5v2M12 10v2M12 15v1.5" />
  </Line>
)

export const IconLoyalty = (p) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m12 7 1.5 3 3.4.5-2.45 2.4.6 3.4L12 14.7l-3.05 1.6.6-3.4L7.1 10.5l3.4-.5z" />
  </Line>
)

export const IconDirecciones = (p) => (
  <Line {...p}>
    <path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0z" />
    <circle cx="12" cy="10" r="2.2" />
  </Line>
)

export const IconFacturacion = (p) => (
  <Line {...p}>
    <path d="M6 3.5h12v17H6z" />
    <path d="M8.5 3.5v3l1.7-1 1.8 1 1.8-1 1.7 1v-3M12 9v7M14.5 10.5c-.5-1-1.4-1.5-2.5-1.5-1.3 0-2.2.7-2.2 1.7 0 2.7 4.7.9 4.7 3.5 0 1.1-1 1.8-2.5 1.8-1.2 0-2.1-.5-2.7-1.5" />
  </Line>
)

export const IconIdioma = (p) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.8 12h16.4M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5S14.2 18.1 12 20.5M12 3.5C9.8 5.9 8.7 8.7 8.7 12s1.1 6.1 3.3 8.5" />
  </Line>
)

export const IconNotificaciones = (p) => (
  <Line {...p}>
    <path d="M7 10a5 5 0 0 1 10 0v4l2 2H5l2-2zM10 19h4" />
  </Line>
)

export const IconAliado = (p) => (
  <Line {...p}>
    <path d="M4 9h16v11H4zM3 9l2-5h14l2 5" />
    <path d="M3 9c0 1.5 1 2.5 2.3 2.5S7.7 10.5 7.7 9c0 1.5 1 2.5 2.3 2.5s2.3-1 2.3-2.5c0 1.5 1 2.5 2.4 2.5S17 10.5 17 9c0 1.5 1 2.5 2.3 2.5S21 10.5 21 9M9 20v-5h6v5" />
  </Line>
)

export const IconTerminos = (p) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 10.5v6M12 7.2h.01" />
  </Line>
)

export const IconPrivacidad = (p) => (
  <Line {...p}>
    <path d="M12 3.5 19 6v5c0 4.5-2.6 7.7-7 9.5-4.4-1.8-7-5-7-9.5V6z" />
    <path d="m8.7 12.2 2.2 2.2 4.5-5" />
  </Line>
)

export const IconCerrarSesion = (p) => (
  <Line {...p}>
    <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M18 12H9" />
  </Line>
)

export const IconPerfil = (p) => (
  <Line {...p}>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 20c.5-4 2.7-6 6.5-6s6 2 6.5 6" />
  </Line>
)
