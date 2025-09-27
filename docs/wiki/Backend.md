# Backend-Services & Integrationen

Die Backend-Schicht ist ein Express-Server, der Daten aus externen Marketing- und Vertriebsquellen aggregiert, aufbereitet und für das Frontend verfügbar macht. Dieses Kapitel beschreibt Aufbau, API-Endpunkte, Sicherheitsmaßnahmen und Integrationen.

## Überblick

| Aspekt | Umsetzung |
| --- | --- |
| Server-Laufzeit | Node.js 22 LTS |
| Framework | Express 5 |
| Entry Point | `server/index.js` |
| API Schema | REST (JSON) |
| Authentifizierung | API-Key Header (`x-api-key`) |
| Rate Limiting | Implementierung via `express-rate-limit` geplant (Backlog) |
| Logging | Konsolen-Logging + strukturierte Events im Produktions-Setup |

## Architekturdiagramm

```
[Browser/Frontend]
        |
        v
 [Express API Layer] --(fetch)--> [Google Search Console]
        | \--(fetch)--> [Google Analytics]
        | \--(fetch)--> [Google Business Profile]
        | \--(API)--> [Ahrefs Data]
        | \--(R/W)--> [Local JSON Data Files]
        v
 [Dashboard & Automation UIs]
```

## Hauptelemente

### 1. Server Bootstrap (`server/index.js`)
- Initialisiert Express-App, `helmet`-Security Middleware, JSON-Parser.
- Lädt API-Key aus `.env` (`ADMIN_API_KEY`) und validiert Anfragen über `authenticateRequest` Middleware.
- Definiert Routenpräfix `/api/v1` für alle Endpunkte.
- Nutzt `createServer()` für modulare Erweiterbarkeit (Tests / Serverless Deployments).

### 2. Service-Layer (`server/services/*`)

| Datei | Funktion |
| --- | --- |
| `ahrefsService.ts` | Ruft Ahrefs API (Rank Tracker, Backlinks, Keywords) ab, cached Antworten |
| `analyticsService.ts` | Google Analytics 4 Query Engine (Berichte, Conversions, Channel-Attribution) |
| `businessProfileService.ts` | Google Business Profile Insights (Anrufe, Routen, Views) |
| `searchConsoleService.ts` | Search Console API (Leistung, Abdeckung, Fehler), Bulk Export |
| `seoReportingService.ts` | Aggregiert SEO-Audits, enthält Breach Detection |
| `wikiSyncService.ts` | Hilft bei Automationen, z. B. Trigger für Wiki Sync |

> Hinweis: Einige Services existieren als Platzhalter (Mock) oder werden on demand geladen. Vor Reisen in Produktion API-Schlüssel konfigurieren.

### 3. Data-Layer
- `data/*.ts` & JSON-Dateien werden zur Laufzeit geladen, um statische Inhalte (Testimonials, Preise, Produkte) bereitzustellen.
- `seoConfig.ts` stellt Helper für strukturierte Daten, Hreflang-Mapping und Canonical-Logik bereit.

## API-Referenz (Kurzfassung)

| Methode & Pfad | Zweck | Auth | Antwort |
| --- | --- | --- | --- |
| `GET /api/v1/health` | Healthcheck (Status, Timestamp) | Nein | `{ status: 'ok', timestamp }` |
| `GET /api/v1/seo/summary` | Aggregiertes SEO-Dashboard (Ranking, Sichtbarkeit, technische KPIs) | Ja | `{ searchVisibility, issues, trends }` |
| `GET /api/v1/seo/keywords` | Keyword-Pools aus Ahrefs + eigenen Beurteilungen | Ja | `{ keywordClusters, opportunities }` |
| `GET /api/v1/analytics/performance` | Google Analytics 4 KPIs | Ja | `{ sessions, conversions, revenue }` |
| `GET /api/v1/local/insights` | Google Business Profile Metriken | Ja | `{ calls, directionRequests, photoViews }` |
| `POST /api/v1/wiki/sync` | Triggert Docs-Sync über CLI-Wrapper | Ja | `{ status, log }` |
| `POST /api/v1/cache/purge` | Löscht Caches für Services | Ja | `{ status }` |

> Die vollständige OpenAPI-Spezifikation liegt im Backlog und sollte bei produktivem Einsatz ergänzt werden.

## Authentifizierung & Sicherheit

- Jeder geschützte Endpunkt nutzt `authenticateRequest`:
  - Fragt Header `x-api-key` ab.
  - Vergleicht gegen `ADMIN_API_KEY` aus Umgebungsvariablen.
  - Rate Limit, IP Allowlist und Audit Logging sind optional und sollten vor Livegang ergänzt werden.
- CORS: In Vite-Dev-Setup wird Proxy verwendet, in Produktion erfolgt enge Domaineinschränkung.
- Datenvalidierung: `zod`-Schemas sind vorgesehen (`TODO`), aktuell werden externe Antworten per Mapping validiert.

## Fehlerbehandlung

- Zentrale Error Middleware wandelt Exceptions in strukturierte JSON-Antworten (`{ error: { message, code } }`).
- Externe API-Fehler werden mit `statusCode` und `details` an das Frontend gereicht.
- Wiederholungslogik (Retry mit Exponential Backoff) in Services, z. B. beim Abruf von Search Console.

## Deployment

1. Build: `npm run build` (Vite Frontend) + TS-Transpile für Server (`tsc -p server/tsconfig.json`).
2. Start: `node dist/server/index.js` oder Docker-Container.
3. Infrastruktur-Empfehlung: Render, Railway oder Vercel Functions für Edge, ggf. GCP Cloud Run.
4. Secrets: über `.env` / Secret Manager injizieren (`ADMIN_API_KEY`, Google Service Accounts, Ahrefs Token).

## Monitoring & Observability

- Request-Logging via `morgan` (aktivieren mit `ENABLE_HTTP_LOGS=true`).
- Geplante Integration: Stackdriver / OpenTelemetry Collector für Distributed Tracing.
- Alerts: Cloud Functions + Slack Webhooks, z. B. wenn Search Console API fehlschlägt.

## Backlog & Verbesserungen

- ✅ Healthcheck & Authentifizierungs-Middleware
- 🔄 OpenAPI-Spezifikation generieren (`scripts/generate-openapi.ts`).
- 🔄 Rate Limiting & Fail2Ban-Regeln.
- 🔄 Caching-Layer (Redis oder KV) für Ahrefs/Analytics.
- 🔄 Integrationstests mit `vitest` + Supertest.

---
_Stand: 26.09.2025_