#!/usr/bin/env node

/**
 * Enhanced Alert System für ZOE Solar Strategy Monitoring
 * Überwacht Performance-Abweichungen und generiert Benachrichtigungen
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 Starting Enhanced Alert System...\n');

/**
 * Alert-Konfiguration
 */
const ALERT_THRESHOLDS = {
  seo: {
    positionDrop: 3, // Positionen
    trafficDropPercent: 15, // Prozent
    conversionDropPercent: 20, // Prozent
    bounceRateIncrease: 10 // Prozentpunkte
  },
  geo: {
    visibilityDropPercent: 20,
    trafficDropPercent: 25,
    ratingDrop: 0.5 // Sterne
  },
  aeo: {
    authorityDropPercent: 10,
    consistencyDropPercent: 15,
    visibilityDropPercent: 20
  },
  correlations: {
    correlationChangeThreshold: 0.3, // Korrelationsänderung
    synergyBreakThreshold: 0.5 // Synergie-Bruch
  },
  ai: {
    offlineThreshold: 2, // Alerts wenn Plattform 2+ Checks offline
    errorRateThreshold: 50, // Alert bei >50% Fehler-Rate
    responseTimeThreshold: 30000, // Alert bei >30s Response Time
    contentAccessibilityThreshold: 3 // Alert wenn Content 3+ Checks nicht zugänglich
  },
};

/**
 * Alert-Typen
 */
const ALERT_TYPES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info'
};

/**
 * Generiert SEO-Alerts
 */
function generateSEOAlerts(currentData, previousData) {
  const alerts = [];

  if (!currentData || !previousData) return alerts;

  // Position Drop Alert
  if (currentData.kpis.avgPosition > previousData.kpis.avgPosition + ALERT_THRESHOLDS.seo.positionDrop) {
    alerts.push({
      id: `seo-position-${Date.now()}`,
      type: ALERT_TYPES.HIGH,
      strategy: 'SEO',
      category: 'ranking',
      title: 'Signifikanter Ranking-Verlust',
      message: `Durchschnittliche Position fiel von ${previousData.kpis.avgPosition.toFixed(1)} auf ${currentData.kpis.avgPosition.toFixed(1)}`,
      value: currentData.kpis.avgPosition - previousData.kpis.avgPosition,
      threshold: ALERT_THRESHOLDS.seo.positionDrop,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Überprüfen Sie technische SEO-Probleme',
        'Analysieren Sie Konkurrenz-Aktivitäten',
        'Optimieren Sie Content für betroffene Keywords'
      ]
    });
  }

  // Traffic Drop Alert
  const trafficChangePercent = ((currentData.kpis.organicTraffic - previousData.kpis.organicTraffic) / previousData.kpis.organicTraffic) * 100;
  if (trafficChangePercent < -ALERT_THRESHOLDS.seo.trafficDropPercent) {
    alerts.push({
      id: `seo-traffic-${Date.now()}`,
      type: ALERT_TYPES.CRITICAL,
      strategy: 'SEO',
      category: 'traffic',
      title: 'Kritischer Traffic-Verlust',
      message: `Organischer Traffic sank um ${Math.abs(trafficChangePercent).toFixed(1)}% auf ${currentData.kpis.organicTraffic.toLocaleString()} Sessions`,
      value: trafficChangePercent,
      threshold: -ALERT_THRESHOLDS.seo.trafficDropPercent,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Überprüfen Sie Google Algorithmus-Updates',
        'Analysieren Sie Crawling-Probleme',
        'Stellen Sie Content-Qualität sicher'
      ]
    });
  }

  // Conversion Drop Alert
  const conversionChangePercent = ((currentData.kpis.conversions - previousData.kpis.conversions) / previousData.kpis.conversions) * 100;
  if (conversionChangePercent < -ALERT_THRESHOLDS.seo.conversionDropPercent) {
    alerts.push({
      id: `seo-conversion-${Date.now()}`,
      type: ALERT_TYPES.HIGH,
      strategy: 'SEO',
      category: 'conversion',
      title: 'Conversion-Verlust',
      message: `Conversions sanken um ${Math.abs(conversionChangePercent).toFixed(1)}% auf ${currentData.kpis.conversions}`,
      value: conversionChangePercent,
      threshold: -ALERT_THRESHOLDS.seo.conversionDropPercent,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Überprüfen Sie Conversion Funnel',
        'Testen Sie Call-to-Action Elemente',
        'Analysieren Sie User Experience'
      ]
    });
  }

  return alerts;
}

