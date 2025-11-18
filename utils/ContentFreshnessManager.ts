import { Article } from '../data/articles';

export interface ContentUpdate {
  id: string;
  type: 'price' | 'funding' | 'regulation' | 'technology' | 'market';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  affectedPages: string[];
  lastUpdated: string;
  nextReview: string;
}

export class ContentFreshnessManager {
  private static instance: ContentFreshnessManager;
  private updates: ContentUpdate[] = [];
  private freshnessThreshold = 90; // days

  private constructor() {
    this.loadUpdates();
  }

  static getInstance(): ContentFreshnessManager {
    if (!ContentFreshnessManager.instance) {
      ContentFreshnessManager.instance = new ContentFreshnessManager();
    }
    return ContentFreshnessManager.instance;
  }

  private loadUpdates(): void {
    try {
      const stored = localStorage.getItem('contentUpdates');
      if (stored) {
        this.updates = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load content updates:', error);
    }
  }

  private saveUpdates(): void {
    try {
      localStorage.setItem('contentUpdates', JSON.stringify(this.updates));
    } catch (error) {
      console.warn('Failed to save content updates:', error);
    }
  }

  addUpdate(update: Omit<ContentUpdate, 'id' | 'lastUpdated' | 'nextReview'>): void {
    const newUpdate: ContentUpdate = {
      ...update,
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString(),
      nextReview: new Date(Date.now() + this.freshnessThreshold * 24 * 60 * 60 * 1000).toISOString()
    };

    this.updates.unshift(newUpdate);
    this.saveUpdates();

    // Trigger content refresh for affected pages
    this.refreshAffectedContent(newUpdate);
  }

  private async refreshAffectedContent(update: ContentUpdate): Promise<void> {
    for (const page of update.affectedPages) {
      try {
        await this.updatePageContent(page, update);
      } catch (error) {
        console.error(`Failed to refresh content for page ${page}:`, error);
      }
    }
  }

  private async updatePageContent(page: string, update: ContentUpdate): Promise<void> {
    // This would integrate with your content management system
    // For now, we'll log the update and mark it for manual review
    console.log(`Content update required for ${page}:`, update);

    // In a real implementation, this would:
    // 1. Fetch the current content
    // 2. Apply automated updates based on update type
    // 3. Save the updated content
    // 4. Trigger re-indexing if necessary
  }

  getStaleContent(): ContentUpdate[] {
    const now = new Date();
    return this.updates.filter(update => {
      const nextReview = new Date(update.nextReview);
      return nextReview < now;
    });
  }

  getRecentUpdates(days: number = 30): ContentUpdate[] {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.updates.filter(update => new Date(update.lastUpdated) > cutoff);
  }

  markReviewed(updateId: string): void {
    const update = this.updates.find(u => u.id === updateId);
    if (update) {
      update.nextReview = new Date(Date.now() + this.freshnessThreshold * 24 * 60 * 60 * 1000).toISOString();
      this.saveUpdates();
    }
  }

  getContentHealthScore(): number {
    const staleCount = this.getStaleContent().length;
    const totalCount = this.updates.length;
    if (totalCount === 0) return 100;

    const staleRatio = staleCount / totalCount;
    return Math.max(0, Math.round((1 - staleRatio) * 100));
  }

  // Automated content freshness checks
  async checkFundingUpdates(): Promise<void> {
    // Check for funding program changes
    // This would integrate with external APIs or manual data sources
    const mockUpdate: Omit<ContentUpdate, 'id' | 'lastUpdated' | 'nextReview'> = {
      type: 'funding',
      title: 'KFW-Förderung Update',
      description: 'Neue Fördersätze für 2025 verfügbar',
      impact: 'high',
      affectedPages: ['/foerdermittel-kfw', '/preise', '/']
    };

    this.addUpdate(mockUpdate);
  }

  async checkPriceUpdates(): Promise<void> {
    // Check for price changes in components or services
    const mockUpdate: Omit<ContentUpdate, 'id' | 'lastUpdated' | 'nextReview'> = {
      type: 'price',
      title: 'Modulpreise Update',
      description: 'Neue Modulpreise von JinkoSolar verfügbar',
      impact: 'medium',
      affectedPages: ['/hersteller/jinko-solar', '/preise']
    };

    this.addUpdate(mockUpdate);
  }

  async checkRegulationUpdates(): Promise<void> {
    // Check for regulatory changes
    const mockUpdate: Omit<ContentUpdate, 'id' | 'lastUpdated' | 'nextReview'> = {
      type: 'regulation',
      title: 'Neue EEG-Novelle',
      description: 'Änderungen im Erneuerbare-Energien-Gesetz',
      impact: 'high',
      affectedPages: ['/foerdermittel-overview', '/nachhaltigkeit']
    };

    this.addUpdate(mockUpdate);
  }

  // Schedule automated checks
  startAutomatedChecks(): void {
    // Check for updates daily
    setInterval(() => {
      this.checkFundingUpdates();
      this.checkPriceUpdates();
      this.checkRegulationUpdates();
    }, 24 * 60 * 60 * 1000); // Daily

    // Initial check
    setTimeout(() => {
      this.checkFundingUpdates();
      this.checkPriceUpdates();
      this.checkRegulationUpdates();
    }, 5000); // 5 seconds after start
  }
}

export const contentFreshnessManager = ContentFreshnessManager.getInstance();