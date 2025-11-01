import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero';
import {
  AdminApiKeyResponse,
  AdminDashboardData,
  AdminServiceSummary,
  ApiServiceKey,
  apiServiceKeys,
  DashboardApiResponse,
  DashboardIssue,
  DashboardServiceState,
  defaultOperationalTasks,
  emptyDashboardData
} from '../data/adminDashboard';

const heroData = {
  title: 'Mitarbeiter-Login & Admin-Dashboard',
  subtitle: 'Zentrale Steuerung für SEO, Backlinks und Portal-Health',
  description:
    'Greifen Sie auf das interne Monitoring von ZOE Solar zu: Rankings, Traffic, Backlinks und KI-Empfehlungen auf einen Blick. Nur für Mitarbeiter mit gültigen Zugangsdaten.',
  primaryCta: {
    text: 'Support kontaktieren',
    href: '/kontakt'
  },
  secondaryCta: {
    text: 'Passwort vergessen',
    href: '/kontakt?topic=support'
  },
  bgImage:
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920&auto=format&fit=crop',
  imageAlt: 'Analytics-Dashboard mit Solar-Monitoring'
};

type DashboardServiceKey = keyof DashboardApiResponse['services'];

interface ApiKeyFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'password' | 'textarea' | 'email';
  placeholder?: string;
  helper?: string;
}

type ApiKeyFormState = Record<ApiServiceKey, Record<string, string>>;

const serviceLabels: Record<ApiServiceKey, string> = {
  gemini: 'Gemini / Vertex AI',
  googleMaps: 'Google Maps & Solar APIs',
  googleServiceAccount: 'Google Service Account (Search Console & GA4)',
  ahrefs: 'Ahrefs (Backlinks)',
  businessProfile: 'Google Business Profile'
};

const serviceDescriptions: Record<ApiServiceKey, string> = {
  gemini: 'Aktiviert KI-Empfehlungen, Content-Automation und Analysen im Dashboard.',
  googleMaps: 'Wird für Satellitenbilder, Geocoding, Places-Suche und Solar-API genutzt.',
  googleServiceAccount: 'Stellt Service-Account-Zugriff für Search Console und Google Analytics 4 bereit.',
  ahrefs: 'Liefert Backlink- und Konkurrenzdaten für das Monitoring.',
  businessProfile: 'Synchronisiert Rezensionen und Standortstatus aus dem Google Business Profile.'
};

const dashboardServiceLabels: Record<DashboardServiceKey, string> = {
  searchConsole: 'Search Console',
  analytics: 'Google Analytics 4',
  ahrefs: 'Ahrefs',
  businessProfile: 'Google Business Profile'
};

const serviceStatusStyles: Record<DashboardServiceState, string> = {
  ok: 'border-green-200 bg-green-50 text-green-700',
  'missing-config': 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-red-200 bg-red-50 text-red-700'
};

const issueLevelStyles: Record<DashboardIssue['level'], string> = {
  error: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800'
};

const apiKeyFieldSchema: Record<ApiServiceKey, ApiKeyFieldConfig[]> = {
  gemini: [
    {
      name: 'apiKey',
      label: 'Gemini API Key',
      type: 'password',
      placeholder: 'AIza...'
    },
    {
      name: 'model',
      label: 'Modell-ID',
      type: 'text',
      placeholder: 'z. B. gemini-1.5-pro'
    }
  ],
  googleMaps: [
    {
      name: 'staticKey',
      label: 'Static Maps API Key',
      type: 'password',
      placeholder: 'AIza...'
    },
    {
      name: 'geocodingKey',
      label: 'Geocoding API Key',
      type: 'password',
      placeholder: 'AIza...'
    },
    {
      name: 'placesKey',
      label: 'Places API Key',
      type: 'password',
      placeholder: 'AIza...'
    },
    {
      name: 'solarApiKey',
      label: 'Solar API Key',
      type: 'password',
      placeholder: 'AIza...'
    }
  ],
  googleServiceAccount: [
    {
      name: 'clientEmail',
      label: 'Service-Account E-Mail',
      type: 'email',
      placeholder: 'service-account@project.iam.gserviceaccount.com'
    },
    {
      name: 'privateKey',
      label: 'Private Key',
      type: 'textarea',
      helper: 'Zeilenumbrüche bleiben erhalten.'
    },
    {
      name: 'propertyUrl',
      label: 'Search Console Property URL',
      type: 'text',
      placeholder: 'https://www.beispiel.de/'
    },
    {
      name: 'analyticsPropertyId',
      label: 'GA4 Property-ID',
      type: 'text',
      placeholder: 'properties/123456789'
    },
    {
      name: 'serviceAccountJson',
      label: 'Service-Account JSON (optional)',
      type: 'textarea',
      helper: 'Alternativ komplettes JSON einfügen, Felder werden automatisch übernommen.'
    }
  ],
  ahrefs: [
    {
      name: 'apiToken',
      label: 'Ahrefs API Token',
      type: 'password'
    },
    {
      name: 'target',
      label: 'Ziel-Domain',
      type: 'text',
      placeholder: 'https://www.beispiel.de'
    }
  ],
  businessProfile: [
    {
      name: 'apiKey',
      label: 'Google Business Profile API Key',
      type: 'password'
    },
    {
      name: 'accountName',
      label: 'Account Name',
      type: 'text',
      placeholder: 'accounts/123456789'
    },
    {
      name: 'locationId',
      label: 'Location ID',
      type: 'text',
      placeholder: 'locations/123456789'
    }
  ]
};

