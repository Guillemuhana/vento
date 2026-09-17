-- Permite que el usuario vuelva a pedir el alta Pro después de una baja.
-- Sin esta policy el upsert de la pantalla Pro falla por RLS cuando la fila ya existe.
-- Ejecutar después de 010_soporte_alianzas_y_pro.sql.

drop policy if exists "El usuario reintenta su solicitud Pro" on public.pro_subscriptions;

create policy "El usuario reintenta su solicitud Pro" on public.pro_subscriptions
  for update using (auth.uid() = user_id and status <> 'activa')
  with check (auth.uid() = user_id and status = 'pendiente');
