import * as fs from 'fs';
import * as path from 'path';
import { smartRefactor } from './refactor-utils';

export interface RefactoringPlan {
 filePath: string;
 targets: Array<{
 type: string;
 description: string;
 changes: string[];
 }>;
 estimatedImpact: {
 performance: 'high' | 'medium' | 'low';
 maintainability: 'high' | 'medium' | 'low';
 readability: 'high' | 'medium' | 'low';
 };
}

export interface OptimizedComponent {
 name: string;
 originalCode: string;
 optimizedCode: string;
 improvements: string[];
 performanceGains: {
 renders: number;
 memory: string;
 bundleSize: string;
 };
}

class AutoRefactor {
 private static instance: AutoRefactor;
 private refactoringPlans: Map<string, RefactoringPlan> = new Map();
 private optimizedComponents: Map<string, OptimizedComponent> = new Map();

 static getInstance(): AutoRefactor {
 if (!AutoRefactor.instance) {
 AutoRefactor.instance = new AutoRefactor();
 }
 return AutoRefactor.instance;
 }

 public async optimizeFile(filePath: string): Promise<{ success: boolean; changes: string[]; optimizedCode?: string }> {
 try {
 const originalContent = fs.readFileSync(filePath, 'utf-8');
 const optimizedContent = await this.applyOptimizations(filePath, originalContent);

 const changes = this.detectChanges(originalContent, optimizedContent);

 if (changes.length > 0) {
 // Backup original file
 fs.writeFileSync(`${filePath}.backup`, originalContent);

 // Write optimized content
 fs.writeFileSync(filePath, optimizedContent);

 return {
 success: true,
 changes,
 optimizedCode,
 };
 }

 return { success: false, changes: [] };
 } catch (error) {
 console.error(`Failed to optimize ${filePath}:`, error);
 return { success: false, changes: [] };
 }
 }

 public async applyOptimizations(filePath: string, content: string): Promise<string> {
 const fileExtension = path.extname(filePath);
 let optimizedContent = content;

 if (fileExtension === '.tsx' || fileExtension === '.ts') {
 optimizedContent = await this.optimizeReactComponent(filePath, content);
 }

 return optimizedContent;
 }

 private async optimizeReactComponent(filePath: string, content: string): Promise<string> {
 const componentName = this.extractComponentName(content, filePath);
 let optimizedContent = content;

 // 1. Add React.memo for frequently rendered components
 if (this.shouldAddMemo(content)) {
 optimizedContent = this.addReactMemo(optimizedContent, componentName);
 }

 // 2. Optimize state usage
 optimizedContent = this.optimizeStateUsage(optimizedContent);

 // 3. Add useCallback for event handlers
 optimizedContent = this.addUseCallback(optimizedContent);

 // 4. Add useMemo for expensive calculations
 optimizedContent = this.addUseMemo(optimizedContent);

 // 5. Optimize useEffect dependencies
 optimizedContent = this.optimizeUseEffect(optimizedContent);

 // 6. Remove unused imports
 optimizedContent = this.removeUnusedImports(optimizedContent);

 return optimizedContent;
 }

 private shouldAddMemo(content: string): boolean {
 // Check if component already has memo
 if (content.includes('React.memo') || content.includes('memo(')) {
 return false;
 }

 // Check if component has props and state (indicating it might benefit from memoization)
 const hasProps = content.includes('props:');
 const hasState = content.includes('useState');
 const hasComplexLogic = (content.match(/useEffect/g) || []).length > 2;

 return hasProps && (hasState || hasComplexLogic);
 }

 private addReactMemo(content: string, componentName: string): string {
 // Find the component declaration
 const componentRegex = /(?:export\s+)?(?:const|function)\s+([A-Z][a-zA-Z0-9]*)\s*(?::?\s*React\.FC|=\s*\([^)]*\)\s*=>?\s*\{)/;
 const match = content.match(componentRegex);

 if (!match) {
 return content; // Could not find component declaration
 }

 const originalDeclaration = match[0];
 const componentBody = content.substring(match.index!);

 // Create memoized version
 const memoizedComponent = `${originalDeclaration.replace(componentName, `React.memo(${componentName})`)}`;

 return content.replace(originalDeclaration, memoizedComponent);
 }

