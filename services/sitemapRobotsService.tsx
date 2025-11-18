/**
 * ZOE SOLAR - Sitemap & robots.txt Optimization Service
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Quick Win Features:
 * - Dynamic Sitemap Generation
 * - robots.txt Optimization
 * - URL Management
 * - Search Engine Indexing
 * - Priority & Frequency Settings
 * - Multi-sitemap Support
 */

import { useEffect } from 'react';

// Sitemap Types
interface SitemapUrl {
 loc: string;
 lastmod?: string;
 changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
 priority?: number;
 images?: Array<{
 loc: string;
 caption?: string;
 title?: string;
 license?: string;
 }>;
}

interface SitemapIndex {
 sitemap: Array<{
 loc: string;
 lastmod?: string;
 }>;
}

interface RobotsRule {
 userAgent: string;
 allow?: string[];
 disallow?: string[];
 crawlDelay?: number;
 sitemaps?: string[];
}

// Sitemap Service
export class SitemapService {
 private static instance: SitemapService;
 private sitemapUrls: Map<string, SitemapUrl> = new Map();
 private baseUrl = 'https://zoe-solar.de';

 public static getInstance(): SitemapService {
 if (!SitemapService.instance) {
 SitemapService.instance = new SitemapService();
 }
 return SitemapService.instance;
 }

 // Add URL to sitemap
 public addUrl(url: string, options: Partial<SitemapUrl> = {}): void {
 const sitemapUrl: SitemapUrl = {
 loc: this.normalizeUrl(url),
 lastmod: options.lastmod || new Date().toISOString().split('T')[0],
 changefreq: options.changefreq || 'weekly',
 priority: options.priority || 0.5,
 images: options.images || []
 };

 this.sitemapUrls.set(url, sitemapUrl);
 }

 // Remove URL from sitemap
 public removeUrl(url: string): void {
 this.sitemapUrls.delete(url);
 }

