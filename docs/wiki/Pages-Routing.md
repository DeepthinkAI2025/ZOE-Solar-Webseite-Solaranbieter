# Seiten & Routing-Handbuch

Diese Seite beschreibt die Navigationsstruktur, Page-Kompositionen und URL-Konventionen der ZOE Solar Website.

## Routing-Quelle

- Primäre Definition in `data/pageRoutes.ts`:
  ```ts
  export const pageToPath = {
    home: '/',
    photovoltaik: '/photovoltaik',
    agriPv: '/agri-pv',
    eMobilitaet: '/e-mobilitaet',
    wissen: '/wissen',
    blog: '/blog',
    jobs: '/jobs',
    partner: '/partner',
    kontakt: '/kontakt',
    // ... weitere Seiten
  } satisfies Record<PageKey, string>;
  ```
- `types.ts` definiert `PageKey` Union für Typ-Sicherheit.
- `App.tsx` nutzt `pageToPath` für `<Route>`-Definitionen.

## Seitenklassen

| Kategorie | Beispiel | Zweck |
| --- | --- | --- |
| Landingpages | `PhotovoltaikPage`, `AgriPVPage` | Produkt-/Segment-spezifische Conversion-Pages |
| Wissensseiten | `WissenPage`, `GlossarPage` | Content Hub für Education |
| Interaktive Tools | `CalculatorPage`, `CO2CalculatorPage` (Komponenten) | Lead-Gen & Value Added Tools |
| Standorte | `StandortPage` (Dynamisch mit Props) | Stadt/Region Landingpages |
| Karriere/Partner | `JobApplicationFunnel`, `PartnerApplicationFunnel` | Recruitment & Partner-Akquise |
| Rechtliches | `AGBPage`, `DatenschutzPage`, `ImpressumPage` | Compliance |

## Seitendesign & Aufbau

- Seiten liegen unter `pages/`. Jede Seite exportiert `React.FC`.
- Standardstruktur:
  ```tsx
  export const PhotovoltaikPage = () => (
    <>
      <SEOManager pageKey="photovoltaik" />
      <Header />
      <Hero variant="photovoltaik" />
      <ProblemSolution />
      <ProductsPreview category="pv" />
      <PricingSection plans={pricingPackages.photovoltaik} />
      <FAQ entries={faqData.photovoltaik} />
      <Footer />
    </>
  );
  ```
- `SEOManager` injiziert Metadaten auf Basis von `seoConfig.ts`.

## URL-Konventionen

- **Slug-Format:** Kleinschreibung, Bindestriche, keine Umlaute (`/e-mobilitaet`).
- **Struktur:** `/segment/feature` oder `/wissen/<thema>`.
- **Standorte:** `/standorte/<stadt>` (`/standorte/berlin`).
- **Tracking:** Parameter über UTM, keine Sonderzeichen (`?utm_source=...`).

## Navigationselemente

- `components/Header.tsx` & `MegaMenu`: Hauptnavigation mit Mega-Menüs (Produkte, Services, Wissen).
- `ServiceNavigation`, `UseCaseNavigation`: Tiefere Ebenen, filtern Content nach Segment.
- Breadcrumbs optional (Backlog) für lange Content-Pfade.

## Dynamische Inhalte

- Standortseiten: Daten aus `data/localContent.ts`, Maps-Links, regionale Testimonials.
- Use Cases: `useCases.ts` -> `UseCases` Komponente zeigt Cards mit Deep Links.
- Blog/Artikel: Aktuell statisch, Integration mit Headless CMS (Backlog).

## Redirects & Canonicals

- Canonical-URLs in `seoConfig.ts` pro Page Key.
- 301 Redirects über Hosting (Vercel `vercel.json` Backlog) oder Express Middleware.
- Parametrische Routen minimal halten, um Duplicate Content zu vermeiden.

## Erweiterungsverfahren

1. Neue Seite erstellen (`pages/NewFeaturePage.tsx`).
2. Routingschlüssel in `types.ts` + `pageRoutes.ts` ergänzen.
3. `seoConfig.ts` erweitern (Title, Description, Schema).
4. Navigation aktualisieren (`Header`, `MegaMenu`, Footer).
5. Content-Daten (`pageContent.ts`, `faqData.ts`, etc.) pflegen.
6. Tests & QA durchführen.
7. Dokumentation (`docs/wiki/Pages-Routing.md`) aktualisieren (diese Seite).

## Backlog

- 🔄 Automatisiertes Routing über File System (Vite Plugin).
- 🔄 Breadcrumb-Komponente.
- 🔄 URL-Canonicals automatisiert durch Router Hook.

---
_Stand: 26.09.2025_