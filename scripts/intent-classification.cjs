#!/usr/bin/env node

/**
 * Intent Classification für ZOE Solar
 * Klassifiziert Suchanfragen nach Suchintention (informational, commercial, transactional, navigational)
 */

const fs = require('fs');
const path = require('path');

/**
 * Intent-Klassifikationsregeln
 */
const INTENT_RULES = {
  informational: {
    keywords: [
      'wie', 'was', 'warum', 'wo', 'wann', 'wer', 'welche', 'wieviel',
      'anleitung', 'guide', 'leitfaden', 'tutorial', 'erklärung', 'tipps',
      'grundlagen', 'einführung', 'lernen', 'verstehen', 'bedeutet',
      'funktioniert', 'arbeitet', 'ist', 'sind', 'hat', 'haben'
    ],
    patterns: [
      /^\w+ wie \w+/i,
      /^\w+ was \w+/i,
      /^\w+ warum \w+/i,
      /anleitung/i,
      /leitfaden/i,
      /tutorial/i,
      /guide/i,
      /tipps/i,
      /grundlagen/i
    ],
    weight: 1.0
  },

  commercial: {
    keywords: [
      'beste', 'top', 'empfehlung', 'vergleich', 'gegenüberstellung', 'review',
      'erfahrung', 'meinung', 'bewertung', 'test', 'rating', 'ranking',
      'beliebt', 'populär', 'trend', 'neu', 'modern', 'aktuell'
    ],
    patterns: [
      /beste \w+/i,
      /top \w+/i,
      /vergleich/i,
      /review/i,
      /erfahrung/i,
      /bewertung/i
    ],
    weight: 0.9
  },

  transactional: {
    keywords: [
      'kaufen', 'bestellen', 'kaufen', 'preis', 'kosten', 'angebot', 'rabatt',
      'günstig', 'billig', 'teuer', 'verkauf', 'shop', 'online', 'kaufen',
      'mieten', 'leihen', 'abonnement', 'subscription', 'download', 'kaufen'
    ],
    patterns: [
      /kaufen/i,
      /bestellen/i,
      /preis/i,
      /kosten/i,
      /angebot/i,
      /rabatt/i
    ],
    weight: 0.8
  },

  navigational: {
    keywords: [
      'login', 'anmelden', 'registrieren', 'account', 'profil', 'einstellungen',
      'support', 'hilfe', 'kontakt', 'impressum', 'agb', 'datenschutz',
      'sitemap', 'suche', 'finden'
    ],
    patterns: [
      /login/i,
      /anmelden/i,
      /registrieren/i,
      /support/i,
      /hilfe/i,
      /kontakt/i
    ],
    weight: 0.7
  },

  local: {
    keywords: [
      'in der nähe', 'near me', 'bei mir', 'lokal', 'regional', 'stadt',
      'ort', 'adresse', 'öffnungszeiten', 'telefon', 'standort', 'filiale'
    ],
    patterns: [
      /in der nähe/i,
      /near me/i,
      /bei mir/i,
      /lokal/i,
      /regional/i
    ],
    weight: 0.6
  }
};

/**
 * Klassifiziert ein einzelnes Keyword
 */
function classifyIntent(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  const scores = {
    informational: 0,
    commercial: 0,
    transactional: 0,
    navigational: 0,
    local: 0
  };

  // Bewerte jedes Intent
  Object.entries(INTENT_RULES).forEach(([intent, rules]) => {
    let score = 0;

    // Keyword-Matches
    rules.keywords.forEach(ruleKeyword => {
      if (lowerKeyword.includes(ruleKeyword)) {
        score += rules.weight;
      }
    });

    // Pattern-Matches
    rules.patterns.forEach(pattern => {
      if (pattern.test(lowerKeyword)) {
        score += rules.weight * 1.5; // Patterns sind stärker
      }
    });

    // Längen-Bonus für Long-Tail Keywords
    const wordCount = lowerKeyword.split(/\s+/).length;
    if (wordCount >= 3) {
      score *= 1.2;
    }

    // Frage-Bonus
    if (lowerKeyword.match(/^(wie|was|warum|wo|wann|wer|welche)/i)) {
      if (intent === 'informational') {
        score *= 2;
      }
    }

    scores[intent] = score;
  });

  // Bestimme dominanten Intent
  const maxScore = Math.max(...Object.values(scores));
  const dominantIntent = Object.keys(scores).find(key => scores[key] === maxScore);

  // Fallback für unklare Fälle
  if (maxScore === 0) {
    // Analysiere Wortarten und Kontext
    if (lowerKeyword.includes('kosten') || lowerKeyword.includes('preis')) {
      return 'transactional';
    }
    if (lowerKeyword.includes('wie') || lowerKeyword.includes('was')) {
      return 'informational';
    }
    return 'commercial'; // Default
  }

  return {
    intent: dominantIntent,
    confidence: maxScore / Math.max(...Object.values(INTENT_RULES).map(r => r.weight)),
    scores: scores,
    reasoning: generateReasoning(keyword, dominantIntent, scores)
  };
}

