/**
 * ZOE SOLAR - Open Graph Tags Service
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Quick Win Features:
 * - Facebook Open Graph Protocol
 * - Twitter Cards
 * - LinkedIn Sharing
 * - Dynamic OG Tags
 * - Social Media Image Generation
 * - Preview Testing
 */

import { useEffect } from 'react';

// Open Graph Types
interface OpenGraphData {
 title: string;
 description: string;
 image: string;
 imageWidth?: number;
 imageHeight?: number;
 url: string;
 type: 'website' | 'article' | 'product' | 'profile';
 siteName?: string;
 locale?: string;
 localeAlternate?: string;
 publishedTime?: string;
 modifiedTime?: string;
 author?: string;
 section?: string;
 tags?: string[];
}

interface TwitterCardData {
 card: 'summary' | 'summary_large_image' | 'app' | 'player';
 site?: string;
 creator?: string;
 title: string;
 description: string;
 image: string;
 imageAlt?: string;
 player?: {
 url: string;
 width?: number;
 height?: number;
 };
 app?: {
 id?: {
 iphone?: string;
 ipad?: string;
 googleplay?: string;
 };
 url?: {
 iphone?: string;
 ipad?: string;
 googleplay?: string;
 };
 };
}

// Open Graph Service
export class OpenGraphService {
 private static instance: OpenGraphService;
 private currentTags: Map<string, string> = new Map();
 private readonly DEFAULT_IMAGE = 'https://zoe-solar.de/assets/images/default-og-image.jpg';
 private readonly DEFAULT_IMAGE_WIDTH = 1200;
 private readonly DEFAULT_IMAGE_HEIGHT = 630;
 private readonly DEFAULT_SITE_NAME = 'ZOE Solar';
 private readonly DEFAULT_LOCALE = 'de_DE';

 public static getInstance(): OpenGraphService {
 if (!OpenGraphService.instance) {
 OpenGraphService.instance = new OpenGraphService();
 }
 return OpenGraphService.instance;
 }

 // Set Open Graph tags
 public setOpenGraph(data: Partial<OpenGraphData> = {}): void {
 const ogData = this.getDefaultOpenGraphData(data);
 
 // Basic Open Graph tags
 this.setTag('og:title', ogData.title);
 this.setTag('og:description', ogData.description);
 this.setTag('og:image', ogData.image);
 this.setTag('og:url', ogData.url);
 this.setTag('og:type', ogData.type);
 this.setTag('og:site_name', ogData.siteName || this.DEFAULT_SITE_NAME);
 
 // Image dimensions
 if (ogData.imageWidth) {
 this.setTag('og:image:width', ogData.imageWidth.toString());
 }
 if (ogData.imageHeight) {
 this.setTag('og:image:height', ogData.imageHeight.toString());
 }
 
 // Locale
 if (ogData.locale) {
 this.setTag('og:locale', ogData.locale);
 }
 if (ogData.localeAlternate) {
 this.setTag('og:locale:alternate', ogData.localeAlternate);
 }
 
 // Article-specific tags
 if (ogData.type === 'article') {
 if (ogData.publishedTime) {
 this.setTag('article:published_time', ogData.publishedTime);
 }
 if (ogData.modifiedTime) {
 this.setTag('article:modified_time', ogData.modifiedTime);
 }
 if (ogData.author) {
 this.setTag('article:author', ogData.author);
 }
 if (ogData.section) {
 this.setTag('article:section', ogData.section);
 }
 if (ogData.tags && ogData.tags.length > 0) {
 ogData.tags.forEach(tag => {
 this.setTag('article:tag', tag);
 });
 }
 }
 }

 // Set Twitter Card tags
 public setTwitterCard(data: Partial<TwitterCardData> = {}): void {
 const twitterData = this.getDefaultTwitterCardData(data);
 
 this.setTag('twitter:card', twitterData.card);
 
 if (twitterData.site) {
 this.setTag('twitter:site', twitterData.site);
 }
 if (twitterData.creator) {
 this.setTag('twitter:creator', twitterData.creator);
 }
 
 this.setTag('twitter:title', twitterData.title);
 this.setTag('twitter:description', twitterData.description);
 this.setTag('twitter:image', twitterData.image);
 
 if (twitterData.imageAlt) {
 this.setTag('twitter:image:alt', twitterData.imageAlt);
 }
 
 // Player card specific
 if (twitterData.card === 'player' && twitterData.player) {
 this.setTag('twitter:player', twitterData.player.url);
 if (twitterData.player.width) {
 this.setTag('twitter:player:width', twitterData.player.width.toString());
 }
 if (twitterData.player.height) {
 this.setTag('twitter:player:height', twitterData.player.height.toString());
 }
 }
 
 // App card specific
 if (twitterData.card === 'app' && twitterData.app) {
 if (twitterData.app.id) {
 if (twitterData.app.id.iphone) {
 this.setTag('twitter:app:id:iphone', twitterData.app.id.iphone);
 }
 if (twitterData.app.id.ipad) {
 this.setTag('twitter:app:id:ipad', twitterData.app.id.ipad);
 }
 if (twitterData.app.id.googleplay) {
 this.setTag('twitter:app:id:googleplay', twitterData.app.id.googleplay);
 }
 }
 if (twitterData.app.url) {
 if (twitterData.app.url.iphone) {
 this.setTag('twitter:app:url:iphone', twitterData.app.url.iphone);
 }
 if (twitterData.app.url.ipad) {
 this.setTag('twitter:app:url:ipad', twitterData.app.url.ipad);
 }
 if (twitterData.app.url.googleplay) {
 this.setTag('twitter:app:url:googleplay', twitterData.app.url.googleplay);
 }
 }
 }
 }

 // Set individual meta tag
 private setTag(property: string, content: string): void {
 this.currentTags.set(property, content);
 this.updateMetaTag(property, content);
 }

 // Update or create meta tag
 private updateMetaTag(property: string, content: string): void {
 let tag: HTMLMetaElement | null = null;
 
 // Check for existing tag
 if (property.startsWith('og:') || property.startsWith('article:')) {
 tag = document.querySelector(`meta[property="${property}"]`);
 } else if (property.startsWith('twitter:')) {
 tag = document.querySelector(`meta[name="${property}"]`);
 }
 
 // Create new tag if not found
 if (!tag) {
 tag = document.createElement('meta');
 
 if (property.startsWith('og:') || property.startsWith('article:')) {
 tag.setAttribute('property', property);
 } else if (property.startsWith('twitter:')) {
 tag.setAttribute('name', property);
 } else {
 tag.setAttribute('name', property);
 }
 
 document.head.appendChild(tag);
 }
 
 // Set content
 tag.setAttribute('content', content);
 }

 // Remove meta tag
 public removeTag(property: string): void {
 this.currentTags.delete(property);
 
 let tag: HTMLMetaElement | null = null;
 
 if (property.startsWith('og:') || property.startsWith('article:')) {
 tag = document.querySelector(`meta[property="${property}"]`);
 } else if (property.startsWith('twitter:')) {
 tag = document.querySelector(`meta[name="${property}"]`);
 }
 
 if (tag) {
 tag.remove();
 }
 }

 // Clear all tags
 public clearTags(): void {
 this.currentTags.clear();
 
 // Remove all OG and Twitter tags
 const ogTags = document.querySelectorAll('meta[property^="og:"], meta[property^="article:"]');
 const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
 
 ogTags.forEach(tag => tag.remove());
 twitterTags.forEach(tag => tag.remove());
 }

 // Generate dynamic OG image URL
 public generateOGImage(
 title: string,
 subtitle?: string,
 backgroundColor: string = '#0F172A',
 textColor: string = '#FFFFFF',
 logoUrl?: string
 ): string {
 const params = new URLSearchParams({
 title: title.substring(0, 80), // Limit title length
 background: backgroundColor,
 textColor: textColor,
 width: this.DEFAULT_IMAGE_WIDTH.toString(),
 height: this.DEFAULT_IMAGE_HEIGHT.toString()
 });
 
 if (subtitle) {
 params.append('subtitle', subtitle.substring(0, 120));
 }
 
 if (logoUrl) {
 params.append('logo', logoUrl);
 }
 
 return `https://images.unsplash.com/photo-1509391366360-2e959784a276?${params.toString()}`;
 }

