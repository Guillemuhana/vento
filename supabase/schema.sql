-- ============================================================================
-- VENTO DELIVERY — Esquema de base de datos (Supabase / Postgres)
-- Ejecutar en el SQL Editor de tu proyecto de Supabase, en este orden.
-- ============================================================================

-- Extensiones necesarias
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Tipos
-- ----------------------------------------------------------------------------
create type user_role as enum ('cliente', 'comercio', 'repartidor', 'admin');

create type order_status as enum (
  'pendiente',
  'aceptado',
  'preparando',
  'listo_para_retirar',
  'en_camino',
  'entregado',
  'cancelado'
);

-- ----------------------------------------------------------------------------
-- Perfiles (extiende auth.users)
-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role user_role not null default 'cliente',
  address text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Comercios
-- ----------------------------------------------------------------------------
create table stores (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete cascade,
  name text not null,
  description text,
  category text not null default 'comida',
  logo_url text,
  cover_url text,
  address text,
  lat double precision,
  lng double precision,
  rating numeric(2,1) default 5.0,
  eta_minutes int default 25,
  is_open boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_stores_category on stores(category);
create index idx_stores_owner on stores(owner_id);

-- ----------------------------------------------------------------------------
-- Productos
-- ----------------------------------------------------------------------------
create table products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text,
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_products_store on products(store_id);

-- ----------------------------------------------------------------------------
-- Repartidores
-- ----------------------------------------------------------------------------
create table couriers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null unique,
  vehicle_type text default 'moto',
  is_available boolean not null default false,
  current_lat double precision,
  current_lng double precision,
  rating numeric(2,1) default 5.0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Pedidos
-- ----------------------------------------------------------------------------
create table orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references profiles(id) not null,
  store_id uuid references stores(id) not null,
  courier_id uuid references couriers(id),
  status order_status not null default 'pendiente',
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  delivery_address text not null,
  payment_method text not null default 'efectivo',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_customer on orders(customer_id);
create index idx_orders_store on orders(store_id);
create index idx_orders_courier on orders(courier_id);
create index idx_orders_status on orders(status);

-- ----------------------------------------------------------------------------
-- Ítems del pedido
-- ----------------------------------------------------------------------------
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id),
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  notes text
);

create index idx_order_items_order on order_items(order_id);

-- ----------------------------------------------------------------------------
-- Reseñas
-- ----------------------------------------------------------------------------
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null unique,
  customer_id uuid references profiles(id) not null,
  store_id uuid references stores(id) not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Trigger: updated_at automático en orders
-- ----------------------------------------------------------------------------
-- search_path fijo: lo pide el linter de seguridad de Supabase.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table profiles enable row level security;
alter table stores enable row level security;
alter table products enable row level security;
alter table couriers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;

-- Helper: rol del usuario autenticado actual
create or replace function public.current_role_is(target_role public.user_role)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = target_role
  );
$$;

-- ---- profiles ----
create policy "Perfil visible para el propio usuario" on profiles
  for select using (auth.uid() = id);

create policy "Comercios y repartidores visibles públicamente para pedidos" on profiles
  for select using (true); -- necesario para joins (nombre del repartidor, etc). Datos sensibles no se exponen acá.

create policy "El usuario crea su propio perfil" on profiles
  for insert with check (auth.uid() = id);

create policy "El usuario edita su propio perfil" on profiles
  for update using (auth.uid() = id);

-- ---- stores ----
create policy "Comercios visibles para todos" on stores
  for select using (true);

create policy "El dueño crea su comercio" on stores
  for insert with check (auth.uid() = owner_id);

create policy "El dueño edita su comercio" on stores
  for update using (auth.uid() = owner_id);

-- ---- products ----
create policy "Productos visibles para todos" on products
  for select using (true);

create policy "El dueño del comercio gestiona sus productos" on products
  for all using (
    exists (select 1 from stores where stores.id = products.store_id and stores.owner_id = auth.uid())
  );

-- ---- couriers ----
create policy "El repartidor ve y edita su propio registro" on couriers
  for all using (auth.uid() = user_id);

create policy "Ubicación del repartidor visible en pedidos asociados" on couriers
  for select using (
    exists (
      select 1 from orders
      where orders.courier_id = couriers.id
      and (orders.customer_id = auth.uid() or auth.uid() = couriers.user_id)
    )
  );

-- ---- orders ----
create policy "El cliente ve sus propios pedidos" on orders
  for select using (auth.uid() = customer_id);

create policy "El comercio ve los pedidos de su tienda" on orders
  for select using (
    exists (select 1 from stores where stores.id = orders.store_id and stores.owner_id = auth.uid())
  );

create policy "El repartidor ve pedidos disponibles o asignados" on orders
  for select using (
    courier_id is null
    or exists (select 1 from couriers where couriers.id = orders.courier_id and couriers.user_id = auth.uid())
  );

create policy "El cliente crea sus pedidos" on orders
  for insert with check (auth.uid() = customer_id);

create policy "El comercio actualiza el estado de sus pedidos" on orders
  for update using (
    exists (select 1 from stores where stores.id = orders.store_id and stores.owner_id = auth.uid())
  );

create policy "El repartidor toma y actualiza pedidos" on orders
  for update using (
    courier_id is null
    or exists (select 1 from couriers where couriers.id = orders.courier_id and couriers.user_id = auth.uid())
  );

-- ---- order_items ----
create policy "Ítems visibles si el pedido es visible" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and (
        orders.customer_id = auth.uid()
        or exists (select 1 from stores where stores.id = orders.store_id and stores.owner_id = auth.uid())
        or exists (select 1 from couriers where couriers.id = orders.courier_id and couriers.user_id = auth.uid())
      )
    )
  );

create policy "El cliente crea los ítems de su pedido" on order_items
  for insert with check (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.customer_id = auth.uid())
  );

-- ---- reviews ----
create policy "Reseñas visibles para todos" on reviews
  for select using (true);

create policy "El cliente reseña sus propios pedidos entregados" on reviews
  for insert with check (
    auth.uid() = customer_id
    and exists (select 1 from orders where orders.id = order_id and orders.status = 'entregado')
  );

-- ============================================================================
-- REALTIME
-- Habilitar replicación para las tablas que se siguen en vivo desde el front.
-- ============================================================================
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table couriers;
