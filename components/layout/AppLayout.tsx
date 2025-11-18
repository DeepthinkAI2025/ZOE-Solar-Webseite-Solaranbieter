import React, { Suspense, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Page } from '../../types';
import ScrollToTopButton from '../ScrollToTopButton';

// Lazy loaded components (canonical header/footer live here; experimental variants stay opt-in)
const Header = React.lazy(() => import('../Header'));
const Footer = React.lazy(() => import('../Footer'));
const PromoBanner = React.lazy(() => import('../PromoBanner'));

// Theme hooks
import { useThemeState } from '../providers/ThemeProvider';

// Analytics hooks
import { useAnalyticsState } from '../providers/AnalyticsProvider';

// Accessibility hooks
import { useAccessibilityContext } from '../AccessibilityProvider';

// Interfaces
export interface LayoutProps {
  children: React.ReactNode;
  currentPage?: Page;
  setPage?: (page: Page, options?: { scrollToTop?: boolean }) => void;
  isLoggedIn?: boolean;
  user?: any;
  onLogout?: () => void;
  onSelectHersteller?: (slug: string) => void;
  onSelectWissen?: (slug: string) => void;
  onBack?: () => void;
  openCommandHub?: () => void;
}

// Loading fallback for layout components
const LayoutLoadingFallback: React.FC<{ type: 'header' | 'footer' | 'banner' }> = ({ type }) => {
  const heights = {
    header: 'h-20',
    footer: 'h-64',
    banner: 'h-12',
  };

  return (
    <div className={`${heights[type]} bg-slate-100 animate-pulse flex items-center justify-center`}>
      <div className="text-slate-400 text-sm">Laden...</div>
    </div>
  );
};

// Skip links for accessibility
const SkipLinks: React.FC = () => {
  const { announceToScreenReader } = useAccessibilityContext();

  const handleSkipLink = (targetId: string, label: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.focus();
      announceToScreenReader(`Sprung zu ${label}`, 'assertive');
    }
  };

  return (
    <div className="skip-links fixed top-0 left-0 z-[9999] transform -translate-y-full focus-within:translate-y-0">
      <button
        onClick={() => handleSkipLink('main-content', 'Hauptinhalt')}
        className="block px-4 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 w-full text-left"
      >
        Zum Hauptinhalt springen
      </button>
      <button
        onClick={() => handleSkipLink('navigation', 'Navigation')}
        className="block px-4 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 w-full text-left"
      >
        Zur Navigation springen
      </button>
      <button
        onClick={() => handleSkipLink('footer', 'Fußzeile')}
        className="block px-4 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 w-full text-left"
      >
        Zur Fußzeile springen
      </button>
    </div>
  );
};

// Progress indicator for page loading
const PageProgressIndicator: React.FC = () => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (progress >= 100) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
      <div
        className="h-full bg-green-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Main App Layout Component
