/**
 * Keyword Optimizer für ZOE Solar
 *
 * Optimiert Content für deutsche Solar-Keywords und lokale Suchanfragen
 */

import { useEffect, useState } from 'react';

interface KeywordData {
  primary: string[];
  secondary: string[];
  local: string[];
  longtail: string[];
  commercial: string[];
  informational: string[];
}

interface KeywordDensity {
  keyword: string;
  count: number;
  density: number;
  recommendations: string[];
}

class KeywordOptimizer {
  private keywords: KeywordData = {
    primary: [
      'Solaranlagen für Unternehmen',
      'Photovoltaik Gewerbe',
      'gewerbliche Solaranlagen',
      'Solaranlage Kosten',
      'Photovoltaik Rendite',
      'Solaranlagen Hersteller',
      'Photovoltaik Speicher',
      'Solarstrom für Unternehmen'
    ],
    secondary: [
      'Solarförderung Deutschland',
      'Photovoltaik Wartung',
      'Solaranlage berechnen',
      'Photovoltaik Anlage',
      'Solaranlagen Preise',
      'Photovoltaik Finanzierung',
      'Solaranlagen Vergleich',
      'Photovoltaik Planung'
    ],
    local: [
      'Solaranlagen Berlin',
      'Photovoltaik München',
      'Solaranlagen Hamburg',
      'Solaranlagen Köln',
      'Solaranlagen Frankfurt',
      'Solaranlagen Stuttgart',
      'Solaranlagen Dresden',
      'Solaranlagen Leipzig'
    ],
    longtail: [
      'was kostet eine gewerbliche Solaranlage',
      'förderung für gewerbliche photovoltaik',
      'rendite bei solaranlagen für unternehmen',
      'photovoltaik anlage für kleinbetrieb',
      'solaranlagen für landwirtschaft',
      'gewerbliche photovoltaik mit speicher',
      'photovoltaikanlage für wohnungsgenossenschaft',
      'solaranlage für industrieunternehmen'
    ],
    commercial: [
      'gewerbliche solaranlagen angebot',
      'photovoltaik für unternehmen preise',
      'solaranlagen firmen installateure',
      'business photovoltaik lösungen',
      'unternehmen solaranlagen planung',
      'photovoltaik gewerbe immobilie',
      'solaranlagen für vermietung',
      'photovoltaik gewerbe leasing'
    ],
    informational: [
      'wie funktioniert photovoltaik für unternehmen',
      'vorteile solaranlagen gewerbe',
      'photovoltaik amortisation unternehmen',
      'steuerliche vorteile solaranlagen',
      'versicherung für gewerbliche solaranlagen',
      'wartungskosten photovoltaik gewerbe',
      'photovoltaik leistung berechnen',
      'solarstrom speichern unternehmen'
    ]
  };

  /**
   * Content auf Keyword-Dichte analysieren
   */
  analyzeKeywordDensity(content: string): KeywordDensity[] {
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    const analysis: KeywordDensity[] = [];

    // Alle Keywords analysieren
    const allKeywords = [
      ...this.keywords.primary,
      ...this.keywords.secondary,
      ...this.keywords.longtail
    ];

    allKeywords.forEach(keyword => {
      const keywordRegex = new RegExp(keyword.toLowerCase(), 'gi');
      const matches = content.match(keywordRegex);
      const count = matches ? matches.length : 0;
      const density = totalWords > 0 ? (count / totalWords) * 100 : 0;

      if (count > 0) {
        const recommendations = this.generateKeywordRecommendations(density, keyword);

        analysis.push({
          keyword,
          count,
          density: parseFloat(density.toFixed(2)),
          recommendations
        });
      }
    });

    // Sortieren nach Dichte
    return analysis.sort((a, b) => b.density - a.density);
  }

  /**
   * Keyword-Empfehlungen generieren
   */
  private generateKeywordRecommendations(density: number, keyword: string): string[] {
    const recommendations: string[] = [];

    if (density > 3) {
      recommendations.push(`⚠️ Keyword "${keyword}" hat hohe Dichte (${density.toFixed(2)}%). Reduzieren Sie die Verwendung.`);
    } else if (density > 2) {
      recommendations.push(`✅ Keyword "${keyword}" hat gute Dichte (${density.toFixed(2)}%).`);
    } else if (density > 0.5) {
      recommendations.push(`📈 Keyword "${keyword}" könnte öfter verwendet werden (${density.toFixed(2)}%).`);
    } else {
      recommendations.push(`❌ Keyword "${keyword}" kommt zu selten vor (${density.toFixed(2)}%).`);
    }

    // Spezifische Empfehlungen für Keyword-Typen
    if (this.keywords.primary.includes(keyword)) {
      if (density < 1) {
        recommendations.push('Dieses Primary Keyword sollte in Überschriften und Meta-Tags verwendet werden.');
      }
    }

    if (this.keywords.local.includes(keyword)) {
      recommendations.push('Lokales Keyword - ideal für Standort-Seiten und lokale Meta-Tags.');
    }

    if (this.keywords.longtail.includes(keyword)) {
      recommendations.push('Longtail Keyword - perfekt für FAQ-Sektionen und Blog-Content.');
    }

    return recommendations;
  }

  /**
   * SEO-optimierten Content generieren
   */
  generateOptimizedContent(topic: string, contentType: 'page' | 'blog' | 'faq' = 'page'): {
    title: string;
    metaDescription: string;
    headings: string[];
    content: string;
    keywords: string[];
  } {
    const relevantKeywords = this.getRelevantKeywords(topic);
    const location = this.getRandomLocation();

    const templates = {
      page: {
        title: `${topic} für Unternehmen | ZOE Solar ${location}`,
        metaDescription: `Professionelle ${topic.toLowerCase()} von ZOE Solar in ${location}. Planung, Installation und Wartung für gewerbliche Kunden. Kostenlose Beratung anfordern!`,
        headings: [
          `${topic} für Unternehmen in ${location}`,
          `Warum ZOE Solar für Ihre ${topic.toLowerCase()}`,
          `Ihre Vorteile mit ${topic.toLowerCase()} von ZOE Solar`,
          `Kosten und Förderung für ${topic.toLowerCase()}`,
          `Referenzen ${topic.toLowerCase()} in ${location}`,
          `Kontakt für Beratung zu ${topic.toLowerCase()}`
        ]
      },
      blog: {
        title: `${topic}: Die komplette Anleitung für Unternehmen 2025`,
        metaDescription: `Alles über ${topic.toLowerCase()} für Unternehmen. Kosten, Förderung, Rendite und Praxis-Tipps von ZOE Solar Experte.`,
        headings: [
          `${topic} im Überblick`,
          `Vorteile für Unternehmen`,
          `Kosten und Amortisation`,
          `Fördermöglichkeiten 2025`,
          `Praxisbeispiele und Erfolge`,
          `Tipps von Experten`
        ]
      },
      faq: {
        title: `FAQ: Häufige Fragen zu ${topic}`,
        metaDescription: `Die wichtigsten Fragen und Antworten zu ${topic.toLowerCase()} für Unternehmen. ZOE Solar Experten erklären alles Wissenswerte.`,
        headings: [
          `Was Sie über ${topic.toLowerCase()} wissen müssen`,
          `Kosten und Finanzierung`,
          `Technische Fragen`,
          `Planung und Installation`,
          `Wartung und Service`
        ]
      }
    };

    const template = templates[contentType];

    // Content generieren
    const content = this.generateContentText(template.headings, relevantKeywords, location);

    return {
      ...template,
      content,
      keywords: relevantKeywords
    };
  }

  /**
   * Relevante Keywords für ein Thema finden
   */
  private getRelevantKeywords(topic: string): string[] {
    const topicLower = topic.toLowerCase();
    const relevant: string[] = [];

    // Primary Keywords die zum Thema passen
    this.keywords.primary.forEach(keyword => {
      if (keyword.toLowerCase().includes(topicLower) ||
          topicLower.includes(keyword.toLowerCase())) {
        relevant.push(keyword);
      }
    });

    // Secondary Keywords
    this.keywords.secondary.forEach(keyword => {
      if (keyword.toLowerCase().includes(topicLower) ||
          topicLower.includes(keyword.toLowerCase())) {
        relevant.push(keyword);
      }
    });

    // Immer einige lokale Keywords hinzufügen
    relevant.push(...this.keywords.local.slice(0, 3));

    // Einige Longtail Keywords zum Thema
    this.keywords.longtail.forEach(keyword => {
      if (keyword.toLowerCase().includes(topicLower)) {
        relevant.push(keyword);
      }
    });

    return relevant.slice(0, 8); // Max 8 relevante Keywords
  }

