#!/usr/bin/env node

/**
 * Content Analysis Suite für ZOE Solar
 * Kombiniertes Tool für Content Gap Analysis, Competitor Analysis, Performance Insights, Trends, Recommendations und Reporting
 */

const fs = require('fs');
const path = require('path');

/**
 * Content Gap Analysis
 */
function analyzeContentGaps(ownContent, competitorContent) {
  const gaps = {
    missingTopics: [],
    underservedKeywords: [],
    contentTypeGaps: [],
    depthGaps: []
  };

  // Sammle alle Keywords von Konkurrenten
  const competitorKeywords = new Set();
  competitorContent.forEach(comp => {
    comp.content.forEach(content => {
      content.keywords.forEach(keyword => competitorKeywords.add(keyword));
    });
  });

  // Finde fehlende Keywords
  const ownKeywords = new Set();
  ownContent.forEach(content => {
    content.keywords.forEach(keyword => ownKeywords.add(keyword));
  });

  competitorKeywords.forEach(keyword => {
    if (!ownKeywords.has(keyword)) {
      gaps.underservedKeywords.push({
        keyword: keyword,
        competitors: competitorContent.filter(c => c.content.some(content => content.keywords.includes(keyword))).length,
        opportunity: calculateGapOpportunity(keyword, competitorContent)
      });
    }
  });

  // Finde Content-Type Lücken
  const contentTypes = ['blog', 'guide', 'video', 'infographic', 'case-study'];
  contentTypes.forEach(type => {
    const competitorCount = competitorContent.filter(c => c.type === type).length;
    const ownCount = ownContent.filter(c => c.type === type).length;

    if (competitorCount > ownCount * 2) {
      gaps.contentTypeGaps.push({
        type: type,
        competitorCount: competitorCount,
        ownCount: ownCount,
        gap: competitorCount - ownCount
      });
    }
  });

  // Finde Themen-Lücken
  const topics = ['kosten', 'förderung', 'installation', 'wartung', 'technik'];
  topics.forEach(topic => {
    const competitorTopicCount = competitorContent.filter(c =>
      c.content.some(content => content.title.toLowerCase().includes(topic))
    ).length;

    const ownTopicCount = ownContent.filter(c =>
      c.title.toLowerCase().includes(topic)
    ).length;

    if (competitorTopicCount > ownTopicCount) {
      gaps.missingTopics.push({
        topic: topic,
        competitorContent: competitorTopicCount,
        ownContent: ownTopicCount,
        priority: competitorTopicCount > ownTopicCount * 2 ? 'high' : 'medium'
      });
    }
  });

  return gaps;
}

/**
 * Berechnet Opportunity-Score für Content-Gaps
 */
function calculateGapOpportunity(keyword, competitorContent) {
  let score = 0;

  competitorContent.forEach(comp => {
    if (comp.content.some(content => content.keywords.includes(keyword))) {
      score += comp.authorityScore || 10;
      score += comp.backlinks || 5;
    }
  });

  return score;
}

/**
 * Competitor Content Analysis
 */
function analyzeCompetitorContent(competitors) {
  const analysis = {
    contentStrategy: {},
    keywordStrategy: {},
    performanceMetrics: {},
    opportunities: []
  };

  // Analysiere Content-Strategien
  const contentTypes = {};
  const keywords = {};

  competitors.forEach(comp => {
    comp.content.forEach(content => {
      // Content-Type Zählung
      contentTypes[content.type] = (contentTypes[content.type] || 0) + 1;

      // Keyword-Analyse
      content.keywords.forEach(keyword => {
        keywords[keyword] = (keywords[keyword] || 0) + 1;
      });
    });
  });

  analysis.contentStrategy = contentTypes;
  analysis.keywordStrategy = Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);

  // Performance-Metriken
  analysis.performanceMetrics = {
    avgContentLength: competitors.reduce((sum, comp) =>
      sum + comp.content.reduce((s, c) => s + c.wordCount, 0), 0
    ) / competitors.length,
    avgKeywordsPerContent: competitors.reduce((sum, comp) =>
      sum + comp.content.reduce((s, c) => s + c.keywords.length, 0), 0
    ) / competitors.length
  };

  // Opportunities identifizieren
  analysis.opportunities = identifyCompetitorOpportunities(competitors);

  return analysis;
}

