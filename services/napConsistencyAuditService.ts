/**
 * NAP Consistency Audit Service für ZOE Solar
 * 
 * Umfassende Überprüfung und Harmonisierung der Name-Address-Phone-Konsistenz
 * über alle Online-Plattformen für optimale lokale SEO-Performance.
 * 
 * Features:
 * - Multi-Platform NAP-Audit (Google, Facebook, Yelp, etc.)
 * - Automatische Consistency-Check
 * - Inconsistency-Detection und -Resolution
 * - Real-time Monitoring und Alerts
 * - Priority-basierte Fix-Strategien
 */

export interface NAPData {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone: string;
  email?: string;
  website: string;
  latitude?: number;
  longitude?: number;
}

export interface NAPPlatform {
  platform: string;
  url: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone: string;
  email?: string;
  website: string;
  verified: boolean;
  lastUpdated: Date;
  status: 'consistent' | 'inconsistent' | 'missing' | 'error';
  inconsistencies: NAPInconsistency[];
  score: number; // 0-100
}

export interface NAPInconsistency {
  field: 'name' | 'phone' | 'email' | 'address' | 'website';
  currentValue: string;
  expectedValue: string;
  severity: 'critical' | 'major' | 'minor';
  impact: 'local_pack' | 'organic' | 'citations' | 'brand';
  fixable: boolean;
  platform: string;
}

export interface NAPAuditConfig {
  enabled: boolean;
  auditFrequency: number; // hours
  targetPlatforms: string[];
  criticalFields: string[];
  monitoringEnabled: boolean;
  alertThresholds: {
    scoreDrop: number;
    newInconsistencies: number;
  };
  autoFixEnabled: boolean;
}

export interface NAPAuditReport {
  timestamp: Date;
  overallScore: number;
  totalPlatforms: number;
  consistentPlatforms: number;
  inconsistentPlatforms: number;
  criticalIssues: number;
  platforms: NAPPlatform[];
  recommendations: NAPRecommendation[];
  trends: {
    scoreChange: number;
    consistencyTrend: 'improving' | 'stable' | 'declining';
    criticalIssuesTrend: number;
  };
}

export interface NAPRecommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  platform: string;
  field: string;
  expectedValue: string;
  estimatedImpact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  instructions: string[];
}

class NAPConsistencyAuditService {
  private static instance: NAPConsistencyAuditService;
  private config: NAPAuditConfig;
  private masterNAPData: NAPData;
  private platformData: Map<string, NAPPlatform> = new Map();
  private auditHistory: NAPAuditReport[] = [];
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isAuditing: boolean = false;

  private constructor() {
    this.initializeConfig();
    this.initializeMasterNAPData();
    this.setupMonitoring();
  }

  public static getInstance(): NAPConsistencyAuditService {
    if (!NAPConsistencyAuditService.instance) {
      NAPConsistencyAuditService.instance = new NAPConsistencyAuditService();
    }
    return NAPConsistencyAuditService.instance;
  }

  private initializeConfig(): void {
    this.config = {
      enabled: true,
      auditFrequency: 24, // Daily
      targetPlatforms: [
        'Google My Business',
        'Facebook',
        'Yelp',
        'Yellow Pages',
        'Local Directory',
        'Industry Directories',
        'Chamber of Commerce',
        'BBB'
      ],
      criticalFields: ['name', 'phone', 'address'],
      monitoringEnabled: true,
      alertThresholds: {
        scoreDrop: 10,
        newInconsistencies: 2
      },
      autoFixEnabled: false
    };
  }

  private initializeMasterNAPData(): void {
    this.masterNAPData = {
      name: 'ZOE Solar',
      address: {
        street: 'Solarstraße 1',
        city: 'Berlin',
        state: 'Berlin',
        zip: '10115',
        country: 'Deutschland'
      },
      phone: '+49 30 12345678',
      email: 'info@zoe-solar.de',
      website: 'https://zoe-solar.de',
      latitude: 52.520008,
      longitude: 13.404954
    };
  }

  private setupMonitoring(): void {
    if (!this.config.monitoringEnabled) return;

    // Main audit interval
    this.monitoringIntervals.set('main-audit', setInterval(() => {
      this.performNAPAudit();
    }, this.config.auditFrequency * 60 * 60 * 1000));

    // Consistency check interval (more frequent)
    this.monitoringIntervals.set('consistency-check', setInterval(() => {
      this.checkConsistencyChanges();
    }, 6 * 60 * 60 * 1000)); // Every 6 hours

    // Alert monitoring
    this.monitoringIntervals.set('alert-monitoring', setInterval(() => {
      this.monitorNAPAlerts();
    }, 2 * 60 * 60 * 1000)); // Every 2 hours
  }

