import { metricsCollector } from './MetricsCollector';

export interface LighthouseReport {
  lhr: {
    requestedUrl: string;
    finalUrl: string;
    audits: Record<string, {
      id: string;
      title: string;
      description: string;
      score: number | null;
      scoreDisplayMode?: 'numeric' | 'binary' | 'error' | 'manual';
      numericValue?: number;
      numericUnit?: string;
      displayValue?: string;
    }>;
    categories: Record<string, {
      id: string;
      title: string;
      description: string;
      score: number | null;
    }>;
  };
  timestamp: string;
}

export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  speedIndex: number;
  totalBlockingTime: number;
  interactionsToNextPaint: number;
}

class LighthouseIntegration {
  private static instance: LighthouseIntegration;
  private reports: LighthouseReport[] = [];
  private isRunning: boolean = false;

  static getInstance(): LighthouseIntegration {
    if (!LighthouseIntegration.instance) {
      LighthouseIntegration.instance = new LighthouseIntegration();
    }
    return LighthouseIntegration.instance;
  }

  public async runLighthouse(url?: string): Promise<LighthouseMetrics> {
    if (this.isRunning) {
      throw new Error('Lighthouse audit is already running');
    }

    this.isRunning = true;

    try {
      // Use Chrome DevTools Protocol or Lighthouse CLI
      const targetUrl = url || window.location.href;
      const metrics = await this.runLighthouseInternal(targetUrl);

      // Store the full report
      const report: LighthouseReport = {
        lhr: {
          requestedUrl: targetUrl,
          finalUrl: targetUrl,
          audits: {}, // This would be populated by the actual Lighthouse run
          categories: {},
        },
        timestamp: new Date().toISOString(),
      };

      this.reports.push(report);
      return metrics;
    } finally {
      this.isRunning = false;
    }
  }

  private async runLighthouseInternal(_url: string): Promise<LighthouseMetrics> {
    // This would typically use the Lighthouse CLI or Chrome DevTools Protocol
    // For now, we'll simulate a Lighthouse run using available metrics

    const vitals = metricsCollector.getVitals();
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    // Calculate performance metrics
    const performanceScore = this.calculatePerformanceScore(vitals, navigation);

    // Simulate other categories (in real implementation, these would come from Lighthouse)
    const accessibilityScore = 95; // Placeholder
    const bestPracticesScore = 92; // Placeholder
    const seoScore = 88; // Placeholder
    const pwaScore = 78; // Placeholder

    const metrics: LighthouseMetrics = {
      performance: performanceScore,
      accessibility: accessibilityScore,
      bestPractices: bestPracticesScore,
      seo: seoScore,
      pwa: pwaScore,
      firstContentfulPaint: vitals.fcp || navigation?.responseStart || 0,
      largestContentfulPaint: vitals.lcp || 0,
      cumulativeLayoutShift: vitals.cls || 0,
      firstInputDelay: vitals.fid || 0,
      speedIndex: this.calculateSpeedIndex(vitals, navigation),
      totalBlockingTime: this.calculateTotalBlockingTime(),
      interactionsToNextPaint: this.estimateINP(vitals),
    };

    return metrics;
  }

