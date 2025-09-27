# Daten- & Inhaltslayer

Das Projekt bündelt alle Inhalte, SEO-Datensätze und Konfigurationsdateien unter `/data`. Dieser Abschnitt dokumentiert Struktur, Datenquellen sowie Best Practices für Pflege und Erweiterung.

## Verzeichnisstruktur

```
data/
 ├── adminDashboard.ts
 ├── articles.ts
 ├── caseStudies.ts
 ├── content-plan.json
 ├── customerData.ts
 ├── diyServices.ts
 ├── faqData.ts
 ├── glossarData.ts
 ├── guidesData.ts
 ├── high-priority-keywords.json
 ├── innovations.ts
 ├── keyword-analysis.json
 ├── local-keywords.json
 ├── localContent.ts
 ├── offers.ts
 ├── pageContent.ts
 ├── pageRoutes.ts
 ├── painPoints.ts
 ├── pricingPackages.ts
 ├── products.generated.ts
 ├── reviews.ts
 ├── seo-history.json
 ├── seo-report.json
 ├── seo-workflow-log.json
 ├── seoConfig.ts
 ├── services.ts
 ├── testimonials.ts
 ├── useCases.ts
 └── webinarsData.ts
```

## Inhaltstypen & Nutzung

| Datei | Zweck | Verwendet von |
| --- | --- | --- |
| `pageRoutes.ts` | Mapping zwischen Seitennamen und Routenpfaden | `App.tsx`, `components/Navigation` |
| `pageContent.ts` | Statische Hero- und Fließtexte pro Seite | `pages/*` Komponenten |
| `localContent.ts` | Standort-spezifische Inhalte inkl. Geo-Daten | Standortseiten (`components/StandortPage`) |
| `seoConfig.ts` | Zentrale SEO-Definitionen (Title, Description, Canonical, Schema) | `components/SEOManager`, `resolveSeoForPage` |
| `high-priority-keywords.json`, `keyword-analysis.json`, `local-keywords.json` | Keyword-Pools & Cluster | SEO-Automation Scripts, Keyword-Reports |
| `seo-history.json`, `seo-report.json`, `seo-workflow-log.json` | Historisierte SEO-KPIs & Aktionen | Dashboards, `server/services/seoReportingService.ts` |
| `content-plan.json` | Quartals-Content-Plan | `scripts/content-pipeline.ts`, Redaktionsplanung |
| `articles.ts`, `guidesData.ts`, `useCases.ts`, `caseStudies.ts` | Redaktionelle Inhalte für Blog/Wissenshub | Komponenten `UseCases`, `ProjectGallery`, `WissenMegaMenu` |
| `pricingPackages.ts`, `offers.ts`, `products.generated.ts`, `diyServices.ts` | Angebots- und Produktdaten | `PricingSection`, `OfferCard`, `ComparisonTray` |
| `faqData.ts`, `testimonials.ts`, `reviews.ts` | Trust & Support Inhalte | `FAQ`, `Testimonials`, `Reviews` |
| `webinarsData.ts` | Event- & Webinar-Plan | `PromoBanner`, `CommandHub`, Newsletter |
| `adminDashboard.ts`, `customerData.ts` | Aggregierte Kennzahlen, Personas | Dashboard-Komponenten, Automationen |

## Typisierung & Validierung

- Alle `.ts`-Dateien exportieren typisierte Datensätze (Interfaces in `types.ts`).
- JSON-Dateien sollten durch `zod`-Schemas validiert werden; Script `scripts/validate-data.ts` (Backlog) vorgesehen.
- Bei größeren Strukturen (z. B. Produkte) empfehlen wir generische Typen (`Product`, `FeatureFlag`), um UI-Fehler frühzeitig zu erkennen.

## Änderungsworkflow

1. Datenquelle lokalisieren (`data/...`).
2. Bei JSON: Editor mit JSON-Schema oder VS Code Snippets verwenden.
3. Für neue Seiten: `pageContent.ts` + `pageRoutes.ts` erweitern.
4. SEO-Metadaten ergänzen in `seoConfig.ts`. Immer `slug`, `title`, `description`, `canonical`, optional `structuredData`.
5. App testen (`npm run dev`) und Seitenaufruf validieren (Console + Lighthouse).
6. Optional: `npm run wiki-sync` ausführen, um Dokumentation zu aktualisieren.

## Lokalisierung & Geo-Daten

- `localContent.ts` enthält `PRIMARY_SERVICE_REGIONS` mit Koordinaten, Postleitzahlen und Unique Selling Points.
- Konvention: `slug` ohne Sonderzeichen (`berlin`, `muenchen`).
- Schema `LocalBusiness` wird in `seoConfig.ts` generiert (Adresse, Geo-Koordinaten, Öffnungszeiten).

## SEO-spezifische Datenpunkte

- `buildLocalBusinessSchema(region)`: erzeugt JSON-LD basierend auf `localContent`.
- `buildSpeakableSchema(faqEntries)`: generiert `SpeakableSpecification` für Voice Search.
- Ladezeiten-Optimierung: long-tail Keywords (JSON) werden im Frontend lazy geladen und erst bei Bedarf gerendert.

## Datenpflege-Backlog

- 🔄 Automatisierte Konsistenzprüfungen (z. B. `npm run data:check`): Prüft auf fehlende Felder, Duplikate.
- 🔄 Übersetzungen für EN/FR: neue Datenstrukturen `translations/*.json`.
- 🔄 Versionierung durch Git Submodules oder CMS-Integration (Sanity/Contentful).

## Data Governance

- Änderungen immer via Pull Request, automatisierte Tests für kritische Pfade (`pricing`, `seoConfig`).
- Sicherstellen, dass sensible Kundendaten pseudonymisiert sind (`customerData.ts`).
- Backups: Repository-Klon & optional Cloud Storage (z. B. Google Cloud Storage Bucket) für JSON-Exporte.

---
_Stand: 26.09.2025_