/**
 * Identifiziert Opportunities aus Competitor-Analyse
 */
function identifyCompetitorOpportunities(competitors) {
  const opportunities = [];

  // Finde schwache Bereiche bei Konkurrenten
  competitors.forEach(comp => {
    const weakContent = comp.content.filter(c => c.performance < 50);
    if (weakContent.length > 0) {
      opportunities.push({
        type: 'weak_competitor_content',
        competitor: comp.name,
        content: weakContent.map(c => c.title),
        opportunity: 'Übertreffe diese schwachen Inhalte'
      });
    }
  });

  // Finde ungenutzte Keywords
  const allKeywords = new Set();
  competitors.forEach(comp => {
    comp.content.forEach(c => c.keywords.forEach(k => allKeywords.add(k)));
  });

  const keywordUsage = {};
  allKeywords.forEach(keyword => {
    keywordUsage[keyword] = competitors.filter(comp =>
      comp.content.some(c => c.keywords.includes(keyword))
    ).length;
  });

  Object.entries(keywordUsage).forEach(([keyword, usage]) => {
    if (usage === 1) { // Nur ein Konkurrent nutzt es
      opportunities.push({
        type: 'underexploited_keyword',
        keyword: keyword,
        opportunity: 'Nutze dieses Keyword stärker'
      });
    }
  });

  return opportunities;
}

/**
 * Performance Insights Generator
 */
function generatePerformanceInsights(metrics, historicalData) {
  const insights = {
    trends: [],
    anomalies: [],
    opportunities: [],
    risks: []
  };

  // Trend-Analyse
  if (historicalData && historicalData.length > 1) {
    const recent = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];

    // Traffic Trends
    const trafficChange = ((recent.organicTraffic - previous.organicTraffic) / previous.organicTraffic) * 100;
    if (Math.abs(trafficChange) > 10) {
      insights.trends.push({
        metric: 'organic_traffic',
        change: trafficChange,
        direction: trafficChange > 0 ? 'up' : 'down',
        significance: Math.abs(trafficChange) > 20 ? 'high' : 'medium'
      });
    }

    // Ranking Trends
    const avgRankingChange = recent.keywords.reduce((sum, k) =>
      sum + (k.position - (previous.keywords.find(pk => pk.keyword === k.keyword)?.position || k.position)), 0
    ) / recent.keywords.length;

    if (Math.abs(avgRankingChange) > 1) {
      insights.trends.push({
        metric: 'average_ranking',
        change: avgRankingChange,
        direction: avgRankingChange < 0 ? 'up' : 'down',
        significance: Math.abs(avgRankingChange) > 2 ? 'high' : 'medium'
      });
    }
  }

  // Anomalien identifizieren
  if (metrics) {
    // Plötzliche Traffic-Drops
    if (metrics.organicTraffic < metrics.expectedTraffic * 0.8) {
      insights.anomalies.push({
        type: 'traffic_drop',
        severity: 'high',
        description: `Traffic ${Math.round((1 - metrics.organicTraffic / metrics.expectedTraffic) * 100)}% unter Erwartung`,
        action: 'Sofortige Untersuchung erforderlich'
      });
    }

    // Keyword-Ranking Verluste
    const lostRankings = metrics.keywords.filter(k => k.position > 20);
    if (lostRankings.length > metrics.keywords.length * 0.3) {
      insights.anomalies.push({
        type: 'ranking_loss',
        severity: 'medium',
        description: `${lostRankings.length} Keywords verloren Ranking`,
        action: 'Content-Optimierung prüfen'
      });
    }
  }

  // Opportunities identifizieren
  if (metrics) {
    // Unterperformende Keywords
    const underperforming = metrics.keywords.filter(k =>
      k.position > 10 && k.searchVolume > 1000
    );
    if (underperforming.length > 0) {
      insights.opportunities.push({
        type: 'keyword_optimization',
        keywords: underperforming.slice(0, 5).map(k => k.keyword),
        potential: underperforming.reduce((sum, k) => sum + k.searchVolume * 0.1, 0),
        action: 'Optimiere Content für diese Keywords'
      });
    }
  }

  return insights;
}

/**
 * Trend Identification
 */
