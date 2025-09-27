import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchEnphase() {
  const website = 'https://enphase.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'Enphase IQ (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes Enphase-Beispielprodukt.' });
    return makeManufacturer({ slug: 'enphase', name: 'Enphase', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'enphase', name: 'Enphase', logoUrl: null, website, products: [] });
  }
}
