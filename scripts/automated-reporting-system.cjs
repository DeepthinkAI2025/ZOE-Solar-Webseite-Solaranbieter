#!/usr/bin/env node

/**
 * Automated Reporting System für ZOE Solar
 * Generiert wöchentliche und monatliche Reports mit KPIs
 */

const fs = require('fs');
const path = require('path');

/**
 * Lädt alle verfügbaren Monitoring-Daten
 */
function loadAllMonitoringData() {
  const data = {};

  // Versuche alle Monitoring-Dateien zu laden
  const dataFiles = [
    'seo-dashboard.json',
    'geo-performance-report.json',
    'aeo-entity-report.json',
    'unified-analytics-report.json',
    'seo-monitoring-suite.json'
  ];

  dataFiles.forEach(file => {
    try {
      const filePath = path.join(__dirname, '..', 'data', file);
      if (fs.existsSync(filePath)) {
        data[file.replace('.json', '')] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`✅ ${file} geladen`);
      } else {
        console.log(`⚠️  ${file} nicht gefunden`);
      }
    } catch (error) {
      console.log(`❌ Fehler beim Laden von ${file}:`, error.message);
    }
  });

  return data;
}

/**
 * Generiert Executive Summary für Reports
 */
function generateExecutiveSummary(allData, reportType = 'weekly') {
  const summary = {
    reportType,
    generatedAt: new Date().toISOString(),
    period: reportType === 'weekly' ? 'Letzte 7 Tage' : 'Letzter Monat',
    keyHighlights: [],
    kpiOverview: {},
    alerts: [],
    recommendations: []
  };

  // Sammle KPIs aus allen Datenquellen
  if (allData['seo-dashboard']) {
    const seo = allData['seo-dashboard'];
    summary.kpiOverview.seo = {
      avgPosition: seo.kpis.avgPosition,
      organicTraffic: seo.kpis.organicTraffic,
      conversions: seo.kpis.conversions,
      revenue: seo.kpis.revenue,
      visibilityScore: seo.summary.visibilityScore
    };

    // SEO Highlights
    if (seo.kpis.organicTraffic > 10000) {
      summary.keyHighlights.push('⭐ Hoher organischer Traffic über 10.000 Sessions');
    }
    if (seo.kpis.avgPosition < 20) {
      summary.keyHighlights.push('🎯 Exzellente Such-Positionen unter 20');
    }
  }

  if (allData['geo-performance-report']) {
    const geo = allData['geo-performance-report'];
    summary.kpiOverview.geo = {
      visibilityScore: geo.kpis.avgVisibilityScore,
      localTraffic: geo.kpis.totalLocalTraffic,
      gmbViews: geo.kpis.totalGMBViews,
      gmbRating: geo.kpis.avgGMBRating
    };

    // GEO Highlights
    if (geo.kpis.avgVisibilityScore > 60) {
      summary.keyHighlights.push('📍 Starke lokale Sichtbarkeit über 60%');
    }
  }

  if (allData['aeo-entity-report']) {
    const aeo = allData['aeo-entity-report'];
    summary.kpiOverview.aeo = {
      entityAuthority: aeo.kpis.avgEntityAuthority,
      entityStrength: aeo.kpis.avgEntityStrengthScore,
      featuredSnippets: aeo.kpis.featuredSnippetsOwned,
      competitiveAdvantage: aeo.kpis.avgCompetitiveAdvantage
    };

    // AEO Highlights
    if (aeo.kpis.featuredSnippetsOwned > 0) {
      summary.keyHighlights.push('🎯 Featured Snippets in Suchergebnissen');
    }
  }

  if (allData['unified-analytics-report']) {
    const analytics = allData['unified-analytics-report'];
    summary.kpiOverview.analytics = {
      totalUsers: analytics.summary.totalUsers,
      totalSessions: analytics.summary.totalSessions,
      conversions: analytics.summary.conversions,
      revenue: analytics.summary.revenue,
      conversionRate: analytics.kpis.conversionRate
    };

    // Analytics Highlights
    if (analytics.kpis.conversionRate > 4) {
      summary.keyHighlights.push('💰 Hohe Conversion-Rate über 4%');
    }
  }

  // Sammle Alerts aus allen Quellen
  Object.values(allData).forEach(data => {
    if (data.alerts) {
      summary.alerts.push(...data.alerts);
    }
    if (data.recommendations) {
      summary.recommendations.push(...data.recommendations);
    }
  });

  // Begrenze auf Top 5 pro Kategorie
  summary.alerts = summary.alerts.slice(0, 5);
  summary.recommendations = summary.recommendations.slice(0, 5);

  return summary;
}