  // ===== NAP AUDIT EXECUTION =====

  /**
   * Perform comprehensive NAP audit across all platforms
   */
  public async performNAPAudit(): Promise<NAPAuditReport> {
    if (this.isAuditing) {
      console.log('NAP audit already in progress...');
      return this.getLatestReport();
    }

    this.isAuditing = true;
    console.log('Starting NAP consistency audit...');

    try {
      // Audit each platform
      for (const platformName of this.config.targetPlatforms) {
        await this.auditPlatform(platformName);
      }

      // Generate audit report
      const report = this.generateAuditReport();

      // Store in history
      this.auditHistory.push(report);

      // Keep only last 30 reports
      if (this.auditHistory.length > 30) {
        this.auditHistory = this.auditHistory.slice(-30);
      }

      // Check for alerts
      this.checkNAPAlerts(report);

      console.log(`NAP audit completed. Overall score: ${report.overallScore}/100`);

      return report;

    } catch (error) {
      console.error('NAP audit failed:', error);
      throw error;
    } finally {
      this.isAuditing = false;
    }
  }

  private async auditPlatform(platformName: string): Promise<void> {
    try {
      // Simulate platform audit (in real implementation, use APIs/scraping)
      const platformData = await this.simulatePlatformAudit(platformName);
      
      // Analyze consistency
      const inconsistencies = this.analyzeNAPConsistency(platformData);
      
      // Calculate platform score
      const score = this.calculatePlatformScore(inconsistencies);
      
      // Determine status
      const status = this.determineNAPStatus(inconsistencies);

      const platform: NAPPlatform = {
        platform: platformName,
        url: platformData.url,
        name: platformData.name,
        address: platformData.address,
        phone: platformData.phone,
        email: platformData.email,
        website: platformData.website,
        verified: platformData.verified,
        lastUpdated: platformData.lastUpdated,
        status,
        inconsistencies,
        score
      };

      this.platformData.set(platformName, platform);

    } catch (error) {
      console.error(`Failed to audit platform ${platformName}:`, error);
      
      // Add error entry
      const errorPlatform: NAPPlatform = {
        platform: platformName,
        url: '',
        name: '',
        address: this.masterNAPData.address,
        phone: '',
        email: '',
        website: '',
        verified: false,
        lastUpdated: new Date(),
        status: 'error',
        inconsistencies: [],
        score: 0
      };

      this.platformData.set(platformName, errorPlatform);
    }
  }

