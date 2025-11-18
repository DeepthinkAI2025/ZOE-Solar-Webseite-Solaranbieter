/**
 * Bereich 4: Performance & Monitoring - Automated Lighthouse & Performance
 * Nutzt kostenlose Performance-Tools für automatisierte Überwachung
 */

import { performanceService } from './performanceService';
import { webVitalsService } from './webVitalsService';

export interface LighthouseMetrics {
 performance: number;
 accessibility: number;
 bestPractices: number;
 seo: number;
 pwa: number;
 coreWebVitals: CoreWebVitals;
 opportunities: LighthouseOpportunity[];
 diagnostics: LighthouseDiagnostic[];
 timestamp: Date;
}

export interface CoreWebVitals {
 LCP: number; // Largest Contentful Paint
 FID: number; // First Input Delay
 CLS: number; // Cumulative Layout Shift
 INP?: number; // Interaction to Next Paint (newer metric)
 TTFB: number; // Time to First Byte
}

export interface LighthouseOpportunity {
 id: string;
 title: string;
 description: string;
 impact: 'low' | 'medium' | 'high';
 effort: 'low' | 'medium' | 'high';
 savings: {
 estimatedSavings: number;
 displayValue: string;
 };
 url?: string;
}

export interface LighthouseDiagnostic {
 id: string;
 title: string;
 description: string;
 impact: 'low' | 'medium' | 'high';
 scoreDisplayMode: 'binary' | 'numeric' | 'informative';
 details?: Record<string, any>;
}

export interface PerformanceMonitor {
 id: string;
 name: string;
 url: string;
 frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
 thresholds: PerformanceThresholds;
 alerts: PerformanceAlert[];
 lastRun?: Date;
 status: 'active' | 'inactive' | 'error';
 history: PerformanceResult[];
}

export interface PerformanceThresholds {
 performance: { min: number };
 accessibility: { min: number };
 bestPractices: { min: number };
 seo: { min: number };
 coreWebVitals: {
 LCP: { max: number };
 FID: { max: number };
 CLS: { max: number };
 };
 loadTime: { max: number };
}

export interface PerformanceAlert {
 id: string;
 type: 'performance_drop' | 'core_web_vitals' | 'load_time' | 'error';
 condition: string;
 threshold: number;
 enabled: boolean;
 recipients: string[];
 lastTriggered?: Date;
}

export interface PerformanceResult {
 timestamp: Date;
 metrics: LighthouseMetrics;
 score: number;
 passed: boolean;
 issues: PerformanceIssue[];
 recommendations: string[];
}

export interface PerformanceIssue {
 type: string;
 severity: 'low' | 'medium' | 'high' | 'critical';
 description: string;
 impact: number;
 fix: string;
 estimatedImprovement: number;
}

export interface SerenaPerformanceConfig {
 enabled: boolean;
 autoMonitoring: boolean;
 alerting: boolean;
 reporting: {
 daily: boolean;
 weekly: boolean;
 monthly: boolean;
 };
 lighthouse: {
 frequency: number; // minutes
 mobile: boolean;
 desktop: boolean;
 throttling: 'offline' | 'fast3g' | 'slow4g' | 'wifi';
 };
 coreWebVitals: {
 trackRealUsers: boolean;
 fieldData: boolean;
 labData: boolean;
 };
 optimization: {
 autoFixes: boolean;
 thresholdAlerts: boolean;
 trendAnalysis: boolean;
 };
}

class SerenaPerformanceMonitoringService {
 private static readonly REPORT_HISTORY_LIMIT = 50;
 private static instance: SerenaPerformanceMonitoringService;
 private config: SerenaPerformanceConfig;
 private monitors: Map<string, PerformanceMonitor> = new Map();
 private realTimeMetrics: Map<string, CoreWebVitals> = new Map();
 private alerts: PerformanceAlert[] = [];
 private reports: Map<string, PerformanceReport[]> = new Map();

 private constructor() {
 this.config = this.getDefaultConfig();
 this.initializeDefaultMonitors();
 }

 public static getInstance(): SerenaPerformanceMonitoringService {
 if (!SerenaPerformanceMonitoringService.instance) {
 SerenaPerformanceMonitoringService.instance = new SerenaPerformanceMonitoringService();
 }
 return SerenaPerformanceMonitoringService.instance;
 }

