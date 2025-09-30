#!/usr/bin/env node

/**
 * User Intent Research Framework für SEO 2026
 * Analysiert Suchanfragen, SERP-Features und User-Verhalten
 * zur Optimierung der Content-Strategie
 */

const fs = require('fs');
const path = require('path');

// Konfiguration
const CONFIG = {
  keywords: [
    'photovoltaik gewerbe',
    'photovoltaik industrie',
    'photovoltaik landwirtschaft',
    'solaranlagen unternehmen',
    'photovoltaik kosten',
    'photovoltaik förderung'
  ],
  searchVolumeThreshold: 100,
  outputFile: path.join(__dirname, '../data/user-intent-analysis.json')
};

// User Intent Kategorien basierend auf SEO 2026 Framework
const INTENT_CATEGORIES = {
  INFORMATIONAL: {
    indicators: ['wie', 'was', 'warum', 'wann', 'wo', 'guide', 'anleitung', 'erklärung'],
    contentType: 'Educational Content',
    priority: 'High'
  },
  COMMERCIAL: {
    indicators: ['kosten', 'preis', 'förderung', 'finanzierung', 'leasing', 'kaufen', 'bestellen'],
    contentType: 'Commercial Content',
    priority: 'High'
  },
  NAVIGATIONAL: {
    indicators: ['website', 'kontakt', 'adresse', 'telefon', 'öffnungszeiten'],
    contentType: 'Local/Brand Content',
    priority: 'Medium'
  },
  TRANSACTIONAL: {
    indicators: ['anfrage', 'beratung', 'angebot', 'termin', 'kontakt'],
    contentType: 'Conversion Content',
    priority: 'High'
  }
};

// SERP Feature Analyse
const SERP_FEATURES = {
  'featured_snippet': { weight: 1.5, intent: 'INFORMATIONAL' },
  'local_pack': { weight: 1.3, intent: 'NAVIGATIONAL' },
  'knowledge_panel': { weight: 1.4, intent: 'INFORMATIONAL' },
  'shopping_results': { weight: 1.2, intent: 'COMMERCIAL' },
  'video_carousel': { weight: 1.1, intent: 'INFORMATIONAL' },
  'people_also_ask': { weight: 1.3, intent: 'INFORMATIONAL' }
};

/**
 * Analysiert eine Suchanfrage und bestimmt den User Intent
 */
function analyzeIntent(query) {
  const queryLower = query.toLowerCase();
  let bestMatch = { category: 'UNKNOWN', confidence: 0, indicators: [] };

  for (const [category, config] of Object.entries(INTENT_CATEGORIES)) {
    let matches = 0;
    const foundIndicators = [];

    for (const indicator of config.indicators) {
      if (queryLower.includes(indicator)) {
        matches++;
        foundIndicators.push(indicator);
      }
    }

    const confidence = matches / config.indicators.length;

    if (confidence > bestMatch.confidence) {
      bestMatch = {
        category,
        confidence,
        indicators: foundIndicators,
        contentType: config.contentType,
        priority: config.priority
      };
    }
  }

  return bestMatch;
}

/**
 * Simuliert SERP Analyse für Keywords
 * In Produktion würde dies echte API-Calls verwenden
 */
function simulateSERPAnalysis(keyword) {
  const features = [];
  const intent = analyzeIntent(keyword);

  // Simuliere SERP Features basierend auf Keyword-Typ
  if (intent.category === 'INFORMATIONAL') {
    features.push('featured_snippet', 'people_also_ask');
  } else if (intent.category === 'COMMERCIAL') {
    features.push('shopping_results', 'local_pack');
  } else if (intent.category === 'NAVIGATIONAL') {
    features.push('local_pack', 'knowledge_panel');
  }

  return {
    keyword,
    intent: intent.category,
    serpFeatures: features,
    competition: Math.random() * 100,
    searchVolume: Math.floor(Math.random() * 10000) + 100
  };
}

/**
 * Erstellt Content-Empfehlungen basierend auf Intent-Analyse
 */
function generateContentRecommendations(analysis) {
  const recommendations = [];

  analysis.forEach(item => {
    const intent = INTENT_CATEGORIES[item.intent];

    if (intent) {
      recommendations.push({
        keyword: item.keyword,
        intent: item.intent,
        contentType: intent.contentType,
        priority: intent.priority,
        recommendations: generateSpecificRecommendations(item, intent)
      });
    }
  });

  return recommendations;
}

/**
 * Generiert spezifische Content-Empfehlungen
 */
