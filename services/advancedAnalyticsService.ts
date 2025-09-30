// Zentrales SEO-Monitoring- und Reporting-Dashboard für ZOE Solar
import fs from 'fs';
import path from 'path';

// Typdefinitionen für KPIs und Alerts
type KPI = {
  timestamp: string;
  avgPosition: number;
  top10Percentage: number;
  estimatedTraffic: number;
  conversionRate?: number;
  localVisibility?: number;
  aiCitations?: Record<string, number>;
};

type Alert = {
  type: string;
  severity: string;
  message: string;
  timestamp: string;
};

type ReportSummary = {
  period: string;
  avgPosition: number;
  organicTraffic: number;
  conversions: number;
  revenue: number;
  visibilityScore: number;
  conversionRate: number;
  localVisibility: number;
  aiCitations: Record<string, number>;
  alerts: Alert[];
};

type ExportFormat = 'json' | 'csv' | 'markdown';

// Hilfsfunktionen zum Laden der Datenquellen
function loadJSON(file: string) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data', file), 'utf-8'));
}

// Aggregation aller relevanten KPIs aus Reports und Monitoring-Daten
export function aggregateKPIs(): KPI {
  const seoReport = loadJSON('seo-report.json');
  const aiMetrics = loadJSON('seo-monitoring/ai-platform-performance-metrics.json');
  const weeklyReport = loadJSON('weekly-report-2025-09-28.json');
  const latestSummary = loadJSON('seo-monitoring/latest-summary.json');

  return {
    timestamp: seoReport.timestamp,
    avgPosition: seoReport.metrics.avgPosition,
    top10Percentage: seoReport.metrics.top10Percentage,
    estimatedTraffic: seoReport.metrics.estimatedTraffic,
    conversionRate: weeklyReport.summary.kpiOverview.analytics.conversionRate,
    localVisibility: weeklyReport.summary.kpiOverview.geo.visibilityScore,
    aiCitations: aiMetrics.metrics
      ? Object.fromEntries(
          Object.entries(aiMetrics.metrics).map(([k, v]: [string, any]) => [k, v.current.status === 'online' ? 1 : 0])
        )
      : {},
  };
}

// Automatisierte Monats- und Quartalsauswertung
export function getPeriodReport(period: 'monthly' | 'quarterly'): ReportSummary {
  // Beispiel: Aggregation aus Weekly- und SEO-Report
  const weeklyReport = loadJSON('weekly-report-2025-09-28.json');
  const seoReport = loadJSON('seo-report.json');
  const aiMetrics = loadJSON('seo-monitoring/ai-platform-performance-metrics.json');

  return {
    period: period === 'monthly' ? 'Monat' : 'Quartal',
    avgPosition: seoReport.metrics.avgPosition,
    organicTraffic: weeklyReport.summary.kpiOverview.seo.organicTraffic,
    conversions: weeklyReport.summary.kpiOverview.analytics.conversions,
    revenue: weeklyReport.summary.kpiOverview.analytics.revenue,
    visibilityScore: weeklyReport.summary.kpiOverview.seo.visibilityScore,
    conversionRate: weeklyReport.summary.kpiOverview.analytics.conversionRate,
    localVisibility: weeklyReport.summary.kpiOverview.geo.visibilityScore,
    aiCitations: aiMetrics.metrics
      ? Object.fromEntries(
          Object.entries(aiMetrics.metrics).map(([k, v]: [string, any]) => [k, v.current.status === 'online' ? 1 : 0])
        )
      : {},
    alerts: seoReport.alerts.map((a: any) => ({
      type: a.type,
      severity: a.severity,
      message: a.message,
      timestamp: a.timestamp,
    })),
  };
}

// Alerting für kritische Schwankungen
export function checkCriticalAlerts(): Alert[] {
  const seoReport = loadJSON('seo-report.json');
  return seoReport.alerts.filter((a: any) => a.severity === 'error' || a.severity === 'critical');
}

// Reporting-Funktionen für Stakeholder
export function exportReport(format: ExportFormat = 'json', period: 'monthly' | 'quarterly' = 'monthly'): string {
  const report = getPeriodReport(period);
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }
  if (format === 'csv') {
    // Simple CSV-Export (nur KPIs, keine Alerts)
    const header = Object.keys(report).filter(k => k !== 'alerts' && k !== 'aiCitations').join(',');
    const values = Object.values(report).filter((v, i) => header.split(',')[i] !== 'alerts' && header.split(',')[i] !== 'aiCitations').join(',');
    return `${header}\n${values}`;
  }
  if (format === 'markdown') {
    return `# SEO KPI Report (${report.period})\n\n` +
      `- Durchschnittliche Position: ${report.avgPosition}\n` +
      `- Organischer Traffic: ${report.organicTraffic}\n` +
      `- Conversions: ${report.conversions}\n` +
      `- Umsatz: ${report.revenue}\n` +
      `- Sichtbarkeits-Score: ${report.visibilityScore}\n` +
      `- Conversion Rate: ${report.conversionRate}\n` +
      `- Lokale Sichtbarkeit: ${report.localVisibility}\n` +
      `- AI-Citations: ${Object.entries(report.aiCitations).map(([k, v]) => `${k}: ${v}`).join(', ')}\n` +
      `\n## Alerts\n${report.alerts.map(a => `- [${a.severity}] ${a.message}`).join('\n')}`;
  }
  return '';
}

// Visualisierung (Platzhalter für Frontend-Integration)
export function getDashboardData() {
  return {
    kpis: aggregateKPIs(),
    alerts: checkCriticalAlerts(),
    reportMonthly: getPeriodReport('monthly'),
    reportQuarterly: getPeriodReport('quarterly'),
  };
}

// Automatisierte Auswertung (z.B. per Cronjob)
export function runAutomatedEvaluation() {
  const monthly = getPeriodReport('monthly');
  const quarterly = getPeriodReport('quarterly');
  // Hier könnte z.B. ein E-Mail-Trigger oder PDF-Export erfolgen
  fs.writeFileSync(path.resolve(__dirname, '../data/seo-monitoring/monthly-report.json'), JSON.stringify(monthly, null, 2));
  fs.writeFileSync(path.resolve(__dirname, '../data/seo-monitoring/quarterly-report.json'), JSON.stringify(quarterly, null, 2));
}

// --- Ende des Moduls ---