# Íconos de la app

Formato: **SVG** (ideal) o **PNG** con fondo transparente, cuadrado, ~96x96.
La app prueba primero `.svg` y después `.png`, así que subí el que tengas.
Si un archivo no está, se usa el ícono que ya trae la app.

> Ojo con el color: un archivo cargado como imagen se ve siempre del color con
> el que fue exportado. Para íconos que tienen que cambiar de color según el
> estado (gris ↔ naranja), subí las dos variantes donde se pide (`-activo`).

---

## `nav/` — barra de navegación  ⟵ **falta subir**

| Archivo | Dónde se ve |
| --- | --- |
| `inicio` · `inicio-activo` | tab Inicio (gris / naranja) |
| `ofertas` · `ofertas-activo` | tab Ofertas |
| `favoritos` · `favoritos-activo` | tab Favoritos |
| `cuenta` · `cuenta-activo` | tab Cuenta |
| `buscar` | botón redondo flotante al lado de la nav |

Tamaño en pantalla: 23px (el de la lupa, 24px).

## `cuenta/` — ✅ ya resuelto, no hace falta subir nada

Los íconos de la pantalla Cuenta que subiste (el set `vento-account-icons`)
están **inline** en `src/components/ui/AccountIcons.jsx`. Se pasaron a
componentes porque usan `stroke="currentColor"`: así toman el color del
contexto, cosa que no pasaría cargándolos como imagen. Los SVG originales
quedaron en `assets-originales/iconos-cuenta/`.

Para cambiar uno, editá el `path` en `AccountIcons.jsx`. Si preferís volver al
sistema de archivos, poné el SVG acá con el nombre de la fila y avisame.

## `ui/` — íconos sueltos del resto de la app  ⟵ **falta subir**

| Archivo | Dónde se ve |
| --- | --- |
| `buscar` | lupa de la barra del home y del buscador |
| `carrito` | barra flotante del carrito |
| `corazon` · `corazon-activo` | corazón sobre la foto del comercio (sin marcar / marcado) |
| `estrella` | rating de la card |
| `rayo` | tiempo de entrega de la card |
| `cerrar` | cerrar el buscador |
| `volver` | flecha de volver (Editar perfil, Categoría) |
| `chevron-abajo` | cambiar dirección en el home |
| `flecha-arriba` | píldora "Volver arriba" |
| `candado` | campo de email bloqueado |
| `camara` | botón "Editar imagen" |

## `app/` — ícono de la app  ⟵ **falta subir**

| Archivo | Para qué |
| --- | --- |
| `favicon.png` | pestaña del navegador (32x32 o 64x64) |
| `icono-app.png` | ícono al agregar a la pantalla de inicio (1024x1024) |

Ya están enganchados en `index.html`.

---

## Lo que NO va acá

- **Ilustraciones de categorías**: van en `public/assets/categorias/`.
- **Banners de promos**: van en `public/assets/banners/`.
- **Fotos y logos de comercios**: se cargan por comercio en la base
  (`stores.cover_url` y `stores.logo_url`).

Ver `public/assets/LEEME.md`.
