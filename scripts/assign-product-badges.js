import { generateProductBadges } from '../server/services/providers/geminiProvider.js';
import { productCatalog } from '../data/products.generated.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Script to assign AI-powered badges to products using Gemini
 */
async function assignProductBadges() {
  console.log('🚀 Starting AI badge assignment for products...');
  
  try {
    // Group products by category
    const productsByCategory = {};
    
    for (const manufacturer of productCatalog.manufacturers) {
      for (const product of manufacturer.products) {
        if (!productsByCategory[product.category]) {
          productsByCategory[product.category] = [];
        }
        productsByCategory[product.category].push({
          ...product,
          manufacturerName: manufacturer.name
        });
      }
    }

    console.log(`📊 Found products in ${Object.keys(productsByCategory).length} categories`);

    // Process each category
    const badgeAssignments = {};
    
    for (const [category, products] of Object.entries(productsByCategory)) {
      console.log(`\n🔍 Analyzing ${products.length} products in category: ${category}`);
      
      if (products.length < 2) {
        console.log(`⚠️  Skipping ${category} - need at least 2 products for comparison`);
        continue;
      }

      try {
        const badges = await generateProductBadges(products);
        console.log(`✅ Generated ${Object.keys(badges).length} badges for ${category}`);
        
        // Store badge assignments
        for (const [productName, badgeInfo] of Object.entries(badges)) {
          badgeAssignments[productName] = badgeInfo;
          console.log(`   🏷️  ${productName}: ${badgeInfo.label} (${badgeInfo.reasoning})`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${category}:`, error.message);
      }
    }

    // Apply badges to products in the catalog
    let totalBadgesAssigned = 0;
    const updatedCatalog = { ...productCatalog };
    
    for (const manufacturer of updatedCatalog.manufacturers) {
      for (const product of manufacturer.products) {
        if (badgeAssignments[product.name]) {
          product.aiBadge = {
            type: badgeAssignments[product.name].type,
            label: badgeAssignments[product.name].label,
            color: badgeAssignments[product.name].color
          };
          totalBadgesAssigned++;
        }
      }
    }

    console.log(`\n🎉 Successfully assigned ${totalBadgesAssigned} AI badges to products!`);

    // Write updated catalog back to file
    const outputPath = join(process.cwd(), 'data', 'products.generated.ts');
    const originalContent = readFileSync(outputPath, 'utf8');
    
    // Extract imports and interface definitions
    const importSection = originalContent.match(/^(.*?export const productCatalog)/s)?.[1] || '';
    
    const updatedContent = `${importSection}: ProductCatalog = ${JSON.stringify(updatedCatalog, null, 2)};
`;

    writeFileSync(outputPath, updatedContent);
    console.log(`📝 Updated product catalog saved to ${outputPath}`);

    // Summary report
    console.log('\n📈 Badge Assignment Summary:');
    const badgeStats = {};
    for (const assignment of Object.values(badgeAssignments)) {
      badgeStats[assignment.type] = (badgeStats[assignment.type] || 0) + 1;
    }
    
    for (const [type, count] of Object.entries(badgeStats)) {
      console.log(`   ${type}: ${count} products`);
    }

  } catch (error) {
    console.error('❌ Error in badge assignment:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  assignProductBadges();
}

export { assignProductBadges };