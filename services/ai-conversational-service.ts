/**
 * AI Conversational Service für ZOE Solar
 *
 * Optimiert Content für KI-Suchmaschinen und Chatbots
 * Conversational Content für natürliche Suchanfragen
 */

import { germanSEOConfig } from '../config/seo-performance-config';

export interface ConversationalQuery {
  query: string;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  entities: string[];
  context: string;
  confidence: number;
}

export interface ConversationalResponse {
  answer: string;
  followUpQuestions: string[];
  relatedTopics: string[];
  sources: string[];
  structuredData: any;
}

export interface VoiceOptimization {
  speakable: boolean;
  naturalLanguage: boolean;
  shortAnswers: boolean;
  stepByStep: boolean;
  pronunciation: string[];
}

class AIConversationalService {
  private conversationHistory: Map<string, ConversationalQuery[]> = new Map();
  private entityDatabase: Map<string, any> = new Map();
  private queryPatterns: Map<string, RegExp[]> = new Map();

  /**
   * Initialisiert den KI-Conversational Service
   */
  async initialize(): Promise<void> {
    console.log('🤖 Initialisiere AI Conversational Service...');

    // Entity-Datenbank aufbauen
    await this.buildEntityDatabase();

    // Query-Patterns definieren
    this.setupQueryPatterns();

    // Conversational Content vorbereiten
    await this.prepareConversationalContent();

    // Voice Search Optimization
    await this.optimizeForVoiceSearch();

    console.log('✅ AI Conversational Service bereit');
  }

  /**
   * Entity-Datenbank für KI-Verständnis aufbauen
   */
  private async buildEntityDatabase(): Promise<void> {
    console.log('📚 Baue Entity-Datenbank auf...');

    // Unternehmen Entity
    this.entityDatabase.set('ZOE Solar GmbH', {
      type: 'Organization',
      properties: {
        name: 'ZOE Solar GmbH',
        industry: 'Solar Energy',
        founded: '2015',
        headquarters: 'Berlin',
        services: ['Solaranlagen', 'Photovoltaik', 'Solarberatung', 'Wartung'],
        locations: ['Berlin', 'München', 'Hamburg'],
        expertise: ['Gewerbliche Photovoltaik', 'Solaranlagen für Unternehmen'],
        contact: {
          phone: '+49 30 12345678',
          email: 'info@zoe-solar.de',
          website: 'https://zoe-solar.de'
        },
        certifications: ['TÜV-zertifiziert', 'Solarqualität'],
        awards: ['Deutscher Solarpreis 2022']
      }
    });

    // Service Entities
    this.entityDatabase.set('Gewerbliche Solaranlagen', {
      type: 'Service',
      properties: {
        name: 'Gewerbliche Solaranlagen',
        description: 'Photovoltaik-Anlagen für Unternehmen und Gewerbe',
        targetAudience: ['Unternehmen', 'Kleinbetriebe', 'Landwirtschaft', 'Industrie'],
        benefits: ['Kosteneinsparung', 'Nachhaltigkeit', 'Unabhängigkeit', 'Rendite'],
        process: ['Beratung', 'Planung', 'Installation', 'Wartung'],
        typicalSize: '10-1000 kWp',
        costs: '1.000-1.500 €/kWp',
        roi: '8-15% jährlich',
        warranty: '25 Jahre'
      }
    });

    this.entityDatabase.set('Photovoltaik Beratung', {
      type: 'Service',
      properties: {
        name: 'Photovoltaik Beratung',
        description: 'Professionelle Beratung für Solaranlagen',
        services: ['Standortanalyse', 'Wirtschaftlichkeitsberechnung', 'Fördermittel-Check', 'Technische Planung'],
        duration: '1-2 Stunden',
        cost: 'Kostenlos',
        outcome: 'Individuelles Angebot und Empfehlungen'
      }
    });

    // Location Entities
    const locations = ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt'];
    locations.forEach(city => {
      this.entityDatabase.set(`ZOE Solar ${city}`, {
        type: 'LocalBusiness',
        properties: {
          name: `ZOE Solar ${city}`,
          address: `${city} Innenstadt`,
          serviceArea: `${city} und 100km Umkreis`,
          teamSize: '5-10 Mitarbeiter',
          projects: '50-200 projekte',
          specialties: ['Gewerbliche Anlagen', 'Solarberatung', 'Wartung']
        }
      });
    });

    // Product Entities
    this.entityDatabase.set('Solarstromspeicher', {
      type: 'Product',
      properties: {
        name: 'Solarstromspeicher',
        description: 'Batteriespeicher für Solaranlagen',
        benefits: ['Eigenverbrauch erhöhen', 'Unabhängigkeit vom Netz', 'Notstromversorgung'],
        capacity: '5-100 kWh',
        costs: '800-1.200 €/kWh',
        warranty: '10-15 Jahre',
        manufacturers: ['Tesla', 'Sonnen', 'BYD', 'LG Chem']
      }
    });

    console.log(`✅ ${this.entityDatabase.size} Entities definiert`);
  }

