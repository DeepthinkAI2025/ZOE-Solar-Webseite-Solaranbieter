import React, { useState, useEffect } from 'react';
import { gmbOptimizationService, GMBProfile, GMBPost, GMBInsights } from '../services/gmbOptimizationService';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

interface GMBDashboardProps {
  selectedLocation?: string;
}

const GMBDashboard: React.FC<GMBDashboardProps> = ({ selectedLocation }) => {
  const [profiles, setProfiles] = useState<Map<string, GMBProfile>>(new Map());
  const [activeLocation, setActiveLocation] = useState<string>(selectedLocation || 'berlin');
  const [insights, setInsights] = useState<GMBInsights | null>(null);
  const [posts, setPosts] = useState<GMBPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfiles(gmbOptimizationService.getAllProfiles());
  }, []);

  useEffect(() => {
    if (activeLocation) {
      loadLocationData(activeLocation);
    }
  }, [activeLocation]);

  const loadLocationData = async (locationKey: string) => {
    setLoading(true);
    try {
      const locationInsights = gmbOptimizationService.generatePerformanceMetrics(locationKey);
      const locationPosts = gmbOptimizationService.getPostsForLocation(locationKey);
      
      // Automatische Posts generieren falls keine vorhanden
      if (locationPosts.length === 0) {
        const automatedPosts = gmbOptimizationService.generateAutomatedPosts(locationKey);
        setPosts(automatedPosts);
      } else {
        setPosts(locationPosts);
      }
      
      setInsights(locationInsights);
    } catch (error) {
      console.error('Fehler beim Laden der GMB-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    const newPost = gmbOptimizationService.createLocalPost(
      activeLocation,
      'update',
      'Neue Photovoltaik-Projekte verfügbar',
      'Entdecken Sie unsere neuesten Solaranlagen-Projekte in {CITY}! Kostenlose Beratung und individuelle Lösungen für Ihr Eigenheim oder Gewerbe. Jetzt informieren! ☀️🏠 #Solar{CITY} #Photovoltaik{STATE}',
      {
        actionType: 'learn_more',
        actionUrl: `https://www.zoe-solar.de/kontakt?region=${activeLocation}`,
        keywords: [`Solar ${activeLocation}`, 'Photovoltaik Beratung', 'PV Anlagen']
      }
    );
    
    setPosts([newPost, ...posts]);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  const currentProfile = profiles.get(activeLocation);
  const locationName = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === activeLocation)?.city || activeLocation;

  return (
    <div className="gmb-dashboard bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Google My Business Dashboard - ZOE Solar
        </h2>
        
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
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil-Übersicht */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Profil: {locationName}
              </h3>
              
              {currentProfile && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Adresse</p>
                    <p className="text-sm text-gray-700">{currentProfile.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Kategorien</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentProfile.categories.slice(0, 3).map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Öffnungszeiten</p>
                    <p className="text-xs text-gray-600">Mo-Fr: 08:00-17:00</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Fotos</p>
                    <div className="flex gap-2 mt-1">
                      {currentProfile.photos.slice(0, 3).map((photo) => (
                        <div
                          key={photo.id}
                          className="w-12 h-12 bg-gray-200 rounded overflow-hidden"
                        >
                          <img
                            src={photo.url}
                            alt={photo.altText}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyN0M2IDI3IDYgMTMgMjAgMTNTMzQgMjcgMjAgMjdaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FAQs */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Lokale FAQs</h4>
              <div className="space-y-2">
                {gmbOptimizationService.generateLocalFAQs(activeLocation).slice(0, 2).map((faq, index) => (
                  <div key={index} className="text-xs">
                    <p className="font-medium text-gray-800">{faq.question}</p>
                    <p className="text-gray-600 mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metriken */}
          <div className="lg:col-span-2">
            {insights && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Performance Metriken (30 Tage)
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatNumber(insights.metrics.views.search + insights.metrics.views.maps)}
                    </p>
                    <p className="text-sm text-green-700">Gesamtaufrufe</p>
                    <p className="text-xs text-gray-500">Suche: {formatNumber(insights.metrics.views.search)}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatNumber(insights.metrics.actions.website + insights.metrics.actions.direction + insights.metrics.actions.phone)}
                    </p>
                    <p className="text-sm text-blue-700">Aktionen</p>
                    <p className="text-xs text-gray-500">Website: {formatNumber(insights.metrics.actions.website)}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {insights.metrics.queries[0]?.position.toFixed(1) || 'N/A'}
                    </p>
                    <p className="text-sm text-purple-700">Ø Position</p>
                    <p className="text-xs text-gray-500">Top Keyword</p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {formatNumber(insights.metrics.photos.viewsOwner + insights.metrics.photos.viewsCustomer)}
                    </p>
                    <p className="text-sm text-orange-700">Foto-Aufrufe</p>
                    <p className="text-xs text-gray-500">Eigene: {formatNumber(insights.metrics.photos.viewsOwner)}</p>
                  </div>
                </div>

                {/* Top Suchanfragen */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Top Suchanfragen</h4>
                  <div className="space-y-2">
                    {insights.metrics.queries.map((query, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{query.query}</span>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>{formatNumber(query.impressions)} Impressionen</span>
                          <span className={`font-medium ${query.position <= 2 ? 'text-green-600' : query.position <= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                            Pos. {query.position.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posts Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Posts</h3>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Neuer Post
                </button>
              </div>
              
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          post.type === 'update' ? 'bg-blue-100 text-blue-700' :
                          post.type === 'event' ? 'bg-green-100 text-green-700' :
                          post.type === 'offer' ? 'bg-orange-100 text-orange-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {post.type === 'update' ? 'Update' :
                           post.type === 'event' ? 'Event' :
                           post.type === 'offer' ? 'Angebot' : 'Produkt'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          post.status === 'published' ? 'bg-green-100 text-green-700' :
                          post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                          post.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {post.status === 'published' ? 'Veröffentlicht' :
                           post.status === 'scheduled' ? 'Geplant' :
                           post.status === 'draft' ? 'Entwurf' : 'Abgelaufen'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(post.scheduledPublishTime).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    
                    {post.keywords && post.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.keywords.slice(0, 3).map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keywords Optimierung */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">
          Lokale Keyword-Optimierung für {locationName}
        </h4>
        <div className="flex flex-wrap gap-2">
          {gmbOptimizationService.optimizeLocalKeywords(activeLocation).slice(0, 10).map((keyword, index) => (
            <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
              {keyword}
            </span>
          ))}
        </div>
        <p className="text-xs text-yellow-600 mt-2">
          Diese Keywords werden automatisch in Posts und Profilbeschreibungen integriert.
        </p>
      </div>
    </div>
  );
};

export default GMBDashboard;