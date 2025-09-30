/**
 * AI Integration Test Suite für ZOE Solar
 *
 * Umfassende Tests für alle AI-Services und deren Integration
 * in bestehende SEO/GEO/AEO-Systeme
 */

import { aiIntegrationService } from '../services/aiIntegrationService';
import { aiFirstContentOptimizationService } from '../services/aiFirstContentOptimizationService';
import { predictiveKeywordAnalysisService } from '../services/predictiveKeywordAnalysisService';
import { contentPerformancePredictionService } from '../services/contentPerformancePredictionService';
import { userBehaviorPatternAnalysisService } from '../services/userBehaviorPatternAnalysisService';
import { aiPlatformIntegrationService } from '../services/aiPlatformIntegrationService';
import { semanticAIUnderstandingService } from '../services/semanticAIUnderstandingService';
import { aiMonitoringAnalyticsService } from '../services/aiMonitoringAnalyticsService';
import { aiFutureProofingService } from '../services/aiFutureProofingService';

// ===== TEST UTILITIES =====

interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

interface TestSuiteResult {
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  results: TestResult[];
}

class AITestRunner {
  private results: TestSuiteResult[] = [];

  async runAllTests(): Promise<TestSuiteResult[]> {
    console.log('🚀 Starting AI Integration Test Suite...');

    // Test Suites
    await this.runAIServiceTests();
    await this.runIntegrationTests();
    await this.runPerformanceTests();
    await this.runErrorHandlingTests();
    await this.runEndToEndTests();

    console.log('✅ AI Integration Test Suite completed');
    return this.results;
  }

  private async runAIServiceTests(): Promise<void> {
    const suite: TestSuiteResult = {
      suiteName: 'AI Service Tests',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      results: []
    };

    const startTime = Date.now();

    // Test AI-First Content Optimization
    suite.results.push(await this.testAIContentOptimization());
    suite.results.push(await this.testPredictiveKeywordAnalysis());
    suite.results.push(await this.testContentPerformancePrediction());
    suite.results.push(await this.testUserBehaviorAnalysis());
    suite.results.push(await this.testAIPlatformIntegration());
    suite.results.push(await this.testSemanticUnderstanding());
    suite.results.push(await this.testAIMonitoring());
    suite.results.push(await this.testAIFutureProofing());

    suite.totalTests = suite.results.length;
    suite.passedTests = suite.results.filter(r => r.passed).length;
    suite.failedTests = suite.results.filter(r => !r.passed).length;
    suite.duration = Date.now() - startTime;

    this.results.push(suite);
  }

  private async runIntegrationTests(): Promise<void> {
    const suite: TestSuiteResult = {
      suiteName: 'Integration Tests',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      results: []
    };

    const startTime = Date.now();

    // Test Integration mit bestehenden Systemen
    suite.results.push(await this.testSEOIntegration());
    suite.results.push(await this.testGEOIntegration());
    suite.results.push(await this.testAEOIntegration());
    suite.results.push(await this.testContentManagementIntegration());
    suite.results.push(await this.testAnalyticsIntegration());

    suite.totalTests = suite.results.length;
    suite.passedTests = suite.results.filter(r => r.passed).length;
    suite.failedTests = suite.results.filter(r => !r.passed).length;
    suite.duration = Date.now() - startTime;

    this.results.push(suite);
  }

  private async runPerformanceTests(): Promise<void> {
    const suite: TestSuiteResult = {
      suiteName: 'Performance Tests',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      results: []
    };

    const startTime = Date.now();

    // Performance Tests
    suite.results.push(await this.testContentOptimizationPerformance());
    suite.results.push(await this.testBatchProcessingPerformance());
    suite.results.push(await this.testCachingPerformance());
    suite.results.push(await this.testConcurrentRequestsPerformance());

    suite.totalTests = suite.results.length;
    suite.passedTests = suite.results.filter(r => r.passed).length;
    suite.failedTests = suite.results.filter(r => !r.passed).length;
    suite.duration = Date.now() - startTime;

    this.results.push(suite);
  }

  private async runErrorHandlingTests(): Promise<void> {
    const suite: TestSuiteResult = {
      suiteName: 'Error Handling Tests',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      results: []
    };

    const startTime = Date.now();

    // Error Handling Tests
    suite.results.push(await this.testInvalidInputHandling());
    suite.results.push(await this.testServiceFailureHandling());
    suite.results.push(await this.testTimeoutHandling());
    suite.results.push(await this.testRateLimitHandling());

    suite.totalTests = suite.results.length;
    suite.passedTests = suite.results.filter(r => r.passed).length;
    suite.failedTests = suite.results.filter(r => !r.passed).length;
    suite.duration = Date.now() - startTime;

    this.results.push(suite);
  }

