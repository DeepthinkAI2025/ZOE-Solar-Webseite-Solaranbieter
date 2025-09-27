import { FundingProgram, Page } from '../types';
import { HeroData, pageHeroData } from './pageContent';
import { Guide } from './guidesData';
import { Manufacturer } from './products';
import { UseCase } from './useCases';
import { faqData, FaqItem, FaqCategory } from './faqData';
import { PricingPackage, pricingPackages } from './pricingPackages';
import { Article } from './articles';
import { localContentByCity } from './localContent';
import { fundingPrograms, fundingProgramLevels, getFundingProgramBySlug } from './fundingPrograms';

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

interface FaqSchemaOptions {
  includeQa?: boolean;
  about?: object;
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

const buildFaqSchema = (
  name: string,
  description: string,
  items: FaqItem[],
  options: FaqSchemaOptions = {},
): object[] => {
  if (!items.length) {
    return [];
  }
  const faqPage = {
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
  };

  if (options.includeQa === false) {
    return [faqPage];
  }

  const qaPage = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    name,
    inLanguage: 'de-DE',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: normaliseAnswerText(item.answer),
      },
    })),
    ...(options.about ? { about: options.about } : {}),
  };

  return [faqPage, qaPage];
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

const FUNDING_PAGE_DEFAULT_SLUG: Partial<Record<Page, string>> = {
  'foerdermittel-kfw': 'kfw',
  'foerdermittel-ibb': 'ibb-wirtschaft-nah',
  'foerdermittel-bafa': 'bafa-eew-zuschuss',
};

const getFundingProgramCanonical = (program: FundingProgram): string => {
  const canonical = program.seo?.canonical ?? `/foerdermittel/${program.slug}`;
  return toAbsoluteUrl(canonical);
};

const buildFundingProgramFaqSchema = (program: FundingProgram): object[] => {
  if (!program.faqs.length) {
    return [];
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: `FAQ ${program.title}`,
      description: `Häufige Fragen zu ${program.title} und den Förderbedingungen.`,
      mainEntity: program.faqs.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: entry.answer,
        },
      })),
    },
  ];
};

