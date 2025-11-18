import { gmbSystemTestSuite } from '../tests/gmbSystemTestSuite.ts';

async function runTests() {
  console.log('🚀 Starte GMB System Tests...\n');

  try {
    const results = await gmbSystemTestSuite.runAllTests();

    console.log('\n📊 Test-Zusammenfassung:');
    console.log(`Gesamt: ${results.total}`);
    console.log(`Bestanden: ${results.passed}`);
    console.log(`Fehlgeschlagen: ${results.failed}`);
    console.log(`Erfolgsrate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

    if (results.failed > 0) {
      console.log('\n❌ Fehlgeschlagene Tests:');
      results.results.filter(r => !r.passed).forEach(result => {
        console.log(`- ${result.testName}: ${result.error}`);
      });
    }

    const report = gmbSystemTestSuite.generateTestReport();
    console.log('\n📋 Detaillierter Report:');
    console.log(`Gesamtdauer: ${report.summary.totalDuration}ms`);
    console.log('Empfehlungen:');
    report.recommendations.forEach(rec => console.log(`- ${rec}`));

    console.log('\n✅ GMB System Tests abgeschlossen!');

    // Exit-Code basierend auf Testergebnissen
    process.exit(results.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Fehler beim Ausführen der Tests:', error);
    process.exit(1);
  }
}

runTests();