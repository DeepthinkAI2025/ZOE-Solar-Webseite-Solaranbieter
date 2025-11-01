/**
 * GEO/AEO Content Service für ZOE Solar
 *
 * Generative Engine Optimization & Answer Engine Optimization
 * Fokussiert auf Sichtbarkeit in ChatGPT, Claude, Perplexity & Co.
 */

export interface GEOContentBlock {
  id: string;
  type: 'question_answer' | 'step_by_step' | 'comparison' | 'checklist' | 'definition' | 'calculation';
  title: string;
  content: string;
  keywords: string[];
  entities: string[];
  confidence_score: number;
  ai_optimized: boolean;
  structured_data?: any;
}

export interface ConversationStarter {
  question: string;
  context: string;
  keywords: string[];
  category: 'cost' | 'technical' | 'process' | 'comparison' | 'location';
  follow_up_questions: string[];
}

export interface AIAnswerFormat {
  question: string;
  direct_answer: string;
  supporting_details: string[];
  examples: string[];
  sources: string[];
  confidence_level: 'high' | 'medium' | 'low';
}

export interface LocationSpecificContent {
  location: string;
  content_blocks: GEOContentBlock[];
  local_faq: {
    question: string;
    answer: string;
    location_specific: boolean;
  }[];
  regional_insights: {
    sunshine_hours: number;
    average_tariff: number;
    local_incentives: string[];
    permit_requirements: string;
  };
}

export interface FeaturedSnippet {
  target_keyword: string;
  content_format: 'definition' | 'list' | 'table' | 'step_by_step';
  title: string;
  content: string;
  optimal_length: number;
  readability_score: number;
  schema_markup: string;
}

class GEOAEOContentService {
  private baseUrl: string;
  private aiModels: string[];
  private searchIntents: Map<string, string[]>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoe-solar.de';
    this.aiModels = ['gpt-4', 'claude-3', 'gemini-pro', 'llama-3', 'perplexity'];
    this.searchIntents = new Map([
      ['informational', ['was', 'wie', 'warum', 'definition', 'erklärung']],
      ['commercial', ['kosten', 'preis', 'günstig', 'vergleich', 'angebote']],
      ['transactional', ['kaufen', 'bestellen', 'anfrage', 'beratung', 'angebot']],
      ['navigational', ['zoe solar', 'kontakt', 'standort', 'telefon']],
      ['local', ['in der nähe', 'standort', 'berlin', 'münchen', 'vor ort']]
    ]);

