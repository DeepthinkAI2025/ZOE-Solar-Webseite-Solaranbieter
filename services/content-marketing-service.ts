/**
 * Content Marketing Service für ZOE Solar
 *
 * Kostenlose Content-Verbreitungsstrategien
 * Social Media, Blog, PR und Community Building
 */

export interface ContentStrategy {
  id: string;
  name: string;
  type: 'blog' | 'social' | 'pr' | 'video' | 'podcast' | 'infographic' | 'guide';
  platforms: string[];
  frequency: string;
  targetAudience: string[];
  goals: string[];
  budget: 'none' | 'low' | 'medium' | 'high';
}

export interface ContentPiece {
  id: string;
  title: string;
  type: string;
  format: 'article' | 'video' | 'infographic' | 'podcast' | 'guide' | 'case-study';
  content: string;
  keywords: string[];
  targetPlatforms: string[];
  status: 'planned' | 'created' | 'published' | 'promoted';
  metrics: {
    views: number;
    shares: number;
    likes: number;
    comments: number;
    leads: number;
  };
  publishedDate?: Date;
}

export interface DistributionChannel {
  name: string;
  type: 'social' | 'blog' | 'directory' | 'forum' | 'pr' | 'video' | 'podcast';
  audience: string;
  reach: number;
  cost: 'free' | 'freemium' | 'paid';
  contentType: string[];
  guidelines: string[];
  url?: string;
}

class ContentMarketingService {
  private strategies: Map<string, ContentStrategy> = new Map();
  private channels: Map<string, DistributionChannel> = new Map();
  private contentLibrary: Map<string, ContentPiece> = new Map();
  private contentCalendar: Map<string, ContentPiece[]> = new Map();

  /**
   * Initialisiert den Content Marketing Service
   */
  async initialize(): Promise<void> {
    console.log('📈 Initialisiere Content Marketing Service...');

    // Content-Strategien definieren
    await this.defineContentStrategies();

    // Distributionskanäle aufbauen
    await this.buildDistributionChannels();

    // Content Calendar erstellen
    await this.createContentCalendar();

    // Content-Templates vorbereiten
    await this.prepareContentTemplates();

    console.log('✅ Content Marketing Service bereit');
  }

