/**
 * 🤖 Autonomous SEO System - Selbstlernendes SEO mit Machine Learning
 * Automatische Keyword-Recherche, Content-Optimierung & Ranking-Verbesserung
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface KeywordResearch {
 keyword: string;
 searchVolume: number;
 competitionLevel: 'low' | 'medium' | 'high';
 cpc: number;
 intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
 trend: 'rising' | 'stable' | 'falling';
 difficulty: number; // 0-100
 opportunity: number; // 0-100
 lastUpdated: Date;
}

interface ContentOptimization {
 pageUrl: string;
 pageTitle: string;
 metaDescription: string;
 currentKeywords: string[];
 targetKeywords: string[];
 optimizationScore: number; // 0-100
 suggestions: Array<{
 type: 'keyword' | 'structure' | 'meta' | 'content' | 'technical';
 priority: 'high' | 'medium' | 'low';
 description: string;
 action: string;
 impact: number; // 0-100%
 }>;
 lastOptimized: Date;
}

interface RankingAnalysis {
 keyword: string;
 currentPosition: number;
 targetPosition: number;
 previousPosition: number;
 movement: number;
 competitionAnalysis: Array<{
 url: string;
 position: number;
 title: string;
 domainAuthority: number;
 contentQuality: number;
 backlinks: number;
 }>;
 serpFeatures: Array<'featured-snippet' | 'people-also-ask' | 'video' | 'local-pack'>;
 opportunities: string[];
}

interface SEOPrediction {
 timeframe: '7d' | '30d' | '90d' | '180d';
 keyword: string;
 currentRank: number;
 predictedRank: number;
 confidence: number; // 0-100
 factors: Array<{
 type: string;
 impact: number;
 description: string;
 action: string;
 }>;
 riskFactors: Array<{
 type: string;
 probability: number;
 impact: number;
 mitigation: string;
 }>;
}

interface MLModel {
 id: string;
 name: string;
 type: 'keyword-research' | 'content-optimization' | 'ranking-prediction' | 'competitor-analysis';
 accuracy: number; // 0-100
 trainingDataSize: number;
 lastTrained: Date;
 performance: {
 precision: number;
 recall: number;
 f1Score: number;
 };
 isActive: boolean;
}

interface AutonomousTask {
 id: string;
 type: 'keyword-analysis' | 'content-generation' | 'technical-audit' | 'competitor-monitoring' | 'ranking-improvement';
 status: 'pending' | 'running' | 'completed' | 'failed';
 priority: 'low' | 'medium' | 'high' | 'critical';
 description: string;
 progress: number; // 0-100
 createdAt: Date;
 completedAt?: Date;
 results?: any;
}

const AutonomousSEOSystem: React.FC = () => {
 const [isRunning, setIsRunning] = useState(false);
 const [mlModels, setMlModels] = useState<MLModel[]>([]);
 const [keywordResearch, setKeywordResearch] = useState<KeywordResearch[]>([]);
 const [contentOptimizations, setContentOptimizations] = useState<ContentOptimization[]>([]);
 const [rankingAnalysis, setRankingAnalysis] = useState<RankingAnalysis[]>([]);
 const [seoPredictions, setSeoPredictions] = useState<SEOPrediction[]>([]);
 const [activeTasks, setActiveTasks] = useState<AutonomousTask[]>([]);
 const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '180d'>('30d');
 const [isTraining, setIsTraining] = useState(false);
 const [lastOptimization, setLastOptimization] = useState<Date | null>(null);

 const intervalRef = useRef<NodeJS.Timeout | null>(null);

 // Initialize Autonomous SEO System
 useEffect(() => {
 initializeAutonomousSEOSystem();

 return () => {
 if (intervalRef.current) {
 clearInterval(intervalRef.current);
 }
 };
 }, []);

 const initializeAutonomousSEOSystem = async () => {
 setIsRunning(true);

 try {
 await Promise.all([
 loadMLModels(),
 performKeywordResearch(),
 analyzeContentOptimization(),
 conductRankingAnalysis(),
 generateSEOPredictions(),
 setupAutonomousTasks()
 ]);

 // Start continuous optimization cycle
 startOptimizationCycle();

 } catch (error) {
 console.error('Autonomous SEO System initialization failed:', error);
 } finally {
 setIsRunning(false);
 }
 };

 // Load ML Models
 const loadMLModels = async () => {
 const mockModels: MLModel[] = [
 {
 id: 'keyword-predictor-v2',
 name: 'Google Keyword Predictor v2',
 type: 'keyword-research',
 accuracy: 94.2,
 trainingDataSize: 250000,
 lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
 performance: {
 precision: 0.92,
 recall: 0.89,
 f1Score: 0.90
 },
 isActive: true
 },
 {
 id: 'content-optimizer-v1',
 name: 'Content Quality Optimizer v1',
 type: 'content-optimization',
 accuracy: 91.7,
 trainingDataSize: 180000,
 lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
 performance: {
 precision: 0.89,
 recall: 0.93,
 f1Score: 0.91
 },
 isActive: true
 },
 {
 id: 'ranking-predictor-v3',
 name: 'Ranking Prediction Engine v3',
 type: 'ranking-prediction',
 accuracy: 88.3,
 trainingDataSize: 120000,
 lastTrained: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
 performance: {
 precision: 0.87,
 recall: 0.85,
 f1Score: 0.86
 },
 isActive: true
 },
 {
 id: 'competitor-analyzer-v1',
 name: 'Competitor Intelligence v1',
 type: 'competitor-analysis',
 accuracy: 86.5,
 trainingDataSize: 95000,
 lastTrained: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
 performance: {
 precision: 0.84,
 recall: 0.82,
 f1Score: 0.83
 },
 isActive: false // Training mode
 }
 ];
 setMlModels(mockModels);
 };

 // Perform Keyword Research
 const performKeywordResearch = async () => {
 const mockKeywords: KeywordResearch[] = [
 {
 keyword: 'solaranlage kosten',
 searchVolume: 3200,
 competitionLevel: 'high',
 cpc: 2.45,
 intent: 'commercial',
 trend: 'rising',
 difficulty: 78,
 opportunity: 92,
 lastUpdated: new Date()
 },
 {
 keyword: 'photovoltaik erfahrungen',
 searchVolume: 2800,
 competitionLevel: 'medium',
 cpc: 1.80,
 intent: 'informational',
 trend: 'stable',
 difficulty: 65,
 opportunity: 88,
 lastUpdated: new Date()
 },
 {
 keyword: 'solaranbieter vergleich',
 searchVolume: 1900,
 competitionLevel: 'high',
 cpc: 3.20,
 intent: 'commercial',
 trend: 'rising',
 difficulty: 82,
 opportunity: 85,
 lastUpdated: new Date()
 },
 {
 keyword: 'agri photovoltaik förderung',
 searchVolume: 1200,
 competitionLevel: 'low',
 cpc: 0.95,
 intent: 'informational',
 trend: 'rising',
 difficulty: 42,
 opportunity: 95,
 lastUpdated: new Date()
 },
 {
 keyword: 'solaranlage rechner',
 searchVolume: 4500,
 competitionLevel: 'medium',
 cpc: 1.50,
 intent: 'transactional',
 trend: 'stable',
 difficulty: 58,
 opportunity: 90,
 lastUpdated: new Date()
 }
 ];
 setKeywordResearch(mockKeywords);
 };

 // Analyze Content Optimization
 const analyzeContentOptimization = async () => {
 const mockOptimizations: ContentOptimization[] = [
 {
 pageUrl: '/solar-rechner',
 pageTitle: 'Solaranlage Rechner 2024: Kosten & Ertrag berechnen | ZOE Solar',
 metaDescription: 'Professioneller Solarrechner: Berechnen Sie Kosten, Ertrag & Amortisation Ihrer Photovoltaikanlage. ✓ 100% Kostenlos ✓ Sofort Ergebnisse.',
 currentKeywords: ['solarrechner', 'photovoltaik', 'kosten', 'ertrag'],
 targetKeywords: ['solaranlage kosten', 'photovoltaik rechner', 'solaranlage amortisation', 'pv rechner'],
 optimizationScore: 76,
 suggestions: [
 {
 type: 'keyword',
 priority: 'high',
 description: 'Untergeordnete Keywords entdeckt',
 action: 'Füge "solaranlage amortisation" und "pv rechner" hinzu',
 impact: 15
 },
 {
 type: 'meta',
 priority: 'high',
 description: 'Meta Description könnte optimiert werden',
 action: 'Füge LSI-Keywords und E-A-Tags hinzu',
 impact: 20
 }
 ],
 lastOptimized: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
 },
 {
 pageUrl: '/agri-pv',
 pageTitle: 'Agri-PV: Agrarphotovoltaik für Landwirte | ZOE Solar',
 metaDescription: 'Gewinnbringende Agrar-Photovoltaik für landwirtschaftliche Betriebe. Förderungen, Wirtschaftlichkeit und Planung.',
 currentKeywords: ['agri-pv', 'agrarpv', 'landwirtschaft'],
 targetKeywords: ['agrarpv förderung', 'agri photovoltaik wirtschaftlichkeit', 'dachfreie anlage landwirtschaft'],
 optimizationScore: 68,
 suggestions: [
 {
 type: 'content',
 priority: 'high',
 description: 'Fehlende Inhalte zu Förderung',
 action: 'Erstelle Abschnitte zur EEG-Förderung und Wirtschaftlichkeitsberechnung',
 impact: 25
 },
 {
 type: 'technical',
 priority: 'medium',
 description: 'Strukturierte Daten können verbessert werden',
 action: 'Füge Agriculture JSON-LD Schema hinzu',
 impact: 18
 }
 ],
 lastOptimized: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
 }
 ];
 setContentOptimizations(mockOptimizations);
 };

 // Conduct Ranking Analysis
 const conductRankingAnalysis = async () => {
 const mockRanking: RankingAnalysis[] = [
 {
 keyword: 'solaranlage kosten',
 currentPosition: 12,
 targetPosition: 5,
 previousPosition: 15,
 movement: 3,
 competitionAnalysis: [
 {
 url: 'https://solaranbieter-beispiel.de',
 position: 1,
 title: 'Solaranlage Kosten 2024: Aktuelle Preise & Förderung',
 domainAuthority: 65,
 contentQuality: 92,
 backlinks: 245
 },
 {
 url: 'https://konkurrent2.de',
 position: 8,
 title: 'Photovoltaik Kosten | Solaranlagen Preise',
 domainAuthority: 58,
 contentQuality: 85,
 backlinks: 189
 }
 ],
 serpFeatures: ['featured-snippet', 'people-also-ask'],
 opportunities: [
 'Featured Snippet für "Wie viel kostet eine Solaranlage?"',
 'Verbessere Content-Qualität um Top 5 zu erreichen',
 'Local Pack für lokale Suchanfragen optimieren'
 ]
 },
 {
 keyword: 'solaranbieter vergleich',
 currentPosition: 18,
 targetPosition: 8,
 previousPosition: 22,
 movement: 4,
 competitionAnalysis: [
 {
 url: 'https://vergleichs-anbieter.de',
 position: 3,
 title: 'Solaranbieter Vergleich: Test & Vergleich 2024',
 domainAuthority: 72,
 contentQuality: 88,
 backlinks: 312
 },
 {
 url: 'https://solar-vergleich.com',
 position: 12,
 title: 'Die besten Solaranbieter im Vergleich',
 domainAuthority: 61,
 contentQuality: 79,
 backlinks: 201
 }
 ],
 serpFeatures: ['people-also-ask'],
 opportunities: [
 'Tabellarischer Vergleich für Featured Snippet optimieren',
 'Vergleichstabellen mit realen Daten erstellen',
 'Local Pack für regionale Anbieter'
 ]
 }
 ];
 setRankingAnalysis(mockRanking);
 };

 // Generate SEO Predictions
 const generateSEOPredictions = async () => {
 const timeframes: SEOPrediction['timeframe'][] = ['7d', '30d', '90d', '180d'];
 const mockPredictions: SEOPrediction[] = [];

 for (const timeframe of timeframes) {
 for (const ranking of rankingAnalysis) {
 const baseRank = ranking.currentPosition;
 const targetRank = ranking.targetPosition;
 const trend = ranking.movement > 0 ? 'improving' : 'stable';

 // ML-based prediction logic
 let predictedRank = baseRank;
 let confidence = 75;

 // Factors affecting ranking
 const factors: Array<{
 type: string;
 impact: number;
 description: string;
 action: string;
 }> = [];

 if (trend === 'improving') {
 factors.push({
 type: 'Positive Trend',
 impact: -2,
 description: 'Bisherige positive Bewegung',
 action: 'Trend beibehalten und verstärken'
 });
 predictedRank -= 1;
 confidence += 10;
 }

 // Random market fluctuation
 const marketFluctuation = (Math.random() - 0.5) * 4;
 predictedRank += Math.round(marketFluctuation);
 confidence -= 5;

 // Seasonal factors
 const seasonalFactor = timeframe === '7d' ? 0 : timeframe === '30d' ? 1 : timeframe === '90d' ? 2 : timeframe === '180d' ? 3 : 0;
 predictedRank -= seasonalFactor;
 confidence -= seasonalFactor * 2;

 // Ensure ranking stays within bounds
 predictedRank = Math.max(1, Math.min(50, predictedRank));

 // Generate risk factors
 const riskFactors: Array<{
 type: string;
 probability: number;
 impact: number;
 mitigation: string;
 }> = [];

 if (Math.random() > 0.6) {
 riskFactors.push({
 type: 'Algorithm Update',
 probability: 15 + Math.random() * 20,
 impact: 3,
 mitigation: 'Content schnell anpassen'
 });
 }

 if (Math.random() > 0.8) {
 riskFactors.push({
 type: 'Competition Improvement',
 probability: 10 + Math.random() * 15,
 impact: 2,
 mitigation: 'Proaktive SEO überwachen'
 });
 }

 mockPredictions.push({
 timeframe,
 keyword: ranking.keyword,
 currentRank: baseRank,
 predictedRank,
 confidence,
 factors,
 riskFactors
 });
 }
 }

 setSeoPredictions(mockPredictions);
 };

 // Setup Autonomous Tasks
 const setupAutonomousTasks = () => {
 const mockTasks: AutonomousTask[] = [
 {
 id: 'task-001',
 type: 'keyword-analysis',
 status: 'completed',
 priority: 'high',
 description: 'Automatische Keyword-Recherche mit ML-Modellen',
 progress: 100,
 createdAt: new Date(Date.now() - 30 * 60 * 1000),
 completedAt: new Date(Date.now() - 5 * 60 * 1000),
 results: { keywordsFound: 47, opportunitiesIdentified: 12 }
 },
 {
 id: 'task-002',
 type: 'content-generation',
 status: 'running',
 priority: 'medium',
 description: 'KI-gestützte Content-Erstellung für neue Keywords',
 progress: 45,
 createdAt: new Date(Date.now() - 45 * 60 * 1000)
 },
 {
 id: 'task-003',
 type: 'technical-audit',
 status: 'pending',
 priority: 'medium',
 description: 'Technisches SEO-Audit mit automatischen Korrekturen',
 progress: 0,
 createdAt: new Date()
 },
 {
 id: 'task-004',
 type: 'competitor-monitoring',
 status: 'pending',
 priority: 'low',
 description: 'Konkurrenz-Monitoring mit Verfolgung von Änderungen',
 progress: 0,
 createdAt: new Date()
 },
 {
 id: 'task-005',
 type: 'ranking-improvement',
 status: 'pending',
 priority: 'high',
 description: 'Automatische Ranking-Verbesserung basierend auf Analysen',
 progress: 0,
 createdAt: new Date()
 }
 ];
 setActiveTasks(mockTasks);
 };

 // Start Optimization Cycle
 const startOptimizationCycle = () => {
 intervalRef.current = setInterval(() => {
 performAutonomousOptimization();
 }, 24 * 60 * 60 * 1000); // Run daily
 };

 // Perform Autonomous Optimization
 const performAutonomousOptimization = async () => {
 setIsRunning(true);
 setLastOptimization(new Date());

 try {
 // Update all data sources
 await Promise.all([
 performKeywordResearch(),
 analyzeContentOptimization(),
 conductRankingAnalysis(),
 generateSEOPredictions()
 ]);

 // Execute pending tasks
 await processAutonomousTasks();

 } catch (error) {
 console.error('Autonomous optimization failed:', error);
 } finally {
 setIsRunning(false);
 }
 };

 // Process Autonomous Tasks
 const processAutonomousTasks = async () => {
 setActiveTasks(prev => {
 return prev.map(task => {
 if (task.status === 'pending') {
 // Simulate task execution
 setTimeout(() => {
 setActiveTasks(current =>
 current.map(t =>
 t.id === task.id
 ? { ...t, status: 'running', progress: Math.min(100, t.progress + 25) }
 : t
 )
 );
 }, Math.random() * 5000);

 // Complete task after delay
 setTimeout(() => {
 setActiveTasks(current =>
 current.map(t =>
 t.id === task.id
 ? { ...t, status: 'completed', progress: 100, completedAt: new Date() }
 : t
 )
 );
 }, Math.random() * 30000);

 return { ...task, status: 'running' };
 }
 return task;
 });
 });
 };

 // Train ML Model
 const trainMLModel = async (modelId: string) => {
 setIsTraining(true);

 try {
 // Simulate training process
 await new Promise(resolve => setTimeout(resolve, 10000));

 setMlModels(prev => prev.map(model =>
 model.id === modelId
 ? {
 ...model,
 lastTrained: new Date(),
 accuracy: Math.min(99, model.accuracy + Math.random() * 2),
 performance: {
 precision: Math.min(0.99, model.performance.precision + Math.random() * 0.03),
 recall: Math.min(0.99, model.performance.recall + Math.random() * 0.03),
 f1Score: Math.min(0.99, model.performance.f1Score + Math.random() * 0.02)
 }
 }
 : model
 ));

 console.log(`ML Model ${modelId} trained successfully`);
 } catch (error) {
 console.error('ML Model training failed:', error);
 } finally {
 setIsTraining(false);
 }
 };

 // Get Priority Color
 const getPriorityColor = (priority: string): string => {
 switch (priority) {
 case 'critical': return 'bg-red-100 text-red-800';
 case 'high': return 'bg-orange-100 text-orange-800';
 case 'medium': return 'bg-yellow-100 text-yellow-800';
 case 'low': return 'bg-green-100 text-green-800';
 default: return 'bg-gray-100 text-gray-800';
 }
 };

 // Get Status Color
 const getStatusColor = (status: string): string => {
 switch (status) {
 case 'completed': return 'bg-green-100 text-green-800';
 case 'running': return 'bg-blue-100 text-blue-800';
 case 'pending': return 'bg-gray-100 text-gray-800';
 case 'failed': return 'bg-red-100 text-red-800';
 default: return 'bg-gray-100 text-gray-800';
 }
 };

 // Format Number
 const formatNumber = (num: number): string => {
 return num.toLocaleString('de-DE');
 };

 return (
 <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
 <div className="mb-6">
 <h1 className="text-3xl font-bold text-gray-900 mb-2">
 🤖 Autonomous SEO System
 </h1>
 <p className="text-gray-600">
 Selbstlernendes SEO mit Machine Learning, automatischer Keyword-Recherche & Ranking-Verbesserung
 </p>
 </div>

 {/* ML Models Status */}
 <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8">
 <h2 className="text-xl font-bold text-gray-900 mb-4">🧠 ML Modelle</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {mlModels.map((model) => (
 <div key={model.id} className="bg-white rounded-lg p-4 border border-gray-200">
 <div className="flex items-center justify-between mb-3">
 <h3 className="font-semibold text-gray-900">{model.name}</h3>
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
 model.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
 }`}>
 {model.isActive ? 'Aktiv' : 'Inaktiv'}
 </span>
 </div>

 <div className="space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-gray-600">Typ:</span>
 <span className="font-medium capitalize">{model.type.replace('-', ' ')}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">Accuracy:</span>
 <span className="font-medium">{model.accuracy}%</span>
 </div>
 <div className="flex justify-between">
 <span className="text-600">Training Data:</span>
 <span className="font-medium">{formatNumber(model.trainingDataSize)}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">F1 Score:</span>
 <span className="font-medium">{model.performance.f1Score.toFixed(2)}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">Last Trained:</span>
 <span className="font-medium">{model.lastTrained.toLocaleDateString()}</span>
 </div>
 </div>

 {!model.isActive && (
 <button
 onClick={() => trainMLModel(model.id)}
 disabled={isTraining}
 className="mt-3 w-full px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
 >
 {isTraining ? 'Training...' : 'Train Model'}
 </button>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* System Status */}
 <div className="flex items-center justify-between mb-8">
 <h2 className="text-xl font-bold text-gray-900">System Status</h2>
 <div className="flex items-center space-x-4">
 <div className="flex items-center space-x-2">
 <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-blue-500' : 'bg-gray-400'}`} />
 <span className="text-sm font-medium">
 {isRunning ? 'Running' : 'Idle'}
 </span>
 </div>
 <div className="text-sm text-gray-600">
 Last Optimization: {lastOptimization?.toLocaleString() || 'Never'}
 </div>
 </div>
 </div>

 {/* Keyword Research Results */}
 <div className="mb-8">
 <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Keyword Research</h2>
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Keyword
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Volume
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Competition
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Trend
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Opportunity
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Difficulty
 </th>
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {keywordResearch.map((keyword, index) => (
 <tr key={index}>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className="font-medium text-gray-900">{keyword.keyword}</span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
 {formatNumber(keyword.searchVolume)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`px-2 py-1 text-xs rounded font-medium ${
 keyword.competitionLevel === 'low' ? 'bg-green-100 text-green-800' :
 keyword.competitionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
 'bg-red-100 text-red-800'
 }`}>
 {keyword.competitionLevel}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`text-sm font-medium ${
 keyword.trend === 'rising' ? 'text-green-600' :
 keyword.trend === 'falling' ? 'text-red-600' :
 'text-gray-600'
 }`}>
 {keyword.trend === 'rising' ? '↗' : keyword.trend === 'falling' ? '↘' : '→'}
 {keyword.trend}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className="font-bold text-blue-600">{keyword.opportunity}%</span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className="text-sm text-gray-900">{keyword.difficulty}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Content Optimization */}
 <div className="mb-8">
 <h2 className="text-xl font-bold text-gray-900 mb-4">✏️ Content Optimization</h2>
 <div className="space-y-4">
 {contentOptimizations.map((optimization, index) => (
 <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
 <div className="flex items-start justify-between mb-4">
 <div>
 <h3 className="font-semibold text-gray-900">
 {optimization.pageUrl}
 </h3>
 <p className="text-sm text-gray-600 mt-1">{optimization.metaDescription}</p>
 <div className="flex items-center space-x-2 mt-2">
 <span className="text-sm text-gray-600">Score:</span>
 <div className="flex items-center">
 <div className="w-32 bg-gray-200 rounded-full h-2">
 <div
 className="h-2 bg-blue-600 rounded-full transition-all duration-500"
 style={{ width: `${optimization.optimizationScore}%` }}
 />
 </div>
 <span className="ml-2 text-sm font-medium">
 {optimization.optimizationScore}%
 </span>
 </div>
 </div>
 </div>
 <div className="text-xs text-gray-500">
 Optimized: {optimization.lastOptimized.toLocaleDateString()}
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-3">Target Keywords</h4>
 <div className="space-y-1">
 {optimization.targetKeywords.map((keyword, idx) => (
 <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mr-2 mb-1">
 {keyword}
 </span>
 ))}
 </div>
 </div>

 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-3">Optimization Suggestions</h4>
 <div className="space-y-2">
 {optimization.suggestions.slice(0, 3).map((suggestion, idx) => (
 <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded p-3">
 <div className="flex items-center justify-between mb-1">
 <span className="text-xs font-medium text-yellow-800">{suggestion.type}</span>
 <span className={`px-1 py-1 text-xs rounded ${
 suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
 suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
 'bg-green-100 text-green-800'
 }`}>
 {suggestion.priority}
 </span>
 </div>
 <p className="text-sm text-gray-700">{suggestion.description}</p>
 <p className="text-xs text-gray-600 mt-1">{suggestion.action}</p>
 <div className="text-xs text-gray-500">Impact: +{suggestion.impact}%</div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Ranking Analysis */}
 <div className="mb-8">
 <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Ranking Analysis</h2>
 <div className="space-y-4">
 {rankingAnalysis.map((analysis, index) => (
 <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
 <div className="flex items-start justify-between mb-4">
 <div>
 <h3 className="font-semibold text-gray-900">{analysis.keyword}</h3>
 <div className="flex items-center space-x-4 mt-2">
 <div className="text-sm">
 <span className="text-gray-600">Current:</span>
 <span className="font-bold text-blue-600 ml-1">#{analysis.currentPosition}</span>
 </div>
 <div className="text-sm">
 <span className="text-gray-600">Target:</span>
 <span className="font-bold text-green-600 ml-1">#{analysis.targetPosition}</span>
 </div>
 <div className="text-sm">
 <span className="text-gray-600">Movement:</span>
 <span className={`font-bold ml-1 ${
 analysis.movement > 0 ? 'text-green-600' :
 analysis.movement < 0 ? 'text-red-600' : 'text-gray-600'
 }`}>
 {analysis.movement > 0 ? '↑' : analysis.movement < 0 ? '↓' : '→'} {Math.abs(analysis.movement)}
 </span>
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-3">SERP Features</h4>
 <div className="flex flex-wrap gap-2">
 {analysis.serpFeatures.map((feature, idx) => (
 <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
 {feature}
 </span>
 ))}
 </div>
 </div>

 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-3">Top Opportunities</h4>
 <div className="space-y-1">
 {analysis.opportunities.slice(0, 3).map((opportunity, idx) => (
 <div key={idx} className="text-sm text-gray-600">• {opportunity}</div>
 ))}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* SEO Predictions */}
 <div className="mb-8">
 <h2 className="text-xl font-bold text-gray-900 mb-4">🔮 SEO Predictions</h2>
 <div className="flex items-center justify-end mb-4">
 <label className="mr-2">Timeframe:</label>
 <select
 value={selectedTimeframe}
 onChange={(e) => setSelectedTimeframe(e.target.value as any)}
 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
 >
 <option value="7d">7 Tage</option>
 <option value="30d">30 Tage</option>
 <option value="90d">90 Tage</option>
 <option value="180d">180 Tage</option>
 </select>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {seoPredictions
 .filter(prediction => prediction.timeframe === selectedTimeframe)
 .map((prediction, index) => (
 <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold text-gray-900">{prediction.keyword}</h3>
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
 prediction.confidence >= 90 ? 'bg-green-100 text-green-800' :
 prediction.confidence >= 80 ? 'bg-yellow-100 text-yellow-800' :
 'bg-red-100 text-red-800'
 }`}>
 {prediction.confidence}% Confidence
 </span>
 </div>

 <div className="space-y-3">
 <div className="flex justify-between text-sm">
 <span className="text-gray-600">Current Rank:</span>
 <span className="font-medium">#{prediction.currentRank}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-gray-600">Predicted Rank:</span>
 <span className="font-medium text-blue-600">#{prediction.predictedRank}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-gray-600">Movement:</span>
 <span className={`font-medium ${
 prediction.predictedRank < prediction.currentRank ? 'text-green-600' : 'text-red-600'
 }`}>
 {prediction.predictedRank < prediction.currentRank ? '↑' : '↓'} {Math.abs(prediction.predictedRank - prediction.currentRank)}
 </span>
 </div>
 </div>

 {prediction.factors.length > 0 && (
 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-2">Ranking Factors</h4>
 <div className="space-y-2">
 {prediction.factors.slice(0, 2).map((factor, factorIndex) => (
 <div key={factorIndex} className="bg-blue-50 border border-blue-200 rounded p-2">
 <div className="flex justify-between text-sm">
 <span className="text-blue-900">{factor.type}</span>
 <span className="text-blue-600 text-xs">({factor.impact > 0 ? '+' : ''}{factor.impact})</span>
 </div>
 <p className="text-xs text-blue-700 mt-1">{factor.description}</p>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Autonomous Tasks */}
 <div className="mb-8">
 <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 Autonomous Tasks</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {activeTasks.map((task) => (
 <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center space-x-2">
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
 {task.status}
 </span>
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
 {task.priority}
 </span>
 </div>
 <div className="text-xs text-gray-500">
 {task.createdAt.toLocaleString()}
 </div>
 </div>

 <p className="text-sm text-gray-700 mb-4">{task.description}</p>

 {task.status === 'running' && (
 <div className="mb-4">
 <div className="flex justify-between text-sm text-gray-600 mb-2">
 <span>Progress:</span>
 <span className="font-medium">{task.progress}%</span>
 </div>
 <div className="w-full bg-gray-200 rounded-full h-2">
 <div
 className="bg-blue-600 h-2 rounded-full transition-all duration-500"
 style={{ width: `${task.progress}%` }}
 />
 </div>
 </div>
 )}

 {task.results && (
 <div className="mt-4 pt-4 border-t border-gray-200">
 <div className="text-xs text-gray-600">Results:</div>
 <div className="text-sm text-gray-700">
 {typeof task.results === 'object' ? JSON.stringify(task.results, null, 2) : task.results.toString()}
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Performance Summary */}
 <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
 <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Performance Summary</h2>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div className="text-center">
 <div className="text-3xl font-bold text-green-600">{formatNumber(47)}</div>
 <div className="text-sm text-gray-600">Keywords Tracked</div>
 </div>
 <div className="text-center">
 <div className="text-3xl font-bold text-blue-600">71%</div>
 <div className="text-sm text-gray-600">Avg Optimization Score</div>
 </div>
 <div className="text-center">
 <div className="text-3xl font-bold text-purple-600">12</div>
 <div className="text-sm text-gray-600">Active Tasks</div>
 </div>
 <div className="text-center">
 <div className="text-3xl font-bold text-orange-600">88%</div>
 <div className="text-sm text-gray-600">Prediction Accuracy</div>
 </div>
 </div>

 <div className="mt-6 p-4 bg-white bg-opacity-50 rounded-lg">
 <p className="text-sm text-gray-700 text-center">
 <span className="font-semibold">🎯 Next Auto-Optimization:</span> {lastOptimization ?
 new Date(lastOptimization.getTime() + 24 * 60 * 60 * 1000).toLocaleString() :
 'Running now...'}
 </p>
 </div>
 </div>
 </div>
 );
};

export default AutonomousSEOSystem;