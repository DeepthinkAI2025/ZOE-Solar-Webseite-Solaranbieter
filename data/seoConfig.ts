import { Page } from '../types';
import { HeroData, pageHeroData } from './pageContent';
import { Guide } from './guidesData';
import { Manufacturer } from './products';
import { UseCase } from './useCases';
import { faqData, FaqItem, FaqCategory } from './faqData';
import { PricingPackage, pricingPackages } from './pricingPackages';
import { Article } from './articles';
import { localContentByCity } from './localContent';

export interface OpenGraphMeta {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  url?: string;
  siteName?: string;
  locale?: string;
}

export interface TwitterMeta {
  card?: 'summary' | 'summary_large_image';
  title?: string;
  description?: string;
  image?: string;
  site?: string;
  creator?: string;
  imageAlt?: string;
}

export interface AlternateHref {
  hrefLang: string;
  href: string;
}

export interface GeoMeta {
  region?: string;
  placename?: string;
  latitude?: number;
  longitude?: number;
  position?: string;
}

export interface AdditionalMetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;
  og?: OpenGraphMeta;
  twitter?: TwitterMeta;
  alternates?: AlternateHref[];
  geo?: GeoMeta;
  structuredData?: object[];
  additionalMeta?: AdditionalMetaTag[];
}

export interface ResolvedSEO extends Required<Omit<SEOConfig, 'canonical' | 'robots'>> {
  canonical: string;
  url: string;
  keywords: string[];
  structuredData: object[];
  additionalMeta: AdditionalMetaTag[];
  alternates: AlternateHref[];
  og: OpenGraphMeta;
  twitter: TwitterMeta;
  geo: GeoMeta;
  robots?: string;
}

export interface DynamicSeoInput {
  page: Page;
  pathname: string;
  article?: Article;
  guide?: Guide;
  manufacturer?: Manufacturer;
  useCase?: UseCase;
}

const BASE_URL = 'https://www.zoe-solar.de';
const DEFAULT_SHARE_IMAGE = 'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop';
const ORGANIZATION_NAME = 'ZOE Solar GmbH';
const ORGANIZATION_LOGO = 'https://www.zoe-solar.de/assets/logo.png';
const DEFAULT_SHARE_IMAGE_WIDTH = 1200;
const DEFAULT_SHARE_IMAGE_HEIGHT = 630;
const DEFAULT_SHARE_IMAGE_TYPE = 'image/jpeg';

export interface ServiceRegion {
  city: string;
  state: string;
  regionCode: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  slug?: string;
}

export const PRIMARY_SERVICE_REGIONS: ServiceRegion[] = [
  {
    city: 'Berlin',
    state: 'Berlin',
    regionCode: 'DE-BE',
    postalCode: '10115',
    latitude: 52.520008,
    longitude: 13.404954,
    radiusKm: 180,
  },
  {
    city: 'Hamburg',
    state: 'Hamburg',
    regionCode: 'DE-HH',
    postalCode: '20095',
    latitude: 53.551086,
    longitude: 9.993682,
    radiusKm: 120,
  },
  {
    city: 'München',
    state: 'Bayern',
    regionCode: 'DE-BY',
    postalCode: '80331',
    latitude: 48.135125,
    longitude: 11.581981,
    radiusKm: 160,
  },
  {
    city: 'Köln',
    state: 'Nordrhein-Westfalen',
    regionCode: 'DE-NW',
    postalCode: '50667',
    latitude: 50.937531,
    longitude: 6.960279,
    radiusKm: 140,
  },
  {
    city: 'Frankfurt am Main',
    state: 'Hessen',
    regionCode: 'DE-HE',
    postalCode: '60311',
    latitude: 50.110924,
    longitude: 8.682127,
    radiusKm: 130,
    slug: 'frankfurt',
  },
  {
    city: 'Stuttgart',
    state: 'Baden-Württemberg',
    regionCode: 'DE-BW',
    postalCode: '70173',
    latitude: 48.775845,
    longitude: 9.182932,
    radiusKm: 120,
  },
  {
    city: 'Düsseldorf',
    state: 'Nordrhein-Westfalen',
    regionCode: 'DE-NW',
    postalCode: '40213',
    latitude: 51.227741,
    longitude: 6.773456,
    radiusKm: 120,
  },
  {
    city: 'Leipzig',
    state: 'Sachsen',
    regionCode: 'DE-SN',
    postalCode: '04109',
    latitude: 51.339695,
    longitude: 12.373075,
    radiusKm: 110,
  },
  {
    city: 'Hannover',
    state: 'Niedersachsen',
    regionCode: 'DE-NI',
    postalCode: '30159',
    latitude: 52.375892,
    longitude: 9.73201,
    radiusKm: 110,
  },
  {
    city: 'Nürnberg',
    state: 'Bayern',
    regionCode: 'DE-BY',
    postalCode: '90402',
    latitude: 49.452103,
    longitude: 11.076665,
    radiusKm: 100,
  },
  {
    city: 'Dresden',
    state: 'Sachsen',
    regionCode: 'DE-SN',
    postalCode: '01067',
    latitude: 51.050409,
    longitude: 13.737262,
    radiusKm: 110,
  },
  {
    city: 'Bremen',
    state: 'Bremen',
    regionCode: 'DE-HB',
    postalCode: '28195',
    latitude: 53.079296,
    longitude: 8.801694,
    radiusKm: 100,
  },
  {
    city: 'Wien',
    state: 'Wien',
    regionCode: 'AT-9',
    postalCode: '1010',
    latitude: 48.208174,
    longitude: 16.373819,
    radiusKm: 120,
  },
  {
    city: 'Graz',
    state: 'Steiermark',
    regionCode: 'AT-6',
    postalCode: '8010',
    latitude: 47.070714,
    longitude: 15.439504,
    radiusKm: 100,
  },
  {
    city: 'Linz',
    state: 'Oberösterreich',
    regionCode: 'AT-4',
    postalCode: '4020',
    latitude: 48.30694,
    longitude: 14.28583,
    radiusKm: 90,
  },
  {
    city: 'Salzburg',
    state: 'Salzburg',
    regionCode: 'AT-5',
    postalCode: '5020',
    latitude: 47.80949,
    longitude: 13.05501,
    radiusKm: 90,
  },
  {
    city: 'Innsbruck',
    state: 'Tirol',
    regionCode: 'AT-7',
    postalCode: '6020',
    latitude: 47.269212,
    longitude: 11.404102,
    radiusKm: 80,
  },
  {
    city: 'Zürich',
    state: 'Zürich',
    regionCode: 'CH-ZH',
    postalCode: '8001',
    latitude: 47.376887,
    longitude: 8.541694,
    radiusKm: 90,
  },
  {
    city: 'Basel',
    state: 'Basel-Stadt',
    regionCode: 'CH-BS',
    postalCode: '4051',
    latitude: 47.559599,
    longitude: 7.588576,
    radiusKm: 80,
  },
  {
    city: 'Bern',
    state: 'Bern',
    regionCode: 'CH-BE',
    postalCode: '3011',
    latitude: 46.947974,
    longitude: 7.447447,
    radiusKm: 80,
  },
  {
    city: 'Genf',
    state: 'Genf',
    regionCode: 'CH-GE',
    postalCode: '1201',
    latitude: 46.204391,
    longitude: 6.143158,
    radiusKm: 70,
  },
  {
    city: 'Lausanne',
    state: 'Waadt',
    regionCode: 'CH-VD',
    postalCode: '1003',
    latitude: 46.519653,
    longitude: 6.632273,
    radiusKm: 70,
  },
];

const monthMap: Record<string, number> = {
  januar: 1,
  februar: 2,
  märz: 3,
  aprile: 4,
  april: 4,
  mai: 5,
  juni: 6,
  juli: 7,
  august: 8,
  september: 9,
  oktober: 10,
  november: 11,
  dezember: 12,
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

const getRegionCountryCode = (regionCode: string): string => {
  const [country = 'DE'] = regionCode.split('-');
  return country.toUpperCase();
};

const SERVICE_REGION_SLUG_MAP = new Map<string, ServiceRegion>();

PRIMARY_SERVICE_REGIONS.forEach((region) => {
  const explicitSlug = region.slug;
  const inferredSlug = slugify(region.city);
  if (explicitSlug) {
    SERVICE_REGION_SLUG_MAP.set(explicitSlug, region);
  }
  SERVICE_REGION_SLUG_MAP.set(inferredSlug, region);
});

export const getServiceRegionBySlug = (value: string): ServiceRegion | undefined => {
  if (!value) return undefined;
  const normalized = slugify(value);
  return SERVICE_REGION_SLUG_MAP.get(normalized);
};

export const getServiceRegionSlug = (region: ServiceRegion): string => region.slug ?? slugify(region.city);

const locationSeoCache = new Map<string, SEOConfig>();

const toAbsoluteUrl = (path: string): string => {
  if (!path) {
    return BASE_URL;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('//')) {
    return `https:${path}`;
  }
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalised}`;
};

const normalisePath = (pathname: string): string => {
  if (!pathname || pathname === '/') {
    return '/';
  }
  const [cleanPath] = pathname.split('?');
  const trimmed = cleanPath.replace(/\/+$/, '');
  if (!trimmed || trimmed === '') {
    return '/';
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const parseGermanDateToISO = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const cleaned = value.replace(/\./g, '').trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length < 3) return undefined;
  const [dayString, monthString, yearString] = parts;
  const day = Number.parseInt(dayString, 10);
  const month = monthMap[monthString.toLowerCase()];
  const year = Number.parseInt(yearString, 10);
  if (!day || !month || !year) return undefined;
  const iso = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(iso.getTime())) return undefined;
  return iso.toISOString();
};

const dedupe = <T>(items: T[], keyGetter: (item: T) => string): T[] => {
  const map = new Map<string, T>();
  items.forEach((item) => {
    const key = keyGetter(item);
    if (!map.has(key)) {
      map.set(key, item);
    }
  });
  return Array.from(map.values());
};

const dedupeStructuredData = (data: object[]): object[] => {
  return dedupe(data, (entry) => JSON.stringify(entry));
};

const buildLocalBusinessBranches = (): object[] =>
  PRIMARY_SERVICE_REGIONS.map((region) => {
    const slug = getServiceRegionSlug(region);
    const countryCode = getRegionCountryCode(region.regionCode);
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/standort/${slug}#local-business-${region.regionCode.toLowerCase()}`,
      name: `${ORGANIZATION_NAME} ${region.city}`,
      image: DEFAULT_SHARE_IMAGE,
      url: `${BASE_URL}/standort/${slug}`,
      parentOrganization: {
        '@id': `${BASE_URL}#organization`,
        '@type': 'Organization',
        name: ORGANIZATION_NAME,
      },
      telephone: '+49-30-123-456-78',
      priceRange: '€€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Musterstraße 123',
        addressLocality: region.city,
        addressRegion: region.state,
        postalCode: region.postalCode,
        addressCountry: countryCode,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: region.latitude,
        longitude: region.longitude,
      },
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: region.latitude,
          longitude: region.longitude,
        },
        geoRadius: region.radiusKm * 1000,
      },
      availableService: [
        {
          '@type': 'Service',
          name: 'Photovoltaik Komplettlösungen',
          serviceType: 'Photovoltaikplanung',
          areaServed: region.city,
          provider: {
            '@type': 'Organization',
            name: ORGANIZATION_NAME,
            url: BASE_URL,
          },
        },
      ],
    };
  });