  /**
   * Content-Strategien definieren (kostenlose Methoden)
   */
  private async defineContentStrategies(): Promise<void> {
    console.log('🎯 Definiere Content-Strategien...');

    const strategies: ContentStrategy[] = [
      {
        id: 'blog-content-strategy',
        name: 'Solar-Blog für Expertenpositionierung',
        type: 'blog',
        platforms: ['Website Blog', 'LinkedIn', 'XING', 'Medium'],
        frequency: 'Wöchentlich',
        targetAudience: ['Unternehmen', 'Eigentümer', 'Technische Leiter', 'Einkäufer'],
        goals: ['SEO Traffic', 'Lead Generation', 'Thought Leadership', 'Brand Awareness'],
        budget: 'none'
      },
      {
        id: 'social-media-strategy',
        name: 'Social Media für Community Building',
        type: 'social',
        platforms: ['LinkedIn', 'XING', 'Facebook', 'Instagram', 'Twitter/X'],
        frequency: 'Täglich',
        targetAudience: ['B2B Entscheider', 'Solar-Interessierte', 'Mitarbeiter', 'Partner'],
        goals: ['Community Engagement', 'Brand Awareness', 'Customer Support', 'Employee Advocacy'],
        budget: 'none'
      },
      {
        id: 'pr-strategy',
        name: 'PR & Pressemitteilungen',
        type: 'pr',
        platforms: ['Presseportale', 'Branchenmedien', 'Local News', 'Industry Blogs'],
        frequency: 'Monatlich',
        targetAudience: ['Journalisten', 'Branchenexperten', 'Investoren', 'Potenzielle Kunden'],
        goals: ['Media Coverage', 'Brand Authority', 'Backlinks', 'Industry Recognition'],
        budget: 'none'
      },
      {
        id: 'video-strategy',
        name: 'Video Content für YouTube & Social Media',
        type: 'video',
        platforms: ['YouTube', 'LinkedIn Video', 'Instagram Reels', 'Facebook Video', 'TikTok'],
        frequency: 'Wöchentlich',
        targetAudience: ['Visuelle Lerner', 'Mobile Nutzer', 'Junge Entscheider'],
        goals: ['Brand Awareness', 'Education', 'Engagement', 'YouTube SEO'],
        budget: 'low'
      },
      {
        id: 'forum-strategy',
        name: 'Forum & Community Engagement',
        type: 'blog',
        platforms: ['Photovoltaik Forum', 'XING Groups', 'LinkedIn Groups', 'Reddit'],
        frequency: 'Täglich',
        targetAudience: ['Solar-Enthusiasten', 'Fragensteller', 'Potenzielle Kunden'],
        goals: ['Expert Positioning', 'Lead Generation', 'Community Building', 'Market Insights'],
        budget: 'none'
      },
      {
        id: 'guide-strategy',
        name: 'Comprehensive Guides & Checklisten',
        type: 'guide',
        platforms: ['Website', 'LinkedIn Articles', 'Medium', 'PDF Distribution'],
        frequency: 'Monatlich',
        targetAudience: ['Researching Buyers', 'Detailed Information Seekers'],
        goals: ['Lead Generation', 'SEO Performance', 'Email List Building', 'Authority Building'],
        budget: 'none'
      }
    ];

    strategies.forEach(strategy => {
      this.strategies.set(strategy.id, strategy);
    });

    console.log(`✅ ${strategies.length} Content-Strategien definiert`);
  }

