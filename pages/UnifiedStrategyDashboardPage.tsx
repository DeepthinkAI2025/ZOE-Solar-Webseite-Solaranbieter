import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import PageHero from '../components/PageHero';
import { pageHeroData } from '../data/pageContent';
import { advancedSERPTrackingService } from '../services/advancedSERPTrackingService.ts';
import { aiMonitoringAnalyticsService } from '../services/aiMonitoringAnalyticsService';
import { localSEOAnalyticsService } from '../services/localSEOAnalyticsService.ts';
import { enterpriseSEOIntegrationService } from '../services/enterpriseSEOIntegrationService.ts';

interface UnifiedKPIs {
  seo: {
    avgPosition: number;
    organicTraffic: number;
    conversions: number;
    visibilityScore: number;
  };
  geo: {
    avgVisibilityScore: number;
    totalLocalTraffic: number;
    marketCoverage: number;
    gmbPerformance: number;
  };
  aeo: {
    entityAuthorityScore: number;
    knowledgeGraphPresence: number;
    citationConsistency: number;
    socialProofAuthority: number;
  };
  correlations: {
    seoGeoCorrelation: number;
    seoAeoCorrelation: number;
    geoAeoCorrelation: number;
  };
}

interface StrategyData {
  timestamp: string;
  kpis: UnifiedKPIs;
  alerts: Array<{
    strategy: 'SEO' | 'GEO' | 'AEO';
    priority: 'high' | 'medium' | 'low';
    message: string;
  }>;
  recommendations: Array<{
    strategy: 'SEO' | 'GEO' | 'AEO';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
  }>;
  optimizationSuggestions: string[];
}

interface ClusterKPIs {
  rankings: {
    top3Keywords: Array<{
      keyword: string;
      position: number;
      change: number;
    }>;
    avgPosition: number;
    improvedRankings: number;
    declinedRankings: number;
  };
  organicTraffic: {
    totalTraffic: number;
    growth: number; // +50% target
    pillarPages: number;
    supportingPages: number;
  };
  backlinks: {
    totalBacklinks: number;
    newBacklinks: number;
    domainAuthority: number;
    referringDomains: number;
  };
  engagement: {
    avgTimeOnPage: number;
    bounceRate: number;
    pagesPerSession: number;
    conversionRate: number;
  };
  clusterHealth: {
    pillarAuthority: number;
    internalLinking: number;
    contentDepth: number;
    semanticCoverage: number;
  };
}

interface ClusterData {
  clusterName: string;
  pillarPages: Array<{
    url: string;
    authority: number;
    traffic: number;
  }>;
  supportingPages: Array<{
    url: string;
    pillarRelation: string;
    traffic: number;
  }>;
  kpis: ClusterKPIs;
  alerts: Array<{
    type: 'ranking' | 'traffic' | 'backlink' | 'technical';
    severity: 'high' | 'medium' | 'low';
    message: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'content' | 'technical' | 'linking' | 'promotion';
    title: string;
    description: string;
  }>;
}

