#!/usr/bin/env node

/**
 * AI Platform Performance Metrics Collector
 * Sammelt und analysiert detaillierte Performance-Metriken für jede KI-Plattform
 */

const fs = require('fs');
const path = require('path');

// Pfade zu den Daten-Dateien
const DASHBOARD_PATH = path.join(__dirname, '..', 'data', 'seo-dashboard.json');
const LOG_PATH = path.join(__dirname, '..', 'data', 'seo-monitoring', 'ai-platform-log.json');

class PerformanceMetricsCollector {
  constructor() {
    this.metrics = {};
    this.historicalData = [];
  }

  /**
   * Lädt aktuelle Daten aus dem Dashboard
   */
  loadCurrentData() {
    try {
      if (fs.existsSync(DASHBOARD_PATH)) {
        const data = JSON.parse(fs.readFileSync(DASHBOARD_PATH, 'utf8'));
        this.currentData = data.aiPlatformMonitoring || {};
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Dashboard-Daten:', error.message);
    }
  }

  /**
   * Lädt historische Logs
   */
  loadHistoricalData() {
    try {
      if (fs.existsSync(LOG_PATH)) {
        const data = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
        this.historicalData = Array.isArray(data) ? data : [data];
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der historischen Daten:', error.message);
    }
  }

  /**
   * Berechnet Performance-Metriken für eine Plattform
   */
  calculatePlatformMetrics(platformKey, platformData) {
    const platformLogs = this.historicalData.filter(log =>
      log && log.platforms && log.platforms[platformKey]
    );

    const metrics = {
      platform: platformKey,
      name: platformData.name || platformKey,
      current: {
        status: platformData.status,
        responseTime: platformData.performance?.responseTime || 0,
        uptime: platformData.uptime || 0,
        errorRate: platformData.performance?.errorRate || 0
      },
      historical: {
        totalChecks: platformLogs.length,
        successfulChecks: platformLogs.filter(log => log.platforms[platformKey].status === 'online').length,
        failedChecks: platformLogs.filter(log => log.platforms[platformKey].status === 'offline').length,
        averageResponseTime: this.calculateAverageResponseTime(platformLogs, platformKey),
        uptimePercentage: this.calculateUptimePercentage(platformLogs, platformKey),
        errorRateTrend: this.calculateErrorRateTrend(platformLogs, platformKey),
        responseTimeTrend: this.calculateResponseTimeTrend(platformLogs, platformKey)
      },
      health: {
        score: this.calculateHealthScore(platformData, platformLogs),
        status: this.determineHealthStatus(platformData, platformLogs),
        recommendations: this.generateRecommendations(platformData, platformLogs)
      }
    };

    return metrics;
  }

  /**
   * Berechnet durchschnittliche Response-Zeit aus historischen Daten
   */
  calculateAverageResponseTime(logs, platformKey) {
    const responseTimes = logs
      .filter(log => log.platforms[platformKey].performance?.responseTime)
      .map(log => log.platforms[platformKey].performance.responseTime);

    if (responseTimes.length === 0) return 0;

    return Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length);
  }

  /**
   * Berechnet Uptime-Prozentsatz
   */
  calculateUptimePercentage(logs, platformKey) {
    if (logs.length === 0) return 0;

    const onlineCount = logs.filter(log => log.platforms[platformKey].status === 'online').length;
    return Math.round((onlineCount / logs.length) * 100 * 100) / 100; // Auf 2 Dezimalstellen
  }

  /**
   * Berechnet Error-Rate-Trend
   */
  calculateErrorRateTrend(logs, platformKey) {
    const recentLogs = logs.slice(-10); // Letzte 10 Checks
    const errorRates = recentLogs
      .filter(log => log.platforms[platformKey].performance?.errorRate !== undefined)
      .map(log => log.platforms[platformKey].performance.errorRate);

    if (errorRates.length < 2) return 0;

    const firstHalf = errorRates.slice(0, Math.floor(errorRates.length / 2));
    const secondHalf = errorRates.slice(Math.floor(errorRates.length / 2));

    const firstAvg = firstHalf.reduce((sum, rate) => sum + rate, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, rate) => sum + rate, 0) / secondHalf.length;

    return Math.round((secondAvg - firstAvg) * 100) / 100;
  }

