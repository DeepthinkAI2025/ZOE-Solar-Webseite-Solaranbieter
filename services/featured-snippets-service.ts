/**
 * Featured Snippets Service für ZOE Solar
 *
 * Optimiert Inhalte für Featured Snippets und Zero-Click-Suchen
 * Implementiert FAQ Schema und strukturierte Daten für Snippets
 */

export interface FeaturedSnippet {
  type: 'paragraph' | 'list' | 'table' | 'video' | 'faq' | 'how-to';
  query: string;
  content: string;
  format: string;
  targetKeywords: string[];
  position: number;
  clickThroughRate: number;
}

export interface FAQSchema {
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  searchVolume: number;
  featuredSnippetPotential: number;
}

export interface SnippetOptimization {
  headline: string;
  summary: string;
  structuredData: any;
  markup: string;
  recommendations: string[];
}

class FeaturedSnippetsService {
  private snippetDatabase: Map<string, FeaturedSnippet> = new Map();
  private faqDatabase: Map<string, FAQSchema> = new Map();
  private optimizationStrategies: Map<string, Function> = new Map();

  /**
   * Initialisiert den Featured Snippets Service
   */
  async initialize(): Promise<void> {
    console.log('📱 Initialisiere Featured Snippets Service...');

    // FAQ-Datenbank aufbauen
    await this.buildFAQDatabase();

    // Snippet-Strategien definieren
    this.setupOptimizationStrategies();

    // Featured Snippets analysieren
    await this.analyzeFeaturedSnippets();

    // Content für Snippets optimieren
    await this.optimizeContentForSnippets();

    console.log('✅ Featured Snippets Service bereit');
  }