function identifyTrends(data, timeframe = 30) {
  const trends = {
    seasonal: [],
    emerging: [],
    declining: [],
    predictions: []
  };

  // Saisonale Trends (basierend auf historische Daten)
  const seasonalPatterns = analyzeSeasonalPatterns(data, timeframe);
  trends.seasonal = seasonalPatterns;

  // Emerging Trends (steigende Suchvolumen)
  const emerging = data.metrics.keywords.filter(k =>
    k.trend === 'up' && k.growthRate > 20
  );
  trends.emerging = emerging.map(k => ({
    keyword: k.keyword,
    growthRate: k.growthRate,
    currentVolume: k.searchVolume,
    potential: k.searchVolume * (1 + k.growthRate / 100)
  }));

  // Declining Trends (fallende Suchvolumen)
  const declining = data.metrics.keywords.filter(k =>
    k.trend === 'down' && k.growthRate < -10
  );
  trends.declining = declining.map(k => ({
    keyword: k.keyword,
    declineRate: Math.abs(k.growthRate),
    currentVolume: k.searchVolume,
    risk: 'Potenzieller Traffic-Verlust'
  }));

  // Vorhersagen für nächste Periode
  trends.predictions = generatePredictions(data, emerging, declining);

  return trends;
}

/**
 * Analysiert saisonale Muster
 */
function analyzeSeasonalPatterns(data, timeframe) {
  const patterns = [];

  // Beispiel für Agri-PV saisonale Muster
  const seasonalKeywords = [
    { keyword: 'agri pv installation', peak: 'spring', reason: 'Pflanzsaison' },
    { keyword: 'agri pv förderung', peak: 'year-round', reason: 'Staatliche Förderungen' },
    { keyword: 'agri pv winter', peak: 'winter', reason: 'Wintervorbereitung' }
  ];

  patterns.push(...seasonalKeywords);

  return patterns;
}

/**
 * Generiert Vorhersagen
 */
function generatePredictions(data, emerging, declining) {
  const predictions = [];

  // Vorhersage für nächste 3 Monate
  emerging.forEach(keyword => {
    predictions.push({
      type: 'growth',
      keyword: keyword.keyword,
      timeframe: '3 months',
      predictedGrowth: keyword.growthRate,
      confidence: 'medium'
    });
  });

  declining.forEach(keyword => {
    predictions.push({
      type: 'decline',
      keyword: keyword.keyword,
      timeframe: '3 months',
      predictedDecline: keyword.declineRate,
      confidence: 'medium'
    });
  });

  return predictions;
}

/**
 * Recommendation Engine
 */
function generateRecommendations(analysis, insights, trends) {
  const recommendations = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
    prioritized: []
  };

  // Sofortige Handlungsempfehlungen
  if (insights.anomalies) {
    insights.anomalies.forEach(anomaly => {
      recommendations.immediate.push({
        action: anomaly.action,
        priority: anomaly.severity === 'high' ? 'critical' : 'high',
        reason: anomaly.description,
        expectedImpact: 'Sofortige Problemlösung'
      });
    });
  }

  // Kurzfristige Empfehlungen (1-3 Monate)
  if (analysis.gaps) {
    analysis.gaps.underservedKeywords.slice(0, 5).forEach(keyword => {
      recommendations.shortTerm.push({
        action: `Erstelle Content für "${keyword.keyword}"`,
        priority: 'high',
        reason: `${keyword.competitors} Konkurrenten ranken dafür`,
        expectedImpact: `Potenzieller Traffic-Gewinn: ${keyword.opportunity}`
      });
    });
  }

  // Langfristige Empfehlungen (3-6 Monate)
  if (trends.emerging) {
    trends.emerging.slice(0, 3).forEach(keyword => {
      recommendations.longTerm.push({
        action: `Baue Autorität für "${keyword.keyword}" auf`,
        priority: 'medium',
        reason: `Wachstum: ${keyword.growthRate}%`,
        expectedImpact: `Zukünftiger Traffic: ${Math.round(keyword.potential)}`
      });
    });
  }

  // Priorisierte Empfehlungen
  recommendations.prioritized = [
    ...recommendations.immediate,
    ...recommendations.shortTerm,
    ...recommendations.longTerm
  ].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return recommendations;
}

/**
 * Custom Reporting Automation
 */
