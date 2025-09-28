import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'server/storage/products.live.json');

let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const product = data.manufacturers[0].products[0];

console.log('=== Beispielprodukt: ' + product.name + ' ===');
console.log('Kategorie:', product.category);
console.log('Preisspanne:', product.priceRange.min + '€ - ' + product.priceRange.max + '€');
console.log('Bild vorhanden:', !!product.imageUrl);
console.log('');

console.log('=== Erweiterte Specs ===');
if (product.enhancedSpecs) {
  Object.keys(product.enhancedSpecs).forEach(category => {
    console.log(category.toUpperCase() + ':');
    if (Array.isArray(product.enhancedSpecs[category])) {
      product.enhancedSpecs[category].forEach(item => console.log('  - ' + item));
    } else {
      Object.keys(product.enhancedSpecs[category]).forEach(key => {
        console.log('  ' + key + ': ' + product.enhancedSpecs[category][key]);
      });
    }
    console.log('');
  });
}

console.log('=== Strukturierte Dokumente ===');
if (product.structuredDocuments) {
  Object.keys(product.structuredDocuments).forEach(type => {
    if (product.structuredDocuments[type].length > 0) {
      console.log(type.toUpperCase() + ':');
      product.structuredDocuments[type].forEach(doc => {
        console.log('  - ' + doc.title + ' (' + doc.url + ')');
      });
      console.log('');
    }
  });
}