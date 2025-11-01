/**
 * AI Energy Intelligence - Vorhersageanalysen für Solaranlagen
 * Real-time Performance Monitoring, Weather Integration & Predictive Analytics
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface WeatherForecast {
  date: Date;
  temperature: number;
  sunshineHours: number;
  cloudCoverage: number;
  windSpeed: number;
  precipitationProbability: number;
  solarIrradiance: number; // kWh/m²
  efficiency: number; // 0-100
}

interface EnergyProduction {
  timestamp: Date;
  actualProduction: number; // kWh
  predictedProduction: number; // kWh
  deviation: number; // %
  weatherConditions: string;
  systemLoad: number; // %
  efficiency: number; // %
}

interface MaintenanceAlert {
  id: string;
  type: 'performance-degradation' | 'cleaning-required' | 'component-failure' | 'weather-damage' | 'optimal-operation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  recommendedAction: string;
  estimatedCost: number;
  potentialLoss: number;
  confidence: number; // 0-100
}

interface PerformanceMetrics {
  currentOutput: number; // kW
  peakOutput: number; // kW
  dailyYield: number; // kWh
  monthlyYield: number; // kWh
  yearlyYield: number; // kWh
  efficiency: number; // %
  co2Saved: number; // kg
  revenueGenerated: number; // EUR
  systemHealth: number; // 0-100
  degradationRate: number; // % per year
}

interface PredictiveAnalytics {
  timeframe: '24h' | '7d' | '30d' | '90d' | '1y';
  predictedYield: number; // kWh
  confidence: number; // 0-100
  riskFactors: Array<{
    type: string;
    probability: number; // 0-100
    impact: number; // % on yield
    description: string;
  }>;
  optimizationOpportunities: Array<{
    type: string;
    potentialGain: number; // % or EUR
    implementationCost: number; // EUR
    paybackPeriod: number; // months
  }>;
}

const AIEnergyIntelligence: React.FC = () => {
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);
  const [energyProduction, setEnergyProduction] = useState<EnergyProduction[]>([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalytics[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('30d');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [systemInfo, setSystemInfo] = useState({
    systemSize: 10.5, // kWp
    panelCount: 32,
    installationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    location: 'Berlin, Germany',
    orientation: 'South',
    tilt: 30
  });

  // Initialize AI Energy Intelligence
  useEffect(() => {
    initializeAIEnergyIntelligence();
  }, []);

  const initializeAIEnergyIntelligence = async () => {
    setIsAnalyzing(true);

    try {
      await Promise.all([
        loadWeatherForecast(),
        loadEnergyProductionData(),
        generateMaintenanceAlerts(),
        calculatePerformanceMetrics(),
        generatePredictiveAnalytics()
      ]);

      setLastAnalysis(new Date());
    } catch (error) {
      console.error('AI Energy Intelligence initialization failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load Weather Forecast
  const loadWeatherForecast = async () => {
    const mockForecast: WeatherForecast[] = [];
    const now = new Date();

    for (let i = 0; i < 14; i++) {
      const forecastDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);

      // Simulate weather patterns based on season
      const baseTemp = 15 + Math.sin((forecastDate.getMonth() + 1) * Math.PI / 6) * 10;
      const randomVariation = (Math.random() - 0.5) * 5;

      mockForecast.push({
        date: forecastDate,
        temperature: baseTemp + randomVariation,
        sunshineHours: 3 + Math.random() * 9, // 3-12 hours
        cloudCoverage: Math.random() * 100, // 0-100%
        windSpeed: 5 + Math.random() * 20, // 5-25 km/h
        precipitationProbability: Math.random() * 60, // 0-60%
        solarIrradiance: 2 + Math.random() * 6, // 2-8 kWh/m²
        efficiency: 85 + Math.random() * 15 // 85-100%
      });
    }

    setWeatherForecast(mockForecast);
  };

  // Load Energy Production Data
  const loadEnergyProductionData = async () => {
    const mockProduction: EnergyProduction[] = [];
    const now = new Date();

    for (let i = 0; i < 90; i++) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const baseProduction = systemInfo.systemSize * 4; // Base production in kWh
      const weatherFactor = 0.7 + Math.random() * 0.4; // 0.7-1.1 weather factor
      const degradation = 1 - (i / 365) * 0.005; // 0.5% degradation per year

      const actualProduction = baseProduction * weatherFactor * degradation;
      const predictedProduction = baseProduction * weatherFactor;

      mockProduction.push({
        timestamp,
        actualProduction,
        predictedProduction,
        deviation: ((actualProduction - predictedProduction) / predictedProduction) * 100,
        weatherConditions: Math.random() > 0.7 ? 'Sunny' : Math.random() > 0.4 ? 'Partly Cloudy' : 'Cloudy',
        systemLoad: 60 + Math.random() * 35, // 60-95%
        efficiency: 85 + Math.random() * 12 // 85-97%
      });
    }

    setEnergyProduction(mockProduction);
  };

  // Generate Maintenance Alerts
  const generateMaintenanceAlerts = async () => {
    const mockAlerts: MaintenanceAlert[] = [
      {
        id: 'alert-001',
        type: 'cleaning-required',
        severity: 'medium',
        title: 'Solarmodule benötigen Reinigung',
        description: 'Performance-Analyse zeigt 15% Effizienzverlust durch Verschmutzung',
        timestamp: new Date(),
        recommendedAction: 'Professionelle Reinigung der Solarmodule durchführen',
        estimatedCost: 350,
        potentialLoss: 892, // EUR per month
        confidence: 92
      },
      {
        id: 'alert-002',
        type: 'performance-degradation',
        severity: 'high',
        title: 'Unusual Performance Degradation',
        description: 'Systemeffizienz hat um 8% in den letzten 7 Tagen abgenommen',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        recommendedAction: 'Technische Inspektion aller Systemkomponenten',
        estimatedCost: 0,
        potentialLoss: 2480, // EUR per month
        confidence: 87
      },
      {
        id: 'alert-003',
        type: 'optimal-operation',
        severity: 'low',
        title: 'Optimaler Betriebszeitpunkt erkannt',
        description: 'Maximale Leistungserwartung zwischen 10:00-14:00 Uhr',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        recommendedAction: 'Kein Action erforderlich - System arbeitet optimal',
        estimatedCost: 0,
        potentialLoss: 0,
        confidence: 95
      }
    ];

    setMaintenanceAlerts(mockAlerts);
  };

  // Calculate Performance Metrics
  const calculatePerformanceMetrics = async () => {
    const today = new Date();
    const todayProduction = energyProduction
      .filter(p => p.timestamp.toDateString() === today.toDateString())
      .reduce((sum, p) => sum + p.actualProduction, 0);

    const monthlyProduction = energyProduction
      .filter(p => {
        const prodDate = new Date(p.timestamp);
        return prodDate.getMonth() === today.getMonth() &&
               prodDate.getFullYear() === today.getFullYear();
      })
      .reduce((sum, p) => sum + p.actualProduction, 0);

    const yearlyProduction = monthlyProduction * 12; // Simplified

    const mockMetrics: PerformanceMetrics = {
      currentOutput: systemInfo.systemSize * 0.85, // Current output based on efficiency
      peakOutput: systemInfo.systemSize,
      dailyYield: todayProduction,
      monthlyYield: monthlyProduction,
      yearlyYield: yearlyProduction,
      efficiency: 87.5, // Current system efficiency
      co2Saved: yearlyProduction * 0.5, // 0.5 kg CO2 per kWh
      revenueGenerated: yearlyProduction * 0.35, // 0.35 EUR per kWh
      systemHealth: 92, // Overall system health score
      degradationRate: 0.5 // 0.5% per year
    };

    setPerformanceMetrics(mockMetrics);
  };

  // Generate Predictive Analytics
  const generatePredictiveAnalytics = async () => {
    const timeframes: PredictiveAnalytics['timeframe'][] = ['24h', '7d', '30d', '90d', '1y'];
    const mockAnalytics: PredictiveAnalytics[] = [];

    for (const timeframe of timeframes) {
      let days = 1;
      switch (timeframe) {
        case '24h': days = 1; break;
        case '7d': days = 7; break;
        case '30d': days = 30; break;
        case '90d': days = 90; break;
        case '1y': days = 365; break;
      }

      const baseYield = systemInfo.systemSize * 4 * days; // kWh
      const confidence = timeframe === '24h' ? 95 : timeframe === '7d' ? 92 : timeframe === '30d' ? 88 : timeframe === '90d' ? 82 : 75;
      const predictedYield = baseYield * (0.9 + Math.random() * 0.15); // 90-105% of base

      const riskFactors = [];
      if (Math.random() > 0.6) {
        riskFactors.push({
          type: 'Weather Variability',
          probability: 20 + Math.random() * 30,
          impact: 5 + Math.random() * 10,
          description: 'Unvorhersehbares Wetter könnte die Produktion beeinträchtigen'
        });
      }

      if (Math.random() > 0.7) {
        riskFactors.push({
          type: 'Seasonal Degradation',
          probability: 15 + Math.random() * 20,
          impact: 3 + Math.random() * 7,
          description: 'Saisonbeding reduzierte Sonneneinstrahlung erwartet'
        });
      }

      const optimizationOpportunities = [];
      if (Math.random() > 0.5) {
        optimizationOpportunities.push({
          type: 'Cleaning Optimization',
          potentialGain: 8 + Math.random() * 12,
          implementationCost: 200 + Math.random() * 300,
          paybackPeriod: 3 + Math.random() * 6
        });
      }

      if (Math.random() > 0.7) {
        optimizationOpportunities.push({
          type: 'Tilt Adjustment',
          potentialGain: 5 + Math.random() * 8,
          implementationCost: 1500 + Math.random() * 2500,
          paybackPeriod: 24 + Math.random() * 36
        });
      }

      mockAnalytics.push({
        timeframe,
        predictedYield: Math.round(predictedYield),
        confidence,
        riskFactors,
        optimizationOpportunities
      });
    }

    setPredictiveAnalytics(mockAnalytics);
  };

  // Get Alert Color
  const getAlertColor = (severity: MaintenanceAlert['severity']): string => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get Alert Icon
  const getAlertIcon = (type: MaintenanceAlert['type']): string => {
    switch (type) {
      case 'performance-degradation': return '⚠️';
      case 'cleaning-required': return '🧹';
      case 'component-failure': return '🔧';
      case 'weather-damage': return '🌧️';
      case 'optimal-operation': return '✅';
      default: return 'ℹ️';
    }
  };

  // Format Currency
  const formatCurrency = (amount: number): string => {
    return `€${amount.toLocaleString()}`;
  };

  // Re-run Analysis
  const reRunAnalysis = () => {
    initializeAIEnergyIntelligence();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 AI Energy Intelligence
        </h1>
        <p className="text-gray-600">
          Vorhersageanalysen für Solaranlagen mit Weather Integration & Predictive Analytics
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-900">System Info</h3>
            <div className="text-2xl">⚡</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-900">{systemInfo.systemSize} kWp</div>
            <div className="text-sm text-blue-700">{systemInfo.panelCount} Module</div>
            <div className="text-sm text-blue-700">{systemInfo.orientation} ausgerichtet</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-green-900">Daily Yield</h3>
            <div className="text-2xl">📊</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-900">
              {performanceMetrics?.dailyYield.toFixed(1) || 0} kWh
            </div>
            <div className="text-sm text-green-700">
              Efficiency: {performanceMetrics?.efficiency.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-green-700">
              CO₂ Saved: {(performanceMetrics?.co2Saved || 0).toFixed(0)} kg
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-purple-900">System Health</h3>
            <div className="text-2xl">❤️</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-900">
              {performanceMetrics?.systemHealth || 0}%
            </div>
            <div className="text-sm text-purple-700">
              Degradation: {performanceMetrics?.degradationRate || 0}%/Jahr
            </div>
            <div className="text-sm text-purple-700">
              Last Check: {lastAnalysis?.toLocaleTimeString() || 'Never'}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-900">AI Analysis</h3>
            <div className="text-2xl">🧠</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-amber-900">
              {maintenanceAlerts.filter(a => a.severity !== 'low').length}
            </div>
            <div className="text-sm text-amber-700">Active Alerts</div>
            <div className="text-sm text-amber-700">
              {isAnalyzing ? 'Analyzing...' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900">Analyse & Kontrolle</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={reRunAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isAnalyzing ? 'Analysiere...' : '🔄 Neu analysieren'}
          </button>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">24 Stunden</option>
            <option value="7d">7 Tage</option>
            <option value="30d">30 Tage</option>
            <option value="90d">90 Tage</option>
            <option value="1y">1 Jahr</option>
          </select>
        </div>
      </div>

      {/* Maintenance Alerts */}
      {maintenanceAlerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔧 Wartungs-Alarme</h2>
          <div className="space-y-4">
            {maintenanceAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-700 mt-1">{alert.description}</p>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Empfohlene Aktion:</span>
                          <p className="text-gray-600">{alert.recommendedAction}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Geschätzte Kosten:</span>
                            <span className="font-medium">{formatCurrency(alert.estimatedCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Potenzieller Verlust:</span>
                            <span className="font-medium text-red-600">{formatCurrency(alert.potentialLoss)}/Monat</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{alert.timestamp.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">Confidence: {alert.confidence}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Forecast */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">☀️ Wettervorhersage & Optimierung</h2>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-4 min-w-max">
            {weatherForecast.slice(0, 7).map((forecast, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="font-semibold text-sm text-gray-900">
                    {forecast.date.toLocaleDateString('de-DE', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="mt-2 text-3xl mb-2">
                    {Math.round(forecast.temperature)}°C
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-center space-x-1">
                      <span>☀️</span>
                      <span>{forecast.sunshineHours.toFixed(1)}h</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span>☁️</span>
                      <span>{forecast.cloudCoverage.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span>🌱</span>
                      <span>{forecast.solarIrradiance.toFixed(1)} kWh</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span>⚡</span>
                      <span>{forecast.efficiency.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Vorhersage-Analyse</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictiveAnalytics.map((analytics, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{analytics.timeframe.toUpperCase()} Vorhersage</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  analytics.confidence >= 90 ? 'bg-green-100 text-green-800' :
                  analytics.confidence >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {analytics.confidence}% Confidence
                </span>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.predictedYield.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Erwartete Produktion (kWh)</div>
                </div>

                {analytics.riskFactors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Risikofaktoren</h4>
                    <div className="space-y-2">
                      {analytics.riskFactors.map((risk, riskIndex) => (
                        <div key={riskIndex} className="bg-red-50 border border-red-200 rounded p-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-red-900">{risk.type}</span>
                            <span className="text-red-600">
                              {risk.probability.toFixed(0)}% · {risk.impact.toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-xs text-red-700 mt-1">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analytics.optimizationOpportunities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Optimierungsmöglichkeiten</h4>
                    <div className="space-y-2">
                      {analytics.optimizationOpportunities.map((opp, oppIndex) => (
                        <div key={oppIndex} className="bg-green-50 border border-green-200 rounded p-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-green-900">{opp.type}</span>
                            <span className="text-green-600">
                              +{opp.potentialGain.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>Kosten: {formatCurrency(opp.implementationCost)}</span>
                            <span>Amortisation: {opp.paybackPeriod} Monate</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Leistungsentwicklung</h2>
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">📈</div>
            <p>Performance-Trend-Diagramm</p>
            <p className="text-sm mt-2">Zeigt Produktionsverlauf mit Vorhersage vs. Ist-Werten</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEnergyIntelligence;