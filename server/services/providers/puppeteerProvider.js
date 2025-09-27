import { extractFromRendered } from '../puppeteerClient.js';
import { buildProduct, normalizeUrl, sanitizeText } from './providerUtils.js';

export async function puppeteerProvider() {
  throw new Error('Puppeteer-Provider deaktiviert. Firecrawl MCP ist die einzige erlaubte Quelle.');
}

export default { puppeteerProvider };
