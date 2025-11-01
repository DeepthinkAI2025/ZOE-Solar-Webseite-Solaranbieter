/**
 * Mobile Optimization Component für ZOE Solar
 *
 * Stellt sicher, dass die Website auf mobilen Geräten optimal funktioniert
 * und Core Web Vitals auf Mobile erreicht
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface MobileMetrics {
  touchTargetSize: boolean;
  readableFontSize: boolean;
  tapSpacing: boolean;
  viewportOptimized: boolean;
  performanceScore: number;
}

export default function MobileOptimization() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<MobileMetrics>({
    touchTargetSize: false,
    readableFontSize: false,
    tapSpacing: false,
    viewportOptimized: false,
    performanceScore: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      optimizeMobileExperience();
      checkMobileCompliance();
    }
  }, []);

  /**
   * Mobile Experience optimieren
   */
  const optimizeMobileExperience = () => {
    console.log('📱 Optimiere Mobile Experience...');

    // Viewport Meta-Tag sicherstellen
    ensureViewportMeta();

    // Touch-Targets optimieren
    optimizeTouchTargets();

    // Font-Size für Lesbarkeit optimieren
    optimizeFontSize();

    // Mobile-Navigation optimieren
    optimizeMobileNavigation();

    // Bilder für Mobile optimieren
    optimizeMobileImages();

    // Mobile-Specific Performance optimieren
    optimizeMobilePerformance();
  };

  /**
   * Viewport Meta-Tag sicherstellen
   */
  const ensureViewportMeta = () => {
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;

    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }

    viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5.0';
  };

  /**
   * Touch-Targets optimieren (mindestens 48x48px)
   */
  const optimizeTouchTargets = () => {
    const touchElements = document.querySelectorAll('button, a, input, [role="button"], [onclick]');

    touchElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlElement);
      const width = parseInt(computedStyle.width);
      const height = parseInt(computedStyle.height);

      // Touch-Target Größe prüfen und ggf. anpassen
      if (width < 48 || height < 48) {
        const newWidth = Math.max(width, 48);
        const newHeight = Math.max(height, 48);

        htmlElement.style.minWidth = `${newWidth}px`;
        htmlElement.style.minHeight = `${newHeight}px`;
        htmlElement.style.display = 'flex';
        htmlElement.style.alignItems = 'center';
        htmlElement.style.justifyContent = 'center';
      }
    });

    // Abstand zwischen Touch-Targets sicherstellen
    addTouchSpacing();
  };

  /**
   * Abstand zwischen Touch-Targets hinzufügen
   */
  const addTouchSpacing = () => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        button, a, input[type="button"], input[type="submit"] {
          margin: 4px;
        }

        .mobile-nav-item {
          padding: 12px 16px;
          margin: 2px;
        }

        .mobile-button {
          min-height: 48px;
          min-width: 48px;
          padding: 12px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Font-Size für Lesbarkeit optimieren
   */
  const optimizeFontSize = () => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        body {
          font-size: 16px !important;
          line-height: 1.5 !important;
        }

        h1 { font-size: 24px !important; line-height: 1.3 !important; }
        h2 { font-size: 20px !important; line-height: 1.3 !important; }
        h3 { font-size: 18px !important; line-height: 1.3 !important; }
        p { font-size: 16px !important; line-height: 1.6 !important; }

        .mobile-text {
          font-size: 16px !important;
        }

        .small-text {
          font-size: 14px !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Mobile-Navigation optimieren
   */
  const optimizeMobileNavigation = () => {
    // Hamburger-Menu für Mobile
    const nav = document.querySelector('nav');
    if (nav && !nav.querySelector('.mobile-menu-toggle')) {
      const mobileMenu = createMobileMenu(nav);
      nav.appendChild(mobileMenu);
    }
  };

  /**
   * Mobile Menu erstellen
   */
  const createMobileMenu = (nav: Element): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'mobile-menu-container';

    const toggle = document.createElement('button');
    toggle.className = 'mobile-menu-toggle';
    toggle.innerHTML = '☰';
    toggle.setAttribute('aria-label', 'Menu');

    const menu = document.createElement('div');
    menu.className = 'mobile-menu-items';
    menu.style.display = 'none';

    // Navigation Items kopieren
    const navItems = nav.querySelectorAll('a');
    navItems.forEach(item => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.className = 'mobile-nav-item';
      menu.appendChild(clone);
    });

    toggle.onclick = () => {
      const isVisible = menu.style.display !== 'none';
      menu.style.display = isVisible ? 'none' : 'block';
      toggle.innerHTML = isVisible ? '☰' : '✕';
    };

    container.appendChild(toggle);
    container.appendChild(menu);

    // CSS für Mobile Menu
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .mobile-menu-container {
          display: block;
        }

        .mobile-menu-toggle {
          display: block;
          background: none;
          border: none;
          font-size: 24px;
          padding: 12px;
          cursor: pointer;
          min-height: 48px;
          min-width: 48px;
        }

        .mobile-menu-items {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .mobile-nav-item {
          display: block;
          padding: 16px;
          border-bottom: 1px solid #eee;
          text-decoration: none;
          color: #333;
          font-size: 16px;
        }

        .mobile-nav-item:hover {
          background: #f5f5f5;
        }
      }

      @media (min-width: 769px) {
        .mobile-menu-container {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);

    return container;
  };

  /**
   * Bilder für Mobile optimieren
   */
  const optimizeMobileImages = () => {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const htmlImg = img as HTMLImageElement;

      // Responsive Images sicherstellen
      if (!htmlImg.srcset && htmlImg.src) {
        // Mobile-spezifische Bildgrößen
        const mobileSrc = htmlImg.src.replace(/(\.[^.]+)$/, '_mobile$1');
        htmlImg.srcset = `${mobileSrc} 768w, ${htmlImg.src} 1200w`;
        htmlImg.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      }

      // Loading="lazy" für Mobile
      if (!htmlImg.loading) {
        htmlImg.loading = 'lazy';
      }

      // Dimensions für CLS Vermeidung
      if (!htmlImg.width || !htmlImg.height) {
        htmlImg.style.aspectRatio = '16/9';
        htmlImg.style.width = '100%';
        htmlImg.style.height = 'auto';
      }
    });
  };

  /**
   * Mobile Performance optimieren
   */
  const optimizeMobilePerformance = () => {
    // Critical CSS für Mobile
    preloadCriticalCSS();

    // JavaScript auf Mobile reduzieren
    reduceJavaScriptOnMobile();

    // Mobile Caching optimieren
    optimizeMobileCaching();
  };

  /**
   * Critical CSS vorladen
   */
  const preloadCriticalCSS = () => {
    const criticalCSS = `
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .container { max-width: 100%; padding: 0 16px; }
      .mobile-hidden { display: none; }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  };

  /**
   * JavaScript auf Mobile reduzieren
   */
  const reduceJavaScriptOnMobile = () => {
    // Nicht-kritische JavaScript-Features auf Mobile deaktivieren
    if (window.innerWidth <= 768) {
      // Schwere Animationen reduzieren
      document.body.classList.add('reduce-motion');

      // Parallax-Effekte deaktivieren
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach(el => {
        el.removeAttribute('data-parallax');
      });
    }
  };

  /**
   * Mobile Caching optimieren
   */
  const optimizeMobileCaching = () => {
    // Service Worker für Mobile Caching registrieren
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-mobile.js')
        .then(() => console.log('✅ Mobile Service Worker registriert'))
        .catch(err => console.log('❌ Mobile Service Worker Fehler:', err));
    }
  };

  /**
   * Mobile Compliance prüfen
   */
  const checkMobileCompliance = () => {
    let complianceScore = 100;

    // Touch-Target Größe prüfen
    const touchTargets = document.querySelectorAll('button, a, input');
    const validTouchTargets = Array.from(touchTargets).filter(el => {
      const htmlEl = el as HTMLElement;
      const style = window.getComputedStyle(htmlEl);
      return parseInt(style.width) >= 48 && parseInt(style.height) >= 48;
    });

    const touchTargetValid = validTouchTargets.length / touchTargets.length >= 0.9;
    if (!touchTargetValid) complianceScore -= 25;

    // Font-Size prüfen
    const bodyFontSize = parseInt(window.getComputedStyle(document.body).fontSize);
    const fontSizeValid = bodyFontSize >= 16;
    if (!fontSizeValid) complianceScore -= 25;

    // Viewport prüfen
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const viewportValid = !!viewportMeta;
    if (!viewportValid) complianceScore -= 25;

    // Mobile Navigation prüfen
    const mobileNav = document.querySelector('.mobile-menu-container');
    const navigationValid = !!mobileNav || window.innerWidth > 768;
    if (!navigationValid) complianceScore -= 25;

    setMetrics({
      touchTargetSize: touchTargetValid,
      readableFontSize: fontSizeValid,
      tapSpacing: touchTargetValid, // Vereinfachte Prüfung
      viewportOptimized: viewportValid,
      performanceScore: Math.max(0, complianceScore),
    });
  };

  // Component rendert nichts sichtbares - es ist rein für Optimierung
  return null;
}