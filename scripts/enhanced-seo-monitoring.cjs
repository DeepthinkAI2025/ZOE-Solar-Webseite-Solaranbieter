#!/usr/bin/env node

/**
 * Erweitertes SEO-Monitoring für ZOE Solar
 * Integriert neue Keyword-Daten und erweiterte Analysen
 */

const fs = require('fs');
const path = require('path');

// Importiere Keyword-Daten
let keywordData = [];
let highPriorityKeywords = [];

try {
  keywordData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'keyword-analysis.json'), 'utf8'));
  highPriorityKeywords = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'high-priority-keywords.json'), 'utf8'));
} catch (error) {
  console.warn('⚠️  Keyword-Daten nicht gefunden. Verwende Standard-Keywords.');
}

/**
 * Bestimmt Segment für ein Keyword
 */
function determineSegment(keyword) {
  const lower = keyword.toLowerCase();

  if (lower.includes('agri') || lower.includes('landwirt') || lower.includes('bauer') || lower.includes('acker')) {
    return 'agri-pv';
  }

  if (
    lower.includes('eigenheim') ||
    lower.includes('haus') ||
    lower.includes('einfamilienhaus') ||
    lower.includes('privat') ||
    lower.includes('dach')
  ) {
    return 'residential';
  }

  if (lower.includes('speicher') || lower.includes('batterie')) {
    return 'storage';
  }

  if (lower.includes('wärmepumpe') || lower.includes('wallbox')) {
    return 'sector-coupling';
  }

  if (lower.includes('gewerbe') || lower.includes('industrie') || lower.includes('unternehmen')) {
    return 'commercial';
  }

  return 'general';
}

/**
 * Simuliert SERP-Positionen für Keywords
 */
function simulateSERPPositions(keywords) {
  const positions = {};

  keywords.forEach(keyword => {
    // Simuliere realistische Positionen (1-50)
    // Hochwertige Keywords tendieren zu besseren Positionen
    const basePosition = keyword.opportunityScore > 1500 ? Math.floor(Math.random() * 10) + 1 :
                        keyword.opportunityScore > 1000 ? Math.floor(Math.random() * 20) + 5 :
                        Math.floor(Math.random() * 30) + 10;

    const segment = keyword.segment || determineSegment(keyword.keyword);

    positions[keyword.keyword] = {
      keyword: keyword.keyword,
      position: Math.max(1, Math.min(basePosition, 50)),
      previousPosition: Math.max(1, Math.min(basePosition + Math.floor(Math.random() * 6) - 3, 50)),
      searchVolume: keyword.searchVolume,
      competition: keyword.competition,
      difficulty: keyword.difficulty,
      opportunityScore: keyword.opportunityScore,
      category: keyword.category,
      intent: keyword.intent,
      segment,
      lastUpdated: new Date().toISOString()
    };
  });

  return positions;
}

/**
 * Berechnet SEO-Metriken
 */
