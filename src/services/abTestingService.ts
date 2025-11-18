// A/B Testing Service für ZOE Solar
// Professionelles A/B Testing Framework mit statistischer Auswertung

import { Client } from '@notionhq/client';

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'completed' | 'paused' | 'cancelled';
  type: 'popup' | 'banner' | 'landing_page' | 'call_to_action' | 'headline' | 'color_scheme';
  startDate?: string;
  endDate?: string;
  targetAudience?: string[];
  sampleSize?: number;
  confidenceLevel: number; // 95, 99
  minimumDetectableEffect: number; // in %
  variants: ABTestVariant[];
  metrics: ABTestMetric[];
  winner?: string;
  statisticalSignificance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  isControl: boolean;
  traffic: number; // percentage 0-100
  impressions: number;
  conversions: number;
  conversionRate: number;
  participants?: number; // Optional für Kompatibilität
  improvement?: number; // Optional für Kompatibilität
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
  pValue?: number;
  isWinner?: boolean;
}

export interface ABTestMetric {
  name: string;
  type: 'conversion_rate' | 'click_through_rate' | 'bounce_rate' | 'time_on_page' | 'revenue_per_visitor';
  primary: boolean;
}

export interface ABTestResultVariant {
  id: string;
  name: string;
  isControl: boolean;
  participants: number;
  conversions: number;
  conversionRate: number;
  improvement?: number;
  pValue?: number;
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
}

export interface ABTestResult {
  testId: string;
  testName: string;
  status: string;
  duration: number; // in days
  totalParticipants: number;
  totalConversions: number;
  winner: {
    variantId: string;
    variantName: string;
    conversionRate: number;
    improvement: number; // percentage over control
    confidence: number;
    statisticalSignificance: boolean;
  };
  variants: ABTestResultVariant[];
  recommendations: string[];
}

export interface ABTestConfig {
  defaultSampleSize: number;
  defaultConfidenceLevel: number;
  defaultMinimumDetectableEffect: number;
  maxTestDuration: number; // in days
  minParticipantsPerVariant: number;
  autoStopOnSignificance: boolean;
}

export interface NotionProperties {
  [key: string]: unknown;
}

class ABTestingService {
  private notion: Client;
  private databaseId: string;
  private activeTests: Map<string, ABTest> = new Map();
  private config: ABTestConfig = {
    defaultSampleSize: 1000,
    defaultConfidenceLevel: 95,
    defaultMinimumDetectableEffect: 10,
    maxTestDuration: 30,
    minParticipantsPerVariant: 100,
    autoStopOnSignificance: true
  };

  constructor() {
    this.notion = new Client({
      auth: import.meta.env.VITE_NOTION_TOKEN,
    });
    this.databaseId = import.meta.env.VITE_NOTION_ABTESTING_DB || '';
  }

  /**
   * Neuen A/B Test erstellen
   */
  async createTest(test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!this.databaseId) {
        // Fallback zu Local Storage wenn Notion nicht konfiguriert
        return this.createTestLocalStorage(test);
      }

      const notionPage = {
        parent: {
          type: 'database_id' as const,
          database_id: this.databaseId
        },
        properties: {
          'Test Name': {
            title: [
              { text: { content: test.name } }
            ]
          },
          'Beschreibung': {
            rich_text: [
              { text: { content: test.description } }
            ]
          },
          'Status': {
            select: { name: this.mapStatus(test.status) }
          },
          'Test Typ': {
            select: { name: this.mapType(test.type) }
          },
          'Startdatum': {
            date: test.startDate ? { start: test.startDate } : null
          },
          'Enddatum': {
            date: test.endDate ? { start: test.endDate } : null
          },
          'Stichprobengröße': {
            number: test.sampleSize || null
          },
          'Konfidenzlevel (%)': {
            number: test.confidenceLevel
          },
          'Mindestens erkennbarer Effekt (%)': {
            number: test.minimumDetectableEffect
          },
          'Varianten': {
            rich_text: [
              { text: { content: JSON.stringify(test.variants) } }
            ]
          },
          'Metriken': {
            rich_text: [
              { text: { content: JSON.stringify(test.metrics) } }
            ]
          },
          'Gewinner': {
            rich_text: [
              { text: { content: test.winner || '' } }
            ]
          }
        }
      };

      const response = await this.notion.pages.create(notionPage);
      const testId = response.id;

