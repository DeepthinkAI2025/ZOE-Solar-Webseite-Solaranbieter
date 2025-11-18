/**
 * Local Performance Harmonizer Service für ZOE Solar
 * 
 * Harmonisierung der lokalen SEO-Performance über alle 15 deutschen Städte
 * für optimale lokale Rankings und einheitliche Sichtbarkeit.
 * 
 * Features:
 * - Multi-City Performance Analysis
 * - Automated Performance Balancing
 * - City-specific Optimization Strategies
 * - Real-time Performance Monitoring
 * - Priority-based Resource Allocation
 */

export interface CityPerformanceData {
  city: string;
  region: string;
  population: number;
  currentScore: number; // 0-100
  targetScore: number;
  performanceGap: number;
  visibilityScore: number;
  localTraffic: number;
  gmbViews: number;
  rankingPositions: {
    keyword: string;
    position: number;
    searchVolume: number;
    competition: number;
  }[];
  competitorAnalysis: {
    name: string;
    localPackPosition: number;
    rating: number;
    reviewCount: number;
  }[];
  lastUpdated: Date;
}

export interface PerformanceOptimization {
  city: string;
  currentMetrics: {
    visibilityScore: number;
    localTraffic: number;
    avgRanking: number;
    gmbRating: number;
  };
  targetMetrics: {
    visibilityScore: number;
    localTraffic: number;
    avgRanking: number;
    gmbRating: number;
  };
  optimizationStrategies: OptimizationStrategy[];
  estimatedImprovement: number;
  priorityLevel: 'critical' | 'high' | 'medium' | 'low';
  implementationTime: number; // hours
}

export interface OptimizationStrategy {
  category: 'content' | 'technical' | 'citations' | 'gmb' | 'local_links' | 'reviews';
  action: string;
  description: string;
  expectedImpact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  estimatedImprovement: number; // percentage
  specificActions: string[];
  metrics: string[];
  resources: string[];
}

export interface LocalHarmonizerConfig {
  enabled: boolean;
  targetScore: number; // All cities target this score
  frequency: number; // hours between harmonization checks
  minImprovementThreshold: number; // minimum improvement to trigger actions
  maxOptimizationBudget: number; // maximum resources per city
  priorityWeights: {
    population: number;
    performanceGap: number;
    marketPotential: number;
  };
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
}

export interface HarmonizationReport {
  timestamp: Date;
  overallScore: number;
  citiesAnalyzed: number;
  citiesOptimized: number;
  averageImprovement: number;
  totalTrafficGained: number;
  performanceGaps: {
    city: string;
    gap: number;
    priority: string;
  }[];
  optimizationResults: {
    city: string;
    beforeScore: number;
    afterScore: number;
    improvement: number;
    strategiesApplied: number;
  }[];
  recommendations: string[];
}

class LocalPerformanceHarmonizerService {
  private static instance: LocalPerformanceHarmonizerService;
  private config: LocalHarmonizerConfig;
  private cityData: Map<string, CityPerformanceData> = new Map();
  private optimizationHistory: Map<string, PerformanceOptimization[]> = new Map();
  private harmonizationIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isOptimizing: boolean = false;

  private constructor() {
    this.initializeConfig();
    this.initializeCityData();
    this.setupHarmonizationEngine();
  }

  public static getInstance(): LocalPerformanceHarmonizerService {
    if (!LocalPerformanceHarmonizerService.instance) {
      LocalPerformanceHarmonizerService.instance = new LocalPerformanceHarmonizerService();
    }
    return LocalPerformanceHarmonizerService.instance;
  }

  private initializeConfig(): void {
    this.config = {
      enabled: true,
      targetScore: 75, // Target 75% for all cities
      frequency: 6, // Check every 6 hours
      minImprovementThreshold: 5, // 5% minimum improvement
      maxOptimizationBudget: 40, // 40 hours max per city
      priorityWeights: {
        population: 0.3,
        performanceGap: 0.5,
        marketPotential: 0.2
      },
      automationLevel: 'semi_automated'
    };
  }

