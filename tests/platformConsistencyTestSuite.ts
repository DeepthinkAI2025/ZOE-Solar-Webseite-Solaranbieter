/**
 * Platform Consistency Test Suite für ZOE Solar
 *
 * Spezifische Tests für Multi-Language Support und Cross-Platform Entity Consistency
 */

import { crossPlatformEntityConsistencyService } from '../services/crossPlatformEntityConsistencyService';
import { multiLanguageEntityService } from '../services/multiLanguageEntityService';

export interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

export interface TestSuite {
  suiteName: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  totalDuration: number;
  coverage: number;
}

class PlatformConsistencyTestSuite {
  private static instance: PlatformConsistencyTestSuite;
  private testResults: Map<string, TestSuite> = new Map();

  private constructor() {}

  public static getInstance(): PlatformConsistencyTestSuite {
    if (!PlatformConsistencyTestSuite.instance) {
      PlatformConsistencyTestSuite.instance = new PlatformConsistencyTestSuite();
    }
    return PlatformConsistencyTestSuite.instance;
  }

  public async runAllTests(): Promise<Map<string, TestSuite>> {
    console.log('🚀 Starting Platform Consistency test suite...\n');

    const testSuites = [
      'MultiLanguageSupport',
      'CrossPlatformSync',
      'ConsistencyMonitoring'
    ];

    for (const suiteName of testSuites) {
      console.log(`📋 Running ${suiteName} tests...`);
      const suite = await this.runTestSuite(suiteName);
      this.testResults.set(suiteName, suite);
      this.printSuiteResults(suite);
    }

    this.printOverallResults();
    return this.testResults;
  }

  private async runTestSuite(suiteName: string): Promise<TestSuite> {
    const startTime = Date.now();
    let tests: TestResult[] = [];

    switch (suiteName) {
      case 'MultiLanguageSupport':
        tests = await this.testMultiLanguageSupport();
        break;
      case 'CrossPlatformSync':
        tests = await this.testCrossPlatformSync();
        break;
      case 'ConsistencyMonitoring':
        tests = await this.testConsistencyMonitoring();
        break;
    }

    const passed = tests.filter(t => t.passed).length;
    const failed = tests.length - passed;
    const totalDuration = Date.now() - startTime;

    return {
      suiteName,
      tests,
      passed,
      failed,
      totalDuration,
      coverage: this.calculateCoverage(tests)
    };
  }

  private async testMultiLanguageSupport(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Translation Pipeline
    tests.push(await this.runTest('Translation Pipeline', async () => {
      const entity = {
        id: 'test-entity',
        name: 'ZOE Solar GmbH',
        description: 'Photovoltaik-Anbieter',
        type: 'Organization'
      };

      const translated = await multiLanguageEntityService.translateEntity(entity, 'en');
      this.assert(translated.name !== entity.name, 'Entity should be translated');
      this.assert(typeof translated.name === 'string', 'Translated name should be string');
      this.assert(translated.language === 'en', 'Language should be set correctly');
    }));

    // Test 2: Language-specific Authority Scoring
    tests.push(await this.runTest('Language-specific Authority Scoring', () => {
      const entity = {
        id: 'test-entity',
        name: 'ZOE Solar GmbH',
        description: 'Photovoltaik-Anbieter',
        type: 'Organization'
      };

      const score = multiLanguageEntityService.calculateLanguageAuthorityScore(entity, 'de');
      this.assert(typeof score === 'number', 'Authority score should be number');
      this.assert(score >= 0 && score <= 100, 'Score should be between 0-100');
    }));

    // Test 3: Multi-Language Entity Creation
    tests.push(await this.runTest('Multi-Language Entity Creation', async () => {
      const entityId = await multiLanguageEntityService.createMultiLanguageEntity({
        baseEntity: {
          name: 'ZOE Solar GmbH',
          description: 'Photovoltaik-Anbieter',
          type: 'Organization'
        },
        targetLanguages: ['en', 'fr']
      });

      this.assert(typeof entityId === 'string', 'Entity ID should be string');
      this.assert(entityId.length > 0, 'Entity ID should not be empty');
    }));

    return tests;
  }

  private async testCrossPlatformSync(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Unified Entity Creation
    tests.push(await this.runTest('Unified Entity Creation', () => {
      const unifiedEntity = crossPlatformEntityConsistencyService.createUnifiedEntity({
        name: 'ZOE Solar GmbH',
        type: 'Organization',
        platforms: ['google', 'facebook', 'linkedin']
      });

      this.assert(unifiedEntity.id !== undefined, 'Unified entity should have ID');
      this.assert(unifiedEntity.name === 'ZOE Solar GmbH', 'Name should match');
      this.assert(Array.isArray(unifiedEntity.platforms), 'Platforms should be array');
    }));

    // Test 2: Real-time Sync Start
    tests.push(await this.runTest('Real-time Sync Start', async () => {
      const syncId = await crossPlatformEntityConsistencyService.startRealTimeSync({
        platforms: ['google', 'facebook'],
        interval: 30000
      });

      this.assert(typeof syncId === 'string', 'Sync ID should be string');
      this.assert(syncId.length > 0, 'Sync ID should not be empty');
    }));

    // Test 3: Platform-specific Optimization
    tests.push(await this.runTest('Platform-specific Optimization', () => {
      const googleOptimization = crossPlatformEntityConsistencyService.optimizeForPlatform('google', {
        name: 'ZOE Solar GmbH',
        description: 'Photovoltaik-Anbieter'
      });

      this.assert(googleOptimization.platform === 'google', 'Platform should be set');
      this.assert(typeof googleOptimization.optimizedData === 'object', 'Optimized data should be object');

      const linkedinOptimization = crossPlatformEntityConsistencyService.optimizeForPlatform('linkedin', {
        name: 'ZOE Solar GmbH',
        description: 'Photovoltaik-Anbieter'
      });

      this.assert(linkedinOptimization.platform === 'linkedin', 'Platform should be set');
    }));

    return tests;
  }

