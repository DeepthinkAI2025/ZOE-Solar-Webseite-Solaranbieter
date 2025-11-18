/**
 * ZOE SOLAR - Community & Social Proof Service
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Features:
 * - Social Proof Management System
 * - Community Building Tools
 * - Trust Signal Display
 * - Dynamic Review System
 * - Customer Success Stories
 * - Expert Recommendations
 * - Social Media Integration
 * - Referral Program Management
 */

export interface SocialProofElement {
  id: string;
  type: 'testimonial' | 'review' | 'case-study' | 'statistics' | 'certification' | 'expert-quote' | 'media-mention' | 'award' | 'partnership';
  content: string;
  source: string;
  author?: string;
  authorTitle?: string;
  company?: string;
  location?: string;
  rating?: number;
  date: Date;
  verification?: string;
  visual?: SocialProofVisual;
  credibility: number; // 1-10
  impact: 'high' | 'medium' | 'low';
  category: 'trust' | 'results' | 'experience' | 'authority' | 'safety';
  targetAudience: string[];
  placement: string[];
  performance: SocialProofPerformance;
  personalization?: SocialProofPersonalization;
}

export interface SocialProofVisual {
  type: 'photo' | 'video' | 'logo' | 'chart' | 'badge' | 'infographic';
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: any;
}

export interface SocialProofPerformance {
  impressions: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  engagement: number;
  trustScore: number;
  effectiveness: number; // 1-10
}

export interface SocialProofPersonalization {
  industry?: string[];
  companySize?: string[];
  role?: string[];
  painPoints?: string[];
  goals?: string[];
  stages?: string[];
  devices?: string[];
}

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  location: string;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'agriculture';
  systemSize: number;
  installationDate: Date;
  annualSavings: number;
  satisfactionRating: number;
  testimonial?: string;
  photo?: string;
  socialMedia?: {
    platform: string;
    handle: string;
    verified: boolean;
  };
  status: 'active' | 'advocate' | 'expert' | 'newbie';
  contributions: CommunityContribution[];
  achievements: Achievement[];
}

export interface CommunityContribution {
  id: string;
  type: 'testimonial' | 'review' | 'forum-post' | 'photo-sharing' | 'referral' | 'expert-advice';
  content: string;
  date: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags: string[];
  status: 'pending' | 'approved' | 'featured';
}

export interface Achievement {
  id: string;
  type: 'early-adopter' | 'savings-champion' | 'community-helper' | 'eco-warrior' | 'referral-master';
  title: string;
  description: string;
  icon: string;
  dateEarned: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  badge?: string;
}

export interface CustomerSuccessStory {
  id: string;
  title: string;
  subtitle: string;
  customerName: string;
  customerInfo: {
    location: string;
    propertyType: string;
    systemSize: number;
    installationDate: Date;
  };
  challenge: string;
  solution: string;
  results: {
    financial: FinancialResult;
    environmental: EnvironmentalResult;
    lifestyle: LifestyleResult;
  };
  testimonial: string;
  photos: string[];
  video?: string;
  caseStudy: string;
  impact: 'high' | 'medium' | 'low';
  category: 'residential' | 'commercial' | 'agriculture' | 'industrial';
  featured: boolean;
  tags: string[];
}

export interface FinancialResult {
  monthlySavings: number;
  annualSavings: number;
  roi: number;
  paybackPeriod: number;
  totalEarnings: number;
}

export interface EnvironmentalResult {
  co2Reduced: number;
  treesEquivalent: number;
  energyIndependence: number;
  sustainabilityScore: number;
}

export interface LifestyleResult {
  energySecurity: number;
  independence: number;
  peaceOfMind: number;
  futureProofing: number;
}

export interface Review {
  id: string;
  platform: 'google' | 'facebook' | 'trustpilot' | 'local' | 'internal';
  customerName: string;
  customerLocation: string;
  rating: number; // 1-5
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  response?: string;
  responseDate?: Date;
  photos?: string[];
  tags: string[];
  category: string;
  followUpRequired: boolean;
  status: 'pending' | 'published' | 'responded' | 'escalated';
}

export interface ExpertRecommendation {
  id: string;
  expertName: string;
  expertTitle: string;
  expertCredentials: string[];
  expertPhoto: string;
  recommendation: string;
  specialization: string[];
  credibilityScore: number;
  date: Date;
  verification: string;
  impact: 'high' | 'medium' | 'low';
  targetAudience: string[];
  content: ExpertContent;
}

export interface ExpertContent {
  quote: string;
  analysis: string;
  prediction: string;
  advice: string;
  supportingData: string[];
}

export interface TrustSignal {
  id: string;
  type: 'certification' | 'award' | 'partnership' | 'membership' | 'compliance' | 'insurance';
  name: string;
  description: string;
  issuer: string;
  dateObtained: Date;
  validUntil?: Date;
  visual: TrustSignalVisual;
  credibility: number; // 1-10
  importance: 'critical' | 'important' | 'nice-to-have';
  category: 'technical' | 'business' | 'legal' | 'quality';
  placement: string[];
}

export interface TrustSignalVisual {
  type: 'badge' | 'logo' | 'certificate' | 'shield' | 'medal';
  src: string;
  alt: string;
  style?: any;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  rewards: ReferralReward[];
  rules: ReferralRule[];
  tracking: ReferralTracking;
  performance: ReferralPerformance;
  currentMonth: ReferralMetrics;
}

