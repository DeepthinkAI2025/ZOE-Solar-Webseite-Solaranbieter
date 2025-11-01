// Edge Computing Optimizer mit Cloudflare Workers, 5G-Netzwerk & Predictive Preloading
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface EdgeFunction {
  id: string;
  name: string;
  type: 'transform' | 'route' | 'cache' | 'optimize' | 'personalize';
  endpoint: string;
  status: 'active' | 'inactive' | 'testing';
  performance: {
    latency: number; // ms
    cacheHitRate: number; // %
    throughput: number; // requests/second
    errorRate: number; // %
  };
  lastDeployed: Date;
  description: string;
}

interface NetworkOptimization {
  connectionType: '5g' | '4g' | 'wifi' | 'ethernet' | 'slow-3g';
  bandwidth: number; // Mbps
  latency: number; // ms
  packetLoss: number; // %
  optimizationStrategy: 'aggressive' | 'balanced' | 'conservative';
  appliedOptimizations: string[];
  performanceGain: number; // %
}

interface CacheStrategy {
  pattern: string;
  ttl: number; // seconds
  strategy: 'stale-while-revalidate' | 'cache-first' | 'network-first' | 'cache-only';
  edgeLocation: 'global' | 'regional' | 'local';
  hitRate: number; // %
  bandwidthSavings: number; // %
}

interface PredictivePreloading {
  url: string;
  probability: number; // 0-100
  reason: string;
  triggeredBy: 'user-behavior' | 'time-pattern' | 'geographic' | 'device-pattern';
  preloadStrategy: 'critical' | 'important' | 'optional';
  estimatedTimeSaved: number; // ms
}

