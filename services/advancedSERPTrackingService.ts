export interface SERPFeatureEntry {
  keyword: string;
  featureType: 'featured-snippet' | 'people-also-ask' | 'local-pack' | 'image-pack' | 'video' | 'knowledge-panel';
  position: number;
  url: string;
  locale: string;
  device: 'desktop' | 'mobile';
  lastUpdated: Date;
  performance: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  metadata?: Record<string, any>;
}

class AdvancedSERPTrackingService {
  private static instance: AdvancedSERPTrackingService;
  private serpFeatures: SERPFeatureEntry[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AdvancedSERPTrackingService {
    if (!AdvancedSERPTrackingService.instance) {
      AdvancedSERPTrackingService.instance = new AdvancedSERPTrackingService();
    }
    return AdvancedSERPTrackingService.instance;
  }

  private initializeSampleData(): void {
    const now = new Date();
    this.serpFeatures = [
      {
        keyword: 'photovoltaik installation',
        featureType: 'featured-snippet',
        position: 1,
        url: 'https://zoe-solar.de/photovoltaik',
        locale: 'de-DE',
        device: 'desktop',
        lastUpdated: now,
        performance: {
          impressions: 12500,
          clicks: 1800,
          ctr: 0.144
        },
        metadata: {
          snippetTitle: 'Photovoltaik Installation: In 5 Schritten zur Solaranlage'
        }
      },
      {
        keyword: 'solaranlage kosten',
        featureType: 'people-also-ask',
        position: 3,
        url: 'https://zoe-solar.de/kostenrechner',
        locale: 'de-DE',
        device: 'mobile',
        lastUpdated: now,
        performance: {
          impressions: 9800,
          clicks: 720,
          ctr: 0.073
        }
      },
      {
        keyword: 'agri pv',
        featureType: 'local-pack',
        position: 2,
        url: 'https://zoe-solar.de/agri-pv',
        locale: 'de-DE',
        device: 'desktop',
        lastUpdated: now,
        performance: {
          impressions: 5400,
          clicks: 430,
          ctr: 0.079
        },
        metadata: {
          location: 'Brandenburg'
        }
      }
    ];
  }

  public getAllSERPFeatures(): SERPFeatureEntry[] {
    return [...this.serpFeatures];
  }

  public addOrUpdateFeature(entry: SERPFeatureEntry): void {
    const existingIndex = this.serpFeatures.findIndex(feature =>
      feature.keyword === entry.keyword && feature.featureType === entry.featureType && feature.device === entry.device
    );

    if (existingIndex >= 0) {
      this.serpFeatures[existingIndex] = { ...entry, lastUpdated: new Date() };
    } else {
      this.serpFeatures.push({ ...entry, lastUpdated: new Date() });
    }
  }

  public getFeaturesByType(featureType: SERPFeatureEntry['featureType']): SERPFeatureEntry[] {
    return this.serpFeatures.filter(feature => feature.featureType === featureType);
  }
}

export const advancedSERPTrackingService = AdvancedSERPTrackingService.getInstance();
export default advancedSERPTrackingService;