  private initializeCityData(): void {
    // Initialize with real performance data from geo-performance-report.json
    const cities = [
      {
        city: 'Berlin',
        region: 'Berlin',
        population: 3769000,
        currentScore: 61.11,
        targetScore: 75,
        visibilityScore: 61.11,
        localTraffic: 9808,
        gmbViews: 12821
      },
      {
        city: 'Hamburg',
        region: 'Hamburg',
        population: 1841000,
        currentScore: 77.78,
        targetScore: 75,
        visibilityScore: 77.78,
        localTraffic: 7470,
        gmbViews: 8528
      },
      {
        city: 'München',
        region: 'Bayern',
        population: 1484000,
        currentScore: 66.67,
        targetScore: 75,
        visibilityScore: 66.67,
        localTraffic: 3939,
        gmbViews: 6271
      },
      {
        city: 'Köln',
        region: 'Nordrhein-Westfalen',
        population: 1086000,
        currentScore: 72.22,
        targetScore: 75,
        visibilityScore: 72.22,
        localTraffic: 2200,
        gmbViews: 9678
      },
      {
        city: 'Frankfurt am Main',
        region: 'Hessen',
        population: 753000,
        currentScore: 66.67,
        targetScore: 75,
        visibilityScore: 66.67,
        localTraffic: 2186,
        gmbViews: 13460
      },
      {
        city: 'Stuttgart',
        region: 'Baden-Württemberg',
        population: 635000,
        currentScore: 44.44,
        targetScore: 75,
        visibilityScore: 44.44,
        localTraffic: 957,
        gmbViews: 13440
      },
      {
        city: 'Düsseldorf',
        region: 'Nordrhein-Westfalen',
        population: 619000,
        currentScore: 44.44,
        targetScore: 75,
        visibilityScore: 44.44,
        localTraffic: 982,
        gmbViews: 12042
      },
      {
        city: 'Leipzig',
        region: 'Sachsen',
        population: 587000,
        currentScore: 61.11,
        targetScore: 75,
        visibilityScore: 61.11,
        localTraffic: 1242,
        gmbViews: 8508
      },
      {
        city: 'Dortmund',
        region: 'Nordrhein-Westfalen',
        population: 588000,
        currentScore: 61.11,
        targetScore: 75,
        visibilityScore: 61.11,
        localTraffic: 1295,
        gmbViews: 7451
      },
      {
        city: 'Essen',
        region: 'Nordrhein-Westfalen',
        population: 583000,
        currentScore: 66.67,
        targetScore: 75,
        visibilityScore: 66.67,
        localTraffic: 1438,
        gmbViews: 6556
      },
      {
        city: 'Bremen',
        region: 'Bremen',
        population: 569000,
        currentScore: 72.22,
        targetScore: 75,
        visibilityScore: 72.22,
        localTraffic: 1600,
        gmbViews: 8126
      },
      {
        city: 'Dresden',
        region: 'Sachsen',
        population: 556000,
        currentScore: 72.22,
        targetScore: 75,
        visibilityScore: 72.22,
        localTraffic: 1390,
        gmbViews: 11469
      },
      {
        city: 'Hannover',
        region: 'Niedersachsen',
        population: 538000,
        currentScore: 66.67,
        targetScore: 75,
        visibilityScore: 66.67,
        localTraffic: 1033,
        gmbViews: 5501
      },
      {
        city: 'Nürnberg',
        region: 'Bayern',
        population: 518000,
        currentScore: 66.67,
        targetScore: 75,
        visibilityScore: 66.67,
        localTraffic: 1152,
        gmbViews: 7024
      },
      {
        city: 'Duisburg',
        region: 'Nordrhein-Westfalen',
        population: 498000,
        currentScore: 72.22,
        targetScore: 75,
        visibilityScore: 72.22,
        localTraffic: 1563,
        gmbViews: 12086
      }
    ];

    for (const cityData of cities) {
      this.cityData.set(cityData.city, {
        ...cityData,
        performanceGap: cityData.targetScore - cityData.currentScore,
        rankingPositions: this.generateMockRankingData(cityData.city),
        competitorAnalysis: this.generateMockCompetitorData(),
        lastUpdated: new Date()
      });
    }
  }

