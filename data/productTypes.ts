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
}

export interface ManufacturerHistory {
  year: string;
  milestone: string;
  description: string;
}

export interface ManufacturerCertification {
  name: string;
  issuedBy: string;
  validUntil?: string;
  description: string;
}

export interface ManufacturerAchievement {
  title: string;
  year: string;
  description: string;
  category: 'award' | 'certification' | 'milestone' | 'innovation';
}

export interface ManufacturerSustainability {
  co2Neutral: boolean;
  renewableEnergy: number; // percentage
  recyclingProgram: boolean;
  certifications: string[];
  description: string;
}

export interface ManufacturerStats {
  foundedYear: number;
  employeesGlobal: number;
  marketPresence: string[];
  annualProduction?: string;
  totalInstalled?: string;
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
  // Enhanced content fields
  companyHistory?: ManufacturerHistory[];
  certifications?: ManufacturerCertification[];
  achievements?: ManufacturerAchievement[];
  sustainability?: ManufacturerSustainability;
  stats?: ManufacturerStats;
  technicalInnovations?: string[];
  qualityAssurance?: {
    iso?: string[];
    testing?: string[];
    warranty?: {
      product: string;
      performance: string;
      description: string;
    };
  };
  regionalPartnerships?: {
    region: string;
    partners: string[];
    serviceCenter: boolean;
  }[];
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
