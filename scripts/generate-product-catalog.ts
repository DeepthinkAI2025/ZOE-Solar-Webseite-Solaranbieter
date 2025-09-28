import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import type {
  ProductCatalog,
  Product,
  ProductCategory,
  Manufacturer,
} from '../data/productTypes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');

const EXPANSION_FILE = path.join(dataDir, 'manufacturers-products-expansion.json');
const OUTPUT_FILE = path.join(dataDir, 'products.generated.ts');
const MANUFACTURERS_DIR = path.join(dataDir, 'manufacturers');

const CATEGORY_MAP: Record<string, ProductCategory> = {
  Module: 'Module',
  Wechselrichter: 'Wechselrichter',
  Speichersysteme: 'Speicher',
  Montagesysteme: 'Unterkonstruktion',
  Solaroptimierer: 'Leistungsoptimierer',
  Notstromsysteme: 'Elektrokomponenten',
};

type ExpansionProduct = {
  name: string;
  description?: string;
  price?: number;
  specs?: Record<string, string | number>;
  keyFeatures?: string[];
};

type ExpansionManufacturer = {
  name: string;
  logoUrl?: string;
  description?: string;
  whyWeTrust?: string[];
  products?: ExpansionProduct[];
  officialWebsite?: string;
};

type ManufacturersToExpand = Record<
  string,
  {
    current_products?: number;
    new_products?: ExpansionProduct[];
  }
>;

type ExpansionCategory = {
  description?: string;
  existing_manufacturers?: string[] | Record<string, unknown>;
  new_manufacturers?: string[] | Record<string, unknown>;
  manufacturers_to_expand?: ManufacturersToExpand;
  new_manufacturer_data?: Record<string, ExpansionManufacturer>;
};

type ExpansionPlan = {
  expansion_plan: {
    categories?: Record<string, ExpansionCategory>;
    [key: string]: unknown;
  };
};

const DEFAULT_IMAGE = '';

async function loadExistingManufacturers(): Promise<Record<string, Manufacturer>> {
  const files = await fs.readdir(MANUFACTURERS_DIR);
  const manufacturers: Record<string, Manufacturer> = {};

  for (const file of files) {
    if (!file.endsWith('.ts')) continue;

    const filePath = path.join(MANUFACTURERS_DIR, file);
    const moduleUrl = pathToFileURL(filePath).href;
    const imported = await import(moduleUrl);
    const manufacturer: Manufacturer | undefined =
      imported?.default ?? imported?.manufacturer;

    if (!manufacturer) continue;

    manufacturers[manufacturer.slug] = JSON.parse(JSON.stringify(manufacturer));
  }

  return manufacturers;
}

function ensureCategory(manufacturer: Manufacturer, category: ProductCategory) {
  if (!manufacturer.category.includes(category)) {
    manufacturer.category.push(category);
  }
}

function normalizeSpecs(
  specs?: Record<string, string | number>
): Record<string, string> | undefined {
  if (!specs) return undefined;
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(specs)) {
    if (value === undefined || value === null) continue;
    normalized[key] = String(value);
  }

  return Object.keys(normalized).length ? normalized : undefined;
}

function createProduct(
  expansionProduct: ExpansionProduct,
  category: ProductCategory,
  manufacturerSlug: string
): Product {
  return {
    name: expansionProduct.name,
    category,
    manufacturerSlug,
    imageUrl: DEFAULT_IMAGE,
    description: expansionProduct.description ?? '',
    basePrice:
      typeof expansionProduct.price === 'number'
        ? Math.round(expansionProduct.price * 100) / 100
        : undefined,
    configurable: false,
    specs: normalizeSpecs(expansionProduct.specs),
    keyFeatures: expansionProduct.keyFeatures,
  };
}

function mergeManufacturerData(
  target: Manufacturer,
  source?: ExpansionManufacturer
) {
  if (!source) return;

  target.name = source.name ?? target.name;
  if (source.logoUrl) target.logoUrl = source.logoUrl;
  if (source.description) target.description = source.description;
  if (source.whyWeTrust?.length) target.whyWeTrust = source.whyWeTrust;
  if (source.officialWebsite) target.officialWebsite = source.officialWebsite;
}

function upsertManufacturer(
  slug: string,
  category: ProductCategory,
  existingManufacturers: Record<string, Manufacturer>,
  catalogMap: Map<string, Manufacturer>,
  sourceData?: ExpansionManufacturer
): Manufacturer {
  let manufacturer = catalogMap.get(slug);

  if (!manufacturer) {
    if (sourceData) {
      manufacturer = {
        slug,
        name: sourceData.name,
        logoUrl: sourceData.logoUrl ?? '',
        category: [],
        description: sourceData.description ?? '',
        whyWeTrust: sourceData.whyWeTrust ?? [],
        products: [],
        officialWebsite: sourceData.officialWebsite,
      };
    } else if (existingManufacturers[slug]) {
      manufacturer = JSON.parse(JSON.stringify(existingManufacturers[slug]));
    } else {
      manufacturer = {
        slug,
        name: slug
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        logoUrl: '',
        category: [],
        description: '',
        whyWeTrust: [],
        products: [],
      };
    }

    catalogMap.set(slug, manufacturer);
  }

  mergeManufacturerData(manufacturer, sourceData);
  ensureCategory(manufacturer, category);

  return manufacturer;
}

