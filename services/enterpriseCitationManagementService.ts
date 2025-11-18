import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { multiLocationManagementService } from './multiLocationManagementService';

export interface CitationSource {
  id: string;
  name: string;
  url: string;
  category: 'local' | 'national' | 'industry' | 'social' | 'review' | 'directory';
  domainAuthority: number;
  citationValue: number;
  submissionMethod: 'manual' | 'api' | 'form' | 'email';
  requirements: {
    businessName: boolean;
    address: boolean;
    phone: boolean;
    website: boolean;
    description: boolean;
    categories: boolean;
    hours: boolean;
    photos: boolean;
  };
  lastUpdated: string;
  active: boolean;
}

export interface CitationEntry {
  id: string;
  locationKey: string;
  sourceId: string;
  status: 'active' | 'pending' | 'inconsistent' | 'missing' | 'duplicate' | 'error';
  data: {
    businessName: string;
    address: string;
    phone: string;
    website: string;
    description?: string;
    categories?: string[];
    hours?: string;
    photos?: string[];
  };
  consistency: {
    nameMatch: boolean;
    addressMatch: boolean;
    phoneMatch: boolean;
    websiteMatch: boolean;
    overallScore: number;
  };
  performance: {
    views: number;
    clicks: number;
    reviews: number;
    rating: number;
  };
  lastVerified: string;
  lastUpdated: string;
  createdAt: string;
}

export interface CitationAudit {
  id: string;
  locationKey: string;
  auditDate: string;
  totalCitations: number;
  consistentCitations: number;
  inconsistentCitations: number;
  missingCitations: number;
  duplicateCitations: number;
  napScore: number;
  issues: Array<{
    type: 'inconsistency' | 'missing' | 'duplicate' | 'error';
    sourceId: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
  }>;
  recommendations: string[];
  nextAuditDate: string;
}

export interface CitationCampaign {
  id: string;
  name: string;
  description: string;
  targetLocations: string[];
  targetSources: string[];
  status: 'planning' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  budget: number;
  goals: {
    citationsToCreate: number;
    consistencyTarget: number;
    timeFrame: string;
  };
  progress: {
    citationsCreated: number;
    citationsVerified: number;
    consistencyAchieved: number;
  };
  createdAt: string;
  lastUpdated: string;
}

export interface CitationOptimization {
  citationId: string;
  locationKey: string;
  optimizationType: 'consistency' | 'completeness' | 'seo' | 'engagement';
  currentValue: number;
  targetValue: number;
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  deadline: string;
  createdAt: string;
  completedAt?: string;
}

/**
 * Enterprise Citation Management Service
 * Umfassendes Management von Citations für alle Standorte
 */
export class EnterpriseCitationManagementService {
  private citationSources: Map<string, CitationSource> = new Map();
  private citationEntries: Map<string, CitationEntry[]> = new Map();
  private citationAudits: Map<string, CitationAudit[]> = new Map();
  private citationCampaigns: Map<string, CitationCampaign> = new Map();
  private citationOptimizations: Map<string, CitationOptimization[]> = new Map();

  constructor() {
    this.initializeCitationSources();
    this.initializeCitationEntries();
    this.generateInitialOptimizations();
  }

