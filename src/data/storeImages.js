export function getStoreImage(storeName = '') {
  if (storeName.toLowerCase().includes('ferruccio')) {
    return '/assets/demo/heladeria.jpg'
  }

  return null
}