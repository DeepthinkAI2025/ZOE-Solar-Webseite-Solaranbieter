// Predictive Content Engine mit KI für dynamische Inhalte basierend auf Wetter, Strompreisen & Trends
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ContentPrediction {
  id: string;
  type: 'blog-post' | 'landing-page' | 'social-media' | 'email-campaign' | 'faq' | 'location-content';
  title: string;
  content: string;
  predictedPerformance: {
    engagementScore: number; // 0-100
    conversionProbability: number; // 0-100
    searchVolume: number;
    competitionLevel: number; // 0-100
  };
  triggers: {
    weatherBased: boolean;
    priceBased: boolean;
    seasonal: boolean;
    locationSpecific: boolean;
    trendBased: boolean;
  };
  metadata: {
    targetAudience: string[];
    keywords: string[];
    optimalPublishTime: Date;
    estimatedROI: number;
    contentLength: number;
  };
  status: 'draft' | 'approved' | 'published' | 'scheduled';
  createdAt: Date;
}

interface WeatherData {
  location: string;
  temperature: number;
  sunshineHours: number;
  cloudCoverage: number;
  precipitation: number;
  windSpeed: number;
  conditions: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  solarIrradiance: number; // kWh/m²
}

interface PriceData {
  region: string;
  currentPrice: number; // €/kWh
  dayAheadPrice: number;
  weeklyAverage: number;
  trend: 'rising' | 'falling' | 'stable';
  lastUpdated: Date;
}

interface MarketTrend {
  id: string;
  name: string;
  category: 'regulatory' | 'technological' | 'economic' | 'environmental' | 'social';
  impact: 'high' | 'medium' | 'low';
  trend: 'rising' | 'falling' | 'stable';
  description: string;
  keywords: string[];
  relevanceScore: number; // 0-100
  dateDetected: Date;
}

