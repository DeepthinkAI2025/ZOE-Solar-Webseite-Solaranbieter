import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';
import { enterpriseCitationManagementService } from './enterpriseCitationManagementService';
import { multiLocationManagementService } from './multiLocationManagementService';

export interface CompetitorProfile {
  id: string;
  name: string;
  domain: string;
  locationKey: string;
  businessType: 'solar_installer' | 'energy_consultant' | 'construction' | 'other';
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  size: 'large' | 'medium' | 'small' | 'startup';
  founded: number;
  employeeCount: number;
  revenue: number;
  lastUpdated: string;
}

export interface CompetitorSEOProfile {
  competitorId: string;
  locationKey: string;
  overallScore: number;
  rankingStrength: {
    localPack: number;
    organic: number;
    gmb: number;
    total: number;
  };
  citationProfile: {
    totalCitations: number;
    consistentCitations: number;
    consistencyScore: number;
    topDirectories: Array<{
      name: string;
      url: string;
      status: 'active' | 'outdated' | 'missing';
    }>;
  };
  contentProfile: {
    totalPages: number;
    localContentPages: number;
    blogPosts: number;
    caseStudies: number;
    contentQuality: number;
    contentFreshness: number;
  };
  gmbProfile: {
    rating: number;
    reviewCount: number;
    responseRate: number;
    photos: number;
    posts: number;
    insights: {
      views: number;
      searches: number;
      actions: number;
    };
  };
  backlinkProfile: {
    totalBacklinks: number;
    localBacklinks: number;
    domainAuthority: number;
    referringDomains: number;
    topBacklinks: Array<{
      url: string;
      anchor: string;
      da: number;
    }>;
  };
  socialProfile: {
    platforms: Array<{
      platform: string;
      followers: number;
      engagement: number;
      localMentions: number;
    }>;
    overallSocialScore: number;
  };
  keywordProfile: {
    totalKeywords: number;
    rankingKeywords: number;
    topKeywords: Array<{
      keyword: string;
      position: number;
      volume: number;
      difficulty: number;
    }>;
    keywordGaps: string[];
  };
  lastAnalyzed: string;
}

export interface CompetitorStrategy {
  competitorId: string;
  locationKey: string;
  primaryStrategy: 'aggressive' | 'defensive' | 'niche' | 'disruptive';
  contentStrategy: {
    focus: 'educational' | 'promotional' | 'transactional' | 'mixed';
    frequency: 'high' | 'medium' | 'low';
    topics: string[];
    strengths: string[];
    weaknesses: string[];
  };
  citationStrategy: {
    approach: 'comprehensive' | 'selective' | 'automated';
    quality: 'high' | 'medium' | 'low';
    coverage: number;
    uniqueAngles: string[];
  };
  gmbStrategy: {
    activity: 'high' | 'medium' | 'low';
    reviewManagement: 'proactive' | 'reactive' | 'passive';
    postFrequency: 'daily' | 'weekly' | 'monthly' | 'rare';
    photoStrategy: 'comprehensive' | 'minimal' | 'none';
  };
  backlinkStrategy: {
    approach: 'aggressive' | 'organic' | 'mixed';
    quality: 'high' | 'medium' | 'low';
    localFocus: 'high' | 'medium' | 'low';
    partnerships: string[];
  };
  identifiedAt: string;
}

export interface CompetitiveGap {
  id: string;
  locationKey: string;
  competitorId: string;
  gapType: 'citation' | 'content' | 'gmb' | 'backlink' | 'keyword' | 'social';
  description: string;
  severity: 'critical' | 'major' | 'minor';
  opportunityScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedImpact: number;
  recommendedActions: string[];
  timeframe: 'immediate' | 'short_term' | 'long_term';
  createdAt: string;
}

export interface MarketIntelligence {
  locationKey: string;
  marketSize: number;
  growthRate: number;
  competitionDensity: 'low' | 'medium' | 'high' | 'saturated';
  entryBarriers: 'low' | 'medium' | 'high';
  keyPlayers: string[];
  emergingThreats: Array<{
    threat: string;
    impact: number;
    probability: number;
    timeframe: string;
  }>;
  marketTrends: Array<{
    trend: string;
    impact: 'positive' | 'negative' | 'neutral';
    adoption: 'early' | 'mainstream' | 'declining';
  }>;
  opportunities: Array<{
    opportunity: string;
    potential: number;
    competition: 'low' | 'medium' | 'high';
    feasibility: 'high' | 'medium' | 'low';
  }>;
  lastUpdated: string;
}