 private optimizeStateUsage(content: string): string {
 let optimizedContent = content;

 // Consolidate related state variables
 const useStateMatches = content.match(/const\s+\[(\w+),\s*set\w+\]\s*=\s*useState<[^>]+>\([^;]+);/g);

 if (useStateMatches && useStateMatches.length > 3) {
 // Find related states and suggest reducer
 const relatedStates = this.findRelatedStates(content);
 if (relatedStates.length > 2) {
 optimizedContent = this.createReducerForRelatedStates(optimizedContent, relatedStates);
 }
 }

 return optimizedContent;
 }

 private findRelatedStates(content: string): Array<{ name: string; setter: string; type: string }> {
 const states: Array<{ name: string; setter: string; type: string }> = [];
 const stateRegex = /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState<([^>]+)>\s*\{([^}]+)\};?/g;

 let match;
 while ((match = stateRegex.exec(content)) !== null) {
 states.push({
 name: match[1],
 setter: match[2],
 type: match[3].trim(),
 });
 }

 // Find related states (e.g., loading/error/data patterns)
 const relatedStates: Array<{ name: string; setter: string; type: string }> = [];

 // Check for common patterns
 const patterns = [
 { keywords: ['loading', 'isLoading', 'setLoading'], type: 'boolean' },
 { keywords: ['error', 'setError', 'errors'], type: 'object' },
 { keywords: ['data', 'setData', 'result'], type: 'object' },
 { keywords: ['success', 'setSuccess'], type: 'boolean' },
 ];

 for (const pattern of patterns) {
 const foundStates = states.filter(state =>
 pattern.keywords.some(keyword =>
 state.name.toLowerCase().includes(keyword) ||
 state.setter.toLowerCase().includes(keyword)
 )
 );

 if (foundStates.length > 0) {
 relatedStates.push(...foundStates);
 }
 }

