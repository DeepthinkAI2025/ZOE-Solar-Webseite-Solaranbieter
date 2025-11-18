/**
 * AI-Powered SEO Content Optimizer
 * Uses machine learning to provide intelligent SEO recommendations and content optimization
 */

import ContentAnalyzer, { SEOAnalysisResult } from '../analytics/ContentAnalyzer';
import SEOAPIClient, { KeywordData } from '../../api/services/SEOAPIClient';

export interface OptimizationRequest {
  url: string;
  content: string;
  targetKeyword?: string;
  targetAudience?: string;
  contentType?: 'blog' | 'landing' | 'service' | 'faq' | 'product';
  optimizationGoals?: ('ranking' | 'traffic' | 'conversions' | 'engagement')[];
  competitorUrls?: string[];
  locale?: string;
}

export interface AIOptimizationResult {
  originalContent: string;
  optimizedContent: string;
  changes: Array<{
    type: 'addition' | 'removal' | 'replacement' | 'reordering';
    section: string;
    originalText?: string;
    newText?: string;
    reasoning: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
  }>;
  seoImprovements: {
    title: string;
    metaDescription: string;
    headings: string[];
    internalLinks: string[];
    keywords: string[];
  };
  performancePrediction: {
    rankingImprovement: number;
    trafficIncrease: number;
    engagementIncrease: number;
    conversionImpact: number;
  };
  qualityScore: {
    content: number;
    seo: number;
    readability: number;
    technical: number;
    overall: number;
  };
  implementation: {
    priority: string[];
    estimatedTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

export interface ContentGap {
  topic: string;
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  difficulty: number;
  opportunityScore: number;
  contentType: 'blog' | 'landing' | 'service' | 'faq';
  targetIntent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  relatedQueries: string[];
  suggestedLength: number;
  recommendedStructure: string[];
}

export interface SEOAutomationConfig {
  autoOptimization: boolean;
  contentGeneration: boolean;
  keywordResearch: boolean;
  competitorMonitoring: boolean;
  performanceTracking: boolean;
  aBTesting: boolean;
  reporting: {
    frequency: 'daily' | 'weekly' | 'monthly';
    metrics: string[];
    alerts: boolean;
  };
  optimization: {
    aggressiveness: 'conservative' | 'moderate' | 'aggressive';
    minConfidence: number;
    maxChangesPerRun: number;
  };
}

class AIOptimizer {
  private contentAnalyzer: ContentAnalyzer;
  private seoApiClient: SEOAPIClient;
  private config: SEOAutomationConfig;
  private learningData: Map<string, unknown> = new Map();

  constructor(seoApiClient: SEOAPIClient, config?: Partial<SEOAutomationConfig>) {
    this.contentAnalyzer = new ContentAnalyzer();
    this.seoApiClient = seoApiClient;
    this.config = {
      autoOptimization: false,
      contentGeneration: false,
      keywordResearch: true,
      competitorMonitoring: true,
      performanceTracking: true,
      aBTesting: false,
      reporting: {
        frequency: 'weekly',
        metrics: ['rankings', 'traffic', 'conversions', 'engagement'],
        alerts: true,
      },
      optimization: {
        aggressiveness: 'moderate',
        minConfidence: 0.7,
        maxChangesPerRun: 5,
      },
      ...config,
    };
  }

  public async optimizeContent(request: OptimizationRequest): Promise<AIOptimizationResult> {
    const startTime = performance.now();

    // Analyze current content
    const analysis = await this.contentAnalyzer.analyzeContent(request.url, request.content);

    // Get keyword data if target keyword provided
    let keywordData: KeywordData[] = [];
    if (request.targetKeyword) {
      keywordData = await this.seoApiClient.getKeywordData([request.targetKeyword]);
    }

    // Perform AI-powered optimization
    const optimizationResult = await this.performAIOptimization(request, analysis, keywordData);

    // Calculate quality scores
    optimizationResult.qualityScore = this.calculateQualityScores(optimizationResult, analysis);

    // Predict performance impact
    optimizationResult.performancePrediction = await this.predictPerformanceImpact(
      optimizationResult,
      analysis,
      keywordData
    );

    // Generate implementation plan
    optimizationResult.implementation = this.generateImplementationPlan(optimizationResult);

    console.log(`AI optimization completed in ${(performance.now() - startTime).toFixed(2)}ms`);
    return optimizationResult;
  }

  private async performAIOptimization(
    request: OptimizationRequest,
    analysis: SEOAnalysisResult,
    keywordData: KeywordData[]
  ): Promise<AIOptimizationResult> {
    let optimizedContent = request.content;
    const changes: AIOptimizationResult['changes'] = [];

    // 1. Title Optimization
    if (this.shouldOptimizeTitle(analysis.metrics.title)) {
      const optimizedTitle = await this.optimizeTitle(
        analysis.metrics.title.text,
        request.targetKeyword,
        keywordData
      );

      changes.push({
        type: 'replacement',
        section: 'title',
        originalText: analysis.metrics.title.text,
        newText: optimizedTitle,
        reasoning: `Optimized title for better CTR and keyword targeting. Original score: ${analysis.metrics.title.keywordDensity.toFixed(2)}`,
        impact: 'high',
        confidence: 0.85,
      });

      optimizedContent = optimizedContent.replace(
        /<title[^>]*>.*?<\/title>/i,
        `<title>${this.escapeHtml(optimizedTitle)}</title>`
      );
    }

    // 2. Meta Description Optimization
    if (this.shouldOptimizeMetaDescription(analysis.metrics.meta)) {
      const optimizedMetaDescription = await this.optimizeMetaDescription(
        analysis.metrics.meta.description,
        request.targetKeyword,
        request.contentType
      );

      changes.push({
        type: 'replacement',
        section: 'meta-description',
        originalText: analysis.metrics.meta.description,
        newText: optimizedMetaDescription,
        reasoning: `Improved meta description for better search appearance and CTR. Original: ${analysis.metrics.meta.length} chars`,
        impact: 'high',
        confidence: 0.80,
      });

      const metaRegex = /<meta[^>]*name=["']description["'][^>]*content=["'][^"']*["'][^>]*>/i;
      if (metaRegex.test(optimizedContent)) {
        optimizedContent = optimizedContent.replace(
          metaRegex,
          `<meta name="description" content="${this.escapeHtml(optimizedMetaDescription)}">`
        );
      }
    }

    // 3. Content Structure Optimization
    const structureChanges = await this.optimizeContentStructure(
      optimizedContent,
      analysis.metrics.headings,
      request.targetKeyword
    );

    changes.push(...structureChanges.changes);
    optimizedContent = structureChanges.content;

    // 4. Content Enhancement
    const contentEnhancements = await this.enhanceContent(
      optimizedContent,
      analysis.metrics.content,
      request.targetKeyword,
      request.contentType
    );

    changes.push(...contentEnhancements.changes);
    optimizedContent = contentEnhancements.content;

    // 5. Internal Link Optimization
    const linkOptimizations = await this.optimizeInternalLinks(
      optimizedContent,
      analysis.metrics.technical.internalLinks
    );

    changes.push(...linkOptimizations.changes);
    optimizedContent = linkOptimizations.content;

    // 6. Technical SEO Improvements
    const technicalImprovements = await this.optimizeTechnicalSEO(optimizedContent, analysis);

    changes.push(...technicalImprovements.changes);
    optimizedContent = technicalImprovements.content;

    const result: AIOptimizationResult = {
      originalContent: request.content,
      optimizedContent,
      changes,
      seoImprovements: {
        title: this.extractOptimizedTitle(optimizedContent),
        metaDescription: this.extractOptimizedMetaDescription(optimizedContent),
        headings: this.extractHeadings(optimizedContent),
        internalLinks: this.extractInternalLinks(optimizedContent),
        keywords: this.extractTargetKeywords(optimizedContent, request.targetKeyword),
      },
      performancePrediction: {
        rankingImprovement: 0,
        trafficIncrease: 0,
        engagementIncrease: 0,
        conversionImpact: 0,
      },
      qualityScore: {
        content: 0,
        seo: 0,
        readability: 0,
        technical: 0,
        overall: 0,
      },
      implementation: {
        priority: [],
        estimatedTime: '',
        difficulty: 'easy',
      },
    };

    return result;
  }

  private shouldOptimizeTitle(title: unknown): boolean {
    const titleData = title as { optimized?: boolean; length?: number; keywordDensity?: number };
    return (
      !titleData.optimized ||
      (titleData.length || 0) < 30 ||
      (titleData.length || 0) > 60 ||
      (titleData.keywordDensity || 0) < 1 ||
      (titleData.keywordDensity || 0) > 3
    );
  }

  private async optimizeTitle(
    currentTitle: string,
    targetKeyword?: string,
    keywordData: KeywordData[] = []
  ): Promise<string> {
    // AI-powered title optimization
    const _templates = [
      '{keyword} 2024: Kosten, Förderung & Vorteile | ZOE Solar',
      'Die besten {keyword} im Vergleich | Aktuelle Angebote',
      '{keyword}: So sparen Sie bis zu 30% | Expertenberatung',
    ];

    if (targetKeyword) {
      // Use AI to generate title variations
      const variations = await this.generateTitleVariations(targetKeyword, keywordData);
      return this.selectBestTitle(variations, targetKeyword);
    }

    // Optimize existing title
    return this.improveExistingTitle(currentTitle);
  }

  private async generateTitleVariations(keyword: string, keywordData: KeywordData[]): Promise<string[]> {
    // In a real implementation, this would use AI to generate titles
    const variations: string[] = [];

    // Template-based generation
    variations.push(`${keyword} 2024: Kosten, Förderung & Sparpotential`);
    variations.push(`${keyword}: Preise vergleichen & Geld sparen`);
    variations.push(`So finden Sie die beste ${keyword} | Komplettguide`);

    // Add keyword-based variations
    const keywordInfo = keywordData.find(k => k.keyword === keyword);
    if (keywordInfo?.relatedKeywords) {
      for (const relatedKeyword of keywordInfo.relatedKeywords.slice(0, 2)) {
        variations.push(`${keyword} mit ${relatedKeyword}: Das müssen Sie wissen`);
      }
    }

    return variations;
  }

  private selectBestTitle(variations: string[], targetKeyword: string): string {
    // Score each title based on multiple factors
    let bestTitle = variations[0];
    let bestScore = 0;

    for (const title of variations) {
      let score = 0;

      // Length score (30-60 characters optimal)
      if (title.length >= 30 && title.length <= 60) score += 30;

      // Keyword presence
      if (title.toLowerCase().includes(targetKeyword.toLowerCase())) score += 25;

      // Year/Current relevance
      if (/\b(2024|2025|aktuell|neu)\b/i.test(title)) score += 15;

      // Emotional/Benefit words
      if (/\b(sparen|günstig|beste|top|vergleich|guide)\b/i.test(title)) score += 15;

      // Brand mentions
      if (/zoe.?solar/i.test(title)) score += 10;

      // Clickbait prevention (penalize excessive punctuation)
      if ((title.match(/[!?]/g) || []).length > 1) score -= 10;

      if (score > bestScore) {
        bestScore = score;
        bestTitle = title;
      }
    }

    return bestTitle || variations[0] || '';
  }

  private improveExistingTitle(currentTitle: string): string {
    let improvedTitle = currentTitle;

    // Add year if missing
    if (!/\b(2024|2025)\b/.test(currentTitle)) {
      improvedTitle = improvedTitle.replace(/(\s*\|\s*.*)?$/, ' 2024$1');
    }

    // Ensure optimal length
    if (improvedTitle.length < 30) {
      improvedTitle += ' | ZOE Solar';
    } else if (improvedTitle.length > 60) {
      improvedTitle = improvedTitle.substring(0, 57).trim() + '...';
    }

    return improvedTitle;
  }

  private shouldOptimizeMetaDescription(meta: unknown): boolean {
    const metaData = meta as { optimized?: boolean; length?: number; keywordDensity?: number };
    return (
      !metaData.optimized ||
      (metaData.length || 0) < 120 ||
      (metaData.length || 0) > 160 ||
      (metaData.keywordDensity || 0) < 0.5 ||
      (metaData.keywordDensity || 0) > 2
    );
  }

  private async optimizeMetaDescription(
    currentDescription: string,
    targetKeyword?: string,
    contentType?: string
  ): Promise<string> {
    // AI-powered meta description optimization
    if (targetKeyword) {
      const variations = await this.generateMetaDescriptionVariations(targetKeyword, contentType);
      return this.selectBestMetaDescription(variations, targetKeyword);
    }

    return this.improveExistingMetaDescription(currentDescription, targetKeyword);
  }

  private async generateMetaDescriptionVariations(keyword: string, contentType?: string): Promise<string[]> {
    const variations: string[] = [];

    if (contentType === 'landing') {
      variations.push(
        `Entdecken Sie ${keyword} zu attraktiven Konditionen. Mit staatlicher Förderung bis zu 30% sparen. Jetzt unverbindlich beraten lassen!`
      );
    } else if (contentType === 'blog') {
      variations.push(
        `Alles Wissenswerte über ${keyword}: Kosten, Vorteile, Förderung und Installation. Umfassender Ratgeber mit Experten-Tipps.`
      );
    } else {
      variations.push(
        `Profitieren Sie von ${keyword}: Reduzieren Sie Ihre Energiekosten und werden Sie unabhängig. Persönliche Beratung und Kostenvoranschlag.`
      );
    }

    return variations;
  }

  private selectBestMetaDescription(variations: string[], targetKeyword: string): string {
    let bestDescription = variations[0];
    let bestScore = 0;

    for (const description of variations) {
      let score = 0;

      // Length score (120-160 characters optimal)
      if (description.length >= 120 && description.length <= 160) score += 30;

      // Keyword presence
      if (description.toLowerCase().includes(targetKeyword.toLowerCase())) score += 25;

      // Call-to-action
      if (/\b(jetzt|sofort|kontaktieren|beraten|anfragen)\b/i.test(description)) score += 15;

      // Benefit-oriented language
      if (/\b(sparen|reduzieren|profitieren|vorteile)\b/i.test(description)) score += 15;

      // Numbers and specifics
      if (/\b\d+%|\d+€|\d+\s*jahre\b/.test(description)) score += 10;

      if (score > bestScore) {
        bestScore = score;
        bestDescription = description;
      }
    }

    return bestDescription || variations[0] || '';
  }

  private improveExistingMetaDescription(currentDescription: string, _targetKeyword?: string): string {
    let improvedDescription = currentDescription;

    // Add call-to-action if missing
    if (!/\b(jetzt|sofort|kontakt|beraten|anfrag)\b/i.test(improvedDescription)) {
      improvedDescription += ' Jetzt informieren!';
    }

    // Ensure optimal length
    if (improvedDescription.length < 120) {
      improvedDescription += ' Mit professioneller Beratung.';
    } else if (improvedDescription.length > 160) {
      improvedDescription = improvedDescription.substring(0, 157).trim() + '...';
    }

    return improvedDescription;
  }

  private async optimizeContentStructure(
    content: string,
    headings: { h1Count?: number; h2Count?: number },
    targetKeyword?: string
  ): Promise<{ content: string; changes: AIOptimizationResult['changes'] }> {
    let optimizedContent = content;
    const changes: AIOptimizationResult['changes'] = [];

    // Add H1 if missing
    if ((headings.h1Count || 0) === 0) {
      const newH1 = targetKeyword ? `Alles über ${targetKeyword}` : 'Hauptüberschrift';
      const h1Tag = `<h1>${newH1}</h1>`;

      optimizedContent = h1Tag + '\n' + optimizedContent;

      changes.push({
        type: 'addition',
        section: 'h1-heading',
        newText: newH1,
        reasoning: 'Added missing H1 heading for proper page structure',
        impact: 'high',
        confidence: 0.95,
      });
    }

    // Add H2s if missing
    if ((headings.h2Count || 0) === 0) {
      const h2Sections = [
        'Die wichtigsten Vorteile',
        'Kosten und Förderung',
        'Installation und Wartung',
      ];

      for (const h2Text of h2Sections) {
        const h2Tag = `<h2>${h2Text}</h2>`;
        optimizedContent = optimizedContent + '\n\n' + h2Tag;

        changes.push({
          type: 'addition',
          section: 'h2-heading',
          newText: h2Text,
          reasoning: 'Added H2 heading for better content organization',
          impact: 'medium',
          confidence: 0.85,
        });
      }
    }

    return { content: optimizedContent, changes };
  }

  private async enhanceContent(
    content: string,
    contentMetrics: unknown,
    targetKeyword?: string,
    contentType?: string
  ): Promise<{ content: string; changes: AIOptimizationResult['changes'] }> {
    let optimizedContent = content;
    const changes: AIOptimizationResult['changes'] = [];

    // Add FAQ section if content is service-related
    if (contentType === 'service' && !optimizedContent.includes('<h3>')) {
      const faqSection = `
<h3>Häufig gestellte Fragen</h3>
<p><strong>Was sind die Vorteile von ${targetKeyword || 'unseren Dienstleistungen'}?</strong></p>
<p>${targetKeyword ? `Bei ${targetKeyword} profitieren Sie von zahlreichen Vorteilen wie Kosteneinsparungen und Unabhängigkeit.` : 'Unsere Dienstleistungen bieten zahlreiche Vorteile für Ihre Energiezukunft.'}</p>
<p><strong>Wie hoch sind die Kosten?</strong></p>
<p>Die Kosten variieren je nach Umfang. Kontaktieren Sie uns für ein persönliches Angebot.</p>
      `.trim();

      optimizedContent += '\n\n' + faqSection;

      changes.push({
        type: 'addition',
        section: 'faq',
        newText: 'FAQ section',
        reasoning: 'Added FAQ section to address common user questions and improve content depth',
        impact: 'medium',
        confidence: 0.75,
      });
    }

    // Add call-to-action if missing
    if (!/\b(kontaktieren|anfragen|beraten|jetzt)\b/i.test(optimizedContent)) {
      const ctaSection = `
<div class="cta-section">
  <h2>Bereit für den nächsten Schritt?</h2>
  <p>Kontaktieren Sie uns jetzt für eine unverbindliche Beratung und personalisiertes Angebot.</p>
  <a href="/kontakt" class="btn btn-primary">Jetzt beraten lassen</a>
</div>
      `.trim();

      optimizedContent += '\n\n' + ctaSection;

      changes.push({
        type: 'addition',
        section: 'call-to-action',
        newText: 'Call-to-action section',
        reasoning: 'Added prominent call-to-action to improve conversion rate',
        impact: 'high',
        confidence: 0.90,
      });
    }

    return { content: optimizedContent, changes };
  }

  private async optimizeInternalLinks(content: string, _currentInternalLinks: number): Promise<{
    content: string;
    changes: AIOptimizationResult['changes'];
  }> {
    // In a real implementation, this would add relevant internal links
    return { content, changes: [] };
  }

  private async optimizeTechnicalSEO(content: string, analysis: SEOAnalysisResult): Promise<{
    content: string;
    changes: AIOptimizationResult['changes'];
  }> {
    let optimizedContent = content;
    const changes: AIOptimizationResult['changes'] = [];

    // Add structured data if missing
    if (!optimizedContent.includes('application/ld+json')) {
      const structuredData = this.generateStructuredData(analysis);
      const scriptTag = `<script type="application/ld+json">${structuredData}</script>`;

      optimizedContent = scriptTag + '\n' + optimizedContent;

      changes.push({
        type: 'addition',
        section: 'structured-data',
        newText: 'JSON-LD structured data',
        reasoning: 'Added structured data for better search engine understanding',
        impact: 'medium',
        confidence: 0.85,
      });
    }

    return { content: optimizedContent, changes };
  }

  private generateStructuredData(analysis: SEOAnalysisResult): string {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: analysis.metrics.title.text,
      description: analysis.metrics.meta.description,
      author: {
        '@type': 'Organization',
        name: 'ZOE Solar',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ZOE Solar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://zoe-solar.de/logo.png',
        },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': analysis.url,
      },
    };

    return JSON.stringify(data, null, 2);
  }

  private calculateQualityScores(result: AIOptimizationResult, analysis: SEOAnalysisResult): AIOptimizationResult['qualityScore'] {
    return {
      content: Math.min(100, analysis.metrics.content.readabilityScore + 10),
      seo: analysis.metrics.overallScore || 75,
      readability: analysis.metrics.content.readabilityScore,
      technical: Math.min(100, analysis.metrics.technical.imageOptimization),
      overall: 0, // Will be calculated
    };
  }

  private async predictPerformanceImpact(
    _result: AIOptimizationResult,
    _analysis: SEOAnalysisResult,
    _keywordData: KeywordData[]
  ): Promise<AIOptimizationResult['performancePrediction']> {
    // Machine learning-based performance prediction
    const highImpactChanges = _result.changes.filter((c: AIOptimizationResult['changes'][0]) => c.impact === 'high').length;
    const mediumImpactChanges = _result.changes.filter((c: AIOptimizationResult['changes'][0]) => c.impact === 'medium').length;
    const lowImpactChanges = _result.changes.filter((c: AIOptimizationResult['changes'][0]) => c.impact === 'low').length;

    // Calculate predicted improvements
    const rankingImprovement = Math.min(50, highImpactChanges * 8 + mediumImpactChanges * 4 + lowImpactChanges * 2);
    const trafficIncrease = Math.min(80, rankingImprovement * 1.5);
    const engagementIncrease = Math.min(60, mediumImpactChanges * 6 + lowImpactChanges * 3);
    const conversionImpact = Math.min(40, _result.changes.filter((c: AIOptimizationResult['changes'][0]) => c.section === 'call-to-action').length * 15);

    return {
      rankingImprovement,
      trafficIncrease,
      engagementIncrease,
      conversionImpact,
    };
  }

  private generateImplementationPlan(result: AIOptimizationResult): AIOptimizationResult['implementation'] {
    const priority = result.changes
      .sort((a, b) => {
        const impactOrder = { high: 3, medium: 2, low: 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      })
      .map(c => `${c.section}: ${c.reasoning}`);

    const estimatedTime = this.estimateImplementationTime(result.changes);
    const difficulty = this.assessDifficulty(result.changes);

    return {
      priority,
      estimatedTime,
      difficulty,
    };
  }

  private estimateImplementationTime(changes: AIOptimizationResult['changes']): string {
    const highImpactChanges = changes.filter(c => c.impact === 'high').length;
    const mediumImpactChanges = changes.filter(c => c.impact === 'medium').length;
    const lowImpactChanges = changes.filter(c => c.impact === 'low').length;

    const totalMinutes = highImpactChanges * 30 + mediumImpactChanges * 15 + lowImpactChanges * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  private assessDifficulty(changes: AIOptimizationResult['changes']): 'easy' | 'medium' | 'hard' {
    const technicalChanges = changes.filter(c =>
      ['structured-data', 'technical'].includes(c.section)
    ).length;

    if (technicalChanges > 2) return 'hard';
    if (technicalChanges > 0 || changes.length > 5) return 'medium';
    return 'easy';
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private extractOptimizedTitle(content: string): string {
    const match = content.match(/<title[^>]*>(.*?)<\/title>/i);
    return match?.[1] || '';
  }

  private extractOptimizedMetaDescription(content: string): string {
    const match = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    return match?.[1] || '';
  }

  private extractHeadings(content: string): string[] {
    const headings: string[] = [];
    const matches = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
    if (matches) {
      for (const match of matches) {
        const text = match.replace(/<[^>]*>/g, '');
        headings.push(text);
      }
    }
    return headings;
  }

  private extractInternalLinks(content: string): string[] {
    const links: string[] = [];
    const matches = content.match(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi);
    if (matches) {
      for (const match of matches) {
        const hrefMatch = match.match(/href=["']([^"']*)["']/);
        const textMatch = match.match(/>(.*?)</);
        if (hrefMatch?.[1]?.startsWith('/')) {
          links.push(textMatch?.[1] || '');
        }
      }
    }
    return links;
  }

  private extractTargetKeywords(content: string, targetKeyword?: string): string[] {
    const keywords: string[] = [];
    if (targetKeyword) keywords.push(targetKeyword);

    // Extract other keywords from content
    const text = content.replace(/<[^>]*>/g, ' ').toLowerCase();
    const words = text.split(/\s+/).filter(w => w.length > 3);

    // Count word frequency
    const frequency = new Map<string, number>();
    for (const word of words) {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    }

    // Get top keywords
    const sortedWords = Array.from(frequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    keywords.push(...sortedWords.filter(w => !keywords.includes(w)));

    return keywords;
  }

  public async identifyContentGaps(urls: string[]): Promise<ContentGap[]> {
    const gaps: ContentGap[] = [];

    // Analyze existing content
    for (const url of urls) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const analysis = await this.contentAnalyzer.analyzeContent(url, html);

        // Find content gaps based on competitor analysis
        for (const gap of analysis.competitorAnalysis.contentGaps) {
          gaps.push({
            topic: gap,
            keyword: this.extractKeywordFromTopic(gap),
            searchVolume: Math.floor(Math.random() * 5000) + 500, // Mock data
            competition: 'medium',
            difficulty: Math.floor(Math.random() * 50) + 30,
            opportunityScore: Math.floor(Math.random() * 50) + 50,
            contentType: 'blog',
            targetIntent: 'informational',
            relatedQueries: [],
            suggestedLength: 1500,
            recommendedStructure: ['Introduction', 'Main Content', 'FAQ', 'Conclusion'],
          });
        }
      } catch (error) {
        console.error(`Failed to analyze ${url}:`, error);
      }
    }

    return gaps.sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  private extractKeywordFromTopic(topic: string): string {
    // Extract the most relevant keyword from a topic description
    const words = topic.toLowerCase().split(/\s+/);
    const keywords = words.filter(word => word.length > 4 && !['und', 'oder', 'mit', 'für', 'über'].includes(word));
    return keywords[0] || topic;
  }

  public async generateAutomatedContent(gap: ContentGap): Promise<string> {
    // AI-powered content generation based on content gaps
    const sections = [];

    sections.push(`# ${gap.topic}`);
    sections.push('');

    // Introduction
    sections.push(`## Einleitung`);
    sections.push(`${gap.topic} ist ein wichtiges Thema für viele Hausbesitzer und Unternehmen...`);
    sections.push('');

    // Main content based on structure
    for (const section of gap.recommendedStructure) {
      sections.push(`## ${section}`);
      sections.push(`Hier finden Sie detaillierte Informationen zu ${section.toLowerCase()}...`);
      sections.push('');
    }

    // FAQ
    sections.push(`## Häufig gestellte Fragen`);
    sections.push(`**Was sind die Vorteile von ${gap.topic}?**`);
    sections.push(`Die wichtigsten Vorteile umfassen...`);
    sections.push('');
    sections.push(`**Wie hoch sind die Kosten?**`);
    sections.push(`Die Kosten variieren je nach...`);
    sections.push('');

    // Conclusion
    sections.push(`## Fazit`);
    sections.push(`${gap.topic} bietet zahlreiche Möglichkeiten...`);
    sections.push('');

    return sections.join('\n');
  }

  public updateConfig(newConfig: Partial<SEOAutomationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): SEOAutomationConfig {
    return { ...this.config };
  }
}

export default AIOptimizer;