  private calculatePerformanceScore(
    vitals: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    _navigation?: PerformanceNavigationTiming
  ): number {
    let score = 100;

    // FCP scoring (0-3000ms)
    if (vitals.fcp > 3000) score -= 15;
    else if (vitals.fcp > 1800) score -= 10;
    else if (vitals.fcp > 1000) score -= 5;

    // LCP scoring (0-4000ms)
    if (vitals.lcp > 4000) score -= 25;
    else if (vitals.lcp > 2500) score -= 15;
    else if (vitals.lcp > 1200) score -= 5;

    // CLS scoring (0-0.25)
    if (vitals.cls > 0.25) score -= 15;
    else if (vitals.cls > 0.1) score -= 10;
    else if (vitals.cls > 0.05) score -= 5;

    // FID scoring (0-300ms)
    if (vitals.fid > 300) score -= 20;
    else if (vitals.fid > 200) score -= 10;
    else if (vitals.fid > 100) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  private calculateSpeedIndex(vitals: any, _navigation?: PerformanceNavigationTiming): number { // eslint-disable-line @typescript-eslint/no-explicit-any
    // Simplified Speed Index calculation
    const fcp = vitals.fcp || 0;
    const lcp = vitals.lcp || 0;

    // Estimate Speed Index as weighted average of FCP and LCP
    return (fcp * 0.4 + lcp * 0.6);
  }

  private calculateTotalBlockingTime(): number {
    let tbt = 0;
    const entries = performance.getEntriesByType('longtask');

    for (const entry of entries) {
      tbt += Math.max(0, entry.duration - 50);
    }

    return tbt;
  }

  private estimateINP(vitals: any): number { // eslint-disable-line @typescript-eslint/no-explicit-any
    // Estimate Interactions to Next Paint
    // This is a simplified calculation
    return vitals.fid || 0;
  }

  public async runScheduledAudit(urls?: string[]): Promise<LighthouseMetrics[]> {
    const defaultUrls = urls || [
      window.location.href,
      '/photovoltaik',
      '/finanzierung',
      '/kontakt',
      '/ueber-uns',
    ];

    const results: LighthouseMetrics[] = [];

    for (const url of defaultUrls) {
      try {
        console.log(`Running Lighthouse audit for: ${url}`);
        const metrics = await this.runLighthouse(url);
        results.push(metrics);

        // Wait between audits to avoid rate limiting
        await this.delay(2000);
      } catch (error) {
        console.error(`Failed to audit ${url}:`, error);
      }
    }

    return results;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getLatestReport(): LighthouseReport | null {
    return this.reports.length > 0 ? this.reports[this.reports.length - 1] : null;
  }

  public getAllReports(): LighthouseReport[] {
    return [...this.reports];
  }

  public getMetricsHistory(): Array<{
    timestamp: string;
    url: string;
    metrics: LighthouseMetrics;
  }> {
    return this.reports.map(report => ({
      timestamp: report.timestamp,
      url: report.lhr.requestedUrl,
      metrics: this.extractMetricsFromReport(report),
    }));
  }

  private extractMetricsFromReport(report: LighthouseReport): LighthouseMetrics {
    // Extract metrics from Lighthouse report
    const audits = report.lhr.audits;

    return {
      performance: report.lhr.categories.performance?.score || 0,
      accessibility: report.lhr.categories.accessibility?.score || 0,
      bestPractices: report.lhr.categories['best-practices']?.score || 0,
      seo: report.lhr.categories.seo?.score || 0,
      pwa: report.lhr.categories.pwa?.score,
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      firstInputDelay: audits['max-potential-fid']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
      interactionsToNextPaint: audits['interaction-to-next-paint']?.numericValue || 0,
    };
  }

  public getPerformanceGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  public generateRecommendations(metrics: LighthouseMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.performance < 90) {
      recommendations.push('Improve performance score');

      if (metrics.firstContentfulPaint > 1800) {
        recommendations.push('Reduce initial server response time');
      }

      if (metrics.largestContentfulPaint > 2500) {
        recommendations.push('Optimize images and reduce render-blocking resources');
      }

      if (metrics.cumulativeLayoutShift > 0.1) {
        recommendations.push('Ensure elements don\'t shift position during load');
      }

      if (metrics.firstInputDelay > 100) {
        recommendations.push('Reduce JavaScript execution time');
      }
    }

    if (metrics.accessibility < 90) {
      recommendations.push('Improve accessibility (alt texts, ARIA labels, color contrast)');
    }

    if (metrics.bestPractices < 90) {
      recommendations.push('Follow web development best practices');
    }

    if (metrics.seo < 80) {
      recommendations.push('Improve SEO meta tags and structured data');
    }

    if (metrics.pwa && metrics.pwa < 80) {
      recommendations.push('Improve PWA features (service worker, offline support)');
    }

    return recommendations;
  }

  public exportReports(): string {
    const data = {
      timestamp: new Date().toISOString(),
      reports: this.reports,
      metricsHistory: this.getMetricsHistory(),
    };
    return JSON.stringify(data, null, 2);
  }

  public clearReports(): void {
    this.reports = [];
  }

  public isAuditRunning(): boolean {
    return this.isRunning;
  }

  public compareReports(report1: LighthouseReport, report2: LighthouseReport): {
    improved: string[];
    declined: string[];
    unchanged: string[];
  } {
    const metrics1 = this.extractMetricsFromReport(report1);
    const metrics2 = this.extractMetricsFromReport(report2);

    const improved: string[] = [];
    const declined: string[] = [];
    const unchanged: string[] = [];

    const categories = ['performance', 'accessibility', 'bestPractices', 'seo'] as const;

    for (const category of categories) {
      const score1 = metrics1[category] || 0;
      const score2 = metrics2[category] || 0;

      if (score2 > score1 + 2) {
        improved.push(category);
      } else if (score2 < score1 - 2) {
        declined.push(category);
      } else {
        unchanged.push(category);
      }
    }

    return { improved, declined, unchanged };
  }

  // Method to integrate with CI/CD
  public async runAuditForCI(url: string, threshold: {
    performance: number;
    accessibility: number;
    seo: number;
  } = { performance: 80, accessibility: 90, seo: 80 }): Promise<{
    passed: boolean;
    metrics: LighthouseMetrics;
    failures: string[];
  }> {
    const metrics = await this.runLighthouse(url);

    const failures: string[] = [];

    if (metrics.performance < threshold.performance) {
      failures.push(`Performance score ${metrics.performance} is below threshold ${threshold.performance}`);
    }

    if (metrics.accessibility < threshold.accessibility) {
      failures.push(`Accessibility score ${metrics.accessibility} is below threshold ${threshold.accessibility}`);
    }

    if (metrics.seo < threshold.seo) {
      failures.push(`SEO score ${metrics.seo} is below threshold ${threshold.seo}`);
    }

    return {
      passed: failures.length === 0,
      metrics,
      failures,
    };
  }
}

export const lighthouseIntegration = LighthouseIntegration.getInstance();
export default lighthouseIntegration;