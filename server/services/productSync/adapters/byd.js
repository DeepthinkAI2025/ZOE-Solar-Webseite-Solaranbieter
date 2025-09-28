import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchBYD() {
  const website = 'https://www.byd.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'BYD Battery (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes BYD-Beispielprodukt.' });
    return makeManufacturer({ slug: 'byd', name: 'BYD', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'byd', name: 'BYD', logoUrl: null, website, products: [] });
  }
}
