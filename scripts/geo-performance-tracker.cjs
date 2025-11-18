#!/usr/bin/env node

/**
 * GEO Performance Tracker für ZOE Solar
 * Überwacht lokale Sichtbarkeit und Local Pack Rankings
 */

const fs = require('fs');
const path = require('path');

/**
 * Simuliert Local Pack Rankings für verschiedene Standorte
 */
function simulateLocalPackRankings(locations, businessName = 'ZOE Solar') {
  const rankings = {};

  locations.forEach(location => {
    const localKeywords = [
      `${businessName} ${location.city}`,
      `Solaranlage ${location.city}`,
      `Photovoltaik ${location.city}`,
      `Solarteur ${location.city}`,
      `PV Anlage ${location.city}`,
      `Solarinstallation ${location.city}`
    ];

    rankings[location.city] = {
      city: location.city,
      region: location.region,
      population: location.population,
      localPackRankings: {},
      visibilityScore: 0,
      competitorAnalysis: [],
      localTraffic: 0,
      gmbInsights: {},
      timestamp: new Date().toISOString()
    };

    localKeywords.forEach(keyword => {
      // Simuliere Local Pack Position (1-3 für Local Pack)
      const position = Math.floor(Math.random() * 3) + 1;
      const searchVolume = Math.round(location.population * 0.001 * (Math.random() * 2 + 0.5));

      rankings[location.city].localPackRankings[keyword] = {
        keyword,
        position,
        searchVolume,
        competition: Math.floor(Math.random() * 20) + 5, // Anzahl Konkurrenten
        ctr: position === 1 ? 0.45 : position === 2 ? 0.25 : 0.15,
        estimatedClicks: Math.round(searchVolume * (position === 1 ? 0.45 : position === 2 ? 0.25 : 0.15))
      };
    });

    // Berechne Visibility Score für die Stadt
    const avgPosition = Object.values(rankings[location.city].localPackRankings)
      .reduce((sum, k) => sum + k.position, 0) / localKeywords.length;
    rankings[location.city].visibilityScore = Math.max(0, (4 - avgPosition) / 3 * 100);

    // Simuliere lokale Traffic-Schätzung
    rankings[location.city].localTraffic = Object.values(rankings[location.city].localPackRankings)
      .reduce((sum, k) => sum + k.estimatedClicks, 0);

    // Simuliere Konkurrenz-Analyse
    const competitors = ['SolarTec GmbH', 'GreenEnergy Solutions', 'PV Meister', 'SunPower Installations'];
    rankings[location.city].competitorAnalysis = competitors.map(comp => ({
      name: comp,
      localPackPosition: Math.floor(Math.random() * 3) + 1,
      reviewCount: Math.floor(Math.random() * 200) + 50,
      rating: (Math.random() * 1 + 4).toFixed(1),
      websiteTraffic: Math.round(Math.random() * 5000 + 1000)
    }));

    // Simuliere GMB Insights
    rankings[location.city].gmbInsights = {
      totalViews: Math.round(Math.random() * 10000 + 5000),
      searchViews: Math.round(Math.random() * 8000 + 4000),
      mapViews: Math.round(Math.random() * 5000 + 2000),
      actions: {
        websiteClicks: Math.round(Math.random() * 500 + 100),
        directions: Math.round(Math.random() * 300 + 50),
        calls: Math.round(Math.random() * 200 + 30),
        reviews: Math.round(Math.random() * 50 + 10)
      },
      reviews: {
        total: Math.floor(Math.random() * 150 + 50),
        averageRating: (Math.random() * 1 + 4).toFixed(1),
        newReviews: Math.floor(Math.random() * 10 + 1)
      }
    };
  });

  return rankings;
}

/**
 * Berechnet GEO-KPIs
 */
