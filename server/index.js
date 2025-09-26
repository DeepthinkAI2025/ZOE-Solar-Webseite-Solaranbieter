import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import {
  loadApiKeys,
  saveApiKeys,
  summariseKeys,
  updateService
} from './lib/apiKeyStore.js';
import { fetchSearchConsoleData } from './services/searchConsole.js';
import { fetchAnalyticsData } from './services/analytics.js';
import { fetchAhrefsData } from './services/ahrefs.js';
import { fetchBusinessProfile } from './services/businessProfile.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

const PORT = Number(process.env.PORT ?? 5001);

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function applyEnvDefaults(state) {
  const next = cloneState(state);
  const envGemini = process.env.SERVER_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (envGemini) {
    next.gemini.apiKey = envGemini;
  }
  const envGeminiModel = process.env.SERVER_GEMINI_MODEL || process.env.VITE_GEMINI_MODEL;
  if (envGeminiModel) {
    next.gemini.model = envGeminiModel;
  }

  const mapsEnv = {
    staticKey: process.env.SERVER_GOOGLE_MAPS_STATIC_API_KEY || process.env.VITE_GOOGLE_MAPS_STATIC_API_KEY,
    geocodingKey: process.env.SERVER_GOOGLE_GEOCODING_API_KEY || process.env.VITE_GOOGLE_GEOCODING_API_KEY,
    placesKey: process.env.SERVER_GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY,
    solarApiKey: process.env.SERVER_GOOGLE_SOLAR_API_KEY || process.env.VITE_SOLAR_API_KEY
  };

  for (const [key, value] of Object.entries(mapsEnv)) {
    if (value) {
      next.googleMaps[key] = value;
    }
  }

  const googleServiceAccountJson =
    process.env.SERVER_GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (googleServiceAccountJson) {
    try {
      const parsed = JSON.parse(googleServiceAccountJson);
      next.googleServiceAccount.clientEmail = parsed.client_email ?? next.googleServiceAccount.clientEmail;
      next.googleServiceAccount.privateKey = parsed.private_key ?? next.googleServiceAccount.privateKey;
    } catch (error) {
      console.warn('[server] Konnte GOOGLE_SERVICE_ACCOUNT_JSON nicht parsen:', error.message);
    }
  }

  next.googleServiceAccount.propertyUrl =
    process.env.SERVER_SEARCH_CONSOLE_PROPERTY_URL ||
    process.env.SEARCH_CONSOLE_PROPERTY_URL ||
    next.googleServiceAccount.propertyUrl;

  next.googleServiceAccount.analyticsPropertyId =
    process.env.SERVER_ANALYTICS_PROPERTY_ID ||
    process.env.ANALYTICS_PROPERTY_ID ||
    next.googleServiceAccount.analyticsPropertyId;

  next.ahrefs.apiToken = process.env.SERVER_AHREFS_API_TOKEN || next.ahrefs.apiToken;
  next.ahrefs.target = process.env.SERVER_AHREFS_TARGET || next.ahrefs.target;

  next.businessProfile.apiKey = process.env.SERVER_GMB_API_KEY || next.businessProfile.apiKey;
  next.businessProfile.accountName = process.env.SERVER_GMB_ACCOUNT_NAME || next.businessProfile.accountName;
  next.businessProfile.locationId = process.env.SERVER_GMB_LOCATION_ID || next.businessProfile.locationId;

  return next;
}

let apiKeyState = await loadApiKeys();
apiKeyState = applyEnvDefaults(apiKeyState);
await saveApiKeys(apiKeyState);