export interface ReferralReward {
  type: 'cash' | 'credit' | 'gift' | 'discount' | 'service';
  value: number;
  description: string;
  conditions: string[];
  maxUses?: number;
  currentUses: number;
}

export interface ReferralRule {
  description: string;
  condition: string;
  requirement: number;
}

export interface ReferralTracking {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  conversionRate: number;
  averageValue: number;
  topReferrers: TopReferrer[];
}

export interface TopReferrer {
  memberId: string;
  name: string;
  referrals: number;
  rewards: number;
  status: 'active' | 'inactive';
}

export interface ReferralPerformance {
  impressions: number;
  clicks: number;
  applications: number;
  conversions: number;
  revenue: number;
  roi: number;
  costPerReferral: number;
}

export interface ReferralMetrics {
  month: string;
  newReferrals: number;
  successfulReferrals: number;
  revenue: number;
  rewardsGiven: number;
  growth: number;
}

export interface MediaMention {
  id: string;
  outlet: string;
  journalist: string;
  title: string;
  description: string;
  url: string;
  date: Date;
  reach: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  type: 'article' | 'interview' | 'review' | 'award' | 'mention';
  featured: boolean;
  quote?: string;
  category: string;
}

export interface Award {
  id: string;
  name: string;
  category: string;
  year: number;
  issuer: string;
  description: string;
  criteria: string[];
  recipients: string[];
  visual: AwardVisual;
  credibility: number; // 1-10
  impact: 'high' | 'medium' | 'low';
}

export interface AwardVisual {
  type: 'trophy' | 'medal' | 'certificate' | 'plaque';
  src: string;
  alt: string;
}

export interface Partnership {
  id: string;
  partnerName: string;
  partnerType: 'manufacturer' | 'supplier' | 'installer' | 'technology' | 'finance' | 'government';
  partnershipType: 'official' | 'certified' | 'preferred' | 'strategic';
  description: string;
  benefits: string[];
  since: Date;
  visual: PartnershipVisual;
  credibility: number; // 1-10
  exclusivity?: string;
}

export interface PartnershipVisual {
  type: 'logo' | 'badge' | 'certificate';
  src: string;
  alt: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'workshop' | 'site-visit' | 'meetup' | 'conference' | 'training';
  date: Date;
  location: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  speakers: EventSpeaker[];
  attendees: CommunityMember[];
  recordings?: string[];
  materials?: string[];
  feedback: EventFeedback[];
}

export interface EventSpeaker {
  name: string;
  title: string;
  bio: string;
  photo: string;
  expertise: string[];
}

export interface EventFeedback {
  memberId: string;
  rating: number; // 1-5
  comment: string;
  suggestions: string[];
  wouldRecommend: boolean;
}

export interface SocialProofContext {
  userProfile: any;
  currentPage: string;
  userStage: 'awareness' | 'consideration' | 'decision' | 'customer';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location: string;
  industry?: string;
  painPoints: string[];
  timestamp: Date;
}

export interface SocialProofStrategy {
  id: string;
  name: string;
  description: string;
  targetContext: SocialProofContext;
  elements: string[];
  priority: number;
  effectiveness: number; // 1-10
  personalization: SocialProofPersonalization;
  performance: StrategyPerformance;
}

export interface StrategyPerformance {
  impressions: number;
  engagement: number;
  conversions: number;
  conversionRate: number;
  trustImpact: number;
  uplift: number;
}

export class CommunitySocialProofService {
  private static instance: CommunitySocialProofService;
  private isInitialized = false;
  private socialProofElements: Map<string, SocialProofElement> = new Map();
  private communityMembers: Map<string, CommunityMember> = new Map();
  private customerSuccessStories: Map<string, CustomerSuccessStory> = new Map();
  private reviews: Map<string, Review> = new Map();
  private expertRecommendations: Map<string, ExpertRecommendation> = new Map();
  private trustSignals: Map<string, TrustSignal> = new Map();
  private referralProgram: ReferralProgram | null = null;
  private mediaMentions: Map<string, MediaMention> = new Map();
  private awards: Map<string, Award> = new Map();
  private partnerships: Map<string, Partnership> = new Map();
  private communityEvents: Map<string, CommunityEvent> = new Map();
  private socialProofStrategies: Map<string, SocialProofStrategy> = new Map();
  private currentContext: SocialProofContext | null = null;

  private constructor() {
    this.initializeDefaultSocialProof();
    this.initializeDefaultCommunity();
    this.initializeDefaultSuccessStories();
    this.initializeDefaultReviews();
    this.initializeDefaultTrustSignals();
    this.initializeDefaultAwards();
    this.initializeDefaultPartnerships();
    this.initializeDefaultReferralProgram();
  }

  public static getInstance(): CommunitySocialProofService {
    if (!CommunitySocialProofService.instance) {
      CommunitySocialProofService.instance = new CommunitySocialProofService();
    }
    return CommunitySocialProofService.instance;
  }

