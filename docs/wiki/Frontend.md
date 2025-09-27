# Frontend-Architektur & Implementierungsleitfaden

Die Frontend-Schicht von ZOE Solar ist eine modular aufgebaute React-19-Anwendung auf Basis von Vite und TailwindCSS. Dieses Kapitel beschreibt Aufbau, Renderpfad, zentrale Komponenten und Entwicklungsrichtlinien.

## Technologiestack

| Ebene | Technologie | Zweck |
| --- | --- | --- |
| Build & Dev Server | Vite 6 | Superschnelle HMR, ESM-Unterstützung, bundlerless Dev Experience |
| Programmiersprache | TypeScript 5.8 | Strikte Typisierung für Komponenten, Datenmodelle und Utility-Funktionen |
| View-Layer | React 19 mit React Router DOM 7 | Komponentenbasierte UI, File-basiertes Routing via `pages/` + `data/pageRoutes.ts` |
| Styling | TailwindCSS 3.4 + `index.css` | Utility-first Styles, zentrale Design Tokens und Animationen |
| SEO/Meta | `react-helmet-async` | Serverseitig-kompatible Head-Verwaltung (`components/SEOManager.tsx`) |
| Visual Assets | lokale SVG/PNG + `ImageWithFallback` | Robustes Lazy Loading, Fallback-Handling |
| Formulare & Interaktionen | Native HTML + Eigenkomponenten | Minimale Abhängigkeiten, Fokus auf Barrierefreiheit |

## Einstiegspunkte

- `index.tsx`: Bootstrapping der React-Anwendung, Einbettung des `<App />`-Containers und globaler Provider (Helmet, Router).
- `App.tsx`: Globale Layoutkomposition (Header, Footer, Routing-Switch), Einbindung von `ScrollToTopButton`, Cookie Banner etc.
- `fonts.ts` & `index.css`: Definition von Font-Faces, CSS-Variablen, globale Utility-Klassen und Scroll-Behavior.

## Routing & Seitenkomposition

- Routing-Tabelle lebt in `data/pageRoutes.ts` (Export `pageToPath`).
- Jede Datei in `pages/` repräsentiert eine eigenständige Landingpage oder einen Bereich (z. B. `PhotovoltaikPage.tsx`, `FallstudienPage.tsx`).
- `PageHero`, `PromoSection`, `UseCaseNavigation` u. a. kapseln wiederkehrende Layout-Bausteine.<br/>
- Standortseiten (`StandortBerlinPage.tsx` etc.) konsumieren lokale Inhalte aus `data/localContent.ts` und generieren SEO-Metadaten via `resolveSeoForPage`.

## Zustands- & Datenfluss

- Primär *props down, events up*: Komponenten erhalten Daten über Properties, Hooks dienen eher für lokale Interaktion.
- Zentraler SEO-State wird durch `resolveSeoForPage` (siehe `data/seoConfig.ts`) generiert und via `SEOManager` gerendert.
- Interaktive Funnel (AI Chat, Rechner) verwenden lokale `useState`/`useReducer`-Hooks und greifen optional auf externe Services (`services/faproService.ts`) zu.
- Async-Daten (z. B. Dashboard-APIs) werden über dedizierte Hooks innerhalb der Komponenten konsumiert (Fetch, axios, `useEffect`).

## Komponenten-Kategorien

