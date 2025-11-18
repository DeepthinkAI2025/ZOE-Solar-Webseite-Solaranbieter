/**
 * Serena MCP Service - Automated Manufacturer & Product Data Extraction
 * Speziell entwickelt für die ZOE Solar Website zur automatischen Extraktion
 * von Herstellerdaten, Produktinformationen und Bildern
 */

import { serenaAIServiceOrchestrator, AIRequest } from './serenaAIServiceOrchestrator';

export interface ManufacturerProduct {
  id: string;
  name: string;
  category: 'Module' | 'Wechselrichter' | 'Speicher' | 'Ladestationen' | 'Unterkonstruktion' | 'Elektrokomponenten' | 'Leistungsoptimierer';
  manufacturer: string;
  imageUrl?: string;
  imageFileName?: string;
  description: string;
  specifications: Record<string, string | number>;
  keyFeatures: string[];
  warranty?: {
    product: number; // Jahre
    performance: number; // %
    service?: number; // Jahre
  };
  price?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  efficiency?: number; // %
  power?: {
    min?: number; // Wp
    max?: number; // Wp
    nominal?: number; // Wp
  };
  dimensions?: {
    length: number; // mm
    width: number; // mm
    height: number; // mm
    weight: number; // kg
  };
  certifications?: string[];
  availability?: 'available' | 'order' | 'discontinued';
  dataSheetUrl?: string;
  productPageUrl?: string;
  lastUpdated: string;
  dataSource: 'manufacturer_website' | 'distributor' | 'ai_generated' | 'manual';
  confidence: number; // 0-100
}

export interface ManufacturerData {
  slug: string;
  name: string;
  logoUrl: string;
  logoFileName: string;
  website: string;
  description: string;
  foundedYear?: number;
  headquarters?: {
    country: string;
    city: string;
  };
  categories: string[];
  specialties?: string[];
  products: ManufacturerProduct[];
  marketPosition?: 'premium' | 'mid_range' | 'budget';
  reliability?: {
    score: number; // 0-100
    source: string;
  };
  certifications?: string[];
  lastUpdated: string;
  extractionComplete: boolean;
  totalProductsFound: number;
  missingData: string[];
}

export interface ExtractionProgress {
  manufacturer: string;
  status: 'pending' | 'extracting' | 'validating' | 'completed' | 'failed';
  progress: number; // 0-100
  productsFound: number;
  imagesDownloaded: number;
  errors: string[];
  startTime: Date;
  estimatedCompletion?: Date;
}

class ManufacturerDataExtractionService {
  private static instance: ManufacturerDataExtractionService;
  private progress: Map<string, ExtractionProgress> = new Map();
  private extractedData: Map<string, ManufacturerData> = new Map();
  private isExtracting = false;

  private constructor() {}

  public static getInstance(): ManufacturerDataExtractionService {
    if (!ManufacturerDataExtractionService.instance) {
      ManufacturerDataExtractionService.instance = new ManufacturerDataExtractionService();
    }
    return ManufacturerDataExtractionService.instance;
  }