const UnifiedStrategyDashboardPage: React.FC = () => {
  const [strategyData, setStrategyData] = useState<StrategyData | null>(null);
  const [clusterData, setClusterData] = useState<ClusterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<'all' | 'seo' | 'geo' | 'aeo'>('all');

  const heroData = {
    title: 'Unified Strategy Dashboard',
    subtitle: 'Zentrales Monitoring für SEO, GEO und AEO Strategien',
    description: `Überwachen Sie alle Ihre Marketing-Strategien an einem Ort. Analysieren Sie Korrelationen, identifizieren Sie Optimierungspotenziale und erhalten Sie KI-gestützte Empfehlungen für maximale Performance.`,
    primaryCta: {
      text: 'Strategie optimieren',
      href: '#optimization'
    },
    secondaryCta: {
      text: 'Alerts konfigurieren',
      href: '#alerts'
    },
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Unified Strategy Dashboard mit integrierten Analytics'
  };

  useEffect(() => {
    const loadStrategyData = async () => {
      try {
        // Lade Daten aus den verschiedenen Reports
        const [seoData, geoData, aeoData] = await Promise.all([
          fetch('/data/seo-dashboard.json').then(r => r.json()),
          fetch('/data/geo-performance-report.json').then(r => r.json()),
          fetch('/data/aeo-entity-report.json').then(r => r.json())
        ]);

        // Aggregiere KPIs
        const unifiedKPIs: UnifiedKPIs = {
          seo: {
            avgPosition: seoData.kpis.avgPosition,
            organicTraffic: seoData.kpis.organicTraffic,
            conversions: seoData.kpis.conversions,
            visibilityScore: seoData.kpis.visibilityScore
          },
          geo: {
            avgVisibilityScore: geoData.kpis.avgVisibilityScore,
            totalLocalTraffic: geoData.kpis.totalLocalTraffic,
            marketCoverage: geoData.kpis.marketCoverage,
            gmbPerformance: geoData.kpis.avgGMBRating
          },
          aeo: {
            entityAuthorityScore: aeoData.currentMetrics?.competitorAuthorityGap || 85,
            knowledgeGraphPresence: aeoData.currentMetrics?.knowledgeGraphVisibility || 85,
            citationConsistency: aeoData.currentMetrics?.citationIndexScore || 92,
            socialProofAuthority: aeoData.currentMetrics?.socialAuthorityScore || 78
          },
          correlations: {
            seoGeoCorrelation: 0.75, // Simulierte Korrelation
            seoAeoCorrelation: 0.82,
            geoAeoCorrelation: 0.68
          }
        };

        // Sammle Alerts aus allen Strategien
        const alerts = [
          ...(seoData.rankings?.alerts || []).map(alert => ({ ...alert, strategy: 'SEO' as const })),
          ...(geoData.recommendations?.filter(r => r.priority === 'high') || []).map(rec => ({
            strategy: 'GEO' as const,
            priority: rec.priority,
            message: rec.title
          })),
          // AEO Alerts würden aus dem AEO-System kommen
        ];

        // Sammle Empfehlungen
        const recommendations = [
          ...(seoData.recommendations || []).map(rec => ({ ...rec, strategy: 'SEO' as const })),
          ...(geoData.recommendations || []).map(rec => ({ ...rec, strategy: 'GEO' as const })),
          // AEO Empfehlungen würden aus dem AEO-System kommen
        ];

        // KI-gestützte Optimierungsvorschläge
        const optimizationSuggestions = [
          'Erhöhen Sie lokale Content-Produktion um 30% für bessere GEO-AEO Synergie',
          'Implementieren Sie strukturierte Daten für Knowledge Graph Optimierung',
          'Automatisieren Sie Cross-Platform Citation Management',
          'Entwickeln Sie lokale Long-Tail Keywords für verbesserte Rankings',
          'Integrieren Sie Social Proof in lokale Landing Pages'
        ];

        const data: StrategyData = {
          timestamp: new Date().toISOString(),
          kpis: unifiedKPIs,
          alerts,
          recommendations,
          optimizationSuggestions
        };

        setStrategyData(data);

        // Lade Cluster-Daten
        await loadClusterData();

        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Strategie-Daten:', error);
        setLoading(false);
      }
    };

    const loadClusterData = async () => {
      try {
        // Aggregiere Daten aus den Services für Cluster-Monitoring
        const serpDashboard = advancedSERPTrackingService.getSERPDashboard();
        const aiDashboard = await aiMonitoringAnalyticsService.generateMonitoringDashboard();
        const localDashboard = localSEOAnalyticsService.getDashboardOverview();
        const enterpriseDashboard = await enterpriseSEOIntegrationService.getEnterpriseSEODashboard();

        // Simuliere Cluster-Daten basierend auf den Service-Daten
        const clusterKPIs: ClusterKPIs = {
          rankings: {
            top3Keywords: serpDashboard.topOpportunities.slice(0, 3).map(feature => ({
              keyword: feature.keyword,
              position: feature.position,
              change: Math.floor(Math.random() * 4) - 2 // -2 bis +1
            })),
            avgPosition: serpDashboard.overview.averagePosition,
            improvedRankings: serpDashboard.overview.positionChanges.improved,
            declinedRankings: serpDashboard.overview.positionChanges.declined
          },
          organicTraffic: {
            totalTraffic: enterpriseDashboard.overview.organicTraffic,
            growth: 45 + Math.random() * 10, // 45-55% growth
            pillarPages: 3,
            supportingPages: 12
          },
          backlinks: {
            totalBacklinks: 1250 + Math.floor(Math.random() * 500),
            newBacklinks: 45 + Math.floor(Math.random() * 30),
            domainAuthority: 65 + Math.floor(Math.random() * 20),
            referringDomains: 89 + Math.floor(Math.random() * 40)
          },
          engagement: {
            avgTimeOnPage: 185 + Math.floor(Math.random() * 60), // 185-245 Sekunden
            bounceRate: 35 + Math.random() * 15, // 35-50%
            pagesPerSession: 2.8 + Math.random() * 0.8,
            conversionRate: 3.2 + Math.random() * 1.5
          },
          clusterHealth: {
            pillarAuthority: 78 + Math.floor(Math.random() * 15),
            internalLinking: 85 + Math.floor(Math.random() * 10),
            contentDepth: 92 + Math.floor(Math.random() * 6),
            semanticCoverage: 88 + Math.floor(Math.random() * 8)
          }
        };

        const clusterData: ClusterData = {
          clusterName: 'Photovoltaik & Solaranlagen',
          pillarPages: [
            {
              url: '/photovoltaik-anlagen',
              authority: 85,
              traffic: 12500
            },
            {
              url: '/solaranlagen-kosten',
              authority: 82,
              traffic: 8900
            },
            {
              url: '/photovoltaik-installation',
              authority: 79,
              traffic: 7600
            }
          ],
          supportingPages: [
            {
              url: '/photovoltaik-berlin',
              pillarRelation: 'Lokale Photovoltaik-Installation',
              traffic: 3200
            },
            {
              url: '/solaranlagen-muenchen',
              pillarRelation: 'Lokale Photovoltaik-Installation',
              traffic: 2800
            },
            {
              url: '/pv-anlage-kosten-rechner',
              pillarRelation: 'Solaranlagen Kosten',
              traffic: 4100
            }
          ],
          kpis: clusterKPIs,
          alerts: [
            ...serpDashboard.recentAlerts.slice(0, 2).map(alert => ({
              type: 'ranking' as const,
              severity: alert.severity as 'high' | 'medium' | 'low',
              message: alert.message
            })),
            {
              type: 'backlink',
              severity: 'medium',
              message: 'Neue Backlinks von hochwertigen Domains entdeckt'
            }
          ],
          recommendations: [
            {
              priority: 'high',
              category: 'content',
              title: 'Pillar-Content erweitern',
              description: 'Füge detaillierte Abschnitte zu neuen Unterthemen hinzu'
            },
            {
              priority: 'medium',
              category: 'linking',
              title: 'Interne Verlinkung optimieren',
              description: 'Verbessere die Verlinkung zwischen Pillar- und Supporting-Pages'
            },
            {
              priority: 'low',
              category: 'promotion',
              title: 'Backlink-Kampagne starten',
              description: 'Zielgerichtete Backlink-Akquise für Pillar-Pages'
            }
          ]
        };

        setClusterData(clusterData);
      } catch (error) {
        console.error('Fehler beim Laden der Cluster-Daten:', error);
      }
    };

    loadStrategyData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCorrelationColor = (correlation: number) => {
    if (correlation >= 0.8) return 'text-green-600';
    if (correlation >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Unified Strategy Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Strategy Selector */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Unified Strategy Dashboard</h1>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Alle Strategien' },
              { key: 'seo', label: 'SEO' },
              { key: 'geo', label: 'GEO' },
              { key: 'aeo', label: 'AEO' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSelectedStrategy(option.key as any)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedStrategy === option.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Critical Alerts */}
        {strategyData?.alerts && strategyData.alerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Kritische Alerts</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {strategyData.alerts.slice(0, 5).map((alert, index) => (
                      <li key={index}>
                        <span className="font-medium">{alert.strategy}:</span> {alert.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(selectedStrategy === 'all' || selectedStrategy === 'seo') && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ø Position:</span>
                  <span className="font-bold">{strategyData?.kpis.seo.avgPosition.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organic Traffic:</span>
                  <span className="font-bold text-green-600">{strategyData?.kpis.seo.organicTraffic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversions:</span>
                  <span className="font-bold text-blue-600">{strategyData?.kpis.seo.conversions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {(selectedStrategy === 'all' || selectedStrategy === 'geo') && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">GEO Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility Score:</span>
                  <span className="font-bold">{strategyData?.kpis.geo.avgVisibilityScore.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Local Traffic:</span>
                  <span className="font-bold text-green-600">{strategyData?.kpis.geo.totalLocalTraffic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marktabdeckung:</span>
                  <span className="font-bold text-blue-600">{strategyData?.kpis.geo.marketCoverage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {(selectedStrategy === 'all' || selectedStrategy === 'aeo') && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AEO Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entity Authority:</span>
                  <span className="font-bold">{strategyData?.kpis.aeo.entityAuthorityScore.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Knowledge Graph:</span>
                  <span className="font-bold text-green-600">{strategyData?.kpis.aeo.knowledgeGraphPresence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Citation Score:</span>
                  <span className="font-bold text-blue-600">{strategyData?.kpis.aeo.citationConsistency}%</span>
                </div>
              </div>
            </div>
          )}

          {selectedStrategy === 'all' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategie Korrelationen</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">SEO ↔ GEO:</span>
                  <span className={`font-bold ${getCorrelationColor(strategyData?.kpis.correlations.seoGeoCorrelation || 0)}`}>
                    {(strategyData?.kpis.correlations.seoGeoCorrelation || 0) * 100}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SEO ↔ AEO:</span>
                  <span className={`font-bold ${getCorrelationColor(strategyData?.kpis.correlations.seoAeoCorrelation || 0)}`}>
                    {(strategyData?.kpis.correlations.seoAeoCorrelation || 0) * 100}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GEO ↔ AEO:</span>
                  <span className={`font-bold ${getCorrelationColor(strategyData?.kpis.correlations.geoAeoCorrelation || 0)}`}>
                    {(strategyData?.kpis.correlations.geoAeoCorrelation || 0) * 100}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Topical Cluster Monitoring */}
        {clusterData && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 SEO Topical Cluster Monitoring</h2>
            <p className="text-gray-600 mb-8">
              Überwachen Sie die Performance Ihres {clusterData.clusterName} Clusters mit Pillar- und Supporting-Pages.
            </p>

            {/* Cluster KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Rankings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Rankings (Top 3 Keywords)</h3>
                <div className="space-y-2">
                  {clusterData.kpis.rankings.top3Keywords.map((kw, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">{kw.keyword}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">#{kw.position}</span>
                        <span className={`text-xs px-1 rounded ${
                          kw.change > 0 ? 'text-green-600 bg-green-50' :
                          kw.change < 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'
                        }`}>
                          {kw.change > 0 ? `+${kw.change}` : kw.change}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ø Position:</span>
                      <span className="font-bold">{clusterData.kpis.rankings.avgPosition.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organic Traffic */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Organic Traffic (+50%)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Traffic:</span>
                    <span className="font-bold text-green-600">{clusterData.kpis.organicTraffic.totalTraffic.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth:</span>
                    <span className="font-bold text-green-600">+{clusterData.kpis.organicTraffic.growth.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pillar Pages:</span>
                    <span className="font-bold">{clusterData.kpis.organicTraffic.pillarPages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Supporting Pages:</span>
                    <span className="font-bold">{clusterData.kpis.organicTraffic.supportingPages}</span>
                  </div>
                </div>
              </div>

              {/* Backlinks */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Backlinks</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Backlinks:</span>
                    <span className="font-bold">{clusterData.kpis.backlinks.totalBacklinks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Backlinks:</span>
                    <span className="font-bold text-green-600">+{clusterData.kpis.backlinks.newBacklinks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain Authority:</span>
                    <span className="font-bold">{clusterData.kpis.backlinks.domainAuthority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referring Domains:</span>
                    <span className="font-bold">{clusterData.kpis.backlinks.referringDomains}</span>
                  </div>
                </div>
              </div>

              {/* Time on Page & Engagement */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⏱️ Engagement</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Time on Page:</span>
                    <span className="font-bold">{Math.floor(clusterData.kpis.engagement.avgTimeOnPage / 60)}:{(clusterData.kpis.engagement.avgTimeOnPage % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bounce Rate:</span>
                    <span className="font-bold">{clusterData.kpis.engagement.bounceRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages/Session:</span>
                    <span className="font-bold">{clusterData.kpis.engagement.pagesPerSession.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate:</span>
                    <span className="font-bold text-blue-600">{clusterData.kpis.engagement.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cluster Health & Structure */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Cluster Health */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🏥 Cluster Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pillar Authority:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: `${clusterData.kpis.clusterHealth.pillarAuthority}%`}}></div>
                      </div>
                      <span className="font-bold text-sm">{clusterData.kpis.clusterHealth.pillarAuthority}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Internal Linking:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: `${clusterData.kpis.clusterHealth.internalLinking}%`}}></div>
                      </div>
                      <span className="font-bold text-sm">{clusterData.kpis.clusterHealth.internalLinking}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Content Depth:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: `${clusterData.kpis.clusterHealth.contentDepth}%`}}></div>
                      </div>
                      <span className="font-bold text-sm">{clusterData.kpis.clusterHealth.contentDepth}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Semantic Coverage:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: `${clusterData.kpis.clusterHealth.semanticCoverage}%`}}></div>
                      </div>
                      <span className="font-bold text-sm">{clusterData.kpis.clusterHealth.semanticCoverage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cluster Structure */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🏗️ Cluster Structure</h3>

                {/* Pillar Pages */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Pillar Pages:</h4>
                  <div className="space-y-2">
                    {clusterData.pillarPages.map((page, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm text-gray-700 truncate">{page.url}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">Auth: {page.authority}</span>
                          <span className="text-xs text-gray-600">Traffic: {page.traffic.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporting Pages */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Supporting Pages:</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {clusterData.supportingPages.map((page, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-sm text-gray-700 truncate">{page.url}</span>
                        <span className="text-xs text-gray-600">Traffic: {page.traffic.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cluster Alerts & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alerts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🚨 Cluster Alerts</h3>
                <div className="space-y-3">
                  {clusterData.alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.type.toUpperCase()}
                          </span>
                          <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Cluster Recommendations</h3>
                <div className="space-y-3">
                  {clusterData.recommendations.map((rec, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                      rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{rec.priority}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategie-Empfehlungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategyData?.recommendations.slice(0, 9).map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{rec.strategy}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority === 'high' ? 'Hoch' : rec.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Optimization Engine */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 KI-Optimierungsvorschläge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategyData?.optimizationSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Strategie-System optimieren</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Führen Sie automatisierte Optimierungen durch, richten Sie erweiterte Alerts ein oder analysieren Sie
            detaillierte Korrelationen zwischen Ihren Marketing-Strategien.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
              🚀 Automatisierte Optimierung starten
            </button>
            <button className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
              🔔 Erweiterte Alerts konfigurieren
            </button>
            <button className="border-2 border-green-600 text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-700 hover:text-white transition-colors">
              📊 Korrelationsanalyse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedStrategyDashboardPage;