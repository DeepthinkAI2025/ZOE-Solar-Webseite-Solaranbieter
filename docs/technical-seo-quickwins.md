# Technical SEO Audit – Quick Wins (Sprint 1)

_Aktualisiert: 25. September 2025_

## Überblick
- **Scope:** Vite React App, `index.html`, kritische Components (`SEOManager`, `ImageWithFallback`, `ProjectGallery`, `Hero`), Datenquellen (`seoConfig`).
- **Methodik:** Code Review, Lighthouse-Projektion, Schema-Validierung, Crawlability-Check (XML Sitemap, Robots, Routing).
- **Ziel:** Sofort umsetzbare Tasks für bessere Core Web Vitals, saubere interne Verlinkung, strukturierte Daten ohne Redundanz.

## Quick Win Backlog

| Priorität | Maßnahme | Beschreibung | Owner | Aufwand |
| --- | --- | --- | --- | --- |
| 🔥 | **Third-Party Scripts lazy laden** | ✅ (25.09) Skripte werden jetzt über `loadExternalScript` nur bei Bedarf geladen (Hero, PDF-Exports); blockierende `<script>`-Tags aus `index.html` entfernt. | Markus | 1 Tag (erledigt) |
| 🔥 | **Fonts self-host / preload** | Google Fonts via `fonts.googleapis.com` + kein `font-display: swap` fallback. Fonts per `@fontsource/poppins` integrieren, `<link rel="preload">` für WOFF2 via Vite Assets. | Markus | 0,5 Tag |
| 🔥 | **Hero-Bild Preload** | LCP-Hero-Bilder `Hero`/`PageHero` werden erst via CSS geladen. → `<link rel="preload" as="image">` im jeweiligen Page-Component (`Hero`), LCP Tracking in Lighthouse. | Markus | 0,5 Tag |
| 🔥 | **Interne Linkstruktur prüfen** | Viele CTAs nutzen Buttons ohne `<Link>` (z. B. `FAQ`, `Hero` Chat CTA). → UX + Crawlability verbessern, `to`/`href` ergänzen, OnClick-Fallback beibehalten. | Jasmin | 1 Tag |
| 🔥 | **Schema Deduplizieren** | `seoConfig.ts` generiert `LocalBusiness` Branches + globales Schema. Prüfen, ob IDs unique bleiben (`@id`), `dedupeStructuredData` überall anwenden (z. B. `buildRegionalServiceSchemas`). | Markus | 0,5 Tag |
| 🔥 | **App Shell Lang Attribute** | `SEOManager` setzt `<html lang="de">` dynamisch, aber `index.html` fix `lang="de"`. Für hreflang `de-AT`, `de-CH` `<html>`-Update via `Helmet` wird überschrieben? → Prüfen, ob SSR/Hydration die dynamische Sprache setzt, sonst `helmet.priority` + `useEffect`. | Markus | 0,5 Tag |
| ⚡ | **Sitemap erweitern** | `index.html` verweist auf `/sitemap.xml`, jedoch keine generische Sitemap im Repo. → Build-Step ergänzen (z. B. `npm script` mit `sitemap.js`). | Markus | 1 Tag |
| ⚡ | **Robots TXT prüfen** | Sicherstellen, dass `/robots.txt` generiert (Vite public?). Falls fehlt, in `public/robots.txt` anlegen mit AI-crawl-optimierten Regeln (Allow /api/knowledge). | Markus | 0,5 Tag |
| ⚡ | **Breadcrumb Schema** | Aktuell keine BreadcrumbList Markups. Für `ArticleDetail`, `GuideDetail`, `AnwendungsfallDetail` Breadcrumb-Komponenten + JSON-LD ergänzen. | Jasmin | 1 Tag |
| ⚡ | **Lazy Loading Galerie/Video** | `ProjectGallery` und `PromoVideo` laden Medien sofort. Intersection Observer + `loading="lazy"`, `fetchpriority="low"`. | Markus | 1 Tag |
| ⚡ | **CWV Monitoring** | Lighthouse CI oder `@treosh/lighthouse-ci` Pipeline in GitHub Actions hinterlegen (Budget: LCP ≤ 2,5 s). | Markus | 1,5 Tage |

## Core Web Vitals – Beobachtungen
- **LCP:** Potenziell >3 s durch Globe JS + unoptimierte Hero-Bilder (JPG, 2 MB). → Optimierte WebP + Preload.
- **CLS:** Navigation-Mega-Menu und Hero-Animations klappen ohne reservierten Platz. → `min-height` + `aspect-ratio` setzen.
- **FID/INP:** Buttons mit OnClick (Chat) blocken Hauptthread kaum; Third-party Scripts priorisiert nachladen.
- **TTFB:** Hosting unbekannt → CDN mit Edge Caching, HTTP/2/3 sicherstellen.

## Interne Verlinkung – Quick Checks
- CTA Buttons `Kostenlose Analyse starten` (FAQ) nur JS-Event → zusätzlich Link auf `/kontakt`/`/service-anmeldung-pv`.
- Glossar-Verlinkung (`GlossarLink`) stark, aber nur in FAQ. → Auch `ArticleDetail` via Markdown Parser anreichern.
- Use Cases → Pricing: `UseCases`-Module ohne Link zu `PreisePage` → Interne Links ergänzen.

## Strukturierte Daten – Sofortmaßnahmen
- `dedupeStructuredData` bereits vorhanden, jedoch `buildLocalBusinessBranches` + `buildRegionalServiceSchemas` doppeln `@id` (z. B. `#organization`). → Unique ID pro Objekt (`#branch-berlin`).
- `FAQPage` nutzt eigene Daten, aber `faqData.ts` minimal. → Nach Update `buildFaqSchema` mit neuen Kategorien testen.
- `Speakable` Selektoren: Für neue Landingpages CSS-Klassen definieren (`.speakable-intro`, `.speakable-keyfacts`).

## Validierung
- **Lighthouse:** Zielscore ≥ 95 (Performance, SEO). Tests mobil (Moto G4) & Desktop.
- **Rich Results Test:** Startseite, Pillar Page, neue Landingpages.
- **Crawl:** Screaming Frog für interne Links + hreflang + Schema.
- **Monitoring:** Search Console (Enhancements: FAQ, Breadcrumb, Sitelinks Search Box).

## Nächste Schritte
1. Third-Party Scripts entkoppeln → PR erstellen (Markus + Dev).  
2. Fonts & Hero-Bilder optimieren (Dev-Task, 30.09).  
3. Interne Links & CTA-Links in Komponenten ergänzen (Jasmin).  
4. Schema-IDs prüfen und deduplizieren (Markus).  
5. Sitemap/Robots Setup finalisieren (Dev + Ops).  
6. Lighthouse CI Pipeline konzipieren (Entwurf bis 02.10).

---
_Bitte Umsetzungsschritte in Jira verlinken und nach Deployment Screenshots/Reports im Task Board ablegen._
