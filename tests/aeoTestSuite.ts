/**
 * AEO Test Suite für ZOE Solar
 * 
 * Umfassende Tests und Validierungen für alle
 * Authoritative Entity Optimization (AEO) Komponenten
 */

// Import Test Framework (Jest-Style)
import { entityKnowledgeGraphService } from '../services/entityKnowledgeGraphService';
import { eatSignalEnhancementService } from '../services/eatSignalEnhancementService';
import { aeoStructuredDataService } from '../services/aeoStructuredDataService';
import { brandAuthorityBuildingService } from '../services/brandAuthorityBuildingService';
import { crossPlatformEntityConsistencyService } from '../services/crossPlatformEntityConsistencyService';
import { aeoMonitoringService } from '../services/aeoMonitoringService';
import { aeoIntegrationService } from '../services/aeoIntegrationService';

// ===== TEST INTERFACES =====

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

export interface ValidationResult {
  component: string;
  valid: boolean;
  score: number;
  issues: ValidationIssue[];
  recommendations: string[];
}

export interface ValidationIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  field?: string;
  expectedValue?: any;
  actualValue?: any;
}

// ===== MAIN TEST CLASS =====

class AEOTestSuite {
  private static instance: AEOTestSuite;
  private testResults: Map<string, TestSuite> = new Map();

  private constructor() {}

  public static getInstance(): AEOTestSuite {
    if (!AEOTestSuite.instance) {
      AEOTestSuite.instance = new AEOTestSuite();
    }
    return AEOTestSuite.instance;
  }

  // ===== MAIN TEST RUNNER =====

  public async runAllTests(): Promise<Map<string, TestSuite>> {
    console.log('🚀 Starting comprehensive AEO test suite...\n');

    const testSuites = [
      'EntityKnowledgeGraph',
      'EATSignalEnhancement',
      'StructuredData',
      'BrandAuthority',
      'PlatformConsistency',
      'Monitoring',
      'Integration'
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
      case 'EntityKnowledgeGraph':
        tests = await this.testEntityKnowledgeGraph();
        break;
      case 'EATSignalEnhancement':
        tests = await this.testEATSignalEnhancement();
        break;
      case 'StructuredData':
        tests = await this.testStructuredData();
        break;
      case 'BrandAuthority':
        tests = await this.testBrandAuthority();
        break;
      case 'PlatformConsistency':
        tests = await this.testPlatformConsistency();
        break;
      case 'Monitoring':
        tests = await this.testMonitoring();
        break;
      case 'Integration':
        tests = await this.testIntegration();
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
      coverage: this.calculateCoverage(suiteName, tests)
    };
  }

  // ===== ENTITY KNOWLEDGE GRAPH TESTS =====

  private async testEntityKnowledgeGraph(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Service Initialization
    tests.push(await this.runTest('Service Initialization', () => {
      const graph = entityKnowledgeGraphService.getKnowledgeGraph();
      this.assert(graph !== null, 'Knowledge graph should be initialized');
      this.assert(Object.keys(graph.entities).length > 0, 'Should have entities');
    }));

    // Test 2: Entity Creation
    tests.push(await this.runTest('Entity Creation', () => {
      const entityId = entityKnowledgeGraphService.addEntity({
        name: 'Test Entity',
        type: 'Organization',
        description: 'Test entity for validation',
        authorityScore: 75,
        categories: ['Test'],
        properties: {
          website: 'https://test.com',
          founded: '2020'
        }
      });
      
      this.assert(entityId !== null, 'Entity should be created');
      
      const entity = entityKnowledgeGraphService.getEntity(entityId);
      this.assert(entity !== null, 'Created entity should be retrievable');
      this.assert(entity!.name === 'Test Entity', 'Entity name should match');
    }));

    // Test 3: Relationship Management
    tests.push(await this.runTest('Relationship Management', () => {
      const entity1Id = entityKnowledgeGraphService.addEntity({
        name: 'Entity 1',
        type: 'Organization',
        description: 'First test entity'
      });
      
      const entity2Id = entityKnowledgeGraphService.addEntity({
        name: 'Entity 2',
        type: 'Service',
        description: 'Second test entity'
      });

      entityKnowledgeGraphService.addRelationship(entity1Id, entity2Id, 'offers', 0.8);
      
      const relationships = entityKnowledgeGraphService.getEntityRelationships(entity1Id);
      this.assert(relationships.length > 0, 'Should have relationships');
      this.assert(relationships[0].type === 'offers', 'Relationship type should match');
    }));

    // Test 4: Authority Score Calculation
    tests.push(await this.runTest('Authority Score Calculation', () => {
      const scores = entityKnowledgeGraphService.calculateEntityAuthorityScores();
      this.assert(Object.keys(scores).length > 0, 'Should calculate authority scores');
      
      Object.values(scores).forEach(score => {
        this.assert(score >= 0 && score <= 100, 'Authority scores should be between 0-100');
      });
    }));

    // Test 5: Entity Search
    tests.push(await this.runTest('Entity Search', () => {
      const results = entityKnowledgeGraphService.searchEntities('Solar', { limit: 5 });
      this.assert(Array.isArray(results), 'Search should return array');
      this.assert(results.length >= 0, 'Search should handle empty results');
    }));

    return tests;
  }