  private async runEndToEndTests(): Promise<void> {
    const suite: TestSuiteResult = {
      suiteName: 'End-to-End Tests',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0,
      results: []
    };

    const startTime = Date.now();

    // End-to-End Tests
    suite.results.push(await this.testCompleteContentPipeline());
    suite.results.push(await this.testMultiPlatformOptimization());
    suite.results.push(await this.testRealTimeUpdates());
    suite.results.push(await this.testDashboardIntegration());

    suite.totalTests = suite.results.length;
    suite.passedTests = suite.results.filter(r => r.passed).length;
    suite.failedTests = suite.results.filter(r => !r.passed).length;
    suite.duration = Date.now() - startTime;

    this.results.push(suite);
  }

  // ===== INDIVIDUAL TEST METHODS =====

  private async testAIContentOptimization(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const testContent = 'ZOE Solar bietet Photovoltaik-Lösungen für Unternehmen und Privatkunden.';
      const result = await aiFirstContentOptimizationService.optimizeContent({
        content: testContent,
        contentType: 'page',
        optimizationGoals: ['readability', 'citations'],
        context: { industry: 'solar', audience: 'business' }
      });

      const passed = result && result.optimizedContent && result.appliedOptimizations.length > 0;

      return {
        testName: 'AI Content Optimization',
        passed,
        duration: Date.now() - startTime,
        details: passed ? { optimizationsApplied: result.appliedOptimizations.length } : undefined
      };
    } catch (error) {
      return {
        testName: 'AI Content Optimization',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testPredictiveKeywordAnalysis(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const predictions = predictiveKeywordAnalysisService.getKeywordPredictions();
      const passed = Array.isArray(predictions) && predictions.length > 0;

      return {
        testName: 'Predictive Keyword Analysis',
        passed,
        duration: Date.now() - startTime,
        details: passed ? { predictionsCount: predictions.length } : undefined
      };
    } catch (error) {
      return {
        testName: 'Predictive Keyword Analysis',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testContentPerformancePrediction(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const predictions = contentPerformancePredictionService.getPerformancePredictions();
      const passed = Array.isArray(predictions) && predictions.length > 0;

      return {
        testName: 'Content Performance Prediction',
        passed,
        duration: Date.now() - startTime,
        details: passed ? { predictionsCount: predictions.length } : undefined
      };
    } catch (error) {
      return {
        testName: 'Content Performance Prediction',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testUserBehaviorAnalysis(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const insights = userBehaviorPatternAnalysisService.getBehaviorInsights();
      const passed = Array.isArray(insights) && insights.length >= 0; // Can be empty initially

      return {
        testName: 'User Behavior Analysis',
        passed,
        duration: Date.now() - startTime,
        details: { insightsCount: insights.length }
      };
    } catch (error) {
      return {
        testName: 'User Behavior Analysis',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testAIPlatformIntegration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const optimizations = aiPlatformIntegrationService.getPlatformOptimizations();
      const passed = Array.isArray(optimizations) && optimizations.length >= 0;

      return {
        testName: 'AI Platform Integration',
        passed,
        duration: Date.now() - startTime,
        details: { optimizationsCount: optimizations.length }
      };
    } catch (error) {
      return {
        testName: 'AI Platform Integration',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testSemanticUnderstanding(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const entities = semanticAIUnderstandingService.getAllEntities();
      const passed = Array.isArray(entities) && entities.length >= 0;

      return {
        testName: 'Semantic Understanding',
        passed,
        duration: Date.now() - startTime,
        details: { entitiesCount: entities.length }
      };
    } catch (error) {
      return {
        testName: 'Semantic Understanding',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testAIMonitoring(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const performance = aiMonitoringAnalyticsService.getAISearchPerformance();
      const passed = Array.isArray(performance) && performance.length >= 0;

      return {
        testName: 'AI Monitoring & Analytics',
        passed,
        duration: Date.now() - startTime,
        details: { performanceDataCount: performance.length }
      };
    } catch (error) {
      return {
        testName: 'AI Monitoring & Analytics',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testAIFutureProofing(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const stats = aiFutureProofingService.getStats();
      const passed = typeof stats === 'object' && stats !== null;

      return {
        testName: 'AI Future-Proofing',
        passed,
        duration: Date.now() - startTime,
        details: stats
      };
    } catch (error) {
      return {
        testName: 'AI Future-Proofing',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ===== INTEGRATION TESTS =====

  private async testSEOIntegration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const result = await aiIntegrationService.integrateWithSEO(
        'Test SEO Content für AI-Optimierung',
        { keywords: ['photovoltaik', 'solar'], location: 'berlin' }
      );

      const passed = result && result.optimizedContent && result.aiOptimizations.length > 0;

      return {
        testName: 'SEO Integration',
        passed,
        duration: Date.now() - startTime,
        details: passed ? { optimizations: result.aiOptimizations.length } : undefined
      };
    } catch (error) {
      return {
        testName: 'SEO Integration',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testGEOIntegration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const result = await aiIntegrationService.integrateWithGEO(
        'Test GEO Content für AI-Optimierung',
        { keywords: ['photovoltaik', 'berlin'], location: 'berlin' }
      );

      const passed = result && result.optimizedContent && result.aiOptimizations.length > 0;

      return {
        testName: 'GEO Integration',
        passed,
        duration: Date.now() - startTime,
        details: passed ? { optimizations: result.aiOptimizations.length } : undefined
      };
    } catch (error) {
      return {
        testName: 'GEO Integration',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testAEOIntegration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const result = await aiIntegrationService.integrateWithAEO(
        'Test AEO Content für AI-Optimierung',
        { keywords: ['photovoltaik'], audience: 'expert' }
      );

      const passed = result && result.optimizedContent && result.aiOptimizations.length > 0;

      return {
        testName: 'AEO Integration',
        passed,
        duration: Date.now() - startTime,
        details: passed ? { optimizations: result.aiOptimizations.length } : undefined
      };
    } catch (error) {
      return {
        testName: 'AEO Integration',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testContentManagementIntegration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test Content Optimization
      const result = await aiIntegrationService.optimizeContent(
        '/test-content',
        'Test content for optimization'
      );

      const passed = result && result.optimizedContent !== result.originalContent;

      return {
        testName: 'Content Management Integration',
        passed,
        duration: Date.now() - startTime,
        details: passed ? { contentChanged: true } : undefined
      };
    } catch (error) {
      return {
        testName: 'Content Management Integration',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testAnalyticsIntegration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const dashboard = await aiIntegrationService.generateIntegrationDashboard();
      const passed = dashboard && dashboard.overview && dashboard.performance;

      return {
        testName: 'Analytics Integration',
        passed,
        duration: Date.now() - startTime,
        details: passed ? dashboard.overview : undefined
      };
    } catch (error) {
      return {
        testName: 'Analytics Integration',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ===== PERFORMANCE TESTS =====

  private async testContentOptimizationPerformance(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const testContent = 'ZOE Solar bietet umfassende Photovoltaik-Lösungen für gewerbliche und private Anwendungen.';
      const result = await aiIntegrationService.optimizeContent('/performance-test', testContent);

      const duration = Date.now() - startTime;
      const passed = duration < 5000; // Should complete within 5 seconds

      return {
        testName: 'Content Optimization Performance',
        passed,
        duration,
        details: { processingTime: duration, acceptable: passed }
      };
    } catch (error) {
      return {
        testName: 'Content Optimization Performance',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testBatchProcessingPerformance(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const requests = Array.from({ length: 5 }, (_, i) => ({
        url: `/batch-test-${i}`,
        content: `Test content ${i} for batch processing performance test.`,
        contentType: 'page' as const,
        optimizationGoals: ['readability']
      }));

      const results = await aiIntegrationService.processBatch(requests);

      const duration = Date.now() - startTime;
      const passed = results.length === 5 && duration < 15000; // 5 requests within 15 seconds

      return {
        testName: 'Batch Processing Performance',
        passed,
        duration,
        details: { requestsProcessed: results.length, totalTime: duration }
      };
    } catch (error) {
      return {
        testName: 'Batch Processing Performance',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testCachingPerformance(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const testUrl = '/caching-test';
      const testContent = 'Test content for caching performance.';

      // First request (should cache)
      await aiIntegrationService.optimizeContent(testUrl, testContent);
      const firstDuration = Date.now() - startTime;

      // Second request (should use cache)
      const secondStart = Date.now();
      await aiIntegrationService.optimizeContent(testUrl, testContent);
      const secondDuration = Date.now() - secondStart;

      const passed = secondDuration < firstDuration; // Cached request should be faster

      return {
        testName: 'Caching Performance',
        passed,
        duration: Date.now() - startTime,
        details: { firstRequest: firstDuration, secondRequest: secondDuration, cacheWorking: passed }
      };
    } catch (error) {
      return {
        testName: 'Caching Performance',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testConcurrentRequestsPerformance(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const requests = Array.from({ length: 10 }, (_, i) => ({
        url: `/concurrent-test-${i}`,
        content: `Concurrent test content ${i}.`,
        contentType: 'page' as const,
        optimizationGoals: ['readability']
      }));

      // Process concurrently
      const promises = requests.map(request =>
        aiIntegrationService.optimizeContent(request.url, request.content)
      );

      const results = await Promise.all(promises);

      const duration = Date.now() - startTime;
      const passed = results.length === 10 && duration < 20000; // 10 concurrent requests within 20 seconds

      return {
        testName: 'Concurrent Requests Performance',
        passed,
        duration,
        details: { requestsProcessed: results.length, totalTime: duration }
      };
    } catch (error) {
      return {
        testName: 'Concurrent Requests Performance',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ===== ERROR HANDLING TESTS =====

  private async testInvalidInputHandling(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test with empty content
      await aiIntegrationService.optimizeContent('/invalid-test', '');
      return {
        testName: 'Invalid Input Handling',
        passed: false,
        duration: Date.now() - startTime,
        error: 'Should have thrown error for empty content'
      };
    } catch (error) {
      const passed = error instanceof Error;
      return {
        testName: 'Invalid Input Handling',
        passed,
        duration: Date.now() - startTime,
        details: { errorHandled: passed }
      };
    }
  }

  private async testServiceFailureHandling(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test with invalid service configuration
      const originalConfig = aiIntegrationService.getConfig();
      aiIntegrationService.updateConfig({ enabled: false });

      try {
        await aiIntegrationService.optimizeContent('/failure-test', 'Test content');
        return {
          testName: 'Service Failure Handling',
          passed: false,
          duration: Date.now() - startTime,
          error: 'Should have thrown error when service disabled'
        };
      } finally {
        // Restore configuration
        aiIntegrationService.updateConfig(originalConfig);
      }
    } catch (error) {
      const passed = error instanceof Error;
      return {
        testName: 'Service Failure Handling',
        passed,
        duration: Date.now() - startTime,
        details: { errorHandled: passed }
      };
    }
  }

  private async testTimeoutHandling(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test with very large content that might timeout
      const largeContent = 'Test content. '.repeat(10000); // Very large content
      const result = await aiIntegrationService.optimizeContent('/timeout-test', largeContent);

      const duration = Date.now() - startTime;
      const passed = duration < 30000; // Should complete within 30 seconds

      return {
        testName: 'Timeout Handling',
        passed,
        duration,
        details: { completedWithinTimeout: passed, processingTime: duration }
      };
    } catch (error) {
      return {
        testName: 'Timeout Handling',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testRateLimitHandling(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test rapid successive requests
      const requests = Array.from({ length: 20 }, (_, i) =>
        aiIntegrationService.optimizeContent(`/rate-limit-test-${i}`, `Content ${i}`)
      );

      const results = await Promise.allSettled(requests);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      const passed = successful > 0; // At least some should succeed

      return {
        testName: 'Rate Limit Handling',
        passed,
        duration: Date.now() - startTime,
        details: { successful, failed, total: results.length }
      };
    } catch (error) {
      return {
        testName: 'Rate Limit Handling',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ===== END-TO-END TESTS =====

  private async testCompleteContentPipeline(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const originalContent = 'ZOE Solar bietet Photovoltaik-Anlagen für Unternehmen in Berlin.';

      // Complete pipeline: optimize -> predict -> monitor
      const optimization = await aiIntegrationService.optimizeContent('/e2e-test', originalContent);

      // Verify all components worked
      const hasOptimizations = optimization.aiOptimizations.length > 0;
      const hasSemanticEnhancements = optimization.semanticEnhancements.length > 0;
      const hasPlatformOptimizations = optimization.platformOptimizations.length > 0;
      const hasPerformancePredictions = optimization.performancePredictions.length > 0;

      const passed = hasOptimizations && hasSemanticEnhancements && hasPlatformOptimizations && hasPerformancePredictions;

      return {
        testName: 'Complete Content Pipeline',
        passed,
        duration: Date.now() - startTime,
        details: {
          optimizations: hasOptimizations,
          semantic: hasSemanticEnhancements,
          platform: hasPlatformOptimizations,
          performance: hasPerformancePredictions
        }
      };
    } catch (error) {
      return {
        testName: 'Complete Content Pipeline',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testMultiPlatformOptimization(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const content = 'ZOE Solar Photovoltaik-Lösungen für die Zukunft.';

      // Test optimization for multiple platforms
      const result = await aiPlatformIntegrationService.optimizeForPlatforms({
        content,
        contentType: 'page',
        targetPlatforms: ['openai', 'google_bard', 'bing_copilot', 'perplexity'],
        optimizationGoals: ['citations', 'structured_data', 'ai_visibility']
      });

      const passed = result.platformOptimizations.length >= 2; // At least 2 platforms optimized

      return {
        testName: 'Multi-Platform Optimization',
        passed,
        duration: Date.now() - startTime,
        details: { platformsOptimized: result.platformOptimizations.length }
      };
    } catch (error) {
      return {
        testName: 'Multi-Platform Optimization',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testRealTimeUpdates(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test real-time sync capability
      const syncResult = await aiIntegrationService.performFullSync();

      const passed = syncResult && syncResult.results.length > 0;

      return {
        testName: 'Real-Time Updates',
        passed,
        duration: Date.now() - startTime,
        details: { servicesSynced: syncResult.results.length }
      };
    } catch (error) {
      return {
        testName: 'Real-Time Updates',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testDashboardIntegration(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const dashboard = await aiIntegrationService.generateIntegrationDashboard();

      const hasOverview = dashboard.overview && typeof dashboard.overview.totalOptimizations === 'number';
      const hasPerformance = dashboard.performance && dashboard.performance.servicePerformance;
      const hasInsights = dashboard.insights && dashboard.insights.aiVisibilityScore >= 0;
      const hasRecommendations = Array.isArray(dashboard.recommendations);

      const passed = hasOverview && hasPerformance && hasInsights && hasRecommendations;

      return {
        testName: 'Dashboard Integration',
        passed,
        duration: Date.now() - startTime,
        details: {
          overview: hasOverview,
          performance: hasPerformance,
          insights: hasInsights,
          recommendations: hasRecommendations
        }
      };
    } catch (error) {
      return {
        testName: 'Dashboard Integration',
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ===== UTILITY METHODS =====

  getTestSummary(): {
    totalSuites: number;
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalDuration: number;
    successRate: number;
  } {
    const totalSuites = this.results.length;
    const totalTests = this.results.reduce((sum, suite) => sum + suite.totalTests, 0);
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passedTests, 0);
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failedTests, 0);
    const totalDuration = this.results.reduce((sum, suite) => sum + suite.duration, 0);
    const successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

    return {
      totalSuites,
      totalTests,
      totalPassed,
      totalFailed,
      totalDuration,
      successRate
    };
  }

  getFailedTests(): TestResult[] {
    return this.results.flatMap(suite => suite.results.filter(test => !test.passed));
  }

  generateReport(): string {
    const summary = this.getTestSummary();
    const failedTests = this.getFailedTests();

    let report = '# AI Integration Test Report\n\n';
    report += `## Summary\n\n`;
    report += `- **Total Test Suites:** ${summary.totalSuites}\n`;
    report += `- **Total Tests:** ${summary.totalTests}\n`;
    report += `- **Passed:** ${summary.totalPassed}\n`;
    report += `- **Failed:** ${summary.totalFailed}\n`;
    report += `- **Success Rate:** ${summary.successRate.toFixed(2)}%\n`;
    report += `- **Total Duration:** ${summary.totalDuration}ms\n\n`;

    if (failedTests.length > 0) {
      report += `## Failed Tests\n\n`;
      failedTests.forEach(test => {
        report += `### ${test.testName}\n`;
        report += `- **Duration:** ${test.duration}ms\n`;
        report += `- **Error:** ${test.error || 'No error message'}\n\n`;
      });
    }

    report += `## Detailed Results\n\n`;
    this.results.forEach(suite => {
      report += `### ${suite.suiteName}\n`;
      report += `- **Tests:** ${suite.totalTests}\n`;
      report += `- **Passed:** ${suite.passedTests}\n`;
      report += `- **Failed:** ${suite.failedTests}\n`;
      report += `- **Duration:** ${suite.duration}ms\n\n`;
    });

    return report;
  }
}

// ===== EXPORT =====

export const aiTestRunner = new AITestRunner();
export default aiTestRunner;

/**
 * ===== USAGE =====
 *
 * import { aiTestRunner } from './tests/aiIntegrationTestSuite';
 *
 * // Run all tests
 * const results = await aiTestRunner.runAllTests();
 *
 * // Get summary
 * const summary = aiTestRunner.getTestSummary();
 *
 * // Get failed tests
 * const failedTests = aiTestRunner.getFailedTests();
 *
 * // Generate report
 * const report = aiTestRunner.generateReport();
 * console.log(report);
 */