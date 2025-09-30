import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import PageHero from '../components/PageHero';
import { pageHeroData } from '../data/pageContent';

interface RankingData {
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  overall: 'good' | 'needs-improvement' | 'poor';
}

interface MonitoringData {
  rankings: RankingData[];
  coreWebVitals: CoreWebVitals;
  structuredData: {
    valid: number;
    total: number;
    issues: string[];
  };
  backlinks: {
    total: number;
    new: number;
    lost: number;
    domainAuthority: number;
  };
  aiSearch: {
    googleBard: number;
    chatGPT: number;
    perplexity: number;
    bingAI: number;
  };
  aiPlatformMonitoring?: {
    isRunning: boolean;
    lastCheck?: string;
    platforms: {
      chatgpt: { status: string; lastCheck?: string };
      googleBard: { status: string; lastCheck?: string };
      bingCopilot: { status: string; lastCheck?: string };
      perplexity: { status: string; lastCheck?: string };
      claude: { status: string; lastCheck?: string };
    };
  };
  historicalData?: {
    dates: string[];
    rankings: { [keyword: string]: number[] };
    backlinks: number[];
  };
}

const SEOMonitoringPage: React.FC = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedChart, setSelectedChart] = useState<'rankings' | 'backlinks'>('rankings');

  const heroData = {
    title: 'SEO Monitoring Dashboard',
    subtitle: 'Tracken Sie Ihre Rankings und optimieren Sie Ihre Sichtbarkeit',
    description: `Überwachen Sie Ihre Suchmaschinen-Performance in Echtzeit. Verfolgen Sie Rankings, Core Web Vitals, strukturierte Daten und AI-Suchergebnisse für maximale Sichtbarkeit.`,
    primaryCta: {
      text: 'Bericht generieren',
      href: '#reports'
    },
    secondaryCta: {
      text: 'Alerts einrichten',
      href: '#alerts'
    },
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'SEO Monitoring Dashboard mit Analytics Daten'
  };

  // Mock data für Demonstration mit historischen Daten
  useEffect(() => {
    const mockData: MonitoringData = {
      rankings: [
        { keyword: 'Agri-PV Deutschland', position: 3, previousPosition: 5, searchVolume: 2900, trend: 'up', lastUpdated: '2025-09-25' },
        { keyword: 'Photovoltaik Landwirtschaft', position: 2, previousPosition: 2, searchVolume: 1800, trend: 'stable', lastUpdated: '2025-09-25' },
        { keyword: 'Solaranlage Brandenburg', position: 1, previousPosition: 3, searchVolume: 880, trend: 'up', lastUpdated: '2025-09-25' },
        { keyword: 'Agri-PV Förderung 2025', position: 4, previousPosition: 2, searchVolume: 1600, trend: 'down', lastUpdated: '2025-09-25' },
        { keyword: 'Photovoltaik Gewerbe', position: 1, previousPosition: 1, searchVolume: 2400, trend: 'stable', lastUpdated: '2025-09-25' },
        { keyword: 'Solarpark Bayern', position: 6, previousPosition: 8, searchVolume: 720, trend: 'up', lastUpdated: '2025-09-25' },
      ],
      coreWebVitals: {
        lcp: 2.1,
        fid: 85,
        cls: 0.08,
        overall: 'good'
      },
      structuredData: {
        valid: 47,
        total: 48,
        issues: ['1 FAQ Schema fehlt in Agri-PV Bayern']
      },
      backlinks: {
        total: 1247,
        new: 23,
        lost: 3,
        domainAuthority: 68
      },
      aiSearch: {
        googleBard: 15,
        chatGPT: 8,
        perplexity: 12,
        bingAI: 6
      },
      aiPlatformMonitoring: {
        isRunning: true,
        lastCheck: '2025-09-29T22:40:00.000Z',
        platforms: {
          chatgpt: { status: 'offline', lastCheck: '2025-09-29T22:35:00.000Z' },
          googleBard: { status: 'offline', lastCheck: '2025-09-29T22:30:00.000Z' },
          bingCopilot: { status: 'offline', lastCheck: '2025-09-29T22:25:00.000Z' },
          perplexity: { status: 'offline', lastCheck: '2025-09-29T22:20:00.000Z' },
          claude: { status: 'offline', lastCheck: '2025-09-29T22:15:00.000Z' }
        }
      },
      historicalData: {
        dates: ['2025-09-19', '2025-09-20', '2025-09-21', '2025-09-22', '2025-09-23', '2025-09-24', '2025-09-25'],
        rankings: {
          'Agri-PV Deutschland': [8, 7, 6, 5, 4, 3, 3],
          'Photovoltaik Landwirtschaft': [3, 3, 2, 2, 2, 2, 2],
          'Solaranlage Brandenburg': [5, 4, 3, 2, 1, 1, 1]
        },
        backlinks: [1180, 1195, 1210, 1225, 1230, 1240, 1247]
      }
    };

    setTimeout(() => {
      setMonitoringData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
    }
  };

  const getCWVColor = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
        return value <= 2.5 ? 'text-green-600' : value <= 4 ? 'text-yellow-600' : 'text-red-600';
      case 'fid':
        return value <= 100 ? 'text-green-600' : value <= 300 ? 'text-yellow-600' : 'text-red-600';
      case 'cls':
        return value <= 0.1 ? 'text-green-600' : value <= 0.25 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const exportReport = () => {
    if (!monitoringData) return;

    const reportData = {
      timestamp: new Date().toISOString(),
      timeframe: selectedTimeframe,
      rankings: monitoringData.rankings,
      coreWebVitals: monitoringData.coreWebVitals,
      structuredData: monitoringData.structuredData,
      backlinks: monitoringData.backlinks,
      aiSearch: monitoringData.aiSearch
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const SimpleChart: React.FC<{ data: number[], labels: string[], title: string }> = ({ data, labels, title }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-48 flex items-end space-x-2">
          {data.map((value, index) => {
            const height = ((value - minValue) / (maxValue - minValue)) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500 rounded-t"
                  style={{ height: `${Math.max(height, 5)}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left">
                  {labels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Monitoring-Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Timeframe Selector */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">SEO Monitoring Dashboard</h1>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedTimeframe === timeframe
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {timeframe === '7d' ? '7 Tage' : timeframe === '30d' ? '30 Tage' : '90 Tage'}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Aktive Alerts</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ranking für "Agri-PV Förderung 2025" ist von Position 2 auf 4 gefallen</li>
                  <li>1 FAQ Schema fehlt in Agri-PV Bayern</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Trend Charts</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedChart('rankings')}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedChart === 'rankings' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Rankings
                </button>
                <button
                  onClick={() => setSelectedChart('backlinks')}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedChart === 'backlinks' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Backlinks
                </button>
              </div>
            </div>
            {selectedChart === 'rankings' && monitoringData?.historicalData ? (
              <div className="space-y-4">
                {Object.entries(monitoringData.historicalData.rankings).map(([keyword, positions]) => (
                  <SimpleChart
                    key={keyword}
                    data={positions}
                    labels={monitoringData.historicalData!.dates.map(d => d.split('-')[2])}
                    title={keyword}
                  />
                ))}
              </div>
            ) : (
              monitoringData?.historicalData && (
                <SimpleChart
                  data={monitoringData.historicalData.backlinks}
                  labels={monitoringData.historicalData.dates.map(d => d.split('-')[2])}
                  title="Backlinks Entwicklung"
                />
              )
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Übersicht</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Durchschnittliche Position:</span>
                <span className="font-bold text-lg">
                  {(monitoringData?.rankings.reduce((sum, r) => sum + r.position, 0) || 0) / (monitoringData?.rankings.length || 1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Top 3 Rankings:</span>
                <span className="font-bold text-green-600">
                  {monitoringData?.rankings.filter(r => r.position <= 3).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Verbesserungen:</span>
                <span className="font-bold text-green-600">
                  {monitoringData?.rankings.filter(r => r.trend === 'up').length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Verschlechterungen:</span>
                <span className="font-bold text-red-600">
                  {monitoringData?.rankings.filter(r => r.trend === 'down').length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Keyword Rankings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Keyword</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Position</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Trend</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Suchvolumen</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Letzte Änderung</th>
                </tr>
              </thead>
              <tbody>
                {monitoringData?.rankings.map((ranking, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{ranking.keyword}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        ranking.position <= 3 ? 'text-green-600' :
                        ranking.position <= 10 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        #{ranking.position}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-2xl">{getTrendIcon(ranking.trend)}</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {ranking.previousPosition > ranking.position ? '+' : ranking.previousPosition < ranking.position ? '-' : ''}
                        {Math.abs(ranking.previousPosition - ranking.position)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{ranking.searchVolume.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">{ranking.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Largest Contentful Paint</h3>
            <div className={`text-3xl font-bold ${getCWVColor('lcp', monitoringData?.coreWebVitals.lcp || 0)}`}>
              {monitoringData?.coreWebVitals.lcp}s
            </div>
            <p className="text-sm text-gray-600 mt-2">Ziel: ≤ 2.5s</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">First Input Delay</h3>
            <div className={`text-3xl font-bold ${getCWVColor('fid', monitoringData?.coreWebVitals.fid || 0)}`}>
              {monitoringData?.coreWebVitals.fid}ms
            </div>
            <p className="text-sm text-gray-600 mt-2">Ziel: ≤ 100ms</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cumulative Layout Shift</h3>
            <div className={`text-3xl font-bold ${getCWVColor('cls', monitoringData?.coreWebVitals.cls || 0)}`}>
              {monitoringData?.coreWebVitals.cls}
            </div>
            <p className="text-sm text-gray-600 mt-2">Ziel: ≤ 0.1</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gesamt-Score</h3>
            <div className={`text-3xl font-bold ${
              monitoringData?.coreWebVitals.overall === 'good' ? 'text-green-600' :
              monitoringData?.coreWebVitals.overall === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {monitoringData?.coreWebVitals.overall === 'good' ? 'Gut' :
               monitoringData?.coreWebVitals.overall === 'needs-improvement' ? 'Verbesserung nötig' : 'Schlecht'}
            </div>
            <p className="text-sm text-gray-600 mt-2">Core Web Vitals</p>
          </div>
        </div>

        {/* Structured Data & Backlinks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Strukturierte Daten</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Validierte Schemas:</span>
                <span className="font-bold text-green-600">
                  {monitoringData?.structuredData.valid}/{monitoringData?.structuredData.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${((monitoringData?.structuredData.valid || 0) / (monitoringData?.structuredData.total || 1)) * 100}%` }}
                ></div>
              </div>
              {monitoringData?.structuredData.issues.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-red-600 mb-2">Probleme:</p>
                  <ul className="text-sm text-red-600 space-y-1">
                    {monitoringData.structuredData.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Backlink-Profil</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Gesamt Backlinks:</span>
                <span className="font-bold">{monitoringData?.backlinks.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Neue Backlinks:</span>
                <span className="font-bold text-green-600">+{monitoringData?.backlinks.new}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Verlorene Backlinks:</span>
                <span className="font-bold text-red-600">-{monitoringData?.backlinks.lost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Domain Authority:</span>
                <span className="font-bold">{monitoringData?.backlinks.domainAuthority}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Search Visibility */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">AI-Suchmaschinen Sichtbarkeit</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{monitoringData?.aiSearch.googleBard}</div>
              <p className="text-sm text-gray-600">Google Bard</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{monitoringData?.aiSearch.chatGPT}</div>
              <p className="text-sm text-gray-600">ChatGPT</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{monitoringData?.aiSearch.perplexity}</div>
              <p className="text-sm text-gray-600">Perplexity</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">{monitoringData?.aiSearch.bingAI}</div>
              <p className="text-sm text-gray-600">Bing AI</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Anzahl der Male, die Ihre Inhalte in AI-Antworten zitiert wurden ({selectedTimeframe})
          </p>
        </div>

        {/* AI Platform Monitoring */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">AI-Platform Monitoring</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${monitoringData?.aiPlatformMonitoring?.isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {monitoringData?.aiPlatformMonitoring?.isRunning ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {monitoringData?.aiPlatformMonitoring?.platforms && Object.entries(monitoringData.aiPlatformMonitoring.platforms).map(([platformId, platform]) => (
              <div key={platformId} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {platformId === 'googleBard' ? 'Google Bard' :
                     platformId === 'bingCopilot' ? 'Bing Copilot' :
                     platformId === 'chatgpt' ? 'ChatGPT' :
                     platformId === 'perplexity' ? 'Perplexity' :
                     platformId === 'claude' ? 'Claude' : platformId}
                  </h4>
                  <div className={`w-2 h-2 rounded-full ${
                    platform.status === 'online' ? 'bg-green-500' :
                    platform.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Status: <span className={`font-medium ${
                    platform.status === 'online' ? 'text-green-600' :
                    platform.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{platform.status}</span></p>
                  {platform.lastCheck && (
                    <p>Letzte Prüfung: {new Date(platform.lastCheck).toLocaleString('de-DE')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Letzte globale Prüfung:</span>
              <span>{monitoringData?.aiPlatformMonitoring?.lastCheck ?
                new Date(monitoringData.aiPlatformMonitoring.lastCheck).toLocaleString('de-DE') :
                'Keine Daten'}</span>
            </div>
            <div className="mt-4 flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                🔄 Manuelle Prüfung
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                ⚙️ Konfiguration
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                📊 Bericht anzeigen
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Monitoring optimieren</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Richten Sie automatische Alerts ein, exportieren Sie Berichte oder analysieren Sie detaillierte
            Performance-Metriken für Ihre SEO-Strategie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={exportReport}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📊 Bericht exportieren
            </button>
            <button className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
              🔔 Alerts einrichten
            </button>
            <button className="border-2 border-green-600 text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-700 hover:text-white transition-colors">
              📈 Detaillierte Analyse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOMonitoringPage;