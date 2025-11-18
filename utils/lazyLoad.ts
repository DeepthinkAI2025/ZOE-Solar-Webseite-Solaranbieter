import * as React from 'react';

// Types
interface LazyLoadOptions {
  fallback?: React.ReactNode;
  loadingHeight?: string | number;
  className?: string;
  preload?: boolean;
  errorComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
}

// Loading Component for lazy loaded components
interface LoadingProps {
  height?: string | number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingProps> = ({
  height = '200px',
  className = ''
}) => (
  React.createElement('div', {
    className: 'flex items-center justify-center ' + className,
    style: { height }
  }, [
    React.createElement('div', {
      className: 'relative'
    }, [
      // Outer spinner
      React.createElement('div', {
        className: 'w-12 h-12 border-4 border-slate-200 border-t-green-500 rounded-full animate-spin'
      }),
      // Inner spinner
      React.createElement('div', {
        className: 'absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-500 rounded-full animate-spin',
        style: { animationDirection: 'reverse', animationDuration: '1.5s' }
      }),
      // Center dot
      React.createElement('div', {
        className: 'absolute inset-0 flex items-center justify-center'
      }, [
        React.createElement('div', {
          className: 'w-2 h-2 bg-slate-800 rounded-full animate-pulse'
        })
      ])
    ])
  ])
);

// Skeleton Loading Component
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({
  lines = 3,
  className = ''
}) => {
  const skeletonLines = Array.from({ length: lines }).map((_, index) =>
    React.createElement('div', { key: index }, [
      React.createElement('div', { className: 'space-y-2' }, [
        React.createElement('div', {
          className: 'h-4 bg-slate-200 rounded animate-pulse'
        }),
        index === 0 && React.createElement('div', {
          className: 'h-6 bg-slate-200 rounded w-3/4 animate-pulse'
        }),
        index === lines - 1 && React.createElement('div', {
          className: 'h-4 bg-slate-200 rounded w-1/2 animate-pulse'
        })
      ])
    ])
  );

  return React.createElement('div', {
    className: 'space-y-3 ' + className
  }, skeletonLines);
};

// Card Skeleton Component
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  const cards = Array.from({ length: count }).map((_, i) =>
    React.createElement('div', { key: i, className: 'bg-white rounded-xl border border-slate-200 p-6 space-y-4' }, [
      React.createElement('div', {
        className: 'h-48 bg-slate-200 rounded-lg overflow-hidden'
      }),
      React.createElement('div', {
        className: 'h-6 bg-slate-200 rounded w-3/4'
      }),
      React.createElement('div', {
        className: 'h-4 bg-slate-200 rounded'
      }),
      React.createElement('div', {
        className: 'h-10 bg-slate-200 rounded'
      })
    ])
  );

  return React.createElement('div', {
    className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
  }, cards);
};

