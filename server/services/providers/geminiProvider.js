import { GoogleGenerativeAI } from '@google/genai';
import { normalizeUrl, buildProduct, sanitizeText } from './providerUtils.js';

const DEFAULT_MODEL = process.env.SERVER_GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'models/gemini-1.5-flash';

let cachedClient = null;

function getClient() {
  const apiKey = process.env.SERVER_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!cachedClient) {
    cachedClient = new GoogleGenerativeAI(apiKey);
  }
  return cachedClient;
}

export async function geminiProvider() {
  throw new Error('Gemini-Provider deaktiviert. Firecrawl MCP ist die einzige erlaubte Quelle.');
}

export default { geminiProvider };