  /**
   * FAQ-Datenbank mit deutschen Solar-Keywords aufbauen
   */
  private async buildFAQDatabase(): Promise<void> {
    console.log('❓ Baue FAQ-Datenbank auf...');

    const highPotentialFAQs: FAQSchema[] = [
      {
        question: "Was kostet eine gewerbliche Solaranlage?",
        answer: "Eine gewerbliche Solaranlage kostet typischerweise 1.000-1.500 € pro Kilowatt-Peak (kWp). Für eine 100 kWp Anlage können Sie mit Investitionskosten von etwa 100.000-150.000 € rechnen. Durch staatliche Förderungen können bis zu 30% der Kosten eingespart werden.",
        category: "Kosten",
        difficulty: "easy",
        searchVolume: 2400,
        featuredSnippetPotential: 85
      },
      {
        question: "Welche Förderungen gibt es für gewerbliche Photovoltaik 2025?",
        answer: "2025 gibt es mehrere Förderprogramme: 1) KfW-Kredite mit Zinsen ab 1,23% für Solaranlagen, 2) BAFA-Zuschüsse bis zu 3.300 € für Stromspeicher, 3) Regionale Förderprogramme je nach Bundesland, 4) Steuerliche Vorteile wie 20% Abschreibung.",
        category: "Förderung",
        difficulty: "medium",
        searchVolume: 1800,
        featuredSnippetPotential: 92
      },
      {
        question: "Wie hoch ist die Rendite bei Solaranlagen für Unternehmen?",
        answer: "Die Rendite bei gewerblichen Solaranlagen liegt typischerweise bei 8-15% pro Jahr. Die Amortisationszeit beträgt meist 8-12 Jahre. Faktoren wie Standort, Strompreis und Eigenverbrauchsquote beeinflussen die Rendite.",
        category: "Rendite",
        difficulty: "medium",
        searchVolume: 1600,
        featuredSnippetPotential: 78
      },
      {
        question: "Welche Genehmigungen werden für Solaranlagen benötigt?",
        answer: "Für Solaranlagen unter 100 kWp ist meist nur eine Bauanmeldung erforderlich. Über 100 kWp kann ein vollständiges Baugenehmigungsverfahren nötig sein. Denkmalschutz und Naturschutzgebiete erfordern zusätzliche Genehmigungen.",
        category: "Genehmigung",
        difficulty: "medium",
        searchVolume: 1200,
        featuredSnippetPotential: 88
      },
      {
        question: "Wie lange dauert die Installation einer Solaranlage?",
        answer: "Die Installation einer gewerblichen Solaranlage dauert 1-5 Tage je nach Größe. Die gesamte Projektdauer von Erstkontakt bis Inbetriebnahme beträgt meist 8-12 Wochen: 2-4 Wochen Planung, 4-6 Wochen Genehmigung, 1-5 Tage Installation.",
        category: "Zeitraum",
        difficulty: "easy",
        searchVolume: 900,
        featuredSnippetPotential: 75
      },
      {
        question: "Wie groß muss eine Solaranlage für ein Unternehmen sein?",
        answer: "Die Größe einer Solaranlage hängt vom jährlichen Stromverbrauch ab: Kleinunternehmen: 10-50 kWp (ca. 1.500-7.500 €/Jahr Ersparnis), Mittelständler: 50-500 kWp (7.500-75.000 €/Jahr), Industrie: 500+ kWp (75.000+ €/Jahr).",
        category: "Planung",
        difficulty: "medium",
        searchVolume: 1100,
        featuredSnippetPotential: 82
      },
      {
        question: "Ist mein Dach für eine Solaranlage geeignet?",
        answer: "Ein Dach ist für Solaranlagen geeignet wenn: 1) Tragfähigkeit mindestens 50-70 kg/m², 2) Ausrichtung Süd, Süd-Ost oder Süd-West, 3) Neigung 30-35° optimal, 4) Verschattung unter 10%, 5) Fläche mindestens 30 m². Auch Ost-West-Dächer können rentabel sein.",
        category: "Voraussetzungen",
        difficulty: "easy",
        searchVolume: 1400,
        featuredSnippetPotential: 90
      },
      {
        question: "Welche Vorteile bietet ein Stromspeicher für Unternehmen?",
        answer: "Stromspeicher bieten Unternehmen folgende Vorteile: 1) Eigenverbrauch erhöhen von 30% auf 70-80%, 2) Unabhängigkeit vom Stromnetz, 3) Notstromversorgung bei Ausfällen, 4) Bessere Nutzung des Solarstroms, 5) Zusätzliche Einnahmen durch Stromhandel.",
        category: "Speicher",
        difficulty: "medium",
        searchVolume: 800,
        featuredSnippetPotential: 77
      },
      {
        question: "Wie viel Strom erzeugt eine 100 kWp Solaranlage?",
        answer: "Eine 100 kWp Solaranlage in Deutschland erzeugt jährlich etwa 90.000-100.000 kWh Strom. Das entspricht dem Verbrauch von ca. 25-30 Haushalten oder einem mittelständischen Unternehmen. Die tatsächliche Erzeugung hängt vom Standort ab.",
        category: "Ertrag",
        difficulty: "easy",
        searchVolume: 1000,
        featuredSnippetPotential: 85
      },
      {
        question: "Wie funktioniert die Einspeisevergütung für Unternehmen?",
        answer: "Unternehmen können Solarstrom einspeisen und erhalten: 1) Einspeisevergütung nach EEG (2025: ca. 8,1 ct/kWh), 2) Steuerliche Vorteile, 3) Möglichkeit der Direktvermarktung, 4) Kombination mit Eigenverbrauch oft am rentabelsten.",
        category: "Einspeisung",
        difficulty: "hard",
        searchVolume: 700,
        featuredSnippetPotential: 80
      }
    ];

    // FAQs in Datenbank speichern
    highPotentialFAQs.forEach((faq, index) => {
      this.faqDatabase.set(`faq_${index}`, faq);
    });

    console.log(`✅ ${highPotentialFAQs.length} hoch-potente FAQs erstellt`);
  }

