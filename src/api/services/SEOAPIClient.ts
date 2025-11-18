import APIClient from '../client/APIClient';
import { ApiResponse } from '../types/api.types';

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  cpc?: number;
  difficulty?: number;
  trend: 'up' | 'down' | 'stable';
  relatedKeywords?: string[];
}

export interface PageSEOData {
  url: string;
  title: string;
  description: string;
  h1?: string;
  h2?: string[];
  keywords: string[];
  wordCount: number;
  readabilityScore: number;
  internalLinks: number;
  externalLinks: number;
  images: number;
  imagesWithoutAlt: number;
  loadTime: number;
  mobileFriendly: boolean;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  lastIndexed?: Date;
}

export interface BacklinkData {
  domain: string;
  url: string;
  anchorText: string;
  domainAuthority: number;
  pageAuthority: number;
  relevanceScore: number;
  linkType: 'dofollow' | 'nofollow';
  date: Date;
}

export interface CompetitorData {
  domain: string;
  title: string;
  description: string;
  keywords: string[];
  backlinks: number;
  domainAuthority: number;
  trafficEstimate: number;
  topPages: Array<{
    url: string;
    traffic: number;
    keywords: number;
  }>;
}

export interface LocalSEOData {
  businessName: string;
  address: string;
  phone: string;
  website: string;
  category: string;
  reviews: {
    count: number;
    averageRating: number;
    recent: Array<{
      rating: number;
      text: string;
      date: Date;
      author: string;
    }>;
  };
  citations: number;
  localRankings: Array<{
    keyword: string;
    position: number;
    localPack?: boolean;
  }>;
  gmbInsights?: {
    views: number;
    clicks: number;
    calls: number;
    directions: number;
    websiteClicks: number;
  };
}

export interface ContentOptimization {
  url: string;
  targetKeyword: string;
  currentScore: number;
  recommendations: Array<{
    type: 'content' | 'technical' | 'meta' | 'structure';
    priority: 'high' | 'medium' | 'low';
    description: string;
    estimatedImpact: number;
    implementation?: string;
  }>;
  suggestedKeywords: string[];
  contentGaps: string[];
  competingPages: Array<{
    url: string;
    title: string;
    score: number;
  }>;
}

class SEOAPIClient {
  private apiClient: APIClient;

  constructor(apiKey: string, baseURL?: string) {
    this.apiClient = new APIClient({
      baseURL: baseURL || 'https://api.seo-service.com/v1',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      enableCache: true,
      cacheTTL: 3600000, // 1 hour for SEO data
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      interceptors: {
        response: [this.validateSEOData.bind(this)],
      },
    });
  }

  private validateSEOData(response: ApiResponse): ApiResponse {
    if (!response.success) {
      throw new Error(`SEO API Error: ${response.error?.message}`);
    }
    return response;
  }

  // Keyword Research
  public async getKeywordData(
    keywords: string[],
    language: string = 'de',
    location?: string
  ): Promise<KeywordData[]> {
    const response = await this.apiClient.post<KeywordData[]>(
      '/keywords/research',
      {
        keywords,
        language,
        location,
      },
      {
        cache: true,
        cacheTTL: 86400000, // 24 hours for keyword data
      }
    );

    return response.data!;
  }

  public async getKeywordSuggestions(
    seedKeyword: string,
    limit: number = 10
  ): Promise<string[]> {
    const response = await this.apiClient.post<string[]>(
      '/keywords/suggestions',
      {
        seedKeyword,
        limit,
      },
      {
        cache: true,
        cacheTTL: 3600000,
      }
    );

    return response.data!;
  }

  public async analyzeKeywordDifficulty(
    keyword: string,
    url?: string
  ): Promise<{ difficulty: number; factors: Record<string, number> }> {
    const response = await this.apiClient.post<{
      difficulty: number;
      factors: Record<string, number>;
    }>(
      '/keywords/difficulty',
      {
        keyword,
        url,
      },
      {
        cache: true,
        cacheTTL: 604800000, // 7 days
      }
    );

    return response.data!;
  }

  // Page Analysis
  public async analyzePage(url: string): Promise<PageSEOData> {
    const response = await this.apiClient.post<PageSEOData>(
      '/pages/analyze',
      { url },
      {
        cache: true,
        cacheTTL: 1800000, // 30 minutes
      }
    );

    return response.data!;
  }

  public async analyzePages(urls: string[]): Promise<PageSEOData[]> {
    const response = await this.apiClient.post<PageSEOData[]>(
      '/pages/bulk-analyze',
      { urls },
      {
        cache: true,
        cacheTTL: 1800000,
      }
    );

    return response.data!;
  }

  public async trackPageRankings(
    url: string,
    keywords: string[],
    location?: string
  ): Promise<Array<{ keyword: string; position: number; url: string; date: Date }>> {
    const response = await this.apiClient.post<Array<{
      keyword: string;
      position: number;
      url: string;
      date: Date;
    }>>(
      '/rankings/track',
      {
        url,
        keywords,
        location,
      }
    );

    return response.data!;
  }

