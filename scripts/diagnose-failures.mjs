import fs from 'fs';
import path from 'path';
import { fetchManufacturerData } from '../server/services/firecrawlClient.js';

const LIVE = path.join(process.cwd(), 'server', 'storage', 'products.live.json');
const OUT = path.join(process.cwd(), 'server', 'storage', 'sync-diagnostic.json');

function now() { return new Date().toISOString(); }

async function tryFetch(url) {
  try {
    // normalize protocol-relative
    let u = url;
    if (!u) return { url, ok: false, reason: 'empty' };
    if (u.startsWith('//')) u = 'https:' + u;
    const res = await fetch(u, { method: 'GET', headers: { 'User-Agent': 'ZOE-Diag/1.0' }, redirect: 'follow' , timeout: 15000 });
    const ct = res.headers.get('content-type') || null;
    return { url: u, ok: res.ok, status: res.status, contentType: ct };
  } catch (err) {
    return { url, ok: false, reason: err.message || String(err) };
  }
}

async function run() {
  if (!fs.existsSync(LIVE)) {
    console.error('Live products file not found:', LIVE);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(LIVE, 'utf8'));
  const manufacturers = raw.manufacturers || [];

  // target manufacturers with missing logos or only external logos
  const targets = manufacturers.filter(m => !m.logoUrl || (typeof m.logoUrl === 'string' && !m.logoUrl.startsWith('/assets/logos/')));

  const report = { generatedAt: now(), total: manufacturers.length, targets: [], provider: 'firecrawl-mcp' };

  for (const m of targets) {
    process.stdout.write(`Diagnosing ${m.slug}... `);
    const entry = { slug: m.slug, name: m.name, website: m.website, existingLogo: m.logoUrl || null, firecrawl: null, tested: [] };
    try {
      const suggestion = await fetchManufacturerData(m);
      entry.firecrawl = suggestion;
      if (suggestion && Array.isArray(suggestion.logoCandidates)) {
        for (const cand of suggestion.logoCandidates) {
          const res = await tryFetch(cand);
          entry.tested.push(res);
        }
      }
    } catch (err) {
      entry.error = err.message || String(err);
    }
    report.targets.push(entry);
    console.log('done');
  }

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), 'utf8');
  console.log('Wrote diagnostic report to', OUT);
}

run().catch(err => { console.error('Diag failed:', err); process.exit(1); });
