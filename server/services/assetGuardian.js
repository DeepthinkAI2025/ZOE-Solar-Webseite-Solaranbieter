import { evaluateAssetCandidates, isOpenRouterConfigured } from './providers/openrouterProvider.js';

const DEFAULT_PROBE_TIMEOUT_MS = Math.max(2000, Number(process.env.ASSET_PROBE_TIMEOUT_MS || 8000));
const DEFAULT_MAX_URLS = Math.max(1, Number(process.env.ASSET_PROBE_MAX_URLS || 12));

function normaliseUrlList(values = []) {
  const seen = new Set();
  const output = [];
  for (const value of Array.isArray(values) ? values : []) {
    if (!value || typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (!/^https?:/i.test(trimmed)) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    output.push(trimmed);
  }
  return output.slice(0, DEFAULT_MAX_URLS);
}

async function probeUrl(url, timeout = DEFAULT_PROBE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    let res;
    try {
      res = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal
      });
      if (res.status === 405 || res.status === 501) {
        throw new Error('HEAD not allowed');
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          Range: 'bytes=0-0'
        }
      });
    }

    const contentType = res.headers?.get?.('content-type') || null;
    return {
      url,
      ok: res.ok,
      status: res.status,
      contentType,
      finalUrl: res.url || url
    };
  } catch (err) {
    const aborted = err.name === 'AbortError';
    return {
      url,
      ok: false,
      status: null,
      error: aborted ? 'timeout' : err.message || String(err)
    };
  } finally {
    clearTimeout(timer);
  }
}

async function probeCandidates(type, urls) {
  const unique = normaliseUrlList(urls);
  const results = [];
  for (const url of unique) {
    // eslint-disable-next-line no-await-in-loop
    const result = await probeUrl(url);
    results.push({ type, ...result });
  }
  return results;
}

export async function analyseAssetCandidates(manufacturer, { logoCandidates = [], datasheetCandidates = [] } = {}) {
  const logoProbeResults = await probeCandidates('logo', logoCandidates);
  const datasheetProbeResults = await probeCandidates('datasheet', datasheetCandidates);

  const accessibleLogos = logoProbeResults.filter((item) => item.ok);
  const accessibleDatasheets = datasheetProbeResults.filter((item) => item.ok);

  const finalLogos = accessibleLogos.map((item) => item.finalUrl);
  const finalDatasheets = accessibleDatasheets.map((item) => item.finalUrl);

  let openrouterUsed = false;
  let openrouterError = null;

  if (isOpenRouterConfigured() && (accessibleLogos.length || accessibleDatasheets.length)) {
    try {
      const response = await evaluateAssetCandidates(
        manufacturer,
        {
          logoCandidates: accessibleLogos,
          datasheetCandidates: accessibleDatasheets
        }
      );
      const approvedLogos = Array.isArray(response?.logoWhitelist) ? response.logoWhitelist : [];
      const approvedDatasheets = Array.isArray(response?.datasheetWhitelist) ? response.datasheetWhitelist : [];

      if (approvedLogos.length) {
        finalLogos.length = 0;
        finalLogos.push(...approvedLogos);
      }
      if (approvedDatasheets.length) {
        finalDatasheets.length = 0;
        finalDatasheets.push(...approvedDatasheets);
      }
  openrouterUsed = approvedLogos.length > 0 || approvedDatasheets.length > 0;
    } catch (err) {
      openrouterError = err?.message || String(err);
    }
  }

  return {
    logos: finalLogos,
    datasheets: finalDatasheets,
    diagnostics: {
      logoCandidates: logoCandidates.length,
      datasheetCandidates: datasheetCandidates.length,
      accessibleLogos: accessibleLogos.length,
      accessibleDatasheets: accessibleDatasheets.length,
  openrouterUsed,
  openrouterError,
      probeFailures: [...logoProbeResults, ...datasheetProbeResults].filter((item) => !item.ok)
    }
  };
}

export default {
  analyseAssetCandidates
};
