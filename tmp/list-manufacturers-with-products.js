const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'manufacturers');

const slugs = [];

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.ts')) continue;
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const slugMatch = content.match(/slug: '([^']+)'/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  const productsMatch = content.match(/products:\s*\[([\s\S]*?)\n\s*\]/);
  if (!productsMatch) continue;
  const inner = productsMatch[1].trim();
  if (inner.length > 0) {
    slugs.push(slug);
  }
}

slugs.sort();
console.log(slugs.join('\n'));
