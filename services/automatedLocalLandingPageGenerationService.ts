import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localContentService } from './localContentService';
import { localSchemaService } from './localSchemaService';
import { competitorLocalSEOAnalysisService } from './competitorLocalSEOAnalysisService';
import { advancedLocalSERPFeatureMonitoringService } from './advancedLocalSERPFeatureMonitoringService';

export interface LandingPageTemplate {
  id: string;
  name: string;
  category: 'service' | 'location' | 'industry' | 'emergency' | 'seasonal';
  targetIntent: 'awareness' | 'consideration' | 'decision' | 'retention';
  structure: {
    hero: LandingPageSection;
    features: LandingPageSection;
    testimonials: LandingPageSection;
    pricing: LandingPageSection;
    cta: LandingPageSection;
    footer: LandingPageSection;
  };
  seoElements: {
    titleTemplate: string;
    metaDescriptionTemplate: string;
    h1Template: string;
    keywords: string[];
    schemaTypes: string[];
  };
  performanceMetrics: {
    avgConversionRate: number;
    avgTimeOnPage: number;
    bounceRate: number;
    totalGenerated: number;
  };
  lastUpdated: string;
}

export interface LandingPageSection {
  id: string;
  name: string;
  required: boolean;
  contentBlocks: ContentBlock[];
  styling: {
    backgroundColor?: string;
    textColor?: string;
    layout: 'full_width' | 'centered' | 'two_column' | 'three_column';
    spacing: 'compact' | 'normal' | 'spacious';
  };
  personalizationRules: Array<{
    condition: string;
    modifications: any;
  }>;
}

export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'form' | 'button' | 'testimonial' | 'stats' | 'map' | 'pricing_table';
  content: any;
  dynamic: boolean;
  personalizationKey?: string;
}

export interface GeneratedLandingPage {
  id: string;
  url: string;
  locationKey: string;
  templateId: string;
  targetKeyword: string;
  generatedContent: {
    html: string;
    css: string;
    javascript: string;
    metadata: {
      title: string;
      description: string;
      keywords: string[];
      canonical: string;
      ogTags: { [key: string]: string };
      twitterCards: { [key: string]: string };
    };
    schemaMarkup: any[];
  };
  personalizationData: {
    userSegments: string[];
    localFactors: any;
    competitorAnalysis: any;
    performancePredictions: any;
  };
  abTestVariants: Array<{
    variantId: string;
    name: string;
    modifications: any;
    weight: number;
  }>;
  performanceTracking: {
    impressions: number;
    clicks: number;
    conversions: number;
    bounceRate: number;
    avgTimeOnPage: number;
    goalCompletions: Array<{
      goalId: string;
      name: string;
      completions: number;
    }>;
  };
  optimizationHistory: Array<{
    timestamp: string;
    type: 'manual' | 'automatic';
    changes: string;
    impact: number;
  }>;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  publishedAt?: string;
  expiresAt?: string;
}

export interface LandingPageOptimization {
  pageId: string;
  optimizationType: 'content' | 'seo' | 'conversion' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
  recommendation: string;
  implementation: {
    steps: string[];
    estimatedEffort: 'quick' | 'medium' | 'complex';
    riskLevel: 'low' | 'medium' | 'high';
  };
  expectedImpact: {
    metric: string;
    currentValue: number;
    expectedValue: number;
    confidence: number;
  };
  automated: boolean;
  applied: boolean;
  appliedAt?: string;
  results?: {
    actualImpact: number;
    success: boolean;
    notes: string;
  };
}

export interface LandingPageCampaign {
  id: string;
  name: string;
  description: string;
  targetLocations: string[];
  targetKeywords: string[];
  templateIds: string[];
  goals: {
    primary: 'leads' | 'sales' | 'awareness' | 'engagement';
    kpis: Array<{
      metric: string;
      target: number;
      current: number;
    }>;
  };
  personalizationStrategy: {
    userSegments: string[];
    localFactors: string[];
    dynamicElements: string[];
  };
  abTesting: {
    enabled: boolean;
    variants: number;
    trafficDistribution: 'equal' | 'weighted' | 'adaptive';
    testDuration: number; // days
  };
  performance: {
    totalPages: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgConversionRate: number;
    avgCostPerLead: number;
    roi: number;
  };
  status: 'planning' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface PageGenerationRequest {
  locationKey: string;
  targetKeyword: string;
  templateId: string;
  userContext?: {
    segment: string;
    intent: string;
    device: string;
  };
  campaignId?: string;
  customizations?: {
    [key: string]: any;
  };
}

export interface LandingPageAnalytics {
  pageId: string;
  timeRange: {
    start: string;
    end: string;
  };
  traffic: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    exitRate: number;
  };
  conversions: {
    totalConversions: number;
    conversionRate: number;
    conversionValue: number;
    goalCompletions: { [goalId: string]: number };
    attribution: {
      organic: number;
      paid: number;
      direct: number;
      social: number;
      referral: number;
    };
  };
  engagement: {
    scrollDepth: {
      '25%': number;
      '50%': number;
      '75%': number;
      '100%': number;
    };
    timeOnPage: {
      average: number;
      distribution: { [range: string]: number };
    };
    interactions: {
      clicks: number;
      formSubmissions: number;
      buttonClicks: number;
      videoViews: number;
    };
  };
  technical: {
    loadTime: number;
    mobileFriendly: boolean;
    seoScore: number;
    accessibilityScore: number;
    performanceScore: number;
  };
  localPerformance: {
    localPackImpressions: number;
    gmbClicks: number;
    localSearchConversions: number;
    geographicDistribution: { [location: string]: number };
  };
}

