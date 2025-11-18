import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchSolarEdge() {
  const website = 'https://www.solaredge.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'SolarEdge Home Hub (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes Beispielprodukt.' });
    return makeManufacturer({ slug: 'solaredge', name: 'SolarEdge', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'solaredge', name: 'SolarEdge', logoUrl: null, website, products: [] });
  }
}
