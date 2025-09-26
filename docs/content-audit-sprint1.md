# Content-Audit & Themenplan – Sprint 1

_Aktualisiert: 25. September 2025_

## 1. Schnellüberblick
- **Ziel:** Nordstern-Platzierungen durch klare Themenarchitektur, frische Inhalte und lokale Relevanz.
- **Scope:** Alle Kernseiten (`pages/`), Wissensressourcen (`data/`), Komponenten mit Content-Fokus (`components/`).
- **Methodik:** 80/20 Audit (Traffic-Priorisierung, Funnel-Relevanz), Gap-Analyse zu Suchintentionen, Ableitung eines konkreten Redaktionsplans.

## 2. Content-Inventar & Bewertung

| Kategorie | Beispielseiten/Module | Status | Beobachtungen | Maßnahmen (Sprint 1) |
| --- | --- | --- | --- | --- |
| **Pillar / Funnel-Top** | `HomePage`, `PhotovoltaikPage`, `LeistungenPage`, `WissensHubPage` | Stark, aber ungleichmäßig gepflegt | Storytelling modern, jedoch kaum aktualisierte Zahlen (Strompreise, CO₂, Förderung). | Zahlen & Quellen Q3/2025 aktualisieren; Video-/Grafikmodule einbauen. |
| **Funnel-Mid (Use Cases & Branchen)** | `AgriPVPage`, `ElektroPage`, `EMobilitaetPage`, `AnwendungsfaellePage` | Uneinheitlich | Gute Argumentation, aber wenig Beweise (Case Studies, Kennzahlen). | Pro Use Case mind. 1 Referenzprojekt + CTA „Experten-Call“. |
| **Funnel-Bottom (Preise, Finanzierung, Kontakt)** | `PreisePage`, `FinanzierungPage`, `KontaktPage`, `Service*`-Seiten | Lückenhaft | Pricing-Komponenten vorhanden, jedoch keine aktuelle Tabellen/Calculator Daten. | Pricing-Komponenten mit aktuellen ROI-Beispielen, Financing-Szenarien ergänzen. |
| **Trust & Company** | `UeberUnsPage`, `TeamPage`, `WarumZoeSolarPage`, `PressePage` | Solide, statisch | Keine aktualisierten Team-/Pressebilder, keine Awards/Certs. | Team-Bios + Zertifizierungen + CSR-Erfolge ergänzen. |
| **Wissensressourcen** | `AktuellesPage`, `WissensHubPage`, `ArticleDetailPage`, `GuideDetailPage`, `data/articles.ts` | Unterausgeschöpft | Viele Datenquellen angelegt, jedoch keine regelmäßige Publikation. | Redaktionsplan umsetzen, `articles.ts` mit neuen Artikeln füllen. |
| **Interactive Assets** | `Calculator`, `CO2Calculator`, `ProductConfigurator` | Differenzierend | Starke UX, aber kaum interne Verlinkung und keine begleitenden HowTo-Inhalte. | Zugehörige Content-Hubs (HowTo, Glossar) aufbauen; CTAs in Pillar Pages platzieren. |
| **Lokale Relevanz** | Noch keine dedizierten Landingpages | Fehlend | Regionale Signals via Schema vorhanden, aber keine lokalisierten Landingpages. | Landingpage-Konzept (siehe unten) implementieren. |
| **FAQ/Speakable** | `components/FAQ`, `data/faqData.ts`, `seoConfig` | Minimale Basis | Nur 6 Fragen, Speakable selektoren statisch. | FAQ-Datenbank erweitern (siehe Backlog), Speakable aktualisieren. |

### Content-Gaps (Kurzliste)
1. **Förderung 2025+**: Inhalte zu EEG 2025, steuerliche Änderungen fehlen.  
2. **Branchen-Case Studies**: Industrie, Logistik, Landwirtschaft benötigen frische Zahlen.  
3. **Lokale Informationen**: Förderprogramme Berlin, München, Zürich werden nicht ausgespielt.  
4. **Videos & Audiovisuelles**: Keine Onpage Videos zu Installation/Partnern → Potenzial für AI Overviews.  
5. **FAQ-Reichweite**: Kein Content zu Wartung, Monitoring, Garantien, PPA, Versicherung.

## 3. Redaktionsplan (4 Wochen)

