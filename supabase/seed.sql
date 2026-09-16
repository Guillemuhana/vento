-- ============================================================================
-- Fiorito: datos reales del menú publicado por el restaurante y Uber Eats.
-- Los precios están en USD, igual que el resto de la app.
-- ============================================================================

insert into stores (name, description, category, address, rating, eta_minutes, is_open)
select
  'Fiorito',
  'Restaurante argentino de parrilla, pastas y empanadas',
  'comida',
  '5555 NE 2nd Ave, Miami, FL 33137',
  4.9,
  35,
  true
where not exists (select 1 from stores where lower(name) = 'fiorito');

delete from products
where store_id in (select id from stores where lower(name) = 'fiorito');

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
  ('Empanada de Carne a Cuchillo', 'Empanada de carne cortada a cuchillo', 6.25, 'first bites'),
  ('Empanada de Choclo', 'Empanada de maíz', 6.25, 'first bites'),
  ('Provoleta', 'Provolone a la parrilla', 20.00, 'first bites'),
  ('Pulpo a la Plancha', 'Pulpo a la plancha', 30.00, 'first bites'),
  ('Parri de Veggies', 'Vegetales a la parrilla', 20.00, 'first bites'),
  ('Red Beets Salad', 'Ensalada de remolacha', 17.50, 'salads'),
  ('Sd Mixed Greens', 'Ensalada de hojas verdes', 8.75, 'sides'),
  ('Sd Fries', 'Papas fritas caseras', 8.75, 'sides'),
  ('Lamb Ragut', 'Ragú de cordero', 31.25, 'pasta caseras'),
  ('Canelones', 'Canelones caseros', 25.00, 'pasta caseras'),
  ('Ribeye', 'Corte ribeye a la parrilla', 52.50, 'main'),
  ('Bife de Chorizo', 'Bife de chorizo a la parrilla', 40.00, 'main'),
  ('Vacio', 'Vacío a la parrilla', 40.00, 'main'),
  ('Churrasco de Entraña', 'Entraña con papas fritas caseras y chimichurri', 36.70, 'main'),
  ('Milanesa a la Napolitana', 'Milanesa con jamón, salsa de tomate, mozzarella y papas fritas', 27.25, 'main'),
  ('Napolitana', 'Milanesa napolitana', 31.25, 'main'),
  ('Braised Short Ribs', 'Costillas de res braseadas', 36.25, 'main'),
  ('Wild Corvina', 'Corvina salvaje', 36.25, 'main'),
  ('Pollo', 'Pollo a la parrilla', 23.75, 'main'),
  ('Flan', 'Flan', 12.50, 'postres'),
  ('Choco Mousse', 'Mousse de chocolate', 15.00, 'postres'),
  ('Panqueque', 'Panqueque con dulce de leche', 15.00, 'postres')
) as p(name, description, price, category)
where lower(s.name) = 'fiorito';

insert into stores (name, description, category, address, rating, eta_minutes, is_open)
select
  'Fiorito Almacen',
  'Sandwiches, empanadas y productos argentinos',
  'comida',
  '5650 Northeast 2nd Avenue, Suite E, Miami, FL 33137',
  4.7,
  30,
  true
where not exists (select 1 from stores where lower(name) = 'fiorito almacen');