  /**
   * Optimierungsstrategien für verschiedene Snippet-Typen
   */
  private setupOptimizationStrategies(): void {
    console.log('🎯 Definiere Snippet-Optimierungsstrategien...');

    // Paragraph Snippets
    this.optimizationStrategies.set('paragraph', (content: string) => {
      return {
        optimized: content.substring(0, 250) + '...',
        wordCount: content.split(' ').length,
        sentences: content.split('.').length,
        recommendations: this.generateParagraphRecommendations(content)
      };
    });

    // List Snippets
    this.optimizationStrategies.set('list', (items: string[]) => {
      return {
        optimized: items.slice(0, 8), // Google zeigt meist 8 Items
        itemCount: items.length,
        formatting: 'ordered_list',
        recommendations: this.generateListRecommendations(items)
      };
    });

    // Table Snippets
    this.optimizationStrategies.set('table', (data: any[]) => {
      return {
        optimized: data.slice(0, 5), // Max 5 Zeilen für Snippets
        columnCount: Object.keys(data[0] || {}).length,
        formatting: 'responsive_table',
        recommendations: this.generateTableRecommendations(data)
      };
    });

    // FAQ Snippets
    this.optimizationStrategies.set('faq', (faqs: FAQSchema[]) => {
      return {
        optimized: faqs.slice(0, 4), // Max 4 FAQs
        totalCount: faqs.length,
        schema: this.generateFAQSchema(faqs),
        recommendations: this.generateFAQRecommendations(faqs)
      };
    });

    console.log('✅ Snippet-Optimierungsstrategien definiert');
  }

  /**
   * Analysiert bestehende Featured Snippets
   */
  private async analyzeFeaturedSnippets(): Promise<void> {
    console.log('🔍 Analysiere Featured Snippets...');

    const targetKeywords = [
      'gewerbliche solaranlagen kosten',
      'photovoltaik förderung unternehmen',
      'solaranlage rendite berechnen',
      'genehmigung solaranlage gewerbe',
      'solaranlage dachvoraussetzungen'
    ];

    targetKeywords.forEach(keyword => {
      const snippet: FeaturedSnippet = {
        type: this.detectSnippetType(keyword),
        query: keyword,
        content: this.generateSnippetContent(keyword),
        format: this.optimizeFormat(keyword),
        targetKeywords: this.extractKeywords(keyword),
        position: Math.floor(Math.random() * 3) + 1, // Simulierte Position
        clickThroughRate: Math.random() * 20 + 10 // 10-30% CTR
      };

      this.snippetDatabase.set(keyword, snippet);
    });

    console.log(`✅ ${targetKeywords.length} Featured Snippets analysiert`);
  }

  /**
   * Snippet-Typ erkennen
   */
  private detectSnippetType(keyword: string): FeaturedSnippet['type'] {
    if (keyword.includes('kosten') || keyword.includes('preis')) {
      return 'paragraph';
    }
    if (keyword.includes('vorteile') || keyword.includes('liste')) {
      return 'list';
    }
    if (keyword.includes('vergleich') || keyword.includes('tabelle')) {
      return 'table';
    }
    if (keyword.includes('wie') || keyword.includes('was')) {
      return 'faq';
    }
    if (keyword.includes('schritt') || keyword.includes('anleitung')) {
      return 'how-to';
    }
    return 'paragraph';
  }

  /**
   * Snippet-Content generieren
   */
  private generateSnippetContent(keyword: string): string {
    const contentMap: Record<string, string> = {
      'gewerbliche solaranlagen kosten': 'Eine gewerbliche Solaranlage kostet 1.000-1.500 € pro kWp. Bei 100 kWp sind das 100.000-150.000 €. Förderungen können bis zu 30% sparen.',
      'photovoltaik förderung unternehmen': 'Unternehmen erhalten KfW-Kredite (ab 1,23% Zins), BAFA-Speicherzuschüsse (bis 3.300 €) und regionale Förderungen. ZOE Solar hilft bei der Beantragung.',
      'solaranlage rendite berechnen': 'Gewerbliche Solaranlagen bringen 8-15% Rendite jährlich. Amortisation nach 8-12 Jahren. Faktoren: Standort, Strompreis, Eigenverbrauch.',
      'genehmigung solaranlage gewerbe': 'Unter 100 kWp: Bauanmeldung genügt. Über 100 kWp: Vollständige Genehmigung. Dauer: 4-8 Wochen. ZOE Solar übernimmt Abwicklung.',
      'solaranlage dachvoraussetzungen': 'Dachtragfähigkeit: 50-70 kg/m². Ausrichtung: Süd-Ost bis Süd-West. Neigung: 30-35° optimal. Verschattung: unter 10%. Mindestfläche: 30 m².'
    };

    return contentMap[keyword] || 'Professionelle Solarlösungen für Unternehmen von ZOE Solar.';
  }

