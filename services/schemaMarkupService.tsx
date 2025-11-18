/**
 * ZOE SOLAR - Schema Markup Service
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Quick Win Features:
 * - JSON-LD Schema Implementation
 * - Local Business Schema
 * - Organization Schema
 * - Product Schema
 * - Service Schema
 * - FAQ Schema
 * - Breadcrumb Schema
 * - Rich Results Optimization
 */

import { useEffect } from 'react';

// Schema Types
interface SchemaOrganization {
 '@context': 'https://schema.org';
 '@type': 'Organization';
 name: string;
 url: string;
 logo: string;
 description: string;
 address: {
 '@type': 'PostalAddress';
 streetAddress: string;
 addressLocality: string;
 addressRegion: string;
 postalCode: string;
 addressCountry: string;
 };
 contactPoint: {
 '@type': 'ContactPoint';
 telephone: string;
 contactType: string;
 areaServed: string;
 availableLanguage: string;
 };
 sameAs: string[];
}

interface SchemaLocalBusiness {
 '@context': 'https://schema.org';
 '@type': 'ElectricUtility';
 name: string;
 description: string;
 url: string;
 telephone: string;
 address: {
 '@type': 'PostalAddress';
 streetAddress: string;
 addressLocality: string;
 addressRegion: string;
 postalCode: string;
 addressCountry: string;
 };
 geo: {
 '@type': 'GeoCoordinates';
 latitude: number;
 longitude: number;
 };
 openingHours: string;
 serviceArea: {
 '@type': 'GeoCircle';
 geoMidpoint: {
 '@type': 'GeoCoordinates';
 latitude: number;
 longitude: number;
 };
 geoRadius: string;
 };
 hasOfferCatalog: {
 '@type': 'OfferCatalog';
 name: string;
 itemListElement: Array<{
 '@type': 'Offer';
 itemOffered: {
 '@type': 'Service';
 name: string;
 description: string;
 };
 }>;
 };
}

interface SchemaProduct {
 '@context': 'https://schema.org';
 '@type': 'Product';
 name: string;
 description: string;
 image: string;
 brand: {
 '@type': 'Brand';
 name: string;
 };
 category: string;
 offers: {
 '@type': 'Offer';
 price: string;
 priceCurrency: string;
 availability: string;
 seller: {
 '@type': 'Organization';
 name: string;
 };
 };
 aggregateRating?: {
 '@type': 'AggregateRating';
 ratingValue: string;
 reviewCount: string;
 };
}

interface SchemaService {
 '@context': 'https://schema.org';
 '@type': 'Service';
 name: string;
 description: string;
 provider: {
 '@type': 'Organization';
 name: string;
 };
 areaServed: string;
 serviceType: string;
 offers: {
 '@type': 'Offer';
 price: string;
 priceCurrency: string;
 };
}

interface SchemaFAQ {
 '@context': 'https://schema.org';
 '@type': 'FAQPage';
 mainEntity: Array<{
 '@type': 'Question';
 name: string;
 acceptedAnswer: {
 '@type': 'Answer';
 text: string;
 };
 }>;
}

interface SchemaBreadcrumb {
 '@context': 'https://schema.org';
 '@type': 'BreadcrumbList';
 itemListElement: Array<{
 '@type': 'ListItem';
 position: number;
 name: string;
 item: string;
 }>;
}

interface SchemaEvent {
 '@context': 'https://schema.org';
 '@type': 'Event';
 name: string;
 description: string;
 startDate: string;
 endDate: string;
 eventStatus: string;
 eventAttendanceMode: string;
 location: {
 '@type': 'VirtualLocation';
 url: string;
 };
 organizer: {
 '@type': 'Organization';
 name: string;
 url: string;
 };
}

// Schema Markup Service
export class SchemaMarkupService {
 private static instance: SchemaMarkupService;
 private schemas: Map<string, any> = new Map();

 public static getInstance(): SchemaMarkupService {
 if (!SchemaMarkupService.instance) {
 SchemaMarkupService.instance = new SchemaMarkupService();
 }
 return SchemaMarkupService.instance;
 }

