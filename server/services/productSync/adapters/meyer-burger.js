import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchMeyerBurger() {
  // Best-effort: try company homepage og:image and title
  const website = 'https://www.meyerburger.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const title = (text.match(/<title>([^<]+)<\/title>/i) || [])[1] || 'Meyer Burger Produkt';
    const product = makeProduct({ name: `${title} (Beispielmodul)`, imageUrl: ogImage, description: 'Automatisch erfasstes Beispielprodukt.' });
    return makeManufacturer({ slug: 'meyer-burger', name: 'Meyer Burger', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'meyer-burger', name: 'Meyer Burger', logoUrl: null, website, products: [] });
  }
}
