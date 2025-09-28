#!/usr/bin/env node

/**
 * Site Audit Analyzer für ZOE Solar
 * Automatisierte Website-Analyse für technische SEO-Probleme
 */

const fs = require('fs');
const path = require('path');

/**
 * Analysiert robots.txt
 */
function analyzeRobotsTxt(content) {
  const issues = [];
  const recommendations = [];

  if (!content) {
    issues.push({
      type: 'error',
      category: 'crawlability',
      title: 'robots.txt fehlt',
      description: 'Keine robots.txt gefunden',
      impact: 'high',
      fix: 'Erstelle eine robots.txt im Root-Verzeichnis'
    });
    return { issues, recommendations };
  }

  // Prüfe User-Agent
  if (!content.includes('User-agent: *')) {
    issues.push({
      type: 'warning',
      category: 'crawlability',
      title: 'User-Agent fehlt',
      description: 'robots.txt sollte alle User-Agents abdecken',
      impact: 'medium',
      fix: 'Füge "User-agent: *" hinzu'
    });
  }

  // Prüfe Sitemap
  if (!content.includes('Sitemap:')) {
    recommendations.push({
      category: 'indexing',
      title: 'Sitemap hinzufügen',
      description: 'Füge Sitemap zur robots.txt hinzu für bessere Indexierung',
      priority: 'high'
    });
  }

  // Prüfe Allow/Disallow
  if (content.includes('Disallow: /')) {
    issues.push({
      type: 'warning',
      category: 'crawlability',
      title: 'Zu restriktive robots.txt',
      description: 'Gesamte Website ist blockiert',
      impact: 'high',
      fix: 'Überprüfe Disallow-Regeln'
    });
  }

  return { issues, recommendations };
}

/**
 * Analysiert Sitemap
 */
function analyzeSitemap(urls) {
  const issues = [];
  const recommendations = [];

  if (!urls || urls.length === 0) {
    issues.push({
      type: 'error',
      category: 'indexing',
      title: 'Sitemap fehlt oder ist leer',
      description: 'Keine URLs in Sitemap gefunden',
      impact: 'high',
      fix: 'Erstelle eine vollständige Sitemap'
    });
    return { issues, recommendations };
  }

  // Prüfe URL-Anzahl
  if (urls.length < 10) {
    issues.push({
      type: 'warning',
      category: 'indexing',
      title: 'Sitemap unvollständig',
      description: `Nur ${urls.length} URLs gefunden`,
      impact: 'medium',
      fix: 'Überprüfe ob alle wichtigen Seiten in der Sitemap sind'
    });
  }

  // Prüfe URL-Format
  const invalidUrls = urls.filter(url => !url.startsWith('http'));
  if (invalidUrls.length > 0) {
    issues.push({
      type: 'error',
      category: 'indexing',
      title: 'Ungültige URLs in Sitemap',
      description: `${invalidUrls.length} URLs haben ungültiges Format`,
      impact: 'high',
      fix: 'Stelle sicher, dass alle URLs mit http/https beginnen'
    });
  }

  // Prüfe lastmod
  const urlsWithLastmod = urls.filter(url => url.lastmod);
  if (urlsWithLastmod.length < urls.length * 0.5) {
    recommendations.push({
      category: 'indexing',
      title: 'lastmod hinzufügen',
      description: 'Füge lastmod-Daten für bessere Indexierung hinzu',
      priority: 'medium'
    });
  }

  return { issues, recommendations };
}

/**
 * Analysiert Meta Tags
 */
function analyzeMetaTags(pages) {
  const issues = [];
  const recommendations = [];

  pages.forEach(page => {
    const { url, title, description, h1, canonical } = page;

    // Title Tag Analyse
    if (!title) {
      issues.push({
        type: 'error',
        category: 'on-page',
        title: 'Title Tag fehlt',
        description: `Seite ${url} hat keinen Title Tag`,
        impact: 'high',
        fix: 'Füge einen beschreibenden Title Tag hinzu'
      });
    } else if (title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'on-page',
        title: 'Title Tag zu kurz',
        description: `Title "${title}" ist nur ${title.length} Zeichen`,
        impact: 'medium',
        fix: 'Erweitere Title Tag auf 50-60 Zeichen'
      });
    } else if (title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'on-page',
        title: 'Title Tag zu lang',
        description: `Title "${title}" ist ${title.length} Zeichen (max 60)`,
        impact: 'medium',
        fix: 'Kürze Title Tag auf 50-60 Zeichen'
      });
    }

    // Meta Description Analyse
    if (!description) {
      issues.push({
        type: 'warning',
        category: 'on-page',
        title: 'Meta Description fehlt',
        description: `Seite ${url} hat keine Meta Description`,
        impact: 'medium',
        fix: 'Füge eine beschreibende Meta Description hinzu'
      });
    } else if (description.length < 120) {
      issues.push({
        type: 'warning',
        category: 'on-page',
        title: 'Meta Description zu kurz',
        description: `Description ist nur ${description.length} Zeichen`,
        impact: 'low',
        fix: 'Erweitere auf 150-160 Zeichen'
      });
    } else if (description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'on-page',
        title: 'Meta Description zu lang',
        description: `Description ist ${description.length} Zeichen (max 160)`,
        impact: 'low',
        fix: 'Kürze auf 150-160 Zeichen'
      });
    }

    // H1 Tag Analyse
    if (!h1 || h1.length === 0) {
      issues.push({
        type: 'error',
        category: 'on-page',
        title: 'H1 Tag fehlt',
        description: `Seite ${url} hat keinen H1 Tag`,
        impact: 'high',
        fix: 'Füge einen H1 Tag hinzu'
      });
    } else if (h1.length > 1) {
      issues.push({
        type: 'warning',
        category: 'on-page',
        title: 'Mehrere H1 Tags',
        description: `Seite ${url} hat ${h1.length} H1 Tags`,
        impact: 'medium',
        fix: 'Verwende nur einen H1 Tag pro Seite'
      });
    }

    // Canonical URL Analyse
    if (!canonical) {
      issues.push({
        type: 'warning',
        category: 'indexing',
        title: 'Canonical URL fehlt',
        description: `Seite ${url} hat keine Canonical URL`,
        impact: 'medium',
        fix: 'Füge rel="canonical" hinzu'
      });
    }
  });

  return { issues, recommendations };
}

