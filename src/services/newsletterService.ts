// Newsletter Service für ZOE Solar
// Bidirektionale Synchronisation zwischen Website und Notion Newsletter-Datenbank

import { Client } from '@notionhq/client';

interface NewsletterLead {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  customerType?: 'private' | 'commercial' | 'agricultural' | 'industrial' | 'partner' | 'unknown';
  leadSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  interests?: string[];
  projectSize?: number;
  location?: string;
  status?: string;
  leadScore?: number;
  priority?: string;
  newsletterSubscription?: boolean;
  newsletterStatus?: string;
  notes?: string;
  assignedTo?: string[];
  lastContact?: string;
  nextFollowUp?: string;
}

interface NewsletterMetrics {
  totalSubscribers: number;
  newLeadsToday: number;
  newLeadsWeek: number;
  conversionRate: number;
  leadsBySource: Record<string, number>;
  leadsByCustomerType: Record<string, number>;
  topInterests: Array<{ interest: string; count: number }>;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

interface NotionFilterProperty {
  property: string;
  select?: { equals: string };
  checkbox?: { equals: boolean };
}

interface NotionPageProperties {
  Email?: { title?: Array<{ plain_text?: string }> };
  Name?: { rich_text?: Array<{ plain_text?: string }> };
  Telefon?: { phone?: string };
  Unternehmen?: { rich_text?: Array<{ plain_text?: string }> };
  Kundentyp?: { select?: { name?: string } };
  'Lead-Quelle'?: { select?: { name?: string } };
  'UTM Source'?: { rich_text?: Array<{ plain_text?: string }> };
  'UTM Medium'?: { rich_text?: Array<{ plain_text?: string }> };
  'UTM Campaign'?: { rich_text?: Array<{ plain_text?: string }> };
  'Interessiert an'?: { multi_select?: Array<{ name?: string }> };
  'Projektgröße (kWp)'?: { number?: number };
  Standort?: { rich_text?: Array<{ plain_text?: string }> };
  Status?: { select?: { name?: string } };
  'Lead-Score'?: { number?: number };
  Priorität?: { select?: { name?: string } };
  'Newsletter Abonnement'?: { checkbox?: boolean };
  'Newsletter Status'?: { select?: { name?: string } };
  Notizen?: { rich_text?: Array<{ plain_text?: string }> };
  Zuständig?: { people?: Array<{ id?: string }> };
  'Letzter Kontakt'?: { date?: { start?: string } };
  'Nächster Follow-up'?: { date?: { start?: string } };
}

interface NotionPage {
  id: string;
  properties: NotionPageProperties;
}

class NewsletterService {
  private notion: Client;
  private databaseId: string;
  private cache: Map<string, CachedData<unknown>> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 Minuten

