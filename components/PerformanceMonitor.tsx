import React, { useEffect, useState } from 'react';

interface CoreWebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  INP: number; // Interaction to Next Paint (replaces FID)
  CLS: number; // Cumulative Layout Shift
}

interface PerformanceData {
  vitals: CoreWebVitals;
  timestamp: number;
  url: string;
  userAgent: string;
  connection?: string;
  deviceMemory?: number;
}

const PerformanceMonitor: React.FC = () => {
  const [vitals, setVitals] = useState<CoreWebVitals | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Initialize performance monitoring
    initializePerformanceTracking();
    
    return () => {
      // Cleanup on unmount
      if (performanceObserver) {
        performanceObserver.disconnect();
      }
    };
  }, []);

  const initializePerformanceTracking = () => {
    setIsTracking(true);

    // Track Core Web Vitals
    trackLargestContentfulPaint();
    trackFirstInputDelay();
    trackInteractionToNextPaint();
    trackCumulativeLayoutShift();
    
    // Track additional performance metrics
    trackNavigationTiming();
    trackResourceTiming();
  };

  const trackLargestContentfulPaint = () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        const LCP = lastEntry.startTime;
        console.log('LCP:', LCP);
        
        setVitals(prev => ({
          ...prev,
          LCP
        } as CoreWebVitals));

        // Send to analytics
        trackMetric('LCP', LCP);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  };

  const trackFirstInputDelay = () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const FID = entry.processingStart - entry.startTime;
          console.log('FID:', FID);
          
          setVitals(prev => ({
            ...prev,
            FID
          } as CoreWebVitals));

          trackMetric('FID', FID);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  };

  const trackInteractionToNextPaint = () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const INP = entry.processingStart - entry.startTime;
          console.log('INP:', INP);
          
          setVitals(prev => ({
            ...prev,
            INP
          } as CoreWebVitals));

          trackMetric('INP', INP);
        });
      });

      observer.observe({ entryTypes: ['event'] });
    }
  };

  const trackCumulativeLayoutShift = () => {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        console.log('CLS:', clsValue);
        
        setVitals(prev => ({
          ...prev,
          CLS: clsValue
        } as CoreWebVitals));

        trackMetric('CLS', clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  };

  const trackNavigationTiming = () => {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
            TCP: navigation.connectEnd - navigation.connectStart,
            SSL: navigation.connectEnd - navigation.secureConnectionStart,
            TTFB: navigation.responseStart - navigation.requestStart,
            Transfer: navigation.responseEnd - navigation.responseStart,
            DOM: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            Load: navigation.loadEventEnd - navigation.loadEventStart
          };

          console.log('Navigation Timing:', metrics);
          trackNavigationMetrics(metrics);
        }
      }, 0);
    });
  };

  const trackResourceTiming = () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const resourceData = entries.map(entry => ({
          name: entry.name,
          type: entry.initiatorType,
          duration: entry.duration,
          size: (entry as any).transferSize || 0
        }));

        console.log('Resource Timing:', resourceData);
        trackResourceMetrics(resourceData);
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  };

  const trackMetric = (name: string, value: number) => {
    // Send to analytics (Google Analytics 4, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        metric_name: name,
        metric_value: value,
        metric_id: `vitals-${Date.now()}`
      });
    }

    // Custom analytics tracking
    const performanceData: PerformanceData = {
      vitals: { LCP: 0, FID: 0, INP: 0, CLS: 0, [name]: value },
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory
    };

    // Store locally for development
    if (process.env.NODE_ENV === 'development') {
      const existingData = localStorage.getItem('performance-vitals') || '[]';
      const dataArray = JSON.parse(existingData);
      dataArray.push(performanceData);
      
      // Keep only last 100 entries
      if (dataArray.length > 100) {
        dataArray.splice(0, dataArray.length - 100);
      }
      
      localStorage.setItem('performance-vitals', JSON.stringify(dataArray));
    }
  };

  const trackNavigationMetrics = (metrics: any) => {
    console.log('Navigation metrics tracked:', metrics);
  };

  const trackResourceMetrics = (resources: any[]) => {
    const largestResources = resources
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    console.log('Top 10 largest resources:', largestResources);
  };

  const getPerformanceGrade = (vital: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      INP: { good: 200, poor: 500 },
      CLS: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[vital as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getGradeColor = (grade: 'good' | 'needs-improvement' | 'poor'): string => {
    switch (grade) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-slate-200 rounded-xl p-4 shadow-lg max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900">Performance</h3>
        <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
      
      {vitals && (
        <div className="space-y-2 text-sm">
          {Object.entries(vitals).map(([key, value]) => {
            if (value === 0 || !value) return null;
            
            const grade = getPerformanceGrade(key, value);
            const color = getGradeColor(grade);
            
            return (
              <div key={key} className="flex justify-between items-center">
                <span className="text-slate-600">{key}:</span>
                <span className={`font-semibold ${color}`}>
                  {typeof value === 'number' ? value.toFixed(1) : value}
                  {key === 'LCP' || key === 'FID' || key === 'INP' ? 'ms' : ''}
                  {key === 'CLS' ? '' : ''}
                </span>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => {
            const data = localStorage.getItem('performance-vitals');
            if (data) {
              const parsed = JSON.parse(data);
              console.log('Performance Data:', parsed);
              alert(`Performance data: ${parsed.length} entries in localStorage`);
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          View Data ({JSON.parse(localStorage.getItem('performance-vitals') || '[]').length} entries)
        </button>
      </div>
    </div>
  );
};

export default PerformanceMonitor;

// Utility function to manually trigger performance tracking
export const triggerPerformanceTracking = (metricName: string, value: number) => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      // Custom metric tracking logic
    });
    observer.observe({ entryTypes: ['measure'] });
    
    // Create custom performance entry
    const measure = performance.measure(metricName, 'navigationStart', 'navigationEnd');
    console.log(`Custom metric ${metricName}:`, value);
  }
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  const budgets = {
    LCP: 2500, // 2.5 seconds
    INP: 200,  // 200 milliseconds  
    CLS: 0.1,  // 0.1
    bundleSize: 500, // 500KB
    imageSize: 200   // 200KB
  };

  const violations: string[] = [];

  // Check bundle size
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src && src.includes('.js')) {
      // This would need actual bundle size calculation
      console.log('Script:', src);
    }
  });

  return {
    budgets,
    violations,
    isWithinBudget: violations.length === 0
  };
};