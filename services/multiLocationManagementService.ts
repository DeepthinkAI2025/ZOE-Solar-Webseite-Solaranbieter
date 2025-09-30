import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';

export interface LocationHierarchy {
  id: string;
  name: string;
  type: 'country' | 'state' | 'region' | 'city' | 'district';
  parentId?: string;
  children: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  population?: number;
  marketSize?: number;
  solarPotential?: number;
  competitionLevel: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'planned';
  lastUpdated: string;
}

export interface LocationProfile {
  id: string;
  locationKey: string;
  hierarchyId: string;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    operatingHours: string[];
    services: string[];
    certifications: string[];
  };
  marketData: {
    population: number;
    averageIncome: number;
    solarAdoptionRate: number;
    energyCosts: number;
    roofTypes: string[];
    buildingAge: string;
  };
  competitorData: {
    totalCompetitors: number;
    majorCompetitors: Array<{
      name: string;
      marketShare: number;
      strengths: string[];
      weaknesses: string[];
    }>;
    marketGaps: string[];
  };
  performanceMetrics: {
    currentRankings: number;
    targetRankings: number;
    monthlyTraffic: number;
    conversionRate: number;
    roi: number;
  };
  contentStrategy: {
    primaryKeywords: string[];
    contentThemes: string[];
    publishingFrequency: string;
    localEvents: string[];
  };
  lastUpdated: string;
}

export interface LocationGroup {
  id: string;
  name: string;
  description: string;
  locationIds: string[];
  strategy: {
    contentType: string;
    targeting: string;
    budget: number;
    goals: string[];
  };
  performance: {
    totalTraffic: number;
    totalConversions: number;
    avgRanking: number;
    roi: number;
  };
  createdAt: string;
  lastUpdated: string;
}

export interface LocationOptimization {
  locationId: string;
  optimizationType: 'content' | 'technical' | 'local' | 'citation' | 'gmb';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedImpact: number;
  effort: 'low' | 'medium' | 'high';
  deadline: string;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

/**
 * Enterprise Multi-Location Management System
 * Zentrales Management aller 21+ Standorte mit Hierarchien, Profilen und Optimierungen
 */
export class MultiLocationManagementService {
  private locationHierarchy: Map<string, LocationHierarchy> = new Map();
  private locationProfiles: Map<string, LocationProfile> = new Map();
  private locationGroups: Map<string, LocationGroup> = new Map();
  private locationOptimizations: Map<string, LocationOptimization[]> = new Map();

  constructor() {
    this.initializeLocationHierarchy();
    this.initializeLocationProfiles();
    this.initializeLocationGroups();
    this.generateInitialOptimizations();
  }

