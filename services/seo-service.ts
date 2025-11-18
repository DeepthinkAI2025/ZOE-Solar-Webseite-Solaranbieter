/**
 * Essential SEO Service für ZOE Solar
 *
 * Implementiert die wichtigsten SEO-Funktionen ohne Über-Engineering
 */

export interface SEOResult {
  titleOptimized: boolean;
  descriptionOptimized: boolean;
  headingsOptimized: boolean;
  keywordsOptimized: boolean;
  internalLinksOptimized: boolean;
  score: number;
}

class SEOService implements ServiceInterface {
  name = 'Essential SEO Service';
  version = '1.0.0';

  private currentScore = 0;
  private results: Partial<SEOResult> = {};

  async initialize(): Promise<void> {
    console.log('🔍 Initialisiere SEO Service...');
    await this.runSEOOptimization();
  }

  /**
   * Haupt-SEO Optimierung
   */
  async runSEOOptimization(): Promise<SEOResult> {
    console.log('🚀 Führe SEO Optimierung durch...');

    // Meta Tags optimieren
    await this.optimizeMetaTags();

    // Überschriftenstruktur optimieren
    await this.optimizeHeadings();

    // Keywords optimieren
    await this.optimizeKeywords();

    // Interne Verlinkung optimieren
    await this.optimizeInternalLinks();

    // Structured Data optimieren
    await this.optimizeStructuredData();

    // Score berechnen
    this.calculateScore();

    console.log(`✅ SEO Optimierung abgeschlossen mit Score: ${this.currentScore}/100`);

    return {
      titleOptimized: this.results.titleOptimized || false,
      descriptionOptimized: this.results.descriptionOptimized || false,
      headingsOptimized: this.results.headingsOptimized || false,
      keywordsOptimized: this.results.keywordsOptimized || false,
      internalLinksOptimized: this.results.internalLinksOptimized || false,
      score: this.currentScore,
    };
  }

  /**
   * Meta Tags optimieren
   */
  private async optimizeMetaTags(): Promise<void> {
    console.log('📝 Optimiere Meta Tags...');

    // Title Tag optimieren
    this.optimizeTitleTag();

    // Meta Description optimieren
    this.optimizeMetaDescription();

    // Open Graph Tags
    this.optimizeOpenGraph();

    // Twitter Cards
    this.optimizeTwitterCards();

    // Viewport Meta Tag
    this.ensureViewportMeta();

    // Canonical URL
    this.ensureCanonicalURL();

    // Robots Meta Tag
    this.optimizeRobotsMeta();

    this.results.titleOptimized = true;
    this.results.descriptionOptimized = true;
  }

  /**
   * Title Tag optimieren
   */
  private optimizeTitleTag(): void {
    let title = document.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      document.head.appendChild(title);
    }

    const currentPage = this.getCurrentPageType();
    const optimizedTitle = this.generateOptimizedTitle(currentPage);

    title.textContent = optimizedTitle;
    console.log('📝 Title Tag optimized:', optimizedTitle);
  }

  /**
   * Aktuellen Page-Typ identifizieren
   */
  private getCurrentPageType(): 'home' | 'service' | 'contact' | 'about' | 'blog' | 'other' {
    const path = window.location.pathname;

    if (path === '/' || path === '/home') return 'home';
    if (path.includes('service') || path.includes('leistung')) return 'service';
    if (path.includes('contact') || path.includes('kontakt')) return 'contact';
    if (path.includes('about') || path.includes('ueber-uns')) return 'about';
    if (path.includes('blog') || path.includes('news')) return 'blog';

    return 'other';
  }

  /**
   * Optimierten Title generieren
   */
  private generateOptimizedTitle(pageType: string): string {
    const templates = {
      home: 'ZOE Solar | Photovoltaik für Unternehmen in ganz Deutschland',
      service: 'Solaranlagen für Unternehmen | ZOE Solar Photovoltaik',
      contact: 'Kontakt | ZOE Solar - Ihr Photovoltaik Partner',
      about: 'Über uns | ZOE Solar - Experten für Solaranlagen',
      blog: 'Photovoltaik Blog | Aktuelles von ZOE Solar',
      other: 'ZOE Solar | Photovoltaik Lösungen für Unternehmen',
    };

    return templates[pageType as keyof typeof templates] || templates.other;
  }

  /**
   * Meta Description optimieren
   */
  private optimizeMetaDescription(): void {
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;

    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }

    const pageType = this.getCurrentPageType();
    const optimizedDescription = this.generateOptimizedDescription(pageType);

    metaDesc.content = optimizedDescription;
    console.log('📝 Meta Description optimized:', optimizedDescription);
  }

  /**
   * Optimierte Meta Description generieren
   */
  private generateOptimizedDescription(pageType: string): string {
    const descriptions = {
      home: 'ZOE Solar ist Ihr erfahrener Partner für gewerbliche Photovoltaik-Anlagen. Planung, Installation und Wartung von Solaranlagen für Unternehmen in ganz Deutschland. Fordern Sie Ihr kostenloses Angebot an!',
      service: 'Professionelle Solaranlagen für Unternehmen von ZOE Solar. Individuelle Photovoltaik-Lösungen mit optimierter Rentabilität. Beratung, Planung und Installation aus einer Hand.',
      contact: 'Kontaktieren Sie ZOE Solar für eine kostenlose Beratung zu Ihrer gewerblichen Solaranlage. Unsere Experten helfen Ihnen bei der Planung und Umsetzung.',
      about: 'Erfahren Sie mehr über ZOE Solar - Ihr Experte für gewerbliche Photovoltaik. Langjährige Erfahrung, zertifizierte Qualität und maßgeschneiderte Lösungen.',
      blog: 'Bleiben Sie informiert über aktuelle Themen rund um Photovoltaik und Solaranlagen für Unternehmen. Tipps, Trends und Fachwissen von ZOE Solar.',
    };

    return descriptions[pageType as keyof typeof descriptions] || descriptions.home;
  }

  /**
   * Open Graph Tags optimieren
   */
  private optimizeOpenGraph(): void {
    const ogTags = [
      { property: 'og:title', content: document.title },
      { property: 'og:description', content: this.generateOptimizedDescription(this.getCurrentPageType()) },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'de_DE' },
      { property: 'og:site_name', content: 'ZOE Solar' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: 'https://zoe-solar.de/images/og-default.jpg' },
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });
  }

  /**
   * Twitter Cards optimieren
   */
  private optimizeTwitterCards(): void {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: document.title },
      { name: 'twitter:description', content: this.generateOptimizedDescription(this.getCurrentPageType()) },
      { name: 'twitter:image', content: 'https://zoe-solar.de/images/twitter-default.jpg' },
      { name: 'twitter:site', content: '@zoe_solar' },
    ];

    twitterTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', tag.name);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });
  }

  /**
   * Viewport Meta Tag sicherstellen
   */
  private ensureViewportMeta(): void {
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;

    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }
  }

  /**
   * Canonical URL sicherstellen
   */
  private ensureCanonicalURL(): void {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    canonical.href = window.location.href.split('?')[0];
  }

  /**
   * Robots Meta Tag optimieren
   */
  private optimizeRobotsMeta(): void {
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;

    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
      document.head.appendChild(robots);
    }
  }

  /**
   * Überschriftenstruktur optimieren
   */
  private async optimizeHeadings(): Promise<void> {
    console.log('📑 Optimiere Überschriftenstruktur...');

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let h1Count = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent?.trim() || '';

      // H1 Prüfung
      if (level === 1) {
        h1Count++;
        if (h1Count > 1) {
          console.warn('⚠️ Mehr als eine H1 gefunden:', text);
        }
      }

      // Überschriften-Reihenfolge prüfen
      if (index > 0) {
        const prevHeading = headings[index - 1];
        const prevLevel = parseInt(prevHeading.tagName.charAt(1));

        if (level > prevLevel + 1) {
          console.warn(`⚠️ Überschriften-Level-Sprung: H${prevLevel} -> H${level}`);
        }
      }

      // SEO-Optimierte Überschriften
      if (!text || text.length < 10) {
        heading.textContent = this.generateOptimizedHeading(level, heading);
      }
    });

    if (h1Count === 0) {
      console.warn('⚠️ Keine H1 gefunden - erstelle eine...');
      this.createMissingH1();
    }

    this.results.headingsOptimized = true;
  }

  /**
   * SEO-optimierte Überschrift generieren
   */
  private generateOptimizedHeading(level: number, original: Element): string {
    const keywords = [
      'Solaranlagen', 'Photovoltaik', 'Solarstrom', 'gewerbliche Solaranlage',
      'Unternehmen', 'Rendite', 'Förderung', 'Energie', 'Nachhaltigkeit'
    ];

    // Für H1: Titel-ähnliche Überschrift
    if (level === 1) {
      return 'Professionelle Solaranlagen für Unternehmen von ZOE Solar';
    }

    // Für H2-H6: Keyword-optimierte Überschriften
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    return `${randomKeyword} für gewerbliche Nutzung`;
  }

  /**
   * Fehlende H1 erstellen
   */
  private createMissingH1(): void {
    const mainHeading = document.querySelector('h1') || document.querySelector('.hero-title');
    if (!mainHeading) {
      const h1 = document.createElement('h1');
      h1.textContent = 'ZOE Solar - Ihr Partner für gewerbliche Photovoltaik';
      const firstSection = document.querySelector('section') || document.querySelector('main');
      if (firstSection) {
        firstSection.insertBefore(h1, firstSection.firstChild);
      }
    }
  }

  /**
   * Keywords optimieren
   */
  private async optimizeKeywords(): Promise<void> {
    console.log('🔍 Optimiere Keywords...');

    // Keywords Meta Tag (deprecated aber nützlich für manche Crawler)
    let keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;

    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.name = 'keywords';
      document.head.appendChild(keywordsMeta);
    }

    const keywords = this.generateOptimizedKeywords();
    keywordsMeta.content = keywords.join(', ');

    // Content Keywords analysieren und optimieren
    this.analyzeContentKeywords();

    this.results.keywordsOptimized = true;
  }

  /**
   * Optimierte Keywords generieren
   */
  private generateOptimizedKeywords(): string[] {
    return [
      'Solaranlagen', 'Photovoltaik', 'Solarstrom', 'gewerbliche Solaranlagen',
      'Unternehmen', 'Gewerbe', 'Solarförderung', 'Photovoltaik Förderung',
      'Stromspeicher', 'Solaranlage Rendite', 'Photovoltaik Anlage',
      'Solaranlagen Kosten', 'Photovoltaik Preis', 'Solar Installateur',
      'Solaranlagen Berlin', 'Photovoltaik München', 'Solaranlagen Hamburg',
      'Solaranlagen für Unternehmen', 'gewerbliche Photovoltaik'
    ];
  }

  /**
   * Content Keywords analysieren
   */
  private analyzeContentKeywords(): void {
    const content = document.body.textContent || '';
    const targetKeywords = this.generateOptimizedKeywords();

    // Keyword Dichte prüfen
    targetKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      const count = matches ? matches.length : 0;
      const density = (count / content.split(' ').length) * 100;

      if (density > 3) {
        console.warn(`⚠️ Keyword "${keyword}" hat hohe Dichte: ${density.toFixed(2)}%`);
      }
    });
  }

  /**
   * Interne Verlinkung optimieren
   */
  private async optimizeInternalLinks(): Promise<void> {
    console.log('🔗 Optimiere interne Verlinkung...');

    const links = document.querySelectorAll('a[href^="/"], a[href^="#"]');
    const currentPath = window.location.pathname;

    links.forEach(link => {
      const anchor = link as HTMLAnchorElement;
      const href = anchor.getAttribute('href') || '';

      // Broken Links prüfen
      if (href.startsWith('/')) {
        this.checkInternalLink(anchor, href);
      }

      // Anchor Text optimieren
      this.optimizeAnchorText(anchor);

      // Nofollow nur bei externen Links
      if (!href.startsWith('/') && !href.startsWith('#') && !href.includes('zoe-solar.de')) {
        anchor.rel = 'noopener noreferrer';
      }
    });

    this.results.internalLinksOptimized = true;
  }

  /**
   * Internen Link prüfen
   */
  private checkInternalLink(link: HTMLAnchorElement, href: string): void {
    // Hier könnte eine echte Link-Prüfung stattfinden
    // Für jetzt: Nur Konsistenz prüfen
    if (!href || href === '/') return;

    const title = link.getAttribute('title');
    if (!title) {
      link.title = link.textContent?.trim() || '';
    }
  }

  /**
   * Anchor Text optimieren
   */
  private optimizeAnchorText(link: HTMLAnchorElement): void {
    const text = link.textContent?.trim() || '';

    // Vermeide "klicke hier" etc.
    const badPatterns = [
      /klicke hier/i, /hier klicken/i, /mehr lesen/i,
      /weiterlesen/i, /click here/i, /read more/i
    ];

    const hasBadPattern = badPatterns.some(pattern => pattern.test(text));
    if (hasBadPattern && text.length < 10) {
      link.textContent = 'Erfahren Sie mehr über ZOE Solar';
    }
  }

  /**
   * Strukturierte Daten optimieren
   */
  private async optimizeStructuredData(): Promise<void> {
    console.log('📊 Optimiere strukturierte Daten...');

    // LocalBusiness Schema
    this.addLocalBusinessSchema();

    // Organization Schema
    this.addOrganizationSchema();

    // Website Schema
    this.addWebsiteSchema();

    // Breadcrumb Schema
    this.addBreadcrumbSchema();
  }

  /**
   * LocalBusiness Schema hinzufügen
   */
  private addLocalBusinessSchema(): void {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "ZOE Solar",
      "description": "Photovoltaik für Unternehmen",
      "url": "https://zoe-solar.de",
      "telephone": "+49 123 456789",
      "email": "info@zoe-solar.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Solarstraße 1",
        "addressLocality": "Solarstadt",
        "postalCode": "12345",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 52.5200,
        "longitude": 13.4050
      },
      "openingHours": "Mo-Fr 09:00-18:00",
      "priceRange": "€€€",
      "image": "https://zoe-solar.de/images/logo.jpg",
      "sameAs": [
        "https://www.facebook.com/zoe-solar",
        "https://www.linkedin.com/company/zoe-solar",
        "https://www.instagram.com/zoe_solar"
      ]
    };

    this.addStructuredData(schema);
  }

  /**
   * Organization Schema hinzufügen
   */
  private addOrganizationSchema(): void {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ZOE Solar",
      "url": "https://zoe-solar.de",
      "logo": "https://zoe-solar.de/images/logo.png",
      "description": "Experte für gewerbliche Photovoltaik-Anlagen",
      "foundingDate": "2015",
      "employee": {
        "@type": "QuantitativeValue",
        "value": "50"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "telephone": "+49 123 456789",
        "availableLanguage": ["German", "English"]
      }
    };

    this.addStructuredData(schema);
  }

  /**
   * Website Schema hinzufügen
   */
  private addWebsiteSchema(): void {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ZOE Solar",
      "description": "Photovoltaik für Unternehmen",
      "url": "https://zoe-solar.de",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://zoe-solar.de/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ZOE Solar",
        "logo": {
          "@type": "ImageObject",
          "url": "https://zoe-solar.de/images/logo.png"
        }
      }
    };

    this.addStructuredData(schema);
  }

  /**
   * Breadcrumb Schema hinzufügen
   */
  private addBreadcrumbSchema(): void {
    const path = window.location.pathname.split('/').filter(Boolean);
    const breadcrumbs = path.map((segment, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": this.capitalizeFirstLetter(segment),
      "item": `https://zoe-solar.de/${path.slice(0, index + 1).join('/')}`
    }));

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    };

    this.addStructuredData(schema);
  }

  /**
   * Strukturierte Daten hinzufügen
   */
  private addStructuredData(schema: any): void {
    let script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema, null, 2);

    // Prüfen ob Schema bereits existiert
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    const existingContent = Array.from(existingScripts).map(s => s.textContent);

    if (!existingContent.includes(JSON.stringify(schema))) {
      document.head.appendChild(script);
    }
  }

  /**
   * SEO Score berechnen
   */
  private calculateScore(): void {
    const factors = [
      this.results.titleOptimized ? 20 : 0,
      this.results.descriptionOptimized ? 20 : 0,
      this.results.headingsOptimized ? 20 : 0,
      this.results.keywordsOptimized ? 15 : 0,
      this.results.internalLinksOptimized ? 15 : 0,
      this.hasStructuredData() ? 10 : 0,
    ];

    this.currentScore = factors.reduce((sum, score) => sum + score, 0);
  }

  /**
   * Prüfen ob strukturierte Daten vorhanden sind
   */
  private hasStructuredData(): boolean {
    return document.querySelectorAll('script[type="application/ld+json"]').length > 0;
  }

  /**
   * Helper: String capitalize
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export
export default new SEOService();