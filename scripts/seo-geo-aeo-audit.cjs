#!/usr/bin/env node

process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS', moduleResolution: 'Node' });
process.env.TS_NODE_TRANSPILE_ONLY = 'true';
require('ts-node/register');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.join(__dirname, '..');

const seoModule = require('../data/seoConfig');
const { PRIMARY_SERVICE_REGIONS, resolveSeoForPage } = seoModule;
const { pageToPath } = require('../data/pageRoutes');
const { localContentByCity } = require('../data/localContent');
const { faqData } = require('../data/faqData');

const keywordAnalysis = safeReadJson(path.join(rootDir, 'data', 'keyword-analysis.json'), { keywords: [] });
const highPriorityKeywords = safeReadJson(path.join(rootDir, 'data', 'high-priority-keywords.json'), []);
const localKeywords = safeReadJson(path.join(rootDir, 'data', 'local-keywords.json'), []);
const seoHistory = safeReadJson(path.join(rootDir, 'data', 'seo-history.json'), []);

const questionWords = [
  'wie',
  'was',
  'wann',
  'wo',
  'wer',
  'wieso',
  'weshalb',
  'welche',
  'welcher',
  'welches',
  'wieviel',
  'wieviele',
  'kann',
  'darf',
  'lohnt',
  'lohntsich',
  'kosten',
  'preis',
  'bester',
  'beste',
  'vergleich',
  'funktioniert',
  'schritt',
  'guide'
];

function safeReadJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.warn(`⚠️  Konnte ${path.relative(rootDir, filePath)} nicht laden (${error.message}). Verwende Fallback.`);
    return fallback;
  }
}

function slugifyCity(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function normaliseText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isQuestionKeyword(keyword) {
  const normalised = normaliseText(keyword);
  return questionWords.some((word) => normalised.startsWith(word + ' ') || normalised.includes(` ${word} `));
}

function generateHash(input) {
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 10);
}

const faqIndex = faqData.map((faq) => normaliseText(faq.question));

function faqCoversKeyword(keyword) {
  const normalisedKeyword = normaliseText(keyword);
  return faqIndex.some((question) => question.includes(normalisedKeyword) || normalisedKeyword.includes(question));
}

function collectQuestionKeywords() {
  const all = [...(keywordAnalysis.keywords || []), ...highPriorityKeywords];
  const deduped = new Map();

  all.forEach((entry) => {
    if (!entry || typeof entry.keyword !== 'string') return;
    if (!isQuestionKeyword(entry.keyword)) return;
    const key = normaliseText(entry.keyword);
    if (!deduped.has(key)) {
      deduped.set(key, entry);
    }
  });

  return Array.from(deduped.values());
}

function coverageScore(flags) {
  const total = flags.length;
  const achieved = flags.filter(Boolean).length;
  return Math.round((achieved / (total || 1)) * 100);
}