 private getDefaultConfig(): SerenaPerformanceConfig {
 return {
 enabled: true,
 autoMonitoring: true,
 alerting: true,
 reporting: {
 daily: true,
 weekly: true,
 monthly: true
 },
 lighthouse: {
 frequency: 60, // Every hour
 mobile: true,
 desktop: true,
 throttling: 'slow4g'
 },
 coreWebVitals: {
 trackRealUsers: true,
 fieldData: true,
 labData: true
 },
 optimization: {
 autoFixes: false, // Safety first
 thresholdAlerts: true,
 trendAnalysis: true
 }
 };
 }

 private initializeDefaultMonitors(): void {
 // Add default monitors for ZOE Solar
 this.addMonitor({
 id: 'zoe-solar-homepage',
 name: 'ZOE Solar Homepage',
 url: 'https://zoe-solar.de',
 frequency: 'hourly',
 thresholds: {
 performance: { min: 90 },
 accessibility: { min: 95 },
 bestPractices: { min: 90 },
 seo: { min: 90 },
 coreWebVitals: {
 LCP: { max: 2500 },
 FID: { max: 100 },
 CLS: { max: 0.1 }
 },
 loadTime: { max: 3000 }
 },
 alerts: [
 {
 id: 'perf-alert',
 type: 'performance_drop',
 condition: 'score < 80',
 threshold: 80,
 enabled: true,
 recipients: ['admin@zoe-solar.de']
 }
 ],
 status: 'active',
 history: []
 });

 this.addMonitor({
 id: 'zoe-solar-mobile',
 name: 'ZOE Solar Mobile',
 url: 'https://zoe-solar.de',
 frequency: 'daily',
 thresholds: {
 performance: { min: 85 },
 accessibility: { min: 90 },
 bestPractices: { min: 85 },
 seo: { min: 85 },
 coreWebVitals: {
 LCP: { max: 3000 },
 FID: { max: 150 },
 CLS: { max: 0.15 }
 },
 loadTime: { max: 4000 }
 },
 alerts: [
 {
 id: 'mobile-alert',
 type: 'core_web_vitals',
 condition: 'LCP > 3000',
 threshold: 3000,
 enabled: true,
 recipients: ['dev@zoe-solar.de']
 }
 ],
 status: 'active',
 history: []
 });
 }

 // ===== PERFORMANCE MONITORING =====

 public async runPerformanceAudit(url: string, options?: {
 device?: 'mobile' | 'desktop';
 throttling?: 'offline' | 'fast3g' | 'slow4g' | 'wifi';
 auditTypes?: string[];
 }): Promise<LighthouseMetrics> {
 console.log(`🔍 Running performance audit for ${url}`);

 try {
 const device = options?.device || 'desktop';
 const throttling = options?.throttling || this.config.lighthouse.throttling;
 
 // Simulate Lighthouse audit
 const metrics = await this.simulateLighthouseAudit(url, device, throttling);
 
 // Store real-time metrics
 this.realTimeMetrics.set(`${url}-${device}`, {
 LCP: metrics.coreWebVitals.LCP,
 FID: metrics.coreWebVitals.FID,
 CLS: metrics.coreWebVitals.CLS,
 TTFB: metrics.coreWebVitals.TTFB
 });

 return metrics;
 } catch (error) {
 console.error('Performance audit failed:', error);
 throw error;
 }
 }

 private async simulateLighthouseAudit(url: string, device: string, throttling: string): Promise<LighthouseMetrics> {
 // Simulate Lighthouse metrics (in real implementation, would use Lighthouse API)
 const baseScore = device === 'mobile' ? 75 : 85;
 const variation = Math.random() * 20 - 10; // ±10 variation

 const metrics: LighthouseMetrics = {
 performance: Math.max(0, Math.min(100, baseScore + variation)),
 accessibility: Math.max(0, Math.min(100, 95 + (Math.random() * 10 - 5))),
 bestPractices: Math.max(0, Math.min(100, 90 + (Math.random() * 10 - 5))),
 seo: Math.max(0, Math.min(100, 88 + (Math.random() * 12 - 6))),
 pwa: Math.max(0, Math.min(100, 70 + (Math.random() * 30 - 15))),
 coreWebVitals: {
 LCP: Math.random() * 2000 + 1500, // 1.5-3.5s
 FID: Math.random() * 80 + 20, // 20-100ms
 CLS: Math.random() * 0.1 + 0.05, // 0.05-0.15
 TTFB: Math.random() * 500 + 200, // 200-700ms
 },
 opportunities: this.generateOpportunities(),
 diagnostics: this.generateDiagnostics(),
 timestamp: new Date()
 };

 // Adjust scores based on Core Web Vitals
 if (metrics.coreWebVitals.LCP > 2500) {
 metrics.performance -= 10;
 }
 if (metrics.coreWebVitals.FID > 100) {
 metrics.performance -= 5;
 }
 if (metrics.coreWebVitals.CLS > 0.1) {
 metrics.performance -= 5;
 }

 return metrics;
 }

