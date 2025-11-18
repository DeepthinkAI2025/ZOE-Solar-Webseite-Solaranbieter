import * as fs from 'fs';
import * as path from 'path';

export interface RefactorTarget {
 filePath: string;
 type: 'import' | 'function' | 'component' | 'state' | 'unused-code';
 issue: string;
 severity: 'low' | 'medium' | 'high' | 'critical';
 suggestion: string;
 autoFixable: boolean;
}

export interface UsageAnalysis {
 symbol: string;
 filePath: string;
 importCount: number;
 usedInFiles: string[];
 isUnused: boolean;
}

export interface CodeMetrics {
 imports: {
 unused: Array<{ name: string; file: string }>;
 duplicates: Array<{ symbol: string; files: string[] }>;
 };
 components: {
 unoptimized: Array<{ name: string; file: string; renders: number }>;
 large: Array<{ name: string; file: string; lines: number }>;
 };
 state: {
 redundant: Array<{ file: string; patterns: string[] }>;
 unoptimized: Array<{ file: string; patterns: string[] }>;
 };
}

class SmartRefactor {
 private static instance: SmartRefactor;
 private analysisResults: Map<string, RefactorTarget[]> = new Map();
 private metrics: CodeMetrics | undefined;

 static getInstance(): SmartRefactor {
 if (!SmartRefactor.instance) {
 SmartRefactor.instance = new SmartRefactor();
 }
 return SmartRefactor.instance;
 }

 public async analyzeProject(rootPath: string): Promise<CodeMetrics> {
 this.metrics = {
 imports: {
 unused: await this.findUnusedImports(rootPath),
 duplicates: await this.findDuplicateImports(rootPath),
 },
 components: {
 unoptimized: await this.findUnoptimizedComponents(rootPath),
 large: await this.findLargeComponents(rootPath),
 },
 state: {
 redundant: await this.findRedundantState(rootPath),
 unoptimized: await this.findUnoptimizedState(rootPath),
 },
 };

 this.generateRefactorTargets();
 return this.metrics;
 }

 private async findUnusedImports(rootPath: string): Promise<Array<{ name: string; file: string }>> {
 const unusedImports: Array<{ name: string; file: string }> = [];

 // This would use Serena's find_symbol in a real implementation
 // For now, we'll simulate the analysis
 const files = this.getAllTypeScriptFiles(rootPath);

 for (const file of files) {
 const content = fs.readFileSync(file, 'utf-8');
 const imports = this.extractImports(content);

 // Check if each import is used in the file
 for (const imp of imports) {
 if (!this.isImportUsed(content, imp.name)) {
 unusedImports.push({
 name: imp.name,
 file: path.relative(rootPath, file),
 });
 }
 }
 }

 return unusedImports;
 }

 private async findDuplicateImports(rootPath: string): Promise<Array<{ symbol: string; files: string[] }>> {
 const importMap = new Map<string, string[]>();
 const files = this.getAllTypeScriptFiles(rootPath);

 for (const file of files) {
 const content = fs.readFileSync(file, 'utf-8');
 const imports = this.extractImports(content);

 for (const imp of imports) {
 if (!importMap.has(imp.name)) {
 importMap.set(imp.name, []);
 }
 importMap.get(imp.name)!.push(path.relative(rootPath, file));
 }
 }

 // Find duplicates (imports used in multiple files)
 const duplicates: Array<{ symbol: string; files: string[] }> = [];
 for (const [symbol, files] of importMap.entries()) {
 if (files.length > 3) { // Arbitrary threshold for "too many imports"
 duplicates.push({ symbol, files });
 }
 }

 return duplicates;
 }

 private async findUnoptimizedComponents(rootPath: string): Promise<Array<{ name: string; file: string; renders: number }>> {
 const unoptimized: Array<{ name: string; file: string; renders: number }> = [];
 const files = this.getAllComponentFiles(rootPath);

 for (const file of files) {
 const content = fs.readFileSync(file, 'utf-8');

 // Check for React.memo
 const hasReactMemo = content.includes('React.memo(') || content.includes('memo(');

 // Check for useCallback/useMemo usage
 const useCallbackCount = (content.match(/useCallback/g) || []).length;
 const useMemoCount = (content.match(/useMemo/g) || []).length;

 // Estimate complexity based on hooks and state
 const useStateCount = (content.match(/useState/g) || []).length;
 const useEffectCount = (content.match(/useEffect/g) || []).length;
 const complexity = useStateCount + useEffectCount;

 // Consider components without optimization as candidates
 if (!hasReactMemo && complexity > 5) {
 const componentName = this.extractComponentName(content, file);
 unoptimized.push({
 name: componentName,
 file: path.relative(rootPath, file),
 renders: complexity * 10, // Estimated renders
 });
 }
 }

 return unoptimized.sort((a, b) => b.renders - a.renders);
 }

