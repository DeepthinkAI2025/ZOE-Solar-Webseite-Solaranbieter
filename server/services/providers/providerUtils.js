import crypto from 'crypto';

export function normalizeUrl(base, url) {
  if (!url) return null;
  try {
    const resolved = new URL(url, base ?? undefined);
    return resolved.toString();
  } catch (err) {
    return null;
  }
}

export function buildProduct({
  name,
  imageUrl = null,
  description = null,
  basePrice = null,
  datasheetUrl = null,
  specs = {},
  keyFeatures = []
}) {
  return {
    id: crypto.createHash('md5').update(name + (datasheetUrl ?? '')).digest('hex').slice(0, 12),
    name,
    imageUrl,
    description,
    basePrice,
    datasheetUrl,
    specs,
    keyFeatures
  };
}

export function mergeProducts(primary = [], fallback = []) {
  const map = new Map();
  for (const list of [primary, fallback]) {
    for (const product of list) {
      if (!product?.name) continue;
      const key = product.name.toLowerCase();
      if (!map.has(key)) map.set(key, product);
    }
  }
  return Array.from(map.values());
}

export function sanitizeText(value) {
  if (typeof value !== 'string') return null;
  return value.replace(/\s+/g, ' ').trim();
}

export function isUrl(value) {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch (err) {
    return false;
  }
}
