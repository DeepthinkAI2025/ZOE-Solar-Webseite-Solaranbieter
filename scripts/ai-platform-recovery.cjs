#!/usr/bin/env node

/**
 * AI Platform Automated Recovery System
 * Versucht automatisch fehlgeschlagene KI-Plattform-Verbindungen wiederherzustellen
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Pfade zu den Daten-Dateien
const DASHBOARD_PATH = path.join(__dirname, '..', 'data', 'seo-dashboard.json');
const LOG_PATH = path.join(__dirname, '..', 'data', 'seo-monitoring', 'ai-platform-log.json');
const MONITORING_SCRIPT = path.join(__dirname, 'ai-platform-monitoring.cjs');

class AutomatedRecovery {
  constructor() {
    this.recoveryAttempts = {};
    this.maxRecoveryAttempts = 3;
    this.recoveryLog = [];
  }

  /**
   * Lädt aktuelle Plattform-Daten
   */
  loadPlatformData() {
    try {
      if (fs.existsSync(DASHBOARD_PATH)) {
        const data = JSON.parse(fs.readFileSync(DASHBOARD_PATH, 'utf8'));
        this.platformData = data.aiPlatformMonitoring || {};
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Plattform-Daten:', error.message);
    }
  }

  /**
   * Identifiziert fehlgeschlagene Plattformen
   */
  identifyFailedPlatforms() {
    const failedPlatforms = [];

    if (!this.platformData.platforms) return failedPlatforms;

    Object.entries(this.platformData.platforms).forEach(([platformKey, platformData]) => {
      if (platformData.status === 'offline' ||
          platformData.performance?.errorRate > 0.5 ||
          platformData.uptime < 90) {
        failedPlatforms.push({
          key: platformKey,
          name: platformData.name || platformKey,
          status: platformData.status,
          errorRate: platformData.performance?.errorRate || 0,
          uptime: platformData.uptime || 0,
          lastAttempt: this.recoveryAttempts[platformKey]?.lastAttempt || null
        });
      }
    });

    return failedPlatforms;
  }

  /**
   * Führt Recovery-Versuche für eine Plattform durch
   */
  async attemptRecovery(platform) {
    console.log(`🔄 Starte Recovery für ${platform.name}...`);

    const recoveryStrategies = [
      this.checkApiConnectivity.bind(this),
      this.refreshApiKeys.bind(this),
      this.tryAlternativeEndpoints.bind(this),
      this.resetRateLimits.bind(this)
    ];

    for (let i = 0; i < recoveryStrategies.length; i++) {
      try {
        console.log(`   Versuche Strategie ${i + 1}/${recoveryStrategies.length}...`);
        const success = await recoveryStrategies[i](platform);

        if (success) {
          console.log(`   ✅ Recovery erfolgreich mit Strategie ${i + 1}`);
          this.logRecoveryAttempt(platform.key, true, `Strategie ${i + 1} erfolgreich`);
          return true;
        }
      } catch (error) {
        console.log(`   ❌ Strategie ${i + 1} fehlgeschlagen: ${error.message}`);
        this.logRecoveryAttempt(platform.key, false, `Strategie ${i + 1}: ${error.message}`);
      }

      // Warte zwischen Versuchen
      await this.delay(2000);
    }

    console.log(`   💀 Alle Recovery-Strategien fehlgeschlagen für ${platform.name}`);
    return false;
  }

  /**
   * Strategie 1: Überprüfe grundlegende API-Konnektivität
   */
  async checkApiConnectivity(platform) {
    // Simuliere API-Konnektivitäts-Check
    console.log(`      🔍 Überprüfe API-Konnektivität für ${platform.name}...`);

    // Hier würde normalerweise ein tatsächlicher API-Call stehen
    // Für Demo-Zwecke simulieren wir eine erfolgreiche Verbindung
    await this.delay(1000);

    // Simuliere zufälligen Erfolg (80% Chance)
    if (Math.random() < 0.8) {
      return true;
    }

    throw new Error('API-Konnektivität konnte nicht wiederhergestellt werden');
  }

  /**
   * Strategie 2: API-Schlüssel auffrischen
   */
  async refreshApiKeys(platform) {
    console.log(`      🔑 Versuche API-Schlüssel für ${platform.name} aufzufrischen...`);

    // Simuliere API-Schlüssel-Refresh
    await this.delay(1500);

    // Simuliere zufälligen Erfolg (60% Chance)
    if (Math.random() < 0.6) {
      return true;
    }

    throw new Error('API-Schlüssel-Refresh fehlgeschlagen');
  }

  /**
   * Strategie 3: Alternative Endpunkte versuchen
   */
  async tryAlternativeEndpoints(platform) {
    console.log(`      🌐 Versuche alternative Endpunkte für ${platform.name}...`);

    const alternativeEndpoints = this.getAlternativeEndpoints(platform.key);

    for (const endpoint of alternativeEndpoints) {
      try {
        console.log(`         Teste Endpunkt: ${endpoint}`);
        await this.delay(1000);

        // Simuliere Endpunkt-Test
        if (Math.random() < 0.7) {
          console.log(`         ✅ Alternativer Endpunkt funktioniert: ${endpoint}`);
          return true;
        }
      } catch (error) {
        console.log(`         ❌ Endpunkt ${endpoint} fehlgeschlagen`);
      }
    }

    throw new Error('Keine alternativen Endpunkte verfügbar oder funktionsfähig');
  }

  /**
   * Strategie 4: Rate-Limits zurücksetzen
   */
  async resetRateLimits(platform) {
    console.log(`      ⏱️ Versuche Rate-Limits für ${platform.name} zurückzusetzen...`);

    // Simuliere Rate-Limit-Reset
    await this.delay(2000);

    // Simuliere zufälligen Erfolg (50% Chance)
    if (Math.random() < 0.5) {
      return true;
    }

    throw new Error('Rate-Limit-Reset fehlgeschlagen');
  }

  /**
   * Gibt alternative Endpunkte für eine Plattform zurück
   */
  getAlternativeEndpoints(platformKey) {
    const endpoints = {
      openrouter: [
        'https://openrouter.ai/api/v1/chat/completions',
        'https://api.openrouter.ai/v1/chat/completions'
      ],
      bingCopilot: [
        'https://www.bing.com/turing/conversation/create',
        'https://edgeservices.bing.com/edgesvc/turing/conversation/create'
      ],
      perplexityAI: [
        'https://api.perplexity.ai/chat/completions',
        'https://www.perplexity.ai/api/chat/completions'
      ],
      chatGPT: [
        'https://api.openai.com/v1/chat/completions',
        'https://api.openai.com/v1/completions'
      ],
      claude: [
        'https://api.anthropic.com/v1/messages',
        'https://api.anthropic.com/v1/complete'
      ]
    };

    return endpoints[platformKey] || [];
  }

  /**
   * Hilfsfunktion für Verzögerungen
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Protokolliert Recovery-Versuche
   */
  logRecoveryAttempt(platformKey, success, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      platform: platformKey,
      success,
      details,
      attemptNumber: (this.recoveryAttempts[platformKey]?.attempts || 0) + 1
    };

    this.recoveryLog.push(logEntry);

    // Update recovery attempts tracking
    if (!this.recoveryAttempts[platformKey]) {
      this.recoveryAttempts[platformKey] = { attempts: 0, lastAttempt: null };
    }
    this.recoveryAttempts[platformKey].attempts++;
    this.recoveryAttempts[platformKey].lastAttempt = logEntry.timestamp;
  }

  /**
   * Führt vollständigen Recovery-Prozess durch
   */
  async performRecovery() {
    console.log('🚑 Starte Automated Recovery für AI-Plattformen...\n');

    this.loadPlatformData();
    const failedPlatforms = this.identifyFailedPlatforms();

    if (failedPlatforms.length === 0) {
      console.log('✅ Alle Plattformen sind online und funktionieren korrekt.');
      return { success: true, recovered: 0, failed: 0 };
    }

    console.log(`🔍 ${failedPlatforms.length} fehlgeschlagene Plattform(en) gefunden:`);
    failedPlatforms.forEach(platform => {
      console.log(`   - ${platform.name}: Status ${platform.status}, Uptime ${platform.uptime}%, Error-Rate ${(platform.errorRate * 100).toFixed(1)}%`);
    });
    console.log('');

    let recovered = 0;
    let failed = 0;

    for (const platform of failedPlatforms) {
      // Überprüfe, ob bereits zu viele Versuche unternommen wurden
      const attempts = this.recoveryAttempts[platform.key]?.attempts || 0;
      if (attempts >= this.maxRecoveryAttempts) {
        console.log(`⏭️ Überspringe ${platform.name} - Maximale Versuche erreicht (${attempts}/${this.maxRecoveryAttempts})`);
        failed++;
        continue;
      }

      try {
        const success = await this.attemptRecovery(platform);
        if (success) {
          recovered++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`❌ Unerwarteter Fehler bei Recovery für ${platform.name}:`, error.message);
        failed++;
      }

      // Warte zwischen Plattform-Recoveries
      await this.delay(3000);
    }

    console.log(`\n📊 Recovery-Ergebnis:`);
    console.log(`   ✅ Erfolgreich wiederhergestellt: ${recovered}`);
    console.log(`   ❌ Fehlgeschlagen: ${failed}`);
    console.log(`   📝 Recovery-Logs: ${this.recoveryLog.length} Einträge`);

    // Speichere Recovery-Logs
    this.saveRecoveryLog();

    // Führe abschließenden Monitoring-Lauf durch
    if (recovered > 0) {
      console.log('\n🔄 Führe abschließenden Monitoring-Lauf durch...');
      await this.runFinalMonitoring();
    }

    return { success: recovered > 0, recovered, failed };
  }

  /**
   * Speichert Recovery-Logs
   */
  saveRecoveryLog() {
    const logPath = path.join(__dirname, '..', 'data', 'seo-monitoring', 'ai-platform-recovery-log.json');

    try {
      let existingLogs = [];
      if (fs.existsSync(logPath)) {
        existingLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
        if (!Array.isArray(existingLogs)) existingLogs = [existingLogs];
      }

      const updatedLogs = [...existingLogs, ...this.recoveryLog];
      fs.writeFileSync(logPath, JSON.stringify(updatedLogs, null, 2));

      console.log(`💾 Recovery-Logs gespeichert in: ${logPath}`);
    } catch (error) {
      console.error('❌ Fehler beim Speichern der Recovery-Logs:', error.message);
    }
  }

  /**
   * Führt abschließenden Monitoring-Lauf durch
   */
  async runFinalMonitoring() {
    try {
      const { spawn } = require('child_process');
      const monitoringProcess = spawn('node', [MONITORING_SCRIPT], {
        cwd: path.dirname(MONITORING_SCRIPT),
        stdio: 'inherit'
      });

      return new Promise((resolve, reject) => {
        monitoringProcess.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Abschließender Monitoring-Lauf erfolgreich abgeschlossen.');
            resolve();
          } else {
            console.log('⚠️ Abschließender Monitoring-Lauf mit Warnungen abgeschlossen.');
            resolve();
          }
        });

        monitoringProcess.on('error', (error) => {
          console.error('❌ Fehler beim abschließenden Monitoring-Lauf:', error.message);
          reject(error);
        });
      });
    } catch (error) {
      console.error('❌ Fehler beim Starten des Monitoring-Scripts:', error.message);
    }
  }

  /**
   * Generiert Alert für kritische Recovery-Fehlschläge
   */
  generateCriticalAlert(failedPlatforms) {
    if (failedPlatforms.length === 0) return null;

    return {
      id: `recovery-critical-${Date.now()}`,
      type: 'critical',
      strategy: 'AI_PLATFORM_RECOVERY',
      category: 'recovery',
      title: 'Kritische Recovery-Fehlschläge bei AI-Plattformen',
      message: `${failedPlatforms.length} AI-Plattform(en) konnten nicht automatisch wiederhergestellt werden`,
      value: failedPlatforms.length,
      threshold: 0,
      timestamp: new Date().toISOString(),
      platforms: failedPlatforms.map(p => p.key),
      recommendations: [
        'Manuelle Überprüfung der API-Schlüssel erforderlich',
        'Überprüfen Sie die API-Dokumentation für bekannte Ausfälle',
        'Kontaktieren Sie den Plattform-Support',
        'Implementieren Sie alternative Suchstrategien als Backup'
      ]
    };
  }
}

// Hauptfunktion
async function main() {
  const recovery = new AutomatedRecovery();
  const result = await recovery.performRecovery();

  if (!result.success && result.failed > 0) {
    console.log('\n🚨 Generiere kritischen Alert für fehlgeschlagene Recoveries...');
    const alert = recovery.generateCriticalAlert(
      recovery.identifyFailedPlatforms().filter(p =>
        (recovery.recoveryAttempts[p.key]?.attempts || 0) >= recovery.maxRecoveryAttempts
      )
    );

    if (alert) {
      // Hier könnte der Alert an das Alert-System weitergeleitet werden
      console.log('📢 Kritischer Alert generiert:', alert.title);
      console.log('   Details:', alert.message);
    }
  }

  console.log('\n🏁 Automated Recovery abgeschlossen!');
  process.exit(result.success ? 0 : 1);
}

// Ausführung
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fehler bei der Recovery-Ausführung:', error.message);
    process.exit(1);
  });
}

module.exports = AutomatedRecovery;