/**
 * SEO Manager Component - ZOE Solar
 *
 * React-Komponente zur Verwaltung aller SEO-Optimierungen
 * Wird in der Hauptanwendung eingebunden für automatische Aktivierung
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOManagerProps {
  enableDebugMode?: boolean;
  customTracking?: {
    userId?: string;
    customerType?: 'private' | 'business' | 'prospect';
    serviceInterest?: string[];
  };
}

const SEOManager: React.FC<SEOManagerProps> = ({
  enableDebugMode = false,
  customTracking
}) => {
  const location = useLocation();
  const [seoStatus, setSeoStatus] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  useEffect(() => {
    // SEO-Services sicherstellen, dass sie geladen sind
    if (typeof window !== 'undefined' && window.zoeSolarSEO) {
      updateSEOStatus();

      // Page Change Tracking
      trackPageChange();

      // Custom Tracking anwenden
      applyCustomTracking();

      // Regelmäßige Updates
      const interval = setInterval(updateSEOStatus, 30000); // Alle 30 Sekunden

      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  /**
   * SEO-Status aktualisieren
   */
  const updateSEOStatus = () => {
    if (window.zoeSolarSEO) {
      const status = window.zoeSolarSEO.getServiceStatus();
      const metrics = window.zoeSolarSEO.getPerformanceMetrics();

      setSeoStatus(status);
      setPerformanceMetrics(metrics);

      // Debug-Modus Logging
      if (enableDebugMode) {
        console.log('🔍 SEO Status Update:', status);
        console.log('📊 Performance Metrics:', metrics);
      }
    }
  };

  /**
   * Seitenwechsel tracken
   */
  const trackPageChange = () => {
    if (window.analytics) {
      // Google Analytics Page View
      window.analytics.trackPageView();
    }

    // Core Web Vitals Reset für neue Seite
    if (window.coreWebVitalsMonitor) {
      // Page-spezifische Optimierungen durchführen
      optimizePageForSEO();
    }

    // Structured Data für neue Seite injizieren
    injectPageStructuredData();
  };

  /**
   * Custom Tracking anwenden
   */
  const applyCustomTracking = () => {
    if (window.analytics && customTracking) {
      // Benutzer-Properties aktualisieren
      const userProperties: Record<string, any> = {};

      if (customTracking.customerType) {
        userProperties.customer_type = customTracking.customerType;
      }

      if (customTracking.serviceInterest) {
        userProperties.service_interest = customTracking.serviceInterest.join(',');
      }

      window.analytics.setUserProperties(userProperties);

      // Custom Events senden
      if (customTracking.userId) {
        window.analytics.setUserId(customTracking.userId);
        window.analytics.trackEvent({
          name: 'user_identified',
          parameters: {
            user_id: customTracking.userId,
            customer_type: customTracking.customerType,
            page_location: location.pathname
          }
        });
      }
    }
  };

  /**
   * Seiten-spezifische SEO-Optimierungen
   */
  const optimizePageForSEO = () => {
    // Bilder optimieren
    optimizeImages();

    // Schriftarten vorladen
    preloadCriticalFonts();

    // Resource Hints hinzufügen
    addResourceHints();

    // Lokale Inhalte optimieren
    optimizeLocalContent();
  };

  /**
   * Bilder optimieren
   */
  const optimizeImages = () => {
    const images = document.querySelectorAll('img:not([data-optimized])');

    images.forEach(img => {
      // Lazy Loading hinzufügen
      img.setAttribute('loading', 'lazy');

      // WebP-Fallback hinzufügen
      const src = img.getAttribute('src');
      if (src && !src.includes('.webp') && !src.includes('data:')) {
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.setAttribute('type', 'image/webp');
        source.setAttribute('srcset', src.replace(/\.(jpg|jpeg|png)$/, '.webp'));

        picture.appendChild(source);
        picture.appendChild(img.cloneNode());

        img.parentNode?.replaceChild(picture, img);
      }

      img.setAttribute('data-optimized', 'true');
    });
  };

  /**
   * Kritische Schriftarten vorladen
   */
  const preloadCriticalFonts = () => {
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
    ];

    fonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';

      if (!document.querySelector(`link[href="${fontUrl}"]`)) {
        document.head.appendChild(link);
      }
    });
  };

  /**
   * Resource Hints hinzufügen
   */
  const addResourceHints = () => {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'preconnect', href: '//fonts.gstatic.com', crossOrigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);

      if (!document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`)) {
        document.head.appendChild(link);
      }
    });
  };

  /**
   * Lokale Inhalte optimieren
   */
  const optimizeLocalContent = () => {
    // Standort-basierte Inhalte anpassen
    const path = location.pathname.toLowerCase();

    if (path.includes('/berlin')) {
      optimizeForLocation('Berlin', 'DE-BE');
    } else if (path.includes('/muenchen')) {
      optimizeForLocation('München', 'DE-BY');
    } else if (path.includes('/hamburg')) {
      optimizeForLocation('Hamburg', 'DE-HH');
    } else if (path.includes('/koeln')) {
      optimizeForLocation('Köln', 'DE-NW');
    }
  };

  /**
   * Standort-spezifische Optimierungen
   */
  const optimizeForLocation = (city: string, region: string) => {
    // Meta-Tags aktualisieren
    document.title = `${document.title.replace('ZOE Solar', `ZOE Solar ${city}`)}`;

    // Lokale Schema-Daten hinzufügen
    if (window.structuredDataExtended) {
      // LocalBusiness Schema für die Stadt
      const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `ZOE Solar ${city}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: city,
          addressRegion: region,
          addressCountry: 'DE'
        }
      };

      window.structuredDataExtended.injectStructuredData(
        JSON.stringify(localBusinessSchema, null, 2),
        `local-business-${city.toLowerCase()}`
      );
    }
  };

  /**
   * Seitenspezifische strukturierte Daten injizieren
   */
  const injectPageStructuredData = () => {
    if (window.structuredDataExtended) {
      const pageType = determinePageType();
      window.structuredDataExtended.injectAllExtendedSchemas();
    }
  };

  /**
   * Seiten-Typ bestimmen
   */
  const determinePageType = (): string => {
    const path = location.pathname.toLowerCase();

    if (path === '/' || path === '') return 'home';
    if (path.includes('/photovoltaik') || path.includes('/solar')) return 'service';
    if (path.includes('/standort') || path.includes('/kontakt')) return 'location';
    if (path.includes('/wissen') || path.includes('/magazin')) return 'content';

    return 'general';
  };

  /**
   * Empfehlungen generieren
   */
  const generateRecommendations = (): string[] => {
    if (!performanceMetrics?.coreWebVitals) return [];

    const recommendations: string[] = [];
    const metrics = performanceMetrics.coreWebVitals;

    if (metrics.lcp > 2500) {
      recommendations.push('⚠️ LCP optimieren: Bilder vorladen, Critical CSS reduzieren');
    }

    if (metrics.fid > 100) {
      recommendations.push('⚠️ FID reduzieren: JavaScript optimieren, Code Splitting implementieren');
    }

    if (metrics.cls > 0.1) {
      recommendations.push('⚠️ CLS minimieren: Bild-Dimensionen angeben, Font-Display optimieren');
    }

    return recommendations;
  };

  return (
    <>
      {/* SEO Manager hat keine visuelle Ausgabe, aber Status-Informationen */}
      {enableDebugMode && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            ZOE Solar SEO Status
          </div>

          {seoStatus && (
            <div>
              {Object.entries(seoStatus).map(([service, status]) => (
                <div key={service} style={{
                  color: status ? '#4ade80' : '#f87171',
                  margin: '2px 0'
                }}>
                  {service}: {status ? '✅' : '❌'}
                </div>
              ))}
            </div>
          )}

          {performanceMetrics?.coreWebVitals && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #666', paddingTop: '5px' }}>
              <div>Score: {performanceMetrics.coreWebVitals.score}/100</div>
              <div>LCP: {Math.round(performanceMetrics.coreWebVitals.lcp)}ms</div>
              <div>FID: {Math.round(performanceMetrics.coreWebVitals.fid)}ms</div>
              <div>CLS: {performanceMetrics.coreWebVitals.cls.toFixed(3)}</div>
            </div>
          )}

          {generateRecommendations().length > 0 && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #666', paddingTop: '5px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>Recommendations:</div>
              {generateRecommendations().map((rec, index) => (
                <div key={index} style={{ fontSize: '11px', margin: '2px 0' }}>
                  {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SEOManager;