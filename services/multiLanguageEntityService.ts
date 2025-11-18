import { singleton } from 'tsyringe';
import { CrossPlatformEntityConsistencyService, PlatformEntity } from './crossPlatformEntityConsistencyService';

export interface TranslatedEntity {
  entityId: string;
  language: string;
  translatedName: string;
  translatedDescription?: string;
  translatedAttributes: Record<string, any>;
  translationConfidence: number;
  lastTranslated: Date;
}

export interface LanguageAuthorityScore {
  language: string;
  entityId: string;
  authorityScore: number;
  factors: {
    backlinks: number;
    socialSignals: number;
    searchVolume: number;
    contentQuality: number;
    consistency: number;
  };
  lastCalculated: Date;
}

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  context?: string;
}

@singleton()
export class MultiLanguageEntityService {
  private translatedEntities: Map<string, TranslatedEntity[]> = new Map();
  private languageAuthorityScores: Map<string, LanguageAuthorityScore[]> = new Map();
  private supportedLanguages = ['de', 'en', 'fr', 'es', 'it', 'nl'];
  private translationCache: Map<string, string> = new Map();

  constructor(
    private crossPlatformService: CrossPlatformEntityConsistencyService
  ) {
    this.initializeTranslationPipeline();
    this.startAuthorityScoring();
  }

  /**
   * Initialisiert die automatische Translation Pipeline
   */
  private initializeTranslationPipeline(): void {
    // Starte periodische Translation-Updates
    setInterval(async () => {
      await this.performAutomatedTranslations();
    }, 3600000); // Alle Stunde
  }

  /**
   * Führt automatisierte Übersetzungen durch
   */
  private async performAutomatedTranslations(): Promise<void> {
    const allEntities = this.crossPlatformService.getAllEntities();

    for (const entity of allEntities) {
      for (const language of this.supportedLanguages) {
        if (language !== 'de') { // Deutsche als Basissprache
          await this.translateEntity(entity, language);
        }
      }
    }
  }

  /**
   * Übersetzt eine Entity in eine bestimmte Sprache
   */
  async translateEntity(entity: PlatformEntity, targetLanguage: string): Promise<TranslatedEntity> {
    const cacheKey = `${entity.entityId}_${targetLanguage}`;

    // Prüfe Cache
    if (this.translationCache.has(cacheKey)) {
      const cached = this.translatedEntities.get(entity.entityId)?.find(t => t.language === targetLanguage);
      if (cached) return cached;
    }

    try {
      // Übersetze Name
      const translatedName = await this.translateText({
        text: entity.entityName,
        fromLanguage: 'de',
        toLanguage: targetLanguage,
        context: 'entity_name'
      });

      // Übersetze Beschreibung falls vorhanden
      let translatedDescription: string | undefined;
      if (entity.attributes.description) {
        translatedDescription = await this.translateText({
          text: entity.attributes.description,
          fromLanguage: 'de',
          toLanguage: targetLanguage,
          context: 'entity_description'
        });
      }

      // Übersetze Attribute
      const translatedAttributes: Record<string, any> = {};
      for (const [key, value] of Object.entries(entity.attributes)) {
        if (typeof value === 'string' && this.shouldTranslateAttribute(key)) {
          translatedAttributes[key] = await this.translateText({
            text: value,
            fromLanguage: 'de',
            toLanguage: targetLanguage,
            context: `attribute_${key}`
          });
        } else {
          translatedAttributes[key] = value;
        }
      }

      const translatedEntity: TranslatedEntity = {
        entityId: entity.entityId,
        language: targetLanguage,
        translatedName,
        translatedDescription,
        translatedAttributes,
        translationConfidence: 0.95, // Mock-Konfidenz
        lastTranslated: new Date()
      };

      // Speichere in Cache
      if (!this.translatedEntities.has(entity.entityId)) {
        this.translatedEntities.set(entity.entityId, []);
      }
      this.translatedEntities.get(entity.entityId)!.push(translatedEntity);

      this.translationCache.set(cacheKey, translatedName);

      return translatedEntity;

    } catch (error) {
      console.error(`Fehler bei der Übersetzung der Entity ${entity.entityId} nach ${targetLanguage}:`, error);
      throw error;
    }
  }

