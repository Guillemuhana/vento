-- ============================================================================
-- 002 — Campos del perfil, promos de comercios y favoritos
-- Correr en el SQL Editor de Supabase después de schema.sql.
-- Todo es aditivo: no toca datos existentes.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Perfil: campos que pide la pantalla "Editar perfil"
-- ----------------------------------------------------------------------------
alter table profiles add column if not exists nickname text;
alter table profiles add column if not exists social_id text;
alter table profiles add column if not exists birth_date date;
alter table profiles add column if not exists city text;

-- ----------------------------------------------------------------------------
-- Comercios: promos que se muestran en las cards (badge amarillo y "envío gratis")
-- ----------------------------------------------------------------------------
alter table stores add column if not exists free_delivery boolean not null default false;
alter table stores add column if not exists promo_label text;
alter table stores add column if not exists min_order numeric(10,2);

create index if not exists idx_stores_free_delivery on stores(free_delivery) where free_delivery;

-- ----------------------------------------------------------------------------
-- Favoritos (hoy la app los guarda en el dispositivo; con esta tabla pasan a
-- sincronizar entre dispositivos)
-- ----------------------------------------------------------------------------
create table if not exists favorites (
  user_id uuid references profiles(id) on delete cascade not null,
  store_id uuid references stores(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (user_id, store_id)
);

create index if not exists idx_favorites_user on favorites(user_id);

alter table favorites enable row level security;

drop policy if exists "favoritos propios: leer" on favorites;
create policy "favoritos propios: leer"
  on favorites for select
  using (auth.uid() = user_id);

drop policy if exists "favoritos propios: agregar" on favorites;
create policy "favoritos propios: agregar"
  on favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "favoritos propios: borrar" on favorites;
create policy "favoritos propios: borrar"
  on favorites for delete
  using (auth.uid() = user_id);