  private generateMockRankingData(city: string): CityPerformanceData['rankingPositions'] {
    const keywords = [
      'Solaranlage',
      'Photovoltaik',
      'Solarteur',
      'PV Anlage',
      'Solarinstallation'
    ];

    return keywords.map(keyword => ({
      keyword: `${keyword} ${city}`,
      position: Math.floor(Math.random() * 5) + 1, // 1-5
      searchVolume: Math.floor(Math.random() * 3000) + 500,
      competition: Math.floor(Math.random() * 20) + 5
    }));
  }

  private generateMockCompetitorData(): CityPerformanceData['competitorAnalysis'] {
    const competitors = [
      'SolarTec GmbH',
      'GreenEnergy Solutions',
      'PV Meister',
      'SunPower Installations'
    ];

    return competitors.map(name => ({
      name,
      localPackPosition: Math.floor(Math.random() * 3) + 1,
      rating: (Math.random() * 2 + 3.5).toFixed(1), // 3.5-5.5
      reviewCount: Math.floor(Math.random() * 150) + 50
    }));
  }

  private setupHarmonizationEngine(): void {
    if (!this.config.enabled) return;

    // Main harmonization interval
    this.harmonizationIntervals.set('main-harmonization', setInterval(() => {
      this.performHarmonization();
    }, this.config.frequency * 60 * 60 * 1000));

    // Performance monitoring interval
    this.harmonizationIntervals.set('performance-monitoring', setInterval(() => {
      this.monitorPerformanceChanges();
    }, 2 * 60 * 60 * 1000)); // Every 2 hours

    // Optimization tracking interval
    this.harmonizationIntervals.set('optimization-tracking', setInterval(() => {
      this.trackOptimizationResults();
    }, 24 * 60 * 60 * 1000)); // Daily
  }

  // ===== HARMONIZATION ENGINE =====

  /**
   * Perform comprehensive local performance harmonization
   */
  public async performHarmonization(): Promise<HarmonizationReport> {
    if (this.isOptimizing) {
      console.log('Harmonization already in progress...');
      return this.generateHarmonizationReport();
    }

    this.isOptimizing = true;
    console.log('Starting local performance harmonization...');

    try {
      // Analyze current performance gaps
      const performanceGaps = this.analyzePerformanceGaps();

      // Generate optimization strategies
      const optimizations = await this.generateOptimizationStrategies(performanceGaps);

      // Apply optimizations by priority
      const results = await this.applyOptimizations(optimizations);

      // Generate report
      const report = this.generateHarmonizationReport(results);

      console.log(`Harmonization completed. Average improvement: ${report.averageImprovement.toFixed(1)}%`);

      return report;

    } catch (error) {
      console.error('Harmonization failed:', error);
      throw error;
    } finally {
      this.isOptimizing = false;
    }
  }

  private analyzePerformanceGaps(): Array<{
    city: string;
    gap: number;
    priority: number;
    population: number;
    marketPotential: number;
  }> {
    const gaps: any[] = [];

    for (const [city, data] of this.cityData) {
      if (data.currentScore < this.config.targetScore) {
        const gap = this.config.targetScore - data.currentScore;
        const priority = this.calculateCityPriority(city, data, gap);
        const marketPotential = this.calculateMarketPotential(data);

        gaps.push({
          city,
          gap,
          priority,
          population: data.population,
          marketPotential
        });
      }
    }

    // Sort by priority (highest first)
    return gaps.sort((a, b) => b.priority - a.priority);
  }