 return relatedStates;
 }

 private createReducerForRelatedStates(content: string, states: Array<{ name: string; setter: string; type: string }>): string {
 // Create a reducer for related states
 const stateNames = states.map(s => s.name);
 const stateType = states.map(s => `${s.name}: ${s.type}`).join('; ');

 const reducerCode = `
interface ${states[0]?.name || 'Component'}State {
 ${stateType}
}

type ${states[0]?.name || 'Component'}Action =
 | ${stateNames.map(name => `set${name.charAt(0).toUpperCase() + name.slice(1)}`).join(' | ')}
 | ${stateNames.map(name => `update${name.charAt(0).toUpperCase() + name.slice(1)}`).join(' | ')};

const ${states[0]?.name.toLowerCase() || 'component'}Reducer = (
 state: ${states[0]?.name || 'Component'}State,
 action: ${states[0]?.name || 'Component'}Action
): ${states[0]?.name || 'Component'}State => {
 switch (action.type) {
${stateNames.map(name => ` case 'set${name.charAt(0).toUpperCase() + name.slice(1)}':
 return { ...state, ${name}: action.payload };
`).join('\n')}
${stateNames.map(name => ` case 'update${name.charAt(0).toUpperCase() + name.slice(1)}':
 return { ...state, ${name}: { ...state.${name}, ...action.payload } };
`).join('\n')}
 default:
 return state;
 }
};

const [${states[0]?.name.toLowerCase() || 'component'}State, dispatch] = useReducer(${states[0]?.name.toLowerCase() || 'component'}Reducer, {
 ${stateNames.map(name => `${name}: ${states.find(s => s.name === name)?.type || 'any'},`).join(',\n ')
});

${stateNames.map(name => `
const set${name.charAt(0).toUpperCase() + name.slice(1)} = (value: any) =>
 dispatch({ type: 'set${name.charAt(0).toUpperCase() + name.slice(1)}', payload: value });
`).join('')}
`;

 // Find the location to insert the reducer (before the component)
 const insertPoint = content.indexOf('const ');
 if (insertPoint === -1) {
 return content; // Could not find insertion point
 }

 return content.slice(0, insertPoint) + reducerCode + '\n' + content.slice(insertPoint);
 }

 private addUseCallback(content: string): string {
 // Find functions that could benefit from useCallback
 const functionRegex = /(?:const|function)\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>\s*\{|function\s*\([^)]*\)\s*\{)/g;

 let optimizedContent = content;
 let match;

 while ((match = functionRegex.exec(content)) !== null) {
 const functionName = match[1];
 const functionStart = match.index;

 // Check if this is an event handler or a function that could benefit from memoization
 const isEventHandler = functionName.toLowerCase().includes('handle') ||
 functionName.toLowerCase().includes('on') ||
 functionName.toLowerCase().includes('submit');

 if (isEventHandler) {
 // Find the end of the function
 const functionBody = content.slice(functionStart);
 const braceCount = (functionBody.match(/\{/g) || []).length;
 const closeBraceIndex = this.findMatchingBrace(functionBody, functionStart, braceCount);

 if (closeBraceIndex !== -1) {
 const fullFunction = content.slice(functionStart, closeBraceIndex + 1);
 const memoizedFunction = `const ${functionName} = useCallback((${fullFunction.slice(7).trimStart()}) => {`;

 optimizedContent = optimizedContent.replace(fullFunction, memoizedFunction);
 }
 }
 }

 return optimizedContent;
 }

 private addUseMemo(content: string): string {
 // Find expensive calculations that could benefit from useMemo
 const calculationPatterns = [
 /\.filter\(/,
 /\.map\(/,
 /\.reduce\(/,
 /\.sort\(/,
 /\.find\(/,
 ];

 let optimizedContent = content;

 for (const pattern of calculationPatterns) {
 const regex = new RegExp(`\\w+\\s*=\\s*[^;]*${pattern.source}[^;]*;`, 'g');
 let match;

 while ((match = regex.exec(content)) !== null) {
 const calculation = match[0];

 // Check if this is already memoized
 if (calculation.includes('useMemo(')) {
 continue;
 }

 // Extract the variable name
 const variableMatch = calculation.match(/(\w+)\s*=/);
 if (!variableMatch) continue;

 const variableName = variableMatch[1];

 // Create memoized version
 const memoizedCalculation = `const ${variableName} = useMemo(() => ${calculation.substring(variableName.length + 1).trimEnd()});`;

 optimizedContent = optimizedContent.replace(calculation, memoizedCalculation);
 }
 }

 return optimizedContent;
 }

 private optimizeUseEffect(content: string): string {
 // Find useEffect hooks with complex dependencies
  const useEffectRegex = /useEffect\s*\(\s*\([^,]*,\s*\[([^\]]*)\]\)/g;

 let optimizedContent = content;
 let match;

 while ((match = useEffectRegex.exec(content)) !== null) {
 const dependencies = match[1];

 // Check if dependencies array is too large
 if (dependencies.split(',').length > 3) {
 // Suggest using useMemo for complex dependencies
 const memoizedDeps = `const memoizedDeps = useMemo(() => [${dependencies}], [${dependencies.replace(/\s+/g, '')}]);`;

 // Insert useMemo before useEffect
 const useEffectIndex = match.index;
 optimizedContent = optimizedContent.slice(0, useEffectIndex) + memoizedDeps + '\n ' + optimizedContent.slice(useEffectIndex);

 // Replace dependencies in useEffect
 optimizedContent = optimizedContent.replace(match[0], `useEffect(() => ${match[0].slice(8).split(',')[0].trim()}, [memoizedDeps])`);
 }
 }

 return optimizedContent;
 }

 private removeUnusedImports(content: string): string {
 // Get targets for unused imports
 const filePath = 'current-file'; // This would be determined by the refactoring tool
 const targets = smartRefactor.getRefactorTargets(filePath);
 const unusedImportTargets = targets.filter(t => t.type === 'import');

 let optimizedContent = content;

 for (const target of unusedImportTargets) {
 const importName = target.issue.match(/Unused import: (\w+)/)?.[1];
 if (importName) {
 const importRegex = new RegExp(`import\\s*(?:\\{[^}]*${importName}[^}]*\\}\\s*|[^\\s]*\\b${importName}\\b)[^\\s]*from\\s*['"][^'"]*['"][^;]*;?`, 'g');
 optimizedContent = optimizedContent.replace(importRegex, '');
 }
 }

 // Clean up extra whitespace and empty lines
 optimizedContent = optimizedContent
 .replace(/\n\s*\n\s*\n/g, '\n')
 .replace(/^\s+|\s+$/gm, '');

 return optimizedContent;
 }

 private extractComponentName(content: string, filePath: string): string {
 const patterns = [
 /export\s+(?:default\s+)?(?:const|function)\s+(\w+)\s*=/,
 /React\.FC<[^>]*>\s*=\s*(\w+)/,
 /function\s+(\w+)\s*\(/,
 /const\s+(\w+)\s*:\s*React\.FC/,
 ];

 for (const pattern of patterns) {
 const match = content.match(pattern);
 if (match) {
 return match[1];
 }
 }

 return path.basename(filePath, path.extname(filePath));
 }

 private findMatchingBrace(content: string, startIndex: number, openCount: number): number {
 let count = openCount;
 for (let i = startIndex; i < content.length; i++) {
 if (content[i] === '{') {
 count++;
 } else if (content[i] === '}') {
 count--;
 if (count === 0) {
 return i;
 }
 }
 }
 return -1;
 }

 private detectChanges(original: string, optimized: string): string[] {
 const changes: string[] = [];

 if (original !== optimized) {
 const originalLines = original.split('\n');
 const optimizedLines = optimized.split('\n');

 // Simple line-by-line comparison
 const maxLines = Math.max(originalLines.length, optimizedLines.length);

 for (let i = 0; i < maxLines; i++) {
 const originalLine = originalLines[i] || '';
 const optimizedLine = optimizedLines[i] || '';

 if (originalLine.trim() !== optimizedLine.trim()) {
 changes.push(`Line ${i + 1}: ${originalLine.trim()} -> ${optimizedLine.trim()}`);
 }
 }
 }

 return changes;
 }

 public async optimizeComponent(filePath: string): Promise<OptimizedComponent> {
 const content = fs.readFileSync(filePath, 'utf-8');
 const optimizedContent = await this.applyOptimizations(filePath, content);

 const componentName = this.extractComponentName(content, filePath);
 const changes = this.detectChanges(content, optimizedContent);
 const improvements = this.generateImprovementList(optimizedContent);

 const optimizedComponent: OptimizedComponent = {
 name: componentName,
 originalCode: content,
 optimizedContent,
 improvements,
 performanceGains: {
 renders: this.estimateRenderGains(optimizedContent),
 memory: this.estimateMemoryGains(optimizedContent),
 bundleSize: this.estimateBundleSizeGains(optimizedContent),
 },
 };

 this.optimizedComponents.set(filePath, optimizedComponent);
 return optimizedComponent;
 }

 private generateImprovementList(optimizedContent: string): string[] {
 const improvements: string[] = [];

 if (optimizedContent.includes('React.memo(')) {
 improvements.push('Added React.memo for render optimization');
 }

 if (optimizedContent.includes('useCallback(')) {
 improvements.push('Added useCallback for function memoization');
 }

 if (optimizedContent.includes('useMemo(')) {
 improvements.push('Added useMemo for expensive calculations');
 }

 if (optimizedContent.includes('useReducer(')) {
 improvements.push('Consolidated related state with useReducer');
 }

 if (optimizedContent.includes('memoizedDeps')) {
 improvements.push('Optimized useEffect dependencies with useMemo');
 }

 return improvements;
 }

 private estimateRenderGains(content: string): number {
 // Simple estimation based on optimizations
 let gains = 0;

 if (content.includes('React.memo(')) gains += 30;
 if (content.includes('useCallback(')) gains += 15;
 if (content.includes('useMemo(')) gains += 20;
 if (content.includes('useReducer(')) gains += 25;

 return gains;
 }

 private estimateMemoryGains(content: string): string {
 // Simple estimation
 const optimizations = [
 { pattern: 'useReducer', gain: '25%' },
 { pattern: 'useMemo', gain: '15%' },
 { pattern: 'useCallback', gain: '10%' },
 ];

 let totalGain = 0;
 for (const { pattern, gain } of optimizations) {
 if (content.includes(pattern)) {
 totalGain += parseInt(gain);
 }
 }

 return `${Math.min(totalGain, 50)}%`;
 }

 private estimateBundleSizeGains(content: string): string {
 // Simple estimation based on tree-shaking potential
 let gains = 0;

 if (content.includes('useMemo(')) gains += 5;
 if (content.includes('useCallback(')) gains += 3;
 if (content.includes('React.memo(')) gains += 2;

 return `~${gains}KB`;
 }

 public getOptimizationPlan(filePath: string): RefactoringPlan {
 if (this.refactoringPlans.has(filePath)) {
 return this.refactoringPlans.get(filePath)!;
 }

 const targets = smartRefactor.getRefactorTargets(filePath);
 const plan: RefactoringPlan = {
 filePath,
 targets: targets.map(target => ({
 type: target.type,
 description: target.issue,
 changes: [target.suggestion],
 })),
 estimatedImpact: {
 performance: this.estimatePerformanceImpact(targets),
 maintainability: this.estimateMaintainabilityImpact(targets),
 readability: this.estimateReadabilityImpact(targets),
 },
 };

 this.refactoringPlans.set(filePath, plan);
 return plan;
 }

 private estimatePerformanceImpact(targets: any[]): 'high' | 'medium' | 'low' {
 const highSeverityTargets = targets.filter(t => t.severity === 'high').length;
 const mediumSeverityTargets = targets.filter(t => t.severity === 'medium').length;

 if (highSeverityTargets >= 3) return 'high';
 if (mediumSeverityTargets >= 5) return 'medium';
 return 'low';
 }

 private estimateMaintainabilityImpact(targets: any[]): 'high' | 'medium' | 'low' {
 const componentTargets = targets.filter(t => t.type === 'component').length;
 const stateTargets = targets.filter(t => t.type === 'state').length;

 if (componentTargets >= 2 || stateTargets >= 3) return 'high';
 if (componentTargets >= 1 || stateTargets >= 1) return 'medium';
 return 'low';
 }

 private estimateReadabilityImpact(targets: any[]): 'high' | 'medium' | 'low' {
 const autoFixableTargets = targets.filter(t => t.autoFixable).length;

 if (autoFixableTargets >= 5) return 'high';
 if (autoFixableTargets >= 2) return 'medium';
 return 'low';
 }

 public exportRefactoringReport(): string {
 return JSON.stringify({
 timestamp: new Date().toISOString(),
 refactoringPlans: Object.fromEntries(this.refactoringPlans),
 optimizedComponents: Object.fromEntries(
 Array.from(this.optimizedComponents.entries()).map(([path, component]) => [
 path,
 {
 name: component.name,
 improvements: component.improvements,
 performanceGains: component.performanceGains,
 }
 ])
 ),
 summary: {
 totalPlans: this.refactoringPlans.size,
 totalOptimizedComponents: this.optimizedComponents.size,
 averagePerformanceGain: this.calculateAveragePerformanceGain(),
 },
 }, null, 2);
 }

 private calculateAveragePerformanceGain(): number {
 if (this.optimizedComponents.size === 0) return 0;

 const totalGains = Array.from(this.optimizedComponents.values())
 .reduce((sum, comp) => sum + comp.performanceGains.renders, 0);

 return Math.round(totalGains / this.optimizedComponents.size);
 }
}

export const autoRefactor = AutoRefactor.getInstance();
export default AutoRefactor;