  /**
   * Übersetzt Text mit KI-gestützter Pipeline
   */
  private async translateText(request: TranslationRequest): Promise<string> {
    // Mock-Translation für Demo-Zwecke
    // In Produktion würde hier eine echte Translation-API verwendet werden
    const translations: Record<string, Record<string, string>> = {
      'ZOE Solar GmbH': {
        'en': 'ZOE Solar GmbH',
        'fr': 'ZOE Solar GmbH',
        'es': 'ZOE Solar GmbH',
        'it': 'ZOE Solar GmbH',
        'nl': 'ZOE Solar GmbH'
      },
      'ZOE Solar Photovoltaik': {
        'en': 'ZOE Solar Photovoltaics',
        'fr': 'Photovoltaïque ZOE Solar',
        'es': 'Fotovoltaica ZOE Solar',
        'it': 'Fotovoltaico ZOE Solar',
        'nl': 'ZOE Solar Fotovoltaïsch'
      },
      'Ihr Partner für Photovoltaik und erneuerbare Energien': {
        'en': 'Your partner for photovoltaics and renewable energies',
        'fr': 'Votre partenaire pour la photovoltaïque et les énergies renouvelables',
        'es': 'Su socio para fotovoltaica y energías renovables',
        'it': 'Il vostro partner per fotovoltaico ed energie rinnovabili',
        'nl': 'Uw partner voor fotovoltaïsche en hernieuwbare energieën'
      }
    };

    // Fallback: Gib Originaltext zurück wenn keine Übersetzung verfügbar
    return translations[request.text]?.[request.toLanguage] || request.text;
  }

  /**
   * Prüft ob ein Attribut übersetzt werden sollte
   */
  private shouldTranslateAttribute(attributeKey: string): boolean {
    const translatableAttributes = ['description', 'category', 'services', 'about'];
    return translatableAttributes.includes(attributeKey);
  }