  private async simulatePlatformAudit(platformName: string): Promise<any> {
    // Simulate platform data retrieval
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate realistic NAP data with some inconsistencies
        const isInconsistent = Math.random() < 0.3; // 30% chance of inconsistencies
        
        if (isInconsistent) {
          resolve({
            platform: platformName,
            url: `https://${platformName.toLowerCase().replace(/\s+/g, '')}.com/zoe-solar`,
            name: this.randomNameVariant(),
            address: this.randomAddressVariant(),
            phone: this.randomPhoneVariant(),
            email: 'contact@zoe-solar.com',
            website: 'https://www.zoe-solar.de',
            verified: Math.random() > 0.2,
            lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
        } else {
          resolve({
            platform: platformName,
            url: `https://${platformName.toLowerCase().replace(/\s+/g, '')}.com/zoe-solar`,
            name: this.masterNAPData.name,
            address: this.masterNAPData.address,
            phone: this.masterNAPData.phone,
            email: this.masterNAPData.email,
            website: this.masterNAPData.website,
            verified: Math.random() > 0.1,
            lastUpdated: new Date()
          });
        }
      }, Math.random() * 1000); // Simulate network delay
    });
  }

  private randomNameVariant(): string {
    const variants = [
      'Zoe Solar',
      'ZOE Solar GmbH',
      'Zoe-Solar',
      'ZOE Solar Berlin',
      'Zoe Solar Energy'
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }

  private randomAddressVariant(): any {
    const streetVariants = [
      'Solarstraße 1',
      'Solarstrasse 1',
      'Solar Str. 1',
      'Solarstreet 1'
    ];
    
    const cityVariants = [
      'Berlin',
      'Berlin-Mitte',
      'Berlin, Germany',
      'Berlin DE'
    ];

    return {
      street: streetVariants[Math.floor(Math.random() * streetVariants.length)],
      city: cityVariants[Math.floor(Math.random() * cityVariants.length)],
      state: 'Berlin',
      zip: '10115',
      country: 'Deutschland'
    };
  }

  private randomPhoneVariant(): string {
    const variants = [
      '+49 30 12345678',
      '+493012345678',
      '030 12345678',
      '+49 30 1234 5678',
      '030-12345678'
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }

  // ===== CONSISTENCY ANALYSIS =====

  private analyzeNAPConsistency(platformData: any): NAPInconsistency[] {
    const inconsistencies: NAPInconsistency[] = [];

    // Check name consistency
    if (platformData.name !== this.masterNAPData.name) {
      inconsistencies.push({
        field: 'name',
        currentValue: platformData.name,
        expectedValue: this.masterNAPData.name,
        severity: this.determineNameSeverity(platformData.name),
        impact: 'brand',
        fixable: true,
        platform: platformData.platform
      });
    }

    // Check phone consistency
    if (platformData.phone !== this.masterNAPData.phone) {
      inconsistencies.push({
        field: 'phone',
        currentValue: platformData.phone,
        expectedValue: this.masterNAPData.phone,
        severity: 'critical',
        impact: 'local_pack',
        fixable: true,
        platform: platformData.platform
      });
    }

    // Check address consistency
    const addressInconsistencies = this.analyzeAddressConsistency(platformData.address);
    inconsistencies.push(...addressInconsistencies);

    // Check email consistency
    if (platformData.email && platformData.email !== this.masterNAPData.email) {
      inconsistencies.push({
        field: 'email',
        currentValue: platformData.email,
        expectedValue: this.masterNAPData.email || '',
        severity: 'minor',
        impact: 'citations',
        fixable: true,
        platform: platformData.platform
      });
    }

    return inconsistencies;
  }

  private analyzeAddressConsistency(platformAddress: any): NAPInconsistency[] {
    const inconsistencies: NAPInconsistency[] = [];
    const masterAddress = this.masterNAPData.address;

    // Check each address component
    const fields = ['street', 'city', 'state', 'zip', 'country'] as const;
    
    for (const field of fields) {
      if (platformAddress[field] !== masterAddress[field]) {
        inconsistencies.push({
          field: 'address',
          currentValue: platformAddress[field],
          expectedValue: masterAddress[field],
          severity: field === 'city' || field === 'zip' ? 'major' : 'minor',
          impact: 'local_pack',
          fixable: true,
          platform: '' // Will be set by caller
        });
      }
    }

    return inconsistencies;
  }

  private determineNameSeverity(name: string): 'critical' | 'major' | 'minor' {
    if (!name.toLowerCase().includes('zoe')) return 'critical';
    if (!name.toLowerCase().includes('solar')) return 'major';
    if (name !== this.masterNAPData.name) return 'minor';
    return 'minor';
  }

  private calculatePlatformScore(inconsistencies: NAPInconsistency[]): number {
    if (inconsistencies.length === 0) return 100;

    let score = 100;
    const criticalWeight = 25;
    const majorWeight = 15;
    const minorWeight = 5;

    for (const inconsistency of inconsistencies) {
      switch (inconsistency.severity) {
        case 'critical':
          score -= criticalWeight;
          break;
        case 'major':
          score -= majorWeight;
          break;
        case 'minor':
          score -= minorWeight;
          break;
      }
    }

    return Math.max(0, score);
  }

  private determineNAPStatus(inconsistencies: NAPInconsistency[]): 'consistent' | 'inconsistent' | 'missing' | 'error' {
    if (inconsistencies.length === 0) return 'consistent';
    
    const criticalIssues = inconsistencies.filter(i => i.severity === 'critical').length;
    if (criticalIssues > 0) return 'inconsistent';
    
    return 'inconsistent';
  }

  // ===== REPORTING =====

  private generateAuditReport(): NAPAuditReport {
    const platforms = Array.from(this.platformData.values());
    const consistentPlatforms = platforms.filter(p => p.status === 'consistent').length;
    const inconsistentPlatforms = platforms.filter(p => p.status === 'inconsistent').length;
    const criticalIssues = platforms.reduce((sum, p) => 
      sum + p.inconsistencies.filter(i => i.severity === 'critical').length, 0
    );

    const overallScore = platforms.length > 0 
      ? Math.round(platforms.reduce((sum, p) => sum + p.score, 0) / platforms.length)
      : 0;

    const recommendations = this.generateRecommendations(platforms);

    // Calculate trends
    const trends = this.calculateTrends(overallScore, criticalIssues);

    return {
      timestamp: new Date(),
      overallScore,
      totalPlatforms: platforms.length,
      consistentPlatforms,
      inconsistentPlatforms,
      criticalIssues,
      platforms,
      recommendations,
      trends
    };
  }

  private generateRecommendations(platforms: NAPPlatform[]): NAPRecommendation[] {
    const recommendations: NAPRecommendation[] = [];

    for (const platform of platforms) {
      for (const inconsistency of platform.inconsistencies) {
        const recommendation: NAPRecommendation = {
          priority: this.mapSeverityToPriority(inconsistency.severity),
          action: `Fix ${inconsistency.field} inconsistency`,
          platform: platform.platform,
          field: inconsistency.field,
          expectedValue: inconsistency.expectedValue,
          estimatedImpact: this.determineEstimatedImpact(inconsistency),
          effort: this.determineFixEffort(inconsistency),
          instructions: this.generateFixInstructions(inconsistency)
        };

        recommendations.push(recommendation);
      }
    }

    // Sort by priority
    recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  private mapSeverityToPriority(severity: 'critical' | 'major' | 'minor'): 'critical' | 'high' | 'medium' | 'low' {
    switch (severity) {
      case 'critical': return 'critical';
      case 'major': return 'high';
      case 'minor': return 'medium';
      default: return 'low';
    }
  }

  private determineEstimatedImpact(inconsistency: NAPInconsistency): 'high' | 'medium' | 'low' {
    switch (inconsistency.impact) {
      case 'local_pack': return 'high';
      case 'organic': return 'medium';
      case 'citations': return 'medium';
      case 'brand': return 'low';
      default: return 'low';
    }
  }

  private determineFixEffort(inconsistency: NAPInconsistency): 'low' | 'medium' | 'high' {
    if (inconsistency.field === 'phone' || inconsistency.field === 'email') {
      return 'low';
    }
    if (inconsistency.field === 'name') {
      return 'high';
    }
    return 'medium';
  }

  private generateFixInstructions(inconsistency: NAPInconsistency): string[] {
    const instructions: string[] = [];

    switch (inconsistency.field) {
      case 'name':
        instructions.push('1. Log into your account on the platform');
        instructions.push('2. Navigate to business information section');
        instructions.push('3. Update business name to exact match: "' + inconsistency.expectedValue + '"');
        instructions.push('4. Verify the change and save');
        break;
      case 'phone':
        instructions.push('1. Access business listing management');
        instructions.push('2. Update phone number to: ' + inconsistency.expectedValue);
        instructions.push('3. Ensure international format consistency');
        instructions.push('4. Test the number to confirm it works');
        break;
      case 'address':
        instructions.push('1. Locate address section in business profile');
        instructions.push('2. Update address components to match master data');
        instructions.push('3. Verify address formatting standards');
        instructions.push('4. Confirm changes save properly');
        break;
      default:
        instructions.push('1. Access business information settings');
        instructions.push('2. Update the field to match master NAP data');
        instructions.push('3. Save changes and verify update');
    }

    return instructions;
  }

  // ===== TRENDS ANALYSIS =====

  private calculateTrends(overallScore: number, criticalIssues: number): any {
    if (this.auditHistory.length < 2) {
      return {
        scoreChange: 0,
        consistencyTrend: 'stable' as const,
        criticalIssuesTrend: 0
      };
    }

    const previousReport = this.auditHistory[this.auditHistory.length - 2];
    const scoreChange = overallScore - previousReport.overallScore;
    const issuesChange = criticalIssues - previousReport.criticalIssues;

    let consistencyTrend: 'improving' | 'stable' | 'declining';
    if (scoreChange > 5) {
      consistencyTrend = 'improving';
    } else if (scoreChange < -5) {
      consistencyTrend = 'declining';
    } else {
      consistencyTrend = 'stable';
    }

    return {
      scoreChange,
      consistencyTrend,
      criticalIssuesTrend: issuesChange
    };
  }

  // ===== MONITORING & ALERTS =====

  private checkNAPAlerts(report: NAPAuditReport): void {
    // Check score drop
    if (this.auditHistory.length >= 2) {
      const previousScore = this.auditHistory[this.auditHistory.length - 2].overallScore;
      const scoreDrop = previousScore - report.overallScore;

      if (scoreDrop >= this.config.alertThresholds.scoreDrop) {
        this.triggerNAPAlert('score_drop', {
          currentScore: report.overallScore,
          previousScore,
          scoreDrop
        });
      }
    }

    // Check critical issues
    if (report.criticalIssues >= this.config.alertThresholds.newInconsistencies) {
      this.triggerNAPAlert('critical_issues', {
        criticalIssues: report.criticalIssues,
        platforms: report.platforms.filter(p => 
          p.inconsistencies.some(i => i.severity === 'critical')
        )
      });
    }
  }

  private triggerNAPAlert(alertType: string, details: any): void {
    console.warn(`NAP Alert: ${alertType}`, details);
    
    // In real implementation, send email, slack notification, etc.
    window.dispatchEvent(new CustomEvent('NAPAlert', {
      detail: { type: alertType, details, timestamp: new Date() }
    }));
  }

  private checkConsistencyChanges(): void {
    // Check for recent changes that might affect consistency
    console.log('Checking for NAP consistency changes...');
  }

  private monitorNAPAlerts(): void {
    // Monitor for external changes that might affect NAP
    console.log('Monitoring NAP alerts...');
  }

  // ===== PUBLIC API =====

  public getLatestReport(): NAPAuditReport {
    if (this.auditHistory.length === 0) {
      // Generate empty report
      return {
        timestamp: new Date(),
        overallScore: 0,
        totalPlatforms: 0,
        consistentPlatforms: 0,
        inconsistentPlatforms: 0,
        criticalIssues: 0,
        platforms: [],
        recommendations: [],
        trends: {
          scoreChange: 0,
          consistencyTrend: 'stable',
          criticalIssuesTrend: 0
        }
      };
    }
    return this.auditHistory[this.auditHistory.length - 1];
  }

  public getPlatformData(platformName?: string): NAPPlatform | Map<string, NAPPlatform> {
    if (platformName) {
      return this.platformData.get(platformName) as NAPPlatform;
    }
    return new Map(this.platformData);
  }

  public updateMasterNAPData(newData: Partial<NAPData>): void {
    this.masterNAPData = { ...this.masterNAPData, ...newData };
    
    // Re-run audit with new master data
    this.performNAPAudit();
  }

  public updateConfig(newConfig: Partial<NAPAuditConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.restartMonitoring();
  }

  private restartMonitoring(): void {
    this.stopMonitoring();
    this.setupMonitoring();
  }

  private stopMonitoring(): void {
    this.monitoringIntervals.forEach(interval => clearInterval(interval));
    this.monitoringIntervals.clear();
  }

  public exportAuditReport(): string {
    const report = this.getLatestReport();
    return JSON.stringify(report, null, 2);
  }

  public getHealthStatus(): {
    status: string;
    lastAudit: Date | null;
    platformsMonitored: number;
    overallScore: number;
    criticalIssues: number;
  } {
    return {
      status: this.config.enabled ? 'active' : 'inactive',
      lastAudit: this.auditHistory.length > 0 ? this.auditHistory[this.auditHistory.length - 1].timestamp : null,
      platformsMonitored: this.platformData.size,
      overallScore: this.getLatestReport().overallScore,
      criticalIssues: this.getLatestReport().criticalIssues
    };
  }
}

// ===== EXPORT =====

export const napConsistencyAuditService = NAPConsistencyAuditService.getInstance();
export default napConsistencyAuditService;

/**
 * ===== USAGE EXAMPLES =====
 * 
 * // Perform NAP audit
 * const report = await napConsistencyAuditService.performNAPAudit();
 * console.log(`NAP Score: ${report.overallScore}/100`);
 * 
 * // Get specific platform data
 * const googleData = napConsistencyAuditService.getPlatformData('Google My Business');
 * 
 * // Update master NAP data
 * napConsistencyAuditService.updateMasterNAPData({
 *   phone: '+49 30 87654321'
 * });
 * 
 * // Export latest report
 * const reportJson = napConsistencyAuditService.exportAuditReport();
 */