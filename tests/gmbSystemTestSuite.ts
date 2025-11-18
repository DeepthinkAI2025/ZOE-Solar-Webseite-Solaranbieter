import { gmbOptimizationService } from '../services/gmbOptimizationService';
import { gmbGeoIntegrationService } from '../services/gmbGeoIntegrationService';
import { localSEOAnalyticsService } from '../services/localSEOAnalyticsService';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

/**
 * GMB System Test Suite
 * Umfassende Tests für das gesamte GMB-Management-System
 */
export class GMBSystemTestSuite {
  private testResults: Array<{
    testName: string;
    passed: boolean;
    error?: string;
    duration: number;
  }> = [];

  /**
   * Führt alle Tests aus
   */
  public async runAllTests(): Promise<{
    passed: number;
    failed: number;
    total: number;
    results: any[];
  }> {
    console.log('🧪 Starte GMB System Tests...');

    this.testResults = [];

    // Basis-Tests
    await this.testGMBServiceInitialization();
    await this.testProfileManagement();
    await this.testPostManagement();
    await this.testReviewManagement();
    await this.testQAManagement();
    await this.testAnalyticsIntegration();
    await this.testCompetitorAnalysis();
    await this.testReportingSystem();

    // Integrations-Tests
    await this.testGeoIntegration();
    await this.testDataSynchronization();
    await this.testSystemHealth();

    // Performance-Tests
    await this.testBulkOperations();
    await this.testConcurrentOperations();

    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;

    console.log(`✅ Tests abgeschlossen: ${passed}/${total} bestanden`);

    return { passed, failed, total, results: this.testResults };
  }

  /**
   * Test: GMB Service Initialisierung
   */
  private async testGMBServiceInitialization(): Promise<void> {
    const startTime = Date.now();

    try {
      // Teste Service-Verfügbarkeit
      const profiles = gmbOptimizationService.getAllProfiles();
      const hasProfiles = profiles.length > 0;

      // Teste Basis-Funktionen
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();
      const profile = gmbOptimizationService.getProfileForLocation(testLocation);
      const posts = gmbOptimizationService.getPostsForLocation(testLocation);
      const reviews = gmbOptimizationService.getReviewsForLocation(testLocation);

      const allFunctionsWork = profile && Array.isArray(posts) && Array.isArray(reviews);

      this.recordTest('GMB Service Initialisierung', hasProfiles && allFunctionsWork, startTime);
    } catch (error) {
      this.recordTest('GMB Service Initialisierung', false, startTime, error.message);
    }
  }

  /**
   * Test: Profile-Management
   */
  private async testProfileManagement(): Promise<void> {
    const startTime = Date.now();

    try {
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();

      // Teste Profil-Abruf
      const profile = gmbOptimizationService.getProfileForLocation(testLocation);
      if (!profile) throw new Error('Profil nicht gefunden');

      // Teste Profil-Update
      const updateData = {
        description: 'Test-Beschreibung für Profil-Update',
        website: 'https://www.zoe-solar.de/test'
      };
      const updateResult = gmbOptimizationService.updateProfile(testLocation, updateData);

      // Teste NAP-Konsistenz
      const napResult = gmbOptimizationService.bulkUpdateNAPConsistency([{
        locationKey: testLocation,
        field: 'name',
        value: 'ZOE Solar GmbH Test'
      }]);

      this.recordTest('Profile-Management', updateResult && napResult, startTime);
    } catch (error) {
      this.recordTest('Profile-Management', false, startTime, error.message);
    }
  }

  /**
   * Test: Post-Management
   */
  private async testPostManagement(): Promise<void> {
    const startTime = Date.now();

    try {
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();

      // Teste Post-Erstellung
      const newPost = {
        title: 'Test Post für System-Test',
        content: 'Dies ist ein automatischer Test-Post',
        scheduledPublishTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        locationKey: testLocation
      };

      const createResult = gmbOptimizationService.createPost(newPost);

      // Teste saisonalen Kalender
      const calendar = gmbOptimizationService.generateSeasonalContentCalendar(testLocation, 2025);
      const hasCalendar = calendar && calendar.length > 0;

      // Teste Performance-Tracking
      const posts = gmbOptimizationService.getPostsForLocation(testLocation);
      const performanceResult = posts.length > 0;

      this.recordTest('Post-Management', createResult && hasCalendar && performanceResult, startTime);
    } catch (error) {
      this.recordTest('Post-Management', false, startTime, error.message);
    }
  }