/**
 * Generiert Erklärung für Klassifikation
 */
function generateReasoning(keyword, intent, scores) {
  const reasons = [];

  if (intent === 'informational') {
    if (keyword.match(/^(wie|was|warum|wo|wann|wer|welche)/i)) {
      reasons.push('Beginnt mit Fragewort');
    }
    if (keyword.includes('anleitung') || keyword.includes('leitfaden')) {
      reasons.push('Enthält Lern-Begriffe');
    }
  }

  if (intent === 'commercial') {
    if (keyword.includes('beste') || keyword.includes('top')) {
      reasons.push('Enthält Vergleichs-Begriffe');
    }
    if (keyword.includes('vergleich') || keyword.includes('review')) {
      reasons.push('Enthält Bewertungs-Begriffe');
    }
  }

  if (intent === 'transactional') {
    if (keyword.includes('kaufen') || keyword.includes('bestellen')) {
      reasons.push('Enthält Kauf-Begriffe');
    }
    if (keyword.includes('preis') || keyword.includes('kosten')) {
      reasons.push('Enthält Preis-Begriffe');
    }
  }

  if (intent === 'navigational') {
    if (keyword.includes('login') || keyword.includes('anmelden')) {
      reasons.push('Enthält Navigations-Begriffe');
    }
  }

  if (intent === 'local') {
    if (keyword.includes('near me') || keyword.includes('in der nähe')) {
      reasons.push('Enthält lokale Such-Begriffe');
    }
  }

  return reasons.length > 0 ? reasons : ['Basierend auf allgemeinen Mustern'];
}

/**
 * Batch-Klassifikation für mehrere Keywords
 */
function classifyIntents(keywords) {
  const results = [];

  keywords.forEach(keyword => {
    const classification = classifyIntent(keyword);
    results.push({
      keyword: keyword,
      intent: classification.intent,
      confidence: classification.confidence,
      scores: classification.scores,
      reasoning: classification.reasoning
    });
  });

  return results;
}

/**
 * Gruppiert Keywords nach Intent
 */
function groupByIntent(classifiedKeywords) {
  const groups = {
    informational: [],
    commercial: [],
    transactional: [],
    navigational: [],
    local: []
  };

  classifiedKeywords.forEach(item => {
    if (groups[item.intent]) {
      groups[item.intent].push(item);
    }
  });

  // Sortiere nach Confidence
  Object.keys(groups).forEach(intent => {
    groups[intent].sort((a, b) => b.confidence - a.confidence);
  });

  return groups;
}

/**
 * Generiert Content-Empfehlungen basierend auf Intent
 */
function generateContentRecommendations(classifiedKeywords) {
  const recommendations = [];

  const intentGroups = groupByIntent(classifiedKeywords);

  // Informational Content
  if (intentGroups.informational.length > 0) {
    recommendations.push({
      intent: 'informational',
      contentTypes: ['Blog Artikel', 'Leitfaden', 'FAQ', 'Tutorial'],
      examples: intentGroups.informational.slice(0, 3).map(k =>
        `"${k.keyword}": Leitfaden für Einsteiger"`
      ),
      priority: 'high'
    });
  }

  // Commercial Content
  if (intentGroups.commercial.length > 0) {
    recommendations.push({
      intent: 'commercial',
      contentTypes: ['Vergleichsartikel', 'Reviews', 'Top-Listen'],
      examples: intentGroups.commercial.slice(0, 3).map(k =>
        `"${k.keyword}": Vergleich der besten Anbieter"`
      ),
      priority: 'high'
    });
  }

  // Transactional Content
  if (intentGroups.transactional.length > 0) {
    recommendations.push({
      intent: 'transactional',
      contentTypes: ['Produktseiten', 'Preisrechner', 'Angebotsseiten'],
      examples: intentGroups.transactional.slice(0, 3).map(k =>
        `"${k.keyword}": Jetzt anfragen"`
      ),
      priority: 'medium'
    });
  }

  // Local Content
  if (intentGroups.local.length > 0) {
    recommendations.push({
      intent: 'local',
      contentTypes: ['Standortseiten', 'GMB Optimierung', 'Lokale Inhalte'],
      examples: intentGroups.local.slice(0, 3).map(k =>
        `"${k.keyword}": Standort Berlin"`
      ),
      priority: 'medium'
    });
  }

  return recommendations;
}

/**
 * Analysiert SERP-Features für verschiedene Intents
 */
