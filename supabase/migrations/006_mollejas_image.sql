-- Asigna la imagen individual de Mollejas publicada en Uber Eats.
update products
set image_url = 'https://tb-static.uber.com/prod/image-proc/processed_images/4a8c942dc6d0d31066f7ef844b7d9111/a19bb09692310dfd41e49a96c424b3a6.jpeg'
where lower(name) = 'mollejas'
  and store_id in (select id from stores where lower(name) = 'fiorito');