const buildFundingProgramHowToSchema = (program: FundingProgram, canonical: string): object | null => {
  if (!program.applicationSteps.length) {
    return null;
  }

  const supplies = program.documentsRequired.map((doc) => ({
    '@type': 'HowToSupply',
    name: doc,
  }));

  const tools = program.supportServices.map((service) => ({
    '@type': 'HowToTool',
    name: service,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Förderantrag für ${program.title} stellen`,
    description: `Anleitung für Unternehmen, um ${program.title} erfolgreich zu beantragen.`,
    totalTime: program.processingTime,
    image: program.heroImage ? [program.heroImage] : undefined,
    url: canonical,
    supply: supplies.length ? supplies : undefined,
    tool: tools.length ? tools : undefined,
    step: program.applicationSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.length > 80 ? `Schritt ${index + 1}` : step,
      text: step,
    })),
  };
};

const buildFundingProgramStructuredData = (program: FundingProgram, canonical: string): object[] => {
  const provider: Record<string, unknown> = {
    '@type': 'Organization',
    name: program.provider,
    url: program.contact.url ?? BASE_URL,
  };

  if (program.logo) {
    provider.logo = program.logo;
  }

  const contactPoint = {
    '@type': 'ContactPoint',
    telephone: program.contact.phone,
    email: program.contact.email,
    url: program.contact.url,
    hoursAvailable: program.contact.hotlineHours,
    contactType: 'customer service',
    availableLanguage: ['de'],
    description: program.contact.note,
  };

  if (program.contact.phone || program.contact.email || program.contact.url) {
    provider.contactPoint = [
      Object.fromEntries(
        Object.entries(contactPoint).filter(([, value]) => Boolean(value) && (!Array.isArray(value) || value.length > 0)),
      ),
    ];
  }

  const schemaType = program.fundingTypes.some((type) => /kredit|darlehen/i.test(type)) ? 'FinancialProduct' : 'GovernmentService';

  const baseSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: program.title,
    description: program.summary,
    url: canonical,
    provider,
    serviceType: program.fundingTypes.join(', '),
    audience: program.targetGroups.map((item) => ({
      '@type': 'Audience',
      audienceType: item,
    })),
    areaServed: program.region
      ? {
          '@type': 'AdministrativeArea',
          name: program.region,
        }
      : undefined,
    termsOfService: program.notes,
    isAccessibleForFree: true,
    funding: program.fundingRate,
  };

  const howTo = buildFundingProgramHowToSchema(program, canonical);

  const highlightList = program.highlights.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Highlights ${program.title}`,
        itemListOrder: 'http://schema.org/ItemListOrderAscending',
        itemListElement: program.highlights.map((highlight, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: highlight.title,
          description: highlight.description,
        })),
      }
    : null;

  return [
    Object.fromEntries(
      Object.entries(baseSchema).filter(([, value]) =>
        value !== undefined && value !== null && (!Array.isArray(value) || value.length > 0),
      ),
    ),
    howTo,
    highlightList,
    ...buildFundingProgramFaqSchema(program),
    ...buildSpeakableSchema(program.title, ['main h1', '.info-card', '.faq-section']),
  ].filter(Boolean) as object[];
};

const buildFundingProgramSeo = (program: FundingProgram): SEOConfig => {
  const canonical = getFundingProgramCanonical(program);
    const keywordSeed = program.seo?.keywords ?? [];
    const title = program.seo?.title ?? `${program.title} | Förderprogramm 2025`;
  const keywordSet = new Set<string>([
    program.title,
    program.provider,
    ...program.targetGroups,
    ...program.fundingTypes,
    program.level,
    ...(program.region ? [program.region] : []),
    ...keywordSeed,
  ]);

  return {
    title,
    description:
      program.seo?.description ??
      `${program.title}: Förderhöhe ${program.maxFunding ?? 'individuell'}, Förderquote ${program.fundingRate ?? 'nach Prüfung'} – begleitet von ZOE Solar.`,
    keywords: Array.from(keywordSet),
    canonical,
    og: {
      title,
      description: program.seo?.description ?? program.summary,
      image: program.heroImage ?? program.logo ?? DEFAULT_SHARE_IMAGE,
      imageAlt: program.title,
    },
    twitter: {
      title,
      description: program.seo?.description ?? program.summary,
      image: program.heroImage ?? program.logo ?? DEFAULT_SHARE_IMAGE,
    },
    geo: program.region
      ? {
          placename: program.region,
        }
      : undefined,
    structuredData: buildFundingProgramStructuredData(program, canonical),
    additionalMeta: [
      { name: 'funding:level', content: program.level },
      { name: 'funding:provider', content: program.provider },
      { name: 'funding:last_updated', content: program.lastUpdated },
    ],
  };
};

const activeFundingPrograms = fundingPrograms.filter((program) => program.isActive);

const fundingProgramCountByLevel = fundingProgramLevels.map(({ level, label }) => ({
  level,
  label,
  count: activeFundingPrograms.filter((program) => program.level === level).length,
}));

const topFundingPrograms = activeFundingPrograms.slice(0, 6);

const fundingOverviewStructuredData: object[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Förderdatenbank Solar & Speicher 2025',
    description:
      'Kuratiertes Verzeichnis aktueller Förderprogramme für Photovoltaik, Speicher und Ladeinfrastruktur in Deutschland und der EU.',
    creator: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      url: BASE_URL,
    },
    url: `${BASE_URL}/foerdermittel`,
    dateModified: new Date().toISOString(),
    variableMeasured: fundingProgramLevels.map((entry) => `${entry.label}: ${fundingProgramCountByLevel.find((item) => item.level === entry.level)?.count ?? 0} Programme`),
    distribution: activeFundingPrograms.map((program) => ({
      '@type': 'DataDownload',
      encodingFormat: 'text/html',
      contentUrl: `${BASE_URL}/foerdermittel/${program.slug}`,
      name: program.title,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Förderprogramme 2025',
    itemListOrder: 'http://schema.org/ItemListOrderAscending',
    itemListElement: topFundingPrograms.map((program, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: program.title,
      description: program.summary,
      url: `${BASE_URL}/foerdermittel/${program.slug}`,
    })),
  },
];

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
    { includeQa: false },
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
  title: 'ZOE Solar | Photovoltaik für Gewerbe, Landwirtschaft & Freiflächen',
  description:
    'ZOE Solar plant, finanziert und betreibt hochrentable Photovoltaikanlagen für Gewerbe, Landwirtschaft, Industrie und Freiflächen. Profitieren Sie von maximaler Rendite, regionaler Expertise und einem Ansprechpartner für alle Energiefragen.',
  keywords: [
    'ZOE Solar',
    'Photovoltaik Gewerbe',
    'Agri-PV Anbieter',
    'Freiflächen Photovoltaik',
    'Solarpark Brandenburg',
    'PV Finanzierung Gewerbe',
    'Industrie Solarstrom',
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
    title: 'ZOE Solar | Photovoltaik für Gewerbe, Landwirtschaft & Freiflächen',
    description:
      'ZOE Solar ist Ihr strategischer Partner für großskalige Photovoltaiklösungen – von der Planung über die Finanzierung bis zum Betrieb.',
    image: DEFAULT_SHARE_IMAGE,
    imageAlt: 'Photovoltaikanlage von ZOE Solar bei Sonnenuntergang',
    imageWidth: DEFAULT_SHARE_IMAGE_WIDTH,
    imageHeight: DEFAULT_SHARE_IMAGE_HEIGHT,
    imageType: DEFAULT_SHARE_IMAGE_TYPE,
    siteName: 'ZOE Solar',
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZOE Solar | Photovoltaik für Gewerbe, Landwirtschaft & Freiflächen',
    description:
      'Steigern Sie Rendite und Energieunabhängigkeit mit ZOE Solar. Vollservice-Photovoltaik für Gewerbe, Industrie und Agri-PV.',
    image: DEFAULT_SHARE_IMAGE,
    site: '@zoesolar',
    imageAlt: 'Photovoltaikanlage von ZOE Solar bei Sonnenuntergang',
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
        name: 'Startseite ZOE Solar',
        description:
          'Übersicht über Leistungen, Branchenlösungen und digitale Tools von ZOE Solar für Photovoltaik-Großprojekte.',
        url: `${BASE_URL}/`,
        inLanguage: 'de-DE',
      },
  ...buildSpeakableSchema('ZOE Solar Startseite', ['.hero-headline', '.hero-pitch', '.testimonial-highlight']),
    ],
  },
  photovoltaik: {
    title: 'Photovoltaik für Gewerbe & Industrie | ZOE Solar',
    description:
      'Planen Sie mit ZOE Solar hochrentable Photovoltaikprojekte für Gewerbedächer, Industrieflächen und Solarparks. Schlüsselfertige Umsetzung inklusive Finanzierung.',
    keywords: ['Gewerbe Photovoltaik', 'PV Industrie', 'Solarpark Planung'],
    structuredData: [
      createServiceSchema(
        'Photovoltaik für Gewerbe und Industrie',
        'Planung, Finanzierung, Installation und Service von großskaligen Photovoltaikanlagen für Gewerbeimmobilien, Industrie und Logistik.',
        `${BASE_URL}/service/photovoltaik`,
      ),
      ...buildRegionalServiceSchemas(
        'Photovoltaik für Gewerbe und Industrie',
        'Regionale Planung und Umsetzung von Photovoltaik-Großanlagen inklusive Netzanschluss, Monitoring und Betriebsführung.',
        `${BASE_URL}/service/photovoltaik`,
      ),
      ...buildFaqSchema(
        'Photovoltaik für Gewerbe – FAQ',
        'Antworten auf häufige Fragen zur Wirtschaftlichkeit, Technik und Umsetzung von PV-Anlagen für Unternehmen.',
  selectFaqEntries({ categories: ['Allgemein', 'Technik', 'Wirtschaftlichkeit'], limit: 4 }),
      ),
  ...buildSpeakableSchema('Photovoltaik für Gewerbe & Industrie | ZOE Solar', ['.pillar-intro', '.pillar-keyfacts', '.pillar-faq .faq-speakable-question']),
    ],
    og: {
      image: pageHeroData.photovoltaik?.bgImage,
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
    title: 'Industrielle Batteriespeicher & Peak Shaving | ZOE Solar',
    description:
      'Mit industriellen Speichern von ZOE Solar maximieren Sie Eigenverbrauch, sichern den Betrieb ab und kappen Lastspitzen.',
    keywords: ['Industrieller Speicher', 'Peak Shaving', 'PV Batteriespeicher'],
    structuredData: [
      createServiceSchema(
        'Industrielle Batteriespeicher',
        'Planung und Umsetzung von Batteriespeicherlösungen zur Eigenverbrauchsoptimierung und Lastspitzenkappung.',
        `${BASE_URL}/service/speicher`,
      ),
      ...buildRegionalServiceSchemas(
        'Industrielle Batteriespeicher & Energiemanagement',
        'Regionale Speicherlösungen für Peak Shaving, Netzersatzbetrieb und Ladeinfrastruktur-Integration.',
        `${BASE_URL}/service/speicher`,
      ),
      ...buildFaqSchema(
        'FAQ Batteriespeicher für Unternehmen',
        'Antworten zu Lebensdauer, ROI und Einsatzbereichen von Batteriespeichern im Gewerbe.',
  selectFaqEntries({ categories: ['Technik', 'Wirtschaftlichkeit'], limit: 3 }),
      ),
  ...buildSpeakableSchema('Industrielle Batteriespeicher & Peak Shaving | ZOE Solar', ['.pillar-intro', '.pillar-keyfacts', '.pillar-faq .faq-speakable-question']),
    ],
  },
  preise: {
    title: 'Photovoltaik zum Festpreis | ZOE Solar Pakete',
    description:
      'Transparente Photovoltaik-Festpreise von ZOE Solar. Vergleichen Sie Pakete für Gewerbe und private Dächer – inklusive Planung, Montage und Service.',
    keywords: ['Photovoltaik Festpreis', 'PV Paket Preise', 'Solar Komplettpaket'],
    structuredData: [
      buildOfferCatalogSchema(pricingPackages),
      ...buildFaqSchema(
        'FAQ Photovoltaik Preise',
        'Häufige Fragen zu Investitionskosten, Finanzierung und Wirtschaftlichkeit von Photovoltaikprojekten.',
  selectFaqEntries({ categories: ['Wirtschaftlichkeit'], limit: 3 }),
      ),
  ...buildSpeakableSchema('Photovoltaik Preise & Pakete | ZOE Solar', ['.pillar-intro', '.pillar-keyfacts', '.pillar-faq .faq-speakable-question']),
    ],
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
  'foerdermittel-uebersicht': {
    title: 'Förderprogramme für Photovoltaik & Speicher 2025 | ZOE Solar',
    description: `Aktuelle Übersicht über ${activeFundingPrograms.length} Förderprogramme für Solar, Speicher und Ladeinfrastruktur – inklusive Bundes-, Landes-, EU- und Kommunalprogramme.`,
    keywords: [
      'Photovoltaik Fördermittel',
      'Solar Zuschüsse 2025',
      'Förderprogramme Ladeinfrastruktur',
      'Kommunale PV Förderung',
      'EU Förderung erneuerbare Energien',
    ],
    structuredData: [
      ...fundingOverviewStructuredData,
      ...buildSpeakableSchema('Förderprogramme für Photovoltaik & Speicher 2025 | ZOE Solar', [
        'section h1',
        '.grid article h3',
      ]),
    ],
    additionalMeta: fundingProgramCountByLevel.map((entry) => ({
      name: `funding:level:${entry.level}`,
      content: `${entry.count}`,
    })),
    og: {
      image:
        'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80',
    },
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
    case 'foerdermittel-kfw':
    case 'foerdermittel-ibb':
    case 'foerdermittel-bafa':
    case 'foerdermittel-programm': {
      const normalised = normalisePath(pathname);
      const segments = normalised.split('/').filter(Boolean);
      const slugFromPath = segments[segments.length - 1];
      const fallbackSlug = FUNDING_PAGE_DEFAULT_SLUG[page];
      const resolvedSlug = page === 'foerdermittel-programm' ? slugFromPath : fallbackSlug ?? slugFromPath;
      if (!resolvedSlug) {
        return undefined;
      }
      const program = getFundingProgramBySlug(resolvedSlug);
      if (!program) {
        return undefined;
      }
      return buildFundingProgramSeo(program);
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
