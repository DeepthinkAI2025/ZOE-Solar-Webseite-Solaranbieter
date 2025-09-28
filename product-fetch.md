# Produktdaten-Workflow & Status

*Stand: 28.09.2025*

## 1. Standard-Workflow & Werkzeuge

### 1.1 Automatisierter Dokumenten-Harvest
- Primärer Einstieg: `npm run product-docs:harvest -- --force`. Ohne `--apply` läuft der Prozess im Dry-Run und legt pro Durchlauf eine JSON-Zusammenfassung unter `tmp/doc-harvest/` ab.
- Mit `--apply` werden gefundene Hersteller-PDFs (Datasheets, Installationsanleitungen, Garantien/Broschüren) automatisch in `server/storage/products.live.json` zusammengeführt.
- `--manufacturer=<slug1,slug2>` begrenzt den Lauf auf ausgewählte Hersteller. `--limit=<n>` stoppt nach _n_ Produkten, `--minimal` reduziert die Suchprompts für schnelle Spot-Checks.
- `--force` bleibt Standard, damit auch bereits gepflegte Produkte regelmäßig neu synchronisiert werden.
- Bei Tavily-Limits: `.env` prüfen (API-Key, Limit), ggf. Wartezeit oder erneuter Lauf nach Limit-Reset. Das Skript gibt Warnungen aus, wenn mehr als 20 URLs gekürzt werden mussten.

### 1.2 Daten validieren & Downloads prüfen
- Jede URL muss direkt vom Hersteller oder einer offiziellen Subdomain stammen. Verdächtige Domains aussortieren.
- PDFs stichprobenartig öffnen (Inhalt, Sprache, Versionsnummer). Bei Änderungen bitte Varianten vergleichen und ggf. ältere Links ersetzen.
- Für Bilder weiterhin Medienportale/Pressekits der Hersteller verwenden; Eigen-Downloads zentral unter `public/assets/manufacturers/<slug>/` ablegen.

### 1.3 Produktdatenbank pflegen
- Quelle für Livesystem: `server/storage/products.live.json`.
  - Felder `specs`, `keyFeatures`, `datasheetUrls`, `installationManualUrls`, `additionalDocumentUrls`, `documents`, `imageUrl` konsistent halten.
  - Sichtprüfung auf Duplikate, veraltete Preise (`basePrice`) oder fehlende Garantietexte.
- JSON-Validierung nach jeder Änderung:
  ```bash
  node -e "JSON.parse(require('fs').readFileSync('server/storage/products.live.json','utf8')); console.log('OK')"
  ```

### 1.4 API- & Frontend-Prüfung
- Backend starten (`npm run server`) und API prüfen:
  ```bash
  curl http://localhost:5001/api/products/live | jq '.'
  ```
- Frontend mit `npm run dev` testen (Dokumenten-Links, Modal-Ansichten, Bilder, Preise, Filterfunktionen).

### 1.5 Dokumentation & Legacy-Fallback
- Änderungen und offene Punkte hier im Dokument nachtragen.
- Der frühere manuelle Workflow (`tmp/manual-tavily.js` + `tmp/process-tavily-results.js`) liegt archiviert unter `tmp/legacy/`. Die alten Einstiegspunkte geben nur noch Warnungen aus. Bitte nur im Ausnahmefall nutzen.
- Historische Firecrawl-/Scraping-Ansätze (z. B. `Dockerfile.firecrawl`) sind aktuell außer Betrieb und können bei Bedarf entfernt oder als Referenz belassen werden.

## 2. Abdeckung nach Hersteller (Dokumente)

Die wichtigsten Kennzahlen stammen aus `products.live.json`. „Vollständig“ bedeutet: jedes Produkt besitzt mindestens ein Datasheet, eine Installationsanleitung und ein Zusatzdokument.

### 2.1 Vollständige Dokumentabdeckung
Altenergy Power System, Alumero, APSystems, Darfon, E3/DC, Fronius, Ginlong, Huawei, IBC Solar, JA Solar, Jinko Solar, KACO new energy, LONGi Solar, Magnum Energy, Meyer Burger, Mounting Systems, OutBack Power, Q CELLS (aktuelles Einzelprodukt), REC Solar, Renusol, Schletter Group, Schneider Electric, Selectronic Australia, SMA Solar Technology, SolarEdge Technologies, Sunpro Solar, Trina Solar, Tigo Energy, Varta Storage, Würth Solar, Xantrex.

**Hinweis:** Trotz vollständiger Dokumentlage fehlen bei vielen dieser Marken noch Bildmaterial, Preiskorrekturen und ggf. Lokalisierungen (siehe Abschnitt 2.4).

