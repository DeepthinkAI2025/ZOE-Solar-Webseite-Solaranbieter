import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchSMA() {
  const website = 'https://www.sma.de';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'Sunny Boy 5.0 (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes SMA-Beispielprodukt.' });
    return makeManufacturer({ slug: 'sma', name: 'SMA', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'sma', name: 'SMA', logoUrl: null, website, products: [] });
  }
}