    this.initializeLocationContent();
  }

  /**
   * Initialisiert standortspezifische Inhalte
   */
  private initializeLocationContent(): void {
    // Standort-spezifische Inhaltsblöcke für alle deutschen Städte
    this.generateLocationSpecificContent();
  }

  /**
   * KI-gestützte Frage-Antwort Blöcke generieren
   */
  generateAIQuestionAnswerBlocks(): GEOContentBlock[] {
    const qaBlocks: GEOContentBlock[] = [
      {
        id: 'solaranlage-kosten-gewerbe',
        type: 'question_answer',
        title: 'Was kostet eine Solaranlage für ein Gewerbe?',
        content: `Eine Solaranlage für ein Gewerbe kostet durchschnittlich zwischen 15.000 und 150.000 Euro. Die genauen Kosten hängen von der Dachfläche, dem Standort und der gewünschten Leistung ab.

Typische Kostenübersicht:
• Kleinunternehmen (10-30 kWp): 15.000-30.000 €
• Mittelständische Betriebe (30-100 kWp): 30.000-100.000 €
• Großunternehmen (100-500+ kWp): 100.000-500.000+ €

Die Investition amortisiert sich meist innerhalb von 8-12 Jahren durch Stromkostenersparnis und Förderungen.`,
        keywords: ['solaranlage kosten gewerbe', 'photovoltaik preis unternehmen', 'gewerbe solaranlage kosten'],
        entities: ['Photovoltaik', 'Gewerbe', 'Investition', 'Förderung'],
        confidence_score: 0.95,
        ai_optimized: true
      },
      {
        id: 'speicher-rentabilität-unternehmen',
        type: 'question_answer',
        title: 'Lohnt sich ein Stromspeicher für Unternehmen?',
        content: `Ja, ein Stromspeicher lohnt sich für die meisten Unternehmen aus mehreren Gründen:

1. **Eigenverbrauchssteigerung**: Bis zu 80% Solarstrom selbst nutzen statt nur 40%
2. **Energiekostenoptimierung**: Günstigsten Stromtarife automatisch nutzen
3. **Netzentgelteinsparung**: Reduzierte Gebühren bei Eigenverbrauch
4. **Notstromversorgung**: Betriebssicherheit bei Stromausfällen
5. **E-Mobilität**: Günstigere Elektroauto-Ladung

Die Amortisationszeit beträgt typischerweise 10-15 Jahre. Bei hoher Strompreisvolatilität und intensivem Energieverbrauch oft schon nach 7-9 Jahren.`,
        keywords: ['stromspeicher unternehmen lohnt sich', 'batteriespeicher gewerbe rentabilität'],
        entities: ['Stromspeicher', 'Amortisation', 'Netzentgelte', 'E-Mobilität'],
        confidence_score: 0.92,
        ai_optimized: true
      },
      {
        id: 'photovoltaik-genehmigung-gewerbe',
        type: 'step_by_step',
        title: 'Schritt-für-Schritt: Photovoltaik Genehmigung für Gewerbe',
        content: `Für die Genehmigung einer Gewerbe-Photovoltaikanlage sind folgende Schritte notwendig:

**Schritt 1: Voraussetzungen prüfen**
- Baurechtliche Prüfung (Bebauungsplan)
- Statik des Daches prüfen lassen
- Netzanschlusskapazität beim Netzbetreiber anfragen

**Schritt 2: Angebote einholen**
- Mindestens 3 Fachfirmen kontaktieren
- Vergleich der Anlagenkomponenten und Garantien
- Detaillierte Auslegung der Anlage erstellen

**Schritt 3: Netzanschluss beantragen**
- Online-Antrag beim zuständigen Netzbetreiber
- Technische Details der Anlage einreichen
- Wartezeit: 2-8 Wochen auf Zusage

**Schritt 4: Baugenehmigung (falls nötig)**
- Bei Gebäuden mit Baudenkmalschutz oder besonderen Vorschriften
- Einreichung bei zuständiger Baubehörde
- Bearbeitungsdauer: 4-12 Wochen

**Schritt 5: Förderung beantragen**
- KfW-Förderung vor Baubeginn sichern
- BAFA-Förderung für digitale Energiewende
- Regionale Förderprogramme prüfen

Die gesamte Prozessdauer beträgt meist 3-6 Monate vom ersten Kontakt bis zur Inbetriebnahme.`,
        keywords: ['photovoltaik genehmigung gewerbe', 'solaranlage baugenehmigung unternehmen', 'netzanschluss gewerbe'],
        entities: ['Baugenehmigung', 'Netzbetreiber', 'KfW', 'BAFA'],
        confidence_score: 0.98,
        ai_optimized: true
      },
      {
        id: 'solarfinanzierung-unternehmen',
        type: 'comparison',
        title: 'Solaranlagen Finanzierung: Alle Optionen im Vergleich',
        content: `Unternehmen haben mehrere Möglichkeiten zur Finanzierung von Solaranlagen:

**Eigentumsfinanzierung**
• **Bankkredit**: 2,5-4,5% Zinsen, 10-15 Jahre Laufzeit
• **KfW-Kredit**: Bis zu 100% Finanzierung, 1-2% Zinsen
• **Leasing**: Keine Anfangsinvestition, monatliche Raten
• **Mietkauf**: Möglichkeit zum späteren Kauf

**Vorteile Eigentum:**
• Volle Kontrolle über die Anlage
• Alle Förderungen direkt beantragbar
• Höhere Langzeitrendite
• Wertsteigerung des Gebäudes

**Vorteile Leasing/Miete:**
• Kein Kapital gebunden
• Wartung oft inklusive
• Technologierisiko beim Anbieter
• Steuervorteile durch sofortige Abschreibung

**Empfehlung**: Bei ausreichender Liquidität und längerem Planungshorizont ist Eigentumsfinanzierung mit KfW-Kredit am wirtschaftlichsten. Bei Liquiditätsengpässen oder kurzer Planung ist Leasing die bessere Wahl.`,
        keywords: ['solaranlage finanzierung unternehmen', 'photovoltaik leasing gewerbe', 'kfw kredit solaranlage'],
        entities: ['KfW', 'Bankkredit', 'Leasing', 'Mietkauf'],
        confidence_score: 0.94,
        ai_optimized: true
      }
    ];

    return qaBlocks;
  }

  /**
   * Conversation Starter für KI-Interaktionen generieren
   */
  generateConversationStarters(): ConversationStarter[] {
    return [
      {
        question: 'Welche Fördersätze gibt es 2025 für Solaranlagen in Deutschland?',
        context: 'Informationen über aktuelle staatliche Förderprogramme für Photovoltaik',
        keywords: ['förderung 2025', 'solarförderung aktuell', 'photovoltaik förderung'],
        category: 'cost',
        follow_up_questions: [
          'Wie hoch ist der KfW-Zuschuss für Solaranlagen?',
          'Gibt es regionale Förderungen für Solaranlagen?',
          'Wie beantrage ich die BAFA-Förderung für Photovoltaik?'
        ]
      },
      {
        question: 'Welche Solaranlage eignet sich am besten für mein Unternehmen?',
        context: 'Hilfe bei der Auswahl der passenden Photovoltaikanlage für unterschiedliche Geschäftstypen',
        keywords: ['solaranlage unternehmen auswahl', 'photovoltaik gewerbe beratung'],
        category: 'technical',
        follow_up_questions: [
          'Wie viel Leistung brauche ich für mein Unternehmen?',
          'Welche Modultypen sind am besten für Gewerbedächer geeignet?',
          'Sollte ich einen Speicher dazunehmen?'
        ]
      },
      {
        question: 'Was ist der Unterschied zwischen MONOKristallinen und polykristallinen Solarmodulen?',
        context: 'Technischer Vergleich verschiedener Solarmodul-Typen',
        keywords: ['monokristallin polykristallin unterschied', 'solarmodul typen vergleich'],
        category: 'technical',
        follow_up_questions: [
          'Welche Module haben den besten Wirkungsgrad?',
          'Wie lange halten Solarmodule durchschnittlich?',
          'Was kosten die verschiedenen Modultypen?'
        ]
      },
      {
        question: 'Wie lange dauert die Installation einer Solaranlage?',
        context: 'Zeitplan für die Installation einer Photovoltaikanlage beim Gewerbe',
        keywords: ['solaranlage installation dauer', 'photovoltaik montage zeitaufwand'],
        category: 'process',
        follow_up_questions: [
          'Welche Genehmigungen brauche ich für eine Solaranlage?',
          'Wann beginnt die Stromproduktion nach Installation?',
          'Wie stört die Installation meinen Geschäftsbetrieb?'
        ]
      },
      {
        question: 'Wie viel Strom kann eine 10 kWp Solaranlage pro Jahr produzieren?',
        context: 'Ertragsberechnung für eine durchschnittliche Gewerbe-Solaranlage',
        keywords: ['10 kwp solaranlage ertrag', 'photovoltaik stromproduktion jahr'],
        category: 'calculation',
        follow_up_questions: [
          'Wie viele Module braucht man für 10 kWp?',
          'Wie viel Dachfläche benötigt eine 10 kWp Anlage?',
          'Welche Faktoren beeinflussen den Solarertrag?'
        ]
      }
    ];
  }

  /**
   * Featured Snippets für maximale Sichtbarkeit generieren
   */
  generateFeaturedSnippets(): FeaturedSnippet[] {
    return [
      {
        target_keyword: 'was ist photovoltaik',
        content_format: 'definition',
        title: 'Photovoltaik Definition',
        content: 'Photovoltaik (kurz PV) ist die direkte Umwandlung von Sonnenlicht in elektrische Energie durch Solarzellen. Der Name setzt sich zusammen aus dem griechischen "photos" (Licht) und "voltaik" (elektrische Spannung). Bei der Photovoltaik wird das Prinzip des photoelektrischen Effekts genutzt: Photonen aus dem Sonnenlicht treffen auf Halbleitermaterial in den Solarzellen und setzen Elektronen frei, wodurch Gleichstrom entsteht.',
        optimal_length: 280,
        readability_score: 85,
        schema_markup: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: 'Photovoltaik',
          description: 'Direkte Umwandlung von Sonnenlicht in elektrische Energie durch Solarzellen',
          termCode: 'PV',
          inDefinedTermSet: 'Erneuerbare Energien'
        })
      },
      {
        target_keyword: 'solaranlage kosten',
        content_format: 'list',
        title: 'Solaranlage Kosten Übersicht',
        content: 'Typische Kosten für Solaranlagen in Deutschland (2025):\n\n**Privathaushalte**:\n• 5 kWp Anlage: 8.000-12.000 €\n• 10 kWp Anlage: 15.000-20.000 €\n\n**Gewerbe**:\n• 20 kWp Anlage: 25.000-35.000 €\n• 50 kWp Anlage: 60.000-80.000 €\n• 100 kWp Anlage: 120.000-150.000 €\n\n**Inklusive**: Module, Wechselrichter, Montage, Planung, Anmeldung\n**Zusätzliche Kosten**: Stromspeicher (6.000-15.000 €), Dachsanierung (falls nötig)',
        optimal_length: 450,
        readability_score: 88,
        schema_markup: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Solaranlage Kosten',
          description: 'Übersicht der typischen Kosten für Solaranlagen in Deutschland'
        })
      },
      {
        target_keyword: 'photovoltaik rentabilität',
        content_format: 'step_by_step',
        title: 'Photovoltaik Rentabilität Berechnen',
        content: 'So berechnen Sie die Rentabilität Ihrer Solaranlage:\n\n**1. Jahresertrag berechnen**\nLeistung (kWp) × Sonneneinstrahlung (kWh/kWp) × 0,85 = Jahresertrag (kWh)\n\n**2. Einsparungen pro Jahr**\nJahresertrag × Strompreis (€/kWh) = Einsparung\n\n**3. Amortisationszeit**\nInvestitionskosten ÷ Jahresersparnis = Amortisationsjahre\n\n**Beispiel 10 kWp Anlage**:\n• Jahresertrag: 10 × 950 × 0,85 = 8.075 kWh\n• Einsparung: 8.075 × 0,32 € = 2.584 €/Jahr\n• Amortisation: 18.000 € ÷ 2.584 € = 7 Jahre',
        optimal_length: 520,
        readability_score: 82,
        schema_markup: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'Photovoltaik Rentabilität Berechnen',
          step: [
            {'@type': 'HowToStep', 'name': 'Jahresertrag berechnen'},
            {'@type': 'HowToStep', 'name': 'Einsparungen pro Jahr'},
            {'@type': 'HowToStep', 'name': 'Amortisationszeit'}
          ]
        })
      }
    ];
  }

  /**
   * Standort-spezifische Inhalte generieren
   */
  private generateLocationSpecificContent(): void {
    const germanLocations = [
      {
        name: 'Berlin',
        sunshine_hours: 1620,
        average_tariff: 0.34,
        local_incentives: ['BE-Förderung Solar', 'Berlin Energie Bonus'],
        permit_requirements: 'Einfache Anmeldung für Anlagen bis 30 kWp'
      },
      {
        name: 'München',
        sunshine_hours: 1760,
        average_tariff: 0.35,
        local_incentives: ['Bayern Solarförderung', 'München Klimaschutz-Programm'],
        permit_requirements: 'Denkmalschutz prüfen in Altstadtgebieten'
      },
      {
        name: 'Hamburg',
        sunshine_hours: 1540,
        average_tariff: 0.33,
        local_incentives: ['Hamburg SolarBonus', 'HH-Wachstumschmiede'],
        permit_requirements: 'Gebäudeenergiegesetz beachten'
      },
      {
        name: 'Köln',
        sunshine_hours: 1580,
        average_tariff: 0.31,
        local_incentives: ['NRW.SolarPlus', 'Kölner Klimaschutzfonds'],
        permit_requirements: 'Baugenehmigung für Kirchen und Denkmäler'
      },
      {
        name: 'Frankfurt',
        sunshine_hours: 1650,
        average_tariff: 0.32,
        local_incentives: ['Hessen Solarförderung', 'Frankfurt Green City'],
        permit_requirements: 'Hochhausrichtlinie beachten'
      }
    ];

    // Location-specific content blocks for each city
    germanLocations.forEach(location => {
      this.createLocationSpecificContentBlock(location);
    });
  }

  /**
   * Standort-spezifischen Inhaltsblock erstellen
   */
  private createLocationSpecificContentBlock(location: {
    name: string;
    sunshine_hours: number;
    average_tariff: number;
    local_incentives: string[];
    permit_requirements: string;
  }): void {
    const locationContent = {
      id: `location-${location.name.toLowerCase()}`,
      type: 'question_answer' as const,
      title: `Photovoltaik in ${location.name}: Alles Wichtige für Unternehmen`,
      content: `**Solarpotenzial in ${location.name}**\n\nMit ${location.sunshine_hours} Sonnenstunden pro Jahr bietet ${location.name} sehr gute Bedingungen für Photovoltaik. Der aktuelle Strompreis liegt bei ${location.average_tariff} €/kWh.\n\n**Lokale Förderprogramme:**\n${location.local_incentives.map(incentive => `• ${incentive}`).join('\n')}\n\n**Genehmigung:**\n${location.permit_requirements}\n\n**Typische Erträge in ${location.name}:**\n• 10 kWp Anlage: ca. ${(location.sunshine_hours * 10 * 0.85).toLocaleString()} kWh/Jahr\n• 50 kWp Anlage: ca. ${(location.sunshine_hours * 50 * 0.85).toLocaleString()} kWh/Jahr\n• 100 kWp Anlage: ca. ${(location.sunshine_hours * 100 * 0.85).toLocaleString()} kWh/Jahr\n\n**Amortisationszeit:**\nDurchschnittlich 8-12 Jahre je nach Anlagengröße und Strompreisentwicklung.`,
      keywords: [`photovoltaik ${location.name.toLowerCase()}`, `solaranlage ${location.name.toLowerCase()}`, `solarförderung ${location.name.toLowerCase()}`],
      entities: [location.name, 'Photovoltaik', 'Förderung', 'Ertrag'],
      confidence_score: 0.96,
      ai_optimized: true
    };

    // Store location-specific content for later use
    this.setLocationContent(location.name, locationContent);
  }

  /**
   * Location content speichern (in einer echten Implementierung würde dies in einer Datenbank gespeichert)
   */
  private setLocationContent(location: string, content: GEOContentBlock): void {
    // In einer realen Implementierung würde dies in einer Datenbank gespeichert
    console.log(`Location content set for ${location}:`, content.id);
  }

  /**
   * KI-optimierten Content für eine bestimmte Suchanfrage generieren
   */
  generateAIAnswerFormat(query: string, intent: string): AIAnswerFormat {
    // Suchintent analysieren
    const detectedIntent = this.detectSearchIntent(query);

    // Passende Antwort basierend auf Intent generieren
    let directAnswer = '';
    let supportingDetails: string[] = [];
    let examples: string[] = [];
    let confidenceLevel: 'high' | 'medium' | 'low' = 'medium';

    if (detectedIntent === 'commercial' && query.includes('kosten')) {
      directAnswer = 'Die Kosten für eine Solaranlage variieren je nach Größe und Ausführung zwischen 8.000 € für kleine Anlagen und 150.000 € für große Gewerbeanlagen.';
      supportingDetails = [
        'Privathaushalte: 8.000-25.000 €',
        'Kleinunternehmen: 15.000-50.000 €',
        'Mittelständische Betriebe: 50.000-150.000 €',
        'Großunternehmen: 150.000 €+'
      ];
      examples = ['Ein Handwerksbetrieb mit 20 kWp zahlt ca. 25.000 €'];
      confidenceLevel = 'high';
    } else if (detectedIntent === 'informational' && query.includes('was')) {
      directAnswer = 'Photovoltaik ist die direkte Umwandlung von Sonnenlicht in elektrische Energie mithilfe von Solarzellen.';
      supportingDetails = [
        'Nutzt den photoelektrischen Effekt',
        'Erzeugt Gleichstrom',
        'Wirkungsgrad moderner Module: 18-23%',
        'Lebensdauer: 25-30 Jahre'
      ];
      examples = ['Eine 10 kWp Anlage erzeugt ca. 9.000 kWh Strom pro Jahr'];
      confidenceLevel = 'high';
    }

    return {
      question: query,
      direct_answer: directAnswer,
      supporting_details: supportingDetails,
      examples: examples,
      sources: [this.baseUrl, 'Bundesverband Solarwirtschaft', 'KfW Förderbank'],
      confidence_level: confidenceLevel
    };
  }

  /**
   * Suchintent erkennen
   */
  private detectSearchIntent(query: string): string {
    const lowerQuery = query.toLowerCase();

    for (const [intent, keywords] of this.searchIntents) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        return intent;
      }
    }

    return 'informational';
  }

  /**
   * GEO/AEO-optimierten Content für alle Seiten generieren
   */
  generateGEOOptimizedContent(): {
    qa_blocks: GEOContentBlock[];
    conversation_starters: ConversationStarter[];
    featured_snippets: FeaturedSnippet[];
    ai_answers: AIAnswerFormat[];
  } {
    const qaBlocks = this.generateAIQuestionAnswerBlocks();
    const conversationStarters = this.generateConversationStarters();
    const featuredSnippets = this.generateFeaturedSnippets();

    // AI-Antworten für häufige Suchanfragen generieren
    const commonQueries = [
      'was kostet eine solaranlage für ein unternehmen',
      'lohnt sich eine solaranlage 2025',
      'welche förderung gibt es für solaranlagen',
      'wie lange hält eine solaranlage',
      'wie viel strom erzeugt eine 10 kwp anlage'
    ];

    const aiAnswers = commonQueries.map(query =>
      this.generateAIAnswerFormat(query, this.detectSearchIntent(query))
    );

    return {
      qa_blocks: qaBlocks,
      conversation_starters: conversationStarters,
      featured_snippets: featuredSnippets,
      ai_answers: aiAnswers
    };
  }

  /**
   * Content für KI-Modelle optimieren
   */
  optimizeForAIModels(content: string): string {
    // KI-optimierte Formate implementieren
    let optimizedContent = content;

    // Struktur mit klaren Absätzen und Listen
    optimizedContent = this.addStructuredFormatting(optimizedContent);

    // Einfache, verständliche Sprache
    optimizedContent = this.simplifyLanguage(optimizedContent);

    # Kontextuelle Hinweise für KI-Modelle
    optimizedContent = this.addContextualHints(optimizedContent);

    # Entitäten und Beziehungen hervorheben
    optimizedContent = this.highlightEntities(optimizedContent);

    return optimizedContent;
  }

  /**
   * Strukturierte Formatierung hinzufügen
   */
  private addStructuredFormatting(content: string): string {
    // Überschriften, Listen und Aufzählungen optimieren
    return content
      .replace(/(\d+\.\s)/g, '\n**$1**')
      .replace(/(•\s)/g, '\n• ')
      .replace(/(\*\*[^*]+\*\*)/g, '\n$1\n');
  }

  /**
   * Sprache vereinfachen
   */
  private simplifyLanguage(content: string): string {
    // Komplexe Begriffe durch einfachere ersetzen
    const replacements = {
      'Photovoltaikanlage': 'Solaranlage',
      'installieren': 'einbauen',
      'optimieren': 'verbessern',
      'Investitionskosten': 'Kosten',
      'Amortisationszeit': 'Amortisierung'
    };

    let simplified = content;
    Object.entries(replacements).forEach(([complex, simple]) => {
      simplified = simplified.replace(new RegExp(complex, 'g'), simple);
    });

    return simplified;
  }

  /**
   * Kontextuelle Hinweise hinzufügen
   */
  private addContextualHints(content: string): string {
    const hints = [
      '\n---\n*Antwort optimiert für KI-Suchsysteme*',
      '*Quelle: ZOE Solar - Ihr Experte für Solarenergie*'
    ];

    return content + '\n\n' + hints.join('\n');
  }

  /**
   * Entitäten hervorheben
   */
  private highlightEntities(content: string): string {
    const entities = ['ZOE Solar', 'KfW', 'BAFA', 'Photovoltaik', 'Stromspeicher', 'Erneuerbare Energien'];

    let highlighted = content;
    entities.forEach(entity => {
      highlighted = highlighted.replace(
        new RegExp(entity, 'g'),
        `**${entity}**`
      );
    });

    return highlighted;
  }

  /**
   * Performance-Metriken für GEO/AEO Content
   */
  getGEOAEOPerformanceMetrics(): {
    total_blocks: number;
    ai_optimized_blocks: number;
    average_confidence: number;
    content_categories: Record<string, number>;
  } {
    const geoContent = this.generateGEOOptimizedContent();

    const aiOptimizedCount = geoContent.qa_blocks.filter(block => block.ai_optimized).length;
    const averageConfidence = geoContent.qa_blocks.reduce((sum, block) => sum + block.confidence_score, 0) / geoContent.qa_blocks.length;

    const categories: Record<string, number> = {};
    geoContent.conversation_starters.forEach(starter => {
      categories[starter.category] = (categories[starter.category] || 0) + 1;
    });

    return {
      total_blocks: geoContent.qa_blocks.length,
      ai_optimized_blocks: aiOptimizedCount,
      average_confidence: averageConfidence,
      content_categories: categories
    };
  }
}

// Singleton-Instanz exportieren
export const geoAEOContentService = new GEOAEOContentService();

// Global für einfachen Zugriff
if (typeof window !== 'undefined') {
  window.geoAEO = geoAEOContentService;
}

export default geoAEOContentService;

// Types für globale Erweiterung
declare global {
  interface Window {
    geoAEO: typeof geoAEOContentService;
  }
}