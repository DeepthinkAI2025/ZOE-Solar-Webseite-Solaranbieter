import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'server', 'storage');
const WHITELIST_FILE = path.join(STORAGE_DIR, 'asset-whitelist.json');

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function normaliseList(values = []) {
  const seen = new Set();
  const output = [];
  for (const value of Array.isArray(values) ? values : []) {
    if (!value || typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output;
}

export function loadAssetWhitelist() {
  ensureStorage();
  if (!fs.existsSync(WHITELIST_FILE)) {
    return { version: 1, updatedAt: null, manufacturers: {} };
  }
  try {
    const raw = fs.readFileSync(WHITELIST_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') throw new Error('invalid structure');
    if (!data.manufacturers || typeof data.manufacturers !== 'object') {
      data.manufacturers = {};
    }
    return data;
  } catch (err) {
    console.warn('[assetWhitelist] Failed to read whitelist, starting fresh:', err.message || err);
    return { version: 1, updatedAt: null, manufacturers: {} };
  }
}

export function getManufacturerWhitelist(store, slug) {
  if (!store || !slug) return { logos: [], datasheets: [] };
  const entry = store.manufacturers?.[slug];
  if (!entry) return { logos: [], datasheets: [] };
  return {
    logos: normaliseList(entry.logos),
    datasheets: normaliseList(entry.datasheets)
  };
}

export function updateManufacturerWhitelist(store, slug, { logos = [], datasheets = [] } = {}) {
  if (!store || !slug) return false;
  const entry = store.manufacturers?.[slug] ?? { logos: [], datasheets: [] };
  const beforeLogos = new Set(normaliseList(entry.logos));
  const beforeDatasheets = new Set(normaliseList(entry.datasheets));

  for (const url of normaliseList(logos)) {
    if (!beforeLogos.has(url)) beforeLogos.add(url);
  }
  for (const url of normaliseList(datasheets)) {
    if (!beforeDatasheets.has(url)) beforeDatasheets.add(url);
  }

  const nextLogos = Array.from(beforeLogos);
  const nextDatasheets = Array.from(beforeDatasheets);
  const changed =
    nextLogos.length !== entry.logos?.length ||
    nextDatasheets.length !== entry.datasheets?.length ||
    nextLogos.some((value, idx) => value !== entry.logos?.[idx]) ||
    nextDatasheets.some((value, idx) => value !== entry.datasheets?.[idx]);

  store.manufacturers = store.manufacturers || {};
  store.manufacturers[slug] = {
    logos: nextLogos,
    datasheets: nextDatasheets,
    lastUpdatedAt: new Date().toISOString()
  };

  return changed;
}

export function saveAssetWhitelist(store) {
  ensureStorage();
  const payload = {
    ...(store || {}),
    version: 1,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(WHITELIST_FILE, JSON.stringify(payload, null, 2), 'utf-8');
}
