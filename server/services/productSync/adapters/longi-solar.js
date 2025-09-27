import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchLONGi() {
  const website = 'https://www.longi-solar.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'LONGi Hi-MO (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes LONGi-Beispielprodukt.' });
    return makeManufacturer({ slug: 'longi-solar', name: 'LONGi Solar', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'longi-solar', name: 'LONGi Solar', logoUrl: null, website, products: [] });
  }
}