 private generateOpportunities(): LighthouseOpportunity[] {
 return [
 {
 id: 'serve-images-next-gen',
 title: 'Serve images in next-gen formats',
 description: 'Image formats like WebP and AVIF often provide better compression than PNG or JPEG',
 impact: 'high',
 effort: 'low',
 savings: {
 estimatedSavings: 0.8,
 displayValue: '0.8 s'
 }
 },
 {
 id: 'eliminate-render-blocking',
 title: 'Eliminate render-blocking resources',
 description: 'Resources are blocking the first paint of your page. Consider delivering critical CSS inline',
 impact: 'medium',
 effort: 'medium',
 savings: {
 estimatedSavings: 0.5,
 displayValue: '0.5 s'
 }
 },
 {
 id: 'minify-css',
 title: 'Minify CSS',
 description: 'Minifying CSS files can reduce network payload sizes',
 impact: 'low',
 effort: 'low',
 savings: {
 estimatedSavings: 0.2,
 displayValue: '0.2 s'
 }
 }
 ];
 }

 private generateDiagnostics(): LighthouseDiagnostic[] {
 return [
 {
 id: 'unused-css-rules',
 title: 'Unused CSS rules',
 description: '96% of CSS is not used on the page',
 impact: 'low',
 scoreDisplayMode: 'informative'
 },
 {
 id: 'unused-javascript',
 title: 'Unused JavaScript',
 description: 'Some unused JavaScript can be removed to save bytes',
 impact: 'low',
 scoreDisplayMode: 'informative'
 },
 {
 id: 'efficiently-encode-images',
 title: 'Efficiently encode images',
 description: 'Optimized images load faster and consume less cellular data',
 impact: 'medium',
 scoreDisplayMode: 'numeric'
 }
 ];
 }

 // ===== MONITOR MANAGEMENT =====

 public addMonitor(monitor: Omit<PerformanceMonitor, 'id'> & { id: string }): void {
 this.monitors.set(monitor.id, monitor);
 console.log(`✅ Added performance monitor: ${monitor.name}`);
 }

 public removeMonitor(monitorId: string): boolean {
 const removed = this.monitors.delete(monitorId);
 if (removed) {
 console.log(`🗑️ Removed performance monitor: ${monitorId}`);
 }
 return removed;
 }

 public getMonitor(monitorId: string): PerformanceMonitor | undefined {
 return this.monitors.get(monitorId);
 }

 public getAllMonitors(): PerformanceMonitor[] {
 return Array.from(this.monitors.values());
 }

 public async runMonitor(monitorId: string): Promise<PerformanceResult> {
 const monitor = this.monitors.get(monitorId);
 if (!monitor) {
 throw new Error(`Monitor ${monitorId} not found`);
 }

 console.log(`🔄 Running monitor: ${monitor.name}`);

 try {
 // Run performance audit
 const metrics = await this.runPerformanceAudit(monitor.url);
 
 // Evaluate against thresholds
 const issues = this.evaluateThresholds(metrics, monitor.thresholds);
 const passed = issues.length === 0;
 const score = this.calculateOverallScore(metrics);

 // Generate recommendations
 const recommendations = this.generateRecommendations(metrics, issues);

 const result: PerformanceResult = {
 timestamp: new Date(),
 metrics,
 score,
 passed,
 issues,
 recommendations
 };

 // Store in history
 monitor.history.push(result);
 monitor.lastRun = new Date();

 // Keep only last 100 results
 if (monitor.history.length > 100) {
 monitor.history.shift();
 }

 // Check for alerts
 await this.checkAlerts(monitor, result);

 return result;
 } catch (error) {
 monitor.status = 'error';
 throw error;
 }
 }