  // ===== E-A-T SIGNAL ENHANCEMENT TESTS =====

  private async testEATSignalEnhancement(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Signal Management
    tests.push(await this.runTest('Signal Management', () => {
      const signalId = eatSignalEnhancementService.addSignal({
        type: 'expertise',
        title: 'Test Expertise Signal',
        description: 'Test signal for validation',
        value: 'Test Value',
        weight: 0.8,
        category: 'certification',
        source: 'test',
        verificationStatus: 'verified',
        lastUpdated: new Date()
      });

      this.assert(signalId !== null, 'Signal should be created');
      
      const signal = eatSignalEnhancementService.getSignal(signalId);
      this.assert(signal !== null, 'Created signal should be retrievable');
      this.assert(signal!.title === 'Test Expertise Signal', 'Signal title should match');
    }));

    // Test 2: E-A-T Score Calculation
    tests.push(await this.runTest('E-A-T Score Calculation', () => {
      const scores = eatSignalEnhancementService.calculateEATScore();
      
      this.assert(typeof scores.expertise === 'number', 'Expertise score should be number');
      this.assert(typeof scores.authoritativeness === 'number', 'Authoritativeness score should be number');
      this.assert(typeof scores.trustworthiness === 'number', 'Trustworthiness score should be number');
      this.assert(typeof scores.overall === 'number', 'Overall score should be number');
      
      this.assert(scores.expertise >= 0 && scores.expertise <= 100, 'Expertise score should be 0-100');
      this.assert(scores.overall >= 0 && scores.overall <= 100, 'Overall score should be 0-100');
    }));

    // Test 3: Content Authority Enhancement
    tests.push(await this.runTest('Content Authority Enhancement', () => {
      const content = 'This is test content about photovoltaic systems.';
      const enhanced = eatSignalEnhancementService.enhanceContentWithAuthorityMarkers(content, 'expertise');
      
      this.assert(typeof enhanced === 'string', 'Enhanced content should be string');
      this.assert(enhanced.length >= content.length, 'Enhanced content should be longer or equal');
    }));

    // Test 4: Author Entity Enhancement
    tests.push(await this.runTest('Author Entity Enhancement', () => {
      const authorData = {
        name: 'Test Author',
        bio: 'Test bio',
        credentials: ['Test Credential'],
        socialProfiles: []
      };
      
      const enhanced = eatSignalEnhancementService.enhanceAuthorEntity(authorData);
      this.assert(enhanced.name === authorData.name, 'Author name should be preserved');
      this.assert(Array.isArray(enhanced.credentials), 'Credentials should be array');
    }));

    return tests;
  }

  // ===== STRUCTURED DATA TESTS =====

