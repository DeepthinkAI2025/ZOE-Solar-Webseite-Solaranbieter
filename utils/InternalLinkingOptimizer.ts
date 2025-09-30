import { pageRoutes } from '../data/pageRoutes';
import { resolveSeoForPage } from '../data/seoConfig';

export interface InternalLink {
  url: string;
  anchorText: string;
  relevanceScore: number;
  context: string;
}

export class InternalLinkingOptimizer {
  private static instance: InternalLinkingOptimizer;
  private linkCache: Map<string, InternalLink[]> = new Map();

  private constructor() {}

  static getInstance(): InternalLinkingOptimizer {
    if (!InternalLinkingOptimizer.instance) {
      InternalLinkingOptimizer.instance = new InternalLinkingOptimizer();
    }
    return InternalLinkingOptimizer.instance;
  }

  async getRelatedLinks(currentPath: string, content: string, keywords: string[]): Promise<InternalLink[]> {
    if (this.linkCache.has(currentPath)) {
      return this.linkCache.get(currentPath)!;
    }

    const relatedLinks: InternalLink[] = [];
    const allPages = Object.values(pageRoutes);

    for (const page of allPages) {
      if (page.path === currentPath) continue;

      try {
        const seoData = await resolveSeoForPage(page.path);
        const pageKeywords = seoData.keywords || [];
        const pageTitle = seoData.title || '';
        const pageDescription = seoData.description || '';

        // Calculate relevance score based on keyword overlap
        const keywordOverlap = this.calculateKeywordOverlap(keywords, pageKeywords);
        const contentRelevance = this.calculateContentRelevance(content, pageTitle + ' ' + pageDescription);

        const relevanceScore = (keywordOverlap * 0.6) + (contentRelevance * 0.4);

        if (relevanceScore > 0.3) { // Threshold for suggesting links
          const anchorText = this.generateAnchorText(pageTitle, keywords);
          relatedLinks.push({
            url: page.path,
            anchorText,
            relevanceScore,
            context: pageDescription.substring(0, 100) + '...'
          });
        }
      } catch (error) {
        console.warn(`Failed to resolve SEO for ${page.path}:`, error);
      }
    }

    // Sort by relevance and limit to top 5
    relatedLinks.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topLinks = relatedLinks.slice(0, 5);

    this.linkCache.set(currentPath, topLinks);
    return topLinks;
  }

  private calculateKeywordOverlap(keywords1: string[], keywords2: string[]): number {
    const set1 = new Set(keywords1.map(k => k.toLowerCase()));
    const set2 = new Set(keywords2.map(k => k.toLowerCase()));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  private calculateContentRelevance(content: string, targetContent: string): number {
    const contentWords = content.toLowerCase().split(/\s+/);
    const targetWords = targetContent.toLowerCase().split(/\s+/);

    const commonWords = contentWords.filter(word =>
      word.length > 3 && targetWords.includes(word)
    );

    return commonWords.length / Math.max(contentWords.length, targetWords.length);
  }

  private generateAnchorText(pageTitle: string, keywords: string[]): string {
    // Find the most relevant keyword that appears in the title
    for (const keyword of keywords) {
      if (pageTitle.toLowerCase().includes(keyword.toLowerCase())) {
        return keyword;
      }
    }

    // Fallback to a shortened title
    return pageTitle.length > 30 ? pageTitle.substring(0, 27) + '...' : pageTitle;
  }

  clearCache(): void {
    this.linkCache.clear();
  }

  getCacheStats(): { size: number; paths: string[] } {
    return {
      size: this.linkCache.size,
      paths: Array.from(this.linkCache.keys())
    };
  }
}

export const internalLinkingOptimizer = InternalLinkingOptimizer.getInstance();