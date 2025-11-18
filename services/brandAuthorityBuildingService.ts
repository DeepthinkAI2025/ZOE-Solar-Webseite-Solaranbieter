/**
 * Brand Authority Building Service für ZOE Solar
 * Systematischer Aufbau und Management der Markenautorität
 * 
 * Kernfunktionen:
 * - Social Proof Aggregation und Display
 * - Industry Recognition Tracking
 * - Competitor Analysis für Entity Strength
 * - Brand Mention Monitoring und Optimization
 * - Thought Leadership Development
 * - Content Authority Amplification
 */

import { entityKnowledgeGraphService, EntityRelationship, RelationshipType } from './entityKnowledgeGraphService';
import { eatSignalEnhancementService, EATSignal, EATSignalCategory, EATSignalType } from './eatSignalEnhancementService';

// Brand Authority Levels
export enum BrandAuthorityLevel {
  EMERGING = 'emerging',           // 0-25 Punkte
  ESTABLISHING = 'establishing',   // 26-50 Punkte
  RECOGNIZED = 'recognized',       // 51-75 Punkte
  AUTHORITATIVE = 'authoritative', // 76-90 Punkte
  DOMINANT = 'dominant'           // 91-100 Punkte
}

// Brand Signal Types
export enum BrandSignalType {
  // Brand Awareness Signale
  BRAND_SEARCH_VOLUME = 'brand_search_volume',
  DIRECT_TRAFFIC = 'direct_traffic',
  BRANDED_MENTIONS = 'branded_mentions',
  SOCIAL_MEDIA_FOLLOWERS = 'social_media_followers',
  
  // Brand Recognition Signale
  INDUSTRY_AWARDS = 'industry_awards',
  MEDIA_COVERAGE = 'media_coverage',
  EXPERT_CITATIONS = 'expert_citations',
  CONFERENCE_SPEAKING = 'conference_speaking',
  
  // Brand Trust Signale
  CUSTOMER_TESTIMONIALS = 'customer_testimonials',
  CASE_STUDIES = 'case_studies',
  THIRD_PARTY_ENDORSEMENTS = 'third_party_endorsements',
  CERTIFICATION_DISPLAYS = 'certification_displays',
  
  // Brand Leadership Signale
  THOUGHT_LEADERSHIP_CONTENT = 'thought_leadership_content',
  INDUSTRY_PARTNERSHIPS = 'industry_partnerships',
  INNOVATION_RECOGNITION = 'innovation_recognition',
  MARKET_SHARE_INDICATORS = 'market_share_indicators'
}

// Brand Mention Sentiment
export enum BrandMentionSentiment {
  VERY_POSITIVE = 'very_positive',
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  VERY_NEGATIVE = 'very_negative'
}

// Brand Signal Interface
export interface BrandSignal {
  id: string;
  type: BrandSignalType;
  title: string;
  description: string;
  value: string | number;
  source: string;
  url?: string;
  date: string;
  weight: number; // Gewichtung für Authority Score
  verificationStatus: 'verified' | 'pending' | 'unverified';
  impactScore: number; // 0-100
  metadata?: Record<string, any>;
}

// Brand Mention Interface
export interface BrandMention {
  id: string;
  source: string;
  sourceType: 'news' | 'blog' | 'social' | 'academic' | 'industry' | 'other';
  url: string;
  title: string;
  content: string;
  context: string; // Kontext der Erwähnung
  sentiment: BrandMentionSentiment;
  reach: number; // Geschätzte Reichweite
  authority: number; // Domain/Source Authority Score
  date: string;
  keywords: string[];
  entityMentioned: string[]; // Welche Entities wurden erwähnt
  isInfluencer: boolean;
  engagementMetrics?: {
    shares?: number;
    likes?: number;
    comments?: number;
    views?: number;
  };
  metadata?: Record<string, any>;
}

