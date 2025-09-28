# SEO, Geo Targeting & Answer Engine Playbook

## Überblick
- **Zentrales SEO-Management:** Alle Routen werden über `resolveSeoForPage` mit konsolidierten Meta-Daten, Hreflang-Einträgen, Open-Graph/Twitter-Karten und strukturierten Daten versorgt.
- **Regionale Ausspielung:** Die neuen Hilfsfunktionen generieren automatisch LocalBusiness-Branches, Geo-Kreise und regionale Service-Schemata für die Kernmärkte in Deutschland.
- **Answer Engine Ready:** FAQ-, HowTo- und Speakable-Markups decken zentrale Conversion-Seiten ab (Services, Preise, Finanzierung, Guides, Artikel, FAQ).

## Geo Targeting
- `PRIMARY_SERVICE_REGIONS` deckt jetzt ein flächendeckendes DACH-Netz ab (u. a. Berlin, München, Wien, Zürich, Genf) inklusive Stadt, Bundesland/Kanton, Koordinaten und Radius.
- `buildLocalBusinessBranches` erweitert die Website um lokale Niederlassungs-Schemata (GeoCircle, Service-Angebote, Parent Organisation).
- `buildRegionalServiceSchemas` erzeugt für jede Dienstleistung regionale Service-Objekte inkl. geplantem Servicegebiet und Kontaktkanal.
- `serviceArea`- und `hasMap`-Attribute im globalen LocalBusiness-Schema stärken lokale Relevanz.
- Hreflang-Alternativen wurden um `de-AT` und `de-CH` erweitert, sodass Inhalte für Nutzer:innen in Deutschland, Österreich und der Schweiz ausgespielt werden können.

## Answer Engine Optimization
- `buildFaqSchema` nutzt `faqData`, um kontextbezogene FAQ-Seiten für Services, Preise, Finanzierung und Kontakt zu generieren.
- `buildSpeakableSchema` liefert Speakable-Spezifikationen für Start-, Service-, Wissens- und Detailseiten – ideal für Sprachassistenten und generative Suchergebnisse.
- Dynamische Detailseiten (Artikel, Guides, Use Cases) erhalten zusätzlich Speakable-Markup.
- Bestehende HowTo-Schemata (z. B. Fördermittel-Check) bleiben erhalten und werden weiter dedupliziert.

## Erweiterung für neue Seiten
1. **Page-Typ bestimmen:** Erweiterung in `pageSpecificSEO` vornehmen.
2. **Region zuweisen:** Falls ein Standortbezug benötigt wird, `buildRegionalServiceSchemas` mit passendem Service-Namen nutzen.
3. **FAQ hinzufügen:** Mit `buildFaqSchema` relevante Fragen einbinden – nach Möglichkeit Einträge in `faqData` ergänzen, statt Freitext zu verwenden.
4. **Speakable definieren:** CSS-Selektoren der wichtigsten Überschriften/Absätze übergeben (`buildSpeakableSchema`).
5. **Tests ausführen:** `npm run build` aufrufen und strukturierte Daten mit einem Rich Results Test validieren.

## Validierung & Monitoring
- Nach Deploy: Google Search Console (Local Entities, Enhancement-Reports) beobachten.
- Für lokale Suchergebnisse empfiehlt sich zusätzlich ein Abgleich mit Google Business Profilen und Standortseiten.
- Answer-Engine-Snippets lassen sich mit dem `Rich Results Test` und `Lighthouse` (SEO Audit) prüfen.

## Quick Reference
- **SEO-Setup:** `data/seoConfig.ts`
- **Meta-Ausgabe:** `components/SEOManager.tsx`
- **Fallback Head:** `index.html`
- **Router-Integration:** `App.tsx`

Die aktuelle Struktur lässt sich einfach erweitern, indem neue Hilfsfunktionen oder Datenquellen eingebunden und im Resolver verwendet werden. So bleibt die komplette SEO/GEO/AEO-Logik versionierbar und testbar.