export interface CompetitiveBenchmark {
  locationKey: string;
  metric: string;
  ourPerformance: number;
  industryAverage: number;
  topCompetitor: number;
  percentile: number;
  trend: 'improving' | 'stable' | 'declining';
  gapToLeader: number;
  recommendedTarget: number;
  lastUpdated: string;
}

/**
 * Competitor Local SEO Analysis Service
 * Umfassende Analyse der lokalen SEO-Strategien von Wettbewerbern
 */
export class CompetitorLocalSEOAnalysisService {
  private competitorProfiles: Map<string, CompetitorProfile> = new Map();
  private seoProfiles: Map<string, CompetitorSEOProfile> = new Map();
  private strategies: Map<string, CompetitorStrategy> = new Map();
  private gaps: Map<string, CompetitiveGap[]> = new Map();
  private marketIntelligence: Map<string, MarketIntelligence> = new Map();
  private benchmarks: Map<string, CompetitiveBenchmark[]> = new Map();

  constructor() {
    this.initializeCompetitorProfiles();
    this.generateInitialSEOProfiles();
    this.analyzeCompetitorStrategies();
    this.identifyCompetitiveGaps();
    this.generateMarketIntelligence();
    this.createBenchmarks();
  }

  /**
   * Initialisiert Wettbewerber-Profile
   */
  private initializeCompetitorProfiles(): void {
    const competitors: CompetitorProfile[] = [
      {
        id: 'comp_001',
        name: 'SolarTech Berlin GmbH',
        domain: 'solartech-berlin.de',
        locationKey: 'berlin',
        businessType: 'solar_installer',
        marketPosition: 'leader',
        size: 'large',
        founded: 2010,
        employeeCount: 150,
        revenue: 25000000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'comp_002',
        name: 'GreenEnergy Hamburg',
        domain: 'greenenergy-hh.de',
        locationKey: 'hamburg',
        businessType: 'solar_installer',
        marketPosition: 'challenger',
        size: 'medium',
        founded: 2015,
        employeeCount: 80,
        revenue: 12000000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'comp_003',
        name: 'PV München Pro',
        domain: 'pv-muenchen-pro.de',
        locationKey: 'muenchen',
        businessType: 'solar_installer',
        marketPosition: 'follower',
        size: 'medium',
        founded: 2012,
        employeeCount: 60,
        revenue: 8000000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'comp_004',
        name: 'EcoSolar Köln',
        domain: 'ecosolar-koeln.com',
        locationKey: 'koeln',
        businessType: 'energy_consultant',
        marketPosition: 'niche',
        size: 'small',
        founded: 2018,
        employeeCount: 25,
        revenue: 3000000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'comp_005',
        name: 'SunPower Frankfurt',
        domain: 'sunpower-frankfurt.de',
        locationKey: 'frankfurt',
        businessType: 'solar_installer',
        marketPosition: 'challenger',
        size: 'medium',
        founded: 2014,
        employeeCount: 70,
        revenue: 10000000,
        lastUpdated: new Date().toISOString()
      }
    ];

    competitors.forEach(competitor => {
      this.competitorProfiles.set(competitor.id, competitor);
    });
  }

  /**
   * Generiert initiale SEO-Profile für Wettbewerber
   */
  private generateInitialSEOProfiles(): void {
    Array.from(this.competitorProfiles.values()).forEach(competitor => {
      const seoProfile: CompetitorSEOProfile = {
        competitorId: competitor.id,
        locationKey: competitor.locationKey,
        overallScore: this.calculateOverallScore(competitor),
        rankingStrength: this.generateRankingStrength(competitor),
        citationProfile: this.generateCitationProfile(competitor),
        contentProfile: this.generateContentProfile(competitor),
        gmbProfile: this.generateGMBProfile(competitor),
        backlinkProfile: this.generateBacklinkProfile(competitor),
        socialProfile: this.generateSocialProfile(competitor),
        keywordProfile: this.generateKeywordProfile(competitor),
        lastAnalyzed: new Date().toISOString()
      };

      this.seoProfiles.set(`${competitor.id}_${competitor.locationKey}`, seoProfile);
    });
  }

