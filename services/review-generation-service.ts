/**
 * Review Generation Service für ZOE Solar
 *
 * Automatisiertes Kundenbewertungs-System
 * Kostenlose Methoden für 5-Sterne-Bewertungen
 */

export interface ReviewRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectType: string;
  projectDate: Date;
  requestDate: Date;
  platforms: string[];
  status: 'pending' | 'sent' | 'completed' | 'declined';
  reminderCount: number;
  lastReminder?: Date;
}

export interface ReviewResponse {
  id: string;
  requestId: string;
  platform: string;
  rating: number;
  text: string;
  author: string;
  date: Date;
  verified: boolean;
  helpful: number;
  reply?: {
    text: string;
    date: Date;
    author: string;
  };
}

export interface ReviewFunnel {
  stage: string;
  touchpoints: Array<{
    channel: string;
    timing: string;
    message: string;
    method: string;
  }>;
  conversionRate: number;
  averageRating: number;
}

export interface ReviewIncentive {
  type: 'discount' | 'gift' | 'service' | 'charity' | 'none';
  value: string;
  description: string;
  terms: string;
  cost: number;
  effectiveness: number;
}

class ReviewGenerationService {
  private reviewRequests: Map<string, ReviewRequest> = new Map();
  private reviewResponses: Map<string, ReviewResponse> = new Map();
  private reviewFunnels: Map<string, ReviewFunnel> = new Map();
  private incentives: Map<string, ReviewIncentive> = new Map();
  private responseTemplates: Map<string, string[]> = new Map();

  /**
   * Initialisiert den Review Generation Service
   */
  async initialize(): Promise<void> {
    console.log('⭐ Initialisiere Review Generation Service...');

    // Review-Funnels definieren
    await this.defineReviewFunnels();

    // Review-Incentives einrichten
    await this.setupReviewIncentives();

    // Response Templates vorbereiten
    await this.prepareResponseTemplates();

    // Automatisierte Workflows einrichten
    await this.setupAutomatedWorkflows();

    console.log('✅ Review Generation Service bereit');
  }

  /**
   * Review-Funnels für verschiedene Touchpoints definieren
   */
  private async defineReviewFunnels(): Promise<void> {
    console.log('🔍 Definiere Review-Funnels...');

    const funnels = [
      {
        stage: 'Project Completion',
        touchpoints: [
          {
            channel: 'Email',
            timing: 'Immediately after project completion',
            message: 'Vielen Dank für Ihr Vertrauen! Wir würden uns über eine Bewertung freuen.',
            method: 'Personalized email with direct links'
          },
          {
            channel: 'SMS',
            timing: '2 days after completion',
            message: 'Wie zufrieden sind Sie mit Ihrer neuen Solaranlage?',
            method: 'Short SMS with review links'
          },
          {
            channel: 'Phone',
            timing: '7 days after completion',
            message: 'Kurze Follow-up Anfrage nach Review',
            method: 'Quick customer satisfaction call'
          },
          {
            channel: 'WhatsApp',
            timing: '14 days after completion',
            message: 'Teilen Sie Ihre Solar-Erfolge!',
            method: 'WhatsApp message with photo options'
          }
        ],
        conversionRate: 35,
        averageRating: 4.7
      },
      {
        stage: 'First Month Service',
        touchpoints: [
          {
            channel: 'Email',
            timing: '30 days after installation',
            message: 'Wie läuft Ihre Solaranlage im ersten Monat?',
            method: 'Performance review request'
          },
          {
            channel: 'QR Code',
            timing: 'During technician visit',
            message: 'Scannen Sie für schnelle Bewertung',
            method: 'Physical QR code on service report'
          },
          {
            channel: 'In-Person',
            timing: 'During maintenance visit',
            message: 'Persönliche Bitte um Bewertung',
            method: 'Technician asks for review'
          }
        ],
        conversionRate: 28,
        averageRating: 4.6
      },
      {
        stage: 'Referral Program',
        touchpoints: [
          {
            channel: 'Email',
            timing: 'After referral submission',
            message: 'Vielen Dank für Ihre Empfehlung!',
            method: 'Thank you email with review request'
          },
          {
            channel: 'Social Media',
            timing: 'Monthly campaign',
            message: 'Kunden-Erfolge teilen',
            method: 'Social media campaign template'
          }
        ],
        conversionRate: 45,
        averageRating: 4.9
      },
      {
        stage: 'Customer Anniversary',
        touchpoints: [
          {
            channel: 'Email',
            timing: '1 year anniversary',
            message: 'Ein Jahr Solar-Energie mit ZOE Solar!',
            method: 'Anniversary email with review request'
          },
          {
            channel: 'Handwritten Card',
            timing: '1 year anniversary',
            message: 'Persönliche Dankeskarte',
            method: 'Physical card with QR code'
          }
        ],
        conversionRate: 52,
        averageRating: 4.8
      }
    ];

    funnels.forEach((funnel, index) => {
      this.reviewFunnels.set(`funnel_${index}`, funnel);
    });

    console.log(`✅ ${funnels.length} Review-Funnels definiert`);
  }