async function evaluateLocation(region) {
  const slug = slugifyCity(region.city);
  const pageKey = `standort-${slug}`;
  const hasRoute = Object.prototype.hasOwnProperty.call(pageToPath, pageKey);
  const routePath = hasRoute ? pageToPath[pageKey] : `/standort/${slug}`;
  const hasLocalContent = Boolean(localContentByCity[slug]);

  let metadata;
  let hasLocalBusinessSchema = false;
  let hasFaqSchema = false;
  let hasSpeakableSchema = false;
  let canonical = `${routePath}`;

  if (hasRoute) {
    try {
      metadata = await resolveSeoForPage({ page: pageKey, pathname: routePath });
      canonical = metadata?.canonical ?? canonical;
      const structuredData = Array.isArray(metadata?.structuredData) ? metadata.structuredData : [];

      hasLocalBusinessSchema = structuredData.some((schema) => {
        const schemaId = typeof schema['@id'] === 'string' ? schema['@id'] : '';
        return schema['@type'] === 'LocalBusiness' && schemaId.toLowerCase().includes(region.regionCode.toLowerCase());
      });

      hasFaqSchema = structuredData.some((schema) => schema['@type'] === 'FAQPage');
      hasSpeakableSchema = structuredData.some((schema) => schema['@type'] === 'WebPage' && Boolean(schema.speakable));
    } catch (error) {
      console.warn(`⚠️  Konnte SEO-Daten für ${pageKey} nicht ermitteln: ${error.message}`);
    }
  }

  const locationFaqs = faqData.filter((faq) =>
    (faq.regions || []).some((regionSlug) => slugifyCity(regionSlug) === slug)
  );

  const regionLocalKeywords = localKeywords.filter((keyword) => slugifyCity(keyword.location) === slug);
  const questionLocalKeywords = regionLocalKeywords.filter((entry) => isQuestionKeyword(entry.keyword));

  const uncoveredQuestions = questionLocalKeywords.filter((entry) => !faqCoversKeyword(entry.keyword));

  const regionalHighPriority = highPriorityKeywords.filter((entry) =>
    normaliseText(entry.keyword).includes(normaliseText(region.city))
  );

  const score = coverageScore([
    hasRoute,
    hasLocalContent,
    hasLocalBusinessSchema,
    hasFaqSchema,
    hasSpeakableSchema,
    locationFaqs.length >= Math.min(3, questionLocalKeywords.length || 1),
  ]);

  const recommendedActions = [];

  if (!hasRoute) {
    recommendedActions.push({
      priority: 'hoch',
      action: `Standortseite für ${region.city} unter ${routePath} anlegen und in Router registrieren.`
    });
  }
  if (!hasLocalContent) {
    recommendedActions.push({
      priority: 'hoch',
      action: `Lokale Content-Bausteine in data/localContent.ts für ${region.city} ergänzen.`
    });
  }
  if (hasRoute && !hasLocalBusinessSchema) {
    recommendedActions.push({
      priority: 'mittel',
      action: `LocalBusiness-Branch-Schema für ${region.regionCode} aktivieren (seoConfig PRIMARY_SERVICE_REGIONS).`
    });
  }
  if (hasRoute && !hasFaqSchema) {
    recommendedActions.push({
      priority: 'hoch',
      action: `Regionale FAQ in data/faqData.ts erweitern und FAQPage Schema für ${region.city} aktivieren.`
    });
  }
  if (hasRoute && !hasSpeakableSchema) {
    recommendedActions.push({
      priority: 'mittel',
      action: `Speakable Specification für Generative Search auf ${routePath} hinzufügen.`
    });
  }
  if (uncoveredQuestions.length > 0) {
    recommendedActions.push({
      priority: 'hoch',
      action: `Antworten für ${uncoveredQuestions.length} unbeantwortete Frage-Keywords erstellen (${uncoveredQuestions
        .slice(0, 3)
        .map((item) => `"${item.keyword}"`)
        .join(', ')}).`
    });
  }
  if (regionalHighPriority.length > 0 && score < 100) {
    recommendedActions.push({
      priority: 'mittel',
      action: `Landingpage-Inhalt auf ${routePath} auf High-Priority Keywords ausrichten (${regionalHighPriority
        .slice(0, 3)
        .map((item) => item.keyword)
        .join(', ')}).`
    });
  }

  return {
    region: region.city,
    slug,
    route: routePath,
    canonical,
    geo: {
      region: region.regionCode,
      latitude: region.latitude,
      longitude: region.longitude,
      radiusKm: region.radiusKm,
    },
    score,
    checks: {
      hasRoute,
      hasLocalContent,
      hasLocalBusinessSchema,
      hasFaqSchema,
      hasSpeakableSchema,
      faqCoverage: locationFaqs.length,
      questionKeywordCount: questionLocalKeywords.length,
      uncoveredQuestions: uncoveredQuestions.length,
    },
    uncoveredQuestionExamples: uncoveredQuestions.slice(0, 5).map((item) => item.keyword),
    recommendedActions,
  };
}

