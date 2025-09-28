# GBP & Verzeichnis-Offensive – Sprint 1

_Aktualisiert: 25. September 2025_

## Zielsetzung
- Google Business Profile (GBP) für Kernstädte (Berlin, Hamburg, München, Köln, Frankfurt, Stuttgart, Wien, Graz, Zürich, Basel) optimieren oder neu aufsetzen.
- Branchen- und Bewertungsverzeichnisse (DACH) einheitlich pflegen (NAP-Konsistenz, Medien, Leistungen).
- Lokale Sichtbarkeit, Reviews und Backlinks steigern (Lokale SERPs + Map Pack + AI Overviews).

## Verantwortlichkeiten
- **Lead:** David Aigner (Geo/Local Manager)
- **Support:** Nina Duarte (PR & Partnerships), Jasmin Roth (Content), Sven Hollmann (Analytics)
- **Dev-Support:** Markus Feld (Schema, Tracking)

## Aktionsplan (Sprint 1)

| Phase | Zeitraum | Aufgaben | Owner |
| --- | --- | --- | --- |
| Vorbereitung | 25.09 – 27.09 | Standortdaten + NAP-Template finalisieren (Adresse, Telefon, Öffnungszeiten). | David |
| Assets | 26.09 – 30.09 | Foto-Shooting/Pressebilder aktualisieren, 3D-Renderings, Logo-Varianten 1080×1080, Kurzvideos. | Nina |
| GBP Setup | 27.09 – 03.10 | Profil ausfüllen, Kategorien ("Solaranbieter", "Solaranlagen-Installateur"), Produkte & Leistungen listen, FAQ einpflegen. | David |
| Content | 30.09 – 07.10 | GBP-Posts (Förderprogramme, Projekte, Events), wöchentlicher Publishing-Plan. | Jasmin |
| Reviews | 01.10 – 07.10 | Kundenreview-Kampagne (automatisierte E-Mail nach Projektabschluss), Antwortvorlagen. | Nina |
| Tracking | 04.10 – 07.10 | UTM-Parameter, GBP-URL-Routing (`/standort/berlin`), GSC Property für Standort-URLs. | Sven |
| Verzeichnisse | 01.10 – 10.10 | Einträge/Updates in Top-Verzeichnissen (siehe Liste), NAP checken, Screenshots archivieren. | David |

## GBP Checkliste (je Standort)
1. Geschäftsname: „ZOE Solar GmbH – [Stadt]“
2. Kategorie: Primär „Solaranlagenanbieter“, Sekundär „Energieberater“, „Elektriker“ (je nach Markt).
3. Leistungen: Planung, Installation, Wartung, Speicher, Ladeinfrastruktur, Contracting.
4. Beschreibung (750 Zeichen): Lokalisiert, USPs, Call-to-Action.
5. Öffnungszeiten: Montag–Freitag 08:00–18:00, Notfall-Hotline (24/7) optional.
6. Telefonnummer: Lokale Vorwahl (z. B. Berlin +49 30 …), Tracking via CallRail.
7. Website-URL: Direkter Link zur Landingpage (z. B. `/standorte/berlin`).
8. Produkte: „Photovoltaik Komplettpaket“, „Solar-Contracting“, „Batteriespeicher“ (mit Preis-spanne).
9. Bilder/Videos: Mind. 10 Medien (Außenansicht, Team, Anlagen, Infografiken).
10. FAQ: 5 Fragen (siehe FAQ Backlog), Antworten mit Keywords & Lokalbezug.
11. Beiträge: Wöchentlich 1 Post (Fördernews, Referenzen, Event).
12. Nachrichtenfunktion: Aktivieren, Antwortzeit <24h.
13. Reviews: Ziel 10 neue Bewertungen/Sprint, Antworten mit Keywords.

## Priorisierte Verzeichnisse (DACH)

### Deutschland
- Google Business Profile (bereits im Fokus)
- Bing Places
- Apple Business Connect
- Das Örtliche, Gelbe Seiten, 11880.com
- Wer liefert was
- Energie-Verbände: BSW Solar, Bundesverband Solarwirtschaft Branchenbuch
- Industrie & Handelskammern: IHK Berlin, München, Frankfurt
- ProvenExpert, Trustpilot

### Österreich
- Herold.at
- FirmenABC.at
- wogibtswas.at
- oesterreichsenergie.at (Mitgliederverzeichnis)
- Firmenverzeichnis Wirtschaftskammer

### Schweiz
- local.ch
- search.ch
- Swissfirms.ch
- energie-agentur.ch (Partnerdatenbank)
- Energy 360° Partnernetzwerk

## NAP-Template (Beispiel Berlin)
```
Unternehmensname: ZOE Solar GmbH – Berlin
Adresse: Friedrichstraße 79, 10117 Berlin, Deutschland
Telefon: +49 30 520 010 880
E-Mail: berlin@zoe-solar.de
Website: https://www.zoe-solar.de/standorte/berlin
Öffnungszeiten: Mo–Fr 08:00–18:00
Kurzbeschreibung: ZOE Solar plant, finanziert und betreibt maßgeschneiderte Photovoltaiklösungen für Gewerbe und Industrie in Berlin. Von der Analyse über die Installation bis zur Wartung – alles aus einer Hand.
```

## Tracking & Reporting
- UTM-Schema: `utm_source=google&utm_medium=organic&utm_campaign=gbp-[stadt]`
- GA4: Ereignis „GBP Lead“ (Formular, Telefonklick, Chatstart)
- Call Tracking: CallRail / Placetel mit Standortnummern
- KPI Dashboard Erweiterung (Sven): GBP Insights, Verzeichnis-Referrals, Kartenklicks

## Risiken & Mitigation
| Risiko | Wahrscheinlichkeit | Auswirkung | Gegenmaßnahme |
| --- | --- | --- | --- |
| Verifizierungsprobleme bei neuen Standorten | Mittel | Mittel | Dokumente (Mietvertrag, Rechnungen) vorbereiten, Video-Verification Slots blocken. |
| Inkonsistente NAP-Daten (alte Einträge) | Hoch | Hoch | Excel-Tracker mit Historie, wöchentliche Kontrolle via Whitespark/Moz Local. |
| Negative Reviews | Mittel | Mittel | Response-Playbook, Service Recovery Ticket in Jira. |
| Ressourcen für Content-Produktion | Mittel | Mittel | Asset-Pool (Fotos, Videos) zentral, ggf. Freelancer. |

## Deliverables (Sprint 1)
- 10 optimierte GBP-Einträge mit aktuellen Medien & FAQ.
- Verzeichnisse: min. 15 aktualisierte Einträge (Screenshot & URL in Tracker).
- KPI-Report (Looker Studio) mit GBP Insights.
- Dokumentation der Citations (Google Sheet, Link im Task Board).

---
_Bitte Änderungshistorie im Task Board notieren und Assets in `Drive/Marketing/GBP` ablegen._
