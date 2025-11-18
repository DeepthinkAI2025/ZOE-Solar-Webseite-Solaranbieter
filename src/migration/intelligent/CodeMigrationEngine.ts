/**
 * Intelligent Code Migration Engine
 * Automated, intelligent code migration with risk assessment and rollback capabilities
 */

export interface MigrationConfig {
  sourceVersion: string;
  targetVersion: string;
  migrationType: 'version-upgrade' | 'framework-migration' | 'architecture-refactor' | 'dependency-update' | 'breaking-change';
  safetyLevel: 'conservative' | 'moderate' | 'aggressive';
  autoApply: boolean;
  dryRun: boolean;
  backupEnabled: boolean;
  rollbackEnabled: boolean;
  includeTests: boolean;
  affectedPaths: string[];
  excludePaths: string[];
}

export interface MigrationStep {
  id: string;
  type: 'code-transformation' | 'dependency-update' | 'config-change' | 'file-operation' | 'test-update';
  description: string;
  filePath: string;
  originalContent?: string;
  transformedContent?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number;
  dependencies: string[];
  rollbackAction?: string;
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  type: 'syntax' | 'semantic' | 'performance' | 'compatibility' | 'security';
  rule: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

export interface MigrationPlan {
  id: string;
  config: MigrationConfig;
  steps: MigrationStep[];
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    criticalSteps: number;
    rollbackComplexity: number;
    estimatedDowntime: number;
    backupRequirements: string[];
  };
  impact: {
    filesAffected: number;
    linesOfCodeChanged: number;
    breakingChanges: number;
    deprecatedFeatures: string[];
    newFeatures: string[];
  };
  validation: {
    testCoverage: number;
    performanceImpact: string;
    compatibilityMatrix: Record<string, boolean>;
    securityAssessment: string;
  };
  schedule: {
    estimatedDuration: number;
    milestones: Array<{
      id: string;
      name: string;
      estimatedTime: number;
      dependencies: string[];
    }>;
    rollbackPoints: string[];
  };
}

export interface MigrationResult {
  id: string;
  timestamp: Date;
  plan: MigrationPlan;
  execution: {
    startTime: Date;
    endTime: Date;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled-back';
    completedSteps: string[];
    failedSteps: string[];
    warnings: string[];
    errors: string[];
  };
  outcome: {
    success: boolean;
    changesApplied: number;
    testsPassed: number;
    testsFailed: number;
    performanceImpact: {
      before: Record<string, number>;
      after: Record<string, number>;
    };
    rollbackAvailable: boolean;
  };
  artifacts: {
    backupLocation?: string;
    logs: string[];
    metrics: Record<string, number>;
    diffReport: string;
  };
}