 private async findLargeComponents(rootPath: string): Promise<Array<{ name: string; file: string; lines: number }>> {
 const large: Array<{ name: string; file: string; lines: number }> = [];
 const files = this.getAllComponentFiles(rootPath);

 for (const file of files) {
 const stats = fs.statSync(file);
 const lines = fs.readFileSync(file, 'utf-8').split('\n').length;

 if (lines > 300) { // Arbitrary threshold for large components
 const content = fs.readFileSync(file, 'utf-8');
 const componentName = this.extractComponentName(content, file);

 large.push({
 name: componentName,
 file: path.relative(rootPath, file),
 lines,
 });
 }
 }

 return large.sort((a, b) => b.lines - a.lines);
 }

 private async findRedundantState(rootPath: string): Promise<Array<{ file: string; patterns: string[] }>> {
 const redundant: Array<{ file: string; patterns: string[] }> = [];
 const files = this.getAllTypeScriptFiles(rootPath);

 for (const file of files) {
 const content = fs.readFileSync(file, 'utf-8');
 const patterns: string[] = [];

 // Check for multiple related useState hooks
 const useStateMatches = content.match(/useState<[^>]+>/g);
 if (useStateMatches && useStateMatches.length > 5) {
 patterns.push(`Multiple useState hooks (${useStateMatches.length})`);
 }

 // Check for related states that could be consolidated
 const relatedStatePatterns = [
 /const \[.*loading.*, setLoading\]/,
 /const \[.*error.*, setError\]/,
 /const \[.*data.*, setData\]/,
 ];

 for (const pattern of relatedStatePatterns) {
 const matches = content.match(pattern);
 if (matches && matches.length > 2) {
 patterns.push(`Related state pattern found: ${pattern.source}`);
 }
 }

 if (patterns.length > 0) {
 redundant.push({
 file: path.relative(rootPath, file),
 patterns,
 });
 }
 }

 return redundant;
 }

 private async findUnoptimizedState(rootPath: string): Promise<Array<{ file: string; patterns: string[] }>> {
 const unoptimized: Array<{ file: string; patterns: string[] }> = [];
 const files = this.getAllTypeScriptFiles(rootPath);

 for (const file of files) {
 const content = fs.readFileSync(file, 'utf-8');
 const patterns: string[] = [];

 // Check for useState with large objects or arrays
 const largeStatePatterns = [
 /useState<\{[^}]+\}>/,
 /useState<Record<string,/,
 /useState<\[[^\]]+\]>/,
 ];

 for (const pattern of largeStatePatterns) {
 const matches = content.match(pattern);
 if (matches) {
 patterns.push(`Large object/array state: ${matches[0]}`);
 }
 }

