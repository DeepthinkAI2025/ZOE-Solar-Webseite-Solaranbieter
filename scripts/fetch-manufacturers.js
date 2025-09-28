import 'dotenv/config';
import { runProductSync } from '../server/services/productSync.js';
import { resolveManufacturerSeed } from '../server/config/manufacturers.js';

async function main() {
  const manufacturers = resolveManufacturerSeed();
  const result = await runProductSync({ manufacturers });

  const totalProducts = Array.isArray(result.manufacturers)
    ? result.manufacturers.reduce((sum, m) => sum + (Array.isArray(m.products) ? m.products.length : 0), 0)
    : 0;

  console.log('\nTavily Sync abgeschlossen:');
  console.log('  Hersteller:', result.manufacturers?.length ?? 0);
  console.log('  Produkte:', totalProducts);
  console.log('  Letztes Update:', result.generatedAt);
  if (Array.isArray(result.providers) && result.providers.length > 0) {
    console.log('  Genutzte Provider:', result.providers.join(', '));
  }
  if (result?.syncMeta?.manufacturerLimit) {
    const reason = result.syncMeta.manufacturerLimitReason ? ` (${result.syncMeta.manufacturerLimitReason})` : '';
    console.log(`  Hersteller-Limit: ${result.syncMeta.manufacturerLimit}${reason}`);
  }

  if (result?.syncMeta?.tavilyEnabled && !(result.providers || []).includes('tavily')) {
    console.warn('\nℹ️  Tavily ist aktiviert, konnte aber keine Daten liefern. Details siehe Logs.');
  }

  if (result?.syncMeta?.geminiEnabled && !result?.providers?.includes('gemini')) {
    console.warn('ℹ️  Gemini-Fallback ist aktiviert, aber hat keine Daten geliefert. Details siehe Logs.');
  }
}

main().catch((err) => {
  console.error('Firecrawl Sync Script fehlgeschlagen:', err?.message ?? err);
  process.exit(1);
});
