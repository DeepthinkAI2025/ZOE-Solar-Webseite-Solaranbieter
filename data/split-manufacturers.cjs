const fs = require('fs');
const path = require('path');

// Read the original file
const filePath = path.join(__dirname, 'products.generated.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extract the manufacturers array
const manufacturersMatch = content.match(/manufacturers:\s*\[([\s\S]*?)\]/);
if (!manufacturersMatch) {
  console.error('Could not find manufacturers array');
  process.exit(1);
}

const manufacturersContent = manufacturersMatch[1];

// Split manufacturers by finding each manufacturer object
const manufacturerRegex = /\{\s*slug:\s*'([^']+)',\s*([\s\S]*?)\n\s*\},?\s*(?=\{\s*slug:|\]\})/g;
const manufacturers = [];
let match;

while ((match = manufacturerRegex.exec(manufacturersContent)) !== null) {
  const slug = match[1];
  const manufacturerContent = match[0];
  manufacturers.push({ slug, content: manufacturerContent });
}

console.log(`Found ${manufacturers.length} manufacturers`);

// Create manufacturers directory if it doesn't exist
const manufacturersDir = path.join(__dirname, 'manufacturers');
if (!fs.existsSync(manufacturersDir)) {
  fs.mkdirSync(manufacturersDir, { recursive: true });
}

// Write each manufacturer to a separate file
manufacturers.forEach(({ slug, content }) => {
  const fileName = `${slug}.ts`;
  const fileContent = `import { Manufacturer } from '../productTypes';

export const manufacturer: Manufacturer = ${content};

export default manufacturer;
`;

  const filePath = path.join(manufacturersDir, fileName);
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Created ${fileName}`);
});

console.log('All manufacturers extracted successfully!');