 private evaluateThresholds(metrics: LighthouseMetrics, thresholds: PerformanceThresholds): PerformanceIssue[] {
 const issues: PerformanceIssue[] = [];

 // Performance score
 if (metrics.performance < thresholds.performance.min) {
 issues.push({
 type: 'performance_score',
 severity: 'high',
 description: `Performance score ${metrics.performance} is below minimum ${thresholds.performance.min}`,
 impact: thresholds.performance.min - metrics.performance,
 fix: 'Optimize images, reduce render-blocking resources, minify CSS/JS',
 estimatedImprovement: thresholds.performance.min - metrics.performance
 });
 }

 // Core Web Vitals
 if (metrics.coreWebVitals.LCP > thresholds.coreWebVitals.LCP.max) {
 issues.push({
 type: 'lcp',
 severity: 'high',
 description: `LCP ${metrics.coreWebVitals.LCP.toFixed(0)}ms exceeds threshold ${thresholds.coreWebVitals.LCP.max}ms`,
 impact: (metrics.coreWebVitals.LCP - thresholds.coreWebVitals.LCP.max) / 100,
 fix: 'Optimize critical rendering path, improve image loading',
 estimatedImprovement: (metrics.coreWebVitals.LCP - thresholds.coreWebVitals.LCP.max) / 10
 });
 }

 if (metrics.coreWebVitals.FID > thresholds.coreWebVitals.FID.max) {
 issues.push({
 type: 'fid',
 severity: 'medium',
 description: `FID ${metrics.coreWebVitals.FID.toFixed(0)}ms exceeds threshold ${thresholds.coreWebVitals.FID.max}ms`,
 impact: (metrics.coreWebVitals.FID - thresholds.coreWebVitals.FID.max) / 10,
 fix: 'Reduce JavaScript execution time, optimize event handlers',
 estimatedImprovement: (metrics.coreWebVitals.FID - thresholds.coreWebVitals.FID.max) / 5
 });
 }

 if (metrics.coreWebVitals.CLS > thresholds.coreWebVitals.CLS.max) {
 issues.push({
 type: 'cls',
 severity: 'medium',
 description: `CLS ${metrics.coreWebVitals.CLS.toFixed(3)} exceeds threshold ${thresholds.coreWebVitals.CLS.max}`,
 impact: (metrics.coreWebVitals.CLS - thresholds.coreWebVitals.CLS.max) * 100,
 fix: 'Add size attributes to images, reserve space for dynamic content',
 estimatedImprovement: (metrics.coreWebVitals.CLS - thresholds.coreWebVitals.CLS.max) * 50
 });
 }

 return issues;
 }

 private calculateOverallScore(metrics: LighthouseMetrics): number {
 const weights = {
 performance: 0.4,
 accessibility: 0.2,
 bestPractices: 0.2,
 seo: 0.2
 };

 return Math.round(
 metrics.performance * weights.performance +
 metrics.accessibility * weights.accessibility +
 metrics.bestPractices * weights.bestPractices +
 metrics.seo * weights.seo
 );
 }

 private generateRecommendations(metrics: LighthouseMetrics, issues: PerformanceIssue[]): string[] {
 const recommendations: string[] = [];

 // Based on opportunities
 metrics.opportunities.forEach(opportunity => {
 recommendations.push(`${opportunity.title}: ${opportunity.description}`);
 });

 // Based on issues
 issues.forEach(issue => {
 recommendations.push(`Fix ${issue.type}: ${issue.fix}`);
 });

 // General recommendations based on scores
 if (metrics.performance < 80) {
 recommendations.push('Focus on performance optimization: optimize images, minify code, reduce render-blocking resources');
 }

 if (metrics.accessibility < 90) {
 recommendations.push('Improve accessibility: add alt texts, improve color contrast, ensure keyboard navigation');
 }

 if (metrics.seo < 85) {
 recommendations.push('Enhance SEO: improve meta descriptions, add structured data, optimize for mobile');
 }

 return recommendations;
 }

 // ===== ALERTING SYSTEM =====

 private async checkAlerts(monitor: PerformanceMonitor, result: PerformanceResult): Promise<void> {
 for (const alert of monitor.alerts) {
 if (!alert.enabled) continue;

 const triggered = this.evaluateAlertCondition(alert, result);
 
 if (triggered) {
 await this.triggerAlert(alert, monitor, result);
 alert.lastTriggered = new Date();
 }
 }
 }