function generateCustomReport(data, reportType = 'comprehensive') {
  const report = {
    title: '',
    date: new Date().toISOString(),
    sections: [],
    summary: {},
    recommendations: []
  };

  switch (reportType) {
    case 'content_gap':
      report.title = 'Content Gap Analysis Report';
      report.sections = [
        {
          title: 'Content Gaps',
          data: data.gaps,
          insights: generateGapInsights(data.gaps)
        },
        {
          title: 'Competitor Analysis',
          data: data.competitorAnalysis,
          insights: generateCompetitorInsights(data.competitorAnalysis)
        }
      ];
      break;

    case 'performance':
      report.title = 'Performance Insights Report';
      report.sections = [
        {
          title: 'Performance Trends',
          data: data.insights.trends,
          insights: generateTrendInsights(data.insights.trends)
        },
        {
          title: 'Anomalien & Risiken',
          data: data.insights.anomalies,
          insights: generateAnomalyInsights(data.insights.anomalies)
        }
      ];
      break;

    case 'trends':
      report.title = 'Trend Analysis Report';
      report.sections = [
        {
          title: 'Emerging Trends',
          data: data.trends.emerging,
          insights: generateTrendInsights(data.trends.emerging)
        },
        {
          title: 'Seasonal Patterns',
          data: data.trends.seasonal,
          insights: generateSeasonalInsights(data.trends.seasonal)
        }
      ];
      break;

    default: // comprehensive
      report.title = 'Comprehensive SEO Analysis Report';
      report.sections = [
        {
          title: 'Content Analysis',
          data: data.gaps,
          insights: generateGapInsights(data.gaps)
        },
        {
          title: 'Performance Overview',
          data: data.insights
        },
        {
          title: 'Trend Analysis',
          data: data.trends,
          insights: generateTrendInsights(data.trends.emerging)
        }
      ];
  }

  report.summary = generateReportSummary(report.sections);
  report.recommendations = data.recommendations?.prioritized || [];

  return report;
}

/**
 * Generiert Bericht-Zusammenfassung
 */
function generateReportSummary(sections) {
  const summary = {
    totalInsights: 0,
    criticalIssues: 0,
    opportunities: 0,
    risks: 0
  };

  sections.forEach(section => {
    if (section.insights) {
      summary.totalInsights += section.insights.length;
      summary.criticalIssues += section.insights.filter(i => i.severity === 'critical').length;
      summary.opportunities += section.insights.filter(i => i.type === 'opportunity').length;
      summary.risks += section.insights.filter(i => i.type === 'risk').length;
    }
  });

  return summary;
}

// Hilfsfunktionen für Insights
function generateGapInsights(gaps) {
  const insights = [];
  if (gaps.underservedKeywords.length > 0) {
    insights.push({
      type: 'opportunity',
      severity: 'high',
      message: `${gaps.underservedKeywords.length} ungenutzte Keywords gefunden`,
      action: 'Erstelle Content für diese Keywords'
    });
  }
  return insights;
}

function generateCompetitorInsights(analysis) {
  const insights = [];
  if (analysis.opportunities.length > 0) {
    insights.push({
      type: 'opportunity',
      severity: 'medium',
      message: `${analysis.opportunities.length} Competitor-Opportunities identifiziert`,
      action: 'Nutze schwache Bereiche der Konkurrenz'
    });
  }
  return insights;
}

function generateTrendInsights(trends) {
  return trends.map(trend => ({
    type: trend.direction === 'up' ? 'opportunity' : 'risk',
    severity: trend.significance === 'high' ? 'medium' : 'low',
    message: `${trend.metric} zeigt ${trend.direction}ward Trend`,
    action: trend.direction === 'up' ? 'Nutze Momentum' : 'Untersuche Ursachen'
  }));
}

function generateAnomalyInsights(anomalies) {
  return anomalies.map(anomaly => ({
    type: 'risk',
    severity: anomaly.severity,
    message: anomaly.description,
    action: anomaly.action
  }));
}