 // Get default Open Graph data
 private getDefaultOpenGraphData(data: Partial<OpenGraphData>): OpenGraphData {
 const currentUrl = window.location.href;
 const pageTitle = document.title || 'ZOE Solar - Ihr Partner für nachhaltige Energie';
 const pageDescription = this.extractMetaDescription();
 const pageImage = this.extractMetaImage() || this.DEFAULT_IMAGE;
 
 return {
 title: data.title || pageTitle,
 description: data.description || pageDescription,
 image: data.image || pageImage,
 url: data.url || currentUrl,
 type: data.type || 'website',
 siteName: data.siteName || this.DEFAULT_SITE_NAME,
 locale: data.locale || this.DEFAULT_LOCALE,
 imageWidth: data.imageWidth || this.DEFAULT_IMAGE_WIDTH,
 imageHeight: data.imageHeight || this.DEFAULT_IMAGE_HEIGHT,
 publishedTime: data.publishedTime,
 modifiedTime: data.modifiedTime,
 author: data.author,
 section: data.section,
 tags: data.tags
 };
 }

 // Get default Twitter Card data
 private getDefaultTwitterCardData(data: Partial<TwitterCardData>): TwitterCardData {
 const pageTitle = document.title || 'ZOE Solar - Ihr Partner für nachhaltige Energie';
 const pageDescription = this.extractMetaDescription();
 const pageImage = this.extractMetaImage() || this.DEFAULT_IMAGE;
 
 return {
 card: data.card || 'summary_large_image',
 site: data.site || '@zoe_solar',
 title: data.title || pageTitle,
 description: data.description || pageDescription,
 image: data.image || pageImage,
 imageAlt: data.imageAlt,
 player: data.player,
 app: data.app
 };
 }

 // Extract meta description
 private extractMetaDescription(): string {
 const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
 return metaDescription?.content || 'Professionelle Photovoltaik-Anlagen und Energielösungen von ZOE Solar. Ihr Partner für nachhaltige Energie in Deutschland.';
 }

 // Extract meta image
 private extractMetaImage(): string | null {
 const metaImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
 return metaImage?.content || null;
 }

 // Set default tags for the site
 public setDefaultTags(): void {
 this.setOpenGraph({
 title: 'ZOE Solar - Ihr Partner für nachhaltige Energie',
 description: 'Professionelle Photovoltaik-Anlagen, Solarberatung und Energielösungen. Nachhaltige Energie für Privathaushalte und Unternehmen in Deutschland.',
 image: this.DEFAULT_IMAGE,
 type: 'website'
 });

 this.setTwitterCard({
 card: 'summary_large_image',
 site: '@zoe_solar',
 title: 'ZOE Solar - Ihr Partner für nachhaltige Energie',
 description: 'Professionelle Photovoltaik-Anlagen, Solarberatung und Energielösungen.'
 });
 }

 // Test current Open Graph setup
 public testOpenGraph(): {
 title: string;
 description: string;
 image: string;
 type: string;
 url: string;
 } {
 return {
 title: this.currentTags.get('og:title') || '',
 description: this.currentTags.get('og:description') || '',
 image: this.currentTags.get('og:image') || '',
 type: this.currentTags.get('og:type') || '',
 url: this.currentTags.get('og:url') || ''
 };
 }

 // Generate preview URLs for testing
 public generatePreviewUrls(): {
 facebook: string;
 twitter: string;
 linkedin: string;
 pinterest: string;
 } {
 const currentUrl = encodeURIComponent(window.location.href);
 
 return {
 facebook: `https://developers.facebook.com/tools/debug/?q=${currentUrl}`,
 twitter: `https://cards-dev.twitter.com/validator?url=${currentUrl}`,
 linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
 pinterest: `https://www.pinterest.com/pin/create/button/?url=${currentUrl}`
 };
 }
}

// React Hook for Open Graph
export function useOpenGraph(data: Partial<OpenGraphData> = {}) {
 const ogService = OpenGraphService.getInstance();

 useEffect(() => {
 ogService.setOpenGraph(data);
 
 return () => {
 // Optional: Clear tags on unmount
 // ogService.clearTags();
 };
 }, [data]);

 return {
 setOpenGraph: ogService.setOpenGraph.bind(ogService),
 setTwitterCard: ogService.setTwitterCard.bind(ogService),
 clearTags: ogService.clearTags.bind(ogService),
 testOpenGraph: ogService.testOpenGraph.bind(ogService),
 generatePreviewUrls: ogService.generatePreviewUrls.bind(ogService)
 };
}

