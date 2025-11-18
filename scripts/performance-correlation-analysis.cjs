#!/usr/bin/env node

/**
 * Performance Correlation Analysis für ZOE Solar
 * Analysiert Zusammenhänge zwischen SEO, GEO und AEO Performance
 */

const fs = require('fs');
const path = require('path');

console.log('📊 Starting Performance Correlation Analysis...\n');

/**
 * Berechnet Pearson-Korrelation zwischen zwei Datensätzen
 */
function calculatePearsonCorrelation(x, y) {
  if (x.length !== y.length) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Berechnet Spearman-Rangkorrelation
 */
function calculateSpearmanCorrelation(x, y) {
  if (x.length !== y.length) return 0;

  // Erstelle Ranglisten
  const xRanks = getRanks(x);
  const yRanks = getRanks(y);

  return calculatePearsonCorrelation(xRanks, yRanks);
}

/**
 * Hilfsfunktion für Rangberechnung
 */
function getRanks(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return arr.map(val => sorted.indexOf(val) + 1);
}

/**
 * Interpretiert Korrelationskoeffizient
 */
function interpretCorrelation(corr) {
  const absCorr = Math.abs(corr);
  if (absCorr >= 0.8) return { strength: 'stark', direction: corr > 0 ? 'positiv' : 'negativ' };
  if (absCorr >= 0.6) return { strength: 'moderat', direction: corr > 0 ? 'positiv' : 'negativ' };
  if (absCorr >= 0.3) return { strength: 'schwach', direction: corr > 0 ? 'positiv' : 'negativ' };
  return { strength: 'keine', direction: 'neutral' };
}

/**
 * Analysiert Cross-Strategy Korrelationen
 */
function analyzeCrossStrategyCorrelations(seoData, geoData, aeoData) {
  console.log('🔗 Analysiere Cross-Strategy Korrelationen...');

  const correlations = {
    seo_geo: {
      organicTraffic_localTraffic: 0,
      visibilityScore_localTraffic: 0,
      conversions_gmbClicks: 0
    },
    seo_aeo: {
      organicTraffic_entityAuthority: 0,
      visibilityScore_knowledgeGraph: 0,
      conversions_socialProof: 0
    },
    geo_aeo: {
      localTraffic_entityAuthority: 0,
      gmbRating_citationConsistency: 0,
      visibilityScore_socialProof: 0
    }
  };

  // SEO vs GEO Korrelationen
  if (seoData && geoData) {
    correlations.seo_geo.organicTraffic_localTraffic = calculatePearsonCorrelation(
      [seoData.kpis.organicTraffic],
      [geoData.kpis.totalLocalTraffic]
    );

    correlations.seo_geo.visibilityScore_localTraffic = calculatePearsonCorrelation(
      [seoData.kpis.visibilityScore],
      [geoData.kpis.totalLocalTraffic]
    );
  }

  // SEO vs AEO Korrelationen
  if (seoData && aeoData) {
    correlations.seo_aeo.organicTraffic_entityAuthority = calculatePearsonCorrelation(
      [seoData.kpis.organicTraffic],
      [aeoData.currentMetrics?.competitorAuthorityGap || 85]
    );

    correlations.seo_aeo.visibilityScore_knowledgeGraph = calculatePearsonCorrelation(
      [seoData.kpis.visibilityScore],
      [aeoData.currentMetrics?.knowledgeGraphVisibility || 85]
    );
  }

  // GEO vs AEO Korrelationen
  if (geoData && aeoData) {
    correlations.geo_aeo.localTraffic_entityAuthority = calculatePearsonCorrelation(
      [geoData.kpis.totalLocalTraffic],
      [aeoData.currentMetrics?.competitorAuthorityGap || 85]
    );

    correlations.geo_aeo.gmbRating_citationConsistency = calculatePearsonCorrelation(
      [geoData.kpis.avgGMBRating],
      [aeoData.currentMetrics?.citationIndexScore || 92]
    );
  }

  return correlations;
}

/**
 * Generiert Korrelations-Insights
 */
function generateCorrelationInsights(correlations) {
  const insights = [];

  // SEO-GEO Insights
  const seoGeoTraffic = interpretCorrelation(correlations.seo_geo.organicTraffic_localTraffic);
  if (seoGeoTraffic.strength !== 'keine') {
    insights.push({
      type: 'seo-geo-synergy',
      title: `${seoGeoTraffic.strength.charAt(0).toUpperCase() + seoGeoTraffic.strength.slice(1)}e Korrelation: SEO Traffic ↔ GEO Traffic`,
      description: `Organischer Traffic und lokaler Traffic zeigen eine ${seoGeoTraffic.strength}e ${seoGeoTraffic.direction}e Korrelation (${correlations.seo_geo.organicTraffic_localTraffic.toFixed(2)}). ${seoGeoTraffic.direction === 'positiv' ? 'Verbessern Sie beide Bereiche gleichzeitig für maximale Wirkung.' : 'Balancieren Sie Investitionen zwischen nationaler und lokaler Sichtbarkeit.'}`,
      impact: seoGeoTraffic.strength === 'stark' ? 'high' : 'medium',
      recommendation: seoGeoTraffic.direction === 'positiv' ?
        'Integrieren Sie lokale Keywords in nationale SEO-Strategie' :
        'Trennen Sie Budgets für SEO und GEO-Optimierungen'
    });
  }

  // SEO-AEO Insights
  const seoAeoAuthority = interpretCorrelation(correlations.seo_aeo.organicTraffic_entityAuthority);
  if (seoAeoAuthority.strength !== 'keine') {
    insights.push({
      type: 'seo-aeo-synergy',
      title: `${seoAeoAuthority.strength.charAt(0).toUpperCase() + seoAeoAuthority.strength.slice(1)}e Korrelation: SEO Traffic ↔ Entity Authority`,
      description: `Organischer Traffic und Entity Authority korrelieren ${seoAeoAuthority.strength} ${seoAeoAuthority.direction} (${correlations.seo_aeo.organicTraffic_entityAuthority.toFixed(2)}). ${seoAeoAuthority.direction === 'positiv' ? 'AEO-Optimierungen verstärken SEO-Erfolge.' : 'Fokussieren Sie sich auf einen Bereich mit höherer ROI.'}`,
      impact: seoAeoAuthority.strength === 'stark' ? 'high' : 'medium',
      recommendation: seoAeoAuthority.direction === 'positiv' ?
        'Kombinieren Sie SEO mit AEO-Strategien für Authority-Aufbau' :
        'Priorisieren Sie entweder SEO oder AEO basierend auf Ressourcen'
    });
  }

  // GEO-AEO Insights
  const geoAeoConsistency = interpretCorrelation(correlations.geo_aeo.gmbRating_citationConsistency);
  if (geoAeoConsistency.strength !== 'keine') {
    insights.push({
      type: 'geo-aeo-synergy',
      title: `${geoAeoConsistency.strength.charAt(0).toUpperCase() + geoAeoConsistency.strength.slice(1)}e Korrelation: GMB Rating ↔ Citation Consistency`,
      description: `GMB-Bewertungen und Citation-Konsistenz zeigen eine ${geoAeoConsistency.strength}e ${geoAeoConsistency.direction}e Korrelation (${correlations.geo_aeo.gmbRating_citationConsistency.toFixed(2)}). ${geoAeoConsistency.direction === 'positiv' ? 'Konsistente Citations verbessern lokale Bewertungen.' : 'Überprüfen Sie Citation-Management-Strategien.'}`,
      impact: geoAeoConsistency.strength === 'stark' ? 'high' : 'medium',
      recommendation: geoAeoConsistency.direction === 'positiv' ?
        'Automatisieren Sie Citation-Updates für bessere lokale Bewertungen' :
        'Überarbeiten Sie Citation-Strategie für bessere Konsistenz'
    });
  }

  return insights;
}

/**
 * Berechnet Strategie-Effizienz-Scores
 */
function calculateStrategyEfficiency(seoData, geoData, aeoData) {
  const efficiency = {
    seo: {
      trafficPerInvestment: 0, // Simuliert
      conversionEfficiency: 0,
      scalabilityScore: 0
    },
    geo: {
      localReachEfficiency: 0,
      conversionPerLocation: 0,
      marketPenetrationScore: 0
    },
    aeo: {
      authorityGrowthRate: 0,
      brandAmplification: 0,
      trustBuildingEfficiency: 0
    }
  };

  // SEO Effizienz
  if (seoData) {
    efficiency.seo.trafficPerInvestment = seoData.kpis.organicTraffic / 1000; // Simuliert pro 1000€ Investment
    efficiency.seo.conversionEfficiency = seoData.kpis.conversions / seoData.kpis.organicTraffic;
    efficiency.seo.scalabilityScore = Math.min(seoData.kpis.visibilityScore / 10, 10); // 0-10 Skala
  }

  // GEO Effizienz
  if (geoData) {
    efficiency.geo.localReachEfficiency = geoData.kpis.totalLocalTraffic / geoData.kpis.totalLocations;
    efficiency.geo.marketPenetrationScore = geoData.kpis.marketCoverage;
  }

  // AEO Effizienz
  if (aeoData) {
    efficiency.aeo.authorityGrowthRate = aeoData.currentMetrics?.entityAuthorityGrowth || 12.5;
    efficiency.aeo.brandAmplification = (aeoData.currentMetrics?.brandSearchImpressions || 125000) / 100000;
  }

  return efficiency;
}

/**
 * Generiert strategische Handlungsempfehlungen
 */
function generateStrategicRecommendations(correlations, efficiency, insights) {
  const recommendations = [];

  // Finde stärkste Korrelationen
  const strongCorrelations = Object.entries(correlations).filter(([key, value]) => {
    return Object.values(value).some(corr => Math.abs(corr) >= 0.7);
  });

  if (strongCorrelations.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'strategy-integration',
      title: 'Starke Strategie-Synergien nutzen',
      description: `${strongCorrelations.length} starke Korrelationen zwischen Strategien identifiziert. Integrieren Sie diese Bereiche für maximale Effizienz.`,
      actions: [
        'Erstellen Sie integrierte Kampagnen-Pläne',
        'Teilen Sie Budgets basierend auf Korrelationsstärke',
        'Implementieren Sie Cross-Strategy KPIs'
      ]
    });
  }

  // Effizienz-basierte Empfehlungen
  const mostEfficient = Object.entries(efficiency).reduce((max, [key, value]) => {
    const score = Object.values(value).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
    return score > max.score ? { strategy: key, score } : max;
  }, { strategy: '', score: 0 });

  if (mostEfficient.strategy) {
    recommendations.push({
      priority: 'medium',
      category: 'resource-allocation',
      title: `Fokus auf ${mostEfficient.strategy.toUpperCase()}-Effizienz`,
      description: `${mostEfficient.strategy.toUpperCase()} zeigt die höchste Effizienz. Investieren Sie mehr Ressourcen in diesen Bereich.`,
      actions: [
        `Erhöhen Sie ${mostEfficient.strategy.toUpperCase()}-Budget um 20%`,
        `Replizieren Sie erfolgreiche ${mostEfficient.strategy.toUpperCase()}-Taktiken`,
        `Nutzen Sie ${mostEfficient.strategy.toUpperCase()}-Erfolge für andere Strategien`
      ]
    });
  }

  return recommendations;
}

