# Systemarchitektur

Dieses Kapitel beschreibt die technische Struktur von ZOE Solar – von der Kundenwebsite bis zu Admin- und Automationsdiensten.

## Übersicht
- **Frontend:** React 19 + Vite + TailwindCSS (`/App.tsx`, `components/`, `pages/`).
- **Backend & Services:** Express-basierte Endpunkte (`/server`, `/services`) für Monitoring, Auth und Integrationen.
- **Automatisierung:** Node/TypeScript Skripte im Verzeichnis `scripts/` (SEO-Monitoring, Keyword-Research, GEO/AEO-Audits).
- **Datenhaltung:** Strukturierte Content-Quellen unter `data/` (Keywords, Local Content, FAQ, Pricing, SEO Historie).
- **Build & Deployment:** Vite Build (`npm run build`), optional Containerisierung via Devcontainer (`.devcontainer/`).

## Frontend Layer
- **Routing:** `react-router-dom` 7 mit Datei-zu-Route-Mapping (`data/pageRoutes.ts`).
- **State & Hooks:** Fokus auf deklarative Komponenten, Nutzen von Context/Props statt globalem State.
- **SEO-Komponenten:** `components/SEOManager.tsx` orchestriert Meta-Tags & Schema basierend auf `data/seoConfig.ts`.
- **UI-Bibliothek:** Tailwind Utility-Klassen, ergänzt durch firmeneigene Komponenten (Header, Hero, Funnel, Wizard, etc.).

## Backend & Integrationen
- **Express Server:** Entry `server/index.js`, bündelt API-Routen und Webhooks.
- **Services:** `services/` enthält Integrationslayer zu CRM, Monitoring, GMB (Google Business Profile) u. a.
- **Security:** JWT-basierte Auth (`jsonwebtoken`), `.env` Templates (`.env.example`).
- **Scheduler:** `node-cron` Jobs für periodische SEO-Scans & Alerts.

## Automatisierungs-Pipelines
- **SEO Monitoring:** `npm run seo-monitor` & `npm run enhanced-seo-monitor` erzeugen Verlauf in `data/seo-history.json`.
- **Keyword Engine:** `scripts/keyword-research.cjs` und ergänzende JSON-Dumps (`data/keyword-analysis.json`).
- **GEO & AEO Audit:** TypeScript Skript `scripts/seo-geo-aeo-audit.ts` schreibt `data/seo-geo-audit.json`.
- **Content Ops:** Workflow-Protokolle (`data/seo-workflow-log.json`) und Content-Plan (`data/content-plan.json`).

## Datenflüsse
1. **Input:** Keyword- und Marktanalysen (JSON), lokale Inhalte (`localContent.ts`), FAQ (`faqData.ts`).
2. **Processing:** Skripte validieren Coverage (z. B. Speakable, LocalBusiness Branches, FAQ Coverage).
3. **Output:** Scorecards für Regionen, Handlungsempfehlungen, Monitoring-Berichte, die in Komponenten visualisiert werden.

## Erweiterungspunkte
- **Mehrsprachigkeit:** `data/seoConfig.ts` unterstützt Hreflang – Erweiterung durch zusätzliche Locale.
- **Dashboards:** Datenfeeds (`data/adminDashboard.ts`) können an BI-Tools oder das interne Dashboard gestreamt werden.
- **API Layer:** REST/GraphQL-Gateways in `server/` lassen sich modular erweitern (z. B. CRM Sync, Webhook-Verarbeitung).

## Referenzen
- `README.md` – High-Level Produktstory & Setup.
- `docs/seo-monitoring-readme.md` – Monitoring-Handbuch.
- `docs/technical-seo-quickwins.md` – Technische Roadmap.
