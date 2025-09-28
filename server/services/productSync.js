import fs from 'fs';
import path from 'path';
import { cacheLogoForManufacturer, probeAndCacheLogo } from './logoCache.js';
import { fetchManufacturerData } from './firecrawlClient.js';
import { hasManualScraper, runManualScraper } from './manualScrapers/index.js';
import { geminiProvider, isGeminiConfigured } from './providers/geminiProvider.js';
import { analyseAssetCandidates } from './assetGuardian.js';
import {
  loadAssetWhitelist,
  getManufacturerWhitelist,
  updateManufacturerWhitelist,
  saveAssetWhitelist
} from './assetWhitelist.js';
import { resolveManufacturerSeed } from '../config/manufacturers.js';

const STORAGE_DIR = path.join(process.cwd(), 'server', 'storage');
const LIVE_PRODUCTS_FILE = path.join(STORAGE_DIR, 'products.live.json');
const DEFAULT_CONCURRENCY = Math.max(1, Number(process.env.PRODUCT_SYNC_CONCURRENCY || 3));

function slugify(value) {
  if (!value || typeof value !== 'string') return null;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .trim();
}

async function mapWithConcurrency(items = [], mapper, limit = DEFAULT_CONCURRENCY) {
  if (!Array.isArray(items) || items.length === 0) return [];
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function dedupeProviders(...lists) {
  const seen = new Set();
  const result = [];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const provider of list) {
      if (!provider || typeof provider !== 'string') continue;
      if (seen.has(provider)) continue;
      seen.add(provider);
      result.push(provider);
    }
  }
  return result;
}