function calculateGEO_KPIs(rankings) {
  const cities = Object.values(rankings);
  const totalLocations = cities.length;

  return {
    // Lokale Sichtbarkeits-KPIs
    avgVisibilityScore: cities.reduce((sum, city) => sum + city.visibilityScore, 0) / totalLocations,
    top3LocalPackCities: cities.filter(city => city.visibilityScore > 75).length,
    totalLocalTraffic: cities.reduce((sum, city) => sum + city.localTraffic, 0),

    // GMB Performance
    totalGMBViews: cities.reduce((sum, city) => sum + city.gmbInsights.totalViews, 0),
    totalGMBWebsiteClicks: cities.reduce((sum, city) => sum + city.gmbInsights.actions.websiteClicks, 0),
    totalGMBCalls: cities.reduce((sum, city) => sum + city.gmbInsights.actions.calls, 0),
    avgGMBRating: cities.reduce((sum, city) => sum + parseFloat(city.gmbInsights.reviews.averageRating), 0) / totalLocations,

    // Markt-Penetration
    marketCoverage: (cities.filter(city => city.visibilityScore > 50).length / totalLocations) * 100,
    highPotentialCities: cities.filter(city => city.population > 100000 && city.visibilityScore < 60).length,

    // Wettbewerbs-Analyse
    avgCompetitorRating: cities.reduce((sum, city) => {
      const avgCompRating = city.competitorAnalysis.reduce((s, c) => s + parseFloat(c.rating), 0) / city.competitorAnalysis.length;
      return sum + avgCompRating;
    }, 0) / totalLocations,

    timestamp: new Date().toISOString()
  };
}

/**
 * Generiert GEO-spezifische Empfehlungen
 */
function generateGEORcommendations(kpis, rankings) {
  const recommendations = [];

  if (kpis.avgVisibilityScore < 60) {
    recommendations.push({
      priority: 'high',
      category: 'local-seo',
      title: 'Lokale Sichtbarkeit verbessern',
      description: `Durchschnittliche Visibility Score: ${kpis.avgVisibilityScore.toFixed(1)}. Optimieren Sie GMB-Profile und lokale Keywords.`,
      impact: 'high',
      effort: 'medium',
      cities: Object.keys(rankings).filter(city => rankings[city].visibilityScore < 50)
    });
  }

  if (kpis.marketCoverage < 80) {
    recommendations.push({
      priority: 'medium',
      category: 'expansion',
      title: 'Marktabdeckung erweitern',
      description: `Aktuelle Marktabdeckung: ${kpis.marketCoverage.toFixed(1)}%. ${kpis.highPotentialCities} Städte haben hohes Potenzial.`,
      impact: 'high',
      effort: 'high'
    });
  }

  if (kpis.avgGMBRating < 4.5) {
    recommendations.push({
      priority: 'high',
      category: 'reputation',
      title: 'GMB-Bewertungen verbessern',
      description: `Durchschnittliche Bewertung: ${kpis.avgGMBRating.toFixed(1)}. Fordern Sie mehr Bewertungen und verbessern Sie Service.`,
      impact: 'high',
      effort: 'medium'
    });
  }

  // Stadt-spezifische Empfehlungen
  Object.entries(rankings).forEach(([city, data]) => {
    if (data.visibilityScore < 40) {
      recommendations.push({
        priority: 'medium',
        category: 'local-optimization',
        title: `Lokale Optimierung für ${city}`,
        description: `Visibility Score in ${city}: ${data.visibilityScore.toFixed(1)}. Fokus auf lokale Citations und GMB-Optimierung.`,
        impact: 'medium',
        effort: 'medium',
        city
      });
    }
  });

  return recommendations;
}

/**
 * Simuliert lokale Standorte für Deutschland
 */
function getGermanLocations() {
  return [
    { city: 'Berlin', region: 'Berlin', population: 3769000 },
    { city: 'Hamburg', region: 'Hamburg', population: 1841000 },
    { city: 'München', region: 'Bayern', population: 1484000 },
    { city: 'Köln', region: 'Nordrhein-Westfalen', population: 1086000 },
    { city: 'Frankfurt am Main', region: 'Hessen', population: 753000 },
    { city: 'Stuttgart', region: 'Baden-Württemberg', population: 635000 },
    { city: 'Düsseldorf', region: 'Nordrhein-Westfalen', population: 619000 },
    { city: 'Leipzig', region: 'Sachsen', population: 587000 },
    { city: 'Dortmund', region: 'Nordrhein-Westfalen', population: 588000 },
    { city: 'Essen', region: 'Nordrhein-Westfalen', population: 583000 },
    { city: 'Bremen', region: 'Bremen', population: 569000 },
    { city: 'Dresden', region: 'Sachsen', population: 556000 },
    { city: 'Hannover', region: 'Niedersachsen', population: 538000 },
    { city: 'Nürnberg', region: 'Bayern', population: 518000 },
    { city: 'Duisburg', region: 'Nordrhein-Westfalen', population: 498000 }
  ];
}