function generateSeasonalInsights(patterns) {
  return patterns.map(pattern => ({
    type: 'insight',
    severity: 'low',
    message: `${pattern.keyword} peakt in ${pattern.peak}`,
    action: 'Plane Content entsprechend'
  }));
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('📊 Starte Content Analysis Suite...\n');

  // Beispiel-Daten für Demo
  const sampleData = {
    ownContent: [
      {
        title: 'Agri-Photovoltaik Grundlagen',
        type: 'blog',
        keywords: ['agri photovoltaik', 'grundlagen'],
        wordCount: 1500
      },
      {
        title: 'Förderungen für Agri-PV',
        type: 'guide',
        keywords: ['agri pv förderung', 'kfw'],
        wordCount: 2000
      }
    ],
    competitorContent: [
      {
        name: 'Competitor A',
        content: [
          {
            title: 'Agri-PV Kosten Analyse',
            type: 'blog',
            keywords: ['agri pv kosten', 'wirtschaftlichkeit'],
            wordCount: 1800,
            performance: 75
          },
          {
            title: 'Installation Guide',
            type: 'guide',
            keywords: ['agri pv installation', 'montage'],
            wordCount: 2500,
            performance: 85
          }
        ],
        authorityScore: 60,
        backlinks: 150
      }
    ],
    metrics: {
      organicTraffic: 5000,
      expectedTraffic: 5500,
      keywords: [
        { keyword: 'agri photovoltaik', position: 5, searchVolume: 1200 },
        { keyword: 'agri pv kosten', position: 12, searchVolume: 800 },
        { keyword: 'agri pv förderung', position: 3, searchVolume: 1500 }
      ]
    },
    historicalData: [
      {
        date: '2024-01',
        organicTraffic: 4500,
        keywords: [
          { keyword: 'agri photovoltaik', position: 8 },
          { keyword: 'agri pv kosten', position: 15 }
        ]
      },
      {
        date: '2024-02',
        organicTraffic: 5000,
        keywords: [
          { keyword: 'agri photovoltaik', position: 5 },
          { keyword: 'agri pv kosten', position: 12 }
        ]
      }
    ]
  };

  console.log('🔍 Führe Content Gap Analysis durch...');
  const gaps = analyzeContentGaps(sampleData.ownContent, sampleData.competitorContent);

  console.log('🏆 Analysiere Competitor Content...');
  const competitorAnalysis = analyzeCompetitorContent(sampleData.competitorContent);

  console.log('📈 Generiere Performance Insights...');
  const insights = generatePerformanceInsights(sampleData.metrics, sampleData.historicalData);

  console.log('📊 Identifiziere Trends...');
  const trends = identifyTrends(sampleData);

  console.log('🤖 Baue Recommendation Engine...');
  const recommendations = generateRecommendations(
    { gaps, competitorAnalysis },
    insights,
    trends
  );

  console.log('📋 Erstelle Custom Reports...');
  const comprehensiveReport = generateCustomReport({
    gaps,
    competitorAnalysis,
    insights,
    trends,
    recommendations,
    metrics: sampleData.metrics,
    historicalData: sampleData.historicalData
  }, 'comprehensive');

  // Zeige Ergebnisse
  console.log('\n🎯 Content Gaps:');
  console.log(`  • Fehlende Keywords: ${gaps.underservedKeywords.length}`);
  console.log(`  • Content-Type Lücken: ${gaps.contentTypeGaps.length}`);
  console.log(`  • Themen-Lücken: ${gaps.missingTopics.length}`);

  console.log('\n💡 Performance Insights:');
  console.log(`  • Trends: ${insights.trends.length}`);
  console.log(`  • Anomalien: ${insights.anomalies.length}`);
  console.log(`  • Opportunities: ${insights.opportunities.length}`);

  console.log('\n📈 Trends:');
  console.log(`  • Emerging: ${trends.emerging.length}`);
  console.log(`  • Declining: ${trends.declining.length}`);
  console.log(`  • Predictions: ${trends.predictions.length}`);

  console.log('\n🎯 Top Recommendations:');
  recommendations.prioritized.slice(0, 5).forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec.action} (${rec.priority})`);
  });

  // Speichere Ergebnisse
  const outputFile = path.join(__dirname, '..', 'data', 'content-analysis-suite.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    analysis: {
      gaps,
      competitorAnalysis,
      insights,
      trends,
      recommendations,
      reports: {
        comprehensive: comprehensiveReport
      }
    }
  }, null, 2));

  console.log(`\n💾 Content Analysis Suite gespeichert: ${outputFile}`);
  console.log('\n🎉 Content Analysis Suite abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  analyzeContentGaps,
  analyzeCompetitorContent,
  generatePerformanceInsights,
  identifyTrends,
  generateRecommendations,
  generateCustomReport
};