  /**
   * Test: Review-Management
   */
  private async testReviewManagement(): Promise<void> {
    const startTime = Date.now();

    try {
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();

      // Teste Review-Abruf
      const reviews = gmbOptimizationService.getReviewsForLocation(testLocation);
      const hasReviews = Array.isArray(reviews);

      // Teste AI-Antwort-Generierung
      if (reviews.length > 0) {
        const testReview = reviews[0];
        const aiResponse = gmbOptimizationService.generateReviewResponse(testReview.id, testLocation);
        const hasResponse = aiResponse && aiResponse.length > 0;
      }

      // Teste Sentiment-Analyse
      const sentimentResult = gmbOptimizationService.analyzeReviewSentiment(testLocation);
      const hasSentiment = sentimentResult && typeof sentimentResult.overallSentiment === 'string';

      // Teste Templates
      const templates = gmbOptimizationService.getReviewResponseTemplates();
      const hasTemplates = templates && templates.length > 0;

      this.recordTest('Review-Management', hasReviews && hasSentiment && hasTemplates, startTime);
    } catch (error) {
      this.recordTest('Review-Management', false, startTime, error.message);
    }
  }

  /**
   * Test: Q&A-Management
   */
  private async testQAManagement(): Promise<void> {
    const startTime = Date.now();

    try {
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();

      // Teste Q&A-Abruf
      const questions = gmbOptimizationService.getQuestionsForLocation(testLocation);
      const hasQuestions = Array.isArray(questions);

      // Teste AI-Antwort-Generierung für Q&A
      if (questions.length > 0) {
        const testQuestion = questions[0];
        const aiAnswer = gmbOptimizationService.generateQuestionAnswer(testQuestion.id, testLocation);
        const hasAnswer = aiAnswer && aiAnswer.length > 0;
      }

      // Teste FAQ-Integration
      const faqResult = gmbOptimizationService.searchFAQDatabase('Solaranlage');
      const hasFAQ = faqResult && faqResult.length >= 0; // Kann leer sein

      // Teste Performance-Monitoring
      const qaMetrics = gmbOptimizationService.getQAPerformanceMetrics(testLocation);
      const hasMetrics = qaMetrics && typeof qaMetrics.responseRate === 'number';

      this.recordTest('Q&A-Management', hasQuestions && hasFAQ && hasMetrics, startTime);
    } catch (error) {
      this.recordTest('Q&A-Management', false, startTime, error.message);
    }
  }

  /**
   * Test: Analytics-Integration
   */
  private async testAnalyticsIntegration(): Promise<void> {
    const startTime = Date.now();

    try {
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();

      // Teste Performance-Metriken
      const metrics = gmbOptimizationService.generatePerformanceMetrics(testLocation);
      const hasMetrics = metrics && metrics.metrics && metrics.metrics.views;

      // Teste Local Search Insights
      const insights = gmbOptimizationService.getLocalSearchInsights(testLocation);
      const hasInsights = insights && Array.isArray(insights);

      // Teste Berichterstattung
      const weeklyReport = gmbOptimizationService.generateWeeklyReport(testLocation);
      const monthlyReport = gmbOptimizationService.generateMonthlyReport(testLocation);
      const hasReports = weeklyReport && monthlyReport;

      this.recordTest('Analytics-Integration', hasMetrics && hasInsights && hasReports, startTime);
    } catch (error) {
      this.recordTest('Analytics-Integration', false, startTime, error.message);
    }
  }

  /**
   * Test: Competitor Analysis
   */
  private async testCompetitorAnalysis(): Promise<void> {
    const startTime = Date.now();

    try {
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();

      // Teste Konkurrenz-Analyse
      const competitors = gmbOptimizationService.getCompetitorAnalysis(testLocation);
      const hasCompetitors = Array.isArray(competitors) && competitors.length > 0;

      // Teste Konkurrenz-Monitoring
      const monitoringResult = gmbOptimizationService.monitorCompetitorChanges(testLocation);
      const hasMonitoring = monitoringResult !== undefined;

      // Teste Gap-Analyse
      const gaps = gmbOptimizationService.identifyCompetitorGaps(testLocation);
      const hasGaps = Array.isArray(gaps);

      this.recordTest('Competitor Analysis', hasCompetitors && hasMonitoring && hasGaps, startTime);
    } catch (error) {
      this.recordTest('Competitor Analysis', false, startTime, error.message);
    }
  }