  constructor() {
    this.notion = new Client({
      auth: import.meta.env.VITE_NOTION_TOKEN,
    });
    this.databaseId = import.meta.env.VITE_NOTION_NEWSLETTER_DB || '';
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
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Erstellt einen neuen Newsletter Lead in Notion
   */
  async createLead(lead: Omit<NewsletterLead, 'id'>): Promise<string> {
    try {
      const notionPage = {
        parent: {
          type: 'database_id',
          database_id: this.databaseId
        },
        properties: {
          'Email': {
            title: [
              { text: { content: lead.email } }
            ]
          },
          ...(lead.name && {
            'Name': {
              rich_text: [
                { text: { content: lead.name } }
              ]
            }
          }),
          ...(lead.phone && {
            'Telefon': {
              phone: lead.phone
            }
          }),
          ...(lead.company && {
            'Unternehmen': {
              rich_text: [
                { text: { content: lead.company } }
              ]
            }
          }),
          ...(lead.customerType && {
            'Kundentyp': {
              select: {
                name: this.mapCustomerType(lead.customerType)
              }
            }
          }),
          ...(lead.leadSource && {
            'Lead-Quelle': {
              select: { name: lead.leadSource }
            }
          }),
          ...(lead.utmSource && {
            'UTM Source': {
              rich_text: [
                { text: { content: lead.utmSource } }
              ]
            }
          }),
          ...(lead.utmMedium && {
            'UTM Medium': {
              rich_text: [
                { text: { content: lead.utmMedium } }
              ]
            }
          }),
          ...(lead.utmCampaign && {
            'UTM Campaign': {
              rich_text: [
                { text: { content: lead.utmCampaign } }
              ]
            }
          }),
          ...(lead.interests && lead.interests.length > 0 && {
            'Interessiert an': {
              multi_select: lead.interests.map(interest => ({ name: interest }))
            }
          }),
          ...(lead.projectSize && {
            'Projektgröße (kWp)': {
              number: lead.projectSize
            }
          }),
          ...(lead.location && {
            'Standort': {
              rich_text: [
                { text: { content: lead.location } }
              ]
            }
          }),
          ...(lead.status && {
            'Status': {
              select: { name: lead.status }
            }
          }),
          ...(lead.leadScore && {
            'Lead-Score': {
              number: lead.leadScore
            }
          }),
          ...(lead.priority && {
            'Priorität': {
              select: { name: lead.priority }
            }
          }),
          ...(lead.newsletterSubscription !== undefined && {
            'Newsletter Abonnement': {
              checkbox: lead.newsletterSubscription
            }
          }),
          ...(lead.newsletterStatus && {
            'Newsletter Status': {
              select: { name: lead.newsletterStatus }
            }
          }),
          ...(lead.notes && {
            'Notizen': {
              rich_text: [
                { text: { content: lead.notes } }
              ]
            }
          }),
          ...(lead.assignedTo && lead.assignedTo.length > 0 && {
            'Zuständig': {
              people: lead.assignedTo.map(id => ({ id }))
            }
          }),
          ...(lead.lastContact && {
            'Letzter Kontakt': {
              date: { start: lead.lastContact }
            }
          }),
          ...(lead.nextFollowUp && {
            'Nächster Follow-up': {
              date: { start: lead.nextFollowUp }
            }
          })
        }
      };

      const response = await this.notion.pages.create(notionPage);

      // Cache leeren
      this.clearCache();

      console.log('✅ Newsletter Lead erstellt:', response.id);
      return response.id;

    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Newsletter Leads:', error);
      throw new Error('Newsletter Lead konnte nicht erstellt werden');
    }
  }

  /**
   * Ruft alle Newsletter Leads ab
   */
  async getLeads(filter?: {
    status?: string;
    customerType?: string;
    leadSource?: string;
    newsletterSubscription?: boolean;
  }): Promise<NewsletterLead[]> {
    try {
      const cacheKey = `leads_${JSON.stringify(filter || {})}`;

      if (this.isCacheValid(cacheKey)) {
        const cached = this.getCache<NewsletterLead[]>(cacheKey);
        return cached || [];
      }

      let filterProperties: NotionFilterProperty[] = [];

      if (filter?.status) {
        filterProperties.push({
          property: 'Status',
          select: {
            equals: filter.status
          }
        });
      }

      if (filter?.customerType) {
        filterProperties.push({
          property: 'Kundentyp',
          select: {
            equals: this.mapCustomerType(filter.customerType)
          }
        });
      }

      if (filter?.leadSource) {
        filterProperties.push({
          property: 'Lead-Quelle',
          select: {
            equals: filter.leadSource
          }
        });
      }

      if (filter?.newsletterSubscription !== undefined) {
        filterProperties.push({
          property: 'Newsletter Abonnement',
          checkbox: {
            equals: filter.newsletterSubscription
          }
        });
      }

      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: filterProperties.length > 0 ? {
          and: filterProperties
        } : undefined,
        sorts: [
          {
            property: 'Erstellt am',
            direction: 'descending'
          }
        ]
      });

      const leads = response.results.map((page: NotionPage) => this.mapNotionPageToLead(page));

      this.setCache(cacheKey, leads);
      return leads;

    } catch (error) {
      console.error('❌ Fehler beim Abrufen der Newsletter Leads:', error);
      throw new Error('Newsletter Leads konnten nicht abgerufen werden');
    }
  }

  /**
   * Aktualisiert einen existierenden Lead
   */
  async updateLead(id: string, updates: Partial<NewsletterLead>): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {};

      if (updates.name) {
        updateData['Name'] = {
          rich_text: [
            { text: { content: updates.name } }
          ]
        };
      }

      if (updates.phone) {
        updateData['Telefon'] = {
          phone: updates.phone
        };
      }

      if (updates.company) {
        updateData['Unternehmen'] = {
          rich_text: [
            { text: { content: updates.company } }
          ]
        };
      }

      if (updates.customerType) {
        updateData['Kundentyp'] = {
          select: { name: this.mapCustomerType(updates.customerType) }
        };
      }

      if (updates.status) {
        updateData['Status'] = {
          select: { name: updates.status }
        };
      }

      if (updates.leadScore) {
        updateData['Lead-Score'] = {
          number: updates.leadScore
        };
      }

      if (updates.priority) {
        updateData['Priorität'] = {
          select: { name: updates.priority }
        };
      }

      if (updates.newsletterSubscription !== undefined) {
        updateData['Newsletter Abonnement'] = {
          checkbox: updates.newsletterSubscription
        };
      }

      if (updates.newsletterStatus) {
        updateData['Newsletter Status'] = {
          select: { name: updates.newsletterStatus }
        };
      }

      if (updates.notes) {
        updateData['Notizen'] = {
          rich_text: [
            { text: { content: updates.notes } }
          ]
        };
      }

      if (updates.lastContact) {
        updateData['Letzter Kontakt'] = {
          date: { start: updates.lastContact }
        };
      }

      if (updates.nextFollowUp) {
        updateData['Nächster Follow-up'] = {
          date: { start: updates.nextFollowUp }
        };
      }

      await this.notion.pages.update({
        page_id: id,
        properties: updateData
      });

      // Cache leeren
      this.clearCache();

