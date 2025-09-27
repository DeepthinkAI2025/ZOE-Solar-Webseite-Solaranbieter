# Komponenten-Katalog

Dieser Katalog fasst alle UI-Komponenten und ihre Einsatzzwecke zusammen. Komponenten liegen unter `components/` und sind typisiert über `types.ts`.

## Navigationskomponenten

| Datei | Beschreibung | Besonderheiten |
| --- | --- | --- |
| `Header.tsx` | Sticky Top-Navigation, bündelt Logo, Primary CTA, Mega Menüs | Responsives Verhalten, dunkler/heller Modus |
| `SubHeader.tsx` | Sekundäre Navigationsleiste für B2B/B2C-Kontext | Toggelt Key Messages |
| `MegaMenu.tsx` | generischer Wrapper für Mega-Menüs | nimmt `sections`-Prop entgegen |
| `ProductsMegaMenu.tsx`, `PreiseMegaMenu.tsx`, `PhotovoltaikMegaMenu.tsx`, `EMobilitaetMegaMenu.tsx`, `WissenMegaMenu.tsx`, `AnwendungsfaelleMegaMenu.tsx`, `ElektroMegaMenu.tsx` | Spezifische Mega-Menüs für Segmentnavigation | dynamische Daten aus `data/products.generated.ts`, `data/services.ts` |
| `ServiceNavigation.tsx`, `UseCaseNavigation.tsx`, `ManufacturerNavigation.tsx` | Tiefere Navigationslayer (Filter, Tabs) | Keyboard-Navigation unterstützt |

## Hero & Storytelling

| Datei | Beschreibung |
| --- | --- |
| `Hero.tsx` | Startseiten-Hero mit Video/Visuals und Primär-CTA |
| `PageHero.tsx` | Wiederverwendbarer Hero für Unterseiten, nimmt `pageKey` & Content Props entgegen |
| `PromoBanner.tsx` | Promotion-Stripes (z. B. Aktionen, Webinare) |
| `PromoSection.tsx`, `PromoVideo.tsx` | Kampagnen-Abschnitte mit Medienintegration |
| `AnimatedSection.tsx` | Wrapper für Scroll-basierte Animationen |

## Funnels & Formulare

| Datei | Einsatzzweck |
| --- | --- |
| `AIChatFunnel.tsx` | Conversational Lead Funnel (Chat UI + Step Engine) |
| `PartnerApplicationFunnel.tsx`, `JobApplicationFunnel.tsx` | Bewerbungsprozesse mit Progress Bar |
| `ContactForm.tsx` | Kontaktformular (Validierung, Spam-Schutz Backlog) |
| `OfferPopup.tsx`, `OfferCard.tsx`, `ComparisonTray.tsx`, `ComparisonModal.tsx` | Produktvergleich & Angebotsanfrage |
| `ExitIntentPopup.tsx` | Exit-Intent CTA mit Incentives |

## Interaktive Tools

| Datei | Beschreibung |
| --- | --- |
| `Calculator.tsx` | Ertrags-/Kostencalculator (Inputfelder, Chart-Output) |
| `CO2Calculator.tsx` | Emissionsrechner mit Visualisierung |
| `ServiceWizard.tsx` | Schritt-für-Schritt Wizard für Serviceempfehlung |
| `ProductConfigurator.tsx` | Konfiguriert PV-Pakete inkl. Zusatzleistungen |
| `InteractiveGuide.tsx` | Geführte Tour durch Produkte oder Prozesse |

## Content & Social Proof

| Datei | Beschreibung |
| --- | --- |
| `Testimonials.tsx`, `Reviews.tsx` | Kundenstimmen mit Sternebewertung |
| `CaseStudyCard.tsx` (innerhalb `ProjectGallery`) | Highlights aus Fallstudien |
| `InnovationsSlider.tsx` | Carousel für Produktneuheiten |
| `ProjectGallery.tsx` | Bilder/Referenzen Portfolio |
| `VideoSection.tsx`, `YouTubeEmbed.tsx` | Video-Einbindungen |
| `FAQ.tsx` | Accordion mit Schema.org FAQ Auszeichnung |

## Service- & Produktmodule

| Datei | Beschreibung |
| --- | --- |
| `Solutions.tsx`, `Technology.tsx`, `ProductsPreview.tsx` | Produkt- und Technologievorschau |
| `ZeroDownPayment.tsx` | Finanzierungsmodell Darstellung |
| `PricingSection.tsx` | Preispläne, Bundles & Add-ons |
| `Process.tsx` | Schritt-für-Schritt Darstellung des Projektprozesses |
| `PainPoints.tsx`, `ProblemSolution.tsx` | Narrative zur Problem-/Lösungsdarstellung |

## Utilities & Layout

| Datei | Beschreibung |
| --- | --- |
| `ImageWithFallback.tsx` | Bildkomponente mit Lazy Loading & Fallback |
| `ScrollToTopButton.tsx` | Scroll-to-top Verhalten |
| `AnimatedSection.tsx` | Intersection Observer, animierte Einblendungen |
| `Footer.tsx` | Globaler Footer mit Navigation, Kontakt, Trust Badges |
| `GlossarLink.tsx` | Inline-Verlinkung zum Glossar mit Tooltip |

## Spezielle Module

| Datei | Beschreibung |
| --- | --- |
| `CommandHub.tsx` | interner Command Pallet Launcher (Shortcut gesteuert) |
| `AIRecommender.tsx` | KI-basierte Produktempfehlung |
| `Dashboard/*` | Admin- und Monitoring Widgets |
| `ManufacturerNavigation.tsx` | Filter nach Hersteller-Kompetenzen |
| `PromoVideo.tsx` | Autoplay/Modal Video mit Overlay CTA |

## Konventionen & Best Practices

- Komponenten sind weitgehend **präsentational**; Business-Logik in Hooks/Services kapseln.
- Props typsicher mit Interfaces in `types.ts` definieren (`export interface PricingPlan { ... }`).
- Ordnerstruktur flach halten. Für komplexe Features Unterordner (z. B. `Dashboard/`).
- Bei komplexen Komponenten (z. B. `AIChatFunnel`) README im Komponentenordner ergänzen.
- CSS nur via Tailwind-Klassen; seltene globale Styles in `index.css`.

## Erweiterung des Katalogs

1. Neue Komponente anlegen.
2. Story / Beispiel in README oder MDX (Backlog: Storybook).
3. Test erstellen (`Component.test.tsx`).
4. Docs in dieser Seite ergänzen (kurze Beschreibung + Besonderheiten).

---
_Stand: 26.09.2025_