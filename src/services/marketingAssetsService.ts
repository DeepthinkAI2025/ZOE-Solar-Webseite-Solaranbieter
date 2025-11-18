// eslint-disable @typescript-eslint/no-explicit-any
// Marketing Assets Service für ZOE Solar
// Verwaltung von Marketing-Bannern, Popups, Social Media Posts etc.

import { Client } from '@notionhq/client';
import type { PageObjectResponse, UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';

interface MarketingAsset {
  id?: string;
  assetName: string;
  assetType: 'banner' | 'popup' | 'social_media_post' | 'newsletter_template' | 'landing_page' | 'video' | 'infographic' | 'flyer' | 'webpage_content' | 'blog_post';
  category: 'brand_awareness' | 'lead_generation' | 'conversion' | 'retargeting' | 'content_marketing' | 'social_media' | 'email_marketing' | 'event_marketing';
  status: 'draft' | 'in_review' | 'approved' | 'active' | 'paused' | 'archived' | 'deleted';
  targetAudience: string[];
  startDate?: string;
  endDate?: string;
  season?: string;
  headline?: string;
  subline?: string;
  callToAction?: string;
  targetUrl?: string;
  mainImageUrl?: string;
  additionalAssets?: string[];
  colorScheme?: string;
  impressions?: number;
  clicks?: number;
  conversionRate?: number;
  budget?: number;
  roi?: number;
  abTestActive?: boolean;
  variant?: string;
  testStatus?: string;
  channels?: string[];
  assignedTo?: string[];
  designer?: string[];
  copywriter?: string[];
  deadline?: string;
  description?: string;
  notes?: string;
}

interface MarketingMetrics {
  totalActiveAssets: number;
  totalImpressions: number;
  totalClicks: number;
  averageConversionRate: number;
  totalBudget: number;
  totalROI: number;
  assetsByType: Record<string, number>;
  assetsByStatus: Record<string, number>;
  topPerformingAssets: Array<{
    id: string;
    name: string;
    conversionRate: number;
    roi: number;
  }>;
  currentCampaigns: Array<{
    id: string;
    name: string;
    status: string;
    endDate: string;
  }>;
}

class MarketingAssetsService {
  private notion: Client;
  private databaseId: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 Minuten

  constructor() {
    this.notion = new Client({
      auth: process.env.VITE_NOTION_TOKEN,
    });
    this.databaseId = process.env.VITE_NOTION_MARKETING_ASSETS_DB || '';
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    return cached ? cached.data as T : null;
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of Array.from(this.cache.keys())) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Erstellt ein neues Marketing Asset
   */
  async createAsset(asset: Omit<MarketingAsset, 'id'>): Promise<string> {
    try {
      const notionPage = {
        parent: {
          type: 'database_id' as const,
          database_id: this.databaseId
        },
        properties: {
          'Asset Name': {
            title: [
              { text: { content: asset.assetName } }
            ]
          },
          'Asset Typ': {
            select: { name: this.mapAssetType(asset.assetType) }
          },
          'Kategorie': {
            select: { name: this.mapCategory(asset.category) }
          },
          'Status': {
            select: { name: this.mapStatus(asset.status) }
          },
          'Zielgruppe': {
            multi_select: asset.targetAudience.map(audience => ({ name: audience }))
          },
          ...(asset.startDate && {
            'Startdatum': {
              date: { start: asset.startDate }
            }
          }),
          ...(asset.endDate && {
            'Enddatum': {
              date: { start: asset.endDate }
            }
          }),
          ...(asset.season && {
            'Saison': {
              select: { name: asset.season }
            }
          }),
          ...(asset.headline && {
            'Headline': {
              rich_text: [
                { text: { content: asset.headline } }
              ]
            }
          }),
          ...(asset.subline && {
            'Subline': {
              rich_text: [
                { text: { content: asset.subline } }
              ]
            }
          }),
          ...(asset.callToAction && {
            'Call-to-Action': {
              rich_text: [
                { text: { content: asset.callToAction } }
              ]
            }
          }),
          ...(asset.targetUrl && {
            'Ziel-URL': {
              url: asset.targetUrl
            }
          }),
          ...(asset.mainImageUrl && {
            'Hauptbild/Datei': {
              files: [
                {
                  type: 'external' as const,
                  name: 'Hauptbild',
                  external: { url: asset.mainImageUrl }
                }
              ]
            }
          }),
          ...(asset.colorScheme && {
            'Farbschema': {
              rich_text: [
                { text: { content: asset.colorScheme } }
              ]
            }
          }),
          ...(asset.impressions !== undefined && {
            'Impressions': {
              number: asset.impressions
            }
          }),
          ...(asset.clicks !== undefined && {
            'Klicks': {
              number: asset.clicks
            }
          }),
          ...(asset.conversionRate !== undefined && {
            'Conversion Rate (%)': {
              number: asset.conversionRate
            }
          }),
          ...(asset.budget !== undefined && {
            'Budget (€)': {
              number: asset.budget
            }
          }),
          ...(asset.roi !== undefined && {
            'ROI': {
              number: asset.roi
            }
          }),
          ...(asset.abTestActive !== undefined && {
            'A/B Test Aktiv': {
              checkbox: asset.abTestActive
            }
          }),
          ...(asset.variant && {
            'Variante': {
              select: { name: asset.variant }
            }
          }),
          ...(asset.testStatus && {
            'Test Status': {
              select: { name: asset.testStatus }
            }
          }),
          ...(asset.channels && asset.channels.length > 0 && {
            'Kanäle': {
              multi_select: asset.channels.map(channel => ({ name: channel }))
            }
          }),
          ...(asset.assignedTo && asset.assignedTo.length > 0 && {
            'Verantwortlich': {
              people: asset.assignedTo.map(id => ({ id }))
            }
          }),
          ...(asset.designer && asset.designer.length > 0 && {
            'Designer': {
              people: asset.designer.map(id => ({ id }))
            }
          }),
          ...(asset.copywriter && asset.copywriter.length > 0 && {
            'Texter': {
              people: asset.copywriter.map(id => ({ id }))
            }
          }),
          ...(asset.deadline && {
            'Frist': {
              date: { start: asset.deadline }
            }
          }),
          ...(asset.description && {
            'Beschreibung': {
              rich_text: [
                { text: { content: asset.description } }
              ]
            }
          }),
          ...(asset.notes && {
            'Notizen': {
              rich_text: [
                { text: { content: asset.notes } }
              ]
            }
          })
        }
      };

      const response = await this.notion.pages.create(notionPage);

      // Cache leeren
      this.clearCache();

      console.log('✅ Marketing Asset erstellt:', response.id);
      return response.id;

    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Marketing Assets:', error);
      throw new Error('Marketing Asset konnte nicht erstellt werden');
    }
  }

  /**
   * Ruft alle Marketing Assets ab
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async getAssets(filter?: {
    status?: string;
    assetType?: string;
    category?: string;
    targetAudience?: string;
  }): Promise<MarketingAsset[]> {
    try {
      const cacheKey = `assets_${JSON.stringify(filter || {})}`;

      if (this.isCacheValid(cacheKey)) {
        const cached = this.getCache<MarketingAsset[]>(cacheKey);
        return cached || [];
      }

      let filterProperties: Array<{
        property: string;
        select?: { equals: string };
        multi_select?: { contains: string };
      }> = [];

      if (filter?.status) {
        filterProperties.push({
          property: 'Status',
          select: {
            equals: this.mapStatus(filter.status)
          }
        });
      }

      if (filter?.assetType) {
        filterProperties.push({
          property: 'Asset Typ',
          select: {
            equals: this.mapAssetType(filter.assetType)
          }
        });
      }

      if (filter?.category) {
        filterProperties.push({
          property: 'Kategorie',
          select: {
            equals: this.mapCategory(filter.category)
          }
        });
      }

      if (filter?.targetAudience) {
        filterProperties.push({
          property: 'Zielgruppe',
          multi_select: {
            contains: filter.targetAudience
          }
        });
      }

      const response = await this.notion.dataSources.query({
        data_source_id: this.databaseId,
        filter: filterProperties.length > 0 ? {
          and: filterProperties as any
        } : undefined,
        sorts: [
          {
            property: 'Erstellt am',
            direction: 'descending'
          }
        ]
      });

      const assets = response.results
        .filter((item): item is PageObjectResponse => 'properties' in item)
        .map((page: PageObjectResponse) => this.mapNotionPageToAsset(page));

      this.setCache(cacheKey, assets);
      return assets;

    } catch (error) {
      console.error('❌ Fehler beim Abrufen der Marketing Assets:', error);
      throw new Error('Marketing Assets konnten nicht abgerufen werden');
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  /**
   * Aktualisiert ein existierendes Marketing Asset
   */
  async updateAsset(id: string, updates: Partial<MarketingAsset>): Promise<void> {
    try {
      const updateData: NonNullable<UpdatePageParameters['properties']> = {};

      if (updates.assetName) {
        updateData['Asset Name'] = {
          title: [
            { text: { content: updates.assetName } }
          ]
        };
      }

      if (updates.status) {
        updateData['Status'] = {
          select: { name: this.mapStatus(updates.status) }
        };
      }

      if (updates.headline) {
        updateData['Headline'] = {
          rich_text: [
            { text: { content: updates.headline } }
          ]
        };
      }

      if (updates.subline) {
        updateData['Subline'] = {
          rich_text: [
            { text: { content: updates.subline } }
          ]
        };
      }

      if (updates.callToAction) {
        updateData['Call-to-Action'] = {
          rich_text: [
            { text: { content: updates.callToAction } }
          ]
        };
      }

      if (updates.targetUrl) {
        updateData['Ziel-URL'] = {
          url: updates.targetUrl
        };
      }

      if (updates.impressions !== undefined) {
        updateData['Impressions'] = {
          number: updates.impressions
        };
      }

      if (updates.clicks !== undefined) {
        updateData['Klicks'] = {
          number: updates.clicks
        };
      }

      if (updates.conversionRate !== undefined) {
        updateData['Conversion Rate (%)'] = {
          number: updates.conversionRate
        };
      }

      if (updates.roi !== undefined) {
        updateData['ROI'] = {
          number: updates.roi
        };
      }

      if (updates.testStatus) {
        updateData['Test Status'] = {
          select: { name: updates.testStatus }
        };
      }

      if (updates.notes) {
        updateData['Notizen'] = {
          rich_text: [
            { text: { content: updates.notes } }
          ]
        };
      }

      await this.notion.pages.update({
        page_id: id,
        properties: updateData
      });

      // Cache leeren
      this.clearCache();

      console.log('✅ Marketing Asset aktualisiert:', id);

    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren des Marketing Assets:', error);
      throw new Error('Marketing Asset konnte nicht aktualisiert werden');
    }
  }

  /**
   * Ruft Marketing Metrics ab
   */
  async getMetrics(): Promise<MarketingMetrics> {
    try {
      const cacheKey = 'marketing_metrics';

      if (this.isCacheValid(cacheKey)) {
        const cached = this.getCache<MarketingMetrics>(cacheKey);
        return cached!;
      }

      const allAssets = await this.getAssets();
      const now = new Date();

      const totalActiveAssets = allAssets.filter(asset => asset.status === 'active').length;
      const totalImpressions = allAssets.reduce((sum, asset) => sum + (asset.impressions || 0), 0);
      const totalClicks = allAssets.reduce((sum, asset) => sum + (asset.clicks || 0), 0);
      const averageConversionRate = allAssets.length > 0
        ? allAssets.reduce((sum, asset) => sum + (asset.conversionRate || 0), 0) / allAssets.length
        : 0;
      const totalBudget = allAssets.reduce((sum, asset) => sum + (asset.budget || 0), 0);
      const totalROI = allAssets.reduce((sum, asset) => sum + (asset.roi || 0), 0);

      // Assets by Type
      const assetsByType: Record<string, number> = {};
      allAssets.forEach(asset => {
        if (asset.assetType) {
          assetsByType[asset.assetType] = (assetsByType[asset.assetType] || 0) + 1;
        }
      });

      // Assets by Status
      const assetsByStatus: Record<string, number> = {};
      allAssets.forEach(asset => {
        if (asset.status) {
          assetsByStatus[asset.status] = (assetsByStatus[asset.status] || 0) + 1;
        }
      });

      // Top Performing Assets
      const topPerformingAssets = allAssets
        .filter(asset => asset.conversionRate && asset.conversionRate > 0)
        .sort((a, b) => (b.conversionRate || 0) - (a.conversionRate || 0))
        .slice(0, 5)
        .map(asset => ({
          id: asset.id || '',
          name: asset.assetName,
          conversionRate: asset.conversionRate || 0,
          roi: asset.roi || 0
        }));

      // Current Campaigns
      const currentCampaigns = allAssets
        .filter(asset => asset.status === 'active' && asset.endDate && new Date(asset.endDate) > now)
        .slice(0, 10)
        .map(asset => ({
          id: asset.id || '',
          name: asset.assetName,
          status: asset.status,
          endDate: asset.endDate || ''
        }));

      const metrics: MarketingMetrics = {
        totalActiveAssets,
        totalImpressions,
        totalClicks,
        averageConversionRate,
        totalBudget,
        totalROI,
        assetsByType,
        assetsByStatus,
        topPerformingAssets,
        currentCampaigns
      };

      this.setCache(cacheKey, metrics);
      return metrics;

    } catch (error) {
      console.error('❌ Fehler beim Abrufen der Marketing Metrics:', error);
      throw new Error('Marketing Metrics konnten nicht abgerufen werden');
    }
  }

  /**
   * Sucht nach Assets basierend auf Namen oder Beschreibung
   */
  async searchAssets(query: string): Promise<MarketingAsset[]> {
    try {
      const allAssets = await this.getAssets();

      return allAssets.filter(asset =>
        asset.assetName.toLowerCase().includes(query.toLowerCase()) ||
        (asset.description && asset.description.toLowerCase().includes(query.toLowerCase())) ||
        (asset.headline && asset.headline.toLowerCase().includes(query.toLowerCase()))
      );

    } catch (error) {
      console.error('❌ Fehler bei der Asset-Suche:', error);
      throw new Error('Asset-Suche fehlgeschlagen');
    }
  }

  private mapAssetType(type: string): string {
    const typeMap: Record<string, string> = {
      'banner': 'Banner',
      'popup': 'Popup',
      'social_media_post': 'Social Media Post',
      'newsletter_template': 'Newsletter Template',
      'landing_page': 'Landing Page',
      'video': 'Video',
      'infographic': 'Infografik',
      'flyer': 'Flyer/Drucksache',
      'webpage_content': 'Webseite Content',
      'blog_post': 'Blog Post'
    };
    return typeMap[type] || type;
  }

  private mapCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'brand_awareness': 'Brand Awareness',
      'lead_generation': 'Lead Generation',
      'conversion': 'Conversion',
      'retargeting': 'Retargeting',
      'content_marketing': 'Content Marketing',
      'social_media': 'Social Media',
      'email_marketing': 'Email Marketing',
      'event_marketing': 'Event Marketing'
    };
    return categoryMap[category] || category;
  }

  private mapStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'Entwurf',
      'in_review': 'In Review',
      'approved': 'Approved',
      'active': 'Aktiv',
      'paused': 'Paused',
      'archived': 'Archiviert',
      'deleted': 'Gelöscht'
    };
    return statusMap[status] || status;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private mapNotionPageToAsset(page: PageObjectResponse): MarketingAsset {
    const properties = page.properties;

    return {
      id: page.id,
      assetName: (properties['Asset Name'] as any)?.title?.[0]?.plain_text || '',
      assetType: this.mapAssetTypeReverse((properties['Asset Typ'] as any)?.select?.name || '') as MarketingAsset['assetType'],
      category: this.mapCategoryReverse((properties['Kategorie'] as any)?.select?.name || '') as MarketingAsset['category'],
      status: this.mapStatusReverse((properties['Status'] as any)?.select?.name || '') as MarketingAsset['status'],
      targetAudience: (properties['Zielgruppe'] as any)?.multi_select?.map((item: { name: string }) => item.name) || [],
      startDate: (properties['Startdatum'] as any)?.date?.start,
      endDate: (properties['Enddatum'] as any)?.date?.start,
      season: (properties['Saison'] as any)?.select?.name,
      headline: (properties['Headline'] as any)?.rich_text?.[0]?.plain_text,
      subline: (properties['Subline'] as any)?.rich_text?.[0]?.plain_text,
      callToAction: (properties['Call-to-Action'] as any)?.rich_text?.[0]?.plain_text,
      targetUrl: (properties['Ziel-URL'] as any)?.url,
      mainImageUrl: (properties['Hauptbild/Datei'] as any)?.files?.[0]?.external?.url,
      additionalAssets: (properties['Weitere Assets'] as any)?.files?.map((file: { external?: { url: string } }) => file.external?.url) || [],
      colorScheme: (properties['Farbschema'] as any)?.rich_text?.[0]?.plain_text,
      impressions: (properties['Impressions'] as any)?.number,
      clicks: (properties['Klicks'] as any)?.number,
      conversionRate: (properties['Conversion Rate (%)'] as any)?.number,
      budget: (properties['Budget (€)'] as any)?.number,
      roi: (properties['ROI'] as any)?.number,
      abTestActive: (properties['A/B Test Aktiv'] as any)?.checkbox,
      variant: (properties['Variante'] as any)?.select?.name,
      testStatus: (properties['Test Status'] as any)?.select?.name,
      channels: (properties['Kanäle'] as any)?.multi_select?.map((item: { name: string }) => item.name) || [],
      assignedTo: (properties['Verantwortlich'] as any)?.people?.map((person: { id: string }) => person.id) || [],
      designer: (properties['Designer'] as any)?.people?.map((person: { id: string }) => person.id) || [],
      copywriter: (properties['Texter'] as any)?.people?.map((person: { id: string }) => person.id) || [],
      deadline: (properties['Frist'] as any)?.date?.start,
      description: (properties['Beschreibung'] as any)?.rich_text?.[0]?.plain_text,
      notes: (properties['Notizen'] as any)?.rich_text?.[0]?.plain_text
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  private mapAssetTypeReverse(type: string): string {
    const typeMap: Record<string, string> = {
      'Banner': 'banner',
      'Popup': 'popup',
      'Social Media Post': 'social_media_post',
      'Newsletter Template': 'newsletter_template',
      'Landing Page': 'landing_page',
      'Video': 'video',
      'Infografik': 'infographic',
      'Flyer/Drucksache': 'flyer',
      'Webseite Content': 'webpage_content',
      'Blog Post': 'blog_post'
    };
    return typeMap[type] || type;
  }

  private mapCategoryReverse(category: string): string {
    const categoryMap: Record<string, string> = {
      'Brand Awareness': 'brand_awareness',
      'Lead Generation': 'lead_generation',
      'Conversion': 'conversion',
      'Retargeting': 'retargeting',
      'Content Marketing': 'content_marketing',
      'Social Media': 'social_media',
      'Email Marketing': 'email_marketing',
      'Event Marketing': 'event_marketing'
    };
    return categoryMap[category] || category;
  }

  private mapStatusReverse(status: string): string {
    const statusMap: Record<string, string> = {
      'Entwurf': 'draft',
      'In Review': 'in_review',
      'Approved': 'approved',
      'Aktiv': 'active',
      'Paused': 'paused',
      'Archiviert': 'archived',
      'Gelöscht': 'deleted'
    };
    return statusMap[status] || status;
  }
}

// Singleton instance
export const marketingAssetsService = new MarketingAssetsService();

// Export types
export type { MarketingAsset, MarketingMetrics };