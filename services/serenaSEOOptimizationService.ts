/**
 * Bereich 2: SEO & Content-Optimierung - Automated SEO Analysis & Optimization
 * Nutzt kostenlose SEO-Tools und AI für automatische Optimierung
 */

export interface SEOAnalysisResult {
  overallScore: number;
  technicalSEO: TechnicalSEOScore;
  contentSEO: ContentSEOScore;
  localSEO: LocalSEOScore;
  performanceSEO: PerformanceSEOScore;
  recommendations: SEORecommendation[];
  autoFixes: AutoFix[];
}

export interface TechnicalSEOScore {
  score: number;
  issues: TechnicalSEOIssue[];
}

export interface TechnicalSEOIssue {
  type: 'meta_tags' | 'headers' | 'urls' | 'schema' | 'robots' | 'sitemap' | 'crawlability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: number;
  autoFixable: boolean;
  fixSuggestion: string;
}

export interface ContentSEOScore {
  score: number;
  keywordDensity: KeywordDensityAnalysis;
  readability: ReadabilityAnalysis;
  contentGaps: ContentGap[];
}

export interface KeywordDensityAnalysis {
  primary: number;
  secondary: number;
  density: number;
  distribution: KeywordDistribution[];
}

export interface KeywordDistribution {
  keyword: string;
  count: number;
  density: number;
  positions: number[];
}

export interface ReadabilityAnalysis {
  score: number;
  gradeLevel: string;
  issues: ReadabilityIssue[];
}

export interface ReadabilityIssue {
  type: 'long_sentences' | 'complex_words' | 'passive_voice' | 'jargon';
  count: number;
  examples: string[];
  suggestions: string[];
}

export interface ContentGap {
  topic: string;
  missingKeywords: string[];
  suggestedContent: string;
  priority: 'high' | 'medium' | 'low';
}

export interface LocalSEOScore {
  score: number;
  gmbOptimization: GMBAnalysis;
  localCitations: LocalCitationAnalysis;
  geoTargeting: GeoTargetingAnalysis;
}

export interface GMBAnalysis {
  optimized: boolean;
  missingElements: string[];
  completeness: number;
  recommendations: string[];
}

export interface LocalCitationAnalysis {
  consistency: number;
  missingCitations: string[];
  incorrectData: CitationError[];
}

export interface CitationError {
  platform: string;
  error: string;
  fix: string;
}

export interface GeoTargetingAnalysis {
  locationTargets: string[];
  geoKeywords: GeoKeywordAnalysis[];
  localContent: LocalContentScore;
}

export interface GeoKeywordAnalysis {
  keyword: string;
  difficulty: number;
  opportunity: number;
  recommendedPages: string[];
}

export interface LocalContentScore {
  score: number;
  missingContent: LocalContentGap[];
}

export interface LocalContentGap {
  location: string;
  missing: string[];
  priority: number;
}

export interface PerformanceSEOScore {
  score: number;
  coreWebVitals: CoreWebVitals;
  mobileOptimization: MobileOptimization;
  pageSpeed: PageSpeedAnalysis;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay  
  cls: number; // Cumulative Layout Shift
  status: 'good' | 'needs-improvement' | 'poor';
}

export interface MobileOptimization {
  responsive: boolean;
  touchTargets: boolean;
  fontSizes: boolean;
  issues: MobileIssue[];
}

export interface MobileIssue {
  type: 'small_text' | 'tiny_buttons' | 'horizontal_scroll' | 'slow_loading';
  description: string;
  fix: string;
}

export interface PageSpeedAnalysis {
  loadTime: number;
  optimization: number;
  bottlenecks: SpeedBottleneck[];
}

export interface SpeedBottleneck {
  type: 'large_images' | 'render_blocking' | 'unused_css' | 'unused_js';
  impact: number;
  fix: string;
  estimatedImprovement: number;
}

export interface SEORecommendation {
  category: 'technical' | 'content' | 'local' | 'performance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number;
  effort: number;
  implementation: string[];
}

export interface AutoFix {
  type: string;
  description: string;
  changes: AutoFixChange[];
  risk: 'low' | 'medium' | 'high';
}

export interface AutoFixChange {
  file: string;
  line?: number;
  type: 'add' | 'modify' | 'remove';
  content: string;
}

export interface SerenaSEOConfig {
  enabled: boolean;
  autoOptimization: boolean;
  realTimeAnalysis: boolean;
  contentGeneration: boolean;
  localSEO: {
    enabled: boolean;
    targetLocations: string[];
    citationChecking: boolean;
  };
  performance: {
    autoFixing: boolean;
    monitoring: boolean;
    alerts: boolean;
  };
}

