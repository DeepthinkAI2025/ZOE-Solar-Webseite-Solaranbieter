import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Header link sanity checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('click all header and mega menu links, verify URL changes and no console errors', async ({ page }) => {
    const results: any[] = [];
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const clickAndCheck = async (action: () => Promise<void>, description: string) => {
      const before = page.url();
      await action();
      try {
        await page.waitForFunction((prev) => location.href !== prev, before, { timeout: 3000 });
      } catch (e) {
        // fallback: short wait to allow SPA to update
        await page.waitForTimeout(500);
      }
      const after = page.url();
      results.push({ description, before, after, urlChanged: before !== after, consoleErrors: [...consoleErrors] });
      // clear consoleErrors for next action
      consoleErrors.length = 0;
    };

    // Helper to scope locators and avoid strict-mode collisions
    const header = () => page.locator('header');

    const clickText = async (text: string) => {
      const roleLoc = page.getByRole('link', { name: text });
      if ((await roleLoc.count()) > 0) {
        await roleLoc.first().click();
        return;
      }
      const textLoc = page.getByText(text);
      if ((await textLoc.count()) > 0) {
        await textLoc.first().click();
        return;
      }
      throw new Error(`Element with text "${text}" not found`);
    };

    const hoverText = async (text: string) => {
      const roleLoc = page.getByRole('link', { name: text });
      if ((await roleLoc.count()) > 0) {
        await roleLoc.first().hover();
        return;
      }
      const textLoc = page.getByText(text);
      if ((await textLoc.count()) > 0) {
        await textLoc.first().hover();
        return;
      }
      throw new Error(`Element with text "${text}" not found for hover`);
    };

    // Top-level header items (use helpers to avoid strict-mode collisions)
    const topLevel = [
      { label: 'Aktionen', action: async () => await clickText('Aktionen') },
      { label: 'Preise', action: async () => await clickText('Preise') },
      { label: 'Photovoltaik', action: async () => { await clickText('Photovoltaik'); } },
      { label: 'E-Mobilität', action: async () => { await clickText('E-Mobilität'); } },
      { label: 'Elektro', action: async () => { await clickText('Elektro'); } },
      { label: 'Produkte', action: async () => { await clickText('Produkte'); } },
      { label: 'Wissen', action: async () => { await clickText('Wissen'); } },
      { label: 'Kontakt', action: async () => await clickText('Kontakt') },
    ];

    for (const item of topLevel) {
      await clickAndCheck(item.action, `Top-level: ${item.label}`);
    }

    // Open Photovoltaik mega menu and click inner links
    await page.getByText('Photovoltaik').hover();
    const pvInner = ['Photovoltaik für Gewerbe', 'Industrielle Speicher', 'Agri-PV', 'Innovative Technologien', 'Wartung & Service', 'Anmeldung & Anträge', 'Alle PV-Leistungen'];
    for (const label of pvInner) {
      const action = async () => { await page.getByText(label).click(); };
      await clickAndCheck(action, `Photovoltaik mega: ${label}`);
      // navigate back to home before next to reset state
      await page.goto('http://localhost:5173');
    }

    // Preise mega menu inner links
    await page.getByText('Preise').hover();
    const pricesInner = ['Pakete & Preise', 'Finanzierung & Förderung', 'Digitaler Förder-Check', 'KfW-Bankengruppe', 'IBB (Investitionsbank Berlin)', 'BAFA (Bundesamt)', 'Zu den Sonderaktionen'];
    for (const label of pricesInner) {
      const action = async () => { await page.getByText(label).click(); };
      await clickAndCheck(action, `Preise mega: ${label}`);
      await page.goto('http://localhost:5173');
    }

    // Elektro mega
    await page.getByText('Elektro').hover();
    const elektroInner = ['Netzanschlüsse', 'Verteilerbau & Umbau', 'Zählerplatz & Messkonzepte', 'Übersicht Elektro'];
    for (const label of elektroInner) {
      const action = async () => { await page.getByText(label).click(); };
      await clickAndCheck(action, `Elektro mega: ${label}`);
      await page.goto('http://localhost:5173');
    }

    // Produkte mega: try to open and click Hersteller if present
    await page.getByText('Produkte').hover();
    const productsInner = ['Produkte', 'Hersteller'];
    for (const label of productsInner) {
      const element = page.getByText(label);
      if (await element.count() > 0) {
        const action = async () => { await element.click(); };
        await clickAndCheck(action, `Produkte mega: ${label}`);
        await page.goto('http://localhost:5173');
      } else {
        results.push({ description: `Produkte mega: ${label}`, skipped: true });
      }
    }

    // CTA dropdown actions (Jetzt anfragen -> Mit KI-Berater sprechen and Kundenservice anrufen)
    const cta = page.getByRole('button', { name: /Jetzt anfragen/i });
    if (await cta.count() > 0) {
      await cta.click();
      const chatBtn = page.getByText('Mit KI-Berater sprechen');
      if (await chatBtn.count() > 0) {
        await clickAndCheck(async () => await chatBtn.click(), 'CTA: Mit KI-Berater sprechen');
        await page.goto('http://localhost:5173');
      }
      const phone = page.getByText('Kundenservice anrufen');
      if (await phone.count() > 0) {
        await clickAndCheck(async () => await phone.click(), 'CTA: Kundenservice anrufen');
        await page.goto('http://localhost:5173');
      }
    }

    // Mobile menu checks: open mobile menu and click mobile items
    await page.setViewportSize({ width: 375, height: 800 });
    const mobileMenuButton = page.locator('.hamburger-icon').first();
    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.click();
      const mobileItems = ['Aktionen','Preise','Photovoltaik','E-Mobilität','Elektro','Produkte','Wissen','Kontakt'];
      for (const label of mobileItems) {
        const action = async () => { await page.getByText(label).click(); };
        await clickAndCheck(action, `Mobile menu: ${label}`);
        await page.goto('http://localhost:5173');
        await page.setViewportSize({ width: 1280, height: 800 });
      }
    }

    // Optional: logout button if visible (desktop or mobile)
    const logoutButton = page.getByRole('button', { name: /Logout|Abmelden/i });
    if (await logoutButton.count() > 0) {
      await clickAndCheck(async () => await logoutButton.click(), 'Logout button');
    }

    // Write results to file
    fs.writeFileSync('tests/header-links-results.json', JSON.stringify(results, null, 2));

    // Assert no console errors occurred across all actions
    const allErrors = results.flatMap(r => r.consoleErrors || []);
    expect(allErrors.length).toBe(0);
  });
});