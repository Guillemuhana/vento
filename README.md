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

## 🚀 Demo ya conectada (Supabase)

Ya armé un proyecto de Supabase demo (`vento-demo`, plan free, región São Paulo) y le apliqué el schema completo (7 tablas + RLS + Realtime activado en `orders` y `couriers`).

```
VITE_SUPABASE_URL=https://pywtzrphjtjrtdgemyqv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5d3R6cnBoanRqcnRkZ2VteXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MDg2NjMsImV4cCI6MjEwNTA4NDY2M30.ZEjuKp01yM2Rmr3KmsWHAxLE9juhwTE76FiNzaVKYQs
```

Esta anon key está pensada para ser pública (queda protegida por las políticas RLS), pero por las dudas no la subí al repo — armá tu propio `.env` local:
```bash
cp .env.example .env
# pegá las dos líneas de arriba en .env
```

Este proyecto es solo para la demo: cuando pasemos a producción armamos uno nuevo (o promovemos este) y regeneramos las keys.

## Subir a GitHub

El repo ya está inicializado y commiteado localmente con el remoto apuntando a `https://github.com/Guillemuhana/vento.git`. Yo no tengo forma de autenticarme como vos en GitHub, así que el push lo hacés vos:

```bash
cd delivery-app
git push -u origin main
```

Si te pide credenciales, usá un Personal Access Token de GitHub como contraseña (o logueate con la extensión de GitHub en VS Code antes de pushear).

## Instalación

1. **Descomprimí el proyecto y entrá a la carpeta:**
   ```bash
   cd delivery-app
   npm install
   ```

2. **Configurá las variables de entorno** con las credenciales de la demo (ya creada, ver arriba):
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
