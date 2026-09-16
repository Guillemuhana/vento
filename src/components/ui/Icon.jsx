// Íconos de línea inline (sin librerías). Todos heredan color con `currentColor`
// y tamaño con la prop `size`. Los que tienen variante `filled` se usan en el tab activo.
function Svg({ size = 24, filled = false, children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M3.5 10.5 12 3.8l8.5 6.7V19a1.5 1.5 0 0 1-1.5 1.5h-3.5v-6h-7v6H5A1.5 1.5 0 0 1 3.5 19v-8.5Z" />
  </Svg>
)

export const IconOffers = (p) => (
  <Svg {...p}>
    <path d="M8.2 3.5 9.7 7.3l3.8 1.5-3.8 1.5-1.5 3.8-1.5-3.8L2.9 8.8l3.8-1.5L8.2 3.5Z" />
    <path d="M16.8 12.2l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
    <path d="M16.2 3.4v2.8M14.8 4.8h2.8" />
  </Svg>
)

export const IconFavorites = (p) => (
  <Svg {...p}>
    <path d="M5.5 7.5h13l-.9 11a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8l-.9-11Z" />
    <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
    <path d="M12 16.4s-2.4-1.5-2.4-3a1.3 1.3 0 0 1 2.4-.7 1.3 1.3 0 0 1 2.4.7c0 1.5-2.4 3-2.4 3Z" />
  </Svg>
)

export const IconAccount = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M4.8 20c.6-3.6 3.5-5.6 7.2-5.6s6.6 2 7.2 5.6" />
  </Svg>
)

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.4" />
    <path d="m16 16 4.2 4.2" />
  </Svg>
)

export const IconHeart = ({ filled = false, ...p }) => (
  <Svg {...p} filled={filled}>
    <path d="M12 20.2 4.7 13a4.4 4.4 0 0 1 6.2-6.2l1.1 1.1 1.1-1.1A4.4 4.4 0 0 1 19.3 13L12 20.2Z" />
  </Svg>
)

export const IconStar = (p) => (
  <Svg {...p} filled>
    <path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.8L12 3.6Z" />
  </Svg>
)

export const IconBolt = (p) => (
  <Svg {...p} filled>
    <path d="M13.5 2.5 5 13.2h5.2l-.7 8.3L18 10.8h-5.2l.7-8.3Z" />
  </Svg>
)

export const IconChevronRight = (p) => (
  <Svg {...p}><path d="m9.5 5.5 6.5 6.5-6.5 6.5" /></Svg>
)

export const IconChevronDown = (p) => (
  <Svg {...p}><path d="m5.5 9.5 6.5 6.5 6.5-6.5" /></Svg>
)

export const IconChevronLeft = (p) => (
  <Svg {...p}><path d="m14.5 5.5-6.5 6.5 6.5 6.5" /></Svg>
)

export const IconArrowUp = (p) => (
  <Svg {...p}><path d="M12 19.5v-15M5.5 11 12 4.5 18.5 11" /></Svg>
)

export const IconClose = (p) => (
  <Svg {...p}><path d="m6 6 12 12M18 6 6 18" /></Svg>
)

export const IconReceipt = (p) => (
  <Svg {...p}>
    <path d="M5.5 3.8 7.5 5l2-1.2L11.5 5l2-1.2L15.5 5l2-1.2v16.4l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2V3.8Z" />
    <path d="M8.5 10h7M8.5 13.5h4.5" />
  </Svg>
)

export const IconHeadset = (p) => (
  <Svg {...p}>
    <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
    <rect x="3" y="13" width="3.6" height="5.6" rx="1.6" />
    <rect x="17.4" y="13" width="3.6" height="5.6" rx="1.6" />
    <path d="M19.2 18.6v.6a2.4 2.4 0 0 1-2.4 2.4H13" />
  </Svg>
)

export const IconCard = (p) => (
  <Svg {...p}>
    <rect x="2.8" y="5.5" width="18.4" height="13" rx="3" />
    <path d="M2.8 10h18.4" />
  </Svg>
)

export const IconCredit = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M14.4 9.4a3 3 0 1 0 0 5.2" />
  </Svg>
)

export const IconTicket = (p) => (
  <Svg {...p}>
    <path d="M3.4 8.2A1.4 1.4 0 0 1 4.8 6.8h14.4a1.4 1.4 0 0 1 1.4 1.4v1.9a2.1 2.1 0 0 0 0 3.8v1.9a1.4 1.4 0 0 1-1.4 1.4H4.8a1.4 1.4 0 0 1-1.4-1.4v-1.9a2.1 2.1 0 0 0 0-3.8V8.2Z" />
    <path d="M9.6 10.2v3.6M14.4 10.2v3.6" />
  </Svg>
)

export const IconLoyalty = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m12 7.4 1.4 2.9 3.2.5-2.3 2.2.6 3.2-2.9-1.5-2.9 1.5.6-3.2-2.3-2.2 3.2-.5L12 7.4Z" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconCrown = (p) => (
  <Svg {...p}>
    <path d="M3.4 7.4 6.8 12l3.2-5.6L12 4l2 2.4L17.2 12l3.4-4.6v9.2a1.4 1.4 0 0 1-1.4 1.4H4.8a1.4 1.4 0 0 1-1.4-1.4V7.4Z" />
  </Svg>
)

export const IconPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s6.4-5.4 6.4-10.2A6.4 6.4 0 0 0 5.6 10.8C5.6 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.6" r="2.4" />
  </Svg>
)