const buildRegionalServiceSchemas = (serviceName: string, description: string, serviceUrl: string): object[] =>
  PRIMARY_SERVICE_REGIONS.map((region) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${serviceName} ${region.city}`,
    serviceType: serviceName,
    description,
    url: serviceUrl,
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'City',
      name: region.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: region.city,
        addressRegion: region.state,
        postalCode: region.postalCode,
        addressCountry: 'DE',
      },
    },
    hasServiceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: region.latitude,
        longitude: region.longitude,
      },
      geoRadius: region.radiusKm * 1000,
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${serviceUrl}?region=${region.regionCode.toLowerCase()}`,
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: '+49-30-123-456-78',
        contactType: 'customer support',
        areaServed: region.regionCode,
        availableLanguage: ['de', 'en'],
      },
    },
  }));

interface FaqSelectionOptions {
  categories: FaqCategory[];
  limit?: number;
  region?: string;
}

const selectFaqEntries = ({ categories, limit = 4, region }: FaqSelectionOptions): FaqItem[] => {
  const regionSlug = region ? slugify(region) : undefined;
  return faqData
    .filter((item) => {
      const matchesCategory = categories.includes(item.category);
      if (!matchesCategory) {
        return false;
      }
      if (!regionSlug || !item.regions || item.regions.length === 0) {
        return true;
      }
      return item.regions.some((entry) => slugify(entry) === regionSlug);
    })
    .slice(0, limit);
};

const normaliseAnswerText = (value: string): string => value.replace(/\*\*/g, '');

const buildFaqSchema = (name: string, description: string, items: FaqItem[]): object[] => {
  if (!items.length) {
    return [];
  }
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name,
      description,
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: normaliseAnswerText(item.answer),
        },
      })),
    },
  ];
};

const buildSpeakableSchema = (name: string, selectors: string[]): object[] => {
  if (!selectors.length) {
    return [];
  }
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: selectors,
      },
    },
  ];
};

const buildLocationContentSchemas = (region: ServiceRegion, slug: string, canonical: string): object[] => {
  const localContent = (localContentByCity as Record<string, typeof localContentByCity[keyof typeof localContentByCity]>)[slug];
  if (!localContent) {
    return [];
  }

  const blogPosts = localContent.blogPosts ?? [];
  const caseStudies = localContent.caseStudies ?? [];
  const serviceLinks = localContent.serviceLinks ?? [];

  const blogList = blogPosts.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${canonical}#local-articles`,
        name: `Solar-Insights für ${region.city}`,
        itemListElement: blogPosts.slice(0, 5).map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            name: post.title,
            description: post.description,
            url: toAbsoluteUrl(post.url),
          },
        })),
      }
    : undefined;

  const caseStudyList = caseStudies.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${canonical}#local-case-studies`,
        name: `Referenzen & Projekte in ${region.city}`,
        itemListElement: caseStudies.slice(0, 4).map((study, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CaseStudy',
            name: study.title,
            description: study.description,
            url: study.url ? toAbsoluteUrl(study.url) : canonical,
            additionalProperty: (study.highlights ?? []).map((highlight) => ({
              '@type': 'PropertyValue',
              name: highlight.label,
              value: highlight.value,
            })),
          },
        })),
      }
    : undefined;

  const serviceCatalog = serviceLinks.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        '@id': `${canonical}#local-services`,
        name: `Dienstleistungen in ${region.city}`,
        itemListElement: serviceLinks.slice(0, 6).map((service, index) => ({
          '@type': 'Offer',
          position: index + 1,
          name: service.title,
          description: service.description,
          url: toAbsoluteUrl(service.url),
          price: '0',
          priceCurrency: 'EUR',
        })),
      }
    : undefined;

  return [blogList, caseStudyList, serviceCatalog].filter(Boolean) as object[];
};

const buildLocationStructuredData = (region: ServiceRegion, slug: string): object[] => {
  const canonical = `${BASE_URL}/standort/${slug}`;
  const countryCode = getRegionCountryCode(region.regionCode);
  const faqItems = selectFaqEntries({ categories: ['Allgemein', 'Förderung', 'Technik', 'Region'], region: slug, limit: 4 });

  const faqSchemas = buildFaqSchema(
    `Solaranlagen ${region.city} FAQ`,
    `Häufige Fragen zu Photovoltaik in ${region.city} und ${region.state}.`,
    faqItems,
  );

  const qaSchema = faqItems.length
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'QAPage',
          name: `Antworten zu Photovoltaik in ${region.city}`,
          inLanguage: 'de-DE',
          url: canonical,
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: normaliseAnswerText(item.answer),
            },
          })),
          about: {
            '@type': 'City',
            name: region.city,
            address: {
              '@type': 'PostalAddress',
              addressLocality: region.city,
              addressRegion: region.state,
              addressCountry: countryCode,
            },
          },
        },
      ]
    : [];

  const speakable = buildSpeakableSchema(`Solaranlagen ${region.city} | ZOE Solar`, [
    '.page-hero-title',
    '.page-hero-subtitle',
    '.faq-section .faq-item h3',
  ]);

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${canonical}#how-to`,
    name: `In ${region.city} mit ZOE Solar starten`,
    description: `So läuft der Projektstart für Ihre Photovoltaikanlage in ${region.city}: von der Potenzialanalyse bis zur schlüsselfertigen Übergabe.`,
    inLanguage: 'de-DE',
    supply: 'Projektinformationen zu Standort, Dach- oder Freifläche, Energiebedarf',
    tool: 'Digitale Potenzialanalyse & Projektplaner von ZOE Solar',
    totalTime: 'P30D',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Kostenlose Erstberatung & Standortanalyse',
        text: `Wir analysieren Dach- und Flächenpotenziale in ${region.city}, prüfen Denkmalschutz, Netzanschluss und Förderungen.`,
        url: `${canonical}#erstberatung`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Technische Planung & Wirtschaftlichkeit',
        text: `Detaillierte Auslegung der Photovoltaik- und Speichertechnik inklusive Ertragsprognose, CAPEX/OPEX-Modell und Förderstrategie für ${region.city}.`,
        url: `${canonical}#planung`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Installation, Netzanschluss & Betrieb',
        text: `Schlüsselfertige Umsetzung mit eigenen Montageteams, Netzanschlusskoordination und 24/7-Monitoring für Anlagen in ${region.city}.`,
        url: `${canonical}#installation`,
      },
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Standorte', item: `${BASE_URL}/standort` },
      { '@type': 'ListItem', position: 3, name: region.city, item: canonical },
    ],
  };

  const geoCircle = {
    '@context': 'https://schema.org',
    '@type': 'GeoCircle',
    '@id': `${canonical}#service-area`,
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: region.latitude,
      longitude: region.longitude,
    },
    geoRadius: region.radiusKm * 1000,
    name: `Einsatzgebiet ${region.city}`,
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${canonical}#local-business`,
    name: `${ORGANIZATION_NAME} ${region.city}`,
    image: DEFAULT_SHARE_IMAGE,
    url: canonical,
    parentOrganization: {
      '@id': `${BASE_URL}#organization`,
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
    },
    telephone: '+49-30-123-456-78',
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Musterstraße 123',
      addressLocality: region.city,
      addressRegion: region.state,
      postalCode: region.postalCode,
      addressCountry: countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: region.latitude,
      longitude: region.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${region.latitude},${region.longitude}`,
    areaServed: {
      '@type': 'City',
      name: region.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: region.city,
        addressRegion: region.state,
        addressCountry: countryCode,
      },
    },
    serviceArea: geoCircle,
    availableService: [
      {
        '@type': 'Service',
        name: `Photovoltaik & Speicher in ${region.city}`,
        serviceType: 'Photovoltaikplanung',
        provider: {
          '@id': `${BASE_URL}#organization`,
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
        },
        areaServed: region.city,
      },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    name: `Solaranlagen & Speicher ${region.city}`,
    serviceType: 'Photovoltaik Komplettlösung',
    description: `Planung, Installation und Betrieb von Photovoltaiksystemen in ${region.city} und ${region.state}.`,
    provider: {
      '@id': `${BASE_URL}#organization`,
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      url: BASE_URL,
    },
    areaServed: geoCircle,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: canonical,
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: '+49-30-123-456-78',
        contactType: 'customer support',
        areaServed: region.regionCode,
        availableLanguage: ['de', 'en'],
      },
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: canonical,
    },
  };

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    name: `Solaranlagen ${region.city} | ZOE Solar`,
    description: `Regionaler Photovoltaik-Komplettservice für ${region.city} und ${region.state}. Planung, Installation, Betrieb und Finanzierung aus einer Hand.`,
    url: canonical,
    inLanguage: 'de-DE',
    isPartOf: `${BASE_URL}#website`,
    about: {
      '@type': 'City',
      name: region.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: region.city,
        addressRegion: region.state,
        addressCountry: countryCode,
      },
    },
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
  };

  return dedupeStructuredData([
    webpageSchema,
    breadcrumb,
    geoCircle,
    localBusiness,
    serviceSchema,
    howToSchema,
    ...faqSchemas,
    ...qaSchema,
    ...speakable,
    ...buildLocationContentSchemas(region, slug, canonical),
  ]);
};

