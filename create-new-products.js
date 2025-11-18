import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all manufacturer files
const manufacturersDir = path.join(__dirname, 'data', 'manufacturers');
const files = fs.readdirSync(manufacturersDir).filter(file => file.endsWith('.ts'));

// Generate imports
const imports = files.map(file => {
  const slug = file.replace('.ts', '');
  const varName = slug.replace(/-/g, '_');
  return `import { ${varName} } from './manufacturers/${slug}';`;
}).join('\n');

// Generate manufacturers array
const manufacturersArray = files.map(file => {
  const slug = file.replace('.ts', '');
  const varName = slug.replace(/-/g, '_');
  return `  ${varName},`;
}).join('\n');

// Create the new products.generated.ts content
const newContent = `import {
  ProductCatalog,
  Manufacturer,
  Product,
  ProductCategory,
  ProductCatalogSource,
  ProductCatalogMetadata,
} from './productTypes';

${imports}

export const productCatalog: ProductCatalog = {
  version: '2024.09.11-static-seed',
  generatedAt: '2024-09-11T00:00:00.000Z',
  source: {
    system: 'manual-curated-seed',
    lastSync: '2024-09-11T00:00:00.000Z',
    reference: 'Bootstrap dataset migrated from legacy products.ts'
  },
  metadata: {
    tags: ['static', 'bootstrap'],
    locale: 'de-DE'
  },
  allCategories: ['Module', 'Wechselrichter', 'Speicher', 'Ladestationen', 'Unterkonstruktion', 'Elektrokomponenten', 'Leistungsoptimierer'],
  manufacturers: [
${manufacturersArray}
  ]
};

export default productCatalog;
`;

const outputPath = path.join(__dirname, 'data', 'products.generated.new.ts');
fs.writeFileSync(outputPath, newContent, 'utf8');

console.log('New products.generated.ts created successfully!');
console.log(`Generated ${files.length} imports and manufacturers array entries`);