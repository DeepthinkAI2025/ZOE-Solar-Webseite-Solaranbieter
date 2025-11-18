import React, { useState, useEffect } from 'react';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';
import GMBDashboard from './GMBDashboard';
import NAPConsistencyDashboard from './NAPConsistencyDashboard';
import { localSEOAnalyticsService, LocalSEOReport } from '../services/localSEOAnalyticsService';
import { gmbOptimizationService } from '../services/gmbOptimizationService';
import { napConsistencyService } from '../services/napConsistencyService';
import { localContentService } from '../services/localContentService';
import { geoSitemapService } from '../services/geoSitemapService';
import { localSchemaService } from '../services/localSchemaService';

interface GeoSEODashboardProps {
  selectedLocation?: string;
}

const GeoSEODashboard: React.FC<GeoSEODashboardProps> = ({ selectedLocation }) => {
  const [activeLocation, setActiveLocation] = useState<string>(selectedLocation || 'berlin');
  const [activeTab, setActiveTab] = useState<'overview' | 'gmb' | 'nap' | 'content' | 'analytics' | 'sitemaps'>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [seoReport, setSeoReport] = useState<LocalSEOReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeLocation) {
      loadLocationData(activeLocation);
    }
  }, [activeLocation]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Dashboard-Übersicht laden
      const overview = localSEOAnalyticsService.getDashboardOverview();
      const sitemapStats = geoSitemapService.getSitemapStatistics();
      const napOverview = napConsistencyService.getMonitoringDashboardData();
      
      setDashboardData({
        analytics: overview,
        sitemaps: sitemapStats,
        nap: napOverview
      });
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocationData = async (locationKey: string) => {
    try {
      const report = localSEOAnalyticsService.generateLocalSEOReport(locationKey);
      setSeoReport(report);
    } catch (error) {
      console.error('Fehler beim Laden der Standort-Daten:', error);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: number): string => {
    if (trend > 5) return '📈';
    if (trend < -5) return '📉';
    return '➡️';
  };

  const locationName = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === activeLocation)?.city || activeLocation;

  return (
    <div className="geo-seo-dashboard min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            GEO-SEO Management Dashboard
          </h1>
          <p className="text-gray-600">
            Lokale Suchmaschinenoptimierung für ZOE Solar - Alle Standorte im Überblick
          </p>
        </div>

        {/* Global KPIs - nur im Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Standorte</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.analytics.totalLocations}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Ø SEO Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(dashboardData.analytics.avgOverallScore)}`}>
                {dashboardData.analytics.avgOverallScore}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Traffic/Tag</p>
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(dashboardData.analytics.totalTraffic)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Ø Conversion</p>
              <p className="text-2xl font-bold text-purple-600">
                {dashboardData.analytics.avgConversionRate}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Aktive Alerts</p>
              <p className="text-2xl font-bold text-red-600">{dashboardData.analytics.totalAlerts}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Sitemap URLs</p>
              <p className="text-2xl font-bold text-indigo-600">
                {formatNumber(dashboardData.sitemaps.totalUrls)}
              </p>
            </div>
          </div>
        )}

        {/* Standort-Auswahl */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Standort auswählen:</h3>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_SERVICE_REGIONS.slice(0, 12).map((region) => (
              <button
                key={region.city}
                onClick={() => setActiveLocation(region.city.toLowerCase())}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeLocation === region.city.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {region.city}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 bg-white rounded-lg shadow">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'overview', label: 'Übersicht', icon: '📊' },
              { key: 'analytics', label: 'Analytics', icon: '📈' },
              { key: 'gmb', label: 'Google My Business', icon: '🏢' },
              { key: 'nap', label: 'NAP-Konsistenz', icon: '📍' },
              { key: 'content', label: 'Content Strategy', icon: '📝' },
              { key: 'sitemaps', label: 'Sitemaps', icon: '🗺️' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Location Performance Card */}
              {seoReport && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      SEO-Performance: {locationName}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-bold ${getScoreColor(seoReport.overallScore)}`}>
                        {seoReport.overallScore}/100
                      </span>
                      <span className="text-sm text-gray-500">Overall Score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatNumber(seoReport.metrics.organicTraffic.sessions)}
                      </p>
                      <p className="text-sm text-gray-600">Sessions heute</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {seoReport.metrics.organicTraffic.conversionRate}%
                      </p>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {seoReport.metrics.gmbMetrics.views.total}
                      </p>
                      <p className="text-sm text-gray-600">GMB Views</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {seoReport.metrics.citationMetrics.napScore}%
                      </p>
                      <p className="text-sm text-gray-600">NAP Score</p>
                    </div>
                  </div>

                  {/* Insights */}
                  {seoReport.insights.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">🔍 Aktuelle Insights</h4>
                      <div className="space-y-2">
                        {seoReport.insights.slice(0, 3).map((insight, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                            <span className="text-blue-500 mt-1">•</span>
                            <p className="text-sm text-gray-700">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alerts */}
                  {seoReport.alerts.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">⚠️ Aktive Alerts</h4>
                      <div className="space-y-2">
                        {seoReport.alerts.slice(0, 3).map((alert, index) => (
                          <div key={index} className={`p-3 rounded border-l-4 ${
                            alert.severity === 'critical' ? 'bg-red-50 border-red-400' :
                            alert.severity === 'high' ? 'bg-orange-50 border-orange-400' :
                            'bg-yellow-50 border-yellow-400'
                          }`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">{alert.title}</p>
                                <p className="text-sm text-gray-600">{alert.description}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {alert.severity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Recommendations */}
                  {seoReport.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">💡 Top Empfehlungen</h4>
                      <div className="space-y-3">
                        {seoReport.recommendations.slice(0, 3).map((rec, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">{rec.title}</h5>
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {rec.priority}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                                  {rec.category}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                            <p className="text-xs text-blue-600">💪 Impact: {rec.impact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Top Performing Locations */}
              {dashboardData && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🏆 Top-Standorte</h3>
                  <div className="space-y-3">
                    {dashboardData.analytics.topPerformingLocations.map((location: any, index: number) => (
                      <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{location.location}</p>
                            <p className="text-sm text-gray-600">{formatNumber(location.traffic)} Sessions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(location.score)}`}>
                            {location.score}%
                          </p>
                          <p className="text-xs text-gray-500">SEO Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && seoReport && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📈 Analytics für {locationName}
                </h3>
                
                {/* Keyword Performance */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">🎯 Keyword Rankings</h4>
                  <div className="space-y-2">
                    {seoReport.metrics.localSearchRankings.slice(0, 5).map((ranking, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{ranking.keyword}</p>
                          <p className="text-sm text-gray-600">Vol: {formatNumber(ranking.searchVolume)}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">#{ranking.position}</span>
                            <span className={`text-sm ${
                              ranking.position < ranking.previousPosition ? 'text-green-600' : 
                              ranking.position > ranking.previousPosition ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {getTrendIcon(ranking.previousPosition - ranking.position)}
                              {Math.abs(ranking.position - ranking.previousPosition)}
                            </span>
                          </div>
                          {ranking.localPack && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded mt-1">
                              Local Pack
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">🥊 Konkurrenzanalyse</h4>
                  <div className="space-y-2">
                    {seoReport.metrics.competitorAnalysis.map((competitor, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <p className="font-medium text-gray-900">{competitor.competitor}</p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>Pos: {competitor.avgPosition.toFixed(1)}</span>
                          <span>Sichtbarkeit: {competitor.visibility}%</span>
                          <span>Reviews: {competitor.gmbReviews}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GMB Tab */}
          {activeTab === 'gmb' && (
            <GMBDashboard selectedLocation={activeLocation} />
          )}

          {/* NAP Tab */}
          {activeTab === 'nap' && (
            <NAPConsistencyDashboard selectedLocation={activeLocation} />
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📝 Content Strategy für {locationName}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">📊 Content Performance</h4>
                  <div className="space-y-3">
                    {localContentService.getContentForLocation(activeLocation).slice(0, 3).map((content, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded">
                        <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                          <span>Views: {formatNumber(content.performance.views)}</span>
                          <span>CTR: {content.performance.ctr}%</span>
                          <span className={`px-2 py-1 rounded ${
                            content.status === 'published' ? 'bg-green-100 text-green-800' :
                            content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {content.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">📅 Content-Kalender</h4>
                  <div className="space-y-2">
                    {localContentService.getContentCalendar(activeLocation).slice(0, 5).map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-gray-600">{item.contentType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">{new Date(item.date).toLocaleDateString('de-DE')}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.priority === 'high' ? 'bg-red-100 text-red-800' :
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sitemaps Tab */}
          {activeTab === 'sitemaps' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🗺️ GEO-Sitemaps für {locationName}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">📄 Sitemap-Übersicht</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="font-medium text-blue-900">Haupt-Sitemap</p>
                      <p className="text-sm text-blue-700">
                        {geoSitemapService.getLocationSitemapEntries(activeLocation).length} URLs
                      </p>
                      <p className="text-xs text-blue-600">
                        /sitemaps/local-{activeLocation}.xml
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <p className="font-medium text-green-900">News-Sitemap</p>
                      <p className="text-sm text-green-700">Lokale News und Updates</p>
                      <p className="text-xs text-green-600">
                        /sitemaps/news-{activeLocation}.xml
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <p className="font-medium text-purple-900">Mobile-Sitemap</p>
                      <p className="text-sm text-purple-700">Mobile-optimierte URLs</p>
                      <p className="text-xs text-purple-600">
                        /sitemaps/mobile-{activeLocation}.xml
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">📊 URL-Kategorien</h4>
                  <div className="space-y-2">
                    {[
                      { category: 'Standortseiten', count: 1, priority: '0.9' },
                      { category: 'Service-Seiten', count: 5, priority: '0.8' },
                      { category: 'Anwendungsfälle', count: 3, priority: '0.75' },
                      { category: 'Ratgeber & Guides', count: 4, priority: '0.7' },
                      { category: 'Referenzprojekte', count: 5, priority: '0.6' },
                      { category: 'FAQ & Kontakt', count: 2, priority: '0.65' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-900">{item.category}</span>
                        <div className="flex gap-3 text-gray-600">
                          <span>{item.count} URLs</span>
                          <span>Priorität: {item.priority}</span>
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
    </div>
  );
};

export default GeoSEODashboard;