# ⏱️ Just Minutes

App de delivery para Miami (estilo Rappi/PedidosYa) construida con **React + Vite + Supabase**, con 3 roles de usuario (cliente, comercio, repartidor) y un panel de administración básico.

## Stack

- **Frontend:** React 18 + Vite + React Router + Tailwind CSS
- **Backend:** Supabase (Auth, Postgres, Row Level Security, Realtime)
- **Mapas:** Leaflet + OpenStreetMap (gratis, sin API key)
- **Estado:** Zustand (auth + carrito persistente)

## Funcionalidades

### Cliente
- Registro/login, explorar comercios por categoría y buscador
- Ver menú de un comercio, agregar al carrito
- Checkout con dirección, método de pago y notas
- Seguimiento del pedido **en tiempo real** (estado + mapa del repartidor cuando está en camino)
- Historial de pedidos y perfil

### Comercio
- Dashboard con métricas del día (pedidos pendientes, pedidos de hoy, facturación)
- Abrir/cerrar el local
- ABM de productos (crear, editar, marcar sin stock, eliminar)
- Gestión de pedidos entrantes en tiempo real: aceptar, rechazar, marcar en preparación, marcar listo
- Ajustes del comercio (nombre, categoría, dirección, tiempo estimado)

### Repartidor
- Conectarse/desconectarse para recibir entregas
- Ver y tomar pedidos listos para retirar (en tiempo real, con protección contra doble asignación)
- Pantalla de entrega activa con mapa de ubicación en vivo (geolocalización del navegador) y botón de confirmar entrega
- Historial de ganancias

### Admin
- Métricas globales (comercios, usuarios, pedidos, repartidores)
- Listado y gestión básica de comercios y usuarios

## 🚀 Supabase

El proyecto de la app es el de ref `irvugeydaygqxedlmuml`. Tiene aplicado el schema
completo: 8 tablas con RLS, Realtime en `orders` y `couriers`, las columnas de
perfil y promos, favoritos, el fix de recursión en las políticas y el trigger que
crea el perfil al registrarse.

Dashboard: https://supabase.com/dashboard/project/irvugeydaygqxedlmuml

```
VITE_SUPABASE_URL=https://irvugeydaygqxedlmuml.supabase.co
VITE_SUPABASE_ANON_KEY=<la anon key del proyecto, en Settings > API Keys>
```

La anon key es pública por diseño (la protegen las políticas RLS), pero el `.env`
igual no va al repo: está en `.gitignore`.

> **Ojo**: Vite lee el `.env` solo al arrancar. Si lo cambiás, reiniciá `npm run dev`
> o vas a seguir viendo "Failed to fetch" contra la URL vieja.

### Migraciones

El orden, si hay que rearmar la base desde cero (o pegá directo
`supabase/setup_completo.sql`, que es todo esto junto):

1. `supabase/schema.sql` — tablas, índices, trigger de `updated_at`, RLS y Realtime.
2. `002_perfil_y_favoritos.sql` — campos de perfil, promos de comercios
   (`free_delivery`, `promo_label`, `min_order`) y la tabla `favorites`.
3. `003_fix_recursion_rls.sql` — corta la recursión infinita entre las políticas de
   `couriers` y `orders`, y cierra el agujero que dejaba ver los pedidos sin
   repartidor a cualquier usuario logueado.
4. `004_perfil_al_registrarse.sql` — crea el perfil (y el comercio o el registro de
   repartidor, según el rol) con un trigger sobre `auth.users`. Sin esto el registro
   queda a medias cuando la confirmación de email está activada.

## GitHub y despliegue

El remoto es `https://github.com/Guillemuhana/vento.git` — el repo conserva el
nombre viejo, renombrarlo rompería el enlace con Vercel. El push ya funciona con
las credenciales cacheadas de la máquina:

```bash
cd delivery-app
git push origin main
```

