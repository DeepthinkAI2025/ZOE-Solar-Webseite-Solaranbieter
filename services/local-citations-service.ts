/**
 * Local Citations Service für ZOE Solar
 *
 * Baut Local Citations in deutschen Branchenverzeichnissen auf
 * Konsistenz über alle Plattformen sicherstellen
 */

export interface Citation {
  id: string;
  platform: string;
  url: string;
  businessName: string;
  address: string;
  phone: string;
  website: string;
  category: string;
  description: string;
  status: 'pending' | 'claimed' | 'verified' | 'optimized';
  lastUpdated: Date;
  priority: 'high' | 'medium' | 'low';
  authorityScore: number;
}

export interface CitationPlatform {
  name: string;
  url: string;
  category: 'general' | 'local' | 'industry' | 'professional' | 'social';
  authority: number;
  cost: 'free' | 'premium' | 'freemium';
  features: string[];
  submissionUrl?: string;
}

export interface CitationCampaign {
  id: string;
  name: string;
  targetPlatforms: string[];
  locations: string[];
  status: 'planning' | 'active' | 'completed';
  startDate: Date;
  endDate?: Date;
  progress: number;
  results: {
    claimed: number;
    verified: number;
    optimized: number;
  };
}

class LocalCitationsService {
  private platforms: Map<string, CitationPlatform> = new Map();
  private citations: Map<string, Citation> = new Map();
  private campaigns: Map<string, CitationCampaign> = new Map();
  private consistencyChecker: Map<string, any> = new Map();

  /**
   * Initialisiert den Local Citations Service
   */
  async initialize(): Promise<void> {
    console.log('📍 Initialisiere Local Citations Service...');

    // Deutsche Business-Verzeichnisse definieren
    await this.defineGermanPlatforms();

    // Citation-Strategie aufbauen
    await this.buildCitationStrategy();

    // Consistency Checker einrichten
    await this.setupConsistencyChecker();

    // Citations analysieren und optimieren
    await this.analyzeExistingCitations();

    console.log('✅ Local Citations Service bereit');
  }

