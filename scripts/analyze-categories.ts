import { productCatalog } from '../data/products.generated';

const categories = new Map<string, Set<string>>();
const productCounts = new Map<string, number>();

for (const manufacturer of productCatalog.manufacturers) {
  productCounts.set(manufacturer.slug, manufacturer.products.length);
  for (const cat of manufacturer.category) {
    if (!categories.has(cat)) {
      categories.set(cat, new Set());
    }
    categories.get(cat)!.add(manufacturer.slug);
  }
}

for (const [category, manufacturers] of categories.entries()) {
  const makerList = Array.from(manufacturers).sort();
  console.log(`${category}: ${manufacturers.size} Hersteller -> ${makerList.join(', ')}`);
  const underThree = makerList.filter((slug) => (productCounts.get(slug) ?? 0) < 3);
  if (underThree.length) {
    console.log(`  Hersteller mit <3 Produkten: ${underThree.join(', ')}`);
  }
}