const buildLocationSeoConfig = (region: ServiceRegion, slug: string): SEOConfig => {
  const canonical = `${BASE_URL}/standort/${slug}`;
  const title = `Solaranlagen ${region.city} | ZOE Solar – Photovoltaik in ${region.state}`;
  const description = `ZOE Solar plant und installiert Photovoltaik- und Speichersysteme in ${region.city} und ${region.state}. Komplettservice inklusive Planung, Finanzierung, Installation und Wartung – spezialisiert auf Gewerbe, Landwirtschaft und Premium-Privatkunden.`;
  const keywords = dedupe(
    [
      `Solaranlagen ${region.city}`,
      `Photovoltaik ${region.city}`,
      `PV ${region.city}`,
      `Solar ${region.state}`,
      `Solaranbieter ${region.city}`,
      `Photovoltaik Installation ${region.city}`,
    ],
    (keyword) => keyword.toLowerCase(),
  );

  const countryCode = getRegionCountryCode(region.regionCode);
  const alternates: AlternateHref[] = dedupe(
    [
      { hrefLang: 'de', href: canonical },
      { hrefLang: 'de-DE', href: canonical },
      countryCode === 'AT' ? { hrefLang: 'de-AT', href: canonical } : undefined,
      countryCode === 'CH' ? { hrefLang: 'de-CH', href: canonical } : undefined,
      { hrefLang: 'x-default', href: canonical },
    ].filter(Boolean) as AlternateHref[],
    (item) => `${item.hrefLang.toLowerCase()}|${item.href}`,
  );

  const structuredData = buildLocationStructuredData(region, slug);

  const additionalMeta: AdditionalMetaTag[] = dedupe(
    [
      { property: 'place:location:latitude', content: region.latitude.toString() },
      { property: 'place:location:longitude', content: region.longitude.toString() },
      { name: 'city', content: region.city },
      { name: 'region', content: region.state },
    ],
    (item) => `${item.name ?? item.property}`.toLowerCase(),
  );

  return {
    title,
    description,
    keywords,
    canonical,
    alternates,
    geo: {
      region: region.regionCode,
      placename: region.city,
      latitude: region.latitude,
      longitude: region.longitude,
    },
    structuredData,
    additionalMeta,
    og: {
      title,
      description,
      type: 'website',
      image: DEFAULT_SHARE_IMAGE,
      imageAlt: `Solaranlage in ${region.city}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: DEFAULT_SHARE_IMAGE,
      site: '@zoesolar',
    },
  };
};

const defaultStructuredData: object[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ZOE Solar',
    url: BASE_URL,
    inLanguage: 'de-DE',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}#organization`,
    name: ORGANIZATION_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: ORGANIZATION_LOGO,
    },
    sameAs: [
      'https://www.linkedin.com/company/zoe-solar',
      'https://www.youtube.com/@zoe-solar',
      'https://www.xing.com/pages/zoesolargmbh',
      'https://www.behance.net/zoesolar',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+49-30-123-456-78',
        areaServed: 'DE',
        availableLanguage: ['de', 'en'],
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}#local-business`,
    name: ORGANIZATION_NAME,
    image: DEFAULT_SHARE_IMAGE,
    url: BASE_URL,
    telephone: '+49-30-123-456-78',
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Musterstraße 123',
      addressLocality: 'Berlin',
      postalCode: '10115',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.520008,
      longitude: 13.404954,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Deutschland',
    },
    serviceArea: PRIMARY_SERVICE_REGIONS.map((region) => ({
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: region.latitude,
        longitude: region.longitude,
      },
      geoRadius: region.radiusKm * 1000,
      name: `${region.city} (${region.state})`,
    })),
    hasMap: 'https://www.google.com/maps/place/ZOE+Solar',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  },
  ...buildLocalBusinessBranches(),
];

const createServiceSchema = (name: string, description: string, url: string, areaServed: string = 'Deutschland'): object => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: ORGANIZATION_NAME,
    url: BASE_URL,
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: areaServed,
  },
  url,
});

const buildOfferCatalogSchema = (packages: PricingPackage[]): object => ({
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Photovoltaik Komplettpakete',
  url: `${BASE_URL}/preise`,
  itemListElement: packages.slice(0, 6).map((pkg, index) => ({
    '@type': 'Offer',
    position: index + 1,
    name: pkg.name,
    description: pkg.target,
    url: `${BASE_URL}/preise#${pkg.id}`,
    price: pkg.price,
    priceCurrency: 'EUR',
    itemOffered: {
      '@type': 'Service',
      name: pkg.name,
      description: pkg.target,
    },
  })),
});

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const defaultSEO: Required<Omit<SEOConfig, 'og' | 'twitter' | 'geo'>> & {
  og: OpenGraphMeta;
  twitter: TwitterMeta;
  geo: GeoMeta;
} = {
  title: 'Solaranlage Einfamilienhaus & Eigenheim Kosten 2025 | ZOE Solar',
  description:
    'Solaranlage für Einfamilienhaus & Eigenheim ✓ Transparente Kosten ✓ Mit Speicher & Installation ✓ Förderung bis 70% ✓ Kostenlose Beratung ➤ Jetzt Angebot anfordern!',
  keywords: [
    'Solaranlage Einfamilienhaus',
    'Solaranlage Eigenheim Kosten',
    'Photovoltaik mit Speicher',
    'Solaranlage Eigenheim',
    'Solaranlage Einfamilienhaus Kosten',
    'Photovoltaik Installation Dach',
    'Stromspeicher Förderung Eigenheim',
    'ZOE Solar',
    'Photovoltaik Gewerbe',
    'Agri-PV Anbieter',
  ],
  canonical: `${BASE_URL}/`,
  robots: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
  alternates: [
    { hrefLang: 'de', href: `${BASE_URL}/` },
    { hrefLang: 'de-DE', href: `${BASE_URL}/` },
    { hrefLang: 'de-AT', href: `${BASE_URL}/` },
    { hrefLang: 'de-CH', href: `${BASE_URL}/` },
    { hrefLang: 'x-default', href: `${BASE_URL}/` },
  ],
  structuredData: defaultStructuredData,
  additionalMeta: [
    { name: 'author', content: ORGANIZATION_NAME },
    { name: 'publisher', content: ORGANIZATION_NAME },
    { name: 'format-detection', content: 'telephone=no' },
  ],
  og: {
    type: 'website',
    title: 'Solaranlage Einfamilienhaus & Eigenheim Kosten 2025 | ZOE Solar',
    description:
      'Solaranlage für Einfamilienhaus & Eigenheim ✓ Transparente Kosten ✓ Mit Speicher & Installation ✓ Förderung bis 70% ✓ Kostenlose Beratung',
    image: DEFAULT_SHARE_IMAGE,
    imageAlt: 'Solaranlage auf Einfamilienhaus - Kosten und Installation von ZOE Solar',
    imageWidth: DEFAULT_SHARE_IMAGE_WIDTH,
    imageHeight: DEFAULT_SHARE_IMAGE_HEIGHT,
    imageType: DEFAULT_SHARE_IMAGE_TYPE,
    siteName: 'ZOE Solar',
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solaranlage Einfamilienhaus & Eigenheim Kosten 2025 | ZOE Solar',
    description:
      'Solaranlage für Ihr Eigenheim ✓ Transparente Kosten ✓ Mit Speicher ✓ Förderung bis 70% ✓ Kostenlose Beratung ➤ Jetzt Angebot anfordern!',
    image: DEFAULT_SHARE_IMAGE,
    site: '@zoesolar',
    imageAlt: 'Solaranlage auf Einfamilienhaus - Kosten und Installation von ZOE Solar',
  },
  geo: {
    region: 'DE-BE',
    placename: 'Berlin',
    latitude: 52.520008,
    longitude: 13.404954,
    position: '52.520008;13.404954',
  },
};

