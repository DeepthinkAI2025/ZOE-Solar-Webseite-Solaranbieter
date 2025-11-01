/**
 * Local SEO Optimization Service für ZOE Solar
 *
 * Umfassende Optimierung für lokale Suchmaschinen-Sichtbarkeit
 * und Google Business Profile Management
 */

export interface LocalBusinessLocation {
  id: string;
  name: string;
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email: string;
  website: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  serviceArea: {
    type: 'circle' | 'polygon';
    radiusKm?: number;
    coordinates?: { lat: number; lng: number }[];
    cities: string[];
  };
  googleBusinessProfile?: GoogleBusinessProfile;
}

export interface GoogleBusinessProfile {
  name: string;
  categories: string[];
  description: string;
  phone: string;
  website: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  openingHours: Record<string, string>;
  attributes: {
    name: string;
    value: boolean | string;
  }[];
  photos: {
    url: string;
    title: string;
    description?: string;
    category: 'exterior' | 'interior' | 'product' | 'at_work' | 'team';
  }[];
  reviews: {
    rating: number;
    count: number;
    recent: {
      author: string;
      rating: number;
      comment: string;
      date: string;
    }[];
  };
  services: {
    name: string;
    category: string;
    description: string;
    priceRange?: string;
  }[];
  posts: {
    type: 'update' | 'offer' | 'event';
    title: string;
    summary: string;
    callToAction: {
      type: string;
      url: string;
      label: string;
    };
    photos?: string[];
    publishDate: string;
  }[];
}

export interface LocalCitation {
  platform: string;
  url?: string;
  businessName: string;
  address: string;
  phone: string;
  website: string;
  categories: string[];
  description: string;
  isClaimed: boolean;
  hasReviews: boolean;
  lastUpdated: string;
}

export interface LocalKeywordData {
  keyword: string;
  monthlySearches: number;
  competition: 'low' | 'medium' | 'high';
  intent: 'local' | 'informational' | 'commercial';
  locationSpecific: boolean;
  suggestedBid?: number;
  difficulty: number;
}

export interface LocalRankingFactor {
  factor: string;
  importance: number; // 0-100
  currentValue: number; // 0-100
  recommendations: string[];
}

class LocalSEOService {
  private baseUrl: string;
  private locations: Map<string, LocalBusinessLocation>;
  private localCitations: LocalCitation[];
  private germanCities: string[];

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoe-solar.de';
    this.locations = new Map();
    this.localCitations = [];
    this.germanCities = [
      'Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart',
      'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden',
      'Hannover', 'Nürnberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld'
    ];