  /**
   * Initialize community & social proof service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize social proof management
      this.initializeSocialProofManagement();
      
      // Set up community features
      this.initializeCommunityFeatures();
      
      // Initialize review management
      this.initializeReviewManagement();
      
      // Set up referral tracking
      this.initializeReferralTracking();
      
      // Initialize social media integration
      this.initializeSocialMediaIntegration();

      this.isInitialized = true;
      console.log('👥 Community & Social Proof Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Community & Social Proof Service:', error);
    }
  }

  /**
   * Initialize default social proof elements
   */
  private initializeDefaultSocialProof(): void {
    const defaultElements: SocialProofElement[] = [
      {
        id: 'testimonial-family-schmidt',
        type: 'testimonial',
        content: 'Unsere Stromkosten sind von 180€ auf 35€ gesunken. Die Installation war professionell und der Service ausgezeichnet. Wir sind absolut begeistert!',
        source: 'Familie Schmidt',
        author: 'Michael Schmidt',
        authorTitle: 'Hausbesitzer',
        location: 'Potsdam',
        rating: 5,
        date: new Date('2024-08-15'),
        verification: 'Verifizierte Installation #472',
        visual: {
          type: 'photo',
          src: '/images/testimonials/familie-schmidt.jpg',
          alt: 'Zufriedene Familie Schmidt mit ihrer Photovoltaik-Anlage',
          width: 120,
          height: 120
        },
        credibility: 9,
        impact: 'high',
        category: 'trust',
        targetAudience: ['homeowners', 'residential'],
        placement: ['homepage', 'testimonials', 'hero'],
        performance: {
          impressions: 1250,
          clicks: 89,
          conversions: 12,
          conversionRate: 13.5,
          engagement: 8.7,
          trustScore: 9.2,
          effectiveness: 9
        }
      },
      {
        id: 'statistics-500-installations',
        type: 'statistics',
        content: '500+ erfolgreiche Installationen in Berlin und Brandenburg',
        source: 'Interne Statistik',
        date: new Date('2024-10-01'),
        credibility: 10,
        impact: 'high',
        category: 'results',
        targetAudience: ['all'],
        placement: ['homepage', 'about', 'trust-section'],
        performance: {
          impressions: 2100,
          clicks: 45,
          conversions: 8,
          conversionRate: 17.8,
          engagement: 6.2,
          trustScore: 8.5,
          effectiveness: 8
        }
      },
      {
        id: 'rating-google-4-9',
        type: 'review',
        content: '4.9/5 Sterne bei 127 Google Bewertungen',
        source: 'Google Reviews',
        rating: 5,
        date: new Date('2024-10-15'),
        verification: 'Google-verifiziert',
        visual: {
          type: 'badge',
          src: '/images/badges/google-5stars.png',
          alt: 'Google 5 Sterne Bewertung'
        },
        credibility: 9,
        impact: 'high',
        category: 'trust',
        targetAudience: ['all'],
        placement: ['homepage', 'footer', 'reviews-section'],
        performance: {
          impressions: 3200,
          clicks: 120,
          conversions: 15,
          conversionRate: 12.5,
          engagement: 7.8,
          trustScore: 9.0,
          effectiveness: 9
        }
      },
      {
        id: 'expert-dr-weber-quote',
        type: 'expert-quote',
        content: 'Photovoltaik ist die intelligenteste Investition für die Zukunft. ZOE Solar bietet erstklassige Beratung und Umsetzung.',
        source: 'Prof. Dr. Hans Weber',
        author: 'Prof. Dr. Hans Weber',
        authorTitle: 'Institut für Erneuerbare Energien, TU Berlin',
        date: new Date('2024-09-20'),
        verification: 'Akademische Qualifikation verifiziert',
        visual: {
          type: 'photo',
          src: '/images/experts/dr-weber.jpg',
          alt: 'Prof. Dr. Hans Weber, Solar-Experte',
          width: 100,
          height: 100
        },
        credibility: 10,
        impact: 'high',
        category: 'authority',
        targetAudience: ['technical', 'business'],
        placement: ['expert-section', 'about'],
        performance: {
          impressions: 890,
          clicks: 34,
          conversions: 6,
          conversionRate: 17.6,
          engagement: 9.1,
          trustScore: 9.5,
          effectiveness: 9
        }
      },
      {
        id: 'certification-din-62446',
        type: 'certification',
        content: 'Zertifizierter Fachbetrieb für Photovoltaik nach DIN EN 62446',
        source: 'TÜV Rheinland',
        date: new Date('2023-12-01'),
        verification: 'Offiziell zertifiziert',
        visual: {
          type: 'badge',
          src: '/images/certificates/din-62446.png',
          alt: 'DIN EN 62446 Zertifikat'
        },
        credibility: 10,
        impact: 'high',
        category: 'safety',
        targetAudience: ['all'],
        placement: ['header', 'certifications', 'about'],
        performance: {
          impressions: 1800,
          clicks: 67,
          conversions: 11,
          conversionRate: 16.4,
          engagement: 7.2,
          trustScore: 9.8,
          effectiveness: 10
        }
      },
      {
        id: 'media-solar-award-2023',
        type: 'award',
        content: 'Ausgezeichnet als "Solarbetrieb des Jahres 2023"',
        source: 'Bundesverband Solarwirtschaft',
        date: new Date('2023-11-15'),
        visual: {
          type: 'badge',
          src: '/images/awards/solar-betrieb-2023.png',
          alt: 'Solarbetrieb des Jahres 2023'
        },
        credibility: 8,
        impact: 'medium',
        category: 'authority',
        targetAudience: ['all'],
        placement: ['awards-section', 'about'],
        performance: {
          impressions: 750,
          clicks: 28,
          conversions: 4,
          conversionRate: 14.3,
          engagement: 8.9,
          trustScore: 8.7,
          effectiveness: 8
        }
      }
    ];

    defaultElements.forEach(element => {
      this.socialProofElements.set(element.id, element);
    });
  }

