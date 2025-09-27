export type ProductCategory =
  | 'Module'
  | 'Wechselrichter'
  | 'Speicher'
  | 'Ladestationen'
  | 'Unterkonstruktion'
  | 'Elektrokomponenten'
  | 'Zubehör'
  | 'Leistungsoptimierer';

export interface Product {
  name: string;
  category: ProductCategory;
  manufacturerSlug: string;
  imageUrl: string;
  description: string;
  basePrice?: number;
  configurable?: boolean;
  specs?: Record<string, string | number>;
  keyFeatures?: string[];
  aiBadge?: {
    type: 'preiswerteste' | 'premium' | 'preis-leistungssieger';
    label: string;
    color: 'green' | 'blue' | 'yellow';
  };
}

export interface Manufacturer {
  slug: string;
  name: string;
  logoUrl: string;
  category: ProductCategory[];
  description: string;
  whyWeTrust: string[];
  products: Product[];
  headquarters?: {
    country?: string;
    city?: string;
    lat?: number;
    lng?: number;
  };
  officialWebsite?: string;
  updatedAt?: string;
}

export interface ProductCatalogSource {
  system: string;
  lastSync: string;
  reference?: string;
}

export interface ProductCatalogMetadata {
  locale?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface ProductCatalog {
  manufacturers: Manufacturer[];
  allCategories: ProductCategory[];
  version: string;
  generatedAt: string;
  source?: ProductCatalogSource;
  metadata?: ProductCatalogMetadata;
}
