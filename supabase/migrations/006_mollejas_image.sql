-- Asigna la imagen individual de Mollejas publicada en Uber Eats.
update products
set image_url = 'https://tb-static.uber.com/prod/image-proc/processed_images/4a8c942dc6d0d31066f7ef844b7d9111/a19bb09692310dfd41e49a96c424b3a6.jpeg'
where lower(name) = 'mollejas'
  and store_id in (select id from stores where lower(name) = 'fiorito');

update products
set image_url = case name
  when 'Vacio' then 'https://tb-static.uber.com/prod/image-proc/processed_images/02f7eefa4cae2c1a9c8c44e224400e21/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Ribeye' then 'https://tb-static.uber.com/prod/image-proc/processed_images/55334868d5cbf6376b97f347fff9e49/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Empanada de Carne a Cuchillo' then 'https://tb-static.uber.com/prod/image-proc/processed_images/6b50794b4a776bc7bd336013f73f1458/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Empanada de Choclo' then 'https://tb-static.uber.com/prod/image-proc/processed_images/dc482a6ea68da2bb20c4956dabe3eac/a19bb09692310dfd41e49a96c424b3a6.jpeg'
  when 'Panqueque' then 'https://tb-static.uber.com/prod/image-proc/processed_images/384982d20c90ce05551ea6d0a7f24346/fb86662148be855d931b37d6c1e5fcbe.jpeg'
end
where name in ('Vacio', 'Ribeye', 'Empanada de Carne a Cuchillo', 'Empanada de Choclo', 'Panqueque')
  and store_id in (select id from stores where lower(name) = 'fiorito');