function generateSpecificRecommendations(analysis, intentConfig) {
  const recommendations = [];

  switch (analysis.intent) {
    case 'INFORMATIONAL':
      recommendations.push(
        `Erstelle umfassenden Guide: "${analysis.keyword} - Komplette Anleitung"`,
        `Entwickle FAQ-Section für häufige Fragen zu ${analysis.keyword}`,
        `Erstelle Video-Tutorial für Schritt-für-Schritt Anleitung`,
        `Biete Checkliste/Download für ${analysis.keyword} an`
      );
      break;

    case 'COMMERCIAL':
      recommendations.push(
        `Erstelle Vergleichsseite: "Beste ${analysis.keyword} Anbieter Vergleich"`,
        `Entwickle Kostenrechner für ${analysis.keyword}`,
        `Erstelle Förderübersicht für ${analysis.keyword}`,
        `Biete kostenlose Erstberatung für ${analysis.keyword} an`
      );
      break;

    case 'NAVIGATIONAL':
      recommendations.push(
        `Optimiere lokale Präsenz für ${analysis.keyword}`,
        `Erstelle Standort-übergreifende Service-Seiten`,
        `Entwickle lokale Fallstudien für ${analysis.keyword}`,
        `Implementiere lokale Schema-Markup`
      );
      break;

    case 'TRANSACTIONAL':
      recommendations.push(
        `Erstelle Conversion-optimierte Landingpage für ${analysis.keyword}`,
        `Implementiere Lead-Magnet für ${analysis.keyword}`,
        `Entwickle Terminbuchungssystem für ${analysis.keyword}`,
        `Erstelle Vertrauenssignale und Testimonials`
      );
      break;
  }

  return recommendations;
}

/**
 * Führt die komplette User Intent Analyse durch
 */
async function runUserIntentResearch() {
  console.log('🚀 Starte User Intent Research Framework...\n');

  try {
    // Schritt 1: Keyword-Analyse
    console.log('📊 Analysiere Keywords...');
    const keywordAnalysis = CONFIG.keywords.map(keyword => {
      const intent = analyzeIntent(keyword);
      const serpData = simulateSERPAnalysis(keyword);

      return {
        keyword,
        intent: intent.category,
        confidence: intent.confidence,
        indicators: intent.indicators,
        contentType: intent.contentType,
        priority: intent.priority,
        searchVolume: serpData.searchVolume,
        competition: serpData.competition,
        serpFeatures: serpData.serpFeatures
      };
    });

    // Schritt 2: Content-Empfehlungen generieren
    console.log('💡 Generiere Content-Empfehlungen...');
    const contentRecommendations = generateContentRecommendations(keywordAnalysis);

    // Schritt 3: Cluster-Strategie entwickeln
    console.log('🔗 Entwickle Cluster-Strategie...');
    const clusterStrategy = {
      pillarContent: 'photovoltaik-gewerbe',
      supportingAssets: keywordAnalysis.map(k => ({
        keyword: k.keyword,
        intent: k.intent,
        url: `/photovoltaik-${k.keyword.split(' ')[1]}`,
        priority: k.priority
      })),
      internalLinking: generateInternalLinkingStrategy(keywordAnalysis)
    };

    // Schritt 4: Ergebnisse speichern
    const results = {
      timestamp: new Date().toISOString(),
      analysis: keywordAnalysis,
      recommendations: contentRecommendations,
      clusterStrategy,
      summary: {
        totalKeywords: keywordAnalysis.length,
        intentDistribution: keywordAnalysis.reduce((acc, curr) => {
          acc[curr.intent] = (acc[curr.intent] || 0) + 1;
          return acc;
        }, {}),
        highPriorityKeywords: keywordAnalysis.filter(k => k.priority === 'High').length,
        totalSearchVolume: keywordAnalysis.reduce((sum, k) => sum + k.searchVolume, 0)
      }
    };

    // Speichere Ergebnisse
    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(results, null, 2));
    console.log(`✅ Analyse gespeichert in: ${CONFIG.outputFile}`);

    // Ausgabe der wichtigsten Erkenntnisse
    console.log('\n📈 Analyse-Ergebnisse:');
    console.log(`   • Analysierte Keywords: ${results.summary.totalKeywords}`);
    console.log(`   • Gesamtes Suchvolumen: ${results.summary.totalSearchVolume.toLocaleString()}`);
    console.log(`   • High-Priority Keywords: ${results.summary.highPriorityKeywords}`);
    console.log(`   • Intent-Verteilung:`, JSON.stringify(results.summary.intentDistribution, null, 2));

    console.log('\n🎯 Top-Empfehlungen:');
    contentRecommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec.keyword}: ${rec.contentType}`);
      console.log(`      → ${rec.recommendations[0]}`);
    });

  } catch (error) {
    console.error('❌ Fehler bei der User Intent Analyse:', error.message);
    process.exit(1);
  }
}

/**
 * Generiert eine Internal Linking Strategie
 */
function generateInternalLinkingStrategy(analysis) {
  return {
    pillarToSupporting: analysis.map(k => ({
      from: '/photovoltaik-gewerbe',
      to: `/photovoltaik-${k.keyword.split(' ')[1]}`,
      anchor: k.keyword,
      intent: k.intent
    })),
    supportingToPillar: analysis.map(k => ({
      from: `/photovoltaik-${k.keyword.split(' ')[1]}`,
      to: '/photovoltaik-gewerbe',
      anchor: 'Zurück zur Übersicht',
      intent: 'NAVIGATIONAL'
    })),
    crossLinking: [
      {
        from: '/photovoltaik-industrie',
        to: '/photovoltaik-landwirtschaft',
        anchor: 'Vergleich Industrie vs. Landwirtschaft',
        intent: 'COMMERCIAL'
      }
    ]
  };
}

// Führe Analyse aus wenn direkt aufgerufen
if (require.main === module) {
  runUserIntentResearch();
}

module.exports = {
  analyzeIntent,
  simulateSERPAnalysis,
  generateContentRecommendations,
  runUserIntentResearch
};