| Woche | Fokus | Formate | Responsible | Notizen |
| --- | --- | --- | --- | --- |
| KW 40 (30.09 – 04.10) | Förderung & Finanzen | Pillar „Photovoltaik Komplettpaket“ (Jasmin – in Arbeit), Artikel „Förderung Solarunternehmen 2025“, FAQ-Update | Jasmin, Sven | Zahlen aus BMWK/BAFA einpflegen, interne Links zu Fördermittel-Seiten. |
| KW 41 (07.10 – 11.10) | Branchen-Authority | Case Study „Logistikzentrum Berlin“, Artikel „Solar für Gewerbeparks“, Video-Skript Produktkonfigurator | Jasmin, Nina | Video-Dreh mit Produktteam planen, Zitate Kund:innen einholen. |
| KW 42 (14.10 – 18.10) | Lokale Relevanz | Landingpages Berlin/München/Zürich (Text, Testimonials), Blog „Regionale Förderung Berlin“ | David, Jasmin | Regionale Förderinfos + lokale Partnerliste integrieren. |
| KW 43 (21.10 – 24.10) | Conversion-Nähe | Finanzierungsrechner-Content, Whitepaper „Solarpark ROI 2025“, FAQ & Speakable Release | Jasmin, Sven | Whitepaper als Gated Content (Leadmagnet), FAQ in `faqData.ts` deployen. |

## 4. Regionale Landingpage-Konzept (Berlin, München, Zürich)

### Grundgerüst (React-Komponenten)
1. `PageHero` – Lokalisierte H1, Subline, CTA „Standortanalyse sichern“.
2. `PainPoints` – Branchen-spezifisch (Industrie, Logistik, Gewerbe) mit lokalen Statistiken.
3. `ProjectGallery` – Mindestens 2 regionale Case Cards (Fotos, KPIs, Förderquote).
4. `PricingSection` – Lokale Förderungen (z.B. IBB Berlin, KfW 270) und Beispiel-Kalkulation.
5. `Testimonials` – Kundenstimme aus Region + Videostatement.
6. `ServiceWizard` – CTA zur Bedarfsanalyse (Formular mit Standort-Feld).
7. `FAQ` – Regionale FAQ (Integrationen via Filter `faqData` → Kategorie `Region`).
8. `ContactForm` – Dedizierte Standort-Hotline, Google Map Einbettung (mit `hasMap`).

### Content-Blöcke pro Stadt
- **Berlin**
  - Förderungen: IBB-Energieförderung, Berliner Energieagentur Programme.
  - Kennzahlen: Durchschnittliche Globalstrahlung 1.055 kWh/m², Strompreisindex Berlin 2025.
  - Case: „Logistikzentrum Spandau – 1,2 MWp, 64 % Eigenverbrauch“.
  - Partner: Berliner Stadtwerke, EnergyHub Berlin.

- **München**
  - Förderungen: Stadtwerke München Förderprogramm Solar, BAYERN Innovativ.
  - Kennzahlen: Solarstrahlung 1.170 kWh/m², Gewerbestrompreis Bayern 27 ct/kWh.
  - Case: „Gewerbepark Freimann – 850 kWp, Peak-Shaving Batterie“.
  - Partner: Handwerkskammer München, Bayern Innovativ.

- **Zürich**
  - Förderungen: Stadt Zürich Förderprogramm Gebäudesanierung, Pronovo Einmalvergütung.
  - Kennzahlen: Solarstrahlung 1.150 kWh/m², Stromkosten CH Gewerbe 24 Rp./kWh.
  - Case: „Logistik Hub Altstetten – 600 kWp, PPA-Modell“.
  - Partner: EWZ, Energie 360°.

### SEO & UX Anforderungen
- Einzigartige Texte (>800 Wörter pro Landingpage).
- Schema: `LocalBusiness`, `Service`, `FAQ` (regional gefiltert), `Review`.
- Hreflang: `de-DE`, `de-AT`, `de-CH` plus kanonische URL.
- Ladezeit: ≤2,5 s LCP (Bilder WebP, Lazy Load `ProjectGallery`).
- CTA-Folge: Hero → Förderbox → Referenzen → FAQ → Kontakt (max. 2 Klicks zur Conversion).

## 5. Nächste Schritte
1. Pillar Page & Cluster-Inhalte in KW 40 fertigstellen (Redaktion + Grafiken).  
2. Landingpage-Templates vorbereiten (David + Dev) – Re-Use `PageHero`, `Testimonials`, `ContactForm`.  
3. Content-Briefings für regionale Landingpages an Texter:innen senden (Deadline 04.10).  
4. FAQ/Speakable Updates mit Daten aus diesem Audit füttern (siehe separates Backlog).  
5. KPI-Tracking: Content-Publishing ggf. als Ereignis in GA4 (Sven).  

---
_Bei Anpassungen bitte Datum + Kurznotiz im Change-Log ergänzen._