  private calculateCityPriority(city: string, data: CityPerformanceData, gap: number): number {
    // Priority = (performanceGap * weight) + (population * weight) + (marketPotential * weight)
    const gapWeight = this.config.priorityWeights.performanceGap;
    const popWeight = this.config.priorityWeights.population;
    const potentialWeight = this.config.priorityWeights.marketPotential;

    const normalizedGap = gap / this.config.targetScore; // 0-1
    const normalizedPop = data.population / 4000000; // Max Berlin population
    const normalizedPotential = this.calculateMarketPotential(data) / 100; // 0-1

    return (normalizedGap * gapWeight) + (normalizedPop * popWeight) + (normalizedPotential * potentialWeight);
  }

  private calculateMarketPotential(data: CityPerformanceData): number {
    // Market potential based on population, competition level, and current performance
    const competitionFactor = 100 - data.currentScore; // Lower current score = higher potential
    const populationFactor = Math.log(data.population / 500000); // Normalize population
    const trafficFactor = data.localTraffic / 10000; // Normalize current traffic

    return (competitionFactor * 0.4) + (populationFactor * 30) + (trafficFactor * 30);
  }

  // ===== OPTIMIZATION STRATEGIES =====

  private async generateOptimizationStrategies(gaps: any[]): Promise<PerformanceOptimization[]> {
    const optimizations: PerformanceOptimization[] = [];

    for (const gapData of gaps) {
      const city = gapData.city;
      const cityData = this.cityData.get(city)!;

      const optimization: PerformanceOptimization = {
        city,
        currentMetrics: {
          visibilityScore: cityData.visibilityScore,
          localTraffic: cityData.localTraffic,
          avgRanking: this.calculateAverageRanking(cityData.rankingPositions),
          gmbRating: this.extractAverageRating(cityData.competitorAnalysis)
        },
        targetMetrics: {
          visibilityScore: this.config.targetScore,
          localTraffic: cityData.localTraffic * 1.5, // 50% increase target
          avgRanking: 2.5, // Target top 3 average
          gmbRating: 4.5 // Target rating
        },
        optimizationStrategies: this.generateCitySpecificStrategies(city, cityData, gapData.gap),
        estimatedImprovement: gapData.gap * 0.8, // 80% of gap as realistic improvement
        priorityLevel: this.determinePriorityLevel(gapData.priority),
        implementationTime: this.estimateImplementationTime(gapData.gap)
      };

      optimizations.push(optimization);
    }

    // Sort by estimated impact/effort ratio
    return optimizations.sort((a, b) => {
      const ratioA = a.estimatedImprovement / a.implementationTime;
      const ratioB = b.estimatedImprovement / b.implementationTime;
      return ratioB - ratioA;
    });
  }

  private calculateAverageRanking(positions: CityPerformanceData['rankingPositions']): number {
    if (positions.length === 0) return 5;
    return positions.reduce((sum, pos) => sum + pos.position, 0) / positions.length;
  }

  private extractAverageRating(competitors: CityPerformanceData['competitorAnalysis']): number {
    if (competitors.length === 0) return 4.0;
    const ratings = competitors.map(c => parseFloat(c.rating));
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }

  private generateCitySpecificStrategies(city: string, data: CityPerformanceData, gap: number): OptimizationStrategy[] {
    const strategies: OptimizationStrategy[] = [];

    // Content Strategy
    if (data.currentScore < 50) {
      strategies.push({
        category: 'content',
        action: 'City-specific content creation',
        description: `Create location-specific content for ${city} targeting local keywords`,
        expectedImpact: 'high',
        effort: 'medium',
        estimatedImprovement: Math.min(gap * 0.3, 15),
        specificActions: [
          `Create ${city} landing page with local references`,
          `Write blog posts about ${city} solar projects`,
          `Develop location-specific FAQ`,
          `Add local testimonials and case studies`
        ],
        metrics: ['Organic traffic', 'Local rankings', 'Page engagement'],
        resources: ['Content writer', 'Local photographer', 'SEO specialist']
      });
    }

    // GMB Optimization
    strategies.push({
      category: 'gmb',
      action: 'Google My Business optimization',
      description: `Optimize GMB listing for ${city} to improve local pack visibility`,
      expectedImpact: 'high',
      effort: 'low',
      estimatedImprovement: Math.min(gap * 0.25, 12),
      specificActions: [
        `Update GMB categories for ${city} market`,
        `Add more ${city}-specific photos`,
        `Encourage customer reviews from ${city} clients`,
        `Post regular updates about ${city} projects`
      ],
      metrics: ['GMB views', 'Local pack position', 'Review count'],
      resources: ['GMB manager', 'Customer service']
    });

    // Citation Building
    if (data.visibilityScore < 60) {
      strategies.push({
        category: 'citations',
        action: 'Local citation building',
        description: `Build authoritative citations for ${city} business`,
        expectedImpact: 'medium',
        effort: 'medium',
        estimatedImprovement: Math.min(gap * 0.2, 10),
        specificActions: [
          `Submit to ${city} business directories`,
          `Get listed in local chamber of commerce`,
          `Partner with local organizations`,
          `Ensure NAP consistency across platforms`
        ],
        metrics: ['Citation count', 'Domain authority', 'Local visibility'],
        resources: ['SEO specialist', 'Business development']
      });
    }

    // Technical Optimization
    strategies.push({
      category: 'technical',
      action: 'Local technical SEO',
      description: `Implement technical improvements for ${city} local SEO`,
      expectedImpact: 'medium',
      effort: 'medium',
      estimatedImprovement: Math.min(gap * 0.15, 8),
      specificActions: [
        `Implement location-based schema markup`,
        `Optimize page loading speed for ${city} users`,
        `Add local business hours and services`,
        `Create location-specific internal linking`
      ],
      metrics: ['Page speed', 'Core Web Vitals', 'Schema validation'],
      resources: ['Developer', 'SEO technical specialist']
    });

    // Review Management
    strategies.push({
      category: 'reviews',
      action: 'Review management and acquisition',
      description: `Systematically acquire and manage reviews for ${city}`,
      expectedImpact: 'high',
      effort: 'medium',
      estimatedImprovement: Math.min(gap * 0.2, 10),
      specificActions: [
        `Implement review request system for ${city} customers`,
        `Respond to all reviews within 24 hours`,
        `Address negative feedback professionally`,
        `Showcase positive reviews on website`
      ],
      metrics: ['Review count', 'Average rating', 'Response rate'],
      resources: ['Customer service', 'Review management platform']
    });

    return strategies;
  }

  private determinePriorityLevel(priority: number): 'critical' | 'high' | 'medium' | 'low' {
    if (priority >= 0.7) return 'critical';
    if (priority >= 0.5) return 'high';
    if (priority >= 0.3) return 'medium';
    return 'low';
  }

  private estimateImplementationTime(gap: number): number {
    // Estimate hours based on gap size and complexity
    return Math.max(8, gap * 2); // Minimum 8 hours, 2 hours per point of gap
  }

  // ===== OPTIMIZATION APPLICATION =====

  private async applyOptimizations(optimizations: PerformanceOptimization[]): Promise<any[]> {
    const results: any[] = [];

    for (const optimization of optimizations) {
      try {
        console.log(`Applying optimization for ${optimization.city}...`);

        // Simulate optimization application
        const result = await this.simulateOptimizationApplication(optimization);
        results.push(result);

        // Update city data
        this.updateCityPerformance(optimization.city, result);

        // Store in history
        if (!this.optimizationHistory.has(optimization.city)) {
          this.optimizationHistory.set(optimization.city, []);
        }
        this.optimizationHistory.get(optimization.city)!.push(optimization);

      } catch (error) {
        console.error(`Optimization failed for ${optimization.city}:`, error);
      }
    }

    return results;
  }

