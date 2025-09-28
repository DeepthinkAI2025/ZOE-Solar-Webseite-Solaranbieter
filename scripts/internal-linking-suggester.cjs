#!/usr/bin/env node

/**
 * Internal Linking Suggester für ZOE Solar
 * Generiert intelligente interne Link-Vorschläge basierend auf Content-Analyse
 */

const fs = require('fs');
const path = require('path');

/**
 * Analysiert Content und extrahiert potenzielle Link-Anker
 */
function analyzeContentForLinks(content, url) {
  const links = [];

  // Finde Keywords und Phrasen für potenzielle Links
  const keywordPatterns = [
    /Agri-Photovoltaik/gi,
    /Solaranlage/gi,
    /Photovoltaik/gi,
    /Förderung/gi,
    /KfW/gi,
    /BAFA/gi,
    /Landwirtschaft/gi,
    /Ertrag/gi,
    /Wirtschaftlichkeit/gi,
    /Beratung/gi,
    /Planung/gi,
    /Installation/gi
  ];

  keywordPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        links.push({
          anchor: match,
          context: getContext(content, match),
          url: url,
          relevance: calculateRelevance(match, content)
        });
      });
    }
  });

  return links;
}

/**
 * Extrahiert Kontext um ein Keyword
 */
function getContext(content, keyword) {
  const index = content.indexOf(keyword);
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + keyword.length + 50);
  return content.substring(start, end).replace(/\s+/g, ' ').trim();
}

/**
 * Berechnet Relevanz eines Links
 */
function calculateRelevance(keyword, content) {
  let relevance = 0;

  // Keyword-Dichte (+10)
  const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length;
  const totalWords = content.split(/\s+/).length;
  const density = keywordCount / totalWords;
  if (density > 0.01 && density < 0.05) {
    relevance += 10;
  }

  // Position im Text (+10 für frühe Erwähnung)
  const firstIndex = content.toLowerCase().indexOf(keyword.toLowerCase());
  if (firstIndex < content.length * 0.3) {
    relevance += 10;
  }

  // Semantische Relevanz (+10 für wichtige Keywords)
  const importantKeywords = ['Agri-Photovoltaik', 'Förderung', 'Beratung', 'Installation'];
  if (importantKeywords.some(k => keyword.toLowerCase().includes(k.toLowerCase()))) {
    relevance += 10;
  }

  return Math.min(relevance, 30);
}

/**
 * Generiert interne Link-Vorschläge
 */
function generateInternalLinkSuggestions(contentPages, targetPage) {
  const suggestions = [];
  const targetContent = targetPage.content.toLowerCase();
  const targetKeywords = extractKeywords(targetContent);

  contentPages.forEach(sourcePage => {
    if (sourcePage.url === targetPage.url) return; // Keine Links zur gleichen Seite

    const sourceContent = sourcePage.content.toLowerCase();
    const matches = [];

    // Finde relevante Keywords die in beiden Seiten vorkommen
    targetKeywords.forEach(keyword => {
      if (sourceContent.includes(keyword.toLowerCase())) {
        const anchor = findBestAnchor(sourcePage.content, keyword);
        if (anchor) {
          matches.push({
            keyword: keyword,
            anchor: anchor,
            sourceUrl: sourcePage.url,
            targetUrl: targetPage.url,
            context: getContext(sourcePage.content, anchor),
            relevance: calculateLinkRelevance(keyword, sourcePage, targetPage)
          });
        }
      }
    });

    // Sortiere nach Relevanz und nimm Top 3
    matches.sort((a, b) => b.relevance - a.relevance);
    suggestions.push(...matches.slice(0, 3));
  });

  return suggestions.sort((a, b) => b.relevance - a.relevance);
}

/**
 * Extrahiert Keywords aus Content
 */
function extractKeywords(content) {
  const keywords = new Set();

  // Häufige Nomen und Phrasen extrahieren
  const patterns = [
    /\b[A-Z][a-z]+\b/g, // Titel case Wörter
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Zwei Wörter Titel case
    /\b[a-z]+ [a-z]+\b/g // Zwei kleine Wörter
  ];

  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (match.length > 3 && !isStopWord(match)) {
          keywords.add(match);
        }
      });
    }
  });

  return Array.from(keywords);
}

/**
 * Prüft ob Wort ein Stop-Wort ist
 */
function isStopWord(word) {
  const stopWords = ['der', 'die', 'das', 'und', 'oder', 'mit', 'für', 'von', 'zu', 'auf', 'ist', 'hat', 'war', 'wird', 'sind', 'haben'];
  return stopWords.includes(word.toLowerCase());
}

/**
 * Findet besten Anker-Text für ein Keyword
 */
function findBestAnchor(content, keyword) {
  // Suche nach dem Keyword im Original-Content (case-sensitive)
  const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
  const matches = content.match(regex);

  if (matches && matches.length > 0) {
    return matches[0]; // Nimm erste Übereinstimmung
  }

  return null;
}

/**
 * Berechnet Link-Relevanz
 */
function calculateLinkRelevance(keyword, sourcePage, targetPage) {
  let relevance = 0;

  // Keyword-Frequenz in Zielseite (+10)
  const targetCount = (targetPage.content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
  if (targetCount > 2) {
    relevance += 10;
  }

  // Semantische Nähe (+10)
  const semanticScore = calculateSemanticSimilarity(sourcePage.content, targetPage.content);
  relevance += semanticScore;

  // Seiten-Typ Matching (+5)
  if (sourcePage.type === 'blog' && targetPage.type === 'product') {
    relevance += 5; // Blog zu Produkt
  }
  if (sourcePage.type === 'landing' && targetPage.type === 'service') {
    relevance += 5; // Landing zu Service
  }

  // Link-Tiefe (+5 für tiefe Seiten)
  const sourceDepth = sourcePage.url.split('/').length - 3; // Nach Domain
  if (sourceDepth > 2) {
    relevance += 5;
  }

  return Math.min(relevance, 30);
}

/**
 * Berechnet semantische Ähnlichkeit zwischen zwei Texten
 */
function calculateSemanticSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return Math.round((intersection.size / union.size) * 10);
}