 // Check for unnecessary state updates
 const unnecessaryPatterns = [
 /setState\(prevState => \([^)]+,\s*[^}]+\}\)/,
 /set\[.*\]\(prev\[.*\] \+ 1\)/,
 ];

 for (const pattern of unnecessaryPatterns) {
 if (content.match(pattern)) {
 patterns.push(`Potential unnecessary state update: ${pattern.source}`);
 }
 }

 if (patterns.length > 0) {
 unoptimized.push({
 file: path.relative(rootPath, file),
 patterns,
 });
 }
 }

 return unoptimized;
 }

 private getAllTypeScriptFiles(rootPath: string): string[] {
 const files: string[] = [];

 function traverseDirectory(dir: string) {
 const items = fs.readdirSync(dir);

 for (const item of items) {
 const fullPath = path.join(dir, item);
 const stat = fs.statSync(fullPath);

 if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== '.serena') {
 traverseDirectory(fullPath);
 } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
 files.push(fullPath);
 }
 }
 }

 traverseDirectory(rootPath);
 return files;
 }

 private getAllComponentFiles(rootPath: string): string[] {
 return this.getAllTypeScriptFiles(rootPath).filter(file => {
 const content = fs.readFileSync(file, 'utf-8');
 return content.includes('React.FC') || content.includes('function Component') || content.includes('export const');
 });
 }

 private extractImports(content: string): Array<{ name: string; from: string }> {
 const imports: Array<{ name: string; from: string }> = [];

 // Match ES6 imports
 const es6ImportRegex = /import\s+(?:\{[^}]+\}|\*\s+)?(?:[^s]+)\s+from\s+['"`]([^'"`]+)['"`]/g;
 let match;

 while ((match = es6ImportRegex.exec(content)) !== null) {
 const importClause = match[1];
 const fromClause = match[2];

 if (importClause && fromClause) {
 // Handle named imports
 const namedImports = importClause.match(/\{([^}]+)\}/);
 if (namedImports && namedImports[1]) {
 const names = namedImports[1].split(',').map(name => name.trim());
 names.forEach(name => {
 imports.push({ name, from: fromClause });
 });
 }
 }
 }

 return imports;
 }

 private isImportUsed(content: string, importName: string): boolean {
 // Simple check if import is used in the content
 const regex = new RegExp(`\\b${importName}\\b`, 'g');
 return regex.test(content.replace(/import.*?from.*['"`][^'"`]*['"`]/g, '')); // Remove import statements
 }

 private extractComponentName(content: string, filePath: string): string {
 // Try to extract component name from different patterns
 const patterns = [
 /export\s+(?:default\s+)?(?:const|function)\s+(\w+)\s*=/,
 /React\.FC<[^>]*>\s*=\s*(\w+)/,
 /function\s+(\w+)\s*\(/,
 /const\s+(\w+)\s*:\s*React\.FC/,
 ];

 for (const pattern of patterns) {
 const match = content.match(pattern);
 if (match && match[1]) {
 return match[1];
 }
 }

 // Fallback to filename
 return path.basename(filePath, path.extname(filePath));
 }

 private generateRefactorTargets(): void {
 this.analysisResults.clear();

 if (!this.metrics) return;

 // Generate targets for unused imports
 this.metrics.imports.unused.forEach(item => {
 const target: RefactorTarget = {
 filePath: item.file,
 type: 'import',
 issue: `Unused import: ${item.name}`,
 severity: 'medium',
 suggestion: `Remove unused import '${item.name}' from ${item.file}`,
 autoFixable: true,
 };
 this.addToResults(target.filePath, target);
 });

 // Generate targets for unoptimized components
 this.metrics.components.unoptimized.forEach(item => {
 const target: RefactorTarget = {
 filePath: item.file,
 type: 'component',
 issue: `Unoptimized component: ${item.name} (${item.renders} estimated renders)`,
 severity: 'high',
 suggestion: `Add React.memo and useCallback/useMemo optimizations`,
 autoFixable: false,
 };
 this.addToResults(target.filePath, target);
 });

 // Generate targets for large components
 this.metrics.components.large.forEach(item => {
 const target: RefactorTarget = {
 filePath: item.file,
 type: 'component',
 issue: `Large component: ${item.name} (${item.lines} lines)`,
 severity: 'medium',
 suggestion: `Consider splitting into smaller components`,
 autoFixable: false,
 };
 this.addToResults(target.filePath, target);
 });

 // Generate targets for redundant state
 this.metrics.state.redundant.forEach(item => {
 item.patterns.forEach(pattern => {
 const target: RefactorTarget = {
 filePath: item.file,
 type: 'state',
 issue: `Redundant state pattern: ${pattern}`,
 severity: 'medium',
 suggestion: `Consider consolidating related states with useReducer`,
 autoFixable: false,
 };
 this.addToResults(target.filePath, target);
 });
 });

 // Generate targets for unoptimized state
 this.metrics.state.unoptimized.forEach(item => {
 item.patterns.forEach(pattern => {
 const target: RefactorTarget = {
 filePath: item.file,
 type: 'state',
 issue: `Unoptimized state: ${pattern}`,
 severity: 'low',
 suggestion: `Optimize state structure and updates`,
 autoFixable: false,
 };
 this.addToResults(target.filePath, target);
 });
 });
 }

 private addToResults(filePath: string, target: RefactorTarget): void {
 if (!this.analysisResults.has(filePath)) {
 this.analysisResults.set(filePath, []);
 }
 this.analysisResults.get(filePath)!.push(target);
 }

 public getRefactorTargets(filePath?: string): RefactorTarget[] {
 if (filePath) {
 return this.analysisResults.get(filePath) || [];
 }
 return Array.from(this.analysisResults.values()).flat();
 }

 public getHighPriorityTargets(): RefactorTarget[] {
 return Array.from(this.analysisResults.values())
 .flat()
 .filter(target => target.severity === 'critical' || target.severity === 'high')
 .sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity));
 }

 private getSeverityWeight(severity: RefactorTarget['severity']): number {
 const weights = { critical: 4, high: 3, medium: 2, low: 1 };
 return weights[severity] || 0;
 }

 public generateRefactoredCode(filePath: string): string {
 const targets = this.getRefactorTargets(filePath);
 let content = fs.readFileSync(filePath, 'utf-8');

 // Apply auto-fixable changes
 for (const target of targets.filter(t => t.autoFixable)) {
 switch (target.type) {
 case 'import':
 content = this.removeUnusedImport(content, target);
 break;
 // Add more auto-fix cases as needed
 }
 }

 return content;
 }

 private removeUnusedImport(content: string, target: RefactorTarget): string {
 const importName = target.issue.match(/Unused import: (\w+)/)?.[1];
 if (!importName) return content;

 // Remove the import line
  const importRegex = /import.*?\".*?\".*?from.*?\".*?\";?\\s*/g;
 return content.replace(importRegex, '');
 }

 public exportAnalysisReport(): string {
 return JSON.stringify({
 timestamp: new Date().toISOString(),
 metrics: this.metrics,
 targets: Object.fromEntries(this.analysisResults),
 summary: {
 totalTargets: Array.from(this.analysisResults.values()).flat().length,
 highPriorityCount: this.getHighPriorityTargets().length,
 autoFixableCount: Array.from(this.analysisResults.values()).flat().filter(t => t.autoFixable).length,
 },
 }, null, 2);
 }
}

export const smartRefactor = SmartRefactor.getInstance();
export default SmartRefactor;