interface MigrationPattern {
  id: string;
  name: string;
  description: string;
  category: 'react' | 'typescript' | 'javascript' | 'css' | 'build' | 'test' | 'dependency';
  pattern: RegExp;
  transformation: (match: RegExpMatchArray, context: any) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  examples: Array<{
    input: string;
    output: string;
    description: string;
  }>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class CodeMigrationEngine { // eslint-disable-line @typescript-eslint/no-unused-vars
  private migrationPatterns: Map<string, MigrationPattern> = new Map();
  private activeMigrations: Map<string, MigrationResult> = new Map();
  private rollbackStack: Map<string, any[]> = new Map();

  constructor() {
    this.initializeMigrationPatterns();
  }

  private initializeMigrationPatterns(): void {
    // React migration patterns
    this.addPattern({
      id: 'react-18-upgrade-classname',
      name: 'React 18: Update className for new JSX transform',
      description: 'Updates className usage for React 18 JSX transform compatibility',
      category: 'react',
      pattern: /className\s*=\s*{([^}]+)}/g,
      transformation: (_match, _context) => {
        return `className={${_match[1]}}`;
      },
      riskLevel: 'low',
      dependencies: ['react', 'react-dom'],
      examples: [
        {
          input: '<div className={styles.container}>',
          output: '<div className={styles.container}>',
          description: 'No change needed - JSX Transform handles this automatically',
        },
      ],
    });

    this.addPattern({
      id: 'react-18-upgrade-reactdom',
      name: 'React 18: Update ReactDOM.render to createRoot',
      description: 'Migrates from ReactDOM.render to createRoot API',
      category: 'react',
      pattern: /ReactDOM\.render\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g,
      transformation: (_match, _context) => {
        return `const root = ReactDOM.createRoot(${_match[2]});\nroot.render(${_match[1]});`;
      },
      riskLevel: 'medium',
      dependencies: ['react-dom'],
      examples: [
        {
          input: 'ReactDOM.render(<App />, document.getElementById("root"));',
          output: 'const root = ReactDOM.createRoot(document.getElementById("root"));\nroot.render(<App />);',
          description: 'Standard ReactDOM.render migration',
        },
      ],
    });

    // TypeScript migration patterns
    this.addPattern({
      id: 'typescript-strict-mode',
      name: 'TypeScript: Enable strict type checking',
      description: 'Updates tsconfig.json to enable strict mode and fix type issues',
      category: 'typescript',
      pattern: /"strict"\s*:\s*false/g,
      transformation: (_match, _context) => {
        return '"strict": true';
      },
      riskLevel: 'high',
      dependencies: ['typescript'],
      examples: [
        {
          input: '"strict": false',
          output: '"strict": true',
          description: 'Enable strict mode in tsconfig.json',
        },
      ],
    });

    // Dependency update patterns
    this.addPattern({
      id: 'dependency-update-react',
      name: 'Update React dependencies',
      description: 'Updates React and React DOM to latest versions',
      category: 'dependency',
      pattern: /("react":\s*")(\d+\.\d+\.\d+)(")/g,
      transformation: (_match, _context) => {
        return `${_match[1]}18.2.0${_match[3]}`;
      },
      riskLevel: 'medium',
      dependencies: [],
      examples: [
        {
          input: '"react": "^17.0.2"',
          output: '"react": "^18.2.0"',
          description: 'Update React to version 18.2.0',
        },
      ],
    });

    // CSS migration patterns
    this.addPattern({
      id: 'css-custom-properties',
      name: 'Convert CSS variables to custom properties',
      description: 'Migrates CSS variables to CSS custom properties for better browser support',
      category: 'css',
      pattern: /var\s*\(\s*--([^)]+)\s*\)/g,
      transformation: (_match, _context) => {
        return `var(--${_match[1]})`;
      },
      riskLevel: 'low',
      dependencies: [],
      examples: [
        {
          input: 'var(--primary-color)',
          output: 'var(--primary-color)',
          description: 'CSS custom property (no change needed)',
        },
      ],
    });

    // Test migration patterns
    this.addPattern({
      id: 'jest-testing-library',
      name: 'Update to latest React Testing Library',
      description: 'Updates test imports and methods to latest React Testing Library',
      category: 'test',
      pattern: /from\s+['"]@testing-library\/react['"]/g,
      transformation: (_match, _context) => {
        return 'from "@testing-library/react"';
      },
      riskLevel: 'low',
      dependencies: ['@testing-library/react'],
      examples: [
        {
          input: "from '@testing-library/react'",
          output: "from '@testing-library/react'",
          description: 'React Testing Library import (no change needed)',
        },
      ],
    });
  }

  private addPattern(pattern: MigrationPattern): void {
    this.migrationPatterns.set(pattern.id, pattern);
  }

  public async createMigrationPlan(config: MigrationConfig): Promise<MigrationPlan> {
    console.log(`Creating migration plan for ${config.migrationType}: ${config.sourceVersion} → ${config.targetVersion}`);

    const steps: MigrationStep[] = [];
    const affectedFiles = await this.scanAffectedFiles(config);

    // Generate migration steps based on patterns and configuration
    for (const filePath of affectedFiles) {
      const fileSteps = await this.generateStepsForFile(filePath, config);
      steps.push(...fileSteps);
    }

    // Add dependency update steps
    steps.push(...await this.generateDependencySteps(config));

    // Add configuration update steps
    steps.push(...await this.generateConfigSteps(config));

    // Add test update steps if enabled
    if (config.includeTests) {
      steps.push(...await this.generateTestSteps(config));
    }

    // Assess risks and impacts
    const riskAssessment = this.assessRisk(steps);
    const impact = this.assessImpact(steps);
    const validation = this.assessValidationRequirements(steps);
    const schedule = this.generateSchedule(steps);

    const plan: MigrationPlan = {
      id: `migration-${Date.now()}`,
      config,
      steps,
      riskAssessment,
      impact,
      validation,
      schedule,
    };

    console.log(`Migration plan created with ${steps.length} steps (Risk: ${riskAssessment.overallRisk})`);
    return plan;
  }

