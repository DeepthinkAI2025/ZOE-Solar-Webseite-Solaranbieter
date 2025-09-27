import fetch from 'node-fetch';
import { buildProduct, normalizeUrl, sanitizeText } from './providers/providerUtils.js';

const DEFAULT_ENDPOINT = process.env.FIRECRAWL_MCP_ENDPOINT || process.env.FIRECRAWL_ENDPOINT || 'http://localhost:3000/v1/scrape';

console.log('Firecrawl Endpoint:', DEFAULT_ENDPOINT);
const DEFAULT_TIMEOUT = Number(process.env.FIRECRAWL_TIMEOUT_MS || 45000);

function arrayify(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function uniqueStrings(values = []) {
  const seen = new Set();
  const result = [];
  for (const val of values) {
    if (!val || typeof val !== 'string') continue;
    const trimmed = val.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

export async function callFirecrawl({ url, prompt, formats = ['extract'], timeout = DEFAULT_TIMEOUT }) {
  if (!DEFAULT_ENDPOINT) {
    throw new Error('FIRECRAWL_MCP_ENDPOINT (or FIRECRAWL_ENDPOINT) ist nicht gesetzt.');
  }
  if (!url) throw new Error('callFirecrawl erfordert eine URL.');

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'ZOE-Firecrawl-Client/1.0'
  };
  if (process.env.FIRECRAWL_MCP_API_KEY || process.env.FIRECRAWL_API_KEY) {
    headers.Authorization = `Bearer ${process.env.FIRECRAWL_MCP_API_KEY || process.env.FIRECRAWL_API_KEY}`;
  }

  const body = {
    url,
    formats,
    extract: prompt
      ? {
          prompt,
          schema: {
            type: 'object',
            properties: {
              logoCandidates: { type: 'array', items: { type: 'string' } },
              datasheetCandidates: { type: 'array', items: { type: 'string' } },
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    image: { type: 'string' },
                    price: { type: ['string', 'number'] },
                    datasheet: { type: 'string' },
                    url: { type: 'string' },
                    keyFeatures: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    specs: {
                      type: 'object'
                    }
                  }
                }
              }
            }
          }
        }
      : undefined
  };

  const res = await fetch(DEFAULT_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    timeout
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(`Firecrawl-Request fehlgeschlagen (${res.status}): ${text ? text.slice(0, 400) : 'kein Body'}`);
  }

  const data = await res.json().catch(async () => {
    const text = await res.text().catch(() => '');
    throw new Error(`Firecrawl lieferte keine JSON-Antwort: ${text.slice(0, 400)}`);
  });

  return {
    endpoint: DEFAULT_ENDPOINT,
    payload: body,
    response: data
  };
}

function tryParseJson(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (err) {
      console.warn('[firecrawlClient] JSON-Parse fehlgeschlagen:', err?.message ?? err);
      return null;
    }
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
    const datasheetUrl = normalizeUrl(manufacturer.website, candidate.datasheet ?? candidate.datasheetUrl ?? candidate.specSheet ?? candidate.pdf ?? null);
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
    if (candidate.attributes && typeof candidate.attributes === 'object') {
      for (const [key, value] of Object.entries(candidate.attributes)) {
        const cleanKey = sanitizeText(key);
        if (!cleanKey || specs[cleanKey]) continue;
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

function extractStructuredPayload(rawResponse) {
  if (!rawResponse) return null;
  if (rawResponse.extract && typeof rawResponse.extract === 'object') {
    const payload = rawResponse.extract.data ?? rawResponse.extract.output ?? rawResponse.extract.result ?? rawResponse.extract;
    const parsed = tryParseJson(payload);
    return parsed ?? payload;
  }
  if (Array.isArray(rawResponse.data)) return rawResponse.data[0];
  if (rawResponse.data && typeof rawResponse.data === 'object') return rawResponse.data;
  return rawResponse;
}

export async function fetchManufacturerData(manufacturer, { prompt: customPrompt } = {}) {
  if (!manufacturer?.website) {
    console.warn('[firecrawlClient] Hersteller ohne Website, überspringe', manufacturer?.slug ?? manufacturer?.name);
    return null;
  }

  const prompt =
    customPrompt ||
    `Extrahiere ausschließlich echte, öffentlich sichtbare Produktdaten von ${manufacturer.name} (${manufacturer.website}).
Antwort NUR mit JSON im Schema {
  "logoCandidates": ["https://..."],
  "datasheetCandidates": ["https://...pdf"],
  "products": [
    {
      "name": "",
      "description": "",
      "image": "",
      "price": "",
      "datasheet": "",
      "url": "",
      "keyFeatures": [""],
      "specs": { "Leistung": "" }
    }
  ]
}.
Nutze nur Daten von der offiziellen Herstellerseite, füge keine erfundenen Fakten hinzu.`;

  const { response } = await callFirecrawl({ url: manufacturer.website, prompt });
  const structured = extractStructuredPayload(response);
  const parsed = tryParseJson(structured) ?? structured ?? {};

  const logoCandidates = uniqueStrings(
    arrayify(parsed.logoCandidates ?? parsed.logos ?? parsed.images ?? [])
      .map((url) => normalizeUrl(manufacturer.website, url))
      .filter(Boolean)
  );

  const datasheetCandidates = uniqueStrings(
    arrayify(parsed.datasheetCandidates ?? parsed.datasheets ?? parsed.pdfs ?? [])
      .map((url) => normalizeUrl(manufacturer.website, url))
      .filter(Boolean)
  );

  const products = normaliseProducts(manufacturer, parsed.products ?? parsed.items ?? parsed.catalog ?? []);

  return {
    provider: 'firecrawl-mcp',
    logoCandidates,
    datasheetCandidates,
    products,
    raw: response
  };
}

export async function fetchLogoCandidatesForWebsite(websiteUrl, name) {
  if (!websiteUrl) return [];
  const prompt = `Finde offizielle Logo-Bild-URLs für ${name ?? websiteUrl}. Gib ausschließlich JSON { "logoCandidates": ["https://..."] } zurück.`;
  try {
    const { response } = await callFirecrawl({ url: websiteUrl, prompt });
    const structured = extractStructuredPayload(response);
    const parsed = tryParseJson(structured) ?? structured ?? {};
    const logoCandidates = uniqueStrings(
      arrayify(parsed.logoCandidates ?? parsed.logos ?? parsed.images ?? [])
        .map((url) => normalizeUrl(websiteUrl, url))
        .filter(Boolean)
    );
    return logoCandidates;
  } catch (err) {
    console.warn('[firecrawlClient] Logo-Ermittlung fehlgeschlagen:', err?.message ?? err);
    return [];
  }
}

export default {
  callFirecrawl,
  fetchManufacturerData,
  fetchLogoCandidatesForWebsite
};
