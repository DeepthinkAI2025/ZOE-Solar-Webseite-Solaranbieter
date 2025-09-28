import { makeManufacturer, makeProduct } from './adapterInterface.js';
import { fetchProductDocuments } from './generic.js';

export async function fetchFronius() {
  const website = 'https://www.fronius.com';
  try {
    const res = await fetch(website);
    const text = await res.text();
    const ogImage = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
    const productName = 'Fronius Symo 10.0-3-M';
  const docs = await fetchProductDocuments(productName, 'Fronius', website);
    const product = makeProduct({
      name: productName,
      imageUrl: ogImage,
      description: 'Automatisch erfasstes Fronius-Beispielprodukt.',
      datasheetUrls: docs.datasheetUrls,
      installationManualUrls: docs.installationManualUrls,
      additionalDocumentUrls: docs.additionalDocumentUrls,
      documents: docs.documents
    });
    return makeManufacturer({ slug: 'fronius', name: 'Fronius', logoUrl: ogImage, website, products: [product] });
  } catch (err) {
    return makeManufacturer({ slug: 'fronius', name: 'Fronius', logoUrl: null, website, products: [] });
  }
}
