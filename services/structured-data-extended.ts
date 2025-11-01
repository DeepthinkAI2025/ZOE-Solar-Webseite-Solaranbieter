/**
 * Advanced Structured Data Service für ZOE Solar
 *
 * Umfassende Implementierung von Schema.org Markup für maximale
 * Sichtbarkeit in Google Search, Google Discover und KI-Suchsystemen
 */

export interface StructuredDataOptions {
  context?: string;
  type?: string;
  id?: string;
  mainEntityOfPage?: string;
  additionalType?: string[];
  alternateName?: string[];
  description?: string;
  image?: string | string[];
  url?: string;
  sameAs?: string[];
}

export interface OrganizationData extends StructuredDataOptions {
  name: string;
  legalName?: string;
  foundingDate?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    contactType: string;
    telephone: string;
    email?: string;
    availableLanguage?: string[];
  };
  logo?: string;
  slogan?: string;
  knowsAbout?: string[];
  knowsLanguage?: string[];
  awards?: string[];
  employee?: {
    name: string;
    jobTitle: string;
  }[];
  review?: ReviewData[];
  aggregateRating?: AggregateRatingData;
}

export interface VideoObjectData extends StructuredDataOptions {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  transcript?: string;
  caption?: string;
  interactionStatistic?: {
    interactionType: string;
    userInteractionCount: number;
  };
  publisher?: OrganizationData;
  recordedAt?: {
    type: string;
    name: string;
    address: any;
  };
  regionsAllowed?: string[];
  hasPart?: {
    type: string;
    name: string;
    startOffset?: number;
    endOffset?: number;
  }[];
  thumbnail?: {
    contentUrl: string;
    width: number;
    height: number;
  }[];
  accessMode?: string[];
  accessibilityFeature?: string[];
  accessibilityHazard?: string[];
}

