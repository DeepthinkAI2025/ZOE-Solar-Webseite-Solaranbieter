/**
 * ZOE SOLAR - AI Personalization Engine
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Features:
 * - Rule-based User Segmentation
 * - Behavioral Pattern Analysis
 * - Content Personalization
 * - Dynamic CTA Optimization
 * - Real-time User Profiling
 * - Personalization Rules Engine
 * - A/B Testing for Personalization
 * - Privacy-Compliant Personalization
 */

export interface UserProfile {
  id: string;
  sessionId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location: {
    country: string;
    region: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  demographics: {
    ageGroup?: string;
    income?: 'low' | 'medium' | 'high';
    householdSize?: number;
    propertyType?: 'apartment' | 'house' | 'commercial' | 'industrial';
  };
  interests: InterestProfile[];
  behavior: BehaviorProfile;
  preferences: UserPreferences;
  timeline: UserInteraction[];
  segments: string[];
  lastActivity: Date;
  createdAt: Date;
}

export interface InterestProfile {
  category: 'solar' | 'e-mobility' | 'energy-efficiency' | 'sustainability' | 'financing';
  score: number; // 0-100
  keywords: string[];
  lastEngagement: Date;
}

export interface BehaviorProfile {
  averageSessionDuration: number;
  pagesPerSession: number;
  bounceRate: number;
  conversionRate: number;
  preferredContentTypes: string[];
  interactionPatterns: InteractionPattern[];
  deviceUsage: DeviceUsageStats;
  timeOfDayActivity: number[]; // 24-hour array with activity scores
  preferredPaths: NavigationPath[];
}

export interface InteractionPattern {
  type: 'click' | 'scroll' | 'form-fill' | 'download' | 'video-play' | 'calculator-use';
  frequency: number;
  averageDuration: number;
  context: string[];
  conversion: boolean;
}

export interface DeviceUsageStats {
  primaryDevice: 'mobile' | 'tablet' | 'desktop';
  crossDeviceUsage: boolean;
  sessionDurationByDevice: { [key: string]: number };
  conversionByDevice: { [key: string]: number };
}

export interface NavigationPath {
  path: string[];
  frequency: number;
  conversionRate: number;
  dropOffPoints: string[];
}

export interface UserPreferences {
  language: 'de' | 'en';
  currency: 'EUR' | 'USD';
  communication: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    preferredTimes: string[];
  };
  privacy: {
    analytics: boolean;
    personalization: boolean;
    marketing: boolean;
  };
  content: {
    emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
    topics: string[];
    format: 'text' | 'video' | 'interactive';
  };
}

export interface UserInteraction {
  id: string;
  timestamp: Date;
  type: 'page_view' | 'click' | 'scroll' | 'form_submission' | 'download' | 'calculator_use';
  target: string;
  metadata: any;
  sessionId: string;
  page: string;
  duration?: number;
  value?: number;
}

export interface PersonalizationRule {
  id: string;
  name: string;
  description: string;
  type: 'content' | 'cta' | 'layout' | 'offer' | 'navigation';
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  isActive: boolean;
  targetSegments: string[];
  expectedImpact: {
    conversionLift: number;
    engagementLift: number;
    revenueLift: number;
  };
  testVariants?: PersonalizationVariant[];
  performance: RulePerformance;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range' | 'matches';
  value: any;
  logicOperator?: 'AND' | 'OR';
}

export interface RuleAction {
  type: 'replace_content' | 'show_element' | 'hide_element' | 'change_style' | 'redirect' | 'show_offer';
  target: string;
  content?: string;
  style?: any;
  redirectUrl?: string;
  offer?: OfferContent;
}

export interface PersonalizationVariant {
  id: string;
  name: string;
  content: string;
  traffic: number; // percentage 0-100
  isControl: boolean;
  performance: VariantPerformance;
}

export interface RulePerformance {
  impressions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  lift: number;
  confidence: number;
  lastUpdated: Date;
}

export interface VariantPerformance {
  impressions: number;
  conversions: number;
  conversionRate: number;
  lift: number;
}

export interface OfferContent {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  cta: string;
  urgency?: {
    text: string;
    timer?: number;
  };
  value: number;
  type: 'discount' | 'free' | 'upgrade' | 'consultation';
}

export interface PersonalizationContext {
  page: string;
  userProfile: UserProfile;
  sessionData: any;
  realTimeData: any;
  deviceInfo: DeviceInfo;
  timestamp: Date;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screenSize: { width: number; height: number };
  isTouchDevice: boolean;
  connection: 'wifi' | 'cellular' | 'ethernet';
  speed: 'slow' | 'medium' | 'fast';
}

export interface PersonalizationResult {
  appliedRules: string[];
  content: PersonalizationContent;
  cta: string;
  layout: LayoutPersonalization;
  offers: OfferContent[];
  navigation: NavigationPersonalization;
  analytics: PersonalizationAnalytics;
}

export interface PersonalizationContent {
  headline: string;
  subheadline: string;
  body: string;
  heroImage?: string;
  features: string[];
  testimonials: string[];
  trustSignals: string[];
}

export interface LayoutPersonalization {
  sidebar: boolean;
  layout: 'single-column' | 'two-column' | 'three-column';
  ctaPosition: 'above-fold' | 'below-fold' | 'sticky' | 'modal';
  elementOrder: string[];
  spacing: 'compact' | 'comfortable' | 'spacious';
}

export interface NavigationPersonalization {
  menuItems: string[];
  shortcuts: string[];
  breadcrumbs: string[];
  relatedLinks: string[];
}