| Kategorie | Beispielkomponenten | Beschreibung |
| --- | --- | --- |
| Navigation & Struktur | `Header`, `MegaMenu`, `ServiceNavigation`, `SubHeader`, `Footer` | Globale Navigation, Sticky Header, Footer-Layout, schnelle Deep-Links |
| Hero & Storytelling | `Hero`, `PageHero`, `PromoBanner`, `PromoSection`, `ProblemSolution`, `PainPoints` | Einstieg mit Value Proposition, Visual Storytelling, CTA-Blöcke |
| Funnel & Konversion | `AIChatFunnel`, `PartnerApplicationFunnel`, `JobApplicationFunnel`, `OfferPopup`, `ContactForm` | Qualifizierung, Lead-Eintrittspunkte, Formular-Erlebnis |
| Tools & Rechner | `Calculator`, `CO2Calculator`, `ZeroDownPayment`, `ProductConfigurator`, `ServiceWizard` | Interaktive Mehrwerte mit dynamischen Berechnungen |
| Content & Beweise | `Testimonials`, `ProjectGallery`, `CaseStudyPage`, `InnovationsSlider`, `VideoSection` | Social Proof, Success Stories, Medien-Integration |
| Wissensvermittlung | `FAQ`, `GlossarLink`, `UseCases`, `Technology`, `Solutions` | FAQ-Hubs, Glossarlinks, modulare Use-Case-Bausteine |
| Lokalisierung | `StandortPage`, `Geo`-spezifische Komponenten | Regionale Landingpages inkl. Hreflang & LocalBusiness-Schema |

## UI/UX-Richtlinien

1. **Barrierefreiheit**
   - Verwende semantische HTML-Strukturen (`<section>`, `<nav>`, `<header>`, `<main>`).
   - Buttons & Links stets mit ARIA-Labels versehen, wenn Kontext allein nicht genügt.
   - Formular-Komponenten (z. B. `ContactForm`) nutzen Labels, Fehlerzustände und Tastatur-Navigation.

2. **Tailwind-Conventions**
   - Design Tokens via CSS-Variablen (`:root` in `index.css`) pflegen.
   - Utility-Klassen gruppieren: Layout → Typografie → Farben → Effekte.
   - Eigene Komponenten-spezifische Klassen in `index.css` oder lokale `<style>`-Pseudo-Komponenten vermeiden.

3. **Responsive Patterns**
   - Layouts basieren auf Flex/Grid und Tailwind-Breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).
   - Für komplexe Sektionen (`PromoBanner`, `Testimonials`) gibt es mobil-optimierte Varianten (Stacked Layouts, Carousels).
   - Bilder werden über `ImageWithFallback` bereitgestellt (Lazy Loading + Placeholder).

4. **SEO & Structured Data**
   - Jede Seite nutzt `SEOManager` + `resolveSeoForPage`, sodass Title, Description, canonical und strukturierte Daten konsistent sind.
   - FAQ-Komponenten liefern Speakable-Text (siehe `data/seoConfig.ts` – `buildSpeakableSchema`).
   - Standortseiten regen `LocalBusiness`-Schema und Geo-Metadaten an (`PRIMARY_SERVICE_REGIONS`).

## State-internationale Besonderheiten

- **AI Chat Funnel**: orchestriert mehrstufige Konversation, verwendet ein flexibles Szenenmodell (`steps`, `actions`). Integration mit Vertex AI (`@google/genai`) optional aktivierbar.
- **Comparison Tray & Modal**: synchronisieren gewählte Produkte via Context-ähnlichem Pattern (Props + Callback). Bietet Up-Selling.
- **CommandHub**: dient als interner Launcher (z. B. für Admins) und kombiniert Tasten-Shortcuts mit Schnellnavigation.

## Entwicklung & Testing

- Lokale Entwicklung: `npm run dev` (Vite Server, Proxy-Konfiguration optional über `vite.config.ts`).
- Storybook ist *nicht* im Repo; Vorschau erfolgt direkt über isolierte Routen / Dummy-Daten.
- Für neue Komponenten: 
  1. Struktur in `components/` anlegen.
  2. Optional `types.ts` erweitern (z. B. für Data-Modelle).
  3. Unit- oder Screenshottests (Playwright/Cypress) können ergänzt werden – Hooks in `package.json` stehen bereit.

## Erweiterungs-Backlog

- **Design Tokens** in eigene Datei (`tokens.css` oder `tailwind.config.js` → `theme.extend`) auslagern.
- **Storybook/Chromatic** für visuelle Regressionstests integrieren.
- **Internationale Versionen**: i18n-Framework (z. B. `react-i18next`) anschließen, Hreflang-Erweiterungen pflegen.
- **Framer Motion** oder `react-spring` für Micro-Interactions.

---
_Stand: 26.09.2025_