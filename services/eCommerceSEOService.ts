/**
 * E-Commerce SEO Service für ZOE Solar
 *
 * Spezialisierte SEO-Optimierung für Produktseiten und E-Commerce-Funktionalitäten
 */

import { optimizeKeywords } from '../server/services/geminiClient';

export interface ProductSEO {
  id: string;
  productId: string;
  productName: string;
  category: string;
  subcategory: string;
  targetKeywords: Array<{
    keyword: string;
    searchVolume: number;
    competition: number;
    priority: 'high' | 'medium' | 'low';
    currentRanking: number;
    targetRanking: number;
  }>;
  metaData: {
    title: string;
    description: string;
    canonicalUrl: string;
    robots: string;
    openGraph: {
      title: string;
      description: string;
      image: string;
      type: 'product';
    };
    twitterCard: {
      title: string;
      description: string;
      image: string;
      card: 'summary_large_image';
    };
  };
  structuredData: {
    productSchema: {
      '@type': 'Product';
      name: string;
      description: string;
      image: string[];
      brand: {
        '@type': 'Brand';
        name: string;
      };
      offers: Array<{
        '@type': 'Offer';
        price: number;
        priceCurrency: string;
        availability: string;
        condition: string;
        seller: {
          '@type': 'Organization';
          name: string;
        };
      }>;
      aggregateRating?: {
        '@type': 'AggregateRating';
        ratingValue: number;
        reviewCount: number;
      };
    };
    breadcrumbSchema: {
      '@type': 'BreadcrumbList';
      itemListElement: Array<{
        '@type': 'ListItem';
        position: number;
        name: string;
        item: string;
      }>;
    };
  };
  contentOptimization: {
    productTitle: string;
    productDescription: string;
    keyFeatures: string[];
    specifications: Record<string, string>;
    benefits: string[];
    useCases: string[];
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  internalLinking: {
    relatedProducts: string[];
    categoryLinks: string[];
    crossSellLinks: string[];
    upSellLinks: string[];
  };
  performanceMetrics: {
    organicTraffic: number;
    conversionRate: number;
    averageOrderValue: number;
    bounceRate: number;
    timeOnPage: number;
    addToCartRate: number;
    purchaseRate: number;
  };
  optimizationScore: number;
  lastOptimized: Date;
  status: 'active' | 'inactive' | 'needs_optimization';
}

export interface CategorySEO {
  id: string;
  categoryName: string;
  categorySlug: string;
  parentCategory?: string;
  targetKeywords: Array<{
    keyword: string;
    searchVolume: number;
    competition: number;
    intent: 'informational' | 'commercial' | 'transactional';
  }>;
  metaData: {
    title: string;
    description: string;
    h1: string;
    canonicalUrl: string;
  };
  contentStrategy: {
    categoryDescription: string;
    featuredProducts: string[];
    filterOptions: string[];
    sortingOptions: string[];
    categoryNavigation: Array<{
      name: string;
      url: string;
      productCount: number;
    }>;
  };
  performanceMetrics: {
    organicTraffic: number;
    conversionRate: number;
    averageOrderValue: number;
    productViews: number;
    categoryCTR: number;
  };
  optimizationScore: number;
  lastOptimized: Date;
}

export interface ECommerceSEORules {
  id: string;
  ruleType: 'url_structure' | 'meta_templates' | 'content_guidelines' | 'technical_requirements';
  name: string;
  description: string;
  conditions: Record<string, any>;
  actions: Array<{
    type: 'generate_meta' | 'optimize_content' | 'add_schema' | 'create_redirect';
    template?: string;
    parameters?: Record<string, string>;
  }>;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  lastApplied: Date;
}

export interface ProductPerformanceAnalysis {
  productId: string;
  analysisDate: Date;
  seoPerformance: {
    keywordRankings: Array<{
      keyword: string;
      position: number;
      change: number;
      searchVolume: number;
    }>;
    organicTraffic: number;
    trafficChange: number;
    conversionRate: number;
    revenue: number;
  };
  contentAnalysis: {
    contentScore: number;
    readabilityScore: number;
    keywordOptimization: number;
    schemaImplementation: boolean;
    mobileOptimization: boolean;
  };
  competitorAnalysis: {
    marketPosition: number;
    competitiveAdvantage: string[];
    gaps: string[];
    recommendations: string[];
  };
  optimizationOpportunities: Array<{
    type: 'content' | 'technical' | 'keyword' | 'linking';
    opportunity: string;
    impact: number;
    effort: 'low' | 'medium' | 'high';
    priority: number;
  }>;
}

export interface ECommerceSEOAutomation {
  id: string;
  automationType: 'new_product' | 'price_change' | 'stock_update' | 'content_refresh' | 'ranking_monitor';
  name: string;
  trigger: {
    event: string;
    conditions: Record<string, any>;
  };
  actions: Array<{
    type: 'update_meta' | 'regenerate_schema' | 'optimize_content' | 'send_notification' | 'create_task';
    parameters?: Record<string, any>;
  }>;
  schedule?: {
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    time?: string;
  };
  isActive: boolean;
  lastExecuted: Date;
  successRate: number;
}

class ECommerceSEOService {
  private static instance: ECommerceSEOService;
  private productSEO: Map<string, ProductSEO> = new Map();
  private categorySEO: Map<string, CategorySEO> = new Map();
  private seoRules: Map<string, ECommerceSEORules> = new Map();
  private performanceAnalyses: Map<string, ProductPerformanceAnalysis> = new Map();
  private automations: Map<string, ECommerceSEOAutomation> = new Map();
  private optimizationInterval?: NodeJS.Timeout;

