-- Solicitudes de soporte, alianzas y base para Just Minutes Pro.
-- Ejecutar después de 009_puntos_y_beneficios.sql.

create table if not exists public.support_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'en_revision', 'resuelto')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  contact text not null,
  message text not null,
  status text not null default 'pendiente' check (status in ('pendiente', 'en_revision', 'contactado', 'rechazado')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pro_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  plan text not null default 'mensual',
  status text not null default 'pendiente' check (status in ('pendiente', 'activa', 'cancelada')),
  price numeric(10,2) not null default 4.99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_requests enable row level security;
alter table public.partner_requests enable row level security;
alter table public.pro_subscriptions enable row level security;

drop policy if exists "El usuario crea sus solicitudes de ayuda" on public.support_requests;
create policy "El usuario crea sus solicitudes de ayuda" on public.support_requests
  for insert with check (auth.uid() = user_id);
drop policy if exists "El usuario ve sus solicitudes de ayuda" on public.support_requests;
create policy "El usuario ve sus solicitudes de ayuda" on public.support_requests
  for select using (auth.uid() = user_id);
drop policy if exists "El admin gestiona solicitudes de ayuda" on public.support_requests;
create policy "El admin gestiona solicitudes de ayuda" on public.support_requests
  for all using (public.current_role_is('admin'))
  with check (public.current_role_is('admin'));

drop policy if exists "El usuario crea su solicitud de alianza" on public.partner_requests;
create policy "El usuario crea su solicitud de alianza" on public.partner_requests
  for insert with check (auth.uid() = user_id);
drop policy if exists "El usuario ve su solicitud de alianza" on public.partner_requests;
create policy "El usuario ve su solicitud de alianza" on public.partner_requests
  for select using (auth.uid() = user_id);
drop policy if exists "El admin gestiona solicitudes de alianza" on public.partner_requests;
create policy "El admin gestiona solicitudes de alianza" on public.partner_requests
  for all using (public.current_role_is('admin'))
  with check (public.current_role_is('admin'));

drop policy if exists "El usuario ve su suscripcion Pro" on public.pro_subscriptions;
create policy "El usuario ve su suscripcion Pro" on public.pro_subscriptions
  for select using (auth.uid() = user_id);
drop policy if exists "El usuario crea su solicitud Pro" on public.pro_subscriptions;
create policy "El usuario crea su solicitud Pro" on public.pro_subscriptions
  for insert with check (auth.uid() = user_id and status = 'pendiente');
drop policy if exists "El admin gestiona suscripciones Pro" on public.pro_subscriptions;
create policy "El admin gestiona suscripciones Pro" on public.pro_subscriptions
  for all using (public.current_role_is('admin'))
  with check (public.current_role_is('admin'));