    this.initializeLocations();
    this.generateLocalCitations();
  }

  /**
   * Standorte initialisieren
   */
  private initializeLocations(): void {
    const mainLocations: LocalBusinessLocation[] = [
      {
        id: 'berlin-hq',
        name: 'ZOE Solar Berlin Headquarters',
        address: {
          street: 'Alt-Moabit',
          houseNumber: '101',
          postalCode: '10559',
          city: 'Berlin',
          state: 'Berlin',
          country: 'Deutschland'
        },
        coordinates: {
          latitude: 52.520008,
          longitude: 13.404954
        },
        phone: '+49 30 12345678',
        email: 'berlin@zoe-solar.de',
        website: `${this.baseUrl}/standort/berlin`,
        openingHours: {
          monday: '08:00-18:00',
          tuesday: '08:00-18:00',
          wednesday: '08:00-18:00',
          thursday: '08:00-18:00',
          friday: '08:00-18:00',
          saturday: '09:00-14:00',
          sunday: 'geschlossen'
        },
        services: [
          'Photovoltaik Anlagen',
          'Stromspeicher',
          'Ladestationen',
          'Elektroinstallation',
          'Wartung & Service',
          'Beratung'
        ],
        serviceArea: {
          type: 'circle',
          radiusKm: 100,
          cities: ['Berlin', 'Potsdam', 'Brandenburg an der Havel', 'Cottbus', 'Frankfurt (Oder)']
        }
      },
      {
        id: 'muenchen-south',
        name: 'ZOE Solar München Südbayern',
        address: {
          street: 'Werner-von-Siemens-Straße',
          houseNumber: '15',
          postalCode: '82110',
          city: 'Germering',
          state: 'Bayern',
          country: 'Deutschland'
        },
        coordinates: {
          latitude: 48.135125,
          longitude: 11.581981
        },
        phone: '+49 89 12345678',
        email: 'muenchen@zoe-solar.de',
        website: `${this.baseUrl}/standort/muenchen`,
        openingHours: {
          monday: '07:30-18:30',
          tuesday: '07:30-18:30',
          wednesday: '07:30-18:30',
          thursday: '07:30-18:30',
          friday: '07:30-18:30',
          saturday: '09:00-16:00',
          sunday: 'geschlossen'
        },
        services: [
          'Photovoltaik Gewerbe',
          'Industrielle Solaranlagen',
          'Agri-PV',
          'Carport-Solar',
          'Großspeicher',
          'E-Mobilität'
        ],
        serviceArea: {
          type: 'polygon',
          coordinates: [
            { lat: 48.4, lng: 11.3 },
            { lat: 48.4, lng: 11.8 },
            { lat: 47.9, lng: 11.8 },
            { lat: 47.9, lng: 11.3 }
          ],
          cities: ['München', 'Augsburg', 'Ingolstadt', 'Rosenheim', 'Landshut']
        }
      },
      {
        id: 'hamburg-north',
        name: 'ZOE Solar Hamburg Norddeutschland',
        address: {
          street: 'Am Kaiserkai',
          houseNumber: '69',
          postalCode: '20457',
          city: 'Hamburg',
          state: 'Hamburg',
          country: 'Deutschland'
        },
        coordinates: {
          latitude: 53.551086,
          longitude: 9.993682
        },
        phone: '+49 40 12345678',
        email: 'hamburg@zoe-solar.de',
        website: `${this.baseUrl}/standort/hamburg`,
        openingHours: {
          monday: '08:00-17:30',
          tuesday: '08:00-17:30',
          wednesday: '08:00-17:30',
          thursday: '08:00-17:30',
          friday: '08:00-17:30',
          saturday: '10:00-14:00',
          sunday: 'geschlossen'
        },
        services: [
          'Solaranlagen für Hausbesitzer',
          'Gewerbe-Photovoltaik',
          'Stromspeicher Systeme',
          'Ladeinfrastruktur',
          'Solar-Finanzierung'
        ],
        serviceArea: {
          type: 'circle',
          radiusKm: 120,
          cities: ['Hamburg', 'Bremen', 'Lüneburg', 'Stade', 'Buxtehude']
        }
      },
      {
        id: 'koeln-west',
        name: 'ZOE Solar Köln Westdeutschland',
        address: {
          street: 'Ehrenfeldgürtel',
          houseNumber: '112',
          postalCode: '50823',
          city: 'Köln',
          state: 'Nordrhein-Westfalen',
          country: 'Deutschland'
        },
        coordinates: {
          latitude: 50.937527,
          longitude: 6.960286
        },
        phone: '+49 221 12345678',
        email: 'koeln@zoe-solar.de',
        website: `${this.baseUrl}/standort/koeln`,
        openingHours: {
          monday: '08:00-18:00',
          tuesday: '08:00-18:00',
          wednesday: '08:00-18:00',
          thursday: '08:00-18:00',
          friday: '08:00-18:00',
          saturday: '09:00-15:00',
          sunday: 'geschlossen'
        },
        services: [
          'Solarberatung',
          'Planung & Installation',
          'Service & Wartung',
          'Speichertechnologie',
          'Smart Home Integration'
        ],
        serviceArea: {
          type: 'polygon',
          cities: ['Köln', 'Bonn', 'Aachen', 'Düsseldorf', 'Leverkusen']
        }
      }
    ];

    mainLocations.forEach(location => {
      this.locations.set(location.id, location);
    });
  }

  /**
   * Local Citations generieren
   */
  private generateLocalCitations(): void {
    const citationPlatforms = [
      {
        name: 'Google Business Profile',
        url: 'https://business.google.com',
        importance: 'high'
      },
      {
        name: 'Gelbe Seiten',
        url: 'https://www.gelbeseiten.de',
        importance: 'high'
      },
      {
        name: 'Das Örtliche',
        url: 'https://www.dasoertliche.de',
        importance: 'high'
      },
      {
        name: 'Yelp',
        url: 'https://www.yelp.de',
        importance: 'medium'
      },
      {
        name: 'Meine Stadt',
        url: 'https://www.meinestadt.de',
        importance: 'medium'
      },
      {
        name: 'GoYellow',
        url: 'https://www.goyellow.de',
        importance: 'medium'
      },
      {
        name: 'Kompass',
        url: 'https://www.kompass.com',
        importance: 'low'
      },
      {
        name: 'Wer zu Wen',
        url: 'https://www.werzuwen.de',
        importance: 'low'
      }
    ];

    this.locations.forEach(location => {
      citationPlatforms.forEach(platform => {
        const citation: LocalCitation = {
          platform: platform.name,
          url: platform.url,
          businessName: location.name,
          address: `${location.address.street} ${location.address.houseNumber}, ${location.address.postalCode} ${location.address.city}`,
          phone: location.phone,
          website: location.website,
          categories: this.generateLocalCategories(location.services),
          description: this.generateLocalDescription(location),
          isClaimed: false,
          hasReviews: false,
          lastUpdated: new Date().toISOString()
        };

        this.localCitations.push(citation);
      });
    });
  }

  /**
   * Lokale Kategorien generieren
   */
  private generateLocalCategories(services: string[]): string[] {
    const categories = new Set<string>();

    services.forEach(service => {
      if (service.includes('Photovoltaik') || service.includes('Solar')) {
        categories.add('Solar Energy Contractor');
        categories.add('Solar Panel Cleaning Service');
      }
      if (service.includes('Elektro') || service.includes('Installation')) {
        categories.add('Electrician');
        categories.add('Electrical Installation Service');
      }
      if (service.includes('Ladestation') || service.includes('E-Mobilität')) {
        categories.add('Electric Vehicle Charging Station');
      }
      if (service.includes('Beratung') || service.includes('Service')) {
        categories.add('Home Energy Service');
      }
    });

    return Array.from(categories);
  }

  /**
   * Lokale Beschreibung generieren
   */
  private generateLocalDescription(location: LocalBusinessLocation): string {
    return `Ihr lokaler Experte für Photovoltaik und Solaranlagen in ${location.address.city}. Professionelle Beratung, Planung und Installation von Solarlösungen für Privathaushalte und Gewerbe. Jetzt kostenlose Beratung anfordern! 📞 ${location.phone}`;
  }

  /**
   * Google Business Profile für einen Standort erstellen
   */
  createGoogleBusinessProfile(locationId: string): GoogleBusinessProfile {
    const location = this.locations.get(locationId);
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }

    const profile: GoogleBusinessProfile = {
      name: location.name,
      categories: this.generateLocalCategories(location.services),
      description: this.generateLocalDescription(location),
      phone: location.phone,
      website: location.website,
      address: `${location.address.street} ${location.address.houseNumber}, ${location.address.postalCode} ${location.address.city}`,
      location: location.coordinates,
      openingHours: location.openingHours,
      attributes: [
        { name: 'Mask required', value: false },
        { name: 'Staff required to wear masks', value: false },
        { name: 'Appointments required', value: false },
        { name: 'Women-owned', value: false },
        { name: 'Black-owned', value: false },
        { name: 'Wheelchair accessible', value: true },
        { name: 'Offers outdoor seating', value: false },
        { name: 'Good for kids', value: false }
      ],
      photos: this.generateBusinessPhotos(location),
      reviews: this.generateMockReviews(location),
      services: this.generateBusinessServices(location),
      posts: this.generateBusinessPosts(location)
    };

    return profile;
  }

  /**
   * Geschäftsfotos generieren
   */
  private generateBusinessPhotos(location: LocalBusinessLocation) {
    return [
      {
        url: `${this.baseUrl}/images/business/${location.id}/exterior-1.jpg`,
        title: `Außenansicht ZOE Solar ${location.address.city}`,
        description: 'Unser modernes Büro und Showroom',
        category: 'exterior' as const
      },
      {
        url: `${this.baseUrl}/images/business/${location.id}/team-1.jpg`,
        title: `Unser Expertenteam in ${location.address.city}`,
        description: 'Zertifizierte Solarberater und Monteure',
        category: 'team' as const
      },
      {
        url: `${this.baseUrl}/images/business/${location.id}/solar-installation.jpg`,
        title: 'Referenzinstallation',
        description: 'Kürzlich fertiggestellte Solaranlage',
        category: 'at_work' as const
      },
      {
        url: `${this.baseUrl}/images/business/${location.id}/solar-panels.jpg`,
        title: 'Hochwertige Solarmodule',
        description: 'Qualitätsprodukte von führenden Herstellern',
        category: 'product' as const
      }
    ];
  }

  /**
   * Mock-Bewertungen generieren (für Demo-Zwecke)
   */
  private generateMockReviews(location: LocalBusinessLocation) {
    return {
      rating: 4.8,
      count: 127,
      recent: [
        {
          author: 'Max Mustermann',
          rating: 5,
          comment: `Exzellente Beratung und professionelle Installation in ${location.address.city}. Team sehr kompetent!`,
          date: '2025-01-15'
        },
        {
          author: 'Schmidt GmbH',
          rating: 5,
          comment: 'Schnelle Umsetzung und gute Preise. Unsere Gewerbeanlage läuft perfekt.',
          date: '2025-01-12'
        },
        {
          author: 'Anna Bauer',
          rating: 4,
          comment: 'Guter Service, saubere Arbeit. Nur etwas teurer als andere Anbieter.',
          date: '2025-01-10'
        }
      ]
    };
  }

  /**
   * Geschäftsdienste generieren
   */
  private generateBusinessServices(location: LocalBusinessLocation) {
    return location.services.map(service => ({
      name: service,
      category: this.getServiceCategory(service),
      description: this.getServiceDescription(service),
      priceRange: this.getServicePriceRange(service)
    }));
  }

  /**
   * Service-Kategorie ermitteln
   */
  private getServiceCategory(service: string): string {
    if (service.includes('Photovoltaik') || service.includes('Solar')) return 'Solar Energy System Installation';
    if (service.includes('Speicher')) return 'Energy Storage System Installation';
    if (service.includes('Ladestation')) return 'Electric Vehicle Charging Station Installation';
    if (service.includes('Wartung')) return 'Solar Panel Cleaning Service';
    return 'Home Energy Consultant';
  }

  /**
   * Service-Beschreibung generieren
   */
  private getServiceDescription(service: string): string {
    const descriptions: Record<string, string> = {
      'Photovoltaik Anlagen': 'Professionelle Planung und Installation von Solaranlagen für maximale Energieerzeugung.',
      'Stromspeicher': 'Moderne Batteriespeicher für erhöhte Autarkie und optimale Nutzung des Solarstroms.',
      'Ladestationen': 'Installation von Wallboxen und Ladeinfrastruktur für Elektrofahrzeuge.',
      'Elektroinstallation': 'Komplette Elektroinstallation und Netzanschluss für Solaranlagen.',
      'Wartung & Service': 'Regelmäßige Wartung und technischer Support für optimale Anlagenperformance.',
      'Beratung': 'Umfassende Beratung zu Förderungen, Technik und Rentabilität von Solaranlagen.'
    };

    return descriptions[service] || 'Professionelle Dienstleistungen im Bereich Solarenergie.';
  }

  /**
   * Service-Preisbereich ermitteln
   */
  private getServicePriceRange(service: string): string {
    const priceRanges: Record<string, string> = {
      'Photovoltaik Anlagen': '€€€',
      'Stromspeicher': '€€',
      'Ladestationen': '€€',
      'Elektroinstallation': '€€€',
      'Wartung & Service': '€',
      'Beratung': 'Kostenlos'
    };

    return priceRanges[service] || '€€';
  }

  /**
   * Geschäftsposts generieren
   */
  private generateBusinessPosts(location: LocalBusinessLocation) {
    return [
      {
        type: 'offer' as const,
        title: 'Frühjahrs-Aktion: Solaranlage mit 15% Rabatt',
        summary: `Bis zum 31. März erhalten Sie in ${location.address.city} 15% Rabatt auf alle Solaranlagen! Sichern Sie sich den staatlichen Förderbonus.`,
        callToAction: {
          type: 'LEARN_MORE',
          url: `${location.website}?source=gmb-post-fruehjahr`,
          label: 'Angebot anfordern'
        },
        photos: [`${this.baseUrl}/images/business/${location.id}/spring-promo.jpg`],
        publishDate: new Date().toISOString()
      },
      {
        type: 'update' as const,
        title: 'Neue Förderprogramme 2025',
        summary: `Die aktuellen Förderbedingungen für Solaranlagen in ${location.address.state} sind da. Bis zu 30% Zuschuss möglich!`,
        callToAction: {
          type: 'LEARN_MORE',
          url: `${location.website}/foerdermittel`,
          label: 'Mehr erfahren'
        },
        publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        type: 'event' as const,
        title: 'Solar-Infotag in ' + location.address.city,
        summary: 'Kommen Sie zu unserem kostenlosen Informationstag und erleben Sie Live-Demonstrationen unserer Solarlösungen.',
        callToAction: {
          type: 'RSVP',
          url: `${location.website}/infotag`,
          label: 'Jetzt anmelden'
        },
        publishDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  /**
   * Lokale Keywords analysieren
   */
  generateLocalKeywords(locationId: string): LocalKeywordData[] {
    const location = this.locations.get(locationId);
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }

    const baseKeywords = [
      {
        keyword: `photovoltaik ${location.address.city.toLowerCase()}`,
        monthlySearches: 480,
        competition: 'medium' as const,
        intent: 'local' as const,
        locationSpecific: true,
        suggestedBid: 2.50,
        difficulty: 45
      },
      {
        keyword: `solaranlage ${location.address.city.toLowerCase()}`,
        monthlySearches: 390,
        competition: 'medium' as const,
        intent: 'local' as const,
        locationSpecific: true,
        suggestedBid: 2.30,
        difficulty: 42
      },
      {
        keyword: `solaranbieter ${location.address.city.toLowerCase()}`,
        monthlySearches: 210,
        competition: 'high' as const,
        intent: 'local' as const,
        locationSpecific: true,
        suggestedBid: 3.80,
        difficulty: 58
      },
      {
        keyword: `solarfirma ${location.address.city.toLowerCase()}`,
        monthlySearches: 160,
        competition: 'medium' as const,
        intent: 'local' as const,
        locationSpecific: true,
        suggestedBid: 2.90,
        difficulty: 40
      },
      {
        keyword: 'photovoltaik gewerbe',
        monthlySearches: 1200,
        competition: 'high' as const,
        intent: 'commercial' as const,
        locationSpecific: false,
        suggestedBid: 4.20,
        difficulty: 65
      },
      {
        keyword: 'stromspeicher preise',
        monthlySearches: 890,
        competition: 'high' as const,
        intent: 'commercial' as const,
        locationSpecific: false,
        suggestedBid: 3.10,
        difficulty: 52
      },
      {
        keyword: 'solarförderung 2025',
        monthlySearches: 2100,
        competition: 'high' as const,
        intent: 'informational' as const,
        locationSpecific: false,
        suggestedBid: 2.80,
        difficulty: 61
      },
      {
        keyword: `solarförderung ${location.address.state.toLowerCase()}`,
        monthlySearches: 320,
        competition: 'medium' as const,
        intent: 'local' as const,
        locationSpecific: true,
        suggestedBid: 2.60,
        difficulty: 38
      }
    ];

    return baseKeywords;
  }

  /**
   * Lokale Ranking-Faktoren analysieren
   */
  analyzeLocalRankingFactors(locationId: string): LocalRankingFactor[] {
    const location = this.locations.get(locationId);
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }

    const factors: LocalRankingFactor[] = [
      {
        factor: 'Google Business Profile Optimierung',
        importance: 95,
        currentValue: 75,
        recommendations: [
          'Profile vollständig ausfüllen',
          'Regelmäßige Posts veröffentlichen',
          'Fotos hinzufügen',
          'Bewertungen aktiv anfordern'
        ]
      },
      {
        factor: 'Lokale Citations (NAP-Konsistenz)',
        importance: 88,
        currentValue: 60,
        recommendations: [
          'NAP (Name, Address, Phone) konsistent halten',
          'Alle wichtigen Verzeichnisse erfassen',
          'Regelmäßige Aktualisierung der Daten',
          'Local Business Schema implementieren'
        ]
      },
      {
        factor: 'Online Reviews und Reputation',
        importance: 85,
        currentValue: 80,
        recommendations: [
          'Aktive Bewertungsanfragen',
          'Professionelle Beantwortung aller Bewertungen',
          'Bewertungsrate > 4.5 Sternen halten',
          'Regelmäßige neue Bewertungen generieren'
        ]
      },
      {
        factor: 'Lokale Backlinks',
        importance: 78,
        currentValue: 45,
        recommendations: [
          'Lokale Branchenverzeichnisse nutzen',
          'Kooperationen mit lokalen Unternehmen',
          'Sponsorings lokaler Veranstaltungen',
          'Pressemitteilungen für lokale Medien'
        ]
      },
      {
        factor: 'On-Page Local SEO',
        importance: 82,
        currentValue: 70,
        recommendations: [
          'Standort-spezifische Landingpages',
          'Local Business Schema Markup',
          'Bewertungen auf Website integrieren',
          'Standort-Keywords in Title/Meta'
        ]
      },
      {
        factor: 'Mobile Optimierung',
        importance: 90,
        currentValue: 85,
        recommendations: [
          'Mobile-first Design sicherstellen',
          'Click-to-Call Funktionalität',
          'Standortbasierte Navigation',
          'Schnelle Ladezeiten auf Mobilgeräten'
        ]
      },
      {
        factor: 'Behavioral Signals',
        importance: 72,
        currentValue: 65,
        recommendations: [
          'Click-Through-Rate verbessern',
          'Verweildauer auf Seiten erhöhen',
          'Interaktive Elemente einbauen',
          'Lokale Events und Aktionen bewerben'
        ]
      }
    ];

    return factors;
  }

  /**
   * Local SEO Audit durchführen
   */
  performLocalSEOAudit(locationId: string): {
    overallScore: number;
    factors: LocalRankingFactor[];
    recommendations: string[];
    nextSteps: string[];
  } {
    const factors = this.analyzeLocalRankingFactors(locationId);
    const overallScore = Math.round(
      factors.reduce((sum, factor) => sum + factor.currentValue, 0) / factors.length
    );

    const allRecommendations = factors.flatMap(factor => factor.recommendations);
    const criticalRecommendations = allRecommendations.filter(rec =>
      rec.includes('wichtig') || rec.includes('sollte') || rec.includes('muss')
    );

    const nextSteps = [
      'Google Business Profile vollständig optimieren',
      'NAP-Konsistenz auf allen Plattformen sicherstellen',
      'Bewertungsstrategie implementieren',
      'Lokale Content-Marketing-Kampagne starten',
      'Backlink-Aufbau in der Region vorantreiben',
      'Monatliches Local SEO Monitoring etablieren'
    ];

    return {
      overallScore,
      factors,
      recommendations: allRecommendations,
      nextSteps
    };
  }

  /**
   * NAP-Konsistenz prüfen
   */
  checkNAPConsistency(locationId: string): {
    isConsistent: boolean;
    inconsistencies: Array<{
      platform: string;
      field: string;
      expectedValue: string;
      actualValue: string;
    }>;
    score: number;
  } {
    const location = this.locations.get(locationId);
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }

    const expectedNAP = {
      name: location.name,
      address: `${location.address.street} ${location.address.houseNumber}, ${location.address.postalCode} ${location.address.city}`,
      phone: location.phone,
      website: location.website
    };

    const inconsistencies = [];
    const relevantCitations = this.localCitations.filter(citation =>
      citation.businessName.includes(location.address.city) ||
      citation.platform === 'Google Business Profile'
    );

    // Simuliere einige Inconsistencies für Demo
    const mockInconsistencies = [
      {
        platform: 'Gelbe Seiten',
        field: 'phone',
        expectedValue: expectedNAP.phone,
        actualValue: '+49 30 12345679' // Falsche Nummer
      },
      {
        platform: 'Das Örtliche',
        field: 'address',
        expectedValue: expectedNAP.address,
        actualValue: 'Alt-Moabit 102, 10559 Berlin' // Falsche Hausnummer
      }
    ];

    inconsistencies.push(...mockInconsistencies);

    const isConsistent = inconsistencies.length === 0;
    const score = Math.max(0, 100 - (inconsistencies.length * 20));

    return {
      isConsistent,
      inconsistencies,
      score
    };
  }

  /**
   * Lokale Backlink-Opportunities identifizieren
   */
  identifyLocalBacklinkOpportunities(locationId: string): {
    opportunities: Array<{
      source: string;
      type: 'directory' | 'partner' | 'sponsorship' | 'media' | 'blog';
      domainAuthority: number;
      relevanceScore: number;
      difficulty: 'easy' | 'medium' | 'hard';
      estimatedCost: number;
    }>;
  } {
    const location = this.locations.get(locationId);
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }

    const opportunities = [
      {
        source: `${location.address.city} Wirtschaftsförderung`,
        type: 'partner' as const,
        domainAuthority: 65,
        relevanceScore: 90,
        difficulty: 'easy' as const,
        estimatedCost: 0
      },
      {
        source: `${location.address.city} IHK`,
        type: 'directory' as const,
        domainAuthority: 72,
        relevanceScore: 85,
        difficulty: 'easy' as const,
        estimatedCost: 150
      },
      {
        source: 'Umweltverband ' + location.address.state,
        type: 'partner' as const,
        domainAuthority: 68,
        relevanceScore: 80,
        difficulty: 'medium' as const,
        estimatedCost: 0
      },
      {
        source: `${location.address.city} Gazette`,
        type: 'media' as const,
        domainAuthority: 58,
        relevanceScore: 75,
        difficulty: 'medium' as const,
        estimatedCost: 500
      },
      {
        source: 'Energiewende Blog ' + location.address.state,
        type: 'blog' as const,
        domainAuthority: 45,
        relevanceScore: 70,
        difficulty: 'easy' as const,
        estimatedCost: 100
      },
      {
        source: `${location.address.city} Fußballverein`,
        type: 'sponsorship' as const,
        domainAuthority: 42,
        relevanceScore: 60,
        difficulty: 'easy' as const,
        estimatedCost: 2000
      }
    ];

    return { opportunities };
  }

  /**
   * Monatlichen Local SEO Report generieren
   */
  generateMonthlySEOReport(locationId: string): {
    period: string;
    rankings: Array<{
      keyword: string;
      position: number;
      previousPosition: number;
      change: number;
      searchVolume: number;
    }>;
    citations: {
      total: number;
      claimed: number;
      consistent: number;
      new: number;
    };
    reviews: {
      total: number;
      averageRating: number;
      newThisMonth: number;
      responded: number;
    };
    insights: string[];
    recommendations: string[];
  } {
    const location = this.locations.get(locationId);
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }

    // Simuliere Ranking-Daten
    const rankings = [
      {
        keyword: `photovoltaik ${location.address.city.toLowerCase()}`,
        position: 3,
        previousPosition: 4,
        change: 1,
        searchVolume: 480
      },
      {
        keyword: `solaranlage ${location.address.city.toLowerCase()}`,
        position: 2,
        previousPosition: 3,
        change: 1,
        searchVolume: 390
      },
      {
        keyword: `solaranbieter ${location.address.city.toLowerCase()}`,
        position: 5,
        previousPosition: 6,
        change: 1,
        searchVolume: 210
      }
    ];

    return {
      period: 'Januar 2025',
      rankings,
      citations: {
        total: 48,
        claimed: 42,
        consistent: 40,
        new: 3
      },
      reviews: {
        total: 127,
        averageRating: 4.8,
        newThisMonth: 8,
        responded: 7
      },
      insights: [
        'Verbesserung bei lokalen Suchbegriffen um 2 Positionen im Durchschnitt',
        'Neue Citations in wichtigen Branchenverzeichnissen',
        'Positive Entwicklung bei Online-Bewertungen',
        'Erhöhte Click-Through-Rate bei lokalen Suchen'
      ],
      recommendations: [
        'Bewertungsrate durch gezielte Kundenansprache weiter erhöhen',
        'Fehlende Citations in Nischen-Verzeichnissen nachholen',
        'Lokale Content-Marketing-Kampagne starten',
        'Kooperationen mit lokalen Partnern ausbauen'
      ]
    };
  }

  /**
   * Alle Standorte abrufen
   */
  getAllLocations(): LocalBusinessLocation[] {
    return Array.from(this.locations.values());
  }

  /**
   * Local Citations abrufen
   */
  getLocalCitations(): LocalCitation[] {
    return [...this.localCitations];
  }

  /**
   * Standort-spezifische Landingpage URL generieren
   */
  generateLocationLandingPageUrl(locationId: string): string {
    const location = this.locations.get(locationId);
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }

    const citySlug = location.address.city.toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/\s+/g, '-');

    return `${this.baseUrl}/photovoltaik-${citySlug}`;
  }
}

// Singleton-Instanz exportieren
export const localSEOService = new LocalSEOService();

// Global für einfachen Zugriff
if (typeof window !== 'undefined') {
  window.localSEO = localSEOService;
}

export default localSEOService;

// Types für globale Erweiterung
declare global {
  interface Window {
    localSEO: typeof localSEOService;
  }
}