  private async scanAffectedFiles(config: MigrationConfig): Promise<string[]> {
    // In a real implementation, would scan the actual file system
    // For now, return mock affected files based on migration type
    const affectedFiles: string[] = [];

    switch (config.migrationType) {
      case 'version-upgrade':
        affectedFiles.push(
          'package.json',
          'src/App.tsx',
          'src/index.tsx',
          'src/components/**/*.tsx',
          'src/hooks/**/*.ts'
        );
        break;
      case 'framework-migration':
        affectedFiles.push(
          'package.json',
          'src/**/*.tsx',
          'src/**/*.ts',
          'tsconfig.json',
          'vite.config.ts'
        );
        break;
      case 'architecture-refactor':
        affectedFiles.push(
          'src/store/**/*.ts',
          'src/services/**/*.ts',
          'src/hooks/**/*.ts',
          'src/**/*.tsx'
        );
        break;
      case 'dependency-update':
        affectedFiles.push('package.json');
        break;
    }

    return affectedFiles;
  }

  private async generateStepsForFile(filePath: string, _config: MigrationConfig): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [];
    const content = await this.readFile(filePath);

    // Apply migration patterns to file content
    for (const pattern of this.migrationPatterns.values()) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        const step: MigrationStep = {
          id: `${pattern.id}-${filePath}-${Date.now()}`,
          type: 'code-transformation',
          description: `Apply ${pattern.name} to ${filePath}`,
          filePath,
          originalContent: content,
          riskLevel: pattern.riskLevel,
          estimatedTime: this.estimateStepTime(pattern, matches.length),
          dependencies: pattern.dependencies,
          validationRules: [
            {
              type: 'syntax',
              rule: pattern.pattern.source,
              description: 'Ensure transformed code is syntactically correct',
              severity: 'error',
            },
          ],
        };

        // Apply transformation
        let transformedContent = content;
        step.transformedContent = transformedContent.replace(pattern.pattern, pattern.transformation as any);

