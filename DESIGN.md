# Just Minutes — Spec visual (referencia: Rappi AR 8.39)

Documento de referencia para el rediseño del lado cliente. Se armó a partir de 8 capturas
de la app de Rappi que pasó Guillermo. Las imágenes finales (ilustraciones de categorías,
banners, fotos de comercios) las sube él; hasta entonces van placeholders.

## 1. Fundamentos

**Color**
- Fondo de app: `#F6F6F6` / blanco para superficies (`card`, sheets, nav).
- Acento principal: naranja (`mango-500 #FF4A12`) — tab activo, íconos activos, badges.
- Texto: `ink #101828` (títulos), `ink-soft #344054` (cuerpo), `ink-faint #667085` (meta).
- Amarillo promo `#FFE000` con texto negro para badges "ENVÍO GRATIS" / "Envío Gratis: mín $14mil".
- Títulos de sección grandes y coloreados por contexto (Ofertas en azul, Favoritos en naranja).

**Tipografía**
- Títulos de pantalla: 34-40px, bold, sin subtítulo (`Ofertas`, `Mis Favoritos`).
- Headings de sección: 22-24px bold (`Beneficios`, `Los mejores restaurantes en tu zona`).
- Cuerpo 15-16px, meta 13px.

**Formas**
- Radios generosos: cards 16-20px, chips/píldoras full-round, search bar full-round.
- Sombras suaves y difusas, nada de bordes duros. Los tiles de categoría van sin borde,
  con fondo pastel (durazno para Restaurantes, verde agua para Súper).

**Íconos**: line icons de trazo fino (no emojis). Las categorías del home usan
ilustraciones 3D sobre fondo pastel.

## 2. Bottom nav (todas las pantallas del cliente)

- Barra **flotante** (no pegada al borde): píldora blanca con sombra, separada ~12px del
  fondo y de los costados, respetando safe-area.
- 4 tabs: **Inicio · Ofertas · Favoritos · Cuenta**. Ícono line + label debajo.
- Tab activo: ícono relleno + label en naranja, con "pastilla" clara de fondo.
- A la derecha, **botón circular flotante separado** con lupa → abre el buscador full-screen.
- **Material**: no es blanco sólido. Es translúcido con `backdrop-blur` + saturación, así
  toma el tono de lo que pasa por detrás (cálido sobre una foto, blanco sobre fondo claro).
  Hay un fallback opaco para navegadores sin `backdrop-filter`.
- **Animación** (Framer Motion, en `src/components/layout/BottomNav.jsx`):
  - la pastilla del tab activo se **desliza** de un tab a otro con `layoutId` + resorte,
  - el ícono activo escala apenas y sube 1px,
  - tabs y lupa tienen respuesta al toque (`whileTap`),
  - la barra del carrito entra y sale con `AnimatePresence` y el contador late al cambiar,
  - todo envuelto en `MotionConfig reducedMotion="user"`: quien tenga las animaciones
    desactivadas en el sistema no las ve.

## 3. Home (`/`)

De arriba a abajo:
1. **Header de dirección**: ciudad en gris chico (`Córdoba`), calle + altura en bold 20px,
   y un botón circular con chevron para cambiar de dirección.
2. **Search bar**: píldora blanca alta (56px), sombra suave, lupa a la izquierda,
   placeholder rotativo tipo `Busca "Chocolate"`. Es un botón, abre el buscador full-screen.
3. **2 tiles grandes** (grid 2 columnas, ~1:1): Restaurantes (fondo durazno, label bordó)
   y Súper (fondo verde agua, label verde). Ilustración 3D arriba, label abajo a la izquierda.
4. **Carrusel de categorías chicas**: cards cuadradas ~100px con ilustración + label
   (Farmacia, Kiosco, RappiMall, Rappi Gift…), scroll horizontal sin scrollbar.
5. **Carrusel de banners promo**: imagen full-width, radio grande, con dots de paginación.
6. Debajo: secciones de comercios (carruseles horizontales).

## 4. Ofertas (`/ofertas`)

- Título grande `Ofertas`.
- Secciones con header propio: logo/lockup a la izquierda y botón píldora gris `Ver más`
  a la derecha (ej. "LOS MEJORES CON ENVÍO GRATIS").
- **Carrusel horizontal de StoreCards** (no lista vertical): card ancha ~460px con
  - foto 16:9 arriba, radio 16px,
  - badge amarillo superpuesto abajo-izquierda (`Envío Gratis: mín $14mil`),
  - nombre bold + rating `★ 4.90` a la derecha,
  - fila meta: `⚡ 12 min · [ENVÍO GRATIS] · 1.4 km`.

## 5. Favoritos (`/favoritos`)

- Título grande `Mis Favoritos` en naranja.
- **Empty state** centrado: ícono corazón en círculo gris, `¡Aún no tienes favoritos!` bold +
  subtítulo `Explora estas tiendas y elige tu primera favorita`.
- Debajo, sección de recomendados `Los mejores restaurantes en tu zona` con el mismo
  carrusel de StoreCards.
- El corazón para marcar favorito vive sobre la foto de cada comercio.

## 6. Cuenta (`/cuenta`)

1. **Bloque superior gris** con: avatar circular con iniciales (`GM`), nombre `Guillermo M.`,
   link `Editar perfil ›`, y **3 tiles de acceso rápido** (Pedidos, Ayuda, Métodos de pago):
   cuadrados blancos con ícono line grande arriba y label abajo.
