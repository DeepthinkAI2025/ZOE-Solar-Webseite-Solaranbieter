import React, { useState, useEffect } from 'react';
import { gmbOptimizationService } from '../services/gmbOptimizationService';
import { gmbGeoIntegrationService } from '../services/gmbGeoIntegrationService';
import { localSEOAnalyticsService } from '../services/localSEOAnalyticsService';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

interface GMBManagementDashboardProps {
  className?: string;
}

export const GMBManagementDashboard: React.FC<GMBManagementDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'reviews' | 'qa' | 'analytics' | 'competitors'>('overview');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [integratedReports, setIntegratedReports] = useState<any>({});

  useEffect(() => {
    loadSystemHealth();
    loadIntegratedReports();
  }, []);

  const loadSystemHealth = () => {
    const health = gmbGeoIntegrationService.getSystemHealth();
    setSystemHealth(health);
  };

  const loadIntegratedReports = () => {
    const reports: any = {};
    PRIMARY_SERVICE_REGIONS.slice(0, 5).forEach(region => {
      const locationKey = region.city.toLowerCase();
      reports[locationKey] = gmbGeoIntegrationService.generateIntegratedReport(locationKey);
    });
    setIntegratedReports(reports);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* System Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">System-Status</h3>
        {systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${getStatusColor(systemHealth.overallStatus)}`}>
              <div className="text-sm font-medium">Gesamtstatus</div>
              <div className="text-2xl font-bold capitalize">{systemHealth.overallStatus}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-600">GMB-Status</div>
              <div className="text-2xl font-bold text-blue-700 capitalize">{systemHealth.gmbStatus}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-600">GEO-Status</div>
              <div className="text-2xl font-bold text-purple-700 capitalize">{systemHealth.geoStatus}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-600">Aktive Integrationen</div>
              <div className="text-2xl font-bold text-green-700">{systemHealth.activeIntegrations}</div>
            </div>
          </div>
        )}
      </div>

      {/* Standort-Übersicht */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Standort-Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRIMARY_SERVICE_REGIONS.slice(0, 6).map(region => {
            const locationKey = region.city.toLowerCase();
            const report = integratedReports[locationKey];
            if (!report) return null;

            return (
              <div key={locationKey} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900">{region.city}</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>GMB-Bewertung:</span>
                    <span className="font-medium">{report.gmbData.metrics.reviews.averageRating}⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GMB-Views:</span>
                    <span className="font-medium">{report.gmbData.metrics.views.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SEO-Score:</span>
                    <span className="font-medium">{report.localSEOData.overallScore}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integrierte Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Integrierte Insights</h3>
        <div className="space-y-3">
          {Object.entries(integratedReports).slice(0, 3).map(([locationKey, report]: [string, any]) => (
            <div key={locationKey} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium capitalize">{locationKey}</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {report.integratedInsights.slice(0, 2).map((insight: string, idx: number) => (
                  <li key={idx}>• {insight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPostsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Post-Management</h3>
        <div className="space-y-4">
          {PRIMARY_SERVICE_REGIONS.slice(0, 3).map(region => {
            const locationKey = region.city.toLowerCase();
            const posts = gmbOptimizationService.getPostsForLocation(locationKey);

            return (
              <div key={locationKey} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{region.city}</h4>
                <div className="space-y-2">
                  {posts.slice(0, 3).map((post: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{post.title}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(post.scheduledPublishTime).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        post.status === 'published' ? 'bg-green-100 text-green-700' :
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {post.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Review-Management</h3>
        <div className="space-y-4">
          {PRIMARY_SERVICE_REGIONS.slice(0, 3).map(region => {
            const locationKey = region.city.toLowerCase();
            const reviews = gmbOptimizationService.getReviewsForLocation(locationKey);

            return (
              <div key={locationKey} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{region.city}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
                    <div className="text-sm text-gray-500">Bewertungen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {reviews.filter((r: any) => r.rating >= 4).length}
                    </div>
                    <div className="text-sm text-gray-500">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {reviews.filter((r: any) => r.rating === 3).length}
                    </div>
                    <div className="text-sm text-gray-500">Neutrale</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {reviews.slice(0, 3).map((review: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium">{review.authorName}</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(review.publishTime).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderQATab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Q&A-Management</h3>
        <div className="space-y-4">
          {PRIMARY_SERVICE_REGIONS.slice(0, 3).map(region => {
            const locationKey = region.city.toLowerCase();
            const questions = gmbOptimizationService.getQuestionsForLocation(locationKey);

            return (
              <div key={locationKey} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{region.city}</h4>
                <div className="space-y-2">
                  {questions.slice(0, 3).map((question: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-sm mb-1">{question.text}</div>
                      <div className="text-xs text-gray-500 mb-2">
                        {question.authorName} • {new Date(question.createTime).toLocaleDateString('de-DE')}
                      </div>
                      {question.answer && (
                        <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                          <strong>Antwort:</strong> {question.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Analytics & Reporting</h3>
        <div className="space-y-4">
          {PRIMARY_SERVICE_REGIONS.slice(0, 3).map(region => {
            const locationKey = region.city.toLowerCase();
            const report = integratedReports[locationKey];
            if (!report) return null;

            return (
              <div key={locationKey} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{region.city}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {report.gmbData.metrics.views.total}
                    </div>
                    <div className="text-sm text-gray-500">GMB-Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {report.gmbData.metrics.actions.total}
                    </div>
                    <div className="text-sm text-gray-500">GMB-Actions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {report.localSEOData.overallScore}
                    </div>
                    <div className="text-sm text-gray-500">SEO-Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {report.localSEOData.alerts.filter((a: any) => a.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-500">Aktive Alerts</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCompetitorsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Competitor Analysis</h3>
        <div className="space-y-4">
          {PRIMARY_SERVICE_REGIONS.slice(0, 3).map(region => {
            const locationKey = region.city.toLowerCase();
            const competitors = gmbOptimizationService.getCompetitorAnalysis(locationKey);

            return (
              <div key={locationKey} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{region.city}</h4>
                <div className="space-y-2">
                  {competitors.slice(0, 3).map((competitor: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{competitor.name}</div>
                        <div className="text-xs text-gray-500">
                          {competitor.reviews} Bewertungen • {competitor.rating}⭐
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Position: {competitor.position}</div>
                        <div className="text-xs text-gray-500">
                          {competitor.visibility}% Sichtbarkeit
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`gmb-management-dashboard ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">GMB Management Dashboard</h2>
        <p className="text-gray-600">
          Umfassendes Management-System für Google My Business Profile und lokale SEO-Optimierung
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Übersicht', icon: '📊' },
            { id: 'posts', label: 'Posts', icon: '📝' },
            { id: 'reviews', label: 'Bewertungen', icon: '⭐' },
            { id: 'qa', label: 'Q&A', icon: '❓' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'competitors', label: 'Konkurrenten', icon: '🏆' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'posts' && renderPostsTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
        {activeTab === 'qa' && renderQATab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'competitors' && renderCompetitorsTab()}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => gmbGeoIntegrationService.syncAllLocations()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Daten synchronisieren
        </button>
        <button
          onClick={() => loadIntegratedReports()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          📊 Reports aktualisieren
        </button>
        <button
          onClick={() => loadSystemHealth()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          🔍 System-Status prüfen
        </button>
      </div>
    </div>
  );
};