import React, { useState, useEffect } from 'react';
import { adminAuthService, User, Session } from '../../src/services/adminAuthService';
import { marketingAssetsService, MarketingMetrics } from '../../src/services/marketingAssetsService';
import { newsletterService, NewsletterMetrics } from '../../services/newsletterService';

interface AdminDashboardProps {
  session: Session;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'marketing' | 'leads' | 'users' | 'analytics'>('overview');
  const [marketingMetrics, setMarketingMetrics] = useState<MarketingMetrics | null>(null);
  const [newsletterMetrics, setNewsletterMetrics] = useState<NewsletterMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [marketingData, newsletterData] = await Promise.all([
        marketingAssetsService.getMetrics(),
        newsletterService.getMetrics()
      ]);
      setMarketingMetrics(marketingData);
      setNewsletterMetrics(newsletterData);
    } catch (error) {
      console.error('❌ Dashboard Daten konnten nicht geladen werden:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    return session.permissions.includes(permission);
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Active Assets */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Aktive Assets</dt>
              <dd className="text-lg font-medium text-gray-900">{marketingMetrics?.totalActiveAssets || 0}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Total Impressions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Impressions</dt>
              <dd className="text-lg font-medium text-gray-900">{marketingMetrics?.totalImpressions?.toLocaleString() || 0}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Newsletter Subscribers */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Newsletter Abonnenten</dt>
              <dd className="text-lg font-medium text-gray-900">{newsletterMetrics?.totalSubscribers || 0}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Average Conversion Rate */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Avg. Conversion Rate</dt>
              <dd className="text-lg font-medium text-gray-900">{marketingMetrics?.averageConversionRate?.toFixed(1) || 0}%</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Marketing Performance</h3>

          {marketingMetrics ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assets by Type */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Assets nach Typ</h4>
                <div className="space-y-2">
                  {Object.entries(marketingMetrics.assetsByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{type}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Assets */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Top Performer</h4>
                <div className="space-y-2">
                  {marketingMetrics.topPerformingAssets.map((asset) => (
                    <div key={asset.id} className="border-l-4 border-green-500 pl-3">
                      <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      <div className="text-xs text-gray-500">Conversion: {asset.conversionRate.toFixed(1)}% | ROI: {asset.roi.toFixed(0)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Lade Marketing-Daten...
            </div>
          )}
        </div>
      </div>

      {/* Current Campaigns */}
      {marketingMetrics?.currentCampaigns && marketingMetrics.currentCampaigns.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Aktuelle Kampagnen</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kampagne</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enddatum</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marketingMetrics.currentCampaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(campaign.endDate).toLocaleDateString('de-DE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Lead-Übersicht</h3>

          {newsletterMetrics ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* New Leads */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{newsletterMetrics.newLeadsToday}</div>
                <div className="text-sm text-gray-500">Neue Leads heute</div>
              </div>

              {/* This Week */}
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{newsletterMetrics.newLeadsWeek}</div>
                <div className="text-sm text-gray-500">Neue Leads diese Woche</div>
              </div>

              {/* Conversion Rate */}
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{newsletterMetrics.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-500">Conversion Rate</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Lade Lead-Daten...
            </div>
          )}

          {/* Leads by Source */}
          {newsletterMetrics && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Leads nach Quelle</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(newsletterMetrics.leadsBySource).map(([source, count]) => (
                  <div key={source} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-600">{source}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Analytics Übersicht</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget vs ROI */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-700 mb-3">Budget & ROI</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gesamtbudget:</span>
                  <span className="text-sm font-medium">€{marketingMetrics?.totalBudget?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gesamt-ROI:</span>
                  <span className="text-sm font-medium text-green-600">{marketingMetrics?.totalROI?.toFixed(0) || 0}%</span>
                </div>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-700 mb-3">Performance Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Durchschn. CTR:</span>
                  <span className="text-sm font-medium">{((marketingMetrics?.totalClicks || 0) / (marketingMetrics?.totalImpressions || 1) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost per Lead:</span>
                  <span className="text-sm font-medium">€{marketingMetrics && newsletterMetrics ? (marketingMetrics.totalBudget / newsletterMetrics.newLeadsWeek || 0).toFixed(0) : 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Lade Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ZOE Solar Admin Dashboard</h1>
              <span className="ml-4 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {session.user.role.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Angemeldet als: {session.user.name}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Übersicht
            </button>

            {hasPermission('marketing_read') && (
              <button
                onClick={() => setActiveTab('marketing')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'marketing'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Marketing
              </button>
            )}

            {hasPermission('leads_read') && (
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leads'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leads
              </button>
            )}

            {hasPermission('analytics_read') && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'marketing' && renderMarketing()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'analytics' && renderAnalytics()}
      </main>
    </div>
  );
};

export default AdminDashboard;