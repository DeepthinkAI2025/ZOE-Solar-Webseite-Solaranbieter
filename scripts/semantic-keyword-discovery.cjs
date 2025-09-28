#!/usr/bin/env node

/**
 * Semantic Keyword Discovery für ZOE Solar
 * Findet semantisch verwandte Keywords und Long-Tail-Varianten
 */

const fs = require('fs');
const path = require('path');

/**
 * Extrahiert Basis-Keywords aus Seed-Keywords
 */
function extractBaseKeywords(seedKeywords) {
  const baseKeywords = new Set();

  seedKeywords.forEach(keyword => {
    // Entferne Stop-Wörter und teile in Basis-Komponenten
    const words = keyword.toLowerCase()
      .replace(/[^\w\säöüß]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !isStopWord(word));

    words.forEach(word => baseKeywords.add(word));
  });

  return Array.from(baseKeywords);
}

/**
 * Prüft ob Wort ein Stop-Wort ist
 */
function isStopWord(word) {
  const stopWords = [
    'der', 'die', 'das', 'und', 'oder', 'mit', 'für', 'von', 'zu', 'auf',
    'ist', 'hat', 'war', 'wird', 'sind', 'haben', 'wie', 'was', 'warum',
    'wo', 'wann', 'wer', 'welche', 'welcher', 'welches', 'eine', 'einen',
    'einer', 'einem', 'ein', 'als', 'aus', 'bei', 'bis', 'durch', 'gegen',
    'ohne', 'um', 'nach', 'seit', 'zwischen', 'über', 'unter', 'vor',
    'hinter', 'neben', 'in', 'an', 'auf', 'hinter', 'über', 'unter'
  ];
  return stopWords.includes(word.toLowerCase());
}

/**
 * Generiert semantische Variationen
 */
function generateSemanticVariations(baseKeyword, context = 'agri-pv') {
  const variations = new Set();
  variations.add(baseKeyword);

  // Frage-Varianten
  const questionStarters = ['wie', 'was', 'warum', 'wo', 'wann', 'wer', 'welche'];
  questionStarters.forEach(starter => {
    variations.add(`${starter} ${baseKeyword}`);
  });

  // Präpositionen
  const prepositions = ['für', 'mit', 'ohne', 'gegen', 'bei'];
  prepositions.forEach(prep => {
    variations.add(`${baseKeyword} ${prep}`);
    variations.add(`${prep} ${baseKeyword}`);
  });

  // Adjektive für Agri-PV Kontext
  if (context === 'agri-pv') {
    const adjectives = ['moderne', 'professionelle', 'kostengünstige', 'effiziente', 'nachhaltige'];
    adjectives.forEach(adj => {
      variations.add(`${adj} ${baseKeyword}`);
      variations.add(`${baseKeyword} ${adj}`);
    });
  }

  // Kombinationen
  const combinations = ['kosten', 'preis', 'anbieter', 'beratung', 'installation'];
  combinations.forEach(combo => {
    variations.add(`${baseKeyword} ${combo}`);
    variations.add(`${combo} ${baseKeyword}`);
  });

  return Array.from(variations);
}

/**
 * Findet verwandte Keywords durch Assoziationen
 */
function findRelatedKeywords(keyword, domain = 'agri-pv') {
  const associations = {
    'agri-pv': {
      'photovoltaik': ['solar', 'sonne', 'strom', 'energie', 'erneuerbar'],
      'landwirtschaft': ['bauern', 'felder', 'ernte', 'acker', 'hof'],
      'förderung': ['kfw', 'bafa', 'zuschuss', 'subvention', 'finanzierung'],
      'beratung': ['planung', 'berater', 'experte', 'unterstützung'],
      'installation': ['montage', 'aufbau', 'techniker', 'handwerker']
    }
  };

  const related = new Set();
  const keywordLower = keyword.toLowerCase();

  // Direkte Assoziationen
  if (associations[domain] && associations[domain][keywordLower]) {
    associations[domain][keywordLower].forEach(word => related.add(word));
  }

  // Umgekehrte Suche
  Object.entries(associations[domain] || {}).forEach(([key, values]) => {
    if (values.includes(keywordLower)) {
      related.add(key);
      values.forEach(value => related.add(value));
    }
  });

  return Array.from(related);
}

