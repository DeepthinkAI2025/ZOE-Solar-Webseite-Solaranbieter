/**
 * Serena Code Quality & Architecture Optimization Service
 * 
 * Bereich 1: Code-Qualität & Architektur-Optimierung
 * Nutzt kostenlose Tools für Refactoring und Code-Analyse
 */

export interface CodeQualityMetrics {
  complexity: number;
  maintainability: number;
  testCoverage: number;
  technicalDebt: number;
  codeSmells: CodeSmell[];
  architectureScore: number;
}

export interface CodeSmell {
  type: 'duplication' | 'complexity' | 'coupling' | 'cohesion' | 'dead_code';
  severity: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  line: number;
  description: string;
  suggestion: string;
  autoFixable: boolean;
}

export interface ArchitecturePattern {
  name: string;
  applicability: number;
  benefits: string[];
  implementation: string;
  examples: string[];
}

export interface RefactoringSuggestion {
  type: 'extract_method' | 'extract_class' | 'move_method' | 'inline_temp';
  priority: 'high' | 'medium' | 'low';
  effort: number; // story points
  impact: number; // quality improvement percentage
  description: string;
  code: string;
  autoFixable: boolean;
}

export interface SerenaOptimizationConfig {
  enabled: boolean;
  autoRefactoring: boolean;
  architecturePatterns: boolean;
  technicalDebtTracking: boolean;
  qualityGates: {
    maxComplexity: number;
    minTestCoverage: number;
    maxTechnicalDebt: number;
  };
}

interface QualityTrendSnapshot {
  date: string;
  metrics: CodeQualityMetrics;
}

