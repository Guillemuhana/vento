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
set image_url = case name
  when 'Ribeye' then 'https://tb-static.uber.com/prod/image-proc/processed_images/55334868d5cbf6376b97f347fff9e49/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Vacio' then 'https://tb-static.uber.com/prod/image-proc/processed_images/02f7eefa4cae2c1a9c8c44e224400e21/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Churrasco de Entraña' then 'https://tb-static.uber.com/prod/image-proc/processed_images/75092af9b4669c09fc4af6ed723c18be/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Napolitana' then 'https://tb-static.uber.com/prod/image-proc/processed_images/7cf1143755fa9304e5ab20e351a0794f/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Bife de Chorizo' then 'https://tb-static.uber.com/prod/image-proc/processed_images/3358a7cceb949e40e3813a478e0ccf2c/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Flan' then 'https://tb-static.uber.com/prod/image-proc/processed_images/b79e562b8b232fa6c98c892c4e021c3c/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Wild Corvina' then 'https://tb-static.uber.com/prod/image-proc/processed_images/4c23e4888686db66a211d3a54efe74d8/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Braised Short Ribs' then 'https://tb-static.uber.com/prod/image-proc/processed_images/75d393b698ea8ef7d718cd039fcbfb19/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Choco Mousse' then 'https://tb-static.uber.com/prod/image-proc/processed_images/d218246f8fee10e91a74c7fdd4a89b70/3093d07d5a810674a6d7adf26679874b.jpeg'
  when 'Parri de Veggies' then 'https://tb-static.uber.com/prod/image-proc/processed_images/448abcec214b2d142f71edc2442fee17/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Mollejas' then 'https://tb-static.uber.com/prod/image-proc/processed_images/4a8c942dc6d0d31066f7ef844b7d9111/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Red Beets Salad' then 'https://tb-static.uber.com/prod/image-proc/processed_images/c1731e06a01868385ced8c458a00914e/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Empanada de Choclo' then 'https://tb-static.uber.com/prod/image-proc/processed_images/dc482a6ea68da2bb20c4956dabe3eac/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Provoleta' then 'https://tb-static.uber.com/prod/image-proc/processed_images/3183a717f8f43e348871841c5b616302/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Pulpo a la Plancha' then 'https://tb-static.uber.com/prod/image-proc/processed_images/2258a580e5c0add16325435873a1ee82/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  else null
end
where store_id in (select id from stores where lower(name) = 'fiorito');

update stores
set cover_url = 'https://tb-static.uber.com/prod/image-proc/processed_images/9201f1f5a0bd5538a96dfa621c084958/19ec62ba51fde35ba0aff5b84321c5af.jpeg'
where lower(name) = 'fiorito almacen';

update products
set image_url = case name
  when 'Fiorito Burger' then 'https://tb-static.uber.com/prod/image-proc/processed_images/6236927439341115dcd16c7a9e978a1c/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Choripan Criolla Sandwich' then 'https://tb-static.uber.com/prod/image-proc/processed_images/63caca0bb369fef894bce5e6e6440726/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'NY Steak Sandwich' then 'https://tb-static.uber.com/prod/image-proc/processed_images/7cad730b40a151f0f85efa65742f727a/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Milanesa Chicken Sandwich' then 'https://tb-static.uber.com/prod/image-proc/processed_images/0022a2e48ffc669153f7d3e0bf1dca67/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Prime Picanha' then 'https://tb-static.uber.com/prod/image-proc/processed_images/4919b3f32813f99e259b5c1d1b3c1ab/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Grilled Chicken Sandwich' then 'https://tb-static.uber.com/prod/image-proc/processed_images/9b8c6382978549da8953e5f83d1cfbf2/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when '3 Empanadas' then 'https://tb-static.uber.com/prod/image-proc/processed_images/c80b9d146de16ebd160850fed544c773/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Milanesa Steak Sandwich' then 'https://tb-static.uber.com/prod/image-proc/processed_images/9faf0af5fbcf5cfb9c377fa5d345490b/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Buy 6 Empanadas and Get 1 Free' then 'https://tb-static.uber.com/prod/image-proc/processed_images/baa672d1fb29a9ef91c9cd5fdfb7e42d/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Large Home Cut Fries' then 'https://tb-static.uber.com/prod/image-proc/processed_images/b3b44a32cddbffd153f8529c110433c8/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Large Sweet Potato Fries' then 'https://tb-static.uber.com/prod/image-proc/processed_images/b40ce37bce8c89c94f079e6c5dbe2bb0/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Prosciutto di Parma Sandwich' then 'https://tb-static.uber.com/prod/image-proc/processed_images/4e6fb690ecb697f18ecab441f16915a2/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Large Mix Greens Salad' then 'https://tb-static.uber.com/prod/image-proc/processed_images/99c06cd7924f6952854302a041cc3748/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Buy 12 Empanadas and Get 2 Free' then 'https://tb-static.uber.com/prod/image-proc/processed_images/bf00fdd6bbd3879a7c21a8aee9d80974/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Dozen Empanadas' then 'https://tb-static.uber.com/prod/image-proc/processed_images/0a372f7e4b6520f18505cc8f9fb0d871/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  when 'Chicken Empanada' then 'https://tb-static.uber.com/prod/image-proc/processed_images/8797c73ffe1ee31c05953c0b4424846/c67fc65e9b4e16a553eb7574fba090f1.jpeg'
  else null
end
where store_id in (select id from stores where lower(name) = 'fiorito almacen');