const pageSpecificSEO: Partial<Record<Page, SEOConfig>> = {
  home: {
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${BASE_URL}/#homepage`,
        name: 'Solaranlage Einfamilienhaus & Eigenheim Kosten - ZOE Solar',
        description:
          'Kosten & Beratung für Solaranlagen auf Einfamilienhaus und Eigenheim. Transparente Preise, Förderberatung und professionelle Installation.',
        url: `${BASE_URL}/`,
        inLanguage: 'de-DE',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Solaranlage Einfamilienhaus Installation',
        serviceType: 'Photovoltaik Installation',
        description: 'Professionelle Installation von Solaranlagen auf Einfamilienhäusern mit Kostengarantie und umfassender Beratung zu Förderungen.',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Deutschland',
        },
        url: `${BASE_URL}/`,
        offers: {
          '@type': 'Offer',
          name: 'Solaranlage Einfamilienhaus Komplettpaket',
          description: 'Transparente Festpreise für Solaranlagen-Installation inklusive Speicher und Förderberatung',
          priceCurrency: 'EUR',
          priceRange: '€€€',
        },
      },
  ...buildSpeakableSchema('Solaranlage Einfamilienhaus Kosten | ZOE Solar', ['.hero-headline', '.hero-pitch', '.testimonial-highlight', '.cost-calculator']),
    ],
  },
  photovoltaik: {
    title: 'Solaranlage Eigenheim & Einfamilienhaus - Kosten, Installation & Förderung | ZOE Solar',
    description:
      'Solaranlage für Eigenheim & Einfamilienhaus ✓ Transparente Kosten ✓ Professionelle Installation ✓ Mit Speicher ✓ Förderberatung ✓ Kostenlose Beratung ➤ Jetzt Angebot!',
    keywords: ['Solaranlage Eigenheim', 'Solaranlage Einfamilienhaus', 'Solaranlage Eigenheim Kosten', 'Photovoltaik Installation Dach', 'Solaranlage mit Speicher'],
    structuredData: [
      createServiceSchema(
        'Solaranlage für Eigenheim und Einfamilienhaus',
        'Professionelle Planung, Installation und Service von Photovoltaikanlagen für Eigenheime mit transparenten Kosten und umfassender Förderberatung.',
        `${BASE_URL}/photovoltaik`,
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Solaranlage Einfamilienhaus Komplettpaket',
        description: 'Komplette Solaranlagen-Lösung für Einfamilienhäuser inklusive Installation, Speicher und Förderberatung',
        brand: {
          '@type': 'Brand',
          name: ORGANIZATION_NAME,
        },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '15000',
          highPrice: '45000',
          priceCurrency: 'EUR',
          offerCount: '50+',
          availability: 'https://schema.org/InStock',
        },
        review: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '156',
        },
      },
      ...buildRegionalServiceSchemas(
        'Solaranlage Eigenheim Installation',
        'Regionale Installation und Service von Photovoltaikanlagen für Eigenheime inklusive Netzanschluss, Monitoring und Wartung.',
        `${BASE_URL}/photovoltaik`,
      ),
      ...buildFaqSchema(
        'Solaranlage Eigenheim – Häufige Fragen',
        'Antworten auf die wichtigsten Fragen zu Kosten, Installation und Förderung von Solaranlagen für Eigenheime.',
  selectFaqEntries({ categories: ['Allgemein', 'Technik', 'Wirtschaftlichkeit'], limit: 6 }),
      ),
  ...buildSpeakableSchema('Solaranlage Eigenheim & Einfamilienhaus Kosten | ZOE Solar', ['.pillar-intro', '.pillar-keyfacts', '.cost-calculator', '.pillar-faq .faq-speakable-question']),
    ],
    og: {
      image: pageHeroData.photovoltaik?.bgImage,
      title: 'Solaranlage Einfamilienhaus - Kosten & Installation | ZOE Solar',
      description: 'Solaranlage für Ihr Einfamilienhaus ✓ Transparente Kosten ✓ Professionelle Installation ✓ Mit Speicher ✓ Förderung bis 70%',
    },
  },
  'service-photovoltaik': {
    title: 'Aufdach-Photovoltaik für Unternehmen | ZOE Solar',
    description:
      'Verwandeln Sie Ihre Dächer in eine verlässliche Einnahmequelle. ZOE Solar liefert schlüsselfertige PV-Aufdachanlagen inklusive Monitoring und Service.',
    keywords: ['Aufdach PV', 'Dach Photovoltaik Gewerbe', 'PV Monitoring'],
    structuredData: [
      createServiceSchema(
        'Aufdach-Photovoltaik',
        'Schlüsselfertige Aufdachanlagen für Gewerbeimmobilien inklusive Planung, Installation und Betriebsführung.',
        `${BASE_URL}/service/photovoltaik`,
      ),
      ...buildRegionalServiceSchemas(
        'Aufdach-Photovoltaik',
        'Regionale Umsetzung von Photovoltaik-Dachanlagen inklusive Standsicherheitsprüfung, Statik und Monitoring.',
        `${BASE_URL}/service/photovoltaik`,
      ),
      ...buildFaqSchema(
        'FAQ Aufdach-Photovoltaik',
        'Häufige Fragen zu Dachstatik, Wartung und Monitoring gewerblicher Dachanlagen.',
  selectFaqEntries({ categories: ['Allgemein', 'Technik'], limit: 3 }),
      ),
  ...buildSpeakableSchema('Aufdach-Photovoltaik für Unternehmen | ZOE Solar', ['.pillar-intro', '.pillar-keyfacts', '.pillar-faq .faq-speakable-question']),
    ],
  },
  'service-ladeparks': {
    title: 'Ladeparks & Ladeinfrastruktur für E-Mobilität | ZOE Solar',
    description:
      'Planen Sie mit ZOE Solar leistungsstarke Ladeparks für Flotten und Kunden. Von HPC-Ladesäulen bis zu smartem Lastmanagement.',
    keywords: ['HPC Ladepark', 'E-Mobilität Gewerbe', 'Ladeinfrastruktur Unternehmen'],
    structuredData: [
      createServiceSchema(
        'Planung von Ladeparks',
        'Komplettlösungen für gewerbliche Ladeparks inklusive Schnellladetechnik, Lastmanagement und Abrechnung.',
        `${BASE_URL}/service/ladeparks`,
      ),
      ...buildRegionalServiceSchemas(
        'Ladeparks & Ladeinfrastruktur',
        'Regionale Planung und Errichtung von Schnellladeinfrastruktur, Lastmanagement und Abrechnungssystemen.',
        `${BASE_URL}/service/ladeparks`,
      ),
      ...buildFaqSchema(
        'FAQ Ladeparks',
        'Antworten auf häufige Fragen zu Ladeleistung, Netzanschluss und Förderungen für Ladeinfrastruktur.',
  selectFaqEntries({ categories: ['Technik', 'Wirtschaftlichkeit'], limit: 3 }),
      ),
  ...buildSpeakableSchema('Ladeparks & Ladeinfrastruktur | ZOE Solar', ['.pillar-intro', '.pillar-keyfacts', '.pillar-faq .faq-speakable-question']),
    ],
  },
  'service-speicher': {
    title: 'Photovoltaik mit Speicher & Stromspeicher Förderung Eigenheim | ZOE Solar',
    description:
      'Photovoltaik mit Speicher für Eigenheim ✓ Stromspeicher Förderung bis 70% ✓ Batteriespeicher Kosten 10kWh ✓ Maximale Eigenverbrauch ✓ Kostenlose Beratung ➤ Jetzt Angebot!',
    keywords: ['Photovoltaik mit Speicher', 'Stromspeicher Förderung Eigenheim', 'Batteriespeicher Kosten 10kWh', 'Solaranlage mit Speicher', 'Photovoltaik Eigenheim mit Speicher'],
    structuredData: [
      createServiceSchema(
        'Photovoltaik mit Batteriespeicher für Eigenheime',
        'Komplettlösungen aus Photovoltaik und Batteriespeicher zur Maximierung des Eigenverbrauchs mit umfassender Förderberatung.',
        `${BASE_URL}/service/speicher`,
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Photovoltaik mit Speicher Komplettpaket',
        description: 'Solaranlage mit Batteriespeicher für maximale Unabhängigkeit und Eigenverbrauch im Eigenheim',
        brand: {
          '@type': 'Brand',
          name: ORGANIZATION_NAME,
        },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '25000',
          highPrice: '60000',
          priceCurrency: 'EUR',
          offerCount: '30+',
          availability: 'https://schema.org/InStock',
        },
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Speicherkapazität',
            value: '10-20 kWh',
          },
          {
            '@type': 'PropertyValue',
            name: 'Förderung',
            value: 'bis zu 70%',
          },
        ],
      },
      ...buildRegionalServiceSchemas(
        'Photovoltaik mit Batteriespeicher',
        'Regionale Installation von Photovoltaikanlagen mit Batteriespeichern für maximale Eigenverbrauchsoptimierung und Förderberatung.',
        `${BASE_URL}/service/speicher`,
      ),
      ...buildFaqSchema(
        'FAQ Photovoltaik mit Speicher für Eigenheime',
        'Antworten zu Förderung, Kosten und Wirtschaftlichkeit von Batteriespeichern in Kombination mit Photovoltaik.',
  selectFaqEntries({ categories: ['Technik', 'Wirtschaftlichkeit'], limit: 5 }),
      ),
  ...buildSpeakableSchema('Photovoltaik mit Speicher & Stromspeicher Förderung | ZOE Solar', ['.pillar-intro', '.pillar-keyfacts', '.cost-calculator', '.pillar-faq .faq-speakable-question']),
    ],
    og: {
      title: 'Photovoltaik mit Speicher - Förderung & Kosten | ZOE Solar',
      description: 'Photovoltaik mit Speicher für Ihr Eigenheim ✓ Stromspeicher Förderung bis 70% ✓ Maximale Unabhängigkeit ✓ Kostenlose Beratung',
    },
  },
  preise: {
    title: 'Solaranlage Kosten Einfamilienhaus & Eigenheim 2025 | ZOE Solar Preise',
    description:
      'Solaranlage Kosten für Einfamilienhaus & Eigenheim ✓ Transparente Festpreise ab 15.000€ ✓ Mit Speicher ab 25.000€ ✓ Förderung bis 70% ✓ Kostenloser Kostenrechner ➤ Jetzt berechnen!',
    keywords: ['Solaranlage Einfamilienhaus Kosten', 'Solaranlage Eigenheim Kosten', 'Photovoltaik Kosten', 'Solaranlage Kosten', 'Batteriespeicher Kosten 10kWh'],
    structuredData: [
      buildOfferCatalogSchema(pricingPackages),
      {
        '@context': 'https://schema.org',
        '@type': 'PriceSpecification',
        name: 'Solaranlage Einfamilienhaus Preise',
        description: 'Transparente Festpreise für Solaranlagen auf Einfamilienhäusern inklusive Installation und Service',
        minPrice: '15000',
        maxPrice: '45000',
        priceCurrency: 'EUR',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          minValue: '5',
          maxValue: '20',
          unitCode: 'KWT',
          unitText: 'kWp',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Calculator',
        name: 'Solaranlage Kostenrechner',
        description: 'Berechnen Sie die Kosten Ihrer Solaranlage für Einfamilienhaus oder Eigenheim',
        url: `${BASE_URL}/preise#kostenrechner`,
        applicationCategory: 'FinanceApplication',
      },
      ...buildFaqSchema(
        'FAQ Solaranlage Kosten Einfamilienhaus',
        'Häufige Fragen zu Investitionskosten, Finanzierung und Wirtschaftlichkeit von Solaranlagen für Eigenheime.',
  selectFaqEntries({ categories: ['Wirtschaftlichkeit'], limit: 5 }),
      ),
  ...buildSpeakableSchema('Solaranlage Kosten Einfamilienhaus & Eigenheim | ZOE Solar', ['.pillar-intro', '.pillar-keyfacts', '.cost-calculator', '.pillar-faq .faq-speakable-question']),
    ],
    og: {
      title: 'Solaranlage Kosten Einfamilienhaus 2025 - Transparente Preise | ZOE Solar',
      description: 'Solaranlage Kosten für Einfamilienhaus ✓ Transparente Preise ab 15.000€ ✓ Mit Speicher ab 25.000€ ✓ Förderung bis 70%',
    },
  },
  produkte: {
    title: 'Technologie-Partner & Komponenten | ZOE Solar',
    description:
      'Entdecken Sie die Hersteller und Premium-Komponenten, mit denen ZOE Solar Projekte realisiert – von Modulen über Speicher bis zur Ladeinfrastruktur.',
    keywords: ['PV Komponenten', 'Premium Solarmodule', 'SolarEdge Optimierer'],
  },
  anwendungsfaelle: {
    title: 'Branchenlösungen & Use Cases | ZOE Solar',
    description:
      'Logistik, Industrie, Landwirtschaft oder Immobilienwirtschaft – ZOE Solar zeigt konkrete Anwendungsfälle erfolgreicher PV-Projekte.',
    keywords: ['Photovoltaik Logistik', 'Agri-PV Beispiele', 'PV Referenzen'],
  },
  kontakt: {
    title: 'Kontakt ZOE Solar | Photovoltaik Experten in Berlin',
    description:
      'Sprechen Sie mit unseren Photovoltaik-Spezialisten in Berlin. Telefon, E-Mail oder digitale Potenzialanalyse – wir melden uns innerhalb von 24 Stunden.',
    keywords: ['ZOE Solar Kontakt', 'Photovoltaik Beratung Berlin', 'PV Ansprechpartner'],
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url: `${BASE_URL}/kontakt`,
        name: 'Kontaktseite ZOE Solar',
        description: 'Kontaktmöglichkeiten und Rückrufservice von ZOE Solar GmbH – Ihrem Partner für Photovoltaik-Großprojekte.',
        inLanguage: 'de-DE',
      },
      ...buildFaqSchema(
        'Kontakt – Häufige Fragen',
        'Antworten auf wiederkehrende Fragen zu Beratung, Projektstart und Reaktionszeiten.',
  selectFaqEntries({ categories: ['Allgemein'], limit: 2 }),
      ),
  ...buildSpeakableSchema('Kontakt ZOE Solar', ['.hero-headline', '.hero-pitch', '.faq-section .faq-speakable-question']),
    ],
  },
  'faq-page': {
    title: 'FAQ Photovoltaik Großanlagen | ZOE Solar Wissens-Hub',
    description:
      'Antworten auf die häufigsten Fragen zu Planung, Technik, Wirtschaftlichkeit und Service von Photovoltaikanlagen für Unternehmen.',
    keywords: ['Photovoltaik FAQ', 'PV Fragen Antworten', 'Solar Wissen'],
    structuredData: [
      faqStructuredData,
      ...buildSpeakableSchema('Photovoltaik FAQ | ZOE Solar', ['main h1', 'main .faq-item h3']),
    ],
  },
  innovations: {
    title: 'Solar-Innovationen & Zukunftstechnologien | ZOE Solar',
    description:
      'Ästhetische Solarfassaden, Agri-PV und smarte Speicher: Entdecken Sie, wie ZOE Solar Innovationen in Projekten einsetzt.',
    keywords: ['Solar Innovation', 'Agri PV', 'Smarte Speicherlösungen'],
  },
  login: {
    title: 'Login | ZOE Solar Kundenportal',
    description: 'Melden Sie sich mit Ihrem ZOE Solar Konto an, um Projektstatus, Angebote und Energieberichte einzusehen.',
    robots: 'noindex,nofollow',
  },
  dashboard: {
    title: 'Kundenportal Dashboard | ZOE Solar',
    description: 'Übersicht über laufende Photovoltaik-Projekte, Angebote und Dokumente im ZOE Solar Kundenportal.',
    robots: 'noindex,nofollow',
  },
  finanzierung: {
    title: 'Photovoltaik Finanzierung & Förderung | ZOE Solar',
    description:
      'Von KfW bis PPA: ZOE Solar strukturiert die passende Finanzierung und Fördermittelstrategie für Ihr Solarprojekt.',
    keywords: ['PV Finanzierung', 'Photovoltaik Förderung', 'PPA Vertrag'],
    structuredData: [
      createServiceSchema(
        'Finanzierungsberatung Photovoltaik',
        'Beratung zu Finanzierungs- und Förderprogrammen für Photovoltaikanlagen sowie Strukturierung von PPA-Modellen.',
        `${BASE_URL}/finanzierung`,
      ),
      ...buildFaqSchema(
        'FAQ Photovoltaik Finanzierung',
        'Antworten zu Fördermitteln, PPA-Strukturen und Finanzierungslaufzeiten.',
  selectFaqEntries({ categories: ['Wirtschaftlichkeit'], limit: 3 }),
      ),
      ...buildSpeakableSchema('Photovoltaik Finanzierung & Förderung | ZOE Solar', ['main h1', 'main section:first-of-type p']),
    ],
  },
  'foerdermittel-check': {
    title: 'Fördermittel-Check für Photovoltaik | ZOE Solar',
    description:
      'Finden Sie passende Zuschüsse und Kredite für Ihr Solarprojekt. Der digitale Fördermittel-Check von ZOE Solar zeigt aktuelle Programme.',
    keywords: ['PV Fördermittel', 'Solar Zuschüsse', 'Fördermittel Check'],
    robots: 'noindex,follow',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Fördermittel-Check für Photovoltaik durchführen',
        description: 'So finden Unternehmen in drei Schritten die passenden Förderprogramme für ihr Photovoltaikprojekt.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Projektprofil anlegen',
            text: 'Geben Sie Standort, Branche und Leistungsbedarf Ihres Projekts im digitalen Assistenten ein.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Förderprogramme vergleichen',
            text: 'Erhalten Sie automatisch eine Übersicht relevanter Förderprogramme von Bund, Ländern und Kommunen.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Förderantrag vorbereiten',
            text: 'Lassen Sie sich durch ZOE Solar bei der Zusammenstellung aller nötigen Unterlagen begleiten.',
          },
        ],
        supply: 'Projektinformationen (Standort, Leistung, Budget)',
        tool: 'Digitaler Fördermittel-Assistent von ZOE Solar',
      },
    ],
  },
  'agri-pv': {
    title: 'Agri-PV für Landwirtschaft & Sonderkulturen | ZOE Solar',
    description:
      'Nutzen Sie Ihre Flächen doppelt: ZOE Solar realisiert Agri-PV-Anlagen, die Ernte schützen, Wasser sparen und stabile Zusatzerträge liefern.',
    keywords: ['Agri PV', 'Landwirtschaft Solar', 'Doppelnutzung Acker'],
  },
  'agri-pv-brandenburg': {
    title: 'Agri-PV Brandenburg | ZOE Solar - Photovoltaik für Landwirte',
    description:
      'Nutzen Sie die neuen Agri-PV-Förderungen 2025 in Brandenburg. Schützen Sie Ihre Kulturen vor Wetterextremen, sparen Sie Wasser und generieren Sie zusätzliche Einnahmen durch Stromproduktion.',
    keywords: ['Agri-PV Brandenburg', 'Landwirtschaft Solar Brandenburg', 'PV Landwirte', 'Agri Photovoltaik Prignitz', 'Solar Ackerbau'],
    geo: {
      region: 'DE-BB',
      placename: 'Brandenburg',
      latitude: 52.4125,
      longitude: 12.5319,
    },
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Agri-PV Brandenburg',
        serviceType: 'Agri-Photovoltaik',
        description: 'Planung und Umsetzung von Agri-PV-Anlagen in Brandenburg für Landwirte und Agrarbetriebe.',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Brandenburg',
        },
        url: `${BASE_URL}/agri-pv/brandenburg`,
      },
      ...buildFaqSchema(
        'Agri-PV Brandenburg FAQ',
        'Häufige Fragen zu Agri-PV in Brandenburg, Förderungen und Umsetzung.',
        selectFaqEntries({ categories: ['Förderung', 'Technik', 'Region'], region: 'Brandenburg', limit: 4 })
      ),
      ...buildSpeakableSchema('Agri-PV Brandenburg | ZOE Solar', ['.hero-headline', '.pillar-intro']),
    ],
  },
  'agri-pv-sachsen-anhalt': {
    title: 'Agri-PV Sachsen-Anhalt | ZOE Solar - Deutschlands Agrarregion Nr. 1',
    description:
      'Sachsen-Anhalt bietet ideale Voraussetzungen für Agri-PV: Über 50% der Landesfläche sind Ackerland. Nutzen Sie die neuen Bundesförderungen 2025 in der Magdeburger Börde, Altmark und im Harzvorland.',
    keywords: ['Agri-PV Sachsen-Anhalt', 'Landwirtschaft Solar Sachsen-Anhalt', 'PV Magdeburger Börde', 'Agri Photovoltaik Altmark', 'Solar Ackerbau'],
    geo: {
      region: 'DE-ST',
      placename: 'Sachsen-Anhalt',
      latitude: 51.9503,
      longitude: 11.6923,
    },
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Agri-PV Sachsen-Anhalt',
        serviceType: 'Agri-Photovoltaik',
        description: 'Planung und Umsetzung von Agri-PV-Anlagen in Sachsen-Anhalt für Landwirte und Agrarbetriebe in der Magdeburger Börde und Altmark.',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Sachsen-Anhalt',
        },
        url: `${BASE_URL}/agri-pv/sachsen-anhalt`,
      },
      ...buildFaqSchema(
        'Agri-PV Sachsen-Anhalt FAQ',
        'Häufige Fragen zu Agri-PV in Sachsen-Anhalt, Förderungen und Umsetzung in der Magdeburger Börde.',
        selectFaqEntries({ categories: ['Förderung', 'Technik', 'Region'], region: 'Sachsen-Anhalt', limit: 4 })
      ),
      ...buildSpeakableSchema('Agri-PV Sachsen-Anhalt | ZOE Solar', ['.hero-headline', '.pillar-intro']),
    ],
  },
  'agri-pv-niedersachsen': {
    title: 'Agri-PV Niedersachsen | ZOE Solar - Deutschlands größte Agrarregion',
    description:
      'Niedersachsen ist mit über 2,6 Mio. ha die größte Agrarregion Deutschlands. Nutzen Sie die neuen Agri-PV-Förderungen 2025 und kombinieren Sie Ihre Milchwirtschaft oder Ackerbau mit ertragreicher Stromproduktion.',
    keywords: ['Agri-PV Niedersachsen', 'Landwirtschaft Solar Niedersachsen', 'PV Lüneburger Heide', 'Agri Photovoltaik Emsland', 'Solar Milchwirtschaft'],
    geo: {
      region: 'DE-NI',
      placename: 'Niedersachsen',
      latitude: 52.3705,
      longitude: 9.7332,
    },
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Agri-PV Niedersachsen',
        serviceType: 'Agri-Photovoltaik',
        description: 'Planung und Umsetzung von Agri-PV-Anlagen in Niedersachsen für Landwirte und Agrarbetriebe in der Lüneburger Heide und im Emsland.',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Niedersachsen',
        },
        url: `${BASE_URL}/agri-pv/niedersachsen`,
      },
      ...buildFaqSchema(
        'Agri-PV Niedersachsen FAQ',
        'Häufige Fragen zu Agri-PV in Niedersachsen, Förderungen und Umsetzung in der Lüneburger Heide.',
        selectFaqEntries({ categories: ['Förderung', 'Technik', 'Region'], region: 'Niedersachsen', limit: 4 })
      ),
      ...buildSpeakableSchema('Agri-PV Niedersachsen | ZOE Solar', ['.hero-headline', '.pillar-intro']),
    ],
  },
  'agri-pv-bayern': {
    title: 'Agri-PV Bayern | ZOE Solar - Tradition trifft Innovation',
    description:
      'Bayern ist das größte Bundesland und eine traditionsreiche Agrarregion. Nutzen Sie die neuen Agri-PV-Förderungen 2025 und kombinieren Sie Ihre Landwirtschaft mit moderner Solartechnik vom Allgäu bis zur Hallertau.',
    keywords: ['Agri-PV Bayern', 'Landwirtschaft Solar Bayern', 'PV Hallertau', 'Agri Photovoltaik Allgäu', 'Solar Hopfenanbau'],
    geo: {
      region: 'DE-BY',
      placename: 'Bayern',
      latitude: 48.1351,
      longitude: 11.5820,
    },
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Agri-PV Bayern',
        serviceType: 'Agri-Photovoltaik',
        description: 'Planung und Umsetzung von Agri-PV-Anlagen in Bayern für Landwirte und Agrarbetriebe im Allgäu, in der Hallertau und Oberpfalz.',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Bayern',
        },
        url: `${BASE_URL}/agri-pv/bayern`,
      },
      ...buildFaqSchema(
        'Agri-PV Bayern FAQ',
        'Häufige Fragen zu Agri-PV in Bayern, Förderungen und Umsetzung in der Hallertau.',
        selectFaqEntries({ categories: ['Förderung', 'Technik', 'Region'], region: 'Bayern', limit: 4 })
      ),
      ...buildSpeakableSchema('Agri-PV Bayern | ZOE Solar', ['.hero-headline', '.pillar-intro']),
    ],
  },
  'agri-pv-nordrhein-westfalen': {
    title: 'Agri-PV Nordrhein-Westfalen | ZOE Solar - Industrie trifft Landwirtschaft',
    description:
      'Nordrhein-Westfalen verbindet urbane Industrie mit Landwirtschaft. Nutzen Sie die neuen Agri-PV-Förderungen 2025 und erschließen Sie das Potenzial Ihrer Flächen im Rheinland, Münsterland oder in der Eifel.',
    keywords: ['Agri-PV Nordrhein-Westfalen', 'Landwirtschaft Solar NRW', 'PV Rheinland', 'Agri Photovoltaik Münsterland', 'Solar Weinanbau'],
    geo: {
      region: 'DE-NW',
      placename: 'Nordrhein-Westfalen',
      latitude: 51.4332,
      longitude: 7.6616,
    },
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Agri-PV Nordrhein-Westfalen',
        serviceType: 'Agri-Photovoltaik',
        description: 'Planung und Umsetzung von Agri-PV-Anlagen in Nordrhein-Westfalen für Landwirte und Agrarbetriebe im Rheinland und Münsterland.',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Nordrhein-Westfalen',
        },
        url: `${BASE_URL}/agri-pv/nordrhein-westfalen`,
      },
      ...buildFaqSchema(
        'Agri-PV Nordrhein-Westfalen FAQ',
        'Häufige Fragen zu Agri-PV in NRW, Förderungen und Umsetzung im Rheinland.',
        selectFaqEntries({ categories: ['Förderung', 'Technik', 'Region'], region: 'Nordrhein-Westfalen', limit: 4 })
      ),
      ...buildSpeakableSchema('Agri-PV Nordrhein-Westfalen | ZOE Solar', ['.hero-headline', '.pillar-intro']),
    ],
  },
  'seo-monitoring': {
    title: 'SEO Monitoring Dashboard | ZOE Solar - Rankings & Performance Tracking',
    description:
      'Überwachen Sie Ihre Suchmaschinen-Performance in Echtzeit. Tracken Sie Rankings, Core Web Vitals, strukturierte Daten und AI-Suchergebnisse für maximale Sichtbarkeit.',
    keywords: ['SEO Monitoring', 'Ranking Tracker', 'Core Web Vitals', 'Suchmaschinen Optimierung', 'Performance Tracking'],
    robots: 'noindex,nofollow', // Nicht für Suchmaschinen indexieren
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'SEO Monitoring Dashboard',
        description: 'Echtzeit-Überwachung von Suchmaschinen-Rankings und Website-Performance für ZOE Solar.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        url: `${BASE_URL}/seo-monitoring`,
      },
    ],
  },
  'mitarbeiter-login': {
    title: 'Mitarbeiter Login & Admin Dashboard | ZOE Solar',
    description:
      'Interner Zugang für das SEO & Growth Team von ZOE Solar. Überblick über Backlinks, Rankings, Traffic-Entwicklung und KI-Empfehlungen.',
    keywords: ['Mitarbeiter Login', 'Admin Dashboard', 'SEO Reporting', 'Backlink Monitoring', 'Portal Monitoring'],
    robots: 'noindex,nofollow',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'ZOE Solar Admin Dashboard',
        description:
          'Internes Monitoring-Portal mit Echtzeitdaten zu SEO-Performance, Backlinks, Traffic und Branchenportalen.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          price: '0',
          priceCurrency: 'EUR',
        },
        url: `${BASE_URL}/mitarbeiter-login`,
      },
    ],
  },
  fallstudien: {
    title: 'Fallstudien & Erfolgsgeschichten | ZOE Solar - Photovoltaik Projekte',
    description: 'Erfahren Sie von erfolgreichen Photovoltaik-Projekten: Von Einfamilienhäusern bis Industrieanlagen. Detaillierte Fallstudien mit Ergebnissen, Kosten und ROI.',
    keywords: ['Solar Fallstudien', 'Photovoltaik Projekte', 'PV Erfolgsgeschichten', 'Solar Referenzen', 'Solaranlagen Beispiele'],
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Fallstudien & Erfolgsgeschichten',
        description: 'Sammlung erfolgreicher Photovoltaik-Projekte von ZOE Solar',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        url: `${BASE_URL}/fallstudien`,
      },
    ],
  },
  'fallstudie-detail': {
    title: 'Solaranlagen Fallstudie | ZOE Solar',
    description: 'Detaillierte Fallstudie eines erfolgreichen Photovoltaik-Projekts mit technischen Details, Ergebnissen und Kundenzitat.',
    keywords: ['Solar Fallstudie', 'Photovoltaik Projekt', 'PV Installation', 'Solar Erfolg'],
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Solaranlagen Fallstudie',
        description: 'Detaillierte Analyse eines erfolgreichen Photovoltaik-Projekts',
        author: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
        },
        publisher: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/images/logo.png`,
          },
        },
        datePublished: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
      },
    ],
  },
  'agri-pv-erfahrungen': {
    title: 'Agri-PV Erfahrungen | Erfolgsgeschichten von Landwirten | ZOE Solar',
    description: 'Erfahren Sie von über 500 Landwirten, die Agri-PV erfolgreich umgesetzt haben. Detaillierte Erfahrungen, Herausforderungen und Lösungen für nachhaltige Landwirtschaft.',
    keywords: ['Agri-PV Erfahrungen', 'Landwirtschaft Solar', 'Agri Photovoltaik Erfahrungen', 'Bauern Erfahrungen Solar', 'Agri-PV Erfolgsgeschichten'],
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Agri-PV Erfahrungen & Erfolgsgeschichten',
        description: 'Sammlung authentischer Erfahrungen von Landwirten mit Agri-Photovoltaik',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        url: `${BASE_URL}/agri-pv-erfahrungen`,
      },
      ...buildFaqSchema(
        'Agri-PV Erfahrungen FAQ',
        'Häufige Fragen und Erfahrungen mit Agri-Photovoltaik.',
        [
          {
            question: 'Wie haben Landwirte Agri-PV in der Praxis erlebt?',
            answer: 'Über 500 Landwirte berichten von positiven Erfahrungen: Besseres Tierwohl, höhere Ernteerträge und stabile zweite Einnahmequelle.',
            category: 'Betrieb'
          },
          {
            question: 'Welche Herausforderungen wurden gemeistert?',
            answer: 'Wetterextreme, hohe Energiekosten und Einkommensunsicherheit wurden durch Agri-PV erfolgreich gelöst.',
            category: 'Allgemein'
          },
          {
            question: 'Wie lange dauert die Amortisation?',
            answer: 'Die durchschnittliche Amortisationszeit beträgt 8 Jahre, abhängig von der Größe und Förderung.',
            category: 'Wirtschaftlichkeit'
          }
        ]
      ),
    ],
  },
  projekte: {
    title: 'Referenzen & Projekte | ZOE Solar',
    description:
      'Einblick in erfolgreich realisierte Photovoltaikprojekte von ZOE Solar – von Logistikzentren bis Agro-PV.',
    keywords: ['Photovoltaik Referenzen', 'PV Projekte', 'Solar Erfolgsstory'],
  },
  'wissens-hub': {
    title: 'Wissens-Hub: Leitfäden, Artikel & Tools | ZOE Solar',
    description:
      'Vertiefen Sie Ihr Wissen zu Photovoltaik mit Leitfäden, Studien, Webinaren und digitalen Tools von ZOE Solar.',
    keywords: ['Photovoltaik Wissen', 'Solar Leitfaden', 'PV Studien'],
  },
  'service-anmeldung-pv': {
    robots: 'noindex,follow',
  },
  'service-anmeldung-ladestationen': {
    robots: 'noindex,follow',
  },
  'service-netzanschluss': {
    robots: 'index,follow',
  },
  eigenheim: {
    title: 'Solaranlage Eigenheim - Photovoltaik für Ihr Zuhause | ZOE Solar',
    description:
      'Solaranlage für Ihr Eigenheim ✓ Unabhängigkeit durch eigenen Solarstrom ✓ Mit Speicher & Installation ✓ Förderung bis 70% ✓ Kostenlose Beratung ➤ Jetzt Angebot anfordern!',
    keywords: ['Solaranlage Eigenheim', 'Photovoltaik Eigenheim', 'Eigenheim Solar', 'Solarstrom Eigenheim', 'PV Eigenheim'],
    structuredData: [
      createServiceSchema(
        'Solaranlage für Eigenheime',
        'Maßgeschneiderte Photovoltaiklösungen für Eigenheime mit professioneller Planung, Installation und Service.',
        `${BASE_URL}/eigenheim`,
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${BASE_URL}/eigenheim#webpage`,
        name: 'Solaranlage Eigenheim - Photovoltaik für Ihr Zuhause',
        description: 'Umfassende Informationen zu Solaranlagen für Eigenheime, Installation, Kosten und Förderung.',
        url: `${BASE_URL}/eigenheim`,
        inLanguage: 'de-DE',
        isPartOf: {
          '@type': 'WebSite',
          name: 'ZOE Solar',
          url: BASE_URL,
        },
      },
      ...buildFaqSchema(
        'Solaranlage Eigenheim FAQ',
        'Häufige Fragen zu Solaranlagen für Eigenheime.',
        selectFaqEntries({ categories: ['Allgemein', 'Technik'], limit: 4 }),
      ),
      ...buildSpeakableSchema('Solaranlage Eigenheim | ZOE Solar', ['.hero-headline', '.benefits-list', '.faq-section']),
    ],
    og: {
      title: 'Solaranlage Eigenheim - Unabhängigkeit durch Solarstrom | ZOE Solar',
      description: 'Solaranlage für Ihr Eigenheim ✓ Unabhängigkeit durch eigenen Solarstrom ✓ Mit Speicher & Installation ✓ Förderung bis 70%',
    },
  },
  'eigenheim-kosten': {
    title: 'Solaranlage Eigenheim Kosten 2025 - Preise & Förderung | ZOE Solar',
    description:
      'Solaranlage Eigenheim Kosten ✓ Transparente Preise ab 12.000€ ✓ Mit Speicher ab 22.000€ ✓ Förderung bis 70% ✓ Kostenloser Rechner ➤ Kosten jetzt berechnen!',
    keywords: ['Solaranlage Eigenheim Kosten', 'Eigenheim Solaranlage Preis', 'Kosten Photovoltaik Eigenheim', 'Solaranlage Eigenheim Preise'],
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'PriceSpecification',
        name: 'Solaranlage Eigenheim Kosten',
        description: 'Transparente Preise für Solaranlagen auf Eigenheimen inklusive Installation, Komponenten und Service',
        minPrice: '12000',
        maxPrice: '40000',
        priceCurrency: 'EUR',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          minValue: '4',
          maxValue: '15',
          unitCode: 'KWT',
          unitText: 'kWp',
        },
      },
      createServiceSchema(
        'Solaranlage Eigenheim Kostenberatung',
        'Professionelle Kostenberatung und Kalkulation für Solaranlagen auf Eigenheimen mit transparenten Preisen.',
        `${BASE_URL}/eigenheim-kosten`,
      ),
      ...buildFaqSchema(
        'Solaranlage Eigenheim Kosten FAQ',
        'Häufige Fragen zu den Kosten von Solaranlagen für Eigenheime.',
        selectFaqEntries({ categories: ['Wirtschaftlichkeit'], limit: 5 }),
      ),
      ...buildSpeakableSchema('Solaranlage Eigenheim Kosten | ZOE Solar', ['.cost-overview', '.calculator-section', '.financing-options']),
    ],
    og: {
      title: 'Solaranlage Eigenheim Kosten 2025 - Transparente Preise | ZOE Solar',
      description: 'Solaranlage Eigenheim Kosten ✓ Transparente Preise ab 12.000€ ✓ Mit Speicher ab 22.000€ ✓ Förderung bis 70%',
    },
  },
  'eigenheim-einfamilienhaus-kosten': {
    title: 'Solaranlage Einfamilienhaus Kosten 2025 - Komplettpreise | ZOE Solar',
    description:
      'Solaranlage Einfamilienhaus Kosten ✓ Komplettpreise ab 15.000€ ✓ 5-20 kWp ✓ Mit Speicher ab 28.000€ ✓ Installation & Service ✓ Förderung bis 70% ➤ Jetzt Preis berechnen!',
    keywords: ['Solaranlage Einfamilienhaus Kosten', 'Einfamilienhaus Solaranlage Preis', 'Kosten Photovoltaik Einfamilienhaus', 'PV Anlage Einfamilienhaus Kosten'],
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Solaranlage Einfamilienhaus',
        description: 'Komplette Solaranlagen-Lösung für Einfamilienhäuser mit Installation, Komponenten und 25 Jahren Garantie',
        brand: {
          '@type': 'Brand',
          name: ORGANIZATION_NAME,
        },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '15000',
          highPrice: '50000',
          priceCurrency: 'EUR',
          offerCount: '100+',
          availability: 'https://schema.org/InStock',
        },
        review: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '234',
        },
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Leistung',
            value: '5-20 kWp',
          },
          {
            '@type': 'PropertyValue',
            name: 'Garantie',
            value: '25 Jahre',
          },
        ],
      },
      ...buildFaqSchema(
        'Solaranlage Einfamilienhaus Kosten FAQ',
        'Detaillierte Antworten zu Kosten, Finanzierung und Förderung von Solaranlagen für Einfamilienhäuser.',
        selectFaqEntries({ categories: ['Wirtschaftlichkeit'], limit: 6 }),
      ),
      ...buildSpeakableSchema('Solaranlage Einfamilienhaus Kosten | ZOE Solar', ['.cost-breakdown', '.package-comparison', '.financing-calculator']),
    ],
    og: {
      title: 'Solaranlage Einfamilienhaus Kosten 2025 - Komplettpreise | ZOE Solar',
      description: 'Solaranlage Einfamilienhaus Kosten ✓ Komplettpreise ab 15.000€ ✓ 5-20 kWp ✓ Mit Speicher ab 28.000€ ✓ Förderung bis 70%',
    },
  },
  'eigenheim-planung': {
    title: 'Solaranlage Eigenheim Planung - Professionelle Beratung | ZOE Solar',
    description:
      'Solaranlage Eigenheim Planung ✓ Kostenlose Beratung & Auslegung ✓ Statikprüfung inklusive ✓ Netzanschluss & Anmeldung ✓ Alles aus einer Hand ➤ Jetzt Beratung vereinbaren!',
    keywords: ['Solaranlage Eigenheim Planung', 'Photovoltaik Planung Eigenheim', 'Solaranlage Beratung', 'PV Planung Eigenheim'],
    structuredData: [
      createServiceSchema(
        'Solaranlage Eigenheim Planungsservice',
        'Professionelle Planung und Beratung für Solaranlagen auf Eigenheimen inklusive Statikprüfung und Netzanschluss.',
        `${BASE_URL}/eigenheim-planung`,
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${BASE_URL}/eigenheim-planung#planning-service`,
        name: 'Kostenlose Solaranlage Planung',
        serviceType: 'Beratungsdienstleistung',
        description: 'Umfassende und kostenlose Planung von Solaranlagen für Eigenheime mit Vor-Ort-Termin',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Deutschland',
        },
        offers: {
          '@type': 'Offer',
          name: 'Kostenlose Erstberatung',
          price: '0',
          priceCurrency: 'EUR',
          description: 'Kostenlose Vor-Ort-Beratung und Anlagenplanung',
        },
      },
      ...buildFaqSchema(
        'Solaranlage Eigenheim Planung FAQ',
        'Fragen zur Planung, Genehmigung und Umsetzung von Solaranlagen auf Eigenheimen.',
        selectFaqEntries({ categories: ['Allgemein', 'Technik'], limit: 5 }),
      ),
      ...buildSpeakableSchema('Solaranlage Eigenheim Planung | ZOE Solar', ['.planning-steps', '.consultation-process', '.expert-advice']),
    ],
    og: {
      title: 'Solaranlage Eigenheim Planung - Kostenlose Beratung | ZOE Solar',
      description: 'Solaranlage Eigenheim Planung ✓ Kostenlose Beratung & Auslegung ✓ Statikprüfung inklusive ✓ Alles aus einer Hand',
    },
  },
  'photovoltaik-installation-dach': {
    title: 'Photovoltaik Installation Dach - Professionelle Montage | ZOE Solar',
    description:
      'Photovoltaik Installation Dach ✓ Professionelle Montage ✓ Statikprüfung inklusive ✓ Alle Dachtypen ✓ Versicherung & Garantie ✓ Zertifizierte Installateure ➤ Jetzt Termin vereinbaren!',
    keywords: ['Photovoltaik Installation Dach', 'PV Installation Dach', 'Solaranlage Dachmontage', 'Photovoltaik Montage'],
    structuredData: [
      createServiceSchema(
        'Photovoltaik Dachinstallation',
        'Professionelle Installation von Photovoltaikanlagen auf allen Dachtypen mit Statikprüfung und Versicherungsschutz.',
        `${BASE_URL}/photovoltaik-installation-dach`,
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${BASE_URL}/photovoltaik-installation-dach#installation-service`,
        name: 'Professionelle Photovoltaik Dachinstallation',
        serviceType: 'Installationsdienstleistung',
        description: 'Fachgerechte Installation von Photovoltaikanlagen auf Dächern aller Art durch zertifizierte Installateure',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Zertifizierung',
            value: 'Certified Installation Partner',
          },
          {
            '@type': 'PropertyValue',
            name: 'Versicherung',
            value: 'Vollversicherte Installation',
          },
          {
            '@type': 'PropertyValue',
            name: 'Garantie',
            value: '10 Jahre Installationsgarantie',
          },
        ],
      },
      ...buildFaqSchema(
        'Photovoltaik Installation Dach FAQ',
        'Antworten zu Installation, Montage und technischen Aspekten von Dach-Photovoltaikanlagen.',
        selectFaqEntries({ categories: ['Technik', 'Installation'], limit: 5 }),
      ),
      ...buildSpeakableSchema('Photovoltaik Installation Dach | ZOE Solar', ['.installation-process', '.safety-measures', '.quality-standards']),
    ],
    og: {
      title: 'Photovoltaik Installation Dach - Professionelle Montage | ZOE Solar',
      description: 'Photovoltaik Installation Dach ✓ Professionelle Montage ✓ Statikprüfung inklusive ✓ Alle Dachtypen ✓ Zertifizierte Installateure',
    },
  },
  'eigenheim-installation': {
    title: 'Solaranlage Eigenheim Installation - Komplett-Service | ZOE Solar',
    description:
      'Solaranlage Eigenheim Installation ✓ Komplettservice von A-Z ✓ Planung bis Inbetriebnahme ✓ Netzanschluss inklusive ✓ Zertifizierte Installateure ➤ Jetzt Installation beauftragen!',
    keywords: ['Solaranlage Eigenheim Installation', 'Eigenheim PV Installation', 'Solaranlage Installation Service', 'Photovoltaik Eigenheim Montage'],
    structuredData: [
      createServiceSchema(
        'Solaranlage Eigenheim Installation Komplettservice',
        'Vollständiger Installationsservice für Solaranlagen auf Eigenheimen von der Planung bis zur Inbetriebnahme.',
        `${BASE_URL}/eigenheim-installation`,
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${BASE_URL}/eigenheim-installation#complete-service`,
        name: 'Solaranlage Eigenheim Komplettinstallation',
        serviceType: 'Komplettdienstleistung',
        description: 'Rundum-sorglos-Paket für die Installation von Solaranlagen auf Eigenheimen inklusive aller Nebenleistungen',
        provider: {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: BASE_URL,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Eigenheim Installation Pakete',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Basis Installation',
              description: 'Standard Installationspaket für kleine Eigenheime',
              price: '2500',
              priceCurrency: 'EUR',
            },
            {
              '@type': 'Offer',
              name: 'Komfort Installation',
              description: 'Erweiterte Installation mit Premium-Service',
              price: '3500',
              priceCurrency: 'EUR',
            },
          ],
        },
      },
      ...buildFaqSchema(
        'Solaranlage Eigenheim Installation FAQ',
        'Häufige Fragen zur Installation von Solaranlagen auf Eigenheimen.',
        selectFaqEntries({ categories: ['Installation', 'Service'], limit: 5 }),
      ),
      ...buildSpeakableSchema('Solaranlage Eigenheim Installation | ZOE Solar', ['.service-overview', '.installation-timeline', '.support-guarantee']),
    ],
    og: {
      title: 'Solaranlage Eigenheim Installation - Komplett-Service | ZOE Solar',
      description: 'Solaranlage Eigenheim Installation ✓ Komplettservice von A-Z ✓ Planung bis Inbetriebnahme ✓ Netzanschluss inklusive',
    },
  },
};