// Social Proof Element
export interface SocialProofElement {
  id: string;
  type: 'testimonial' | 'case_study' | 'award' | 'certification' | 'partnership' | 'statistic';
  title: string;
  description: string;
  source: string;
  sourceType: 'customer' | 'partner' | 'industry' | 'media' | 'certification_body';
  credibilityScore: number; // 0-100
  visualAssets?: {
    image?: string;
    video?: string;
    logo?: string;
  };
  metrics?: {
    impact?: string;
    savings?: string;
    improvement?: string;
    roi?: string;
  };
  date: string;
  featured: boolean; // Für Homepage/prominente Platzierung
  category: string[];
  relatedProjects?: string[];
  testimonialQuote?: string;
  customerProfile?: {
    company: string;
    industry: string;
    size: string;
    location: string;
    contactPerson?: string;
    jobTitle?: string;
  };
}

// Industry Recognition Element
export interface IndustryRecognition {
  id: string;
  type: 'award' | 'ranking' | 'certification' | 'membership' | 'partnership' | 'media_recognition';
  title: string;
  description: string;
  issuingOrganization: {
    name: string;
    authority: number; // 0-100
    url?: string;
    logo?: string;
  };
  category: string;
  date: string;
  expirationDate?: string;
  rank?: number; // Falls es ein Ranking ist
  totalParticipants?: number;
  recognitionLevel: 'local' | 'regional' | 'national' | 'international';
  credibilityScore: number; // 0-100
  media_coverage?: BrandMention[];
  certificate?: {
    url: string;
    verificationUrl?: string;
  };
  metadata?: Record<string, any>;
}

// Competitor Analysis Data
export interface CompetitorAnalysis {
  competitorId: string;
  competitorName: string;
  competitorUrl: string;
  analysisDate: string;
  
  // Authority Metriken
  authorityScore: number;
  domainAuthority: number;
  brandSearchVolume: number;
  socialMediaFollowers: number;
  
  // Content & E-A-T
  contentVolume: number;
  expertiseSignals: number;
  authoritySignals: number;
  trustSignals: number;
  
  // Market Position
  marketShare: number;
  customerReviews: {
    averageRating: number;
    totalReviews: number;
  };
  
  // Competitive Gaps & Opportunities
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  
  // Keyword Overlap
  sharedKeywords: {
    keyword: string;
    theirPosition: number;
    ourPosition: number;
    searchVolume: number;
  }[];
  
  metadata?: Record<string, any>;
}

// Brand Authority Score
export interface BrandAuthorityScore {
  overall: number;
  level: BrandAuthorityLevel;
  components: {
    awareness: number;
    recognition: number;
    trust: number;
    leadership: number;
  };
  trends: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  benchmarks: {
    industry_average: number;
    top_competitor: number;
    market_leader: number;
  };
  lastUpdated: string;
  nextMilestone: {
    level: BrandAuthorityLevel;
    requiredScore: number;
    gap: number;
    estimatedTimeToAchieve: string;
  };
}

// Thought Leadership Campaign
export interface ThoughtLeadershipCampaign {
  id: string;
  name: string;
  description: string;
  objective: string;
  startDate: string;
  endDate?: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  
  // Content Strategy
  contentPillars: string[];
  targetAudience: string[];
  keyMessages: string[];
  
  // Content Assets
  articles: {
    title: string;
    url: string;
    publishDate: string;
    engagement: number;
  }[];
  
  whitepapers: {
    title: string;
    url: string;
    downloads: number;
    citations: number;
  }[];
  
  presentations: {
    title: string;
    event: string;
    date: string;
    audience_size: number;
    recording_url?: string;
  }[];
  
  // Performance Metrics
  metrics: {
    contentViews: number;
    socialShares: number;
    mediaPickups: number;
    expertCitations: number;
    leadGeneration: number;
    brandMentions: number;
  };
  
  // ROI & Impact
  investmentEUR: number;
  brandAuthorityIncrease: number;
  leadValue: number;
  mediaValueEUR: number;
}

/**
 * Brand Authority Building Service
 * Systematischer Aufbau der Markenautorität durch Multiple Signale
 */
