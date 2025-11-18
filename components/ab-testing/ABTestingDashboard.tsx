import React, { useState, useEffect } from 'react';
import { abTestingService, ABTest, ABTestResult } from '../../src/services/abTestingService';
import { motion, AnimatePresence } from 'framer-motion';

interface ABTestingDashboardProps {
  session: any;
  onLogout: () => void;
}

const ABTestingDashboard: React.FC<ABTestingDashboardProps> = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'running' | 'completed' | 'create'>('overview');
  const [tests, setTests] = useState<ABTest[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTestsAndStatistics();
  }, []);

  const loadTestsAndStatistics = async () => {
    try {
      setLoading(true);
      const stats = abTestingService.getTestStatistics();
      setStatistics(stats);
      // In einer echten Implementierung würden wir hier Tests aus Notion laden
      // Für Demo-Zwecke verwenden wir die Mock-Daten
    } catch (error) {
      console.error('❌ Fehler beim Laden der A/B Test Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (testData: any) => {
    try {
      await abTestingService.createSampleTest();
      setShowCreateModal(false);
      await loadTestsAndStatistics();
    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Tests:', error);
    }
  };

  const handleStartTest = async (testId: string) => {
    try {
      await abTestingService.startTest(testId);
      await loadTestsAndStatistics();
    } catch (error) {
      console.error('❌ Fehler beim Starten des Tests:', error);
    }
  };

  const handleStopTest = async (testId: string) => {
    try {
      const result = await abTestingService.stopTest(testId);
      console.log('Test Ergebnis:', result);
      await loadTestsAndStatistics();
    } catch (error) {
      console.error('❌ Fehler beim Stoppen des Tests:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Gesamte Tests</dt>
                <dd className="text-lg font-medium text-gray-900">{statistics?.totalTests || 0}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Laufende Tests</dt>
                <dd className="text-lg font-medium text-gray-900">{statistics?.runningTests || 0}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Abgeschlossen</dt>
                <dd className="text-lg font-medium text-gray-900">{statistics?.completedTests || 0}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Teilnehmer</dt>
                <dd className="text-lg font-medium text-gray-900">{statistics?.totalParticipants?.toLocaleString() || 0}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Test Types */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Test-Typen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Popup', 'Banner', 'Landing Page', 'Call to Action'].map((type) => (
              <div key={type} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 5) + 1}</div>
                <div className="text-sm text-gray-600">{type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRunningTests = () => (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Laufende Tests</h3>

          {/* Example Running Test */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-md font-medium text-gray-900">Black Friday Popup Headline Test</h4>
                <p className="text-sm text-gray-500">Test verschiedener Headlines für das Black Friday Popup</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Running</span>
                <button
                  onClick={() => handleStopTest('test_123')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Stoppen
                </button>
              </div>
            </div>

            {/* Variant Performance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Control</div>
                <div className="text-lg font-semibold text-gray-900">20% Rabatt auf alle Solaranlagen</div>
                <div className="text-sm text-gray-600">Rate: 3.2%</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Variant A</div>
                <div className="text-lg font-semibold text-gray-900">🎉 Black Friday: Sichern Sie sich 20% Rabatt!</div>
                <div className="text-sm text-gray-600">Rate: 4.1%</div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Testfortschritt</span>
                <span>65% (650/1000)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Current Winner */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">
                🎯 Aktuell führend: Variant A (+28% Verbesserung)
              </div>
              <div className="text-xs text-green-600 mt-1">
                Noch nicht statistisch signifikant (p=0.08)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompletedTests = () => (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Abgeschlossene Tests</h3>

          {/* Example Completed Test */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-md font-medium text-gray-900">Timer Popup Color Scheme Test</h4>
                <p className="text-sm text-gray-500">Test verschiedener Farbschemata - Dauer: 14 Tage</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Completed</span>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Control (Grün/Weiß)</div>
                <div className="text-sm text-gray-600">Rate: 2.8%</div>
                <div className="text-xs text-gray-500">Teilnehmer: 450</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Winner (Blau/Gelb)</div>
                <div className="text-sm font-medium text-green-800">Rate: 3.5%</div>
                <div className="text-xs text-gray-500">Teilnehmer: 452</div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">+25%</div>
                <div className="text-xs text-gray-500">Verbesserung</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">98%</div>
                <div className="text-xs text-gray-500">Konfidenz</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">€2,500</div>
                <div className="text-xs text-gray-500">Zusätzlicher Umsatz</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                💡 Empfehlung: Implementieren Sie das Blau/Gelb Schema sofort
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreateTest = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Neuen A/B Test erstellen</h3>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCreateTest(e); }}>
            {/* Test Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="z.B. Black Friday Popup Headline Test"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Beschreiben Sie was Sie testen möchten und welche Hypothese Sie haben..."
              />
            </div>

            {/* Test Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Typ</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Wählen Sie einen Test-Typ</option>
                <option value="popup">Popup</option>
                <option value="banner">Banner</option>
                <option value="landing_page">Landing Page</option>
                <option value="call_to_action">Call to Action</option>
                <option value="headline">Headline</option>
                <option value="color_scheme">Color Scheme</option>
              </select>
            </div>

            {/* Statistical Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stichprobengröße</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1000"
                  defaultValue="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfidenzlevel (%)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="95">95%</option>
                  <option value="90">90%</option>
                  <option value="99">99%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mindest. Effekt (%)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10"
                  defaultValue="10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Test erstellen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">A/B Testing Dashboard</h1>
              <span className="ml-4 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Conversion Optimization
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab('running')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'running'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Laufende Tests
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Abgeschlossen
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Neuer Test
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Lade A/B Testing Daten...</div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'running' && renderRunningTests()}
            {activeTab === 'completed' && renderCompletedTests()}
            {activeTab === 'create' && renderCreateTest()}
          </>
        )}
      </main>
    </div>
  );
};

export default ABTestingDashboard;