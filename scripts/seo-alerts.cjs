#!/usr/bin/env node

/**
 * SEO Alert System für ZOE Solar
 * Sendet Benachrichtigungen bei signifikanten Ranking-Veränderungen
 */

const fs = require('fs');
const path = require('path');

// Konfiguration
const CONFIG = {
  monitoringDir: path.join(__dirname, '..', 'data', 'seo-monitoring'),
  alertThresholds: {
    rankingDrop: 5, // Alert wenn Position um 5 oder mehr fällt
    backlinksLost: 3, // Alert wenn mehr als 3 Backlinks verloren gehen
    coreWebVitals: {
      lcp: 3.0, // Alert wenn LCP über 3s
      fid: 200, // Alert wenn FID über 200ms
      cls: 0.2  // Alert wenn CLS über 0.2
    }
  }
};

/**
 * Lädt die neuesten Monitoring-Daten
 */
function loadLatestData() {
  const summaryFile = path.join(CONFIG.monitoringDir, 'latest-summary.json');

  if (!fs.existsSync(summaryFile)) {
    console.log('❌ Keine Monitoring-Daten gefunden');
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
    return data;
  } catch (error) {
    console.error('❌ Fehler beim Laden der Monitoring-Daten:', error);
    return null;
  }
}

/**
 * Lädt historische Daten für Vergleiche
 */
function loadHistoricalData(days = 7) {
  const files = fs.readdirSync(CONFIG.monitoringDir)
    .filter(file => file.startsWith('seo-report-'))
    .sort()
    .reverse()
    .slice(0, days);

  return files.map(file => {
    try {
      return JSON.parse(fs.readFileSync(path.join(CONFIG.monitoringDir, file), 'utf8'));
    } catch (error) {
      return null;
    }
  }).filter(Boolean);
}

/**
 * Überprüft Rankings auf signifikante Veränderungen
 */
function checkRankingAlerts(currentData, historicalData) {
  const alerts = [];

  if (historicalData.length === 0) return alerts;

  const previousData = historicalData[0]; // Neuestes historische Datum

  currentData.rankings.forEach(current => {
    const previous = previousData.rankings.find(r => r.keyword === current.keyword);

    if (previous) {
      const positionChange = current.position - previous.position;

      if (positionChange >= CONFIG.alertThresholds.rankingDrop) {
        alerts.push({
          type: 'ranking_drop',
          severity: 'high',
          keyword: current.keyword,
          message: `Ranking für "${current.keyword}" ist von Position ${previous.position} auf ${current.position} gefallen`,
          change: positionChange
        });
      }
    }
  });

  return alerts;
}

/**
 * Überprüft Core Web Vitals auf Probleme
 */
function checkCoreWebVitalsAlerts(data) {
  const alerts = [];
  const cwv = data.coreWebVitals;

  if (cwv.lcp > CONFIG.alertThresholds.coreWebVitals.lcp) {
    alerts.push({
      type: 'core_web_vitals',
      severity: 'high',
      metric: 'LCP',
      message: `Largest Contentful Paint ist bei ${cwv.lcp.toFixed(1)}s (Soll: ≤ 2.5s)`,
      value: cwv.lcp
    });
  }

  if (cwv.fid > CONFIG.alertThresholds.coreWebVitals.fid) {
    alerts.push({
      type: 'core_web_vitals',
      severity: 'medium',
      metric: 'FID',
      message: `First Input Delay ist bei ${cwv.fid.toFixed(0)}ms (Soll: ≤ 100ms)`,
      value: cwv.fid
    });
  }

  if (cwv.cls > CONFIG.alertThresholds.coreWebVitals.cls) {
    alerts.push({
      type: 'core_web_vitals',
      severity: 'medium',
      metric: 'CLS',
      message: `Cumulative Layout Shift ist bei ${cwv.cls.toFixed(2)} (Soll: ≤ 0.1)`,
      value: cwv.cls
    });
  }

  return alerts;
}

/**
 * Überprüft Backlink-Veränderungen
 */
function checkBacklinkAlerts(currentData, historicalData) {
  const alerts = [];

  if (historicalData.length === 0) return alerts;

  const previousData = historicalData[0];

  if (currentData.backlinks.lost >= CONFIG.alertThresholds.backlinksLost) {
    alerts.push({
      type: 'backlinks',
      severity: 'medium',
      message: `${currentData.backlinks.lost} Backlinks wurden verloren`,
      lost: currentData.backlinks.lost
    });
  }

  return alerts;
}

/**
 * Sendet Alerts (in Produktion würde hier eine echte Benachrichtigung erfolgen)
 */
function sendAlerts(alerts) {
  if (alerts.length === 0) {
    console.log('✅ Keine Alerts zu senden');
    return;
  }

  console.log('\n🚨 SEO ALERTS\n');

  alerts.forEach((alert, index) => {
    const severityIcon = alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🟢';
    console.log(`${severityIcon} ${alert.message}`);

    // In Produktion würden hier E-Mails, Slack-Nachrichten, etc. gesendet werden
  });

  // Speichere Alerts in Datei für Dashboard
  const alertsFile = path.join(CONFIG.monitoringDir, 'latest-alerts.json');
  fs.writeFileSync(alertsFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    alerts: alerts
  }, null, 2));
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🔍 Überprüfe SEO Alerts...\n');

  const currentData = loadLatestData();
  if (!currentData) {
    console.log('❌ Keine aktuellen Daten verfügbar');
    return;
  }

  const historicalData = loadHistoricalData(7);

  const alerts = [
    ...checkRankingAlerts(currentData, historicalData),
    ...checkCoreWebVitalsAlerts(currentData),
    ...checkBacklinkAlerts(currentData, historicalData)
  ];

  sendAlerts(alerts);

  console.log(`\n📊 Alert-Check abgeschlossen. ${alerts.length} Alerts gefunden.`);
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  checkRankingAlerts,
  checkCoreWebVitalsAlerts,
  checkBacklinkAlerts,
  sendAlerts
};