/**
 * Erstellt Pillar-Cluster-Link-Struktur
 */
function createPillarClusterLinks(pillarPages, clusterPages) {
  const links = [];

  pillarPages.forEach(pillar => {
    clusterPages.forEach(cluster => {
      if (pillar.category === cluster.category) {
        links.push({
          from: pillar.url,
          to: cluster.url,
          type: 'pillar-to-cluster',
          anchor: `Erfahren Sie mehr über ${cluster.title}`,
          relevance: 25
        });
      }
    });
  });

  return links;
}

/**
 * Generiert Related-Content-Links
 */
function generateRelatedContentLinks(pages) {
  const links = [];

  pages.forEach(page => {
    const related = findRelatedPages(page, pages);
    related.forEach(relatedPage => {
      links.push({
        from: page.url,
        to: relatedPage.url,
        type: 'related-content',
        anchor: `Ähnlicher Artikel: ${relatedPage.title}`,
        relevance: 15
      });
    });
  });

  return links;
}

/**
 * Findet verwandte Seiten
 */
function findRelatedPages(page, allPages) {
  return allPages
    .filter(p => p.url !== page.url)
    .map(p => ({
      ...p,
      similarity: calculateSemanticSimilarity(page.content, p.content)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🔗 Starte Internal Linking Analyse...\n');

  // Beispiel-Seiten für Demo
  const samplePages = [
    {
      url: '/agri-pv',
      title: 'Agri-Photovoltaik Lösungen',
      type: 'pillar',
      category: 'agri-pv',
      content: `Agri-Photovoltaik kombiniert moderne Solartechnik mit traditioneller Landwirtschaft. Unsere Agri-PV Systeme ermöglichen es Landwirten, Strom zu erzeugen und gleichzeitig ihre Felder zu bewirtschaften. Die Installation erfolgt durch unsere erfahrenen Techniker. Förderungen machen das System besonders attraktiv.`
    },
    {
      url: '/foerderungen',
      title: 'Förderungen für Agri-PV',
      type: 'cluster',
      category: 'agri-pv',
      content: `Verschiedene Förderprogramme unterstützen Agri-Photovoltaik Projekte. KfW und BAFA bieten attraktive Konditionen für Landwirte. Die Förderung deckt einen großen Teil der Investitionskosten ab. Beratung zur optimalen Nutzung der Förderungen.`
    },
    {
      url: '/beratung',
      title: 'Professionelle Beratung',
      type: 'service',
      category: 'services',
      content: `Unsere Beratung umfasst Planung, Wirtschaftlichkeitsberechnung und Installation. Erfahrene Berater unterstützen bei allen Fragen rund um Agri-PV. Kostenlose Erstberatung für Interessenten.`
    },
    {
      url: '/produkte',
      title: 'Agri-PV Produkte',
      type: 'product',
      category: 'products',
      content: `Hochwertige Produkte für Agri-Photovoltaik Anlagen. Module, Montagesysteme und Wechselrichter von führenden Herstellern. Installation durch zertifizierte Techniker.`
    }
  ];

  console.log(`📊 Analysiere ${samplePages.length} Seiten für interne Links...`);

  // Generiere verschiedene Link-Typen
  const allSuggestions = [];

  // Content-basierte Links
  samplePages.forEach(page => {
    const suggestions = generateInternalLinkSuggestions(samplePages, page);
    allSuggestions.push(...suggestions);
  });

  // Pillar-Cluster Links
  const pillarPages = samplePages.filter(p => p.type === 'pillar');
  const clusterPages = samplePages.filter(p => p.type === 'cluster');
  const pillarLinks = createPillarClusterLinks(pillarPages, clusterPages);
  allSuggestions.push(...pillarLinks);

  // Related Content Links
  const relatedLinks = generateRelatedContentLinks(samplePages);
  allSuggestions.push(...relatedLinks);

  // Entferne Duplikate und sortiere nach Relevanz
  const uniqueSuggestions = allSuggestions
    .filter((link, index, self) =>
      index === self.findIndex(l => l.from === link.from && l.to === link.to)
    )
    .sort((a, b) => b.relevance - a.relevance);

  console.log(`✅ ${uniqueSuggestions.length} interne Link-Vorschläge generiert`);

  // Zeige Top-Vorschläge
  console.log('\n🎯 Top Internal Link Vorschläge:');
  uniqueSuggestions.slice(0, 10).forEach((link, index) => {
    console.log(`  ${index + 1}. ${link.from} → ${link.to}`);
    console.log(`     Anker: "${link.anchor}"`);
    console.log(`     Relevanz: ${link.relevance}/30`);
    console.log(`     Typ: ${link.type || 'content-based'}`);
  });

  // Speichere Ergebnisse
  const outputFile = path.join(__dirname, '..', 'data', 'internal-linking-suggestions.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    pagesAnalyzed: samplePages.length,
    totalSuggestions: uniqueSuggestions.length,
    suggestions: uniqueSuggestions
  }, null, 2));

  console.log(`\n💾 Internal Linking Vorschläge gespeichert: ${outputFile}`);
  console.log('\n🎉 Internal Linking Analyse abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  analyzeContentForLinks,
  generateInternalLinkSuggestions,
  createPillarClusterLinks,
  generateRelatedContentLinks
};