const baseOperationalTasks = [
  {
    id: 'ops-search-console-key',
    category: 'Technical',
    title: 'Search Console Zugriff einrichten',
    description:
      'Service-Account für Search Console freischalten und Property-URL im Admin-Dashboard hinterlegen.',
    owner: 'SEO Team',
    priority: 'hoch',
    status: 'open'
  },
  {
    id: 'ops-analytics-key',
    category: 'Technical',
    title: 'Google Analytics Zugriff konfigurieren',
    description: 'GA4 Property-ID und Service-Account im Admin-Dashboard aktualisieren.',
    owner: 'Data Team',
    priority: 'mittel',
    status: 'open'
  },
  {
    id: 'ops-ahrefs-key',
    category: 'Backlinks',
    title: 'Ahrefs API Token hinterlegen',
    description: 'Gültigen Ahrefs-Token und Ziel-Domain eintragen, um Backlink-Daten abzurufen.',
    owner: 'SEO Team',
    priority: 'hoch',
    status: 'open'
  },
  {
    id: 'ops-gmb-key',
    category: 'Reviews',
    title: 'Google Business Profile API verbinden',
    description: 'API Key + Location ID im Admin-Dashboard speichern, damit Rezensionen synchronisiert werden.',
    owner: 'Customer Success',
    priority: 'mittel',
    status: 'open'
  }
];

function generateMissingKeyTasks(state) {
  const tasks = [...baseOperationalTasks];

  if (state.gemini.apiKey) {
    const geminiIndex = tasks.findIndex((task) => task.id === 'ops-gemini-key');
    if (geminiIndex >= 0) {
      tasks.splice(geminiIndex, 1);
    }
  } else if (!tasks.some((task) => task.id === 'ops-gemini-key')) {
    tasks.push({
      id: 'ops-gemini-key',
      category: 'Content',
      title: 'Gemini API Key hinterlegen',
      description: 'Vertex AI API Key eintragen, um KI-Empfehlungen im Dashboard zu aktivieren.',
      owner: 'Growth Team',
      priority: 'mittel',
      status: 'open'
    });
  }

  const mapped = {
    searchConsoleConfigured: Boolean(
      state.googleServiceAccount.clientEmail &&
        state.googleServiceAccount.privateKey &&
        state.googleServiceAccount.propertyUrl
    ),
    analyticsConfigured: Boolean(
      state.googleServiceAccount.clientEmail &&
        state.googleServiceAccount.privateKey &&
        state.googleServiceAccount.analyticsPropertyId
    ),
    ahrefsConfigured: Boolean(state.ahrefs.apiToken && state.ahrefs.target),
    businessProfileConfigured: Boolean(state.businessProfile.apiKey && state.businessProfile.locationId)
  };

  return tasks
    .filter((task) => {
      if (task.id === 'ops-search-console-key') return !mapped.searchConsoleConfigured;
      if (task.id === 'ops-analytics-key') return !mapped.analyticsConfigured;
      if (task.id === 'ops-ahrefs-key') return !mapped.ahrefsConfigured;
      if (task.id === 'ops-gmb-key') return !mapped.businessProfileConfigured;
      return true;
    })
    .map((task) => ({
      ...task,
      dueDate: task.dueDate ?? null,
      evidenceHint:
        task.evidenceHint ??
        'Bitte entsprechenden Zugriffsnachweis (Screenshot oder Link) nachtragen, sobald erledigt.'
    }));
}

function buildIssues(results) {
  const issues = [];

  if (results.searchConsole.status !== 'ok') {
    issues.push({
      area: 'Search Console',
      level: results.searchConsole.status === 'missing-config' ? 'error' : 'warning',
      message:
        results.searchConsole.message ||
        'Search Console Daten konnten nicht geladen werden. Konfiguration prüfen.'
    });
  }

  if (results.analytics.status !== 'ok') {
    issues.push({
      area: 'Analytics',
      level: results.analytics.status === 'missing-config' ? 'error' : 'warning',
      message:
        results.analytics.message ||
        'Analytics Daten konnten nicht geladen werden. Bitte Property ID & Service Account prüfen.'
    });
  }

  if (results.ahrefs.status !== 'ok') {
    issues.push({
      area: 'Backlinks (Ahrefs)',
      level: results.ahrefs.status === 'missing-config' ? 'error' : 'warning',
      message:
        results.ahrefs.message || 'Backlink-Daten nicht verfügbar. Token und Ziel-Domain prüfen.'
    });
  }

  if (results.businessProfile.status !== 'ok') {
    issues.push({
      area: 'Google Business Profile',
      level: results.businessProfile.status === 'missing-config' ? 'error' : 'warning',
      message:
        results.businessProfile.message || 'Business Profile Daten nicht verfügbar. API Key & Location prüfen.'
    });
  }

  return issues;
}

