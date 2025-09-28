import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the original file
const filePath = path.join(__dirname, 'data', 'products.generated.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extract manufacturers array - use greedy match to get everything until the last ]
const manufacturersMatch = content.match(/manufacturers:\s*\[([\s\S]*)\]/);
if (!manufacturersMatch) {
  console.error('Could not find manufacturers array');
  process.exit(1);
}

const manufacturersContent = manufacturersMatch[1];

// Create manufacturers directory if it doesn't exist
const manufacturersDir = path.join(__dirname, 'data', 'manufacturers');
if (!fs.existsSync(manufacturersDir)) {
  fs.mkdirSync(manufacturersDir, { recursive: true });
}

function extractManufacturers(content) {
  const manufacturers = [];
  const length = content.length;
  let index = 0;

  while (index < length) {
    // find next object start
    while (index < length && content[index] !== '{') {
      index++;
    }
    if (index >= length) {
      break;
    }

    const start = index;
    let braceDepth = 0;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let escapeNext = false;

    while (index < length) {
      const char = content[index];

      if (escapeNext) {
        escapeNext = false;
        index++;
        continue;
      }

      if (char === '\\') {
        escapeNext = true;
        index++;
        continue;
      }

      if (inSingle) {
        if (char === "'") {
          inSingle = false;
        }
        index++;
        continue;
      }

      if (inDouble) {
        if (char === '"') {
          inDouble = false;
        }
        index++;
        continue;
      }

      if (inTemplate) {
        if (char === '`') {
          inTemplate = false;
        }
        index++;
        continue;
      }

      if (char === "'") {
        inSingle = true;
        index++;
        continue;
      }

      if (char === '"') {
        inDouble = true;
        index++;
        continue;
      }

      if (char === '`') {
        inTemplate = true;
        index++;
        continue;
      }

      if (char === '{') {
        braceDepth++;
      } else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          index++;
          break;
        }
      }

      index++;
    }

    let end = index;

    // Consume trailing whitespace and optional comma
    while (index < length && /\s/.test(content[index])) {
      index++;
    }
    if (content[index] === ',') {
      index++;
    }

    const objectText = content.slice(start, end).trim();
    if (objectText.includes('slug:')) {
      manufacturers.push(objectText);
    }
  }

  return manufacturers;
}

const manufacturers = extractManufacturers(manufacturersContent);

console.log(`Found ${manufacturers.length} manufacturers`);

manufacturers.forEach((manufacturer, index) => {
  // Extract slug
  const slugMatch = manufacturer.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) {
    console.log(`No slug found in manufacturer ${index}: ${manufacturer.slice(0, 100)}...`);
    return;
  }

  const slug = slugMatch[1];
  const fileName = `${slug}.ts`;

  // Create the manufacturer file content
  const manufacturerContent = `import { Manufacturer } from '../productTypes';

export const ${slug.replace(/-/g, '_')}: Manufacturer = ${manufacturer};

export default ${slug.replace(/-/g, '_')};
`;

  const filePath = path.join(manufacturersDir, fileName);
  fs.writeFileSync(filePath, manufacturerContent, 'utf8');
  console.log(`Created ${fileName}`);
});

console.log('All manufacturers extracted successfully!');