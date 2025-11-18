import React, { Profiler, ProfilerOnRenderCallback } from 'react';

interface PerformanceMetrics {
  renders: number;
  totalTime: number;
  averageTime: number;
  maxTime: number;
  minTime: number;
  lastRenderTime: number;
  component: string;
  props?: Record<string, unknown>;
  interactions: Array<{
    type: string;
    timestamp: number;
    duration: number;
  }>;
}

class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private listeners: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public isTracking(): boolean {
    return this.isEnabled;
  }

  public recordRender(
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    _baseDuration: number,
    _startTime: number,
    _commitTime: number,
    _interactions: unknown[]
  ): void {
    if (!this.isEnabled) return;

    const currentMetrics = this.metrics.get(id) || {
      renders: 0,
      totalTime: 0,
      averageTime: 0,
      maxTime: 0,
      minTime: Infinity,
      lastRenderTime: 0,
      component: id,
      props: undefined,
      interactions: [],
    };

    const updatedMetrics: PerformanceMetrics = {
      ...currentMetrics,
      renders: currentMetrics.renders + 1,
      totalTime: currentMetrics.totalTime + actualDuration,
      lastRenderTime: actualDuration,
      maxTime: Math.max(currentMetrics.maxTime, actualDuration),
      minTime: Math.min(currentMetrics.minTime, actualDuration),
      averageTime: (currentMetrics.totalTime + actualDuration) / (currentMetrics.renders + 1),
      interactions: [
        ...currentMetrics.interactions.slice(-10), // Keep last 10 interactions
        {
          type: phase,
          timestamp: Date.now(),
          duration: actualDuration,
        },
      ],
    };

    this.metrics.set(id, updatedMetrics);

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(updatedMetrics);
      } catch (error) {
        console.error('Error in performance listener:', error);
      }
    });
  }

  public getMetrics(id?: string): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (id) {
      return this.metrics.get(id) || {
        renders: 0,
        totalTime: 0,
        averageTime: 0,
        maxTime: 0,
        minTime: 0,
        lastRenderTime: 0,
        component: id,
        interactions: [],
      };
    }
    return this.metrics;
  }

  public getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  public getTopComponents(limit: number = 10): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, limit);
  }

  public getSlowComponents(limit: number = 10): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, limit);
  }

  public getMostRenderedComponents(limit: number = 10): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.renders - a.renders)
      .slice(0, limit);
  }

  public addListener(listener: (metrics: PerformanceMetrics) => void): void {
    this.listeners.add(listener);
  }

  public removeListener(listener: (metrics: PerformanceMetrics) => void): void {
    this.listeners.delete(listener);
  }

  public clearMetrics(): void {
    this.metrics.clear();
  }

  public exportMetrics(): string {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: Array.from(this.metrics.entries()).map(([id, metrics]) => ({
        id,
        ...metrics,
      })),
    };
    return JSON.stringify(data, null, 2);
  }

  public getPerformanceReport(): {
    totalRenders: number;
    totalTime: number;
    averageRenderTime: number;
    slowestComponent: PerformanceMetrics | null;
    mostRenderedComponent: PerformanceMetrics | null;
    top5TimeConsumers: PerformanceMetrics[];
    recommendations: string[];
  } {
    const allMetrics = this.getAllMetrics();
    const totalRenders = allMetrics.reduce((sum, m) => sum + m.renders, 0);
    const totalTime = allMetrics.reduce((sum, m) => sum + m.totalTime, 0);
    const averageRenderTime = totalRenders > 0 ? totalTime / totalRenders : 0;

    const slowestComponent = allMetrics.reduce((slowest, current) =>
      current.averageTime > (slowest?.averageTime || 0) ? current : slowest,
      null as PerformanceMetrics | null
    );

    const mostRenderedComponent = allMetrics.reduce((most, current) =>
      current.renders > (most?.renders || 0) ? current : most,
      null as PerformanceMetrics | null
    );

    const top5TimeConsumers = this.getTopComponents(5);

    const recommendations: string[] = [];

    // Generate recommendations
    if (averageRenderTime > 16) {
      recommendations.push('Average render time is above 16ms - consider optimization');
    }

    if (slowestComponent && slowestComponent.averageTime > 100) {
      recommendations.push(`${slowestComponent.component} is very slow (${slowestComponent.averageTime.toFixed(2)}ms avg) - consider React.memo or useMemo`);
    }

    if (mostRenderedComponent && mostRenderedComponent.renders > 100) {
      recommendations.push(`${mostRenderedComponent.component} renders frequently (${mostRenderedComponent.renders} times) - consider memoization`);
    }

    if (totalRenders > 1000) {
      recommendations.push('High number of renders detected - check for unnecessary re-renders');
    }

    return {
      totalRenders,
      totalTime,
      averageRenderTime,
      slowestComponent,
      mostRenderedComponent,
      top5TimeConsumers,
      recommendations,
    };
  }
}

const performanceTracker = PerformanceTracker.getInstance();

export interface PerformanceProfilerProps {
  id: string;
  children: React.ReactNode;
  trackProps?: boolean;
  onRender?: ProfilerOnRenderCallback;
}

export const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({
  id,
  children,
  trackProps: _trackProps = false,
  onRender
}) => {
  const handleRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    performanceTracker.recordRender(
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions
    );

    if (onRender) {
      onRender(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions);
    }

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && actualDuration > 16) {
      console.warn(`Slow render detected in ${id}: ${actualDuration.toFixed(2)}ms (${phase})`);
    }
  };

  if (!performanceTracker.isTracking()) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
};

// Hook for performance metrics
export const usePerformanceMetrics = (componentId: string) => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

  React.useEffect(() => {
    const updateMetrics = (newMetrics: PerformanceMetrics) => {
      if (newMetrics.component === componentId) {
        setMetrics(newMetrics);
      }
    };

    performanceTracker.addListener(updateMetrics);

    // Get initial metrics
    const initialMetrics = performanceTracker.getMetrics(componentId);
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }

    return () => {
      performanceTracker.removeListener(updateMetrics);
    };
  }, [componentId]);

  return metrics;
};

// Hook for global performance data
export const useGlobalPerformance = () => {
  const [report, setReport] = React.useState<ReturnType<typeof performanceTracker.getPerformanceReport> | null>(null);

  React.useEffect(() => {
    const updateReport = () => {
      setReport(performanceTracker.getPerformanceReport());
    };

    // Update every 5 seconds
    const interval = setInterval(updateReport, 5000);
    updateReport(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return report;
};

// Performance monitoring component for development
export const PerformanceMonitor: React.FC = () => {
  const [isEnabled, setIsEnabled] = React.useState(performanceTracker.isTracking());
  const report = useGlobalPerformance();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Performance Monitor</h3>
        <button
          onClick={() => {
            if (isEnabled) {
              performanceTracker.disable();
            } else {
              performanceTracker.enable();
            }
            setIsEnabled(!isEnabled);
          }}
          className={`px-2 py-1 rounded text-xs ${
            isEnabled
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isEnabled ? 'OFF' : 'ON'}
        </button>
      </div>

      {report && isEnabled && (
        <div className="text-xs space-y-1">
          <div>Renders: {report.totalRenders}</div>
          <div>Avg Time: {report.averageRenderTime.toFixed(2)}ms</div>
          <div>Total Time: {report.totalTime.toFixed(0)}ms</div>

          {report.recommendations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <div className="font-semibold text-yellow-400">Recommendations:</div>
              {report.recommendations.slice(0, 2).map((rec, i) => (
                <div key={i} className="text-yellow-200">• {rec}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { performanceTracker };
export default PerformanceProfiler;