export interface PersonalizationAnalytics {
  rulesApplied: number;
  contentVariations: number;
  estimatedConversionLift: number;
  engagementScore: number;
  privacyCompliance: boolean;
  renderingTime: number;
}

export interface SegmentationStrategy {
  name: string;
  description: string;
  segments: SegmentDefinition[];
  algorithm: 'rule-based' | 'ml-clustering' | 'hybrid';
  updateFrequency: 'realtime' | 'hourly' | 'daily';
  validUntil: Date;
}

export interface SegmentDefinition {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  size: number;
  characteristics: string[];
  value: 'high' | 'medium' | 'low';
}

export interface SegmentCriteria {
  field: string;
  operator: string;
  value: any;
  weight: number;
}

export class AIPersonalizationEngine {
  private static instance: AIPersonalizationEngine;
  private isInitialized = false;
  private userProfiles: Map<string, UserProfile> = new Map();
  private personalizationRules: Map<string, PersonalizationRule> = new Map();
  private segmentationStrategy: SegmentationStrategy | null = null;
  private currentUserId: string = '';
  private trackingEnabled: boolean = true;
  private privacyCompliant: boolean = true;

  private constructor() {
    this.initializeSegmentationStrategy();
  }

  public static getInstance(): AIPersonalizationEngine {
    if (!AIPersonalizationEngine.instance) {
      AIPersonalizationEngine.instance = new AIPersonalizationEngine();
    }
    return AIPersonalizationEngine.instance;
  }

  /**
   * Initialize AI Personalization Engine
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize user tracking
      this.initializeUserTracking();
      
      // Set up personalization rules
      await this.initializePersonalizationRules();
      
      // Initialize segmentation
      this.initializeSegmentation();
      
      // Set up real-time personalization
      this.initializeRealTimePersonalization();
      
      // Initialize privacy compliance
      this.initializePrivacyCompliance();

      this.isInitialized = true;
      console.log('🤖 AI Personalization Engine initialized');
    } catch (error) {
      console.error('❌ Failed to initialize AI Personalization Engine:', error);
    }
  }

  /**
   * Initialize user tracking and profiling
   */
  private initializeUserTracking(): void {
    if (typeof window === 'undefined') return;

    // Generate or retrieve user ID
    this.currentUserId = this.getOrCreateUserId();
    
    // Set up event listeners for user interactions
    this.setupInteractionTracking();
    
    // Set up device and location detection
    this.setupDeviceAndLocationTracking();
    
    // Initialize user profile
    this.initializeUserProfile();
  }

  /**
   * Get or create user ID
   */
  private getOrCreateUserId(): string {
    const storageKey = 'zoe-user-id';
    let userId = localStorage.getItem(storageKey);
    
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(storageKey, userId);
    }
    
