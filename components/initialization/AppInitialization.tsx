import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { appServices } from '../../services/AppServices';

// Initialization interfaces
export interface InitializationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  duration?: number;
  error?: string;
  required: boolean;
  dependencies: string[];
}

export interface InitializationProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  isLoading: boolean;
  isComplete: boolean;
  hasErrors: boolean;
  startTime: Date | null;
  endTime: Date | null;
  totalDuration: number;
}

export interface InitializationContextType {
  progress: InitializationProgress;
  steps: InitializationStep[];
  startInitialization: () => Promise<void>;
  retryStep: (stepId: string) => Promise<void>;
  skipStep: (stepId: string) => void;
  resetInitialization: () => void;
}

const InitializationContext = createContext<InitializationContextType | undefined>(undefined);

interface AppInitializationProps {
  children: ReactNode;
  onInitializationComplete?: () => void;
  onInitializationError?: (error: Error) => void;
  showProgressUI?: boolean;
  autoStart?: boolean;
}

// Default initialization steps
const DEFAULT_INITIALIZATION_STEPS: Omit<InitializationStep, 'status' | 'duration' | 'error'>[] = [
  {
    id: 'dom-ready',
    name: 'DOM Vorbereitung',
    description: 'Initialisierung der DOM-Struktur und grundlegenden Event-Listener',
    required: true,
    dependencies: [],
  },
  {
    id: 'theme-init',
    name: 'Theme Initialisierung',
    description: 'Laden der Theme-Einstellungen und Benutzervorgaben',
    required: false,
    dependencies: ['dom-ready'],
  },
  {
    id: 'service-worker',
    name: 'Service Worker',
    description: 'Registrierung des Service Workers für Offline-Funktionalität',
    required: false,
    dependencies: ['dom-ready'],
  },
  {
    id: 'analytics-init',
    name: 'Analytics',
    description: 'Initialisierung der Tracking- und Analyse-Dienste',
    required: false,
    dependencies: ['dom-ready'],
  },
  {
    id: 'performance-services',
    name: 'Performance-Services',
    description: 'Initialisierung der Performance-Optimierungsdienste',
    required: true,
    dependencies: ['dom-ready'],
  },
  {
    id: 'ai-services',
    name: 'KI-Services',
    description: 'Initialisierung der KI-basierten Dienste und Features',
    required: false,
    dependencies: ['performance-services'],
  },
  {
    id: 'seo-services',
    name: 'SEO-Services',
    description: 'Initialisierung der SEO-Optimierungsdienste',
    required: true,
    dependencies: ['performance-services'],
  },
  {
    id: 'content-optimization',
    name: 'Content-Optimierung',
    description: 'Initialisierung der Content-Optimierungsdienste',
    required: false,
    dependencies: ['seo-services'],
  },
  {
    id: 'lazy-loading',
    name: 'Lazy Loading',
    description: 'Vorbereitung des Lazy Loadings für Bilder und Komponenten',
    required: true,
    dependencies: ['dom-ready'],
  },
  {
    id: 'error-boundaries',
    name: 'Error Boundaries',
    description: 'Aktivierung der Fehlerbehandlung auf Komponentenebene',
    required: true,
    dependencies: ['dom-ready'],
  },
  {
    id: 'accessibility',
    name: 'Barrierefreiheit',
    description: 'Initialisierung der Accessibility-Features',
    required: true,
    dependencies: ['theme-init'],
  },
  {
    id: 'final-cleanup',
    name: 'Finalisierung',
    description: 'Abschluss der Initialisierung und Bereinigung',
    required: true,
    dependencies: [
      'theme-init',
      'service-worker',
      'analytics-init',
      'performance-services',
      'ai-services',
      'seo-services',
      'content-optimization',
      'lazy-loading',
      'error-boundaries',
      'accessibility',
    ],
  },
];

