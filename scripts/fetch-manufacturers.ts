import { runProductSync } from '../server/services/productSync.js';
import { resolveManufacturerSeed } from '../server/config/manufacturers.js';

async function run() {
  const manufacturers = resolveManufacturerSeed();
  const result = await runProductSync({ manufacturers });

  const totalProducts = Array.isArray(result.manufacturers)
    ? result.manufacturers.reduce((sum, m) => sum + (Array.isArray(m.products) ? m.products.length : 0), 0)
    : 0;

  console.log('\nSync abgeschlossen:');
  console.log('  Hersteller:', result.manufacturers?.length ?? 0);
  console.log('  Produkte:', totalProducts);
  console.log('  Letztes Update:', result.generatedAt);
}

run().catch((err) => {
  console.error('Sync Script fehlgeschlagen:', err?.message ?? err);
  process.exit(1);
});