/**
 * Hauptfunktion für Performance Correlation Analysis
 */
async function runPerformanceCorrelationAnalysis() {
  console.log('🔬 Initialisiere Performance Correlation Analysis...\n');

  try {
    // Lade historische Daten
    console.log('📈 Lade historische Performance-Daten...');

    let seoData = null;
    let geoData = null;
    let aeoData = null;

    try {
      seoData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'seo-dashboard.json'), 'utf8'));
    } catch (error) {
      console.log('⚠️  SEO-Daten nicht verfügbar');
    }

    try {
      geoData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'geo-performance-report.json'), 'utf8'));
    } catch (error) {
      console.log('⚠️  GEO-Daten nicht verfügbar');
    }

    try {
      aeoData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'aeo-entity-report.json'), 'utf8'));
    } catch (error) {
      console.log('⚠️  AEO-Daten nicht verfügbar');
    }

    // Analysiere Korrelationen
    const correlations = analyzeCrossStrategyCorrelations(seoData, geoData, aeoData);
    console.log('✅ Korrelationen analysiert');

    // Generiere Insights
    const insights = generateCorrelationInsights(correlations);
    console.log(`✅ ${insights.length} Korrelations-Insights generiert`);

    // Berechne Effizienz
    const efficiency = calculateStrategyEfficiency(seoData, geoData, aeoData);
    console.log('✅ Strategie-Effizienz berechnet');

    // Generiere strategische Empfehlungen
    const recommendations = generateStrategicRecommendations(correlations, efficiency, insights);
    console.log(`✅ ${recommendations.length} strategische Empfehlungen generiert`);

    // Erstelle Analyse-Bericht
    const analysisReport = {
      timestamp: new Date().toISOString(),
      correlations,
      insights,
      efficiency,
      recommendations,
      summary: {
        totalInsights: insights.length,
        strongCorrelations: Object.values(correlations).reduce((count, strategy) => {
          return count + Object.values(strategy).filter(corr => Math.abs(corr) >= 0.7).length;
        }, 0),
        mostEfficientStrategy: Object.entries(efficiency).reduce((max, [key, value]) => {
          const score = Object.values(value).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
          return score > max.score ? { strategy: key, score } : max;
        }, { strategy: 'none', score: 0 }).strategy,
        nextAnalysisDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

    // Speichere Analyse-Bericht
    const reportFile = path.join(__dirname, '..', 'data', 'correlation-analysis-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(analysisReport, null, 2));

    // Zeige Zusammenfassung
    console.log('\n📊 Correlation Analysis Zusammenfassung:');
    console.log(`  • Starke Korrelationen identifiziert: ${analysisReport.summary.strongCorrelations}`);
    console.log(`  • Korrelations-Insights: ${analysisReport.summary.totalInsights}`);
    console.log(`  • Effizienteste Strategie: ${analysisReport.summary.mostEfficientStrategy.toUpperCase()}`);
    console.log(`  • Nächste Analyse: ${analysisReport.summary.nextAnalysisDate.split('T')[0]}`);

    console.log(`\n💾 Correlation Analysis Report gespeichert: ${reportFile}`);
    console.log('\n🎉 Performance Correlation Analysis abgeschlossen!');

    return analysisReport;

  } catch (error) {
    console.error('❌ Fehler bei Correlation Analysis:', error.message);
    throw error;
  }
}

// Export-Funktionen
module.exports = {
  runPerformanceCorrelationAnalysis,
  calculatePearsonCorrelation,
  calculateSpearmanCorrelation,
  analyzeCrossStrategyCorrelations,
  generateCorrelationInsights
};

// Führe Analyse aus wenn direkt aufgerufen
if (require.main === module) {
  runPerformanceCorrelationAnalysis().catch(console.error);
}