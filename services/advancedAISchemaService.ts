/**
 * Advanced AI Schema Service für Google AI Overview & KI-Systeme
 * Implementiert Speakable, VideoObject, Multi-level FAQ und weitere AI-optimierte Schemas
 */

import { completeFAQSchema } from '../data/faqSchemaData';

export interface AISchemaConfig {
  enableSpeakableSchema: boolean;
  enableVideoObjectSchema: boolean;
  enableMultilevelFAQ: boolean;
  enableDatasetSchema: boolean;
  enableQuotationSchema: boolean;
}

export class AdvancedAISchemaService {
  private config: AISchemaConfig;

  constructor(config: AISchemaConfig = {
    enableSpeakableSchema: true,
    enableVideoObjectSchema: true,
    enableMultilevelFAQ: true,
    enableDatasetSchema: true,
    enableQuotationSchema: true
  }) {
    this.config = config;
  }

  /**
   * Generiert SpeakableSchema für Voice Search Optimization
   */
  generateSpeakableSchema(content: {
    title: string;
    speakableText: string[];
    cssSelectors?: string[];
    xpath?: string[];
  }) {
    if (!this.config.enableSpeakableSchema) return null;

    return {
      "@context": "https://schema.org",
      "@type": "SpeakableSpecification",
      "cssSelector": content.cssSelectors || [
        ".speakable-text",
        ".faq-answer",
        ".service-description",
        ".hero-title",
        ".value-proposition"
      ],
      "xpath": content.xpath || [
        "/html/head/title",
        "/html/body/h1",
        "/html/body/h2"
      ]
    };
  }

  /**
   * Generiert VideoObject Schema für Demo-Videos
   */
  generateVideoObjectSchema(video: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration?: string;
    contentUrl?: string;
    embedUrl?: string;
    transcript?: string;
  }) {
    if (!this.config.enableVideoObjectSchema) return null;

    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": video.name,
      "description": video.description,
      "thumbnailUrl": video.thumbnailUrl,
      "uploadDate": video.uploadDate,
      "duration": video.duration || "PT5M30S",
      "contentUrl": video.contentUrl,
      "embedUrl": video.embedUrl,
      "transcript": video.transcript,
      "publisher": {
        "@type": "Organization",
        "name": "ZOE Solar",
        "url": "https://zoe-solar.de"
      }
    };
  }

  /**
   * Generiert Multi-level FAQ Schema mit Kategorisierung
   */
  generateMultilevelFAQSchema(categories: Array<{
    categoryName: string;
    categoryDescription: string;
    questions: Array<{
      question: string;
      answer: string;
      followUpQuestions?: string[];
      relatedTopics?: string[];
    }>;
  }>) {
    if (!this.config.enableMultilevelFAQ) return null;

    const mainEntity = categories.flatMap(category =>
      category.questions.map((qa, index) => ({
        "@type": "Question",
        "name": qa.question,
        "text": qa.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qa.answer,
          "answerCount": qa.followUpQuestions?.length || 1,
          "suggestedAnswer": qa.followUpQuestions?.map(faq => ({
            "@type": "Answer",
            "text": faq
          })),
          "about": {
            "@type": "Thing",
            "name": category.categoryName,
            "description": category.categoryDescription
          },
          "mentions": qa.relatedTopics?.map(topic => ({
            "@type": "Thing",
            "name": topic
          }))
        },
        "position": index + 1,
        "about": {
          "@type": "Thing",
          "name": category.categoryName,
          "description": category.categoryDescription
        }
      }))
    );

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": mainEntity,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": categories.map((cat, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": cat.categoryName,
          "item": `https://zoe-solar.de/wissen/faq#${cat.categoryName.toLowerCase().replace(/\s+/g, '-')}`
        }))
      }
    };
  }

  /**
   * Generiert Dataset Schema für KI-Trainingsdaten
   */
  generateDatasetSchema(dataset: {
    name: string;
    description: string;
    license: string;
    creator: string;
    keywords: string[];
    datePublished: string;
    dateModified: string;
  }) {
    if (!this.config.enableDatasetSchema) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": dataset.name,
      "description": dataset.description,
      "license": dataset.license,
      "creator": {
        "@type": "Organization",
        "name": dataset.creator,
        "url": "https://zoe-solar.de"
      },
      "keywords": dataset.keywords.join(", "),
      "datePublished": dataset.datePublished,
      "dateModified": dataset.dateModified,
      "distribution": [
        {
          "@type": "DataDownload",
          "encodingFormat": "application/ld+json",
          "contentUrl": "https://zoe-solar.de/api/faq-data"
        }
      ],
      "variableMeasured": [
        {
          "@type": "PropertyValue",
          "name": "FAQ Count",
          "value": "39",
          "unitText": "questions"
        },
        {
          "@type": "PropertyValue",
          "name": "Content Quality",
          "value": "Expert",
          "unitText": "level"
        },
        {
          "@type": "PropertyValue",
          "name": "Update Frequency",
          "value": "Monthly",
          "unitText": "frequency"
        }
      ]
    };
  }

  /**
   * Generiert Quotation Schema für Experten-Zitate
   */
  generateQuotationSchema(quotation: {
    text: string;
    author: string;
    authorTitle: string;
    authorJobTitle?: string;
    source?: string;
    dateCreated?: string;
  }) {
    if (!this.config.enableQuotationSchema) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Quotation",
      "text": quotation.text,
      "author": {
        "@type": "Person",
        "name": quotation.author,
        "jobTitle": quotation.authorJobTitle || "Solar Energy Expert",
        "worksFor": {
          "@type": "Organization",
          "name": "ZOE Solar",
          "url": "https://zoe-solar.de"
        }
      },
      "source": quotation.source || "ZOE Solar Expert Analysis",
      "dateCreated": quotation.dateCreated || new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Generiert Course Schema für Schulungen und Zertifizierungen
   */
  generateCourseSchema(course: {
    name: string;
    description: string;
    provider: string;
    educationalLevel: string;
    about: string[];
    datePublished?: string;
    duration?: string;
    inLanguage?: string;
    offers?: {
      price: string;
      priceCurrency: string;
      availability: string;
    };
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.name,
      "description": course.description,
      "provider": {
        "@type": "Organization",
        "name": course.provider,
        "url": "https://zoe-solar.de"
      },
      "educationalLevel": course.educationalLevel,
      "about": course.about.map(topic => ({
        "@type": "Thing",
        "name": topic
      })),
      "datePublished": course.datePublished || new Date().toISOString().split('T')[0],
      "timeRequired": course.duration || "PT8H",
      "inLanguage": course.inLanguage || "de",
      "offers": course.offers || {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }
    };
  }

  /**
   * Generiert Event Schema für Webinare und Veranstaltungen
   */
  generateEventSchema(event: {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location?: {
      type: string;
      name: string;
      url?: string;
    };
    organizer: {
      name: string;
      url: string;
    };
    offers?: {
      price: string;
      priceCurrency: string;
      availability: string;
      url: string;
    };
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.name,
      "description": event.description,
      "startDate": event.startDate,
      "endDate": event.endDate,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": event.location?.type === "VirtualLocation"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
      "location": event.location || {
        "@type": "VirtualLocation",
        "url": "https://zoe-solar.de/webinar"
      },
      "organizer": {
        "@type": "Organization",
        "name": event.organizer.name,
        "url": event.organizer.url
      },
      "offers": event.offers || {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": "https://zoe-solar.de/webinar-registration"
      }
    };
  }

  /**
   * Kombiniert alle AI-Schemas zu einer umfassenden Struktur
   */
  generateComprehensiveAISchema(pageData: {
    title: string;
    description: string;
    content: string;
    videos?: any[];
    categories?: any[];
    quotations?: any[];
    courses?: any[];
    events?: any[];
  }) {
    const schemas: any[] = [];

    // Haupt-FAQ Schema
    schemas.push(completeFAQSchema);

    // Speakable Schema
    if (this.config.enableSpeakableSchema) {
      const speakableSchema = this.generateSpeakableSchema({
        title: pageData.title,
        speakableText: this.extractSpeakableText(pageData.content)
      });
      if (speakableSchema) schemas.push(speakableSchema);
    }

    // VideoObject Schemas
    if (this.config.enableVideoObjectSchema && pageData.videos) {
      pageData.videos.forEach(video => {
        const videoSchema = this.generateVideoObjectSchema(video);
        if (videoSchema) schemas.push(videoSchema);
      });
    }

    // Multi-level FAQ Schema
    if (this.config.enableMultilevelFAQ && pageData.categories) {
      const faqSchema = this.generateMultilevelFAQSchema(pageData.categories);
      if (faqSchema) schemas.push(faqSchema);
    }

    // Dataset Schema
    if (this.config.enableDatasetSchema) {
      const datasetSchema = this.generateDatasetSchema({
        name: "ZOE Solar FAQ Dataset",
        description: "Comprehensive FAQ dataset about solar energy systems, optimized for AI training and machine learning applications",
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: "ZOE Solar",
        keywords: ["solar energy", "photovoltaik", "renewable energy", "FAQ", "expert knowledge"],
        datePublished: "2024-11-01",
        dateModified: new Date().toISOString().split('T')[0]
      });
      if (datasetSchema) schemas.push(datasetSchema);
    }

    // Quotation Schemas
    if (this.config.enableQuotationSchema && pageData.quotations) {
      pageData.quotations.forEach(quotation => {
        const quotationSchema = this.generateQuotationSchema(quotation);
        if (quotationSchema) schemas.push(quotationSchema);
      });
    }

    // Course Schemas
    if (pageData.courses) {
      pageData.courses.forEach(course => {
        const courseSchema = this.generateCourseSchema(course);
        if (courseSchema) schemas.push(courseSchema);
      });
    }

    // Event Schemas
    if (pageData.events) {
      pageData.events.forEach(event => {
        const eventSchema = this.generateEventSchema(event);
        if (eventSchema) schemas.push(eventSchema);
      });
    }

    return {
      "@context": [
        "https://schema.org",
        {
          "@vocab": "https://schema.org/"
        }
      ],
      "@graph": schemas,
      "metadata": {
        "aiOptimized": true,
        "googleAIOverviewReady": true,
        "voiceSearchReady": true,
        "generatedBy": "ZOE Solar Advanced AI Schema Service",
        "version": "1.0.0",
        "lastUpdated": new Date().toISOString()
      }
    };
  }

  /**
   * Extrahiert speakable Text aus Content
   */
  private extractSpeakableText(content: string): string[] {
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    return sentences
      .filter(sentence => sentence.length > 20 && sentence.length < 200)
      .map(sentence => sentence.trim())
      .slice(0, 10); // Top 10 speakable sentences
  }
}

// Export Singleton Instance
export const advancedAISchemaService = new AdvancedAISchemaService();