  /**
   * Berechnet Gesamtscore für Wettbewerber
   */
  private calculateOverallScore(competitor: CompetitorProfile): number {
    const baseScore = 50;

    // Größe und Marktposition berücksichtigen
    const sizeMultiplier = competitor.size === 'large' ? 1.5 :
                          competitor.size === 'medium' ? 1.2 : 1.0;
    const positionMultiplier = competitor.marketPosition === 'leader' ? 1.4 :
                              competitor.marketPosition === 'challenger' ? 1.2 :
                              competitor.marketPosition === 'follower' ? 1.0 : 0.8;

    // Alter des Unternehmens
    const ageBonus = Math.min(1.3, 1 + ((new Date().getFullYear() - competitor.founded) * 0.02));

    return Math.round(baseScore * sizeMultiplier * positionMultiplier * ageBonus);
  }

  /**
   * Generiert Ranking-Stärke
   */
  private generateRankingStrength(competitor: CompetitorProfile): CompetitorSEOProfile['rankingStrength'] {
    const baseLocalPack = competitor.marketPosition === 'leader' ? 85 :
                         competitor.marketPosition === 'challenger' ? 75 : 65;
    const baseOrganic = competitor.size === 'large' ? 80 :
                       competitor.size === 'medium' ? 70 : 60;
    const baseGMB = 70 + Math.random() * 20;

    const localPack = Math.round(baseLocalPack + (Math.random() - 0.5) * 10);
    const organic = Math.round(baseOrganic + (Math.random() - 0.5) * 10);
    const gmb = Math.round(baseGMB);

    return {
      localPack: Math.max(0, Math.min(100, localPack)),
      organic: Math.max(0, Math.min(100, organic)),
      gmb: Math.max(0, Math.min(100, gmb)),
      total: Math.round((localPack * 0.4 + organic * 0.4 + gmb * 0.2))
    };
  }

  /**
   * Generiert Citation-Profil
   */
  private generateCitationProfile(competitor: CompetitorProfile): CompetitorSEOProfile['citationProfile'] {
    const totalCitations = competitor.size === 'large' ? 150 + Math.floor(Math.random() * 50) :
                          competitor.size === 'medium' ? 80 + Math.floor(Math.random() * 40) :
                          30 + Math.floor(Math.random() * 30);

    const consistencyScore = 70 + Math.random() * 25;
    const consistentCitations = Math.round(totalCitations * (consistencyScore / 100));

    const directories = [
      { name: 'Google My Business', url: 'https://www.google.com/business/', status: 'active' as const },
      { name: 'Yelp', url: 'https://www.yelp.com/', status: 'active' as const },
      { name: 'Yellow Pages', url: 'https://www.yellowpages.com/', status: 'active' as const },
      { name: 'Bing Places', url: 'https://www.bingplaces.com/', status: 'active' as const },
      { name: 'Apple Maps', url: 'https://maps.apple.com/', status: 'active' as const }
    ];

    return {
      totalCitations,
      consistentCitations,
      consistencyScore: Math.round(consistencyScore),
      topDirectories: directories
    };
  }

  /**
   * Generiert Content-Profil
   */
  private generateContentProfile(competitor: CompetitorProfile): CompetitorSEOProfile['contentProfile'] {
    const totalPages = competitor.size === 'large' ? 200 + Math.floor(Math.random() * 100) :
                      competitor.size === 'medium' ? 100 + Math.floor(Math.random() * 50) :
                      30 + Math.floor(Math.random() * 30);

    const localContentPages = Math.round(totalPages * 0.6);
    const blogPosts = competitor.size === 'large' ? 50 + Math.floor(Math.random() * 30) :
                     competitor.size === 'medium' ? 20 + Math.floor(Math.random() * 20) :
                     5 + Math.floor(Math.random() * 10);

    return {
      totalPages,
      localContentPages,
      blogPosts,
      caseStudies: Math.floor(blogPosts * 0.3),
      contentQuality: 60 + Math.floor(Math.random() * 30),
      contentFreshness: 70 + Math.floor(Math.random() * 25)
    };
  }

  /**
   * Generiert GMB-Profil
   */
  private generateGMBProfile(competitor: CompetitorProfile): CompetitorSEOProfile['gmbProfile'] {
    const rating = 3.5 + Math.random() * 1.5;
    const reviewCount = competitor.size === 'large' ? 200 + Math.floor(Math.random() * 300) :
                       competitor.size === 'medium' ? 100 + Math.floor(Math.random() * 150) :
                       20 + Math.floor(Math.random() * 50);

    return {
      rating: Math.round(rating * 10) / 10,
      reviewCount,
      responseRate: 60 + Math.floor(Math.random() * 35),
      photos: 50 + Math.floor(Math.random() * 100),
      posts: 10 + Math.floor(Math.random() * 20),
      insights: {
        views: 1000 + Math.floor(Math.random() * 5000),
        searches: 500 + Math.floor(Math.random() * 2000),
        actions: 50 + Math.floor(Math.random() * 200)
      }
    };
  }