const mergeSeoConfigs = (base: SEOConfig, ...overrides: (SEOConfig | undefined)[]): SEOConfig => {
  return overrides.reduce<SEOConfig>((acc, override) => {
    if (!override) return acc;
    return {
      title: override.title ?? acc.title,
      description: override.description ?? acc.description,
      keywords: dedupe([...(acc.keywords ?? []), ...(override.keywords ?? [])], (keyword) => keyword.toLowerCase()),
      canonical: override.canonical ?? acc.canonical,
      robots: override.robots ?? acc.robots,
      alternates: dedupe(
        [...(acc.alternates ?? []), ...(override.alternates ?? [])],
        (item) => `${item.hrefLang.toLowerCase()}|${item.href}`,
      ),
      structuredData: [...(acc.structuredData ?? []), ...(override.structuredData ?? [])],
      additionalMeta: dedupe(
        [...(acc.additionalMeta ?? []), ...(override.additionalMeta ?? [])],
        (item) => (item.name ?? item.property ?? '').toLowerCase(),
      ),
      og: {
        ...(acc.og ?? {}),
        ...(override.og ?? {}),
      },
      twitter: {
        ...(acc.twitter ?? {}),
        ...(override.twitter ?? {}),
      },
      geo: {
        ...(acc.geo ?? {}),
        ...(override.geo ?? {}),
      },
    };
  }, {
    ...base,
    keywords: [...(base.keywords ?? [])],
    alternates: [...(base.alternates ?? [])],
    structuredData: [...(base.structuredData ?? [])],
    additionalMeta: [...(base.additionalMeta ?? [])],
    og: { ...(base.og ?? {}) },
    twitter: { ...(base.twitter ?? {}) },
    geo: { ...(base.geo ?? {}) },
  });
};