  /**
   * Format optimieren
   */
  private optimizeFormat(keyword: string): string {
    // Bestes Format für Keyword basierend auf User Intent
    if (keyword.includes('liste') || keyword.includes('vorteile')) {
      return 'bullet_points';
    }
    if (keyword.includes('schritte') || keyword.includes('anleitung')) {
      return 'numbered_list';
    }
    if (keyword.includes('kosten') || keyword.includes('preis')) {
      return 'short_paragraph';
    }
    return 'structured_content';
  }

  /**
   * Keywords extrahieren
   */
  private extractKeywords(keyword: string): string[] {
    const baseKeywords = ['solaranlagen', 'photovoltaik', 'unternehmen', 'gewerbe'];
    const specificKeywords = keyword.split(' ');
    return [...baseKeywords, ...specificKeywords];
  }

  /**
   * Content für Featured Snippets optimieren
   */
  private async optimizeContentForSnippets(): Promise<void> {
    console.log('⚡ Optimiere Content für Featured Snippets...');

    // FAQ-Seite optimieren
    await this.optimizeFAQPage();

    // Service-Seiten optimieren
    await this.optimizeServicePages();

    // Landing Pages optimieren
    await this.optimizeLandingPages();

    console.log('✅ Content für Featured Snippets optimiert');
  }

  /**
   * FAQ-Seite optimieren
   */
  private async optimizeFAQPage(): Promise<void> {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: Array.from(this.faqDatabase.values()).map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    // In einer echten Anwendung würde dies in die Seite integriert
    console.log('📄 FAQ-Schema für Featured Snippets optimiert');
  }

  /**
   * Service-Seiten optimieren
   */
  private async optimizeServicePages(): Promise<void> {
    const servicePages = [
      {
        url: '/solaranlagen-fuer-unternehmen',
        title: 'Solaranlagen für Unternehmen',
        snippetType: 'paragraph',
        targetQuery: 'gewerbliche solaranlagen kosten'
      },
      {
        url: '/photovoltaik-beratung',
        title: 'Photovoltaik Beratung',
        snippetType: 'list',
        targetQuery: 'vorteile photovoltaik beratung'
      }
    ];

    servicePages.forEach(page => {
      const optimization = this.optimizePageForSnippet(page);
      console.log(`🔧 Service-Seite optimiert: ${page.title}`);
    });
  }

  /**
   * Landing Pages optimieren
   */
  private async optimizeLandingPages(): Promise<void> {
    // Location-Specific Landing Pages für Local Snippets
    const locations = ['Berlin', 'München', 'Hamburg'];

    locations.forEach(city => {
      const localSnippet = {
        type: 'paragraph',
        query: `solaranlagen ${city.toLowerCase()} kosten`,
        content: `Solaranlagen in ${city} kosten 1.000-1.500 €/kWp. ZOE Solar ${city} bietet kostenlose Beratung und Planung. Förderung bis zu 30% möglich.`,
        format: 'local_business',
        targetKeywords: [`solaranlagen ${city}`, `photovoltaik ${city}`, `solarfirma ${city}`],
        position: 1,
        clickThroughRate: 25
      };

      this.snippetDatabase.set(`local_${city}`, localSnippet);
    });

    console.log('🏢 Local Landing Pages für Featured Snippets optimiert');
  }

  /**
   * Seite für spezifisches Snippet optimieren
   */
  private optimizePageForSnippet(page: any): SnippetOptimization {
    const snippet = this.snippetDatabase.get(page.targetQuery);
    if (!snippet) {
      throw new Error(`Kein Snippet gefunden für: ${page.targetQuery}`);
    }

    const headline = this.generateSnippetHeadline(snippet);
    const summary = this.generateSnippetSummary(snippet);
    const structuredData = this.generateSnippetStructuredData(snippet);
    const markup = this.generateSnippetMarkup(snippet);
    const recommendations = this.generateSnippetRecommendations(snippet);

    return {
      headline,
      summary,
      structuredData,
      markup,
      recommendations
    };
  }