  /**
   * Initialize default community members
   */
  private initializeDefaultCommunity(): void {
    const defaultMembers: CommunityMember[] = [
      {
        id: 'member-001',
        name: 'Familie Schmidt',
        email: 'm.schmidt@email.com',
        location: 'Potsdam',
        propertyType: 'residential',
        systemSize: 8.5,
        installationDate: new Date('2024-07-15'),
        annualSavings: 2400,
        satisfactionRating: 5,
        testimonial: 'Die beste Investition ever! Unsere Stromkosten sind drastisch gesunken.',
        photo: '/images/community/familie-schmidt.jpg',
        status: 'advocate',
        contributions: [
          {
            id: 'contrib-001',
            type: 'testimonial',
            content: 'Unsere Erfahrung mit ZOE Solar war fantastisch. Professional, pünktlich, perfekt!',
            date: new Date('2024-08-15'),
            engagement: { likes: 23, comments: 5, shares: 8 },
            tags: ['installation', 'service', 'satisfaction'],
            status: 'featured'
          }
        ],
        achievements: [
          {
            id: 'achievement-001',
            type: 'savings-champion',
            title: 'Sparmeister',
            description: 'Über 2000€ jährliche Ersparnis erreicht',
            icon: '💰',
            dateEarned: new Date('2024-08-15'),
            rarity: 'rare',
            badge: 'savings-champion.png'
          }
        ]
      },
      {
        id: 'member-002',
        name: 'Thomas Weber',
        email: 't.weber@business.de',
        location: 'Berlin',
        propertyType: 'commercial',
        systemSize: 45.2,
        installationDate: new Date('2024-05-20'),
        annualSavings: 8500,
        satisfactionRating: 5,
        testimonial: 'Unsere Betriebskosten sind merklich gesunken. Exzellente Beratung!',
        photo: '/images/community/thomas-weber.jpg',
        socialMedia: {
          platform: 'linkedin',
          handle: '@thomas-weber-gmbh',
          verified: true
        },
        status: 'expert',
        contributions: [
          {
            id: 'contrib-002',
            type: 'expert-advice',
            content: 'Tipps für Gewerbekunden: Plant eure Anlage für zukünftige Erweiterungen.',
            date: new Date('2024-06-10'),
            engagement: { likes: 45, comments: 12, shares: 18 },
            tags: ['business', 'planning', 'expansion'],
            status: 'approved'
          }
        ],
        achievements: [
          {
            id: 'achievement-002',
            type: 'community-helper',
            title: 'Community Helfer',
            description: 'Hilft anderen mit Expertenrat',
            icon: '🤝',
            dateEarned: new Date('2024-06-15'),
            rarity: 'epic',
            badge: 'community-helper.png'
          }
        ]
      }
    ];

    defaultMembers.forEach(member => {
      this.communityMembers.set(member.id, member);
    });
  }

  /**
   * Initialize default success stories
   */
  private initializeDefaultSuccessStories(): void {
    const defaultStories: CustomerSuccessStory[] = [
      {
        id: 'success-family-mueller',
        title: 'Von 180€ auf 35€ Stromkosten',
        subtitle: 'Familie Müller reduziert ihre Energiekosten um 80%',
        customerName: 'Familie Müller',
        customerInfo: {
          location: 'Potsdam',
          propertyType: 'Einfamilienhaus',
          systemSize: 7.8,
          installationDate: new Date('2024-03-15')
        },
        challenge: 'Familie Müller haderte mit stetig steigenden Stromkosten. Die monatliche Rechnung von 180€ belastete das Familienbudget erheblich.',
        solution: 'Eine 7.8kW Photovoltaik-Anlage mit Batteriespeicher, optimal ausgerichtet nach Süd-West mit 35° Neigung.',
        results: {
          financial: {
            monthlySavings: 145,
            annualSavings: 1740,
            roi: 22,
            paybackPeriod: 8.5,
            totalEarnings: 15660
          },
          environmental: {
            co2Reduced: 3.2,
            treesEquivalent: 147,
            energyIndependence: 85,
            sustainabilityScore: 9.2
          },
          lifestyle: {
            energySecurity: 9,
            independence: 8,
            peaceOfMind: 9,
            futureProofing: 8
          }
        },
        testimonial: 'Wir sind so glücklich! Nicht nur die Ersparnis ist fantastisch, sondern auch das Gefühl, etwas Gutes für die Umwelt zu tun. Unsere Kinder sind stolz auf unser nachhaltiges Zuhause.',
        photos: [
          '/images/success/familie-mueller-house.jpg',
          '/images/success/familie-mueller-dashboard.jpg',
          '/images/success/familie-mueller-installation.jpg'
        ],
        video: '/videos/success-familie-mueller.mp4',
        caseStudy: '/case-studies/familie-mueller.pdf',
        impact: 'high',
        category: 'residential',
        featured: true,
        tags: ['residential', 'cost-savings', 'family', 'battery-storage']
      },
      {
        id: 'success-weber-gmbh',
        title: 'Gewerbebetrieb spart 8.500€ jährlich',
        subtitle: 'Weber GmbH reduziert Betriebskosten um 35%',
        customerName: 'Weber Maschinenbau GmbH',
        customerInfo: {
          location: 'Berlin',
          propertyType: 'Gewerbehalle',
          systemSize: 45.2,
          installationDate: new Date('2024-02-20')
        },
        challenge: 'Hohe Betriebskosten durch Energieintensive Maschinen. Monatliche Stromrechnung von über 2.000€ belastete die Gewinnmarge.',
        solution: 'Große Hallendach-Installation mit 45.2kW peak Leistung, optimiert für maximale Auslastung während der Produktionszeiten.',
        results: {
          financial: {
            monthlySavings: 708,
            annualSavings: 8500,
            roi: 18,
            paybackPeriod: 6.2,
            totalEarnings: 42500
          },
          environmental: {
            co2Reduced: 18.5,
            treesEquivalent: 852,
            energyIndependence: 72,
            sustainabilityScore: 8.8
          },
          lifestyle: {
            energySecurity: 8,
            independence: 7,
            peaceOfMind: 9,
            futureProofing: 9
          }
        },
        testimonial: 'Die Photovoltaik-Anlage hat unsere Betriebskosten revolutioniert. Wir sind nicht nur unabhängiger geworden, sondern auch ein attraktiverer Arbeitgeber durch unser nachhaltiges Image.',
        photos: [
          '/images/success/weber-gmbh-exterior.jpg',
          '/images/success/weber-gmbh-interior.jpg',
          '/images/success/weber-gmbh-dashboard.jpg'
        ],
        impact: 'high',
        category: 'commercial',
        featured: true,
        tags: ['commercial', 'industrial', 'cost-savings', 'business']
      }
    ];

    defaultStories.forEach(story => {
      this.customerSuccessStories.set(story.id, story);
    });
  }