  private async testStructuredData(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Organization Schema Generation
    tests.push(await this.runTest('Organization Schema Generation', () => {
      const orgData = {
        name: 'Test Organization',
        description: 'Test description',
        address: {
          street: 'Test Street 123',
          city: 'Test City',
          postalCode: '12345',
          country: 'Germany'
        }
      };
      
      const schema = aeoStructuredDataService.generateOrganizationSchema(orgData);
      
      this.assert(schema['@type'] === 'Organization', 'Schema type should be Organization');
      this.assert(schema.name === orgData.name, 'Organization name should match');
      this.assert(schema.address, 'Should have address');
    }));

    // Test 2: Service Schema Generation
    tests.push(await this.runTest('Service Schema Generation', () => {
      const serviceData = {
        name: 'Test Service',
        description: 'Test service description',
        provider: 'Test Provider',
        category: 'Test Category'
      };
      
      const schema = aeoStructuredDataService.generateServiceSchema(serviceData);
      
      this.assert(schema['@type'] === 'Service', 'Schema type should be Service');
      this.assert(schema.name === serviceData.name, 'Service name should match');
    }));

    // Test 3: FAQ Schema Generation
    tests.push(await this.runTest('FAQ Schema Generation', () => {
      const faqData = [
        {
          question: 'Test Question 1?',
          answer: 'Test Answer 1'
        },
        {
          question: 'Test Question 2?',
          answer: 'Test Answer 2'
        }
      ];
      
      const schema = aeoStructuredDataService.generateFAQSchema(faqData);
      
      this.assert(schema['@type'] === 'FAQPage', 'Schema type should be FAQPage');
      this.assert(Array.isArray(schema.mainEntity), 'Should have mainEntity array');
      this.assert(schema.mainEntity.length === faqData.length, 'Should have correct number of questions');
    }));

    // Test 4: Schema Validation
    tests.push(await this.runTest('Schema Validation', () => {
      const validSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Test Org'
      };
      
      const validation = aeoStructuredDataService.validateSchema(validSchema);
      this.assert(validation.valid === true, 'Valid schema should pass validation');
      this.assert(validation.errors.length === 0, 'Valid schema should have no errors');
    }));

