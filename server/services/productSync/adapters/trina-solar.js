import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchTrinaSolar() {
  const website = 'https://www.trinasolar.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'Trina Vertex (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes Trina-Beispielprodukt.' });
    return makeManufacturer({ slug: 'trina-solar', name: 'Trina Solar', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'trina-solar', name: 'Trina Solar', logoUrl: null, website, products: [] });
  }
}
