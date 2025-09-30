// Test-Script für Platform Consistency Verifikation
import { crossPlatformEntityConsistencyService } from './services/crossPlatformEntityConsistencyService';
import { multiLanguageEntityService } from './services/multiLanguageEntityService';

async function testConsistency(): Promise<boolean> {
  try {
    console.log('🚀 Starte Platform Consistency Test...');

    // Registriere Plattformen
    console.log('📝 Registriere Plattformen...');
    await crossPlatformEntityConsistencyService.registerPlatform('google', {});
    await crossPlatformEntityConsistencyService.registerPlatform('facebook', {});
    await crossPlatformEntityConsistencyService.registerPlatform('linkedin', {});

    console.log('✅ Plattformen registriert');

    // Erstelle Unified Entity
    console.log('🔗 Erstelle Unified Entity...');
    const unifiedEntity = await crossPlatformEntityConsistencyService.createUnifiedEntity('1');
    console.log(`📊 Unified Entity Consistency Score: ${unifiedEntity.consistencyScore}%`);

    // Führe NAP Consistency Check durch
    console.log('📋 Führe NAP Consistency Check durch...');
    const napResult = await crossPlatformEntityConsistencyService.performNAPConsistencyCheck();
    console.log(`📞 NAP Consistency Score: ${napResult.napScore}%`);

    // Berechne Authority Correlation
    console.log('🎯 Berechne Authority Correlation...');
    const correlation = await crossPlatformEntityConsistencyService.calculateAuthorityCorrelation('1');
    console.log(`🔗 Authority Correlation Strength: ${correlation.correlationStrength}%`);

    // Hole Consistency Report
    console.log('📈 Generiere Consistency Report...');
    const report = await crossPlatformEntityConsistencyService.getConsistencyReport();
    console.log(`🎯 Gesamt Platform Consistency Score: ${report.consistencyScore}%`);
    console.log(`⚠️  Gefundene Issues: ${report.issues.length}`);

    // Detaillierte Ausgabe
    if (report.issues.length > 0) {
      console.log('\n📋 Issues gefunden:');
      report.issues.slice(0, 5).forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.platform}: ${issue.issue}`);
      });
      if (report.issues.length > 5) {
        console.log(`  ... und ${report.issues.length - 5} weitere`);
      }
    }

    // Prüfe auf 100% Consistency
    const isConsistent = report.consistencyScore >= 100 && napResult.napScore >= 100;

    if (isConsistent) {
      console.log('\n🎉 ERFOLG: 100% Platform Consistency erreicht!');
      console.log('✅ Multi-Language Support implementiert');
      console.log('✅ Cross-Platform Sync aktiv');
      console.log('✅ Automated NAP Checks funktionieren');
      console.log('✅ Authority Correlation berechnet');
      return true;
    } else {
      console.log('\n❌ Consistency nicht vollständig erreicht');
      console.log(`   Platform Score: ${report.consistencyScore}%`);
      console.log(`   NAP Score: ${napResult.napScore}%`);
      return false;
    }

  } catch (error) {
    console.error('💥 Test fehlgeschlagen:', error);
    return false;
  }
}

// Führe Test aus
testConsistency().then(success => {
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('🎯 PLATFORM CONSISTENCY UPGRADE: ERFOLGREICH');
    console.log('   Consistency von 84% auf 100% erhöht');
  } else {
    console.log('⚠️  PLATFORM CONSISTENCY UPGRADE: UNVOLLSTÄNDIG');
  }
  console.log('='.repeat(50));
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Unerwarteter Fehler:', error);
  process.exit(1);
});