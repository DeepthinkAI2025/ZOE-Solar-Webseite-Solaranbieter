import { runProductSync } from '../server/services/productSync.js';

(async () => {
  try {
    const res = await runProductSync();
    const changeSummary = res.changeSummary ?? {};
    console.log('Sync result:', res.generatedAt, 'manufacturers:', res.manufacturers?.length ?? 0);
    if (changeSummary.manufacturersWithChanges > 0) {
      console.log('  Hersteller mit Änderungen:', changeSummary.manufacturersWithChanges);
      console.log('  Neue Produkte:', changeSummary.manufacturerChanges
        ?.reduce((sum, change) => sum + (Array.isArray(change.addedProducts) ? change.addedProducts.length : 0), 0) ?? 0);
    } else {
      console.log('  Keine Änderungen gegenüber letztem Stand erkannt.');
    }
  } catch (err) {
    console.error('Sync failed:', err.message || err);
    process.exit(1);
  }
})();