/**
 * Generiert GEO-Alerts
 */
function generateGEOAlerts(currentData, previousData) {
  const alerts = [];

  if (!currentData || !previousData) return alerts;

  // Visibility Drop Alert
  const visibilityChangePercent = ((currentData.kpis.avgVisibilityScore - previousData.kpis.avgVisibilityScore) / previousData.kpis.avgVisibilityScore) * 100;
  if (visibilityChangePercent < -ALERT_THRESHOLDS.geo.visibilityDropPercent) {
    alerts.push({
      id: `geo-visibility-${Date.now()}`,
      type: ALERT_TYPES.HIGH,
      strategy: 'GEO',
      category: 'visibility',
      title: 'Lokale Sichtbarkeit gesunken',
      message: `Visibility Score sank um ${Math.abs(visibilityChangePercent).toFixed(1)}% auf ${currentData.kpis.avgVisibilityScore.toFixed(1)}%`,
      value: visibilityChangePercent,
      threshold: -ALERT_THRESHOLDS.geo.visibilityDropPercent,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Überprüfen Sie GMB-Profile',
        'Aktualisieren Sie lokale Citations',
        'Optimieren Sie Local Pack Keywords'
      ]
    });
  }

  // Rating Drop Alert
  if (currentData.kpis.avgGMBRating < previousData.kpis.avgGMBRating - ALERT_THRESHOLDS.geo.ratingDrop) {
    alerts.push({
      id: `geo-rating-${Date.now()}`,
      type: ALERT_TYPES.MEDIUM,
      strategy: 'GEO',
      category: 'reputation',
      title: 'GMB-Bewertung gesunken',
      message: `Durchschnittliche Bewertung fiel von ${previousData.kpis.avgGMBRating.toFixed(1)} auf ${currentData.kpis.avgGMBRating.toFixed(1)} Sterne`,
      value: currentData.kpis.avgGMBRating - previousData.kpis.avgGMBRating,
      threshold: -ALERT_THRESHOLDS.geo.ratingDrop,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Fordern Sie Kundenbewertungen an',
        'Verbessern Sie Service-Qualität',
        'Reagieren Sie auf negative Bewertungen'
      ]
    });
  }

  return alerts;
}

/**
 * Generiert AEO-Alerts
 */
function generateAEOAlerts(currentData, previousData) {
  const alerts = [];

  if (!currentData || !previousData) return alerts;

  // Authority Drop Alert
  const authorityChangePercent = ((currentData.currentMetrics?.competitorAuthorityGap - previousData.currentMetrics?.competitorAuthorityGap) / previousData.currentMetrics?.competitorAuthorityGap) * 100;
  if (authorityChangePercent < -ALERT_THRESHOLDS.aeo.authorityDropPercent) {
    alerts.push({
      id: `aeo-authority-${Date.now()}`,
      type: ALERT_TYPES.HIGH,
      strategy: 'AEO',
      category: 'authority',
      title: 'Entity Authority gesunken',
      message: `Authority Score sank um ${Math.abs(authorityChangePercent).toFixed(1)}%`,
      value: authorityChangePercent,
      threshold: -ALERT_THRESHOLDS.aeo.authorityDropPercent,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Überprüfen Sie Knowledge Graph Presence',
        'Aktualisieren Sie strukturierte Daten',
        'Stärken Sie Social Proof'
      ]
    });
  }

  return alerts;
}

/**
 * Generiert AI Platform Alerts
 */