  /**
   * Berechnet Response-Time-Trend
   */
  calculateResponseTimeTrend(logs, platformKey) {
    const recentLogs = logs.slice(-10);
    const responseTimes = recentLogs
      .filter(log => log.platforms[platformKey].performance?.responseTime)
      .map(log => log.platforms[platformKey].performance.responseTime);

    if (responseTimes.length < 2) return 0;

    const firstHalf = responseTimes.slice(0, Math.floor(responseTimes.length / 2));
    const secondHalf = responseTimes.slice(Math.floor(responseTimes.length / 2));

    const firstAvg = firstHalf.reduce((sum, time) => sum + time, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, time) => sum + time, 0) / secondHalf.length;

    return Math.round(secondAvg - firstAvg);
  }

  /**
   * Berechnet Health-Score (0-100)
   */
  calculateHealthScore(platformData, logs) {
    let score = 100;

    // Status-Abzug
    if (platformData.status !== 'online') score -= 50;

    // Response-Time-Abzug
    const responseTime = platformData.performance?.responseTime || 0;
    if (responseTime > 5000) score -= 20;
    else if (responseTime > 2000) score -= 10;

    // Error-Rate-Abzug
    const errorRate = platformData.performance?.errorRate || 0;
    score -= errorRate * 50; // 0.1 error rate = 5 points deduction

    // Uptime-Abzug
    const uptime = platformData.uptime || 100;
    score -= (100 - uptime) * 0.5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Bestimmt Health-Status basierend auf Score
   */
  determineHealthStatus(platformData, logs) {
    const score = this.calculateHealthScore(platformData, logs);

    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }

  /**
   * Generiert Empfehlungen basierend auf Performance
   */
  generateRecommendations(platformData, logs) {
    const recommendations = [];

    if (platformData.status !== 'online') {
      recommendations.push('Plattform ist offline - Überprüfen Sie API-Schlüssel und Netzwerkverbindung');
    }

    const responseTime = platformData.performance?.responseTime || 0;
    if (responseTime > 5000) {
      recommendations.push('Sehr hohe Response-Zeit - Optimieren Sie API-Calls oder wechseln Sie zu alternativen Endpunkten');
    } else if (responseTime > 2000) {
      recommendations.push('Erhöhte Response-Zeit - Überwachen Sie die Performance weiterhin');
    }

    const errorRate = platformData.performance?.errorRate || 0;
    if (errorRate > 0.1) {
      recommendations.push('Hohe Error-Rate - Überprüfen Sie API-Limits und Authentifizierung');
    }

    const uptime = platformData.uptime || 100;
    if (uptime < 95) {
      recommendations.push('Niedrige Uptime - Implementieren Sie bessere Fehlerbehandlung und Retry-Logic');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance ist gut - Fortfahren mit regelmäßigen Überprüfungen');
    }

    return recommendations;
  }

  /**
   * Sammelt alle Metriken
   */
  collectAllMetrics() {
    this.loadCurrentData();
    this.loadHistoricalData();

    const platforms = this.currentData.platforms || {};
    const allMetrics = {};

    Object.entries(platforms).forEach(([platformKey, platformData]) => {
      allMetrics[platformKey] = this.calculatePlatformMetrics(platformKey, platformData);
    });

    this.metrics = allMetrics;
    return allMetrics;
  }

  /**
   * Zeigt Metriken in der Konsole an
   */
  displayMetrics() {
    console.log('🚀 AI Platform Performance Metrics\n');
    console.log('═'.repeat(80));

    Object.values(this.metrics).forEach(platform => {
      console.log(`📊 ${platform.name} (${platform.platform})`);
      console.log(`   Status: ${platform.current.status === 'online' ? '🟢 Online' : '🔴 Offline'}`);
      console.log(`   Health: ${this.getHealthEmoji(platform.health.status)} ${platform.health.status} (${platform.health.score}/100)`);
      console.log(`   Aktuelle Response-Zeit: ${platform.current.responseTime}ms`);
      console.log(`   Aktuelle Uptime: ${platform.current.uptime}%`);
      console.log(`   Aktuelle Error-Rate: ${(platform.current.errorRate * 100).toFixed(1)}%`);

      console.log(`   Historische Daten:`);
      console.log(`     Gesamt Checks: ${platform.historical.totalChecks}`);
      console.log(`     Erfolgreiche Checks: ${platform.historical.successfulChecks}`);
      console.log(`     Fehlgeschlagene Checks: ${platform.historical.failedChecks}`);
      console.log(`     Ø Response-Zeit: ${platform.historical.averageResponseTime}ms`);
      console.log(`     Uptime: ${platform.historical.uptimePercentage}%`);
      console.log(`     Error-Rate Trend: ${platform.historical.errorRateTrend > 0 ? '📈' : '📉'} ${(platform.historical.errorRateTrend * 100).toFixed(1)}%`);
      console.log(`     Response-Time Trend: ${platform.historical.responseTimeTrend > 0 ? '📈' : '📉'} ${platform.historical.responseTimeTrend}ms`);

      console.log(`   Empfehlungen:`);
      platform.health.recommendations.forEach(rec => {
        console.log(`     • ${rec}`);
      });

      console.log('─'.repeat(60));
    });

    // Zusammenfassung
    const totalPlatforms = Object.keys(this.metrics).length;
    const onlinePlatforms = Object.values(this.metrics).filter(p => p.current.status === 'online').length;
    const avgHealthScore = Math.round(
      Object.values(this.metrics).reduce((sum, p) => sum + p.health.score, 0) / totalPlatforms
    );

    console.log(`📈 Zusammenfassung:`);
    console.log(`   Plattformen insgesamt: ${totalPlatforms}`);
    console.log(`   Online: ${onlinePlatforms}`);
    console.log(`   Durchschnittlicher Health-Score: ${avgHealthScore}/100`);
    console.log('═'.repeat(80));
  }

  /**
   * Gibt Health-Status Emoji zurück
   */
  getHealthEmoji(status) {
    switch (status) {
      case 'excellent': return '🟢';
      case 'good': return '🟡';
      case 'fair': return '🟠';
      case 'poor': return '🔴';
      case 'critical': return '💀';
      default: return '❓';
    }
  }

  /**
   * Speichert Metriken in Datei
   */
  saveMetrics() {
    const outputPath = path.join(__dirname, '..', 'data', 'seo-monitoring', 'ai-platform-performance-metrics.json');
    const output = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        totalPlatforms: Object.keys(this.metrics).length,
        onlinePlatforms: Object.values(this.metrics).filter(p => p.current.status === 'online').length,
        averageHealthScore: Math.round(
          Object.values(this.metrics).reduce((sum, p) => sum + p.health.score, 0) / Object.keys(this.metrics).length
        )
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Metriken gespeichert in: ${outputPath}`);
  }
}

// Hauptfunktion
async function main() {
  console.log('🔍 Sammle AI Platform Performance-Metriken...\n');

  const collector = new PerformanceMetricsCollector();
  collector.collectAllMetrics();
  collector.displayMetrics();
  collector.saveMetrics();

  console.log('\n✅ Performance-Metriken erfolgreich gesammelt und angezeigt!');
}

// Ausführung
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fehler bei der Ausführung:', error.message);
    process.exit(1);
  });
}

module.exports = PerformanceMetricsCollector;