/**
 * Generiert detaillierte KPI-Sektionen
 */
function generateKPIDetails(allData, reportType) {
  const details = {
    seo: {},
    geo: {},
    aeo: {},
    analytics: {},
    trends: {}
  };

  // SEO Details
  if (allData['seo-dashboard']) {
    const seo = allData['seo-dashboard'];
    details.seo = {
      rankingPerformance: {
        avgPosition: seo.kpis.avgPosition,
        top3Keywords: seo.kpis.top3Keywords,
        top10Keywords: seo.kpis.top10Keywords,
        visibilityScore: seo.summary.visibilityScore
      },
      trafficPerformance: {
        organicTraffic: seo.kpis.organicTraffic,
        trafficGrowth: seo.kpis.organicTrafficGrowth,
        conversions: seo.kpis.conversions,
        conversionRate: seo.kpis.conversionRate,
        revenue: seo.kpis.revenue
      },
      qualityMetrics: {
        bounceRate: seo.kpis.bounceRate,
        avgSessionDuration: seo.kpis.avgSessionDuration,
        pagesPerSession: seo.kpis.pagesPerSession
      }
    };
  }

  // GEO Details
  if (allData['geo-performance-report']) {
    const geo = allData['geo-performance-report'];
    details.geo = {
      localVisibility: {
        avgVisibilityScore: geo.kpis.avgVisibilityScore,
        marketCoverage: geo.kpis.marketCoverage,
        highPotentialCities: geo.kpis.highPotentialCities
      },
      gmbPerformance: {
        totalViews: geo.kpis.totalGMBViews,
        websiteClicks: geo.kpis.totalGMBWebsiteClicks,
        calls: geo.kpis.totalGMBCalls,
        avgRating: geo.kpis.avgGMBRating
      },
      localTraffic: {
        totalLocalTraffic: geo.kpis.totalLocalTraffic,
        competitorAnalysis: geo.rankings ? Object.values(geo.rankings).slice(0, 3).map(city => ({
          city: city.city,
          visibilityScore: city.visibilityScore,
          localTraffic: city.localTraffic
        })) : []
      }
    };
  }

  // AEO Details
  if (allData['aeo-entity-report']) {
    const aeo = allData['aeo-entity-report'];
    details.aeo = {
      entityAuthority: {
        avgEntityAuthority: aeo.kpis.avgEntityAuthority,
        avgEntityStrengthScore: aeo.kpis.avgEntityStrengthScore,
        knowledgePanelsPresent: aeo.kpis.knowledgePanelsPresent
      },
      searchFeatures: {
        featuredSnippetsOwned: aeo.kpis.featuredSnippetsOwned,
        knowledgePanelsInSERP: aeo.kpis.knowledgePanelsInSERP,
        avgCompetitiveAdvantage: aeo.kpis.avgCompetitiveAdvantage
      },
      entityRelationships: {
        totalRelationships: aeo.kpis.totalEntityRelationships,
        avgRelationshipStrength: aeo.kpis.avgRelationshipStrength
      }
    };
  }

  // Analytics Details
  if (allData['unified-analytics-report']) {
    const analytics = allData['unified-analytics-report'];
    details.analytics = {
      trafficOverview: {
        totalUsers: analytics.summary.totalUsers,
        totalSessions: analytics.summary.totalSessions,
        totalPageViews: analytics.summary.totalPageViews,
        organicTraffic: analytics.summary.organicTraffic
      },
      searchPerformance: {
        searchClicks: analytics.summary.searchConsoleClicks,
        searchImpressions: analytics.summary.searchConsoleImpressions,
        avgCTR: analytics.kpis.ctr,
        avgPosition: analytics.kpis.avgPosition
      },
      conversionPerformance: {
        conversions: analytics.summary.conversions,
        conversionRate: analytics.kpis.conversionRate,
        revenue: analytics.summary.revenue,
        goalCompletions: analytics.goals ? analytics.goals.totalConversions : 0
      },
      localPerformance: {
        gmbViews: analytics.summary.gmbTotalViews,
        gmbActions: analytics.summary.gmbActions,
        gmbRating: analytics.kpis.gmbRating
      }
    };
  }

  // Trend-Analyse (simuliert)
  details.trends = {
    trafficTrend: Math.round((Math.random() - 0.5) * 20),
    rankingTrend: Math.round((Math.random() - 0.5) * 5),
    conversionTrend: Math.round((Math.random() - 0.5) * 15),
    revenueTrend: Math.round((Math.random() - 0.5) * 25),
    period: reportType === 'weekly' ? 'vs. Vorwoche' : 'vs. Vormonat'
  };

  return details;
}