const PredictiveContentEngine: React.FC = () => {
  const [predictions, setPredictions] = useState<ContentPrediction[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<ContentPrediction | null>(null);

  // Initialize data sources
  useEffect(() => {
    initializeDataSources();
  }, []);

  const initializeDataSources = async () => {
    setIsAnalyzing(true);

    try {
      // Simulate data fetching
      await Promise.all([
        fetchWeatherData(),
        fetchPriceData(),
        fetchMarketTrends(),
        generatePredictions()
      ]);
    } catch (error) {
      console.error('Data initialization failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchWeatherData = async (): Promise<void> => {
    // Simulate weather API
    const mockWeather: WeatherData = {
      location: 'Berlin, Germany',
      temperature: 22,
      sunshineHours: 8,
      cloudCoverage: 15,
      precipitation: 0,
      windSpeed: 12,
      conditions: 'sunny',
      solarIrradiance: 5.2
    };
    setWeatherData(mockWeather);
  };

  const fetchPriceData = async (): Promise<void> => {
    // Simulate energy price API
    const mockPrices: PriceData[] = [
      { region: 'Berlin', currentPrice: 0.42, dayAheadPrice: 0.45, weeklyAverage: 0.38, trend: 'rising', lastUpdated: new Date() },
      { region: 'München', currentPrice: 0.38, dayAheadPrice: 0.40, weeklyAverage: 0.36, trend: 'stable', lastUpdated: new Date() },
      { region: 'Hamburg', currentPrice: 0.45, dayAheadPrice: 0.48, weeklyAverage: 0.41, trend: 'rising', lastUpdated: new Date() },
      { region: 'Köln', currentPrice: 0.41, dayAheadPrice: 0.43, weeklyAverage: 0.39, trend: 'stable', lastUpdated: new Date() }
    ];
    setPriceData(mockPrices);
  };

  const fetchMarketTrends = async (): Promise<void> => {
    // Simulate trend analysis
    const mockTrends: MarketTrend[] = [
      {
        id: '1',
        name: 'Solarförderung 2025 erhöht',
        category: 'regulatory',
        impact: 'high',
        trend: 'rising',
        description: 'Die Bundesregierung plant die Erhöhung der Solarförderung um 15%',
        keywords: ['solarförderung', 'förderung', ' subsidies', 'kfw'],
        relevanceScore: 92,
        dateDetected: new Date()
      },
      {
        id: '2',
        name: 'Strompreise steigend',
        category: 'economic',
        impact: 'high',
        trend: 'rising',
        description: 'Strompreise erreichen neues Rekordhoch',
        keywords: ['strompreis', 'energiekosten', 'preise', 'kosten'],
        relevanceScore: 88,
        dateDetected: new Date()
      }
    ];
    setMarketTrends(mockTrends);
  };

  const generatePredictions = async (): Promise<void> => {
    // Simulate AI prediction engine
    const mockPredictions: ContentPrediction[] = [
      {
        id: 'pred-1',
        type: 'blog-post',
        title: 'So nutzen Sie die Sonneneinstrahlung heute optimal aus',
        content: `Mit einer Solarleistung von ${weatherData?.solarIrradiance || 5.0} kWh/m² ist heute ideal für die Installation...`,
        predictedPerformance: {
          engagementScore: 85,
          conversionProbability: 12,
          searchVolume: 450,
          competitionLevel: 45
        },
        triggers: {
          weatherBased: true,
          priceBased: true,
          seasonal: true,
          locationSpecific: true,
          trendBased: false
        },
        metadata: {
          targetAudience: ['homeowners', 'solar-interested'],
          keywords: ['sonneneinstrahlung', 'solarleistung', 'heute', 'optimal'],
          optimalPublishTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          estimatedROI: 280,
          contentLength: 1200
        },
        status: 'approved',
        createdAt: new Date()
      },
      {
        id: 'pred-2',
        type: 'social-media',
        title: 'Strompreise wieder gestiegen! Jetzt Solaranlage lohnt sich mehr denn je 💡',
        content: `Die aktuellen Strompreise von bis zu 0.45€/kWh machen Solaranlagen zur rentablen Investition...`,
        predictedPerformance: {
          engagementScore: 92,
          conversionProbability: 18,
          searchVolume: 1200,
          competitionLevel: 65
        },
        triggers: {
          weatherBased: false,
          priceBased: true,
          seasonal: false,
          locationSpecific: false,
          trendBased: true
        },
        metadata: {
          targetAudience: ['cost-conscious', 'investors'],
          keywords: ['strompreis', 'solaranlage', 'rendite', 'investition'],
          optimalPublishTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
          estimatedROI: 450,
          contentLength: 280
        },
        status: 'scheduled',
        createdAt: new Date()
      },
      {
        id: 'pred-3',
        type: 'email-campaign',
        title: 'Ihr persönliches Solar-Angebot für diese Woche',
        content: `Basierend auf aktuellen Wetterbedingungen und Strompreisen haben wir ein individuelles Angebot erstellt...`,
        predictedPerformance: {
          engagementScore: 78,
          conversionProbability: 15,
          searchVolume: 320,
          competitionLevel: 38
        },
        triggers: {
          weatherBased: true,
          priceBased: true,
          seasonal: true,
          locationSpecific: true,
          trendBased: true
        },
        metadata: {
          targetAudience: ['leads', 'interested'],
          keywords: ['solarangebot', 'preis', 'wochenangebot', 'personalisiert'],
          optimalPublishTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
          estimatedROI: 680,
          contentLength: 650
        },
        status: 'draft',
        createdAt: new Date()
      }
    ];
    setPredictions(mockPredictions);
  };

  const getPerformanceColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getContentTypeIcon = (type: string): string => {
    switch (type) {
      case 'blog-post': return '📝';
      case 'landing-page': return '🌐';
      case 'social-media': return '📱';
      case 'email-campaign': return '📧';
      case 'faq': return '❓';
      case 'location-content': return '📍';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 Predictive Content Engine
        </h1>
        <p className="text-gray-600">
          KI-gestützte Content-Vorhersage basierend auf Wetter, Strompreisen und Markttrends
        </p>
      </div>

      {/* Real-time Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Weather Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-yellow-900">Wetter-Daten</h3>
            <div className="text-2xl">☀️</div>
          </div>
          {weatherData && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Temperatur:</span>
                <span className="font-medium">{weatherData.temperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sonneneinstrahlung:</span>
                <span className="font-medium">{weatherData.solarIrradiance} kWh/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bedingungen:</span>
                <span className="font-medium capitalize">{weatherData.conditions}</span>
              </div>
            </div>
          )}
        </div>

        {/* Price Card */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-900">Strompreise</h3>
            <div className="text-2xl">⚡</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Hohe Preise (&gt;0.40€/kWh):</span>
              <span className="font-medium">{priceData.filter(p => p.currentPrice > 0.40).length} Regionen</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Durchschnitt:</span>
              <span className="font-medium">
                {(priceData.reduce((sum, p) => sum + p.currentPrice, 0) / priceData.length || 0).toFixed(2)}€/kWh
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trend:</span>
              <span className="font-medium">
                {priceData.filter(p => p.trend === 'rising').length} steigend
              </span>
            </div>
          </div>
        </div>

        {/* Trends Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Markttrends</h3>
            <div className="text-2xl">📈</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Aktive Trends:</span>
              <span className="font-medium">{marketTrends.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hohe Relevanz:</span>
              <span className="font-medium">{marketTrends.filter(t => t.relevanceScore > 85).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Regulatorisch:</span>
              <span className="font-medium">{marketTrends.filter(t => t.category === 'regulatory').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Content-Vorhersagen</h2>
          <button
            onClick={initializeDataSources}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isAnalyzing ? 'Analysiere...' : '🔄 Neu analysieren'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              className={`border rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedPrediction?.id === prediction.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => setSelectedPrediction(prediction)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getContentTypeIcon(prediction.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{prediction.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{prediction.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  prediction.status === 'published' ? 'bg-green-100 text-green-800' :
                  prediction.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  prediction.status === 'approved' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {prediction.status}
                </span>
              </div>

              <div className="space-y-3">
                {/* Performance Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`text-center p-2 rounded-lg ${getPerformanceColor(prediction.predictedPerformance.engagementScore)}`}>
                    <div className="text-lg font-bold">{prediction.predictedPerformance.engagementScore}%</div>
                    <div className="text-xs">Engagement</div>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${getPerformanceColor(prediction.predictedPerformance.conversionProbability)}`}>
                    <div className="text-lg font-bold">{prediction.predictedPerformance.conversionProbability}%</div>
                    <div className="text-xs">Conversion</div>
                  </div>
                </div>

                {/* Triggers */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Auslöser:</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.triggers.weatherBased && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">☀️ Wetter</span>}
                    {prediction.triggers.priceBased && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">⚡ Preis</span>}
                    {prediction.triggers.seasonal && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">🌸 Saison</span>}
                    {prediction.triggers.locationSpecific && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">📍 Standort</span>}
                    {prediction.triggers.trendBased && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">📈 Trend</span>}
                  </div>
                </div>

                {/* ROI */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Geschätzter ROI:</span>
                  <span className="font-bold text-green-600">€{prediction.metadata.estimatedROI}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Prediction Detail */}
      {selectedPrediction && (
        <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Content-Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Inhalt</h4>
              <p className="text-gray-600 mb-4">{selectedPrediction.content}</p>

              <h4 className="font-semibold text-gray-700 mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPrediction.metadata.keywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Performance-Metriken</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Suchvolumen:</span>
                  <span className="font-medium">{selectedPrediction.predictedPerformance.searchVolume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wettbewerbslevel:</span>
                  <span className="font-medium">{selectedPrediction.predictedPerformance.competitionLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Content-Länge:</span>
                  <span className="font-medium">{selectedPrediction.metadata.contentLength} Wörter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Optimaler Zeitpunkt:</span>
                  <span className="font-medium">
                    {selectedPrediction.metadata.optimalPublishTime.toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <h4 className="font-semibold text-gray-700 mb-2 mt-4">Zielgruppe</h4>
              <div className="space-y-1">
                {selectedPrediction.metadata.targetAudience.map((audience, index) => (
                  <div key={index} className="text-gray-600">• {audience}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveContentEngine;