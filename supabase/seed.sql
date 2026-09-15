-- ============================================================================
-- Datos de ejemplo (opcional). Ejecutar DESPUÉS de crear al menos un usuario
-- "comercio" desde la app (registro), y reemplazar el owner_id acá abajo por
-- el id real de ese usuario (lo ves en Supabase > Authentication > Users).
-- ============================================================================

-- Ejemplo: crear productos para el primer comercio que exista
-- (ajustá el nombre del comercio si hace falta)
insert into products (store_id, name, description, price, category, is_available)
select
  s.id,
  p.name,
  p.description,
  p.price,
  p.category,
  true
from stores s
cross join (values
  ('Hamburguesa clásica', 'Carne, cheddar, lechuga, tomate y salsa especial', 4500, 'hamburguesas'),
  ('Hamburguesa doble', 'Doble carne, doble cheddar, panceta', 6200, 'hamburguesas'),
  ('Papas fritas', 'Porción grande con cheddar y panceta', 2800, 'acompañamientos'),
  ('Coca-Cola 500ml', 'Bien fría', 1500, 'bebidas'),
  ('Agua mineral', 'Sin gas 500ml', 1000, 'bebidas')
) as p(name, description, price, category)
limit 5;
