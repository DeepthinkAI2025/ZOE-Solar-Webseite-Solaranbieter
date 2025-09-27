import { GoogleGenAI } from '@google/genai';
import { normalizeUrl, buildProduct, sanitizeText } from './providerUtils.js';

const DEFAULT_MODEL =
  process.env.SERVER_GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'models/gemini-1.5-flash';
const MAX_HTML_CHARS = Math.max(1500, Number(process.env.GEMINI_HTML_MAX_CHARS || 14000));

let cachedClient = null;

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

export function isGeminiConfigured() {
  return Boolean(process.env.SERVER_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
}

function getClient() {
  if (!isGeminiConfigured()) return null;
  if (!cachedClient) {
    const apiKey = process.env.SERVER_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

function buildTextOnlyContents(prompt) {
  if (!prompt) return [{ role: 'user', parts: [{ text: '' }] }];
  return [{ role: 'user', parts: [{ text: String(prompt) }] }];
}

async function generateContent(prompt, overrides = {}) {
  const client = getClient();
  if (!client) throw new Error('Gemini-Client nicht initialisiert.');

  if (typeof client.getGenerativeModel === 'function') {
    const model = client.getGenerativeModel({ model: DEFAULT_MODEL });
    if (Array.isArray(overrides)) {
      return model.generateContent(overrides);
    }
    if (overrides && typeof overrides === 'object' && overrides.contents) {
      return model.generateContent(overrides.contents);
    }
    return model.generateContent([{ text: prompt }]);
  }

  if (client.models && typeof client.models.generateContent === 'function') {
    const request = {
      model: DEFAULT_MODEL,
      contents: buildTextOnlyContents(prompt),
      ...overrides
    };

    if (!request.contents) {
      request.contents = buildTextOnlyContents(prompt);
    } else if (typeof request.contents === 'string') {
      request.contents = buildTextOnlyContents(request.contents);
    }

    return client.models.generateContent(request);
  }

  throw new Error('Gemini SDK unterstützt generateContent nicht.');
}

function extractTextFromResponse(response) {
  if (!response) return '';
  if (typeof response.text === 'function') {
    try {
      const value = response.text();
      if (typeof value === 'string') return value;
    } catch (err) {
      // ignore and continue with fallbacks
    }
  }
  if (typeof response.text === 'string') {
    return response.text;
  }
  if (response?.response?.text) {
    const value = typeof response.response.text === 'function' ? response.response.text() : response.response.text;
    if (typeof value === 'string') return value;
  }
  const candidateText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof candidateText === 'string') return candidateText;
  if (Array.isArray(response?.candidates)) {
    const part = response.candidates[0]?.content?.parts?.[0];
    if (typeof part?.text === 'string') return part.text;
    if (typeof part === 'string') return part;
  }
  if (Array.isArray(response?.contents)) {
    const firstPart = response.contents[0]?.parts?.[0];
    if (typeof firstPart?.text === 'string') return firstPart.text;
  }
  if (Array.isArray(response?.outputTexts) && typeof response.outputTexts[0] === 'string') {
    return response.outputTexts[0];
  }
  return '';
}

function extractJsonCandidates(text) {
  if (!text || typeof text !== 'string') return [];
  const blocks = [];

  const fenced = Array.from(text.matchAll(/```json\s*([\s\S]*?)\s*```/gi));
  for (const match of fenced) {
    if (match[1]) blocks.push(match[1]);
  }

  if (!fenced.length) {
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) blocks.push(braceMatch[0]);
  }

  return blocks.length ? blocks : [text];
}

function tryParseResponse(text) {
  const candidates = extractJsonCandidates(text);
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (err) {
      // continue
    }
  }
  return null;
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

async function fetchWebsiteSnapshot(website) {
  const res = await fetch(website, { headers: { 'User-Agent': 'ZOE-GeminiCrawler/1.0' } });
  if (!res.ok) {
    throw new Error(`Website abrufen fehlgeschlagen (${res.status})`);
  }
  const html = await res.text();
  return html.slice(0, MAX_HTML_CHARS);
}

export async function geminiProvider(manufacturer, { htmlSnapshot } = {}) {
  if (!manufacturer?.website) {
    throw new Error('Gemini-Provider benötigt eine Hersteller-Webseite.');
  }
  if (!isGeminiConfigured()) {
    throw new Error('Gemini nicht konfiguriert. Setze SERVER_GEMINI_API_KEY oder VITE_GEMINI_API_KEY.');
  }

  const snapshot = htmlSnapshot ?? (await fetchWebsiteSnapshot(manufacturer.website));

  const prompt = `Extrahiere strukturierte Produktdaten für den Hersteller "${manufacturer.name}" (${manufacturer.website}).
Antworte ausschließlich mit JSON nach folgendem Schema:
{
  "logoCandidates": ["https://..."],
  "datasheetCandidates": ["https://...pdf"],
  "products": [
    {
      "name": "",
      "description": "",
      "image": "https://...",
      "price": "",
      "datasheet": "https://...",
      "url": "https://...",
      "keyFeatures": [""],
      "specs": { "Schlüssel": "Wert" }
    }
  ]
}
Nutze ausschließlich verifizierbare Inhalte aus dem HTML. Keine Halluzinationen, keine Marketingphrasen ohne Quelle.
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
    provider: 'gemini',
    logoCandidates,
    datasheetCandidates,
    products,
    raw: text
  };
}

function describeCandidateList(type, candidates = []) {
  const lines = [];
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue;
    const url = candidate.finalUrl || candidate.url || candidate.href || null;
    if (!url) continue;
    const status = candidate.status ?? (candidate.ok ? 200 : candidate.ok === false ? 400 : null);
    const ok = candidate.ok === false ? 'nok' : 'ok';
    const ct = candidate.contentType || candidate.type || null;
    lines.push(`- ${type.toUpperCase()}: ${url}${status ? ` (status ${status}, ${ok})` : ''}${ct ? ` | ${ct}` : ''}`);
  }
  return lines.join('\n');
}

export async function evaluateAssetCandidates(manufacturer, { logoCandidates = [], datasheetCandidates = [] } = {}) {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini ist nicht konfiguriert.');
  }
  if (!manufacturer?.name || !manufacturer?.website) {
    throw new Error('evaluateAssetCandidates benötigt Herstellername und -website.');
  }

  const prompt = `Du bist ein strenger Qualitätsprüfer für digitale Assets eines Solar-Herstellers. Wähle nur URLs aus, die eindeutig das Hersteller-Branding zeigen oder technische PDF-Datenblätter darstellen. Wenn du dir nicht sicher bist, gib lieber keine Empfehlung zurück.

Hersteller: ${manufacturer.name} (${manufacturer.website})

Vorliegende geprüfte Assets:
${describeCandidateList('logo', logoCandidates)}
${describeCandidateList('datasheet', datasheetCandidates)}

Antworte ausschließlich als JSON im Format:
{
  "logoWhitelist": ["https://..."],
  "datasheetWhitelist": ["https://...pdf"]
}

Gib nur URLs zurück, die absolut vertrauenswürdig sind. Lasse Felder weg oder verwende leere Arrays, wenn nichts passt.`;

  const response = await generateContent(prompt);
  const text = extractTextFromResponse(response);
  const parsed = tryParseResponse(text) || {};

  const logoWhitelist = uniqueStrings(arrayify(parsed.logoWhitelist ?? parsed.logos ?? []));
  const datasheetWhitelist = uniqueStrings(arrayify(parsed.datasheetWhitelist ?? parsed.datasheets ?? []));

  return {
    logoWhitelist,
    datasheetWhitelist,
    raw: text
  };
}

export default { geminiProvider, isGeminiConfigured, evaluateAssetCandidates };