async function main() {
  const questionKeywords = collectQuestionKeywords();
  const uncoveredQuestionKeywords = questionKeywords
    .filter((entry) => !faqCoversKeyword(entry.keyword))
    .sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0));

  const locationInsights = await Promise.all(PRIMARY_SERVICE_REGIONS.map(evaluateLocation));

  const topLocations = [...locationInsights]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => ({ region: entry.region, score: entry.score }));

  const lowestLocations = [...locationInsights]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((entry) => ({ region: entry.region, score: entry.score }));

  const latestHistory = seoHistory[seoHistory.length - 1] || null;

  const entityOpportunities = buildEntityOpportunities(keywordAnalysis.keywords || []);

  const output = {
    generatedAt: new Date().toISOString(),
    totals: {
      regions: PRIMARY_SERVICE_REGIONS.length,
      analysedLocations: locationInsights.length,
      uncoveredQuestionKeywords: uncoveredQuestionKeywords.length,
    },
    performance: {
      topLocations,
      lowestLocations,
      averageLocationScore:
        Math.round(
          (locationInsights.reduce((sum, entry) => sum + entry.score, 0) / (locationInsights.length || 1)) * 100
        ) / 100,
      latestSeoSnapshot: latestHistory
        ? {
            timestamp: latestHistory.timestamp,
            avgPosition: latestHistory.avgPosition,
            top10Percentage: latestHistory.top10Percentage,
            estimatedTraffic: latestHistory.estimatedTraffic,
          }
        : null,
    },
    answerEngine: {
      uncoveredTopKeywords: uncoveredQuestionKeywords.slice(0, 25).map((entry) => ({
        keyword: entry.keyword,
        opportunityScore: entry.opportunityScore,
        intent: entry.intent,
        segment: entry.segment,
      })),
      coverageRatio:
        Math.round(
          ((questionKeywords.length - uncoveredQuestionKeywords.length) / (questionKeywords.length || 1)) * 10000
        ) / 100,
      totalQuestionKeywords: questionKeywords.length,
    },
    entityOpportunities,
    locations: locationInsights,
  };

  const targetFile = path.join(rootDir, 'data', 'seo-geo-audit.json');
  fs.writeFileSync(targetFile, JSON.stringify(output, null, 2));

  console.log('✅ GEO & AEO Audit abgeschlossen. Zusammenfassung:');
  console.log(`   • Analysierte Regionen: ${output.totals.analysedLocations}`);
  console.log(`   • Durchschnittlicher Standort-Score: ${output.performance.averageLocationScore}`);
  console.log(`   • Unbeantwortete Frage-Keywords: ${output.totals.uncoveredQuestionKeywords}`);

  if (output.performance.latestSeoSnapshot) {
    const snapshot = output.performance.latestSeoSnapshot;
    console.log(`   • Letztes SEO-Monitoring: ∅ Position ${snapshot.avgPosition}, Top10 ${snapshot.top10Percentage}%, Traffic ≈ ${snapshot.estimatedTraffic}`);
  }

  console.log('\n📍 Top Regionen:');
  output.performance.topLocations.forEach((entry) => {
    console.log(`   - ${entry.region}: Score ${entry.score}`);
  });

  console.log('\n🚨 Unterdurchschnittliche Regionen:');
  output.performance.lowestLocations.forEach((entry) => {
    console.log(`   - ${entry.region}: Score ${entry.score}`);
  });

  console.log(`\n💾 Audit gespeichert unter data/${path.basename(targetFile)}`);
}

// Wrap the main execution in an async function
(async () => {
  try {
    await main();
  } catch (error) {
    console.error('❌ Fehler beim Ausführen des GEO & AEO Audits:', error);
    process.exit(1);
  }
})();

function buildEntityOpportunities(keywords = []) {
  const clusters = new Map();

  keywords.forEach((keyword) => {
    if (!keyword || typeof keyword.keyword !== 'string') return;
    const segment = keyword.segment || 'general';
    const bucket = clusters.get(segment) || [];
    bucket.push(keyword);
    clusters.set(segment, bucket);
  });

  const opportunities = [];

  for (const [segment, items] of clusters.entries()) {
    const topItems = items
      .sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0))
      .slice(0, 5)
      .map((item) => ({
        keyword: item.keyword,
        opportunityScore: item.opportunityScore,
        intent: item.intent,
      }));

    opportunities.push({
      segment,
      totalKeywords: items.length,
      topOpportunities: topItems,
      recommendedSchema: recommendSchemaForSegment(segment),
      recommendedContentType: recommendContentType(segment),
      entityAnchor: generateHash(segment + topItems.map((item) => item.keyword).join('|')),
    });
  }

  return opportunities.sort((a, b) => b.totalKeywords - a.totalKeywords);
}

function recommendSchemaForSegment(segment) {
  switch (segment) {
    case 'agri-pv':
      return ['AgriculturalOrganization', 'Service', 'HowTo'];
    case 'storage':
      return ['Product', 'TechArticle', 'FAQPage'];
    case 'sector-coupling':
      return ['TechArticle', 'HowTo', 'Product'];
    case 'commercial':
      return ['Service', 'Organization', 'Review'];
    case 'residential':
      return ['Service', 'HowTo', 'FAQPage'];
    default:
      return ['WebPage', 'FAQPage'];
  }
}

function recommendContentType(segment) {
  switch (segment) {
    case 'agri-pv':
      return 'Case Studies & Fördermittel-Guides mit regionalem Fokus';
    case 'storage':
      return 'Vergleichstabellen, Dimensionierungsrechner & Notstrom-Guides';
    case 'sector-coupling':
      return 'Interaktive Ratgeber zu Wärmepumpe, Wallbox, EMS-Integration';
    case 'commercial':
      return 'ROI-Kalkulatoren, Branchen-Landingpages, PPA-Rechner';
    case 'residential':
      return 'Kostenkalkulator, Schritt-für-Schritt-Anleitungen, Video-FAQ';
    default:
      return 'Pillar-Content mit begleitendem FAQ und Speakable-Markup';
  }
}