  /**
   * Initialisiert Citation-Quellen
   */
  private initializeCitationSources(): void {
    const sources: CitationSource[] = [
      {
        id: 'google_business_profile',
        name: 'Google Business Profile',
        url: 'https://www.google.com/business/',
        category: 'local',
        domainAuthority: 100,
        citationValue: 95,
        submissionMethod: 'manual',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: true,
          photos: true
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'bing_places',
        name: 'Bing Places',
        url: 'https://www.bingplaces.com/',
        category: 'local',
        domainAuthority: 95,
        citationValue: 85,
        submissionMethod: 'manual',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: true,
          photos: false
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'yelp',
        name: 'Yelp',
        url: 'https://www.yelp.com/',
        category: 'review',
        domainAuthority: 92,
        citationValue: 80,
        submissionMethod: 'manual',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: true,
          photos: true
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'yellowpages_de',
        name: 'Gelbe Seiten',
        url: 'https://www.gelbeseiten.de/',
        category: 'directory',
        domainAuthority: 85,
        citationValue: 75,
        submissionMethod: 'form',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: false,
          photos: false
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'hotfrog_de',
        name: 'Hotfrog Deutschland',
        url: 'https://www.hotfrog.de/',
        category: 'directory',
        domainAuthority: 65,
        citationValue: 60,
        submissionMethod: 'form',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: false,
          photos: false
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'cylex_de',
        name: 'Cylex Deutschland',
        url: 'https://www.cylex.de/',
        category: 'directory',
        domainAuthority: 55,
        citationValue: 50,
        submissionMethod: 'form',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: false,
          categories: true,
          hours: false,
          photos: false
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'branchenbuch_de',
        name: 'Branchenbuch Deutschland',
        url: 'https://www.branchenbuch-deutschland.de/',
        category: 'directory',
        domainAuthority: 45,
        citationValue: 40,
        submissionMethod: 'form',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: false,
          photos: false
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'werliefertwas_de',
        name: 'Wer liefert was?',
        url: 'https://www.wer-liefert-was.de/',
        category: 'industry',
        domainAuthority: 70,
        citationValue: 65,
        submissionMethod: 'manual',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: false,
          photos: true
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'kompass_de',
        name: 'Kompass Deutschland',
        url: 'https://de.kompass.com/',
        category: 'industry',
        domainAuthority: 75,
        citationValue: 70,
        submissionMethod: 'manual',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: false,
          photos: false
        },
        lastUpdated: new Date().toISOString(),
        active: true
      },
      {
        id: 'facebook_business',
        name: 'Facebook Business',
        url: 'https://business.facebook.com/',
        category: 'social',
        domainAuthority: 98,
        citationValue: 90,
        submissionMethod: 'api',
        requirements: {
          businessName: true,
          address: true,
          phone: true,
          website: true,
          description: true,
          categories: true,
          hours: true,
          photos: true
        },
        lastUpdated: new Date().toISOString(),
        active: true
      }
    ];