export const IconInvoice = (p) => (
  <Svg {...p}>
    <rect x="4.6" y="3.4" width="14.8" height="17.2" rx="2.4" />
    <path d="M8.4 8.6h7.2M8.4 12.2h7.2M8.4 15.8h4.2" />
  </Svg>
)

export const IconGlobe = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M3.4 12h17.2M12 3.4c2.2 2.4 3.3 5.4 3.3 8.6S14.2 18.2 12 20.6c-2.2-2.4-3.3-5.4-3.3-8.6S9.8 5.8 12 3.4Z" />
  </Svg>
)

export const IconBell = (p) => (
  <Svg {...p}>
    <path d="M6.4 10.4a5.6 5.6 0 1 1 11.2 0c0 4 1.6 5.6 1.6 5.6H4.8s1.6-1.6 1.6-5.6Z" />
    <path d="M10.2 19a2 2 0 0 0 3.6 0" />
  </Svg>
)

export const IconStore = (p) => (
  <Svg {...p}>
    <path d="M4.4 9.6h15.2v9.4a1.4 1.4 0 0 1-1.4 1.4H5.8a1.4 1.4 0 0 1-1.4-1.4V9.6Z" />
    <path d="M3.4 9.6 5 4.6h14l1.6 5" />
    <path d="M9.8 20.4v-5.2h4.4v5.2" />
  </Svg>
)

export const IconInfo = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 11v5.2" />
    <circle cx="12" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconShield = (p) => (
  <Svg {...p}>
    <path d="M12 3.2 19 6v6c0 4.2-3 7.2-7 8.8-4-1.6-7-4.6-7-8.8V6l7-2.8Z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </Svg>
)

export const IconLogout = (p) => (
  <Svg {...p}>
    <path d="M14.4 4.6H6.8a1.8 1.8 0 0 0-1.8 1.8v11.2a1.8 1.8 0 0 0 1.8 1.8h7.6" />
    <path d="M16.6 8.6 20 12l-3.4 3.4M20 12h-9.4" />
  </Svg>
)

export const IconLock = (p) => (
  <Svg {...p}>
    <rect x="5.4" y="10.4" width="13.2" height="9.2" rx="2.4" />
    <path d="M8.6 10.4V7.8a3.4 3.4 0 0 1 6.8 0v2.6" />
  </Svg>
)

export const IconCart = (p) => (
  <Svg {...p}>
    <path d="M3.2 4.6h2.4l2.2 10.2h9.4l2-7.2H6.6" />
    <circle cx="9.4" cy="19" r="1.5" />
    <circle cx="16.6" cy="19" r="1.5" />
  </Svg>
)

export const IconTrash = (p) => (
  <Svg {...p}>
    <path d="M4.8 6.8h14.4M9.4 6.8V5a1.4 1.4 0 0 1 1.4-1.4h2.4A1.4 1.4 0 0 1 14.6 5v1.8" />
    <path d="M6.6 6.8 7.6 19a1.6 1.6 0 0 0 1.6 1.4h5.6A1.6 1.6 0 0 0 16.4 19l1-12.2" />
  </Svg>
)

export const IconCamera = (p) => (
  <Svg {...p}>
    <path d="M3.6 8.8h3.2l1.4-2.2h7.6l1.4 2.2h3.2v9.4a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6V8.8Z" />
    <circle cx="12" cy="13.4" r="3.2" />
  </Svg>
)

// ---------------------------------------------------------------------------
// Variantes sólidas: solo las usa el tab activo de la nav.
// ---------------------------------------------------------------------------
function SolidSvg({ size = 24, children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconHomeSolid = (p) => (
  <SolidSvg {...p}>
    <path d="M12 3.2 2.9 10.3a1 1 0 0 0-.4.8V19a2.5 2.5 0 0 0 2.5 2.5h3.9v-6.2h6.2v6.2H19a2.5 2.5 0 0 0 2.5-2.5v-7.9a1 1 0 0 0-.4-.8L12 3.2Z" />
  </SolidSvg>
)

export const IconOffersSolid = (p) => (
  <SolidSvg {...p}>
    <path d="M8.2 2.8 10 7.1l4.3 1.8-4.3 1.8-1.8 4.3-1.8-4.3L2.1 8.9 6.4 7.1l1.8-4.3Z" />
    <path d="M16.8 11.6 18 14.6l3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2 1.2-3Z" />
    <path d="M16.9 2.6v3.6h-1.4V2.6h1.4Z" />
    <path d="M18 5.1h-3.6V3.7H18v1.4Z" />
  </SolidSvg>
)

export const IconFavoritesSolid = (p) => (
  <SolidSvg {...p}>
    <path d="M9 7V6a3 3 0 0 1 6 0v1h1.6V6a4.6 4.6 0 1 0-9.2 0v1H9Z" />
    <path d="M4.8 7.6h14.4l-1 11.2a2.4 2.4 0 0 1-2.4 2.2H8.2a2.4 2.4 0 0 1-2.4-2.2L4.8 7.6Zm7.2 9.5s2.6-1.6 2.6-3.2a1.4 1.4 0 0 0-2.6-.8 1.4 1.4 0 0 0-2.6.8c0 1.6 2.6 3.2 2.6 3.2Z" />
  </SolidSvg>
)

export const IconHeartSolid = (p) => <IconHeart {...p} filled />

export const IconAccountSolid = (p) => (
  <SolidSvg {...p}>
    <circle cx="12" cy="7.8" r="3.8" />
    <path d="M12 13.6c-4.1 0-7.3 2.5-8 6.4a.8.8 0 0 0 .8 1h14.4a.8.8 0 0 0 .8-1c-.7-3.9-3.9-6.4-8-6.4Z" />
  </SolidSvg>
)