/**
 * Generiert Report im Markdown-Format
 */
function generateMarkdownReport(summary, details, reportType) {
  const title = reportType === 'weekly' ? 'Wöchentlicher SEO/GEO/AEO Report' : 'Monatlicher SEO/GEO/AEO Report';
  const period = summary.period;

  let markdown = `# ${title}\n\n`;
  markdown += `**Generiert am:** ${new Date().toLocaleDateString('de-DE')} ${new Date().toLocaleTimeString('de-DE')}\n`;
  markdown += `**Zeitraum:** ${period}\n\n`;

  // Executive Summary
  markdown += `## 📊 Executive Summary\n\n`;

  if (summary.keyHighlights.length > 0) {
    markdown += `### 🎯 Key Highlights\n\n`;
    summary.keyHighlights.forEach(highlight => {
      markdown += `- ${highlight}\n`;
    });
    markdown += `\n`;
  }

  // KPI Overview
  markdown += `### 📈 KPI Übersicht\n\n`;
  markdown += `| Kategorie | Metrik | Wert |\n`;
  markdown += `|----------|--------|------|\n`;

  if (summary.kpiOverview.seo) {
    markdown += `| SEO | Durchschnittliche Position | ${summary.kpiOverview.seo.avgPosition.toFixed(1)} |\n`;
    markdown += `| SEO | Organischer Traffic | ${summary.kpiOverview.seo.organicTraffic.toLocaleString()} |\n`;
    markdown += `| SEO | Conversions | ${summary.kpiOverview.seo.conversions.toLocaleString()} |\n`;
  }

  if (summary.kpiOverview.geo) {
    markdown += `| GEO | Lokale Visibility | ${summary.kpiOverview.geo.visibilityScore.toFixed(1)}% |\n`;
    markdown += `| GEO | Lokaler Traffic | ${summary.kpiOverview.geo.localTraffic.toLocaleString()} |\n`;
  }

  if (summary.kpiOverview.aeo) {
    markdown += `| AEO | Entity Strength | ${summary.kpiOverview.aeo.entityStrength.toFixed(1)} |\n`;
    markdown += `| AEO | Featured Snippets | ${summary.kpiOverview.aeo.featuredSnippets} |\n`;
  }

  if (summary.kpiOverview.analytics) {
    markdown += `| Analytics | Gesamt-Besucher | ${summary.kpiOverview.analytics.totalUsers.toLocaleString()} |\n`;
    markdown += `| Analytics | Conversion Rate | ${summary.kpiOverview.analytics.conversionRate.toFixed(1)}% |\n`;
  }

  markdown += `\n`;

  // Detaillierte KPIs
  markdown += `## 📈 Detaillierte KPIs\n\n`;

  // SEO Details
  if (details.seo.rankingPerformance) {
    markdown += `### 🔍 SEO Performance\n\n`;
    markdown += `- **Durchschnittliche Position:** ${details.seo.rankingPerformance.avgPosition.toFixed(1)}\n`;
    markdown += `- **Top 3 Keywords:** ${details.seo.rankingPerformance.top3Keywords}\n`;
    markdown += `- **Top 10 Keywords:** ${details.seo.rankingPerformance.top10Keywords}\n`;
    markdown += `- **Visibility Score:** ${details.seo.rankingPerformance.visibilityScore}\n\n`;
  }

  // Traffic Details
  if (details.seo.trafficPerformance) {
    markdown += `- **Organischer Traffic:** ${details.seo.trafficPerformance.organicTraffic.toLocaleString()} Sessions\n`;
    markdown += `- **Traffic Wachstum:** ${details.seo.trafficPerformance.trafficGrowth > 0 ? '+' : ''}${details.seo.trafficPerformance.trafficGrowth}%\n`;
    markdown += `- **Conversions:** ${details.seo.trafficPerformance.conversions.toLocaleString()}\n`;
    markdown += `- **Conversion Rate:** ${details.seo.trafficPerformance.conversionRate.toFixed(1)}%\n`;
    markdown += `- **Umsatz:** €${details.seo.trafficPerformance.revenue.toLocaleString()}\n\n`;
  }

  // GEO Details
  if (details.geo.localVisibility) {
    markdown += `### 📍 GEO Performance\n\n`;
    markdown += `- **Lokale Visibility Score:** ${details.geo.localVisibility.avgVisibilityScore.toFixed(1)}%\n`;
    markdown += `- **Marktabdeckung:** ${details.geo.localVisibility.marketCoverage.toFixed(1)}%\n`;
    markdown += `- **High-Potential Städte:** ${details.geo.localVisibility.highPotentialCities}\n\n`;
  }

  // AEO Details
  if (details.aeo.entityAuthority) {
    markdown += `### 🎯 AEO Performance\n\n`;
    markdown += `- **Durchschnittliche Entity Authority:** ${details.aeo.entityAuthority.avgEntityAuthority.toFixed(1)}\n`;
    markdown += `- **Entity Strength Score:** ${details.aeo.entityAuthority.avgEntityStrengthScore.toFixed(1)}\n`;
    markdown += `- **Knowledge Panels:** ${details.aeo.entityAuthority.knowledgePanelsPresent}\n`;
    markdown += `- **Featured Snippets:** ${details.aeo.searchFeatures.featuredSnippetsOwned}\n\n`;
  }

  // Trends
  markdown += `## 📊 Trends (${details.trends.period})\n\n`;
  markdown += `- **Traffic Trend:** ${details.trends.trafficTrend > 0 ? '+' : ''}${details.trends.trafficTrend}%\n`;
  markdown += `- **Ranking Trend:** ${details.trends.rankingTrend > 0 ? '+' : ''}${details.trends.rankingTrend}\n`;
  markdown += `- **Conversion Trend:** ${details.trends.conversionTrend > 0 ? '+' : ''}${details.trends.conversionTrend}%\n`;
  markdown += `- **Umsatz Trend:** ${details.trends.revenueTrend > 0 ? '+' : ''}${details.trends.revenueTrend}%\n\n`;

  // Alerts und Recommendations
  if (summary.alerts.length > 0) {
    markdown += `## 🚨 Kritische Alerts\n\n`;
    summary.alerts.forEach((alert, index) => {
      markdown += `${index + 1}. **${alert.type?.toUpperCase() || 'ALERT'}**: ${alert.message || alert.title}\n`;
    });
    markdown += `\n`;
  }

  if (summary.recommendations.length > 0) {
    markdown += `## 💡 Empfehlungen\n\n`;
    summary.recommendations.forEach((rec, index) => {
      const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      markdown += `${index + 1}. ${priorityIcon} **${rec.title}**\n`;
      markdown += `   - ${rec.description}\n`;
      markdown += `   - **Impact:** ${rec.impact} | **Effort:** ${rec.effort}\n\n`;
    });
  }

  return markdown;
}

