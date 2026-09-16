-- ============================================================================
-- 004 — Crear el perfil automáticamente al registrarse
-- ============================================================================
--
-- El problema: la app creaba el perfil desde el navegador, con un insert a
-- `profiles` justo después del signUp. Eso solo funciona si el signUp devuelve
-- sesión. Con la confirmación de email activada (el default de Supabase) NO
-- devuelve sesión, así que `auth.uid()` es null y la política RLS
-- "El usuario crea su propio perfil" rechaza el insert: queda un usuario en
-- auth.users sin fila en profiles, y la app no puede funcionar con él.
--
-- La solución estándar: un trigger sobre auth.users que corre del lado del
-- servidor como SECURITY DEFINER, sin depender de que haya sesión. Los datos
-- del formulario llegan en raw_user_meta_data (lo que la app manda en
-- signUp -> options.data).
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role public.user_role;
  v_nombre text;
begin
  v_role := coalesce(
    nullif(new.raw_user_meta_data ->> 'role', '')::public.user_role,
    'cliente'
  );
  v_nombre := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, full_name, phone, role)
  values (new.id, v_nombre, new.raw_user_meta_data ->> 'phone', v_role)
  on conflict (id) do nothing;

  -- Un comercio arranca con su local creado y cerrado, listo para configurar.
  if v_role = 'comercio' then
    insert into public.stores (owner_id, name, category, is_open)
    values (new.id, v_nombre, 'comida', false);

  -- Un repartidor arranca con su registro creado y desconectado.
  elsif v_role = 'repartidor' then
    insert into public.couriers (user_id, vehicle_type, is_available)
    values (new.id, 'moto', false)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Perfiles faltantes: si ya se registró alguien y quedó sin perfil, se lo crea.
-- ----------------------------------------------------------------------------
insert into public.profiles (id, full_name, phone, role)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), split_part(u.email, '@', 1)),
  u.raw_user_meta_data ->> 'phone',
  coalesce(nullif(u.raw_user_meta_data ->> 'role', '')::public.user_role, 'cliente')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