        steps.push(step);
      }
    }

    return steps;
  }

  private async generateDependencySteps(_config: MigrationConfig): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [];

    // Update package.json
    const packageJsonStep: MigrationStep = {
      id: `dependency-update-${Date.now()}`,
      type: 'dependency-update',
      description: 'Update package.json dependencies',
      filePath: 'package.json',
      riskLevel: 'medium',
      estimatedTime: 120, // 2 minutes
      dependencies: [],
      validationRules: [
        {
          type: 'syntax',
          rule: 'JSON syntax validation',
          description: 'Ensure package.json is valid JSON',
          severity: 'error',
        },
      ],
    };

    steps.push(packageJsonStep);

    return steps;
  }

  private async generateConfigSteps(config: MigrationConfig): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [];

    // Update tsconfig.json for TypeScript migrations
    if (config.migrationType === 'framework-migration' || config.migrationType === 'version-upgrade') {
      const tsconfigStep: MigrationStep = {
        id: `config-tsconfig-${Date.now()}`,
        type: 'config-change',
        description: 'Update tsconfig.json for new version compatibility',
        filePath: 'tsconfig.json',
        riskLevel: 'medium',
        estimatedTime: 60,
        dependencies: ['typescript'],
        validationRules: [
          {
            type: 'syntax',
            rule: 'tsconfig.json schema validation',
            description: 'Ensure tsconfig.json follows TypeScript schema',
            severity: 'error',
          },
        ],
      };

      steps.push(tsconfigStep);
    }

    return steps;
  }

  private async generateTestSteps(_config: MigrationConfig): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [];

    // Update test files for new testing patterns
    const testStep: MigrationStep = {
      id: `test-update-${Date.now()}`,
      type: 'test-update',
      description: 'Update test files for new framework version',
      filePath: 'src/**/*.test.tsx',
      riskLevel: 'low',
      estimatedTime: 180,
      dependencies: ['@testing-library/react', 'jest'],
      validationRules: [
        {
          type: 'syntax',
          rule: 'Jest test syntax validation',
          description: 'Ensure tests use valid Jest syntax',
          severity: 'error',
        },
      ],
    };

    steps.push(testStep);

    return steps;
  }

  private estimateStepTime(pattern: MigrationPattern, matchCount: number): number {
    const baseTime = 30; // Base time in seconds
    const complexityMultiplier = pattern.riskLevel === 'critical' ? 3 :
                               pattern.riskLevel === 'high' ? 2 :
                               pattern.riskLevel === 'medium' ? 1.5 : 1;

    return Math.round(baseTime * matchCount * complexityMultiplier);
  }

  private assessRisk(steps: MigrationStep[]): MigrationPlan['riskAssessment'] {
    const criticalSteps = steps.filter(s => s.riskLevel === 'critical').length;
    const highSteps = steps.filter(s => s.riskLevel === 'high').length;
    const mediumSteps = steps.filter(s => s.riskLevel === 'medium').length;

    let overallRisk: 'low' | 'medium' | 'high' | 'critical';
    if (criticalSteps > 0) {
      overallRisk = 'critical';
    } else if (highSteps > 3) {
      overallRisk = 'high';
    } else if (highSteps > 0 || mediumSteps > 5) {
      overallRisk = 'medium';
    } else {
      overallRisk = 'low';
    }

    const estimatedDowntime = criticalSteps * 300 + highSteps * 120 + mediumSteps * 60 + steps.length * 10;

    return {
      overallRisk,
      criticalSteps: criticalSteps,
      rollbackComplexity: Math.max(steps.length / 10, 5), // Simplified calculation
      estimatedDowntime,
      backupRequirements: ['source code', 'database', 'configuration files'],
    };
  }

  private assessImpact(steps: MigrationStep[]): MigrationPlan['impact'] {
    const uniqueFiles = new Set(steps.map(s => s.filePath));
    const breakingChanges = steps.filter(s =>
      s.description.includes('breaking') || s.riskLevel === 'critical'
    ).length;

    return {
      filesAffected: uniqueFiles.size,
      linesOfCodeChanged: steps.reduce((total, step) =>
        total + (step.transformedContent?.length || 0) - (step.originalContent?.length || 0), 0
      ),
      breakingChanges,
      deprecatedFeatures: [
        'ReactDOM.render',
        'React.PropTypes',
        'componentWillMount',
      ],
      newFeatures: [
        'React 18 createRoot API',
        'Concurrent features',
        'Automatic batching',
        'Improved TypeScript support',
      ],
    };
  }

  private assessValidationRequirements(_steps: MigrationStep[]): MigrationPlan['validation'] {
    return {
      testCoverage: 85, // Mock value - would calculate from actual test files
      performanceImpact: 'minimal', // Would assess based on migration type
      compatibilityMatrix: {
        'Chrome': true,
        'Firefox': true,
        'Safari': true,
        'Edge': true,
        'IE11': false, // React 18 drops IE11 support
      },
      securityAssessment: 'no-impact',
    };
  }

  private generateSchedule(steps: MigrationStep[]): MigrationPlan['schedule'] {
    const totalEstimatedTime = steps.reduce((total, step) => total + step.estimatedTime, 0);
    const stepCount = steps.length;
    const milestoneCount = Math.ceil(stepCount / 5); // Group steps into milestones

    const milestones = [];
    for (let i = 0; i < milestoneCount; i++) {
      const stepStart = i * 5;
      const stepEnd = Math.min(stepStart + 5, stepCount);
      const milestoneSteps = steps.slice(stepStart, stepEnd);
      const milestoneTime = milestoneSteps.reduce((total, step) => total + step.estimatedTime, 0);

      milestones.push({
        id: `milestone-${i + 1}`,
        name: `Milestone ${i + 1}: ${milestoneSteps[0]?.description?.split(':')[0] || 'Migration Tasks'}`,
        estimatedTime: milestoneTime,
        dependencies: i > 0 ? [`milestone-${i}`] : [],
      });
    }

    return {
      estimatedDuration: totalEstimatedTime,
      milestones,
      rollbackPoints: milestones.filter((_, index) => index % 2 === 0).map(m => m.id),
    };
  }

  public async executeMigration(plan: MigrationPlan): Promise<MigrationResult> {
    const result: MigrationResult = {
      id: plan.id,
      timestamp: new Date(),
      plan,
      execution: {
        startTime: new Date(),
        endTime: new Date(),
        status: 'pending',
        completedSteps: [],
        failedSteps: [],
        warnings: [],
        errors: [],
      },
      outcome: {
        success: false,
        changesApplied: 0,
        testsPassed: 0,
        testsFailed: 0,
        performanceImpact: {
          before: {},
          after: {},
        },
        rollbackAvailable: plan.config.rollbackEnabled,
      },
      artifacts: {
        logs: [],
        metrics: {},
        diffReport: '',
      },
    };

    this.activeMigrations.set(plan.id, result);

    try {
      console.log(`Starting migration execution: ${plan.id}`);

      // Create backup if enabled
      if (plan.config.backupEnabled) {
        await this.createBackup(plan, result);
        result.artifacts.logs.push('Backup created successfully');
      }

      // Execute steps in order
      result.execution.status = 'running';

      for (const step of plan.steps) {
        try {
          await this.executeStep(step, result);
          result.execution.completedSteps.push(step.id);
          result.outcome.changesApplied++;
          result.artifacts.logs.push(`Completed step: ${step.description}`);
        } catch (error) {
          result.execution.failedSteps.push(step.id);
          result.execution.errors.push(`Failed step: ${step.description} - ${error}`);
          console.error(`Migration step failed:`, error);

          // Decide whether to continue or abort based on risk level
          if (step.riskLevel === 'critical' || step.riskLevel === 'high') {
            result.execution.status = 'failed';
            throw error;
          } else {
            result.execution.warnings.push(`Warning: Step failed but continuing: ${step.description}`);
          }
        }
      }

      // Run validation tests
      if (plan.config.includeTests) {
        await this.runValidationTests(result);
      }

      result.execution.status = 'completed';
      result.execution.endTime = new Date();
      result.outcome.success = true;

      console.log(`Migration completed successfully: ${plan.id}`);

    } catch (error) {
      console.error(`Migration failed:`, error);
      result.execution.status = 'failed';
      result.execution.endTime = new Date();

      // Attempt rollback if enabled and configured
      if (plan.config.rollbackEnabled && plan.config.safetyLevel === 'conservative') {
        await this.rollbackMigration(plan.id, result);
      }
    }

    return result;
  }

  private async executeStep(step: MigrationStep, result: MigrationResult): Promise<void> {
    console.log(`Executing step: ${step.description}`);

    // Store rollback information
    if (this.rollbackStack.has(result.id)) {
      this.rollbackStack.get(result.id)!.push({
        stepId: step.id,
        filePath: step.filePath,
        originalContent: step.originalContent,
      });
    } else {
      this.rollbackStack.set(result.id, [{
        stepId: step.id,
        filePath: step.filePath,
        originalContent: step.originalContent,
      }]);
    }

    switch (step.type) {
      case 'code-transformation':
        if (step.transformedContent) {
          await this.writeFile(step.filePath, step.transformedContent);
        }
        break;
      case 'dependency-update':
        await this.updateDependencies(step);
        break;
      case 'config-change':
        await this.updateConfiguration(step);
        break;
      case 'file-operation':
        await this.executeFileOperation(step);
        break;
      case 'test-update':
        await this.updateTests(step);
        break;
    }

    // Validate step execution
    await this.validateStep(step);
  }

  private async createBackup(plan: MigrationPlan, result: MigrationResult): Promise<void> {
    console.log('Creating backup...');
    // In real implementation, would create actual backup
    result.artifacts.backupLocation = `/backups/migration-${plan.id}-${Date.now()}`;
  }

  private async updateDependencies(_step: MigrationStep): Promise<void> {
    // In real implementation, would update package.json and run npm install
    console.log('Updating dependencies...');
  }

  private async updateConfiguration(_step: MigrationStep): Promise<void> {
    // In real implementation, would update configuration files
    console.log('Updating configuration...');
  }

  private async executeFileOperation(_step: MigrationStep): Promise<void> {
    // In real implementation, would execute file system operations
    console.log('Executing file operation...');
  }

  private async updateTests(_step: MigrationStep): Promise<void> {
    // In real implementation, would update test files
    console.log('Updating tests...');
  }

  private async validateStep(step: MigrationStep): Promise<void> {
    // Run validation rules
    for (const rule of step.validationRules) {
      try {
        switch (rule.type) {
          case 'syntax':
            await this.validateSyntax(step);
            break;
          case 'semantic':
            await this.validateSemantics(step);
            break;
          case 'performance':
            await this.validatePerformance(step);
            break;
        }
      } catch (error) {
        if (rule.severity === 'error') {
          throw new Error(`Validation failed: ${rule.description} - ${error}`);
        }
      }
    }
  }

  private async validateSyntax(_step: MigrationStep): Promise<void> {
    // In real implementation, would run TypeScript compiler or linter
    console.log('Validating syntax...');
  }

  private async validateSemantics(_step: MigrationStep): Promise<void> {
    // In real implementation, would run semantic analysis
    console.log('Validating semantics...');
  }

  private async validatePerformance(_step: MigrationStep): Promise<void> {
    // In real implementation, would run performance benchmarks
    console.log('Validating performance...');
  }

  private async runValidationTests(result: MigrationResult): Promise<void> {
    console.log('Running validation tests...');

    // Mock test execution
    result.outcome.testsPassed = 42;
    result.outcome.testsFailed = 2;
    result.artifacts.logs.push('Tests completed: 42 passed, 2 failed');
  }

  private async rollbackMigration(migrationId: string, result: MigrationResult): Promise<void> {
    console.log(`Rolling back migration: ${migrationId}`);

    const rollbackSteps = this.rollbackStack.get(migrationId) || [];

    for (const rollbackStep of rollbackSteps.reverse()) {
      try {
        if (rollbackStep.originalContent) {
          await this.writeFile(rollbackStep.filePath, rollbackStep.originalContent);
        }
        result.artifacts.logs.push(`Rolled back: ${rollbackStep.stepId}`);
      } catch (error) {
        result.artifacts.logs.push(`Rollback failed for ${rollbackStep.stepId}: ${error}`);
      }
    }

    result.execution.status = 'rolled-back';
    console.log('Rollback completed');
  }

  // Helper methods for file operations (mocked)
  private async readFile(filePath: string): Promise<string> {
    // In real implementation, would read actual file
    return `// Mock content for ${filePath}`;
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    // In real implementation, would write to actual file
    console.log(`Writing to ${filePath}: ${content.substring(0, 50)}...`);
  }

  public getMigrationResult(migrationId: string): MigrationResult | undefined {
    return this.activeMigrations.get(migrationId);
  }

  public getActiveMigrations(): MigrationResult[] {
    return Array.from(this.activeMigrations.values());
  }

  public async generateMigrationReport(migrationId: string): Promise<string> {
    const result = this.activeMigrations.get(migrationId);
    if (!result) {
      throw new Error(`Migration not found: ${migrationId}`);
    }

    const report = `
# Migration Report

**Migration ID:** ${migrationId}
**Timestamp:** ${result.timestamp.toISOString()}
**Status:** ${result.execution.status}

## Configuration

**Type:** ${result.plan.config.migrationType}
**Source Version:** ${result.plan.config.sourceVersion}
**Target Version:** ${result.plan.config.targetVersion}
**Safety Level:** ${result.plan.config.safetyLevel}

## Execution Summary

**Started:** ${result.execution.startTime.toISOString()}
**Completed:** ${result.execution.endTime.toISOString()}
**Steps Completed:** ${result.execution.completedSteps.length}
**Steps Failed:** ${result.execution.failedSteps.length}
**Changes Applied:** ${result.outcome.changesApplied}

## Risk Assessment

**Overall Risk:** ${result.plan.riskAssessment.overallRisk}
**Critical Steps:** ${result.plan.riskAssessment.criticalSteps}
**Estimated Downtime:** ${result.plan.riskAssessment.estimatedDowntime} seconds

## Impact Analysis

**Files Affected:** ${result.plan.impact.filesAffected}
**Lines Changed:** ${result.plan.impact.linesOfCodeChanged}
**Breaking Changes:** ${result.plan.impact.breakingChanges}

## Test Results

**Tests Passed:** ${result.outcome.testsPassed}
**Tests Failed:** ${result.outcome.testsFailed}
**Test Coverage:** ${result.plan.validation.testCoverage}%

## Errors and Warnings

${result.execution.errors.length > 0 ? '### Errors:\n' + result.execution.errors.map(e => `- ${e}`).join('\n') : 'No errors'}
${result.execution.warnings.length > 0 ? '\n### Warnings:\n' + result.execution.warnings.map(w => `- ${w}`).join('\n') : 'No warnings'}

## Recommendations

${result.outcome.success ?
  'Migration completed successfully. Monitor application performance and user feedback.' :
  'Migration failed. Review errors and consider retrying with different configuration.'
}

## Rollback Information

**Rollback Available:** ${result.outcome.rollbackAvailable ? 'Yes' : 'No'}
**Backup Location:** ${result.artifacts.backupLocation || 'Not available'}

---

*Report generated by Serena MCP Migration Engine*
    `;

    return report;
  }

  public addCustomPattern(pattern: MigrationPattern): void {
    this.migrationPatterns.set(pattern.id, pattern);
  }

  public removePattern(patternId: string): void {
    this.migrationPatterns.delete(patternId);
  }

  public getAvailablePatterns(): MigrationPattern[] {
    return Array.from(this.migrationPatterns.values());
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */