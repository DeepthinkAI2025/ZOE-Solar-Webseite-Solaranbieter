import { Organization, LocalBusiness, Service, Product, FAQPage, HowTo, VideoObject, Review, Event, Article, WebPage, BreadcrumbList } from 'schema-dts';

// Types for structured data
interface StructuredDataContext {
  pageType: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  lastModified: string;
  author?: string;
  image?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact?: {
    telephone: string;
    email: string;
    openingHours: string[];
  };
}

interface SolarProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  brand: string;
  model: string;
  powerOutput: number;
  efficiency: number;
  warranty: number;
  certification: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  images: string[];
  specifications: Record<string, string>;
  reviews: {
    author: string;
    rating: number;
    comment: string;
    datePublished: string;
  }[];
}

interface SolarService {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  areaServed: string[];
  priceRange?: string;
  availability: string;
  serviceType: string;
}

class AdvancedStructuredDataService {
  private baseOrganization: Organization = {
    '@type': 'Organization',
    name: 'ZOE Solar GmbH',
    url: 'https://zoe-solar.de',
    logo: 'https://zoe-solar.de/logo.png',
    description: 'Experten für Photovoltaik-Lösungen für Gewerbe und Landwirtschaft',
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: '+49-30-1234567',
      contactType: 'customer service',
      email: 'info@zoe-solar.de',
      availableLanguage: ['German', 'English'],
      hoursAvailable: 'Mo-Fr 08:00-18:00',
    }],
    sameAs: [
      'https://www.facebook.com/zoesolar',
      'https://www.linkedin.com/company/zoe-solar',
      'https://www.youtube.com/channel/zoesolar',
      'https://www.instagram.com/zoe_solar',
    ],
    foundingDate: '2018',
    employeeCount: {
      '@type': 'QuantitativeValue',
      value: 45,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Musterstraße 123',
      addressLocality: 'Berlin',
      postalCode: '10115',
      addressCountry: 'DE',
    },
    award: ['Top Solar Company 2024', 'Innovation Award Renewable Energy 2023'],
    knowsAbout: [
      'Photovoltaik',
      'Solaranlagen',
      'Erneuerbare Energien',
      'Solarmodule',
      'Wechselrichter',
      'Energiespeicher',
      'Ladeinfrastruktur',
      'Agri-PV',
      'Gewerbe-Solar',
    ],
  };

  private localBusinesses: LocalBusiness[] = [
    {
      '@type': 'LocalBusiness',
      parentOrganization: this.baseOrganization,
      name: 'ZOE Solar Berlin',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Musterstraße 123',
        addressLocality: 'Berlin',
        postalCode: '10115',
        addressCountry: 'DE',
      },
      telephone: '+49-30-1234567',
      email: 'berlin@zoe-solar.de',
      openingHours: ['Mo-Fr 08:00-18:00', 'Sa 09:00-14:00'],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 52.5200,
        longitude: 13.4050,
      },
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 52.5200,
          longitude: 13.4050,
        },
        geoRadius: 50000,
      },
    },
    {
      '@type': 'LocalBusiness',
      parentOrganization: this.baseOrganization,
      name: 'ZOE Solar Brandenburg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Industriestr. 45',
        addressLocality: 'Potsdam',
        postalCode: '14469',
        addressCountry: 'DE',
      },
      telephone: '+49-331-1234567',
      email: 'brandenburg@zoe-solar.de',
      openingHours: ['Mo-Fr 08:00-17:00'],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 52.4125,
        longitude: 12.5316,
      },
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 52.4125,
          longitude: 12.5316,
        },
        geoRadius: 75000,
      },
    },
  ];

  public generateOrganizationSchema = (): Organization => {
    return this.baseOrganization;
  };

  public generateLocalBusinessSchema = (location: string): LocalBusiness | null => {
    const business = this.localBusinesses.find(b =>
      b.name?.toLowerCase().includes(location.toLowerCase()) ||
      b.address?.addressLocality?.toLowerCase().includes(location.toLowerCase())
    );
    return business || this.localBusinesses[0];
  };

  public generateProductSchema = (product: SolarProduct): Product => {
    const aggregateRating = product.reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length,
      reviewCount: product.reviews.length,
      bestRating: 5,
      worstRating: 1,
    } : undefined;

    const reviews = product.reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      reviewBody: review.comment,
      datePublished: review.datePublished,
    })) as Review[];

    return {
      '@type': 'Product',
      name: product.name,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      model: product.model,
      manufacturer: {
        '@type': 'Organization',
        name: product.brand,
      },
      image: product.images,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: `https://schema.org/${product.availability}`,
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        seller: this.baseOrganization,
      },
      aggregateRating,
      review: reviews,
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Leistung',
          value: `${product.powerOutput} Wp`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Wirkungsgrad',
          value: `${product.efficiency}%`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Garantie',
          value: `${product.warranty} Jahre`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Zertifizierung',
          value: product.certification,
        },
      ],
    } as Product;
  };

  public generateServiceSchema = (service: SolarService): Service => {
    return {
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: service.provider,
        url: 'https://zoe-solar.de',
      },
      serviceType: service.serviceType,
      category: service.category,
      areaServed: service.areaServed.map(area => ({
        '@type': 'Place',
        name: area,
      })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Solar Services',
        itemListElement: [{
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
          },
          priceSpecification: service.priceRange ? {
            '@type': 'PriceSpecification',
            priceRange: service.priceRange,
            priceCurrency: 'EUR',
          } : undefined,
        }],
      },
      hoursAvailable: ['Mo-Fr 08:00-18:00'],
    } as Service;
  };

  public generateFAQSchema = (faqs: Array<{ question: string; answer: string }>): FAQPage => {
    return {
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    } as FAQPage;
  };

  public generateHowToSchema = (howTo: {
    name: string;
    description: string;
    image?: string;
    steps: Array<{ name: string; text: string; image?: string }>;
    totalTime?: string;
    estimatedCost?: { currency: string; value: number };
    tool?: string[];
    supply?: string[];
  }): HowTo => {
    return {
      '@type': 'HowTo',
      name: howTo.name,
      description: howTo.description,
      image: howTo.image,
      totalTime: howTo.totalTime,
      estimatedCost: howTo.estimatedCost ? {
        '@type': 'MonetaryAmount',
        currency: howTo.estimatedCost.currency,
        value: howTo.estimatedCost.value,
      } : undefined,
      tool: howTo.tool?.map(tool => ({
        '@type': 'HowToTool',
        name: tool,
      })),
      supply: howTo.supply?.map(supply => ({
        '@type': 'HowToSupply',
        name: supply,
      })),
      step: howTo.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        image: step.image,
      })),
    } as HowTo;
  };

  public generateVideoObjectSchema = (video: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    contentUrl?: string;
    embedUrl?: string;
    width?: number;
    height?: number;
    caption?: string;
    transcript?: string;
  }): VideoObject => {
    return {
      '@type': 'VideoObject',
      name: video.name,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      uploadDate: video.uploadDate,
      duration: video.duration,
      contentUrl: video.contentUrl,
      embedUrl: video.embedUrl,
      width: video.width,
      height: video.height,
      caption: video.caption,
      transcript: video.transcript,
      publisher: this.baseOrganization,
    } as VideoObject;
  };

  public generateEventSchema = (event: {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: {
      name: string;
      address: {
        streetAddress: string;
        addressLocality: string;
        postalCode: string;
        addressCountry: string;
      };
    };
    image?: string;
    url?: string;
    isAccessibleForFree?: boolean;
    offers?: {
      price: string;
      priceCurrency: string;
      availability: string;
      url: string;
    }[];
  }): Event => {
    return {
      '@type': 'Event',
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: event.location.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: event.location.address.streetAddress,
          addressLocality: event.location.address.addressLocality,
          postalCode: event.location.address.postalCode,
          addressCountry: event.location.address.addressCountry,
        },
      },
      image: event.image,
      url: event.url,
      isAccessibleForFree: event.isAccessibleForFree ?? true,
      offers: event.offers?.map(offer => ({
        '@type': 'Offer',
        price: offer.price,
        priceCurrency: offer.priceCurrency,
        availability: `https://schema.org/${offer.availability}`,
        url: offer.url,
        validFrom: event.startDate,
      })),
      organizer: this.baseOrganization,
    } as Event;
  };

  public generateArticleSchema = (article: {
    headline: string;
    description: string;
    image: string[];
    author: string;
    datePublished: string;
    dateModified?: string;
    articleBody?: string;
    wordCount?: number;
    keywords?: string[];
  }): Article => {
    return {
      '@type': 'Article',
      headline: article.headline,
      description: article.description,
      image: article.image,
      author: {
        '@type': 'Person',
        name: article.author,
      },
      publisher: this.baseOrganization,
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      articleBody: article.articleBody,
      wordCount: article.wordCount,
      keywords: article.keywords?.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://zoe-solar.de',
      },
    } as Article;
  };

  public generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>): BreadcrumbList => {
    return {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
      })),
    } as BreadcrumbList;
  };

  public generateWebPageSchema = (context: StructuredDataContext): WebPage => {
    return {
      '@type': 'WebPage',
      name: context.title,
      description: context.description,
      url: context.url,
      inLanguage: 'de-DE',
      dateModified: context.lastModified,
      primaryImageOfPage: context.image,
      author: context.author ? {
        '@type': 'Person',
        name: context.author,
      } : undefined,
      publisher: this.baseOrganization,
      keywords: context.keywords.join(', '),
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: this.generateBreadcrumbsFromUrl(context.url),
      },
      mainEntity: this.generateMainEntity(context),
    } as WebPage;
  };

  private generateBreadcrumbsFromUrl = (url: string): Array<{}> => {
    const breadcrumbs = [{
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://zoe-solar.de',
    }];

    const pathParts = url.replace('https://zoe-solar.de', '').split('/').filter(Boolean);
    let currentPath = 'https://zoe-solar.de';

    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;
      const name = this.formatBreadcrumbName(part);
      breadcrumbs.push({
        '@type': 'ListItem',
        position: index + 2,
        name: name,
        item: currentPath,
      });
    });

    return breadcrumbs;
  };

  private formatBreadcrumbName = (pathPart: string): string => {
    const nameMap: Record<string, string> = {
      'photovoltaik': 'Photovoltaik',
      'agri-pv': 'Agri-PV',
      'foerdermittel': 'Fördermittel',
      'projekte': 'Projekte',
      'kontakt': 'Kontakt',
      'ueber-uns': 'Über uns',
      'karriere': 'Karriere',
      'preisrechner': 'Preisrechner',
      'beratung': 'Beratung',
      'finanzierung': 'Finanzierung',
    };

    return nameMap[pathPart] || pathPart.charAt(0).toUpperCase() + pathPart.slice(1).replace(/-/g, ' ');
  };

  private generateMainEntity = (context: StructuredDataContext): any => {
    switch (context.pageType) {
      case 'product':
        return {
          '@type': 'Product',
          name: context.title,
          description: context.description,
        };
      case 'service':
        return {
          '@type': 'Service',
          name: context.title,
          description: context.description,
        };
      case 'article':
        return {
          '@type': 'Article',
          headline: context.title,
          description: context.description,
        };
      case 'local':
        return this.generateLocalBusinessSchema('berlin');
      default:
        return this.baseOrganization;
    }
  };

  public generateAllStructuredData = (context: StructuredDataContext): string[] => {
    const structuredData: string[] = [];

    // Always include Organization and WebPage
    structuredData.push(JSON.stringify(this.generateOrganizationSchema()));
    structuredData.push(JSON.stringify(this.generateWebPageSchema(context)));

    // Add specific schemas based on context
    if (context.pageType === 'local') {
      const localBusiness = this.generateLocalBusinessSchema('berlin');
      if (localBusiness) {
        structuredData.push(JSON.stringify(localBusiness));
      }
    }

    return structuredData;
  };

  public injectStructuredData = (structuredData: string[]): void => {
    if (typeof document === 'undefined') return;

    // Remove existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Inject new structured data scripts
    structuredData.forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = data;
      document.head.appendChild(script);
    });
  };
}

// Export singleton instance
export const advancedStructuredDataService = new AdvancedStructuredDataService();

export type { StructuredDataContext, SolarProduct, SolarService };