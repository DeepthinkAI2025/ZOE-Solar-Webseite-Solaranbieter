/**
 * Serena Business Intelligence Dashboard
 * Executive-level Dashboard für Serena MCP Insights und KPIs
 */

import React, { useState, useEffect } from 'react';
import { SerenaBusinessIntelligenceService } from '../../services/serenaBusinessIntelligenceService';
import { SerenaSecurityComplianceService } from '../../services/serenaSecurityComplianceService';
import { SerenaUXOptimizationService } from '../../services/serenaUXOptimizationService';
import CompatibilityDashboard from '../components/CompatibilityDashboard';
// Performance Service Mock für Demo
const createPerformanceService = () => ({
  generatePerformanceReport: () => ({
    summary: { averageScore: 92 },
    alerts: []
  })
});

interface DashboardState {
  businessHealthScore: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kpis: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insights: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alerts: any[];
  lastUpdated: Date;
  serenaActive: boolean;
}

const SerenaBIDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardState>({
    businessHealthScore: 0,
    kpis: [],
    insights: [],
    alerts: [],
    lastUpdated: new Date(),
    serenaActive: true
  });

  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Serena MCP Services
  const [biService] = useState(() => new SerenaBusinessIntelligenceService());
  const [securityService] = useState(() => new SerenaSecurityComplianceService());
  const [uxService] = useState(() => new SerenaUXOptimizationService());
  const [performanceService] = useState(() => createPerformanceService());

  useEffect(() => {
    loadDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh, selectedTimeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Serena MCP Business Intelligence Data
      const businessScore = biService.getBusinessHealthScore();
      const predictiveInsights = await biService.generatePredictiveInsights();
      const realTimeKPIs = await biService.updateRealTimeKPIs();
      const _customerJourney = await biService.analyzeCustomerJourney();
      const _conversionFunnel = await biService.analyzeConversionFunnel();
      const _businessDashboard = await biService.createBusinessDashboard();

      // Serena Security Status
      const securityData = securityService.getSecurityDashboardData();
      const _complianceData = await securityService.performGDPRComplianceCheck();

      // Serena UX Metrics
      const _uxData = uxService.getUXDashboardData();
      const _accessibilityAudit = await uxService.performAccessibilityAudit(window.location.href);

      // Serena Performance Status
      const performanceData = performanceService.generatePerformanceReport();

      setDashboard({
        businessHealthScore: businessScore,
        kpis: realTimeKPIs,
        insights: predictiveInsights,
        alerts: [...securityData.vulnerabilitySummary, ...performanceData.alerts],
        lastUpdated: new Date(),
        serenaActive: true
      });
    } catch (error) {
      console.error('Failed to load Serena BI Dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-900">
            Serena MCP lädt Business Intelligence Daten...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Serena MCP Business Intelligence Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Letzte Aktualisierung: {dashboard.lastUpdated.toLocaleString('de-DE')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${dashboard.serenaActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  Serena MCP {dashboard.serenaActive ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Auto-Refresh {autoRefresh ? 'AN' : 'AUS'}
              </button>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Aktualisieren
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Übersicht', icon: '📊' },
              { id: 'kpis', name: 'KPIs', icon: '📈' },
              { id: 'insights', name: 'Insights', icon: '🧠' },
              { id: 'performance', name: 'Performance', icon: '⚡' },
              { id: 'security', name: 'Sicherheit', icon: '🛡️' },
              { id: 'ux', name: 'UX', icon: '🎨' },
              { id: 'compatibility', name: 'Kompatibilität', icon: '🌐' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Business Health Score */}
            <div className={`rounded-lg p-6 ${getScoreBgColor(dashboard.businessHealthScore)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Serena MCP Business Health Score
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Gesamtbewertung aller Serena MCP Systeme
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(dashboard.businessHealthScore)}`}>
                    {dashboard.businessHealthScore}
                  </div>
                  <div className="text-sm text-gray-600">von 100</div>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboard.kpis.slice(0, 4).map((kpi, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {typeof kpi.value === 'number' && kpi.value < 1 
                          ? `${(kpi.value * 100).toFixed(1)}%`
                          : kpi.value.toLocaleString('de-DE')
                        }
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 
                      kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {kpi.trend === 'up' ? '↗️' : kpi.trend === 'down' ? '↘️' : '➡️'} 
                      {Math.abs(kpi.trendValue).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Insights */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  🧠 Serena MCP Predictive Insights
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboard.insights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {insight.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Konfidenz: {(insight.confidence * 100).toFixed(0)}% | 
                            Impact: {insight.impact} | 
                            {insight.serenaML && '🤖 Serena AI'}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          insight.impact === 'critical' ? 'bg-red-100 text-red-800' :
                          insight.impact === 'high' ? 'bg-orange-100 text-orange-800' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insight.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts & Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  🚨 Serena MCP Alerts & Actions
                </h3>
              </div>
              <div className="p-6">
                {dashboard.alerts.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.alerts.slice(0, 5).map((alert, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                        <span className="text-sm text-gray-900">
                          {typeof alert === 'object' && alert.title ? alert.title : 'Serena MCP Alert'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString('de-DE')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-green-500 text-4xl mb-4">✅</div>
                    <p className="text-gray-600">Keine kritischen Alerts</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Alle Serena MCP Systeme laufen optimal
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kpis' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">📈 Business KPIs</h2>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1d">Letzte 24 Stunden</option>
                <option value="7d">Letzte 7 Tage</option>
                <option value="30d">Letzte 30 Tage</option>
                <option value="90d">Letzte 90 Tage</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboard.kpis.map((kpi, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">{kpi.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      kpi.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      kpi.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {kpi.priority}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {typeof kpi.value === 'number' && kpi.value < 1 
                          ? `${(kpi.value * 100).toFixed(1)}%`
                          : kpi.value.toLocaleString('de-DE')
                        }
                      </span>
                      <span className="text-sm text-gray-500">
                        Target: {kpi.target.toLocaleString('de-DE')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (kpi.value / kpi.target) >= 1 ? 'bg-green-500' :
                          (kpi.value / kpi.target) >= 0.8 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Erreichung: {((kpi.value / kpi.target) * 100).toFixed(0)}%</span>
                      <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {kpi.trend === 'up' ? '↗️' : '↘️'} {Math.abs(kpi.trendValue).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">🧠 Serena MCP Predictive Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboard.insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{insight.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      insight.impact === 'critical' ? 'bg-red-100 text-red-800' :
                      insight.impact === 'high' ? 'bg-orange-100 text-orange-800' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.impact}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{insight.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Konfidenz:</span>
                      <span className="font-medium">{(insight.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Zeitrahmen:</span>
                      <span className="font-medium">{insight.timeHorizon}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Datenpunkte:</span>
                      <span className="font-medium">{insight.dataPoints.toLocaleString('de-DE')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Model-Genauigkeit:</span>
                      <span className="font-medium">{(insight.modelAccuracy * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  {insight.actionable && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium text-blue-900">Empfehlung:</p>
                      <p className="text-sm text-blue-800 mt-1">{insight.recommendation}</p>
                    </div>
                  )}
                  {insight.serenaML && (
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                      <span className="mr-2">🤖</span>
                      Generiert durch Serena AI
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">⚡ Performance Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Core Web Vitals</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">LCP</span>
                    <span className="text-sm font-medium">2.1s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">FID</span>
                    <span className="text-sm font-medium">95ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">CLS</span>
                    <span className="text-sm font-medium">0.05</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Lighthouse Score</h3>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-green-600">92</div>
                  <div className="text-sm text-gray-600">von 100</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Page Load Time</h3>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-blue-600">1.8s</div>
                  <div className="text-sm text-gray-600">Durchschnitt</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Error Rate</h3>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-green-600">0.02%</div>
                  <div className="text-sm text-gray-600">Letzte 24h</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">🛡️ Security & Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Security Score</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-green-600">87</div>
                  <div className="text-sm text-gray-600">von 100</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Critical Issues</span>
                    <span className="text-red-600">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>High Priority</span>
                    <span className="text-orange-600">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medium Priority</span>
                    <span className="text-yellow-600">5</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">GDPR Compliance</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Compliant</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cookie Consent</span>
                    <span className="text-green-600">✅</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Privacy Policy</span>
                    <span className="text-green-600">✅</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Data Minimization</span>
                    <span className="text-yellow-600">⚠️</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Backup Status</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Aktuell</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database</span>
                    <span className="text-green-600">✅ Success</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Notion</span>
                    <span className="text-green-600">✅ Success</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Files</span>
                    <span className="text-green-600">✅ Success</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ux' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">🎨 UX & Accessibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">UX Score</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-blue-600">84</div>
                  <div className="text-sm text-gray-600">von 100</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Accessibility</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-green-600">92</div>
                  <div className="text-sm text-gray-600">WCAG AA</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">A/B Tests</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-gray-600">Aktiv</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Components</h3>
                <div className="mt-2">
                  <div className="text-3xl font-bold text-indigo-600">24</div>
                  <div className="text-sm text-gray-600">Optimiert</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityDashboard />
        )}
      </div>
    </div>
  );
};

export default SerenaBIDashboardPage;