  /**
   * Query-Patterns für verschiedene Suchintentionen
   */
  private setupQueryPatterns(): void {
    console.log('🔍 Definiere Query-Patterns...');

    // Informationale Patterns
    this.queryPatterns.set('informational', [
      /was ist/i,
      /wie funktioniert/i,
      /was kostet/i,
      /welche vorteile/i,
      /erklärung/i,
      /definition/i,
      /vergleich/i,
      /unterschied/i,
      /beispiel/i
    ]);

    // Commerciale Patterns
    this.queryPatterns.set('commercial', [
      /beste/i,
      /preis/i,
      /kosten/i,
      /günstig/i,
      /angebot/i,
      /empfehlung/i,
      /test/i,
      /erfahrung/i,
      /bewertung/i
    ]);

    // Transactionale Patterns
    this.queryPatterns.set('transactional', [
      /kaufen/i,
      /bestellen/i,
      /anfragen/i,
      /kontakt/i,
      /beratung/i,
      /angebot anfordern/i,
      /jetzt/i,
      /sofort/i,
      /buchen/i
    ]);

    // Navigationale Patterns
    this.queryPatterns.set('navigational', [
      /zoe solar/i,
      /website/i,
      /telefon/i,
      /adresse/i,
      /standort/i,
      /kontakt/i,
      /öffnungszeiten/i
    ]);

    // Location-Patterns
    this.queryPatterns.set('location', [
      /berlin/i,
      /münchen/i,
      /hamburg/i,
      /köln/i,
      /frankfurt/i,
      /in meiner nähe/i,
      /bei mir/i
    ]);

    console.log('✅ Query-Patterns definiert');
  }

  /**
   * Conversational Content vorbereiten
   */
  private async prepareConversationalContent(): Promise<void> {
    console.log('💬 Bereite Conversational Content vor...');

    // FAQ für natürliche Sprache optimieren
    const conversationalFAQs = [
      {
        question: "Was ist eine gewerbliche Solaranlage?",
        conversational: [
          "Eine gewerbliche Solaranlage ist eine Photovoltaik-Anlage, die speziell für Unternehmen und Gewerbebetriebe konzipiert ist.",
          "Anders als private Anlagen sind sie typischerweise größer und auf die Bedürfnisse von Unternehmen zugeschnitten.",
          "Mit einer gewerblichen Solaranlage können Sie Ihren eigenen Strom erzeugen und damit Ihre Energiekosten deutlich senken."
        ]
      },
      {
        question: "Wie viel kostet eine Solaranlage für mein Unternehmen?",
        conversational: [
          "Die Kosten für eine gewerbliche Solaranlage liegen typischerweise bei 1.000 bis 1.500 Euro pro Kilowatt-Peak.",
          "Für eine 100 kWp Anlage können Sie also mit Investitionskosten von etwa 100.000 bis 150.000 Euro rechnen.",
          "Durch staatliche Förderungen können Sie bis zu 30% der Kosten einsparen."
        ]
      },
      {
        question: "Lohnt sich eine Solaranlage für Unternehmen?",
        conversational: [
          "Ja, eine Solaranlage lohnt sich für die meisten Unternehmen sehr gut.",
          "Sie können jährliche Renditen von 8-15% erwarten und die Amortisationszeit beträgt meist nur 8-12 Jahre.",
          "Zusätzlich sparen Sie bis zu 70% Ihrer Stromkosten und machen sich unabhängig von steigenden Energiepreisen."
        ]
      }
    ];

    // Conversational Content speichern
    this.storeConversationalContent(conversationalFAQs);

    console.log('✅ Conversational Content vorbereitet');
  }

