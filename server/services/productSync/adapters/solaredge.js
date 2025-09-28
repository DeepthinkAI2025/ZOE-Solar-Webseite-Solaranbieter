import { makeManufacturer, makeProduct } from './adapterInterface.js';
import { fetchProductDocuments } from './generic.js';

export async function fetchSolarEdge() {
  const website = 'https://www.solaredge.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const productName = 'SolarEdge Home Hub';
  const docs = await fetchProductDocuments(productName, 'SolarEdge', website);
    const product = makeProduct({
      name: productName,
      imageUrl: ogImage,
      description: 'Automatisch erfasstes Beispielprodukt.',
      datasheetUrls: docs.datasheetUrls,
      installationManualUrls: docs.installationManualUrls,
      additionalDocumentUrls: docs.additionalDocumentUrls,
      documents: docs.documents
    });
    return makeManufacturer({ slug: 'solaredge', name: 'SolarEdge', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'solaredge', name: 'SolarEdge', logoUrl: null, website, products: [] });
  }
}