  // Backlink Analysis
  public async getBacklinks(
    domain: string,
    limit: number = 100
  ): Promise<BacklinkData[]> {
    const response = await this.apiClient.post<BacklinkData[]>(
      '/backlinks/analyze',
      {
        domain,
        limit,
      },
      {
        cache: true,
        cacheTTL: 3600000,
      }
    );

    return response.data!;
  }

  public async getNewBacklinks(
    domain: string,
    since: Date
  ): Promise<BacklinkData[]> {
    const response = await this.apiClient.post<BacklinkData[]>(
      '/backlinks/new',
      {
        domain,
        since: since.toISOString(),
      },
      {
        cache: false, // Don't cache new backlinks
      }
    );

    return response.data!;
  }

  public async analyzeLinkProfile(domain: string): Promise<{
    totalBacklinks: number;
    domainAuthority: number;
    referringDomains: number;
    topAnchorTexts: Array<{ text: string; count: number; percentage: number }>;
    linkGrowth: Array<{ date: string; links: number }>;
  }> {
    const response = await this.apiClient.post<{
      totalBacklinks: number;
      domainAuthority: number;
      referringDomains: number;
      topAnchorTexts: Array<{ text: string; count: number; percentage: number }>;
      linkGrowth: Array<{ date: string; links: number }>;
    }>(
      '/backlinks/profile',
      { domain },
      {
        cache: true,
        cacheTTL: 3600000,
      }
    );

    return response.data!;
  }

  // Competitor Analysis
  public async analyzeCompetitors(competitors: string[]): Promise<CompetitorData[]> {
    const response = await this.apiClient.post<CompetitorData[]>(
      '/competitors/analyze',
      { competitors },
      {
        cache: true,
        cacheTTL: 3600000,
      }
    );

    return response.data!;
  }

  public async findCompetitors(
    domain: string,
    keywords?: string[]
  ): Promise<CompetitorData[]> {
    const response = await this.apiClient.post<CompetitorData[]>(
      '/competitors/find',
      {
        domain,
        keywords,
      },
      {
        cache: true,
        cacheTTL: 86400000,
      }
    );

    return response.data!;
  }

  // Local SEO
  public async analyzeLocalSEO(
    businessName: string,
    location: string
  ): Promise<LocalSEOData> {
    const response = await this.apiClient.post<LocalSEOData>(
      '/local/analyze',
      {
        businessName,
        location,
      },
      {
        cache: true,
        cacheTTL: 1800000,
      }
    );

    return response.data!;
  }

  public async trackLocalRankings(
    businessName: string,
    keywords: string[]
  ): Promise<Array<{
    keyword: string;
    position: number;
    localPack: boolean;
    date: Date;
  }>> {
    const response = await this.apiClient.post<Array<{
      keyword: string;
      position: number;
      localPack: boolean;
      date: Date;
    }>>(
      '/local/rankings',
      {
        businessName,
        keywords,
      }
    );

    return response.data!;
  }

  // Content Optimization
  public async optimizeContent(
    url: string,
    targetKeyword: string,
    competitorUrls?: string[]
  ): Promise<ContentOptimization> {
    const response = await this.apiClient.post<ContentOptimization>(
      '/content/optimize',
      {
        url,
        targetKeyword,
        competitorUrls,
      },
      {
        cache: true,
        cacheTTL: 1800000,
      }
    );

    return response.data!;
  }

  public async generateContentIdeas(
    topic: string,
    targetAudience: string,
    contentType: 'blog' | 'landing' | 'product' | 'service'
  ): Promise<Array<{
    title: string;
    description: string;
    targetKeyword: string;
    estimatedTraffic: number;
    difficulty: number;
  }>> {
    const response = await this.apiClient.post<Array<{
      title: string;
      description: string;
      targetKeyword: string;
      estimatedTraffic: number;
      difficulty: number;
    }>>(
      '/content/ideas',
      {
        topic,
        targetAudience,
        contentType,
      },
      {
        cache: true,
        cacheTTL: 3600000,
      }
    );

    return response.data!;
  }

  // Core Web Vitals
  public async getCoreWebVitals(
    urls: string[]
  ): Promise<Array<{
    url: string;
    lcp: number;
    fid: number;
    cls: number;
    score: number;
    timestamp: Date;
  }>> {
    const response = await this.apiClient.post<Array<{
      url: string;
      lcp: number;
      fid: number;
      cls: number;
      score: number;
      timestamp: Date;
    }>>(
      '/core-web-vitals',
      { urls },
      {
        cache: true,
        cacheTTL: 900000, // 15 minutes
      }
    );

    return response.data!;
  }

  // Health check
  public async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    const response = await this.apiClient.get<{ status: string; timestamp: Date }>(
      '/health',
      {},
      {
        cache: false,
      }
    );

    return response.data!;
  }

  public getRateLimitInfo() {
    return this.apiClient.getRateLimitInfo();
  }
}

export default SEOAPIClient;