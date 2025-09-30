#!/usr/bin/env node

/**
 * Comprehensive SEO Monitoring Suite für ZOE Solar
 * Orchestriert alle SEO, GEO und AEO Monitoring-Komponenten
 */

const fs = require('fs');
const path = require('path');

// Importiere alle Monitoring-Module
const seoMonitoring = require('./seo-monitoring-suite.cjs');
const geoMonitoring = require('./geo-performance-tracker.cjs');
const aeoMonitoring = require('./aeo-entity-monitor.cjs');
const analyticsIntegration = require('./unified-analytics-integration.cjs');
const reportingSystem = require('./automated-reporting-system.cjs');

/**
 * Führt alle Monitoring-Komponenten sequentiell aus
 */
async function runComprehensiveMonitoring(options = {}) {
  const {
    skipSEO = false,
    skipGEO = false,
    skipAEO = false,
    skipAnalytics = false,
    skipReporting = false,
    reportType = 'weekly'
  } = options;

  console.log('🚀 Starte Comprehensive SEO Monitoring Suite...\n');
  console.log('='.repeat(60));

  const results = {
    timestamp: new Date().toISOString(),
    components: {},
    summary: {},
    errors: []
  };

  try {
    // 1. SEO Monitoring Dashboard
    if (!skipSEO) {
      console.log('\n📊 Phase 1: SEO Monitoring Dashboard');
      console.log('-'.repeat(40));
      try {
        results.components.seo = await seoMonitoring.runSEOMonitoringDashboard();
        console.log('✅ SEO Monitoring Dashboard erfolgreich abgeschlossen');
      } catch (error) {
        console.error('❌ Fehler bei SEO Monitoring:', error.message);
        results.errors.push({ component: 'SEO', error: error.message });
      }
    }

    // 2. GEO Performance Tracker
    if (!skipGEO) {
      console.log('\n🌍 Phase 2: GEO Performance Tracker');
      console.log('-'.repeat(40));
      try {
        results.components.geo = await geoMonitoring.runGEOPerformanceTracker();
        console.log('✅ GEO Performance Tracker erfolgreich abgeschlossen');
      } catch (error) {
        console.error('❌ Fehler bei GEO Monitoring:', error.message);
        results.errors.push({ component: 'GEO', error: error.message });
      }
    }

    // 3. AEO Entity Authority Monitor
    if (!skipAEO) {
      console.log('\n🎯 Phase 3: AEO Entity Authority Monitor');
      console.log('-'.repeat(40));
      try {
        results.components.aeo = await aeoMonitoring.runAEOEntityMonitor();
        console.log('✅ AEO Entity Authority Monitor erfolgreich abgeschlossen');
      } catch (error) {
        console.error('❌ Fehler bei AEO Monitoring:', error.message);
        results.errors.push({ component: 'AEO', error: error.message });
      }
    }

    // 4. Unified Analytics Integration
    if (!skipAnalytics) {
      console.log('\n📈 Phase 4: Unified Analytics Integration');
      console.log('-'.repeat(40));
      try {
        results.components.analytics = await analyticsIntegration.runUnifiedAnalyticsIntegration();
        console.log('✅ Unified Analytics Integration erfolgreich abgeschlossen');
      } catch (error) {
        console.error('❌ Fehler bei Analytics Integration:', error.message);
        results.errors.push({ component: 'Analytics', error: error.message });
      }
    }

    // 5. Automated Reporting System
    if (!skipReporting) {
      console.log('\n📋 Phase 5: Automated Reporting System');
      console.log('-'.repeat(40));
      try {
        results.components.reporting = await reportingSystem.runAutomatedReporting(reportType);
        console.log('✅ Automated Reporting System erfolgreich abgeschlossen');
      } catch (error) {
        console.error('❌ Fehler bei Automated Reporting:', error.message);
        results.errors.push({ component: 'Reporting', error: error.message });
      }
    }

    // Erstelle Gesamt-Zusammenfassung
    results.summary = generateComprehensiveSummary(results);

    // Speichere Gesamt-Ergebnisse
    const outputFile = path.join(__dirname, '..', 'data', 'comprehensive-monitoring-results.json');
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

    // Zeige finale Zusammenfassung
    console.log('\n🎉 Comprehensive SEO Monitoring Suite abgeschlossen!');
    console.log('='.repeat(60));
    console.log('\n📊 Gesamt-Zusammenfassung:');
    console.log(`  • Ausgeführte Komponenten: ${Object.keys(results.components).length}`);
    console.log(`  • Fehlerhafte Komponenten: ${results.errors.length}`);
    console.log(`  • Generierte Reports: ${results.summary.reportsGenerated || 0}`);

    if (results.errors.length > 0) {
      console.log('\n⚠️  Aufgetretene Fehler:');
      results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.component}: ${error.error}`);
      });
    }

    console.log(`\n💾 Ergebnisse gespeichert: ${outputFile}`);

    return results;

  } catch (error) {
    console.error('\n❌ Kritischer Fehler in Comprehensive Monitoring Suite:', error.message);
    throw error;
  }
}

/**
 * Generiert eine umfassende Zusammenfassung aller Ergebnisse
 */
function generateComprehensiveSummary(results) {
  const summary = {
    totalComponents: Object.keys(results.components).length,
    successfulComponents: 0,
    failedComponents: results.errors.length,
    reportsGenerated: 0,
    keyMetrics: {},
    alerts: [],
    recommendations: []
  };

  // Sammle Erfolgsstatistiken
  Object.keys(results.components).forEach(component => {
    summary.successfulComponents++;
  });

  // Sammle KPIs aus allen Komponenten
  if (results.components.seo) {
    summary.keyMetrics.seo = {
      avgPosition: results.components.seo.kpis?.avgPosition,
      organicTraffic: results.components.seo.kpis?.organicTraffic,
      conversions: results.components.seo.kpis?.conversions
    };
  }

  if (results.components.geo) {
    summary.keyMetrics.geo = {
      visibilityScore: results.components.geo.kpis?.avgVisibilityScore,
      localTraffic: results.components.geo.kpis?.totalLocalTraffic,
      gmbViews: results.components.geo.kpis?.totalGMBViews
    };
  }

  if (results.components.aeo) {
    summary.keyMetrics.aeo = {
      entityStrength: results.components.aeo.kpis?.avgEntityStrengthScore,
      featuredSnippets: results.components.aeo.kpis?.featuredSnippetsOwned,
      knowledgePanels: results.components.aeo.kpis?.knowledgePanelsPresent
    };
  }

  if (results.components.analytics) {
    summary.keyMetrics.analytics = {
      totalUsers: results.components.analytics.summary?.totalUsers,
      conversions: results.components.analytics.summary?.conversions,
      revenue: results.components.analytics.summary?.revenue
    };
  }

  // Sammle Alerts und Recommendations
  Object.values(results.components).forEach(component => {
    if (component.alerts) {
      summary.alerts.push(...component.alerts);
    }
    if (component.recommendations) {
      summary.recommendations.push(...component.recommendations);
    }
  });

  // Begrenze auf Top 10 pro Kategorie
  summary.alerts = summary.alerts.slice(0, 10);
  summary.recommendations = summary.recommendations.slice(0, 10);

  // Zähle generierte Reports
  if (results.components.reporting) {
    summary.reportsGenerated = 3; // Markdown, JSON, CSV
  }

  return summary;
}

/**
 * Führt wöchentliches Monitoring aus
 */
async function runWeeklyMonitoring() {
  console.log('📅 Starte wöchentliches SEO-Monitoring...\n');
  return await runComprehensiveMonitoring({ reportType: 'weekly' });
}

/**
 * Führt monatliches Monitoring aus
 */
async function runMonthlyMonitoring() {
  console.log('📅 Starte monatliches SEO-Monitoring...\n');
  return await runComprehensiveMonitoring({ reportType: 'monthly' });
}

/**
 * Führt schnelles Monitoring aus (nur kritische KPIs)
 */
async function runQuickMonitoring() {
  console.log('⚡ Starte schnelles SEO-Monitoring...\n');
  return await runComprehensiveMonitoring({
    skipReporting: true, // Keine Reports generieren
    reportType: 'quick'
  });
}

/**
 * Zeigt verfügbare Kommandozeilen-Optionen an
 */
function showHelp() {
  console.log(`
Comprehensive SEO Monitoring Suite für ZOE Solar

Verwendung:
  node comprehensive-seo-monitoring-suite.cjs [option]

Optionen:
  weekly      - Führt wöchentliches Monitoring aus (Standard)
  monthly     - Führt monatliches Monitoring aus
  quick       - Führt schnelles Monitoring ohne Reports aus
  help        - Zeigt diese Hilfe an

Beispiele:
  node comprehensive-seo-monitoring-suite.cjs weekly
  node comprehensive-seo-monitoring-suite.cjs monthly
  node comprehensive-seo-monitoring-suite.cjs quick

Das System führt folgende Komponenten aus:
  1. SEO Monitoring Dashboard
  2. GEO Performance Tracker
  3. AEO Entity Authority Monitor
  4. Unified Analytics Integration
  5. Automated Reporting System
`);
}

// Hauptlogik
if (require.main === module) {
  const command = process.argv[2] || 'weekly';

  switch (command) {
    case 'weekly':
      runWeeklyMonitoring().catch(console.error);
      break;
    case 'monthly':
      runMonthlyMonitoring().catch(console.error);
      break;
    case 'quick':
      runQuickMonitoring().catch(console.error);
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.error(`Unbekannte Option: ${command}`);
      console.log('Verwende "help" für verfügbare Optionen.');
      process.exit(1);
  }
}

// Export-Funktionen für andere Module
module.exports = {
  runComprehensiveMonitoring,
  runWeeklyMonitoring,
  runMonthlyMonitoring,
  runQuickMonitoring,
  generateComprehensiveSummary
};