// Enhanced Lazy Load HOC with error handling
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: {
    fallback?: React.ReactNode;
    loadingHeight?: string | number;
    preload?: boolean;
    errorComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
  } = {}
) {
  const LazyComponent = React.lazy(importFunc);

  // Preload component if requested
  if (options.preload) {
    importFunc().catch(error => {
      console.warn('Failed to preload component:', error);
    });
  }

  const ErrorComponent = options.errorComponent || (({ error, retry }) =>
    React.createElement('div', { className: 'flex flex-col items-center justify-center p-8 text-center' }, [
      React.createElement('div', {
        className: 'w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'
      }, [
        React.createElement('svg', {
          className: 'w-8 h-8 text-red-600',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        }, [
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '2',
            d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          })
        ])
      ]),
      React.createElement('h3', {
        className: 'text-lg font-semibold text-slate-800 mb-2'
      }, 'Something went wrong'),
      React.createElement('p', {
        className: 'text-slate-600 mb-4'
      }, error.message),
      React.createElement('button', {
        onClick: retry,
        className: 'px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
      }, 'Try Again')
    ])
  );

  return (props: React.ComponentProps<T>) => (
    React.createElement(React.Fragment, null,
      React.createElement(React.Suspense, {
        fallback: options.fallback || React.createElement(LoadingSpinner, {
          height: options.loadingHeight || '400px',
          className: 'w-full'
        })
      }),
      React.createElement(ErrorBoundary, {
        fallback: ErrorComponent,
        children: React.createElement(LazyComponent, props)
      })
    )
  );
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Simplified ErrorBoundary using functional approach with try-catch
function ErrorBoundary({
  fallback: FallbackComponent,
  children
}: {
  fallback: React.ComponentType<{ error: Error; retry: () => void }>;
  children: React.ReactNode;
}) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    const handleError = (err: Error) => {
      console.warn('Error caught:', err);
      setHasError(true);
      setError(err);

      // Log to analytics service
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: err.message,
          fatal: false,
        });
      }
    };

    // Set up global error handler for this component tree
    const originalHandler = window.onerror;
    window.onerror = (msg, url, line, col, err) => {
      if (err) handleError(err);
      if (originalHandler) return originalHandler(msg, url, line, col, err);
      return false;
    };

    return () => {
      window.onerror = originalHandler;
    };
  }, []);

  const retry = () => {
    setHasError(false);
    setError(undefined);
  };

  if (hasError && error) {
    return React.createElement(FallbackComponent, {
      error,
      retry
    });
  }

  return React.createElement(React.Fragment, null, children);
}

// Preload utility for critical components
export function preloadComponent(importFunc: () => Promise<{ default: any }>) {
  // Start loading the component in the background
  importFunc().catch(error => {
    console.warn('Failed to preload component:', error);
  });
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Image lazy loading utility
export function LazyImage({
  src,
  alt,
  className = '',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const isIntersecting = useIntersectionObserver(imgRef);

  React.useEffect(() => {
    if (isIntersecting && imgRef.current && !imgRef.current.src) {
      imgRef.current.src = src || '';
    }
  }, [isIntersecting, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return React.createElement('div', {
    className: 'relative overflow-hidden ' + className
  }, [
    // Placeholder
    !isLoaded && !hasError && React.createElement('div', {
      className: 'absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center'
    }, [
      React.createElement('svg', {
        className: 'w-8 h-8 text-slate-400',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
      }, [
        React.createElement('path', {
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '2',
          d: 'M4 16l4.586-4.586a2 2 0 012.828 0L8 12.586l7.293-7.293a1 1 0 011.414 1.414l-4 4-4-4'
        })
      ])
    ]),

    // Actual image
    React.createElement('img', {
      ref: imgRef,
      alt: alt,
      'data-src': src,
      onLoad: handleLoad,
      onError: handleError,
      className: `transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
      ...props
    }),

    // Error fallback
    hasError && React.createElement('div', {
      className: 'absolute inset-0 bg-slate-100 flex items-center justify-center'
    }, [
      React.createElement('div', { className: 'text-center' }, [
        React.createElement('svg', {
          className: 'w-8 h-8 text-slate-400 mx-auto mb-2',
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        }, [
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '2',
            d: 'M12 9v2m0 4h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
          })
        ]),
        React.createElement('span', {
          className: 'text-sm text-slate-500'
        }, 'Failed to load')
      ])
    ])
  ]);
}

// Resource hints utility
export function addResourceHints() {
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/poppins-v20-latin-regular.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preconnect to external domains
  const domains = [
    'https://fonts.googleapis.com',
    'https://api.zoesolar.de',
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// Performance monitoring utility
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const startTime = performance.now();

  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      const endTime = performance.now();
      console.log(`${name} took ${endTime - startTime}ms`);
    });
  } else {
    const endTime = performance.now();
    console.log(`${name} took ${endTime - startTime}ms`);
    return result;
  }
}

// Helper function to generate consistent className combinations
export function cn(...inputs: string[]): string {
  return inputs.filter(Boolean).join(' ');
}

export default {
  createLazyComponent,
  preloadComponent,
  useIntersectionObserver,
  LazyImage,
  LoadingSpinner,
  SkeletonLoader,
  CardSkeleton,
  measurePerformance,
  addResourceHints
};