export interface CriticalCSSConfig {
  viewport: {
    width: number;
    height: number;
  };
  selectors: string[];
  ignoreSelectors: string[];
  enableInlining: boolean;
  minifyOutput: boolean;
}

export class CriticalCSSExtractor {
  private static instance: CriticalCSSExtractor;
  private config: CriticalCSSConfig;
  private criticalCSS: Map<string, string> = new Map();

  private constructor(config?: Partial<CriticalCSSConfig>) {
    this.config = {
      viewport: { width: 1200, height: 800 },
      selectors: [
        'html', 'body', 'header', 'nav', 'main', 'footer',
        '.hero', '.header', '.navigation', '.logo',
        'h1', 'h2', 'h3', 'p', 'a', 'button',
        '.btn', '.button', '.cta', '.primary',
        '.container', '.wrapper', '.grid', '.flex'
      ],
      ignoreSelectors: [
        '.modal', '.popup', '.dropdown-menu', '.tooltip',
        '.accordion-content', '.tab-content', '.carousel-item:not(.active)',
        '@media print', '.print-only'
      ],
      enableInlining: true,
      minifyOutput: true,
      ...config
    };
  }

  static getInstance(config?: Partial<CriticalCSSConfig>): CriticalCSSExtractor {
    if (!CriticalCSSExtractor.instance) {
      CriticalCSSExtractor.instance = new CriticalCSSExtractor(config);
    }
    return CriticalCSSExtractor.instance;
  }

  async extractCriticalCSS(path: string): Promise<string> {
    if (this.criticalCSS.has(path)) {
      return this.criticalCSS.get(path)!;
    }

    try {
      const criticalStyles = await this.generateCriticalCSS(path);
      this.criticalCSS.set(path, criticalStyles);
      return criticalStyles;
    } catch (error) {
      console.error(`Failed to extract critical CSS for ${path}:`, error);
      return '';
    }
  }

  private async generateCriticalCSS(path: string): Promise<string> {
    // Get all stylesheets from the document
    const stylesheets = Array.from(document.styleSheets);
    const criticalRules: string[] = [];

    for (const stylesheet of stylesheets) {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        
        for (const rule of rules) {
          if (this.isCriticalRule(rule)) {
            criticalRules.push(rule.cssText);
          }
        }
      } catch (error) {
        // Cross-origin stylesheets might throw errors
        console.warn('Cannot access stylesheet rules:', error);
      }
    }

    // Add above-the-fold specific styles
    const aboveFoldStyles = this.getAboveFoldStyles(path);
    criticalRules.push(...aboveFoldStyles);

    let criticalCSS = criticalRules.join('\n');

    if (this.config.minifyOutput) {
      criticalCSS = this.minifyCSS(criticalCSS);
    }

    return criticalCSS;
  }

  private isCriticalRule(rule: CSSRule): boolean {
    if (rule.type === CSSRule.STYLE_RULE) {
      const styleRule = rule as CSSStyleRule;
      const selector = styleRule.selectorText;

      // Check if selector is in ignore list
      if (this.config.ignoreSelectors.some(ignore => selector.includes(ignore))) {
        return false;
      }

      // Check if selector is critical
      return this.config.selectors.some(critical => 
        selector.includes(critical) || 
        this.isSelectorAboveFold(selector)
      );
    }

    if (rule.type === CSSRule.MEDIA_RULE) {
      const mediaRule = rule as CSSMediaRule;
      // Include critical media queries (mobile-first)
      return mediaRule.media.mediaText.includes('max-width') || 
             mediaRule.media.mediaText.includes('min-width: 768px') ||
             mediaRule.media.mediaText.includes('screen');
    }

    return false;
  }

  private isSelectorAboveFold(selector: string): boolean {
    try {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        // Check if element is in viewport
        if (rect.top < this.config.viewport.height && 
            rect.left < this.config.viewport.width &&
            rect.bottom > 0 && 
            rect.right > 0) {
          return true;
        }
      }
    } catch (error) {
      // Invalid selector
      return false;
    }
    return false;
  }

  private getAboveFoldStyles(path: string): string[] {
    const styles: string[] = [];

    // Critical layout styles
    styles.push(`
      html, body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `);

    // Header and navigation critical styles
    styles.push(`
      header {
        position: relative;
        z-index: 100;
        background: #fff;
        border-bottom: 1px solid #e5e7eb;
      }
      
      nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
      }
      
      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: #059669;
      }
    `);

    // Hero section critical styles
    if (path === '/' || path === '/home') {
      styles.push(`
        .hero {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hero h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .hero p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
      `);
    }

    // Critical button styles
    styles.push(`
      .btn, .button, .cta {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        text-decoration: none;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
        border: none;
        cursor: pointer;
      }
      
      .btn-primary, .button-primary, .cta-primary {
        background: #059669;
        color: white;
      }
      
      .btn-primary:hover, .button-primary:hover, .cta-primary:hover {
        background: #047857;
        transform: translateY(-1px);
      }
    `);

    return styles;
  }

  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
      .replace(/;\s*/g, ';') // Remove spaces after semicolon
      .replace(/,\s*/g, ',') // Remove spaces after comma
      .replace(/:\s*/g, ':') // Remove spaces after colon
      .trim();
  }

  generateInlineStyles(path: string): string {
    const criticalCSS = this.criticalCSS.get(path) || '';
    return `<style id="critical-css">${criticalCSS}</style>`;
  }

  async preloadNonCriticalCSS(): Promise<void> {
    // Get all stylesheets and mark non-critical ones for preloading
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    
    for (const link of stylesheets) {
      if (!link.dataset.critical) {
        // Convert to preload
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'style';
        preloadLink.href = link.href;
        preloadLink.onload = () => {
          preloadLink.rel = 'stylesheet';
        };
        
        // Insert preload link
        document.head.insertBefore(preloadLink, link);
        
        // Remove original link temporarily
        link.remove();
        
        // Add back as low priority
        setTimeout(() => {
          if (!document.querySelector(`link[href="${link.href}"]`)) {
            document.head.appendChild(link);
          }
        }, 100);
      }
    }
  }

  getCacheStats(): { size: number; paths: string[] } {
    return {
      size: this.criticalCSS.size,
      paths: Array.from(this.criticalCSS.keys())
    };
  }

  clearCache(): void {
    this.criticalCSS.clear();
  }
}

export const criticalCSSExtractor = CriticalCSSExtractor.getInstance();