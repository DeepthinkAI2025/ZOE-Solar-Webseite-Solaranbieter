import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
import { fetchMonitoringSummary } from './services/monitoringFeed.js';

// Content Management Routes
import contentRoutes from './routes/contentRoutes.js';

// Admin Authentication Routes
import authRoutes from './routes/authRoutes.js';

// Image Management Routes
import imageRoutes from './routes/imageRoutes.js';

// Blog Scheduling Routes
import schedulingRoutes from './routes/schedulingRoutes.js';

// Content Management Routes
import contentManagementRoutes from './routes/contentManagementRoutes.js';

// Knowledge Base Routes
import knowledgeRoutes from './routes/knowledgeRoutes.js';

// Customer Management Routes
import customerManagementRoutes from './routes/customerManagementRoutes.js';

// Advertisement Management Routes
import advertisementRoutes from './routes/advertisementRoutes.js';

// Test Routes for n8n Integration
import testRoutes from './routes/testRoutes.js';

// Product Management Routes
import productRoutes from './routes/simpleProductRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

// Performance: Statische Assets mit optimalen Caching-Headern ausliefern
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (/\.(js|css|png|jpg|jpeg|webp|svg|gif|woff2?|ttf|eot)$/.test(path)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

const PORT = Number(process.env.PORT ?? 5001);

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function applyEnvDefaults(state) {
  const next = cloneState(state);
  const envOpenRouter = process.env.SERVER_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
  if (envOpenRouter) {
    next.openrouter.apiKey = envOpenRouter;
  }
  const envOpenRouterModel = process.env.SERVER_OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL;
  if (envOpenRouterModel) {
    next.openrouter.model = envOpenRouterModel;
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

  if (state.openrouter.apiKey) {
    const openrouterIndex = tasks.findIndex((task) => task.id === 'ops-openrouter-key');
    if (openrouterIndex >= 0) {
      tasks.splice(openrouterIndex, 1);
    }
  } else if (!tasks.some((task) => task.id === 'ops-gemini-key')) {
    tasks.push({
      id: 'ops-openrouter-key',
      category: 'Content',
      title: 'OpenRouter API Key hinterlegen',
      description: 'OpenRouter API Key (Mistral) eintragen, um KI-Empfehlungen im Dashboard zu aktivieren.',
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

// Content Management API Routes
app.use('/api/content', contentRoutes);

// Admin Authentication Routes
app.use('/api/admin', authRoutes);

// Image Management Routes
app.use('/api/admin', imageRoutes);

// Blog Scheduling Routes
app.use('/api/admin', schedulingRoutes);

// Content Management Routes
app.use('/api/admin', contentManagementRoutes);

// Knowledge Base Routes
app.use('/api/admin', knowledgeRoutes);

// Customer Management Routes
app.use('/api/admin', customerManagementRoutes);

// Advertisement Management Routes
app.use('/api/admin', advertisementRoutes);

// Test API Routes for n8n Integration
app.use('/api', testRoutes);

// Product Management API Routes
app.use('/api', productRoutes);


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

app.get('/api/monitoring/summary', async (req, res) => {
  try {
    const forceRefresh = req.query?.refresh === 'true';
    const summary = await fetchMonitoringSummary({ forceRefresh });
    res.json({
      availability: summary.availability,
      productionMw: summary.productionMw,
      alerts: summary.alerts,
      updatedAt: summary.updatedAt
    });
  } catch (error) {
    console.error('[server] Monitoring summary Fehler:', error);
    res.status(500).json({
      success: false,
      message: 'Monitoring-Daten derzeit nicht verfügbar.'
    });
  }
});

// SSR Handler für alle React-Routen (außer API)
app.get('*', async (req, res) => {
  try {
    // Dynamisches Import des SSR-Moduls
    const { render } = await import(path.resolve(__dirname, 'dist/server/server.js'));

    // Render die Seite server-seitig
    const { html, helmet } = render(req.originalUrl);

    // Lade die client-seitige index.html als Template
    const template = await import('fs').then(fs => fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8'));

    // Ersetze Platzhalter mit SSR-Content
    const finalHtml = template
      .replace('<!--ssr-head-->', `${helmet.title}${helmet.meta}${helmet.link}${helmet.script}`)
      .replace('<!--ssr-body-->', html);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
  } catch (error) {
    console.error('SSR Error:', error);
    // Fallback: Serviere die statische index.html
    const fallbackHtml = await import('fs').then(fs => fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8'));
    res.status(200).set({ 'Content-Type': 'text/html' }).end(fallbackHtml);
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT} mit SSR-Unterstützung`);
});