    sources.forEach(source => {
      this.citationSources.set(source.id, source);
    });
  }

  /**
   * Initialisiert Citation-Einträge für alle Standorte
   */
  private initializeCitationEntries(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const entries: CitationEntry[] = [];

      Array.from(this.citationSources.values()).forEach(source => {
        const entry: CitationEntry = {
          id: `citation_${locationKey}_${source.id}`,
          locationKey,
          sourceId: source.id,
          status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'pending' : 'missing',
          data: {
            businessName: `ZOE Solar ${region.city}`,
            address: `Musterstraße 123, ${region.postalCode} ${region.city}`,
            phone: '+49-30-123-456-78',
            website: `https://www.zoe-solar.de/standort/${locationKey}`,
            description: `Ihr regionaler Photovoltaik-Spezialist in ${region.city}, ${region.state}. Professionelle Planung, Installation und Wartung von Solaranlagen.`,
            categories: ['Photovoltaik', 'Solaranlagen', 'Erneuerbare Energien'],
            hours: 'Mo-Fr 08:00-17:00',
            photos: [`https://www.zoe-solar.de/images/${locationKey}-1.jpg`]
          },
          consistency: {
            nameMatch: Math.random() > 0.1,
            addressMatch: Math.random() > 0.1,
            phoneMatch: Math.random() > 0.1,
            websiteMatch: Math.random() > 0.1,
            overallScore: Math.floor(Math.random() * 40) + 60
          },
          performance: {
            views: Math.floor(Math.random() * 1000) + 100,
            clicks: Math.floor(Math.random() * 100) + 10,
            reviews: Math.floor(Math.random() * 20),
            rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1))
          },
          lastVerified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString(),
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        };

        entries.push(entry);
      });

      this.citationEntries.set(locationKey, entries);
    });
  }

  /**
   * Generiert initiale Optimierungen
   */
  private generateInitialOptimizations(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const optimizations: CitationOptimization[] = [];

      // Konsistenz-Optimierungen
      optimizations.push({
        citationId: `consistency_${locationKey}`,
        locationKey,
        optimizationType: 'consistency',
        currentValue: 75,
        targetValue: 95,
        recommendations: [
          'NAP-Daten in allen Citations vereinheitlichen',
          'Beschreibungen konsistent halten',
          'Kategorien standardisieren'
        ],
        priority: 'high',
        status: 'pending',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      });

      // Vollständigkeits-Optimierungen
      optimizations.push({
        citationId: `completeness_${locationKey}`,
        locationKey,
        optimizationType: 'completeness',
        currentValue: 60,
        targetValue: 90,
        recommendations: [
          'Fehlende Beschreibungen ergänzen',
          'Öffnungszeiten hinzufügen',
          'Bilder hochladen'
        ],
        priority: 'medium',
        status: 'pending',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      });

      this.citationOptimizations.set(locationKey, optimizations);
    });
  }

  /**
   * Citation-Audit für einen Standort durchführen
   */
  public performCitationAudit(locationKey: string): CitationAudit {
    const entries = this.citationEntries.get(locationKey) || [];
    const locationProfile = multiLocationManagementService.getLocationProfile(locationKey);

    if (!locationProfile) {
      throw new Error(`Standort-Profil für ${locationKey} nicht gefunden`);
    }

    const totalCitations = entries.length;
    const consistentCitations = entries.filter(e => e.consistency.overallScore >= 90).length;
    const inconsistentCitations = entries.filter(e => e.consistency.overallScore < 90 && e.consistency.overallScore >= 70).length;
    const missingCitations = entries.filter(e => e.status === 'missing').length;
    const duplicateCitations = entries.filter(e => e.status === 'duplicate').length;

    const napScore = entries.length > 0 ?
      entries.reduce((sum, e) => sum + e.consistency.overallScore, 0) / entries.length : 0;

    const issues: CitationAudit['issues'] = [];

    // Inconsistency-Issues identifizieren
    entries.forEach(entry => {
      if (entry.consistency.overallScore < 90) {
        const source = this.citationSources.get(entry.sourceId);
        if (source) {
          issues.push({
            type: 'inconsistency',
            sourceId: entry.sourceId,
            description: `NAP-Daten in ${source.name} sind inkonsistent`,
            severity: entry.consistency.overallScore < 70 ? 'high' : 'medium',
            recommendation: 'Daten manuell korrigieren und aktualisieren'
          });
        }
      }

      if (entry.status === 'missing') {
        const source = this.citationSources.get(entry.sourceId);
        if (source) {
          issues.push({
            type: 'missing',
            sourceId: entry.sourceId,
            description: `Citation in ${source.name} fehlt`,
            severity: source.citationValue > 80 ? 'high' : 'medium',
            recommendation: 'Citation manuell erstellen'
          });
        }
      }
    });

    const recommendations = this.generateAuditRecommendations(issues, locationKey);

    const audit: CitationAudit = {
      id: `audit_${locationKey}_${Date.now()}`,
      locationKey,
      auditDate: new Date().toISOString(),
      totalCitations,
      consistentCitations,
      inconsistentCitations,
      missingCitations,
      duplicateCitations,
      napScore: Math.round(napScore),
      issues,
      recommendations,
      nextAuditDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Audit speichern
    const existingAudits = this.citationAudits.get(locationKey) || [];
    existingAudits.push(audit);
    this.citationAudits.set(locationKey, existingAudits);

    return audit;
  }

  /**
   * Audit-Empfehlungen generieren
   */
  private generateAuditRecommendations(issues: CitationAudit['issues'], locationKey: string): string[] {
    const recommendations: string[] = [];

    const highPriorityIssues = issues.filter(i => i.severity === 'high' || i.severity === 'critical');
    if (highPriorityIssues.length > 0) {
      recommendations.push(`${highPriorityIssues.length} kritische Issues sofort beheben`);
    }

    const missingCitations = issues.filter(i => i.type === 'missing');
    if (missingCitations.length > 0) {
      recommendations.push(`${missingCitations.length} fehlende Citations erstellen`);
    }

    const inconsistencyIssues = issues.filter(i => i.type === 'inconsistency');
    if (inconsistencyIssues.length > 0) {
      recommendations.push('NAP-Konsistenz durch Datenbereinigung verbessern');
    }

    if (issues.length === 0) {
      recommendations.push('Citation-Management ist in einem guten Zustand');
    }

    return recommendations;
  }

  /**
   * Citation-Kampagne erstellen
   */
  public createCitationCampaign(campaign: Omit<CitationCampaign, 'id' | 'createdAt' | 'lastUpdated'>): CitationCampaign {
    const newCampaign: CitationCampaign = {
      ...campaign,
      id: `campaign_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    this.citationCampaigns.set(newCampaign.id, newCampaign);
    return newCampaign;
  }

  /**
   * Citation-Eintrag aktualisieren
   */
  public updateCitationEntry(locationKey: string, sourceId: string, updates: Partial<CitationEntry>): boolean {
    const entries = this.citationEntries.get(locationKey);
    if (!entries) return false;

    const entryIndex = entries.findIndex(e => e.sourceId === sourceId);
    if (entryIndex === -1) return false;

    entries[entryIndex] = {
      ...entries[entryIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    // Konsistenz neu berechnen
    this.recalculateConsistency(entries[entryIndex], locationKey);

    return true;
  }

  /**
   * Konsistenz neu berechnen
   */
  private recalculateConsistency(entry: CitationEntry, locationKey: string): void {
    const locationProfile = multiLocationManagementService.getLocationProfile(locationKey);
    if (!locationProfile) return;

    const masterData = locationProfile.businessInfo;

    entry.consistency = {
      nameMatch: entry.data.businessName === masterData.name,
      addressMatch: entry.data.address === masterData.address,
      phoneMatch: entry.data.phone === masterData.phone,
      websiteMatch: entry.data.website === masterData.website,
      overallScore: this.calculateConsistencyScore(entry, masterData)
    };

    entry.lastVerified = new Date().toISOString();
  }

  /**
   * Konsistenz-Score berechnen
   */
  private calculateConsistencyScore(entry: CitationEntry, masterData: any): number {
    let score = 100;
    const penalties = {
      nameMismatch: 25,
      addressMismatch: 20,
      phoneMismatch: 15,
      websiteMismatch: 10
    };

    if (!entry.consistency.nameMatch) score -= penalties.nameMismatch;
    if (!entry.consistency.addressMatch) score -= penalties.addressMismatch;
    if (!entry.consistency.phoneMismatch) score -= penalties.phoneMismatch;
    if (!entry.consistency.websiteMatch) score -= penalties.websiteMismatch;

    return Math.max(0, score);
  }

  /**
   * Neue Citation erstellen
   */
  public createCitation(locationKey: string, sourceId: string, data: Partial<CitationEntry['data']>): CitationEntry {
    const locationProfile = multiLocationManagementService.getLocationProfile(locationKey);
    if (!locationProfile) {
      throw new Error(`Standort-Profil für ${locationKey} nicht gefunden`);
    }

    const masterData = locationProfile.businessInfo;
    const citationData = { ...masterData, ...data };

    const entry: CitationEntry = {
      id: `citation_${locationKey}_${sourceId}_${Date.now()}`,
      locationKey,
      sourceId,
      status: 'pending',
      data: citationData,
      consistency: {
        nameMatch: citationData.businessName === masterData.name,
        addressMatch: citationData.address === masterData.address,
        phoneMatch: citationData.phone === masterData.phone,
        websiteMatch: citationData.website === masterData.website,
        overallScore: 100 // Neue Citations starten mit 100
      },
      performance: {
        views: 0,
        clicks: 0,
        reviews: 0,
        rating: 0
      },
      lastVerified: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const existingEntries = this.citationEntries.get(locationKey) || [];
    existingEntries.push(entry);
    this.citationEntries.set(locationKey, existingEntries);

    return entry;
  }

  /**
   * Citation-Optimierungen abrufen
   */
  public getCitationOptimizations(locationKey: string): CitationOptimization[] {
    return this.citationOptimizations.get(locationKey) || [];
  }

  /**
   * Citation-Optimierung anwenden
   */
  public applyCitationOptimization(locationKey: string, optimizationId: string): boolean {
    const optimizations = this.citationOptimizations.get(locationKey);
    if (!optimizations) return false;

    const optimization = optimizations.find(opt => opt.citationId === optimizationId);
    if (!optimization) return false;

    optimization.status = 'applied';
    optimization.completedAt = new Date().toISOString();

    return true;
  }

  /**
   * Citation-Quellen abrufen
   */
  public getCitationSources(): CitationSource[] {
    return Array.from(this.citationSources.values());
  }

  /**
   * Citation-Einträge für Standort abrufen
   */
  public getCitationEntries(locationKey: string): CitationEntry[] {
    return this.citationEntries.get(locationKey) || [];
  }

  /**
   * Citation-Audits für Standort abrufen
   */
  public getCitationAudits(locationKey: string): CitationAudit[] {
    return this.citationAudits.get(locationKey) || [];
  }

  /**
   * Citation-Kampagnen abrufen
   */
  public getCitationCampaigns(): CitationCampaign[] {
    return Array.from(this.citationCampaigns.values());
  }

  /**
   * Bulk-Audit für alle Standorte
   */
  public performBulkAudit(): { audits: CitationAudit[]; summary: { totalIssues: number; criticalIssues: number; avgNapScore: number } } {
    const audits: CitationAudit[] = [];
    let totalIssues = 0;
    let criticalIssues = 0;
    let totalNapScore = 0;

    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const audit = this.performCitationAudit(region.city.toLowerCase());
      audits.push(audit);

      totalIssues += audit.issues.length;
      criticalIssues += audit.issues.filter(i => i.severity === 'critical').length;
      totalNapScore += audit.napScore;
    });

    return {
      audits,
      summary: {
        totalIssues,
        criticalIssues,
        avgNapScore: Math.round(totalNapScore / audits.length)
      }
    };
  }

  /**
   * Citation-Performance-Report
   */
  public generatePerformanceReport(locationKey: string): {
    locationKey: string;
    period: { startDate: string; endDate: string };
    totalCitations: number;
    activeCitations: number;
    totalViews: number;
    totalClicks: number;
    avgRating: number;
    topPerformingSources: Array<{ source: string; views: number; clicks: number }>;
    consistencyTrend: number[];
    recommendations: string[];
  } {
    const entries = this.citationEntries.get(locationKey) || [];
    const activeEntries = entries.filter(e => e.status === 'active');

    const totalViews = activeEntries.reduce((sum, e) => sum + e.performance.views, 0);
    const totalClicks = activeEntries.reduce((sum, e) => sum + e.performance.clicks, 0);
    const totalRating = activeEntries.reduce((sum, e) => sum + e.performance.rating, 0);
    const avgRating = activeEntries.length > 0 ? totalRating / activeEntries.length : 0;

    const topPerformingSources = activeEntries
      .map(entry => {
        const source = this.citationSources.get(entry.sourceId);
        return {
          source: source?.name || entry.sourceId,
          views: entry.performance.views,
          clicks: entry.performance.clicks
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Simulierter Konsistenz-Trend
    const consistencyTrend = [75, 78, 82, 85, 88, 90];

    const recommendations = this.generatePerformanceRecommendations(activeEntries, locationKey);

    return {
      locationKey,
      period: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      totalCitations: entries.length,
      activeCitations: activeEntries.length,
      totalViews,
      totalClicks,
      avgRating: parseFloat(avgRating.toFixed(1)),
      topPerformingSources,
      consistencyTrend,
      recommendations
    };
  }

  /**
   * Performance-Empfehlungen generieren
   */
  private generatePerformanceRecommendations(entries: CitationEntry[], locationKey: string): string[] {
    const recommendations: string[] = [];

    const lowPerformingEntries = entries.filter(e => e.performance.views < 50);
    if (lowPerformingEntries.length > 0) {
      recommendations.push(`${lowPerformingEntries.length} Citations haben geringe Sichtbarkeit - Optimierung erforderlich`);
    }

    const lowRatingEntries = entries.filter(e => e.performance.rating < 4.0);
    if (lowRatingEntries.length > 0) {
      recommendations.push('Bewertungen in einigen Citations verbessern');
    }

    const inconsistentEntries = entries.filter(e => e.consistency.overallScore < 80);
    if (inconsistentEntries.length > 0) {
      recommendations.push('NAP-Konsistenz in mehreren Citations verbessern');
    }

    if (recommendations.length === 0) {
      recommendations.push('Citation-Performance ist gut - regelmäßige Überwachung beibehalten');
    }

    return recommendations;
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalLocations: number;
    totalCitations: number;
    activeCitations: number;
    avgNapScore: number;
    pendingOptimizations: number;
    criticalIssues: number;
    topCitationSources: Array<{ source: string; value: number }>;
    consistencyDistribution: { excellent: number; good: number; poor: number };
  } {
    let totalCitations = 0;
    let activeCitations = 0;
    let totalNapScore = 0;
    let pendingOptimizations = 0;
    let criticalIssues = 0;
    const sourcePerformance: { [key: string]: number } = {};
    const consistencyCounts = { excellent: 0, good: 0, poor: 0 };

    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const entries = this.citationEntries.get(region.city.toLowerCase()) || [];
      totalCitations += entries.length;
      activeCitations += entries.filter(e => e.status === 'active').length;

      entries.forEach(entry => {
        totalNapScore += entry.consistency.overallScore;

        const source = this.citationSources.get(entry.sourceId);
        if (source) {
          sourcePerformance[source.name] = (sourcePerformance[source.name] || 0) + entry.performance.views;
        }

        if (entry.consistency.overallScore >= 90) consistencyCounts.excellent++;
        else if (entry.consistency.overallScore >= 70) consistencyCounts.good++;
        else consistencyCounts.poor++;
      });
    });

    Array.from(this.citationOptimizations.values()).forEach(optimizations => {
      pendingOptimizations += optimizations.filter(opt => opt.status === 'pending').length;
    });

    // Kritische Issues aus aktuellen Audits zählen
    Array.from(this.citationAudits.values()).forEach(audits => {
      const latestAudit = audits[audits.length - 1];
      if (latestAudit) {
        criticalIssues += latestAudit.issues.filter(i => i.severity === 'critical').length;
      }
    });

    const topCitationSources = Object.entries(sourcePerformance)
      .map(([source, value]) => ({ source, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalLocations: PRIMARY_SERVICE_REGIONS.length,
      totalCitations,
      activeCitations,
      avgNapScore: totalCitations > 0 ? Math.round(totalNapScore / totalCitations) : 0,
      pendingOptimizations,
      criticalIssues,
      topCitationSources,
      consistencyDistribution: consistencyCounts
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const enterpriseCitationManagementService = new EnterpriseCitationManagementService();