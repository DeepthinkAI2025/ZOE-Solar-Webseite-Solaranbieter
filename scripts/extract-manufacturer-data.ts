#!/usr/bin/env tsx

/**
 * Automatisches Script zur Extraktion von Herstellerdaten mit Serena MCP
 *
 * Usage: npm run extract:manufacturers
 * oder: tsx scripts/extract-manufacturer-data.ts
 */

import { manufacturerDataExtractionService } from '../services/manufacturerDataExtractionService';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface ExtractionReport {
  timestamp: string;
  summary: {
    totalManufacturers: number;
    totalProducts: number;
    totalImages: number;
    processingTime: number;
    errors: number;
  };
  manufacturers: {
    slug: string;
    name: string;
    productsFound: number;
    hasImages: boolean;
    status: 'success' | 'partial' | 'failed';
    missingData: string[];
  }[];
  errors: string[];
}

async function main() {
  console.log('🚀 Starting manufacturer data extraction with Serena MCP...');
  console.log('='.repeat(60));

  try {
    // Starte die Extraktion
    const result = await manufacturerDataExtractionService.extractAllManufacturerData();

    // Erstelle den Report
    const report: ExtractionReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalManufacturers: result.summary.totalManufacturers,
        totalProducts: result.summary.totalProducts,
        totalImages: result.summary.totalImages,
        processingTime: result.summary.processingTime,
        errors: result.errors.length
      },
      manufacturers: result.manufacturers.map(m => ({
        slug: m.slug,
        name: m.name,
        productsFound: m.products.length,
        hasImages: m.products.some(p => p.imageUrl),
        status: m.products.length > 0 ? 'success' : 'failed',
        missingData: m.missingData
      })),
      errors: result.errors
    };

    // Speichere die extrahierten Daten
    const outputDir = join(process.cwd(), 'data', 'extracted');
    mkdirSync(outputDir, { recursive: true });

    // Speichere komplette Daten als JSON
    writeFileSync(
      join(outputDir, 'manufacturer-data-extracted.json'),
      JSON.stringify(result.manufacturers, null, 2)
    );

    // Speichere den Report
    writeFileSync(
      join(outputDir, 'extraction-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generiere TypeScript-Dateien für jeden Hersteller
    const generatedFiles = await generateManufacturerFiles(result.manufacturers);

    // Zeige Zusammenfassung
    console.log('\n✅ Extraction completed successfully!');
    console.log('='.repeat(60));
    console.log(`📊 SUMMARY:`);
    console.log(`   • Manufacturers processed: ${result.summary.totalManufacturers}`);
    console.log(`   • Products found: ${result.summary.totalProducts}`);
    console.log(`   • Images processed: ${result.summary.totalImages}`);
    console.log(`   • Processing time: ${(result.summary.processingTime / 1000).toFixed(2)}s`);
    console.log(`   • Files generated: ${generatedFiles}`);
    console.log(`   • Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('\n⚠️  Warnings/Errors:');
      result.errors.forEach(error => console.log(`   • ${error}`));
    }

    // Top-Hersteller anzeigen
    console.log('\n🏆 Top Manufacturers by Products:');
    const topManufacturers = result.manufacturers
      .sort((a, b) => b.products.length - a.products.length)
      .slice(0, 5);

    topManufacturers.forEach(m => {
      console.log(`   • ${m.name}: ${m.products.length} products`);
    });

    // Datenstruktur-Report
    console.log('\n📁 Files generated:');
    console.log(`   • data/extracted/manufacturer-data-extracted.json`);
    console.log(`   • data/extracted/extraction-report.json`);
    console.log(`   • ${generatedFiles} manufacturer TypeScript files`);

    console.log('\n🎯 Next steps:');
    console.log('   1. Review generated files in data/extracted/');
    console.log('   2. Manually review critical manufacturers');
    console.log('   3. Download missing product images');
    console.log('   4. Update manufacturer files in data/manufacturers/');

  } catch (error) {
    console.error('\n❌ Extraction failed:', error);
    process.exit(1);
  }
}

/**
 * Generiert TypeScript-Dateien für jeden Hersteller
 */
async function generateManufacturerFiles(manufacturers: any[]): Promise<number> {
  let filesGenerated = 0;
  const outputDir = join(process.cwd(), 'data', 'manufacturers-generated');

  mkdirSync(outputDir, { recursive: true });

  for (const manufacturer of manufacturers) {
    try {
      // Generiere TypeScript-Datei im bestehenden Format
      const tsContent = generateManufacturerTS(manufacturer);
      const filename = `${manufacturer.slug}.ts`;
      const filepath = join(outputDir, filename);

      writeFileSync(filepath, tsContent);
      filesGenerated++;

      console.log(`   📄 Generated: ${filename} (${manufacturer.products.length} products)`);

    } catch (error) {
      console.warn(`   ⚠️  Failed to generate file for ${manufacturer.name}:`, error);
    }
  }

  return filesGenerated;
}

/**
 * Generiert TypeScript-Inhalt für einen Hersteller
 */
function generateManufacturerTS(manufacturer: any): string {
  const products = manufacturer.products.map((product: any) => {
    return `  {
    id: '${product.id}',
    name: '${product.name.replace(/'/g, "\\'")}',
    category: '${product.category}',
    imageUrl: '${product.imageUrl || ''}',
    description: '${product.description.replace(/'/g, "\\'")}',
    specifications: ${JSON.stringify(product.specifications)},
    keyFeatures: ${JSON.stringify(product.keyFeatures)},
    warranty: ${JSON.stringify(product.warranty)},
    efficiency: ${product.efficiency || null},
    power: ${JSON.stringify(product.power)},
    dimensions: ${JSON.stringify(product.dimensions)},
    certifications: ${JSON.stringify(product.certifications || [])},
    availability: '${product.availability || 'available'}',
    lastUpdated: '${product.lastUpdated}',
    confidence: ${product.confidence}
  }`;
  }).join(',\n');

  return `/**
 * Auto-generated manufacturer data
 * Generated: ${new Date().toISOString()}
 * Manufacturer: ${manufacturer.name}
 * Products: ${manufacturer.products.length}
 *
 * This file was generated by Serena MCP Manufacturer Data Extraction Service
 * Manual review and adjustments recommended before deployment
 */

