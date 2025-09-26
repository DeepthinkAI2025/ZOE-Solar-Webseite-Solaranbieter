#!/usr/bin/env node

/**
 * Vollständiger SEO-Workflow für ZOE Solar
 * Führt alle SEO-Tools in der optimalen Reihenfolge aus
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRIPTS = [
  {
    name: 'Keyword Research',
    command: 'npm run keyword-research',
    description: 'Erweitere Keyword-Datenbank mit neuen Agri-PV Keywords'
  },
  {
    name: 'Enhanced SEO Monitoring',
    command: 'npm run enhanced-seo-monitor',
    description: 'Analysiere SERP-Positionen und SEO-Metriken'
  },
  {
    name: 'Content Optimization',
    command: 'npm run content-optimization',
    description: 'Generiere Content-Ideen basierend auf Keywords'
  },
  {
    name: 'SEO Alerts',
    command: 'npm run seo-alerts',
    description: 'Überprüfe auf kritische SEO-Alerts'
  },
  {
    name: 'GMB Integration',
    command: 'npm run gmb-integration',
    description: 'Aktualisiere Google My Business lokale Daten'
  }
];

/**
 * Führt einen Script aus und misst die Ausführungszeit
 */
function runScript(script) {
  console.log(`\n🔄 Starte: ${script.name}`);
  console.log(`   ${script.description}`);

  const startTime = Date.now();

  try {
    const output = execSync(script.command, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ ${script.name} erfolgreich abgeschlossen (${duration}s)`);

    return { success: true, output, duration };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`❌ ${script.name} fehlgeschlagen (${duration}s)`);
    console.log(`   Fehler: ${error.message}`);

    return { success: false, error: error.message, duration };
  }
}

/**
 * Generiert eine Zusammenfassung des Workflows
 */
function generateSummary(results) {
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalTime = results.reduce((sum, r) => sum + parseFloat(r.duration), 0).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('📊 SEO-Workflow Zusammenfassung');
  console.log('='.repeat(60));
  console.log(`✅ Erfolgreiche Scripts: ${successful}`);
  console.log(`❌ Fehlgeschlagene Scripts: ${failed}`);
  console.log(`⏱️  Gesamtlaufzeit: ${totalTime}s`);
  console.log('='.repeat(60));

  // Zeige detaillierte Ergebnisse
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${SCRIPTS[index].name}: ${result.duration}s`);
  });

  // Lade aktuelle SEO-Daten für finale Zusammenfassung
  try {
    const seoReport = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'seo-report.json'), 'utf8'));
    const keywordAnalysis = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'keyword-analysis.json'), 'utf8'));
    const contentPlan = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'content-plan.json'), 'utf8'));

    console.log('\n🎯 Aktuelle SEO-Kennzahlen:');
    console.log(`   • Keywords analysiert: ${keywordAnalysis.totalKeywords}`);
    console.log(`   • Durchschnittliche Position: ${seoReport.metrics.avgPosition}`);
    console.log(`   • Top 10 Keywords: ${seoReport.metrics.top10Count} (${seoReport.metrics.top10Percentage}%)`);
    console.log(`   • Geschätzter Traffic: ${seoReport.metrics.estimatedTraffic.toLocaleString()}/Monat`);
    console.log(`   • Content-Ideen: ${contentPlan.stats.totalIdeas}`);
    console.log(`   • SEO-Alerts: ${seoReport.alerts.length}`);

  } catch (error) {
    console.log('\n⚠️  Konnte finale SEO-Kennzahlen nicht laden');
  }

  console.log('\n🎉 SEO-Workflow abgeschlossen!');
  console.log('📅 Nächste Ausführung: Morgen automatisch via GitHub Actions');

  return { successful, failed, totalTime };
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🚀 Starte vollständigen SEO-Workflow für ZOE Solar\n');
  console.log('Ziel: #1 globale Rankings für Agri-PV Keywords erreichen\n');

  const results = [];

  // Führe alle Scripts in der definierten Reihenfolge aus
  for (const script of SCRIPTS) {
    const result = runScript(script);
    results.push(result);

    // Bei kritischen Fehlern: Fortfahren, aber protokollieren
    if (!result.success && script.name === 'Keyword Research') {
      console.log('⚠️  Keyword Research fehlgeschlagen - verwende bestehende Daten');
    }
  }

  // Generiere Zusammenfassung
  const summary = generateSummary(results);

  // Speichere Workflow-Ergebnisse
  const workflowLog = {
    timestamp: new Date().toISOString(),
    summary,
    results: results.map((r, i) => ({
      script: SCRIPTS[i].name,
      ...r
    }))
  };

  const logFile = path.join(__dirname, '..', 'data', 'seo-workflow-log.json');
  fs.writeFileSync(logFile, JSON.stringify(workflowLog, null, 2));

  // Exit-Code basierend auf Erfolg
  process.exit(summary.failed > 0 ? 1 : 0);
}

// Führe den Workflow aus
if (require.main === module) {
  main();
}

module.exports = {
  runScript,
  generateSummary,
  SCRIPTS
};