2. Lista sobre fondo blanco, agrupada por secciones con heading bold 24px:
   - **Beneficios**: Créditos (con monto a la derecha), Cupones ›, Loyalty ›
   - **Mi cuenta**: Just Minutes Pro ›, Direcciones ›, Métodos de pago ›, Datos de
     facturación ›, Ayuda ›
   - **Configuración**: Idioma ›, Notificaciones ›
   - **Más información**: Quiero ser Aliado ›, Términos y Condiciones ›, Política de Privacidad ›
   - Cada fila: ícono line 24px + label + chevron, separador fino entre filas.
3. Botones al pie: `Cerrar sesión` (relleno gris) y `Cerrar todas las sesiones` (outline),
   ambos con ícono de salida.
4. Footer chico y gris: `Version 8.39 (130052)` + `Hecho con 🧡 en Córdoba`.
5. Al scrollear, aparece una **píldora negra flotante `↑ Volver arriba`** centrada.

## 7. Editar perfil (`/cuenta/perfil`)

- Header con back circular + título `Editar perfil`.
- Avatar grande centrado con iniciales + botón píldora `Editar imagen`.
- Campos con label arriba del input (no floating label): apodo, Nombre*, Apellido*,
  N° de identificación, Correo (bloqueado, con candado y leyenda verde
  `Email verificado con éxito`), Teléfono con selector de país, Fecha de nacimiento.
- Inputs de borde fino y radio 12px, con botón `×` para limpiar cuando tienen valor.
- **Botón `Guardar` sticky** al pie, deshabilitado (gris) hasta que haya cambios.

## 8. Buscador full-screen

- Se abre desde la lupa flotante o la search bar del home.
- Fila superior de **avatares circulares** de comercios recientes.
- `Recientes`: chips con ícono/thumbnail + texto.
- `Los más buscados`: chips con emoji + texto (Fernet, Cervezas, Asado, Helado, Pizza…).
- **El input va abajo**, pegado al teclado: píldora con lupa + botón `×` circular al lado
  para cerrar.

## 9. Decisiones tomadas

- **Carrito**: la nav copia los 4 tabs de la referencia, así que el carrito es una
  **barra flotante naranja** que aparece sobre la nav cuando hay items
  (`src/components/layout/CartBar.jsx`).
- **Íconos**: SVG inline propios en `src/components/ui/Icon.jsx`, sin librerías nuevas.
  Los 4 tabs tienen variante sólida para el estado activo.
- **Favoritos**: por ahora en el dispositivo (localStorage). La tabla `favorites` con RLS
  está lista en `supabase/migrations/002_perfil_y_favoritos.sql` para cuando queramos
  que sincronicen entre dispositivos.
- **Filas de Cuenta sin destino todavía** (Cupones, Loyalty, Direcciones, etc.) muestran un
  toast "Próximamente" en vez de romper la navegación.

## 10. Pantallas implementadas

| Pantalla | Ruta | Archivo |
| --- | --- | --- |
| Home | `/` | `src/pages/customer/Home.jsx` |
| Ofertas | `/ofertas` | `src/pages/customer/Offers.jsx` |
| Favoritos | `/favoritos` | `src/pages/customer/Favorites.jsx` |
| Cuenta | `/cuenta` | `src/pages/customer/Account.jsx` |
| Editar perfil | `/cuenta/perfil` | `src/pages/customer/EditProfile.jsx` |
| Buscador | `/buscar` | `src/pages/customer/Search.jsx` |
| Categoría | `/categoria/:slug` | `src/pages/customer/CategoryStores.jsx` |

## 11. Pendiente

- **Hecho**: las 15 ilustraciones de categorías y los íconos de la pantalla Cuenta.
  Los de Cuenta van inline en `src/components/ui/AccountIcons.jsx` (usan
  `currentColor`, así toman el color del estado).
- **Falta subir**: íconos de la nav (`nav/`), íconos sueltos (`ui/`), ícono de app
  (`app/`) y los banners. Ver `public/assets/iconos/LEEME.md`. Todos están
  enganchados vía `src/components/ui/AppIcon.jsx`: si el archivo existe se usa, si
  no se muestra el SVG de `src/components/ui/Icon.jsx`.
- Distancia en km en las cards: requiere lat/lng del cliente; hoy no se muestra.
- Panel de comercio / repartidor / admin: siguen con el diseño viejo.

## 12. Feed del home

Debajo de los banners, el home arma este stack de secciones. La lógica está en
`src/utils/feed.js` y todas las secciones se esconden solas si quedan vacías.

| Sección | De dónde sale |
| --- | --- |
| **Miércoles de descuentos locos** | Bloque amarillo con carrusel adentro (`PromoSection`). Comercios con `promo_label` o `free_delivery`. El día se configura en `PROMO_DEL_DIA` de `src/data/homeContent.js`; cuando cae ese día suma un badge "¡Es hoy!". |
| **Recomendados para vos** | Categorías de tus últimos 20 pedidos, las más repetidas primero. Sin historial, cae en los mejor puntuados. |
| **Inspirado en tus gustos** | Comercios de la misma categoría que tus favoritos, sin repetir los que ya marcaste. Sin favoritos, la sección no aparece. |
| **Los más populares** | Rating alto + entrega rápida. Es una aproximación: las políticas RLS no dejan contar los pedidos de otros usuarios, así que no hay un ranking real de ventas. |
| **Ahorrá y disfrutá** | Envío gratis primero, después pedido mínimo más bajo, y a igualdad el que llega antes. |

Los comercios cerrados quedan fuera de todas estas secciones.