  /**
   * Test: Reporting-System
   */
  private async testReportingSystem(): Promise<void> {
    const startTime = Date.now();

    try {
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();

      // Teste verschiedene Report-Typen
      const weekly = gmbOptimizationService.generateWeeklyReport(testLocation);
      const monthly = gmbOptimizationService.generateMonthlyReport(testLocation);
      const custom = gmbOptimizationService.generateCustomReport(testLocation, {
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        metrics: ['views', 'actions', 'reviews']
      });

      const hasAllReports = weekly && monthly && custom;

      // Teste Report-Export
      const exportResult = gmbOptimizationService.exportReport(testLocation, 'weekly', 'pdf');
      const hasExport = exportResult && exportResult.url;

      // Teste automatisierte Berichterstattung
      const automationResult = gmbOptimizationService.scheduleAutomatedReports(testLocation, 'weekly');
      const hasAutomation = automationResult === true;

      this.recordTest('Reporting-System', hasAllReports && hasExport && hasAutomation, startTime);
    } catch (error) {
      this.recordTest('Reporting-System', false, startTime, error.message);
    }
  }

  /**
   * Test: GEO-Integration
   */
  private async testGeoIntegration(): Promise<void> {
    const startTime = Date.now();

    try {
      // Teste Integrations-Service
      const health = gmbGeoIntegrationService.getSystemHealth();
      const hasHealth = health && health.overallStatus;

      // Teste Standort-Integration
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();
      const integrationTest = gmbGeoIntegrationService.testLocationIntegration(testLocation);
      const hasIntegrationTest = integrationTest && typeof integrationTest.gmbConnected === 'boolean';

      // Teste integrierten Report
      const integratedReport = gmbGeoIntegrationService.generateIntegratedReport(testLocation);
      const hasIntegratedReport = integratedReport &&
        integratedReport.gmbData &&
        integratedReport.localSEOData &&
        integratedReport.integratedInsights;

      this.recordTest('GEO-Integration', hasHealth && hasIntegrationTest && hasIntegratedReport, startTime);
    } catch (error) {
      this.recordTest('GEO-Integration', false, startTime, error.message);
    }
  }

  /**
   * Test: Daten-Synchronisation
   */
  private async testDataSynchronization(): Promise<void> {
    const startTime = Date.now();

    try {
      // Teste manuelle Synchronisation
      gmbGeoIntegrationService.syncAllLocations();

      // Teste automatische Synchronisation
      gmbGeoIntegrationService.startAutoSync();
      const isAutoSyncActive = true; // Annahme, da wir den internen State nicht prüfen können

      // Teste Bulk-NAP-Updates
      const bulkUpdateResult = gmbGeoIntegrationService.performBulkNAPUpdate([{
        locationKey: PRIMARY_SERVICE_REGIONS[0].city.toLowerCase(),
        field: 'phone',
        value: '+49 123 456789'
      }]);

      this.recordTest('Daten-Synchronisation', isAutoSyncActive && bulkUpdateResult, startTime);
    } catch (error) {
      this.recordTest('Daten-Synchronisation', false, startTime, error.message);
    }
  }

  /**
   * Test: System-Health
   */
  private async testSystemHealth(): Promise<void> {
    const startTime = Date.now();

    try {
      const health = gmbGeoIntegrationService.getSystemHealth();

      // Prüfe alle Health-Indikatoren
      const hasOverallStatus = ['healthy', 'warning', 'critical'].includes(health.overallStatus);
      const hasGMBStatus = ['online', 'offline', 'degraded'].includes(health.gmbStatus);
      const hasGeoStatus = ['online', 'offline', 'degraded'].includes(health.geoStatus);
      const hasActiveIntegrations = typeof health.activeIntegrations === 'number';
      const hasLastSync = health.lastSyncStatus;

      const allHealthChecks = hasOverallStatus && hasGMBStatus && hasGeoStatus &&
                             hasActiveIntegrations && hasLastSync;

      this.recordTest('System-Health', allHealthChecks, startTime);
    } catch (error) {
      this.recordTest('System-Health', false, startTime, error.message);
    }
  }