function generateAIPlatformAlerts(currentData, previousData) {
  const alerts = [];

  if (!currentData || !currentData.platforms) return alerts;

  // Überprüfe jede Plattform
  Object.entries(currentData.platforms).forEach(([platformKey, platformData]) => {
    const platformName = platformData.name || platformKey;

    // Offline Alert
    if (platformData.status === 'offline') {
      alerts.push({
        id: `ai-offline-${platformKey}-${Date.now()}`,
        type: ALERT_TYPES.HIGH,
        strategy: 'AI_PLATFORM',
        category: 'availability',
        title: `AI-Plattform ${platformName} offline`,
        message: `${platformName} ist nicht erreichbar. Status: ${platformData.status}`,
        value: 0, // Offline = 0
        threshold: 1, // Sollte online sein = 1
        timestamp: new Date().toISOString(),
        platform: platformKey,
        recommendations: [
          'Überprüfe Netzwerkverbindung',
          'Kontaktiere Plattform-Support',
          'Überwache API-Status der Plattform',
          'Implementiere alternative Suchstrategien'
        ]
      });
    }

    // Error Rate Alert
    if (platformData.performance && platformData.performance.errors.length > 0) {
      const errorRate = (platformData.performance.errors.length / platformData.performance.attempts) * 100;
      if (errorRate > ALERT_THRESHOLDS.ai.errorRateThreshold) {
        alerts.push({
          id: `ai-error-rate-${platformKey}-${Date.now()}`,
          type: ALERT_TYPES.MEDIUM,
          strategy: 'AI_PLATFORM',
          category: 'reliability',
          title: `Hohe Fehler-Rate bei ${platformName}`,
          message: `Fehler-Rate von ${errorRate.toFixed(1)}% bei ${platformData.performance.attempts} Versuchen`,
          value: errorRate,
          threshold: ALERT_THRESHOLDS.ai.errorRateThreshold,
          timestamp: new Date().toISOString(),
          platform: platformKey,
          recommendations: [
            'Überprüfe API-Konfiguration',
            'Implementiere bessere Error Handling',
            'Erhöhe Retry-Limits',
            'Kontaktiere API-Provider bei persistenten Fehlern'
          ]
        });
      }
    }

    // Response Time Alert
    if (platformData.performance && platformData.performance.responseTime > ALERT_THRESHOLDS.ai.responseTimeThreshold) {
      alerts.push({
        id: `ai-response-time-${platformKey}-${Date.now()}`,
        type: ALERT_TYPES.MEDIUM,
        strategy: 'AI_PLATFORM',
        category: 'performance',
        title: `Langsame Response-Zeit bei ${platformName}`,
        message: `Response-Zeit von ${platformData.performance.responseTime}ms überschreitet Grenzwert`,
        value: platformData.performance.responseTime,
        threshold: ALERT_THRESHOLDS.ai.responseTimeThreshold,
        timestamp: new Date().toISOString(),
        platform: platformKey,
        recommendations: [
          'Optimiere API-Calls',
          'Implementiere Caching',
          'Überprüfe Netzwerk-Latenz',
          'Erwäge alternative Endpoints'
        ]
      });
    }

    // Content Accessibility Alert
    if (!platformData.indicators.contentAccessible) {
      alerts.push({
        id: `ai-content-access-${platformKey}-${Date.now()}`,
        type: ALERT_TYPES.MEDIUM,
        strategy: 'AI_PLATFORM',
        category: 'content',
        title: `Content nicht zugänglich bei ${platformName}`,
        message: `Website-Content ist für ${platformName} nicht zugänglich`,
        value: 0, // Nicht zugänglich = 0
        threshold: 1, // Sollte zugänglich sein = 1
        timestamp: new Date().toISOString(),
        platform: platformKey,
        recommendations: [
          'Überprüfe Robots.txt',
          'Stelle sicher, dass Content indexiert ist',
          'Überprüfe Sitemap-Einträge',
          'Optimiere Content-Struktur für AI-Crawler'
        ]
      });
    }

    // Kritische API-Fehler
    if (platformData.errors && platformData.errors.length > 0) {
      platformData.errors.forEach((error, index) => {
        if (error.severity === 'CRITICAL') {
          alerts.push({
            id: `ai-critical-error-${platformKey}-${index}-${Date.now()}`,
            type: ALERT_TYPES.CRITICAL,
            strategy: 'AI_PLATFORM',
            category: 'api_error',
            title: `Kritischer API-Fehler bei ${platformName}`,
            message: `Kritischer Fehler: ${error.message} (Typ: ${error.type})`,
            value: error.severity,
            threshold: 'HIGH', // Nur für kritische Fehler
            timestamp: error.timestamp,
            platform: platformKey,
            recommendations: [
              'Sofortige Überprüfung der API-Konfiguration',
              'API-Key rotieren falls Authentifizierungsfehler',
              'Fallback-Mechanismen aktivieren',
              'Support-Team benachrichtigen'
            ]
          });
        }
      });
    }
  });

  // System-weite Alerts
  const totalPlatforms = Object.keys(currentData.platforms).length;
  const offlinePlatforms = Object.values(currentData.platforms).filter(p => p.status === 'offline').length;
  const offlineRate = (offlinePlatforms / totalPlatforms) * 100;

  if (offlineRate > 50) {
    alerts.push({
      id: `ai-system-offline-${Date.now()}`,
      type: ALERT_TYPES.CRITICAL,
      strategy: 'AI_PLATFORM',
      category: 'system',
      title: 'Mehrheit der AI-Plattformen offline',
      message: `${offlinePlatforms} von ${totalPlatforms} AI-Plattformen sind offline (${offlineRate.toFixed(1)}%)`,
      value: offlineRate,
      threshold: 50,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Überprüfe allgemeine Netzwerkprobleme',
        'Kontaktiere alle API-Provider',
        'Aktiviere alle Fallback-Mechanismen',
        'Bereite manuelle Suchstrategien vor'
      ]
    });
  }

  return alerts;
}

