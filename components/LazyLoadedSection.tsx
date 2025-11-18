import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadedSectionProps {
  children: ReactNode;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  fallbackHeight?: string;
  threshold?: number;
  rootMargin?: string;
}

// Skeleton component for loading state
const SectionSkeleton: React.FC<{ height?: string }> = ({ height = '400px' }) => (
  <div 
    className="flex items-center justify-center bg-slate-100 rounded-3xl"
    style={{ height }}
  >
    <div className="text-center">
      <div className="w-16 h-16 bg-green-200 rounded-full animate-pulse mx-auto mb-4"></div>
      <div className="h-6 bg-slate-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded w-32 mx-auto animate-pulse"></div>
    </div>
  </div>
);

// Intersection Observer hook
const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit
) => {
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(elementRef);

    return () => observer.disconnect();
  }, [elementRef, callback, options]);

  return setElementRef;
};

const LazyLoadedSection: React.FC<LazyLoadedSectionProps> = ({
  children,
  component: Component,
  fallbackHeight = '600px',
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for performance monitoring
  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLoaded) {
      setIsVisible(true);
      
      // Performance tracking
      if (typeof window !== 'undefined' && 'performance' in window) {
        performance.mark('lazy-section-start');
      }

      // Simulate loading time for large components (remove in production)
      setTimeout(() => {
        setIsLoaded(true);
        
        if (typeof window !== 'undefined' && 'performance' in window) {
          performance.mark('lazy-section-end');
          performance.measure('lazy-section-load', 'lazy-section-start', 'lazy-section-end');
          
          const measure = performance.getEntriesByName('lazy-section-load')[0];
          console.log(`Lazy section loaded in: ${measure.duration.toFixed(2)}ms`);
          
          // Clean up performance marks
          performance.clearMarks();
          performance.clearMeasures();
        }
      }, Math.random() * 500 + 100); // Random delay for demo purposes
    }
  };

  const setRef = useIntersectionObserver(intersectionCallback, {
    threshold,
    rootMargin
  });

  const handleRef = (node: HTMLDivElement) => {
    sectionRef.current = node;
    setRef(node);
  };

  return (
    <div ref={handleRef} className="w-full">
      {isLoaded ? (
        <React.Suspense 
          fallback={
            <SectionSkeleton height={fallbackHeight} />
          }
        >
          <Component />
        </React.Suspense>
      ) : (
        <SectionSkeleton height={fallbackHeight} />
      )}
    </div>
  );
};

export default LazyLoadedSection;

// Preloading utilities for critical sections
export const preloadSection = (component: React.LazyExoticComponent<React.ComponentType<any>>) => {
  if (typeof window !== 'undefined') {
    // Preload in idle time
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        component.preload?.();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        component.preload?.();
      }, 100);
    }
  }
};

// Higher-order component for automatic preloading
export const withLazyLoading = <P extends object>(
  Component: React.LazyExoticComponent<React.ComponentType<P>>,
  preloadThreshold: number = 0.5
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const [shouldPreload, setShouldPreload] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;

        if (scrollPercentage > preloadThreshold && !shouldPreload) {
          setShouldPreload(true);
          preloadSection(Component);
        }
      };

      // Throttled scroll handler for performance
      let ticking = false;
      const throttledScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', throttledScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', throttledScroll);
      };
    }, [shouldPreload, preloadThreshold]);

    return <Component ref={ref} {...props} />;
  });
};