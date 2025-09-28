import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { tavilySearch, tavilyExtract } from '../server/services/tavilyClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfRegex = /\.pdf(?:$|[?#])/i;

interface TavilySearchResult {
  url?: string;
  title?: string;
  content?: string;
  score?: number;
}

interface TavilyExtractResult {
  url?: string;
  raw_content?: string;
}

interface DocumentCandidate {
  url: string;
  title: string | null;
  snippet: string | null;
  score: number;
  bucket: BucketType;
}

type BucketType = 'datasheets' | 'installation' | 'other';

type ProductDocumentBucket = Record<BucketType, DocumentCandidate[]>;

interface ManufacturerRecord {
  slug: string;
  name: string;
  website?: string | null;
  products?: ProductRecord[];
}

interface ProductRecord {
  name?: string;
  datasheetUrls?: string[];
  installationManualUrls?: string[];
  additionalDocumentUrls?: string[];
  documents?: Array<{ type?: string; url?: string; title?: string; description?: string }>;
}

interface HarvestOptions {
  force?: boolean;
  minimal?: boolean;
  limit?: number | null;
  apply?: boolean;
  targetSlugs?: Set<string> | null;
}

interface HarvestSummary {
  manufacturer: string;
  product: string;
  candidates: DocumentCandidate[];
}

function extractHost(url?: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch (err) {
    return null;
  }
}

