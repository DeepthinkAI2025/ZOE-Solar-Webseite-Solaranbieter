/**
 * Cross-Platform Compatibility Dashboard Component
 * Integration der CrossPlatformAnalyzer in das Serena BI Dashboard
 */

import React, { useState, useEffect } from 'react';
import { CrossPlatformAnalyzer, PlatformCompatibilityReport, CompatibilityIssue, CompatibilityRecommendation } from '../compatibility/analytics/CrossPlatformAnalyzer';

interface CompatibilityDashboardProps {
  className?: string;
}

const CompatibilityDashboard: React.FC<CompatibilityDashboardProps> = ({ className = '' }) => {
  const [analyzer] = useState(() => new CrossPlatformAnalyzer());
  const [report, setReport] = useState<PlatformCompatibilityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'issues' | 'recommendations' | 'matrix'>('overview');

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzer.analyzeCompatibility();
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analyse fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!report) return;
    try {
      const markdownReport = await analyzer.generateCompatibilityReport();
      // In einer echten App würde man das als Download anbieten
      console.log('Report generiert:', markdownReport);
      // Für Demo-Zwecke zeigen wir es in der Konsole
      alert('Report wurde in der Konsole ausgegeben. In Produktion würde ein Download erfolgen.');
    } catch (_err) {
      setError('Report-Generierung fehlgeschlagen');
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cross-Platform-Analyse läuft...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <div className="text-red-600 text-xl mr-3">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">Analyse-Fehler</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-gray-600">Keine Analyse-Daten verfügbar</p>
        <button
          onClick={runAnalysis}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Analyse starten
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🌐 Cross-Platform-Kompatibilität</h2>
          <p className="text-gray-600 mt-1">
            Analyse der Browser- und Geräte-Kompatibilität für ZOE Solar
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={runAnalysis}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            🔄 Neu analysieren
          </button>
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            📄 Report generieren
          </button>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`rounded-lg p-6 ${getScoreColor(report.overallScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Gesamt-Kompatibilitäts-Score
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {report.platforms.length} Plattformen analysiert • {report.issues.length} Probleme gefunden
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${report.overallScore >= 90 ? 'text-green-600' : report.overallScore >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
              {report.overallScore}
            </div>
            <div className="text-sm text-gray-600">von 100</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Übersicht', icon: '📊' },
            { id: 'issues', name: 'Probleme', icon: '⚠️' },
            { id: 'recommendations', name: 'Empfehlungen', icon: '💡' },
            { id: 'matrix', name: 'Kompatibilitäts-Matrix', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as 'overview' | 'issues' | 'recommendations' | 'matrix')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Platform Coverage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Marktabdeckung</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold text-green-600">
                  {(report.marketCoverage.supportedMarketShare).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Unterstützt</div>
              </div>
            </div>

            {/* Critical Issues */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Kritische Probleme</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold text-red-600">
                  {report.issues.filter((i: CompatibilityIssue) => i.severity === 'critical').length}
                </div>
                <div className="text-sm text-gray-600">Behoben erforderlich</div>
              </div>
            </div>

            {/* Performance Score */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Performance-Score</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(report.performanceMetrics.loadTime.Chrome || 0)}ms
                </div>
                <div className="text-sm text-gray-600">Ø Ladezeit</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Empfehlungen</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold text-purple-600">
                  {report.recommendations.length}
                </div>
                <div className="text-sm text-gray-600">Aktionen verfügbar</div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'issues' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Gefundene Kompatibilitäts-Probleme</h3>
            {report.issues.length === 0 ? (
              <div className="text-center py-8 bg-green-50 rounded-lg">
                <div className="text-green-600 text-4xl mb-4">✅</div>
                <p className="text-green-800 font-medium">Keine Kompatibilitäts-Probleme gefunden!</p>
                <p className="text-green-600 text-sm mt-1">Alle analysierten Features sind kompatibel.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {report.issues.map((issue: CompatibilityIssue, index: number) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(issue.severity)}`}>
                            {issue.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">{issue.category}</span>
                        </div>
                        <h4 className="font-medium text-gray-900">{issue.feature}</h4>
                        <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Betroffene Plattformen: {issue.platform}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'recommendations' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Verbesserungs-Empfehlungen</h3>
            {report.recommendations.length === 0 ? (
              <div className="text-center py-8 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-4xl mb-4">🎉</div>
                <p className="text-blue-800 font-medium">Keine weiteren Empfehlungen nötig!</p>
                <p className="text-blue-600 text-sm mt-1">Die Anwendung ist optimal konfiguriert.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {report.recommendations.map((rec: CompatibilityRecommendation, index: number) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Aufwand:</span>
                        <span className="ml-2 font-medium">{rec.implementation.effort}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Zeit:</span>
                        <span className="ml-2 font-medium">{rec.implementation.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'matrix' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Kompatibilitäts-Matrix</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h4 className="font-medium text-gray-900">JavaScript Features</h4>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {report.compatibilityMatrix.features.slice(0, 5).map((feature: { name: string; category: string; support: Record<string, boolean> }, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{feature.name}</span>
                      <div className="flex space-x-2">
                        {Object.entries(feature.support).map(([platform, supported]) => (
                          <span key={platform} className={`px-2 py-1 text-xs rounded-full ${
                            supported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {platform}: {supported ? '✓' : '✗'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompatibilityDashboard;