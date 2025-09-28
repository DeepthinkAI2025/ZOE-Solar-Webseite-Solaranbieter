# FAQ & Speakable Backlog – Sprint 1

_Aktualisiert: 25. September 2025_

## Ziele
- FAQ-Datenbank von 6 → 25 kuratierte Fragen ausbauen (Coverage: Technik, Wirtschaftlichkeit, Betrieb, Förderung, Verträge, Versicherung, Region).
- Speakable-/FAQ-JSON-LD selektiv erweitern (Startseite, Pillar Pages, regionale Landingpages).
- Konsistente Pflege über `data/faqData.ts`, `seoConfig.ts`, Komponenten (`FAQ`, `FAQPage`).

## Aufgabenübersicht

| Status | Typ | Beschreibung | Owner | Zieltermin |
| --- | --- | --- | --- | --- |
| To Do | Datenpflege | `FaqCategory`-Union erweitern (`'Förderung'`, `'Betrieb'`, `'Finanzierung'`, `'Region'`). Anpassung in `components/FAQ.tsx`, `seoConfig.ts`. | Markus | 30.09 |
| To Do | Content | Neue FAQ-Einträge (siehe unten) in `data/faqData.ts` einpflegen, Glossarlinks setzen. | Jasmin | 04.10 |
| To Do | Speakable | `buildSpeakableSchema` um neue Selektoren für Pillar Page (`.pillar-intro`, `.pillar-keyfacts`) erweitern. | Markus | 02.10 |
| To Do | Region | Regionale FAQ-Filter in Landingpage-Template implementieren (Prop `region="Berlin"`). | David | 07.10 |
| In Progress | Content | FAQ-Research Top 20 Kundenfragen (Sales/Support Logs) → Rohfassung in Google Docs. | Jasmin | 29.09 |
| In Progress | Analyse | AI Prompt Monitoring (Lara) → identifizierte Fragen als Input für FAQ/Speakable aufnehmen. | Lara | 01.10 |
| Done | Planung | Backlog erstellt, Prioritäten gesetzt. | Lara | 25.09 |

## Priorisierte FAQ-Einträge (Ready for Dev)

### Kategorie: Förderung & Finanzierung
1. **Welche Förderprogramme stehen 2025 für Unternehmen in Berlin zur Verfügung?**  
   _Antwort (Kurz):_ Kombination aus IBB-Energie, Bundesförderung effiziente Gebäude, steuerliche Sonderabschreibung nach §7c EStG. Hinweis auf Fördermittel-Check.  
   _Quellen:_ BMWK, IBB, DATEV Steuertipps.  
   _Zielseiten:_ Berlin Landingpage, Fördermittel-Hub.  

2. **Wie funktioniert das PPA-Modell (Power Purchase Agreement) mit ZOE Solar?**  
   _Antwort:_ Laufzeit 10–15 Jahre, Strompreis fix indexiert, inkl. Wartung. 

3. **Welche steuerlichen Effekte bringt eine PV-Anlage für Gewerbekunden?**  
   _Antwort:_ §3 Nr. 72 EStG, Vorsteuerabzug, Sonder-AfA, Gewerbesteuerreduktion.

### Kategorie: Technik & Betrieb
1. **Welche Monitoring-Lösung setzt ZOE Solar ein und wie können Betreiber zugreifen?**  
   _Antwort:_ SCADA Plattform + App, 24/7 Monitoring, Alarmierung via SMS/Mail.

2. **Wie werden Brandschutz und Abschaltkonzepte umgesetzt?**  
   _Antwort:_ Feuerwehrschalter, DIN VDE 0100-712, Dachzugangskonzept, Schulung Feuerwehr.

3. **Welche Wartungsintervalle gelten für Dach- vs. Freiflächenanlagen?**  
   _Antwort:_ Jährliche Inspektion, Thermographie halbjährlich, Vegetationsmanagement.

4. **Wie integriert ihr Batteriespeicher in bestehende EMS-Systeme?**  
   _Antwort:_ Schnittstellen Modbus/TCP, Lastgang-Analyse, Peak-Shaving. 

### Kategorie: Verträge & Risikomanagement
1. **Welche Garantien gibt ZOE Solar auf Module, Wechselrichter und Montage?**  
   _Antwort:_ Produkt 12–25 Jahre, Leistung 25/30 Jahre, Montage 10 Jahre, SLA 99 %. 

2. **Wie ist die PV-Anlage versichert und welche Policen sind notwendig?**  
   _Antwort:_ Elektronikversicherung, Betriebsunterbrechung, Betreiberhaftpflicht, optional Cyber. 

3. **Was passiert am Ende eines Contracting-Laufzeit?**  
   _Antwort:_ Optionen Buy-Out, Verlängerung, Dekommissionierung.

### Kategorie: Regionale Fragen (Berlin, München, Zürich)
1. **Welche Genehmigungen brauche ich in Berlin für eine Dach-PV?**  
   _Antwort:_ Anzeige beim Bauamt (vereinfachtes Verfahren), Brandschutzkonzept, Denkmalschutzprüfung bei Altbau.  
2. **Welche Besonderheiten gelten in München (Schneelast, Blitzschutz)?**  
   _Antwort:_ Statik nach DIN 1055, Schneefangsysteme, Blitzschutzklasse II.  
3. **Wie läuft der Netzanschlussprozess mit ewz/Energie 360° in Zürich?**  
   _Antwort:_ Anmeldung Pronovo, Netzanschlussgesuch, Abnahme durch ewz. 

### Kategorie: Nachhaltigkeit & ESG
1. **Wie viel CO₂ sparen Unternehmen mit einer 1 MWp Anlage?**  
   _Antwort:_ ~520 t CO₂/a (DE Mix 2025), Querverweis CO₂-Rechner. 

2. **Wie unterstützt ZOE Solar bei CSRD-Reporting?**  
   _Antwort:_ Datenexporte (kWh, CO₂), ESG-Kennzahlen, Audit-Dokumentation.

## Speakable Erweiterungen
- **Startseite:** `.hero-headline`, `.hero-pitch`, `.testimonial-highlight`.
- **Pillar Page „Photovoltaik Komplettpaket“:** `.pillar-intro`, `.pillar-benefits`, `.pillar-faq`.
- **Region Landingpages:** `.region-lead`, `.region-offer`, `.region-faq`.
- **FAQPage:** Top 5 Fragen als Speakable (Kategorie Anbieterwahl & Wirtschaftlichkeit).

## Umsetzungsschritte
1. Categories erweitern → Testen (`npm run build`).  
2. FAQ-Einträge in `faqData.ts` ergänzen (Markdown-Bold für Glossar Begriffe: `**Eigenverbrauch**`).  
3. `seoConfig.buildFaqSchema` auf neue Kategorien ausrichten (z. B. Parameter `categories`).  
4. Speakable-Selektoren in `seoConfig` aktualisieren, Tests via Rich Results.  
5. Dokumentation im Task Board (Status-Update) & QA durch Lara.

---
_Bitte nach jedem Deployment Schema-Screenshots im Monitoring-Ordner ablegen._