function upsertProduct(manufacturer: Manufacturer, product: Product) {
  const existingIndex = manufacturer.products.findIndex(
    (existing) => existing.name === product.name
  );

  if (existingIndex >= 0) {
    manufacturer.products[existingIndex] = {
      ...manufacturer.products[existingIndex],
      ...product,
    };
    return;
  }

  manufacturer.products.push(product);
}

async function generateProductCatalog() {
  const [existingManufacturers, expansionRaw] = await Promise.all([
    loadExistingManufacturers(),
    fs.readFile(EXPANSION_FILE, 'utf8'),
  ]);

  const expansionPlan: ExpansionPlan = JSON.parse(expansionRaw);
  const catalogMap = new Map<string, Manufacturer>();

  const categoryEntries: [string, ExpansionCategory][] = [];

  if (expansionPlan.expansion_plan.categories) {
    categoryEntries.push(
      ...Object.entries(expansionPlan.expansion_plan.categories)
    );
  }

  for (const [key, value] of Object.entries(expansionPlan.expansion_plan)) {
    if (key === 'goal' || key === 'categories') continue;
    categoryEntries.push([key, value as ExpansionCategory]);
  }

  for (const [categoryName, categoryData] of categoryEntries) {
    const mappedCategory = CATEGORY_MAP[categoryName];
    if (!mappedCategory) {
      console.warn(`⚠️  Keine Zuordnung für Kategorie "${categoryName}" gefunden. Überspringe.`);
      continue;
    }

    const manufacturerData = categoryData?.new_manufacturer_data ?? {};

    if (categoryData?.manufacturers_to_expand) {
      for (const [slug, info] of Object.entries(
        categoryData.manufacturers_to_expand
      )) {
        const manufacturer = upsertManufacturer(
          slug,
          mappedCategory,
          existingManufacturers,
          catalogMap,
          manufacturerData[slug]
        );

        const products = info?.new_products ?? [];
        for (const product of products) {
          upsertProduct(
            manufacturer,
            createProduct(product, mappedCategory, slug)
          );
        }
      }
    }

    for (const [slug, data] of Object.entries(manufacturerData)) {
      const manufacturer = upsertManufacturer(
        slug,
        mappedCategory,
        existingManufacturers,
        catalogMap,
        data
      );

      const products = data.products ?? [];
      for (const product of products) {
        upsertProduct(
          manufacturer,
          createProduct(product, mappedCategory, slug)
        );
      }
    }
  }

  // Clean up manufacturers: remove duplicates, sort products by name
  const manufacturers = Array.from(catalogMap.values()).map((manufacturer) => {
    const products = manufacturer.products
      .map((product) => ({
        ...product,
        keyFeatures: product.keyFeatures?.length
          ? product.keyFeatures
          : undefined,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      ...manufacturer,
      category: Array.from(new Set(manufacturer.category)),
      products,
    };
  });

  manufacturers.sort((a, b) => a.name.localeCompare(b.name));

  const allCategories = Array.from(
    new Set(
      manufacturers.flatMap((manufacturer) => manufacturer.category)
    )
  ).sort();

  const generatedAt = new Date().toISOString();

  const productCatalog: ProductCatalog = {
    version: '2025.09.28-expanded',
    generatedAt,
    source: {
      system: 'expansion-plan-generator',
      lastSync: generatedAt,
      reference: path.relative(rootDir, EXPANSION_FILE),
    },
    metadata: {
      locale: 'de-DE',
      tags: ['expanded', 'auto-generated'],
    },
    allCategories: allCategories as ProductCategory[],
    manufacturers,
  };

  const fileContent = `import { ProductCatalog } from './productTypes';

export const productCatalog: ProductCatalog = ${JSON.stringify(
    productCatalog,
    null,
    2
  )} as ProductCatalog;

export default productCatalog;
`;

  await fs.writeFile(OUTPUT_FILE, fileContent, 'utf8');

  console.log(
    `✅ Produktkatalog generiert: ${manufacturers.length} Hersteller, ${manufacturers.reduce(
      (sum, m) => sum + m.products.length,
      0
    )} Produkte.`
  );
  console.log(`📄 Datei aktualisiert: ${path.relative(rootDir, OUTPUT_FILE)}`);
}

generateProductCatalog().catch((error) => {
  console.error('❌ Fehler beim Generieren des Produktkatalogs:', error);
  process.exit(1);
});
