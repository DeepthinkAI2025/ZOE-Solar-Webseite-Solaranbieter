# Testing & QA Leitfaden

Dieser Leitfaden beschreibt Qualitätsstandards, Testpyramide und verfügbare Tools für das ZOE Solar Projekt.

## Testpyramide

| Ebene | Ziel | Tooling |
| --- | --- | --- |
| Unit Tests | Logik, Helper, Hooks | `vitest`, `@testing-library/react` |
| Integration | Komponenten + Services | `vitest` + Mocks, `msw` | 
| End-to-End | Nutzerflüsse, Funnels, Formulare | Playwright (Planung) |
| Monitoring | Produktiv-Monitoring, Regression | Lighthouse CI, Search Console Alerts |

## Setup & Scripts

- `npm run test`: Führt Vitest im Watch-Modus aus.
- `npm run test:ci`: Headless Tests ohne Watch.
- `npm run lint`: ESLint + TypeScript Checks.
- `npm run typecheck`: TS Compiler im Strict Mode.
- Backlog: `npm run e2e` (Playwright) + `npm run visual` (Chromatic) integrieren.

## Unit Test Guidelines

- Legt Tests im selben Verzeichnis ab (`Component.test.tsx` oder `__tests__`).
- Verwende `@testing-library/react` für Interaktionen (`screen`, `fireEvent` / `userEvent`).
- Mock externe Abhängigkeiten (API-Requests, LocalStorage) über `vitest.mock`.
- Beispiel:
  ```tsx
  import { render, screen } from '@testing-library/react';
  import { Hero } from './Hero';

  it('zeigt CTA', () => {
    render(<Hero />);
    expect(screen.getByRole('button', { name: /angebot/i })).toBeVisible();
  });
  ```

## Integrationstests

- `msw` (Mock Service Worker) ermöglicht API-Stubbing im Test.
- Beispiele: `AIChatFunnel` mit Mock-Antworten, `Calculator` mit realen Formeln.
- Strukturvorschlag: `__tests__/integration/<feature>.test.ts`.

## End-to-End Tests (Backlog)

- Playwright-Konfiguration in Planung (`playwright.config.ts`).
- Priorisierte Szenarien:
  1. Lead Funnel (AI Chat → Kontaktformular).
  2. Produktvergleich (Tray + Modal -> Terminbuchung).
  3. Standortseiten (SEO-Metadaten, Richtungslinks).

## QA-Checklisten

1. **Story QA (vor Merge):**
   - ✔️ Lighthouse Mobile/Desk > 90
   - ✔️ Keine Console Errors
   - ✔️ SEO Manager liefert erwartete Title/Description
   - ✔️ Responsives Verhalten getestet (Chrome DevTools Presets)
2. **Regression (vor Release):**
   - ✔️ `npm run build`
   - ✔️ Smoke Tests auf Staging
   - ✔️ Search Console & GA4 Monitoring aktiv

## Accessibility (A11y)

- Verwende `@axe-core/react` (optionaler Dev Hook) für WCAG Checks.
- Test Cases: Navigation per Tastatur, Screenreader (NVDA/VoiceOver), Farbkontrast.
- Dokumentiere Findings im QA-Template (`docs/templates/qa-report.md`).

## Daten- & Inhaltsprüfungen

- JSON-Daten über `scripts/validate-data.ts` (Backlog) prüfen.
- Manuelle Checks: Price Tables, Regionale Inhalte, CTA-Links.

## Bug Management

- Bugs via GitHub Issues oder Linear tracken (Integration möglich).
- Severity Levels:
  - **P0:** Blocker/Outage (Sofortige Behebung, Hotfix Branch)
  - **P1:** Kritische Funktion beeinträchtigt (Sprint Hotfix)
  - **P2:** UI/Content Fehler (nächster Sprint)

## Kontinuierliche Verbesserung

- 🔄 Automatisiertes Lighthouse CI über GitHub Actions.
- 🔄 Visual Regression mit Chromatic/Screenshot-Diff.
- 🔄 API Contract Tests (Prism oder Dredd) zur Sicherstellung der Backend-Kompatibilität.

---
_Stand: 26.09.2025_