Vercel está conectado a ese repo y despliega solo en cada push a `main`
(https://just-minutes.vercel.app). Las variables `VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY` se configuran en Vercel, no en el repo.

> Vite compila las variables dentro del bundle: cambiarlas en Vercel no hace
> nada hasta que se redeploye.

## Instalación

1. **Descomprimí el proyecto y entrá a la carpeta:**
   ```bash
   cd delivery-app
   npm install
   ```

2. **Configurá las variables de entorno** con las credenciales de arriba (el `.env` local ya está listo):
   ```bash
   cp .env.example .env
   ```
   Pegá las dos líneas de `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` de la sección anterior.

   Si más adelante querés tu propio proyecto de Supabase en vez del demo: creá uno en [supabase.com](https://supabase.com), corré `supabase/schema.sql` en su SQL Editor, y usá esas credenciales en el `.env`.


5. **Activá Realtime** (si no quedó activado por el script):
   - Supabase → Database → Replication → activá `orders` y `couriers`.

3. **Corré el proyecto:**
   ```bash
   npm run dev
   ```
   Abrí `http://localhost:5173`.

## Flujo de prueba sugerido

1. Registrate una vez como **comercio** → cargá productos en "Gestionar productos" → abrí el local.
2. Registrate en otra pestaña/navegador como **cliente** → hacé un pedido a ese comercio.
3. Como comercio: aceptá el pedido → marcalo en preparación → marcalo listo para retirar.
4. Registrate como **repartidor** → conectate → tomá la entrega → confirmá la entrega.
5. Como cliente: mirá la pantalla de seguimiento actualizarse en tiempo real en cada paso.

## Deploy

Pensada para deployar en **Vercel**:
```bash
npm run build
```
Subí el repo a GitHub y conectalo en Vercel, o usá `vercel --prod`. Recordá cargar las variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) en el proyecto de Vercel.

## Próximos pasos sugeridos

- Integrar pasarela de pago real (Mercado Pago Checkout Pro/API) en vez del selector simulado
- Notificaciones push (Web Push o Firebase Cloud Messaging) para nuevos pedidos y cambios de estado
- Cálculo real de distancia/tarifa de envío según coordenadas (actualmente es un valor fijo de ejemplo)
- Panel admin más completo (aprobar altas de comercios, ver comisiones, disputas)
- Subida de imágenes con Supabase Storage en vez de URLs manuales

## Estructura del proyecto

```
delivery-app/
├── supabase/
│   ├── schema.sql       # Tablas, RLS, triggers, realtime
│   └── seed.sql         # Datos de ejemplo opcionales
├── src/
│   ├── lib/supabase.js  # Cliente Supabase
│   ├── store/           # Zustand: auth y carrito
│   ├── hooks/           # useOrders, useRealtimeOrder
│   ├── components/      # UI, layout, tarjetas de comercio/producto/pedido
│   ├── pages/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── store-owner/
│   │   ├── courier/
│   │   └── admin/
│   ├── App.jsx           # Routing por rol
│   └── main.jsx
└── README.md
```

## Cuentas de demo

Los tres roles ya están creados en Supabase, con datos cargados
(12 comercios, 69 productos):

| Rol | Email | Contraseña |
| --- | --- | --- |
| Cliente | `cliente@vento.demo` | `vento1234` |
| Comercio (Fiorito) | `fiorito@vento.demo` | `vento1234` |
| Repartidor | `repartidor@vento.demo` | `vento1234` |

Son cuentas de demo: borralas antes de pasar a producción.

## Idiomas

La app arranca en **inglés** y se cambia a **castellano** desde
Cuenta → Configuración → Idioma. La elección queda guardada en el dispositivo.

- Los textos viven en `src/i18n/en.js` y `src/i18n/es.js` (mismas claves en los dos).
- Para agregar un idioma: copiá uno de esos archivos, sumalo a `DICCIONARIOS` y a
  `LANGUAGES` en `src/i18n/index.jsx`.
- Si falta una clave en un idioma, cae automáticamente al inglés.
- Los precios y fechas siguen el idioma activo: `$18.500` en castellano,
  `ARS 18,500` en inglés.

Los paneles de comercio, repartidor y admin quedaron en castellano salvo los
estados del pedido, que sí se traducen.