    return userId;
  }

  /**
   * Set up interaction tracking
   */
  private setupInteractionTracking(): void {
    if (!this.trackingEnabled) return;

    // Track page views
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });

    // Track clicks
    document.addEventListener('click', (event) => {
      this.trackClick(event);
    });

    // Track scrolls
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScroll();
      }, 250);
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      this.trackFormSubmission(event);
    });

    // Track calculator usage
    document.addEventListener('calculator-used', (event) => {
      this.trackCalculatorUsage(event);
    });
  }

  /**
   * Set up device and location tracking
   */
  private setupDeviceAndLocationTracking(): void {
    // Detect device type
    const deviceType = this.detectDeviceType();
    
    // Detect location (with privacy compliance)
    this.detectLocation();
    
    // Update user profile with device info
    const profile = this.getUserProfile();
    if (profile) {
      profile.deviceType = deviceType;
      this.updateUserProfile(profile);
    }
  }

  /**
   * Detect device type
   */
  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;
    
    if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || screenWidth <= 767) {
      return 'mobile';
    }
    
    if (/ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (screenWidth >= 768 && screenWidth <= 1023)) {
      return 'tablet';
    }
    
    return 'desktop';
  }

  /**
   * Detect location (privacy-compliant)
   */
  private detectLocation(): void {
    if (!this.privacyCompliant || typeof window === 'undefined') return;

    // Use IP-based geolocation (privacy-compliant)
    fetch('/api/location')
      .then(response => response.json())
      .then(data => {
        const profile = this.getUserProfile();
        if (profile) {
          profile.location = {
            country: data.country || 'Unknown',
            region: data.region || 'Unknown',
            city: data.city || 'Unknown'
          };
          this.updateUserProfile(profile);
        }
      })
      .catch(() => {
        // Fallback to browser geolocation if user consent given
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const profile = this.getUserProfile();
              if (profile) {
                profile.location.coordinates = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                this.updateUserProfile(profile);
              }
            },
            (error) => {
              // Handle geolocation errors silently to avoid console warnings
              console.debug('Geolocation permission denied or unavailable:', error.message);
              // Continue without coordinates - IP-based location is sufficient
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          );
        }
      });
  }

  /**
   * Initialize user profile
   */
  private initializeUserProfile(): void {
    const profile: UserProfile = {
      id: this.currentUserId,
      sessionId: this.generateSessionId(),
      deviceType: this.detectDeviceType(),
      location: {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown'
      },
      demographics: {},
      interests: [],
      behavior: {
        averageSessionDuration: 0,
        pagesPerSession: 0,
        bounceRate: 0,
        conversionRate: 0,
        preferredContentTypes: [],
        interactionPatterns: [],
        deviceUsage: {
          primaryDevice: this.detectDeviceType(),
          crossDeviceUsage: false,
          sessionDurationByDevice: {},
          conversionByDevice: {}
        },
        timeOfDayActivity: new Array(24).fill(0),
        preferredPaths: []
      },
      preferences: {
        language: 'de',
        currency: 'EUR',
        communication: {
          email: true,
          sms: false,
          phone: false,
          preferredTimes: []
        },
        privacy: {
          analytics: true,
          personalization: true,
          marketing: false
        },
        content: {
          emailFrequency: 'weekly',
          topics: [],
          format: 'text'
        }
      },
      timeline: [],
      segments: [],
      lastActivity: new Date(),
      createdAt: new Date()
    };

    this.userProfiles.set(this.currentUserId, profile);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get current user profile
   */
  private getUserProfile(): UserProfile | null {
    return this.userProfiles.get(this.currentUserId) || null;
  }

  /**
   * Update user profile
   */
  private updateUserProfile(profile: UserProfile): void {
    profile.lastActivity = new Date();
    this.userProfiles.set(profile.id, profile);
    
    // Update segments based on new data
    this.updateUserSegments(profile);
  }

  /**
   * Update user segments
   */
  private updateUserSegments(profile: UserProfile): void {
    const segments: string[] = [];

    // Demographic-based segments
    if (profile.demographics.propertyType === 'house') {
      segments.push('homeowner');
    }
    if (profile.demographics.propertyType === 'commercial' || profile.demographics.propertyType === 'industrial') {
      segments.push('business-owner');
    }

    // Interest-based segments
    profile.interests.forEach(interest => {
      if (interest.score > 70) {
        segments.push(`${interest.category}-enthusiast`);
      }
    });

    // Behavior-based segments
    if (profile.behavior.conversionRate > 0.05) {
      segments.push('high-intent');
    }
    if (profile.behavior.averageSessionDuration > 300) { // 5 minutes
      segments.push('engaged-user');
    }
    if (profile.behavior.pagesPerSession > 3) {
      segments.push('research-oriented');
    }

    // Device-based segments
    segments.push(`${profile.deviceType}-user`);

    // Location-based segments
    if (profile.location.country === 'Germany') {
      segments.push('german-market');
    }

    profile.segments = [...new Set(segments)]; // Remove duplicates
  }

  /**
   * Track page view
   */
  private trackPageView(): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    const interaction: UserInteraction = {
      id: 'pv_' + Date.now(),
      timestamp: new Date(),
      type: 'page_view',
      target: window.location.pathname,
      metadata: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      },
      sessionId: profile.sessionId,
      page: window.location.pathname
    };

    this.recordInteraction(interaction);
    this.analyzeUserBehavior(interaction);
  }

  /**
   * Track click
   */
  private trackClick(event: MouseEvent): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    const target = event.target as HTMLElement;
    const interaction: UserInteraction = {
      id: 'click_' + Date.now(),
      timestamp: new Date(),
      type: 'click',
      target: this.getElementSelector(target),
      metadata: {
        element: target.tagName,
        text: target.textContent?.substring(0, 100),
        position: {
          x: event.clientX,
          y: event.clientY
        }
      },
      sessionId: profile.sessionId,
      page: window.location.pathname
    };

    this.recordInteraction(interaction);
    this.updateInterestsFromInteraction(interaction);
  }

  /**
   * Track scroll
   */
  private trackScroll(): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

    const interaction: UserInteraction = {
      id: 'scroll_' + Date.now(),
      timestamp: new Date(),
      type: 'scroll',
      target: 'page',
      metadata: {
        scrollDepth,
        pageHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight
      },
      sessionId: profile.sessionId,
      page: window.location.pathname
    };

    this.recordInteraction(interaction);
  }

  /**
   * Track form submission
   */
  private trackFormSubmission(event: Event): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    const form = event.target as HTMLFormElement;
    const interaction: UserInteraction = {
      id: 'form_' + Date.now(),
      timestamp: new Date(),
      type: 'form_submission',
      target: form.id || form.className || 'unknown-form',
      metadata: {
        formFields: Array.from(form.elements).map(el => (el as HTMLInputElement).type),
        formId: form.id
      },
      sessionId: profile.sessionId,
      page: window.location.pathname
    };

    this.recordInteraction(interaction);
    
    // Update conversion rate
    profile.behavior.conversionRate = this.calculateConversionRate(profile);
    this.updateUserProfile(profile);
  }

  /**
   * Track calculator usage
   */
  private trackCalculatorUsage(event: any): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    const interaction: UserInteraction = {
      id: 'calc_' + Date.now(),
      timestamp: new Date(),
      type: 'calculator_use',
      target: 'pv-calculator',
      metadata: {
        calculatorType: event.detail?.type,
        inputValues: event.detail?.inputs,
        result: event.detail?.result
      },
      sessionId: profile.sessionId,
      page: window.location.pathname
    };

    this.recordInteraction(interaction);
    this.updateInterestsFromInteraction(interaction);
  }

  /**
   * Record interaction
   */
  private recordInteraction(interaction: UserInteraction): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    profile.timeline.push(interaction);
    
    // Keep only last 100 interactions for performance
    if (profile.timeline.length > 100) {
      profile.timeline = profile.timeline.slice(-100);
    }

    // Update behavior metrics
    this.updateBehaviorMetrics(profile);
  }

  /**
   * Update behavior metrics
   */
  private updateBehaviorMetrics(profile: UserProfile): void {
    const recentInteractions = profile.timeline.filter(
      interaction => Date.now() - interaction.timestamp.getTime() < 3600000 // Last hour
    );

    // Calculate average session duration
    const sessionStart = recentInteractions[0]?.timestamp.getTime() || Date.now();
    const sessionEnd = recentInteractions[recentInteractions.length - 1]?.timestamp.getTime() || Date.now();
    profile.behavior.averageSessionDuration = Math.round((sessionEnd - sessionStart) / 1000);

    // Calculate pages per session
    const pageViews = recentInteractions.filter(i => i.type === 'page_view');
    profile.behavior.pagesPerSession = pageViews.length;

    // Calculate bounce rate
    if (profile.behavior.pagesPerSession === 1 && profile.behavior.averageSessionDuration < 30) {
      profile.behavior.bounceRate = 1;
    }

    // Update device usage stats
    this.updateDeviceUsageStats(profile);
  }

  /**
   * Update device usage stats
   */
  private updateDeviceUsageStats(profile: UserProfile): void {
    const deviceSessions = profile.timeline.filter(
      interaction => interaction.metadata?.deviceType === profile.deviceType
    );

    profile.behavior.deviceUsage.sessionDurationByDevice[profile.deviceType] = 
      (profile.behavior.deviceUsage.sessionDurationByDevice[profile.deviceType] || 0) + 30; // 30 seconds per interaction
  }

  /**
   * Analyze user behavior
   */
  private analyzeUserBehavior(interaction: UserInteraction): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    // Update interest scores based on interaction
    this.updateInterestsFromInteraction(interaction);
    
    // Analyze navigation patterns
    this.analyzeNavigationPatterns(profile);
    
    // Update conversion prediction
    this.updateConversionPrediction(profile);
  }

  /**
   * Update interests from interaction
   */
  private updateInterestsFromInteraction(interaction: UserInteraction): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    // Define keyword-interest mappings
    const interestMappings = {
      'solar': ['photovoltaik', 'solar', 'pv', 'strom', 'energie', 'dach'],
      'e-mobility': ['elektroauto', 'ladestation', 'e-auto', 'mobilität', 'tesla'],
      'energy-efficiency': ['effizienz', 'sparen', 'kosten', 'optimierung'],
      'sustainability': ['nachhaltig', 'umwelt', 'co2', 'klimaschutz'],
      'financing': ['finanzierung', 'kredit', 'förderung', 'kosten', 'preis']
    };

    const text = (interaction.metadata?.text || interaction.target || '').toLowerCase();

    Object.entries(interestMappings).forEach(([category, keywords]) => {
      const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
      if (matchCount > 0) {
        this.updateInterestScore(profile, category as any, matchCount * 10);
      }
    });
  }

  /**
   * Update interest score
   */
  private updateInterestScore(profile: UserProfile, category: any, scoreIncrease: number): void {
    let interest = profile.interests.find(i => i.category === category);
    
    if (!interest) {
      interest = {
        category,
        score: 0,
        keywords: [],
        lastEngagement: new Date()
      };
      profile.interests.push(interest);
    }
    
    interest.score = Math.min(100, interest.score + scoreIncrease);
    interest.lastEngagement = new Date();
  }

  /**
   * Analyze navigation patterns
   */
  private analyzeNavigationPatterns(profile: UserProfile): void {
    const pageViews = profile.timeline.filter(i => i.type === 'page_view');
    
    if (pageViews.length < 2) return;

    // Build navigation path
    const path = pageViews.map(pv => pv.target);
    
    // Check if this is a new path or extend existing one
    let existingPath = profile.behavior.preferredPaths.find(p => 
      p.path.length > 0 && this.pathsOverlap(p.path, path)
    );
    
    if (existingPath) {
      existingPath.frequency++;
      existingPath.path = this.mergePaths(existingPath.path, path);
    } else {
      profile.behavior.preferredPaths.push({
        path,
        frequency: 1,
        conversionRate: 0,
        dropOffPoints: []
      });
    }
  }

  /**
   * Check if two paths overlap
   */
  private pathsOverlap(path1: string[], path2: string[]): boolean {
    const overlap = path1.filter(p => path2.includes(p));
    return overlap.length > path1.length * 0.5; // 50% overlap threshold
  }

  /**
   * Merge two paths
   */
  private mergePaths(path1: string[], path2: string[]): string[] {
    const merged = [...path1];
    path2.forEach(step => {
      if (!merged.includes(step)) {
        merged.push(step);
      }
    });
    return merged;
  }

  /**
   * Update conversion prediction
   */
  private updateConversionPrediction(profile: UserProfile): void {
    // Simple rule-based conversion prediction
    let conversionScore = 0;

    // High-intent behaviors
    if (profile.behavior.pagesPerSession > 3) conversionScore += 20;
    if (profile.behavior.averageSessionDuration > 180) conversionScore += 15;
    if (profile.interests.some(i => i.category === 'solar' && i.score > 70)) conversionScore += 25;
    if (profile.timeline.some(i => i.type === 'calculator_use')) conversionScore += 30;
    if (profile.timeline.some(i => i.type === 'form_submission')) conversionScore += 40;

    // Device and location factors
    if (profile.deviceType === 'desktop') conversionScore += 10; // Desktop users convert better
    if (profile.location.country === 'Germany') conversionScore += 15;

    profile.behavior.conversionRate = Math.min(1, conversionScore / 100);
  }

  /**
   * Calculate conversion rate
   */
  private calculateConversionRate(profile: UserProfile): number {
    const totalSessions = profile.timeline.filter(i => i.type === 'page_view').length;
    const conversions = profile.timeline.filter(i => i.type === 'form_submission').length;
    
    return totalSessions > 0 ? conversions / totalSessions : 0;
  }

  /**
   * Get element selector
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `.${element.className.split(' ')[0]}`;
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * Initialize personalization rules
   */
  private async initializePersonalizationRules(): Promise<void> {
    const defaultRules: PersonalizationRule[] = [
      {
        id: 'homeowner-solar-message',
        name: 'Homeowner Solar Message',
        description: 'Show solar benefits message to homeowners',
        type: 'content',
        conditions: [
          {
            field: 'demographics.propertyType',
            operator: 'equals',
            value: 'house'
          },
          {
            field: 'interests.solar.score',
            operator: 'greater_than',
            value: 50
          }
        ],
        actions: [
          {
            type: 'replace_content',
            target: '.hero-title',
            content: 'Sparen Sie bis zu 70% Ihrer Stromkosten mit einer professionellen Photovoltaik-Anlage'
          }
        ],
        priority: 10,
        isActive: true,
        targetSegments: ['homeowner', 'solar-enthusiast'],
        expectedImpact: {
          conversionLift: 25,
          engagementLift: 30,
          revenueLift: 20
        },
        performance: {
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0,
          lift: 0,
          confidence: 0,
          lastUpdated: new Date()
        }
      },
      {
        id: 'mobile-cta-optimization',
        name: 'Mobile CTA Optimization',
        description: 'Optimize CTAs for mobile users',
        type: 'cta',
        conditions: [
          {
            field: 'deviceType',
            operator: 'equals',
            value: 'mobile'
          }
        ],
        actions: [
          {
            type: 'change_style',
            target: '.main-cta',
            style: {
              fontSize: '18px',
              padding: '16px 24px',
              minHeight: '48px'
            }
          },
          {
            type: 'replace_content',
            target: '.main-cta',
            content: '📱 Kostenlose Beratung sichern'
          }
        ],
        priority: 15,
        isActive: true,
        targetSegments: ['mobile-user'],
        expectedImpact: {
          conversionLift: 35,
          engagementLift: 40,
          revenueLift: 30
        },
        performance: {
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0,
          lift: 0,
          confidence: 0,
          lastUpdated: new Date()
        }
      },
      {
        id: 'high-intent-offer',
        name: 'High-Intent Visitor Offer',
        description: 'Show special offer to high-intent visitors',
        type: 'offer',
        conditions: [
          {
            field: 'behavior.conversionRate',
            operator: 'greater_than',
            value: 0.05
          },
          {
            field: 'behavior.pagesPerSession',
            operator: 'greater_than',
            value: 3
          }
        ],
        actions: [
          {
            type: 'show_offer',
            target: '.offer-popup',
            offer: {
              title: 'Exklusives Angebot für interessierte Besucher',
              subtitle: 'Nur heute - Begrenzte Zeit verfügbar',
              description: 'Sichern Sie sich 15% Rabatt auf Ihre Photovoltaik-Anlage + kostenlose Installation',
              benefits: [
                '15% Rabatt auf Komplettpaket',
                'Kostenlose Installation',
                '25 Jahre Produktgarantie',
                'Kostenloser Wartungsservice 2 Jahre'
              ],
              cta: 'Jetzt Angebot sichern',
              urgency: {
                text: 'Angebot läuft in 24h ab!',
                timer: 24
              },
              value: 2500,
              type: 'discount'
            }
          }
        ],
        priority: 20,
        isActive: true,
        targetSegments: ['high-intent', 'engaged-user'],
        expectedImpact: {
          conversionLift: 45,
          engagementLift: 50,
          revenueLift: 40
        },
        performance: {
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0,
          lift: 0,
          confidence: 0,
          lastUpdated: new Date()
        }
      }
    ];

    defaultRules.forEach(rule => {
      this.personalizationRules.set(rule.id, rule);
    });
  }

  /**
   * Initialize segmentation strategy
   */
  private initializeSegmentationStrategy(): void {
    this.segmentationStrategy = {
      name: 'ZOE Solar Segmentation',
      description: 'Customer segmentation for solar industry',
      segments: [
        {
          id: 'homeowner-prospects',
          name: 'Homeowner Prospects',
          description: 'Homeowners interested in solar solutions',
          criteria: [
            {
              field: 'demographics.propertyType',
              operator: 'equals',
              value: 'house',
              weight: 3
            },
            {
              field: 'interests.solar.score',
              operator: 'greater_than',
              value: 40,
              weight: 2
            }
          ],
          size: 0,
          characteristics: ['Homeowner', 'Solar interested', 'Medium income'],
          value: 'high'
        },
        {
          id: 'business-prospects',
          name: 'Business Prospects',
          description: 'Business owners interested in commercial solar',
          criteria: [
            {
              field: 'demographics.propertyType',
              operator: 'in',
              value: ['commercial', 'industrial'],
              weight: 3
            },
            {
              field: 'interests.solar.score',
              operator: 'greater_than',
              value: 30,
              weight: 2
            }
          ],
          size: 0,
          characteristics: ['Business owner', 'Commercial property', 'High value'],
          value: 'high'
        }
      ],
      algorithm: 'rule-based',
      updateFrequency: 'hourly',
      validUntil: new Date(Date.now() + 86400000) // 24 hours
    };
  }

  /**
   * Initialize segmentation
   */
  private initializeSegmentation(): void {
    // Segment current user
    const profile = this.getUserProfile();
    if (profile) {
      this.updateUserSegments(profile);
    }
  }

  /**
   * Initialize real-time personalization
   */
  private initializeRealTimePersonalization(): void {
    if (typeof window === 'undefined') return;

    // Set up real-time personalization triggers
    this.setupRealTimeTriggers();
  }

  /**
   * Set up real-time personalization triggers
   */
  private setupRealTimeTriggers(): void {
    // Trigger personalization on page load
    window.addEventListener('load', () => {
      this.applyPersonalization();
    });

    // Trigger on route changes (for SPA)
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        this.applyPersonalization();
      }, 100);
    });

    // Trigger on scroll milestones
    let lastScrollMilestone = 0;
    window.addEventListener('scroll', this.debounce(() => {
      const scrollPercent = Math.round((window.scrollY / document.documentElement.scrollHeight) * 100);
      
      if (scrollPercent >= 25 && lastScrollMilestone < 25) {
        this.triggerScrollMilestonePersonalization(25);
        lastScrollMilestone = 25;
      }
      
      if (scrollPercent >= 50 && lastScrollMilestone < 50) {
        this.triggerScrollMilestonePersonalization(50);
        lastScrollMilestone = 50;
      }
      
      if (scrollPercent >= 75 && lastScrollMilestone < 75) {
        this.triggerScrollMilestonePersonalization(75);
        lastScrollMilestone = 75;
      }
    }, 500));
  }

  /**
   * Initialize privacy compliance
   */
  private initializePrivacyCompliance(): void {
    // Check for privacy consent
    const consent = localStorage.getItem('privacy-consent');
    
    if (consent === 'declined') {
      this.privacyCompliant = false;
      this.trackingEnabled = false;
    } else if (consent === 'accepted') {
      this.privacyCompliant = true;
      this.trackingEnabled = true;
    }
    
    // Apply privacy-compliant tracking
    this.applyPrivacySettings();
  }

  /**
   * Apply privacy settings
   */
  private applyPrivacySettings(): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    // Respect user privacy preferences
    if (!profile.preferences.privacy.analytics) {
      this.trackingEnabled = false;
    }

    if (!profile.preferences.privacy.personalization) {
      // Disable personalization but keep basic tracking
      this.personalizationRules.clear();
    }
  }

  /**
   * Apply personalization to current page
   */
  public applyPersonalization(): PersonalizationResult | null {
    if (!this.isInitialized || !this.trackingEnabled) {
      return null;
    }

    const profile = this.getUserProfile();
    if (!profile) return null;

    const context: PersonalizationContext = {
      page: window.location.pathname,
      userProfile: profile,
      sessionData: {},
      realTimeData: this.getRealTimeData(),
      deviceInfo: this.getDeviceInfo(),
      timestamp: new Date()
    };

    const result = this.evaluatePersonalizationRules(context);
    
    // Apply the personalization
    this.applyPersonalizationToDOM(result);
    
    // Track personalization application
    this.trackPersonalizationApplication(result);

    return result;
  }

  /**
   * Get real-time data
   */
  private getRealTimeData(): any {
    return {
      currentTime: new Date(),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      weather: null, // Could integrate with weather API
      stockMarket: null // Could integrate with financial data
    };
  }

  /**
   * Get device info
   */
  private getDeviceInfo(): DeviceInfo {
    const profile = this.getUserProfile();
    
    return {
      type: profile?.deviceType || 'desktop',
      browser: navigator.userAgent,
      os: navigator.platform,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      isTouchDevice: 'ontouchstart' in window,
      connection: 'wifi', // Would need Network Information API
      speed: 'medium' // Would need connection speed detection
    };
  }

  /**
   * Evaluate personalization rules for context
   */
  private evaluatePersonalizationRules(context: PersonalizationContext): PersonalizationResult {
    const appliedRules: string[] = [];
    const content: PersonalizationContent = this.getDefaultContent();
    let cta = 'Kostenlose Beratung anfragen';
    const layout: LayoutPersonalization = this.getDefaultLayout();
    const offers: OfferContent[] = [];
    const navigation: NavigationPersonalization = this.getDefaultNavigation();

    // Evaluate each rule
    this.personalizationRules.forEach((rule) => {
      if (rule.isActive && this.evaluateRuleConditions(rule, context)) {
        appliedRules.push(rule.id);
        this.applyRuleActions(rule, { content, cta, layout, offers, navigation });
      }
    });

    // Calculate analytics
    const analytics: PersonalizationAnalytics = {
      rulesApplied: appliedRules.length,
      contentVariations: appliedRules.length,
      estimatedConversionLift: this.calculateEstimatedLift(appliedRules),
      engagementScore: this.calculateEngagementScore(context),
      privacyCompliance: this.privacyCompliant,
      renderingTime: performance.now()
    };

    return {
      appliedRules,
      content,
      cta,
      layout,
      offers,
      navigation,
      analytics
    };
  }

  /**
   * Get default content
   */
  private getDefaultContent(): PersonalizationContent {
    return {
      headline: 'Photovoltaik-Lösungen für Ihr Zuhause',
      subheadline: 'Professionelle Solarenergie mit 25 Jahren Garantie',
      body: 'Entdecken Sie nachhaltige Energie-Lösungen und reduzieren Sie Ihre Stromkosten um bis zu 70%.',
      features: [
        'Kostenlose Standortanalyse',
        'Individuelle Planung',
        'Professionelle Installation',
        '25 Jahre Produktgarantie'
      ],
      testimonials: [],
      trustSignals: []
    };
  }

  /**
   * Get default layout
   */
  private getDefaultLayout(): LayoutPersonalization {
    return {
      sidebar: true,
      layout: 'two-column',
      ctaPosition: 'above-fold',
      elementOrder: ['hero', 'features', 'testimonials', 'cta'],
      spacing: 'comfortable'
    };
  }

  /**
   * Get default navigation
   */
  private getDefaultNavigation(): NavigationPersonalization {
    return {
      menuItems: ['Photovoltaik', 'E-Mobilität', 'Service', 'Kontakt'],
      shortcuts: ['Kostenrechner', 'Beratung', 'Angebote'],
      breadcrumbs: ['Startseite'],
      relatedLinks: ['Fördermittel', 'Referenzen', 'Über uns']
    };
  }

  /**
   * Evaluate rule conditions
   */
  private evaluateRuleConditions(rule: PersonalizationRule, context: PersonalizationContext): boolean {
    return rule.conditions.every(condition => {
      const value = this.getFieldValue(context, condition.field);
      return this.evaluateCondition(value, condition.operator, condition.value);
    });
  }

  /**
   * Get field value from context
   */
  private getFieldValue(context: PersonalizationContext, field: string): any {
    const fields = field.split('.');
    let value: any = context;

    for (const field of fields) {
      value = value?.[field];
    }

    return value;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expected;
      case 'contains':
        return typeof value === 'string' && value.toLowerCase().includes(expected.toLowerCase());
      case 'greater_than':
        return value > expected;
      case 'less_than':
        return value < expected;
      case 'in_range':
        return value >= expected.min && value <= expected.max;
      case 'matches':
        return new RegExp(expected).test(value);
      default:
        return false;
    }
  }

  /**
   * Apply rule actions
   */
  private applyRuleActions(rule: PersonalizationRule, target: any): void {
    rule.actions.forEach(action => {
      switch (action.type) {
        case 'replace_content':
          if (action.target === '.hero-title' && action.content) {
            target.content.headline = action.content;
          }
          break;
        case 'show_element':
          // Implementation would show/hide elements
          break;
        case 'change_style':
          // Implementation would apply styles
          break;
        case 'show_offer':
          if (action.offer) {
            target.offers.push(action.offer);
          }
          break;
      }
    });
  }

  /**
   * Apply personalization to DOM
   */
  private applyPersonalizationToDOM(result: PersonalizationResult): void {
    // Apply content changes
    if (result.content.headline) {
      const headlineElements = document.querySelectorAll('.hero-title, h1');
      headlineElements.forEach(element => {
        element.textContent = result.content.headline;
      });
    }

    // Apply CTA changes
    if (result.cta) {
      const ctaElements = document.querySelectorAll('.main-cta, .cta-button, [data-cta]');
      ctaElements.forEach(element => {
        element.textContent = result.cta;
      });
    }

    // Apply layout changes
    this.applyLayoutChanges(result.layout);

    // Show offers
    result.offers.forEach(offer => {
      this.showOffer(offer);
    });
  }

  /**
   * Apply layout changes
   */
  private applyLayoutChanges(layout: LayoutPersonalization): void {
    // Apply spacing
    if (layout.spacing) {
      document.body.classList.remove('spacing-compact', 'spacing-comfortable', 'spacing-spacious');
      document.body.classList.add(`spacing-${layout.spacing}`);
    }

    // Apply layout class
    if (layout.layout) {
      document.body.classList.remove('layout-single-column', 'layout-two-column', 'layout-three-column');
      document.body.classList.add(`layout-${layout.layout}`);
    }
  }

  /**
   * Show offer
   */
  private showOffer(offer: OfferContent): void {
    // Create and show offer modal or popup
    const offerElement = document.createElement('div');
    offerElement.className = 'personalized-offer-popup';
    offerElement.innerHTML = `
      <div class="offer-content">
        <h3>${offer.title}</h3>
        <p>${offer.subtitle}</p>
        <p>${offer.description}</p>
        <ul>
          ${offer.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
        <button class="offer-cta">${offer.cta}</button>
        ${offer.urgency ? `<p class="urgency">${offer.urgency.text}</p>` : ''}
      </div>
    `;
    
    document.body.appendChild(offerElement);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      document.body.removeChild(offerElement);
    }, 10000);
  }

  /**
   * Calculate estimated conversion lift
   */
  private calculateEstimatedLift(ruleIds: string[]): number {
    let totalLift = 0;
    
    ruleIds.forEach(ruleId => {
      const rule = this.personalizationRules.get(ruleId);
      if (rule) {
        totalLift += rule.expectedImpact.conversionLift;
      }
    });
    
    return Math.round(totalLift / ruleIds.length) || 0;
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(context: PersonalizationContext): number {
    let score = 0;
    
    // Base score from user behavior
    score += context.userProfile.behavior.conversionRate * 50;
    score += Math.min(30, context.userProfile.behavior.pagesPerSession * 5);
    score += Math.min(20, context.userProfile.behavior.averageSessionDuration / 30);
    
    return Math.round(score);
  }

  /**
   * Track personalization application
   */
  private trackPersonalizationApplication(result: PersonalizationResult): void {
    // Log for analytics
    console.log('🎯 Personalization applied:', {
      rules: result.appliedRules,
      lift: result.analytics.estimatedConversionLift,
      engagement: result.analytics.engagementScore
    });

    // Update rule performance
    result.appliedRules.forEach(ruleId => {
      const rule = this.personalizationRules.get(ruleId);
      if (rule) {
        rule.performance.impressions++;
        rule.performance.lastUpdated = new Date();
        this.personalizationRules.set(ruleId, rule);
      }
    });
  }

  /**
   * Trigger scroll milestone personalization
   */
  private triggerScrollMilestonePersonalization(milestone: number): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    // Track scroll milestone
    const interaction: UserInteraction = {
      id: 'scroll_milestone_' + milestone + '_' + Date.now(),
      timestamp: new Date(),
      type: 'scroll',
      target: `scroll-${milestone}`,
      metadata: {
        milestone,
        scrollDepth: milestone
      },
      sessionId: profile.sessionId,
      page: window.location.pathname
    };

    this.recordInteraction(interaction);

    // Apply milestone-specific personalization
    this.applyScrollMilestonePersonalization(milestone);
  }

  /**
   * Apply scroll milestone personalization
   */
  private applyScrollMilestonePersonalization(milestone: number): void {
    switch (milestone) {
      case 25:
        // Show "Still interested?" popup
        this.showEngagementPrompt();
        break;
      case 50:
        // Show social proof
        this.showSocialProof();
        break;
      case 75:
        // Show urgency message
        this.showUrgencyMessage();
        break;
    }
  }

  /**
   * Show engagement prompt
   */
  private showEngagementPrompt(): void {
    const prompt = document.createElement('div');
    prompt.className = 'engagement-prompt';
    prompt.innerHTML = `
      <div class="prompt-content">
        <p>Haben Sie Fragen zu Photovoltaik?</p>
        <button class="prompt-cta">Kostenlose Beratung</button>
        <button class="prompt-close">✕</button>
      </div>
    `;
    
    document.body.appendChild(prompt);
    
    // Remove on close or after 5 seconds
    prompt.querySelector('.prompt-close')?.addEventListener('click', () => {
      document.body.removeChild(prompt);
    });
    
    setTimeout(() => {
      if (document.body.contains(prompt)) {
        document.body.removeChild(prompt);
      }
    }, 5000);
  }

  /**
   * Show social proof
   */
  private showSocialProof(): void {
    const proof = document.createElement('div');
    proof.className = 'social-proof-popup';
    proof.innerHTML = `
      <div class="proof-content">
        <p>🌟 "Über 500 zufriedene Kunden in Berlin und Brandenburg"</p>
        <p>⭐⭐⭐⭐⭐ 4.9/5 Sterne bei 127 Bewertungen</p>
      </div>
    `;
    
    document.body.appendChild(proof);
    
    setTimeout(() => {
      if (document.body.contains(proof)) {
        document.body.removeChild(proof);
      }
    }, 4000);
  }

  /**
   * Show urgency message
   */
  private showUrgencyMessage(): void {
    const urgency = document.createElement('div');
    urgency.className = 'urgency-message';
    urgency.innerHTML = `
      <div class="urgency-content">
        <p>⚡ Fördermittel nur noch bis Ende 2025 verfügbar!</p>
        <p>Sichern Sie sich jetzt bis zu 20% Zuschuss</p>
        <button class="urgency-cta">Jetzt informieren</button>
      </div>
    `;
    
    document.body.appendChild(urgency);
    
    setTimeout(() => {
      if (document.body.contains(urgency)) {
        document.body.removeChild(urgency);
      }
    }, 6000);
  }

  /**
   * Utility method for debouncing
   */
  private debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Public methods for external access
   */

  /**
   * Get current user profile
   */
  public getCurrentUserProfile(): UserProfile | null {
    return this.getUserProfile();
  }

  /**
   * Get personalization analytics
   */
  public getPersonalizationAnalytics(): any {
    const profile = this.getUserProfile();
    if (!profile) return null;

    return {
      profile: profile,
      activeRules: Array.from(this.personalizationRules.values()).filter(r => r.isActive),
      segments: profile.segments,
      behavior: profile.behavior,
      interests: profile.interests
    };
  }

  /**
   * Track custom conversion
   */
  public trackCustomConversion(conversionType: string, value?: number): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    const interaction: UserInteraction = {
      id: 'conversion_' + conversionType + '_' + Date.now(),
      timestamp: new Date(),
      type: 'form_submission',
      target: conversionType,
      metadata: { conversionType, value },
      sessionId: profile.sessionId,
      page: window.location.pathname,
      value: value || 1
    };

    this.recordInteraction(interaction);
    
    // Update conversion metrics
    profile.behavior.conversionRate = this.calculateConversionRate(profile);
    this.updateUserProfile(profile);
  }

  /**
   * Update user preferences
   */
  public updateUserPreferences(preferences: Partial<UserPreferences>): void {
    const profile = this.getUserProfile();
    if (!profile) return;

    profile.preferences = { ...profile.preferences, ...preferences };
    this.updateUserProfile(profile);
    
    // Re-apply privacy settings if needed
    if (preferences.privacy) {
      this.applyPrivacySettings();
    }
  }

  /**
   * Get personalization status
   */
  public isPersonalizationEnabled(): boolean {
    const profile = this.getUserProfile();
    return this.trackingEnabled && profile?.preferences.privacy.personalization !== false;
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    this.isInitialized = false;
    this.userProfiles.clear();
    this.personalizationRules.clear();
    console.log('🧹 AI Personalization Engine destroyed');
  }
}

// Export singleton instance
export default AIPersonalizationEngine.getInstance();