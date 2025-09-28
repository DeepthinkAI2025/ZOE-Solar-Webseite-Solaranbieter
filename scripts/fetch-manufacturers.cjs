(async () => {
  try {
    const { runProductSync } = await import('../server/services/productSync.js');
    const { resolveManufacturerSeed } = await import('../server/config/manufacturers.js');

    const manufacturers = resolveManufacturerSeed();
    const result = await runProductSync({ manufacturers });

    const totalProducts = Array.isArray(result.manufacturers)
      ? result.manufacturers.reduce((sum, m) => sum + (Array.isArray(m.products) ? m.products.length : 0), 0)
      : 0;

    console.log('\nFirecrawl MCP Sync abgeschlossen:');
    console.log('  Hersteller:', result.manufacturers?.length ?? 0);
    console.log('  Produkte:', totalProducts);
    console.log('  Letztes Update:', result.generatedAt);

    if (result?.syncMeta?.firecrawlUnavailable) {
      console.error('\n⚠️  Firecrawl ist nicht erreichbar. Bitte Endpoint prüfen (`FIRECRAWL_MCP_ENDPOINT`) und Server starten.');
      if (result?.syncMeta?.firecrawlError) {
        console.error('  Fehler:', result.syncMeta.firecrawlError);
      }
      process.exitCode = 2;
    }
  } catch (err) {
    console.error('Firecrawl Sync Script fehlgeschlagen:', err?.message ?? err);
    process.exit(1);
  }
})();
