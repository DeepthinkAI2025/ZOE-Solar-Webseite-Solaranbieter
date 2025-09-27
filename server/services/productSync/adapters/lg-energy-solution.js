import { makeManufacturer, makeProduct } from './adapterInterface.js';

export async function fetchLGEnergySolution() {
  const website = 'https://www.lgessbattery.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const product = makeProduct({ name: 'LG ESS (Beispiel)', imageUrl: ogImage, description: 'Automatisch erfasstes LG-Beispielprodukt.' });
    return makeManufacturer({ slug: 'lg-energy-solution', name: 'LG Energy Solution', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'lg-energy-solution', name: 'LG Energy Solution', logoUrl: null, website, products: [] });
  }
}
