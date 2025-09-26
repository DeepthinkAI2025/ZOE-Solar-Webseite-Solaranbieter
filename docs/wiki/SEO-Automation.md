# SEO-, GEO- & AEO-Automatisierung

Diese Seite fasst die Suchmaschinen- und Answer-Engine-Aktivitäten zusammen, die ZOE Solar automatisiert.

## Ziele
- **Top-3 Sichtbarkeit** in relevanten Märkten (DE, AT, CH) für Photovoltaik, Agri-PV, Speicher & Ladeinfrastruktur.
- **AI & Answer Engine Optimization (AEO):** Sicherstellen, dass Speakable- und FAQ-Schemata für generative Suchergebnisse aktiv sind.
- **Regionale Dominanz:** Jede Primärregion (`PRIMARY_SERVICE_REGIONS`) erhält eigene Landingpages, LocalBusiness-Schema und Local-Content.

## Kernskripte
| Skript | Zweck | Output |
| --- | --- | --- |
| `npm run seo-monitor` | Basismonitoring: Rankings, Sichtbarkeit, Core KPIs | `data/seo-history.json` |
| `npm run enhanced-seo-monitor` | Erweiterter Crawl inkl. SERP-Features & Structured-Data-Checks | `data/seo-monitoring/` |
| `npm run keyword-research` | Konsolidiert Keywords & Intents aus externen Quellen | `data/keyword-analysis.json` |
| `npm run seo-geo-audit` | GEO & AEO Coverage-Analyse (TypeScript) | `data/seo-geo-audit.json` |
| `npm run seo-alerts` | Trigger für Alerts bei Ranking-Abfall | Slack/E-Mail Hooks |
| `npm run seo-workflow` | Automatisiert Worklog-Einträge & Priorisierung | `data/seo-workflow-log.json` |

## GEO & AEO Audit (TypeScript)
- Datei: `scripts/seo-geo-aeo-audit.ts`
- Lädt Keywords, lokale Inhalte, FAQ-Daten und `PRIMARY_SERVICE_REGIONS`.
- Bewertet pro Region: Route vorhanden, Local Content, LocalBusiness-Schema, FAQ, Speakable, Frage-Keyword-Abdeckung.
- Schreibt JSON-Report mit Score, Empfehlungen, Entity-Clustern und offenen Fragen.
- Konsolen-Output zeigt Top/Low Regionen und Monitoring-Snapshot.

## Datenquellen
- `data/high-priority-keywords.json` – Priorisierte SERP-Chancen.
- `data/local-keywords.json` – Regionale Longtail- und Frage-Keywords.
- `data/localContent.ts` – Standort-spezifische Copy & Module.
- `data/faqData.ts` – FAQ-Katalog inkl. Regionstags.
- `data/seoConfig.ts` – Zentrale SEO-Definition (Meta, Schema, Regionen).

## Speakable & FAQ Coverage
- Speakable-Markup: `components/SEOManager.tsx` + `data/seoConfig.ts` generieren `SpeakableSpecification`.
- FAQ-Markup: `buildFaqSchema` erzeugt `FAQPage`-Entities, muss mit regionalen Fragen gefüllt werden.
- Screener: `docs/faq-speakable-backlog.md` listet offene Fragen für Content-Teams.

## Prozesse & SLAs
1. **Wöchentliche Audits** (`npm run seo-geo-audit`), Ergebnisse im Growth-Standup reviewen.
2. **Content Backlog Sync** mit `docs/content-audit-sprint1.md` und `docs/seo-aeo-taskboard.md`.
3. **Alert Response**: Bei roten Regionen (<40 Score) innerhalb von 48 h Maßnahmen einplanen.
4. **Linkbuilding**: Siehe `docs/backlink-strategie.md` & Ableitungen in `docs/backlink-outreach-tier-a-strategie.md`.

## Monitoring & Reporting
- Dashboard Entwürfe: `data/adminDashboard.ts` & Seiten unter `pages/SEOMonitoringPage.tsx`.
- KPI-Begriffe: AVG Position, Top10 %, Estimated Traffic (siehe `data/seo-history.json`).
- Reporting-Templates: `docs/seo-monitoring-readme.md`, `docs/seo-geo-aeo-strategy.md`.

## Nächste Schritte
- Content-Lücken aus `data/seo-geo-audit.json` schließen (insbesondere Frage-Keywords).
- Branchen-Cluster aus `entityOpportunities` in Pillar Pages & Landingpages integrieren.
- Weitere Automatisierungen (z. B. automatische FAQ-Generierung) in `scripts/` ergänzen.
