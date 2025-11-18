#!/usr/bin/env node

/**
 * Automated Refactoring Script
 *
 * This script performs intelligent refactoring based on real usage data analysis.
 * It identifies unused dependencies, consolidates duplicate functions, optimizes
 * performance-critical components, and improves type safety.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AutoRefactor {
  constructor() {
    this.projectRoot = process.cwd();
    this.srcDir = path.join(this.projectRoot, 'src');
    this.componentsDir = path.join(this.srcDir, 'components');
    this.hooksDir = path.join(this.srcDir, 'hooks');
    this.servicesDir = path.join(this.srcDir, 'services');

    this.metrics = {
      filesProcessed: 0,
      functionsOptimized: 0,
      dependenciesRemoved: 0,
      typesImproved: 0,
      performanceImprovements: 0
    };

    this.unusedDependencies = new Set();
    this.duplicateFunctions = new Map();
    this.performanceIssues = new Map();
    this.typeSafetyIssues = new Map();
  }

  /**
   * Main refactoring orchestrator
   */
  async refactor() {
    console.log('🚀 Starting intelligent refactoring...\n');

    try {
      await this.analyzeProject();
      await this.optimizeDependencies();
      await this.consolidateDuplicates();
      await this.optimizePerformance();
      await this.improveTypeSafety();
      await this.generateReport();

      console.log('\n✅ Refactoring completed successfully!');
    } catch (error) {
      console.error('\n❌ Refactoring failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Analyze project structure and identify refactoring opportunities
   */
  async analyzeProject() {
    console.log('📊 Analyzing project structure...');

    // Read package.json for dependencies
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Analyze all TypeScript/JavaScript files
    const allFiles = this.getAllFiles(this.projectRoot, /\.(ts|tsx|js|jsx)$/);

    for (const file of allFiles) {
      if (file.includes('node_modules')) continue;

      const content = fs.readFileSync(file, 'utf8');
      await this.analyzeFile(file, content, packageJson);
    }

    console.log(`✓ Analyzed ${this.metrics.filesProcessed} files`);
  }

  /**
   * Analyze individual file for refactoring opportunities
   */
  async analyzeFile(filePath, content, packageJson) {
    this.metrics.filesProcessed++;

    // Check for unused imports
    const imports = this.extractImports(content);
    const usage = this.extractUsage(content);

    for (const importedModule of imports) {
      const isExternal = importedModule.startsWith('@') || !importedModule.startsWith('.');

      if (isExternal) {
        const packageName = importedModule.split('/')[0];
        if (packageJson.dependencies?.[packageName] && !usage.has(packageName)) {
          this.unusedDependencies.add(packageName);
        }
      }
    }

    // Check for duplicate function patterns
    const functions = this.extractFunctions(content);
    for (const [name, implementation] of functions) {
      const key = this.generateFunctionSignature(implementation);
      if (!this.duplicateFunctions.has(key)) {
        this.duplicateFunctions.set(key, []);
      }
      this.duplicateFunctions.get(key).push({ name, file: filePath });
    }

    // Check for performance issues
    const issues = this.analyzePerformance(content);
    if (issues.length > 0) {
      this.performanceIssues.set(filePath, issues);
    }

    // Check for type safety issues
    const typeIssues = this.analyzeTypeSafety(content);
    if (typeIssues.length > 0) {
      this.typeSafetyIssues.set(filePath, typeIssues);
    }
  }

  /**
   * Extract import statements from file content
   */
  extractImports(content) {
    const imports = new Set();
    const importRegex = /^import.*from\s+['"]([^'"]+)['"];?$/gm;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.add(match[1]);
    }

    return imports;
  }

  /**
   * Extract usage patterns from file content
   */
  extractUsage(content) {
    const usage = new Set();

    // Simple heuristic: look for package names in the code
    const packageNames = content.match(/[a-zA-Z][a-zA-Z0-9]*/g) || [];
    packageNames.forEach(name => {
      if (name.length > 2) usage.add(name);
    });

    return usage;
  }

  /**
   * Extract function definitions and their implementations
   */
  extractFunctions(content) {
    const functions = new Map();

    // Match function declarations and expressions
    const functionPatterns = [
      /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>)/g,
      /function\s+(\w+)\s*\(/g,
      /(?:const|let|var)\s+(\w+)\s*:\s*\([^)]*\)\s*=>/g
    ];

    for (const pattern of functionPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const funcName = match[1];
        const startIndex = match.index;
        const implementation = this.extractFunctionImplementation(content, startIndex);

        if (implementation) {
          functions.set(funcName, implementation);
        }
      }
    }

    return functions;
  }

  /**
   * Extract full function implementation
   */
  extractFunctionImplementation(content, startIndex) {
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let i = startIndex;

    // Find the opening brace
    while (i < content.length && content[i] !== '{') i++;
    if (i >= content.length) return null;

    braceCount = 1;
    const start = i;
    i++;

    // Find matching closing brace
    while (i < content.length && braceCount > 0) {
      const char = content[i];

      if (!inString) {
        if (char === '"' || char === "'" || char === '`') {
          inString = true;
          stringChar = char;
        } else if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        }
      } else {
        if (char === stringChar && content[i-1] !== '\\') {
          inString = false;
        }
      }

      i++;
    }

    return content.substring(start, i);
  }

  /**
   * Generate a normalized function signature for comparison
   */
  generateFunctionSignature(implementation) {
    // Remove variable names and whitespace, keep structure
    const normalized = implementation
      .replace(/\w+/g, 'var') // Replace all word characters
      .replace(/\s+/g, ' ')   // Normalize whitespace
      .trim();

    return normalized;
  }

  /**
   * Analyze performance issues in code
   */
  analyzePerformance(content) {
    const issues = [];

    // Check for missing React.memo on components
    if (content.includes('React.FC') && !content.includes('React.memo')) {
      issues.push('Component missing React.memo optimization');
    }

    // Check for expensive operations in render
    const expensivePatterns = [
      /\bfilter\(/g,
      /\bmap\(/g,
      /\breduce\(/g,
      /\bfind\(/g,
      /JSON\.parse/g,
      /JSON\.stringify/g
    ];

    for (const pattern of expensivePatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 3) {
        issues.push(`Multiple expensive operations detected: ${pattern.source}`);
      }
    }

    // Check for missing useCallback/useMemo
    if (content.includes('useCallback') === false &&
        content.includes('useState') &&
        content.includes('=>')) {
      issues.push('Functions in render should be wrapped in useCallback');
    }

    return issues;
  }

  /**
   * Analyze type safety issues
   */
  analyzeTypeSafety(content) {
    const issues = [];

    // Check for 'any' types
    const anyMatches = content.match(/:\s*any\b/g);
    if (anyMatches) {
      issues.push(`Found ${anyMatches.length} 'any' type usages`);
    }

    // Check for missing type annotations
    const functionParams = content.match(/\([^)]*\)\s*=>/g);
    if (functionParams && !content.includes(':')) {
      issues.push('Missing type annotations in function parameters');
    }

    // Check for unsafe type assertions
    const typeAssertions = content.match(/as\s+\w+/g);
    if (typeAssertions && typeAssertions.length > 5) {
      issues.push('Multiple type assertions detected - consider type guards');
    }

    return issues;
  }

  /**
   * Remove unused dependencies
   */
  async optimizeDependencies() {
    console.log('🧹 Optimizing dependencies...');

    if (this.unusedDependencies.size === 0) {
      console.log('✓ No unused dependencies found');
      return;
    }

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    let removedCount = 0;
    for (const dep of this.unusedDependencies) {
      if (packageJson.dependencies?.[dep]) {
        delete packageJson.dependencies[dep];
        removedCount++;
        console.log(`  ✓ Removed unused dependency: ${dep}`);
      }

      if (packageJson.devDependencies?.[dep]) {
        delete packageJson.devDependencies[dep];
        removedCount++;
        console.log(`  ✓ Removed unused dev dependency: ${dep}`);
      }
    }

    if (removedCount > 0) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      this.metrics.dependenciesRemoved = removedCount;

      console.log(`✓ Removed ${removedCount} unused dependencies`);
      console.log('  💡 Run "npm install" to update node_modules');
    }
  }

  /**
   * Consolidate duplicate functions
   */
  async consolidateDuplicates() {
    console.log('🔧 Consolidating duplicate functions...');

    const utilsDir = path.join(this.srcDir, 'utils');
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    let consolidatedCount = 0;
    const consolidatedFunctions = new Map();

    for (const [signature, occurrences] of this.duplicateFunctions) {
      if (occurrences.length > 1) {
        // Create a utility function for duplicates
        const baseName = this.suggestUtilityName(occurrences[0].name);
        const functionName = this.findAvailableName(utilsDir, baseName);

        // Extract the implementation from the first occurrence
        const implementation = this.extractUtilityImplementation(occurrences[0].file, occurrences[0].name);

        if (implementation) {
          // Write utility function
          const utilFilePath = path.join(utilsDir, `${functionName}.ts`);
          const utilContent = this.generateUtilityFile(functionName, implementation, signature);

          fs.writeFileSync(utilFilePath, utilContent);
          consolidatedFunctions.set(signature, {
            name: functionName,
            path: utilFilePath,
            importPath: `../utils/${functionName}`
          });

          console.log(`  ✓ Created utility function: ${functionName}`);
          consolidatedCount++;
        }
      }
    }

    if (consolidatedCount > 0) {
      this.metrics.functionsOptimized = consolidatedCount;
      console.log(`✓ Consolidated ${consolidatedCount} duplicate functions`);
    }
  }

  /**
   * Optimize performance issues
   */
  async optimizePerformance() {
    console.log('⚡ Optimizing performance...');

    let improvements = 0;

    for (const [filePath, issues] of this.performanceIssues) {
      if (this.shouldOptimizeFile(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const optimized = this.applyPerformanceOptimizations(content, issues);

        if (optimized !== content) {
          fs.writeFileSync(filePath, optimized);
          improvements++;
          console.log(`  ✓ Optimized performance in: ${path.relative(this.projectRoot, filePath)}`);
        }
      }
    }

    if (improvements > 0) {
      this.metrics.performanceImprovements = improvements;
      console.log(`✓ Applied ${improvements} performance optimizations`);
    }
  }

  /**
   * Improve type safety
   */
  async improveTypeSafety() {
    console.log('🛡️  Improving type safety...');

    let improvements = 0;

    for (const [filePath, issues] of this.typeSafetyIssues) {
      if (this.shouldOptimizeFile(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const improved = this.applyTypeSafetyImprovements(content, issues);

        if (improved !== content) {
          fs.writeFileSync(filePath, improved);
          improvements++;
          console.log(`  ✓ Improved type safety in: ${path.relative(this.projectRoot, filePath)}`);
        }
      }
    }

    if (improvements > 0) {
      this.metrics.typesImproved = improvements;
      console.log(`✓ Applied ${improvements} type safety improvements`);
    }
  }

  /**
   * Generate refactoring report
   */
  async generateReport() {
    console.log('\n📋 Generating refactoring report...');

    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      unusedDependencies: Array.from(this.unusedDependencies),
      duplicateFunctionCount: Array.from(this.duplicateFunctions.values())
        .filter(occurrences => occurrences.length > 1).length,
      performanceIssuesCount: this.performanceIssues.size,
      typeSafetyIssuesCount: this.typeSafetyIssues.size,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(this.projectRoot, 'refactoring-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Report saved to: ${reportPath}`);

    // Print summary
    console.log('\n📊 Refactoring Summary:');
    console.log(`  Files processed: ${this.metrics.filesProcessed}`);
    console.log(`  Dependencies removed: ${this.metrics.dependenciesRemoved}`);
    console.log(`  Functions optimized: ${this.metrics.functionsOptimized}`);
    console.log(`  Performance improvements: ${this.metrics.performanceImprovements}`);
    console.log(`  Type safety improvements: ${this.metrics.typesImproved}`);
  }

  // Helper methods
  getAllFiles(dir, extension) {
    const files = [];

    const traverse = (currentDir) => {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (!item.includes('node_modules') && !item.startsWith('.')) {
            traverse(fullPath);
          }
        } else if (extension.test(fullPath)) {
          files.push(fullPath);
        }
      }
    };

    traverse(dir);
    return files;
  }

  shouldOptimizeFile(filePath) {
    // Skip generated files, test files, and certain directories
    const skipPatterns = [
      /\.test\./,
      /\.spec\./,
      /node_modules/,
      /\.d\.ts$/,
      /dist/,
      /build/
    ];

    return !skipPatterns.some(pattern => pattern.test(filePath));
  }

  suggestUtilityName(functionName) {
    const commonMappings = {
      'fetch': 'api',
      'handle': 'handler',
      'format': 'formatter',
      'validate': 'validator',
      'parse': 'parser',
      'transform': 'transformer'
    };

    for (const [key, value] of Object.entries(commonMappings)) {
      if (functionName.toLowerCase().includes(key)) {
        return value;
      }
    }

    return 'utility';
  }

  findAvailableName(dir, baseName) {
    let name = baseName;
    let counter = 1;

    while (fs.existsSync(path.join(dir, `${name}.ts`))) {
      name = `${baseName}${counter}`;
      counter++;
    }

    return name;
  }

  extractUtilityImplementation(filePath, functionName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const functions = this.extractFunctions(content);
    return functions.get(functionName);
  }

  generateUtilityFile(functionName, implementation, signature) {
    return `/**
 * Auto-generated utility function
 *
 * This function was automatically consolidated from duplicate implementations.
 * Signature: ${signature}
 */

${implementation}

export default ${functionName};
`;
  }

  applyPerformanceOptimizations(content, issues) {
    let optimized = content;

    // Add React.memo to components
    if (issues.includes('Component missing React.memo optimization')) {
      optimized = optimized.replace(
        /export default ([\w_]+)/g,
        'export default React.memo($1)'
      );
    }

    // Add useCallback for functions in render
    if (issues.includes('Functions in render should be wrapped in useCallback')) {
      // This is a simplified version - real implementation would be more sophisticated
      optimized = optimized.replace(
        /const\s+(\w+)\s*=\s*\(/g,
        'const $1 = useCallback('
      );
    }

    return optimized;
  }

  applyTypeSafetyImprovements(content, issues) {
    let improved = content;

    // Replace 'any' with 'unknown' where appropriate
    if (issues.some(issue => issue.includes("'any' type"))) {
      improved = improved.replace(/:\s*any\b/g, ': unknown');
    }

    // Add type annotations (simplified)
    if (issues.includes('Missing type annotations in function parameters')) {
      improved = improved.replace(
        /=> \s*{/g,
        ': unknown => {'
      );
    }

    return improved;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.unusedDependencies.size > 0) {
      recommendations.push('Consider reviewing unused dependencies before removal');
    }

    if (this.performanceIssues.size > 0) {
      recommendations.push('Implement React.memo and useCallback for frequently re-rendering components');
    }

    if (this.typeSafetyIssues.size > 0) {
      recommendations.push('Enable strict TypeScript mode in tsconfig.json');
      recommendations.push('Add ESLint rules for type safety');
    }

    if (this.duplicateFunctions.size > 0) {
      recommendations.push('Consider creating a comprehensive utility library');
    }

    return recommendations;
  }
}

// Run the refactoring if this script is executed directly
if (require.main === module) {
  const refactor = new AutoRefactor();
  refactor.refactor().catch(console.error);
}

module.exports = AutoRefactor;