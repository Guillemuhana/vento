// ---------------------------------------------------------------------------
// Contenido editable del home.
//
// Las ilustraciones están en `public/assets/categorias/`. El nombre del archivo
// es siempre <slug>.png, así que para agregar una categoría alcanza con subir la
// imagen y sumar una línea acá. Si el archivo falta, el tile muestra un
// placeholder con la inicial: nunca se rompe.
//
// IMPORTANTE: el `slug` tiene que coincidir con `stores.category` en la base,
// porque es lo que filtra la pantalla de categoría.
// ---------------------------------------------------------------------------

// Los 2 tiles grandes del home.
export const HERO_CATEGORIES = [
  {
    slug: 'comida',
    labelKey: 'cat.comida',
    image: '/assets/categorias/comida.png',
    bg: 'bg-tile-peach',
    text: 'text-tile-peachInk',
  },
  {
    slug: 'super',
    labelKey: 'cat.super',
    image: '/assets/categorias/super.png',
    bg: 'bg-tile-mint',
    text: 'text-tile-mintInk',
  },
]

// Carrusel de categorías chicas debajo de los tiles.
export const CATEGORIES = [
  // "envio-rapido" no es una categoría de comercio: es un filtro por tiempo de
  // entrega. La pantalla de categoría lo trata aparte (ver CategoryStores).
  { slug: 'envio-rapido', labelKey: 'cat.envio-rapido', image: '/assets/categorias/envio-rapido.png', bg: 'bg-tile-butter' },
  { slug: 'farmacia', labelKey: 'cat.farmacia', image: '/assets/categorias/farmacia.png', bg: 'bg-tile-mint' },
  { slug: 'panaderia', labelKey: 'cat.panaderia', image: '/assets/categorias/panaderia.png', bg: 'bg-tile-butter' },
  { slug: 'verduleria', labelKey: 'cat.verduleria', image: '/assets/categorias/verduleria.png', bg: 'bg-tile-mint' },
  { slug: 'carniceria', labelKey: 'cat.carniceria', image: '/assets/categorias/carniceria.png', bg: 'bg-tile-peach' },
  { slug: 'bebidas', labelKey: 'cat.bebidas', image: '/assets/categorias/bebidas.png', bg: 'bg-tile-lilac' },
  { slug: 'helado', labelKey: 'cat.helado', image: '/assets/categorias/helado.png', bg: 'bg-tile-peach' },
  { slug: 'mascotas', labelKey: 'cat.mascotas', image: '/assets/categorias/mascotas.png', bg: 'bg-tile-peach' },
  { slug: 'perfumeria', labelKey: 'cat.perfumeria', image: '/assets/categorias/perfumeria.png', bg: 'bg-tile-lilac' },
  { slug: 'tecnologia', labelKey: 'cat.tecnologia', image: '/assets/categorias/tecnologia.png', bg: 'bg-tile-lilac' },
  { slug: 'libreria', labelKey: 'cat.libreria', image: '/assets/categorias/libreria.png', bg: 'bg-tile-mint' },
  { slug: 'hogar', labelKey: 'cat.hogar', image: '/assets/categorias/hogar.png', bg: 'bg-tile-butter' },
  { slug: 'regalos', labelKey: 'cat.regalos', image: '/assets/categorias/regalos.png', bg: 'bg-tile-peach' },
]

// Banners promocionales. `to` es opcional (a dónde lleva el banner al tocarlo).
export const BANNERS = [
  {
    // Banner propio de la marca: la moto de Just Minutes en Miami. Sin
    // `storeName` no enlaza a ningún comercio, así que lleva a Ofertas.
    id: 'marca-moto',
    image: '/assets/banners/moto.png',
    titleKey: 'banner.moto.title',
    subtitleKey: 'banner.moto.subtitle',
    bg: 'bg-forest-600',
    to: '/ofertas',
    adPriority: 110,
  },
  {
    // Publicidad del restaurante. `storeName` hace que el banner enlace solo a la
    // ficha del comercio: el home lo resuelve contra los comercios cargados, así
    // no hay que hardcodear ningún id.
    id: 'fiorito',
    image: '/assets/banners/fiorito.jpg',
    titleKey: 'banner.fiorito.title',
    subtitleKey: 'banner.fiorito.subtitle',
    bg: 'bg-tile-peach',
    storeName: 'Fiorito',
    sponsored: true,
    adPriority: 100,
  },
  {
    id: 'fiorito-carne',
    image: '/assets/banners/WhatsApp Image 2026-09-16 at 2.40.27 PM.jpeg',
    titleKey: 'banner.fioritoCarne.title',
    subtitleKey: 'banner.fioritoCarne.subtitle',
    bg: 'bg-tile-peach',
    storeName: 'Fiorito',
    sponsored: true,
    adPriority: 90,
  },
  {
    id: 'fiorito-milanesa',
    image: '/assets/banners/WhatsApp Image 2026-09-16 at 2.40.27 PM (1).jpeg',
    titleKey: 'banner.fioritoMilanesa.title',
    subtitleKey: 'banner.fioritoMilanesa.subtitle',
    bg: 'bg-tile-peach',
    storeName: 'Fiorito',
    sponsored: true,
    adPriority: 80,
  },
  {
    id: 'fiorito-parrilla',
    image: '/assets/banners/WhatsApp Image 2026-09-16 at 2.40.27 PM (2).jpeg',
    titleKey: 'banner.fioritoParrilla.title',
    subtitleKey: 'banner.fioritoParrilla.subtitle',
    bg: 'bg-tile-peach',
    storeName: 'Fiorito',
    sponsored: true,
    adPriority: 70,
  },
  {
    id: 'fiorito-pulpo',
    image: '/assets/banners/WhatsApp Image 2026-09-16 at 2.40.27 PM (3).jpeg',
    titleKey: 'banner.fioritoPulpo.title',
    subtitleKey: 'banner.fioritoPulpo.subtitle',
    bg: 'bg-tile-peach',
    storeName: 'Fiorito',
    sponsored: true,
    adPriority: 60,
  },
  {
    id: 'fiorito-ribeye',
    image: '/assets/banners/WhatsApp Image 2026-09-16 at 2.40.28 PM.jpeg',
    titleKey: 'banner.fioritoRibeye.title',
    subtitleKey: 'banner.fioritoRibeye.subtitle',
    bg: 'bg-tile-peach',
    storeName: 'Fiorito',
  },
]

// Placeholders del buscador: se reemplazan solos cada unos segundos.
export const SEARCH_HINTS = ['Cafecito', 'Pizza', 'Sushi', 'Burgers', 'Açaí', 'Tacos']

// Chips de "Los más buscados" del buscador full-screen.
export const TOP_SEARCHES = [
  'Fernet',
  'Cervezas',
  'Asado',
  'Helado',
  'Pizza',
  'Sushi',
  'Queso',
  'Empanadas',
]

// Promo semanal destacada del home (el bloque amarillo con carrusel adentro).
// `dia`: 0 domingo, 1 lunes … 3 miércoles … 6 sábado. Cuando cae el día, la
// sección suma un badge "¡Es hoy!"; el resto de la semana se muestra igual.
// Para cambiarla de día o de nombre, es acá y nada más.
export const PROMO_DEL_DIA = {
  dia: 3,
  titleKey: 'home.promoTitle',
  subtitleKey: 'home.promoSubtitle',
  bg: 'bg-promo',
  text: 'text-ink',
}
