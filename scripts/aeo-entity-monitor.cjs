#!/usr/bin/env node

/**
 * AEO Entity Authority Monitor für ZOE Solar
 * Überwacht Knowledge Graph Präsenz und Entity Strength Scoring
 */

const fs = require('fs');
const path = require('path');

/**
 * Simuliert Knowledge Graph Entities für ZOE Solar
 */
function simulateKnowledgeGraphEntities(brandName = 'ZOE Solar') {
  const entities = {
    // Haupt-Entity
    [brandName]: {
      name: brandName,
      type: 'SolarEnergyCompany',
      authority: 85,
      mentions: 1250,
      knowledgePanel: {
        present: true,
        completeness: 92,
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        features: ['Logo', 'Description', 'Contact Info', 'Website', 'Social Media', 'Reviews']
      },
      searchFeatures: {
        featuredSnippet: { present: true, position: 1, topic: 'Solar Installation' },
        localPack: { present: true, position: 2 },
        knowledgePanel: { present: true, expanded: true },
        instantAnswer: { present: false }
      },
      entityRelationships: [
        { entity: 'Solar Energy', strength: 95, type: 'industry' },
        { entity: 'Renewable Energy', strength: 88, type: 'industry' },
        { entity: 'Photovoltaics', strength: 92, type: 'product' },
        { entity: 'Germany', strength: 78, type: 'location' }
      ]
    },

    // Produkt-Entities
    'Photovoltaik': {
      name: 'Photovoltaik',
      type: 'Technology',
      authority: 78,
      mentions: 2100,
      knowledgePanel: {
        present: true,
        completeness: 88,
        features: ['Description', 'History', 'Applications', 'Benefits']
      },
      searchFeatures: {
        featuredSnippet: { present: true, position: 1, topic: 'What is Photovoltaics' },
        knowledgePanel: { present: true, expanded: false },
        localPack: { present: false },
        instantAnswer: { present: false }
      },
      entityRelationships: [
        { entity: brandName, strength: 65, type: 'provider' },
        { entity: 'Solar Energy', strength: 98, type: 'category' }
      ]
    },

    'Solaranlage': {
      name: 'Solaranlage',
      type: 'Product',
      authority: 72,
      mentions: 1800,
      knowledgePanel: {
        present: true,
        completeness: 85,
        features: ['Description', 'Types', 'Components', 'Installation']
      },
      searchFeatures: {
        featuredSnippet: { present: false },
        knowledgePanel: { present: true, expanded: false },
        localPack: { present: false },
        instantAnswer: { present: false }
      },
      entityRelationships: [
        { entity: brandName, strength: 82, type: 'provider' },
        { entity: 'Photovoltaik', strength: 95, type: 'technology' }
      ]
    },

    'Elektroauto Ladestation': {
      name: 'Elektroauto Ladestation',
      type: 'Product',
      authority: 68,
      mentions: 950,
      knowledgePanel: {
        present: false,
        completeness: 0
      },
      searchFeatures: {
        featuredSnippet: { present: false },
        knowledgePanel: { present: false },
        localPack: { present: false },
        instantAnswer: { present: false }
      },
      entityRelationships: [
        { entity: brandName, strength: 75, type: 'provider' },
        { entity: 'Electric Vehicle', strength: 88, type: 'category' }
      ]
    }
  };

  // Berechne Entity Strength Score für jede Entity
  Object.keys(entities).forEach(entityName => {
    const entity = entities[entityName];
    entity.entityStrengthScore = calculateEntityStrengthScore(entity);
  });

  return entities;
}

/**
 * Berechnet Entity Strength Score
 */
function calculateEntityStrengthScore(entity) {
  let score = 0;

  // Authority (0-100)
  score += entity.authority * 0.3;

  // Mentions (normalisiert auf 0-100)
  const mentionScore = Math.min(entity.mentions / 25, 100); // 2500 mentions = 100 points
  score += mentionScore * 0.2;

  // Knowledge Panel Präsenz und Vollständigkeit
  if (entity.knowledgePanel.present) {
    score += 20; // Basis-Punkte für Präsenz
    score += (entity.knowledgePanel.completeness / 100) * 15; // Bis zu 15 Punkte für Vollständigkeit
  }

  // Search Features
  const features = entity.searchFeatures;
  if (features.featuredSnippet.present) score += 15;
  if (features.knowledgePanel.present && features.knowledgePanel.expanded) score += 10;
  if (features.localPack.present) score += 8;
  if (features.instantAnswer.present) score += 12;

  // Entity Relationships
  const avgRelationshipStrength = entity.entityRelationships.reduce((sum, rel) => sum + rel.strength, 0) / entity.entityRelationships.length;
  score += (avgRelationshipStrength / 100) * 10;

  return Math.round(Math.min(score, 100));
}

/**
 * Simuliert SERP Features für AEO-Queries
 */