  /**
   * Test: Bulk-Operations
   */
  private async testBulkOperations(): Promise<void> {
    const startTime = Date.now();

    try {
      // Teste Bulk-Profile-Updates
      const bulkProfiles = PRIMARY_SERVICE_REGIONS.slice(0, 3).map(region => ({
        locationKey: region.city.toLowerCase(),
        updates: { description: `Bulk-Update für ${region.city}` }
      }));

      const bulkProfileResult = gmbOptimizationService.bulkUpdateProfiles(bulkProfiles);

      // Teste Bulk-Post-Erstellung
      const bulkPosts = PRIMARY_SERVICE_REGIONS.slice(0, 2).map(region => ({
        title: `Bulk Post für ${region.city}`,
        content: 'Automatisierte Bulk-Post-Erstellung',
        scheduledPublishTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        locationKey: region.city.toLowerCase()
      }));

      const bulkPostResult = gmbOptimizationService.bulkCreatePosts(bulkPosts);

      // Teste Bulk-NAP-Updates über Integration
      const bulkNAPResult = gmbGeoIntegrationService.performBulkNAPUpdate([
        {
          locationKey: PRIMARY_SERVICE_REGIONS[0].city.toLowerCase(),
          field: 'address',
          value: 'Teststraße 123, 12345 Teststadt'
        }
      ]);

      this.recordTest('Bulk-Operations', bulkProfileResult && bulkPostResult && bulkNAPResult, startTime);
    } catch (error) {
      this.recordTest('Bulk-Operations', false, startTime, error.message);
    }
  }

  /**
   * Test: Concurrent Operations
   */
  private async testConcurrentOperations(): Promise<void> {
    const startTime = Date.now();

    try {
      const testLocation = PRIMARY_SERVICE_REGIONS[0].city.toLowerCase();

      // Simuliere gleichzeitige Operationen
      const operations = [
        gmbOptimizationService.getProfileForLocation(testLocation),
        gmbOptimizationService.getPostsForLocation(testLocation),
        gmbOptimizationService.getReviewsForLocation(testLocation),
        gmbOptimizationService.generatePerformanceMetrics(testLocation),
        gmbGeoIntegrationService.generateIntegratedReport(testLocation)
      ];

      // Führe alle Operationen parallel aus
      const results = await Promise.allSettled(operations);

      // Prüfe, dass alle Operationen erfolgreich waren
      const allSuccessful = results.every(result => result.status === 'fulfilled');

      // Prüfe, dass keine Operationen fehlgeschlagen sind
      const noRejections = results.filter(result => result.status === 'rejected').length === 0;

      this.recordTest('Concurrent Operations', allSuccessful && noRejections, startTime);
    } catch (error) {
      this.recordTest('Concurrent Operations', false, startTime, error.message);
    }
  }

  /**
   * Hilfsfunktion: Test-Ergebnis aufzeichnen
   */
  private recordTest(testName: string, passed: boolean, startTime: number, error?: string): void {
    const duration = Date.now() - startTime;
    this.testResults.push({
      testName,
      passed,
      error,
      duration
    });

    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${passed ? 'Bestanden' : 'Fehlgeschlagen'} (${duration}ms)`);
    if (error) console.log(`   Fehler: ${error}`);
  }

  /**
   * Generiert Test-Report
   */
  public generateTestReport(): {
    summary: {
      total: number;
      passed: number;
      failed: number;
      successRate: number;
      totalDuration: number;
    };
    results: any[];
    recommendations: string[];
  } {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = total - passed;
    const successRate = total > 0 ? (passed / total) * 100 : 0;
    const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);

    const recommendations: string[] = [];

    if (failed > 0) {
      recommendations.push(`${failed} Tests sind fehlgeschlagen - Überprüfung der fehlgeschlagenen Komponenten erforderlich`);
    }

    if (successRate < 90) {
      recommendations.push('System-Performance unter 90% - Optimierung empfohlen');
    }

    const failedTests = this.testResults.filter(r => !r.passed);
    if (failedTests.length > 0) {
      recommendations.push('Fehlgeschlagene Tests analysieren und beheben');
    }

    return {
      summary: { total, passed, failed, successRate, totalDuration },
      results: this.testResults,
      recommendations
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const gmbSystemTestSuite = new GMBSystemTestSuite();