 // Normalize URL
 private normalizeUrl(url: string): string {
 if (url.startsWith('http')) {
 return url;
 }
 return `${this.baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
 }

 // Generate XML sitemap
 public generateXMLSitemap(): string {
 const urls = Array.from(this.sitemapUrls.values());
 
 const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
 const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
 const urlsetClose = '</urlset>';

 const urlElements = urls.map(url => this.generateUrlElement(url)).join('');
 
 return `${xmlHeader}\n${urlsetOpen}\n${urlElements}\n${urlsetClose}`;
 }

 // Generate individual URL element
 private generateUrlElement(url: SitemapUrl): string {
 let element = ` <url>\n <loc>${url.loc}</loc>\n <lastmod>${url.lastmod}</lastmod>\n <changefreq>${url.changefreq}</changefreq>\n <priority>${url.priority}</priority>\n </url>`;

 // Add images if present
 if (url.images && url.images.length > 0) {
 const imageElements = url.images.map(image => 
 ` <image:image>\n <image:loc>${image.loc}</image:loc>\n${image.caption ? ` <image:caption>${image.caption}</image:caption>\n` : ''}${image.title ? ` <image:title>${image.title}</image:title>\n` : ''}${image.license ? ` <image:license>${image.license}</image:license>\n` : ''} </image:image>`
 ).join('\n');
 
 element = element.replace('</url>', ` <image:image>\n${imageElements}\n </url>`);
 }

 return element;
 }

 // Generate sitemap index for multiple sitemaps
 public generateSitemapIndex(sitemaps: Array<{loc: string, lastmod?: string}>): string {
 const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
 const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
 const sitemapIndexClose = '</sitemapindex>';

 const sitemapElements = sitemaps.map(sitemap => 
 ` <sitemap>\n <loc>${sitemap.loc}</loc>\n${sitemap.lastmod ? ` <lastmod>${sitemap.lastmod}</lastmod>\n` : ''} </sitemap>`
 ).join('\n');

 return `${xmlHeader}\n${sitemapIndexOpen}\n${sitemapElements}\n${sitemapIndexClose}`;
 }

 // Add common pages to sitemap
 public addCommonPages(): void {
 // Homepage
 this.addUrl('/', {
 priority: 1.0,
 changefreq: 'daily'
 });

 // Main service pages
 this.addUrl('/photovoltaik', {
 priority: 0.9,
 changefreq: 'weekly'
 });

 this.addUrl('/e-mobilitaet', {
 priority: 0.8,
 changefreq: 'weekly'
 });

 this.addUrl('/wartung-service', {
 priority: 0.8,
 changefreq: 'weekly'
 });

 // Company pages
 this.addUrl('/ueber-uns', {
 priority: 0.7,
 changefreq: 'monthly'
 });

 this.addUrl('/kontakt', {
 priority: 0.8,
 changefreq: 'monthly'
 });

 // Product/Service detail pages
 this.addUrl('/produkte', {
 priority: 0.8,
 changefreq: 'weekly'
 });

 this.addUrl('/innovations', {
 priority: 0.6,
 changefreq: 'weekly'
 });

 // Knowledge/Content pages
 this.addUrl('/wissen', {
 priority: 0.7,
 changefreq: 'weekly'
 });

 this.addUrl('/fallstudien', {
 priority: 0.6,
 changefreq: 'weekly'
 });
 }

 // Add location-based pages
 public addLocationPages(): void {
 const locations = [
 { city: 'berlin', priority: 0.8 },
 { city: 'hamburg', priority: 0.8 },
 { city: 'muenchen', priority: 0.8 },
 { city: 'koeln', priority: 0.8 },
 { city: 'frankfurt', priority: 0.8 }
 ];

 locations.forEach(location => {
 this.addUrl(`/standort/${location.city}`, {
 priority: location.priority,
 changefreq: 'monthly'
 });
 });
 }

 // Add product pages
 public addProductPages(products: Array<{
 slug: string;
 name: string;
 category: string;
 images?: string[];
 }>): void {
 products.forEach(product => {
 this.addUrl(`/produkte/${product.slug}`, {
 priority: 0.7,
 changefreq: 'weekly',
 images: product.images?.map(image => ({
 loc: image,
 title: product.name
 })) || []
 });
 });
 }

 // Add article/blog pages
 public addArticlePages(articles: Array<{
 slug: string;
 title: string;
 publishedDate: string;
 modifiedDate?: string;
 category?: string;
 featuredImage?: string;
 }>): void {
 articles.forEach(article => {
 this.addUrl(`/wissen/${article.slug}`, {
 priority: 0.6,
 changefreq: 'monthly',
 lastmod: article.modifiedDate || article.publishedDate,
 images: article.featuredImage ? [{
 loc: article.featuredImage,
 title: article.title
 }] : []
 });
 });
 }

 // Add FAQ pages
 public addFAQPages(faqs: Array<{
 slug: string;
 category: string;
 question: string;
 }>): void {
 faqs.forEach(faq => {
 this.addUrl(`/faq/${faq.category}/${faq.slug}`, {
 priority: 0.5,
 changefreq: 'monthly'
 });
 });
 }

 // Get all URLs
 public getAllUrls(): Array<SitemapUrl> {
 return Array.from(this.sitemapUrls.values());
 }

 // Export sitemap to file
 public exportSitemap(filename: string = 'sitemap.xml'): void {
 const xml = this.generateXMLSitemap();
 const blob = new Blob([xml], { type: 'application/xml' });
 const url = URL.createObjectURL(blob);
 
 const link = document.createElement('a');
 link.href = url;
 link.download = filename;
 link.click();
 
 URL.revokeObjectURL(url);
 }

 // Submit sitemap to search engines
 public async submitToSearchEngines(): Promise<{[key: string]: boolean}> {
 const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
 const results: {[key: string]: boolean} = {};

 // Google Search Console
 try {
 const googleResponse = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
 results.google = googleResponse.ok;
 } catch (error) {
 results.google = false;
 console.error('Google sitemap submission failed:', error);
 }

 // Bing Webmaster Tools
 try {
 const bingResponse = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
 results.bing = bingResponse.ok;
 } catch (error) {
 results.bing = false;
 console.error('Bing sitemap submission failed:', error);
 }

 return results;
 }
}

// Robots.txt Service
export class RobotsTxtService {
 private static instance: RobotsTxtService;
 private rules: Map<string, RobotsRule> = new Map();
 private baseUrl = 'https://zoe-solar.de';

 public static getInstance(): RobotsTxtService {
 if (!RobotsTxtService.instance) {
 RobotsTxtService.instance = new RobotsTxtService();
 }
 return RobotsTxtService.instance;
 }

 // Add rule
 public addRule(userAgent: string, rule: Omit<RobotsRule, 'userAgent'>): void {
 const existingRule = this.rules.get(userAgent) || { userAgent };
 this.rules.set(userAgent, {
 ...existingRule,
 ...rule
 });
 }

 // Remove rule
 public removeRule(userAgent: string): void {
 this.rules.delete(userAgent);
 }

 // Generate robots.txt content
 public generateRobotsTxt(): string {
 const lines: string[] = [];

 // Add user agent rules
 this.rules.forEach((rule, userAgent) => {
 lines.push(`User-agent: ${userAgent}`);
 
 if (rule.crawlDelay) {
 lines.push(`Crawl-delay: ${rule.crawlDelay}`);
 }
 
 if (rule.allow && rule.allow.length > 0) {
 rule.allow.forEach(path => {
 lines.push(`Allow: ${path}`);
 });
 }
 
 if (rule.disallow && rule.disallow.length > 0) {
 rule.disallow.forEach(path => {
 lines.push(`Disallow: ${path}`);
 });
 }
 
 lines.push(''); // Empty line between rules
 });

 // Add sitemap reference
 lines.push(`Sitemap: ${this.baseUrl}/sitemap.xml`);
 
 // Add additional sitemaps
 const additionalSitemaps = [
 `${this.baseUrl}/products-sitemap.xml`,
 `${this.baseUrl}/articles-sitemap.xml`,
 `${this.baseUrl}/locations-sitemap.xml`
 ];
 
 additionalSitemaps.forEach(sitemap => {
 lines.push(`Sitemap: ${sitemap}`);
 });

 return lines.join('\n');
 }

 // Set default optimized rules
 public setOptimizedRules(): void {
 // Allow all bots to crawl most content
 this.addRule('*', {
 allow: [
 '/',
 '/photovoltaik',
 '/e-mobilitaet',
 '/wartung-service',
 '/produkte',
 '/ueber-uns',
 '/kontakt',
 '/standort/*',
 '/wissen/*',
 '/innovations',
 '/fallstudien',
 '/assets/',
 '/images/'
 ],
 disallow: [
 '/admin/',
 '/private/',
 '/api/',
 '/_next/',
 '/node_modules/',
 '/.git/',
 '/*.json$',
 '/search?q=',
 '/?*',
 '/#'
 ],
 crawlDelay: 1
 });

 // Specific rules for search engines
 this.addRule('Googlebot', {
 allow: ['/*'],
 disallow: [
 '/admin/',
 '/api/',
 '/private/'
 ],
 crawlDelay: 1
 });

 this.addRule('Bingbot', {
 allow: ['/*'],
 disallow: [
 '/admin/',
 '/api/',
 '/private/'
 ],
 crawlDelay: 2
 });

 this.addRule('Yandex', {
 allow: ['/*'],
 disallow: [
 '/admin/',
 '/api/',
 '/private/'
 ],
 crawlDelay: 2
 });

 // Block aggressive bots
 this.addRule('AhrefsBot', {
 disallow: ['/']
 });

 this.addRule('MJ12bot', {
 disallow: ['/']
 });
 }

 // Export robots.txt
 public exportRobotsTxt(): void {
 const content = this.generateRobotsTxt();
 const blob = new Blob([content], { type: 'text/plain' });
 const url = URL.createObjectURL(blob);
 
 const link = document.createElement('a');
 link.href = url;
 link.download = 'robots.txt';
 link.click();
 
 URL.revokeObjectURL(url);
 }
}

// React Hook for Sitemap Management
export function useSitemap() {
 const sitemapService = SitemapService.getInstance();

 useEffect(() => {
 // Add common pages on mount
 sitemapService.addCommonPages();
 sitemapService.addLocationPages();
 }, []);

 return {
 addUrl: sitemapService.addUrl.bind(sitemapService),
 removeUrl: sitemapService.removeUrl.bind(sitemapService),
 generateXMLSitemap: sitemapService.generateXMLSitemap.bind(sitemapService),
 addCommonPages: sitemapService.addCommonPages.bind(sitemapService),
 addLocationPages: sitemapService.addLocationPages.bind(sitemapService),
 addProductPages: sitemapService.addProductPages.bind(sitemapService),
 addArticlePages: sitemapService.addArticlePages.bind(sitemapService),
 submitToSearchEngines: sitemapService.submitToSearchEngines.bind(sitemapService)
 };
}

// React Hook for Robots.txt Management
export function useRobotsTxt() {
 const robotsService = RobotsTxtService.getInstance();

 useEffect(() => {
 // Set optimized rules on mount
 robotsService.setOptimizedRules();
 }, []);

 return {
 addRule: robotsService.addRule.bind(robotsService),
 generateRobotsTxt: robotsService.generateRobotsTxt.bind(robotsService),
 setOptimizedRules: robotsService.setOptimizedRules.bind(robotsService)
 };
}

// Combined SEO Sitemap Provider
export const SEOProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 const sitemapService = SitemapService.getInstance();
 const robotsService = RobotsTxtService.getInstance();

 useEffect(() => {
 // Initialize optimized sitemap and robots.txt
 sitemapService.addCommonPages();
 sitemapService.addLocationPages();
 robotsService.setOptimizedRules();

 // Update robots.txt in document head
 const updateRobotsTxt = () => {
 const existingRobots = document.querySelector('link[rel="robots-txt"]') as HTMLLinkElement;
 const robotsContent = robotsService.generateRobotsTxt();
 
 if (existingRobots) {
 existingRobots.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(robotsContent);
 }
 };

 updateRobotsTxt();
 }, []);

 return <>{children}</>;
};

// Utility functions
export const seoUtils = {
 // Generate sitemap for specific content type
 generateContentSitemap: (
 items: Array<{slug: string; title: string; date?: string}>,
 basePath: string,
 options: {
 priority?: number;
 changefreq?: string;
 } = {}
 ) => {
 const sitemapService = SitemapService.getInstance();
 
 items.forEach(item => {
 sitemapService.addUrl(`${basePath}/${item.slug}`, {
 priority: options.priority || 0.6,
 changefreq: options.changefreq as any || 'monthly',
 lastmod: item.date
 });
 });
 },

 // Validate sitemap XML
 validateSitemapXml: (xml: string): { isValid: boolean; errors: string[] } => {
 const errors: string[] = [];
 
 try {
 // Check for valid XML structure
 const parser = new DOMParser();
 const doc = parser.parseFromString(xml, 'text/xml');
 
 // Check for parsing errors
 const parseError = doc.querySelector('parsererror');
 if (parseError) {
 errors.push('Invalid XML structure');
 }
 
 // Check for required elements
 const urlset = doc.querySelector('urlset');
 if (!urlset) {
 errors.push('Missing urlset element');
 }
 
 // Check URLs
 const urls = doc.querySelectorAll('url');
 urls.forEach((url, index) => {
 const loc = url.querySelector('loc');
 if (!loc) {
 errors.push(`URL ${index + 1} missing loc element`);
 } else {
 const urlValue = loc.textContent || '';
 try {
 new URL(urlValue);
 } catch {
 errors.push(`Invalid URL in sitemap: ${urlValue}`);
 }
 }
 
 // Check priority values
 const priority = url.querySelector('priority');
 if (priority) {
 const priorityValue = parseFloat(priority.textContent || '0');
 if (priorityValue < 0 || priorityValue > 1) {
 errors.push(`Invalid priority value in URL ${index + 1}: ${priorityValue}`);
 }
 }
 });
 
 } catch (error) {
 errors.push(`XML parsing error: ${error}`);
 }
 
 return {
 isValid: errors.length === 0,
 errors
 };
 },

 // Generate multi-sitemap structure
 generateSitemapStructure: () => {
 const sitemapService = SitemapService.getInstance();
 
 // Main pages sitemap
 const mainPages = sitemapService.getAllUrls().filter(url => 
 url.loc.includes('/') && !url.loc.includes('/produkte/') && 
 !url.loc.includes('/wissen/') && !url.loc.includes('/standort/')
 );
 
 // Product pages sitemap
 const productPages = sitemapService.getAllUrls().filter(url => 
 url.loc.includes('/produkte/')
 );
 
 // Article pages sitemap
 const articlePages = sitemapService.getAllUrls().filter(url => 
 url.loc.includes('/wissen/')
 );
 
 // Location pages sitemap
 const locationPages = sitemapService.getAllUrls().filter(url => 
 url.loc.includes('/standort/')
 );
 
 const sitemapServiceInstance = SitemapService.getInstance();
 
 return sitemapServiceInstance.generateSitemapIndex([
 { loc: 'https://zoe-solar.de/sitemap-main.xml', lastmod: new Date().toISOString() },
 { loc: 'https://zoe-solar.de/sitemap-products.xml', lastmod: new Date().toISOString() },
 { loc: 'https://zoe-solar.de/sitemap-articles.xml', lastmod: new Date().toISOString() },
 { loc: 'https://zoe-solar.de/sitemap-locations.xml', lastmod: new Date().toISOString() }
 ]);
 }
};

export default SitemapService;