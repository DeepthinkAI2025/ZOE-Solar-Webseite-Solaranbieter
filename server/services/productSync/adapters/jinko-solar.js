import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchJinkoSolar() {
  const website = 'https://www.jinkosolar.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'Jinko Tiger (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes Jinko-Beispielprodukt.' });
    return makeManufacturer({ slug: 'jinko-solar', name: 'Jinko Solar', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'jinko-solar', name: 'Jinko Solar', logoUrl: null, website, products: [] });
  }
}