const EdgeComputingOptimizer: React.FC = () => {
  const [edgeFunctions, setEdgeFunctions] = useState<EdgeFunction[]>([]);
  const [networkOptimization, setNetworkOptimization] = useState<NetworkOptimization | null>(null);
  const [cacheStrategies, setCacheStrategies] = useState<CacheStrategy[]>([]);
  const [predictivePreloads, setPredictivePreloads] = useState<PredictivePreloading[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    averageLatency: 0,
    cacheHitRate: 0,
    bandwidthSavings: 0,
    throughput: 0,
    errorRate: 0
  });

  useEffect(() => {
    initializeEdgeOptimizer();
  }, []);

  const initializeEdgeOptimizer = async () => {
    try {
      await Promise.all([
        loadEdgeFunctions(),
        detectNetworkConditions(),
        loadCacheStrategies(),
        initializePredictivePreloading()
      ]);

      calculatePerformanceMetrics();
    } catch (error) {
      console.error('Edge optimizer initialization failed:', error);
    }
  };

  const loadEdgeFunctions = async () => {
    const mockFunctions: EdgeFunction[] = [
      {
        id: 'solar-calculator-edge',
        name: 'Solar Calculator Edge Function',
        type: 'transform',
        endpoint: '/api/edge/solar-calculator',
        status: 'active',
        performance: {
          latency: 12,
          cacheHitRate: 85,
          throughput: 1250,
          errorRate: 0.1
        },
        lastDeployed: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'Optimiert Solarrechner-Berechnungen am Edge'
      },
      {
        id: 'content-personalization',
        name: 'AI Content Personalization',
        type: 'personalize',
        endpoint: '/api/edge/personalize',
        status: 'active',
        performance: {
          latency: 8,
          cacheHitRate: 92,
          throughput: 2100,
          errorRate: 0.05
        },
        lastDeployed: new Date(Date.now() - 1 * 60 * 60 * 1000),
        description: 'Personalisiert Inhalte basierend auf User-Verhalten'
      },
      {
        id: 'price-optimizer',
        name: 'Dynamic Price Optimizer',
        type: 'optimize',
        endpoint: '/api/edge/price-optimize',
        status: 'testing',
        performance: {
          latency: 15,
          cacheHitRate: 78,
          throughput: 890,
          errorRate: 0.2
        },
        lastDeployed: new Date(Date.now() - 30 * 60 * 1000),
        description: 'Optimiert Preis-Anzeigen basierend auf Standort und Nachfrage'
      }
    ];
    setEdgeFunctions(mockFunctions);
  };

  const detectNetworkConditions = async () => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      const mockNetwork: NetworkOptimization = {
        connectionType: connection.effectiveType || '4g',
        bandwidth: connection.downlink || 10,
        latency: connection.rtt || 50,
        packetLoss: 0.1,
        optimizationStrategy: 'balanced',
        appliedOptimizations: ['compression', 'lazy-loading', 'resource-hints'],
        performanceGain: 65
      };
      setNetworkOptimization(mockNetwork);
    } else {
      // Fallback for browsers without Network Information API
      const mockNetwork: NetworkOptimization = {
        connectionType: 'wifi',
        bandwidth: 50,
        latency: 20,
        packetLoss: 0,
        optimizationStrategy: 'aggressive',
        appliedOptimizations: ['compression', 'lazy-loading', 'resource-hints', 'service-worker'],
        performanceGain: 78
      };
      setNetworkOptimization(mockNetwork);
    }
  };

  const loadCacheStrategies = async () => {
    const mockStrategies: CacheStrategy[] = [
      {
        pattern: '/api/solar-data/*',
        ttl: 300, // 5 minutes
        strategy: 'stale-while-revalidate',
        edgeLocation: 'global',
        hitRate: 88,
        bandwidthSavings: 72
      },
      {
        pattern: '/images/*',
        ttl: 86400, // 24 hours
        strategy: 'cache-first',
        edgeLocation: 'global',
        hitRate: 95,
        bandwidthSavings: 85
      },
      {
        pattern: '/components/*',
        ttl: 3600, // 1 hour
        strategy: 'cache-first',
        edgeLocation: 'regional',
        hitRate: 91,
        bandwidthSavings: 68
      },
      {
        pattern: '/api/real-time/*',
        ttl: 30, // 30 seconds
        strategy: 'network-first',
        edgeLocation: 'local',
        hitRate: 45,
        bandwidthSavings: 25
      }
    ];
    setCacheStrategies(mockStrategies);
  };

  const initializePredictivePreloading = async () => {
    const mockPreloads: PredictivePreloading[] = [
      {
        url: '/solar-rechner',
        probability: 92,
        reason: 'User visited pricing page previously',
        triggeredBy: 'user-behavior',
        preloadStrategy: 'critical',
        estimatedTimeSaved: 1200
      },
      {
        url: '/produkte/solar-module',
        probability: 78,
        reason: 'High traffic during business hours',
        triggeredBy: 'time-pattern',
        preloadStrategy: 'important',
        estimatedTimeSaved: 800
      },
      {
        url: '/api/solar-configurator/data',
        probability: 85,
        reason: 'Popular configuration step',
        triggeredBy: 'user-behavior',
        preloadStrategy: 'critical',
        estimatedTimeSaved: 600
      },
      {
        url: '/standort/berlin',
        probability: 65,
        reason: 'Geographic proximity detected',
        triggeredBy: 'geographic',
        preloadStrategy: 'optional',
        estimatedTimeSaved: 400
      }
    ];
    setPredictivePreloads(mockPreloads);
  };

  const calculatePerformanceMetrics = () => {
    if (edgeFunctions.length === 0) return;

    const avgLatency = edgeFunctions.reduce((sum, fn) => sum + fn.performance.latency, 0) / edgeFunctions.length;
    const avgCacheHitRate = edgeFunctions.reduce((sum, fn) => sum + fn.performance.cacheHitRate, 0) / edgeFunctions.length;
    const totalThroughput = edgeFunctions.reduce((sum, fn) => sum + fn.performance.throughput, 0);
    const avgErrorRate = edgeFunctions.reduce((sum, fn) => sum + fn.performance.errorRate, 0) / edgeFunctions.length;
    const totalBandwidthSavings = cacheStrategies.reduce((sum, strategy) => sum + strategy.bandwidthSavings, 0) / Math.max(cacheStrategies.length, 1);

    setPerformanceMetrics({
      averageLatency: Math.round(avgLatency),
      cacheHitRate: Math.round(avgCacheHitRate),
      bandwidthSavings: Math.round(totalBandwidthSavings),
      throughput: Math.round(totalThroughput),
      errorRate: Math.round(avgErrorRate * 100) / 100
    });
  };

  const deployEdgeFunction = async (functionId: string) => {
    setIsDeploying(true);

    try {
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 3000));

      setEdgeFunctions(prev => prev.map(fn =>
        fn.id === functionId
          ? { ...fn, status: 'active' as const, lastDeployed: new Date() }
          : fn
      ));

      console.log(`Edge function ${functionId} deployed successfully`);
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const getPerformanceColor = (value: number, type: 'latency' | 'hitrate' | 'savings' | 'errors'): string => {
    switch (type) {
      case 'latency':
        return value <= 20 ? 'text-green-600' : value <= 50 ? 'text-yellow-600' : 'text-red-600';
      case 'hitrate':
      case 'savings':
        return value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600';
      case 'errors':
        return value <= 0.1 ? 'text-green-600' : value <= 0.5 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStrategyIcon = (strategy: string): string => {
    switch (strategy) {
      case 'stale-while-revalidate': return '🔄';
      case 'cache-first': return '⚡';
      case 'network-first': return '🌐';
      case 'cache-only': return '💾';
      default: return '📊';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🌐 Edge Computing Optimizer
        </h1>
        <p className="text-gray-600">
          Cloudflare Workers, 5G-Netzwerk-Optimierung & Predictive Preloading für maximale Performance
        </p>
      </div>

      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-900">Avg Latency</h3>
            <div className="text-2xl">⚡</div>
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.averageLatency, 'latency')}`}>
            {performanceMetrics.averageLatency}ms
          </div>
          <div className="text-sm text-gray-600">Edge Functions</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-green-900">Cache Hit Rate</h3>
            <div className="text-2xl">💾</div>
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.cacheHitRate, 'hitrate')}`}>
            {performanceMetrics.cacheHitRate}%
          </div>
          <div className="text-sm text-gray-600">Global CDN</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-purple-900">Bandwidth Savings</h3>
            <div className="text-2xl">📉</div>
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.bandwidthSavings, 'savings')}`}>
            {performanceMetrics.bandwidthSavings}%
          </div>
          <div className="text-sm text-gray-600">Edge Caching</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-900">Throughput</h3>
            <div className="text-2xl">🚀</div>
          </div>
          <div className="text-2xl font-bold text-amber-900">
            {performanceMetrics.throughput.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Requests/sec</div>
        </div>
      </div>

      {/* Network Optimization */}
      {networkOptimization && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📶 Netzwerk-Optimierung</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Verbindung</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Typ:</span>
                  <span className="font-medium uppercase">{networkOptimization.connectionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bandbreite:</span>
                  <span className="font-medium">{networkOptimization.bandwidth} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Latenz:</span>
                  <span className="font-medium">{networkOptimization.latency} ms</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Optimierungen</h3>
              <div className="flex flex-wrap gap-2">
                {networkOptimization.appliedOptimizations.map((opt, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <div className="text-2xl font-bold text-green-600">
                +{networkOptimization.performanceGain}%
              </div>
              <div className="text-sm text-gray-600">Performance-Steigerung</div>
            </div>
          </div>
        </div>
      )}

      {/* Edge Functions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Edge Functions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {edgeFunctions.map((func) => (
            <div key={func.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{func.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  func.status === 'active' ? 'bg-green-100 text-green-800' :
                  func.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {func.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{func.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latenz:</span>
                  <span className={getPerformanceColor(func.performance.latency, 'latency')}>
                    {func.performance.latency}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache Hit:</span>
                  <span className={getPerformanceColor(func.performance.cacheHitRate, 'hitrate')}>
                    {func.performance.cacheHitRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durchsatz:</span>
                  <span className="font-medium">{func.performance.throughput}/s</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Deployed: {func.lastDeployed.toLocaleTimeString()}
                  </span>
                  {func.status !== 'active' && (
                    <button
                      onClick={() => deployEdgeFunction(func.id)}
                      disabled={isDeploying}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      {isDeploying ? 'Deploying...' : 'Deploy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cache Strategies */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💾 Cache-Strategien</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pattern
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Strategie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TTL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hit Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bandwidth Savings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cacheStrategies.map((strategy, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {strategy.pattern}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{getStrategyIcon(strategy.strategy)}</span>
                      <span className="font-medium">{strategy.strategy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {strategy.ttl}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${getPerformanceColor(strategy.hitRate, 'hitrate')}`}>
                      {strategy.hitRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${getPerformanceColor(strategy.bandwidthSavings, 'savings')}`}>
                      {strategy.bandwidthSavings}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predictive Preloading */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Predictive Preloading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {predictivePreloads.map((preload, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    preload.preloadStrategy === 'critical' ? 'bg-red-500' :
                    preload.preloadStrategy === 'important' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                  <span className="font-medium text-gray-900">{preload.url}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  preload.preloadStrategy === 'critical' ? 'bg-red-100 text-red-800' :
                  preload.preloadStrategy === 'important' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {preload.preloadStrategy}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Probability:</span>
                  <span className="font-medium">{preload.probability}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Saved:</span>
                  <span className="font-medium text-green-600">{preload.estimatedTimeSaved}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trigger:</span>
                  <span className="font-medium capitalize">{preload.triggeredBy}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">{preload.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EdgeComputingOptimizer;