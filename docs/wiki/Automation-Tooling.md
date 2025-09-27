# Automations & Tooling

Die SEO- und Content-Automationen beschleunigen wiederkehrende Aufgaben und sichern konsistente Datenaktualität. Dieser Artikel beschreibt verfügbare Scripts, deren Konfiguration sowie Betriebsrichtlinien.

## Übersicht

| Kategorie | Script | Beschreibung |
| --- | --- | --- |
| Wiki & Dokumentation | `scripts/wiki-sync.ts` | Synchronisiert Markdown-Dokumente aus `docs/wiki` mit GitHub Wiki |
| SEO Monitoring | `scripts/seo-monitor.ts`, `scripts/seo-diff.ts` | Vergleicht Search Console/KPIs, erzeugt Alerts |
| Keyword Research | `scripts/keyword-cluster.ts`, `scripts/local-keywords.ts` | Aggregiert Keywords, bildet Cluster, aktualisiert JSON |
| Content Pipeline | `scripts/content-pipeline.ts` | Generiert Briefings, ordnet Content-Plan den Autoren zu |
| Sitemap & Indexierung | `scripts/generate-sitemap.ts`, `scripts/ping-search-engines.ts` | Baut XML-Sitemaps, pingt Google/Bing |
| Datenvalidierung | `scripts/validate-data.ts` (Backlog) | Stellt sicher, dass JSON/TS Daten konsistent sind |
| Build & Deployment | npm Scripts (`build`, `preview`, `lint`) | Frontend-Build und Preview |

## Wiki Sync

- **Zweck:** Markdown-Dateien automatisch mit GitHub Wiki Repository synchron halten.
- **Konfiguration:** `.env` benötigt `GITHUB_WIKI_REMOTE` (SSH/HTTPS) sowie `WIKI_BRANCH` (Standard: `main`).
- **Nutzung:**
  1. Änderungen in `docs/wiki` committen.
  2. `npm run wiki-sync` ausführen.
  3. Script clont/updatet Wiki-Repo in `.cache/wiki/`, kopiert Dateien und pusht.
- **Fehlerbehandlung:**
  - Netzwerkfehler → Retry (max. 3 Versuche).
  - Merge-Konflikt → lokales Wiki-Repo prüfen (`.cache/wiki`), `git status` laufen lassen, manuell beheben.

## SEO Monitoring

- Nutzt Google Search Console Bulk Exports + Ahrefs API.
- Generiert tägliche JSONs in `data/seo-monitoring/`.
- Alert-Logik: 
  - Drop > 20 % Klicks Woche/Woche.
  - Neue Coverage Issues → Slack Webhook (`SLACK_ALERT_URL`).
- geplanter Cron: `0 6 * * *` (GCP Cloud Scheduler oder GitHub Actions).

## Keyword Automationen

- `keyword-cluster.ts` ordnet Keywords zu Personas, intent-basierten Clustern & SERP-Features.
- `local-keywords.ts` erstellt Longtail-Varianten je Region (Input: `localContent.ts`).
- Output wird in `data/high-priority-keywords.json` usw. geschrieben.
- Ergänzung: Export als CSV (`--format csv`) für externe Tools.

## Content Pipeline

- Liest `content-plan.json` und `articles.ts`.
- Generiert Briefings (Outline, WDF*IDF, Ziel-Keywords) in `docs/briefings/`.
- Optionaler Hook: Übergabe an Notion via API (`NOTION_TOKEN`).

## Sitemap & Indexierung

- `generate-sitemap.ts` erstellt `public/sitemap.xml` + `sitemap-pages.xml`.
- `ping-search-engines.ts` benachrichtigt Google & Bing nach Deployments.
- Backlog: automatische Einbindung in CI/CD Pipeline.

## Infrastruktur & Scheduling

- Ausführung lokal über `npm run task -- <script>` oder `ts-node`.
- Produktionsbetrieb: 
  - GitHub Actions (`.github/workflows/automation.yml`) → stündliche/daily Jobs.
  - Alternativ Google Cloud Scheduler → Cloud Run Jobs.
- Logging: Scripts schreiben Statusmeldungen in `logs/automation.log` (wenn `LOG_LEVEL` gesetzt).

## Best Practices

1. **Idempotenz:** Scripts stetig so implementieren, dass Mehrfachausführung keine unerwünschten Effekte hat.
2. **Konfiguration:** `.env.sample` aktuell halten; neue Variablen dokumentieren.
3. **Monitoring:** Nach Cron-Deploy Slack/Email-Alerts einrichten.
4. **Testing:** Utility-Funktionen mit `vitest` testen (`__tests__/automation/*.test.ts`).
5. **Security:** API Keys nur über Secret Manager, niemals hartkodieren.

## Roadmap

- 🔄 Automatische Berichte (PDF) über Playwright Screenshots + Puppeteer Export.
- 🔄 Integration mit Vertex AI für Keyword-Suggestions (Prompt-Engineering).
- 🔄 Infrastruktur als Terraform-Modul veröffentlichen.

---
_Stand: 26.09.2025_