  /**
   * Snippet-Headline generieren
   */
  private generateSnippetHeadline(snippet: FeaturedSnippet): string {
    const templates = {
      paragraph: "{query}: Alles Wissenswerte in Kürze",
      list: "{query}: Die wichtigsten Punkte im Überblick",
      table: "{query}: Vergleich der wichtigsten Faktoren",
      faq: "{query}: Häufige Fragen beantwortet",
      'how-to': "{query}: Schritt-für-Schritt Anleitung"
    };

    const template = templates[snippet.type] || templates.paragraph;
    return template.replace('{query}', snippet.query);
  }

  /**
   * Snippet-Summary generieren
   */
  private generateSnippetSummary(snippet: FeaturedSnippet): string {
    // Optimierte Länge für Featured Snippets (40-60 Wörter)
    const words = snippet.content.split(' ');
    const optimizedWords = words.slice(0, 50).join(' ');

    if (words.length > 50) {
      return optimizedWords + '...';
    }

    return optimizedWords;
  }

  /**
   * Strukturierte Daten für Snippet generieren
   */
  private generateSnippetStructuredData(snippet: FeaturedSnippet): any {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': this.getSchemaType(snippet.type),
      name: snippet.query,
      description: snippet.content,
      text: snippet.content
    };

    // Spezifische Schema-Ergänzungen
    if (snippet.type === 'faq') {
      baseSchema.mainEntity = [{
        '@type': 'Question',
        name: snippet.query,
        acceptedAnswer: {
          '@type': 'Answer',
          text: snippet.content
        }
      }];
    }

    if (snippet.type === 'how-to') {
      baseSchema.step = this.extractSteps(snippet.content);
    }