  /**
   * Generiert Backlink-Profil
   */
  private generateBacklinkProfile(competitor: CompetitorProfile): CompetitorSEOProfile['backlinkProfile'] {
    const totalBacklinks = competitor.size === 'large' ? 5000 + Math.floor(Math.random() * 5000) :
                          competitor.size === 'medium' ? 1000 + Math.floor(Math.random() * 2000) :
                          200 + Math.floor(Math.random() * 300);

    const localBacklinks = Math.round(totalBacklinks * 0.3);
    const domainAuthority = 30 + Math.floor(Math.random() * 40);
    const referringDomains = Math.round(totalBacklinks * 0.1);

    return {
      totalBacklinks,
      localBacklinks,
      domainAuthority,
      referringDomains,
      topBacklinks: [
        { url: 'https://www.solarverband.de/mitglieder', anchor: competitor.name, da: 75 },
        { url: 'https://www.energiewende.de/unternehmen', anchor: 'Solaranlagen', da: 65 },
        { url: 'https://www.pv-magazine.de/marktuebersicht', anchor: competitor.name, da: 55 }
      ]
    };
  }

  /**
   * Generiert Social-Media-Profil
   */
  private generateSocialProfile(competitor: CompetitorProfile): CompetitorSEOProfile['socialProfile'] {
    const platforms = [
      {
        platform: 'Facebook',
        followers: competitor.size === 'large' ? 5000 + Math.floor(Math.random() * 5000) :
                   competitor.size === 'medium' ? 1000 + Math.floor(Math.random() * 2000) : 200 + Math.floor(Math.random() * 300),
        engagement: 2.5 + Math.random() * 2.5,
        localMentions: 50 + Math.floor(Math.random() * 100)
      },
      {
        platform: 'LinkedIn',
        followers: competitor.size === 'large' ? 2000 + Math.floor(Math.random() * 3000) :
                   competitor.size === 'medium' ? 500 + Math.floor(Math.random() * 1000) : 100 + Math.floor(Math.random() * 200),
        engagement: 1.5 + Math.random() * 2.0,
        localMentions: 20 + Math.floor(Math.random() * 50)
      }
    ];

    const overallSocialScore = platforms.reduce((sum, p) => sum + (p.followers * p.engagement / 100), 0) / platforms.length;

    return {
      platforms,
      overallSocialScore: Math.round(overallSocialScore)
    };
  }

  /**
   * Generiert Keyword-Profil
   */
  private generateKeywordProfile(competitor: CompetitorProfile): CompetitorSEOProfile['keywordProfile'] {
    const totalKeywords = competitor.size === 'large' ? 500 + Math.floor(Math.random() * 500) :
                         competitor.size === 'medium' ? 200 + Math.floor(Math.random() * 300) :
                         50 + Math.floor(Math.random() * 100);

    const rankingKeywords = Math.round(totalKeywords * 0.7);

    const topKeywords = [
      { keyword: `solaranlage ${competitor.locationKey}`, position: 1 + Math.floor(Math.random() * 3), volume: 1000, difficulty: 45 },
      { keyword: `photovoltaik ${competitor.locationKey}`, position: 1 + Math.floor(Math.random() * 5), volume: 800, difficulty: 50 },
      { keyword: `pv installation ${competitor.locationKey}`, position: 2 + Math.floor(Math.random() * 4), volume: 600, difficulty: 55 }
    ];

    return {
      totalKeywords,
      rankingKeywords,
      topKeywords,
      keywordGaps: [
        `solaranlage wartung ${competitor.locationKey}`,
        `gewerbe solar ${competitor.locationKey}`,
        `solar finanzierung ${competitor.locationKey}`
      ]
    };
  }