const buildDynamicSeo = ({ page, pathname, article, guide, manufacturer, useCase }: DynamicSeoInput): SEOConfig | undefined => {
  switch (page) {
    case 'article-detail': {
      if (!article) return undefined;
      const articleUrl = toAbsoluteUrl(`/aktuelles/${article.slug}`);
      const isoDate = parseGermanDateToISO(article.date);
      return {
        title: `${article.title} | ZOE Solar Insights`,
        description: article.excerpt,
        keywords: [article.category, 'Solar News', 'ZOE Solar Magazin'],
        canonical: articleUrl,
        og: {
          type: 'article',
          title: article.title,
          description: article.excerpt,
          image: article.imageUrl,
        },
        twitter: {
          image: article.imageUrl,
        },
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.excerpt,
            inLanguage: 'de-DE',
            image: [article.imageUrl],
            mainEntityOfPage: articleUrl,
            author: {
              '@type': 'Person',
              name: article.authorName,
            },
            publisher: {
              '@type': 'Organization',
              name: ORGANIZATION_NAME,
              logo: {
                '@type': 'ImageObject',
                url: ORGANIZATION_LOGO,
              },
            },
            articleSection: article.category,
            ...(isoDate
              ? {
                  datePublished: isoDate,
                  dateModified: isoDate,
                }
              : {}),
          },
          ...buildSpeakableSchema(article.title, ['article h1', 'article p']),
        ],
      };
    }
    case 'guide-detail': {
      if (!guide) return undefined;
      const guideUrl = toAbsoluteUrl(`/wissen/guide/${guide.slug}`);
      return {
        title: `${guide.title} | ZOE Solar Wissens-Hub`,
        description: guide.description,
        keywords: [guide.type, 'Photovoltaik Leitfaden', guide.title],
        canonical: guideUrl,
        og: {
          type: 'article',
          title: guide.title,
          description: guide.description,
          image: guide.imageUrl,
        },
        twitter: {
          image: guide.imageUrl,
        },
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            name: guide.title,
            headline: guide.title,
            description: guide.description,
            inLanguage: 'de-DE',
            url: guideUrl,
            datePublished: guide.date ? new Date(`${guide.date}T00:00:00Z`).toISOString() : undefined,
            author: {
              '@type': 'Organization',
              name: ORGANIZATION_NAME,
              url: BASE_URL,
            },
            image: [guide.imageUrl],
          },
          ...buildSpeakableSchema(guide.title, ['article h1', 'article p']),
        ],
      };
    }
    case 'hersteller-detail': {
      if (!manufacturer) return undefined;
      const manufacturerUrl = toAbsoluteUrl(`/produkte/${manufacturer.slug}`);
      return {
        title: `${manufacturer.name} | Technologiepartner von ZOE Solar`,
        description: manufacturer.description,
        keywords: [manufacturer.name, 'PV Hersteller', ...manufacturer.category.map((cat) => `${cat} Hersteller`)],
        canonical: manufacturerUrl,
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'Brand',
            name: manufacturer.name,
            description: manufacturer.description,
            url: manufacturerUrl,
            logo: toAbsoluteUrl(manufacturer.logoUrl),
            brand: manufacturer.name,
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: `${manufacturer.name} Produktportfolio`,
              itemListElement: manufacturer.products.slice(0, 6).map((product, index) => ({
                '@type': 'Product',
                position: index + 1,
                name: product.name,
                description: product.description,
                category: product.category,
                image: product.imageUrl,
              })),
            },
          },
        ],
        og: {
          image: manufacturer.products[0]?.imageUrl ?? DEFAULT_SHARE_IMAGE,
        },
      };
    }
    case 'anwendungsfall-detail': {
      if (!useCase) return undefined;
      const useCaseUrl = toAbsoluteUrl(`/anwendungsfaelle/${useCase.id}`);
      return {
        title: `${useCase.title} | Erfolgsfall ZOE Solar`,
        description: useCase.description,
        keywords: [useCase.title, 'Photovoltaik Use Case', 'Solar Erfolgsstory'],
        canonical: useCaseUrl,
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: useCase.title,
            serviceType: useCase.headline,
            description: useCase.description,
            provider: {
              '@type': 'Organization',
              name: ORGANIZATION_NAME,
              url: BASE_URL,
            },
            areaServed: {
              '@type': 'AdministrativeArea',
              name: 'Deutschland',
            },
            image: useCase.imageUrl,
            url: useCaseUrl,
          },
          ...buildSpeakableSchema(useCase.title, ['article h1', 'article p']),
        ],
        og: {
          image: useCase.heroImageUrl ?? useCase.imageUrl,
        },
      };
    }
    case 'standort': {
      const normalised = normalisePath(pathname);
      const segments = normalised.split('/').filter(Boolean);
      const slugFromPath = segments[segments.length - 1];
      const region = slugFromPath ? getServiceRegionBySlug(slugFromPath) : undefined;
      if (!region) {
        return undefined;
      }
      const regionSlug = getServiceRegionSlug(region);
      if (!locationSeoCache.has(regionSlug)) {
        locationSeoCache.set(regionSlug, buildLocationSeoConfig(region, regionSlug));
      }
      return locationSeoCache.get(regionSlug);
    }
    default:
      return undefined;
  }
};