  /**
   * Voice Search Optimization
   */
  private async optimizeForVoiceSearch(): Promise<void> {
    console.log('🎤 Optimiere für Voice Search...');

    const voiceOptimizations = [
      {
        query: "Hey Google, finde einen Solaranlagen Installateur in Berlin",
        answer: "ZOE Solar Berlin ist Ihr Experte für gewerbliche Solaranlagen. Rufen Sie uns an unter +49 30 12345678 für eine kostenlose Beratung.",
        entities: ['ZOE Solar Berlin', 'Solaranlagen Installateur', 'Berlin']
      },
      {
        query: "Siri, was kostet eine Solaranlage für Unternehmen?",
        answer: "Eine Solaranlage für Unternehmen kostet etwa 1.000 bis 1.500 Euro pro Kilowatt-Peak. Für eine 100 Kilowatt-Anlage sind das ungefähr 100.000 bis 150.000 Euro.",
        entities: ['Solaranlagen', 'Unternehmen', 'Kosten']
      },
      {
        query: "Alexa, welche Förderungen gibt es für Solaranlagen?",
        answer: "Für Solaranlagen gibt es KfW-Kredite mit günstigen Zinsen und BAFA-Zuschüsse für Speicher. ZOE Solar hilft Ihnen bei der Beantragung aller verfügbaren Fördermittel.",
        entities: ['Förderungen', 'Solaranlagen', 'KfW', 'BAFA']
      }
    ];

    // Voice-optimierte Antworten speichern
    this.storeVoiceOptimizations(voiceOptimizations);

    console.log('✅ Voice Search Optimierung abgeschlossen');
  }

