-- Sistema de puntos para clientes y repartidores.
-- Ejecutar después de 008_seguridad.sql.

create table if not exists public.loyalty_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  lifetime_points integer not null default 0 check (lifetime_points >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.points_ledger (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  audience user_role not null,
  points integer not null check (points > 0),
  multiplier numeric(4,2) not null default 1,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (user_id, order_id)
);

create index if not exists idx_points_ledger_user on public.points_ledger(user_id, created_at desc);

create table if not exists public.rewards (
  id uuid primary key default uuid_generate_v4(),
  audience user_role not null,
  name text not null,
  description text not null,
  points_cost integer not null check (points_cost > 0),
  discount_amount numeric(10,2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.loyalty_accounts enable row level security;
alter table public.points_ledger enable row level security;
alter table public.rewards enable row level security;

drop policy if exists "El usuario ve su saldo de puntos" on public.loyalty_accounts;
create policy "El usuario ve su saldo de puntos" on public.loyalty_accounts
  for select using (auth.uid() = user_id);

drop policy if exists "El usuario ve sus movimientos de puntos" on public.points_ledger;
create policy "El usuario ve sus movimientos de puntos" on public.points_ledger
  for select using (auth.uid() = user_id);

drop policy if exists "Las recompensas activas son visibles" on public.rewards;
create policy "Las recompensas activas son visibles" on public.rewards
  for select using (active = true);

create or replace function public.award_delivery_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  multiplier numeric(4,2) := 1;
  customer_points integer;
  courier_points integer;
  courier_user_id uuid;
begin
  if new.status <> 'entregado'::public.order_status
     or old.status = 'entregado'::public.order_status then
    return new;
  end if;

  -- Martes en Miami: todas las entregas acreditan el doble.
  if extract(isodow from (now() at time zone 'America/New_York')) = 2 then
    multiplier := 2;
  end if;

  customer_points := greatest(1, floor(coalesce(new.subtotal, 0))::integer) * multiplier;

  insert into public.points_ledger (user_id, order_id, audience, points, multiplier, reason)
  values (new.customer_id, new.id, 'cliente', customer_points, multiplier,
    case when multiplier = 2 then 'Pedido entregado - martes doble' else 'Pedido entregado' end)
  on conflict (user_id, order_id) do nothing;

  if found then
    insert into public.loyalty_accounts (user_id, points, lifetime_points)
    values (new.customer_id, customer_points, customer_points)
    on conflict (user_id) do update set
      points = loyalty_accounts.points + excluded.points,
      lifetime_points = loyalty_accounts.lifetime_points + excluded.lifetime_points,
      updated_at = now();
  end if;

  if new.courier_id is not null then
    select user_id into courier_user_id from public.couriers where id = new.courier_id;
    if courier_user_id is not null then
      courier_points := (10 * multiplier)::integer;
      insert into public.points_ledger (user_id, order_id, audience, points, multiplier, reason)
      values (courier_user_id, new.id, 'repartidor', courier_points, multiplier,
        case when multiplier = 2 then 'Entrega completada - martes doble' else 'Entrega completada' end)
      on conflict (user_id, order_id) do nothing;

      if found then
        insert into public.loyalty_accounts (user_id, points, lifetime_points)
        values (courier_user_id, courier_points, courier_points)
        on conflict (user_id) do update set
          points = loyalty_accounts.points + excluded.points,
          lifetime_points = loyalty_accounts.lifetime_points + excluded.lifetime_points,
          updated_at = now();
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_award_delivery_points on public.orders;
create trigger trg_award_delivery_points
after update of status on public.orders
for each row execute function public.award_delivery_points();

insert into public.rewards (audience, name, description, points_cost, discount_amount)
select 'cliente', 'Descuento en tu próximo pedido', 'Canjeá puntos por un descuento en comercios adheridos.', 100, 5
where not exists (
  select 1 from public.rewards where audience = 'cliente' and points_cost = 100
);

insert into public.rewards (audience, name, description, points_cost, discount_amount)
select 'repartidor', 'Descuento en comercios aliados', 'Beneficio para repartidores activos de la comunidad.', 100, 5
where not exists (
  select 1 from public.rewards where audience = 'repartidor' and points_cost = 100
);
