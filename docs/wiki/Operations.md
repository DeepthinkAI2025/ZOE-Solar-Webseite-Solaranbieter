# Betrieb & Operations

Dieser Abschnitt beschreibt Deployments, Umgebungen, Monitoring sowie Tagesgeschäft für das ZOE Solar Team.

## Environments & Branching
- **main**: Produktionsbereit, automatisiertes Deployment nach Review.
- **Feature Branches**: `feature/<topic>` – Pull Requests mit QA-Check.
- **Wiki Sync**: Inhalte aus `docs/wiki` bei Bedarf in GitHub-Wiki spiegeln (siehe [[Home]]).

## Konfiguration & Secrets
- `.env.example` als Template verwenden; produktive Secrets niemals committen.
- Typische Variablen: `CMS_API_KEY`, `GMB_SERVICE_ACCOUNT`, `SMTP_*`, `ANALYTICS_*`.
- Secret Rotation gemäß Security Policy (quartalsweise).

## Build & Deployment
```bash
npm install --legacy-peer-deps
npm run build
npm run preview # optionaler Smoke-Test
```
- Statisches Frontend kann via CDN/Static Hosting (z. B. Vercel, Netlify) veröffentlicht werden.
- Backend/Server (`server/`) als Node-Service oder innerhalb eines Docker-Containers betreiben.
- Monitoring-Jobs werden via Cron oder GitHub Actions gestartet (`npm run seo-monitor`, `npm run seo-geo-audit`).

## QA & Tests
- **Lint/Format:** Vite + TypeScript, zukünftig ESLint/Prettier integrierbar.
- **Manuelle Checks:** Core Web Vitals, Lighthouse, Schema Testing (siehe `docs/rich-results-test-plan.md`).
- **Data QA:** Prüfe JSON Dumps (Keyword-, SEO-Historie) vor Deploys.

## Observability
- **SEO KPI Dashboard:** `pages/SEOMonitoringPage.tsx`, angereichert durch `data/seo-history.json`.
- **Admin Dashboard:** `pages/MitarbeiterLoginPage.tsx` + `data/adminDashboard.ts` (intern, nur authentifizierte Nutzer).
- **Alerts:** `npm run seo-alerts` (E-Mail/Slack), `docs/offpage-local-actions-implementation.md` für schnelle Reaktion.

## Runbooks
- **Incident Response:** Bei massiven Rankingverlusten -> `docs/technical-seo-quickwins.md` & `docs/sofort-aktionen-kostenlos.md`.
- **Directory Listings:** Schritt-für-Schritt `docs/gbp-setup-checkliste.md`, `docs/verzeichnis-eintragungen-systematisch.md`.
- **Offpage Execution:** `docs/sprint1-offpage-execution-plan.md`, `docs/kostenlose-offpage-strategie.md`.

## Team & Kommunikation
- **Zentrale Kanäle:** Slack #growth, #engineering, #ops – Alerts laufen in #seo-alerts.
- **Meeting-Kadenz:**
  - Montag: Growth Standup (Audit Review)
  - Mittwoch: Tech Sync (Deployments & Pipeline)
  - Freitag: Leadership Check-in (KPIs & Vertrieb)
- **Dokumentation:** Alle größeren Entscheidungen als ADR im Repo oder im Wiki vermerken.