  /**
   * Initialisiert die Standort-Hierarchie
   */
  private initializeLocationHierarchy(): void {
    // Deutschland als Root
    const germany: LocationHierarchy = {
      id: 'de',
      name: 'Deutschland',
      type: 'country',
      children: [],
      coordinates: { latitude: 51.1657, longitude: 10.4515 },
      population: 83000000,
      marketSize: 100,
      solarPotential: 85,
      competitionLevel: 'high',
      priority: 'critical',
      status: 'active',
      lastUpdated: new Date().toISOString()
    };

    // Bundesländer
    const states = [
      { id: 'nw', name: 'Nordrhein-Westfalen', coords: { lat: 51.4332, lng: 7.6616 }, pop: 17900000 },
      { id: 'by', name: 'Bayern', coords: { lat: 48.7904, lng: 11.4979 }, pop: 13100000 },
      { id: 'bw', name: 'Baden-Württemberg', coords: { lat: 48.6616, lng: 9.3501 }, pop: 11100000 },
      { id: 'he', name: 'Hessen', coords: { lat: 50.6521, lng: 9.1624 }, pop: 6280000 },
      { id: 'ni', name: 'Niedersachsen', coords: { lat: 52.6367, lng: 9.8451 }, pop: 7990000 },
      { id: 'rp', name: 'Rheinland-Pfalz', coords: { lat: 49.9131, lng: 7.3132 }, pop: 4090000 }
    ];

    states.forEach(state => {
      const stateHierarchy: LocationHierarchy = {
        id: state.id,
        name: state.name,
        type: 'state',
        parentId: 'de',
        children: [],
        coordinates: state.coords,
        population: state.pop,
        marketSize: Math.floor(Math.random() * 30) + 20,
        solarPotential: Math.floor(Math.random() * 20) + 75,
        competitionLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        priority: Math.random() > 0.8 ? 'critical' : Math.random() > 0.5 ? 'high' : 'medium',
        status: 'active',
        lastUpdated: new Date().toISOString()
      };

      germany.children.push(state.id);
      this.locationHierarchy.set(state.id, stateHierarchy);
    });

    this.locationHierarchy.set('de', germany);

    // Städte zu Bundesländern hinzufügen
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const stateId = this.getStateIdForCity(region.city);
      if (stateId) {
        const state = this.locationHierarchy.get(stateId);
        if (state) {
          const cityHierarchy: LocationHierarchy = {
            id: region.city.toLowerCase(),
            name: region.city,
            type: 'city',
            parentId: stateId,
            children: [],
            coordinates: { latitude: region.latitude, longitude: region.longitude },
            population: Math.floor(Math.random() * 500000) + 100000,
            marketSize: Math.floor(Math.random() * 20) + 5,
            solarPotential: Math.floor(Math.random() * 15) + 80,
            competitionLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
            priority: Math.random() > 0.8 ? 'critical' : Math.random() > 0.6 ? 'high' : 'medium',
            status: 'active',
            lastUpdated: new Date().toISOString()
          };

          state.children.push(region.city.toLowerCase());
          this.locationHierarchy.set(region.city.toLowerCase(), cityHierarchy);
        }
      }
    });
  }

  /**
   * Ermittelt Bundesland-ID für eine Stadt
   */
  private getStateIdForCity(city: string): string | null {
    const stateMapping: { [key: string]: string } = {
      'Berlin': 'be', 'Hamburg': 'hh', 'München': 'by', 'Köln': 'nw', 'Frankfurt': 'he',
      'Stuttgart': 'bw', 'Düsseldorf': 'nw', 'Dortmund': 'nw', 'Essen': 'nw', 'Leipzig': 'sn',
      'Bremen': 'hb', 'Dresden': 'sn', 'Hannover': 'ni', 'Nürnberg': 'by', 'Duisburg': 'nw',
      'Bochum': 'nw', 'Wuppertal': 'nw', 'Bielefeld': 'nw', 'Bonn': 'nw', 'Münster': 'nw'
    };

    return stateMapping[city] || null;
  }

  /**
   * Initialisiert Standort-Profile
   */
  private initializeLocationProfiles(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const profile: LocationProfile = {
        id: `profile_${region.city.toLowerCase()}`,
        locationKey: region.city.toLowerCase(),
        hierarchyId: region.city.toLowerCase(),
        businessInfo: {
          name: `ZOE Solar ${region.city}`,
          address: `Musterstraße 123, ${region.postalCode} ${region.city}`,
          phone: '+49-30-123-456-78',
          email: `${region.city.toLowerCase()}@zoe-solar.de`,
          website: `https://www.zoe-solar.de/standort/${region.city.toLowerCase()}`,
          operatingHours: ['Mo-Fr 08:00-17:00'],
          services: ['Photovoltaik', 'Solarthermie', 'Batteriespeicher', 'E-Mobilität'],
          certifications: ['TÜV', 'ISO 9001', 'Elektrofachbetrieb']
        },
        marketData: {
          population: Math.floor(Math.random() * 500000) + 100000,
          averageIncome: Math.floor(Math.random() * 20000) + 30000,
          solarAdoptionRate: Math.floor(Math.random() * 30) + 10,
          energyCosts: parseFloat((0.25 + Math.random() * 0.15).toFixed(2)),
          roofTypes: ['Satteldach', 'Flachdach', 'Pultdach'],
          buildingAge: '1960-1990'
        },
        competitorData: {
          totalCompetitors: Math.floor(Math.random() * 20) + 5,
          majorCompetitors: [
            {
              name: 'Konkurrent A',
              marketShare: Math.floor(Math.random() * 30) + 10,
              strengths: ['Lokale Präsenz', 'Preis'],
              weaknesses: ['Service', 'Qualität']
            },
            {
              name: 'Konkurrent B',
              marketShare: Math.floor(Math.random() * 25) + 5,
              strengths: ['Marketing', 'Online-Sichtbarkeit'],
              weaknesses: ['Lokale Kenntnisse']
            }
          ],
          marketGaps: ['Premium-Service', 'Nachhaltigkeitsberatung', 'Komplettlösungen']
        },
        performanceMetrics: {
          currentRankings: Math.floor(Math.random() * 20) + 5,
          targetRankings: 3,
          monthlyTraffic: Math.floor(Math.random() * 2000) + 500,
          conversionRate: parseFloat((2 + Math.random() * 3).toFixed(1)),
          roi: parseFloat((150 + Math.random() * 100).toFixed(0))
        },
        contentStrategy: {
          primaryKeywords: [
            `solaranlage ${region.city}`,
            `photovoltaik ${region.city}`,
            `solar ${region.city}`
          ],
          contentThemes: ['Solaranlagen', 'Energiewende', 'Förderungen', 'Fallstudien'],
          publishingFrequency: 'wöchentlich',
          localEvents: ['Energietage', 'Solar-Messen', 'Beratungstage']
        },
        lastUpdated: new Date().toISOString()
      };

      this.locationProfiles.set(region.city.toLowerCase(), profile);
    });
  }

  /**
   * Initialisiert Standort-Gruppen
   */
  private initializeLocationGroups(): void {
    const groups: LocationGroup[] = [
      {
        id: 'group_metropolitan',
        name: 'Metropolregionen',
        description: 'Großstädte mit hohem Marktpotenzial',
        locationIds: ['berlin', 'hamburg', 'muenchen', 'koeln', 'frankfurt'],
        strategy: {
          contentType: 'Premium',
          targeting: 'High-Value Customers',
          budget: 50000,
          goals: ['Marktführerschaft', 'Premium-Positionierung']
        },
        performance: {
          totalTraffic: 0,
          totalConversions: 0,
          avgRanking: 0,
          roi: 0
        },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'group_regional',
        name: 'Regionalzentren',
        description: 'Mittelstädte mit stabilem Wachstum',
        locationIds: ['stuttgart', 'duesseldorf', 'dortmund', 'essen', 'leipzig'],
        strategy: {
          contentType: 'Standard',
          targeting: 'Broad Market',
          budget: 25000,
          goals: ['Lokale Präsenz', 'Marktanteil']
        },
        performance: {
          totalTraffic: 0,
          totalConversions: 0,
          avgRanking: 0,
          roi: 0
        },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];

    groups.forEach(group => {
      this.locationGroups.set(group.id, group);
    });
  }

  /**
   * Generiert initiale Optimierungen
   */
  private generateInitialOptimizations(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const optimizations: LocationOptimization[] = [];

      // Content-Optimierungen
      optimizations.push({
        locationId: locationKey,
        optimizationType: 'content',
        priority: 'high',
        description: `Lokalen Content für ${region.city} erstellen und optimieren`,
        estimatedImpact: 25,
        effort: 'medium',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Technische Optimierungen
      optimizations.push({
        locationId: locationKey,
        optimizationType: 'technical',
        priority: 'medium',
        description: `Technische SEO für ${region.city} Standortseite optimieren`,
        estimatedImpact: 15,
        effort: 'low',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Lokale Optimierungen
      optimizations.push({
        locationId: locationKey,
        optimizationType: 'local',
        priority: 'high',
        description: `Lokale Sichtbarkeit in ${region.city} verbessern`,
        estimatedImpact: 30,
        effort: 'high',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      this.locationOptimizations.set(locationKey, optimizations);
    });
  }

  /**
   * Standort-Hierarchie abrufen
   */
  public getLocationHierarchy(): LocationHierarchy[] {
    return Array.from(this.locationHierarchy.values());
  }

  /**
   * Standort-Profil abrufen
   */
  public getLocationProfile(locationKey: string): LocationProfile | null {
    return this.locationProfiles.get(locationKey) || null;
  }

  /**
   * Alle Standort-Profile abrufen
   */
  public getAllLocationProfiles(): LocationProfile[] {
    return Array.from(this.locationProfiles.values());
  }

  /**
   * Standort-Gruppen abrufen
   */
  public getLocationGroups(): LocationGroup[] {
    return Array.from(this.locationGroups.values());
  }

  /**
   * Standorte nach Gruppe filtern
   */
  public getLocationsByGroup(groupId: string): LocationProfile[] {
    const group = this.locationGroups.get(groupId);
    if (!group) return [];

    return group.locationIds
      .map(id => this.locationProfiles.get(id))
      .filter(profile => profile !== undefined) as LocationProfile[];
  }

  /**
   * Optimierungen für Standort abrufen
   */
  public getLocationOptimizations(locationKey: string): LocationOptimization[] {
    return this.locationOptimizations.get(locationKey) || [];
  }

  /**
   * Neue Optimierung erstellen
   */
  public createOptimization(optimization: Omit<LocationOptimization, 'createdAt'>): LocationOptimization {
    const newOptimization: LocationOptimization = {
      ...optimization,
      createdAt: new Date().toISOString()
    };

    const existingOptimizations = this.locationOptimizations.get(optimization.locationId) || [];
    existingOptimizations.push(newOptimization);
    this.locationOptimizations.set(optimization.locationId, existingOptimizations);

    return newOptimization;
  }

  /**
   * Optimierung aktualisieren
   */
  public updateOptimization(locationKey: string, optimizationId: string, updates: Partial<LocationOptimization>): boolean {
    const optimizations = this.locationOptimizations.get(locationKey);
    if (!optimizations) return false;

    const index = optimizations.findIndex(opt => opt.createdAt === optimizationId);
    if (index === -1) return false;

    optimizations[index] = { ...optimizations[index], ...updates };
    return true;
  }

  /**
   * Standort-Profil aktualisieren
   */
  public updateLocationProfile(locationKey: string, updates: Partial<LocationProfile>): boolean {
    const profile = this.locationProfiles.get(locationKey);
    if (!profile) return false;

    this.locationProfiles.set(locationKey, {
      ...profile,
      ...updates,
      lastUpdated: new Date().toISOString()
    });

    return true;
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalLocations: number;
    activeLocations: number;
    totalGroups: number;
    pendingOptimizations: number;
    highPriorityOptimizations: number;
    avgPerformanceScore: number;
    topPerformingLocations: Array<{location: string, score: number}>;
    optimizationStatus: { [key: string]: number };
  } {
    const allProfiles = Array.from(this.locationProfiles.values());
    const allOptimizations = Array.from(this.locationOptimizations.values()).flat();

    const activeLocations = allProfiles.filter(p => {
      const hierarchy = this.locationHierarchy.get(p.hierarchyId);
      return hierarchy?.status === 'active';
    }).length;

    const pendingOptimizations = allOptimizations.filter(opt => opt.status === 'pending').length;
    const highPriorityOptimizations = allOptimizations.filter(opt =>
      opt.status === 'pending' && (opt.priority === 'high' || opt.priority === 'critical')
    ).length;

    const avgPerformanceScore = allProfiles.reduce((sum, profile) =>
      sum + profile.performanceMetrics.currentRankings, 0
    ) / allProfiles.length;

    const topPerformingLocations = allProfiles
      .map(profile => ({
        location: profile.locationKey,
        score: profile.performanceMetrics.currentRankings
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    const optimizationStatus = {
      pending: allOptimizations.filter(opt => opt.status === 'pending').length,
      in_progress: allOptimizations.filter(opt => opt.status === 'in_progress').length,
      completed: allOptimizations.filter(opt => opt.status === 'completed').length,
      cancelled: allOptimizations.filter(opt => opt.status === 'cancelled').length
    };

    return {
      totalLocations: allProfiles.length,
      activeLocations,
      totalGroups: this.locationGroups.size,
      pendingOptimizations,
      highPriorityOptimizations,
      avgPerformanceScore: Math.round(avgPerformanceScore * 10) / 10,
      topPerformingLocations,
      optimizationStatus
    };
  }

  /**
   * Standort nach Kriterien suchen
   */
  public searchLocations(criteria: {
    state?: string;
    minPopulation?: number;
    maxCompetition?: 'low' | 'medium' | 'high';
    minPriority?: 'low' | 'medium' | 'high' | 'critical';
  }): LocationProfile[] {
    return Array.from(this.locationProfiles.values()).filter(profile => {
      const hierarchy = this.locationHierarchy.get(profile.hierarchyId);

      if (criteria.state && hierarchy?.parentId !== criteria.state) return false;
      if (criteria.minPopulation && profile.marketData.population < criteria.minPopulation) return false;
      if (criteria.maxCompetition) {
        const compLevel = hierarchy?.competitionLevel;
        if (compLevel === 'high' && criteria.maxCompetition !== 'high') return false;
        if (compLevel === 'medium' && criteria.maxCompetition === 'low') return false;
      }
      if (criteria.minPriority) {
        const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        const profilePriority = hierarchy?.priority || 'low';
        if (priorityOrder[profilePriority] < priorityOrder[criteria.minPriority]) return false;
      }

      return true;
    });
  }

  /**
   * Neue Standort-Gruppe erstellen
   */
  public createLocationGroup(group: Omit<LocationGroup, 'id' | 'createdAt' | 'lastUpdated'>): LocationGroup {
    const newGroup: LocationGroup = {
      ...group,
      id: `group_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    this.locationGroups.set(newGroup.id, newGroup);
    return newGroup;
  }

  /**
   * Standort zu Gruppe hinzufügen
   */
  public addLocationToGroup(locationKey: string, groupId: string): boolean {
    const group = this.locationGroups.get(groupId);
    if (!group || group.locationIds.includes(locationKey)) return false;

    group.locationIds.push(locationKey);
    group.lastUpdated = new Date().toISOString();
    return true;
  }

  /**
   * Performance-Metriken aktualisieren
   */
  public updatePerformanceMetrics(locationKey: string, metrics: Partial<LocationProfile['performanceMetrics']>): boolean {
    const profile = this.locationProfiles.get(locationKey);
    if (!profile) return false;

    profile.performanceMetrics = { ...profile.performanceMetrics, ...metrics };
    profile.lastUpdated = new Date().toISOString();
    return true;
  }
}

// Singleton-Instanz für globale Verwendung
export const multiLocationManagementService = new MultiLocationManagementService();