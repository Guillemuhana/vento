-- ============================================================================
-- 003 — Arregla la recursión infinita entre las políticas de couriers y orders
-- ============================================================================
--
-- El problema: la política de SELECT de `couriers` hacía un subquery a `orders`,
-- y las políticas de `orders` hacían un subquery a `couriers`. Postgres evalúa
-- las políticas de la tabla consultada dentro del subquery, así que se llamaban
-- entre sí sin fin: error 42P17 "infinite recursion detected in policy".
--
-- La solución estándar: sacar esos cruces a funciones SECURITY DEFINER. Corren
-- con los permisos del dueño de la tabla, así que no disparan RLS y cortan el
-- ciclo. Cada una devuelve solo un booleano o un id, nada más.
-- ============================================================================

-- Id del repartidor del usuario actual (null si no es repartidor).
create or replace function public.mi_courier_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from public.couriers where user_id = auth.uid() limit 1;
$$;

-- ¿Este repartidor está asignado a algún pedido mío (como cliente)?
create or replace function public.courier_en_mis_pedidos(p_courier_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.orders o
    where o.courier_id = p_courier_id
      and o.customer_id = auth.uid()
  );
$$;

-- ¿Puedo ver este pedido? (cliente dueño, comercio vendedor o repartidor asignado)
create or replace function public.puedo_ver_pedido(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.orders o
    where o.id = p_order_id
      and (
        o.customer_id = auth.uid()
        or exists (
          select 1 from public.stores s
          where s.id = o.store_id and s.owner_id = auth.uid()
        )
        or o.courier_id = public.mi_courier_id()
      )
  );
$$;

-- ----------------------------------------------------------------------------
-- couriers
-- ----------------------------------------------------------------------------
drop policy if exists "Ubicación del repartidor visible en pedidos asociados" on couriers;
drop policy if exists "Ubicacion del repartidor visible en pedidos asociados" on couriers;

create policy "Ubicacion del repartidor visible en pedidos asociados" on couriers
  for select using (
    auth.uid() = user_id
    or public.courier_en_mis_pedidos(id)
  );

-- ----------------------------------------------------------------------------
-- orders
--
-- Además de romper el ciclo, esto cierra un agujero: antes la condición era
-- solo "courier_id is null", así que CUALQUIER usuario logueado podía leer (y
-- actualizar) todos los pedidos sin repartidor asignado, no solo los
-- repartidores. Ahora hay que tener registro en `couriers`.
-- ----------------------------------------------------------------------------
drop policy if exists "El repartidor ve pedidos disponibles o asignados" on orders;
create policy "El repartidor ve pedidos disponibles o asignados" on orders
  for select using (
    public.mi_courier_id() is not null
    and (courier_id is null or courier_id = public.mi_courier_id())
  );

drop policy if exists "El repartidor toma y actualiza pedidos" on orders;
create policy "El repartidor toma y actualiza pedidos" on orders
  for update using (
    public.mi_courier_id() is not null
    and (courier_id is null or courier_id = public.mi_courier_id())
  );

-- ----------------------------------------------------------------------------
-- order_items
-- ----------------------------------------------------------------------------
drop policy if exists "Ítems visibles si el pedido es visible" on order_items;
drop policy if exists "Items visibles si el pedido es visible" on order_items;

create policy "Items visibles si el pedido es visible" on order_items
  for select using (public.puedo_ver_pedido(order_id));