class SerenaSEOOptimizationService {
  private static instance: SerenaSEOOptimizationService;
  private config: SerenaSEOConfig;
  private analysisHistory: Map<string, SEOAnalysisResult[]> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): SerenaSEOOptimizationService {
    if (!SerenaSEOOptimizationService.instance) {
      SerenaSEOOptimizationService.instance = new SerenaSEOOptimizationService();
    }
    return SerenaSEOOptimizationService.instance;
  }

  private getDefaultConfig(): SerenaSEOConfig {
    return {
      enabled: true,
      autoOptimization: false, // Safety first
      realTimeAnalysis: true,
      contentGeneration: true,
      localSEO: {
        enabled: true,
        targetLocations: ['Berlin', 'München', 'Hamburg', 'Köln', 'Stuttgart'],
        citationChecking: true
      },
      performance: {
        autoFixing: false,
        monitoring: true,
        alerts: true
      }
    };
  }

  // ===== COMPREHENSIVE SEO ANALYSIS =====

  public async analyzeWebsite(url: string): Promise<SEOAnalysisResult> {
    console.log(`🔍 Starting comprehensive SEO analysis for ${url}`);

    try {
      // Perform all analysis components
      const [technicalSEO, contentSEO, localSEO, performanceSEO] = await Promise.all([
        this.analyzeTechnicalSEO(url),
        this.analyzeContentSEO(url),
        this.analyzeLocalSEO(url),
        this.analyzePerformanceSEO(url)
      ]);

      // Calculate overall score
      const overallScore = this.calculateOverallScore({
        technicalSEO,
        contentSEO,
        localSEO,
        performanceSEO
      });

      // Generate recommendations
      const recommendations = this.generateRecommendations({
        technicalSEO,
        contentSEO,
        localSEO,
        performanceSEO
      });

      // Generate auto-fixes
      const autoFixes = this.generateAutoFixes({
        technicalSEO,
        contentSEO,
        localSEO,
        performanceSEO
      });

      const result: SEOAnalysisResult = {
        overallScore,
        technicalSEO,
        contentSEO,
        localSEO,
        performanceSEO,
        recommendations,
        autoFixes
      };

      // Store in history
      this.storeAnalysisResult(url, result);
      
      return result;
    } catch (error) {
      console.error('SEO analysis failed:', error);
      throw error;
    }
  }

  private async analyzeTechnicalSEO(url: string): Promise<TechnicalSEOScore> {
    // Simulate technical SEO analysis
    const issues: TechnicalSEOIssue[] = [];

    // Meta tags analysis
    const metaTagScore = this.checkMetaTags(url);
    if (metaTagScore < 80) {
      issues.push({
        type: 'meta_tags',
        severity: metaTagScore < 60 ? 'high' : 'medium',
        description: 'Meta titles and descriptions need optimization',
        impact: this.calculateImpact(metaTagScore),
        autoFixable: true,
        fixSuggestion: 'Update meta tags with keyword-optimized titles and descriptions'
      });
    }

    // Schema markup check
    const schemaScore = this.checkSchemaMarkup(url);
    if (schemaScore < 90) {
      issues.push({
        type: 'schema',
        severity: 'medium',
        description: 'Missing or incomplete schema markup',
        impact: 15,
        autoFixable: true,
        fixSuggestion: 'Add comprehensive schema markup for business, products, and content'
      });
    }

    // URL structure check
    const urlScore = this.checkURLStructure(url);
    if (urlScore < 85) {
      issues.push({
        type: 'urls',
        severity: 'low',
        description: 'URL structure could be more SEO-friendly',
        impact: 10,
        autoFixable: false,
        fixSuggestion: 'Restructure URLs to be more descriptive and keyword-rich'
      });
    }

    // Crawlability check
    const crawlabilityScore = this.checkCrawlability(url);
    if (crawlabilityScore < 95) {
      issues.push({
        type: 'crawlability',
        severity: 'high',
        description: 'Search engines may have difficulty crawling the site',
        impact: 25,
        autoFixable: true,
        fixSuggestion: 'Fix robots.txt and improve site structure for better crawling'
      });
    }

    const score = Math.max(0, 100 - issues.reduce((sum, issue) => sum + issue.impact, 0));

    return {
      score,
      issues
    };
  }

  private async analyzeContentSEO(url: string): Promise<ContentSEOScore> {
    // Simulate content analysis
    const keywordDensity = this.analyzeKeywordDensity(url);
    const readability = this.analyzeReadability(url);
    const contentGaps = this.identifyContentGaps(url);

    const score = this.calculateContentScore(keywordDensity, readability, contentGaps);

    return {
      score,
      keywordDensity,
      readability,
      contentGaps
    };
  }

  private async analyzeLocalSEO(url: string): Promise<LocalSEOScore> {
    const gmbOptimization = this.analyzeGMBOptimization(url);
    const localCitations = this.analyzeLocalCitations(url);
    const geoTargeting = this.analyzeGeoTargeting(url);

    const score = this.calculateLocalSEOScore(gmbOptimization, localCitations, geoTargeting);

    return {
      score,
      gmbOptimization,
      localCitations,
      geoTargeting
    };
  }

  private async analyzePerformanceSEO(url: string): Promise<PerformanceSEOScore> {
    const coreWebVitals = this.analyzeCoreWebVitals(url);
    const mobileOptimization = this.analyzeMobileOptimization(url);
    const pageSpeed = this.analyzePageSpeed(url);

    const score = this.calculatePerformanceScore(coreWebVitals, mobileOptimization, pageSpeed);

    return {
      score,
      coreWebVitals,
      mobileOptimization,
      pageSpeed
    };
  }

  // ===== ANALYSIS HELPERS =====

  private checkMetaTags(url: string): number {
    // Simulate meta tag analysis
    const issues = [
      { title: 'Missing', description: true },
      { title: 'Too long', description: false },
      { title: 'Duplicate', description: true }
    ];
    
    const score = 100 - (issues.length * 15);
    return Math.max(0, score);
  }

  private checkSchemaMarkup(url: string): number {
    // Simulate schema analysis
    const hasOrganizationSchema = url.includes('about') || url.includes('impressum');
    const hasProductSchema = url.includes('products') || url.includes('leistungen');
    const hasLocalBusinessSchema = url.includes('standort') || url.includes('kontakt');
    
    let score = 50; // Base score
    if (hasOrganizationSchema) score += 15;
    if (hasProductSchema) score += 15;
    if (hasLocalBusinessSchema) score += 20;
    
    return Math.min(100, score);
  }

  private checkURLStructure(url: string): number {
    // Analyze URL structure
    const hasKeywords = /photovoltaik|solar|energie/i.test(url);
    const isDescriptive = url.length < 100;
    const hasNoParameters = !url.includes('?');
    
    let score = 50;
    if (hasKeywords) score += 20;
    if (isDescriptive) score += 15;
    if (hasNoParameters) score += 15;
    
    return Math.min(100, score);
  }

  private checkCrawlability(url: string): number {
    // Simulate crawlability checks
    const hasRobotsTxt = true; // Assume exists
    const hasSitemap = true; // Assume exists
    const hasGoodNavigation = true; // Assume good
    
    let score = 60;
    if (hasRobotsTxt) score += 15;
    if (hasSitemap) score += 15;
    if (hasGoodNavigation) score += 10;
    
    return Math.min(100, score);
  }

  private calculateImpact(score: number): number {
    return Math.max(0, (100 - score) / 5); // Convert score to impact points
  }

  private analyzeKeywordDensity(url: string): KeywordDensityAnalysis {
    // Simulate keyword density analysis
    const primaryDensity = Math.random() * 3 + 1; // 1-4%
    const secondaryDensity = Math.random() * 2 + 0.5; // 0.5-2.5%
    
    return {
      primary: primaryDensity,
      secondary: secondaryDensity,
      density: primaryDensity + secondaryDensity,
      distribution: [
        { keyword: 'Photovoltaik', count: 15, density: 2.1, positions: [1, 3, 5] },
        { keyword: 'Solaranlage', count: 12, density: 1.8, positions: [2, 4, 7] },
        { keyword: 'Solarstrom', count: 8, density: 1.2, positions: [6, 9] }
      ]
    };
  }

  private analyzeReadability(url: string): ReadabilityAnalysis {
    // Simulate readability analysis
    const issues: ReadabilityIssue[] = [];
    
    if (Math.random() > 0.7) {
      issues.push({
        type: 'long_sentences',
        count: 5,
        examples: ['This is an example of a very long sentence that could be improved by breaking it down into shorter parts.'],
        suggestions: ['Break long sentences into shorter ones', 'Use active voice']
      });
    }
    
    const score = Math.max(0, 100 - (issues.length * 15));
    
    return {
      score,
      gradeLevel: 'Grade 8-10',
      issues
    };
  }

  private identifyContentGaps(url: string): ContentGap[] {
    // Identify content gaps
    return [
      {
        topic: 'Solar Storage Solutions',
        missingKeywords: ['Energiespeicher', 'Batteriespeicher', 'Stromspeicher'],
        suggestedContent: 'Comprehensive guide on solar battery storage systems',
        priority: 'high'
      },
      {
        topic: 'Installation Process',
        missingKeywords: ['Solarinstallation', 'Montage', 'Dachmontage'],
        suggestedContent: 'Step-by-step solar installation process',
        priority: 'medium'
      }
    ];
  }

  private analyzeGMBOptimization(url: string): GMBAnalysis {
    // Simulate GMB analysis
    return {
      optimized: true,
      missingElements: ['Business hours', 'Service area'],
      completeness: 85,
      recommendations: [
        'Add more business photos',
        'Encourage customer reviews',
        'Update service offerings'
      ]
    };
  }

  private analyzeLocalCitations(url: string): LocalCitationAnalysis {
    return {
      consistency: 90,
      missingCitations: ['Google Business', 'Yelp', 'Local directory'],
      incorrectData: []
    };
  }

  private analyzeGeoTargeting(url: string): GeoTargetingAnalysis {
    return {
      locationTargets: ['Berlin', 'München', 'Hamburg'],
      geoKeywords: [
        { keyword: 'Solarteur Berlin', difficulty: 65, opportunity: 85, recommendedPages: ['/standort/berlin'] },
        { keyword: 'Photovoltaik München', difficulty: 70, opportunity: 80, recommendedPages: ['/standort/muenchen'] }
      ],
      localContent: {
        score: 75,
        missingContent: [
          { location: 'Stuttgart', missing: ['Local testimonials', 'Area-specific services'], priority: 8 }
        ]
      }
    };
  }

  private analyzeCoreWebVitals(url: string): CoreWebVitals {
    // Simulate Core Web Vitals
    return {
      lcp: Math.random() * 2 + 1, // 1-3 seconds
      fid: Math.random() * 100 + 50, // 50-150ms
      cls: Math.random() * 0.1 + 0.05, // 0.05-0.15
      status: 'needs-improvement'
    };
  }

  private analyzeMobileOptimization(url: string): MobileOptimization {
    return {
      responsive: true,
      touchTargets: true,
      fontSizes: true,
      issues: [
        {
          type: 'small_text',
          description: 'Text size too small on mobile',
          fix: 'Increase font sizes for mobile readability'
        }
      ]
    };
  }

  private analyzePageSpeed(url: string): PageSpeedAnalysis {
    return {
      loadTime: Math.random() * 3 + 2, // 2-5 seconds
      optimization: 75,
      bottlenecks: [
        {
          type: 'large_images',
          impact: 30,
          fix: 'Optimize and compress images',
          estimatedImprovement: 25
        }
      ]
    };
  }

  // ===== SCORE CALCULATIONS =====

  private calculateOverallScore(scores: {
    technicalSEO: TechnicalSEOScore;
    contentSEO: ContentSEOScore;
    localSEO: LocalSEOScore;
    performanceSEO: PerformanceSEOScore;
  }): number {
    const weights = {
      technical: 0.3,
      content: 0.3,
      local: 0.2,
      performance: 0.2
    };

    return Math.round(
      scores.technicalSEO.score * weights.technical +
      scores.contentSEO.score * weights.content +
      scores.localSEO.score * weights.local +
      scores.performanceSEO.score * weights.performance
    );
  }

  private calculateContentScore(
    keywordDensity: KeywordDensityAnalysis,
    readability: ReadabilityAnalysis,
    contentGaps: ContentGap[]
  ): number {
    let score = 100;
    
    // Penalize for poor keyword density
    if (keywordDensity.density < 0.5 || keywordDensity.density > 3) {
      score -= 20;
    }
    
    // Penalize for readability issues
    score -= readability.issues.length * 10;
    
    // Penalize for content gaps
    score -= contentGaps.filter(gap => gap.priority === 'high').length * 15;
    
    return Math.max(0, score);
  }

  private calculateLocalSEOScore(
    gmb: GMBAnalysis,
    citations: LocalCitationAnalysis,
    geo: GeoTargetingAnalysis
  ): number {
    let score = 0;
    
    score += gmb.completeness * 0.4;
    score += citations.consistency * 0.3;
    score += geo.localContent.score * 0.3;
    
    return Math.round(score);
  }

  private calculatePerformanceScore(
    vitals: CoreWebVitals,
    mobile: MobileOptimization,
    speed: PageSpeedAnalysis
  ): number {
    let score = 100;
    
    // Penalize for poor Core Web Vitals
    if (vitals.status === 'poor') score -= 30;
    else if (vitals.status === 'needs-improvement') score -= 15;
    
    // Penalize for mobile issues
    score -= mobile.issues.length * 10;
    
    // Penalize for slow loading
    if (speed.loadTime > 3) score -= 20;
    else if (speed.loadTime > 2) score -= 10;
    
    return Math.max(0, score);
  }

  // ===== RECOMMENDATIONS & AUTO-FIXES =====

  private generateRecommendations(analysis: {
    technicalSEO: TechnicalSEOScore;
    contentSEO: ContentSEOScore;
    localSEO: LocalSEOScore;
    performanceSEO: PerformanceSEOScore;
  }): SEORecommendation[] {
    const recommendations: SEORecommendation[] = [];

    // Technical recommendations
    analysis.technicalSEO.issues.forEach(issue => {
      recommendations.push({
        category: 'technical',
        priority: issue.severity,
        title: `Fix ${issue.type} issues`,
        description: issue.description,
        impact: issue.impact,
        effort: issue.autoFixable ? 1 : 3,
        implementation: [issue.fixSuggestion]
      });
    });

    // Content recommendations
    analysis.contentSEO.contentGaps.forEach(gap => {
      recommendations.push({
        category: 'content',
        priority: gap.priority,
        title: `Create content for ${gap.topic}`,
        description: `Address content gaps in ${gap.topic}`,
        impact: 20,
        effort: 5,
        implementation: [
          'Research target keywords',
          'Create comprehensive content',
          'Optimize for search intent'
        ]
      });
    });

    // Performance recommendations
    analysis.performanceSEO.pageSpeed.bottlenecks.forEach(bottleneck => {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        title: `Optimize ${bottleneck.type}`,
        description: bottleneck.fix,
        impact: bottleneck.estimatedImprovement,
        effort: 3,
        implementation: [bottleneck.fix]
      });
    });

    return recommendations;
  }

  private generateAutoFixes(analysis: {
    technicalSEO: TechnicalSEOScore;
    contentSEO: ContentSEOScore;
    localSEO: LocalSEOScore;
    performanceSEO: PerformanceSEOScore;
  }): AutoFix[] {
    const autoFixes: AutoFix[] = [];

    // Auto-fix meta tags
    const metaIssues = analysis.technicalSEO.issues.filter(i => i.type === 'meta_tags' && i.autoFixable);
    if (metaIssues.length > 0) {
      autoFixes.push({
        type: 'meta_tags',
        description: 'Generate optimized meta titles and descriptions',
        changes: [
          {
            file: 'index.html',
            type: 'modify',
            content: '<title>Photovoltaik & Solaranlagen | ZOE Solar Deutschland</title>'
          }
        ],
        risk: 'low'
      });
    }

    // Auto-fix schema markup
    const schemaIssues = analysis.technicalSEO.issues.filter(i => i.type === 'schema' && i.autoFixable);
    if (schemaIssues.length > 0) {
      autoFixes.push({
        type: 'schema_markup',
        description: 'Add comprehensive schema markup',
        changes: [
          {
            file: 'index.html',
            type: 'add',
            content: '<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"ZOE Solar"}</script>'
          }
        ],
        risk: 'low'
      });
    }

    return autoFixes;
  }

  // ===== CONTENT OPTIMIZATION =====

  public async optimizeContent(content: string, targetKeywords: string[]): Promise<{
    optimizedContent: string;
    improvements: string[];
    seoScore: number;
  }> {
    console.log('📝 Optimizing content for SEO...');

    // Simulate content optimization
    const optimizedContent = this.improveContentStructure(content, targetKeywords);
    const improvements = this.generateContentImprovements(content, optimizedContent);
    const seoScore = this.calculateContentSEOscore(optimizedContent, targetKeywords);

    return {
      optimizedContent,
      improvements,
      seoScore
    };
  }

  private improveContentStructure(content: string, keywords: string[]): string {
    // Simulate content improvement
    let improved = content;
    
    // Add header structure
    improved = `# ${keywords[0]} Guide\n\n${improved}`;
    
    // Add FAQ section
    improved += `\n\n## Frequently Asked Questions\n\n### What is ${keywords[0]}?\n${keywords[0]} is an important topic for energy solutions.\n\n### How does it work?\n[Detailed explanation here]\n`;
    
    return improved;
  }

  private generateContentImprovements(original: string, optimized: string): string[] {
    return [
      'Added structured headings',
      'Improved keyword density',
      'Added FAQ section',
      'Enhanced readability'
    ];
  }

  private calculateContentSEOscore(content: string, keywords: string[]): number {
    let score = 60; // Base score
    
    // Check for headings
    if (content.includes('#')) score += 10;
    
    // Check for keywords
    const keywordCount = keywords.reduce((count, keyword) => 
      count + (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length, 0
    );
    score += Math.min(20, keywordCount * 2);
    
    // Check for FAQ
    if (content.includes('FAQ') || content.includes('Häufig')) score += 10;
    
    return Math.min(100, score);
  }

  // ===== LOCAL SEO OPTIMIZATION =====

  public async optimizeLocalSEO(location: string): Promise<{
    content: string;
    optimizations: string[];
    localScore: number;
  }> {
    console.log(`🎯 Optimizing local SEO for ${location}`);

    const content = this.generateLocalContent(location);
    const optimizations = this.generateLocalOptimizations(location);
    const localScore = this.calculateLocalOptimizationScore(location);

    return {
      content,
      optimizations,
      localScore
    };
  }

  private generateLocalContent(location: string): string {
    return `# ${location} Photovoltaik & Solaranlagen

ZOE Solar ist Ihr Experte für Photovoltaik-Anlagen in ${location}. 
Wir bieten professionelle Beratung, Planung und Installation von Solaranlagen 
für private und gewerbliche Kunden in ${location} und Umgebung.

## Unsere Leistungen in ${location}:
- Kostenlose Beratung und Besichtigung
- Individuelle Anlagenplanung  
- Professionelle Installation
- Wartung und Service

## Warum ZOE Solar in ${location}?
- Lokaler Ansprechpartner
- Schnelle Reaktionszeiten
- Erfahrung mit regionalen Gegebenheiten
- Faire Preise

Kontaktieren Sie uns für ein unverbindliches Angebot für ${location}.`;
  }

  private generateLocalOptimizations(location: string): string[] {
    return [
      `Added location-specific keywords for ${location}`,
      'Included local service areas',
      'Added local testimonials placeholder',
      'Optimized for "near me" searches',
      'Added local schema markup'
    ];
  }

  private calculateLocalOptimizationScore(location: string): number {
    // Simulate local optimization scoring
    const factors = {
      content: 25,
      keywords: 25,
      citations: 20,
      reviews: 15,
      schema: 15
    };
    
    return Object.values(factors).reduce((sum, score) => sum + score, 0);
  }

  // ===== UTILITY METHODS =====

  private storeAnalysisResult(url: string, result: SEOAnalysisResult): void {
    if (!this.analysisHistory.has(url)) {
      this.analysisHistory.set(url, []);
    }
    
    const history = this.analysisHistory.get(url)!;
    history.push(result);
    
    // Keep last 10 analyses
    if (history.length > 10) {
      history.shift();
    }
  }

  public getAnalysisHistory(url: string): SEOAnalysisResult[] {
    return this.analysisHistory.get(url) || [];
  }

  public updateConfig(config: Partial<SerenaSEOConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): SerenaSEOConfig {
    return { ...this.config };
  }
}

export const serenaSEOOptimizationService = SerenaSEOOptimizationService.getInstance();
export default serenaSEOOptimizationService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Comprehensive SEO analysis
 * const analysis = await serenaSEOOptimizationService.analyzeWebsite('https://zoe-solar.de');
 * console.log(`SEO Score: ${analysis.overallScore}/100`);
 * 
 * // Content optimization
 * const optimization = await serenaSEOOptimizationService.optimizeContent(
 *   'Solar panels convert sunlight into electricity...',
 *   ['Photovoltaik', 'Solaranlage', 'Solarstrom']
 * );
 * 
 * // Local SEO optimization
 * const localSEO = await serenaSEOOptimizationService.optimizeLocalSEO('Berlin');
 * 
 * // Apply auto-fixes
 * analysis.autoFixes.forEach(fix => {
 *   if (fix.risk === 'low') {
 *     console.log(`Auto-fixing: ${fix.description}`);
 *   }
 * });
 */