# Analytics & Monitoring

Dieses Kapitel beschreibt die Messpunkte, KPIs und Tools, mit denen ZOE Solar seine Marketing-Performance überwacht.

## KPIs

| Kategorie | Kennzahlen | Quelle |
| --- | --- | --- |
| SEO | Klicks, Impressions, CTR, Position | Google Search Console |
| Organisch | Sessions, Conversions, Bounce Rate | Google Analytics 4 |
| Lokale Sichtbarkeit | Anrufe, Routenanfragen, Profilansichten | Google Business Profile |
| Content | Veröffentlichte Artikel, SERP-Rank, Social Shares | Content Pipeline + Ahrefs |
| Conversion | Leads, Angebotsanfragen, Demo-Buchungen | CRM (Backlog) + Formulare |

## Dashboards

- **SEO Cockpit** (`components/Dashboard/SeoOverview.tsx`)
  - Visualisiert Search Console Trends
  - Aggregiert technische Issues (Coverage, Mobile Usability)
- **Keyword Radar** (`components/Dashboard/KeywordRadar.tsx`)
  - Cluster & SERP-Features
  - Priorisierung nach Opportunity Score
- **Lokales Monitoring** (`components/Dashboard/LocalInsights.tsx`)
  - Google Business Profile Metriken
- **Content Performance** (`components/Dashboard/ContentPerformance.tsx`)
  - Publishing-Frequenz & Rankings

## Daten-Pipelines

1. Cronjob ruft Search Console Bulk Export → speichert CSV/JSON in `data/seo-monitoring/`.
2. `scripts/seo-diff.ts` vergleicht neue Werte mit `seo-history.json`.
3. Ergebnisse werden in `seo-report.json` geschrieben.
4. Frontend lädt Daten über `server/index.js` API (`/api/v1/seo/summary`).

## Alerts & Benachrichtigungen

- **Slack Alerts**: Trigger bei starkem KPI-Abfall (> 20 % Woche/Woche) oder neuen Indexierungsfehlern.
- **Email Reports**: Wöchentliche Zusammenfassung (Backlog – Integration mit Mailgun).
- **Dashboard Checks**: Team prüft montags `SEO Cockpit` und `Keyword Radar`.

## Tools & Libraries

- Google APIs (`googleapis`, `@google-cloud/*`)
- Ahrefs SDK (Custom-Fetch)
- Charting: `recharts` und `nivo` (Option) in Dashboard-Komponenten
- Analytics Tracking im Frontend: `@vercel/analytics` (Backlog)

## Data Quality

- Validierung: `scripts/validate-data.ts` (Backlog) prüft KPI-Sets auf Null/NaN.
- Versionierung: Wichtige Reports werden nach Datum versioniert (`seo-report-2025-09-26.json`).
- Manual QA: Vergleicht API-Werte mit UI (Search Console Oberfläche).

## Governance

- Verantwortlichkeiten: Growth/SEO Team besitzt Dashboards; Engineering stellt Infrastruktur.
- Incident Response: Bei Datenlücken > 24h Incident eröffnen (Template `docs/templates/incident-report.md`).
- Datenschutz: Nur aggregierte Daten speichern; PII anonymisieren.

## Roadmap

- 🔄 GA4 BigQuery Export für tiefere Analysen.
- 🔄 Looker Studio Dashboard mit automatischer Aktualisierung.
- 🔄 Predictive Analytics (Forecasting) via Vertex AI.

---
_Stand: 26.09.2025_