  /**
   * Zufälligen Standort für lokale Optimierung
   */
  private getRandomLocation(): string {
    const locations = ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  /**
   * Content Text basierend auf Überschriften und Keywords generieren
   */
  private generateContentText(headings: string[], keywords: string[], location: string): string {
    let content = '';

    headings.forEach((heading, index) => {
      content += `\n\n## ${heading}\n\n`;

      // Paragraph basierend auf Überschrift generieren
      if (heading.includes('Vorteile')) {
        content += `Unternehmen in ${location} profitieren von erheblichen Vorteilen durch Solaranlagen. ${keywords[0]} bieten nicht nur Kosteneinsparungen, sondern auch Unabhängigkeit von steigenden Strompreisen.`;
      } else if (heading.includes('Kosten')) {
        content += `Die Kosten für ${keywords[0] || 'Solaranlagen'} hängen von verschiedenen Faktoren ab. Unsere Experten in ${location} erstellen Ihnen ein unverbindliches Angebot für Ihre individuelle Lösung.`;
      } else if (heading.includes('Förderung')) {
        content += `Aktuell gibt es attraktive ${keywords[1] || 'Förderprogramme'} für Unternehmen. Wir unterstützen Sie bei der Beantragung und maximieren Ihre Fördermittel.`;
      } else if (heading.includes('Referenzen')) {
        content += `Zahlreiche Unternehmen in ${location} vertrauen bereits auf ZOE Solar. Unsere Referenzen zeigen die erfolgreiche Umsetzung von ${keywords[0] || 'Photovoltaik-Projekten'}.`;
      } else if (heading.includes('Kontakt')) {
        content += `Kontaktieren Sie unsere Experten in ${location} für eine kostenlose Beratung zu ${keywords[0] || 'Solaranlagen'}. Wir finden die optimale Lösung für Ihr Unternehmen.`;
      } else {
        content += `Als erfahrener Partner für ${keywords[0] || 'Solaranlagen'} in ${location} bieten wir Ihnen maßgeschneiderte Lösungen für Ihre gewerblichen Anforderungen.`;
      }

      // Keywords integrieren
      keywords.slice(2, 5).forEach(keyword => {
        if (Math.random() > 0.5) {
          content += ` ${keyword} spielen eine wichtige Rolle bei der Entscheidung.`;
        }
      });
    });

    return content.trim();
  }

  /**
   * Meta-Tags optimieren
   */
  optimizeMetaTags(title: string, description: string, keywords: string[]): {
    optimizedTitle: string;
    optimizedDescription: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let optimizedTitle = title;
    let optimizedDescription = description;

    // Title Optimierung
    if (title.length > 60) {
      optimizedTitle = title.substring(0, 57) + '...';
      recommendations.push('Title zu lang - auf unter 60 Zeichen gekürzt');
    }

    if (!keywords.some(kw => title.toLowerCase().includes(kw.toLowerCase()))) {
      const primaryKeyword = keywords[0];
      if (primaryKeyword && !title.includes(primaryKeyword)) {
        optimizedTitle = `${primaryKeyword} | ${title}`;
        recommendations.push(`Primary Keyword "${primaryKeyword}" zum Title hinzugefügt`);
      }
    }

    // Description Optimierung
    if (description.length > 160) {
      optimizedDescription = description.substring(0, 157) + '...';
      recommendations.push('Description zu lang - auf unter 160 Zeichen gekürzt');
    }

    const descriptionKeywords = keywords.filter(kw =>
      description.toLowerCase().includes(kw.toLowerCase())
    );

    if (descriptionKeywords.length < 2) {
      recommendations.push('Description sollte mehr relevante Keywords enthalten');
    }

    // Standort optimieren
    const locations = ['Berlin', 'München', 'Hamburg'];
    const hasLocation = locations.some(loc =>
      title.includes(loc) || description.includes(loc)
    );

    if (!hasLocation) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      if (title.length < 50) {
        optimizedTitle = `${optimizedTitle} ${randomLocation}`;
      } else if (description.length < 140) {
        optimizedDescription = `${optimizedDescription} Jetzt in ${randomLocation} verfügbar.`;
      }
      recommendations.push(`Standort "${randomLocation}" hinzugefügt`);
    }

    return {
      optimizedTitle,
      optimizedDescription,
      recommendations
    };
  }