function buildMonitoring(searchConsole, ahrefs) {
  return {
    lastRun: new Date().toISOString(),
    domainAuthority: ahrefs.summary?.domainRating ?? null,
    totalBacklinks: ahrefs.summary?.newBacklinks || ahrefs.summary?.lostBacklinks
      ? (ahrefs.summary?.totalBacklinks ?? null)
      : null,
    newBacklinks30d: ahrefs.summary?.newBacklinks ?? null,
    lostBacklinks30d: ahrefs.summary?.lostBacklinks ?? null,
    averagePosition: searchConsole.summary?.averagePosition ?? null,
    topTenRatio: searchConsole.summary?.topTenRatio ?? null,
    aiSearchMentions: null,
    coreWebVitals: {
      overall: 'unknown',
      lcp: null,
      fid: null,
      cls: null
    }
  };
}

function buildTraffic(analytics) {
  if (!analytics.monthlyVisitors?.length) return [];
  return analytics.monthlyVisitors.map((entry) => {
    const monthLabel = entry.month
      ? entry.month
      : `${entry.year ?? ''}-${String(entry.monthIndex ?? '').padStart(2, '0')}`;
    const actual = entry.totalUsers ?? 0;
    return {
      month: monthLabel,
      estimatedVisitors: Math.round(actual * 1.05),
      actualVisitors: actual
    };
  });
}

function buildRankings(searchConsole) {
  if (!searchConsole.pages?.length) return [];
  const totalClicks = searchConsole.summary?.clicks ?? 0;
  return searchConsole.pages.map((row) => {
    const url = row.keys?.[0] ?? '';
    const pageTitle = url.replace(/^https?:\/\//, '');
    const clicks = row.clicks ?? 0;
    return {
      page: pageTitle,
      url,
      keywordFocus: searchConsole.pageQuery?.find((item) => item.keys?.[1] === url)?.keys?.[0] ?? '—',
      position: row.position ?? null,
      change: null,
      trafficShare: totalClicks ? clicks / totalClicks : null
    };
  });
}

function buildKeywordPerformance(searchConsole) {
  if (!searchConsole.queries?.length) return [];
  const maxImpressions = Math.max(
    ...searchConsole.queries.map((row) => row.impressions ?? 0),
    1
  );
  return searchConsole.queries.map((row) => {
    const impressions = row.impressions ?? 0;
    const ctr = row.ctr ?? 0;
    return {
      keyword: row.keys?.[0] ?? '—',
      searchVolume: impressions,
      position: row.position ?? null,
      clickRate: ctr,
      trend: impressions / maxImpressions > 0.6 ? 'up' : impressions / maxImpressions < 0.3 ? 'down' : 'flat'
    };
  });
}

function buildSeoSuggestions(issues) {
  if (!issues.length) {
    return [
      {
        id: 'seo-health-ok',
        type: 'Content',
        title: 'Überwachung aktiv',
        description: 'Alle Datenquellen liefern Werte. Fortlaufend optimieren und neue Inhalte einplanen.',
        impact: 'mittel',
        effort: 'mittel',
        owner: 'SEO Team'
      }
    ];
  }

  return issues.map((issue, index) => ({
    id: `issue-${index}`,
    type: issue.area,
    title: `Datenquelle prüfen: ${issue.area}`,
    description: issue.message,
    impact: issue.level === 'error' ? 'hoch' : 'mittel',
    effort: 'mittel',
    owner: 'Operations'
  }));
}

function buildPortalAlerts(businessProfile) {
  if (businessProfile.status !== 'ok') {
    return [
      {
        portal: 'Google Business Profile',
        country: 'DE',
        status: 'Fehlt',
        priority: 'hoch',
        issue: businessProfile.message ?? 'Kein Zugriff auf Business Profile.',
        lastChecked: new Date().toISOString(),
        recommendedAction: 'API Key & Location ID im Admin-Dashboard prüfen.'
      }
    ];
  }

  return [
    {
      portal: businessProfile.profile?.name ?? 'Google Business Profile',
      country: businessProfile.profile?.storefrontAddress?.regionCode ?? 'DE',
      status: 'OK',
      priority: 'mittel',
      issue: 'Profil synchronisiert. Rezensionen regelmäßig prüfen.',
      lastChecked: new Date().toISOString(),
      recommendedAction: 'Antwortzeiten < 24h sicherstellen und neue Fotos hochladen.'
    }
  ];
}

function buildDashboardPayload(results, tasks) {
  const monitoring = buildMonitoring(results.searchConsole, results.ahrefs);
  const traffic = buildTraffic(results.analytics);
  const rankings = buildRankings(results.searchConsole);
  const keywordPerformance = buildKeywordPerformance(results.searchConsole);
  const issues = buildIssues(results);
  const seoSuggestions = buildSeoSuggestions(issues);
  const portalAlerts = buildPortalAlerts(results.businessProfile);

  return {
    data: {
      monitoring,
      traffic,
      rankings,
      keywordPerformance,
      seoSuggestions,
      portalAlerts,
      tasks
    },
    issues,
    services: {
      searchConsole: results.searchConsole.status,
      analytics: results.analytics.status,
      ahrefs: results.ahrefs.status,
      businessProfile: results.businessProfile.status
    }
  };
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/admin/api-keys', (_req, res) => {
  const summary = summariseKeys(apiKeyState);
  const tasks = generateMissingKeyTasks(apiKeyState);
  res.json({ services: summary, tasks });
});

