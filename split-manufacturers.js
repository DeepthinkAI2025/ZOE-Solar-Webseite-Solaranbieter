import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the original file
const filePath = path.join(__dirname, 'data', 'products.generated.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extract manufacturers array
const manufacturersMatch = content.match(/manufacturers:\s*\[([\s\S]*?)\]/);
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

// Function to extract manufacturer objects
function extractManufacturers(content) {
  const manufacturers = [];
  let i = 0;

  while (i < content.length) {
    // Skip whitespace
    while (i < content.length && /\s/.test(content[i])) i++;

    // Look for opening brace
    if (content[i] === '{') {
      let braceCount = 1;
      let start = i;
      i++;

      // Find matching closing brace
      while (i < content.length && braceCount > 0) {
        if (content[i] === '{') {
          braceCount++;
        } else if (content[i] === '}') {
          braceCount--;
        }
        i++;
      }

      if (braceCount === 0) {
        const manufacturerText = content.slice(start, i).trim();
        // Remove trailing comma if present
        const cleanText = manufacturerText.replace(/,$/, '');

        // Check if this is a manufacturer object (has slug)
        if (cleanText.includes('slug:')) {
          manufacturers.push(cleanText);
        }
      }
    } else {
      i++;
    }
  }

  return manufacturers;
}

const manufacturerBlocks = extractManufacturers(manufacturersContent);
console.log(`Found ${manufacturerBlocks.length} manufacturers`);

manufacturerBlocks.forEach((block, index) => {
  // Extract slug
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) {
    console.log(`No slug found in block ${index}: ${block.slice(0, 100)}...`);
    return;
  }

  const slug = slugMatch[1];
  const fileName = `${slug}.ts`;

  // Create the manufacturer file content
  const manufacturerContent = `import { Manufacturer } from '../productTypes';

export const ${slug.replace(/-/g, '_')}: Manufacturer = ${block};

export default ${slug.replace(/-/g, '_')};
`;

  const filePath = path.join(manufacturersDir, fileName);
  fs.writeFileSync(filePath, manufacturerContent, 'utf8');
  console.log(`Created ${fileName}`);
});

console.log('All manufacturers extracted successfully!');