  /**
   * Kostenlose Distributionskanäle aufbauen
   */
  private async buildDistributionChannels(): Promise<void> {
    console.log('📡 Baue Distributionskanäle auf...');

    const channels: DistributionChannel[] = [
      // Social Media Platforms (Free)
      {
        name: 'LinkedIn',
        type: 'social',
        audience: 'B2B Professionals, Decision Makers',
        reach: 1000000,
        cost: 'freemium',
        contentType: ['Articles', 'Updates', 'Videos', 'Infographics'],
        guidelines: [
          'Professional tone, industry-focused content',
          '2-3 posts daily max, mix of updates and articles',
          'Use relevant hashtags: #SolarEnergy #Photovoltaik #Nachhaltigkeit',
          'Engage with comments within 24 hours',
          'Share employee content and industry news'
        ],
        url: 'https://www.linkedin.com/company/zoe-solar'
      },
      {
        name: 'XING',
        type: 'social',
        audience: 'German Business Professionals',
        reach: 500000,
        cost: 'freemium',
        contentType: ['Updates', 'Articles', 'Events', 'Jobs'],
        guidelines: [
          'German language content focused',
          '1-2 posts daily, business-casual tone',
          'Share industry events and job postings',
          'Participate in XING Groups actively',
          'Use XING-specific features like "Marktplatz"'
        ],
        url: 'https://www.xing.com/company/zoe-solar'
      },
      {
        name: 'Facebook',
        type: 'social',
        audience: 'General Audience, Local Community',
        reach: 2000000,
        cost: 'free',
        contentType: ['Updates', 'Photos', 'Videos', 'Events', 'Live Streams'],
        guidelines: [
          'Mix of educational and promotional content',
          '1-2 posts daily, visual content preferred',
          'Use Facebook Groups for community building',
          'Respond to messages quickly',
          'Share customer success stories and photos'
        ],
        url: 'https://www.facebook.com/zoe-solar'
      },
      {
        name: 'Instagram',
        type: 'social',
        audience: 'Visual Audience, Younger Demographics',
        reach: 800000,
        cost: 'free',
        contentType: ['Photos', 'Reels', 'Stories', 'IGTV'],
        guidelines: [
          'High-quality visual content only',
          'Daily Stories, 3-4 feed posts per week',
          'Show behind-the-scenes and project photos',
          'Use relevant Instagram tags',
          'Engage with Stories and comments'
        ],
        url: 'https://www.instagram.com/zoe_solar'
      },

      // Blog & Content Platforms (Free)
      {
        name: 'Medium',
        type: 'blog',
        audience: 'Tech-savvy Readers, Industry Professionals',
        reach: 100000,
        cost: 'free',
        contentType: ['Long-form articles', 'Case studies', 'Technical guides'],
        guidelines: [
          '1,500+ words articles preferred',
          'Use custom formatting and images',
          'Include relevant tags for discovery',
          'Cross-post from company blog',
          'Engage with comments and responses'
        ],
        url: 'https://medium.com/zoe-solar'
      },
      {
        name: 'LinkedIn Articles',
        type: 'blog',
        audience: 'LinkedIn Network',
        reach: 500000,
        cost: 'free',
        contentType: ['Business articles', 'Thought leadership', 'Industry analysis'],
        guidelines: [
          'Professional tone, data-driven content',
          '1,000-2,000 words optimal',
          'Include charts, graphs, and expert quotes',
          'Add call-to-action for consultation',
          'Share across LinkedIn network'
        ],
        url: 'https://www.linkedin.com/pulse/zoe-solar'
      },

      // Video Platforms (Free)
      {
        name: 'YouTube',
        type: 'video',
        audience: 'Video Content Consumers, DIY Enthusiasts',
        reach: 2000000,
        cost: 'free',
        contentType: ['How-to videos', 'Project tours', 'Expert interviews', 'Educational content'],
        guidelines: [
          'High-quality video and audio required',
          'Video descriptions 250+ words with keywords',
          'Custom thumbnails (1280x720px)',
          'Include call-to-action and links',
          'Optimize titles for YouTube SEO'
        ],
        url: 'https://www.youtube.com/c/ZOE-Solar'
      },

      // Forums & Communities (Free)
      {
        name: 'Photovoltaik Forum',
        type: 'forum',
        audience: 'Solar Enthusiasts, DIY Installers, Industry Experts',
        reach: 100000,
        cost: 'free',
        contentType: ['Expert answers', 'Technical discussions', 'Case studies'],
        guidelines: [
          'Provide genuine value, no direct selling',
          'Include company info in signature after 10 posts',
          'Answer questions thoroughly with photos',
          'Share project experiences and learnings',
          'Build reputation before promotion'
        ],
        url: 'https://www.photovoltaikforum.com'
      },
      {
        name: 'Reddit',
        type: 'forum',
        audience: 'Tech Community, DIY Enthusiasts',
        reach: 500000,
        cost: 'free',
        contentType: ['Expert answers', 'Project photos', 'Technical discussions'],
        guidelines: [
          'Follow community rules strictly',
          'No self-promotion in main posts',
          'Answer questions with genuine expertise',
          'Share project results and data',
          'Use r/solar, r/renewableenergy subreddits'
        ],
        url: 'https://www.reddit.com/user/zoe-solar'
      },

      // PR & Press (Free)
      {
        name: 'OpenPR',
        type: 'pr',
        audience: 'Journalists, Industry Media',
        reach: 50000,
        cost: 'free',
        contentType: ['Press releases', 'Company news', 'Product announcements'],
        guidelines: [
          'News-worthy content only',
          'Follow press release format strictly',
          'Include quotes and contact info',
          'Optimize headline for journalists',
          'Distribute to relevant categories'
        ],
        url: 'https://www.openpr.de'
      },
      {
        name: 'PR-Inside',
        type: 'pr',
        audience: 'Media outlets, Industry journalists',
        reach: 30000,
        cost: 'freemium',
        contentType: ['Press releases', 'Company announcements'],
        guidelines: [
          'Professional press release format',
          'Include multimedia elements',
          'SEO-optimized content',
          'Targeted media lists',
          'Follow up with journalists'
        ],
        url: 'https://www.pr-inside.com'
      }
    ];

    channels.forEach(channel => {
      this.channels.set(channel.name, channel);
    });

    console.log(`✅ ${channels.length} Distributionskanäle aufgebaut`);
  }

