import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';

export interface NAPData {
  businessName: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullAddress: string;
  };
  phone: string;
  website: string;
  email?: string;
  latitude?: number;
  longitude?: number;
}

export interface DirectoryListing {
  directoryName: string;
  url: string;
  status: 'active' | 'pending' | 'rejected' | 'outdated' | 'duplicate';
  napData: NAPData;
  lastChecked: string;
  lastUpdated: string;
  authority: number; // Domain Authority Score
  category: 'major' | 'local' | 'niche' | 'government';
  submissionDate?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  issues: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface NAPConsistencyReport {
  locationKey: string;
  overallScore: number;
  totalListings: number;
  consistentListings: number;
  inconsistentListings: number;
  missingListings: number;
  duplicateListings: number;
  issues: NAPIssue[];
  recommendations: string[];
  generatedAt: string;
}

export interface NAPIssue {
  type: 'name_mismatch' | 'address_mismatch' | 'phone_mismatch' | 'missing_listing' | 'duplicate_listing' | 'outdated_info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  directory: string;
  description: string;
  currentValue?: string;
  expectedValue?: string;
  actionRequired: string;
}

export interface CitationOpportunity {
  directoryName: string;
  url: string;
  authority: number;
  category: string;
  submissionUrl?: string;
  requirements: string[];
  estimatedTimeToSubmit: number; // in minutes
  cost: number; // 0 for free
  priority: 'high' | 'medium' | 'low';
  potentialImpact: number; // 1-10 scale
}

/**
 * NAP Consistency Management Service
 * Automatische Überwachung und Verwaltung der NAP-Konsistenz across alle Online-Verzeichnisse
 */
export class NAPConsistencyService {
  private masterNAPData: Map<string, NAPData> = new Map();
  private directoryListings: Map<string, DirectoryListing[]> = new Map();
  private majorDirectories: string[] = [
    'Google My Business',
    'Bing Places',
    'Apple Maps',
    'Facebook Business',
    'Yelp',
    'Foursquare',
    'HERE Places',
    'Waze',
    'TripAdvisor',
    'Yellow Pages'
  ];

  private germanDirectories: string[] = [
    'Das Örtliche',
    'Gelbe Seiten',
    'Das Telefonbuch',
    'GoYellow',
    'Branchenbuch Deutschland',
    'MeineStadt.de',
    'Stadtbranchenbuch',
    'KlickTel',
    'WLW (Wer liefert was)',
    'Cylex',
    'GoLocal',
    '11880.com',
    'Branchen-Info.net',
    'Firmendb.de'
  ];

  private solarSpecificDirectories: string[] = [
    'Solaranlagen-Portal.com',
    'Photovoltaik.org',
    'EnBauSa.de',
    'Solar-Installateur.de',
    'PV-Installer.de',
    'Energieheld.de',
    'Hausbau-Portal.net',
    'Energie-Experten.org',
    'Solarserver.de',
    'pv magazine Deutschland'
  ];

  constructor() {
    this.initializeMasterNAPData();
    this.initializeDirectoryListings();
  }