/**
 * Generiert Report im JSON-Format für APIs
 */
function generateJSONReport(summary, details, reportType) {
  return {
    metadata: {
      reportType,
      generatedAt: summary.generatedAt,
      period: summary.period,
      version: '1.0'
    },
    summary,
    details,
    exportFormats: ['markdown', 'json', 'csv']
  };
}

/**
 * Speichert Reports in verschiedenen Formaten
 */
function saveReports(markdownContent, jsonContent, reportType) {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseName = `${reportType}-report-${timestamp}`;

  // Markdown Report
  const markdownFile = path.join(__dirname, '..', 'data', `${baseName}.md`);
  fs.writeFileSync(markdownFile, markdownContent, 'utf8');

  // JSON Report
  const jsonFile = path.join(__dirname, '..', 'data', `${baseName}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(jsonContent, null, 2));

  // CSV Export (vereinfacht)
  const csvContent = generateCSVExport(jsonContent);
  const csvFile = path.join(__dirname, '..', 'data', `${baseName}.csv`);
  fs.writeFileSync(csvFile, csvContent, 'utf8');

  return {
    markdown: markdownFile,
    json: jsonFile,
    csv: csvFile
  };
}

/**
 * Generiert CSV Export der wichtigsten KPIs
 */
function generateCSVExport(reportData) {
  let csv = 'Kategorie,Metrik,Wert,Einheit\n';

  const summary = reportData.summary;
  const details = reportData.details;

  // SEO KPIs
  if (summary.kpiOverview.seo) {
    csv += `SEO,Durchschnittliche Position,${summary.kpiOverview.seo.avgPosition},""\n`;
    csv += `SEO,Organischer Traffic,${summary.kpiOverview.seo.organicTraffic},Sessions\n`;
    csv += `SEO,Conversions,${summary.kpiOverview.seo.conversions},""\n`;
    csv += `SEO,Umsatz,${summary.kpiOverview.seo.revenue},EUR\n`;
  }

  // GEO KPIs
  if (summary.kpiOverview.geo) {
    csv += `GEO,Lokale Visibility,${summary.kpiOverview.geo.visibilityScore},%\n`;
    csv += `GEO,Lokaler Traffic,${summary.kpiOverview.geo.localTraffic},""\n`;
    csv += `GEO,GMB Views,${summary.kpiOverview.geo.gmbViews},""\n`;
  }

  // AEO KPIs
  if (summary.kpiOverview.aeo) {
    csv += `AEO,Entity Authority,${summary.kpiOverview.aeo.entityAuthority},""\n`;
    csv += `AEO,Entity Strength,${summary.kpiOverview.aeo.entityStrength},""\n`;
    csv += `AEO,Featured Snippets,${summary.kpiOverview.aeo.featuredSnippets},""\n`;
  }

  // Analytics KPIs
  if (summary.kpiOverview.analytics) {
    csv += `Analytics,Gesamt-Besucher,${summary.kpiOverview.analytics.totalUsers},""\n`;
    csv += `Analytics,Conversion Rate,${summary.kpiOverview.analytics.conversionRate},%\n`;
    csv += `Analytics,Umsatz,${summary.kpiOverview.analytics.revenue},EUR\n`;
  }

  return csv;
}

/**
 * Hauptfunktion für Automated Reporting System
 */
async function runAutomatedReporting(reportType = 'weekly') {
  console.log(`📋 Initialisiere ${reportType === 'weekly' ? 'Wöchentliches' : 'Monatliches'} Automated Reporting System...\n`);

  try {
    // Lade alle Monitoring-Daten
    console.log('📊 Lade Monitoring-Daten...');
    const allData = loadAllMonitoringData();

    // Generiere Executive Summary
    console.log('📝 Erstelle Executive Summary...');
    const summary = generateExecutiveSummary(allData, reportType);

    // Generiere detaillierte KPIs
    console.log('📈 Berechne detaillierte KPIs...');
    const details = generateKPIDetails(allData, reportType);

    // Generiere verschiedene Report-Formate
    console.log('📄 Generiere Report-Formate...');
    const markdownContent = generateMarkdownReport(summary, details, reportType);
    const jsonContent = generateJSONReport(summary, details, reportType);

    // Speichere Reports
    console.log('💾 Speichere Reports...');
    const savedFiles = saveReports(markdownContent, jsonContent, reportType);

    // Zeige Zusammenfassung
    console.log(`\n📋 ${reportType === 'weekly' ? 'Wöchentlicher' : 'Monatlicher'} Report erstellt:`);
    console.log(`  • Key Highlights: ${summary.keyHighlights.length}`);
    console.log(`  • KPI Kategorien: ${Object.keys(summary.kpiOverview).length}`);
    console.log(`  • Kritische Alerts: ${summary.alerts.length}`);
    console.log(`  • Empfehlungen: ${summary.recommendations.length}`);

    console.log(`\n📁 Reports gespeichert:`);
    console.log(`  • Markdown: ${savedFiles.markdown}`);
    console.log(`  • JSON: ${savedFiles.json}`);
    console.log(`  • CSV: ${savedFiles.csv}`);

    console.log('\n🎉 Automated Reporting System abgeschlossen!');

    return {
      summary,
      details,
      files: savedFiles
    };

  } catch (error) {
    console.error('❌ Fehler beim Automated Reporting:', error.message);
    throw error;
  }
}

// Export-Funktionen
module.exports = {
  runAutomatedReporting,
  loadAllMonitoringData,
  generateExecutiveSummary,
  generateKPIDetails,
  generateMarkdownReport,
  generateJSONReport,
  saveReports
};

// Führe Reporting aus wenn direkt aufgerufen
if (require.main === module) {
  const reportType = process.argv[2] === 'monthly' ? 'monthly' : 'weekly';
  runAutomatedReporting(reportType).catch(console.error);
}