  private constructor() {
    this.initializeDefaultSEORules();
    this.initializeSampleProducts();
    this.initializeCategorySEO();
    this.startECommerceSEOOptimization();
  }

  public static getInstance(): ECommerceSEOService {
    if (!ECommerceSEOService.instance) {
      ECommerceSEOService.instance = new ECommerceSEOService();
    }
    return ECommerceSEOService.instance;
  }

  private initializeDefaultSEORules(): void {
    const defaultRules: ECommerceSEORules[] = [
      {
        id: 'url-structure-rule',
        ruleType: 'url_structure',
        name: 'Product URL Structure',
        description: 'Stellt sicher, dass alle Produkt-URLs SEO-freundlich sind',
        conditions: { productType: 'any' },
        actions: [
          {
            type: 'generate_meta',
            template: '/{category}/{product-name}-{product-id}',
            parameters: {
              category: 'categorySlug',
              'product-name': 'productSlug',
              'product-id': 'productId'
            }
          }
        ],
        priority: 1,
        isActive: true,
        createdAt: new Date(),
        lastApplied: new Date()
      },
      {
        id: 'meta-template-rule',
        ruleType: 'meta_templates',
        name: 'Product Meta Templates',
        description: 'Generiert optimierte Meta-Titel und Beschreibungen für Produkte',
        conditions: { hasTargetKeywords: true },
        actions: [
          {
            type: 'generate_meta',
            template: '{productName} kaufen | {primaryKeyword} | ZOE Solar',
            parameters: {
              productName: 'productName',
              primaryKeyword: 'targetKeywords[0].keyword'
            }
          }
        ],
        priority: 2,
        isActive: true,
        createdAt: new Date(),
        lastApplied: new Date()
      },
      {
        id: 'schema-rule',
        ruleType: 'technical_requirements',
        name: 'Product Schema Markup',
        description: 'Fügt strukturierte Daten für bessere Rich Results hinzu',
        conditions: { productType: 'physical' },
        actions: [
          {
            type: 'add_schema',
            template: 'product_schema',
            parameters: {
              productName: 'productName',
              price: 'price',
              currency: 'EUR',
              availability: 'inStock'
            }
          }
        ],
        priority: 3,
        isActive: true,
        createdAt: new Date(),
        lastApplied: new Date()
      }
    ];

    defaultRules.forEach(rule => {
      this.seoRules.set(rule.id, rule);
    });
  }