app.post('/api/admin/api-keys', async (req, res) => {
  const { service, payload } = req.body ?? {};
  if (!service || typeof service !== 'string') {
    return res.status(400).json({ success: false, message: 'Service Bezeichnung fehlt.' });
  }

  let normalisedPayload = payload ?? {};

  if (service === 'googleServiceAccount' && typeof payload?.serviceAccountJson === 'string') {
    try {
      const parsed = JSON.parse(payload.serviceAccountJson);
      normalisedPayload = {
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key,
        propertyUrl: payload.propertyUrl ?? apiKeyState.googleServiceAccount.propertyUrl,
        analyticsPropertyId:
          payload.analyticsPropertyId ?? apiKeyState.googleServiceAccount.analyticsPropertyId
      };
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Service-Account JSON ungültig: ${error.message}`
      });
    }
  }

  if (service === 'googleServiceAccount' && typeof payload?.privateKey === 'string') {
    normalisedPayload = {
      ...normalisedPayload,
      privateKey: payload.privateKey
    };
  }

  apiKeyState = updateService(apiKeyState, service, normalisedPayload);
  apiKeyState = await saveApiKeys(apiKeyState);

  res.json({ success: true, services: summariseKeys(apiKeyState) });
});

app.get('/api/dashboard/metrics', async (_req, res) => {
  const [searchConsole, analytics, ahrefs, businessProfile] = await Promise.all([
    fetchSearchConsoleData(apiKeyState),
    fetchAnalyticsData(apiKeyState),
    fetchAhrefsData(apiKeyState),
    fetchBusinessProfile(apiKeyState)
  ]);

  const tasks = generateMissingKeyTasks(apiKeyState);
  const payload = buildDashboardPayload(
    { searchConsole, analytics, ahrefs, businessProfile },
    tasks
  );
  res.json(payload);
});

app.listen(PORT, () => {
  console.log(`Admin API Server läuft auf Port ${PORT}`);
});
