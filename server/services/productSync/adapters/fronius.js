import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchFronius() {
  const website = 'https://www.fronius.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'Fronius Symo (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes Fronius-Beispielprodukt.' });
    return makeManufacturer({ slug: 'fronius', name: 'Fronius', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'fronius', name: 'Fronius', logoUrl: null, website, products: [] });
  }
}
