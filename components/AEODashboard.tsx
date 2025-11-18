/**
 * AEO Dashboard Component für ZOE Solar
 * 
 * Zentrales Dashboard zur Überwachung und Verwaltung aller
 * Authoritative Entity Optimization (AEO) Metriken und Systeme
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Users, 
  Globe, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Target,
  Award,
  Shield,
  Link,
  Eye,
  Zap
} from 'lucide-react';

// Import AEO Services
import { entityKnowledgeGraphService } from '../services/entityKnowledgeGraphService';
import { eatSignalEnhancementService } from '../services/eatSignalEnhancementService';
import { aeoStructuredDataService } from '../services/aeoStructuredDataService';
import { brandAuthorityBuildingService } from '../services/brandAuthorityBuildingService';
import { crossPlatformEntityConsistencyService } from '../services/crossPlatformEntityConsistencyService';

// ===== INTERFACES =====

interface DashboardMetrics {
  entityAuthority: {
    score: number;
    level: string;
    change: number;
    entities: number;
  };
  eatSignals: {
    expertiseScore: number;
    authoritativenessScore: number;
    trustworthinessScore: number;
    overallScore: number;
    totalSignals: number;
  };
  structuredData: {
    implementations: number;
    coverage: number;
    errors: number;
    richResults: number;
  };
  brandAuthority: {
    score: number;
    level: string;
    socialProof: number;
    industryRecognition: number;
  };
  platformConsistency: {
    overallScore: number;
    platforms: number;
    issues: number;
    syncOperations: number;
  };
}

interface AlertData {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  actionRequired: boolean;
  relatedSystem: string;
}

// ===== MAIN COMPONENT =====

const AEODashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'entities' | 'eat' | 'schema' | 'brand' | 'platforms'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ===== DATA FETCHING =====

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Sammle Metriken von allen Services
      const [
        entityMetrics,
        eatMetrics,
        schemaMetrics,
        brandMetrics,
        platformMetrics
      ] = await Promise.all([
        fetchEntityMetrics(),
        fetchEATMetrics(),
        fetchSchemaMetrics(),
        fetchBrandMetrics(),
        fetchPlatformMetrics()
      ]);

      setMetrics({
        entityAuthority: entityMetrics,
        eatSignals: eatMetrics,
        structuredData: schemaMetrics,
        brandAuthority: brandMetrics,
        platformConsistency: platformMetrics
      });

      // Generiere Alerts basierend auf Metriken
      generateAlerts({
        entityAuthority: entityMetrics,
        eatSignals: eatMetrics,
        structuredData: schemaMetrics,
        brandAuthority: brandMetrics,
        platformConsistency: platformMetrics
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setAlerts(prev => [...prev, {
        id: `error-${Date.now()}`,
        type: 'error',
        title: 'Daten-Fehler',
        message: 'Dashboard-Daten konnten nicht geladen werden',
        timestamp: new Date(),
        actionRequired: true,
        relatedSystem: 'dashboard'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityMetrics = async () => {
    const graph = entityKnowledgeGraphService.getKnowledgeGraph();
    const entityCount = Object.keys(graph.entities).length;
    const avgScore = Object.values(graph.entities)
      .reduce((sum, entity) => sum + (entity.authorityScore || 0), 0) / entityCount;

    return {
      score: Math.round(avgScore),
      level: avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : avgScore >= 40 ? 'Fair' : 'Poor',
      change: Math.floor(Math.random() * 10) - 5, // Simuliert
      entities: entityCount
    };
  };

  const fetchEATMetrics = async () => {
    const signals = eatSignalEnhancementService.getAllSignals();
    const scores = eatSignalEnhancementService.calculateEATScore();

    return {
      expertiseScore: Math.round(scores.expertise),
      authoritativenessScore: Math.round(scores.authoritativeness),
      trustworthinessScore: Math.round(scores.trustworthiness),
      overallScore: Math.round(scores.overall),
      totalSignals: signals.length
    };
  };

  const fetchSchemaMetrics = async () => {
    // Simulierte Schema-Metriken
    return {
      implementations: 15,
      coverage: 85,
      errors: 2,
      richResults: 12
    };
  };

  const fetchBrandMetrics = async () => {
    const authorityData = brandAuthorityBuildingService.getBrandAuthorityScore();
    const socialProof = brandAuthorityBuildingService.getSocialProofMetrics();

    return {
      score: Math.round(authorityData.score),
      level: authorityData.level,
      socialProof: socialProof.totalCount,
      industryRecognition: Math.floor(Math.random() * 20) + 5 // Simuliert
    };
  };

  const fetchPlatformMetrics = async () => {
    const consistency = crossPlatformEntityConsistencyService.getConsistencyMetrics();

    return {
      overallScore: Math.round(consistency.overallScore),
      platforms: consistency.totalPlatforms,
      issues: consistency.totalIssues,
      syncOperations: Math.floor(Math.random() * 5) // Simuliert
    };
  };

  const generateAlerts = (metricsData: DashboardMetrics) => {
    const newAlerts: AlertData[] = [];

    // Entity Authority Alerts
    if (metricsData.entityAuthority.score < 50) {
      newAlerts.push({
        id: `entity-low-${Date.now()}`,
        type: 'warning',
        title: 'Niedrige Entity-Autorität',
        message: `Entity Authority Score ist bei ${metricsData.entityAuthority.score}%. Verbesserung erforderlich.`,
        timestamp: new Date(),
        actionRequired: true,
        relatedSystem: 'entities'
      });
    }

    // E-A-T Alerts
    if (metricsData.eatSignals.overallScore < 60) {
      newAlerts.push({
        id: `eat-low-${Date.now()}`,
        type: 'warning',
        title: 'E-A-T Score Verbesserung nötig',
        message: `Gesamter E-A-T Score ist bei ${metricsData.eatSignals.overallScore}%.`,
        timestamp: new Date(),
        actionRequired: true,
        relatedSystem: 'eat'
      });
    }

    // Schema Errors
    if (metricsData.structuredData.errors > 0) {
      newAlerts.push({
        id: `schema-errors-${Date.now()}`,
        type: 'error',
        title: 'Schema-Fehler gefunden',
        message: `${metricsData.structuredData.errors} Schema-Implementierungsfehler gefunden.`,
        timestamp: new Date(),
        actionRequired: true,
        relatedSystem: 'schema'
      });
    }

    // Platform Consistency
    if (metricsData.platformConsistency.issues > 5) {
      newAlerts.push({
        id: `platform-issues-${Date.now()}`,
        type: 'warning',
        title: 'Plattform-Inkonsistenzen',
        message: `${metricsData.platformConsistency.issues} Konsistenz-Probleme auf verschiedenen Plattformen.`,
        timestamp: new Date(),
        actionRequired: true,
        relatedSystem: 'platforms'
      });
    }

    setAlerts(newAlerts);
  };

  // ===== EFFECTS =====

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeframe]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 300000); // 5 Minuten

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // ===== COMPUTED VALUES =====

  const overallHealthScore = useMemo(() => {
    if (!metrics) return 0;
    
    const scores = [
      metrics.entityAuthority.score,
      metrics.eatSignals.overallScore,
      metrics.structuredData.coverage,
      metrics.brandAuthority.score,
      metrics.platformConsistency.overallScore
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [metrics]);

  const healthStatus = useMemo(() => {
    if (overallHealthScore >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (overallHealthScore >= 60) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (overallHealthScore >= 40) return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  }, [overallHealthScore]);

  // ===== HELPER FUNCTIONS =====

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleExport = () => {
    if (!metrics) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics,
      alerts: alerts.slice(0, 10),
      timeframe: selectedTimeframe
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeo-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // ===== RENDER FUNCTIONS =====

  const renderMetricCard = (
    title: string,
    value: string | number,
    change?: number,
    icon: React.ReactNode,
    color: string = 'blue'
  ) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(change)}% vs. letzte Periode
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Aktuelle Alerts</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          alerts.length === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {alerts.length} aktiv
        </span>
      </div>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500">Keine aktiven Alerts</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
              alert.type === 'error' ? 'border-red-500 bg-red-50' :
              alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
              alert.type === 'success' ? 'border-green-500 bg-green-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {alert.type === 'error' && <XCircle className="w-4 h-4 text-red-500 mr-2" />}
                    {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />}
                    {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>{alert.relatedSystem}</span>
                    <span className="mx-2">•</span>
                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="ml-3 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDetailedMetrics = () => {
    if (!metrics) return null;

    switch (activeTab) {
      case 'entities':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Entity Authority Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Organization Entities</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Person Entities</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Place Entities</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Service Entities</span>
                  <span className="font-medium">15</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Entities</h3>
              <div className="space-y-3">
                {['ZOE Solar GmbH (95)', 'Photovoltaik Service (88)', 'München Standort (82)', 'E-Mobilität (78)'].map((entity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{entity.split(' (')[0]}</span>
                    <span className="text-sm text-blue-600 font-medium">{entity.match(/\((\d+)\)/)?.[1]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'eat':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {renderMetricCard('Expertise', `${metrics.eatSignals.expertiseScore}%`, 3, <Award className="w-6 h-6 text-purple-600" />, 'purple')}
            {renderMetricCard('Authoritativeness', `${metrics.eatSignals.authoritativenessScore}%`, 5, <Shield className="w-6 h-6 text-blue-600" />, 'blue')}
            {renderMetricCard('Trustworthiness', `${metrics.eatSignals.trustworthinessScore}%`, -1, <CheckCircle className="w-6 h-6 text-green-600" />, 'green')}
          </div>
        );

      case 'schema':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Schema Implementation Status</h3>
              <div className="space-y-4">
                {[
                  { name: 'Organization Schema', status: 'active', coverage: 100 },
                  { name: 'Service Schema', status: 'active', coverage: 95 },
                  { name: 'FAQ Schema', status: 'active', coverage: 88 },
                  { name: 'Review Schema', status: 'pending', coverage: 0 },
                  { name: 'Breadcrumb Schema', status: 'active', coverage: 92 }
                ].map((schema, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        schema.status === 'active' ? 'bg-green-500' : 
                        schema.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium">{schema.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{schema.coverage}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Rich Results Performance</h3>
              <div className="space-y-3">
                {[
                  { type: 'FAQ Rich Results', count: 8, trend: 'up' },
                  { type: 'Organization Cards', count: 3, trend: 'stable' },
                  { type: 'Service Cards', count: 12, trend: 'up' },
                  { type: 'Review Stars', count: 0, trend: 'none' }
                ].map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{result.type}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{result.count}</span>
                      {result.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {result.trend === 'stable' && <div className="w-4 h-4 bg-yellow-400 rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'brand':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Brand Authority Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Social Proof Score</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Industry Recognition</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Thought Leadership</span>
                  <span className="font-medium">72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Brand Mentions</span>
                  <span className="font-medium">156 (30d)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {[
                  'TÜV Zertifizierung erhalten',
                  'Fachmagazin Interview veröffentlicht',
                  '50+ neue Google Reviews',
                  'Branchenpreis nomination'
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Award className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-sm font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'platforms':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Consistency Scores</h3>
              <div className="space-y-4">
                {[
                  { name: 'Google Business Profile', score: 95, status: 'excellent' },
                  { name: 'Facebook Business', score: 88, status: 'good' },
                  { name: 'LinkedIn Company', score: 78, status: 'fair' },
                  { name: 'XING Unternehmen', score: 65, status: 'needs-work' },
                  { name: 'Bing Places', score: 92, status: 'excellent' }
                ].map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{platform.name}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-3">{platform.score}%</span>
                      <div className={`w-3 h-3 rounded-full ${
                        platform.status === 'excellent' ? 'bg-green-500' :
                        platform.status === 'good' ? 'bg-blue-500' :
                        platform.status === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Sync Operations</h3>
              <div className="space-y-3">
                {[
                  { platform: 'Google Business Profile', status: 'completed', time: '2 min ago' },
                  { platform: 'Facebook Business', status: 'in-progress', time: 'now' },
                  { platform: 'LinkedIn Company', status: 'pending', time: 'queued' },
                  { platform: 'XING Unternehmen', status: 'failed', time: '1h ago' }
                ].map((sync, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium block">{sync.platform}</span>
                      <span className="text-xs text-gray-500">{sync.time}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sync.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sync.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      sync.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sync.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ===== LOADING STATE =====

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">AEO Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timeframe Selector */}
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Letzte 24h</option>
                <option value="7d">Letzte 7 Tage</option>
                <option value="30d">Letzte 30 Tage</option>
                <option value="90d">Letzte 90 Tage</option>
              </select>

              {/* Auto Refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg ${autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                title={autoRefresh ? 'Auto-Refresh aktiv' : 'Auto-Refresh inaktiv'}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>

              {/* Manual Refresh */}
              <button
                onClick={handleRefresh}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Manuell aktualisieren"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Daten exportieren"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Settings */}
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Health Score */}
        <div className="mb-8">
          <div className={`${healthStatus.bgColor} rounded-xl p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AEO Health Score</h2>
                <p className="text-gray-600">Gesamtbewertung der Entity-Autorität</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900 mb-1">{overallHealthScore}%</div>
                <div className={`${healthStatus.color} font-medium`}>{healthStatus.label}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {renderMetricCard(
              'Entity Authority',
              `${metrics.entityAuthority.score}%`,
              metrics.entityAuthority.change,
              <Target className="w-6 h-6 text-blue-600" />,
              'blue'
            )}
            
            {renderMetricCard(
              'E-A-T Score',
              `${metrics.eatSignals.overallScore}%`,
              2,
              <Shield className="w-6 h-6 text-green-600" />,
              'green'
            )}
            
            {renderMetricCard(
              'Schema Coverage',
              `${metrics.structuredData.coverage}%`,
              5,
              <BarChart3 className="w-6 h-6 text-purple-600" />,
              'purple'
            )}
            
            {renderMetricCard(
              'Brand Authority',
              metrics.brandAuthority.level,
              undefined,
              <Award className="w-6 h-6 text-yellow-600" />,
              'yellow'
            )}
            
            {renderMetricCard(
              'Platform Consistency',
              `${metrics.platformConsistency.overallScore}%`,
              -2,
              <Link className="w-6 h-6 text-indigo-600" />,
              'indigo'
            )}
          </div>
        )}

        {/* Alerts Section */}
        <div className="mb-8">
          {renderAlerts()}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Übersicht', icon: Eye },
                { id: 'entities', label: 'Entities', icon: Globe },
                { id: 'eat', label: 'E-A-T Signale', icon: Shield },
                { id: 'schema', label: 'Schema', icon: BarChart3 },
                { id: 'brand', label: 'Brand Authority', icon: Award },
                { id: 'platforms', label: 'Plattformen', icon: Link }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="mb-8">
          {renderDetailedMetrics()}
        </div>
      </div>
    </div>
  );
};

export default AEODashboard;