/**
 * Generiert Korrelations-Alerts
 */
function generateCorrelationAlerts(currentCorrelations, previousCorrelations) {
  const alerts = [];

  if (!currentCorrelations || !previousCorrelations) return alerts;

  // Überprüfe Änderungen in Korrelationen
  Object.keys(currentCorrelations).forEach(strategyKey => {
    Object.keys(currentCorrelations[strategyKey]).forEach(corrKey => {
      const currentCorr = currentCorrelations[strategyKey][corrKey];
      const previousCorr = previousCorrelations[strategyKey]?.[corrKey];

      if (previousCorr !== undefined) {
        const change = Math.abs(currentCorr - previousCorr);
        if (change > ALERT_THRESHOLDS.correlations.correlationChangeThreshold) {
          alerts.push({
            id: `correlation-${strategyKey}-${corrKey}-${Date.now()}`,
            type: ALERT_TYPES.MEDIUM,
            strategy: 'CORRELATION',
            category: 'strategy-synergy',
            title: 'Strategie-Korrelation verändert',
            message: `Korrelation zwischen ${strategyKey.replace('_', ' ↔ ')} (${corrKey.replace('_', ' & ')}) änderte sich von ${previousCorr.toFixed(2)} auf ${currentCorr.toFixed(2)}`,
            value: change,
            threshold: ALERT_THRESHOLDS.correlations.correlationChangeThreshold,
            timestamp: new Date().toISOString(),
            recommendations: [
              'Überprüfen Sie Strategie-Integration',
              'Anpassen von Ressourcen-Allokation',
              'Re-evaluieren Sie Cross-Strategy KPIs'
            ]
          });
        }
      }
    });
  });

  return alerts;
}

/**
 * Generiert Opportunity Alerts
 */
