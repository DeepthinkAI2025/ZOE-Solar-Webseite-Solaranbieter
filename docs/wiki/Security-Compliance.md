# Security & Compliance

Dieses Dokument fasst Sicherheitsmaßnahmen, Datenschutzrichtlinien und Compliance-Anforderungen für ZOE Solar zusammen.

## Sicherheitsprinzipien

1. **Least Privilege**: Service Accounts und API Keys erhalten nur notwendige Rechte.
2. **Defense in Depth**: Mehrschichtige Kontrollen (Auth, Validation, Monitoring).
3. **Security by Design**: Sicherheitsanforderungen früh im Entwicklungsprozess berücksichtigen.

## Zugriffskontrolle

- **API Access**: `ADMIN_API_KEY` Pflicht für sämtliche `/api/v1/*` Endpunkte.
- **Deployment Secrets**: In GitHub Actions und Hosting-Providern als Secret Variables hinterlegt.
- **Repositories**: GitHub Branch Protection + Review Policy (min. 1 Reviewer).

## Daten- & Datenschutz

- Personenbezogene Daten (Leads) werden nur summarisch gespeichert; detaillierte CRM-Integration (HubSpot) ist Backlog.
- Newsletter-Opt-in muss Double Opt-In Verfahren (Backlog) unterstützen.
- Datenschutzerklärung (`pages/DatenschutzPage.tsx`) regelmäßig aktualisieren.
- Cookies: `CookieConsentBanner.tsx` bietet Opt-in Mechanismus (Analytics Tracking optional).

## Transport & Speicherung

- HTTPS erzwingen (HSTS). Hosting-Anbieter: Vercel/Render unterstützt automatisches TLS.
- Backend-API sollte TLS-Zertifikat via Reverse Proxy erhalten (z. B. Cloudflare, Nginx).
- Daten in `data/` enthalten keine sensiblen Details; trotzdem git-ignored Backups (`data/private/` → `.gitignore`).

## Abhängigkeiten & Supply Chain

- `npm audit` regelmäßig ausführen, kritische CVEs priorisiert patchen.
- Renovate/Bot (Backlog) für automatische Dependency Updates.
- Vertraue nur auf signierte oder reputationsstarke Pakete.

## Protokollierung & Monitoring

- Security relevante Events (fehlgeschlagene Logins, API Errors) mit Severity flaggen.
- Slack Alerts für `severity >= warning`.
- Backlog: SIEM Anbindung (Elastic/Splunk) für zentrale Auswertung.

## Compliance-Anforderungen

- **DSGVO**: Consent Management, Datenminimierung, Auskunftsrecht.
- **BDSG**: Auftragsverarbeitung mit Dienstleistern klar regeln.
- **EEG/EnWG**: Für Inhalte rund um PV Förderungen rechtliche Prüfungen einplanen (Marketing).
- **Accessibility**: BITV 2.0 / WCAG 2.1 AA einhalten (staatliche Kunden).

## Sicherheit in der Entwicklung

- Statische Code Analyse (ESLint Security Plugins) integrieren.
- Secrets nie im Code oder in Commits speichern.
- Pull Requests mit Security Checklist (Template `docs/templates/pr-security-check.md`).

## Incident Response

1. Incident identifizieren (Alert, Report).
2. Incident Commander bestimmen.
3. Sofortmaßnahme (z. B. API Key rotieren, Endpoint deaktivieren).
4. Analyse & Dokumentation (`docs/templates/incident-report.md`).
5. Post Mortem durchführen, Tasks ableiten.

## Verbesserungs-Backlog

- 🔄 Web Application Firewall (Cloudflare WAF) aktivieren.
- 🔄 Security Headers automatisieren (`helmet` Konfiguration erweitern).
- 🔄 Penetrationstests (jährlich) mit externem Anbieter.
- 🔄 Privacy Automation (DSR Requests, Consent Logs).

---
_Stand: 26.09.2025_