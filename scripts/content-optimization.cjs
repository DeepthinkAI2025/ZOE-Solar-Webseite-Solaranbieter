#!/usr/bin/env node

/**
 * Content-Optimierung für ZOE Solar
 * Generiert Content-Vorschläge basierend auf Keyword-Analyse
 */

const fs = require('fs');
const path = require('path');

// Importiere Keyword- und SEO-Daten
let keywordAnalysis = {};
let seoReport = {};

try {
  keywordAnalysis = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'keyword-analysis.json'), 'utf8'));
  seoReport = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'seo-report.json'), 'utf8'));
} catch (error) {
  console.warn('⚠️  Daten nicht gefunden. Verwende Standard-Daten.');
}

/**
 * Generiert Blog-Artikel Ideen
 */
function generateBlogIdeas(keywords, positions) {
  const blogIdeas = [];

  // Finde Keywords mit informational intent und hoher opportunity
  const informationalKeywords = keywords.filter(k =>
    k.intent === 'informational' &&
    k.opportunityScore > 1000 &&
    (!positions || positions[k.keyword]?.position > 15)
  );

  informationalKeywords.forEach(keyword => {
    const position = positions?.[keyword.keyword]?.position || 50;

    blogIdeas.push({
      type: 'blog',
      title: `${keyword.keyword}: Der ultimative Leitfaden für Landwirte`,
      keyword: keyword.keyword,
      targetPosition: Math.max(1, position - 5),
      estimatedTraffic: Math.round(keyword.searchVolume * 0.3),
      opportunityScore: keyword.opportunityScore,
      category: keyword.category,
      contentOutline: generateContentOutline(keyword.keyword, 'blog'),
      seoTips: generateSEOTips(keyword.keyword, position),
      priority: keyword.priority,
      estimatedWordCount: 2000 + Math.floor(Math.random() * 1000),
      internalLinks: generateInternalLinks(keyword.keyword),
      publishDate: null,
      status: 'draft'
    });
  });

  return blogIdeas.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Generiert Landingpage-Ideen
 */
function generateLandingPageIdeas(keywords, positions) {
  const landingIdeas = [];

  // Finde Keywords mit transactional intent
  const transactionalKeywords = keywords.filter(k =>
    (k.intent === 'transactional' || k.intent === 'commercial') &&
    k.opportunityScore > 1200
  );

  transactionalKeywords.forEach(keyword => {
    const position = positions?.[keyword.keyword]?.position || 50;

    landingIdeas.push({
      type: 'landingpage',
      title: `${keyword.keyword} - Professionelle Agri-PV Lösungen`,
      keyword: keyword.keyword,
      targetPosition: Math.max(1, position - 3),
      estimatedTraffic: Math.round(keyword.searchVolume * 0.4),
      opportunityScore: keyword.opportunityScore,
      category: keyword.category,
      conversionGoal: 'lead_generation',
      ctaText: 'Kostenlose Beratung anfordern',
      contentSections: generateLandingSections(keyword.keyword),
      seoTips: generateSEOTips(keyword.keyword, position),
      priority: keyword.priority,
      estimatedWordCount: 800 + Math.floor(Math.random() * 400),
      internalLinks: generateInternalLinks(keyword.keyword),
      publishDate: null,
      status: 'draft'
    });
  });

  return landingIdeas.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Generiert FAQ-Content-Ideen
 */
function generateFAQIdeas(keywords) {
  const faqIdeas = [];

  // Finde Long-Tail Keywords mit informational intent
  const faqKeywords = keywords.filter(k =>
    k.intent === 'informational' &&
    k.keyword.split(' ').length >= 3 &&
    (k.keyword.toLowerCase().includes('wie') ||
     k.keyword.toLowerCase().includes('was') ||
     k.keyword.toLowerCase().includes('warum'))
  );

  faqKeywords.forEach(keyword => {
    faqIdeas.push({
      type: 'faq',
      title: `FAQ: ${keyword.keyword}`,
      keyword: keyword.keyword,
      estimatedTraffic: Math.round(keyword.searchVolume * 0.2),
      opportunityScore: keyword.opportunityScore,
      category: keyword.category,
      questions: generateFAQQuestions(keyword.keyword),
      priority: keyword.priority,
      estimatedWordCount: 600 + Math.floor(Math.random() * 300),
      internalLinks: generateInternalLinks(keyword.keyword),
      publishDate: null,
      status: 'draft'
    });
  });

  return faqIdeas.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Generiert Content-Outline für Blog-Artikel
 */
function generateContentOutline(keyword, type) {
  const outlines = {
    'Agri-PV': [
      'Was ist Agri-PV und wie funktioniert es?',
      'Vorteile der Agri-Photovoltaik für Landwirte',
      'Kosten und Wirtschaftlichkeit',
      'Rechtliche Rahmenbedingungen und Förderungen',
      'Planung und Umsetzung einer Agri-PV Anlage',
      'Zukunftsaussichten und Entwicklungen'
    ],
    'Agri-PV Förderung': [
      'Aktuelle Förderprogramme für Agri-PV',
      'KfW-Förderung im Detail',
      'BAFA-Förderung für Landwirte',
      'EEG-Vergütung für Agri-PV',
      'Steuervorteile und Abschreibungen',
      'Antragsprozess und wichtige Fristen'
    ],
    'Agri-PV Kosten': [
      'Kostenelemente einer Agri-PV Anlage',
      'Investitionskosten im Überblick',
      'Laufende Betriebskosten',
      'Kosten-Nutzen-Analyse',
      'Finanzierungsmöglichkeiten',
      'Amortisationszeiten und Rendite'
    ]
  };

  return outlines[keyword] || [
    `Einführung in ${keyword}`,
    'Grundlagen und Funktionsweise',
    'Vorteile und Nutzen',
    'Praktische Umsetzung',
    'Kosten und Wirtschaftlichkeit',
    'Fazit und Handlungsempfehlungen'
  ];
}

/**
 * Generiert SEO-Tipps für Keywords
 */
function generateSEOTips(keyword, currentPosition) {
  const tips = [
    `Optimiere Title-Tag für "${keyword}"`,
    `Integriere "${keyword}" natürlich in den ersten 100 Wörtern`,
    `Erstelle eine H1-Überschrift mit "${keyword}"`,
    'Füge interne Links zu verwandten Themen hinzu',
    'Optimiere Meta-Description für höhere CTR'
  ];

  if (currentPosition > 20) {
    tips.push('Verbessere On-Page-SEO für bessere Rankings');
    tips.push('Erhöhe Content-Qualität und -Tiefe');
  }

  if (currentPosition > 10) {
    tips.push('Baue mehr Backlinks auf');
    tips.push('Verbessere technische SEO');
  }

  return tips;
}

/**
 * Generiert interne Link-Vorschläge
 */
function generateInternalLinks(keyword) {
  const links = [
    '/agri-pv',
    '/foerderungen',
    '/referenzen',
    '/kontakt'
  ];

  if (keyword.toLowerCase().includes('kosten') || keyword.toLowerCase().includes('preis')) {
    links.push('/preise');
  }

  if (keyword.toLowerCase().includes('beratung') || keyword.toLowerCase().includes('planung')) {
    links.push('/beratung');
  }

  return links;
}

/**
 * Generiert Landingpage-Sektionen
 */
function generateLandingSections(keyword) {
  return [
    {
      title: 'Ihre Vorteile',
      content: 'Warum Sie sich für ZOE Solar entscheiden sollten'
    },
    {
      title: 'Unsere Lösungen',
      content: `Spezialisierte ${keyword} Angebote`
    },
    {
      title: 'Referenzen',
      content: 'Erfolgreiche Projekte unserer Kunden'
    },
    {
      title: 'Kostenloses Angebot',
      content: 'Fordern Sie jetzt Ihr persönliches Angebot an'
    }
  ];
}

/**
 * Generiert FAQ-Fragen
 */
function generateFAQQuestions(keyword) {
  const faqMap = {
    'Wie funktioniert Agri-PV': [
      'Was ist der Unterschied zwischen normaler PV und Agri-PV?',
      'Wie hoch ist der Stromertrag bei Agri-PV?',
      'Welche Flächen eignen sich für Agri-PV?',
      'Wie lange dauert die Planung und Installation?'
    ],
    'Was kostet Agri-PV': [
      'Wie hoch sind die Anschaffungskosten?',
      'Welche Förderungen gibt es?',
      'Wie hoch ist die Rendite?',
      'Gibt es Wartungskosten?'
    ]
  };

  return faqMap[keyword] || [
    `Was ist ${keyword}?`,
    `Wie funktioniert ${keyword}?`,
    `Welche Vorteile bietet ${keyword}?`,
    `Wie viel kostet ${keyword}?`,
    `Wie kann ich ${keyword} umsetzen?`
  ];
}

/**
 * Erstellt Content-Kalender
 */
function createContentCalendar(contentIdeas) {
  const calendar = [];
  const now = new Date();

  // Verteile Content über 3 Monate
  contentIdeas.forEach((idea, index) => {
    const publishDate = new Date(now);
    publishDate.setDate(now.getDate() + (index * 7)); // Wöchentlich veröffentlichen

    calendar.push({
      ...idea,
      publishDate: publishDate.toISOString().split('T')[0],
      weekOfYear: Math.ceil((publishDate - new Date(publishDate.getFullYear(), 0, 1)) / 86400000 / 7)
    });
  });

  return calendar;
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('📝 Starte Content-Optimierung...\n');

  if (!keywordAnalysis.keywords) {
    console.log('❌ Keine Keyword-Daten gefunden. Bitte führen Sie zuerst keyword-research aus.');
    process.exit(1);
  }

  const keywords = keywordAnalysis.keywords;
  const positions = seoReport.positions || {};

  console.log(`📊 Verarbeite ${keywords.length} Keywords...`);

  // Generiere verschiedene Content-Typen
  const blogIdeas = generateBlogIdeas(keywords, positions);
  const landingIdeas = generateLandingPageIdeas(keywords, positions);
  const faqIdeas = generateFAQIdeas(keywords);

  console.log(`✅ ${blogIdeas.length} Blog-Ideen generiert`);
  console.log(`✅ ${landingIdeas.length} Landingpage-Ideen generiert`);
  console.log(`✅ ${faqIdeas.length} FAQ-Ideen generiert`);

  // Kombiniere alle Ideen
  const allContentIdeas = [...blogIdeas, ...landingIdeas, ...faqIdeas];

  // Erstelle Content-Kalender
  const contentCalendar = createContentCalendar(allContentIdeas);
  console.log(`✅ Content-Kalender für ${contentCalendar.length} Inhalte erstellt`);

  // Berechne Statistiken
  const stats = {
    totalIdeas: allContentIdeas.length,
    blogCount: blogIdeas.length,
    landingCount: landingIdeas.length,
    faqCount: faqIdeas.length,
    totalEstimatedTraffic: allContentIdeas.reduce((sum, idea) => sum + idea.estimatedTraffic, 0),
    avgOpportunityScore: Math.round(allContentIdeas.reduce((sum, idea) => sum + idea.opportunityScore, 0) / allContentIdeas.length),
    contentTypes: {}
  };

  allContentIdeas.forEach(idea => {
    stats.contentTypes[idea.type] = (stats.contentTypes[idea.type] || 0) + 1;
  });

  // Zeige Top-Ideen
  console.log('\n🎯 Top Content-Ideen:');
  allContentIdeas.slice(0, 5).forEach((idea, index) => {
    console.log(`  ${index + 1}. ${idea.type.toUpperCase()}: "${idea.title}"`);
    console.log(`     Keyword: ${idea.keyword} (Score: ${idea.opportunityScore})`);
    console.log(`     Geschätzter Traffic: ${idea.estimatedTraffic}/Monat`);
  });

  // Zeige Statistiken
  console.log('\n📊 Content-Statistiken:');
  console.log(`  • Gesamt-Ideen: ${stats.totalIdeas}`);
  console.log(`  • Geschätzter Traffic: ${stats.totalEstimatedTraffic.toLocaleString()}/Monat`);
  console.log(`  • Ø Opportunity Score: ${stats.avgOpportunityScore}`);
  console.log(`  • Content-Typen: ${Object.entries(stats.contentTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}`);

  // Speichere Content-Plan
  const contentPlanFile = path.join(__dirname, '..', 'data', 'content-plan.json');
  fs.writeFileSync(contentPlanFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    contentCalendar,
    ideas: {
      blog: blogIdeas,
      landing: landingIdeas,
      faq: faqIdeas
    }
  }, null, 2));

  console.log(`\n💾 Content-Plan gespeichert: ${contentPlanFile}`);
  console.log('\n🎉 Content-Optimierung abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  generateBlogIdeas,
  generateLandingPageIdeas,
  generateFAQIdeas,
  createContentCalendar
};