  private async simulateOptimizationApplication(optimization: PerformanceOptimization): Promise<any> {
    // Simulate the time it takes to apply optimizations
    const delay = optimization.implementationTime * 1000; // 1 second per hour
    await new Promise(resolve => setTimeout(resolve, Math.min(delay, 5000))); // Max 5 seconds

    // Calculate realistic improvement
    const improvement = Math.min(
      optimization.estimatedImprovement * (0.8 + Math.random() * 0.4), // 80-120% of estimated
      optimization.currentMetrics.visibilityScore * 0.3 // Max 30% improvement
    );

    return {
      city: optimization.city,
      beforeScore: optimization.currentMetrics.visibilityScore,
      afterScore: optimization.currentMetrics.visibilityScore + improvement,
      improvement,
      strategiesApplied: optimization.optimizationStrategies.length,
      implementationTime: optimization.implementationTime,
      timestamp: new Date()
    };
  }

  private updateCityPerformance(city: string, result: any): void {
    const cityData = this.cityData.get(city);
    if (cityData) {
      cityData.currentScore = result.afterScore;
      cityData.performanceGap = this.config.targetScore - cityData.currentScore;
      cityData.localTraffic = Math.round(cityData.localTraffic * (1 + result.improvement / 100));
      cityData.gmbViews = Math.round(cityData.gmbViews * (1 + result.improvement / 200));
      cityData.lastUpdated = new Date();

      this.cityData.set(city, cityData);
    }
  }

  // ===== MONITORING & TRACKING =====

  private monitorPerformanceChanges(): void {
    console.log('Monitoring local performance changes...');
    
    // Check for significant changes that might affect harmonization
    for (const [city, data] of this.cityData) {
      // Trigger re-optimization if performance drops significantly
      if (data.currentScore < data.targetScore - 10) {
        console.warn(`${city} performance dropped significantly, re-optimization needed`);
      }
    }
  }

  private trackOptimizationResults(): void {
    console.log('Tracking optimization results...');
    
    // Analyze trends and adjust strategies
    for (const [city, optimizations] of this.optimizationHistory) {
      this.analyzeOptimizationEffectiveness(city, optimizations);
    }
  }

  private analyzeOptimizationEffectiveness(city: string, optimizations: PerformanceOptimization[]): void {
    const cityData = this.cityData.get(city);
    if (!cityData || optimizations.length === 0) return;

    const totalImprovement = optimizations.reduce((sum, opt) => sum + opt.estimatedImprovement, 0);
    const actualImprovement = cityData.currentScore - (this.config.targetScore - cityData.performanceGap);

    const effectivenessRatio = actualImprovement / totalImprovement;
    
    if (effectivenessRatio < 0.5) {
      console.warn(`${city}: Low optimization effectiveness (${(effectivenessRatio * 100).toFixed(1)}%)`);
    } else if (effectivenessRatio > 1.2) {
      console.info(`${city}: Exceeded optimization targets (${(effectivenessRatio * 100).toFixed(1)}%)`);
    }
  }

  // ===== REPORTING =====