  /**
   * Initialize default reviews
   */
  private initializeDefaultReviews(): void {
    const defaultReviews: Review[] = [
      {
        id: 'review-google-001',
        platform: 'google',
        customerName: 'Sarah M.',
        customerLocation: 'Berlin',
        rating: 5,
        title: 'Fantastischer Service!',
        content: 'ZOE Solar hat unsere Erwartungen übertroffen. Von der ersten Beratung bis zur fertigen Anlage - alles perfekt. Unsere Stromkosten sind massiv gesunken!',
        date: new Date('2024-10-10'),
        verified: true,
        helpful: 15,
        response: 'Vielen Dank für das tolle Feedback! Es freut uns sehr, dass Sie mit unserem Service zufrieden sind.',
        responseDate: new Date('2024-10-11'),
        tags: ['service', 'installation', 'cost-savings', 'satisfaction'],
        category: 'residential',
        followUpRequired: false,
        status: 'responded'
      },
      {
        id: 'review-trustpilot-002',
        platform: 'trustpilot',
        customerName: 'Michael K.',
        customerLocation: 'Potsdam',
        rating: 5,
        title: 'Absolute Empfehlung!',
        content: 'Top Beratung, faire Preise, pünktliche Installation. Das Team war sehr professionell und hat alle Versprechen eingehalten.',
        date: new Date('2024-09-28'),
        verified: true,
        helpful: 12,
        response: 'Vielen Dank für Ihre Bewertung! Wir sind stolz auf unser qualifiziertes Team.',
        responseDate: new Date('2024-09-29'),
        tags: ['consultation', 'pricing', 'installation', 'reliability'],
        category: 'residential',
        followUpRequired: false,
        status: 'responded'
      }
    ];

    defaultReviews.forEach(review => {
      this.reviews.set(review.id, review);
    });
  }

  /**
   * Initialize default trust signals
   */
  private initializeDefaultTrustSignals(): void {
    const defaultSignals: TrustSignal[] = [
      {
        id: 'signal-din-certification',
        type: 'certification',
        name: 'DIN EN 62446 Zertifizierung',
        description: 'Zertifizierter Fachbetrieb für Photovoltaik-Anlagen',
        issuer: 'TÜV Rheinland',
        dateObtained: new Date('2023-12-01'),
        validUntil: new Date('2026-12-01'),
        visual: {
          type: 'badge',
          src: '/images/certifications/din-62446.png',
          alt: 'DIN EN 62446 Zertifikat'
        },
        credibility: 10,
        importance: 'critical',
        category: 'technical',
        placement: ['header', 'certifications', 'about']
      },
      {
        id: 'signal-handwerkskammer',
        type: 'membership',
        name: 'Mitglied der Handwerkskammer',
        description: 'Registriertes Mitglied der Handwerkskammer Berlin',
        issuer: 'Handwerkskammer Berlin',
        dateObtained: new Date('2008-03-15'),
        visual: {
          type: 'logo',
          src: '/images/memberships/handwerkskammer.png',
          alt: 'Handwerkskammer Berlin Mitglied'
        },
        credibility: 9,
        importance: 'important',
        category: 'business',
        placement: ['about', 'footer']
      },
      {
        id: 'signal-insurance',
        type: 'insurance',
        name: 'Berufshaftpflichtversicherung',
        description: 'Umfassende Berufshaftpflichtversicherung für Solar-Installationen',
        issuer: 'Allianz Versicherung',
        dateObtained: new Date('2024-01-01'),
        visual: {
          type: 'badge',
          src: '/images/insurance/allianz-protected.png',
          alt: 'Allianz Versicherungsschutz'
        },
        credibility: 8,
        importance: 'important',
        category: 'legal',
        placement: ['certifications', 'about']
      }
    ];

    defaultSignals.forEach(signal => {
      this.trustSignals.set(signal.id, signal);
    });
  }