delete from products
where store_id in (select id from stores where lower(name) = 'fiorito almacen');

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
  ('Prime Picanha', 'Picanha prime de 10 oz con arroz, frijoles y salsa criolla', 22.79, 'daily specials'),
  ('Special Chicken Milanesa', 'Milanesa de pollo con papas fritas', 20.39, 'daily specials'),
  ('3 Empanadas', 'Elegí tres sabores de empanada', 14.36, 'combos to share'),
  ('Buy 6 Empanadas and Get 1 Free', 'Elegí siete sabores de empanada', 28.73, 'combos to share'),
  ('Buy 12 Empanadas and Get 2 Free', 'Elegí catorce sabores de empanada', 57.46, 'combos to share'),
  ('NY Steak Sandwich', 'Bife de chorizo de 8 oz, lechuga, tomate y chimi mayo', 23.99, 'sandwiches & burgers'),
  ('Fiorito Burger', 'Hamburguesa Black Angus de media libra, lechuga y tomate', 15.59, 'sandwiches & burgers'),
  ('Prosciutto di Parma Sandwich', 'Burrata, rúcula y tomate en pan casero', 22.79, 'sandwiches & burgers'),
  ('Milanesa Steak Sandwich', 'Milanesa, lechuga, tomate y alioli de limón', 19.19, 'sandwiches & burgers'),
  ('Milanesa Chicken Sandwich', 'Milanesa de pollo, lechuga, tomate y alioli de limón', 19.19, 'sandwiches & burgers'),
  ('Grilled Chicken Sandwich', 'Pollo a la parrilla, lechuga, tomate y salsa chimi o criolla', 16.79, 'sandwiches & burgers'),
  ('Choripan Criolla Sandwich', 'Chorizo, repollo encurtido y salsa chimichurri o criolla', 14.39, 'sandwiches & burgers'),
  ('Dozen Empanadas', 'Docena de empanadas con sabores a elección', 47.99, 'empanadas'),
  ('Hand Cut Steak Empanada', 'Empanada de carne cortada a cuchillo, al horno o frita', 4.79, 'empanadas'),
  ('Corn & Cheese Empanada', 'Empanada de choclo y queso', 4.79, 'empanadas'),
  ('Chicken Empanada', 'Empanada de pollo sazonado, al horno o frita', 4.79, 'empanadas'),
  ('Large Mix Greens Salad', 'Ensalada fresca de hojas verdes', 8.40, 'sides'),
  ('Large Home Cut Fries', 'Papas caseras crocantes', 8.40, 'sides'),
  ('Large Sweet Potato Fries', 'Papas dulces crocantes', 8.40, 'sides'),
  ('Pastafrola', 'Tarta dulce tradicional', 5.99, 'postres'),
  ('Fresh Lemonade', 'Limonada fresca', 6.00, 'beverages'),
  ('S.Pellegrino', 'Agua mineral con gas', 4.20, 'beverages'),
  ('Alfajor Havanna Blanco', 'Alfajor Havanna de chocolate blanco', 4.20, 'mercado'),
  ('Alfajor Havanna Chocolate', 'Alfajor Havanna de chocolate', 4.20, 'mercado'),
  ('Dulce de Leche Fiorito', 'Dulce de leche', 7.20, 'mercado'),
  ('Chimichurri', 'Salsa chimichurri', 7.20, 'mercado'),
  ('Yerba Playadito 1kg', 'Yerba mate Playadito de un kilo', 15.59, 'mercado'),
  ('Baguette', 'Baguette fresca', 2.40, 'mercado')
) as p(name, description, price, category)
where lower(s.name) = 'fiorito almacen';

update stores
set cover_url = 'https://tb-static.uber.com/prod/image-proc/processed_images/384982d20c90ce05551ea6d0a7f24346/f6deb0afc24fee6f4bd31a35e6bcbd47.jpeg'
where lower(name) = 'fiorito';

update products
set image_url = 'https://tb-static.uber.com/prod/image-proc/processed_images/384982d20c90ce05551ea6d0a7f24346/783282f6131ef2258e5bcd87c46aa87e.jpeg'
where store_id in (select id from stores where lower(name) = 'fiorito');

update stores
set cover_url = 'https://tb-static.uber.com/prod/image-proc/processed_images/9201f1f5a0bd5538a96dfa621c084958/19ec62ba51fde35ba0aff5b84321c5af.jpeg'
where lower(name) = 'fiorito almacen';

update products
set image_url = 'https://tb-static.uber.com/prod/image-proc/processed_images/9201f1f5a0bd5538a96dfa621c084958/4bee0baf259f2b3c95aacdebea87e950.jpeg'
where store_id in (select id from stores where lower(name) = 'fiorito almacen');
