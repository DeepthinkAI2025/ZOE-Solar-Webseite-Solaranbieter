#!/usr/bin/env node

/**
 * Meta Tags Optimizer für ZOE Solar
 * Optimiert Title Tags, Meta Descriptions und andere Meta Tags
 */

const fs = require('fs');
const path = require('path');

/**
 * Berechnet optimale Title-Länge (50-60 Zeichen)
 */
function optimizeTitle(title, keyword, maxLength = 60) {
  let optimizedTitle = title;

  // Stelle sicher, dass Keyword am Anfang steht
  if (!optimizedTitle.toLowerCase().includes(keyword.toLowerCase())) {
    optimizedTitle = `${keyword} - ${optimizedTitle}`;
  }

  // Kürze wenn nötig
  if (optimizedTitle.length > maxLength) {
    optimizedTitle = optimizedTitle.substring(0, maxLength - 3) + '...';
  }

  return {
    title: optimizedTitle,
    length: optimizedTitle.length,
    includesKeyword: optimizedTitle.toLowerCase().includes(keyword.toLowerCase()),
    score: calculateTitleScore(optimizedTitle, keyword)
  };
}

/**
 * Berechnet Title-Score
 */
function calculateTitleScore(title, keyword) {
  let score = 0;

  // Keyword am Anfang (+20)
  if (title.toLowerCase().startsWith(keyword.toLowerCase())) {
    score += 20;
  }

  // Keyword enthalten (+15)
  if (title.toLowerCase().includes(keyword.toLowerCase())) {
    score += 15;
  }

  // Optimale Länge (50-60 Zeichen) (+15)
  if (title.length >= 50 && title.length <= 60) {
    score += 15;
  }

  // Markenname enthalten (+10)
  if (title.toLowerCase().includes('zoe solar')) {
    score += 10;
  }

  // Keine Keyword-Stuffing (+10)
  const keywordCount = (title.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
  if (keywordCount <= 2) {
    score += 10;
  }

  // Enthält Power-Wörter (+10)
  const powerWords = ['beste', 'top', 'ultimative', 'professionell', 'kostenlos'];
  const hasPowerWord = powerWords.some(word => title.toLowerCase().includes(word));
  if (hasPowerWord) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Optimiert Meta Description (150-160 Zeichen)
 */
function optimizeMetaDescription(description, keyword, cta = '', maxLength = 160) {
  let optimizedDesc = description;

  // Stelle sicher, dass Keyword enthalten ist
  if (!optimizedDesc.toLowerCase().includes(keyword.toLowerCase())) {
    optimizedDesc = `${keyword} - ${optimizedDesc}`;
  }

  // Füge CTA hinzu wenn angegeben
  if (cta && !optimizedDesc.includes(cta)) {
    optimizedDesc = `${optimizedDesc} ${cta}`;
  }

  // Kürze wenn nötig
  if (optimizedDesc.length > maxLength) {
    optimizedDesc = optimizedDesc.substring(0, maxLength - 3) + '...';
  }

  return {
    description: optimizedDesc,
    length: optimizedDesc.length,
    includesKeyword: optimizedDesc.toLowerCase().includes(keyword.toLowerCase()),
    includesCTA: cta ? optimizedDesc.includes(cta) : true,
    score: calculateDescriptionScore(optimizedDesc, keyword, cta)
  };
}

/**
 * Berechnet Description-Score
 */
function calculateDescriptionScore(description, keyword, cta) {
  let score = 0;

  // Keyword enthalten (+20)
  if (description.toLowerCase().includes(keyword.toLowerCase())) {
    score += 20;
  }

  // Optimale Länge (150-160 Zeichen) (+15)
  if (description.length >= 150 && description.length <= 160) {
    score += 15;
  }

  // CTA enthalten (+15)
  if (cta && description.includes(cta)) {
    score += 15;
  }

  // Enthält Zahlen/Benefits (+10)
  const hasNumbers = /\d+/.test(description);
  if (hasNumbers) {
    score += 10;
  }

  // Enthält Power-Wörter (+10)
  const powerWords = ['kostenlos', 'professionell', 'erfahrung', 'qualität', 'schnell'];
  const hasPowerWord = powerWords.some(word => description.toLowerCase().includes(word));
  if (hasPowerWord) {
    score += 10;
  }

  // Keine Keyword-Stuffing (+10)
  const keywordCount = (description.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
  if (keywordCount <= 1) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Generiert Open Graph Tags
 */
function generateOpenGraphTags(title, description, url, image, type = 'website') {
  return {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:image': image,
    'og:type': type,
    'og:site_name': 'ZOE Solar GmbH',
    'og:locale': 'de_DE'
  };
}

/**
 * Generiert Twitter Card Tags
 */
function generateTwitterCardTags(title, description, image, cardType = 'summary_large_image') {
  return {
    'twitter:card': cardType,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:site': '@zoesolar_de'
  };
}

/**
 * Generiert Canonical URL
 */
function generateCanonicalUrl(baseUrl, path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl.replace(/\/$/, '')}${cleanPath}`;
}

/**
 * Optimiert alle Meta Tags für eine Seite
 */
function optimizePageMetaTags(pageData) {
  const {
    title,
    keyword,
    description,
    url,
    image,
    cta,
    type = 'website'
  } = pageData;

  const optimizedTitle = optimizeTitle(title, keyword);
  const optimizedDescription = optimizeMetaDescription(description, keyword, cta);
  const canonicalUrl = generateCanonicalUrl('https://zoe-solar.de', url);
  const ogTags = generateOpenGraphTags(optimizedTitle.title, optimizedDescription.description, canonicalUrl, image, type);
  const twitterTags = generateTwitterCardTags(optimizedTitle.title, optimizedDescription.description, image);

  return {
    basic: {
      title: optimizedTitle.title,
      description: optimizedDescription.description,
      keywords: `${keyword}, agri photovoltaik, solarenergie, landwirtschaft`,
      canonical: canonicalUrl,
      robots: 'index, follow'
    },
    openGraph: ogTags,
    twitter: twitterTags,
    scores: {
      titleScore: optimizedTitle.score,
      descriptionScore: optimizedDescription.score,
      overallScore: Math.round((optimizedTitle.score + optimizedDescription.score) / 2)
    }
  };
}

/**
 * Generiert optimierte Meta Tags für verschiedene Seitentypen
 */
function generateOptimizedMetaTags() {
  const pages = [
    {
      type: 'homepage',
      title: 'ZOE Solar - Professionelle Agri-Photovoltaik Lösungen',
      keyword: 'Agri-Photovoltaik',
      description: 'ZOE Solar bietet professionelle Agri-Photovoltaik Lösungen für Landwirte. Kombinieren Sie Landwirtschaft und Stromerzeugung für maximale Effizienz.',
      url: '/',
      image: 'https://zoe-solar.de/assets/og/homepage.jpg',
      cta: 'Kostenlose Beratung anfordern'
    },
    {
      type: 'product',
      title: 'Agri-PV Komplettsysteme - ZOE Solar',
      keyword: 'Agri-PV Systeme',
      description: 'Professionelle Agri-PV Komplettsysteme für landwirtschaftliche Flächen. Hochwertige Module und Montagesysteme für optimale Erträge.',
      url: '/produkte',
      image: 'https://zoe-solar.de/assets/og/products.jpg',
      cta: 'Jetzt anfragen'
    },
    {
      type: 'service',
      title: 'Agri-PV Beratung und Planung - ZOE Solar',
      keyword: 'Agri-PV Beratung',
      description: 'Professionelle Beratung für Agri-Photovoltaik Projekte. Von der Planung bis zur Umsetzung - Ihr Partner für erfolgreiche Agri-PV Projekte.',
      url: '/beratung',
      image: 'https://zoe-solar.de/assets/og/consulting.jpg',
      cta: 'Termin vereinbaren'
    },
    {
      type: 'blog',
      title: 'Agri-Photovoltaik Blog - Expertenwissen von ZOE Solar',
      keyword: 'Agri-PV Blog',
      description: 'Aktuelle News, Tipps und Expertenwissen rund um Agri-Photovoltaik. Bleiben Sie informiert über die neuesten Entwicklungen in der Branche.',
      url: '/blog',
      image: 'https://zoe-solar.de/assets/og/blog.jpg',
      cta: 'Mehr erfahren'
    },
    {
      type: 'contact',
      title: 'Kontakt - ZOE Solar GmbH',
      keyword: 'ZOE Solar Kontakt',
      description: 'Kontaktieren Sie ZOE Solar für Ihre Agri-Photovoltaik Projekte. Professionelle Beratung und Unterstützung für Landwirte in Deutschland.',
      url: '/kontakt',
      image: 'https://zoe-solar.de/assets/og/contact.jpg',
      cta: 'Jetzt kontaktieren'
    }
  ];

  const optimizedPages = {};

  pages.forEach(page => {
    optimizedPages[page.type] = optimizePageMetaTags(page);
  });

  return optimizedPages;
}

/**
 * Generiert HTML Meta Tags String
 */
function generateHTMLMetaTags(metaData) {
  const { basic, openGraph, twitter } = metaData;

  let html = '';

  // Basic Meta Tags
  html += `<title>${basic.title}</title>\n`;
  html += `<meta name="description" content="${basic.description}">\n`;
  html += `<meta name="keywords" content="${basic.keywords}">\n`;
  html += `<link rel="canonical" href="${basic.canonical}">\n`;
  html += `<meta name="robots" content="${basic.robots}">\n\n`;

  // Open Graph Tags
  html += `<!-- Open Graph / Facebook -->\n`;
  Object.entries(openGraph).forEach(([property, content]) => {
    html += `<meta property="og:${property}" content="${content}">\n`;
  });
  html += `\n`;

  // Twitter Card Tags
  html += `<!-- Twitter -->\n`;
  Object.entries(twitter).forEach(([name, content]) => {
    html += `<meta name="twitter:${name.replace('twitter:', '')}" content="${content}">\n`;
  });

  return html;
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🏷️  Starte Meta Tags Optimierung...\n');

  const optimizedMetaTags = generateOptimizedMetaTags();

  console.log('✅ Meta Tags für verschiedene Seitentypen optimiert');

  // Zeige Beispiel für Homepage
  const homepageMeta = optimizedMetaTags.homepage;
  console.log('\n📄 Beispiel - Homepage Meta Tags:');
  console.log(`Title: "${homepageMeta.basic.title}" (${homepageMeta.basic.title.length} Zeichen)`);
  console.log(`Description: "${homepageMeta.basic.description}" (${homepageMeta.basic.description.length} Zeichen)`);
  console.log(`Title Score: ${homepageMeta.scores.titleScore}/100`);
  console.log(`Description Score: ${homepageMeta.scores.descriptionScore}/100`);
  console.log(`Overall Score: ${homepageMeta.scores.overallScore}/100`);

  // Generiere HTML für alle Seiten
  const htmlOutputs = {};
  Object.entries(optimizedMetaTags).forEach(([pageType, metaData]) => {
    htmlOutputs[pageType] = generateHTMLMetaTags(metaData);
  });

  // Speichere Ergebnisse
  const outputFile = path.join(__dirname, '..', 'data', 'optimized-meta-tags.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    optimizedMetaTags,
    htmlOutputs
  }, null, 2));

  console.log(`\n💾 Optimierte Meta Tags gespeichert: ${outputFile}`);

  // Erstelle auch HTML-Dateien für jede Seite
  const htmlDir = path.join(__dirname, '..', 'data', 'meta-html');
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }

  Object.entries(htmlOutputs).forEach(([pageType, html]) => {
    const htmlFile = path.join(htmlDir, `${pageType}-meta.html`);
    fs.writeFileSync(htmlFile, `<head>\n${html}</head>`);
  });

  console.log(`📄 HTML Meta Tag Dateien erstellt in: ${htmlDir}`);
  console.log('\n🎉 Meta Tags Optimierung abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  optimizeTitle,
  optimizeMetaDescription,
  generateOpenGraphTags,
  generateTwitterCardTags,
  optimizePageMetaTags,
  generateHTMLMetaTags
};