/**
 * Automated Local Landing Page Generation Service
 * Automatisierte Generierung von lokalen Landing Pages
 */
export class AutomatedLocalLandingPageGenerationService {
  private templates: Map<string, LandingPageTemplate> = new Map();
  private generatedPages: Map<string, GeneratedLandingPage> = new Map();
  private optimizations: Map<string, LandingPageOptimization[]> = new Map();
  private campaigns: Map<string, LandingPageCampaign> = new Map();

  constructor() {
    this.initializeTemplates();
    this.generateSamplePages();
    this.setupOptimizationRules();
    this.createSampleCampaigns();
  }

  /**
   * Initialisiert Landing Page Templates
   */
  private initializeTemplates(): void {
    const templates: LandingPageTemplate[] = [
      {
        id: 'local_service_template',
        name: 'Lokaler Service Template',
        category: 'service',
        targetIntent: 'decision',
        structure: {
          hero: {
            id: 'hero',
            name: 'Hero Section',
            required: true,
            contentBlocks: [
              {
                type: 'text',
                content: {
                  headline: '{{service}} in {{city}} - Professionelle Installation',
                  subheadline: 'Erfahren Sie mehr über unsere Dienstleistungen in Ihrer Region',
                  description: 'Wir bieten erstklassige {{service}} in {{city}} und Umgebung.'
                },
                dynamic: true
              },
              {
                type: 'image',
                content: { src: '/images/local/{{city}}-service.jpg', alt: '{{service}} in {{city}}' },
                dynamic: true
              },
              {
                type: 'button',
                content: { text: 'Kostenlose Beratung', href: '#contact', style: 'primary' },
                dynamic: false
              }
            ],
            styling: {
              backgroundColor: '#ffffff',
              layout: 'two_column',
              spacing: 'spacious'
            },
            personalizationRules: []
          },
          features: {
            id: 'features',
            name: 'Features Section',
            required: true,
            contentBlocks: [
              {
                type: 'text',
                content: {
                  headline: 'Warum ZOE Solar in {{city}}?',
                  features: [
                    'Lokale Expertise seit {{years}} Jahren',
                    'Zertifizierte Fachkräfte',
                    'Regionale Förderungen optimal nutzen',
                    'Schnelle Installation innerhalb 2 Wochen'
                  ]
                },
                dynamic: true
              }
            ],
            styling: {
              backgroundColor: '#f8f9fa',
              layout: 'three_column',
              spacing: 'normal'
            },
            personalizationRules: []
          },
          testimonials: {
            id: 'testimonials',
            name: 'Kundenstimmen',
            required: false,
            contentBlocks: [
              {
                type: 'testimonial',
                content: {
                  testimonials: [
                    {
                      name: 'Jeremy Schulze',
                      location: '{{city}}',
                      text: 'Ausgezeichnete Arbeit! Sehr zufrieden mit der Installation.',
                      rating: 5
                    }
                  ]
                },
                dynamic: true
              }
            ],
            styling: {
              backgroundColor: '#ffffff',
              layout: 'centered',
              spacing: 'normal'
            },
            personalizationRules: []
          },
          pricing: {
            id: 'pricing',
            name: 'Preise',
            required: false,
            contentBlocks: [
              {
                type: 'pricing_table',
                content: {
                  plans: [
                    {
                      name: 'Basis',
                      price: '15.000€',
                      features: ['Standard-Installation', '1 Jahr Garantie']
                    }
                  ]
                },
                dynamic: true
              }
            ],
            styling: {
              backgroundColor: '#f8f9fa',
              layout: 'three_column',
              spacing: 'normal'
            },
            personalizationRules: []
          },
          cta: {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            contentBlocks: [
              {
                type: 'text',
                content: {
                  headline: 'Bereit für Ihre Solaranlage?',
                  description: 'Kontaktieren Sie uns noch heute für eine kostenlose Beratung.'
                },
                dynamic: false
              },
              {
                type: 'form',
                content: {
                  fields: ['name', 'email', 'phone', 'message'],
                  submitText: 'Beratung anfordern'
                },
                dynamic: false
              }
            ],
            styling: {
              backgroundColor: '#007bff',
              textColor: '#ffffff',
              layout: 'centered',
              spacing: 'spacious'
            },
            personalizationRules: []
          },
          footer: {
            id: 'footer',
            name: 'Footer',
            required: true,
            contentBlocks: [
              {
                type: 'text',
                content: {
                  company: 'ZOE Solar GmbH',
                  address: '{{city}}, Deutschland',
                  contact: 'info@zoe-solar.de | +49 123 456789'
                },
                dynamic: true
              }
            ],
            styling: {
              backgroundColor: '#343a40',
              textColor: '#ffffff',
              layout: 'centered',
              spacing: 'compact'
            },
            personalizationRules: []
          }
        },
        seoElements: {
          titleTemplate: '{{service}} {{city}} | Professionelle Installation | ZOE Solar',
          metaDescriptionTemplate: 'Professionelle {{service}} in {{city}}. Kostenlose Beratung ✓ Zertifizierte Fachkräfte ✓ Regionale Förderungen ✓ Jetzt anfragen!',
          h1Template: '{{service}} in {{city}} - Ihre Solar-Experten',
          keywords: ['solaranlage', 'photovoltaik', 'installation', 'förderung', 'beratung'],
          schemaTypes: ['LocalBusiness', 'Service', 'WebPage']
        },
        performanceMetrics: {
          avgConversionRate: 0.035,
          avgTimeOnPage: 185,
          bounceRate: 0.42,
          totalGenerated: 245
        },
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'location_landing_template',
        name: 'Standort Landing Page Template',
        category: 'location',
        targetIntent: 'awareness',
        structure: {
          hero: {
            id: 'hero',
            name: 'Hero Section',
            required: true,
            contentBlocks: [
              {
                type: 'text',
                content: {
                  headline: 'Solaranlagen in {{city}} - Ihre lokale Lösung',
                  subheadline: 'Entdecken Sie die Vorteile erneuerbarer Energien in {{city}}'
                },
                dynamic: true
              },
              {
                type: 'map',
                content: { center: '{{coordinates}}', zoom: 12 },
                dynamic: true
              }
            ],
            styling: {
              backgroundColor: '#ffffff',
              layout: 'two_column',
              spacing: 'spacious'
            },
            personalizationRules: []
          },
          features: {
            id: 'features',
            name: 'Lokale Vorteile',
            required: true,
            contentBlocks: [
              {
                type: 'text',
                content: {
                  headline: 'Warum {{city}} perfekt für Solaranlagen ist',
                  features: [
                    'Hohe Sonneneinstrahlung: {{solarHours}} Stunden/Jahr',
                    'Lokale Förderungen verfügbar',
                    'Erfahrene regionale Partner',
                    'Schnelle Erreichbarkeit'
                  ]
                },
                dynamic: true
              }
            ],
            styling: {
              backgroundColor: '#f8f9fa',
              layout: 'centered',
              spacing: 'normal'
            },
            personalizationRules: []
          },
          testimonials: {
            id: 'testimonials',
            name: 'Lokale Erfolgsgeschichten',
            required: false,
            contentBlocks: [],
            styling: {
              backgroundColor: '#ffffff',
              layout: 'centered',
              spacing: 'normal'
            },
            personalizationRules: []
          },
          pricing: {
            id: 'pricing',
            name: 'Regionale Preise',
            required: false,
            contentBlocks: [],
            styling: {
              backgroundColor: '#f8f9fa',
              layout: 'centered',
              spacing: 'normal'
            },
            personalizationRules: []
          },
          cta: {
            id: 'cta',
            name: 'Jetzt starten',
            required: true,
            contentBlocks: [
              {
                type: 'button',
                content: { text: 'Lokalen Berater kontaktieren', href: '#contact' },
                dynamic: false
              }
            ],
            styling: {
              backgroundColor: '#28a745',
              textColor: '#ffffff',
              layout: 'centered',
              spacing: 'spacious'
            },
            personalizationRules: []
          },
          footer: {
            id: 'footer',
            name: 'Footer',
            required: true,
            contentBlocks: [],
            styling: {
              backgroundColor: '#343a40',
              textColor: '#ffffff',
              layout: 'centered',
              spacing: 'compact'
            },
            personalizationRules: []
          }
        },
        seoElements: {
          titleTemplate: 'Solaranlagen {{city}} | Lokale Experten | ZOE Solar',
          metaDescriptionTemplate: 'Professionelle Solaranlagen in {{city}}. Lokale Beratung ✓ Regionale Förderungen ✓ Zertifizierte Installation ✓ Jetzt informieren!',
          h1Template: 'Solaranlagen in {{city}} - Ihre lokalen Solar-Experten',
          keywords: ['solaranlage', 'photovoltaik', '{{city}}', 'lokaler anbieter', 'beratung'],
          schemaTypes: ['LocalBusiness', 'Place', 'WebPage']
        },
        performanceMetrics: {
          avgConversionRate: 0.028,
          avgTimeOnPage: 165,
          bounceRate: 0.48,
          totalGenerated: 156
        },
        lastUpdated: new Date().toISOString()
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Generiert Beispiel-Pages
   */
  private generateSamplePages(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const keywords = [`solaranlage ${region.city}`, `photovoltaik ${region.city}`];

      keywords.forEach(keyword => {
        const page = this.generateLandingPage({
          locationKey,
          targetKeyword: keyword,
          templateId: 'local_service_template'
        });

        if (page) {
          this.generatedPages.set(page.id, page);
        }
      });
    });
  }

  /**
   * Generiert eine Landing Page
   */
  public generateLandingPage(request: PageGenerationRequest): GeneratedLandingPage | null {
    const template = this.templates.get(request.templateId);
    if (!template) return null;

    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === request.locationKey);
    if (!region) return null;

    const pageId = `page_${request.locationKey}_${request.templateId}_${Date.now()}`;
    const url = `/landing/${request.locationKey}/${request.targetKeyword.replace(/\s+/g, '-').toLowerCase()}`;

    // Sammle lokale Daten
    const localData = this.gatherLocalData(request.locationKey, request.targetKeyword);
    const competitorData = competitorLocalSEOAnalysisService.getCompetitorSEOProfile('comp_001', request.locationKey);
    const serpData = advancedLocalSERPFeatureMonitoringService.getSERPSnapshot(request.targetKeyword, request.locationKey);

    // Generiere Content
    const generatedContent = this.generatePageContent(template, {
      locationKey: request.locationKey,
      region,
      keyword: request.targetKeyword,
      localData,
      competitorData,
      serpData,
      userContext: request.userContext
    });

    // Erstelle A/B-Test-Varianten
    const abTestVariants = this.generateABTestVariants(template, generatedContent);

    // Performance-Vorhersage
    const performancePredictions = this.predictPagePerformance(template, localData, competitorData);

    const page: GeneratedLandingPage = {
      id: pageId,
      url,
      locationKey: request.locationKey,
      templateId: request.templateId,
      targetKeyword: request.targetKeyword,
      generatedContent,
      personalizationData: {
        userSegments: request.userContext ? [request.userContext.segment] : [],
        localFactors: localData,
        competitorAnalysis: competitorData,
        performancePredictions
      },
      abTestVariants,
      performanceTracking: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        bounceRate: 0,
        avgTimeOnPage: 0,
        goalCompletions: []
      },
      optimizationHistory: [],
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    this.generatedPages.set(pageId, page);
    return page;
  }

