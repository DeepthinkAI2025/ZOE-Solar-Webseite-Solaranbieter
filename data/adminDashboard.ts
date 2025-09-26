export interface TrafficDatum {
  month: string;
  estimatedVisitors: number | null;
  actualVisitors: number | null;
}

export interface RankingOverviewEntry {
  page: string;
  url: string;
  keywordFocus: string | null;
  position: number | null;
  change: number | null;
  trafficShare: number | null;
}

export interface KeywordPerformance {
  keyword: string;
  position: number | null;
  searchVolume: number | null;
  clickRate: number | null;
  trend: 'up' | 'down' | 'flat' | 'stable';
}

export interface SeoSuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: 'hoch' | 'mittel' | 'niedrig';
  effort: 'hoch' | 'mittel' | 'niedrig';
  owner: string;
  dueDate?: string;
}

export interface PortalAlert {
  portal: string;
  country: string;
  status: 'Fehlt' | 'Update benötigt' | 'OK';
  issue: string;
  lastChecked: string;
  priority: 'hoch' | 'mittel' | 'niedrig';
  recommendedAction: string;
}

export interface MonitoringSnapshot {
  lastRun: string;
  totalBacklinks: number | null;
  newBacklinks30d: number | null;
  lostBacklinks30d: number | null;
  domainAuthority: number | null;
  averagePosition: number | null;
  topTenRatio: number | null;
  aiSearchMentions: number | null;
  coreWebVitals: {
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    overall: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  };
}

export type TaskStatus = 'open' | 'checking' | 'completed';

export interface AdminTask {
  id: string;
  category: 'Backlinks' | 'Reviews' | 'Content' | 'Technical';
  title: string;
  description: string;
  owner: string;
  priority: 'hoch' | 'mittel' | 'niedrig';
  status: TaskStatus;
  dueDate?: string;
  lastChecked?: string;
  evidenceHint?: string;
}

export interface AdminDashboardData {
  monitoring: MonitoringSnapshot;
  traffic: TrafficDatum[];
  rankings: RankingOverviewEntry[];
  keywordPerformance: KeywordPerformance[];
  seoSuggestions: SeoSuggestion[];
  portalAlerts: PortalAlert[];
  tasks: AdminTask[];
}

export const defaultOperationalTasks: AdminTask[] = [
  {
    id: 'task-backlinks-01',
    category: 'Backlinks',
    title: 'Lokale Branchenverzeichnisse aktualisieren',
    description:
      'Eintragungen in Handwerkskammern, Energie-Verbänden und lokalen Verzeichnissen vervollständigen und Backlinks sichern.',
    owner: 'SEO Team',
    priority: 'hoch',
    status: 'open',
    evidenceHint: 'Liste aller neuen/aktualisierten Verzeichnisse inkl. Live-URLs.'
  },
  {
    id: 'task-backlinks-02',
    category: 'Backlinks',
    title: 'Pressearbeit für regionale Fallstudien anstoßen',
    description:
      'Lokale Medien mit Agri-PV-Erfolgsgeschichten beliefern und Backlink-Absprachen finalisieren.',
    owner: 'PR & Kommunikation',
    priority: 'mittel',
    status: 'open',
    evidenceHint: 'Presseverteiler + veröffentlichte Artikel oder Zusage der Redaktion.'
  },
  {
    id: 'task-reviews-01',
    category: 'Reviews',
    title: 'Google Review Automatisierung aktivieren',
    description:
      'Automatisierte Follow-up-Mails nach Installation konfigurieren, um Rezensionen einzusammeln.',
    owner: 'Customer Success',
    priority: 'hoch',
    status: 'open',
    evidenceHint: 'Screenshot des Automations-Flows + erste Review-Antworten.'
  },
  {
    id: 'task-reviews-02',
    category: 'Reviews',
    title: 'Bewertungsmonitoring implementieren',
    description:
      'Tägliche Monitoring-Alerts für Google Reviews einrichten und Antwortleitfäden bereitstellen.',
    owner: 'Customer Success',
    priority: 'mittel',
    status: 'open',
    evidenceHint: 'Alert-Konfiguration + Template-Dokumentation.'
  },
  {
    id: 'task-content-01',
    category: 'Content',
    title: 'Standortspezifische Social-Media-Serie starten',
    description:
      'Für jeden Standort Fallstudien-Posts veröffentlichen und auf lokale Landingpages verlinken.',
    owner: 'Marketing',
    priority: 'mittel',
    status: 'open',
    evidenceHint: 'Content-Kalender + Links zu veröffentlichten Posts.'
  },
  {
    id: 'task-content-02',
    category: 'Content',
    title: 'Community & Influencer Programm vorbereiten',
    description:
      'Lokale Energie-Communities und Experten identifizieren, Zusammenarbeit verhandeln.',
    owner: 'Marketing',
    priority: 'niedrig',
    status: 'open',
    evidenceHint: 'Liste geeigneter Partner + Outreach-Status.'
  },
  {
    id: 'task-technical-01',
    category: 'Technical',
    title: 'Google My Business Profile finalisieren',
    description: 'Alle Standorte mit Fotos, Leistungen, FAQ und UTM-Links komplettieren.',
    owner: 'SEO Team',
    priority: 'hoch',
    status: 'open',
    evidenceHint: 'Screenshots je Standort + GMB Insights Export.'
  },
  {
    id: 'task-technical-02',
    category: 'Technical',
    title: 'Citation Audit durchführen',
    description: 'NAP-Konsistenz in allen Verzeichnissen sicherstellen und Abweichungen korrigieren.',
    owner: 'SEO Team',
    priority: 'mittel',
    status: 'open',
    evidenceHint: 'Audit-Sheet mit Status pro Portal.'
  }
];

export const emptyDashboardData: AdminDashboardData = {
  monitoring: {
    lastRun: '',
    totalBacklinks: null,
    newBacklinks30d: null,
    lostBacklinks30d: null,
    domainAuthority: null,
    averagePosition: null,
    topTenRatio: null,
    aiSearchMentions: null,
    coreWebVitals: {
      lcp: null,
      fid: null,
      cls: null,
      overall: 'unknown'
    }
  },
  traffic: [],
  rankings: [],
  keywordPerformance: [],
  seoSuggestions: [],
  portalAlerts: [],
  tasks: []
};

export const apiServiceKeys = ['gemini', 'googleMaps', 'googleServiceAccount', 'ahrefs', 'businessProfile'] as const;

export type ApiServiceKey = (typeof apiServiceKeys)[number];

export type DashboardServiceState = 'ok' | 'missing-config' | 'error';

export interface DashboardIssue {
  area: string;
  level: 'error' | 'warning';
  message: string;
}

export interface DashboardApiResponse {
  data: AdminDashboardData;
  issues: DashboardIssue[];
  services: Record<'searchConsole' | 'analytics' | 'ahrefs' | 'businessProfile', DashboardServiceState>;
}

export interface AdminServiceSummaryEntry {
  configured: boolean;
  mask?: string | null;
  model?: string | null;
  clientEmail?: string | null;
  propertyUrl?: string | null;
  analyticsPropertyId?: string | null;
  target?: string | null;
  accountName?: string | null;
  locationId?: string | null;
  lastUpdated: string | null;
}

export type AdminServiceSummary = Record<ApiServiceKey, AdminServiceSummaryEntry>;

export interface AdminApiKeyResponse {
  services: AdminServiceSummary;
  tasks: AdminTask[];
}