  /**
   * Content-Score berechnen
   */
  calculateContentScore(content: string, targetKeywords: string[]): {
    score: number;
    factors: {
      keywordDensity: number;
      keywordVariety: number;
      contentLength: number;
      readability: number;
      structure: number;
    };
    recommendations: string[];
  } {
    let score = 0;
    const recommendations: string[] = [];

    // Keyword Density (0-20 Punkte)
    const density = this.analyzeKeywordDensity(content);
    const goodDensity = density.filter(d => d.density >= 0.5 && d.density <= 2).length;
    const keywordDensityScore = Math.min(20, goodDensity * 4);
    score += keywordDensityScore;

    if (keywordDensityScore < 15) {
      recommendations.push('Optimieren Sie die Keyword-Dichte (0.5-2%)');
    }

    // Keyword Variety (0-20 Punkte)
    const usedKeywords = density.length;
    const keywordVarietyScore = Math.min(20, usedKeywords * 2.5);
    score += keywordVarietyScore;

    if (keywordVarietyScore < 15) {
      recommendations.push('Verwenden Sie mehr verschiedene Keywords');
    }

    // Content Length (0-20 Punkte)
    const wordCount = content.split(/\s+/).length;
    let contentLengthScore = 0;
    if (wordCount >= 300) contentLengthScore = 20;
    else if (wordCount >= 200) contentLengthScore = 15;
    else if (wordCount >= 100) contentLengthScore = 10;
    else contentLengthScore = 5;

    score += contentLengthScore;

    if (contentLengthScore < 15) {
      recommendations.push(`Content ist zu kurz (${wordCount} Wörter). Mindestens 300 Wörter empfehlen.`);
    }

    // Readability (0-20 Punkte)
    const avgWordsPerSentence = this.calculateAverageWordsPerSentence(content);
    let readabilityScore = 20;
    if (avgWordsPerSentence > 20) readabilityScore = 10;
    else if (avgWordsPerSentence > 25) readabilityScore = 5;

    score += readabilityScore;

    if (readabilityScore < 15) {
      recommendations.push('Verwenden Sie kürzere Sätze für bessere Lesbarkeit');
    }

    // Structure (0-20 Punkte)
    const headings = content.match(/^#{1,3}\s.+$/gm) || [];
    const structureScore = Math.min(20, headings.length * 5);
    score += structureScore;

    if (structureScore < 15) {
      recommendations.push('Verwenden Sie mehr Überschriften für bessere Struktur');
    }

    return {
      score: Math.round(score),
      factors: {
        keywordDensity: keywordDensityScore,
        keywordVariety: keywordVarietyScore,
        contentLength: contentLengthScore,
        readability: readabilityScore,
        structure: structureScore
      },
      recommendations
    };
  }

  /**
   * Durchschnittliche Satzlänge berechnen
   */
  private calculateAverageWordsPerSentence(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalWords = sentences.reduce((sum, sentence) => {
      return sum + sentence.trim().split(/\s+/).length;
    }, 0);

    return sentences.length > 0 ? totalWords / sentences.length : 0;
  }
}

// React Component
export default function KeywordOptimizerComponent() {
  const [optimizer] = useState(() => new KeywordOptimizer());
  const [analysis, setAnalysis] = useState<any>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      analyzeCurrentPage();
    }
  }, []);

  const analyzeCurrentPage = () => {
    const content = document.body.textContent || '';
    const title = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // Keyword Density Analyse
    const densityAnalysis = optimizer.analyzeKeywordDensity(content);

    // Content Score
    const contentScore = optimizer.calculateContentScore(content, optimizer.keywords.primary);

    // Meta Tags Optimierung
    const metaOptimization = optimizer.optimizeMetaTags(
      title,
      metaDescription,
      optimizer.keywords.primary
    );

    setAnalysis({
      density: densityAnalysis,
      content: contentScore,
      meta: metaOptimization
    });

    setScore(contentScore.score);

    console.log('🔍 Keyword Analyse abgeschlossen');
    console.log('Content Score:', contentScore.score);
  };

  // Component rendert nichts sichtbares - nur für Analyse
  return null;
}

// Export für externen Gebrauch
export { KeywordOptimizer };