  /**
   * Berechnet language-specific Entity Authority Score
   */
  async calculateLanguageAuthorityScore(entityId: string, language: string): Promise<LanguageAuthorityScore> {
    const entity = this.crossPlatformService.getAllEntities().find(e => e.entityId === entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} nicht gefunden`);
    }

    // Mock-Berechnung der Authority-Faktoren
    const factors = {
      backlinks: this.calculateBacklinkScore(entity, language),
      socialSignals: this.calculateSocialSignals(entity, language),
      searchVolume: this.calculateSearchVolume(entity, language),
      contentQuality: this.calculateContentQuality(entity, language),
      consistency: this.calculateConsistencyScore(entity, language)
    };

    const authorityScore = (
      factors.backlinks * 0.3 +
      factors.socialSignals * 0.2 +
      factors.searchVolume * 0.2 +
      factors.contentQuality * 0.15 +
      factors.consistency * 0.15
    );

    const score: LanguageAuthorityScore = {
      language,
      entityId,
      authorityScore: Math.min(authorityScore, 100),
      factors,
      lastCalculated: new Date()
    };

    // Speichere Score
    if (!this.languageAuthorityScores.has(entityId)) {
      this.languageAuthorityScores.set(entityId, []);
    }
    const existingIndex = this.languageAuthorityScores.get(entityId)!.findIndex(s => s.language === language);
    if (existingIndex !== -1) {
      this.languageAuthorityScores.get(entityId)![existingIndex] = score;
    } else {
      this.languageAuthorityScores.get(entityId)!.push(score);
    }

    return score;
  }

  /**
   * Berechnet Backlink-Score für Sprache
   */
  private calculateBacklinkScore(entity: PlatformEntity, language: string): number {
    // Mock: Höherer Score für Deutsch und Englisch
    const languageMultipliers = { 'de': 1.0, 'en': 0.9, 'fr': 0.6, 'es': 0.5, 'it': 0.4, 'nl': 0.3 };
    return (entity.consistencyScore * (languageMultipliers[language] || 0.5)) / 2;
  }

  /**
   * Berechnet Social Signals für Sprache
   */
  private calculateSocialSignals(entity: PlatformEntity, language: string): number {
    // Mock: Basierend auf Plattform und Sprache
    const baseScore = entity.consistencyScore * 0.8;
    const languageBonus = language === 'de' ? 10 : language === 'en' ? 8 : 5;
    return Math.min(baseScore + languageBonus, 100);
  }

  /**
   * Berechnet Suchvolumen für Sprache
   */
  private calculateSearchVolume(entity: PlatformEntity, language: string): number {
    // Mock: Sprachabhängiges Suchvolumen
    const volumes = { 'de': 85, 'en': 90, 'fr': 60, 'es': 70, 'it': 50, 'nl': 40 };
    return volumes[language] || 50;
  }

  /**
   * Berechnet Content-Qualität für Sprache
   */
  private calculateContentQuality(entity: PlatformEntity, language: string): number {
    // Mock: Basierend auf verfügbaren übersetzten Inhalten
    const translatedEntity = this.translatedEntities.get(entity.entityId)?.find(t => t.language === language);
    return translatedEntity ? 90 : 60;
  }

  /**
   * Berechnet Konsistenz-Score für Sprache
   */
  private calculateConsistencyScore(entity: PlatformEntity, language: string): number {
    // Mock: Konsistenz basierend auf Übersetzungsqualität
    const translatedEntity = this.translatedEntities.get(entity.entityId)?.find(t => t.language === language);
    return translatedEntity ? translatedEntity.translationConfidence * 100 : 70;
  }

  /**
   * Startet periodisches Authority Scoring
   */
  private startAuthorityScoring(): void {
    setInterval(async () => {
      await this.updateAllAuthorityScores();
    }, 1800000); // Alle 30 Minuten
  }

  /**
   * Aktualisiert alle Authority Scores
   */
  private async updateAllAuthorityScores(): Promise<void> {
    const allEntities = this.crossPlatformService.getAllEntities();

    for (const entity of allEntities) {
      for (const language of this.supportedLanguages) {
        await this.calculateLanguageAuthorityScore(entity.entityId, language);
      }
    }
  }

  /**
   * Gibt alle übersetzten Entities für eine Entity zurück
   */
  getTranslatedEntities(entityId: string): TranslatedEntity[] {
    return this.translatedEntities.get(entityId) || [];
  }

  /**
   * Gibt Authority Scores für eine Entity zurück
   */
  getLanguageAuthorityScores(entityId: string): LanguageAuthorityScore[] {
    return this.languageAuthorityScores.get(entityId) || [];
  }

  /**
   * Gibt den besten Authority Score für eine Entity zurück
   */
  getBestAuthorityScore(entityId: string): LanguageAuthorityScore | null {
    const scores = this.getLanguageAuthorityScores(entityId);
    return scores.reduce((best, current) => current.authorityScore > best.authorityScore ? current : best, scores[0] || null);
  }

  /**
   * Gibt Multi-Language Report zurück
   */
  async getMultiLanguageReport(): Promise<{
    totalEntities: number;
    supportedLanguages: string[];
    translationCoverage: number;
    averageAuthorityScore: number;
    languageDistribution: Record<string, number>;
  }> {
    const allEntities = this.crossPlatformService.getAllEntities();
    const allScores: LanguageAuthorityScore[] = [];

    for (const entity of allEntities) {
      allScores.push(...this.getLanguageAuthorityScores(entity.entityId));
    }

    const languageDistribution: Record<string, number> = {};
    this.supportedLanguages.forEach(lang => {
      languageDistribution[lang] = allScores.filter(s => s.language === lang).length;
    });

    const averageAuthorityScore = allScores.length > 0
      ? allScores.reduce((sum, score) => sum + score.authorityScore, 0) / allScores.length
      : 0;

    const totalTranslations = Array.from(this.translatedEntities.values()).reduce((sum, translations) => sum + translations.length, 0);
    const translationCoverage = allEntities.length > 0 ? (totalTranslations / (allEntities.length * (this.supportedLanguages.length - 1))) * 100 : 0;

    return {
      totalEntities: allEntities.length,
      supportedLanguages: this.supportedLanguages,
      translationCoverage,
      averageAuthorityScore,
      languageDistribution
    };
  }
}