  /**
   * Deutsche Business-Verzeichnisse definieren
   */
  private async defineGermanPlatforms(): Promise<void> {
    console.log('📚 Definiere deutsche Business-Verzeichnisse...');

    const germanPlatforms: CitationPlatform[] = [
      // General Local Business Directories (High Authority)
      {
        name: 'Gelbe Seiten',
        url: 'https://www.gelbeseiten.de',
        category: 'local',
        authority: 95,
        cost: 'premium',
        features: ['Detailed business info', 'Reviews', 'Photos', 'Videos', 'Events'],
        submissionUrl: 'https://www.gelbeseiten.de/eintrag-erstellen'
      },
      {
        name: 'Das Örtliche',
        url: 'https://www.dasoertliche.de',
        category: 'local',
        authority: 90,
        cost: 'premium',
        features: ['Business listing', 'Reviews', 'Photos', 'Videos'],
        submissionUrl: 'https://www.dasoertliche.de/eintrag-erstellen'
      },
      {
        name: '11880.com',
        url: 'https://www.11880.com',
        category: 'local',
        authority: 85,
        cost: 'freemium',
        features: ['Basic listing', 'Reviews', 'Premium upgrade available'],
        submissionUrl: 'https://www.11880.com/eintrag-erstellen'
      },
      {
        name: 'GoYellow',
        url: 'https://www.11880.goyellow.de',
        category: 'local',
        authority: 80,
        cost: 'freemium',
        features: ['Free basic listing', 'Premium features available'],
        submissionUrl: 'https://www.11880.goyellow.de/eintrag-hinzufuegen'
      },

      // Professional & Business Directories
      {
        name: 'Unternehmensregister',
        url: 'https://www.unternehmensregister.de',
        category: 'professional',
        authority: 90,
        cost: 'free',
        features: ['Legal company information', 'Official registry data'],
        submissionUrl: 'https://www.unternehmensregister.de/ergebnis'
      },
      {
        name: 'Wirtschaftsplattform Deutschland',
        url: 'https://www.wirtschaftsplattform.de',
        category: 'professional',
        authority: 75,
        cost: 'free',
        features: ['Company profile', 'Industry networking'],
        submissionUrl: 'https://www.wirtschaftsplattform.de/registrierung'
      },
      {
        name: 'North Data',
        url: 'https://www.northdata.de',
        category: 'professional',
        authority: 85,
        cost: 'freemium',
        features: ['Company data', 'Financial information'],
        submissionUrl: 'https://www.northdata.de/login'
      },
      {
        name: 'Kompass',
        url: 'https://www.kompass.de',
        category: 'professional',
        authority: 88,
        cost: 'premium',
        features: ['B2B directory', 'Product catalog', 'Company profiles'],
        submissionUrl: 'https://www.kompass.de/firmen-eintragen'
      },

      // Industry-Specific Directories
      {
        name: 'Solarserver',
        url: 'https://www.solarserver.de',
        category: 'industry',
        authority: 92,
        cost: 'freemium',
        features: ['Solar industry directory', 'News portal'],
        submissionUrl: 'https://www.solarserver.de/anbieter-eintragen'
      },
      {
        name: 'Photovoltaik Forum',
        url: 'https://www.photovoltaikforum.com',
        category: 'industry',
        authority: 85,
        cost: 'free',
        features: ['Community', 'Installer directory'],
        submissionUrl: 'https://www.photovoltaikforum.com/anbieter-verzeichnis'
      },
      {
        name: 'Solaranlage-Ratgeber',
        url: 'https://www.solaranlage-ratgeber.de',
        category: 'industry',
        authority: 78,
        cost: 'freemium',
        features: ['Industry guides', 'Installer listings'],
        submissionUrl: 'https://www.solaranlage-ratgeber.de/anbieter-eintragen'
      },
      {
        name: 'Energie-Experten',
        url: 'https://www.energie-experten.org',
        category: 'industry',
        authority: 82,
        cost: 'freemium',
        features: ['Energy expert directory', 'Certification info'],
        submissionUrl: 'https://www.energie-experten.org/anmelden'
      },

      // Regional Directories
      {
        name: 'Berlin.de Unternehmen',
        url: 'https://www.berlin.de/berliner-wirtschaft',
        category: 'local',
        authority: 88,
        cost: 'free',
        features: ['Berlin business registry', 'Local networking'],
        submissionUrl: 'https://www.berlin.de/berliner-wirtschaft/anmeldung'
      },
      {
        name: 'München Wirtschaft',
        url: 'https://www.muenchen.de/wirtschaft',
        category: 'local',
        authority: 85,
        cost: 'free',
        features: ['Munich business directory', 'Economic development'],
        submissionUrl: 'https://www.muenchen.de/wirtschaft/anmeldung'
      },
      {
        name: 'Hamburg Wirtschaft',
        url: 'https://www.hamburg.de/wirtschaft',
        category: 'local',
        authority: 86,
        cost: 'free',
        features: ['Hamburg business registry', 'Maritime industry focus'],
        submissionUrl: 'https://www.hamburg.de/wirtschaft/anmeldung'
      },

      // Social & Review Platforms
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com',
        category: 'social',
        authority: 95,
        cost: 'freemium',
        features: ['Company profile', 'Employee profiles', 'Updates'],
        submissionUrl: 'https://www.linkedin.com/company/create'
      },
      {
        name: 'XING',
        url: 'https://www.xing.com',
        category: 'social',
        authority: 85,
        cost: 'freemium',
        features: ['German business network', 'Company pages'],
        submissionUrl: 'https://www.xing.com/company/create'
      },
      {
        name: 'Kununu',
        url: 'https://www.kununu.com',
        category: 'social',
        authority: 82,
        cost: 'free',
        features: ['Employee reviews', 'Company profile'],
        submissionUrl: 'https://www.kununu.com/de/company/create'
      },
      {
        name: 'Glassdoor',
        url: 'https://www.glassdoor.de',
        category: 'social',
        authority: 88,
        cost: 'free',
        features: ['Company reviews', 'Salary info', 'Benefits'],
        submissionUrl: 'https://www.glassdoor.de/Overview/Working-at-Company-EI_IE123456.11,16.htm'
      },

      // Additional Local Directories
      {
        name: 'Cylex',
        url: 'https://www.cylex.de',
        category: 'local',
        authority: 72,
        cost: 'free',
        features: ['Local directory', 'Reviews'],
        submissionUrl: 'https://www.cylex.de/firmen-eintragen'
      },
      {
        name: 'Branchenbuch-Deutschland',
        url: 'https://www.branchenbuch-deutschland.de',
        category: 'local',
        authority: 68,
        cost: 'free',
        features: ['Business directory', 'Category listings'],
        submissionUrl: 'https://www.branchenbuch-deutschland.de/eintrag-erstellen'
      },
      {
        name: 'YellowMap',
        url: 'https://www.yellowmap.de',
        category: 'local',
        authority: 75,
        cost: 'freemium',
        features: ['B2B directory', 'Route planning'],
        submissionUrl: 'https://www.yellowmap.de/registrierung'
      },
      {
        name: 'Wlw',
        url: 'https://www.wlw.at',
        category: 'professional',
        authority: 80,
        cost: 'freemium',
        features: ['Industrial directory', 'B2B marketplace'],
        submissionUrl: 'https://www.wlw.at/registrierung'
      }
    ];