  /**
   * Sammelt lokale Daten
   */
  private gatherLocalData(locationKey: string, keyword: string): any {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) return {};

    return {
      city: region.city,
      state: region.state,
      population: region.population,
      coordinates: [region.lat, region.lng],
      solarHours: 1200 + Math.floor(Math.random() * 400), // Sonnenstunden pro Jahr
      avgIncome: 35000 + Math.floor(Math.random() * 20000),
      localCompetitors: 5 + Math.floor(Math.random() * 10),
      marketSize: region.population * 0.12, // 12% Marktpenetration
      growthRate: 6 + Math.random() * 6,
      localContent: localContentService.getLocalContent(locationKey),
      schemaData: localSchemaService.getLocationSchema(locationKey)
    };
  }

  /**
   * Generiert Page-Content
   */
  private generatePageContent(
    template: LandingPageTemplate,
    context: any
  ): GeneratedLandingPage['generatedContent'] {
    const html = this.generateHTML(template, context);
    const css = this.generateCSS(template);
    const javascript = this.generateJavaScript(template);
    const metadata = this.generateMetadata(template, context);
    const schemaMarkup = this.generateSchemaMarkup(template, context);

    return {
      html,
      css,
      javascript,
      metadata,
      schemaMarkup
    };
  }

  /**
   * Generiert HTML
   */
  private generateHTML(template: LandingPageTemplate, context: any): string {
    let html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.replacePlaceholders(template.seoElements.titleTemplate, context)}</title>
  <meta name="description" content="${this.replacePlaceholders(template.seoElements.metaDescriptionTemplate, context)}">
  <link rel="canonical" href="${context.canonicalUrl || 'https://zoe-solar.de' + context.url}">
  <style>${this.generateCSS(template)}</style>