export const AppLayout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  setPage,
  isLoggedIn = false,
  user,
  onLogout,
  onSelectHersteller,
  onSelectWissen,
  onBack,
  openCommandHub,
}) => {
  // Provide default no-op functions for optional props
  const defaultSetPage: (page: Page, options?: { scrollToTop?: boolean }) => void = () => {};
  const defaultVoid = () => {};
  const defaultSlugHandler: (slug: string) => void = () => {};

  const safeSetPage = setPage ?? defaultSetPage;
  const safeOnLogout = onLogout ?? defaultVoid;
  const safeOnSelectHersteller = onSelectHersteller ?? defaultSlugHandler;
  const safeOnSelectWissen = onSelectWissen ?? defaultSlugHandler;
  const safeOpenCommandHub = openCommandHub ?? defaultVoid;

  // Convert currentPage to a valid Page type or use a default
  const safeCurrentPage: Page = currentPage ?? 'home';
  const location = useLocation();
  const { state: themeState, updatePreferences } = useThemeState();
  const { trackInteraction } = useAnalyticsState();
  const { announceToScreenReader } = useAccessibilityContext();

  // Layout state
  const [bannerHeight, setBannerHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Header scroll behavior
  React.useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolling = currentScrollY > 50;

      setIsScrolling(scrolling);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page view changes
  React.useEffect(() => {
    trackInteraction({
      type: 'scroll',
      element: 'window',
      value: window.scrollY,
      metadata: { page: location.pathname, scrolling: isScrolling },
    });
  }, [location.pathname, isScrolling, trackInteraction]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Global keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          safeOpenCommandHub();
          break;
        case '/':
          e.preventDefault();
          // Focus search input
          const searchInput = document.querySelector('input[type="search"], input[placeholder*="Suche"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
            announceToScreenReader('Suchfeld fokussiert', 'polite');
          }
          break;
      }
    }
  }, [safeOpenCommandHub, announceToScreenReader]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Determine if certain layout elements should be hidden on specific pages
  const shouldHideHeader = ['/login', '/mitarbeiter-login'].includes(location.pathname);
  const shouldHideBanner = ['/admin/', '/seo-monitoring'].some(path => location.pathname.startsWith(path));

  // Handle page change for analytics
  React.useEffect(() => {
    // Announce page change to screen readers
    const pageTitle = document.title;
    announceToScreenReader(`Seite gewechselt: ${pageTitle}`, 'assertive');
  }, [location.pathname, announceToScreenReader]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Indicator */}
      <PageProgressIndicator />

      {/* Skip Links for Accessibility */}
      <SkipLinks />

      {/* Promotional Banner */}
      {!shouldHideBanner && (
        <Suspense fallback={<LayoutLoadingFallback type="banner" />}>
          <PromoBanner
            onHeightChange={setBannerHeight}
            setPage={safeSetPage}
            isLoggedIn={isLoggedIn}
            onLogout={safeOnLogout}
          />
        </Suspense>
      )}

      {/* Main Header */}
      {!shouldHideHeader && (
        <Suspense fallback={<LayoutLoadingFallback type="header" />}>
          <Header
            currentPage={safeCurrentPage}
            setPage={safeSetPage}
            openCommandHub={safeOpenCommandHub}
            bannerHeight={bannerHeight}
            isLoggedIn={isLoggedIn}
            onHeightChange={setHeaderHeight}
            onSelectHersteller={safeOnSelectHersteller}
            onSelectWissen={safeOnSelectWissen}
            onLogout={safeOnLogout}
            theme={themeState.currentMode}
            onToggleTheme={() => {
              const newMode = themeState.currentMode === 'day' ? 'night' : 'day';
              updatePreferences({ autoTheme: false });
              // This would be handled by ThemeProvider internally
            }}
            userPreferences={themeState.preferences}
            voiceInterfaceActive={false} // Would come from AIState
            arMode={false} // Would come from AIState
            gestureControl={false} // Would come from AIState
          />
        </Suspense>
      )}

      {/* Main Content Area */}
      <main
        id="main-content"
        className="flex-1"
        style={{
          paddingTop: shouldHideHeader ? 0 : `${headerHeight}px`,
        }}
        role="main"
        tabIndex={-1}
      >
        {/* Breadcrumb for better navigation (optional) */}
        {(location.pathname !== '/' && !location.pathname.startsWith('/admin/')) && (
          <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200">
            <div className="container mx-auto px-4 py-3">
              <ol className="flex items-center space-x-2 text-sm text-slate-600">
                <li>
                  <a
                    href="/"
                    className="hover:text-primary-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      safeSetPage('home');
                    }}
                  >
                    Startseite
                  </a>
                </li>
                {location.pathname.split('/').filter(Boolean).map((segment, index, array) => (
                  <React.Fragment key={segment}>
                    <li aria-hidden="true">/</li>
                    <li>
                      {index === array.length - 1 ? (
                        <span className="text-slate-900 font-medium capitalize">
                          {segment.replace(/-/g, ' ')}
                        </span>
                      ) : (
                        <a
                          href={`/${array.slice(0, index + 1).join('/')}`}
                          className="hover:text-green-600 transition-colors capitalize"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle breadcrumb navigation
                          }}
                        >
                          {segment.replace(/-/g, ' ')}
                        </a>
                      )}
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </div>
          </nav>
        )}

        {/* Page Content */}
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Main Footer */}
      <Suspense fallback={<LayoutLoadingFallback type="footer" />}>
        <footer id="footer" role="contentinfo">
          <Footer setPage={safeSetPage} />
        </footer>
      </Suspense>

      {/* Layout-specific overlays and global elements */}

      {/* Back to top button */}
      <ScrollToTopButton
        threshold={200}
        onScrollStart={() => announceToScreenReader('Nach oben gescrollt', 'polite')}
      />

      {/* Theme indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40 bg-slate-800 text-white px-3 py-1 rounded text-xs font-mono">
          Theme: {themeState.currentMode} | {themeState.preferences.colorScheme}
        </div>
      )}
    </div>
  );
};

// Responsive layout wrapper
export const ResponsiveLayout: React.FC<LayoutProps> = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`app-wrapper ${isMobile ? 'mobile' : 'desktop'}`}>
      <AppLayout {...props} />
    </div>
  );
};

export default AppLayout;