  /**
   * Analysiert Wettbewerber-Strategien
   */
  private analyzeCompetitorStrategies(): void {
    Array.from(this.competitorProfiles.values()).forEach(competitor => {
      const seoProfile = this.seoProfiles.get(`${competitor.id}_${competitor.locationKey}`);
      if (!seoProfile) return;

      const strategy: CompetitorStrategy = {
        competitorId: competitor.id,
        locationKey: competitor.locationKey,
        primaryStrategy: this.determinePrimaryStrategy(competitor, seoProfile),
        contentStrategy: this.analyzeContentStrategy(seoProfile),
        citationStrategy: this.analyzeCitationStrategy(seoProfile),
        gmbStrategy: this.analyzeGMBStrategy(seoProfile),
        backlinkStrategy: this.analyzeBacklinkStrategy(seoProfile),
        identifiedAt: new Date().toISOString()
      };

      this.strategies.set(`${competitor.id}_${competitor.locationKey}`, strategy);
    });
  }

  /**
   * Bestimmt primäre Strategie
   */
  private determinePrimaryStrategy(competitor: CompetitorProfile, seoProfile: CompetitorSEOProfile): CompetitorStrategy['primaryStrategy'] {
    if (seoProfile.rankingStrength.total > 80) return 'aggressive';
    if (competitor.marketPosition === 'leader') return 'defensive';
    if (competitor.businessType === 'energy_consultant') return 'niche';
    return 'disruptive';
  }

  /**
   * Analysiert Content-Strategie
   */
  private analyzeContentStrategy(seoProfile: CompetitorSEOProfile): CompetitorStrategy['contentStrategy'] {
    const focus = seoProfile.contentProfile.blogPosts > 30 ? 'educational' :
                 seoProfile.contentProfile.caseStudies > 10 ? 'promotional' : 'mixed';

    const frequency = seoProfile.contentProfile.contentFreshness > 80 ? 'high' :
                     seoProfile.contentProfile.contentFreshness > 60 ? 'medium' : 'low';

    return {
      focus,
      frequency,
      topics: ['Solaranlagen', 'Photovoltaik', 'Energieeffizienz', 'Fördermittel'],
      strengths: ['Lokaler Fokus', 'Technische Tiefe'],
      weaknesses: ['Seltene Updates', 'Wenig Multimedia']
    };
  }

  /**
   * Analysiert Citation-Strategie
   */
  private analyzeCitationStrategy(seoProfile: CompetitorSEOProfile): CompetitorStrategy['citationStrategy'] {
    const approach = seoProfile.citationProfile.totalCitations > 100 ? 'comprehensive' :
                    seoProfile.citationProfile.consistencyScore > 80 ? 'selective' : 'automated';

    const quality = seoProfile.citationProfile.consistencyScore > 85 ? 'high' :
                   seoProfile.citationProfile.consistencyScore > 70 ? 'medium' : 'low';

    return {
      approach,
      quality,
      coverage: seoProfile.citationProfile.consistencyScore,
      uniqueAngles: ['Branchenverbände', 'Lokale Netzwerke']
    };
  }

  /**
   * Analysiert GMB-Strategie
   */
  private analyzeGMBStrategy(seoProfile: CompetitorSEOProfile): CompetitorStrategy['gmbStrategy'] {
    const activity = seoProfile.gmbProfile.posts > 15 ? 'high' :
                    seoProfile.gmbProfile.posts > 5 ? 'medium' : 'low';

    const reviewManagement = seoProfile.gmbProfile.responseRate > 80 ? 'proactive' :
                            seoProfile.gmbProfile.responseRate > 50 ? 'reactive' : 'passive';

    const postFrequency = seoProfile.gmbProfile.posts > 20 ? 'daily' :
                         seoProfile.gmbProfile.posts > 10 ? 'weekly' : 'monthly';

    return {
      activity,
      reviewManagement,
      postFrequency,
      photoStrategy: seoProfile.gmbProfile.photos > 50 ? 'comprehensive' : 'minimal'
    };
  }

  /**
   * Analysiert Backlink-Strategie
   */
  private analyzeBacklinkStrategy(seoProfile: CompetitorSEOProfile): CompetitorStrategy['backlinkStrategy'] {
    const approach = seoProfile.backlinkProfile.totalBacklinks > 3000 ? 'aggressive' :
                    seoProfile.backlinkProfile.domainAuthority > 50 ? 'organic' : 'mixed';

    const quality = seoProfile.backlinkProfile.domainAuthority > 60 ? 'high' :
                   seoProfile.backlinkProfile.domainAuthority > 40 ? 'medium' : 'low';

    const localFocus = seoProfile.backlinkProfile.localBacklinks / seoProfile.backlinkProfile.totalBacklinks > 0.4 ? 'high' :
                      seoProfile.backlinkProfile.localBacklinks / seoProfile.backlinkProfile.totalBacklinks > 0.2 ? 'medium' : 'low';

    return {
      approach,
      quality,
      localFocus,
      partnerships: ['Solarverband', 'Energieagenturen']
    };
  }