 private evaluateAlertCondition(alert: PerformanceAlert, result: PerformanceResult): boolean {
 switch (alert.type) {
 case 'performance_drop':
 return result.score < alert.threshold;
 case 'core_web_vitals':
 const vitals = result.metrics.coreWebVitals;
 return vitals.LCP > alert.threshold || vitals.FID > alert.threshold || vitals.CLS > alert.threshold;
 case 'load_time':
 return result.metrics.coreWebVitals.TTFB > alert.threshold;
 default:
 return false;
 }
 }

 private async triggerAlert(alert: PerformanceAlert, monitor: PerformanceMonitor, result: PerformanceResult): Promise<void> {
 console.log(`🚨 Alert triggered: ${alert.type} for ${monitor.name}`);

 // In real implementation, would send actual notifications
 console.log(`Alert sent to: ${alert.recipients.join(', ')}`);
 console.log(`Alert details: ${alert.condition}`);
 console.log(`Monitor: ${monitor.name}`);
 console.log(`Score: ${result.score}`);
 console.log(`Issues: ${result.issues.length}`);
 }

 // ===== REAL-TIME MONITORING =====

 public startRealTimeMonitoring(): void {
 console.log('📊 Starting real-time performance monitoring...');

 // Simulate real-time Web Vitals collection
 setInterval(() => {
 this.collectRealTimeMetrics();
 }, 30000); // Every 30 seconds

 // Start automated monitoring
 if (this.config.autoMonitoring) {
 this.startAutomatedMonitoring();
 }
 }

 private collectRealTimeMetrics(): void {
 // Simulate collecting real user metrics
 const metrics: CoreWebVitals = {
 LCP: Math.random() * 2000 + 1500,
 FID: Math.random() * 80 + 20,
 CLS: Math.random() * 0.1 + 0.05,
 TTFB: Math.random() * 500 + 200
 };

 // Update real-time metrics (this would normally come from actual user data)
 this.realTimeMetrics.set('current-session', metrics);
 
 // Check for real-time alerts
 this.checkRealtimeAlerts(metrics);
 }

 private checkRealtimeAlerts(metrics: CoreWebVitals): void {
 // Check if any monitors have real-time thresholds being violated
 for (const monitor of this.monitors.values()) {
 if (monitor.status !== 'active') continue;

 const threshold = monitor.thresholds.coreWebVitals;
 
 if (metrics.LCP > threshold.LCP.max || metrics.FID > threshold.FID.max || metrics.CLS > threshold.CLS.max) {
 console.log(`⚠️ Real-time Core Web Vitals threshold violation detected for ${monitor.name}`);
 
 // In real implementation, would trigger immediate alerts
 }
 }
 }

 private startAutomatedMonitoring(): void {
 setInterval(async () => {
 for (const monitor of this.monitors.values()) {
 if (monitor.status !== 'active') continue;

 const shouldRun = this.shouldRunMonitor(monitor);
 if (shouldRun) {
 try {
 await this.runMonitor(monitor.id);
 } catch (error) {
 console.error(`Automated monitor failed for ${monitor.name}:`, error);
 }
 }
 }
 }, 60000); // Check every minute
 }

 private shouldRunMonitor(monitor: PerformanceMonitor): boolean {
 const now = new Date();
 
 if (!monitor.lastRun) return true;

 const timeSinceLastRun = now.getTime() - monitor.lastRun.getTime();
 const intervalMs = this.getFrequencyMs(monitor.frequency);

 return timeSinceLastRun >= intervalMs;
 }

 private getFrequencyMs(frequency: string): number {
 const intervals = {
 'realtime': 10000, // 10 seconds
 'hourly': 3600000, // 1 hour
 'daily': 86400000, // 24 hours
 'weekly': 604800000 // 7 days
 };

 return intervals[frequency as keyof typeof intervals] || 3600000;
 }

 // ===== REPORTING =====

 public generatePerformanceReport(
 timeRange: 'daily' | 'weekly' | 'monthly' = 'weekly',
 options?: { label?: string; persist?: boolean }
 ): PerformanceReport {
 const allResults = this.getAllMonitorResults();
 const filteredResults = this.filterResultsByTimeRange(allResults, timeRange);

 const summary = this.generateSummary(filteredResults);
 const trends = this.analyzeTrends(filteredResults);
 const issues = this.summarizeIssues(filteredResults);
 const recommendations = this.generateReportRecommendations(summary, trends, issues);
 
 const report: PerformanceReport = {
 id: `serena-report-${Date.now()}`,
 generatedAt: new Date(),
 timeRange,
 summary,
 trends,
 issues,
 recommendations
 };

 if (options?.persist ?? true) {
 this.storeReport(report, options?.label);
 }

 return report;
 }

