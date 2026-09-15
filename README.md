# 💨 Vento Delivery

App de delivery completa (estilo Rappi/PedidosYa) construida con **React + Vite + Supabase**, con 3 roles de usuario (cliente, comercio, repartidor) y un panel de administración básico.

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

## Instalación

1. **Cloná/descomprimí el proyecto y entrá a la carpeta:**
   ```bash
   cd delivery-app
   npm install
   ```

2. **Creá un proyecto en [supabase.com](https://supabase.com)** (gratis).

3. **Corré el esquema de base de datos:**
   - Andá a tu proyecto de Supabase → **SQL Editor**
   - Pegá y ejecutá todo el contenido de `supabase/schema.sql`
   - (Opcional) Registrá un usuario "comercio" desde la app y después corré `supabase/seed.sql` para cargar productos de ejemplo

4. **Configurá las variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Completá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (los sacás de Supabase → Project Settings → API).

5. **Activá Realtime** (si no quedó activado por el script):
   - Supabase → Database → Replication → activá `orders` y `couriers`.

6. **Corré el proyecto:**
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
