#!/usr/bin/env node

/**
 * Unified Strategy Orchestrator für ZOE Solar
 * Zentraler Koordinator für alle Strategie-Komponenten
 */

const fs = require('fs');
const path = require('path');

console.log('🎼 Starting Unified Strategy Orchestrator...\n');

/**
 * Orchestrator-Klasse für das integrierte System
 */
class UnifiedStrategyOrchestrator {

  constructor() {
    this.executionOrder = [
      'seo-monitoring',
      'geo-monitoring',
      'correlation-analysis',
      'alert-system',
      'strategy-optimization',
      'automated-execution'
    ];

    this.results = {};
    this.errors = [];
  }

  /**
   * Führt vollständigen Strategie-Zyklus aus
   */
  async runFullStrategyCycle(options = {}) {
    const { skipExecution = false, verbose = true } = options;

    console.log('🚀 Starte vollständigen Strategie-Zyklus...\n');

    const startTime = Date.now();

    try {
      // 1. SEO Monitoring
      await this.runSEOMonitoring(verbose);

      // 2. GEO Monitoring
      await this.runGEOMonitoring(verbose);

      // 3. Correlation Analysis
      await this.runCorrelationAnalysis(verbose);

      // 4. Alert System
      await this.runAlertSystem(verbose);

      // 5. Strategy Optimization
      await this.runStrategyOptimization(verbose);

      // 6. Automated Execution (optional)
      if (!skipExecution) {
        await this.runAutomatedExecution(verbose);
      }

      // Generiere integrierten Bericht
      const integratedReport = this.generateIntegratedReport();

      // Speichere Master-Report
      this.saveMasterReport(integratedReport);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`\n🎉 Strategie-Zyklus erfolgreich abgeschlossen in ${duration}s!`);
      console.log(`📊 Integrierter Bericht: data/unified-strategy-report.json`);

      return integratedReport;

    } catch (error) {
      console.error('❌ Fehler im Strategie-Zyklus:', error.message);
      this.errors.push({
        stage: 'orchestration',
        error: error.message,
        timestamp: new Date().toISOString()
      });

      // Speichere Fehler-Report
      this.saveErrorReport();
      throw error;
    }
  }

  /**
   * Führt SEO Monitoring aus
   */
  async runSEOMonitoring(verbose) {
    if (verbose) console.log('📈 Führe SEO Monitoring aus...');

    try {
      const seoSuite = require('./seo-monitoring-suite.cjs');
      this.results.seo = await seoSuite.runSEOMonitoringDashboard();

      if (verbose) console.log('✅ SEO Monitoring abgeschlossen\n');
    } catch (error) {
      this.errors.push({ stage: 'seo-monitoring', error: error.message, timestamp: new Date().toISOString() });
      if (verbose) console.log('⚠️  SEO Monitoring übersprungen:', error.message, '\n');
    }
  }

  /**
   * Führt GEO Monitoring aus
   */
  async runGEOMonitoring(verbose) {
    if (verbose) console.log('🌍 Führe GEO Monitoring aus...');

    try {
      const geoTracker = require('./geo-performance-tracker.cjs');
      this.results.geo = await geoTracker.runGEOPerformanceTracker();

      if (verbose) console.log('✅ GEO Monitoring abgeschlossen\n');
    } catch (error) {
      this.errors.push({ stage: 'geo-monitoring', error: error.message, timestamp: new Date().toISOString() });
      if (verbose) console.log('⚠️  GEO Monitoring übersprungen:', error.message, '\n');
    }
  }

  /**
   * Führt Correlation Analysis aus
   */
  async runCorrelationAnalysis(verbose) {
    if (verbose) console.log('🔗 Führe Correlation Analysis aus...');

    try {
      const correlationAnalysis = require('./performance-correlation-analysis.cjs');
      this.results.correlations = await correlationAnalysis.runPerformanceCorrelationAnalysis();

      if (verbose) console.log('✅ Correlation Analysis abgeschlossen\n');
    } catch (error) {
      this.errors.push({ stage: 'correlation-analysis', error: error.message, timestamp: new Date().toISOString() });
      if (verbose) console.log('⚠️  Correlation Analysis übersprungen:', error.message, '\n');
    }
  }

  /**
   * Führt Alert System aus
   */
  async runAlertSystem(verbose) {
    if (verbose) console.log('🚨 Führe Alert System aus...');

    try {
      const alertSystem = require('./alert-system.cjs');
      this.results.alerts = await alertSystem.runAlertSystem();

      if (verbose) console.log('✅ Alert System abgeschlossen\n');
    } catch (error) {
      this.errors.push({ stage: 'alert-system', error: error.message, timestamp: new Date().toISOString() });
      if (verbose) console.log('⚠️  Alert System übersprungen:', error.message, '\n');
    }
  }

  /**
   * Führt Strategy Optimization aus
   */
  async runStrategyOptimization(verbose) {
    if (verbose) console.log('🧠 Führe Strategy Optimization aus...');

    try {
      const optimizationEngine = require('./strategy-optimization-engine.cjs');
      this.results.optimization = await optimizationEngine.runStrategyOptimizationEngine();

      if (verbose) console.log('✅ Strategy Optimization abgeschlossen\n');
    } catch (error) {
      this.errors.push({ stage: 'strategy-optimization', error: error.message, timestamp: new Date().toISOString() });
      if (verbose) console.log('⚠️  Strategy Optimization übersprungen:', error.message, '\n');
    }
  }

  /**
   * Führt Automated Execution aus
   */
  async runAutomatedExecution(verbose) {
    if (verbose) console.log('⚙️  Führe Automated Execution aus...');

    try {
      const executor = require('./unified-strategy-executor.cjs');
      this.results.execution = await executor.runUnifiedStrategyExecutor();

      if (verbose) console.log('✅ Automated Execution abgeschlossen\n');
    } catch (error) {
      this.errors.push({ stage: 'automated-execution', error: error.message, timestamp: new Date().toISOString() });
      if (verbose) console.log('⚠️  Automated Execution übersprungen:', error.message, '\n');
    }
  }

  /**
   * Generiert integrierten Bericht
   */
  generateIntegratedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      systemVersion: 'Unified Strategy Orchestrator v1.0',
      executionSummary: {
        completedStages: Object.keys(this.results),
        failedStages: this.errors.map(e => e.stage),
        totalStages: this.executionOrder.length,
        successRate: (Object.keys(this.results).length / this.executionOrder.length * 100).toFixed(1) + '%'
      },

      // Aggregierte KPIs
      unifiedKPIs: this.aggregateKPIs(),

      // Top-Alerts
      criticalAlerts: this.extractCriticalAlerts(),

      // Top-Empfehlungen
      topRecommendations: this.extractTopRecommendations(),

      // Strategie-Insights
      strategyInsights: this.generateStrategyInsights(),

      // Performance-Zusammenfassung
      performanceSummary: this.generatePerformanceSummary(),

      // Nächste Schritte
      nextSteps: this.generateNextSteps(),

      // System-Health
      systemHealth: this.assessSystemHealth(),

      errors: this.errors
    };

    return report;
  }

  /**
   * Aggregiert KPIs aus allen Strategien
   */
  aggregateKPIs() {
    const kpis = {
      seo: this.results.seo?.kpis || null,
      geo: this.results.geo?.kpis || null,
      aeo: this.results.seo?.kpis ? { entityAuthorityScore: 85, knowledgeGraphPresence: 88 } : null, // Mock für AEO
      correlations: this.results.correlations?.correlations || null
    };

    return kpis;
  }

  /**
   * Extrahiert kritische Alerts
   */
  extractCriticalAlerts() {
    const alerts = [];

    if (this.results.alerts?.alerts) {
      alerts.push(...this.results.alerts.alerts.filter(a => a.type === 'critical').slice(0, 5));
    }

    return alerts;
  }

  /**
   * Extrahiert Top-Empfehlungen
   */
  extractTopRecommendations() {
    const recommendations = [];

    if (this.results.optimization?.recommendations) {
      recommendations.push(...this.results.optimization.recommendations.slice(0, 5));
    }

    return recommendations;
  }

  /**
   * Generiert Strategie-Insights
   */
  generateStrategyInsights() {
    const insights = [];

    // Korrelations-Insights
    if (this.results.correlations?.insights) {
      insights.push(...this.results.correlations.insights.slice(0, 3));
    }

    // Performance-Insights
    if (this.results.seo?.kpis && this.results.geo?.kpis) {
      const seoScore = 100 - this.results.seo.kpis.avgPosition;
      const geoScore = this.results.geo.kpis.avgVisibilityScore;

      if (seoScore > geoScore + 20) {
        insights.push({
          type: 'strategy-imbalance',
          title: 'SEO stärker als GEO',
          description: 'SEO-Performance ist deutlich besser als GEO. Erwägen Sie Ressourcen-Umverteilung.',
          impact: 'medium'
        });
      } else if (geoScore > seoScore + 20) {
        insights.push({
          type: 'strategy-imbalance',
          title: 'GEO stärker als SEO',
          description: 'GEO-Performance ist deutlich besser als SEO. Nutzen Sie lokale Stärken.',
          impact: 'medium'
        });
      }
    }

    return insights;
  }

  /**
   * Generiert Performance-Zusammenfassung
   */
  generatePerformanceSummary() {
    return {
      overallHealth: this.calculateOverallHealth(),
      strategyPerformance: {
        seo: this.results.seo ? 'active' : 'inactive',
        geo: this.results.geo ? 'active' : 'inactive',
        aeo: 'partial', // Mock
        correlations: this.results.correlations ? 'active' : 'inactive'
      },
      alertsCount: this.results.alerts?.summary?.total || 0,
      recommendationsCount: this.results.optimization?.summary?.totalRecommendations || 0,
      lastExecution: new Date().toISOString()
    };
  }

  /**
   * Generiert nächste Schritte
   */
  generateNextSteps() {
    const steps = [
      'Überprüfen Sie kritische Alerts und implementieren Sie sofortige Maßnahmen',
      'Setzen Sie Top-Empfehlungen der KI-Engine um',
      'Überwachen Sie KPI-Entwicklung in den nächsten 7 Tagen',
      'Führen Sie nächsten vollständigen Strategie-Zyklus durch'
    ];

    if (this.errors.length > 0) {
      steps.unshift('Beheben Sie Systemfehler und fehlende Datenquellen');
    }

    return steps;
  }

  /**
   * Bewertet System-Health
   */
  assessSystemHealth() {
    let healthScore = 100;

    // Reduziere Score für fehlende Komponenten
    if (!this.results.seo) healthScore -= 20;
    if (!this.results.geo) healthScore -= 20;
    if (!this.results.correlations) healthScore -= 15;
    if (!this.results.alerts) healthScore -= 10;
    if (!this.results.optimization) healthScore -= 15;
    if (!this.results.execution) healthScore -= 10;

    // Reduziere Score für Fehler
    healthScore -= this.errors.length * 5;

    const health = healthScore >= 80 ? 'excellent' :
                   healthScore >= 60 ? 'good' :
                   healthScore >= 40 ? 'fair' : 'poor';

    return {
      score: Math.max(0, healthScore),
      status: health,
      issues: this.errors.length,
      missingComponents: this.executionOrder.filter(stage => !this.results[stage.replace('-', '')])
    };
  }

  /**
   * Berechnet Gesamt-Health-Score
   */
  calculateOverallHealth() {
    const components = ['seo', 'geo', 'correlations', 'alerts', 'optimization', 'execution'];
    const activeComponents = components.filter(c => this.results[c]).length;
    return (activeComponents / components.length * 100).toFixed(0) + '%';
  }

  /**
   * Speichert Master-Report
   */
  saveMasterReport(report) {
    const reportFile = path.join(__dirname, '..', 'data', 'unified-strategy-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  }

  /**
   * Speichert Fehler-Report
   */
  saveErrorReport() {
    const errorReport = {
      timestamp: new Date().toISOString(),
      errors: this.errors,
      partialResults: this.results
    };

    const errorFile = path.join(__dirname, '..', 'data', 'strategy-orchestrator-errors.json');
    fs.writeFileSync(errorFile, JSON.stringify(errorReport, null, 2));
  }
}

/**
 * Hauptfunktion für Unified Strategy Orchestrator
 */
async function runUnifiedStrategyOrchestrator(options = {}) {
  const orchestrator = new UnifiedStrategyOrchestrator();

  try {
    const result = await orchestrator.runFullStrategyCycle(options);
    return result;
  } catch (error) {
    console.error('❌ Orchestrator fehlgeschlagen:', error.message);
    throw error;
  }
}

// Export-Funktionen
module.exports = {
  runUnifiedStrategyOrchestrator,
  UnifiedStrategyOrchestrator
};

// Führe Orchestrator aus wenn direkt aufgerufen
if (require.main === module) {
  const options = {
    skipExecution: process.argv.includes('--skip-execution'),
    verbose: !process.argv.includes('--quiet')
  };

  runUnifiedStrategyOrchestrator(options).catch(console.error);
}