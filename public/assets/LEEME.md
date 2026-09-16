# Dónde va cada imagen

Si un archivo no existe, la app muestra un placeholder o el ícono que ya trae:
nunca se rompe.

| Carpeta | Qué va |
| --- | --- |
| `categorias/` | ✅ ilustraciones de las categorías del home (ya cargadas) |
| `iconos/` | íconos de la interfaz → ver `iconos/LEEME.md` |
| `banners/` | banners de promos del home ⟵ falta |
| `logo/` | logo de Vento |

## Categorías — `categorias/` ✅

PNG transparente. **El nombre del archivo es siempre `<slug>.png`** y el slug
tiene que coincidir con `stores.category` en la base, porque es lo que filtra la
pantalla de categoría.

Cargadas hoy (15): `comida` (Restaurantes), `super` (Súper), `envio-rapido`,
`farmacia`, `panaderia`, `verduleria`, `carniceria`, `bebidas`, `helado`,
`mascotas`, `perfumeria`, `tecnologia`, `libreria`, `hogar`, `regalos`.

Las originales venían a ~1250px y ~1 MB cada una; están redimensionadas a 320px
(20-40 KB). Los archivos sin tocar quedaron en `assets-originales/categorias/`,
fuera del build y fuera de git.

**Para agregar una categoría**: subí `<slug>.png` acá y sumá una línea en
`src/data/homeContent.js`. Nada más.

## Banners — `banners/` ⟵ falta

JPG horizontal 16:10, ~1200x750: `desayunos.jpg` y `envio-gratis.jpg`.
Se configuran en `src/data/homeContent.js`.

## Fotos de comercios

No van acá: se cargan por comercio en la base (`stores.cover_url` para la foto
grande de la card y `stores.logo_url` para el círculo del buscador).
