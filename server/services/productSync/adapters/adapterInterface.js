// Adapter interface helpers
export function makeProduct({ name, imageUrl, description, basePrice }) {
  return {
    name: name || 'Unknown Product',
    imageUrl: imageUrl || null,
    description: description || null,
    basePrice: basePrice || null,
    configurable: false,
    specs: {},
    keyFeatures: []
  };
}

export function makeManufacturer({ slug, name, logoUrl, website, products = [] }) {
  return { slug, name, logoUrl, website, products };
}
