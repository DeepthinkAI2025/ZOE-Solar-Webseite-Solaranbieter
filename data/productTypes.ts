export type ProductCategory =
  | 'Module'
  | 'Wechselrichter'
  | 'Speicher'
  | 'Ladestationen'
  | 'Unterkonstruktion'
  | 'Elektrokomponenten'
  | 'Zubehör'
  | 'Leistungsoptimierer'
  | 'Wärmepumpen'
  | 'Smart-Meter/EMS';

export type ProductVoltageClass =
  | 'Hochvolt'
  | 'Niedervolt'
  | '120 V'
  | '230 V'
  | '400 V'
  | 'Universal'
  | 'Unbekannt'
  | string;

export interface ProductCompatibilitySource {
  label: string;
  url: string;
}

export interface ProductCompatibility {
  voltageClass?: ProductVoltageClass;
  inverterSeries?: string[];
  batterySystems?: string[];
  optimizerSeries?: string[];
  pvModuleClasses?: string[];
  communicationInterfaces?: string[];
  notes?: string[];
  incompatibleWith?: string[];
  sources?: ProductCompatibilitySource[];
}

export type ProductDocumentType =
  | 'datasheet'
  | 'installation_manual'
  | 'compatibility_list'
  | 'other';

export interface ProductDocument {
  type: ProductDocumentType;
  url: string;
  title?: string;
  description?: string;
  previewText?: string;
  language?: string;
}

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
  compatibility?: ProductCompatibility;
  datasheetUrls?: string[];
  installationManualUrls?: string[];
  additionalDocumentUrls?: string[];
  documents?: ProductDocument[];
  certifications?: string[];
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