function addUrlCandidates(target, values) {
  if (!target || typeof target.add !== 'function') return;
  const list = Array.isArray(values) ? values : [];
  for (const value of list) {
    if (!value || typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    target.add(trimmed);
  }
}

function isConnectivityError(err) {
  if (!err) return false;
  const codes = new Set(['ECONNREFUSED', 'ECONNRESET', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT']);
  if (err.code && codes.has(err.code)) return true;
  if (err.errno && codes.has(err.errno)) return true;
  if (err.cause && (codes.has(err.cause.code) || codes.has(err.cause.errno))) return true;
  const message = (err.message || err.toString() || '').toUpperCase();
  return ['ECONNREFUSED', 'ECONNRESET', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT', 'FETCH FAILED'].some((token) =>
    message.includes(token)
  );
}

function buildProductDiff(previousProducts = [], nextProducts = []) {
  const toKey = (product) => (product?.name ? product.name.toLowerCase() : null);
  const prevMap = new Map();
  for (const product of Array.isArray(previousProducts) ? previousProducts : []) {
    const key = toKey(product);
    if (!key) continue;
    prevMap.set(key, product);
  }

  const nextMap = new Map();
  for (const product of Array.isArray(nextProducts) ? nextProducts : []) {
    const key = toKey(product);
    if (!key) continue;
    nextMap.set(key, product);
  }

  const added = [];
  const removed = [];
  const changed = [];

  for (const [key, product] of nextMap.entries()) {
    if (!prevMap.has(key)) {
      added.push(product.name);
    } else {
      const prev = prevMap.get(key);
      if (JSON.stringify(prev) !== JSON.stringify(product)) {
        changed.push(product.name);
      }
    }
  }

  for (const [key, product] of prevMap.entries()) {
    if (!nextMap.has(key)) {
      removed.push(product.name);
    }
  }

  return { added, removed, changed };
}

function buildChangeSummary(previous = null, next = null) {
  const prevManufacturers = Array.isArray(previous?.manufacturers) ? previous.manufacturers : [];
  const nextManufacturers = Array.isArray(next?.manufacturers) ? next.manufacturers : [];

  const prevBySlug = new Map();
  for (const manufacturer of prevManufacturers) {
    if (!manufacturer?.slug) continue;
    prevBySlug.set(manufacturer.slug, manufacturer);
  }

  const manufacturerChanges = [];
  for (const manufacturer of nextManufacturers) {
    if (!manufacturer?.slug) continue;
    const prev = prevBySlug.get(manufacturer.slug) || null;
    const diff = buildProductDiff(prev?.products ?? [], manufacturer.products ?? []);
    if (diff.added.length || diff.removed.length || diff.changed.length) {
      manufacturerChanges.push({
        slug: manufacturer.slug,
        name: manufacturer.name,
        addedProducts: diff.added,
        removedProducts: diff.removed,
        updatedProducts: diff.changed
      });
    }
  }

  return {
    generatedAt: next?.generatedAt ?? new Date().toISOString(),
    totalManufacturers: nextManufacturers.length,
    totalProducts: nextManufacturers.reduce((acc, m) => acc + (Array.isArray(m?.products) ? m.products.length : 0), 0),
    manufacturersWithChanges: manufacturerChanges.length,
    manufacturerChanges
  };
}

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

/**
 * Minimal placeholder sync implementation.
 * Real implementation should call manufacturer APIs or scrapers and assemble a canonical JSON.
 */
export async function runProductSync({ manufacturers = [] } = {}) {
  ensureStorage();

  let previousSnapshot = null;
  if (fs.existsSync(LIVE_PRODUCTS_FILE)) {
    try {
      const raw = fs.readFileSync(LIVE_PRODUCTS_FILE, 'utf-8');
      previousSnapshot = JSON.parse(raw);
    } catch (err) {
      console.warn('[productSync] Failed to read existing live products:', err.message);
    }
  }

  const assetWhitelistStore = loadAssetWhitelist();
  let assetWhitelistDirty = false;

  const suppliedManufacturers = Array.isArray(manufacturers) ? manufacturers.filter(Boolean) : [];
  const baselineManufacturers =
    suppliedManufacturers.length > 0
      ? suppliedManufacturers
      : Array.isArray(previousSnapshot?.manufacturers) && previousSnapshot.manufacturers.length > 0
      ? previousSnapshot.manufacturers
      : resolveManufacturerSeed();

  const normalisedManufacturers = baselineManufacturers
    .filter(Boolean)
    .map((entry) => {
      const slug = entry.slug || slugify(entry.name) || null;
      if (!slug) return null;
      return {
        slug,
        name: entry.name ?? slug,
        website: entry.website ?? null,
        products: Array.isArray(entry.products) ? entry.products : [],
        datasheetCandidates: Array.isArray(entry.datasheetCandidates) ? entry.datasheetCandidates : [],
        logoUrl: entry.logoUrl ?? null,
        providersUsed: dedupeProviders(entry.providersUsed, ['firecrawl-mcp']),
        syncMeta: entry.syncMeta ?? null
      };
    })
    .filter(Boolean);

  let manufacturerLimit = null;
  let manufacturerLimitReason = null;

  const explicitLimit = Number(process.env.PRODUCT_SYNC_MAX_MANUFACTURERS);
  if (Number.isFinite(explicitLimit) && explicitLimit > 0) {
    manufacturerLimit = explicitLimit;
    manufacturerLimitReason = 'env:PRODUCT_SYNC_MAX_MANUFACTURERS';
  } else if ((process.env.NODE_ENV || '').toLowerCase() !== 'production') {
    const devLimit = Number(process.env.PRODUCT_SYNC_DEV_LIMIT ?? 2);
    if (Number.isFinite(devLimit) && devLimit > 0) {
      manufacturerLimit = devLimit;
      manufacturerLimitReason = 'dev-default';
    }
  }

  const limitedManufacturers = manufacturerLimit
    ? normalisedManufacturers.slice(0, manufacturerLimit)
    : normalisedManufacturers;

  if (manufacturerLimit && normalisedManufacturers.length > limitedManufacturers.length) {
    console.info(
      `[productSync] Limitiere Hersteller auf ${limitedManufacturers.length} von ${normalisedManufacturers.length} (${manufacturerLimitReason}).`
    );
  }

  const firecrawlEnabled = process.env.DISABLE_FIRECRAWL === 'true' ? false : true;
  const geminiEnabled = isGeminiConfigured();
  const startedAt = Date.now();
  let firecrawlGlobalError = null;
  let firecrawlGlobalErrorCount = 0;
  const globalProviders = new Set();

  const enrichedManufacturers = await mapWithConcurrency(limitedManufacturers, async (manufacturer) => {
    const previous = Array.isArray(previousSnapshot?.manufacturers)
      ? previousSnapshot.manufacturers.find((m) => m?.slug === manufacturer.slug)
      : null;

    const base = {
      ...previous,
      ...manufacturer,
      slug: manufacturer.slug,
      name: manufacturer.name,
      website: manufacturer.website,
      products: Array.isArray(previous?.products) ? previous.products : manufacturer.products,
      datasheetCandidates: Array.isArray(previous?.datasheetCandidates)
        ? previous.datasheetCandidates
        : manufacturer.datasheetCandidates,
      logoUrl: previous?.logoUrl ?? manufacturer.logoUrl ?? null,
      providersUsed: dedupeProviders(previous?.providersUsed, manufacturer.providersUsed, ['firecrawl-mcp'])
    };

    base.lastSyncedAt = new Date().toISOString();
    base.syncMeta = {
      ...(previous?.syncMeta ?? {}),
      lastFirecrawlRun: base.lastSyncedAt,
      firecrawlEnabled,
      manufacturerLimit,
      manufacturerLimitReason
    };

    const manufacturerWhitelist = getManufacturerWhitelist(assetWhitelistStore, base.slug);
    const logoCandidateSet = new Set();
    const datasheetCandidateSet = new Set();

    addUrlCandidates(datasheetCandidateSet, base.datasheetCandidates);
    if (typeof base.logoUrl === 'string' && base.logoUrl.startsWith('http')) {
      addUrlCandidates(logoCandidateSet, [base.logoUrl]);
    }

    addUrlCandidates(logoCandidateSet, manufacturerWhitelist.logos);
    addUrlCandidates(datasheetCandidateSet, manufacturerWhitelist.datasheets);

    base.datasheetCandidates = Array.from(datasheetCandidateSet);

    base.syncMeta = {
      ...base.syncMeta,
      whitelist: {
        logoCount: manufacturerWhitelist.logos.length,
        datasheetCount: manufacturerWhitelist.datasheets.length
      }
    };

  let firecrawlSucceeded = false;
  let fallbackNeeded = !firecrawlEnabled;
  let manualScraperSucceeded = false;

    if (firecrawlEnabled && base.website) {
      if (firecrawlGlobalError) {
        base.syncMeta = {
          ...base.syncMeta,
          firecrawlSkippedDueToGlobalError: true
        };
        fallbackNeeded = true;
      } else {
        const firecrawlStarted = Date.now();
        try {
          const data = await fetchManufacturerData({ slug: base.slug, name: base.name, website: base.website });
          base.syncMeta = {
            ...base.syncMeta,
            firecrawlDurationMs: Date.now() - firecrawlStarted
          };

          if (Array.isArray(data?.products) && data.products.length > 0) {
            base.products = data.products;
            firecrawlSucceeded = true;
          }

          if (Array.isArray(data?.datasheetCandidates) && data.datasheetCandidates.length > 0) {
            addUrlCandidates(datasheetCandidateSet, data.datasheetCandidates);
            base.datasheetCandidates = Array.from(datasheetCandidateSet);
            firecrawlSucceeded = true;
          }

          if (Array.isArray(data?.logoCandidates) && data.logoCandidates.length > 0) {
            addUrlCandidates(logoCandidateSet, data.logoCandidates);
            for (const candidate of data.logoCandidates) {
              if (!candidate) continue;
              try {
                const local = await cacheLogoForManufacturer(base.slug, candidate);
                if (local) {
                  base.logoUrl = local;
                  break;
                }
              } catch (logoErr) {
                console.warn('[productSync] Failed to cache logo candidate for', base.slug, logoErr.message || logoErr);
              }
            }
          }

          fallbackNeeded = !firecrawlSucceeded;
        } catch (err) {
          base.syncMeta = {
            ...base.syncMeta,
            firecrawlError: err?.message ?? String(err)
          };
          const status = err?.status || err?.body?.status || null;
          const isAuthError = status === 401 || status === 403 || /\b401\b|UNAUTHORIZED/i.test(err?.message || '');
          if (isAuthError) {
            firecrawlGlobalError = err;
            firecrawlGlobalErrorCount += 1;
            fallbackNeeded = true;
            if (firecrawlGlobalErrorCount === 1) {
              console.error('[productSync] Firecrawl API verweigert den Zugriff (401/403). Breche weitere Anfragen ab.');
            }
          } else if (isConnectivityError(err)) {
            firecrawlGlobalError = err;
            firecrawlGlobalErrorCount += 1;
            fallbackNeeded = true;
            if (firecrawlGlobalErrorCount === 1) {
              console.error(
                '[productSync] Firecrawl nicht erreichbar. Überspringe weitere Firecrawl-Anfragen. Error:',
                err?.message ?? err
              );
            }
          }
          console.warn('[productSync] Firecrawl enrichment failed for', base.slug, err?.message ?? err);
        }
      }
    }

    if (fallbackNeeded && hasManualScraper(base.slug)) {
      const manualStarted = Date.now();
      try {
        const manual = await runManualScraper({ slug: base.slug, name: base.name, website: base.website });
        base.syncMeta = {
          ...base.syncMeta,
          manualScraperDurationMs: Date.now() - manualStarted,
          manualScraperUsed: true
        };

        if (manual?.error) {
          base.syncMeta.manualScraperError = manual.error;
        }

        if (Array.isArray(manual?.products) && manual.products.length > 0) {
          base.products = manual.products;
          manualScraperSucceeded = true;
        }

        if (Array.isArray(manual?.datasheetCandidates) && manual.datasheetCandidates.length > 0) {
          addUrlCandidates(datasheetCandidateSet, manual.datasheetCandidates);
          base.datasheetCandidates = Array.from(datasheetCandidateSet);
          manualScraperSucceeded = true;
        }

        if (Array.isArray(manual?.logoCandidates) && manual.logoCandidates.length > 0) {
          addUrlCandidates(logoCandidateSet, manual.logoCandidates);
        }

        if (Array.isArray(manual?.providersUsed) && manual.providersUsed.length > 0) {
          base.providersUsed = dedupeProviders(base.providersUsed, manual.providersUsed);
        } else if (manualScraperSucceeded) {
          base.providersUsed = dedupeProviders(base.providersUsed, ['manual-scraper']);
        }

        if (manual?.sourceUrl) {
          base.syncMeta = {
            ...base.syncMeta,
            manualScraperSource: manual.sourceUrl
          };
        }

        if (manualScraperSucceeded) {
          fallbackNeeded = false;
        }
      } catch (manualErr) {
        base.syncMeta = {
          ...base.syncMeta,
          manualScraperError: manualErr?.message ?? String(manualErr)
        };
      }
    }

    if (base.website && geminiEnabled && fallbackNeeded) {
      const geminiStarted = Date.now();
      try {
        const ai = await geminiProvider({ slug: base.slug, name: base.name, website: base.website });
        base.syncMeta = {
          ...base.syncMeta,
          geminiUsed: true,
          geminiDurationMs: Date.now() - geminiStarted
        };
        base.providersUsed = dedupeProviders(base.providersUsed, ['gemini']);

        if (Array.isArray(ai?.products) && ai.products.length > 0) {
          base.products = ai.products;
        }
        if (Array.isArray(ai?.datasheetCandidates) && ai.datasheetCandidates.length > 0) {
          addUrlCandidates(datasheetCandidateSet, ai.datasheetCandidates);
          base.datasheetCandidates = Array.from(datasheetCandidateSet);
        }
        if (Array.isArray(ai?.logoCandidates) && ai.logoCandidates.length > 0) {
          addUrlCandidates(logoCandidateSet, ai.logoCandidates);
          for (const candidate of ai.logoCandidates) {
            if (!candidate) continue;
            try {
              const local = await cacheLogoForManufacturer(base.slug, candidate);
              if (local) {
                base.logoUrl = local;
                break;
              }
            } catch (logoErr) {
              console.warn('[productSync] Failed to cache Gemini logo candidate for', base.slug, logoErr.message || logoErr);
            }
          }
        }
      } catch (geminiErr) {
        base.syncMeta = {
          ...base.syncMeta,
          geminiError: geminiErr?.message ?? String(geminiErr)
        };
        console.warn('[productSync] Gemini fallback failed for', base.slug, geminiErr?.message ?? geminiErr);
      }
    }

    if (logoCandidateSet.size || datasheetCandidateSet.size) {
      try {
        const guardianResult = await analyseAssetCandidates(
          { slug: base.slug, name: base.name, website: base.website },
          {
            logoCandidates: Array.from(logoCandidateSet),
            datasheetCandidates: Array.from(datasheetCandidateSet)
          }
        );

        const guardianDiagnostics = {
          ...(guardianResult?.diagnostics ?? {}),
          approvedLogoCount: Array.isArray(guardianResult?.logos) ? guardianResult.logos.length : 0,
          approvedDatasheetCount: Array.isArray(guardianResult?.datasheets) ? guardianResult.datasheets.length : 0
        };

        if (Array.isArray(guardianResult?.datasheets) && guardianResult.datasheets.length > 0) {
          base.datasheetCandidates = guardianResult.datasheets;
        } else {
          base.datasheetCandidates = Array.from(datasheetCandidateSet);
        }

        let cachedFrom = null;
        const cacheErrors = [];
        if (Array.isArray(guardianResult?.logos) && guardianResult.logos.length > 0) {
          for (const candidate of guardianResult.logos) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const local = await cacheLogoForManufacturer(base.slug, candidate);
              if (local) {
                base.logoUrl = local;
                cachedFrom = candidate;
                break;
              }
            } catch (logoErr) {
              cacheErrors.push({ url: candidate, error: logoErr?.message ?? String(logoErr) });
            }
          }
        }

        if (cachedFrom) guardianDiagnostics.cachedLogoSource = cachedFrom;
        if (cacheErrors.length) guardianDiagnostics.logoCacheErrors = cacheErrors;

        base.syncMeta = {
          ...base.syncMeta,
          assetGuardian: guardianDiagnostics
        };

        assetWhitelistDirty =
          updateManufacturerWhitelist(assetWhitelistStore, base.slug, {
            logos: guardianResult?.logos ?? [],
            datasheets: guardianResult?.datasheets ?? []
          }) || assetWhitelistDirty;
      } catch (guardianErr) {
        base.syncMeta = {
          ...base.syncMeta,
          assetGuardian: {
            error: guardianErr?.message ?? String(guardianErr),
            logoCandidates: logoCandidateSet.size,
            datasheetCandidates: datasheetCandidateSet.size
          }
        };
        base.datasheetCandidates = Array.from(datasheetCandidateSet);
      }
    } else {
      base.syncMeta = {
        ...base.syncMeta,
        assetGuardian: {
          skipped: true
        }
      };
    }

    if (base.logoUrl && !String(base.logoUrl).startsWith('/assets/logos/')) {
      try {
        const local = await cacheLogoForManufacturer(base.slug, base.logoUrl);
        if (local) base.logoUrl = local;
      } catch (err) {
        console.warn('[productSync] logo cache failed for', base.slug, err.message || err);
      }
    }

    if ((!base.logoUrl || !String(base.logoUrl).startsWith('/assets/logos/')) && base.website) {
      try {
        const probed = await probeAndCacheLogo(base.slug, base.website);
        if (probed) base.logoUrl = probed;
      } catch (err) {
        console.warn('[productSync] logo probe failed for', base.slug, err.message || err);
      }
    }

    if (!Array.isArray(base.products)) base.products = [];
    if (!Array.isArray(base.datasheetCandidates)) base.datasheetCandidates = [];

    for (const providerName of Array.isArray(base.providersUsed) ? base.providersUsed : []) {
      if (providerName) globalProviders.add(providerName);
    }

    return base;
  });

  if (assetWhitelistDirty) {
    saveAssetWhitelist(assetWhitelistStore);
  }

  if (!globalProviders.size) {
    globalProviders.add('firecrawl-mcp');
  }

  const firecrawlUsedCount = enrichedManufacturers.filter((m) =>
    Array.isArray(m?.providersUsed) && m.providersUsed.includes('firecrawl-mcp')
  ).length;
  const geminiUsedCount = enrichedManufacturers.filter((m) =>
    Array.isArray(m?.providersUsed) && m.providersUsed.includes('gemini')
  ).length;

  const nextSnapshot = {
    generatedAt: new Date().toISOString(),
    source: 'firecrawl-mcp',
    providers: Array.from(globalProviders),
    syncMeta: {
      startedAt: new Date(startedAt).toISOString(),
      durationMs: Date.now() - startedAt,
      firecrawlEnabled,
      geminiEnabled,
      firecrawlError: firecrawlGlobalError ? firecrawlGlobalError.message ?? String(firecrawlGlobalError) : null,
      firecrawlUnavailable: Boolean(firecrawlGlobalError),
      manufacturerCount: enrichedManufacturers.length,
      concurrency: DEFAULT_CONCURRENCY,
      firecrawlUsedCount,
      geminiUsedCount,
      manufacturerLimit,
      manufacturerLimitReason
    },
    manufacturers: enrichedManufacturers
  };

  nextSnapshot.changeSummary = buildChangeSummary(previousSnapshot, nextSnapshot);

  fs.writeFileSync(LIVE_PRODUCTS_FILE, JSON.stringify(nextSnapshot, null, 2), 'utf-8');
  return nextSnapshot;
}

export function readLiveProducts() {
  ensureStorage();
  if (!fs.existsSync(LIVE_PRODUCTS_FILE)) return null;
  try {
    const raw = fs.readFileSync(LIVE_PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[productSync] Failed to read live products:', err.message);
    return null;
  }
}

export function seedFromFile(filePath) {
  ensureStorage();
  if (!fs.existsSync(filePath)) throw new Error('Seed file not found');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  parsed.generatedAt = new Date().toISOString();
  fs.writeFileSync(LIVE_PRODUCTS_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
  return parsed;
}