function simulateAEOQueries(entities) {
  const aeoQueries = [
    'Was ist Photovoltaik',
    'Wie funktioniert eine Solaranlage',
    'Solaranlage Kosten',
    'ZOE Solar Erfahrungen',
    'Beste Solaranlagen 2024',
    'Photovoltaik Förderungen',
    'Solar Installation Berlin',
    'Elektroauto laden zu Hause'
  ];

  const queryResults = {};

  aeoQueries.forEach(query => {
    const features = {
      featuredSnippet: {
        present: Math.random() > 0.6,
        position: Math.floor(Math.random() * 3) + 1,
        source: Math.random() > 0.7 ? 'ZOE Solar' : 'Wikipedia/Other'
      },
      knowledgePanel: {
        present: Math.random() > 0.5,
        entity: Math.random() > 0.6 ? 'ZOE Solar' : 'Photovoltaik',
        expanded: Math.random() > 0.7
      },
      localPack: {
        present: query.includes('Berlin') || Math.random() > 0.8,
        position: Math.floor(Math.random() * 3) + 1
      },
      peopleAlsoAsk: {
        present: Math.random() > 0.4,
        questions: Math.floor(Math.random() * 5) + 3
      },
      relatedSearches: {
        present: true,
        count: Math.floor(Math.random() * 8) + 4
      }
    };

    queryResults[query] = {
      query,
      searchVolume: Math.floor(Math.random() * 5000) + 1000,
      features,
      competitiveAdvantage: calculateCompetitiveAdvantage(features),
      timestamp: new Date().toISOString()
    };
  });

  return queryResults;
}

/**
 * Berechnet Competitive Advantage Score für AEO Features
 */
function calculateCompetitiveAdvantage(features) {
  let score = 0;

  if (features.featuredSnippet.present && features.featuredSnippet.source.includes('ZOE')) score += 25;
  if (features.knowledgePanel.present && features.knowledgePanel.entity.includes('ZOE')) score += 20;
  if (features.knowledgePanel.expanded) score += 15;
  if (features.localPack.present) score += 10;
  if (features.peopleAlsoAsk.present) score += 5;

  return Math.min(score, 100);
}

/**
 * Berechnet AEO-KPIs
 */
function calculateAEO_KPIs(entities, aeoQueries) {
  const entityList = Object.values(entities);
  const queryList = Object.values(aeoQueries);

  const knowledgePanelsPresent = entityList.filter(e => e.knowledgePanel.present).length;
  const knowledgePanelCompleteness = knowledgePanelsPresent > 0 ?
    entityList.filter(e => e.knowledgePanel.present)
      .reduce((sum, e) => sum + e.knowledgePanel.completeness, 0) / knowledgePanelsPresent : 0;

  return {
    // Entity Authority
    avgEntityAuthority: entityList.reduce((sum, e) => sum + e.authority, 0) / entityList.length,
    avgEntityStrengthScore: entityList.reduce((sum, e) => sum + e.entityStrengthScore, 0) / entityList.length,

    // Knowledge Graph Präsenz
    knowledgePanelsPresent,
    knowledgePanelCompleteness,

    // AEO Features
    featuredSnippetsOwned: queryList.filter(q => q.features.featuredSnippet.present && q.features.featuredSnippet.source.includes('ZOE')).length,
    knowledgePanelsInSERP: queryList.filter(q => q.features.knowledgePanel.present).length,
    avgCompetitiveAdvantage: queryList.reduce((sum, q) => sum + q.competitiveAdvantage, 0) / queryList.length,

    // Entity Relationships
    totalEntityRelationships: entityList.reduce((sum, e) => sum + e.entityRelationships.length, 0),
    avgRelationshipStrength: entityList.reduce((sum, e) => {
      return sum + (e.entityRelationships.reduce((s, r) => s + r.strength, 0) / e.entityRelationships.length);
    }, 0) / entityList.length,

    timestamp: new Date().toISOString()
  };
}

/**
 * Generiert AEO-spezifische Empfehlungen
 */
