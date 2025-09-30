import React, { useState, useEffect } from 'react';
import { napConsistencyService, NAPConsistencyReport, DirectoryListing, CitationOpportunity } from '../services/napConsistencyService';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

interface NAPDashboardProps {
  selectedLocation?: string;
}

const NAPConsistencyDashboard: React.FC<NAPDashboardProps> = ({ selectedLocation }) => {
  const [activeLocation, setActiveLocation] = useState<string>(selectedLocation || 'berlin');
  const [report, setReport] = useState<NAPConsistencyReport | null>(null);
  const [listings, setListings] = useState<DirectoryListing[]>([]);
  const [opportunities, setOpportunities] = useState<CitationOpportunity[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'opportunities' | 'cleanup'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeLocation) {
      loadLocationData(activeLocation);
    }
  }, [activeLocation]);

  const loadDashboardData = () => {
    const data = napConsistencyService.getMonitoringDashboardData();
    setDashboardData(data);
  };

  const loadLocationData = async (locationKey: string) => {
    setLoading(true);
    try {
      const napReport = napConsistencyService.performNAPAudit(locationKey);
      const locationListings = napConsistencyService.getListingsForLocation(locationKey);
      const citationOpportunities = napConsistencyService.findCitationOpportunities(locationKey);
      
      setReport(napReport);
      setListings(locationListings);
      setOpportunities(citationOpportunities);
    } catch (error) {
      console.error('Fehler beim Laden der NAP-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCitation = async (opportunity: CitationOpportunity) => {
    try {
      const result = await napConsistencyService.submitCitation(opportunity, activeLocation);
      if (result.success) {
        alert(`Erfolg: ${result.message}`);
        loadLocationData(activeLocation); // Refresh data
      } else {
        alert(`Fehler: ${result.message}`);
      }
    } catch (error) {
      alert('Fehler bei der Citation-Einreichung');
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      const result = await napConsistencyService.cleanupDuplicates(activeLocation);
      alert(`Bereinigung abgeschlossen: ${result.removed} entfernt, ${result.merged} zusammengeführt`);
      loadLocationData(activeLocation);
    } catch (error) {
      alert('Fehler bei der Duplikat-Bereinigung');
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: DirectoryListing['status']): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'outdated': return 'bg-orange-100 text-orange-800';
      case 'duplicate': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  const locationName = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === activeLocation)?.city || activeLocation;

  return (
    <div className="nap-consistency-dashboard bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          NAP Consistency Management - ZOE Solar
        </h2>

        {/* Global Overview */}
        {dashboardData && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{dashboardData.totalLocations}</p>
              <p className="text-sm text-gray-600">Standorte</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatNumber(dashboardData.totalListings)}</p>
              <p className="text-sm text-gray-600">Einträge</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${getScoreColor(dashboardData.averageScore)}`}>
                {dashboardData.averageScore}%
              </p>
              <p className="text-sm text-gray-600">Ø Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{dashboardData.criticalIssues}</p>
              <p className="text-sm text-gray-600">Kritische Issues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{dashboardData.pendingSubmissions}</p>
              <p className="text-sm text-gray-600">Ausstehend</p>
            </div>
          </div>
        )}

        {/* Standort-Auswahl */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRIMARY_SERVICE_REGIONS.slice(0, 10).map((region) => (
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

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'overview', label: 'Übersicht' },
            { key: 'listings', label: 'Verzeichnisse' },
            { key: 'opportunities', label: 'Chancen' },
            { key: 'cleanup', label: 'Bereinigung' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && report && (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-blue-900">
                    NAP Score für {locationName}
                  </h3>
                  <span className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                    {report.overallScore}/100
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{report.consistentListings}</p>
                    <p className="text-sm text-gray-600">Konsistent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{report.inconsistentListings}</p>
                    <p className="text-sm text-gray-600">Inkonsistent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{report.missingListings}</p>
                    <p className="text-sm text-gray-600">Fehlend</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{report.duplicateListings}</p>
                    <p className="text-sm text-gray-600">Duplikate</p>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {report.issues.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Aktuelle Issues ({report.issues.length})
                  </h4>
                  <div className="space-y-3">
                    {report.issues.slice(0, 5).map((issue, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{issue.directory}</p>
                          <p className="text-sm text-gray-600">{issue.description}</p>
                          <p className="text-xs text-blue-600 mt-1">{issue.actionRequired}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {report.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-3">Empfehlungen</h4>
                  <ul className="space-y-2">
                    {report.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-yellow-700">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Verzeichnis-Einträge für {locationName} ({listings.length})
              </h3>
              
              <div className="grid gap-4">
                {listings.map((listing, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{listing.directoryName}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(listing.status)}`}>
                          {listing.status}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          DA: {listing.authority}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(listing.lastUpdated).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Name:</p>
                        <p className="text-gray-600">{listing.napData.businessName}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Telefon:</p>
                        <p className="text-gray-600">{listing.napData.phone}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Adresse:</p>
                        <p className="text-gray-600">{listing.napData.address.fullAddress}</p>
                      </div>
                    </div>

                    {listing.issues.length > 0 && (
                      <div className="mt-3 p-2 bg-red-50 rounded">
                        <p className="text-xs font-medium text-red-800">Issues:</p>
                        <p className="text-xs text-red-600">{listing.issues.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities Tab */}
          {activeTab === 'opportunities' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Citation-Chancen für {locationName} ({opportunities.length})
                </h3>
              </div>
              
              <div className="grid gap-4">
                {opportunities.map((opportunity, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{opportunity.directoryName}</h4>
                        <p className="text-sm text-gray-600">{opportunity.category}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          opportunity.priority === 'high' ? 'bg-red-100 text-red-800' :
                          opportunity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {opportunity.priority} Priorität
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Impact: {opportunity.potentialImpact}/10
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="font-medium text-gray-700">Authority:</p>
                        <p className="text-gray-600">{opportunity.authority}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Geschätzte Zeit:</p>
                        <p className="text-gray-600">{opportunity.estimatedTimeToSubmit} Min</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium text-gray-700 text-sm">Anforderungen:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {opportunity.requirements.map((req, reqIndex) => (
                          <span key={reqIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubmitCitation(opportunity)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Citation einreichen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cleanup Tab */}
          {activeTab === 'cleanup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Bereinigungstools für {locationName}
              </h3>

              {/* Duplicate Cleanup */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Duplikat-Bereinigung</h4>
                    <p className="text-sm text-gray-600">Entfernt oder führt doppelte Einträge zusammen</p>
                  </div>
                  <button
                    onClick={handleCleanupDuplicates}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                  >
                    Bereinigen
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Gefundene Duplikate: {listings.filter(l => l.status === 'duplicate').length}</p>
                </div>
              </div>

              {/* Outdated Listings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Veraltete Einträge</h4>
                <div className="space-y-2">
                  {listings.filter(l => l.status === 'outdated').map((listing, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{listing.directoryName}</span>
                      <span className="text-xs text-gray-500">
                        Letztes Update: {new Date(listing.lastUpdated).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Bulk-Aktionen</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    Alle NAP-Daten aktualisieren
                  </button>
                  <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                    Alle Verzeichnisse überprüfen
                  </button>
                  <button className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors">
                    Batch Citation-Einreichung
                  </button>
                  <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                    Monitoring aktivieren
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NAPConsistencyDashboard;