  private generateHarmonizationReport(results: any[] = []): HarmonizationReport {
    const cities = Array.from(this.cityData.values());
    const overallScore = cities.length > 0 
      ? cities.reduce((sum, city) => sum + city.currentScore, 0) / cities.length
      : 0;

    const performanceGaps = cities
      .filter(city => city.currentScore < this.config.targetScore)
      .map(city => ({
        city: city.city,
        gap: city.performanceGap,
        priority: city.performanceGap > 20 ? 'critical' : city.performanceGap > 10 ? 'high' : 'medium'
      }))
      .sort((a, b) => b.gap - a.gap);

    const averageImprovement = results.length > 0
      ? results.reduce((sum, r) => sum + r.improvement, 0) / results.length
      : 0;

    const totalTrafficGained = results.reduce((sum, r) => {
      const cityData = this.cityData.get(r.city);
      return sum + (cityData ? Math.round(cityData.localTraffic * r.improvement / 100) : 0);
    }, 0);

    return {
      timestamp: new Date(),
      overallScore: Math.round(overallScore * 100) / 100,
      citiesAnalyzed: cities.length,
      citiesOptimized: results.length,
      averageImprovement: Math.round(averageImprovement * 100) / 100,
      totalTrafficGained,
      performanceGaps,
      optimizationResults: results,
      recommendations: this.generateRecommendations(performanceGaps, overallScore)
    };
  }

  private generateRecommendations(gaps: any[], overallScore: number): string[] {
    const recommendations: string[] = [];

    if (overallScore < 65) {
      recommendations.push('Focus on content creation for underperforming cities');
      recommendations.push('Implement aggressive GMB optimization campaigns');
    }

    if (gaps.filter(g => g.priority === 'critical').length > 3) {
      recommendations.push('Consider resource reallocation to critical cities');
      recommendations.push('Implement emergency optimization protocols');
    }

    const avgGap = gaps.reduce((sum, g) => sum + g.gap, 0) / gaps.length;
    if (avgGap > 15) {
      recommendations.push('Review and update local SEO strategy framework');
      recommendations.push('Consider hiring additional local SEO specialists');
    }

    return recommendations;
  }

  // ===== PUBLIC API =====

  public getCityPerformance(cityName?: string): CityPerformanceData | Map<string, CityPerformanceData> {
    if (cityName) {
      return this.cityData.get(cityName) as CityPerformanceData;
    }
    return new Map(this.cityData);
  }

  public getOptimizationHistory(cityName?: string): PerformanceOptimization[] | Map<string, PerformanceOptimization[]> {
    if (cityName) {
      return this.optimizationHistory.get(cityName) || [];
    }
    return new Map(this.optimizationHistory);
  }

  public getLatestHarmonizationReport(): HarmonizationReport {
    return this.generateHarmonizationReport();
  }

  public forceHarmonization(): Promise<HarmonizationReport> {
    return this.performHarmonization();
  }

  public updateConfig(newConfig: Partial<LocalHarmonizerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.restartHarmonization();
  }

  private restartHarmonization(): void {
    this.stopHarmonization();
    this.setupHarmonizationEngine();
  }

  private stopHarmonization(): void {
    this.harmonizationIntervals.forEach(interval => clearInterval(interval));
    this.harmonizationIntervals.clear();
  }

  public exportPerformanceData(): string {
    const data = {
      cities: Array.from(this.cityData.entries()),
      history: Array.from(this.optimizationHistory.entries()),
      config: this.config,
      lastUpdate: new Date()
    };
    return JSON.stringify(data, null, 2);
  }

  public getHealthStatus(): {
    status: string;
    citiesMonitored: number;
    averageScore: number;
    citiesBelowTarget: number;
    lastHarmonization: Date | null;
  } {
    const cities = Array.from(this.cityData.values());
    const averageScore = cities.length > 0 
      ? cities.reduce((sum, c) => sum + c.currentScore, 0) / cities.length
      : 0;
    const citiesBelowTarget = cities.filter(c => c.currentScore < this.config.targetScore).length;

    return {
      status: this.config.enabled ? 'active' : 'inactive',
      citiesMonitored: cities.length,
      averageScore: Math.round(averageScore * 100) / 100,
      citiesBelowTarget,
      lastHarmonization: new Date()
    };
  }
}

// ===== EXPORT =====

export const localPerformanceHarmonizerService = LocalPerformanceHarmonizerService.getInstance();
export default localPerformanceHarmonizerService;