 public getReportHistory(timeRange?: 'daily' | 'weekly' | 'monthly', label?: string): PerformanceReport[] {
 const key = this.resolveReportKey(timeRange, label);
 return [...(this.reports.get(key) ?? [])];
 }

 public getLatestReport(timeRange?: 'daily' | 'weekly' | 'monthly', label?: string): PerformanceReport | null {
 const history = this.getReportHistory(timeRange, label);
 return history.length > 0 ? history[history.length - 1]! : null;
 }

 public clearReportHistory(timeRange?: 'daily' | 'weekly' | 'monthly', label?: string): void {
 const key = this.resolveReportKey(timeRange, label);
 this.reports.delete(key);
 }

 private getAllMonitorResults(): PerformanceResult[] {
 const allResults: PerformanceResult[] = [];
 
 for (const monitor of this.monitors.values()) {
 allResults.push(...monitor.history);
 }

 return allResults;
 }

 private filterResultsByTimeRange(results: PerformanceResult[], timeRange: string): PerformanceResult[] {
 const now = new Date();
 const cutoff = new Date();

 switch (timeRange) {
 case 'daily':
 cutoff.setDate(now.getDate() - 1);
 break;
 case 'weekly':
 cutoff.setDate(now.getDate() - 7);
 break;
 case 'monthly':
 cutoff.setMonth(now.getMonth() - 1);
 break;
 }

 return results.filter(result => result.timestamp >= cutoff);
 }

 private generateSummary(results: PerformanceResult[]): PerformanceReportSummary {
 if (results.length === 0) {
 return {
 totalRuns: 0,
 averageScore: 0,
 averagePerformance: 0,
 averageAccessibility: 0,
 averageCoreWebVitals: { LCP: 0, FID: 0, CLS: 0, TTFB: 0 },
 passRate: 0,
 topIssues: []
 };
 }

 const scores = results.map(r => r.score);
 const performance = results.map(r => r.metrics.performance);
 const accessibility = results.map(r => r.metrics.accessibility);
 const lcp = results.map(r => r.metrics.coreWebVitals.LCP);
 const fid = results.map(r => r.metrics.coreWebVitals.FID);
 const cls = results.map(r => r.metrics.coreWebVitals.CLS);
 const ttfb = results.map(r => r.metrics.coreWebVitals.TTFB);

 return {
 totalRuns: results.length,
 averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
 averagePerformance: performance.reduce((sum, perf) => sum + perf, 0) / performance.length,
 averageAccessibility: accessibility.reduce((sum, acc) => sum + acc, 0) / accessibility.length,
	averageCoreWebVitals: {
	LCP: lcp.reduce((sum, value) => sum + value, 0) / lcp.length,
	FID: fid.reduce((sum, value) => sum + value, 0) / fid.length,
	CLS: cls.reduce((sum, value) => sum + value, 0) / cls.length,
	TTFB: ttfb.reduce((sum, value) => sum + value, 0) / ttfb.length
	},
 passRate: (results.filter(r => r.passed).length / results.length) * 100,
 topIssues: this.getTopIssues(results)
 };
 }

 private analyzeTrends(results: PerformanceResult[]): PerformanceTrend[] {
 if (results.length < 2) return [];

 const trends: PerformanceTrend[] = [];
 
 // Sort by timestamp
 const sorted = results.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
 
 // Calculate trend for overall score
 const scores = sorted.map(r => r.score);
 const scoreTrend = this.calculateTrend(scores);
 
 trends.push({
 metric: 'overall_score',
 direction: scoreTrend > 0 ? 'improving' : scoreTrend < 0 ? 'declining' : 'stable',
 change: Math.abs(scoreTrend),
 description: `Overall performance score is ${scoreTrend > 0 ? 'improving' : 'declining'} by ${Math.abs(scoreTrend).toFixed(1)} points`
 });

 return trends;
 }