      console.log('✅ Newsletter Lead aktualisiert:', id);

    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren des Newsletter Leads:', error);
      throw new Error('Newsletter Lead konnte nicht aktualisiert werden');
    }
  }

  /**
   * Ruft Newsletter Metrics ab
   */
  async getMetrics(): Promise<NewsletterMetrics> {
    try {
      const cacheKey = 'newsletter_metrics';

      if (this.isCacheValid(cacheKey)) {
        const cached = this.getCache<NewsletterMetrics>(cacheKey);
        return cached!;
      }

      const allLeads = await this.getLeads();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const newLeadsToday = allLeads.filter(lead =>
        lead.id && new Date(lead.id.slice(-13)).getTime() >= today.getTime()
      ).length;

      const newLeadsWeek = allLeads.filter(lead =>
        lead.id && new Date(lead.id.slice(-13)).getTime() >= weekAgo.getTime()
      ).length;

      const newsletterSubscribers = allLeads.filter(lead => lead.newsletterSubscription).length;
      const conversionRate = allLeads.length > 0 ? (newsletterSubscribers / allLeads.length) * 100 : 0;

      // Leads by Source
      const leadsBySource: Record<string, number> = {};
      allLeads.forEach(lead => {
        if (lead.leadSource) {
          leadsBySource[lead.leadSource] = (leadsBySource[lead.leadSource] || 0) + 1;
        }
      });

      // Leads by Customer Type
      const leadsByCustomerType: Record<string, number> = {};
      allLeads.forEach(lead => {
        if (lead.customerType) {
          leadsByCustomerType[lead.customerType] = (leadsByCustomerType[lead.customerType] || 0) + 1;
        }
      });

      // Top Interests
      const interestCounts: Record<string, number> = {};
      allLeads.forEach(lead => {
        if (lead.interests) {
          lead.interests.forEach(interest => {
            interestCounts[interest] = (interestCounts[interest] || 0) + 1;
          });
        }
      });

      const topInterests = Object.entries(interestCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([interest, count]) => ({ interest, count }));

      const metrics: NewsletterMetrics = {
        totalSubscribers: newsletterSubscribers,
        newLeadsToday,
        newLeadsWeek,
        conversionRate,
        leadsBySource,
        leadsByCustomerType,
        topInterests
      };

      this.setCache(cacheKey, metrics);
      return metrics;

    } catch (error) {
      console.error('❌ Fehler beim Abrufen der Newsletter Metrics:', error);
      throw new Error('Newsletter Metrics konnten nicht abgerufen werden');
    }
  }

  /**
   * Sucht nach Leads basierend auf E-Mail oder Namen
   */
  async searchLeads(query: string): Promise<NewsletterLead[]> {
    try {
      const allLeads = await this.getLeads();

      return allLeads.filter(lead =>
        lead.email.toLowerCase().includes(query.toLowerCase()) ||
        (lead.name && lead.name.toLowerCase().includes(query.toLowerCase())) ||
        (lead.company && lead.company.toLowerCase().includes(query.toLowerCase()))
      );

    } catch (error) {
      console.error('❌ Fehler bei der Lead-Suche:', error);
      throw new Error('Lead-Suche fehlgeschlagen');
    }
  }

  private mapCustomerType(type: string): string {
    const typeMap: Record<string, string> = {
      'private': 'Privat',
      'commercial': 'Gewerbe',
      'agricultural': 'Landwirtschaft',
      'industrial': 'Industrie',
      'partner': 'Partner',
      'unknown': 'Unbekannt'
    };
    return typeMap[type] || 'Unbekannt';
  }

  private mapNotionPageToLead(page: NotionPage): NewsletterLead {
    const properties = page.properties;

    return {
      id: page.id,
      email: properties.Email?.title?.[0]?.plain_text || '',
      name: properties.Name?.rich_text?.[0]?.plain_text,
      phone: properties.Telefon?.phone,
      company: properties.Unternehmen?.rich_text?.[0]?.plain_text,
      customerType: properties.Kundentyp?.select?.name as NewsletterLead['customerType'],
      leadSource: properties['Lead-Quelle']?.select?.name,
      utmSource: properties['UTM Source']?.rich_text?.[0]?.plain_text,
      utmMedium: properties['UTM Medium']?.rich_text?.[0]?.plain_text,
      utmCampaign: properties['UTM Campaign']?.rich_text?.[0]?.plain_text,
      interests: properties['Interessiert an']?.multi_select?.map((item) => item.name || '') || [],
      projectSize: properties['Projektgröße (kWp)']?.number,
      location: properties.Standort?.rich_text?.[0]?.plain_text,
      status: properties.Status?.select?.name,
      leadScore: properties['Lead-Score']?.number,
      priority: properties.Priorität?.select?.name,
      newsletterSubscription: properties['Newsletter Abonnement']?.checkbox,
      newsletterStatus: properties['Newsletter Status']?.select?.name,
      notes: properties.Notizen?.rich_text?.[0]?.plain_text,
      assignedTo: properties.Zuständig?.people?.map((person) => person.id || '') || [],
      lastContact: properties['Letzter Kontakt']?.date?.start,
      nextFollowUp: properties['Nächster Follow-up']?.date?.start
    };
  }
}

// Singleton instance
export const newsletterService = new NewsletterService();

// Export types
export type { NewsletterLead, NewsletterMetrics };