function analyzeSERPFeatures(classifiedKeywords) {
  const serpAnalysis = {
    informational: {
      features: ['Featured Snippets', 'Knowledge Panels', 'People Also Ask'],
      strategy: 'Optimiere für Position 1-3, strukturiere Content für Snippets'
    },
    commercial: {
      features: ['Local Pack', 'Reviews', 'Comparison Shopping'],
      strategy: 'Baue Autorität auf, sammle Reviews, erstelle Vergleichs-Content'
    },
    transactional: {
      features: ['Shopping Results', 'Product Carousels', 'Price Comparison'],
      strategy: 'Optimiere für Conversions, klare CTAs, Vertrauenssignale'
    },
    navigational: {
      features: ['Sitelinks', 'Knowledge Panel', 'Brand Results'],
      strategy: 'Stärke Brand-Signale, optimiere interne Verlinkung'
    },
    local: {
      features: ['Local Pack', 'Maps Integration', 'GMB Listings'],
      strategy: 'Optimiere GMB, baue lokale Zitate, sammle Reviews'
    }
  };

  const analysis = {};

  Object.keys(serpAnalysis).forEach(intent => {
    const keywords = classifiedKeywords.filter(k => k.intent === intent);
    if (keywords.length > 0) {
      analysis[intent] = {
        ...serpAnalysis[intent],
        keywordCount: keywords.length,
        topKeywords: keywords.slice(0, 5).map(k => k.keyword)
      };
    }
  });

  return analysis;
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🎯 Starte Intent Classification...\n');

  // Beispiel-Keywords für Agri-PV
  const sampleKeywords = [
    'wie funktioniert agri photovoltaik',
    'beste agri pv anbieter',
    'agri photovoltaik kaufen',
    'zoe solar login',
    'agri pv in der nähe',
    'warum agri photovoltaik',
    'agri pv vergleich',
    'agri photovoltaik preis',
    'agri pv beratung',
    'top agri photovoltaik',
    'agri photovoltaik installation',
    'was ist agri photovoltaik',
    'agri pv förderung',
    'agri photovoltaik erfahrungen'
  ];

  console.log(`📊 Klassifiziere ${sampleKeywords.length} Keywords...`);

  // Klassifiziere alle Keywords
  const classifiedKeywords = classifyIntents(sampleKeywords);

  console.log('✅ Intent-Klassifikation abgeschlossen');

  // Gruppiere nach Intent
  const intentGroups = groupByIntent(classifiedKeywords);

  console.log('\n📈 Intent-Verteilung:');
  Object.entries(intentGroups).forEach(([intent, keywords]) => {
    console.log(`  • ${intent.charAt(0).toUpperCase() + intent.slice(1)}: ${keywords.length} Keywords`);
  });

  // Zeige Beispiele
  console.log('\n🎯 Beispiel-Klassifikationen:');
  classifiedKeywords.slice(0, 8).forEach((item, index) => {
    console.log(`  ${index + 1}. "${item.keyword}"`);
    console.log(`     Intent: ${item.intent} (${Math.round(item.confidence * 100)}% confidence)`);
    console.log(`     Grund: ${item.reasoning.join(', ')}`);
  });

  // Generiere Content-Empfehlungen
  const recommendations = generateContentRecommendations(classifiedKeywords);
  console.log('\n💡 Content-Empfehlungen:');
  recommendations.forEach(rec => {
    console.log(`  • ${rec.intent.toUpperCase()}: ${rec.contentTypes.join(', ')}`);
    console.log(`    Beispiele: ${rec.examples.slice(0, 2).join(', ')}`);
  });

  // SERP-Analyse
  const serpAnalysis = analyzeSERPFeatures(classifiedKeywords);
  console.log('\n🔍 SERP-Strategien:');
  Object.entries(serpAnalysis).forEach(([intent, analysis]) => {
    console.log(`  • ${intent.toUpperCase()}: ${analysis.features.join(', ')}`);
    console.log(`    Strategie: ${analysis.strategy}`);
  });

  // Speichere Ergebnisse
  const outputFile = path.join(__dirname, '..', 'data', 'intent-classification.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    classifiedKeywords,
    intentGroups,
    recommendations,
    serpAnalysis,
    summary: {
      totalKeywords: sampleKeywords.length,
      intents: Object.keys(intentGroups).map(intent => ({
        intent,
        count: intentGroups[intent].length,
        percentage: Math.round((intentGroups[intent].length / sampleKeywords.length) * 100)
      }))
    }
  }, null, 2));

  console.log(`\n💾 Intent Classification gespeichert: ${outputFile}`);
  console.log('\n🎉 Intent Classification abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  classifyIntent,
  classifyIntents,
  groupByIntent,
  generateContentRecommendations,
  analyzeSERPFeatures
};