  /**
   * Initialisiert Master NAP-Daten für alle Standorte
   */
  private initializeMasterNAPData(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const napData: NAPData = {
        businessName: `ZOE Solar ${region.city}`,
        address: {
          street: 'Musterstraße 123',
          city: region.city,
          state: region.state,
          postalCode: region.postalCode,
          country: 'Deutschland',
          fullAddress: `Musterstraße 123, ${region.postalCode} ${region.city}, ${region.state}, Deutschland`
        },
        phone: '+49-30-123-456-78',
        website: `https://www.zoe-solar.de/standort/${region.city.toLowerCase()}`,
        email: `${region.city.toLowerCase()}@zoe-solar.de`,
        latitude: region.latitude,
        longitude: region.longitude
      };
      
      this.masterNAPData.set(region.city.toLowerCase(), napData);
    });
  }

  /**
   * Initialisiert Verzeichnis-Einträge für alle Standorte
   */
  private initializeDirectoryListings(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const listings = this.generateDirectoryListings(region);
      this.directoryListings.set(region.city.toLowerCase(), listings);
    });
  }

  /**
   * Generiert Verzeichnis-Einträge für einen Standort
   */
  private generateDirectoryListings(region: ServiceRegion): DirectoryListing[] {
    const masterNAP = this.masterNAPData.get(region.city.toLowerCase());
    if (!masterNAP) return [];

    const listings: DirectoryListing[] = [];

    // Major Directories
    this.majorDirectories.forEach((directory, index) => {
      listings.push({
        directoryName: directory,
        url: this.generateDirectoryUrl(directory, region),
        status: this.getRandomStatus(),
        napData: this.generateVariantNAPData(masterNAP, directory),
        lastChecked: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        authority: this.getDirectoryAuthority(directory),
        category: 'major',
        verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending',
        issues: this.generateRandomIssues(directory),
        priority: 'high'
      });
    });

    // German Directories
    this.germanDirectories.forEach((directory, index) => {
      if (Math.random() > 0.4) { // Not all locations are in all directories
        listings.push({
          directoryName: directory,
          url: this.generateDirectoryUrl(directory, region),
          status: this.getRandomStatus(),
          napData: this.generateVariantNAPData(masterNAP, directory),
          lastChecked: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
          authority: this.getDirectoryAuthority(directory),
          category: 'local',
          verificationStatus: Math.random() > 0.5 ? 'verified' : 'unverified',
          issues: this.generateRandomIssues(directory),
          priority: 'medium'
        });
      }
    });

    // Solar-Specific Directories
    this.solarSpecificDirectories.forEach((directory, index) => {
      if (Math.random() > 0.6) { // Selective presence in niche directories
        listings.push({
          directoryName: directory,
          url: this.generateDirectoryUrl(directory, region),
          status: this.getRandomStatus(),
          napData: this.generateVariantNAPData(masterNAP, directory),
          lastChecked: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          authority: this.getDirectoryAuthority(directory),
          category: 'niche',
          verificationStatus: Math.random() > 0.7 ? 'verified' : 'unverified',
          issues: this.generateRandomIssues(directory),
          priority: 'medium'
        });
      }
    });

    return listings;
  }

  /**
   * Generiert Directory-URL
   */
  private generateDirectoryUrl(directory: string, region: ServiceRegion): string {
    const baseUrls: { [key: string]: string } = {
      'Google My Business': 'https://business.google.com/n/',
      'Bing Places': 'https://www.bingplaces.com/',
      'Apple Maps': 'https://mapsconnect.apple.com/',
      'Facebook Business': 'https://business.facebook.com/',
      'Yelp': 'https://biz.yelp.com/',
      'Das Örtliche': 'https://www.dasoertliche.de/',
      'Gelbe Seiten': 'https://www.gelbeseiten.de/',
      'Solaranlagen-Portal.com': 'https://www.solaranlagen-portal.com/experten/'
    };

    const baseUrl = baseUrls[directory] || 'https://example.com/';
    return `${baseUrl}zoe-solar-${region.city.toLowerCase()}`;
  }

  /**
   * Generiert NAP-Varianten mit möglichen Inkonsistenzen
   */
  private generateVariantNAPData(masterNAP: NAPData, directory: string): NAPData {
    const variant = JSON.parse(JSON.stringify(masterNAP)); // Deep copy
    
    // Simuliere zufällige Inkonsistenzen
    if (Math.random() < 0.15) { // 15% chance of name inconsistency
      variant.businessName = variant.businessName.replace('ZOE Solar', Math.random() > 0.5 ? 'ZOE-Solar' : 'ZOE Solar GmbH');
    }
    
    if (Math.random() < 0.10) { // 10% chance of phone inconsistency
      variant.phone = variant.phone.replace('+49-30-', '+49 30 ').replace('-', ' ');
    }
    
    if (Math.random() < 0.08) { // 8% chance of address inconsistency
      variant.address.street = variant.address.street.replace('Musterstraße', 'Musterstr.');
    }

    return variant;
  }

  /**
   * Generiert zufälligen Status
   */
  private getRandomStatus(): DirectoryListing['status'] {
    const statuses: DirectoryListing['status'][] = ['active', 'pending', 'rejected', 'outdated', 'duplicate'];
    const weights = [0.7, 0.15, 0.05, 0.08, 0.02]; // Weighted probabilities
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return statuses[i];
      }
    }
    
    return 'active';
  }

  /**
   * Ermittelt Directory Authority Score
   */
  private getDirectoryAuthority(directory: string): number {
    const authorities: { [key: string]: number } = {
      'Google My Business': 95,
      'Bing Places': 85,
      'Apple Maps': 80,
      'Facebook Business': 90,
      'Yelp': 88,
      'Das Örtliche': 75,
      'Gelbe Seiten': 72,
      'Das Telefonbuch': 70,
      'Solaranlagen-Portal.com': 65,
      'Photovoltaik.org': 60
    };

    return authorities[directory] || Math.floor(Math.random() * 40) + 30; // Random score 30-70 for unknown directories
  }

  /**
   * Generiert zufällige Issues
   */
  private generateRandomIssues(directory: string): string[] {
    const possibleIssues = [
      'Telefonnummer nicht verifiziert',
      'Öffnungszeiten fehlen',
      'Beschreibung zu kurz',
      'Keine Fotos hochgeladen',
      'Kategorie nicht optimal',
      'Website-Link fehlt',
      'Bewertungen nicht beantwortet'
    ];

    const issueCount = Math.floor(Math.random() * 3); // 0-2 issues
    const selectedIssues: string[] = [];
    
    for (let i = 0; i < issueCount; i++) {
      const randomIssue = possibleIssues[Math.floor(Math.random() * possibleIssues.length)];
      if (!selectedIssues.includes(randomIssue)) {
        selectedIssues.push(randomIssue);
      }
    }

    return selectedIssues;
  }

  /**
   * Führt NAP-Konsistenz-Audit durch
   */
  public performNAPAudit(locationKey: string): NAPConsistencyReport {
    const masterNAP = this.masterNAPData.get(locationKey);
    const listings = this.directoryListings.get(locationKey) || [];
    
    if (!masterNAP) {
      throw new Error(`Master NAP data für ${locationKey} nicht gefunden`);
    }

    const issues: NAPIssue[] = [];
    let consistentListings = 0;
    let inconsistentListings = 0;
    let duplicateListings = 0;

    listings.forEach(listing => {
      const napIssues = this.compareNAPData(masterNAP, listing.napData, listing.directoryName);
      issues.push(...napIssues);
      
      if (napIssues.length === 0) {
        consistentListings++;
      } else {
        inconsistentListings++;
      }
      
      if (listing.status === 'duplicate') {
        duplicateListings++;
      }
    });

    // Check for missing major directories
    const presentDirectories = listings.map(l => l.directoryName);
    this.majorDirectories.forEach(directory => {
      if (!presentDirectories.includes(directory)) {
        issues.push({
          type: 'missing_listing',
          severity: 'high',
          directory: directory,
          description: `Eintrag in ${directory} fehlt`,
          actionRequired: `Erstellen Sie einen Eintrag in ${directory}`
        });
      }
    });

    const overallScore = this.calculateOverallScore(consistentListings, inconsistentListings, issues.length, listings.length);

    return {
      locationKey,
      overallScore,
      totalListings: listings.length,
      consistentListings,
      inconsistentListings,
      missingListings: this.majorDirectories.length - presentDirectories.filter(d => this.majorDirectories.includes(d)).length,
      duplicateListings,
      issues,
      recommendations: this.generateRecommendations(issues, overallScore),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Vergleicht NAP-Daten zwischen Master und Directory
   */
  private compareNAPData(master: NAPData, directory: NAPData, directoryName: string): NAPIssue[] {
    const issues: NAPIssue[] = [];

    // Business Name Check
    if (this.normalizeString(master.businessName) !== this.normalizeString(directory.businessName)) {
      issues.push({
        type: 'name_mismatch',
        severity: 'high',
        directory: directoryName,
        description: 'Firmenname stimmt nicht überein',
        currentValue: directory.businessName,
        expectedValue: master.businessName,
        actionRequired: `Firmenname in ${directoryName} auf "${master.businessName}" korrigieren`
      });
    }

    // Phone Check
    if (this.normalizePhone(master.phone) !== this.normalizePhone(directory.phone)) {
      issues.push({
        type: 'phone_mismatch',
        severity: 'critical',
        directory: directoryName,
        description: 'Telefonnummer stimmt nicht überein',
        currentValue: directory.phone,
        expectedValue: master.phone,
        actionRequired: `Telefonnummer in ${directoryName} auf "${master.phone}" korrigieren`
      });
    }

    // Address Check
    if (this.normalizeAddress(master.address.fullAddress) !== this.normalizeAddress(directory.address.fullAddress)) {
      issues.push({
        type: 'address_mismatch',
        severity: 'high',
        directory: directoryName,
        description: 'Adresse stimmt nicht überein',
        currentValue: directory.address.fullAddress,
        expectedValue: master.address.fullAddress,
        actionRequired: `Adresse in ${directoryName} korrigieren`
      });
    }

    return issues;
  }

  /**
   * Normalisiert Strings für Vergleiche
   */
  private normalizeString(str: string): string {
    return str.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Normalisiert Telefonnummern
   */
  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-\(\)]/g, '');
  }

  /**
   * Normalisiert Adressen
   */
  private normalizeAddress(address: string): string {
    return address.toLowerCase()
      .replace(/straße/g, 'str')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Berechnet Overall NAP Score
   */
  private calculateOverallScore(consistent: number, inconsistent: number, issueCount: number, totalListings: number): number {
    if (totalListings === 0) return 0;
    
    const consistencyRatio = consistent / totalListings;
    const issuesPenalty = Math.min(issueCount * 2, 30); // Max 30 points penalty for issues
    const baseCoreScore = consistencyRatio * 70; // 70% from consistency
    const bonusPoints = totalListings > 10 ? 10 : (totalListings / 10) * 10; // Bonus for more listings
    
    return Math.max(0, Math.round(baseCoreScore + bonusPoints - issuesPenalty));
  }

  /**
   * Generiert Empfehlungen basierend auf Issues
   */
  private generateRecommendations(issues: NAPIssue[], overallScore: number): string[] {
    const recommendations: string[] = [];

    if (overallScore < 50) {
      recommendations.push('KRITISCH: Sofortmaßnahmen zur NAP-Konsistenz erforderlich');
    }

    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push(`${criticalIssues.length} kritische Issues sofort beheben`);
    }

    const phoneIssues = issues.filter(i => i.type === 'phone_mismatch');
    if (phoneIssues.length > 0) {
      recommendations.push('Telefonnummer-Inkonsistenzen haben höchste Priorität');
    }

    const missingListings = issues.filter(i => i.type === 'missing_listing');
    if (missingListings.length > 0) {
      recommendations.push(`Einträge in ${missingListings.length} wichtigen Verzeichnissen erstellen`);
    }

    const duplicates = issues.filter(i => i.type === 'duplicate_listing');
    if (duplicates.length > 0) {
      recommendations.push('Duplikate-Einträge entfernen oder zusammenführen');
    }

    if (overallScore > 80) {
      recommendations.push('Gute NAP-Konsistenz! Regelmäßige Überwachung fortsetzen.');
    }

    return recommendations;
  }

  /**
   * Findet Citation-Opportunities
   */
  public findCitationOpportunities(locationKey: string): CitationOpportunity[] {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) return [];

    const existingListings = this.directoryListings.get(locationKey) || [];
    const existingDirectoryNames = existingListings.map(l => l.directoryName);

    const opportunities: CitationOpportunity[] = [];

    // Major directories not yet present
    this.majorDirectories.forEach(directory => {
      if (!existingDirectoryNames.includes(directory)) {
        opportunities.push({
          directoryName: directory,
          url: this.generateDirectoryUrl(directory, region),
          authority: this.getDirectoryAuthority(directory),
          category: 'Major Platform',
          submissionUrl: `${this.generateDirectoryUrl(directory, region)}/add-business`,
          requirements: ['Business verification', 'Phone verification', 'Address verification'],
          estimatedTimeToSubmit: 15,
          cost: 0,
          priority: 'high',
          potentialImpact: 9
        });
      }
    });

    // German directories with high potential
    const highValueGermanDirectories = [
      'Das Örtliche',
      'Gelbe Seiten',
      'Das Telefonbuch',
      'GoYellow'
    ];

    highValueGermanDirectories.forEach(directory => {
      if (!existingDirectoryNames.includes(directory)) {
        opportunities.push({
          directoryName: directory,
          url: this.generateDirectoryUrl(directory, region),
          authority: this.getDirectoryAuthority(directory),
          category: 'German Directory',
          submissionUrl: `${this.generateDirectoryUrl(directory, region)}/eintrag-erstellen`,
          requirements: ['Business registration', 'Local address', 'Phone number'],
          estimatedTimeToSubmit: 10,
          cost: 0,
          priority: 'medium',
          potentialImpact: 7
        });
      }
    });

    // Solar-specific opportunities
    this.solarSpecificDirectories.forEach(directory => {
      if (!existingDirectoryNames.includes(directory)) {
        opportunities.push({
          directoryName: directory,
          url: this.generateDirectoryUrl(directory, region),
          authority: this.getDirectoryAuthority(directory),
          category: 'Solar Industry',
          submissionUrl: `${this.generateDirectoryUrl(directory, region)}/anbieter-eintragen`,
          requirements: ['Industry certification', 'Project portfolio', 'Customer references'],
          estimatedTimeToSubmit: 20,
          cost: 0,
          priority: 'medium',
          potentialImpact: 8
        });
      }
    });

    // Sort by potential impact and priority
    return opportunities.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return b.potentialImpact - a.potentialImpact;
    });
  }

  /**
   * Automatisierte Citation-Einreichung
   */
  public async submitCitation(opportunity: CitationOpportunity, locationKey: string): Promise<{success: boolean, message: string}> {
    const masterNAP = this.masterNAPData.get(locationKey);
    if (!masterNAP) {
      return { success: false, message: 'Master NAP data nicht gefunden' };
    }

    // Simuliere Citation-Einreichung
    console.log(`Submitting citation to ${opportunity.directoryName} for ${locationKey}`);
    console.log(`NAP Data:`, masterNAP);
    console.log(`Estimated time: ${opportunity.estimatedTimeToSubmit} minutes`);

    // In einer echten Implementierung würde hier die API-Integration erfolgen
    const success = Math.random() > 0.2; // 80% Erfolgsrate simuliert

    if (success) {
      // Füge neuen Eintrag zu listings hinzu
      const newListing: DirectoryListing = {
        directoryName: opportunity.directoryName,
        url: opportunity.url,
        status: 'pending',
        napData: masterNAP,
        lastChecked: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        authority: opportunity.authority,
        category: opportunity.category === 'Major Platform' ? 'major' : 'local',
        submissionDate: new Date().toISOString(),
        verificationStatus: 'pending',
        issues: [],
        priority: opportunity.priority
      };

      const existingListings = this.directoryListings.get(locationKey) || [];
      existingListings.push(newListing);
      this.directoryListings.set(locationKey, existingListings);

      return { 
        success: true, 
        message: `Citation erfolgreich bei ${opportunity.directoryName} eingereicht. Status: Pending Verification` 
      };
    } else {
      return { 
        success: false, 
        message: `Fehler bei der Einreichung in ${opportunity.directoryName}. Bitte manuell überprüfen.` 
      };
    }
  }

  /**
   * Duplicate Detection
   */
  public detectDuplicates(locationKey: string): DirectoryListing[] {
    const listings = this.directoryListings.get(locationKey) || [];
    return listings.filter(listing => listing.status === 'duplicate');
  }

  /**
   * Automatische Duplikat-Bereinigung
   */
  public async cleanupDuplicates(locationKey: string): Promise<{removed: number, merged: number}> {
    const duplicates = this.detectDuplicates(locationKey);
    let removed = 0;
    let merged = 0;

    // Simuliere Bereinigungsprozess
    for (const duplicate of duplicates) {
      if (Math.random() > 0.5) {
        // Entfernen
        duplicate.status = 'active'; // Simuliert erfolgreiche Entfernung
        removed++;
      } else {
        // Zusammenführen
        duplicate.status = 'active';
        merged++;
      }
    }

    return { removed, merged };
  }

  /**
   * Bulk NAP Update für alle Standorte
   */
  public async bulkUpdateNAP(updates: Partial<NAPData>): Promise<{updated: number, failed: number}> {
    let updated = 0;
    let failed = 0;

    for (const [locationKey, napData] of this.masterNAPData.entries()) {
      try {
        // Update master data
        const updatedNAP = { ...napData, ...updates };
        this.masterNAPData.set(locationKey, updatedNAP);
        
        // Update all directory listings for this location
        const listings = this.directoryListings.get(locationKey) || [];
        listings.forEach(listing => {
          listing.napData = { ...listing.napData, ...updates };
          listing.lastUpdated = new Date().toISOString();
        });
        
        updated++;
      } catch (error) {
        console.error(`Fehler beim Update für ${locationKey}:`, error);
        failed++;
      }
    }

    return { updated, failed };
  }

  /**
   * Monitoring Dashboard Daten
   */
  public getMonitoringDashboardData(): {
    totalLocations: number;
    totalListings: number;
    averageScore: number;
    criticalIssues: number;
    pendingSubmissions: number;
    recentActivity: Array<{action: string, location: string, timestamp: string}>;
  } {
    let totalListings = 0;
    let totalScore = 0;
    let criticalIssues = 0;
    let pendingSubmissions = 0;

    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const listings = this.directoryListings.get(locationKey) || [];
      totalListings += listings.length;
      
      const report = this.performNAPAudit(locationKey);
      totalScore += report.overallScore;
      criticalIssues += report.issues.filter(i => i.severity === 'critical').length;
      pendingSubmissions += listings.filter(l => l.status === 'pending').length;
    });

    return {
      totalLocations: PRIMARY_SERVICE_REGIONS.length,
      totalListings,
      averageScore: Math.round(totalScore / PRIMARY_SERVICE_REGIONS.length),
      criticalIssues,
      pendingSubmissions,
      recentActivity: [
        { action: 'Citation submitted to Google My Business', location: 'Berlin', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { action: 'NAP inconsistency detected in Yelp', location: 'München', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
        { action: 'Duplicate listing removed from Das Örtliche', location: 'Hamburg', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
      ]
    };
  }

  /**
   * Abrufen von Listings für einen Standort
   */
  public getListingsForLocation(locationKey: string): DirectoryListing[] {
    return this.directoryListings.get(locationKey) || [];
  }

  /**
   * Abrufen von Master NAP Data
   */
  public getMasterNAPData(locationKey: string): NAPData | undefined {
    return this.masterNAPData.get(locationKey);
  }
}

// Singleton-Instanz für globale Verwendung
export const napConsistencyService = new NAPConsistencyService();