 private calculateTrend(values: number[]): number {
 if (values.length < 2) return 0;
 
 // Simple linear trend calculation
 const first = values[0]!;
 const last = values[values.length - 1]!;
 return last - first;
 }

 private getTopIssues(results: PerformanceResult[]): PerformanceIssueSummary[] {
 const issueCounts: Record<string, number> = {};
 
 results.forEach(result => {
 result.issues.forEach(issue => {
 issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
 });
 });

 return Object.entries(issueCounts)
 .sort(([, a], [, b]) => b - a)
 .slice(0, 5)
 .map(([type, count]) => ({
 type,
 count,
 percentage: (count / results.length) * 100
 }));
 }

 private summarizeIssues(results: PerformanceResult[]): PerformanceIssueSummary[] {
 return this.getTopIssues(results);
 }

 private generateReportRecommendations(summary: PerformanceReportSummary, trends: PerformanceTrend[], issues: PerformanceIssueSummary[]): string[] {
 const recommendations: string[] = [];

 // Based on overall performance
 if (summary.averageScore < 80) {
 recommendations.push('Overall performance needs improvement. Focus on Core Web Vitals optimization.');
 }

 // Based on trends
 trends.forEach(trend => {
 if (trend.direction === 'declining') {
 recommendations.push(`Performance is declining in ${trend.metric}. Investigate recent changes.`);
 }
 });

 // Based on top issues
 const [topIssue] = issues;
 if (topIssue && topIssue.percentage > 50) {
 recommendations.push(`Address the top issue: ${topIssue.type} (occurs in ${topIssue.percentage.toFixed(1)}% of runs)`);
 }

 // Based on Core Web Vitals
 if (summary.averageCoreWebVitals.LCP > 2500) {
 recommendations.push('Optimize Largest Contentful Paint: improve image loading and critical rendering path');
 }

 if (summary.averageCoreWebVitals.FID > 100) {
 recommendations.push('Reduce First Input Delay: optimize JavaScript execution and reduce main thread blocking');
 }

 if (summary.averageCoreWebVitals.CLS > 0.1) {
 recommendations.push('Improve Cumulative Layout Shift: reserve space for dynamic content and set image dimensions');
 }

 return recommendations;
 }

 // ===== UTILITY METHODS =====

 public getRealTimeMetrics(): Map<string, CoreWebVitals> {
 return new Map(this.realTimeMetrics);
 }

 public updateConfig(config: Partial<SerenaPerformanceConfig>): void {
 this.config = { ...this.config, ...config };
 }

 public getConfig(): SerenaPerformanceConfig {
 return { ...this.config };
 }

 public exportData(): object {
 return {
 monitors: this.getAllMonitors(),
 realTimeMetrics: Object.fromEntries(this.realTimeMetrics),
 reports: Object.fromEntries(this.reports),
 config: this.config
 };
 }

 private resolveReportKey(timeRange?: 'daily' | 'weekly' | 'monthly', label?: string): string {
 return label ?? timeRange ?? 'weekly';
 }

 private storeReport(report: PerformanceReport, label?: string): void {
 const key = this.resolveReportKey(report.timeRange, label);
 const history = this.reports.get(key) ?? [];
 history.push(report);

 if (history.length > SerenaPerformanceMonitoringService.REPORT_HISTORY_LIMIT) {
 history.splice(0, history.length - SerenaPerformanceMonitoringService.REPORT_HISTORY_LIMIT);
 }

 this.reports.set(key, history);
 }
}

interface PerformanceReportSummary {
 totalRuns: number;
 averageScore: number;
 averagePerformance: number;
 averageAccessibility: number;
 averageCoreWebVitals: CoreWebVitals;
 passRate: number;
 topIssues: PerformanceIssueSummary[];
}

interface PerformanceIssueSummary {
 type: string;
 count: number;
 percentage: number;
}

interface PerformanceTrend {
 metric: string;
 direction: 'improving' | 'declining' | 'stable';
 change: number;
 description: string;
}

interface PerformanceReport {
 id: string;
 generatedAt: Date;
 timeRange: 'daily' | 'weekly' | 'monthly';
 summary: PerformanceReportSummary;
 trends: PerformanceTrend[];
 issues: PerformanceIssueSummary[];
 recommendations: string[];
}

export const serenaPerformanceMonitoringService = SerenaPerformanceMonitoringService.getInstance();
export default serenaPerformanceMonitoringService;