function generateAEORecommendations(kpis, entities, aeoQueries) {
  const recommendations = [];

  if (kpis.avgEntityStrengthScore < 70) {
    recommendations.push({
      priority: 'high',
      category: 'entity-building',
      title: 'Entity Strength verbessern',
      description: `Durchschnittliche Entity Strength: ${kpis.avgEntityStrengthScore.toFixed(1)}. Bauen Sie mehr strukturierte Daten und Erwähnungen auf.`,
      impact: 'high',
      effort: 'high'
    });
  }

  if (kpis.knowledgePanelsPresent < Object.keys(entities).length * 0.8) {
    recommendations.push({
      priority: 'high',
      category: 'knowledge-graph',
      title: 'Knowledge Panel Präsenz erhöhen',
      description: `${kpis.knowledgePanelsPresent}/${Object.keys(entities).length} Entities haben Knowledge Panels. Optimieren Sie Entity-Daten.`,
      impact: 'high',
      effort: 'medium'
    });
  }

  if (kpis.featuredSnippetsOwned < 3) {
    recommendations.push({
      priority: 'medium',
      category: 'content-optimization',
      title: 'Featured Snippets gewinnen',
      description: `Nur ${kpis.featuredSnippetsOwned} Featured Snippets in Besitz. Optimieren Sie Content für häufige Fragen.`,
      impact: 'medium',
      effort: 'medium'
    });
  }

  // Entity-spezifische Empfehlungen
  Object.entries(entities).forEach(([entityName, entity]) => {
    if (entity.entityStrengthScore < 60) {
      recommendations.push({
        priority: 'medium',
        category: 'entity-optimization',
        title: `Entity "${entityName}" stärken`,
        description: `Entity Strength Score: ${entity.entityStrengthScore}. Mehr strukturierte Daten und Backlinks benötigt.`,
        impact: 'medium',
        effort: 'medium',
        entity: entityName
      });
    }

    if (entity.knowledgePanel.present && entity.knowledgePanel.completeness < 80) {
      recommendations.push({
        priority: 'low',
        category: 'knowledge-panel',
        title: `Knowledge Panel für "${entityName}" vervollständigen`,
        description: `Vollständigkeit: ${entity.knowledgePanel.completeness}%. Fügen Sie fehlende Informationen hinzu.`,
        impact: 'low',
        effort: 'low',
        entity: entityName
      });
    }
  });

  return recommendations;
}

/**
 * Hauptfunktion für AEO Entity Authority Monitor
 */
async function runAEOEntityMonitor() {
  console.log('🎯 Initialisiere AEO Entity Authority Monitor...\n');

  try {
    // Simuliere Knowledge Graph Entities
    const entities = simulateKnowledgeGraphEntities('ZOE Solar');
    console.log(`📊 Analysiere ${Object.keys(entities).length} Entities...`);

    // Simuliere AEO Queries
    const aeoQueries = simulateAEOQueries(entities);
    console.log(`🔍 Analysiere ${Object.keys(aeoQueries).length} AEO-Queries...`);

    // Berechne AEO-KPIs
    const kpis = calculateAEO_KPIs(entities, aeoQueries);
    console.log('✅ AEO-KPIs berechnet');

    // Generiere Empfehlungen
    const recommendations = generateAEORecommendations(kpis, entities, aeoQueries);
    console.log(`✅ ${recommendations.length} AEO-Empfehlungen generiert`);

    // Erstelle AEO-Report
    const aeoReport = {
      timestamp: new Date().toISOString(),
      kpis,
      entities,
      aeoQueries,
      recommendations,
      summary: {
        totalEntities: Object.keys(entities).length,
        avgEntityAuthority: kpis.avgEntityAuthority,
        avgEntityStrengthScore: kpis.avgEntityStrengthScore,
        knowledgePanelsPresent: kpis.knowledgePanelsPresent,
        featuredSnippetsOwned: kpis.featuredSnippetsOwned,
        avgCompetitiveAdvantage: kpis.avgCompetitiveAdvantage,
        alerts: recommendations.filter(r => r.priority === 'high').length,
        opportunities: recommendations.filter(r => r.priority === 'medium').length
      }
    };

    // Speichere AEO-Report
    const aeoFile = path.join(__dirname, '..', 'data', 'aeo-entity-report.json');
    fs.writeFileSync(aeoFile, JSON.stringify(aeoReport, null, 2));

    // Zeige AEO-Zusammenfassung
    console.log('\n🎯 AEO Entity Authority Zusammenfassung:');
    console.log(`  • Durchschnittliche Entity Authority: ${kpis.avgEntityAuthority.toFixed(1)}`);
    console.log(`  • Durchschnittlicher Entity Strength Score: ${kpis.avgEntityStrengthScore.toFixed(1)}`);
    console.log(`  • Knowledge Panels vorhanden: ${kpis.knowledgePanelsPresent}/${Object.keys(entities).length}`);
    console.log(`  • Eigene Featured Snippets: ${kpis.featuredSnippetsOwned}`);
    console.log(`  • Durchschnittlicher Competitive Advantage: ${kpis.avgCompetitiveAdvantage.toFixed(1)}`);
    console.log(`  • Knowledge Panel Vollständigkeit: ${kpis.knowledgePanelCompleteness.toFixed(1)}%`);
    console.log(`  • Kritische Alerts: ${aeoReport.summary.alerts}`);
    console.log(`  • Optimierungsmöglichkeiten: ${aeoReport.summary.opportunities}`);

    console.log(`\n💾 AEO-Report gespeichert: ${aeoFile}`);
    console.log('\n🎉 AEO Entity Authority Monitor abgeschlossen!');

    return aeoReport;

  } catch (error) {
    console.error('❌ Fehler beim AEO Entity Monitoring:', error.message);
    throw error;
  }
}

// Export-Funktionen
module.exports = {
  runAEOEntityMonitor,
  simulateKnowledgeGraphEntities,
  simulateAEOQueries,
  calculateAEO_KPIs,
  calculateEntityStrengthScore,
  generateAEORecommendations
};

// Führe Monitor aus wenn direkt aufgerufen
if (require.main === module) {
  runAEOEntityMonitor().catch(console.error);
}