/**
 * Hauptfunktion für GEO Performance Tracker
 */
async function runGEOPerformanceTracker() {
  console.log('🌍 Initialisiere GEO Performance Tracker...\n');

  try {
    // Lade deutsche Standorte
    const locations = getGermanLocations();
    console.log(`📍 Analysiere ${locations.length} deutsche Städte...`);

    // Simuliere Local Pack Rankings
    const rankings = simulateLocalPackRankings(locations, 'ZOE Solar');
    console.log('✅ Local Pack Rankings simuliert');

    // Berechne GEO-KPIs
    const kpis = calculateGEO_KPIs(rankings);
    console.log('✅ GEO-KPIs berechnet');

    // Generiere Empfehlungen
    const recommendations = generateGEORcommendations(kpis, rankings);
    console.log(`✅ ${recommendations.length} GEO-Empfehlungen generiert`);

    // Erstelle GEO-Report
    const geoReport = {
      timestamp: new Date().toISOString(),
      kpis,
      rankings,
      recommendations,
      summary: {
        totalCities: locations.length,
        avgVisibilityScore: kpis.avgVisibilityScore,
        totalLocalTraffic: kpis.totalLocalTraffic,
        marketCoverage: kpis.marketCoverage,
        gmbPerformance: {
          totalViews: kpis.totalGMBViews,
          websiteClicks: kpis.totalGMBWebsiteClicks,
          calls: kpis.totalGMBCalls,
          avgRating: kpis.avgGMBRating
        },
        alerts: recommendations.filter(r => r.priority === 'high').length,
        opportunities: kpis.highPotentialCities
      }
    };

    // Speichere GEO-Report
    const geoFile = path.join(__dirname, '..', 'data', 'geo-performance-report.json');
    fs.writeFileSync(geoFile, JSON.stringify(geoReport, null, 2));

    // Zeige GEO-Zusammenfassung
    console.log('\n🌍 GEO Performance Zusammenfassung:');
    console.log(`  • Durchschnittliche Visibility Score: ${kpis.avgVisibilityScore.toFixed(1)}`);
    console.log(`  • Marktabdeckung: ${kpis.marketCoverage.toFixed(1)}%`);
    console.log(`  • Geschätzter lokaler Traffic: ${kpis.totalLocalTraffic.toLocaleString()} Klicks`);
    console.log(`  • GMB Views gesamt: ${kpis.totalGMBViews.toLocaleString()}`);
    console.log(`  • GMB Website-Klicks: ${kpis.totalGMBWebsiteClicks.toLocaleString()}`);
    console.log(`  • GMB Anrufe: ${kpis.totalGMBCalls.toLocaleString()}`);
    console.log(`  • Durchschnittliche GMB-Bewertung: ${kpis.avgGMBRating.toFixed(1)}`);
    console.log(`  • High-Potential Städte: ${kpis.highPotentialCities}`);
    console.log(`  • Kritische Alerts: ${geoReport.summary.alerts}`);

    console.log(`\n💾 GEO-Report gespeichert: ${geoFile}`);
    console.log('\n🎉 GEO Performance Tracker abgeschlossen!');

    return geoReport;

  } catch (error) {
    console.error('❌ Fehler beim GEO Performance Tracking:', error.message);
    throw error;
  }
}

// Export-Funktionen
module.exports = {
  runGEOPerformanceTracker,
  simulateLocalPackRankings,
  calculateGEO_KPIs,
  generateGEORcommendations,
  getGermanLocations
};

// Führe Tracker aus wenn direkt aufgerufen
if (require.main === module) {
  runGEOPerformanceTracker().catch(console.error);
}