    germanPlatforms.forEach(platform => {
      this.platforms.set(platform.name, platform);
    });

    console.log(`✅ ${germanPlatforms.length} deutsche Verzeichnisse definiert`);
  }

  /**
   * Citation-Strategie aufbauen
   */
  private async buildCitationStrategy(): Promise<void> {
    console.log('🎯 Baue Citation-Strategie auf...');

    // Priorisierte Plattformen nach Kategorie
    const prioritizedPlatforms = {
      immediate: ['Gelbe Seiten', 'Das Örtliche', 'Unternehmensregister', 'Solarserver'],
      high: ['11880.com', 'Kompass', 'Photovoltaik Forum', 'LinkedIn', 'XING'],
      medium: ['GoYellow', 'North Data', 'Energie-Experten', 'Kununu'],
      low: ['Cylex', 'Branchenbuch-Deutschland', 'YellowMap', 'Wlw']
    };

    // Speichere Priorisierung
    this.consistencyChecker.set('platformPriorities', prioritizedPlatforms);

    console.log('✅ Citation-Strategie aufgebaut');
  }

  /**
   * Consistency Checker einrichten
   */
  private async setupConsistencyChecker(): Promise<void> {
    console.log('🔍 Richte Consistency Checker ein...');

    // Master NAP (Name, Address, Phone) Daten
    const masterNAP = {
      businessName: 'ZOE Solar GmbH',
      alternateNames: ['ZOE Solar', 'ZOE Solar Photovoltaik'],
      locations: {
        berlin: {
          name: 'ZOE Solar Berlin',
          address: 'Alt-Moabit 101, 10559 Berlin',
          phone: '+49 30 12345678',
          website: 'https://zoe-solar.de/standort/berlin'
        },
        muenchen: {
          name: 'ZOE Solar München',
          address: 'Sendlinger Str. 45, 80331 München',
          phone: '+49 89 12345678',
          website: 'https://zoe-solar.de/standort/muenchen'
        },
        hamburg: {
          name: 'ZOE Solar Hamburg',
          address: 'Rathausstraße 1, 20095 Hamburg',
          phone: '+49 40 12345678',
          website: 'https://zoe-solar.de/standort/hamburg'
        }
      }
    };

    // Consistency Rules
    const consistencyRules = {
      name: 'Always use "ZOE Solar GmbH" for legal entities, "ZOE Solar [City]" for locations',
      address: 'Format: Street Number, Postal Code City (German format)',
      phone: 'Always +49 country code, no spaces or hyphens',
      website: 'Use HTTPS, trailing slash optional',
      categories: 'Primary: "Solar Energy Service", Secondary: "Photovoltaik"',
      description: 'Consistent 200-character description for all platforms'
    };

    this.consistencyChecker.set('masterNAP', masterNAP);
    this.consistencyChecker.set('consistencyRules', consistencyRules);

    console.log('✅ Consistency Checker eingerichtet');
  }

  /**
   * Bestehende Citations analysieren
   */
  private async analyzeExistingCitations(): Promise<void> {
    console.log('📊 Analysiere bestehende Citations...');

    const masterNAP = this.consistencyChecker.get('masterNAP');

    // Simulierte bestehende Citations
    const existingCitations: Citation[] = [
      {
        id: 'gelbe-seiten-berlin',
        platform: 'Gelbe Seiten',
        url: 'https://www.gelbeseiten.de/zoe-solar-berlin',
        businessName: 'ZOE Solar Berlin',
        address: 'Alt-Moabit 101, 10559 Berlin',
        phone: '+493012345678',
        website: 'https://zoe-solar.de/standort/berlin',
        category: 'Solar Energy Service',
        description: 'Professionelle Solaranlagen für Unternehmen in Berlin und Umgebung.',
        status: 'claimed',
        lastUpdated: new Date('2025-01-15'),
        priority: 'high',
        authorityScore: 95
      },
      {
        id: 'das-oertliche-muenchen',
        platform: 'Das Örtliche',
        url: 'https://www.dasoertliche.de/zoe-solar-muenchen',
        businessName: 'ZOE Solar München GmbH',
        address: 'Sendlinger Str. 45, 80331 München',
        phone: '+498912345678',
        website: 'https://zoe-solar.de/standort/muenchen',
        category: 'Photovoltaik',
        description: 'Ihr Experte für Solaranlagen in Bayern.',
        status: 'claimed',
        lastUpdated: new Date('2025-01-10'),
        priority: 'high',
        authorityScore: 90
      },
      {
        id: 'linkedin-company',
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/company/zoe-solar',
        businessName: 'ZOE Solar GmbH',
        address: 'Alt-Moabit 101, 10559 Berlin, Germany',
        phone: '+49 30 12345678',
        website: 'https://zoe-solar.de',
        category: 'Renewable Energy',
        description: 'Leading provider of commercial solar energy solutions in Germany.',
        status: 'claimed',
        lastUpdated: new Date('2025-01-20'),
        priority: 'high',
        authorityScore: 95
      }
    ];

    existingCitations.forEach(citation => {
      this.citations.set(citation.id, citation);
    });

    console.log(`✅ ${existingCitations.length} bestehende Citations analysiert`);
  }

  /**
   * Citation-Kampagne erstellen
   */
  createCampaign(name: string, locations: string[], priority: 'high' | 'medium' | 'low' = 'medium'): CitationCampaign {
    const campaign: CitationCampaign = {
      id: `campaign_${Date.now()}`,
      name,
      targetPlatforms: this.selectPlatformsForPriority(priority),
      locations,
      status: 'planning',
      startDate: new Date(),
      progress: 0,
      results: {
        claimed: 0,
        verified: 0,
        optimized: 0
      }
    };

    this.campaigns.set(campaign.id, campaign);
    console.log(`📋 Citation-Kampagne erstellt: ${name}`);

    return campaign;
  }

  /**
   * Plattformen basierend auf Priorität auswählen
   */
  private selectPlatformsForPriority(priority: string): string[] {
    const platformPriorities = this.consistencyChecker.get('platformPriorities');
    if (!platformPriorities) return [];

    switch (priority) {
      case 'high':
        return [...platformPriorities.immediate, ...platformPriorities.high];
      case 'medium':
        return [...platformPriorities.high, ...platformPriorities.medium];
      case 'low':
        return [...platformPriorities.medium, ...platformPriorities.low];
      default:
        return [...platformPriorities.medium];
    }
  }

  /**
   * Citation für spezifische Plattform generieren
   */
  generateCitation(platformName: string, location: string): Citation | null {
    const platform = this.platforms.get(platformName);
    const masterNAP = this.consistencyChecker.get('masterNAP');

    if (!platform || !masterNAP) {
      return null;
    }

    const locationData = masterNAP.locations[location as keyof typeof masterNAP.locations];
    if (!locationData) {
      return null;
    }

    const category = this.getCategoryForPlatform(platform);
    const description = this.getDescriptionForPlatform(platform, location);

    const citation: Citation = {
      id: `${platformName.toLowerCase().replace(/\s+/g, '-')}-${location}`,
      platform: platformName,
      url: `${platform.url}/${this.generatePlatformUrl(platform, location)}`,
      businessName: locationData.name,
      address: locationData.address,
      phone: locationData.phone,
      website: locationData.website,
      category,
      description,
      status: 'pending',
      lastUpdated: new Date(),
      priority: this.getPriorityForPlatform(platform),
      authorityScore: platform.authority
    };

    return citation;
  }

  /**
   * Kategorie für Plattform ermitteln
   */
  private getCategoryForPlatform(platform: CitationPlatform): string {
    const categoryMap: Record<string, string> = {
      'Gelbe Seiten': 'Solar Energy Service',
      'Das Örtliche': 'Photovoltaik',
      '11880.com': 'Solaranlagen',
      'Unternehmensregister': 'Solar Energy',
      'Solarserver': 'Photovoltaik Installer',
      'Photovoltaik Forum': 'Solar Company',
      'LinkedIn': 'Renewable Energy',
      'XING': 'Solaranlagen',
      'Kununu': 'Solar Energy Company'
    };

    return categoryMap[platform.name] || 'Solar Energy Service';
  }

  /**
   * Beschreibung für Plattform generieren
   */
  private getDescriptionForPlatform(platform: CitationPlatform, location: string): string {
    const descriptions = {
      professional: 'ZOE Solar ist führender Anbieter von gewerblichen Photovoltaik-Anlagen in Deutschland. Seit 2015 realisieren wir maßgeschneiderte Solarlösungen für Unternehmen.',
      industry: 'ZOE Solar - Ihr Experte für gewerbliche Photovoltaik. Planung, Installation und Wartung von Solaranlagen für Unternehmen aus einer Hand.',
      local: 'Ihr lokaler Solar-Experte in ' + location.charAt(0).toUpperCase() + location.slice(1) + '. Professionelle Solaranlagen für Unternehmen mit persönlicher Beratung.',
      social: 'ZOE Solar GmbH - Leading Commercial Solar Solutions in Germany. Follow us for solar industry news and updates!',
      general: 'ZOE Solar - Photovoltaik für Unternehmen. Professionelle Beratung, Planung und Installation von Solaranlagen.'
    };

    return descriptions[platform.category] || descriptions.general;
  }

  /**
   * Plattform-spezifische URL generieren
   */
  private generatePlatformUrl(platform: CitationPlatform, location: string): string {
    const urlMap: Record<string, string> = {
      'Gelbe Seiten': `zoe-solar-${location.toLowerCase()}`,
      'Das Örtliche': `zoe-solar-${location.toLowerCase()}`,
      'LinkedIn': 'company/zoe-solar',
      'XING': 'company/zoe-solar',
      'Kununu': 'zoe-solar'
    };

    return urlMap[platform.name] || 'zoe-solar';
  }

  /**
   * Priorität für Plattform ermitteln
   */
  private getPriorityForPlatform(platform: CitationPlatform): 'high' | 'medium' | 'low' {
    if (platform.authority >= 90) return 'high';
    if (platform.authority >= 80) return 'medium';
    return 'low';
  }

  /**
   * Citations auf Konsistenz prüfen
   */
  checkCitationConsistency(citationId: string): {
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const citation = this.citations.get(citationId);
    const masterNAP = this.consistencyChecker.get('masterNAP');
    const consistencyRules = this.consistencyChecker.get('consistencyRules');

    if (!citation || !masterNAP || !consistencyRules) {
      return {
        score: 0,
        issues: ['Citation oder Master-Daten nicht gefunden'],
        recommendations: ['Citation Daten überprüfen']
      };
    }

    const issues = [];
    const recommendations = [];
    let score = 100;

    // Name Consistency Check
    const locationData = Object.values(masterNAP.locations).find(loc =>
      loc.address === citation.address || loc.name === citation.businessName
    );

    if (!locationData) {
      issues.push('Adresse stimmt nicht mit Master-Daten überein');
      recommendations.push('Adresse aktualisieren: ' + citation.address);
      score -= 30;
    }

    // Phone Format Check
    if (!citation.phone.startsWith('+49') || citation.phone.includes(' ') || citation.phone.includes('-')) {
      issues.push('Telefonnummer nicht im korrekten Format (+49XXXXXXXXX)');
      recommendations.push('Telefonnummer formatieren: ' + citation.phone);
      score -= 15;
    }

    // URL Format Check
    if (!citation.website.startsWith('https://')) {
      issues.push('Website nicht mit HTTPS');
      recommendations.push('Website aktualisieren: https://zoe-solar.de');
      score -= 10;
    }

    // Category Check
    const preferredCategories = ['Solar Energy Service', 'Photovoltaik', 'Solaranlagen'];
    if (!preferredCategories.includes(citation.category)) {
      issues.push('Kategorie nicht optimal für Solar-Branch');
      recommendations.push('Kategorie ändern zu: Solar Energy Service');
      score -= 5;
    }

    // Description Length Check
    if (citation.description.length > 200) {
      issues.push('Beschreibung zu lang (>200 Zeichen)');
      recommendations.push('Beschreibung kürzen auf max. 200 Zeichen');
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }

  /**
   * Citations für Standort generieren
   */
  generateCitationsForLocation(location: string): Citation[] {
    const citations: Citation[] = [];
    const prioritizedPlatforms = this.selectPlatformsForPriority('high');

    prioritizedPlatforms.forEach(platformName => {
      const citation = this.generateCitation(platformName, location);
      if (citation) {
        citations.push(citation);
      }
    });

    return citations;
  }

  /**
   * Citation-Kampagne durchführen
   */
  async executeCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Kampagne nicht gefunden: ${campaignId}`);
    }

    console.log(`🚀 Führe Citation-Kampagne durch: ${campaign.name}`);
    campaign.status = 'active';

    const totalCitations = campaign.targetPlatforms.length * campaign.locations.length;
    let completedCitations = 0;

    for (const location of campaign.locations) {
      for (const platformName of campaign.targetPlatforms) {
        const citation = this.generateCitation(platformName, location);
        if (citation) {
          // Simuliert: Citation erstellen/aktualisieren
          citation.status = 'claimed';
          citation.lastUpdated = new Date();
          this.citations.set(`${platformName.toLowerCase()}-${location}`, citation);

          campaign.results.claimed++;
          completedCitations++;
          campaign.progress = Math.round((completedCitations / totalCitations) * 100);

          console.log(`✅ Citation erstellt: ${platformName} - ${location} (${campaign.progress}%)`);

          // Simuliert kleine Verzögerung
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    campaign.status = 'completed';
    campaign.endDate = new Date();

    console.log(`🎉 Citation-Kampagne abgeschlossen: ${campaign.name}`);
  }

  /**
   * Citation-Bericht generieren
   */
  generateCitationReport(): {
    summary: {
      totalCitations: number;
      claimedCitations: number;
      verifiedCitations: number;
      averageAuthorityScore: number;
      consistencyScore: number;
    };
    platforms: Array<{
      name: string;
      citations: number;
      averageScore: number;
      status: string;
    }>;
    locations: Array<{
      location: string;
      citations: number;
      coverage: number;
      issues: string[];
    }>;
    recommendations: string[];
  } {
    const allCitations = Array.from(this.citations.values());
    const claimedCitations = allCitations.filter(c => c.status === 'claimed').length;
    const verifiedCitations = allCitations.filter(c => c.status === 'verified').length;

    // Average Authority Score
    const averageAuthorityScore = allCitations.length > 0
      ? Math.round(allCitations.reduce((sum, c) => sum + c.authorityScore, 0) / allCitations.length)
      : 0;

    // Consistency Score
    const consistencyScores = allCitations.map(c => this.checkCitationConsistency(c.id).score);
    const consistencyScore = consistencyScores.length > 0
      ? Math.round(consistencyScores.reduce((sum, score) => sum + score, 0) / consistencyScores.length)
      : 0;

    // Platform Analysis
    const platformAnalysis = Array.from(this.platforms.values()).map(platform => {
      const platformCitations = allCitations.filter(c => c.platform === platform.name);
      const platformScores = platformCitations.map(c => this.checkCitationConsistency(c.id).score);
      const averageScore = platformScores.length > 0
        ? Math.round(platformScores.reduce((sum, score) => sum + score, 0) / platformScores.length)
        : 0;

      return {
        name: platform.name,
        citations: platformCitations.length,
        averageScore,
        status: platformCitations.length > 0 ? 'active' : 'pending'
      };
    });

    // Location Analysis
    const locations = ['berlin', 'muenchen', 'hamburg'];
    const locationAnalysis = locations.map(location => {
      const locationCitations = allCitations.filter(c =>
        c.url.includes(location) || c.businessName.includes(location.charAt(0).toUpperCase() + location.slice(1))
      );

      const issues = locationCitations.flatMap(c => this.checkCitationConsistency(c.id).issues);
      const coverage = Math.round((locationCitations.length / this.platforms.size) * 100);

      return {
        location: location.charAt(0).toUpperCase() + location.slice(1),
        citations: locationCitations.length,
        coverage,
        issues: [...new Set(issues)]
      };
    });

    // Recommendations
    const recommendations = [
      ...this.generateCitationRecommendations(),
      ...this.generateConsistencyRecommendations(),
      ...this.generateOptimizationRecommendations()
    ];

    return {
      summary: {
        totalCitations: allCitations.length,
        claimedCitations,
        verifiedCitations,
        averageAuthorityScore,
        consistencyScore
      },
      platforms: platformAnalysis,
      locations: locationAnalysis,
      recommendations
    };
  }

  /**
   * Citation-Empfehlungen generieren
   */
  private generateCitationRecommendations(): string[] {
    const unclaimedPlatforms = Array.from(this.platforms.values()).filter(platform => {
      const hasCitation = Array.from(this.citations.values()).some(c => c.platform === platform.name);
      return !hasCitation;
    });

    const recommendations = [];

    if (unclaimedPlatforms.length > 0) {
      recommendations.push(`${unclaimedPlatforms.length} wichtige Verzeichnisse noch nicht erfasst: ${unclaimedPlatforms.slice(0, 3).map(p => p.name).join(', ')}`);
    }

    const highAuthorityMissing = unclaimedPlatforms.filter(p => p.authority >= 85);
    if (highAuthorityMissing.length > 0) {
      recommendations.push(`High-Authority Plattformen priorisieren: ${highAuthorityMissing.map(p => p.name).join(', ')}`);
    }

    return recommendations;
  }

  /**
   * Consistency-Empfehlungen generieren
   */
  private generateConsistencyRecommendations(): string[] {
    const recommendations = [];
    const inconsistentCitations = Array.from(this.citations.values()).filter(c =>
      this.checkCitationConsistency(c.id).score < 90
    );

    if (inconsistentCitations.length > 0) {
      recommendations.push(`${inconsistentCitations.length} Citations haben Konsistenzprobleme`);
      recommendations.push('NAP-Daten (Name, Address, Phone) über alle Plattformen vereinheitlichen');
    }

    return recommendations;
  }

  /**
   * Optimierungs-Empfehlungen generieren
   */
  private generateOptimizationRecommendations(): string[] {
    return [
      'Monatliche Citation-Überprüfung durchführen',
      'Neue Verzeichnisse identifizieren und hinzufügen',
      'Review-Generation in wichtigen Verzeichnissen fördern',
      'Local SEO Keywords in Citations integrieren',
      'Citations für neue Standorte erstellen'
    ];
  }
}

// Export als Singleton
export const localCitationsService = new LocalCitationsService();
export default localCitationsService;