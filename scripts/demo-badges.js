import { productCatalog } from '../data/products.generated.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Demo script to assign example badges for testing UI
 */
async function assignDemoBadges() {
  console.log('🚀 Assigning demo badges for UI testing...');
  
  // Demo badge assignments
  const demoBadges = {
    'Meyer Burger Black': {
      type: 'premium',
      label: 'Premium',
      color: 'blue'
    },
    'Q.PEAK DUO ML-G11S': {
      type: 'preis-leistungssieger', 
      label: 'Preis-/Leistungssieger',
      color: 'green'
    },
    'JA Solar DeepBlue 4.0 Pro': {
      type: 'preiswerteste',
      label: 'Preiswerteste',
      color: 'yellow'
    },
    'SMA Sunny Tripower 8.0': {
      type: 'premium',
      label: 'Premium',
      color: 'blue'
    },
    'Battery-Box Premium HVS': {
      type: 'preis-leistungssieger',
      label: 'Preis-/Leistungssieger',
      color: 'green'
    }
  };

  // Apply badges to products in the catalog
  let totalBadgesAssigned = 0;
  const updatedCatalog = JSON.parse(JSON.stringify(productCatalog));
  
  for (const manufacturer of updatedCatalog.manufacturers) {
    for (const product of manufacturer.products) {
      if (demoBadges[product.name]) {
        product.aiBadge = demoBadges[product.name];
        totalBadgesAssigned++;
        console.log(`✅ Assigned ${demoBadges[product.name].label} badge to ${product.name}`);
      }
    }
  }

  console.log(`\n🎉 Successfully assigned ${totalBadgesAssigned} demo badges!`);

  // Write updated catalog back to file
  const outputPath = join(process.cwd(), 'data', 'products.generated.ts');
  const originalContent = readFileSync(outputPath, 'utf8');
  
  // Extract imports and interface definitions
  const importSection = originalContent.match(/^(.*?export const productCatalog)/s)?.[1] || '';
  
  const updatedContent = `${importSection}: ProductCatalog = ${JSON.stringify(updatedCatalog, null, 2)};
`;

  writeFileSync(outputPath, updatedContent);
  console.log(`📝 Updated product catalog saved to ${outputPath}`);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  assignDemoBadges();
}

export { assignDemoBadges };