</head>
<body>
`;

    // Generiere Sections
    Object.values(template.structure).forEach(section => {
      html += this.generateSectionHTML(section, context);
    });

    html += `
  <script>${this.generateJavaScript(template)}</script>
</body>
</html>`;

    return html;
  }

  /**
   * Generiert Section-HTML
   */
  private generateSectionHTML(section: LandingPageSection, context: any): string {
    const style = this.getSectionStyle(section);
    let html = `<section id="${section.id}" style="${style}">`;

    section.contentBlocks.forEach(block => {
      html += this.generateBlockHTML(block, context);
    });

    html += '</section>';
    return html;
  }

  /**
   * Generiert Block-HTML
   */
  private generateBlockHTML(block: ContentBlock, context: any): string {
    let content = block.content;

    if (block.dynamic) {
      content = this.replacePlaceholdersInObject(content, context);
    }

    switch (block.type) {
      case 'text':
        return `
          <div class="text-block">
            ${content.headline ? `<h2>${content.headline}</h2>` : ''}
            ${content.subheadline ? `<h3>${content.subheadline}</h3>` : ''}
            ${content.description ? `<p>${content.description}</p>` : ''}
            ${content.features ? `<ul>${content.features.map((f: string) => `<li>${f}</li>`).join('')}</ul>` : ''}
          </div>
        `;

      case 'button':
        return `<a href="${content.href}" class="btn btn-${content.style || 'primary'}">${content.text}</a>`;

      case 'form':
        return `
          <form class="contact-form">
            ${content.fields.map((field: string) => `
              <div class="form-group">
                <label for="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input type="${field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}" id="${field}" name="${field}" required>
              </div>
            `).join('')}
            <button type="submit" class="btn btn-primary">${content.submitText}</button>
          </form>
        `;

      case 'image':
        return `<img src="${content.src}" alt="${content.alt}" loading="lazy">`;

      default:
        return `<div class="${block.type}-block">${JSON.stringify(content)}</div>`;
    }
  }

  /**
   * Ersetzt Platzhalter in Objekten
   */
  private replacePlaceholdersInObject(obj: any, context: any): any {
    if (typeof obj === 'string') {
      return this.replacePlaceholders(obj, context);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.replacePlaceholdersInObject(item, context));
    }

    if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replacePlaceholdersInObject(value, context);
      }
      return result;
    }

    return obj;
  }

  /**
   * Ersetzt Platzhalter
   */
  private replacePlaceholders(text: string, context: any): string {
    return text
      .replace(/\{\{city\}\}/g, context.region?.city || context.locationKey)
      .replace(/\{\{service\}\}/g, 'Solaranlagen')
      .replace(/\{\{years\}\}/g, '8')
      .replace(/\{\{solarHours\}\}/g, context.localData?.solarHours || '1400')
      .replace(/\{\{coordinates\}\}/g, context.localData?.coordinates?.join(',') || '0,0');
  }

  /**
   * Holt Section-Style
   */
  private getSectionStyle(section: LandingPageSection): string {
    let style = '';

    if (section.styling.backgroundColor) {
      style += `background-color: ${section.styling.backgroundColor}; `;
    }

    if (section.styling.textColor) {
      style += `color: ${section.styling.textColor}; `;
    }

    style += `padding: ${section.styling.spacing === 'spacious' ? '4rem' : section.styling.spacing === 'compact' ? '1rem' : '2rem'}; `;

    return style;
  }

  /**
   * Generiert CSS
   */
  private generateCSS(template: LandingPageTemplate): string {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .text-block { margin-bottom: 2rem; }
      .text-block h2 { font-size: 2.5rem; margin-bottom: 1rem; }
      .text-block h3 { font-size: 1.8rem; margin-bottom: 0.5rem; }
      .text-block p { font-size: 1.1rem; margin-bottom: 1rem; }
      .btn { display: inline-block; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.25rem; font-weight: 600; transition: all 0.3s; }
      .btn-primary { background-color: #007bff; color: white; }
      .btn-primary:hover { background-color: #0056b3; }
      .contact-form { max-width: 500px; margin: 0 auto; }
      .form-group { margin-bottom: 1rem; }
      .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
      .form-group input { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; }
      section { padding: 2rem 0; }
      @media (max-width: 768px) {
        .text-block h2 { font-size: 2rem; }
        .btn { display: block; text-align: center; margin-bottom: 1rem; }
      }
    `;
  }

  /**
   * Generiert JavaScript
   */
  private generateJavaScript(template: LandingPageTemplate): string {
    return `
      // Form handling
      document.addEventListener('DOMContentLoaded', function() {
        const forms = document.querySelectorAll('.contact-form');
        forms.forEach(form => {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Form submission logic would go here
            alert('Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.');
          });
        });

        // Track page interactions
        document.addEventListener('click', function(e) {
          if (e.target.classList.contains('btn')) {
            // Track button clicks
            console.log('Button clicked:', e.target.textContent);
          }
        });
      });
    `;
  }

  /**
   * Generiert Metadata
   */
  private generateMetadata(template: LandingPageTemplate, context: any): GeneratedLandingPage['generatedContent']['metadata'] {
    const title = this.replacePlaceholders(template.seoElements.titleTemplate, context);
    const description = this.replacePlaceholders(template.seoElements.metaDescriptionTemplate, context);
    const keywords = template.seoElements.keywords.map(k => this.replacePlaceholders(k, context));

    return {
      title,
      description,
      keywords,
      canonical: `https://zoe-solar.de${context.url}`,
      ogTags: {
        'og:title': title,
        'og:description': description,
        'og:url': `https://zoe-solar.de${context.url}`,
        'og:type': 'website',
        'og:image': '/images/og-image.jpg'
      },
      twitterCards: {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': '/images/twitter-image.jpg'
      }
    };
  }

  /**
   * Generiert Schema-Markup
   */
  private generateSchemaMarkup(template: LandingPageTemplate, context: any): any[] {
    const schemas = [];

    // LocalBusiness Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'ZOE Solar GmbH',
      address: {
        '@type': 'PostalAddress',
        addressLocality: context.region?.city,
        addressRegion: context.region?.state,
        addressCountry: 'DE'
      },
      telephone: '+49 123 456789',
      url: 'https://zoe-solar.de',
      sameAs: [
        'https://www.facebook.com/zoesolar',
        'https://www.instagram.com/zoesolar'
      ]
    });

    // WebPage Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: this.replacePlaceholders(template.seoElements.titleTemplate, context),
      description: this.replacePlaceholders(template.seoElements.metaDescriptionTemplate, context),
      url: `https://zoe-solar.de${context.url}`
    });

    return schemas;
  }

  /**
   * Generiert A/B-Test-Varianten
   */
  private generateABTestVariants(template: LandingPageTemplate, content: any): GeneratedLandingPage['abTestVariants'] {
    return [
      {
        variantId: 'control',
        name: 'Original',
        modifications: {},
        weight: 0.5
      },
      {
        variantId: 'variant_a',
        name: 'Dringlichkeits-CTA',
        modifications: {
          cta: {
            text: 'Jetzt Termin sichern - Begrenzte Plätze!',
            style: 'urgent'
          }
        },
        weight: 0.3
      },
      {
        variantId: 'variant_b',
        name: 'Sozialer Beweis',
        modifications: {
          testimonials: {
            visible: true,
            count: 6
          }
        },
        weight: 0.2
      }
    ];
  }

  /**
   * Sagt Page-Performance voraus
   */
  private predictPagePerformance(template: LandingPageTemplate, localData: any, competitorData: any): any {
    const baseConversionRate = template.performanceMetrics.avgConversionRate;
    const localMultiplier = localData.marketSize > 10000 ? 1.2 : 0.9;
    const competitorMultiplier = competitorData ? 0.95 : 1.0;

    return {
      predictedConversionRate: baseConversionRate * localMultiplier * competitorMultiplier,
      predictedTimeOnPage: template.performanceMetrics.avgTimeOnPage,
      predictedBounceRate: template.performanceMetrics.bounceRate,
      confidence: 0.75
    };
  }

  /**
   * Richtet Optimierungsregeln ein
   */
  private setupOptimizationRules(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const optimizations: LandingPageOptimization[] = [];

      // Content-Optimierungen
      optimizations.push({
        pageId: `page_${locationKey}_local_service_template_${Date.now()}`,
        optimizationType: 'content',
        priority: 'high',
        issue: 'Fehlende lokale Testimonials',
        recommendation: 'Lokale Kundenbewertungen hinzufügen',
        implementation: {
          steps: [
            'Lokale Kunden identifizieren',
            'Bewertungen einholen',
            'Testimonials-Section aktualisieren'
          ],
          estimatedEffort: 'medium',
          riskLevel: 'low'
        },
        expectedImpact: {
          metric: 'conversion_rate',
          currentValue: 0.035,
          expectedValue: 0.042,
          confidence: 0.8
        },
        automated: false,
        applied: false
      });

      // SEO-Optimierungen
      optimizations.push({
        pageId: `page_${locationKey}_local_service_template_${Date.now()}`,
        optimizationType: 'seo',
        priority: 'medium',
        issue: 'Meta-Description zu lang',
        recommendation: 'Meta-Description auf 155 Zeichen kürzen',
        implementation: {
          steps: [
            'Meta-Description überprüfen',
            'Auf 155 Zeichen kürzen',
            'Wichtige Keywords beibehalten'
          ],
          estimatedEffort: 'quick',
          riskLevel: 'low'
        },
        expectedImpact: {
          metric: 'click_through_rate',
          currentValue: 0.025,
          expectedValue: 0.032,
          confidence: 0.7
        },
        automated: true,
        applied: false
      });

      this.optimizations.set(locationKey, optimizations);
    });
  }

  /**
   * Erstellt Beispiel-Kampagnen
   */
  private createSampleCampaigns(): void {
    const campaigns: LandingPageCampaign[] = [
      {
        id: 'campaign_spring_launch_2024',
        name: 'Frühlingskampagne 2024',
        description: 'Lokale Landing Pages für die Hochsaison',
        targetLocations: PRIMARY_SERVICE_REGIONS.slice(0, 5).map(r => r.city.toLowerCase()),
        targetKeywords: ['solaranlage', 'photovoltaik', 'förderung'],
        templateIds: ['local_service_template', 'location_landing_template'],
        goals: {
          primary: 'leads',
          kpis: [
            { metric: 'total_leads', target: 500, current: 234 },
            { metric: 'conversion_rate', target: 0.04, current: 0.035 },
            { metric: 'cost_per_lead', target: 25, current: 28 }
          ]
        },
        personalizationStrategy: {
          userSegments: ['high_intent_buyers', 'comparison_shoppers'],
          localFactors: ['market_size', 'competition', 'solar_potential'],
          dynamicElements: ['pricing', 'testimonials', 'availability']
        },
        abTesting: {
          enabled: true,
          variants: 3,
          trafficDistribution: 'equal',
          testDuration: 14
        },
        performance: {
          totalPages: 15,
          totalImpressions: 125000,
          totalClicks: 3125,
          totalConversions: 234,
          avgConversionRate: 0.035,
          avgCostPerLead: 28,
          roi: 2.4
        },
        status: 'active',
        startDate: '2024-03-01T00:00:00Z',
        createdAt: new Date().toISOString()
      }
    ];

    campaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });
  }

  /**
   * Ruft Template ab
   */
  public getTemplate(templateId: string): LandingPageTemplate | null {
    return this.templates.get(templateId) || null;
  }

  /**
   * Ruft generierte Page ab
   */
  public getGeneratedPage(pageId: string): GeneratedLandingPage | null {
    return this.generatedPages.get(pageId) || null;
  }

  /**
   * Ruft alle Templates ab
   */
  public getAllTemplates(): LandingPageTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Ruft Pages für Standort ab
   */
  public getPagesForLocation(locationKey: string): GeneratedLandingPage[] {
    return Array.from(this.generatedPages.values())
      .filter(page => page.locationKey === locationKey);
  }

  /**
   * Ruft Optimierungen für Page ab
   */
  public getPageOptimizations(pageId: string): LandingPageOptimization[] {
    return Array.from(this.optimizations.values())
      .flat()
      .filter(opt => opt.pageId === pageId);
  }

  /**
   * Wendet Optimierung an
   */
  public applyOptimization(pageId: string, optimizationId: string): boolean {
    const page = this.generatedPages.get(pageId);
    if (!page) return false;

    const optimizations = this.getPageOptimizations(pageId);
    const optimization = optimizations.find(opt => opt.pageId === optimizationId);

    if (!optimization) return false;

    // Wende Optimierung an (vereinfacht)
    optimization.applied = true;
    optimization.appliedAt = new Date().toISOString();

    // Aktualisiere Page
    page.optimizationHistory.push({
      timestamp: new Date().toISOString(),
      type: optimization.automated ? 'automatic' : 'manual',
      changes: optimization.recommendation,
      impact: optimization.expectedImpact.expectedValue - optimization.expectedImpact.currentValue
    });

    return true;
  }

  /**
   * Ruft Kampagnen ab
   */
  public getCampaigns(): LandingPageCampaign[] {
    return Array.from(this.campaigns.values());
  }

  /**
   * Ruft Kampagnen-Performance ab
   */
  public getCampaignAnalytics(campaignId: string): {
    campaign: LandingPageCampaign;
    pagePerformance: Array<{
      pageId: string;
      url: string;
      impressions: number;
      clicks: number;
      conversions: number;
      conversionRate: number;
    }>;
    abTestResults: Array<{
      variant: string;
      traffic: number;
      conversions: number;
      conversionRate: number;
      winner: boolean;
    }>;
    recommendations: string[];
  } | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    // Sammle Page-Performance
    const pagePerformance = Array.from(this.generatedPages.values())
      .filter(page => campaign.templateIds.includes(page.templateId) &&
                     campaign.targetLocations.includes(page.locationKey))
      .map(page => ({
        pageId: page.id,
        url: page.url,
        impressions: page.performanceTracking.impressions,
        clicks: page.performanceTracking.clicks,
        conversions: page.performanceTracking.conversions,
        conversionRate: page.performanceTracking.impressions > 0 ?
          page.performanceTracking.conversions / page.performanceTracking.impressions : 0
      }));

    // A/B-Test-Ergebnisse (vereinfacht)
    const abTestResults = [
      { variant: 'Control', traffic: 50, conversions: 15, conversionRate: 0.3, winner: false },
      { variant: 'Variant A', traffic: 30, conversions: 12, conversionRate: 0.4, winner: true },
      { variant: 'Variant B', traffic: 20, conversions: 6, conversionRate: 0.3, winner: false }
    ];

    const recommendations = [
      'Variant A als Gewinner implementieren',
      'Weitere Tests für Headlines planen',
      'Mobile Optimierung priorisieren'
    ];

    return {
      campaign,
      pagePerformance,
      abTestResults,
      recommendations
    };
  }

  /**
   * Generiert Batch von Landing Pages
   */
  public generateBatchPages(requests: PageGenerationRequest[]): GeneratedLandingPage[] {
    return requests.map(request => this.generateLandingPage(request)).filter(Boolean) as GeneratedLandingPage[];
  }

  /**
   * Exportiert Page als HTML-Datei
   */
  public exportPage(pageId: string): string | null {
    const page = this.generatedPages.get(pageId);
    if (!page) return null;

    return page.generatedContent.html;
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalTemplates: number;
    totalPages: number;
    activeCampaigns: number;
    totalImpressions: number;
    totalConversions: number;
    avgConversionRate: number;
    topPerformingPages: Array<{
      pageId: string;
      url: string;
      conversions: number;
      conversionRate: number;
    }>;
    recentOptimizations: LandingPageOptimization[];
    campaignPerformance: Array<{
      campaignId: string;
      name: string;
      conversions: number;
      roi: number;
    }>;
  } {
    const totalTemplates = this.templates.size;
    const totalPages = this.generatedPages.size;
    const activeCampaigns = Array.from(this.campaigns.values()).filter(c => c.status === 'active').length;

    const allPages = Array.from(this.generatedPages.values());
    const totalImpressions = allPages.reduce((sum, page) => sum + page.performanceTracking.impressions, 0);
    const totalConversions = allPages.reduce((sum, page) => sum + page.performanceTracking.conversions, 0);
    const avgConversionRate = totalImpressions > 0 ? totalConversions / totalImpressions : 0;

    // Top performing Pages
    const topPerformingPages = allPages
      .map(page => ({
        pageId: page.id,
        url: page.url,
        conversions: page.performanceTracking.conversions,
        conversionRate: page.performanceTracking.impressions > 0 ?
          page.performanceTracking.conversions / page.performanceTracking.impressions : 0
      }))
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 5);

    // Recent Optimizations
    const recentOptimizations = Array.from(this.optimizations.values())
      .flat()
      .filter(opt => opt.appliedAt)
      .sort((a, b) => new Date(b.appliedAt!).getTime() - new Date(a.appliedAt!).getTime())
      .slice(0, 10);

    // Campaign Performance
    const campaignPerformance = Array.from(this.campaigns.values())
      .map(campaign => ({
        campaignId: campaign.id,
        name: campaign.name,
        conversions: campaign.performance.totalConversions,
        roi: campaign.performance.roi
      }))
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 5);

    return {
      totalTemplates,
      totalPages,
      activeCampaigns,
      totalImpressions,
      totalConversions,
      avgConversionRate: Math.round(avgConversionRate * 10000) / 100,
      topPerformingPages,
      recentOptimizations,
      campaignPerformance
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const automatedLocalLandingPageGenerationService = new AutomatedLocalLandingPageGenerationService();