  private async testConsistencyMonitoring(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: NAP Consistency Check
    tests.push(await this.runTest('NAP Consistency Check', async () => {
      const napData: any = {
        name: 'ZOE Solar GmbH',
        address: 'Teststraße 123, 12345 Teststadt',
        phone: '+49 123 456789'
      };

      const consistency = await crossPlatformEntityConsistencyService.performNAPConsistencyCheck(napData);
      this.assert(typeof consistency.score === 'number', 'Consistency score should be number');
      this.assert(consistency.score >= 0 && consistency.score <= 100, 'Score should be 0-100');
      this.assert(Array.isArray(consistency.issues), 'Issues should be array');
    }));

    // Test 2: Authority Correlation
    tests.push(await this.runTest('Authority Correlation', () => {
      const platforms = ['google', 'facebook', 'linkedin'];
      const correlation = crossPlatformEntityConsistencyService.calculateAuthorityCorrelation(platforms);

      this.assert(typeof correlation.overallScore === 'number', 'Overall score should be number');
      this.assert(correlation.overallScore >= 0 && correlation.overallScore <= 100, 'Score should be 0-100');
      this.assert(Array.isArray(correlation.platformScores), 'Platform scores should be array');
    }));

    // Test 3: 100% Consistency Verification
    tests.push(await this.runTest('100% Consistency Verification', () => {
      const report = crossPlatformEntityConsistencyService.checkConsistency();

      // Verify all components for 100% consistency
      this.assert(report.overallScore === 100, `Consistency should be 100%, current: ${report.overallScore}`);
      this.assert(report.totalIssues === 0, `Should have no issues, current: ${report.totalIssues}`);

      // Check platform-specific scores
      report.platforms.forEach(platform => {
        this.assert(platform.consistencyScore === 100, `Platform ${platform.name} should have 100% consistency, current: ${platform.consistencyScore}`);
      });
    }));

    return tests;
  }

  private async runTest(testName: string, testFunction: () => void | Promise<void>): Promise<TestResult> {
    const startTime = Date.now();

    try {
      await testFunction();

      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private assert(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  private calculateCoverage(tests: TestResult[]): number {
    const passed = tests.filter(t => t.passed).length;
    return Math.round((passed / tests.length) * 100);
  }

  private printSuiteResults(suite: TestSuite): void {
    const passRate = Math.round((suite.passed / suite.tests.length) * 100);
    const status = suite.failed === 0 ? '✅' : '❌';

    console.log(`${status} ${suite.suiteName}: ${suite.passed}/${suite.tests.length} passed (${passRate}%) - ${suite.totalDuration}ms`);

    if (suite.failed > 0) {
      suite.tests.filter(t => !t.passed).forEach(test => {
        console.log(`  ❌ ${test.testName}: ${test.error}`);
      });
    }
    console.log('');
  }

  private printOverallResults(): void {
    const allTests = Array.from(this.testResults.values()).flatMap(suite => suite.tests);
    const totalPassed = allTests.filter(t => t.passed).length;
    const totalTests = allTests.length;
    const overallPassRate = Math.round((totalPassed / totalTests) * 100);
    const totalDuration = Array.from(this.testResults.values()).reduce((sum, suite) => sum + suite.totalDuration, 0);

    console.log('📊 PLATFORM CONSISTENCY TEST RESULTS');
    console.log('=====================================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalTests - totalPassed}`);
    console.log(`Pass Rate: ${overallPassRate}%`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log('');

    if (overallPassRate === 100) {
      console.log('🎉 All Platform Consistency tests passed! 100% consistency achieved.');
    } else {
      console.log('⚠️ Some tests failed. Review consistency implementation.');
    }
  }

  public getTestResults(): Map<string, TestSuite> {
    return new Map(this.testResults);
  }

  public generateTestReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      suites: Array.from(this.testResults.values()),
      summary: {
        totalSuites: this.testResults.size,
        totalTests: Array.from(this.testResults.values()).reduce((sum, suite) => sum + suite.tests.length, 0),
        totalPassed: Array.from(this.testResults.values()).reduce((sum, suite) => sum + suite.passed, 0),
        totalFailed: Array.from(this.testResults.values()).reduce((sum, suite) => sum + suite.failed, 0),
        totalDuration: Array.from(this.testResults.values()).reduce((sum, suite) => sum + suite.totalDuration, 0)
      }
    };

    return JSON.stringify(report, null, 2);
  }
}

export const platformConsistencyTestSuite = PlatformConsistencyTestSuite.getInstance();
export default platformConsistencyTestSuite;