function getRegistrableDomain(host?: string | null): string | null {
  if (!host) return null;
  const parts = host.split('.').filter(Boolean);
  if (parts.length <= 2) {
    return host;
  }
  const last = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];
  if (last.length === 2 && secondLast.length <= 3 && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

function isAllowedHost(candidateHost: string | null, manufacturerWebsite?: string | null): boolean {
  if (!candidateHost) return false;
  if (!manufacturerWebsite) return true;
  const manufacturerHost = extractHost(manufacturerWebsite);
  if (!manufacturerHost) return true;
  candidateHost = candidateHost.toLowerCase();
  if (candidateHost === manufacturerHost) return true;
  if (candidateHost.endsWith(`.${manufacturerHost}`)) return true;
  const manufacturerRoot = getRegistrableDomain(manufacturerHost);
  if (manufacturerRoot) {
    if (candidateHost === manufacturerRoot) return true;
    if (candidateHost.endsWith(`.${manufacturerRoot}`)) return true;
  }
  return false;
}

function dedupeUrls(values: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

function buildQueries(manufacturer: ManufacturerRecord, product: ProductRecord, minimal: boolean): Array<{ bucket: BucketType; prompt: string }> {
  const productName = product.name ?? '';
  const manufacturerName = manufacturer.name ?? manufacturer.slug;
  const baseQueries: Array<{ bucket: BucketType; prompt: string }> = [
    { bucket: 'datasheets', prompt: `${manufacturerName} ${productName} datasheet filetype:pdf` },
    { bucket: 'installation', prompt: `${manufacturerName} ${productName} installation manual filetype:pdf` }
  ];

  if (minimal) {
    return baseQueries;
  }

  return [
    ...baseQueries,
    { bucket: 'datasheets', prompt: `${manufacturerName} ${productName} technical data sheet pdf` },
    { bucket: 'installation', prompt: `${manufacturerName} ${productName} mounting instructions pdf` },
    { bucket: 'other', prompt: `${manufacturerName} ${productName} warranty pdf` },
    { bucket: 'other', prompt: `${manufacturerName} ${productName} brochure pdf` }
  ];
}

async function harvestForProduct(
  manufacturer: ManufacturerRecord,
  product: ProductRecord,
  options: HarvestOptions
): Promise<ProductDocumentBucket> {
  const perBucket: ProductDocumentBucket = {
    datasheets: [],
    installation: [],
    other: []
  };

  const queries = buildQueries(manufacturer, product, Boolean(options.minimal));
  const combinedCandidates: DocumentCandidate[] = [];

  for (const { bucket, prompt } of queries) {
    const searchResponse = await tavilySearch(prompt, {
      max_results: 8,
      search_depth: options.minimal ? 'basic' : 'advanced',
      include_answer: false,
      include_images: false,
      include_html: false
    });

    const hits: TavilySearchResult[] = Array.isArray(searchResponse?.results) ? searchResponse.results : [];
    for (const hit of hits) {
      const url = hit?.url?.trim();
      if (!url || !pdfRegex.test(url)) continue;
      const candidateHost = extractHost(url);
      if (!isAllowedHost(candidateHost, manufacturer.website)) continue;

      const candidate: DocumentCandidate = {
        url,
        title: hit?.title?.trim() || null,
        snippet: hit?.content?.trim() || null,
        score: typeof hit?.score === 'number' ? hit.score : 0,
        bucket
      };
      combinedCandidates.push(candidate);
    }
  }

  const uniqueUrls = dedupeUrls(combinedCandidates.map((item) => item.url));
  const MAX_EXTRACT_URLS = 20;
  const urlsForExtraction = uniqueUrls.slice(0, MAX_EXTRACT_URLS);
  if (uniqueUrls.length > MAX_EXTRACT_URLS) {
    console.log(`    ⚠️ ${uniqueUrls.length - MAX_EXTRACT_URLS} weitere URLs wegen Tavily-Limit ignoriert.`);
  }

  const extractResponse = urlsForExtraction.length
    ? await tavilyExtract(urlsForExtraction, { extractDepth: 'basic', includeImages: false })
    : { results: [] };

  const extractMap = new Map<string, string>();
  const extractResults: TavilyExtractResult[] = Array.isArray(extractResponse?.results) ? extractResponse.results : [];
  for (const item of extractResults) {
    if (item?.url) {
      const snippet = item.raw_content ? String(item.raw_content).slice(0, 800) : null;
      if (snippet) {
        extractMap.set(item.url, snippet);
      }
    }
  }

  const bestByUrl = new Map<string, DocumentCandidate>();
  for (const candidate of combinedCandidates) {
    const existing = bestByUrl.get(candidate.url);
    if (!existing || candidate.score > existing.score) {
      const enhancedCandidate: DocumentCandidate = {
        ...candidate,
        snippet: extractMap.get(candidate.url) || candidate.snippet || null
      };
      bestByUrl.set(candidate.url, enhancedCandidate);
    }
  }

  for (const candidate of bestByUrl.values()) {
    perBucket[candidate.bucket].push(candidate);
  }

  for (const bucket of Object.keys(perBucket) as BucketType[]) {
    perBucket[bucket].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  return perBucket;
}

function needsHarvest(product: ProductRecord, options: HarvestOptions): boolean {
  if (options.force) return true;
  const hasDatasheet = Array.isArray(product.datasheetUrls) && product.datasheetUrls.length > 0;
  const hasInstallation = Array.isArray(product.installationManualUrls) && product.installationManualUrls.length > 0;
  const hasAdditionalDocs = Array.isArray(product.additionalDocumentUrls) && product.additionalDocumentUrls.length > 0;
  return !(hasDatasheet && hasInstallation && hasAdditionalDocs);
}

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => typeof entry === 'string' && entry.trim().length > 0) as string[];
}

function mergeDocumentUrls(existing: string[] | undefined, candidates: DocumentCandidate[]): string[] {
  const merged = dedupeUrls([...(existing || []), ...candidates.map((item) => item.url)]);
  return merged;
}

function mergeDocumentRecords(
  existing: ProductRecord['documents'],
  candidates: DocumentCandidate[],
  type: 'datasheet' | 'installation_manual' | 'other'
): Required<ProductRecord>['documents'] {
  const docs = Array.isArray(existing) ? [...existing] : [];
  const existingUrls = new Set(docs.map((doc) => (doc?.url || '').trim()).filter(Boolean));
  for (const candidate of candidates) {
    if (existingUrls.has(candidate.url)) continue;
    docs.push({
      type,
      url: candidate.url,
      title: candidate.title || undefined,
      description: candidate.snippet || undefined
    });
    existingUrls.add(candidate.url);
  }
  return docs;
}

async function loadProductsLive(): Promise<any> {
  const filePath = path.resolve(__dirname, '../server/storage/products.live.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function saveProductsLive(data: any): Promise<void> {
  const filePath = path.resolve(__dirname, '../server/storage/products.live.json');
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(filePath, content, 'utf-8');
}

function parseCliOptions(): HarvestOptions {
  const args = process.argv.slice(2);
  const options: HarvestOptions = {
    force: false,
    minimal: process.env.TAVILY_MINIMAL === '1',
    limit: null,
    apply: false,
    targetSlugs: null
  };

  const slugSet = new Set<string>();

  for (const arg of args) {
    if (arg === '--apply') {
      options.apply = true;
      continue;
    }
    if (arg === '--force') {
      options.force = true;
      continue;
    }
    if (arg === '--minimal') {
      options.minimal = true;
      continue;
    }
    if (arg.startsWith('--limit=')) {
      const value = arg.slice('--limit='.length).trim();
      if (value) {
        const parsed = Number(value);
        if (!Number.isNaN(parsed) && parsed > 0) {
          options.limit = parsed;
        }
      }
      continue;
    }
    if (arg.startsWith('--manufacturer=')) {
      const value = arg.slice('--manufacturer='.length).trim();
      if (value) {
        value
          .split(',')
          .map((slug) => slug.trim())
          .filter(Boolean)
          .forEach((slug) => slugSet.add(slug));
      }
      continue;
    }
  }

  if (slugSet.size > 0) {
    options.targetSlugs = slugSet;
  }

  return options;
}

function shouldProcessManufacturer(manufacturer: ManufacturerRecord, options: HarvestOptions): boolean {
  if (!manufacturer?.slug) return false;
  if (options.targetSlugs && !options.targetSlugs.has(manufacturer.slug)) {
    return false;
  }
  return true;
}

async function ensureTmpDir(): Promise<string> {
  const dir = path.resolve(__dirname, '../tmp/doc-harvest');
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function writeSummary(results: HarvestSummary[]): Promise<void> {
  const dir = await ensureTmpDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(dir, `harvest-${timestamp}.json`);
  await fs.writeFile(filePath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Dokumenten-Kandidaten gespeichert unter ${path.relative(process.cwd(), filePath)}`);
}

async function main(): Promise<void> {
  const options = parseCliOptions();
  const data = await loadProductsLive();
  const manufacturers: ManufacturerRecord[] = Array.isArray(data?.manufacturers) ? data.manufacturers : [];

  if (manufacturers.length === 0) {
    console.log('Keine Hersteller in products.live.json gefunden.');
    return;
  }

  const summaries: HarvestSummary[] = [];
  let processedManufacturers = 0;

  for (const manufacturer of manufacturers) {
    if (!shouldProcessManufacturer(manufacturer, options)) {
      continue;
    }
    const products = Array.isArray(manufacturer.products) ? manufacturer.products : [];
    if (products.length === 0) continue;

    console.log(`\n🔍 Hersteller: ${manufacturer.name || manufacturer.slug} (${manufacturer.slug})`);
    let processedProducts = 0;

    for (const product of products) {
      if (!product?.name) continue;
      if (!needsHarvest(product, options)) {
        console.log(`  • ${product.name}: bereits vollständig, übersprungen.`);
        continue;
      }

      console.log(`  • ${product.name}: starte Dokumentensuche...`);
      try {
        const buckets = await harvestForProduct(manufacturer, product, options);
        const mergedCandidates = [...buckets.datasheets, ...buckets.installation, ...buckets.other];
        summaries.push({
          manufacturer: manufacturer.slug,
          product: product.name,
          candidates: mergedCandidates
        });

        if (options.apply) {
          if (buckets.datasheets.length > 0) {
            product.datasheetUrls = mergeDocumentUrls(product.datasheetUrls, buckets.datasheets);
            product.documents = mergeDocumentRecords(product.documents, buckets.datasheets, 'datasheet');
          }
          if (buckets.installation.length > 0) {
            product.installationManualUrls = mergeDocumentUrls(product.installationManualUrls, buckets.installation);
            product.documents = mergeDocumentRecords(product.documents, buckets.installation, 'installation_manual');
          }
          if (buckets.other.length > 0) {
            product.additionalDocumentUrls = mergeDocumentUrls(product.additionalDocumentUrls, buckets.other);
            product.documents = mergeDocumentRecords(product.documents, buckets.other, 'other');
          }
        }

        const displayLineParts: string[] = [];
        if (buckets.datasheets.length) displayLineParts.push(`Datasheets: ${buckets.datasheets.length}`);
        if (buckets.installation.length) displayLineParts.push(`Manuals: ${buckets.installation.length}`);
        if (buckets.other.length) displayLineParts.push(`Other: ${buckets.other.length}`);
        if (displayLineParts.length === 0) {
          console.log('    → Keine neuen Kandidaten gefunden.');
        } else {
          console.log(`    → Gefundene Kandidaten (${displayLineParts.join(', ')})`);
        }
      } catch (err) {
        console.error(`    ✖ Fehler bei ${product.name}:`, err instanceof Error ? err.message : err);
      }

      processedProducts += 1;
      if (options.limit && processedProducts >= options.limit) {
        console.log(`    Limit von ${options.limit} Produkten erreicht, breche für Hersteller ab.`);
        break;
      }
    }

    processedManufacturers += 1;
  }

  await writeSummary(summaries);

  if (options.apply) {
    await saveProductsLive(data);
    console.log('\n✅ products.live.json wurde mit neuen Dokumenten aktualisiert.');
  } else {
    console.log('\nℹ️ Lauf im Dry-Run-Modus abgeschlossen. Verwende --apply, um Änderungen zu übernehmen.');
  }

  console.log(`Verarbeitete Hersteller: ${processedManufacturers}`);
}

main().catch((err) => {
  console.error('Harvest-Skript fehlgeschlagen:', err);
  process.exit(1);
});
