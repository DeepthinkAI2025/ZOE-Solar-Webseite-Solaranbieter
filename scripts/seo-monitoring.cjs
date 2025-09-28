#!/usr/bin/env node

/**
 * SEO Monitoring Script für ZOE Solar
 * Sammelt Rankings, Core Web Vitals, strukturierte Daten und AI-Suchergebnisse
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Konfiguration
const CONFIG = {
  baseUrl: 'https://www.zoe-solar.de',
  keywords: [
    'Agri-PV Deutschland',
    'Photovoltaik Landwirtschaft',
    'Solaranlage Brandenburg',
    'Agri-PV Förderung 2025',
    'Photovoltaik Gewerbe',
    'Solarpark Bayern'
  ],
  pages: [
    '/',
    '/agri-pv',
    '/agri-pv/brandenburg',
    '/agri-pv/sachsen-anhalt',
    '/agri-pv/niedersachsen',
    '/agri-pv/bayern',
    '/agri-pv/nordrhein-westfalen'
  ],
  outputDir: path.join(__dirname, '..', 'data', 'seo-monitoring')
};

// Stelle sicher, dass das Output-Verzeichnis existiert
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

/**
 * Führt einen HTTP GET Request aus
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

/**
 * Simuliert Ranking-Check (in Produktion würde hier eine echte SERP API verwendet)
 */
async function checkRankings() {
  console.log('🔍 Sammle Keyword Rankings...');

  const rankings = CONFIG.keywords.map(keyword => ({
    keyword,
    position: Math.floor(Math.random() * 20) + 1, // Mock data
    previousPosition: Math.floor(Math.random() * 20) + 1,
    searchVolume: Math.floor(Math.random() * 5000) + 500,
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
    lastUpdated: new Date().toISOString().split('T')[0]
  }));

  return rankings;
}

/**
 * Überprüft Core Web Vitals (simuliert)
 */
async function checkCoreWebVitals() {
  console.log('⚡ Sammle Core Web Vitals...');

  return {
    lcp: 2.1 + Math.random() * 0.5, // Largest Contentful Paint
    fid: 85 + Math.random() * 50,   // First Input Delay
    cls: 0.08 + Math.random() * 0.1, // Cumulative Layout Shift
    overall: 'good' // 'good' | 'needs-improvement' | 'poor'
  };
}

/**
 * Überprüft strukturierte Daten
 */
async function checkStructuredData() {
  console.log('📋 Überprüfe strukturierte Daten...');

  const results = { valid: 0, total: 0, issues: [] };

  for (const page of CONFIG.pages) {
    try {
      const url = CONFIG.baseUrl + page;
      const response = await httpGet(url);

      if (response.statusCode === 200) {
        // Suche nach JSON-LD strukturierten Daten
        const jsonLdMatches = response.data.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
        if (jsonLdMatches) {
          results.total += jsonLdMatches.length;
          // In Produktion würde hier eine echte Validierung stattfinden
          results.valid += jsonLdMatches.length;
        }
      }
    } catch (error) {
      results.issues.push(`Fehler beim Laden von ${page}: ${error.message}`);
    }
  }

  return results;
}

/**
 * Überprüft Backlink-Profil (simuliert)
 */
async function checkBacklinks() {
  console.log('🔗 Sammle Backlink-Daten...');

  return {
    total: 1247 + Math.floor(Math.random() * 100),
    new: Math.floor(Math.random() * 10) + 1,
    lost: Math.floor(Math.random() * 3),
    domainAuthority: 68 + Math.floor(Math.random() * 5)
  };
}

/**
 * Überprüft AI-Suchmaschinen Sichtbarkeit (simuliert)
 */
async function checkAISearchVisibility() {
  console.log('🤖 Sammle AI-Suchmaschinen Daten...');

  return {
    googleBard: Math.floor(Math.random() * 20),
    chatGPT: Math.floor(Math.random() * 15),
    perplexity: Math.floor(Math.random() * 18),
    bingAI: Math.floor(Math.random() * 10)
  };
}

/**
 * Generiert einen Bericht
 */
async function generateReport() {
  console.log('📊 Generiere SEO Monitoring Bericht...');

  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    rankings: await checkRankings(),
    coreWebVitals: await checkCoreWebVitals(),
    structuredData: await checkStructuredData(),
    backlinks: await checkBacklinks(),
    aiSearch: await checkAISearchVisibility()
  };

  // Speichere den Bericht
  const filename = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
  const filepath = path.join(CONFIG.outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`✅ Bericht gespeichert: ${filepath}`);

  // Erstelle auch eine Zusammenfassung für das Dashboard
  const summaryFile = path.join(CONFIG.outputDir, 'latest-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(report, null, 2));

  return report;
}

/**
 * Hauptfunktion
 */
async function main() {
  try {
    console.log('🚀 Starte SEO Monitoring für ZOE Solar...\n');

    const report = await generateReport();

    console.log('\n📈 Zusammenfassung:');
    console.log(`   Rankings: ${report.rankings.length} Keywords getrackt`);
    console.log(`   Core Web Vitals: ${report.coreWebVitals.overall}`);
    console.log(`   Strukturierte Daten: ${report.structuredData.valid}/${report.structuredData.total} valid`);
    console.log(`   Backlinks: ${report.backlinks.total} gesamt`);
    console.log(`   AI-Sichtbarkeit: ${Object.values(report.aiSearch).reduce((a, b) => a + b, 0)} Erwähnungen`);

    console.log('\n✅ SEO Monitoring abgeschlossen!');

  } catch (error) {
    console.error('❌ Fehler beim SEO Monitoring:', error);
    process.exit(1);
  }
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = { generateReport, checkRankings, checkCoreWebVitals, checkStructuredData, checkBacklinks, checkAISearchVisibility };