export interface HowToData extends StructuredDataOptions {
  name: string;
  description: string;
  image?: string[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: {
    type: string;
    name: string;
  }[];
  tool?: {
    type: string;
    name: string;
  }[];
  step: {
    type: string;
    name: string;
    text: string;
    image?: string;
    url?: string;
    itemListElement?: {
      type: string;
      position: number;
      text: string;
    }[];
  }[];
}

class StructuredDataExtendedService {
  private baseUrl: string;
  private organizationData: OrganizationData;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoe-solar.de';
    this.organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ZOE Solar GmbH',
      legalName: 'ZOE Solar GmbH',
      foundingDate: '2020-01-15',
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/zoe-solar-logo.png`,
      slogan: 'Ihr Partner für professionelle Solarlösungen',
      description: 'Führender Anbieter für Photovoltaik-Anlagen, Stromspeicher und E-Mobilitätslösungen für Unternehmen und Privathaushalte in Deutschland',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Alt-Moabit 101',
        addressLocality: 'Berlin',
        addressRegion: 'Berlin',
        postalCode: '10559',
        addressCountry: 'DE'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+49-30-12345678',
        email: 'info@zoe-solar.de',
        availableLanguage: ['German', 'English']
      },
      sameAs: [
        'https://www.linkedin.com/company/zoe-solar',
        'https://www.xing.com/company/zoe-solar',
        'https://www.facebook.com/zoe-solar',
        'https://www.instagram.com/zoe-solar'
      ],
      knowsAbout: [
        'Photovoltaik',
        'Solaranlagen',
        'Stromspeicher',
        'E-Mobilität',
        'Ladestationen',
        'Elektroinstallation',
        'Netzanschluss',
        'Solarenergie',
        'Erneuerbare Energien'
      ],
      knowsLanguage: ['German', 'English'],
      awards: [
        'Testsieger Photovoltaik 2025',
        'Top Solaranbieter Deutschland 2024',
        'Innovationspreis Solarbranche 2023'
      ]
    };
  }

  /**
   * VideoObject Schema generieren
   */
  generateVideoObjectSchema(videoData: VideoObjectData): string {
    const baseVideoData: VideoObjectData = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'ZOE Solar Präsentation',
      description: 'Professionelle Solarlösungen von ZOE Solar',
      thumbnailUrl: `${this.baseUrl}/images/video-thumbnail.jpg`,
      uploadDate: new Date().toISOString(),
      duration: 'PT5M30S',
      contentUrl: `${this.baseUrl}/videos/zoe-solar-presentation.mp4`,
      embedUrl: `${this.baseUrl}/videos/zoe-solar-presentation.embed`,
      publisher: this.organizationData,
      regionsAllowed: ['DE', 'AT', 'CH'],
      accessMode: ['visual', 'auditory'],
      accessibilityFeature: ['captions', 'transcript'],
      accessibilityHazard: 'none',
      ...videoData
    };

    return JSON.stringify(baseVideoData, null, 2);
  }

  /**
   * HowTo Schema für Anleitungen generieren
   */
  generateHowToSchema(howToData: HowToData): string {
    const baseHowToData: HowToData = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Solaranlage Planen - Schritt für Schritt',
      description: 'Kompakte Anleitung zur Planung Ihrer Solaranlage mit ZOE Solar',
      image: [
        `${this.baseUrl}/images/how-to-solar-step1.jpg`,
        `${this.baseUrl}/images/how-to-solar-step2.jpg`,
        `${this.baseUrl}/images/how-to-solar-step3.jpg`
      ],
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: '5000-50000'
      },
      totalTime: 'PT30M',
      supply: [
        {
          '@type': 'HowToSupply',
          name: 'Stromrechnung'
        },
        {
          '@type': 'HowToSupply',
          name: 'Dachfotos'
        },
        {
          '@type': 'HowToSupply',
          name: 'Verbrauchsdaten'
        }
      ],
      step: [
        {
          '@type': 'HowToStep',
          name: 'Verbrauch analysieren',
          text: 'Analysieren Sie Ihren aktuellen Stromverbrauch und Ihre Ziele für die Solaranlage.',
          image: `${this.baseUrl}/images/how-to-step1-analyse.jpg`,
          url: `${this.baseUrl}/solarrechner`
        },
        {
          '@type': 'HowToStep',
          name: 'Standort bewerten',
          text: 'Prüfen Sie Ihre Dachfläche und Ausrichtung für optimale Solarenergiegewinnung.',
          image: `${this.baseUrl}/images/how-to-step2-standort.jpg`
        },
        {
          '@type': 'HowToStep',
          name: 'Beratung anfordern',
          text: 'Kontaktieren Sie unser Experten-Team für eine professionelle Beratung und Kostenschätzung.',
          image: `${this.baseUrl}/images/how-to-step3-beratung.jpg`,
          url: `${this.baseUrl}/kontakt`
        },
        {
          '@type': 'HowToStep',
          name: 'Angebot erhalten',
          text: 'Erhalten Sie ein maßgeschneidertes Angebot für Ihre Solaranlage.',
          image: `${this.baseUrl}/images/how-to-step4-angebot.jpg`
        },
        {
          '@type': 'HowToStep',
          name: 'Installation planen',
          text: 'Planen Sie den Installationstermin mit unseren zertifizierten Monteuren.',
          image: `${this.baseUrl}/images/how-to-step5-installation.jpg`
        }
      ],
      ...howToData
    };

    return JSON.stringify(baseHowToData, null, 2);
  }

  /**
   * Spezialisierte Video-Schemas für Solar-Content generieren
   */
  generateSolarVideoSchemas(): string[] {
    const videoSchemas: string[] = [];

    // How-To Video: Solaranlage Planen
    const howToVideo = this.generateVideoObjectSchema({
      name: 'Solaranlage Planen in 5 Schritten - ZOE Solar',
      description: 'Lernen Sie, wie Sie Ihre Solaranlage professionell planen. Von der Verbrauchsanalyse bis zur Installation.',
      thumbnailUrl: `${this.baseUrl}/images/video-thumbnails/solar-planning.jpg`,
      uploadDate: '2025-01-15T10:00:00Z',
      duration: 'PT8M45S',
      contentUrl: `${this.baseUrl}/videos/solar-planning-guide.mp4`,
      embedUrl: `${this.baseUrl}/videos/solar-planning-guide.embed`,
      transcript: `Willkommen zum ZOE Solar Planungsguide. Schritt 1: Analysieren Sie Ihren Stromverbrauch...`,
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: 1250
      },
      hasPart: [
        {
          '@type': 'Clip',
          name: 'Verbrauchsanalyse',
          startOffset: 30,
          endOffset: 180
        },
        {
          '@type': 'Clip',
          name: 'Dachbewertung',
          startOffset: 180,
          endOffset: 300
        },
        {
          '@type': 'Clip',
          name: 'Fördermittel',
          startOffset: 300,
          endOffset: 420
        }
      ]
    });

    videoSchemas.push(howToVideo);

    // Produkt-Video: Stromspeicher
    const storageVideo = this.generateVideoObjectSchema({
      name: 'Stromspeicher im Test: Das sagt der Experte',
      description: 'Kompletter Test der modernsten Stromspeicher für Solaranlagen. Effizienz, Kosten und Empfehlungen.',
      thumbnailUrl: `${this.baseUrl}/images/video-thumbnails/battery-storage.jpg`,
      uploadDate: '2025-01-20T14:00:00Z',
      duration: 'PT12M30S',
      contentUrl: `${this.baseUrl}/videos/battery-storage-test.mp4`,
      embedUrl: `${this.baseUrl}/videos/battery-storage-test.embed`,
      caption: 'Professioneller Stromspeicher-Test durch ZOE Solar Experten',
      regionsAllowed: ['DE', 'AT', 'CH'],
      recordedAt: {
        '@type': 'Place',
        name: 'ZOE Solar Testzentrum Berlin',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Teststraße 123',
          addressLocality: 'Berlin',
          addressRegion: 'Berlin',
          postalCode: '10559',
          addressCountry: 'DE'
        }
      }
    });

    videoSchemas.push(storageVideo);

    // Kunden-Video: Erfolgsstory
    const customerVideo = this.generateVideoObjectSchema({
      name: 'Kundenerfahrung: Solaranlage für mittelständisches Unternehmen',
      description: 'Herr Schmidt vom Bauunternehmen berichtet über seine Solaranlage von ZOE Solar und die Einsparungen.',
      thumbnailUrl: `${this.baseUrl}/images/video-thumbnails/customer-testimonial.jpg`,
      uploadDate: '2025-01-25T09:00:00Z',
      duration: 'PT6M15S',
      contentUrl: `${this.baseUrl}/videos/customer-testimonial-schmidt.mp4`,
      embedUrl: `${this.baseUrl}/videos/customer-testimonial-schmidt.embed`,
      accessMode: ['visual', 'auditory'],
      accessibilityFeature: ['captions', 'transcript'],
      accessibilityHazard: 'none'
    });

    videoSchemas.push(customerVideo);

    return videoSchemas;
  }

  /**
   * Spezialisierte How-To Schemas für Solar-Prozesse generieren
   */
  generateSolarHowToSchemas(): string[] {
    const howToSchemas: string[] = [];

    // How-To: Photovoltaik Förderung beantragen
    const fundingHowTo = this.generateHowToSchema({
      name: 'Photovoltaik Förderung beantragen - Schritt-für-Schritt Anleitung',
      description: 'Alle Schritte zur Beantragung von Solarförderung in Deutschland. KfW, BAFA und regionale Programme.',
      image: [
        `${this.baseUrl}/images/how-to/funding-step1.jpg`,
        `${this.baseUrl}/images/how-to/funding-step2.jpg`,
        `${this.baseUrl}/images/how-to/funding-step3.jpg`
      ],
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: '0'
      },
      totalTime: 'PT45M',
      supply: [
        {
          '@type': 'HowToSupply',
          name: 'Einkommensnachweis'
        },
        {
          '@type': 'HowToSupply',
          name: 'Angebote von Solaranbietern'
        },
        {
          '@type': 'HowToSupply',
          name: 'Gebäudeunterlagen'
        }
      ],
      step: [
        {
          '@type': 'HowToStep',
          name: 'Förderprogramme recherchieren',
          text: 'Finden Sie passende Förderprogramme für Ihre Solaranlage. Prüfen Sie KfW-Kredite, BAFA-Förderung und regionale Programme.',
          image: `${this.baseUrl}/images/how-to/funding-research.jpg`,
          url: `${this.baseUrl}/foerdermittel-check`
        },
        {
          '@type': 'HowToStep',
          name: 'Voraussetzungen prüfen',
          text: 'Überprüfen Sie die Förderbedingungen und stellen Sie sicher, dass Sie alle Anforderungen erfüllen.',
          image: `${this.baseUrl}/images/how-to/funding-requirements.jpg`
        },
        {
          '@type': 'HowToStep',
          name: 'Antrag vorbereiten',
          text: 'Sammeln Sie alle notwendigen Unterlagen: Einkommensnachweis, Angebote, Gebäudeunterlagen und technische Details.',
          image: `${this.baseUrl}/images/how-to/funding-documents.jpg`
        },
        {
          '@type': 'HowToStep',
          name: 'Online Antrag stellen',
          text: 'Füllen Sie den Förderantrag online aus bei der jeweiligen Förderinstitution (KfW, BAFA oder Landeskreditbank).',
          image: `${this.baseUrl}/images/how-to/funding-online.jpg`
        },
        {
          '@type': 'HowToStep',
          name: 'Bewilligung abwarten',
          text: 'Nach der Einreichung erhalten Sie eine Zusage oder Ablehnung. Bei Zusage können Sie mit der Solaranlage beginnen.',
          image: `${this.baseUrl}/images/how-to/funding-approval.jpg`
        }
      ]
    });

    howToSchemas.push(fundingHowTo);

    // How-To: Solarrechner nutzen
    const calculatorHowTo = this.generateHowToSchema({
      name: 'Solarrechner nutzen: Ertrag genau berechnen',
      description: 'Nutzen Sie unseren professionellen Solarrechner für eine genaue Berechnung Ihres Solarertrags und der Amortisationszeit.',
      image: [
        `${this.baseUrl}/images/how-to/calculator-step1.jpg`,
        `${this.baseUrl}/images/how-to/calculator-step2.jpg`
      ],
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: '0'
      },
      totalTime: 'PT15M',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Standort eingeben',
          text: 'Geben Sie Ihre Postleitzahl ein, um den Sonneneintrag und die regionalen Faktoren zu berücksichtigen.',
          image: `${this.baseUrl}/images/how-to/calculator-location.jpg`,
          url: `${this.baseUrl}/solarrechner`
        },
        {
          '@type': 'HowToStep',
          name: 'Verbrauch angeben',
          text: 'Tragen Sie Ihren jährlichen Stromverbrauch in kWh ein. Finden Sie den Wert auf Ihrer Jahresstromrechnung.',
          image: `${this.baseUrl}/images/how-to/calculator-consumption.jpg`
        },
        {
          '@type': 'HowToStep',
          name: 'Dachfläche angeben',
          text: 'Messen Sie Ihre verfügbare Dachfläche und geben Sie die Ausrichtung (Süd, Süd-West, etc.) an.',
          image: `${this.baseUrl}/images/how-to/calculator-roof.jpg`
        },
        {
          '@type': 'HowToStep',
          name: 'Ergebnisse analysieren',
          text: 'Analysieren Sie die berechneten Werte: Jahresertrag, Einsparungen und Amortisationszeit.',
          image: `${this.baseUrl}/images/how-to/calculator-results.jpg`
        }
      ]
    });

    howToSchemas.push(calculatorHowTo);

    return howToSchemas;
  }

  /**
   * Alle erweiterten Schemas für die Seite generieren
   */
  generateAllExtendedSchemas(): string[] {
    const schemas: string[] = [];

    // Basis-Organisation Schema
    schemas.push(JSON.stringify(this.organizationData, null, 2));

    // Video Schemas
    schemas.push(...this.generateSolarVideoSchemas());

    // How-To Schemas
    schemas.push(...this.generateSolarHowToSchemas());

    return schemas;
  }

  /**
   * Alle erweiterten Schemas in die Seite injizieren
   */
  injectAllExtendedSchemas(): void {
    if (typeof document === 'undefined') return;

    const schemas = this.generateAllExtendedSchemas();

    schemas.forEach((schema, index) => {
      this.injectStructuredData(schema, `extended-schema-${index}`);
    });
  }

  /**
   * JSON-LD Script in DOM einfügen
   */
  private injectStructuredData(schema: string, id?: string): void {
    if (typeof document === 'undefined') return;

    // Prüfen ob Schema bereits existiert
    const existingScript = id ? document.querySelector(`script[data-structured-data-id="${id}"]`) : null;
    if (existingScript) {
      existingScript.textContent = schema;
      return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = schema;

    if (id) {
      script.setAttribute('data-structured-data-id', id);
    }

    document.head.appendChild(script);
  }
}

// Singleton-Instanz exportieren
export const structuredDataExtendedService = new StructuredDataExtendedService();

// Global für einfachen Zugriff
if (typeof window !== 'undefined') {
  window.structuredDataExtended = structuredDataExtendedService;
}

export default structuredDataExtendedService;

// Types für globale Erweiterung
declare global {
  interface Window {
    structuredDataExtended: typeof structuredDataExtendedService;
  }
}