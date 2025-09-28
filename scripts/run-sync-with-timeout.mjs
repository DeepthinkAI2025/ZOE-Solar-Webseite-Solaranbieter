import { runProductSync } from '../server/services/productSync.js';

const timeout = Number(process.env.SYNC_TIMEOUT_MS || 60000);

(async () => {
  const timer = setTimeout(() => {
    console.error('[sync-timeout] timeout reached, exiting');
    process.exit(2);
  }, timeout);
  try {
    const res = await runProductSync({});
    const changeSummary = res.changeSummary ?? {};
    console.log('Sync result:', res.generatedAt, 'manufacturers:', res.manufacturers?.length ?? 0);
    if (changeSummary.manufacturersWithChanges > 0) {
      console.log('  Hersteller mit Änderungen:', changeSummary.manufacturersWithChanges);
      console.log('  Neue Produkte:', changeSummary.manufacturerChanges
        ?.reduce((sum, change) => sum + (Array.isArray(change.addedProducts) ? change.addedProducts.length : 0), 0) ?? 0);
    } else {
      console.log('  Keine Änderungen gegenüber letztem Stand erkannt.');
    }
    if (res?.syncMeta?.firecrawlUnavailable) {
      console.error('\n⚠️  Firecrawl ist nicht erreichbar. Bitte Endpoint prüfen (`FIRECRAWL_MCP_ENDPOINT`) und Server starten.');
      if (res?.syncMeta?.firecrawlError) {
        console.error('  Fehler:', res.syncMeta.firecrawlError);
      }
      process.exitCode = 2;
    }
  } catch (err) {
    console.error('Sync failed:', err.message || err);
    process.exit(1);
  } finally {
    clearTimeout(timer);
  }
})();