/**
 * Generiert Long-Tail Keywords
 */
function generateLongTailKeywords(baseKeywords, context = 'agri-pv') {
  const longTails = new Set();

  const modifiers = {
    'agri-pv': [
      'für landwirte', 'in deutschland', 'mit förderung', 'kosten', 'preis',
      'anbieter', 'beratung', 'installation', 'vorteile', 'erfahrungen',
      '2024', '2025', 'zukunft', 'trend', 'guide', 'anleitung', 'tipps'
    ]
  };

  baseKeywords.forEach(base => {
    (modifiers[context] || []).forEach(modifier => {
      longTails.add(`${base} ${modifier}`);
      longTails.add(`${modifier} ${base}`);
    });
  });

  // Frage-basierte Long-Tails
  const questions = [
    'wie funktioniert', 'was kostet', 'warum lohnt sich', 'wo finde ich',
    'wann rechnet sich', 'wer bietet', 'welche vorteile hat'
  ];

  baseKeywords.forEach(base => {
    questions.forEach(question => {
      longTails.add(`${question} ${base}`);
    });
  });

  return Array.from(longTails);
}

/**
 * Berechnet Keyword-Potenzial
 */
function calculateKeywordPotential(keyword, searchVolume = 100, competition = 0.5) {
  // Einfache Heuristik für Opportunity Score
  const length = keyword.split(' ').length;
  const hasQuestion = keyword.match(/^(wie|was|warum|wo|wann|wer|welche)/i);
  const hasLocation = keyword.toLowerCase().includes('deutschland') ||
                     keyword.toLowerCase().includes('berlin') ||
                     keyword.toLowerCase().includes('bayern');

  let score = searchVolume * (1 - competition);

  // Bonusse
  if (length >= 3) score *= 1.5; // Long-tail Bonus
  if (hasQuestion) score *= 1.3; // Question Bonus
  if (hasLocation) score *= 1.2; // Location Bonus

  return Math.round(score);
}

/**
 * Erstellt semantisches Keyword-Netzwerk
 */
function buildSemanticNetwork(seedKeywords, domain = 'agri-pv') {
  const network = {
    nodes: [],
    edges: []
  };

  const processedKeywords = new Set();

  seedKeywords.forEach(seed => {
    if (processedKeywords.has(seed)) return;

    const node = {
      keyword: seed,
      type: 'seed',
      variations: generateSemanticVariations(seed, domain),
      related: findRelatedKeywords(seed, domain),
      longTails: generateLongTailKeywords([seed], domain),
      potential: calculateKeywordPotential(seed)
    };

    network.nodes.push(node);
    processedKeywords.add(seed);

    // Verbindungen zu verwandten Keywords
    node.related.forEach(related => {
      if (!processedKeywords.has(related)) {
        network.edges.push({
          from: seed,
          to: related,
          type: 'related'
        });
      }
    });

    // Verbindungen zu Variationen
    node.variations.forEach(variation => {
      if (variation !== seed && !processedKeywords.has(variation)) {
        network.edges.push({
          from: seed,
          to: variation,
          type: 'variation'
        });
      }
    });
  });

  return network;
}

/**
 * Generiert Content-Ideen basierend auf Keywords
 */
function generateContentIdeasFromKeywords(keywords) {
  const contentIdeas = [];

  keywords.forEach(keyword => {
    const intent = classifyIntent(keyword);

    let contentType = 'blog';
    let title = '';

    switch (intent) {
      case 'informational':
        contentType = 'blog';
        title = `${keyword}: Der ultimative Leitfaden für Landwirte`;
        break;
      case 'commercial':
        contentType = 'landingpage';
        title = `${keyword} - Professionelle Lösungen für Ihren Betrieb`;
        break;
      case 'transactional':
        contentType = 'product';
        title = `${keyword} - Jetzt anfragen`;
        break;
    }

    contentIdeas.push({
      keyword: keyword,
      intent: intent,
      contentType: contentType,
      title: title,
      potentialTraffic: Math.round(calculateKeywordPotential(keyword) * 0.1),
      priority: calculateKeywordPotential(keyword) > 1000 ? 'high' : 'medium'
    });
  });

  return contentIdeas.sort((a, b) => b.potentialTraffic - a.potentialTraffic);
}