const ensureGeoCompleteness = (geo: GeoMeta): GeoMeta => {
  if (!geo.latitude || !geo.longitude) return geo;
  return {
    ...geo,
    position: `${geo.latitude};${geo.longitude}`,
  };
};

const getHeroImageForPage = (page: Page): string | undefined => {
  const hero: HeroData | undefined = pageHeroData[page];
  return hero?.bgImage;
};

export const resolveSeoForPage = (input: DynamicSeoInput): ResolvedSEO => {
  const pathForCanonical = normalisePath(input.pathname);
  const dynamicSeo = buildDynamicSeo(input);
  const merged = mergeSeoConfigs(defaultSEO, pageSpecificSEO[input.page], dynamicSeo);

  const canonicalSource = dynamicSeo?.canonical ?? pageSpecificSEO[input.page]?.canonical ?? (input.page === 'home' ? `${BASE_URL}/` : toAbsoluteUrl(pathForCanonical));
  const canonical = toAbsoluteUrl(canonicalSource);

  const keywords = dedupe(merged.keywords ?? [], (keyword) => keyword.toLowerCase());
  const structuredData = dedupeStructuredData(merged.structuredData ?? []);

  const alternates = dedupe(merged.alternates ?? [], (item) => `${item.hrefLang.toLowerCase()}|${item.href}`);
  const additionalMeta = dedupe(merged.additionalMeta ?? [], (item) => (item.name ?? item.property ?? '').toLowerCase());
  const og: OpenGraphMeta = {
    ...merged.og,
    url: canonical,
    title: merged.og?.title ?? merged.title,
    description: merged.og?.description ?? merged.description,
    image: merged.og?.image ?? getHeroImageForPage(input.page) ?? DEFAULT_SHARE_IMAGE,
    imageAlt: merged.og?.imageAlt ?? merged.title ?? defaultSEO.title,
    imageWidth: merged.og?.imageWidth ?? DEFAULT_SHARE_IMAGE_WIDTH,
    imageHeight: merged.og?.imageHeight ?? DEFAULT_SHARE_IMAGE_HEIGHT,
    imageType: merged.og?.imageType ?? DEFAULT_SHARE_IMAGE_TYPE,
    siteName: merged.og?.siteName ?? 'ZOE Solar',
    locale: merged.og?.locale ?? 'de_DE',
    type: merged.og?.type ?? 'website',
  };
  const twitter: TwitterMeta = {
    card: merged.twitter?.card ?? 'summary_large_image',
    title: merged.twitter?.title ?? merged.title,
    description: merged.twitter?.description ?? merged.description,
    image: merged.twitter?.image ?? og.image,
    site: merged.twitter?.site ?? '@zoesolar',
    creator: merged.twitter?.creator,
    imageAlt: merged.twitter?.imageAlt ?? og.imageAlt,
  };
  const geo = ensureGeoCompleteness({ ...defaultSEO.geo, ...(merged.geo ?? {}) });

  return {
    title: merged.title ?? defaultSEO.title,
    description: merged.description ?? defaultSEO.description,
    keywords,
    canonical,
    robots: merged.robots ?? defaultSEO.robots,
    alternates,
    structuredData,
    additionalMeta,
    og,
    twitter,
    geo,
    url: canonical,
  };
};