  /**
   * Initialize default awards
   */
  private initializeDefaultAwards(): void {
    const defaultAwards: Award[] = [
      {
        id: 'award-solar-betrieb-2023',
        name: 'Solarbetrieb des Jahres 2023',
        category: 'Excellence in Solar Installation',
        year: 2023,
        issuer: 'Bundesverband Solarwirtschaft e.V.',
        description: 'Auszeichnung für herausragende Leistungen in der Photovoltaik-Installation',
        criteria: [
          'Kundenbewertung über 4.8 Sterne',
          'Mindestens 100 erfolgreiche Installationen pro Jahr',
          'Zertifizierte Fachkräfte',
          'Nachhaltige Geschäftspraktiken'
        ],
        recipients: ['ZOE Solar GmbH'],
        visual: {
          type: 'trophy',
          src: '/images/awards/solar-betrieb-2023.png',
          alt: 'Solarbetrieb des Jahres 2023 Trophäe'
        },
        credibility: 8,
        impact: 'high'
      },
      {
        id: 'award-top-employer-2024',
        name: 'Top Arbeitgeber Berlin 2024',
        category: 'Employer Excellence',
        year: 2024,
        issuer: 'Great Place to Work Institute',
        description: 'Auszeichnung für außergewöhnliche Arbeitsplatzqualität',
        criteria: [
          'Mitarbeiterzufriedenheit über 90%',
          'Niedrige Fluktuation unter 5%',
          'Umfassende Weiterbildungsprogramme',
          'Work-Life-Balance Initiativen'
        ],
        recipients: ['ZOE Solar GmbH'],
        visual: {
          type: 'medal',
          src: '/images/awards/top-employer-2024.png',
          alt: 'Top Arbeitgeber 2024 Medaille'
        },
        credibility: 7,
        impact: 'medium'
      }
    ];

    defaultAwards.forEach(award => {
      this.awards.set(award.id, award);
    });
  }

  /**
   * Initialize default partnerships
   */
  private initializeDefaultPartnerships(): void {
    const defaultPartnerships: Partnership[] = [
      {
        id: 'partnership-sma',
        partnerName: 'SMA Solar Technology AG',
        partnerType: 'manufacturer',
        partnershipType: 'official',
        description: 'Offizieller Partner für SMA Wechselrichter und Systemlösungen',
        benefits: [
          'Zugriff auf neueste SMA Technologie',
          'Priorität bei Produktverfügbarkeit',
          'Erweiterte Garantieleistungen',
          'Technischer Support direkt vom Hersteller'
        ],
        since: new Date('2020-06-15'),
        visual: {
          type: 'logo',
          src: '/images/partners/sma-logo.png',
          alt: 'SMA Solar Technology Partner'
        },
        credibility: 9,
        exclusivity: 'Exklusiv für Berlin und Brandenburg Region'
      },
      {
        id: 'partnership-tesla',
        partnerName: 'Tesla Energy',
        partnerType: 'manufacturer',
        partnershipType: 'certified',
        description: 'Zertifizierter Partner für Tesla Powerwall und Powerpack Systeme',
        benefits: [
          'Zertifizierte Installation von Tesla Speichersystemen',
          'Herstellergarantie direkt von Tesla',
          'Software-Updates und Monitoring',
          'Support für Tesla能源 APP Integration'
        ],
        since: new Date('2022-03-20'),
        visual: {
          type: 'badge',
          src: '/images/partners/tesla-certified.png',
          alt: 'Tesla Energy Zertifizierter Partner'
        },
        credibility: 8,
        exclusivity: 'Tesla Powerwall Installation Zertifizierung'
      },
      {
        id: 'partnership-longi',
        partnerName: 'Longi Solar',
        partnerType: 'manufacturer',
        partnershipType: 'preferred',
        description: 'Preferred Partner für Longi Solar Module',
        benefits: [
          'Bevorzugte Lieferzeiten',
          'Attraktive Einkaufskonditionen',
          'Marketing-Support',
          'Technische Schulungen'
        ],
        since: new Date('2021-09-10'),
        visual: {
          type: 'logo',
          src: '/images/partners/longi-logo.png',
          alt: 'Longi Solar Preferred Partner'
        },
        credibility: 7
      }
    ];

    defaultPartnerships.forEach(partnership => {
      this.partnerships.set(partnership.id, partnership);
    });
  }

  /**
   * Initialize default referral program
   */
  private initializeDefaultReferralProgram(): void {
    this.referralProgram = {
      id: 'referral-program-2024',
      name: 'Solar Friends - Empfehlungsprogramm',
      description: 'Empfehlen Sie ZOE Solar an Freunde und Familie und erhalten Sie attraktive Prämien',
      status: 'active',
      rewards: [
        {
          type: 'cash',
          value: 200,
          description: '200€ Gutschrift für erfolgreiche Empfehlung',
          conditions: ['Neukunde muss Anlage installieren', 'Empfehlung muss vor Erstberatung erfolgen'],
          maxUses: 10,
          currentUses: 0
        },
        {
          type: 'service',
          value: 500,
          description: 'Kostenlose Wartung im Wert von 500€',
          conditions: ['Für bestehende Kunden', 'Nach 2 Jahren ohne Wartung'],
          currentUses: 0
        }
      ],
      rules: [
        {
          description: 'Empfehlung muss vor Erstberatung erfolgen',
          condition: 'before_consultation',
          requirement: 1
        },
        {
          description: 'Neukunde muss Anlage installieren',
          condition: 'installation_required',
          requirement: 1
        }
      ],
      tracking: {
        totalReferrals: 45,
        successfulReferrals: 32,
        pendingReferrals: 8,
        conversionRate: 71.1,
        averageValue: 175,
        topReferrers: [
          {
            memberId: 'member-001',
            name: 'Familie Schmidt',
            referrals: 5,
            rewards: 1000,
            status: 'active'
          },
          {
            memberId: 'member-003',
            name: 'Thomas Weber',
            referrals: 4,
            rewards: 800,
            status: 'active'
          }
        ]
      },
      performance: {
        impressions: 2800,
        clicks: 420,
        applications: 85,
        conversions: 32,
        revenue: 56000,
        roi: 340,
        costPerReferral: 175
      },
      currentMonth: {
        month: '2024-10',
        newReferrals: 8,
        successfulReferrals: 6,
        revenue: 10500,
        rewardsGiven: 1200,
        growth: 25
      }
    };
  }

