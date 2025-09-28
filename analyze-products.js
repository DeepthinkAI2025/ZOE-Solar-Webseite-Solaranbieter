import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'server/storage/products.live.json');

let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('=== Erste 5 Produkte analysieren ===');
data.manufacturers.slice(0, 3).forEach((manufacturer, mIndex) => {
  console.log('\nHersteller:', manufacturer.name);
  manufacturer.products.slice(0, 2).forEach((product, pIndex) => {
    console.log('  Produkt:', product.name);
    console.log('  Kategorie:', product.category);
    console.log('  Name (lowercase):', product.name.toLowerCase());
    console.log('  Hat enhancedSpecs:', !!product.enhancedSpecs && Object.keys(product.enhancedSpecs).length > 0);
    if (product.enhancedSpecs && Object.keys(product.enhancedSpecs).length > 0) {
      console.log('  Enhanced Specs Keys:', Object.keys(product.enhancedSpecs));
    }
    console.log('');
  });
});