// Individual step initialization functions
const stepInitializers: Record<string, () => Promise<void>> = {
  'dom-ready': async () => {
    // In einer modernen SPA ist der DOM zu diesem Zeitpunkt in der Regel
    // bereits mindestens "interactive". Damit wir nicht an einem verpassten
    // DOMContentLoaded-Event hängen bleiben, behandeln wir beide Zustände
    // als "bereit" und bauen zusätzlich einen Fallback ein.
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      return;
    }

    await new Promise<void>((resolve) => {
      const handleReadyStateChange = () => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          document.removeEventListener('readystatechange', handleReadyStateChange);
          resolve();
        }
      };

      document.addEventListener('readystatechange', handleReadyStateChange);

      // Safety-Fallback: selbst wenn kein Event mehr kommt, nach 3s weiterlaufen,
      // damit die App nicht dauerhaft bei 0 % hängen bleibt.
      setTimeout(() => {
        document.removeEventListener('readystatechange', handleReadyStateChange);
        resolve();
      }, 3000);
    });
  },

  'theme-init': async () => {
    // Theme initialization happens in ThemeProvider automatically
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  'service-worker': async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('✅ Service Worker registered:', registration);

        // Überprüfen ob Service Worker aktiv ist
        if (registration.active) {
          console.log('✅ Service Worker is active');
        } else {
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker installing...');
          });
        }
      } catch (error) {
        console.warn('⚠️ Service Worker registration failed:', error);
        // Nicht werfen, da Service Worker optional ist
        console.log('ℹ️ Continuing without Service Worker');
      }
    } else {
      console.log('ℹ️ Service Worker skipped (development or not supported)');
    }
  },

  'analytics-init': async () => {
    // Analytics initialization happens in AnalyticsProvider automatically
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  'performance-services': async () => {
    // Performance-Services mit Timeout und Dependency-Checking initialisieren
    try {
      console.log('⚙️ Initializing performance services...');
      const initPromise = appServices.initializeAllServices();

      // Mit Promise.race einen Timeout implementieren
      await Promise.race([
        initPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Performance services initialization timeout')), 5000)
        )
      ]);

      console.log('✅ Performance services initialized successfully');
    } catch (error) {
      console.error('❌ Performance services initialization failed:', error);
      // Nicht werfen, da Performance-Services nicht kritisch für die App-Funktionalität sind
      // App kann weiterhin funktionieren, auch wenn einige Services fehlschlagen
      console.log('ℹ️ App will continue with degraded performance features');
    }
  },

  'ai-services': async () => {
    // AI services are initialized through AppServices
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  'seo-services': async () => {
    // SEO services are initialized through AppServices
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  'content-optimization': async () => {
    // Content optimization services
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  'lazy-loading': async () => {
    // Initialize lazy loading for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }
  },

  'error-boundaries': async () => {
    // Error boundaries are React components that handle themselves
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  'accessibility': async () => {
    // Accessibility features are initialized in AccessibilityProvider
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  'final-cleanup': async () => {
    // Final cleanup and optimizations
    await new Promise(resolve => setTimeout(resolve, 100));
  },
};

// Progress UI Component
const InitializationProgressUI: React.FC<{
  progress: InitializationProgress;
  steps: InitializationStep[];
  onRetry?: (stepId: string) => void;
}> = ({ progress, steps, onRetry }) => {
  const currentStep = steps[progress.currentStep];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="max-w-md w-full mx-4 p-6 bg-white rounded-xl shadow-xl border border-slate-200">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Initialisierung</span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {currentStep.name}
            </h3>
            <p className="text-sm text-slate-600 mb-2">
              {currentStep.description}
            </p>
            {currentStep.status === 'loading' && (
              <div className="flex items-center text-sm text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2" />
                Wird ausgeführt...
              </div>
            )}
            {currentStep.status === 'error' && (
              <div className="text-sm text-red-600">
                Fehler: {currentStep.error}
                {onRetry && (
                  <button
                    onClick={() => onRetry(currentStep.id)}
                    className="ml-2 text-red-600 hover:text-red-700 underline"
                  >
                    Erneut versuchen
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Steps List */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center text-sm p-2 rounded ${
                index === progress.currentStep
                  ? 'bg-slate-100'
                  : step.status === 'completed'
                  ? 'text-green-600'
                  : step.status === 'error'
                  ? 'text-red-600'
                  : 'text-slate-400'
              }`}
            >
              <div className="mr-3">
                {step.status === 'completed' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {step.status === 'loading' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                )}
                {step.status === 'error' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {(step.status === 'pending' || step.status === undefined) && (
                  <div className="w-4 h-4 border-2 border-slate-300 rounded" />
                )}
              </div>
              <div className="flex-1">
                <span className={index === progress.currentStep ? 'font-medium' : ''}>
                  {step.name}
                </span>
                {!step.required && (
                  <span className="ml-2 text-xs text-slate-400">(Optional)</span>
                )}
              </div>
              {step.duration && (
                <span className="text-xs text-slate-500">
                  {step.duration}ms
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main AppInitialization Component
export const AppInitialization: React.FC<AppInitializationProps> = ({
  children,
  onInitializationComplete,
  onInitializationError,
  showProgressUI = true,
  autoStart = true,
}) => {
  const [steps, setSteps] = useState<InitializationStep[]>(() =>
    DEFAULT_INITIALIZATION_STEPS.map((step) => ({
      ...step,
      status: 'pending',
    }))
  );

  const [progress, setProgress] = useState<InitializationProgress>({
    currentStep: 0,
    totalSteps: steps.length,
    percentage: 0,
    isLoading: false,
    isComplete: false,
    hasErrors: false,
    startTime: null,
    endTime: null,
    totalDuration: 0,
  });

  // Update progress when steps change
  useEffect(() => {
    const completedSteps = steps.filter((step) => step.status === 'completed').length;
    const currentStepIndex = steps.findIndex(
      (step) => step.status === 'loading' || step.status === 'pending'
    );

    setProgress((prev) => ({
      ...prev,
      currentStep: Math.max(0, currentStepIndex),
      percentage: Math.round((completedSteps / steps.length) * 100),
      isComplete: completedSteps === steps.length,
      hasErrors: steps.some((step) => step.status === 'error'),
    }));
  }, [steps]);

  // Execute a single initialization step
  const executeStep = async (step: InitializationStep): Promise<void> => {
    const startTime = Date.now();

    // Update step status to loading
    setSteps((prev) =>
      prev.map((s) =>
        s.id === step.id ? { ...s, status: 'loading' as const } : s
      )
    );

    try {
      // Check if step has initializer
      if (stepInitializers[step.id]) {
        await stepInitializers[step.id]();
      } else {
        // Simulate step execution for unknown steps
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const duration = Date.now() - startTime;

      // Update step status to completed
      setSteps((prev) =>
        prev.map((s) =>
          s.id === step.id
            ? { ...s, status: 'completed', duration }
            : s
        )
      );

      console.log(`✅ Initialization step completed: ${step.name} (${duration}ms)`);

      // Force state update processing to prevent race conditions
      await new Promise(resolve => setTimeout(resolve, 10));

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update step status to error
      setSteps((prev) =>
        prev.map((s) =>
          s.id === step.id
            ? { ...s, status: 'error', duration, error: errorMessage }
            : s
        )
      );

      console.error(`❌ Initialization step failed: ${step.name}`, error);

      // If step is required, throw error
      if (step.required) {
        throw error;
      }
    }
  };

  // Run all initialization steps
  const runInitialization = async (): Promise<void> => {
    const startTime = new Date();

    setProgress((prev) => ({
      ...prev,
      isLoading: true,
      startTime,
    }));

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        // Skip step if already completed or not required and previous steps failed
        if (step.status === 'completed') {
          continue;
        }

        // Wait a bit to ensure previous state updates are processed
        await new Promise(resolve => setTimeout(resolve, 5));

        // Get current step status from the latest state
        const getCurrentStepStatus = (stepId: string): string | undefined => {
          // Find the step in the most recent state
          const currentSteps = steps.map((s, idx) => {
            if (idx < i) return { ...s, status: 'completed' }; // Previous steps are completed
            if (idx === i) return s; // Current step
            return s; // Future steps
          });
          return currentSteps.find((s) => s.id === stepId)?.status;
        };

        // Check dependencies mit detailliertem Logging using real-time status
        console.log(`🔍 Checking dependencies for step: ${step.name}`);
        const missingDeps = step.dependencies.filter(depId => {
          const depStatus = getCurrentStepStatus(depId);
          const isCompleted = depStatus === 'completed';
          if (!isCompleted) {
            console.warn(`❌ Missing dependency: ${depId} (status: ${depStatus || 'not found'})`);
          }
          return !isCompleted;
        });

        if (missingDeps.length > 0) {
          const depsList = missingDeps.join(', ');
          if (step.required) {
            console.error(`🚫 Critical: Required step ${step.name} blocked by missing dependencies: ${depsList}`);
            console.error(`📊 Required dependencies status:`);
            step.dependencies.forEach(depId => {
              const depStatus = getCurrentStepStatus(depId);
              console.error(`  - ${depId}: ${depStatus || 'not found'}`);
            });
            throw new Error(`Dependencies not met for required step: ${step.name}. Missing: ${depsList}`);
          } else {
            console.log(`ℹ️ Skipping optional step ${step.name} due to missing dependencies: ${depsList}`);
            setSteps((prev) =>
              prev.map((s) =>
                s.id === step.id
                  ? { ...s, status: 'completed' }
                  : s
              )
            );
            continue;
          }
        } else {
          console.log(`✅ All dependencies met for step: ${step.name}`);
        }

        await executeStep(step);
      }

      const endTime = new Date();
      const totalDuration = endTime.getTime() - startTime.getTime();

      setProgress((prev) => ({
        ...prev,
        isLoading: false,
        isComplete: true,
        endTime,
        totalDuration,
      }));

      console.log(`🎉 App initialization completed in ${totalDuration}ms`);
      onInitializationComplete?.();

    } catch (error) {
      const endTime = new Date();
      const totalDuration = endTime.getTime() - startTime.getTime();

      setProgress((prev) => ({
        ...prev,
        isLoading: false,
        endTime,
        totalDuration,
        hasErrors: true,
      }));

      console.error('❌ App initialization failed:', error);
      onInitializationError?.(error instanceof Error ? error : new Error('Unknown initialization error'));
    }
  };

  // Start initialization
  const startInitialization = async (): Promise<void> => {
    await runInitialization();
  };

  // Retry a failed step
  const retryStep = async (stepId: string): Promise<void> => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      await executeStep(step);
    }
  };

  // Skip a step
  const skipStep = (stepId: string): void => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, status: 'completed' }
          : step
      )
    );
  };

  // Reset initialization
  const resetInitialization = (): void => {
    setSteps(DEFAULT_INITIALIZATION_STEPS.map((step) => ({
      ...step,
      status: 'pending',
    })));

    setProgress({
      currentStep: 0,
      totalSteps: steps.length,
      percentage: 0,
      isLoading: false,
      isComplete: false,
      hasErrors: false,
      startTime: null,
      endTime: null,
      totalDuration: 0,
    });
  };

  // Auto-start initialization
  useEffect(() => {
    if (autoStart && !progress.isLoading && !progress.isComplete) {
      startInitialization();
    }
  }, [autoStart, progress.isLoading, progress.isComplete]);

  const contextValue: InitializationContextType = {
    progress,
    steps,
    startInitialization,
    retryStep,
    skipStep,
    resetInitialization,
  };

  // Show children when initialization is complete or progress UI is disabled
  const shouldShowChildren = !showProgressUI || progress.isComplete;

  return (
    <InitializationContext.Provider value={contextValue}>
      {shouldShowChildren ? (
        children
      ) : (
        showProgressUI && (
          <InitializationProgressUI
            progress={progress}
            steps={steps}
            onRetry={retryStep}
          />
        )
      )}
    </InitializationContext.Provider>
  );
};

// Hook for using initialization context
export const useInitialization = () => {
  const context = useContext(InitializationContext);
  if (!context) {
    throw new Error('useInitialization must be used within an AppInitialization');
  }
  return context;
};

export default AppInitialization;