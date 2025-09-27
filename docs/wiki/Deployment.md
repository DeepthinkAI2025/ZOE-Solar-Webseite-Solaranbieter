# Deployment & Betrieb

Dieser Leitfaden dokumentiert Build-Prozess, Hosting-Strategien und Betriebsrichtlinien für ZOE Solar.

## Build Pipeline

1. **Installationen**
   - `npm install`
   - Optional: `npm run prepare` für Husky Hooks
2. **Qualitätstests**
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test:ci`
3. **Build**
   - `npm run build`
   - Output: `dist/` (Frontend) + `dist/server/`
4. **Artefakt-Verpackung**
   - Docker Image (siehe `Dockerfile` Backlog) oder Zip-Deploy

## Hosting-Optionen

| Option | Beschreibung | Pros | Cons |
| --- | --- | --- | --- |
| Vercel | Frontend-Hosting mit Edge Functions | Schnelle Deployments, Preview URLs, integrierte CDN | Node API (Express) nur als Serverless Rewrite möglich |
| Netlify | Statisches Frontend + Serverless Functions | Einfache CI Konfiguration, Formular Features | Begrenzte Laufzeit, Cold Starts |
| Render / Railway | Fullstack Hosting (Frontend + Node) | Permanente Prozesse, einfache Secrets | Höhere Kosten, Setup-Aufwand |
| GCP Cloud Run | Containerbasiert, autoskalierend | Hohe Skalierung, Pay-per-use | Docker & Infrastruktur-Know-how nötig |

Empfehlung: **Frontend** auf Vercel, **Backend** (Express) auf Render/Cloud Run. Alternativ Monolith-Deployment auf Railway.

## Environment-Konfiguration

- `.env` (lokal) und Production Secrets (GitHub Actions, Render Dashboard).
- Wichtige Variablen:
  - `VITE_SITE_URL`
  - `ADMIN_API_KEY`
  - `GOOGLE_*` Credentials
  - `AHREFS_TOKEN`
  - `VERTEX_AI_KEY`

## GitHub Actions

- Workflow `deploy.yml` (Backlog) sollte folgende Jobs enthalten:
  1. `install` (Cache nutzen)
  2. `lint`, `typecheck`, `test`
  3. `build`
  4. Deploy Step (z. B. Vercel Action oder Render Deploy Hook)
- Slack Notifications (`SLACK_DEPLOY_HOOK`) für Deployment Ergebnisse.

## Monitoring & Wartung

- **Uptime:** Better Stack oder UptimeRobot prüft `/api/v1/health` + Landingpage.
- **Logging:** Production-Logs zentral sammeln (Logtail/Datadog).
- **Alerts:** Search Console + GA4 Alerts, Slack Benachrichtigungen aus Automationen.
- **Backups:** Wichtige JSON-Daten (`data/*.json`) regelmäßig sichern.

## Rollback-Strategie

- Vercel: `vercel rollback <deployment-id>`
- Render: Letzten erfolgreichen Deploy auswählen & redeployen.
- GitHub Actions: Tagging/Release-Branching zur Nachverfolgung.

## Betriebsaufgaben (Runbook)

| Häufigkeit | Aufgabe | Beschreibung |
| --- | --- | --- |
| Täglich | SEO Monitoring prüfen | Alerts aus `scripts/seo-monitor.ts` validieren |
| Wöchentlich | Keyword-Updates | `keyword-cluster.ts` ausführen, Content-Team informieren |
| Monatlich | Lighthouse Audit | Reports vergleichen, Performance-Budgets prüfen |
| Quartal | Sicherheits-Check | API Keys rotieren, Dependency Audit |

## Disaster Recovery

- Fallback CDN-Deployment für statische Seiten (S3 + CloudFront).
- Datenwiederherstellung aus Git-History und JSON-Backups.
- Incident-Template in `docs/templates/incident-report.md` verwenden.

## Roadmap

- 🔄 Infrastruktur Code (Terraform) für reproduzierbare Deployments.
- 🔄 Canary Releases (Percentage Rollouts via Vercel).
- 🔄 Blue/Green Deployments für Backend.

---
_Stand: 26.09.2025_