  /**
   * Review-Incentives einrichten (kostenlose & günstige Optionen)
   */
  private async setupReviewIncentives(): Promise<void> {
    console.log('🎁 Richte Review-Incentives ein...');

    const incentives: ReviewIncentive[] = [
      {
        type: 'service',
        value: 'Kostenlose Solar-Check (150€ Wert)',
        description: 'Jährliche Anlagen-Check inklusive Performance-Analyse',
        terms: 'Gültig für 12 Monate nach Bewertung',
        cost: 25, // Interne Kosten
        effectiveness: 0.75
      },
      {
        type: 'discount',
        value: '5% Wartungs-Rabatt',
        description: '5% Rabatt auf die nächste Wartung',
        terms: 'Einmalig einlösbar, gültig 12 Monate',
        cost: 40, // Interne Kosten
        effectiveness: 0.65
      },
      {
        type: 'gift',
        value: 'Solar-Merchandise Paket',
        description: 'ZOE Solar T-Shirt und Solar-Accessoires',
        terms: 'Kein Mindestwert, versandkostenfrei',
        cost: 15,
        effectiveness: 0.55
      },
      {
        type: 'charity',
        value: '10€ Spende an Solar-Stiftung',
        description: 'Wir spenden 10€ an die Stiftung Solarenergie',
        terms: 'Für jede 5-Sterne-Bewertung',
        cost: 10,
        effectiveness: 0.45
      },
      {
        type: 'discount',
        value: '100€ Gutschein für Kunden',
        description: '100€ Gutschein für neue Kunden',
        terms: 'Bei Weiterempfehlung mit 5-Sterne-Bewertung',
        cost: 50,
        effectiveness: 0.85
      },
      {
        type: 'none',
        value: 'Danke für Ihr Feedback',
        description: 'Keine materielle Belohnung',
        terms: 'Reines Dankeschön',
        cost: 0,
        effectiveness: 0.25
      }
    ];

    incentives.forEach((incentive, index) => {
      this.incentives.set(`incentive_${index}`, incentive);
    });

    console.log(`✅ ${incentives.length} Review-Incentives eingerichtet`);
  }