import { Product, ProductCategory } from '../productTypes';

export const ${manufacturer.slug.replace(/-/g, '')}: Manufacturer = {
  slug: '${manufacturer.slug}',
  name: '${manufacturer.name}',
  logoUrl: '${manufacturer.logoUrl}',
  category: ${JSON.stringify(manufacturer.categories || [])},
  description: \`${manufacturer.description.replace(/`/g, '\\`')}\`,
  whyWeTrust: [
    ${manufacturer.specialties?.map((s: string) => `'${s.replace(/'/g, "\\'")}'`).join(',\n    ') || "'High quality products'", "'Industry reputation'", "'Comprehensive warranty'"}
  ],
  products: [
${products}
  ],
  headquarters: ${JSON.stringify(manufacturer.headquarters)},
  officialWebsite: '${manufacturer.website}',
  updatedAt: '${manufacturer.lastUpdated}',
  marketPosition: '${manufacturer.marketPosition || 'mid_range'}',
  reliability: ${JSON.stringify(manufacturer.reliability || { score: 85, source: 'industry_analysis' })},
  certifications: ${JSON.stringify(manufacturer.certifications || [])},
  extractionComplete: ${manufacturer.extractionComplete},
  totalProductsFound: ${manufacturer.totalProductsFound},
  missingData: ${JSON.stringify(manufacturer.missingData || [])}
};

// Type definition for compatibility
interface Manufacturer {
  slug: string;
  name: string;
  logoUrl: string;
  category: ProductCategory[];
  description: string;
  whyWeTrust: string[];
  products: Product[];
  headquarters?: {
    country: string;
    city: string;
  };
  officialWebsite: string;
  updatedAt: string;
  marketPosition?: 'premium' | 'mid_range' | 'budget';
  reliability?: {
    score: number;
    source: string;
  };
  certifications?: string[];
  extractionComplete?: boolean;
  totalProductsFound?: number;
  missingData?: string[];
}
`;
}

// Führe das Script aus
if (require.main === module) {
  main().catch(console.error);
}

export { main as extractManufacturerData };