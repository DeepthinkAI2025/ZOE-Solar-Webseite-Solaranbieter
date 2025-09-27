import axios from 'axios';
import { load as loadHtml } from 'cheerio';

const BASE_URL = 'https://www.meyerburger.com';
const MODULE_URL = `${BASE_URL}/en/solar-modules`;

function normaliseUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/')) return `${BASE_URL}${trimmed}`;
  return `${BASE_URL}/${trimmed.replace(/^\./, '')}`;
}

function cleanText(value) {
  if (!value) return '';
  return value.replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim();
}

function pickDescription($card, $) {
  const paragraphs = $card.find('p').toArray();
  for (const node of paragraphs) {
    const text = cleanText($(node).text());
    if (!text || text === '&nbsp;') continue;
    if (/^read\s+(more|less)$/i.test(text)) continue;
    return text;
  }
  return null;
}

function deriveSpecs(featureList = []) {
  const specs = {};
  for (const feature of featureList) {
    const value = feature.trim().replace(/\s+/g, ' ');
    const normalized = value.toLowerCase();

    if (normalized.startsWith('rated power')) {
      specs.ratedPower = value.replace(/^rated power\s*/i, '').replace(/,$/, '').trim();
      continue;
    }

    if (normalized.startsWith('corresponds to')) {
      specs.powerDensity = value.replace(/^corresponds to\s*/i, '').trim();
      continue;
    }

    if (normalized.startsWith('efficiency')) {
      specs.efficiency = value.replace(/^efficiency[:]?\s*/i, '').trim();
      continue;
    }

    if (normalized.startsWith('compact size') || normalized.startsWith('size') || normalized.includes('mm')) {
      if (!specs.dimensions) {
        specs.dimensions = value.replace(/^[^:]+:\s*/i, '').trim();
      }
      continue;
    }

    if (normalized.startsWith('weight')) {
      specs.weight = value.replace(/^[^:]+:\s*/i, '').trim();
      continue;
    }

    if (normalized.startsWith('low weight')) {
      specs.weight = value.replace(/^low weight[:]?\s*/i, '').trim();
      continue;
    }

    if (normalized.startsWith('module with')) {
      specs.cellConfiguration = value;
      continue;
    }

    if (normalized.includes('product') && normalized.includes('guarantee')) {
      specs.productGuarantee = value;
      continue;
    }

    if (normalized.includes('performance guarantee')) {
      specs.performanceGuarantee = value;
      continue;
    }
  }
  return specs;
}

export async function scrapeMeyerBurger() {
  const response = await axios.get(MODULE_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    timeout: 20000
  });

  const $ = loadHtml(response.data);
  const products = [];
  const datasheetCandidates = new Set();

  $('.mbMoleculeSolarmodule-solarModule').each((_, element) => {
    const $card = $(element);
    const name = cleanText($card.find('.mbAtomHeading-heading h4').first().text());
    if (!name) return;

    const imageUrl = normaliseUrl($card.find('img.mbAtomImage-image').first().attr('src'));

    const features = [];
    $card
      .find('ul li')
      .toArray()
      .forEach((node) => {
        const text = cleanText($(node).text());
        if (text) features.push(text);
      });

  const specs = deriveSpecs(features);
  const description = pickDescription($card, $) || null;

    const datasheetLink = normaliseUrl(
      $card
        .find('a[href*="downloads"], a[href*="pdf"], a[href*="/fileadmin"]')
        .first()
        .attr('href')
    );
    if (datasheetLink) datasheetCandidates.add(datasheetLink);

    products.push({
      name,
      description,
      imageUrl: imageUrl || null,
      basePrice: null,
      configurable: false,
      specs,
      keyFeatures: features
    });
  });

  return {
    products,
    datasheetCandidates: Array.from(datasheetCandidates),
    providersUsed: ['manual-scraper'],
    sourceUrl: MODULE_URL
  };
}