  /**
   * Response Templates vorbereiten
   */
  private async prepareResponseTemplates(): Promise<void> {
    console.log('💬 Bereite Response Templates vor...');

    const templates = {
      positive: [
        'Vielen Dank für Ihre fantastische Bewertung! Wir freuen uns, dass Sie mit unserer Arbeit zufrieden sind. Ihr Feedback motiviert unser Team jeden Tag.',
        'Danke für die 5-Sterne-Bewertung! Wir sind stolz darauf, unseren Kunden erstklassige Solarlösungen zu bieten.',
        'Herzlichen Dank für Ihre positive Bewertung! Wir freuen uns auf die weitere Zusammenarbeit und stehen Ihnen jederzeit zur Verfügung.',
        'Vielen Dank für Ihr Vertrauen und Ihre tolle Bewertung! Ihr Feedback ist für uns und andere Kunden sehr wertvoll.',
        'Fantastische Bewertung - vielen Dank! Wir freuen uns, dass Sie mit Ihrer Solaranlage so zufrieden sind.'
      ],
      negative: [
        'Wir bedauern sehr, dass Sie nicht zufrieden waren. Bitte kontaktieren Sie uns direkt unter [Telefon], damit wir eine Lösung finden können.',
        'Ihr Feedback ist uns wichtig. Wir möchten die Situation verstehen und alles in unserer Macht Stehende tun, um dies zu korrigieren.',
        'Es tut uns leid, dass Sie nicht zufrieden waren. Wir nehmen Ihr Feedback ernst und würden gerne sprechen, wie wir dies verbessern können.',
        'Vielen Dank für Ihr ehrliches Feedback. Wir würden uns gerne die Gelegenheit geben, etwaige Probleme zu beheben.',
        'Wir bedauern, dass Ihre Erwartungen nicht erfüllt wurden. Ihr Feedback hilft uns, unsere Prozesse zu verbessern.'
      ],
      neutral: [
        'Vielen Dank für Ihr Feedback. Wir schätzen Ihre Zeit und würden gerne mehr über Ihre Erfahrung erfahren.',
        'Danke für Ihre Bewertung. Wir arbeiten kontinuierlich an der Verbesserung unserer Services.',
        'Vielen Dank für Ihre Bewertung. Wir freuen uns immer über Feedback und sind dankbar für Ihre Zeit.',
        'Danke für Ihre Rückmeldung. Wir schätzen Ihr Feedback und nutzen es für die kontinuierliche Verbesserung.',
        'Vielen Dank für Ihre Bewertung. Wenn es Fragen gibt, stehen wir Ihnen gerne zur Verfügung.'
      ],
      three_star: [
        'Danke für Ihr Feedback. Wir sehen, dass es Verbesserungspotenzial gibt. Wie können wir Ihr Erfahrung auf 5 Sterne verbessern?',
        'Vielen Dank für Ihre Bewertung. Wir würden gerne wissen, was wir besser machen können, um Ihnen eine 5-Sterne-Erfahrung zu bieten.',
        'Danke für Ihre ehrliche Bewertung. Was könnten wir tun, um Ihre Zufriedenheit zu erhöhen?'
      ]
    };

    templates.forEach((templateSet, category) => {
      this.responseTemplates.set(category, templateSet);
    });

    console.log('✅ Response Templates vorbereitet');
  }

  /**
   * Automatisierte Workflows einrichten
   */
  private async setupAutomatedWorkflows(): Promise<void> {
    console.log('⚙️ Richte automatisierte Workflows ein...');

    // Automated Reminders
    const reminderWorkflow = {
      triggers: ['pending', 'sent'],
      intervals: [3, 7, 14, 30], // days
      maxReminders: 4,
      channels: ['email', 'sms'],
      escalationRules: {
        after: '30 days',
        action: 'phone_call'
      }
    };

    // Response Management Workflow
    const responseWorkflow = {
      responseTime: {
        target: 24, // hours
        priority: 'high'
      },
      escalationRules: {
        negative_reviews: {
          timeframe: '2 hours',
          action: 'manager_notification'
        },
        three_star_reviews: {
          timeframe: '24 hours',
          action: 'follow_up_request'
        }
      }
    };

    // Review Monitoring Workflow
    const monitoringWorkflow = {
      platforms: ['Google', 'LinkedIn', 'XING', 'Facebook'],
      frequency: 'daily',
      alerts: [
        'new_negative_review',
        'rating_drop_below_4.0',
        'no_new_reviews_30_days',
        'review_volume_increase_50%'
      ]
    };

    // Store workflows for later use
    this.reviewRequests.set('reminderWorkflow', reminderWorkflow as any);
    this.reviewRequests.set('responseWorkflow', responseWorkflow as any);
    this.reviewRequests.set('monitoringWorkflow', monitoringWorkflow as any);

    console.log('✅ Automatisierte Workflows eingerichtet');
  }

  /**
   * Review Request erstellen
   */
  createReviewRequest(customerData: {
    name: string;
    email: string;
    phone?: string;
    projectType: string;
    projectDate: Date;
    platforms?: string[];
  }): ReviewRequest {
    const request: ReviewRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId: `cust_${Math.random().toString(36).substr(2, 9)}`,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone || '',
      projectType: customerData.projectType,
      projectDate: customerData.projectDate,
      requestDate: new Date(),
      platforms: customerData.platforms || ['Google', 'LinkedIn'],
      status: 'pending',
      reminderCount: 0
    };

