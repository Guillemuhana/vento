-- ============================================================================
-- 008 — Endurecimiento de seguridad
-- ============================================================================
--
-- Arregla cuatro problemas reales del esquema actual:
--
-- 1. Cualquiera con la anon key (que es pública) podía leer el nombre, el
--    teléfono, la dirección, el DNI y la fecha de nacimiento de TODOS los
--    usuarios. La política de lectura de `profiles` era `using (true)`.
--
-- 2. Un usuario podía cambiar su propio `role` a 'admin' y entrar al panel de
--    administración. La política de UPDATE no tenía WITH CHECK ni restringía
--    columnas.
--
-- 3. Los precios del pedido los mandaba el navegador. Se podía crear un pedido
--    con total = 0, o con el precio que a uno se le ocurriera.
--
-- 4. Cualquier usuario logueado podía crear un comercio, sin ser rol comercio.
--
-- Todo esto se arregla del lado del servidor, que es el único lugar donde sirve
-- arreglarlo: el navegador siempre está bajo control de quien lo usa.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helpers. Son SECURITY DEFINER para poder consultar `profiles` sin disparar
-- sus propias políticas (y sin caer en recursión infinita).
-- ----------------------------------------------------------------------------
create or replace function public.mi_rol()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

-- ¿Este perfil es el del repartidor asignado a alguno de mis pedidos?
-- Es lo único que necesita ver un cliente del perfil de otra persona.
create or replace function public.es_mi_repartidor(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.orders o
    join public.couriers c on c.id = o.courier_id
    where o.customer_id = auth.uid()
      and c.user_id = p_profile_id
  );
$$;

-- ============================================================================
-- 1. profiles: cortar la exposición de datos personales
-- ============================================================================
drop policy if exists "Comercios y repartidores visibles públicamente para pedidos" on profiles;
drop policy if exists "Comercios y repartidores visibles publicamente para pedidos" on profiles;

-- El propio perfil (esta ya existía, se recrea por si acaso).
drop policy if exists "Perfil visible para el propio usuario" on profiles;
create policy "Perfil visible para el propio usuario" on profiles
  for select using (auth.uid() = id);

-- El cliente ve el perfil del repartidor que le está llevando el pedido.
drop policy if exists "Repartidor asignado visible para su cliente" on profiles;
create policy "Repartidor asignado visible para su cliente" on profiles
  for select using (public.es_mi_repartidor(id));

-- El admin ve todo.
drop policy if exists "Perfiles visibles para admin" on profiles;
create policy "Perfiles visibles para admin" on profiles
  for select using (public.es_admin());

-- ============================================================================
-- 2. profiles: impedir que alguien se ascienda a admin
-- ============================================================================
-- Se hace con trigger y no con WITH CHECK porque así el resto del UPDATE sigue
-- funcionando: si tocás el rol sin ser admin, se ignora ese campo en vez de
-- rechazarte el guardado entero del perfil.
create or replace function public.congelar_rol()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    new.id := old.id;
  end if;

  if new.role is distinct from old.role and not public.es_admin() then
    new.role := old.role;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_congelar_rol on profiles;
create trigger trg_congelar_rol
  before update on profiles
  for each row execute function public.congelar_rol();

-- ============================================================================
-- 3. Plata: que los precios los ponga el servidor, no el navegador
-- ============================================================================

-- Costo de envío base. Está acá para que el servidor no dependa de lo que
-- mande el cliente. Si cambia, hay que cambiarlo también en Checkout.jsx.
create or replace function public.costo_envio_base()
returns numeric
language sql
immutable
set search_path = ''
as $$
  select 3.99::numeric;
$$;

-- Al crear el pedido se ignora todo lo que el cliente diga sobre plata y estado.
create or replace function public.sanear_pedido_nuevo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.status := 'pendiente';
  new.courier_id := null;
  new.subtotal := 0;
  new.delivery_fee := public.costo_envio_base();
  new.total := new.delivery_fee;
  return new;
end;
$$;

drop trigger if exists trg_sanear_pedido_nuevo on orders;
create trigger trg_sanear_pedido_nuevo
  before insert on orders
  for each row execute function public.sanear_pedido_nuevo();

-- El precio unitario sale de la tabla products, no del navegador.
create or replace function public.precio_real_del_item()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_precio numeric;
  v_nombre text;
begin
  if new.quantity is null or new.quantity < 1 then
    new.quantity := 1;
  end if;

  if new.product_id is not null then
    select price, name into v_precio, v_nombre
    from public.products
    where id = new.product_id;

    if v_precio is not null then
      new.unit_price := v_precio;
      new.product_name := coalesce(v_nombre, new.product_name);
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_precio_real_del_item on order_items;
create trigger trg_precio_real_del_item
  before insert or update on order_items
  for each row execute function public.precio_real_del_item();

-- Con los ítems ya guardados, el servidor recalcula el total del pedido.
create or replace function public.recalcular_total_pedido()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order uuid := coalesce(new.order_id, old.order_id);
  v_subtotal numeric;
begin
  select coalesce(sum(quantity * unit_price), 0)
  into v_subtotal
  from public.order_items
  where order_id = v_order;

  update public.orders
  set subtotal = v_subtotal,
      total = v_subtotal + delivery_fee
  where id = v_order;

  return null;
end;
$$;

drop trigger if exists trg_recalcular_total_pedido on order_items;
create trigger trg_recalcular_total_pedido
  after insert or update or delete on order_items
  for each row execute function public.recalcular_total_pedido();

-- ============================================================================
-- 4. stores: crear un comercio requiere ser rol comercio
-- ============================================================================
drop policy if exists "El dueño crea su comercio" on stores;
drop policy if exists "El dueno crea su comercio" on stores;
create policy "El dueno crea su comercio" on stores
  for insert with check (
    auth.uid() = owner_id
    and (public.mi_rol() = 'comercio' or public.es_admin())
  );