  private initializeSampleProducts(): void {
    const sampleProducts: ProductSEO[] = [
      {
        id: 'product-seo-001',
        productId: 'solar-panel-10kw',
        productName: '10kW Solaranlage Komplettset',
        category: 'Photovoltaik',
        subcategory: 'Komplettanlagen',
        targetKeywords: [
          {
            keyword: '10kW Solaranlage',
            searchVolume: 2400,
            competition: 65,
            priority: 'high',
            currentRanking: 8,
            targetRanking: 3
          },
          {
            keyword: 'Solaranlage 10kW Preis',
            searchVolume: 1800,
            competition: 55,
            priority: 'high',
            currentRanking: 12,
            targetRanking: 5
          },
          {
            keyword: 'Photovoltaik 10kW',
            searchVolume: 3200,
            competition: 70,
            priority: 'medium',
            currentRanking: 15,
            targetRanking: 8
          }
        ],
        metaData: {
          title: '10kW Solaranlage kaufen | Photovoltaik Komplettset | ZOE Solar',
          description: 'Professionelle 10kW Solaranlage mit hochwertigen Modulen. Komplettinstallation inklusive. Jetzt beraten lassen und Förderungen sichern.',
          canonicalUrl: '/photovoltaik/10kw-solaranlage-komplettset',
          robots: 'index,follow',
          openGraph: {
            title: '10kW Solaranlage - Komplettlösung für Ihr Zuhause',
            description: 'Investieren Sie in eine 10kW Solaranlage und werden Sie unabhängig von Strompreisen.',
            image: '/images/products/10kw-solaranlage.jpg',
            type: 'product'
          },
          twitterCard: {
            title: '10kW Solaranlage kaufen | ZOE Solar',
            description: 'Professionelle Solaranlage Installation. Jetzt Förderungen sichern!',
            image: '/images/products/10kw-solaranlage.jpg',
            card: 'summary_large_image'
          }
        },
        structuredData: {
          productSchema: {
            '@type': 'Product',
            name: '10kW Solaranlage Komplettset',
            description: 'Komplette Photovoltaik-Anlage mit 10kW Leistung für Ein- und Mehrfamilienhäuser',
            image: ['/images/products/10kw-solaranlage.jpg'],
            brand: {
              '@type': 'Brand',
              name: 'ZOE Solar'
            },
            offers: [
              {
                '@type': 'Offer',
                price: 18990,
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                condition: 'https://schema.org/NewCondition',
                seller: {
                  '@type': 'Organization',
                  name: 'ZOE Solar GmbH'
                }
              }
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: 4.8,
              reviewCount: 127
            }
          },
          breadcrumbSchema: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Startseite',
                item: '/'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Photovoltaik',
                item: '/photovoltaik'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Komplettanlagen',
                item: '/photovoltaik/komplettanlagen'
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: '10kW Solaranlage',
                item: '/photovoltaik/10kw-solaranlage-komplettset'
              }
            ]
          }
        },
        contentOptimization: {
          productTitle: '10kW Solaranlage Komplettset - Unabhängig von Strompreisen werden',
          productDescription: 'Mit unserer 10kW Solaranlage erzeugen Sie genug Strom für ein durchschnittliches Einfamilienhaus. Hochwertige Module, optimierte Wechselrichter und professionelle Installation inklusive.',
          keyFeatures: [
            '10kW Leistung für durchschnittlichen Haushalt',
            'Hochwertige monokristalline Module',
            'Optimierte Systemauslegung',
            '10 Jahre Produktgarantie',
            '25 Jahre Leistungsgarantie'
          ],
          specifications: {
            'Leistung': '10.000 Wp',
            'Module': '32 x 310Wp monokristallin',
            'Wechselrichter': '3-phasig 10kW',
            'Montagesystem': 'Aufdachmontage',
            'Monitoring': 'Eingebautes Monitoring-System'
          },
          benefits: [
            'Reduzieren Sie Ihre Stromkosten um bis zu 70%',
            'Werden Sie unabhängig von Energieversorgern',
            'Steigern Sie den Wert Ihrer Immobilie',
            'Profitieren Sie von staatlichen Förderungen',
            'Beitragen Sie zum Umweltschutz'
          ],
          useCases: [
            'Einfamilienhäuser mit 3-4 Personen',
            'Haushalte mit hohem Stromverbrauch',
            'Immobilien zur Wertsteigerung',
            'Umweltbewusste Hausbesitzer'
          ],
          faqs: [
            {
              question: 'Wie viel Strom erzeugt eine 10kW Anlage?',
              answer: 'Bei optimalen Bedingungen ca. 10.000-12.000 kWh pro Jahr, abhängig von Standort und Ausrichtung.'
            },
            {
              question: 'Wie lange dauert die Installation?',
              answer: 'Die komplette Installation dauert in der Regel 2-3 Tage.'
            },
            {
              question: 'Gibt es Förderungen für die Anlage?',
              answer: 'Ja, es gibt verschiedene Förderprogramme wie die Einspeisevergütung und KfW-Kredite.'
            }
          ]
        },
        internalLinking: {
          relatedProducts: ['solar-panel-5kw', 'solar-panel-15kw', 'storage-10kwh'],
          categoryLinks: ['/photovoltaik/komplettanlagen', '/photovoltaik/module'],
          crossSellLinks: ['/speichersysteme', '/wallbox'],
          upSellLinks: ['solar-panel-15kw-premium', 'monitoring-premium']
        },
        performanceMetrics: {
          organicTraffic: 1250,
          conversionRate: 3.2,
          averageOrderValue: 18990,
          bounceRate: 45,
          timeOnPage: 180,
          addToCartRate: 8.5,
          purchaseRate: 3.2
        },
        optimizationScore: 78,
        lastOptimized: new Date(),
        status: 'active'
      }
    ];

    sampleProducts.forEach(product => {
      this.productSEO.set(product.id, product);
    });
  }

  private initializeCategorySEO(): void {
    const categories: CategorySEO[] = [
      {
        id: 'category-photovoltaik',
        categoryName: 'Photovoltaik',
        categorySlug: 'photovoltaik',
        targetKeywords: [
          {
            keyword: 'Photovoltaik',
            searchVolume: 18100,
            competition: 75,
            intent: 'commercial'
          },
          {
            keyword: 'Solaranlage',
            searchVolume: 12100,
            competition: 80,
            intent: 'commercial'
          },
          {
            keyword: 'Photovoltaik Anlage',
            searchVolume: 8100,
            competition: 70,
            intent: 'transactional'
          }
        ],
        metaData: {
          title: 'Photovoltaik Anlagen | Solaranlagen kaufen | ZOE Solar',
          description: 'Professionelle Photovoltaik-Anlagen für Ihr Zuhause. Komplettlösungen mit Installation, Förderberatung und 25 Jahren Garantie.',
          h1: 'Photovoltaik Anlagen - Ihre Unabhängigkeit von Strompreisen',
          canonicalUrl: '/photovoltaik'
        },
        contentStrategy: {
          categoryDescription: 'Entdecken Sie unsere umfassende Auswahl an Photovoltaik-Anlagen für jedes Bedürfnis und Budget.',
          featuredProducts: ['solar-panel-10kw', 'solar-panel-5kw', 'solar-panel-15kw'],
          filterOptions: ['Leistung', 'Preis', 'Hersteller', 'Montageart'],
          sortingOptions: ['Beliebtheit', 'Preis aufsteigend', 'Preis absteigend', 'Leistung'],
          categoryNavigation: [
            { name: 'Komplettanlagen', url: '/photovoltaik/komplettanlagen', productCount: 12 },
            { name: 'Module', url: '/photovoltaik/module', productCount: 25 },
            { name: 'Wechselrichter', url: '/photovoltaik/wechselrichter', productCount: 8 },
            { name: 'Montagesysteme', url: '/photovoltaik/montagesysteme', productCount: 15 }
          ]
        },
        performanceMetrics: {
          organicTraffic: 8500,
          conversionRate: 2.8,
          averageOrderValue: 15200,
          productViews: 25000,
          categoryCTR: 4.2
        },
        optimizationScore: 82,
        lastOptimized: new Date()
      }
    ];

    categories.forEach(category => {
      this.categorySEO.set(category.id, category);
    });
  }

  private startECommerceSEOOptimization(): void {
    // Optimierung alle 12 Stunden
    this.optimizationInterval = setInterval(() => {
      this.performECommerceSEOOptimization();
    }, 12 * 60 * 60 * 1000);

    // Initiale Optimierung
    this.performECommerceSEOOptimization();
  }

  private async performECommerceSEOOptimization(): Promise<void> {
    try {
      // Optimiere alle aktiven Produkte
      for (const [productId, product] of this.productSEO) {
        if (product.status === 'active') {
          await this.optimizeProductSEO(productId);
          await this.analyzeProductPerformance(productId);
        }
      }

      // Optimiere Kategorien
      for (const [categoryId, category] of this.categorySEO) {
        await this.optimizeCategorySEO(categoryId);
      }

      // Führe Automatisierungen aus
      await this.executeAutomations();

    } catch (error) {
      console.error('Failed to perform E-Commerce SEO optimization:', error);
    }
  }

  private async optimizeProductSEO(productId: string): Promise<void> {
    const product = this.productSEO.get(productId);
    if (!product) return;

    // Aktualisiere Keyword-Rankings (simuliert)
    product.targetKeywords.forEach(keyword => {
      const change = (Math.random() - 0.5) * 4;
      keyword.currentRanking = Math.max(1, keyword.currentRanking + change);
    });

    // Aktualisiere Performance-Metriken
    product.performanceMetrics.organicTraffic += Math.floor(Math.random() * 50) - 25;
    product.performanceMetrics.conversionRate += (Math.random() - 0.5) * 0.5;

    // Berechne Optimierung-Score neu
    product.optimizationScore = this.calculateOptimizationScore(product);
    product.lastOptimized = new Date();
  }

  private calculateOptimizationScore(product: ProductSEO): number {
    let score = 0;

    // Meta-Daten (30%)
    if (product.metaData.title.length > 30 && product.metaData.title.length < 60) score += 15;
    if (product.metaData.description.length > 120 && product.metaData.description.length < 160) score += 15;

    // Strukturierte Daten (20%)
    score += 20; // Angenommen implementiert

    // Content-Optimierung (25%)
    if (product.contentOptimization.keyFeatures.length >= 5) score += 10;
    if (product.contentOptimization.faqs.length >= 3) score += 10;
    if (product.contentOptimization.specifications && Object.keys(product.contentOptimization.specifications).length >= 5) score += 5;

    // Performance (15%)
    if (product.performanceMetrics.conversionRate > 3) score += 10;
    if (product.performanceMetrics.bounceRate < 50) score += 5;

    // Keyword-Optimierung (10%)
    const topKeyword = product.targetKeywords[0];
    if (topKeyword && topKeyword.currentRanking <= 10) score += 10;

    return Math.min(100, score);
  }

  private async analyzeProductPerformance(productId: string): Promise<void> {
    const product = this.productSEO.get(productId);
    if (!product) return;

    const analysis: ProductPerformanceAnalysis = {
      productId,
      analysisDate: new Date(),
      seoPerformance: {
        keywordRankings: product.targetKeywords.map(kw => ({
          keyword: kw.keyword,
          position: kw.currentRanking,
          change: kw.currentRanking - kw.targetRanking,
          searchVolume: kw.searchVolume
        })),
        organicTraffic: product.performanceMetrics.organicTraffic,
        trafficChange: (Math.random() - 0.5) * 20,
        conversionRate: product.performanceMetrics.conversionRate,
        revenue: product.performanceMetrics.averageOrderValue * (product.performanceMetrics.purchaseRate / 100) * product.performanceMetrics.organicTraffic
      },
      contentAnalysis: {
        contentScore: 75 + Math.random() * 20,
        readabilityScore: 65 + Math.random() * 25,
        keywordOptimization: 70 + Math.random() * 25,
        schemaImplementation: true,
        mobileOptimization: Math.random() > 0.2
      },
      competitorAnalysis: {
        marketPosition: Math.floor(Math.random() * 10) + 1,
        competitiveAdvantage: [
          'Bessere Preise',
          'Umfassender Service',
          'Lokale Präsenz'
        ],
        gaps: [
          'Weniger bekannte Marke',
          'Begrenzte Produktpalette'
        ],
        recommendations: [
          'Stärken Sie Markenbekanntheit',
          'Erweitern Sie Produktangebot'
        ]
      },
      optimizationOpportunities: [
        {
          type: 'content',
          opportunity: 'Fügen Sie mehr Kundenbewertungen hinzu',
          impact: 15,
          effort: 'low',
          priority: 8
        },
        {
          type: 'technical',
          opportunity: 'Verbessern Sie Ladezeiten',
          impact: 20,
          effort: 'medium',
          priority: 9
        },
        {
          type: 'keyword',
          opportunity: 'Targetieren Sie Long-Tail Keywords',
          impact: 25,
          effort: 'medium',
          priority: 7
        }
      ]
    };

    this.performanceAnalyses.set(productId, analysis);
  }

  private async optimizeCategorySEO(categoryId: string): Promise<void> {
    const category = this.categorySEO.get(categoryId);
    if (!category) return;

    // Aktualisiere Performance-Metriken
    category.performanceMetrics.organicTraffic += Math.floor(Math.random() * 200) - 100;
    category.performanceMetrics.conversionRate += (Math.random() - 0.5) * 0.3;

    category.optimizationScore = 70 + Math.random() * 25;
    category.lastOptimized = new Date();
  }

  private async executeAutomations(): Promise<void> {
    for (const [automationId, automation] of this.automations) {
      if (automation.isActive && this.shouldExecuteAutomation(automation)) {
        await this.executeAutomation(automationId);
      }
    }
  }

  private shouldExecuteAutomation(automation: ECommerceSEOAutomation): boolean {
    // Vereinfachte Prüfung für Ausführung
    if (!automation.schedule) return false;

    const now = new Date();
    const lastExecuted = automation.lastExecuted;

    switch (automation.schedule.frequency) {
      case 'daily':
        return now.getTime() - lastExecuted.getTime() > 24 * 60 * 60 * 1000;
      case 'weekly':
        return now.getTime() - lastExecuted.getTime() > 7 * 24 * 60 * 60 * 1000;
      default:
        return false;
    }
  }

  private async executeAutomation(automationId: string): Promise<void> {
    const automation = this.automations.get(automationId);
    if (!automation) return;

    try {
      for (const action of automation.actions) {
        await this.executeAutomationAction(automation, action);
      }

      automation.lastExecuted = new Date();
      automation.successRate = Math.min(100, automation.successRate + 5);

    } catch (error) {
      automation.successRate = Math.max(0, automation.successRate - 10);
      console.error(`Automation ${automationId} failed:`, error);
    }
  }

  private async executeAutomationAction(automation: ECommerceSEOAutomation, action: ECommerceSEOAutomation['actions'][0]): Promise<void> {
    // Simuliere Ausführung von Automation-Aktionen
    switch (action.type) {
      case 'update_meta':
        console.log(`Updating meta data for automation ${automation.id}`);
        break;
      case 'regenerate_schema':
        console.log(`Regenerating schema markup for automation ${automation.id}`);
        break;
      case 'optimize_content':
        console.log(`Optimizing content for automation ${automation.id}`);
        break;
      case 'send_notification':
        console.log(`Sending notification for automation ${automation.id}`);
        break;
      case 'create_task':
        console.log(`Creating task for automation ${automation.id}`);
        break;
    }
  }

  // ===== PUBLIC API =====

  public getProductSEO(productId: string): ProductSEO | null {
    return this.productSEO.get(productId) || null;
  }

  public getAllProductSEO(): ProductSEO[] {
    return Array.from(this.productSEO.values());
  }

  public async createProductSEO(productData: Omit<ProductSEO, 'id' | 'optimizationScore' | 'lastOptimized'>): Promise<string> {
    const id = `product-seo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const productSEO: ProductSEO = {
      ...productData,
      id,
      optimizationScore: 50, // Initial score
      lastOptimized: new Date()
    };

    this.productSEO.set(id, productSEO);

    // Wende SEO-Regeln an
    await this.applySEORules(productSEO);

    return id;
  }

  public async updateProductSEO(productId: string, updates: Partial<ProductSEO>): Promise<void> {
    const existing = this.productSEO.get(productId);
    if (!existing) throw new Error(`Product SEO ${productId} not found`);

    this.productSEO.set(productId, { ...existing, ...updates });
  }

  private async applySEORules(product: ProductSEO): Promise<void> {
    for (const [ruleId, rule] of this.seoRules) {
      if (rule.isActive && this.checkRuleConditions(rule, product)) {
        await this.executeRuleActions(rule, product);
        rule.lastApplied = new Date();
      }
    }
  }

  private checkRuleConditions(rule: ECommerceSEORules, product: ProductSEO): boolean {
    // Vereinfachte Bedingungsprüfung
    switch (rule.conditions.productType) {
      case 'any':
        return true;
      case 'physical':
        return product.category !== 'digital';
      default:
        return false;
    }
  }

  private async executeRuleActions(rule: ECommerceSEORules, product: ProductSEO): Promise<void> {
    for (const action of rule.actions) {
      switch (action.type) {
        case 'generate_meta':
          if (action.template) {
            // Generiere Meta-Daten basierend auf Template
            product.metaData.title = this.applyTemplate(action.template, product);
          }
          break;
        case 'add_schema':
          // Schema würde hier generiert werden
          break;
      }
    }
  }

  private applyTemplate(template: string, product: ProductSEO): string {
    // Vereinfachte Template-Anwendung
    return template
      .replace('{productName}', product.productName)
      .replace('{category}', product.category)
      .replace('{primaryKeyword}', product.targetKeywords[0]?.keyword || '');
  }

  public getCategorySEO(categoryId: string): CategorySEO | null {
    return this.categorySEO.get(categoryId) || null;
  }

  public getAllCategorySEO(): CategorySEO[] {
    return Array.from(this.categorySEO.values());
  }

  public getProductPerformanceAnalysis(productId: string): ProductPerformanceAnalysis | null {
    return this.performanceAnalyses.get(productId) || null;
  }

  public async generateProductSEOReport(productId: string): Promise<{
    product: ProductSEO;
    analysis: ProductPerformanceAnalysis;
    recommendations: string[];
    optimizationScore: number;
  }> {
    const product = this.productSEO.get(productId);
    const analysis = this.performanceAnalyses.get(productId);

    if (!product || !analysis) {
      throw new Error(`Product SEO data not found for ${productId}`);
    }

    const recommendations = [
      ...analysis.optimizationOpportunities
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 5)
        .map(opp => `${opp.type.toUpperCase()}: ${opp.opportunity} (Impact: ${opp.impact}%, Effort: ${opp.effort})`),
      ...analysis.competitorAnalysis.recommendations
    ];

    return {
      product,
      analysis,
      recommendations,
      optimizationScore: product.optimizationScore
    };
  }

  public async optimizeProductContent(productId: string): Promise<{
    optimizedTitle: string;
    optimizedDescription: string;
    keywordRecommendations: string[];
  }> {
    const product = this.productSEO.get(productId);
    if (!product) throw new Error(`Product ${productId} not found`);

    // Simuliere KI-gestützte Content-Optimierung
    const optimizedTitle = `${product.productName} - ${product.targetKeywords[0]?.keyword || 'Professionelle Lösung'}`;
    const optimizedDescription = `Entdecken Sie das ${product.productName} von ZOE Solar. ${product.contentOptimization.benefits[0]}. Jetzt informieren und Förderungen sichern.`;

    const keywordRecommendations = product.targetKeywords
      .filter(kw => kw.priority === 'high')
      .map(kw => kw.keyword);

    return {
      optimizedTitle,
      optimizedDescription,
      keywordRecommendations
    };
  }

  public async createSEORule(rule: Omit<ECommerceSEORules, 'id' | 'lastApplied'>): Promise<string> {
    const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRule: ECommerceSEORules = {
      ...rule,
      id,
      lastApplied: new Date()
    };

    this.seoRules.set(id, newRule);
    return id;
  }

  public getSEORules(): ECommerceSEORules[] {
    return Array.from(this.seoRules.values());
  }

  public async createAutomation(automation: Omit<ECommerceSEOAutomation, 'id' | 'lastExecuted' | 'successRate'>): Promise<string> {
    const id = `automation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAutomation: ECommerceSEOAutomation = {
      ...automation,
      id,
      lastExecuted: new Date(),
      successRate: 100
    };

    this.automations.set(id, newAutomation);
    return id;
  }

  public getAutomations(): ECommerceSEOAutomation[] {
    return Array.from(this.automations.values());
  }

  public async bulkOptimizeProducts(productIds: string[]): Promise<{
    optimized: number;
    failed: number;
    results: Array<{ productId: string; success: boolean; score: number }>;
  }> {
    let optimized = 0;
    let failed = 0;
    const results: Array<{ productId: string; success: boolean; score: number }> = [];

    for (const productId of productIds) {
      try {
        await this.optimizeProductSEO(productId);
        const product = this.productSEO.get(productId);
        if (product) {
          optimized++;
          results.push({
            productId,
            success: true,
            score: product.optimizationScore
          });
        }
      } catch (error) {
        failed++;
        results.push({
          productId,
          success: false,
          score: 0
        });
      }
    }

    return { optimized, failed, results };
  }

  public stopECommerceSEOOptimization(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = undefined;
    }
  }

  public startECommerceSEOOptimization(): void {
    if (!this.optimizationInterval) {
      this.startECommerceSEOOptimization();
    }
  }
}

export const eCommerceSEOService = ECommerceSEOService.getInstance();
export default eCommerceSEOService;