const FIORITO_COVER =
  'https://tb-static.uber.com/prod/image-proc/processed_images/384982d20c90ce05551ea6d0a7f24346/f6deb0afc24fee6f4bd31a35e6bcbd47.jpeg'
const FIORITO_PRODUCT =
  'https://tb-static.uber.com/prod/image-proc/processed_images/384982d20c90ce05551ea6d0a7f24346/783282f6131ef2258e5bcd87c46aa87e.jpeg'
const ALMACEN_COVER =
  'https://tb-static.uber.com/prod/image-proc/processed_images/9201f1f5a0bd5538a96dfa621c084958/19ec62ba51fde35ba0aff5b84321c5af.jpeg'
const ALMACEN_PRODUCT =
  'https://tb-static.uber.com/prod/image-proc/processed_images/9201f1f5a0bd5538a96dfa621c084958/4bee0baf259f2b3c95aacdebea87e950.jpeg'

function isAlmacen(name = '') {
  return name.toLowerCase().includes('almacen')
}

export function getFioritoStoreImage(name) {
  if (!name || !name.toLowerCase().includes('fiorito')) return null
  return isAlmacen(name) ? ALMACEN_COVER : FIORITO_COVER
}

export function getFioritoProductImage(storeName) {
  if (!storeName || !storeName.toLowerCase().includes('fiorito')) return null
  return isAlmacen(storeName) ? ALMACEN_PRODUCT : FIORITO_PRODUCT
}