class SerenaCodeQualityOptimizationService {
  private static instance: SerenaCodeQualityOptimizationService;
  private config: SerenaOptimizationConfig;
  private qualityHistory: Map<string, CodeQualityMetrics[]> = new Map();
  private codeSnapshots: Map<string, string> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): SerenaCodeQualityOptimizationService {
    if (!SerenaCodeQualityOptimizationService.instance) {
      SerenaCodeQualityOptimizationService.instance = new SerenaCodeQualityOptimizationService();
    }
    return SerenaCodeQualityOptimizationService.instance;
  }

  private getDefaultConfig(): SerenaOptimizationConfig {
    return {
      enabled: true,
      autoRefactoring: false, // Safe default
      architecturePatterns: true,
      technicalDebtTracking: true,
      qualityGates: {
        maxComplexity: 10, // Cyclomatic complexity
        minTestCoverage: 80,
        maxTechnicalDebt: 5 // Hours
      }
    };
  }

  // ===== CODE ANALYSIS & METRICS =====

  public async analyzeCodeQuality(filePath: string, code?: string): Promise<CodeQualityMetrics> {
    try {
      const codeContent = this.resolveCodeContent(filePath, code);
      const complexity = this.calculateComplexity(codeContent);
      const maintainability = this.calculateMaintainability(codeContent);
      const testCoverage = await this.getTestCoverage(filePath, codeContent);
      const technicalDebt = this.calculateTechnicalDebt(complexity, maintainability, codeContent);
      const codeSmells = this.detectCodeSmells(filePath, codeContent);
      const architectureScore = this.evaluateArchitecture(filePath, codeContent);

      const metrics: CodeQualityMetrics = {
        complexity,
        maintainability,
        testCoverage,
        technicalDebt,
        codeSmells,
        architectureScore
      };

      this.storeQualityHistory(filePath, metrics);
      return metrics;
    } catch (error) {
      console.error(`Code quality analysis failed for ${filePath}:`, error);
      throw error;
    }
  }

  public updateCodeSnapshot(filePath: string, code: string): void {
    this.codeSnapshots.set(filePath, code);
  }

  public getQualityTrends(filePath: string): QualityTrendSnapshot[] {
    const history = this.qualityHistory.get(filePath) ?? [];
    return history.map((metrics, index) => ({
      date: this.computeTrendDate(index - history.length + 1),
      metrics
    }));
  }

  public getArchitectureRecommendations(filePath: string, code?: string): ArchitecturePattern[] {
    const codeContent = this.resolveCodeContent(filePath, code);
    return this.suggestArchitecturePatterns(filePath, codeContent);
  }

  public async generateOptimizationReport(filePath: string, code?: string) {
    const metrics = await this.analyzeCodeQuality(filePath, code);
    const refactoring = await this.generateRefactoringSuggestions(filePath, code);
    const architecture = this.getArchitectureRecommendations(filePath, code);
    const gates = this.checkQualityGates(filePath);

    return {
      filePath,
      metrics,
      refactoring,
      architecture,
      qualityGates: gates,
      timestamp: new Date().toISOString()
    };
  }

  private resolveCodeContent(filePath: string, code?: string): string {
    if (code && code.trim().length > 0) {
      this.codeSnapshots.set(filePath, code);
      return code;
    }

    return this.codeSnapshots.get(filePath) || '';
  }

  private calculateComplexity(code: string): number {
    if (!code) {
      return 5;
    }

    const decisionRegex = /(if|for|while|case|catch|\?|&&|\|\||=>\s*\{|try|else\s+if)/g;
    const matches = code.match(decisionRegex) ?? [];
    const nestingDepth = this.estimateNestingDepth(code);
    const lambdaCount = (code.match(/=>/g) ?? []).length;

    const complexity = 1 + matches.length + nestingDepth + Math.floor(lambdaCount / 3);
    return Math.max(1, Math.min(50, complexity));
  }

  private calculateMaintainability(code: string): number {
    const complexity = this.calculateComplexity(code);
    const linesOfCode = this.estimateLinesOfCode(code);
    const duplicationPenalty = this.estimateDuplicationPenalty(code);

    let maintainability = 100;
    maintainability -= (complexity - 5) * 2;
    maintainability -= Math.max(0, (linesOfCode - 200) / 8);
    maintainability -= duplicationPenalty;

    return Math.max(0, Math.min(100, maintainability));
  }

  private async getTestCoverage(filePath: string, code: string): Promise<number> {
    if (!code) {
      return 70;
    }

    const hasTests = /(describe\(|it\(|test\(|expect\()/g.test(code);
    const isTestFile = filePath.includes('.test.') || filePath.includes('__tests__');

    if (isTestFile) {
      return 95;
    }

    const inferredCoverage = 60 + (hasTests ? 20 : 0) + Math.min(20, Math.max(0, 10 - this.calculateComplexity(code)));
    return Math.max(30, Math.min(100, inferredCoverage));
  }

  private calculateTechnicalDebt(complexity: number, maintainability: number, code: string): number {
    const lines = this.estimateLinesOfCode(code);
    const smellPenalty = this.detectCodeSmells('virtual', code).length * 0.5;

    let debt = (complexity - 5) * 0.4;
    debt += (100 - maintainability) * 0.08;
    debt += Math.max(0, (lines - 300) / 100);
    debt += smellPenalty;

    return Math.max(0, Number(debt.toFixed(2)));
  }

  private detectCodeSmells(filePath: string, code: string): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const complexity = this.calculateComplexity(code);
    const lines = code ? code.split(/\r?\n/) : [];
    
    if (complexity > 15) {
      smells.push({
        type: 'complexity',
        severity: 'high',
        file: filePath,
        line: 1,
        description: 'Cyclomatic complexity exceeds recommended threshold',
        suggestion: 'Extract methods and simplify conditional logic',
        autoFixable: false
      });
    }

    if (code && this.hasDuplicatedBlocks(code)) {
      smells.push({
        type: 'duplication',
        severity: 'medium',
        file: filePath,
        line: this.locateDuplicateBlock(code),
        description: 'Repeated code detected, consider extracting shared utilities',
        suggestion: 'Extract common logic into reusable helpers or hooks',
        autoFixable: true
      });
    }

    const longFunctions = this.detectLongFunctions(lines);
    longFunctions.forEach(fn => {
      smells.push({
        type: 'complexity',
        severity: fn.lines > 120 ? 'critical' : 'high',
        file: filePath,
        line: fn.line,
        description: `Function exceeds recommended length (${fn.lines} lines)`,
        suggestion: 'Split into smaller functions or components',
        autoFixable: false
      });
    });

    return smells;
  }

  private evaluateArchitecture(filePath: string, code: string): number {
    let score = 70;

    if (filePath.includes('service')) {
      score += 10;
    }

    if (filePath.includes('component')) {
      score += 5;
    }

    const complexity = this.calculateComplexity(code);
    if (complexity > 20) {
      score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  private estimateLinesOfCode(code: string): number {
    if (!code) {
      return 0;
    }

    return code.split(/\r?\n/).filter(line => line.trim().length > 0).length;
  }

  private storeQualityHistory(filePath: string, metrics: CodeQualityMetrics): void {
    if (!this.qualityHistory.has(filePath)) {
      this.qualityHistory.set(filePath, []);
    }
    
    const history = this.qualityHistory.get(filePath)!;
    history.push(metrics);
    
    if (history.length > 10) {
      history.shift();
    }
  }

  // ===== REFACTORING SUGGESTIONS =====

  public async generateRefactoringSuggestions(filePath: string, code?: string): Promise<RefactoringSuggestion[]> {
    const metrics = await this.analyzeCodeQuality(filePath, code);
    const suggestions: RefactoringSuggestion[] = [];

    if (metrics.complexity > 15) {
      suggestions.push({
        type: 'extract_method',
        priority: 'high',
        effort: 3,
        impact: 30,
        description: 'Extract complex conditional logic into separate methods',
        code: '// Extract method example',
        autoFixable: true
      });
    }

    if (metrics.maintainability < 60) {
      suggestions.push({
        type: 'extract_class',
        priority: 'high',
        effort: 5,
        impact: 40,
        description: 'Extract related functionality into separate classes',
        code: '// Extract class example',
        autoFixable: false
      });
    }

    return suggestions;
  }

  // ===== QUALITY GATES =====

  public checkQualityGates(filePath: string): { passed: boolean; violations: string[] } {
    const history = this.qualityHistory.get(filePath);
    if (!history || history.length === 0) {
      return { passed: false, violations: ['No quality metrics available'] };
    }

  const metrics = history[history.length - 1]!;
    const violations: string[] = [];

    if (metrics.complexity > this.config.qualityGates.maxComplexity) {
      violations.push(`Complexity ${metrics.complexity} exceeds limit ${this.config.qualityGates.maxComplexity}`);
    }

    if (metrics.testCoverage < this.config.qualityGates.minTestCoverage) {
      violations.push(`Test coverage ${metrics.testCoverage}% is below minimum ${this.config.qualityGates.minTestCoverage}%`);
    }

    if (metrics.technicalDebt > this.config.qualityGates.maxTechnicalDebt) {
      violations.push(`Technical debt ${metrics.technicalDebt}h exceeds limit ${this.config.qualityGates.maxTechnicalDebt}h`);
    }

    return {
      passed: violations.length === 0,
      violations
    };
  }

  // ===== PUBLIC API =====

  public updateConfig(config: Partial<SerenaOptimizationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): SerenaOptimizationConfig {
    return { ...this.config };
  }

  private estimateDuplicationPenalty(code: string): number {
    if (!code) {
      return 0;
    }

    const blocks = code.split(/\r?\n\s*\r?\n/).map(block => block.trim()).filter(Boolean);
    const seen = new Map<string, number>();

    blocks.forEach(block => {
      const normalized = block.replace(/\s+/g, ' ');
      if (normalized.length > 60) {
        seen.set(normalized, (seen.get(normalized) || 0) + 1);
      }
    });

    let penalty = 0;
    seen.forEach(count => {
      if (count > 1) {
        penalty += (count - 1) * 2;
      }
    });

    return Math.min(20, penalty);
  }

  private hasDuplicatedBlocks(code: string): boolean {
    return this.estimateDuplicationPenalty(code) > 0;
  }

  private locateDuplicateBlock(code: string): number {
    const lines = code.split(/\r?\n/);
    const snippets = new Map<string, number[]>();

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.length > 40) {
        const key = trimmed.replace(/\s+/g, ' ');
        const positions = snippets.get(key) || [];
        positions.push(index + 1);
        snippets.set(key, positions);
      }
    });

    for (const [, positions] of snippets.entries()) {
      if (positions.length > 1) {
        return positions[0] ?? 1;
      }
    }

    return 1;
  }

  private detectLongFunctions(lines: string[]): Array<{ line: number; lines: number }> {
    const longFunctions: Array<{ line: number; lines: number }> = [];
    if (!lines || lines.length === 0) {
      return longFunctions;
    }

    let currentLength = 0;
    let startLine = 0;
    let depth = 0;

    lines.forEach((line, index) => {
      if (/function|=>|class/.test(line) && depth === 0) {
        currentLength = 1;
        startLine = index + 1;
      } else if (currentLength > 0) {
        currentLength++;
      }

      depth += (line.match(/\{/g)?.length || 0) - (line.match(/\}/g)?.length || 0);

      if (currentLength > 0 && depth === 0 && currentLength > 80) {
        longFunctions.push({ line: startLine, lines: currentLength });
        currentLength = 0;
      }
    });

    return longFunctions;
  }

  private estimateNestingDepth(code: string): number {
    let depth = 0;
    let maxDepth = 0;

    for (const char of code) {
      if (char === '{') {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else if (char === '}') {
        depth = Math.max(0, depth - 1);
      }
    }

    return maxDepth;
  }

  private computeTrendDate(offset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const [isoDate] = date.toISOString().split('T');
    return isoDate ?? date.toISOString();
  }

  private suggestArchitecturePatterns(filePath: string, code: string): ArchitecturePattern[] {
    const patterns: ArchitecturePattern[] = [];
    const isService = filePath.includes('service');
    const usesEvents = /emit|dispatch|addEventListener/.test(code);
    const usesFactories = /factory|create[A-Z]/.test(code);
    const usesRepositories = /Repository|DataSource/.test(code);

    if (isService) {
      patterns.push({
        name: 'Service Layer',
        applicability: 0.9,
        benefits: ['Clear separation of concerns', 'Easier testing', 'Single entry point for business logic'],
        implementation: 'Wrap related business rules into cohesive service classes and expose typed methods.',
        examples: ['services/aiPlatformMonitoringService.ts', 'services/serenaMCPOptimizationService.ts']
      });
    }

    if (usesRepositories) {
      patterns.push({
        name: 'Repository Pattern',
        applicability: 0.75,
        benefits: ['Abstracts data access', 'Improves testability', 'Supports multiple data sources'],
        implementation: 'Create repository interfaces and concrete adapters for each data provider.',
        examples: ['src/services/api/OptimizedAPIClient.ts']
      });
    }

    if (usesFactories) {
      patterns.push({
        name: 'Factory Pattern',
        applicability: 0.65,
        benefits: ['Configurable object creation', 'Centralized dependency wiring'],
        implementation: 'Provide factory functions that encapsulate complex initialization logic.',
        examples: ['src/services/aiIntegrationService.ts']
      });
    }

    if (usesEvents) {
      patterns.push({
        name: 'Observer Pattern',
        applicability: 0.6,
        benefits: ['Loose coupling between publishers and subscribers', 'Reactive architecture'],
        implementation: 'Publish domain events and allow listeners to react asynchronously.',
        examples: ['src/services/aiMonitoringAnalyticsService.ts']
      });
    }

    return patterns.length ? patterns : [{
      name: 'Modular Monolith',
      applicability: 0.5,
      benefits: ['Predictable deployments', 'Simplified interactions'],
      implementation: 'Group related features into modules with clear boundaries.',
      examples: ['src/modules/*']
    }];
  }
}

export const serenaCodeQualityOptimizationService = SerenaCodeQualityOptimizationService.getInstance();
export default serenaCodeQualityOptimizationService;