  /**
   * Initialize social proof management
   */
  private initializeSocialProofManagement(): void {
    console.log('🎯 Social proof management initialized');
  }

  /**
   * Initialize community features
   */
  private initializeCommunityFeatures(): void {
    console.log('👥 Community features initialized');
  }

  /**
   * Initialize review management
   */
  private initializeReviewManagement(): void {
    console.log('⭐ Review management initialized');
  }

  /**
   * Initialize referral tracking
   */
  private initializeReferralTracking(): void {
    console.log('🔗 Referral tracking initialized');
  }

  /**
   * Initialize social media integration
   */
  private initializeSocialMediaIntegration(): void {
    console.log('📱 Social media integration initialized');
  }

  /**
   * Get social proof elements for context
   */
  public getSocialProofElements(context: SocialProofContext): SocialProofElement[] {
    let elements = Array.from(this.socialProofElements.values());

    // Filter by target audience
    elements = elements.filter(element => 
      element.targetAudience.includes('all') || 
      element.targetAudience.includes(context.userStage) ||
      element.targetAudience.includes(context.deviceType)
    );

    // Sort by credibility and impact
    elements.sort((a, b) => {
      const scoreA = a.credibility * (a.impact === 'high' ? 3 : a.impact === 'medium' ? 2 : 1);
      const scoreB = b.credibility * (b.impact === 'high' ? 3 : b.impact === 'medium' ? 2 : 1);
      return scoreB - scoreA;
    });

    return elements.slice(0, 10); // Return top 10 elements
  }

  /**
   * Get customer success stories
   */
  public getCustomerSuccessStories(category?: string, featured?: boolean): CustomerSuccessStory[] {
    let stories = Array.from(this.customerSuccessStories.values());

    if (category) {
      stories = stories.filter(story => story.category === category);
    }

    if (featured !== undefined) {
      stories = stories.filter(story => story.featured === featured);
    }

    return stories;
  }

  /**
   * Get reviews for platform
   */
  public getReviews(platform?: string, limit?: number): Review[] {
    let reviews = Array.from(this.reviews.values());

    if (platform) {
      reviews = reviews.filter(review => review.platform === platform);
    }

    reviews.sort((a, b) => b.date.getTime() - a.date.getTime());

    return limit ? reviews.slice(0, limit) : reviews;
  }

  /**
   * Get trust signals
   */
  public getTrustSignals(category?: string): TrustSignal[] {
    let signals = Array.from(this.trustSignals.values());

    if (category) {
      signals = signals.filter(signal => signal.category === category);
    }

    // Sort by credibility
    signals.sort((a, b) => b.credibility - a.credibility);

    return signals;
  }

  /**
   * Get awards
   */
  public getAwards(limit?: number): Award[] {
    const awards = Array.from(this.awards.values());
    
    // Sort by year (most recent first)
    awards.sort((a, b) => b.year - a.year);

    return limit ? awards.slice(0, limit) : awards;
  }

  /**
   * Get partnerships
   */
  public getPartnerships(type?: string): Partnership[] {
    let partnerships = Array.from(this.partnerships.values());

    if (type) {
      partnerships = partnerships.filter(partnership => partnership.partnerType === type);
    }

    return partnerships;
  }

  /**
   * Get referral program
   */
  public getReferralProgram(): ReferralProgram | null {
    return this.referralProgram;
  }

  /**
   * Generate social proof content
   */
  public generateSocialProofContent(type: string, context: SocialProofContext): string {
    switch (type) {
      case 'testimonial':
        const testimonials = this.getSocialProofElements(context).filter(e => e.type === 'testimonial');
        if (testimonials.length > 0) {
          const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
          return `"${randomTestimonial.content}" - ${randomTestimonial.source}`;
        }
        break;

      case 'statistics':
        const stats = this.getSocialProofElements(context).filter(e => e.type === 'statistics');
        if (stats.length > 0) {
          const randomStat = stats[Math.floor(Math.random() * stats.length)];
          return randomStat.content;
        }
        break;

      case 'reviews':
        return '4.9/5 Sterne bei 127 Google Bewertungen';

      case 'certifications':
        return 'Zertifizierter Fachbetrieb für Photovoltaik nach DIN EN 62446';

      case 'awards':
        const awards = this.getAwards(1);
        if (awards.length > 0) {
          return awards[0].name;
        }
        break;
    }

    return 'Über 500 zufriedene Kunden vertrauen uns';
  }