// React Hook for Twitter Cards
export function useTwitterCard(data: Partial<TwitterCardData> = {}) {
 const ogService = OpenGraphService.getInstance();

 useEffect(() => {
 ogService.setTwitterCard(data);
 }, [data]);

 return {
 setTwitterCard: ogService.setTwitterCard.bind(ogService),
 testOpenGraph: ogService.testOpenGraph.bind(ogService)
 };
}

// Open Graph Provider Component
export const OpenGraphProvider: React.FC<{
 children: React.ReactNode;
 data?: Partial<OpenGraphData>;
 twitterData?: Partial<TwitterCardData>;
 setDefaultOnMount?: boolean;
}> = ({ children, data = {}, twitterData = {}, setDefaultOnMount = true }) => {
 const ogService = OpenGraphService.getInstance();

 useEffect(() => {
 if (setDefaultOnMount) {
 ogService.setDefaultTags();
 }
 
 if (Object.keys(data).length > 0) {
 ogService.setOpenGraph(data);
 }
 
 if (Object.keys(twitterData).length > 0) {
 ogService.setTwitterCard(twitterData);
 }
 }, [data, twitterData, setDefaultOnMount]);

 return <>{children}</>;
};

// Specific OG Components for common use cases
export const ArticleOG: React.FC<{
 title: string;
 description: string;
 image: string;
 publishedTime: string;
 modifiedTime?: string;
 author: string;
 section?: string;
 tags?: string[];
}> = ({ title, description, image, publishedTime, modifiedTime, author, section, tags }) => {
 const ogService = OpenGraphService.getInstance();

 useEffect(() => {
 ogService.setOpenGraph({
 title,
 description,
 image,
 type: 'article',
 publishedTime,
 modifiedTime,
 author,
 section,
 tags
 });
 }, [title, description, image, publishedTime, modifiedTime, author, section, tags]);

 return null;
};

export const ProductOG: React.FC<{
 title: string;
 description: string;
 image: string;
 price: string;
 currency: string;
 availability: 'in stock' | 'out of stock' | 'preorder';
}> = ({ title, description, image, price, currency, availability }) => {
 const ogService = OpenGraphService.getInstance();

 useEffect(() => {
 ogService.setOpenGraph({
 title,
 description,
 image,
 type: 'product'
 });
 }, [title, description, image]);

 return null;
};

// Utility functions
export const ogUtils = {
 // Generate dynamic OG image
 generateDynamicOGImage: (options: {
 title: string;
 subtitle?: string;
 backgroundColor?: string;
 textColor?: string;
 logoUrl?: string;
 width?: number;
 height?: number;
 }): string => {
 const service = OpenGraphService.getInstance();
 return service.generateOGImage(
 options.title,
 options.subtitle,
 options.backgroundColor,
 options.textColor,
 options.logoUrl
 );
 },

 // Extract Open Graph data from current page
 extractCurrentOG: () => {
 const service = OpenGraphService.getInstance();
 return service.testOpenGraph();
 },

 // Validate Open Graph data
 validateOGData: (data: Partial<OpenGraphData>): { isValid: boolean; errors: string[] } => {
 const errors: string[] = [];
 
 if (!data.title || data.title.length < 10) {
 errors.push('Title should be at least 10 characters long');
 }
 
 if (!data.description || data.description.length < 50) {
 errors.push('Description should be at least 50 characters long');
 }
 
 if (!data.image) {
 errors.push('Image is required for Open Graph');
 }
 
 if (!data.url) {
 errors.push('URL is required for Open Graph');
 }
 
 return {
 isValid: errors.length === 0,
 errors
 };
 },

 // Generate Open Graph testing URLs
 generateTestUrls: (url: string) => {
 const encodedUrl = encodeURIComponent(url);
 
 return {
 facebook: `https://developers.facebook.com/tools/debug/?q=${encodedUrl}`,
 twitter: `https://cards-dev.twitter.com/validator?url=${encodedUrl}`,
 linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
 pinterest: `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}`,
 linkedinPreview: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
 };
 }
};

export default OpenGraphService;