/**
 * Klassifiziert Suchintention
 */
function classifyIntent(keyword) {
  const lower = keyword.toLowerCase();

  // Transactional
  if (lower.includes('kaufen') || lower.includes('bestellen') ||
      lower.includes('preis') || lower.includes('kosten') ||
      lower.includes('anbieter') || lower.includes('anfrage')) {
    return 'transactional';
  }

  // Commercial
  if (lower.includes('beste') || lower.includes('top') ||
      lower.includes('vergleich') || lower.includes('review') ||
      lower.includes('erfahrung')) {
    return 'commercial';
  }

  // Informational (Default)
  return 'informational';
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🔍 Starte Semantic Keyword Discovery...\n');

  // Seed Keywords für Agri-PV
  const seedKeywords = [
    'Agri-Photovoltaik',
    'Solaranlage Landwirtschaft',
    'PV Anlage Feld',
    'Förderung Agri-PV',
    'Agri-PV Kosten',
    'Agri-PV Beratung',
    'Agri-PV Installation'
  ];

  console.log(`🌱 Analysiere ${seedKeywords.length} Seed Keywords...`);

  // Baue semantisches Netzwerk
  const semanticNetwork = buildSemanticNetwork(seedKeywords, 'agri-pv');

  console.log(`✅ Semantisches Netzwerk erstellt mit ${semanticNetwork.nodes.length} Nodes`);

  // Sammle alle Keywords
  const allKeywords = new Set();
  semanticNetwork.nodes.forEach(node => {
    allKeywords.add(node.keyword);
    node.variations.forEach(v => allKeywords.add(v));
    node.related.forEach(r => allKeywords.add(r));
    node.longTails.forEach(lt => allKeywords.add(lt));
  });

  console.log(`📊 ${allKeywords.size} einzigartige Keywords gefunden`);

  // Generiere Content-Ideen
  const contentIdeas = generateContentIdeasFromKeywords(Array.from(allKeywords));

  console.log(`💡 ${contentIdeas.length} Content-Ideen generiert`);

  // Zeige Top-Keywords
  console.log('\n🎯 Top Semantic Keywords:');
  semanticNetwork.nodes.slice(0, 5).forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.keyword}`);
    console.log(`     Variationen: ${node.variations.length}`);
    console.log(`     Verwandte: ${node.related.length}`);
    console.log(`     Long-Tails: ${node.longTails.length}`);
    console.log(`     Potenzial: ${node.potential}`);
  });

  // Zeige Top-Content-Ideen
  console.log('\n📝 Top Content-Ideen:');
  contentIdeas.slice(0, 5).forEach((idea, index) => {
    console.log(`  ${index + 1}. ${idea.contentType.toUpperCase()}: "${idea.title}"`);
    console.log(`     Keyword: ${idea.keyword} (${idea.intent})`);
    console.log(`     Geschätzter Traffic: ${idea.potentialTraffic}/Monat`);
  });

  // Speichere Ergebnisse
  const outputFile = path.join(__dirname, '..', 'data', 'semantic-keyword-discovery.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    seedKeywords,
    semanticNetwork,
    allKeywords: Array.from(allKeywords),
    contentIdeas,
    summary: {
      totalKeywords: allKeywords.size,
      totalContentIdeas: contentIdeas.length,
      highPriorityIdeas: contentIdeas.filter(i => i.priority === 'high').length
    }
  }, null, 2));

  console.log(`\n💾 Semantic Keyword Discovery gespeichert: ${outputFile}`);
  console.log('\n🎉 Semantic Keyword Discovery abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  extractBaseKeywords,
  generateSemanticVariations,
  findRelatedKeywords,
  generateLongTailKeywords,
  buildSemanticNetwork,
  generateContentIdeasFromKeywords,
  classifyIntent
};