 // Add schema markup to head
 public addSchema(schema: any, name: string = 'default'): void {
 this.schemas.set(name, schema);
 this.updateHeadSchema();
 }

 // Remove schema markup
 public removeSchema(name: string): void {
 this.schemas.delete(name);
 this.updateHeadSchema();
 }

 // Update head with all schemas
 private updateHeadSchema(): void {
 // Remove existing schema scripts
 const existingScripts = document.querySelectorAll('script[data-schema="true"]');
 existingScripts.forEach(script => script.remove());

 // Add updated schemas
 this.schemas.forEach((schema, name) => {
 const script = document.createElement('script');
 script.type = 'application/ld+json';
 script.setAttribute('data-schema', 'true');
 script.setAttribute('data-schema-name', name);
 script.textContent = JSON.stringify(schema, null, 2);
 document.head.appendChild(script);
 });
 }

 // Organization Schema
 public getOrganizationSchema(): SchemaOrganization {
 return {
 '@context': 'https://schema.org',
 '@type': 'Organization',
 name: 'ZOE Solar',
 url: 'https://zoe-solar.de',
 logo: 'https://zoe-solar.de/assets/logo.png',
 description: 'Ihr führender Partner für Photovoltaik-Anlagen und Energielösungen in Deutschland. Professionelle Beratung, Installation und Wartung von Solarstromsystemen.',
 address: {
 '@type': 'PostalAddress',
 streetAddress: 'Solarstraße 123',
 addressLocality: 'Berlin',
 addressRegion: 'Berlin',
 postalCode: '10115',
 addressCountry: 'DE'
 },
 contactPoint: {
 '@type': 'ContactPoint',
 telephone: '+49-30-12345678',
 contactType: 'Customer Service',
 areaServed: 'DE',
 availableLanguage: 'German'
 },
 sameAs: [
 'https://www.facebook.com/zoe-solar',
 'https://www.linkedin.com/company/zoe-solar',
 'https://www.youtube.com/zoe-solar'
 ]
 };
 }

 // Local Business Schema
 public getLocalBusinessSchema(): SchemaLocalBusiness {
 return {
 '@context': 'https://schema.org',
 '@type': 'ElectricUtility',
 name: 'ZOE Solar',
 description: 'Professionelle Photovoltaik-Anlagen für Privathaushalte und Unternehmen. Von der Beratung bis zur Installation - Ihr Partner für nachhaltige Energielösungen.',
 url: 'https://zoe-solar.de',
 telephone: '+49-30-12345678',
 address: {
 '@type': 'PostalAddress',
 streetAddress: 'Solarstraße 123',
 addressLocality: 'Berlin',
 addressRegion: 'Berlin',
 postalCode: '10115',
 addressCountry: 'DE'
 },
 geo: {
 '@type': 'GeoCoordinates',
 latitude: 52.5200,
 longitude: 13.4050
 },
 openingHours: 'Mo-Fr 09:00-18:00',
 serviceArea: {
 '@type': 'GeoCircle',
 geoMidpoint: {
 '@type': 'GeoCoordinates',
 latitude: 52.5200,
 longitude: 13.4050
 },
 geoRadius: '1000' // 1000km radius
 },
 hasOfferCatalog: {
 '@type': 'OfferCatalog',
 name: 'Photovoltaik Services',
 itemListElement: [
 {
 '@type': 'Offer',
 itemOffered: {
 '@type': 'Service',
 name: 'Photovoltaik-Anlagen Installation',
 description: 'Professionelle Installation von Photovoltaik-Anlagen für Privathaushalte und Unternehmen'
 }
 },
 {
 '@type': 'Offer',
 itemOffered: {
 '@type': 'Service',
 name: 'Solarberatung',
 description: 'Kostenlose Beratung für optimale Solarlösungen'
 }
 },
 {
 '@type': 'Offer',
 itemOffered: {
 '@type': 'Service',
 name: 'Wartung und Service',
 description: 'Regelmäßige Wartung und technischer Service für Solar-Anlagen'
 }
 }
 ]
 }
 };
 }

 // Product Schema for Solar Panels
 public getProductSchema(products: Array<{
 name: string;
 description: string;
 image: string;
 brand: string;
 category: string;
 price: string;
 }>): SchemaProduct[] {
 return products.map(product => ({
 '@context': 'https://schema.org',
 '@type': 'Product',
 name: product.name,
 description: product.description,
 image: product.image,
 brand: {
 '@type': 'Brand',
 name: product.brand
 },
 category: product.category,
 offers: {
 '@type': 'Offer',
 price: product.price,
 priceCurrency: 'EUR',
 availability: 'https://schema.org/InStock',
 seller: {
 '@type': 'Organization',
 name: 'ZOE Solar'
 }
 },
 aggregateRating: {
 '@type': 'AggregateRating',
 ratingValue: '4.8',
 reviewCount: '127'
 }
 }));
 }

 // Service Schema
 public getServiceSchema(services: Array<{
 name: string;
 description: string;
 areaServed: string;
 serviceType: string;
 price: string;
 }>): SchemaService[] {
 return services.map(service => ({
 '@context': 'https://schema.org',
 '@type': 'Service',
 name: service.name,
 description: service.description,
 provider: {
 '@type': 'Organization',
 name: 'ZOE Solar'
 },
 areaServed: service.areaServed,
 serviceType: service.serviceType,
 offers: {
 '@type': 'Offer',
 price: service.price,
 priceCurrency: 'EUR'
 }
 }));
 }

 // FAQ Schema
 public getFAQSchema(faqs: Array<{
 question: string;
 answer: string;
 }>): SchemaFAQ {
 return {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: faqs.map(faq => ({
 '@type': 'Question',
 name: faq.question,
 acceptedAnswer: {
 '@type': 'Answer',
 text: faq.answer
 }
 }))
 };
 }

 // Breadcrumb Schema
 public getBreadcrumbSchema(items: Array<{
 name: string;
 url: string;
 }>): SchemaBreadcrumb {
 return {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: items.map((item, index) => ({
 '@type': 'ListItem',
 position: index + 1,
 name: item.name,
 item: item.url
 }))
 };
 }

 // Article Schema for Blog Posts
 public getArticleSchema(article: {
 headline: string;
 description: string;
 image: string;
 author: string;
 datePublished: string;
 dateModified: string;
 publisher: string;
 }) {
 return {
 '@context': 'https://schema.org',
 '@type': 'Article',
 headline: article.headline,
 description: article.description,
 image: article.image,
 author: {
 '@type': 'Person',
 name: article.author
 },
 datePublished: article.datePublished,
 dateModified: article.dateModified,
 publisher: {
 '@type': 'Organization',
 name: article.publisher
 }
 };
 }

 // Event Schema for Webinars/Events
 public getEventSchema(event: {
 name: string;
 description: string;
 startDate: string;
 endDate: string;
 url: string;
 }): SchemaEvent {
 return {
 '@context': 'https://schema.org',
 '@type': 'Event',
 name: event.name,
 description: event.description,
 startDate: event.startDate,
 endDate: event.endDate,
 eventStatus: 'https://schema.org/EventScheduled',
 eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
 location: {
 '@type': 'VirtualLocation',
 url: event.url
 },
 organizer: {
 '@type': 'Organization',
 name: 'ZOE Solar',
 url: 'https://zoe-solar.de'
 }
 };
 }

 // Add all common schemas at once
 public addCommonSchemas(): void {
 // Organization
 this.addSchema(this.getOrganizationSchema(), 'organization');
 
 // Local Business
 this.addSchema(this.getLocalBusinessSchema(), 'local-business');
 }

 // Get current schemas
 public getCurrentSchemas(): Map<string, any> {
 return new Map(this.schemas);
 }

 // Validate schema
 public validateSchema(schema: any): { isValid: boolean; errors: string[] } {
 const errors: string[] = [];
 
 try {
 JSON.stringify(schema);
 } catch (error) {
 errors.push('Invalid JSON format');
 }

 // Check required fields
 if (!schema['@context']) {
 errors.push('Missing @context field');
 }
 if (!schema['@type']) {
 errors.push('Missing @type field');
 }

 return {
 isValid: errors.length === 0,
 errors
 };
 }
}

// React Hook for Schema Markup
export function useSchemaMarkup(schemas: Array<{ name: string; schema: any }>) {
 const schemaService = SchemaMarkupService.getInstance();

 useEffect(() => {
 // Clear existing schemas
 schemaService.getCurrentSchemas().forEach((_, name) => {
 schemaService.removeSchema(name);
 });

 // Add new schemas
 schemas.forEach(({ name, schema }) => {
 schemaService.addSchema(schema, name);
 });

 return () => {
 // Cleanup
 schemas.forEach(({ name }) => {
 schemaService.removeSchema(name);
 });
 };
 }, [schemas]);

 return {
 addSchema: schemaService.addSchema.bind(schemaService),
 removeSchema: schemaService.removeSchema.bind(schemaService),
 validateSchema: schemaService.validateSchema.bind(schemaService)
 };
}

// Schema Markup Components
export const OrganizationSchema: React.FC = () => {
 const schemaService = SchemaMarkupService.getInstance();
 const schema = schemaService.getOrganizationSchema();

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
 />
 );
};

export const LocalBusinessSchema: React.FC = () => {
 const schemaService = SchemaMarkupService.getInstance();
 const schema = schemaService.getLocalBusinessSchema();

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
 />
 );
};

export const ProductSchema: React.FC<{ products: Array<{
 name: string;
 description: string;
 image: string;
 brand: string;
 category: string;
 price: string;
}>}> = ({ products }) => {
 const schemaService = SchemaMarkupService.getInstance();
 const schemas = schemaService.getProductSchema(products);

 return (
 <>
 {schemas.map((schema, index) => (
 <script
 key={index}
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
 />
 ))}
 </>
 );
};

export const ServiceSchema: React.FC<{ services: Array<{
 name: string;
 description: string;
 areaServed: string;
 serviceType: string;
 price: string;
}>}> = ({ services }) => {
 const schemaService = SchemaMarkupService.getInstance();
 const schemas = schemaService.getServiceSchema(services);

 return (
 <>
 {schemas.map((schema, index) => (
 <script
 key={index}
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
 />
 ))}
 </>
 );
};

export const FAQSchema: React.FC<{ faqs: Array<{
 question: string;
 answer: string;
}>}> = ({ faqs }) => {
 const schemaService = SchemaMarkupService.getInstance();
 const schema = schemaService.getFAQSchema(faqs);

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
 />
 );
};

export const BreadcrumbSchema: React.FC<{ items: Array<{
 name: string;
 url: string;
}>}> = ({ items }) => {
 const schemaService = SchemaMarkupService.getInstance();
 const schema = schemaService.getBreadcrumbSchema(items);

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
 />
 );
};

// Comprehensive Schema Provider
export const SchemaProvider: React.FC<{
 children: React.ReactNode;
 organization?: boolean;
 localBusiness?: boolean;
 products?: Array<any>;
 services?: Array<any>;
 faqs?: Array<any>;
 breadcrumbs?: Array<any>;
}> = ({
 children,
 organization = true,
 localBusiness = true,
 products = [],
 services = [],
 faqs = [],
 breadcrumbs = []
}) => {
 return (
 <>
 {organization && <OrganizationSchema />}
 {localBusiness && <LocalBusinessSchema />}
 {products.length > 0 && <ProductSchema products={products} />}
 {services.length > 0 && <ServiceSchema services={services} />}
 {faqs.length > 0 && <FAQSchema faqs={faqs} />}
 {breadcrumbs.length > 0 && <BreadcrumbSchema items={breadcrumbs} />}
 {children}
 </>
 );
};

export default SchemaMarkupService;