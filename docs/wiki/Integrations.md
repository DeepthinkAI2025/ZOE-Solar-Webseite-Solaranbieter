# Integrationen & externe Systeme

Diese Seite beschreibt alle externen Plattformen, mit denen ZOE Solar interagiert. Dazu zählen Marketing-APIs, CRM-Anbindungen, KI-Dienste sowie Analytics-Systeme.

## Übersicht

| Kategorie | Tool/Service | Funktion | Implementierung |
| --- | --- | --- | --- |
| SEO | Google Search Console | Performance- und Indexdaten | `server/services/searchConsoleService.ts` |
| SEO | Ahrefs API | Keyword- & Backlink-Analysen | `server/services/ahrefsService.ts` |
| Analytics | Google Analytics 4 | Traffic & Conversion Tracking | `server/services/analyticsService.ts` |
| Local SEO | Google Business Profile | Standort-Insights, Reviews | `server/services/businessProfileService.ts` |
| KI & Automatisierung | Vertex AI (`@google/genai`) | Generierung von Textbausteinen, Chatbots | `components/AIChatFunnel.tsx`, `services/genAiClient.ts` |
| Kommunikation | Slack Webhooks | Alerts für SEO-Auffälligkeiten | `scripts/seo-monitor.ts` |
| CMS/Content | Notion API (optional) | Content-Briefings & Freigaben | `scripts/content-pipeline.ts` (Feature Flag) |
| Deployment | GitHub Actions | CI/CD Pipelines | `.github/workflows/*` |

## Authentifizierung & Secrets

- Alle API-Schlüssel werden über `.env` oder Secret Manager injiziert.
- Beispiel `.env`-Variablen:
  - `ADMIN_API_KEY`
  - `GOOGLE_SEARCH_CONSOLE_CREDENTIALS`
  - `GA4_SERVICE_ACCOUNT`
  - `AHREFS_TOKEN`
  - `VERTEX_AI_KEY`
  - `SLACK_ALERT_URL`
- Als Best Practice sollten Service Accounts mit minimalen Rechten konfiguriert werden (Least Privilege).

## Datenflüsse

```
[Frontend Funnels] --> (fetch) --> [Express API]
                          |
                          +--> [GSC Bulk Export]
                          +--> [Ahrefs]
                          +--> [GA4]
                          +--> [GBP]
                          +--> [Notion (optional)]
```

### Beispiel: SEO Dashboard
1. Cronjob ruft `GET /api/v1/seo/summary` ab.
2. Server ruft Search Console + Ahrefs parallel.
3. Ergebnisse werden gemappt, normalisiert und im Frontend visualisiert (z. B. `components/Dashboard/*`).

### Beispiel: KI-Content
1. Autor startet Task in `CommandHub` → löst `scripts/content-pipeline.ts` aus.
2. Script sammelt Keywords (`data/high-priority-keywords.json`).
3. Vertex AI erzeugt Outline, Slack informiert Team.

## Fehler- & Limit-Handling

- **Search Console:** Begrenzte Anzahl API-Requests pro Tag; Script bündelt Abfragen in 2-Minuten-Fenstern.
- **Ahrefs:** Rate Limit pro Minute → Retry mit Exponential Backoff.
- **GA4:** Service Account muss auf Property-Lesezugriff eingestellt sein, sonst HTTP 403.
- **Vertex AI:** Token-Quota beachten; bei Überschreitung Fallback auf gespeicherte Vorlagen.

## Monitoring

- Logs: `server/index.js` schreibt Integrationsfehler mit `integration`-Label.
- Alerts: Slack Webhook benachrichtigt bei `severity >= warning`.
- Backlog: Integration von Sentry / Datadog für detaillierte Fehlerreports.

## Onboarding-Checkliste

1. Service Accounts erstellen & JSON-Credentials sicher ablegen.
2. `.env.sample` erweitern & Team informieren.
3. Secrets in GitHub Actions (`Settings > Secrets and variables`) eintragen.
4. Smoke Test für jeden Service ausführen (`npm run verify:<service>` – Backlog-Skripte).

## Verbesserungsmöglichkeiten

- 🔄 HubSpot/CRM-Anbindung für Lead-Sync.
- 🔄 Zapier/Make-Workflows für Marketing-Automatisation.
- 🔄 Webhooks bei neuen GSC-Fehlern direkt in Jira.

---
_Stand: 26.09.2025_