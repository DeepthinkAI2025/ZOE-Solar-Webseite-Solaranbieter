import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { GMBReview, GMBQuestion, GMBPostAnalytics, GMBCompetitor, GMBReport } from './gmbTypes';

export interface GMBProfile {
  placeId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  website: string;
  latitude: number;
  longitude: number;
  categories: string[];
  description: string;
  hours: GMBOpeningHours;
  attributes: GMBAttribute[];
  photos: GMBPhoto[];
  reviews: GMBReview[];
  lastUpdated: string;
}

export interface GMBOpeningHours {
  monday: { open: string; close: string } | null;
  tuesday: { open: string; close: string } | null;
  wednesday: { open: string; close: string } | null;
  thursday: { open: string; close: string } | null;
  friday: { open: string; close: string } | null;
  saturday: { open: string; close: string } | null;
  sunday: { open: string; close: string } | null;
}

export interface GMBAttribute {
  attributeId: string;
  name: string;
  value: string | boolean;
  category: 'service' | 'amenity' | 'accessibility' | 'payment' | 'sustainability';
}

export interface GMBPhoto {
  id: string;
  url: string;
  category: 'logo' | 'cover' | 'exterior' | 'interior' | 'product' | 'team' | 'installation';
  title: string;
  altText: string;
  uploadDate: string;
}

export interface GMBPost {
  id: string;
  type: 'update' | 'event' | 'offer' | 'product';
  title: string;
  content: string;
  mediaUrls?: string[];
  actionType?: 'book' | 'order' | 'shop' | 'learn_more' | 'sign_up';
  actionUrl?: string;
  startDate?: string;
  endDate?: string;
  scheduledPublishTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'expired';
  location: string;
  keywords: string[];
}

export interface GMBInsights {
  locationId: string;
  period: { startDate: string; endDate: string };
  metrics: {
    views: { search: number; maps: number; total: number };
    actions: { website: number; direction: number; phone: number; total: number };
    queries: Array<{ query: string; impressions: number; position: number }>;
    photos: { viewsOwner: number; viewsCustomer: number; total: number };
  };
}

/**
 * Google My Business Optimization Service
 * Automatisiert GMB-Profile Verwaltung, Post-Scheduling und Review-Management
 */
export class GMBOptimizationService {
  private profiles: Map<string, GMBProfile> = new Map();
  private posts: Map<string, GMBPost[]> = new Map();

  constructor() {
    this.initializeProfiles();
  }