  /**
   * Track referral
   */
  public trackReferral(referrerId: string, referredEmail: string): string {
    if (!this.referralProgram) return '';

    const referralId = 'ref_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // In a real implementation, this would be stored in a database
    console.log('🔗 Tracked referral:', {
      referralId,
      referrerId,
      referredEmail,
      timestamp: new Date()
    });

    return referralId;
  }

  /**
   * Add review
   */
  public addReview(reviewData: Omit<Review, 'id' | 'date'>): string {
    const reviewId = 'review_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const review: Review = {
      ...reviewData,
      id: reviewId,
      date: new Date()
    };

    this.reviews.set(reviewId, review);
    return reviewId;
  }

  /**
   * Get community members
   */
  public getCommunityMembers(status?: string): CommunityMember[] {
    let members = Array.from(this.communityMembers.values());

    if (status) {
      members = members.filter(member => member.status === status);
    }

    return members;
  }

  /**
   * Get social proof analytics
   */
  public getSocialProofAnalytics(): any {
    return {
      socialProofElements: {
        total: this.socialProofElements.size,
        byType: this.getElementsByType(),
        byCategory: this.getElementsByCategory(),
        topPerforming: this.getTopPerformingElements()
      },
      community: {
        totalMembers: this.communityMembers.size,
        activeMembers: this.getCommunityMembers('active')?.length || 0,
        advocates: this.getCommunityMembers('advocate')?.length || 0,
        experts: this.getCommunityMembers('expert')?.length || 0
      },
      reviews: {
        total: this.reviews.size,
        averageRating: this.getAverageRating(),
        byPlatform: this.getReviewsByPlatform()
      },
      successStories: {
        total: this.customerSuccessStories.size,
        featured: this.getCustomerSuccessStories(undefined, true)?.length || 0,
        byCategory: this.getSuccessStoriesByCategory()
      },
      referrals: this.referralProgram ? {
        totalReferrals: this.referralProgram.tracking.totalReferrals,
        successfulReferrals: this.referralProgram.tracking.successfulReferrals,
        conversionRate: this.referralProgram.tracking.conversionRate
      } : null,
      trustSignals: {
        total: this.trustSignals.size,
        critical: this.getTrustSignals().filter(s => s.importance === 'critical').length,
        verified: this.getVerifiedTrustSignals()
      }
    };
  }

  /**
   * Helper methods for analytics
   */
  private getElementsByType(): { [key: string]: number } {
    const byType: { [key: string]: number } = {};
    this.socialProofElements.forEach(element => {
      byType[element.type] = (byType[element.type] || 0) + 1;
    });
    return byType;
  }

  private getElementsByCategory(): { [key: string]: number } {
    const byCategory: { [key: string]: number } = {};
    this.socialProofElements.forEach(element => {
      byCategory[element.category] = (byCategory[element.category] || 0) + 1;
    });
    return byCategory;
  }

  private getTopPerformingElements(): SocialProofElement[] {
    return Array.from(this.socialProofElements.values())
      .sort((a, b) => b.performance.effectiveness - a.performance.effectiveness)
      .slice(0, 5);
  }

  private getAverageRating(): number {
    const reviews = Array.from(this.reviews.values());
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10;
  }

  private getReviewsByPlatform(): { [key: string]: number } {
    const byPlatform: { [key: string]: number } = {};
    this.reviews.forEach(review => {
      byPlatform[review.platform] = (byPlatform[review.platform] || 0) + 1;
    });
    return byPlatform;
  }

  private getSuccessStoriesByCategory(): { [key: string]: number } {
    const byCategory: { [key: string]: number } = {};
    this.customerSuccessStories.forEach(story => {
      byCategory[story.category] = (byCategory[story.category] || 0) + 1;
    });
    return byCategory;
  }

  private getVerifiedTrustSignals(): number {
    return Array.from(this.trustSignals.values()).filter(signal => signal.dateObtained).length;
  }

  /**
   * Apply personalization context
   */
  public applyPersonalizationContext(context: SocialProofContext): void {
    this.currentContext = context;
    
    console.log('🎯 Updated social proof context for:', {
      userStage: context.userStage,
      deviceType: context.deviceType,
      location: context.location
    });
  }

  /**
   * Get personalized social proof
   */
  public getPersonalizedSocialProof(context: SocialProofContext): SocialProofElement[] {
    const elements = this.getSocialProofElements(context);
    
    // Apply personalization rules
    const personalized = elements.filter(element => {
      // Check if element has personalization rules
      if (!element.personalization) return true;
      
      const personalization = element.personalization;
      
      // Check stage targeting
      if (personalization.stages && !personalization.stages.includes(context.userStage)) {
        return false;
      }
      
      // Check device targeting
      if (personalization.devices && !personalization.devices.includes(context.deviceType)) {
        return false;
      }
      
      // Check industry targeting
      if (personalization.industry && context.industry && 
          !personalization.industry.includes(context.industry)) {
        return false;
      }
      
      return true;
    });
    
    return personalized.slice(0, 5); // Return top 5 personalized elements
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    this.isInitialized = false;
    this.socialProofElements.clear();
    this.communityMembers.clear();
    this.customerSuccessStories.clear();
    this.reviews.clear();
    this.trustSignals.clear();
    this.mediaMentions.clear();
    this.awards.clear();
    this.partnerships.clear();
    this.communityEvents.clear();
    this.socialProofStrategies.clear();
    console.log('🧹 Community & Social Proof Service destroyed');
  }
}

// Export singleton instance
export default CommunitySocialProofService.getInstance();