/**
 * Analysiert interne Links
 */
function analyzeInternalLinks(pages) {
  const issues = [];
  const recommendations = [];

  pages.forEach(page => {
    const { url, internalLinks, externalLinks } = page;

    // Interne Link-Analyse
    if (!internalLinks || internalLinks.length === 0) {
      issues.push({
        type: 'warning',
        category: 'linking',
        title: 'Keine internen Links',
        description: `Seite ${url} hat keine internen Links`,
        impact: 'medium',
        fix: 'Füge relevante interne Links hinzu'
      });
    } else if (internalLinks.length < 3) {
      recommendations.push({
        category: 'linking',
        title: 'Mehr interne Links',
        description: `Seite ${url} hat nur ${internalLinks.length} interne Links`,
        priority: 'low'
      });
    }

    // Externe Link-Analyse
    if (externalLinks && externalLinks.length > 10) {
      issues.push({
        type: 'warning',
        category: 'linking',
        title: 'Zu viele externe Links',
        description: `Seite ${url} hat ${externalLinks.length} externe Links`,
        impact: 'low',
        fix: 'Reduziere externe Links oder füge nofollow hinzu'
      });
    }
  });

  // Prüfe Link-Tiefe
  const deepPages = pages.filter(page => page.url.split('/').length > 5);
  if (deepPages.length > pages.length * 0.3) {
    issues.push({
      type: 'warning',
      category: 'architecture',
      title: 'Zu tiefe Seitenstruktur',
      description: `${deepPages.length} Seiten sind mehr als 3 Klicks tief`,
      impact: 'medium',
      fix: 'Vereinfache URL-Struktur und verbessere interne Verlinkung'
    });
  }

  return { issues, recommendations };
}

/**
 * Analysiert Ladezeiten
 */
function analyzePageSpeed(pages) {
  const issues = [];
  const recommendations = [];

  pages.forEach(page => {
    const { url, loadTime, size } = page;

    if (loadTime > 3000) {
      issues.push({
        type: 'error',
        category: 'performance',
        title: 'Langsame Ladezeit',
        description: `Seite ${url} lädt in ${loadTime}ms (Soll: <3000ms)`,
        impact: 'high',
        fix: 'Optimiere Bilder, minifiziere Code, nutze Caching'
      });
    } else if (loadTime > 2000) {
      issues.push({
        type: 'warning',
        category: 'performance',
        title: 'Ladezeit optimierbar',
        description: `Seite ${url} lädt in ${loadTime}ms`,
        impact: 'medium',
        fix: 'Weitere Performance-Optimierungen möglich'
      });
    }

    if (size > 2000000) { // 2MB
      issues.push({
        type: 'warning',
        category: 'performance',
        title: 'Seite zu groß',
        description: `Seite ${url} ist ${(size / 1000000).toFixed(1)}MB groß`,
        impact: 'medium',
        fix: 'Komprimiere Bilder und minifiziere Assets'
      });
    }
  });

  return { issues, recommendations };
}

/**
 * Analysiert Mobile-Friendliness
 */
function analyzeMobileFriendliness(pages) {
  const issues = [];
  const recommendations = [];

  pages.forEach(page => {
    const { url, viewport, mobileScore } = page;

    if (!viewport) {
      issues.push({
        type: 'error',
        category: 'mobile',
        title: 'Viewport Meta Tag fehlt',
        description: `Seite ${url} hat keinen Viewport Meta Tag`,
        impact: 'high',
        fix: 'Füge <meta name="viewport" content="width=device-width, initial-scale=1"> hinzu'
      });
    }

    if (mobileScore && mobileScore < 80) {
      issues.push({
        type: 'warning',
        category: 'mobile',
        title: 'Mobile nicht optimiert',
        description: `Mobile Score: ${mobileScore}/100 für ${url}`,
        impact: 'high',
        fix: 'Optimiere für mobile Geräte'
      });
    }
  });

  return { issues, recommendations };
}