function calculateSEOMetrics(positions) {
  const keywords = Object.values(positions);
  const totalKeywords = keywords.length;

  // Durchschnittliche Position
  const avgPosition = keywords.reduce((sum, k) => sum + k.position, 0) / totalKeywords;

  // Keywords in Top 10
  const top10Count = keywords.filter(k => k.position <= 10).length;
  const top10Percentage = (top10Count / totalKeywords) * 100;

  // Keywords in Top 3
  const top3Count = keywords.filter(k => k.position <= 3).length;
  const top3Percentage = (top3Count / totalKeywords) * 100;

  // Positionsänderungen
  const improved = keywords.filter(k => k.position < k.previousPosition).length;
  const declined = keywords.filter(k => k.position > k.previousPosition).length;
  const stable = keywords.filter(k => k.position === k.previousPosition).length;

  // Geschätzter Traffic (vereinfacht)
  const estimatedTraffic = keywords.reduce((sum, k) => {
    const ctr = k.position <= 3 ? 0.3 : k.position <= 10 ? 0.15 : 0.05;
    return sum + (k.searchVolume * ctr);
  }, 0);

  // Kategorien-Analyse
  const categoryStats = {};
  const segmentStats = {};
  keywords.forEach(k => {
    const categoryKey = k.category || 'unknown';
    const segmentKey = k.segment || determineSegment(k.keyword || '');

    if (!categoryStats[categoryKey]) {
      categoryStats[categoryKey] = { count: 0, avgPosition: 0, top10Count: 0 };
    }
    if (!segmentStats[segmentKey]) {
      segmentStats[segmentKey] = { count: 0, avgPosition: 0, top10Count: 0, estimatedTraffic: 0 };
    }

    categoryStats[categoryKey].count++;
    categoryStats[categoryKey].avgPosition += k.position;
    if (k.position <= 10) categoryStats[categoryKey].top10Count++;

    segmentStats[segmentKey].count++;
    segmentStats[segmentKey].avgPosition += k.position;
    if (k.position <= 10) segmentStats[segmentKey].top10Count++;
    const ctr = k.position <= 3 ? 0.3 : k.position <= 10 ? 0.15 : 0.05;
    segmentStats[segmentKey].estimatedTraffic += k.searchVolume * ctr;
  });

  Object.keys(categoryStats).forEach(cat => {
    categoryStats[cat].avgPosition = Math.round(categoryStats[cat].avgPosition / categoryStats[cat].count * 100) / 100;
  });

  Object.keys(segmentStats).forEach(seg => {
    segmentStats[seg].avgPosition = Math.round(segmentStats[seg].avgPosition / segmentStats[seg].count * 100) / 100;
    segmentStats[seg].estimatedTraffic = Math.round(segmentStats[seg].estimatedTraffic);
    segmentStats[seg].top10Percentage = Math.round((segmentStats[seg].top10Count / segmentStats[seg].count) * 10000) / 100;
  });

  return {
    totalKeywords,
    avgPosition: Math.round(avgPosition * 100) / 100,
    top10Count,
    top10Percentage: Math.round(top10Percentage * 100) / 100,
    top3Count,
    top3Percentage: Math.round(top3Percentage * 100) / 100,
    positionChanges: { improved, declined, stable },
    estimatedTraffic: Math.round(estimatedTraffic),
    categoryStats,
    segmentStats,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generiert SEO-Alerts basierend auf Positionsänderungen
 */
function generateSEOAlerts(positions, previousMetrics) {
  const alerts = [];

  Object.entries(positions).forEach(([keyword, data]) => {
    const change = data.previousPosition - data.position;
    const segment = data.segment || determineSegment(keyword);

    // Signifikante Verbesserungen
    if (change >= 5) {
      alerts.push({
        type: 'improvement',
        severity: 'info',
        keyword,
        segment,
        message: `Position für "${keyword}" um ${change} Plätze verbessert (${data.previousPosition} → ${data.position})`,
        position: data.position,
        change: change,
        timestamp: new Date().toISOString()
      });
    }

    // Signifikante Verschlechterungen
    if (change <= -5) {
      alerts.push({
        type: 'decline',
        severity: 'warning',
        keyword,
        segment,
        message: `Position für "${keyword}" um ${Math.abs(change)} Plätze verschlechtert (${data.previousPosition} → ${data.position})`,
        position: data.position,
        change: change,
        timestamp: new Date().toISOString()
      });
    }

    // Neue Top 10 Positionen
    if (data.position <= 10 && data.previousPosition > 10) {
      alerts.push({
        type: 'milestone',
        severity: 'success',
        keyword,
        segment,
        message: `"${keyword}" erreicht Top 10 (Position ${data.position})`,
        position: data.position,
        change: change,
        timestamp: new Date().toISOString()
      });
    }

    // Verlust von Top 10 Positionen
    if (data.position > 10 && data.previousPosition <= 10) {
      alerts.push({
        type: 'loss',
        severity: 'error',
        keyword,
        segment,
        message: `"${keyword}" fällt aus Top 10 heraus (Position ${data.position})`,
        position: data.position,
        change: change,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Metrik-basierte Alerts
  if (previousMetrics) {
    const currentMetrics = calculateSEOMetrics(positions);

    if (currentMetrics.avgPosition < previousMetrics.avgPosition - 2) {
      alerts.push({
        type: 'trend',
        severity: 'warning',
        message: `Durchschnittliche Position verschlechtert sich (${previousMetrics.avgPosition} → ${currentMetrics.avgPosition})`,
        timestamp: new Date().toISOString()
      });
    }

    if (currentMetrics.top10Percentage > previousMetrics.top10Percentage + 5) {
      alerts.push({
        type: 'trend',
        severity: 'success',
        message: `Top 10 Anteil verbessert (${previousMetrics.top10Percentage}% → ${currentMetrics.top10Percentage}%)`,
        timestamp: new Date().toISOString()
      });
    }
  }

  return alerts.sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, success: 2, info: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

/**
 * Erstellt historische Trend-Daten
 */
function updateHistoricalData(currentMetrics, positions) {
  const historyFile = path.join(__dirname, '..', 'data', 'seo-history.json');

  let history = [];
  try {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  } catch (error) {
    // Datei existiert noch nicht
  }

  // Behalte nur die letzten 30 Tage
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  history = history.filter(entry => new Date(entry.timestamp) > thirtyDaysAgo);
  history.push({
    ...currentMetrics,
    positions: positions
  });

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  return history;
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('📊 Starte erweitertes SEO-Monitoring...\n');

  if (highPriorityKeywords.length === 0) {
    console.log('❌ Keine Keyword-Daten gefunden. Bitte führen Sie zuerst keyword-research aus.');
    process.exit(1);
  }

  console.log(`📈 Analysiere ${highPriorityKeywords.length} High-Priority Keywords...`);

  // Simuliere SERP-Positionen
  const positions = simulateSERPPositions(highPriorityKeywords);
  console.log('✅ SERP-Positionen simuliert');

  // Berechne Metriken
  const metrics = calculateSEOMetrics(positions);
  console.log('✅ SEO-Metriken berechnet');

  // Lade vorherige Metriken für Vergleich
  let previousMetrics = null;
  try {
    const history = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'seo-history.json'), 'utf8'));
    if (history.length > 0) {
      previousMetrics = history[history.length - 1];
    }
  } catch (error) {
    // Keine vorherigen Daten
  }

  // Generiere Alerts
  const alerts = generateSEOAlerts(positions, previousMetrics);
  console.log(`✅ ${alerts.length} SEO-Alerts generiert`);

  // Aktualisiere historische Daten
  const history = updateHistoricalData(metrics, positions);
  console.log('✅ Historische Daten aktualisiert');

  // Zeige Zusammenfassung
  console.log('\n📊 SEO-Zusammenfassung:');
  console.log(`  • Durchschnittliche Position: ${metrics.avgPosition}`);
  console.log(`  • Top 10 Keywords: ${metrics.top10Count} (${metrics.top10Percentage}%)`);
  console.log(`  • Top 3 Keywords: ${metrics.top3Count} (${metrics.top3Percentage}%)`);
  console.log(`  • Geschätzter Traffic: ${metrics.estimatedTraffic.toLocaleString()} Besuche/Monat`);
  console.log(`  • Positionsänderungen: +${metrics.positionChanges.improved} ↑, ${metrics.positionChanges.declined} ↓, ${metrics.positionChanges.stable} →`);

  if (metrics.segmentStats && Object.keys(metrics.segmentStats).length > 0) {
    console.log('\n🧭 Segment-Performance:');
    Object.entries(metrics.segmentStats).forEach(([segment, data]) => {
      const labelMap = {
        'agri-pv': 'Agri-PV',
        residential: 'Eigenheim',
        storage: 'Speicher',
        'sector-coupling': 'Sektorkopplung',
        commercial: 'Gewerbe',
        general: 'Allgemein'
      };
      const label = labelMap[segment] || segment;
      console.log(`  • ${label}: ∅ Position ${data.avgPosition} | Top 10 ${data.top10Percentage || 0}% | Traffic ${data.estimatedTraffic.toLocaleString()} PV/Monat`);
    });
  }

  if (alerts.length > 0) {
    console.log('\n🚨 Wichtige Alerts:');
    alerts.slice(0, 5).forEach((alert, index) => {
      const icon = alert.severity === 'error' ? '🔴' :
                   alert.severity === 'warning' ? '🟡' :
                   alert.severity === 'success' ? '🟢' : '🔵';
      console.log(`  ${icon} ${alert.message}`);
    });

    if (alerts.length > 5) {
      console.log(`  ... und ${alerts.length - 5} weitere Alerts`);
    }
  }

  // Speichere aktuelle Daten
  const reportFile = path.join(__dirname, '..', 'data', 'seo-report.json');
  fs.writeFileSync(reportFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    metrics,
    positions,
    alerts,
    summary: {
      totalKeywords: metrics.totalKeywords,
      avgPosition: metrics.avgPosition,
      top10Percentage: metrics.top10Percentage,
      estimatedTraffic: metrics.estimatedTraffic,
      alertCount: alerts.length
    }
  }, null, 2));

  console.log(`\n💾 Bericht gespeichert: ${reportFile}`);
  console.log('\n🎉 SEO-Monitoring abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  simulateSERPPositions,
  calculateSEOMetrics,
  generateSEOAlerts,
  updateHistoricalData
};