const getEmptyApiKeyForms = (): ApiKeyFormState => ({
  gemini: { apiKey: '', model: '' },
  googleMaps: { staticKey: '', geocodingKey: '', placesKey: '', solarApiKey: '' },
  googleServiceAccount: {
    clientEmail: '',
    privateKey: '',
    propertyUrl: '',
    analyticsPropertyId: '',
    serviceAccountJson: ''
  },
  ahrefs: { apiToken: '', target: '' },
  businessProfile: { apiKey: '', accountName: '', locationId: '' }
});

const getInitialApiKeySaving = (): Record<ApiServiceKey, boolean> => ({
  gemini: false,
  googleMaps: false,
  googleServiceAccount: false,
  ahrefs: false,
  businessProfile: false
});

const getInitialApiKeyMessages = (): Record<
  ApiServiceKey,
  { type: 'success' | 'error'; text: string } | null
> => ({
  gemini: null,
  googleMaps: null,
  googleServiceAccount: null,
  ahrefs: null,
  businessProfile: null
});

const formatNumber = (value: number | null | undefined, options?: Intl.NumberFormatOptions) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return value.toLocaleString('de-DE', options);
};

const formatPercent = (value: number | null | undefined, fractionDigits = 0) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return `${(value * 100).toFixed(fractionDigits)}%`;
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
};

const MitarbeiterLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, AdminDashboardData['tasks'][number]['status']>>({});
  const [taskChecks, setTaskChecks] = useState<Record<string, string | undefined>>({});
  const [taskEvidence, setTaskEvidence] = useState<Record<string, string>>({});
  const [taskMessages, setTaskMessages] = useState<
    Record<string, { type: 'success' | 'error'; text: string } | null>
  >({});
  const [taskProcessing, setTaskProcessing] = useState<Record<string, boolean>>({});
  const [dashboardIssues, setDashboardIssues] = useState<DashboardIssue[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<DashboardApiResponse['services'] | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [apiSummaryError, setApiSummaryError] = useState<string | null>(null);
  const [apiServiceSummary, setApiServiceSummary] = useState<AdminServiceSummary | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [apiKeyForms, setApiKeyForms] = useState<ApiKeyFormState>(getEmptyApiKeyForms());
  const [apiKeySaving, setApiKeySaving] = useState<Record<ApiServiceKey, boolean>>(
    getInitialApiKeySaving()
  );
  const [apiKeyMessages, setApiKeyMessages] = useState<
    Record<ApiServiceKey, { type: 'success' | 'error'; text: string } | null
  >(getInitialApiKeyMessages());

  const averageTrafficDelta = useMemo(() => {
    if (!dashboardData || !dashboardData.traffic.length) {
      return null;
    }

    const totals = dashboardData.traffic.reduce(
      (acc, month) => {
        const estimated = month.estimatedVisitors ?? 0;
        const actual = month.actualVisitors ?? 0;
        return {
          estimated: acc.estimated + estimated,
          actual: acc.actual + actual
        };
      },
      { estimated: 0, actual: 0 }
    );

    if (totals.estimated === 0) {
      return null;
    }

    return (totals.actual - totals.estimated) / totals.estimated;
  }, [dashboardData]);

  const configuredEmail = (import.meta.env.VITE_EMPLOYEE_LOGIN_EMAIL as string | undefined)?.trim();
  const configuredPassword = (import.meta.env.VITE_EMPLOYEE_LOGIN_PASSWORD as string | undefined)?.trim();
  const expectedEmail = (configuredEmail && configuredEmail.length > 0
    ? configuredEmail
    : 'zukunftsorientierte.energie@gmail.com'
  ).toLowerCase();
  const expectedPassword = configuredPassword && configuredPassword.length > 0
    ? configuredPassword
    : 'ZOE.seo2026!';

  const rawBaseUrl = (import.meta.env.VITE_ADMIN_API_BASE_URL as string | undefined)?.trim();
  const apiBaseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '') : '';

  const resolveApiUrl = useCallback(
    (path: string) => {
      const normalisedPath = path.startsWith('/') ? path : `/${path}`;
      return apiBaseUrl ? `${apiBaseUrl}${normalisedPath}` : normalisedPath;
    },
    [apiBaseUrl]
  );

  const fetchJson = useCallback(
    async <T,>(path: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers ?? {});
      if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(resolveApiUrl(path), {
        ...options,
        headers
      });

      if (!response.ok) {
        let message = `Anfrage fehlgeschlagen (${response.status})`;
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.message === 'string') {
            message = errorBody.message;
          }
        } catch {
          try {
            const textBody = await response.text();
            if (textBody) {
              message = textBody;
            }
          } catch {
            // ignorieren, wir behalten die Standardfehlermeldung
          }
        }

        throw new Error(message);
      }

      return response.json() as Promise<T>;
    },
    [resolveApiUrl]
  );

  const fetchDashboardMetrics = useCallback(async () => {
    const response = await fetchJson<DashboardApiResponse>('/api/dashboard/metrics');
    setDashboardData(response.data);
    setDashboardIssues(response.issues ?? []);
    setServiceStatuses(response.services);
    return response;
  }, [fetchJson]);

  const fetchApiKeySummary = useCallback(async () => {
    const response = await fetchJson<AdminApiKeyResponse>('/api/admin/api-keys');
    setApiServiceSummary(response.services);
    return response;
  }, [fetchJson]);

  const loadAdminResources = useCallback(async () => {
    setIsLoadingDashboard(true);
    setDashboardError(null);
    setApiSummaryError(null);
    setApiKeyMessages(getInitialApiKeyMessages());

    const summaryPromise = fetchApiKeySummary().catch((error) => {
      console.error('[Admin Dashboard] API-Key-Zusammenfassung fehlgeschlagen', error);
      setApiSummaryError(
        error instanceof Error
          ? error.message
          : 'API-Key-Zusammenfassung konnte nicht geladen werden.'
      );
      return null;
    });

    const metricsPromise = fetchDashboardMetrics().catch((error) => {
      console.error('[Admin Dashboard] Kennzahlen konnten nicht geladen werden', error);
      return null;
    });

    const [summaryData, metricsData] = await Promise.all([summaryPromise, metricsPromise]);

    if (!metricsData) {
      const fallbackTasks = summaryData?.tasks ?? defaultOperationalTasks;
      setDashboardData({
        ...emptyDashboardData,
        tasks: fallbackTasks
      });
      setDashboardIssues([]);
      setServiceStatuses(null);
      setDashboardError(
        'Echtzeit-Daten konnten nicht geladen werden. Es werden Platzhalterdaten angezeigt.'
      );
    }

    if (!summaryData) {
      setApiServiceSummary(null);
    }

    setApiKeyForms(getEmptyApiKeyForms());
    setApiKeySaving(getInitialApiKeySaving());
    setIsLoadingDashboard(false);
  }, [fetchApiKeySummary, fetchDashboardMetrics]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Input Validation
    if (!email.trim() || !password.trim()) {
      setError('Bitte geben Sie E-Mail und Passwort ein.');
      return;
    }

    setIsSubmitting(true);
    try {
      // JWT Authentication über neues Backend-API
      const response = await fetchJson<{ success: boolean; data: { session: any; token: string } }>(
        '/api/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password.trim()
          })
        }
      );

      if (response.success && response.data?.token) {
        // Token sicher speichern
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminSession', JSON.stringify(response.data.session));
        
        // Authentifizierung erfolgreich - Dashboard laden
        await loadAdminResources();
        setIsAuthenticated(true);
        
        console.log('[AUTH] Login erfolgreich für', email);
      } else {
        throw new Error('Ungültige Antwort vom Server erhalten');
      }
    } catch (error) {
      console.error('[AUTH] Login fehlgeschlagen:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login fehlgeschlagen';
      
      if (errorMessage.includes('Invalid email or password')) {
        setError('Ungültige Zugangsdaten. Bitte prüfen Sie E-Mail und Passwort.');
      } else if (errorMessage.includes('MISSING_CREDENTIALS')) {
        setError('E-Mail und Passwort sind erforderlich.');
      } else {
        setError(`Login fehlgeschlagen: ${errorMessage}`);
      }
      
      // Tokens bei Fehler löschen
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminSession');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApiKeyInputChange = (service: ApiServiceKey, field: string, value: string) => {
    setApiKeyForms((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
    setApiKeyMessages((prev) => ({
      ...prev,
      [service]: null
    }));
  };

  const handleApiKeyReset = (service: ApiServiceKey) => {
    setApiKeyForms((prev) => {
      const current = prev[service] ?? {};
      const cleared = Object.keys(current).reduce<Record<string, string>>((acc, key) => {
        acc[key] = '';
        return acc;
      }, {});
      return {
        ...prev,
        [service]: cleared
      };
    });
    setApiKeyMessages((prev) => ({
      ...prev,
      [service]: null
    }));
  };

  const handleApiKeySubmit = async (service: ApiServiceKey) => {
    const formValues = apiKeyForms[service] ?? {};
    const payloadEntries = Object.entries(formValues).filter(([, value]) =>
      typeof value === 'string' ? value.trim().length > 0 : false
    );

    if (!payloadEntries.length) {
      setApiKeyMessages((prev) => ({
        ...prev,
        [service]: {
          type: 'error',
          text: 'Bitte mindestens ein Feld ausfüllen, bevor gespeichert wird.'
        }
      }));
      return;
    }

    setApiKeySaving((prev) => ({
      ...prev,
      [service]: true
    }));

    setApiKeyMessages((prev) => ({
      ...prev,
      [service]: null
    }));

    try {
      const response = await fetchJson<AdminApiKeyResponse>('/api/admin/api-keys', {
        method: 'POST',
        body: JSON.stringify({
          service,
          payload: Object.fromEntries(payloadEntries)
        })
      });

      setApiServiceSummary(response.services);
      setApiKeyMessages((prev) => ({
        ...prev,
        [service]: {
          type: 'success',
          text: 'Konfiguration gespeichert. Backend synchronisiert neu.'
        }
      }));

      setApiKeyForms((prev) => {
        const current = prev[service] ?? {};
        const cleared = Object.keys(current).reduce<Record<string, string>>((acc, key) => {
          acc[key] = '';
          return acc;
        }, {});
        return {
          ...prev,
          [service]: cleared
        };
      });

      try {
        await fetchDashboardMetrics();
      } catch (error) {
        console.error('[Admin Dashboard] Aktualisierung nach Speichern fehlgeschlagen', error);
        setDashboardError(
          'Speichern erfolgreich, aber die Aktualisierung schlug fehl. Bitte Dashboard neu laden.'
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Speichern fehlgeschlagen.';
      setApiKeyMessages((prev) => ({
        ...prev,
        [service]: {
          type: 'error',
          text: message
        }
      }));
    } finally {
      setApiKeySaving((prev) => ({
        ...prev,
        [service]: false
      }));
    }
  };

  useEffect(() => {
    const tasks = dashboardData?.tasks ?? [];

    if (tasks.length) {
      setTaskStatuses(Object.fromEntries(tasks.map((task) => [task.id, task.status])));
      setTaskChecks(Object.fromEntries(tasks.map((task) => [task.id, task.lastChecked])));
    } else {
      setTaskStatuses({});
      setTaskChecks({});
    }

    setTaskEvidence({});
    setTaskMessages({});
    setTaskProcessing({});
  }, [dashboardData]);

  const handleTaskVerification = (taskId: string) => {
    if (!dashboardData) return;
    const evidence = taskEvidence[taskId];
    if (!evidence || evidence.trim().length < 5) {
      setTaskMessages((prev) => ({
        ...prev,
        [taskId]: {
          type: 'error',
          text: 'Bitte einen kurzen Nachweis (z. B. Link oder Notiz) hinterlegen, bevor die KI prüft.'
        }
      }));
      return;
    }

    setTaskProcessing((prev) => ({ ...prev, [taskId]: true }));
    setTaskStatuses((prev) => ({ ...prev, [taskId]: 'checking' }));
    setTaskMessages((prev) => ({
      ...prev,
      [taskId]: {
        type: 'success',
        text: 'KI-Prüfung wurde gestartet …'
      }
    }));

    window.setTimeout(() => {
      const timestamp = new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
      setTaskProcessing((prev) => ({ ...prev, [taskId]: false }));
      setTaskStatuses((prev) => ({ ...prev, [taskId]: 'completed' }));
      setTaskChecks((prev) => ({ ...prev, [taskId]: timestamp }));
      setTaskMessages((prev) => ({
        ...prev,
        [taskId]: {
          type: 'success',
          text: `KI hat den Nachweis bestätigt. Aufgabe am ${timestamp} abgeschlossen.`
        }
      }));
    }, 1400);
  };

  const resetTaskToOpen = (taskId: string) => {
    setTaskStatuses((prev) => ({ ...prev, [taskId]: 'open' }));
    setTaskChecks((prev) => ({ ...prev, [taskId]: undefined }));
    setTaskMessages((prev) => ({
      ...prev,
      [taskId]: {
        type: 'error',
        text: 'Aufgabe wurde zurückgesetzt. Bitte erneut mit aktuellem Nachweis abschließen.'
      }
    }));
  };

  const renderLoginForm = () => (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Internes Mitarbeiter-Login</h2>
      <p className="text-slate-600 mb-8">
        Melden Sie sich mit Ihren ZOE Solar Zugangsdaten an, um das Admin-Dashboard aufzurufen. Bei Fragen steht der SEO-Support bereit.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Unternehmens-E-Mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="z.B. admin@zoe-solar.de"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            Passwort
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ihr Mitarbeiter-Passwort"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
            >
              {showPassword ? 'Verbergen' : 'Anzeigen'}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center items-center gap-2 bg-green-600 text-white font-semibold rounded-xl py-3.5 hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting && (
            <span className="h-4 w-4 border-2 border-white border-b-transparent rounded-full animate-spin"></span>
          )}
          Login starten
        </button>
      </form>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-600">
        <button
          type="button"
          className="underline hover:text-green-600 text-left"
          onClick={() => setError('Bitte wenden Sie sich an support@zoe-solar.de für einen Passwort-Reset.')}
        >
          Passwort vergessen?
        </button>
        <div className="bg-slate-100 rounded-xl px-4 py-2">
          <span className="font-medium text-slate-700">Hinweis:</span> Zugriff ausschließlich für SEO & Growth Team.
        </div>
      </div>
    </div>
  );

  const renderSystemStatus = () => {
    if (!isAuthenticated) return null;

    const serviceEntries = serviceStatuses
      ? (Object.entries(serviceStatuses) as Array<[DashboardServiceKey, DashboardServiceState]>).sort(
          (a, b) => a[0].localeCompare(b[0])
        )
      : [];
    const hasServiceEntries = serviceEntries.length > 0;
    const hasIssues = dashboardIssues.length > 0;
    const hasMessages = Boolean(dashboardError || apiSummaryError);

    return (
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <header className="px-6 py-5 border-b border-slate-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Systemstatus & Backend-Synchronisierung</h3>
            <p className="text-slate-600">
              Überblick über angebundene Datenquellen, Backend-Verbindungen und aktuelle Meldungen.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {dashboardData?.monitoring.lastRun && (
              <span className="hidden md:inline-flex text-xs text-slate-500">
                Letztes Update: {formatDateTime(dashboardData.monitoring.lastRun)}
              </span>
            )}
            <button
              type="button"
              onClick={() => void loadAdminResources()}
              disabled={isLoadingDashboard}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {isLoadingDashboard && (
                <span className="h-4 w-4 border-2 border-slate-500 border-b-transparent rounded-full animate-spin"></span>
              )}
              Neu laden
            </button>
          </div>
        </header>
        <div className="p-6 space-y-4">
          {dashboardError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {dashboardError}
            </div>
          )}
          {apiSummaryError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {apiSummaryError}
            </div>
          )}
          {hasServiceEntries && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {serviceEntries.map(([key, status]) => {
                const description =
                  status === 'ok'
                    ? 'Datenquelle liefert Werte.'
                    : status === 'missing-config'
                    ? 'Konfiguration unvollständig – bitte API Keys prüfen.'
                    : 'Abruf meldet einen Fehler. Logs & API Limits prüfen.';
                return (
                  <article
                    key={key}
                    className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${serviceStatusStyles[status]}`}
                  >
                    <h4 className="text-sm font-semibold">{dashboardServiceLabels[key]}</h4>
                    <p className="mt-1 text-xs leading-relaxed">{description}</p>
                  </article>
                );
              })}
            </div>
          )}
          {hasIssues && (
            <div className="space-y-2">
              {dashboardIssues.map((issue, index) => (
                <div
                  key={`${issue.area}-${index}`}
                  className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${issueLevelStyles[issue.level]}`}
                >
                  <strong className="block text-sm font-semibold">{issue.area}</strong>
                  <span className="mt-1 block text-xs leading-relaxed">{issue.message}</span>
                </div>
              ))}
            </div>
          )}
          {!hasServiceEntries && !hasIssues && !hasMessages && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              Alle Dienste liefern Daten. Backend-Synchronisierung aktiv.
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderApiKeyManager = () => {
    if (!isAuthenticated) return null;

    return (
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <header className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900">API-Key Verwaltung & Credentials</h3>
          <p className="text-slate-600">
            Hinterlegen oder aktualisieren Sie hier die Schlüssel für Gemini, Google-Dienste, Ahrefs und das Google Business Profile.
          </p>
        </header>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {apiServiceKeys.map((service) => {
            const summaryEntry = apiServiceSummary?.[service];
            const fields = apiKeyFieldSchema[service];
            const formState = apiKeyForms[service] ?? {};
            const isSaving = apiKeySaving[service];
            const message = apiKeyMessages[service];
            const hasInput = fields.some((field) => (formState[field.name] ?? '').trim().length > 0);
            const configuredTone = summaryEntry?.configured
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-600';

            const infoItems: Array<{ label: string; value: string | null }> = [];
            if (summaryEntry) {
              if (summaryEntry.mask) {
                infoItems.push({ label: 'Key (maskiert)', value: summaryEntry.mask });
              }
              if (service === 'gemini') {
                infoItems.push({ label: 'Modell', value: summaryEntry.model ?? '—' });
              }
              if (service === 'googleServiceAccount') {
                infoItems.push({ label: 'Client E-Mail', value: summaryEntry.clientEmail ?? '—' });
                infoItems.push({ label: 'Search Console Property', value: summaryEntry.propertyUrl ?? '—' });
                infoItems.push({ label: 'GA4 Property-ID', value: summaryEntry.analyticsPropertyId ?? '—' });
              }
              if (service === 'ahrefs') {
                infoItems.push({ label: 'Ziel-Domain', value: summaryEntry.target ?? '—' });
              }
              if (service === 'businessProfile') {
                infoItems.push({ label: 'Account', value: summaryEntry.accountName ?? '—' });
                infoItems.push({ label: 'Location ID', value: summaryEntry.locationId ?? '—' });
              }
              if (summaryEntry.lastUpdated) {
                infoItems.push({ label: 'Zuletzt aktualisiert', value: formatDateTime(summaryEntry.lastUpdated) });
              }
            }

            return (
              <article key={service} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-semibold text-slate-900">{serviceLabels[service]}</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${configuredTone}`}>
                      {summaryEntry?.configured ? 'Konfiguriert' : 'Fehlt'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{serviceDescriptions[service]}</p>
                  {infoItems.length > 0 && (
                    <dl className="mt-2 space-y-1 text-xs text-slate-600">
                      {infoItems.map((item) => (
                        <div key={`${service}-${item.label}`}>
                          <dt className="font-semibold text-slate-500">{item.label}</dt>
                          <dd className="text-slate-700">{item.value ?? '—'}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleApiKeySubmit(service);
                  }}
                >
                  <div className="grid grid-cols-1 gap-3">
                    {fields.map((field) => {
                      const value = formState[field.name] ?? '';
                      if (field.type === 'textarea') {
                        return (
                          <div key={field.name} className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-600">
                              {field.label}
                            </label>
                            <textarea
                              value={value}
                              onChange={(event) =>
                                handleApiKeyInputChange(service, field.name, event.target.value)
                              }
                              rows={field.name === 'privateKey' || field.name === 'serviceAccountJson' ? 4 : 3}
                              placeholder={field.placeholder}
                              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {field.helper && (
                              <p className="text-xs text-slate-500">{field.helper}</p>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div key={field.name} className="space-y-1">
                          <label className="block text-xs font-semibold text-slate-600">
                            {field.label}
                          </label>
                          <input
                            type={field.type ?? 'text'}
                            value={value}
                            onChange={(event) =>
                              handleApiKeyInputChange(service, field.name, event.target.value)
                            }
                            placeholder={field.placeholder}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {field.helper && (
                            <p className="text-xs text-slate-500">{field.helper}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={!hasInput || isSaving || isLoadingDashboard}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {isSaving && (
                        <span className="h-4 w-4 border-2 border-white border-b-transparent rounded-full animate-spin"></span>
                      )}
                      Speichern
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApiKeyReset(service)}
                      disabled={isSaving || isLoadingDashboard}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60"
                    >
                      Felder leeren
                    </button>
                  </div>
                  {message && (
                    <p
                      className={`text-xs ${
                        message.type === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {message.text}
                    </p>
                  )}
                  {!hasInput && (
                    <p className="text-xs text-slate-400">
                      Mindestens ein Feld ausfüllen, um Änderungen zu speichern.
                    </p>
                  )}
                </form>
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  const renderMonitoringSummary = () => {
    if (!dashboardData) return null;

    const monitoring = dashboardData.monitoring;
    const vitals = monitoring.coreWebVitals;
    const hasBacklinkDeltas =
      monitoring.newBacklinks30d !== null &&
      monitoring.newBacklinks30d !== undefined &&
      monitoring.lostBacklinks30d !== null &&
      monitoring.lostBacklinks30d !== undefined;
    const netBacklinks = hasBacklinkDeltas
      ? monitoring.newBacklinks30d - monitoring.lostBacklinks30d
      : null;

    const cards = [
      {
        label: 'Domain Authority',
        value: formatNumber(monitoring.domainAuthority),
        helper: 'Ziel: 80+',
        accent: 'bg-blue-100 text-blue-700'
      },
      {
        label: 'Backlinks gesamt',
        value: formatNumber(monitoring.totalBacklinks),
        helper:
          netBacklinks !== null
            ? `${netBacklinks >= 0 ? '+' : ''}${formatNumber(netBacklinks)} / 30 Tage`
            : 'Keine Daten verfügbar',
        accent: 'bg-green-100 text-green-700'
      },
      {
        label: 'Ø Ranking-Position',
        value: formatNumber(monitoring.averagePosition, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }),
        helper: `${formatPercent(monitoring.topTenRatio, 0)} in Top 10`,
        accent: 'bg-amber-100 text-amber-700'
      },
      {
        label: 'AI-Erwähnungen',
        value: formatNumber(monitoring.aiSearchMentions),
        helper: 'Letzte 30 Tage in ChatGPT, Bard & Co.',
        accent: 'bg-purple-100 text-purple-700'
      }
    ];

    const lcpLabel =
      vitals.lcp !== null && vitals.lcp !== undefined
        ? `${formatNumber(vitals.lcp, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}s`
        : '—';
    const fidLabel =
      vitals.fid !== null && vitals.fid !== undefined
        ? `${formatNumber(vitals.fid, { maximumFractionDigits: 0 })}ms`
        : '—';
    const clsLabel =
      vitals.cls !== null && vitals.cls !== undefined
        ? formatNumber(vitals.cls, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '—';

    const vitalsOverall =
      vitals.overall === 'good'
        ? '✅ gute Werte'
        : vitals.overall === 'unknown'
        ? 'ℹ️ keine Daten'
        : '⚠️ prüfen';

    return (
      <section className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">SEO Monitoring Snapshot</h2>
            <p className="text-slate-600">
              Letzter automatischer Crawl: {formatDateTime(monitoring.lastRun)}
            </p>
          </div>
          <div className="text-sm text-slate-500 bg-slate-100 rounded-full px-4 py-2">
            Core Web Vitals: {vitalsOverall} · LCP {lcpLabel} · FID {fidLabel} · CLS {clsLabel}
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col gap-3"
            >
              <span
                className={`inline-flex items-center w-fit px-3 py-1 text-xs font-semibold rounded-full ${card.accent}`}
              >
                {card.label}
              </span>
              <span className="text-3xl font-bold text-slate-900">{card.value}</span>
              <span className="text-sm text-slate-600">{card.helper}</span>
            </article>
          ))}
        </div>
      </section>
    );
  };

  const renderTrafficTable = () => {
    if (!dashboardData) return null;

    return (
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <header className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Traffic-Prognose vs. Realität</h3>
            <p className="text-slate-600">Vergleich geschätzter und tatsächlicher Besucher pro Monat</p>
          </div>
          <span className="text-sm text-slate-500 bg-slate-100 rounded-full px-3 py-1">
            Gesamt-Abweichung: {formatPercent(averageTrafficDelta, 1)}
          </span>
        </header>
        {dashboardData.traffic.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Keine Traffic-Daten vorhanden. Bitte Search Console / Analytics Konfiguration prüfen.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
                  <th className="px-6 py-4">Monat</th>
                  <th className="px-6 py-4">Geschätzter Traffic</th>
                  <th className="px-6 py-4">Tatsächlicher Traffic</th>
                  <th className="px-6 py-4">Differenz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {dashboardData.traffic.map((entry, index) => {
                  const estimated = entry.estimatedVisitors;
                  const actual = entry.actualVisitors;
                  const hasEstimated = estimated !== null && estimated !== undefined;
                  const hasActual = actual !== null && actual !== undefined;
                  const deltaValue = hasEstimated && hasActual ? actual - estimated : null;
                  const deltaPercent =
                    deltaValue !== null && hasEstimated && estimated !== 0
                      ? deltaValue / estimated
                      : null;
                  const badgeTone =
                    deltaValue === null
                      ? 'bg-slate-100 text-slate-600'
                      : deltaValue >= 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700';
                  const deltaLabel =
                    deltaValue === null
                      ? '—'
                      : `${
                          deltaValue > 0 ? '+' : deltaValue < 0 ? '−' : ''
                        }${formatNumber(Math.abs(deltaValue))}`;

                  return (
                    <tr key={entry.month ?? `traffic-${index}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{entry.month}</td>
                      <td className="px-6 py-4">{formatNumber(estimated)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{formatNumber(actual)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeTone}`}
                        >
                          {deltaLabel}
                          {deltaPercent !== null ? ` (${formatPercent(deltaPercent, 1)})` : ''}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  };

  const renderRankingTable = () => {
    if (!dashboardData) return null;

    const rankingPositions = dashboardData.rankings
      .map((entry) => entry.position)
      .filter((value): value is number => value !== null && value !== undefined);
    const overallAvg = rankingPositions.length
      ? rankingPositions.reduce((sum, item) => sum + item, 0) / rankingPositions.length
      : dashboardData.monitoring.averagePosition ?? null;

    const overallAvgLabel = overallAvg !== null ? formatNumber(overallAvg, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }) : '—';

    return (
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <header className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900">Ranking-Positionen pro Seite</h3>
          <p className="text-slate-600">Aktuelle Sichtbarkeit inkl. Veränderung zum Vormonat</p>
        </header>
        {dashboardData.rankings.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Keine Ranking-Daten verfügbar. Prüfen Sie die Search-Console-Konfiguration.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Seite</th>
                  <th className="px-6 py-3 text-left font-semibold">Ziel-Keyword</th>
                  <th className="px-6 py-3 text-center font-semibold">Position</th>
                  <th className="px-6 py-3 text-center font-semibold">Veränderung</th>
                  <th className="px-6 py-3 text-center font-semibold">Traffic-Anteil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {dashboardData.rankings.map((entry, index) => {
                  const positionLabel =
                    entry.position !== null && entry.position !== undefined
                      ? `#${formatNumber(entry.position, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1
                        })}`
                      : '—';
                  const changeValue =
                    entry.change !== null && entry.change !== undefined ? entry.change : null;
                  const changeTone =
                    changeValue === null
                      ? 'bg-slate-100 text-slate-600'
                      : changeValue > 0
                      ? 'bg-green-100 text-green-700'
                      : changeValue < 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-100 text-slate-600';
                  const changeLabel =
                    changeValue === null
                      ? '—'
                      : `${
                          changeValue > 0 ? '+' : changeValue < 0 ? '−' : ''
                        }${formatNumber(Math.abs(changeValue))}`;

                  return (
                    <tr key={entry.url ?? `ranking-${index}`} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        {entry.url ? (
                          <a
                            href={entry.url}
                            className="font-semibold text-green-700 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {entry.page}
                          </a>
                        ) : (
                          <span className="font-semibold text-slate-900">{entry.page}</span>
                        )}
                      </td>
                      <td className="px-6 py-3">{entry.keywordFocus ?? '—'}</td>
                      <td className="px-6 py-3 text-center font-semibold text-slate-900">
                        {positionLabel}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${changeTone}`}
                        >
                          {changeLabel}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        {formatPercent(entry.trafficShare, 1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-slate-600">
                    Durchschnittliche Position aller gelisteten Seiten:{' '}
                    <span className="font-semibold text-slate-900">{overallAvgLabel}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    );
  };

  const renderKeywordPerformance = () => {
    if (!dashboardData) return null;

    return (
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <header className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Beste Keywords</h3>
            <p className="text-slate-600">Top-Suchbegriffe nach Position, Suchvolumen und CTR</p>
          </div>
          <span className="text-sm text-slate-500">Datengrundlage: GSC & SEO-Monitoring (letzte 30 Tage)</span>
        </header>
        {dashboardData.keywordPerformance.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Keine Keyword-Performance-Daten verfügbar. Search Console Zugriff prüfen.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {dashboardData.keywordPerformance.map((keyword) => {
              const positionLabel =
                keyword.position !== null && keyword.position !== undefined
                  ? `#${formatNumber(keyword.position, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1
                    })}`
                  : '—';
              const searchVolumeLabel = formatNumber(keyword.searchVolume);
              const ctrLabel = formatPercent(keyword.clickRate, 0);
              const potential =
                keyword.position !== null && keyword.position !== undefined
                  ? keyword.position <= 3
                    ? 'Sehr hoch'
                    : keyword.position <= 10
                    ? 'Optimierbar'
                    : 'Verbessern'
                  : 'Unbekannt';

              const trendBadge =
                keyword.trend === 'up'
                  ? { tone: 'bg-green-100 text-green-700', label: 'Trend ↑' }
                  : keyword.trend === 'down'
                  ? { tone: 'bg-red-100 text-red-700', label: 'Trend ↓' }
                  : { tone: 'bg-slate-100 text-slate-600', label: 'Stabil' };

              return (
                <article
                  key={keyword.keyword}
                  className="border border-slate-200 rounded-2xl p-5 bg-slate-50/60"
                >
                  <header className="flex items-center justify-between gap-2 mb-3">
                    <h4 className="text-lg font-semibold text-slate-900">{keyword.keyword}</h4>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${trendBadge.tone}`}
                    >
                      {trendBadge.label}
                    </span>
                  </header>
                  <dl className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                      <dt className="font-medium text-slate-600">Position</dt>
                      <dd className="text-lg font-semibold text-slate-900">{positionLabel}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Suchvolumen</dt>
                      <dd>{searchVolumeLabel}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">CTR</dt>
                      <dd>{ctrLabel}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Potenzial</dt>
                      <dd>{potential}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  const renderSeoSuggestions = () => {
    if (!dashboardData) return null;

    return (
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <header className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900">KI-gestützte SEO-Empfehlungen</h3>
          <p className="text-slate-600">Priorisierte Maßnahmen basierend auf Monitoring-Daten und KI-Auswertungen</p>
        </header>
        {dashboardData.seoSuggestions.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Keine KI-Empfehlungen aktiv. Sobald alle Datenquellen liefern, werden hier Prioritäten angezeigt.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
            {dashboardData.seoSuggestions.map((suggestion) => (
              <article key={suggestion.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
                    {suggestion.type}
                  </span>
                  <span className="text-xs font-semibold inline-flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        suggestion.impact === 'hoch'
                          ? 'bg-green-100 text-green-700'
                          : suggestion.impact === 'mittel'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      Impact: {suggestion.impact}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                      Aufwand: {suggestion.effort}
                    </span>
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{suggestion.title}</h4>
                <p className="text-sm text-slate-600 mb-4">{suggestion.description}</p>
                <footer className="flex items-center justify-between text-xs text-slate-500">
                  <span>Owner: {suggestion.owner}</span>
                  {suggestion.dueDate && <span>Frist: {suggestion.dueDate}</span>}
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderPortalAlerts = () => {
    if (!dashboardData) return null;

    const openAlerts = dashboardData.portalAlerts.filter((alert) => alert.status !== 'OK').length;

    return (
      <section className="bg-white border border-amber-200 rounded-3xl shadow-sm">
        <header className="px-6 py-5 border-b border-amber-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-amber-50">
          <div>
            <h3 className="text-xl font-semibold text-amber-900">Portal- und Branchenmonitoring</h3>
            <p className="text-amber-700">
              KI-Scanner meldet fehlende oder fehlerhafte Daten in Branchenbüchern und Portalen.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-amber-800 bg-white rounded-full px-3 py-1 border border-amber-200">
            {openAlerts} offene Aufgaben
          </span>
        </header>
        {dashboardData.portalAlerts.length === 0 ? (
          <div className="p-6 text-sm text-amber-800">
            Keine Portal-Warnungen. Alle Standorte wirken aktuell synchronisiert.
          </div>
        ) : (
          <div className="divide-y divide-amber-100">
            {dashboardData.portalAlerts.map((alert, index) => {
              const statusTone =
                alert.status === 'OK'
                  ? 'bg-green-100 text-green-700'
                  : alert.status === 'Fehlt'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-700';

              return (
                <article
                  key={`${alert.portal}-${alert.country}-${index}`}
                  className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      {alert.portal}
                      <span className="text-xs font-medium uppercase text-slate-500">
                        {alert.country ?? '—'}
                      </span>
                    </h4>
                    <p className="text-sm text-slate-600">{alert.issue}</p>
                    <p className="text-xs text-slate-500">
                      Zuletzt geprüft: {formatDateTime(alert.lastChecked)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusTone}`}
                    >
                      {alert.status}
                    </span>
                    <span className="text-xs font-semibold inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      Priorität: {alert.priority}
                    </span>
                    <span className="text-sm text-slate-700 max-w-xs">
                      {alert.recommendedAction ?? 'Keine Aktion hinterlegt.'}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  const renderTaskBoard = () => {
    if (!dashboardData) return null;

    const groupedTasks = dashboardData.tasks.reduce<Record<string, AdminDashboardData['tasks'][number][]>>((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {});

    const groupedEntries = Object.entries(groupedTasks) as Array<[
      string,
      AdminDashboardData['tasks'][number][]
    ]>;

    const statusStyles: Record<string, string> = {
      open: 'bg-slate-100 text-slate-700',
      checking: 'bg-amber-100 text-amber-800',
      completed: 'bg-green-100 text-green-700'
    };

    return (
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <header className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Aufgabenboard & KI-Verifikation</h3>
            <p className="text-slate-600">
              Verbleibende Maßnahmen für Local SEO, Backlinks und Portal-Optimierung. KI prüft Nachweise vor Abschluss.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-slate-500 bg-slate-100 rounded-full px-3 py-1">
            {Object.values(taskStatuses).filter((status) => status !== 'completed').length} offene Aufgaben
          </span>
        </header>
        {dashboardData.tasks.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Aktuell sind keine manuellen Aufgaben offen. Alle Integrationen sind vollständig konfiguriert.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {groupedEntries.map(([category, categoryTasks]) => (
              <div key={category} className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-lg font-semibold text-slate-900">{category}</h4>
                  <span className="text-xs font-medium text-slate-500">
                    {categoryTasks.length} Aufgaben · Prioritätenspiegel integriert
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categoryTasks.map((task) => {
                    const status = taskStatuses[task.id] ?? task.status;
                    const message = taskMessages[task.id];
                    const isProcessing = taskProcessing[task.id];
                    const statusStyle = statusStyles[status] ?? 'bg-slate-100 text-slate-600';
                    const statusLabel =
                      status === 'open'
                        ? 'Offen'
                        : status === 'checking'
                        ? 'KI prüft …'
                        : status === 'completed'
                        ? 'Abgeschlossen'
                        : 'Unbekannt';

                    return (
                      <article
                        key={task.id}
                        className="border border-slate-200 rounded-2xl p-5 bg-slate-50/60 flex flex-col gap-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
                                {statusLabel}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                Priorität: {task.priority}
                              </span>
                            </div>
                            <h5 className="text-base font-semibold text-slate-900">{task.title}</h5>
                            <p className="text-sm text-slate-600">{task.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => resetTaskToOpen(task.id)}
                            className="text-xs text-slate-400 hover:text-slate-600"
                            aria-label="Aufgabe zurücksetzen"
                          >
                            ↺
                          </button>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <p>Owner: {task.owner}</p>
                          {task.dueDate && <p>Frist: {task.dueDate}</p>}
                          {(taskChecks[task.id] || task.lastChecked) && (
                            <p>Letzter KI-Check: {taskChecks[task.id] ?? task.lastChecked}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-600">
                            Nachweis hinterlegen
                          </label>
                          <textarea
                            value={taskEvidence[task.id] ?? ''}
                            rows={3}
                            onChange={(event) =>
                              setTaskEvidence((prev) => ({
                                ...prev,
                                [task.id]: event.target.value
                              }))
                            }
                            placeholder={
                              task.evidenceHint ?? 'z. B. Link zu Verzeichnis oder interner Notiz'
                            }
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            type="button"
                            disabled={status === 'completed' || isProcessing}
                            onClick={() => handleTaskVerification(task.id)}
                            className="w-full inline-flex justify-center items-center gap-2 bg-green-600 text-white font-semibold rounded-xl py-2.5 hover:bg-green-700 transition-colors disabled:opacity-60"
                          >
                            {isProcessing && (
                              <span className="h-4 w-4 border-2 border-white border-b-transparent rounded-full animate-spin"></span>
                            )}
                            {status === 'completed' ? 'Abgeschlossen' : 'KI-Verifizierung anstoßen'}
                          </button>
                          {message && (
                            <p
                              className={`text-xs ${
                                message.type === 'success' ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {message.text}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {!isAuthenticated && renderLoginForm()}
        {isAuthenticated && (
          <div className="space-y-12">
            {renderSystemStatus()}
            {renderMonitoringSummary()}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {renderTrafficTable()}
              {renderKeywordPerformance()}
            </div>
            {renderRankingTable()}
            {renderApiKeyManager()}
            {renderTaskBoard()}
            {renderSeoSuggestions()}
            {renderPortalAlerts()}
          </div>
        )}
        {isSubmitting && !isAuthenticated && (
          <div className="flex items-center justify-center">
            <div className="text-center text-slate-600 text-sm">
              Daten werden geladen...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MitarbeiterLoginPage;