  /**
   * Analysiert Query und gibt Intent zurück
   */
  analyzeQuery(query: string): ConversationalQuery {
    const normalizedQuery = query.toLowerCase().trim();

    // Intent erkennen
    let intent: ConversationalQuery['intent'] = 'informational';
    let confidence = 0.5;

    for (const [intentType, patterns] of this.queryPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(normalizedQuery)) {
          intent = intentType as ConversationalQuery['intent'];
          confidence = 0.8;
          break;
        }
      }
    }

    // Entities extrahieren
    const entities = this.extractEntities(normalizedQuery);

    // Context bestimmen
    const context = this.determineContext(normalizedQuery, entities);

    return {
      query: normalizedQuery,
      intent,
      entities,
      context,
      confidence
    };
  }

  /**
   * Entities aus Query extrahieren
   */
  private extractEntities(query: string): string[] {
    const entities: string[] = [];

    for (const [entityName, entityData] of this.entityDatabase) {
      const lowerEntityName = entityName.toLowerCase();
      if (query.includes(lowerEntityName)) {
        entities.push(entityName);
      }

      // Prüfe Synonyme und Eigenschaften
      if (entityData.properties && entityData.properties.name) {
        const nameLower = entityData.properties.name.toLowerCase();
        if (query.includes(nameLower)) {
          entities.push(entityName);
        }
      }
    }

    // Location Entities
    const locations = ['berlin', 'münchen', 'hamburg', 'köln', 'frankfurt'];
    locations.forEach(location => {
      if (query.includes(location)) {
        entities.push(`Location: ${location}`);
      }
    });

    return entities;
  }

  /**
   * Context für Query bestimmen
   */
  private determineContext(query: string, entities: string[]): string {
    if (entities.some(e => e.includes('Kosten') || e.includes('Preis'))) {
      return 'price_inquiry';
    }

    if (entities.some(e => e.includes('Berlin') || e.includes('München'))) {
      return 'location_based';
    }

    if (query.includes('förderung') || query.includes('subvention')) {
      return 'funding_inquiry';
    }

    if (query.includes('beratung') || query.includes('kontakt')) {
      return 'service_request';
    }

    return 'general_inquiry';
  }

  /**
   * Generiert Conversational Response
   */
  generateResponse(query: ConversationalQuery): ConversationalResponse {
    const { intent, entities, context } = query;

    let answer = '';
    let followUpQuestions: string[] = [];
    let relatedTopics: string[] = [];
    let sources: string[] = [];
    let structuredData: any = {};

    // Basierend auf Intent antworten
    switch (intent) {
      case 'informational':
        answer = this.generateInformationalAnswer(entities, context);
        followUpQuestions = this.generateInformationalFollowUps(entities);
        break;

      case 'commercial':
        answer = this.generateCommercialAnswer(entities, context);
        followUpQuestions = this.generateCommercialFollowUps(entities);
        break;

      case 'transactional':
        answer = this.generateTransactionalAnswer(entities, context);
        followUpQuestions = this.generateTransactionalFollowUps(entities);
        break;

      case 'navigational':
        answer = this.generateNavigationalAnswer(entities, context);
        break;

      default:
        answer = "Ich helfe Ihnen gerne weiter mit Informationen zu Solaranlagen für Unternehmen. Was genau möchten Sie wissen?";
    }

    // Related Topics generieren
    relatedTopics = this.generateRelatedTopics(entities, context);

    // Sources hinzufügen
    sources = ['ZOE Solar Experten', 'Bundesverband Solarwirtschaft', 'KfW Bank'];

    // Strukturierte Daten für KI
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Answer',
      text: answer,
      about: entities.map(e => ({ '@type': 'Thing', name: e })),
      mentions: relatedTopics.map(t => ({ '@type': 'Thing', name: t }))
    };

    return {
      answer,
      followUpQuestions,
      relatedTopics,
      sources,
      structuredData
    };
  }

  /**
   * Informationale Antwort generieren
   */
  private generateInformationalAnswer(entities: string[], context: string): string {
    if (context === 'price_inquiry') {
      return "Eine gewerbliche Solaranlage kostet typischerweise 1.000-1.500 € pro Kilowatt-Peak. Bei staatlicher Förderung können Sie bis zu 30% einsparen. Die genauen Kosten hängen von Ihrer Anlagengröße und Standort ab.";
    }

    if (entities.some(e => e.includes('Solaranlagen'))) {
      return "Eine gewerbliche Solaranlage ist eine Photovoltaik-Anlage für Unternehmen. Sie erzeugt eigenen Strom, senkt Ihre Energiekosten und macht Sie unabhängig von Strompreiserhöhungen. Die Amortisationszeit beträgt meist 8-12 Jahre.";
    }

    if (context === 'funding_inquiry') {
      return "Für Solaranlagen gibt es verschiedene Förderungen: KfW-Kredite mit günstigen Zinsen (ab 1,23%) und BAFA-Zuschüsse für Speicher (bis 3.300 €). Wir unterstützen Sie bei der Beantragung aller verfügbaren Fördermittel.";
    }

    return "ZOE Solar ist Ihr Experte für gewerbliche Photovoltaik-Lösungen. Wir bieten Beratung, Planung, Installation und Wartung aus einer Hand.";
  }

  /**
   * Commerciale Antwort generieren
   */
  private generateCommercialAnswer(entities: string[], context: string): string {
    if (context === 'price_inquiry') {
      return "ZOE Solar bietet faire Preise für hochwertige Solaranlagen. Wir erstellen Ihnen ein individuelles Angebot mit allen Fördermöglichkeiten. Kontaktieren Sie uns für eine kostenlose Kostenschätzung.";
    }

    return "ZOE Solar gehört zu den führenden Anbietern für gewerbliche Photovoltaik in Deutschland. Wir haben über 500 erfolgreiche Projekte realisiert und erhalten exzellente Kundenbewertungen.";
  }

  /**
   * Transactionale Antwort generieren
   */
  private generateTransactionalAnswer(entities: string[], context: string): string {
    return "Ich kann Ihnen gerne eine kostenlose Beratung vermitteln. Rufen Sie ZOE Solar unter +49 30 12345678 an oder füllen Sie das Kontaktformular aus. Ein Experte meldet sich innerhalb von 24 Stunden bei Ihnen.";
  }

  /**
   * Navigationale Antwort generieren
   */
  private generateNavigationalAnswer(entities: string[], context: string): string {
    if (context === 'location_based') {
      const location = entities.find(e => e.includes('Location:'));
      if (location) {
        const city = location.split(': ')[1];
        return `ZOE Solar ${city} finden Sie in der Innenstadt. Unsere Adresse ist ${city} Innenstadt, Telefon +49 30 12345678. Wir beraten Sie gerne vor Ort.`;
      }
    }

    return "ZOE Solar hat Standorte in Berlin, München und Hamburg. Besuchen Sie uns unter zoe-solar.de oder rufen Sie uns an unter +49 30 12345678.";
  }

  /**
   * Follow-up Fragen generieren
   */
  private generateInformationalFollowUps(entities: string[]): string[] {
    return [
      "Welche Anlagengröße benötigen Sie für Ihr Unternehmen?",
      "An welchem Standort soll die Solaranlage installiert werden?",
      "Haben Sie bereits eine Schätzung Ihres jährlichen Stromverbrauchs?"
    ];
  }

  private generateCommercialFollowUps(entities: string[]): string[] {
    return [
      "Möchten Sie ein individuelles Angebot erhalten?",
      "Welche Hersteller präferieren Sie für die Solaranlage?",
      "Ist eine Finanzierung über Förderprogramme für Sie interessant?"
    ];
  }

  private generateTransactionalFollowUps(entities: string[]): string[] {
    return [
      "Wann wäre Ihnen für eine Beratung ein Termin angenehm?",
      "Sollten wir eine Standortanalyse durchführen?",
      "Haben Sie bereits Pläne oder Dokumente für das Vorhaben?"
    ];
  }

  /**
   * Related Topics generieren
   */
  private generateRelatedTopics(entities: string[], context: string): string[] {
    const topics = [
      "Solarstromspeicher",
      "Photovoltaik Wartung",
      "Solarförderung 2025",
      "Gewerbliche Strompreise",
      "CO₂-Einsparung durch Solar",
      "Solaranlagen Finanzierung",
      "Photovoltaik Versicherung"
    ];

    // Context-spezifische Topics
    if (context === 'price_inquiry') {
      return ["Solaranlagen Kosten", "Photovoltaik Rendite", "Solarförderung", ...topics.slice(0, 3)];
    }

    if (context === 'location_based') {
      return ["Lokale Solaranbieter", "Standortanalyse", "Genehmigungsverfahren", ...topics.slice(0, 3)];
    }

    return topics.slice(0, 5);
  }

  /**
   * Speichert Conversational Content
   */
  private storeConversationalContent(content: any[]): void {
    // In einer echten Anwendung würde dies in einer Datenbank gespeichert
    console.log(`💬 ${content.length} Conversational Content Items gespeichert`);
  }

  /**
   * Speichert Voice-Optimierungen
   */
  private storeVoiceOptimizations(optimizations: any[]): void {
    // In einer echten Anwendung würde dies in einer Datenbank gespeichert
    console.log(`🎤 ${optimizations.length} Voice-Optimierungen gespeichert`);
  }

  /**
   * Konversation verfolgen für Kontext
   */
  trackConversation(sessionId: string, query: ConversationalQuery): void {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }

    const history = this.conversationHistory.get(sessionId)!;
    history.push(query);

    // Nur die letzten 5 Queries behalten
    if (history.length > 5) {
      history.shift();
    }
  }

  /**
   * Kontext-basierte Antwort generieren
   */
  generateContextualResponse(sessionId: string, currentQuery: ConversationalQuery): ConversationalResponse {
    const history = this.conversationHistory.get(sessionId) || [];

    // Wenn es eine History gibt, passe die Antwort an
    if (history.length > 0) {
      const lastQuery = history[history.length - 1];

      // Wenn der Benutzer nach Details fragt
      if (currentQuery.query.includes('mehr') || currentQuery.query.includes('genauer')) {
        return this.generateDetailedResponse(lastQuery);
      }

      // Wenn der Benutzer nach Alternativen fragt
      if (currentQuery.query.includes('alternative') || currentQuery.query.includes('anderes')) {
        return this.generateAlternativeResponse(lastQuery);
      }
    }

    return this.generateResponse(currentQuery);
  }

  /**
   * Detaillierte Antwort generieren
   */
  private generateDetailedResponse(previousQuery: ConversationalQuery): ConversationalResponse {
    return {
      answer: "Gerne gebe ich Ihnen detailliertere Informationen. Bei gewerblichen Solaranlagen gibt es verschiedene technische Ausführungen, Fördermöglichkeiten und Finanzierungsmodelle. Welche Aspekte interessieren Sie besonders?",
      followUpQuestions: [
        "Technische Details zu Modulen und Wechselrichtern?",
        "Informationen zu Förderprogrammen und Zuschüssen?",
        "Details zur Wirtschaftlichkeitsberechnung?"
      ],
      relatedTopics: ["Photovoltaik Technik", "Solarförderung Details", "Wirtschaftlichkeitsrechner"],
      sources: ["ZOE Solar Technologie-Guide", "Bundesanstalt für Wirtschaft und Ausfuhrkontrolle"],
      structuredData: {
        '@type': 'DetailedAnswer',
        expandsOn: previousQuery.entities
      }
    };
  }

  /**
   * Alternative Antwort generieren
   */
  private generateAlternativeResponse(previousQuery: ConversationalQuery): ConversationalResponse {
    return {
      answer: "Es gibt verschiedene Alternativen und Optionen für gewerbliche Solaranlagen. Je nach Ihren Anforderungen können wir unterschiedliche Lösungen anbieten - von Dachanlagen über Freiflächenanlagen bis hin zu Carport-Solar.",
      followUpQuestions: [
        "Interessiert Sie eine Dachanlage oder Freiflächenanlage?",
        "Welche Leistung wird für Ihren Bedarf benötigt?",
        "Soll auch ein Stromspeicher integriert werden?"
      ],
      relatedTopics: ["Dach-Solaranlagen", "Freiflächen-Photovoltaik", "Carport-Solar"],
      sources: ["ZOE Solar Lösungsübersicht", "Solarindustrie Branchenreport"],
      structuredData: {
        '@type': 'AlternativeAnswer',
        alternativesFor: previousQuery.entities
      }
    };
  }

  /**
   * Performance Metriken abrufen
   */
  getPerformanceMetrics(): {
    totalQueries: number;
    averageResponseTime: number;
    intentDistribution: Record<string, number>;
    topEntities: Array<{entity: string, count: number}>;
  } {
    // Simulierte Metriken - in einer echten Anwendung würden diese live erfasst
    return {
      totalQueries: 1250,
      averageResponseTime: 0.8, // Sekunden
      intentDistribution: {
        informational: 45,
        commercial: 25,
        transactional: 20,
        navigational: 10
      },
      topEntities: [
        {entity: 'Solaranlagen', count: 450},
        {entity: 'Photovoltaik Beratung', count: 320},
        {entity: 'ZOE Solar Berlin', count: 280},
        {entity: 'Solarstromspeicher', count: 200}
      ]
    };
  }
}

// Export als Singleton
export const aiConversationalService = new AIConversationalService();
export default aiConversationalService;