  /**
   * Initialisiert GMB-Profile für alle Service-Regionen
   */
  private initializeProfiles(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const profile = this.createGMBProfile(region);
      this.profiles.set(region.city.toLowerCase(), profile);
      this.posts.set(region.city.toLowerCase(), []);
    });
  }

  /**
   * Erstellt ein optimiertes GMB-Profil für eine Service-Region
   */
  private createGMBProfile(region: ServiceRegion): GMBProfile {
    const baseAttributes: GMBAttribute[] = [
      { attributeId: 'has_wheelchair_accessible_entrance', name: 'Rollstuhlgerechter Eingang', value: true, category: 'accessibility' },
      { attributeId: 'accepts_credit_cards', name: 'Kreditkarten akzeptiert', value: true, category: 'payment' },
      { attributeId: 'accepts_debit_cards', name: 'EC-Karten akzeptiert', value: true, category: 'payment' },
      { attributeId: 'free_wifi', name: 'Kostenloses WLAN', value: true, category: 'amenity' },
      { attributeId: 'on_site_services', name: 'Service vor Ort', value: true, category: 'service' },
      { attributeId: 'online_appointments', name: 'Online-Terminbuchung', value: true, category: 'service' },
      { attributeId: 'sustainable_business', name: 'Nachhaltiges Unternehmen', value: true, category: 'sustainability' },
    ];

    return {
      placeId: `gmb_${region.city.toLowerCase()}_${Date.now()}`,
      name: `ZOE Solar ${region.city}`,
      address: `Musterstraße 123, ${region.postalCode} ${region.city}`,
      city: region.city,
      state: region.state,
      postalCode: region.postalCode,
      phone: '+49-30-123-456-78',
      website: `https://www.zoe-solar.de/standort/${region.city.toLowerCase()}`,
      latitude: region.latitude,
      longitude: region.longitude,
      categories: [
        'Solaranbieter',
        'Photovoltaik-Installation',
        'Erneuerbare Energien',
        'Energieberatung',
        'Solartechnik',
        'Batteriespeicher',
        'E-Mobilität Ladeinfrastruktur'
      ],
      description: this.generateOptimizedDescription(region),
      hours: this.getStandardOpeningHours(),
      attributes: baseAttributes,
      photos: this.generatePhotoPlaceholders(region),
      reviews: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Generiert eine SEO-optimierte GMB-Beschreibung
   */
  private generateOptimizedDescription(region: ServiceRegion): string {
    return `ZOE Solar ist Ihr regionaler Photovoltaik-Spezialist in ${region.city} und ${region.state}. Wir planen, installieren und betreuen Solaranlagen für Gewerbe, Landwirtschaft und Eigenheime im Umkreis von ${region.radiusKm} km. Mit über 500 erfolgreichen Projekten seit 2018 bieten wir Ihnen schlüsselfertige PV-Lösungen inklusive Batteriespeicher, E-Ladeinfrastruktur und Monitoring. Kostenlose Erstberatung vor Ort. Zertifiziert und TÜV-geprüft.`;
  }

  /**
   * Standard-Öffnungszeiten für alle Standorte
   */
  private getStandardOpeningHours(): GMBOpeningHours {
    const businessHours = { open: '08:00', close: '17:00' };
    return {
      monday: businessHours,
      tuesday: businessHours,
      wednesday: businessHours,
      thursday: businessHours,
      friday: businessHours,
      saturday: null,
      sunday: null
    };
  }

  /**
   * Generiert Foto-Platzhalter für GMB-Profile
   */
  private generatePhotoPlaceholders(region: ServiceRegion): GMBPhoto[] {
    const baseUrl = 'https://images.pexels.com/photos';
    return [
      {
        id: `logo_${region.city.toLowerCase()}`,
        url: `${baseUrl}/9875451/pexels-photo-9875451.jpeg`,
        category: 'logo',
        title: `ZOE Solar ${region.city} Logo`,
        altText: `ZOE Solar Firmenlogo für ${region.city}`,
        uploadDate: new Date().toISOString()
      },
      {
        id: `cover_${region.city.toLowerCase()}`,
        url: `${baseUrl}/9875453/pexels-photo-9875453.jpeg`,
        category: 'cover',
        title: `Photovoltaikanlage in ${region.city}`,
        altText: `Moderne Solaranlage auf Gewerbedach in ${region.city}`,
        uploadDate: new Date().toISOString()
      },
      {
        id: `team_${region.city.toLowerCase()}`,
        url: `${baseUrl}/8853502/pexels-photo-8853502.jpeg`,
        category: 'team',
        title: `ZOE Solar Team ${region.city}`,
        altText: `Professionelles Installationsteam von ZOE Solar in ${region.city}`,
        uploadDate: new Date().toISOString()
      },
      {
        id: `installation_${region.city.toLowerCase()}`,
        url: `${baseUrl}/9875449/pexels-photo-9875449.jpeg`,
        category: 'installation',
        title: `PV-Installation ${region.city}`,
        altText: `Professionelle Photovoltaik-Installation in ${region.city}`,
        uploadDate: new Date().toISOString()
      }
    ];
  }

  /**
   * Erstellt einen lokalen GMB-Post mit regionalen Keywords
   */
  public createLocalPost(
    locationKey: string,
    type: GMBPost['type'],
    title: string,
    content: string,
    options: Partial<GMBPost> = {}
  ): GMBPost {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    if (!region) {
      throw new Error(`Region ${locationKey} nicht gefunden`);
    }

    const localKeywords = [
      `Solaranlagen ${region.city}`,
      `Photovoltaik ${region.city}`,
      `PV ${region.state}`,
      `Solar ${region.city}`,
      `Energiewende ${region.city}`
    ];

    const post: GMBPost = {
      id: `post_${locationKey}_${Date.now()}`,
      type,
      title,
      content: this.optimizeContentWithLocalKeywords(content, region),
      scheduledPublishTime: options.scheduledPublishTime || new Date().toISOString(),
      status: options.status || 'draft',
      location: region.city,
      keywords: [...localKeywords, ...(options.keywords || [])],
      ...options
    };

    const locationPosts = this.posts.get(locationKey.toLowerCase()) || [];
    locationPosts.push(post);
    this.posts.set(locationKey.toLowerCase(), locationPosts);

    return post;
  }

  /**
   * Optimiert Post-Content mit lokalen Keywords
   */
  private optimizeContentWithLocalKeywords(content: string, region: ServiceRegion): string {
    const localTerms = [
      { placeholder: '{CITY}', value: region.city },
      { placeholder: '{STATE}', value: region.state },
      { placeholder: '{REGION}', value: `${region.city} und ${region.state}` },
      { placeholder: '{RADIUS}', value: `${region.radiusKm} km` }
    ];

    let optimizedContent = content;
    localTerms.forEach(term => {
      optimizedContent = optimizedContent.replace(new RegExp(term.placeholder, 'g'), term.value);
    });

    return optimizedContent;
  }

  /**
   * Generiert automatische Posts für verschiedene Anlässe
   */
  public generateAutomatedPosts(locationKey: string): GMBPost[] {
    const posts: GMBPost[] = [];
    const today = new Date();

    // Wöchentlicher Tipp-Post
    posts.push(this.createLocalPost(locationKey, 'update',
      'Expertentipp: Solaranlage winterfest machen',
      'Mit der kalten Jahreszeit sollten Sie Ihre Solaranlage in {CITY} winterfest machen. Unser Service-Team überprüft kostenlos Verkabelung, Wechselrichter und Monitoring-System. Jetzt Termin vereinbaren! ☀️❄️ #Photovoltaik{CITY} #Winterservice',
      {
        actionType: 'book',
        actionUrl: `https://www.zoe-solar.de/kontakt?region=${locationKey}`,
        keywords: [`Solarservice ${locationKey}`, 'Photovoltaik Wartung', 'Wintercheck Solar']
      }
    ));

    // Förderangebot-Post
    posts.push(this.createLocalPost(locationKey, 'offer',
      'Neue Förderungen für Solaranlagen in {REGION}',
      'Jetzt von aktuellen Förderungen profitieren! Bis zu 40% Zuschuss für Photovoltaik + Speicher in {CITY}. Kostenlose Fördermittelberatung inklusive. Unverbindlich anfragen! 💰⚡️',
      {
        actionType: 'learn_more',
        actionUrl: `https://www.zoe-solar.de/foerdermittel/check?region=${locationKey}`,
        endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        keywords: [`Solarförderung ${locationKey}`, 'PV Zuschuss', 'Förderberatung']
      }
    ));

    // Referenzprojekt-Post
    posts.push(this.createLocalPost(locationKey, 'update',
      'Erfolgsprojekt: 500 kWp Anlage in {CITY} realisiert',
      'Stolz präsentieren wir unser neuestes Projekt in {CITY}: 500 kWp Photovoltaikanlage auf Logistikzentrum. 650.000 kWh Jahresertrag, 480 t CO₂-Einsparung. Ihr Projekt ist das nächste! 🏗️☀️',
      {
        actionType: 'learn_more',
        actionUrl: `https://www.zoe-solar.de/projekte?region=${locationKey}`,
        keywords: [`Referenzen ${locationKey}`, 'Gewerbe PV', 'Logistik Solar']
      }
    ));

    return posts;
  }

  /**
   * Q&A Management für GMB-Profile
   */
  public generateLocalFAQs(locationKey: string): Array<{question: string; answer: string}> {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    if (!region) return [];

    return [
      {
        question: `Wie lange dauert die Installation einer Solaranlage in ${region.city}?`,
        answer: `Die Installation einer Photovoltaikanlage in ${region.city} dauert in der Regel 1-2 Tage, abhängig von der Anlagengröße. Bei Gewerbeanlagen können es 3-5 Tage sein. Wir koordinieren alle Schritte von der Anmeldung bis zur Inbetriebnahme für Sie.`
      },
      {
        question: `Welche Förderungen gibt es für Solaranlagen in ${region.state}?`,
        answer: `In ${region.state} können Sie von verschiedenen Förderprogrammen profitieren: KfW-Kredite mit günstigen Zinsen, regionale Zuschüsse und die Einspeisevergütung. Unser Team berät Sie kostenlos zu allen verfügbaren Förderungen in ${region.city}.`
      },
      {
        question: `Bieten Sie auch Service und Wartung für bestehende Anlagen in ${region.city}?`,
        answer: `Ja, wir bieten umfassenden Service für alle Photovoltaikanlagen in ${region.city} und Umgebung. Unser Service umfasst: Wartung, Reparaturen, Monitoring, Versicherungsabwicklung und Performance-Optimierung. 24/7 Störungsdienst inklusive.`
      },
      {
        question: `Ist mein Dach in ${region.city} für eine Solaranlage geeignet?`,
        answer: `Die meisten Dächer in ${region.city} sind für Photovoltaik geeignet. Wichtig sind: Ausrichtung (ideal: Süd), Neigung (optimal: 30-45°), keine starke Verschattung und ausreichende Statik. Unsere kostenlose Dachanalyse gibt Ihnen Klarheit.`
      },
      {
        question: `Welche Garantien bieten Sie für Solaranlagen in ${region.city}?`,
        answer: `Wir bieten umfassende Garantien: 12 Jahre Produktgarantie auf Module, 10 Jahre auf Wechselrichter, 25 Jahre Leistungsgarantie und 5 Jahre Installationsgarantie. Zusätzlich vermitteln wir Versicherungsschutz für Ihre Anlage in ${region.city}.`
      }
    ];
  }

  /**
   * Review-Management Funktionen
   */
  public generateReviewResponse(review: GMBReview, locationKey: string): string {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    const cityName = region?.city || locationKey;

    if (review.rating >= 4) {
      const positiveResponses = [
        `Vielen Dank für Ihre positive Bewertung! Es freut uns sehr, dass Sie mit unserer Photovoltaik-Lösung in ${cityName} zufrieden sind. Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Ihr ZOE Solar Team ${cityName}`,
        `Herzlichen Dank für das Vertrauen und die Weiterempfehlung! Wir sind stolz, dass wir Ihre Erwartungen in ${cityName} erfüllen konnten. Für zukünftige Anliegen sind wir da. Sonnige Grüße, ZOE Solar ${cityName}`,
        `Vielen Dank für Ihre tolle Bewertung! Es ist schön zu hören, dass Sie mit unserem Service in ${cityName} zufrieden sind. Wir freuen uns auf weitere gemeinsame Projekte. Ihr ZOE Solar Team`
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    } else {
      return `Vielen Dank für Ihr Feedback. Es tut uns leid, dass wir Ihre Erwartungen in ${cityName} nicht vollständig erfüllen konnten. Wir möchten das gerne mit Ihnen besprechen und eine Lösung finden. Bitte kontaktieren Sie uns direkt unter +49-30-123-456-78. Ihr ZOE Solar Team ${cityName}`;
    }
  }

  /**
   * Lokale Keyword-Optimierung für GMB-Profile
   */
  public optimizeLocalKeywords(locationKey: string): string[] {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    if (!region) return [];

    const primaryKeywords = [
      `Solaranlagen ${region.city}`,
      `Photovoltaik ${region.city}`,
      `PV ${region.city}`,
      `Solar ${region.state}`,
      `Solaranbieter ${region.city}`
    ];

    const secondaryKeywords = [
      `Photovoltaik Installation ${region.city}`,
      `Solaranlage ${region.city} Kosten`,
      `PV Anlage ${region.city}`,
      `Solardach ${region.city}`,
      `Energiespeicher ${region.city}`,
      `Wallbox ${region.city}`,
      `Agri PV ${region.state}`,
      `Gewerbe Photovoltaik ${region.city}`,
      `Solarpark ${region.state}`,
      `Photovoltaik Förderung ${region.state}`
    ];

    const longTailKeywords = [
      `beste Solaranlage ${region.city}`,
      `Photovoltaik Beratung ${region.city}`,
      `Solaranlage kaufen ${region.city}`,
      `PV Anlage mieten ${region.city}`,
      `Solarteur ${region.city}`,
      `Photovoltaik Experte ${region.city}`,
      `Solarstrom ${region.city}`,
      `nachhaltige Energie ${region.city}`
    ];

    return [...primaryKeywords, ...secondaryKeywords, ...longTailKeywords];
  }

  /**
   * Bulk-Updates für NAP-Konsistenz
   */
  public bulkUpdateNAPConsistency(updates: Array<{ locationKey: string; field: 'name' | 'address' | 'phone'; value: string }>): void {
    updates.forEach(update => {
      const profile = this.profiles.get(update.locationKey.toLowerCase());
      if (profile) {
        switch (update.field) {
          case 'name':
            profile.name = update.value;
            break;
          case 'address':
            profile.address = update.value;
            break;
          case 'phone':
            profile.phone = update.value;
            break;
        }
        profile.lastUpdated = new Date().toISOString();
      }
    });
  }

  /**
   * Attribut-Management für Profile
   */
  public updateProfileAttributes(locationKey: string, attributes: GMBAttribute[]): void {
    const profile = this.profiles.get(locationKey.toLowerCase());
    if (profile) {
      profile.attributes = attributes;
      profile.lastUpdated = new Date().toISOString();
    }
  }

  /**
   * Photo-Management für Profile
   */
  public updateProfilePhotos(locationKey: string, photos: GMBPhoto[]): void {
    const profile = this.profiles.get(locationKey.toLowerCase());
    if (profile) {
      profile.photos = photos;
      profile.lastUpdated = new Date().toISOString();
    }
  }

  /**
   * Content Calendar Management
   */
  public generateSeasonalContentCalendar(locationKey: string): GMBPost[] {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    if (!region) return [];

    const posts: GMBPost[] = [];
    const now = new Date();

    // Monatliche Posts für verschiedene Saisons
    const seasonalContent = [
      { month: 0, title: 'Neujahr: Solarziele für 2025', content: 'Starten Sie das neue Jahr mit sauberer Energie! {CITY} geht voran mit Photovoltaik. Kostenlose Beratung für Ihr Solarprojekt. ☀️🎉' },
      { month: 1, title: 'Winter-Solar-Check in {CITY}', content: 'Bei Schnee und Eis: Sorgen Sie für optimale Solarleistung. Unser Winterservice prüft Ihre Anlage kostenlos. ❄️☀️' },
      { month: 2, title: 'Frühlings-Solar-Aktion', content: 'Frühlingserwachen mit Solarenergie! Jetzt 20% Rabatt auf neue PV-Anlagen in {CITY}. Begrenztes Angebot! 🌸☀️' },
      { month: 3, title: 'Oster-Solar-Special', content: 'Ostern mit neuer Energie! Photovoltaik + Speicher zu Ostern günstiger. Ihr Weg zur Unabhängigkeit beginnt hier. 🥚⚡' },
      { month: 4, title: 'Mai: Solar für Gewerbe', content: 'Tag der Arbeit: Investieren Sie in nachhaltige Energie. Gewerbe-Photovoltaik mit Förderungen bis zu 40%. 💼☀️' },
      { month: 5, title: 'Sommer-Solar-Installation', content: 'Sommerzeit ist Solarzeit! Schnelle Installation Ihrer PV-Anlage in {CITY}. Profitieren Sie vom Sonnenschein! ☀️🏖️' },
      { month: 6, title: 'Sommer-Energie-Sparen', content: 'Kühlen Sie smart: Solar + Klimaanlage = geringe Stromkosten. Beratung für Ihr Energiesystem. 🏊‍♂️⚡' },
      { month: 7, title: 'Urlaub mit Solar-Monitoring', content: 'Im Urlaub entspannt: Unsere Solaranlagen überwachen sich selbst. Sorgenfreie Energieproduktion! ✈️☀️' },
      { month: 8, title: 'Schulstart mit Solar', content: 'Neues Schuljahr, neue Energie! Bildungseinrichtungen in {CITY} setzen auf Photovoltaik. Ihr Projekt ist das nächste! 📚☀️' },
      { month: 9, title: 'Herbst-Solar-Ernte', content: 'Ernten Sie Sonnenenergie! Herbst ist die beste Zeit für PV-Installation. Jetzt beraten lassen! 🍂☀️' },
      { month: 10, title: 'Wintervorbereitung mit Solar', content: 'Heizen mit Solar: Thermische Solaranlagen für Warmwasser. Energiesparen im Winter! 🔥☀️' },
      { month: 11, title: 'Weihnachts-Solar-Geschenke', content: 'Das schönste Geschenk: Unabhängigkeit durch Solarenergie. Frohe Weihnachten mit sauberer Energie! 🎄⚡' }
    ];

    seasonalContent.forEach((content, index) => {
      const postDate = new Date(now.getFullYear(), content.month, 15);
      if (postDate > now) {
        posts.push(this.createLocalPost(locationKey, 'update', content.title,
          this.optimizeContentWithLocalKeywords(content.content, region),
          {
            scheduledPublishTime: postDate.toISOString(),
            status: 'scheduled',
            keywords: [`Solar ${region.city}`, 'Photovoltaik', 'Erneuerbare Energien']
          }
        ));
      }
    });

    return posts;
  }

  /**
   * Event- und Promotion-Posting
   */
  public createEventPost(locationKey: string, eventData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location?: string;
  }): GMBPost {
    return this.createLocalPost(locationKey, 'event', eventData.title,
      `${eventData.description}\n\n📅 ${new Date(eventData.startDate).toLocaleDateString('de-DE')} - ${new Date(eventData.endDate).toLocaleDateString('de-DE')}\n📍 ${eventData.location || 'ZOE Solar Standort'}\n\nJetzt anmelden!`,
      {
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        actionType: 'learn_more',
        actionUrl: `https://www.zoe-solar.de/standort/${locationKey}/events`,
        keywords: [`Event ${locationKey}`, 'Solar Event', 'Photovoltaik Veranstaltung']
      }
    );
  }

  /**
   * Performance-Tracking für Posts
   */
  public trackPostPerformance(postId: string): GMBPostAnalytics {
    // Simulierte Analytics-Daten
    return {
      postId,
      views: Math.floor(Math.random() * 500) + 100,
      clicks: Math.floor(Math.random() * 50) + 10,
      engagement: Math.floor(Math.random() * 20) + 5,
      reach: Math.floor(Math.random() * 800) + 200,
      period: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }
    };
  }

  /**
   * Review-Management mit AI
   */
  public analyzeReviewSentiment(review: GMBReview): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['gut', 'super', 'toll', 'zufrieden', 'empfehle', 'professionell', 'schnell', 'kompetent'];
    const negativeWords = ['schlecht', 'enttäuscht', 'langsam', 'teuer', 'unzufrieden', 'probleme', 'warten'];

    const text = review.comment.toLowerCase();
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => word.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  public generateAIReviewResponse(review: GMBReview, locationKey: string): string {
    const sentiment = this.analyzeReviewSentiment(review);
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    const cityName = region?.city || locationKey;

    const templates = {
      positive: [
        `Vielen Dank für Ihre positive Bewertung! Wir freuen uns sehr, dass Sie mit unserer Photovoltaik-Lösung in ${cityName} zufrieden sind. Bei weiteren Fragen stehen wir Ihnen gerne zur Verfügung. Ihr ZOE Solar Team ${cityName}`,
        `Herzlichen Dank für das Vertrauen und die Weiterempfehlung! Es ist schön zu hören, dass wir Ihre Erwartungen in ${cityName} erfüllen konnten. Wir freuen uns auf weitere gemeinsame Projekte. Sonnige Grüße, ZOE Solar ${cityName}`
      ],
      neutral: [
        `Vielen Dank für Ihre Bewertung und das Feedback zu unserem Service in ${cityName}. Wir schätzen Ihre ehrliche Meinung und arbeiten kontinuierlich an der Verbesserung unserer Dienstleistungen. Bei Fragen sind wir für Sie da. Ihr ZOE Solar Team ${cityName}`,
        `Danke für Ihre Bewertung! Wir nehmen jedes Feedback ernst und nutzen es, um unseren Service in ${cityName} weiter zu optimieren. Gerne besprechen wir Ihre Erfahrungen persönlich mit Ihnen. Ihr ZOE Solar Team ${cityName}`
      ],
      negative: [
        `Vielen Dank für Ihr Feedback. Es tut uns leid, dass wir Ihre Erwartungen in ${cityName} nicht vollständig erfüllen konnten. Wir möchten das gerne mit Ihnen persönlich besprechen und eine Lösung finden. Bitte kontaktieren Sie uns direkt unter +49-30-123-456-78. Ihr ZOE Solar Team ${cityName}`,
        `Danke für Ihre Bewertung. Wir bedauern, dass Sie nicht zufrieden waren. Ihre Meinung ist uns wichtig - bitte lassen Sie uns das Gespräch suchen, um das Problem zu lösen. Kontaktieren Sie uns gerne. Ihr ZOE Solar Team ${cityName}`
      ]
    };

    const responses = templates[sentiment];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Q&A Management mit AI
   */
  public generateAIQuestionResponse(question: GMBQuestion, locationKey: string): string {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    const cityName = region?.city || locationKey;

    // FAQ-Datenbank Integration (vereinfacht)
    const faqResponses: { [key: string]: string } = {
      'kosten': `Die Kosten für eine Photovoltaikanlage in ${cityName} variieren je nach Größe und Ausstattung. Eine typische 10 kWp Anlage kostet zwischen 15.000-25.000€. Wir bieten eine kostenlose Erstberatung mit genauer Kalkulation.`,
      'förderung': `In ${region?.state} gibt es verschiedene Förderungen: KfW-Kredite mit günstigen Zinsen, regionale Zuschüsse und die Einspeisevergütung. Wir beraten Sie kostenlos zu allen verfügbaren Förderungen.`,
      'installation': `Die Installation dauert in der Regel 1-2 Tage für Einfamilienhäuser, bei Gewerbeanlagen bis zu 5 Tage. Wir koordinieren alle Schritte von der Anmeldung bis zur Inbetriebnahme.`,
      'wartung': `Wir bieten umfassenden Service: Wartung, Reparaturen, Monitoring und Performance-Optimierung. 24/7 Störungsdienst und jährliche Wartungsverträge verfügbar.`,
      'garantie': `Wir bieten 12 Jahre Produktgarantie auf Module, 10 Jahre auf Wechselrichter, 25 Jahre Leistungsgarantie und 5 Jahre Installationsgarantie. Zusätzlich vermitteln wir Versicherungsschutz.`
    };

    const questionText = question.question.toLowerCase();
    for (const [key, response] of Object.entries(faqResponses)) {
      if (questionText.includes(key)) {
        return response;
      }
    }

    // Fallback-Antwort
    return `Vielen Dank für Ihre Frage zu unseren Dienstleistungen in ${cityName}. Wir beantworten Ihre Anfrage gerne persönlich. Bitte kontaktieren Sie uns unter +49-30-123-456-78 oder besuchen Sie unsere Website für weitere Informationen. Ihr ZOE Solar Team ${cityName}`;
  }

  /**
   * Competitor Analysis
   */
  public analyzeCompetitors(locationKey: string): GMBCompetitor[] {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    if (!region) return [];

    // Simulierte Konkurrenzdaten
    const competitors: GMBCompetitor[] = [
      {
        name: `SolarTech ${region.city}`,
        placeId: `competitor_1_${locationKey}`,
        rating: 4.2,
        reviewCount: 87,
        position: 2,
        keywords: [`Solaranlagen ${region.city}`, `PV ${region.city}`]
      },
      {
        name: `GreenEnergy ${region.state}`,
        placeId: `competitor_2_${locationKey}`,
        rating: 4.5,
        reviewCount: 156,
        position: 3,
        keywords: [`Photovoltaik ${region.city}`, `Erneuerbare Energien ${region.state}`]
      },
      {
        name: `SunPower ${region.city}`,
        placeId: `competitor_3_${locationKey}`,
        rating: 3.8,
        reviewCount: 43,
        position: 4,
        keywords: [`Solar ${region.city}`, `Photovoltaik Installation`]
      }
    ];

    return competitors;
  }

  /**
   * Automated Reports
   */
  public generateWeeklyReport(locationKey: string): GMBReport {
    const insights = this.generatePerformanceMetrics(locationKey);
    const competitors = this.analyzeCompetitors(locationKey);
    const posts = this.getPostsForLocation(locationKey);

    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date();

    return {
      locationId: locationKey,
      period: {
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0]
      },
      summary: {
        totalViews: insights.metrics.views.search + insights.metrics.views.maps,
        totalActions: insights.metrics.actions.website + insights.metrics.actions.direction + insights.metrics.actions.phone,
        averageRating: 4.3, // Simuliert
        totalReviews: 12, // Simuliert
        topKeywords: insights.metrics.queries.map(q => ({
          keyword: q.query,
          impressions: q.impressions,
          position: q.position
        }))
      },
      insights: [
        `Wöchentliche Aufrufe: ${insights.metrics.views.search + insights.metrics.views.maps}`,
        `Neue Bewertungen: 3 positive, 1 neutral`,
        `Post-Performance: ${posts.filter(p => p.status === 'published').length} Posts veröffentlicht`,
        `Konkurrenz-Position: ${competitors.length > 0 ? `Besser als ${competitors.filter(c => c.position > 1).length} Konkurrenten` : 'Keine direkten Konkurrenten'}`
      ],
      recommendations: [
        'Erhöhen Sie die Post-Frequenz um 20% für bessere Sichtbarkeit',
        'Antworten Sie innerhalb von 24 Stunden auf neue Bewertungen',
        'Aktualisieren Sie Fotos monatlich für höhere Klickraten',
        'Nutzen Sie saisonale Keywords für bessere lokale Suchergebnisse'
      ]
    };
  }

  /**
   * Abrufen aller Profile
   */
  public getAllProfiles(): Map<string, GMBProfile> {
    return this.profiles;
  }

  /**
   * Abrufen von Posts für einen Standort
   */
  public getPostsForLocation(locationKey: string): GMBPost[] {
    return this.posts.get(locationKey.toLowerCase()) || [];
  }

  /**
   * Profil für eine spezifische Region abrufen
   */
  public getProfileForLocation(locationKey: string): GMBProfile | undefined {
    return this.profiles.get(locationKey.toLowerCase());
  }

  /**
   * Performance-Metriken für GMB-Profile
   */
  public generatePerformanceMetrics(locationKey: string): GMBInsights {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey.toLowerCase());
    const profile = this.getProfileForLocation(locationKey);

    if (!region || !profile) {
      throw new Error(`Region oder Profil für ${locationKey} nicht gefunden`);
    }

    // Simulierte Metriken (in echter Implementierung würden diese von der GMB API kommen)
    return {
      locationId: profile.placeId,
      period: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      metrics: {
        views: {
          search: Math.floor(Math.random() * 1000) + 500,
          maps: Math.floor(Math.random() * 800) + 300,
          total: 0 // wird berechnet
        },
        actions: {
          website: Math.floor(Math.random() * 100) + 50,
          direction: Math.floor(Math.random() * 80) + 40,
          phone: Math.floor(Math.random() * 60) + 30,
          total: 0 // wird berechnet
        },
        queries: [
          { query: `solaranlagen ${region.city.toLowerCase()}`, impressions: Math.floor(Math.random() * 200) + 100, position: 1.2 },
          { query: `photovoltaik ${region.city.toLowerCase()}`, impressions: Math.floor(Math.random() * 150) + 80, position: 1.5 },
          { query: `pv ${region.city.toLowerCase()}`, impressions: Math.floor(Math.random() * 100) + 60, position: 2.1 },
          { query: `solar ${region.state.toLowerCase()}`, impressions: Math.floor(Math.random() * 80) + 40, position: 2.8 }
        ],
        photos: {
          viewsOwner: Math.floor(Math.random() * 500) + 200,
          viewsCustomer: Math.floor(Math.random() * 300) + 100,
          total: 0 // wird berechnet
        }
      }
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const gmbOptimizationService = new GMBOptimizationService();