      const newTest: ABTest = {
        ...test,
        id: testId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.activeTests.set(testId, newTest);

      console.log('✅ A/B Test erstellt:', testId);
      return testId;

    } catch (error) {
      console.error('❌ Fehler beim Erstellen des A/B Tests:', error);
      throw error;
    }
  }

  /**
   * A/B Test starten
   */
  async startTest(testId: string): Promise<void> {
    const test = this.activeTests.get(testId);
    if (!test) {
      throw new Error('A/B Test nicht gefunden');
    }

    test.status = 'running';
    test.startDate = new Date().toISOString();
    test.updatedAt = new Date().toISOString();

    if (this.databaseId) {
      await this.updateTestInNotion(testId, {
        Status: { select: { name: 'Running' } },
        Startdatum: { date: { start: test.startDate } }
      });
    }

    this.activeTests.set(testId, test);
    console.log('✅ A/B Test gestartet:', testId);
  }

  /**
   * A/B Test stoppen
   */
  async stopTest(testId: string): Promise<ABTestResult> {
    const test = this.activeTests.get(testId);
    if (!test) {
      throw new Error('A/B Test nicht gefunden');
    }

    test.status = 'completed';
    test.endDate = new Date().toISOString();
    test.updatedAt = new Date().toISOString();

    // Statistische Auswertung durchführen
    const result = this.calculateTestResults(test);

    test.winner = result.winner.variantId;
    test.statisticalSignificance = result.winner.confidence;

    if (this.databaseId) {
      await this.updateTestInNotion(testId, {
        Status: { select: { name: 'Completed' } },
        Enddatum: { date: { start: test.endDate } },
        Gewinner: { rich_text: [{ text: { content: result.winner.variantId } }] }
      });
    }

    this.activeTests.set(testId, test);

    console.log('✅ A/B Test abgeschlossen:', testId);
    return result;
  }

  /**
   * Varianten-Daten aktualisieren
   */
  async updateVariantData(testId: string, variantId: string, data: { impressions: number; conversions: number }): Promise<void> {
    const test = this.activeTests.get(testId);
    if (!test) {
      throw new Error('A/B Test nicht gefunden');
    }

    const variant = test.variants.find(v => v.id === variantId);
    if (!variant) {
      throw new Error('Variante nicht gefunden');
    }

    variant.impressions = data.impressions;
    variant.conversions = data.conversions;
    variant.conversionRate = data.impressions > 0 ? (data.conversions / data.impressions) * 100 : 0;

    // Konfidenzintervall berechnen
    variant.confidenceInterval = this.calculateConfidenceInterval(
      variant.conversions,
      variant.impressions,
      test.confidenceLevel
    );

    test.updatedAt = new Date().toISOString();
    this.activeTests.set(testId, test);

    // Automatische Prüfung auf Signifikanz
    if (this.config.autoStopOnSignificance && test.status === 'running') {
      const currentResult = this.calculateTestResults(test);
      if (currentResult.winner.statisticalSignificance) {
        console.log(`🎯 Signifikantes Ergebnis für Test ${testId} - Auto-Stop ausgelöst`);
        await this.stopTest(testId);
      }
    }
  }

  /**
   * Aktiven A/B Test für einen bestimmten Typ abrufen
   */
  getActiveTest(type: string): ABTest | null {
    for (const test of this.activeTests.values()) {
      if (test.type === type && test.status === 'running') {
        return test;
      }
    }
    return null;
  }

  /**
   * Zufällige Variante für einen Test auswählen
   */
  selectVariant(testId: string): ABTestVariant | null {
    const test = this.activeTests.get(testId);
    if (!test || test.status !== 'running') {
      return null;
    }

    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of test.variants) {
      cumulative += variant.traffic;
      if (random <= cumulative) {
        return variant;
      }
    }

    return test.variants.length > 0 ? test.variants[0]! : null; // Fallback
  }

  /**
   * Test-Ergebnisse berechnen
   */
  private calculateTestResults(test: ABTest): ABTestResult {
    const controlVariant = test.variants.find(v => v.isControl);
    if (!controlVariant) {
      throw new Error('Keine Control-Variante gefunden');
    }

    const results = test.variants.map(variant => {
      const improvement = variant.isControl ? 0 :
        ((variant.conversionRate - controlVariant.conversionRate) / controlVariant.conversionRate) * 100;

      const pValue = this.calculatePValue(
        controlVariant.conversions,
        controlVariant.impressions,
        variant.conversions,
        variant.impressions
      );

      return {
        id: variant.id,
        name: variant.name,
        isControl: variant.isControl,
        participants: variant.impressions,
        conversions: variant.conversions,
        conversionRate: variant.conversionRate,
        improvement: variant.isControl ? 0 : improvement,
        pValue,
        confidenceInterval: variant.confidenceInterval
      };
    });

    // Besten Variante ermitteln
    const bestVariant = results.reduce((best, current) =>
      current.conversionRate > best.conversionRate ? current : best
    );

    const statisticalSignificance = (bestVariant.pValue || 1) < (1 - test.confidenceLevel / 100);

    const duration = test.startDate && test.endDate
      ? Math.ceil((new Date(test.endDate).getTime() - new Date(test.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const totalParticipants = results.reduce((sum, r) => sum + r.participants, 0);
    const totalConversions = results.reduce((sum, r) => sum + r.conversions, 0);

    // Empfehlungen generieren
    const recommendations = this.generateRecommendations(bestVariant, controlVariant, statisticalSignificance);

    return {
      testId: test.id,
      testName: test.name,
      status: test.status,
      duration,
      totalParticipants,
      totalConversions,
      winner: {
        variantId: bestVariant.id,
        variantName: bestVariant.name,
        conversionRate: bestVariant.conversionRate,
        improvement: bestVariant.improvement || 0,
        confidence: statisticalSignificance ? test.confidenceLevel : 0,
        statisticalSignificance
      },
      variants: results,
      recommendations
    };
  }

  /**
   * Konfidenzintervall berechnen
   */
  private calculateConfidenceInterval(conversions: number, impressions: number, confidenceLevel: number): { lower: number; upper: number } {
    if (impressions === 0) {
      return { lower: 0, upper: 0 };
    }

    const rate = conversions / impressions;
    const zScore = this.getZScore(confidenceLevel);
    const marginOfError = zScore * Math.sqrt((rate * (1 - rate)) / impressions);

    return {
      lower: Math.max(0, (rate - marginOfError) * 100),
      upper: Math.min(100, (rate + marginOfError) * 100)
    };
  }

  /**
   * P-Wert berechnen (Chi-Square Test)
   */
  private calculatePValue(controlConversions: number, controlImpressions: number,
                         variantConversions: number, variantImpressions: number): number {
    const controlRate = controlConversions / controlImpressions;
    const variantRate = variantConversions / variantImpressions;
    const pooledRate = (controlConversions + variantConversions) / (controlImpressions + variantImpressions);

    if (pooledRate === 0) return 1;

    const chiSquare = Math.pow(controlRate - variantRate, 2) *
                      (1 / pooledRate + 1 / pooledRate) *
                      (controlImpressions * variantImpressions) / (controlImpressions + variantImpressions);

    // Vereinfachte Chi-Square Verteilung (in echten Implementierungen würde man eine Bibliothek verwenden)
    return Math.max(0.001, 1 - this.chiSquareCDF(chiSquare, 1));
  }

  /**
   * Z-Score für Konfidenzlevel
   */
  private getZScore(confidenceLevel: number): number {
    const zScores: { [key: number]: number } = {
      90: 1.645,
      95: 1.96,
      99: 2.576
    };
    return zScores[confidenceLevel] || 1.96;
  }

  /**
   * Vereinfachte Chi-Square CDF
   */
  private chiSquareCDF(x: number, df: number): number {
    // Vereinfachte Implementierung - in echt würde man eine mathematische Bibliothek verwenden
    return Math.min(0.999, x / (x + df));
  }

  /**
   * Empfehlungen generieren
   */
  private generateRecommendations(winner: ABTestResultVariant, control: ABTestVariant, isSignificant: boolean): string[] {
    const recommendations: string[] = [];

    if (!isSignificant) {
      recommendations.push('⚠️ Das Testergebnis ist nicht statistisch signifikant. Erwarten Sie mehr Daten oder setzen Sie den Test fort.');
      recommendations.push('📊 Empfohlene Testdauer verlängern oder Stichprobengröße erhöhen.');
    } else {
      const improvement = winner.improvement || 0;

      if (improvement > 10) {
        recommendations.push(`🎉 Hervorragendes Ergebnis! ${improvement.toFixed(1)}% Verbesserung ist statistisch signifikant.`);
        recommendations.push('🚀 Implementieren Sie die Gewinnervariante sofort für maximale Ergebnisse.');
      } else if (improvement > 0) {
        recommendations.push(`✅ Positives Ergebnis: ${improvement.toFixed(1)}% Verbesserung ist statistisch signifikant.`);
        recommendations.push('💡 Implementieren Sie die Gewinnervariante, aber überwachen Sie die Performance.');
      } else {
        recommendations.push('🤔 Die Control-Variante hat gewonnen. Überprüfen Sie Ihre Hypothese.');
        recommendations.push('🔍 Analysieren Sie, warum die neue Variante nicht besser performt hat.');
      }
    }

    if ((winner.participants || 0) < 1000) {
      recommendations.push('📈 Erwägen Sie eine größere Stichprobe für robustere Ergebnisse.');
    }

    return recommendations;
  }

  // Helper Methods
  private mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'draft': 'Draft',
      'running': 'Running',
      'completed': 'Completed',
      'paused': 'Paused',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  private mapType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'popup': 'Popup',
      'banner': 'Banner',
      'landing_page': 'Landing Page',
      'call_to_action': 'Call to Action',
      'headline': 'Headline',
      'color_scheme': 'Color Scheme'
    };
    return typeMap[type] || type;
  }

  private async updateTestInNotion(testId: string, properties: NotionProperties): Promise<void> {
    try {
      await this.notion.pages.update({
        page_id: testId,
        properties: properties as any // eslint-disable-line @typescript-eslint/no-explicit-any
      });
    } catch (error) {
      console.warn('⚠️ Notion Update fehlgeschlagen:', error);
    }
  }

  private createTestLocalStorage(test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): string {
    const testId = 'test_' + Math.random().toString(36).substr(2, 9);
    const newTest: ABTest = {
      ...test,
      id: testId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.activeTests.set(testId, newTest);
    return testId;
  }

  /**
   * Beispiel-A/B Test erstellen
   */
  async createSampleTest(): Promise<string> {
    const sampleTest: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Black Friday Popup Headline Test',
      description: 'Test verschiedener Headlines für das Black Friday Popup',
      status: 'draft',
      type: 'popup',
      confidenceLevel: 95,
      minimumDetectableEffect: 15,
      variants: [
        {
          id: 'control',
          name: 'Control: 20% Rabatt auf alle Solaranlagen',
          description: 'Aktuelle Headline',
          isControl: true,
          traffic: 50,
          impressions: 0,
          conversions: 0,
          conversionRate: 0
        },
        {
          id: 'variant_a',
          name: 'Variant A: 🎉 Black Friday: Sichern Sie sich 20% Rabatt!',
          description: 'Mit Emoji und Call-to-Action',
          isControl: false,
          traffic: 50,
          impressions: 0,
          conversions: 0,
          conversionRate: 0
        }
      ],
      metrics: [
        {
          name: 'conversion_rate',
          type: 'conversion_rate',
          primary: true
        }
      ]
    };

    return this.createTest(sampleTest);
  }

  /**
   * Alle aktiven Tests abrufen
   */
  getActiveTests(): ABTest[] {
    return Array.from(this.activeTests.values()).filter(test => test.status === 'running');
  }

  /**
   * Test-Statistik abrufen
   */
  getTestStatistics(): {
    totalTests: number;
    runningTests: number;
    completedTests: number;
    averageTestDuration: number;
    totalParticipants: number;
  } {
    const allTests = Array.from(this.activeTests.values());
    const runningTests = allTests.filter(t => t.status === 'running');
    const completedTests = allTests.filter(t => t.status === 'completed');

    const _averageDuration = completedTests.length > 0
      ? completedTests.reduce((sum, test) => {
          if (test.startDate && test.endDate) {
            const duration = (new Date(test.endDate).getTime() - new Date(test.startDate).getTime()) / (1000 * 60 * 60 * 24);
            return sum + duration;
          }
          return sum;
        }, 0) / completedTests.length
      : 0;

    const totalParticipants = allTests.reduce((sum, test) =>
      sum + test.variants.reduce((variantSum, variant) => variantSum + variant.impressions, 0)
    , 0);

    return {
      totalTests: allTests.length,
      runningTests: runningTests.length,
      completedTests: completedTests.length,
      averageTestDuration: _averageDuration,
      totalParticipants
    };
  }
}

// Singleton instance
export const abTestingService = new ABTestingService();