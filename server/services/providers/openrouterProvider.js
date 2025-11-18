import { getOpenRouterClient } from '../../services/core/OpenRouterClient.js';
import { normalizeUrl, buildProduct, sanitizeText } from './providerUtils.js';

const DEFAULT_MODEL = process.env.SERVER_OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'mistral-7b-instruct';
const MAX_HTML_CHARS = Math.max(1500, Number(process.env.OPENROUTER_HTML_MAX_CHARS || 14000));

function arrayify(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function uniqueStrings(values = []) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    if (!value || typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

export function isOpenRouterConfigured() {
  return Boolean(process.env.SERVER_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY);
}

function getClient() {
  if (!isOpenRouterConfigured()) return null;
  return getOpenRouterClient();
}

async function fetchWebsiteSnapshot(website) {
  const res = await fetch(website, { headers: { 'User-Agent': 'ZOE-OpenRouterCrawler/1.0' } });
  if (!res.ok) {
    throw new Error(`Website abrufen fehlgeschlagen (${res.status})`);
  }
  const html = await res.text();
  return html.slice(0, MAX_HTML_CHARS);
}

async function generateContent(prompt, overrides = {}) {
  const client = getClient();
  if (!client) throw new Error('OpenRouter-Client nicht initialisiert.');

  return client.generateContent({ model: DEFAULT_MODEL, ...overrides, prompt });
}

function extractTextFromResponse(response) {
  if (!response) return '';
  if (typeof response === 'string') return response;
  return JSON.stringify(response);
}

function tryParseResponse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

function normaliseProducts(manufacturer, products = []) {
  if (!Array.isArray(products)) return [];
  const output = [];
  for (const candidate of products) {
    if (!candidate) continue;
    const name = sanitizeText(candidate.name ?? candidate.title);
    if (!name) continue;
    const description = sanitizeText(candidate.description ?? candidate.summary ?? candidate.text ?? null);
    const imageUrl = normalizeUrl(manufacturer.website, candidate.image ?? candidate.imageUrl ?? null);
    const datasheetUrl = normalizeUrl(
      manufacturer.website,
      candidate.datasheet ?? candidate.datasheetUrl ?? candidate.specSheet ?? candidate.pdf ?? null
    );
    const basePrice = sanitizeText(candidate.price ?? candidate.basePrice ?? null);
    const keyFeatures = arrayify(candidate.keyFeatures ?? candidate.features)
      .map((item) => sanitizeText(typeof item === 'string' ? item : item?.text ?? null))
      .filter(Boolean);

    const specs = {};
    if (candidate.specs && typeof candidate.specs === 'object') {
      for (const [key, value] of Object.entries(candidate.specs)) {
        const cleanKey = sanitizeText(key);
        if (!cleanKey) continue;
        const cleanValue = typeof value === 'string' ? sanitizeText(value) : value;
        if (cleanValue === null || cleanValue === undefined || cleanValue === '') continue;
        specs[cleanKey] = cleanValue;
      }
    }

    const product = buildProduct({
      name,
      description,
      imageUrl,
      basePrice,
      datasheetUrl,
      keyFeatures,
      specs
    });

    const url = normalizeUrl(manufacturer.website, candidate.url ?? candidate.link ?? candidate.permalink ?? null);
    if (url) product.productUrl = url;

    output.push(product);
  }
  return output;
}

export async function openRouterProvider(manufacturer, { htmlSnapshot } = {}) {
  if (!manufacturer?.website) {
    throw new Error('openrouter-Provider benötigt eine Hersteller-Webseite.');
  }
  if (!isOpenRouterConfigured()) {
    throw new Error('OpenRouter nicht konfiguriert. Setze SERVER_OPENROUTER_API_KEY oder OPENROUTER_API_KEY.');
  }

  const snapshot = htmlSnapshot ?? (await fetchWebsiteSnapshot(manufacturer.website));

  const prompt = `Extrahiere strukturierte Produktdaten für den Hersteller "${manufacturer.name}" (${manufacturer.website}).\nAntworte ausschließlich mit JSON.
HTML-Auszug:
"""
${snapshot}
"""`;

  const response = await generateContent(prompt);
  const text = extractTextFromResponse(response);
  const parsed = tryParseResponse(text) ?? {};

  const logoCandidates = uniqueStrings(
    arrayify(parsed.logoCandidates ?? parsed.logos ?? [])
      .map((url) => normalizeUrl(manufacturer.website, url))
      .filter(Boolean)
  );

  const datasheetCandidates = uniqueStrings(
    arrayify(parsed.datasheetCandidates ?? parsed.datasheets ?? [])
      .map((url) => normalizeUrl(manufacturer.website, url))
      .filter(Boolean)
  );

  const products = normaliseProducts(manufacturer, parsed.products ?? parsed.items ?? []);

  return {
    provider: 'openrouter',
    logoCandidates,
    datasheetCandidates,
    products,
    raw: text
  };
}

export default { openRouterProvider, isOpenRouterConfigured };