/**
 * Generiert Audit-Bericht
 */
function generateAuditReport(auditData) {
  const { robots, sitemap, meta, links, speed, mobile } = auditData;

  const allIssues = [
    ...robots.issues,
    ...sitemap.issues,
    ...meta.issues,
    ...links.issues,
    ...speed.issues,
    ...mobile.issues
  ];

  const allRecommendations = [
    ...robots.recommendations,
    ...sitemap.recommendations,
    ...meta.recommendations,
    ...links.recommendations,
    ...speed.recommendations,
    ...mobile.recommendations
  ];

  // Sortiere nach Impact
  const impactOrder = { high: 3, medium: 2, low: 1 };
  allIssues.sort((a, b) => impactOrder[b.impact] - impactOrder[a.impact]);

  // Gruppiere nach Kategorie
  const issuesByCategory = {};
  allIssues.forEach(issue => {
    if (!issuesByCategory[issue.category]) {
      issuesByCategory[issue.category] = [];
    }
    issuesByCategory[issue.category].push(issue);
  });

  return {
    summary: {
      totalIssues: allIssues.length,
      highImpact: allIssues.filter(i => i.impact === 'high').length,
      mediumImpact: allIssues.filter(i => i.impact === 'medium').length,
      lowImpact: allIssues.filter(i => i.impact === 'low').length,
      totalRecommendations: allRecommendations.length
    },
    issues: allIssues,
    recommendations: allRecommendations,
    issuesByCategory
  };
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🔍 Starte Site Audit...\n');

  // Beispiel-Daten für Demo (in Realität würden diese gecrawlt)
  const sampleAuditData = {
    robots: analyzeRobotsTxt(`User-agent: *
Allow: /

Sitemap: https://zoe-solar.de/sitemap.xml`),

    sitemap: analyzeSitemap([
      'https://zoe-solar.de/',
      'https://zoe-solar.de/agri-pv',
      'https://zoe-solar.de/foerderungen',
      'https://zoe-solar.de/beratung',
      'https://zoe-solar.de/produkte'
    ]),

    meta: analyzeMetaTags([
      {
        url: '/',
        title: 'ZOE Solar - Professionelle Agri-Photovoltaik Lösungen',
        description: 'ZOE Solar bietet professionelle Agri-Photovoltaik Lösungen für Landwirte. Kombinieren Sie Landwirtschaft und Stromerzeugung für maximale Effizienz.',
        h1: ['ZOE Solar - Ihre Agri-PV Experten'],
        canonical: 'https://zoe-solar.de/'
      },
      {
        url: '/agri-pv',
        title: 'Agri-Photovoltaik - ZOE Solar',
        description: 'Erfahren Sie alles über Agri-Photovoltaik. Moderne Lösungen für Landwirte.',
        h1: ['Agri-Photovoltaik'],
        canonical: 'https://zoe-solar.de/agri-pv'
      }
    ]),

    links: analyzeInternalLinks([
      {
        url: '/',
        internalLinks: ['/agri-pv', '/foerderungen', '/beratung'],
        externalLinks: []
      },
      {
        url: '/agri-pv',
        internalLinks: ['/', '/foerderungen'],
        externalLinks: ['https://example.com']
      }
    ]),

    speed: analyzePageSpeed([
      { url: '/', loadTime: 2500, size: 1500000 },
      { url: '/agri-pv', loadTime: 1800, size: 1200000 }
    ]),

    mobile: analyzeMobileFriendliness([
      { url: '/', viewport: true, mobileScore: 95 },
      { url: '/agri-pv', viewport: true, mobileScore: 88 }
    ])
  };

  const report = generateAuditReport(sampleAuditData);

  console.log('📊 Site Audit Ergebnisse:');
  console.log(`  • Gesamt Issues: ${report.summary.totalIssues}`);
  console.log(`  • High Impact: ${report.summary.highImpact}`);
  console.log(`  • Medium Impact: ${report.summary.mediumImpact}`);
  console.log(`  • Low Impact: ${report.summary.lowImpact}`);
  console.log(`  • Empfehlungen: ${report.summary.totalRecommendations}`);

  console.log('\n🚨 Kritische Issues:');
  report.issues.filter(i => i.impact === 'high').slice(0, 5).forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue.title}`);
    console.log(`     ${issue.description}`);
    console.log(`     Fix: ${issue.fix}`);
  });

  console.log('\n📋 Issues nach Kategorie:');
  Object.entries(report.issuesByCategory).forEach(([category, issues]) => {
    console.log(`  • ${category}: ${issues.length} Issues`);
  });

  // Speichere Bericht
  const outputFile = path.join(__dirname, '..', 'data', 'site-audit-report.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    report
  }, null, 2));

  console.log(`\n💾 Site Audit Bericht gespeichert: ${outputFile}`);
  console.log('\n🎉 Site Audit abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  analyzeRobotsTxt,
  analyzeSitemap,
  analyzeMetaTags,
  analyzeInternalLinks,
  analyzePageSpeed,
  analyzeMobileFriendliness,
  generateAuditReport
};