export class BrandAuthorityBuildingService {
  private brandSignals: Map<string, BrandSignal> = new Map();
  private brandMentions: Map<string, BrandMention> = new Map();
  private socialProofElements: Map<string, SocialProofElement> = new Map();
  private industryRecognitions: Map<string, IndustryRecognition> = new Map();
  private competitorAnalyses: Map<string, CompetitorAnalysis> = new Map();
  private thoughtLeadershipCampaigns: Map<string, ThoughtLeadershipCampaign> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string = 'https://www.zoe-solar.de') {
    this.baseUrl = baseUrl;
    this.initializeBrandSignals();
    this.initializeSocialProof();
    this.initializeIndustryRecognition();
    this.initializeThoughtLeadership();
  }

  /**
   * Initialisiert Brand Signale
   */
  private initializeBrandSignals(): void {
    const signals: BrandSignal[] = [
      {
        id: 'brand-search-volume-2024',
        type: BrandSignalType.BRAND_SEARCH_VOLUME,
        title: 'ZOE Solar Brand Search Volume',
        description: 'Monatliches Suchvolumen für Marken-Keywords',
        value: 8500,
        source: 'Google Keyword Planner',
        date: '2024-09-01',
        weight: 0.20,
        verificationStatus: 'verified',
        impactScore: 85,
        metadata: {
          keywords: ['ZOE Solar', 'ZOE Solaranlagen', 'ZOE Solar GmbH'],
          trend: '+25% YoY'
        }
      },
      {
        id: 'social-media-followers',
        type: BrandSignalType.SOCIAL_MEDIA_FOLLOWERS,
        title: 'Social Media Reichweite',
        description: 'Gesamtreichweite über alle Social Media Kanäle',
        value: 15000,
        source: 'Social Media Analytics',
        date: '2024-09-28',
        weight: 0.15,
        verificationStatus: 'verified',
        impactScore: 78,
        metadata: {
          platforms: {
            linkedin: 8500,
            youtube: 4200,
            xing: 2300
          },
          engagement_rate: 0.045
        }
      },
      {
        id: 'media-coverage-2024',
        type: BrandSignalType.MEDIA_COVERAGE,
        title: 'Medienberichterstattung 2024',
        description: 'Anzahl qualitativ hochwertiger Medienbeiträge',
        value: 23,
        source: 'Media Monitoring',
        date: '2024-09-28',
        weight: 0.25,
        verificationStatus: 'verified',
        impactScore: 92,
        metadata: {
          tier1_media: 8,
          tier2_media: 10,
          trade_media: 5,
          total_reach: 850000
        }
      },
      {
        id: 'thought-leadership-content',
        type: BrandSignalType.THOUGHT_LEADERSHIP_CONTENT,
        title: 'Thought Leadership Content 2024',
        description: 'Veröffentlichte Thought Leadership Inhalte',
        value: 45,
        source: 'Content Management System',
        date: '2024-09-28',
        weight: 0.20,
        verificationStatus: 'verified',
        impactScore: 88,
        metadata: {
          whitepapers: 3,
          expert_articles: 18,
          case_studies: 12,
          presentations: 12,
          total_views: 125000
        }
      }
    ];

    signals.forEach(signal => this.brandSignals.set(signal.id, signal));
  }

  /**
   * Initialisiert Social Proof Elemente
   */
  private initializeSocialProof(): void {
    const socialProofElements: SocialProofElement[] = [
      {
        id: 'testimonial-logistik-mueller',
        type: 'testimonial',
        title: 'Müller Logistik Testimonial',
        description: 'Kundenbewertung für 500 kWp Dachanlage',
        source: 'Müller Logistik GmbH',
        sourceType: 'customer',
        credibilityScore: 95,
        visualAssets: {
          image: `${this.baseUrl}/assets/testimonials/mueller-logistik.jpg`,
          logo: `${this.baseUrl}/assets/logos/clients/mueller-logistik.png`
        },
        metrics: {
          impact: '40% Stromkosteneinsparung',
          savings: '€85.000 jährlich',
          roi: '12 Jahre Amortisation'
        },
        date: '2024-07-15',
        featured: true,
        category: ['Logistik', 'Gewerbe'],
        testimonialQuote: 'ZOE Solar hat unser Dach in eine hochprofitable Energiequelle verwandelt. Die Beratung war erstklassig und die Umsetzung perfekt koordiniert.',
        customerProfile: {
          company: 'Müller Logistik GmbH',
          industry: 'Logistik & Transport',
          size: '250 Mitarbeiter',
          location: 'Hamburg',
          contactPerson: 'Thomas Müller',
          jobTitle: 'Geschäftsführer'
        }
      },
      {
        id: 'case-study-agri-pv-brandenburg',
        type: 'case_study',
        title: 'Agri-PV Pilotprojekt Brandenburg',
        description: 'Erste großskalige Agri-PV Anlage in Brandenburg',
        source: 'Landwirtschaftsbetrieb Schulze',
        sourceType: 'customer',
        credibilityScore: 92,
        visualAssets: {
          image: `${this.baseUrl}/assets/case-studies/agri-pv-brandenburg.jpg`,
          video: `${this.baseUrl}/assets/videos/agri-pv-success-story.mp4`
        },
        metrics: {
          impact: '2.1 MW Agri-PV System',
          improvement: '15% höhere Ernteerträge',
          roi: '8 Jahre Amortisation'
        },
        date: '2024-05-20',
        featured: true,
        category: ['Agri-PV', 'Landwirtschaft', 'Innovation'],
        relatedProjects: ['agri-pv-niedersachsen', 'agri-pv-bayern']
      },
      {
        id: 'award-top-pv-provider-2024',
        type: 'award',
        title: 'Top Photovoltaik-Anbieter 2024',
        description: 'Auszeichnung vom Photovoltaik Magazin',
        source: 'Photovoltaik Magazin',
        sourceType: 'industry',
        credibilityScore: 98,
        visualAssets: {
          image: `${this.baseUrl}/assets/awards/pv-magazin-award-2024.jpg`
        },
        date: '2024-06-15',
        featured: true,
        category: ['Award', 'Industry Recognition']
      }
    ];

    socialProofElements.forEach(element => this.socialProofElements.set(element.id, element));
  }

  /**
   * Initialisiert Industry Recognition
   */
  private initializeIndustryRecognition(): void {
    const recognitions: IndustryRecognition[] = [
      {
        id: 'bsw-solar-membership',
        type: 'membership',
        title: 'BSW-Solar Vollmitgliedschaft',
        description: 'Aktive Mitgliedschaft im führenden deutschen Solarverband',
        issuingOrganization: {
          name: 'Bundesverband Solarwirtschaft e.V.',
          authority: 95,
          url: 'https://www.solarwirtschaft.de',
          logo: `${this.baseUrl}/assets/logos/partners/bsw-solar.png`
        },
        category: 'Branchenverband',
        date: '2018-03-01',
        recognitionLevel: 'national',
        credibilityScore: 90
      },
      {
        id: 'intersolar-innovation-award-2023',
        type: 'award',
        title: 'Intersolar Innovation Award 2023',
        description: 'Auszeichnung für innovative Agri-PV Lösungen',
        issuingOrganization: {
          name: 'Solar Promotion GmbH',
          authority: 92,
          url: 'https://www.intersolar.de',
          logo: `${this.baseUrl}/assets/logos/partners/intersolar.png`
        },
        category: 'Innovation',
        date: '2023-06-14',
        rank: 1,
        totalParticipants: 156,
        recognitionLevel: 'international',
        credibilityScore: 95,
        certificate: {
          url: `${this.baseUrl}/assets/certificates/intersolar-innovation-award-2023.pdf`
        }
      }
    ];

    recognitions.forEach(recognition => this.industryRecognitions.set(recognition.id, recognition));
  }

  /**
   * Initialisiert Thought Leadership Kampagnen
   */
  private initializeThoughtLeadership(): void {
    const campaign: ThoughtLeadershipCampaign = {
      id: 'agri-pv-leadership-2024',
      name: 'Agri-PV Thought Leadership 2024',
      description: 'Positionierung als führender Agri-PV Experte in Deutschland',
      objective: 'Etablierung als #1 Agri-PV Authority im DACH-Raum',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',

      contentPillars: [
        'Agri-PV Technologie & Innovation',
        'Landwirtschaftliche Nachhaltigkeit',
        'Erneuerbare Energien Integration',
        'Regulatory & Policy Development'
      ],
      targetAudience: [
        'Landwirte & Agrarbetriebe',
        'Energieberater',
        'Politiker & Regulierer',
        'Investoren & Finanzierungspartner'
      ],
      keyMessages: [
        'Agri-PV ermöglicht nachhaltige Doppelnutzung',
        'Technologie schützt Kulturen vor Klimaextremen',
        'Stabile Zusatzerträge für Landwirte',
        'Beitrag zur Energiewende und Ernährungssicherheit'
      ],

      articles: [
        {
          title: 'Die Zukunft der Agri-Photovoltaik in Deutschland',
          url: `${this.baseUrl}/wissen/agri-pv-zukunft-deutschland`,
          publishDate: '2024-03-15',
          engagement: 8500
        },
        {
          title: 'Agri-PV: Lösung für Klimawandel und Energiewende',
          url: `${this.baseUrl}/wissen/agri-pv-klimawandel-energiewende`,
          publishDate: '2024-05-22',
          engagement: 12300
        }
      ],

      whitepapers: [
        {
          title: 'Agri-PV Marktpotential Deutschland 2025-2030',
          url: `${this.baseUrl}/downloads/agri-pv-marktpotential-2025-2030.pdf`,
          downloads: 2847,
          citations: 12
        }
      ],

      presentations: [
        {
          title: 'Agri-PV: Game Changer für die Energiewende',
          event: 'Intersolar Europe 2024',
          date: '2024-06-20',
          audience_size: 850,
          recording_url: 'https://www.youtube.com/watch?v=intersolar2024-agripv'
        }
      ],

      metrics: {
        contentViews: 125000,
        socialShares: 3420,
        mediaPickups: 23,
        expertCitations: 18,
        leadGeneration: 156,
        brandMentions: 89
      },

      investmentEUR: 45000,
      brandAuthorityIncrease: 15,
      leadValue: 235000,
      mediaValueEUR: 180000
    };

    this.thoughtLeadershipCampaigns.set(campaign.id, campaign);
  }

  /**
   * Berechnet Brand Authority Score
   */
  public calculateBrandAuthorityScore(): BrandAuthorityScore {
    const signals = Array.from(this.brandSignals.values());
    
    // Komponenten-Scores berechnen
    const awarenessSignals = signals.filter(s => 
      s.type === BrandSignalType.BRAND_SEARCH_VOLUME ||
      s.type === BrandSignalType.DIRECT_TRAFFIC ||
      s.type === BrandSignalType.SOCIAL_MEDIA_FOLLOWERS
    );
    
    const recognitionSignals = signals.filter(s =>
      s.type === BrandSignalType.INDUSTRY_AWARDS ||
      s.type === BrandSignalType.MEDIA_COVERAGE ||
      s.type === BrandSignalType.EXPERT_CITATIONS
    );
    
    const trustSignals = signals.filter(s =>
      s.type === BrandSignalType.CUSTOMER_TESTIMONIALS ||
      s.type === BrandSignalType.THIRD_PARTY_ENDORSEMENTS ||
      s.type === BrandSignalType.CERTIFICATION_DISPLAYS
    );
    
    const leadershipSignals = signals.filter(s =>
      s.type === BrandSignalType.THOUGHT_LEADERSHIP_CONTENT ||
      s.type === BrandSignalType.INDUSTRY_PARTNERSHIPS ||
      s.type === BrandSignalType.INNOVATION_RECOGNITION
    );

    const awarenessScore = this.calculateComponentScore(awarenessSignals);
    const recognitionScore = this.calculateComponentScore(recognitionSignals);
    const trustScore = this.calculateComponentScore(trustSignals);
    const leadershipScore = this.calculateComponentScore(leadershipSignals);

    // Gewichteter Gesamtscore
    const overallScore = Math.round(
      awarenessScore * 0.25 +
      recognitionScore * 0.30 +
      trustScore * 0.25 +
      leadershipScore * 0.20
    );

    // Authority Level bestimmen
    let level: BrandAuthorityLevel;
    if (overallScore >= 91) level = BrandAuthorityLevel.DOMINANT;
    else if (overallScore >= 76) level = BrandAuthorityLevel.AUTHORITATIVE;
    else if (overallScore >= 51) level = BrandAuthorityLevel.RECOGNIZED;
    else if (overallScore >= 26) level = BrandAuthorityLevel.ESTABLISHING;
    else level = BrandAuthorityLevel.EMERGING;

    // Next Milestone berechnen
    const nextMilestone = this.calculateNextMilestone(overallScore, level);

    return {
      overall: overallScore,
      level,
      components: {
        awareness: Math.round(awarenessScore),
        recognition: Math.round(recognitionScore),
        trust: Math.round(trustScore),
        leadership: Math.round(leadershipScore)
      },
      trends: {
        monthly: 2.3,
        quarterly: 7.8,
        yearly: 18.5
      },
      benchmarks: {
        industry_average: 58,
        top_competitor: 72,
        market_leader: 89
      },
      lastUpdated: new Date().toISOString(),
      nextMilestone
    };
  }

  /**
   * Berechnet Komponenten-Score
   */
  private calculateComponentScore(signals: BrandSignal[]): number {
    if (signals.length === 0) return 0;

    const weightedSum = signals.reduce((sum, signal) => {
      return sum + (signal.impactScore * signal.weight);
    }, 0);

    const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
    
    return totalWeight > 0 ? (weightedSum / totalWeight) : 0;
  }

  /**
   * Berechnet nächsten Meilenstein
   */
  private calculateNextMilestone(currentScore: number, currentLevel: BrandAuthorityLevel): {
    level: BrandAuthorityLevel;
    requiredScore: number;
    gap: number;
    estimatedTimeToAchieve: string;
  } {
    let nextLevel: BrandAuthorityLevel;
    let requiredScore: number;

    switch (currentLevel) {
      case BrandAuthorityLevel.EMERGING:
        nextLevel = BrandAuthorityLevel.ESTABLISHING;
        requiredScore = 26;
        break;
      case BrandAuthorityLevel.ESTABLISHING:
        nextLevel = BrandAuthorityLevel.RECOGNIZED;
        requiredScore = 51;
        break;
      case BrandAuthorityLevel.RECOGNIZED:
        nextLevel = BrandAuthorityLevel.AUTHORITATIVE;
        requiredScore = 76;
        break;
      case BrandAuthorityLevel.AUTHORITATIVE:
        nextLevel = BrandAuthorityLevel.DOMINANT;
        requiredScore = 91;
        break;
      default:
        return {
          level: BrandAuthorityLevel.DOMINANT,
          requiredScore: 100,
          gap: 0,
          estimatedTimeToAchieve: 'Achieved'
        };
    }

    const gap = requiredScore - currentScore;
    const monthsToAchieve = Math.ceil(gap / 2.3); // Basierend auf monatlichem Trend

    return {
      level: nextLevel,
      requiredScore,
      gap,
      estimatedTimeToAchieve: `${monthsToAchieve} Monate`
    };
  }

  /**
   * Fügt Brand Mention hinzu
   */
  public addBrandMention(mention: BrandMention): void {
    this.brandMentions.set(mention.id, mention);
  }

  /**
   * Ruft Brand Mentions nach Sentiment ab
   */
  public getBrandMentionsBySentiment(sentiment: BrandMentionSentiment): BrandMention[] {
    return Array.from(this.brandMentions.values()).filter(mention => mention.sentiment === sentiment);
  }

  /**
   * Ruft Top Social Proof Elemente ab
   */
  public getTopSocialProofElements(limit: number = 5): SocialProofElement[] {
    return Array.from(this.socialProofElements.values())
      .filter(element => element.featured)
      .sort((a, b) => b.credibilityScore - a.credibilityScore)
      .slice(0, limit);
  }

  /**
   * Ruft Industry Recognitions ab
   */
  public getIndustryRecognitions(): IndustryRecognition[] {
    return Array.from(this.industryRecognitions.values())
      .sort((a, b) => b.credibilityScore - a.credibilityScore);
  }

  /**
   * Generiert Brand Authority Schema
   */
  public generateBrandAuthoritySchema(): object {
    const authorityScore = this.calculateBrandAuthorityScore();
    const topSocialProof = this.getTopSocialProofElements(3);
    const recognitions = this.getIndustryRecognitions();

    return {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      '@id': `${this.baseUrl}#brand-authority`,
      name: 'ZOE Solar',
      description: 'Führende Marke für Photovoltaik-Lösungen im DACH-Raum',
      logo: `${this.baseUrl}/assets/logos/zoe-solar-logo.svg`,
      url: this.baseUrl,

      // Authority Signale
      award: recognitions
        .filter(r => r.type === 'award')
        .map(r => r.title),

      // Social Proof
      review: topSocialProof
        .filter(sp => sp.type === 'testimonial')
        .map(sp => ({
          '@type': 'Review',
          author: {
            '@type': 'Organization',
            name: sp.customerProfile?.company || sp.source
          },
          reviewBody: sp.testimonialQuote || sp.description,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: 5,
            bestRating: 5
          }
        })),

      // Brand Metrics
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Brand Authority Score',
          value: authorityScore.overall
        },
        {
          '@type': 'PropertyValue',
          name: 'Authority Level',
          value: authorityScore.level
        },
        {
          '@type': 'PropertyValue',
          name: 'Industry Recognitions',
          value: recognitions.length
        },
        {
          '@type': 'PropertyValue',
          name: 'Customer Testimonials',
          value: topSocialProof.filter(sp => sp.type === 'testimonial').length
        }
      ]
    };
  }

  /**
   * Exportiert alle Brand Authority Daten
   */
  public exportBrandAuthorityData(): {
    authorityScore: BrandAuthorityScore;
    brandSignals: BrandSignal[];
    socialProof: SocialProofElement[];
    industryRecognitions: IndustryRecognition[];
    thoughtLeadershipCampaigns: ThoughtLeadershipCampaign[];
    brandMentions: BrandMention[];
    competitorAnalyses: CompetitorAnalysis[];
    summary: {
      totalSignals: number;
      totalMentions: number;
      averageSentiment: string;
      topPerformingCampaign: string;
      nextMilestone: string;
    };
  } {
    const authorityScore = this.calculateBrandAuthorityScore();
    const brandSignals = Array.from(this.brandSignals.values());
    const socialProof = Array.from(this.socialProofElements.values());
    const industryRecognitions = Array.from(this.industryRecognitions.values());
    const thoughtLeadershipCampaigns = Array.from(this.thoughtLeadershipCampaigns.values());
    const brandMentions = Array.from(this.brandMentions.values());
    const competitorAnalyses = Array.from(this.competitorAnalyses.values());

    // Summary berechnen
    const positiveMentions = brandMentions.filter(m => 
      m.sentiment === BrandMentionSentiment.POSITIVE || 
      m.sentiment === BrandMentionSentiment.VERY_POSITIVE
    ).length;
    const averageSentiment = brandMentions.length > 0 ? 
      (positiveMentions / brandMentions.length > 0.7 ? 'Positive' : 'Neutral') : 'No Data';

    const topCampaign = thoughtLeadershipCampaigns.find(c => c.status === 'active')?.name || 'None';

    return {
      authorityScore,
      brandSignals,
      socialProof,
      industryRecognitions,
      thoughtLeadershipCampaigns,
      brandMentions,
      competitorAnalyses,
      summary: {
        totalSignals: brandSignals.length,
        totalMentions: brandMentions.length,
        averageSentiment,
        topPerformingCampaign: topCampaign,
        nextMilestone: `${authorityScore.nextMilestone.level} (${authorityScore.nextMilestone.gap} Punkte)`
      }
    };
  }

  /**
   * Validiert Brand Authority Daten
   */
  public validateBrandAuthorityData(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    const authorityScore = this.calculateBrandAuthorityScore();

    // Brand Signals validieren
    const signals = Array.from(this.brandSignals.values());
    if (signals.length < 5) {
      warnings.push(`Low signal count: ${signals.length} (recommended: 10+)`);
    }

    // Verifikationsstatus prüfen
    const unverifiedSignals = signals.filter(s => s.verificationStatus === 'unverified').length;
    if (unverifiedSignals > 0) {
      warnings.push(`${unverifiedSignals} unverified signals found`);
    }

    // Authority Level prüfen
    if (authorityScore.overall < 50) {
      recommendations.push('Focus on building more recognition and trust signals');
    }

    // Social Proof prüfen
    const socialProof = Array.from(this.socialProofElements.values());
    if (socialProof.length < 10) {
      recommendations.push(`Add more social proof elements (current: ${socialProof.length})`);
    }

    // Thought Leadership prüfen
    const activeCampaigns = Array.from(this.thoughtLeadershipCampaigns.values())
      .filter(c => c.status === 'active').length;
    if (activeCampaigns === 0) {
      recommendations.push('Start thought leadership campaigns');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }
}

// Singleton-Instanz
export const brandAuthorityBuildingService = new BrandAuthorityBuildingService();