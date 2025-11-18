import { readFile } from 'node:fs/promises';

const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes
let cache = { data: null, fetchedAt: 0 };

const LOCAL_FALLBACK_PATH = new URL('../storage/monitoringSnapshot.json', import.meta.url);

async function loadFallbackSnapshot() {
  try {
    const raw = await readFile(LOCAL_FALLBACK_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

async function fetchFromRemote() {
  const endpoint = process.env.MONITORING_FEED_URL?.trim();
  if (!endpoint) return null;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        Authorization: process.env.MONITORING_FEED_TOKEN ? `Bearer ${process.env.MONITORING_FEED_TOKEN}` : undefined
      }
    });

    if (!response.ok) {
      console.warn('[monitoringFeed] Remote feed antwortete mit Status', response.status);
      return null;
    }

    const payload = await response.json();
    return {
      availability: Number(payload.availability ?? payload.uptime ?? payload.availabilityPercent ?? 0),
      productionMw: payload.productionMw ?? null,
      alerts: Array.isArray(payload.alerts) ? payload.alerts : [],
      updatedAt: payload.updatedAt ?? payload.timestamp ?? new Date().toISOString()
    };
  } catch (error) {
    console.warn('[monitoringFeed] Remote feed konnte nicht geladen werden:', error.message);
    return null;
  }
}

export async function fetchMonitoringSummary({ forceRefresh = false } = {}) {
  const now = Date.now();
  if (!forceRefresh && cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const remote = await fetchFromRemote();

  if (remote) {
    cache = { data: remote, fetchedAt: now };
    return remote;
  }

  const fallback = await loadFallbackSnapshot();
  if (fallback) {
    cache = { data: fallback, fetchedAt: now };
    return fallback;
  }

  return {
    availability: null,
    productionMw: null,
    alerts: [],
    updatedAt: null
  };
}

export function clearMonitoringCache() {
  cache = { data: null, fetchedAt: 0 };
}