function generateOpportunityAlerts(seoData, geoData, aeoData) {
  const alerts = [];

  if (!seoData && !geoData && !aeoData) return alerts;

  // SEO Opportunities
  if (seoData && seoData.kpis.opportunityScore > 50) {
    alerts.push({
      id: `seo-opportunity-${Date.now()}`,
      type: ALERT_TYPES.INFO,
      strategy: 'SEO',
      category: 'opportunity',
      title: 'SEO-Optimierungschancen identifiziert',
      message: `${seoData.kpis.opportunityScore} Keywords mit hohem Potenzial für Ranking-Verbesserungen`,
      value: seoData.kpis.opportunityScore,
      threshold: 50,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Fokussieren Sie Long-Tail Keywords',
        'Erstellen Sie spezifischen Content',
        'Bauen Sie thematische Authority auf'
      ]
    });
  }

  // GEO Opportunities
  if (geoData && geoData.kpis.highPotentialCities > 3) {
    alerts.push({
      id: `geo-opportunity-${Date.now()}`,
      type: ALERT_TYPES.INFO,
      strategy: 'GEO',
      category: 'expansion',
      title: 'Lokale Expansionschancen',
      message: `${geoData.kpis.highPotentialCities} Städte mit hohem Marktpotenzial identifiziert`,
      value: geoData.kpis.highPotentialCities,
      threshold: 3,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Erweitern Sie lokale Präsenz',
        'Optimieren Sie GMB-Profile in Zielstädten',
        'Starten Sie lokale Marketing-Kampagnen'
      ]
    });
  }

  return alerts;
}

/**
 * Sendet Alerts (simuliert)
 */
function sendAlerts(alerts) {
  console.log('📤 Sende Alerts...\n');

  const criticalAlerts = alerts.filter(a => a.type === ALERT_TYPES.CRITICAL);
  const highAlerts = alerts.filter(a => a.type === ALERT_TYPES.HIGH);
  const mediumAlerts = alerts.filter(a => a.type === ALERT_TYPES.MEDIUM);
  const lowAlerts = alerts.filter(a => a.type === ALERT_TYPES.LOW);
  const infoAlerts = alerts.filter(a => a.type === ALERT_TYPES.INFO);

  if (criticalAlerts.length > 0) {
    console.log(`🚨 KRITISCHE ALERTS (${criticalAlerts.length}):`);
    criticalAlerts.forEach(alert => {
      console.log(`  • ${alert.title}: ${alert.message}`);
    });
  }

  if (highAlerts.length > 0) {
    console.log(`⚠️  HOHE PRIORITÄT (${highAlerts.length}):`);
    highAlerts.forEach(alert => {
      console.log(`  • ${alert.title}: ${alert.message}`);
    });
  }

  if (mediumAlerts.length > 0) {
    console.log(`📊 MITTLERE PRIORITÄT (${mediumAlerts.length}):`);
    mediumAlerts.forEach(alert => {
      console.log(`  • ${alert.title}: ${alert.message}`);
    });
  }

  if (lowAlerts.length > 0) {
    console.log(`ℹ️  NIEDRIGE PRIORITÄT (${lowAlerts.length}):`);
    lowAlerts.forEach(alert => {
      console.log(`  • ${alert.title}: ${alert.message}`);
    });
  }

  if (infoAlerts.length > 0) {
    console.log(`💡 OPPORTUNITIES (${infoAlerts.length}):`);
    infoAlerts.forEach(alert => {
      console.log(`  • ${alert.title}: ${alert.message}`);
    });
  }

  // Simuliere Alert-Versand
  console.log('\n📧 Alerts würden an folgende Kanäle gesendet werden:');
  console.log('  • E-Mail an Marketing-Team');
  console.log('  • Slack-Notifications');
  console.log('  • Dashboard-Alerts');
  console.log('  • SMS bei kritischen Alerts\n');
}

/**
 * Hauptfunktion für Alert System
 */