  /**
   * Identifiziert wettbewerbliche Lücken
   */
  private identifyCompetitiveGaps(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const gaps: CompetitiveGap[] = [];

      // Vergleiche mit unseren eigenen Metriken
      const ourCitationScore = enterpriseCitationManagementService.getCitationAudit(locationKey)?.overallScore || 70;
      const ourContentScore = 75; // Beispielwert
      const ourGMBScore = 80; // Beispielwert

      Array.from(this.seoProfiles.values())
        .filter(profile => profile.locationKey === locationKey)
        .forEach(profile => {
          const competitor = this.competitorProfiles.get(profile.competitorId);
          if (!competitor) return;

          // Citation Lücken
          if (profile.citationProfile.consistencyScore > ourCitationScore + 10) {
            gaps.push({
              id: `gap_${profile.competitorId}_citation_${Date.now()}`,
              locationKey,
              competitorId: profile.competitorId,
              gapType: 'citation',
              description: `${competitor.name} hat deutlich bessere Citation-Konsistenz`,
              severity: profile.citationProfile.consistencyScore > ourCitationScore + 20 ? 'critical' : 'major',
              opportunityScore: Math.min(100, profile.citationProfile.consistencyScore - ourCitationScore),
              difficulty: 'medium',
              estimatedImpact: 15,
              recommendedActions: [
                'Citation-Audit durchführen',
                'Fehlende Citations hinzufügen',
                'NAP-Konsistenz verbessern'
              ],
              timeframe: 'short_term',
              createdAt: new Date().toISOString()
            });
          }

          // Content Lücken
          if (profile.contentProfile.contentQuality > ourContentScore + 10) {
            gaps.push({
              id: `gap_${profile.competitorId}_content_${Date.now()}`,
              locationKey,
              competitorId: profile.competitorId,
              gapType: 'content',
              description: `${competitor.name} hat qualitativ hochwertigeren Content`,
              severity: 'major',
              opportunityScore: profile.contentProfile.contentQuality - ourContentScore,
              difficulty: 'high',
              estimatedImpact: 20,
              recommendedActions: [
                'Content-Audit durchführen',
                'Content-Qualität verbessern',
                'Mehr lokale Inhalte erstellen'
              ],
              timeframe: 'short_term',
              createdAt: new Date().toISOString()
            });
          }

          // GMB Lücken
          if (profile.gmbProfile.rating > 4.2 && ourGMBScore < 85) {
            gaps.push({
              id: `gap_${profile.competitorId}_gmb_${Date.now()}`,
              locationKey,
              competitorId: profile.competitorId,
              gapType: 'gmb',
              description: `${competitor.name} hat bessere GMB-Bewertungen`,
              severity: 'major',
              opportunityScore: 80,
              difficulty: 'medium',
              estimatedImpact: 12,
              recommendedActions: [
                'Kundenfeedback einholen',
                'Bewertungsaufforderungen versenden',
                'Schnell auf Bewertungen antworten'
              ],
              timeframe: 'immediate',
              createdAt: new Date().toISOString()
            });
          }
        });

      this.gaps.set(locationKey, gaps);
    });
  }

  /**
   * Generiert Markt-Intelligence
   */
  private generateMarketIntelligence(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const competitors = Array.from(this.seoProfiles.values())
        .filter(profile => profile.locationKey === locationKey)
        .map(profile => this.competitorProfiles.get(profile.competitorId))
        .filter(Boolean) as CompetitorProfile[];

      const marketSize = region.population * 0.15; // 15% Marktpenetration
      const growthRate = 8 + Math.random() * 4; // 8-12% Wachstum

      const competitionDensity = competitors.length > 3 ? 'high' :
                                competitors.length > 1 ? 'medium' : 'low';

      const keyPlayers = competitors
        .filter(c => c.marketPosition === 'leader' || c.marketPosition === 'challenger')
        .map(c => c.name);

      const marketIntelligence: MarketIntelligence = {
        locationKey,
        marketSize,
        growthRate: Math.round(growthRate * 10) / 10,
        competitionDensity,
        entryBarriers: competitionDensity === 'high' ? 'high' : 'medium',
        keyPlayers,
        emergingThreats: [
          {
            threat: 'Neue Online-Plattformen für Solaranbieter',
            impact: 7,
            probability: 0.6,
            timeframe: '6-12 Monate'
          },
          {
            threat: 'Erhöhte Regulatorik für Solarinstallationen',
            impact: 8,
            probability: 0.4,
            timeframe: '12-18 Monate'
          }
        ],
        marketTrends: [
          {
            trend: 'Steigende Nachfrage nach Balkonkraftwerken',
            impact: 'positive',
            adoption: 'mainstream'
          },
          {
            trend: 'Digitalisierung der Kundenberatung',
            impact: 'positive',
            adoption: 'early'
          },
          {
            trend: 'Preiskonkurrenz durch asiatische Anbieter',
            impact: 'negative',
            adoption: 'early'
          }
        ],
        opportunities: [
          {
            opportunity: 'Lokale Energieberatung',
            potential: 85,
            competition: 'low',
            feasibility: 'high'
          },
          {
            opportunity: 'Schnellinstallation-Services',
            potential: 75,
            competition: 'medium',
            feasibility: 'high'
          },
          {
            opportunity: 'Nachhaltigkeitsberatung für Unternehmen',
            potential: 70,
            competition: 'medium',
            feasibility: 'medium'
          }
        ],
        lastUpdated: new Date().toISOString()
      };

      this.marketIntelligence.set(locationKey, marketIntelligence);
    });
  }

  /**
   * Erstellt Benchmarks
   */
  private createBenchmarks(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const competitors = Array.from(this.seoProfiles.values())
        .filter(profile => profile.locationKey === locationKey);

      const benchmarks: CompetitiveBenchmark[] = [
        {
          locationKey,
          metric: 'Citation Consistency',
          ourPerformance: enterpriseCitationManagementService.getCitationAudit(locationKey)?.overallScore || 75,
          industryAverage: competitors.reduce((sum, c) => sum + c.citationProfile.consistencyScore, 0) / competitors.length,
          topCompetitor: Math.max(...competitors.map(c => c.citationProfile.consistencyScore)),
          percentile: 65,
          trend: 'improving',
          gapToLeader: 10,
          recommendedTarget: 90,
          lastUpdated: new Date().toISOString()
        },
        {
          locationKey,
          metric: 'GMB Rating',
          ourPerformance: 4.2,
          industryAverage: competitors.reduce((sum, c) => sum + c.gmbProfile.rating, 0) / competitors.length,
          topCompetitor: Math.max(...competitors.map(c => c.gmbProfile.rating)),
          percentile: 70,
          trend: 'stable',
          gapToLeader: 0.3,
          recommendedTarget: 4.6,
          lastUpdated: new Date().toISOString()
        },
        {
          locationKey,
          metric: 'Content Quality',
          ourPerformance: 78,
          industryAverage: competitors.reduce((sum, c) => sum + c.contentProfile.contentQuality, 0) / competitors.length,
          topCompetitor: Math.max(...competitors.map(c => c.contentProfile.contentQuality)),
          percentile: 60,
          trend: 'improving',
          gapToLeader: 15,
          recommendedTarget: 85,
          lastUpdated: new Date().toISOString()
        }
      ];

      this.benchmarks.set(locationKey, benchmarks);
    });
  }

  /**
   * Wettbewerber-Profile abrufen
   */
  public getCompetitorProfiles(locationKey?: string): CompetitorProfile[] {
    const profiles = Array.from(this.competitorProfiles.values());
    return locationKey ? profiles.filter(p => p.locationKey === locationKey) : profiles;
  }

  /**
   * SEO-Profile für Wettbewerber abrufen
   */
  public getCompetitorSEOProfile(competitorId: string, locationKey: string): CompetitorSEOProfile | null {
    return this.seoProfiles.get(`${competitorId}_${locationKey}`) || null;
  }

  /**
   * Strategie für Wettbewerber abrufen
   */
  public getCompetitorStrategy(competitorId: string, locationKey: string): CompetitorStrategy | null {
    return this.strategies.get(`${competitorId}_${locationKey}`) || null;
  }

  /**
   * Wettbewerbliche Lücken für Standort abrufen
   */
  public getCompetitiveGaps(locationKey: string): CompetitiveGap[] {
    return this.gaps.get(locationKey) || [];
  }

  /**
   * Markt-Intelligence abrufen
   */
  public getMarketIntelligence(locationKey: string): MarketIntelligence | null {
    return this.marketIntelligence.get(locationKey) || null;
  }

  /**
   * Benchmarks für Standort abrufen
   */
  public getCompetitiveBenchmarks(locationKey: string): CompetitiveBenchmark[] {
    return this.benchmarks.get(locationKey) || [];
  }

  /**
   * Wettbewerbsanalyse für Standort durchführen
   */
  public performCompetitiveAnalysis(locationKey: string): {
    overview: {
      totalCompetitors: number;
      marketDensity: string;
      competitivePressure: 'low' | 'medium' | 'high';
      ourPosition: string;
    };
    keyInsights: string[];
    strategicRecommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      action: string;
      rationale: string;
      expectedImpact: number;
    }>;
    riskAssessment: {
      level: 'low' | 'medium' | 'high';
      factors: string[];
      mitigationStrategies: string[];
    };
  } {
    const competitors = this.getCompetitorProfiles(locationKey);
    const gaps = this.getCompetitiveGaps(locationKey);
    const intelligence = this.getMarketIntelligence(locationKey);
    const benchmarks = this.getCompetitiveBenchmarks(locationKey);

    const competitivePressure = competitors.length > 3 ? 'high' :
                               competitors.length > 1 ? 'medium' : 'low';

    const ourPosition = benchmarks.length > 0 ?
      benchmarks.reduce((sum, b) => sum + b.percentile, 0) / benchmarks.length > 60 ? 'strong' :
      benchmarks.reduce((sum, b) => sum + b.percentile, 0) / benchmarks.length > 40 ? 'moderate' : 'weak' : 'unknown';

    const keyInsights = [
      `${competitors.length} aktive Wettbewerber in ${locationKey}`,
      `Marktdichte: ${intelligence?.competitionDensity || 'unbekannt'}`,
      `Unsere Position: ${ourPosition}`,
      `${gaps.filter(g => g.severity === 'critical').length} kritische Lücken identifiziert`
    ];

    const strategicRecommendations = [
      {
        priority: 'high' as const,
        action: 'Citation-Konsistenz verbessern',
        rationale: 'Wettbewerber haben durchschnittlich bessere NAP-Konsistenz',
        expectedImpact: 15
      },
      {
        priority: 'high' as const,
        action: 'Lokalen Content ausbauen',
        rationale: 'Content-Qualität liegt unter Marktdurchschnitt',
        expectedImpact: 20
      },
      {
        priority: 'medium' as const,
        action: 'GMB-Optimierung intensivieren',
        rationale: 'Bewertungsmanagement kann verbessert werden',
        expectedImpact: 12
      }
    ];

    const riskFactors = gaps.filter(g => g.severity === 'critical').map(g => g.description);
    const riskLevel = riskFactors.length > 2 ? 'high' :
                     riskFactors.length > 0 ? 'medium' : 'low';

    return {
      overview: {
        totalCompetitors: competitors.length,
        marketDensity: intelligence?.competitionDensity || 'unknown',
        competitivePressure,
        ourPosition
      },
      keyInsights,
      strategicRecommendations,
      riskAssessment: {
        level: riskLevel,
        factors: riskFactors,
        mitigationStrategies: [
          'Regelmäßige Wettbewerbsanalysen durchführen',
          'Schnelle Reaktion auf neue Wettbewerber',
          'Differenzierungsstrategien entwickeln'
        ]
      }
    };
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalCompetitors: number;
    totalGaps: number;
    criticalGaps: number;
    marketIntelligence: number;
    topCompetitiveThreats: Array<{ location: string; threat: string; impact: number }>;
    competitiveStrengths: string[];
    competitiveWeaknesses: string[];
  } {
    const allCompetitors = Array.from(this.competitorProfiles.values());
    const allGaps = Array.from(this.gaps.values()).flat();
    const criticalGaps = allGaps.filter(g => g.severity === 'critical');

    const topThreats = allGaps
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 3)
      .map(gap => ({
        location: gap.locationKey,
        threat: gap.description,
        impact: gap.estimatedImpact
      }));

    return {
      totalCompetitors: allCompetitors.length,
      totalGaps: allGaps.length,
      criticalGaps: criticalGaps.length,
      marketIntelligence: this.marketIntelligence.size,
      topCompetitiveThreats: topThreats,
      competitiveStrengths: [
        'Umfassende Standortabdeckung',
        'Starke Markenpräsenz',
        'Technologische Überlegenheit'
      ],
      competitiveWeaknesses: [
        'Lokale Content-Tiefe',
        'Citation-Konsistenz',
        'GMB-Interaktion'
      ]
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const competitorLocalSEOAnalysisService = new CompetitorLocalSEOAnalysisService();