  /**
   * Content Calendar erstellen
   */
  private async createContentCalendar(): Promise<void> {
    console.log('📅 Erstelle Content Calendar...');

    const currentDate = new Date();
    const contentCalendar = new Map<string, ContentPiece[]>();

    // 30-Tage Content Plan
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      const dailyContent = this.generateDailyContent(date);
      contentCalendar.set(dateKey, dailyContent);
    }

    this.contentCalendar = contentCalendar;
    console.log('✅ 30-Tage Content Calendar erstellt');
  }

  /**
   * Täglichen Content generieren
   */
  private generateDailyContent(date: Date): ContentPiece[] {
    const dayOfWeek = date.getDay();
    const content: ContentPiece[] = [];

    // Blog Content (Montag & Donnerstag)
    if (dayOfWeek === 1 || dayOfWeek === 4) {
      content.push({
        id: `blog-${date.getTime()}`,
        title: this.generateBlogTitle(date),
        type: 'blog',
        format: 'article',
        content: this.generateBlogContent(date),
        keywords: this.generateKeywords(date),
        targetPlatforms: ['Website Blog', 'LinkedIn', 'XING', 'Medium'],
        status: 'planned',
        metrics: { views: 0, shares: 0, likes: 0, comments: 0, leads: 0 }
      });
    }

    // Social Media Content (Täglich)
    const socialPost = {
      id: `social-${date.getTime()}`,
      title: this.generateSocialTitle(date),
      type: 'social',
      format: 'article',
      content: this.generateSocialContent(date),
      keywords: this.generateKeywords(date),
      targetPlatforms: ['LinkedIn', 'XING', 'Facebook', 'Instagram'],
      status: 'planned',
      metrics: { views: 0, shares: 0, likes: 0, comments: 0, leads: 0 }
    };
    content.push(socialPost);

    // Video Content (Mittwoch)
    if (dayOfWeek === 3) {
      content.push({
        id: `video-${date.getTime()}`,
        title: this.generateVideoTitle(date),
        type: 'video',
        format: 'video',
        content: this.generateVideoContent(date),
        keywords: this.generateKeywords(date),
        targetPlatforms: ['YouTube', 'LinkedIn Video', 'Instagram Reels'],
        status: 'planned',
        metrics: { views: 0, shares: 0, likes: 0, comments: 0, leads: 0 }
      });
    }

    // PR Content (Freitag - 1x im Monat)
    if (dayOfWeek === 5 && date.getDate() <= 7) {
      content.push({
        id: `pr-${date.getTime()}`,
        title: this.generatePRTitle(date),
        type: 'pr',
        format: 'article',
        content: this.generatePRContent(date),
        keywords: this.generateKeywords(date),
        targetPlatforms: ['OpenPR', 'PR-Inside', 'Industry Blogs'],
        status: 'planned',
        metrics: { views: 0, shares: 0, likes: 0, comments: 0, leads: 0 }
      });
    }

    return content;
  }

  /**
   * Content Templates vorbereiten
   */
  private async prepareContentTemplates(): Promise<void> {
    console.log('📝 Bereite Content Templates vor...');

    // Blog Post Templates
    const blogTemplates = {
      technical: {
        title: 'Photovoltaik für Unternehmen: {topic} im Detail',
        structure: ['Introduction', 'Technical Details', 'Benefits', 'Case Study', 'Conclusion'],
        keywords: ['photovoltaik unternehmen', 'solaranlagen {topic}', 'gewerbe solar'],
        callToAction: 'Kostenlose Beratung anfordern'
      },
      financial: {
        title: 'Solaranlagen Rendite: {aspect} erklärt',
        structure: ['Introduction', 'Cost Analysis', 'ROI Calculation', 'Funding Options', 'Conclusion'],
        keywords: ['solaranlage rendite', 'photovoltaik wirtschaftlichkeit', '{aspect} kosten'],
        callToAction: 'Individuelle Rendite-Berechnung'
      },
      regulatory: {
        title: 'Neue Solarförderung {year}: {aspect} im Überblick',
        structure: ['Introduction', 'New Regulations', 'Impact on Business', 'Application Process', 'Tips'],
        keywords: ['solarförderung {year}', '{aspect} förderung', 'photovoltaik subsidien'],
        callToAction: 'Fördermittel-Check durchführen'
      }
    };

    // Social Media Templates
    const socialTemplates = {
      educational: {
        text: 'Wussten Sie, dass {fact}? 💡 {explanation}\n\n#SolarEnergy #Photovoltaik #Nachhaltigkeit #Unternehmen',
        hashtags: ['#SolarEnergy', '#Photovoltaik', '#Nachhaltigkeit', '#Unternehmen'],
        visual: 'Infographic with key facts'
      },
      promotional: {
        text: '🔥 Special Offer: {offer}\n\n{description}\n\nJetzt kontaktieren: {contact}\n\n#Solaranlagen #Photovoltaik #Beratung',
        hashtags: ['#Solaranlagen', '#Photovoltaik', '#Beratung', '#Spezial'],
        visual: 'Promotional graphic with offer details'
      },
      behindTheScenes: {
        text: 'Einblick hinter die Kulissen: {activity} 🏗️\n\n{description}\n\n{hashtag}',
        hashtags: ['#BehindTheScenes', '#Teamwork', '#SolarInstallation'],
        visual: 'Photo or short video of team activity'
      }
    };

    // Video Templates
    const videoTemplates = {
      howTo: {
        title: 'Wie funktioniert {process}? | Schritt-für-Schritt Erklärung',
        duration: '5-10 minutes',
        style: 'Educational with screen overlays',
        callToAction: 'Für Ihr persönliches Angebot kontaktieren Sie uns!'
      },
      projectTour: {
        title: 'Projekttour: {projectType} in {location}',
        duration: '3-5 minutes',
        style: 'Walkthrough with expert commentary',
        callToAction: 'Buchen Sie auch Ihre kostenlose Standortanalyse!'
      },
      interview: {
        title: 'Experteninterview: {topic} mit {expert}',
        duration: '10-15 minutes',
        style: 'Professional interview setup',
        callToAction: 'Haben Sie Fragen? Unsere Experten helfen Ihnen gerne!'
      }
    };

    // Speichern für spätere Verwendung
    this.contentLibrary.set('blogTemplates', blogTemplates as any);
    this.contentLibrary.set('socialTemplates', socialTemplates as any);
    this.contentLibrary.set('videoTemplates', videoTemplates as any);

    console.log('✅ Content Templates vorbereitet');
  }

  // Content Generation Methods
  private generateBlogTitle(date: Date): string {
    const topics = [
      'Solaranlagen Finanzierung',
      'Photovoltaik Wartung',
      'Stromspeicher Vorteile',
      'Solarförderung 2025',
      'Gewerbliche Solaranlagen',
      'Solaranlage Rendite',
      'Photovoltaik Planung',
      'Solarstrom Einspeisung'
    ];

    const topic = topics[Math.floor(Math.random() * topics.length)];
    return `${topic}: Alles was Unternehmen 2025 wissen müssen`;
  }

  private generateBlogContent(date: Date): string {
    return `
# ${this.generateBlogTitle(date)}

Photovoltaik für Unternehmen wird 2025 immer wichtiger. Mit steigenden Energiepreisen und attraktiven Förderprogrammen entscheiden sich immer mehr Betriebe für eine eigene Solaranlage.

## Warum Solaranlagen für Unternehmen so wichtig sind

1. **Kosteneinsparung**: Reduzieren Sie Ihre Stromrechnung um bis zu 70%
2. **Unabhängigkeit**: Werden Sie unabhängig von Strompreiserhöhungen
3. **Nachhaltigkeit**: Positionieren Sie sich als umweltbewusstes Unternehmen
4. **Rendite**: Erzielen Sie attraktive Renditen von 8-15% jährlich

## Förderprogramme 2025

Die aktuellen Förderprogramme machen Solaranlagen für Unternehmen besonders attraktiv:

- KfW-Kredite mit Zinsen ab 1,23%
- BAFA-Zuschüsse für Stromspeicher bis zu 3.300 €
- Regionale Förderprogramme je nach Bundesland

## Nächste Schritte

Kontaktieren Sie ZOE Solar für eine kostenlose Beratung. Unsere Experten analysieren Ihr Dach, berechnen die Rendite und zeigen Ihnen alle Fördermöglichkeiten auf.

📞 +49 30 12345678
🌐 https://zoe-solar.de/kontakt
    `.trim();
  }

  private generateSocialTitle(date: Date): string {
    const topics = [
      'Solar-Tipp der Woche',
      'Photovoltaik-Fakten',
      'Solarerfolg-Geschichte',
      'Fördermittel-Hinweis',
      'Solar-Mythos aufgedeckt'
    ];

    return topics[Math.floor(Math.random() * topics.length)];
  }

  private generateSocialContent(date: Date): string {
    const facts = [
      'Eine 100 kWp Solaranlage spart ca. 20.000 € Stromkosten pro Jahr',
      'Photovoltaik-Anlagen haben eine Lebensdauer von 25-30 Jahren',
      'Solarstrom kann bis zu 70% des Unternehmensbedarfs decken',
      'Die Amortisationszeit beträgt meist nur 8-12 Jahre'
    ];

    const fact = facts[Math.floor(Math.random() * facts.length)];
    return `💡 Solar-Fakt: ${fact}\n\n#SolarEnergy #Photovoltaik #Unternehmen #Nachhaltigkeit`;
  }

  private generateVideoTitle(date: Date): string {
    const topics = [
      'Solaranlagen Installation',
      'Photovoltaik Beratung',
      'Solarstromspeicher Einbau',
      'Solaranlage Wartung',
      'Solarförderung Beratung'
    ];

    return `Behind the Scenes: ${topics[Math.floor(Math.random() * topics.length)] bei ZOE Solar`;
  }

  private generateVideoContent(date: Date): string {
    return `
Video Description:
In diesem Video zeigen wir Ihnen ${this.generateVideoTitle(date).
Seien Sie dabei, wie unsere Experten arbeiten und welche Schritte notwendig sind.

🔔 Abonnieren Sie unseren Kanal für mehr Solar-Expertise!

📞 Kostenlose Beratung: +49 30 12345678
🌐 https://zoe-solar.de

#Solaranlagen #Photovoltaik #ZOE #SolarInstallation #ErneuerbareEnergien
    `.trim();
  }

  private generatePRTitle(date: Date): string {
    const news = [
      'ZOE Solar erweitert Standort in Berlin',
      'Neuer Rekord: 500 Solarprojekte erfolgreich abgeschlossen',
      'Innovationspreis 2025 für Solar-Lösung',
      'ZOE Solar startet Solar-Finanzierungsprogramm',
      'Kooperation mit führenden Batteriehersteller'
    ];

    return news[Math.floor(Math.random() * news.length)];
  }

  private generatePRContent(date: Date): string {
    return `
PRESSEMELDUNG

${this.generatePRTitle(date)}

Berlin, ${date.toLocaleDateString('de-DE')} – ZOE Solar, führender Anbieter von gewerblichen Photovoltaik-Lösungen in Deutschland, veröffentlicht heute beeindruckende Ergebnisse des ersten Halbjahres 2025.

Mit über 100 erfolgreich abgeschlossenen Solarprojekten und einer Kundenzufriedenheit von 4.8/5 Sternen positioniert sich das Unternehmen als Vorreiter in der gewerblichen Solarbranche.

"Wir freuen uns sehr über das Vertrauen, das uns Unternehmen in ganz Deutschland entgegenbringen", sagt Max Mustermann, CEO von ZOE Solar. "Unsere Mission ist es, Unternehmen dabei zu helfen, durch Solarenergie nicht nur Kosten zu sparen, sondern auch einen Beitrag zum Klimaschutz zu leisten."

Die Nachfrage nach gewerblichen Solaranlagen ist 2025 um 40% im Vergleich zum Vorjahr gestieben, angetrieben durch steigende Energiepreise und attraktive Förderprogramme.

Über ZOE Solar:
ZOE Solar GmbH wurde 2015 gegründet und hat sich auf die Planung, Installation und Wartung von gewerblichen Photovoltaik-Anlagen spezialisiert. Das Unternehmen beschäftigt 45 Mitarbeiter und hat Standorte in Berlin, München und Hamburg.

Pressekontakt:
Sarah Schmidt
 presse@zoe-solar.de
+49 30 12345678

https://zoe-solar.de
    `.trim();
  }

  private generateKeywords(date: Date): string[] {
    const baseKeywords = [
      'Solaranlagen',
      'Photovoltaik',
      'Solarstrom',
      'gewerbliche Solaranlagen',
      'Photovoltaik Unternehmen',
      'Solarförderung',
      'ZOE Solar'
    ];

    const dateKeywords = [
      `Solaranlagen ${date.getFullYear()}`,
      `Photovoltaik ${date.getFullYear()}`,
      `Solarförderung ${date.getFullYear()}`
    ];

    return [...baseKeywords, ...dateKeywords];
  }

  /**
   * Content Performance analysieren
   */
  analyzeContentPerformance(): {
    totalContent: number;
    publishedContent: number;
    averageViews: number;
    averageEngagement: number;
    topPerforming: ContentPiece[];
    recommendations: string[];
  } {
    const allContent = Array.from(this.contentLibrary.values())
      .filter(item => typeof item === 'object' && 'title' in item) as ContentPiece[];

    const publishedContent = allContent.filter(c => c.status === 'published');
    const totalViews = publishedContent.reduce((sum, c) => sum + c.metrics.views, 0);
    const totalShares = publishedContent.reduce((sum, c) => sum + c.metrics.shares, 0);
    const totalLikes = publishedContent.reduce((sum, c) => sum + c.metrics.likes, 0);
    const totalComments = publishedContent.reduce((sum, c) => sum + c.metrics.comments, 0);

    const averageViews = publishedContent.length > 0 ? Math.round(totalViews / publishedContent.length) : 0;
    const averageEngagement = publishedContent.length > 0
      ? Math.round((totalShares + totalLikes + totalComments) / publishedContent.length)
      : 0;

    const topPerforming = publishedContent
      .sort((a, b) => b.metrics.views - a.metrics.views)
      .slice(0, 5);

    const recommendations = [
      'Content auf Top-Performing Plattformen fokussieren',
      'Video Content auf allen Plattformen verteilen',
      'Blog Posts 2-3 Mal über soziale Medien teilen',
      'Engagement innerhalb von 24 Stunden beantworten',
      'Content-Metriken wöchentlich überprüfen und anpassen'
    ];

    return {
      totalContent: allContent.length,
      publishedContent: publishedContent.length,
      averageViews,
      averageEngagement,
      topPerforming,
      recommendations
    };
  }

  /**
   * Content-Verbreitungsplan erstellen
   */
  createDistributionPlan(contentPiece: ContentPiece): {
    platforms: string[];
    schedule: string[];
    assets: string[];
    budget: number;
    expectedReach: number;
  } {
    const platform = this.channels.get('LinkedIn');
    const expectedReach = contentPiece.targetPlatforms.reduce((sum, platformName) => {
      const platform = this.channels.get(platformName);
      return sum + (platform?.reach || 0);
    }, 0);

    return {
      platforms: contentPiece.targetPlatforms,
      schedule: this.generatePostingSchedule(contentPiece),
      assets: this.generateRequiredAssets(contentPiece),
      budget: 0, // Alle kostenlos
      expectedReach
    };
  }

  private generatePostingSchedule(contentPiece: ContentPiece): string[] {
    const schedules = {
      article: [
        'Day 0: Publish on Website Blog',
        'Day 0: Share on LinkedIn with expert comment',
        'Day 0: Post on XING with German summary',
        'Day 1: Share on Medium with extended content',
        'Day 2: Create LinkedIn Carousel with key points',
        'Day 3: Share on Facebook with visual',
        'Day 7: Post in relevant LinkedIn Groups',
        'Day 14: Repost as "Evergreen Content"'
      ],
      video: [
        'Day 0: Upload to YouTube with optimized metadata',
        'Day 0: Share on LinkedIn Video',
        'Day 0: Create Instagram Reel version',
        'Day 1: Share on Facebook with thumbnail',
        'Day 2: Create short clips for social media',
        'Day 7: Repost on YouTube Community tab'
      ],
      social: [
        'Day 0: Publish on all target platforms',
        'Day 1: Share with relevant hashtags',
        'Day 2: Engage with all comments',
        'Day 7: Repost if high engagement'
      ]
    };

    return schedules[contentPiece.format as keyof typeof schedules] || schedules.social;
  }

  private generateRequiredAssets(contentPiece: ContentPiece): string[] {
    const assets = [];

    if (contentPiece.format === 'article') {
      assets.push('Featured Image (1200x630px)', 'Social Media Images', 'Infographic Elements');
    }

    if (contentPiece.format === 'video') {
      assets.push('Video File (1080p)', 'Custom Thumbnail (1280x720px)', 'Video Captions', 'Video Transcription');
    }

    if (contentPiece.format === 'infographic') {
      assets.push('Infographic Design', 'Mobile Version', 'Source Attribution');
    }

    return assets;
  }

  /**
   * Kostenlose Marketing-Kampagne planen
   */
  planFreeMarketingCampaign(): {
    name: string;
    duration: string;
    goals: string[];
    tactics: Array<{
      channel: string;
      action: string;
      frequency: string;
      cost: number;
    }>;
    expectedResults: {
      reach: number;
      engagement: number;
      leads: number;
    };
  } {
    return {
      name: 'Solar Awareness Month',
      duration: '30 Tage',
      goals: ['Brand Awareness', 'Lead Generation', 'Thought Leadership', 'Community Building'],
      tactics: [
        {
          channel: 'LinkedIn',
          action: 'Daily posts with solar tips, project showcases, expert insights',
          frequency: 'Täglich',
          cost: 0
        },
        {
          channel: 'YouTube',
          action: 'Weekly how-to videos and project tours',
          frequency: 'Wöchentlich',
          cost: 0
        },
        {
          channel: 'Blog',
          action: 'Weekly in-depth articles about solar topics',
          frequency: 'Wöchentlich',
          cost: 0
        },
        {
          channel: 'Forums',
          action: 'Expert answers in Photovoltaik Forum and Reddit',
          frequency: 'Täglich',
          cost: 0
        },
        {
          channel: 'PR',
          action: 'Monthly press releases to OpenPR and industry blogs',
          frequency: 'Monatlich',
          cost: 0
        }
      ],
      expectedResults: {
        reach: 50000,
        engagement: 2500,
        leads: 100
      }
    };
  }
}

// Export als Singleton
export const contentMarketingService = new ContentMarketingService();
export default contentMarketingService;