  /**
   * Hauptmethode: Extrahiert alle Herstellerdaten mit Serena MCP
   */
  public async extractAllManufacturerData(): Promise<{
    success: boolean;
    manufacturers: ManufacturerData[];
    errors: string[];
    summary: {
      totalManufacturers: number;
      totalProducts: number;
      totalImages: number;
      processingTime: number;
    };
  }> {
    if (this.isExtracting) {
      throw new Error('Extraction already in progress');
    }

    this.isExtracting = true;
    const startTime = Date.now();
    const errors: string[] = [];

    try {
      // Lese die bestehenden Herstellerdateien
      const existingManufacturers = await this.getExistingManufacturers();

      console.log(`🏭 Starting extraction for ${existingManufacturers.length} manufacturers...`);

      // Parallele Verarbeitung mit Limit (um API-Limits zu respektieren)
      const batchSize = 3; // 3 Hersteller gleichzeitig
      const results: ManufacturerData[] = [];

      for (let i = 0; i < existingManufacturers.length; i += batchSize) {
        const batch = existingManufacturers.slice(i, i + batchSize);

        const batchPromises = batch.map(async (manufacturer) => {
          try {
            const data = await this.extractManufacturerData(manufacturer);
            results.push(data);
            return data;
          } catch (error) {
            const errorMsg = `Failed to extract data for ${manufacturer.name}: ${error}`;
            console.error(errorMsg);
            errors.push(errorMsg);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(r => r !== null) as ManufacturerData[]);

        // Fortschritts-Update
        const progress = ((i + batchSize) / existingManufacturers.length) * 100;
        console.log(`📊 Progress: ${Math.min(100, progress).toFixed(1)}%`);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        manufacturers: results,
        errors,
        summary: {
          totalManufacturers: results.length,
          totalProducts: results.reduce((sum, m) => sum + m.products.length, 0),
          totalImages: results.reduce((sum, m) => sum + m.products.filter(p => p.imageUrl).length, 0),
          processingTime
        }
      };

    } catch (error) {
      console.error('Critical error during extraction:', error);
      errors.push(`Critical error: ${error}`);

      return {
        success: false,
        manufacturers: [],
        errors,
        summary: {
          totalManufacturers: 0,
          totalProducts: 0,
          totalImages: 0,
          processingTime: Date.now() - startTime
        }
      };
    } finally {
      this.isExtracting = false;
    }
  }

  /**
   * Extrahiert Daten für einen einzelnen Hersteller
   */
  private async extractManufacturerData(manufacturer: any): Promise<ManufacturerData> {
    const progress: ExtractionProgress = {
      manufacturer: manufacturer.name,
      status: 'extracting',
      progress: 0,
      productsFound: 0,
      imagesDownloaded: 0,
      errors: [],
      startTime: new Date()
    };

    this.progress.set(manufacturer.slug, progress);

    try {
      console.log(`🔍 Extracting data for ${manufacturer.name}...`);

      // Nutze Serena MCP für die Hersteller-Research
      const manufacturerInfo = await this.extractManufacturerInfo(manufacturer);
      progress.progress = 30;

      // Extrahiere Produkte mit AI-gestützter Analyse
      const products = await this.extractProducts(manufacturer, manufacturerInfo);
      progress.progress = 70;
      progress.productsFound = products.length;

      // Validiere und bereinige die Daten
      const validatedProducts = await this.validateProducts(products, manufacturer);
      progress.progress = 90;

      const result: ManufacturerData = {
        slug: manufacturer.slug,
        name: manufacturer.name,
        logoUrl: `/assets/logos/${manufacturer.logoFileName || manufacturer.slug + '.png'}`,
        logoFileName: manufacturer.logoFileName || manufacturer.slug + '.png',
        website: manufacturerInfo.website || '',
        description: manufacturerInfo.description || manufacturer.description || '',
        foundedYear: manufacturerInfo.foundedYear,
        headquarters: manufacturerInfo.headquarters,
        categories: manufacturer.categories || [],
        specialties: manufacturerInfo.specialties,
        products: validatedProducts,
        marketPosition: manufacturerInfo.marketPosition,
        reliability: manufacturerInfo.reliability,
        certifications: manufacturerInfo.certifications,
        lastUpdated: new Date().toISOString(),
        extractionComplete: true,
        totalProductsFound: products.length,
        missingData: this.identifyMissingData(validatedProducts)
      };

      progress.status = 'completed';
      progress.progress = 100;

      this.extractedData.set(manufacturer.slug, result);
      console.log(`✅ Completed extraction for ${manufacturer.name}: ${products.length} products found`);

      return result;

    } catch (error) {
      progress.status = 'failed';
      progress.errors.push(error instanceof Error ? error.message : 'Unknown error');

      console.error(`❌ Failed to extract data for ${manufacturer.name}:`, error);
      throw error;
    }
  }

  /**
   * Nutzt Serena MCP für die Hersteller-Informationen
   */
  private async extractManufacturerInfo(manufacturer: any): Promise<any> {
    const aiRequest: AIRequest = {
      type: 'content_optimization',
      parameters: {
        manufacturer: manufacturer.name,
        task: 'manufacturer_research',
        extractFields: [
          'website',
          'foundedYear',
          'headquarters',
          'specialties',
          'marketPosition',
          'reliability',
          'certifications',
          'companyDescription'
        ]
      },
      priority: 'medium',
      timeout: 30000,
      fallback: false
    };

    try {
      const response = await serenaAIServiceOrchestrator.processAIRequest(aiRequest);

      if (response.success && response.data) {
        return response.data.extractedData || {};
      }
    } catch (error) {
      console.warn(`AI extraction failed for ${manufacturer.name}, using fallback data`);
    }

    // Fallback-Daten
    return {
      website: `https://www.${manufacturer.name.toLowerCase().replace(/\s+/g, '')}.com`,
      description: manufacturer.description || `Leading manufacturer of ${manufacturer.categories?.join(', ')} for solar energy systems.`
    };
  }

  /**
   * Extrahiert Produkte mit Serena MCP
   */
  private async extractProducts(manufacturer: any, manufacturerInfo: any): Promise<ManufacturerProduct[]> {
    const products: ManufacturerProduct[] = [];

    // Bestimme Produktkategorien basierend auf Hersteller
    const categories = this.getProductCategoriesForManufacturer(manufacturer);

    for (const category of categories) {
      try {
        console.log(`📦 Extracting ${category} products for ${manufacturer.name}...`);

        const aiRequest: AIRequest = {
          type: 'content_optimization',
          parameters: {
            manufacturer: manufacturer.name,
            category,
            task: 'product_extraction',
            extractFields: [
              'name',
              'description',
              'specifications',
              'keyFeatures',
              'warranty',
              'efficiency',
              'power',
              'dimensions',
              'certifications',
              'imageUrl'
            ]
          },
          priority: 'medium',
          timeout: 25000,
          fallback: false
        };

        const response = await serenaAIServiceOrchestrator.processAIRequest(aiRequest);

        if (response.success && response.data?.products) {
          const categoryProducts = response.data.products.map((product: any, index: number) => ({
            id: `${manufacturer.slug}-${category.toLowerCase()}-${index + 1}`,
            name: product.name || `${manufacturer.name} ${category} ${index + 1}`,
            category: category as any,
            manufacturer: manufacturer.name,
            imageUrl: product.imageUrl,
            description: product.description || `High-quality ${category} from ${manufacturer.name}`,
            specifications: product.specifications || {},
            keyFeatures: product.keyFeatures || [],
            warranty: product.warranty,
            efficiency: product.efficiency,
            power: product.power,
            dimensions: product.dimensions,
            certifications: product.certifications,
            lastUpdated: new Date().toISOString(),
            dataSource: 'ai_generated',
            confidence: product.confidence || 75
          }));

          products.push(...categoryProducts);
        }

      } catch (error) {
        console.warn(`Failed to extract ${category} products for ${manufacturer.name}:`, error);

        // Fallback: Erstelle minimale Produkte
        const fallbackProduct: ManufacturerProduct = {
          id: `${manufacturer.slug}-${category.toLowerCase()}-1`,
          name: `${manufacturer.name} ${category} Base Model`,
          category: category as any,
          manufacturer: manufacturer.name,
          description: `Reliable ${category} from ${manufacturer.name}`,
          specifications: {},
          keyFeatures: ['High quality', 'Reliable performance', 'Manufacturer warranty'],
          lastUpdated: new Date().toISOString(),
          dataSource: 'manual',
          confidence: 50
        };

        products.push(fallbackProduct);
      }
    }

    return products;
  }

  /**
   * Validiert die extrahierten Produktdaten
   */
  private async validateProducts(products: ManufacturerProduct[], manufacturer: any): Promise<ManufacturerProduct[]> {
    return products.map(product => {
      // Validierung und Bereinigung
      const validated = { ...product };

      // Name validieren
      if (!validated.name || validated.name.length < 3) {
        validated.name = `${manufacturer.name} ${validated.category}`;
      }

      // Beschreibung validieren
      if (!validated.description || validated.description.length < 20) {
        validated.description = `Professional ${validated.category.toLowerCase()} from ${manufacturer.name} with reliable performance and manufacturer warranty.`;
      }

      // Spezifikationen bereinigen
      if (validated.specifications && typeof validated.specifications !== 'object') {
        validated.specifications = {};
      }

      // Kategorie validieren
      const validCategories = ['Module', 'Wechselrichter', 'Speicher', 'Ladestationen', 'Unterkonstruktion', 'Elektrokomponenten', 'Leistungsoptimierer'];
      if (!validCategories.includes(validated.category)) {
        validated.category = 'Module'; // Default
      }

      return validated;
    });
  }

  /**
   * Bestimmt die Produktkategorien für einen Hersteller
   */
  private getProductCategoriesForManufacturer(manufacturer: any): string[] {
    const categoryMap: Record<string, string[]> = {
      'jinko-solar': ['Module'],
      'trina-solar': ['Module'],
      'ja-solar': ['Module'],
      'longi-solar': ['Module'],
      'q-cells': ['Module'],
      'rec-solar': ['Module'],
      'sma': ['Wechselrichter', 'Leistungsoptimierer'],
      'solaredge': ['Wechselrichter', 'Leistungsoptimierer'],
      'fronius': ['Wechselrichter', 'Ladestationen'],
      'huawei': ['Wechselrichter', 'Speicher'],
      'enphase': ['Wechselrichter', 'Leistungsoptimierer'],
      'goodwe': ['Wechselrichter'],
      'fox-ess': ['Wechselrichter', 'Speicher'],
      'sonnen': ['Speicher'],
      'byd': ['Speicher', 'Module'],
      'lg-energy-solution': ['Speicher', 'Module'],
      'wallbox-chargers': ['Ladestationen'],
      'keba': ['Ladestationen'],
      'alpitronic': ['Ladestationen'],
      'mennekes': ['Elektrokomponenten', 'Ladestationen'],
      'k2-systems': ['Unterkonstruktion'],
      'schneider-electric': ['Elektrokomponenten', 'Wechselrichter'],
      'victron-energy': ['Elektrokomponenten', 'Wechselrichter', 'Speicher'],
      'meyer-burger': ['Module', 'Unterkonstruktion']
    };

    return categoryMap[manufacturer.slug] || manufacturer.categories || ['Module'];
  }

  /**
   * Identifiziert fehlende Daten
   */
  private identifyMissingData(products: ManufacturerProduct[]): string[] {
    const missingData: string[] = [];

    products.forEach(product => {
      if (!product.imageUrl) missingData.push(`Product image: ${product.name}`);
      if (!product.specifications || Object.keys(product.specifications).length === 0) {
        missingData.push(`Specifications: ${product.name}`);
      }
      if (!product.warranty) missingData.push(`Warranty info: ${product.name}`);
      if (!product.efficiency && product.category === 'Module') {
        missingData.push(`Efficiency rating: ${product.name}`);
      }
    });

    return [...new Set(missingData)]; // Entfernt Duplikate
  }

  /**
   * Liest die bestehenden Herstellerdaten
   */
  private async getExistingManufacturers(): Promise<any[]> {
    // Importiere Herstellerdaten dynamisch
    const manufacturerFiles = [
      'alpitronic.ts', 'byd.ts', 'enphase.ts', 'fox-ess.ts', 'fronius.ts',
      'goodwe.ts', 'huawei.ts', 'ja-solar.ts', 'jinko-solar.ts', 'k2-systems.ts',
      'keba.ts', 'lg-energy-solution.ts', 'longi-solar.ts', 'mennekes.ts',
      'meyer-burger.ts', 'q-cells.ts', 'rec-solar.ts', 'schneider-electric.ts',
      'sma.ts', 'solaredge.ts', 'sonnen.ts', 'trina-solar.ts',
      'victron-energy.ts', 'wallbox-chargers.ts'
    ];

    const manufacturers: any[] = [];

    for (const file of manufacturerFiles) {
      try {
        const slug = file.replace('.ts', '');
        // Hier würden die Dateien importiert werden
        // Für jetzt erstellen wir Basis-Objekte
        manufacturers.push({
          slug,
          name: this.formatManufacturerName(slug),
          logoFileName: `${slug}.png`
        });
      } catch (error) {
        console.warn(`Could not load manufacturer ${file}:`, error);
      }
    }

    return manufacturers;
  }

  /**
   * Formatiert den Namen eines Herstellers
   */
  private formatManufacturerName(slug: string): string {
    const nameMap: Record<string, string> = {
      'jinko-solar': 'Jinko Solar',
      'trina-solar': 'Trina Solar',
      'ja-solar': 'JA Solar',
      'longi-solar': 'LONGi Solar',
      'q-cells': 'Q Cells',
      'rec-solar': 'REC Solar',
      'lg-energy-solution': 'LG Energy Solution',
      'wallbox-chargers': 'Wallbox'
    };

    return nameMap[slug] || slug.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Gibt den Extraktionsfortschritt zurück
   */
  public getProgress(): Map<string, ExtractionProgress> {
    return new Map(this.progress);
  }

  /**
   * Gibt die extrahierten Daten zurück
   */
  public getExtractedData(): Map<string, ManufacturerData> {
    return new Map(this.extractedData);
  }

  /**
   * Prüft, ob gerade eine Extraktion läuft
   */
  public isCurrentlyExtracting(): boolean {
    return this.isExtracting;
  }

  /**
   * Setzt die Extraktionsdaten zurück
   */
  public reset(): void {
    this.progress.clear();
    this.extractedData.clear();
    this.isExtracting = false;
  }
}

export const manufacturerDataExtractionService = ManufacturerDataExtractionService.getInstance();
export default manufacturerDataExtractionService;