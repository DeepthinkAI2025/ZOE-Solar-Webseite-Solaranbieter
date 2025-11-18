import { scrapeMeyerBurger } from './meyerBurger.js';

const registry = {
  'meyer-burger': scrapeMeyerBurger
};

export function listManualScrapers() {
  return Object.keys(registry);
}

export function hasManualScraper(slug) {
  return Boolean(slug && registry[slug]);
}

export async function runManualScraper({ slug, name, website }) {
  if (!slug || !registry[slug]) return null;
  try {
    const result = await registry[slug]({ slug, name, website });
    return {
      ...(result ?? {}),
      provider: 'manual-scraper'
    };
  } catch (err) {
    return {
      error: err?.message ?? String(err)
    };
  }
}