    this.reviewRequests.set(request.id, request);
    console.log(`✅ Review Request erstellt: ${request.customerName}`);

    return request;
  }

  /**
   * Personalisierte Review-Anfrage versenden
   */
  sendPersonalizedRequest(requestId: string): Promise<boolean> {
    const request = this.reviewRequests.get(requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    // Simuliert: Personalisierte E-Mail versenden
    const personalizedEmail = this.generatePersonalizedEmail(request);
    const personalizedSMS = this.generatePersonalizedSMS(request);

    // In einer echten Anwendung würde hier der E-Mail/SMS Versand stattfinden
    console.log(`📧 Personalisierte E-Mail versendet an: ${request.customerEmail}`);
    console.log(`💬 Personalisierte SMS versendet an: ${request.customerPhone}`);

    request.status = 'sent';
    this.reviewRequests.set(requestId, request);

    return true;
  }

  /**
   * Personalisierte E-Mail generieren
   */
  private generatePersonalizedEmail(request: ReviewRequest): string {
    const daysSinceProject = Math.floor((new Date().getTime() - request.projectDate.getTime()) / (1000 * 60 * 60 * 24));

    return `
Liebe/r ${request.customerName},

vielen Dank für das Vertrauen, das Sie ZOE Solar bei Ihrem ${request.projectType}-Projekt entgegengebracht haben!

Es sind nun ${daysSinceProject} Tage vergangen, seit wir Ihre Solaranlage in Betrieb genommen haben. Wir hoffen, dass Sie bereits die ersten positiven Erfahrungen mit Ihrer sauberen Energie machen.

Ihr Feedback ist uns extrem wichtig! Andere Unternehmen, die eine Solaranlage in Betracht ziehen, profitieren von Ihren Erfahrungen.

🌟 Bitte nehmen Sie sich 2 Minuten Zeit für eine Bewertung:

${request.platforms.map(platform => {
  const urls = {
    'Google': 'https://g.page/zoe-solar/review',
    'LinkedIn': 'https://www.linkedin.com/company/zoe-solar/reviews',
    'XING': 'https://www.xing.com/company/zoe-solar/reviews'
  };
  return `${platform}: ${urls[platform as keyof typeof urls] || '#'}`;
}).join('\n')}

🎁 Als kleines Dankeschön für Ihre Zeit erhalten Sie von uns:
[Incentive-Beschreibung]

Sollten Sie Fragen oder Anmerkungen haben, zögern Sie bitte nicht, uns direkt zu kontaktieren.

Mit freundlichen Grüßen,
Ihr ZOE Solar Team

📞 +49 30 12345678
📧 info@zoe-solar.de
🌐 https://zoe-solar.de
    `.trim();
  }

  /**
   * Personalisierte SMS generieren
   */
  private generatePersonalizedSMS(request: ReviewRequest): string {
    return `
Hallo ${request.customerName.split(' ')[0]},

wie zufrieden sind Sie mit Ihrer Solaranlage von ZOE Solar?

⭐ 2 Minuten für eine Bewertung:
https://g.page/zoe-solar/review

🎁 Dankeschön-Geschenk wartet auf Sie!

Danke für Ihr Vertrauen!
ZOE Solar Team
    `.trim();
  }

  /**
   * Review Response automatisch generieren und senden
   */
  async respondToReview(reviewData: {
    platform: string;
    rating: number;
    text: string;
    author: string;
  }): Promise<string> {
    let responseTemplate: string;

    if (reviewData.rating >= 4) {
      const templates = this.responseTemplates.get('positive') || [];
      responseTemplate = templates[Math.floor(Math.random() * templates.length)];
    } else if (reviewData.rating === 3) {
      const templates = this.responseTemplates.get('three_star') || [];
      responseTemplate = templates[Math.floor(Math.random() * templates.length)];
    } else {
      const templates = this.responseTemplates.get('negative') || [];
      responseTemplate = templates[Math.floor(Math.random() * templates.length)];
    }

    // Personalisierte Ergänzungen
    let personalizedResponse = responseTemplate;

    if (reviewData.text.includes('Service') || reviewData.text.includes('Beratung')) {
      personalizedResponse += '\n\nBesonders freut uns Ihr positives Feedback zu unserer Beratung und unserem Service.';
    }

    if (reviewData.text.includes('Installation') || reviewData.text.includes('Montage')) {
      personalizedResponse += '\n\nUnser Installations-Team arbeitet hart, um perfekte Ergebnisse zu liefern.';
    }

    if (reviewData.rating < 4) {
      personalizedResponse += '\n\nWir würden gerne verstehen, was wir besser machen können.';
    }

    // Speichere Review Response
    const response: ReviewResponse = {
      id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: '',
      platform: reviewData.platform,
      rating: reviewData.rating,
      text: reviewData.text,
      author: reviewData.author,
      date: new Date(),
      verified: true,
      helpful: 0,
      reply: {
        text: personalizedResponse,
        date: new Date(),
        author: 'ZOE Solar GmbH'
      }
    };

    this.reviewResponses.set(response.id, response);
    console.log(`💬 Review Response generiert für ${reviewData.author} (${reviewData.platform})`);

    return personalizedResponse;
  }

  /**
   * Review-Performance analysieren
   */
  analyzeReviewPerformance(): {
    summary: {
      totalReviews: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
      reviewsLast30Days: number;
      responseRate: number;
    };
    platforms: Array<{
      platform: string;
      reviewCount: number;
      averageRating: number;
      responseTime: string;
    }>;
    trends: {
      monthlyTrend: Array<{ month: string; reviews: number; rating: number }>;
      ratingTrend: 'improving' | 'stable' | 'declining';
      volumeTrend: 'increasing' | 'stable' | 'decreasing';
    };
    recommendations: string[];
  } {
    const allReviews = Array.from(this.reviewResponses.values());

    // Summary Statistics
    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0
      ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

    const ratingDistribution: Record<number, number> = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    allReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const reviewsLast30Days = allReviews.filter(r => r.date >= thirtyDaysAgo).length;

    const respondedReviews = allReviews.filter(r => r.reply).length;
    const responseRate = totalReviews > 0 ? Math.round((respondedReviews / totalReviews) * 100) : 0;

    // Platform Analysis
    const platformStats = new Map();
    allReviews.forEach(review => {
      if (!platformStats.has(review.platform)) {
        platformStats.set(review.platform, {
          count: 0,
          totalRating: 0,
          responded: 0
        });
      }

      const stats = platformStats.get(review.platform)!;
      stats.count++;
      stats.totalRating += review.rating;
      if (review.reply) stats.responded++;
    });

    const platforms = Array.from(platformStats.entries()).map(([platform, stats]) => ({
      platform,
      reviewCount: stats.count,
      averageRating: Math.round((stats.totalRating / stats.count) * 10) / 10,
      responseTime: stats.responded > 0 ? '<24h' : '>24h'
    }));

    // Trends Analysis
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTrend = this.generateMonthlyTrend();

    const ratingTrend = monthlyTrend.length > 1
      ? (monthlyTrend[monthlyTrend.length - 1].rating > monthlyTrend[monthlyTrend.length - 2].rating ? 'improving' :
         monthlyTrend[monthlyTrend.length - 1].rating < monthlyTrend[monthlyTrend.length - 2].rating ? 'declining' : 'stable')
      : 'stable';

    const volumeTrend = monthlyTrend.length > 1
      ? (monthlyTrend[monthlyTrend.length - 1].reviews > monthlyTrend[monthlyTrend.length - 2].reviews ? 'increasing' :
         monthlyTrend[monthlyTrend.length - 1].reviews < monthlyTrend[monthlyTrend.length - 2].reviews ? 'decreasing' : 'stable')
      : 'stable';

    // Recommendations
    const recommendations = [
      'Response Rate erhöhen: Alle Reviews innerhalb 24h beantworten',
      '3-Sterne Reviews proaktiv ansprechen und Verbesserungen anbieten',
      'Zufriedene Kunden aktiv um 5-Sterne-Bewertungen bitten',
      'Review-Incentives für höhere Conversion-Rates nutzen',
      'Google My Business Profile regelmäßig mit neuen Reviews aktualisieren'
    ];

    if (averageRating < 4.5) {
      recommendations.push('Durchschnittliche Bewertung durch Service-Verbesserungen erhöhen');
    }

    if (responseRate < 80) {
      recommendations.push('Response-Zeiten durch automatisierte Benachrichtigungen verbessern');
    }

    return {
      summary: {
        totalReviews,
        averageRating,
        ratingDistribution,
        reviewsLast30Days,
        responseRate
      },
      platforms,
      trends: {
        monthlyTrend,
        ratingTrend,
        volumeTrend
      },
      recommendations
    };
  }

  /**
   * Monatlichen Trend generieren
   */
  private generateMonthlyTrend(): Array<{ month: string; reviews: number; rating: number }> {
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthString = date.toISOString().slice(0, 7);

      // Simulierte Monatsdaten
      const reviews = Math.floor(Math.random() * 20) + 5;
      const rating = 4.2 + Math.random() * 0.7;

      months.push({
        month: monthString,
        reviews,
        rating: Math.round(rating * 10) / 10
      });
    }

    return months;
  }

  /**
   * Review-Generation-Kampagne erstellen
   */
  createReviewCampaign(options: {
    name: string;
    duration: number; // days
    targetCustomers: number;
    incentive: string;
    channels: string[];
  }): {
    campaignId: string;
    strategy: string;
    timeline: Array<{ day: number; action: string; channel: string }>;
    expectedResults: {
      reviewRequests: number;
      expectedReviews: number;
      expectedRating: number;
    };
  } {
    const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const timeline = [
      { day: 1, action: 'E-Mail Kampagne starten', channel: 'Email' },
      { day: 3, action: 'SMS Erinnerung', channel: 'SMS' },
      { day: 7, action: 'Follow-up Anruf', channel: 'Phone' },
      { day: 14, action: 'Zweite Erinnerung', channel: 'WhatsApp' },
      { day: 21, action: 'Final Reminder', channel: 'Email' }
    ];

    const strategy = `
Multi-Channel Review-Generation:
1. Initial E-Mail mit personalisiertem Inhalt
2. SMS Reminder nach 3 Tagen
3. Phone Follow-up nach 1 Woche
4. WhatsApp mit direkten Links nach 2 Wochen
5. Final E-Mail Reminder nach 3 Wochen
    `.trim();

    return {
      campaignId,
      strategy,
      timeline,
      expectedResults: {
        reviewRequests: options.targetCustomers,
        expectedReviews: Math.floor(options.targetCustomers * 0.35), // 35% Conversion
        expectedRating: 4.6
      }
    };
  }

  /**
   * KPIs und Metriken berechnen
   */
  calculateKPIs(): {
    reviewVelocity: number; // reviews per month
    averageRating: number;
    responseRate: number;
    conversionRate: number;
    npsScore: number; // Net Promoter Score
    sentimentScore: number; // Sentiment Analysis Score
  } {
    const allReviews = Array.from(this.reviewResponses.values());
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReviews = allReviews.filter(r => r.date >= thirtyDaysAgo);
    const reviewVelocity = recentReviews.length;

    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    const responseRate = allReviews.length > 0
      ? allReviews.filter(r => r.reply).length / allReviews.length
      : 0;

    const totalRequests = Array.from(this.reviewRequests.values()).length;
    const conversionRate = totalRequests > 0
      ? allReviews.length / totalRequests
      : 0;

    // NPS Calculation
    const promoters = allReviews.filter(r => r.rating >= 5).length;
    const detractors = allReviews.filter(r => r.rating <= 2).length;
    const npsScore = allReviews.length > 0
      ? ((promoters - detractors) / allReviews.length) * 100
      : 0;

    // Sentiment Score (simplified)
    const sentimentScore = averageRating * 20; // Convert 1-5 scale to 0-100

    return {
      reviewVelocity,
      averageRating: Math.round(averageRating * 10) / 10,
      responseRate: Math.round(responseRate * 100),
      conversionRate: Math.round(conversionRate * 100),
      npsScore: Math.round(npsScore),
      sentimentScore: Math.round(sentimentScore)
    };
  }
}

// Export als Singleton
export const reviewGenerationService = new ReviewGenerationService();
export default reviewGenerationService;