    return baseSchema;
  }

  /**
   * Schema-Typ für Snippet-Typ
   */
  private getSchemaType(snippetType: string): string {
    const schemaTypes = {
      paragraph: 'Article',
      list: 'ItemList',
      table: 'Table',
      faq: 'FAQPage',
      'how-to': 'HowTo',
      video: 'VideoObject'
    };

    return schemaTypes[snippetType as keyof typeof schemaTypes] || 'Article';
  }

  /**
   * Schritte aus How-To Content extrahieren
   */
  private extractSteps(content: string): any[] {
    // Simulierte Schritt-Extraktion
    const steps = content.split('.').filter(sentence =>
      sentence.trim().length > 0 &&
      (sentence.includes(1) || sentence.includes(' Schritt') || sentence.includes('Zuerst'))
    );

    return steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Schritt ${index + 1}`,
      text: step.trim()
    }));
  }

  /**
   * HTML-Markup für Snippet generieren
   */
  private generateSnippetMarkup(snippet: FeaturedSnippet): string {
    const markups = {
      paragraph: `<p class="snippet-paragraph">${snippet.content}</p>`,
      list: `<ol class="snippet-list"><li>${snippet.content.split(', ').join('</li><li>')}</li></ol>`,
      table: `<table class="snippet-table"><tr><td>${snippet.content}</td></tr></table>`,
      faq: `<div class="snippet-faq"><details><summary>${snippet.query}</summary><p>${snippet.content}</p></details></div>`,
      'how-to': `<div class="snippet-howto"><ol>${snippet.content.split('.').map(s => `<li>${s.trim()}</li>`).join('')}</ol></div>`
    };

    return markups[snippet.type] || markups.paragraph;
  }

  /**
   * Snippet-Empfehlungen generieren
   */
  private generateSnippetRecommendations(snippet: FeaturedSnippet): string[] {
    const recommendations = [
      'Antwort direkt zu Beginn der Seite platzieren',
      '40-60 Wörter für optimale Featured Snippets',
      'Zahlen und Fakten für höhere CTR',
      'Strukturierte Daten korrekt implementieren',
      'Klare, präzise Antworten formulieren'
    ];

    if (snippet.type === 'list') {
      recommendations.push('Maximal 8 List-Items für Google');
      recommendations.push('Bullets oder Nummerierung verwenden');
    }

    if (snippet.type === 'faq') {
      recommendations.push('FAQ Schema implementieren');
      recommendations.push('Maximal 4 FAQs pro Seite');
    }

    return recommendations;
  }

  // Helper Methods für verschiedene Content-Typen
  private generateParagraphRecommendations(content: string): string[] {
    const wordCount = content.split(' ').length;
    const recommendations = [];

    if (wordCount < 40) {
      recommendations.push('Text zu kurz - mindestens 40 Wörter für Featured Snippets');
    }
    if (wordCount > 60) {
      recommendations.push('Text zu lang - maximal 60 Wörter für Featured Snippets');
    }

    recommendations.push('Zahl am Anfang der Antwort für höhere CTR');
    recommendations.push('Klare, präzise Antwort ohne Marketing-Sprache');

    return recommendations;
  }

  private generateListRecommendations(items: string[]): string[] {
    const recommendations = [];

    if (items.length > 8) {
      recommendations.push('Zu viele List-Items - maximal 8 für Featured Snippets');
    }

    recommendations.push('Nummerierung für Prozess-Schritte');
    recommendations.push('Bullets für Vorteils-Listen');
    recommendations.push('Konsistente Formatierung');

    return recommendations;
  }

  private generateTableRecommendations(data: any[]): string[] {
    const recommendations = [];

    if (data.length > 5) {
      recommendations.push('Zu viele Tabellenzeilen - maximal 5 für Featured Snippets');
    }

    recommendations.push('Klare Spalten-Überschriften');
    recommendations.push('Responsive Design für Mobile');
    recommendations.push('Wichtige Daten in ersten Zeilen');

    return recommendations;
  }

  private generateFAQSchema(faqs: FAQSchema[]): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  private generateFAQRecommendations(faqs: FAQSchema[]): string[] {
    const recommendations = [
      'FAQ Schema für strukturierte Daten',
      'Maximal 4 FAQs pro Featured Snippet',
      'Klare Fragen ohne Marketing-Begriffe',
      'Präzise Antworten (40-60 Wörter)',
      'Relevante Fragen für Zielgruppe'
    ];

    const highPotential = faqs.filter(faq => faq.featuredSnippetPotential > 80);
    if (highPotential.length > 0) {
      recommendations.push(`${highPotential.length} FAQs mit hohem Featured Snippet Potenzial identifiziert`);
    }

    return recommendations;
  }

  /**
   * Featured Snippet Performance analysieren
   */
  analyzeSnippetPerformance(): {
    totalSnippets: number;
    averagePosition: number;
    averageCTR: number;
    topPerformers: Array<{query: string, position: number, ctr: number}>;
    optimizationPotential: number;
  } {
    const snippets = Array.from(this.snippetDatabase.values());

    if (snippets.length === 0) {
      return {
        totalSnippets: 0,
        averagePosition: 0,
        averageCTR: 0,
        topPerformers: [],
        optimizationPotential: 0
      };
    }

    const totalSnippets = snippets.length;
    const averagePosition = snippets.reduce((sum, s) => sum + s.position, 0) / totalSnippets;
    const averageCTR = snippets.reduce((sum, s) => sum + s.clickThroughRate, 0) / totalSnippets;

    const topPerformers = snippets
      .sort((a, b) => b.clickThroughRate - a.clickThroughRate)
      .slice(0, 5)
      .map(s => ({
        query: s.query,
        position: s.position,
        ctr: s.clickThroughRate
      }));

    const optimizationPotential = snippets.filter(s => s.position > 3).length / totalSnippets * 100;

    return {
      totalSnippets,
      averagePosition: Math.round(averagePosition * 10) / 10,
      averageCTR: Math.round(averageCTR * 10) / 10,
      topPerformers,
      optimizationPotential: Math.round(optimizationPotential)
    };
  }

  /**
   * Content für spezifische Featured Snippets generieren
   */
  generateFeaturedSnippetContent(query: string): FeaturedSnippet | null {
    // Zuerst in Datenbank suchen
    let snippet = this.snippetDatabase.get(query);

    if (!snippet) {
      // Falls nicht gefunden, basierend auf FAQ-Datenbank generieren
      const faq = Array.from(this.faqDatabase.values()).find(f =>
        f.question.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(f.question.toLowerCase().split(' ')[0])
      );

      if (faq) {
        snippet = {
          type: 'faq',
          query,
          content: faq.answer,
          format: 'structured_content',
          targetKeywords: this.extractKeywords(query),
          position: 0,
          clickThroughRate: 0
        };
      }
    }

    return snippet || null;
  }
}

// Export als Singleton
export const featuredSnippetsService = new FeaturedSnippetsService();
export default featuredSnippetsService;