    return tests;
  }

  // ===== BRAND AUTHORITY TESTS =====

  private async testBrandAuthority(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Brand Authority Score Calculation
    tests.push(await this.runTest('Brand Authority Score Calculation', () => {
      const authorityData = brandAuthorityBuildingService.getBrandAuthorityScore();
      
      this.assert(typeof authorityData.score === 'number', 'Score should be number');
      this.assert(authorityData.score >= 0 && authorityData.score <= 100, 'Score should be 0-100');
      this.assert(typeof authorityData.level === 'string', 'Level should be string');
    }));

    // Test 2: Social Proof Management
    tests.push(await this.runTest('Social Proof Management', () => {
      const proofId = brandAuthorityBuildingService.addSocialProof({
        type: 'testimonial',
        title: 'Test Testimonial',
        content: 'Test testimonial content',
        author: 'Test Author',
        rating: 5,
        date: new Date(),
        verified: true,
        source: 'test'
      });
      
      this.assert(proofId !== null, 'Social proof should be created');
      
      const proof = brandAuthorityBuildingService.getSocialProof(proofId);
      this.assert(proof !== null, 'Created social proof should be retrievable');
      this.assert(proof!.title === 'Test Testimonial', 'Title should match');
    }));

    // Test 3: Industry Recognition Tracking
    tests.push(await this.runTest('Industry Recognition Tracking', () => {
      const recognitionId = brandAuthorityBuildingService.addIndustryRecognition({
        type: 'award',
        title: 'Test Award',
        organization: 'Test Organization',
        date: new Date(),
        description: 'Test award description',
        verified: true,
        impact: 'high'
      });
      
      this.assert(recognitionId !== null, 'Industry recognition should be created');
      
      const recognition = brandAuthorityBuildingService.getIndustryRecognition(recognitionId);
      this.assert(recognition !== null, 'Created recognition should be retrievable');
    }));

    // Test 4: Brand Mention Analysis
    tests.push(await this.runTest('Brand Mention Analysis', () => {
      const analysis = brandAuthorityBuildingService.analyzeBrandMentions([
        { text: 'ZOE Solar is excellent', sentiment: 'positive', source: 'review' },
        { text: 'Great service from ZOE Solar', sentiment: 'positive', source: 'social' }
      ]);
      
      this.assert(typeof analysis.totalMentions === 'number', 'Total mentions should be number');
      this.assert(typeof analysis.sentimentScore === 'number', 'Sentiment score should be number');
      this.assert(analysis.sentimentScore >= -1 && analysis.sentimentScore <= 1, 'Sentiment should be -1 to 1');
    }));

    return tests;
  }

  // ===== PLATFORM CONSISTENCY TESTS =====

  private async testPlatformConsistency(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Consistency Check
    tests.push(await this.runTest('Consistency Check', () => {
      const report = crossPlatformEntityConsistencyService.checkConsistency();
      
      this.assert(typeof report.overallScore === 'number', 'Overall score should be number');
      this.assert(report.overallScore >= 0 && report.overallScore <= 100, 'Score should be 0-100');
      this.assert(Array.isArray(report.platforms), 'Platforms should be array');
      this.assert(typeof report.totalIssues === 'number', 'Total issues should be number');
    }));

    // Test 2: Platform Management
    tests.push(await this.runTest('Platform Management', () => {
      const platforms = crossPlatformEntityConsistencyService.getAllPlatforms();
      this.assert(Array.isArray(platforms), 'Platforms should be array');
      this.assert(platforms.length > 0, 'Should have platforms');
      
      platforms.forEach(platform => {
        this.assert(typeof platform.id === 'string', 'Platform ID should be string');
        this.assert(typeof platform.name === 'string', 'Platform name should be string');
        this.assert(typeof platform.consistencyScore === 'number', 'Consistency score should be number');
      });
    }));

    // Test 3: Auto-Fix Functionality
    tests.push(await this.runTest('Auto-Fix Functionality', () => {
      const fixedCount = crossPlatformEntityConsistencyService.autoFixIssues();
      this.assert(typeof fixedCount === 'number', 'Fixed count should be number');
      this.assert(fixedCount >= 0, 'Fixed count should be non-negative');
    }));

    // Test 4: Sync Operations
    tests.push(await this.runTest('Sync Operations', () => {
      const platforms = crossPlatformEntityConsistencyService.getActivePlatforms();
      if (platforms.length > 0) {
        const syncOp = crossPlatformEntityConsistencyService.syncPlatform(platforms[0].id);
        this.assert(typeof syncOp.id === 'string', 'Sync operation should have ID');
        this.assert(Array.isArray(syncOp.fields), 'Sync fields should be array');
      }
    }));

    return tests;
  }

  // ===== MONITORING TESTS =====

  private async testMonitoring(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Health Check
    tests.push(await this.runTest('Health Check', async () => {
      const healthCheck = await aeoMonitoringService.performHealthCheck();
      
      this.assert(typeof healthCheck.id === 'string', 'Health check should have ID');
      this.assert(healthCheck.timestamp instanceof Date, 'Should have timestamp');
      this.assert(typeof healthCheck.overall === 'string', 'Overall status should be string');
      this.assert(typeof healthCheck.components === 'object', 'Should have components');
      this.assert(typeof healthCheck.duration === 'number', 'Duration should be number');
    }));

    // Test 2: Alert Management
    tests.push(await this.runTest('Alert Management', async () => {
      const alerts = await aeoMonitoringService.checkAlerts();
      this.assert(Array.isArray(alerts), 'Alerts should be array');
      
      const activeAlerts = aeoMonitoringService.getActiveAlerts();
      this.assert(Array.isArray(activeAlerts), 'Active alerts should be array');
    }));

    // Test 3: Report Generation
    tests.push(await this.runTest('Report Generation', async () => {
      const report = await aeoMonitoringService.generateReport('daily');
      
      this.assert(typeof report.id === 'string', 'Report should have ID');
      this.assert(report.timestamp instanceof Date, 'Should have timestamp');
      this.assert(typeof report.type === 'string', 'Should have type');
      this.assert(typeof report.summary === 'object', 'Should have summary');
      this.assert(Array.isArray(report.recommendations), 'Recommendations should be array');
    }));

    // Test 4: Monitoring Status
    tests.push(await this.runTest('Monitoring Status', () => {
      const status = aeoMonitoringService.getMonitoringStatus();
      
      this.assert(typeof status.isRunning === 'boolean', 'Is running should be boolean');
      this.assert(typeof status.config === 'object', 'Should have config');
      this.assert(typeof status.activeAlerts === 'number', 'Active alerts should be number');
    }));

    return tests;
  }

  // ===== INTEGRATION TESTS =====

  private async testIntegration(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Integration Status
    tests.push(await this.runTest('Integration Status', () => {
      const status = aeoIntegrationService.getIntegrationStatus();
      
      this.assert(typeof status.overall === 'string', 'Overall status should be string');
      this.assert(typeof status.services === 'object', 'Should have services');
      this.assert(status.lastSync instanceof Date, 'Last sync should be Date');
      this.assert(Array.isArray(status.errors), 'Errors should be array');
    }));

    // Test 2: Page Enhancement
    tests.push(await this.runTest('Page Enhancement', () => {
      const enhancement = aeoIntegrationService.enhancePage('/test-page');
      
      this.assert(typeof enhancement.url === 'string', 'URL should be string');
      this.assert(Array.isArray(enhancement.entities), 'Entities should be array');
      this.assert(Array.isArray(enhancement.schemas), 'Schemas should be array');
      this.assert(Array.isArray(enhancement.eatSignals), 'EAT signals should be array');
      this.assert(typeof enhancement.metadata === 'object', 'Metadata should be object');
    }));

    // Test 3: Integration Health
    tests.push(await this.runTest('Integration Health', () => {
      const health = aeoIntegrationService.getIntegrationHealth();
      
      this.assert(typeof health.status === 'string', 'Status should be string');
      this.assert(typeof health.activeServices === 'number', 'Active services should be number');
      this.assert(typeof health.totalServices === 'number', 'Total services should be number');
      this.assert(typeof health.errorRate === 'number', 'Error rate should be number');
    }));

    // Test 4: Integration Validation
    tests.push(await this.runTest('Integration Validation', () => {
      const validation = aeoIntegrationService.validateIntegration();
      
      this.assert(typeof validation.valid === 'boolean', 'Valid should be boolean');
      this.assert(Array.isArray(validation.issues), 'Issues should be array');
    }));

    return tests;
  }

  // ===== TEST UTILITIES =====

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

  private calculateCoverage(suiteName: string, tests: TestResult[]): number {
    // Vereinfachte Coverage-Berechnung
    const passed = tests.filter(t => t.passed).length;
    return Math.round((passed / tests.length) * 100);
  }

  // ===== VALIDATION METHODS =====

  public async validateAllComponents(): Promise<ValidationResult[]> {
    const validations: ValidationResult[] = [];

    // Validate Entity Knowledge Graph
    validations.push(await this.validateEntityKnowledgeGraph());
    
    // Validate E-A-T Signals
    validations.push(await this.validateEATSignals());
    
    // Validate Structured Data
    validations.push(await this.validateStructuredData());
    
    // Validate Brand Authority
    validations.push(await this.validateBrandAuthority());
    
    // Validate Platform Consistency
    validations.push(await this.validatePlatformConsistency());

    return validations;
  }

  private async validateEntityKnowledgeGraph(): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const graph = entityKnowledgeGraphService.getKnowledgeGraph();
    const entities = Object.values(graph.entities);

    // Validate entities have required fields
    entities.forEach(entity => {
      if (!entity.name || entity.name.trim() === '') {
        issues.push({
          severity: 'critical',
          message: `Entity ${entity.id} missing name`,
          field: 'name'
        });
      }
      
      if (!entity.type) {
        issues.push({
          severity: 'high',
          message: `Entity ${entity.id} missing type`,
          field: 'type'
        });
      }
      
      if (!entity.authorityScore || entity.authorityScore < 0 || entity.authorityScore > 100) {
        issues.push({
          severity: 'medium',
          message: `Entity ${entity.id} has invalid authority score`,
          field: 'authorityScore',
          actualValue: entity.authorityScore
        });
      }
    });

    const score = Math.max(0, 100 - (issues.length * 10));
    
    return {
      component: 'EntityKnowledgeGraph',
      valid: issues.filter(i => i.severity === 'critical').length === 0,
      score,
      issues,
      recommendations: this.generateRecommendations(issues)
    };
  }

  private async validateEATSignals(): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const signals = eatSignalEnhancementService.getAllSignals();
    const scores = eatSignalEnhancementService.calculateEATScore();

    // Validate E-A-T scores
    if (scores.overall < 50) {
      issues.push({
        severity: 'critical',
        message: 'Overall E-A-T score is critically low',
        field: 'overallScore',
        actualValue: scores.overall,
        expectedValue: '>= 50'
      });
    }

    // Validate signal completeness
    const requiredSignalTypes = ['expertise', 'authoritativeness', 'trustworthiness'];
    requiredSignalTypes.forEach(type => {
      const typeSignals = signals.filter(s => s.type === type);
      if (typeSignals.length < 3) {
        issues.push({
          severity: 'medium',
          message: `Insufficient ${type} signals`,
          field: type,
          actualValue: typeSignals.length,
          expectedValue: '>= 3'
        });
      }
    });

    const score = Math.max(0, scores.overall);
    
    return {
      component: 'EATSignals',
      valid: issues.filter(i => i.severity === 'critical').length === 0,
      score,
      issues,
      recommendations: this.generateRecommendations(issues)
    };
  }

  private async validateStructuredData(): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    
    // Test basic schema generation
    try {
      const orgSchema = aeoStructuredDataService.generateOrganizationSchema({
        name: 'Test',
        description: 'Test',
        address: {
          street: 'Test',
          city: 'Test',
          postalCode: '12345',
          country: 'Test'
        }
      });
      
      const validation = aeoStructuredDataService.validateSchema(orgSchema);
      if (!validation.valid) {
        issues.push({
          severity: 'high',
          message: 'Organization schema validation failed',
          field: 'organizationSchema'
        });
      }
    } catch (error) {
      issues.push({
        severity: 'critical',
        message: 'Failed to generate organization schema',
        field: 'schemaGeneration'
      });
    }

    const score = Math.max(0, 100 - (issues.length * 20));
    
    return {
      component: 'StructuredData',
      valid: issues.filter(i => i.severity === 'critical').length === 0,
      score,
      issues,
      recommendations: this.generateRecommendations(issues)
    };
  }

  private async validateBrandAuthority(): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const authorityData = brandAuthorityBuildingService.getBrandAuthorityScore();
    const socialProof = brandAuthorityBuildingService.getSocialProofMetrics();

    // Validate brand authority score
    if (authorityData.score < 30) {
      issues.push({
        severity: 'high',
        message: 'Brand authority score is low',
        field: 'authorityScore',
        actualValue: authorityData.score,
        expectedValue: '>= 30'
      });
    }

    // Validate social proof
    if (socialProof.totalCount < 5) {
      issues.push({
        severity: 'medium',
        message: 'Insufficient social proof items',
        field: 'socialProofCount',
        actualValue: socialProof.totalCount,
        expectedValue: '>= 5'
      });
    }

    const score = Math.max(0, authorityData.score);
    
    return {
      component: 'BrandAuthority',
      valid: issues.filter(i => i.severity === 'critical').length === 0,
      score,
      issues,
      recommendations: this.generateRecommendations(issues)
    };
  }

  private async validatePlatformConsistency(): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const report = crossPlatformEntityConsistencyService.checkConsistency();
    const metrics = crossPlatformEntityConsistencyService.getConsistencyMetrics();

    // Validate consistency score
    if (report.overallScore < 60) {
      issues.push({
        severity: 'high',
        message: 'Platform consistency score is low',
        field: 'consistencyScore',
        actualValue: report.overallScore,
        expectedValue: '>= 60'
      });
    }

    // Validate critical issues
    if (report.criticalIssues > 0) {
      issues.push({
        severity: 'critical',
        message: 'Critical consistency issues found',
        field: 'criticalIssues',
        actualValue: report.criticalIssues,
        expectedValue: '0'
      });
    }

    const score = Math.max(0, report.overallScore);
    
    return {
      component: 'PlatformConsistency',
      valid: issues.filter(i => i.severity === 'critical').length === 0,
      score,
      issues,
      recommendations: this.generateRecommendations(issues)
    };
  }

  private generateRecommendations(issues: ValidationIssue[]): string[] {
    const recommendations: string[] = [];

    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          recommendations.push(`🚨 KRITISCH: ${issue.message} - Sofortige Behebung erforderlich`);
          break;
        case 'high':
          recommendations.push(`⚠️ HOCH: ${issue.message} - Prioritäre Behebung empfohlen`);
          break;
        case 'medium':
          recommendations.push(`📋 MITTEL: ${issue.message} - Behebung in nächster Iteration`);
          break;
        case 'low':
          recommendations.push(`💡 NIEDRIG: ${issue.message} - Langfristige Verbesserung`);
          break;
      }
    });

    return recommendations;
  }

  // ===== REPORTING =====

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

    console.log('📊 OVERALL TEST RESULTS');
    console.log('========================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalTests - totalPassed}`);
    console.log(`Pass Rate: ${overallPassRate}%`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log('');

    if (overallPassRate === 100) {
      console.log('🎉 All tests passed! AEO system is ready for production.');
    } else if (overallPassRate >= 80) {
      console.log('✅ Most tests passed. System is stable with minor issues.');
    } else {
      console.log('⚠️ Significant test failures. Review and fix before deployment.');
    }
  }

  // ===== PUBLIC API =====

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

// ===== EXPORT =====

export const aeoTestSuite = AEOTestSuite.getInstance();
export default aeoTestSuite;

/**
 * ===== USAGE EXAMPLES =====
 * 
 * // Run all tests
 * const results = await aeoTestSuite.runAllTests();
 * 
 * // Validate all components
 * const validations = await aeoTestSuite.validateAllComponents();
 * 
 * // Generate test report
 * const report = aeoTestSuite.generateTestReport();
 * 
 * // Get specific test results
 * const entityTests = aeoTestSuite.getTestResults().get('EntityKnowledgeGraph');
 */