# ZOE Solar Projekt-Wiki

Willkommen im zentralen Wissenshub für das ZOE Solar Ökosystem. Diese Seiten bündeln Produktvision, Architektur, SEO-Strategie und Betriebsleitfäden, damit Teams schnell Entscheidungen treffen und Maßnahmen umsetzen können.

## Schnelleinstieg
- **Neu hier?** Lies zuerst [[Architecture]] und [[SEO-Automation]], um das Fundament zu verstehen.
- **Go-to-Market & Content:** Alle Wachstums- und Content-Playbooks findest du unter [[Content-Playbook]].
- **Betrieb & Monitoring:** Für Deployments, Umgebungen und KPI-Tracking siehe [[Operations]].

## Wichtige Assets
- **Produkt-Demo & Screenshots:** Siehe `README.md` Abschnitt „Produktgalerie“.
- **Roadmap & Backlog:** Siehe `docs/seo-aeo-taskboard.md` und `docs/seo-geo-aeo-strategy.md`.
- **Automatisierungen & Skripte:** `scripts/` Verzeichnis (Node/TypeScript basierte Tooling-Sammlung).

## Rollen-Orientierung
- **Growth & SEO:** Fokus auf strukturierte Daten, GEO/AEO Automatisierung, Content-Briefs.
- **Engineering:** React/Vite Frontend, Express Backend, Infrastruktur für Monitoring & APIs.
- **Business Ops:** Partnerprogramme, Pricing, Admin-Dashboard & Kundenportal.

## Beiträge & Governance
- Änderungen bitte als Pull Request ins Hauptrepo und anschließend in die Wiki-Repo spiegeln.
- Halte Seiten kurz, verlinke tiefe Hintergrundinfos in den bestehenden `docs/`-Markdowns.
- Nutze KaTeX für Formeln (`$...$`), Tabellen für Vergleichsmatrizen und Checklisten für SOPs.

## GitHub-Wiki synchronisieren
1. Klone das Wiki-Repo separat:
   ```bash
   git clone https://github.com/DeepthinkAI2025/ZOE-Solar-Webseite-Solaranbieter.wiki.git
   ```
2. Prüfe den Sync zunächst ohne Änderungen:
   ```bash
   npm run wiki-sync -- --dry-run
   ```
3. Führe den Sync aus (optional mit `--wiki-dir <pfad>` oder `--no-clean`):
   ```bash
   npm run wiki-sync
   ```
4. Commit & Push im Wiki-Repo:
   ```bash
   git add .
   git commit -m "Sync wiki"
   git push
   ```
5. Pflege erfolgt weiterhin im Code-Repo; synce das Wiki nach größeren Änderungen.

---
_Stand: 26.09.2025 – bitte bei inhaltlichen Updates die Versionsnotiz ergänzen._