async function runAlertSystem() {
  console.log('🔍 Initialisiere Enhanced Alert System...\n');

  try {
    // Lade aktuelle Daten
    console.log('📊 Lade aktuelle Performance-Daten...');

    let currentSEO = null;
    let currentGEO = null;
    let currentAEO = null;
    let currentCorrelations = null;
    let currentAIPlatform = null;

    try {
      currentSEO = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'seo-dashboard.json'), 'utf8'));
    } catch (error) {
      console.log('⚠️  SEO-Daten nicht verfügbar');
    }

    try {
      currentGEO = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'geo-performance-report.json'), 'utf8'));
    } catch (error) {
      console.log('⚠️  GEO-Daten nicht verfügbar');
    }

    try {
      currentAEO = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'aeo-entity-report.json'), 'utf8'));
    } catch (error) {
      console.log('⚠️  AEO-Daten nicht verfügbar');
    }

    try {
      const corrData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'correlation-analysis-report.json'), 'utf8'));
      currentCorrelations = corrData.correlations;
    } catch (error) {
      console.log('⚠️  Korrelations-Daten nicht verfügbar');
    }

    try {
      const aiFiles = fs.readdirSync(path.join(__dirname, '..', 'data', 'seo-monitoring'))
        .filter(file => file.startsWith('ai-platform-report-'))
        .sort()
        .reverse(); // Neuestes zuerst

      if (aiFiles.length > 0) {
        currentAIPlatform = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'seo-monitoring', aiFiles[0]), 'utf8'));
      }
    } catch (error) {
      console.log('⚠️  AI Platform Daten nicht verfügbar');
    }

    // Lade historische Daten für Vergleich
    let previousSEO = null;
    let previousGEO = null;
    let previousAEO = null;
    let previousCorrelations = null;

    try {
      const seoHistory = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'seo-history.json'), 'utf8'));
      if (seoHistory.length > 1) {
        previousSEO = seoHistory[seoHistory.length - 2]; // Vorletzter Eintrag
      }
    } catch (error) {
      // Keine historischen SEO-Daten
    }

    // Sammle alle Alerts
    const allAlerts = [
      ...generateSEOAlerts(currentSEO, previousSEO),
      ...generateGEOAlerts(currentGEO, previousGEO),
      ...generateAEOAlerts(currentAEO, previousAEO),
      ...generateCorrelationAlerts(currentCorrelations, previousCorrelations),
      ...generateOpportunityAlerts(currentSEO, currentGEO, currentAEO),
      ...generateAIPlatformAlerts(currentAIPlatform, null) // AI Platform Alerts ohne historische Vergleich
    ];

    // Sende Alerts
    sendAlerts(allAlerts);

    // Speichere Alert-Log
    const alertLog = {
      timestamp: new Date().toISOString(),
      alerts: allAlerts,
      summary: {
        total: allAlerts.length,
        critical: allAlerts.filter(a => a.type === ALERT_TYPES.CRITICAL).length,
        high: allAlerts.filter(a => a.type === ALERT_TYPES.HIGH).length,
        medium: allAlerts.filter(a => a.type === ALERT_TYPES.MEDIUM).length,
        low: allAlerts.filter(a => a.type === ALERT_TYPES.LOW).length,
        info: allAlerts.filter(a => a.type === ALERT_TYPES.INFO).length
      }
    };

    const logFile = path.join(__dirname, '..', 'data', 'alert-log.json');
    fs.writeFileSync(logFile, JSON.stringify(alertLog, null, 2));

    // Zeige Zusammenfassung
    console.log('📋 Enhanced Alert System Zusammenfassung:');
    console.log(`  • Gesamt Alerts: ${alertLog.summary.total}`);
    console.log(`  • Kritisch: ${alertLog.summary.critical}`);
    console.log(`  • Hoch: ${alertLog.summary.high}`);
    console.log(`  • Mittel: ${alertLog.summary.medium}`);
    console.log(`  • Niedrig: ${alertLog.summary.low}`);
    console.log(`  • Info/Opportunities: ${alertLog.summary.info}`);

    console.log(`\n💾 Alert Log gespeichert: ${logFile}`);
    console.log('\n🎉 Enhanced Alert System abgeschlossen!');

    return alertLog;

  } catch (error) {
    console.error('❌ Fehler im Enhanced Alert System:', error.message);
    throw error;
  }
}

// Export-Funktionen
module.exports = {
  runAlertSystem,
  generateSEOAlerts,
  generateGEOAlerts,
  generateAEOAlerts,
  generateAIPlatformAlerts,
  generateCorrelationAlerts,
  ALERT_THRESHOLDS,
  ALERT_TYPES
};

// Führe Alert System aus wenn direkt aufgerufen
if (require.main === module) {
  runAlertSystem().catch(console.error);
}