### 2.2 Teilabdeckung – Nacharbeiten notwendig
- **ABB** – 5 Produkte, 3× Datasheets, 2× Manuals; zusätzliche Unterlagen ergänzen.
- **BYD Energy** – HVS/HVM hat noch keine Manual-Links; Speicherportfolio erweitern.
- **Canadian Solar** – Datasheets fehlen, Manuals vorhanden; neue Harvest-Läufe auf passende Domains einschränken.
- **Chilicon Power** – Eine Produktlinie ohne vollständiges Dokumentset.
- **Esdec** – FlatFix Eco/Fusion ohne Datasheet; Domain-Filter schärfen.
- **Growatt** – Drei Geräte ohne Manuals/Garantien.
- **K2 Systems** – Für „Base Rail“ noch kein Datasheet.
- **Krinner** – Zusätzliche Dokumente fehlen (z. B. Garantien, Statik-Unterlagen).
- **LG Chem** – Aktuell gar keine Dokumente eingetragen; RESU-Programm vollständig nachpflegen.
- **Panasonic** – Nur ein Datasheet verlinkt; komplette Produktpalette einpflegen.
- **Sonnen** – Noch keine Dokumente verknüpft (ecoLinx & sonnenBatterie-Serien).
- **Studer Innotec** – Manuals/Datasheets nicht für alle Xtender-Modelle vorhanden.
- **Sungrow** – Teilweise fehlende Datasheets.
- **SunPower** – Datenblätter noch offen, obwohl alte Legacy-Dokumente vorliegen.
- **Tesla Energy** – Datasheet für Powerwall doppelt prüfen; Installation Manual vorhanden.
- **Victron Energy** – Zusatzdokumente (Garantien, Zertifikate) ergänzen.

### 2.3 Keine verlässlichen Dokumente hinterlegt
Aktuell nur **LG Chem** (siehe oben). Wenn weitere Hersteller ohne Dokumente auftauchen, bitte hier ergänzen.

### 2.4 Bildmaterial & Preise
- Für die meisten Marken fehlen weiterhin geprüfte Bildquellen sowie aktualisierte Preise. Bitte parallel zum Dokumenten-Harvest Bilder sammeln (Lizenzstatus klären) und `basePrice` nur setzen, wenn eine verifizierbare Preisquelle vorliegt.

## 3. Portfolio-Lücken & Priorisierte Ergänzungen
- **Huawei** – `data/manufacturers/huawei.ts` enthält keine Produkte. In `products.live.json` existieren jedoch Speicher und Wechselrichter. Überarbeiten (inkl. Backup Box, Luna-Serie, Smart String Lösungen) und Kategorien erweitern (`Speicher`, `Notstrom`, `Wechselrichter`).
- **Fronius, SMA, Sungrow, Growatt** – In `data/manufacturers/*.ts` fehlen viele Produkte und Specs. Abgleich mit Live-Daten und Herstellerkatalogen vornehmen.
- **BYD, Tesla, Sonnen** – Speicherportfolio ausbauen (z. B. BYD HVL, Tesla Backup Gateway, SonnenProtect).
- **Unterkonstruktion & Optimierer** – Daten in `data/manufacturers` nachziehen (Renusol, Schletter, Tigo etc.), damit Frontend & API einheitliche Produktlisten nutzen.

## 4. Neue Kategorien & Hersteller-Roadmap
- **Wärmepumpen-Kategorie**
  - Datenmodell erweitern (`types.ts`, passende Komponenten) und mindestens einen Hersteller (z. B. Viessmann, Bosch, Daikin) samt 2–3 Produkten hinzufügen.
  - UX-Anpassungen prüfen (Filter, Navigation, Landing-Pages).
- **Smart-Meter & Energiemanagement**
  - Hersteller identifizieren (z. B. EMH, Landis+Gyr, Discovergy, Janitza) und Grunddaten/Produkte aufnehmen.
  - Kategorie in Navigation und Datenmodell etablieren.
- **Quellenharmonisierung**
  - `data/manufacturers`, `products.generated.ts` und `products.live.json` auf denselben Umfang bringen. Langfristig Single Source festlegen (empfohlen: `products.live.json` + Automatisierung).

## 5. Legacy-Skripte & Aufräumarbeiten
- Manuelle Tavily-Skripte liegen jetzt unter `tmp/legacy/`; die alten Wrapper warnen bei Ausführung. Bei nächster Aufräumrunde können die Legacy-Dateien komplett entfernt werden, falls kein Fallback mehr nötig ist.
- `Dockerfile.firecrawl` und ähnliche historische Artefakte sind aktuell ungenutzt. Entscheidung ausstehend, ob löschen oder als Dokumentation beibehalten.
- JSON-Dateien in `tmp/` (`manual-tavily-*.json`) enthalten alte Zwischenergebnisse. Bei Bedarf archivieren oder löschen, um Verwechslungen zu vermeiden.

## 6. Priorisierte To-Dos (Kurzfassung)
1. Fehlende Dokumente der Teilabdeckungen (Abschnitt 2.2) vervollständigen, beginnend mit ABB, BYD, Panasonic, Sonnen und Victron.
2. `data/manufacturers` mit den Live-Daten synchronisieren (Huawei, BYD, SMA, Fronius, Sungrow, Smart-Meter-Hersteller hinzufügen).
3. Wärmepumpen-Kategorie definieren und erste Hersteller/Produkte einpflegen.
4. Bildquellen & Preise für vollständig dokumentierte Marken nachziehen.
5. Alte Artefakte in `tmp/` und Firecrawl-Konfiguration prüfen und ggf. entfernen.

Bitte diesen Status bei Änderungen aktualisieren. So behalten wir den Überblick, welche Hersteller bereits sauber dokumentiert sind und wo Produktprogramme oder Kategorien noch erweitert werden müssen.
